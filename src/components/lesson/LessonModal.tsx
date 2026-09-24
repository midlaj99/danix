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
    if (text.includes('•') || text.includes('- ')) {
      return text
        .split(/[•\n-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  };

  const whatIsItBullets = formatBullets(theory.partA.explanation);
  const breakdownBullets = formatBullets(theory.partB.breakdown);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn overflow-hidden select-none"
      style={{
        paddingTop: 'max(0.4rem, env(safe-area-inset-top, 0.4rem))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
        paddingLeft: 'max(0.6rem, env(safe-area-inset-left, 0.6rem))',
        paddingRight: 'max(0.6rem, env(safe-area-inset-right, 0.6rem))',
      }}
    >
      {/* Semi-Transparent Glassmorphism Game Overlay */}
      <div className="relative w-full max-w-4xl h-full max-h-[96dvh] bg-slate-950/90 border border-amber-500/50 rounded-2xl p-3 sm:p-4 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col justify-between overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-pink-400/80 bg-slate-900 shrink-0">
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
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[8.5px] font-rpg font-bold px-1.5 py-0.2 rounded">
                  ARIA'S LESSON
                </span>
                <span className="text-slate-400 text-[9px] uppercase tracking-wider truncate max-w-[120px] xs:max-w-none">
                  {topicTitle}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-rpg font-bold text-white truncate max-w-[240px] xs:max-w-none">
                {levelTitle}
              </h2>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('theory');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9.5px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" /> Concept
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('code');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9.5px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3" /> Example
            </button>
            <button
              onClick={() => {
                SoundManager.getInstance().playUiClick();
                setActiveTab('practice');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9.5px] sm:text-xs font-rpg font-semibold transition cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" /> Check
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1 min-h-0">
          {/* TAB 1: BULLET POINT THEORY */}
          {activeTab === 'theory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 animate-fadeIn">
              {/* CARD 1: WHAT IS IT? */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <h3 className="text-amber-400 font-rpg font-bold text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHAT IS IT? — {theory.partA.title}</span>
                </h3>
                <ul className="space-y-1 text-xs text-slate-200">
                  {whatIsItBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CARD 2: KEY IDEA & ESSENTIAL MECHANICS */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <h4 className="text-sky-400 font-rpg font-bold text-xs mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                    <span>KEY IDEA & MECHANICS</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold shrink-0">•</span>
                      <span>
                        <strong className="text-sky-300">{theory.partA.concept}</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-sky-400 font-bold shrink-0">•</span>
                      <span className="leading-snug">{theory.partA.whyUseIt}</span>
                    </li>
                  </ul>
                </div>

                {/* Practical Use */}
                <div className="border-t border-slate-800/80 pt-1.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                    Applications:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {theory.partA.useCases.slice(0, 3).map((uc, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE EXAMPLE & OUTPUT */}
          {activeTab === 'code' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Code Window */}
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-2.5 py-1 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-sky-400">
                      <Code className="w-3 h-3" /> numpy_code.py
                    </span>
                    <span className="font-mono text-[9px]">Python 3</span>
                  </div>
                  <pre className="p-2.5 font-mono text-[11px] text-sky-300 overflow-x-auto leading-relaxed">
                    <code>{theory.partB.code}</code>
                  </pre>
                </div>

                {/* Output Console */}
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-inner">
                  <div className="bg-slate-900 px-2.5 py-1 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <Terminal className="w-3 h-3" /> Output
                    </span>
                    <span className="font-mono text-[9px] text-emerald-500">Executed</span>
                  </div>
                  <pre className="p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed bg-black/40 min-h-[60px]">
                    <code>{theory.partB.output}</code>
                  </pre>
                </div>
              </div>

              {/* Remember Bullets */}
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                <h4 className="text-amber-300 font-rpg font-bold text-xs mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHAT TO REMEMBER</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {breakdownBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span className="leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: MINI PRACTICE CHECKPOINT */}
          {activeTab === 'practice' && (
            <div className="space-y-2 animate-fadeIn">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/30">
                <span className="text-amber-400 font-rpg font-bold text-xs block mb-1">
                  Aria's Quick Check:
                </span>
                <p className="text-xs sm:text-sm text-white font-medium mb-2">
                  {practiceData.question}
                </p>

                {practiceData.codeSnippet && (
                  <div className="mb-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto">
                    <code>{practiceData.codeSnippet}</code>
                  </div>
                )}

                {/* Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {practiceData.options.map((opt, idx) => {
                    const isSelected = selectedPracticeOption === idx;
                    const isCorrect = idx === practiceData.correctIndex;

                    let btnStyle = 'bg-slate-950/80 border-slate-700 text-slate-200 hover:border-amber-400';
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
                        className={`p-2 rounded-xl border text-left font-mono text-[11px] transition flex items-center justify-between ${btnStyle} cursor-pointer`}
                      >
                        <span className="truncate pr-1">{opt}</span>
                        {hasAnsweredPractice && isCorrect && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        {hasAnsweredPractice && isSelected && !isCorrect && (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnsweredPractice && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-snug animate-fadeIn">
                    <strong className="text-amber-400 font-bold">Aria: </strong>
                    {practiceData.explanation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Proceed Button */}
        <div className="border-t border-slate-800/80 pt-2 mt-1 flex items-center justify-between shrink-0">
          <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-mono">
            {activeTab === 'practice'
              ? 'Ready? Proceed to earn Radoxom ammunition!'
              : 'Review bullet points, then start questions.'}
          </span>
          <button
            onClick={handleProceed}
            className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-rpg font-black text-xs tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition cursor-pointer"
          >
            <span>START QUESTIONS →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
