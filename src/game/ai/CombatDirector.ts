import { CombatDifficulty, DifficultyTier, getDifficultyTier } from '../systems/CombatDifficultySystem';

export type CombatDistanceTier = 'TOO_CLOSE' | 'CLOSE' | 'OPTIMAL' | 'LONG' | 'TOO_FAR';

export type AIMovementIntent =
  | 'APPROACH'
  | 'RETREAT'
  | 'FLANK_LEFT'
  | 'FLANK_RIGHT'
  | 'CIRCLE_CW'
  | 'CIRCLE_CCW'
  | 'FEINT'
  | 'GUARD'
  | 'HOLD';

export type AIAttackIntent =
  | 'NONE'
  | 'MELEE_SLASH'
  | 'DASH_STRIKE'
  | 'JUMP_SLAM'
  | 'PROJECTILE_FAST'
  | 'PROJECTILE_SLOW'
  | 'PROJECTILE_BURST'
  | 'PROJECTILE_TRACKING'
  | 'SHOCKWAVE'
  | 'ARENA_HAZARD'
  | 'AERIAL_DIVE'
  | 'COMBO_CHAIN';

export interface UtilityScores {
  attackScore: number;
  chaseScore: number;
  retreatScore: number;
  dodgeScore: number;
  flankScore: number;
  comboScore: number;
  rangedScore: number;
  areaAttackScore: number;
  guardScore: number;
  repositionScore: number;
}

export interface PlayerPatternMetrics {
  dodgeLeftCount: number;
  dodgeRightCount: number;
  jumpCount: number;
  stationaryTime: number;
  attackSpamCount: number;
  averageDistance: number;
  dominantDodgeDirection: 'left' | 'right' | 'none';
  isCamping: boolean;
  isSpammingAttack: boolean;
  isSpammingDodge: boolean;
}

export interface MonsterCombatTelemetry {
  monsterAverageSpeed: number;
  monsterMovementDistance: number;
  monsterIdleTime: number;
  monsterDodgeCount: number;
  monsterAttackCount: number;
  monsterRepositionCount: number;
  monsterProjectileAvoidanceCount: number;
  monsterTimeWithoutMovement: number;
  hasStaticWarning: boolean;
}

export interface CombatAIDebugSnapshot {
  state: string;
  movementIntent: AIMovementIntent;
  attackIntent: AIAttackIntent;
  targetDistance: number;
  distanceTier: CombatDistanceTier;
  utilityScores: UtilityScores;
  phase: number;
  dodgeCharges: number;
  maxDodgeCharges: number;
  isGuarding: boolean;
  isFeinting: boolean;
  playerMetrics: PlayerPatternMetrics;
  telemetry?: MonsterCombatTelemetry;
}

/**
 * Tracks and analyzes player behavioral patterns in real-time over rolling windows.
 */
export class PlayerBehaviorAnalyzer {
  public metrics: PlayerPatternMetrics = {
    dodgeLeftCount: 0,
    dodgeRightCount: 0,
    jumpCount: 0,
    stationaryTime: 0,
    attackSpamCount: 0,
    averageDistance: 250,
    dominantDodgeDirection: 'none',
    isCamping: false,
    isSpammingAttack: false,
    isSpammingDodge: false,
  };

  private lastHeroX: number = 0;
  private lastHeroY: number = 0;
  private wasHeroGrounded: boolean = true;
  private wasHeroDodging: boolean = false;
  private recentAttackTimestamps: number[] = [];
  private rollingDistances: number[] = [];

