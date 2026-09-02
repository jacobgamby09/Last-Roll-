// Eksperiment: den LIVE prototypes regelsæt (v0.9) — ikke-stakkende equipment.
// Basis = v0.8 board/combat, men treasure/drops/shop giver én-gangs slots:
// weapon +3 dmg (25g), armor +1 (20g), boots ≈ +1 nudge (18g).
// Plus rebalance-prober på bossen.
const base = {
  hero: { dmg: 10 },
  levelUp: { mode: 'rotation', dmg: 4, hp: 14, armor: 1, armorHp: 6 },
  xpCurve: [20, 30, 40, 55, 75, 100, 135],
  enemies: { mid: { dmg: 8 }, late: { dmg: 11 } },
  elites: { early: { dmg: 9 }, mid: { dmg: 12 }, late: { dmg: 14 } },
  camp: { heal: 20 },
  goldTile: 12,
  shop: { heal: { hp: 15, cost: 8 } },
  equipment: {
    weapon: { dmg: 3, cost: 25 },
    armor: { armor: 1, cost: 20 },
    boots: { nudges: 1, cost: 18 },
  },
  drops: { normal: 0.25, elite: 1.0 },
  boss: { hp: 105, dmg: 10, armor: 2 },
};
module.exports = {
  'v0.9-live-boss105': base,
  'v0.9-boss80': { ...base, boss: { hp: 80, dmg: 10, armor: 2 } },
  'v0.9-boss70-dmg9': { ...base, boss: { hp: 70, dmg: 9, armor: 2 } },
};
