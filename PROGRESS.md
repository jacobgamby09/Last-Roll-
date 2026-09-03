# Rollbound — progress and agent handoff

Last updated: 2026-09-02

This file is the current operational handoff for Claude, Codex, or another contributor. Read `AGENTS.md` first for the game design constraints, then this file for the latest implementation state. Update this document after material code, balance, asset, or design changes.

## Current status

Rollbound is a playable Vite + React + TypeScript prototype with a UI-free seeded engine, fullscreen encounter/choice scenes and a pixel-art presentation. Combat sprites, simulation on the real engine, damage ranges, the 30-item gear roster and 12 consumables with 2 slots are implemented. Icon coverage is complete: **30/30 gear + 12/12 consumables mapped**. The two latest additions are Armor Solder and Wool Lining; all previously approved icons are unchanged. **The playtest gate is reached; the next milestone is 5–10 human runs**, not another content or balance batch.

**The game language is English (2026-09-02):** all player-facing strings — item/enemy names, effect texts, engine log, every scene, HUD, board labels, tooltips, aria/alt texts and labs — are direct English strings (no i18n framework). Code comments and dev tooling (sim output, test names) stay Danish. Danish → English name map examples: Slibesten → Whetstone, Panserlod → Armor Solder, Uldfór → Wool Lining, Skæbneterning → Fate Die, Røgbombe → Smoke Bomb. New player-facing text must be written in English.

This icon batch changes presentation only. Claude's upstream Batch C calibration is balanced **56.4%** / aggressive **41.8%** / cautious **38.4%** over 10,000 engine-sim runs, with boss HP 85 / DMG 8–12 / ARM 2. Those are the upstream results, not a new simulation or balance change made during icon production.

Board presentation 2026-09-03: **full-world board with fog of war.** The entire 70-tile track is laid out as a fixed snake (6 tiles per row, boss at the top) and the hero piece travels through it; the camera is a 3-row viewport (`.pixel-board-viewport`) that glides via a translateY on `.pixel-path-grid` (620 ms, disabled under reduced motion) and keeps the hero's row at the BOTTOM so ~2 rows are always visible ahead. Tile size (88×88) and panel footprint are unchanged. Tiles beyond `visibleAhead` render as `FacedownTile` — dark platform silhouettes with drifting mist whose opacity falls off with `--fog-depth`, plus a short reveal animation when tiles enter visibility (the reveal selector must keep excluding `.is-primary`/`.is-reachable`/`.is-current`, or it permanently overrides their pulse animations). The tile TYPE must never leak there (no meta class, label, chip, tooltip or aria hint); visited tiles stay revealed. Inspection tooltips: path slots form their own stacking contexts, so the hovered/pinned slot is raised via `:has()` (tooltips cannot escape on their own); the tooltip background is solid, and tiles in the viewport's top row flip the tooltip below the tile (`is-below`) so the overflow edge cannot clip it. The hero sprite sheet faces right; `PixelHero` mirrors it (`is-facing-left`, scaleX(-1)) on odd snake rows, which run right-to-left. Destination markers (`is-primary`/`is-reachable`) are static — lift + outline + brightness, no pulse animation — and blank/road tiles get an extra brightness boost when marked because their dioramas and accent color are darker than the event tiles'. ROW_STEP (106px) in `PixelBoard.tsx` must match the grid row metrics and `connect-up` height in `pixel.css`.

UX rule 2026-09-02: **the Equip/Keep screen is always a free inspection, never a trap.** Picking a gear card in a treasure chest opens the compare screen with the chest stored as its resume phase; Keep ("KEEP CURRENT · BACK TO CHEST") returns to the chest with all options intact, and only Equip (or taking a non-gear option) consumes the chest. This matches the shop's existing "BACK TO SHOP" contract. Pinned by an engine test; the sim bot is loop-proofed (it equips when the chest holds no better alternative).

Balance tweak 2026-09-02: **flexibility premium on healing elixirs** — Healing Elixir 8 → 12 g, Grand Elixir 14 → 20 g (heal amounts unchanged). The shop's Healing Herb (8 g / +15 HP, instant) is now the best HP-per-gold when you need healing immediately; elixirs pay a premium for free timing. Sim-verified (10k runs): balanced 56.0% / aggressive 40.6% / cautious 37.8% — within 0.6 pp of Batch C, no recalibration. See the GDD changelog.

The current visual direction has been approved by the user:

- Dark-fantasy 16-bit pixel art on a near-black plum background.
- High-contrast, restrained neon category colors.
- Frameless miniature dioramas are the visible board tiles.
- Invisible `88 × 88` cells remain as layout, movement, connection, hitbox, and accessibility anchors.
- Blank / Road dioramas remain fully visible even after they have been visited.
- Tile connections use a broken, near-black plum pixel-stone trail behind the assets; never use a solid gray connector bar.
- Never put the diorama assets back inside visible square tile cards.

Design decision 2026-09-02 (IMPLEMENTED same day): **the exact HP-cost preview for fights is removed.** No exact price on board chips, destination cards, or a boss-price HUD panel, and no lethal/safe auto-flags. Combat tiles (Enemy/Elite/Boss) are inspectable via hover/click/focus and show enemy type plus approximate stats as intervals (HP in 5-buckets, DMG ±1, ARM exact — `approxEnemyStats` in `src/ui/preview.ts`). See `GDD.md` changelog and the combat-information rules in `AGENTS.md`.

