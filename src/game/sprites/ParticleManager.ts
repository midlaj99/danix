export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'smoke' | 'slash' | 'damage_text' | 'heal_text' | 'xp_orb';
  text?: string;
}

export class ParticleManager {
  private particles: Particle[] = [];

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.type === 'damage_text' || p.type === 'heal_text') {
        p.vy += -20 * dt; // Float gently upward
      } else if (p.type === 'spark' || p.type === 'smoke') {
        p.vy += 80 * dt; // Gravity
      }
    }

    // High FPS optimization: cap particles to prevent fill-rate lag on low-power mobile GPUs
    if (this.particles.length > 120) {
      this.particles.splice(0, this.particles.length - 120);
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      if (p.type === 'damage_text' || p.type === 'heal_text') {
        ctx.font = 'bold 20px "Cinzel", serif';
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(p.text || '', p.x, p.y);
        ctx.fillText(p.text || '', p.x, p.y);
      } else if (p.type === 'slash') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  public spawnSparks(x: number, y: number, color: string, count: number = 15) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 160;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        type: 'spark',
      });
    }
  }

  public spawnDamageText(x: number, y: number, text: string, isCrit: boolean = false) {
    this.particles.push({
      x: x + (Math.random() * 20 - 10),
      y: y - 20,
      vx: (Math.random() - 0.5) * 30,
      vy: -90,
      color: isCrit ? '#fbbf24' : '#ef4444',
      size: isCrit ? 26 : 20,
      alpha: 1,
      life: 0.9,
      maxLife: 0.9,
      type: 'damage_text',
      text,
    });
  }

  public spawnSlashWave(x: number, y: number, facingRight: boolean, color: string = '#60a5fa') {
    const dir = facingRight ? 1 : -1;
    for (let i = -20; i <= 20; i += 4) {
      this.particles.push({
        x: x + dir * 30,
        y: y + i,
        vx: dir * (120 + Math.random() * 40),
        vy: i * 2,
        color,
        size: 4 + Math.random() * 3,
        alpha: 1,
        life: 0.3,
        maxLife: 0.3,
        type: 'slash',
      });
    }
  }

  public clear() {
    this.particles = [];
  }
}
