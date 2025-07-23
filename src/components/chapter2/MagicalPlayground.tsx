"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Target,
  Trophy,
  Timer,
  Users,
  Star,
  Zap,
  BookOpen,
  Brain,
  Award
} from 'lucide-react';

// Challenge types for the magical playground
const challenges = [
  {
    id: 'library-reorganizer',
    title: 'Pengatur Ulang Perpustakaan Agung',
    description: 'Bantu pustakawan kuno mengatur ulang koleksi mantra nested',
    difficulty: 'Lanjutan',
    points: 150,
    icon: '📚',
    category: 'nested-lists'
  },
  {
    id: 'efficiency-tournament',
    title: 'Turnamen Efisiensi Mantra',
    description: 'Optimalkan operasi list untuk kecepatan sihir maksimal',
    difficulty: 'Master',
    points: 200,
    icon: '⚡',
    category: 'optimization'
  },
  {
    id: 'pattern-recognition',
    title: 'Quest Pengenalan Pola',
    description: 'Identifikasi dan implementasi pola manipulasi list lanjutan',
    difficulty: 'Ahli',
    points: 175,
    icon: '🔍',
    category: 'patterns'
  },
  {
    id: 'memory-conservation',
    title: 'Tantangan Konservasi Memori',
    description: 'Minimalkan penggunaan memori sambil mempertahankan fungsionalitas',
    difficulty: 'Master',
    points: 225,
    icon: '💾',
    category: 'memory'
  }
];

const achievements = [
  { id: 'apprentice', name: 'Apprentice Wizard', description: 'Complete first lesson', icon: '🎓', earned: true },
  { id: 'comprehension-master', name: 'Comprehension Master', description: 'Master list comprehensions', icon: '✨', earned: false },
  { id: 'dimension-walker', name: 'Dimension Walker', description: 'Navigate nested dimensions', icon: '🌌', earned: false },
  { id: 'method-sage', name: 'Method Sage', description: 'Learn all advanced methods', icon: '📜', earned: false },
  { id: 'grandmaster', name: 'Grandmaster Wizard', description: 'Complete all techniques', icon: '👑', earned: false },
];

const leaderboard = [
  { rank: 1, name: 'Merlin the Wise', points: 2450, level: 'Archmage' },
  { rank: 2, name: 'Gandalf Grey', points: 2280, level: 'Master' },
  { rank: 3, name: 'Dumbledore', points: 2100, level: 'Master' },
  { rank: 4, name: 'Hermione', points: 1950, level: 'Expert' },
  { rank: 5, name: 'You', points: 0, level: 'Apprentice' }
];

export function MagicalPlayground() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('challenges');
  const [userProgress] = useState({
    totalPoints: 0,
    completedChallenges: 0,
    currentLevel: 'Pemagang',
    streak: 0
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Lanjutan': return 'bg-blue-500';
      case 'Ahli': return 'bg-white0';
      case 'Master': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const startChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    // Here you would typically open the challenge interface
  };

  if (selectedChallenge) {
    const challenge = challenges.find(c => c.id === selectedChallenge);
    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <Card className="bg-white border-purple-300 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {challenge?.icon}
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">{challenge?.title}</CardTitle>
                  <p className="text-purple-600">{challenge?.description}</p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedChallenge(null)}
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-white"
              >
                Kembali ke Tantangan
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Challenge Content */}
        <Card className="bg-white border-purple-300 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl">{challenge?.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{challenge?.title}</h3>
                <p className="text-purple-600 text-lg">{challenge?.description}</p>
              </div>

              <div className="bg-white border border-purple-300 rounded-lg p-6">
                <h4 className="text-gray-800 font-semibold mb-4">Detail Tantangan</h4>
                <div className="text-purple-700 space-y-2">
                  <div>📈 <strong>Kesulitan:</strong> {challenge?.difficulty}</div>
                  <div>🏆 <strong>Hadiah Poin:</strong> {challenge?.points}</div>
                  <div>⏱️ <strong>Estimasi Waktu:</strong> 20-30 menit</div>
                  <div>🎯 <strong>Kategori:</strong> {challenge?.category}</div>
                </div>
              </div>

              <div className="text-amber-600 font-semibold">
                🔮 Antarmuka tantangan segera hadir! Ini akan berisi tantangan coding interaktif.
              </div>

              <Button
                onClick={() => setSelectedChallenge(null)}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                Kembali ke Playground
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playground Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🎮 Playground Magis Master</h2>
            <p className="text-purple-600">Tantang dirimu dengan quest manipulasi list lanjutan</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-amber-600">
            <Trophy className="w-4 h-4" />
            <span>{userProgress.totalPoints} Poin</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Star className="w-4 h-4" />
            <span>{userProgress.currentLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Zap className="w-4 h-4" />
            <span>{userProgress.streak} Hari Beruntun</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white border border-purple-300">
          <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800 text-purple-700">
            🏆 Tantangan
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800 text-purple-700">
            🏅 Pencapaian
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800 text-purple-700">
            👥 Papan Skor
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800 text-purple-700">
            🔬 Sandbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-white border-purple-300 hover:border-purple-400 transition-colors cursor-pointer h-full shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                          {challenge.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800">{challenge.title}</CardTitle>
                          <p className="text-purple-600 text-sm mt-1">{challenge.description}</p>
                        </div>
                      </div>
                      <Badge className={`${getDifficultyColor(challenge.difficulty)} text-gray-800 border-0`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-600">Hadiah:</span>
                        <span className="text-amber-600 font-semibold">{challenge.points} poin</span>
                      </div>
                      <Button
                        onClick={() => startChallenge(challenge.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Mulai Tantangan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 ${achievement.earned
                  ? 'bg-green-500/20 border-green-400'
                  : 'bg-white border-gray-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${achievement.earned ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${achievement.earned ? 'text-green-300' : 'text-gray-400'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-green-200' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Award className="w-6 h-6 text-green-400 ml-auto" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-white border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Global Wizard Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-3 rounded-lg ${entry.name === 'You'
                      ? 'bg-white0/20 border border-purple-400'
                      : 'bg-white'
                      }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${entry.rank <= 3
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800'
                      : 'bg-gray-600 text-gray-300'
                      }`}>
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${entry.name === 'You' ? 'text-purple-300' : 'text-gray-800'}`}>
                        {entry.name}
                      </div>
                      <div className="text-sm text-gray-400">{entry.level}</div>
                    </div>
                    <div className="text-yellow-300 font-bold">
                      {entry.points.toLocaleString()} pts
                    </div>
                    {entry.rank <= 3 && (
                      <Trophy className="w-5 h-5 text-yellow-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sandbox" className="space-y-4">
          <Card className="bg-white border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-400" />
                Free Practice Sandbox
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="text-6xl">🔬</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Experimental Laboratory</h3>
                  <p className="text-green-200">Practice advanced list techniques in a safe environment</p>
                </div>

                <div className="bg-green-500/20 border border-green-400 rounded-lg p-6">
                  <div className="text-green-200 space-y-2">
                    <div>🧪 <strong>Free Form Coding:</strong> Try any list operations</div>
                    <div>📊 <strong>Performance Metrics:</strong> Real-time analysis</div>
                    <div>💡 <strong>Hints System:</strong> Get help when stuck</div>
                    <div>🔄 <strong>Code Sharing:</strong> Share solutions with peers</div>
                  </div>
                </div>

                <div className="text-yellow-300 font-semibold">
                  🔮 Advanced sandbox environment coming soon!
                </div>

                <Button
                  disabled
                  className="bg-gray-600 cursor-not-allowed"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enter Sandbox (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

