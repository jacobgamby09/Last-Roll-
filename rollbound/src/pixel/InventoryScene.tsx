// Inventory-overlay (2026-09-02): fullscreen-scene hvor consumables
// inspiceres og bruges. Ren præsentation — ingen reducer-fase; BRUG
// dispatcher USE_CONSUMABLE (kræver idle). Bomber/Røgbombe vises, men
// bruges i pre-combat-beatet. itemBuff-kort viser mål-item og før→efter.

import { CONFIG } from '../core/config';
import { CONSUMABLES, consumableEffectText, isPreCombatConsumable, ITEMS } from '../core/items';
import type { Action } from '../core/engine';
import type { ConsumableId, GameState } from '../core/types';
import { ConsumableIcon } from './ConsumableIcon';
import { SceneShell } from './SceneShell';

interface Props {
  dispatch: (a: Action) => void;
  onClose: () => void;
  state: GameState;
}

// Kontekst-preview: hvad sker der KONKRET, hvis du bruger den nu?
function previewFor(state: GameState, id: ConsumableId): string | null {
  const hero = state.hero;
  const e = CONSUMABLES[id].effect;
  switch (e.kind) {
    case 'heal':
      return `HP ${hero.hp} → ${Math.min(hero.maxHp, hero.hp + e.amount)} / ${hero.maxHp}`;
    case 'itemBuff': {
      const target = ITEMS[hero.loadout[e.slot]].name;
      const parts: string[] = [];
      if (e.dmg) parts.push(`DMG ${hero.dmgMin}-${hero.dmgMax} → ${hero.dmgMin + e.dmg}-${hero.dmgMax + e.dmg}`);
      if (e.armor) parts.push(`ARM ${hero.armor} → ${hero.armor + e.armor}`);
      if (e.maxHp) parts.push(`Max HP ${hero.maxHp} → ${hero.maxHp + e.maxHp}`);
      return `${target}: ${parts.join(' · ')}`;
    }
    case 'grant':
      return `Nudge ${hero.nudges} → ${hero.nudges + e.nudges} · Reroll ${hero.rerolls} → ${hero.rerolls + e.rerolls}`;
    case 'gold':
      return `Gold ${hero.gold} → ${hero.gold + e.amount}`;
    default:
      return null;
  }
}

export function InventoryScene({ dispatch, onClose, state }: Props) {
  const hero = state.hero;
  const canUse = state.phase.t === 'idle';

  return (
    <SceneShell accent="#25d9ff" className="pixel-inventory-scene" subtitle={`ITEMS ${hero.consumables.length}/${CONFIG.consumableSlots}`} title="INVENTORY">
      <div className="pixel-phase-block pixel-inventory">
        {hero.consumables.length === 0 ? (
          <div className="pixel-inventory-empty">No items — find them in shops, treasures and drops.</div>
        ) : (
          <div className="pixel-inventory-grid">
            {hero.consumables.map((id, slot) => {
              const def = CONSUMABLES[id];
              const preCombat = isPreCombatConsumable(id);
              const preview = previewFor(state, id);
              const disabledReason = preCombat
                ? 'Used in the prepare-yourself beat before a fight'
                : !canUse
                  ? 'Can only be used between moves'
                  : null;
              return (
                <article className="pixel-inventory-card" key={`${id}-${slot}`}>
                  <ConsumableIcon assetId={id} decorative={false} size="card" />
                  <b>{def.name}</b>
                  <span className="pixel-inventory-effect">{consumableEffectText(id)}</span>
                  {preview ? <span className="pixel-inventory-preview">{preview}</span> : null}
                  <button
                    className="pixel-equip-button"
                    disabled={disabledReason !== null}
                    onClick={() => dispatch({ type: 'USE_CONSUMABLE', slot })}
                    type="button"
                  >
                    USE
                  </button>
                  {disabledReason ? <em className="pixel-inventory-reason">{disabledReason}</em> : null}
                </article>
              );
            })}
            {Array.from({ length: CONFIG.consumableSlots - hero.consumables.length }, (_, i) => (
              <article className="pixel-inventory-card is-empty" key={`empty-${i}`}>
                <span className="pixel-inventory-emptyslot">EMPTY SLOT</span>
              </article>
            ))}
          </div>
        )}
        <button className="pixel-secondary-button" onClick={onClose} type="button">CLOSE (I) →</button>
      </div>
    </SceneShell>
  );
}
