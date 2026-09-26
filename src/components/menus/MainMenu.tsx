import React from 'react';
import { SoundManager } from '../../audio/SoundManager';
import { PlayerStats } from '../../types/game';
import { Play, RotateCcw, Map, Target, Settings, Sparkles, Volume2, VolumeX, Shield, Award, ChevronRight, Zap } from 'lucide-react';

interface MainMenuProps {
  hasSavedGame: boolean;
  playerStats?: PlayerStats;
  completedLevelsCount?: number;
  unlockedLevelId?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenArena: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasSavedGame,
  playerStats,
  completedLevelsCount = 0,
  unlockedLevelId = 1,
  isMuted = false,
  onToggleMute,
  onStartNewGame,
  onResumeGame,
  onOpenLevelSelect,
  onOpenArena,
  onOpenSettings,
}) => {
  const heroLevel = playerStats?.level || 1;
  const heroXp = playerStats?.xp || 0;
  const nextXp = playerStats?.xpToNextLevel || 100;
  const xpPercent = Math.min(100, Math.round((heroXp / Math.max(1, nextXp)) * 100));

  return (
    <div
      className="relative w-full h-full max-h-[100dvh] flex items-center justify-center p-2.5 sm:p-6 bg-slate-950 overflow-y-auto select-none"
      style={{
        paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0.75rem))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Deep Celestial Atmosphere Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/70 via-slate-950/95 to-black pointer-events-none z-0" />

      {/* Atmospheric Star Dust Grid & Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-pink-500/10 blur-[100px]" />
      </div>

      {/* Floating NumPy Matrix Glyphs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
        <div className="absolute top-[12%] left-[8%] text-amber-400 font-mono text-xs sm:text-sm animate-float">
          np.ndarray[shape=(2, 3)]
        </div>
        <div className="absolute top-[28%] right-[8%] text-sky-400 font-mono text-xs sm:text-sm animate-float" style={{ animationDelay: '1.2s' }}>
          broadcasting: (3, 1) + (3,)
        </div>
        <div className="absolute bottom-[20%] left-[10%] text-emerald-400 font-mono text-xs sm:text-sm animate-float" style={{ animationDelay: '2.4s' }}>
          axis=0 • vectorized
        </div>
        <div className="absolute bottom-[28%] right-[12%] text-pink-400 font-mono text-xs sm:text-sm animate-float" style={{ animationDelay: '1.8s' }}>
          np.zeros((4, 4))
        </div>
      </div>

      {/* Top Bar Quick Controls */}
      <div className="fixed top-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-medium">DANIX v2.0 • NUMPY KINGDOM</span>
        </div>

        {onToggleMute && (
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onToggleMute();
            }}
            className="pointer-events-auto p-2 rounded-full bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-400/60 text-slate-300 hover:text-white transition-all shadow-lg active:scale-95 cursor-pointer backdrop-blur-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        )}
      </div>

      {/* Main Menu Centerpiece Card */}
      <div className="relative z-10 w-full max-w-md rpg-panel p-4 sm:p-7 text-center shadow-2xl flex flex-col items-center my-auto py-4 sm:py-6">
        {/* Animated Runic Crest */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3 flex items-center justify-center">
          {/* Outer Rotating Dashed Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40 animate-spin-slow" />
          
          {/* Center Glowing Emblem */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.5)] animate-glow">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <span className="font-rpg font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 tracking-wider">
                Ω
              </span>
            </div>
          </div>
        </div>

        {/* Title & Branding */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-amber-400" />
            ANIME ACTION RPG
          </div>
          <h1 className="text-3xl sm:text-4xl font-rpg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-wider drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
            NUMPY KINGDOM
          </h1>
          <p className="text-xs text-slate-300/80 font-sans tracking-wide">
            Master NumPy Arrays & Real-Time Action Combat
          </p>
        </div>

        {/* Hero Progress Dossier (Visible if player has progress) */}
        {hasSavedGame && (
          <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 mb-4 text-left shadow-inner flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-rpg font-bold text-xs">
                  Lv
                </div>
                <div>
                  <div className="text-xs font-rpg font-bold text-white flex items-center gap-1.5">
                    HERO TIER {heroLevel}
                    <span className="text-[10px] font-mono text-amber-400 font-normal">
                      • {completedLevelsCount}/42 Cleared
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {heroXp}/{nextXp} XP
              </span>
            </div>

            {/* Micro XP Bar */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons Hierarchy */}
        <div className="w-full space-y-2.5">
          {hasSavedGame ? (
            <>
              {/* Primary: Continue Saved Expedition */}
              <button
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  onResumeGame();
                }}
                className="w-full py-3 px-5 rpg-btn-primary rpg-gold-shimmer text-xs sm:text-sm flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>CONTINUE JOURNEY</span>
                </span>
                <span className="text-[11px] font-mono font-bold bg-slate-950/20 px-2 py-0.5 rounded-lg text-slate-950">
                  LEVEL {unlockedLevelId}
                </span>
              </button>

              {/* Secondary: Start from Level 1 */}
              <button
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  onStartNewGame();
                }}
                className="w-full py-2.5 px-4 rpg-btn-obsidian text-xs font-rpg font-bold flex items-center justify-center gap-2 cursor-pointer text-slate-300 hover:text-amber-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART CAMPAIGN (LVL 1)</span>
              </button>
            </>
          ) : (
            /* First Time: Start Journey */
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onStartNewGame();
              }}
              className="w-full py-3.5 px-5 rpg-btn-primary rpg-gold-shimmer text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>START EXPEDITION</span>
            </button>
          )}

          {/* Realm Campaign (Levels) */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenLevelSelect();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-sky-500/30 hover:border-sky-400 text-sky-200 hover:text-sky-100 font-rpg font-semibold text-xs flex items-center justify-between transition-all group cursor-pointer shadow-md hover:shadow-sky-500/10"
          >
            <span className="flex items-center gap-2">
              <Map className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>REALM CAMPAIGN (42 EXPEDITIONS)</span>
            </span>
            <ChevronRight className="w-4 h-4 text-sky-400/60 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Practice Arena */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenArena();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-rose-500/30 hover:border-rose-400 text-rose-200 hover:text-rose-100 font-rpg font-semibold text-xs flex items-center justify-between transition-all group cursor-pointer shadow-md hover:shadow-rose-500/10"
          >
            <span className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>PRACTICE ARENA (INFINITE)</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40">
              ENDLESS DRILLS
            </span>
          </button>

          {/* System Settings */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white font-rpg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>SYSTEM SETTINGS</span>
          </button>
        </div>

        {/* Footer info badge */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-center gap-2 font-mono">
          <span>Real-Time 1v1 Combat</span>
          <span>•</span>
          <span>Aria Teacher</span>
          <span>•</span>
          <span>Zero-Repeat Questions</span>
        </div>
      </div>
    </div>
  );
};
