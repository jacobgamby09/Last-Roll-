import { useState } from 'react';
import { ITEMS } from '../core/items';
import { EQUIPMENT_ASSETS, type EquipmentAssetId } from './equipmentAssets';

interface Props {
  assetId: EquipmentAssetId;
  decorative?: boolean;
  size?: 'hud' | 'card' | 'lab';
}

const SLOT_GLYPH = { weapon: '⚔', armor: '⛨', boots: '⇶' } as const;

export function EquipmentIcon({ assetId, decorative = true, size = 'card' }: Props) {
  const [failed, setFailed] = useState(false);
  const asset = EQUIPMENT_ASSETS[assetId];
  const def = ITEMS[assetId];

  // Eksplicit fallback for items uden produceret ikon endnu (batch-leverance):
  // slot-glyf i slottets farvegrammatik — aldrig et forkert items art.
  if (!asset) {
    return (
      <span
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : def.name}
        className={`pixel-equipment-icon is-${def.slot} size-${size} is-placeholder`}
        data-equipment-asset-id={assetId}
        role={decorative ? undefined : 'img'}
      >
        <span className="pixel-equipment-glyph">{SLOT_GLYPH[def.slot]}</span>
      </span>
    );
  }

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
