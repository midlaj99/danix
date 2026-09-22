export type HeroState =
  | 'idle'
  | 'idle_variation'
  | 'walk'
  | 'run'
  | 'sprint'
  | 'jump_start'
  | 'jump'
  | 'fall'
  | 'land'
  | 'dodge'
  | 'attack'
  | 'radoxom_cast'
  | 'radoxom_release'
  | 'hurt'
  | 'low_health'
  | 'death'
  | 'victory';

interface Afterimage {
  x: number;
  y: number;
  facingRight: boolean;
  alpha: number;
  color: string;
}

export class Hero {
  public x: number = 100;
  public y: number = 380;
  public vx: number = 0;
  public vy: number = 0;
  public width: number = 44;
  public height: number = 64;
  public isGrounded: boolean = true;
  public facingRight: boolean = true;
  public state: HeroState = 'idle';

  // Animation Timers & Counters
  public animTimer: number = 0;
  public animFrame: number = 0;
  public hurtTimer: number = 0;
  public attackTimer: number = 0;
  public castTimer: number = 0;
  public landTimer: number = 0;
  public victoryTimer: number = 0;
  public idleTimer: number = 0;
  public breathPhase: number = 0;
  public blinkTimer: number = 0;
  public isBlinking: boolean = false;

  // Dodge & I-Frames & Stamina System
  public isDodging: boolean = false;
  public dodgeTimer: number = 0;
  public dodgeCooldown: number = 0;
  public dodgePhase: 'none' | 'startup' | 'active' | 'recovery' = 'none';
  public isInvulnerable: boolean = false;
  public currentStamina: number = 100;
  public maxStamina: number = 100;
  public readonly DODGE_STAMINA_COST: number = 25;
  public readonly SPRINT_STAMINA_DRAIN: number = 14;
  public readonly STAMINA_REGEN_RATE: number = 32;

  // Knockback Physics
  public knockbackVx: number = 0;
  public knockbackVy: number = 0;
  public afterimages: Afterimage[] = [];
  private afterimageTimer: number = 0;

  // 3-Hit Combo System
  public comboStep: 1 | 2 | 3 = 1;
  public comboResetTimer: number = 0;

  // Combat Dash Mechanics
  public combatOriginX: number = 100;
  public combatTargetX: number | null = null;
  public isDashingToAttack: boolean = false;

  // Real-time Aiming & Radoxom System
  public aimAngle: number = 0;
  public radoxomAmmoCount: number = 0;
  public fireRecoilTimer: number = 0;
  public currentShield: number = 100;
  public maxShield: number = 100;

  // Evolving Attack Styles & Glowing Auras
  public activeSkillName: string = 'Array Strike';
  public attackStyle: 'slash' | 'cleave' | 'fire' | 'laser' | 'omnislash' = 'slash';
  public speedBoostTimer: number = 0;
  public auraColor: string = '#38bdf8'; // Cyan default

  // Physics & Movement Constants (Fast, Smooth, Crisp)
  public readonly WALK_SPEED = 190;
  public readonly RUN_SPEED = 290;
  public readonly SPRINT_SPEED = 390;
  public readonly ACCELERATION = 2200;
  public readonly AIR_ACCELERATION = 1400;
  public readonly DECELERATION = 2800;
  public readonly AIR_DRAG = 500;
  public readonly JUMP_FORCE = -470;
  public readonly GRAVITY = 1150;
  public readonly MAX_FALL_SPEED = 650;
  public readonly DODGE_SPEED = 540;

  // Attack Cooldown Safety (Timestamp-based throttle)
  public nextAttackTime: number = 0;
  public readonly attackCooldownMs: number = 200;

  // Anti-stuck watchdog
  public stuckTimer: number = 0;
  public lastX: number = 100;

  // State Capability Queries
  public canMove(): boolean {
    if (this.state === 'death' || this.state === 'victory') return false;
    return true;
  }

