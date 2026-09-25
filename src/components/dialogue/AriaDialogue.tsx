import React, { useState, useEffect } from 'react';
import { DialogueStep } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { ChevronRight, FastForward, Sparkles } from 'lucide-react';

import { AriaAvatar } from '../common/AriaAvatar';

interface AriaDialogueProps {
  dialogues: DialogueStep[];
  onComplete: () => void;
  speedMultiplier?: number;
}

export const AriaDialogue: React.FC<AriaDialogueProps> = ({
  dialogues,
  onComplete,
  speedMultiplier = 1,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentDialogue = dialogues[currentIndex] || dialogues[0];

  useEffect(() => {
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const fullText = currentDialogue.text;
    const baseSpeed = 22 / speedMultiplier;

    const timer = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.substring(0, charIndex));

      if (charIndex % 3 === 0) {
        SoundManager.getInstance().playDialogueChirp();
      }

      if (charIndex >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, baseSpeed);

    return () => clearInterval(timer);
  }, [currentIndex, currentDialogue.text, speedMultiplier]);

  const handleNext = () => {
    SoundManager.getInstance().playUiClick();
    if (isTyping) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundManager.getInstance().playUiClick();
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center pointer-events-auto select-none bg-slate-950/40 backdrop-blur-[2px] animate-fadeIn"
      style={{
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom, 0.6rem))',
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0.75rem))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0.75rem))',
      }}
    >
      {/* Semi-transparent Sleek Dialogue Panel (Game World Visible Behind) */}
      <div
        onClick={handleNext}
        className="relative w-full max-w-4xl bg-slate-950/90 border border-pink-500/50 rounded-2xl p-2.5 sm:p-4 shadow-[0_0_40px_rgba(236,72,153,0.25)] backdrop-blur-md flex items-center gap-2.5 sm:gap-5 cursor-pointer active:scale-[0.99] transition-transform"
      >
        {/* Aria High-Resolution Character Portrait via AriaAvatar */}
        <AriaAvatar size="dialogue" showBadge />

        {/* Dialogue Body */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-pink-400 font-rpg font-bold text-xs truncate">
                Aria • Royal NumPy Arch-Mage
              </span>
              <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded font-mono">
                {currentIndex + 1}/{dialogues.length}
              </span>
            </div>

            <button
              onClick={handleSkipAll}
              className="text-[10px] text-slate-400 hover:text-pink-300 flex items-center gap-1 transition px-2 py-0.5 rounded hover:bg-slate-800/60 cursor-pointer"
            >
              Skip <FastForward className="w-3 h-3" />
            </button>
          </div>

          {/* Dialogue Text */}
          <div className="text-slate-100 text-xs sm:text-sm md:text-base leading-relaxed font-sans min-h-[42px] pr-1">
            {displayedText}
            {isTyping && <span className="typewriter-cursor inline-block text-pink-400 ml-0.5 font-bold" />}
          </div>

          {/* Footer Action Button */}
          <div className="flex items-center justify-between mt-1 pt-1">
            <span className="text-[9px] text-slate-500 font-mono hidden sm:inline">
              Tap anywhere to advance
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="ml-auto bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-rpg font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-xl shadow-md shadow-pink-500/25 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              {currentIndex < dialogues.length - 1 ? (
                <>
                  NEXT →
                </>
              ) : (
                <>
                  BEGIN LESSON <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
