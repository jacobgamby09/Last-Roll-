// Fullscreen-kampscene: afspiller state.lastCombat 1:1 som duel.
// Reduceren har ALLEREDE afgjort kampen — scenen gen-beregner intet.
// Beats: intro → udveksling (accelererende) → outcome → payout i scenen.
// Ét klik/space springer til payout; reduced-motion starter direkte dér.

import { useEffect, useMemo, useState } from 'react';
import { CONFIG } from '../core/config';
import { PICK_LABEL, rotationPick } from '../core/engine';
import type { Action } from '../core/engine';
import type { CombatScript, GameState, Hero } from '../core/types';
import { combatSpriteFor } from './combatSpriteAssets';
import { HERO_FRAMES } from './heroAssets';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';
import { COMBAT_TIMING as T } from './presentation';
import { ResourceIcon } from './ResourceIcon';
import { SceneShell } from './SceneShell';
import { EquipmentOffer, LevelUpChoice, OverPanel } from './ScenePhases';

export interface CombatView {
  script: CombatScript;
  heroBefore: Hero;
  pos: number;
  seq: number;
}

interface Props {
  dispatch: (a: Action) => void;
  onClose: () => void;
  state: GameState;
  view: CombatView;
}

function EnemyArt({ view }: { view: CombatView }) {
  const { src, fallbackTile } = combatSpriteFor(view.script.enemy);
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img alt="" className="combat-sprite" draggable={false} onError={() => setFailed(true)} src={src} />;
  }
  // Eksplicit fallback indtil combat-sprite-batchen lander (se combat-sprite-contract-v1.md)
  return (
    <span className="combat-sprite combat-sprite-fallback" aria-hidden="true">
      <PixelTileArt type={fallbackTile} variant={0} />
    </span>
  );
}

function HpPlate({ current, max, name, side, statline }: { current: number; max: number; name: string; side: 'hero' | 'enemy'; statline: string }) {
  const width = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className={`combat-plate combat-plate-${side}`}>
      <small>{name}</small>
      <span className="combat-hpbar" role="progressbar" aria-label={`${name} HP`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={current}>
        <i style={{ width: `${width}%` }} />
      </span>
      <b>{current} / {max}</b>
      <span className="combat-statline">{statline}</span>
    </div>
  );
}

