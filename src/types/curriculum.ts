export type QuestionType = 
  | 'multiple_choice' 
  | 'predict_output' 
  | 'find_error' 
  | 'code_fill'
  | 'shape_prediction'
  | 'dataset_mission'
  | 'boss_challenge';

export interface DatasetContext {
  name: string;
  description: string;
  dataSample: string;
  columns?: string[];
}

export interface Question {
  id: string;
  topic: string;
  difficulty: number; // 1 to 5
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  datasetContext?: DatasetContext;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  requiredConcepts: string[];
}

export interface DialogueStep {
  speaker: 'Aria' | 'Hero' | 'Monster';
  text: string;
  expression?: 'normal' | 'excited' | 'thinking' | 'serious';
}

export interface LessonTheory {
  partA: {
    title: string;
    concept: string;
    explanation: string;
    whyUseIt: string;
    useCases: string[];
  };
  partB: {
    title: string;
    concept: string;
    code: string;
    output: string;
    breakdown: string;
    visualArray?: string[][];
  };
}

export interface MiniPractice {
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type MonsterSpriteType =
  | 'demon_beast'
  | 'shadow_demon'
  | 'armored_demon'
  | 'fire_demon'
  | 'flying_demon'
  | 'winged_beast'
  | 'elite_demon'
  | 'guardian_malakor'
  | 'goblin'
  | 'beast'
  | 'demon'
  | 'golem'
  | 'phantom'
  | 'knight'
  | 'dragon'
  | 'boss';

export interface MonsterAIProfile {
  movementSpeed: number;
  reactionDelay: number;
  attackFrequency: number;
  dodgeChance: number;
  predictionStrength: number;
  aggression: number;
  preferredDistance: number;
  personality: 'aggressive_beast' | 'elusive_shadow' | 'stalwart_armored' | 'aerial_predator' | 'fire_sorcerer' | 'elite_tactician' | 'guardian_god';
}

export interface MonsterArchetype {
  name: string;
  archetype: string;
  hp: number;
  maxHp: number;
  attack: number;
  introDialogue: string[];
  defeatDialogue: string;
  color: string;
  spriteType: MonsterSpriteType;
  isFlying?: boolean;
  aiProfile?: Partial<MonsterAIProfile>;
}

export interface MinionArchetype {
  name: string;
  archetype?: string;
  hp: number;
  maxHp: number;
  attack: number;
  color: string;
  spriteType: MonsterSpriteType;
  introDialogue?: string[];
  defeatDialogue?: string;
  isFlying?: boolean;
  aiProfile?: Partial<MonsterAIProfile>;
}

export type LevelType = 
  | 'exploration' 
  | 'puzzle_platforms' 
  | 'multi_monster' 
  | 'boss_phases';

export interface PuzzleGate {
  id: string;
  x: number;
  prompt: string;
  questionId: string;
  bridgeStartX: number;
  bridgeEndX: number;
  activated: boolean;
}

export interface LevelConfig {
  id: number;
  worldId: number;
  worldTitle: string;
  title: string;
  subtitle: string;
  topic: string;
  masteryCategory: string;
  levelType: LevelType;
  environment: {
    name: string;
    type: 'forest' | 'valley' | 'ruins' | 'caves' | 'mountains' | 'fortress' | 'village' | 'snow' | 'celestial';
    skyColor: string;
    groundColor: string;
    accentColor: string;
  };
  ariaIntro: DialogueStep[];
  theory: LessonTheory;
  miniPractice: MiniPractice;
  monster: MonsterArchetype;
  minions?: MinionArchetype[];
  puzzleGate?: PuzzleGate;
  questionIds: string[];
  rewardXp: number;
  unlockedSkill?: {
    name: string;
    description: string;
    icon: string;
  };
}
