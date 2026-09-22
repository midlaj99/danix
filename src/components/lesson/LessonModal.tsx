import React, { useState, useEffect } from 'react';
import { LessonTheory, MiniPractice } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { shuffleMiniPractice } from '../../educational/questionUtils';
import { BookOpen, Code, Terminal, CheckCircle2, XCircle, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface LessonModalProps {
  levelTitle: string;
  topicTitle: string;
  theory: LessonTheory;
  miniPractice: MiniPractice;
  onFinishLesson: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  levelTitle,
  topicTitle,
  theory,
  miniPractice,
  onFinishLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'practice'>('theory');
  const [selectedPracticeOption, setSelectedPracticeOption] = useState<number | null>(null);
  const [hasAnsweredPractice, setHasAnsweredPractice] = useState(false);
  const [practiceData, setPracticeData] = useState<MiniPractice>(() => shuffleMiniPractice(miniPractice));

  useEffect(() => {
    setPracticeData(shuffleMiniPractice(miniPractice));
    setSelectedPracticeOption(null);
    setHasAnsweredPractice(false);
  }, [miniPractice]);

  const handleSelectPractice = (idx: number) => {
    if (hasAnsweredPractice) return;
    setSelectedPracticeOption(idx);
    setHasAnsweredPractice(true);
    if (idx === practiceData.correctIndex) {
      SoundManager.getInstance().playCorrectAnswer();
    } else {
      SoundManager.getInstance().playWrongAnswer();
    }
  };

  const handleProceed = () => {
    SoundManager.getInstance().playUiClick();
    onFinishLesson();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rpg-panel p-6 shadow-2xl my-auto border-amber-500/40">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-rpg font-bold px-2.5 py-0.5 rounded">
                LESSON ARCHIVE
              </span>
              <span className="text-slate-400 text-xs uppercase tracking-wider">{topicTitle}</span>
            </div>
            <h2 className="text-2xl font-rpg font-bold text-white mt-1">{levelTitle}</h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('theory');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rpg font-semibold transition ${
                activeTab === 'theory'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 1. Concept
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('code');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rpg font-semibold transition ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> 2. Code & Output
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('practice');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-rpg font-semibold transition ${
                activeTab === 'practice'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Mini Practice
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[320px] max-h-[60vh] overflow-y-auto pr-1">
          {/* TAB 1: THEORY / PART A */}
          {activeTab === 'theory' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <h3 className="text-amber-400 font-rpg font-bold text-lg mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {theory.partA.title}
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-2">
                  {theory.partA.explanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-sky-400 font-rpg font-semibold text-sm mb-2">
                    ⚡ Why do we use it?
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    {theory.partA.whyUseIt}
                  </p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-emerald-400 font-rpg font-semibold text-sm mb-2">
                    🌐 Real-World Data Science Use Cases
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {theory.partA.useCases.map((uc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{uc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE & VISUAL OUTPUT / PART B */}
          {activeTab === 'code' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Code Window */}
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Code className="w-3.5 h-3.5 text-sky-400" /> python_script.py
                    </span>
                    <span className="text-[10px] text-slate-400">NumPy 1.26+</span>
                  </div>
                  <pre className="p-4 font-code text-xs md:text-sm text-sky-300 overflow-x-auto leading-relaxed">
                    <code>{theory.partB.code}</code>
                  </pre>
                </div>

                {/* Execution Output Window */}
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                      <Terminal className="w-3.5 h-3.5" /> Output Terminal
                    </span>
                    <span className="text-[10px] text-emerald-400">Executed</span>
                  </div>
                  <pre className="p-4 font-code text-xs md:text-sm text-emerald-400 overflow-x-auto leading-relaxed bg-black/60 min-h-[120px]">
                    <code>{theory.partB.output}</code>
                  </pre>
                </div>
              </div>

              {/* Visual Array Structure */}
              {theory.partB.visualArray && (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-amber-400 font-rpg font-semibold text-xs mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Visual Memory Representation:
                  </h4>
                  <div className="flex flex-col gap-2 items-center justify-center py-2 bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
                    {theory.partB.visualArray.map((row, rIdx) => (
                      <div key={rIdx} className="flex gap-2">
                        {row.map((cell, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-16 h-12 bg-gradient-to-b from-sky-950 to-slate-900 border border-sky-400/60 rounded-md flex flex-col items-center justify-center font-code text-xs text-sky-200 shadow-sm"
                          >
                            <span className="font-bold">{cell}</span>
                            <span className="text-[9px] text-slate-500">[{rIdx},{cIdx}]</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {theory.partB.breakdown}
              </div>
            </div>
          )}

          {/* TAB 3: MINI PRACTICE */}
          {activeTab === 'practice' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-rpg font-bold text-sm">Aria's Checkpoint:</span>
                </div>
                <p className="text-base text-white font-medium mb-4">{miniPractice.question}</p>

                {miniPractice.codeSnippet && (
                  <div className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 font-code text-xs text-sky-300">
                    <code>{miniPractice.codeSnippet}</code>
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {practiceData.options.map((opt, idx) => {
                    const isSelected = selectedPracticeOption === idx;
                    const isCorrect = idx === practiceData.correctIndex;

                    let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400';
                    if (hasAnsweredPractice) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectPractice(idx)}
                        disabled={hasAnsweredPractice}
                        className={`p-3 rounded-xl border text-left font-code text-xs transition flex items-center justify-between ${btnStyle} cursor-pointer`}
                      >
                        <span>{opt}</span>
                        {hasAnsweredPractice && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {hasAnsweredPractice && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {hasAnsweredPractice && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs leading-relaxed animate-fade-in">
                    <span className="font-bold text-amber-400 font-rpg">Explanation: </span>
                    <span className="text-slate-300">{miniPractice.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {activeTab === 'theory' && 'Step 1/3: Understand the Core Concept'}
            {activeTab === 'code' && 'Step 2/3: Study the Vectorized Code & Diagram'}
            {activeTab === 'practice' && (hasAnsweredPractice ? 'Checkpoint Completed!' : 'Step 3/3: Verify Understanding')}
          </div>

          <div className="flex gap-2">
            {activeTab !== 'practice' ? (
              <button
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  setActiveTab(activeTab === 'theory' ? 'code' : 'practice');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-rpg font-semibold text-xs px-4 py-2 rounded-lg border border-slate-700 hover:border-amber-400 transition flex items-center gap-1.5 cursor-pointer"
              >
                NEXT SECTION <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleProceed}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-bold text-sm px-6 py-2.5 rounded-lg shadow-lg shadow-amber-500/20 transition flex items-center gap-2 transform active:scale-95 cursor-pointer"
              >
                ENTER WORLD & SLAY SENTINEL <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
