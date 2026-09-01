# Rollbound hero status visual contract v1

## Purpose

The Hero Status block combines portrait, Level, HP, XP and next-level information into one readable HUD slice. It presents existing reducer state and short visual feedback only; it must never modify HP, XP, Level or progression timing.

## Hero portrait

- Runtime source: `src/assets/pixel/hero/hero-portrait-v1.png`.
- Canvas: `80 × 80` transparent RGBA PNG with a maximum `76 × 76` visible portrait.
- Identity must match the board hero: deep violet pointed hood, warm tan face in shadow and exactly two ivory square eyes.
- The bitmap contains no frame, Level plate, status effect, equipment, text or baked glow.
- The runtime frame supplies the plum panel, magenta/cyan corner marks, subtle rune sigil and scanline.
- Damage, healing and level-up feedback are CSS presentation states; never create separate permanent portrait identities for them.

## Level plate

- Level is a separate compact plate anchored to the lower-right edge of the portrait frame, not baked into or placed over the hero's face.
- `LV` is a micro label and the numeric Level is the primary value.
- A level increase triggers one short gold/cyan stepped pulse. The displayed number always comes directly from `hero.level`.

## HP and XP bars

- Both bars use the same notched dark-plum housing, 26 px height, segmented pixel overlay and stable right-aligned `current/max` value.
- HP uses the existing Life icon and a crimson/pink three-tone fill.
- XP uses `xp-essence-v1.png`, a standalone cyan-violet four-point essence star, and a cyan/blue three-tone fill.
- `NÆSTE LEVEL` and the next upgrade text remain visible below the bars.
- Bars retain native progressbar semantics with current, minimum and maximum values.

## Feedback states

- Damage: HP fill updates immediately; a lighter ghost bar drains from the previous HP value over approximately 620 ms, and the portrait flashes/shakes briefly.
- Healing: HP fill and portrait receive one short green-biased pulse.
- XP gain: XP fill receives one short cyan pulse. This can run simultaneously with damage feedback after combat.
- Level up: portrait and Level plate receive a stronger gold/cyan pulse for approximately 900 ms; XP may pulse simultaneously.
- All feedback is derived from previous versus current reducer-owned values. It must not delay or change the reducer result.
- All feedback animation and transitions are disabled by `prefers-reduced-motion: reduce`.

## Responsive behavior

- Desktop Hero Status uses a 96 px identity column and a flexible vitals panel.
- At `≤ 980 px` the identity column becomes 88 px.
- At `≤ 720 px` portrait/Level and vitals remain side-by-side in an `86 px + flexible` row; equipment, stats and boss readiness continue below.
- At `≤ 480 px` spacing tightens without reducing functional text below the readability contract.
- The status slice must never create global horizontal overflow.

## QA

- Seed 2 initial state: portrait `80 × 80`, XP asset `48 × 48`, HP `50/50`, XP `0/20`.
- Real seed 2 Goblin resolution: HP becomes `44`, XP becomes `15`, HUD carries simultaneous damage and XP feedback, and ghost bar begins at the previous HP width.
- Real level-up: Level plate changes to `2`, the next threshold becomes `30`, retained XP is truthful and Level/XP feedback activates.
- Resource Lab must report `7/7 ASSETS MAPPED` and render XP without fallback.
- Verify desktop, `390 × 844`, lint, production build and browser console.