  public update(
    dt: number,
    heroX: number,
    heroY: number,
    heroVx: number,
    _heroVy: number,
    heroIsDodging: boolean,
    heroIsGrounded: boolean,
    monsterX: number
  ): void {
    // 1. Stationary camping detector
    const distMoved = Math.abs(heroX - this.lastHeroX);
    if (distMoved < 3 && Math.abs(heroVx) < 15) {
      this.metrics.stationaryTime += dt;
    } else {
      this.metrics.stationaryTime = Math.max(0, this.metrics.stationaryTime - dt * 2.0);
    }
    this.metrics.isCamping = this.metrics.stationaryTime > 0.45;

    // 2. Dodge direction detection
    if (heroIsDodging && !this.wasHeroDodging) {
      if (heroVx < -10) {
        this.metrics.dodgeLeftCount++;
      } else if (heroVx > 10) {
        this.metrics.dodgeRightCount++;
      }
    }
    this.wasHeroDodging = heroIsDodging;

    // Evaluate dominant dodge direction
    const totalDodges = this.metrics.dodgeLeftCount + this.metrics.dodgeRightCount;
    if (totalDodges >= 3) {
      if (this.metrics.dodgeLeftCount / totalDodges > 0.65) {
        this.metrics.dominantDodgeDirection = 'left';
      } else if (this.metrics.dodgeRightCount / totalDodges > 0.65) {
        this.metrics.dominantDodgeDirection = 'right';
      } else {
        this.metrics.dominantDodgeDirection = 'none';
      }
      this.metrics.isSpammingDodge = totalDodges >= 5;
    }

    // 3. Jump detection
    if (!heroIsGrounded && this.wasHeroGrounded) {
      this.metrics.jumpCount++;
    }
    this.wasHeroGrounded = heroIsGrounded;

    // 4. Rolling average distance
    const currentDist = Math.abs(heroX - monsterX);
    this.rollingDistances.push(currentDist);
    if (this.rollingDistances.length > 30) {
      this.rollingDistances.shift();
    }
    const sum = this.rollingDistances.reduce((a, b) => a + b, 0);
    this.metrics.averageDistance = Math.round(sum / this.rollingDistances.length);

    // 5. Clean up old attack timestamps (rolling 2.5s window)
    const now = performance.now();
    this.recentAttackTimestamps = this.recentAttackTimestamps.filter((t) => now - t < 2500);
    this.metrics.attackSpamCount = this.recentAttackTimestamps.length;
    this.metrics.isSpammingAttack = this.recentAttackTimestamps.length >= 4;

    this.lastHeroX = heroX;
    this.lastHeroY = heroY;
  }

  public recordPlayerAttack(): void {
    this.recentAttackTimestamps.push(performance.now());
  }
}

/**
 * CombatDirector orchestrates high-level tactical decisions, utility scores,
 * orbital circle strafing, flanking paths, combo branching, and adaptive counters.
 */
export class CombatDirector {
  public analyzer: PlayerBehaviorAnalyzer = new PlayerBehaviorAnalyzer();
  public difficulty: CombatDifficulty;
  public tier: DifficultyTier;

  // Decision interval timer (decoupled from 60fps render loop: 6-10 updates/sec)
  private decisionTimer: number = 0;
  private readonly DECISION_INTERVAL: number = 0.12;

  // Current intents
  public movementIntent: AIMovementIntent = 'APPROACH';
  public attackIntent: AIAttackIntent = 'NONE';
  public distanceTier: CombatDistanceTier = 'OPTIMAL';

  // Defensive Guard & Baiting State
  public isGuarding: boolean = false;
  public guardTimer: number = 0;
  public guardCooldown: number = 0;
  public isFeinting: boolean = false;
  public feintTimer: number = 0;
  public feintCooldown: number = 0;

  // Dodge charges resource
  public dodgeCharges: number = 1;
  public maxDodgeCharges: number = 1;
  public dodgeChargeRechargeTimer: number = 0;
  public readonly DODGE_RECHARGE_TIME: number = 4.5;

  // Circle strafe angle & speed
  public circleAngle: number = 0;
  public circleDirection: number = 1; // 1 = clockwise, -1 = counter-clockwise
  public circleSwitchTimer: number = 0;

  // Flank steering position
  public flankTargetX: number = 0;

  // Desired Combat Navigation & Footwork Solver
  public desiredCombatPositionX: number = 700;
  public minCombatDistance: number = 110;
  public preferredCombatDistance: number = 200;
  public maxCombatDistance: number = 340;
  public strafeDirection: number = 1;
  public strafeTimer: number = 1.5;
  public microMovementOffset: number = 0;

  // Poise & Stagger Resistance System
  public poise: number = 100;
  public maxPoise: number = 100;
  public poiseRecoveryTimer: number = 0;

