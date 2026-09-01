import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CONFIG } from '../core/config';
import { fightOutcome } from '../core/combat';
import { PICK_LABEL, rotationPick, xpToNext } from '../core/engine';
import type { GameState } from '../core/types';
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
      <i className="pixel-bar-segments" aria-hidden="true" />
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
  const previous = useRef({ hp: hero.hp, level: hero.level, seed: state.seed, xp: hero.xp });
  const feedbackTimer = useRef<number | null>(null);
  const [feedback, setFeedback] = useState<HudFeedback>({ kind: null, previousHp: hero.hp, xpGain: false });
  const boss = fightOutcome(hero, CONFIG.boss);
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
          <i className="pixel-portrait-sigil" />
          <img alt="" draggable="false" src={HERO_FRAMES.portrait} />
          <i className="pixel-portrait-scanline" />
        </div>
        <span aria-label={`Level ${hero.level}`} className={`pixel-level-badge ${feedback.kind === 'level' ? 'is-level-up' : ''}`}><small>LV</small><b>{hero.level}</b></span>
      </div>
      <div className="pixel-vitals">
        <div className="pixel-vital-row"><span className="pixel-vital-label"><ResourceIcon assetId="life" size="mini" /><b>HP</b></span><PixelBar current={hero.hp} feedback={feedback.kind} label="HP" max={hero.maxHp} previousHp={feedback.previousHp} tone="hp" /></div>
        <div className="pixel-vital-row"><span className="pixel-vital-label"><ResourceIcon assetId="xp" size="mini" /><b>XP</b></span><PixelBar current={hero.xp} feedback={feedback.xpGain ? 'xp' : null} label="XP" max={xpToNext(hero.level)} previousHp={feedback.previousHp} tone="xp" /></div>
        <span className="pixel-next-bonus"><small>NÆSTE LEVEL</small><b>{nextBonus}</b></span>
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
