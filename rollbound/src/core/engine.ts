// Rollbound game engine — ren state machine, ingen UI.
// Alle actions går gennem reducer(); al RNG er seedet og bor i state,
// så et run kan reproduceres fra sit seed.

import { CONFIG, TREASURE_POOL } from './config';
import { EQUIPMENT_DEFS, equipItem, equipmentEffectText, ownsEquipment } from './equipment';
import { combatModsFor, CONSUMABLES, consumableEffectText, isPreCombatConsumable, ITEMS, itemEffectText as itemFx, itemStats, loadoutEffect } from './items';
import { cursor, type RngCursor } from './rng';
import { generateTrack } from './track';
import { enemyForTile, simulateFight } from './combat';
import type { ConsumableId, EquipmentId, EquipmentResumePhase, GameState, ItemDef, LevelPick, LogEntry, ShopOffer, TileType, TreasureItem } from './types';

export type Action =
  | { type: 'ROLL' }
  | { type: 'NUDGE'; dir: 1 | -1 }
  | { type: 'REROLL' }
  | { type: 'ACCEPT' }
  | { type: 'CHOOSE_ROLL'; index: 0 | 1 }
  | { type: 'TELEPORT_MOVE'; steps: number }
  | { type: 'USE_CONSUMABLE'; slot: number }
  | { type: 'FIGHT' }
  | { type: 'PICK_LEVELUP'; pick: LevelPick }
  | { type: 'PICK_TREASURE'; index: number }
  | { type: 'BUY'; index: number }
  | { type: 'EQUIP_OFFER' }
  | { type: 'KEEP_EQUIPMENT' }
  | { type: 'LEAVE_SHOP' }
  | { type: 'RESTART'; seed?: number };

export function newGame(seed: number): GameState {
  const rng = cursor(seed);
  const track = generateTrack(rng);
  return {
    seed,
    rngState: rng.state,
    track,
    pos: 0,
    hero: {
      hp: CONFIG.hero.hp,
      maxHp: CONFIG.hero.hp,
      dmgMin: CONFIG.hero.dmgMin,
      dmgMax: CONFIG.hero.dmgMax,
      armor: CONFIG.hero.armor,
      level: 1,
      xp: 0,
      gold: CONFIG.hero.gold,
      nudges: CONFIG.hero.nudges,
      bootsNudgeCharges: 0,
      rerolls: CONFIG.hero.rerolls,
      loadout: { ...CONFIG.equipment.starters },
      consumables: [],
      slotBuffs: {
        weapon: { dmg: 0, armor: 0, maxHp: 0 },
        armor: { dmg: 0, armor: 0, maxHp: 0 },
        boots: { dmg: 0, armor: 0, maxHp: 0 },
      },
    },
    phase: { t: 'idle' },
    pendingLevelUps: 0,
    rolls: 0,
    fights: 0,
    log: [{ text: `The run begins. Reach tile ${CONFIG.trackLength} with a build strong enough to slay the boss.`, kind: 'info' }],
    lastCombat: null,
    combatSeq: 0,
    twinRollArmed: false,
  };
}

export function xpToNext(level: number): number {
  const c = CONFIG.xpCurve;
  if (level - 1 < c.length) return c[level - 1];
  let v = c[c.length - 1];
  for (let l = c.length + 1; l <= level; l++) v = Math.round(v * CONFIG.xpCurveGrowth);
  return v;
}

export function rotationPick(level: number): LevelPick {
  return (['dmg', 'hp', 'armor'] as const)[(level - 2) % 3];
}

// Boots kan transformere terningen (fx 6 tæller som 5). Transformen sker
// PÅ rullet — terningen viser det transformerede tal.
export function applyDieTransform(roll: number, loadout: GameState['hero']['loadout']): number {
  const t = loadoutEffect(loadout, 'dieTransform');
  return t && roll === t.from ? t.to : roll;
}

// UI'ets forudsigelse af næste terningkast — SKAL bruges af al præsentation,
// så peek-kontrakten bor ét sted i core (testet i engine.test.ts).
export function peekRoll(s: GameState): number {
  return applyDieTransform(cursor(s.rngState).d6(), s.hero.loadout);
}

// Synlige felter forud, inkl. boots-bonus (Spejderstøvler)
export function visibleAhead(s: GameState): number {
  return CONFIG.visibility + (loadoutEffect(s.hero.loadout, 'visibility')?.amount ?? 0);
}

