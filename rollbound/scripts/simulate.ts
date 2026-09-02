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
import { newGame, reducer, type Action } from '../src/core/engine';
import type { GameState, LevelPick } from '../src/core/types';

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

const TREASURE_PREFER: Record<Strategy['levelPick'], string[]> = {
  dmg: ['weapon', 'nudge', 'boots', 'gold', 'maxhp', 'armor'],
  defensive: ['armor', 'maxhp', 'boots', 'nudge', 'gold', 'weapon'],
  smart: ['weapon', 'maxhp', 'boots', 'nudge', 'armor', 'gold'],
};

function treasureAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'treasure') throw new Error('treasureAction uden treasure-fase');
  const options = s.phase.options;
  const prefer = s.hero.hp / s.hero.maxHp < 0.5 && strat.levelPick === 'smart'
    ? ['maxhp', 'armor', 'weapon', 'boots', 'nudge', 'gold']
    : TREASURE_PREFER[strat.levelPick];
  for (const key of prefer) {
    const index = options.findIndex(o => o.key === key);
    if (index >= 0) return { type: 'PICK_TREASURE', index };
  }
  return { type: 'PICK_TREASURE', index: 0 };
}

function shopAction(s: GameState, strat: Strategy): Action {
  if (s.phase.t !== 'shop') throw new Error('shopAction uden shop-fase');
  const { hero, phase } = s;
  const S = CONFIG.shop;
  const canHeal = hero.gold >= S.heal.cost && hero.hp < hero.maxHp;
  if (hero.hp / hero.maxHp < 0.6 && canHeal) return { type: 'BUY', item: 'heal' };
  const weaponOk = !phase.boughtWeapon && hero.loadout.weapon !== 'rusted-sword' && hero.gold >= S.weapon.cost;
  const armorOk = !phase.boughtArmor && hero.loadout.armor !== 'worn-plate' && hero.gold >= S.armorItem.cost;
  if (strat.levelPick === 'defensive') {
    if (armorOk) return { type: 'BUY', item: 'armor' };
    if (weaponOk) return { type: 'BUY', item: 'weapon' };
  } else {
    if (weaponOk) return { type: 'BUY', item: 'weapon' };
    if (armorOk) return { type: 'BUY', item: 'armor' };
  }
  // Boots købes ikke: 18 g for ~1 nudge er domineret af nudge til 8 g (se sim/FINDINGS.md)
  if (hero.nudges < 2 && hero.gold >= S.nudge) return { type: 'BUY', item: 'nudge' };
  if (hero.rerolls < 1 && hero.gold >= S.reroll) return { type: 'BUY', item: 'reroll' };
  if (hero.hp < hero.maxHp - 10 && canHeal) return { type: 'BUY', item: 'heal' };
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
    case 'equipment': // upgrades er strengt bedre; udstyr hvis der er råd
      return s.hero.gold >= s.phase.cost ? { type: 'EQUIP_OFFER' } : { type: 'KEEP_EQUIPMENT' };
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
