// ============================================================
// Last Roll — headless simulation v0.1
// Tester talsættet fra GDD v0.1 + låste tal (2026-08-31)
// Kør: node simulate.js [antalRuns]
// ============================================================

// ---------- Låste tal ----------
const CONFIG = {
  trackLength: 70,          // felt 70 = Boss, felt 1-69 genereres
  hero: { hp: 50, dmg: 8, armor: 0, nudges: 2, rerolls: 1, gold: 0 },
  levelUp: { dmg: 3, hp: 8, armor: 1 }, // choose 1 of 3
  xpCurve: [20, 30, 45, 65, 90, 125, 170], // L1→2 ... L7→8, derefter ×1.35
  tiles: { blank: 25, enemy: 16, gold: 6, treasure: 6, camp: 4, event: 4, shop: 3, elite: 3, trap: 2 }, // = 69
  enemies: {
    early: { name: 'Goblin', hp: 15, dmg: 6,  armor: 0, xp: 15, gold: 2 },
    mid:   { name: 'Bandit', hp: 24, dmg: 9,  armor: 1, xp: 25, gold: 3 },
    late:  { name: 'Ogre',   hp: 36, dmg: 13, armor: 2, xp: 35, gold: 4 },
  },
  elites: {
    early: { name: 'Elite-E', hp: 35, dmg: 10, armor: 1, xp: 40, gold: 12 },
    mid:   { name: 'Elite-M', hp: 50, dmg: 13, armor: 2, xp: 60, gold: 16 },
    late:  { name: 'Elite-L', hp: 70, dmg: 16, armor: 3, xp: 80, gold: 20 },
  },
  boss: { name: 'Boss', hp: 110, dmg: 15, armor: 3 },
  goldTile: 10,
  camp: { heal: 15 },
  drops: { normal: 0, elite: 0 },           // chance for 1 tilfældigt treasure-item ved kill
  trap: { hpLoss: 8, goldLoss: 10 },        // 50/50
  event: { gold: 10, hpLoss: 6 },           // 50/50
  shop: { weapon: { dmg: 4, cost: 30 }, armor: { armor: 2, cost: 25 }, heal: { hp: 15, cost: 10 }, nudge: 8, reroll: 6 },
  // trackLength og tiles kan skaleres i varianter; tredjedele/tiers beregnes af trackLength
  treasurePool: [
    { key: 'dmg',   apply: h => h.dmg += 3 },
    { key: 'armor', apply: h => h.armor += 1 },
    { key: 'maxhp', apply: h => { h.maxHp += 10; h.hp += 10; } },
    { key: 'nudge', apply: h => h.nudges += 1 },
    { key: 'gold',  apply: h => h.gold += 12 },
  ],
  minDamage: 1,
};

// ---------- Seedet RNG (mulberry32) ----------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rng = mulberry32(1);
const rand = () => rng();
const randInt = (a, b) => a + Math.floor(rand() * (b - a + 1)); // inkl.
const d6 = () => randInt(1, 6);
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- Track-generering med regler ----------
// Regler: 1 shop pr. tredjedel, mindst 1 camp i sidste tredjedel,
// ingen elite før felt 15, trap aldrig nabo til elite.
function generateTrack() {
  const L = CONFIG.trackLength;
  const track = new Array(L + 1).fill(null); // 1..70, [70] = boss
  track[L] = 'boss';
  const free = () => {
    const f = [];
    for (let i = 1; i < L; i++) if (!track[i]) f.push(i);
    return f;
  };
  const placeIn = (type, lo, hi) => {
    const slots = free().filter(i => i >= lo && i <= hi);
    const pos = slots[Math.floor(rand() * slots.length)];
    track[pos] = type;
    return pos;
  };
  const L1 = Math.floor((L - 1) / 3), L2 = Math.floor((2 * (L - 1)) / 3);
  const thirds = [[1, L1], [L1 + 1, L2], [L2 + 1, L - 1]];
  // Shops: én pr. tredjedel, ekstra frit
  for (let i = 0; i < CONFIG.tiles.shop; i++) {
    if (i < 3) placeIn('shop', thirds[i][0], thirds[i][1]);
    else placeIn('shop', 1, L - 1);
  }
  // Elites: én pr. tredjedel (aldrig i første ~20% af tracket), ekstra i de sidste to tredjedele
  const eliteMin = Math.max(2, Math.round(L * 0.21));
  for (let i = 0; i < CONFIG.tiles.elite; i++) {
    if (i === 0) placeIn('elite', eliteMin, L1);
    else if (i < 3) placeIn('elite', thirds[i][0], thirds[i][1]);
    else placeIn('elite', L1 + 1, L - 1);
  }
  // Camps: mindst 1 i sidste tredjedel, resten frit
  placeIn('camp', L2 + 1, L - 1);
  for (let i = 0; i < CONFIG.tiles.camp - 1; i++) placeIn('camp', 1, L - 1);
  // Traps: aldrig nabo til elite
  for (let i = 0; i < CONFIG.tiles.trap; i++) {
    const slots = free().filter(p => track[p - 1] !== 'elite' && track[p + 1] !== 'elite');
    const pos = slots[Math.floor(rand() * slots.length)];
    track[pos] = 'trap';
  }
  // Resten shuffles ind
  const rest = [];
  const fill = { blank: CONFIG.tiles.blank, enemy: CONFIG.tiles.enemy, gold: CONFIG.tiles.gold, treasure: CONFIG.tiles.treasure, event: CONFIG.tiles.event };
  for (const [type, n] of Object.entries(fill)) for (let i = 0; i < n; i++) rest.push(type);
  shuffle(rest);
  for (const pos of free()) track[pos] = rest.pop();
  return track;
}

