// Sim v2 — kører den RIGTIGE engine-reducer med heuristiske bots.
// Erstatter den håndskrevne JS-sim (../sim/) som balance-autoritet:
// reglerne kan ikke drive, for der findes kun én implementering af dem.
//
// Kør fra rollbound/:  npm run sim            (default 2000 runs/strategi)
//                      npm run sim -- 10000   (flere runs)
//
// Botten er en heuristik (samme værdifunktion som sim v1, kalibreret mod
// v0.9-resultaterne). Al spil-RNG bor i engine-staten; bottens beslutninger
// er deterministiske, så hver (seed, strategi) er reproducerbar.

import { CONFIG } from '../src/core/config';
import { enemyForTile, fightOutcome } from '../src/core/combat';
import { availableNudges } from '../src/core/equipment';
import { ITEMS, itemStats } from '../src/core/items';
import { newGame, reducer, type Action } from '../src/core/engine';
import type { EquipmentId, GameState, ItemDef, LevelPick } from '../src/core/types';

interface Strategy {
  name: string;
  xpW: number; // hvor højt XP vægtes
  hpW: number; // hvor dyrt HP-tab føles (skaleres op ved lav HP)
  levelPick: 'dmg' | 'smart' | 'defensive';
}

const STRATEGIES: Strategy[] = [
  { name: 'aggressive', xpW: 1.2, hpW: 0.5, levelPick: 'dmg' },
  { name: 'balanced', xpW: 0.8, hpW: 1.0, levelPick: 'smart' },
  { name: 'cautious', xpW: 0.3, hpW: 2.0, levelPick: 'defensive' },
];

// ---------- Botens værdifunktion (port af sim v1) ----------

function tileValue(s: GameState, pos: number, strat: Strategy): number {
  const hero = s.hero;
  if (pos >= CONFIG.trackLength) {
    return fightOutcome(hero, CONFIG.boss).survives ? 200 : -300;
  }
  const type = s.track[pos];
  const hpFrac = hero.hp / hero.maxHp;
  const hpW = strat.hpW * (1 + 2 * (1 - hpFrac));
  switch (type) {
    case 'blank': return 0;
    case 'gold': return CONFIG.goldTile * 0.8;
    case 'treasure': return 14;
    case 'camp': {
      const healUsed = Math.min(CONFIG.camp.heal, hero.maxHp - hero.hp);
      const nearBoss = pos >= CONFIG.trackLength - 15 ? 1.5 : 1;
      return healUsed * 0.6 * (1 + 2 * (1 - hpFrac)) * nearBoss;
    }
    case 'shop': {
      if (hero.gold >= 25) return 14;
      if (hero.gold >= 8) return 7;
      return 1;
    }
    case 'trap': return -10;
    case 'event': return 1;
    case 'enemy':
    case 'elite': {
      const enemy = enemyForTile(pos, type);
      const out = fightOutcome(hero, enemy);
      if (!out.survives) return -1000;
      let v = enemy.xp * strat.xpW - out.hpLoss * hpW;
      if (type === 'elite') v += enemy.gold * 0.8;
      const dc = type === 'elite' ? CONFIG.drops.elite : CONFIG.drops.normal;
      v += dc * 11; // forventet loot-værdi
      return v;
    }
    default: return 0;
  }
}

// ---------- Fase-beslutninger ----------

function rolledAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'rolled') throw new Error('rolledAction uden rolled-fase');
  const { roll, wasReroll } = s.phase;
  const val = (r: number) => tileValue(s, Math.min(s.pos + r, CONFIG.trackLength), strat);
  const base = val(roll);
  let best: { action: Action; value: number } = { action: { type: 'ACCEPT' }, value: base };
  if (!wasReroll && availableNudges(s.hero) > 0) {
    if (roll > 1 && val(roll - 1) > best.value + 10) best = { action: { type: 'NUDGE', dir: -1 }, value: val(roll - 1) };
    if (roll < 6 && val(roll + 1) > best.value + 10) best = { action: { type: 'NUDGE', dir: 1 }, value: val(roll + 1) };
  }
  if (!wasReroll && s.hero.rerolls > 0 && base <= -15) {
    let ev = 0;
    for (let r = 1; r <= 6; r++) ev += val(r) / 6;
    if (ev > best.value + 10) return { type: 'REROLL' };
  }
  return best.action;
}

