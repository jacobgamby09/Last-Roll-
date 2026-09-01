import { useState } from 'react';
import { EQUIPMENT_ASSETS, type EquipmentAssetId } from './equipmentAssets';

interface Props {
  assetId: EquipmentAssetId;
  decorative?: boolean;
  size?: 'hud' | 'card' | 'lab';
}

export function EquipmentIcon({ assetId, decorative = true, size = 'card' }: Props) {
  const [failed, setFailed] = useState(false);
  const asset = EQUIPMENT_ASSETS[assetId];

  return (
    <span
      aria-label={decorative ? undefined : asset.alt}
      aria-hidden={decorative || undefined}
      className={`pixel-equipment-icon is-${asset.kind} size-${size} ${failed ? 'is-missing' : ''}`}
      data-equipment-asset-id={asset.id}
      role={decorative ? undefined : 'img'}
    >
      {failed
        ? <span className="pixel-equipment-error">!</span>
        : <img alt="" draggable={false} onError={() => setFailed(true)} src={asset.src} />}
    </span>
  );
}
