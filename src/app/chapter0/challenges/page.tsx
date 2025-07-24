"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import ChallengeSelection from '@/components/chapter0/challenges/ChallengeSelection';
import ChallengeContainer from '@/components/chapter0/challenges/ChallengeContainer';
import Challenge1RobotInstructions from '@/components/chapter0/challenges/Challenge1RobotInstructions';
import Challenge2VariableMemory from '@/components/chapter0/challenges/Challenge2VariableMemory';
import Challenge3TypeDetective from '@/components/chapter0/challenges/Challenge3TypeDetective';
import Challenge4OperationMaster from '@/components/chapter0/challenges/Challenge4OperationMaster';
import ChallengeResults from '@/components/chapter0/challenges/ChallengeResults';
import { Achievement, ScoreCalculation, UserStats } from '@/types/challenges';
import { toast } from 'sonner';

interface ChallengeProgress {
  [key: string]: {
    completed: boolean;
    bestScore: number;
    attempts: number;
    timeSpent: number;
    lastAttempt: Date;
  };
}

// Sample achievements system
const achievements: Achievement[] = [
  {
    id: 'first_challenge',
    title: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🎯',
    rarity: 'common',
    condition: (stats: UserStats) => stats.totalChallengesCompleted >= 1
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete any challenge in under 30 seconds',
    icon: '🏃‍♂️',
    rarity: 'rare',
    condition: (stats: UserStats) => stats.speedRecords.some(time => time < 30)
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Complete challenge with 100% accuracy',
    icon: '🎯',
    rarity: 'epic',
    condition: (stats: UserStats) => stats.perfectScores > 0
  },
  {
    id: 'no_hints',
    title: 'No Hints Needed',
    description: 'Complete without using any hints',
    icon: '🧠',
    rarity: 'rare',
    condition: (stats: UserStats) => stats.hintsUsed === 0
  },
  {
    id: 'hot_streak',
    title: 'Hot Streak',
    description: 'Complete 3 challenges in a row perfectly',
    icon: '🔥',
    rarity: 'legendary',
    condition: (stats: UserStats) => stats.perfectScores >= 3
  },
  {
    id: 'challenge_master',
    title: 'Challenge Master',
    description: 'Complete all Chapter 0 challenges',
    icon: '🏆',
    rarity: 'legendary',
    condition: (stats: UserStats) => stats.totalChallengesCompleted >= 4
  }
];

