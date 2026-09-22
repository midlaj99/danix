import React from 'react';
import { SoundManager } from '../../audio/SoundManager';
import { Play, RotateCcw, Map, Target, Settings, Sparkles, Award } from 'lucide-react';

interface MainMenuProps {
  hasSavedGame: boolean;
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenArena: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasSavedGame,
  onStartNewGame,
  onResumeGame,
  onOpenLevelSelect,
  onOpenArena,
  onOpenSettings,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden select-none">
      {/* Background Anime RPG Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950/90 to-black z-0 pointer-events-none" />

      {/* Floating Matrix Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/5 text-amber-500 font-mono text-2xl animate-float">np.ndarray</div>
        <div className="absolute top-1/3 right-1/4 text-sky-400 font-mono text-xl animate-float" style={{ animationDelay: '1s' }}>shape=(2, 3)</div>
        <div className="absolute bottom-1/4 left-1/3 text-emerald-400 font-mono text-lg animate-float" style={{ animationDelay: '2s' }}>axis=0</div>
        <div className="absolute bottom-1/3 right-1/5 text-pink-400 font-mono text-xl animate-float" style={{ animationDelay: '1.5s' }}>np.zeros()</div>
      </div>

      {/* Main Menu Center Card */}
      <div className="relative z-10 w-full max-w-lg rpg-panel p-8 text-center shadow-2xl border-amber-500/50 flex flex-col items-center">
        {/* Kingdom Crest */}
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-4 animate-glow">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <span className="font-rpg font-black text-4xl text-amber-400 tracking-wider">Ω</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-rpg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 tracking-wide drop-shadow-md">
          NUMPY KINGDOM
        </h1>
        <p className="text-xs md:text-sm text-amber-200/80 font-sans mt-2 mb-8 tracking-wide">
          Master NumPy. One battle at a time.
        </p>

        {/* Navigation Buttons */}
        <div className="w-full space-y-3">
          {hasSavedGame && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onResumeGame();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> CONTINUE JOURNEY
            </button>
          )}

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onStartNewGame();
            }}
            className="w-full bg-slate-900/90 hover:bg-slate-800 border-2 border-amber-500/60 hover:border-amber-400 text-amber-300 font-rpg font-bold text-sm py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4" /> START JOURNEY
          </button>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenLevelSelect();
            }}
            className="w-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 font-rpg font-semibold text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Map className="w-4 h-4 text-sky-400" /> REALM CAMPAIGN (LEVELS)
          </button>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenArena();
            }}
            className="w-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 font-rpg font-semibold text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Target className="w-4 h-4 text-rose-400" /> PRACTICE ARENA
          </button>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenSettings();
            }}
            className="w-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-slate-200 font-rpg font-semibold text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" /> SETTINGS
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-center gap-2">
          <span>Aria Teaching System v1.0</span>
          <span>•</span>
          <span>Vectorized RPG Engine</span>
        </div>
      </div>
    </div>
  );
};
