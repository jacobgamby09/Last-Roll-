import { CONFIG } from './config';
import type { EquipmentId, EquipmentKind, Hero } from './types';

export interface EquipmentDefinition {
  id: EquipmentId;
  kind: EquipmentKind;
  name: string;
  effect: {
    armor: number;
    dmg: number;
    freeNudges: number;
  };
}

const ITEM_NAMES: Record<EquipmentId, string> = {
  'wood-club': 'Trækølle',
  'rusted-sword': 'Slebet klinge',
  'cloth-shirt': 'Stoftunika',
  'worn-plate': 'Jernplade',
  'worn-sandals': 'Slidte sandaler',
  'trail-boots': 'Stivinderstøvler',
};

function makeDefinition(id: EquipmentId): EquipmentDefinition {
  const effect = CONFIG.equipment.items[id];
  return { id, kind: effect.kind, name: ITEM_NAMES[id], effect };
}

export const EQUIPMENT_DEFS: Record<EquipmentId, EquipmentDefinition> = {
  'wood-club': makeDefinition('wood-club'),
  'rusted-sword': makeDefinition('rusted-sword'),
  'cloth-shirt': makeDefinition('cloth-shirt'),
  'worn-plate': makeDefinition('worn-plate'),
  'worn-sandals': makeDefinition('worn-sandals'),
  'trail-boots': makeDefinition('trail-boots'),
};

export function equippedIdForKind(hero: Hero, kind: EquipmentKind): EquipmentId {
  return hero.loadout[kind];
}

export function availableNudges(hero: Hero): number {
  return hero.nudges + hero.bootsNudgeCharges;
}

export function equipmentEffectText(itemId: EquipmentId): string {
  const effect = EQUIPMENT_DEFS[itemId].effect;
  const parts: string[] = [];
  if (effect.dmg) parts.push(`+${effect.dmg} DMG`);
  if (effect.armor) parts.push(`+${effect.armor} ARM`);
  if (effect.freeNudges) parts.push(`${effect.freeNudges} GRATIS NUDGE`);
  return parts.length > 0 ? parts.join(' · ') : 'INGEN BONUS';
}

export function equipItem(hero: Hero, itemId: EquipmentId) {
  const next = EQUIPMENT_DEFS[itemId];
  const currentId = equippedIdForKind(hero, next.kind);
  const current = EQUIPMENT_DEFS[currentId];

  // Shift-model: dmg-bonus forskyder hele rangen
  hero.dmgMin += next.effect.dmg - current.effect.dmg;
  hero.dmgMax += next.effect.dmg - current.effect.dmg;
  hero.armor += next.effect.armor - current.effect.armor;
  if (next.kind === 'boots') hero.bootsNudgeCharges = next.effect.freeNudges;
  if (next.kind === 'weapon') hero.loadout.weapon = itemId as Hero['loadout']['weapon'];
  if (next.kind === 'armor') hero.loadout.armor = itemId as Hero['loadout']['armor'];
  if (next.kind === 'boots') hero.loadout.boots = itemId as Hero['loadout']['boots'];
}

export function ownsEquipment(hero: Hero, itemId: EquipmentId): boolean {
  const item = EQUIPMENT_DEFS[itemId];
  return equippedIdForKind(hero, item.kind) === itemId;
}
