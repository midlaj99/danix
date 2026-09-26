import { MonsterArchetype, MinionArchetype, MonsterSpriteType } from '../../types/curriculum';
import { CombatDifficulty, calculateCombatDifficulty } from '../systems/CombatDifficultySystem';
import { CombatDirector, AIMovementIntent, AIAttackIntent, CombatAIDebugSnapshot } from '../ai/CombatDirector';

export type MonsterState =
  | 'idle'
  | 'patrol'
  | 'chase'
  | 'approach'
  | 'retreat'
  | 'dodge'
  | 'guard'
  | 'telegraph_attack'
  | 'attack'
  | 'hurt'
  | 'death'
  | 'takeoff'
  | 'hover'
  | 'ascend'
  | 'descend'
  | 'circle'
  | 'dive_attack'
  | 'fly_retreat';

export interface AttackDamageContext {
  damage: number;
  attackerX: number;
  attackerY?: number;
  attackerVx: number;
  attackerIsGrounded: boolean;
  attackerIsAirborne: boolean;
  attackerIsDodging: boolean;
  attackerIsStatic: boolean;
  attackType?: string;
  isMeleeSlash?: boolean;
}

export interface HurtResult {
  actualDamage: number;
  wasDeflected: boolean;
  wasGuarded: boolean;
  wasFlank: boolean;
  wasCounterHit: boolean;
  wasMomentumHit: boolean;
  poiseBroken: boolean;
  feedbackText: string;
  feedbackColor: string;
  isCritical: boolean;
}

export class Monster {
  public x: number = 700;
  public y: number = 380;
  public vx: number = 0;
  public vy: number = 0;
  public width: number = 76;
  public height: number = 88;
  public isGrounded: boolean = true;
  public facingRight: boolean = false;
  public config: MonsterArchetype | MinionArchetype;
  public currentHp: number;
  public maxHp: number;

  public state: MonsterState = 'idle';
  public animTimer: number = 0;
  public hurtTimer: number = 0;
  public attackTimer: number = 0;
  public deathTimer: number = 0;
  public isDefeated: boolean = false;

  // Real-time Combat & AI parameters
  public difficulty: CombatDifficulty;
  public director: CombatDirector;
  public level: number = 1;
  public currentPhase: number = 1;
  public attackCooldown: number = 1.8;
  public currentAttackType:
    | 'slash'
    | 'dash'
    | 'jump_slam'
    | 'projectile'
    | 'projectile_fast'
    | 'projectile_slow'
    | 'projectile_burst'
    | 'projectile_tracking'
    | 'shockwave'
    | 'dive' = 'slash';
  public dodgeTimer: number = 0;
  public dodgeCooldown: number = 0;
  public retreatTimer: number = 0;

  // Defense, Poise, and Counterplay Window
  public isGuarding: boolean = false;
  public isVulnerable: boolean = false;
  public vulnerableTimer: number = 0;
  public knockbackVx: number = 0;
  public knockbackVy: number = 0;
  public massFactor: number = 1.0;

  // Dynamic Resistance & Anti-Static Deflection System
  public adaptiveResistance: number = 0;
  public lastHitSide: 'left' | 'right' | 'none' = 'none';
  public consecutiveSideHits: number = 0;
  public isStaggered: boolean = false;
  public guardBreakTimer: number = 0;
  public activeDefenseState: 'NEUTRAL' | 'GUARDING' | 'ADAPTIVE' | 'ENRAGED' | 'STAGGERED' = 'NEUTRAL';

  // Attack Combo Chain State
  public activeCombo: ('slash' | 'dash' | 'jump_slam' | 'projectile' | 'shockwave')[] | null = null;
  public comboIndex: number = 0;
  public comboIntermissionTimer: number = 0;

  // Continuous Dynamic Movement & Strafing
  public strafeDir: number = 1;
  public strafeTimer: number = 0;
  public feintTimer: number = 0;
  public isFeinting: boolean = false;

  // Lightweight Adaptive Combat Memory
  public memory = {
    playerDodgesLeft: 0,
    playerDodgesRight: 0,
    playerStandsStill: 0,
    playerUsesLongRange: 0,
    playerRushesForward: 0,
  };
  public hazardCooldown: number = 0;
  public lastHeroX: number = 0;
  public playerStillTimer: number = 0;
  public staticWatchdogTimer: number = 0;

  // Dynamic Cinematic Entrance
  public isEntering: boolean = true;
  public entranceTimer: number = 0;

  // Combat lunge / dash targets
  public combatOriginX: number = 700;
  public combatTargetX: number | null = null;
  public isLungingToAttack: boolean = false;

  // FSM AI & Telegraphed Attacks
  public isTelegraphing: boolean = false;
  public telegraphTimer: number = 0;
  public telegraphTargetX: number = 0;
  public telegraphTargetY: number = 0;
  private onTelegraphComplete: (() => void) | null = null;

  // Enrage Mode (<40% or <25% HP based on phase count)
  public isEnraged: boolean = false;

  // Scaling & Minion Tag
  public scale: number = 1.0;
  public isMinion: boolean = false;

  // True 2D Flying Aerial Physics Model
  public isFlying: boolean = false;
  public altitude: number = 0; // Current height above ground
  public targetAltitude: number = 175; // Desired flight height
  public aerialAngle: number = 0; // Circling angle around player
  public flyVx: number = 0;
  public flyVy: number = 0;
  public wingPhase: number = 0;
  public isDiving: boolean = false;
  public diveProgress: number = 0;
  public diveStartX: number = 0;
  public diveStartY: number = 0;
  public diveTargetX: number = 0;
  public diveTargetY: number = 0;

  constructor(
    config: MonsterArchetype | MinionArchetype,
    spawnX: number,
    groundY: number,
    isMinion: boolean = false,
    level: number = 1
  ) {
    this.config = config;
    this.level = level;
    this.difficulty = calculateCombatDifficulty(level);
    this.currentHp = config.hp;
    this.maxHp = config.maxHp;
    this.x = spawnX;
    this.combatOriginX = spawnX;
    this.isMinion = isMinion;
    this.attackCooldown = this.difficulty.attackCooldown;
    this.dodgeCooldown = this.difficulty.dodgeCooldown;

    // Check flying capability
    this.isFlying =
      !!config.isFlying ||
      config.spriteType === 'flying_demon' ||
      config.spriteType === 'winged_beast' ||
      config.spriteType === 'guardian_malakor';

    // Scale sizing based on archetype & minion status
    if (isMinion) {
      this.scale = 0.75;
      this.width = 54;
      this.height = 64;
    } else if (config.spriteType === 'guardian_malakor') {
      this.scale = 1.5;
      this.width = 112;
      this.height = 132;
    } else if (
      config.spriteType === 'dragon' ||
      config.spriteType === 'boss' ||
      config.spriteType === 'elite_demon' ||
      config.spriteType === 'winged_beast'
    ) {
      this.scale = 1.35;
      this.width = 100;
      this.height = 118;
    } else if (config.spriteType === 'golem' || config.spriteType === 'armored_demon') {
      this.scale = 1.2;
      this.width = 86;
      this.height = 100;
    } else {
      this.scale = 1.0;
      this.width = 76;
      this.height = 88;
    }

    this.director = new CombatDirector(this.difficulty);

    // Archetype mass factor for physical knockback resistance
    if (config.spriteType === 'golem') {
      this.massFactor = 0.35;
    } else if (config.spriteType === 'armored_demon') {
      this.massFactor = 0.50;
    } else if (
      config.spriteType === 'guardian_malakor' ||
      config.spriteType === 'boss' ||
      config.spriteType === 'dragon'
    ) {
      this.massFactor = 0.45;
    } else if (config.spriteType === 'winged_beast' || config.spriteType === 'elite_demon') {
      this.massFactor = 0.65;
    } else {
      this.massFactor = isMinion ? 1.15 : 0.80;
    }

    if (this.massFactor <= 0.5) {
      this.director.maxPoise = Math.round(this.director.maxPoise * 1.5);
    } else if (isMinion) {
      this.director.maxPoise = Math.round(this.director.maxPoise * 0.7);
    }
    this.director.poise = this.director.maxPoise;

    if (this.isFlying) {
      this.altitude = isMinion ? 130 : 180;
      this.targetAltitude = this.altitude;
      this.y = groundY - this.height - this.altitude;
      this.isGrounded = false;
      this.state = 'hover';
    } else {
      this.y = groundY - this.height;
      this.isGrounded = true;
    }
  }

