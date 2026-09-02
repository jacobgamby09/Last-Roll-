// Combat med damage-ranges: hero slår først, skiftevis, hvert angreb ruller
// i [dmgMin, dmgMax] fra run'ets seedede RNG, minus armor, gulv på 1.
// simulateFight producerer kampen som afspilbar event-liste (combat script);
// reduceren afgør stadig alt atomisk, UI'et afspiller kun data.

import { CONFIG } from './config';
import type { RngCursor } from './rng';
import type { CombatEvent, CombatMods, CombatScript, EnemyDef, FightPreview, Hero, TileType } from './types';

type Combatant = Pick<Hero, 'hp' | 'maxHp' | 'dmgMin' | 'dmgMax' | 'armor'>;

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

export function simulateFight(hero: Combatant, enemy: EnemyDef, rng: RngCursor, mods: CombatMods = {}): CombatScript {
  const effectiveEnemyArmor = mods.armorPen === 'all'
    ? 0
    : Math.max(0, enemy.armor - (mods.armorPen ?? 0));
  const events: CombatEvent[] = [];
  let heroHp = hero.hp;
  let enemyHp = enemy.hp;
  let turn = 0;
  let heroAttacksMade = 0;
  let enemyAttacksMade = 0;

  // Ét hero-hug: rul, multiplicér (firstStrike/execute rammer FØR armor), træk armor
  const heroBlow = (): { damage: number; note?: CombatEvent['note'] } => {
    let roll = rng.int(hero.dmgMin, hero.dmgMax);
    let note: CombatEvent['note'];
    if (mods.firstStrikeMult && heroAttacksMade === 0) {
      roll = Math.round(roll * mods.firstStrikeMult);
      note = 'firstStrike';
    } else if (mods.executeBonus && enemyHp <= enemy.hp * mods.executeBonus.threshold) {
      roll = Math.round(roll * mods.executeBonus.mult);
      note = 'execute';
    }
    heroAttacksMade++;
    return { damage: Math.max(CONFIG.minDamage, roll - effectiveEnemyArmor), note };
  };

  const applyHeroBlow = (): boolean => {
    const blow = heroBlow();
    enemyHp -= blow.damage;
    events.push({ turn, actor: 'hero', kind: 'attack', damage: blow.damage, targetHpAfter: Math.max(0, enemyHp), ...(blow.note ? { note: blow.note } : {}) });
    if (enemyHp <= 0 && mods.killHeal) {
      const healed = Math.min(mods.killHeal, hero.maxHp - heroHp);
      if (healed > 0) {
        heroHp += healed;
        events.push({ turn, actor: 'hero', kind: 'lifesteal', damage: healed, targetHpAfter: heroHp });
      }
    }
    return enemyHp <= 0;
  };

  while (true) {
    turn++;
    if (applyHeroBlow()) break;
    if (mods.doubleHit && applyHeroBlow()) break;

    if (mods.firstHitBlock && enemyAttacksMade === 0) {
      enemyAttacksMade++;
      events.push({ turn, actor: 'enemy', kind: 'block', damage: 0, targetHpAfter: heroHp });
    } else {
      enemyAttacksMade++;
      const enemyBlow = Math.max(CONFIG.minDamage, rng.int(enemy.dmgMin, enemy.dmgMax) - hero.armor);
      heroHp -= enemyBlow;
      events.push({ turn, actor: 'enemy', kind: 'attack', damage: enemyBlow, targetHpAfter: Math.max(0, heroHp) });
      if (heroHp <= 0) break;
      if (mods.thorns) {
        enemyHp -= mods.thorns;
        events.push({ turn, actor: 'hero', kind: 'thorns', damage: mods.thorns, targetHpAfter: Math.max(0, enemyHp) });
        if (enemyHp <= 0) break;
      }
    }
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
