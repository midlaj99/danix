import { Hero } from './entities/Hero';
import { Monster } from './entities/Monster';
import { ParticleManager } from './sprites/ParticleManager';
import { LevelConfig } from '../types/curriculum';
import { SoundManager } from '../audio/SoundManager';
import { RadoxomProjectile } from './entities/RadoxomProjectile';
import { MonsterProjectile } from './entities/MonsterProjectile';
import { CombatStats } from '../types/game';
import { GameStateManager } from '../state/GameState';
import { InputManager } from './systems/InputManager';
import { CombatAIDebugSnapshot } from './ai/CombatDirector';
import { RadoxomEconomyManager } from './systems/RadoxomEconomyManager';
import { ViewportManager } from './systems/ViewportManager';

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  color: string;
  type: 'firefly' | 'sakura' | 'ember' | 'crystal' | 'spark' | 'stardust';
}

interface WorldCrystal {
  x: number;
  y: number;
  collected: boolean;
  angle: number;
}

export interface ArenaHazardZone {
  x: number;
  y: number;
  radius: number;
  state: 'warning' | 'active' | 'expired';
  warningTimer: number;
  activeTimer: number;
  totalWarningTime: number;
  pulseTimer: number;
  damagePerSec: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private input: InputManager;

  public hero: Hero;
  public monster: Monster | null = null;
  public particles: ParticleManager;
  public levelConfig: LevelConfig;

  // World parameters
  public readonly worldWidth = 2400;
  public groundY = 400;
  public cameraX = 0;
  public cameraY = 0;
  public cameraZoom = 1.0;
  public targetCameraZoom = 1.0;
  public viewportWidth = 1920;
  public viewportHeight = 1080;
  public dpr = 1;

  // Screen shake & cinematic mode
  private shakeTimer = 0;
  private shakeIntensity = 0;
  public isCinematicIntro = false;

  // Real-time 1v1 Combat Fields
  public isRealTimeCombat: boolean = false;
  public isCombatEntrySequence: boolean = false;
  public combatEntryPhase: 'RUN_IN' | 'ROAR_TALK' | 'ENGAGE' = 'ENGAGE';
  public combatEntryTimer: number = 0;
  public monsterDialogueText: string = '';
  public radoxomProjectiles: RadoxomProjectile[] = [];
  public monsterProjectiles: MonsterProjectile[] = [];
  public radoxomsAvailable: number = 0;
  public combatStats: CombatStats = {
    radoxomsEarned: 0,
    radoxomsFired: 0,
    radoxomsHit: 0,
    radoxomsMissed: 0,
    attacksDodged: 0,
    damageDealt: 0,
    damageTaken: 0,
    accuracy: 0,
  };
  public arenaMinX: number = 650;
  public arenaMaxX: number = 1450;
  public mouseX: number = 0;
  public mouseY: number = 0;
  private ammoExhaustionTimer: number = 0;
  public aimIndicatorAlpha: number = 0;
  public hazardZones: ArenaHazardZone[] = [];
  public combatDurationTimer: number = 0;

  // World Interactives
  public crystals: WorldCrystal[] = [];
  public shrineX = 520;
  public shrineActivated = false;
  public nearShrine = false;
  public nearPuzzleGate = false;

  // Ambient particles
  private ambientParticles: AmbientParticle[] = [];

  // Minions for multi-monster stages
  public minions: Monster[] = [];

  // Keyboard state
  public keys = {
    left: false,
    right: false,
    jump: false,
    sprint: false,
    dodge: false,
    interact: false,
  };

  // State flags
  public isPaused: boolean = false;
  public inEncounter: boolean = false;
  private encounterTriggered: boolean = false;

  // Event Callbacks
  public onEncounter: (() => void) | null = null;
  public onHeroDeath: (() => void) | null = null;
  public onMonsterDefeat: (() => void) | null = null;
  public onShrineActivated: (() => void) | null = null;
  public onPuzzleGatePrompt: (() => void) | null = null;
  public onCombatStatsUpdated: ((stats: CombatStats) => void) | null = null;
  public onRadoxomCountChanged: ((count: number) => void) | null = null;
  public onCombatVictory: ((stats: CombatStats) => void) | null = null;
  public onCombatDefeat: ((stats: CombatStats, reason: 'slain' | 'ammo_exhausted') => void) | null = null;
  public onHeroHealthChanged: ((hp: number, maxHp: number, shield: number, maxShield: number) => void) | null = null;
  public onMonsterHealthChanged: ((hp: number, maxHp: number) => void) | null = null;
  public onHeroStaminaChanged: ((stamina: number, maxStamina: number) => void) | null = null;
  public onAIDebugUpdate: ((snapshot: CombatAIDebugSnapshot | null) => void) | null = null;
  public onUltimateChargeChanged: ((charge: number, isReady: boolean, ultimateName: string) => void) | null = null;
  public bulletTimeTimer: number = 0;
  public bulletTimeScale: number = 1.0;
  public showAIDebugOverlay: boolean = false;

  public notifyUltimateState() {
    this.onUltimateChargeChanged?.(
      this.hero.ultimateCharge,
      this.hero.isUltimateReady(),
      this.hero.ultimateName
    );
  }

  public toggleAIDebugOverlay(): boolean {
    this.showAIDebugOverlay = !this.showAIDebugOverlay;
    if (!this.showAIDebugOverlay) {
      this.onAIDebugUpdate?.(null);
    }
    return this.showAIDebugOverlay;
  }

  constructor(canvas: HTMLCanvasElement, levelConfig: LevelConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.levelConfig = levelConfig;

    this.input = InputManager.getInstance();
    this.input.setCanvas(canvas);

    this.hero = new Hero();
    this.hero.y = this.groundY - this.hero.height;
    this.particles = new ParticleManager();

    this.initWorldInteractives();
    this.initAmbientParticles();
    this.spawnMonster();
    this.setupInputs();
  }

  private initWorldInteractives() {
    this.crystals = [
      { x: 260, y: this.groundY - 50, collected: false, angle: 0 },
      { x: 440, y: this.groundY - 75, collected: false, angle: 1 },
      { x: 680, y: this.groundY - 60, collected: false, angle: 2 },
    ];
    this.shrineActivated = false;
    this.nearShrine = false;
    this.nearPuzzleGate = false;
  }

