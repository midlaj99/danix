import React from 'react';
import { MonsterArchetype } from '../../types/curriculum';
import { PlayerStats } from '../../types/game';
import { Swords, Zap, Shield, Play } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

interface CombatPrepModalProps {
  monster: MonsterArchetype;
  radoxomsEarned: number;
  totalQuestions: number;
  playerStats: PlayerStats;
  activeSkill: string;
  onCommenceCombat: () => void;
}

export const CombatPrepModal: React.FC<CombatPrepModalProps> = ({
  monster,
  radoxomsEarned,
  totalQuestions,
  playerStats,
  activeSkill,
  onCommenceCombat,
}) => {
  const handleStart = () => {
    SoundManager.getInstance().playCinematicBoom();
    SoundManager.getInstance().playSwordClash();
    onCommenceCombat();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-[3px] select-none animate-fadeIn pointer-events-auto"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
      }}
    >
      {/* Compact Cinematic In-Game Transition Overlay */}
      <div className="relative w-full max-w-md bg-slate-950/88 border-2 border-rose-500/60 rounded-3xl p-4 sm:p-6 text-center shadow-[0_0_60px_rgba(244,63,94,0.35)] backdrop-blur-md flex flex-col items-center">
        {/* Cinematic Runic Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-950/90 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(239,68,68,0.5)] mb-2 animate-pulse">
          <Swords className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {/* Cinematic Titles */}
        <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          RADOXOM RESERVES READY
        </span>
        <h1 className="text-xl sm:text-3xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 mt-0.5 tracking-wide drop-shadow">
          ENEMY APPROACHING
        </h1>
        <div className="text-xs sm:text-sm font-rpg font-bold text-rose-400 uppercase tracking-wider mt-0.5 mb-3">
          ✦ {monster.name} ({monster.hp} HP) ✦
        </div>

        {/* Compact Status Badges */}
        <div className="grid grid-cols-2 gap-2 w-full mb-3.5">
          <div className="bg-amber-950/50 border border-amber-500/40 p-2 rounded-xl flex items-center justify-between">
            <span className="text-[10px] text-amber-300/80 font-mono flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> AMMO:
            </span>
            <span className="font-mono font-black text-sm text-white">
              ✦ {radoxomsEarned} / {totalQuestions}
            </span>
          </div>

          <div className="bg-sky-950/50 border border-sky-500/40 p-2 rounded-xl flex items-center justify-between">
            <span className="text-[10px] text-sky-300/80 font-mono flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sky-400" /> SHIELD:
            </span>
            <span className="font-mono font-black text-sm text-white">
              {playerStats.currentShield}
            </span>
          </div>
        </div>

        {/* Rapid Tactical Advice */}
        <div className="text-[10.5px] text-slate-300 font-mono space-y-0.5 mb-4 leading-tight bg-slate-900/70 p-2 rounded-xl border border-slate-800 w-full text-left">
          <div className="text-amber-400 font-bold mb-0.5">TACTICAL DISPATCH:</div>
          <div>• <strong className="text-white">JUMP</strong> over monster shockwaves</div>
          <div>• <strong className="text-cyan-300">DODGE ROLL</strong> through heavy attacks</div>
          <div>• <strong className="text-amber-300">DRAG TO AIM</strong> & fire Radoxoms</div>
        </div>

        {/* PRIMARY ACTION: START BATTLE */}
        <button
          onClick={handleStart}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-rpg font-black text-sm sm:text-base tracking-widest shadow-[0_0_25px_rgba(244,63,94,0.6)] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START BATTLE ⚔</span>
        </button>
      </div>
    </div>
  );
};
