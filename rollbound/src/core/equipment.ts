// Equipment: slot-erstatning oven på item-kataloget (items.ts).
// Numeriske stats swappes som DELTAS (ny minus gammel), så heroens felter
// forbliver ejede og level-bonusser urørte; behavioral effects (firstStrike,
// thorns, …) slås op fra loadoutet ved kamp/board-tid.

import { ITEMS, itemEffectText, itemStats } from './items';
import type { EquipmentId, EquipmentKind, Hero, ItemDef } from './types';

export const EQUIPMENT_DEFS: Record<EquipmentId, ItemDef> = ITEMS;

export function equippedIdForKind(hero: Hero, kind: EquipmentKind): EquipmentId {
  return hero.loadout[kind];
}

export function availableNudges(hero: Hero): number {
  return hero.nudges + hero.bootsNudgeCharges;
}

export function equipmentEffectText(itemId: EquipmentId): string {
  return itemEffectText(itemId);
}

export function equipItem(hero: Hero, itemId: EquipmentId) {
  const next = ITEMS[itemId];
  const currentId = equippedIdForKind(hero, next.slot);
  const oldStats = itemStats(ITEMS[currentId]);
  const newStats = itemStats(next);

  hero.dmgMin += newStats.dmgMin - oldStats.dmgMin;
  hero.dmgMax += newStats.dmgMax - oldStats.dmgMax;
  hero.armor += newStats.armor - oldStats.armor;

  const maxHpDelta = newStats.maxHp - oldStats.maxHp;
  if (maxHpDelta !== 0) {
    hero.maxHp += maxHpDelta;
    if (maxHpDelta > 0) hero.hp += maxHpDelta;
    else hero.hp = Math.min(hero.hp, hero.maxHp);
  }

  if (next.slot === 'boots') hero.bootsNudgeCharges = newStats.bootsCharges;
  if (next.slot === 'weapon') hero.loadout.weapon = itemId as Hero['loadout']['weapon'];
  if (next.slot === 'armor') hero.loadout.armor = itemId as Hero['loadout']['armor'];
  if (next.slot === 'boots') hero.loadout.boots = itemId as Hero['loadout']['boots'];
}

export function ownsEquipment(hero: Hero, itemId: EquipmentId): boolean {
  return equippedIdForKind(hero, ITEMS[itemId].slot) === itemId;
}
