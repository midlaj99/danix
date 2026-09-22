import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SoundManager } from '../../audio/SoundManager';
import { Zap, Flame, Scissors, Crosshair, Radio, Filter, Sun, Crown, Layers, Sparkles, Check } from 'lucide-react';

interface SkillUnlockModalProps {
  skill: {
    name: string;
    description: string;
    icon: string;
  };
  onClose: () => void;
}

export const SkillUnlockModal: React.FC<SkillUnlockModalProps> = ({ skill, onClose }) => {
  useEffect(() => {
    SoundManager.getInstance().playVictoryFanfare();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#38bdf8', '#f59e0b', '#22c55e', '#ec4899', '#facc15'],
      });
    } catch {
      // fallback
    }
  }, []);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-12 h-12 text-orange-400 animate-pulse" />;
      case 'Scissors':
        return <Scissors className="w-12 h-12 text-teal-400" />;
      case 'Crosshair':
        return <Crosshair className="w-12 h-12 text-purple-400" />;
      case 'Radio':
        return <Radio className="w-12 h-12 text-rose-400" />;
      case 'Filter':
        return <Filter className="w-12 h-12 text-sky-400" />;
      case 'Sun':
        return <Sun className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />;
      case 'Crown':
        return <Crown className="w-12 h-12 text-yellow-400" />;
      case 'Layers':
        return <Layers className="w-12 h-12 text-emerald-400" />;
      default:
        return <Zap className="w-12 h-12 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md rpg-panel p-8 shadow-[0_0_60px_rgba(56,189,248,0.3)] border-sky-400/60 flex flex-col items-center text-center">
        {/* Glow Ring */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-1 shadow-[0_0_40px_rgba(56,189,248,0.6)] mb-4 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
            {getSkillIcon(skill.icon)}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-rpg font-bold uppercase tracking-widest text-sky-400 mb-1">
          <Sparkles className="w-4 h-4 text-sky-400" />
          NEW COMBAT SKILL AWAKENED!
        </div>

        <h1 className="text-2xl md:text-3xl font-rpg font-extrabold text-white mb-2">
          {skill.name}
        </h1>

        <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-2xl mb-6 text-slate-200 text-xs leading-relaxed">
          {skill.description}
        </div>

        <div className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 mb-6 flex items-center justify-between text-xs font-rpg">
          <span className="text-slate-400">Hero Attacking Style:</span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Automatically Equipped
          </span>
        </div>

        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onClose();
          }}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-rpg font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
        >
          CLAIM & CONTINUE
        </button>
      </div>
    </div>
  );
};