const PICK_LABEL: Record<LevelPick, string> = {
  dmg: `+${CONFIG.levelUp.dmg} Damage`,
  hp: `+${CONFIG.levelUp.hp} Max HP`,
  armor: `+${CONFIG.levelUp.armor} Armor & +${CONFIG.levelUp.armorHp} Max HP`,
};
export { PICK_LABEL };

function log(s: GameState, text: string, kind: LogEntry['kind'] = 'info') {
  s.log.push({ text, kind });
  if (s.log.length > 60) s.log.shift();
}

function heal(s: GameState, amount: number): number {
  const gained = Math.min(amount, s.hero.maxHp - s.hero.hp);
  s.hero.hp += gained;
  return gained;
}

function applyLevelPick(s: GameState, pick: LevelPick) {
  const lu = CONFIG.levelUp;
  if (pick === 'dmg') {
    // Shift-model: bonusser forskyder hele rangen; bredden ejes af våbnet
    s.hero.dmgMin += lu.dmg;
    s.hero.dmgMax += lu.dmg;
  }
  else if (pick === 'hp') {
    s.hero.maxHp += lu.hp;
    s.hero.hp += lu.hp;
  } else {
    s.hero.armor += lu.armor;
    s.hero.maxHp += lu.armorHp;
    s.hero.hp += lu.armorHp;
  }
}

// Guld-gevinster fra felter/skatte/drops respekterer goldBonus (Guldtrådssko)
function gainFieldGold(s: GameState, amount: number): number {
  const bonus = loadoutEffect(s.hero.loadout, 'goldBonus')?.amount ?? 0;
  const gained = amount + bonus;
  s.hero.gold += gained;
  return gained;
}

function applyImmediateTreasure(s: GameState, item: TreasureItem) {
  switch (item.key) {
    case 'maxhp': s.hero.maxHp += 10; s.hero.hp += 10; break;
    case 'nudge': s.hero.nudges += 1; break;
    case 'gold': gainFieldGold(s, 12); break;
    case 'consumable':
      if (item.consumableId) gainConsumable(s, item.consumableId);
      break;
    case 'weapon':
    case 'armor':
    case 'boots':
      break;
  }
}

// ---------- Loot-pools (batch B) ----------
// Kontrol-gradienten: Shop (købt) > Treasure (vælg 1 af 3) > Elite (garanteret
// gear, tilfældigt) > normal-drop (kun utility). Ejede items filtreres fra.

function tierWeight(pos: number, tier: number): number {
  const third = pos <= CONFIG.trackLength / 3 ? 0 : pos <= (2 * CONFIG.trackLength) / 3 ? 1 : 2;
  return tier === 1 ? [3, 2, 1][third] : [1, 2, 3][third];
}

function unownedGear(s: GameState): ItemDef[] {
  return Object.values(ITEMS).filter(def => def.tier > 0 && !ownsEquipment(s.hero, def.id));
}

// Vægtet træk UDEN tilbagelægning (muterer entries)
function drawWeighted<T>(rng: RngCursor, entries: { item: T; weight: number }[]): T | null {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  if (total <= 0 || entries.length === 0) return null;
  let r = rng.rand() * total;
  for (let i = 0; i < entries.length; i++) {
    r -= entries[i].weight;
    if (r < 0) return entries.splice(i, 1)[0].item;
  }
  return entries.pop()!.item;
}

function gearTreasure(def: ItemDef): TreasureItem {
  return { key: def.slot, name: def.name, desc: itemFx(def.id), equipmentId: def.id };
}

function consumableTreasure(id: ConsumableId): TreasureItem {
  return { key: 'consumable', name: CONSUMABLES[id].name, desc: consumableEffectText(id), consumableId: id };
}

function hasConsumableSlot(s: GameState): boolean {
  return s.hero.consumables.length < CONFIG.consumableSlots;
}

function gainConsumable(s: GameState, id: ConsumableId): boolean {
  if (!hasConsumableSlot(s)) return false;
  s.hero.consumables.push(id);
  return true;
}

// Pre-combat-beatet vises kun, hvis spilleren HAR noget at bruge i det
function hasPreCombatOption(s: GameState, tile: 'enemy' | 'elite' | 'boss'): boolean {
  return s.hero.consumables.some(id => {
    const kind = CONSUMABLES[id].effect.kind;
    return kind === 'bomb' || (kind === 'flee' && tile !== 'boss');
  });
}

