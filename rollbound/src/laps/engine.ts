// Lap-pivot HEADLESS prototype (2026-09-05): cirkulært board, boss ved Start
// pr. lap, draft efter boss (tile / die-face / character), dieFaces som
// build-akse (lave ruller = flere landinger). KUN til simulation — svarer på
// pivot-dokumentets spørgsmål (lap-længde, HP-attrition, all-1s-degenerering,
// board-størrelse) FØR en UI-beslutning. Vælges pivotet, genbygges dette som
// rigtig reducer. Rører IKKE det spilbare spil (frosset: track-prototype-v1).

import { simulateFight } from '../core/combat';
import { cursor, type RngCursor } from '../core/rng';
import type { EnemyDef } from '../core/types';

export type LapTileType =
  | 'start' | 'blank' | 'gold' | 'combat' | 'elite' | 'chest' | 'camp'
  | 'shop' | 'vault' | 'shrine'; // vault/shrine er roll-gatede (kvalitet ved HØJE ruller)

export interface LapHero {
  hp: number;
  maxHp: number;
  atk: number;
  armor: number;
  gold: number;
  thorns: number;
  killHeal: number;
}

export interface LapState {
  board: LapTileType[];
  pos: number;
  lap: number;          // 1-baseret; boss ved hver Start-passage
  dieFaces: number[];   // 6 faces — draft sænker højeste face (lav = flere landinger)
  hero: LapHero;
  nudges: number;       // pr. lap
  rerolls: number;      // pr. lap
  rolls: number;
  landings: Partial<Record<LapTileType, number>>;
  over: { won: boolean; lap: number } | null;
}

export const LAPS_CONFIG = {
  finalLap: 8,
  startDie: [6, 6, 6, 5, 5, 5],
  nudgesPerLap: 2,
  rerollsPerLap: 1,
  hero: { hp: 30, atk: 5, armor: 0, gold: 0 },

  // Board-sammensætning ved start (resten fyldes med blanks)
  seedTiles: ['combat', 'combat', 'elite', 'camp', 'gold', 'chest', 'shop'] as LapTileType[],

  gold: 5,
  vaultGoldPerStep: 2,     // guld = 2 × rullet — kvalitet kræver HØJE ruller
  shrineMinRoll: 4,        // +1 ATK permanent, KUN ved rul >= 4
  campHeal: 12,
  chest: { heal: 8, gold: 6 }, // eller +1 ATK — bot vælger
  shop: { healCost: 8, heal: 10, atkCost: 12 },
  postBossFullHeal: true,  // lappen er eksamen; du starter næste lap frisk

  // Fjender skalerer pr. lap (blidere end v1 — 2 landinger/lap tåler ikke stejl kurve)
  combatEnemy: (lap: number): EnemyDef => ({ name: 'Pack', hp: 6 + 3 * lap, dmgMin: Math.round(1 + 0.5 * lap), dmgMax: Math.round(3 + 0.7 * lap), armor: 0, xp: 0, gold: 0 }),
  eliteEnemy: (lap: number): EnemyDef => ({ name: 'Elite', hp: 12 + 5 * lap, dmgMin: Math.round(2 + 0.7 * lap), dmgMax: Math.round(4 + lap), armor: lap >= 5 ? 1 : 0, xp: 0, gold: 0 }),
  boss: (lap: number, finalLap: number): EnemyDef => {
    const final = lap >= finalLap;
    const hp = Math.round((10 + 7 * lap) * (final ? 1.3 : 1));
    return { name: final ? 'Final Boss' : 'Boss', hp, dmgMin: Math.round(1 + 0.8 * lap) + (final ? 1 : 0), dmgMax: Math.round(3 + lap) + (final ? 1 : 0), armor: lap >= 6 ? 1 : 0, xp: 0, gold: 0 };
  },

  combatRewardAtk: 1,
  combatRewardGold: 8,
  eliteRewardAtk: 2,
  eliteRewardGold: 10,

  // Draft-tilbud efter boss: kategori-vægte og tile-pool
  draftTilePool: ['gold', 'chest', 'camp', 'combat', 'elite', 'vault', 'shrine', 'shop'] as LapTileType[],
  charRewards: ['atk2', 'hp8', 'thorns', 'killheal'] as const,
};

