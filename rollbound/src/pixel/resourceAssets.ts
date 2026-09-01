import armorShield from '../assets/pixel/resources/armor-shield-v1.png';
import damageSword from '../assets/pixel/resources/damage-sword-v1.png';
import goldCoins from '../assets/pixel/resources/gold-coins-v1.png';
import lifeHeart from '../assets/pixel/resources/life-heart-v1.png';
import nudgeDie from '../assets/pixel/resources/nudge-die-v1.png';
import rerollDie from '../assets/pixel/resources/reroll-die-v1.png';

export type ResourceAssetId = 'life' | 'gold' | 'nudge' | 'reroll' | 'damage' | 'armor';

export interface ResourceAsset {
  alt: string;
  id: ResourceAssetId;
  name: string;
  src: string;
}

export const RESOURCE_ASSETS: Record<ResourceAssetId, ResourceAsset> = {
  damage: {
    alt: 'Rødt sværd og slagspark for Damage',
    id: 'damage',
    name: 'Damage',
    src: damageSword,
  },
  armor: {
    alt: 'Cyan skjold for Armor',
    id: 'armor',
    name: 'Armor',
    src: armorShield,
  },
  life: {
    alt: 'Rødt pixelhjerte for liv og healing',
    id: 'life',
    name: 'Liv / HP',
    src: lifeHeart,
  },
  gold: {
    alt: 'Tre stablede guldmønter',
    id: 'gold',
    name: 'Guld',
    src: goldCoins,
  },
  nudge: {
    alt: 'Terning med pile mod venstre og højre for Nudge',
    id: 'nudge',
    name: 'Nudge',
    src: nudgeDie,
  },
  reroll: {
    alt: 'Terning omsluttet af en cirkelpil for Reroll',
    id: 'reroll',
    name: 'Reroll',
    src: rerollDie,
  },
};

export const RESOURCE_LAB_ASSETS = Object.values(RESOURCE_ASSETS);

export function resourceAssetIdForTreasure(key: string): ResourceAssetId | null {
  if (key === 'maxhp') return 'life';
  if (key === 'gold') return 'gold';
  if (key === 'nudge') return 'nudge';
  return null;
}
