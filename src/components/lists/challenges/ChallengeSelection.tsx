"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Clock,
  Star,
  Users,
  Zap,
  Target,
  Brain,
  Lock,
  PlayCircle,
  CheckCircle2,
  Award,
  TrendingUp,
  BookOpen,
  Code,
  Database,
  Search,
  Wrench
} from 'lucide-react';
import { Challenge, UserProgress } from '@/types/challenges';

interface ChallengeSelectionProps {
  challenges: Challenge[];
  userProgress: UserProgress;
  onChallengeSelect: (challengeId: string) => void;
}

const challengeIcons = {
  'list-master': BookOpen,
  'data-sorter': Database,
  'index-detective': Search,
  'list-manipulator': Wrench,
  'real-world-apps': Code
};

export function ChallengeSelection({
  challenges,
  userProgress,
  onChallengeSelect
}: ChallengeSelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredChallenges = challenges.filter(challenge =>
    selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getProgressColor = (completionRate?: number) => {
    if (!completionRate) return 'bg-gray-200';
    if (completionRate > 80) return 'bg-green-500';
    if (completionRate > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🏆 Pusat Tantangan Chapter 1
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Uji kemampuan penguasaan Python List Anda melalui tantangan berbasis permainan. Berkembang melalui skenario yang semakin kompleks
          dan buka keterampilan baru di Akademi Sains Data!
        </p>
      </motion.div>

      {/* User Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Progress Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress Keseluruhan</span>
                  <span className="text-sm text-gray-500">
                    {userProgress.challengesCompleted}/{userProgress.totalChallenges}
                  </span>
                </div>
                <Progress
                  value={(userProgress.challengesCompleted / userProgress.totalChallenges) * 100}
                  className="h-2"
                />
              </div>

              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Level {userProgress.currentLevel}</span>
                  <span className="text-sm text-gray-500">
                    {userProgress.experience}/{userProgress.nextLevelExp} XP
                  </span>
                </div>
                <Progress
                  value={(userProgress.experience / userProgress.nextLevelExp) * 100}
                  className="h-2"
                />
              </div>

              {/* Skills Summary */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Keterampilan Dikuasai</span>
                <div className="flex gap-1">
                  {Object.entries(userProgress.skills).map(([skill, level]) => (
                    <Badge
                      key={skill}
                      variant={level.level > 3 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {skill.charAt(0).toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Pencapaian</span>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">{userProgress.achievements.length} terbuka</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Difficulty Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-2"
      >
        {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            onClick={() => setSelectedDifficulty(difficulty)}
            className="capitalize"
          >
            {difficulty === 'all' ? 'Semua Tantangan' :
              difficulty === 'beginner' ? 'Pemula' :
                difficulty === 'intermediate' ? 'Menengah' : 'Mahir'}
          </Button>
        ))}
      </motion.div>

      {/* Challenges Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredChallenges.map((challenge, index) => {
          const IconComponent = challengeIcons[challenge.id as keyof typeof challengeIcons] || Target;
          const isLocked = challenge.userStatus === 'locked';
          const isCompleted = challenge.userStatus === 'completed';

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={!isLocked ? { scale: 1.02 } : undefined}
              className={`group ${isLocked ? 'opacity-60' : ''}`}
            >
              <Card className={`h-full border-2 transition-all duration-200 ${isLocked ? 'border-gray-200' :
                isCompleted ? 'border-green-200 bg-green-50/30' :
                  'border-indigo-200 hover:border-indigo-300 hover:shadow-lg'
                }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isLocked ? 'bg-gray-100' :
                        isCompleted ? 'bg-green-100' :
                          'bg-indigo-100'
                        }`}>
                        <IconComponent className={`w-6 h-6 ${isLocked ? 'text-gray-400' :
                          isCompleted ? 'text-green-600' :
                            'text-indigo-600'
                          }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{challenge.theme}</p>
                      </div>
                    </div>
                    {getStatusIcon(challenge.userStatus)}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getDifficultyColor(challenge.difficulty)} border text-xs`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {challenge.estimatedTime}m
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Challenge Stats */}
                  <div className="space-y-2">
                    {challenge.completionRate !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Tingkat Penyelesaian</span>
                        <span className="font-medium">{challenge.completionRate}%</span>
                      </div>
                    )}
                    {challenge.averageScore !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Rata-rata Skor</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="font-medium">{challenge.averageScore}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills Required */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-gray-700">Keterampilan:</span>
                    <div className="flex flex-wrap gap-1">
                      {challenge.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {challenge.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{challenge.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    disabled={isLocked}
                    onClick={() => onChallengeSelect(challenge.id)}
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Terkunci
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Tinjau
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Mulai Tantangan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center space-y-2"
      >
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Bergabung dengan 10,000+ pelajar</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>95% tingkat keberhasilan</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>Umpan balik real-time</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
