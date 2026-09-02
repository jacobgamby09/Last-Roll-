import type { TileType } from '../core/types';
import { PixelHero, PixelTile } from './PixelTile';
import { PixelTileArt } from './PixelTileArt';
import { PIXEL_TILE_META } from './pixelMeta';
import { TILE_LAB_ASSETS } from './tileAssets';
import './pixel.css';

interface TileSample {
  label: string;
  pos: number;
  type: TileType;
}

const TILE_SAMPLES: readonly TileSample[] = [
  { label: 'Blank A', pos: 30, type: 'blank' },
  { label: 'Blank B', pos: 31, type: 'blank' },
  { label: 'Blank C', pos: 32, type: 'blank' },
  { label: 'Combat', pos: 40, type: 'enemy' },
  { label: 'Camp · tent', pos: 40, type: 'camp' },
  { label: 'Camp · bedroll', pos: 41, type: 'camp' },
  { label: 'Treasure', pos: 50, type: 'treasure' },
  { label: 'Shop', pos: 51, type: 'shop' },
  { label: 'Event', pos: 52, type: 'event' },
  { label: 'Gold', pos: 53, type: 'gold' },
  { label: 'Elite', pos: 54, type: 'elite' },
  { label: 'Trap', pos: 55, type: 'trap' },
  { label: 'Boss', pos: 70, type: 'boss' },
];

export function TileLab() {
  return (
    <main className="pixel-page tile-lab-page">
      <div className="tile-lab">
        <header className="pixel-header tile-lab-header">
          <div><small>ASSET CONTRACT · 88×88 TILE</small><h1>TILE LAB</h1></div>
          <div className="pixel-header-actions"><a href="?">← BACK TO GAME</a></div>
        </header>

        <section className="tile-lab-contract" aria-label="Asset contract">
          <b>64×64 CANVAS</b><span>48×48 NORMAL</span><span>56×56 BOSS</span><span>SHARED BASELINE</span>
        </section>

        <section className="tile-lab-grid" aria-label="All tile types">
          {TILE_SAMPLES.map(sample => (
            <article className="tile-lab-sample" key={sample.label}>
              <div className="tile-lab-tile-wrap">
                <PixelTile pos={sample.pos} type={sample.type} />
                <span className="tile-lab-safe-guide" aria-hidden="true" />
              </div>
              <b>{sample.label}</b>
              <small>{PIXEL_TILE_META[sample.type].shortLabel} · {sample.pos % (sample.type === 'blank' ? 3 : 2)}</small>
            </article>
          ))}
        </section>

        <section className="tile-lab-detail-row">
          <article>
            <small>DESTINATION CARD · CAMP 0</small>
            <div className="tile-lab-card"><PixelTileArt type="camp" variant={0} /><b>CAMP</b></div>
          </article>
          <article>
            <small>DESTINATION CARD · CAMP 1</small>
            <div className="tile-lab-card"><PixelTileArt type="camp" variant={1} /><b>CAMP</b></div>
          </article>
          <article>
            <small>HERO ANCHOR · 32×48</small>
            <div className="tile-lab-hero-stage"><PixelHero /></div>
          </article>
          <article>
            <small>MANIFEST</small>
            <b>{TILE_LAB_ASSETS.length}/13 ASSETS MAPPED</b>
          </article>
        </section>
      </div>
    </main>
  );
}
