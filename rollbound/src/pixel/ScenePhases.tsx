// Fase-indhold til fullscreen-scenerne (levelup, treasure, equipment, shop,
// game over). Flyttet fra PixelActionPanel; genbruges også indlejret i
// combat-scenens payout, så al loot-interaktion har ét udtryk.

import { CONFIG } from '../core/config';
import { enemyForTile } from '../core/combat';
import { EQUIPMENT_DEFS, equippedIdForKind, equipmentEffectText } from '../core/equipment';
import { CONSUMABLES, consumableEffectText, isPreCombatConsumable, ITEMS, itemStats } from '../core/items';
import { PICK_LABEL } from '../core/engine';
import type { Action } from '../core/engine';
import type { GameState, LevelPick } from '../core/types';
import { approxEnemyStats } from '../ui/preview';
import { combatSpriteFor } from './combatSpriteAssets';
import { ConsumableIcon } from './ConsumableIcon';
import { EquipmentIcon } from './EquipmentIcon';
import { equipmentAssetIdForTreasure, type EquipmentAssetId } from './equipmentAssets';
import { PixelTileArt } from './PixelTileArt';
import { ResourceIcon } from './ResourceIcon';
import { resourceAssetIdForTreasure, type ResourceAssetId } from './resourceAssets';

// Preserve the existing public fallback without a ScenePhases ↔ icon cycle.
export { ConsumableGlyph } from './ConsumableGlyph';

interface PhaseProps {
  state: GameState;
  dispatch: (a: Action) => void;
}

const LEVEL_PICKS: LevelPick[] = ['dmg', 'hp', 'armor'];

