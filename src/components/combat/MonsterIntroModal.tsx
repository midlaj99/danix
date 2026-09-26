import React, { useState, useEffect } from 'react';
import { MonsterArchetype } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { Swords, ChevronRight, ShieldAlert, Skull, Zap, FastForward, MessageSquare } from 'lucide-react';

interface MonsterIntroModalProps {
  monster: MonsterArchetype;
  levelNumber?: number;
  onStartCombat: () => void;
}

interface DialogueEntry {
  speaker: 'BOSS' | 'HERO';
  title: string;
  avatarColor: string;
  avatarIcon: string;
  text: string;
}

export const MonsterIntroModal: React.FC<MonsterIntroModalProps> = ({
  monster,
  levelNumber = 1,
  onStartCombat,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    SoundManager.getInstance().playCinematicBoom();
    SoundManager.getInstance().playMonsterRoar();
  }, []);

  // Build dramatic 3-beat dialogue sequence: Boss Taunt -> Boss Insult -> Hero Comeback
  const dialogueSequence: DialogueEntry[] = [
    {
      speaker: 'BOSS',
      title: monster.name.toUpperCase(),
      avatarColor: 'border-rose-500 bg-rose-950/80 text-rose-400',
      avatarIcon: '👹',
      text: monster.introDialogue[0] ||
        `Hahaha! Another puny mortal dares enter my dimensional domain with elementary scalar delusions?`,
    },
    {
      speaker: 'BOSS',
      title: `${monster.name.toUpperCase()} (MOCKING)`,
      avatarColor: 'border-red-600 bg-red-950/90 text-red-300',
      avatarIcon: '💀',
      text: monster.introDialogue[1] ||
        `Your array memory is fragmented, your axes are unaligned, and you can barely reshape a 1D vector! I will crush your dimensions into zero bytes, worm!`,
    },
    {
      speaker: 'HERO',
      title: 'ARIA & COMPUTATIONAL HERO',
      avatarColor: 'border-sky-400 bg-sky-950/90 text-sky-300',
      avatarIcon: '⚡',
      text: `Talk all you want, ${monster.name}. Our arrays are contiguous, our broadcasting rules are strict, and your matrix is about to collapse!`,
    },
  ];

  const currentDialogue = dialogueSequence[stepIndex] || dialogueSequence[0];
  const isFinalStep = stepIndex >= dialogueSequence.length - 1;

  const handleNextDialogue = () => {
    SoundManager.getInstance().playUiClick();
    if (!isFinalStep) {
      SoundManager.getInstance().playSwordClash();
      setStepIndex((prev) => prev + 1);
    } else {
      handleCommenceBattle();
    }
  };

  const handleCommenceBattle = () => {
    SoundManager.getInstance().playMonsterRoar();
    SoundManager.getInstance().playSwordClash();
    onStartCombat();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between pointer-events-auto select-none overflow-hidden animate-fadeIn"
      style={{
        paddingTop: 'max(0.2rem, env(safe-area-inset-top, 0.2rem))',
        paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom, 0.4rem))',
      }}
    >
      {/* Background Cinematic Atmosphere & Vignette */}
      <div className="fixed inset-0 bg-slate-950/85 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/40 via-slate-950/80 to-black pointer-events-none z-0" />

      {/* TOP WIDESCREEN LETTERBOX BAR */}
      <div className="relative z-10 w-full bg-slate-950/95 border-b-2 border-rose-500/80 px-4 py-2 flex items-center justify-between shadow-[0_4px_25px_rgba(244,63,94,0.4)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-rose-400 uppercase">
            🔥 S-RANK BOSS ENCOUNTER • LEVEL {levelNumber}
          </span>
        </div>

        {/* Quick Skip Button for Speedruns */}
        <button
          onClick={handleCommenceBattle}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400 text-[10px] text-slate-300 font-mono transition cursor-pointer active:scale-95"
          title="Skip Dialogue and Fight"
        >
          <span>FAST SKIP</span>
          <FastForward className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* CENTERPIECE: BOSS IDENTITY & THREAT DOSSIER */}
      <div className="relative z-10 w-full flex flex-col items-center text-center my-auto px-4 py-2">
        {/* Animated Threat Icon */}
        <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-400 p-0.5 shadow-[0_0_40px_rgba(239,68,68,0.7)] mb-2 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
            <Skull className="w-8 h-8 sm:w-11 sm:h-11 text-rose-400" />
          </div>
        </div>

        {/* Boss Name Banner */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 tracking-wider drop-shadow-[0_2px_15px_rgba(239,68,68,0.6)]">
          {monster.name}
        </h1>

        {/* Archetype & Combat Stats Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-[10px] sm:text-xs font-rpg font-bold text-rose-300 uppercase tracking-widest">
            ✦ {monster.archetype} ✦
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9.5px] sm:text-[11px] font-mono font-bold text-amber-400">
            HP: {monster.hp}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9.5px] sm:text-[11px] font-mono font-bold text-red-400">
            ATK: {monster.attack}
          </span>
        </div>
      </div>

      {/* BOTTOM WIDESCREEN LETTERBOX & TAUNT DIALOGUE CARD */}
      <div className="relative z-10 w-full bg-slate-950/95 border-t-2 border-amber-500/80 p-3 sm:p-5 flex flex-col items-center shadow-[0_-4px_30px_rgba(0,0,0,0.8)]">
        <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col gap-2">
          {/* Speaker Header with Avatar */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center text-sm shadow-md ${currentDialogue.avatarColor}`}
              >
                {currentDialogue.avatarIcon}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-rpg font-black text-white tracking-wide">
                  {currentDialogue.title}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              DIALOGUE {stepIndex + 1}/{dialogueSequence.length}
            </span>
          </div>

          {/* Dialogue Text Bubble */}
          <div className="py-1 min-h-[50px] sm:min-h-[60px] flex items-center">
            <p className="text-xs sm:text-sm md:text-base font-sans italic text-slate-100 leading-relaxed">
              "{currentDialogue.text}"
            </p>
          </div>

          {/* Dialogue Controls */}
          <div className="flex items-center justify-end gap-2.5 pt-1 border-t border-slate-800/80">
            {!isFinalStep ? (
              <button
                onClick={handleNextDialogue}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-rpg font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <span>NEXT TAUNT</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            ) : null}

            <button
              onClick={handleCommenceBattle}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-rpg font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.7)] flex items-center gap-2 active:scale-95 transition cursor-pointer animate-pulse"
            >
              <Swords className="w-4 h-4 fill-white" />
              <span>COMMENCE BATTLE ⚔</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
