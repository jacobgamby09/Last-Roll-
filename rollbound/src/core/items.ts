// Item-kataloget — BALANCE-DATA på linje med config.ts (guideline 10).
// Ét item = navn + slot + tier + effects; al item-adfærd er datadrevet.
// Batch B (2026-09-02): fuldt roster, 10 pr. slot — godkendt i GDD.md-
// changeloggen. Hvert item har ÉN tydelig identitet; nogle er rene
// stat-varianter (bevidst), effekterne bærer resten.

import type { CombatMods, EquipmentId, EquipmentKind, EquipmentLoadout, ItemDef, ItemEffect } from './types';

export const ITEMS: Record<EquipmentId, ItemDef> = {
  // ---------- Våben: akserne er EV, bredde og effekt ----------
  'wood-club': {
    id: 'wood-club', slot: 'weapon', tier: 0, name: 'Trækølle', cost: 0,
    effects: [{ kind: 'dmgRange', min: 7, max: 12 }],
  },
  'rusted-sword': {
    id: 'rusted-sword', slot: 'weapon', tier: 1, name: 'Slebet klinge', cost: 25,
    effects: [{ kind: 'dmgRange', min: 11, max: 14 }], // pålidelig, smal
  },
  'wild-axe': {
    id: 'wild-axe', slot: 'weapon', tier: 1, name: 'Vildøkse', cost: 24,
    effects: [{ kind: 'dmgRange', min: 6, max: 20 }], // gambleren
  },
  'dagger': {
    id: 'dagger', slot: 'weapon', tier: 1, name: 'Dolk', cost: 22,
    effects: [{ kind: 'dmgRange', min: 8, max: 11 }, { kind: 'firstStrike', mult: 2 }],
  },
  'hunting-spear': {
    id: 'hunting-spear', slot: 'weapon', tier: 1, name: 'Jagtspyd', cost: 20,
    effects: [{ kind: 'dmgRange', min: 9, max: 16 }], // bred budget-økse
  },
  'twin-daggers': {
    id: 'twin-daggers', slot: 'weapon', tier: 2, name: 'Tvillingedolke', cost: 32,
    effects: [{ kind: 'dmgRange', min: 5, max: 8 }, { kind: 'doubleHit' }], // armor bider dobbelt
  },
  'war-hammer': {
    id: 'war-hammer', slot: 'weapon', tier: 2, name: 'Krigshammer', cost: 34,
    effects: [{ kind: 'dmgRange', min: 11, max: 15 }, { kind: 'armorPen', amount: 'all' }],
  },
  'blood-blade': {
    id: 'blood-blade', slot: 'weapon', tier: 2, name: 'Blodklinge', cost: 33,
    effects: [{ kind: 'dmgRange', min: 10, max: 14 }, { kind: 'killHeal', amount: 4 }],
  },
  'executioner-axe': {
    id: 'executioner-axe', slot: 'weapon', tier: 2, name: 'Bøddeløkse', cost: 35,
    effects: [{ kind: 'dmgRange', min: 9, max: 19 }, { kind: 'executeBonus', threshold: 0.5, mult: 1.5 }],
  },
  'rune-blade': {
    id: 'rune-blade', slot: 'weapon', tier: 2, name: 'Runeklinge', cost: 38,
    effects: [{ kind: 'dmgRange', min: 13, max: 16 }], // top-tier pålidelighed
  },

  // ---------- Armor: armor vs. HP vs. triggers ----------
  'cloth-shirt': {
    id: 'cloth-shirt', slot: 'armor', tier: 0, name: 'Stoftunika', cost: 0,
    effects: [],
  },
  'worn-plate': {
    id: 'worn-plate', slot: 'armor', tier: 1, name: 'Jernplade', cost: 20,
    effects: [{ kind: 'armor', amount: 1 }],
  },
  'wanderer-coat': {
    id: 'wanderer-coat', slot: 'armor', tier: 1, name: 'Vandringskofte', cost: 18,
    effects: [{ kind: 'maxHp', amount: 14 }],
  },
  'camp-cloak': {
    id: 'camp-cloak', slot: 'armor', tier: 1, name: 'Lejrkappe', cost: 19,
    effects: [{ kind: 'maxHp', amount: 6 }, { kind: 'campHealBonus', amount: 8 }],
  },
  'riveted-harness': {
    id: 'riveted-harness', slot: 'armor', tier: 2, name: 'Nitteharnisk', cost: 30,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'maxHp', amount: 8 }],
  },
  'thorn-mail': {
    id: 'thorn-mail', slot: 'armor', tier: 2, name: 'Tornebrynje', cost: 30,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'thorns', amount: 1 }],
  },
  'shield-vest': {
    id: 'shield-vest', slot: 'armor', tier: 2, name: 'Skjoldvest', cost: 34,
    effects: [{ kind: 'armor', amount: 2 }],
  },
  'duelist-jacket': {
    id: 'duelist-jacket', slot: 'armor', tier: 2, name: 'Duelistvams', cost: 32,
    effects: [{ kind: 'maxHp', amount: 4 }, { kind: 'firstHitBlock' }], // anti-burst
  },
  'blood-plate': {
    id: 'blood-plate', slot: 'armor', tier: 2, name: 'Blodpanser', cost: 30,
    effects: [{ kind: 'maxHp', amount: 8 }, { kind: 'killHeal', amount: 2 }],
  },
  'sacrifice-plate': {
    id: 'sacrifice-plate', slot: 'armor', tier: 2, name: 'Ofringsplade', cost: 26,
    effects: [{ kind: 'armor', amount: 2 }, { kind: 'maxHp', amount: -10 }], // glaskanon-forsvar
  },

  // ---------- Boots: boardet, terningen eller økonomien ----------
  'worn-sandals': {
    id: 'worn-sandals', slot: 'boots', tier: 0, name: 'Slidte sandaler', cost: 0,
    effects: [],
  },
  'trail-boots': {
    id: 'trail-boots', slot: 'boots', tier: 1, name: 'Stivinderstøvler', cost: 18,
    effects: [{ kind: 'bootsCharges', count: 1, rechargeAtCamp: true }], // boots-differentieringen
  },
  'heavy-greaves': {
    id: 'heavy-greaves', slot: 'boots', tier: 1, name: 'Tunge grever', cost: 20,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'dieTransform', from: 6, to: 5 }],
  },
  'light-runners': {
    id: 'light-runners', slot: 'boots', tier: 1, name: 'Letløbere', cost: 20,
    effects: [{ kind: 'dieTransform', from: 1, to: 2 }],
  },
  'scout-boots': {
    id: 'scout-boots', slot: 'boots', tier: 1, name: 'Spejderstøvler', cost: 16,
    effects: [{ kind: 'visibility', amount: 2 }],
  },
  'goldthread-shoes': {
    id: 'goldthread-shoes', slot: 'boots', tier: 1, name: 'Guldtrådssko', cost: 18,
    effects: [{ kind: 'goldBonus', amount: 3 }],
  },
  'elven-boots': {
    id: 'elven-boots', slot: 'boots', tier: 2, name: 'Elverstøvler', cost: 28,
    effects: [{ kind: 'freeRerollOn1' }],
  },
  'pilgrim-shoes': {
    id: 'pilgrim-shoes', slot: 'boots', tier: 2, name: 'Pilgrimssko', cost: 30,
    effects: [{ kind: 'campNudge', amount: 1 }],
  },
  'shadow-shoes': {
    id: 'shadow-shoes', slot: 'boots', tier: 2, name: 'Skyggesko', cost: 26,
    effects: [{ kind: 'trapImmune' }],
  },
  'iron-shod': {
    id: 'iron-shod', slot: 'boots', tier: 2, name: 'Jernskoede', cost: 26,
    effects: [{ kind: 'bootsCharges', count: 2, rechargeAtCamp: false }], // burst-udgaven
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

function loadoutIds(loadout: EquipmentLoadout): EquipmentId[] {
  return [loadout.weapon, loadout.armor, loadout.boots];
}

// Kamp-modifiers fra hele loadoutet — sendes ind i simulateFight
export function combatModsFor(loadout: EquipmentLoadout): CombatMods {
  const mods: CombatMods = {};
  for (const id of loadoutIds(loadout)) {
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
  for (const id of loadoutIds(loadout)) {
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
