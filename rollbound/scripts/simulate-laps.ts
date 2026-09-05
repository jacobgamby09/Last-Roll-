// Lap-pivot sim: sweep over board-størrelser × strategier.
// Kør: npx vite-node scripts/simulate-laps.ts [runs pr. celle, default 2000]
// Svarer på pivot-dokumentets spørgsmål: rolls pr. lap, HP-attrition,
// all-1s-degenerering (lowRoller), board-størrelsens effekt, grow vs fixed.

import { playRun, type DraftOffer, type LapState, type LapStrategy, type RunResult } from '../src/laps/engine';

const runsPerCell = Number(process.argv[2]) || 2000;

// ---------- Strategier: forskellige draft-prioriteter ----------

function pickByPriority(offers: DraftOffer[], order: Array<DraftOffer['kind']>, tileBias?: (t: string) => number): DraftOffer {
  for (const kind of order) {
    const matching = offers.filter(o => o.kind === kind);
    if (matching.length === 0) continue;
    if (kind === 'tile' && tileBias) {
      return matching.reduce((a, b) => (tileBias((b as { tile: string }).tile) > tileBias((a as { tile: string }).tile) ? b : a));
    }
    return matching[0];
  }
  return offers[0];
}

const STRATEGIES: LapStrategy[] = [
  {
    // All-1s-testen: sænk terningen ved enhver lejlighed
    name: 'lowRoller',
    wantsDie: true,
    pickDraft: (offers) => pickByPriority(offers, ['die', 'tile', 'char'], t => ({ gold: 5, chest: 6, camp: 4, vault: 1, shrine: 1, combat: 3, elite: 2, shop: 4 }[t] ?? 0),
    ),
  },
  {
    // Modsat: behold høje faces, jagt roll-gatede kvalitetsfelter
    name: 'highRoller',
    wantsDie: false,
    pickDraft: (offers) => pickByPriority(offers, ['tile', 'char', 'die'], t => ({ vault: 8, shrine: 8, elite: 6, gold: 3, chest: 4, camp: 3, combat: 4, shop: 4 }[t] ?? 0),
    ),
  },
  {
    // Board-engine: fyld boardet med værdi
    name: 'boardEngine',
    wantsDie: false,
    pickDraft: (offers) => pickByPriority(offers, ['tile', 'die', 'char'], t => ({ gold: 5, chest: 6, camp: 6, vault: 5, shrine: 5, combat: 4, elite: 4, shop: 6 }[t] ?? 0),
    ),
  },
  {
    // Character-first: stats og abilities frem for alt
    name: 'charFirst',
    wantsDie: false,
    pickDraft: (offers) => pickByPriority(offers, ['char', 'tile', 'die']),
  },
  {
    // Balanced: skift efter behov — die tidligt, char midt, tiles sent
    name: 'balanced',
    wantsDie: true,
    pickDraft: (offers, s: LapState) => {
      const order: Array<DraftOffer['kind']> = s.lap <= 2 ? ['die', 'char', 'tile'] : s.lap <= 5 ? ['char', 'tile', 'die'] : ['tile', 'char', 'die'];
      return pickByPriority(offers, order, t => ({ camp: 6, chest: 5, gold: 4, vault: 4, shrine: 4, combat: 3, elite: 3, shop: 5 }[t] ?? 0));
    },
  },
];

// ---------- Sweep ----------

interface Cell {
  label: string;
  boardSize: number;
  grow: boolean;
  maxSize: number;
  dieDraftPower?: number;
}

const CELLS: Cell[] = [
  { label: 'fixed 10', boardSize: 10, grow: false, maxSize: 10 },
  { label: 'fixed 12', boardSize: 12, grow: false, maxSize: 12 },
  { label: 'fixed 16', boardSize: 16, grow: false, maxSize: 16 },
  { label: 'fixed 20', boardSize: 20, grow: false, maxSize: 20 },
  { label: 'grow 12→20', boardSize: 12, grow: true, maxSize: 20 },
  { label: 'fixed 12 · die×2', boardSize: 12, grow: false, maxSize: 12, dieDraftPower: 2 },
  { label: 'fixed 20 · die×2', boardSize: 20, grow: false, maxSize: 20, dieDraftPower: 2 },
];

function aggregate(results: RunResult[]) {
  const n = results.length;
  const wins = results.filter(r => r.won);
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return {
    winRate: (100 * wins.length) / n,
    avgLaps: avg(results.map(r => r.laps)),
    rollsPerLap: avg(wins.map(r => r.rollsPerLap)),
    dieEv: avg(results.map(r => r.dieEvEnd)),
    atk: avg(results.map(r => r.atkEnd)),
    hpAtFinal: avg(results.filter(r => r.hpAtFinalBoss >= 0).map(r => r.hpAtFinalBoss)),
    reachedFinal: (100 * results.filter(r => r.hpAtFinalBoss >= 0).length) / n,
    gold: avg(results.map(r => r.goldEarned)),
  };
}

console.log(`Lap-pivot sim — ${runsPerCell} runs pr. celle, ${CELLS.length} board-configs × ${STRATEGIES.length} strategier, finalLap 8\n`);
console.log('| Board | Strategi | Win rate | Når final | Laps Ø | Rolls/lap | Die EV slut | ATK slut | HP v. final | Guld Ø |');
console.log('|---|---|---|---|---|---|---|---|---|---|');

for (const cell of CELLS) {
  for (const strat of STRATEGIES) {
    const t0 = Date.now();
    const results: RunResult[] = [];
    for (let i = 0; i < runsPerCell; i++) {
      results.push(playRun(1000 + i, { boardSize: cell.boardSize, grow: cell.grow, maxSize: cell.maxSize, strategy: strat, dieDraftPower: cell.dieDraftPower }));
    }
    const a = aggregate(results);
    console.log(
      `| ${cell.label} | ${strat.name} | **${a.winRate.toFixed(1)}%** | ${a.reachedFinal.toFixed(1)}% | ${a.avgLaps.toFixed(2)} | ${a.rollsPerLap.toFixed(1)} | ${a.dieEv.toFixed(2)} | ${a.atk.toFixed(1)} | ${a.hpAtFinal.toFixed(1)} | ${a.gold.toFixed(0)} | _(${((Date.now() - t0) / 1000).toFixed(1)}s)_`,
    );
  }
}