## Repository state

- Branch: `main`
- Remote: `https://github.com/jacobgamby09/Last-Roll-.git`
- Latest icon follow-up baseline: `f14b960` (English UI), incorporating `31e2538` (buff-icon brief) and `c587ce0` (item-bound buffs and inventory). The original 34-icon batch used `374f575`.
- Combat sprites, engine simulation, damage ranges and the gear/consumable rules are already upstream history. This batch adds 34 item PNGs, full manifests/component integration, scoped readability corrections, icon regression checks and handoff documentation. It does not change `src/core/` or balance.
- Preserve all existing local changes. Do not reset or overwrite the worktree.

## Run and QA

From `rollbound/`:

```text
npm install
npm run dev
npm run lint
npm run build
npm test
python scripts/verify_combat_assets.py
python scripts/verify_item_assets.py
```

The optional asset verification commands require Pillow; the runtime app does not depend on Python.

Useful routes:

- `/?seed=2` — deterministic board containing Blank, Combat, Camp, Gold and Treasure in the first visible section.
- `/?seed=299` — consumable acquisition and pre-combat QA seed (Bombe in the first Treasure).
- `/?seed=15` — seeded Shop QA.
- `/?ui=tiles` — Tile Lab for all tile families, normalized assets, hero scale and manifest coverage.
- `/?ui=equipment` — full Gear/Consumable Lab: all 30 gear and 10 consumables with names, effects and lab/card/HUD sizes; starter-to-upgrade reference pairs are retained.
- `/?ui=resources` — Resource Lab for Damage, Armor, Life/HP, XP, Gold, Nudge and Reroll at lab, card and HUD sizes.
- `/?ui=classic` — original prototype UI retained as a behavioral reference and fallback.

Latest buff-icon follow-up (2026-09-02):

- Armor Solder and Wool Lining now have their own 48×48 RGBA assets, registered through the existing manifest. `pendingIcons: string[] = []` restores full consumable coverage; unique URL expectations derive from the catalogs (42 items).
- The PNG verifier covers 42/42 assets, including both new icons' binary alpha, maximum 36×36 art and bottom-exclusive baseline y=42.
- Lint, build and all 21 tests pass. The brief said 22 tests; the checked-in suite contains 21. Build has a non-blocking >500 kB chunk-size warning; no bundling settings were changed.
- Gear Lab displays 12/12 consumables. Both icons were checked at HUD/card/lab sizes on desktop and mobile and obtained through real Treasure runs: seed 20 → Armor Solder; seed 738 → Wool Lining. Inventory previews remain owned by the existing scene.
- No core, scene logic, UI wording or buff rules changed in this batch. Production prompts, raw paths and verification evidence: `rollbound/design/buff-icon-batch-v1.md`.

Original 34-icon batch verification (historical, before item buffs/inventory and the English conversion):

- `npm run lint` passes.
- `npm run build` passes.
- `npm test` passes (4 files, 20 tests).
- `python scripts/verify_item_assets.py` passes `40/40`: all canvases are `48 × 48` RGBA, artwork is at most `36 × 36`, and the shared bottom-exclusive baseline is `y=42`. All 34 new images have binary alpha; partial alpha in the six approved legacy icons is deliberately preserved rather than silently rewriting them.
- Gear Lab reports `30/30 GEAR MAPPED` and `10/10 CONSUMABLES MAPPED`; all 40 IDs have registered production assets.
- All 30 gear IDs render through the actual Shop, Treasure, EquipmentOffer and PixelHud components at `1280 × 900` and `390 × 844` in ignored deterministic fixtures. There are no missing images, fallbacks, copy overflows or horizontal page overflows. The broad fixture coverage is not a claim that every item was naturally obtained in a full run.
- Real seed 2 verifies Treasure → Elverstøvler comparison → Equip on desktop: only Boots changes (`worn-sandals` → `elven-boots`), while other slots/stats/resources remain unchanged. Repeating the same route on mobile verifies Keep leaves the loadout/resources unchanged and returns to Roll. See `rollbound/design/item-icons-gear-qa-v1.md`.
- Missing-manifest and failed-image gear fallbacks are explicitly verified and retain accessible labels. Icon load failure is keyed to the failing source, so replacing equipment cannot inherit the previous image's failed state.
- Consumable QA passes 32 actual-component fixture states across `1280 × 800` and `390 × 844`: all 10 HUD/idle/Treasure icons, all nine saleable Shop items (Gold-pouch is intentionally not sold), the three pre-combat items, Boss-blocked Smoke Bomb and full-slot explanations. All expected PNGs load at natural `48 × 48`; no unexpected fallback/overflow or whole-button disabled fading. Keyboard focus and decorative icon accessibility are verified.
- Real seed 299 verifies Treasure Bombe → HUD → pre-combat 12 opening damage → combat payout on both viewports (`+15 XP`, `+2 Gold`, `50/50 HP`); real seed 15 verifies seeded Shop icons. Missing-entry/load-error consumable glyph fallbacks remain intact. See `rollbound/design/item-icons-consumable-qa-v1.md` for exact fixture versus gameplay coverage.

Historical verification archive — the following checks were performed during earlier slices. Their exact seeds, item pools, flat damage values, prices and test counts describe those revisions and are **not** current balance claims:

- Combat sprites: all seven verified in the live seed 2 combat scene at `1280 × 800` and `390 × 844`, including attack, hit and fallen states; reduced-motion verified on mobile. Non-Goblin art was temporarily aliased onto the seed 2 Goblin for QA, then restored to the canonical mapping. No fallback, overflow, browser error or warning detected.
- Combat PNG contract verification passes `7/7`: `64 × 80` RGBA, binary alpha, bottom baseline and tier height bands. See `rollbound/design/combat-sprite-batch-v1.md` for exact prompts, normalization and the existing scene floor-offset observation.
- Tile Lab reports `13/13 ASSETS MAPPED`.
- The first-slice Gear Lab reported `6/6 ASSETS MAPPED` (superseded by the current full catalog).
- Resource Lab reports `7/7 ASSETS MAPPED`.
- Resource Lab verifies enlarged control-resource presentation: Nudge `38/46 px` and Reroll `36/44 px` at HUD/card sizes.
- Seed 2 renders Camp, Gold, Treasure and Trap correctly from the asset manifest.
- Seed 0 verifies real Treasure choices: Weapon rewards use the upgrade asset, while Nudge uses its separate resource asset.
- Seed 15 verifies the Shop row with Weapon and Armor upgrade assets plus separate resource assets for healing, Nudge and Reroll.
- Seed 2 shows dedicated Damage, Armor, Life, Gold, Nudge and Reroll assets in the HUD without replacing the three equipment slots.
- Seed 2 verifies the new D6 anticipation/tumble/impact sequence resolves to the same deterministic face as the reducer and reveals destinations only afterward.
- A real Reroll verifies the same D6 effect plays before movement, consumes exactly one Reroll and resolves the previewed value.
- Hero Status uses the dedicated 80×80 bust without a backing card, a compact Level/next-reward heading, continuous HP/XP bars with external values and a dedicated XP essence asset.
- A real seed 2 Goblin result verifies simultaneous HP ghost-damage and XP gain feedback (`50 → 44 HP`, `0 → 15 XP`).
- A later real seed 2 Goblin verifies Level `1 → 2`, retained `10/30 XP`, Level feedback and the updated next-level reward.
- Seed 0 maps Gold and Nudge Treasure rewards to resource assets while Weapon remains an equipment asset.
- Seed 15 maps Heal, Nudge and Reroll Shop rows to resource assets while Weapon and Armor remain equipment assets.
- Rolled destination outlines follow transparent asset silhouettes.
- Seed 2 verifies six fully visible Road dioramas plus horizontal and vertical broken-stone path segments.
- A real seed 2 movement verifies active, traveled and upcoming connector states; visited Road art keeps `filter: none`.
- Seed 0 verifies Treasure → compare current/new → Equip for Weapon and Boots, plus the `Keep current` branch.
- Equipping Slebet klinge changes only Weapon and raises Damage from `10` to `13`.
- Equipping Stivinderstøvler changes only Boots, adds a visible `±1` Boots charge, and the next Nudge consumes that charge while the normal Nudge resource remains `2`.
- Seed 0 Shop renders six truthful rows: Weapon, Armor, Boots, Heal, Nudge, and Reroll.
- A real `390 × 844` viewport test verifies no global horizontal overflow, an internally scrolling board at native scale, a one-column Shop, stacked destinations and a vertically stacked equipment comparison with both actions visible.
- Runtime functional text is at least `9 px`; tile labels and consequence chips are `10 px`, body/effects are `11 px`, and item/destination names are `12 px`.
- Shop rows retain readable copy while disabled and explicitly state missing Gold, full HP, already equipped or bought states.
- HP/XP expose progressbar semantics, the current tile exposes `aria-current="step"`, and board/equipment controls have descriptive accessible labels.
- No missing-asset fallback, Vite overlay, browser warning, or browser error was detected.

## Game implementation already present

- Full Roll → Evaluate → Nudge/Reroll/Accept → Resolve → Upgrade loop.
- Seeded RNG and reproducible runs.
- Approximately 70-tile track with 8–12 visible upcoming fields.
- Persistent HP, automatic combat, XP/level progression, Gold, Treasure, Shop, Camp, Event, Elite, Trap and Boss resolution.
- Rotation and choice level-up modes behind configuration.
- Normal and elite drop rates behind configuration.
- Pixel UI is the default; Classic UI remains available.
- Hero movement is animated field-by-field in the UI while the reducer remains deterministic and UI-free.
- Combat resolves through a combat script: `simulateFight` in `src/core/combat.ts` produces the blow-by-blow event list with seeded damage rolls; the reducer applies its result atomically and stores it as `state.lastCombat` (with `state.combatSeq` as the new-fight signal for the UI, since structuredClone breaks reference identity). Tests cover degenerate-range equivalence with the old closed-form math, damage bounds, run determinism and the dice-peek contract.
- Fullscreen scene system (2026-09-02): encounter/choice phases render as takeovers on the shared `SceneShell` (`src/pixel/SceneShell.tsx`) — combat playback (`CombatScene.tsx`, driven 1:1 by `lastCombat`: intro → accelerating exchange → outcome → payout inside the scene, click/space skips, reduced-motion jumps to the static result, timing in `presentation.ts`), plus treasure, equipment comparison, shop, level-up, pre-combat and game over via `ScenePhases.tsx`. Victory payout shows XP/gold/drop deltas, rotation level-up fanfares, and embeds the drop Equip/Keep comparison; defeat ends inside the scene. The bottom action panel owns idle consumable use, rolled/movement/roll-fx, `chooseRoll` and `teleport` decisions. All seven configured enemies use dedicated combat sprites; tile-diorama fallback remains for unknown/unmapped enemies and failed asset loads (`combatSpriteAssets.ts` + `combat-sprite-contract-v1.md`).
- Equipment is now a reducer-owned offer flow for Treasure, combat drops, and Shops with explicit Equip/Keep actions.
- Equipment effects replace the effect in one slot rather than stacking permanent bonuses; ownership checks prevent re-equipping the same item. The full roster is 10 Weapons, 10 Armor and 10 Boots / Utility items with data-driven effects in `src/core/items.ts`.
- Weapons own damage ranges (for example Trækølle `7–12`, Slebet klinge `11–14`); the old `+3 Damage` presentation belongs to the first-slice history. Jernplade gives `+1 Armor`, and Stivinderstøvler provide one free Nudge charge that recharges at Camp.
- Ten consumables use two held-item slots. Idle-use consumables, pre-combat bombs/flee, `chooseRoll` and `teleport` phases are supported in pixel and classic UI. The pre-combat beat appears only when relevant consumables are held; Røgbombe deliberately does not work on Boss.
- Shops generate five seeded, single-purchase offers with gear/consumable/service thirds; consumable purchases require a free slot. Normal enemy drops are utility/consumable, while elites guarantee gear. Labels, prices, charges and disabled reasons remain UI text, not part of PNGs.