  // Utility scores for debug & introspection
  public currentUtility: UtilityScores = {
    attackScore: 0,
    chaseScore: 0,
    retreatScore: 0,
    dodgeScore: 0,
    flankScore: 0,
    comboScore: 0,
    rangedScore: 0,
    areaAttackScore: 0,
    guardScore: 0,
    repositionScore: 0,
  };

  // Branching combo tracking
  public activeComboBranch: string[] | null = null;
  public comboStepIndex: number = 0;
  public comboIntermission: number = 0;

  // Hazard control timer
  public hazardCooldown: number = 0;

  // Development Telemetry & Static Watchdog
  public telemetry: MonsterCombatTelemetry = {
    monsterAverageSpeed: 0,
    monsterMovementDistance: 0,
    monsterIdleTime: 0,
    monsterDodgeCount: 0,
    monsterAttackCount: 0,
    monsterRepositionCount: 0,
    monsterProjectileAvoidanceCount: 0,
    monsterTimeWithoutMovement: 0,
    hasStaticWarning: false,
  };
  public isUnderAimThreat: boolean = false;
  private totalCombatTime: number = 0;
  private lastMonsterX: number = 0;

  constructor(difficulty: CombatDifficulty) {
    this.difficulty = difficulty;
    this.tier = getDifficultyTier(difficulty.level);

    // Poise scales by level and archetype
    this.maxPoise = Math.round(90 + difficulty.level * 2.8);
    this.poise = this.maxPoise;

    // Dodge charges scale by tier
    if (this.difficulty.level >= 26) {
      this.maxDodgeCharges = 3;
    } else if (this.difficulty.level >= 11) {
      this.maxDodgeCharges = 2;
    } else {
      this.maxDodgeCharges = 1;
    }
    this.dodgeCharges = this.maxDodgeCharges;
  }

  /**
   * Main director update loop.
   */
  public update(
    dt: number,
    monsterX: number,
    monsterY: number,
    monsterHp: number,
    monsterMaxHp: number,
    heroX: number,
    heroY: number,
    heroVx: number,
    heroVy: number,
    heroIsDodging: boolean,
    heroIsGrounded: boolean,
    monsterState: string,
    attackCooldown: number,
    arenaMinX: number,
    arenaMaxX: number,
    isFlying: boolean,
    heroAimAngle?: number,
    monsterVx: number = 0
  ): void {
    // 0. Update Development Telemetry & Aim Threat Detection
    this.totalCombatTime += dt;
    const moved = Math.abs(monsterX - (this.lastMonsterX || monsterX));
    this.telemetry.monsterMovementDistance += moved;
    this.telemetry.monsterAverageSpeed = this.totalCombatTime > 0
      ? this.telemetry.monsterMovementDistance / this.totalCombatTime
      : 0;
    this.lastMonsterX = monsterX;

    if (Math.abs(monsterVx) < 15 && moved < 2 && monsterState !== 'attack' && monsterState !== 'hurt') {
      this.telemetry.monsterIdleTime += dt;
      this.telemetry.monsterTimeWithoutMovement += dt;
      if (this.telemetry.monsterTimeWithoutMovement >= 2.5) {
        this.telemetry.hasStaticWarning = true;
      }
    } else {
      this.telemetry.monsterTimeWithoutMovement = Math.max(0, this.telemetry.monsterTimeWithoutMovement - dt * 2);
      this.telemetry.hasStaticWarning = false;
    }

    if (heroAimAngle !== undefined) {
      const angleToMonster = Math.atan2(monsterY - heroY, monsterX - heroX);
      let diff = Math.abs(heroAimAngle - angleToMonster);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      this.isUnderAimThreat = diff < 0.28;
    } else {
      this.isUnderAimThreat = false;
    }

    // 1. Update player pattern analyzer
    this.analyzer.update(
      dt,
      heroX,
      heroY,
      heroVx,
      heroVy,
      heroIsDodging,
      heroIsGrounded,
      monsterX
    );

    // 2. Recharge dodge charges
    if (this.dodgeCharges < this.maxDodgeCharges) {
      this.dodgeChargeRechargeTimer += dt;
      if (this.dodgeChargeRechargeTimer >= this.DODGE_RECHARGE_TIME) {
        this.dodgeCharges++;
        this.dodgeChargeRechargeTimer = 0;
      }
    }

    // 3. Update timers
    if (this.guardTimer > 0) {
      this.guardTimer -= dt;
      if (this.guardTimer <= 0) this.isGuarding = false;
    }
    if (this.guardCooldown > 0) this.guardCooldown -= dt;
    if (this.feintTimer > 0) {
      this.feintTimer -= dt;
      if (this.feintTimer <= 0) this.isFeinting = false;
    }
    if (this.feintCooldown > 0) this.feintCooldown -= dt;
    if (this.hazardCooldown > 0) this.hazardCooldown -= dt;
    if (this.comboIntermission > 0) this.comboIntermission -= dt;

    // 4. Orbital Circle Strafe Angle Updates
    this.circleSwitchTimer -= dt;
    if (this.circleSwitchTimer <= 0) {
      this.circleDirection = Math.random() < 0.5 ? 1 : -1;
      this.circleSwitchTimer = 1.8 + Math.random() * 2.2;
    }
    this.circleAngle += dt * (1.2 + this.difficulty.aggression * 0.8) * this.circleDirection;

    // 5. Poise Recovery
    this.updatePoise(dt);

    // 6. Evaluate Utility-Based AI decisions (6-10x/sec)
    this.decisionTimer += dt;
    if (this.decisionTimer >= this.DECISION_INTERVAL) {
      this.decisionTimer = 0;
      this.evaluateUtilityDecisions(
        monsterX,
        monsterY,
        monsterHp,
        monsterMaxHp,
        heroX,
        heroY,
        heroVx,
        heroVy,
        monsterState,
        attackCooldown,
        arenaMinX,
        arenaMaxX,
        isFlying
      );
    }

    // 7. Continuous Footwork & Desired Combat Position Solver (every frame)
    this.updateDesiredCombatPosition(
      dt,
      monsterX,
      heroX,
      heroVx,
      arenaMinX,
      arenaMaxX,
      isFlying
    );
  }

