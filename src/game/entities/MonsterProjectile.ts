import { Hero } from './Hero';

export type MonsterProjectileType =
  | 'orb'
  | 'shockwave'
  | 'fireball'
  | 'fast'
  | 'slow'
  | 'tracking'
  | 'burst'
  | 'delayed';

export class MonsterProjectile {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number = 24;
  public height: number = 24;
  public damage: number = 20;
  public type: MonsterProjectileType;
  public color: string = '#ef4444';
  public lifetime: number = 0;
  public maxLifetime: number = 3.5;
  public isDead: boolean = false;
  public alreadyResolved: boolean = false;
  public targetX: number = 0;
  public targetY: number = 0;
  public delayTimer: number = 0;
  public isDelayedCharging: boolean = false;

  constructor(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    type: MonsterProjectileType = 'orb',
    damage: number = 20,
    color: string = '#ef4444'
  ) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.type = type;
    this.damage = damage;
    this.color = color;
    this.alreadyResolved = false;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy) || 1;

    if (type === 'shockwave') {
      const dir = targetX < startX ? -1 : 1;
      this.vx = dir * 350;
      this.vy = 0;
      this.width = 36;
      this.height = 28;
    } else if (type === 'fast') {
      const speed = 540;
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.width = 18;
      this.height = 18;
    } else if (type === 'slow') {
      const speed = 210;
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.width = 38;
      this.height = 38;
    } else if (type === 'delayed') {
      this.isDelayedCharging = true;
      this.delayTimer = 0.42;
      this.vx = 0;
      this.vy = 0;
      this.width = 26;
      this.height = 26;
    } else {
      const speed = type === 'fireball' ? 430 : type === 'burst' ? 400 : 380;
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.width = 24;
      this.height = 24;
    }
  }

  public consume(): void {
    this.alreadyResolved = true;
    this.isDead = true;
  }

  public update(dt: number, worldWidth: number, groundY: number, heroX?: number, heroY?: number): void {
    if (this.isDead) return;

    this.lifetime += dt;
    if (this.lifetime >= this.maxLifetime) {
      this.isDead = true;
      return;
    }

    // Delayed projectile charging phase
    if (this.isDelayedCharging) {
      this.delayTimer -= dt;
      if (this.delayTimer <= 0) {
        this.isDelayedCharging = false;
        const tx = heroX ?? this.targetX;
        const ty = heroY ?? this.targetY;
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.hypot(dx, dy) || 1;
        this.vx = (dx / dist) * 520;
        this.vy = (dy / dist) * 520;
      }
      return;
    }

    // Tracking projectile: subtle curved homing adjustment (dodgeable by lateral movement/jumping)
    if (this.type === 'tracking' && heroX !== undefined && heroY !== undefined) {
      const targetAngle = Math.atan2(heroY - this.y, heroX - this.x);
      const currentAngle = Math.atan2(this.vy, this.vx);
      let diff = targetAngle - currentAngle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      const maxSteer = 1.25 * dt; // Max turning rate in rad/s
      const steer = Math.max(-maxSteer, Math.min(maxSteer, diff));
      const newAngle = currentAngle + steer;
      const speed = Math.hypot(this.vx, this.vy) || 380;
      this.vx = Math.cos(newAngle) * speed;
      this.vy = Math.sin(newAngle) * speed;
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.type === 'shockwave') {
      // Clamped to ground
      this.y = groundY - this.height;
    }

    if (this.x < -100 || this.x > worldWidth + 100 || this.y < -100 || this.y > groundY + 50) {
      this.isDead = true;
    }
  }

  public checkHeroCollision(hero: Hero): boolean {
    if (this.isDead || hero.isInvulnerable || hero.state === 'death') {
      return false;
    }

    if (this.type === 'shockwave') {
      // Hero must jump to avoid shockwave!
      const heroInAir = hero.y + hero.height < this.y + 10;
      if (heroInAir) {
        return false; // Successfully jumped over shockwave!
      }
      return Math.abs(this.x - (hero.x + hero.width / 2)) < (this.width + hero.width) / 2;
    }

    // Standard bounding box collision
    const heroLeft = hero.x;
    const heroRight = hero.x + hero.width;
    const heroTop = hero.y;
    const heroBottom = hero.y + hero.height;

    const projLeft = this.x - this.width / 2;
    const projRight = this.x + this.width / 2;
    const projTop = this.y - this.height / 2;
    const projBottom = this.y + this.height / 2;

    return (
      projLeft < heroRight &&
      projRight > heroLeft &&
      projTop < heroBottom &&
      projBottom > heroTop
    );
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.isDead) return;

    ctx.save();

    if (this.isDelayedCharging) {
      // Pulsing pre-fire target beacon
      const pulse = (Math.sin(this.lifetime * 20) + 1) * 0.5;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.5 + pulse * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 16 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (this.type === 'shockwave') {
      // Render ground electrical / rock shockwave
      const pulse = (Math.sin(this.lifetime * 25) + 1) * 0.5;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x - 18, this.y + this.height);
      ctx.lineTo(this.x, this.y - pulse * 10);
      ctx.lineTo(this.x + 18, this.y + this.height);
      ctx.closePath();
      ctx.fill();

      // Energy sparks along crest
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.x - 14, this.y + this.height);
      ctx.lineTo(this.x, this.y - pulse * 12);
      ctx.lineTo(this.x + 14, this.y + this.height);
      ctx.stroke();

      // Warning text above wave
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('JUMP!', this.x, this.y - 18);
    } else if (this.type === 'fast') {
      // High-velocity energy lance
      const angle = Math.atan2(this.vy, this.vx);
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-14, -2.5, 28, 5);
      ctx.fillStyle = this.color;
      ctx.fillRect(-22, -1.5, 12, 3);
    } else if (this.type === 'slow') {
      // Large heavy dark plasma orb
      const pulse = Math.sin(this.lifetime * 8) * 3;
      const glowGrad = ctx.createRadialGradient(this.x, this.y, 6, this.x, this.y, this.width + pulse);
      glowGrad.addColorStop(0, '#fef08a');
      glowGrad.addColorStop(0.35, this.color);
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width + pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'tracking') {
      // Ethereal tracking comet with cyan/purple aura
      const glowGrad = ctx.createRadialGradient(this.x, this.y, 4, this.x, this.y, 22);
      glowGrad.addColorStop(0, '#ffffff');
      glowGrad.addColorStop(0.4, '#a855f7');
      glowGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 22, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Render floating energy orb or fireball
      const glowGrad = ctx.createRadialGradient(
        this.x,
        this.y,
        4,
        this.x,
        this.y,
        this.width
      );
      glowGrad.addColorStop(0, '#ffffff');
      glowGrad.addColorStop(0.4, this.color);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
