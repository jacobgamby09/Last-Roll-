import type { TileType } from '../core/types';

export const TILE_META: Record<TileType, { icon: string; label: string; cls: string }> = {
  blank: { icon: '·', label: 'Vej', cls: 'tile-blank' },
  enemy: { icon: '⚔️', label: 'Fjende', cls: 'tile-enemy' },
  elite: { icon: '💀', label: 'Elite', cls: 'tile-elite' },
  gold: { icon: '💰', label: 'Guld', cls: 'tile-gold' },
  treasure: { icon: '🎁', label: 'Skat', cls: 'tile-treasure' },
  camp: { icon: '⛺', label: 'Lejr', cls: 'tile-camp' },
  shop: { icon: '🏪', label: 'Shop', cls: 'tile-shop' },
  event: { icon: '❓', label: 'Event', cls: 'tile-event' },
  trap: { icon: '🕳️', label: 'Fælde', cls: 'tile-trap' },
  boss: { icon: '🐉', label: 'Boss', cls: 'tile-boss' },
};
