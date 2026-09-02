import type { ArmorVisualId, BootsVisualId, EquipmentKind as CoreEquipmentKind, WeaponVisualId } from '../core/types';
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

// Partial: batch B udvidede kataloget til 30 items; ikoner produceres i
// batches efter equipment-asset-kontrakten. Manglende id'er falder tilbage
// til slot-placeholder i EquipmentIcon.
export const EQUIPMENT_ASSETS: Partial<Record<EquipmentAssetId, EquipmentAsset>> = {
  'wood-club': {
    alt: 'En simpel trækølle lavet af en knudret gren',
    id: 'wood-club',
    kind: 'weapon',
    name: 'Trækølle',
    src: woodClub,
    tier: 'starter',
  },
  'rusted-sword': {
    alt: 'Slidt jernsværd med lædergreb',
    id: 'rusted-sword',
    kind: 'weapon',
    name: 'Slebet klinge',
    src: rustedSword,
    tier: 'upgrade',
  },
  'cloth-shirt': {
    alt: 'En enkel og flosset stoftunika',
    id: 'cloth-shirt',
    kind: 'armor',
    name: 'Stoftunika',
    src: clothShirt,
    tier: 'starter',
  },
  'worn-plate': {
    alt: 'Slidt jernbrystplade med cyan kanter',
    id: 'worn-plate',
    kind: 'armor',
    name: 'Jernplade',
    src: wornPlate,
    tier: 'upgrade',
  },
  'worn-sandals': {
    alt: 'Et par enkle og slidte lædersandaler',
    id: 'worn-sandals',
    kind: 'boots',
    name: 'Slidte sandaler',
    src: wornSandals,
    tier: 'starter',
  },
  'trail-boots': {
    alt: 'Robuste rejsestøvler med grønne syninger',
    id: 'trail-boots',
    kind: 'boots',
    name: 'Stivinderstøvler',
    src: trailBoots,
    tier: 'upgrade',
  },
};

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