  public canAttack(): boolean {
    if (this.state === 'death' || this.state === 'victory' || this.isDodging) return false;
    return performance.now() >= this.nextAttackTime;
  }

  public canJump(): boolean {
    if (this.state === 'death' || this.state === 'victory' || this.isDodging) return false;
    return this.isGrounded;
  }

  public canDodge(): boolean {
    if (this.state === 'death' || this.state === 'victory' || this.isDodging) return false;
    return this.dodgeCooldown <= 0 && this.currentStamina >= this.DODGE_STAMINA_COST;
  }

  public update(
    dt: number,
    keys: { left: boolean; right: boolean; jump: boolean; sprint: boolean; dodge?: boolean },
    groundY: number,
    arenaMinX: number = 0,
    arenaMaxX: number = 2400
  ) {
    if (this.state === 'death') {
      return;
    }

    // 1. Organic Breathing & Blinking Timers
    this.breathPhase += dt * 3.0;
    this.blinkTimer += dt;
    if (this.blinkTimer > 3.8) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.0) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 0.5;
      }
    }

    // 2. Update Afterimages
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      this.afterimages[i].alpha -= dt * 3.4;
      if (this.afterimages[i].alpha <= 0) {
        this.afterimages.splice(i, 1);
      }
    }

    // 3. Cooldown & Recoil Timers
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= dt;
    if (this.speedBoostTimer > 0) this.speedBoostTimer -= dt;
    if (this.fireRecoilTimer > 0) this.fireRecoilTimer -= dt;
    if (this.castTimer > 0) {
      this.castTimer -= dt;
      if (this.castTimer <= 0 && (this.state === 'radoxom_cast' || this.state === 'radoxom_release')) {
        this.state = this.isGrounded ? 'idle' : 'fall';
      }
    }
    if (this.comboResetTimer > 0) {
      this.comboResetTimer -= dt;
      if (this.comboResetTimer <= 0) this.comboStep = 1;
    }

    // 3.5 Stamina Regeneration & Sprint Drain
    if (!this.isDodging) {
      if (keys.sprint && (keys.left || keys.right) && this.currentStamina > 0) {
        this.currentStamina = Math.max(0, this.currentStamina - this.SPRINT_STAMINA_DRAIN * dt);
      } else {
        this.currentStamina = Math.min(this.maxStamina, this.currentStamina + this.STAMINA_REGEN_RATE * dt);
      }
    }

    // 4. Dodge State Lifecycle (Startup -> Active I-Frames -> Recovery)
    if (this.isDodging) {
      this.dodgeTimer -= dt;
      const elapsed = 0.36 - this.dodgeTimer;
      if (elapsed < 0.04) {
        this.dodgePhase = 'startup';
        this.isInvulnerable = false;
      } else if (elapsed <= 0.24) {
        this.dodgePhase = 'active';
        this.isInvulnerable = true;
      } else {
        this.dodgePhase = 'recovery';
        this.isInvulnerable = false;
        this.vx *= 0.88;
      }

      this.afterimageTimer += dt;
      if (this.afterimageTimer > 0.04) {
        this.afterimageTimer = 0;
        this.afterimages.push({
          x: this.x,
          y: this.y,
          facingRight: this.facingRight,
          alpha: 0.75,
          color: this.auraColor,
        });
      }

      this.x += this.vx * dt;

      if (this.dodgeTimer <= 0) {
        this.isDodging = false;
        this.dodgePhase = 'none';
        this.isInvulnerable = false;
        this.state = this.isGrounded ? 'idle' : 'fall';
        this.vx *= 0.35;
      }
    } else if (keys.dodge && this.canDodge()) {
      this.triggerDodge();
    }

    // 5. Hurt State Recovery
    if (this.hurtTimer > 0) {
      this.hurtTimer -= dt;
      if (this.hurtTimer <= 0 && this.state === 'hurt') {
        this.state = this.isGrounded ? 'idle' : 'fall';
      }
    }

    // 6. Attack State Recovery
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0 && this.state === 'attack') {
        this.state = this.isGrounded ? (Math.abs(this.vx) > 10 ? 'walk' : 'idle') : 'fall';
        this.isDashingToAttack = false;
        this.combatTargetX = null;
      }
    }

    // 7. Landing Squash Timer
    if (this.landTimer > 0) {
      this.landTimer -= dt;
      if (this.landTimer <= 0 && this.state === 'land') {
        this.state = this.isGrounded ? (Math.abs(this.vx) > 10 ? 'walk' : 'idle') : 'fall';
      }
    }

    // 8. Horizontal Velocity & Direct Input Response
    if (!this.isDodging && this.canMove()) {
      const speedMultiplier = this.speedBoostTimer > 0 ? 1.35 : 1.0;
      let targetMaxSpeed = keys.sprint ? this.SPRINT_SPEED : (Math.abs(this.vx) > this.WALK_SPEED * 1.05 ? this.RUN_SPEED : this.WALK_SPEED);
      targetMaxSpeed *= speedMultiplier;

      const accel = this.isGrounded ? this.ACCELERATION : this.AIR_ACCELERATION;
      const decel = this.isGrounded ? this.DECELERATION : this.AIR_DRAG;

      if (keys.left && !keys.right) {
        this.vx = Math.max(-targetMaxSpeed, this.vx - accel * dt);
        this.facingRight = false;
        this.idleTimer = 0;
        if (this.isGrounded && !['land', 'attack', 'hurt', 'radoxom_cast', 'radoxom_release'].includes(this.state)) {
          this.state = keys.sprint ? 'sprint' : (Math.abs(this.vx) > this.WALK_SPEED * 1.05 ? 'run' : 'walk');
        }
      } else if (keys.right && !keys.left) {
        this.vx = Math.min(targetMaxSpeed, this.vx + accel * dt);
        this.facingRight = true;
        this.idleTimer = 0;
        if (this.isGrounded && !['land', 'attack', 'hurt', 'radoxom_cast', 'radoxom_release'].includes(this.state)) {
          this.state = keys.sprint ? 'sprint' : (Math.abs(this.vx) > this.WALK_SPEED * 1.05 ? 'run' : 'walk');
        }
      } else {
        // Crisp Deceleration
        if (this.vx > 0) {
          this.vx = Math.max(0, this.vx - decel * dt);
        } else if (this.vx < 0) {
          this.vx = Math.min(0, this.vx + decel * dt);
        }

        if (this.isGrounded && this.vx === 0 && !['land', 'attack', 'hurt', 'victory', 'radoxom_cast', 'radoxom_release'].includes(this.state)) {
          this.idleTimer += dt;
          this.state = this.idleTimer > 4.5 ? 'idle_variation' : 'idle';
        }
      }
    }

    // 9. Jump Physics
    if (keys.jump && this.canJump()) {
      this.vy = this.JUMP_FORCE;
      this.isGrounded = false;
      this.state = 'jump';
      this.landTimer = 0;
      this.idleTimer = 0;
    }

    // 10. Gravity & Buoyant Apex Curve
    if (!this.isGrounded) {
      const apexMultiplier = Math.abs(this.vy) < 60 ? 0.65 : 1.0;
      this.vy += this.GRAVITY * apexMultiplier * dt;
      this.vy = Math.min(this.vy, this.MAX_FALL_SPEED);

      if (this.vy > 40 && !['attack', 'hurt', 'radoxom_cast', 'radoxom_release'].includes(this.state) && !this.isDodging) {
        this.state = 'fall';
      }
    }

    // 11. Position Integration & Knockback Physics
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (Math.abs(this.knockbackVx) > 1 || Math.abs(this.knockbackVy) > 1) {
      this.x += this.knockbackVx * dt;
      this.y += this.knockbackVy * dt;
      this.knockbackVx *= Math.exp(-7.5 * dt);
      this.knockbackVy *= Math.exp(-7.5 * dt);
    } else {
      this.knockbackVx = 0;
      this.knockbackVy = 0;
    }

    // 12. Ground Collision Resolution & Landing Detection
    if (this.y >= groundY - this.height) {
      const wasAirborne = !this.isGrounded && this.vy > 180;
      this.y = groundY - this.height;
      this.vy = 0;
      this.isGrounded = true;

      if (wasAirborne) {
        this.state = 'land';
        this.landTimer = 0.08;
      } else if (this.state === 'fall' || this.state === 'jump') {
        this.state = Math.abs(this.vx) > 10 ? (keys.sprint ? 'sprint' : 'run') : 'idle';
      }
    } else {
      this.isGrounded = false;
    }

    // 13. Anti-Stuck Watchdog (detects abnormal entrapment & performs safe relocation)
    const isTryingToMove = (keys.left || keys.right) && !this.isDodging && this.state !== 'attack';
    const isStuckStationary = Math.abs(this.x - this.lastX) < 0.8 && Math.abs(this.vx) < 15;

    if (isTryingToMove && isStuckStationary) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 1.0) {
        // Safe Recovery: find nearest valid walkable coordinates
        const safeX = Math.max(arenaMinX + 40, Math.min(arenaMaxX - 40, this.x + (keys.right ? 25 : -25)));
        this.x = safeX;
        this.y = groundY - this.height;
        this.vx = 0;
        this.vy = 0;
        this.stuckTimer = 0;
        console.warn(`[Hero Recovery] Safe recovery activated! Freed hero at (${this.x.toFixed(1)}, ${this.y.toFixed(1)})`);
      }
    } else {
      this.stuckTimer = 0;
    }
    this.lastX = this.x;

    // 14. Animation Frame Calculation
    if (Math.abs(this.vx) > 5 && this.isGrounded) {
      this.animTimer += dt * (Math.abs(this.vx) / 55);
      this.animFrame = Math.floor(this.animTimer) % 6;
    } else {
      this.animTimer += dt * 3.2;
      this.animFrame = Math.floor(this.animTimer) % 4;
    }
  }

  public triggerDodge() {
    if (!this.canDodge()) return;
    this.currentStamina = Math.max(0, this.currentStamina - this.DODGE_STAMINA_COST);
    this.isDodging = true;
    this.dodgeTimer = 0.36;
    this.dodgeCooldown = 0.48;
    this.dodgePhase = 'startup';
    this.isInvulnerable = false;
    this.state = 'dodge';
    this.idleTimer = 0;
    this.vx = (this.facingRight ? 1 : -1) * this.DODGE_SPEED;
    this.afterimages.push({
      x: this.x,
      y: this.y,
      facingRight: this.facingRight,
      alpha: 0.85,
      color: this.auraColor,
    });
  }

  public applyKnockback(forceX: number, forceY: number = -120): void {
    if (this.isInvulnerable) return; // Protected during active i-frames!
    this.knockbackVx = forceX;
    this.knockbackVy = forceY;
  }

  public setSkill(skillName: string) {
    this.activeSkillName = skillName;
    if (skillName.includes('Dimension') || skillName.includes('Cleave') || skillName.includes('Slash')) {
      this.attackStyle = 'cleave';
      this.auraColor = '#22c55e'; // Emerald
    } else if (
      skillName.includes('Fire') ||
      skillName.includes('Molten') ||
      skillName.includes('Blast') ||
      skillName.includes('Purge')
    ) {
      this.attackStyle = 'fire';
      this.auraColor = '#f97316'; // Blazing Orange
    } else if (
      skillName.includes('Index') ||
      skillName.includes('Pierce') ||
      skillName.includes('Genesis') ||
      skillName.includes('Beam')
    ) {
      this.attackStyle = 'laser';
      this.auraColor = '#c084fc'; // Neon Violet
    } else if (skillName.includes('Mastery') || skillName.includes('Sovereign')) {
      this.attackStyle = 'omnislash';
      this.auraColor = '#facc15'; // Divine Gold
    } else {
      this.attackStyle = 'slash';
      this.auraColor = '#38bdf8'; // Cyan default
    }
  }

  public triggerAttack(targetX?: number) {
    this.state = 'attack';
    this.attackTimer = 0.24;
    this.nextAttackTime = performance.now() + this.attackCooldownMs;
    this.comboStep = ((this.comboStep % 3) + 1) as 1 | 2 | 3;
    this.comboResetTimer = 0.9;
    this.idleTimer = 0;

    if (targetX !== undefined) {
      this.facingRight = targetX > this.x;
    }
  }

  public triggerFireRadoxom(aimAngle: number) {
    this.aimAngle = aimAngle;
    this.facingRight = Math.cos(aimAngle) >= 0;
    this.state = 'radoxom_cast';
    this.castTimer = 0.22;
    this.fireRecoilTimer = 0.14;
    this.idleTimer = 0;
    this.nextAttackTime = performance.now() + this.attackCooldownMs;
  }

  public triggerHurt() {
    this.state = 'hurt';
    this.hurtTimer = 0.35;
    this.vy = -180;
    this.vx = this.facingRight ? -140 : 140;
    this.isDodging = false;
    this.idleTimer = 0;
  }

  public triggerVictory() {
    this.state = 'victory';
    this.victoryTimer = 2.0;
    this.vx = 0;
  }

  public triggerDeath() {
    this.state = 'death';
    this.vx = 0;
  }

  /* ------------------- HIGH-FIDELITY ANIME PROTAGONIST RENDERING ------------------- */

  public render(ctx: CanvasRenderingContext2D) {
    // 1. Render Luminous Ghost Afterimages
    for (const ghost of this.afterimages) {
      ctx.save();
      ctx.globalAlpha = ghost.alpha;
      ctx.translate(ghost.x + this.width / 2, ghost.y + this.height);
      if (!ghost.facingRight) ctx.scale(-1, 1);
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.ellipse(0, -32, 20, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height);

    if (!this.facingRight) {
      ctx.scale(-1, 1);
    }

    // Red damage flash
    if (this.hurtTimer > 0 && Math.floor(this.hurtTimer * 20) % 2 === 0) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-this.width / 2, -this.height, this.width, this.height);
      ctx.restore();
      return;
    }

    // Landing Squash & Stretch
    if (this.state === 'land') {
      ctx.scale(1.22, 0.82);
    }

    // Dodge Acrobatic Tilt & Compression
    if (this.state === 'dodge') {
      ctx.rotate(0.38);
      ctx.scale(1.15, 0.76);
    }

    // Sprint Lean Angle
    if (this.state === 'sprint') {
      ctx.rotate(0.12);
    }

    // Organic Breathing & Movement Bob
    const isMoving = this.state === 'walk' || this.state === 'run' || this.state === 'sprint';
    const breath = Math.sin(this.breathPhase) * 1.5;
    const bob = isMoving ? Math.sin(this.animFrame * Math.PI) * (this.state === 'sprint' ? 6 : this.state === 'run' ? 4 : 2.5) : breath;
    const legOffset = isMoving ? Math.sin((this.animFrame * Math.PI) / 2) * (this.state === 'sprint' ? 16 : this.state === 'run' ? 12 : 8) : 0;

    // --- EVOLVING GLOWING HERO AURA ---
    const now = performance.now();
    const auraPulse = (Math.sin(now * 0.006) + 1) * 0.5;
    ctx.save();
    const auraGrad = ctx.createRadialGradient(0, -32 + bob, 16, 0, -32 + bob, 48 + auraPulse * 10);
    auraGrad.addColorStop(0, this.auraColor + '44');
    auraGrad.addColorStop(0.65, this.auraColor + '18');
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, -32 + bob, 48 + auraPulse * 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- TRANSLUCENT ENERGY SHIELD BARRIER ---
    if (this.currentShield > 0 && this.state !== 'death') {
      const shieldRatio = Math.max(0.1, this.currentShield / this.maxShield);
      const shieldPulse = (Math.sin(now * 0.005) + 1) * 0.5;
      ctx.save();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + 0.3 * shieldRatio})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.ellipse(0, -32 + bob, 32 + shieldPulse * 2, 44 + shieldPulse * 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = `rgba(56, 189, 248, ${0.08 + shieldPulse * 0.04})`;
      ctx.fill();

      // Hexagonal rune accent on shield
      ctx.strokeStyle = `rgba(192, 132, 252, ${0.5 * shieldRatio})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -32 + bob, 28, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.restore();
    }

    // --- ORBITING 3D RADOXOM SPHERES ---
    if (this.radoxomAmmoCount > 0 && this.state !== 'death') {
      const orbCount = Math.min(this.radoxomAmmoCount, 8);
      const orbTime = now * 0.0032;
      for (let i = 0; i < orbCount; i++) {
        const angle = orbTime + (i * Math.PI * 2) / orbCount;
        const orbX = Math.cos(angle) * 38;
        const orbY = -32 + bob + Math.sin(angle) * 14;
        const depth = (Math.sin(angle) + 1.6) * 0.38;

        ctx.save();
        ctx.fillStyle = this.auraColor;
        ctx.shadowColor = this.auraColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(orbX, orbY, 6 * depth, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orbX, orbY, 2.8 * depth, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- DYNAMIC MULTI-JOINT FLOWING ANIME CAPE ---
    const capeWind = (this.vx !== 0 || this.isDashingToAttack || this.isDodging) ? 26 : 5;
    const capeFlutter = Math.sin(now * 0.012) * 5;
    const capeFlutter2 = Math.cos(now * 0.018) * 4;

    // Cape Outer Fabric (Royal Blue)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-6, -48 + bob);
    ctx.quadraticCurveTo(-18 - capeWind * 0.5, -34 + bob, -28 - capeWind, -16 + bob + capeFlutter);
    ctx.lineTo(-20 - capeWind * 0.7, -4 + bob + capeFlutter2);
    ctx.quadraticCurveTo(-10 - capeWind * 0.3, -20 + bob, -2, -46 + bob);
    ctx.closePath();
    ctx.fill();

    // Cape Inner Silk Lining (Gold)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-28 - capeWind, -16 + bob + capeFlutter);
    ctx.lineTo(-20 - capeWind * 0.7, -4 + bob + capeFlutter2);
    ctx.lineTo(-14 - capeWind * 0.4, -10 + bob);
    ctx.closePath();
    ctx.fill();

    // Cape Golden Trim Line
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-6, -48 + bob);
    ctx.quadraticCurveTo(-18 - capeWind * 0.5, -34 + bob, -28 - capeWind, -16 + bob + capeFlutter);
    ctx.stroke();

    // --- LEGS, GREAVES & DETAILED ADVENTURER BOOTS ---
    // Left & Right Leg Trousers (Midnight Navy)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13 + legOffset, -26 + bob, 8.5, 26 - bob);
    ctx.fillRect(4.5 - legOffset, -26 + bob, 8.5, 26 - bob);

    // Leather Knee Guards
    ctx.fillStyle = '#334155';
    ctx.fillRect(-14 + legOffset, -18 + bob, 10.5, 6);
    ctx.fillRect(3.5 - legOffset, -18 + bob, 10.5, 6);

    // High-Detail Gold-Trimmed Adventurer Boots
    ctx.fillStyle = '#451a03'; // Rich brown leather boot
    ctx.fillRect(-14 + legOffset, -12, 10.5, 12);
    ctx.fillRect(3.5 - legOffset, -12, 10.5, 12);

    // Boot Soles & Gold Wing Plates
    ctx.fillStyle = '#f59e0b'; // Gold trim
    ctx.fillRect(-15 + legOffset, -2, 12, 3);
    ctx.fillRect(2.5 - legOffset, -2, 12, 3);
    ctx.fillRect(-15 + legOffset, -11, 3, 7);
    ctx.fillRect(11.5 - legOffset, -11, 3, 7);

    // --- TORSO, ARMOR & RADOXOM MARKINGS ---
    // Adventurer Tunic
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-13, -51 + bob, 26, 30);

    // Layered Steel Chestplate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-11, -50 + bob, 22, 22);

    // Gold filigree armor bevels
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -49 + bob, 20, 20);

    // Glowing Central Radoxom Core Focus Gem
    ctx.fillStyle = this.auraColor;
    ctx.shadowColor = this.auraColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -39 + bob, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -39 + bob, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing Runic Arm Circuits (illuminated when Radoxoms are loaded)
    if (this.radoxomAmmoCount > 0) {
      ctx.strokeStyle = this.auraColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-12, -44 + bob);
      ctx.lineTo(-8, -36 + bob);
      ctx.lineTo(-12, -28 + bob);
      ctx.moveTo(12, -44 + bob);
      ctx.lineTo(8, -36 + bob);
      ctx.lineTo(12, -28 + bob);
      ctx.stroke();
    }

    // Segmented Shoulder Pauldrons
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-18, -52 + bob);
    ctx.lineTo(-10, -52 + bob);
    ctx.lineTo(-12, -42 + bob);
    ctx.lineTo(-20, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(18, -52 + bob);
    ctx.lineTo(10, -52 + bob);
    ctx.lineTo(12, -42 + bob);
    ctx.lineTo(20, -44 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Adventurer Belt & Gold Buckle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-13, -26 + bob, 26, 5);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-4, -27 + bob, 8, 7);

    // --- ANIME HEAD & EXPRESSIVE FACE ---
    // Neck & Face Base
    ctx.fillStyle = '#fed7aa'; // Anime fair skin
    ctx.fillRect(-4, -58 + bob, 8, 9);
    ctx.beginPath();
    ctx.arc(0, -60 + bob, 12.5, 0, Math.PI * 2);
    ctx.fill();

    // Anime Eyes (with pupil, iris gradient, and specular gleam)
    if (!this.isBlinking && this.state !== 'death') {
      const eyeY = -59 + bob;
      // Sclera
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2.5, eyeY, 5, 6);
      // Deep Blue Iris
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(3.5, eyeY + 1, 3.5, 5);
      // Pupil
      ctx.fillStyle = '#082f49';
      ctx.fillRect(4.5, eyeY + 2, 2, 3);
      // Specular Gleam
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5.5, eyeY + 1, 1.5, 1.5);

      // Eyelash & Eyebrow
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(2, eyeY - 1, 6, 1.5);
      // Eyebrow (determined angle in combat)
      const browTilt = this.state === 'attack' || this.state === 'radoxom_cast' ? 1.5 : 0;
      ctx.beginPath();
      ctx.moveTo(1.5, eyeY - 4 - browTilt);
      ctx.lineTo(8, eyeY - 3 + browTilt);
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      // Blinking or Closed Eye slit
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(2, -58 + bob);
      ctx.lineTo(7.5, -58 + bob);
      ctx.stroke();
    }

    // Gentle Anime Mouth
    if (this.state === 'hurt' || this.state === 'low_health') {
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(2, -53 + bob);
      ctx.lineTo(6, -54 + bob);
      ctx.stroke();
    } else if (this.state === 'victory') {
      // Confident smile
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(4, -54 + bob, 3, 0.2, Math.PI * 0.8);
      ctx.stroke();
    }

    // --- SPIKY LAYERED ANIME HAIR WITH WIND PHYSICS ---
    const hairWind = Math.sin(now * 0.008) * 2;
    // Dark Shadow Hair Layer
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-14, -68 + bob);
    ctx.lineTo(12, -70 + bob);
    ctx.lineTo(8, -58 + bob);
    ctx.lineTo(-12, -58 + bob);
    ctx.closePath();
    ctx.fill();

    // Spiky Golden Main Hair
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(-14, -68 + bob);
    ctx.lineTo(-4, -76 + bob + hairWind);
    ctx.lineTo(4, -72 + bob);
    ctx.lineTo(12, -78 + bob + hairWind);
    ctx.lineTo(8, -66 + bob);
    ctx.lineTo(15, -60 + bob);
    ctx.lineTo(8, -56 + bob);
    ctx.lineTo(0, -52 + bob);
    ctx.lineTo(-8, -56 + bob);
    ctx.lineTo(-15, -62 + bob);
    ctx.closePath();
    ctx.fill();

    // Dynamic Anime Bangs with Highlight
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(-6, -68 + bob);
    ctx.lineTo(0, -78 + bob + hairWind);
    ctx.lineTo(4, -69 + bob);
    ctx.lineTo(9, -74 + bob + hairWind);
    ctx.lineTo(7, -65 + bob);
    ctx.lineTo(2, -59 + bob);
    ctx.lineTo(-3, -64 + bob);
    ctx.closePath();
    ctx.fill();

    // Crimson Headband with fluttering ribbon tails
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-12, -64 + bob, 24, 4.5);
    // Ribbon tails streaming back
    ctx.beginPath();
    ctx.moveTo(-12, -63 + bob);
    ctx.lineTo(-24 - capeWind * 0.6, -58 + bob + capeFlutter);
    ctx.lineTo(-20 - capeWind * 0.6, -54 + bob + capeFlutter);
    ctx.lineTo(-12, -60 + bob);
    ctx.closePath();
    ctx.fill();

    // --- WEAPON & ATTACK / RADOXOM CAST COMBAT RENDERING ---
    if (this.state === 'attack') {
      ctx.save();
      // Combo Rotation & Slash Arcs
      const comboRotation = this.comboStep === 1 ? 0.48 : this.comboStep === 2 ? -0.45 : 0.85;
      ctx.rotate(comboRotation);

      // Glowing Runeblade
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(10, -68, 8.5, 56);
      ctx.fillStyle = this.auraColor;
      ctx.fillRect(16, -68, 3.5, 56);
      // Gold Crossguard & Hilt
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, -16, 17, 7);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(11, -9, 7, 11);
      ctx.restore();

      // Sweeping Elemental Crescent Arc
      ctx.strokeStyle = this.auraColor;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(38, -32, 44, -Math.PI / 2.5, Math.PI / 2.5);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(38, -32, 40, -Math.PI / 2.8, Math.PI / 2.8);
      ctx.stroke();
    } else if (this.state === 'radoxom_cast' || this.state === 'radoxom_release') {
      // Cast Stance: Arm thrust forward aiming along aimAngle
      ctx.save();
      const armAngle = this.aimAngle;
      ctx.rotate(this.facingRight ? armAngle : Math.PI - armAngle);

      // Extended Gauntlet Arm
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, -44, 22, 9);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(26, -45, 6, 11);

      // Swirling Radoxom Rune Sphere at palm
      const chargePulse = (Math.sin(now * 0.02) + 1) * 0.5;
      ctx.fillStyle = this.auraColor;
      ctx.shadowColor = this.auraColor;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(36, -39, 10 + chargePulse * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(36, -39, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (this.state === 'victory') {
      // Triumphant Pose: Runeblade raised straight to the sky!
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(6, -92, 9, 46);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(12, -92, 3.5, 46);
      ctx.fillRect(3, -46, 16, 7);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(7, -39, 7, 9);

      // Star Sparkle at blade tip
      const starPulse = (Math.sin(now * 0.015) + 1) * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(10, -94, 5 + starPulse * 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sheathed Runeblade across the back
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-15, -64 + bob, 5, 36);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-17, -68 + bob, 9, 6);
    }

    ctx.restore();
  }
}
