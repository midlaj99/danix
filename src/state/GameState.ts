import { SaveData, PlayerStats, SettingsState, TopicMastery } from '../types/game';

const SAVE_KEY = 'numpy_kingdom_save_v1';

const DEFAULT_SETTINGS: SettingsState = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  muted: false,
  dialogueSpeed: 'normal',
  textScale: 'normal',
  quality: 'high',
};

const DEFAULT_PLAYER_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  currentHp: 100,
  maxHp: 100,
  currentShield: 100,
  maxShield: 100,
  attackPower: 25,
  skills: ['Array Strike'],
};

const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  currentLevelId: 1,
  unlockedLevelId: 1,
  playerStats: DEFAULT_PLAYER_STATS,
  settings: DEFAULT_SETTINGS,
  completedLevels: [],
  topicMastery: {},
  questionsAnswered: 0,
  questionsCorrect: 0,
  streak: 0,
  highStreak: 0,
  achievements: [],
  lastPlayed: new Date().toISOString(),
};

export class GameStateManager {
  private static instance: GameStateManager;
  private state: SaveData;
  private listeners: Array<() => void> = [];

  private constructor() {
    this.state = this.loadFromStorage();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
    this.saveToStorage();
  }

  private loadFromStorage(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 1) {
          return {
            ...DEFAULT_SAVE_DATA,
            ...parsed,
            playerStats: {
              ...DEFAULT_PLAYER_STATS,
              ...parsed.playerStats,
              currentShield: parsed.playerStats?.currentShield ?? DEFAULT_PLAYER_STATS.currentShield,
              maxShield: parsed.playerStats?.maxShield ?? DEFAULT_PLAYER_STATS.maxShield,
            },
            settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load save data from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
  }

  private saveToStorage() {
    try {
      this.state.lastPlayed = new Date().toISOString();
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  public getState(): SaveData {
    return this.state;
  }

  public getPlayerStats(): PlayerStats {
    return this.state.playerStats;
  }

  public getSettings(): SettingsState {
    return this.state.settings;
  }

  public updateSettings(partial: Partial<SettingsState>) {
    this.state.settings = { ...this.state.settings, ...partial };
    this.notify();
  }

  public setCurrentLevel(levelId: number) {
    this.state.currentLevelId = levelId;
    this.notify();
  }

  public unlockLevel(levelId: number) {
    if (levelId > this.state.unlockedLevelId) {
      this.state.unlockedLevelId = levelId;
    }
    if (!this.state.completedLevels.includes(levelId - 1) && levelId > 1) {
      this.state.completedLevels.push(levelId - 1);
    }
    this.notify();
  }

  public completeCurrentLevel(rewardXp: number, skillName?: string) {
    const lvl = this.state.currentLevelId;
    if (!this.state.completedLevels.includes(lvl)) {
      this.state.completedLevels.push(lvl);
    }
    if (this.state.currentLevelId >= this.state.unlockedLevelId) {
      this.state.unlockedLevelId = this.state.currentLevelId + 1;
    }
    if (skillName && !this.state.playerStats.skills.includes(skillName)) {
      this.state.playerStats.skills.push(skillName);
    }
    this.addXp(rewardXp);
    this.notify();
  }

  public addXp(amount: number) {
    const stats = this.state.playerStats;
    stats.xp += amount;
    while (stats.xp >= stats.xpToNextLevel) {
      stats.xp -= stats.xpToNextLevel;
      stats.level += 1;
      stats.maxHp += 15;
      stats.currentHp = stats.maxHp;
      stats.attackPower += 5;
      stats.xpToNextLevel = Math.round(stats.xpToNextLevel * 1.35);
    }
    this.notify();
  }

  public healFull() {
    this.state.playerStats.currentHp = this.state.playerStats.maxHp;
    this.state.playerStats.currentShield = this.state.playerStats.maxShield;
    this.notify();
  }

  public takeDamage(amount: number): {
    hpRemaining: number;
    shieldRemaining: number;
    shieldAbsorbed: number;
    hpDamage: number;
  } {
    const stats = this.state.playerStats;
    let shieldAbsorbed = 0;
    let hpDamage = 0;

    if (stats.currentShield > 0) {
      if (stats.currentShield >= amount) {
        stats.currentShield -= amount;
        shieldAbsorbed = amount;
      } else {
        shieldAbsorbed = stats.currentShield;
        hpDamage = amount - stats.currentShield;
        stats.currentShield = 0;
        stats.currentHp = Math.max(0, stats.currentHp - hpDamage);
      }
    } else {
      hpDamage = amount;
      stats.currentHp = Math.max(0, stats.currentHp - amount);
    }

    this.notify();
    return {
      hpRemaining: stats.currentHp,
      shieldRemaining: stats.currentShield,
      shieldAbsorbed,
      hpDamage,
    };
  }

  public recordAnswer(topic: string, isCorrect: boolean, category: string = 'General NumPy') {
    this.state.questionsAnswered += 1;
    if (isCorrect) {
      this.state.questionsCorrect += 1;
      this.state.streak += 1;
      if (this.state.streak > this.state.highStreak) {
        this.state.highStreak = this.state.streak;
      }
    } else {
      this.state.streak = 0;
    }

    if (!this.state.topicMastery[topic]) {
      this.state.topicMastery[topic] = { correct: 0, total: 0, percentage: 0, category };
    }
    const tm = this.state.topicMastery[topic];
    tm.category = category || tm.category || 'General NumPy';
    tm.total += 1;
    if (isCorrect) tm.correct += 1;
    tm.percentage = Math.round((tm.correct / tm.total) * 100);

    this.notify();
  }

  public getCategoryMasteryScores(): Record<string, { correct: number; total: number; percentage: number; rank: 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER' }> {
    const categories: Record<string, { correct: number; total: number }> = {};

    Object.values(this.state.topicMastery).forEach((detail) => {
      const cat = detail.category || 'General NumPy';
      if (!categories[cat]) {
        categories[cat] = { correct: 0, total: 0 };
      }
      categories[cat].correct += detail.correct;
      categories[cat].total += detail.total;
    });

    const result: Record<string, { correct: number; total: number; percentage: number; rank: 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER' }> = {};

    Object.entries(categories).forEach(([cat, data]) => {
      const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      let rank: 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER' = 'NOVICE';
      if (percentage >= 90) rank = 'NUMPY MASTER';
      else if (percentage >= 75) rank = 'ADVANCED';
      else if (percentage >= 60) rank = 'PRACTICING';
      else if (percentage >= 40) rank = 'LEARNING';
      else rank = 'NOVICE';

      result[cat] = {
        correct: data.correct,
        total: data.total,
        percentage,
        rank,
      };
    });

    return result;
  }

  public getOverallMasteryRank(): { percentage: number; rank: 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER' } {
    if (this.state.questionsAnswered === 0) {
      return { percentage: 0, rank: 'NOVICE' };
    }
    const percentage = Math.round((this.state.questionsCorrect / this.state.questionsAnswered) * 100);
    let rank: 'NOVICE' | 'LEARNING' | 'PRACTICING' | 'ADVANCED' | 'NUMPY MASTER' = 'NOVICE';
    if (percentage >= 90) rank = 'NUMPY MASTER';
    else if (percentage >= 75) rank = 'ADVANCED';
    else if (percentage >= 60) rank = 'PRACTICING';
    else if (percentage >= 40) rank = 'LEARNING';

    return { percentage, rank };
  }

  public unlockAchievement(id: string): boolean {
    if (!this.state.achievements) {
      this.state.achievements = [];
    }
    if (!this.state.achievements.includes(id)) {
      this.state.achievements.push(id);
      this.notify();
      return true;
    }
    return false;
  }

  public resetProgress() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.notify();
  }
}
