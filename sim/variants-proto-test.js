// Verifikation af prototype-config v0.8: rotation + drops 25%/100% + boss 105/10/2.
module.exports = {
  'v0.8-prototype': {
    hero: { dmg: 10 },
    levelUp: { mode: 'rotation', dmg: 4, hp: 14, armor: 1, armorHp: 6 },
    xpCurve: [20, 30, 40, 55, 75, 100, 135],
    enemies: { mid: { dmg: 8 }, late: { dmg: 11 } },
    elites: { early: { dmg: 9 }, mid: { dmg: 12 }, late: { dmg: 14 } },
    camp: { heal: 20 },
    goldTile: 12,
    shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
    drops: { normal: 0.25, elite: 1.0 },
    boss: { hp: 105, dmg: 10, armor: 2 },
  },
};
