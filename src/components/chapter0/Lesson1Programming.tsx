"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ChefHat,
  Lightbulb,
  RotateCcw,
  CheckCircle,
  XCircle,
  Play,
  Users,
  Code2
} from 'lucide-react';

interface LessonProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface Instruction {
  id: string;
  text: string;
  order: number;
  icon: string;
}

interface RobotState {
  mood: 'idle' | 'working' | 'confused' | 'happy' | 'error';
  currentStep: string;
  result: 'none' | 'perfect' | 'messy' | 'incomplete';
}

const cookingInstructions: Instruction[] = [
  { id: '1', text: 'Ambil telur dari kulkas', order: 1, icon: '🥚' },
  { id: '2', text: 'Pecahkan telur ke dalam mangkuk', order: 2, icon: '🥣' },
  { id: '3', text: 'Aduk telur hingga rata', order: 3, icon: '🥄' },
  { id: '4', text: 'Panaskan wajan dengan api sedang', order: 4, icon: '🔥' },
  { id: '5', text: 'Tuang telur ke dalam wajan', order: 5, icon: '🍳' }
];

const codingInstructions: Instruction[] = [
  { id: '1', text: 'Buka editor Python', order: 1, icon: '💻' },
  { id: '2', text: 'Ketik: print("Halo Dunia")', order: 2, icon: '⌨️' },
  { id: '3', text: 'Simpan file sebagai hello.py', order: 3, icon: '💾' },
  { id: '4', text: 'Jalankan program', order: 4, icon: '▶️' },
  { id: '5', text: 'Lihat output di layar', order: 5, icon: '📺' }
];

