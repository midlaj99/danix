import React, { useState } from 'react';
import { QUESTION_BANK } from '../../educational/questionBank';
import { Question } from '../../types/curriculum';
import { shuffleArray } from '../../educational/questionUtils';
import { SoundManager } from '../../audio/SoundManager';
import { ArrowLeft, Target, Flame, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react';

interface PracticeArenaProps {
  onRecordResult: (topic: string, isCorrect: boolean) => void;
  onBackToMenu: () => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  onRecordResult,
  onBackToMenu,
}) => {
  const allQuestions = Object.values(QUESTION_BANK);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');

  const filteredQuestions = allQuestions.filter(q => {
    if (selectedTopic !== 'all' && q.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex % Math.max(1, filteredQuestions.length)];

  React.useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      setDisplayOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestion?.id, currentIndex]);

  const handleSelectOption = (opt: string) => {
    if (feedback !== null || !currentQuestion) return;
    setSelectedOption(opt);

    const isCorrect = opt === currentQuestion.correctAnswer;
    if (isCorrect) {
      setFeedback('correct');
      setStreak(prev => prev + 1);
      setTotalSolved(prev => prev + 1);
      SoundManager.getInstance().playCorrectAnswer();
      onRecordResult(currentQuestion.topic, true);
    } else {
      setFeedback('wrong');
      setStreak(0);
      SoundManager.getInstance().playWrongAnswer();
      onRecordResult(currentQuestion.topic, false);
    }
  };

  const handleNextQuestion = () => {
    SoundManager.getInstance().playUiClick();
    setSelectedOption(null);
    setFeedback(null);
    setCurrentIndex(prev => prev + 1);
  };

  const topics = ['all', 'arrays', 'shape', 'dtype', 'indexing', 'slicing', 'reshape', 'creation', 'broadcasting', 'boolean_indexing'];

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl rpg-panel p-6 shadow-2xl border-amber-500/40 my-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                onBackToMenu();
              }}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 rounded-xl text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] text-amber-400 font-rpg font-bold uppercase tracking-wider">
                TRAINING GROUNDS
              </span>
              <h1 className="text-xl font-rpg font-bold text-white">NUMPY PRACTICE ARENA</h1>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-3 py-1 rounded-xl text-xs">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-slate-400">Streak:</span>
              <span className="font-mono font-bold text-amber-400">{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Solved:</span>
              <span className="font-mono font-bold text-emerald-400">{totalSolved}</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {topics.map(t => (
              <button
                key={t}
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  setSelectedTopic(t);
                  setCurrentIndex(0);
                  setFeedback(null);
                  setSelectedOption(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-rpg font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Question Area */}
        {currentQuestion ? (
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="uppercase font-mono text-amber-400">
                  Topic: {currentQuestion.topic}
                </span>
                <span>Difficulty: {'★'.repeat(currentQuestion.difficulty)}</span>
              </div>

              <h2 className="text-base md:text-lg font-medium text-white mb-4">
                {currentQuestion.question}
              </h2>

              {currentQuestion.codeSnippet && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-code text-xs md:text-sm text-sky-300 overflow-x-auto mb-4 leading-relaxed">
                  <pre>
                    <code>{currentQuestion.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(displayOptions.length > 0 ? displayOptions : currentQuestion.options).map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt === currentQuestion.correctAnswer;

                  let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400';
                  if (feedback !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      disabled={feedback !== null}
                      className={`p-3 rounded-xl border text-left font-code text-xs md:text-sm transition flex items-center justify-between ${btnStyle} cursor-pointer`}
                    >
                      <span>{opt}</span>
                      {feedback !== null && isCorrect && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {feedback !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Banner */}
              {feedback !== null && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                    feedback === 'correct'
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {feedback === 'correct' ? '✓ Correct Solution!' : '✗ Not Quite!'}
                  </div>
                  <div className="text-slate-300">{currentQuestion.explanation}</div>
                </div>
              )}
            </div>

            {/* Next Button */}
            {feedback !== null && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-rpg font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 transform active:scale-95 cursor-pointer"
                >
                  NEXT CHALLENGE <Sparkles className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            No questions found for the selected topic and difficulty.
          </div>
        )}
      </div>
    </div>
  );
};
