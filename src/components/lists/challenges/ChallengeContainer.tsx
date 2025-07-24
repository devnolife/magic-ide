"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Zap,
  Target,
  Lightbulb,
  Star,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { ChallengeContainerProps, ChallengeResult, ChallengeSession } from '@/types/challenges';

interface TimerState {
  seconds: number;
  isActive: boolean;
  isPaused: boolean;
}

export function ChallengeContainer({
  challengeId,
  title,
  description,
  theme,
  difficulty,
  timeLimit,
  requiredSkills,
  onComplete,
  onHint,
  children
}: ChallengeContainerProps) {
  const [session, setSession] = useState<ChallengeSession>({
    challengeId,
    startTime: new Date(),
    attempts: 0,
    hintsUsed: 0,
    currentSubChallenge: 0,
    solutions: {},
    progress: {}
  });

  const [timer, setTimer] = useState<TimerState>({
    seconds: 0,
    isActive: true,
    isPaused: false
  });

  const [score, setScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (timer.isActive && !timer.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          seconds: prev.seconds + 1
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isActive, timer.isPaused]);

  // Check time limit
  useEffect(() => {
    if (timeLimit && timer.seconds >= timeLimit) {
      handleTimeUp();
    }
  }, [timer.seconds, timeLimit]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Target className="w-4 h-4" />;
      case 'intermediate': return <Zap className="w-4 h-4" />;
      case 'advanced': return <Brain className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const handleHint = (level: number) => {
    setSession(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
    onHint(level);

    // Apply hint penalty to score
    const penalty = Math.floor(maxPossibleScore * (level * 0.05));
    setScore(prev => Math.max(0, prev - penalty));

    toast.info(`Hint ${level} unlocked! (-${penalty} points)`, {
      icon: <Lightbulb className="w-4 h-4" />
    });
  };

  const handleTimeUp = () => {
    setTimer(prev => ({ ...prev, isActive: false }));

    const result: ChallengeResult = {
      score: Math.floor(score * 0.5), // 50% penalty for timeout
      timeSpent: timer.seconds,
      hintsUsed: session.hintsUsed,
      efficiency: 0,
      accuracy: 0,
      completed: false,
      solutions: Object.values(session.solutions)
    };

    toast.error('Time\'s up! Challenge incomplete.', {
      icon: <Timer className="w-4 h-4" />
    });

    onComplete(result);
  };

  const handleChallengeComplete = (subChallengeResults: any[]) => {
    setTimer(prev => ({ ...prev, isActive: false }));
    setSession(prev => ({ ...prev, endTime: new Date() }));

    // Calculate final metrics
    const efficiency = calculateEfficiency();
    const accuracy = calculateAccuracy(subChallengeResults);
    const timeBonus = calculateTimeBonus();

    const finalScore = score + timeBonus;

    const result: ChallengeResult = {
      score: finalScore,
      timeSpent: timer.seconds,
      hintsUsed: session.hintsUsed,
      efficiency,
      accuracy,
      completed: true,
      solutions: Object.values(session.solutions),
      perfectSolution: accuracy === 100 && session.hintsUsed === 0
    };

    // Show completion toast
    toast.success(`Challenge completed! Score: ${finalScore}`, {
      icon: <Trophy className="w-4 h-4" />
    });

    onComplete(result);
  };

  const calculateEfficiency = (): number => {
    const timeEfficiency = timeLimit ? Math.max(0, 100 - (timer.seconds / timeLimit) * 100) : 50;
    const hintEfficiency = Math.max(0, 100 - (session.hintsUsed * 10));
    return Math.round((timeEfficiency + hintEfficiency) / 2);
  };

  const calculateAccuracy = (results: any[]): number => {
    if (results.length === 0) return 0;
    const correct = results.filter(r => r.correct).length;
    return Math.round((correct / results.length) * 100);
  };

  const calculateTimeBonus = (): number => {
    if (!timeLimit) return 0;
    const timeUsedPercentage = timer.seconds / timeLimit;
    if (timeUsedPercentage < 0.5) return 200; // Under 50% time used
    if (timeUsedPercentage < 0.75) return 100; // Under 75% time used
    if (timeUsedPercentage < 0.9) return 50; // Under 90% time used
    return 0;
  };

  const progressPercentage = timeLimit ? Math.min(100, (timer.seconds / timeLimit) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className={`${getDifficultyColor(difficulty)} border`}>
                    {getDifficultyIcon(difficulty)}
                    <span className="ml-1 capitalize">{difficulty}</span>
                  </Badge>
                  <Badge variant="outline" className="text-indigo-600">
                    {theme}
                  </Badge>
                </div>
                <CardTitle className="text-2xl text-gray-800">{title}</CardTitle>
                <p className="text-gray-600">{description}</p>
              </div>

              {/* Challenge Stats */}
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(timer.seconds)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Star className="w-4 h-4" />
                    <span>{score}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600">
                    <Lightbulb className="w-4 h-4" />
                    <span>{session.hintsUsed}</span>
                  </div>
                </div>

                {timeLimit && (
                  <div className="w-48">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Time Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Required Skills */}
        {requiredSkills.length > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-700">Required Skills:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {requiredSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Challenge Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {React.isValidElement(children) && React.cloneElement(children as any, {
          session,
          setSession,
          onHint: handleHint,
          onComplete: handleChallengeComplete,
          setScore,
          maxPossibleScore
        })}
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-6 right-6"
      >
        <Card className="shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div className="text-sm">
                <div className="font-medium">Challenge Progress</div>
                <div className="text-gray-500">
                  Sub-challenge {session.currentSubChallenge + 1}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
