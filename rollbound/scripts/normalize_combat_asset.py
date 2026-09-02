"""Normalize generated combat art to the 64x80 bottom-aligned sprite contract.

Uses nearest-neighbor only. An optional edge-connected light-neutral background
pass removes falsely baked checkerboards without deleting enclosed ivory details.
Explicit --clear points handle individually inspected background holes.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def normalize(source: Path, destination: Path, height: int, checkerboard: bool,
              clear: list[tuple[int, int]], colors: int) -> None:
    if destination.exists():
        raise ValueError(f"Refusing to overwrite an existing asset: {destination}")
    if not 1 <= height <= 80:
        raise ValueError("Visible height must be between 1 and 80")
    art = Image.open(source).convert("RGBA")
    if checkerboard:
        pixels = art.load()
        width, raw_height = art.size
        queue = deque([(x, 0) for x in range(width)] +
                      [(x, raw_height - 1) for x in range(width)] +
                      [(0, y) for y in range(raw_height)] +
                      [(width - 1, y) for y in range(raw_height)] + clear)
        seen = set()
        while queue:
            x, y = queue.popleft()
            if not (0 <= x < width and 0 <= y < raw_height) or (x, y) in seen:
                continue
            seen.add((x, y))
            r, g, b, a = pixels[x, y]
            if a == 0 or (min(r, g, b) >= 210 and max(r, g, b) - min(r, g, b) <= 28):
                pixels[x, y] = (0, 0, 0, 0)
                queue.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))

    alpha = art.getchannel("A").point(lambda value: 255 if value >= 128 else 0)
    art.putalpha(alpha)
    bounds = alpha.getbbox()
    if bounds is None:
        raise ValueError("No visible sprite")
    cropped = art.crop(bounds)
    target_width = round(cropped.width * height / cropped.height)
    if target_width > 64:
        raise ValueError(f"Silhouette too wide ({target_width}px) at {height}px high; regenerate instead of distorting")
    sprite = cropped.resize((target_width, height), Image.Resampling.NEAREST)
    if colors:
        mask = sprite.getchannel("A")
        rgb = sprite.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT,
                                            dither=Image.Dither.NONE).convert("RGBA")
        rgb.putalpha(mask)
        sprite = rgb
    canvas = Image.new("RGBA", (64, 80), (0, 0, 0, 0))
    canvas.alpha_composite(sprite, ((64 - target_width) // 2, 80 - height))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)
    print(f"{destination.name}: source {bounds}; RGBA {canvas.size}; alpha bbox "
          f"{canvas.getchannel('A').getbbox()}; alpha values {sorted(set(canvas.getchannel('A').tobytes()))}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--height", required=True, type=int)
    parser.add_argument("--remove-checkerboard", action="store_true")
    parser.add_argument("--clear", nargs=2, type=int, action="append", default=[])
    parser.add_argument("--colors", type=int, default=32)
    args = parser.parse_args()
    normalize(args.source, args.destination, args.height, args.remove_checkerboard,
              [tuple(point) for point in args.clear], args.colors)
