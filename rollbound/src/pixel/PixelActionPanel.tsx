// Bund-panelet ejer kun board-flowet: idle (rul), rolled (destinationer),
// movement- og roll-præsentation. Alle interaktive faser (combat, loot,
// treasure, shop, level-up, game over) renderes som fullscreen-scener
// af PixelGame — se SceneShell/ScenePhases/CombatScene.

import { CONFIG } from '../core/config';
import { availableNudges } from '../core/equipment';
import type { Action } from '../core/engine';
import type { CSSProperties } from 'react';
import type { GameState } from '../core/types';
import { describeDest } from '../ui/preview';
import { PixelDie, type DiceRollFx } from './PixelDie';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';

interface Props {
  dispatch: (action: Action) => void;
  movementSteps?: number | null;
  onOpenInventory?: () => void;
  rollFx: DiceRollFx;
  state: GameState;
}

const ROLL_STAGE_COPY: Record<Exclude<DiceRollFx['stage'], 'idle'>, { eyebrow: string; detail: string }> = {
  anticipation: { eyebrow: 'CHARGING THE THROW', detail: 'The die gathers momentum' },
  tumble: { eyebrow: 'IN MOTION', detail: 'The outcome is still hidden' },
  impact: { eyebrow: 'RESULT LOCKING IN', detail: 'Possible destinations revealed' },
};

function RollAltar({ fx }: { fx: DiceRollFx }) {
  return (
    <span className={`pixel-roll-altar is-${fx.stage}`} aria-hidden="true">
      <i className="pixel-roll-sigil" />
      <PixelDie rolling={fx.stage !== 'idle'} value={fx.value} />
      <span className="pixel-roll-particles"><i /><i /><i /><i /><i /><i /></span>
    </span>
  );
}

function DestinationCard({ disabled, disabledReason, onSelect, primary, state, steps, tag }: {
  disabled: boolean;
  disabledReason?: string;
  onSelect: () => void;
  primary: boolean;
  state: GameState;
  steps: number;
  tag: string;
}) {
  const info = disabled ? null : describeDest(state, steps);
  const meta = info ? PIXEL_TILE_META[info.type] : null;
  const style = { '--card-accent': meta?.color ?? '#61556f' } as CSSProperties;

  return (
    <button
      className={`pixel-destination ${primary ? 'primary' : ''} ${disabled ? 'is-ghost' : ''}`}
      disabled={disabled}
      onClick={onSelect}
      style={style}
      type="button"
    >
      <small>{tag}</small>
      {info ? <PixelTileArt type={info.type} variant={info.posTo} /> : <span className="pixel-disabled-mark">×</span>}
      <b>{info?.title ?? 'NOT POSSIBLE'}</b>
      <span>{info?.detail ?? disabledReason ?? 'Not possible'}</span>
    </button>
  );
}

