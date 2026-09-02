// Combat-sprite-manifest til fullscreen-kampscenen.
// Kontrakt: ../design/combat-sprite-contract-v1.md
// Syv normaliserede 64×80-sprites; scenens tile-fallback bevares til
// ukendte fjender og fremtidige assets, der endnu ikke er produceret.

import { CONFIG } from '../core/config';
import type { EnemyDef, TileType } from '../core/types';
import goblin from '../assets/pixel/combat/goblin-v1.png';
import bandit from '../assets/pixel/combat/bandit-v1.png';
import ogre from '../assets/pixel/combat/ogre-v1.png';
import eliteEarly from '../assets/pixel/combat/elite-early-v1.png';
import eliteMid from '../assets/pixel/combat/elite-mid-v1.png';
import eliteLate from '../assets/pixel/combat/elite-late-v1.png';
import boss from '../assets/pixel/combat/boss-v1.png';

export type CombatSpriteId =
  | 'goblin' | 'bandit' | 'ogre'
  | 'elite-early' | 'elite-mid' | 'elite-late'
  | 'boss';

export const COMBAT_SPRITES: Partial<Record<CombatSpriteId, string>> = {
  goblin, bandit, ogre,
  'elite-early': eliteEarly,
  'elite-mid': eliteMid,
  'elite-late': eliteLate,
  boss,
};

const SPRITE_BY_ENEMY = new Map<EnemyDef, CombatSpriteId>([
  [CONFIG.enemies.early, 'goblin'],
  [CONFIG.enemies.mid, 'bandit'],
  [CONFIG.enemies.late, 'ogre'],
  [CONFIG.elites.early, 'elite-early'],
  [CONFIG.elites.mid, 'elite-mid'],
  [CONFIG.elites.late, 'elite-late'],
  [CONFIG.boss, 'boss'],
]);

const FALLBACK_TILE = new Map<EnemyDef, TileType>([
  [CONFIG.enemies.early, 'enemy'],
  [CONFIG.enemies.mid, 'enemy'],
  [CONFIG.enemies.late, 'enemy'],
  [CONFIG.elites.early, 'elite'],
  [CONFIG.elites.mid, 'elite'],
  [CONFIG.elites.late, 'elite'],
  [CONFIG.boss, 'boss'],
]);

// state.lastCombat structuredClone'es ved senere actions, så opslag skal
// også virke på kloner: reference-match først, navne-match som fallback.
function resolveDef(enemy: EnemyDef): EnemyDef {
  if (SPRITE_BY_ENEMY.has(enemy)) return enemy;
  for (const def of SPRITE_BY_ENEMY.keys()) if (def.name === enemy.name) return def;
  return enemy;
}

export function combatSpriteFor(enemy: EnemyDef): { src?: string; fallbackTile: TileType } {
  const def = resolveDef(enemy);
  const id = SPRITE_BY_ENEMY.get(def);
  return {
    src: id ? COMBAT_SPRITES[id] : undefined,
    fallbackTile: FALLBACK_TILE.get(def) ?? 'enemy',
  };
}