  /**
   * Continuous navigation footwork solver calculating desired ground/aerial X.
   * Eliminates 1D deadlocks, static freezes, and corner trapping.
   */
  public updateDesiredCombatPosition(
    dt: number,
    monsterX: number,
    heroX: number,
    heroVx: number,
    arenaMinX: number,
    arenaMaxX: number,
    isFlying: boolean
  ): void {
    // 1. Footwork cadence & dynamic strafe alternations
    this.strafeTimer -= dt;
    if (this.strafeTimer <= 0) {
      this.strafeDirection = Math.random() < 0.5 ? 1 : -1;
      this.strafeTimer = 1.2 + Math.random() * 1.6;
    }

    // Micro-movement continuous sine oscillation (keeps feet moving)
    this.microMovementOffset = Math.sin(this.circleAngle * 1.5) * (25 + this.difficulty.aggression * 20);

    // 2. Adjust preferred combat distance
    if (isFlying) {
      this.preferredCombatDistance = 240 + this.difficulty.level * 1.5;
    } else if (this.difficulty.attackRange > 180) {
      this.preferredCombatDistance = 210 + this.difficulty.level * 1.2;
    } else {
      this.preferredCombatDistance = 145 + Math.min(60, this.difficulty.level * 1.4);
    }

    // 3. Player future intercept prediction
    const leadTime = 0.15 + this.difficulty.predictionStrength * 0.35;
    const predictedHeroX = heroX + heroVx * leadTime;

    // 4. Direction relative to player
    const side = monsterX >= heroX ? 1 : -1;

    let targetX = monsterX;

    switch (this.movementIntent) {
      case 'APPROACH': {
        // Close distance actively
        targetX = predictedHeroX + side * this.minCombatDistance + this.microMovementOffset * 0.5;
        break;
      }

      case 'RETREAT': {
        // Back off to recover or create spacing
        targetX = predictedHeroX + side * (this.preferredCombatDistance * 1.35) + this.microMovementOffset;
        break;
      }

      case 'FLANK_LEFT': {
        // Maneuver to player's left flank
        targetX = predictedHeroX - this.preferredCombatDistance;
        break;
      }

      case 'FLANK_RIGHT': {
        // Maneuver to player's right flank
        targetX = predictedHeroX + this.preferredCombatDistance;
        break;
      }

      case 'FEINT': {
        // Sudden rush in then stutter
        targetX = predictedHeroX + side * (this.minCombatDistance * 0.7);
        break;
      }

      case 'CIRCLE_CW':
      case 'CIRCLE_CCW': {
        // Continuous orbit around preferred distance
        const orbitDir = this.movementIntent === 'CIRCLE_CW' ? 1 : -1;
        targetX = predictedHeroX + (side * this.preferredCombatDistance) + (orbitDir * 40) + this.microMovementOffset;
        break;
      }

      case 'GUARD': {
        // Steady cautious spacing
        targetX = predictedHeroX + side * (this.preferredCombatDistance * 0.9);
        break;
      }

      case 'HOLD':
      default: {
        targetX = predictedHeroX + side * this.preferredCombatDistance + this.microMovementOffset;
        break;
      }
    }

    // 5. Corner Trap Prevention & Arena Wall Pushback
    const arenaMargin = 85;
    if (monsterX < arenaMinX + arenaMargin) {
      // Monster backed into left wall: aggressively target rightward safe space
      targetX = Math.max(arenaMinX + arenaMargin + 50, heroX + this.preferredCombatDistance);
    } else if (monsterX > arenaMaxX - arenaMargin) {
      // Monster backed into right wall: aggressively target leftward safe space
      targetX = Math.min(arenaMaxX - arenaMargin - 50, heroX - this.preferredCombatDistance);
    }

    // Clamp to valid navigable arena bounds
    this.desiredCombatPositionX = Math.max(arenaMinX + 50, Math.min(arenaMaxX - 50, targetX));
  }