export function CombatScene({ dispatch, onClose, state, view }: Props) {
  const { script, heroBefore } = view;
  const events = script.events;
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [cursor, setCursor] = useState(reduced ? events.length - 1 : -1); // -1 = intro
  const [stage, setStage] = useState<'play' | 'payout'>(reduced ? 'payout' : 'play');
  const isBoss = script.enemy.name === CONFIG.boss.name;
  const won = script.result.winner === 'hero';
  const { fallbackTile } = combatSpriteFor(script.enemy);
  const accent = PIXEL_TILE_META[fallbackTile].color;

  // Playback-uret: intro → events (accelererende) → outcome-pause → payout
  useEffect(() => {
    if (stage !== 'play') return;
    const isLastShown = cursor >= events.length - 1;
    const delay = cursor < 0
      ? (isBoss ? T.introBoss : T.intro)
      : isLastShown
        ? T.outcome
        : Math.max(T.eventMin, T.eventBase * Math.pow(T.eventDecay, cursor));
    const timer = window.setTimeout(() => {
      if (isLastShown) setStage('payout');
      else setCursor(c => c + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [cursor, stage, isBoss, events.length]);

  const skip = () => {
    if (stage !== 'play') return;
    setCursor(events.length - 1);
    setStage('payout');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (stage === 'play') {
          e.preventDefault();
          skip();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Aflæs HP-forløbet af scriptet op til cursor — ingen regel-beregning
  const shown = stage === 'payout' ? events.length - 1 : cursor;
  const { enemyHp, heroHp, lastEvent } = useMemo(() => {
    let hHp = heroBefore.hp;
    let eHp = script.enemy.hp;
    let last = null;
    for (let i = 0; i <= shown && i < events.length; i++) {
      const e = events[i];
      if (e.actor === 'hero') eHp = e.targetHpAfter;
      else hHp = e.targetHpAfter;
      last = e;
    }
    return { enemyHp: eHp, heroHp: hHp, lastEvent: last };
  }, [shown, events, heroBefore.hp, script.enemy.hp]);

  const ticker = stage === 'payout'
    ? (won ? `${script.enemy.name} falder!` : `${script.enemy.name} fælder dig.`)
    : lastEvent
      ? `TUR ${lastEvent.turn} · ${lastEvent.actor === 'hero' ? `Du rammer ${script.enemy.name} for ${lastEvent.damage}` : `${script.enemy.name} rammer dig for ${lastEvent.damage}`}`
      : isBoss ? 'Den endelige prøve …' : 'Kampen begynder …';

  // Payout-data: deltas fra reducer-state, ingen gen-beregning
  const goldDelta = state.hero.gold - heroBefore.gold;
  const nudgeDelta = state.hero.nudges - heroBefore.nudges;
  const maxHpDelta = state.hero.maxHp - heroBefore.maxHp;
  const levelsGained: number[] = [];
  for (let l = heroBefore.level + 1; l <= state.hero.level; l++) levelsGained.push(l);

  return (
    <SceneShell
      accent={accent}
      className={`pixel-combat-scene is-${stage} ${isBoss ? 'is-boss' : ''} ${cursor < 0 && stage === 'play' ? 'is-intro' : ''}`}
      onSceneClick={skip}
      subtitle={`FELT ${view.pos}`}
      title={script.enemy.name.toUpperCase()}
    >
      <div className="combat-duel" aria-live="polite">
        <div className={`combat-side combat-side-hero ${stage === 'play' && lastEvent?.actor === 'hero' ? 'is-attacking' : ''} ${stage === 'play' && lastEvent?.actor === 'enemy' ? 'is-hit' : ''} ${!won && stage === 'payout' ? 'is-fallen' : ''}`}>
          <HpPlate
            current={heroHp}
            max={heroBefore.maxHp}
            name={`DIG · LV ${heroBefore.level}`}
            side="hero"
            statline={`DMG ${heroBefore.dmgMin}-${heroBefore.dmgMax} · ARM ${heroBefore.armor}`}
          />
          <span className="combat-sprite combat-sprite-hero">
            <img alt="" className="combat-hero-a" draggable={false} src={HERO_FRAMES.idleA} />
            <img alt="" className="combat-hero-b" draggable={false} src={HERO_FRAMES.idleB} />
          </span>
          {stage === 'play' && lastEvent?.actor === 'enemy' ? (
            <span className="combat-float" key={shown} style={{ fontSize: `${Math.min(44, 22 + lastEvent.damage * 1.5)}px` }}>−{lastEvent.damage}</span>
          ) : null}
        </div>
        <span className="combat-clash" aria-hidden="true">⚔</span>
        <div className={`combat-side combat-side-enemy ${stage === 'play' && lastEvent?.actor === 'enemy' ? 'is-attacking' : ''} ${stage === 'play' && lastEvent?.actor === 'hero' ? 'is-hit' : ''} ${won && stage === 'payout' ? 'is-fallen' : ''}`}>
          <HpPlate
            current={enemyHp}
            max={script.enemy.hp}
            name={script.enemy.name.toUpperCase()}
            side="enemy"
            statline={`DMG ${script.enemy.dmgMin}-${script.enemy.dmgMax} · ARM ${script.enemy.armor}`}
          />
          <EnemyArt view={view} />
          {stage === 'play' && lastEvent?.actor === 'hero' ? (
            <span className="combat-float" key={shown} style={{ fontSize: `${Math.min(44, 22 + lastEvent.damage * 1.5)}px` }}>−{lastEvent.damage}</span>
          ) : null}
        </div>
      </div>
      <div className="combat-ticker">{ticker}</div>
      {stage === 'play' ? <div className="combat-skip-hint">KLIK ELLER SPACE FOR AT SPRINGE TIL RESULTAT</div> : null}

      {stage === 'payout' ? (
        <div className={`combat-payout ${won ? 'won' : 'lost'}`} onClick={e => e.stopPropagation()}>
          <b className="combat-payout-title">{won ? 'SEJR' : 'DU FALDT'}</b>
          {won ? (
            <div className="combat-payout-rows">
              {script.enemy.xp > 0 ? <span><ResourceIcon assetId="xp" size="mini" /> +{script.enemy.xp} XP</span> : null}
              {goldDelta > 0 ? <span><ResourceIcon assetId="gold" size="mini" /> +{goldDelta} GULD</span> : null}
              {nudgeDelta > 0 ? <span><ResourceIcon assetId="nudge" size="mini" /> +{nudgeDelta} NUDGE (DROP)</span> : null}
              {maxHpDelta > 0 && levelsGained.length === 0 ? <span><ResourceIcon assetId="life" size="mini" /> +{maxHpDelta} MAX HP (DROP)</span> : null}
            </div>
          ) : null}
          {won && CONFIG.levelUpMode === 'rotation' && levelsGained.length > 0 ? (
            <div className="combat-levelups">
              {levelsGained.map(l => <span key={l}>LEVEL {l}! {PICK_LABEL[rotationPick(l)]}</span>)}
            </div>
          ) : null}

          {state.phase.t === 'equipment' ? <EquipmentOffer dispatch={dispatch} state={state} /> : null}
          {state.phase.t === 'levelup' ? <LevelUpChoice dispatch={dispatch} state={state} /> : null}
          {state.phase.t === 'over' ? <OverPanel dispatch={dispatch} state={state} /> : null}
          {state.phase.t === 'idle' ? (
            <button autoFocus className="pixel-roll-button combat-continue" onClick={onClose} type="button">VIDERE →</button>
          ) : null}
        </div>
      ) : null}
    </SceneShell>
  );
}