  public update(dt: number) {
    this.animTimer += dt;
    this.wingPhase += dt * (this.isFlying ? 7.0 : 4.0);

    if (this.vulnerableTimer > 0) {
      this.vulnerableTimer -= dt;
      if (this.vulnerableTimer <= 0) {
        this.isVulnerable = false;
      }
    }

    if (this.isEntering) {
      this.entranceTimer += dt;
      if (this.entranceTimer > 1.0) {
        this.isEntering = false;
      }
    }

    // Telegraphed Attack Countdown
    if (this.isTelegraphing) {
      this.telegraphTimer -= dt;
      if (this.telegraphTimer <= 0) {
        this.isTelegraphing = false;
        if (this.onTelegraphComplete) {
          const cb = this.onTelegraphComplete;
          this.onTelegraphComplete = null;
          cb();
        }
      }
    }

    if (this.hurtTimer > 0) {
      this.hurtTimer -= dt;
      if (this.hurtTimer <= 0 && this.state === 'hurt') {
        this.state = this.isFlying ? 'hover' : 'idle';
      }
    }

    if (this.attackTimer > 0) {
      this.attackTimer -= dt;

      if (this.isLungingToAttack && this.combatTargetX !== null) {
        const progress = 1 - this.attackTimer / 0.65;
        if (progress < 0.4) {
          const t = progress / 0.4;
          this.x = this.combatOriginX + (this.combatTargetX - this.combatOriginX) * t;
        } else if (progress < 0.7) {
          this.x = this.combatTargetX;
        } else {
          const t = (progress - 0.7) / 0.3;
          this.x = this.combatTargetX + (this.combatOriginX - this.combatTargetX) * t;
        }
      }

      if (this.attackTimer <= 0 && this.state === 'attack') {
        this.state = this.isFlying ? 'hover' : 'idle';
        this.isLungingToAttack = false;
        this.combatTargetX = null;
        this.x = this.combatOriginX;
      }
    }

    if (this.state === 'death') {
      this.deathTimer += dt;
      if (this.deathTimer > 1.3) {
        this.isDefeated = true;
      }
    }
  }

  /* ------------------- REAL-TIME COMBAT AI LOOP (GROUND & AERIAL) ------------------- */

