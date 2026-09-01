"""Normalize a transparent HUD sprite onto Rollbound's canonical 48×48 canvas."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def normalize(source: Path, destination: Path, max_visible: int = 36, alpha_floor: int = 8) -> tuple[int, int, int, int]:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    meaningful_alpha = alpha.point(lambda value: value if value >= alpha_floor else 0)
    image.putalpha(meaningful_alpha)
    bounds = meaningful_alpha.getbbox()
    if bounds is None:
        raise ValueError(f"No visible pixels in {source}")

    cropped = image.crop(bounds)
    scale = min(max_visible / cropped.width, max_visible / cropped.height)
    target_size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    sprite = cropped.resize(target_size, Image.Resampling.NEAREST)
    canvas = Image.new("RGBA", (48, 48), (0, 0, 0, 0))
    offset = ((48 - sprite.width) // 2, (48 - sprite.height) // 2)
    canvas.alpha_composite(sprite, offset)

    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)
    normalized_bounds = canvas.getchannel("A").getbbox()
    if normalized_bounds is None:
        raise ValueError(f"Normalization produced no visible pixels for {source}")
    return normalized_bounds


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--max-visible", type=int, default=36)
    parser.add_argument("--alpha-floor", type=int, default=8)
    args = parser.parse_args()
    bounds = normalize(args.source, args.destination, args.max_visible, args.alpha_floor)
    print(f"saved {args.destination} with alpha bounds {bounds}")


if __name__ == "__main__":
    main()
