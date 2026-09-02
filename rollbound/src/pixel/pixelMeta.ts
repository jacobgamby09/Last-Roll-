import type { TileType } from '../core/types';

interface PixelTileMeta {
  color: string;
  label: string;
  shortLabel: string;
}

export const PIXEL_TILE_META: Record<TileType, PixelTileMeta> = {
  blank: { color: '#61556f', label: 'Quiet road', shortLabel: 'ROAD' },
  enemy: { color: '#ff3b4d', label: 'Fight', shortLabel: 'FIGHT' },
  elite: { color: '#ff2bd6', label: 'Elite', shortLabel: 'ELITE' },
  gold: { color: '#ffd84a', label: 'Gold', shortLabel: 'GOLD' },
  treasure: { color: '#ffb52e', label: 'Treasure', shortLabel: 'CHEST' },
  camp: { color: '#39ff88', label: 'Camp', shortLabel: 'CAMP' },
  shop: { color: '#25d9ff', label: 'Shop', shortLabel: 'SHOP' },
  event: { color: '#a66bff', label: 'Event', shortLabel: 'EVENT' },
  trap: { color: '#df6cff', label: 'Trap', shortLabel: 'TRAP' },
  boss: { color: '#fff2df', label: 'Boss', shortLabel: 'BOSS' },
};
