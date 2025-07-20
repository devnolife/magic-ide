"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Trophy,
  Clock,
  Target,
  Zap,
  BookOpen,
  Flame,
  Star,
  Award,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userStatsData, achievementsData, recentActivityData, tipsData } from '@/data/dashboardData';

export function ProgressSidebar() {
  return (
    <div className="w-80 bg-white/50 backdrop-blur-md border-l border-white/20 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)] sticky top-20">
      {/* User Profile & Level */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Profile Belajar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {userStatsData.level}
              </Badge>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">{userStatsData.points}</div>
                <div className="text-sm text-gray-600">poin</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Menuju level berikutnya</span>
                <span>{userStatsData.nextLevelPoints} poin lagi</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>Statistik</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">{userStatsData.completedChapters}/{userStatsData.totalChapters}</div>
                <div className="text-xs text-gray-600">Chapter</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500 mr-1" />
                  {userStatsData.streak}
                </div>
                <div className="text-xs text-gray-600">Hari Streak</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Total Waktu</span>
              </div>
              <span className="text-sm font-medium">{userStatsData.totalTime}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span>Pencapaian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievementsData.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${achievement.earned
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-gray-50 opacity-60'
                  }`}
              >
                <div className="text-lg">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{achievement.name}</div>
                  <div className="text-xs text-gray-600">{achievement.description}</div>
                </div>
                {achievement.earned && (
                  <Star className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivityData.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${item.type === 'completion' ? 'bg-green-500' :
                    item.type === 'practice' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                <div className="flex-1">
                  <div className="text-sm">{item.activity}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Tips */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">Tips Hari Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tipsData.map((tip, index) => (
              <div key={index} className="text-sm text-yellow-800 bg-white/50 p-2 rounded">
                {tip}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