// ---------- Deterministisk combat ----------
// Hero angriber først, skiftevis, min damage 1.
function fightOutcome(hero, enemy) {
  const heroHit = Math.max(CONFIG.minDamage, hero.dmg - enemy.armor);
  const enemyHit = Math.max(CONFIG.minDamage, enemy.dmg - hero.armor);
  const hitsToKill = Math.ceil(enemy.hp / heroHit);
  const hpLoss = (hitsToKill - 1) * enemyHit;
  return { hpLoss, survives: hero.hp > hpLoss, hitsToKill };
}

function enemyForTile(pos, elite) {
  const pool = elite ? CONFIG.elites : CONFIG.enemies;
  if (pos <= CONFIG.trackLength / 3) return pool.early;
  if (pos <= (2 * CONFIG.trackLength) / 3) return pool.mid;
  return pool.late;
}

function xpToNext(level) {
  const c = CONFIG.xpCurve;
  if (level - 1 < c.length) return c[level - 1];
  let v = c[c.length - 1];
  for (let l = c.length + 1; l <= level; l++) v = Math.round(v * 1.35);
  return v;
}

// ---------- Strategier ----------
// xpW: hvor højt XP vægtes; hpW: hvor dyrt HP-tab føles (skaleres op ved lav HP)
const STRATEGIES = {
  aggressive: { xpW: 1.2, hpW: 0.5, levelPick: 'dmg' },
  balanced:   { xpW: 0.8, hpW: 1.0, levelPick: 'smart' },
  cautious:   { xpW: 0.3, hpW: 2.0, levelPick: 'defensive' },
};

function pickLevelUp(hero, strat) {
  // Faste level-modeller (intet spillervalg) — går forud for bot-strategi
  if (CONFIG.levelUp.mode === 'rotation') {
    const pick = ['dmg', 'hp', 'armor'][(hero.level - 2) % 3]; // første level-up (L2) = dmg
    applyLevelPick(hero, pick);
    return pick;
  }
  if (CONFIG.levelUp.mode === 'flat') {
    hero.dmg += CONFIG.levelUp.flatDmg;
    hero.maxHp += CONFIG.levelUp.flatHp;
    hero.hp = Math.min(hero.maxHp, hero.hp + CONFIG.levelUp.flatHp);
    if (hero.level % (CONFIG.levelUp.flatArmorEvery || 2) === 0) hero.armor += 1;
    return 'flat';
  }
  const mode = strat.levelPick;
  if (strat.forcePick) { applyLevelPick(hero, strat.forcePick); return strat.forcePick; }
  let pick;
  if (mode === 'dmg') pick = hero.dmg < 26 ? 'dmg' : 'hp';
  else if (mode === 'defensive') pick = hero.dmg < 12 ? 'dmg' : (hero.level % 2 === 0) ? 'armor' : 'hp';
  else pick = hero.dmg < 18 ? 'dmg' : 'hp'; // smart
  applyLevelPick(hero, pick);
  return pick;
}
function applyLevelPick(hero, pick) {
  if (pick === 'dmg') hero.dmg += CONFIG.levelUp.dmg;
  else if (pick === 'hp') { hero.maxHp += CONFIG.levelUp.hp; hero.hp = Math.min(hero.maxHp, hero.hp + CONFIG.levelUp.hp); }
  else {
    hero.armor += CONFIG.levelUp.armor;
    const bonus = CONFIG.levelUp.armorHp || 0; // hybrid-pick: armor + lidt maxHP
    if (bonus) { hero.maxHp += bonus; hero.hp = Math.min(hero.maxHp, hero.hp + bonus); }
  }
}

