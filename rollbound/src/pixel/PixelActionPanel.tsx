// Bund-panelet ejer kun board-flowet: idle (rul), rolled (destinationer),
// movement- og roll-præsentation. Alle interaktive faser (combat, loot,
// treasure, shop, level-up, game over) renderes som fullscreen-scener
// af PixelGame — se SceneShell/ScenePhases/CombatScene.

import { availableNudges } from '../core/equipment';
import { CONSUMABLES, consumableEffectText, isPreCombatConsumable } from '../core/items';
import type { Action } from '../core/engine';
import type { CSSProperties } from 'react';
import type { GameState } from '../core/types';
import { describeDest } from '../ui/preview';
import { PixelDie, type DiceRollFx } from './PixelDie';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';
import { ConsumableGlyph } from './ScenePhases';

interface Props {
  dispatch: (action: Action) => void;
  movementSteps?: number | null;
  rollFx: DiceRollFx;
  state: GameState;
}

const ROLL_STAGE_COPY: Record<Exclude<DiceRollFx['stage'], 'idle'>, { eyebrow: string; detail: string }> = {
  anticipation: { eyebrow: 'KASTET LADES', detail: 'Terningen samler momentum' },
  tumble: { eyebrow: 'I BEVÆGELSE', detail: 'Udfaldet er endnu skjult' },
  impact: { eyebrow: 'RESULTATET LÅSES', detail: 'Mulige destinationer afsløres' },
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
      className={`pixel-destination ${primary ? 'primary' : ''}`}
      disabled={disabled}
      onClick={onSelect}
      style={style}
      type="button"
    >
      <small>{tag}</small>
      {info ? <PixelTileArt type={info.type} variant={info.posTo} /> : <span className="pixel-disabled-mark">×</span>}
      <b>{info?.title ?? 'IKKE MULIGT'}</b>
      <span>{info?.detail ?? disabledReason ?? 'Ikke muligt'}</span>
    </button>
  );
}

export function PixelActionPanel({ dispatch, movementSteps = null, rollFx, state }: Props) {
  const { hero, phase } = state;

  if (movementSteps !== null) {
    return (
      <section className="pixel-action-panel is-moving" aria-live="polite">
        <PixelDie value={movementSteps} />
        <div className="pixel-movement-copy">
          <small>TRÆK LÅST</small>
          <b>BEVÆGER {movementSteps} FELTER</b>
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
          <b>SKÆBNEN RULLER</b>
          <span>{copy.detail}</span>
        </div>
      </section>
    );
  }

  if (phase.t === 'idle') {
    return (
      <section className="pixel-action-panel is-idle">
        <div className="pixel-last-event"><small>SENESTE</small><span>{state.log.at(-1)?.text}</span></div>
        <button aria-label="Rul en sekssidet terning" className="pixel-roll-button" onClick={() => dispatch({ type: 'ROLL' })} type="button">
          <RollAltar fx={{ stage: 'idle', value: state.rolls % 6 + 1 }} />
          <span className="pixel-roll-button-copy"><small>NÆSTE TRÆK</small><b>RUL TERNINGEN</b><em>{state.twinRollArmed ? 'SKÆBNETERNING AKTIV: RUL TO, VÆLG ÉN' : 'KLIK FOR AT KASTE'}</em></span>
        </button>
        {hero.consumables.length > 0 ? (
          <div className="pixel-consumable-row" aria-label="Brug consumable">
            {hero.consumables.map((id, slot) => {
              const preCombat = isPreCombatConsumable(id);
              return (
                <button
                  className="pixel-consumable-use"
                  disabled={preCombat}
                  key={`${id}-${slot}`}
                  onClick={() => dispatch({ type: 'USE_CONSUMABLE', slot })}
                  title={consumableEffectText(id)}
                  type="button"
                >
                  <ConsumableGlyph id={id} />
                  <span><b>{CONSUMABLES[id].name.toUpperCase()}</b><small>{preCombat ? 'BRUGES FØR KAMP' : consumableEffectText(id)}</small></span>
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="pixel-roll-rule"><small>1 × D6</small><b>RUL · VURDÉR · MANIPULÉR</b></div>
      </section>
    );
  }

  if (phase.t === 'chooseRoll') {
    return (
      <section className="pixel-action-panel is-rolled">
        <div className="pixel-roll-result"><span>SKÆBNETERNINGEN · <b>VÆLG ÉN</b></span></div>
        <div className="pixel-destinations">
          {phase.rolls.map((roll, index) => {
            const info = describeDest(state, roll);
            const meta = PIXEL_TILE_META[info.type];
            return (
              <button className="pixel-destination" key={index} onClick={() => dispatch({ type: 'CHOOSE_ROLL', index: index as 0 | 1 })} style={{ '--card-accent': meta.color } as CSSProperties} type="button">
                <small>TERNING {index + 1}</small>
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
        <div className="pixel-roll-result"><span>TELEPORT-RULLEN · <b>VÆLG DESTINATION</b></span></div>
        <div className="pixel-destinations pixel-teleport-grid">
          {[1, 2, 3, 4, 5, 6].map(steps => {
            const info = describeDest(state, steps);
            const meta = PIXEL_TILE_META[info.type];
            return (
              <button className="pixel-destination" key={steps} onClick={() => dispatch({ type: 'TELEPORT_MOVE', steps })} style={{ '--card-accent': meta.color } as CSSProperties} type="button">
                <small>FLYT {steps}</small>
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
      ? 'INGEN NUDGES TILBAGE'
      : phase.wasReroll
        ? 'REROLL ER ENDELIGT'
        : undefined;
    const candidates = [
      {
        action: { type: 'NUDGE', dir: -1 } as Action,
        disabled: phase.roll <= 1 || nudgeCount <= 0 || phase.wasReroll,
        disabledReason: phase.roll <= 1 ? 'TERNINGEN KAN IKKE GÅ UNDER 1' : noNudgeReason,
        primary: false,
        steps: phase.roll - 1,
        tag: bootsPay ? 'NUDGE −1 · BOOTS GRATIS' : 'NUDGE −1',
      },
      { action: { type: 'ACCEPT' } as Action, disabled: false, primary: true, steps: phase.roll, tag: `ACCEPTER ${phase.roll}` },
      {
        action: { type: 'NUDGE', dir: 1 } as Action,
        disabled: phase.roll >= 6 || nudgeCount <= 0 || phase.wasReroll,
        disabledReason: phase.roll >= 6 ? 'TERNINGEN KAN IKKE GÅ OVER 6' : noNudgeReason,
        primary: false,
        steps: phase.roll + 1,
        tag: bootsPay ? 'NUDGE +1 · BOOTS GRATIS' : 'NUDGE +1',
      },
    ];

    return (
      <section className="pixel-action-panel is-rolled">
        <div className="pixel-roll-result"><PixelDie value={phase.roll} /><span>DU SLOG <b>{phase.roll}</b></span></div>
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
        <button
          className="pixel-secondary-button"
          disabled={hero.rerolls <= 0 || phase.wasReroll}
          onClick={() => dispatch({ type: 'REROLL' })}
          type="button"
        >
          ↻ REROLL ({hero.rerolls}) — DET NYE RESULTAT ER ENDELIGT
        </button>
      </section>
    );
  }

  // Alle øvrige faser renderes som fullscreen-scener af PixelGame.
  return null;
}
