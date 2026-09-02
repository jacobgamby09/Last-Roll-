// Rollbound balance v0.9 — sim-verificeret 2026-09-02 MED ikke-stakkende equipment:
// balanced bot 55,7% win, ~20 rolls, HP→XP ≈ 0,44 (boss 105/10/2 står korrekt).
// Historisk v0.8-baseline (stakkende equipment): 63,7% — se ../sim/FINDINGS.md.
// ALLE balance-tal bor her. Ingen tal hardcodes i engine eller UI.

import type { EnemyDef, EquipmentId, EquipmentKind, EquipmentLoadout, TreasureItem } from './types';

export const CONFIG = {
  trackLength: 70, // felt 70 = boss
  visibility: 12,  // synlige felter forud

  hero: { hp: 50, dmg: 10, armor: 0, nudges: 2, rerolls: 1, gold: 0 },

  equipment: {
    starters: { weapon: 'wood-club', armor: 'cloth-shirt', boots: 'worn-sandals' } satisfies EquipmentLoadout,
    items: {
      'wood-club': { kind: 'weapon', dmg: 0, armor: 0, freeNudges: 0 },
      'rusted-sword': { kind: 'weapon', dmg: 3, armor: 0, freeNudges: 0 },
      'cloth-shirt': { kind: 'armor', dmg: 0, armor: 0, freeNudges: 0 },
      'worn-plate': { kind: 'armor', dmg: 0, armor: 1, freeNudges: 0 },
      'worn-sandals': { kind: 'boots', dmg: 0, armor: 0, freeNudges: 0 },
      'trail-boots': { kind: 'boots', dmg: 0, armor: 0, freeNudges: 1 },
    } satisfies Record<EquipmentId, { kind: EquipmentKind; dmg: number; armor: number; freeNudges: number }>,
  },

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
    weapon: { cost: 25 },
    armorItem: { cost: 20 },
    boots: { cost: 18 },
    heal: { hp: 15, cost: 8 },
    nudge: 8,
    reroll: 6,
  },

  // Loot: chance for 1 tilfældigt treasure-item ved kill
  drops: { normal: 0.25, elite: 1.0 },

  minDamage: 1,
};

export const TREASURE_POOL: TreasureItem[] = [
  { key: 'weapon', name: 'Slebet klinge',    desc: `+${CONFIG.equipment.items['rusted-sword'].dmg} Damage`, equipmentId: 'rusted-sword' },
  { key: 'armor',  name: 'Jernplade',        desc: `+${CONFIG.equipment.items['worn-plate'].armor} Armor`, equipmentId: 'worn-plate' },
  { key: 'boots',  name: 'Stivinderstøvler', desc: `${CONFIG.equipment.items['trail-boots'].freeNudges} gratis Nudge`, equipmentId: 'trail-boots' },
  { key: 'maxhp', name: 'Livskraft-amulet', desc: '+10 Max HP' },
  { key: 'nudge', name: 'Heldig terning',   desc: '+1 Nudge' },
  { key: 'gold',  name: 'Guldpung',         desc: '+12 Guld' },
];
