import { ResourceIcon } from './ResourceIcon';
import { RESOURCE_LAB_ASSETS } from './resourceAssets';
import './pixel.css';

const RESOURCE_USAGE = {
  damage: 'ATTACK POWER',
  armor: 'DAMAGE REDUCTION',
  life: 'HP · MAX HP · HEALING',
  xp: 'EXPERIENCE · LEVEL',
  gold: 'GOLD · PRICES',
  nudge: '±1 MOVEMENT',
  reroll: 'NEW DIE THROW',
} as const;

export function ResourceLab() {
  return (
    <main className="pixel-page resource-lab-page">
      <div className="resource-lab">
        <header className="pixel-header">
          <div><small>NON-EQUIPMENT · 48×48 ICON</small><h1>RESOURCE LAB</h1></div>
          <div className="pixel-header-actions"><a href="?">← BACK TO GAME</a></div>
        </header>

        <section className="resource-lab-contract" aria-label="Resource asset contract">
          <b>7 HUD SYMBOLS</b><span>5 RESOURCES · 2 STATS</span><span>NO EQUIPMENT SLOTS</span><span>UNIQUE SILHOUETTE</span>
        </section>

        <section className="resource-lab-grid" aria-label="Resource assets">
          {RESOURCE_LAB_ASSETS.map(asset => (
            <article className={`resource-lab-sample is-${asset.id}`} key={asset.id}>
              <div className="resource-lab-stage"><ResourceIcon assetId={asset.id} decorative={false} size="lab" /></div>
              <b>{asset.name}</b>
              <span>{RESOURCE_USAGE[asset.id]}</span>
            </article>
          ))}
        </section>

        <section className="resource-lab-sizes" aria-label="Resource size test">
          <div><small>HUD · 28–38 PX</small>{RESOURCE_LAB_ASSETS.map(asset => <ResourceIcon assetId={asset.id} key={asset.id} size="hud" />)}</div>
          <div><small>CARD · 40–46 PX</small>{RESOURCE_LAB_ASSETS.map(asset => <ResourceIcon assetId={asset.id} key={asset.id} size="card" />)}</div>
          <div><small>MANIFEST</small><b>{RESOURCE_LAB_ASSETS.length}/7 ASSETS MAPPED</b></div>
        </section>
      </div>
    </main>
  );
}
