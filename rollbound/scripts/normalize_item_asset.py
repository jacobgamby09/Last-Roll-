"""Technical alpha cleanup and nearest-neighbor normalization for item icons.

48x48 RGBA; max 36x36 art; bottom-exclusive baseline y=42 (last row 41),
matching all six existing equipment PNGs. Never overwrites a destination.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def normalize(source: Path, destination: Path, max_visible: int = 36,
              remove_checkerboard: bool = False, clear: list[tuple[int, int]] | None = None,
              colors: int = 32, neutral_min: int = 210, neutral_spread: int = 28) -> None:
    if destination.exists():
        raise ValueError(f"Refusing to overwrite existing asset: {destination}")
    if not 1 <= max_visible <= 36:
        raise ValueError("max_visible must be 1..36")
    art = Image.open(source).convert("RGBA")
    if remove_checkerboard:
        pixels = art.load()
        width, height = art.size
        queue = deque([(x, 0) for x in range(width)] + [(x, height - 1) for x in range(width)] +
                      [(0, y) for y in range(height)] + [(width - 1, y) for y in range(height)] + (clear or []))
        seen = set()
        while queue:
            x, y = queue.popleft()
            if not (0 <= x < width and 0 <= y < height) or (x, y) in seen:
                continue
            seen.add((x, y))
            r, g, b, a = pixels[x, y]
            if a == 0 or (min(r, g, b) >= neutral_min and max(r, g, b) - min(r, g, b) <= neutral_spread):
                pixels[x, y] = (0, 0, 0, 0)
                queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    art.putalpha(art.getchannel("A").point(lambda value: 255 if value >= 128 else 0))
    bounds = art.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError("No visible art")
    cropped = art.crop(bounds)
    scale = min(max_visible / cropped.width, max_visible / cropped.height)
    target = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    sprite = cropped.resize(target, Image.Resampling.NEAREST)
    # Tighten alpha after sampling so baseline is exact, even for narrow tips.
    sprite = sprite.crop(sprite.getchannel("A").getbbox())
    if colors:
        alpha = sprite.getchannel("A")
        sprite = sprite.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT,
                                                dither=Image.Dither.NONE).convert("RGBA")
        sprite.putalpha(alpha)
    canvas = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    canvas.alpha_composite(sprite, ((48 - sprite.width) // 2, 42 - sprite.height))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)
    print(f"{destination.name}: raw bbox={bounds}; RGBA 48x48; bbox={canvas.getchannel('A').getbbox()}; "
          f"alpha={sorted(set(canvas.getchannel('A').tobytes()))}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--max-visible", type=int, default=36)
    parser.add_argument("--remove-checkerboard", action="store_true")
    parser.add_argument("--clear", nargs=2, type=int, action="append", default=[])
    parser.add_argument("--colors", type=int, default=32)
    parser.add_argument("--neutral-min", type=int, default=210)
    parser.add_argument("--neutral-spread", type=int, default=28)
    args = parser.parse_args()
    normalize(args.source, args.destination, args.max_visible, args.remove_checkerboard,
              [tuple(point) for point in args.clear], args.colors, args.neutral_min, args.neutral_spread)
