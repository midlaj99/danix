import React, { useState, useEffect } from 'react';
import { LessonTheory, MiniPractice } from '../../types/curriculum';
import { SoundManager } from '../../audio/SoundManager';
import { shuffleMiniPractice } from '../../educational/questionUtils';
import { BookOpen, Code, Terminal, CheckCircle2, XCircle, ArrowRight, Sparkles, Layers, Lightbulb, AlertTriangle } from 'lucide-react';

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

  // Convert raw explanation string into crisp bullet points
  const formatBullets = (text: string): string[] => {
    if (!text) return [];
    // If text already has bullets, split by them
    if (text.includes('•') || text.includes('- ')) {
      return text
        .split(/[•\n-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    // Otherwise split by sentence
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  };

  const whatIsItBullets = formatBullets(theory.partA.explanation);
  const breakdownBullets = formatBullets(theory.partB.breakdown);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      style={{
        paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0.5rem))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
      }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto flex flex-col max-h-[92vh]">
        {/* Header with Aria Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-3 gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-pink-400/80 bg-slate-950 shrink-0">
              <img
                src="/aria.png"
                alt="Aria"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = './aria/aria.png';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] sm:text-[10px] font-rpg font-bold px-1.5 py-0.2 rounded">
                  ARIA'S LESSON
                </span>
                <span className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider truncate max-w-[150px] xs:max-w-none">
                  {topicTitle}
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-rpg font-bold text-white truncate max-w-[280px] xs:max-w-none">
                {levelTitle}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('theory');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" /> 1. Concept
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('code');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3" /> 2. Example
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('practice');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> 3. Practice
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1 min-h-0">
          {/* TAB 1: STRUCTURED THEORY CARDS */}
          {activeTab === 'theory' && (
            <div className="space-y-3 animate-fade-in">
              {/* CARD 1: WHAT IS IT? */}
              <div className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h3 className="text-amber-400 font-rpg font-bold text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHAT IS IT? — {theory.partA.title}</span>
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {whatIsItBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CARD 2: KEY TERMS & CORE CONCEPTS */}
              <div className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h4 className="text-sky-400 font-rpg font-bold text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                  <span>KEY IDEA & ESSENTIAL MECHANICS</span>
                </h4>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold shrink-0">•</span>
                    <span>
                      <strong className="text-sky-300">{theory.partA.concept}</strong>: The foundation of fast numerical calculations in Python.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{theory.partA.whyUseIt}</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: REAL-WORLD IMPACT */}
              <div className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h4 className="text-emerald-400 font-rpg font-bold text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WHERE IS THIS USED IN DATA SCIENCE?</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] sm:text-xs text-slate-300">
                  {theory.partA.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CODE EXAMPLE & VISUAL OUTPUT */}
          {activeTab === 'code' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Code Window */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Code className="w-3 h-3 text-sky-400" /> numpy_code.py
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Python 3 / NumPy</span>
                  </div>
                  <pre className="p-3 font-mono text-[11px] sm:text-xs text-sky-300 overflow-x-auto leading-relaxed max-w-full">
                    <code>{theory.partB.code}</code>
                  </pre>
                </div>

                {/* Output Terminal */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                      <Terminal className="w-3 h-3" /> Output Console
                    </span>
                    <span className="text-[9px] text-emerald-500 font-mono">Executed</span>
                  </div>
                  <pre className="p-3 font-mono text-[11px] sm:text-xs text-emerald-400 overflow-x-auto leading-relaxed bg-black/50 min-h-[90px] max-w-full">
                    <code>{theory.partB.output}</code>
                  </pre>
                </div>
              </div>

              {/* CARD: WHAT TO REMEMBER */}
              <div className="bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                <h4 className="text-amber-300 font-rpg font-bold text-xs sm:text-sm mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHAT TO REMEMBER & CODE BREAKDOWN</span>
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {breakdownBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: MINI PRACTICE CHECKPOINT */}
          {activeTab === 'practice' && (
            <div className="space-y-3 animate-fade-in">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-amber-400 font-rpg font-bold text-xs sm:text-sm">
                    Aria's Quick Check:
                  </span>
                </div>
                <p className="text-sm sm:text-base text-white font-medium mb-3">
                  {practiceData.question}
                </p>

                {practiceData.codeSnippet && (
                  <div className="mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto">
                    <code>{practiceData.codeSnippet}</code>
                  </div>
                )}

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {practiceData.options.map((opt, idx) => {
                    const isSelected = selectedPracticeOption === idx;
                    const isCorrect = idx === practiceData.correctIndex;

                    let btnStyle = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-amber-400';
                    if (hasAnsweredPractice) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_12px_rgba(34,197,94,0.3)]';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 font-bold';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectPractice(idx)}
                        disabled={hasAnsweredPractice}
                        className={`p-2.5 rounded-xl border text-left font-mono text-[11px] sm:text-xs transition flex items-center justify-between ${btnStyle} cursor-pointer`}
                      >
                        <span className="truncate pr-2">{opt}</span>
                        {hasAnsweredPractice && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {hasAnsweredPractice && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on answer */}
                {hasAnsweredPractice && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 leading-relaxed animate-fade-in">
                    <strong className="text-amber-400 font-bold">Aria explains: </strong>
                    {practiceData.explanation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Proceed Button */}
        <div className="border-t border-slate-800 pt-3 mt-2 flex items-center justify-between shrink-0">
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {activeTab === 'practice'
              ? 'Complete the check or proceed directly to question challenge'
              : 'Review concepts, then proceed to harvest Radoxom energy'}
          </span>
          <button
            onClick={handleProceed}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-black text-xs sm:text-sm tracking-wide flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition cursor-pointer"
          >
            <span>START QUESTIONS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
