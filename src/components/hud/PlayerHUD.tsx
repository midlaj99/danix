import React from 'react';
import { PlayerStats } from '../../types/game';
import { Volume2, VolumeX, Pause, Shield, Zap, Sparkles } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

interface PlayerHUDProps {
  stats: PlayerStats;
  levelTitle: string;
  topicTitle: string;
  activeSkill: string;
  onSelectSkill: (skillName: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenLevelSelect: () => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  stats,
  levelTitle,
  topicTitle,
  activeSkill,
  onSelectSkill,
  isMuted,
  onToggleMute,
  onOpenSettings,
  onOpenLevelSelect,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.currentHp / stats.maxHp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (stats.xp / stats.xpToNextLevel) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 pointer-events-none flex justify-between items-start z-20">
      {/* Top Left: Player Status & Skill Bar */}
      <div className="flex flex-col space-y-2 pointer-events-auto">
        <div className="flex items-center space-x-3">
          {/* Avatar Portrait */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-sky-400 flex items-center justify-center font-rpg font-bold text-slate-950 text-xl shadow-inner">
              Ω
            </div>
            <div className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md font-rpg">
              Lv.{stats.level}
            </div>
          </div>

          {/* HP & XP Bars */}
          <div className="flex flex-col space-y-1.5 w-40 sm:w-56">
            {/* HP Bar */}
            <div className="relative h-4 sm:h-5 bg-slate-900/90 rounded-full border border-red-500/40 overflow-hidden shadow-inner flex items-center">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                style={{ width: `${hpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                <span className="flex items-center gap-1 font-rpg">
                  <Shield className="w-3 h-3 text-rose-300" /> HP
                </span>
                <span>
                  {stats.currentHp} / {stats.maxHp}
                </span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="relative h-3 sm:h-3.5 bg-slate-900/90 rounded-full border border-blue-500/40 overflow-hidden shadow-inner flex items-center">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px] sm:text-[9px] font-bold text-blue-100 drop-shadow">
                <span className="flex items-center gap-1 font-rpg">
                  <Zap className="w-2.5 h-2.5 text-cyan-300" /> XP
                </span>
                <span>{Math.round(xpPercent)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Skill Hotbar */}
        <div className="flex items-center gap-1.5 pt-1">
          {stats.skills.map((skill, idx) => {
            const isActive = activeSkill === skill;
            return (
              <button
                key={idx}
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  onSelectSkill(skill);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-rpg font-bold transition shadow-sm cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-amber-400/80 hover:text-amber-300'
                }`}
                title={`Select active skill: ${skill}`}
              >
                <span className="font-mono text-[9px] opacity-70">[{idx + 1}]</span>
                <Sparkles className="w-2.5 h-2.5" />
                <span>{skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Right: Level Indicator & Controls */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onOpenLevelSelect();
          }}
          className="rpg-panel px-3 py-1.5 flex flex-col items-end hover:border-amber-400 transition cursor-pointer group"
          title="Click to change level"
        >
          <span className="text-[11px] text-amber-400 font-rpg font-semibold group-hover:text-amber-300">
            {levelTitle}
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">
            {topicTitle}
          </span>
        </button>

        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onToggleMute();
          }}
          className="p-2 bg-slate-900/80 border border-slate-700 hover:border-amber-400 rounded-lg text-slate-300 hover:text-amber-400 transition cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onOpenSettings();
          }}
          className="p-2 bg-slate-900/80 border border-slate-700 hover:border-amber-400 rounded-lg text-slate-300 hover:text-amber-400 transition cursor-pointer"
          title="Game Settings"
        >
          <Pause className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
