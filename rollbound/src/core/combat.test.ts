// Ækvivalens-test: simulateFight (event-loop) skal give præcis samme udfald
// som fightOutcome (lukket formel) over hele det relevante stat-rum.
// Beviser at combat-script-refaktoreringen er adfærdsfri.

import { describe, expect, it } from 'vitest';
import { CONFIG } from './config';
import { fightOutcome, simulateFight } from './combat';
import type { EnemyDef } from './types';

const ALL_ENEMIES: EnemyDef[] = [
  ...Object.values(CONFIG.enemies),
  ...Object.values(CONFIG.elites),
  CONFIG.boss,
];

const HERO_DMG = [6, 8, 10, 13, 16, 19, 22, 26, 30];
const HERO_ARMOR = [0, 1, 2, 3, 5, 7];
const HERO_HP = [1, 6, 10, 24, 37, 50, 64, 91, 120];

describe('simulateFight ~ fightOutcome ækvivalens', () => {
  it('matcher den lukkede formel for alle fjender over stat-grid', () => {
    let cases = 0;
    for (const enemy of ALL_ENEMIES) {
      for (const dmg of HERO_DMG) {
        for (const armor of HERO_ARMOR) {
          for (const hp of HERO_HP) {
            const hero = { hp, dmg, armor };
            const out = fightOutcome(hero, enemy);
            const script = simulateFight(hero, enemy);
            const label = `${enemy.name} vs ${hp}hp/${dmg}dmg/${armor}arm`;

            expect(script.result.winner, label).toBe(out.survives ? 'hero' : 'enemy');
            if (out.survives) {
              expect(script.result.heroHpAfter, label).toBe(hp - out.hpLoss);
              expect(script.result.turns, label).toBe(out.hitsToKill);
              const heroBlows = script.events.filter(e => e.actor === 'hero');
              expect(heroBlows.length, label).toBe(out.hitsToKill);
              expect(heroBlows.at(-1)!.targetHpAfter, label).toBe(0);
              expect(script.events.filter(e => e.actor === 'enemy').length, label).toBe(out.hitsToKill - 1);
            } else {
              expect(script.result.heroHpAfter, label).toBe(0);
              expect(script.events.at(-1)!.actor, label).toBe('enemy');
              expect(script.events.at(-1)!.targetHpAfter, label).toBe(0);
            }
            cases++;
          }
        }
      }
    }
    expect(cases).toBe(ALL_ENEMIES.length * HERO_DMG.length * HERO_ARMOR.length * HERO_HP.length);
  });

  it('er deterministisk: to kald giver identiske scripts', () => {
    for (const enemy of ALL_ENEMIES) {
      const hero = { hp: 50, dmg: 13, armor: 1 };
      expect(JSON.stringify(simulateFight(hero, enemy))).toBe(JSON.stringify(simulateFight(hero, enemy)));
    }
  });

  it('events er velformede: skiftevis aktører, hero først, faldende HP', () => {
    const script = simulateFight({ hp: 80, dmg: 12, armor: 1 }, CONFIG.boss);
    expect(script.events[0].actor).toBe('hero');
    let lastEnemyHp = CONFIG.boss.hp;
    let lastHeroHp = 80;
    for (const e of script.events) {
      expect(e.damage).toBeGreaterThanOrEqual(CONFIG.minDamage);
      if (e.actor === 'hero') {
        expect(e.targetHpAfter).toBeLessThan(lastEnemyHp);
        lastEnemyHp = e.targetHpAfter;
      } else {
        expect(e.targetHpAfter).toBeLessThan(lastHeroHp);
        lastHeroHp = e.targetHpAfter;
      }
    }
  });
});
