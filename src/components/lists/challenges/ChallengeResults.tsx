"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Star,
  Clock,
  Lightbulb,
  Target,
  Zap,
  Award,
  TrendingUp,
  Repeat,
  ArrowRight,
  Crown,
  Medal,
  Gift
} from 'lucide-react';
import { ChallengeResult, Achievement } from '@/types/challenges';

interface ChallengeResultsProps {
  result: ChallengeResult;
  challengeTitle: string;
  maxScore: number;
  newAchievements?: Achievement[];
  onRetry: () => void;
  onNextChallenge?: () => void;
  onBackToHub: () => void;
}

export function ChallengeResults({
  result,
  challengeTitle,
  maxScore,
  newAchievements = [],
  onRetry,
  onNextChallenge,
  onBackToHub
}: ChallengeResultsProps) {
  const scorePercentage = (result.score / maxScore) * 100;

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 95) return { level: 'Legendaris', color: 'text-purple-600', icon: Crown };
    if (percentage >= 85) return { level: 'Luar Biasa', color: 'text-yellow-600', icon: Trophy };
    if (percentage >= 75) return { level: 'Hebat', color: 'text-blue-600', icon: Medal };
    if (percentage >= 65) return { level: 'Baik', color: 'text-green-600', icon: Award };
    return { level: 'Tetap Semangat', color: 'text-gray-600', icon: Target };
  };

  const performance = getPerformanceLevel(scorePercentage);
  const PerformanceIcon = performance.icon;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Challenge Complete Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="mb-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <PerformanceIcon className={`w-16 h-16 mx-auto ${performance.color}`} />
          </motion.div>
          <h1 className="text-3xl font-bold mt-4 mb-2">
            {result.completed ? 'Tantangan Selesai!' : 'Tantangan Dicoba'}
          </h1>
          <p className="text-xl text-gray-600">{challengeTitle}</p>
        </div>

        <Badge
          className={`${performance.color} bg-opacity-10 border-current text-lg px-4 py-2`}
        >
          {performance.level}
        </Badge>
      </motion.div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-600" />
              Skor Akhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-indigo-600">
                {result.score}
              </div>
              <div className="text-lg text-gray-600">
                dari {maxScore} poin
              </div>
              <Progress
                value={scorePercentage}
                className="h-3 w-full max-w-md mx-auto"
              />
              <div className="text-lg font-medium">
                {scorePercentage.toFixed(1)}% Selesai
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Time Spent */}
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{formatTime(result.timeSpent)}</div>
            <div className="text-sm text-gray-600">Waktu Terpakai</div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className={`text-2xl font-bold ${getEfficiencyColor(result.efficiency)}`}>
              {result.efficiency}%
            </div>
            <div className="text-sm text-gray-600">Efisiensi</div>
          </CardContent>
        </Card>

        {/* Accuracy */}
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className={`text-2xl font-bold ${getAccuracyColor(result.accuracy)}`}>
              {result.accuracy}%
            </div>
            <div className="text-sm text-gray-600">Akurasi</div>
          </CardContent>
        </Card>

        {/* Hints Used */}
        <Card>
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{result.hintsUsed}</div>
            <div className="text-sm text-gray-600">Petunjuk Digunakan</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Special Achievements */}
      {result.perfectSolution && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="text-xl font-bold mb-2">Solusi Sempurna!</h3>
              <p className="text-gray-600">
                Anda menyelesaikan tantangan ini dengan akurasi 100% dan tanpa petunjuk. Kerja yang luar biasa!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-purple-600" />
                Pencapaian Baru Terbuka!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                      <Badge className="mt-1 text-xs">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Analisis Performa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="font-medium mb-3 text-green-700">✅ Kekuatan</h4>
                <ul className="space-y-2 text-sm">
                  {result.accuracy >= 90 && (
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      Akurasi tinggi dalam test case
                    </li>
                  )}
                  {result.efficiency >= 80 && (
                    <li className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      Pemecahan masalah yang efisien
                    </li>
                  )}
                  {result.hintsUsed === 0 && (
                    <li className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-green-600" />
                      Pemecahan masalah mandiri
                    </li>
                  )}
                  {result.completed && (
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      Berhasil menyelesaikan tantangan
                    </li>
                  )}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="font-medium mb-3 text-orange-700">📈 Area untuk Perbaikan</h4>
                <ul className="space-y-2 text-sm">
                  {result.accuracy < 75 && (
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      Fokus pada persyaratan test case
                    </li>
                  )}
                  {result.efficiency < 60 && (
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      Tingkatkan manajemen waktu
                    </li>
                  )}
                  {result.hintsUsed > 2 && (
                    <li className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-orange-600" />
                      Tinjau konsep sebelum mencoba
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button onClick={onRetry} variant="outline" size="lg">
          <Repeat className="w-5 h-5 mr-2" />
          Coba Lagi
        </Button>

        {onNextChallenge && (
          <Button onClick={onNextChallenge} size="lg">
            <ArrowRight className="w-5 h-5 mr-2" />
            Tantangan Selanjutnya
          </Button>
        )}

        <Button onClick={onBackToHub} variant="outline" size="lg">
          Kembali ke Hub
        </Button>
      </motion.div>
    </div>
  );
}
