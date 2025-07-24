"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChefHat,
  Package,
  Search,
  Calculator,
  Star,
  Clock,
  Trophy,
  Lock
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number;
  unlocked: boolean;
  completed: boolean;
  bestScore?: number;
  prerequisite?: string;
}

interface ChallengeSelectionProps {
  onSelectChallenge: (challengeId: string) => void;
  completedLessons: string[];
  userProgress: {
    [key: string]: {
      completed: boolean;
      bestScore: number;
      attempts: number;
    };
  };
}

const challenges: Challenge[] = [
  {
    id: 'robot-chef',
    title: 'Instruksi Robot Chef',
    subtitle: 'Pemrograman Berurutan',
    description: 'Bantu robot chef memasak dengan instruksi yang benar. Pelajari pentingnya urutan dalam pemrograman.',
    icon: <ChefHat className="w-8 h-8" />,
    difficulty: 'beginner',
    timeLimit: 300,
    unlocked: true,
    completed: false,
    prerequisite: 'lesson-1'
  },
  {
    id: 'memory-warehouse',
    title: 'Manajer Gudang Memori',
    subtitle: 'Variabel & Memori',
    description: 'Kelola gudang memori dengan menyimpan dan mengatur variabel. Pahami konsep penyimpanan data.',
    icon: <Package className="w-8 h-8" />,
    difficulty: 'beginner',
    timeLimit: 240,
    unlocked: true,
    completed: false,
    prerequisite: 'lesson-2'
  },
  {
    id: 'type-detective',
    title: 'Detektif Tipe Data',
    subtitle: 'Pengenalan Tipe',
    description: 'Pecahkan kasus dengan mengidentifikasi tipe data yang benar. Latih kemampuan klasifikasi.',
    icon: <Search className="w-8 h-8" />,
    difficulty: 'intermediate',
    timeLimit: 180,
    unlocked: true,
    completed: false,
    prerequisite: 'lesson-3'
  },
  {
    id: 'operation-master',
    title: 'Master Pabrik Operasi',
    subtitle: 'Operasi Matematika',
    description: 'Jalankan pabrik operasi dengan menguasai perhitungan dan logika. Kuasai operator Python.',
    icon: <Calculator className="w-8 h-8" />,
    difficulty: 'advanced',
    timeLimit: 360,
    unlocked: true,
    completed: false,
    prerequisite: 'lesson-4'
  }
];

export default function ChallengeSelection({
  onSelectChallenge,
  completedLessons,
  userProgress
}: ChallengeSelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-green-600';
      case 'intermediate': return 'from-yellow-400 to-yellow-600';
      case 'advanced': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Pemula';
      case 'intermediate': return 'Menengah';
      case 'advanced': return 'Mahir';
      default: return 'Tidak diketahui';
    }
  };

  const isUnlocked = (challenge: Challenge): boolean => {
    if (!challenge.prerequisite) return true;
    return completedLessons.includes(challenge.prerequisite);
  };

  const getProgress = (challengeId: string) => {
    const progress = userProgress[challengeId];
    if (!progress) return { completed: false, bestScore: 0, attempts: 0 };
    return progress;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredChallenges = challenges.filter(challenge =>
    selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
  );

  const completedCount = challenges.filter(c => getProgress(c.id).completed).length;
  const totalScore = challenges.reduce((sum, c) => sum + getProgress(c.id).bestScore, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏆 Tantangan Chapter 0
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Uji pemahaman Anda tentang dasar-dasar pemrograman Python
          </p>

          {/* Overall Progress */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-blue-50 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{completedCount}/{challenges.length}</div>
                  <div className="text-sm text-gray-600">Tantangan Selesai</div>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{totalScore}</div>
                  <div className="text-sm text-gray-600">Total Skor</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.round((completedCount / challenges.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Kemajuan</div>
                </div>
              </div>
              <Progress
                value={(completedCount / challenges.length) * 100}
                className="mt-4 h-3"
              />
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className={selectedDifficulty === difficulty ?
                  'bg-gradient-to-r from-purple-500 to-blue-500 text-white' :
                  'hover:bg-gray-200'
                }
              >
                {difficulty === 'all' ? 'Semua' : getDifficultyText(difficulty)}
              </Button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge, index) => {
            const unlocked = isUnlocked(challenge);
            const progress = getProgress(challenge.id);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${!unlocked ? 'opacity-60' : 'hover:scale-105'
                  }`}>
                  {!unlocked && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center z-10">
                      <Lock className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)}`} />

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white`}>
                          {challenge.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {challenge.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500">{challenge.subtitle}</p>
                        </div>
                      </div>
                      <Badge className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white border-0`}>
                        {getDifficultyText(challenge.difficulty)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(challenge.timeLimit)}
                      </div>
                      {progress.completed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Star className="w-4 h-4" />
                          {progress.bestScore} poin
                        </div>
                      )}
                      {progress.attempts > 0 && (
                        <div className="text-blue-600">
                          {progress.attempts} percobaan
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => onSelectChallenge(challenge.id)}
                      disabled={!unlocked}
                      className={`w-full bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} hover:opacity-90 text-white border-0`}
                    >
                      {progress.completed ? 'Coba Lagi' : 'Mulai Tantangan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
