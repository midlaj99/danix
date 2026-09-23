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
  onPause?: () => void;
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
  onPause,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (stats.currentHp / stats.maxHp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (stats.xp / stats.xpToNextLevel) * 100));

  return (
    <div
      className="absolute top-0 left-0 right-0 p-2 sm:p-3 pointer-events-none flex justify-between items-start z-20 select-none"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingLeft: 'max(0.6rem, env(safe-area-inset-left, 0.6rem))',
        paddingRight: 'max(0.6rem, env(safe-area-inset-right, 0.6rem))',
      }}
    >
      {/* Top Left: Compact Player Status & Skill Bar */}
      <div className="flex flex-col space-y-1 sm:space-y-1.5 pointer-events-auto">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Compact Avatar Portrait */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-400/80 bg-slate-900 shadow-md flex items-center justify-center shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-sky-400 flex items-center justify-center font-rpg font-bold text-slate-950 text-xs sm:text-sm shadow-inner">
              Ω
            </div>
            <div className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 text-[8px] sm:text-[9px] font-bold px-1 rounded-tl font-rpg">
              Lv.{stats.level}
            </div>
          </div>

          {/* HP & XP Bars */}
          <div className="flex flex-col space-y-1 w-28 xs:w-36 sm:w-48">
            {/* HP Bar */}
            <div className="relative h-3 sm:h-3.5 bg-slate-950/90 rounded-full border border-red-500/40 overflow-hidden shadow-inner flex items-center">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{ width: `${hpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[7.5px] sm:text-[8.5px] font-bold text-white drop-shadow font-mono">
                <span className="flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-rose-300" /> HP
                </span>
                <span>
                  {stats.currentHp}/{stats.maxHp}
                </span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="relative h-2 sm:h-2.5 bg-slate-950/90 rounded-full border border-blue-500/40 overflow-hidden shadow-inner flex items-center">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[7px] sm:text-[8px] font-bold text-blue-100 drop-shadow font-mono">
                <span className="flex items-center gap-0.5">
                  <Zap className="w-2 h-2 text-cyan-300" /> XP
                </span>
                <span>{Math.round(xpPercent)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Skill Hotbar */}
        <div className="flex items-center gap-1 pt-0.5">
          {stats.skills.map((skill, idx) => {
            const isActive = activeSkill === skill;
            return (
              <button
                key={idx}
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  onSelectSkill(skill);
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-rpg font-bold transition shadow-sm cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:border-amber-400/70 hover:text-amber-300'
                }`}
                title={`Select skill: ${skill}`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span className="truncate max-w-[80px] xs:max-w-none">{skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Right: Compact Level Indicator & Actions */}
      <div className="flex items-center space-x-1.5 pointer-events-auto">
        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onOpenLevelSelect();
          }}
          className="bg-slate-900/80 border border-slate-700/80 hover:border-amber-400/80 px-2 py-1 rounded-xl flex flex-col items-end transition cursor-pointer group shadow-sm max-w-[120px] xs:max-w-none"
          title="Change Level"
        >
          <span className="text-[9.5px] text-amber-400 font-rpg font-bold group-hover:text-amber-300 truncate">
            {levelTitle}
          </span>
          <span className="text-[7.5px] text-slate-400 uppercase tracking-wider truncate">
            {topicTitle}
          </span>
        </button>

        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onToggleMute();
          }}
          className="p-1.5 bg-slate-900/80 border border-slate-700 hover:border-amber-400 rounded-xl text-slate-300 hover:text-amber-400 transition cursor-pointer shadow-sm"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            if (onPause) {
              onPause();
            } else {
              onOpenSettings();
            }
          }}
          className="p-1.5 bg-slate-900/80 border border-slate-700 hover:border-amber-400 rounded-xl text-slate-300 hover:text-amber-400 transition cursor-pointer shadow-sm"
          title="Pause / Settings"
          aria-label="Pause"
        >
          <Pause className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
