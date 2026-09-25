import React, { useState } from 'react';
import { PuzzleGate, Question } from '../../types/curriculum';
import { QUESTION_BANK } from '../../educational/questionBank';
import { shuffleQuestion } from '../../educational/questionUtils';
import { SoundManager } from '../../audio/SoundManager';
import { Sparkles, X, CheckCircle, AlertCircle } from 'lucide-react';
import { AriaAvatar } from '../common/AriaAvatar';

interface PuzzleGateModalProps {
  gate: PuzzleGate;
  onSolved: () => void;
  onClose: () => void;
}

export const PuzzleGateModal: React.FC<PuzzleGateModalProps> = ({ gate, onSolved, onClose }) => {
  const [question] = useState<Question>(() => {
    const raw = QUESTION_BANK[gate.questionId] || Object.values(QUESTION_BANK)[0];
    return shuffleQuestion(raw);
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === question.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      SoundManager.getInstance().playCorrectAnswer();
      SoundManager.getInstance().playGateUnlock();
      setTimeout(() => {
        onSolved();
      }, 1200);
    } else {
      SoundManager.getInstance().playWrongAnswer();
      setShowHint(true);
      setTimeout(() => {
        setIsAnswered(false);
        setSelectedOption(null);
      }, 1600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-xl rpg-panel p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.3)] border-sky-400/60 flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            SoundManager.getInstance().playUiClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-rpg font-bold uppercase tracking-widest text-sky-400 mb-1">
          <Sparkles className="w-4 h-4 text-sky-400" />
          Runic Dimensional Barrier
        </div>
        <h2 className="text-xl sm:text-2xl font-rpg font-bold text-white mb-2">
          {gate.prompt}
        </h2>
        <p className="text-xs text-slate-300 mb-5">
          Solve the dimensional array equation to lower the drawbridge and proceed across the valley!
        </p>

        {/* Question Box */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 sm:p-5 mb-5">
          <h3 className="text-sm sm:text-base font-semibold text-slate-100 mb-3 leading-snug">
            {question.question}
          </h3>

          {question.codeSnippet && (
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-sky-300 overflow-x-auto mb-3">
              <code>{question.codeSnippet}</code>
            </pre>
          )}

          {/* Options Grid */}
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-sky-500/50 hover:bg-slate-800/60';
              if (isAnswered && isSelected) {
                btnStyle = isCorrect
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950 border-rose-500 text-rose-200 animate-shake';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-mono flex items-center justify-between transition cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isSelected && (
                    <span>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint Display on wrong answer */}
        {showHint && (
          <div className="p-3 bg-pink-950/70 border border-pink-500/50 rounded-xl text-xs text-pink-200 flex items-start gap-2">
            <AriaAvatar size="mini" />
            <div>
              <span className="font-bold text-pink-300">Aria's Whisper: </span>
              {question.hint}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