function pickTreasure(hero, strat, options, stats) {
  // Grådig pick efter strategi
  const prefer = strat.levelPick === 'dmg' ? ['dmg', 'nudge', 'gold', 'maxhp', 'armor']
    : strat.levelPick === 'defensive' ? ['armor', 'maxhp', 'nudge', 'gold', 'dmg']
    : hero.hp / hero.maxHp < 0.5 ? ['maxhp', 'armor', 'dmg', 'nudge', 'gold']
    : ['dmg', 'maxhp', 'nudge', 'armor', 'gold'];
  for (const key of prefer) {
    const opt = options.find(o => o.key === key);
    if (opt) { opt.apply(hero); stats.treasurePicks[key] = (stats.treasurePicks[key] || 0) + 1; return; }
  }
}

// ---------- Tile-værdi (botens vurdering) ----------
function tileValue(pos, track, hero, strat) {
  if (pos >= CONFIG.trackLength) {
    const out = fightOutcome(hero, CONFIG.boss);
    return out.survives ? 200 : -300;
  }
  const type = track[pos];
  const hpFrac = hero.hp / hero.maxHp;
  const hpW = strat.hpW * (1 + 2 * (1 - hpFrac)); // HP-tab føles dyrere jo lavere HP
  switch (type) {
    case 'blank': return 0;
    case 'gold': return CONFIG.goldTile * 0.8;
    case 'treasure': return 14;
    case 'camp': {
      const healUsed = Math.min(CONFIG.camp.heal, hero.maxHp - hero.hp);
      const nearBoss = pos >= CONFIG.trackLength - 15 ? 1.5 : 1; // heal op før bossen
      return healUsed * 0.6 * (1 + 2 * (1 - hpFrac)) * nearBoss;
    }
    case 'shop': {
      if (hero.gold >= 30) return 14;
      if (hero.gold >= 10) return 7;
      return 1;
    }
    case 'trap': return -10;
    case 'event': return 1; // EV: +5 guld / -3 HP
    case 'enemy': case 'elite': {
      const enemy = enemyForTile(pos, type === 'elite');
      const out = fightOutcome(hero, enemy);
      if (!out.survives) return -1000;
      let v = enemy.xp * strat.xpW - out.hpLoss * hpW;
      if (type === 'elite') v += enemy.gold * 0.8; // elites giver guld
      const dc = type === 'elite' ? CONFIG.drops.elite : CONFIG.drops.normal;
      v += dc * 11; // forventet loot-værdi (gns. treasure-item ~11)
      return v;
    }
  }
  return 0;
}

// ---------- Movement-beslutning ----------
// Kandidater: acceptér roll, nudge ±1, reroll (EV af 6 udfald, resultat er endeligt).
function decideMove(roll, pos, track, hero, strat, stats) {
  const val = r => tileValue(pos + r, track, hero, strat);
  const base = val(roll);
  let best = { move: roll, value: base, action: 'accept' };
  if (hero.nudges > 0) {
    if (roll < 6) {
      const v = val(roll + 1);
      if (v > best.value + 10) best = { move: roll + 1, value: v, action: 'nudge' };
    }
    if (roll > 1) {
      const v = val(roll - 1);
      if (v > best.value + 10) best = { move: roll - 1, value: v, action: 'nudge' };
    }
  }
  if (hero.rerolls > 0 && base <= -15) {
    let ev = 0;
    for (let r = 1; r <= 6; r++) ev += val(r) / 6;
    if (ev > best.value + 10) best = { move: null, value: ev, action: 'reroll' };
  }
  if (best.action === 'nudge') { hero.nudges--; stats.nudgesUsed++; }
  if (best.action === 'reroll') {
    hero.rerolls--; stats.rerollsUsed++;
    return d6(); // skal accepteres
  }
  return best.move;
}