function resumeAfterReward(s: GameState): EquipmentResumePhase {
  return s.pendingLevelUps > 0 ? { t: 'levelup' } : { t: 'idle' };
}

function offerEquipment(
  s: GameState,
  itemId: EquipmentId,
  source: 'treasure' | 'drop' | 'shop',
  resume: EquipmentResumePhase,
  cost = 0,
) {
  s.phase = { t: 'equipment', itemId, source, cost, resume };
}

function gainXp(s: GameState, xp: number) {
  s.hero.xp += xp;
  while (s.hero.xp >= xpToNext(s.hero.level)) {
    s.hero.xp -= xpToNext(s.hero.level);
    s.hero.level++;
    if (CONFIG.levelUpMode === 'rotation') {
      const pick = rotationPick(s.hero.level);
      applyLevelPick(s, pick);
      log(s, `Level ${s.hero.level}! ${PICK_LABEL[pick]}.`, 'good');
    } else {
      s.pendingLevelUps++;
    }
  }
}

function runCombat(s: GameState, rng: RngCursor, type: TileType, openingDamage = 0) {
  const enemy = enemyForTile(s.pos, type);
  const script = simulateFight(s.hero, enemy, rng, { ...combatModsFor(s.hero.loadout), openingDamage });
  s.lastCombat = script;
  s.combatSeq++;
  if (script.result.winner === 'enemy') {
    const enemyBlows = script.events.filter(e => e.actor === 'enemy').length;
    s.hero.hp = 0;
    s.phase = { t: 'over', won: false, cause: `Slain by ${enemy.name} on tile ${s.pos}` };
    log(s, `${enemy.name} cuts you down after ${enemyBlows} blows.`, 'bad');
    return;
  }
  const hpLoss = s.hero.hp - script.result.heroHpAfter;
  s.hero.hp = script.result.heroHpAfter;
  s.fights++;
  s.hero.gold += enemy.gold;
  log(
    s,
    `You defeat ${enemy.name} in ${script.result.turns} blows: −${hpLoss} HP, +${enemy.xp} XP, +${enemy.gold} gold.`,
    'combat',
  );
  const dropChance = type === 'elite' ? CONFIG.drops.elite : CONFIG.drops.normal;
  let equipmentDrop: EquipmentId | null = null;
  if (dropChance > 0 && rng.rand() < dropChance) {
    if (type === 'elite') {
      // Elites dropper garanteret GEAR (tier-vægtet); utility som nødfald
      const pool = unownedGear(s).map(def => ({ item: def, weight: tierWeight(s.pos, def.tier) }));
      const def = drawWeighted(rng, pool);
      if (def) {
        equipmentDrop = def.id;
        log(s, `${enemy.name} leaves ${def.name} behind. Consider the new gear.`, 'good');
      }
    }
    if (!equipmentDrop) {
      // Normale fjender (og gear-tørke): utility eller consumable (kræver frit slot)
      const wantConsumable = hasConsumableSlot(s) && rng.rand() < 0.5;
      const item = wantConsumable
        ? consumableTreasure(Object.values(CONSUMABLES)[rng.int(0, Object.values(CONSUMABLES).length - 1)].id)
        : TREASURE_POOL[Math.floor(rng.rand() * TREASURE_POOL.length)];
      applyImmediateTreasure(s, item);
      log(s, `${enemy.name} drops ${item.name} (${item.desc})!`, 'good');
    }
  }
  gainXp(s, enemy.xp);
  const resume = resumeAfterReward(s);
  if (equipmentDrop) offerEquipment(s, equipmentDrop, 'drop', resume);
  else s.phase = resume;
}

function bossFight(s: GameState, rng: RngCursor, openingDamage = 0) {
  const script = simulateFight(s.hero, CONFIG.boss, rng, { ...combatModsFor(s.hero.loadout), openingDamage });
  s.lastCombat = script;
  s.combatSeq++;
  if (script.result.winner === 'hero') {
    const hpLoss = s.hero.hp - script.result.heroHpAfter;
    s.hero.hp = script.result.heroHpAfter;
    log(s, `${CONFIG.boss.name} falls after ${script.result.turns} blows! You lost ${hpLoss} HP.`, 'good');
    s.phase = { t: 'over', won: true, cause: `Victory with ${s.hero.hp} HP to spare` };
  } else {
    s.hero.hp = 0;
    log(s, `${CONFIG.boss.name} was too strong. Your build needed more.`, 'bad');
    s.phase = { t: 'over', won: false, cause: 'Fell to the boss' };
  }
}

