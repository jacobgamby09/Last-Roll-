import { useEffect, useReducer, useRef, useState } from 'react';
import { CONFIG } from '../core/config';
import { newGame, peekRoll, reducer, type Action } from '../core/engine';
import type { GameState } from '../core/types';
import { CombatScene, type CombatView } from './CombatScene';
import { InventoryScene } from './InventoryScene';
import { PixelActionPanel } from './PixelActionPanel';
import { PixelBoard } from './PixelBoard';
import type { DiceRollFx } from './PixelDie';
import { PixelHud } from './PixelHud';
import { UI_SCALE } from './presentation';
import { PIXEL_TILE_META } from './pixelMeta';
import { SceneShell } from './SceneShell';
import { EquipmentOffer, LevelUpChoice, OverPanel, PreCombatPanel, ShopPanel, TreasureChoice } from './ScenePhases';
import { combatSpriteFor } from './combatSpriteAssets';
import { enemyForTile } from '../core/combat';
import './pixel.css';

function initialSeed(): number {
  const requested = Number(new URLSearchParams(window.location.search).get('seed'));
  return Number.isSafeInteger(requested) && requested >= 0 ? requested : Math.floor(Math.random() * 2 ** 31);
}

// Fullscreen-scene for interaktive faser uden for combat (beslutning 2026-09-02).
function PhaseScene({ dispatch, state }: { dispatch: (a: Action) => void; state: GameState }) {
  const { phase } = state;
  switch (phase.t) {
    case 'treasure':
      return (
        <SceneShell accent={PIXEL_TILE_META.treasure.color} subtitle={`TILE ${state.pos}`} title="TREASURE CHEST">
          <TreasureChoice dispatch={dispatch} state={state} />
        </SceneShell>
      );
    case 'shop':
      return (
        <SceneShell accent={PIXEL_TILE_META.shop.color} subtitle={`TILE ${state.pos}`} title="SHOP">
          <ShopPanel dispatch={dispatch} state={state} />
        </SceneShell>
      );
    case 'equipment': {
      const sourceLabel = phase.source === 'shop' ? 'SHOP' : phase.source === 'drop' ? 'DROP' : 'TREASURE';
      return (
        <SceneShell accent={PIXEL_TILE_META.treasure.color} subtitle={sourceLabel} title="NEW GEAR">
          <EquipmentOffer dispatch={dispatch} state={state} />
        </SceneShell>
      );
    }
    case 'levelup':
      return (
        <SceneShell accent={PIXEL_TILE_META.event.color} subtitle="LEVEL UP" title={`LEVEL ${state.hero.level}`}>
          <LevelUpChoice dispatch={dispatch} state={state} />
        </SceneShell>
      );
    case 'preCombat': {
      const enemy = enemyForTile(state.pos, phase.tile);
      const accent = PIXEL_TILE_META[combatSpriteFor(enemy).fallbackTile].color;
      return (
        <SceneShell accent={accent} className="pixel-precombat-scene" subtitle={`TILE ${state.pos} · PREPARE YOURSELF`} title={enemy.name.toUpperCase()}>
          <PreCombatPanel dispatch={dispatch} state={state} />
        </SceneShell>
      );
    }
    case 'over':
      return (
        <SceneShell accent={phase.won ? PIXEL_TILE_META.camp.color : PIXEL_TILE_META.enemy.color} subtitle="RUN OVER" title={phase.won ? 'VICTORY' : 'YOU FELL'}>
          <OverPanel dispatch={dispatch} state={state} />
        </SceneShell>
      );
    default:
      return null;
  }
}

