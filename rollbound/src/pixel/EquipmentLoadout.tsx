import type { EquipmentLoadout as EquipmentLoadoutState } from '../core/types';
import { EquipmentIcon } from './EquipmentIcon';
import { EQUIPMENT_ASSETS, type EquipmentAssetId, type EquipmentKind } from './equipmentAssets';

const SLOTS: ReadonlyArray<{ key: EquipmentKind; label: string }> = [
  { key: 'weapon', label: 'VÅBEN' },
  { key: 'armor', label: 'RUST' },
  { key: 'boots', label: 'BOOTS' },
];

export function EquipmentLoadout({ bootsNudgeCharges, loadout }: { bootsNudgeCharges: number; loadout: EquipmentLoadoutState }) {
  return (
    <div className="pixel-equipment-loadout" aria-label="Udstyr">
      <small>UDSTYR</small>
      <div className="pixel-equipment-slots">
        {SLOTS.map(slot => {
          const assetId = loadout[slot.key] as EquipmentAssetId;
          const asset = EQUIPMENT_ASSETS[assetId];
          return (
            <div aria-label={`${slot.label}: ${asset.name}${slot.key === 'boots' && bootsNudgeCharges > 0 ? `, ${bootsNudgeCharges} gratis Nudge tilbage` : ''}`} className={`pixel-equipment-slot is-${slot.key}`} key={slot.key}>
              <EquipmentIcon assetId={assetId} size="hud" />
              <span>{slot.label}</span>
              {slot.key === 'boots' && bootsNudgeCharges > 0
                ? <b className="pixel-equipment-charge" title="Gratis Nudge fra Boots">±{bootsNudgeCharges}</b>
                : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
