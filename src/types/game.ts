// Core game types and interfaces

export type GameScreen = 
  | 'MAIN_MENU'
  | 'INTRO_CINEMATIC'
  | 'ARIA_LESSON'
  | 'QUESTION_SESSION'
  | 'COMBAT_PREP'
  | 'REALTIME_COMBAT'
  | 'PRACTICE_MINI'
  | 'EXPLORATION'
  | 'MONSTER_INTRO'
  | 'COMBAT'
  | 'LEVEL_COMPLETE'
  | 'PLAYER_DEATH'
  | 'PRACTICE_ARENA'
  | 'LEVEL_SELECT'
  | 'SETTINGS'
  | 'GAME_COMPLETE';

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  currentHp: number;
  maxHp: number;
  currentShield: number;
  maxShield: number;
  attackPower: number;
  skills: string[];
}

export interface CombatStats {
  radoxomsEarned: number;
  radoxomsFired: number;
  radoxomsHit: number;
  radoxomsMissed: number;
  attacksDodged: number;
  monsterAttacksDodged?: number;
  damageTaken: number;
  damageDealt: number;
  accuracy: number;
  timeSurvived?: number;
  timeToDefeat?: number;
  attacksAvoided?: number;
  combatRating?: 'S' | 'A' | 'B' | 'C';
}

export interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  dialogueSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  textScale: 'normal' | 'large';
  quality: 'low' | 'medium' | 'high';
}

export type MasteryRank = 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER';

export interface TopicMasteryDetail {
  correct: number;
  total: number;
  percentage: number;
  category: string;
}

export interface TopicMastery {
  [topicId: string]: TopicMasteryDetail;
}

export interface CategoryMasteryScore {
  category: string;
  correct: number;
  total: number;
  percentage: number;
  rank: MasteryRank;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SaveData {
  version: number;
  currentLevelId: number;
  unlockedLevelId: number;
  playerStats: PlayerStats;
  settings: SettingsState;
  completedLevels: number[];
  topicMastery: TopicMastery;
  questionsAnswered: number;
  questionsCorrect: number;
  streak: number;
  highStreak: number;
  achievements: string[];
  lastPlayed: string;
}
