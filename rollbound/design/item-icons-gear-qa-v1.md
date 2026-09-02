# Gear icon integration QA v1

Verified 2026-09-02 using the running Vite app at `http://127.0.0.1:5173` and an independent agent-browser Chromium session (`gear-icons-qa`). Scope: icon mapping and presentation; no balance/core edits.

## Story and boundaries

A gear offer reads its item ID from reducer state, resolves that ID through `EQUIPMENT_ASSETS`, renders the actual PNG in Treasure/Shop and current-vs-new comparison, and updates only the corresponding HUD slot when equipped. Keeping an offer must leave the loadout and resources unchanged.

This is a client-only React/reducer flow. No API/database boundary exists in this task.

## Full catalog coverage

An ignored local fixture mounts the **actual production components** (`PixelHud`, `ShopPanel`, `TreasureChoice`, `EquipmentOffer`, `SceneShell`) with deterministic `newGame(15)` state and explicitly selected item IDs. It imports the real CSS and wraps scenes in `pixel-page`, preserving the production font inheritance. The fixture has no production hooks and does not change any core file.

Fixture filenames are `tmp.local/gear-fixture.html`, `gear-fixture.tsx`, `gear-metrics.js`, and `gear-qa.ps1`. They are local QA artifacts, not shipped app routes. Each viewport sweep covers 56 pages. Gear is grouped into five shop offers, three treasure offers, one comparison offer or one item from each slot in the HUD. For rendering completeness, fixtures include starter items in offer lists; this does **not** claim starters can spawn in real shops or treasure.

| Actual component context | Desktop 1280×900 | Mobile 390×844 | Runtime image size |
|---|---|---|---|
| ShopPanel (6 pages) | 30/30 IDs | 30/30 IDs | 40×40 |
| TreasureChoice (10 pages) | 30/30 IDs | 30/30 IDs | 40×40 |
| EquipmentOffer (30 pages) | 30/30 offered IDs | 30/30 offered IDs | 40×40 |
| PixelHud (10 pages) | 30/30 equipped IDs | 30/30 equipped IDs | 30×30 |

All final sweeps reported: no failed images, no placeholder/missing fallbacks, no detected copy overflow, no page horizontal overflow and no Vite overlay. Every loaded gear PNG reported natural dimensions 48×48. Representative screenshots were inspected for silhouette readability, scaling, label/effect separation and layout, not just image-network success.

Fixture readiness explicitly waits for rendered equipment before metrics. An early mobile sweep sampled two pages before React mounted; the complete ready-gated sweep was rerun and covered all 30 IDs in every context.

## Gear Lab

The real `/?ui=equipment` route was checked at both viewports:

- `30/30 GEAR MAPPED`.
- 30 gear catalog cards with names/effects.
- 156 gear image instances across the starter pairs, size rows and catalog; all loaded correctly with no gear fallback.
- Render sizes 96×96 (lab), 40×40 (card) and 30×30 (HUD).
- No horizontal page overflow at 390 px.

Consumable coverage is recorded separately by its integrating agent; it is not inferred from these gear checks.

## Real gameplay: equip and keep

Both branches were exercised through normal UI clicks on the real `/?seed=2` route, without state injection:

1. Roll 2 → accept Gold at field 2.
2. Roll 3 → accept Goblin at field 5 → victory payout → Continue.
3. Roll 2 → Nudge +1 → Treasure at field 8.
4. Treasure offers Elverstøvler, Guldtrådssko and Bombe. Select Elverstøvler.

Desktop **Equip**:

- Comparison shows Slidte sandaler and the new Elverstøvler PNG.
- HUD changes `worn-sandals` → `elven-boots` only.
- Weapon `wood-club` and Armor `cloth-shirt` remain unchanged.
- Existing state remains HP 43/50, XP 15/20, DMG 7–12, ARM 0, Gold 14, Nudge 1, Reroll 1; these are unchanged by equipping the movement-effect boots.
- The HUD slot's accessible label becomes `BOOTS: Elverstøvler`.

Mobile **Keep current**:

- Repeat the same seed and normal actions.
- Choosing Keep leaves all three starter IDs and the same HP/XP/stats/resources unchanged.
- The scene closes back to the board and Roll remains available.

Temporary screenshots: `gear-real-seed2-treasure.png`, `gear-real-seed2-compare.png`, `gear-real-seed2-equipped.png`, `gear-real-seed2-compare-mobile.png`, `gear-real-seed2-kept-mobile.png`. Some immediate real-scene captures include the existing entry fade; settled fixture captures separately verify final layout.

## Fallbacks

The ignored fixture alone temporarily removes `heavy-greaves` from its in-memory manifest: the explicit Boots glyph `⇶` renders with accessible label `Tunge grever` and `role="img"`. A separate invalid-image-source fixture renders the error `!` with the existing descriptive label and image role. Neither case changes the source manifest or the running game route.

## Readability issue found and resolved

Initial QA found the existing equipment comparison description auto-placed in the 48 px icon column, wrapping short damage ranges and overflowing words such as `IGNORERER`. The integrating agent fixed production CSS so the effect span (excluding the icon wrapper) spans the full article width and text can wrap; names also retain a minimum width of zero and wrap.

All 30 comparisons were then rechecked at both viewports using the correct production wrapper/font. No detected effect/name overflow remained. Stivinderstøvler's long camp-recharge description was additionally checked in a settled mobile screenshot. No per-item sizing or artwork workaround was used.

## Verification limits

- The broad catalog test proves real-component rendering, not that every item was naturally obtained in a separate full run.
- Real reducer/UI behavior is covered by the seed 2 equip/keep branches; unit tests and build/lint are run separately by the main agent.
- This agent changed only ignored QA files and this document during integration QA. Production fixes belong to the main agent.
