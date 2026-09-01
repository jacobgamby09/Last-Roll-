# Rollbound resource asset contract v1

## Scope

This contract covers non-equipment UI icons for run resources and hero stats. These symbols communicate quantities, direct effects or fixed stats; they never occupy an equipment slot and do not imply item ownership.

Current family:

- `damage` — the hero's current attack strength.
- `armor` — the hero's current damage reduction.
- `life` — HP, Max HP and healing.
- `xp` — experience progress toward the next Level.
- `gold` — currency and Gold rewards.
- `nudge` — the limited ±1 movement resource.
- `reroll` — the limited forced-new-roll resource.

## Runtime contract

- Source canvas: `48 × 48` RGBA PNG with genuine alpha transparency.
- Visible artwork: maximum `36 × 36` pixel bounding box, centered horizontally and vertically.
- Wide symbols such as Nudge may use the full width while remaining shorter vertically.
- Runtime rendering uses `image-rendering: pixelated` and `object-fit: contain`.
- Default runtime sizes are `28 px` in HUD and `40 px` on cards. Control resources deliberately render larger: Nudge at `38/46 px` and Reroll at `36/44 px` for HUD/card.
- Nudge may receive restrained vertical presentation scaling inside its transparent canvas so its wide source silhouette remains readable; the source PNG stays clean and undistorted.
- Resource icons have no ground, stone platform, tile frame, equipment slot, label, number, price, selection state, or external glow baked into the bitmap.
- Every resource must have a distinct silhouette. Color is a secondary identifier.
- Resource accents may use red for Damage and life, cyan for Armor and Reroll, gold-yellow for Gold and mint-green for Nudge.
- A missing asset must render an explicit magenta fallback.

## Asset set

- `damage-sword-v1.png` — diagonal sword with an angular red impact slash.
- `armor-shield-v1.png` — compact frontal cyan shield with a strong symmetrical silhouette.
- `life-heart-v1.png` — chunky crimson life heart with an ivory highlight.
- `xp-essence-v1.png` — four-point cyan-violet essence star for experience progress.
- `gold-coins-v1.png` — compact stack of three gold coins.
- `nudge-die-v1.png` — dark D6 with two short opposing arrows; wide silhouette.
- `reroll-die-v1.png` — dark D6 wrapped by one circular arrow; round silhouette.

Nudge and Reroll intentionally share a dark D6 center but must remain distinguishable from the surrounding arrow silhouette alone.

## Semantic mapping

- HUD Damage and Armor stats → `damage` and `armor`; never use equipped Weapon or Armor item art for these values.
- HUD HP bar → `life` at mini size.
- HUD XP bar → `xp` at mini size.
- HUD Gold, Nudge and Reroll stats → their matching resource assets.
- Treasure `maxhp`, `gold` and `nudge` → `life`, `gold` and `nudge` respectively.
- Shop `heal`, `nudge` and `reroll` → `life`, `nudge` and `reroll` respectively.
- Treasure and Shop Weapon/Armor rewards continue to use equipment assets.
- Nudge never uses a Boots asset and never changes the Boots visual loadout ID.

## Generation prompt set

Built-in ImageGen is used once per distinct resource, with approved Rollbound equipment and board assets supplied only as style, palette, hard-edge and density references.

Shared prompt constraints:

```text
Use case: stylized-concept
Asset type: Rollbound non-equipment resource UI icon — <RESOURCE>
Style/medium: authentic compact dark-fantasy 16-bit pixel-art game UI icon, hard square pixel clusters, limited near-black plum palette, strong readable silhouette, no antialiasing.
Composition/framing: exactly one centered symbol on a square genuinely transparent canvas with generous padding; readable at 28–40 pixels.
Constraints: true alpha transparency; no checkerboard, background, ground, stone platform, equipment slot, tile, card, frame, label, letter, number, price, text, external glow, haze, watermark, extra object, or crop.
```

Subject prompts:

- Damage: diagonal steel sword with a chunky angular red impact slash and two small red sparks.
- Armor: frontal compact cyan-and-steel shield with a bright center ridge and deep navy shadow.
- Life: classic chunky crimson heart silhouette, ivory highlight, deep-red shadow.
- XP: compact four-point faceted arcane essence star, cyan center, violet facets and one ivory highlight.
- Gold: exactly three stacked coins, golden-yellow faces and orange shadows; no bag or chest.
- Nudge: dark D6 with one ivory pip and two short mint-green arrows pointing outward left/right.
- Reroll: dark D6 with one ivory pip wrapped by one chunky cyan clockwise circular arrow.

If ImageGen returns a raster checkerboard, use a background-extraction pass that changes only the background and preserves the subject exactly.

## QA

- Resource Lab must report `7/7 ASSETS MAPPED` and show all icons at HUD and card sizes.
- All seven IDs must appear without missing-asset fallbacks.
- Damage and Armor must remain visually distinct from the currently equipped Weapon and Armor icons.
- Nudge and Reroll must remain distinguishable at their final HUD sizes and must not collide with labels or neighboring stats.
- Seeded Treasure and Shop states must use resource IDs for non-equipment rewards and equipment IDs only for actual gear rewards.
- Verify lint, production build and desktop browser rendering.
