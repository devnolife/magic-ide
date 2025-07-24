"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Calculator,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  Cog,
  Zap,
  Target,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { OperationChain, OperationStep } from '@/types/challenges';

interface Challenge4Props {
  onComplete: (success: boolean, score: number) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface FactorySetup {
  title: string;
  description: string;
  chains: OperationChain[];
  timeLimit: number;
  passingScore: number;
}

const factorySetups: Record<string, FactorySetup> = {
  beginner: {
    title: 'Pabrik Operasi Dasar',
    description: 'Kuasai operasi matematika sederhana',
    timeLimit: 180,
    passingScore: 70,
    chains: [
      {
        id: 'basic1',
        difficulty: 'beginner',
        expectedResult: 15,
        steps: [
          { id: 'step1', operation: '5 + 10', operands: [5, 10], operator: '+', result: undefined }
        ]
      },
      {
        id: 'basic2',
        difficulty: 'beginner',
        expectedResult: 12,
        steps: [
          { id: 'step1', operation: '20 - 8', operands: [20, 8], operator: '-', result: undefined }
        ]
      },
      {
        id: 'basic3',
        difficulty: 'beginner',
        expectedResult: 24,
        steps: [
          { id: 'step1', operation: '6 * 4', operands: [6, 4], operator: '*', result: undefined }
        ]
      },
      {
        id: 'basic4',
        difficulty: 'beginner',
        expectedResult: 8,
        steps: [
          { id: 'step1', operation: '16 / 2', operands: [16, 2], operator: '/', result: undefined }
        ]
      },
      {
        id: 'combo1',
        difficulty: 'beginner',
        expectedResult: 14,
        steps: [
          { id: 'step1', operation: '2 + 3', operands: [2, 3], operator: '+', result: undefined },
          { id: 'step2', operation: 'result * 2', operands: ['result', 2], operator: '*', result: undefined },
          { id: 'step3', operation: 'result + 4', operands: ['result', 4], operator: '+', result: undefined }
        ]
      }
    ]
  },
  intermediate: {
    title: 'Pabrik Operasi Menengah',
    description: 'Tangani urutan operasi dan operator kompleks',
    timeLimit: 150,
    passingScore: 75,
    chains: [
      {
        id: 'precedence1',
        difficulty: 'intermediate',
        expectedResult: 14,
        steps: [
          { id: 'step1', operation: '2 + 3 * 4', operands: [2, 3, 4], operator: '+', result: undefined }
        ]
      },
      {
        id: 'modulo1',
        difficulty: 'intermediate',
        expectedResult: 2,
        steps: [
          { id: 'step1', operation: '17 % 5', operands: [17, 5], operator: '%', result: undefined }
        ]
      },
      {
        id: 'power1',
        difficulty: 'intermediate',
        expectedResult: 8,
        steps: [
          { id: 'step1', operation: '2 ** 3', operands: [2, 3], operator: '**', result: undefined }
        ]
      },
      {
        id: 'comparison1',
        difficulty: 'intermediate',
        expectedResult: true,
        steps: [
          { id: 'step1', operation: '10 > 5', operands: [10, 5], operator: '>', result: undefined }
        ]
      },
      {
        id: 'comparison2',
        difficulty: 'intermediate',
        expectedResult: false,
        steps: [
          { id: 'step1', operation: '7 == 8', operands: [7, 8], operator: '==', result: undefined }
        ]
      },
      {
        id: 'complex1',
        difficulty: 'intermediate',
        expectedResult: 25,
        steps: [
          { id: 'step1', operation: '3 ** 2', operands: [3, 2], operator: '**', result: undefined },
          { id: 'step2', operation: 'result + 16', operands: ['result', 16], operator: '+', result: undefined }
        ]
      }
    ]
  },
  advanced: {
    title: 'Pabrik Master Engineer',
    description: 'Operasi kompleks dengan logika dan optimisasi',
    timeLimit: 120,
    passingScore: 80,
    chains: [
      {
        id: 'logical1',
        difficulty: 'advanced',
        expectedResult: true,
        steps: [
          { id: 'step1', operation: 'True and False', operands: [true, false], operator: 'and', result: undefined },
          { id: 'step2', operation: 'not result', operands: ['result'], operator: 'not', result: undefined }
        ]
      },
      {
        id: 'logical2',
        difficulty: 'advanced',
        expectedResult: true,
        steps: [
          { id: 'step1', operation: '(5 > 3) or (2 < 1)', operands: [true, false], operator: 'or', result: undefined }
        ]
      },
      {
        id: 'mixed1',
        difficulty: 'advanced',
        expectedResult: false,
        steps: [
          { id: 'step1', operation: '10 % 3', operands: [10, 3], operator: '%', result: undefined },
          { id: 'step2', operation: 'result == 0', operands: ['result', 0], operator: '==', result: undefined }
        ]
      },
      {
        id: 'complex2',
        difficulty: 'advanced',
        expectedResult: 42,
        steps: [
          { id: 'step1', operation: '2 ** 4', operands: [2, 4], operator: '**', result: undefined },
          { id: 'step2', operation: 'result + 10', operands: ['result', 10], operator: '+', result: undefined },
          { id: 'step3', operation: 'result * 2', operands: ['result', 2], operator: '*', result: undefined },
          { id: 'step4', operation: 'result - 10', operands: ['result', 10], operator: '-', result: undefined }
        ]
      },
      {
        id: 'optimization1',
        difficulty: 'advanced',
        expectedResult: 100,
        steps: [
          { id: 'step1', operation: '50 * 2', operands: [50, 2], operator: '*', result: undefined },
          { id: 'step2', operation: 'result / 1', operands: ['result', 1], operator: '/', result: undefined }
        ]
      }
    ]
  }
};

export default function Challenge4OperationMaster({ onComplete, difficulty }: Challenge4Props) {
  const factory = factorySetups[difficulty];
  const [currentChainIndex, setCurrentChainIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [chainResults, setChainResults] = useState<{ [key: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState(factory.timeLimit);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctChains, setCorrectChains] = useState(0);
  const [factoryState, setFactoryState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const currentChain = factory.chains[currentChainIndex];
  const currentStep = currentChain?.steps[currentStepIndex];
  const totalChains = factory.chains.length;

  useEffect(() => {
    if (!isActive || isCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isCompleted, timeRemaining]);

  const startFactory = () => {
    setIsActive(true);
    setFactoryState('running');
    toast.info('🏭 Pabrik operasi dimulai! Selesaikan setiap rantai operasi dengan benar.');
  };

  const executeOperation = (operation: string, operands: any[], operator: string): any => {
    try {
      switch (operator) {
        case '+': return operands[0] + operands[1];
        case '-': return operands[0] - operands[1];
        case '*': return operands[0] * operands[1];
        case '/': return operands[0] / operands[1];
        case '%': return operands[0] % operands[1];
        case '**': return Math.pow(operands[0], operands[1]);
        case '==': return operands[0] === operands[1];
        case '!=': return operands[0] !== operands[1];
        case '<': return operands[0] < operands[1];
        case '>': return operands[0] > operands[1];
        case 'and': return operands[0] && operands[1];
        case 'or': return operands[0] || operands[1];
        case 'not': return !operands[0];
        default: return null;
      }
    } catch (error) {
      return null;
    }
  };

  const parseUserInput = (input: string): any => {
    const trimmed = input.trim();

    // Handle boolean values
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;

    // Handle numbers
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== '') return num;

    // Handle strings (assuming quoted strings)
    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      return trimmed.slice(1, -1);
    }
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
      return trimmed.slice(1, -1);
    }

    return trimmed;
  };

  const submitStep = () => {
    if (!currentStep) return;

    const userInput = userInputs[`${currentChain.id}_${currentStep.id}`];
    if (!userInput) {
      toast.error('Masukkan hasil operasi terlebih dahulu!');
      return;
    }

    const userResult = parseUserInput(userInput);

    // Calculate the correct result
    let correctResult: any;
    const operands = currentStep.operands.map(operand => {
      if (operand === 'result') {
        // Get the previous step result
        const prevStepIndex = currentStepIndex - 1;
        const prevStep = currentChain.steps[prevStepIndex];
        return prevStep?.result;
      }
      return operand;
    });

    correctResult = executeOperation(currentStep.operation, operands, currentStep.operator);

    const isCorrect = userResult === correctResult;

    if (isCorrect) {
      // Update the step with the correct result
      const updatedChain = { ...currentChain };
      updatedChain.steps[currentStepIndex].result = correctResult;

      toast.success(`✅ Benar! Hasil: ${correctResult}`);

      // Move to next step or chain
      if (currentStepIndex < currentChain.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Chain completed
        completeChain(correctResult);
      }
    } else {
      toast.error(`❌ Salah! Hasil yang benar: ${correctResult}, Anda jawab: ${userResult}`);
      // Move to next anyway but don't give points
      if (currentStepIndex < currentChain.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        completeChain(correctResult, false);
      }
    }
  };

  const completeChain = (finalResult: any, isCorrect = true) => {
    const chainCorrect = finalResult === currentChain.expectedResult && isCorrect;

    setChainResults(prev => ({
      ...prev,
      [currentChain.id]: { result: finalResult, correct: chainCorrect }
    }));

    if (chainCorrect) {
      setCorrectChains(prev => prev + 1);
      const points = difficulty === 'beginner' ? 20 : difficulty === 'intermediate' ? 30 : 40;
      setScore(prev => prev + points);
      toast.success(`🎉 Rantai operasi selesai! +${points} poin`);
    } else {
      toast.error(`💔 Rantai operasi gagal. Target: ${currentChain.expectedResult}, Hasil: ${finalResult}`);
    }

    // Move to next chain or finish
    if (currentChainIndex < totalChains - 1) {
      setTimeout(() => {
        setCurrentChainIndex(prev => prev + 1);
        setCurrentStepIndex(0);
      }, 1500);
    } else {
      setTimeout(() => finishFactory(), 1500);
    }
  };

  const handleTimeUp = () => {
    toast.warning('⏰ Waktu habis! Pabrik dihentikan.');
    finishFactory();
  };

  const finishFactory = () => {
    setIsActive(false);
    setIsCompleted(true);

    const accuracy = (correctChains / totalChains) * 100;
    const passed = accuracy >= factory.passingScore;

    if (passed) {
      setFactoryState('success');
      const timeBonus = Math.floor(timeRemaining / 3);
      const finalScore = score + timeBonus;

      toast.success(`🎉 Pabrik beroperasi dengan sukses! Akurasi: ${accuracy.toFixed(1)}%`);
      onComplete(true, finalScore);
    } else {
      setFactoryState('error');
      toast.error(`💔 Target pabrik tidak tercapai. Akurasi: ${accuracy.toFixed(1)}% (Target: ${factory.passingScore}%)`);
      onComplete(false, score);
    }
  };

  const resetFactory = () => {
    setCurrentChainIndex(0);
    setCurrentStepIndex(0);
    setUserInputs({});
    setChainResults({});
    setTimeRemaining(factory.timeLimit);
    setIsActive(false);
    setIsCompleted(false);
    setScore(0);
    setCorrectChains(0);
    setFactoryState('idle');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOperatorIcon = (operator: string) => {
    const icons: { [key: string]: string } = {
      '+': '➕', '-': '➖', '*': '✖️', '/': '➗',
      '%': '📐', '**': '🔺', '==': '⚖️', '!=': '❌',
      '<': '◀️', '>': '▶️', 'and': '🔗', 'or': '🔀', 'not': '🚫'
    };
    return icons[operator] || '⚙️';
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFactoryAnimation = () => {
    switch (factoryState) {
      case 'running':
        return { rotate: [0, 5, -5, 0], transition: { duration: 1, repeat: Infinity } };
      case 'success':
        return { scale: [1, 1.2, 1], rotate: [0, 360], transition: { duration: 1 } };
      case 'error':
        return { x: [-10, 10, -10, 10, 0], transition: { duration: 0.5 } };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={getFactoryAnimation()}
                className="text-6xl"
              >
                🏭
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {factory.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">{factory.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {totalChains} rantai operasi
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {factory.timeLimit}s
                  </Badge>
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <div className="text-sm text-gray-500">Skor</div>
                <div className="text-2xl font-bold text-gray-800">{score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Selesai</div>
                <div className="text-lg font-bold text-green-600">{correctChains}/{totalChains}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isActive && !isCompleted && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Cog className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Siap mengoperasikan pabrik?
            </h3>
            <p className="text-gray-600 mb-6">
              Anda akan menyelesaikan {totalChains} rantai operasi.
              Setiap rantai memiliki langkah-langkah yang harus diselesaikan secara berurutan.
            </p>
            <Button
              onClick={startFactory}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Mulai Produksi
            </Button>
          </CardContent>
        </Card>
      )}

      {isActive && !isCompleted && currentChain && (
        <>
          {/* Progress & Timer */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Rantai {currentChainIndex + 1} dari {totalChains} - Langkah {currentStepIndex + 1} dari {currentChain.steps.length}
                </span>
                <span className={`text-lg font-bold ${timeRemaining < 30 ? 'text-red-500' : 'text-gray-800'
                  }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Progress
                value={((currentChainIndex * currentChain.steps.length + currentStepIndex + 1) /
                  (totalChains * factory.chains.reduce((sum, chain) => sum + chain.steps.length, 0))) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Current Operation */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Operasi: {currentStep?.operation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-4xl">{getOperatorIcon(currentStep?.operator || '')}</span>
                    <Badge className={getDifficultyColor(currentChain.difficulty)}>
                      {currentChain.difficulty}
                    </Badge>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed">
                    <div className="text-3xl font-mono font-bold text-gray-800 mb-4">
                      {currentStep?.operation}
                    </div>

                    {currentStepIndex > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        Hasil langkah sebelumnya: {currentChain.steps[currentStepIndex - 1]?.result}
                      </div>
                    )}
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Masukkan hasil operasi..."
                      value={userInputs[`${currentChain.id}_${currentStep?.id}`] || ''}
                      onChange={(e) => setUserInputs(prev => ({
                        ...prev,
                        [`${currentChain.id}_${currentStep?.id}`]: e.target.value
                      }))}
                      onKeyPress={(e) => e.key === 'Enter' && submitStep()}
                      className="text-center font-mono text-lg"
                    />
                    <Button
                      onClick={submitStep}
                      disabled={!userInputs[`${currentChain.id}_${currentStep?.id}`]}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-2 text-center">
                    <div className="text-sm text-gray-500">
                      Target akhir rantai: {currentChain.expectedResult}
                    </div>
                  </div>
                </div>

                {/* Chain Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2">
                    {currentChain.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index < currentStepIndex
                            ? 'bg-green-500 text-white'
                            : index === currentStepIndex
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Results */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-0 shadow-lg ${factoryState === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                : 'bg-gradient-to-r from-red-50 to-pink-50'
              }`}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {factoryState === 'success' ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                  )}

                  <h3 className="text-2xl font-bold text-gray-800">
                    {factoryState === 'success'
                      ? '🎉 Pabrik Beroperasi Sukses!'
                      : '💔 Target Produksi Belum Tercapai'
                    }
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{score}</div>
                      <div className="text-sm text-gray-600">Skor Final</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{correctChains}</div>
                      <div className="text-sm text-gray-600">Rantai Benar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((correctChains / totalChains) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Akurasi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatTime(factory.timeLimit - timeRemaining)}
                      </div>
                      <div className="text-sm text-gray-600">Waktu Terpakai</div>
                    </div>
                  </div>

                  <Button
                    onClick={resetFactory}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart Pabrik
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
