import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Maximize2, X } from 'lucide-react';
import { SoundManager } from '../../audio/SoundManager';

export const MobileOrientationGuard: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      const hasTouch =
        'ontouchstart' in window ||
        (navigator && navigator.maxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches;
      
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth <= 1024;
      setIsTouch(hasTouch);
      setIsPortrait(portrait);

      // If user rotates back to landscape, reset dismissal so it can guard next time they rotate to portrait
      if (!portrait) {
        setDismissed(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleRequestLandscape = async () => {
    SoundManager.getInstance().playUiClick();
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }

      if ('orientation' in screen && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch(() => {
          // Some browsers restrict orientation lock without user action or PWA mode
        });
      }
    } catch {
      // Graceful fallback if fullscreen is blocked by browser policy
    }
  };

  const handleDismiss = () => {
    SoundManager.getInstance().playUiClick();
    setDismissed(true);
  };

  if (!isTouch || !isPortrait || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl animate-fade-in pointer-events-auto select-none">
      {/* Background Neon Ambient Halo */}
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Dismiss button in corner for dev/bypass */}
      <button
        onClick={handleDismiss}
        className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900/80 border border-slate-800 transition cursor-pointer"
        aria-label="Dismiss orientation prompt"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Animated Phone Rotation Graphic */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Glowing Orbit Rings */}
        <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin-slow flex items-center justify-center" />
        <div className="absolute w-24 h-24 rounded-full border border-sky-400/30" />

        {/* Rotating Smartphone Device Icon */}
        <div className="absolute flex items-center justify-center animate-device-rotate">
          <Smartphone className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]" />
        </div>

        {/* Rotation indicator arrows */}
        <div className="absolute -bottom-2 text-amber-400 font-bold flex items-center gap-1 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-mono shadow-md">
          <RotateCw className="w-3 h-3 animate-spin" />
          <span>90° HORIZONTAL</span>
        </div>
      </div>

      {/* Content Card */}
      <div className="relative max-w-sm text-center space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          ⚔️ ACTION RPG HORIZONTAL MODE
        </div>

        <h2 className="text-xl sm:text-2xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-300 tracking-wide">
          ROTATE DEVICE TO LANDSCAPE
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
          NumPy Kingdom is designed for <strong className="text-cyan-400 font-semibold">horizontal mobile gaming</strong>. Rotate your device horizontally for console-grade controls, wide tactical combat vision, and maximum FPS!
        </p>

        {/* CTA Buttons */}
        <div className="pt-3 flex flex-col gap-2.5 w-full">
          <button
            onClick={handleRequestLandscape}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-rpg font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.5)] active:scale-95 transition-all cursor-pointer border border-cyan-300"
          >
            <Maximize2 className="w-4 h-4" />
            <span>FULLSCREEN & ROTATE</span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2 px-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs font-mono transition cursor-pointer"
          >
            Continue in Portrait Anyway →
          </button>
        </div>
      </div>
    </div>
  );
};
