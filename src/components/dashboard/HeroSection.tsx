"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateOverallProgress, userStatsData, chaptersData } from '@/data/dashboardData';

export function HeroSection() {
  const overallProgress = calculateOverallProgress();
  const currentChapter = chaptersData.find(chapter => chapter.status === 'in-progress');

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Selamat Datang di Platform{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Belajar Python
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Belajar pemrograman Python dengan visualisasi interaktif yang menyenangkan
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {/* Circular Progress */}
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${overallProgress * 2.51} 251`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Progress Keseluruhan</h3>
                <p className="text-sm text-gray-600">{userStatsData.completedChapters} dari {userStatsData.totalChapters} chapter selesai</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-xl text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Lanjutkan Belajar</h3>
                <p className="text-sm opacity-90 mb-4">
                  {currentChapter ? currentChapter.title : 'Semua chapter selesai!'}
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Mulai Belajar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="font-semibold text-gray-900 mb-2">Pencapaian Terbaru</h3>
                <p className="text-sm text-gray-600 mb-4">
                  "Pemula yang Antusias"
                </p>
                <div className="text-xs text-gray-500">
                  🔥 Streak 3 hari
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
