// Destination-preview: hvad sker der, hvis jeg lander på felt X?
// Deterministisk combat gør prisen på en fjende eksakt — kernen i
// "Roll → Evaluate"-beslutningen.

import { CONFIG } from '../core/config';
import { enemyForTile, fightOutcome } from '../core/combat';
import type { GameState, TileType } from '../core/types';
import { TILE_META } from './tileMeta';

export interface DestInfo {
  posTo: number;
  type: TileType;
  title: string;
  detail: string;
  deadly: boolean;
}

export function describeDest(s: GameState, steps: number): DestInfo {
  const posTo = Math.min(s.pos + steps, CONFIG.trackLength);
  const type = s.track[posTo];
  const meta = TILE_META[type];
  const base: DestInfo = { posTo, type, title: `Felt ${posTo} · ${meta.label}`, detail: '', deadly: false };

  switch (type) {
    case 'enemy':
    case 'elite':
    case 'boss': {
      const enemy = enemyForTile(posTo, type);
      const out = fightOutcome(s.hero, enemy);
      base.title = `Felt ${posTo} · ${enemy.name}`;
      base.deadly = !out.survives;
      base.detail = out.survives
        ? `−${out.hpLoss} HP · +${enemy.xp} XP · +${enemy.gold} guld`
        : `☠ Dødelig! Koster ${out.hpLoss} HP — du har ${s.hero.hp}`;
      if (type === 'boss') {
        base.detail = out.survives
          ? `Kan besejres: koster ${out.hpLoss} HP (du har ${s.hero.hp})`
          : `☠ Uovervindelig lige nu: koster ${out.hpLoss} HP (du har ${s.hero.hp})`;
      }
      break;
    }
    case 'camp': {
      const gain = Math.min(CONFIG.camp.heal, s.hero.maxHp - s.hero.hp);
      base.detail = gain > 0 ? `Heler +${gain} HP` : 'Heler (du er på fuld HP)';
      break;
    }
    case 'gold':
      base.detail = `+${CONFIG.goldTile} guld`;
      break;
    case 'treasure':
      base.detail = 'Vælg 1 af 3 skatte';
      break;
    case 'shop':
      base.detail = `Køb for guld (du har ${s.hero.gold})`;
      break;
    case 'event':
      base.detail = `50/50: +${CONFIG.event.gold} guld eller −${CONFIG.event.hpLoss} HP`;
      break;
    case 'trap':
      base.detail = `50/50: −${CONFIG.trap.hpLoss} HP eller −${CONFIG.trap.goldLoss} guld`;
      break;
    case 'blank':
      base.detail = 'Ingen hændelse — et sikkert felt';
      break;
  }
  return base;
}

// Kort pris-chip til track-visningen
export function tileChip(s: GameState, pos: number): { text: string; deadly: boolean } | null {
  const type = s.track[pos];
  switch (type) {
    case 'enemy':
    case 'elite':
    case 'boss': {
      const enemy = enemyForTile(pos, type);
      const out = fightOutcome(s.hero, enemy);
      if (!out.survives) return { text: '☠', deadly: true };
      return { text: `−${out.hpLoss}♥`, deadly: false };
    }
    case 'camp':
      return { text: `+${CONFIG.camp.heal}♥`, deadly: false };
    case 'gold':
      return { text: `+${CONFIG.goldTile}g`, deadly: false };
    default:
      return null;
  }
}
