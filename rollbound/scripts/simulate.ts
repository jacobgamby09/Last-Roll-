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
import { CONSUMABLES, isPreCombatConsumable, ITEMS, itemStats } from '../src/core/items';
import { newGame, reducer, type Action } from '../src/core/engine';
import type { ConsumableId, EquipmentId, GameState, ItemDef, LevelPick } from '../src/core/types';

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

// Heuristisk consumable-værdi (bruges i treasure/shop-beslutninger)
function consumableValue(id: ConsumableId, s: GameState): number {
  const e = CONSUMABLES[id].effect;
  const lowHp = s.hero.hp / s.hero.maxHp < 0.6;
  switch (e.kind) {
    case 'heal': return (lowHp ? 8 : 5) + (e.amount >= 40 ? 2 : 0);
    case 'bomb': return e.damage >= 20 ? 7 : 5;
    case 'flee': return 6;
    case 'itemBuff': {
      // Buff er mest værd på tier 2-items eller sent i runnet
      const target = ITEMS[s.hero.loadout[e.slot]];
      return (e.dmg ? 6 : e.armor ? 5 : 4) + (target.tier === 2 ? 2 : 0);
    }
    case 'grant': return 7;
    case 'gold': return 4;
    case 'twinRoll': return 6;
    case 'teleport': return 7;
  }
}

function treasureAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'treasure') throw new Error('treasureAction uden treasure-fase');
  const lowHp = s.hero.hp / s.hero.maxHp < 0.5;
  let best = 0;
  let bestValue = -Infinity;
  s.phase.options.forEach((option, index) => {
    const value = option.equipmentId
      ? gearDelta(s, option.equipmentId, strat)
      : option.consumableId
      ? consumableValue(option.consumableId, s)
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
  // 3) Consumables (kræver frit slot og overskud)
  if (hero.consumables.length < CONFIG.consumableSlots) {
    let bestCons = -1;
    let bestConsValue = 5; // kræver reel værdi
    phase.offers.forEach((offer, index) => {
      if (offer.kind === 'consumable' && buyable(index)) {
        const value = consumableValue(offer.consumableId, s) - offer.cost * 0.15;
        if (value > bestConsValue) { bestConsValue = value; bestCons = index; }
      }
    });
    if (bestCons >= 0) return { type: 'BUY', index: bestCons };
  }
  // 4) Board-ressourcer og top-up
  const nudgeIdx = findService('nudge');
  if (hero.nudges < 2 && nudgeIdx >= 0 && buyable(nudgeIdx)) return { type: 'BUY', index: nudgeIdx };
  const rerollIdx = findService('reroll');
  if (hero.rerolls < 1 && rerollIdx >= 0 && buyable(rerollIdx)) return { type: 'BUY', index: rerollIdx };
  if (hero.hp < hero.maxHp - 10 && healIdx >= 0 && buyable(healIdx)) return { type: 'BUY', index: healIdx };
  return { type: 'LEAVE_SHOP' };
}

// Pre-combat: brug bomber mod elites/boss; flygt fra dødelige kampe
function preCombatAction(s: GameState): Action {
  if (s.phase.t !== 'preCombat') throw new Error('preCombatAction uden preCombat-fase');
  const { tile, openingDamage } = s.phase;
  const enemy = tile === 'boss' ? CONFIG.boss : enemyForTile(s.pos, tile);
  const preview = fightOutcome(s.hero, enemy);
  const deadly = !preview.survives;
  const fleeSlot = s.hero.consumables.findIndex(id => CONSUMABLES[id].effect.kind === 'flee');
  if (deadly && fleeSlot >= 0 && tile !== 'boss') return { type: 'USE_CONSUMABLE', slot: fleeSlot };
  const bombSlot = s.hero.consumables.findIndex(id => CONSUMABLES[id].effect.kind === 'bomb');
  const worthBombing = tile !== 'enemy' || deadly; // gem bomber til elites/boss
  if (bombSlot >= 0 && worthBombing && openingDamage < enemy.hp) return { type: 'USE_CONSUMABLE', slot: bombSlot };
  return { type: 'FIGHT' };
}

// Idle-consumables: brug det oplagte med det samme
function idleConsumableAction(s: GameState): Action | null {
  for (let slot = 0; slot < s.hero.consumables.length; slot++) {
    const id = s.hero.consumables[slot];
    if (isPreCombatConsumable(id)) continue;
    const e = CONSUMABLES[id].effect;
    if (e.kind === 'heal' && s.hero.hp / s.hero.maxHp < 0.55) return { type: 'USE_CONSUMABLE', slot };
    // itemBuff: gem til tier 2-item eller sidste tredjedel (så investeringen ikke mistes ved swap)
    if (e.kind === 'itemBuff') {
      const target = ITEMS[s.hero.loadout[e.slot]];
      if (target.tier === 2 || s.pos > (2 * CONFIG.trackLength) / 3) return { type: 'USE_CONSUMABLE', slot };
      continue;
    }
    if (e.kind === 'grant' || e.kind === 'gold') return { type: 'USE_CONSUMABLE', slot };
    // twinRoll/teleport gemmes ikke i denne simple bot: aktiver straks
    if (e.kind === 'twinRoll' && !s.twinRollArmed) return { type: 'USE_CONSUMABLE', slot };
    if (e.kind === 'teleport') return { type: 'USE_CONSUMABLE', slot };
  }
  return null;
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
    case 'idle': return idleConsumableAction(s) ?? { type: 'ROLL' };
    case 'rolled': return rolledAction(s, strat);
    case 'chooseRoll': {
      // Skæbneterning: vælg destinationen med højest værdi
      const [a, b] = s.phase.rolls;
      const va = tileValue(s, Math.min(s.pos + a, CONFIG.trackLength), strat);
      const vb = tileValue(s, Math.min(s.pos + b, CONFIG.trackLength), strat);
      return { type: 'CHOOSE_ROLL', index: va >= vb ? 0 : 1 };
    }
    case 'teleport': {
      let bestSteps = 1;
      let bestValue = -Infinity;
      for (let steps = 1; steps <= 6; steps++) {
        const value = tileValue(s, Math.min(s.pos + steps, CONFIG.trackLength), strat);
        if (value > bestValue) { bestValue = value; bestSteps = steps; }
      }
      return { type: 'TELEPORT_MOVE', steps: bestSteps };
    }
    case 'preCombat': return preCombatAction(s);
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