function resolveTile(s: GameState, rng: RngCursor) {
  const type = s.track[s.pos];
  switch (type) {
    case 'blank':
      log(s, 'Quiet road. Nothing happens.');
      s.phase = { t: 'idle' };
      break;
    case 'gold': {
      const gained = gainFieldGold(s, CONFIG.goldTile);
      log(s, `You find ${gained} gold.`, 'good');
      s.phase = { t: 'idle' };
      break;
    }
    case 'camp': {
      const healBonus = loadoutEffect(s.hero.loadout, 'campHealBonus')?.amount ?? 0;
      const gained = heal(s, CONFIG.camp.heal + healBonus);
      log(s, gained > 0 ? `The camp heals you +${gained} HP.` : 'The camp is cozy, but you were already at full HP.', 'good');
      // Board-hooks: boots-recharge og Pilgrimssko
      const boots = itemStats(ITEMS[s.hero.loadout.boots]);
      if (boots.rechargeAtCamp && s.hero.bootsNudgeCharges < boots.bootsCharges) {
        s.hero.bootsNudgeCharges = boots.bootsCharges;
        log(s, `${ITEMS[s.hero.loadout.boots].name} recharges.`, 'good');
      }
      const campNudge = loadoutEffect(s.hero.loadout, 'campNudge')?.amount ?? 0;
      if (campNudge > 0) {
        s.hero.nudges += campNudge;
        log(s, `${ITEMS[s.hero.loadout.boots].name} grant +${campNudge} nudge.`, 'good');
      }
      s.phase = { t: 'idle' };
      break;
    }
    case 'trap': {
      if (loadoutEffect(s.hero.loadout, 'trapImmune')) {
        log(s, `${ITEMS[s.hero.loadout.boots].name} carry you past the trap.`, 'good');
        s.phase = { t: 'idle' };
        break;
      }
      if (rng.rand() < 0.5) {
        s.hero.hp -= CONFIG.trap.hpLoss;
        log(s, `A trap! You take ${CONFIG.trap.hpLoss} damage.`, 'bad');
        if (s.hero.hp <= 0) {
          s.hero.hp = 0;
          s.phase = { t: 'over', won: false, cause: `Killed by a trap on tile ${s.pos}` };
          return;
        }
      } else {
        const lost = Math.min(CONFIG.trap.goldLoss, s.hero.gold);
        s.hero.gold -= lost;
        log(s, `A trap! You lose ${lost} gold.`, 'bad');
      }
      s.phase = { t: 'idle' };
      break;
    }
    case 'event': {
      if (rng.rand() < 0.5) {
        const gained = gainFieldGold(s, CONFIG.event.gold);
        log(s, `Fate smiles: +${gained} gold.`, 'good');
      } else {
        s.hero.hp -= CONFIG.event.hpLoss;
        log(s, `Fate bites: −${CONFIG.event.hpLoss} HP.`, 'bad');
        if (s.hero.hp <= 0) {
          s.hero.hp = 0;
          s.phase = { t: 'over', won: false, cause: `An event on tile ${s.pos} was the end` };
          return;
        }
      }
      s.phase = { t: 'idle' };
      break;
    }
    case 'treasure': {
      // Vælg 1 af 3: tier-vægtet gear + consumables (kræver frit slot) + utility
      const candidates = [
        ...unownedGear(s).map(def => ({ item: gearTreasure(def), weight: tierWeight(s.pos, def.tier) })),
        ...(hasConsumableSlot(s)
          ? Object.values(CONSUMABLES).map(def => ({ item: consumableTreasure(def.id), weight: 1 }))
          : []),
        ...TREASURE_POOL.map(item => ({ item, weight: 2 })),
      ];
      const options: TreasureItem[] = [];
      for (let i = 0; i < 3; i++) {
        const pick = drawWeighted(rng, candidates);
        if (pick) options.push(pick);
      }
      log(s, 'A treasure chest! Choose 1 of 3.');
      s.phase = { t: 'treasure', options };
      break;
    }
    case 'shop': {
      // 5 seedede slots — hvert slot 100 % tilfældigt: gear, consumable eller service.
      // Gear og consumables trækkes UDEN tilbagelægning (ingen dubletter i én shop).
      const gearPool = unownedGear(s).map(def => ({ item: def, weight: tierWeight(s.pos, def.tier) }));
      const consumablePool = Object.values(CONSUMABLES).filter(def => def.cost > 0);
      const offers: ShopOffer[] = [];
      for (let i = 0; i < 5; i++) {
        const category = rng.rand();
        if (category < 1 / 3) {
          const def = drawWeighted(rng, gearPool);
          if (def) {
            offers.push({ kind: 'gear', itemId: def.id, cost: def.cost, sold: false });
            continue;
          }
        } else if (category < 2 / 3 && consumablePool.length > 0) {
          const def = consumablePool.splice(rng.int(0, consumablePool.length - 1), 1)[0];
          offers.push({ kind: 'consumable', consumableId: def.id, cost: def.cost, sold: false });
          continue;
        }
        const service = (['heal', 'nudge', 'reroll'] as const)[rng.int(0, 2)];
        const cost = service === 'heal' ? CONFIG.shop.heal.cost : service === 'nudge' ? CONFIG.shop.nudge : CONFIG.shop.reroll;
        offers.push({ kind: 'service', service, cost, sold: false });
      }
      log(s, 'You enter the shop.');
      s.phase = { t: 'shop', offers };
      break;
    }
    case 'enemy':
    case 'elite':
      if (hasPreCombatOption(s, type)) {
        log(s, `${enemyForTile(s.pos, type).name} blocks the path. Prepare yourself.`);
        s.phase = { t: 'preCombat', tile: type, openingDamage: 0 };
      } else {
        runCombat(s, rng, type);
      }
      break;
    case 'boss':
      if (hasPreCombatOption(s, 'boss')) {
        log(s, `${CONFIG.boss.name} awaits. Prepare yourself.`);
        s.phase = { t: 'preCombat', tile: 'boss', openingDamage: 0 };
      } else {
        bossFight(s, rng);
      }
      break;
  }
}