// ---------- Item-vurdering (heuristik oven på item-kataloget) ----------

function gearScore(def: ItemDef, strat: Strategy): number {
  const st = itemStats(def);
  let score = 0;
  if (def.slot === 'weapon') {
    const ev = (st.dmgMin + st.dmgMax) / 2;
    const refArmor = 1.5; // typisk fjende-armor midt i runnet
    let perTurn = ev - refArmor;
    for (const e of def.effects) {
      if (e.kind === 'armorPen') perTurn = e.amount === 'all' ? ev : ev - Math.max(0, refArmor - e.amount);
      if (e.kind === 'doubleHit') perTurn = 2 * (ev - refArmor);
      if (e.kind === 'firstStrike') perTurn += ev * 0.35;
      if (e.kind === 'executeBonus') perTurn += ev * 0.2;
      if (e.kind === 'killHeal') perTurn += 2;
    }
    const width = st.dmgMax - st.dmgMin;
    const widthPref = strat.levelPick === 'dmg' ? 0.06 : strat.levelPick === 'defensive' ? -0.12 : -0.03;
    score = perTurn + width * widthPref;
  } else {
    score = st.armor * 6 + st.maxHp * 0.45 + st.bootsCharges * 5 + (st.rechargeAtCamp ? 4 : 0);
    for (const e of def.effects) {
      if (e.kind === 'thorns') score += e.amount * 3.5;
      if (e.kind === 'firstHitBlock') score += 5;
      if (e.kind === 'killHeal') score += e.amount;
      if (e.kind === 'dieTransform') score += e.from === 1 ? 2 : -1.5;
      if (e.kind === 'visibility') score += e.amount * 1.5;
      if (e.kind === 'goldBonus') score += e.amount;
      if (e.kind === 'campNudge') score += e.amount * 5;
      if (e.kind === 'trapImmune') score += 2;
      if (e.kind === 'freeRerollOn1') score += 4;
    }
  }
  return score;
}

function gearDelta(s: GameState, id: EquipmentId, strat: Strategy): number {
  const def = ITEMS[id];
  return gearScore(def, strat) - gearScore(ITEMS[s.hero.loadout[def.slot]], strat);
}

function treasureAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'treasure') throw new Error('treasureAction uden treasure-fase');
  const lowHp = s.hero.hp / s.hero.maxHp < 0.5;
  let best = 0;
  let bestValue = -Infinity;
  s.phase.options.forEach((option, index) => {
    const value = option.equipmentId
      ? gearDelta(s, option.equipmentId, strat)
      : option.key === 'maxhp' ? 5 + (lowHp ? 3 : 0)
      : option.key === 'nudge' ? 6
      : 4; // gold
    if (value > bestValue) { bestValue = value; best = index; }
  });
  return { type: 'PICK_TREASURE', index: best };
}

function shopAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'shop') throw new Error('shopAction uden shop-fase');
  const { hero, phase } = s;
  const buyable = (index: number) => {
    const offer = phase.offers[index];
    return offer && !offer.sold && hero.gold >= offer.cost;
  };
  const findService = (service: 'heal' | 'nudge' | 'reroll') =>
    phase.offers.findIndex(o => o.kind === 'service' && o.service === service && !o.sold);

  // 1) Akut heal
  const healIdx = findService('heal');
  if (hero.hp / hero.maxHp < 0.6 && hero.hp < hero.maxHp && healIdx >= 0 && buyable(healIdx)) {
    return { type: 'BUY', index: healIdx };
  }
  // 2) Bedste gear-opgradering
  let bestGear = -1;
  let bestDelta = 1; // kræver reel forbedring
  phase.offers.forEach((offer, index) => {
    if (offer.kind === 'gear' && buyable(index)) {
      const delta = gearDelta(s, offer.itemId, strat);
      if (delta > bestDelta) { bestDelta = delta; bestGear = index; }
    }
  });
  if (bestGear >= 0) return { type: 'BUY', index: bestGear };
  // 3) Board-ressourcer og top-up
  const nudgeIdx = findService('nudge');
  if (hero.nudges < 2 && nudgeIdx >= 0 && buyable(nudgeIdx)) return { type: 'BUY', index: nudgeIdx };
  const rerollIdx = findService('reroll');
  if (hero.rerolls < 1 && rerollIdx >= 0 && buyable(rerollIdx)) return { type: 'BUY', index: rerollIdx };
  if (hero.hp < hero.maxHp - 10 && healIdx >= 0 && buyable(healIdx)) return { type: 'BUY', index: healIdx };
  return { type: 'LEAVE_SHOP' };
}

