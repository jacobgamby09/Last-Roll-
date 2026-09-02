# Consumable icon integration — QA v1

Date: 2026-09-02. Scope: ten consumable icons and their existing UI consumers; no core, RNG, catalogue, inventory, or balance changes.

## Verification method

The story is existing reducer-owned loot → held item → allowed use → combat result, with the same item identity rendered by a shared `ConsumableIcon`. This app is client-only; no API/database boundary is involved.

The existing Vite server at `http://127.0.0.1:5173` returned HTTP 200. Browser checks used an isolated `item-consumable-qa` agent-browser session. The normal app rendered meaningful content with no Vite error overlay or browser exception.

Live gameplay and presentation fixtures are reported separately below. Fixtures live only in ignored `tmp.local/`; they import actual production components and create local deterministic input states. They do not add hooks to the game, alter reducer rules, change manifests on normal game pages, or enter the production build.

## Live gameplay

### Seed 299: Bomb

Verified at `1280 × 800` and `390 × 844`:

1. Roll 1 and accept Treasure at field 1.
2. Treasure offers Stor eliksir, Bombe, and Heldig terning; choose Bombe.
3. HUD displays Bombe with its 40px icon and `ITEMS 1/2`; idle displays the 48px icon, full name and disabled reason `BRUGES FØR KAMP`.
4. Next roll is 5; accept Goblin at field 6.
5. Pre-combat displays the same 48px Bomb icon and `12 SKADE FØR KAMPEN`.
6. Use Bomb: its button disappears, inventory becomes empty, and `KLARGJORT: 12 ÅBNINGSSKADE` appears.
7. Fight: payout shows victory, `+15 XP`, `+2 GULD`, and `50 / 50` hero HP.

Bomb was a loaded `48 × 48` source in all three icon contexts. No page-level horizontal overflow, missing-Bomb fallback, browser exception, or Vite overlay was detected. The item was not made usable from idle just to facilitate QA.

### Seed 15: Shop

Roll 6 and accept the Shop at field 6. The seeded offers are Reroll service, Tordenkolbe, Nudge service, Skæbnesten and Tordenkolbe. With zero Gold, rows remain disabled and retain explicit missing-Gold explanations. Rechecked after all PNGs arrived: both Tordenkolbe occurrences and Skæbnesten load their correct 48px images at desktop and mobile sizes, with no fallback, page overflow or error overlay. Resource-service art remains separate from consumable art.

## Integration issue found and fixed

Batch C added a sixth HUD child while the desktop grid still defined five columns. Consumables occupied the wide stats track, stats squeezed into the 128px boss track, and the boss wrapped into the portrait track. This was present even with zero items.

The consumable section now explicitly occupies a full-width second grid row and wraps its item labels. The original portrait, vitals, equipment, stats and boss tracks remain intact. At 1280px, the stats track recovered from 128px to approximately 433px; all five stats are visible. At 390px the items remain separate from equipment and there is no global horizontal overflow. This is a scoped CSS layout correction, not a gameplay change.

## Explicit fallback and accessibility

- A fixture deletes the Bomb manifest entry before mounting: the original `✷` glyph renders instead of unrelated art.
- A separate fixture uses an invalid image data URL: the image-error handler switches to the same glyph without a JavaScript error.
- In both fallback cases, a non-decorative icon is exposed as an image named `Bombe`; decorative icons remain hidden from assistive technology beside visible names.
- The original `ConsumableGlyph` implementation is unchanged, moved to a standalone module and re-exported from `ScenePhases` to avoid an import cycle.
- Full item names are retained in HUD and action buttons. Names are 12px and use-button descriptions/disabled explanations are 11px. Existing Shop status metadata remains 9px. Only artwork is faded for disabled actions; copy remains at full opacity. Keyboard Tab navigation reached the Elixir use button with a visible solid 2px outline and its decorative icon hidden from assistive technology.
- Three focused component tests cover mapping, missing-art glyph fallback and accessible decorative/non-decorative semantics.

## Full asset-fixture coverage

Completed: 16 fixture states at each breakpoint, `1280 × 800` and `390 × 844` (32 states total). The ignored `check-consumable-fixtures.ps1` runner refuses to report success if any expected image is missing, falls back, has the wrong source size, causes page overflow, or dims an entire disabled button.

| Actual production component | Coverage at both breakpoints |
| --- | --- |
| `PixelHud` + `PixelActionPanel` | All 10 icons in 2-slot groups; 40px HUD and 48px use-button rendering |
| `TreasureChoice` inside `SceneShell` | All 10 icons, names and effects |
| `ShopPanel` inside `SceneShell` | All 9 saleable consumables, names, effects and prices |
| `PreCombatPanel` inside `SceneShell` | Bomb, Tordenkolbe and Røgbombe |
| Boss preparation | Røgbombe disabled with explicit boss restriction |
| Full-slot Shop | All visible consumable purchases disabled with `SLOTS FULDE` |

Guldpose is intentionally excluded from Shop because the catalogue does not sell it. Bomb, Tordenkolbe and Røgbombe remain idle-disabled. Fixtures do not simulate a purchase or change an inventory rule; the real Bomb acquisition/use flow above covers the reducer boundary independently.

All expected PNGs loaded as `48 × 48` sources. Screenshot review confirms distinct bottle sizes, Bomb versus Røgbombe silhouettes, separate stone/pouch identities, and separate Skæbneterning/Teleport-rulle art. Source alpha renders directly against the existing UI with no rectangular background. All 32 states passed the automated layout/load checks, and representative screenshots covering every icon were visually reviewed. No unexpected browser errors or warnings were reported. The isolated QA browser session was closed after verification.

Local evidence files use the `bomb-*`, `seed15-shop-*` and `consumable-*` prefixes in ignored `rollbound/tmp.local/`.