  /**
   * Deducts poise on incoming hit.
   * Returns true ONLY if poise breaks (causing stagger).
   * Normal hits do not break poise and do not interrupt actions.
   */
  public takePoiseDamage(damage: number): boolean {
    this.poiseRecoveryTimer = 1.25;
    this.poise -= damage;

    if (this.poise <= 0) {
      this.poise = this.maxPoise; // Reset poise after break
      return true; // Poise broken -> heavy stagger!
    }

    return false; // Stagger resisted!
  }

  public updatePoise(dt: number): void {
    if (this.poiseRecoveryTimer > 0) {
      this.poiseRecoveryTimer -= dt;
    } else if (this.poise < this.maxPoise) {
      this.poise = Math.min(this.maxPoise, this.poise + dt * 45);
    }
  }

  /**
   * Immediate punitive counter-attack when player camps or launches static attacks.
   */
  public triggerImmediatePunish(heroX: number): void {
    const dist = Math.abs(heroX - this.desiredCombatPositionX);
    if (dist < 260) {
      this.attackIntent = 'DASH_STRIKE';
    } else {
      this.attackIntent = 'SHOCKWAVE';
    }
    this.movementIntent = 'APPROACH';
  }

  /**
   * Predictive anticipatory projectile avoidance.
   * Evaluates incoming projectile flight paths before impact.
   */
  public evaluateIncomingProjectiles(
    projectiles: { x: number; y: number; vx: number; vy: number; radius?: number }[],
    monsterX: number,
    monsterY: number,
    monsterWidth: number,
    monsterHeight: number,
    isVulnerable: boolean,
    isGuarding: boolean
  ): { shouldDodge: boolean; dodgeDir: number; isLeap: boolean } {
    if (
      this.dodgeCharges <= 0 ||
      isVulnerable ||
      isGuarding
    ) {
      return { shouldDodge: false, dodgeDir: 0, isLeap: false };
    }

    const monsterCenterX = monsterX + monsterWidth / 2;
    const monsterCenterY = monsterY + monsterHeight / 2;

    for (const p of projectiles) {
      const dx = monsterCenterX - p.x;
      const dy = monsterCenterY - p.y;
      const dist = Math.hypot(dx, dy);

      // Check if projectile is flying towards the monster within threat window (300px)
      const isApproachingX = (p.vx > 20 && p.x < monsterCenterX) || (p.vx < -20 && p.x > monsterCenterX);
      if (dist < 320 && isApproachingX) {
        // Calculate estimated time to impact
        const speed = Math.hypot(p.vx, p.vy);
        const timeToImpact = dist / Math.max(150, speed);

        // Anticipate within 0.12s to 0.45s window
        if (timeToImpact <= 0.45) {
          // Check dodge roll against scaled difficulty dodgeChance
          const chance = this.difficulty.dodgeChance;
          if (Math.random() < chance) {
            if (this.tryConsumeDodgeCharge()) {
              const dodgeDir = p.vx > 0 ? 1 : -1;
              const isLeap = Math.random() < 0.35 + this.difficulty.aggression * 0.3;
              return { shouldDodge: true, dodgeDir, isLeap };
            }
          }
        }
      }
    }

    return { shouldDodge: false, dodgeDir: 0, isLeap: false };
  }

