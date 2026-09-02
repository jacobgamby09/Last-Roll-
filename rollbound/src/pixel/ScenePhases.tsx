// Fase-indhold til fullscreen-scenerne (levelup, treasure, equipment, shop,
// game over). Flyttet fra PixelActionPanel; genbruges også indlejret i
// combat-scenens payout, så al loot-interaktion har ét udtryk.

import { CONFIG } from '../core/config';
import { EQUIPMENT_DEFS, equippedIdForKind, equipmentEffectText } from '../core/equipment';
import { PICK_LABEL } from '../core/engine';
import type { Action } from '../core/engine';
import type { GameState, LevelPick } from '../core/types';
import { EquipmentIcon } from './EquipmentIcon';
import { equipmentAssetIdForTreasure, type EquipmentAssetId } from './equipmentAssets';
import { ResourceIcon } from './ResourceIcon';
import { resourceAssetIdForTreasure, type ResourceAssetId } from './resourceAssets';

interface PhaseProps {
  state: GameState;
  dispatch: (a: Action) => void;
}

const LEVEL_PICKS: LevelPick[] = ['dmg', 'hp', 'armor'];

export function LevelUpChoice({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'levelup') return null;
  return (
    <div className="pixel-phase-block">
      <div className="pixel-panel-title">LEVEL {state.hero.level} · VÆLG OPGRADERING</div>
      <div className="pixel-choice-grid">
        {LEVEL_PICKS.map(pick => (
          <button key={pick} onClick={() => dispatch({ type: 'PICK_LEVELUP', pick })} type="button">{PICK_LABEL[pick]}</button>
        ))}
      </div>
    </div>
  );
}

export function TreasureChoice({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'treasure') return null;
  const { options } = state.phase;
  return (
    <div className="pixel-phase-block">
      <div className="pixel-panel-title">SKAT · VÆLG 1 AF {options.length}</div>
      <div className="pixel-choice-grid">
        {options.map((option, index) => {
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
    </div>
  );
}

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

export function EquipmentOffer({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'equipment') return null;
  const { hero, phase } = state;
  const offered = EQUIPMENT_DEFS[phase.itemId];
  const currentId = equippedIdForKind(hero, offered.kind) as EquipmentAssetId;
  const equipLabel = phase.cost > 0 ? `KØB & UDSTYR · ${phase.cost} G` : 'UDSTYR';
  const keepLabel = phase.source === 'shop' ? 'BEHOLD NUVÆRENDE · TILBAGE TIL SHOP' : 'BEHOLD NUVÆRENDE';

  return (
    <div className="pixel-phase-block pixel-equipment-offer">
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
          <EquipmentIcon assetId={phase.itemId as EquipmentAssetId} size="card" />
          <b>{offered.name}</b>
          <span>{equipmentEffectText(phase.itemId)}</span>
        </article>
      </div>
      <strong className="pixel-equipment-delta">{equipmentDeltaLabel(state, phase.itemId as EquipmentAssetId)}</strong>
      <div className="pixel-equipment-offer-actions">
        <button className="pixel-equip-button" disabled={hero.gold < phase.cost} onClick={() => dispatch({ type: 'EQUIP_OFFER' })} type="button">{equipLabel}</button>
        <button className="pixel-secondary-button" onClick={() => dispatch({ type: 'KEEP_EQUIPMENT' })} type="button">{keepLabel}</button>
      </div>
    </div>
  );
}

function goldStatus(gold: number, cost: number): string | undefined {
  return gold < cost ? `MANGLER ${cost - gold} GULD` : undefined;
}

export function ShopPanel({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'shop') return null;
  const { hero, phase } = state;
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
    <div className="pixel-phase-block shop-panel">
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
    </div>
  );
}

export function OverPanel({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'over') return null;
  const { phase, hero } = state;
  return (
    <div className={`pixel-phase-block pixel-game-over ${phase.won ? 'won' : 'lost'}`}>
      <div><small>{phase.won ? 'RUN GENNEMFØRT' : 'RUN SLUT'}</small><b>{phase.won ? 'SEJR' : 'DU FALDT'}</b><span>{phase.cause}</span></div>
      <span className="pixel-over-stats">{state.rolls} RULL · {state.fights} KAMPE · LEVEL {hero.level} · SEED {state.seed}</span>
      <button className="pixel-roll-button" onClick={() => dispatch({ type: 'RESTART' })} type="button">NYT RUN</button>
    </div>
  );
}
