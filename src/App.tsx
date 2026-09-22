import React, { useState, useEffect, useRef } from 'react';
import { GameScreen, SaveData, CombatStats } from './types/game';
import { CURRICULUM_LEVELS } from './educational/curriculumData';
import { QUESTION_BANK } from './educational/questionBank';
import { LevelConfig, Question } from './types/curriculum';
import { GameStateManager } from './state/GameState';
import { SoundManager } from './audio/SoundManager';
import { GameEngine } from './game/GameEngine';
import { shuffleQuestion } from './educational/questionUtils';

// Components
import { MainMenu } from './components/menus/MainMenu';
import { PlayerHUD } from './components/hud/PlayerHUD';
import { ControlsBar } from './components/hud/ControlsBar';
import { AriaDialogue } from './components/dialogue/AriaDialogue';
import { LessonModal } from './components/lesson/LessonModal';
import { MonsterIntroModal } from './components/combat/MonsterIntroModal';
import { CombatModal } from './components/combat/CombatModal';
import { QuestionSessionModal } from './components/combat/QuestionSessionModal';
import { CombatPrepModal } from './components/combat/CombatPrepModal';
import { RealTimeCombatHUD } from './components/combat/RealTimeCombatHUD';
import { LevelSelectModal } from './components/menus/LevelSelectModal';
import { SettingsModal } from './components/menus/SettingsModal';
import { DeathModal } from './components/menus/DeathModal';
import { LevelCompleteModal } from './components/menus/LevelCompleteModal';
import { GameCompleteModal } from './components/menus/GameCompleteModal';
import { PracticeArena } from './components/arena/PracticeArena';
import { SkillUnlockModal } from './components/menus/SkillUnlockModal';
import { PuzzleGateModal } from './components/puzzle/PuzzleGateModal';
import { TouchControls } from './components/hud/TouchControls';
import { MobileOrientationGuard } from './components/mobile/MobileOrientationGuard';
import { Trophy } from 'lucide-react';
import { CombatAIDebugSnapshot } from './game/ai/CombatDirector';
import { RadoxomEconomyManager } from './game/systems/RadoxomEconomyManager';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<SaveData>(GameStateManager.getInstance().getState());
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('MAIN_MENU');
  const [lessonPhase, setLessonPhase] = useState<'dialogue' | 'lesson'>('dialogue');
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string>('Array Strike');
  const [unlockedSkillCelebration, setUnlockedSkillCelebration] = useState<{
    name: string;
    description: string;
    icon: string;
  } | null>(null);
  const [showPuzzleGateModal, setShowPuzzleGateModal] = useState(false);
  const [achievementToast, setAchievementToast] = useState<{ id: string; title: string } | null>(null);

  // Real-time Combat & Radoxom state
  const [radoxomsEarned, setRadoxomsEarned] = useState<number>(0);
  const [radoxomsAvailable, setRadoxomsAvailable] = useState<number>(0);
  const [deathReason, setDeathReason] = useState<'slain' | 'ammo_exhausted'>('slain');
  const [combatStats, setCombatStats] = useState<CombatStats>({
    radoxomsEarned: 0,
    radoxomsFired: 0,
    radoxomsHit: 0,
    radoxomsMissed: 0,
    damageDealt: 0,
    damageTaken: 0,
    attacksDodged: 0,
    accuracy: 0,
  });
  const [isRetrySession, setIsRetrySession] = useState<boolean>(false);
  const [retryTargetNeeded, setRetryTargetNeeded] = useState<number>(0);
  const [retryExistingAmmo, setRetryExistingAmmo] = useState<number>(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // Active level data
  const currentLevelId = gameState.currentLevelId;
  const activeLevelConfig: LevelConfig =
    CURRICULUM_LEVELS.find((l) => l.id === currentLevelId) || CURRICULUM_LEVELS[0];

  // Combat state
  const [monsterCurrentHp, setMonsterCurrentHp] = useState<number>(activeLevelConfig.monster.hp);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [heroStamina, setHeroStamina] = useState<number>(100);
  const [aiDebugSnapshot, setAiDebugSnapshot] = useState<CombatAIDebugSnapshot | null>(null);

  // Keyboard shortcut for Escape key (pause), Backtick (AI Debug) and 1/2/3 skill switching
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '`' || e.key === '~') {
        if (engineRef.current) {
          engineRef.current.toggleAIDebugOverlay();
        }
        return;
      }

      if (e.code === 'Escape') {
        if (currentScreen === 'EXPLORATION' || currentScreen === 'COMBAT' || currentScreen === 'REALTIME_COMBAT') {
          setShowSettings(prev => !prev);
        }
      }

      // Skill hotkeys 1, 2, 3, 4
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const skillIdx = parseInt(e.code.replace('Digit', '')) - 1;
        const availableSkills = gameState.playerStats.skills;
        if (skillIdx >= 0 && skillIdx < availableSkills.length) {
          const selected = availableSkills[skillIdx];
          setActiveSkill(selected);
          if (engineRef.current) {
            engineRef.current.hero.setSkill(selected);
          }
          SoundManager.getInstance().playUiClick();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [currentScreen, gameState.playerStats.skills]);

  // Subscribe to game state updates
  useEffect(() => {
    const unsub = GameStateManager.getInstance().subscribe(() => {
      setGameState({ ...GameStateManager.getInstance().getState() });
    });
    return unsub;
  }, []);

  // Handle Background Music transitions based on screen
  useEffect(() => {
    if (currentScreen === 'MAIN_MENU') {
      SoundManager.getInstance().playMusic('MAIN_MENU');
    } else if (currentScreen === 'ARIA_LESSON') {
      SoundManager.getInstance().playMusic('LESSON');
    } else if (currentScreen === 'EXPLORATION') {
      SoundManager.getInstance().playMusic('EXPLORATION');
    } else if (currentScreen === 'COMBAT' || currentScreen === 'REALTIME_COMBAT' || currentScreen === 'COMBAT_PREP') {
      SoundManager.getInstance().playMusic(activeLevelConfig.id >= 8 ? 'BOSS' : 'COMBAT');
    }
  }, [currentScreen, activeLevelConfig.id]);

  const triggerAchievement = (id: string, title: string) => {
    const isNew = GameStateManager.getInstance().unlockAchievement(id);
    if (isNew) {
      SoundManager.getInstance().playGateUnlock();
      setAchievementToast({ id, title });
      setTimeout(() => {
        setAchievementToast(null);
      }, 4000);
    }
  };

  // Initialize or update canvas game engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = new GameEngine(canvas, activeLevelConfig);
    engineRef.current = engine;
    engine.hero.setSkill(activeSkill);

    engine.onEncounter = () => {
      if (engineRef.current) {
        engineRef.current.isCinematicIntro = true;
      }
      setCurrentScreen('MONSTER_INTRO');
    };

    engine.onHeroDeath = () => {
      SoundManager.getInstance().playPlayerDeath();
      setDeathReason('slain');
      setCurrentScreen('PLAYER_DEATH');
    };

    engine.onCombatVictory = (stats) => {
      setCombatStats(stats);
      GameStateManager.getInstance().completeCurrentLevel(
        activeLevelConfig.rewardXp,
        activeLevelConfig.unlockedSkill?.name
      );

      if (activeLevelConfig.id === 1) {
        triggerAchievement('FIRST_ARRAY', 'First Array Formed: Journey Begun!');
      }
      if (activeLevelConfig.id >= CURRICULUM_LEVELS.length) {
        triggerAchievement('NUMPY_MASTER', 'Grand Sovereign: NumPy Mastery Attained!');
      }

      if (activeLevelConfig.unlockedSkill) {
        setUnlockedSkillCelebration(activeLevelConfig.unlockedSkill);
        setActiveSkill(activeLevelConfig.unlockedSkill.name);
        if (engineRef.current) {
          engineRef.current.hero.setSkill(activeLevelConfig.unlockedSkill.name);
        }
      }

      if (activeLevelConfig.id >= CURRICULUM_LEVELS.length) {
        setCurrentScreen('GAME_COMPLETE');
      } else {
        setCurrentScreen('LEVEL_COMPLETE');
      }
    };

    engine.onCombatDefeat = (stats, reason) => {
      setCombatStats(stats);
      setDeathReason(reason);
      setCurrentScreen('PLAYER_DEATH');
    };

    engine.onRadoxomCountChanged = (count) => {
      setRadoxomsAvailable(count);
    };

    engine.onCombatStatsUpdated = (stats) => {
      setCombatStats({ ...stats });
    };

    engine.onHeroHealthChanged = () => {
      setGameState({ ...GameStateManager.getInstance().getState() });
    };

    engine.onMonsterHealthChanged = (hp) => {
      setMonsterCurrentHp(hp);
    };

    engine.onHeroStaminaChanged = (stamina) => {
      setHeroStamina(stamina);
    };

    engine.onAIDebugUpdate = (snapshot) => {
      setAiDebugSnapshot(snapshot);
    };

    engine.onShrineActivated = () => {
      GameStateManager.getInstance().healFull();
      GameStateManager.getInstance().addXp(50);
      triggerAchievement('SHRINE_DEVOTEE', "Aria's Blessing: Shrine Devotee");
    };

    engine.onPuzzleGatePrompt = () => {
      setShowPuzzleGateModal(true);
    };

    engine.handleResize(canvas.width, canvas.height);
    engine.start();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        engine.handleResize(canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
    };
  }, [currentLevelId]);

  // Dynamic question resolver with fresh questions on retry
  const [activeQuestionSet, setActiveQuestionSet] = useState<Question[]>([]);

  // Function to generate fresh question set (mathematically ensures enough questions to defeat monster + margin)
  const generateFreshQuestions = (config: LevelConfig, excludeIds?: Set<string>): Question[] => {
    const allQuestions: Question[] = config.questionIds
      .map((id) => QUESTION_BANK[id])
      .filter(Boolean);

    let candidates = allQuestions;
    if (excludeIds && excludeIds.size > 0) {
      const unused = allQuestions.filter((q) => !excludeIds.has(q.id));
      if (unused.length >= 2) {
        candidates = unused;
      }
    }

    // Shuffle question pool to guarantee fresh equivalent questions on retry, with randomized option order
    const shuffled = [...candidates].sort(() => Math.random() - 0.5).map(shuffleQuestion);
    const minHits = Math.ceil(config.monster.hp / 50);
    // Guarantee at least minHits + 1 questions, up to full pool
    const targetCount = Math.min(shuffled.length, Math.max(5, minHits + 1));
    return shuffled.slice(0, targetCount);
  };

  useEffect(() => {
    setActiveQuestionSet(generateFreshQuestions(activeLevelConfig));
  }, [activeLevelConfig]);

  const levelQuestions = (activeQuestionSet.length > 0
    ? activeQuestionSet
    : activeLevelConfig.questionIds.map((id) => QUESTION_BANK[id]).filter(Boolean)
  ).map(shuffleQuestion);

  const activeQuestion: Question =
    levelQuestions[currentQuestionIndex % Math.max(1, levelQuestions.length)] ||
    Object.values(QUESTION_BANK)[0];

  /* ------------------- GAMEPLAY ACTION HANDLERS ------------------- */

  const startLevelJourney = (levelId: number) => {
    GameStateManager.getInstance().setCurrentLevel(levelId);
    GameStateManager.getInstance().healFull();

    const config = CURRICULUM_LEVELS.find((l) => l.id === levelId) || CURRICULUM_LEVELS[0];
    setMonsterCurrentHp(config.monster.hp);
    setCurrentQuestionIndex(0);
    setLessonPhase('dialogue');
    setRadoxomsEarned(0);
    setRadoxomsAvailable(0);
    setIsRetrySession(false);
    setRetryTargetNeeded(0);
    setRetryExistingAmmo(0);
    setUsedQuestionIds(new Set());

    // Initialize authoritative attempt in economy manager
    RadoxomEconomyManager.getInstance().startLevelAttempt(
      levelId,
      config.topic || 'arrays',
      config.questionIds.length
    );

    setActiveQuestionSet(generateFreshQuestions(config));

    if (engineRef.current) {
      engineRef.current.setLevel(config);
    }

    setCurrentScreen('ARIA_LESSON');
  };

  const handleFinishAriaLesson = () => {
    setCurrentScreen('QUESTION_SESSION');
  };

  const handleQuestionSessionComplete = (totalAmmo: number) => {
    setRadoxomsEarned(totalAmmo);
    setRadoxomsAvailable(totalAmmo);
    setIsRetrySession(false);
    setCurrentScreen('COMBAT_PREP');
  };

  const handleCommenceCombat = () => {
    setCurrentScreen('REALTIME_COMBAT');
    setMonsterCurrentHp(activeLevelConfig.monster.hp);
    if (engineRef.current) {
      engineRef.current.startRealtimeCombat(radoxomsAvailable);
    }
  };

  const handleRetryCombat = () => {
    GameStateManager.getInstance().healFull();
    setMonsterCurrentHp(activeLevelConfig.monster.hp);

    const { targetToRecover, existingRemaining } = RadoxomEconomyManager.getInstance().prepareRetryAttempt();

    if (targetToRecover > 0) {
      // Player spent ammo in combat: must recover missing ammo via fresh questions!
      setIsRetrySession(true);
      setRetryTargetNeeded(targetToRecover);
      setRetryExistingAmmo(existingRemaining);

      const newUsed = new Set(usedQuestionIds);
      activeQuestionSet.forEach((q) => newUsed.add(q.id));
      setUsedQuestionIds(newUsed);

      const freshQuestions = generateFreshQuestions(activeLevelConfig, newUsed);
      setActiveQuestionSet(freshQuestions);
      setCurrentQuestionIndex(0);
      setCurrentScreen('QUESTION_SESSION');
    } else {
      // Already has required ammo: jump straight into combat
      setRadoxomsAvailable(existingRemaining);
      setCurrentScreen('REALTIME_COMBAT');
      if (engineRef.current) {
        engineRef.current.startRealtimeCombat(existingRemaining);
      }
    }
  };

  const handleRePracticeQuestions = () => {
    // Re-practice all questions from scratch
    RadoxomEconomyManager.getInstance().startLevelAttempt(
      activeLevelConfig.id,
      activeLevelConfig.topic || 'arrays',
      activeLevelConfig.questionIds.length
    );
    setRadoxomsEarned(0);
    setRadoxomsAvailable(0);
    setIsRetrySession(false);
    setRetryTargetNeeded(0);
    setRetryExistingAmmo(0);
    setActiveQuestionSet(generateFreshQuestions(activeLevelConfig));
    setCurrentQuestionIndex(0);
    setCurrentScreen('QUESTION_SESSION');
  };

  const handleStartCombatFromIntro = () => {
    if (radoxomsEarned > 0) {
      setCurrentScreen('COMBAT_PREP');
    } else {
      setCurrentScreen('QUESTION_SESSION');
    }
  };

  const handleAnswerCorrect = (combo: number = 1) => {
    const baseDamage = Math.round(activeLevelConfig.monster.hp / 2.5);
    const comboMultiplier = 1 + (combo - 1) * 0.2;
    const damage = Math.round(baseDamage * comboMultiplier);
    const newMonsterHp = Math.max(0, monsterCurrentHp - damage);
    setMonsterCurrentHp(newMonsterHp);

    GameStateManager.getInstance().recordAnswer(activeQuestion.topic, true);

    if (combo >= 3) {
      triggerAchievement('COMBO_MASTER', 'Combo Maestro: 3+ Consecutive Vector Strikes!');
    }

    if (engineRef.current) {
      engineRef.current.executeHeroAttack(damage, combo > 1);
    }

    if (newMonsterHp <= 0) {
      // Monster defeated!
      setTimeout(() => {
        GameStateManager.getInstance().completeCurrentLevel(
          activeLevelConfig.rewardXp,
          activeLevelConfig.unlockedSkill?.name
        );

        if (activeLevelConfig.id === 1) {
          triggerAchievement('FIRST_ARRAY', 'First Array Formed: Journey Begun!');
        }
        if (activeLevelConfig.id >= CURRICULUM_LEVELS.length) {
          triggerAchievement('NUMPY_MASTER', 'Grand Sovereign: NumPy Mastery Attained!');
        }

        if (activeLevelConfig.unlockedSkill) {
          setUnlockedSkillCelebration(activeLevelConfig.unlockedSkill);
          setActiveSkill(activeLevelConfig.unlockedSkill.name);
          if (engineRef.current) {
            engineRef.current.hero.setSkill(activeLevelConfig.unlockedSkill.name);
          }
        }

        if (activeLevelConfig.id >= CURRICULUM_LEVELS.length) {
          setCurrentScreen('GAME_COMPLETE');
        } else {
          setCurrentScreen('LEVEL_COMPLETE');
        }
      }, 1300);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1100);
    }
  };

  const handlePuzzleGateSolved = () => {
    if (activeLevelConfig.puzzleGate) {
      activeLevelConfig.puzzleGate.activated = true;
    }
    setShowPuzzleGateModal(false);
    triggerAchievement('DIMENSION_EXPLORER', 'Dimensional Pioneer: Runic Bridge Activated!');

    if (engineRef.current) {
      engineRef.current.particles.spawnSparks(
        activeLevelConfig.puzzleGate?.x || 500,
        engineRef.current.groundY - 40,
        '#38bdf8',
        35
      );
      engineRef.current.particles.spawnDamageText(
        engineRef.current.hero.x,
        engineRef.current.hero.y - 25,
        '⚡ RUNIC BRIDGE OPENED! ⚡',
        true
      );
    }
  };

  const handleAnswerWrong = (_hint: string) => {
    GameStateManager.getInstance().recordAnswer(activeQuestion.topic, false);
  };

  const handleCombatTimeout = () => {
    GameStateManager.getInstance().recordAnswer(activeQuestion.topic, false);
    const monsterAttack = activeLevelConfig.monster.attack;
    const dmgResult = GameStateManager.getInstance().takeDamage(monsterAttack);
    const remainingHp = dmgResult.hpRemaining;

    if (engineRef.current) {
      engineRef.current.executeMonsterAttack(monsterAttack);
    }

    if (remainingHp <= 0) {
      setTimeout(() => {
        SoundManager.getInstance().playPlayerDeath();
        setCurrentScreen('PLAYER_DEATH');
      }, 1200);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1300);
    }
  };

  const handleRestartLevel = () => {
    startLevelJourney(currentLevelId);
  };

  const handleProceedNextLevel = () => {
    const nextLvl = currentLevelId + 1;
    if (nextLvl <= CURRICULUM_LEVELS.length) {
      startLevelJourney(nextLvl);
    } else {
      setCurrentScreen('GAME_COMPLETE');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Mobile Horizontal Orientation Guard */}
      <MobileOrientationGuard />

      {/* 2D Canvas Game World */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block ${
          currentScreen === 'MAIN_MENU' || currentScreen === 'PRACTICE_ARENA' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Persistent Player HUD during active level states */}
      {(currentScreen === 'EXPLORATION' ||
        currentScreen === 'MONSTER_INTRO' ||
        currentScreen === 'COMBAT') && (
        <>
          <PlayerHUD
            stats={gameState.playerStats}
            levelTitle={`Lvl ${activeLevelConfig.id}: ${activeLevelConfig.title}`}
            topicTitle={activeLevelConfig.topic}
            activeSkill={activeSkill}
            onSelectSkill={(skillName) => {
              setActiveSkill(skillName);
              if (engineRef.current) {
                engineRef.current.hero.setSkill(skillName);
              }
            }}
            isMuted={gameState.settings.muted}
            onToggleMute={() => {
              const nextMute = !gameState.settings.muted;
              SoundManager.getInstance().setMuted(nextMute);
              GameStateManager.getInstance().updateSettings({ muted: nextMute });
            }}
            onOpenSettings={() => setShowSettings(true)}
            onOpenLevelSelect={() => setShowLevelSelect(true)}
          />
          {currentScreen === 'EXPLORATION' && <ControlsBar />}
        </>
      )}

      {/* Mobile Touch Controls for Exploration & Real-Time Action Combat */}
      {(currentScreen === 'EXPLORATION' || currentScreen === 'REALTIME_COMBAT') && (
        <TouchControls
          isCombat={currentScreen === 'REALTIME_COMBAT'}
          radoxomsAvailable={radoxomsAvailable}
          nearShrine={engineRef.current?.nearShrine || false}
          nearPuzzleGate={engineRef.current?.nearPuzzleGate || false}
          onInteract={() => {
            if (engineRef.current?.nearPuzzleGate) {
              setShowPuzzleGateModal(true);
            }
          }}
        />
      )}

      {/* Screen: MAIN MENU */}
      {currentScreen === 'MAIN_MENU' && (
        <MainMenu
          hasSavedGame={gameState.completedLevels.length > 0 || gameState.playerStats.level > 1}
          onStartNewGame={() => startLevelJourney(1)}
          onResumeGame={() => startLevelJourney(gameState.currentLevelId)}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenArena={() => setCurrentScreen('PRACTICE_ARENA')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Screen: ARIA INTRODUCTION & TEACHING LESSON */}
      {currentScreen === 'ARIA_LESSON' && (
        <div className="relative z-30 w-full h-full flex flex-col justify-between">
          {lessonPhase === 'dialogue' ? (
            <AriaDialogue
              dialogues={activeLevelConfig.ariaIntro}
              speedMultiplier={
                gameState.settings.dialogueSpeed === 'slow'
                  ? 0.6
                  : gameState.settings.dialogueSpeed === 'fast'
                  ? 2
                  : gameState.settings.dialogueSpeed === 'instant'
                  ? 100
                  : 1
              }
              onComplete={() => {
                setLessonPhase('lesson');
              }}
            />
          ) : (
            <LessonModal
              levelTitle={activeLevelConfig.title}
              topicTitle={activeLevelConfig.topic}
              theory={activeLevelConfig.theory}
              miniPractice={activeLevelConfig.miniPractice}
              onFinishLesson={handleFinishAriaLesson}
            />
          )}
        </div>
      )}

      {/* Screen: MONSTER ENCOUNTER INTRO */}
      {currentScreen === 'MONSTER_INTRO' && (
        <MonsterIntroModal
          monster={activeLevelConfig.monster}
          levelNumber={activeLevelConfig.id}
          onStartCombat={handleStartCombatFromIntro}
        />
      )}

      {/* Screen: QUESTION & PRACTICE SESSION (EARN RADOXOMS) */}
      {currentScreen === 'QUESTION_SESSION' && (
        <QuestionSessionModal
          questions={levelQuestions}
          levelTitle={`Level ${activeLevelConfig.id}: ${activeLevelConfig.title}`}
          topicTitle={activeLevelConfig.topic}
          onComplete={handleQuestionSessionComplete}
          isRetry={isRetrySession}
          targetRadoxomsNeeded={retryTargetNeeded}
          existingRemainingAmmo={retryExistingAmmo}
        />
      )}

      {/* Screen: COMBAT PREPARATION BRIEFING */}
      {currentScreen === 'COMBAT_PREP' && (
        <CombatPrepModal
          monster={activeLevelConfig.monster}
          radoxomsEarned={radoxomsEarned}
          totalQuestions={levelQuestions.length}
          playerStats={gameState.playerStats}
          activeSkill={activeSkill}
          onCommenceCombat={handleCommenceCombat}
        />
      )}

      {/* Screen: REAL-TIME 1v1 ACTION COMBAT HUD */}
      {currentScreen === 'REALTIME_COMBAT' && (
        <RealTimeCombatHUD
          heroStats={gameState.playerStats}
          monsterName={activeLevelConfig.monster.name}
          monsterHp={monsterCurrentHp}
          monsterMaxHp={activeLevelConfig.monster.hp}
          radoxomsAvailable={radoxomsAvailable}
          totalRadoxoms={levelQuestions.length}
          combatStats={combatStats}
          activeSkill={activeSkill}
          heroStamina={heroStamina}
          heroMaxStamina={100}
          monsterDodgeCharges={engineRef.current?.monster?.director?.dodgeCharges ?? 1}
          monsterMaxDodgeCharges={engineRef.current?.monster?.director?.maxDodgeCharges ?? 1}
          debugSnapshot={aiDebugSnapshot}
          onToggleAIDebug={() => engineRef.current?.toggleAIDebugOverlay()}
        />
      )}

      {/* Screen: COMBAT CHALLENGE (LEGACY COMPATIBILITY) */}
      {currentScreen === 'COMBAT' && (
        <CombatModal
          monster={activeLevelConfig.monster}
          monsterCurrentHp={monsterCurrentHp}
          question={activeQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={levelQuestions.length}
          onAnswerCorrect={handleAnswerCorrect}
          onAnswerWrong={handleAnswerWrong}
          onTimeout={handleCombatTimeout}
        />
      )}

      {/* Screen: LEVEL COMPLETE */}
      {currentScreen === 'LEVEL_COMPLETE' && (
        <LevelCompleteModal
          levelNumber={activeLevelConfig.id}
          levelTitle={activeLevelConfig.title}
          rewardXp={activeLevelConfig.rewardXp}
          unlockedSkill={activeLevelConfig.unlockedSkill}
          combatStats={combatStats}
          hasNextLevel={activeLevelConfig.id < CURRICULUM_LEVELS.length}
          onNextLevel={handleProceedNextLevel}
          onReturnToMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Screen: PLAYER DEATH */}
      {currentScreen === 'PLAYER_DEATH' && (
        <DeathModal
          reason={deathReason}
          combatStats={combatStats}
          retryAmmoBreakdown={RadoxomEconomyManager.getInstance().calculateRetryRadoxomRequirement()}
          onRetryCombat={handleRetryCombat}
          onRestartQuestions={handleRePracticeQuestions}
          onRestartLevel={handleRestartLevel}
          onReturnToMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Screen: GAME COMPLETE / NUMPY MASTER */}
      {currentScreen === 'GAME_COMPLETE' && (
        <GameCompleteModal
          topicMastery={gameState.topicMastery}
          totalQuestions={gameState.questionsAnswered}
          totalCorrect={gameState.questionsCorrect}
          onOpenArena={() => setCurrentScreen('PRACTICE_ARENA')}
          onReturnToMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Screen: FREE PRACTICE ARENA */}
      {currentScreen === 'PRACTICE_ARENA' && (
        <PracticeArena
          onRecordResult={(topic, isCorrect) => {
            GameStateManager.getInstance().recordAnswer(topic, isCorrect);
          }}
          onBackToMenu={() => setCurrentScreen('MAIN_MENU')}
        />
      )}

      {/* Modal: LEVEL SELECT */}
      {showLevelSelect && (
        <LevelSelectModal
          unlockedLevelId={gameState.unlockedLevelId}
          completedLevels={gameState.completedLevels}
          onSelectLevel={(lvlId) => {
            setShowLevelSelect(false);
            startLevelJourney(lvlId);
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* Toast: ACHIEVEMENT UNLOCKED */}
      {achievementToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-5 py-2.5 rounded-2xl font-rpg font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-[0_0_30px_rgba(245,158,11,0.6)] border-2 border-white">
            <Trophy className="w-5 h-5 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span>🏆 ACHIEVEMENT UNLOCKED: {achievementToast.title}</span>
          </div>
        </div>
      )}

      {/* Modal: SKILL UNLOCK CELEBRATION */}
      {unlockedSkillCelebration && (
        <SkillUnlockModal
          skill={unlockedSkillCelebration}
          onClose={() => setUnlockedSkillCelebration(null)}
        />
      )}

      {/* Modal: RUNIC DIMENSIONAL PUZZLE GATE */}
      {showPuzzleGateModal && activeLevelConfig.puzzleGate && (
        <PuzzleGateModal
          gate={activeLevelConfig.puzzleGate}
          onSolved={handlePuzzleGateSolved}
          onClose={() => setShowPuzzleGateModal(false)}
        />
      )}

      {/* Modal: SETTINGS */}
      {showSettings && (
        <SettingsModal
          settings={gameState.settings}
          onUpdateSettings={(partial) => {
            GameStateManager.getInstance().updateSettings(partial);
          }}
          onResetProgress={() => {
            GameStateManager.getInstance().resetProgress();
            setShowSettings(false);
            setCurrentScreen('MAIN_MENU');
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};
export default App;
