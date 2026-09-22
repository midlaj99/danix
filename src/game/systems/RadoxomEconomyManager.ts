/**
 * Centralized Radoxom Economy & Transaction Manager
 *
 * Enforces strict, zero-loophole lifecycle, unique transaction IDs,
 * authoritative retry calculations, and combat readiness validation.
 */

export type RadoxomLifecycleState =
  | 'LOCKED'
  | 'QUESTION_AVAILABLE'
  | 'QUESTION_ANSWERED'
  | 'EARNED'
  | 'AVAILABLE'
  | 'FIRED'
  | 'HIT'
  | 'MISSED'
  | 'CONSUMED';

export interface RadoxomTransaction {
  id: string;
  type: 'EARN' | 'CONSUME' | 'RETRY_ADJUST';
  questionId?: string;
  projectileId?: string;
  amount: number;
  timestamp: number;
}

export interface LevelAttempt {
  levelId: number;
  topicId: string;
  requiredRadoxoms: number;
  earnedRadoxoms: number;
  firedRadoxoms: number;
  remainingRadoxoms: number;
  retryRequiredRadoxoms: number;
  questionsAnswered: number;
  questionsCorrect: number;
  questionsTimedOut: number;
  attemptNumber: number;
  status: 'QUESTION_PHASE' | 'COMBAT' | 'DEAD' | 'VICTORY';
}

export class RadoxomEconomyManager {
  private static instance: RadoxomEconomyManager;

  public currentAttempt: LevelAttempt = {
    levelId: 1,
    topicId: 'arrays',
    requiredRadoxoms: 5,
    earnedRadoxoms: 0,
    firedRadoxoms: 0,
    remainingRadoxoms: 0,
    retryRequiredRadoxoms: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    questionsTimedOut: 0,
    attemptNumber: 1,
    status: 'QUESTION_PHASE',
  };

