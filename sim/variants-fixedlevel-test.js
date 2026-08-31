// Eksperiment: faste level-ups uden spillervalg (basis = v0.7).
// 'rotation' = ATK -> HP -> Armor -> forfra (v0.7-increments).
// 'flat' = +2 dmg og +7 maxHP hvert level, +1 armor hvert andet level.
const v07 = {
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
  'rotation-atk-hp-armor': { ...v07, levelUp: { mode: 'rotation', dmg: 4, hp: 14, armor: 1, armorHp: 6 } },
  'flat-alle-stats': { ...v07, levelUp: { mode: 'flat', flatDmg: 2, flatHp: 7, flatArmorEvery: 2 } },
};
