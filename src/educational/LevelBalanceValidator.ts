import { LevelConfig } from '../types/curriculum';
import { QUESTION_BANK } from './questionBank';

export interface LevelBalanceReport {
  levelId: number;
  levelTitle: string;
  topic: string;
  questionCount: number;
  maxRadoxoms: number;
  radoxomDamage: number;
  monsterHP: number;
  minimumHitsRequired: number;
  maximumPossibleDamage: number;
  safetyMarginDamage: number;
  safetyMarginHits: number;
  isValid: boolean;
  error?: string;
  warning?: string;
}

export const BASE_RADOXOM_DAMAGE: Record<string, number> = {
  vector: 50,
  cleave: 60,
  fire: 65,
  laser: 75,
  omnislash: 90,
  ice: 55,
  shock: 65,
  neon: 70,
  heavy: 80,
  ultimate: 100,
};

/**
 * Validates a single level's economy against combat requirements.
 */
export function validateLevel(
  level: LevelConfig,
  radoxomType: string = 'vector',
  minHitsSafetyMargin: number = 1
): LevelBalanceReport {
  const damage = BASE_RADOXOM_DAMAGE[radoxomType] || BASE_RADOXOM_DAMAGE.vector;
  const questionCount = level.questionIds.length;
  // In our system, 1 correct question = 1 Radoxom ammo
  const maxRadoxoms = questionCount;
  const monsterHP = level.monster.hp;
  const minimumHitsRequired = Math.ceil(monsterHP / damage);
  const maximumPossibleDamage = maxRadoxoms * damage;
  const safetyMarginDamage = maximumPossibleDamage - monsterHP;
  const safetyMarginHits = maxRadoxoms - minimumHitsRequired;

  let isValid = true;
  let error: string | undefined;
  let warning: string | undefined;

  // 1. Verify question bank integrity
  const missingQuestionIds = level.questionIds.filter((qid) => !QUESTION_BANK[qid]);
  if (missingQuestionIds.length > 0) {
    isValid = false;
    error = `FATAL: Level ${level.id} references missing questions in QUESTION_BANK: [${missingQuestionIds.join(', ')}]`;
  } else if (maximumPossibleDamage < monsterHP) {
    isValid = false;
    error = `FATAL: Level ${level.id} (${level.title}) is MATHEMATICALLY IMPOSSIBLE! ` +
      `Monster HP (${monsterHP}) exceeds maximum potential damage (${maximumPossibleDamage}) from ${questionCount} questions.`;
  } else if (safetyMarginHits < minHitsSafetyMargin && level.id < 42) {
    // Normal levels should have at least 1-2 missed shot allowance
    warning = `Warning: Level ${level.id} has a tight combat margin (${safetyMarginHits} misses allowed). Consider adding questions or reducing HP.`;
  }

  return {
    levelId: level.id,
    levelTitle: level.title,
    topic: level.topic,
    questionCount,
    maxRadoxoms,
    radoxomDamage: damage,
    monsterHP,
    minimumHitsRequired,
    maximumPossibleDamage,
    safetyMarginDamage,
    safetyMarginHits,
    isValid,
    error,
    warning,
  };
}

/**
 * Audits and prints a comprehensive validation report for all curriculum levels.
 */
export function validateAllLevels(levels: LevelConfig[]): {
  allValid: boolean;
  reports: LevelBalanceReport[];
} {
  const reports = levels.map((lvl) => validateLevel(lvl));
  const allValid = reports.every((r) => r.isValid);

  if (!allValid) {
    const failed = reports.filter((r) => !r.isValid);
    console.error(`🚨 FATAL: ${failed.length} levels failed mathematical balance or question validation!`);
    failed.forEach((f) => console.error(`❌ [${f.levelId} - ${f.levelTitle}]: ${f.error}`));
  }

  return { allValid, reports };
}
