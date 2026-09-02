import { EquipmentIcon } from './EquipmentIcon';
import { ConsumableIcon } from './ConsumableIcon';
import { CONSUMABLE_ASSETS } from './consumableAssets';
import { CONSUMABLES, ITEMS, consumableEffectText, itemEffectText } from '../core/items';
import { EQUIPMENT_ASSETS, EQUIPMENT_LAB_ASSETS, EQUIPMENT_PAIRS } from './equipmentAssets';
import './pixel.css';

export function EquipmentLab() {
  return (
    <main className="pixel-page equipment-lab-page">
      <div className="equipment-lab">
        <header className="pixel-header">
          <div><small>ASSET CONTRACT · 48×48 ICON</small><h1>GEAR LAB</h1></div>
          <div className="pixel-header-actions"><a href="?">← BACK TO GAME</a></div>
        </header>

        <section className="equipment-lab-contract" aria-label="Equipment asset contract">
          <b>48×48 CANVAS</b><span>36×36 MAX ART</span><span>NO PLATFORM</span><span>SHARED BASELINE</span>
        </section>

        <section className="equipment-lab-grid" aria-label="Starter and upgrade equipment">
          {EQUIPMENT_PAIRS.map(pair => {
            const starter = EQUIPMENT_ASSETS[pair.starter];
            const upgrade = EQUIPMENT_ASSETS[pair.upgrade];
            if (!starter || !upgrade) return null;
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
                <strong>{itemEffectText(upgrade.id)}</strong>
              </article>
            );
          })}
        </section>

        <section className="equipment-lab-sizes" aria-label="Equipment size test">
          <div><small>HUD · 30 PX</small>{EQUIPMENT_LAB_ASSETS.map(asset => <EquipmentIcon assetId={asset.id} key={asset.id} size="hud" />)}</div>
          <div><small>CARD · 40 PX</small>{EQUIPMENT_LAB_ASSETS.map(asset => <EquipmentIcon assetId={asset.id} key={asset.id} size="card" />)}</div>
          <div><small>MANIFEST</small><b>{EQUIPMENT_LAB_ASSETS.length}/{Object.keys(ITEMS).length} GEAR MAPPED</b></div>
        </section>

        <section className="equipment-lab-grid equipment-lab-catalog" aria-label="All equipment icons">
          {Object.values(ITEMS).map(item => (
            <article className={`equipment-lab-sample is-${item.slot}`} key={item.id}>
              <small>{item.slot.toUpperCase()}</small>
              <EquipmentIcon assetId={item.id} decorative={false} size="lab" />
              <b>{item.name}</b>
              <p>{itemEffectText(item.id)}</p>
              <div className="equipment-lab-runtime-sizes">
                <span>HUD <EquipmentIcon assetId={item.id} size="hud" /></span>
                <span>CARD <EquipmentIcon assetId={item.id} size="card" /></span>
              </div>
            </article>
          ))}
        </section>

        <section className="equipment-lab-contract" aria-label="Consumable manifest">
          <b>{Object.keys(CONSUMABLE_ASSETS).length}/{Object.keys(CONSUMABLES).length} CONSUMABLES MAPPED</b>
          <span>SEPARATE ICON FAMILY · GLYPH FALLBACK</span>
        </section>
        <section className="equipment-lab-grid equipment-lab-catalog" aria-label="All consumable icons">
          {Object.values(CONSUMABLES).map(item => (
            <article className="equipment-lab-sample" key={item.id}>
              <small>CONSUMABLE</small>
              <ConsumableIcon assetId={item.id} decorative={false} size="lab" />
              <b>{item.name}</b>
              <p>{consumableEffectText(item.id)}</p>
              <div className="equipment-lab-runtime-sizes">
                <span>HUD <ConsumableIcon assetId={item.id} size="hud" /></span>
                <span>CARD <ConsumableIcon assetId={item.id} size="card" /></span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