## Current visual implementation

Important files:

- `rollbound/src/pixel/PixelGame.tsx` — pixel UI composition.
- `rollbound/src/pixel/PixelHud.tsx` — hero-status composition and reducer-derived visual feedback.
- `rollbound/src/pixel/PixelDie.tsx` — deterministic pip renderer for the blank-face D6 body.
- `rollbound/src/pixel/PixelBoard.tsx` — winding visible board layout.
- `rollbound/src/pixel/PixelTile.tsx` — logical tile cell, metadata overlays and hero anchor.
- `rollbound/src/pixel/PixelTileArt.tsx` — generated-asset renderer plus an explicit missing-manifest fallback.
- `rollbound/src/pixel/tileAssets.ts` — runtime tile asset manifest.
- `rollbound/src/pixel/combatSpriteAssets.ts` — seven-enemy combat sprite manifest; reference/name matching and tile fallback logic unchanged.
- `rollbound/scripts/normalize_combat_asset.py` — targeted alpha cleanup and bottom-aligned nearest-neighbor `64 × 80` normalization.
- `rollbound/scripts/verify_combat_assets.py` — seven-asset canvas, alpha, baseline and height-band regression checks.
- `rollbound/design/combat-sprite-batch-v1.md` — generation provenance, exact prompts, normalization settings, live QA and layout observations.
- `rollbound/src/pixel/equipmentAssets.ts` — 30-item equipment icon manifest and semantic mapping; an explicit ID allowlist registers only the intended versioned art.
- `rollbound/src/pixel/EquipmentIcon.tsx` — shared icon renderer with source-keyed error fallback.
- `rollbound/src/pixel/consumableAssets.ts` — separate 12-item consumable manifest.
- `rollbound/src/pixel/ConsumableIcon.tsx` — shared consumable renderer for HUD, idle-use, Shop, Treasure and pre-combat, with explicit glyph fallback.
- `rollbound/src/pixel/ConsumableGlyph.tsx` — the existing glyph implementation moved unchanged to avoid a component import cycle; `ScenePhases.tsx` keeps its re-export.
- `rollbound/src/pixel/EquipmentLoadout.tsx` — three-slot HUD renderer driven by the hero's visual loadout IDs.
- `rollbound/src/core/items.ts` — authoritative gear/consumable catalog and effect vocabulary; `equipment.ts` applies replacement, ownership checks and Boots/Nudge accounting.
- `rollbound/src/pixel/EquipmentLab.tsx` — full deterministic 30-gear/10-consumable catalog and scale QA.
- `rollbound/src/pixel/resourceAssets.ts` — non-equipment resource manifest and Treasure mapping.
- `rollbound/src/pixel/ResourceIcon.tsx` — shared resource renderer with explicit error fallback.
- `rollbound/src/pixel/ResourceLab.tsx` — deterministic resource silhouette and scale QA.
- `rollbound/scripts/normalize_hud_asset.py` — deterministic nearest-neighbor normalization for `48 × 48` HUD assets.
- `rollbound/scripts/normalize_item_asset.py` — targeted alpha cleanup, nearest-neighbor item normalization and shared equipment/consumable baseline.
- `rollbound/scripts/verify_item_assets.py` — all 42 item PNGs' dimensions, alpha, silhouette and baseline regression checks.
- `rollbound/src/pixel/pixel.css` — visual system and asset-as-tile states.
- `rollbound/design/tile-asset-contract-v1.md` — canonical production and alpha-pass contract.
- `rollbound/design/equipment-asset-contract-v1.md` — canonical equipment production, mapping and normalization contract.
- `rollbound/design/consumable-asset-contract-v1.md` — separate consumable production and semantic contract.
- `rollbound/design/item-icon-batch-v1.md` — item-batch production/integration handoff, QA and links to family prompt records.
- `rollbound/design/item-icons-gear-qa-v1.md` — all-gear fixture coverage, real seed 2 Equip/Keep and comparison readability findings.
- `rollbound/design/item-icons-consumable-qa-v1.md` — consumable fixture coverage, real seeds 299/15, disabled states and fallback/accessibility verification.
- `rollbound/design/resource-asset-contract-v1.md` — canonical resource production, semantic mapping and QA contract.
- `rollbound/design/readability-contract-v1.md` — canonical typography, responsive, disabled-state and accessibility contract.
- `rollbound/design/dice-roll-visual-contract-v1.md` — canonical D6 asset, pip, animation, reduced-motion and RNG-boundary contract.
- `rollbound/design/hero-status-visual-contract-v1.md` — canonical portrait, Level, HP/XP, feedback and responsive contract.

