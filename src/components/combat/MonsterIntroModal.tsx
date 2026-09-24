import React, { useState } from 'react';
import { MonsterArchetype } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { Swords, ChevronRight, ShieldAlert } from 'lucide-react';

interface MonsterIntroModalProps {
  monster: MonsterArchetype;
  levelNumber?: number;
  onStartCombat: () => void;
}

export const MonsterIntroModal: React.FC<MonsterIntroModalProps> = ({
  monster,
  levelNumber = 1,
  onStartCombat,
}) => {
  const [dialogueStep, setDialogueStep] = useState(0);

  const handleNext = () => {
    SoundManager.getInstance().playUiClick();
    if (dialogueStep < monster.introDialogue.length - 1) {
      setDialogueStep((prev) => prev + 1);
    } else {
      SoundManager.getInstance().playMonsterRoar();
      SoundManager.getInstance().playSwordClash();
      onStartCombat();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-between p-2 sm:p-4 pointer-events-none animate-fadeIn select-none overflow-hidden"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
      }}
    >
      {/* Cinematic Top Title Splash */}
      <div className="w-full flex flex-col items-center text-center pt-1 pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/70 px-3 py-0.5 rounded-full text-rose-300 text-[10px] font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
          <ShieldAlert className="w-3 h-3 text-rose-400" />
          <span>LEVEL {levelNumber} BOSS ENCOUNTER</span>
        </div>

        <h1 className="text-xl sm:text-3xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 mt-1 tracking-wide drop-shadow">
          {monster.name}
        </h1>

        <div className="text-[10px] sm:text-xs font-rpg font-semibold text-rose-300/90 uppercase tracking-widest">
          ✦ {monster.archetype} ✦
        </div>
      </div>

      {/* Cinematic Lower Dialogue Card */}
      <div className="w-full flex justify-center pb-1 pointer-events-auto">
        <div className="relative w-full max-w-xl bg-slate-950/90 border border-rose-500/60 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
          <div className="w-full bg-slate-900/80 border border-rose-900/70 p-2.5 rounded-xl text-slate-100 text-xs sm:text-sm italic font-sans mb-2.5 shadow-inner">
            "{monster.introDialogue[dialogueStep]}"
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-rpg font-bold text-xs sm:text-sm px-6 py-2 rounded-xl shadow-lg shadow-rose-600/40 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              {dialogueStep < monster.introDialogue.length - 1 ? (
                <>
                  CONTINUE <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  COMMENCE BATTLE <Swords className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
