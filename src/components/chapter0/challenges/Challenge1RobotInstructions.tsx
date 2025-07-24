"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ChefHat,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  Utensils,
  Flame,
  Shuffle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Recipe, RecipeStep } from '@/types/challenges';

interface Challenge1Props {
  onComplete: (success: boolean, score: number) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const recipes: Record<string, Recipe> = {
  beginner: {
    id: 'scrambled-eggs',
    name: 'Telur Orak-Arik',
    difficulty: 'beginner',
    timeLimit: 300,
    description: 'Masak telur orak-arik yang lezat dengan langkah sederhana',
    steps: [
      { id: 'crack', instruction: 'Pecahkan 2 telur ke dalam mangkuk', order: 1, category: 'prep', icon: '🥚' },
      { id: 'whisk', instruction: 'Kocok telur hingga rata', order: 2, category: 'prep', icon: '🥄' },
      { id: 'heat', instruction: 'Panaskan wajan dengan api sedang', order: 3, category: 'cook', icon: '🔥' },
      { id: 'oil', instruction: 'Tambahkan sedikit minyak ke wajan', order: 4, category: 'cook', icon: '🫒' },
      { id: 'pour', instruction: 'Tuangkan telur ke wajan panas', order: 5, category: 'cook', icon: '🍳' }
    ]
  },
  intermediate: {
    id: 'pasta-sauce',
    name: 'Pasta dengan Saus Tomat',
    difficulty: 'intermediate',
    timeLimit: 240,
    description: 'Buat pasta dengan saus tomat yang nikmat',
    steps: [
      { id: 'water', instruction: 'Didihkan air dalam panci besar', order: 1, category: 'prep', icon: '💧' },
      { id: 'salt', instruction: 'Tambahkan garam ke air mendidih', order: 2, category: 'prep', icon: '🧂' },
      { id: 'pasta', instruction: 'Masukkan pasta ke air mendidih', order: 3, category: 'cook', icon: '🍝' },
      { id: 'oil-pan', instruction: 'Panaskan minyak di wajan terpisah', order: 4, category: 'cook', icon: '🫒' },
      { id: 'garlic', instruction: 'Tumis bawang putih hingga harum', order: 5, category: 'cook', icon: '🧄' },
      { id: 'tomato', instruction: 'Tambahkan saus tomat dan masak', order: 6, category: 'cook', icon: '🍅' },
      { id: 'drain', instruction: 'Tiriskan pasta yang sudah matang', order: 7, category: 'combine', icon: '🥄' },
      { id: 'mix', instruction: 'Campurkan pasta dengan saus', order: 8, category: 'combine', icon: '🍝' }
    ]
  },
  advanced: {
    id: 'complex-dish',
    name: 'Nasi Goreng Spesial',
    difficulty: 'advanced',
    timeLimit: 180,
    description: 'Masak nasi goreng dengan berbagai topping',
    steps: [
      { id: 'rice', instruction: 'Siapkan nasi putih dingin', order: 1, category: 'prep', icon: '🍚' },
      { id: 'egg-beat', instruction: 'Kocok telur dalam mangkuk', order: 2, category: 'prep', icon: '🥚' },
      { id: 'chop', instruction: 'Potong bawang, cabai, dan sayuran', order: 3, category: 'prep', icon: '🔪' },
      { id: 'heat-wok', instruction: 'Panaskan wok dengan api besar', order: 4, category: 'cook', icon: '🔥' },
      { id: 'scramble', instruction: 'Orak-arik telur, sisihkan', order: 5, category: 'cook', icon: '🍳' },
      { id: 'saute', instruction: 'Tumis bumbu hingga harum', order: 6, category: 'cook', icon: '🧅' },
      { id: 'add-rice', instruction: 'Masukkan nasi, aduk rata', order: 7, category: 'cook', icon: '🍚' },
      { id: 'season', instruction: 'Tambahkan kecap dan garam', order: 8, category: 'cook', icon: '🥄' },
      { id: 'combine-egg', instruction: 'Masukkan kembali telur orak-arik', order: 9, category: 'combine', icon: '🍳' },
      { id: 'vegetables', instruction: 'Tambahkan sayuran, masak sebentar', order: 10, category: 'combine', icon: '🥬' },
      { id: 'garnish', instruction: 'Hias dengan daun bawang', order: 11, category: 'serve', icon: '🌿' },
      { id: 'serve', instruction: 'Sajikan selagi panas', order: 12, category: 'serve', icon: '🍽️' }
    ]
  }
};

export default function Challenge1RobotInstructions({ onComplete, difficulty }: Challenge1Props) {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(recipes[difficulty]);
  const [userSteps, setUserSteps] = useState<RecipeStep[]>([]);
  const [availableSteps, setAvailableSteps] = useState<RecipeStep[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [robotState, setRobotState] = useState<'idle' | 'cooking' | 'success' | 'error'>('idle');

  useEffect(() => {
    shuffleSteps();
  }, [currentRecipe]);

  const shuffleSteps = () => {
    const steps = [...currentRecipe.steps];
    for (let i = steps.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [steps[i], steps[j]] = [steps[j], steps[i]];
    }
    setAvailableSteps(steps);
    setUserSteps([]);
  };

  const addStepToSequence = (step: RecipeStep) => {
    setUserSteps(prev => [...prev, step]);
    setAvailableSteps(prev => prev.filter(s => s.id !== step.id));
  };

  const removeStepFromSequence = (step: RecipeStep, index: number) => {
    setUserSteps(prev => prev.filter((_, i) => i !== index));
    setAvailableSteps(prev => [...prev, step]);
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...userSteps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setUserSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === userSteps.length - 1) return;
    const newSteps = [...userSteps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setUserSteps(newSteps);
  };

  const checkSequence = () => {
    setAttempts(prev => prev + 1);
    setRobotState('cooking');

    if (userSteps.length !== currentRecipe.steps.length) {
      toast.error('Ops! Masih ada langkah yang hilang!');
      setRobotState('error');
      return;
    }

    const isCorrect = userSteps.every((step, index) => step.order === index + 1);

    setTimeout(() => {
      if (isCorrect) {
        setRobotState('success');
        setIsCompleted(true);
        toast.success('🎉 Perfect! Robot chef berhasil memasak!');

        const baseScore = 100;
        const attemptPenalty = (attempts - 1) * 10;
        const finalScore = Math.max(20, baseScore - attemptPenalty);

        onComplete(true, finalScore);
      } else {
        setRobotState('error');
        toast.error('Hmm, sepertinya ada yang salah dengan urutannya. Coba lagi!');

        // Highlight wrong steps
        userSteps.forEach((step, index) => {
          if (step.order !== index + 1) {
            toast.info(`"${step.instruction}" sepertinya tidak pada tempatnya`);
          }
        });
      }
    }, 2000);
  };

  const resetChallenge = () => {
    shuffleSteps();
    setAttempts(0);
    setIsCompleted(false);
    setRobotState('idle');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prep': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cook': return 'bg-red-100 text-red-800 border-red-200';
      case 'combine': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'serve': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRobotAnimation = () => {
    switch (robotState) {
      case 'cooking':
        return { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 2, repeat: 1 } };
      case 'success':
        return { scale: [1, 1.1, 1], rotate: [0, 360], transition: { duration: 1 } };
      case 'error':
        return { x: [-10, 10, -10, 10, 0], transition: { duration: 0.5 } };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={getRobotAnimation()}
                className="text-6xl"
              >
                🤖
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Robot Chef: {currentRecipe.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">{currentRecipe.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Utensils className="w-3 h-3" />
                    {currentRecipe.steps.length} langkah
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Percobaan</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Steps */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Langkah-langkah Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {availableSteps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{step.instruction}</p>
                        <Badge className={`mt-1 text-xs ${getCategoryColor(step.category)}`}>
                          {step.category}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addStepToSequence(step)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {availableSteps.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Semua langkah sudah dipindahkan!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Sequence */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Urutan Resep Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {userSteps.map((step, index) => (
                  <motion.div
                    key={`${step.id}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-3 bg-white rounded-lg shadow-sm border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {index + 1}
                      </Badge>
                      <span className="text-2xl">{step.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{step.instruction}</p>
                        <Badge className={`mt-1 text-xs ${getCategoryColor(step.category)}`}>
                          {step.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveStepDown(index)}
                          disabled={index === userSteps.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeStepFromSequence(step, index)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {userSteps.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Klik tombol + untuk menambahkan langkah ke resep
                </div>
              )}
            </div>

            {userSteps.length > 0 && (
              <div className="mt-4">
                <Progress
                  value={(userSteps.length / currentRecipe.steps.length) * 100}
                  className="h-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {userSteps.length} dari {currentRecipe.steps.length} langkah
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={resetChallenge}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Acak Ulang
        </Button>

        <Button
          onClick={checkSequence}
          disabled={userSteps.length === 0 || isCompleted || robotState === 'cooking'}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <PlayCircle className="w-4 h-4" />
          {robotState === 'cooking' ? 'Robot sedang memasak...' : 'Jalankan Resep'}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Selamat! Robot chef berhasil!
                </h3>
                <p className="text-gray-600">
                  Anda telah menguasai konsep urutan dalam pemrograman!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
