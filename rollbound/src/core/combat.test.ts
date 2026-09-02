// Combat-tests efter damage-ranges (2026-09-02):
// 1) Degenereret ækvivalens: når min === max er simulateFight EKSAKT lig den
//    lukkede formel — beviser at loop-strukturen er intakt.
// 2) Egenskaber: hvert rul ligger i [min, max] minus armor (gulv 1), hero
//    slår først, aktører skifter, HP falder monotont, vinderen er konsistent.
// 3) EV-sanity: gennemsnitsskaden over mange kampe ≈ rangens midtpunkt.
// 4) Determinisme: samme rng-seed => bit-identisk script.

import { describe, expect, it } from 'vitest';
import { CONFIG } from './config';
import { fightOutcome, simulateFight } from './combat';
import { cursor } from './rng';
import type { EnemyDef } from './types';

const ALL_ENEMIES: EnemyDef[] = [
  ...Object.values(CONFIG.enemies),
  ...Object.values(CONFIG.elites),
  CONFIG.boss,
];

const HERO_DMG = [6, 8, 10, 13, 16, 19, 22, 26, 30];
const HERO_ARMOR = [0, 1, 2, 3, 5, 7];
const HERO_HP = [1, 6, 10, 24, 37, 50, 64, 91, 120];

function flatEnemy(enemy: EnemyDef): EnemyDef {
  const mid = Math.round((enemy.dmgMin + enemy.dmgMax) / 2);
  return { ...enemy, dmgMin: mid, dmgMax: mid };
}

describe('simulateFight med damage-ranges', () => {
  it('degenererede ranges (min === max) matcher den lukkede formel eksakt', () => {
    let cases = 0;
    for (const base of ALL_ENEMIES) {
      const enemy = flatEnemy(base);
      for (const dmg of HERO_DMG) {
        for (const armor of HERO_ARMOR) {
          for (const hp of HERO_HP) {
            const hero = { hp, dmgMin: dmg, dmgMax: dmg, armor };
            const out = fightOutcome(hero, enemy);
            const script = simulateFight(hero, enemy, cursor(1));
            const label = `${enemy.name} vs ${hp}hp/${dmg}dmg/${armor}arm`;

            expect(script.result.winner, label).toBe(out.survives ? 'hero' : 'enemy');
            if (out.survives) {
              expect(script.result.heroHpAfter, label).toBe(hp - out.hpLoss);
              expect(script.result.turns, label).toBe(out.hitsToKill);
              const heroBlows = script.events.filter(e => e.actor === 'hero');
              expect(heroBlows.length, label).toBe(out.hitsToKill);
              expect(heroBlows.at(-1)!.targetHpAfter, label).toBe(0);
            } else {
              expect(script.result.heroHpAfter, label).toBe(0);
              expect(script.events.at(-1)!.actor, label).toBe('enemy');
            }
            cases++;
          }
        }
      }
    }
    expect(cases).toBe(ALL_ENEMIES.length * HERO_DMG.length * HERO_ARMOR.length * HERO_HP.length);
  });

  it('hvert rul ligger inden for rangen minus armor (gulv 1), og kampen er velformet', () => {
    const hero = { hp: 90, dmgMin: 7, dmgMax: 12, armor: 1 };
    for (const enemy of ALL_ENEMIES) {
      for (let seed = 0; seed < 200; seed++) {
        const script = simulateFight(hero, enemy, cursor(seed));
        const heroLo = Math.max(CONFIG.minDamage, hero.dmgMin - enemy.armor);
        const heroHi = Math.max(CONFIG.minDamage, hero.dmgMax - enemy.armor);
        const enemyLo = Math.max(CONFIG.minDamage, enemy.dmgMin - hero.armor);
        const enemyHi = Math.max(CONFIG.minDamage, enemy.dmgMax - hero.armor);
        let lastEnemyHp = enemy.hp;
        let lastHeroHp = hero.hp;
        expect(script.events[0].actor).toBe('hero');
        script.events.forEach((e, i) => {
          if (i > 0) expect(e.actor).not.toBe(script.events[i - 1].actor);
          if (e.actor === 'hero') {
            expect(e.damage).toBeGreaterThanOrEqual(heroLo);
            expect(e.damage).toBeLessThanOrEqual(heroHi);
            expect(e.targetHpAfter).toBeLessThan(lastEnemyHp);
            lastEnemyHp = e.targetHpAfter;
          } else {
            expect(e.damage).toBeGreaterThanOrEqual(enemyLo);
            expect(e.damage).toBeLessThanOrEqual(enemyHi);
            expect(e.targetHpAfter).toBeLessThan(lastHeroHp);
            lastHeroHp = e.targetHpAfter;
          }
        });
        expect(script.result.winner).toBe(lastEnemyHp === 0 ? 'hero' : 'enemy');
        expect(script.result.heroHpAfter).toBe(Math.max(0, lastHeroHp));
      }
    }
  });

  it('EV-sanity: gennemsnitligt hero-rul ≈ rangens midtpunkt minus armor', () => {
    const hero = { hp: 10_000, dmgMin: 7, dmgMax: 12, armor: 0 };
    const enemy = CONFIG.enemies.mid; // Bandit, armor 1
    let sum = 0;
    let count = 0;
    for (let seed = 0; seed < 500; seed++) {
      const script = simulateFight(hero, enemy, cursor(seed));
      for (const e of script.events) {
        if (e.actor === 'hero') {
          sum += e.damage;
          count++;
        }
      }
    }
    const expected = (hero.dmgMin + hero.dmgMax) / 2 - enemy.armor; // 8.5
    expect(count).toBeGreaterThan(1000);
    expect(sum / count).toBeGreaterThan(expected - 0.25);
    expect(sum / count).toBeLessThan(expected + 0.25);
  });

  it('er deterministisk pr. rng-seed: samme seed giver identiske scripts', () => {
    const hero = { hp: 50, dmgMin: 10, dmgMax: 16, armor: 1 };
    for (const enemy of ALL_ENEMIES) {
      for (const seed of [0, 7, 42]) {
        expect(JSON.stringify(simulateFight(hero, enemy, cursor(seed))))
          .toBe(JSON.stringify(simulateFight(hero, enemy, cursor(seed))));
      }
    }
  });
});