  public updateRealtimeAI(
    dt: number,
    heroX: number,
    heroY: number,
    heroGrounded: boolean,
    groundY: number,
    arenaMinX: number,
    arenaMaxX: number,
    onSpawnProjectile?: (type: 'orb' | 'shockwave' | 'fireball' | 'fast' | 'slow' | 'tracking' | 'burst' | 'delayed', startX: number, startY: number, targetX: number, targetY: number, dmg: number) => void,
    onExecuteMeleeDamage?: (dmg: number) => void,
    heroVx: number = 0,
    heroVy: number = 0,
    onSpawnHazard?: (x: number, y: number, radius: number, duration: number, warningTime: number) => void,
    heroIsDodging: boolean = false,
    heroAimAngle?: number
  ): void {
    if (this.isDefeated || this.state === 'death') return;

    this.animTimer += dt;
    this.wingPhase += dt * (this.isFlying ? 7.5 : 4.0);
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
    if (this.retreatTimer > 0) this.retreatTimer -= dt;
    if (this.hazardCooldown > 0) this.hazardCooldown -= dt;
    if (this.strafeTimer > 0) this.strafeTimer -= dt;
    if (this.feintTimer > 0) this.feintTimer -= dt;

    // Apply Knockback Physics Damping
    if (Math.abs(this.knockbackVx) > 4) {
      this.x += this.knockbackVx * dt;
      this.knockbackVx *= Math.exp(-6 * dt);
    } else {
      this.knockbackVx = 0;
    }
    if (!this.isFlying) {
      if (Math.abs(this.knockbackVy) > 4 || !this.isGrounded) {
        this.y += this.knockbackVy * dt;
        this.knockbackVy += 980 * dt;
        if (this.y >= groundY - this.height) {
          this.y = groundY - this.height;
          this.knockbackVy = 0;
          this.isGrounded = true;
        }
      }
    }

    // Update Central Combat Director & Utility AI
    this.director.update(
      dt,
      this.x,
      this.y,
      this.currentHp,
      this.maxHp,
      heroX,
      heroY,
      heroVx,
      heroVy,
      heroIsDodging,
      heroGrounded,
      this.state,
      this.attackCooldown,
      arenaMinX,
      arenaMaxX,
      this.isFlying,
      heroAimAngle,
      this.vx
    );
    this.isGuarding = this.director.isGuarding;
    this.isFeinting = this.director.isFeinting;

    // 0. Update Guard Break Stagger & Dynamic Defense
    if (this.guardBreakTimer > 0) {
      this.guardBreakTimer -= dt;
      if (this.guardBreakTimer <= 0) {
        this.isStaggered = false;
      }
    }

    // Dynamic Defense State calculation
    if (this.isStaggered) {
      this.activeDefenseState = 'STAGGERED';
    } else if (this.isGuarding) {
      this.activeDefenseState = 'GUARDING';
    } else if (this.isEnraged) {
      this.activeDefenseState = 'ENRAGED';
    } else if (this.adaptiveResistance > 0.15) {
      this.activeDefenseState = 'ADAPTIVE';
    } else {
      this.activeDefenseState = 'NEUTRAL';
    }

    // Track player stationary camping to punish turret playstyle
    if (Math.abs(heroX - this.lastHeroX) < 4 && Math.abs(heroVx) < 15) {
      this.playerStillTimer += dt;
    } else {
      this.playerStillTimer = Math.max(0, this.playerStillTimer - dt * 1.5);
    }
    this.lastHeroX = heroX;

    // Phase management based on current HP and difficulty phaseCount
    const hpRatio = this.currentHp / this.maxHp;
    if (this.difficulty.phaseCount >= 4) {
      if (hpRatio > 0.75) this.currentPhase = 1;
      else if (hpRatio > 0.5) this.currentPhase = 2;
      else if (hpRatio > 0.25) this.currentPhase = 3;
      else this.currentPhase = 4;
    } else if (this.difficulty.phaseCount >= 3) {
      if (hpRatio > 0.6) this.currentPhase = 1;
      else if (hpRatio > 0.25) this.currentPhase = 2;
      else this.currentPhase = 3;
    } else if (this.difficulty.phaseCount >= 2) {
      if (hpRatio > 0.35) this.currentPhase = 1;
      else this.currentPhase = 2;
    } else {
      this.currentPhase = 1;
    }

    // Enraged state if in final phase or HP <= 38%
    this.isEnraged = hpRatio <= 0.38 || (this.difficulty.phaseCount > 1 && this.currentPhase === this.difficulty.phaseCount);

    const dmgMultiplier = this.difficulty.monsterDamageMultiplier * (this.isEnraged ? 1.25 : 1.0);
    const scaledAttack = Math.round(this.config.attack * dmgMultiplier);

    // Hazard Spawning for Arena Control (severely punishes stationary camping)
    if (onSpawnHazard && this.difficulty.arenaControl > 0 && this.hazardCooldown <= 0) {
      const campTrigger = this.playerStillTimer > 0.45;
      const randomPressure = Math.random() < this.difficulty.arenaControl * 0.04;
      if (campTrigger || randomPressure) {
        const hazardX = campTrigger ? heroX : heroX + (Math.random() - 0.5) * 180;
        const boundedHazardX = Math.max(arenaMinX + 50, Math.min(arenaMaxX - 50, hazardX));
        const radius = Math.min(120, 65 + this.difficulty.level * 1.3);
        const warning = Math.max(0.65, 1.3 - this.difficulty.level * 0.015);
        onSpawnHazard(boundedHazardX, groundY, radius, 3.8, warning);
        this.hazardCooldown = Math.max(3.5, 12 - this.difficulty.level * 0.18);
      }
    }

    // Predictive aim helper using player velocity and prediction strength
    const computePredictedTarget = (projSpeed: number) => {
      const dist = Math.hypot(heroX - this.x, heroY - this.y);
      const leadTime = (dist / Math.max(160, projSpeed)) * this.difficulty.predictionStrength;
      let predX = heroX + heroVx * leadTime;
      let predY = heroY + heroVy * leadTime;
      const spread = (1 - this.difficulty.projectileAccuracy) * 70;
      predX += (Math.random() - 0.5) * spread;
      predY += (Math.random() - 0.5) * (spread * 0.5);
      return { x: predX, y: predY };
    };

    // Hurt recovery (Only halts action if actually staggered by a poise break)
    if (this.state === 'hurt') {
      this.hurtTimer -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      if (!this.isFlying) {
        this.vy += 980 * dt;
        if (this.y >= groundY - this.height) {
          this.y = groundY - this.height;
          this.vy = 0;
          this.isGrounded = true;
        }
      } else {
        this.flyVy += (0 - this.flyVy) * dt * 3;
      }

      if (this.hurtTimer <= 0) {
        this.state = this.isFlying ? 'hover' : 'chase';
      }
      return;
    } else if (this.hurtTimer > 0) {
      // Normal hit with unbroken poise: just decrement visual flash timer without freezing AI!
      this.hurtTimer -= dt;
    }

    // Dodge State Movement (Real Physics: Startup -> Accel -> Decel -> Punish Recovery)
    if (this.state === 'dodge') {
      this.dodgeTimer -= dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Realistic quadratic ease-out deceleration damping
      this.vx *= Math.exp(-3.5 * dt);

      if (!this.isFlying) {
        this.vy += 980 * dt;
        if (this.y >= groundY - this.height) {
          this.y = groundY - this.height;
          this.vy = 0;
          this.isGrounded = true;
        }
      }

      if (this.dodgeTimer <= 0) {
        // Dodge recovery phase: open a brief vulnerable punish window!
        this.state = this.isFlying ? 'hover' : 'chase';
        this.isVulnerable = true;
        this.vulnerableTimer = 0.16; // 160ms recovery punish window!
      }
      return;
    }

    /* ========================================================================= */
    /* 1. TRUE 2D FLYING MONSTER AERIAL MOVEMENT & COMBAT                        */
    /* ========================================================================= */
    if (this.isFlying) {
      this.facingRight = heroX > this.x;

      // Telegraphing dive attack or aerial projectile
      if (this.state === 'telegraph_attack') {
        this.telegraphTimer -= dt;
        const pred = computePredictedTarget(this.difficulty.projectileSpeed);
        this.telegraphTargetX = pred.x;
        this.telegraphTargetY = pred.y;
        this.vx = (Math.random() - 0.5) * 35;
        this.vy = (Math.random() - 0.5) * 25;

        if (this.telegraphTimer <= 0) {
          this.isTelegraphing = false;
          if (this.currentAttackType === 'dive') {
            this.state = 'dive_attack';
            this.isDiving = true;
            this.diveProgress = 0;
            this.diveStartX = this.x;
            this.diveStartY = this.y;
            this.diveTargetX = heroX + heroVx * 0.25;
            this.diveTargetY = groundY - 25;
          } else {
            // Ranged aerial projectile
            this.state = 'attack';
            this.attackTimer = 0.45;
            if (onSpawnProjectile) {
              const pType =
                this.currentAttackType === 'projectile_fast'
                  ? 'fast'
                  : this.currentAttackType === 'projectile_tracking'
                  ? 'tracking'
                  : this.config.spriteType === 'fire_demon'
                  ? 'fireball'
                  : 'orb';
              onSpawnProjectile(pType, this.x, this.y + 20, pred.x, pred.y, scaledAttack);
            }
          }
        }
        return;
      }

      // Executing Swoop Dive Attack (continuous smooth aerial swoop)
      if (this.state === 'dive_attack' && this.isDiving) {
        this.diveProgress += dt * (this.isEnraged ? 1.75 : 1.4);

        if (this.diveProgress < 0.6) {
          // Downward dive phase towards player
          const t = this.diveProgress / 0.6;
          this.x = this.diveStartX + (this.diveTargetX - this.diveStartX) * t;
          this.y = this.diveStartY + (this.diveTargetY - this.diveStartY) * (t * t);

          if (Math.abs(heroX - this.x) < 75 && Math.abs(heroY - this.y) < 75 && onExecuteMeleeDamage) {
            onExecuteMeleeDamage(scaledAttack);
          }
        } else if (this.diveProgress <= 1.0) {
          // Upward swoop ascent phase returning to target altitude
          const t = (this.diveProgress - 0.6) / 0.4;
          const exitX = this.diveTargetX + (this.facingRight ? 190 : -190);
          const exitY = groundY - this.height - this.targetAltitude;
          this.x = this.diveTargetX + (exitX - this.diveTargetX) * t;
          this.y = this.diveTargetY + (exitY - this.diveTargetY) * (t * (2 - t));
        } else {
          // Swoop complete: open counterplay punish window!
          this.isDiving = false;
          this.state = 'hover';
          this.isVulnerable = true;
          this.vulnerableTimer = 0.42;
          this.attackCooldown = (this.isEnraged ? 1.3 : 2.1) * this.difficulty.attackCooldown;
        }

        this.x = Math.max(arenaMinX + 20, Math.min(arenaMaxX - 20, this.x));
        return;
      }

      // Aerial Circling & Continuous Dynamic Altitude Control
      this.aerialAngle += dt * (this.isEnraged ? 2.0 : 1.4);
      const idealHoverY = groundY - this.height - this.targetAltitude + Math.sin(this.aerialAngle * 2.2) * 26;
      const targetHoverX = heroX + (this.facingRight ? -220 : 220) + Math.cos(this.aerialAngle) * 70;

      // Smooth aerial acceleration & drag
      const flySpeedFactor = this.difficulty.movementSpeed / 180;
      this.flyVx += (targetHoverX - this.x) * dt * 2.8 * flySpeedFactor;
      this.flyVy += (idealHoverY - this.y) * dt * 3.8 * flySpeedFactor;
      this.flyVx *= 0.88;
      this.flyVy *= 0.88;

      this.x += this.flyVx * dt;
      this.y += this.flyVy * dt;

      // Check attack trigger for aerial AI
      if (this.attackCooldown <= 0 && !this.isTelegraphing) {
        this.state = 'telegraph_attack';
        this.isTelegraphing = true;
        this.telegraphTimer = this.difficulty.attackWindup * (this.isEnraged ? 0.7 : 1.0);
        this.currentAttackType = Math.random() < 0.6 ? 'dive' : 'projectile';
      }

      this.x = Math.max(arenaMinX + 20, Math.min(arenaMaxX - 20, this.x));
      return;
    }

    /* ========================================================================= */
    /* 2. DYNAMIC GROUND DEMON MOVEMENT & COMBAT                                 */
    /* ========================================================================= */

    // Telegraphing Attack Windup
    if (this.state === 'telegraph_attack') {
      this.telegraphTimer -= dt;
      this.facingRight = heroX > this.x;
      this.vx = 0;

      if (this.telegraphTimer <= 0) {
        this.isTelegraphing = false;
        this.state = 'attack';
        this.attackTimer = 0.55;

        // Launch attack execution based on attack pattern
        if (this.currentAttackType === 'shockwave') {
          if (onSpawnProjectile) {
            const shockwaveTargetX = heroX + (heroVx * 0.2);
            onSpawnProjectile('shockwave', this.x, groundY - 20, shockwaveTargetX, groundY - 20, scaledAttack);
          }
        } else if (this.currentAttackType === 'projectile_fast') {
          if (onSpawnProjectile) {
            const pred = computePredictedTarget(540);
            onSpawnProjectile('fast', this.x, this.y + 20, pred.x, pred.y, scaledAttack);
          }
        } else if (this.currentAttackType === 'projectile_slow') {
          if (onSpawnProjectile) {
            const pred = computePredictedTarget(210);
            onSpawnProjectile('slow', this.x, this.y + 20, pred.x, pred.y, Math.round(scaledAttack * 1.25));
          }
        } else if (this.currentAttackType === 'projectile_tracking') {
          if (onSpawnProjectile) {
            const pred = computePredictedTarget(this.difficulty.projectileSpeed);
            onSpawnProjectile('tracking', this.x, this.y + 20, pred.x, pred.y, scaledAttack);
          }
        } else if (this.currentAttackType === 'projectile_burst') {
          if (onSpawnProjectile) {
            const pred = computePredictedTarget(this.difficulty.projectileSpeed);
            const angles = [-0.24, 0, 0.24];
            for (const offset of angles) {
              const cosA = Math.cos(offset);
              const sinA = Math.sin(offset);
              const dxP = pred.x - this.x;
              const dyP = pred.y - (this.y + 20);
              const rotX = this.x + (dxP * cosA - dyP * sinA);
              const rotY = (this.y + 20) + (dxP * sinA + dyP * cosA);
              onSpawnProjectile('burst', this.x, this.y + 20, rotX, rotY, Math.round(scaledAttack * 0.75));
            }
          }
        } else if (this.currentAttackType === 'projectile') {
          if (onSpawnProjectile) {
            const pred = computePredictedTarget(this.difficulty.projectileSpeed);
            const pType = this.config.spriteType === 'fire_demon' ? 'fireball' : 'orb';
            onSpawnProjectile(pType, this.x, this.y + 20, pred.x, pred.y, scaledAttack);
          }
        } else if (this.currentAttackType === 'dash') {
          const dashSpeed = (this.isEnraged ? 660 : 560) * (this.difficulty.movementSpeed / 180);
          this.vx = (this.facingRight ? 1 : -1) * dashSpeed;
        } else if (this.currentAttackType === 'jump_slam') {
          this.vy = -480;
          this.vx = ((heroX - this.x) / 0.8);
          this.isGrounded = false;
        } else {
          // Melee Slash
          if (Math.abs(heroX - this.x) < 95 && onExecuteMeleeDamage) {
            onExecuteMeleeDamage(scaledAttack);
          }
        }
      }
      return;
    }

    // Active Attack State Movement
    if (this.state === 'attack') {
      this.attackTimer -= dt;

      if (this.currentAttackType === 'dash') {
        this.x += this.vx * dt;
        if (Math.abs(heroX - this.x) < 75 && onExecuteMeleeDamage) {
          onExecuteMeleeDamage(scaledAttack);
        }
      } else if (this.currentAttackType === 'jump_slam') {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += 980 * dt;
        if (this.y >= groundY - this.height) {
          this.y = groundY - this.height;
          this.vy = 0;
          this.isGrounded = true;
          if (Math.abs(heroX - this.x) < 100 && onExecuteMeleeDamage) {
            onExecuteMeleeDamage(scaledAttack);
          }
        }
      }

      if (this.attackTimer <= 0) {
        // Check if combo continuation is available
        if (this.activeCombo && this.comboIndex < this.activeCombo.length - 1) {
          this.comboIndex++;
          this.currentAttackType = this.activeCombo[this.comboIndex];
          this.state = 'telegraph_attack';
          this.isTelegraphing = true;
          this.telegraphTimer = Math.max(0.2, this.difficulty.attackWindup * 0.45);
          return;
        }

        // Combo or attack finished: open counterplay punish window!
        this.isVulnerable = true;
        this.vulnerableTimer = 0.38;
        this.activeCombo = null;
        this.comboIndex = 0;
        this.state = 'retreat';
        this.retreatTimer = (this.isEnraged ? 0.5 : 0.9) * this.difficulty.retreatIntelligence;
        this.attackCooldown = (this.isEnraged ? this.difficulty.attackCooldown * 0.7 : this.difficulty.attackCooldown);
        this.vx = 0;
      }
      return;
    }

    // Distance & Direction to Player
    const dx = heroX - this.x;
    const distance = Math.abs(dx);
    this.facingRight = dx > 0;

    // Movement speeds & parameters driven by CombatDirector
    const moveSpeed = this.difficulty.movementSpeed * (this.isEnraged ? 1.25 : 1.0) * (this.isMinion ? 1.2 : 1.0);
    const preferredDist = Math.max(120, this.difficulty.attackRange);

    if (this.state === 'retreat') {
      const retreatDir = this.facingRight ? -1 : 1;
      this.vx = retreatDir * (this.isEnraged ? moveSpeed * 1.15 : moveSpeed * 0.95);
      this.x += this.vx * dt;

      if (this.retreatTimer <= 0 || distance > preferredDist + 190) {
        this.state = 'chase';
        this.vx = 0;
      }
    } else if (this.isGuarding) {
      this.state = 'guard';
      this.vx = (this.facingRight ? 1 : -1) * (moveSpeed * 0.25);
      this.x += this.vx * dt;
    } else {
      // Dynamic continuous positioning driven by CombatDirector navigation solver
      this.state = 'chase';

      const targetX = this.director.desiredCombatPositionX;
      const dxToTarget = targetX - this.x;
      const distToTarget = Math.abs(dxToTarget);

      let targetVx = 0;
      if (distToTarget > 12) {
        const steerDir = Math.sign(dxToTarget);
        const speedScale = distToTarget > 160 ? 1.25 : distToTarget > 45 ? 1.0 : 0.72;
        targetVx = steerDir * moveSpeed * speedScale;
      } else {
        // Continuous micro-footwork when at optimal position (keeps feet moving!)
        targetVx = (this.director.circleDirection) * (moveSpeed * 0.45);
      }

      // Smooth acceleration physics (rapid response, eliminating sluggish drift)
      this.vx += (targetVx - this.vx) * Math.min(1.0, dt * 10.0);
      this.x += this.vx * dt;

      // Static Enemy Detection Watchdog (prevents any frozen AI states)
      if (Math.abs(this.vx) < 20) {
        this.staticWatchdogTimer += dt;
        if (this.staticWatchdogTimer >= 1.0) {
          this.staticWatchdogTimer = 0;
          this.director.telemetry.monsterRepositionCount++;
          // Force active dynamic repositioning impulse!
          const repositionDir = this.x > (arenaMinX + arenaMaxX) / 2 ? -1 : 1;
          this.vx = repositionDir * (moveSpeed * 1.35);
          if (this.isGrounded && Math.random() < 0.4) {
            this.vy = -340;
            this.isGrounded = false;
          }
        }
      } else {
        this.staticWatchdogTimer = Math.max(0, this.staticWatchdogTimer - dt * 2.0);
      }

      // Check Attack Trigger driven by CombatDirector attackIntent
      if (this.attackCooldown <= 0 && this.director.attackIntent !== 'NONE') {
        this.state = 'telegraph_attack';
        this.isTelegraphing = true;
        this.telegraphTimer = this.difficulty.attackWindup * (this.isEnraged ? 0.75 : 1.0);
        this.telegraphTargetX = heroX;

        switch (this.director.attackIntent) {
          case 'MELEE_SLASH':
            this.currentAttackType = 'slash';
            this.activeCombo = null;
            break;
          case 'DASH_STRIKE':
            this.currentAttackType = 'dash';
            this.activeCombo = null;
            break;
          case 'JUMP_SLAM':
            this.currentAttackType = 'jump_slam';
            this.activeCombo = null;
            break;
          case 'PROJECTILE_FAST':
            this.currentAttackType = 'projectile_fast';
            this.activeCombo = null;
            break;
          case 'PROJECTILE_SLOW':
            this.currentAttackType = 'projectile_slow';
            this.activeCombo = null;
            break;
          case 'PROJECTILE_BURST':
            this.currentAttackType = 'projectile_burst';
            this.activeCombo = null;
            break;
          case 'PROJECTILE_TRACKING':
            this.currentAttackType = 'projectile_tracking';
            this.activeCombo = null;
            break;
          case 'SHOCKWAVE':
            this.currentAttackType = 'shockwave';
            this.activeCombo = null;
            break;
          case 'COMBO_CHAIN':
            if (this.director.activeComboBranch && this.director.activeComboBranch.length > 0) {
              this.activeCombo = this.director.activeComboBranch as any;
              this.comboIndex = 0;
              this.currentAttackType = this.activeCombo[0] as any;
            } else {
              this.currentAttackType = distance < 140 ? 'slash' : 'dash';
            }
            break;
          default:
            this.currentAttackType = distance < 140 ? 'slash' : 'projectile';
            this.activeCombo = null;
            break;
        }
      }
    }

    this.x = Math.max(arenaMinX, Math.min(arenaMaxX, this.x));
  }