Current normalized `64 × 64` RGBA tile assets:

- `blank-a-v1.png`
- `blank-b-v1.png`
- `blank-c-v1.png`
- `combat-v1.png`
- `camp-tent-v1.png`
- `camp-bedroll-v1.png`
- `gold-v1.png`
- `treasure-v1.png`
- `shop-v1.png`
- `event-v1.png`
- `elite-v1.png`
- `trap-v1.png`
- `boss-v1.png`

Hero assets are four normalized `32 × 48` RGBA frames in `rollbound/src/assets/pixel/hero/`.

Enemy combat assets are seven normalized `64 × 80` RGBA single-frame sprites in `rollbound/src/assets/pixel/combat/`: Goblin, Bandit, Ogre, Goblin-høvding, Skyggeridder, Trold-konge and Boss. Visible heights are respectively `56 / 62 / 68 / 68 / 72 / 76 / 80 px`. Every sprite faces left and ends at canvas row `79`; no per-sprite sizing, ground platforms or backgrounds. Desktop rendering is `96 × 120`, mobile `72 × 90`.

The HUD also uses `hero-portrait-v1.png`, a dedicated normalized `80 × 80` RGBA bust matching the board hero.

Current normalized `48 × 48` RGBA equipment assets: **30/30**, stored as `src/assets/pixel/equipment/<id>-v1.png`:

- Weapon: `wood-club`, `rusted-sword`, `wild-axe`, `dagger`, `hunting-spear`, `twin-daggers`, `war-hammer`, `blood-blade`, `executioner-axe`, `rune-blade`.
- Armor: `cloth-shirt`, `worn-plate`, `wanderer-coat`, `camp-cloak`, `riveted-harness`, `thorn-mail`, `shield-vest`, `duelist-jacket`, `blood-plate`, `sacrifice-plate`.
- Boots / Utility: `worn-sandals`, `trail-boots`, `heavy-greaves`, `light-runners`, `scout-boots`, `goldthread-shoes`, `elven-boots`, `pilgrim-shoes`, `shadow-shoes`, `iron-shod`.

The original six approved starter/upgrade PNGs are preserved unchanged. The 24 additions use binary alpha, maximum `36 × 36` visible silhouettes and shared bottom-exclusive `y=42` alignment; no per-item CSS resizing.

Current consumable assets: **12/12**, stored as `src/assets/pixel/consumables/<id>-v1.png`: `elixir`, `grand-elixir`, `bomb`, `thunder-flask`, `smoke-bomb`, `whetstone`, `armor-solder`, `wool-lining`, `fate-stone`, `gold-pouch`, `fate-die`, `teleport-scroll`. They share the `48 × 48` technical contract but remain a separate icon family from equipment and resource counters. Fate Die uses hard colored pixel highlights, not baked external glow.

Important: the core now owns one real equipped item per slot plus a separate Boots Nudge charge. It has comparison and replacement choices, but deliberately still has no inventory, rarity, or duplicate-conversion system.

Current normalized `48 × 48` RGBA non-equipment resource assets:

- `damage-sword-v1.png`
- `armor-shield-v1.png`
- `life-heart-v1.png`
- `xp-essence-v1.png`
- `gold-coins-v1.png`
- `nudge-die-v1.png`
- `reroll-die-v1.png`

The primary roll control uses `rollbound/src/assets/pixel/dice/die-body-v1.png`, a normalized blank-face `64 × 64` RGBA body. Runtime pips are code-generated and are not baked into the bitmap.

## Most recent completed work

Chronological history follows. Earlier entries describe the state at the time; later decisions supersede removed UI and older balance numbers.

