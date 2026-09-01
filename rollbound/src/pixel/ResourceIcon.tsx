import { useState } from 'react';
import { RESOURCE_ASSETS, type ResourceAssetId } from './resourceAssets';

interface Props {
  assetId: ResourceAssetId;
  decorative?: boolean;
  size?: 'mini' | 'hud' | 'card' | 'lab';
}

export function ResourceIcon({ assetId, decorative = true, size = 'card' }: Props) {
  const [failed, setFailed] = useState(false);
  const asset = RESOURCE_ASSETS[assetId];

  return (
    <span
      aria-label={decorative ? undefined : asset.alt}
      aria-hidden={decorative || undefined}
      className={`pixel-resource-icon is-${asset.id} size-${size} ${failed ? 'is-missing' : ''}`}
      data-resource-asset-id={asset.id}
      role={decorative ? undefined : 'img'}
    >
      {failed
        ? <span className="pixel-resource-error">!</span>
        : <img alt="" draggable={false} onError={() => setFailed(true)} src={asset.src} />}
    </span>
  );
}
