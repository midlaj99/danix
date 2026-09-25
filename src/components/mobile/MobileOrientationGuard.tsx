import React, { useState, useEffect } from 'react';
import { ViewportManager } from '../../game/systems/ViewportManager';
import { SoundManager } from '../../audio/SoundManager';
import { Smartphone, Play, Maximize2, RotateCw, Sparkles } from 'lucide-react';

interface MobileOrientationGuardProps {
  onEnterGame?: () => void;
}

export const MobileOrientationGuard: React.FC<MobileOrientationGuardProps> = ({ onEnterGame }) => {
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    // If not mobile/tablet, user is immediately inside game
    if (typeof window === 'undefined') return true;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.innerWidth <= 800;
    return !isCoarse && !isSmall;
  });

  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [dismissedHint, setDismissedHint] = useState<boolean>(false);

  useEffect(() => {
    const handleViewportChange = () => {
      const state = ViewportManager.getInstance().getState();
      setIsPortrait(state.orientation === 'portrait');
      setIsMobile(state.isMobile || state.isTablet);
    };

    handleViewportChange();
    const unsub = ViewportManager.getInstance().subscribe(handleViewportChange);
    return unsub;
  }, []);

  const handleStartGame = async () => {
    SoundManager.getInstance().init();
    SoundManager.getInstance().playUiClick();

    // Trigger fullscreen request within user gesture
    await ViewportManager.getInstance().requestFullscreen();
    ViewportManager.getInstance().handleResize();

    setHasEntered(true);
    onEnterGame?.();
  };

  // If already entered and landscape, render nothing or subtle rotate hint if in portrait
  if (hasEntered) {
    if (isMobile && isPortrait && !dismissedHint) {
      return (
        <div
          onClick={() => setDismissedHint(true)}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-auto cursor-pointer animate-fadeIn"
          title="Tap to dismiss"
        >
          <div className="bg-slate-950/95 border border-amber-400/80 text-amber-300 text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-transform">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
            <span>Landscape Recommended • Tap to dismiss</span>
          </div>
        </div>
      );
    }
    return null;
  }

  // Mobile First-Launch Clean Start Screen
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/50 via-slate-950 to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center">
        {/* Crest */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] mb-3 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center font-rpg font-black text-2xl text-amber-400">
            Ω
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-wider mb-1">
          DANIX
        </h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-6">
          Real Action RPG • Mobile Edition
        </p>

        {/* Primary Action: Enter Game (Requests Fullscreen & Audio) */}
        <button
          onClick={handleStartGame}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-rpg font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] active:scale-95 transition cursor-pointer mb-3"
        >
          <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>ENTER GAME</span>
        </button>

        {/* Hint banner */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-2">
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span>Landscape orientation recommended</span>
        </div>
      </div>
    </div>
  );
};
