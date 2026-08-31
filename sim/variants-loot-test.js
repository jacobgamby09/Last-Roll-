// Eksperiment: enemy loot drops oven på rotation-levels (basis = v0.7 + rotation).
// Drop = 1 tilfældigt treasure-item (intet valg, modsat Treasure-feltets choose 1 of 3).
const base = {
  hero: { dmg: 10 },
  levelUp: { mode: 'rotation', dmg: 4, hp: 14, armor: 1, armorHp: 6 },
  xpCurve: [20, 30, 40, 55, 75, 100, 135],
  enemies: { mid: { dmg: 8 }, late: { dmg: 11 } },
  elites: { early: { dmg: 9 }, mid: { dmg: 12 }, late: { dmg: 14 } },
  camp: { heal: 20 },
  goldTile: 12,
  shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
  boss: { hp: 95, dmg: 10, armor: 2 },
};
module.exports = {
  'kun-elite-loot': { ...base, drops: { normal: 0, elite: 1.0 } },
  'normal-25pct': { ...base, drops: { normal: 0.25, elite: 1.0 } },
  'normal-50pct-stresstest': { ...base, drops: { normal: 0.5, elite: 1.0 } },
};
