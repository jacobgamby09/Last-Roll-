// Item-kataloget — BALANCE-DATA på linje med config.ts (guideline 10).
// Ét item = navn + slot + tier + effects; al item-adfærd er datadrevet.
// Batch B (2026-09-02): fuldt roster, 10 pr. slot — godkendt i GDD.md-
// changeloggen. Hvert item har ÉN tydelig identitet; nogle er rene
// stat-varianter (bevidst), effekterne bærer resten.

import type { CombatMods, ConsumableDef, ConsumableId, EquipmentId, EquipmentKind, EquipmentLoadout, ItemDef, ItemEffect } from './types';

export const ITEMS: Record<EquipmentId, ItemDef> = {
  // ---------- Våben: akserne er EV, bredde og effekt ----------
  'wood-club': {
    id: 'wood-club', slot: 'weapon', tier: 0, name: 'Wooden Club', cost: 0,
    effects: [{ kind: 'dmgRange', min: 7, max: 12 }],
  },
  'rusted-sword': {
    id: 'rusted-sword', slot: 'weapon', tier: 1, name: 'Honed Blade', cost: 25,
    effects: [{ kind: 'dmgRange', min: 11, max: 14 }], // pålidelig, smal
  },
  'wild-axe': {
    id: 'wild-axe', slot: 'weapon', tier: 1, name: 'Wild Axe', cost: 24,
    effects: [{ kind: 'dmgRange', min: 6, max: 20 }], // gambleren
  },
  'dagger': {
    id: 'dagger', slot: 'weapon', tier: 1, name: 'Dagger', cost: 22,
    effects: [{ kind: 'dmgRange', min: 8, max: 11 }, { kind: 'firstStrike', mult: 2 }],
  },
  'hunting-spear': {
    id: 'hunting-spear', slot: 'weapon', tier: 1, name: 'Hunting Spear', cost: 20,
    effects: [{ kind: 'dmgRange', min: 9, max: 16 }], // bred budget-økse
  },
  'twin-daggers': {
    id: 'twin-daggers', slot: 'weapon', tier: 2, name: 'Twin Daggers', cost: 32,
    effects: [{ kind: 'dmgRange', min: 5, max: 8 }, { kind: 'doubleHit' }], // armor bider dobbelt
  },
  'war-hammer': {
    id: 'war-hammer', slot: 'weapon', tier: 2, name: 'War Hammer', cost: 34,
    effects: [{ kind: 'dmgRange', min: 11, max: 15 }, { kind: 'armorPen', amount: 'all' }],
  },
  'blood-blade': {
    id: 'blood-blade', slot: 'weapon', tier: 2, name: 'Blood Blade', cost: 33,
    effects: [{ kind: 'dmgRange', min: 10, max: 14 }, { kind: 'killHeal', amount: 4 }],
  },
  'executioner-axe': {
    id: 'executioner-axe', slot: 'weapon', tier: 2, name: "Executioner's Axe", cost: 35,
    effects: [{ kind: 'dmgRange', min: 9, max: 19 }, { kind: 'executeBonus', threshold: 0.5, mult: 1.5 }],
  },
  'rune-blade': {
    id: 'rune-blade', slot: 'weapon', tier: 2, name: 'Rune Blade', cost: 38,
    effects: [{ kind: 'dmgRange', min: 13, max: 16 }], // top-tier pålidelighed
  },

  // ---------- Armor: armor vs. HP vs. triggers ----------
  'cloth-shirt': {
    id: 'cloth-shirt', slot: 'armor', tier: 0, name: 'Cloth Tunic', cost: 0,
    effects: [],
  },
  'worn-plate': {
    id: 'worn-plate', slot: 'armor', tier: 1, name: 'Iron Plate', cost: 20,
    effects: [{ kind: 'armor', amount: 1 }],
  },
  'wanderer-coat': {
    id: 'wanderer-coat', slot: 'armor', tier: 1, name: "Wanderer's Coat", cost: 18,
    effects: [{ kind: 'maxHp', amount: 14 }],
  },
  'camp-cloak': {
    id: 'camp-cloak', slot: 'armor', tier: 1, name: 'Camp Cloak', cost: 19,
    effects: [{ kind: 'maxHp', amount: 6 }, { kind: 'campHealBonus', amount: 8 }],
  },
  'riveted-harness': {
    id: 'riveted-harness', slot: 'armor', tier: 2, name: 'Riveted Harness', cost: 30,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'maxHp', amount: 8 }],
  },
  'thorn-mail': {
    id: 'thorn-mail', slot: 'armor', tier: 2, name: 'Thorn Mail', cost: 30,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'thorns', amount: 1 }],
  },
  'shield-vest': {
    id: 'shield-vest', slot: 'armor', tier: 2, name: 'Shield Vest', cost: 34,
    effects: [{ kind: 'armor', amount: 2 }],
  },
  'duelist-jacket': {
    id: 'duelist-jacket', slot: 'armor', tier: 2, name: "Duelist's Jacket", cost: 32,
    effects: [{ kind: 'maxHp', amount: 4 }, { kind: 'firstHitBlock' }], // anti-burst
  },
  'blood-plate': {
    id: 'blood-plate', slot: 'armor', tier: 2, name: 'Blood Plate', cost: 30,
    effects: [{ kind: 'maxHp', amount: 8 }, { kind: 'killHeal', amount: 2 }],
  },
  'sacrifice-plate': {
    id: 'sacrifice-plate', slot: 'armor', tier: 2, name: 'Sacrifice Plate', cost: 26,
    effects: [{ kind: 'armor', amount: 2 }, { kind: 'maxHp', amount: -10 }], // glaskanon-forsvar
  },

  // ---------- Boots: boardet, terningen eller økonomien ----------
  'worn-sandals': {
    id: 'worn-sandals', slot: 'boots', tier: 0, name: 'Worn Sandals', cost: 0,
    effects: [],
  },
  'trail-boots': {
    id: 'trail-boots', slot: 'boots', tier: 1, name: 'Trail Boots', cost: 18,
    effects: [{ kind: 'bootsCharges', count: 1, rechargeAtCamp: true }], // boots-differentieringen
  },
  'heavy-greaves': {
    id: 'heavy-greaves', slot: 'boots', tier: 1, name: 'Heavy Greaves', cost: 20,
    effects: [{ kind: 'armor', amount: 1 }, { kind: 'dieTransform', from: 6, to: 5 }],
  },
  'light-runners': {
    id: 'light-runners', slot: 'boots', tier: 1, name: 'Light Runners', cost: 20,
    effects: [{ kind: 'dieTransform', from: 1, to: 2 }],
  },
  'scout-boots': {
    id: 'scout-boots', slot: 'boots', tier: 1, name: 'Scout Boots', cost: 16,
    effects: [{ kind: 'visibility', amount: 2 }],
  },
  'goldthread-shoes': {
    id: 'goldthread-shoes', slot: 'boots', tier: 1, name: 'Goldthread Shoes', cost: 18,
    effects: [{ kind: 'goldBonus', amount: 3 }],
  },
  'elven-boots': {
    id: 'elven-boots', slot: 'boots', tier: 2, name: 'Elven Boots', cost: 28,
    effects: [{ kind: 'freeRerollOn1' }],
  },
  'pilgrim-shoes': {
    id: 'pilgrim-shoes', slot: 'boots', tier: 2, name: 'Pilgrim Shoes', cost: 30,
    effects: [{ kind: 'campNudge', amount: 1 }],
  },
  'shadow-shoes': {
    id: 'shadow-shoes', slot: 'boots', tier: 2, name: 'Shadow Shoes', cost: 26,
    effects: [{ kind: 'trapImmune' }],
  },
  'iron-shod': {
    id: 'iron-shod', slot: 'boots', tier: 2, name: 'Iron-Shod Boots', cost: 26,
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
  // Sentence case (readability pass): stat abbreviations (DMG/ARM/HP) stay caps
  for (const e of def.effects) {
    switch (e.kind) {
      case 'dmgRange': parts.push(`DMG ${e.min}-${e.max}`); break;
      case 'armor': parts.push(`+${e.amount} ARM`); break;
      case 'maxHp': parts.push(e.amount >= 0 ? `+${e.amount} max HP` : `${e.amount} max HP`); break;
      case 'armorPen': parts.push(e.amount === 'all' ? 'Ignores armor' : `Ignores ${e.amount} armor`); break;
      case 'firstStrike': parts.push(`First strike ×${e.mult}`); break;
      case 'doubleHit': parts.push('Two strikes per turn'); break;
      case 'executeBonus': parts.push(`×${e.mult} below ${Math.round(e.threshold * 100)}% HP`); break;
      case 'killHeal': parts.push(`+${e.amount} HP per kill`); break;
      case 'thorns': parts.push(`${e.amount} thorns per hit taken`); break;
      case 'firstHitBlock': parts.push('Blocks the first attack'); break;
      case 'bootsCharges': parts.push(`${e.count} free nudge${e.count > 1 ? 's' : ''}${e.rechargeAtCamp ? ' · recharges at Camp' : ''}`); break;
      case 'dieTransform': parts.push(`${e.from} counts as ${e.to}`); break;
      case 'visibility': parts.push(`+${e.amount} tiles visibility`); break;
      case 'campHealBonus': parts.push(`Camps heal +${e.amount}`); break;
      case 'campNudge': parts.push(`Camps grant +${e.amount} nudge`); break;
      case 'goldBonus': parts.push(`+${e.amount} per gold gain`); break;
      case 'trapImmune': parts.push('Immune to traps'); break;
      case 'freeRerollOn1': parts.push('Free reroll on a 1'); break;
    }
  }
  return parts.length > 0 ? parts.join(' · ') : 'No bonus';
}

