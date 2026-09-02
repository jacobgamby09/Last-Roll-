# Rollbound — opgave: To consumable-ikoner (Panserlod + Uldfór)

Handoff-prompt til Codex, 2026-09-02. Lille, afgrænset batch. Læs `AGENTS.md` → `PROGRESS.md` og genbrug præcis samme pipeline som `item-icon-batch-v1.md`.

## Status siden ikon-batchen (alt committet og pushet til `main`, seneste `c587ce0`)

Claude har bygget videre efter playtest-feedback:

1. **Læsbarheds-pass v2:** global `UI_SCALE` (1.2) i `src/pixel/presentation.ts`, font-hybrid (pixel-font til titler/labels, system-sans til al funktionel tekst), sentence case i effekt-tekster, løftede kontrast-tokens. Bindende regler i `readability-contract-v1.md` Amendment v2.
2. **HUD-inspektion:** udstyrs-slots og consumables har hover/klik-tooltips (`HudTip.tsx`).
3. **Item-buff-consumables:** Slibesten (konverteret), **Panserlod** og **Uldfór** buffer ITEMET (via `hero.slotBuffs`) og mistes ved udskiftning; fri stakning; Equip/Keep advarer om buff-tab. 12 consumables i alt.
4. **Inventory-scene:** `I`-tasten / ITEMS-knappen i HUD åbner et fullscreen-overlay med kort, kontekst-previews og BRUG-knapper. Idle-panelets brugsknapper er fjernet.

## Din opgave

Producér og registrér **2 consumable-ikoner** — id'er og navne i `src/core/items.ts` (`CONSUMABLES`):

| Fil (`src/assets/pixel/consumables/`) | Item | Effekt | Visuel identitet |
|---|---|---|---|
| `armor-solder-v1.png` | Panserlod | +1 ARM på din rustning | loddekolbe/metallod + plade-motiv — "smedearbejde på rustning"; må gerne have en varm glød-tone i spidsen |
| `wool-lining-v1.png` | Uldfór | +8 max HP på din rustning | blødt uld-/stof-bundt eller fór-stykke — varme, komfort; dæmpede naturfarver |

De skal læses som **håndværks-materialer, man påfører udstyr** — beslægtede med Slibestenens udtryk, tydeligt adskilt fra flasker/bomber.

## Hårde krav (uændrede fra item-icon-batchen)

- `48 × 48` RGBA, ægte alpha, nearest-neighbor, INGEN platform/baggrund/label/tal/glow bagt ind.
- Samme stil og palette-disciplin som de 10 eksisterende consumable-ikoner.
- Versionerede filnavne; overskriv aldrig godkendte assets.

## Registrering og QA

1. Tilføj de to beskrivelser i `ART_DESCRIPTIONS` i `src/pixel/consumableAssets.ts` (glob-mappingen samler selv filerne op).
2. **Opdatér coverage-testen:** `src/pixel/itemAssets.test.ts` har en `pendingIcons`-liste med netop disse to id'er — tøm listen (`[]`), så testen igen kræver fuld dækning. `npm test` skal være grøn (22 tests).
3. Verificér begge i live UI: inventory-scenen (køb/saml op, eller kig i Gear Lab `?ui=equipment`, der viser consumable-manifestet med dækningstal — skal sige `12/12`).
4. `npm run lint`, `npm run build`, `npm test` grønne. Rør IKKE `src/core/` eller scene-/reducer-logik.

## Guardrails

- Ingen scope-udvidelse: ingen nye items, ingen ændringer i buff-mekanik, UI-tekster eller inventory-scenen.
- Ingen genindførsel af fjernede UI-elementer.

## Når du er færdig

Opdatér `PROGRESS.md` (dækning `12/12 consumables mapped`), commit og push til `main`.