  public attemptDodgeProjectile(projX: number, _projY: number, projVx: number): boolean {
    if (
      this.dodgeCooldown > 0 ||
      this.state === 'attack' ||
      this.state === 'death' ||
      this.isTelegraphing ||
      this.isGuarding ||
      this.isVulnerable
    ) {
      return false;
    }

    const dist = Math.abs(projX - this.x);
    const isHeadingTowardMonster = (projVx > 0 && projX < this.x) || (projVx < 0 && projX > this.x);

    if (dist < 280 && isHeadingTowardMonster) {
      let evasionChance = this.difficulty.dodgeChance;
      if (this.isEnraged) evasionChance = Math.min(0.9, evasionChance * 1.3);

      // Check finite dodge charge resource
      if (!this.director.tryConsumeDodgeCharge()) {
        return false; // Out of dodge charges: player shot connects!
      }

      if (Math.random() < evasionChance) {
        this.state = 'dodge';
        this.dodgeTimer = 0.32;
        this.dodgeCooldown = this.difficulty.dodgeCooldown;
        this.director.telemetry.monsterDodgeCount++;
        this.director.telemetry.monsterProjectileAvoidanceCount++;

        // Smart directional evasion: avoid corner slamming
        let dodgeDir = projVx > 0 ? 1 : -1;
        if (dodgeDir > 0 && this.x > 840) {
          dodgeDir = -1; // Leap forward over incoming shot to reclaim center stage!
        } else if (dodgeDir < 0 && this.x < 160) {
          dodgeDir = 1;
        }

        if (dodgeDir > 0) {
          this.memory.playerDodgesRight++;
        } else {
          this.memory.playerDodgesLeft++;
        }

        if (this.isFlying) {
          this.vx = dodgeDir * (340 + this.difficulty.movementSpeed * 0.5);
          this.vy = -240;
        } else {
          this.vx = dodgeDir * (300 + this.difficulty.movementSpeed * 0.45);
          this.vy = -390;
          this.isGrounded = false;
        }
        return true;
      }
    }
    return false;
  }

