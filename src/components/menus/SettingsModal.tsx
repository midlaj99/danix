import React from 'react';
import { SettingsState } from '../../types/game';
import { SoundManager } from '../../audio/SoundManager';
import { X, Volume2, VolumeX, Gauge, Trash2 } from 'lucide-react';

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md rpg-panel p-6 shadow-2xl border-amber-500/40 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <h2 className="text-lg font-rpg font-bold text-white">SYSTEM SETTINGS</h2>
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onClose();
            }}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Audio Mute */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
              {settings.muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              Master Audio
            </span>
            <button
              onClick={() => {
                const nextMute = !settings.muted;
                SoundManager.getInstance().setMuted(nextMute);
                onUpdateSettings({ muted: nextMute });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-rpg font-bold transition cursor-pointer ${
                settings.muted
                  ? 'bg-rose-950 border border-rose-500 text-rose-300'
                  : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              }`}
            >
              {settings.muted ? 'MUTED' : 'ENABLED'}
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>BGM Synth Volume</span>
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>SFX Impact Volume</span>
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Dialogue Speed */}
          <div className="space-y-2">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-400" /> Aria Dialogue Speed
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
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                  onResetProgress();
                }
              }}
              className="w-full bg-rose-950/40 hover:bg-rose-950 border border-rose-800/60 hover:border-rose-500 text-rose-300 text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reset Game Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
