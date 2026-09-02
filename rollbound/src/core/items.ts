// Item-kataloget — BALANCE-DATA på linje med config.ts (guideline 10).
// Ét item = navn + slot + tier + effects; al item-adfærd er datadrevet.
// Slice A: de seks eksisterende items porteret til den nye model —
// adfærden er uændret (sim-tal verificeret identiske). Batch B udvider
// kataloget til 10 pr. slot (godkendt roster, se GDD.md-changeloggen).

import type { CombatMods, EquipmentId, EquipmentKind, EquipmentLoadout, ItemDef, ItemEffect } from './types';

export const ITEMS: Record<EquipmentId, ItemDef> = {
  'wood-club': {
    id: 'wood-club', slot: 'weapon', tier: 0, name: 'Trækølle', cost: 0,
    effects: [{ kind: 'dmgRange', min: 7, max: 12 }],
  },
  'rusted-sword': {
    id: 'rusted-sword', slot: 'weapon', tier: 1, name: 'Slebet klinge', cost: 25,
    effects: [{ kind: 'dmgRange', min: 10, max: 15 }],
  },
  'cloth-shirt': {
    id: 'cloth-shirt', slot: 'armor', tier: 0, name: 'Stoftunika', cost: 0,
    effects: [],
  },
  'worn-plate': {
    id: 'worn-plate', slot: 'armor', tier: 1, name: 'Jernplade', cost: 20,
    effects: [{ kind: 'armor', amount: 1 }],
  },
  'worn-sandals': {
    id: 'worn-sandals', slot: 'boots', tier: 0, name: 'Slidte sandaler', cost: 0,
    effects: [],
  },
  'trail-boots': {
    id: 'trail-boots', slot: 'boots', tier: 1, name: 'Stivinderstøvler', cost: 18,
    effects: [{ kind: 'bootsCharges', count: 1, rechargeAtCamp: false }],
  },
};

// Numeriske stat-bidrag fra et item (bruges til delta-swaps ved equip)
export interface ItemStats {
  dmgMin: number;
  dmgMax: number;
  armor: number;
  maxHp: number;
  bootsCharges: number;
  rechargeAtCamp: boolean;
}

export function itemStats(def: ItemDef): ItemStats {
  const stats: ItemStats = { dmgMin: 0, dmgMax: 0, armor: 0, maxHp: 0, bootsCharges: 0, rechargeAtCamp: false };
  for (const e of def.effects) {
    if (e.kind === 'dmgRange') { stats.dmgMin += e.min; stats.dmgMax += e.max; }
    else if (e.kind === 'armor') stats.armor += e.amount;
    else if (e.kind === 'maxHp') stats.maxHp += e.amount;
    else if (e.kind === 'bootsCharges') { stats.bootsCharges += e.count; stats.rechargeAtCamp = e.rechargeAtCamp; }
  }
  return stats;
}

// Kamp-modifiers fra hele loadoutet — sendes ind i simulateFight
export function combatModsFor(loadout: EquipmentLoadout): CombatMods {
  const mods: CombatMods = {};
  for (const id of Object.values(loadout)) {
    for (const e of ITEMS[id].effects) {
      if (e.kind === 'firstStrike') mods.firstStrikeMult = e.mult;
      else if (e.kind === 'doubleHit') mods.doubleHit = true;
      else if (e.kind === 'executeBonus') mods.executeBonus = { threshold: e.threshold, mult: e.mult };
      else if (e.kind === 'armorPen') mods.armorPen = e.amount;
      else if (e.kind === 'killHeal') mods.killHeal = (mods.killHeal ?? 0) + e.amount;
      else if (e.kind === 'thorns') mods.thorns = (mods.thorns ?? 0) + e.amount;
      else if (e.kind === 'firstHitBlock') mods.firstHitBlock = true;
    }
  }
  return mods;
}

// Opslag på en enkelt board-effect på tværs af loadoutet
export function loadoutEffect<K extends ItemEffect['kind']>(
  loadout: EquipmentLoadout,
  kind: K,
): Extract<ItemEffect, { kind: K }> | null {
  for (const id of Object.values(loadout)) {
    for (const e of ITEMS[id].effects) {
      if (e.kind === kind) return e as Extract<ItemEffect, { kind: K }>;
    }
  }
  return null;
}

// Menneskelæsbar effekt-tekst til shop/treasure/sammenligning
export function itemEffectText(id: EquipmentId): string {
  const def = ITEMS[id];
  const parts: string[] = [];
  for (const e of def.effects) {
    switch (e.kind) {
      case 'dmgRange': parts.push(`DMG ${e.min}-${e.max}`); break;
      case 'armor': parts.push(`+${e.amount} ARM`); break;
      case 'maxHp': parts.push(e.amount >= 0 ? `+${e.amount} MAX HP` : `${e.amount} MAX HP`); break;
      case 'armorPen': parts.push(e.amount === 'all' ? 'IGNORERER ARMOR' : `IGNORERER ${e.amount} ARMOR`); break;
      case 'firstStrike': parts.push(`FØRSTE HUG ×${e.mult}`); break;
      case 'doubleHit': parts.push('TO HUG PR. TUR'); break;
      case 'executeBonus': parts.push(`×${e.mult} UNDER ${Math.round(e.threshold * 100)}% HP`); break;
      case 'killHeal': parts.push(`+${e.amount} HP PR. KILL`); break;
      case 'thorns': parts.push(`${e.amount} REFLEKS PR. HUG`); break;
      case 'firstHitBlock': parts.push('BLOKERER FØRSTE ANGREB'); break;
      case 'bootsCharges': parts.push(`${e.count} GRATIS NUDGE${e.rechargeAtCamp ? ' · GENOPLADES VED CAMP' : ''}`); break;
      case 'dieTransform': parts.push(`${e.from} TÆLLER SOM ${e.to}`); break;
      case 'visibility': parts.push(`+${e.amount} FELTER SYN`); break;
      case 'campHealBonus': parts.push(`CAMPS HELER +${e.amount}`); break;
      case 'campNudge': parts.push(`CAMPS GIVER +${e.amount} NUDGE`); break;
      case 'goldBonus': parts.push(`+${e.amount} PR. GULD-GEVINST`); break;
      case 'trapImmune': parts.push('IMMUN MOD FÆLDER'); break;
      case 'freeRerollOn1': parts.push('GRATIS REROLL PÅ 1'); break;
    }
  }
  return parts.length > 0 ? parts.join(' · ') : 'INGEN BONUS';
}

export function itemsBySlot(slot: EquipmentKind): ItemDef[] {
  return Object.values(ITEMS).filter(def => def.slot === slot);
}