  /**
   * Evaluates combat distance tier based on archetype and current separation.
   */
  public classifyDistance(distance: number, preferredDist: number): CombatDistanceTier {
    if (distance < preferredDist * 0.5) return 'TOO_CLOSE';
    if (distance < preferredDist * 0.85) return 'CLOSE';
    if (distance <= preferredDist * 1.35) return 'OPTIMAL';
    if (distance <= preferredDist * 2.2) return 'LONG';
    return 'TOO_FAR';
  }

  /**
   * Utility-based AI decision engine.
   */
  private evaluateUtilityDecisions(
    monsterX: number,
    monsterY: number,
    monsterHp: number,
    monsterMaxHp: number,
    heroX: number,
    _heroY: number,
    heroVx: number,
    _heroVy: number,
    monsterState: string,
    attackCooldown: number,
    arenaMinX: number,
    arenaMaxX: number,
    isFlying: boolean
  ): void {
    const dx = heroX - monsterX;
    const distance = Math.abs(dx);
    const preferredDist = Math.max(120, this.difficulty.attackRange);
    this.distanceTier = this.classifyDistance(distance, preferredDist);

    const hpRatio = monsterHp / monsterMaxHp;
    const isReadyToAttack = attackCooldown <= 0 && monsterState !== 'attack' && monsterState !== 'telegraph_attack';
    const playerIsCamping = this.analyzer.metrics.isCamping;
    const playerIsSpamming = this.analyzer.metrics.isSpammingAttack;
    const isNearArenaWall = monsterX < arenaMinX + 80 || monsterX > arenaMaxX - 80;

    // Initialize Utility Scores (0.0 to 1.0)
    const u: UtilityScores = {
      attackScore: 0,
      chaseScore: 0,
      retreatScore: 0,
      dodgeScore: 0,
      flankScore: 0,
      comboScore: 0,
      rangedScore: 0,
      areaAttackScore: 0,
      guardScore: 0,
      repositionScore: 0,
    };

    // --- 1. Attack Utility ---
    if (isReadyToAttack && (this.distanceTier === 'CLOSE' || this.distanceTier === 'OPTIMAL')) {
      u.attackScore = 0.75 + this.difficulty.aggression * 0.25;
    }

    // --- 2. Chase / Gap Closer Utility ---
    if (this.distanceTier === 'LONG' || this.distanceTier === 'TOO_FAR') {
      u.chaseScore = 0.80 + (playerIsCamping ? 0.20 : 0);
    } else if (this.distanceTier === 'OPTIMAL' && this.difficulty.aggression > 0.6) {
      u.chaseScore = 0.45;
    }

    // --- 3. Retreat / Spacing Utility ---
    if (this.distanceTier === 'TOO_CLOSE') {
      u.retreatScore = 0.70 + (attackCooldown > 0 ? 0.25 : 0);
    } else if (hpRatio < 0.25 && attackCooldown > 0) {
      u.retreatScore = 0.60;
    }

    // --- 4. Flanking Utility ---
    if (this.difficulty.level >= 6) {
      if (playerIsCamping || this.distanceTier === 'OPTIMAL') {
        u.flankScore = 0.65 + (this.analyzer.metrics.dominantDodgeDirection !== 'none' ? 0.25 : 0);
      }
    }

    // --- 5. Combo Utility ---
    if (isReadyToAttack && this.difficulty.comboComplexity >= 2 && (this.distanceTier === 'CLOSE' || this.distanceTier === 'OPTIMAL')) {
      u.comboScore = 0.85;
    }

    // --- 6. Ranged Attack Utility ---
    if (isReadyToAttack && (this.distanceTier === 'OPTIMAL' || this.distanceTier === 'LONG' || isFlying)) {
      u.rangedScore = 0.72 + (isFlying ? 0.20 : 0);
    }

    // --- 7. Area Hazard Utility ---
    if (this.difficulty.arenaControl > 0 && this.hazardCooldown <= 0) {
      if (playerIsCamping) {
        u.areaAttackScore = 0.98; // Severely punish stationary camping!
      } else if (this.distanceTier === 'LONG') {
        u.areaAttackScore = 0.60;
      }
    }

    // --- 8. Defensive Guard Utility ---
    if (playerIsSpamming && this.guardCooldown <= 0 && this.difficulty.level >= 11 && !this.isGuarding) {
      u.guardScore = 0.88;
    }

    // --- 9. Reposition Utility ---
    if (isNearArenaWall) {
      u.repositionScore = 0.90;
    }

    this.currentUtility = u;

    // --- Select Winning Action Based on Highest Utility ---
    if (u.guardScore > 0.85 && Math.random() < 0.8) {
      this.triggerGuard();
      this.movementIntent = 'GUARD';
      this.attackIntent = 'NONE';
      return;
    }

    if (u.repositionScore > 0.85) {
      this.movementIntent = monsterX < arenaMinX + 100 ? 'FLANK_RIGHT' : 'FLANK_LEFT';
      this.attackIntent = 'NONE';
      return;
    }

    // Check high priority attacks
    if (u.areaAttackScore > 0.90) {
      this.attackIntent = 'ARENA_HAZARD';
      this.hazardCooldown = Math.max(3.5, 11 - this.difficulty.level * 0.18);
      return;
    }

    // Baiting check at high levels: if player panics on roll
    if (
      this.difficulty.level >= 16 &&
      this.feintCooldown <= 0 &&
      this.analyzer.metrics.isSpammingDodge &&
      isReadyToAttack &&
      Math.random() < 0.35
    ) {
      this.triggerFeint();
      this.movementIntent = 'FEINT';
      this.attackIntent = 'NONE';
      return;
    }

    // Attack selection
    if (u.comboScore > 0.80) {
      this.attackIntent = 'COMBO_CHAIN';
      this.selectBranchingCombo(distance, heroVx);
      return;
    }

    if (u.attackScore > u.chaseScore && u.attackScore > u.rangedScore) {
      if (this.distanceTier === 'CLOSE' || this.distanceTier === 'TOO_CLOSE') {
        this.attackIntent = 'MELEE_SLASH';
      } else {
        this.attackIntent = Math.random() < 0.6 ? 'DASH_STRIKE' : 'SHOCKWAVE';
      }
      return;
    }

    if (u.rangedScore > u.chaseScore && u.rangedScore > 0.70) {
      if (this.difficulty.level >= 26 && Math.random() < 0.45) {
        this.attackIntent = 'PROJECTILE_BURST';
      } else if (this.difficulty.level >= 16 && Math.random() < 0.4) {
        this.attackIntent = 'PROJECTILE_TRACKING';
      } else {
        this.attackIntent = Math.random() < 0.5 ? 'PROJECTILE_FAST' : 'PROJECTILE_SLOW';
      }
      return;
    }

    // Movement Steering Selection
    if (u.flankScore > 0.60 && this.difficulty.level >= 6) {
      // Counter player's dominant dodge direction
      if (this.analyzer.metrics.dominantDodgeDirection === 'left') {
        this.movementIntent = 'FLANK_LEFT'; // Cut off left side
      } else if (this.analyzer.metrics.dominantDodgeDirection === 'right') {
        this.movementIntent = 'FLANK_RIGHT';
      } else {
        this.movementIntent = this.circleDirection > 0 ? 'CIRCLE_CW' : 'CIRCLE_CCW';
      }
      this.attackIntent = 'NONE';
      return;
    }

    if (u.retreatScore > u.chaseScore) {
      this.movementIntent = 'RETREAT';
      this.attackIntent = 'NONE';
      return;
    }

    if (u.chaseScore > 0.5) {
      this.movementIntent = 'APPROACH';
      this.attackIntent = 'NONE';
      return;
    }

    // Default: Orbital Circle Strafe (Never static standing!)
    this.movementIntent = this.circleDirection > 0 ? 'CIRCLE_CW' : 'CIRCLE_CCW';
    this.attackIntent = 'NONE';
  }

