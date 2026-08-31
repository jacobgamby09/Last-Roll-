// Eksperiment: længere runs. Basis = "v0.8-retning" (v0.7 + rotation + drops 25%/100%).
// Tile-fordeling skaleres proportionalt, boss skaleres op med forventet hero-styrke.
// Reference (70 felter, ~20 rolls): aggressive 51,2% / balanced 68,8% / cautious 41,7%.
const base = {
  hero: { dmg: 10 },
  levelUp: { mode: 'rotation', dmg: 4, hp: 14, armor: 1, armorHp: 6 },
  xpCurve: [20, 30, 40, 55, 75, 100, 135],
  enemies: { mid: { dmg: 8 }, late: { dmg: 11 } },
  elites: { early: { dmg: 9 }, mid: { dmg: 12 }, late: { dmg: 14 } },
  camp: { heal: 20 },
  goldTile: 12,
  shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
  drops: { normal: 0.25, elite: 1.0 },
};
module.exports = {
  '105-felter-30-rolls': {
    ...base,
    trackLength: 105,
    tiles: { blank: 38, enemy: 24, gold: 9, treasure: 9, camp: 6, event: 6, shop: 4, elite: 5, trap: 3 }, // = 104
    boss: { hp: 150, dmg: 12, armor: 3 },
  },
  '140-felter-40-rolls': {
    ...base,
    trackLength: 140,
    tiles: { blank: 51, enemy: 32, gold: 12, treasure: 12, camp: 8, event: 8, shop: 6, elite: 6, trap: 4 }, // = 139
    boss: { hp: 200, dmg: 13, armor: 3 },
  },
};
