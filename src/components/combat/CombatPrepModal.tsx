import React from 'react';
import { MonsterArchetype } from '../../types/curriculum';
import { PlayerStats } from '../../types/game';
import { Shield, Zap, Swords, Target, Move, Flame, ArrowRight } from 'lucide-react';
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
    onCommenceCombat();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-sky-500/40 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                1v1 Arena Engagement
              </span>
              <h2 className="text-xl font-black text-white tracking-wide">
                COMBAT PREPARATION BRIEFING
              </h2>
            </div>
          </div>
          <div className="text-xs px-3 py-1 rounded-full bg-slate-800 text-sky-400 border border-slate-700 font-mono">
            REAL-TIME ACTION MODE
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Monster Threat Dossier */}
            <div className="bg-slate-800/60 border border-rose-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Target Threat
                  </span>
                  <h3 className="text-lg font-bold text-white">{monster.name}</h3>
                </div>
                <div className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
                  HP: {monster.hp}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Base Attack Power:</span>
                  <span className="font-bold text-rose-400">{monster.attack} DMG</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Combat Stance:</span>
                  <span className="font-semibold text-amber-300 capitalize">{monster.spriteType}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Elemental Trait:</span>
                  <span className="font-semibold text-sky-300">Kinetic Vector</span>
                </div>
              </div>

              {/* Combat Intel Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>TACTICAL INTEL</span>
                </div>
                <p>
                  • <strong className="text-white">Ground Shockwaves:</strong> You must physically <span className="text-amber-300 font-semibold">JUMP</span> over horizontal shockwaves!
                </p>
                <p>
                  • <strong className="text-white">Heavy Lunges & Orbs:</strong> Use your <span className="text-cyan-300 font-semibold">DODGE ROLL [C]</span> for invulnerability frames.
                </p>
                <p>
                  • <strong className="text-white">Monster Evasion:</strong> The beast will attempt to dodge incoming projectiles. Aim where it will land!
                </p>
              </div>
            </div>

            {/* Right: Player Readiness & Controls */}
            <div className="bg-slate-800/60 border border-sky-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Hero Loadout
                  </span>
                  <h3 className="text-lg font-bold text-white">Your Arsenal</h3>
                </div>
                <div className="px-3 py-1 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-300 font-mono text-xs font-bold">
                  {activeSkill}
                </div>
              </div>

              {/* Ammunition & Shield Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Zap className="w-4 h-4" />
                    <span>RADOXOM AMMO</span>
                  </div>
                  <div className="text-2xl font-black text-amber-300 mt-1">
                    {radoxomsEarned}{' '}
                    <span className="text-xs font-normal text-slate-400">/ {totalQuestions}</span>
                  </div>
                  <div className="text-[10px] text-amber-200/70 mt-0.5">Physical Projectiles</div>
                </div>

                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
                    <Shield className="w-4 h-4" />
                    <span>ENERGY SHIELD</span>
                  </div>
                  <div className="text-2xl font-black text-sky-300 mt-1">
                    {playerStats.currentShield}{' '}
                    <span className="text-xs font-normal text-slate-400">/ {playerStats.maxShield}</span>
                  </div>
                  <div className="text-[10px] text-sky-200/70 mt-0.5">Absorbs Damage First</div>
                </div>
              </div>

              {/* Controls Map Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2 text-xs">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-sky-400" />
                  <span>ACTION CONTROLS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400">WASD / Keys</span>
                    <span className="text-white font-bold">Move</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400">Space / W</span>
                    <span className="text-amber-300 font-bold">Jump</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400">Key [C]</span>
                    <span className="text-cyan-300 font-bold">Dodge Roll</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-slate-400">Mouse + Click</span>
                    <span className="text-yellow-300 font-bold">Fire Radoxom</span>
                  </div>
                </div>
                <div className="text-[10px] text-amber-400/90 font-sans italic pt-1 text-center">
                  📱 Mobile: Use on-screen Virtual Joystick & Action Buttons
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-sky-500/20 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Take aim, dodge incoming attacks, and unleash your Radoxoms!
          </div>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>COMMENCE 1v1 BATTLE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
