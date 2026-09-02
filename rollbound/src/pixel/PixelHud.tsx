import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CONFIG } from '../core/config';
import { CONSUMABLES, consumableEffectText } from '../core/items';
import { PICK_LABEL, rotationPick, xpToNext } from '../core/engine';
import type { GameState } from '../core/types';
import { approxEnemyStats } from '../ui/preview';
import { ConsumableIcon } from './ConsumableIcon';
import { EquipmentLoadout } from './EquipmentLoadout';
import { HERO_FRAMES } from './heroAssets';
import { ResourceIcon } from './ResourceIcon';

type HudFeedbackKind = 'damage' | 'heal' | 'xp' | 'level' | null;

interface HudFeedback {
  kind: HudFeedbackKind;
  previousHp: number;
  xpGain: boolean;
}

function PixelBar({ current, feedback, label, max, previousHp, tone }: { current: number; feedback: HudFeedbackKind; label: string; max: number; previousHp: number; tone: 'hp' | 'xp' }) {
  const width = Math.max(0, Math.min(100, (current / max) * 100));
  const ghostWidth = tone === 'hp' && feedback === 'damage'
    ? Math.max(width, Math.min(100, (previousHp / max) * 100))
    : width;
  const style = { '--bar-fill': `${width}%`, '--bar-ghost': `${ghostWidth}%` } as CSSProperties;
  return (
    <div aria-label={label} aria-valuemax={max} aria-valuemin={0} aria-valuenow={current} className={`pixel-bar pixel-bar-${tone} ${feedback ? `is-${feedback}` : ''}`} role="progressbar" style={style}>
      <i className="pixel-bar-ghost" />
      <i className="pixel-bar-fill" />
    </div>
  );
}

function StatBlock({ icon, label, value }: { icon: ReactNode; label: string; value: number | string }) {
  return (
    <div aria-label={`${label}: ${value}`} className="pixel-stat">
      <span className="pixel-stat-icon" aria-hidden="true">{icon}</span>
      <span><small>{label}</small><b>{value}</b></span>
    </div>
  );
}

export function PixelHud({ state }: { state: GameState }) {
  const hero = state.hero;
  const previous = useRef({ hp: hero.hp, level: hero.level, seed: state.seed, xp: hero.xp });
  const feedbackTimer = useRef<number | null>(null);
  const [feedback, setFeedback] = useState<HudFeedback>({ kind: null, previousHp: hero.hp, xpGain: false });
  const nextBonus = CONFIG.levelUpMode === 'rotation' ? PICK_LABEL[rotationPick(hero.level + 1)] : 'Vælg 1 af 3';

  useEffect(() => {
    const last = previous.current;
    previous.current = { hp: hero.hp, level: hero.level, seed: state.seed, xp: hero.xp };

    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    if (last.seed !== state.seed) {
      setFeedback({ kind: null, previousHp: hero.hp, xpGain: false });
      return;
    }

    const kind: HudFeedbackKind = hero.level > last.level
      ? 'level'
      : hero.hp < last.hp
        ? 'damage'
        : hero.hp > last.hp
          ? 'heal'
          : null;
    const xpGain = hero.xp > last.xp || hero.level > last.level;

    if (kind === null && !xpGain) return;
    setFeedback({ kind, previousHp: last.hp, xpGain });
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback({ kind: null, previousHp: hero.hp, xpGain: false });
      feedbackTimer.current = null;
    }, kind === 'level' ? 900 : 650);

    return () => {
      if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
    };
  }, [hero.hp, hero.level, hero.xp, state.seed]);

  return (
    <section className={`pixel-hud ${feedback.kind ? `has-${feedback.kind}` : ''} ${feedback.xpGain ? 'has-xp' : ''}`} aria-label="Heltestatus">
      <div className={`pixel-identity ${feedback.kind ? `is-${feedback.kind}` : ''}`}>
        <div className="pixel-portrait" aria-hidden="true">
          <img alt="" draggable="false" src={HERO_FRAMES.portrait} />
        </div>
      </div>
      <div className="pixel-vitals">
        <div className="pixel-vitals-heading">
          <span aria-label={`Level ${hero.level}`} className={`pixel-level-readout ${feedback.kind === 'level' ? 'is-level-up' : ''}`}><small>LEVEL</small><b>{hero.level}</b></span>
          <span className="pixel-next-bonus"><small>NÆSTE</small><b>{nextBonus}</b></span>
        </div>
        <div className="pixel-vital-row">
          <span className="pixel-vital-label"><ResourceIcon assetId="life" size="mini" /><b>HP</b></span>
          <PixelBar current={hero.hp} feedback={feedback.kind} label={`HP: ${hero.hp} af ${hero.maxHp}`} max={hero.maxHp} previousHp={feedback.previousHp} tone="hp" />
          <span className="pixel-vital-value" aria-hidden="true">{hero.hp} / {hero.maxHp}</span>
        </div>
        <div className="pixel-vital-row">
          <span className="pixel-vital-label"><ResourceIcon assetId="xp" size="mini" /><b>XP</b></span>
          <PixelBar current={hero.xp} feedback={feedback.xpGain ? 'xp' : null} label={`XP: ${hero.xp} af ${xpToNext(hero.level)}`} max={xpToNext(hero.level)} previousHp={feedback.previousHp} tone="xp" />
          <span className="pixel-vital-value" aria-hidden="true">{hero.xp} / {xpToNext(hero.level)}</span>
        </div>
      </div>
      <EquipmentLoadout bootsNudgeCharges={hero.bootsNudgeCharges} loadout={hero.loadout} />
      <div aria-label={`Consumables: ${hero.consumables.length} af ${CONFIG.consumableSlots}`} className="pixel-consumable-slots">
        <small>ITEMS {hero.consumables.length}/{CONFIG.consumableSlots}</small>
        <div>
          {hero.consumables.length === 0
            ? <span className="pixel-consumable-empty">—</span>
            : hero.consumables.map((id, i) => (
              <span aria-label={`${CONSUMABLES[id].name}: ${consumableEffectText(id)}`} className="pixel-consumable-held" key={`${id}-${i}`} title={`${CONSUMABLES[id].name}: ${consumableEffectText(id)}`}>
                <ConsumableIcon assetId={id} size="hud" />
                <span>{CONSUMABLES[id].name}</span>
              </span>
            ))}
        </div>
      </div>
      <div className="pixel-stats-grid">
        <StatBlock icon={<ResourceIcon assetId="damage" size="hud" />} label="DMG" value={`${hero.dmgMin}-${hero.dmgMax}`} />
        <StatBlock icon={<ResourceIcon assetId="armor" size="hud" />} label="ARM" value={hero.armor} />
        <StatBlock icon={<ResourceIcon assetId="gold" size="hud" />} label="GULD" value={hero.gold} />
        <StatBlock icon={<ResourceIcon assetId="nudge" size="hud" />} label="NUDGE" value={hero.nudges} />
        <StatBlock icon={<ResourceIcon assetId="reroll" size="hud" />} label="REROLL" value={hero.rerolls} />
      </div>
      <div className="pixel-boss-readiness">
        <small>BOSSEN · FELT {CONFIG.trackLength}</small>
        <b>{CONFIG.boss.name.toUpperCase()}</b>
        <span>{approxEnemyStats(CONFIG.boss)}</span>
      </div>
    </section>
  );
}
