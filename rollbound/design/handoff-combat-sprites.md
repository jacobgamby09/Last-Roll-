# Rollbound — opgave: Combat-sprite-batch v1 (7 enemy sprites)

Handoff-prompt til Codex, 2026-09-02. Læs `AGENTS.md` → `PROGRESS.md` → `rollbound/design/combat-sprite-contract-v1.md` før start.

## Status siden sidste session (alt committet og pushet til `main`, seneste commit `2ea5597`)

Claude har bygget videre oven på pixel-UI'et og equipment-arbejdet:

1. **Combat script i core:** `simulateFight` i `rollbound/src/core/combat.ts` producerer nu hver kamp som en slag-for-slag event-liste. Reduceren afgør stadig kampen atomisk og gemmer scriptet som `state.lastCombat` (+ `state.combatSeq` som nyt-kamp-signal, fordi structuredClone brækker reference-identitet). En vitest-suite (`npm test`) låser ækvivalens med den gamle formel, run-determinisme og dice-peek-kontrakten.
2. **Fullscreen-scene-system:** ALLE interaktive faser (combat, treasure, equipment-sammenligning, shop, level-up, game over) renderes som fullscreen-takeovers over det stadig-mountede board via en fælles `SceneShell` (`src/pixel/SceneShell.tsx` + `ScenePhases.tsx`). Bund-panelet ejer kun idle/rolled/movement/roll-fx.
3. **Combat screen:** `src/pixel/CombatScene.tsx` afspiller `lastCombat` som duel (hero venstre, fjende højre): intro → accelererende udveksling med HP-plates, flydende skadetal og turtekst → outcome → **payout inde i scenen** (XP/guld/drop-deltas, rotation-level-fanfarer, indlejret Equip/Keep ved drops; nederlag ender i game over i scenen). Klik/space skipper; reduced-motion hopper til statisk resultat. Al timing bor i `src/pixel/presentation.ts`.
4. **Eksakt-pris-UI'et er fjernet** (bindende beslutning, se `AGENTS.md` og `GDD.md`-changeloggen): ingen HP-chips på kampfelter, ingen skades-prognoser, ingen ☠-flag, intet boss-pris-panel. Kampfelter inspiceres via hover/klik/fokus og viser interval-stats (`approxEnemyStats` i `src/ui/preview.ts`).
5. Balance er sim-genverificeret (v0.9: balanced 55,7 % med boss 105/10/2). Damage-ranges er BESLUTTET men implementeres senere (efter sim-på-engine) — de vedrører ikke denne opgave.

## Opgaven

Producér og registrér de **7 enemy-sprites** til kampscenen. Scenen er allerede asset-agnostisk: hver fjende falder pt. tilbage til sit tile-diorama, så du kan levere og verificere én sprite ad gangen.

| Fil (`src/assets/pixel/combat/`) | Fjende (fra `config.ts`) | Tier-farve |
|---|---|---|
| `goblin-v1.png` | Goblin (enemies.early) | rød `#ff3b4d` |
| `bandit-v1.png` | Bandit (enemies.mid) | rød `#ff3b4d` |
| `ogre-v1.png` | Ogre (enemies.late) | rød `#ff3b4d` |
| `elite-early-v1.png` | Goblin-høvding (elites.early) | magenta `#ff2bd6` |
| `elite-mid-v1.png` | Skyggeridder (elites.mid) | magenta `#ff2bd6` |
| `elite-late-v1.png` | Trold-konge (elites.late) | magenta `#ff2bd6` |
| `boss-v1.png` | Bossen | ivory/rød `#fff2df` |

## Hårde krav (fra contract v1 — afvig ikke)

- **Canvas: 64 × 80 px, RGBA, ægte alpha-transparens**, fælles ground-baseline ved nederste kant.
- **Nearest-neighbor** ved al skalering/normalisering; ingen antialiasing; ingen delvis alpha ud over bevidste 1px-kanter (samme alpha-pass-disciplin som tile-batchen).
- **Karakteren vender VENSTRE** (mod heroen). Scenen spejler ikke sprites.
- Silhuetten skal kunne læses ved **96 px renderet højde** på den nær-sorte plum-baggrund.
- **Størrelseshierarki:** normale fjender fylder ~70-85 % af canvas-højden; bossen må bruge hele canvasset, så den læses større.
- **INTET bagt ind i bitmap'en:** ingen baggrund, platform, ground patch, tile-ramme, label, navn, tal, HP-bar, pris, selection-state, glow, drop shadow eller UI af nogen art. Hit-flash, outlines og skadetal er runtime-UI.
- **Stil:** samme dark-fantasy 16-bit-sprog, palette-disciplin og outline-behandling som board-heroen (`hero-idle-*-v1.png`) og tile-dioramaerne. Identitet skal afspejle stat-profilen: Goblin lille og hurtig, Ogre massiv, elites ornamenteret i deres tier-farve, bossen ceremoniel.
- **Versionerede filnavne**; overskriv aldrig et godkendt asset.

## Registrering og QA

1. Importér hver sprite og udfyld `COMBAT_SPRITES` i `src/pixel/combatSpriteAssets.ts` (id'erne findes allerede: `goblin`, `bandit`, `ogre`, `elite-early`, `elite-mid`, `elite-late`, `boss`). Rør IKKE `combatSpriteFor`-logikken eller fallback-mappingen.
2. Verificér hver sprite i den **live kampscene** på et deterministisk seed (fx `/?seed=2` — Goblin på felt 3 via rul 2 + Nudge +1), både desktop og `390 × 844`. Tjek: baseline sidder på grundlinjen, silhuetten læses, `is-attacking`/`is-hit`/`is-fallen`-animationerne ser rigtige ud, ingen asset-fejl-fallback, ingen console-fejl.
3. Elites og boss nås ikke let manuelt — verificér dem som minimum ved midlertidigt at pege en normal fjendes manifest-entry på asset'et under test (og fjern ændringen igen), eller find et seed med tidlig elite.
4. `npm run lint`, `npm run build` og `npm test` skal være grønne (denne opgave bør ikke kunne brække tests — fejler en test, er noget galt med din ændring).

## Guardrails (ufravigelige)

- Rør IKKE `src/core/` — ingen ændringer i reducer, RNG, config eller balance.
- Rør IKKE scene-/playback-logik, timing eller CSS ud over evt. rene sprite-relaterede finjusteringer af `.combat-sprite`-størrelser, hvis et asset kræver det (dokumentér i så fald hvorfor).
- Genindfør IKKE pris-visninger, ☠-flag eller boss-pris-paneler nogen steder.
- Ingen scope-udvidelse: ingen hit-frames, ingen combat-backdrops, ingen ekstra fjender — de er eksplicit fremtidige batches (backdrops får egen kontrakt senere).

## Når du er færdig

Opdatér `PROGRESS.md`: flyt sprite-opgaven fra "Next work" til completed-listen, notér evt. afvigelser/beslutninger, og lad punktet om sim-på-engine stå som næste. Commit og push til `main`.
