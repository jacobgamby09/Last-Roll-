# Buff consumable icon batch v1

Completed 2026-09-02. Scope: two item icons only, following `handoff-buff-icons.md`. Started from `31e2538`, then integrated on top of `f14b960` so the concurrent English conversion is preserved. No core, scene logic, existing UI wording, buffs, balance or inventory behavior changed.

## Delivered assets

| ID / current item name | Final file | Alpha bounds (exclusive right/bottom) |
| --- | --- | --- |
| Armor Solder (Panserlod) | `src/assets/pixel/consumables/armor-solder-v1.png` | (6, 10, 42, 42) |
| Wool Lining (Uldfór) | `src/assets/pixel/consumables/wool-lining-v1.png` | (6, 11, 42, 42) |

Both are 48×48 RGBA with binary alpha, horizontally centered, maximum 36×36 visible art, bottom-exclusive baseline y=42. Armor Solder is an angular repair plate/tool with an internal copper highlight; Wool Lining is soft folded cream fleece with brown backing. Neither is a flask, equippable armor piece or board tile. All previously approved PNGs remain unchanged.

## Pipeline and exact prompts

Built-in ImageGen mode, one asset per request, no CLI/API fallback. The first Wool Lining request returned an entirely black RGB image and was rejected; an identical-prompt retry produced the accepted art. Raw outputs are preserved, including the rejected attempt.

Inspected references supplied to each request, as style/material references only:

1. `src/assets/pixel/consumables/whetstone-v1.png`
2. `src/assets/pixel/equipment/cloth-shirt-v1.png`

The exact request is this common prefix plus a newline, `Subject: `, and the item's subject below:

```text
Use case: stylized-concept
Asset type: one production Rollbound dark-fantasy pixel-art consumable UI icon.
Input images: Image 1 Whetstone and Image 2 Cloth Shirt are STYLE, palette, outlines and material references ONLY, not edit targets. Create a new item in the same handcrafted material family as the whetstone.
Style: crisp 16-bit pixel art with chunky square clusters, near-black plum outlines, restrained dark iron and muted natural colors, limited 3-tone shading per material. Broad clear silhouettes, minimal noise, readable at a maximum 36x36 visible silhouette on a 48x48 transparent canvas. NOT painterly, NOT vector, NOT photorealistic.
Composition: one isolated compact item centered, fully visible with generous transparent padding, three-quarter view. Actual transparent RGBA background, never a painted checkerboard. No surface underneath.
Constraints: no platform, ground, shadow, card, border, UI, labels, letters, numbers, price, badge, external glow, aura, particles, blur, gradients, antialiasing or watermark. No person, no unrelated equipment. Any warm highlight must remain solid pixels INSIDE the object.
```

### armor-solder

Raw: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-53a30e89-b440-4d3b-9390-cc0eb1b826e1.png`

```text
Panserlod / armor solder: a short sturdy medieval brazing iron with a chunky dark wooden handle and copper metal tip laid diagonally across a small curved iron repair plate with two large rivets. Tip has a restrained orange-hot copper highlight confined to its surface. One compact armor-repair material kit, recognizable as smithing work on armor, not a full breastplate, not a handheld shield, not a sword or flask. The angular riveted patch and tool are the defining silhouette.
```

### wool-lining

Raw: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-159d8408-1b29-4e99-a0a1-a116a6c68b09.png`

```text
Uldfór / wool lining: one folded thick soft wool lining patch, a warm cream-beige fleece bundle with a gently scalloped fluffy edge and a darker muted brown cloth underside turned over at one corner. Broad layered fold, a few chunky wool clusters, warm comfortable natural materials. Compact rounded-square material silhouette, NOT a shirt or coat, no neck hole, no person, no spool, no bottle. It is padding applied inside armor.
```

Rejected Wool Lining source: `C:/Users/JacobGamby/.codex/generated_images/01a058ae-424f-7b92-9c0a-d92800a4f75a/exec-d5e6debe-dc49-477f-b786-bed1e6e03ad3.png`.

Both accepted raw sources contained a neutral checkerboard. Existing `scripts/normalize_item_asset.py` was reused unchanged with `--remove-checkerboard`, default edge-connected neutral flood (min channel 210 / max spread 28), alpha threshold 128, nearest-neighbor scaling and 32-color no-dither quantization. No interior clear seeds or artistic code redraws were needed. The normalization tool did not overwrite any prior approved asset.

## Registration and regression checks

- Two English descriptions added to `ART_DESCRIPTIONS`. Existing versioned glob registration and glyph fallback are unchanged.
- `pendingIcons: string[] = []` now requires full consumable coverage. The distinct-URL assertion derives its expected count from the actual catalogs (30 + 12 = 42).
- `verify_item_assets.py` includes both new IDs and reports 42/42 assets. The six legacy approved gear icons retain their original partial alpha; all 36 later icons require binary alpha.
- `npm run lint`, `npm run build`, `npm test` pass. Actual suite: 4 files / 21 tests, not the 22 mentioned in the brief.
- Build emits a non-blocking >500 kB chunk-size advisory. No bundling configuration or dependency changes were made.

## Browser verification

Story: existing item ID → manifest → PNG → Gear Lab / Treasure / HUD / Inventory. This is client-only; no API or database boundary exists.

At 1280×900 and 390×844:

- Gear Lab reports 12/12 consumables and 30/30 gear. Both new images load correctly at the existing 96px lab, 48px card and 40px HUD canvas sizes, with no missing-art fallback or horizontal page overflow.
- Real seed 20: roll 5 → accept Treasure at tile 5 → choose Armor Solder → open Inventory with I. Its new icon accompanies the existing armor preview (Cloth Tunic: ARM 0 → 1). USE removes the item and leaves Inventory at 0/2.
- Real seed 738: roll 6 → accept Treasure at tile 6 → choose Wool Lining → open Inventory. Its new icon accompanies the existing Cloth Tunic max-HP preview (50 → 58).
- Both inventory cards were visually checked on desktop and mobile. These acquisitions use normal game actions, not injected state. Initial gameplay evidence predates the concurrent language conversion; final English checks are recorded below.
- No browser exceptions or Vite error overlay in the tested flows.

Initial screenshots and the read-only seed search are retained in the isolated QA worktree's ignored `rollbound/tmp.local/`. They are not shipped routes or production test hooks. The isolated worktree was moved outside the application tree so normal test discovery does not include its duplicate sources.

Final integration check on English `main` (`98cfeff`): lint, build, all 21 tests and all 42 asset checks pass again. Gear Lab at `http://127.0.0.1:5173/?ui=equipment` was visually verified at 1280×900 and 390×844: both English item names and descriptions accompany the correct images, coverage is 12/12, all six image instances load at their existing sizes, and neither layout has horizontal page overflow. Browser error collection is empty. Screenshots: `tmp.local/buff-final-english-desktop.png` and `tmp.local/buff-final-english-mobile.png` in the isolated QA worktree.
