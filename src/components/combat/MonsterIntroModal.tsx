import React, { useState } from 'react';
import { MonsterArchetype } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { Swords, ChevronRight, Skull, ShieldAlert, Sparkles } from 'lucide-react';

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
      setDialogueStep(prev => prev + 1);
    } else {
      SoundManager.getInstance().playMonsterRoar();
      onStartCombat();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-8 pointer-events-none animate-fade-in select-none">
      {/* Cinematic Top Title Splash */}
      <div className="w-full flex flex-col items-center text-center pt-2 sm:pt-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2 bg-rose-950/90 border border-rose-500/70 px-4 py-1 rounded-full text-rose-300 text-[11px] font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>EXPEDITION LEVEL {levelNumber} BOSS ENCOUNTER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 mt-2 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          {monster.name}
        </h1>

        <div className="text-xs sm:text-sm font-rpg font-semibold text-rose-300/90 uppercase tracking-widest mt-1">
          ✦ {monster.archetype} ✦
        </div>
      </div>

      {/* Cinematic Lower Dialogue Card */}
      <div className="w-full flex justify-center pb-2 sm:pb-6 pointer-events-auto">
        <div className="relative w-full max-w-2xl rpg-panel-danger p-5 sm:p-6 shadow-2xl border-rose-500/60 bg-slate-950/92 backdrop-blur-md flex flex-col items-center text-center">
          {/* Monster Dialogue Line */}
          <div className="w-full bg-slate-950/80 border border-rose-900/70 p-4 rounded-xl text-slate-100 text-base sm:text-lg italic font-sans mb-4 shadow-inner">
            "{monster.introDialogue[dialogueStep]}"
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-rpg font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-rose-600/40 flex items-center gap-2 transform active:scale-95 transition cursor-pointer"
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
