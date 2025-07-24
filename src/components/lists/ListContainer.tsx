"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Wrench,
  Zap,
  Target,
  Palette,
  Gamepad2,
  Star,
  Clock,
  CheckCircle,
  PlayCircle,
  Trophy,
  Swords
} from 'lucide-react';

// Import lesson components
import { Lesson1Introduction } from './Lesson1Introduction';
import { Lesson2Creation } from './Lesson2Creation';
import { Lesson3BasicOperations } from './Lesson3BasicOperations';
import { Lesson4IndexingSlicing } from './Lesson4IndexingSlicing';
import { Lesson5Methods } from './Lesson5Methods';
import { InteractivePlayground } from './InteractivePlayground';

// Import challenge components
import { ChallengeSelection, ChallengeContainer, Challenge1ListMaster, challengesData } from './challenges';
import { UserProgress, ChallengeResult } from '@/types/challenges';

// Define props interface for lesson components
interface LessonComponentProps {
  onComplete: () => void;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<LessonComponentProps>;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

const lessons: LessonData[] = [
  {
    id: 'introduction',
    title: 'Pengenalan List Python',
    description: 'Memahami konsep dasar list dengan analogi shopping cart',
    icon: <BookOpen className="w-5 h-5" />,
    component: Lesson1Introduction,
    duration: '8 menit',
    difficulty: 'beginner',
    completed: false
  },
  {
    id: 'creation',
    title: 'Membuat List',
    description: 'Workshop membuat list dengan berbagai metode',
    icon: <Wrench className="w-5 h-5" />,
    component: Lesson2Creation,
    duration: '10 menit',
    difficulty: 'beginner',
    completed: false
  },
  {
    id: 'operations',
    title: 'Operasi Dasar List',
    description: 'Manipulasi list dengan append, insert, remove, pop',
    icon: <Zap className="w-5 h-5" />,
    component: Lesson3BasicOperations,
    duration: '15 menit',
    difficulty: 'intermediate',
    completed: false
  },
  {
    id: 'indexing',
    title: 'Indexing & Slicing',
    description: 'Sistem alamat list dan operasi slicing',
    icon: <Target className="w-5 h-5" />,
    component: Lesson4IndexingSlicing,
    duration: '12 menit',
    difficulty: 'intermediate',
    completed: false
  },
  {
    id: 'methods',
    title: 'List Methods Toolkit',
    description: 'Method lanjutan: sort, reverse, count, index',
    icon: <Palette className="w-5 h-5" />,
    component: Lesson5Methods,
    duration: '18 menit',
    difficulty: 'advanced',
    completed: false
  },
  {
    id: 'playground',
    title: 'Interactive Playground',
    description: 'Eksplorasi bebas dengan challenges dan achievements',
    icon: <Gamepad2 className="w-5 h-5" />,
    component: InteractivePlayground,
    duration: 'Unlimited',
    difficulty: 'beginner',
    completed: false
  }
];

export function ListContainer() {
  const [activeLesson, setActiveLesson] = useState('introduction');
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('lessons');

  // Mock user progress for challenges
  const [userProgress] = useState<UserProgress>({
    challengesCompleted: 0,
    totalChallenges: challengesData.length,
    currentLevel: 1,
    experience: 150,
    nextLevelExp: 500,
    skills: {
      listCreation: { level: 1, experience: 50, nextLevelExp: 100, capabilities: ['Basic Lists'] },
      dataManipulation: { level: 1, experience: 30, nextLevelExp: 100, capabilities: ['Append', 'Remove'] },
      algorithmicThinking: { level: 1, experience: 20, nextLevelExp: 100, capabilities: ['Problem Analysis'] },
      problemSolving: { level: 1, experience: 40, nextLevelExp: 100, capabilities: ['Step by Step'] }
    },
    achievements: []
  });

  const currentLesson = lessons.find(lesson => lesson.id === activeLesson);
  const completedLessons = Object.values(lessonProgress).filter(Boolean).length;
  const totalProgress = (completedLessons / lessons.length) * 100;

  const handleLessonComplete = (lessonId: string) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: true
    }));
  };

  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
  };

  const handleChallengeComplete = (result: ChallengeResult) => {
    console.log('Challenge completed:', result);
    setSelectedChallenge(null);
    setActiveTab('lessons'); // Return to lessons after challenge
  };

  const handleHint = (hintLevel: number) => {
    console.log('Hint requested:', hintLevel);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render selected challenge
  if (selectedChallenge) {
    const challenge = challengesData.find(c => c.id === selectedChallenge);
    if (!challenge) return null;

    return (
      <div className="max-w-7xl mx-auto">
        <ChallengeContainer
          challengeId={challenge.id}
          title={challenge.title}
          description={challenge.description}
          theme={challenge.theme}
          difficulty={challenge.difficulty}
          timeLimit={challenge.estimatedTime * 60} // Convert minutes to seconds
          requiredSkills={challenge.skills}
          onComplete={handleChallengeComplete}
          onHint={handleHint}
        >
          {challenge.id === 'list-master' && <Challenge1ListMaster />}
          {/* Add other challenge components here as they're created */}
        </ChallengeContainer>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progress Pembelajaran</h2>
            <p className="text-gray-600">
              {completedLessons} dari {lessons.length} pelajaran selesai
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold">{completedLessons * 100} XP</span>
          </div>
        </div>
        <Progress value={totalProgress} className="h-3" />
        <div className="mt-2 text-sm text-gray-500">
          {Math.round(totalProgress)}% Complete
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Swords className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="playground" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Playground
          </TabsTrigger>
        </TabsList>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="mt-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Lesson Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Daftar Pelajaran</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={activeLesson === lesson.id ? "default" : "ghost"}
                        className={`w-full justify-start p-3 h-auto ${activeLesson === lesson.id ? 'bg-blue-500 hover:bg-blue-600' : ''
                          }`}
                        onClick={() => setActiveLesson(lesson.id)}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                            {lessonProgress[lesson.id] ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{lesson.title}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}
                              >
                                {lesson.difficulty}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeLesson}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="min-h-[600px]">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                          {currentLesson?.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{currentLesson?.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{currentLesson?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(currentLesson?.difficulty || 'beginner')}
                        >
                          {currentLesson?.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {currentLesson?.duration}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {currentLesson && (
                      <currentLesson.component
                        onComplete={() => handleLessonComplete(currentLesson.id)}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="mt-6">
          <ChallengeSelection
            challenges={challengesData}
            userProgress={userProgress}
            onChallengeSelect={handleChallengeSelect}
          />
        </TabsContent>

        {/* Playground Tab */}
        <TabsContent value="playground" className="mt-6">
          <Card className="min-h-[600px]">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                  <Gamepad2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Interactive Playground</CardTitle>
                  <p className="text-gray-600 text-sm">Eksplorasi bebas dengan challenges dan achievements</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <InteractivePlayground onComplete={() => { }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
