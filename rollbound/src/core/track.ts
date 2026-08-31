// Track-generering med fairness-regler:
//  - én shop pr. tredjedel (ekstra shops frit)
//  - én elite pr. tredjedel, aldrig i de første ~20% af tracket
//  - mindst én camp i sidste tredjedel
//  - traps aldrig nabo til en elite

import { CONFIG } from './config';
import type { RngCursor } from './rng';
import type { TileType } from './types';

export function generateTrack(rng: RngCursor): TileType[] {
  const L = CONFIG.trackLength;
  const track: (TileType | null)[] = new Array(L + 1).fill(null);
  track[L] = 'boss';

  const free = (lo = 1, hi = L - 1) => {
    const f: number[] = [];
    for (let i = lo; i <= hi; i++) if (!track[i]) f.push(i);
    return f;
  };
  const placeIn = (type: TileType, lo: number, hi: number) => {
    const slots = free(lo, hi);
    track[slots[Math.floor(rng.rand() * slots.length)]] = type;
  };

  const L1 = Math.floor((L - 1) / 3);
  const L2 = Math.floor((2 * (L - 1)) / 3);
  const thirds: [number, number][] = [[1, L1], [L1 + 1, L2], [L2 + 1, L - 1]];

  for (let i = 0; i < CONFIG.tiles.shop; i++) {
    if (i < 3) placeIn('shop', thirds[i][0], thirds[i][1]);
    else placeIn('shop', 1, L - 1);
  }

  const eliteMin = Math.max(2, Math.round(L * 0.21));
  for (let i = 0; i < CONFIG.tiles.elite; i++) {
    if (i === 0) placeIn('elite', eliteMin, L1);
    else if (i < 3) placeIn('elite', thirds[i][0], thirds[i][1]);
    else placeIn('elite', L1 + 1, L - 1);
  }

  placeIn('camp', L2 + 1, L - 1);
  for (let i = 0; i < CONFIG.tiles.camp - 1; i++) placeIn('camp', 1, L - 1);

  for (let i = 0; i < CONFIG.tiles.trap; i++) {
    const slots = free().filter(p => track[p - 1] !== 'elite' && track[p + 1] !== 'elite');
    track[slots[Math.floor(rng.rand() * slots.length)]] = 'trap';
  }

  const rest: TileType[] = [];
  const fill: [TileType, number][] = [
    ['blank', CONFIG.tiles.blank],
    ['enemy', CONFIG.tiles.enemy],
    ['gold', CONFIG.tiles.gold],
    ['treasure', CONFIG.tiles.treasure],
    ['event', CONFIG.tiles.event],
  ];
  for (const [type, n] of fill) for (let i = 0; i < n; i++) rest.push(type);
  rng.shuffle(rest);
  for (const pos of free()) track[pos] = rest.pop()!;

  return track as TileType[];
}