  /**
   * Activates defensive poise guard stance.
   */
  public triggerGuard(): void {
    this.isGuarding = true;
    this.guardTimer = 0.85 + Math.random() * 0.4;
    this.guardCooldown = 3.8 + Math.random() * 1.5;
  }

  /**
   * Triggers a feint bait attack to draw an early panic dodge from player.
   */
  public triggerFeint(): void {
    this.isFeinting = true;
    this.feintTimer = 0.45;
    this.feintCooldown = 4.2;
  }

  /**
   * Consumes a dodge charge if available and returns whether dodge was permitted.
   */
  public tryConsumeDodgeCharge(): boolean {
    if (this.dodgeCharges > 0 && !this.isGuarding) {
      this.dodgeCharges--;
      return true;
    }
    return false;
  }

  /**
   * Dynamic branching combo selection based on distance and player trajectory.
   */
  public selectBranchingCombo(distance: number, heroVx: number): void {
    const roll = Math.random();

    if (this.difficulty.comboComplexity >= 3) {
      // 3-hit dynamic branch
      if (distance < 140) {
        // Melee pressure into shockwave finisher
        this.activeComboBranch = ['slash', 'slash', 'shockwave'];
      } else if (distance < 300) {
        // Gap-closer dash into slash and burst
        this.activeComboBranch = ['dash', 'slash', roll < 0.5 ? 'shockwave' : 'jump_slam'];
      } else {
        // Long range engage: projectile -> dash -> finisher
        this.activeComboBranch = ['projectile', 'dash', heroVx !== 0 ? 'jump_slam' : 'slash'];
      }
    } else {
      // 2-hit combo branch
      if (distance < 160) {
        this.activeComboBranch = ['slash', roll < 0.5 ? 'shockwave' : 'dash'];
      } else {
        this.activeComboBranch = ['dash', 'slash'];
      }
    }

    this.comboStepIndex = 0;
  }

