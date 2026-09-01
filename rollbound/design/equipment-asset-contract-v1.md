# Rollbound equipment asset contract v1

## Scope

This contract covers presentation assets and the prototype's first functional equipment slice. It includes fixed item effects, current-vs-new comparison, explicit equip/keep choices, and truthful HUD replacement. It does not add an inventory, rarity, duplicate conversion, or extra slots.

Starter visual families:

- Weapon — the equipped visual may change when an existing Damage reward clearly represents a weapon.
- Armor — the equipped visual may change when an existing Armor reward clearly represents armor.
- Boots / Utility — a separate equipment slot with one approved movement effect in the current slice.

Boots and Nudge are not interchangeable. Nudge remains a limited run resource. Stivinderstøvler provide one separate free Nudge charge, spent before the normal resource; receiving `+1 Nudge` still does not equip Boots.

## Runtime contract

- Source canvas: `48 × 48` RGBA PNG with genuine alpha transparency.
- Visible artwork: maximum `36 × 36` pixel bounding box.
- Shared bottom baseline: source `y = 42`.
- Center each silhouette horizontally after alpha cleanup.
- Runtime rendering uses `image-rendering: pixelated` and `object-fit: contain`.
- Equipment icons have no stone platform, ground patch, tile frame, label, number, price, stat text, selection state, or glow baked into the bitmap.
- Slot/category accents belong to CSS and may use restrained red for Weapon, cyan for Armor, and green for Boots / Utility.
- Every asset uses a versioned filename and a manifest entry. A missing manifest entry must render an explicit magenta fallback.

## Starter and upgrade set

- Weapon: `wood-club-v1.png` starter → `rusted-sword-v1.png` upgrade.
- Armor: `cloth-shirt-v1.png` starter → `worn-plate-v1.png` upgrade.
- Boots / Utility: `worn-sandals-v1.png` starter → `trail-boots-v1.png` upgrade.

## Semantic mapping for the current prototype

The game core stores one equipped item ID for each slot. Each item has one fixed effect, and replacing an item applies only the effect delta for that slot:

- A new run starts with `wood-club`, `cloth-shirt`, and `worn-sandals` in the visual loadout.
- Treasure `weapon`, combat drops, and Shop `weapon` may offer `rusted-sword` (`+3 Damage`).
- Treasure `armor`, combat drops, and Shop `armor` may offer `worn-plate` (`+1 Armor`).
- Treasure `boots`, combat drops, and Shop `boots` may offer `trail-boots` (one free Nudge charge).
- Treasure `nudge` and Shop `nudge` → use the non-equipment `↔` resource glyph and do not change the Boots slot.
- Equipment from Treasure, drops, and Shop opens a current-vs-new comparison before replacing the slot. Shop Gold is charged only on `Buy & Equip`.
- Already equipped upgrades are filtered from Treasure/drop pools and disabled in Shops, avoiding duplicates without adding inventory.
- HP, Gold, healing, Nudge, and Reroll use the separate non-equipment resource icon family.

## Generation prompt template

Built-in ImageGen is used once per distinct icon, with approved Rollbound tile assets supplied as style, palette, pixel-edge, and material references only.

```text
Use case: stylized-concept
Asset type: individual Rollbound equipment UI icon — <NAME>
Input images: Images 1–3 are style, palette, hard-pixel-edge, material, and visual-density references only. Do not copy their subjects or stone platforms.
Primary request: Create one compact <SUBJECT> as a standalone dark-fantasy 16-bit pixel-art equipment icon.
Style/medium: hard square pixel clusters, limited near-black plum and iron palette, restrained <CATEGORY COLOR> accent pixels, strong readable silhouette, and the same pixel density as the references.
Composition/framing: one centered object on a square genuinely transparent canvas with generous transparent padding.
Constraints: exactly one equipment icon; true alpha transparency; no background, checkerboard, platform, ground, tile, card, border, label, text, number, price, badge, external glow, haze, antialiasing, watermark, extra object, or cropped pixel.
```

## Normalization

ImageGen output is source material. Before runtime use:

1. Remove any false checkerboard or opaque background with an alpha-only pass when necessary.
2. Find the non-transparent bounding box.
3. Scale with nearest-neighbor sampling into the `36 × 36` maximum visible box.
4. Center horizontally on a fresh transparent `48 × 48` canvas.
5. Align the bottom of the artwork to source `y = 42`.
6. Inspect at 1× and enlarged nearest-neighbor scale before mapping it.

## QA

- Equipment Lab must show all six icons as three starter → upgrade pairs at HUD and choice-card sizes.
- A deterministic new run must show the three starter asset IDs in the HUD.
- A confirmed equipment offer must update only its corresponding visual slot and fixed effect.
- Keeping the current item must leave the loadout, stats, Boots charges, and Shop Gold unchanged.
- A Nudge reward must increment the resource without changing the Boots asset ID.
- Stivinderstøvler must show their separate charge in the Boots slot; using it must not reduce the normal Nudge resource.
- The icon silhouette must remain readable at the smallest runtime size.
- Equipment decoration must not overpower the board, destination preview, item name, effect, or cost.
- Verify desktop and narrow layouts, missing-asset fallback, lint, and production build.
