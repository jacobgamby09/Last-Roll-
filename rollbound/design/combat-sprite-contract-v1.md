# Combat Sprite Contract v1

Production contract for the seven enemy sprites used by the fullscreen combat scene (`src/pixel/CombatScene.tsx`). The scene is asset-agnostic: until a sprite is mapped, it renders the enemy's tile diorama as an explicit fallback. Sprites can therefore be produced and dropped in one at a time.

## Sprites and ids

| Sprite id | Enemy (config) | Tier color |
|---|---|---|
| `goblin` | `enemies.early` (Goblin) | red `#ff3b4d` |
| `bandit` | `enemies.mid` (Bandit) | red `#ff3b4d` |
| `ogre` | `enemies.late` (Ogre) | red `#ff3b4d` |
| `elite-early` | `elites.early` | magenta `#ff2bd6` |
| `elite-mid` | `elites.mid` | magenta `#ff2bd6` |
| `elite-late` | `elites.late` | magenta `#ff2bd6` |
| `boss` | `boss` | ivory/red `#fff2df` |

## Canvas and normalization

- Source canvas: `64 × 80` RGBA, true alpha transparency, shared ground baseline at the bottom edge.
- Nearest-neighbor only; no antialiasing, no partial alpha except deliberate 1px edges.
- The character faces LEFT (toward the hero). The scene does not mirror sprites.
- Silhouette must read at the rendered sizes: `96 × 120` on desktop, `72 × 90` on mobile (both preserve the 64×80 aspect; sprites are bottom-aligned so feet stay on the ground line).
- Size hierarchy within the canvas: normal enemies ~70–85% of canvas height, **elites ~85–95%** (elite-early low end, elite-late high end), boss may use up to 100% so it reads bigger. No per-sprite CSS sizing.
- Boss concept (decided 2026-09-02): a ceremonial armored ruler of fate — tall, symmetrical, cloaked, ivory bone-plate armor with red accents and a crown/halo silhouette. A subtle die or rune motif may appear as a detail (scepter, chest plate, crown), never literally. Clearly distinct from elite-mid (slender, magenta, stalking) and elite-late (massive, organic): the boss is upright, ceremonial, inevitable.

## Absolutely not in the bitmap

No background, platform, ground patch, tile frame, label, name, number, HP bar, price, selection state, glow, drop shadow, watermark, or baked-in UI of any kind. Hit-flash, outlines and damage numbers are runtime UI.

## Style

Same dark-fantasy 16-bit language, palette discipline and outline treatment as the board hero (`hero-idle-*-v1.png`) and the tile dioramas. Enemy identity should echo its stat profile (Goblin small and quick-looking, Ogre massive, elites ornamented in their tier color, boss ceremonial).

## File naming and mapping

- Files: `src/assets/pixel/combat/<id>-v1.png` (versioned; never overwrite an approved asset).
- Mapping: import and register in `COMBAT_SPRITES` in `src/pixel/combatSpriteAssets.ts`.
- Verify on a deterministic seed in the live combat scene and in both desktop and `390 × 844` layouts.

## Future extension (not in v1)

A second frame per enemy (`<id>-hit-v1.png` or idle B) can later drive hit/idle animation; the scene's CSS animation hooks (`is-attacking`, `is-hit`, `is-fallen`) already exist and are frame-count-agnostic.
