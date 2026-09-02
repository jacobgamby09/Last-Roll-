"""Validate canonical gear/consumable PNG dimensions, alpha, baseline and uniqueness."""
from hashlib import sha256
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "src/assets/pixel"
FAMILIES = {
    "equipment": ["wood-club","rusted-sword","cloth-shirt","worn-plate","worn-sandals","trail-boots","wild-axe","dagger","hunting-spear","twin-daggers","war-hammer","blood-blade","executioner-axe","rune-blade","wanderer-coat","camp-cloak","riveted-harness","thorn-mail","shield-vest","duelist-jacket","blood-plate","sacrifice-plate","heavy-greaves","light-runners","scout-boots","goldthread-shoes","elven-boots","pilgrim-shoes","shadow-shoes","iron-shod"],
    "consumables": ["elixir","grand-elixir","bomb","thunder-flask","smoke-bomb","whetstone","fate-stone","gold-pouch","fate-die","teleport-scroll","armor-solder","wool-lining"],
}
# The approved pre-batch assets contain partial-alpha edge pixels. Preserve them;
# the stricter binary-alpha production rule applies to all newer icons.
APPROVED_LEGACY = {"wood-club", "rusted-sword", "cloth-shirt", "worn-plate", "worn-sandals", "trail-boots"}

def main() -> None:
    seen = {}
    total = 0
    for family, ids in FAMILIES.items():
        for item_id in ids:
            path = ROOT / family / f"{item_id}-v1.png"
            with Image.open(path) as art:
                if art.size != (48, 48) or art.mode != "RGBA":
                    raise ValueError(f"{path.name}: expected 48x48 RGBA")
                alpha = art.getchannel("A")
                alpha_values = set(alpha.tobytes())
                if 0 not in alpha_values or len(alpha_values) < 2:
                    raise ValueError(f"{path.name}: expected visible art and transparent padding")
                if item_id not in APPROVED_LEGACY and alpha_values != {0, 255}:
                    raise ValueError(f"{path.name}: expected binary alpha and transparent padding")
                box = alpha.getbbox()
                if box is None or box[2] - box[0] > 36 or box[3] - box[1] > 36:
                    raise ValueError(f"{path.name}: visible art exceeds 36x36: {box}")
                if box[3] != 42 or abs(box[0] - (48 - box[2])) > 1:
                    raise ValueError(f"{path.name}: wrong baseline or horizontal centering: {box}")
                digest = sha256(art.tobytes()).hexdigest()
                if digest in seen:
                    raise ValueError(f"{path.name}: duplicates {seen[digest]}")
                seen[digest] = path.name
                total += 1
                print(f"PASS {family}/{path.name}: {box}")
    expected = sum(len(ids) for ids in FAMILIES.values())
    print(f"{total}/{expected} distinct item assets pass ({len(FAMILIES['equipment'])} gear + {len(FAMILIES['consumables'])} consumables)")
    print(f"Binary alpha: {total - len(APPROVED_LEGACY)} newer assets; 6 approved legacy assets preserved with their original alpha")

if __name__ == "__main__":
    main()
