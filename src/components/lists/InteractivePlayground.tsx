"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gamepad2,
  Trophy,
  Star,
  Target,
  CheckCircle2,
  Code,
  Play,
  RotateCcw,
  Lightbulb,
  Zap,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonProps {
  onComplete?: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialList: any[];
  targetResult: any[];
  hints: string[];
  maxOperations?: number;
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  condition: string;
}

const challenges: Challenge[] = [
  {
    id: 'playlist',
    title: 'Buat Playlist Musik',
    description: 'Buat playlist dengan 5 lagu favorit, kemudian urutkan alfabetis',
    difficulty: 'easy',
    initialList: [],
    targetResult: ['bohemian rhapsody', 'imagine', 'stairway to heaven', 'sweet child o mine', 'yesterday'],
    hints: [
      'Gunakan append() untuk menambah lagu',
      'Gunakan sort() untuk mengurutkan',
      'Gunakan huruf kecil untuk konsistensi'
    ],
    points: 100
  },
  {
    id: 'shopping',
    title: 'Kelola Daftar Belanja',
    description: 'Mulai dengan list belanja, hapus item yang sudah dibeli, tambah item baru',
    difficulty: 'medium',
    initialList: ['apel', 'roti', 'susu', 'telur', 'keju'],
    targetResult: ['apel', 'susu', 'keju', 'yogurt', 'daging'],
    hints: [
      'Hapus "roti" dan "telur" dengan remove()',
      'Tambahkan "yogurt" dan "daging" dengan append()',
      'Urutan final harus sesuai target'
    ],
    maxOperations: 6,
    points: 150
  },
  {
    id: 'grades',
    title: 'Urutkan Nilai Siswa',
    description: 'Urutkan nilai dari tertinggi ke terendah, lalu tampilkan 3 teratas',
    difficulty: 'hard',
    initialList: [85, 92, 78, 96, 88, 91, 83, 89],
    targetResult: [96, 92, 91],
    hints: [
      'Gunakan sort() dengan reverse=True untuk descending',
      'Atau gunakan sort() lalu reverse()',
      'Ambil 3 item pertama dengan slicing [:3]'
    ],
    maxOperations: 3,
    points: 200
  },
  {
    id: 'advanced',
    title: 'List Manipulation Expert',
    description: 'Gabungkan, filter, dan transformasi list dengan operasi kompleks',
    difficulty: 'hard',
    initialList: [1, 2, 3, 4, 5],
    targetResult: [2, 4, 6, 8, 10, 1, 3, 5],
    hints: [
      'Buat list baru untuk angka genap (dikalikan 2)',
      'Buat list untuk angka ganjil',
      'Gabungkan kedua list dengan extend()'
    ],
    maxOperations: 8,
    points: 300
  }
];

const achievements: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Selesaikan challenge pertama',
    icon: <Trophy className="w-5 h-5" />,
    unlocked: false,
    condition: 'complete_1_challenge'
  },
  {
    id: 'list_master',
    title: 'List Master',
    description: 'Selesaikan semua challenges',
    icon: <Award className="w-5 h-5" />,
    unlocked: false,
    condition: 'complete_all_challenges'
  },
  {
    id: 'efficiency_expert',
    title: 'Efficiency Expert',
    description: 'Selesaikan challenge dengan minimal operations',
    icon: <Zap className="w-5 h-5" />,
    unlocked: false,
    condition: 'efficient_solution'
  },
  {
    id: 'creative_coder',
    title: 'Creative Coder',
    description: 'Buat 10 list unik di free play mode',
    icon: <Lightbulb className="w-5 h-5" />,
    unlocked: false,
    condition: 'create_10_lists'
  }
];

