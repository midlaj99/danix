import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../audio/SoundManager';
import { Award, ArrowRight, Zap, Sparkles, Target, Shield, Crosshair, Timer, Flame } from 'lucide-react';
import { CombatStats } from '../../types/game';

interface LevelCompleteModalProps {
  levelNumber: number;
  levelTitle: string;
  rewardXp: number;
  unlockedSkill?: { name: string; description: string; icon: string };
  combatStats?: CombatStats;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReturnToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  levelTitle,
  rewardXp,
  unlockedSkill,
  combatStats,
  hasNextLevel,
  onNextLevel,
  onReturnToMenu,
}) => {
  useEffect(() => {
    SoundManager.getInstance().playVictoryFanfare();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-lg rpg-panel p-8 shadow-2xl border-amber-500/60 flex flex-col items-center text-center">
        {/* Victory Crest */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.5)] mb-4 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-400" />
          </div>
        </div>

        <span className="text-xs font-rpg font-bold uppercase tracking-widest text-amber-400 mb-1">
          EXPEDITION CONQUERED
        </span>

        <h1 className="text-2xl md:text-3xl font-rpg font-extrabold text-white mb-1">
          LEVEL {levelNumber} COMPLETE
        </h1>
        <p className="text-xs text-slate-300 mb-4">{levelTitle}</p>

        {/* Combat Grade Badge */}
        {combatStats?.combatRating && (
          <div className="flex items-center gap-2 mb-4 bg-slate-900/90 border border-slate-800 px-4 py-1.5 rounded-full">
            <span className="text-[11px] font-rpg uppercase tracking-wider text-slate-400">Battle Mastery:</span>
            <span className={`px-3 py-0.5 rounded-full font-rpg font-black text-xs border shadow-lg ${
              combatStats.combatRating === 'S'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border-yellow-200 shadow-yellow-500/40'
                : combatStats.combatRating === 'A'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 border-sky-300 shadow-sky-500/30'
                : combatStats.combatRating === 'B'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 border-emerald-300 shadow-emerald-500/30'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              GRADE {combatStats.combatRating}
            </span>
          </div>
        )}

        {/* Combat Performance Report */}
        {combatStats && (
          <div className="w-full bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 mb-4 text-left space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> 1v1 Battle Debriefing
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                Accuracy: {combatStats.accuracy}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">RADOXOMS FIRED / HIT</span>
                <span className="text-white font-bold">{combatStats.radoxomsFired} / {combatStats.radoxomsHit}</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TIME TO DEFEAT</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Timer className="w-3 h-3 text-amber-400" />
                  {combatStats.timeToDefeat ?? combatStats.timeSurvived ?? 0}s
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">ATTACKS DODGED</span>
                <span className="text-cyan-300 font-bold">{combatStats.attacksDodged} evasions</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">DAMAGE TAKEN</span>
                <span className="text-rose-400 font-bold">{combatStats.damageTaken} DMG</span>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Section */}
        <div className="w-full space-y-3 mb-6">
          {/* XP Reward Card */}
          <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5 font-rpg">
              <Zap className="w-4 h-4 text-amber-400" /> Experience Gained
            </span>
            <span className="font-rpg font-bold text-amber-400 text-sm">+{rewardXp} XP</span>
          </div>

          {/* Skill Unlocked (if any) */}
          {unlockedSkill && (
            <div className="bg-gradient-to-r from-blue-950/80 to-slate-900/80 border border-sky-500/50 p-3.5 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-rpg font-bold text-sky-300 uppercase tracking-wide">
                  New Skill Unlocked!
                </span>
              </div>
              <div className="font-rpg font-bold text-white text-sm">{unlockedSkill.name}</div>
              <p className="text-[11px] text-slate-300 mt-0.5">{unlockedSkill.description}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full space-y-2.5">
          {hasNextLevel ? (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onNextLevel();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
            >
              PROCEED TO NEXT LEVEL <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onReturnToMenu();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-rpg font-bold text-sm py-3 px-6 rounded-xl shadow-lg transition cursor-pointer"
            >
              CLAIM NUMPY MASTER TITLE
            </button>
          )}

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onReturnToMenu();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-rpg text-xs py-2.5 px-6 rounded-xl transition cursor-pointer"
          >
            RETURN TO REALM MAP
          </button>
        </div>
      </div>
    </div>
  );
};
