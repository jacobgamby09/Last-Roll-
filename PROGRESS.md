# Rollbound — progress and agent handoff

Last updated: 2026-09-02

This file is the current operational handoff for Claude, Codex, or another contributor. Read `AGENTS.md` first for the game design constraints, then this file for the latest implementation state. Update this document after material code, balance, asset, or design changes.

## Current status

Rollbound is a playable Vite + React + TypeScript prototype with a UI-free seeded engine, fullscreen encounter/choice scenes and a pixel-art presentation. The seven-enemy combat sprite batch is complete; simulation on the real engine is the next implementation workstream.

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
- Upstream baseline for this batch: `66b61de` (approved boss concept, elite height bands and mobile 4:5 aspect), after `2ea5597` (fullscreen scenes) and `6b6665c` (combat script).
- The earlier hero-status correction and v0.9 simulation revalidation are already in repository history, not pending local work. This change adds the seven combat sprites, their manifest registration, normalization/verification scripts and handoff notes.
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
```

The optional asset verification command requires Pillow; the runtime app does not depend on Python.

Useful routes:

- `/?seed=2` — deterministic board containing Blank, Combat, Camp, Gold and Treasure in the first visible section.
- `/?ui=tiles` — Tile Lab for all tile families, normalized assets, hero scale and manifest coverage.
- `/?ui=equipment` — Gear Lab for the Weapon, Armor and Boots/Utility icon contract at lab, card and HUD sizes.
- `/?ui=resources` — Resource Lab for Damage, Armor, Life/HP, XP, Gold, Nudge and Reroll at lab, card and HUD sizes.
- `/?ui=classic` — original prototype UI retained as a behavioral reference and fallback.

Latest verification:

- `npm run lint` passes.
- `npm run build` passes.
- `npm test` passes (2 files, 5 tests).
- Combat sprites: all seven verified in the live seed 2 combat scene at `1280 × 800` and `390 × 844`, including attack, hit and fallen states; reduced-motion verified on mobile. Non-Goblin art was temporarily aliased onto the seed 2 Goblin for QA, then restored to the canonical mapping. No fallback, overflow, browser error or warning detected.
- Combat PNG contract verification passes `7/7`: `64 × 80` RGBA, binary alpha, bottom baseline and tier height bands. See `rollbound/design/combat-sprite-batch-v1.md` for exact prompts, normalization and the existing scene floor-offset observation.
- Tile Lab reports `13/13 ASSETS MAPPED`.
- Gear Lab reports `6/6 ASSETS MAPPED`.
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
- Combat resolves through a combat script: `simulateFight` in `src/core/combat.ts` produces the blow-by-blow event list, the reducer applies its result atomically and stores it as `state.lastCombat` (with `state.combatSeq` as the new-fight signal for the UI, since structuredClone breaks reference identity). Equivalence with the old closed-form math, run determinism, and the dice-peek contract are locked by `npm test` (vitest: `combat.test.ts`, `engine.test.ts`).
- Fullscreen scene system (2026-09-02): every interactive phase renders as a takeover on the shared `SceneShell` (`src/pixel/SceneShell.tsx`) — combat playback (`CombatScene.tsx`, driven 1:1 by `lastCombat`: intro → accelerating exchange → outcome → payout inside the scene, click/space skips, reduced-motion jumps to the static result, timing in `presentation.ts`), plus treasure, equipment comparison, shop, level-up and game over via `ScenePhases.tsx`. Victory payout shows XP/gold/drop deltas, rotation level-up fanfares, and embeds the drop Equip/Keep comparison; defeat ends inside the scene. The bottom action panel now only owns idle/rolled/movement/roll-fx. All seven configured enemies now use dedicated combat sprites; tile-diorama fallback remains for unknown/unmapped enemies and failed asset loads (`combatSpriteAssets.ts` + `combat-sprite-contract-v1.md`).
- Equipment is now a reducer-owned offer flow for Treasure, combat drops, and Shops with explicit Equip/Keep actions.
- Equipment effects replace the effect in one slot rather than stacking permanent bonuses; equipped upgrades are removed from future loot and disabled in Shops.
- The first upgrade effects are Slebet klinge `+3 Damage`, Jernplade `+1 Armor`, and Stivinderstøvler `1 free Nudge charge`.

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
- `rollbound/src/pixel/equipmentAssets.ts` — equipment icon manifest and semantic mapping.
- `rollbound/src/pixel/EquipmentIcon.tsx` — shared icon renderer with explicit error fallback.
- `rollbound/src/pixel/EquipmentLoadout.tsx` — three-slot HUD renderer driven by the hero's visual loadout IDs.
- `rollbound/src/core/equipment.ts` — fixed item definitions, effect replacement, ownership checks, and Boots/Nudge accounting.
- `rollbound/src/pixel/EquipmentLab.tsx` — deterministic equipment style and scale QA.
- `rollbound/src/pixel/resourceAssets.ts` — non-equipment resource manifest and Treasure mapping.
- `rollbound/src/pixel/ResourceIcon.tsx` — shared resource renderer with explicit error fallback.
- `rollbound/src/pixel/ResourceLab.tsx` — deterministic resource silhouette and scale QA.
- `rollbound/scripts/normalize_hud_asset.py` — deterministic nearest-neighbor normalization for `48 × 48` HUD assets.
- `rollbound/src/pixel/pixel.css` — visual system and asset-as-tile states.
- `rollbound/design/tile-asset-contract-v1.md` — canonical production and alpha-pass contract.
- `rollbound/design/equipment-asset-contract-v1.md` — canonical equipment production, mapping and normalization contract.
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

Current normalized `48 × 48` RGBA equipment assets:

- `wood-club-v1.png`
- `rusted-sword-v1.png`
- `cloth-shirt-v1.png`
- `worn-plate-v1.png`
- `worn-sandals-v1.png`
- `trail-boots-v1.png`

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

## Recommended next work

The board, first functional equipment slice, and first non-equipment resource family are complete. **The balance revalidation is done (2026-09-02):** the simulation now models non-stacking equipment (`CONFIG.equipment` in `sim/simulate.js`, results in `sim/FINDINGS.md` section "Opfølgning 4"). Balanced bot wins **55.7%** under the live ruleset with boss 105/10/2 — inside the 55–70% target band, so no boss rebalance is needed. Aggressive dropped to 33% (stacking damage is gone) and shop-Boots at 18g is strictly dominated by the 8g Nudge.

Formal playtesting is deliberately deferred until the playtest gate is reached: combat screen + first item batch + consumables (decided 2026-09-02).

Next work (combat script, fullscreen scenes, combat screen AND the seven enemy sprites are DONE, 2026-09-02):

1. Port the simulation to run on the real engine reducer so rule changes are measured without drift — required before damage ranges land.
2. Damage ranges for hero and enemies (decided 2026-09-02, see `GDD.md` changelog and `AGENTS.md` Combat Stats): `simulateFight` uses its reserved rng parameter, config converts flat values EV-preserving, range width becomes a data-driven identity axis for weapons/items/enemies, and the sim recalibrates win rates the same day. No miss/dodge/crit — a low roll still hits.
3. Data-driven item system + effect vocabulary (armor penetration, first strike, lifesteal, camp triggers, range width) to prepare for many items per slot and consumables; keep the shop inventory deliberately narrow. New combat effects extend the `CombatEvent.kind` union.
4. Differentiate the Boots effect from a raw Nudge (e.g. recharge the Boots charge at each Camp, per the GDD's Traveler's Boots) so the slot is a board-build choice rather than an expensive consumable.

## Known limitations

- Event content remains placeholder-like and needs actual trade-off design later.
- Combat sprites share their canvas baseline, but the existing scene's floor rule sits below it (26px duel padding + 2px border), and the existing hero's visible feet are higher due to transparent art padding. Mobile stacks the duel. This was documented, not compensated with per-enemy CSS or altered assets; a scene/hero layout pass is separate from this batch.
- Enemy art has one frame per character; hit/attack/fallen feedback uses existing CSS. Additional frames and backdrops remain future scope.
- No sound pass exists.
- There is deliberately no inventory, rarity, selling, or duplicate conversion; equipped upgrades are filtered instead.
- Balance is revalidated for the non-stacking ruleset (v0.9: balanced 55.7%), but the sim bot approximates the Boots charge as +1 Nudge and always equips strict upgrades; human decision patterns may differ.

## Guardrails for the next contributor

- Do not change game-core behavior while working on visual assets.
- Do not reintroduce exact HP-cost forecasts for fights (board chips, destination previews, boss-price panels, lethal flags) once removed; combat tiles expose type and approximate stats via hover/click only.
- Do not replace seeded RNG or move balance values out of `src/core/config.ts`.
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
- Verify new assets in Tile Lab and on at least one deterministic playable seed.
- Update this file when the completed-work list or recommended next work changes.
