// Seedet, funktionel RNG (mulberry32). Ingen mutable global state —
// rng-tilstanden bor i GameState, så reducers forbliver rene.

export function rngStep(state: number): { value: number; next: number } {
  let s = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, next: s };
}

// Cursor til en sekvens af træk: opret, træk, og aflæs slut-state.
export interface RngCursor {
  state: number;
  rand(): number;
  int(a: number, b: number): number; // inklusiv
  d6(): number;
  shuffle<T>(arr: T[]): T[];
}

export function cursor(state: number): RngCursor {
  const c: RngCursor = {
    state,
    rand() {
      const { value, next } = rngStep(c.state);
      c.state = next;
      return value;
    },
    int(a, b) {
      return a + Math.floor(c.rand() * (b - a + 1));
    },
    d6() {
      return c.int(1, 6);
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(c.rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
  return c;
}
