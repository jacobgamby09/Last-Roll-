export type TileType =
  | 'blank' | 'enemy' | 'elite' | 'gold' | 'treasure'
  | 'camp' | 'shop' | 'event' | 'trap' | 'boss';

// Damage er ranges (beslutning 2026-09-02): hvert angreb ruller i [min, max].
// Bredden er en identitetsakse (smal = pålidelig, bred = volatil); bonusser
// fra levels/items FORSKYDER rangen (shift-model), bredden ejes af kilden.
export interface EnemyDef {
  name: string;
  hp: number;
  dmgMin: number;
  dmgMax: number;
  armor: number;
  xp: number;
  gold: number;
}

export interface Hero {
  hp: number;
  maxHp: number;
  dmgMin: number;
  dmgMax: number;
  armor: number;
  level: number;
  xp: number;
  gold: number;
  nudges: number;
  bootsNudgeCharges: number;
  rerolls: number;
  loadout: EquipmentLoadout;
}

export type WeaponVisualId =
  | 'wood-club' | 'rusted-sword' | 'wild-axe' | 'dagger' | 'hunting-spear'
  | 'twin-daggers' | 'war-hammer' | 'blood-blade' | 'executioner-axe' | 'rune-blade';
export type ArmorVisualId =
  | 'cloth-shirt' | 'worn-plate' | 'wanderer-coat' | 'camp-cloak' | 'riveted-harness'
  | 'thorn-mail' | 'shield-vest' | 'duelist-jacket' | 'blood-plate' | 'sacrifice-plate';
export type BootsVisualId =
  | 'worn-sandals' | 'trail-boots' | 'heavy-greaves' | 'light-runners' | 'scout-boots'
  | 'goldthread-shoes' | 'elven-boots' | 'pilgrim-shoes' | 'shadow-shoes' | 'iron-shod';
export type EquipmentId = WeaponVisualId | ArmorVisualId | BootsVisualId;
export type EquipmentKind = 'weapon' | 'armor' | 'boots';

// Datadrevet effect-vokabular (item-system slice A, 2026-09-02).
// Items er data: ét item = navn + slot + tier + en liste af effects.
// Combat-effects afvikles i simulateFight; board-effects i engine-hooks.
export type ItemEffect =
  | { kind: 'dmgRange'; min: number; max: number }        // våbnet EJER rangen
  | { kind: 'armor'; amount: number }
  | { kind: 'maxHp'; amount: number }
  | { kind: 'armorPen'; amount: number | 'all' }
  | { kind: 'firstStrike'; mult: number }                 // første hug ganges (før armor)
  | { kind: 'doubleHit' }                                 // to ruller pr. tur (armor bider dobbelt)
  | { kind: 'executeBonus'; threshold: number; mult: number } // vs fjender under threshold×maxHP
  | { kind: 'killHeal'; amount: number }                  // heal pr. kill
  | { kind: 'thorns'; amount: number }                    // refleks pr. modtaget hug
  | { kind: 'firstHitBlock' }                             // bloker fjendens første angreb
  | { kind: 'bootsCharges'; count: number; rechargeAtCamp: boolean }
  | { kind: 'dieTransform'; from: number; to: number }    // fx 6 tæller som 5
  | { kind: 'visibility'; amount: number }                // ekstra synlige felter
  | { kind: 'campHealBonus'; amount: number }
  | { kind: 'campNudge'; amount: number }
  | { kind: 'goldBonus'; amount: number }                 // pr. guld-gevinst fra felter
  | { kind: 'trapImmune' }
  | { kind: 'freeRerollOn1' };

export interface ItemDef {
  id: EquipmentId;
  slot: EquipmentKind;
  tier: 0 | 1 | 2;
  name: string;
  cost: number; // shoppris; 0 = sælges ikke
  effects: ItemEffect[];
}

// Kamp-modifiers afledt af heroens loadout — sendes ind i simulateFight
export interface CombatMods {
  firstStrikeMult?: number;
  doubleHit?: boolean;
  executeBonus?: { threshold: number; mult: number };
  armorPen?: number | 'all';
  killHeal?: number;
  thorns?: number;
  firstHitBlock?: boolean;
}

export interface EquipmentLoadout {
  weapon: WeaponVisualId;
  armor: ArmorVisualId;
  boots: BootsVisualId;
}

export interface TreasureItem {
  key: 'weapon' | 'armor' | 'boots' | 'maxhp' | 'nudge' | 'gold';
  name: string;
  desc: string;
  equipmentId?: EquipmentId;
}

export type LevelPick = 'dmg' | 'hp' | 'armor';

// Shoppen har 5 seedede slots — hvert slot er 100 % tilfældigt gear eller
// service (consumables kommer til i batch C). Hvert slot kan købes én gang.
export type ShopService = 'heal' | 'nudge' | 'reroll';
export type ShopOffer =
  | { kind: 'gear'; itemId: EquipmentId; cost: number; sold: boolean }
  | { kind: 'service'; service: ShopService; cost: number; sold: boolean };

export type EquipmentResumePhase =
  | { t: 'idle' }
  | { t: 'levelup' }
  | { t: 'shop'; offers: ShopOffer[] };

export type Phase =
  | { t: 'idle' }
  | { t: 'rolled'; roll: number; wasReroll: boolean }
  | { t: 'levelup' }
  | { t: 'treasure'; options: TreasureItem[] }
  | { t: 'shop'; offers: ShopOffer[] }
  | { t: 'equipment'; itemId: EquipmentId; source: 'treasure' | 'drop' | 'shop'; cost: number; resume: EquipmentResumePhase }
  | { t: 'over'; won: boolean; cause: string };

export interface LogEntry {
  text: string;
  kind: 'info' | 'good' | 'bad' | 'combat';
}

export interface GameState {
  seed: number;
  rngState: number;
  track: TileType[]; // index 1..trackLength, [trackLength] = boss
  pos: number;
  hero: Hero;
  phase: Phase;
  pendingLevelUps: number;
  rolls: number;
  fights: number;
  log: LogEntry[];
  lastCombat: CombatScript | null; // seneste kamp, klar til UI-playback
  combatSeq: number; // tælles op pr. kamp — UI'et bruger den til at opdage NYE kampe (referencer overlever ikke structuredClone)
}

export interface FightPreview {
  heroHit: number;
  enemyHit: number;
  hitsToKill: number;
  hpLoss: number;
  survives: boolean;
}

// Combat script: reducerens atomiske kamp-afgørelse som afspilbar event-liste.
// UI'et afspiller events uden at gen-beregne regler; fremtidige effects
// (first strike, lifesteal, pre-combat casts) udvider `kind`-unionen.
export interface CombatEvent {
  turn: number;
  actor: 'hero' | 'enemy';
  kind: 'attack' | 'thorns' | 'lifesteal' | 'block';
  damage: number; // efter armor (heal-mængde for 'lifesteal', 0 for 'block')
  targetHpAfter: number;
  note?: 'firstStrike' | 'execute'; // markerer særlige attack-events til UI'et
}

export interface CombatScript {
  enemy: EnemyDef;
  events: CombatEvent[];
  result: {
    winner: 'hero' | 'enemy';
    heroHpAfter: number;
    turns: number; // antal hero-angreb
  };
}
