import { useState } from 'react';
import { CONSUMABLES } from '../core/items';
import type { ConsumableId } from '../core/types';
import { CONSUMABLE_ASSETS } from './consumableAssets';
import { ConsumableGlyph } from './ConsumableGlyph';

interface Props {
  assetId: ConsumableId;
  decorative?: boolean;
  size?: 'hud' | 'card' | 'lab';
}

export function ConsumableIcon({ assetId, decorative = true, size = 'card' }: Props) {
  const asset = CONSUMABLE_ASSETS[assetId];
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const missing = !asset || failedSrc === asset.src;

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : CONSUMABLES[assetId].name}
      className={`pixel-consumable-icon size-${size}${missing ? ' is-missing' : ''}`}
      data-consumable-asset-id={assetId}
      role={decorative ? undefined : 'img'}
    >
      {missing
        ? <ConsumableGlyph id={assetId} />
        : <img alt="" draggable={false} onError={() => setFailedSrc(asset.src)} src={asset.src} />}
    </span>
  );
}
