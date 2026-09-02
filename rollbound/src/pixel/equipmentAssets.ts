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

// Kun katalogførte id'er og v1-filer registreres; øvrige filer ændrer ikke mapping.
const ADDITIONAL_ART = {
  "wild-axe": "En rå økse med ujævnt jernhoved",
  "dagger": "En let dolk med kort spids klinge",
  "hunting-spear": "Et langt jagtspyd med bladformet spids",
  "twin-daggers": "To krydsede små dolke",
  "war-hammer": "En tung krigshammer med massivt jernhoved",
  "blood-blade": "En krum klinge med blodrøde detaljer",
  "executioner-axe": "En bred halvmåneformet bøddeløkse",
  "rune-blade": "En lys klinge med cyan runeindlæg",
  "wanderer-coat": "En slidstærk rejsekofte",
  "camp-cloak": "En grøn kappe til lejrlivet",
  "riveted-harness": "Et læderharnisk med jernnitter",
  "thorn-mail": "En brynje med tydelige udadvendte pigge",
  "shield-vest": "En bred og tung panservest",
  "duelist-jacket": "En let elegant duelistvams",
  "blood-plate": "En brystplade med blodrøde detaljer",
  "sacrifice-plate": "En lys ceremoniel brystplade med ildevarslende detaljer",
  "heavy-greaves": "Et par klodsede jerngrever",
  "light-runners": "Et par lette sko med vingede detaljer",
  "scout-boots": "Et par robuste spejderstøvler",
  "goldthread-shoes": "Et par sko med gyldne syninger",
  "elven-boots": "Et par elegante grønne elverstøvler",
  "pilgrim-shoes": "Et par slidte pilgrimssko med hellige detaljer",
  "shadow-shoes": "Et par mørke sko med magenta kanter",
  "iron-shod": "Et par jernbeslåede støvler"
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