1. Removed the visible dark square, double neon frame and corner brackets from board tiles.
2. Kept the `88 × 88` tile element as an invisible technical cell.
3. Added category underglow and silhouette-following destination outlines.
4. Moved tile number, label and consequence chip to floating UI overlays.
5. Increased and outlined the hero sprite so it remains readable on dark Blank tiles.
6. Gave the temporary CSS-only tile families a common frameless ground-platform grammar during the transition.
7. Generated, alpha-cleaned, downsampled and mapped Gold, Treasure and Shop dioramas.
8. Generated, alpha-cleaned, nearest-neighbor normalized and mapped Event, Elite, Trap and Boss dioramas.
9. Removed the obsolete runtime CSS artwork now that every tile family is covered by the manifest.
10. Updated `AGENTS.md`, README, PROGRESS and the tile asset contract to reflect the approved direction and the full 13-asset board set.
11. Defined a separate equipment icon contract with no board platform or baked-in UI.
12. Generated, alpha-cleaned and nearest-neighbor normalized the first Weapon, Armor and Boots/Utility upgrade trio.
13. Added the initial three-asset equipment manifest, shared renderer, explicit missing fallback and deterministic Gear Lab.
14. Corrected the equipment semantics: Boots / Utility and Nudge are separate; Nudge now uses a resource glyph in HUD, Treasure and Shop.
15. Generated and normalized Trækølle, Stoftunika and Slidte sandaler as the actual starter loadout.
16. Expanded the manifest to six assets with explicit slot and starter/upgrade tiers.
17. Added minimal visual loadout IDs to Hero state. Weapon and Armor rewards now change the corresponding HUD asset without changing their balance effects.
18. Compacted Level into the portrait and used the released HUD space for three truthful equipment slots.
19. Restored the `+1 Nudge` treasure name to `Heldig terning`; it does not alter the Boots slot.
20. Defined a separate non-equipment resource icon grammar for Life/HP, Gold, Nudge and Reroll.
21. Generated the four icons with built-in ImageGen, removed false checkerboards with targeted alpha passes, and normalized them to transparent `48 × 48` PNGs.
22. Added a four-asset resource manifest, shared renderer, explicit missing fallback and deterministic Resource Lab.
23. Replaced temporary HP/Gold/Nudge/Reroll glyphs in HUD, Treasure and Shop while preserving the equipment/resource boundary.
24. Increased Nudge and Reroll presentation sizes in HUD and choice cards; Nudge also uses restrained vertical renderer scaling so its die is readable without replacing the clean source asset.
25. Restored full visual presence to Blank / Road tiles, including after passage, while keeping their quieter neutral palette.
26. Replaced the thick solid gray connectors with a broken dark pixel-stone trail behind the dioramas.
27. Added distinct but restrained upcoming, traveled and active-movement trail states without changing board logic.
28. Replaced visual-only loadout IDs and permanent reward stacking with fixed per-item effects and slot replacement.
29. Added Treasure/drop/Shop equipment offers with current-vs-new comparison and explicit Equip/Keep actions.
30. Activated Stivinderstøvler as a real Boots upgrade with one separately displayed free Nudge charge.
31. Added Boots to Treasure and Shop while preserving Nudge as a separate resource asset and count.
32. Filtered already equipped upgrades from future loot and disabled them in Shops, avoiding duplicate inventory scope.
33. Completed real seed 0 QA for Weapon, Boots, Keep-current, Boots-charge spending, six-row Shop, and a `390 × 844` narrow layout.
34. Generated and normalized dedicated Damage-sword and Armor-shield HUD assets without conflating stats and equipped items.
35. Expanded the shared HUD-symbol manifest and Resource Lab from four to six assets.
36. Replaced the temporary Damage and Armor glyphs in the live HUD with the new pixel assets.
37. Introduced a minimum readable type hierarchy and brighter secondary copy across tiles, destinations, Shop, Treasure and equipment comparison.
38. Removed whole-card disabled fading, added explicit Shop disabled reasons and added current-to-new equipment effect deltas.
39. Removed responsive board transform scaling; narrow screens now keep native pixel scale and scroll only inside the board panel.
40. Added responsive `3 / 2 / 1` Shop columns, stacked mobile destinations, compact full-width boss readiness and a denser mobile HUD/header layout.
41. Added progressbar, list/current-step, focus and descriptive-label semantics without changing the game reducer.
42. Verified desktop seed 2, real Treasure/equipment and Shop states, Resource Lab `6/6`, and a `390 × 844` viewport with no global overflow or browser errors.
43. Generated and normalized a dedicated blank-face 64×64 D6 body in the approved plum, ivory, cyan and magenta pixel palette.
44. Rebuilt `PixelDie` around the asset with deterministic, accessible pip layouts for all six faces.
45. Reworked the idle Roll area as a compact dice altar with a stronger interaction hierarchy and native mobile layout.
46. Added the UI-only anticipation, stepped tumble, impact, particle and delayed destination-reveal sequence to both Roll and Reroll.
47. Added action locking, old-target suppression and a 150 ms reduced-motion fallback while preserving reducer and seeded RNG behavior.
48. Verified normal Roll, Reroll, deterministic result matching and the new roll area at desktop and `390 × 844` without global overflow.
49. Generated and normalized a dedicated 80×80 hooded hero bust matching the existing board-sprite identity.
50. Generated and mapped a cyan-violet 48×48 XP essence asset, expanding Resource Lab to `7/7`.
51. Rebuilt the portrait frame and moved Level into a separate gold/cyan plate outside the hero's face.
52. Replaced the white prototype bars with shared notched, segmented, three-tone HP and XP housings.
53. Added reducer-derived ghost damage, heal, XP and level-up feedback with simultaneous combat damage/XP handling.
54. Verified initial, real combat and real level-up states plus a `390 × 844` layout without global overflow or browser errors.
55. Removed the portrait card, diamond sigil, scanline and overlapping Level badge so the transparent hero bust stands directly against the HUD.
56. Moved Level and the next upgrade into one compact vitals heading, and replaced segmented bars with continuous fills plus external `current / max` values.
57. Preserved reducer-derived damage/heal/XP/level feedback and verified the redesign at desktop and `390 × 844` with no overflow or browser warnings.
58. Claude added core combat scripts plus tests for formula equivalence, run determinism and the dice-peek contract.
59. Claude replaced exact combat-price previews with approximate enemy-stat inspection and added fullscreen scenes for combat and interactive choices, including combat payout.
60. Claude approved the ceremonial ivory/red fate-ruler boss, elite heights of 85–95%, and corrected mobile combat sprites to `72 × 90` before the art batch.
61. Generated all seven enemy combat sprites with built-in ImageGen, first validating Goblin and Ogre as the smallest/largest normal silhouettes.
62. Removed baked checkerboard backgrounds, normalized with nearest-neighbor to `64 × 80` true-alpha canvases, and registered all seven sprites without changing mapping/fallback logic, core, CSS or scene playback.
63. Verified every sprite in the live combat scene at desktop/mobile sizes, including attack/hit/fallen states and a reduced-motion mobile run; restored every temporary QA alias.
64. Added repeatable normalization and asset-contract checks, documented exact prompts/provenance and the existing floor/hero baseline discrepancy, and passed lint, build and all five engine tests.