  public evaluateAnticipatoryDodges(
    projectiles: { x: number; y: number; vx: number; vy: number; radius?: number }[]
  ): boolean {
    if (
      this.dodgeCooldown > 0 ||
      this.state === 'attack' ||
      this.state === 'death' ||
      this.isTelegraphing ||
      this.isGuarding ||
      this.isVulnerable
    ) {
      return false;
    }

    const result = this.director.evaluateIncomingProjectiles(
      projectiles,
      this.x,
      this.y,
      this.width,
      this.height,
      this.isVulnerable,
      this.isGuarding
    );

    if (result.shouldDodge) {
      this.state = 'dodge';
      this.dodgeTimer = 0.32;
      this.dodgeCooldown = this.difficulty.dodgeCooldown;
      this.director.telemetry.monsterDodgeCount++;
      this.director.telemetry.monsterProjectileAvoidanceCount++;

      let dodgeDir = result.dodgeDir;
      if (dodgeDir > 0 && this.x > 840) {
        dodgeDir = -1;
      } else if (dodgeDir < 0 && this.x < 160) {
        dodgeDir = 1;
      }

      if (this.isFlying) {
        this.vx = dodgeDir * (340 + this.difficulty.movementSpeed * 0.5);
        this.vy = -240;
      } else {
        this.vx = dodgeDir * (300 + this.difficulty.movementSpeed * 0.45);
        this.vy = result.isLeap ? -420 : -280;
        this.isGrounded = false;
      }
      return true;
    }

    return false;
  }

  public applyKnockback(forceX: number, forceY: number = -120): void {
    const eff = 1 / Math.max(0.2, this.massFactor);
    this.knockbackVx = forceX * eff;
    if (!this.isFlying) {
      this.knockbackVy = forceY * eff;
      this.isGrounded = false;
    }
  }

  public punishStaticCamper(heroX: number): void {
    if (this.isDefeated || this.state === 'death' || this.isStaggered) return;
    this.facingRight = heroX > this.x;
    this.director.triggerImmediatePunish(heroX);
    this.attackCooldown = 0.08;
    this.vx = (this.facingRight ? 1 : -1) * (this.difficulty.movementSpeed * 1.6);
  }

  public triggerHurt(
    damage: number,
    context?: AttackDamageContext,
    impactForceX: number = 0,
    impactForceY: number = -120
  ): HurtResult {
    let finalDamage = damage;
    let wasDeflected = false;
    let wasGuarded = false;
    let wasFlank = false;
    let wasCounterHit = false;
    let wasMomentumHit = false;
    let feedbackText = '';
    let feedbackColor = '#ef4444';
    let isCritical = false;

    const attackerX = context ? context.attackerX : (this.facingRight ? this.x - 100 : this.x + 100);
    const attackerIsStatic = context ? context.attackerIsStatic : false;
    const attackerVx = context ? context.attackerVx : 0;
    const attackerIsAirborne = context ? context.attackerIsAirborne : false;
    const attackerIsGrounded = context ? context.attackerIsGrounded : true;

    // 1. STRICT ANTI-STATIC DEFLECTION & IMMEDIATE RETALIATION:
    // If hero attacks from a static stance, the monster completely deflects the blow and retaliates!
    if (attackerIsStatic || (Math.abs(attackerVx) < 20 && !attackerIsAirborne && attackerIsGrounded && context)) {
      wasDeflected = true;
      finalDamage = 0;
      feedbackText = '★ STATIC DEFLECTED! (0 DMG)';
      feedbackColor = '#f59e0b';

      this.director.triggerImmediatePunish(attackerX);
      this.punishStaticCamper(attackerX);

      const kx = this.facingRight ? -40 : 40;
      this.applyKnockback(kx, -40);

      return {
        actualDamage: 0,
        wasDeflected: true,
        wasGuarded: false,
        wasFlank: false,
        wasCounterHit: false,
        wasMomentumHit: false,
        poiseBroken: false,
        feedbackText,
        feedbackColor,
        isCritical: false,
      };
    }

    // 2. GUARD BROKEN / STAGGER VULNERABILITY (+50% DAMAGE)
    if (this.isStaggered || this.guardBreakTimer > 0) {
      finalDamage = Math.round(damage * 1.5);
      feedbackText = `💥 GUARD BROKEN! -${finalDamage}`;
      feedbackColor = '#facc15';
      isCritical = true;
    }
    // 3. COUNTER-HIT VULNERABILITY (During telegraph or recovery windows)
    else if (this.isVulnerable || this.state === 'telegraph_attack') {
      wasCounterHit = true;
      finalDamage = Math.round(damage * 1.4);
      feedbackText = `⚡ COUNTER PUNISH! -${finalDamage}`;
      feedbackColor = '#38bdf8';
      isCritical = true;
    }
    // 4. DYNAMIC DIRECTIONAL DEFENSE: Frontal Guard vs Flank Striking
    else {
      const hitFromFront = (this.facingRight && attackerX < this.x) || (!this.facingRight && attackerX > this.x);

      if (!hitFromFront) {
        // FLANK / BACKSTAB HIT: Bypasses frontal shield!
        wasFlank = true;
        this.consecutiveSideHits = 0;
        this.adaptiveResistance = Math.max(0, this.adaptiveResistance - 0.25);
        finalDamage = Math.round(damage * 1.25);
        feedbackText = `★ FLANK CRIT! -${finalDamage}`;
        feedbackColor = '#a855f7';
        isCritical = true;
      } else {
        // FRONTAL ATTACK: Dynamic Guard & Adaptive Resistance
        const hitSide = attackerX < this.x ? 'left' : 'right';
        if (this.lastHitSide === hitSide) {
          this.consecutiveSideHits++;
          this.adaptiveResistance = Math.min(0.60, this.consecutiveSideHits * 0.15);
        } else {
          this.lastHitSide = hitSide;
          this.consecutiveSideHits = 1;
        }

        if (this.isGuarding) {
          wasGuarded = true;
          finalDamage = Math.max(1, Math.round(damage * 0.25)); // 75% damage reduction
          feedbackText = `🛡️ SHIELD BLOCKED! -${finalDamage}`;
          feedbackColor = '#38bdf8';
        } else {
          const resistPercent = Math.min(0.70, 0.30 + this.adaptiveResistance);
          finalDamage = Math.max(1, Math.round(damage * (1 - resistPercent)));
          wasGuarded = true;
          feedbackText = this.adaptiveResistance > 0.2
            ? `⚡ ADAPTIVE ARMOR! -${finalDamage}`
            : `🛡️ RESISTED! -${finalDamage}`;
          feedbackColor = '#94a3b8';
        }
      }
    }

    // 5. AIRBORNE / HIGH-SPEED MOMENTUM BONUS (+20%)
    if (attackerIsAirborne || Math.abs(attackerVx) > 280) {
      wasMomentumHit = true;
      finalDamage = Math.round(finalDamage * 1.2);
      if (!feedbackText.includes('CRIT') && !feedbackText.includes('BLOCKED')) {
        feedbackText = `☄️ MOMENTUM! -${finalDamage}`;
        feedbackColor = '#34d399';
      }
    }

    // 6. ENRAGED PASSIVE RESISTANCE (< 40% HP)
    if (this.isEnraged && !this.isStaggered) {
      finalDamage = Math.max(1, Math.round(finalDamage * 0.8));
    }

    // Apply Health Deduction
    this.currentHp = Math.max(0, this.currentHp - finalDamage);

    // Poise Check: Flank and momentum hits shred poise faster
    const poiseMultiplier = wasFlank ? 1.8 : wasMomentumHit ? 1.4 : wasGuarded ? 0.7 : 1.0;
    const poiseDamage = finalDamage * poiseMultiplier;
    const poiseBroken = this.director.takePoiseDamage(poiseDamage);

    if (poiseBroken) {
      this.isStaggered = true;
      this.guardBreakTimer = 1.2;
      this.hurtTimer = 0.35;
      this.state = 'hurt';
      feedbackText = `💥 GUARD BROKEN! STAGGERED!`;
      feedbackColor = '#facc15';
      isCritical = true;
      const kx = impactForceX !== 0 ? impactForceX : (this.facingRight ? -200 : 200);
      this.applyKnockback(kx, impactForceY);
    } else {
      this.hurtTimer = 0.08;
      const kx = impactForceX !== 0 ? impactForceX * 0.3 : (this.facingRight ? -60 : 60);
      this.applyKnockback(kx, impactForceY * 0.2);

      // Chance of aggressive counter-attack if hit while not staggered
      if (!this.isStaggered && Math.random() < 0.38) {
        this.director.triggerImmediatePunish(attackerX);
      }
    }

    if (this.currentHp <= 0) {
      this.triggerDeath();
    }

    return {
      actualDamage: finalDamage,
      wasDeflected,
      wasGuarded,
      wasFlank,
      wasCounterHit,
      wasMomentumHit,
      poiseBroken,
      feedbackText,
      feedbackColor,
      isCritical,
    };
  }

