import React, { useState, useEffect } from 'react';
import { Question, MonsterArchetype } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { shuffleArray } from '../../educational/questionUtils';
import { Clock, ShieldAlert, Sparkles, CheckCircle, XCircle } from 'lucide-react';

interface CombatModalProps {
  monster: MonsterArchetype;
  monsterCurrentHp: number;
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswerCorrect: (combo: number) => void;
  onAnswerWrong: (hint: string) => void;
  onTimeout: () => void;
}

export const CombatModal: React.FC<CombatModalProps> = ({
  monster,
  monsterCurrentHp,
  question,
  questionIndex,
  totalQuestions,
  onAnswerCorrect,
  onAnswerWrong,
  onTimeout,
}) => {
  const maxTime = question.difficulty > 2 ? 22 : 16;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [resultState, setResultState] = useState<'answering' | 'correct' | 'wrong' | 'timeout'>('answering');
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [combo, setCombo] = useState<number>(1);
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);

  // CRITICAL FIX: Reset on question change while preserving active combo
  useEffect(() => {
    setTimeLeft(maxTime);
    setSelectedOption(null);
    setResultState('answering');
    setActiveHint(null);
    if (question && question.options) {
      setDisplayOptions(shuffleArray(question.options));
    }
  }, [question.id, questionIndex, maxTime]);

  // Timer countdown
  useEffect(() => {
    if (resultState !== 'answering') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setResultState('timeout');
          setCombo(1); // Reset combo on timeout
          SoundManager.getInstance().playWrongAnswer();
          onTimeout();
          return 0;
        }

        // Warning sound when 4 seconds or less
        if (prev <= 5) {
          SoundManager.getInstance().playTimerWarning();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resultState, onTimeout]);

  const handleSelectOption = (opt: string) => {
    if (resultState !== 'answering') return;
    setSelectedOption(opt);

    const isCorrect = opt === question.correctAnswer;
    if (isCorrect) {
      const currentCombo = combo;
      setResultState('correct');
      setCombo(prev => prev + 1);
      SoundManager.getInstance().playCorrectAnswer();
      setTimeout(() => {
        onAnswerCorrect(currentCombo);
      }, 600);
    } else {
      setResultState('wrong');
      setCombo(1); // Reset combo on wrong answer
      setActiveHint(question.hint);
      SoundManager.getInstance().playWrongAnswer();
      onAnswerWrong(question.hint);

      setTimeout(() => {
        setResultState('answering');
        setSelectedOption(null);
      }, 1800);
    }
  };

  const timerRatio = Math.max(0, timeLeft / maxTime);
  const isTimeCritical = timeLeft <= 5;
  const monsterHpRatio = Math.max(0, monsterCurrentHp / monster.maxHp);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-2 sm:p-4 pointer-events-none flex flex-col items-center justify-end pb-3 animate-fade-in">
      {/* Floating Hint or Status Banner Above Command Tray */}
      {activeHint && resultState === 'wrong' && (
        <div className="pointer-events-auto mb-2.5 max-w-3xl w-full p-2.5 sm:p-3 bg-pink-950/95 border-2 border-pink-500/80 rounded-xl text-pink-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-2xl animate-shake">
          <img
            src="/aria.png"
            alt="Aria"
            className="w-8 h-8 rounded-full object-cover border-2 border-pink-400 shrink-0"
          />
          <div>
            <span className="font-rpg font-bold text-pink-300">Aria's Guidance: </span>
            <span>{activeHint}</span>
          </div>
        </div>
      )}

      {resultState === 'timeout' && (
        <div className="pointer-events-auto mb-2.5 max-w-3xl w-full p-2.5 bg-rose-950/95 border-2 border-rose-500 rounded-xl text-rose-200 text-xs sm:text-sm flex items-center gap-2 shadow-2xl animate-shake">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-bold font-rpg">Time's up! The sentinel counters with full fury!</span>
        </div>
      )}

      {resultState === 'correct' && (
        <div className="pointer-events-auto mb-2.5 max-w-3xl w-full p-2.5 bg-emerald-950/95 border-2 border-emerald-500 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold font-rpg">
              CORRECT! Hero unleashes {combo > 2 ? `COMBO x${combo} CRITICAL` : 'Vector'} Strike!
            </span>
          </div>
          {combo > 1 && (
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-xs font-rpg">
              +{Math.round((combo - 1) * 20)}% BONUS DMG
            </span>
          )}
        </div>
      )}

      {/* Main Bottom Battle Command Card */}
      <div className="pointer-events-auto relative w-full max-w-4xl rpg-panel p-3 sm:p-4 shadow-2xl border-rose-500/50 bg-slate-950/92 backdrop-blur-md">
        {/* Top Header: Monster HP Meter & Timer */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          {/* Monster Info */}
          <div className="flex items-center space-x-2.5">
            <span className="text-sm sm:text-base text-rose-400 font-rpg font-bold">
              {monster.name}
            </span>
            <div className="w-32 sm:w-48 h-3 bg-slate-900 rounded-full border border-rose-600/50 overflow-hidden relative flex items-center">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-300 rounded-full"
                style={{ width: `${monsterHpRatio * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow">
                {monsterCurrentHp} / {monster.maxHp} HP
              </span>
            </div>
            {combo > 1 && (
              <span className="bg-amber-500/30 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-md text-[10px] font-rpg font-bold animate-pulse">
                COMBO x{combo}
              </span>
            )}
          </div>

          {/* Question Counter, Dodge Tip & Countdown Timer */}
          <div className="flex items-center gap-2.5">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 px-2 py-0.5 rounded text-[10px] font-rpg hidden md:inline">
              [C] DODGE ROLL
            </span>
            <span className="text-[11px] text-slate-400 font-rpg hidden sm:inline">
              Strike {questionIndex + 1} of {totalQuestions}
            </span>

            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono text-xs font-bold ${
                isTimeCritical
                  ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-900 border-amber-500/40 text-amber-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full transition-all duration-1000 ${
              isTimeCritical ? 'bg-rose-500' : 'bg-amber-400'
            }`}
            style={{ width: `${timerRatio * 100}%` }}
          />
        </div>

        {/* Question & Code Block (Compact Layout) */}
        <div className="mb-3">
          <div className="text-white text-xs sm:text-sm font-medium mb-1.5 flex items-center gap-1.5">
            <span className="text-amber-400 font-bold font-rpg">Q:</span>
            <span>{question.question}</span>
          </div>

          {question.codeSnippet && (
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-code text-[11px] sm:text-xs text-sky-300 overflow-x-auto shadow-inner">
              <pre className="m-0">
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* 4 Interactive Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(displayOptions.length > 0 ? displayOptions : question.options).map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === question.correctAnswer;

            let btnStyle =
              'bg-slate-900/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-800';

            if (resultState === 'correct' && isCorrect) {
              btnStyle =
                'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
            } else if (resultState === 'wrong' && isSelected) {
              btnStyle =
                'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_12px_rgba(239,68,68,0.4)]';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={resultState !== 'answering'}
                className={`px-3 py-2 rounded-lg border text-left font-code text-xs transition flex items-center justify-between ${btnStyle} cursor-pointer`}
              >
                <span className="truncate pr-2">{opt}</span>
                {resultState === 'correct' && isCorrect && (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {resultState === 'wrong' && isSelected && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
