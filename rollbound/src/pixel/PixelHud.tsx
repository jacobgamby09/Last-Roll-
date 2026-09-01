import type { ReactNode } from 'react';
import { CONFIG } from '../core/config';
import { fightOutcome } from '../core/combat';
import { PICK_LABEL, rotationPick, xpToNext } from '../core/engine';
import type { GameState } from '../core/types';
import { EquipmentLoadout } from './EquipmentLoadout';
import { ResourceIcon } from './ResourceIcon';

function PixelBar({ current, label, max, tone }: { current: number; label: string; max: number; tone: 'hp' | 'xp' }) {
  const width = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div aria-label={label} aria-valuemax={max} aria-valuemin={0} aria-valuenow={current} className={`pixel-bar pixel-bar-${tone}`} role="progressbar">
      <i style={{ width: `${width}%` }} />
      <span>{current}/{max}</span>
    </div>
  );
}

function StatBlock({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div aria-label={`${label}: ${value}`} className="pixel-stat">
      <span className="pixel-stat-icon" aria-hidden="true">{icon}</span>
      <span><small>{label}</small><b>{value}</b></span>
    </div>
  );
}

export function PixelHud({ state }: { state: GameState }) {
  const hero = state.hero;
  const boss = fightOutcome(hero, CONFIG.boss);
  const nextBonus = CONFIG.levelUpMode === 'rotation' ? PICK_LABEL[rotationPick(hero.level + 1)] : 'Vælg 1 af 3';

  return (
    <section className="pixel-hud" aria-label="Heltestatus">
      <div className="pixel-portrait" aria-hidden="true">
        <i className="portrait-hood" /><i className="portrait-face" /><i className="portrait-eye eye-a" /><i className="portrait-eye eye-b" />
        <span className="pixel-level-badge"><small>LV</small><b>{hero.level}</b></span>
      </div>
      <div className="pixel-vitals">
        <div className="pixel-vital-row"><span className="pixel-vital-label"><ResourceIcon assetId="life" size="mini" /><b>HP</b></span><PixelBar current={hero.hp} label="HP" max={hero.maxHp} tone="hp" /></div>
        <div className="pixel-vital-row"><b>XP</b><PixelBar current={hero.xp} label="XP" max={xpToNext(hero.level)} tone="xp" /></div>
        <span className="pixel-next-bonus">NÆSTE: {nextBonus}</span>
      </div>
      <EquipmentLoadout bootsNudgeCharges={hero.bootsNudgeCharges} loadout={hero.loadout} />
      <div className="pixel-stats-grid">
        <StatBlock icon={<ResourceIcon assetId="damage" size="hud" />} label="DMG" value={hero.dmg} />
        <StatBlock icon={<ResourceIcon assetId="armor" size="hud" />} label="ARM" value={hero.armor} />
        <StatBlock icon={<ResourceIcon assetId="gold" size="hud" />} label="GULD" value={hero.gold} />
        <StatBlock icon={<ResourceIcon assetId="nudge" size="hud" />} label="NUDGE" value={hero.nudges} />
        <StatBlock icon={<ResourceIcon assetId="reroll" size="hud" />} label="REROLL" value={hero.rerolls} />
      </div>
      <div aria-live="polite" className={`pixel-boss-readiness ${boss.survives ? 'ready' : ''}`}>
        <small>BOSS-PRIS NU</small>
        <b>{boss.hpLoss} HP</b>
        <span>{boss.survives ? 'KLAR' : `MANGLER ${Math.max(0, boss.hpLoss + 1 - hero.hp)} HP`}</span>
      </div>
    </section>
  );
}