function move(s: GameState, rng: RngCursor, steps: number) {
  s.pos = Math.min(s.pos + steps, CONFIG.trackLength);
  if (s.pos >= CONFIG.trackLength) {
    if (hasPreCombatOption(s, 'boss')) {
      log(s, `${CONFIG.boss.name} awaits. Prepare yourself.`);
      s.phase = { t: 'preCombat', tile: 'boss', openingDamage: 0 };
    } else {
      bossFight(s, rng);
    }
    return;
  }
  resolveTile(s, rng);
}

export function reducer(prev: GameState, action: Action): GameState {
  if (action.type === 'RESTART') return newGame(action.seed ?? Math.floor(Math.random() * 2 ** 31));

  const s: GameState = structuredClone(prev);
  const rng = cursor(s.rngState);

  switch (action.type) {
    case 'ROLL': {
      if (s.phase.t !== 'idle') break;
      s.rolls++;
      if (s.twinRollArmed) {
        // Skæbneterning: rul to, vælg én
        s.twinRollArmed = false;
        const rolls: [number, number] = [
          applyDieTransform(rng.d6(), s.hero.loadout),
          applyDieTransform(rng.d6(), s.hero.loadout),
        ];
        log(s, `Roll #${s.rolls}: the Fate Die shows 🎲 ${rolls[0]} and 🎲 ${rolls[1]} — pick one.`);
        s.phase = { t: 'chooseRoll', rolls };
        break;
      }
      const roll = applyDieTransform(rng.d6(), s.hero.loadout);
      log(s, `Roll #${s.rolls}: 🎲 ${roll}.`);
      s.phase = { t: 'rolled', roll, wasReroll: false };
      break;
    }
    case 'CHOOSE_ROLL': {
      if (s.phase.t !== 'chooseRoll') break;
      const roll = s.phase.rolls[action.index];
      log(s, `You pick ${roll}.`);
      s.phase = { t: 'rolled', roll, wasReroll: false };
      break;
    }
    case 'TELEPORT_MOVE': {
      if (s.phase.t !== 'teleport' || action.steps < 1 || action.steps > 6) break;
      log(s, `The Teleport Scroll carries you ${action.steps} tiles ahead.`);
      move(s, rng, action.steps);
      break;
    }
    case 'USE_CONSUMABLE': {
      const id = s.hero.consumables[action.slot];
      if (!id) break;
      const def = CONSUMABLES[id];
      const inIdle = s.phase.t === 'idle';
      const inPreCombat = s.phase.t === 'preCombat';
      if (isPreCombatConsumable(id)) {
        if (!inPreCombat) break;
        if (def.effect.kind === 'flee' && s.phase.t === 'preCombat' && s.phase.tile === 'boss') break;
        s.hero.consumables.splice(action.slot, 1);
        if (def.effect.kind === 'bomb' && s.phase.t === 'preCombat') {
          s.phase.openingDamage += def.effect.damage;
          log(s, `${def.name} is primed (${def.effect.damage} damage at the start of the fight).`, 'good');
        } else {
          log(s, `${def.name}! You slip past the fight — no XP, no spoils.`, 'info');
          s.phase = { t: 'idle' };
        }
        break;
      }
      if (!inIdle) break;
      s.hero.consumables.splice(action.slot, 1);
      switch (def.effect.kind) {
        case 'heal': {
          const gained = heal(s, def.effect.amount);
          log(s, `${def.name}: +${gained} HP.`, 'good');
          break;
        }
        case 'itemBuff': {
          // Buffen bindes til ITEMET i slottet: stats + slotBuffs (stakker frit).
          // equipItem trækker slottets buffs fra igen ved udskiftning.
          const e = def.effect;
          const buff = s.hero.slotBuffs[e.slot];
          if (e.dmg) {
            s.hero.dmgMin += e.dmg;
            s.hero.dmgMax += e.dmg;
            buff.dmg += e.dmg;
          }
          if (e.armor) {
            s.hero.armor += e.armor;
            buff.armor += e.armor;
          }
          if (e.maxHp) {
            s.hero.maxHp += e.maxHp;
            s.hero.hp += e.maxHp;
            buff.maxHp += e.maxHp;
          }
          log(s, `${def.name}: ${consumableEffectText(def.id)} — applied to ${ITEMS[s.hero.loadout[e.slot]].name}.`, 'good');
          break;
        }
        case 'grant':
          s.hero.nudges += def.effect.nudges;
          s.hero.rerolls += def.effect.rerolls;
          log(s, `${def.name}: +${def.effect.nudges} nudge & +${def.effect.rerolls} reroll.`, 'good');
          break;
        case 'gold':
          s.hero.gold += def.effect.amount;
          log(s, `${def.name}: +${def.effect.amount} gold.`, 'good');
          break;
        case 'twinRoll':
          s.twinRollArmed = true;
          log(s, `${def.name} armed: your next roll throws two dice.`, 'good');
          break;
        case 'teleport':
          log(s, `${def.name} glows — choose your destination.`, 'good');
          s.phase = { t: 'teleport' };
          break;
      }
      break;
    }
    case 'FIGHT': {
      if (s.phase.t !== 'preCombat') break;
      const { tile, openingDamage } = s.phase;
      if (tile === 'boss') bossFight(s, rng, openingDamage);
      else runCombat(s, rng, tile, openingDamage);
      break;
    }
    case 'ACCEPT': {
      if (s.phase.t !== 'rolled') break;
      const { roll } = s.phase;
      move(s, rng, roll);
      break;
    }
    case 'NUDGE': {
      if (s.phase.t !== 'rolled' || s.phase.wasReroll) break;
      const target = s.phase.roll + action.dir;
      if (s.hero.nudges + s.hero.bootsNudgeCharges <= 0 || target < 1 || target > 6) break;
      const paidByBoots = s.hero.bootsNudgeCharges > 0;
      if (paidByBoots) s.hero.bootsNudgeCharges--;
      else s.hero.nudges--;
      log(s, `${paidByBoots ? 'Boots-Nudge' : 'Nudge'}: ${s.phase.roll} → ${target}.`);
      move(s, rng, target);
      break;
    }
    case 'REROLL': {
      if (s.phase.t !== 'rolled' || s.phase.wasReroll) break;
      // Elverstøvler: at omslå en 1'er koster ikke reroll'en
      const freeOn1 = s.phase.roll === 1 && loadoutEffect(s.hero.loadout, 'freeRerollOn1') !== null;
      if (!freeOn1 && s.hero.rerolls <= 0) break;
      if (!freeOn1) s.hero.rerolls--;
      const roll = applyDieTransform(rng.d6(), s.hero.loadout);
      log(s, `${freeOn1 ? 'The Elven Boots reroll the 1 for free' : 'Reroll'}: ${s.phase.roll} → 🎲 ${roll}. The result is final.`);
      move(s, rng, roll);
      break;
    }
    case 'PICK_LEVELUP': {
      if (s.phase.t !== 'levelup' || s.pendingLevelUps <= 0) break;
      applyLevelPick(s, action.pick);
      s.pendingLevelUps--;
      log(s, `Level up: ${PICK_LABEL[action.pick]}.`, 'good');
      if (s.pendingLevelUps <= 0) s.phase = { t: 'idle' };
      break;
    }
    case 'PICK_TREASURE': {
      if (s.phase.t !== 'treasure') break;
      const item = s.phase.options[action.index];
      if (!item) break;
      if (item.equipmentId) {
        // Inspektion er gratis (samme kontrakt som shoppen): Keep går TILBAGE
        // til kisten med alle muligheder intakte; først Equip forbruger valget.
        log(s, `You find ${item.name}. Compare it with your current gear.`, 'good');
        offerEquipment(s, item.equipmentId, 'treasure', { t: 'treasure', options: s.phase.options });
      } else {
        applyImmediateTreasure(s, item);
        log(s, `You take ${item.name} (${item.desc}).`, 'good');
        s.phase = { t: 'idle' };
      }
      break;
    }
    case 'BUY': {
      if (s.phase.t !== 'shop') break;
      const h = s.hero;
      const offer = s.phase.offers[action.index];
      if (!offer || offer.sold || h.gold < offer.cost) break;
      if (offer.kind === 'gear') {
        if (ownsEquipment(h, offer.itemId)) break;
        offerEquipment(s, offer.itemId, 'shop', { t: 'shop', offers: s.phase.offers }, offer.cost);
      } else if (offer.kind === 'consumable') {
        if (!hasConsumableSlot(s)) break;
        h.gold -= offer.cost;
        offer.sold = true;
        gainConsumable(s, offer.consumableId);
        log(s, `Bought: ${CONSUMABLES[offer.consumableId].name} (${consumableEffectText(offer.consumableId)}).`, 'good');
      } else if (offer.service === 'heal') {
        if (h.hp >= h.maxHp) break;
        h.gold -= offer.cost;
        offer.sold = true;
        const gained = heal(s, CONFIG.shop.heal.hp);
        log(s, `Bought: healing (+${gained} HP).`, 'good');
      } else if (offer.service === 'nudge') {
        h.gold -= offer.cost;
        offer.sold = true;
        h.nudges++;
        log(s, 'Bought: +1 nudge.', 'good');
      } else {
        h.gold -= offer.cost;
        offer.sold = true;
        h.rerolls++;
        log(s, 'Bought: +1 reroll.', 'good');
      }
      break;
    }
    case 'EQUIP_OFFER': {
      if (s.phase.t !== 'equipment' || s.hero.gold < s.phase.cost) break;
      const { cost, itemId, resume, source } = s.phase;
      const item = EQUIPMENT_DEFS[itemId];
      s.hero.gold -= cost;
      equipItem(s.hero, itemId);
      if (resume.t === 'shop') {
        const sold = resume.offers.find(o => o.kind === 'gear' && o.itemId === itemId && !o.sold);
        if (sold) sold.sold = true;
      }
      log(s, `${source === 'shop' ? 'Bought & equipped' : 'Equipped'}: ${item.name} (${equipmentEffectText(itemId)}).`, 'good');
      // Equip fra en kiste forbruger valget — de andre muligheder forsvinder
      s.phase = resume.t === 'treasure' ? { t: 'idle' } : resume;
      break;
    }
    case 'KEEP_EQUIPMENT': {
      if (s.phase.t !== 'equipment') break;
      const item = EQUIPMENT_DEFS[s.phase.itemId];
      if (s.phase.resume.t === 'treasure') {
        log(s, `You put ${item.name} back and look at the chest again.`);
      } else {
        log(s, `You keep your current gear and leave ${item.name} behind.`);
      }
      s.phase = s.phase.resume;
      break;
    }
    case 'LEAVE_SHOP': {
      if (s.phase.t !== 'shop') break;
      log(s, 'You leave the shop.');
      s.phase = { t: 'idle' };
      break;
    }
  }

  s.rngState = rng.state;
  return s;
}
