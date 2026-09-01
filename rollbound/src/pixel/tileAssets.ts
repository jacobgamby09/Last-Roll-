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
  { alt: 'Stenvej med en klippe og græs', id: 'blank-a', src: blankA },
  { alt: 'Ruiner på en mørk stenvej', id: 'blank-b', src: blankB },
  { alt: 'Stenvej med lilla svamp', id: 'blank-c', src: blankC },
];

const CAMP_ASSETS: readonly TileAsset[] = [
  { alt: 'Lejr med telt og bål', id: 'camp-tent', src: campTent },
  { alt: 'Lejr med bedroll, gryde og bål', id: 'camp-bedroll', src: campBedroll },
];

const COMBAT_ASSET: TileAsset = {
  alt: 'Krydsede sværd på rød kampgrund',
  id: 'combat',
  src: combat,
};

const GOLD_ASSET: TileAsset = {
  alt: 'Møntbunke på en mørk stenplatform',
  id: 'gold',
  src: gold,
};

const TREASURE_ASSET: TileAsset = {
  alt: 'Lukket skattekiste på en mørk stenplatform',
  id: 'treasure',
  src: treasure,
};

const SHOP_ASSET: TileAsset = {
  alt: 'Handelsbod med cyan markise og eliksirer',
  id: 'shop',
  src: shop,
};

const EVENT_ASSET: TileAsset = {
  alt: 'Violet portal i en brudt stenbue',
  id: 'event',
  src: event,
};

const ELITE_ASSET: TileAsset = {
  alt: 'Hornet dæmonmaske over krydsede klinger',
  id: 'elite',
  src: elite,
};

const TRAP_ASSET: TileAsset = {
  alt: 'Mørk faldgrube med store pigge',
  id: 'trap',
  src: trap,
};

const BOSS_ASSET: TileAsset = {
  alt: 'Hornet bossport med kranie og rød afgrund',
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
