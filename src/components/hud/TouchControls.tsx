import React, { useState, useEffect, useRef } from 'react';
import { InputManager } from '../../game/systems/InputManager';
import { ArrowUp, Zap, Wind, Crosshair, Sparkles, Hand } from 'lucide-react';

interface TouchControlsProps {
  isCombat: boolean;
  radoxomsAvailable: number;
  nearShrine: boolean;
  nearPuzzleGate: boolean;
  onInteract?: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  isCombat,
  radoxomsAvailable,
  nearShrine,
  nearPuzzleGate,
  onInteract,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  const joystickCenterRef = useRef<{ x: number; y: number } | null>(null);
  const joystickTouchIdRef = useRef<number | null>(null);
  const joystickRadius = 50; // pixels max radius for crisp response

  const inputManager = InputManager.getInstance();

  // Haptic feedback trigger for tactile touch response
  const triggerHaptic = (ms: number = 15) => {
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(ms);
      }
    } catch {
      // Ignore if not supported
    }
  };

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window ||
        (navigator && navigator.maxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth <= 1024;
      setIsTouchDevice(hasTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Virtual Joystick Handlers
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    if (!touch) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    joystickCenterRef.current = { x: centerX, y: centerY };
    joystickTouchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    triggerHaptic(10);

    updateJoystickPosition(touch.clientX, touch.clientY, centerX, centerY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!joystickCenterRef.current || joystickTouchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        updateJoystickPosition(
          touch.clientX,
          touch.clientY,
          joystickCenterRef.current.x,
          joystickCenterRef.current.y
        );
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        resetJoystick();
        break;
      }
    }
  };

  const updateJoystickPosition = (
    touchX: number,
    touchY: number,
    centerX: number,
    centerY: number
  ) => {
    const rawDx = touchX - centerX;
    const rawDy = touchY - centerY;
    const distance = Math.hypot(rawDx, rawDy);

    const clampedDist = Math.min(distance, joystickRadius);
    const angle = Math.atan2(rawDy, rawDx);

    const nubX = Math.cos(angle) * clampedDist;
    const nubY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: nubX, y: nubY });

    // Normalized vector (-1 to 1) with small deadzone for precision
    const normDist = clampedDist / joystickRadius;
    if (normDist < 0.12) {
      inputManager.setVirtualJoystick(0, 0);
    } else {
      const normalizedDx = (nubX / joystickRadius);
      const normalizedDy = (nubY / joystickRadius);
      inputManager.setVirtualJoystick(normalizedDx, normalizedDy);
    }
  };

  const resetJoystick = () => {
    joystickCenterRef.current = null;
    joystickTouchIdRef.current = null;
    setIsJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    inputManager.setVirtualJoystick(0, 0);
  };

  // Toggle or Hold Sprint
  const handleToggleSprint = () => {
    triggerHaptic(18);
    const nextSprint = !isSprinting;
    setIsSprinting(nextSprint);
    inputManager.setVirtualAction('sprint', nextSprint);
  };

  if (!isTouchDevice) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-end p-3 sm:p-5"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        paddingLeft: 'max(1.25rem, env(safe-area-inset-left, 1.25rem))',
        paddingRight: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
        touchAction: 'none',
      }}
    >
      <div className="w-full flex items-end justify-between">
        {/* ========================================================= */}
        {/* LEFT SIDE: VIRTUAL ANALOG JOYSTICK + SPRINT BUTTON        */}
        {/* ========================================================= */}
        <div className="flex flex-col items-start gap-2 pointer-events-auto">
          {/* Quick Sprint Toggle Pill above Joystick */}
          <button
            onTouchStart={(e) => {
              e.stopPropagation();
              handleToggleSprint();
            }}
            onClick={handleToggleSprint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono font-bold tracking-wider shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
              isSprinting
                ? 'bg-amber-500/90 border-amber-300 text-slate-950 shadow-[0_0_16px_rgba(245,158,11,0.6)]'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-amber-500/50'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isSprinting ? 'text-slate-950 fill-slate-950' : 'text-amber-400'}`} />
            <span>SPRINT {isSprinting ? 'ON' : 'OFF'}</span>
          </button>

          {/* Virtual Joystick Base */}
          <div
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 transition-all duration-150 flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer ${
              isJoystickActive
                ? 'bg-slate-950/85 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.45)]'
                : 'bg-slate-950/60 border-slate-700/70 hover:border-slate-500/60'
            }`}
          >
            {/* Guide Rings */}
            <div className="absolute w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-dashed border-cyan-500/25 pointer-events-none" />
            <div className="absolute w-10 h-10 rounded-full border border-cyan-400/20 pointer-events-none" />

            {/* Direction Compass Marks */}
            <div className="absolute top-1.5 text-[8px] font-mono font-bold text-cyan-400/70">▲</div>
            <div className="absolute bottom-1.5 text-[8px] font-mono font-bold text-cyan-400/70">▼</div>
            <div className="absolute left-1.5 text-[8px] font-mono font-bold text-cyan-400/70">◄</div>
            <div className="absolute right-1.5 text-[8px] font-mono font-bold text-cyan-400/70">►</div>

            {/* Draggable Thumbstick Nub */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center transition-transform duration-75 shadow-xl ${
                isJoystickActive
                  ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 border-white shadow-[0_0_20px_rgba(34,211,238,0.9)] scale-105'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-500/80 shadow-inner'
              }`}
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              }}
            >
              <div className={`w-4 h-4 rounded-full ${isJoystickActive ? 'bg-white shadow-[0_0_10px_#ffffff]' : 'bg-slate-600'}`} />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: MODERN ACTION CLUSTER (DIAMOND / ARC)        */}
        {/* ========================================================= */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          {/* Top Row: Contextual Interact Button (Pray, Examine, Open Gate) */}
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
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 font-bold font-rpg text-xs shadow-[0_0_25px_rgba(245,158,11,0.8)] active:scale-95 animate-pulse cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{nearShrine ? 'PRAY AT SHRINE [E]' : 'OPEN GATE [E]'}</span>
            </button>
          )}

          {/* Action Buttons Grid */}
          <div className="relative flex items-center gap-3">
            {/* TACTICAL DODGE ROLL BUTTON */}
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                triggerHaptic(18);
                inputManager.setVirtualAction('dodge', true);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                inputManager.setVirtualAction('dodge', false);
              }}
              onMouseDown={() => {
                triggerHaptic(18);
                inputManager.setVirtualAction('dodge', true);
              }}
              onMouseUp={() => inputManager.setVirtualAction('dodge', false)}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-cyan-400/80 text-cyan-300 flex flex-col items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.3)] active:scale-90 active:bg-cyan-500 active:text-slate-950 transition-all backdrop-blur-md cursor-pointer"
              aria-label="Tactical Dodge Roll"
            >
              <Wind className="w-5 h-5" />
              <span className="text-[8px] font-black font-mono tracking-tighter">DODGE</span>
            </button>

            {/* JUMP BUTTON */}
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                triggerHaptic(18);
                inputManager.setVirtualAction('jump', true);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                inputManager.setVirtualAction('jump', false);
              }}
              onMouseDown={() => {
                triggerHaptic(18);
                inputManager.setVirtualAction('jump', true);
              }}
              onMouseUp={() => inputManager.setVirtualAction('jump', false)}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-2 border-emerald-400/80 text-emerald-300 flex flex-col items-center justify-center shadow-[0_0_18px_rgba(52,211,153,0.3)] active:scale-90 active:bg-emerald-500 active:text-slate-950 transition-all backdrop-blur-md cursor-pointer"
              aria-label="Jump"
            >
              <ArrowUp className="w-5 h-5" />
              <span className="text-[8px] font-black font-mono tracking-tighter">JUMP</span>
            </button>

            {/* PRIMARY ATTACK / RADOXOM FIRE BUTTON */}
            <button
              onTouchStart={(e) => {
                e.stopPropagation();
                triggerHaptic(25);
                inputManager.setVirtualAction('attack', true);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                inputManager.setVirtualAction('attack', false);
              }}
              onMouseDown={() => {
                triggerHaptic(25);
                inputManager.setVirtualAction('attack', true);
              }}
              onMouseUp={() => inputManager.setVirtualAction('attack', false)}
              className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-3xl border-3 flex flex-col items-center justify-center shadow-2xl transition-all active:scale-90 active:brightness-125 backdrop-blur-md cursor-pointer ${
                isCombat
                  ? radoxomsAvailable > 0
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 border-white text-white shadow-[0_0_35px_rgba(244,63,94,0.7)]'
                    : 'bg-slate-900/90 border-slate-700 text-slate-500 opacity-60 shadow-none'
                  : 'bg-gradient-to-tr from-sky-500 via-indigo-600 to-cyan-400 border-sky-300 text-white shadow-[0_0_30px_rgba(56,189,248,0.6)]'
              }`}
              aria-label={isCombat ? 'Fire Radoxom' : 'Attack'}
            >
              {/* Outer Energy Pulse Ring */}
              {isCombat && radoxomsAvailable > 0 && (
                <div className="absolute inset-0 rounded-3xl border-2 border-amber-300 animate-ping opacity-30 pointer-events-none" />
              )}

              <Crosshair className="w-7 h-7 drop-shadow-md animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-black font-rpg tracking-wider drop-shadow">
                {isCombat ? 'FIRE' : 'STRIKE'}
              </span>

              {/* Ammo Counter Badge in Combat */}
              {isCombat && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black font-mono text-[10px] px-2 py-0.5 rounded-full border border-white shadow-[0_0_10px_#facc15] flex items-center gap-0.5">
                  <span>⚡</span>
                  <span>{radoxomsAvailable}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};