export default function Lesson1Programming({ onComplete, isCompleted }: LessonProps) {
  const [currentDemo, setCurrentDemo] = useState<'cooking' | 'coding'>('cooking');
  const [userInstructions, setUserInstructions] = useState<Instruction[]>([]);
  const [availableInstructions, setAvailableInstructions] = useState<Instruction[]>(
    currentDemo === 'cooking' ? [...cookingInstructions] : [...codingInstructions]
  );
  const [robot, setRobot] = useState<RobotState>({
    mood: 'idle',
    currentStep: '',
    result: 'none'
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const switchDemo = (demo: 'cooking' | 'coding') => {
    setCurrentDemo(demo);
    setUserInstructions([]);
    setAvailableInstructions(demo === 'cooking' ? [...cookingInstructions] : [...codingInstructions]);
    setRobot({ mood: 'idle', currentStep: '', result: 'none' });
  };

  const addInstruction = (instruction: Instruction) => {
    setUserInstructions([...userInstructions, instruction]);
    setAvailableInstructions(availableInstructions.filter(inst => inst.id !== instruction.id));
  };

  const removeInstruction = (instruction: Instruction) => {
    setUserInstructions(userInstructions.filter(inst => inst.id !== instruction.id));
    setAvailableInstructions([...availableInstructions, instruction].sort((a, b) => a.order - b.order));
  };

  const executeInstructions = async () => {
    if (userInstructions.length === 0) return;

    setIsAnimating(true);
    setRobot({ mood: 'working', currentStep: '', result: 'none' });

    for (const instruction of userInstructions) {
      setRobot(prev => ({ ...prev, currentStep: instruction.text }));
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Check if instructions are correct
    const correctOrder = currentDemo === 'cooking'
      ? cookingInstructions.map(i => i.id)
      : codingInstructions.map(i => i.id);

    const userOrder = userInstructions.map(i => i.id);
    const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
    const isComplete = userInstructions.length === correctOrder.length;

    if (isCorrect && isComplete) {
      setRobot({ mood: 'happy', currentStep: '✅ Berhasil!', result: 'perfect' });
      if (!isCompleted) {
        setTimeout(() => onComplete(), 1000);
      }
    } else if (isComplete) {
      setRobot({ mood: 'confused', currentStep: '❌ Urutan salah!', result: 'messy' });
    } else {
      setRobot({ mood: 'error', currentStep: '⚠️ Instruksi tidak lengkap!', result: 'incomplete' });
    }

    setIsAnimating(false);
  };

  const resetDemo = () => {
    setUserInstructions([]);
    setAvailableInstructions(
      currentDemo === 'cooking' ? [...cookingInstructions] : [...codingInstructions]
    );
    setRobot({ mood: 'idle', currentStep: '', result: 'none' });
  };

  const getRobotEmoji = () => {
    switch (robot.mood) {
      case 'happy': return '🤖😊';
      case 'confused': return '🤖😵';
      case 'error': return '🤖😱';
      case 'working': return '🤖💭';
      default: return '🤖';
    }
  };

  return (
    <div className="space-y-8">
      {/* Concept Introduction */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Pemrograman seperti memberikan instruksi kepada robot chef yang sangat patuh.</strong>
              Robot ini akan mengikuti instruksi Anda persis seperti yang Anda berikan,
              dalam urutan yang benar, tanpa pernah menebak-nebak.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Demo Selection */}
      <div className="flex justify-center space-x-4">
        <Button
          variant={currentDemo === 'cooking' ? 'default' : 'outline'}
          onClick={() => switchDemo('cooking')}
          className="flex items-center space-x-2"
        >
          <ChefHat className="w-4 h-4" />
          <span>Robot Chef</span>
        </Button>
        <Button
          variant={currentDemo === 'coding' ? 'default' : 'outline'}
          onClick={() => switchDemo('coding')}
          className="flex items-center space-x-2"
        >
          <Code2 className="w-4 h-4" />
          <span>Robot Programmer</span>
        </Button>
      </div>

      {/* Interactive Demo */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Instructions */}
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center space-x-2">
              {currentDemo === 'cooking' ? (
                <>
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Instruksi Memasak</span>
                </>
              ) : (
                <>
                  <Code2 className="w-5 h-5 text-blue-600" />
                  <span>Instruksi Coding</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Pilih instruksi dan tambahkan ke urutan robot:
            </p>

            <div className="space-y-3">
              {availableInstructions.map((instruction) => (
                <motion.div
                  key={instruction.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => addInstruction(instruction)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{instruction.icon}</span>
                      <span className="text-sm">{instruction.text}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Robot Workspace */}
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{getRobotEmoji()}</span>
              <span>Robot Workspace</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Robot Status */}
            <div className="text-center mb-6">
              <motion.div
                animate={{
                  scale: robot.mood === 'working' ? [1, 1.1, 1] : 1,
                  rotate: robot.mood === 'confused' ? [0, -10, 10, -10, 0] : 0
                }}
                transition={{
                  duration: robot.mood === 'working' ? 1 : 0.5,
                  repeat: robot.mood === 'working' ? Infinity : 0
                }}
                className="text-6xl mb-2"
              >
                {getRobotEmoji()}
              </motion.div>

              <div className="h-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={robot.currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-medium"
                  >
                    {robot.currentStep || "Menunggu instruksi..."}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* User Instructions Queue */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-sm">Urutan Instruksi:</h4>
              {userInstructions.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
                  Belum ada instruksi
                </div>
              ) : (
                <div className="space-y-2">
                  {userInstructions.map((instruction, index) => (
                    <motion.div
                      key={instruction.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <span className="text-lg">{instruction.icon}</span>
                        <span className="text-sm">{instruction.text}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeInstruction(instruction)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={executeInstructions}
                disabled={userInstructions.length === 0 || isAnimating}
                className="flex-1 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Jalankan Robot</span>
              </Button>

              <Button
                variant="outline"
                onClick={resetDemo}
                disabled={isAnimating}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {robot.result !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-4"
                >
                  {robot.result === 'perfect' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <h4 className="font-semibold">🎉 Sempurna!</h4>
                          <p className="text-sm">
                            Robot berhasil {currentDemo === 'cooking' ? 'membuat telur dadar' : 'menjalankan program'}
                            dengan mengikuti instruksi yang benar dan lengkap!
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {robot.result === 'messy' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <h4 className="font-semibold">😵 Ups! Urutan Salah</h4>
                          <p className="text-sm">
                            Robot bingung karena urutan instruksi tidak sesuai.
                            {currentDemo === 'cooking'
                              ? 'Telur jadi berantakan!'
                              : 'Program error!'
                            }
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {robot.result === 'incomplete' && (
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <h4 className="font-semibold">⚠️ Instruksi Tidak Lengkap</h4>
                          <p className="text-sm">
                            Robot berhenti karena tidak tahu harus melakukan apa selanjutnya.
                            Pastikan semua langkah sudah ditambahkan!
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Key Concepts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Pelajaran dari Robot Chef</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-green-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">📋</div>
              <h3 className="font-semibold">Urutan Penting</h3>
              <p className="text-sm text-muted-foreground">
                Seperti resep masakan, instruksi pemrograman harus diberikan
                dalam urutan yang benar untuk mendapat hasil yang diinginkan.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🎯</div>
              <h3 className="font-semibold">Presisi Mutlak</h3>
              <p className="text-sm text-muted-foreground">
                Komputer mengikuti instruksi persis seperti yang ditulis.
                Tidak ada toleransi untuk instruksi yang tidak jelas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🔄</div>
              <h3 className="font-semibold">Dapat Diulang</h3>
              <p className="text-sm text-muted-foreground">
                Instruksi yang sama akan selalu menghasilkan output yang sama,
                karena komputer konsisten 100%.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Programming Languages Preview */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-center">
            🌍 Bahasa untuk Berkomunikasi dengan Komputer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Contoh "Halo Dunia" dalam berbagai bahasa:</h3>

              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1"># Python (yang akan kita pelajari)</div>
                  <div className="text-blue-300">print("Halo Dunia")</div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1">// JavaScript</div>
                  <div className="text-blue-300">console.log("Halo Dunia");</div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1">/* Java */</div>
                  <div className="text-blue-300">System.out.println("Halo Dunia");</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Mengapa Python Perfect untuk Pemula?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mudah dibaca seperti bahasa Inggris</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sintaks yang sederhana dan bersih</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Komunitas besar dan supportif</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Digunakan di industri tech terbesar dunia</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🎉 Pelajaran 1 Selesai!</h3>
                <p>
                  Anda telah memahami konsep dasar pemrograman dengan robot chef.
                  Sekarang mari lanjut ke pelajaran berikutnya tentang variabel dan memori!
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
