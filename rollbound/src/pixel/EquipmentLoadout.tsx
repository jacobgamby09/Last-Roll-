import { equipmentEffectText } from '../core/equipment';
import { ITEMS, itemStats } from '../core/items';
import type { EquipmentLoadout as EquipmentLoadoutState, SlotBuffs } from '../core/types';
import { EquipmentIcon } from './EquipmentIcon';
import { type EquipmentAssetId, type EquipmentKind } from './equipmentAssets';
import { HudTip } from './HudTip';

const SLOTS: ReadonlyArray<{ key: EquipmentKind; label: string }> = [
  { key: 'weapon', label: 'WEAPON' },
  { key: 'armor', label: 'ARMOR' },
  { key: 'boots', label: 'BOOTS' },
];

export function EquipmentLoadout({ bootsNudgeCharges, loadout, slotBuffs }: { bootsNudgeCharges: number; loadout: EquipmentLoadoutState; slotBuffs: SlotBuffs }) {
  return (
    <div className="pixel-equipment-loadout" aria-label="Gear">
      <small>GEAR</small>
      <div className="pixel-equipment-slots">
        {SLOTS.map(slot => {
          const assetId = loadout[slot.key] as EquipmentAssetId;
          const def = ITEMS[assetId];
          const lines = [equipmentEffectText(assetId)];
          const buffs = slotBuffs[slot.key];
          const buffParts: string[] = [];
          if (buffs.dmg) buffParts.push(`+${buffs.dmg} DMG`);
          if (buffs.armor) buffParts.push(`+${buffs.armor} ARM`);
          if (buffs.maxHp) buffParts.push(`+${buffs.maxHp} max HP`);
          if (buffParts.length > 0) lines.push(`Improved: ${buffParts.join(' & ')}`);
          if (slot.key === 'boots' && itemStats(def).bootsCharges > 0) {
            lines.push(`${bootsNudgeCharges} charge${bootsNudgeCharges === 1 ? '' : 's'} ready`);
          }
          return (
            <HudTip className={`pixel-equipment-slot is-${slot.key} ${buffParts.length > 0 ? 'is-buffed' : ''}`} key={slot.key} label={def.name} lines={lines}>
              <EquipmentIcon assetId={assetId} size="hud" />
              <span>{slot.label}</span>
              {buffParts.length > 0 ? <b className="pixel-equipment-buff" title="Improved">★</b> : null}
              {slot.key === 'boots' && bootsNudgeCharges > 0
                ? <b className="pixel-equipment-charge" title="Free nudge from boots">±{bootsNudgeCharges}</b>
                : null}
            </HudTip>
          );
        })}
      </div>
    </div>
  );
}