  public getDebugSnapshot(heroX: number): CombatAIDebugSnapshot {
    return this.director.getDebugSnapshot(this.state, this.x, heroX);
  }

  public triggerDeath() {
    this.state = 'death';
    this.deathTimer = 0;
    this.vx = 0;
    this.vy = 0;
  }

  public triggerTelegraph(targetX: number, onComplete: () => void) {
    this.isTelegraphing = true;
    this.telegraphTimer = 0.75;
    this.telegraphTargetX = targetX;
    this.onTelegraphComplete = onComplete;
    this.facingRight = targetX > this.x;
  }

  public triggerAttack(targetX?: number) {
    this.state = 'attack';
    this.attackTimer = 0.65;
    this.isLungingToAttack = true;
    this.combatOriginX = this.x;

    if (targetX !== undefined) {
      this.combatTargetX = this.x + (targetX > this.x ? 1 : -1) * 110;
      this.facingRight = targetX > this.x;
    }
  }

  /* ========================================================================= */
  /* 3. DEMONIC FANTASY MONSTER RENDERERS                                      */
  /* ========================================================================= */

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y + this.height);

    if (this.facingRight) {
      ctx.scale(-1, 1);
    }
    ctx.scale(this.scale, this.scale);

    const bob = Math.sin(this.animTimer * (this.isFlying ? 5.0 : 3.0)) * (this.isFlying ? 6 : 3);
    const lunge = this.state === 'attack' ? (this.isLungingToAttack ? 25 : 12) : 0;

    // Dodge Phantom Ghosting
    if (this.state === 'dodge') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-18, -this.height / 2, this.width * 0.55, this.height * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Feint Shadow Aura
    if (this.isFeinting) {
      ctx.save();
      ctx.globalAlpha = 0.45 + Math.sin(performance.now() * 0.03) * 0.25;
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(0, -this.height / 2, this.width * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Guard Broken Stagger Indicator
    if (this.isStaggered || this.guardBreakTimer > 0) {
      ctx.save();
      const sAngle = performance.now() * 0.008;
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💫 GUARD BROKEN!', 0, -this.height - 22 + bob);
      // Orbiting dizzy stars
      for (let i = 0; i < 3; i++) {
        const a = sAngle + (i * Math.PI * 2) / 3;
        const sx = Math.cos(a) * 22;
        const sy = -this.height - 12 + Math.sin(a) * 6 + bob;
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Adaptive Armor Hexagonal Barrier
    if (this.adaptiveResistance > 0.2 && !this.isStaggered) {
      ctx.save();
      const aPulse = (Math.sin(performance.now() * 0.01) + 1) * 0.5;
      ctx.strokeStyle = `rgba(148, 163, 184, ${0.4 + aPulse * 0.35})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(0, -this.height / 2, this.width * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Bloodrage Flame Aura
    if (this.isEnraged && !this.isStaggered) {
      ctx.save();
      const ePulse = (Math.sin(performance.now() * 0.02) + 1) * 0.5;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.6 + ePulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -this.height / 2, this.width * 0.72 + ePulse * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Guard Stance Runic Kinetic Barrier
    if (this.isGuarding) {
      ctx.save();
      const gPulse = (Math.sin(performance.now() * 0.015) + 1) * 0.5;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.75 + gPulse * 0.25})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${0.18 + gPulse * 0.12})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(-25, -this.height / 2, this.height * 0.58, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }

    // Counterplay Punish Indicator
    if (this.isVulnerable) {
      ctx.save();
      const vPulse = (Math.sin(performance.now() * 0.025) + 1) * 0.5;
      ctx.fillStyle = `rgba(245, 158, 11, ${0.85 + vPulse * 0.15})`;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ COUNTER!', 0, -this.height - 24 + bob);
      ctx.restore();
    }

    // Telegraph Glow / Trajectory Indicator
    if (this.isTelegraphing) {
      ctx.save();
      const tPulse = (Math.sin(performance.now() * 0.02) + 1) * 0.5;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + tPulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -this.height / 2, this.width * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      if (this.currentAttackType === 'dive') {
        // Trajectory line to player
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(this.facingRight ? 200 : -200, 100);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Render specific demonic archetype
    switch (this.config.spriteType) {
      case 'demon_beast':
        this.renderDemonBeast(ctx, lunge, bob);
        break;
      case 'shadow_demon':
        this.renderShadowDemon(ctx, lunge, bob);
        break;
      case 'armored_demon':
        this.renderArmoredDemon(ctx, lunge, bob);
        break;
      case 'fire_demon':
        this.renderFireDemon(ctx, lunge, bob);
        break;
      case 'flying_demon':
        this.renderFlyingDemon(ctx, lunge, bob);
        break;
      case 'winged_beast':
        this.renderWingedBeast(ctx, lunge, bob);
        break;
      case 'elite_demon':
        this.renderEliteDemon(ctx, lunge, bob);
        break;
      case 'guardian_malakor':
        this.renderGuardianMalakor(ctx, lunge, bob);
        break;
      case 'dragon':
        this.renderWingedBeast(ctx, lunge, bob);
        break;
      case 'golem':
        this.renderArmoredDemon(ctx, lunge, bob);
        break;
      default:
        this.renderDemonBeast(ctx, lunge, bob);
        break;
    }

    // Health Bar
    if (this.currentHp > 0 && this.state !== 'death') {
      const barW = 54;
      const barH = 5.5;
      const barY = -this.height - 18 + bob;
      const hpPct = Math.max(0, this.currentHp / this.maxHp);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(-barW / 2 - 1, barY - 1, barW + 2, barH + 2);

      ctx.fillStyle = hpPct > 0.4 ? '#ef4444' : '#f59e0b';
      ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
    }

    ctx.restore();
  }

  /* --- 8. TRANSCENDENT GUARDIAN MALAKOR (World 12 Culmination Sovereign Boss) --- */
  private renderGuardianMalakor(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    const time = performance.now() * 0.002;
    const wingFlap = Math.sin(this.wingPhase) * 20;

    // Transcendent Cosmic Aura Pulsing Halo
    ctx.save();
    ctx.translate(ox, -60 + oy);
    ctx.rotate(time);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.rotate(-time * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Six Golden Radiance Celestial Wings
    ctx.fillStyle = '#facc15';
    // Upper Wings
    ctx.beginPath();
    ctx.moveTo(-12 + ox, -60 + oy);
    ctx.lineTo(-80 + ox, -120 + oy + wingFlap);
    ctx.lineTo(-50 + ox, -70 + oy);
    ctx.lineTo(-92 + ox, -50 + oy + wingFlap * 0.7);
    ctx.lineTo(-16 + ox, -45 + oy);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(12 + ox, -60 + oy);
    ctx.lineTo(80 + ox, -120 + oy + wingFlap);
    ctx.lineTo(50 + ox, -70 + oy);
    ctx.lineTo(92 + ox, -50 + oy + wingFlap * 0.7);
    ctx.lineTo(16 + ox, -45 + oy);
    ctx.closePath();
    ctx.fill();

    // Lower Secondary Cosmic Wings
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(-10 + ox, -40 + oy);
    ctx.lineTo(-65 + ox, -10 + oy - wingFlap * 0.5);
    ctx.lineTo(-35 + ox, -30 + oy);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10 + ox, -40 + oy);
    ctx.lineTo(65 + ox, -10 + oy - wingFlap * 0.5);
    ctx.lineTo(35 + ox, -30 + oy);
    ctx.closePath();
    ctx.fill();

    // Sovereign Heavy Obsidian Torso with Celestial Gold Trim
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-26 + ox, -74 + oy, 52, 58);

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22 + ox, -70 + oy, 44, 50);

    // Floating Sovereign Matrix Core (Array Geometry Rune)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ox, -50 + oy, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dual Giant Transcendent Blades of Light
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-44 + ox, -55 + oy, 7, 65);
    ctx.fillRect(37 + ox, -55 + oy, 7, 65);

    // Crown of Transcendent Cosmic Horns
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(ox, -86 + oy, 18, 0, Math.PI * 2);
    ctx.fill();

    // 5-Prong Celestial Gold Crown Horns
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-16 + ox, -96 + oy);
    ctx.lineTo(-32 + ox, -128 + oy);
    ctx.lineTo(-8 + ox, -98 + oy);
    ctx.lineTo(-12 + ox, -140 + oy);
    ctx.lineTo(0 + ox, -102 + oy);
    ctx.lineTo(12 + ox, -140 + oy);
    ctx.lineTo(8 + ox, -98 + oy);
    ctx.lineTo(32 + ox, -128 + oy);
    ctx.lineTo(16 + ox, -96 + oy);
    ctx.closePath();
    ctx.fill();

    // Blazing Cosmic Radiance Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-10 + ox, -89 + oy, 7, 4.5);
    ctx.fillRect(3 + ox, -89 + oy, 7, 4.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7 + ox, -88 + oy, 3, 2.5);
    ctx.fillRect(5 + ox, -88 + oy, 3, 2.5);
  }

  /* --- 1. ONI DEMON BEAST (Level 1 Japanese Village / Forest Vanguard) --- */
  private renderDemonBeast(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    // Muscular demonic quadruped body
    ctx.fillStyle = '#7f1d1d'; // Crimson demon flesh
    ctx.beginPath();
    ctx.ellipse(ox, -36 + oy, 38, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Obsidian Spine Ridges
    ctx.fillStyle = '#18181b';
    for (let i = -24; i <= 24; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i - 4 + ox, -52 + oy);
      ctx.lineTo(i + ox, -66 + oy);
      ctx.lineTo(i + 4 + ox, -52 + oy);
      ctx.fill();
    }

    // Four Muscular Clawed Legs
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(-30 + ox, -26 + oy, 12, 26);
    ctx.fillRect(-14 + ox, -26 + oy, 10, 26);
    ctx.fillRect(8 + ox, -26 + oy, 10, 26);
    ctx.fillRect(22 + ox, -26 + oy, 12, 26);

    // Sharp White Claws
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-32 + ox, -4 + oy, 5, 4);
    ctx.fillRect(-16 + ox, -4 + oy, 5, 4);
    ctx.fillRect(6 + ox, -4 + oy, 5, 4);
    ctx.fillRect(20 + ox, -4 + oy, 5, 4);

    // Spiked Whipping Tail
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-36 + ox, -36 + oy);
    ctx.quadraticCurveTo(-58 + ox, -60 + oy, -48 + ox, -72 + oy);
    ctx.stroke();

    // Demon Snarling Skull
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(36 + ox, -44 + oy, 18, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Curved Obsidian Horns
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.moveTo(34 + ox, -54 + oy);
    ctx.quadraticCurveTo(24 + ox, -78 + oy, 12 + ox, -70 + oy);
    ctx.lineTo(28 + ox, -50 + oy);
    ctx.fill();

    // Glowing Fiery Eyes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(34 + ox, -50 + oy, 7, 5);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(36 + ox, -49 + oy, 3, 3);

    // Snarling Fangs
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(42 + ox, -42 + oy);
    ctx.lineTo(45 + ox, -34 + oy);
    ctx.lineTo(48 + ox, -42 + oy);
    ctx.fill();
  }

  /* --- 2. SHADOW DEMON (Fast Humanoid Assassin) --- */
  private renderShadowDemon(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    // Wispy Shadow Mist Aura
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.arc(ox, -45 + oy, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Slender Shadow Humanoid Body
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-14 + ox, -58 + oy, 28, 42);

    // Bladed Arms (Curved Shadow Scythes)
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(-14 + ox, -48 + oy);
    ctx.quadraticCurveTo(-38 + ox, -30 + oy, -34 + ox, -12 + oy);
    ctx.lineTo(-24 + ox, -28 + oy);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(14 + ox, -48 + oy);
    ctx.quadraticCurveTo(38 + ox, -30 + oy, 34 + ox, -12 + oy);
    ctx.lineTo(24 + ox, -28 + oy);
    ctx.fill();

    // Spiked Shoulders
    ctx.fillStyle = '#2e1065';
    ctx.fillRect(-20 + ox, -54 + oy, 8, 8);
    ctx.fillRect(12 + ox, -54 + oy, 8, 8);

    // Demon Head with Twin Horns
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(ox, -68 + oy, 13, 0, Math.PI * 2);
    ctx.fill();

    // Sharp Horns
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(-8 + ox, -76 + oy);
    ctx.lineTo(-16 + ox, -92 + oy);
    ctx.lineTo(-3 + ox, -74 + oy);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8 + ox, -76 + oy);
    ctx.lineTo(16 + ox, -92 + oy);
    ctx.lineTo(3 + ox, -74 + oy);
    ctx.fill();

    // Piercing Neon Yellow Eyes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-6 + ox, -71 + oy, 4, 3);
    ctx.fillRect(3 + ox, -71 + oy, 4, 3);
  }

  /* --- 3. ARMORED DEMON (Heavy Juggernaut) --- */
  private renderArmoredDemon(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    // Heavy Spiked Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-28 + ox, -30 + oy, 22, 30);
    ctx.fillRect(8 + ox, -30 + oy, 22, 30);

    // Colossal Obsidian Armor Plates
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-34 + ox, -80 + oy, 68, 54);

    // Glowing Demonic Fissure Runes
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22 + ox, -70 + oy);
    ctx.lineTo(0 + ox, -52 + oy);
    ctx.lineTo(24 + ox, -64 + oy);
    ctx.stroke();

    // Core Gem
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(ox, -52 + oy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Spiked Armor Pauldrons
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-34 + ox, -80 + oy);
    ctx.lineTo(-52 + ox, -96 + oy);
    ctx.lineTo(-26 + ox, -64 + oy);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(34 + ox, -80 + oy);
    ctx.lineTo(52 + ox, -96 + oy);
    ctx.lineTo(26 + ox, -64 + oy);
    ctx.fill();

    // Armored Great-Helm
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-20 + ox, -98 + oy, 40, 22);

    // Glowing Blue Visor Slit
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-14 + ox, -90 + oy, 28, 5);
  }

  /* --- 4. FIRE DEMON (Infernal Fiend) --- */
  private renderFireDemon(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    // Blazing Fire Aura
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.arc(ox, -45 + oy, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Molten Magma Body
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(-20 + ox, -62 + oy, 40, 44);

    // Magma Cracks on Chest
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12 + ox, -54 + oy);
    ctx.lineTo(2 + ox, -40 + oy);
    ctx.lineTo(14 + ox, -50 + oy);
    ctx.stroke();

    // Flaming Shoulders
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(-24 + ox, -56 + oy, 12, 0, Math.PI * 2);
    ctx.arc(24 + ox, -56 + oy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Demon Head with Curved Flaming Horns
    ctx.fillStyle = '#431407';
    ctx.beginPath();
    ctx.arc(ox, -72 + oy, 16, 0, Math.PI * 2);
    ctx.fill();

    // Fiery Magma Horns
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-10 + ox, -80 + oy);
    ctx.quadraticCurveTo(-30 + ox, -104 + oy, -40 + ox, -86 + oy);
    ctx.lineTo(-14 + ox, -74 + oy);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10 + ox, -80 + oy);
    ctx.quadraticCurveTo(30 + ox, -104 + oy, 40 + ox, -86 + oy);
    ctx.lineTo(14 + ox, -74 + oy);
    ctx.fill();

    // Fiery White Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7 + ox, -75 + oy, 5, 4);
    ctx.fillRect(3 + ox, -75 + oy, 5, 4);
  }

  /* --- 5. FLYING DEMON (Winged Gargoyle Aerial Enemy) --- */
  private renderFlyingDemon(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    const flap = Math.sin(this.wingPhase) * 18;

    // Articulated Demonic Bat Wings
    ctx.fillStyle = '#4c0519'; // Deep blood-red leathery wings
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-8 + ox, -55 + oy);
    ctx.lineTo(-58 + ox, -95 + oy + flap);
    ctx.lineTo(-44 + ox, -58 + oy);
    ctx.lineTo(-65 + ox, -40 + oy + flap * 0.5);
    ctx.lineTo(-12 + ox, -40 + oy);
    ctx.closePath();
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(8 + ox, -55 + oy);
    ctx.lineTo(58 + ox, -95 + oy + flap);
    ctx.lineTo(44 + ox, -58 + oy);
    ctx.lineTo(65 + ox, -40 + oy + flap * 0.5);
    ctx.lineTo(12 + ox, -40 + oy);
    ctx.closePath();
    ctx.fill();

    // Wing Bone Ribs
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-8 + ox, -55 + oy);
    ctx.lineTo(-58 + ox, -95 + oy + flap);
    ctx.moveTo(8 + ox, -55 + oy);
    ctx.lineTo(58 + ox, -95 + oy + flap);
    ctx.stroke();

    // Gargoyle Torso
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-16 + ox, -58 + oy, 32, 40);

    // Talon Feet
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-14 + ox, -18 + oy, 8, 12);
    ctx.fillRect(6 + ox, -18 + oy, 8, 12);

    // Horned Head
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ox, -68 + oy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Gargoyle Horns
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-8 + ox, -76 + oy);
    ctx.lineTo(-18 + ox, -94 + oy);
    ctx.lineTo(-2 + ox, -76 + oy);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(8 + ox, -76 + oy);
    ctx.lineTo(18 + ox, -94 + oy);
    ctx.lineTo(2 + ox, -76 + oy);
    ctx.fill();

    // Piercing Glowing Amber Eyes
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6 + ox, -71 + oy, 4, 3);
    ctx.fillRect(3 + ox, -71 + oy, 4, 3);
  }

  /* --- 6. WINGED BEAST (Colossal Draconic Demon) --- */
  private renderWingedBeast(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    const flap = Math.sin(this.wingPhase) * 22;

    // Colossal Expansive Dragon Wings (140px wingspan)
    ctx.fillStyle = '#312e81'; // Abyssal Indigo
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-10 + ox, -55 + oy);
    ctx.lineTo(-76 + ox, -105 + oy + flap);
    ctx.lineTo(-55 + ox, -60 + oy);
    ctx.lineTo(-84 + ox, -42 + oy + flap * 0.6);
    ctx.lineTo(-16 + ox, -40 + oy);
    ctx.closePath();
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(10 + ox, -55 + oy);
    ctx.lineTo(76 + ox, -105 + oy + flap);
    ctx.lineTo(55 + ox, -60 + oy);
    ctx.lineTo(84 + ox, -42 + oy + flap * 0.6);
    ctx.lineTo(16 + ox, -40 + oy);
    ctx.closePath();
    ctx.fill();

    // Massive Draconic Body
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(ox, -45 + oy, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draconic Spines along back
    ctx.fillStyle = '#6366f1';
    for (let i = -18; i <= 18; i += 9) {
      ctx.beginPath();
      ctx.moveTo(i - 3 + ox, -58 + oy);
      ctx.lineTo(i + ox, -70 + oy);
      ctx.lineTo(i + 3 + ox, -58 + oy);
      ctx.fill();
    }

    // Horned Dragon Skull
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(26 + ox, -52 + oy, 20, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Swept Dragon Horns
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(22 + ox, -62 + oy);
    ctx.quadraticCurveTo(10 + ox, -86 + oy, -4 + ox, -80 + oy);
    ctx.lineTo(16 + ox, -58 + oy);
    ctx.fill();

    // Glowing Dragon Eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(28 + ox, -56 + oy, 6, 4);
  }

  /* --- 7. ELITE DEMON (Lord Malakor Sovereign) --- */
  private renderEliteDemon(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    // Sovereign Floating Rune Ring behind back
    ctx.save();
    const ringRotate = performance.now() * 0.002;
    ctx.translate(ox, -55 + oy);
    ctx.rotate(ringRotate);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Sovereign Royal Demon Body (Deep Black & Gold)
    ctx.fillStyle = '#09090b';
    ctx.fillRect(-22 + ox, -68 + oy, 44, 52);

    // Gold Chest Inlay & Core
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18 + ox, -64 + oy, 36, 44);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(ox, -46 + oy, 9, 0, Math.PI * 2);
    ctx.fill();

    // Dual Glowing Energy Katanas
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-36 + ox, -40 + oy, 6, 48);
    ctx.fillRect(30 + ox, -40 + oy, 6, 48);

    // Sovereign Crown of Horns
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(ox, -78 + oy, 16, 0, Math.PI * 2);
    ctx.fill();

    // Gold Inlaid Crown Horns
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-12 + ox, -88 + oy);
    ctx.lineTo(-24 + ox, -114 + oy);
    ctx.lineTo(-4 + ox, -86 + oy);
    ctx.lineTo(0 + ox, -120 + oy);
    ctx.lineTo(4 + ox, -86 + oy);
    ctx.lineTo(24 + ox, -114 + oy);
    ctx.lineTo(12 + ox, -88 + oy);
    ctx.closePath();
    ctx.fill();

    // Menacing Crimson Slit Eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-8 + ox, -80 + oy, 5, 3.5);
    ctx.fillRect(3 + ox, -80 + oy, 5, 3.5);
  }
}
