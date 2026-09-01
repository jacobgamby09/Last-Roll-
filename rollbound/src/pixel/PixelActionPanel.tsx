import type { CSSProperties } from 'react';
import { CONFIG } from '../core/config';
import { availableNudges, EQUIPMENT_DEFS, equippedIdForKind, equipmentEffectText } from '../core/equipment';
import { PICK_LABEL } from '../core/engine';
import type { Action } from '../core/engine';
import type { GameState, LevelPick } from '../core/types';
import { describeDest } from '../ui/preview';
import { PixelDie, type DiceRollFx } from './PixelDie';
import { EquipmentIcon } from './EquipmentIcon';
import { equipmentAssetIdForTreasure, type EquipmentAssetId } from './equipmentAssets';
import { PIXEL_TILE_META } from './pixelMeta';
import { PixelTileArt } from './PixelTileArt';
import { ResourceIcon } from './ResourceIcon';
import { resourceAssetIdForTreasure, type ResourceAssetId } from './resourceAssets';

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
      className={`pixel-destination ${primary ? 'primary' : ''} ${info?.deadly ? 'deadly' : ''}`}
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

const LEVEL_PICKS: LevelPick[] = ['dmg', 'hp', 'armor'];

function equipmentDeltaLabel(state: GameState, itemId: EquipmentAssetId): string {
  const offered = EQUIPMENT_DEFS[itemId];
  const currentId = equippedIdForKind(state.hero, offered.kind) as EquipmentAssetId;
  const current = EQUIPMENT_DEFS[currentId];
  if (offered.kind === 'weapon') {
    const next = state.hero.dmg + offered.effect.dmg - current.effect.dmg;
    return `DMG ${state.hero.dmg} → ${next}`;
  }
  if (offered.kind === 'armor') {
    const next = state.hero.armor + offered.effect.armor - current.effect.armor;
    return `ARM ${state.hero.armor} → ${next}`;
  }
  return `GRATIS NUDGE ${state.hero.bootsNudgeCharges} → ${offered.effect.freeNudges}`;
}

