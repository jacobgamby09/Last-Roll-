import { useState } from 'react';
import type { TileType } from '../core/types';
import { tileAssetFor, type TileAsset } from './tileAssets';

function GeneratedArt({ asset }: { asset: TileAsset }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`px-art px-art-generated ${failed ? 'is-missing' : ''}`} data-asset-id={asset.id}>
      {failed
        ? <span className="px-asset-error">ASSET<br />FEJL</span>
        : <img alt="" draggable={false} onError={() => setFailed(true)} src={asset.src} />}
    </div>
  );
}

function MissingManifestArt() {
  return (
    <div className="px-art px-art-generated is-missing" aria-hidden="true">
      <span className="px-asset-error">MANIFEST<br />FEJL</span>
    </div>
  );
}

export function PixelTileArt({ type, variant = 0 }: { type: TileType; variant?: number }) {
  const asset = tileAssetFor(type, variant);
  return asset ? <GeneratedArt asset={asset} /> : <MissingManifestArt />;
}