// ---------- Shop-logik ----------
function shopVisit(hero, strat, stats) {
  const S = CONFIG.shop;
  const buy = cost => { hero.gold -= cost; stats.goldSpent += cost; };
  // Heal først hvis presset
  let heals = 0;
  while (hero.hp / hero.maxHp < 0.6 && hero.gold >= S.heal.cost && heals < 3) {
    buy(S.heal.cost); hero.hp = Math.min(hero.maxHp, hero.hp + S.heal.hp); heals++;
  }
  // Stor ting efter strategi
  if (strat.levelPick === 'defensive') {
    if (hero.gold >= S.armor.cost) { buy(S.armor.cost); hero.armor += S.armor.armor; }
  } else if (hero.gold >= S.weapon.cost) {
    buy(S.weapon.cost); hero.dmg += S.weapon.dmg;
  } else if (strat.levelPick !== 'dmg' && hero.gold >= S.armor.cost) {
    buy(S.armor.cost); hero.armor += S.armor.armor;
  }
  // Småting
  if (hero.nudges < 2 && hero.gold >= S.nudge) { buy(S.nudge); hero.nudges++; }
  if (hero.rerolls < 1 && hero.gold >= S.reroll) { buy(S.reroll); hero.rerolls++; }
  // Top op med heal hvis der stadig er guld og manglende HP
  while (hero.hp < hero.maxHp - 10 && hero.gold >= S.heal.cost && heals < 5) {
    buy(S.heal.cost); hero.hp = Math.min(hero.maxHp, hero.hp + S.heal.hp); heals++;
  }
}

// ---------- Én run ----------
function simulateRun(stratName, forcePick = null) {
  const strat = { ...STRATEGIES[stratName], forcePick };
  const track = generateTrack();
  const hero = {
    hp: CONFIG.hero.hp, maxHp: CONFIG.hero.hp, dmg: CONFIG.hero.dmg, armor: CONFIG.hero.armor,
    level: 1, xp: 0, gold: CONFIG.hero.gold, nudges: CONFIG.hero.nudges, rerolls: CONFIG.hero.rerolls,
  };
  const stats = {
    rolls: 0, fights: 0, eliteFights: 0, nudgesUsed: 0, rerollsUsed: 0,
    goldEarned: 0, goldSpent: 0, treasurePicks: {}, minHp: hero.hp,
    landed: {}, win: false, deathCause: null, levelAtBoss: null, hpAtBoss: null,
    hpByThird: [[], [], []],
  };
  const gainGold = g => { hero.gold += g; stats.goldEarned += g; };
  const gainXp = xp => {
    hero.xp += xp;
    while (hero.xp >= xpToNext(hero.level)) {
      hero.xp -= xpToNext(hero.level);
      hero.level++;
      pickLevelUp(hero, strat);
    }
  };

  let pos = 0;
  while (true) {
    stats.rolls++;
    if (stats.rolls > 200) { stats.deathCause = 'stuck'; break; } // sikkerhedsnet
    const roll = d6();
    const move = decideMove(roll, pos, track, hero, strat, stats);
    pos += move;

    // HP-kurve pr. tredjedel
    const third = pos <= CONFIG.trackLength / 3 ? 0 : pos <= (2 * CONFIG.trackLength) / 3 ? 1 : 2;
    stats.hpByThird[third].push(hero.hp / hero.maxHp);

    if (pos >= CONFIG.trackLength) {
      // BOSS
      stats.levelAtBoss = hero.level;
      stats.hpAtBoss = hero.hp;
      stats.dmgAtBoss = hero.dmg;
      stats.armorAtBoss = hero.armor;
      stats.maxHpAtBoss = hero.maxHp;
      stats.bossHpCost = fightOutcome(hero, CONFIG.boss).hpLoss;
      const out = fightOutcome(hero, CONFIG.boss);
      if (out.survives) { hero.hp -= out.hpLoss; stats.win = true; }
      else stats.deathCause = 'boss';
      break;
    }

    const type = track[pos];
    stats.landed[type] = (stats.landed[type] || 0) + 1;

    if (type === 'enemy' || type === 'elite') {
      const enemy = enemyForTile(pos, type === 'elite');
      const out = fightOutcome(hero, enemy);
      if (!out.survives) { hero.hp = 0; stats.deathCause = type; break; }
      hero.hp -= out.hpLoss;
      stats.fights++;
      if (type === 'elite') stats.eliteFights++;
      stats.fightHpCost = (stats.fightHpCost || 0) + out.hpLoss;
      stats.fightXpGain = (stats.fightXpGain || 0) + enemy.xp;
      gainGold(enemy.gold);
      gainXp(enemy.xp);
      // Loot drop: ét tilfældigt item (intet valg, modsat Treasure)
      const dropChance = type === 'elite' ? CONFIG.drops.elite : CONFIG.drops.normal;
      if (dropChance > 0 && rand() < dropChance) {
        const item = CONFIG.treasurePool[Math.floor(rand() * CONFIG.treasurePool.length)];
        item.apply(hero);
        stats.drops = (stats.drops || 0) + 1;
      }
    } else if (type === 'gold') {
      gainGold(CONFIG.goldTile);
    } else if (type === 'treasure') {
      const pool = shuffle([...CONFIG.treasurePool]).slice(0, 3);
      pickTreasure(hero, strat, pool, stats);
    } else if (type === 'camp') {
      hero.hp = Math.min(hero.maxHp, hero.hp + CONFIG.camp.heal);
    } else if (type === 'shop') {
      shopVisit(hero, strat, stats);
    } else if (type === 'event') {
      if (rand() < 0.5) gainGold(CONFIG.event.gold);
      else {
        hero.hp -= CONFIG.event.hpLoss;
        if (hero.hp <= 0) { stats.deathCause = 'event'; break; }
      }
    } else if (type === 'trap') {
      if (rand() < 0.5) {
        hero.hp -= CONFIG.trap.hpLoss;
        if (hero.hp <= 0) { stats.deathCause = 'trap'; break; }
      } else {
        hero.gold = Math.max(0, hero.gold - CONFIG.trap.goldLoss);
      }
    }
    stats.minHp = Math.min(stats.minHp, hero.hp);
  }
  stats.finalLevel = hero.level;
  return stats;
}

