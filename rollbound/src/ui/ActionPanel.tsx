import { CONFIG } from '../core/config';
import { enemyForTile } from '../core/combat';
import { availableNudges, EQUIPMENT_DEFS, equippedIdForKind, equipmentEffectText } from '../core/equipment';
import { CONSUMABLES, consumableEffectText, isPreCombatConsumable, ITEMS } from '../core/items';
import { approxEnemyStats } from './preview';
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
          🎲 Rul terningen{state.twinRollArmed ? ' (Skæbneterning: rul to, vælg én)' : ''}
        </button>
        {hero.consumables.length > 0 && (
          <div className="dest-row">
            {hero.consumables.map((id, slot) => (
              <button className="btn" disabled={isPreCombatConsumable(id)} key={`${id}-${slot}`} onClick={() => dispatch({ type: 'USE_CONSUMABLE', slot })}>
                {CONSUMABLES[id].name} — {isPreCombatConsumable(id) ? 'bruges før kamp' : consumableEffectText(id)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (phase.t === 'chooseRoll') {
    return (
      <div className="panel">
        <div className="panel-title">Skæbneterningen — vælg én</div>
        <div className="dest-row">
          {phase.rolls.map((roll, index) => {
            const info = describeDest(state, roll);
            return (
              <button className="dest-card" key={index} onClick={() => dispatch({ type: 'CHOOSE_ROLL', index: index as 0 | 1 })}>
                <span className="dest-tag">🎲 {roll}</span>
                <span className="dest-title">{info.title}</span>
                <span className="dest-detail">{info.detail}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase.t === 'teleport') {
    return (
      <div className="panel">
        <div className="panel-title">Teleport-rullen — vælg destination</div>
        <div className="dest-row">
          {[1, 2, 3, 4, 5, 6].map(steps => {
            const info = describeDest(state, steps);
            return (
              <button className="dest-card" key={steps} onClick={() => dispatch({ type: 'TELEPORT_MOVE', steps })}>
                <span className="dest-tag">Flyt {steps}</span>
                <span className="dest-title">{info.title}</span>
                <span className="dest-detail">{info.detail}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase.t === 'preCombat') {
    const enemy = enemyForTile(state.pos, phase.tile);
    return (
      <div className="panel">
        <div className="panel-title">⚔ {enemy.name} — {approxEnemyStats(enemy)}{phase.openingDamage > 0 ? ` · klargjort: ${phase.openingDamage} åbningsskade` : ''}</div>
        <div className="dest-row">
          {hero.consumables.map((id, slot) => {
            if (!isPreCombatConsumable(id)) return null;
            const bossBlocked = CONSUMABLES[id].effect.kind === 'flee' && phase.tile === 'boss';
            return (
              <button className="btn" disabled={bossBlocked} key={`${id}-${slot}`} onClick={() => dispatch({ type: 'USE_CONSUMABLE', slot })}>
                {CONSUMABLES[id].name} — {consumableEffectText(id)}
              </button>
            );
          })}
        </div>
        <button className="btn btn-roll" onClick={() => dispatch({ type: 'FIGHT' })}>⚔ Kæmp</button>
      </div>
    );
  }

  if (phase.t === 'rolled') {
    const roll = phase.roll;
    const nudgeCount = availableNudges(hero);
    const nudgeTag = hero.bootsNudgeCharges > 0 ? 'Boots-Nudge' : 'Nudge';
    const candidates = [
      { dir: -1 as const, r: roll - 1, tag: `${nudgeTag} −1`, ok: roll - 1 >= 1 && nudgeCount > 0 && !phase.wasReroll },
      { dir: 0 as const, r: roll, tag: 'Accepter', ok: true },
      { dir: 1 as const, r: roll + 1, tag: `${nudgeTag} +1`, ok: roll + 1 <= 6 && nudgeCount > 0 && !phase.wasReroll },
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
                className={`dest-card ${c.dir === 0 ? 'primary' : ''}`}
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
                  <span className="dest-detail">{c.dir !== 0 && nudgeCount <= 0 ? 'Ingen nudges' : 'Ikke muligt'}</span>
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

  if (phase.t === 'equipment') {
    const offered = EQUIPMENT_DEFS[phase.itemId];
    const currentId = equippedIdForKind(hero, offered.slot);
    return (
      <div className="panel">
        <div className="panel-title">Nyt udstyr: {offered.name}</div>
        <div className="dest-row">
          <div className="dest-card"><span className="dest-tag">Nuværende</span><span className="dest-title">{EQUIPMENT_DEFS[currentId].name}</span><span className="dest-detail">{equipmentEffectText(currentId)}</span></div>
          <div className="dest-card"><span className="dest-tag">Nyt</span><span className="dest-title">{offered.name}</span><span className="dest-detail">{equipmentEffectText(phase.itemId)}</span></div>
        </div>
        <button className="btn btn-roll" disabled={hero.gold < phase.cost} onClick={() => dispatch({ type: 'EQUIP_OFFER' })}>{phase.cost > 0 ? `Køb og udstyr (${phase.cost} guld)` : 'Udstyr'}</button>
        <button className="btn" onClick={() => dispatch({ type: 'KEEP_EQUIPMENT' })}>Behold nuværende</button>
      </div>
    );
  }

  if (phase.t === 'shop') {
    const sh = CONFIG.shop;
    const serviceLabel = { heal: `Heling (+${sh.heal.hp} HP)`, nudge: '+1 Nudge', reroll: '+1 Reroll' } as const;
    return (
      <div className="panel">
        <div className="panel-title">🏪 Shop — du har 💰 {hero.gold}</div>
        <div className="shop-rows">
          {phase.offers.map((offer, index) => {
            const label = offer.kind === 'gear'
              ? `${ITEMS[offer.itemId].name} (${equipmentEffectText(offer.itemId)})`
              : offer.kind === 'consumable'
                ? `${CONSUMABLES[offer.consumableId].name} (${consumableEffectText(offer.consumableId)})`
                : serviceLabel[offer.service];
            const ok = !offer.sold && hero.gold >= offer.cost
              && !(offer.kind === 'service' && offer.service === 'heal' && hero.hp >= hero.maxHp)
              && !(offer.kind === 'consumable' && hero.consumables.length >= CONFIG.consumableSlots);
            return (
              <button key={index} className="shop-row" disabled={!ok} onClick={() => dispatch({ type: 'BUY', index })}>
                <span>{label}{offer.sold ? ' — SOLGT' : ''}</span>
                <span className="shop-cost">{offer.cost} 💰</span>
              </button>
            );
          })}
        </div>
        <button className="btn" onClick={() => dispatch({ type: 'LEAVE_SHOP' })}>
          Forlad shoppen →
        </button>
      </div>
    );
  }

  if (phase.t !== 'over') return null;

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