The historical file `rollbound/design/rollbound-pixel-ui-mockup-v1-prompt.md` mentions visible tile frames. Treat it only as the origin mockup. The newer rules in `AGENTS.md` and `tile-asset-contract-v1.md` supersede that part of the prompt.

## Completed engine and item milestones (Claude, 2026-09-02)

These are completed upstream milestones, not a future-work list. The intermediate calibration numbers document the progression to Batch C; only the final Batch C configuration is current.

1. damage ranges are live. `dmgMin`/`dmgMax` on hero and all enemies, rolls drawn from the run's seeded RNG inside `simulateFight` (rng is now a required parameter), shift-model bonuses, `fightOutcome` downgraded to an EV heuristic for bots only. Calibration: variance cost win rate as predicted (46.4% at boss 105) → boss reduced to **90 HP** → balanced **57.7%** / aggressive 34.0% / cautious 28.2% (10k engine-sim runs). Track deaths roughly doubled — forced fights can now go wrong, which is the intended price of variance. Tests rewritten: degenerate-range equivalence with the closed form, roll-bounds/well-formedness properties, EV sanity, per-seed determinism (6 tests green). Combat scene got slower pacing (all timing in `presentation.ts`), stat lines under both HP plates (DMG range, ARM, hero level) and larger damage floats scaled by roll size.

2. the data-driven item system is live with the full approved roster — 30 gear items in `src/core/items.ts` (balance data, 18-kind effect vocabulary), weapons own their damage ranges, combat mods execute in `simulateFight` with new event kinds, and board hooks cover dieTransform (via the new core-owned `peekRoll`), freeRerollOn1, visibility, goldBonus, campHeal/campNudge, trapImmune and camp recharge. Loot model: treasure = tier-weighted choose-1-of-3, elites drop guaranteed gear, normal enemies drop utility only, and the shop generates **5 seeded slots, each 100% random gear/service, single-purchase** (`ShopOffer[]` + `BUY {index}`). Trail-boots now recharge at camp; the bot values items via `gearScore`. Calibration: boss 90→85 → balanced **55.3%** / aggressive 38.3% / cautious 40.5% (10k runs) — archetype spread narrowed sharply (was 34/58/28). At this milestone the 24 new items still used slot-placeholder glyphs; the completed icon batch has now replaced those placeholders.

3. batch C is live — **the playtest gate is reached.** Ten consumables with 2 slots (`CONSUMABLES` in `src/core/items.ts`): heals, bombs (opening damage as `cast` events in the combat script), Røgbombe (flee, blocked vs the boss), permanent whetstone, nudge/reroll stone, gold pouch, Skæbneterning (roll two choose one → new `chooseRoll` phase) and Teleport-rulle (choose 1-6 → new `teleport` phase with destination previews). The pre-combat beat renders as a fullscreen scene (enemy, approximate stats, use/fight buttons) ONLY when the player holds relevant consumables. Shop slots now roll thirds gear/consumable/service; consumable purchases require a free slot ("SLOTS FULDE"). Normal enemy drops are 50/50 utility/consumable. HUD shows held items (`ITEMS x/2`); idle panel has use-buttons; the classic UI handles all new phases. Fixed in passing: the combat scene mis-derived HP on `lifesteal` events. Calibration unchanged at boss 85: balanced **56.4%** / aggressive 41.8% / cautious 38.4% (10k runs).

## Completed item-icon batch (Codex, 2026-09-02)

- Produced 24 new gear and 10 consumable PNGs with built-in ImageGen, preserving original source outputs and the six approved legacy equipment assets. Normalized new art with targeted alpha cleanup, nearest-neighbor sampling, a maximum 36×36 silhouette and shared baseline on 48×48 RGBA canvases. Exact prompts, raw sources and family QA are documented under `rollbound/design/`.
- Mapped all 30 gear and all 10 consumables. Added the separate consumable manifest/component; moved the old glyph implementation unchanged into a standalone fallback module and re-exported it from ScenePhases to avoid import cycles. Replaced icon usage in HUD, idle-use, Shop, Treasure and pre-combat without altering reducer logic.
- Expanded EquipmentLab into the full gear/consumable catalog with names, effects and native HUD/card scale examples. Asset failures track the failing source rather than sticking to a component after the item changes.
- Fixed scoped presentation issues found during QA: the HUD grid now gives consumables their own wrapping row without squeezing the original stats areas; equipment descriptions span their comparison card width; relevant long copy wraps and disabled explanations remain readable. No per-item CSS size hack, balance change or new mechanic was introduced.
- Passed lint, production build, all 20 tests in four files and the 40/40 item-PNG contract check. Broad actual-component fixtures are distinguished from real gameplay in the gear and consumable QA records. No temporary fixture/debug hook was added to production source.

