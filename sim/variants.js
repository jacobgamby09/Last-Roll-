// Varianter af talsættet. Nøgle = navn, værdi = overrides oven på CONFIG (v0.1).
module.exports = {
  'v0.1-original': {},
  'v0.5-final': {
    hero: { dmg: 10 },
    levelUp: { dmg: 4, hp: 10 },
    xpCurve: [20, 30, 40, 55, 75, 100, 135],
    enemies: {
      mid: { dmg: 8 },
      late: { dmg: 11 },
    },
    elites: {
      early: { dmg: 9 },
      mid: { dmg: 12 },
      late: { dmg: 14 },
    },
    camp: { heal: 20 },
    goldTile: 12,
    shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
    boss: { hp: 95, dmg: 10, armor: 2 },
  },
  // v0.5 + repricet level-up-menu (fix af damage-dominans, se FINDINGS.md):
  // +4 dmg / +14 maxHP / +1 armor & +6 maxHP (hybrid)
  'v0.7-final': {
    hero: { dmg: 10 },
    levelUp: { dmg: 4, hp: 14, armor: 1, armorHp: 6 },
    xpCurve: [20, 30, 40, 55, 75, 100, 135],
    enemies: {
      mid: { dmg: 8 },
      late: { dmg: 11 },
    },
    elites: {
      early: { dmg: 9 },
      mid: { dmg: 12 },
      late: { dmg: 14 },
    },
    camp: { heal: 20 },
    goldTile: 12,
    shop: { weapon: { dmg: 4, cost: 25 }, armor: { armor: 2, cost: 20 }, heal: { hp: 15, cost: 8 } },
    boss: { hp: 95, dmg: 10, armor: 2 },
  },
};
