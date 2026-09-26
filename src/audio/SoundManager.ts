/**
 * Procedural Web Audio Sound & Music Synthesizer
 * Provides 100% self-contained, responsive, low-latency audio for NumPy Kingdom
 * Features FM synth, rhythm percussion drums (kick, snare, hat), and cinematic effects.
 */

export type MusicTrack =
  | 'MAIN_MENU'
  | 'EXPLORATION'
  | 'COMBAT'
  | 'BOSS'
  | 'LESSON'
  | 'VILLAIN_INTRO'
  | 'VILLAIN_BOSS_INTRO';

export class SoundManager {
  private static instance: SoundManager;
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private currentTrack: string | null = null;
  private musicInterval: any = null;
  private musicVolume: number = 0.55;
  private sfxVolume: number = 0.75;
  private isMuted: boolean = false;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.isMuted ? 0 : this.musicVolume * 0.3;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isMuted ? 0 : this.sfxVolume * 0.6;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  private ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && !this.isMuted) {
      this.musicGain.gain.setValueAtTime(this.musicVolume * 0.3, this.ctx?.currentTime || 0);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume * 0.6, this.ctx?.currentTime || 0);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx?.currentTime || 0);
    }
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  /* ------------------- PERCUSSION SYNTHESIZERS ------------------- */

  private triggerKick(time: number, isSubHeavy: boolean = false) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const startFreq = isSubHeavy ? 150 : 135;
    const endFreq = isSubHeavy ? 26 : 32;
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + (isSubHeavy ? 0.16 : 0.11));

    gain.gain.setValueAtTime(isSubHeavy ? 0.48 : 0.38, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isSubHeavy ? 0.18 : 0.13));

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + (isSubHeavy ? 0.2 : 0.14));
  }

  private triggerSubStomp(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, time);
    osc.frequency.exponentialRampToValueAtTime(22, time + 0.38);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42);

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.45);
  }

  private triggerSnare(time: number) {
    if (!this.ctx || !this.musicGain) return;
    // Tone snap
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(70, time + 0.1);
    oscGain.gain.setValueAtTime(0.2, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.12);

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noise.start(time);
  }

  private triggerHiHat(time: number, isTense: boolean = false) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * (isTense ? 0.05 : 0.035);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(isTense ? 6200 : 7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isTense ? 0.16 : 0.09, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isTense ? 0.045 : 0.035));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    noise.start(time);
  }

  /* ------------------- CINEMATIC SFX ------------------- */

  public playCinematicBoom() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Sub-bass rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, time);
    osc.frequency.exponentialRampToValueAtTime(24, time + 1.2);

    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 1.5);
  }

  /* ------------------- SPECIALIZED MONSTER ROARS ------------------- */

  /**
   * Savage predator beast growl (demon_beast, wolf, hellhound)
   * Dual detuned FM sawtooth oscillators with resonant low-pass filter
   */
  public playBeastRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(145, time);
    osc1.frequency.linearRampToValueAtTime(58, time + 0.55);
    osc2.frequency.setValueAtTime(152, time);
    osc2.frequency.linearRampToValueAtTime(52, time + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, time);
    filter.frequency.linearRampToValueAtTime(260, time + 0.55);
    filter.Q.setValueAtTime(4.0, time);

    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.62);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.65);
    osc2.stop(time + 0.65);
  }

  /**
   * Volcanic Dragon / Fire Demon Roar (fire_demon, inferno)
   * Seismic sub-bass rumble + crackling flame breath noise sweep
   */
  public playDragonRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // 1. Deep sub-bass earth rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(115, time);
    subOsc.frequency.exponentialRampToValueAtTime(28, time + 0.85);

    subGain.gain.setValueAtTime(0.6, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.88);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(time);
    subOsc.stop(time + 0.9);

    // 2. Crackling volcanic fire breath
    const bufferSize = this.ctx.sampleRate * 0.75;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, time);
    filter.frequency.exponentialRampToValueAtTime(380, time + 0.75);
    filter.Q.setValueAtTime(2.5, time);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.75);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(time);
  }

  /**
   * Supernatural banshee / winged terror screech (flying_demon, winged_beast, shadow_demon)
   * High-pitch flutter oscillator + resonant bandpass filter
   */
  public playPhantomScreech() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(680, time);
    osc.frequency.exponentialRampToValueAtTime(210, time + 0.65);

    // Frequency flutter vibrato (banshee cry)
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(46, time);
    vibratoGain.gain.setValueAtTime(45, time);
    vibrato.connect(osc.frequency);
    vibrato.start(time);
    vibrato.stop(time + 0.7);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, time);
    filter.frequency.exponentialRampToValueAtTime(620, time + 0.65);
    filter.Q.setValueAtTime(4.5, time);

    gain.gain.setValueAtTime(0.48, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.68);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(time);
    osc.stop(time + 0.7);
  }

  /**
   * Crushing metallic stone golem groan (armored_demon, gargoyle, iron golem)
   * Low grinding sawtooth wave + metallic resonant ringing plates
   */
  public playGolemRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // 1. Grinding tectonic rock core
    const rockOsc = this.ctx.createOscillator();
    const rockGain = this.ctx.createGain();
    const rockFilter = this.ctx.createBiquadFilter();

    rockOsc.type = 'sawtooth';
    rockOsc.frequency.setValueAtTime(95, time);
    rockOsc.frequency.linearRampToValueAtTime(36, time + 0.75);

    rockFilter.type = 'lowpass';
    rockFilter.frequency.setValueAtTime(420, time);
    rockFilter.frequency.linearRampToValueAtTime(130, time + 0.75);
    rockFilter.Q.setValueAtTime(3.0, time);

    rockGain.gain.setValueAtTime(0.55, time);
    rockGain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

    rockOsc.connect(rockFilter);
    rockFilter.connect(rockGain);
    rockGain.connect(this.sfxGain);
    rockOsc.start(time);
    rockOsc.stop(time + 0.82);

    // 2. Metallic plate resonant rings
    [680, 1140, 1850].forEach((freq, idx) => {
      const metalOsc = this.ctx!.createOscillator();
      const metalGain = this.ctx!.createGain();
      metalOsc.type = 'triangle';
      metalOsc.frequency.setValueAtTime(freq, time);
      metalGain.gain.setValueAtTime(0.2 / (idx + 1), time);
      metalGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4 + idx * 0.1);

      metalOsc.connect(metalGain);
      metalGain.connect(this.sfxGain!);
      metalOsc.start(time);
      metalOsc.stop(time + 0.45 + idx * 0.1);
    });
  }

  /**
   * Vicious raspy goblin snarl (goblin, imp)
   * Rapid pitch stutter with snappy bite
   */
  public playGoblinRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(310, time);
    osc.frequency.linearRampToValueAtTime(140, time + 0.15);
    osc.frequency.linearRampToValueAtTime(220, time + 0.25);
    osc.frequency.linearRampToValueAtTime(80, time + 0.45);

    gain.gain.setValueAtTime(0.42, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.48);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 0.5);
  }

  /**
   * Earth-shattering apocalyptic titan roar (elite_demon, boss, guardian_malakor)
   * Triple layered oscillators + seismic sub-drop shockwave
   */
  public playTitanRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Layer 1: Subwoofer seismic shaker
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(85, time);
    sub.frequency.exponentialRampToValueAtTime(22, time + 1.1);
    subGain.gain.setValueAtTime(0.65, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 1.15);
    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(time);
    sub.stop(time + 1.2);

    // Layer 2: Apocalyptic mid growl
    const mid = this.ctx.createOscillator();
    const midGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    mid.type = 'sawtooth';
    mid.frequency.setValueAtTime(175, time);
    mid.frequency.exponentialRampToValueAtTime(42, time + 1.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, time);
    filter.frequency.linearRampToValueAtTime(240, time + 1.0);
    filter.Q.setValueAtTime(4.5, time);

    midGain.gain.setValueAtTime(0.55, time);
    midGain.gain.exponentialRampToValueAtTime(0.001, time + 1.05);

    mid.connect(filter);
    filter.connect(midGain);
    midGain.connect(this.sfxGain);
    mid.start(time);
    mid.stop(time + 1.1);

    // Layer 3: Cinematic sub boom
    this.playCinematicBoom();
  }

  /**
   * Main roar dispatcher routing to specific procedural roar by monster archetype
   */
  public playMonsterRoar(spriteType?: string) {
    const type = (spriteType || '').toLowerCase();
    if (type.includes('fire') || type.includes('dragon')) {
      this.playDragonRoar();
    } else if (
      type.includes('wing') ||
      type.includes('fly') ||
      type.includes('shadow') ||
      type.includes('specter')
    ) {
      this.playPhantomScreech();
    } else if (type.includes('armor') || type.includes('golem') || type.includes('stone')) {
      this.playGolemRoar();
    } else if (type.includes('goblin') || type.includes('imp')) {
      this.playGoblinRoar();
    } else if (
      type.includes('boss') ||
      type.includes('elite') ||
      type.includes('guardian') ||
      type.includes('malakor') ||
      type.includes('titan')
    ) {
      this.playTitanRoar();
    } else {
      this.playBeastRoar();
    }
  }

  public playUltimateBurst() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // 1. Rising Energy Charge Oscillator (Sweep 180Hz -> 880Hz)
    const chargeOsc = this.ctx.createOscillator();
    const chargeGain = this.ctx.createGain();
    chargeOsc.type = 'sawtooth';
    chargeOsc.frequency.setValueAtTime(180, time);
    chargeOsc.frequency.exponentialRampToValueAtTime(920, time + 0.35);

    chargeGain.gain.setValueAtTime(0.01, time);
    chargeGain.gain.linearRampToValueAtTime(0.4, time + 0.3);
    chargeGain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

    chargeOsc.connect(chargeGain);
    chargeGain.connect(this.sfxGain);
    chargeOsc.start(time);
    chargeOsc.stop(time + 0.4);

    // 2. Thunderous Sub-Bass Blast (140Hz -> 30Hz)
    const blastOsc = this.ctx.createOscillator();
    const blastGain = this.ctx.createGain();
    blastOsc.type = 'triangle';
    blastOsc.frequency.setValueAtTime(160, time + 0.32);
    blastOsc.frequency.exponentialRampToValueAtTime(28, time + 0.95);

    blastGain.gain.setValueAtTime(0.7, time + 0.32);
    blastGain.gain.exponentialRampToValueAtTime(0.001, time + 1.05);

    blastOsc.connect(blastGain);
    blastGain.connect(this.sfxGain);
    blastOsc.start(time + 0.32);
    blastOsc.stop(time + 1.1);
  }

  public playFinishingExecution() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Resonant slow-mo bell chime
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(1046.5, time); // C6
    bellGain.gain.setValueAtTime(0.5, time);
    bellGain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

    bellOsc.connect(bellGain);
    bellGain.connect(this.sfxGain);
    bellOsc.start(time);
    bellOsc.stop(time + 1.25);
  }

  public playAttackSlash() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // High metallic air swoosh
    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, time);
    filter.frequency.exponentialRampToValueAtTime(4500, time + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(time);
  }

  public playSwordClash() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Metallic ring
    [1200, 2450, 3800].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.3 / (i + 1), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(time);
      osc.stop(time + 0.5);
    });
  }

  public playShieldBlock() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Heavy blunt kinetic deflection clank
    [480, 920, 1850].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + 0.22);
      gain.gain.setValueAtTime(0.35 / (i + 1), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(time);
      osc.stop(time + 0.35);
    });
  }

  public playHitImpact() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    // Low sub thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(170, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.2);

    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 0.22);
  }

  public playCrystalChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;
    [1046.50, 1318.51, 1567.98, 2093.00].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time + idx * 0.05);
      gain.gain.setValueAtTime(0.25, time + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.05 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(time + idx * 0.05);
      osc.stop(time + idx * 0.05 + 0.35);
    });
  }

  public playShrineResonance() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(261.63, time);
    osc.frequency.exponentialRampToValueAtTime(523.25, time + 0.6);
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 1.25);
  }

  public playLaserBlast() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, time);
    osc.frequency.exponentialRampToValueAtTime(120, time + 0.25);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  public playFlameExplosion() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, time);
    filter.frequency.linearRampToValueAtTime(150, time + 0.3);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(time);
  }

  public playUiClick() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1300, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playDialogueChirp() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const pitch = 450 + Math.random() * 140;
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
  }

  public playJump() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  public playDashWhoosh() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.22);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start();
    noise.stop(this.ctx.currentTime + 0.23);
  }

  public playGateUnlock() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [329.63, 440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx!.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.4);
    });
  }

  public playCorrectAnswer() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);
      gain.gain.setValueAtTime(0.35, this.ctx!.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + idx * 0.07 + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(this.ctx!.currentTime + idx * 0.07);
      osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.2);
    });
  }

  public playWrongAnswer() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [311.13, 293.66];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + idx * 0.12 + 0.22);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(this.ctx!.currentTime + idx * 0.12);
      osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.25);
    });
  }

  public playTimerWarning() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  public playVictoryFanfare() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const notes = [
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.35 },
      { f: 587.33, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.5 },
    ];
    let time = this.ctx.currentTime;
    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.d);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(time);
      osc.stop(time + note.d + 0.02);
      time += note.d + 0.03;
    });
  }

  public playPlayerDeath() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.85);
  }

  /* ------------------- THRILLING RHYTHMIC MUSIC GENERATOR ------------------- */

  /* ------------------- THRILLER & VILLAIN RHYTHMIC MUSIC GENERATOR ------------------- */

  public playMusic(track: MusicTrack) {
    if (this.currentTrack === track) return;
    this.stopMusic();
    this.currentTrack = track;
    this.ensureContext();
    if (!this.ctx || !this.musicGain) return;

    let step = 0;
    let bpm = 120;
    let progression: number[][] = [];
    let isVillain = false;

    if (track === 'VILLAIN_INTRO') {
      // 76 BPM: Heavy, sinister, dark villain march with devil's interval (tritone) and Phrygian terror
      bpm = 76;
      isVillain = true;
      progression = [
        [73.42, 103.83, 146.83],       // D2, Ab2 (Devil's Tritone!), D3
        [77.78, 110.00, 155.56],       // Eb2, A2 (Phrygian lift), Eb3
        [73.42, 87.31, 103.83, 146.83], // D2, F2, Ab2 (D Diminished horror), D3
        [69.30, 98.00, 138.59],        // C#2, G2 (Leading-tone tritone tension), C#3
      ];
    } else if (track === 'VILLAIN_BOSS_INTRO') {
      // 70 BPM: Colossal apocalyptic boss doom march (titan entrance)
      bpm = 70;
      isVillain = true;
      progression = [
        [65.41, 92.50, 130.81],        // C2, F#2 (C Tritone Doom), C3
        [61.74, 87.31, 123.47],        // B1, F2 (B Diminished), B2
        [58.27, 82.41, 116.54],        // Bb1, E2 (Bb Diminished), Bb2
        [55.00, 77.78, 110.00],        // A1, Eb2 (A Diminished), A2
      ];
    } else if (track === 'COMBAT') {
      // 144 BPM: Fast driving thriller synthwave combat with syncopated heartbeat kick
      bpm = 144;
      progression = [
        [146.83, 174.61, 220.00, 293.66], // Dm9 (D, F, A, D)
        [155.56, 196.00, 233.08, 311.13], // Eb maj (Phrygian thriller tension shift!)
        [146.83, 174.61, 207.65, 293.66], // D dim (Tritone dread stab)
        [110.00, 138.59, 164.81, 220.00], // A7 (Harmonic minor thriller resolve)
      ];
    } else if (track === 'BOSS') {
      // 154 BPM: Apocalyptic boss thriller battle (relentless diminished arpeggios & double-kicks)
      bpm = 154;
      progression = [
        [110.00, 130.81, 155.56, 185.00], // A dim7
        [116.54, 138.59, 164.81, 196.00], // Bb dim7
        [103.83, 123.47, 146.83, 174.61], // Ab dim7
        [98.00, 123.47, 146.83, 196.00],  // G / E7b9
      ];
    } else if (track === 'EXPLORATION') {
      // 108 BPM: Dark mystery thriller exploration (pizzicato suspense & atmospheric minor 9ths)
      bpm = 108;
      progression = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 277.18], // Fmaj7#11
        [146.83, 174.61, 220.00, 293.66], // Dm9
        [164.81, 207.65, 246.94, 293.66], // E7b9
      ];
    } else if (track === 'MAIN_MENU') {
      // 92 BPM: Cinematic dark thriller overture with resonant sub-bass
      bpm = 92;
      progression = [
        [130.81, 155.56, 196.00, 261.63], // Cm
        [116.54, 146.83, 174.61, 233.08], // Bb
        [103.83, 130.81, 155.56, 207.65], // Ab
        [98.00, 123.47, 146.83, 196.00],  // G
      ];
    } else {
      // 96 BPM: Scholar / detective mystery (LESSON)
      bpm = 96;
      progression = [
        [196.00, 246.94, 293.66, 349.23], // G
        [164.81, 196.00, 246.94, 329.63], // Em
        [174.61, 220.00, 261.63, 329.63], // F
        [146.83, 174.61, 220.00, 261.63], // Dm
      ];
    }

    const intervalMs = (60 / bpm / 2) * 1000; // 8th note steps
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor((step / 4) % progression.length);
      const chord = progression[chordIndex];
      const note = chord[step % chord.length];

      // Percussion groove depending on track type
      const beatInMeasure = step % 8;

      if (isVillain) {
        // Villain Stomp March: Heavy sub-stomp on beats 0 & 4, chain snare on 2 & 6, tense ticking hats
        if (beatInMeasure === 0 || beatInMeasure === 4) {
          this.triggerSubStomp(now);
          if (track === 'VILLAIN_BOSS_INTRO') {
            this.triggerKick(now, true);
          }
        }
        if (track === 'VILLAIN_BOSS_INTRO' && beatInMeasure === 1) {
          this.triggerKick(now, true);
        }
        if (beatInMeasure === 2 || beatInMeasure === 6) {
          this.triggerSnare(now);
        }
        // Continuous clockwork ticking hat (tension builder)
        this.triggerHiHat(now, beatInMeasure % 2 === 0);
      } else if (track === 'COMBAT' || track === 'BOSS') {
        // High-octane thriller syncopation:
        // Double-kick on 0, 3, 4, 6
        if (
          beatInMeasure === 0 ||
          beatInMeasure === 3 ||
          beatInMeasure === 4 ||
          beatInMeasure === 6 ||
          (track === 'BOSS' && beatInMeasure === 1)
        ) {
          this.triggerKick(now, track === 'BOSS');
        }
        // Snare snaps on 2 and 6
        if (beatInMeasure === 2 || beatInMeasure === 6) {
          this.triggerSnare(now);
        }
        // Driving clockwork 16th hats
        this.triggerHiHat(now, beatInMeasure % 2 === 0);
      } else if (track === 'EXPLORATION') {
        // Mystery exploration heartbeat kick
        if (beatInMeasure === 0) {
          this.triggerKick(now, false);
        }
        if (beatInMeasure === 2 || beatInMeasure === 6) {
          this.triggerHiHat(now, false);
        }
      } else if (track === 'MAIN_MENU') {
        if (beatInMeasure === 0 || beatInMeasure === 4) {
          this.triggerKick(now, false);
        }
        this.triggerHiHat(now, false);
      }

      // Melodic bass & arpeggio synthesizer
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (isVillain) {
        // Ominous villain brass sawtooth horn
        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);
        filter.frequency.linearRampToValueAtTime(160, now + (intervalMs / 1000) * 0.85);
        filter.Q.setValueAtTime(3.2, now);
      } else if (track === 'COMBAT' || track === 'BOSS') {
        // Driving aggressive synthesizer
        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.linearRampToValueAtTime(450, now + (intervalMs / 1000) * 0.7);
      } else {
        // Atmospheric mystery triangle / sine
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
      }

      // Octave jumps for rhythmic bass movement
      const octaveMultiplier = isVillain
        ? (step % 4 === 0 ? 0.5 : 1) // Deep sub drones for villain
        : (track === 'COMBAT' || track === 'BOSS')
        ? (step % 2 === 0 ? 1 : 2)
        : (step % 2 === 0 ? 1 : 1);

      osc.frequency.setValueAtTime(note * octaveMultiplier, now);

      const duration = (intervalMs / 1000) * 0.88;
      const synthVol = isVillain ? 0.11 : (track === 'COMBAT' || track === 'BOSS') ? 0.09 : 0.07;
      gain.gain.setValueAtTime(synthVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration);

      step++;
    }, intervalMs);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentTrack = null;
  }
}
