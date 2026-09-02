// Rollbound balance v0.10 — sim-verificeret 2026-09-02 MED damage-ranges:
// balanced bot 57,7% win (10k runs, engine-sim), boss kalibreret 105→90 HP
// fordi varians koster win rate ved samme EV. Kør `npm run sim -- 10000`.
// Historik: v0.9 (flad damage) 55,7% — se ../sim/FINDINGS.md.
// ALLE balance-tal bor her. Ingen tal hardcodes i engine eller UI.

import type { EnemyDef, EquipmentId, EquipmentKind, EquipmentLoadout, TreasureItem } from './types';

export const CONFIG = {
  trackLength: 70, // felt 70 = boss
  visibility: 12,  // synlige felter forud

  // dmgMin/dmgMax inkluderer start-våbnet (Trækølle). EV 9,5.
  hero: { hp: 50, dmgMin: 7, dmgMax: 12, armor: 0, nudges: 2, rerolls: 1, gold: 0 },

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

  // Damage-ranges: EV-bevarende konvertering fra de flade v0.9-tal.
  // Bredde = identitet: Goblin smal (stabil), Ogre bred (farlige swings),
  // bossen medium (finalen skal ikke afgøres af ét enkelt rul).
  enemies: {
    early: { name: 'Goblin', hp: 15, dmgMin: 5,  dmgMax: 7,  armor: 0, xp: 15, gold: 2 },
    mid:   { name: 'Bandit', hp: 24, dmgMin: 6,  dmgMax: 10, armor: 1, xp: 25, gold: 3 },
    late:  { name: 'Ogre',   hp: 36, dmgMin: 7,  dmgMax: 15, armor: 2, xp: 35, gold: 4 },
  } satisfies Record<string, EnemyDef>,

  elites: {
    early: { name: 'Goblin-høvding', hp: 35, dmgMin: 7,  dmgMax: 11, armor: 1, xp: 40, gold: 12 },
    mid:   { name: 'Skyggeridder',   hp: 50, dmgMin: 9,  dmgMax: 15, armor: 2, xp: 60, gold: 16 },
    late:  { name: 'Trold-konge',    hp: 70, dmgMin: 10, dmgMax: 18, armor: 3, xp: 80, gold: 20 },
  } satisfies Record<string, EnemyDef>,

  boss: { name: 'Bossen', hp: 90, dmgMin: 8, dmgMax: 12, armor: 2, xp: 0, gold: 0 } satisfies EnemyDef,

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
