# Rollbound — prototype v1

Boardgame-inspireret roguelike. Se `../AGENTS.md` for designinstruks og `../sim/FINDINGS.md` for balance-kalibrering.

## Kør

```
npm install
npm run dev
```

## Struktur

- `src/core/` — UI-fri game engine (ren reducer, seedet RNG, deterministisk combat)
  - `config.ts` — **alle balance-tal**. Board/combat-baseline er v0.8; den nye equipment-adfærd kræver en ny samlet balance-simulering.
  - `equipment.ts` — datadrevne item-definitioner, slot-erstatning og Nudge-betaling fra Boots.
  - `engine.ts` — state machine: ROLL → NUDGE/REROLL/ACCEPT → resolve → upgrade
- `src/ui/` — React-komponenter (HUD, track, action-panel, log)

## Config-flags til playtest

- `levelUpMode: 'rotation' | 'choice'` — fast ATK→HP→Armor-rotation (default) eller vælg-1-af-3
- `drops: { normal, elite }` — loot-chance ved kills (default 25% / 100%)

Et run kan reproduceres fra sit seed (vises i UI).

## UI-versioner

- Pixel-UI'en er nu standard og bruger den eksisterende game-core.
- Den oprindelige prototype-UI er bevaret på `?ui=classic` som reference og fallback.
- Pixel-UI'ens første vertikale slice har et snoet board, rammeløse tile-dioramaer, neon-kodede tilefamilier, pixel-HUD samt det fulde Roll/Nudge/Reroll-flow.
- Boardet bruger en asset-as-tile-model: den synlige tile er dioramaet, mens en usynlig 88×88-celle bevarer layout, hitbox og forbindelser.
- Tretten normaliserede tile-assets dækker nu hele boardet: tre Blank-varianter, Combat, to Camp-varianter, Gold, Treasure, Shop, Event, Elite, Trap og Boss. Dertil kommer en fire-frame idle/walk-helt.
- Alle tilefamilier bruger nu rigtige PNG-dioramaer; de tidligere CSS-tegnede placeholders er fjernet fra runtime.
- Equipment-laget har seks 48×48 PNG-ikoner uden tile-platform: Trækølle, Stoftunika og Slidte sandaler som start-loadout samt Slebet klinge, Jernplade og Stivinderstøvler som upgrade-assets.
- Equipment er nu en funktionel vertikal slice: Treasure, drops og Shop åbner en sammenligning mellem nuværende og nyt item med `Udstyr`/`Behold nuværende`. Shoppen trækker først Gold ved `Køb & udstyr`.
- Slebet klinge giver `+3 Damage`, Jernplade giver `+1 Armor`, og Stivinderstøvler giver én gratis Nudge-charge. Allerede udstyrede upgrades fjernes fra loot-puljen og deaktiveres i Shoppen.
- Nudge er en separat board-control-ressource med sit eget terning-og-pile-asset. Den må ikke præsenteres som Boots eller skifte det viste Boots-asset.
- Damage, Armor, HP, XP, Gold, Nudge og Reroll har nu en separat familie af syv 48×48 HUD-symboler. De bruges i HUD, Treasure og Shop uden equipment-slotbehandling.
- Hero Status-blokken bruger et fritstående 80×80 bust-portræt, Level og næste bonus i samme statuslinje, ubrudte HP/XP-barer med værdier uden for fyldet samt korte damage-, heal-, XP- og level-feedbackeffekter.
- En samlet readability-pass har hævet funktionel tekst til mindst 9 px, gjort Shop- og reward-tekster wrap-bare, tilføjet eksplicitte disabled-årsager og bevaret boardets native pixelskala med intern scroll på smalle skærme.
- Bevægelse afspilles felt for felt i UI-laget; reduceren opløser stadig hele trækket deterministisk som én action.
- Roll-området bruger nu en fysisk 64×64 pixelterning med kodegenererede korrekte pips og en firefaset anticipation → tumble → impact → reveal-effekt. Roll og Reroll deler effekten uden ændringer i reducer eller RNG.
- Genererings- og alpha-prompts er gemt i `design/sprite-production-prompts-v1.md`, så næste asset-batch kan følge samme visuelle kontrakt.
- Normaliserede enkelt-assets ligger i `src/assets/pixel/tiles/`, `src/assets/pixel/equipment/` og `src/assets/pixel/hero/`; runtime-mappingen bor i `src/pixel/tileAssets.ts`, `src/pixel/equipmentAssets.ts` og `src/pixel/heroAssets.ts`.
- Den deterministiske asset-testside findes på `?ui=tiles`. Kontrakt og normaliseringsprompts er dokumenteret i `design/tile-asset-contract-v1.md`.
- Equipment-testen findes på `?ui=equipment`; kontrakten og prompts findes i `design/equipment-asset-contract-v1.md`.
- Resource-testen findes på `?ui=resources`; kontrakten og prompts findes i `design/resource-asset-contract-v1.md`.
- Den tværgående typografi-, responsive- og accessibility-kontrakt findes i `design/readability-contract-v1.md`.
- Terningens asset-, pip-, timing- og determinismekontrakt findes i `design/dice-roll-visual-contract-v1.md`.
- Portræt-, Level-, HP/XP- og feedbackkontrakten findes i `design/hero-status-visual-contract-v1.md`.
- `../PROGRESS.md` er den aktuelle agent-handoff og skal opdateres efter større implementationer eller designbeslutninger.
