// Combat med damage-ranges: hero slår først, skiftevis, hvert angreb ruller
// i [dmgMin, dmgMax] fra run'ets seedede RNG, minus armor, gulv på 1.
// simulateFight producerer kampen som afspilbar event-liste (combat script);
// reduceren afgør stadig alt atomisk, UI'et afspiller kun data.

import { CONFIG } from './config';
import type { RngCursor } from './rng';
import type { CombatEvent, CombatScript, EnemyDef, FightPreview, Hero, TileType } from './types';

type Combatant = Pick<Hero, 'hp' | 'dmgMin' | 'dmgMax' | 'armor'>;

// Lukket EV-formel over samme regler (midtpunkt af rangen). KUN til
// bot-heuristik og interne estimater — engine-afgørelser går altid gennem
// simulateFight. Eksakt ækvivalent når min === max (testet i combat.test.ts).
export function fightOutcome(hero: Combatant, enemy: EnemyDef): FightPreview {
  const heroHit = Math.max(CONFIG.minDamage, (hero.dmgMin + hero.dmgMax) / 2 - enemy.armor);
  const enemyHit = Math.max(CONFIG.minDamage, (enemy.dmgMin + enemy.dmgMax) / 2 - hero.armor);
  const hitsToKill = Math.ceil(enemy.hp / heroHit);
  const hpLoss = (hitsToKill - 1) * enemyHit;
  return { heroHit, enemyHit, hitsToKill, hpLoss, survives: hero.hp > hpLoss };
}

export function simulateFight(hero: Combatant, enemy: EnemyDef, rng: RngCursor): CombatScript {
  const heroHit = () => Math.max(CONFIG.minDamage, rng.int(hero.dmgMin, hero.dmgMax) - enemy.armor);
  const enemyHit = () => Math.max(CONFIG.minDamage, rng.int(enemy.dmgMin, enemy.dmgMax) - hero.armor);
  const events: CombatEvent[] = [];
  let heroHp = hero.hp;
  let enemyHp = enemy.hp;
  let turn = 0;

  while (true) {
    turn++;
    const heroBlow = heroHit();
    enemyHp -= heroBlow;
    events.push({ turn, actor: 'hero', kind: 'attack', damage: heroBlow, targetHpAfter: Math.max(0, enemyHp) });
    if (enemyHp <= 0) break;
    const enemyBlow = enemyHit();
    heroHp -= enemyBlow;
    events.push({ turn, actor: 'enemy', kind: 'attack', damage: enemyBlow, targetHpAfter: Math.max(0, heroHp) });
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
