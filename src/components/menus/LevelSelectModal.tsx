import React, { useState } from 'react';
import { CURRICULUM_LEVELS } from '../../educational/curriculumData';
import { SoundManager } from '../../audio/SoundManager';
import { GameStateManager } from '../../state/GameState';
import { Lock, CheckCircle2, Play, X, Zap, Award } from 'lucide-react';

interface LevelSelectModalProps {
  unlockedLevelId: number;
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevelId,
  completedLevels,
  onSelectLevel,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categoryScores = GameStateManager.getInstance().getCategoryMasteryScores();

  const categories = [
    { id: 'all', label: 'All (42)' },
    { id: 'array_fundamentals', label: 'Fundamentals' },
    { id: 'indexing_slicing', label: 'Indexing & Slicing' },
    { id: 'shape_manipulation', label: 'Shape Manipulation' },
    { id: 'mathematical_operations', label: 'Math Operations' },
    { id: 'advanced_broadcasting', label: 'Broadcasting & Adv' },
  ];

  const filteredLevels = CURRICULUM_LEVELS.filter((level) => {
    if (selectedCategory === 'all') return true;
    return level.masteryCategory === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-4xl rpg-panel p-4 sm:p-6 shadow-2xl border-amber-500/40 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <span className="text-[10px] text-amber-400 font-rpg font-bold uppercase tracking-wider">
              Realm Campaign
            </span>
            <h2 className="text-lg sm:text-xl font-rpg font-bold text-white">SELECT EXPEDITION</h2>
          </div>
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Mastery Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const score = cat.id !== 'all' ? categoryScores[cat.id] : null;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  SoundManager.getInstance().playUiClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300'
                }`}
              >
                <span>{cat.label}</span>
                {score && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-slate-950/30 text-slate-950'
                        : score.percentage >= 75
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    {score.rank}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredLevels.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = level.id <= unlockedLevelId;

            return (
              <div
                key={level.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-60'
                    : isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 shadow-sm'
                    : 'bg-slate-900/90 border-amber-500/50 hover:border-amber-400 shadow-md shadow-amber-500/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-rpg font-bold text-amber-400">
                      LEVEL {level.id}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] text-sky-400 font-semibold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-0.5">{level.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{level.subtitle}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Topic: {level.topic}
                    </span>
                    <span className="text-[10px] text-amber-300 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-400" /> +{level.rewardXp} XP
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                  <button
                    disabled={!isUnlocked}
                    onClick={() => {
                      SoundManager.getInstance().playUiClick();
                      onSelectLevel(level.id);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-rpg font-bold flex items-center gap-1.5 transition ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Play className="w-3 h-3 fill-current" /> {isCompleted ? 'REPLAY' : 'ENTER'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" /> LOCKED
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
