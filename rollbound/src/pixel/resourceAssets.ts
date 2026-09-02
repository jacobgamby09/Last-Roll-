import armorShield from '../assets/pixel/resources/armor-shield-v1.png';
import damageSword from '../assets/pixel/resources/damage-sword-v1.png';
import goldCoins from '../assets/pixel/resources/gold-coins-v1.png';
import lifeHeart from '../assets/pixel/resources/life-heart-v1.png';
import nudgeDie from '../assets/pixel/resources/nudge-die-v1.png';
import rerollDie from '../assets/pixel/resources/reroll-die-v1.png';
import xpEssence from '../assets/pixel/resources/xp-essence-v1.png';

export type ResourceAssetId = 'life' | 'xp' | 'gold' | 'nudge' | 'reroll' | 'damage' | 'armor';

export interface ResourceAsset {
  alt: string;
  id: ResourceAssetId;
  name: string;
  src: string;
}

export const RESOURCE_ASSETS: Record<ResourceAssetId, ResourceAsset> = {
  damage: {
    alt: 'Red sword and impact spark for damage',
    id: 'damage',
    name: 'Damage',
    src: damageSword,
  },
  armor: {
    alt: 'Cyan shield for armor',
    id: 'armor',
    name: 'Armor',
    src: armorShield,
  },
  life: {
    alt: 'Red pixel heart for life and healing',
    id: 'life',
    name: 'Life / HP',
    src: lifeHeart,
  },
  xp: {
    alt: 'Cyan-violet essence star for experience',
    id: 'xp',
    name: 'Experience / XP',
    src: xpEssence,
  },
  gold: {
    alt: 'Three stacked gold coins',
    id: 'gold',
    name: 'Gold',
    src: goldCoins,
  },
  nudge: {
    alt: 'Die with arrows pointing left and right for nudge',
    id: 'nudge',
    name: 'Nudge',
    src: nudgeDie,
  },
  reroll: {
    alt: 'Die wrapped in a circular arrow for reroll',
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
