# Rollbound dice roll visual contract v1

## Purpose

The D6 roll is the primary interaction in Rollbound and should feel physical, weighty and consistent with the approved dark-fantasy pixel presentation. This contract changes presentation only; it must never own or alter RNG, movement or balance.

## Die asset

- Runtime source: `src/assets/pixel/dice/die-body-v1.png`.
- Canvas: `64 × 64` transparent RGBA PNG.
- Visible body: maximum `58 × 58`, optically centered.
- The bitmap contains a blank front face. Pips are deterministic UI elements rendered by `PixelDie.tsx`.
- The body uses a near-black plum face, ivory highlight, cyan lower-right rim light and restrained magenta shadow.
- Do not bake pips, values, labels, particles, a tray, button frame or selection state into the bitmap.
- Use nearest-neighbor scaling and `image-rendering: pixelated`.

## Correct face mapping

Pips use a fixed three-by-three grid:

- `1`: center.
- `2`: top-left and bottom-right.
- `3`: top-left, center and bottom-right.
- `4`: four corners.
- `5`: four corners and center.
- `6`: left/right columns.

AI-generated pips must never replace this mapping.

## Roll sequence

Normal presentation lasts approximately `780 ms`:

1. Anticipation: `0–120 ms`; die compresses and gathers light.
2. Tumble: `120–590 ms`; discrete face changes and stepped 90-degree movement.
3. Impact: `590–780 ms`; final face locks with a short panel shake, sigil flash and pixel particles.
4. Reveal: the reducer action is dispatched and destinations appear only after the impact completes.

The same sequence is used for a normal Roll and a Reroll. A Reroll begins movement only after the final face has locked.

## Architecture guardrails

- The reducer remains pure and unchanged. `PixelGame.tsx` previews the next D6 value from the existing RNG cursor, then dispatches the original action after presentation completes.
- Never call a second random source for visual face changes. Intermediate tumble faces are a fixed cosmetic sequence.
- While rolling, other presentation actions and `Nyt run` are disabled.
- Old Reroll destination outlines are suppressed during the animation.
- The final displayed value and reducer value must match for every seed.

## Accessibility and responsive behavior

- The idle button has the accessible name `Rul en sekssidet terning`.
- Rapid intermediate faces are hidden from assistive technology; the resolved face is announced normally.
- `prefers-reduced-motion: reduce` skips tumble and uses a short `150 ms` final-face reveal without shake or particles.
- At narrow widths the roll button fills the available panel width without creating global horizontal overflow.
- Runtime text retains the minimum tiers in `readability-contract-v1.md`.

## QA

- Seed 2: confirm the first resolved face matches the reducer and three destinations appear only after the impact.
- Reroll: confirm the effect plays again, Reroll decreases by one and movement resolves to the new value.
- `390 × 844`: confirm the idle altar and animated stage fit without global horizontal overflow.
- Verify the 64×64 bitmap loads at native dimensions, all six pip layouts, keyboard focus, reduced-motion fallback, lint, build and browser console.
