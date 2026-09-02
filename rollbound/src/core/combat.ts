// Deterministisk combat: hero slår først, skiftevis, min damage 1.
// simulateFight producerer kampen som afspilbar event-liste (combat script);
// reduceren afgør stadig alt atomisk, UI'et afspiller kun data.

import { CONFIG } from './config';
import type { RngCursor } from './rng';
import type { CombatEvent, CombatScript, EnemyDef, FightPreview, Hero, TileType } from './types';

// Lukket formel over samme regler. Bruges af bot/interne previews;
// ækvivalensen med simulateFight er testet i combat.test.ts.
export function fightOutcome(hero: Pick<Hero, 'hp' | 'dmg' | 'armor'>, enemy: EnemyDef): FightPreview {
  const heroHit = Math.max(CONFIG.minDamage, hero.dmg - enemy.armor);
  const enemyHit = Math.max(CONFIG.minDamage, enemy.dmg - hero.armor);
  const hitsToKill = Math.ceil(enemy.hp / heroHit);
  const hpLoss = (hitsToKill - 1) * enemyHit;
  return { heroHit, enemyHit, hitsToKill, hpLoss, survives: hero.hp > hpLoss };
}

// _rng er reserveret til damage-ranges og effects; v1 trækker ingen RNG,
// så eksisterende runs forbliver bit-for-bit reproducerbare.
export function simulateFight(
  hero: Pick<Hero, 'hp' | 'dmg' | 'armor'>,
  enemy: EnemyDef,
  _rng?: RngCursor,
): CombatScript {
  const heroHit = Math.max(CONFIG.minDamage, hero.dmg - enemy.armor);
  const enemyHit = Math.max(CONFIG.minDamage, enemy.dmg - hero.armor);
  const events: CombatEvent[] = [];
  let heroHp = hero.hp;
  let enemyHp = enemy.hp;
  let turn = 0;

  while (true) {
    turn++;
    enemyHp -= heroHit;
    events.push({ turn, actor: 'hero', kind: 'attack', damage: heroHit, targetHpAfter: Math.max(0, enemyHp) });
    if (enemyHp <= 0) break;
    heroHp -= enemyHit;
    events.push({ turn, actor: 'enemy', kind: 'attack', damage: enemyHit, targetHpAfter: Math.max(0, heroHp) });
    if (heroHp <= 0) break;
  }

  return {
    enemy,
    events,
    result: {
      winner: enemyHp <= 0 ? 'hero' : 'enemy',
      heroHpAfter: Math.max(0, heroHp),
      turns: turn,
    },
  };
}

export function enemyForTile(pos: number, type: TileType): EnemyDef {
  if (type === 'boss') return CONFIG.boss;
  const pool = type === 'elite' ? CONFIG.elites : CONFIG.enemies;
  if (pos <= CONFIG.trackLength / 3) return pool.early;
  if (pos <= (2 * CONFIG.trackLength) / 3) return pool.mid;
  return pool.late;
}
