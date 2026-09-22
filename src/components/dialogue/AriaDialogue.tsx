import React, { useState, useEffect } from 'react';
import { DialogueStep } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { ChevronRight, FastForward, Sparkles } from 'lucide-react';

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
    const baseSpeed = 24 / speedMultiplier;

    const timer = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.substring(0, charIndex));

      // Play soft chirp sound periodically
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
      // Instant reveal
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipAll = () => {
    SoundManager.getInstance().playUiClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center pb-8 px-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-4xl rpg-panel p-6 shadow-2xl flex flex-col md:flex-row items-center md:items-end gap-6 border-pink-500/40 shadow-pink-500/10">
        {/* Aria High-Resolution Character Portrait */}
        <div className="relative shrink-0 -mt-16 md:-mt-24 mb-2 md:mb-0">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden border-3 border-pink-400/80 shadow-[0_0_25px_rgba(236,72,153,0.35)] bg-slate-900 flex items-center justify-center">
            <img
              src="/aria.png"
              alt="Aria"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback to aria/aria.png if relative path differs
                (e.target as HTMLImageElement).src = './aria/aria.png';
              }}
            />
          </div>

          {/* Teacher Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-rpg font-bold text-xs px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ARIA
          </div>
        </div>

        {/* Dialogue Body & Content */}
        <div className="flex-1 w-full flex flex-col justify-between min-h-[110px]">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-pink-400 font-rpg font-bold text-sm tracking-wide">
                Aria • Royal NumPy Arch-Mage
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                Step {currentIndex + 1} of {dialogues.length}
              </span>
            </div>

            <button
              onClick={handleSkipAll}
              className="text-[11px] text-slate-400 hover:text-pink-300 flex items-center gap-1 transition px-2 py-0.5 rounded hover:bg-slate-800/50 cursor-pointer"
            >
              Skip Dialogue <FastForward className="w-3 h-3" />
            </button>
          </div>

          {/* Dialogue Text */}
          <div className="text-slate-100 text-base md:text-lg leading-relaxed font-sans min-h-[55px] pr-2">
            {displayedText}
            {isTyping && <span className="typewriter-cursor inline-block text-pink-400 ml-0.5 font-bold" />}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-2 border-t border-slate-800/60">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-rpg font-bold text-sm px-6 py-2 rounded-lg shadow-lg shadow-pink-500/20 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              {currentIndex < dialogues.length - 1 ? (
                <>
                  NEXT <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  BEGIN LESSON <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
