import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { RadoxomEconomyManager } from '../../game/systems/RadoxomEconomyManager';
import { BookOpen, CheckCircle2, XCircle, Zap, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

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

    // Shuffle options so correct answer is NEVER predictably at index 0 (no loopholes)
    if (currentQuestion && currentQuestion.options) {
      const opts = [...currentQuestion.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      setDisplayOptions(opts);
    }

    // Set authoritative deadline
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
    setActiveHint('Time expired! In rapid combat, decisive knowledge matters. 0 Radoxom awarded.');
    SoundManager.getInstance().playWrongAnswer();

    // Authoritative record in economy manager (zero reward)
    RadoxomEconomyManager.getInstance().recordQuestionResolvedWithoutReward(currentQuestion.id, true);

    setTimeout(() => {
      advanceQuestion();
    }, 2200);
  };

  const handleSelectOption = (opt: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Authoritative timestamp verification: reject late answers, double clicks, or inactive states
    if (
      questionLockedRef.current ||
      questionState !== 'QUESTION_ACTIVE' ||
      Date.now() >= deadlineRef.current
    ) {
      return;
    }

    // Immediately lock input
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

      // Transactionally award Radoxom via authoritative economy manager
      const awarded = RadoxomEconomyManager.getInstance().earnRadoxom(currentQuestion.id);

      if (awarded) {
        // Spawn flying Radoxom orb
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
        }, 650);
      }

      setTimeout(() => {
        advanceQuestion();
      }, 1400);
    } else {
      setQuestionState('INCORRECT');
      setActiveHint(currentQuestion.hint || currentQuestion.explanation);
      SoundManager.getInstance().playWrongAnswer();

      // Authoritative record of failure (zero reward)
      RadoxomEconomyManager.getInstance().recordQuestionResolvedWithoutReward(currentQuestion.id, false);

      setTimeout(() => {
        advanceQuestion();
      }, 2400);
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

  // Target total in retry vs standard
  const totalDisplayTarget = targetRadoxomsNeeded !== undefined ? targetRadoxomsNeeded : questions.length;
  const totalCombinedAmmo = existingRemainingAmmo + radoxomsEarned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Flying Radoxom Orbs Portal */}
      {flyingOrbs.map((orb) => (
        <div
          key={orb.id}
          className="fixed pointer-events-none z-50 flex items-center justify-center animate-flyToCounter"
          style={
            {
              left: `${orb.startX}px`,
              top: `${orb.startY}px`,
              '--target-x': 'calc(100vw - 220px)',
              '--target-y': '50px',
            } as React.CSSProperties
          }
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 h-10 rounded-full bg-amber-400/50 blur-md animate-ping" />
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-white shadow-[0_0_20px_#facc15] flex items-center justify-center font-bold text-[10px] text-amber-950">
              ⚡
            </div>
          </div>
        </div>
      ))}

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-sky-500/40 rounded-3xl shadow-[0_0_50px_rgba(56,189,248,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="relative px-6 py-4 bg-slate-900/90 border-b border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-sky-400">
                  {isRetry ? '⚔️ Combat Ammo Recovery' : "Aria's Academy"}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-amber-400 font-medium">{levelTitle}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{topicTitle}</h2>
            </div>
          </div>

          {/* Right Section: Question Timer + Radoxom Ammo Counter */}
          <div className="flex items-center gap-4">
            {/* Visual Timer Badge */}
            {!isSessionFinished && (
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
                  isTimerCritical
                    ? 'bg-rose-950/70 border-rose-500/70 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-800/80 border-slate-700 text-sky-300'
                }`}
              >
                <Clock className={`w-4 h-4 ${isTimerCritical ? 'text-rose-400' : 'text-sky-400'}`} />
                <span className="font-mono font-bold text-sm tracking-widest">
                  TIME: {String(timeLeft).padStart(2, '0')}s
                </span>
              </div>
            )}

            {/* Radoxom Ammo Counter */}
            <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-amber-400/30 blur-sm absolute inset-0 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-amber-950 font-black text-xs shadow-md">
                  ⚡
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-amber-300/80 tracking-wider">
                  {isRetry ? 'Ammo Recovered' : 'Radoxoms Earned'}
                </div>
                <div className="text-lg font-black text-amber-300">
                  {radoxomsEarned}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {totalDisplayTarget}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {!isSessionFinished ? (
          <div className="p-6 md:p-8 overflow-y-auto space-y-5">
            {/* Progress Bar & Question Counter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span>
                  QUESTION {currentIndex + 1} OF {questions.length}
                </span>
                <span className="text-sky-400 font-semibold">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Dynamic Countdown Bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 rounded-full ${
                    isTimerCritical ? 'bg-rose-500' : 'bg-sky-400'
                  }`}
                  style={{ width: `${timerRatio * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-5 shadow-inner">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/40">
                  {currentQuestion.type ? currentQuestion.type.replace('_', ' ') : 'MULTIPLE CHOICE'}
                </span>
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  ⚡ +1 Radoxom Ammo
                </span>
                {questionState === 'TIMED_OUT' && (
                  <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1 ml-auto bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> TIMED OUT
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-100 leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Monospace Code snippet block if applicable */}
              {currentQuestion.codeSnippet && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-sky-300 overflow-x-auto shadow-inner leading-relaxed">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {(displayOptions.length > 0 ? displayOptions : currentQuestion.options).map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;

                let btnStyle =
                  'bg-slate-800/70 hover:bg-slate-700/80 border-slate-700 text-slate-200 hover:border-sky-500/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]';

                if (questionState === 'CORRECT' && isSelected) {
                  btnStyle =
                    'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[1.02]';
                } else if (questionState === 'INCORRECT' && isSelected) {
                  btnStyle =
                    'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-shake';
                } else if ((questionState === 'INCORRECT' || questionState === 'TIMED_OUT') && isCorrect) {
                  btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                } else if (questionState === 'TIMED_OUT') {
                  btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                }

                return (
                  <button
                    key={idx}
                    onClick={(e) => handleSelectOption(option, e)}
                    disabled={isInputDisabled}
                    className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3 group cursor-pointer disabled:cursor-default ${btnStyle}`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 shrink-0 group-hover:border-sky-400 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-mono text-sm leading-snug pt-0.5">{option}</span>

                    {questionState === 'CORRECT' && isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto shrink-0 animate-bounce" />
                    )}
                    {questionState === 'INCORRECT' && isSelected && (
                      <XCircle className="w-5 h-5 text-rose-400 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Aria's Guidance / Feedback */}
            {activeHint && (
              <div
                className={`mt-4 p-4 rounded-2xl border flex items-start gap-3.5 animate-fadeIn ${
                  questionState === 'TIMED_OUT'
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-100/90'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-amber-950 font-bold shrink-0 shadow-md">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Aria's Guidance
                  </div>
                  <p className="text-sm mt-1 leading-relaxed">{activeHint}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Session Completed Summary */
          <div className="p-8 md:p-12 text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.4)] mb-2">
              <Zap className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {isRetry ? 'AMMO RECOVERY COMPLETE' : 'TRAINING SESSION COMPLETE'}
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {isRetry ? (
                  <>
                    Recovered <span className="text-amber-400">+{radoxomsEarned}</span> Ammo! Total:{' '}
                    <span className="text-sky-400">{totalCombinedAmmo}</span> Radoxoms
                  </>
                ) : (
                  <>
                    You Earned{' '}
                    <span className="text-amber-400 underline decoration-amber-500/50">
                      {radoxomsEarned} Radoxoms
                    </span>
                    !
                  </>
                )}
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {isRetry
                  ? `Your battle reserves are replenished. You have ${totalCombinedAmmo} Radoxoms ready to defeat the monster.`
                  : radoxomsEarned === questions.length
                  ? 'Flawless mastery! You have obtained full Radoxom ammunition for the upcoming monster battle.'
                  : radoxomsEarned > 0
                  ? `You have acquired ${radoxomsEarned} Radoxoms. Every shot counts—aim with precision and make each Radoxom hit!`
                  : 'You earned 0 Radoxoms! You will need to rely purely on your tactical evasion.'}
              </p>
            </div>

            {/* Radoxom Ammo Pod Display */}
            <div className="flex items-center justify-center gap-3 py-3">
              {Array.from({ length: isRetry ? totalCombinedAmmo : questions.length }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm border transition-all ${
                    idx < (isRetry ? totalCombinedAmmo : radoxomsEarned)
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 border-amber-300 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-110'
                      : 'bg-slate-800/50 border-slate-700 text-slate-600'
                  }`}
                >
                  ⚡
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={() => onComplete(isRetry ? totalCombinedAmmo : radoxomsEarned)}
                className="px-8 py-3.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-slate-950 font-bold rounded-2xl shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 mx-auto cursor-pointer"
              >
                <span>ENTER COMBAT PREPARATION</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
