import React, { useState, useEffect, useRef } from 'react';
import { InputManager } from '../../game/systems/InputManager';
import { ArrowUp, Zap, Wind, Crosshair, Sparkles, Hand } from 'lucide-react';

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
  attackCooldownPercent = 0,
  dodgeCooldownPercent = 0,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState<boolean>(false);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  // Attack button drag aim state
  const [attackDragPos, setAttackDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAttackDragging, setIsAttackDragging] = useState<boolean>(false);

  // Active press states for visual feedback
  const [isAttackPressed, setIsAttackPressed] = useState<boolean>(false);
  const [isDodgePressed, setIsDodgePressed] = useState<boolean>(false);
  const [isJumpPressed, setIsJumpPressed] = useState<boolean>(false);

  const joystickCenterRef = useRef<{ x: number; y: number } | null>(null);
  const joystickTouchIdRef = useRef<number | null>(null);
  const joystickRadius = 48; // Max radius for responsive movement

  const attackCenterRef = useRef<{ x: number; y: number } | null>(null);
  const attackTouchIdRef = useRef<number | null>(null);
  const attackRadius = 60;

  const inputManager = InputManager.getInstance();

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

  /* ------------------- VIRTUAL JOYSTICK MULTI-TOUCH HANDLERS ------------------- */
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

    // Normalized vector (-1 to 1) with responsive deadzone
    const normDist = clampedDist / joystickRadius;
    if (normDist < 0.12) {
      inputManager.setVirtualJoystick(0, 0);
    } else {
      const normalizedDx = nubX / joystickRadius;
      const normalizedDy = nubY / joystickRadius;
      inputManager.setVirtualJoystick(normalizedDx, normalizedDy);

      // Auto-sprint when thumbstick is pushed to outer perimeter
      if (normDist > 0.88 && !isSprinting) {
        inputManager.setVirtualAction('sprint', true);
      } else if (!isSprinting) {
        inputManager.setVirtualAction('sprint', false);
      }
    }
  };

  const resetJoystick = () => {
    joystickCenterRef.current = null;
    joystickTouchIdRef.current = null;
    setIsJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    inputManager.setVirtualJoystick(0, 0);
    if (!isSprinting) {
      inputManager.setVirtualAction('sprint', false);
    }
  };

  /* ------------------- ATTACK BUTTON & DRAG AIM HANDLERS ------------------- */
  const handleAttackTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    if (!touch) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    attackCenterRef.current = { x: centerX, y: centerY };
    attackTouchIdRef.current = touch.identifier;
    setIsAttackPressed(true);
    triggerHaptic(18);

    if (isCombat) {
      setIsAttackDragging(true);
    }
  };

  const handleAttackTouchMove = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!attackCenterRef.current || attackTouchIdRef.current === null) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === attackTouchIdRef.current) {
        const rawDx = touch.clientX - attackCenterRef.current.x;
        const rawDy = touch.clientY - attackCenterRef.current.y;
        const dist = Math.hypot(rawDx, rawDy);

        const clampedDist = Math.min(dist, attackRadius);
        const angle = Math.atan2(rawDy, rawDx);
        setAttackDragPos({
          x: Math.cos(angle) * clampedDist,
          y: Math.sin(angle) * clampedDist,
        });

        // Pass mobile drag aim vector to InputManager
        if (dist > 15) {
          inputManager.setMobileAimVector(rawDx, rawDy);
        }
        break;
      }
    }
  };

  const handleAttackTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === attackTouchIdRef.current) {
        triggerHaptic(22);
        // Trigger attack on release
        inputManager.setVirtualAction('attack', true);
        setTimeout(() => {
          inputManager.setVirtualAction('attack', false);
          inputManager.clearMobileAim();
        }, 50);

        attackCenterRef.current = null;
        attackTouchIdRef.current = null;
        setIsAttackPressed(false);
        setIsAttackDragging(false);
        setAttackDragPos({ x: 0, y: 0 });
        break;
      }
    }
  };

  // Toggle Sprint
  const handleToggleSprint = () => {
    triggerHaptic(15);
    const nextSprint = !isSprinting;
    setIsSprinting(nextSprint);
    inputManager.setVirtualAction('sprint', nextSprint);
  };

  if (!isTouchDevice) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 select-none flex flex-col justify-end p-2 sm:p-4 md:p-6"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
        touchAction: 'none',
      }}
    >
      <div className="w-full flex items-end justify-between">
        {/* ========================================================= */}
        {/* BOTTOM-LEFT: VIRTUAL ANALOG JOYSTICK                      */}
        {/* ========================================================= */}
        <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
          {/* Virtual Joystick Base */}
          <div
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
            className={`relative w-26 h-26 sm:w-30 sm:h-30 rounded-full border-2 transition-all duration-150 flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer ${
              isJoystickActive
                ? 'bg-slate-950/80 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.45)]'
                : 'bg-slate-950/50 border-slate-700/60 hover:border-slate-500/60'
            }`}
          >
            {/* Guide Rings */}
            <div className="absolute w-18 h-18 sm:w-20 sm:h-20 rounded-full border border-dashed border-cyan-500/20 pointer-events-none" />
            <div className="absolute w-8 h-8 rounded-full border border-cyan-400/20 pointer-events-none" />

            {/* Direction Compass Marks */}
            <div className="absolute top-1 text-[7px] font-mono font-bold text-cyan-400/60">▲</div>
            <div className="absolute bottom-1 text-[7px] font-mono font-bold text-cyan-400/60">▼</div>
            <div className="absolute left-1 text-[7px] font-mono font-bold text-cyan-400/60">◄</div>
            <div className="absolute right-1 text-[7px] font-mono font-bold text-cyan-400/60">►</div>

            {/* Draggable Thumbstick Nub */}
            <div
              className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 flex items-center justify-center transition-transform duration-75 shadow-xl ${
                isJoystickActive
                  ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 border-white shadow-[0_0_15px_rgba(34,211,238,0.8)] scale-105'
                  : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-500/80 shadow-inner'
              }`}
              style={{
                transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              }}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${isJoystickActive ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-slate-500'}`} />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM-RIGHT: COMBAT ACTION CLUSTER (CROSS / DIAMOND)     */}
        {/* ========================================================= */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Contextual Interact Button (Pray, Examine, Open Gate) */}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 font-bold font-rpg text-[11px] shadow-[0_0_20px_rgba(245,158,11,0.7)] active:scale-95 animate-pulse cursor-pointer mb-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{nearShrine ? 'PRAY [E]' : 'OPEN GATE [E]'}</span>
            </button>
          )}

          {/* Diamond / Arc Action Cluster */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            {/* 1. TOP: PRIMARY ATTACK / FIRE RADOXOM */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <button
                onTouchStart={handleAttackTouchStart}
                onTouchMove={handleAttackTouchMove}
                onTouchEnd={handleAttackTouchEnd}
                onTouchCancel={handleAttackTouchEnd}
                onMouseDown={() => {
                  triggerHaptic(20);
                  inputManager.setVirtualAction('attack', true);
                }}
                onMouseUp={() => inputManager.setVirtualAction('attack', false)}
                className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer backdrop-blur-md active:scale-95 ${
                  isAttackPressed
                    ? 'scale-105 brightness-125 shadow-[0_0_25px_rgba(245,158,11,0.9)]'
                    : ''
                } ${
                  isCombat
                    ? radoxomsAvailable > 0
                      ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-400 border-white text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                      : 'bg-slate-900/80 border-slate-700 text-slate-500 opacity-60 shadow-none'
                    : 'bg-gradient-to-tr from-sky-500 via-indigo-600 to-cyan-400 border-sky-300 text-white shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                }`}
                style={{
                  transform: isAttackDragging
                    ? `translate(${attackDragPos.x * 0.4}px, ${attackDragPos.y * 0.4}px)`
                    : undefined,
                }}
                aria-label={isCombat ? 'Fire Radoxom' : 'Attack'}
              >
                {/* Ammo Count Pill */}
                {isCombat && (
                  <div className="absolute -top-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black font-mono text-[9px] px-1.5 py-0.2 rounded-full border border-white shadow-sm flex items-center gap-0.5">
                    <span>⚡</span>
                    <span>{radoxomsAvailable}</span>
                  </div>
                )}
                <Crosshair className="w-5 h-5 drop-shadow" />
                <span className="text-[8px] font-black font-rpg tracking-wider">
                  {isCombat ? 'FIRE' : 'ATTACK'}
                </span>
              </button>
            </div>

            {/* 2. LEFT: TACTICAL DODGE ROLL */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  triggerHaptic(18);
                  setIsDodgePressed(true);
                  inputManager.setVirtualAction('dodge', true);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setIsDodgePressed(false);
                  inputManager.setVirtualAction('dodge', false);
                }}
                onMouseDown={() => {
                  triggerHaptic(18);
                  setIsDodgePressed(true);
                  inputManager.setVirtualAction('dodge', true);
                }}
                onMouseUp={() => {
                  setIsDodgePressed(false);
                  inputManager.setVirtualAction('dodge', false);
                }}
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/85 border-2 border-cyan-400/80 text-cyan-300 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.25)] transition-all active:scale-90 backdrop-blur-md cursor-pointer ${
                  isDodgePressed ? 'bg-cyan-500 text-slate-950 scale-95 shadow-[0_0_20px_#38bdf8]' : ''
                }`}
                aria-label="Tactical Dodge"
              >
                <Wind className="w-4 h-4" />
                <span className="text-[7.5px] font-black font-mono tracking-tighter">DODGE</span>
              </button>
            </div>

            {/* 3. RIGHT: JUMP */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  triggerHaptic(18);
                  setIsJumpPressed(true);
                  inputManager.setVirtualAction('jump', true);
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  setIsJumpPressed(false);
                  inputManager.setVirtualAction('jump', false);
                }}
                onMouseDown={() => {
                  triggerHaptic(18);
                  setIsJumpPressed(true);
                  inputManager.setVirtualAction('jump', true);
                }}
                onMouseUp={() => {
                  setIsJumpPressed(false);
                  inputManager.setVirtualAction('jump', false);
                }}
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-slate-900/85 border-2 border-emerald-400/80 text-emerald-300 flex flex-col items-center justify-center shadow-[0_0_14px_rgba(52,211,153,0.25)] transition-all active:scale-90 backdrop-blur-md cursor-pointer ${
                  isJumpPressed ? 'bg-emerald-500 text-slate-950 scale-95 shadow-[0_0_20px_#22c55e]' : ''
                }`}
                aria-label="Jump"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="text-[7.5px] font-black font-mono tracking-tighter">JUMP</span>
              </button>
            </div>

            {/* 4. BOTTOM: SPRINT (HOLD / TOGGLE) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleToggleSprint();
                }}
                onClick={handleToggleSprint}
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg transition-all active:scale-90 backdrop-blur-md cursor-pointer ${
                  isSprinting
                    ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.7)] scale-95'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-amber-400/60'
                }`}
                aria-label="Sprint"
              >
                <Zap className={`w-4 h-4 ${isSprinting ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                <span className="text-[7.5px] font-black font-mono tracking-tighter">
                  {isSprinting ? 'RUN ON' : 'SPRINT'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};