// ---------- Aggregering ----------
function aggregate(runs) {
  const n = runs.length;
  const avg = f => runs.reduce((s, r) => s + f(r), 0) / n;
  const avgIf = (f, cond) => {
    const xs = runs.filter(cond);
    return xs.length ? xs.reduce((s, r) => s + f(r), 0) / xs.length : NaN;
  };
  const deaths = {};
  for (const r of runs) if (!r.win) deaths[r.deathCause] = (deaths[r.deathCause] || 0) + 1;
  const reachedBoss = r => r.levelAtBoss !== null;
  const hpThird = i => {
    let sum = 0, cnt = 0;
    for (const r of runs) for (const v of r.hpByThird[i]) { sum += v; cnt++; }
    return cnt ? sum / cnt : NaN;
  };
  return {
    winRate: runs.filter(r => r.win).length / n,
    reachBossRate: runs.filter(reachedBoss).length / n,
    avgRolls: avg(r => r.rolls),
    avgFights: avg(r => r.fights),
    avgElites: avg(r => r.eliteFights),
    avgLevelAtBoss: avgIf(r => r.levelAtBoss, reachedBoss),
    avgHpAtBoss: avgIf(r => r.hpAtBoss, reachedBoss),
    avgGoldEarned: avg(r => r.goldEarned),
    avgGoldSpent: avg(r => r.goldSpent),
    avgNudges: avg(r => r.nudgesUsed),
    avgRerolls: avg(r => r.rerollsUsed),
    avgMinHp: avg(r => r.minHp),
    hpCurve: [hpThird(0), hpThird(1), hpThird(2)],
    deaths,
    avgDmgAtBoss: avgIf(r => r.dmgAtBoss, reachedBoss),
    avgArmorAtBoss: avgIf(r => r.armorAtBoss, reachedBoss),
    avgMaxHpAtBoss: avgIf(r => r.maxHpAtBoss, reachedBoss),
    avgBossHpCost: avgIf(r => r.bossHpCost, reachedBoss),
    hpPerXp: avg(r => r.fightHpCost || 0) / Math.max(1e-9, avg(r => r.fightXpGain || 0)),
    avgDrops: avg(r => r.drops || 0),
  };
}

function fmt(x, d = 1) { return Number.isNaN(x) ? '—' : x.toFixed(d); }
function pct(x) { return (x * 100).toFixed(1) + '%'; }

