import { CONFIG } from '../core/config';
import type { GameState } from '../core/types';
import { TILE_META } from './tileMeta';
import { tileChip } from './preview';

export function TrackView({ state }: { state: GameState }) {
  const L = CONFIG.trackLength;
  const from = Math.max(1, state.pos - 2);
  const to = Math.min(L, state.pos + CONFIG.visibility);

  const landing = state.phase.t === 'rolled' ? Math.min(state.pos + state.phase.roll, L) : -1;
  const canNudge = state.phase.t === 'rolled' && !state.phase.wasReroll && state.hero.nudges > 0;
  const alts: number[] = [];
  if (state.phase.t === 'rolled' && canNudge) {
    const r = state.phase.roll;
    if (r - 1 >= 1) alts.push(Math.min(state.pos + r - 1, L));
    if (r + 1 <= 6) alts.push(Math.min(state.pos + r + 1, L));
  }

  const cells = [];
  for (let i = from; i <= to; i++) {
    const type = state.track[i];
    const meta = TILE_META[type];
    const chip = tileChip(state, i);
    const classes = ['tile', meta.cls];
    if (i === state.pos) classes.push('tile-hero');
    if (i === landing) classes.push('tile-landing');
    else if (alts.includes(i)) classes.push('tile-alt');
    cells.push(
      <div key={i} className={classes.join(' ')} title={`Felt ${i}: ${meta.label}`}>
        <span className="tile-num">{i}</span>
        <span className="tile-icon">{i === state.pos ? '🧙' : meta.icon}</span>
        {chip && <span className={`tile-chip ${chip.deadly ? 'deadly' : ''}`}>{chip.text}</span>}
      </div>,
    );
  }

  return (
    <div className="track-wrap">
      {state.pos === 0 && <div className="tile tile-start tile-hero"><span className="tile-num">S</span><span className="tile-icon">🧙</span></div>}
      <div className="track">{cells}</div>
      {to < L && <div className="track-more">… {L - to} felter til bossen</div>}
    </div>
  );
}
