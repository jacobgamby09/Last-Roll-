// Midlertidigt eksperiment: kan pris-korrektion af level-up-picks fjerne damage-dominansen?
// Basis = v0.5-final, kun levelUp varieres.
const v05 = {
  hero: { dmg: 10 },
  xpCurve: [20, 30, 40, 55, 75, 100, 135],
  enemies: { mid: { dmg: 8 }, late: { dmg: 11 } },
  elites: { early: { dmg: 9 }, mid: { dmg: 12 }, late: { dmg: 14 } },
  camp: { heal: 20 },
  goldTile: 12,
  shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
  boss: { hp: 95, dmg: 10, armor: 2 },
};
module.exports = {
  'v0.6d-hybrid': { ...v05, levelUp: { dmg: 4, hp: 14, armor: 1, armorHp: 6 } },
};
