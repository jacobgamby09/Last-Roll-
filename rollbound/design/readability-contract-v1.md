# Rollbound readability contract v1

## Purpose

This contract keeps the approved pixel-art direction readable without changing game rules. The board remains the visual focus, but all decisions, costs, rewards and disabled reasons must be legible at a glance on desktop and narrow screens.

## Type and color hierarchy

Runtime UI text uses these minimum tiers:

- Micro metadata: `9 px` — field numbers, seed, short counters and technical labels only.
- Labels: `10 px` — tile labels, consequence chips, stat labels and action tags.
- Body: `11 px` — effects, descriptions, recent-event copy and disabled reasons.
- Names: `12 px` — destination, item and reward names.
- Primary values: `18 px` or larger — HP consequences, core stats and boss readiness.

Use `--px-copy: #cbbdd2` for secondary functional text. `--px-muted` is reserved for genuinely low-priority metadata. Never dim an entire disabled card; keep its explanation readable and reduce only the artwork or decorative treatment.

## Board readability

- Never scale the whole board with a CSS transform. At narrow widths the board keeps its native pixel scale and scrolls horizontally inside its own panel.
- Visited state may soften nonessential art, but Road / Blank dioramas remain fully visible.
- Every tile keeps a text label and distinct silhouette; category color is never the sole identifier.
- Tile number is at least `9 px`; tile label and consequence chip are at least `10 px`.
- Destination cards use at least `12 px` names and `11 px` consequence copy. Names and consequences wrap instead of clipping or ellipsizing.
- Candidate, selected and disabled states must have a non-color cue such as text, outline, status or opacity limited to the art.

## HUD and action panels

- Damage and Armor use dedicated stat assets, not Unicode glyphs and not equipment icons.
- The three equipment slots remain distinct from Damage, Armor, Gold, Nudge and Reroll values.
- HP and XP bars expose accessible progressbar values. The current board tile exposes `aria-current="step"`.
- Interactive cards and buttons keep a visible keyboard focus outline.
- Shop rows always state why an action is unavailable: missing Gold, full HP, already equipped or already bought.
- Equipment comparisons show current and new names, effects and a compact numeric/effect delta.

## Responsive behavior

- `≤ 980 px`: boss readiness becomes a compact full-width HUD row; it is not hidden.
- `≤ 720 px`: header actions use a compact grid, the portrait becomes `72 px`, the board scrolls internally at native scale, destinations stack vertically, and Shop/Treasure grids use two columns.
- `≤ 480 px`: header actions use two columns, resource stats use three columns, and Shop/Treasure choices use one column.
- The document itself must never create horizontal overflow. Only the board panel may scroll horizontally.
- Runtime functional text remains at least `9 px` at every breakpoint.

## Stat asset contract

- Damage: `damage-sword-v1.png`, a diagonal sword with a red impact slash.
- Armor: `armor-shield-v1.png`, a frontal cyan shield.
- Both use `48 × 48` transparent RGBA canvases with a maximum `36 × 36` visible bounding box and optical centering.
- They belong to the non-equipment HUD symbol manifest, but are semantic stats rather than collectible resources.
- Normalize generated sources with `scripts/normalize_hud_asset.py`; preserve hard edges and nearest-neighbor scaling.

## Acceptance QA

- Desktop: seed 2 for HUD, board, Road, destination and movement checks.
- Treasure/equipment: seed 0 for choice text and current-versus-new comparison.
- Shop: verify all six rows, explicit disabled reasons and a `3 / 2 / 1` column progression.
- Narrow viewport: verify at `390 × 844`, including no global horizontal overflow and an internally scrolling unscaled board.
- Resource Lab: `?ui=resources` must show `7/7 ASSETS MAPPED` at lab, HUD and card sizes.
- Finish with lint, production build and a browser-console check.

## Amendment v2 — læsbarheds-pass (2026-09-02)

Zoom-test med brugeren viste, at skala var den største enkeltfaktor. Følgende regler supplerer (og ved konflikt erstatter) v1-tiers:

1. **Global UI-skala:** `UI_SCALE` i `src/pixel/presentation.ts` (default `1.2`) anvendes som CSS `zoom` på `.pixel-page` i spillet (ikke labs). Justérbar under playtest; må ikke hardcodes andre steder. Dette er IKKE den forbudte responsive nedskalering af boardet — det er en opt-in opskalering af hele UI'et.
2. **Font-hybrid:** pixel-fonten (Courier-familien) er forbeholdt titler, korte labels og knap-tekster. Al funktionel læsetekst — beskrivelser, effekter, priser/status, log, ticker, tooltips, statlinjer — sættes i `--font-body` (systemets sans) uden letter-spacing.
3. **Nye minimums-tiers for funktionel tekst:** beskrivelser/effekter/status min. `13 px` (før zoom), tooltips/statlinjer min. `12 px`, ticker `15 px`. Ingen funktionel tekst under `12 px`.
4. **Sentence case:** ALL CAPS er forbeholdt korte labels og titler. Effekt- og beskrivelsestekster (inkl. `itemEffectText`/`consumableEffectText` i core) er sentence case; stat-forkortelser (DMG/ARM/HP/XP) forbliver caps.
5. **Kontrast:** `--px-muted` er løftet til `#a89aae` og `--px-copy` til `#ded4e6`; sekundær funktionel tekst må ikke sættes mørkere end `--px-muted`.
