"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer, Star, Lightbulb, Target, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChallengeContainerProps, ChallengeState, ScoreCalculation } from '@/types/challenges';

export default function ChallengeContainer({
  challengeId,
  title,
  description,
  difficulty,
  timeLimit = 300, // 5 minutes default
  onComplete,
  children
}: ChallengeContainerProps) {
  const [state, setState] = useState<ChallengeState>({
    currentChallenge: 0,
    score: 0,
    timeSpent: 0,
    attempts: 0,
    hints: 0,
    completed: false,
    mistakes: [],
    startTime: Date.now()
  });

  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showHints, setShowHints] = useState(false);

  // Timer effect
  useEffect(() => {
    if (state.completed || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.completed, timeRemaining]);

  const handleTimeout = useCallback(() => {
    toast.error('Waktu habis! Coba lagi untuk mendapatkan skor yang lebih baik.');
    calculateAndSubmitScore(true);
  }, []);

  const calculateScore = (isTimeout: boolean = false): ScoreCalculation => {
    const elapsed = (Date.now() - state.startTime) / 1000;
    const accuracy = Math.max(0, 100 - (state.mistakes.length * 10));

    const basePoints = isTimeout ? 20 : 100;
    const timeBonus = Math.max(0, Math.floor((timeLimit - elapsed) / timeLimit * 50));
    const accuracyBonus = Math.floor(accuracy / 100 * 30);
    const hintPenalty = state.hints * 5;
    const mistakePenalty = state.mistakes.length * 10;

    const difficultyMultipliers = {
      beginner: 1,
      intermediate: 1.5,
      advanced: 2
    };

    const difficultyMultiplier = difficultyMultipliers[difficulty];

    const rawScore = (basePoints + timeBonus + accuracyBonus - hintPenalty - mistakePenalty);
    const finalScore = Math.max(0, Math.floor(rawScore * difficultyMultiplier));

    return {
      basePoints,
      timeBonus,
      accuracyBonus,
      hintPenalty,
      mistakePenalty,
      difficultyMultiplier,
      finalScore
    };
  };

  const calculateAndSubmitScore = (isTimeout: boolean = false) => {
    const scoreCalc = calculateScore(isTimeout);
    const elapsed = (Date.now() - state.startTime) / 1000;

    setState(prev => ({
      ...prev,
      completed: true,
      score: scoreCalc.finalScore,
      timeSpent: elapsed
    }));

    onComplete(scoreCalc.finalScore, elapsed);

    // Show score breakdown
    toast.success(`Tantangan selesai! Skor: ${scoreCalc.finalScore}`, {
      description: `Waktu: ${Math.floor(elapsed)}s | Akurasi: ${Math.max(0, 100 - (state.mistakes.length * 10))}%`
    });
  };

  const handleMistake = (mistake: string) => {
    setState(prev => ({
      ...prev,
      mistakes: [...prev.mistakes, mistake],
      attempts: prev.attempts + 1
    }));

    toast.error('Oops! Coba lagi.', {
      description: mistake
    });
  };

  const useHint = () => {
    setState(prev => ({ ...prev, hints: prev.hints + 1 }));
    setShowHints(true);
    toast.info('Petunjuk tersedia!', {
      description: 'Lihat panel petunjuk di sebelah kanan.'
    });
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = () => {
    switch (difficulty) {
      case 'beginner': return 'Pemula';
      case 'intermediate': return 'Menengah';
      case 'advanced': return 'Mahir';
      default: return 'Tidak diketahui';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  {title}
                </CardTitle>
                <p className="text-gray-600">{description}</p>
              </div>
              <Badge className={`${getDifficultyColor()} text-white`}>
                {getDifficultyText()}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Challenge Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {!state.completed ? (
                    <motion.div
                      key="challenge"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {children}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="completed"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Tantangan Selesai!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Skor Anda: <span className="font-bold text-purple-600">{state.score}</span>
                      </p>
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Coba Lagi
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            {/* Timer Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Timer className="w-5 h-5" />
                  Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${timeRemaining < 30 ? 'text-red-500' : 'text-gray-800'
                    }`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Statistik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Percobaan:</span>
                  <span className="font-semibold">{state.attempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kesalahan:</span>
                  <span className="font-semibold text-red-500">{state.mistakes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Petunjuk:</span>
                  <span className="font-semibold text-blue-500">{state.hints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Akurasi:</span>
                  <span className="font-semibold text-green-500">
                    {Math.max(0, 100 - (state.mistakes.length * 10))}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Hint Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="w-5 h-5" />
                  Bantuan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={useHint}
                  variant="outline"
                  className="w-full mb-3"
                  disabled={state.completed}
                >
                  Minta Petunjuk (-5 poin)
                </Button>

                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Perhatikan instruksi dengan seksama dan ikuti urutan yang benar.
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
