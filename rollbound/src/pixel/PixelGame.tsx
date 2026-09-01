import { useEffect, useReducer, useRef, useState } from 'react';
import { CONFIG } from '../core/config';
import { newGame, reducer, type Action } from '../core/engine';
import { cursor } from '../core/rng';
import { PixelActionPanel } from './PixelActionPanel';
import { PixelBoard } from './PixelBoard';
import type { DiceRollFx } from './PixelDie';
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
  const [rollFx, setRollFx] = useState<DiceRollFx>({ stage: 'idle', value: 1 });
  const movementTimer = useRef<number | null>(null);
  const rollFxTimers = useRef<number[]>([]);
  const moving = movementSteps !== null;
  const rolling = rollFx.stage !== 'idle';
  const presentationBusy = moving || rolling;

  useEffect(() => () => {
    if (movementTimer.current !== null) window.clearTimeout(movementTimer.current);
    rollFxTimers.current.forEach(timer => window.clearTimeout(timer));
  }, []);

  const scheduleRollFx = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    rollFxTimers.current.push(timer);
  };

  const playRollFx = (finalValue: number, onComplete: () => void) => {
    rollFxTimers.current.forEach(timer => window.clearTimeout(timer));
    rollFxTimers.current = [];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRollFx({ stage: 'impact', value: finalValue });
      scheduleRollFx(() => {
        setRollFx({ stage: 'idle', value: finalValue });
        onComplete();
      }, 150);
      return;
    }

    const tumbleFaces = [2, 5, 1, 6, 3, 4, 2, 6];
    setRollFx({ stage: 'anticipation', value: tumbleFaces[0] });
    tumbleFaces.forEach((value, index) => {
      scheduleRollFx(() => setRollFx({ stage: 'tumble', value }), 120 + index * 55);
    });
    scheduleRollFx(() => setRollFx({ stage: 'impact', value: finalValue }), 590);
    scheduleRollFx(() => {
      setRollFx({ stage: 'idle', value: finalValue });
      rollFxTimers.current = [];
      onComplete();
    }, 780);
  };

  const beginMovement = (action: Action, steps: number) => {
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

  const dispatchWithPresentation = (action: Action) => {
    if (presentationBusy) return;

    if (action.type === 'RESTART') {
      setDisplayPos(0);
      dispatch(action);
      return;
    }

    if (action.type === 'ROLL' && state.phase.t === 'idle') {
      const finalValue = cursor(state.rngState).d6();
      playRollFx(finalValue, () => dispatch(action));
      return;
    }

    if (state.phase.t !== 'rolled') {
      dispatch(action);
      return;
    }

    let steps: number | null = null;
    if (action.type === 'ACCEPT') steps = state.phase.roll;
    if (action.type === 'NUDGE') steps = state.phase.roll + action.dir;
    if (action.type === 'REROLL') {
      const rerollSteps = cursor(state.rngState).d6();
      playRollFx(rerollSteps, () => beginMovement(action, rerollSteps));
      return;
    }

    if (steps === null) {
      dispatch(action);
      return;
    }

    beginMovement(action, steps);
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
            <button disabled={presentationBusy} onClick={() => dispatchWithPresentation({ type: 'RESTART' })} type="button">NYT RUN</button>
          </div>
        </header>
        <PixelHud state={state} />
        <PixelBoard displayPos={displayPos} moving={moving} state={state} suppressTargets={rolling} />
        <PixelActionPanel dispatch={dispatchWithPresentation} movementSteps={movementSteps} rollFx={rollFx} state={state} />
      </div>
    </main>
  );
}
