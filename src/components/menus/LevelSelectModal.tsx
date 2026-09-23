import React, { useState } from 'react';
import { CURRICULUM_LEVELS } from '../../educational/curriculumData';
import { SoundManager } from '../../audio/SoundManager';
import { GameStateManager } from '../../state/GameState';
import { Lock, CheckCircle2, Play, X, Zap, Award, Swords, Sparkles, Compass } from 'lucide-react';

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
    { id: 'all', label: 'All Expeditions (42)' },
    { id: 'array_fundamentals', label: 'Fundamentals' },
    { id: 'indexing_slicing', label: 'Indexing & Slicing' },
    { id: 'shape_manipulation', label: 'Shape & Reshape' },
    { id: 'mathematical_operations', label: 'Math Operations' },
    { id: 'advanced_broadcasting', label: 'Broadcasting & Adv' },
  ];

  const filteredLevels = CURRICULUM_LEVELS.filter((level) => {
    if (selectedCategory === 'all') return true;
    return level.masteryCategory === selectedCategory;
  });

  const completedCount = completedLevels.length;
  const progressPercent = Math.round((completedCount / CURRICULUM_LEVELS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-4xl rpg-panel p-4 sm:p-6 shadow-2xl my-auto flex flex-col max-h-[92vh]">
        {/* Header with Expedition Progress */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">
                  Realm Campaign Map
                </span>
                <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.2 rounded border border-amber-500/30">
                  {completedCount}/42 Cleared ({progressPercent}%)
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-rpg font-bold text-white tracking-wide">
                SELECT EXPEDITION
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              SoundManager.getInstance().playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
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
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-[1.02]'
                    : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {score && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? 'bg-slate-950/20 text-slate-950'
                        : score.percentage >= 75
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    Rank {score.rank}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Level Dossier Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {filteredLevels.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = level.id <= unlockedLevelId;

            return (
              <div
                key={level.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  !isUnlocked
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-55'
                    : isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-400/60 shadow-sm'
                    : 'bg-slate-900/90 border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-500/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-rpg font-bold px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        EXPEDITION {level.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px] sm:max-w-[180px]">
                        {level.topic}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] text-sky-300 font-semibold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1">{level.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">{level.subtitle}</p>

                  {/* Monster Threat & Rewards Badge */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] bg-slate-950 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded-lg font-mono flex items-center gap-1">
                      <Swords className="w-3 h-3 text-rose-400" />
                      {level.monster.name} ({level.monster.hp} HP)
                    </span>

                    <span className="text-[10px] bg-slate-950 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-lg font-mono flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-amber-400" /> +{level.rewardXp} XP
                    </span>

                    {level.unlockedSkill && (
                      <span className="text-[10px] bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-lg font-mono flex items-center gap-0.5">
                        <Award className="w-3 h-3 text-indigo-400" /> Skill: {level.unlockedSkill.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Tier {level.id <= 10 ? 'I' : level.id <= 20 ? 'II' : level.id <= 30 ? 'III' : 'IV'}
                  </span>

                  <button
                    disabled={!isUnlocked}
                    onClick={() => {
                      SoundManager.getInstance().playUiClick();
                      onSelectLevel(level.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-rpg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      !isUnlocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Play className="w-3 h-3 fill-current" /> {isCompleted ? 'REPLAY' : 'LAUNCH'}
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