export function PixelGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => newGame(initialSeed()));
  const [displayPos, setDisplayPos] = useState(state.pos);
  const [movementSteps, setMovementSteps] = useState<number | null>(null);
  const [rollFx, setRollFx] = useState<DiceRollFx>({ stage: 'idle', value: 1 });
  const [combatView, setCombatView] = useState<CombatView | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const movementTimer = useRef<number | null>(null);
  const rollFxTimers = useRef<number[]>([]);
  const prevStateRef = useRef(state);
  const moving = movementSteps !== null;
  const rolling = rollFx.stage !== 'idle';
  const presentationBusy = moving || rolling || combatView !== null;

  // Combat-detektion: reduceren har afgjort kampen og lagt scriptet i
  // lastCombat — scenen afspiller bagefter fra prev-snapshot + script.
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;
    if (state.seed !== prev.seed) {
      setCombatView(null);
      setInventoryOpen(false);
      return;
    }
    if (state.lastCombat && state.combatSeq !== prev.combatSeq) {
      setCombatView({ script: state.lastCombat, heroBefore: prev.hero, pos: state.pos, seq: state.combatSeq });
      setInventoryOpen(false);
    }
    // Teleport-rulle/Skæbneterning skifter fase: aflever spilleren direkte i vælgeren
    if (inventoryOpen && (state.phase.t === 'teleport' || state.phase.t === 'chooseRoll')) {
      setInventoryOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Tastaturgenvej: I åbner/lukker inventory
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'i' || e.key === 'I') && !combatView) setInventoryOpen(v => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [combatView]);

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
    if (presentationBusy && action.type !== 'RESTART') return;

    if (action.type === 'RESTART') {
      setDisplayPos(0);
      setCombatView(null);
      dispatch(action);
      return;
    }

    if (action.type === 'ROLL' && state.phase.t === 'idle') {
      if (state.twinRollArmed) {
        dispatch(action); // Skæbneterning: chooseRoll-panelet viser begge terninger
        return;
      }
      const finalValue = peekRoll(state); // core ejer peek-kontrakten (inkl. dieTransform)
      playRollFx(finalValue, () => dispatch(action));
      return;
    }

    if (action.type === 'TELEPORT_MOVE' && state.phase.t === 'teleport') {
      beginMovement(action, action.steps);
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
      const rerollSteps = peekRoll(state);
      playRollFx(rerollSteps, () => beginMovement(action, rerollSteps));
      return;
    }

    if (steps === null) {
      dispatch(action);
      return;
    }

    beginMovement(action, steps);
  };

  // Scener bruger rå dispatch: reduceren er allerede afgjort, og deres
  // knapper (Equip/Keep, køb, restart) skal ikke gennem præsentations-låsen.
  const sceneDispatch = (action: Action) => {
    if (action.type === 'RESTART') {
      setDisplayPos(0);
      setCombatView(null);
    }
    dispatch(action);
  };

  const scenePhase = !combatView && !moving && !rolling
    && (state.phase.t === 'treasure' || state.phase.t === 'shop' || state.phase.t === 'equipment' || state.phase.t === 'levelup' || state.phase.t === 'preCombat' || state.phase.t === 'over');

  return (
    <main className="pixel-page" style={{ zoom: UI_SCALE }}>
      <div className="pixel-game">
        <header className="pixel-header">
          <div><small>BOARD-ROGUELIKE PROTOTYPE</small><h1>ROLLBOUND</h1></div>
          <div className="pixel-header-actions">
            <a href="?ui=tiles">TILE LAB</a>
            <a href="?ui=equipment">GEAR LAB</a>
            <a href="?ui=resources">RESOURCE LAB</a>
            <a href="?ui=classic">CLASSIC UI</a>
            <button disabled={moving || rolling} onClick={() => dispatchWithPresentation({ type: 'RESTART' })} type="button">NEW RUN</button>
          </div>
        </header>
        <PixelHud onOpenInventory={() => setInventoryOpen(true)} state={state} />
        <PixelBoard displayPos={displayPos} moving={moving} state={state} suppressTargets={rolling} />
        <PixelActionPanel dispatch={dispatchWithPresentation} movementSteps={movementSteps} onOpenInventory={() => setInventoryOpen(true)} rollFx={rollFx} state={state} />
      </div>
      {combatView ? (
        <CombatScene dispatch={sceneDispatch} onClose={() => setCombatView(null)} state={state} view={combatView} />
      ) : null}
      {scenePhase ? <PhaseScene dispatch={sceneDispatch} state={state} /> : null}
      {inventoryOpen && !combatView ? (
        <InventoryScene dispatch={sceneDispatch} onClose={() => setInventoryOpen(false)} state={state} />
      ) : null}
    </main>
  );
}
