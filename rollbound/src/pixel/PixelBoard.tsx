// Fuldt board med fog-of-war (beslutning 2026-09-03): alle 70 felter ligger
// fast i en slange i verdensrum — BRIKKEN flytter sig, boardet gør ikke.
// Kameraet er et 3-rækkers viewport, der glider efter helten. Felter uden for
// visibleAhead renderes face-down (typen må ALDRIG lækkes — heller ikke i
// aria/klasser); besøgte felter forbliver afsløret bag dig.

import type { CSSProperties } from 'react';
import { CONFIG } from '../core/config';
import { availableNudges } from '../core/equipment';
import { visibleAhead } from '../core/engine';
import type { GameState, TileType } from '../core/types';
import { tileChip } from '../ui/preview';
import { FacedownTile, PixelTile } from './PixelTile';

// Slange-geometri: 6 felter pr. række (matcher den hidtidige board-bredde),
// nederste række først, boustrofedon opad mod bossen. Rækketrin = 94px celle
// + 12px gap = 106px — SKAL matche .pixel-path-grid og connect-up i pixel.css.
const COLS = 6;
const ROW_STEP = 106;
const TILE_COUNT = CONFIG.trackLength + 1; // inkl. startfeltet S
const ROWS = Math.ceil(TILE_COUNT / COLS);
const VIEWPORT_ROWS = 3;

type Direction = 'right' | 'left' | 'up';

interface WorldSlot {
  column: number; // 1-baseret CSS grid-kolonne
  row: number;    // 1-baseret CSS grid-række (1 = øverst)
  next?: Direction;
}

function worldSlot(pos: number): WorldSlot {
  const r = Math.floor(pos / COLS); // 0 = nederste række
  const indexInRow = pos % COLS;
  const leftToRight = r % 2 === 0;
  const column = leftToRight ? indexInRow + 1 : COLS - indexInRow;
  const row = ROWS - r;
  if (pos >= CONFIG.trackLength) return { column, row };
  const next: Direction = indexInRow === COLS - 1 ? 'up' : leftToRight ? 'right' : 'left';
  return { column, row, next };
}

// Kameraet lægger heltens række i BUNDEN af viewporten, så der altid er
// ~2 rækker synlige fremad (beslutning 2026-09-03); clampet til boardets ender
function cameraScroll(heroPos: number): number {
  const heroRow = Math.floor(heroPos / COLS);
  const target = (ROWS - VIEWPORT_ROWS - heroRow) * ROW_STEP;
  return Math.max(0, Math.min((ROWS - VIEWPORT_ROWS) * ROW_STEP, target));
}

export function PixelBoard({ state, displayPos = state.pos, moving = false, suppressTargets = false }: { state: GameState; displayPos?: number; moving?: boolean; suppressTargets?: boolean }) {
  const revealedTo = state.pos + visibleAhead(state);
  const rolledPhase = !moving && !suppressTargets && state.phase.t === 'rolled' ? state.phase : null;
  const roll = rolledPhase?.roll ?? null;
  const primaryTarget = roll === null ? -1 : Math.min(state.pos + roll, CONFIG.trackLength);
  const altTargets = new Set<number>();

  if (roll !== null && !rolledPhase?.wasReroll && availableNudges(state.hero) > 0) {
    if (roll > 1) altTargets.add(Math.min(state.pos + roll - 1, CONFIG.trackLength));
    if (roll < 6) altTargets.add(Math.min(state.pos + roll + 1, CONFIG.trackLength));
  }

  const worldStyle = {
    gridTemplateRows: `repeat(${ROWS}, 94px)`,
    transform: `translateY(${-cameraScroll(displayPos)}px)`,
  } as CSSProperties;

  // Ulige slangerækker løber mod venstre — spejlvend helten dér
  const heroRow = Math.floor(displayPos / COLS);
  const heroFacing: 'left' | 'right' = heroRow % 2 === 1 ? 'left' : 'right';
  // Viewportens øverste række: dér skal tooltips flippe NED, ellers klippes
  // de af viewportens overflow-kant
  const topVisibleRow = Math.min(Math.max(heroRow, 0), ROWS - VIEWPORT_ROWS) + VIEWPORT_ROWS - 1;

  return (
    <section className="pixel-board-panel" aria-label="Game board">
      <div className="pixel-world-decor" aria-hidden="true">
        <i className="tree tree-a" /><i className="tree tree-b" /><i className="tree tree-c" />
        <i className="ruin ruin-a" /><i className="ruin ruin-b" />
        <i className="ember ember-a" /><i className="ember ember-b" />
      </div>
      <div className="pixel-board-viewport">
        <div className="pixel-path-grid" role="list" style={worldStyle}>
          {Array.from({ length: TILE_COUNT }, (_, pos) => {
            const slot = worldSlot(pos);
            const revealed = pos <= revealedTo;
            const slotStyle = { gridColumn: slot.column, gridRow: slot.row } as CSSProperties;
            const connectorState = !slot.next
              ? ''
              : moving && pos >= state.pos && pos < displayPos
                ? 'path-moving'
                : pos < displayPos
                  ? 'path-traveled'
                  : 'path-upcoming';
            const type: TileType = pos === 0 ? 'blank' : state.track[pos];
            const chip = pos === 0 || !revealed ? null : tileChip(state, pos);
            return (
              <div
                className={`pixel-path-slot ${slot.next ? `connect-${slot.next} ${connectorState}` : ''}`}
                style={slotStyle}
                key={pos}
                role="presentation"
              >
                {revealed ? (
                  <PixelTile
                    chip={chip}
                    current={pos === displayPos}
                    heroFacing={heroFacing}
                    heroMoving={moving}
                    pos={pos}
                    primary={pos === primaryTarget}
                    reachable={altTargets.has(pos)}
                    tipBelow={Math.floor(pos / COLS) >= topVisibleRow}
                    type={type}
                    visited={pos < displayPos}
                  />
                ) : (
                  <FacedownTile depth={pos - revealedTo} pos={pos} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="pixel-board-footer">
        <span>TILE {displayPos}/{CONFIG.trackLength}</span>
        <span>{Math.max(0, CONFIG.trackLength - displayPos)} TILES TO THE BOSS</span>
        <span>SEED {state.seed}</span>
      </div>
    </section>
  );
}
