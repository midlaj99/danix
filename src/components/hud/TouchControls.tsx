import React, { useState, useEffect, useRef } from 'react';
import { InputManager } from '../../game/systems/InputManager';
import { ViewportManager } from '../../game/systems/ViewportManager';
import { SoundManager } from '../../audio/SoundManager';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Wind, Crosshair, Sparkles } from 'lucide-react';

interface TouchControlsProps {
  isCombat: boolean;
  radoxomsAvailable: number;
  nearShrine: boolean;
  nearPuzzleGate: boolean;
  onInteract?: () => void;
  attackCooldownPercent?: number;
  dodgeCooldownPercent?: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  isCombat,
  radoxomsAvailable,
  nearShrine,
  nearPuzzleGate,
  onInteract,
  dodgeCooldownPercent = 0,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [controlScale, setControlScale] = useState<number>(1.0);

  // Active press states for physical tactile feedback (scale 0.94, glow increase)
  const [pressedLeft, setPressedLeft] = useState<boolean>(false);
  const [pressedRight, setPressedRight] = useState<boolean>(false);
  const [pressedUp, setPressedUp] = useState<boolean>(false);
  const [pressedDown, setPressedDown] = useState<boolean>(false);
  const [pressedJump, setPressedJump] = useState<boolean>(false);
  const [pressedFire, setPressedFire] = useState<boolean>(false);
  const [pressedDodge, setPressedDodge] = useState<boolean>(false);

