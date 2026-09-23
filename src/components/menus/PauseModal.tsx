import React from 'react';
import { Play, RotateCcw, Settings, Home, X } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestartLevel: () => void;
  onOpenSettings: () => void;
  onQuitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestartLevel,
  onOpenSettings,
  onQuitToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xs sm:max-w-sm rpg-panel p-5 shadow-2xl border-amber-500/50 flex flex-col gap-4 text-center">
        {/* Glowing Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-base sm:text-lg font-rpg font-bold tracking-wider text-amber-300">
              GAME PAUSED
            </h3>
          </div>
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onResume();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Resume"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onResume();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME</span>
          </button>

          {/* Restart Level */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onRestartLevel();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-rpg font-bold text-xs tracking-wide flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span>RESTART LEVEL</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-rpg font-bold text-xs tracking-wide flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>SETTINGS</span>
          </button>

          {/* Quit to Menu */}
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onQuitToMenu();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/50 text-rose-300 font-rpg font-bold text-xs tracking-wide flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>QUIT TO MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