export function itemsBySlot(slot: EquipmentKind): ItemDef[] {
  return Object.values(ITEMS).filter(def => def.slot === slot);
}

// ---------- Consumables (batch C) — samme status: balance-data ----------

export const CONSUMABLES: Record<ConsumableId, ConsumableDef> = {
  // Fleksibilitets-præmie: shop-urten (8g/+15, bruges NU) er bedste HP/guld;
  // eliksirer healer mere pr. flaske men koster mere pr. HP, fordi de kan
  // times frit (ingen overheal-spild) — se GDD-changelog 2026-09-02.
  'elixir': { id: 'elixir', tier: 1, name: 'Healing Elixir', cost: 12, effect: { kind: 'heal', amount: 20 } },
  'grand-elixir': { id: 'grand-elixir', tier: 2, name: 'Grand Elixir', cost: 20, effect: { kind: 'heal', amount: 40 } },
  'bomb': { id: 'bomb', tier: 1, name: 'Bomb', cost: 9, effect: { kind: 'bomb', damage: 12 } },
  'thunder-flask': { id: 'thunder-flask', tier: 2, name: 'Thunder Flask', cost: 15, effect: { kind: 'bomb', damage: 20 } },
  'smoke-bomb': { id: 'smoke-bomb', tier: 1, name: 'Smoke Bomb', cost: 12, effect: { kind: 'flee' } },
  'whetstone': { id: 'whetstone', tier: 2, name: 'Whetstone', cost: 14, effect: { kind: 'itemBuff', slot: 'weapon', dmg: 1 } },
  'armor-solder': { id: 'armor-solder', tier: 2, name: 'Armor Solder', cost: 14, effect: { kind: 'itemBuff', slot: 'armor', armor: 1 } },
  'wool-lining': { id: 'wool-lining', tier: 1, name: 'Wool Lining', cost: 9, effect: { kind: 'itemBuff', slot: 'armor', maxHp: 8 } },
  'fate-stone': { id: 'fate-stone', tier: 1, name: 'Fate Stone', cost: 10, effect: { kind: 'grant', nudges: 1, rerolls: 1 } },
  'gold-pouch': { id: 'gold-pouch', tier: 1, name: 'Gold Pouch', cost: 0, effect: { kind: 'gold', amount: 15 } }, // sælges ikke (arbitrage)
  'fate-die': { id: 'fate-die', tier: 1, name: 'Fate Die', cost: 10, effect: { kind: 'twinRoll' } },
  'teleport-scroll': { id: 'teleport-scroll', tier: 2, name: 'Teleport Scroll', cost: 14, effect: { kind: 'teleport' } },
};

