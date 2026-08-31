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
  rerolls: number;
}

export interface TreasureItem {
  key: 'dmg' | 'armor' | 'maxhp' | 'nudge' | 'gold';
  name: string;
  desc: string;
}

export type LevelPick = 'dmg' | 'hp' | 'armor';

export type Phase =
  | { t: 'idle' }
  | { t: 'rolled'; roll: number; wasReroll: boolean }
  | { t: 'levelup' }
  | { t: 'treasure'; options: TreasureItem[] }
  | { t: 'shop'; boughtWeapon: boolean; boughtArmor: boolean }
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
