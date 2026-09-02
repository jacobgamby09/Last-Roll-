import { CONFIG } from '../core/config';
import { PICK_LABEL, rotationPick, xpToNext } from '../core/engine';
import type { GameState } from '../core/types';
import { approxEnemyStats } from './preview';

function Bar({ value, max, cls }: { value: number; max: number; cls: string }) {
  return (
    <div className="bar">
      <div className={`bar-fill ${cls}`} style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }} />
      <span className="bar-text">
        {value} / {max}
      </span>
    </div>
  );
}

export function Hud({ state }: { state: GameState }) {
  const h = state.hero;
  const need = xpToNext(h.level);
  const nextBonus = CONFIG.levelUpMode === 'rotation' ? PICK_LABEL[rotationPick(h.level + 1)] : 'valg mellem 3';

  return (
    <div className="hud">
      <div className="hud-row">
        <div className="stat wide">
          <label>HP</label>
          <Bar value={h.hp} max={h.maxHp} cls="hp" />
        </div>
        <div className="stat wide">
          <label>
            Level {h.level} · næste: {nextBonus}
          </label>
          <Bar value={h.xp} max={need} cls="xp" />
        </div>
      </div>
      <div className="hud-row">
        <div className="stat">⚔️ {h.dmg} <small>DMG</small></div>
        <div className="stat">🛡️ {h.armor} <small>ARMOR</small></div>
        <div className="stat">💰 {h.gold} <small>GULD</small></div>
        <div className="stat">👉 {h.nudges} <small>NUDGE</small></div>
        <div className="stat">🎲 {h.rerolls} <small>REROLL</small></div>
        <div className="stat">📍 {state.pos}/{CONFIG.trackLength}</div>
      </div>
      {state.phase.t !== 'over' && (
        <div className="boss-banner ok">
          🐉 {CONFIG.boss.name} venter på felt {CONFIG.trackLength}: {approxEnemyStats(CONFIG.boss)}
        </div>
      )}
    </div>
  );
}
