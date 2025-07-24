"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  Target,
  Clock,
  Medal,
  Award,
  ChevronRight,
  RotateCcw,
  Home,
  Share2,
  TrendingUp
} from 'lucide-react';
import { Achievement, ScoreCalculation, UserStats } from '@/types/challenges';

interface ChallengeResultsProps {
  challengeId: string;
  challengeTitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  finalScore: number;
  timeSpent: number;
  attempts: number;
  mistakes: number;
  hintsUsed: number;
  scoreBreakdown: ScoreCalculation;
  newAchievements: Achievement[];
  userStats: UserStats;
  onRetry: () => void;
  onNextChallenge: () => void;
  onBackToDashboard: () => void;
}

export default function ChallengeResults({
  challengeId,
  challengeTitle,
  difficulty,
  finalScore,
  timeSpent,
  attempts,
  mistakes,
  hintsUsed,
  scoreBreakdown,
  newAchievements,
  userStats,
  onRetry,
  onNextChallenge,
  onBackToDashboard
}: ChallengeResultsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const phases = [
      () => setAnimationPhase(1), // Show basic results
      () => setAnimationPhase(2), // Show score breakdown
      () => setAnimationPhase(3), // Show achievements
      () => setAnimationPhase(4)  // Show actions
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, (index + 1) * 800);
    });
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (score: number): {
    level: string;
    color: string;
    icon: string;
    message: string;
  } => {
    if (score >= 90) {
      return {
        level: 'Legendaris',
        color: 'from-yellow-400 to-orange-500',
        icon: '🏆',
        message: 'Performa luar biasa! Anda adalah master sejati!'
      };
    } else if (score >= 75) {
      return {
        level: 'Luar Biasa',
        color: 'from-purple-400 to-pink-500',
        icon: '⭐',
        message: 'Kerja bagus! Anda menguasai konsep dengan baik!'
      };
    } else if (score >= 60) {
      return {
        level: 'Baik',
        color: 'from-blue-400 to-cyan-500',
        icon: '👍',
        message: 'Bagus! Terus latihan untuk hasil yang lebih baik!'
      };
    } else {
      return {
        level: 'Tetap Semangat',
        color: 'from-gray-400 to-gray-600',
        icon: '💪',
        message: 'Jangan menyerah! Coba lagi untuk meningkatkan skor!'
      };
    }
  };

  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case 'beginner': return 1;
      case 'intermediate': return 1.5;
      case 'advanced': return 2;
      default: return 1;
    }
  };

  const performance = getPerformanceLevel(finalScore);

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `Python Learning Challenge Results`,
        text: `Saya baru saja menyelesaikan "${challengeTitle}" dengan skor ${finalScore}! 🎉`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const text = `Saya baru saja menyelesaikan "${challengeTitle}" dengan skor ${finalScore}! 🎉`;
      navigator.clipboard.writeText(text);
      // You might want to show a toast here
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Results Card */}
      <AnimatePresence>
        {animationPhase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Card className={`border-0 shadow-2xl bg-gradient-to-r ${performance.color} text-white overflow-hidden relative`}>
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-8xl">{performance.icon}</div>
                <div className="absolute bottom-4 left-4 text-6xl">🎯</div>
              </div>

              <CardContent className="p-8 relative z-10">
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl mb-4"
                  >
                    {performance.icon}
                  </motion.div>

                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-4xl font-bold mb-2">Tantangan Selesai!</h1>
                    <h2 className="text-2xl font-semibold opacity-90">{challengeTitle}</h2>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-8xl font-bold my-6"
                  >
                    {finalScore}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-white/20 text-white text-lg px-4 py-2 mb-4">
                      {performance.level}
                    </Badge>
                    <p className="text-xl opacity-90">{performance.message}</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <AnimatePresence>
        {animationPhase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Waktu</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{attempts}</div>
                <div className="text-sm text-gray-600">Percobaan</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {Math.max(0, 100 - (mistakes * 10))}%
                </div>
                <div className="text-sm text-gray-600">Akurasi</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Medal className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {getDifficultyMultiplier()}x
                </div>
                <div className="text-sm text-gray-600">Multiplier</div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Breakdown */}
      <AnimatePresence>
        {animationPhase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                >
                  <span className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rincian Skor
                  </span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${showBreakdown ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Skor Dasar:</span>
                            <span className="font-semibold text-green-600">+{scoreBreakdown.basePoints}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bonus Waktu:</span>
                            <span className="font-semibold text-blue-600">+{scoreBreakdown.timeBonus}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bonus Akurasi:</span>
                            <span className="font-semibold text-purple-600">+{scoreBreakdown.accuracyBonus}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Penalti Petunjuk:</span>
                            <span className="font-semibold text-orange-600">-{scoreBreakdown.hintPenalty}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Penalti Kesalahan:</span>
                            <span className="font-semibold text-red-600">-{scoreBreakdown.mistakePenalty}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Multiplier ({difficulty}):</span>
                            <span className="font-semibold text-indigo-600">×{scoreBreakdown.difficultyMultiplier}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Skor Final:</span>
                          <span className="text-2xl text-gray-800">{scoreBreakdown.finalScore}</span>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Achievements */}
      <AnimatePresence>
        {animationPhase >= 3 && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Pencapaian Baru Terbuka!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.8 + (index * 0.2),
                        type: "spring",
                        stiffness: 200
                      }}
                      className={`p-4 rounded-lg border-2 ${achievement.rarity === 'legendary' ? 'border-yellow-400 bg-yellow-50' :
                        achievement.rarity === 'epic' ? 'border-purple-400 bg-purple-50' :
                          achievement.rarity === 'rare' ? 'border-blue-400 bg-blue-50' :
                            'border-gray-400 bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <Badge className={`mt-1 text-xs ${achievement.rarity === 'legendary' ? 'bg-yellow-500' :
                            achievement.rarity === 'epic' ? 'bg-purple-500' :
                              achievement.rarity === 'rare' ? 'bg-blue-500' :
                                'bg-gray-500'
                            } text-white`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress */}
      <AnimatePresence>
        {animationPhase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Progress Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {userStats.totalChallengesCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Total Selesai</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {Math.round(userStats.averageScore)}
                    </div>
                    <div className="text-sm text-gray-600">Rata-rata Skor</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {userStats.perfectScores}
                    </div>
                    <div className="text-sm text-gray-600">Skor Sempurna</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {formatTime(userStats.totalTimeSpent)}
                    </div>
                    <div className="text-sm text-gray-600">Total Waktu</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {animationPhase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              onClick={shareResults}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Bagikan
            </Button>

            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Lagi
            </Button>

            <Button
              onClick={onNextChallenge}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <ChevronRight className="w-4 h-4" />
              Tantangan Selanjutnya
            </Button>

            <Button
              onClick={onBackToDashboard}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Kembali ke Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