// Bruges FØR en kamp (i pre-combat-beatet) frem for i idle
export function isPreCombatConsumable(id: ConsumableId): boolean {
  const kind = CONSUMABLES[id].effect.kind;
  return kind === 'bomb' || kind === 'flee';
}

const SLOT_LABEL: Record<EquipmentKind, string> = { weapon: 'your weapon', armor: 'your armor', boots: 'your boots' };

export function consumableEffectText(id: ConsumableId): string {
  const e = CONSUMABLES[id].effect;
  switch (e.kind) {
    case 'heal': return `+${e.amount} HP`;
    case 'bomb': return `${e.damage} damage before the fight`;
    case 'flee': return 'Skip the fight (not the boss)';
    case 'itemBuff': {
      const parts: string[] = [];
      if (e.dmg) parts.push(`+${e.dmg} DMG`);
      if (e.armor) parts.push(`+${e.armor} ARM`);
      if (e.maxHp) parts.push(`+${e.maxHp} max HP`);
      return `${parts.join(' & ')} on ${SLOT_LABEL[e.slot]} (lost when replaced)`;
    }
    case 'grant': return `+${e.nudges} nudge & +${e.rerolls} reroll`;
    case 'gold': return `+${e.amount} gold`;
    case 'twinRoll': return 'Next roll: roll two, pick one';
    case 'teleport': return 'Move 1-6 tiles of your choice';
  }
}
