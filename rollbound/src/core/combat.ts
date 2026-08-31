// Deterministisk combat: hero slår først, skiftevis, min damage 1.
// Udfaldet kan beregnes eksakt FØR kampen — det er dét, der gør
// "hvad koster den her fjende?" til en synlig beslutning på boardet.

import { CONFIG } from './config';
import type { EnemyDef, FightPreview, Hero, TileType } from './types';

export function fightOutcome(hero: Pick<Hero, 'hp' | 'dmg' | 'armor'>, enemy: EnemyDef): FightPreview {
  const heroHit = Math.max(CONFIG.minDamage, hero.dmg - enemy.armor);
  const enemyHit = Math.max(CONFIG.minDamage, enemy.dmg - hero.armor);
  const hitsToKill = Math.ceil(enemy.hp / heroHit);
  const hpLoss = (hitsToKill - 1) * enemyHit;
  return { heroHit, enemyHit, hitsToKill, hpLoss, survives: hero.hp > hpLoss };
}

export function enemyForTile(pos: number, type: TileType): EnemyDef {
  if (type === 'boss') return CONFIG.boss;
  const pool = type === 'elite' ? CONFIG.elites : CONFIG.enemies;
  if (pos <= CONFIG.trackLength / 3) return pool.early;
  if (pos <= (2 * CONFIG.trackLength) / 3) return pool.mid;
  return pool.late;
}