export type CharReward = (typeof LAPS_CONFIG.charRewards)[number];
export type DraftOffer =
  | { kind: 'tile'; tile: LapTileType }
  | { kind: 'die' }                     // sænk højeste face med 1 (min 1)
  | { kind: 'char'; reward: CharReward };

export interface LapStrategy {
  name: string;
  // Prioriteret draft-valg blandt 3 tilbud
  pickDraft(offers: DraftOffer[], s: LapState): DraftOffer;
  // Foretrukket landing blandt kandidat-positioner (efter nudge-økonomi)
  wantsDie: boolean; // om strategien overhovedet sigter mod lav terning
}

export interface RunResult {
  won: boolean;
  laps: number;          // gennemførte laps (boss-sejre)
  rolls: number;
  rollsPerLap: number;
  dieEvEnd: number;
  atkEnd: number;
  hpAtFinalBoss: number; // -1 hvis aldrig nået
  goldEarned: number;
  landings: Partial<Record<LapTileType, number>>;
}

function dieEv(faces: number[]): number {
  return faces.reduce((a, b) => a + b, 0) / faces.length;
}

function buildBoard(rng: RngCursor, size: number): LapTileType[] {
  const board: LapTileType[] = Array.from({ length: size }, () => 'blank');
  board[0] = 'start';
  // Placér seed-tiles på tilfældige blanke pladser
  for (const tile of LAPS_CONFIG.seedTiles) {
    for (let tries = 0; tries < 40; tries++) {
      const i = rng.int(1, size - 1);
      if (board[i] === 'blank') { board[i] = tile; break; }
    }
  }
  return board;
}

function heroCombatant(h: LapHero) {
  return { hp: h.hp, maxHp: h.maxHp, dmgMin: h.atk, dmgMax: h.atk + 2, armor: h.armor };
}

function fight(s: LapState, rng: RngCursor, enemy: EnemyDef): boolean {
  const mods = { ...(s.hero.thorns ? { thorns: s.hero.thorns } : {}), ...(s.hero.killHeal ? { killHeal: s.hero.killHeal } : {}) };
  const script = simulateFight(heroCombatant(s.hero), enemy, rng, mods);
  s.hero.hp = script.result.heroHpAfter;
  if (script.result.winner !== 'hero') {
    s.over = { won: false, lap: s.lap };
    return false;
  }
  return true;
}

// Heuristisk felt-værdi for nudge/reroll-beslutninger
function tileValue(s: LapState, tile: LapTileType, roll: number): number {
  const h = s.hero;
  const hpFrac = h.hp / h.maxHp;
  switch (tile) {
    case 'gold': return LAPS_CONFIG.gold * 0.8;
    case 'vault': return LAPS_CONFIG.vaultGoldPerStep * roll * 0.8;
    case 'chest': return 6;
    case 'camp': return Math.min(LAPS_CONFIG.campHeal, h.maxHp - h.hp) * (hpFrac < 0.5 ? 1.6 : 0.5);
    case 'shrine': return roll >= LAPS_CONFIG.shrineMinRoll ? 9 : 0;
    case 'shop': return h.gold >= LAPS_CONFIG.shop.healCost ? 5 : 1;
    case 'combat': {
      const e = LAPS_CONFIG.combatEnemy(s.lap);
      const safe = hpFrac > 0.45 && h.hp > e.dmgMax * 2.2;
      return safe ? 7 : -8;
    }
    case 'elite': {
      const e = LAPS_CONFIG.eliteEnemy(s.lap);
      const safe = hpFrac > 0.65 && h.hp > e.dmgMax * 3;
      return safe ? 12 : -14;
    }
    case 'start': return 0;
    case 'blank': return 0;
  }
}

