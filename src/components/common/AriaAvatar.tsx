import React, { useState } from 'react';
import { Sparkles, User } from 'lucide-react';

export type AriaAvatarSize = 'dialogue' | 'header' | 'question' | 'mini';

interface AriaAvatarProps {
  size?: AriaAvatarSize;
  className?: string;
  showBadge?: boolean;
}

const SIZE_CLASSES: Record<AriaAvatarSize, { container: string; img: string; badge: string }> = {
  dialogue: {
    container: 'w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 min-w-[56px] min-h-[56px] sm:min-w-[80px] sm:min-h-[80px] rounded-2xl border-2 border-pink-400/90 shadow-[0_0_20px_rgba(236,72,153,0.35)]',
    img: 'w-full h-full object-cover object-top',
    badge: 'text-[8.5px] px-2 py-0.5',
  },
  header: {
    container: 'w-8 h-8 sm:w-9 sm:h-9 min-w-[32px] min-h-[32px] rounded-xl border border-pink-400/80 shadow-sm',
    img: 'w-full h-full object-cover object-top',
    badge: 'text-[7.5px] px-1.5 py-0.2',
  },
  question: {
    container: 'w-9 h-9 sm:w-11 sm:h-11 min-w-[36px] min-h-[36px] rounded-xl border border-pink-400/80 shadow-sm',
    img: 'w-full h-full object-cover object-top',
    badge: 'text-[8px] px-1.5 py-0.2',
  },
  mini: {
    container: 'w-6 h-6 sm:w-7 sm:h-7 min-w-[24px] min-h-[24px] rounded-full border border-pink-400/80 shadow-sm',
    img: 'w-full h-full object-cover object-top',
    badge: 'text-[7px] px-1 py-0.2',
  },
};

export const AriaAvatar: React.FC<AriaAvatarProps> = ({
  size = 'dialogue',
  className = '',
  showBadge = false,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  const sizeConfig = SIZE_CLASSES[size];

  const candidateSources = ['/aria.png', './aria.png', './aria/aria.png'];
  const currentSrc = candidateSources[fallbackAttempt] || '/aria.png';

  const handleError = () => {
    if (fallbackAttempt + 1 < candidateSources.length) {
      setFallbackAttempt((prev) => prev + 1);
    } else {
      setLoadError(true);
    }
  };

  return (
    <div className={`relative shrink-0 flex flex-col items-center select-none ${className}`}>
      <div
        className={`relative overflow-hidden bg-slate-900 flex items-center justify-center aspect-square ${sizeConfig.container}`}
      >
        {!loadError ? (
          <img
            src={currentSrc}
            alt="Aria"
            decoding="async"
            loading="eager"
            onError={handleError}
            className={`${sizeConfig.img} transition-opacity duration-200 pointer-events-none`}
          />
        ) : (
          /* High-aesthetic anime arch-mage fallback avatar if image cannot be loaded */
          <div className="w-full h-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-300 flex items-center justify-center text-white font-rpg font-bold">
            <span className="drop-shadow-md text-xs sm:text-base flex items-center justify-center">
              ✦
            </span>
          </div>
        )}
      </div>

      {showBadge && (
        <div
          className={`absolute -bottom-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-rpg font-bold rounded-full shadow-md flex items-center gap-0.5 whitespace-nowrap pointer-events-none ${sizeConfig.badge}`}
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-200" />
          <span>ARIA</span>
        </div>
      )}
    </div>
  );
};
