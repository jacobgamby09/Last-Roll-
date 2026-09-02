import type { TileType } from '../core/types';

export const TILE_META: Record<TileType, { icon: string; label: string; cls: string }> = {
  blank: { icon: '·', label: 'Road', cls: 'tile-blank' },
  enemy: { icon: '⚔️', label: 'Enemy', cls: 'tile-enemy' },
  elite: { icon: '💀', label: 'Elite', cls: 'tile-elite' },
  gold: { icon: '💰', label: 'Gold', cls: 'tile-gold' },
  treasure: { icon: '🎁', label: 'Treasure', cls: 'tile-treasure' },
  camp: { icon: '⛺', label: 'Camp', cls: 'tile-camp' },
  shop: { icon: '🏪', label: 'Shop', cls: 'tile-shop' },
  event: { icon: '❓', label: 'Event', cls: 'tile-event' },
  trap: { icon: '🕳️', label: 'Trap', cls: 'tile-trap' },
  boss: { icon: '🐉', label: 'Boss', cls: 'tile-boss' },
};