export default function ChallengePage() {
  const [currentView, setCurrentView] = useState<'selection' | 'challenge' | 'results'>('selection');
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challengeDifficulty, setChallengeDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress>({});
  const [userStats, setUserStats] = useState<UserStats>({
    totalChallengesCompleted: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    perfectScores: 0,
    hintsUsed: 0,
    mistakesMade: 0,
    speedRecords: []
  });
  const [lastResults, setLastResults] = useState<{
    challengeId: string;
    challengeTitle: string;
    finalScore: number;
    timeSpent: number;
    attempts: number;
    mistakes: number;
    hintsUsed: number;
    scoreBreakdown: ScoreCalculation;
    newAchievements: Achievement[];
  } | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4' // For demo purposes
  ]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('challenge_progress');
    const savedStats = localStorage.getItem('user_stats');

    if (savedProgress) {
      setChallengeProgress(JSON.parse(savedProgress));
    }

    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (progress: ChallengeProgress, stats: UserStats) => {
    localStorage.setItem('challenge_progress', JSON.stringify(progress));
    localStorage.setItem('user_stats', JSON.stringify(stats));
  };

  const getChallengeTitle = (challengeId: string): string => {
    const titles: { [key: string]: string } = {
      'robot-chef': 'Robot Chef Instructions',
      'memory-warehouse': 'Memory Warehouse Manager',
      'type-detective': 'Data Type Detective',
      'operation-master': 'Operation Factory Master'
    };
    return titles[challengeId] || 'Unknown Challenge';
  };

  const getDifficultyFromChallenge = (challengeId: string) => {
    // You can determine difficulty based on challenge or let user choose
    return challengeDifficulty;
  };

  const handleSelectChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    setCurrentView('challenge');
  };

  const calculateScoreBreakdown = (baseScore: number, timeSpent: number, mistakes: number, hintsUsed: number): ScoreCalculation => {
    const timeBonus = Math.max(0, Math.floor((300 - timeSpent) / 10)); // Bonus for speed
    const accuracyBonus = Math.max(0, (100 - mistakes * 10) / 100 * 30); // Accuracy bonus
    const hintPenalty = hintsUsed * 5;
    const mistakePenalty = mistakes * 10;
    const difficultyMultiplier = challengeDifficulty === 'beginner' ? 1 : challengeDifficulty === 'intermediate' ? 1.5 : 2;

    const rawScore = baseScore + timeBonus + accuracyBonus - hintPenalty - mistakePenalty;
    const finalScore = Math.max(0, Math.floor(rawScore * difficultyMultiplier));

    return {
      basePoints: baseScore,
      timeBonus,
      accuracyBonus,
      hintPenalty,
      mistakePenalty,
      difficultyMultiplier,
      finalScore
    };
  };

  const checkNewAchievements = (newStats: UserStats): Achievement[] => {
    const unlockedAchievements = achievements.filter(achievement => {
      const wasUnlocked = userStats.totalChallengesCompleted > 0 && achievement.condition(userStats);
      const nowUnlocked = achievement.condition(newStats);
      return !wasUnlocked && nowUnlocked;
    });

    return unlockedAchievements;
  };

  const handleChallengeComplete = (success: boolean, score: number, timeSpent: number = 0, mistakes: number = 0, hintsUsed: number = 0) => {
    if (!selectedChallenge) return;

    const challengeTitle = getChallengeTitle(selectedChallenge);
    const scoreBreakdown = calculateScoreBreakdown(score, timeSpent, mistakes, hintsUsed);

    // Update challenge progress
    const newProgress = {
      ...challengeProgress,
      [selectedChallenge]: {
        completed: success,
        bestScore: Math.max(challengeProgress[selectedChallenge]?.bestScore || 0, scoreBreakdown.finalScore),
        attempts: (challengeProgress[selectedChallenge]?.attempts || 0) + 1,
        timeSpent: timeSpent,
        lastAttempt: new Date()
      }
    };

    // Update user stats
    const completedChallenges = Object.values(newProgress).filter(p => p.completed).length;
    const totalScores = Object.values(newProgress).reduce((sum, p) => sum + p.bestScore, 0);
    const avgScore = completedChallenges > 0 ? totalScores / completedChallenges : 0;

    const newStats: UserStats = {
      totalChallengesCompleted: completedChallenges,
      averageScore: avgScore,
      totalTimeSpent: userStats.totalTimeSpent + timeSpent,
      perfectScores: scoreBreakdown.finalScore === 100 ? userStats.perfectScores + 1 : userStats.perfectScores,
      hintsUsed: userStats.hintsUsed + hintsUsed,
      mistakesMade: userStats.mistakesMade + mistakes,
      speedRecords: timeSpent < 60 ? [...userStats.speedRecords, timeSpent] : userStats.speedRecords
    };

    // Check for new achievements
    const newAchievements = checkNewAchievements(newStats);

    // Save progress
    setChallengeProgress(newProgress);
    setUserStats(newStats);
    saveProgress(newProgress, newStats);

    // Set results for display
    setLastResults({
      challengeId: selectedChallenge,
      challengeTitle,
      finalScore: scoreBreakdown.finalScore,
      timeSpent,
      attempts: newProgress[selectedChallenge].attempts,
      mistakes,
      hintsUsed,
      scoreBreakdown,
      newAchievements
    });

    // Show achievements toast
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
          description: achievement.description
        });
      });
    }

    setCurrentView('results');
  };

  const handleRetry = () => {
    setCurrentView('challenge');
  };

  const handleNextChallenge = () => {
    const challengeIds = ['robot-chef', 'memory-warehouse', 'type-detective', 'operation-master'];
    const currentIndex = challengeIds.indexOf(selectedChallenge || '');
    const nextIndex = (currentIndex + 1) % challengeIds.length;

    setSelectedChallenge(challengeIds[nextIndex]);
    setCurrentView('challenge');
  };

  const handleBackToDashboard = () => {
    setCurrentView('selection');
    setSelectedChallenge(null);
    setLastResults(null);
  };

  const renderChallenge = () => {
    if (!selectedChallenge) return null;

    const difficulty = getDifficultyFromChallenge(selectedChallenge);
    const challengeTitle = getChallengeTitle(selectedChallenge);

    const commonProps = {
      onComplete: (success: boolean, score: number) => handleChallengeComplete(success, score),
      difficulty
    };

    let challengeComponent;
    switch (selectedChallenge) {
      case 'robot-chef':
        challengeComponent = <Challenge1RobotInstructions {...commonProps} />;
        break;
      case 'memory-warehouse':
        challengeComponent = <Challenge2VariableMemory {...commonProps} />;
        break;
      case 'type-detective':
        challengeComponent = <Challenge3TypeDetective {...commonProps} />;
        break;
      case 'operation-master':
        challengeComponent = <Challenge4OperationMaster {...commonProps} />;
        break;
      default:
        return <div>Challenge not found</div>;
    }

    return (
      <ChallengeContainer
        challengeId={selectedChallenge}
        title={challengeTitle}
        description="Test your understanding of programming fundamentals"
        difficulty={difficulty}
        timeLimit={300}
        onComplete={(score, timeSpent) => handleChallengeComplete(true, score, timeSpent)}
      >
        {challengeComponent}
      </ChallengeContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BackToDashboard />

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeSelection
                onSelectChallenge={handleSelectChallenge}
                completedLessons={completedLessons}
                userProgress={challengeProgress}
              />
            </motion.div>
          )}

          {currentView === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderChallenge()}
            </motion.div>
          )}

          {currentView === 'results' && lastResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ChallengeResults
                challengeId={lastResults.challengeId}
                challengeTitle={lastResults.challengeTitle}
                difficulty={challengeDifficulty}
                finalScore={lastResults.finalScore}
                timeSpent={lastResults.timeSpent}
                attempts={lastResults.attempts}
                mistakes={lastResults.mistakes}
                hintsUsed={lastResults.hintsUsed}
                scoreBreakdown={lastResults.scoreBreakdown}
                newAchievements={lastResults.newAchievements}
                userStats={userStats}
                onRetry={handleRetry}
                onNextChallenge={handleNextChallenge}
                onBackToDashboard={handleBackToDashboard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
