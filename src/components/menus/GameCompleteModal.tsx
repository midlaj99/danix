import React from 'react';
import { TopicMastery } from '../../types/game';
import { SoundManager } from '../../audio/SoundManager';
import { Crown, Target, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

interface GameCompleteModalProps {
  topicMastery: TopicMastery;
  totalQuestions: number;
  totalCorrect: number;
  onOpenArena: () => void;
  onReturnToMenu: () => void;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  topicMastery,
  totalQuestions,
  totalCorrect,
  onOpenArena,
  onReturnToMenu,
}) => {
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 100;

  // Identify weak topics (< 75%)
  const weakTopics = Object.entries(topicMastery).filter(([_, data]) => data.percentage < 75);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in pointer-events-auto overflow-y-auto">
      <div className="relative w-full max-w-2xl rpg-panel p-8 shadow-2xl border-amber-500/60 my-auto flex flex-col items-center text-center">
        {/* Sovereign Crown */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-[0_0_40px_rgba(245,158,11,0.6)] mb-4 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
            <Crown className="w-14 h-14 text-amber-400" />
          </div>
        </div>

        <span className="text-xs font-rpg font-bold uppercase tracking-widest text-amber-400 mb-1">
          THE KINGDOM IS VICTORIOUS
        </span>

        <h1 className="text-3xl md:text-4xl font-rpg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 mb-2">
          NUMPY MASTER
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mb-6">
          You have traversed every zone of the kingdom, shattered the sentinels with vectorized calculations, and proved your true mastery of NumPy!
        </p>

        {/* Stats Summary Banner */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Accuracy</span>
            <div className="text-xl font-rpg font-bold text-amber-400">{accuracy}%</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Solved</span>
            <div className="text-xl font-rpg font-bold text-emerald-400">{totalCorrect}</div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Total Answered</span>
            <div className="text-xl font-rpg font-bold text-sky-400">{totalQuestions}</div>
          </div>
        </div>

        {/* Topic Mastery Breakdown */}
        <div className="w-full bg-slate-900/70 border border-slate-800 p-4 rounded-xl mb-6 text-left">
          <h3 className="text-xs font-rpg font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Curriculum Mastery Breakdown:
          </h3>
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {Object.keys(topicMastery).length === 0 ? (
              <div className="text-xs text-slate-400 italic">All kingdom topics cleared with flying colors!</div>
            ) : (
              Object.entries(topicMastery).map(([topic, data]) => (
                <div key={topic} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="capitalize text-slate-200">{topic.replace('_', ' ')}</span>
                    <span className="font-mono text-amber-400">{data.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        data.percentage >= 80
                          ? 'bg-emerald-500'
                          : data.percentage >= 60
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested Revision (if any) */}
        {weakTopics.length > 0 && (
          <div className="w-full bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl text-xs text-rose-200 text-left mb-6 flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300">Suggested Revision: </span>
              <span>
                {weakTopics.map(([t]) => t.replace('_', ' ')).join(', ')} could use additional drills in the Practice Arena.
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onOpenArena();
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-rpg font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
          >
            ENTER FREE PRACTICE ARENA <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onReturnToMenu();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-rpg text-xs py-2.5 px-6 rounded-xl transition cursor-pointer"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
