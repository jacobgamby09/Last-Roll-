// Rollbound balance-config v0.8 — sim-verificeret 2026-08-31
// (balanced bot 63,7% win, ~20 rolls, HP→XP ≈ 0,39 — se ../sim/FINDINGS.md)
// ALLE balance-tal bor her. Ingen tal hardcodes i engine eller UI.

import type { EnemyDef, TreasureItem } from './types';

export const CONFIG = {
  trackLength: 70, // felt 70 = boss
  visibility: 12,  // synlige felter forud

  hero: { hp: 50, dmg: 10, armor: 0, nudges: 2, rerolls: 1, gold: 0 },

  // 'rotation': ATK → HP → Armor, intet valg. 'choice': vælg 1 af 3.
  levelUpMode: 'rotation' as 'rotation' | 'choice',
  levelUp: { dmg: 4, hp: 14, armor: 1, armorHp: 6 },

  xpCurve: [20, 30, 40, 55, 75, 100, 135],
  xpCurveGrowth: 1.35, // pr. level efter kurvens slutning

  // Fordeling på felt 1-69 (summer til 69)
  tiles: { blank: 25, enemy: 16, gold: 6, treasure: 6, camp: 4, event: 4, shop: 3, elite: 3, trap: 2 },

  enemies: {
    early: { name: 'Goblin', hp: 15, dmg: 6, armor: 0, xp: 15, gold: 2 },
    mid:   { name: 'Bandit', hp: 24, dmg: 8, armor: 1, xp: 25, gold: 3 },
    late:  { name: 'Ogre',   hp: 36, dmg: 11, armor: 2, xp: 35, gold: 4 },
  } satisfies Record<string, EnemyDef>,

  elites: {
    early: { name: 'Goblin-høvding', hp: 35, dmg: 9,  armor: 1, xp: 40, gold: 12 },
    mid:   { name: 'Skyggeridder',   hp: 50, dmg: 12, armor: 2, xp: 60, gold: 16 },
    late:  { name: 'Trold-konge',    hp: 70, dmg: 14, armor: 3, xp: 80, gold: 20 },
  } satisfies Record<string, EnemyDef>,

  boss: { name: 'Bossen', hp: 105, dmg: 10, armor: 2, xp: 0, gold: 0 } satisfies EnemyDef,

  goldTile: 12,
  camp: { heal: 20 },
  trap: { hpLoss: 8, goldLoss: 10 },  // 50/50
  event: { gold: 10, hpLoss: 6 },     // 50/50 (placeholder for rigtige events)

  shop: {
    weapon: { dmg: 4, cost: 25 },
    armorItem: { armor: 2, cost: 20 },
    heal: { hp: 15, cost: 8 },
    nudge: 8,
    reroll: 6,
  },

  // Loot: chance for 1 tilfældigt treasure-item ved kill
  drops: { normal: 0.25, elite: 1.0 },

  minDamage: 1,
};

export const TREASURE_POOL: TreasureItem[] = [
  { key: 'dmg',   name: 'Slebet klinge',    desc: '+3 Damage' },
  { key: 'armor', name: 'Jernplade',        desc: '+1 Armor' },
  { key: 'maxhp', name: 'Livskraft-amulet', desc: '+10 Max HP' },
  { key: 'nudge', name: 'Heldig terning',   desc: '+1 Nudge' },
  { key: 'gold',  name: 'Guldpung',         desc: '+12 Guld' },
];
