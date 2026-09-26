import React from 'react';
import { CombatStats, PlayerStats } from '../../types/game';
import { Shield, Heart, Zap, Pause, Activity, Eye, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { CombatAIDebugSnapshot } from '../../game/ai/CombatDirector';
import { ViewportManager } from '../../game/systems/ViewportManager';
import { SoundManager } from '../../audio/SoundManager';

interface RealTimeCombatHUDProps {
  heroStats: PlayerStats;
  monsterName: string;
  monsterHp: number;
  monsterMaxHp: number;
  radoxomsAvailable: number;
  totalRadoxoms: number;
  combatStats: CombatStats;
  activeSkill: string;
  heroStamina?: number;
  heroMaxStamina?: number;
  monsterDodgeCharges?: number;
  monsterMaxDodgeCharges?: number;
  debugSnapshot?: CombatAIDebugSnapshot | null;
  onToggleAIDebug?: () => void;
  onPause?: () => void;
  isHeroStatic?: boolean;
  monsterDefenseState?: 'NEUTRAL' | 'GUARDING' | 'ADAPTIVE' | 'ENRAGED' | 'STAGGERED';
  monsterPoise?: number;
  monsterMaxPoise?: number;
  ultimateCharge?: number;
  isUltimateReady?: boolean;
  ultimateName?: string;
  onTriggerUltimate?: () => void;
}

export const RealTimeCombatHUD: React.FC<RealTimeCombatHUDProps> = ({
  heroStats,
  monsterName,
  monsterHp,
  monsterMaxHp,
  radoxomsAvailable,
  totalRadoxoms,
  combatStats,
  activeSkill,
  heroStamina = 100,
  heroMaxStamina = 100,
  monsterDodgeCharges = 1,
  monsterMaxDodgeCharges = 1,
  debugSnapshot = null,
  onToggleAIDebug,
  onPause,
  isHeroStatic = false,
  monsterDefenseState = 'NEUTRAL',
  monsterPoise = 100,
  monsterMaxPoise = 100,
  ultimateCharge = 0,
  isUltimateReady = false,
  ultimateName = 'Zero-G Shatter',
  onTriggerUltimate,
}) => {
  const hpRatio = Math.max(0, Math.min(1, heroStats.currentHp / heroStats.maxHp));
  const shieldRatio = Math.max(0, Math.min(1, heroStats.currentShield / heroStats.maxShield));
  const monsterHpRatio = Math.max(0, Math.min(1, monsterHp / monsterMaxHp));
  const staminaRatio = Math.max(0, Math.min(1, heroStamina / heroMaxStamina));

  const isFullscreen = ViewportManager.getInstance().isFullscreen();

  const handleToggleFullscreen = async () => {
    SoundManager.getInstance().playUiClick();
    await ViewportManager.getInstance().toggleFullscreen();
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-2 sm:p-3 select-none animate-fadeIn"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingLeft: 'max(0.6rem, env(safe-area-inset-left, 0.6rem))',
        paddingRight: 'max(0.6rem, env(safe-area-inset-right, 0.6rem))',
      }}
    >
      {/* ========================================================================= */}
      {/* TOP HUD BAR: HERO (LEFT) • MONSTER (TOP-CENTER) • RADOXOM & PAUSE (RIGHT) */}
      {/* ========================================================================= */}
      <div className="w-full flex items-start justify-between gap-1.5 sm:gap-3">
        {/* 1. TOP-LEFT: COMPACT HERO VITALITY PLATE */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-sky-500/40 rounded-xl p-1.5 sm:p-2 shadow-lg min-w-[130px] max-w-[190px] sm:min-w-[200px] pointer-events-auto">
          {/* Header row: Skill & Level */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[9.5px] sm:text-[11px] font-rpg font-black text-sky-300 truncate">
              {activeSkill}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800 shrink-0">
              Lv.{heroStats.level}
            </span>
          </div>

          {/* Compact HP Bar */}
          <div className="space-y-0.5 mb-1">
            <div className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-bold text-emerald-400 font-mono">
              <span className="flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                <span>HP</span>
              </span>
              <span>
                {heroStats.currentHp}/{heroStats.maxHp}
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-emerald-500/30">
              <div
                className={`h-full transition-all duration-300 rounded-full shadow-[0_0_8px_#22c55e] ${
                  hpRatio < 0.25
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${hpRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Compact Shield Bar */}
          <div className="space-y-0.5 mb-0.5">
            <div className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-bold text-cyan-300 font-mono">
              <span className="flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 text-cyan-400" />
                <span>SHIELD</span>
              </span>
              <span>
                {heroStats.currentShield}/{heroStats.maxShield}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300 rounded-full shadow-[0_0_6px_#38bdf8]"
                style={{ width: `${shieldRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Micro Stamina Bar */}
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30 mb-1">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                staminaRatio < 0.25 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-yellow-300'
              }`}
              style={{ width: `${staminaRatio * 100}%` }}
              title={`Stamina: ${Math.round(heroStamina)}/${heroMaxStamina}`}
            />
          </div>

          {/* Micro Ultimate Energy Bar */}
          <div className="space-y-0.5 pt-0.5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-bold font-mono">
              <span className="flex items-center gap-0.5 text-amber-400">
                <Zap className="w-2 h-2 fill-amber-400 text-amber-400" />
                <span>ULT</span>
              </span>
              <span className={isUltimateReady ? 'text-amber-300 font-black animate-pulse' : 'text-slate-400'}>
                {isUltimateReady ? 'READY!' : `${Math.round(ultimateCharge)}%`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/40">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isUltimateReady
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse'
                    : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                }`}
                style={{ width: `${Math.min(100, ultimateCharge)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. TOP-CENTER: COMPACT MONSTER THREAT BAR */}
        <div className="flex flex-col items-center pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-rose-500/40 rounded-xl px-2.5 py-1.5 shadow-lg min-w-[140px] max-w-[220px]">
          <div className="flex items-center justify-between w-full gap-2 mb-0.5">
            <span className="text-[10px] sm:text-xs font-rpg font-black text-rose-300 truncate">
              {monsterName}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {Array.from({ length: monsterMaxDodgeCharges }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full border transition-all flex items-center justify-center text-[6px] ${
                    i < monsterDodgeCharges
                      ? 'bg-sky-400 border-sky-200 text-sky-950 shadow-[0_0_5px_#38bdf8]'
                      : 'bg-slate-950 border-slate-800 text-transparent opacity-30'
                  }`}
                  title="Monster Evasion Charge"
                >
                  ⚡
                </div>
              ))}
            </div>
          </div>

          {/* Compact Monster HP Bar */}
          <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-rose-500/30">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 transition-all duration-300 rounded-full shadow-[0_0_8px_#ef4444]"
              style={{ width: `${monsterHpRatio * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-full text-[7px] font-mono font-bold mt-0.5 px-0.5">
            <span className="text-rose-400/90">{monsterHp} / {monsterMaxHp} HP</span>
            <span className="text-slate-400">POISE {Math.round(monsterPoise)}</span>
          </div>

          {/* Micro Monster Poise Bar */}
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 mt-0.5">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                monsterDefenseState === 'STAGGERED'
                  ? 'bg-amber-400 animate-pulse'
                  : monsterDefenseState === 'GUARDING'
                  ? 'bg-sky-400 shadow-[0_0_6px_#38bdf8]'
                  : 'bg-indigo-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(1, monsterPoise / monsterMaxPoise)) * 100}%` }}
              title={`Monster Poise: ${Math.round(monsterPoise)}/${monsterMaxPoise}`}
            />
          </div>

          {/* Dynamic Monster Defense State Badge */}
          <div className="mt-1 flex items-center justify-center">
            {monsterDefenseState === 'STAGGERED' && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/25 border border-amber-400/60 text-amber-300 text-[6.5px] sm:text-[7.5px] font-bold font-mono animate-bounce">
                💫 GUARD BROKEN (+50% DMG)
              </span>
            )}
            {monsterDefenseState === 'GUARDING' && (
              <span className="px-1.5 py-0.2 rounded bg-sky-500/25 border border-sky-400/60 text-sky-300 text-[6.5px] sm:text-[7.5px] font-bold font-mono">
                🛡️ SHIELD GUARD (-75% DMG)
              </span>
            )}
            {monsterDefenseState === 'ADAPTIVE' && (
              <span className="px-1.5 py-0.2 rounded bg-slate-700/50 border border-slate-500/60 text-slate-200 text-[6.5px] sm:text-[7.5px] font-bold font-mono">
                ⚡ ADAPTIVE ARMOR (FLANK TO CRIT)
              </span>
            )}
            {monsterDefenseState === 'ENRAGED' && (
              <span className="px-1.5 py-0.2 rounded bg-rose-500/30 border border-rose-400/70 text-rose-300 text-[6.5px] sm:text-[7.5px] font-bold font-mono animate-pulse">
                🔥 BLOODRAGE ENRAGED (+25% RESIST)
              </span>
            )}
            {monsterDefenseState === 'NEUTRAL' && (
              <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[6px] sm:text-[7px] font-mono">
                ⚔️ FRONTAL RESIST ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* 3. TOP-RIGHT: COMPACT RADOXOM BADGE & CONTROLS */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Compact Radoxom Badge: ✦ 3 */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/50 px-2 py-1 rounded-xl shadow-lg flex items-center gap-1 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono font-black text-white">
              ✦ {radoxomsAvailable}
            </span>
            <span className="text-[8.5px] font-mono text-slate-400">/{totalRadoxoms}</span>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer shadow-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Pause Button */}
          {onPause && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onPause();
              }}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer shadow-md"
              title="Pause Game"
              aria-label="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}

          {/* AI Debug Toggle (Diagnostic) */}
          {onToggleAIDebug && (
            <button
              onClick={onToggleAIDebug}
              className={`hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-lg text-[8.5px] font-mono border transition-all ${
                debugSnapshot
                  ? 'bg-violet-950/80 border-violet-400 text-violet-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <Terminal className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Live AI Debug Overlay Diagnostic HUD (When Active) */}
      {debugSnapshot && (
        <div className="absolute top-16 right-3 sm:right-6 bg-slate-950/90 backdrop-blur-lg border border-violet-500/50 p-2.5 rounded-xl shadow-2xl w-56 pointer-events-auto text-[9.5px] font-mono text-slate-300 space-y-1 z-50">
          <div className="flex items-center justify-between border-b border-violet-500/30 pb-1 text-violet-300 font-bold">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-violet-400" />
              AI DIRECTOR
            </span>
            <span className="text-[8.5px] bg-violet-900/60 px-1 rounded text-violet-200">
              P{debugSnapshot.phase}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-0.5 text-[9px]">
            <span className="text-slate-400">State:</span>
            <span className="text-amber-300 font-bold">{debugSnapshot.state.toUpperCase()}</span>
            <span className="text-slate-400">Dist:</span>
            <span className="text-emerald-300">{debugSnapshot.targetDistance}px</span>
            <span className="text-slate-400">Guard:</span>
            <span className={debugSnapshot.isGuarding ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
              {debugSnapshot.isGuarding ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      )}

      {/* DYNAMIC MOMENTUM & ANTI-STATIC STANCE ALERT */}
      <div className="w-full flex justify-center pb-1 pointer-events-none">
        {isHeroStatic ? (
          <div className="bg-rose-950/90 border border-rose-500/80 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.45)] flex items-center gap-1.5 animate-pulse">
            <span className="text-xs sm:text-sm">⚠️</span>
            <span className="text-[8.5px] sm:text-[11px] font-rpg font-black text-rose-200 tracking-wide">
              STATIC STANCE: ATTACKS LOCKED! MOVE OR JUMP TO STRIKE!
            </span>
          </div>
        ) : (
          <div className="bg-slate-950/80 border border-emerald-500/40 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)] flex items-center gap-1.5">
            <span className="text-emerald-400 text-xs">⚡</span>
            <span className="text-[8px] sm:text-[9.5px] font-rpg font-bold text-emerald-300 tracking-wide">
              MOMENTUM ACTIVE: SPRINT, FLANK & JUMP FOR CRITICAL STRIKES
            </span>
          </div>
        )}
      </div>

      {/* Bottom Desktop Combat Hints (Hidden on Mobile) */}
      <div className="w-full hidden md:flex items-center justify-center pb-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-950/70 border border-slate-800 text-[9.5px] text-slate-400 font-mono">
          <span>Accuracy: <strong className="text-sky-300">{combatStats.accuracy}%</strong></span>
          <span>•</span>
          <span>Dodges: <strong className="text-cyan-300">{combatStats.attacksDodged}</strong></span>
          <span>•</span>
          <span>Dmg: <strong className="text-amber-300">{combatStats.damageDealt}</strong></span>
          <span>•</span>
          <span>Ult: <strong className="text-amber-400">{Math.round(ultimateCharge)}% [R/Q]</strong></span>
        </div>
      </div>

      {/* Floating Ultimate Skill Activation Button (When 100% Charged) */}
      {isUltimateReady && (
        <div className="fixed bottom-14 right-3 sm:bottom-16 sm:right-6 z-50 pointer-events-auto animate-bounce">
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onTriggerUltimate?.();
            }}
            className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-rpg font-black text-xs sm:text-sm shadow-[0_0_30px_rgba(245,158,11,0.85)] border-2 border-white flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 text-slate-950 animate-pulse" />
            <span className="tracking-wider">[R] {ultimateName.toUpperCase()}!</span>
          </button>
        </div>
      )}
    </div>
  );
};