function report(label, agg) {
  const d = Object.entries(agg.deaths).map(([k, v]) => `${k}:${v}`).join(' ') || '—';
  return [
    `### ${label}`,
    `| Win rate | Når boss | Rolls | Kampe (elite) | Level v. boss | HP v. boss | Guld ind/ud | Nudge/Reroll | Min-HP | HP% pr. tredjedel |`,
    `|---|---|---|---|---|---|---|---|---|---|`,
    `| **${pct(agg.winRate)}** | ${pct(agg.reachBossRate)} | ${fmt(agg.avgRolls)} | ${fmt(agg.avgFights)} (${fmt(agg.avgElites, 2)}) | ${fmt(agg.avgLevelAtBoss, 2)} | ${fmt(agg.avgHpAtBoss)} | ${fmt(agg.avgGoldEarned, 0)}/${fmt(agg.avgGoldSpent, 0)} | ${fmt(agg.avgNudges, 2)}/${fmt(agg.avgRerolls, 2)} | ${fmt(agg.avgMinHp)} | ${pct(agg.hpCurve[0])} / ${pct(agg.hpCurve[1])} / ${pct(agg.hpCurve[2])} |`,
    `Hero v. boss: ${fmt(agg.avgDmgAtBoss)} dmg, ${fmt(agg.avgArmorAtBoss, 2)} armor, ${fmt(agg.avgMaxHpAtBoss)} maxHP — bosskamp koster ${fmt(agg.avgBossHpCost)} HP. HP→XP-kurs: ${fmt(agg.hpPerXp, 2)} HP/XP. Drops: ${fmt(agg.avgDrops, 2)}/run.`,
    `Dødsårsager: ${d}`,
    '',
  ].join('\n');
}

// ---------- Varianter ----------
function deepMerge(target, src) {
  for (const [k, v] of Object.entries(src)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && target[k] && typeof target[k] === 'object') deepMerge(target[k], v);
    else target[k] = v;
  }
}
const BASE = JSON.parse(JSON.stringify(CONFIG));
const savedTreasurePool = CONFIG.treasurePool; // funktioner overlever ikke JSON
function applyVariant(overrides) {
  const fresh = JSON.parse(JSON.stringify(BASE));
  Object.assign(CONFIG, fresh);
  CONFIG.treasurePool = savedTreasurePool;
  deepMerge(CONFIG, overrides);
}

const VARIANTS = require(process.argv[3] ? './' + process.argv[3] : './variants.js');

// ---------- Main ----------
const N = parseInt(process.argv[2] || '10000', 10);
const out = [];
out.push(`# Last Roll — simulationsresultater`);
out.push(`${N} runs pr. konfiguration. Seedet RNG (reproducerbar).\n`);

for (const [vName, overrides] of Object.entries(VARIANTS)) {
  applyVariant(overrides);
  out.push(`\n# Variant: ${vName}`);
  out.push('```json\n' + JSON.stringify(overrides) + '\n```\n');

  out.push(`## Eksperiment 1: Tre bot-strategier`);
  for (const name of ['aggressive', 'balanced', 'cautious']) {
    rng = mulberry32(42);
    const runs = [];
    for (let i = 0; i < N; i++) runs.push(simulateRun(name));
    out.push(report(name, aggregate(runs)));
  }

  out.push(`## Eksperiment 2: Level-up-dominans (balanced bot, tvunget pick)`);
  for (const pick of ['dmg', 'hp', 'armor']) {
    rng = mulberry32(42);
    const runs = [];
    for (let i = 0; i < N; i++) runs.push(simulateRun('balanced', pick));
    out.push(report(`altid +${pick}`, aggregate(runs)));
  }

  out.push(`## Eksperiment 3: Uden movement manipulation (balanced, 0 nudges/rerolls)`);
  {
    rng = mulberry32(42);
    CONFIG.hero.nudges = 0; CONFIG.hero.rerolls = 0;
    CONFIG.shop.nudge = 99999; CONFIG.shop.reroll = 99999; // kan ikke købes
    const runs = [];
    for (let i = 0; i < N; i++) runs.push(simulateRun('balanced'));
    out.push(report('balanced uden manipulation', aggregate(runs)));
    applyVariant(overrides); // gendan
  }
}

const text = out.join('\n');
console.log(text);
const outName = process.argv[3] ? 'RESULTS-' + process.argv[3].replace(/\.js$/, '') + '.md' : 'RESULTS.md';
require('fs').writeFileSync(require('path').join(__dirname, outName), text);