  // Aiming pad drag state
  const [isAiming, setIsAiming] = useState<boolean>(false);
  const [aimThumbOffset, setAimThumbOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const aimCenterRef = useRef<{ x: number; y: number } | null>(null);
  const aimTouchIdRef = useRef<number | null>(null);
  const fireTouchIdRef = useRef<number | null>(null);

  const inputManager = InputManager.getInstance();

  const triggerHaptic = (ms: number = 14) => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(ms);
      }
    } catch {
      // Ignore if not supported
    }
  };

  useEffect(() => {
    const updateMetrics = () => {
      const state = ViewportManager.getInstance().getState();
      const hasTouch =
        'ontouchstart' in window ||
        (navigator && navigator.maxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 1024;
      setIsTouchDevice(hasTouch);
      setControlScale(state.controlScale);
    };

    updateMetrics();
    const unsub = ViewportManager.getInstance().subscribe(updateMetrics);
    return unsub;
  }, []);

  /* ------------------- MOVEMENT ARROW HANDLERS ------------------- */
  const handleDirTouchStart = (dir: 'left' | 'right' | 'up' | 'down') => (e: React.TouchEvent) => {
    e.stopPropagation();
    triggerHaptic(12);
    SoundManager.getInstance().playUiClick();
    if (dir === 'left') setPressedLeft(true);
    if (dir === 'right') setPressedRight(true);
    if (dir === 'up') setPressedUp(true);
    if (dir === 'down') setPressedDown(true);
    inputManager.setVirtualDirection(dir, true);
  };

  const handleDirTouchEnd = (dir: 'left' | 'right' | 'up' | 'down') => (e: React.TouchEvent) => {
    e.stopPropagation();
    if (dir === 'left') setPressedLeft(false);
    if (dir === 'right') setPressedRight(false);
    if (dir === 'up') setPressedUp(false);
    if (dir === 'down') setPressedDown(false);
    inputManager.setVirtualDirection(dir, false);
  };

  /* ------------------- AIM PAD MULTI-TOUCH HANDLERS ------------------- */
  const handleAimTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    if (!touch) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    aimCenterRef.current = { x: cx, y: cy };
    aimTouchIdRef.current = touch.identifier;
    setIsAiming(true);
    triggerHaptic(12);

    updateAimVector(touch.clientX, touch.clientY, cx, cy);
  };

  const handleAimTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!aimCenterRef.current || aimTouchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === aimTouchIdRef.current) {
        updateAimVector(
          touch.clientX,
          touch.clientY,
          aimCenterRef.current.x,
          aimCenterRef.current.y
        );
        break;
      }
    }
  };

  const handleAimTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === aimTouchIdRef.current) {
        aimCenterRef.current = null;
        aimTouchIdRef.current = null;
        setIsAiming(false);
        setAimThumbOffset({ x: 0, y: 0 });
        inputManager.clearMobileAim();
        break;
      }
    }
  };

  const updateAimVector = (tx: number, ty: number, cx: number, cy: number) => {
    const rawDx = tx - cx;
    const rawDy = ty - cy;
    const dist = Math.hypot(rawDx, rawDy);
    const maxR = 48;
    const clampedDist = Math.min(dist, maxR);
    const angle = Math.atan2(rawDy, rawDx);

    setAimThumbOffset({
      x: Math.cos(angle) * clampedDist,
      y: Math.sin(angle) * clampedDist,
    });

    if (dist > 8) {
      inputManager.setMobileAimVector(rawDx, rawDy);
    }
  };

  /* ------------------- FIRE / ATTACK BUTTON HANDLERS ------------------- */
  const handleFireTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    if (touch) {
      fireTouchIdRef.current = touch.identifier;
    }
    setPressedFire(true);
    triggerHaptic(18);
    // Instant attack execution
    inputManager.setVirtualAction('attack', true);
  };

  const handleFireTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPressedFire(false);
    fireTouchIdRef.current = null;
    inputManager.setVirtualAction('attack', false);
  };

  /* ------------------- JUMP BUTTON HANDLERS ------------------- */
  const handleJumpTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPressedJump(true);
    triggerHaptic(16);
    inputManager.setVirtualAction('jump', true);
  };

  const handleJumpTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPressedJump(false);
    inputManager.setVirtualAction('jump', false);
  };

  /* ------------------- DODGE BUTTON HANDLERS ------------------- */
  const handleDodgeTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPressedDodge(true);
    triggerHaptic(16);
    inputManager.setVirtualAction('dodge', true);
  };

  const handleDodgeTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPressedDodge(false);
    inputManager.setVirtualAction('dodge', false);
  };

  if (!isTouchDevice) {
    return null;
  }

  // Base sizing according to responsive scale
  const arrowBtnSize = Math.round(58 * controlScale);
  const actionBtnSize = Math.round(62 * controlScale);
  const fireBtnSize = Math.round(72 * controlScale);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none flex items-end justify-between"
      style={{
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
        touchAction: 'none',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. BOTTOM-LEFT: PHYSICAL ARROW BUTTON CLUSTER (GAMEPAD CROSS D-PAD)       */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center pointer-events-auto select-none mb-1">
        {/* Up Arrow (Jump / Upward Action) */}
        <div className="flex justify-center mb-1">
          <button
            onTouchStart={handleDirTouchStart('up')}
            onTouchEnd={handleDirTouchEnd('up')}
            onTouchCancel={handleDirTouchEnd('up')}
            className={`rounded-2xl bg-slate-950/80 border-2 transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer backdrop-blur-md ${
              pressedUp
                ? 'scale-95 border-amber-400 bg-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.5)] brightness-125'
                : 'border-slate-700/80 hover:border-slate-500/90 text-slate-300'
            }`}
            style={{ width: `${arrowBtnSize}px`, height: `${arrowBtnSize}px` }}
            aria-label="Move Up / Jump"
          >
            <ArrowUp className={`w-6 h-6 ${pressedUp ? 'text-amber-400' : 'text-slate-200'}`} />
          </button>
        </div>

        {/* Middle Row: Left Arrow, Center Pivot, Right Arrow */}
        <div className="flex items-center gap-1.5">
          {/* Left Arrow */}
          <button
            onTouchStart={handleDirTouchStart('left')}
            onTouchEnd={handleDirTouchEnd('left')}
            onTouchCancel={handleDirTouchEnd('left')}
            className={`rounded-2xl bg-slate-950/80 border-2 transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer backdrop-blur-md ${
              pressedLeft
                ? 'scale-95 border-cyan-400 bg-cyan-500/25 shadow-[0_0_20px_rgba(34,211,238,0.5)] brightness-125'
                : 'border-slate-700/80 hover:border-slate-500/90 text-slate-300'
            }`}
            style={{ width: `${arrowBtnSize}px`, height: `${arrowBtnSize}px` }}
            aria-label="Move Left"
          >
            <ArrowLeft className={`w-6 h-6 ${pressedLeft ? 'text-cyan-400' : 'text-slate-200'}`} />
          </button>

          {/* Center Tactical Pivot Dot */}
          <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
          </div>

          {/* Right Arrow */}
          <button
            onTouchStart={handleDirTouchStart('right')}
            onTouchEnd={handleDirTouchEnd('right')}
            onTouchCancel={handleDirTouchEnd('right')}
            className={`rounded-2xl bg-slate-950/80 border-2 transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer backdrop-blur-md ${
              pressedRight
                ? 'scale-95 border-cyan-400 bg-cyan-500/25 shadow-[0_0_20px_rgba(34,211,238,0.5)] brightness-125'
                : 'border-slate-700/80 hover:border-slate-500/90 text-slate-300'
            }`}
            style={{ width: `${arrowBtnSize}px`, height: `${arrowBtnSize}px` }}
            aria-label="Move Right"
          >
            <ArrowRight className={`w-6 h-6 ${pressedRight ? 'text-cyan-400' : 'text-slate-200'}`} />
          </button>
        </div>

        {/* Down Arrow (Crouch / Drop) */}
        <div className="flex justify-center mt-1">
          <button
            onTouchStart={handleDirTouchStart('down')}
            onTouchEnd={handleDirTouchEnd('down')}
            onTouchCancel={handleDirTouchEnd('down')}
            className={`rounded-2xl bg-slate-950/80 border-2 transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer backdrop-blur-md ${
              pressedDown
                ? 'scale-95 border-slate-400 bg-slate-800 shadow-[0_0_15px_rgba(148,163,184,0.4)] brightness-125'
                : 'border-slate-700/80 hover:border-slate-500/90 text-slate-400'
            }`}
            style={{ width: `${arrowBtnSize}px`, height: `${arrowBtnSize}px` }}
            aria-label="Crouch / Drop Down"
          >
            <ArrowDown className={`w-5 h-5 ${pressedDown ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM-RIGHT: COMBAT ACTION CLUSTER (FIRE, DODGE, JUMP, AIM PAD)       */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-end pointer-events-auto select-none mb-1">
        {/* Contextual Interact Button (Shrine Pray / Puzzle Gate Open) */}
        {(nearShrine || nearPuzzleGate) && (
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              triggerHaptic(25);
              inputManager.setVirtualAction('interact', true);
              onInteract?.();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              inputManager.setVirtualAction('interact', false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 font-bold font-rpg text-xs shadow-[0_0_20px_rgba(245,158,11,0.7)] active:scale-95 animate-pulse cursor-pointer mb-2 mr-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{nearShrine ? 'PRAY [E]' : 'OPEN GATE [E]'}</span>
          </button>
        )}

        {/* Action Buttons Layout */}
        <div className="flex items-end gap-3 sm:gap-4">
          {/* Subtle Right-Side Aim Pad (Appears when touched, clean & non-intrusive) */}
          {isCombat && (
            <div
              onTouchStart={handleAimTouchStart}
              onTouchMove={handleAimTouchMove}
              onTouchEnd={handleAimTouchEnd}
              onTouchCancel={handleAimTouchEnd}
              className={`relative rounded-full border-2 transition-all flex items-center justify-center backdrop-blur-md cursor-pointer ${
                isAiming
                  ? 'bg-slate-950/80 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] opacity-95'
                  : 'bg-slate-950/35 border-slate-700/50 opacity-60 hover:opacity-80'
              }`}
              style={{
                width: `${actionBtnSize + 12}px`,
                height: `${actionBtnSize + 12}px`,
              }}
              title="Aim Pad: Touch & Drag to Aim"
            >
              {/* Subtle Aim Reticle Ring */}
              <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400/30 pointer-events-none" />

              {/* Aiming Indicator Nub */}
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-transform duration-75 shadow-md ${
                  isAiming
                    ? 'bg-cyan-400 border-white text-slate-950 shadow-[0_0_10px_#38bdf8] scale-110'
                    : 'bg-slate-800 border-slate-600 text-slate-400'
                }`}
                style={{
                  transform: `translate(${aimThumbOffset.x}px, ${aimThumbOffset.y}px)`,
                }}
              >
                <Crosshair className="w-3.5 h-3.5" />
              </div>

              {/* Micro Label */}
              <span className="absolute -bottom-4 text-[8.5px] font-mono font-bold text-cyan-300/80 uppercase tracking-tighter">
                AIM
              </span>
            </div>
          )}

          {/* Action Buttons Column: JUMP & DODGE */}
          <div className="flex flex-col items-center gap-2">
            {/* TACTICAL DODGE ROLL */}
            <button
              onTouchStart={handleDodgeTouchStart}
              onTouchEnd={handleDodgeTouchEnd}
              onTouchCancel={handleDodgeTouchEnd}
              className={`relative rounded-2xl border-2 flex flex-col items-center justify-center transition-all shadow-lg active:scale-94 backdrop-blur-md cursor-pointer ${
                pressedDodge
                  ? 'scale-95 bg-cyan-500 border-white text-slate-950 shadow-[0_0_22px_#38bdf8] brightness-125'
                  : 'bg-slate-950/85 border-cyan-500/70 text-cyan-300 hover:border-cyan-400'
              }`}
              style={{
                width: `${actionBtnSize}px`,
                height: `${actionBtnSize}px`,
              }}
              aria-label="Dodge Roll"
            >
              {/* Cooldown feedback overlay */}
              {dodgeCooldownPercent > 0 && (
                <div
                  className="absolute inset-0 bg-slate-950/75 rounded-2xl pointer-events-none flex items-center justify-center font-mono font-bold text-[9px] text-cyan-300"
                  style={{
                    clipPath: `inset(${100 - dodgeCooldownPercent}% 0 0 0)`,
                  }}
                />
              )}
              <Wind className="w-5 h-5" />
              <span className="text-[8.5px] font-black font-rpg tracking-wider mt-0.5">DODGE</span>
            </button>

            {/* DEDICATED JUMP BUTTON */}
            <button
              onTouchStart={handleJumpTouchStart}
              onTouchEnd={handleJumpTouchEnd}
              onTouchCancel={handleJumpTouchEnd}
              className={`rounded-2xl border-2 flex flex-col items-center justify-center transition-all shadow-lg active:scale-94 backdrop-blur-md cursor-pointer ${
                pressedJump
                  ? 'scale-95 bg-emerald-500 border-white text-slate-950 shadow-[0_0_22px_#22c55e] brightness-125'
                  : 'bg-slate-950/85 border-emerald-500/70 text-emerald-300 hover:border-emerald-400'
              }`}
              style={{
                width: `${actionBtnSize}px`,
                height: `${actionBtnSize}px`,
              }}
              aria-label="Jump"
            >
              <ArrowUp className="w-5 h-5" />
              <span className="text-[8.5px] font-black font-rpg tracking-wider mt-0.5">JUMP</span>
            </button>
          </div>

          {/* PRIMARY FIRE / RADOXOM ATTACK BUTTON (LARGE & DISTINCTIVE) */}
          <button
            onTouchStart={handleFireTouchStart}
            onTouchEnd={handleFireTouchEnd}
            onTouchCancel={handleFireTouchEnd}
            className={`relative rounded-3xl border-3 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-94 backdrop-blur-md cursor-pointer ${
              pressedFire
                ? 'scale-95 brightness-130 shadow-[0_0_35px_rgba(245,158,11,1)]'
                : ''
            } ${
              isCombat
                ? radoxomsAvailable > 0
                  ? 'bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-400 border-amber-300 text-white shadow-[0_0_25px_rgba(245,158,11,0.65)]'
                  : 'bg-slate-900/90 border-slate-700 text-slate-500 opacity-60 shadow-none'
                : 'bg-gradient-to-tr from-sky-500 via-indigo-600 to-cyan-400 border-sky-200 text-white shadow-[0_0_25px_rgba(56,189,248,0.55)]'
            }`}
            style={{
              width: `${fireBtnSize}px`,
              height: `${fireBtnSize}px`,
            }}
            aria-label={isCombat ? 'Fire Radoxom' : 'Attack'}
          >
            {/* Floating Ammo Badge */}
            {isCombat && (
              <div className="absolute -top-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black font-mono text-[10px] px-2 py-0.5 rounded-full border border-white shadow-md flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                <span>{radoxomsAvailable}</span>
              </div>
            )}
            <Crosshair className="w-6 h-6 drop-shadow" />
            <span className="text-[10px] font-black font-rpg tracking-wider mt-0.5">
              {isCombat ? 'FIRE' : 'ATTACK'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};