export function InteractivePlayground({ onComplete }: LessonProps) {
  const [activeTab, setActiveTab] = useState('challenges');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [currentList, setCurrentList] = useState<any[]>([]);
  const [operationCount, setOperationCount] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [freePlayLists, setFreePlayLists] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  // Free play mode state
  const [freePlayList, setFreePlayList] = useState<any[]>([]);

  useEffect(() => {
    checkAchievements();
  }, [completedChallenges, freePlayLists.length]);

  const checkAchievements = () => {
    const newAchievements = new Set(userAchievements);

    // First Steps
    if (completedChallenges.size >= 1 && !userAchievements.has('first_steps')) {
      newAchievements.add('first_steps');
      toast.success('🏆 Achievement Unlocked: First Steps!');
    }

    // List Master
    if (completedChallenges.size === challenges.length && !userAchievements.has('list_master')) {
      newAchievements.add('list_master');
      toast.success('🏆 Achievement Unlocked: List Master!');
      onComplete?.();
    }

    // Creative Coder
    if (freePlayLists.length >= 10 && !userAchievements.has('creative_coder')) {
      newAchievements.add('creative_coder');
      toast.success('🏆 Achievement Unlocked: Creative Coder!');
    }

    setUserAchievements(newAchievements);
  };

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setCurrentList([...challenge.initialList]);
    setOperationCount(0);
    setOperationHistory([]);
  };

  const executeOperation = (operation: string, ...args: any[]) => {
    const newList = [...currentList];
    let result: any[] = newList;
    let operationStr = '';

    try {
      switch (operation) {
        case 'append':
          newList.push(args[0]);
          operationStr = `list.append(${JSON.stringify(args[0])})`;
          break;
        case 'insert':
          newList.splice(args[0], 0, args[1]);
          operationStr = `list.insert(${args[0]}, ${JSON.stringify(args[1])})`;
          break;
        case 'remove':
          const removeIndex = newList.indexOf(args[0]);
          if (removeIndex !== -1) {
            newList.splice(removeIndex, 1);
            operationStr = `list.remove(${JSON.stringify(args[0])})`;
          } else {
            throw new Error(`Value ${args[0]} not found`);
          }
          break;
        case 'pop':
          const poppedItem = args[0] !== undefined ? newList.splice(args[0], 1)[0] : newList.pop();
          operationStr = args[0] !== undefined ? `list.pop(${args[0]})` : `list.pop()`;
          break;
        case 'sort':
          newList.sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') {
              return args[0] === 'desc' ? b - a : a - b;
            }
            const comparison = String(a).localeCompare(String(b));
            return args[0] === 'desc' ? -comparison : comparison;
          });
          operationStr = args[0] === 'desc' ? 'list.sort(reverse=True)' : 'list.sort()';
          break;
        case 'reverse':
          newList.reverse();
          operationStr = 'list.reverse()';
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      setCurrentList(result);
      setOperationCount(prev => prev + 1);
      setOperationHistory(prev => [...prev, operationStr]);

      // Check if challenge is completed
      if (currentChallenge) {
        checkChallengeCompletion(newList);
      }

    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const checkChallengeCompletion = (list: any[]) => {
    if (!currentChallenge) return;

    const isCompleted = JSON.stringify(list) === JSON.stringify(currentChallenge.targetResult);

    if (isCompleted) {
      const basePoints = currentChallenge.points;
      const efficiencyBonus = currentChallenge.maxOperations && operationCount <= currentChallenge.maxOperations ? 50 : 0;
      const totalChallengePoints = basePoints + efficiencyBonus;

      setCompletedChallenges(prev => new Set([...prev, currentChallenge.id]));
      setTotalPoints(prev => prev + totalChallengePoints);

      if (efficiencyBonus > 0) {
        setUserAchievements(prev => new Set([...prev, 'efficiency_expert']));
        toast.success(`🎉 Challenge completed with efficiency bonus! +${totalChallengePoints} points`);
      } else {
        toast.success(`🎉 Challenge completed! +${basePoints} points`);
      }

      setCurrentChallenge(null);
    }
  };

  const resetChallenge = () => {
    if (currentChallenge) {
      startChallenge(currentChallenge);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addToFreePlay = () => {
    if (!newItem.trim()) return;

    const parsedItem = isNaN(Number(newItem)) ? newItem : Number(newItem);
    setFreePlayList(prev => [...prev, parsedItem]);
    setNewItem('');
  };

  const saveFreePlayList = () => {
    if (freePlayList.length === 0) return;

    const listCode = `my_list = [${freePlayList.map(item => JSON.stringify(item)).join(', ')}]`;
    setFreePlayLists(prev => [...prev, listCode]);
    toast.success('List saved to gallery!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 text-white text-2xl mb-4"
        >
          🎮
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Interactive Playground</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Apply your list skills in challenges and free exploration mode!
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">{totalPoints} Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{completedChallenges.size}/{challenges.length} Challenges</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">{userAchievements.size}/{achievements.length} Achievements</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="freeplay">Free Play</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          {!currentChallenge ? (
            <div className="grid md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="p-6 cursor-pointer" onClick={() => startChallenge(challenge)}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm">{challenge.points}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Target: {challenge.targetResult.length} items
                        {challenge.maxOperations && ` • Max ops: ${challenge.maxOperations}`}
                      </div>
                      {completedChallenges.has(challenge.id) && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Challenge Info */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{currentChallenge.title}</h3>
                  <Button variant="outline" onClick={() => setCurrentChallenge(null)}>
                    Back to Challenges
                  </Button>
                </div>

                <p className="text-gray-600 mb-4">{currentChallenge.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current List:</h4>
                    <div className="bg-gray-50 p-3 rounded min-h-[60px]">
                      <div className="flex flex-wrap gap-2">
                        {currentList.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                          >
                            {JSON.stringify(item)}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Target Result:</h4>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="flex flex-wrap gap-2">
                        {currentChallenge.targetResult.map((item, index) => (
                          <div key={index} className="px-2 py-1 bg-green-500 text-white rounded text-sm">
                            {JSON.stringify(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Operations used: {operationCount}</span>
                    {currentChallenge.maxOperations && (
                      <span className={operationCount <= currentChallenge.maxOperations ? 'text-green-600' : 'text-red-600'}>
                        Max: {currentChallenge.maxOperations}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">💡 Hints:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {currentChallenge.hints.map((hint, index) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Operations Panel */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Operations</h3>
                  <Button variant="outline" onClick={resetChallenge} size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        const value = prompt('Enter value to append:');
                        if (value !== null) {
                          const parsedValue = isNaN(Number(value)) ? value : Number(value);
                          executeOperation('append', parsedValue);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Append
                    </Button>
                    <Button
                      onClick={() => {
                        const value = prompt('Enter value to remove:');
                        if (value !== null) {
                          const parsedValue = isNaN(Number(value)) ? value : Number(value);
                          executeOperation('remove', parsedValue);
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => executeOperation('sort')}
                      variant="outline"
                      size="sm"
                    >
                      Sort
                    </Button>
                    <Button
                      onClick={() => executeOperation('reverse')}
                      variant="outline"
                      size="sm"
                    >
                      Reverse
                    </Button>
                  </div>

                  {operationHistory.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">History:</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
                        {operationHistory.map((op, index) => (
                          <div key={index}>{op}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="freeplay" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* List Builder */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Free Play List Builder</h3>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add item..."
                    onKeyPress={(e) => e.key === 'Enter' && addToFreePlay()}
                  />
                  <Button onClick={addToFreePlay}>Add</Button>
                </div>

                <div className="bg-gray-50 p-4 rounded min-h-[200px]">
                  <div className="flex flex-wrap gap-2">
                    {freePlayList.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-2 bg-purple-500 text-white rounded flex items-center space-x-2"
                      >
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          [{index}]
                        </Badge>
                        <span>{JSON.stringify(item)}</span>
                        <button
                          onClick={() => setFreePlayList(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-300 hover:text-red-100 ml-1"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={saveFreePlayList} disabled={freePlayList.length === 0}>
                    Save List
                  </Button>
                  <Button variant="outline" onClick={() => setFreePlayList([])}>
                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            {/* Saved Lists Gallery */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Saved Lists Gallery ({freePlayLists.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {freePlayLists.map((listCode, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm"
                  >
                    {listCode}
                  </motion.div>
                ))}

                {freePlayLists.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No saved lists yet. Create and save some lists!
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{
                  opacity: userAchievements.has(achievement.id) ? 1 : 0.5,
                  scale: userAchievements.has(achievement.id) ? 1 : 0.95
                }}
              >
                <Card className={`p-6 ${userAchievements.has(achievement.id) ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${userAchievements.has(achievement.id) ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                    {userAchievements.has(achievement.id) && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {completedChallenges.size === challenges.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
        >
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            🎉 Congratulations! Chapter Complete!
          </h3>
          <p className="text-gray-600">
            You've mastered all Python list operations and challenges. Total Score: {totalPoints} points!
          </p>
        </motion.div>
      )}
    </div>
  );
}