export function PixelActionPanel({ dispatch, movementSteps = null, onOpenInventory, rollFx, state }: Props) {
  const { hero, phase } = state;

  if (movementSteps !== null) {
    return (
      <section className="pixel-action-panel is-moving" aria-live="polite">
        <PixelDie value={movementSteps} />
        <div className="pixel-movement-copy">
          <small>MOVE LOCKED</small>
          <b>MOVING {movementSteps} TILES</b>
          <span className="pixel-movement-track" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span>
        </div>
      </section>
    );
  }

  if (rollFx.stage !== 'idle') {
    const copy = ROLL_STAGE_COPY[rollFx.stage];
    return (
      <section className={`pixel-action-panel pixel-roll-stage is-${rollFx.stage}`} aria-live="polite">
        <RollAltar fx={rollFx} />
        <div className="pixel-roll-stage-copy">
          <small>{copy.eyebrow}</small>
          <b>FATE IS ROLLING</b>
          <span>{copy.detail}</span>
        </div>
      </section>
    );
  }

  if (phase.t === 'idle') {
    return (
      <section className="pixel-action-panel is-idle">
        <div className="pixel-last-event"><small>LATEST</small><span>{state.log.at(-1)?.text}</span></div>
        <button aria-label="Roll a six-sided die" className="pixel-roll-button" onClick={() => dispatch({ type: 'ROLL' })} type="button">
          <RollAltar fx={{ stage: 'idle', value: state.rolls % 6 + 1 }} />
          <span className="pixel-roll-button-copy"><small>NEXT MOVE</small><b>ROLL THE DIE</b><em>{state.twinRollArmed ? 'FATE DIE ARMED: ROLL TWO, PICK ONE' : 'CLICK TO THROW'}</em></span>
        </button>
        {hero.consumables.length > 0 && onOpenInventory ? (
          <button className="pixel-secondary-button pixel-inventory-open" onClick={onOpenInventory} type="button">
            🎒 INVENTORY ({hero.consumables.length}/{CONFIG.consumableSlots}) — PRESS I
          </button>
        ) : null}
        <div className="pixel-roll-rule"><small>1 × D6</small><b>ROLL · EVALUATE · MANIPULATE</b></div>
      </section>
    );
  }

  if (phase.t === 'chooseRoll') {
    return (
      <section className="pixel-action-panel is-rolled">
        <div className="pixel-roll-result"><span>THE FATE DIE · <b>PICK ONE</b></span></div>
        <div className="pixel-destinations">
          {phase.rolls.map((roll, index) => {
            const info = describeDest(state, roll);
            const meta = PIXEL_TILE_META[info.type];
            return (
              <button className="pixel-destination" key={index} onClick={() => dispatch({ type: 'CHOOSE_ROLL', index: index as 0 | 1 })} style={{ '--card-accent': meta.color } as CSSProperties} type="button">
                <small>DIE {index + 1}</small>
                <PixelDie value={roll} />
                <b>{info.title}</b>
                <span>{info.detail}</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (phase.t === 'teleport') {
    return (
      <section className="pixel-action-panel is-rolled">
        <div className="pixel-roll-result"><span>TELEPORT SCROLL · <b>CHOOSE DESTINATION</b></span></div>
        <div className="pixel-destinations pixel-teleport-grid">
          {[1, 2, 3, 4, 5, 6].map(steps => {
            const info = describeDest(state, steps);
            const meta = PIXEL_TILE_META[info.type];
            return (
              <button className="pixel-destination" key={steps} onClick={() => dispatch({ type: 'TELEPORT_MOVE', steps })} style={{ '--card-accent': meta.color } as CSSProperties} type="button">
                <small>MOVE {steps}</small>
                <PixelTileArt type={info.type} variant={info.posTo} />
                <b>{info.title}</b>
                <span>{info.detail}</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (phase.t === 'rolled') {
    const nudgeCount = availableNudges(hero);
    const bootsPay = hero.bootsNudgeCharges > 0;
    const noNudgeReason = nudgeCount <= 0
      ? 'NO NUDGES LEFT'
      : phase.wasReroll
        ? 'REROLL IS FINAL'
        : undefined;
    const candidates = [
      {
        action: { type: 'NUDGE', dir: -1 } as Action,
        disabled: phase.roll <= 1 || nudgeCount <= 0 || phase.wasReroll,
        disabledReason: phase.roll <= 1 ? 'THE DIE CANNOT GO BELOW 1' : noNudgeReason,
        primary: false,
        steps: phase.roll - 1,
        tag: bootsPay ? '‹ NUDGE −1 · BOOTS FREE' : '‹ NUDGE −1',
      },
      { action: { type: 'ACCEPT' } as Action, disabled: false, primary: true, steps: phase.roll, tag: `ACCEPT ${phase.roll}` },
      {
        action: { type: 'NUDGE', dir: 1 } as Action,
        disabled: phase.roll >= 6 || nudgeCount <= 0 || phase.wasReroll,
        disabledReason: phase.roll >= 6 ? 'THE DIE CANNOT GO ABOVE 6' : noNudgeReason,
        primary: false,
        steps: phase.roll + 1,
        tag: bootsPay ? 'NUDGE +1 · BOOTS FREE ›' : 'NUDGE +1 ›',
      },
    ];

    return (
      <section className="pixel-action-panel is-rolled">
        <div className="pixel-roll-dock">
          <div className="pixel-roll-result"><PixelDie value={phase.roll} /><span>YOU ROLLED <b>{phase.roll}</b></span></div>
          <span className="pixel-roll-dock-meta">NUDGE ×{nudgeCount} · REROLL ×{hero.rerolls}</span>
          <button
            className="pixel-secondary-button pixel-reroll-button"
            disabled={hero.rerolls <= 0 || phase.wasReroll}
            onClick={() => dispatch({ type: 'REROLL' })}
            type="button"
          >
            <b>↻ REROLL</b>
            <small>{phase.wasReroll ? 'ALREADY REROLLED' : hero.rerolls <= 0 ? 'NONE LEFT' : 'NEW RESULT IS FINAL'}</small>
          </button>
        </div>
        <div className="pixel-destinations">
          {candidates.map(candidate => (
            <DestinationCard
              {...candidate}
              key={candidate.tag}
              onSelect={() => dispatch(candidate.action)}
              state={state}
            />
          ))}
        </div>
      </section>
    );
  }

  // Alle øvrige faser renderes som fullscreen-scener af PixelGame.
  return null;
}
