# Rollbound — prototype v1

Boardgame-inspireret roguelike. Se `../AGENTS.md` for designinstruks og `../sim/FINDINGS.md` for balance-kalibrering.

## Kør

```
npm install
npm run dev
```

## Struktur

- `src/core/` — UI-fri game engine (ren reducer, seedet RNG, deterministisk combat)
  - `config.ts` — **alle balance-tal** (v0.8, sim-verificeret: balanced bot 63,7% win). Ingen tal må hardcodes andre steder.
  - `engine.ts` — state machine: ROLL → NUDGE/REROLL/ACCEPT → resolve → upgrade
- `src/ui/` — React-komponenter (HUD, track, action-panel, log)

## Config-flags til playtest

- `levelUpMode: 'rotation' | 'choice'` — fast ATK→HP→Armor-rotation (default) eller vælg-1-af-3
- `drops: { normal, elite }` — loot-chance ved kills (default 25% / 100%)

Et run kan reproduceres fra sit seed (vises i UI).
