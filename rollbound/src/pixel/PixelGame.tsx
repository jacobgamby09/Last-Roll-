import { useEffect, useReducer, useRef, useState } from 'react';
import { CONFIG } from '../core/config';
import { newGame, reducer, type Action } from '../core/engine';
import { cursor } from '../core/rng';
import { PixelActionPanel } from './PixelActionPanel';
import { PixelBoard } from './PixelBoard';
import { PixelHud } from './PixelHud';
import './pixel.css';

function initialSeed(): number {
  const requested = Number(new URLSearchParams(window.location.search).get('seed'));
  return Number.isSafeInteger(requested) && requested >= 0 ? requested : Math.floor(Math.random() * 2 ** 31);
}

export function PixelGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => newGame(initialSeed()));
  const [displayPos, setDisplayPos] = useState(state.pos);
  const [movementSteps, setMovementSteps] = useState<number | null>(null);
  const movementTimer = useRef<number | null>(null);
  const moving = movementSteps !== null;

  useEffect(() => () => {
    if (movementTimer.current !== null) window.clearTimeout(movementTimer.current);
  }, []);

  const dispatchWithPresentation = (action: Action) => {
    if (moving) return;

    if (action.type === 'RESTART') {
      setDisplayPos(0);
      dispatch(action);
      return;
    }

    if (state.phase.t !== 'rolled') {
      dispatch(action);
      return;
    }

    let steps: number | null = null;
    if (action.type === 'ACCEPT') steps = state.phase.roll;
    if (action.type === 'NUDGE') steps = state.phase.roll + action.dir;
    if (action.type === 'REROLL') steps = cursor(state.rngState).d6();

    if (steps === null) {
      dispatch(action);
      return;
    }

    const target = Math.min(state.pos + steps, CONFIG.trackLength);
    let nextPos = state.pos;
    setMovementSteps(steps);

    const advance = () => {
      if (nextPos < target) {
        nextPos += 1;
        setDisplayPos(nextPos);
        movementTimer.current = window.setTimeout(advance, 105);
        return;
      }

      movementTimer.current = window.setTimeout(() => {
        dispatch(action);
        setMovementSteps(null);
      }, 140);
    };

    movementTimer.current = window.setTimeout(advance, 80);
  };

  return (
    <main className="pixel-page">
      <div className="pixel-game">
        <header className="pixel-header">
          <div><small>BOARD-ROGUELIKE PROTOTYPE</small><h1>ROLLBOUND</h1></div>
          <div className="pixel-header-actions">
            <a href="?ui=tiles">TILE LAB</a>
            <a href="?ui=equipment">GEAR LAB</a>
            <a href="?ui=resources">RESOURCE LAB</a>
            <a href="?ui=classic">KLASSISK UI</a>
            <button disabled={moving} onClick={() => dispatchWithPresentation({ type: 'RESTART' })} type="button">NYT RUN</button>
          </div>
        </header>
        <PixelHud state={state} />
        <PixelBoard displayPos={displayPos} moving={moving} state={state} />
        <PixelActionPanel dispatch={dispatchWithPresentation} movementSteps={movementSteps} state={state} />
      </div>
    </main>
  );
}
