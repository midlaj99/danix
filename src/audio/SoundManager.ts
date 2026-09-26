/**
 * Procedural Web Audio Sound & Music Synthesizer
 * Provides 100% self-contained, responsive, low-latency audio for NumPy Kingdom
 * Features FM synth, rhythm percussion drums (kick, snare, hat), and cinematic effects.
 */

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

  /* ------------------- PERCUSSION SYNTHESIZERS ------------------- */

  private triggerKick(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.15);
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

  private triggerHiHat(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

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

  public playMonsterRoar() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Frequency modulation for terrifying beast growl
    osc1.frequency.setValueAtTime(140, time);
    osc1.frequency.linearRampToValueAtTime(65, time + 0.55);
    osc2.frequency.setValueAtTime(148, time);
    osc2.frequency.linearRampToValueAtTime(60, time + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.linearRampToValueAtTime(350, time + 0.55);

    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.65);
    osc2.stop(time + 0.65);
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

  public playMusic(track: 'MAIN_MENU' | 'EXPLORATION' | 'COMBAT' | 'BOSS' | 'LESSON') {
    if (this.currentTrack === track) return;
    this.stopMusic();
    this.currentTrack = track;
    this.ensureContext();
    if (!this.ctx || !this.musicGain) return;

    let step = 0;
    let bpm = 120;
    let progression: number[][] = [];

    if (track === 'MAIN_MENU' || track === 'LESSON') {
      bpm = 96;
      progression = [
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66], // G
      ];
    } else if (track === 'EXPLORATION') {
      bpm = 112;
      progression = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ];
    } else if (track === 'COMBAT') {
      bpm = 142; // Fast, driving combat
      progression = [
        [146.83, 174.61, 220.00, 293.66], // Dm9
        [130.81, 164.81, 196.00, 261.63], // C
        [116.54, 146.83, 174.61, 233.08], // Bb
        [110.00, 138.59, 164.81, 220.00], // A
      ];
    } else {
      bpm = 152; // Apocalyptic Boss
      progression = [
        [110.00, 130.81, 164.81, 220.00], // Am
        [103.83, 123.47, 155.56, 207.65], // Ab dim
        [98.00, 123.47, 146.83, 196.00],  // G
        [92.50, 116.54, 138.59, 185.00],  // F# dim
      ];
    }

    const intervalMs = (60 / bpm / 2) * 1000; // 8th note steps
    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chordIndex = Math.floor((step / 4) % progression.length);
      const chord = progression[chordIndex];
      const note = chord[step % chord.length];

      // Percussion groove during COMBAT and BOSS
      if (track === 'COMBAT' || track === 'BOSS') {
        const beatInMeasure = step % 8;
        // Kick on 0, 4 and syncopated 6
        if (beatInMeasure === 0 || beatInMeasure === 4 || beatInMeasure === 6) {
          this.triggerKick(now);
        }
        // Snare on 2 and 6
        if (beatInMeasure === 2 || beatInMeasure === 6) {
          this.triggerSnare(now);
        }
        // Hi-hat on every step
        this.triggerHiHat(now);
      }

      // Melodic bass & arpeggio synth
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = (track === 'COMBAT' || track === 'BOSS') ? 'sawtooth' : 'triangle';
      const octaveMultiplier = (step % 2 === 0) ? 1 : 2;
      osc.frequency.setValueAtTime(note * octaveMultiplier, now);

      const duration = intervalMs / 1000 * 0.85;
      const synthVol = (track === 'COMBAT' || track === 'BOSS') ? 0.09 : 0.07;
      gain.gain.setValueAtTime(synthVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
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
