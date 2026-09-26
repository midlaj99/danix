export type RadoxomType = 'vector' | 'fire' | 'cleave' | 'laser' | 'omnislash';

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  size: number;
}

export type RadoxomStatus = 'unlocked' | 'collected' | 'available' | 'fired' | 'hit' | 'missed' | 'consumed';

export class RadoxomProjectile {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public speed: number = 680;
  public radius: number = 10;
  public damage: number = 50;
  public type: RadoxomType = 'vector';
  public color: string = '#38bdf8';
  public lifetime: number = 0;
  public maxLifetime: number = 2.8;
  public isDead: boolean = false;
  public alreadyResolved: boolean = false;
  public status: RadoxomStatus = 'fired';
  public trail: TrailPoint[] = [];
  private trailTimer: number = 0;
  public launchedWhileStatic: boolean = false;
  public originHeroX: number = 0;

  constructor(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    type: RadoxomType = 'vector',
    damageMultiplier: number = 1.0
  ) {
    this.x = startX;
    this.y = startY;
    this.type = type;
    this.alreadyResolved = false;
    this.status = 'fired';

    // Calculate angle towards target
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);

    const dirX = dist > 0 ? dx / dist : 1;
    const dirY = dist > 0 ? dy / dist : 0;

    // Type characteristics & balanced damage
    switch (type) {
      case 'fire':
        this.color = '#f97316';
        this.speed = 660;
        this.damage = Math.round(65 * damageMultiplier);
        this.radius = 12;
        break;
      case 'cleave':
        this.color = '#22c55e';
        this.speed = 720;
        this.damage = Math.round(60 * damageMultiplier);
        this.radius = 14;
        break;
      case 'laser':
        this.color = '#c084fc';
        this.speed = 900;
        this.damage = Math.round(75 * damageMultiplier);
        this.radius = 9;
        break;
      case 'omnislash':
        this.color = '#facc15';
        this.speed = 800;
        this.damage = Math.round(90 * damageMultiplier);
        this.radius = 13;
        break;
      case 'vector':
      default:
        this.color = '#38bdf8';
        this.speed = 700;
        this.damage = Math.round(50 * damageMultiplier);
        this.radius = 10;
        break;
    }

    this.vx = dirX * this.speed;
    this.vy = dirY * this.speed;
  }

  public consume(outcome: 'hit' | 'missed'): void {
    if (this.alreadyResolved) return;
    this.alreadyResolved = true;
    this.status = outcome;
    this.isDead = true;
  }

  public update(dt: number, worldWidth: number, groundY: number): void {
    if (this.isDead) return;

    this.lifetime += dt;
    if (this.lifetime >= this.maxLifetime) {
      this.isDead = true;
      return;
    }

    // Integrate position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Boundary check
    if (this.x < 0 || this.x > worldWidth || this.y < -100 || this.y > groundY + 30) {
      this.isDead = true;
      return;
    }

    // Update trail
    this.trailTimer += dt;
    if (this.trailTimer > 0.02) {
      this.trailTimer = 0;
      this.trail.push({
        x: this.x,
        y: this.y,
        alpha: 0.85,
        size: this.radius,
      });
      if (this.trail.length > 12) {
        this.trail.shift();
      }
    }

    // Fade trail points
    for (const point of this.trail) {
      point.alpha = Math.max(0, point.alpha - dt * 2.8);
      point.size = Math.max(2, point.size - dt * 8);
    }
  }

  public checkCollision(
    targetX: number,
    targetY: number,
    targetWidth: number,
    targetHeight: number
  ): boolean {
    if (this.isDead) return false;

    // Bounding box with circle expansion
    const left = targetX - targetWidth / 2;
    const right = targetX + targetWidth / 2;
    const top = targetY;
    const bottom = targetY + targetHeight;

    const nearestX = Math.max(left, Math.min(this.x, right));
    const nearestY = Math.max(top, Math.min(this.y, bottom));

    const dx = this.x - nearestX;
    const dy = this.y - nearestY;

    return dx * dx + dy * dy < this.radius * this.radius;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.isDead) return;

    ctx.save();

    // 1. Draw luminous trail
    for (const pt of this.trail) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = pt.alpha * 0.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw outer glow aura
    const pulse = (Math.sin(this.lifetime * 20) + 1) * 0.5;
    ctx.globalAlpha = 0.45;
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.4,
      this.x,
      this.y,
      this.radius * (1.8 + pulse * 0.4)
    );
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Draw energy core
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // 4. Draw outer colored rim
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}
