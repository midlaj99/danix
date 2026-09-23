import React from 'react';
import { CombatStats, PlayerStats } from '../../types/game';
import { Shield, Heart, Zap, Crosshair, Pause, Activity, Eye, Terminal } from 'lucide-react';
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
  onPause?: () => void;
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
}) => {
  const hpRatio = Math.max(0, Math.min(1, heroStats.currentHp / heroStats.maxHp));
  const shieldRatio = Math.max(0, Math.min(1, heroStats.currentShield / heroStats.maxShield));
  const monsterHpRatio = Math.max(0, Math.min(1, monsterHp / monsterMaxHp));
  const staminaRatio = Math.max(0, Math.min(1, heroStamina / heroMaxStamina));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-2 sm:p-3 md:p-4 select-none animate-fadeIn"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingLeft: 'max(0.6rem, env(safe-area-inset-left, 0.6rem))',
        paddingRight: 'max(0.6rem, env(safe-area-inset-right, 0.6rem))',
      }}
    >
      {/* ========================================================= */}
      {/* TOP BAR: COMPACT HERO (LEFT), RADOXOM & PAUSE (CENTER),   */}
      {/* MONSTER (RIGHT)                                           */}
      {/* ========================================================= */}
      <div className="w-full flex items-start justify-between gap-1.5 sm:gap-3">
        {/* TOP-LEFT: COMPACT HERO VITALITY PLATE */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-sky-500/40 rounded-xl p-2 sm:p-2.5 shadow-lg w-auto min-w-[150px] max-w-[210px] sm:min-w-[220px] pointer-events-auto">
          {/* Header row: Icon, Level, Skill */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] sm:text-xs font-rpg font-black text-sky-300 truncate">
                {activeSkill}
              </span>
            </div>
            <span className="text-[8.5px] sm:text-[10px] font-mono text-slate-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800 shrink-0">
              Lv.{heroStats.level}
            </span>
          </div>

          {/* Compact HP Bar */}
          <div className="space-y-0.5 mb-1">
            <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] font-bold text-emerald-400 font-mono">
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
          <div className="space-y-0.5 mb-1">
            <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] font-bold text-cyan-300 font-mono">
              <span className="flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 text-cyan-400" />
                <span>SHIELD</span>
              </span>
              <span>
                {heroStats.currentShield}/{heroStats.maxShield}
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300 rounded-full shadow-[0_0_8px_#38bdf8]"
                style={{ width: `${shieldRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Ultra-compact Stamina Bar */}
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
            <div
              className={`h-full transition-all duration-150 rounded-full ${
                staminaRatio < 0.25 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-yellow-300'
              }`}
              style={{ width: `${staminaRatio * 100}%` }}
              title={`Stamina: ${Math.round(heroStamina)}/${heroMaxStamina}`}
            />
          </div>
        </div>

        {/* TOP-CENTER: COMPACT RADOXOM COUNTER & PAUSE */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Compact Radoxom HUD Badge (✦ 3 or RADOXOM × 3) */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/50 px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1.5 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-rpg font-bold tracking-wider hidden xs:inline">
              RADOXOM
            </span>
            <span className="text-xs sm:text-sm font-mono font-black text-white">
              × {radoxomsAvailable}
            </span>
            <span className="text-[9px] font-mono text-slate-400">/{totalRadoxoms}</span>
          </div>

          {/* Pause Button */}
          {onPause && (
            <button
              onClick={onPause}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer shadow-md"
              title="Pause Game"
              aria-label="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* AI Debug Toggle (Desktop / Diagnostic) */}
          {onToggleAIDebug && (
            <button
              onClick={onToggleAIDebug}
              className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-mono border transition-all ${
                debugSnapshot
                  ? 'bg-violet-950/80 border-violet-400 text-violet-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>AI</span>
            </button>
          )}
        </div>

        {/* TOP-RIGHT: COMPACT MONSTER THREAT PLATE */}
        <div className="bg-slate-950/85 backdrop-blur-md border border-rose-500/40 rounded-xl p-2 sm:p-2.5 shadow-lg w-auto min-w-[150px] max-w-[210px] sm:min-w-[220px] pointer-events-auto text-right">
          {/* Header row: Name & Hostile Pill */}
          <div className="flex items-center justify-between flex-row-reverse gap-1 mb-1">
            <span className="text-[10px] sm:text-xs font-rpg font-black text-rose-300 truncate">
              {monsterName}
            </span>
            <span className="text-[8px] uppercase font-bold tracking-widest px-1 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30 shrink-0">
              FOE
            </span>
          </div>

          {/* Compact Monster HP Bar */}
          <div className="space-y-0.5 mb-1">
            <div className="flex items-center justify-between flex-row-reverse text-[8px] sm:text-[9.5px] font-bold text-rose-400 font-mono">
              <span className="flex items-center gap-0.5 flex-row-reverse">
                <Activity className="w-2.5 h-2.5 text-rose-400" />
                <span>HP</span>
              </span>
              <span>
                {monsterHp}/{monsterMaxHp}
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-slate-900 rounded-full overflow-hidden border border-rose-500/30">
              <div
                className="h-full bg-gradient-to-l from-rose-600 via-red-500 to-amber-500 transition-all duration-300 rounded-full shadow-[0_0_8px_#ef4444]"
                style={{ width: `${monsterHpRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Monster Dodge Charges Evasion Pip Row */}
          <div className="flex items-center justify-end gap-1 pt-0.5">
            <span className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-400 uppercase">
              EVASION
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: monsterMaxDodgeCharges }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border transition-all flex items-center justify-center text-[7px] ${
                    i < monsterDodgeCharges
                      ? 'bg-sky-400 border-sky-200 text-sky-950 shadow-[0_0_6px_#38bdf8] scale-105'
                      : 'bg-slate-950 border-slate-800 text-transparent opacity-30'
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
        <div className="absolute top-20 right-3 sm:right-6 bg-slate-950/90 backdrop-blur-lg border border-violet-500/50 p-2.5 rounded-xl shadow-2xl w-60 pointer-events-auto text-[10px] font-mono text-slate-300 space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-violet-500/30 pb-1 text-violet-300 font-bold">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-violet-400" />
              AI DIRECTOR
            </span>
            <span className="text-[9px] bg-violet-900/60 px-1 rounded text-violet-200">
              P{debugSnapshot.phase}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-0.5 text-[9.5px]">
            <span className="text-slate-400">State:</span>
            <span className="text-amber-300 font-bold">{debugSnapshot.state.toUpperCase()}</span>
            <span className="text-slate-400">Move:</span>
            <span className="text-sky-300">{debugSnapshot.movementIntent}</span>
            <span className="text-slate-400">Attack:</span>
            <span className="text-rose-400 font-bold">{debugSnapshot.attackIntent}</span>
            <span className="text-slate-400">Dist:</span>
            <span className="text-emerald-300">{debugSnapshot.targetDistance}px</span>
            <span className="text-slate-400">Guard:</span>
            <span className={debugSnapshot.isGuarding ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
              {debugSnapshot.isGuarding ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      )}

      {/* Bottom Desktop Combat Hints (Hidden on Mobile) */}
      <div className="w-full hidden md:flex items-center justify-center pb-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 font-mono">
          <span>Accuracy: <strong className="text-sky-300">{combatStats.accuracy}%</strong></span>
          <span>•</span>
          <span>Dodges: <strong className="text-cyan-300">{combatStats.attacksDodged}</strong></span>
          <span>•</span>
          <span>Dmg: <strong className="text-amber-300">{combatStats.damageDealt}</strong></span>
        </div>
      </div>
    </div>
  );
};