function resolveTile(s: LapState, rng: RngCursor, roll: number) {
  const tile = s.board[s.pos];
  s.landings[tile] = (s.landings[tile] ?? 0) + 1;
  const h = s.hero;
  switch (tile) {
    case 'gold': h.gold += LAPS_CONFIG.gold; break;
    case 'vault': h.gold += LAPS_CONFIG.vaultGoldPerStep * roll; break;
    case 'camp': h.hp = Math.min(h.maxHp, h.hp + LAPS_CONFIG.campHeal); break;
    case 'shrine': if (roll >= LAPS_CONFIG.shrineMinRoll) h.atk += 1; break;
    case 'chest':
      if (h.hp / h.maxHp < 0.55) h.hp = Math.min(h.maxHp, h.hp + LAPS_CONFIG.chest.heal);
      else if (s.lap <= 5) h.atk += 1;
      else h.gold += LAPS_CONFIG.chest.gold;
      break;
    case 'shop': {
      const sh = LAPS_CONFIG.shop;
      while (h.hp / h.maxHp < 0.6 && h.gold >= sh.healCost && h.hp < h.maxHp) { h.gold -= sh.healCost; h.hp = Math.min(h.maxHp, h.hp + sh.heal); }
      while (h.gold >= sh.atkCost) { h.gold -= sh.atkCost; h.atk += 1; }
      break;
    }
    case 'combat':
      if (fight(s, rng, LAPS_CONFIG.combatEnemy(s.lap))) {
        if (h.hp / h.maxHp < 0.5) h.hp = Math.min(h.maxHp, h.hp + 5);
        else if (s.lap <= 5) h.atk += LAPS_CONFIG.combatRewardAtk;
        else h.gold += LAPS_CONFIG.combatRewardGold;
      }
      break;
    case 'elite':
      if (fight(s, rng, LAPS_CONFIG.eliteEnemy(s.lap))) {
        h.atk += LAPS_CONFIG.eliteRewardAtk;
        h.gold += LAPS_CONFIG.eliteRewardGold;
      }
      break;
    case 'start':
    case 'blank':
      break;
  }
}

function rollDraftOffer(rng: RngCursor): DraftOffer {
  const r = rng.rand();
  if (r < 0.45) return { kind: 'tile', tile: LAPS_CONFIG.draftTilePool[rng.int(0, LAPS_CONFIG.draftTilePool.length - 1)] };
  if (r < 0.70) return { kind: 'die' };
  return { kind: 'char', reward: LAPS_CONFIG.charRewards[rng.int(0, LAPS_CONFIG.charRewards.length - 1)] };
}

function applyDraft(s: LapState, rng: RngCursor, offer: DraftOffer, opts: RunOptions) {
  const { grow, maxSize } = opts;
  if (offer.kind === 'die') {
    // dieDraftPower = hvor mange faces ét draft sænker (aksens styrke-knap)
    for (let n = 0; n < (opts.dieDraftPower ?? 1); n++) {
      const i = s.dieFaces.indexOf(Math.max(...s.dieFaces));
      if (s.dieFaces[i] > 1) s.dieFaces[i] -= 1;
    }
    return;
  }
  if (offer.kind === 'char') {
    const h = s.hero;
    if (offer.reward === 'atk2') h.atk += 2;
    else if (offer.reward === 'hp8') { h.maxHp += 10; h.hp += 10; }
    else if (offer.reward === 'thorns') h.thorns = Math.max(h.thorns, 2);
    else h.killHeal = Math.max(h.killHeal, 3);
    return;
  }
  // Tile: udvid boardet (grow-mode, under max) ellers erstat en blank —
  // er der ingen blanks, erstat et tilfældigt ikke-start-felt ("refine")
  if (grow && s.board.length < maxSize) {
    const at = rng.int(1, s.board.length - 1);
    s.board.splice(at, 0, offer.tile);
    if (s.pos >= at) s.pos += 1;
    return;
  }
  const blanks = s.board.flatMap((t, i) => (t === 'blank' ? [i] : []));
  const target = blanks.length > 0
    ? blanks[rng.int(0, blanks.length - 1)]
    : rng.int(1, s.board.length - 1);
  if (s.board[target] !== 'start') s.board[target] = offer.tile;
}

