import type { ArmorVisualId, BootsVisualId, EquipmentKind as CoreEquipmentKind, WeaponVisualId } from '../core/types';
import { ITEMS } from '../core/items';
import clothShirt from '../assets/pixel/equipment/cloth-shirt-v1.png';
import rustedSword from '../assets/pixel/equipment/rusted-sword-v1.png';
import trailBoots from '../assets/pixel/equipment/trail-boots-v1.png';
import woodClub from '../assets/pixel/equipment/wood-club-v1.png';
import wornPlate from '../assets/pixel/equipment/worn-plate-v1.png';
import wornSandals from '../assets/pixel/equipment/worn-sandals-v1.png';

export type EquipmentKind = CoreEquipmentKind;
export type EquipmentTier = 'starter' | 'upgrade';
export type EquipmentAssetId = WeaponVisualId | ArmorVisualId | BootsVisualId;

export interface EquipmentAsset {
  alt: string;
  id: EquipmentAssetId;
  kind: EquipmentKind;
  name: string;
  src: string;
  tier: EquipmentTier;
}

// Partial bevarer den eksplicitte fallback ved fremtidige, endnu umappede items.
export const EQUIPMENT_ASSETS: Partial<Record<EquipmentAssetId, EquipmentAsset>> = {
  'wood-club': {
    alt: 'A simple wooden club made from a gnarled branch',
    id: 'wood-club',
    kind: 'weapon',
    name: 'Wooden Club',
    src: woodClub,
    tier: 'starter',
  },
  'rusted-sword': {
    alt: 'A worn iron sword with a leather grip',
    id: 'rusted-sword',
    kind: 'weapon',
    name: 'Honed Blade',
    src: rustedSword,
    tier: 'upgrade',
  },
  'cloth-shirt': {
    alt: 'A simple, frayed cloth tunic',
    id: 'cloth-shirt',
    kind: 'armor',
    name: 'Cloth Tunic',
    src: clothShirt,
    tier: 'starter',
  },
  'worn-plate': {
    alt: 'A worn iron breastplate with cyan edges',
    id: 'worn-plate',
    kind: 'armor',
    name: 'Iron Plate',
    src: wornPlate,
    tier: 'upgrade',
  },
  'worn-sandals': {
    alt: 'A pair of simple, worn leather sandals',
    id: 'worn-sandals',
    kind: 'boots',
    name: 'Worn Sandals',
    src: wornSandals,
    tier: 'starter',
  },
  'trail-boots': {
    alt: 'Sturdy travel boots with green stitching',
    id: 'trail-boots',
    kind: 'boots',
    name: 'Trail Boots',
    src: trailBoots,
    tier: 'upgrade',
  },
};

// Kun katalogførte id'er og v1-filer registreres; øvrige filer ændrer ikke mapping.
const ADDITIONAL_ART = {
  "wild-axe": "A crude axe with an uneven iron head",
  "dagger": "A light dagger with a short pointed blade",
  "hunting-spear": "A long hunting spear with a leaf-shaped tip",
  "twin-daggers": "Two crossed small daggers",
  "war-hammer": "A heavy war hammer with a massive iron head",
  "blood-blade": "A curved blade with blood-red details",
  "executioner-axe": "A broad crescent-shaped executioner's axe",
  "rune-blade": "A bright blade with cyan rune inlays",
  "wanderer-coat": "A hard-wearing traveler's coat",
  "camp-cloak": "A green cloak made for camp life",
  "riveted-harness": "A leather harness with iron rivets",
  "thorn-mail": "A mail shirt with pronounced outward spikes",
  "shield-vest": "A broad and heavy armored vest",
  "duelist-jacket": "A light, elegant duelist's jacket",
  "blood-plate": "A breastplate with blood-red details",
  "sacrifice-plate": "A pale ceremonial breastplate with ominous details",
  "heavy-greaves": "A pair of clunky iron greaves",
  "light-runners": "A pair of light shoes with winged details",
  "scout-boots": "A pair of sturdy scout boots",
  "goldthread-shoes": "A pair of shoes with golden stitching",
  "elven-boots": "A pair of elegant green elven boots",
  "pilgrim-shoes": "A pair of worn pilgrim shoes with holy details",
  "shadow-shoes": "A pair of dark shoes with magenta edges",
  "iron-shod": "A pair of iron-shod boots"
} as const satisfies Partial<Record<EquipmentAssetId, string>>;

const sources = import.meta.glob<string>('../assets/pixel/equipment/*-v1.png', {
  eager: true,
  import: 'default',
  query: '?url',
});

for (const id of Object.keys(ADDITIONAL_ART) as Array<keyof typeof ADDITIONAL_ART>) {
  const src = sources[`../assets/pixel/equipment/${id}-v1.png`];
  if (src) {
    const item = ITEMS[id];
    EQUIPMENT_ASSETS[id] = {
      id, src, alt: ADDITIONAL_ART[id], name: item.name, kind: item.slot, tier: 'upgrade',
    };
  }
}

export const EQUIPMENT_PAIRS = [
  { kind: 'weapon', starter: 'wood-club', upgrade: 'rusted-sword' },
  { kind: 'armor', starter: 'cloth-shirt', upgrade: 'worn-plate' },
  { kind: 'boots', starter: 'worn-sandals', upgrade: 'trail-boots' },
] as const satisfies ReadonlyArray<{
  kind: EquipmentKind;
  starter: EquipmentAssetId;
  upgrade: EquipmentAssetId;
}>;

export const EQUIPMENT_LAB_ASSETS = Object.values(EQUIPMENT_ASSETS).filter((a): a is EquipmentAsset => a !== undefined);

export function equipmentAssetIdForTreasure(key: string): EquipmentAssetId | null {
  if (key === 'weapon') return 'rusted-sword';
  if (key === 'armor') return 'worn-plate';
  if (key === 'boots') return 'trail-boots';
  return null;
}
