// Rollbound game engine — ren state machine, ingen UI.
// Alle actions går gennem reducer(); al RNG er seedet og bor i state,
// så et run kan reproduceres fra sit seed.

import { CONFIG, TREASURE_POOL } from './config';
import { EQUIPMENT_DEFS, equipItem, ownsEquipment } from './equipment';
import { cursor, type RngCursor } from './rng';
import { generateTrack } from './track';
import { enemyForTile, fightOutcome } from './combat';
import type { EquipmentId, EquipmentKind, EquipmentResumePhase, GameState, LevelPick, LogEntry, TileType, TreasureItem } from './types';

export type Action =
  | { type: 'ROLL' }
  | { type: 'NUDGE'; dir: 1 | -1 }
  | { type: 'REROLL' }
  | { type: 'ACCEPT' }
  | { type: 'PICK_LEVELUP'; pick: LevelPick }
  | { type: 'PICK_TREASURE'; index: number }
  | { type: 'BUY'; item: 'weapon' | 'armor' | 'boots' | 'heal' | 'nudge' | 'reroll' }
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
      dmg: CONFIG.hero.dmg,
      armor: CONFIG.hero.armor,
      level: 1,
      xp: 0,
      gold: CONFIG.hero.gold,
      nudges: CONFIG.hero.nudges,
      bootsNudgeCharges: 0,
      rerolls: CONFIG.hero.rerolls,
      loadout: { ...CONFIG.equipment.starters },
    },
    phase: { t: 'idle' },
    pendingLevelUps: 0,
    rolls: 0,
    fights: 0,
    log: [{ text: `Runnet begynder. Nå felt ${CONFIG.trackLength} med et build, der kan slå bossen.`, kind: 'info' }],
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
  if (pick === 'dmg') s.hero.dmg += lu.dmg;
  else if (pick === 'hp') {
    s.hero.maxHp += lu.hp;
    s.hero.hp += lu.hp;
  } else {
    s.hero.armor += lu.armor;
    s.hero.maxHp += lu.armorHp;
    s.hero.hp += lu.armorHp;
  }
}

function applyImmediateTreasure(s: GameState, item: TreasureItem) {
  switch (item.key) {
    case 'maxhp': s.hero.maxHp += 10; s.hero.hp += 10; break;
    case 'nudge': s.hero.nudges += 1; break;
    case 'gold': s.hero.gold += 12; break;
    case 'weapon':
    case 'armor':
    case 'boots':
      break;
  }
}