function goldStatus(gold: number, cost: number): string | undefined {
  return gold < cost ? `MANGLER ${cost - gold} GULD` : undefined;
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
          <span className="pixel-roll-button-copy"><small>NÆSTE TRÆK</small><b>RUL TERNINGEN</b><em>KLIK FOR AT KASTE</em></span>
        </button>
        <div className="pixel-roll-rule"><small>1 × D6</small><b>RUL · VURDÉR · MANIPULÉR</b></div>
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

  if (phase.t === 'levelup') {
    return (
      <section className="pixel-action-panel pixel-modal-panel">
        <div className="pixel-panel-title">LEVEL {hero.level} · VÆLG OPGRADERING</div>
        <div className="pixel-choice-grid">
          {LEVEL_PICKS.map(pick => (
            <button key={pick} onClick={() => dispatch({ type: 'PICK_LEVELUP', pick })} type="button">{PICK_LABEL[pick]}</button>
          ))}
        </div>
      </section>
    );
  }

  if (phase.t === 'treasure') {
    return (
      <section className="pixel-action-panel pixel-modal-panel">
        <div className="pixel-panel-title">SKAT · VÆLG 1 AF {phase.options.length}</div>
        <div className="pixel-choice-grid">
          {phase.options.map((option, index) => {
            const equipmentAssetId = option.equipmentId ?? equipmentAssetIdForTreasure(option.key);
            const resourceAssetId = resourceAssetIdForTreasure(option.key);
            return (
              <button className="pixel-item-choice" key={`${option.key}-${index}`} onClick={() => dispatch({ type: 'PICK_TREASURE', index })} type="button">
                {equipmentAssetId
                  ? <EquipmentIcon assetId={equipmentAssetId} />
                  : resourceAssetId
                    ? <ResourceIcon assetId={resourceAssetId} />
                    : null}
                <span className="pixel-item-copy"><b>{option.name}</b><span>{option.desc}</span></span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (phase.t === 'equipment') {
    const offered = EQUIPMENT_DEFS[phase.itemId];
    const currentId = equippedIdForKind(hero, offered.kind) as EquipmentAssetId;
    const sourceLabel = phase.source === 'shop' ? 'SHOP' : phase.source === 'drop' ? 'DROP' : 'SKAT';
    const equipLabel = phase.cost > 0 ? `KØB & UDSTYR · ${phase.cost} G` : 'UDSTYR';
    const keepLabel = phase.source === 'shop' ? 'BEHOLD NUVÆRENDE · TILBAGE TIL SHOP' : 'BEHOLD NUVÆRENDE';

    return (
      <section className="pixel-action-panel pixel-modal-panel pixel-equipment-offer">
        <div className="pixel-panel-title">NYT UDSTYR · {sourceLabel}</div>
        <div className="pixel-equipment-compare" aria-label="Sammenlign nuværende og nyt udstyr">
          <article>
            <small>NUVÆRENDE</small>
            <EquipmentIcon assetId={currentId} size="card" />
            <b>{EQUIPMENT_DEFS[currentId].name}</b>
            <span>{equipmentEffectText(currentId)}</span>
          </article>
          <i aria-hidden="true">→</i>
          <article className="is-new">
            <small>NYT</small>
            <EquipmentIcon assetId={phase.itemId} size="card" />
            <b>{offered.name}</b>
            <span>{equipmentEffectText(phase.itemId)}</span>
          </article>
        </div>
        <strong className="pixel-equipment-delta">{equipmentDeltaLabel(state, phase.itemId)}</strong>
        <div className="pixel-equipment-offer-actions">
          <button className="pixel-equip-button" disabled={hero.gold < phase.cost} onClick={() => dispatch({ type: 'EQUIP_OFFER' })} type="button">{equipLabel}</button>
          <button className="pixel-secondary-button" onClick={() => dispatch({ type: 'KEEP_EQUIPMENT' })} type="button">{keepLabel}</button>
        </div>
      </section>
    );
  }

  if (phase.t === 'shop') {
    const shop = CONFIG.shop;
    const weaponStatus = phase.boughtWeapon ? 'KØBT' : hero.loadout.weapon === 'rusted-sword' ? 'ALLEREDE UDSTYRET' : goldStatus(hero.gold, shop.weapon.cost);
    const armorStatus = phase.boughtArmor ? 'KØBT' : hero.loadout.armor === 'worn-plate' ? 'ALLEREDE UDSTYRET' : goldStatus(hero.gold, shop.armorItem.cost);
    const bootsStatus = phase.boughtBoots ? 'KØBT' : hero.loadout.boots === 'trail-boots' ? 'ALLEREDE UDSTYRET' : goldStatus(hero.gold, shop.boots.cost);
    const rows: { action: Action; assetId?: EquipmentAssetId; cost: number; effect: string; name: string; resourceId?: ResourceAssetId; status?: string }[] = [
      { action: { type: 'BUY', item: 'weapon' }, assetId: 'rusted-sword', cost: shop.weapon.cost, effect: equipmentEffectText('rusted-sword'), name: 'SLEBET KLINGE', status: weaponStatus },
      { action: { type: 'BUY', item: 'armor' }, assetId: 'worn-plate', cost: shop.armorItem.cost, effect: equipmentEffectText('worn-plate'), name: 'JERNPLADE', status: armorStatus },
      { action: { type: 'BUY', item: 'boots' }, assetId: 'trail-boots', cost: shop.boots.cost, effect: equipmentEffectText('trail-boots'), name: 'STIVINDERSTØVLER', status: bootsStatus },
      { action: { type: 'BUY', item: 'heal' }, cost: shop.heal.cost, effect: `+${shop.heal.hp} HP`, name: 'LÆGEURT', resourceId: 'life', status: hero.hp >= hero.maxHp ? 'FULD HP' : goldStatus(hero.gold, shop.heal.cost) },
      { action: { type: 'BUY', item: 'nudge' }, cost: shop.nudge, effect: '+1 NUDGE', name: 'NUDGE', resourceId: 'nudge', status: goldStatus(hero.gold, shop.nudge) },
      { action: { type: 'BUY', item: 'reroll' }, cost: shop.reroll, effect: '+1 REROLL', name: 'SKÆBNETERNING', resourceId: 'reroll', status: goldStatus(hero.gold, shop.reroll) },
    ];
    return (
      <section className="pixel-action-panel pixel-modal-panel shop-panel">
        <div className="pixel-panel-title">SHOP · {hero.gold} GULD</div>
        <div className="pixel-shop-grid">
          {rows.map(row => (
            <button aria-label={`${row.name}, ${row.effect}, ${row.cost} guld${row.status ? `, ${row.status}` : ''}`} className="pixel-shop-item" disabled={Boolean(row.status)} key={row.name} onClick={() => dispatch(row.action)} type="button">
              {row.assetId
                ? <EquipmentIcon assetId={row.assetId} />
                : row.resourceId
                  ? <ResourceIcon assetId={row.resourceId} />
                  : null}
              <span className="pixel-item-copy"><small>{row.name}</small><span>{row.effect}</span>{row.status ? <em>{row.status}</em> : null}</span>
              <b>{row.cost} G</b>
            </button>
          ))}
        </div>
        <button className="pixel-secondary-button" onClick={() => dispatch({ type: 'LEAVE_SHOP' })} type="button">FORLAD SHOPPEN →</button>
      </section>
    );
  }

  if (phase.t !== 'over') return null;

  return (
    <section className={`pixel-action-panel pixel-game-over ${phase.won ? 'won' : 'lost'}`}>
      <div><small>{phase.won ? 'RUN GENNEMFØRT' : 'RUN SLUT'}</small><b>{phase.won ? 'SEJR' : 'DU FALDT'}</b><span>{phase.cause}</span></div>
      <button className="pixel-roll-button" onClick={() => dispatch({ type: 'RESTART' })} type="button">NYT RUN</button>
    </section>
  );
}