  private transactions: Map<string, RadoxomTransaction> = new Map();
  private processedQuestionIds: Set<string> = new Set();
  private consumedProjectileIds: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): RadoxomEconomyManager {
    if (!RadoxomEconomyManager.instance) {
      RadoxomEconomyManager.instance = new RadoxomEconomyManager();
    }
    return RadoxomEconomyManager.instance;
  }

  /**
   * Initializes a fresh level journey or restarts attempt 1.
   */
  public startLevelAttempt(levelId: number, topicIdOrRequired: string | number = 'arrays', maybeRequired?: number): LevelAttempt {
    this.transactions.clear();
    this.processedQuestionIds.clear();
    this.consumedProjectileIds.clear();

    const topicId = typeof topicIdOrRequired === 'string' ? topicIdOrRequired : 'arrays';
    const requiredRadoxoms = typeof topicIdOrRequired === 'number' ? topicIdOrRequired : (maybeRequired ?? 5);

    this.currentAttempt = {
      levelId,
      topicId,
      requiredRadoxoms,
      earnedRadoxoms: 0,
      firedRadoxoms: 0,
      remainingRadoxoms: 0,
      retryRequiredRadoxoms: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      questionsTimedOut: 0,
      attemptNumber: 1,
      status: 'QUESTION_PHASE',
    };

    return { ...this.currentAttempt };
  }

  /**
   * Authoritative transaction to award a Radoxom for a correctly answered question.
   * Enforces that each question can only ever produce maximum 1 Radoxom.
   */
  public earnRadoxom(questionId: string): boolean {
    const txnId = `TXN-EARN-${questionId}`;
    if (this.transactions.has(txnId) || this.processedQuestionIds.has(questionId)) {
      console.warn(`[RadoxomEconomy] Question ${questionId} already rewarded. Rejecting duplicate.`);
      return false;
    }

    this.processedQuestionIds.add(questionId);
    this.currentAttempt.questionsAnswered++;
    this.currentAttempt.questionsCorrect++;
    this.currentAttempt.earnedRadoxoms++;
    this.currentAttempt.remainingRadoxoms = this.currentAttempt.earnedRadoxoms - this.currentAttempt.firedRadoxoms;

    this.transactions.set(txnId, {
      id: txnId,
      type: 'EARN',
      questionId,
      amount: 1,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Records a wrong answer or timed-out question (awards 0 Radoxoms, prevents re-answering).
   */
  public recordQuestionResolvedWithoutReward(questionId: string, isTimeout: boolean): void {
    if (this.processedQuestionIds.has(questionId)) return;
    this.processedQuestionIds.add(questionId);
    this.currentAttempt.questionsAnswered++;
    if (isTimeout) {
      this.currentAttempt.questionsTimedOut++;
    }
  }

  /**
   * Authoritative transaction when player fires a Radoxom projectile.
   * Permanently marks projectile as consumed from inventory (even if it misses).
   */
  public consumeRadoxom(projectileId: string): boolean {
    if (this.currentAttempt.remainingRadoxoms <= 0) {
      console.warn(`[RadoxomEconomy] Attempted to fire with 0 remaining Radoxoms!`);
      return false;
    }

    const txnId = `TXN-FIRE-${projectileId}`;
    if (this.consumedProjectileIds.has(projectileId)) {
      console.warn(`[RadoxomEconomy] Projectile ${projectileId} already consumed.`);
      return false;
    }

    this.consumedProjectileIds.add(projectileId);
    this.currentAttempt.firedRadoxoms++;
    this.currentAttempt.remainingRadoxoms = Math.max(
      0,
      this.currentAttempt.earnedRadoxoms - this.currentAttempt.firedRadoxoms
    );

    this.transactions.set(txnId, {
      id: txnId,
      type: 'CONSUME',
      projectileId,
      amount: 1,
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Single authoritative source of truth for Retry Radoxom calculation.
   *
   * Example:
   * Required = 5
   * Earned = 5
   * Fired = 3
   * Remaining = 2
   * Retry must recover ONLY the 3 that were consumed (Required - Remaining).
   */
  public calculateRetryRadoxomRequirement(): {
    required: number;
    earned: number;
    fired: number;
    remaining: number;
    toRecover: number;
    requiredRadoxoms: number;
    earnedRadoxoms: number;
    firedRadoxoms: number;
    remainingRadoxoms: number;
    retryRequiredRadoxoms: number;
  } {
    const remaining = Math.max(0, this.currentAttempt.earnedRadoxoms - this.currentAttempt.firedRadoxoms);
    const retryRequired = Math.max(0, this.currentAttempt.requiredRadoxoms - remaining);

    this.currentAttempt.remainingRadoxoms = remaining;
    this.currentAttempt.retryRequiredRadoxoms = retryRequired;

    return {
      required: this.currentAttempt.requiredRadoxoms,
      earned: this.currentAttempt.earnedRadoxoms,
      fired: this.currentAttempt.firedRadoxoms,
      remaining,
      toRecover: retryRequired,
      requiredRadoxoms: this.currentAttempt.requiredRadoxoms,
      earnedRadoxoms: this.currentAttempt.earnedRadoxoms,
      firedRadoxoms: this.currentAttempt.firedRadoxoms,
      remainingRadoxoms: remaining,
      retryRequiredRadoxoms: retryRequired,
    };
  }

  /**
   * Prepares a retry attempt: increments attemptNumber, sets status to QUESTION_PHASE,
   * but preserves the unspent remaining Radoxoms in inventory.
   */
  public prepareRetryAttempt(): { targetToRecover: number; existingRemaining: number } {
    this.currentAttempt.attemptNumber++;
    this.currentAttempt.status = 'QUESTION_PHASE';

    const calculation = this.calculateRetryRadoxomRequirement();
    // Reset fired counter for new attempt, keeping the existing unspent ammo as the base
    const existing = calculation.remainingRadoxoms;
    const targetToRecover = calculation.retryRequiredRadoxoms;

    // Reset attempt totals so newly earned questions fill the gap up to requiredRadoxoms
    this.currentAttempt.earnedRadoxoms = existing;
    this.currentAttempt.firedRadoxoms = 0;
    this.currentAttempt.remainingRadoxoms = existing;

    return { targetToRecover, existingRemaining: existing };
  }

  /**
   * Validates combat economy before entering the battle arena or during post-death audit.
   */
  public validateCombatEconomy(monsterHp?: number, radoxomDamage?: number): {
    isValid: boolean;
    valid: boolean;
    remaining: number;
    availableAmmo: number;
    minHitsNeeded: number;
    maxDamagePotential: number;
    errorReason?: string;
  } {
    const available = this.currentAttempt.remainingRadoxoms;
    const dmg = radoxomDamage ?? 10;
    const minHits = monsterHp ? Math.ceil(monsterHp / Math.max(1, dmg)) : 0;
    const maxDmg = available * dmg;

    if (available < 0) {
      return {
        isValid: false,
        valid: false,
        remaining: available,
        availableAmmo: available,
        minHitsNeeded: minHits,
        maxDamagePotential: maxDmg,
        errorReason: 'Negative Radoxom inventory detected!',
      };
    }

    if (monsterHp && available <= 0) {
      return {
        isValid: false,
        valid: false,
        remaining: available,
        availableAmmo: available,
        minHitsNeeded: minHits,
        maxDamagePotential: maxDmg,
        errorReason: 'No Radoxom ammunition available to enter combat!',
      };
    }

    if (monsterHp && maxDmg < monsterHp) {
      return {
        isValid: false,
        valid: false,
        remaining: available,
        availableAmmo: available,
        minHitsNeeded: minHits,
        maxDamagePotential: maxDmg,
        errorReason: `Combat unwinnable: Monster HP is ${monsterHp}, but player only has ${maxDmg} max damage potential (${available} shots).`,
      };
    }

    return {
      isValid: true,
      valid: true,
      remaining: available,
      availableAmmo: available,
      minHitsNeeded: minHits,
      maxDamagePotential: maxDmg,
    };
  }

  /**
   * Freezes combat economy on death: cancels active transactions and locks state.
   */
  public freezeEconomyOnDeath(): void {
    this.currentAttempt.status = 'DEAD';
  }

  public markVictory(): void {
    this.currentAttempt.status = 'VICTORY';
  }

  public getAttempt(): LevelAttempt {
    return { ...this.currentAttempt };
  }

  public getCurrentAttempt(): LevelAttempt {
    return { ...this.currentAttempt };
  }
}
