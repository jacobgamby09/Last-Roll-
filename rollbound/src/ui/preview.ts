// Destination-preview og felt-information.
// BESLUTNING 2026-09-02 (se AGENTS.md/GDD.md): ingen eksakt HP-pris for kampe
// nogen steder — combat-felter viser mob-type og CA. stats som intervaller.
// Spilleren vurderer selv kampen; spillet fælder ingen dom (ingen ☠-flag).

import { CONFIG } from '../core/config';
import { enemyForTile } from '../core/combat';
import type { EnemyDef, GameState, TileType } from '../core/types';
import { TILE_META } from './tileMeta';

// Interval-reglen: HP i 5-buckets, DMG = fjendens FAKTISKE range (damage er
// nu ranges i core, så intervallet er bogstaveligt sandt), ARM eksakt.
export function approxEnemyStats(enemy: EnemyDef): string {
  const hpLo = Math.floor(enemy.hp / 5) * 5;
  const hpHi = hpLo + 5;
  return `HP ${hpLo}-${hpHi} · DMG ${enemy.dmgMin}-${enemy.dmgMax} · ARM ${enemy.armor}`;
}

export interface DestInfo {
  posTo: number;
  type: TileType;
  title: string;
  detail: string;
}

export function describeDest(s: GameState, steps: number): DestInfo {
  const posTo = Math.min(s.pos + steps, CONFIG.trackLength);
  const type = s.track[posTo];
  const meta = TILE_META[type];
  const base: DestInfo = { posTo, type, title: `Felt ${posTo} · ${meta.label}`, detail: '' };

  switch (type) {
    case 'enemy':
    case 'elite':
    case 'boss': {
      const enemy = enemyForTile(posTo, type);
      base.title = `Felt ${posTo} · ${enemy.name}`;
      base.detail = approxEnemyStats(enemy);
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

// Kort chip til track-visningen. KUN non-combat-fakta (jf. AGENTS.md):
// combat-felter viser aldrig pris; de inspiceres via hover/klik i stedet.
export function tileChip(s: GameState, pos: number): { text: string } | null {
  const type = s.track[pos];
  switch (type) {
    case 'camp':
      return { text: `+${CONFIG.camp.heal}♥` };
    case 'gold':
      return { text: `+${CONFIG.goldTile}g` };
    default:
      return null;
  }
}
