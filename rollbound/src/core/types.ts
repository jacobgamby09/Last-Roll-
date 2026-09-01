export type TileType =
  | 'blank' | 'enemy' | 'elite' | 'gold' | 'treasure'
  | 'camp' | 'shop' | 'event' | 'trap' | 'boss';

export interface EnemyDef {
  name: string;
  hp: number;
  dmg: number;
  armor: number;
  xp: number;
  gold: number;
}

export interface Hero {
  hp: number;
  maxHp: number;
  dmg: number;
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
}

export interface FightPreview {
  heroHit: number;
  enemyHit: number;
  hitsToKill: number;
  hpLoss: number;
  survives: boolean;
}