  private initAmbientParticles() {
    this.ambientParticles = [];
    const envType = this.levelConfig.environment.type;
    const isVillage = envType === 'village' || this.levelConfig.id === 1;

    let count = 60;
    let type: AmbientParticle['type'] = 'stardust';
    let colors = ['#fef08a', '#facc15', '#e0f2fe', '#38bdf8'];

    if (isVillage || envType === 'forest' || envType === 'valley') {
      type = 'sakura';
      count = 95;
      colors = ['#fbcfe8', '#f472b6', '#fda4af', '#fce7f3', '#fef08a'];
    } else if (envType === 'ruins' || this.levelConfig.id === 3) {
      type = 'ember';
      colors = ['#f97316', '#ea580c', '#ef4444', '#fef08a'];
    } else if (envType === 'caves') {
      type = 'crystal';
      colors = ['#c084fc', '#38bdf8', '#e879f9', '#fdf4ff'];
    } else if (envType === 'fortress') {
      type = 'spark';
      colors = ['#ef4444', '#f59e0b', '#dc2626'];
    } else if (envType === 'celestial') {
      type = 'stardust';
      count = 80;
      colors = ['#fde047', '#38bdf8', '#c084fc', '#ffffff'];
    }

    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.worldWidth,
        y: Math.random() * (this.groundY + 20),
        vx: type === 'sakura' ? 25 + Math.random() * 30 : (Math.random() - 0.5) * 20,
        vy: type === 'ember' ? -35 - Math.random() * 25 : 15 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
        size: type === 'sakura' ? 3 + Math.random() * 3 : 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
      });
    }
  }

  public setLevel(config: LevelConfig) {
    this.levelConfig = config;
    this.hero.x = 100;
    this.hero.y = this.groundY - this.hero.height;
    this.hero.vx = 0;
    this.hero.vy = 0;
    this.hero.state = 'idle';
    this.hero.facingRight = true;
    this.encounterTriggered = false;
    this.inEncounter = false;
    this.isCinematicIntro = false;
    this.isRealTimeCombat = false;
    this.radoxomProjectiles = [];
    this.monsterProjectiles = [];
    this.radoxomsAvailable = 0;
    this.particles.clear();
    this.initWorldInteractives();
    this.initAmbientParticles();
    this.spawnMonster();
  }

  private spawnMonster() {
    this.monster = new Monster(this.levelConfig.monster, 920, this.groundY, false, this.levelConfig.id);
    this.monster.isEntering = true;
    this.monster.entranceTimer = 0;

    this.minions = [];
    if (this.levelConfig.minions && this.levelConfig.minions.length > 0) {
      this.levelConfig.minions.forEach((minionCfg, idx) => {
        const offset = idx === 0 ? -110 : 120;
        const minion = new Monster(minionCfg, 920 + offset, this.groundY, true, this.levelConfig.id);
        minion.isEntering = true;
        this.minions.push(minion);
      });
    }
  }

  public spawnHazardZone(x: number, y: number, radius: number, duration: number, warningTime: number) {
    const hazard: ArenaHazardZone = {
      x,
      y,
      radius,
      state: 'warning',
      warningTimer: warningTime,
      activeTimer: duration,
      totalWarningTime: warningTime,
      pulseTimer: 0,
      damagePerSec: 18 + this.levelConfig.id * 1.5,
    };
    this.hazardZones.push(hazard);
  }

  public triggerScreenShake(duration: number = 0.35, intensity: number = 10) {
    this.shakeTimer = duration;
    this.shakeIntensity = intensity;
  }

  /* ------------------- REAL-TIME 1v1 COMBAT CONTROLLER ------------------- */

  public startRealtimeCombat(radoxomsEarned: number) {
    this.isRealTimeCombat = true;
    this.isCombatEntrySequence = true;
    this.combatEntryPhase = 'RUN_IN';
    this.combatEntryTimer = 1.3;
    this.inEncounter = false;
    this.isCinematicIntro = false;
    this.radoxomsAvailable = radoxomsEarned;
    this.hero.radoxomAmmoCount = radoxomsEarned;
    this.radoxomProjectiles = [];
    this.monsterProjectiles = [];
    this.hazardZones = [];
    this.combatDurationTimer = 0;
    this.ammoExhaustionTimer = 0;
    this.hero.resetUltimate();
    this.notifyUltimateState();

    // Prepare challenging and humiliating dialogue
    const introLines = this.levelConfig.monster.introDialogue;
    if (introLines && introLines.length > 0) {
      this.monsterDialogueText = introLines.join(' ');
    } else {
      this.monsterDialogueText = 'GRRR! You dare bring elementary scalar delusions before me?! Your dimensions will be crushed into zero bytes, worm!';
    }

    this.combatStats = {
      radoxomsEarned,
      radoxomsFired: 0,
      radoxomsHit: 0,
      radoxomsMissed: 0,
      attacksDodged: 0,
      damageDealt: 0,
      damageTaken: 0,
      accuracy: 0,
      timeSurvived: 0,
      timeToDefeat: 0,
      attacksAvoided: 0,
      combatRating: 'B',
    };

    // Sync player stats
    const stats = GameStateManager.getInstance().getState().playerStats;
    this.hero.currentShield = stats.currentShield;
    this.hero.maxShield = stats.maxShield;

    // Arena placement: Hero stands firm on the left
    this.hero.x = 680;
    this.hero.y = this.groundY - this.hero.height;
    this.hero.vx = 0;
    this.hero.vy = 0;
    this.hero.facingRight = true;
    this.hero.state = 'idle';

    if (this.monster) {
      // Monster starts OUTSIDE the screen on the far right (x = 1520), charging in!
      this.monster.x = 1520;
      this.monster.vx = -340;
      this.monster.facingRight = false;
      this.monster.isEntering = false;
      this.monster.isDefeated = false;
      this.monster.currentHp = this.monster.maxHp;

      if (this.monster.isFlying) {
        this.monster.y = this.groundY - this.monster.height - this.monster.altitude;
        this.monster.state = 'hover';
      } else {
        this.monster.y = this.groundY - this.monster.height;
        this.monster.state = 'chase';
      }
    }

    this.cameraX = 700;
    this.onRadoxomCountChanged?.(this.radoxomsAvailable);
    this.onCombatStatsUpdated?.(this.combatStats);
  }

  public fireRadoxom() {
    if (this.hero.state === 'death') return;
    if (!this.hero.canAttack()) return;
    if (this.isCombatEntrySequence) {
      this.particles.spawnDamageText(this.hero.x, this.hero.y - 30, 'ESTABLISHING ENGAGEMENT...', false);
      return;
    }

    const startX = this.hero.x + (this.hero.facingRight ? 35 : -10);
    const startY = this.hero.y + this.hero.height / 2 - 8;
    const aimAngle = this.hero.aimAngle;
    const targetWorldX = startX + Math.cos(aimAngle) * 550;
    const targetWorldY = startY + Math.sin(aimAngle) * 550;

    // 0. STRICT ANTI-STATIC REQUIREMENT: Hero MUST have movement momentum to initiate attacks!
    if (this.isRealTimeCombat && this.hero.isStaticStance) {
      this.hero.staticWarnTimer = 0.45;
      SoundManager.getInstance().playShieldBlock();
      this.triggerScreenShake(0.12, 4);
      this.particles.spawnDamageText(this.hero.x, this.hero.y - 30, '⚠️ MOVE TO STRIKE! (STATIC)', false, '#f59e0b');
      this.particles.spawnSparks(this.hero.x, this.hero.y + this.hero.height - 4, '#f59e0b', 16);
      if (this.monster && !this.monster.isDefeated) {
        this.monster.punishStaticCamper(this.hero.x);
      }
      return;
    }

    // Guaranteed attack: if in real-time combat and has ammo -> fire Radoxom
    if (this.isRealTimeCombat && this.radoxomsAvailable > 0) {
      const projectileId = `PROJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const consumed = RadoxomEconomyManager.getInstance().consumeRadoxom(projectileId);
      if (!consumed) return;

      this.radoxomsAvailable--;
      this.hero.radoxomAmmoCount = this.radoxomsAvailable;
      this.combatStats.radoxomsFired++;

      this.hero.triggerFireRadoxom(aimAngle);

      let radoxomType: 'vector' | 'fire' | 'cleave' | 'laser' | 'omnislash' = 'vector';
      if (this.hero.attackStyle === 'fire') radoxomType = 'fire';
      else if (this.hero.attackStyle === 'cleave') radoxomType = 'cleave';
      else if (this.hero.attackStyle === 'laser') radoxomType = 'laser';
      else if (this.hero.attackStyle === 'omnislash') radoxomType = 'omnislash';

      const proj = new RadoxomProjectile(startX, startY, targetWorldX, targetWorldY, radoxomType, 1.0);
      proj.launchedWhileStatic = this.hero.isStaticStance;
      proj.originHeroX = this.hero.x;
      this.radoxomProjectiles.push(proj);

      // Attack audio
      if (radoxomType === 'laser') {
        SoundManager.getInstance().playLaserBlast();
      } else if (radoxomType === 'fire') {
        SoundManager.getInstance().playFlameExplosion();
      } else {
        SoundManager.getInstance().playAttackSlash();
      }

      this.onRadoxomCountChanged?.(this.radoxomsAvailable);
      this.updateCombatAccuracy();
    } else {
      // Kinetic Vector Slash Wave fallback!
      this.hero.triggerAttack();
      SoundManager.getInstance().playAttackSlash();

      // Launch physical kinetic crescent wave
      const kineticWave = new RadoxomProjectile(
        startX,
        startY,
        startX + (this.hero.facingRight ? 300 : -300),
        startY,
        'vector',
        0.55
      );
      kineticWave.launchedWhileStatic = this.hero.isStaticStance;
      kineticWave.originHeroX = this.hero.x;
      this.radoxomProjectiles.push(kineticWave);
      this.particles.spawnSlashWave(this.hero.x + 20, this.hero.y + 10, this.hero.facingRight, this.hero.auraColor);

      if (this.isRealTimeCombat && this.radoxomsAvailable <= 0) {
        this.particles.spawnDamageText(this.hero.x, this.hero.y - 25, '⚔ KINETIC SLASH', false);
      }
    }
  }

  public dealDamageToHero(amount: number) {
    if (this.hero.state === 'death') return;

    if (this.hero.isDodging) {
      if (this.hero.isInvulnerable) {
        this.combatStats.attacksDodged++;
        SoundManager.getInstance().playDashWhoosh();
        this.particles.spawnDamageText(this.hero.x, this.hero.y - 25, '★ DODGED! (0 DMG)', true);
        this.particles.spawnSparks(this.hero.x, this.hero.y, '#38bdf8', 18);
        this.updateCombatAccuracy();
        return;
      }
      // If caught in dodge startup or recovery, attack connects with counterplay penalty
    }

    this.combatStats.damageTaken += amount;
    this.updateCombatAccuracy();

    const dmgResult = GameStateManager.getInstance().takeDamage(amount);
    const currentHp = dmgResult.hpRemaining;
    const playerStats = GameStateManager.getInstance().getState().playerStats;

    this.hero.currentShield = playerStats.currentShield;
    this.hero.triggerHurt();

    // Kinetic physical knockback on hero
    const knockDir = this.monster ? (this.hero.x >= this.monster.x ? 1 : -1) : 1;
    this.hero.applyKnockback(knockDir * 240, -160);

    SoundManager.getInstance().playHitImpact();
    this.triggerScreenShake(0.35, 14);
    this.particles.spawnSparks(this.hero.x + 20, this.hero.y + 30, '#ef4444', 28);
    this.particles.spawnDamageText(this.hero.x + 20, this.hero.y - 15, `-${amount} HP`, true);

    this.onHeroHealthChanged?.(currentHp, playerStats.maxHp, playerStats.currentShield, playerStats.maxShield);

    if (currentHp <= 0) {
      this.hero.triggerDeath();
      SoundManager.getInstance().playPlayerDeath();
      setTimeout(() => {
        this.handleCombatDefeat('slain');
      }, 900);
    }
  }

  private handleCombatVictory() {
    if (!this.monster) return;
    this.monster.triggerDeath();
    this.hero.triggerVictory();
    SoundManager.getInstance().playVictoryFanfare();
    this.triggerScreenShake(0.6, 18);
    this.particles.spawnSparks(this.monster.x + 30, this.monster.y + 30, '#facc15', 50);
    this.particles.spawnDamageText(this.monster.x + 20, this.monster.y - 40, '★ VICTORY! ★', true);

    this.combatStats.timeToDefeat = Math.round(this.combatDurationTimer * 10) / 10;
    this.combatStats.attacksAvoided = this.combatStats.attacksDodged;

    // Performance-based Combat Rating (S / A / B / C)
    if (this.combatStats.accuracy >= 75 && this.combatStats.damageTaken <= 25 && this.combatStats.timeToDefeat <= 35) {
      this.combatStats.combatRating = 'S';
    } else if (this.combatStats.accuracy >= 60 && this.combatStats.damageTaken <= 55) {
      this.combatStats.combatRating = 'A';
    } else if (this.combatStats.accuracy >= 45) {
      this.combatStats.combatRating = 'B';
    } else {
      this.combatStats.combatRating = 'C';
    }

    this.updateCombatAccuracy();

    setTimeout(() => {
      this.isRealTimeCombat = false;
      this.onCombatVictory?.(this.combatStats);
    }, 1500);
  }

  private handleCombatDefeat(reason: 'slain' | 'ammo_exhausted') {
    this.isRealTimeCombat = false;
    this.hero.state = 'death';
    this.hero.vx = 0;
    this.hero.vy = 0;
    // Freeze combat economy and eliminate active projectiles immediately
    this.radoxomProjectiles = [];
    this.monsterProjectiles = [];
    this.hazardZones = [];
    RadoxomEconomyManager.getInstance().freezeEconomyOnDeath();
    this.updateCombatAccuracy();
    this.onCombatDefeat?.(this.combatStats, reason);
  }

  private updateCombatAccuracy() {
    if (this.combatStats.radoxomsFired > 0) {
      this.combatStats.accuracy = Math.round(
        (this.combatStats.radoxomsHit / this.combatStats.radoxomsFired) * 100
      );
    } else {
      this.combatStats.accuracy = 0;
    }
    this.onCombatStatsUpdated?.(this.combatStats);
  }

  public executeHeroAttack(damage: number, isCrit: boolean = false) {
    if (this.hero.isStaticStance) {
      this.hero.staticWarnTimer = 0.45;
      SoundManager.getInstance().playShieldBlock();
      this.particles.spawnDamageText(this.hero.x, this.hero.y - 30, '⚠️ MOVE TO STRIKE! (STATIC)', false, '#f59e0b');
      this.particles.spawnSparks(this.hero.x, this.hero.y + this.hero.height - 4, '#f59e0b', 16);
      if (this.monster && !this.monster.isDefeated) {
        this.monster.punishStaticCamper(this.hero.x);
      }
      return;
    }

    if (this.monster) {
      this.hero.triggerAttack(this.monster.x);
    } else {
      this.hero.triggerAttack();
    }

    // Play attack elemental sound
    if (this.hero.attackStyle === 'laser') {
      SoundManager.getInstance().playLaserBlast();
    } else if (this.hero.attackStyle === 'fire') {
      SoundManager.getInstance().playFlameExplosion();
    } else {
      SoundManager.getInstance().playAttackSlash();
    }

    setTimeout(() => {
      if (this.monster && !this.monster.isDefeated) {
        const hurtResult = this.monster.triggerHurt(damage, {
          damage,
          attackerX: this.hero.x,
          attackerY: this.hero.y,
          attackerVx: this.hero.vx,
          attackerIsGrounded: this.hero.isGrounded,
          attackerIsAirborne: !this.hero.isGrounded,
          attackerIsDodging: this.hero.isDodging,
          attackerIsStatic: this.hero.isStaticStance,
          isMeleeSlash: true,
        });

        if (hurtResult.wasDeflected) {
          SoundManager.getInstance().playShieldBlock();
          this.triggerScreenShake(0.2, 8);
          this.particles.spawnDamageText(this.monster.x + 30, this.monster.y - 15, hurtResult.feedbackText, false, hurtResult.feedbackColor);
          this.particles.spawnSparks(this.monster.x + 30, this.monster.y + 35, '#f59e0b', 24);
        } else {
          if (hurtResult.wasGuarded) {
            SoundManager.getInstance().playSwordClash();
          } else {
            SoundManager.getInstance().playHitImpact();
          }
          this.triggerScreenShake(0.3, hurtResult.isCritical ? 14 : 8);
          this.particles.spawnSparks(
            this.monster.x + 30,
            this.monster.y + 35,
            hurtResult.isCritical ? '#fbbf24' : this.hero.auraColor,
            28
          );
          this.particles.spawnDamageText(this.monster.x + 30, this.monster.y - 15, hurtResult.feedbackText, hurtResult.isCritical, hurtResult.feedbackColor);
          this.particles.spawnSlashWave(this.hero.x + 20, this.hero.y + 10, this.hero.facingRight, this.hero.auraColor);

          // Build Ultimate Charge on hit
          this.hero.addUltimateCharge(14);
          this.notifyUltimateState();

          // AoE Splash Damage to Minions on multi-monster battle
          if (this.minions.length > 0 && this.hero.attackStyle !== 'slash') {
            const splashDmg = Math.max(15, Math.round(damage * 0.65));
            for (const minion of this.minions) {
              if (!minion.isDefeated) {
                minion.triggerHurt(splashDmg);
                this.particles.spawnSparks(minion.x + 20, minion.y + 20, this.hero.auraColor, 18);
                this.particles.spawnDamageText(minion.x + 20, minion.y - 10, `-${splashDmg} AOE`, false);
              }
            }
          }

          if (this.monster.currentHp <= 0) {
            setTimeout(() => {
              if (this.onMonsterDefeat) this.onMonsterDefeat();
            }, 900);
          }
        }
      }
    }, 240);
  }

  public executeHeroUltimate() {
    if (!this.hero.isUltimateReady() || this.hero.isExecutingUltimate || !this.monster || this.monster.isDefeated) {
      return;
    }

    const ultName = this.hero.ultimateName;
    this.hero.ultimateCharge = 0;
    this.hero.isExecutingUltimate = true;
    this.hero.ultimateTimer = 0.85;
    this.hero.isInvulnerable = true;
    this.notifyUltimateState();

    // Sound FX: Rising laser build-up into sub-bass explosion
    SoundManager.getInstance().playUltimateBurst();

    // Cinematic slow-mo bullet-time effect
    this.bulletTimeTimer = 0.55;
    this.bulletTimeScale = 0.2;

    // Screen Shake
    this.triggerScreenShake(0.8, 22);

    // Flashy visual effects
    this.particles.spawnSparks(this.hero.x, this.hero.y, '#facc15', 40);
    this.particles.spawnSlashWave(this.hero.x, this.hero.y, this.hero.facingRight, '#facc15');

    // Massive In-world Announcement Banner
    this.particles.spawnDamageText(
      (this.hero.x + this.monster.x) / 2,
      this.groundY - 140,
      `★ ${ultName.toUpperCase()}! ★`,
      true,
      '#facc15'
    );

    // Damage & Poise break on Monster
    const ultDamage = Math.max(90, Math.round(this.monster.maxHp * 0.42));
    this.monster.triggerHurt(ultDamage, {
      damage: ultDamage,
      attackerX: this.hero.x,
      attackerY: this.hero.y,
      attackerVx: this.hero.vx,
      attackerIsGrounded: true,
      attackerIsAirborne: false,
      attackerIsDodging: false,
      attackerIsStatic: false,
      isMeleeSlash: true,
    });

    // Guard break: Force stagger for 4 seconds!
    this.monster.isStaggered = true;
    this.monster.guardBreakTimer = 4.0;
    this.monster.director.poise = 0;

    this.particles.spawnSparks(this.monster.x + 30, this.monster.y + 30, '#f59e0b', 45);
    this.particles.spawnDamageText(this.monster.x + 30, this.monster.y - 30, `💥 ${ultDamage} ULTIMATE CRIT!`, true, '#facc15');

    this.combatStats.damageDealt += ultDamage;
    this.onMonsterHealthChanged?.(this.monster.currentHp, this.monster.maxHp);

    if (this.monster.currentHp <= 0) {
      // Cinematic Finishing Execution!
      SoundManager.getInstance().playFinishingExecution();
      this.particles.spawnDamageText(
        (this.hero.x + this.monster.x) / 2,
        this.groundY - 180,
        '⚡ FINISHING MOVE EXECUTION! ⚡',
        true,
        '#38bdf8'
      );
      this.handleCombatVictory();
    }
  }

  public executeMonsterAttack(damage: number) {
    if (!this.monster || this.monster.isDefeated) return;

    // Telegraph attack first to give the player a dodge window
    this.monster.triggerTelegraph(this.hero.x, () => {
      if (this.monster && !this.monster.isDefeated) {
        this.monster.triggerAttack(this.hero.x);
        SoundManager.getInstance().playMonsterRoar();

        setTimeout(() => {
          // Check if Hero is currently dodging (i-frames!)
          if (this.hero.isDodging) {
            SoundManager.getInstance().playDashWhoosh();
            this.particles.spawnDamageText(this.hero.x, this.hero.y - 25, '★ DODGED! (0 DMG)', true);
            this.particles.spawnSparks(this.hero.x, this.hero.y, '#38bdf8', 18);
            this.hero.addUltimateCharge(20);
            this.notifyUltimateState();
            return;
          }

          this.hero.triggerHurt();
          SoundManager.getInstance().playHitImpact();
          this.triggerScreenShake(0.4, 15);
          this.particles.spawnSparks(this.hero.x + 20, this.hero.y + 30, '#ef4444', 28);
          this.particles.spawnDamageText(this.hero.x + 20, this.hero.y - 15, `-${damage} HP`, true);
        }, 250);
      }
    });
  }

  private setupInputs() {
    // Delegated to centralized InputManager
  }

  private handleInteract() {
    // Interact with Shrine
    if (this.nearShrine && !this.shrineActivated) {
      this.shrineActivated = true;
      SoundManager.getInstance().playShrineResonance();
      this.triggerScreenShake(0.3, 8);
      this.particles.spawnSparks(this.shrineX, this.groundY - 60, '#facc15', 35);
      this.particles.spawnDamageText(this.hero.x, this.hero.y - 25, '★ SHRINE BLESSING: FULL HP + ATTACK UP!', true);
      if (this.onShrineActivated) {
        this.onShrineActivated();
      }
      return;
    }

    // Interact with Runic Dimensional Puzzle Gate
    if (this.nearPuzzleGate && this.levelConfig.puzzleGate && !this.levelConfig.puzzleGate.activated) {
      if (this.onPuzzleGatePrompt) {
        this.onPuzzleGatePrompt();
      }
    }
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public destroy() {
    this.stop();
  }

  public handleResize(width: number, height: number, dpr: number = 1) {
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.dpr = Math.max(1, dpr);

    if (height > width) {
      // Mobile portrait mode: elevated ground level provides generous room for bottom virtual controls
      this.groundY = Math.min(520, Math.floor(height * 0.60));
    } else if (height < 520) {
      // Mobile horizontal landscape mode: optimal combat ground positioning
      this.groundY = Math.min(height - 80, Math.floor(height * 0.72));
    } else {
      // Standard desktop / tablet widescreen
      this.groundY = Math.min(460, Math.floor(height * 0.62));
    }

    if (this.hero && this.hero.isGrounded) {
      this.hero.y = this.groundY - this.hero.height;
    }
  }

  private loop = (time: number) => {
    // High FPS Delta-Time Clamping: prevents simulation runaway if a frame drops
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    if (!this.isPaused) {
      this.update(dt);
    }
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
    }

    // Cinematic slow-mo bullet-time during ultimate execution
    if (this.bulletTimeTimer > 0) {
      this.bulletTimeTimer -= dt;
      dt = dt * this.bulletTimeScale;
      if (this.bulletTimeTimer <= 0) {
        this.bulletTimeScale = 1.0;
      }
    }

    // Sync camera transform to InputManager
    this.input.setCameraTransform(this.cameraX, this.cameraY, this.cameraZoom);
    this.mouseX = this.input.mouseScreenX;
    this.mouseY = this.input.mouseScreenY;

    // Direct aim angle: player controls aiming (no auto-aim lock/cheat)
    const heroCenterX = this.hero.x + this.hero.width / 2;
    const heroCenterY = this.hero.y + this.hero.height / 2;

    if (this.input.isTouchMode) {
      if (this.input.isAiming && this.input.mobileAimAngle !== null) {
        this.hero.aimAngle = this.input.mobileAimAngle;
        this.hero.facingRight = Math.cos(this.hero.aimAngle) >= 0;
        this.aimIndicatorAlpha = Math.min(1, this.aimIndicatorAlpha + dt * 8);
      } else {
        // When not actively dragging aim, default facing direction & smoothly fade indicator
        this.hero.aimAngle = this.hero.facingRight ? 0 : Math.PI;
        this.aimIndicatorAlpha = Math.max(0, this.aimIndicatorAlpha - dt * 6);
      }
    } else {
      // Desktop mouse aim: accurate world mouse coordinates!
      this.hero.aimAngle = Math.atan2(this.input.mouseWorldY - heroCenterY, this.input.mouseWorldX - heroCenterX);
      this.hero.facingRight = this.input.mouseWorldX >= heroCenterX;
      this.aimIndicatorAlpha = this.isRealTimeCombat ? 1 : 0;
    }

    // Synchronize keys from InputManager
    this.keys.left = this.input.keys.left;
    this.keys.right = this.input.keys.right;
    this.keys.jump = this.input.keys.jump;
    this.keys.sprint = this.input.keys.sprint;
    this.keys.dodge = this.input.keys.dodge;
    this.keys.interact = this.input.keys.interact;

    // Trigger attacks from mouse click or hotkeys J / F
    if (this.input.justAttacked || this.input.justClicked) {
      this.fireRadoxom();
    }

    // Trigger ultimate skill from KeyR or KeyQ or UI button
    if (this.input.justUltimated) {
      this.executeHeroUltimate();
    }

    // Trigger interact
    if (this.input.keys.interact) {
      this.handleInteract();
    }

    const activeKeys =
      this.inEncounter && !this.isRealTimeCombat
        ? { left: false, right: false, jump: false, sprint: false, dodge: false }
        : this.keys;

    this.hero.update(dt, activeKeys, this.groundY, this.arenaMinX, this.arenaMaxX);

    if (this.isRealTimeCombat) {
      // 1. Increment combat timer & clamp Hero safely inside arena boundaries
      this.combatDurationTimer += dt;
      this.combatStats.timeSurvived = Math.round(this.combatDurationTimer * 10) / 10;
      this.hero.x = Math.max(this.arenaMinX + 15, Math.min(this.arenaMaxX - 15, this.hero.x));

      // Handle Combat Entry Positioning Sequence (Monster charges in, roars, and talks)
      if (this.isCombatEntrySequence && this.monster) {
        if (this.combatEntryPhase === 'RUN_IN') {
          this.combatEntryTimer -= dt;
          this.monster.x += this.monster.vx * dt;

          // Footstep ground sparks & camera rumble as monster charges in
          if (Math.random() < 0.4) {
            this.particles.spawnSparks(this.monster.x + 30, this.groundY, '#ef4444', 3);
            this.triggerScreenShake(0.08, 4);
          }

          if (this.monster.x <= 1040 || this.combatEntryTimer <= 0) {
            this.monster.x = Math.max(980, Math.min(1040, this.monster.x));
            this.monster.vx = 0;
            this.combatEntryPhase = 'ROAR_TALK';
            this.combatEntryTimer = 4.2; // 4.2s to read, immediately skippable by tap / space

            // Monster Roar & Boom on entrance!
            SoundManager.getInstance().playMonsterRoar();
            SoundManager.getInstance().playCinematicBoom();
            this.triggerScreenShake(0.65, 18);

            this.monster.state = 'attack';
            this.particles.spawnSparks(this.monster.x + 30, this.monster.y + 20, '#f97316', 32);
          }
        } else if (this.combatEntryPhase === 'ROAR_TALK') {
          this.combatEntryTimer -= dt;

          // Continuous roaring actions, fiery sparks & body vibration
          if (Math.random() < 0.35) {
            this.particles.spawnSparks(
              this.monster.x + 10 + Math.random() * 40,
              this.monster.y + 10 + Math.random() * 40,
              '#ef4444',
              2
            );
          }
          this.monster.y = this.groundY - this.monster.height + Math.sin(this.combatDurationTimer * 18) * 3;

          // Player can skip dialogue to fight immediately by tapping or pressing attack/space/ult
          if (
            this.input.justClicked ||
            this.input.justAttacked ||
            this.input.justJumped ||
            this.input.justUltimated ||
            this.combatEntryTimer <= 0
          ) {
            this.combatEntryPhase = 'ENGAGE';
            this.isCombatEntrySequence = false;
            this.monster.y = this.groundY - this.monster.height;
            this.monster.state = 'chase';
            this.particles.spawnDamageText(
              (this.hero.x + this.monster.x) / 2,
              this.groundY - 140,
              '⚔️ ENGAGE! ⚔️',
              true,
              '#ef4444'
            );
            SoundManager.getInstance().playSwordClash();
            this.triggerScreenShake(0.35, 12);
          }
        }
      }

      // Calculate hero real-time aim angle
      const heroCenterY = this.hero.y + this.hero.height / 2;
      const targetWorldX = this.mouseX + this.cameraX;
      const targetWorldY = this.mouseY;
      const heroAimAngle = Math.atan2(targetWorldY - heroCenterY, targetWorldX - this.hero.x);

      // 2. Monster Real-time AI with dynamic prediction and hazard pressure (Unlocks after entry dialogue)
      if (this.monster && !this.monster.isDefeated && !this.isCombatEntrySequence) {
        this.monster.updateRealtimeAI(
          dt,
          this.hero.x,
          this.hero.y,
          this.hero.isGrounded,
          this.groundY,
          this.arenaMinX,
          this.arenaMaxX,
          (type, sx, sy, tx, ty, dmg) => {
            let color = '#ef4444';
            if (type === 'shockwave') color = '#f59e0b';
            else if (type === 'fast') color = '#ec4899';
            else if (type === 'slow') color = '#a855f7';
            else if (type === 'tracking') color = '#06b6d4';
            else if (type === 'burst') color = '#f97316';
            else if (this.monster?.config.spriteType === 'fire_demon') color = '#f97316';

            const mProj = new MonsterProjectile(sx, sy, tx, ty, type, dmg, color);
            this.monsterProjectiles.push(mProj);
            if (type === 'shockwave') SoundManager.getInstance().playCinematicBoom();
            else SoundManager.getInstance().playLaserBlast();
          },
          (meleeDmg) => {
            this.dealDamageToHero(meleeDmg);
          },
          this.hero.vx,
          this.hero.vy,
          (hx, hy, rad, dur, warn) => {
            this.spawnHazardZone(hx, hy, rad, dur, warn);
          },
          this.hero.isDodging,
          heroAimAngle
        );
      }

      // Emit hero stamina and live AI debug snapshot
      this.onHeroStaminaChanged?.(this.hero.currentStamina, this.hero.maxStamina);
      if (this.showAIDebugOverlay && this.monster && !this.monster.isDefeated) {
        this.onAIDebugUpdate?.(this.monster.getDebugSnapshot(this.hero.x));
      }

      // 2.5 Update Arena Hazard Zones (punish camping, evadable with jumping)
      for (let i = this.hazardZones.length - 1; i >= 0; i--) {
        const hz = this.hazardZones[i];
        hz.pulseTimer += dt * 4;
        if (hz.state === 'warning') {
          hz.warningTimer -= dt;
          if (hz.warningTimer <= 0) {
            hz.state = 'active';
            SoundManager.getInstance().playFlameExplosion();
            this.triggerScreenShake(0.25, 9);
            this.particles.spawnSparks(hz.x, hz.y, '#f97316', 22);
          }
        } else if (hz.state === 'active') {
          hz.activeTimer -= dt;
          const heroDist = Math.abs(this.hero.x - hz.x);
          // Grounded heroes in the zone take hazard damage; jumping evades it!
          if (heroDist < hz.radius && this.hero.isGrounded && this.hero.state !== 'death') {
            const hazardDmg = Math.max(1, Math.round(hz.damagePerSec * dt * 3));
            this.dealDamageToHero(hazardDmg);
            this.particles.spawnSparks(this.hero.x, this.hero.y + 20, '#ef4444', 3);
          }
          if (hz.activeTimer <= 0) {
            hz.state = 'expired';
            this.hazardZones.splice(i, 1);
          }
        }
      }

      // 3. Anticipatory Evasion Evaluation against Incoming Radoxom Projectiles
      if (this.monster && !this.monster.isDefeated && this.radoxomProjectiles.length > 0) {
        this.monster.evaluateAnticipatoryDodges(this.radoxomProjectiles);
      }
      for (const minion of this.minions) {
        if (!minion.isDefeated && this.radoxomProjectiles.length > 0) {
          minion.evaluateAnticipatoryDodges(this.radoxomProjectiles);
        }
      }

      // Update Radoxom Projectiles & Collision with Monster (Anti-loophole single-hit resolution)
      for (let i = this.radoxomProjectiles.length - 1; i >= 0; i--) {
        const p = this.radoxomProjectiles[i];
        p.update(dt, this.worldWidth, this.groundY);

        if (p.isDead) {
          this.radoxomProjectiles.splice(i, 1);
          continue;
        }

        // Monster dodge reaction check when projectile is closing in
        if (this.monster && !this.monster.isDefeated) {
          this.monster.attemptDodgeProjectile(p.x, p.y, p.vx);

          // Check physical hit with idempotency guard
          if (p.checkCollision(this.monster.x, this.monster.y, this.monster.width, this.monster.height)) {
            if (p.alreadyResolved) continue;
            p.consume('hit');

            const hurtResult = this.monster.triggerHurt(p.damage, {
              damage: p.damage,
              attackerX: this.hero.x,
              attackerY: this.hero.y,
              attackerVx: this.hero.vx,
              attackerIsGrounded: this.hero.isGrounded,
              attackerIsAirborne: !this.hero.isGrounded,
              attackerIsDodging: this.hero.isDodging,
              attackerIsStatic: this.hero.isStaticStance || p.launchedWhileStatic,
              attackType: p.type,
            });

            if (hurtResult.wasDeflected) {
              SoundManager.getInstance().playShieldBlock();
              this.triggerScreenShake(0.18, 7);
              this.particles.spawnDamageText(this.monster.x + 25, this.monster.y - 20, hurtResult.feedbackText, false, hurtResult.feedbackColor);
              this.particles.spawnSparks(p.x, p.y, '#f59e0b', 24);
            } else {
              if (hurtResult.wasGuarded) {
                SoundManager.getInstance().playSwordClash();
              } else {
                SoundManager.getInstance().playHitImpact();
              }
              this.triggerScreenShake(hurtResult.isCritical ? 0.35 : 0.25, hurtResult.isCritical ? 14 : 9);
              this.particles.spawnSparks(p.x, p.y, hurtResult.isCritical ? '#fbbf24' : p.color, 28);
              this.particles.spawnDamageText(this.monster.x + 25, this.monster.y - 18, hurtResult.feedbackText, hurtResult.isCritical, hurtResult.feedbackColor);

              this.combatStats.radoxomsHit++;
              this.combatStats.damageDealt += hurtResult.actualDamage;
              this.updateCombatAccuracy();
              this.hero.addUltimateCharge(18);
              this.notifyUltimateState();
              this.onMonsterHealthChanged?.(this.monster.currentHp, this.monster.maxHp);

              if (this.monster.currentHp <= 0) {
                this.handleCombatVictory();
              }
            }

            this.radoxomProjectiles.splice(i, 1);
            continue;
          }
        }
      }

      // 4. Update Monster Projectiles & Collision with Hero (Anti-loophole single-hit resolution)
      for (let i = this.monsterProjectiles.length - 1; i >= 0; i--) {
        const mp = this.monsterProjectiles[i];
        mp.update(dt, this.worldWidth, this.groundY);

        if (mp.isDead) {
          this.monsterProjectiles.splice(i, 1);
          continue;
        }

        if (mp.checkHeroCollision(this.hero)) {
          if (mp.alreadyResolved) continue;
          mp.consume();
          this.dealDamageToHero(mp.damage);
          this.monsterProjectiles.splice(i, 1);
          continue;
        }
      }

      // 5. Check Ammo Exhaustion Defeat Condition
      if (
        this.radoxomsAvailable === 0 &&
        this.radoxomProjectiles.length === 0 &&
        this.monster &&
        !this.monster.isDefeated &&
        this.monster.currentHp > 0
      ) {
        if (this.ammoExhaustionTimer <= 0) {
          this.ammoExhaustionTimer = 1.6;
        } else {
          this.ammoExhaustionTimer -= dt;
          if (this.ammoExhaustionTimer <= 0) {
            this.handleCombatDefeat('ammo_exhausted');
          }
        }
      } else {
        this.ammoExhaustionTimer = 0;
      }

      // Dynamic Responsive Camera: automatically calculates combat zoom & framing to keep both combatants visible
      if (this.monster) {
        const isPortrait = this.viewportHeight > this.viewportWidth;
        const dist = Math.abs(this.hero.x - this.monster.x);
        
        // Dynamically compute zoom via centralized ViewportManager (anti-cramp, expansive arena)
        this.targetCameraZoom = ViewportManager.getInstance().getCameraZoom('combat', dist);
        this.cameraZoom += (this.targetCameraZoom - this.cameraZoom) * 0.08;

        const midX = (this.hero.x + this.monster.x) / 2;
        const halfVisibleW = (this.viewportWidth / 2) / this.cameraZoom;
        const targetCameraX = Math.max(0, Math.min(midX - halfVisibleW, this.worldWidth - halfVisibleW * 2));
        const targetCameraY = this.groundY - (this.viewportHeight * (isPortrait ? 0.48 : 0.58)) / this.cameraZoom;

        this.cameraX += (targetCameraX - this.cameraX) * 0.12;
        this.cameraY += (targetCameraY - this.cameraY) * 0.12;
      }
    } else {
      // Safe boundary clamp during exploration
      this.hero.x = Math.max(30, Math.min(this.worldWidth - 50, this.hero.x));

      if (this.monster) {
        this.monster.update(dt);
      }
      for (const minion of this.minions) {
        minion.update(dt);
      }
    }

    this.particles.update(dt);

    // Check Runic Dimensional Puzzle Gate barrier collision
    if (this.levelConfig.puzzleGate) {
      const gate = this.levelConfig.puzzleGate;
      this.nearPuzzleGate = Math.abs(this.hero.x - gate.x) < 70;
      if (!gate.activated && this.hero.x > gate.x - 20) {
        this.hero.x = gate.x - 20;
        this.hero.vx = 0;
      }
    } else {
      this.nearPuzzleGate = false;
    }

    // Update Floating Mana Crystals and collision check
    for (const crystal of this.crystals) {
      if (!crystal.collected) {
        crystal.angle += dt * 3;
        // Check collision with Hero
        if (Math.abs(this.hero.x + this.hero.width / 2 - crystal.x) < 36) {
          crystal.collected = true;
          this.hero.speedBoostTimer = 6.0; // 6 seconds speed boost!
          SoundManager.getInstance().playCrystalChime();
          this.particles.spawnSparks(crystal.x, crystal.y, '#38bdf8', 22);
          this.particles.spawnDamageText(crystal.x, crystal.y, '+SPEED BOOST!', true);
        }
      }
    }

    // Check shrine proximity
    this.nearShrine = Math.abs(this.hero.x - this.shrineX) < 60;

    // Update ambient particles
    for (const p of this.ambientParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.phase += dt * 3;

      if (p.type === 'sakura') {
        p.x += Math.sin(p.phase) * 18 * dt;
      }
      if (p.type === 'ember') {
        if (p.y < 50) p.y = this.groundY - 10;
      } else {
        if (p.y > this.groundY) p.y = 50;
      }
      if (p.x < 0) p.x = this.worldWidth;
      if (p.x > this.worldWidth) p.x = 0;
    }

    if (!this.isRealTimeCombat) {
      // Proximity check for monster encounter
      if (
        !this.encounterTriggered &&
        this.monster &&
        !this.monster.isDefeated &&
        Math.abs(this.hero.x - this.monster.x) < 240
      ) {
        this.encounterTriggered = true;
        this.inEncounter = true;
        this.isCinematicIntro = true;
        this.triggerScreenShake(0.5, 14);
        SoundManager.getInstance().playCinematicBoom();
        SoundManager.getInstance().playMonsterRoar();

        if (this.onEncounter) {
          this.onEncounter();
        }
      }

      // Exploration camera follow & expansive world zoom
      const isPortrait = this.viewportHeight > this.viewportWidth;
      this.targetCameraZoom = ViewportManager.getInstance().getCameraZoom('exploration');
      this.cameraZoom += (this.targetCameraZoom - this.cameraZoom) * 0.08;

      const halfVisibleW = (this.viewportWidth / 2) / this.cameraZoom;
      let targetCameraX = Math.max(
        0,
        Math.min(this.hero.x - halfVisibleW * 0.5, this.worldWidth - halfVisibleW * 2)
      );
      let targetCameraY = this.groundY - (this.viewportHeight * (isPortrait ? 0.50 : 0.58)) / this.cameraZoom;

      if (this.isCinematicIntro && this.monster) {
        targetCameraX = Math.max(0, this.monster.x - halfVisibleW);
      }

      this.cameraX += (targetCameraX - this.cameraX) * 0.12;
      this.cameraY += (targetCameraY - this.cameraY) * 0.12;
    }

    // Clear single-frame triggers on InputManager
    this.input.endFrame();
  }

  /* ------------------- HEAVENLY ETHEREAL GRAPHICS PIPELINE ------------------- */

  private render() {
    const width = this.viewportWidth;
    const height = this.viewportHeight;
    const ctx = this.ctx;

    ctx.save();
    // High-DPI physical backing scaling
    ctx.scale(this.dpr, this.dpr);

    if (this.shakeTimer > 0) {
      const sx = (Math.random() - 0.5) * this.shakeIntensity;
      const sy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(sx, sy);
    }

    const envType = this.levelConfig.environment.type;

    // Layer 1-6: Parallax Sky & Scenery (Screen-space framing)
    this.renderHeavenlySky(ctx, width, height, envType);
    this.renderVolumetricGodRays(ctx, width, height);
    this.renderFloatingSkyIslands(ctx, width, height, this.cameraX * 0.12);
    this.renderDistantHorizons(ctx, width, height, this.cameraX * 0.25, envType);
    this.renderMidgroundScenery(ctx, width, height, this.cameraX * 0.45, envType);
    this.renderNearFeatures(ctx, width, height, this.cameraX * 0.7, envType);

    // World Space Translation with Adaptive Camera Zoom
    ctx.save();
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-Math.round(this.cameraX), -Math.round(this.cameraY));

    // Layer 7: Textured Ground & Runic Pathways
    this.renderGround(ctx, envType);

    // Layer 8: Ancient Obelisk Shrine
    this.renderShrine(ctx);

    // Layer 9: Floating Mana Crystals
    this.renderCrystals(ctx);

    // Layer 9.5: Runic Dimensional Puzzle Gate
    if (this.levelConfig.puzzleGate) {
      this.renderPuzzleGate(ctx);
    }

    // Layer 9.8: Arena Forcefield Barriers & Dynamic Hazard Zones
    if (this.isRealTimeCombat) {
      this.renderArenaBarriers(ctx);
      this.renderHazardZones(ctx);
    }

    // Layer 10: Entities (Hero, Minions, and Monster)
    this.hero.render(ctx);
    for (const minion of this.minions) {
      minion.render(ctx);
    }
    if (this.monster) {
      this.monster.render(ctx);
      if (this.isCombatEntrySequence && this.combatEntryPhase === 'ROAR_TALK') {
        this.renderMonsterDialogueBubble(ctx);
      }
    }

    // Layer 10.5: Projectiles (Radoxom energy & Monster attacks)
    for (const proj of this.radoxomProjectiles) {
      proj.render(ctx);
    }
    for (const mProj of this.monsterProjectiles) {
      mProj.render(ctx);
    }

    // Layer 11: Ambient Golden Stardust & Particle Trails
    this.renderAmbientParticles(ctx);

    // Layer 12: Dynamic Combat Slashes & Sparks
    this.particles.render(ctx);

    // World-space Aim Reticle with fair direction preview
    if (this.isRealTimeCombat) {
      this.renderAimReticleWorld(ctx);
    }

    ctx.restore(); // Restore world transformation

    // Layer 13: Cinematic Letterbox Bars
    if (this.isCinematicIntro) {
      this.renderCinematicBars(ctx, width, height);
    }

    ctx.restore(); // Restore High-DPI scale & screen shake
  }

  /* --- REAL-TIME COMBAT GRAPHICS: RETICLE & ARENA BARRIERS --- */
  /* --- REAL-TIME COMBAT GRAPHICS: CLEAN ACTION-GAME AIM INDICATOR --- */
  private renderAimReticleWorld(ctx: CanvasRenderingContext2D) {
    if (this.aimIndicatorAlpha <= 0.01) return;

    const heroCenterX = this.hero.x + this.hero.width / 2;
    const heroCenterY = this.hero.y + this.hero.height / 2;
    const angle = this.hero.aimAngle;
    const alpha = this.aimIndicatorAlpha;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Clean action-game aim trajectory line (40px to 140px ahead of hero)
    const lineStart = 38;
    const lineEnd = 135;
    const sx = heroCenterX + Math.cos(angle) * lineStart;
    const sy = heroCenterY + Math.sin(angle) * lineStart;
    const ex = heroCenterX + Math.cos(angle) * lineEnd;
    const ey = heroCenterY + Math.sin(angle) * lineEnd;

    // Glowing energy gradient line
    const grad = ctx.createLinearGradient(sx, sy, ex, ey);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    grad.addColorStop(0.65, 'rgba(56, 189, 248, 0.75)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0.95)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Directional energy chevron indicator at tip
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(angle);

    ctx.fillStyle = '#facc15';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(7, 0);
    ctx.lineTo(-5, -4.5);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-5, 4.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  private renderMonsterDialogueBubble(ctx: CanvasRenderingContext2D) {
    if (!this.monster) return;

    const headX = this.monster.x + this.monster.width / 2;
    const headY = this.monster.y - 12;

    const bubbleW = 340;
    const bubbleH = 92;
    const bubbleX = headX - bubbleW / 2;
    const bubbleY = headY - bubbleH - 18;

    ctx.save();

    // 1. Bubble Shadow & Glow
    ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    ctx.shadowBlur = 18;

    // 2. Bubble Body Background (Dark Obsidian)
    ctx.fillStyle = 'rgba(11, 15, 25, 0.96)';
    ctx.beginPath();
    ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 14);
    ctx.fill();

    // 3. Glowing Crimson Border
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Pointer Triangle pointing directly to Monster's Head
    ctx.beginPath();
    ctx.moveTo(headX - 12, bubbleY + bubbleH);
    ctx.lineTo(headX + 12, bubbleY + bubbleH);
    ctx.lineTo(headX, headY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(11, 15, 25, 0.96)';
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0; // reset shadow

    // 5. Header: Monster Name + Roaring Status
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`👹 ${this.monster.config.name.toUpperCase()} (ROARING)`, bubbleX + 14, bubbleY + 20);

    // 6. Dialogue Text (Wrapped into 2-3 lines)
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 12px "Segoe UI", sans-serif';

    const words = this.monsterDialogueText.split(' ');
    let line = '';
    let lineY = bubbleY + 40;
    const maxLineW = bubbleW - 28;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        ctx.fillText(line, bubbleX + 14, lineY);
        line = words[n] + ' ';
        lineY += 17;
        if (lineY > bubbleY + 70) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, bubbleX + 14, lineY);

    // 7. Footer Hint: Click / Tap / Space to Fight
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 9.5px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('⚔ TAP SCREEN OR PRESS [SPACE] TO FIGHT ❯', bubbleX + bubbleW - 14, bubbleY + bubbleH - 10);

    ctx.restore();
  }

  private renderArenaBarriers(ctx: CanvasRenderingContext2D) {
    if (!this.isRealTimeCombat) return;

    ctx.save();
    const pulse = (Math.sin(performance.now() * 0.006) + 1) * 0.5;

    [this.arenaMinX, this.arenaMaxX].forEach((bx) => {
      const grad = ctx.createLinearGradient(bx - 18, 0, bx + 18, 0);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      grad.addColorStop(0.5, `rgba(239, 68, 68, ${0.35 + pulse * 0.3})`);
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(bx - 18, this.groundY - 260, 36, 260);

      // Energy laser boundary line
      ctx.strokeStyle = `rgba(254, 202, 202, ${0.7 + pulse * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, this.groundY - 260);
      ctx.lineTo(bx, this.groundY);
      ctx.stroke();

      // Top glyph
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ BARRIER ⚡', bx, this.groundY - 270);
    });

    ctx.restore();
  }

  private renderHazardZones(ctx: CanvasRenderingContext2D) {
    if (!this.isRealTimeCombat || this.hazardZones.length === 0) return;

    ctx.save();
    for (const hz of this.hazardZones) {
      if (hz.state === 'warning') {
        const pulse = (Math.sin(hz.pulseTimer) + 1) * 0.5;
        const progress = Math.max(0, Math.min(1, 1 - (hz.warningTimer / hz.totalWarningTime)));

        // Warning circle on ground with perspective ellipse
        ctx.save();
        ctx.translate(hz.x, hz.y);
        ctx.scale(1, 0.35);

        // Translucent warning fill
        ctx.fillStyle = `rgba(239, 68, 68, ${0.18 + pulse * 0.22})`;
        ctx.beginPath();
        ctx.arc(0, 0, hz.radius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing outer warning ring
        ctx.strokeStyle = `rgba(249, 115, 22, ${0.7 + pulse * 0.3})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, hz.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Progress ring showing detonation timing
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, hz.radius * progress, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // Warning banner above zone
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ ZONE DETONATION ⚠', hz.x, hz.y - 35 + pulse * 4);
      } else if (hz.state === 'active') {
        const pulse = (Math.sin(hz.pulseTimer * 2) + 1) * 0.5;

        // Ground plasma eruption
        ctx.save();
        ctx.translate(hz.x, hz.y);
        ctx.scale(1, 0.35);

        const radGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, hz.radius);
        radGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        radGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.75)');
        radGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.45)');
        radGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, hz.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Vertical fiery eruption columns
        const colWidth = hz.radius * 0.7;
        const columnGrad = ctx.createLinearGradient(hz.x - colWidth, hz.y - 120, hz.x + colWidth, hz.y);
        columnGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
        columnGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.45 + pulse * 0.3})`);
        columnGrad.addColorStop(1, 'rgba(254, 240, 138, 0.65)');

        ctx.fillStyle = columnGrad;
        ctx.beginPath();
        ctx.moveTo(hz.x - colWidth, hz.y);
        ctx.quadraticCurveTo(hz.x, hz.y - 120, hz.x + colWidth, hz.y);
        ctx.closePath();
        ctx.fill();

        // Warning text
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ LETHAL AREA ⚡', hz.x, hz.y - 50);
      }
    }
    ctx.restore();
  }

  /* --- HEAVENLY SKY & AURORA / JAPANESE DAWN --- */
  /* --- HEAVENLY SKY & AURORA / JAPANESE DAWN --- */
  private renderHeavenlySky(ctx: CanvasRenderingContext2D, width: number, height: number, type: string) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    const isVillage = type === 'village' || this.levelConfig.id === 1;

    if (isVillage) {
      // Atmospheric Anime Japanese Dawn over Mount Fuji (Rose gold / indigo / celestial twilight)
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(0.35, '#3b0764');
      skyGrad.addColorStop(0.65, '#be185d');
      skyGrad.addColorStop(0.85, '#f472b6');
      skyGrad.addColorStop(1, '#fed7aa');
    } else if (type === 'valley') {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.4, '#38bdf8');
      skyGrad.addColorStop(0.75, '#bae6fd');
      skyGrad.addColorStop(1, '#ecfdf5');
    } else if (type === 'fortress') {
      skyGrad.addColorStop(0, '#09090b');
      skyGrad.addColorStop(0.45, '#450a0a');
      skyGrad.addColorStop(0.85, '#7f1d1d');
      skyGrad.addColorStop(1, '#18181b');
    } else if (type === 'caves') {
      skyGrad.addColorStop(0, '#050505');
      skyGrad.addColorStop(0.4, '#0f172a');
      skyGrad.addColorStop(0.8, '#1e1b4b');
      skyGrad.addColorStop(1, '#020617');
    } else if (type === 'mountains') {
      skyGrad.addColorStop(0, '#0c4a6e');
      skyGrad.addColorStop(0.4, '#0284c7');
      skyGrad.addColorStop(0.75, '#7dd3fc');
      skyGrad.addColorStop(1, '#e0f2fe');
    } else if (type === 'celestial') {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.35, '#1e1b4b');
      skyGrad.addColorStop(0.7, '#312e81');
      skyGrad.addColorStop(1, '#0c4a6e');
    } else {
      // Ruins / Twilight Cosmos
      skyGrad.addColorStop(0, '#1c1917');
      skyGrad.addColorStop(0.4, '#292524');
      skyGrad.addColorStop(0.75, '#44403c');
      skyGrad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Radiant Celestial Sun / Moon
    const sunX = width - 200;
    const sunY = 120;
    const auraGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 160);
    if (isVillage) {
      auraGrad.addColorStop(0, 'rgba(254, 215, 170, 0.6)');
      auraGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.25)');
      auraGrad.addColorStop(1, 'transparent');
    } else if (type === 'fortress') {
      auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
      auraGrad.addColorStop(0.5, 'rgba(185, 28, 28, 0.2)');
      auraGrad.addColorStop(1, 'transparent');
    } else if (type === 'celestial') {
      auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
      auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
      auraGrad.addColorStop(1, 'transparent');
    } else {
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      auraGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.12)');
      auraGrad.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 160, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isVillage ? '#fff7ed' : type === 'fortress' ? '#fca5a5' : type === 'celestial' ? '#f0f9ff' : '#fef08a';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 44, 0, Math.PI * 2);
    ctx.fill();
  }

  /* --- VOLUMETRIC GOD RAYS --- */
  private renderVolumetricGodRays(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const isVillage = this.levelConfig.environment.type === 'village' || this.levelConfig.id === 1;
    ctx.save();
    ctx.globalAlpha = isVillage ? 0.15 : 0.10;
    ctx.fillStyle = isVillage ? '#fde047' : this.levelConfig.environment.type === 'fortress' ? '#ef4444' : '#fef08a';

    for (let i = 0; i < 5; i++) {
      const startX = width * 0.15 + i * 190;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX + 45, 0);
      ctx.lineTo(startX - 180, height);
      ctx.lineTo(startX - 260, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /* --- FLOATING CELESTIAL SKY ISLANDS / MOUNT FUJI SILHOUETTE --- */
  private renderFloatingSkyIslands(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number
  ) {
    const type = this.levelConfig.environment.type;
    const isVillage = type === 'village' || this.levelConfig.id === 1;
    ctx.save();

    if (isVillage) {
      // Majestic Mount Fuji Silhouette in far background
      const fujiX = width * 0.48 - (offset % width);
      const fujiBaseY = height * 0.72;

      // Fuji Mountain slope
      ctx.fillStyle = '#4c1d95';
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(fujiX - 320, fujiBaseY);
      ctx.lineTo(fujiX, fujiBaseY - 210);
      ctx.lineTo(fujiX + 320, fujiBaseY);
      ctx.closePath();
      ctx.fill();

      // Fuji Snowcap Peak
      ctx.fillStyle = '#fdf4ff';
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(fujiX - 70, fujiBaseY - 165);
      ctx.lineTo(fujiX, fujiBaseY - 210);
      ctx.lineTo(fujiX + 70, fujiBaseY - 165);
      ctx.lineTo(fujiX + 30, fujiBaseY - 150);
      ctx.lineTo(fujiX - 30, fujiBaseY - 150);
      ctx.closePath();
      ctx.fill();
    } else if (type === 'celestial') {
      // Floating celestial sanctuaries & cosmic rings
      ctx.fillStyle = '#312e81';
      ctx.globalAlpha = 0.6;
      for (let x = -80; x <= width + 280; x += 320) {
        const ix = x - (offset % 320);
        const iy = 90 + Math.sin(x * 0.02) * 20;
        // Floating platform
        ctx.beginPath();
        ctx.moveTo(ix - 50, iy);
        ctx.lineTo(ix + 50, iy);
        ctx.lineTo(ix + 20, iy + 30);
        ctx.lineTo(ix - 20, iy + 30);
        ctx.closePath();
        ctx.fill();

        // Astral crystal spire
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(ix - 4, iy - 24, 8, 24);
        ctx.fillStyle = '#312e81';
      }
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.globalAlpha = 0.7;

      for (let x = -100; x <= width + 300; x += 360) {
        const ix = x - (offset % 360);
        const iy = 110 + (Math.sin(x * 0.01) * 25);

        // Island Landmass
        ctx.beginPath();
        ctx.moveTo(ix - 55, iy);
        ctx.lineTo(ix + 55, iy);
        ctx.lineTo(ix + 20, iy + 35);
        ctx.lineTo(ix - 20, iy + 38);
        ctx.closePath();
        ctx.fill();

        // Ancient temple pillar on island
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(ix - 6, iy - 22, 12, 22);

        // Celestial Waterfall pouring into mist
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(ix + 12, iy, 4, 60);
      }
    }
    ctx.restore();
  }

  private renderDistantHorizons(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number,
    type: string
  ) {
    const isVillage = type === 'village' || this.levelConfig.id === 1;
    ctx.save();
    ctx.fillStyle = isVillage ? '#581c87' : type === 'valley' ? '#38bdf8' : type === 'fortress' ? '#450a0a' : type === 'caves' ? '#0f172a' : '#1e1b4b';
    ctx.globalAlpha = 0.45;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = -100; x <= width + 100; x += 80) {
      const peak = Math.sin((x + offset) * 0.004) * 120 + Math.cos((x + offset) * 0.008) * 60 + 190;
      ctx.lineTo(x, height - peak);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private renderMidgroundScenery(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number,
    type: string
  ) {
    const isVillage = type === 'village' || this.levelConfig.id === 1;
    ctx.save();
    ctx.fillStyle = isVillage ? '#701a75' : type === 'valley' ? '#166534' : type === 'fortress' ? '#292524' : type === 'caves' ? '#1e1b4b' : '#0f172a';
    ctx.globalAlpha = 0.65;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = -100; x <= width + 100; x += 60) {
      const peak = Math.sin((x + offset) * 0.007) * 80 + Math.sin((x + offset) * 0.014) * 40 + 160;
      ctx.lineTo(x, height - peak);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // In Village, render distant Japanese Pagoda & Shrine silhouettes in midground
    if (isVillage) {
      ctx.fillStyle = '#4a044e';
      ctx.globalAlpha = 0.7;
      for (let x = 120; x <= width + 200; x += 480) {
        const px = x - (offset % 480);
        const py = height - 230;

        // Pagoda multi-tier curved roofs
        for (let tier = 0; tier < 3; tier++) {
          const tw = 40 - tier * 8;
          const ty = py - tier * 18;
          ctx.beginPath();
          ctx.moveTo(px - tw, ty);
          ctx.quadraticCurveTo(px, ty - 6, px + tw, ty);
          ctx.lineTo(px + tw - 6, ty + 10);
          ctx.lineTo(px - tw + 6, ty + 10);
          ctx.closePath();
          ctx.fill();
        }
        // Pagoda spire
        ctx.fillRect(px - 2, py - 60, 4, 18);
      }
    }

    ctx.restore();
  }

  private renderNearFeatures(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number,
    type: string
  ) {
    ctx.save();
    const treeBaseY = this.groundY;
    const isVillage = type === 'village' || this.levelConfig.id === 1;

    if (isVillage) {
      // Japanese Village with Hinoki wooden houses, Kawara tiled roofs, Shoji windows, Chōchin lanterns, and Bamboo
      for (let x = -80; x <= width + 240; x += 320) {
        const hx = x - (offset % 320);
        const houseY = treeBaseY;

        // 1. Traditional Hinoki Wood House Body
        ctx.fillStyle = '#451a03'; // Rich dark Hinoki wood
        ctx.fillRect(hx - 65, houseY - 100, 130, 100);

        // Hinoki timber columns & horizontal beam lintel
        ctx.fillStyle = '#78350f';
        ctx.fillRect(hx - 65, houseY - 100, 8, 100);
        ctx.fillRect(hx + 57, houseY - 100, 8, 100);
        ctx.fillRect(hx - 65, houseY - 96, 130, 8);

        // Raised wooden veranda (Engawa)
        ctx.fillStyle = '#92400e';
        ctx.fillRect(hx - 70, houseY - 8, 140, 8);

        // Warm Glowing Translucent Paper Shoji Window
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(hx - 42, houseY - 74, 36, 42);

        // Shoji Window Wooden Kumiko Lattice Grids
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(hx - 42, houseY - 74, 36, 42);
        ctx.beginPath();
        ctx.moveTo(hx - 24, houseY - 74);
        ctx.lineTo(hx - 24, houseY - 32);
        ctx.moveTo(hx - 42, houseY - 53);
        ctx.lineTo(hx - 6, houseY - 53);
        ctx.stroke();

        // Shoji Window warm amber interior glow
        const winGlow = ctx.createRadialGradient(hx - 24, houseY - 53, 6, hx - 24, houseY - 53, 44);
        winGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        winGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = winGlow;
        ctx.beginPath();
        ctx.arc(hx - 24, houseY - 53, 44, 0, Math.PI * 2);
        ctx.fill();

        // Sliding wooden door
        ctx.fillStyle = '#78350f';
        ctx.fillRect(hx + 10, houseY - 65, 32, 65);
        ctx.strokeStyle = '#292524';
        ctx.strokeRect(hx + 10, houseY - 65, 32, 65);

        // 2. Traditional Curved Kawara Slate Tiled Roof
        ctx.fillStyle = '#1e293b'; // Slate gray kawara tiles
        ctx.beginPath();
        ctx.moveTo(hx - 85, houseY - 100);
        ctx.quadraticCurveTo(hx, houseY - 134, hx + 85, houseY - 100);
        ctx.lineTo(hx + 75, houseY - 90);
        ctx.quadraticCurveTo(hx, houseY - 122, hx - 75, houseY - 90);
        ctx.closePath();
        ctx.fill();

        // Roof ridge line with Onigawara decorative end caps
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(hx - 18, houseY - 134, 36, 7);
        ctx.fillRect(hx - 85, houseY - 102, 6, 6);
        ctx.fillRect(hx + 79, houseY - 102, 6, 6);

        // 3. Hanging Red Paper Chōchin Lantern with harmonic sway
        const sway = Math.sin(performance.now() * 0.003 + hx) * 3;
        const lx = hx - 72;
        const ly = houseY - 86;
        ctx.strokeStyle = '#18181b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lx, ly - 8);
        ctx.lineTo(lx + sway * 0.5, ly);
        ctx.stroke();

        ctx.fillStyle = '#ef4444'; // Radiant red lantern
        ctx.beginPath();
        ctx.ellipse(lx + sway, ly + 8, 7, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lantern golden warm glow
        const lglow = ctx.createRadialGradient(lx + sway, ly + 8, 2, lx + sway, ly + 8, 24);
        lglow.addColorStop(0, 'rgba(239, 68, 68, 0.65)');
        lglow.addColorStop(1, 'transparent');
        ctx.fillStyle = lglow;
        ctx.beginPath();
        ctx.arc(lx + sway, ly + 8, 24, 0, Math.PI * 2);
        ctx.fill();

        // 4. Sakura Cherry Blossom Tree beside house
        const tx = hx + 112;
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(tx - 6, treeBaseY - 110, 12, 110);

        // Cherry blossom canopy clouds
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(tx, treeBaseY - 125, 38, 0, Math.PI * 2);
        ctx.arc(tx - 24, treeBaseY - 110, 28, 0, Math.PI * 2);
        ctx.arc(tx + 24, treeBaseY - 112, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(tx - 8, treeBaseY - 132, 26, 0, Math.PI * 2);
        ctx.arc(tx + 14, treeBaseY - 128, 22, 0, Math.PI * 2);
        ctx.fill();

        // 5. Swaying Bamboo stalks with articulated nodes
        const bx = hx - 90;
        const bambooSway = Math.sin(performance.now() * 0.003 + hx) * 5;
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 4;
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          ctx.moveTo(bx + b * 7, treeBaseY);
          ctx.quadraticCurveTo(bx + b * 7 + bambooSway * 0.5, treeBaseY - 50, bx + b * 7 + bambooSway, treeBaseY - 95);
          ctx.stroke();

          // Bamboo culm node rings
          ctx.fillStyle = '#166534';
          ctx.fillRect(bx + b * 7 - 2 + bambooSway * 0.3, treeBaseY - 30, 5, 2);
          ctx.fillRect(bx + b * 7 - 2 + bambooSway * 0.6, treeBaseY - 60, 5, 2);
        }
      }

      // Traditional Vermilion Torii Shrine Gate
      const toriiX = 240 - (offset % 1200);
      const toriiY = treeBaseY;
      ctx.fillStyle = '#dc2626'; // Vermilion pillars
      ctx.fillRect(toriiX - 45, toriiY - 130, 10, 130);
      ctx.fillRect(toriiX + 35, toriiY - 130, 10, 130);
      // Black stone pillar bases
      ctx.fillStyle = '#18181b';
      ctx.fillRect(toriiX - 48, toriiY - 14, 16, 14);
      ctx.fillRect(toriiX + 32, toriiY - 14, 16, 14);
      // Curved upper lintel beam (Kasagi)
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(toriiX - 65, toriiY - 130);
      ctx.quadraticCurveTo(toriiX, toriiY - 142, toriiX + 65, toriiY - 130);
      ctx.lineTo(toriiX + 60, toriiY - 120);
      ctx.quadraticCurveTo(toriiX, toriiY - 132, toriiX - 60, toriiY - 120);
      ctx.closePath();
      ctx.fill();
      // Black Kasagi Cap
      ctx.fillStyle = '#09090b';
      ctx.fillRect(toriiX - 60, toriiY - 133, 120, 4);
      // Straight lower tie-beam (Nuki)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(toriiX - 52, toriiY - 110, 104, 7);
      // Sacred Shimenawa Rope with white shide paper zig-zags
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toriiX - 35, toriiY - 106);
      ctx.quadraticCurveTo(toriiX, toriiY - 98, toriiX + 35, toriiY - 106);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(toriiX - 18, toriiY - 100, 5, 8);
      ctx.fillRect(toriiX + 13, toriiY - 100, 5, 8);
    } else if (type === 'caves') {
      // Subterranean crystal geodes & stalagmites
      for (let x = -60; x <= width + 200; x += 160) {
        const cx = x - (offset % 160);
        // Crystal geode
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(cx, treeBaseY);
        ctx.lineTo(cx + 8, treeBaseY - 45);
        ctx.lineTo(cx + 18, treeBaseY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(cx + 12, treeBaseY);
        ctx.lineTo(cx + 20, treeBaseY - 32);
        ctx.lineTo(cx + 28, treeBaseY);
        ctx.closePath();
        ctx.fill();
      }
    } else if (type === 'fortress') {
      // Obsidian fortress battlements & blazing iron braziers
      for (let x = -80; x <= width + 240; x += 260) {
        const fx = x - (offset % 260);
        // Stone battlement pillar
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(fx - 20, treeBaseY - 90, 40, 90);
        ctx.fillStyle = '#292524';
        ctx.fillRect(fx - 24, treeBaseY - 96, 48, 8);

        // Blazing brazier on top
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(fx, treeBaseY - 102, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(fx, treeBaseY - 104, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'celestial') {
      // Floating celestial crystal spires
      for (let x = -80; x <= width + 240; x += 220) {
        const sx = x - (offset % 220);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(sx - 10, treeBaseY);
        ctx.lineTo(sx, treeBaseY - 120);
        ctx.lineTo(sx + 10, treeBaseY);
        ctx.closePath();
        ctx.fill();

        // Astral ring around spire
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(sx, treeBaseY - 60, 22, 7, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      // Valley / Forest Trees
      for (let x = -100; x <= width + 200; x += 190) {
        const rx = x - (offset % 190);
        ctx.fillStyle = '#292524';
        ctx.fillRect(rx + 18, treeBaseY - 120, 16, 120);

        ctx.fillStyle = type === 'valley' ? '#f472b6' : '#14532d';
        ctx.beginPath();
        ctx.arc(rx + 26, treeBaseY - 130, 46, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = type === 'valley' ? '#fbcfe8' : '#22c55e';
        ctx.beginPath();
        ctx.arc(rx + 12, treeBaseY - 142, 32, 0, Math.PI * 2);
        ctx.arc(rx + 42, treeBaseY - 138, 32, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private renderGround(ctx: CanvasRenderingContext2D, type: string) {
    const env = this.levelConfig.environment;
    const isVillage = type === 'village' || this.levelConfig.id === 1;

    if (isVillage) {
      // Traditional Japanese Cobblestone, Earth Pathway & Flowing Stream
      const groundGrad = ctx.createLinearGradient(0, this.groundY, 0, this.groundY + 300);
      groundGrad.addColorStop(0, '#292524'); // Dark slate earth
      groundGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, this.groundY, this.worldWidth, 400);

      // Cobblestone Paving Stones
      ctx.fillStyle = '#44403c';
      for (let x = 0; x < this.worldWidth; x += 44) {
        ctx.fillRect(x + 2, this.groundY + 2, 40, 12);
        ctx.fillStyle = '#57534e';
        ctx.fillRect(x + 6, this.groundY + 4, 32, 8);
        ctx.fillStyle = '#44403c';
      }

      // Wooden border beam
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, this.groundY, this.worldWidth, 3);

      // Flowing Village Stream with Water Reflections and Stepping Stones (x: 560 to 760)
      const streamStartX = 560;
      const streamEndX = 760;
      const streamY = this.groundY + 16;
      const streamHeight = 36;

      // Stream Water Bed
      const waterGrad = ctx.createLinearGradient(0, streamY, 0, streamY + streamHeight);
      waterGrad.addColorStop(0, '#0284c7');
      waterGrad.addColorStop(0.5, '#38bdf8');
      waterGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(streamStartX, streamY, streamEndX - streamStartX, streamHeight);

      // Animated Water Ripple Shimmer Lines
      const waveOffset = performance.now() * 0.003;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      for (let wy = streamY + 6; wy < streamY + streamHeight; wy += 8) {
        ctx.beginPath();
        for (let wx = streamStartX; wx <= streamEndX; wx += 20) {
          const wave = Math.sin(waveOffset + wx * 0.05 + wy) * 3;
          if (wx === streamStartX) ctx.moveTo(wx, wy + wave);
          else ctx.lineTo(wx, wy + wave);
        }
        ctx.stroke();
      }

      // Riverbed Mossy Stepping Stones
      const steppingStoneXs = [600, 640, 680, 720];
      steppingStoneXs.forEach((sx, idx) => {
        ctx.fillStyle = '#57534e';
        ctx.beginPath();
        ctx.ellipse(sx, streamY + 16 + (idx % 2 === 0 ? -4 : 4), 14, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78716c';
        ctx.beginPath();
        ctx.ellipse(sx - 2, streamY + 14 + (idx % 2 === 0 ? -4 : 4), 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // Arched Vermilion Wooden Bridge (Taiko-bashi) above the stream
      ctx.fillStyle = '#dc2626'; // Vermilion bridge arch
      ctx.beginPath();
      ctx.moveTo(streamStartX - 8, this.groundY);
      ctx.quadraticCurveTo((streamStartX + streamEndX) / 2, this.groundY - 14, streamEndX + 8, this.groundY);
      ctx.lineTo(streamEndX + 8, this.groundY + 4);
      ctx.quadraticCurveTo((streamStartX + streamEndX) / 2, this.groundY - 10, streamStartX - 8, this.groundY + 4);
      ctx.closePath();
      ctx.fill();

      // Bridge Red Railing Posts
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(streamStartX - 4, this.groundY - 8);
      ctx.quadraticCurveTo((streamStartX + streamEndX) / 2, this.groundY - 22, streamEndX + 4, this.groundY - 8);
      ctx.stroke();

      // Stone Lanterns (Ishidōrō) along path
      for (let lx = 140; lx < this.worldWidth; lx += 380) {
        ctx.fillStyle = '#57534e';
        // Base
        ctx.fillRect(lx - 12, this.groundY - 10, 24, 10);
        // Column
        ctx.fillRect(lx - 5, this.groundY - 32, 10, 22);
        // Light chamber with golden glow
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lx - 7, this.groundY - 44, 14, 12);
        // Roof of lantern
        ctx.fillStyle = '#292524';
        ctx.beginPath();
        ctx.moveTo(lx - 14, this.groundY - 44);
        ctx.lineTo(lx, this.groundY - 52);
        ctx.lineTo(lx + 14, this.groundY - 44);
        ctx.closePath();
        ctx.fill();

        // Lantern soft aura
        const laura = ctx.createRadialGradient(lx, this.groundY - 38, 2, lx, this.groundY - 38, 26);
        laura.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        laura.addColorStop(1, 'transparent');
        ctx.fillStyle = laura;
        ctx.beginPath();
        ctx.arc(lx, this.groundY - 38, 26, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = env.groundColor;
      ctx.fillRect(0, this.groundY, this.worldWidth, 400);

      ctx.fillStyle = '#0f172a';
      for (let x = 0; x < this.worldWidth; x += 60) {
        ctx.fillRect(x, this.groundY, 56, 16);
      }

      ctx.fillStyle = env.accentColor;
      ctx.fillRect(0, this.groundY, this.worldWidth, 6);

      for (let x = 15; x < this.worldWidth; x += 40) {
        ctx.fillStyle = env.accentColor;
        ctx.beginPath();
        ctx.moveTo(x, this.groundY);
        ctx.lineTo(x + 4, this.groundY - 10);
        ctx.lineTo(x + 8, this.groundY);
        ctx.fill();
      }
    }
  }

  /* --- ANCIENT OBELISK / TORII GATE SHRINE --- */
  private renderShrine(ctx: CanvasRenderingContext2D) {
    const sx = this.shrineX;
    const sy = this.groundY;
    const isVillage = this.levelConfig.environment.type === 'village' || this.levelConfig.id === 1;

    ctx.save();
    if (isVillage) {
      // Traditional Vermilion Torii Gate Shrine for Village!
      ctx.fillStyle = this.shrineActivated ? '#f97316' : '#dc2626'; // Vermilion red

      // Two Torii Pillars (Hashira)
      ctx.fillRect(sx - 30, sy - 110, 12, 110);
      ctx.fillRect(sx + 18, sy - 110, 12, 110);

      // Black bases (Kamebara)
      ctx.fillStyle = '#18181b';
      ctx.fillRect(sx - 33, sy - 14, 18, 14);
      ctx.fillRect(sx + 15, sy - 14, 18, 14);

      // Top lintel (Kasagi & Shimaki) with elegant upward curve
      ctx.fillStyle = this.shrineActivated ? '#f97316' : '#dc2626';
      ctx.beginPath();
      ctx.moveTo(sx - 48, sy - 112);
      ctx.quadraticCurveTo(sx, sy - 124, sx + 48, sy - 112);
      ctx.lineTo(sx + 45, sy - 100);
      ctx.quadraticCurveTo(sx, sy - 112, sx - 45, sy - 100);
      ctx.closePath();
      ctx.fill();

      // Secondary horizontal tie-beam (Nuki)
      ctx.fillRect(sx - 38, sy - 90, 76, 8);

      // Sacred Shimenawa rope with Shide paper streamers
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx - 24, sy - 84);
      ctx.quadraticCurveTo(sx, sy - 78, sx + 24, sy - 84);
      ctx.stroke();

      // Shide paper zig-zags
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(sx - 12, sy - 80, 5, 12);
      ctx.fillRect(sx + 7, sy - 80, 5, 12);

      // Center Runic Plaque (Gakuzuka)
      ctx.fillStyle = '#18181b';
      ctx.fillRect(sx - 8, sy - 105, 16, 20);
      ctx.fillStyle = this.shrineActivated ? '#22c55e' : '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('np', sx, sy - 91);

      // Holy light beam if activated
      if (this.shrineActivated) {
        const pillarGrad = ctx.createLinearGradient(sx - 25, 0, sx + 25, 0);
        pillarGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
        pillarGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.35)');
        pillarGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(sx - 25, 0, 50, sy);
      }

      // Proximity Prompt
      if (this.nearShrine && !this.shrineActivated) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px "Cinzel", serif';
        ctx.fillText('[E] Pray at Aria Torii Shrine', sx, sy - 130);
      }
    } else {
      // Shrine Base Pedestal
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx - 28, sy - 18, 56, 18);

      // Glowing Stone Monolith Pillar
      ctx.fillStyle = this.shrineActivated ? '#334155' : '#1e293b';
      ctx.fillRect(sx - 16, sy - 90, 32, 74);

      // Runic Glyphs
      ctx.fillStyle = this.shrineActivated ? '#22c55e' : '#facc15';
      ctx.font = 'bold 12px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Ω', sx, sy - 65);
      ctx.fillText('λ', sx, sy - 45);
      ctx.fillText('nd', sx, sy - 28);

      // Light Pillar if Activated
      if (this.shrineActivated) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
        ctx.fillRect(sx - 20, 0, 40, sy);
      }

      // Proximity Prompt
      if (this.nearShrine && !this.shrineActivated) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px "Cinzel", serif';
        ctx.fillText('[E] Pray at Aria Shrine', sx, sy - 105);
      }
    }
    ctx.restore();
  }

  /* --- FLOATING MANA CRYSTALS --- */
  private renderCrystals(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const c of this.crystals) {
      if (c.collected) continue;

      const floatY = c.y + Math.sin(c.angle) * 8;
      ctx.save();
      ctx.translate(c.x, floatY);
      ctx.rotate(c.angle * 0.5);

      // Glowing Aura
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Crystal Rhombus
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 14);
      ctx.lineTo(-10, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f0f9ff';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(5, 0);
      ctx.lineTo(0, 9);
      ctx.lineTo(-5, 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  /* --- RUNIC DIMENSIONAL PUZZLE GATE & BRIDGE --- */
  private renderPuzzleGate(ctx: CanvasRenderingContext2D) {
    const gate = this.levelConfig.puzzleGate;
    if (!gate) return;

    ctx.save();
    const gx = gate.x;
    const gy = this.groundY;

    if (!gate.activated) {
      // Ethereal Runic Barrier
      const pulse = (Math.sin(performance.now() * 0.006) + 1) * 0.5;

      // Two crystalline gate pillars
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(gx - 24, gy - 140, 16, 140);
      ctx.fillRect(gx + 12, gy - 140, 16, 140);

      // Pillar glowing runes
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(gx - 20, gy - 110, 8, 80);
      ctx.fillRect(gx + 16, gy - 110, 8, 80);

      // Energy Field between pillars
      const barrierGrad = ctx.createLinearGradient(gx - 10, gy - 130, gx + 10, gy);
      barrierGrad.addColorStop(0, `rgba(56, 189, 248, ${0.35 + pulse * 0.3})`);
      barrierGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.45 + pulse * 0.3})`);
      barrierGrad.addColorStop(1, `rgba(56, 189, 248, ${0.2 + pulse * 0.2})`);
      ctx.fillStyle = barrierGrad;
      ctx.fillRect(gx - 8, gy - 130, 20, 130);

      // Floating Rune Glyphs
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ DIMENSION GATE ]', gx + 2, gy - 148 + pulse * 4);

      if (this.nearPuzzleGate) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('PRESS [E] TO SOLVE RUNIC GATE', gx + 2, gy - 165);
      }
    } else {
      // Activated Light Bridge
      const bridgeGrad = ctx.createLinearGradient(gate.bridgeStartX, gy - 6, gate.bridgeEndX, gy);
      bridgeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
      bridgeGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.9)');
      bridgeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.8)');
      ctx.fillStyle = bridgeGrad;
      ctx.fillRect(gate.bridgeStartX, gy - 6, gate.bridgeEndX - gate.bridgeStartX, 8);

      // Bridge Rune Glyphs
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ DIMENSIONAL BRIDGE ACTIVE ⚡', (gate.bridgeStartX + gate.bridgeEndX) / 2, gy - 12);
    }

    ctx.restore();
  }

  private renderAmbientParticles(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (const p of this.ambientParticles) {
      const alpha = (Math.sin(p.phase) + 1) * 0.45 + 0.15;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'sakura') {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, p.phase, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private renderCinematicBars(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    ctx.fillStyle = '#000000';
    const barHeight = Math.round(height * 0.13);
    ctx.fillRect(0, 0, width, barHeight);
    ctx.fillRect(0, height - barHeight, width, barHeight);
    ctx.restore();
  }
}