export interface RunOptions {
  boardSize: number;
  grow: boolean;      // false: fast størrelse; true: tile-drafts udvider op til maxSize
  maxSize: number;
  strategy: LapStrategy;
  dieDraftPower?: number; // faces pr. die-draft (default 1)
}

export function playRun(seed: number, opts: RunOptions): RunResult {
  const rng = cursor(seed);
  const s: LapState = {
    board: buildBoard(rng, opts.boardSize),
    pos: 0,
    lap: 1,
    dieFaces: [...LAPS_CONFIG.startDie],
    hero: { ...LAPS_CONFIG.hero, maxHp: LAPS_CONFIG.hero.hp, thorns: 0, killHeal: 0 },
    nudges: LAPS_CONFIG.nudgesPerLap,
    rerolls: LAPS_CONFIG.rerollsPerLap,
    rolls: 0,
    landings: {},
    over: null,
  };
  let hpAtFinalBoss = -1;
  let goldEarned = 0;
  let lapRollCounts = 0;

  const rollFace = (): number => s.dieFaces[rng.int(0, 5)];

  while (!s.over && s.rolls < 400) {
    s.rolls++;
    let roll = rollFace();

    // Reroll-beslutning: hvis bedste kandidat er klart dårlig
    const candidateValue = (steps: number) => tileValue(s, s.board[(s.pos + steps) % s.board.length], steps);
    let best = candidateValue(roll);
    if (s.nudges > 0) best = Math.max(best, roll > 1 ? candidateValue(roll - 1) : -99, candidateValue(roll + 1));
    if (s.rerolls > 0 && best < 0) {
      s.rerolls--;
      roll = rollFace();
    }

    // Nudge-beslutning: vælg bedste af roll-1/roll/roll+1 (koster 1 nudge)
    let steps = roll;
    if (s.nudges > 0) {
      const options = [roll, roll - 1, roll + 1].filter(v => v >= 1);
      let bestSteps = roll;
      let bestValue = candidateValue(roll);
      for (const v of options) {
        const value = candidateValue(v) - (v === roll ? 0 : 1.5); // nudge har alternativomkostning
        if (value > bestValue) { bestValue = value; bestSteps = v; }
      }
      if (bestSteps !== roll) s.nudges--;
      steps = bestSteps;
    }

    const goldBefore = s.hero.gold;
    const wrapped = s.pos + steps >= s.board.length;
    s.pos = (s.pos + steps) % s.board.length;

    if (wrapped) {
      // Boss ved Start: eksamen for lappen
      if (s.lap >= LAPS_CONFIG.finalLap) hpAtFinalBoss = s.hero.hp;
      const survived = fight(s, rng, LAPS_CONFIG.boss(s.lap, LAPS_CONFIG.finalLap));
      if (!survived) break;
      if (s.lap >= LAPS_CONFIG.finalLap) { s.over = { won: true, lap: s.lap }; break; }
      if (LAPS_CONFIG.postBossFullHeal) s.hero.hp = s.hero.maxHp;
      // Draft 1 af 3
      const offers = [rollDraftOffer(rng), rollDraftOffer(rng), rollDraftOffer(rng)];
      applyDraft(s, rng, opts.strategy.pickDraft(offers, s), opts);
      lapRollCounts = s.rolls;
      s.lap++;
      s.nudges = LAPS_CONFIG.nudgesPerLap;
      s.rerolls = LAPS_CONFIG.rerollsPerLap;
    }

    if (!s.over) resolveTile(s, rng, steps);
    goldEarned += Math.max(0, s.hero.gold - goldBefore);
  }

  const lapsDone = s.over?.won ? LAPS_CONFIG.finalLap : Math.max(0, s.lap - 1);
  return {
    won: s.over?.won ?? false,
    laps: lapsDone,
    rolls: s.rolls,
    rollsPerLap: lapsDone > 0 ? (s.over?.won ? s.rolls / lapsDone : lapRollCounts / Math.max(1, lapsDone)) : s.rolls,
    dieEvEnd: dieEv(s.dieFaces),
    atkEnd: s.hero.atk,
    hpAtFinalBoss,
    goldEarned,
    landings: s.landings,
  };
}
