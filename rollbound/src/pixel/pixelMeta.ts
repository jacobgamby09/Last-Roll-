import type { TileType } from '../core/types';

interface PixelTileMeta {
  color: string;
  label: string;
  shortLabel: string;
}

export const PIXEL_TILE_META: Record<TileType, PixelTileMeta> = {
  blank: { color: '#61556f', label: 'Stille vej', shortLabel: 'VEJ' },
  enemy: { color: '#ff3b4d', label: 'Kamp', shortLabel: 'KAMP' },
  elite: { color: '#ff2bd6', label: 'Elite', shortLabel: 'ELITE' },
  gold: { color: '#ffd84a', label: 'Guld', shortLabel: 'GULD' },
  treasure: { color: '#ffb52e', label: 'Skat', shortLabel: 'SKAT' },
  camp: { color: '#39ff88', label: 'Lejr', shortLabel: 'LEJR' },
  shop: { color: '#25d9ff', label: 'Shop', shortLabel: 'SHOP' },
  event: { color: '#a66bff', label: 'Event', shortLabel: 'EVENT' },
  trap: { color: '#df6cff', label: 'Fælde', shortLabel: 'FÆLDE' },
  boss: { color: '#fff2df', label: 'Boss', shortLabel: 'BOSS' },
};
