import type { CSSProperties } from 'react';
import { CONFIG } from '../core/config';
import { availableNudges } from '../core/equipment';
import type { GameState, TileType } from '../core/types';
import { tileChip } from '../ui/preview';
import { PixelTile } from './PixelTile';

type Direction = 'right' | 'left' | 'up';

interface PathSlot {
  column: number;
  next?: Direction;
  row: number;
}

const PATH_SLOTS: PathSlot[] = [
  { column: 1, row: 3, next: 'right' },
  { column: 2, row: 3, next: 'right' },
  { column: 3, row: 3, next: 'right' },
  { column: 4, row: 3, next: 'right' },
  { column: 5, row: 3, next: 'right' },
  { column: 6, row: 3, next: 'up' },
  { column: 6, row: 2, next: 'left' },
  { column: 5, row: 2, next: 'left' },
  { column: 4, row: 2, next: 'left' },
  { column: 3, row: 2, next: 'left' },
  { column: 2, row: 2, next: 'up' },
  { column: 2, row: 1, next: 'right' },
  { column: 3, row: 1, next: 'right' },
  { column: 4, row: 1, next: 'right' },
  { column: 5, row: 1 },
];

export function PixelBoard({ state, displayPos = state.pos, moving = false }: { state: GameState; displayPos?: number; moving?: boolean }) {
  const start = Math.max(0, state.pos - 2);
  const end = Math.min(CONFIG.trackLength, state.pos + CONFIG.visibility, start + PATH_SLOTS.length - 1);
  const positions = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  const rolledPhase = !moving && state.phase.t === 'rolled' ? state.phase : null;
  const roll = rolledPhase?.roll ?? null;
  const primaryTarget = roll === null ? -1 : Math.min(state.pos + roll, CONFIG.trackLength);
  const altTargets = new Set<number>();

  if (roll !== null && !rolledPhase?.wasReroll && availableNudges(state.hero) > 0) {
    if (roll > 1) altTargets.add(Math.min(state.pos + roll - 1, CONFIG.trackLength));
    if (roll < 6) altTargets.add(Math.min(state.pos + roll + 1, CONFIG.trackLength));
  }

  return (
    <section className="pixel-board-panel" aria-label="Spillebane">
      <div className="pixel-world-decor" aria-hidden="true">
        <i className="tree tree-a" /><i className="tree tree-b" /><i className="tree tree-c" />
        <i className="ruin ruin-a" /><i className="ruin ruin-b" />
        <i className="ember ember-a" /><i className="ember ember-b" />
      </div>
      <div className="pixel-path-grid" role="list">
        {positions.map((pos, index) => {
          const slot = PATH_SLOTS[index];
          const type: TileType = pos === 0 ? 'blank' : state.track[pos];
          const chip = pos === 0 ? null : tileChip(state, pos);
          const slotStyle = { gridColumn: slot.column, gridRow: slot.row } as CSSProperties;
          const connectorState = !slot.next
            ? ''
            : moving && pos >= state.pos && pos < displayPos
              ? 'path-moving'
              : pos < displayPos
                ? 'path-traveled'
                : 'path-upcoming';
          return (
            <div
              className={`pixel-path-slot ${slot.next ? `connect-${slot.next} ${connectorState}` : ''}`}
              style={slotStyle}
              key={pos}
              role="presentation"
            >
              <PixelTile
                chip={chip}
                current={pos === displayPos}
                heroMoving={moving}
                pos={pos}
                primary={pos === primaryTarget}
                reachable={altTargets.has(pos)}
                type={type}
                visited={pos < displayPos}
              />
            </div>
          );
        })}
      </div>
      <div className="pixel-board-footer">
        <span>FELT {displayPos}/{CONFIG.trackLength}</span>
        <span>{Math.max(0, CONFIG.trackLength - displayPos)} FELTER TIL BOSSEN</span>
        <span>SEED {state.seed}</span>
      </div>
    </section>
  );
}
