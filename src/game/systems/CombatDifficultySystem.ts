export interface CombatDifficulty {
  level: number;

  monsterHealthMultiplier: number;
  monsterDamageMultiplier: number;

  movementSpeed: number;
  acceleration: number;
  reactionDelay: number;

  aggression: number;

  attackCooldown: number;
  attackWindup: number;

  dodgeChance: number;
  dodgeCooldown: number;

  predictionStrength: number;

  comboComplexity: number;

  attackRange: number;

  projectileSpeed: number;

  projectileAccuracy: number;

  retreatIntelligence: number;

  arenaControl: number;

  phaseCount: number;
}

export type DifficultyTier =
  | 'TUTORIAL'
  | 'BASIC'
  | 'ADVANCED_MOVEMENT'
  | 'SMART_AI'
  | 'COMBO'
  | 'ELITE'
  | 'HIGH_LEVEL'
  | 'MASTER';

export function getDifficultyTier(level: number, totalLevels: number = 42): DifficultyTier {
  const ratio = Math.max(0, Math.min(1, (level - 1) / (totalLevels - 1)));
  if (ratio < 0.12) return 'TUTORIAL'; // L1-5
  if (ratio < 0.24) return 'BASIC'; // L6-10
  if (ratio < 0.36) return 'ADVANCED_MOVEMENT'; // L11-15
  if (ratio < 0.48) return 'SMART_AI'; // L16-20
  if (ratio < 0.60) return 'COMBO'; // L21-25
  if (ratio < 0.72) return 'ELITE'; // L26-30
  if (ratio < 0.84) return 'HIGH_LEVEL'; // L31-35
  return 'MASTER'; // L36-42
}

export function calculateCombatDifficulty(level: number, totalLevels: number = 42): CombatDifficulty {
  const clampedLevel = Math.max(1, Math.min(totalLevels, level));
  const t = (clampedLevel - 1) / (totalLevels - 1); // 0 to 1 progress

  // Non-linear ease: s-curve progression so early is forgiving and late accelerates
  const sCurve = t * t * (3 - 2 * t);

  // Progressive parameters based on non-linear curve (Level 1 is immediately active!)
  const movementSpeed = Math.round(190 + sCurve * 150); // 190 -> 340 px/s
  const acceleration = Math.round(450 + sCurve * 450); // 450 -> 900 px/s²
  const reactionDelay = Number((0.35 - sCurve * 0.25).toFixed(2)); // 0.35s -> 0.10s
  const aggression = Number((0.55 + sCurve * 0.42).toFixed(2)); // 0.55 -> 0.97
  const attackCooldown = Number((1.50 - sCurve * 0.85).toFixed(2)); // 1.50s -> 0.65s
  const attackWindup = Number((0.65 - sCurve * 0.35).toFixed(2)); // 0.65s -> 0.30s

  // Dodge: 0.25 (L1) -> 0.60 (L42) with finite dodge charges per tier
  const dodgeChance = Number((0.25 + sCurve * 0.35).toFixed(2));
  const dodgeCooldown = Number((2.40 - sCurve * 1.30).toFixed(2)); // 2.40s -> 1.10s

  // Prediction: starts at 0.15 on L1-5 and scales up to 0.98
  const predictionStrength = Number((0.15 + sCurve * 0.83).toFixed(2)); // 0.15 -> 0.98

  // Combos: single at L1-5, 2-hit L6-20, 3-hit L21-35, 4-hit L36+
  let comboComplexity = 1;
  if (clampedLevel >= 36) comboComplexity = 4;
  else if (clampedLevel >= 21) comboComplexity = 3;
  else if (clampedLevel >= 6) comboComplexity = 2;

  // Attack range: 120 -> 200
  const attackRange = Math.round(120 + sCurve * 80);

  // Projectiles
  const projectileSpeed = Math.round(340 + sCurve * 240); // 340 -> 580 px/s
  const projectileAccuracy = Number((0.72 + sCurve * 0.26).toFixed(2)); // 0.72 -> 0.98

  // Retreat & Positioning Intelligence
  const retreatIntelligence = Number((0.45 + sCurve * 0.50).toFixed(2)); // 0.45 -> 0.95

  // Arena control / hazards: none until L21, then scales 0.35 -> 1.0
  let arenaControl = 0;
  if (clampedLevel >= 21) {
    arenaControl = Number((0.35 + ((clampedLevel - 21) / (totalLevels - 21)) * 0.65).toFixed(2));
  }

  // Phases: 1 (L1-10), 2 (L11-25), 3 (L26-35), 4 (L36-42)
  let phaseCount = 1;
  if (clampedLevel >= 36) phaseCount = 4;
  else if (clampedLevel >= 26) phaseCount = 3;
  else if (clampedLevel >= 11) phaseCount = 2;

  // Health kept 1.0 to strictly honor Radoxom ammo economy; damage scales progressively
  const monsterHealthMultiplier = 1.0;
  const monsterDamageMultiplier = Number((0.85 + sCurve * 1.0).toFixed(2)); // 0.85 -> 1.85

  return {
    level: clampedLevel,
    monsterHealthMultiplier,
    monsterDamageMultiplier,
    movementSpeed,
    acceleration,
    reactionDelay,
    aggression,
    attackCooldown,
    attackWindup,
    dodgeChance,
    dodgeCooldown,
    predictionStrength,
    comboComplexity,
    attackRange,
    projectileSpeed,
    projectileAccuracy,
    retreatIntelligence,
    arenaControl,
    phaseCount,
  };
}
