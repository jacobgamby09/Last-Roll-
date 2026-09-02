"""Check the seven combat PNGs against the v1 canvas/alpha/size contract.

Run from rollbound: python scripts/verify_combat_assets.py
Requires Pillow, like the asset normalization scripts. Visual QA is still needed
for facing, silhouette readability and animation behavior in the live scene.
"""

from pathlib import Path

from PIL import Image


HEIGHT_BANDS = {
    "goblin": (56, 68),
    "bandit": (56, 68),
    "ogre": (56, 68),
    "elite-early": (68, 76),
    "elite-mid": (68, 76),
    "elite-late": (68, 76),
    "boss": (76, 80),
}
ASSET_DIR = Path(__file__).resolve().parents[1] / "src/assets/pixel/combat"


def main() -> None:
    for sprite_id, (minimum, maximum) in HEIGHT_BANDS.items():
        path = ASSET_DIR / f"{sprite_id}-v1.png"
        with Image.open(path) as art:
            if art.mode != "RGBA" or art.size != (64, 80):
                raise ValueError(f"{path.name}: expected 64x80 RGBA, got {art.size} {art.mode}")
            alpha = art.getchannel("A")
            if set(alpha.tobytes()) != {0, 255}:
                raise ValueError(f"{path.name}: expected true transparency and binary alpha")
            bounds = alpha.getbbox()
            if bounds is None or bounds[3] != 80:
                raise ValueError(f"{path.name}: silhouette must end at y=79")
            height = bounds[3] - bounds[1]
            if not minimum <= height <= maximum:
                raise ValueError(f"{path.name}: visible height {height} outside {minimum}..{maximum}")
            print(f"PASS {path.name}: RGBA 64x80, binary alpha, bbox={bounds}, height={height}")
    print("7/7 combat assets pass the v1 contract checks")


if __name__ == "__main__":
    main()
