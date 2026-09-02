import blankA from '../assets/pixel/tiles/blank-a-v1.png';
import blankB from '../assets/pixel/tiles/blank-b-v1.png';
import blankC from '../assets/pixel/tiles/blank-c-v1.png';
import campBedroll from '../assets/pixel/tiles/camp-bedroll-v1.png';
import campTent from '../assets/pixel/tiles/camp-tent-v1.png';
import boss from '../assets/pixel/tiles/boss-v1.png';
import combat from '../assets/pixel/tiles/combat-v1.png';
import elite from '../assets/pixel/tiles/elite-v1.png';
import event from '../assets/pixel/tiles/event-v1.png';
import gold from '../assets/pixel/tiles/gold-v1.png';
import shop from '../assets/pixel/tiles/shop-v1.png';
import trap from '../assets/pixel/tiles/trap-v1.png';
import treasure from '../assets/pixel/tiles/treasure-v1.png';
import type { TileType } from '../core/types';

export interface TileAsset {
  alt: string;
  id: string;
  src: string;
}

const BLANK_ASSETS: readonly TileAsset[] = [
  { alt: 'Stone road with a rock and grass', id: 'blank-a', src: blankA },
  { alt: 'Ruins on a dark stone road', id: 'blank-b', src: blankB },
  { alt: 'Stone road with a purple mushroom', id: 'blank-c', src: blankC },
];

const CAMP_ASSETS: readonly TileAsset[] = [
  { alt: 'Camp with a tent and campfire', id: 'camp-tent', src: campTent },
  { alt: 'Camp with a bedroll, pot and campfire', id: 'camp-bedroll', src: campBedroll },
];

const COMBAT_ASSET: TileAsset = {
  alt: 'Crossed swords on red battle ground',
  id: 'combat',
  src: combat,
};

const GOLD_ASSET: TileAsset = {
  alt: 'Pile of coins on a dark stone platform',
  id: 'gold',
  src: gold,
};

const TREASURE_ASSET: TileAsset = {
  alt: 'Closed treasure chest on a dark stone platform',
  id: 'treasure',
  src: treasure,
};

const SHOP_ASSET: TileAsset = {
  alt: 'Market stall with a cyan awning and elixirs',
  id: 'shop',
  src: shop,
};

const EVENT_ASSET: TileAsset = {
  alt: 'Violet portal in a broken stone arch',
  id: 'event',
  src: event,
};

const ELITE_ASSET: TileAsset = {
  alt: 'Horned demon mask above crossed blades',
  id: 'elite',
  src: elite,
};

const TRAP_ASSET: TileAsset = {
  alt: 'Dark pitfall with large spikes',
  id: 'trap',
  src: trap,
};

const BOSS_ASSET: TileAsset = {
  alt: 'Horned boss gate with a skull and red abyss',
  id: 'boss',
  src: boss,
};

export function tileAssetFor(type: TileType, variant = 0): TileAsset | null {
  if (type === 'blank') return BLANK_ASSETS[Math.abs(variant) % BLANK_ASSETS.length];
  if (type === 'camp') return CAMP_ASSETS[Math.abs(variant) % CAMP_ASSETS.length];
  if (type === 'enemy') return COMBAT_ASSET;
  if (type === 'gold') return GOLD_ASSET;
  if (type === 'treasure') return TREASURE_ASSET;
  if (type === 'shop') return SHOP_ASSET;
  if (type === 'event') return EVENT_ASSET;
  if (type === 'elite') return ELITE_ASSET;
  if (type === 'trap') return TRAP_ASSET;
  if (type === 'boss') return BOSS_ASSET;
  return null;
}

export const TILE_LAB_ASSETS = [
  ...BLANK_ASSETS,
  COMBAT_ASSET,
  ...CAMP_ASSETS,
  GOLD_ASSET,
  TREASURE_ASSET,
  SHOP_ASSET,
  EVENT_ASSET,
  ELITE_ASSET,
  TRAP_ASSET,
  BOSS_ASSET,
] as const;
