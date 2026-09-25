import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { RadoxomEconomyManager } from '../../game/systems/RadoxomEconomyManager';
import { BookOpen, CheckCircle2, XCircle, Zap, ArrowRight, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { AriaAvatar } from '../common/AriaAvatar';

export type QuestionState =
  | 'QUESTION_READY'
  | 'QUESTION_ACTIVE'
  | 'ANSWER_SELECTED'
  | 'LOCK_INPUT'
  | 'CORRECT'
  | 'INCORRECT'
  | 'TIMED_OUT'
  | 'ADVANCING';

interface QuestionSessionModalProps {
  questions: Question[];
  levelTitle: string;
  topicTitle: string;
  onComplete: (radoxomsEarned: number) => void;
  isRetry?: boolean;
  targetRadoxomsNeeded?: number;
  existingRemainingAmmo?: number;
}

interface FlyingOrb {
  id: number;
  startX: number;
  startY: number;
}

const QUESTION_TIMEOUT_SECONDS = 15;

export const QuestionSessionModal: React.FC<QuestionSessionModalProps> = ({
  questions,
  levelTitle,
  topicTitle,
  onComplete,
  isRetry = false,
  targetRadoxomsNeeded,
  existingRemainingAmmo = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [radoxomsEarned, setRadoxomsEarned] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<QuestionState>('QUESTION_READY');
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [flyingOrbs, setFlyingOrbs] = useState<FlyingOrb[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMEOUT_SECONDS);
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);

  // Authoritative server/logic-safe timing references
  const deadlineRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);
  const questionLockedRef = useRef<boolean>(false);

  const currentQuestion: Question = questions[currentIndex] || questions[0];

  // Initialize each new question with shuffled options
  useEffect(() => {
    questionLockedRef.current = false;
    setSelectedOption(null);
    setActiveHint(null);
    setQuestionState('QUESTION_ACTIVE');
    setTimeLeft(QUESTION_TIMEOUT_SECONDS);

    if (currentQuestion && currentQuestion.options) {
      const opts = [...currentQuestion.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      setDisplayOptions(opts);
    }

    deadlineRef.current = Date.now() + QUESTION_TIMEOUT_SECONDS * 1000;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const remainingMs = deadlineRef.current - now;
      const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(secondsLeft);

      if (remainingMs <= 0) {
        clearInterval(timerIntervalRef.current);
        handleTimeout();
      }
    }, 100);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentIndex, questions]);

  const handleTimeout = () => {
    if (questionLockedRef.current) return;
    questionLockedRef.current = true;
    setQuestionState('TIMED_OUT');
    setActiveHint('Time expired! 0 Radoxom awarded for this query.');
    SoundManager.getInstance().playWrongAnswer();

    RadoxomEconomyManager.getInstance().recordQuestionResolvedWithoutReward(currentQuestion.id, true);

    setTimeout(() => {
      advanceQuestion();
    }, 1800);
  };

  const handleSelectOption = (opt: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      questionLockedRef.current ||
      questionState !== 'QUESTION_ACTIVE' ||
      Date.now() >= deadlineRef.current
    ) {
      return;
    }

    questionLockedRef.current = true;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    setQuestionState('ANSWER_SELECTED');
    setSelectedOption(opt);

    const isCorrect = opt === currentQuestion.correctAnswer;

    if (isCorrect) {
      setQuestionState('CORRECT');
      SoundManager.getInstance().playCorrectAnswer();
      SoundManager.getInstance().playCrystalChime();

      const awarded = RadoxomEconomyManager.getInstance().earnRadoxom(currentQuestion.id);

      if (awarded) {
        const rect = e.currentTarget.getBoundingClientRect();
        const newOrb: FlyingOrb = {
          id: Date.now(),
          startX: rect.left + rect.width / 2,
          startY: rect.top,
        };
        setFlyingOrbs((prev) => [...prev, newOrb]);

        setTimeout(() => {
          setRadoxomsEarned((prev) => prev + 1);
          setFlyingOrbs((prev) => prev.filter((orb) => orb.id !== newOrb.id));
        }, 550);
      }

      setTimeout(() => {
        advanceQuestion();
      }, 1200);
    } else {
      setQuestionState('INCORRECT');
      setActiveHint(currentQuestion.hint || currentQuestion.explanation);
      SoundManager.getInstance().playWrongAnswer();

      RadoxomEconomyManager.getInstance().recordQuestionResolvedWithoutReward(currentQuestion.id, false);

      setTimeout(() => {
        advanceQuestion();
      }, 2000);
    }
  };

  const advanceQuestion = () => {
    setQuestionState('ADVANCING');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
      SoundManager.getInstance().playShrineResonance();
    }
  };

  const timerRatio = Math.max(0, Math.min(1, timeLeft / QUESTION_TIMEOUT_SECONDS));
  const isTimerCritical = timeLeft <= 4;
  const isInputDisabled = questionState !== 'QUESTION_ACTIVE';

  const totalDisplayTarget = targetRadoxomsNeeded !== undefined ? targetRadoxomsNeeded : questions.length;
  const totalCombinedAmmo = existingRemainingAmmo + radoxomsEarned;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-between p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn select-none overflow-hidden"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
        paddingLeft: 'max(0.6rem, env(safe-area-inset-left, 0.6rem))',
        paddingRight: 'max(0.6rem, env(safe-area-inset-right, 0.6rem))',
      }}
    >
      {/* Flying Radoxom Orbs Animation */}
      {flyingOrbs.map((orb) => (
        <div
          key={orb.id}
          className="fixed pointer-events-none z-50 flex items-center justify-center animate-flyToCounter"
          style={
            {
              left: `${orb.startX}px`,
              top: `${orb.startY}px`,
              '--target-x': 'calc(100vw - 180px)',
              '--target-y': '24px',
            } as React.CSSProperties
          }
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-amber-400/50 blur-md animate-ping" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-white shadow-[0_0_15px_#facc15] flex items-center justify-center font-bold text-[9px] text-amber-950">
              ⚡
            </div>
          </div>
        </div>
      ))}

      {/* TOP IN-GAME HUD BAR */}
      <div className="w-full flex items-center justify-between gap-2 shrink-0 bg-slate-950/85 backdrop-blur-md border border-sky-500/40 rounded-xl px-3 py-1.5 shadow-lg">
        {/* Left: Level & Progress */}
        <div className="flex items-center gap-2 truncate">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-sky-400">
              <span>{isRetry ? 'AMMO RECOVERY' : levelTitle}</span>
              <span>•</span>
              <span className="text-amber-400">Q {currentIndex + 1}/{questions.length}</span>
            </div>
            <h2 className="text-xs sm:text-sm font-rpg font-bold text-white tracking-wide truncate">
              {topicTitle}
            </h2>
          </div>
        </div>

        {/* Center: Authoritative Countdown Timer */}
        {!isSessionFinished && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border transition-all ${
              isTimerCritical
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                : 'bg-slate-900/90 border-slate-700 text-sky-300'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimerCritical ? 'text-rose-400' : 'text-sky-400'}`} />
            <span className="font-mono font-black text-xs sm:text-sm tracking-wider">
              {String(timeLeft).padStart(2, '0')}s
            </span>
          </div>
        )}

        {/* Right: Radoxom Ammo Pod */}
        <div className="flex items-center gap-1.5 bg-amber-950/50 border border-amber-500/50 px-2.5 py-1 rounded-xl shadow-md">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-mono font-black text-white">
            ✦ {radoxomsEarned}
          </span>
          <span className="text-[9px] font-mono text-slate-400">/{totalDisplayTarget}</span>
        </div>
      </div>

      {/* Dynamic Timer Countdown Line */}
      {!isSessionFinished && (
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden my-1">
          <div
            className={`h-full transition-all duration-100 rounded-full ${
              isTimerCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-400 to-amber-400'
            }`}
            style={{ width: `${timerRatio * 100}%` }}
          />
        </div>
      )}

      {/* MAIN SCREEN BODY (GAME QUESTION OVERLAY) */}
      {!isSessionFinished ? (
        <div className="flex-1 flex flex-col justify-between min-h-0 py-1 overflow-y-auto pr-0.5 space-y-2">
          {/* Question Text Panel with Aria Portrait */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 sm:p-3.5 shadow-lg flex items-start gap-2.5 shrink-0">
            <AriaAvatar size="question" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-500/40">
                  {currentQuestion.type ? currentQuestion.type.replace('_', ' ') : 'QUESTION'}
                </span>
                <span className="text-[8.5px] font-mono text-amber-400">⚡ +1 Radoxom</span>
                {questionState === 'TIMED_OUT' && (
                  <span className="text-[8.5px] font-mono text-rose-400 bg-rose-950 px-1 rounded border border-rose-500/40 ml-auto animate-pulse">
                    TIMED OUT
                  </span>
                )}
              </div>
              <h3 className="text-xs sm:text-base font-semibold text-white leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Monospace Code snippet block if applicable */}
              {currentQuestion.codeSnippet && (
                <div className="mt-1 p-2 rounded-lg bg-black/60 border border-slate-800 font-mono text-[10px] sm:text-xs text-sky-300 overflow-x-auto leading-relaxed max-h-[140px]">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>
          </div>

          {/* RESPONSIVE ANSWER GRID (Single column on narrow mobile, 2 columns on landscape/tablets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 my-auto pt-1">
            {(displayOptions.length > 0 ? displayOptions : currentQuestion.options).map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentQuestion.correctAnswer;

              let btnStyle =
                'bg-slate-900/85 hover:bg-slate-800/90 border-slate-700 text-slate-100 hover:border-sky-400 shadow-md';

              if (questionState === 'CORRECT' && isSelected) {
                btnStyle =
                  'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-[1.01] font-bold';
              } else if (questionState === 'INCORRECT' && isSelected) {
                btnStyle =
                  'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake';
              } else if ((questionState === 'INCORRECT' || questionState === 'TIMED_OUT') && isCorrect) {
                btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-semibold';
              } else if (questionState === 'TIMED_OUT') {
                btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60';
              }

              return (
                <button
                  key={idx}
                  onClick={(e) => handleSelectOption(option, e)}
                  disabled={isInputDisabled}
                  className={`relative text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-center gap-2 group cursor-pointer disabled:cursor-default min-h-[46px] active:scale-[0.98] ${btnStyle}`}
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 shrink-0 group-hover:border-sky-400">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs sm:text-sm font-mono leading-tight break-words flex-1">
                    {option}
                  </span>

                  {questionState === 'CORRECT' && isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0 animate-bounce" />
                  )}
                  {questionState === 'INCORRECT' && isSelected && (
                    <XCircle className="w-4 h-4 text-rose-400 ml-auto shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Aria Guidance Pill */}
          {activeHint && (
            <div
              className={`p-2 rounded-xl border flex items-center gap-2 text-xs leading-snug animate-fadeIn ${
                questionState === 'TIMED_OUT'
                  ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeHint}</span>
            </div>
          )}
        </div>
      ) : (
        /* IN-GAME VICTORY SUMMARY OVERLAY */
        <div className="my-auto text-center space-y-3 p-4 bg-slate-950/85 backdrop-blur-md border border-amber-500/40 rounded-2xl max-w-lg mx-auto shadow-2xl animate-fadeIn">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            <Zap className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
              {isRetry ? 'AMMO RECOVERY COMPLETE' : 'RADOXOM RESERVES READY'}
            </span>
            <h2 className="text-xl sm:text-2xl font-rpg font-black text-white mt-0.5">
              {isRetry ? (
                <>
                  Recovered <span className="text-amber-400">+{radoxomsEarned}</span>! Total:{' '}
                  <span className="text-sky-300">{totalCombinedAmmo}</span> Radoxoms
                </>
              ) : (
                <>
                  Earned <span className="text-amber-400">{radoxomsEarned} Radoxoms</span>!
                </>
              )}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              {radoxomsEarned > 0
                ? 'Your ammunition is charged. Prepare to enter the 1v1 action battle arena!'
                : 'Zero ammunition earned! You will rely entirely on tactical evasion and kinetic waves.'}
            </p>
          </div>

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              onClick={() => onComplete(isRetry ? totalCombinedAmmo : radoxomsEarned)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-rpg font-extrabold text-xs sm:text-sm tracking-wide rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-95 transition flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>COMMENCE BATTLE ⚔</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