  /**
   * Advances to next strike in combo chain.
   */
  public advanceCombo(): string | null {
    if (!this.activeComboBranch) return null;
    this.comboStepIndex++;
    if (this.comboStepIndex < this.activeComboBranch.length) {
      this.comboIntermission = 0.18; // Short link gap
      return this.activeComboBranch[this.comboStepIndex];
    }
    this.activeComboBranch = null;
    this.comboStepIndex = 0;
    return null;
  }

  /**
   * Generates a real-time debug snapshot for the HUD overlay.
   */
  public getDebugSnapshot(
    monsterState: string = 'idle',
    monsterX: number = 0,
    heroX: number = 0
  ): CombatAIDebugSnapshot {
    return {
      state: monsterState,
      movementIntent: this.movementIntent,
      attackIntent: this.attackIntent,
      targetDistance: Math.round(Math.abs(heroX - monsterX)),
      distanceTier: this.distanceTier,
      utilityScores: { ...this.currentUtility },
      phase: this.difficulty.level >= 36 ? 4 : this.difficulty.level >= 26 ? 3 : this.difficulty.level >= 11 ? 2 : 1,
      dodgeCharges: this.dodgeCharges,
      maxDodgeCharges: this.maxDodgeCharges,
      isGuarding: this.isGuarding,
      isFeinting: this.isFeinting,
      playerMetrics: { ...this.analyzer.metrics },
      telemetry: { ...this.telemetry },
    };
  }
}
