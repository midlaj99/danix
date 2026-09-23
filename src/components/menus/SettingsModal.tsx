import React, { useState } from 'react';
import { SettingsState } from '../../types/game';
import { SoundManager } from '../../audio/SoundManager';
import { X, Volume2, VolumeX, Gauge, Trash2, AlertTriangle, Check, Music, Sliders } from 'lucide-react';

interface SettingsModalProps {
  settings: SettingsState;
  onUpdateSettings: (partial: Partial<SettingsState>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md rpg-panel p-5 sm:p-6 shadow-2xl my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">
                Configuration
              </span>
              <h2 className="text-base font-rpg font-bold text-white tracking-wide">
                SYSTEM SETTINGS
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Section: Audio Controls */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                {settings.muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                MASTER AUDIO
              </span>
              <button
                onClick={() => {
                  const nextMute = !settings.muted;
                  SoundManager.getInstance().setMuted(nextMute);
                  onUpdateSettings({ muted: nextMute });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-rpg font-bold transition cursor-pointer ${
                  settings.muted
                    ? 'bg-rose-950/80 border border-rose-500/60 text-rose-300'
                    : 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                }`}
              >
                {settings.muted ? 'MUTED' : 'ENABLED'}
              </button>
            </div>

            {/* BGM Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Music className="w-3 h-3 text-sky-400" /> BGM Volume
                </span>
                <span className="font-mono text-amber-400">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  SoundManager.getInstance().setMusicVolume(val);
                  onUpdateSettings({ musicVolume: val });
                }}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* SFX Volume Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-400" /> SFX Impact Volume
                </span>
                <span className="font-mono text-amber-400">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  SoundManager.getInstance().setSfxVolume(val);
                  onUpdateSettings({ sfxVolume: val });
                }}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>

          {/* Section: Dialogue Speed */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
            <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-400" /> ARIA DIALOGUE TEXT SPEED
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['slow', 'normal', 'fast', 'instant'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    SoundManager.getInstance().playUiClick();
                    onUpdateSettings({ dialogueSpeed: spd });
                  }}
                  className={`py-1.5 rounded-lg text-xs font-rpg font-semibold capitalize transition cursor-pointer ${
                    settings.dialogueSpeed === spd
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone: Reset Game Data */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>DANGER ZONE</span>
            </div>

            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 hover:border-rose-500 text-rose-300 text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer font-rpg font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset Adventure Progress
              </button>
            ) : (
              <div className="space-y-2 bg-slate-950/80 p-3 rounded-lg border border-rose-500/50">
                <p className="text-[11px] text-rose-300 leading-tight">
                  This will erase all completed levels, XP, and question mastery history.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      SoundManager.getInstance().playUiClick();
                      setShowResetConfirm(false);
                      onResetProgress();
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-1.5 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