## Recommended next work

Since the original icon batch, Claude added the readability v2 font/scale pass, HUD inspection, item-bound buffs and the Inventory scene. Whetstone, Armor Solder and Wool Lining improve the currently equipped item and their bonuses are lost on replacement. Inventory opens with I or the ITEMS control; it replaces the old idle-use buttons. These features are already upstream, not new scope for the icon work. The two previously pending buff icons are now complete.

**The playtest gate is reached:** combat screen + item batch + consumables are implemented and their production icons are mapped.

1. Play **5–10 human runs**. Observe whether Roll → Evaluate → Nudge/Reroll/Accept produces the situational decisions described in AGENTS.md. Record concrete seed/roll/choice examples and whether the revised item offers, pre-combat tools and movement consumables are understandable and fun. Do not infer fun from the sim win rate alone.
2. Optionally address the separately documented combat floor-line/hero-baseline discrepancy as a focused presentation-only pass. This is not an icon defect and should not introduce per-enemy offsets or gameplay changes.
3. Use the playtest findings to choose the next scoped iteration; do not automatically expand content, add systems or rebalance before those observations.

## Simulation authority and calibration history

**The balance authority is `rollbound/scripts/simulate.ts`**, invoked with `npm run sim -- 10000` from `rollbound/`. It runs heuristic bots directly on the real engine reducer, including gear and consumable policies. Current upstream Batch C results: balanced **56.4%** / aggressive **41.8%** / cautious **38.4%**, boss HP **85**, DMG **8–12**, ARM **2**. This icon-only batch did not modify the configuration or rerun calibration.

Historical checkpoints retained for provenance:

- The frozen v0.9 non-stacking JS simulation reported balanced **55.7%** at boss 105/10/2, with aggressive around 33%. Its approximate Boots-charge model and the old Shop dominance observation describe that old ruleset, not current items.
- Engine-sim migration cross-validation reported balanced **56.9%** / aggressive **34.2%** / cautious **27.0%** over 10k runs at the old boss 105/10/2, within roughly one percentage point of the JS simulation.
- Damage-range and Batch B calibrations are recorded in the completed milestones above; Batch C supersedes their boss/win-rate settings.

The root `sim/` directory is frozen history of the v0.1→v0.9 calibration (see `sim/FINDINGS.md`, Opfølgning 4–5) and must not be extended. Human play patterns can differ from the heuristic bots even when both use the same reducer.

## Known limitations

- Event content remains placeholder-like and needs actual trade-off design later.
- Combat sprites share their canvas baseline, but the existing scene's floor rule sits below it (26px duel padding + 2px border), and the existing hero's visible feet are higher due to transparent art padding. Mobile stacks the duel. This was documented, not compensated with per-enemy CSS or altered assets; a scene/hero layout pass is separate from this batch.
- Enemy art has one frame per character; hit/attack/fallen feedback uses existing CSS. Additional frames and backdrops remain future scope.
- No sound pass exists.
- There is deliberately no inventory, rarity, selling, or duplicate conversion; equipped upgrades are filtered instead.
- The current engine simulation covers the live gear/consumable rules, but its item/route policies are heuristics. Human adaptation, comprehension and enjoyment still require the planned playtest.

## Guardrails for the next contributor

- Do not change game-core behavior while working on visual assets.
- Do not reintroduce exact HP-cost forecasts for fights (board chips, destination previews, boss-price panels, lethal flags) once removed; combat tiles expose type and approximate stats via hover/click only.
- Do not replace seeded RNG. Keep balance data in the existing core data files (`src/core/config.ts` and `src/core/items.ts`), never in icon manifests or presentation components.
- Do not reintroduce visible rectangular board-tile cards.
- Do not fade visited Blank / Road dioramas or replace the broken dark trail with solid connector bars.
- Do not bake labels, costs, rewards, numbers, glows, or selection states into PNG assets.
- Do not add stone platforms to equipment or resource icons.
- Do not turn the current Equip/Keep flow into a broad inventory or rarity system without explicit approval.
- Do not reintroduce whole-board responsive scaling; preserve native pixel scale and internal board scrolling.
- Do not reduce runtime functional text below the tiers in `readability-contract-v1.md` or hide disabled reasons through low opacity.
- Do not move dice animation state into the reducer, add visual randomness to the RNG stream or bake pips into the D6 body asset.
- Do not reintroduce a portrait backing card, diamond sigil, overlapping Level badge or segmented bars; keep values outside the fills and keep HUD feedback isolated from reducer-owned HP, XP and Level.
- Never map a Nudge resource directly to the Boots slot; Stivinderstøvler's separate charge is the explicit item effect.
- Never apply equipment-slot frames or colors to non-equipment resource icons.
- Preserve true alpha transparency and nearest-neighbor downsampling.
- Use versioned filenames; do not overwrite an approved asset silently.
- Verify new assets in their relevant Tile/Gear/Resource Lab and on at least one deterministic playable seed; distinguish fixture rendering coverage from naturally reached gameplay.
- Update this file when the completed-work list or recommended next work changes.
