# Consumable asset contract v1

Approved task scope: item-icon handoff, 2026-09-02. Consumables are a separate icon family from equipment, board tiles and numeric HUD resources. This contract defines presentation only; existing item IDs, effects, slots and actions stay in the core catalog.

## Source and silhouette

- Versioned PNG at `src/assets/pixel/consumables/<ConsumableId>-v1.png`.
- 48×48 RGBA canvas with actual transparent pixels, not a checkerboard picture.
- Maximum 36×36 visible art, centered horizontally. Bottom-exclusive alpha boundary y=42 (last occupied row 41).
- Hard pixel edges, binary alpha, nearest-neighbor downsampling, limited dark-fantasy/plum palette with restrained item-specific accents.
- A recognizable object-in-hand silhouette: bottle, round bomb, smoke canister, stone, pouch, die or scroll.
- Elixir and Grand Elixir differ in silhouette/ornament, not only color. Bomb and Smoke Bomb must also differ by shape.
- No ground/platform, shadow, frame, card, text, price, number, rarity badge, external glow or UI state baked into the art.
- Preserve approved assets; use a new version when replacing one. The normalization script refuses an existing output path.

## Runtime mapping and fallback

`CONSUMABLE_ASSETS` is a `Partial<Record<ConsumableId, ConsumableAsset>>`. The versioned filename and allowed ID must match. A new file alone cannot silently remap an item. Names/effects remain authoritative in `src/core/items.ts`.

`ConsumableIcon` renders the PNG or explicitly falls back to the original effect-family `ConsumableGlyph` on missing art/load failure. The glyph implementation remains unchanged in its leaf module, with a compatibility re-export from `ScenePhases.tsx`.

Sizes: HUD 40×40; Shop/Treasure/idle-use/pre-combat cards 48×48; lab 96×96. These sizes refer to the full source canvas, not a cropped silhouette. Use `object-fit: contain` and `image-rendering: pixelated`. No item-specific stretching or offsets.

Icons beside visible item text are decorative. Standalone art has an image role and accessible item name, including fallback states. Names, effects, prices, slot counts and disabled explanations belong to the UI and wrap without clipping.

## Semantics and layout

- Held consumables occupy the two existing consumable slots, never the Weapon/Armor/Boots slots.
- Gold Pouch is a consumable, not the numeric Gold resource; Fate Stone and Fate Die are consumables, not the Nudge/Reroll resources or the primary roll-control D6.
- HUD uses complete names, not truncated first words, in a dedicated full-width row. Both held slots remain readable on mobile.
- Idle-use and pre-combat buttons retain existing availability rules and explicit reasons. Only disabled art is dimmed, not explanation text.
- No new action handlers, combat timing, animations or item mechanics are introduced by this art family.

## Required verification

Run `npm run lint`, `npm run build`, `npm test` and `python scripts/verify_item_assets.py`. Gear Lab must show 30/30 gear and 10/10 consumables for this roster.

Check every consumable in actual Shop, Treasure, HUD and idle-use components at desktop and narrow mobile widths. Also verify the real seed 299 Bomb → pre-combat → use → fight path and seed 15 Shop. Keep controlled catalog-rendering fixtures distinct from real gameplay evidence. Verify missing-manifest and load-error fallback, complete names/effects and disabled reasons.

Production/provenance: [item icon batch](item-icon-batch-v1.md). Runtime evidence: [consumable QA](item-icons-consumable-qa-v1.md).
