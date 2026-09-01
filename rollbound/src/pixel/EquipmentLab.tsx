import { EquipmentIcon } from './EquipmentIcon';
import { EQUIPMENT_ASSETS, EQUIPMENT_LAB_ASSETS, EQUIPMENT_PAIRS } from './equipmentAssets';
import './pixel.css';

const UPGRADE_EFFECTS = {
  weapon: '+3 DAMAGE',
  armor: '+1 ARMOR',
  boots: '1 GRATIS NUDGE-CHARGE',
} as const;

export function EquipmentLab() {
  return (
    <main className="pixel-page equipment-lab-page">
      <div className="equipment-lab">
        <header className="pixel-header">
          <div><small>ASSET-KONTRAKT · 48×48 IKON</small><h1>GEAR LAB</h1></div>
          <div className="pixel-header-actions"><a href="?">← TIL SPILLET</a></div>
        </header>

        <section className="equipment-lab-contract" aria-label="Equipment asset-kontrakt">
          <b>48×48 CANVAS</b><span>36×36 MAX ART</span><span>INGEN PLATFORM</span><span>FÆLLES BASELINE</span>
        </section>

        <section className="equipment-lab-grid" aria-label="Starter- og upgrade-equipment">
          {EQUIPMENT_PAIRS.map(pair => {
            const starter = EQUIPMENT_ASSETS[pair.starter];
            const upgrade = EQUIPMENT_ASSETS[pair.upgrade];
            return (
              <article className={`equipment-lab-sample is-${pair.kind}`} key={pair.kind}>
                <small>{pair.kind.toUpperCase()}</small>
                <div className="equipment-lab-pair">
                  <div className="equipment-lab-item">
                    <div className="equipment-lab-stage"><EquipmentIcon assetId={starter.id} decorative={false} size="lab" /></div>
                    <span>STARTER</span><b>{starter.name}</b>
                  </div>
                  <i aria-hidden="true">→</i>
                  <div className="equipment-lab-item">
                    <div className="equipment-lab-stage"><EquipmentIcon assetId={upgrade.id} decorative={false} size="lab" /></div>
                    <span>UPGRADE</span><b>{upgrade.name}</b>
                  </div>
                </div>
                <strong>{UPGRADE_EFFECTS[pair.kind]}</strong>
              </article>
            );
          })}
        </section>

        <section className="equipment-lab-sizes" aria-label="Equipment størrelsestest">
          <div><small>HUD · 30 PX</small>{EQUIPMENT_LAB_ASSETS.map(asset => <EquipmentIcon assetId={asset.id} key={asset.id} size="hud" />)}</div>
          <div><small>CARD · 40 PX</small>{EQUIPMENT_LAB_ASSETS.map(asset => <EquipmentIcon assetId={asset.id} key={asset.id} size="card" />)}</div>
          <div><small>MANIFEST</small><b>{EQUIPMENT_LAB_ASSETS.length}/6 ASSETS MAPPED</b></div>
        </section>
      </div>
    </main>
  );
}
