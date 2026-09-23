import React from 'react';
import { SoundManager } from '../../audio/SoundManager';
import { RotateCcw, Skull, Zap, Swords } from 'lucide-react';
import { CombatStats } from '../../types/game';

interface RetryAmmoBreakdown {
  required: number;
  earned: number;
  fired: number;
  remaining: number;
  toRecover: number;
}

interface DeathModalProps {
  reason?: 'slain' | 'ammo_exhausted';
  combatStats?: CombatStats;
  retryAmmoBreakdown?: RetryAmmoBreakdown;
  onRetryCombat?: () => void;
  onRestartQuestions?: () => void;
  onRestartLevel: () => void;
  onReturnToMenu: () => void;
}

export const DeathModal: React.FC<DeathModalProps> = ({
  reason = 'slain',
  combatStats,
  retryAmmoBreakdown,
  onRetryCombat,
  onRestartQuestions,
  onRestartLevel,
  onReturnToMenu,
}) => {
  const isAmmoDefeat = reason === 'ammo_exhausted';
  const ammoNeeded = retryAmmoBreakdown ? retryAmmoBreakdown.toRecover : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rpg-panel-danger p-5 sm:p-7 shadow-2xl flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-3.5 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
          {isAmmoDefeat ? (
            <Zap className="w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-pulse" />
          ) : (
            <Skull className="w-8 h-8 md:w-10 md:h-10 text-rose-400 animate-pulse" />
          )}
        </div>

        <h1 className="text-xl md:text-2xl font-rpg font-black text-rose-500 tracking-wider mb-1.5">
          {isAmmoDefeat ? 'RADOXOMS DEPLETED' : 'DEFEATED IN BATTLE'}
        </h1>

        <p className="text-slate-300 text-xs md:text-sm italic font-sans mb-3 leading-relaxed">
          {isAmmoDefeat ? (
            <>
              "All your Radoxom energy projectiles were spent before the beast fell. Aim with precision, or return to study with Aria to earn more ammo!"
            </>
          ) : (
            <>
              "Rise again, warrior. Use your Tactical Dodge Roll [C] to phase through attacks and jump over shockwaves."
            </>
          )}
          <br />
          <span className="text-pink-400 text-xs not-italic font-bold font-rpg mt-1 block">— Aria</span>
        </p>

        {/* Authoritative Ammo Breakdown */}
        {retryAmmoBreakdown && (
          <div className="w-full bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 mb-3 text-left text-xs font-mono space-y-1 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <div className="flex justify-between text-slate-300 font-bold border-b border-slate-800 pb-1">
              <span className="text-amber-400">AMMO ACCOUNTING</span>
              <span className="text-slate-400">LEVEL ATTEMPT</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Radoxoms Earned:</span>
              <span className="text-sky-300 font-bold">{retryAmmoBreakdown.earned}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Radoxoms Fired (Spent):</span>
              <span className="text-rose-400 font-bold">{retryAmmoBreakdown.fired}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Remaining in Inventory:</span>
              <span className="text-emerald-400 font-bold">{retryAmmoBreakdown.remaining}</span>
            </div>
            <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800">
              <span>Needed to Recover on Retry:</span>
              <span className="font-bold underline">+{ammoNeeded} Ammo</span>
            </div>
          </div>
        )}

        {/* Combat Stats summary if available */}
        {combatStats && (
          <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 mb-4 text-left text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Accuracy:</span>
              <span className="text-sky-300 font-bold">{combatStats.accuracy}%</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Damage Dealt:</span>
              <span className="text-amber-300 font-bold">{combatStats.damageDealt} DMG</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Attacks Dodged:</span>
              <span className="text-cyan-300 font-bold">{combatStats.attacksDodged}</span>
            </div>
          </div>
        )}

        <div className="w-full space-y-2">
          {onRetryCombat && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onRetryCombat();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-rpg font-bold text-xs md:text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              {ammoNeeded > 0
                ? `RETRY: RECOVER MISSING AMMO (+${ammoNeeded})`
                : 'RETRY 1v1 COMBAT'}
            </button>
          )}

          {onRestartQuestions && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onRestartQuestions();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-sky-500/40 text-sky-300 font-rpg text-xs py-2.5 px-6 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RE-PRACTICE ALL QUESTIONS
            </button>
          )}

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onRestartLevel();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-rpg text-xs py-2 px-6 rounded-xl transition cursor-pointer"
          >
            RESTART LEVEL FROM ARIA
          </button>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onReturnToMenu();
            }}
            className="w-full bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 text-xs py-1.5 transition cursor-pointer"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