function levelPickAction(s: GameState, strat: Strategy): Action {
  const dmgEv = (s.hero.dmgMin + s.hero.dmgMax) / 2;
  let pick: LevelPick;
  if (strat.levelPick === 'dmg') pick = dmgEv < 26 ? 'dmg' : 'hp';
  else if (strat.levelPick === 'defensive') pick = dmgEv < 12 ? 'dmg' : s.hero.level % 2 === 0 ? 'armor' : 'hp';
  else pick = dmgEv < 18 ? 'dmg' : 'hp';
  return { type: 'PICK_LEVELUP', pick };
}

function botAction(s: GameState, strat: Strategy): Action {
  switch (s.phase.t) {
    case 'idle': return { type: 'ROLL' };
    case 'rolled': return rolledAction(s, strat);
    case 'treasure': return treasureAction(s, strat);
    case 'equipment': {
      // Vurdér tilbuddet mod det udstyrede — 30 items er ikke strengt bedre
      const worthIt = gearDelta(s, s.phase.itemId, strat) > 0;
      return worthIt && s.hero.gold >= s.phase.cost ? { type: 'EQUIP_OFFER' } : { type: 'KEEP_EQUIPMENT' };
    }
    case 'shop': return shopAction(s, strat);
    case 'levelup': return levelPickAction(s, strat);
    case 'over': throw new Error('botAction i over-fase');
  }
}

// ---------- Runner ----------

interface RunResult {
  won: boolean;
  reachedBoss: boolean;
  rolls: number;
  fights: number;
  levelAtBoss: number | null;
  hpAtBoss: number | null;
  deathCause: 'boss' | 'track' | null;
}

function playRun(seed: number, strat: Strategy): RunResult {
  let s = newGame(seed);
  let atBoss: { level: number; hp: number } | null = null;
  for (let step = 0; step < 800 && s.phase.t !== 'over'; step++) {
    const prev = s;
    s = reducer(s, botAction(s, strat));
    if (!atBoss && s.pos >= CONFIG.trackLength) atBoss = { level: prev.hero.level, hp: prev.hero.hp };
  }
  if (s.phase.t !== 'over') throw new Error(`Run nåede ikke i mål (seed ${seed}, ${strat.name})`);
  const won = s.phase.won;
  return {
    won,
    reachedBoss: atBoss !== null,
    rolls: s.rolls,
    fights: s.fights,
    levelAtBoss: atBoss?.level ?? null,
    hpAtBoss: atBoss?.hp ?? null,
    deathCause: won ? null : atBoss ? 'boss' : 'track',
  };
}

const N = Number(process.argv[2]) || 2000;
const BASE_SEED = 1000;

console.log(`Sim v2 (rigtig engine-reducer) — ${N} runs pr. strategi, seeds ${BASE_SEED}..${BASE_SEED + N - 1}\n`);
console.log('| Strategi | Win rate | Når boss | Rolls | Kampe | Level v. boss | HP v. boss | Død: boss/track |');
console.log('|---|---|---|---|---|---|---|---|');

for (const strat of STRATEGIES) {
  const t0 = Date.now();
  const results: RunResult[] = [];
  for (let i = 0; i < N; i++) results.push(playRun(BASE_SEED + i, strat));
  const avg = (f: (r: RunResult) => number | null) => {
    const xs = results.map(f).filter((x): x is number => x !== null);
    return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
  };
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  const wins = results.filter(r => r.won).length;
  const bossDeaths = results.filter(r => r.deathCause === 'boss').length;
  const trackDeaths = results.filter(r => r.deathCause === 'track').length;
  console.log(
    `| ${strat.name} | **${pct(wins / N)}** | ${pct(results.filter(r => r.reachedBoss).length / N)} | ${avg(r => r.rolls).toFixed(1)} | ${avg(r => r.fights).toFixed(1)} | ${avg(r => r.levelAtBoss).toFixed(2)} | ${avg(r => r.hpAtBoss).toFixed(1)} | ${bossDeaths}/${trackDeaths} |`
    + `  _(${((Date.now() - t0) / 1000).toFixed(1)}s)_`,
  );
}
