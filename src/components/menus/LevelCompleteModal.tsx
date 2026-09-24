import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../audio/SoundManager';
import { Award, ArrowRight, Zap, Sparkles, Target, Timer } from 'lucide-react';
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

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#10b981', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error:', e);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-[3px] select-none animate-fadeIn pointer-events-auto"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      {/* Compact Cinematic Victory Card over Visible Game World */}
      <div className="relative w-full max-w-sm bg-slate-950/92 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-5 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] backdrop-blur-md flex flex-col items-center">
        {/* Victory Crest */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.5)] mb-1.5 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <span className="text-[10px] font-rpg font-bold uppercase tracking-widest text-amber-400">
          EXPEDITION CONQUERED
        </span>
        <h1 className="text-xl sm:text-2xl font-rpg font-black text-white mt-0.5">
          LEVEL {levelNumber} VICTORY
        </h1>
        <p className="text-[11px] text-slate-300 font-mono mb-2 truncate max-w-[260px]">{levelTitle}</p>

        {/* Combat Stats Grid */}
        {combatStats && (
          <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2 mb-2 text-left grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[9px] block">ACCURACY</span>
              <span className="text-sky-300 font-bold">{combatStats.accuracy}%</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[9px] block">RADOXOMS FIRED</span>
              <span className="text-amber-300 font-bold">{combatStats.radoxomsFired}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[9px] block">ATTACKS DODGED</span>
              <span className="text-cyan-300 font-bold">{combatStats.attacksDodged}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 text-[9px] block">XP EARNED</span>
              <span className="text-emerald-400 font-bold">+{rewardXp} XP</span>
            </div>
          </div>
        )}

        {/* Unlocked Skill Badge */}
        {unlockedSkill && (
          <div className="w-full bg-sky-950/50 border border-sky-500/40 p-2 rounded-xl text-left mb-2.5">
            <div className="flex items-center gap-1.5 text-sky-300 text-[10.5px] font-rpg font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>SKILL UNLOCKED: {unlockedSkill.name}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full space-y-1.5">
          {hasNextLevel ? (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onNextLevel();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-extrabold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer"
            >
              <span>PROCEED TO NEXT LEVEL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onReturnToMenu();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-rpg font-extrabold text-xs tracking-wider transition cursor-pointer"
            >
              <span>RETURN TO MAIN MENU</span>
            </button>
          )}

          {hasNextLevel && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onReturnToMenu();
              }}
              className="w-full py-1 text-slate-400 hover:text-slate-200 text-[10.5px] font-mono transition cursor-pointer"
            >
              Return to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