export function LevelUpChoice({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'levelup') return null;
  return (
    <div className="pixel-phase-block">
      <div className="pixel-panel-title">LEVEL {state.hero.level} · CHOOSE UPGRADE</div>
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
      <div className="pixel-panel-title">TREASURE · CHOOSE 1 OF {options.length}</div>
      <div className="pixel-choice-grid">
        {options.map((option, index) => {
          const equipmentAssetId = option.equipmentId ?? equipmentAssetIdForTreasure(option.key);
          const resourceAssetId = resourceAssetIdForTreasure(option.key);
          return (
            <button className="pixel-item-choice" key={`${option.key}-${index}`} onClick={() => dispatch({ type: 'PICK_TREASURE', index })} type="button">
              {option.consumableId
                ? <ConsumableIcon assetId={option.consumableId} />
                : equipmentAssetId
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
  const currentId = equippedIdForKind(state.hero, offered.slot) as EquipmentAssetId;
  const o = itemStats(offered);
  const c = itemStats(EQUIPMENT_DEFS[currentId]);
  const hero = state.hero;
  const buffs = hero.slotBuffs[offered.slot]; // item-buffs mistes ved udskiftning
  const parts: string[] = [];
  const dDmgMin = o.dmgMin - c.dmgMin - buffs.dmg;
  const dDmgMax = o.dmgMax - c.dmgMax - buffs.dmg;
  if (dDmgMin !== 0 || dDmgMax !== 0) {
    parts.push(`DMG ${hero.dmgMin}-${hero.dmgMax} → ${hero.dmgMin + dDmgMin}-${hero.dmgMax + dDmgMax}`);
  }
  const dArmor = o.armor - c.armor - buffs.armor;
  if (dArmor !== 0) parts.push(`ARM ${hero.armor} → ${hero.armor + dArmor}`);
  const dMaxHp = o.maxHp - c.maxHp - buffs.maxHp;
  if (dMaxHp !== 0) parts.push(`MAX HP ${hero.maxHp} → ${hero.maxHp + dMaxHp}`);
  if (o.bootsCharges !== c.bootsCharges || offered.slot === 'boots') {
    parts.push(`FREE NUDGE ${hero.bootsNudgeCharges} → ${o.bootsCharges}`);
  }
  return parts.length > 0 ? parts.join(' · ') : 'SAME STATS — NEW EFFECT';
}

// Advarsel når det udstyrede item bærer buffs, der mistes ved udskiftning
function buffLossLabel(state: GameState, itemId: EquipmentAssetId): string | null {
  const buffs = state.hero.slotBuffs[EQUIPMENT_DEFS[itemId].slot];
  const parts: string[] = [];
  if (buffs.dmg) parts.push(`+${buffs.dmg} DMG`);
  if (buffs.armor) parts.push(`+${buffs.armor} ARM`);
  if (buffs.maxHp) parts.push(`+${buffs.maxHp} max HP`);
  return parts.length > 0 ? `You lose improvements: ${parts.join(' & ')}` : null;
}

export function EquipmentOffer({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'equipment') return null;
  const { hero, phase } = state;
  const offered = EQUIPMENT_DEFS[phase.itemId];
  const currentId = equippedIdForKind(hero, offered.slot) as EquipmentAssetId;
  const equipLabel = phase.cost > 0 ? `BUY & EQUIP · ${phase.cost} G` : 'EQUIP';
  const keepLabel = phase.source === 'shop' ? 'KEEP CURRENT · BACK TO SHOP' : 'KEEP CURRENT';

  return (
    <div className="pixel-phase-block pixel-equipment-offer">
      <div className="pixel-equipment-compare" aria-label="Compare current and new gear">
        <article>
          <small>CURRENT</small>
          <EquipmentIcon assetId={currentId} size="card" />
          <b>{EQUIPMENT_DEFS[currentId].name}</b>
          <span>{equipmentEffectText(currentId)}</span>
        </article>
        <i aria-hidden="true">→</i>
        <article className="is-new">
          <small>NEW</small>
          <EquipmentIcon assetId={phase.itemId as EquipmentAssetId} size="card" />
          <b>{offered.name}</b>
          <span>{equipmentEffectText(phase.itemId)}</span>
        </article>
      </div>
      <strong className="pixel-equipment-delta">{equipmentDeltaLabel(state, phase.itemId as EquipmentAssetId)}</strong>
      {buffLossLabel(state, phase.itemId as EquipmentAssetId)
        ? <strong className="pixel-buff-loss">⚠ {buffLossLabel(state, phase.itemId as EquipmentAssetId)}</strong>
        : null}
      <div className="pixel-equipment-offer-actions">
        <button className="pixel-equip-button" disabled={hero.gold < phase.cost} onClick={() => dispatch({ type: 'EQUIP_OFFER' })} type="button">{equipLabel}</button>
        <button className="pixel-secondary-button" onClick={() => dispatch({ type: 'KEEP_EQUIPMENT' })} type="button">{keepLabel}</button>
      </div>
    </div>
  );
}

function goldStatus(gold: number, cost: number): string | undefined {
  return gold < cost ? `NEED ${cost - gold} MORE GOLD` : undefined;
}

const SERVICE_META: Record<string, { name: string; effect: (shop: typeof CONFIG.shop) => string; resourceId: ResourceAssetId }> = {
  heal: { name: 'HEALING HERB', effect: shop => `+${shop.heal.hp} HP`, resourceId: 'life' },
  nudge: { name: 'NUDGE', effect: () => '+1 NUDGE', resourceId: 'nudge' },
  reroll: { name: 'FATE DIE', effect: () => '+1 REROLL', resourceId: 'reroll' },
};

export function ShopPanel({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'shop') return null;
  const { hero, phase } = state;
  return (
    <div className="pixel-phase-block shop-panel">
      <div className="pixel-panel-title">SHOP · {hero.gold} GOLD</div>
      <div className="pixel-shop-grid">
        {phase.offers.map((offer, index) => {
          if (offer.kind === 'gear') {
            const def = ITEMS[offer.itemId];
            const status = offer.sold ? 'SOLD' : goldStatus(hero.gold, offer.cost);
            return (
              <button aria-label={`${def.name}, ${equipmentEffectText(offer.itemId)}, ${offer.cost} gold${status ? `, ${status}` : ''}`} className="pixel-shop-item" disabled={Boolean(status)} key={index} onClick={() => dispatch({ type: 'BUY', index })} type="button">
                <EquipmentIcon assetId={offer.itemId as EquipmentAssetId} />
                <span className="pixel-item-copy"><small>{def.name}</small><span>{equipmentEffectText(offer.itemId)}</span>{status ? <em>{status}</em> : null}</span>
                <b>{offer.cost} G</b>
              </button>
            );
          }
          if (offer.kind === 'consumable') {
            const def = CONSUMABLES[offer.consumableId];
            const slotsFull = hero.consumables.length >= CONFIG.consumableSlots;
            const status = offer.sold ? 'SOLD' : slotsFull ? 'SLOTS FULL' : goldStatus(hero.gold, offer.cost);
            return (
              <button aria-label={`${def.name}, ${consumableEffectText(offer.consumableId)}, ${offer.cost} gold${status ? `, ${status}` : ''}`} className="pixel-shop-item" disabled={Boolean(status)} key={index} onClick={() => dispatch({ type: 'BUY', index })} type="button">
                <ConsumableIcon assetId={offer.consumableId} />
                <span className="pixel-item-copy"><small>{def.name}</small><span>{consumableEffectText(offer.consumableId)}</span>{status ? <em>{status}</em> : null}</span>
                <b>{offer.cost} G</b>
              </button>
            );
          }
          const meta = SERVICE_META[offer.service];
          const status = offer.sold
            ? 'SOLD'
            : offer.service === 'heal' && hero.hp >= hero.maxHp
              ? 'FULL HP'
              : goldStatus(hero.gold, offer.cost);
          return (
            <button aria-label={`${meta.name}, ${meta.effect(CONFIG.shop)}, ${offer.cost} gold${status ? `, ${status}` : ''}`} className="pixel-shop-item" disabled={Boolean(status)} key={index} onClick={() => dispatch({ type: 'BUY', index })} type="button">
              <ResourceIcon assetId={meta.resourceId} />
              <span className="pixel-item-copy"><small>{meta.name}</small><span>{meta.effect(CONFIG.shop)}</span>{status ? <em>{status}</em> : null}</span>
              <b>{offer.cost} G</b>
            </button>
          );
        })}
      </div>
      <button className="pixel-secondary-button" onClick={() => dispatch({ type: 'LEAVE_SHOP' })} type="button">LEAVE THE SHOP →</button>
    </div>
  );
}

// Pre-combat-beatet: brug bomber/røgbombe, før kampen ruller
export function PreCombatPanel({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'preCombat') return null;
  const { tile, openingDamage } = state.phase;
  const enemy = enemyForTile(state.pos, tile);
  const { src, fallbackTile } = combatSpriteFor(enemy);
  return (
    <div className="pixel-phase-block pixel-precombat">
      <div className="precombat-enemy">
        {src
          ? <img alt="" className="combat-sprite" draggable={false} src={src} />
          : <span className="combat-sprite combat-sprite-fallback"><PixelTileArt type={fallbackTile} variant={0} /></span>}
        <b>{enemy.name.toUpperCase()}</b>
        <span>{approxEnemyStats(enemy)}</span>
        {openingDamage > 0 ? <em className="precombat-armed">PRIMED: {openingDamage} OPENING DAMAGE</em> : null}
      </div>
      <div className="precombat-actions">
        {state.hero.consumables.map((id, slot) => {
          if (!isPreCombatConsumable(id)) return null;
          const def = CONSUMABLES[id];
          const bossBlocked = def.effect.kind === 'flee' && tile === 'boss';
          return (
            <button className="pixel-consumable-use" disabled={bossBlocked} key={`${id}-${slot}`} onClick={() => dispatch({ type: 'USE_CONSUMABLE', slot })} type="button">
              <ConsumableIcon assetId={id} />
              <span className="pixel-consumable-copy"><b>{def.name}</b><small>{consumableEffectText(id)}{bossBlocked ? ' (does not work on the boss)' : ''}</small></span>
            </button>
          );
        })}
        <button className="pixel-roll-button precombat-fight" onClick={() => dispatch({ type: 'FIGHT' })} type="button">⚔ FIGHT</button>
      </div>
    </div>
  );
}

export function OverPanel({ state, dispatch }: PhaseProps) {
  if (state.phase.t !== 'over') return null;
  const { phase, hero } = state;
  return (
    <div className={`pixel-phase-block pixel-game-over ${phase.won ? 'won' : 'lost'}`}>
      <div><small>{phase.won ? 'RUN COMPLETE' : 'RUN OVER'}</small><b>{phase.won ? 'VICTORY' : 'YOU FELL'}</b><span>{phase.cause}</span></div>
      <span className="pixel-over-stats">{state.rolls} ROLLS · {state.fights} FIGHTS · LEVEL {hero.level} · SEED {state.seed}</span>
      <button className="pixel-roll-button" onClick={() => dispatch({ type: 'RESTART' })} type="button">NEW RUN</button>
    </div>
  );
}
