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

export type WeaponVisualId = 'wood-club' | 'rusted-sword';
export type ArmorVisualId = 'cloth-shirt' | 'worn-plate';
export type BootsVisualId = 'worn-sandals' | 'trail-boots';
export type EquipmentId = WeaponVisualId | ArmorVisualId | BootsVisualId;
export type EquipmentKind = 'weapon' | 'armor' | 'boots';

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

export type EquipmentResumePhase =
  | { t: 'idle' }
  | { t: 'levelup' }
  | { t: 'shop'; boughtWeapon: boolean; boughtArmor: boolean; boughtBoots: boolean };

export type Phase =
  | { t: 'idle' }
  | { t: 'rolled'; roll: number; wasReroll: boolean }
  | { t: 'levelup' }
  | { t: 'treasure'; options: TreasureItem[] }
  | { t: 'shop'; boughtWeapon: boolean; boughtArmor: boolean; boughtBoots: boolean }
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
  kind: 'attack';
  damage: number; // efter armor
  targetHpAfter: number;
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