function availableTreasure(hero: GameState['hero']): TreasureItem[] {
  return TREASURE_POOL.filter(item => !item.equipmentId || !ownsEquipment(hero, item.equipmentId));
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

function runCombat(s: GameState, rng: RngCursor, type: TileType) {
  const enemy = enemyForTile(s.pos, type);
  const out = fightOutcome(s.hero, enemy);
  if (!out.survives) {
    s.hero.hp = 0;
    s.phase = { t: 'over', won: false, cause: `Dræbt af ${enemy.name} på felt ${s.pos}` };
    log(s, `${enemy.name} fælder dig efter ${out.hitsToKill - 1} slag.`, 'bad');
    return;
  }
  s.hero.hp -= out.hpLoss;
  s.fights++;
  s.hero.gold += enemy.gold;
  log(
    s,
    `Du besejrer ${enemy.name} på ${out.hitsToKill} slag: −${out.hpLoss} HP, +${enemy.xp} XP, +${enemy.gold} guld.`,
    'combat',
  );
  const dropChance = type === 'elite' ? CONFIG.drops.elite : CONFIG.drops.normal;
  let equipmentDrop: EquipmentId | null = null;
  if (dropChance > 0 && rng.rand() < dropChance) {
    const pool = availableTreasure(s.hero);
    const item = pool[Math.floor(rng.rand() * pool.length)];
    if (item.equipmentId) {
      equipmentDrop = item.equipmentId;
      log(s, `${enemy.name} dropper ${item.name}. Vurdér det nye udstyr.`, 'good');
    } else {
      applyImmediateTreasure(s, item);
      log(s, `${enemy.name} dropper ${item.name} (${item.desc})!`, 'good');
    }
  }
  gainXp(s, enemy.xp);
  const resume = resumeAfterReward(s);
  if (equipmentDrop) offerEquipment(s, equipmentDrop, 'drop', resume);
  else s.phase = resume;
}

function bossFight(s: GameState) {
  const out = fightOutcome(s.hero, CONFIG.boss);
  if (out.survives) {
    s.hero.hp -= out.hpLoss;
    log(s, `${CONFIG.boss.name} falder efter ${out.hitsToKill} slag! Du mistede ${out.hpLoss} HP.`, 'good');
    s.phase = { t: 'over', won: true, cause: `Sejr med ${s.hero.hp} HP tilbage` };
  } else {
    s.hero.hp = 0;
    log(s, `${CONFIG.boss.name} var for stærk. Dit build manglede mere.`, 'bad');
    s.phase = { t: 'over', won: false, cause: 'Faldt til bossen' };
  }
}

function resolveTile(s: GameState, rng: RngCursor) {
  const type = s.track[s.pos];
  switch (type) {
    case 'blank':
      log(s, 'Stille vej. Ingen hændelser.');
      s.phase = { t: 'idle' };
      break;
    case 'gold': {
      s.hero.gold += CONFIG.goldTile;
      log(s, `Du finder ${CONFIG.goldTile} guld.`, 'good');
      s.phase = { t: 'idle' };
      break;
    }
    case 'camp': {
      const gained = heal(s, CONFIG.camp.heal);
      log(s, gained > 0 ? `Lejren heler dig +${gained} HP.` : 'Lejren er rar, men du var på fuld HP.', 'good');
      s.phase = { t: 'idle' };
      break;
    }
    case 'trap': {
      if (rng.rand() < 0.5) {
        s.hero.hp -= CONFIG.trap.hpLoss;
        log(s, `Fælde! Du tager ${CONFIG.trap.hpLoss} skade.`, 'bad');
        if (s.hero.hp <= 0) {
          s.hero.hp = 0;
          s.phase = { t: 'over', won: false, cause: `Dræbt af en fælde på felt ${s.pos}` };
          return;
        }
      } else {
        const lost = Math.min(CONFIG.trap.goldLoss, s.hero.gold);
        s.hero.gold -= lost;
        log(s, `Fælde! Du taber ${lost} guld.`, 'bad');
      }
      s.phase = { t: 'idle' };
      break;
    }
    case 'event': {
      if (rng.rand() < 0.5) {
        s.hero.gold += CONFIG.event.gold;
        log(s, `Skæbnen smiler: +${CONFIG.event.gold} guld.`, 'good');
      } else {
        s.hero.hp -= CONFIG.event.hpLoss;
        log(s, `Skæbnen bider: −${CONFIG.event.hpLoss} HP.`, 'bad');
        if (s.hero.hp <= 0) {
          s.hero.hp = 0;
          s.phase = { t: 'over', won: false, cause: `Et event på felt ${s.pos} blev enden` };
          return;
        }
      }
      s.phase = { t: 'idle' };
      break;
    }
    case 'treasure': {
      const options = rng.shuffle(availableTreasure(s.hero)).slice(0, 3);
      log(s, 'En skattekiste! Vælg 1 af 3.');
      s.phase = { t: 'treasure', options };
      break;
    }
    case 'shop': {
      log(s, 'Du træder ind i shoppen.');
      s.phase = { t: 'shop', boughtWeapon: false, boughtArmor: false, boughtBoots: false };
      break;
    }
    case 'enemy':
    case 'elite':
      runCombat(s, rng, type);
      break;
    case 'boss':
      bossFight(s);
      break;
  }
}

function move(s: GameState, rng: RngCursor, steps: number) {
  s.pos = Math.min(s.pos + steps, CONFIG.trackLength);
  if (s.pos >= CONFIG.trackLength) {
    bossFight(s);
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
      const roll = rng.d6();
      log(s, `Rul #${s.rolls}: 🎲 ${roll}.`);
      s.phase = { t: 'rolled', roll, wasReroll: false };
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
      if (s.phase.t !== 'rolled' || s.phase.wasReroll || s.hero.rerolls <= 0) break;
      s.hero.rerolls--;
      const roll = rng.d6();
      log(s, `Reroll: ${s.phase.roll} → 🎲 ${roll}. Resultatet er endeligt.`);
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
        log(s, `Du finder ${item.name}. Vurdér det mod dit nuværende udstyr.`, 'good');
        offerEquipment(s, item.equipmentId, 'treasure', { t: 'idle' });
      } else {
        applyImmediateTreasure(s, item);
        log(s, `Du tager ${item.name} (${item.desc}).`, 'good');
        s.phase = { t: 'idle' };
      }
      break;
    }
    case 'BUY': {
      if (s.phase.t !== 'shop') break;
      const sh = CONFIG.shop;
      const h = s.hero;
      const offers: Partial<Record<EquipmentKind, { id: EquipmentId; cost: number; bought: boolean }>> = {
        weapon: { id: 'rusted-sword', cost: sh.weapon.cost, bought: s.phase.boughtWeapon },
        armor: { id: 'worn-plate', cost: sh.armorItem.cost, bought: s.phase.boughtArmor },
        boots: { id: 'trail-boots', cost: sh.boots.cost, bought: s.phase.boughtBoots },
      };
      if (action.item === 'weapon' || action.item === 'armor' || action.item === 'boots') {
        const offer = offers[action.item];
        if (offer && !offer.bought && !ownsEquipment(h, offer.id) && h.gold >= offer.cost) {
          offerEquipment(s, offer.id, 'shop', { ...s.phase }, offer.cost);
        }
      } else if (action.item === 'heal' && h.gold >= sh.heal.cost && h.hp < h.maxHp) {
        h.gold -= sh.heal.cost;
        const gained = heal(s, sh.heal.hp);
        log(s, `Købt: heling (+${gained} HP).`, 'good');
      } else if (action.item === 'nudge' && h.gold >= sh.nudge) {
        h.gold -= sh.nudge;
        h.nudges++;
        log(s, 'Købt: +1 Nudge.', 'good');
      } else if (action.item === 'reroll' && h.gold >= sh.reroll) {
        h.gold -= sh.reroll;
        h.rerolls++;
        log(s, 'Købt: +1 Reroll.', 'good');
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
        if (item.kind === 'weapon') resume.boughtWeapon = true;
        if (item.kind === 'armor') resume.boughtArmor = true;
        if (item.kind === 'boots') resume.boughtBoots = true;
      }
      log(s, `${source === 'shop' ? 'Købt og udstyret' : 'Udstyret'}: ${item.name} (${item.effect.dmg ? `+${item.effect.dmg} Damage` : item.effect.armor ? `+${item.effect.armor} Armor` : `${item.effect.freeNudges} gratis Nudge`}).`, 'good');
      s.phase = resume;
      break;
    }
    case 'KEEP_EQUIPMENT': {
      if (s.phase.t !== 'equipment') break;
      const item = EQUIPMENT_DEFS[s.phase.itemId];
      log(s, `Du beholder dit nuværende udstyr og efterlader ${item.name}.`);
      s.phase = s.phase.resume;
      break;
    }
    case 'LEAVE_SHOP': {
      if (s.phase.t !== 'shop') break;
      log(s, 'Du forlader shoppen.');
      s.phase = { t: 'idle' };
      break;
    }
  }

  s.rngState = rng.state;
  return s;
}
