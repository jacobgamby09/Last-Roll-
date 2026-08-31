import { CONFIG } from '../core/config';
import { PICK_LABEL } from '../core/engine';
import type { Action } from '../core/engine';
import type { GameState, LevelPick } from '../core/types';
import { TILE_META } from './tileMeta';
import { describeDest } from './preview';

interface Props {
  state: GameState;
  dispatch: (a: Action) => void;
}

export function ActionPanel({ state, dispatch }: Props) {
  const { phase, hero } = state;

  if (phase.t === 'idle') {
    return (
      <div className="panel">
        <button className="btn btn-roll" onClick={() => dispatch({ type: 'ROLL' })}>
          🎲 Rul terningen
        </button>
      </div>
    );
  }

  if (phase.t === 'rolled') {
    const roll = phase.roll;
    const candidates = [
      { dir: -1 as const, r: roll - 1, tag: `Nudge −1`, ok: roll - 1 >= 1 && hero.nudges > 0 && !phase.wasReroll },
      { dir: 0 as const, r: roll, tag: 'Accepter', ok: true },
      { dir: 1 as const, r: roll + 1, tag: `Nudge +1`, ok: roll + 1 <= 6 && hero.nudges > 0 && !phase.wasReroll },
    ];
    return (
      <div className="panel">
        <div className="roll-result">🎲 Du slog {roll}</div>
        <div className="dest-row">
          {candidates.map(c => {
            const info = c.ok ? describeDest(state, c.r) : null;
            return (
              <button
                key={c.dir}
                className={`dest-card ${c.dir === 0 ? 'primary' : ''} ${info?.deadly ? 'deadly' : ''}`}
                disabled={!c.ok}
                onClick={() => dispatch(c.dir === 0 ? { type: 'ACCEPT' } : { type: 'NUDGE', dir: c.dir })}
              >
                <span className="dest-tag">{c.tag}</span>
                {info ? (
                  <>
                    <span className="dest-icon">{TILE_META[info.type].icon}</span>
                    <span className="dest-title">{info.title}</span>
                    <span className="dest-detail">{info.detail}</span>
                  </>
                ) : (
                  <span className="dest-detail">{c.dir !== 0 && hero.nudges <= 0 ? 'Ingen nudges' : 'Ikke muligt'}</span>
                )}
              </button>
            );
          })}
        </div>
        <button
          className="btn btn-reroll"
          disabled={hero.rerolls <= 0 || phase.wasReroll}
          onClick={() => dispatch({ type: 'REROLL' })}
        >
          🔄 Reroll ({hero.rerolls} tilbage) — nyt resultat SKAL accepteres
        </button>
      </div>
    );
  }

  if (phase.t === 'levelup') {
    const picks: LevelPick[] = ['dmg', 'hp', 'armor'];
    return (
      <div className="panel">
        <div className="panel-title">⬆️ Level up! Vælg din bonus ({state.pendingLevelUps} tilbage)</div>
        <div className="dest-row">
          {picks.map(p => (
            <button key={p} className="dest-card" onClick={() => dispatch({ type: 'PICK_LEVELUP', pick: p })}>
              <span className="dest-title">{PICK_LABEL[p]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase.t === 'treasure') {
    return (
      <div className="panel">
        <div className="panel-title">🎁 Skattekiste — vælg 1 af {phase.options.length}</div>
        <div className="dest-row">
          {phase.options.map((o, i) => (
            <button key={o.key + i} className="dest-card" onClick={() => dispatch({ type: 'PICK_TREASURE', index: i })}>
              <span className="dest-title">{o.name}</span>
              <span className="dest-detail">{o.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase.t === 'shop') {
    const sh = CONFIG.shop;
    const rows: { key: 'weapon' | 'armor' | 'heal' | 'nudge' | 'reroll'; label: string; cost: number; ok: boolean }[] = [
      { key: 'weapon', label: `Våben-opgradering (+${sh.weapon.dmg} DMG)`, cost: sh.weapon.cost, ok: !phase.boughtWeapon && hero.gold >= sh.weapon.cost },
      { key: 'armor', label: `Rustning (+${sh.armorItem.armor} ARMOR)`, cost: sh.armorItem.cost, ok: !phase.boughtArmor && hero.gold >= sh.armorItem.cost },
      { key: 'heal', label: `Heling (+${sh.heal.hp} HP)`, cost: sh.heal.cost, ok: hero.gold >= sh.heal.cost && hero.hp < hero.maxHp },
      { key: 'nudge', label: '+1 Nudge', cost: sh.nudge, ok: hero.gold >= sh.nudge },
      { key: 'reroll', label: '+1 Reroll', cost: sh.reroll, ok: hero.gold >= sh.reroll },
    ];
    return (
      <div className="panel">
        <div className="panel-title">🏪 Shop — du har 💰 {hero.gold}</div>
        <div className="shop-rows">
          {rows.map(r => (
            <button key={r.key} className="shop-row" disabled={!r.ok} onClick={() => dispatch({ type: 'BUY', item: r.key })}>
              <span>{r.label}</span>
              <span className="shop-cost">{r.cost} 💰</span>
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => dispatch({ type: 'LEAVE_SHOP' })}>
          Forlad shoppen →
        </button>
      </div>
    );
  }

  // over
  return (
    <div className="panel">
      <div className={`over ${phase.won ? 'won' : 'lost'}`}>
        <div className="over-title">{phase.won ? '🏆 SEJR!' : '💀 RUNNET ER SLUT'}</div>
        <div className="over-cause">{phase.cause}</div>
        <div className="over-stats">
          {state.rolls} rolls · {state.fights} kampe · Level {hero.level} · Seed {state.seed}
        </div>
        <button className="btn btn-roll" onClick={() => dispatch({ type: 'RESTART' })}>
          🎲 Nyt run
        </button>
      </div>
    </div>
  );
}
