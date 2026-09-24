import React from 'react';
import { SoundManager } from '../../audio/SoundManager';
import { RotateCcw, Skull, Zap, Swords, LogOut } from 'lucide-react';
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
  const radoxomsUsed = retryAmmoBreakdown ? retryAmmoBreakdown.fired : combatStats?.radoxomsFired || 0;
  const radoxomsRemaining = retryAmmoBreakdown ? retryAmmoBreakdown.remaining : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-[3px] select-none animate-fadeIn pointer-events-auto"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      {/* Compact Cinematic Defeat Panel over Visible Game World */}
      <div className="relative w-full max-w-sm bg-slate-950/92 border-2 border-rose-500/70 rounded-3xl p-4 sm:p-5 text-center shadow-[0_0_50px_rgba(244,63,94,0.35)] backdrop-blur-md flex flex-col items-center">
        {/* Skull Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-950/90 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          {isAmmoDefeat ? (
            <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
          ) : (
            <Skull className="w-6 h-6 text-rose-400 animate-pulse" />
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-rpg font-black text-rose-500 tracking-wider mb-0.5">
          {isAmmoDefeat ? 'AMMO DEPLETED' : 'DEFEATED'}
        </h1>

        <p className="text-slate-300 text-xs italic font-sans mb-3 leading-snug">
          {isAmmoDefeat
            ? '"Your Radoxom energy was exhausted. Recover ammunition with Aria to strike again!"'
            : '"Rise again, warrior! Evade the boss attacks and strike with decisive aim."'}
        </p>

        {/* Compact Ammo Accounting Pill */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2 mb-3 text-xs font-mono space-y-1 text-left">
          <div className="flex justify-between text-slate-400">
            <span>RADOXOMS USED:</span>
            <span className="text-rose-400 font-bold">{radoxomsUsed}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>RADOXOMS REMAINING:</span>
            <span className="text-emerald-400 font-bold">{radoxomsRemaining}</span>
          </div>
          {ammoNeeded > 0 && (
            <div className="flex justify-between text-amber-300 pt-0.5 border-t border-slate-800 font-bold">
              <span>NEEDED ON RETRY:</span>
              <span>+{ammoNeeded} Ammo</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-1.5">
          {onRetryCombat && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onRetryCombat();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-rpg font-extrabold text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>
                {ammoNeeded > 0 ? `RETRY: RECOVER AMMO (+${ammoNeeded})` : 'RETRY COMBAT ⚔'}
              </span>
            </button>
          )}

          {onRestartQuestions && (
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onRestartQuestions();
              }}
              className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RE-PRACTICE QUESTIONS</span>
            </button>
          )}

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onReturnToMenu();
            }}
            className="w-full py-1.5 px-4 rounded-xl bg-transparent hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 font-mono text-[10.5px] flex items-center justify-center gap-1 transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>EXIT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
