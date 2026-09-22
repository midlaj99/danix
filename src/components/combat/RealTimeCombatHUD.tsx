import React from 'react';
import { CombatStats, PlayerStats } from '../../types/game';
import { Shield, Heart, Zap, Crosshair, Sparkles, Activity, Eye, Terminal } from 'lucide-react';
import { CombatAIDebugSnapshot } from '../../game/ai/CombatDirector';

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
}) => {
  const hpRatio = Math.max(0, Math.min(1, heroStats.currentHp / heroStats.maxHp));
  const shieldRatio = Math.max(0, Math.min(1, heroStats.currentShield / heroStats.maxShield));
  const monsterHpRatio = Math.max(0, Math.min(1, monsterHp / monsterMaxHp));
  const staminaRatio = Math.max(0, Math.min(1, heroStamina / heroMaxStamina));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none animate-fadeIn"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
      }}
    >
      {/* Top Plates: Hero on Left, Center Controls / Debug, Monster on Right */}
      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 sm:gap-4">
        {/* Left: Hero Vitality & Stamina Plate */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-sky-500/40 rounded-2xl p-2.5 sm:p-4 shadow-[0_0_25px_rgba(56,189,248,0.25)] w-full sm:w-auto sm:min-w-[240px] md:min-w-[300px] pointer-events-auto">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                ⚔️
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  Player Hero
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">{activeSkill}</div>
              </div>
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
              Lvl {heroStats.level}
            </div>
          </div>

          {/* Shield Bar */}
          <div className="space-y-1 mb-1 sm:mb-1.5">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-cyan-300">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                SHIELD
              </span>
              <span className="font-mono">
                {heroStats.currentShield} / {heroStats.maxShield}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300 rounded-full shadow-[0_0_10px_#38bdf8]"
                style={{ width: `${shieldRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Health Bar */}
          <div className="space-y-1 mb-1 sm:mb-1.5">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-emerald-400">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                HEALTH
              </span>
              <span className="font-mono">
                {heroStats.currentHp} / {heroStats.maxHp}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-emerald-500/30">
              <div
                className={`h-full transition-all duration-300 rounded-full shadow-[0_0_10px_#22c55e] ${
                  hpRatio < 0.25
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${hpRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Hero Stamina Bar (Tactical Resource) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-amber-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                STAMINA
              </span>
              <span className="font-mono text-slate-300">
                {Math.round(heroStamina)} / {heroMaxStamina}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-500/30">
              <div
                className={`h-full transition-all duration-150 rounded-full shadow-[0_0_8px_#f59e0b] ${
                  staminaRatio < 0.25
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300'
                }`}
                style={{ width: `${staminaRatio * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: AI Debug Toggle Button */}
        {onToggleAIDebug && (
          <div className="flex justify-center pointer-events-auto">
            <button
              onClick={onToggleAIDebug}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border transition-all ${
                debugSnapshot
                  ? 'bg-violet-950/80 border-violet-400 text-violet-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-slate-950/70 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>AI DEBUG {debugSnapshot ? '[ON]' : '[OFF]'} (`)</span>
            </button>
          </div>
        )}

        {/* Right: Monster Threat Plate */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-rose-500/40 rounded-2xl p-2.5 sm:p-4 shadow-[0_0_25px_rgba(244,63,94,0.25)] w-full sm:w-auto sm:min-w-[240px] md:min-w-[300px] pointer-events-auto text-right">
          <div className="flex items-center justify-between flex-row-reverse mb-1.5 sm:mb-2">
            <div className="flex items-center gap-2.5 flex-row-reverse">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-800 flex items-center justify-center font-bold text-white text-xs shadow-md">
                👾
              </div>
              <div>
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  Enemy Threat
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">{monsterName}</div>
              </div>
            </div>
            <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/30 animate-pulse">
              HOSTILE
            </div>
          </div>

          {/* Monster Health Bar */}
          <div className="space-y-1 mb-1.5">
            <div className="flex items-center justify-between flex-row-reverse text-[10px] sm:text-[11px] font-semibold text-rose-400">
              <span className="flex items-center gap-1 flex-row-reverse">
                <Activity className="w-3 h-3" />
                VITALITY
              </span>
              <span className="font-mono">
                {monsterHp} / {monsterMaxHp}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-rose-500/30">
              <div
                className="h-full bg-gradient-to-l from-rose-600 via-red-500 to-amber-500 transition-all duration-300 rounded-full shadow-[0_0_12px_#ef4444]"
                style={{ width: `${monsterHpRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Monster Dodge Charges Evasion Economy */}
          <div className="flex items-center justify-between flex-row-reverse text-[10px] sm:text-[11px] font-semibold text-sky-400">
            <span className="flex items-center gap-1 flex-row-reverse">
              <span>EVASION CHARGES</span>
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: monsterMaxDodgeCharges }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border transition-all flex items-center justify-center text-[9px] ${
                    i < monsterDodgeCharges
                      ? 'bg-sky-400 border-sky-200 text-sky-950 shadow-[0_0_8px_#38bdf8] scale-105'
                      : 'bg-slate-950 border-slate-700 text-transparent opacity-40'
                  }`}
                >
                  ⚡
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live AI Debug Overlay Diagnostic HUD (When Active) */}
      {debugSnapshot && (
        <div className="absolute top-28 right-4 bg-slate-950/90 backdrop-blur-lg border border-violet-500/50 p-3.5 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] w-72 pointer-events-auto text-xs font-mono text-slate-300 space-y-2 z-50">
          <div className="flex items-center justify-between border-b border-violet-500/30 pb-1 text-violet-300 font-bold">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-violet-400" />
              COMBAT DIRECTOR AI
            </span>
            <span className="text-[10px] bg-violet-900/60 px-1.5 py-0.5 rounded text-violet-200">
              Phase {debugSnapshot.phase}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <span className="text-slate-400">State:</span>
            <span className="text-amber-300 font-bold">{debugSnapshot.state.toUpperCase()}</span>

            <span className="text-slate-400">Move Intent:</span>
            <span className="text-sky-300 font-bold">{debugSnapshot.movementIntent}</span>

            <span className="text-slate-400">Attack Intent:</span>
            <span className="text-rose-400 font-bold">{debugSnapshot.attackIntent}</span>

            <span className="text-slate-400">Distance:</span>
            <span className="text-emerald-300">{debugSnapshot.targetDistance}px ({debugSnapshot.distanceTier})</span>

            <span className="text-slate-400">Guarding:</span>
            <span className={debugSnapshot.isGuarding ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
              {debugSnapshot.isGuarding ? 'YES (65% RESIST)' : 'NO'}
            </span>

            <span className="text-slate-400">Feinting:</span>
            <span className={debugSnapshot.isFeinting ? 'text-purple-300 font-bold' : 'text-slate-500'}>
              {debugSnapshot.isFeinting ? 'BAITING' : 'NO'}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-1.5">
            <div className="text-[10px] uppercase font-bold text-violet-400 mb-1">Player Pattern Profiling:</div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <span className="text-slate-400">Dominant Dodge:</span>
              <span className="text-sky-300 uppercase">{debugSnapshot.playerMetrics.dominantDodgeDirection}</span>

              <span className="text-slate-400">Camping:</span>
              <span className={debugSnapshot.playerMetrics.isCamping ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                {debugSnapshot.playerMetrics.isCamping ? 'DETECTED (HAZARD)' : 'MOBILE'}
              </span>

              <span className="text-slate-400">Attack Spam:</span>
              <span className={debugSnapshot.playerMetrics.isSpammingAttack ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {debugSnapshot.playerMetrics.isSpammingAttack ? 'SPAM COUNTER' : 'TIMED'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Center: Radoxom Ammo Pouch & Battle Guide */}
      <div className="w-full flex flex-col items-center gap-2 pb-36 sm:pb-2 pointer-events-none">
        {/* Radoxom Pod Ammo Deck */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/50 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>RADOXOM AMMUNITION POD</span>
            <span className="font-mono text-white text-sm ml-1">
              ({radoxomsAvailable} / {totalRadoxoms})
            </span>
          </div>

          {/* Ammo Orbs Array */}
          <div className="flex items-center gap-2.5">
            {Array.from({ length: totalRadoxoms }).map((_, idx) => {
              const hasAmmo = idx < radoxomsAvailable;
              return (
                <div
                  key={idx}
                  className={`relative w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                    hasAmmo
                      ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-white border-amber-300 text-amber-950 shadow-[0_0_15px_#facc15] scale-105'
                      : 'bg-slate-950/80 border-slate-800 text-slate-700 scale-90'
                  }`}
                >
                  ⚡
                  {hasAmmo && (
                    <div className="absolute inset-0 rounded-xl bg-yellow-300/30 animate-ping pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Combat Statistics Micro-bar */}
          <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono pt-1">
            <span>Accuracy: <strong className="text-sky-300">{combatStats.accuracy}%</strong></span>
            <span>•</span>
            <span>Dodged: <strong className="text-cyan-300">{combatStats.attacksDodged}</strong></span>
            <span>•</span>
            <span>Dmg Dealt: <strong className="text-amber-300">{combatStats.damageDealt}</strong></span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <span className="text-slate-400">WASD: Move</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-300">Space: Jump over waves</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300">C: Dodge Roll (i-frames)</span>
          <span className="text-slate-600">•</span>
          <span className="text-yellow-300 flex items-center gap-1">
            <Crosshair className="w-3 h-3" />
            Mouse Click: Fire Radoxom
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-violet-300">`: AI Overlay</span>
        </div>
      </div>
    </div>
  );
};

