"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Lightbulb,
  CheckCircle,
  Factory,
  Calculator,
  Type,
  Zap,
  Plus,
  Minus,
  X,
  Divide,
  Copy,
  RotateCcw,
  Play
} from 'lucide-react';

interface LessonProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface Operation {
  id: string;
  name: string;
  symbol: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  examples: Array<{
    input: string;
    result: string;
    explanation: string;
  }>;
  category: 'math' | 'string' | 'comparison' | 'logical';
}

interface CalculationStep {
  step: number;
  operation: string;
  result: string;
  explanation: string;
}

const operations: Operation[] = [
  {
    id: 'addition',
    name: 'Penjumlahan',
    symbol: '+',
    icon: Plus,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Menambahkan dua nilai',
    category: 'math',
    examples: [
      { input: '5 + 3', result: '8', explanation: 'Menambahkan 5 dengan 3' },
      { input: '2.5 + 1.5', result: '4.0', explanation: 'Penjumlahan float' },
      { input: '"Hello" + " World"', result: '"Hello World"', explanation: 'Menggabungkan string' }
    ]
  },
  {
    id: 'subtraction',
    name: 'Pengurangan',
    symbol: '-',
    icon: Minus,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    description: 'Mengurangi nilai',
    category: 'math',
    examples: [
      { input: '10 - 4', result: '6', explanation: 'Mengurangi 10 dengan 4' },
      { input: '7.5 - 2.3', result: '5.2', explanation: 'Pengurangan float' }
    ]
  },
  {
    id: 'multiplication',
    name: 'Perkalian',
    symbol: '*',
    icon: X,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Mengalikan dua nilai',
    category: 'math',
    examples: [
      { input: '4 * 3', result: '12', explanation: 'Mengalikan 4 dengan 3' },
      { input: '"Hi" * 3', result: '"HiHiHi"', explanation: 'Mengulang string 3 kali' },
      { input: '[1,2] * 2', result: '[1,2,1,2]', explanation: 'Mengulang list 2 kali' }
    ]
  },
  {
    id: 'division',
    name: 'Pembagian',
    symbol: '/',
    icon: Divide,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    description: 'Membagi dua nilai',
    category: 'math',
    examples: [
      { input: '12 / 3', result: '4.0', explanation: 'Membagi 12 dengan 3' },
      { input: '7 / 2', result: '3.5', explanation: 'Hasil selalu float' }
    ]
  },
  {
    id: 'concatenation',
    name: 'Penggabungan',
    symbol: '+',
    icon: Copy,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    description: 'Menggabungkan string',
    category: 'string',
    examples: [
      { input: '"Halo" + " Dunia"', result: '"Halo Dunia"', explanation: 'Menggabung dua string' },
      { input: '"Nilai: " + str(42)', result: '"Nilai: 42"', explanation: 'Gabung string dengan number' }
    ]
  },
  {
    id: 'comparison',
    name: 'Perbandingan',
    symbol: '==, >, <',
    icon: Calculator,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    description: 'Membandingkan nilai',
    category: 'comparison',
    examples: [
      { input: '5 > 3', result: 'True', explanation: '5 lebih besar dari 3' },
      { input: '2 == 2', result: 'True', explanation: '2 sama dengan 2' },
      { input: '"abc" < "def"', result: 'True', explanation: 'Urutan alfabetis' }
    ]
  }
];

export default function Lesson4Operations({ onComplete, isCompleted }: LessonProps) {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [successfulOperations, setSuccessfulOperations] = useState(0);

  const executeOperation = async () => {
    if (!selectedOperation || !input1 || !input2) return;

    setIsCalculating(true);
    setCalculationSteps([]);

    // Simulate factory processing
    const steps: CalculationStep[] = [
      {
        step: 1,
        operation: `Input: ${input1}`,
        result: input1,
        explanation: 'Mengambil input pertama'
      },
      {
        step: 2,
        operation: `Input: ${input2}`,
        result: input2,
        explanation: 'Mengambil input kedua'
      },
      {
        step: 3,
        operation: `Memproses: ${input1} ${selectedOperation.symbol} ${input2}`,
        result: 'Processing...',
        explanation: `Menjalankan operasi ${selectedOperation.name}`
      }
    ];

    // Add steps with animation
    for (const step of steps) {
      setCalculationSteps(prev => [...prev, step]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Calculate result
    let result = '';
    let explanation = '';

    try {
      if (selectedOperation.category === 'math') {
        const num1 = parseFloat(input1);
        const num2 = parseFloat(input2);

        if (isNaN(num1) || isNaN(num2)) {
          throw new Error('Input harus berupa angka');
        }

        switch (selectedOperation.id) {
          case 'addition':
            result = (num1 + num2).toString();
            explanation = `${num1} ditambah ${num2} sama dengan ${result}`;
            break;
          case 'subtraction':
            result = (num1 - num2).toString();
            explanation = `${num1} dikurang ${num2} sama dengan ${result}`;
            break;
          case 'multiplication':
            result = (num1 * num2).toString();
            explanation = `${num1} dikali ${num2} sama dengan ${result}`;
            break;
          case 'division':
            if (num2 === 0) throw new Error('Tidak bisa membagi dengan nol');
            result = (num1 / num2).toString();
            explanation = `${num1} dibagi ${num2} sama dengan ${result}`;
            break;
        }
      } else if (selectedOperation.category === 'string') {
        if (selectedOperation.id === 'concatenation') {
          result = input1 + input2;
          explanation = `String "${input1}" digabung dengan "${input2}"`;
        }
      } else if (selectedOperation.category === 'comparison') {
        const num1 = parseFloat(input1);
        const num2 = parseFloat(input2);

        if (!isNaN(num1) && !isNaN(num2)) {
          const isGreater = num1 > num2;
          result = isGreater.toString();
          explanation = `${num1} ${isGreater ? 'lebih besar' : 'tidak lebih besar'} dari ${num2}`;
        } else {
          const isGreater = input1 > input2;
          result = isGreater.toString();
          explanation = `"${input1}" ${isGreater ? 'lebih besar' : 'tidak lebih besar'} dari "${input2}" (secara alfabetis)`;
        }
      }

      // Final result step
      const finalStep: CalculationStep = {
        step: 4,
        operation: 'Hasil:',
        result: result,
        explanation: explanation
      };

      setCalculationSteps(prev => [...prev.slice(0, -1), {
        ...prev[prev.length - 1],
        result: result,
        explanation: explanation
      }]);

      setSuccessfulOperations(prev => prev + 1);

      // Complete lesson after 3 successful operations
      if (successfulOperations >= 2 && !isCompleted) {
        setTimeout(() => onComplete(), 1500);
      }

    } catch (error) {
      const errorStep: CalculationStep = {
        step: 4,
        operation: 'Error:',
        result: 'Error',
        explanation: error instanceof Error ? error.message : 'Terjadi kesalahan'
      };

      setCalculationSteps(prev => [...prev.slice(0, -1), errorStep]);
    }

    setIsCalculating(false);
  };

  const resetFactory = () => {
    setInput1('');
    setInput2('');
    setCalculationSteps([]);
    setSelectedOperation(null);
  };

  const useExample = (example: { input: string; result: string; explanation: string }) => {
    const parts = example.input.split(' ');
    if (parts.length >= 3) {
      setInput1(parts[0]);
      setInput2(parts[2]);
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
              <strong>Operasi seperti mesin-mesin di pabrik.</strong>
              Setiap mesin memiliki fungsi khusus: ada yang menambah, mengurang, menggabung, atau membandingkan.
              Data masuk, diproses, dan keluar hasil yang baru.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Operation Factory */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Factory className="w-5 h-5 text-indigo-600" />
              <span>Operation Factory</span>
            </div>
            <Badge variant="secondary">{successfulOperations}/3 operasi berhasil</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Operation Machines */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {operations.map((op) => {
              const IconComponent = op.icon;
              return (
                <motion.div
                  key={op.id}
                  className={`
                    border-2 rounded-lg p-4 cursor-pointer transition-all duration-300
                    ${op.bgColor}
                    ${selectedOperation?.id === op.id ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedOperation(op)}
                >
                  <div className="text-center space-y-2">
                    <IconComponent className={`w-8 h-8 mx-auto ${op.color}`} />
                    <h3 className={`font-semibold text-sm ${op.color}`}>
                      {op.name}
                    </h3>
                    <div className="font-mono text-lg font-bold">
                      {op.symbol}
                    </div>
                    <p className="text-xs text-gray-600">
                      {op.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Input Controls */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-center">🎛️ Control Panel</h3>

            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Input 1:</label>
                <Input
                  placeholder="5 atau 'Hello'"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">
                  {selectedOperation?.symbol || '?'}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedOperation?.name || 'Pilih operasi'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Input 2:</label>
                <Input
                  placeholder="3 atau 'World'"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={executeOperation}
                disabled={!selectedOperation || !input1 || !input2 || isCalculating}
                className="flex-1 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Jalankan Pabrik</span>
              </Button>

              <Button
                variant="outline"
                onClick={resetFactory}
                disabled={isCalculating}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Processing Animation */}
          <AnimatePresence>
            {calculationSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-white border-2 border-gray-200 rounded-lg p-6"
              >
                <h3 className="font-semibold mb-4 text-center">🏭 Proses Produksi</h3>

                <div className="space-y-3">
                  {calculationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{step.step}</Badge>
                        <span className="font-mono text-sm">{step.operation}</span>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-lg">
                          {step.result === 'Processing...' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block"
                            >
                              ⚙️
                            </motion.div>
                          ) : (
                            step.result
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {step.explanation}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Examples for selected operation */}
          {selectedOperation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gray-50 rounded-lg p-4"
            >
              <h4 className="font-semibold mb-3">💡 Contoh {selectedOperation.name}:</h4>
              <div className="grid gap-2">
                {selectedOperation.examples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => useExample(example)}
                    className="justify-start font-mono text-xs"
                  >
                    {example.input} → {example.result}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Operation Categories */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Jenis-Jenis Operasi</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Math Operations */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-700">
                <Calculator className="w-5 h-5 mr-2" />
                Operasi Matematika
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-4 h-4 text-green-600" />
                    <span className="font-mono">+</span>
                    <span className="text-sm">Penjumlahan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Minus className="w-4 h-4 text-red-600" />
                    <span className="font-mono">-</span>
                    <span className="text-sm">Pengurangan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="w-4 h-4 text-blue-600" />
                    <span className="font-mono">*</span>
                    <span className="text-sm">Perkalian</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Divide className="w-4 h-4 text-purple-600" />
                    <span className="font-mono">/</span>
                    <span className="text-sm">Pembagian</span>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400">a = 10</div>
                  <div className="text-green-400">b = 3</div>
                  <div className="text-blue-300">print(a + b)  # 13</div>
                  <div className="text-blue-300">print(a * b)  # 30</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* String Operations */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center text-orange-700">
                <Type className="w-5 h-5 mr-2" />
                Operasi String
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-4 h-4 text-orange-600" />
                    <span className="font-mono">+</span>
                    <span className="text-sm">Penggabungan</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <X className="w-4 h-4 text-orange-600" />
                    <span className="font-mono">*</span>
                    <span className="text-sm">Pengulangan</span>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400">nama = "Alice"</div>
                  <div className="text-green-400">salam = "Halo "</div>
                  <div className="text-blue-300">print(salam + nama)</div>
                  <div className="text-gray-500"># Output: Halo Alice</div>
                  <div className="text-blue-3000">print("Hi! " * 3)</div>
                  <div className="text-gray-500"># Output: Hi! Hi! Hi!</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Operations */}
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center text-purple-700">
                <Calculator className="w-5 h-5 mr-2" />
                Operasi Perbandingan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-mono">==</span> sama dengan</div>
                    <div><span className="font-mono">!=</span> tidak sama</div>
                    <div><span className="font-mono">&gt;</span> lebih besar</div>
                    <div><span className="font-mono">&lt;</span> lebih kecil</div>
                    <div><span className="font-mono">&gt;=</span> lebih besar sama dengan</div>
                    <div><span className="font-mono">&lt;=</span> lebih kecil sama dengan</div>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-blue-300">umur = 17</div>
                  <div className="text-blue-300">print(umur &gt;= 18)  # False</div>
                  <div className="text-blue-300">print(umur == 17)   # True</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logical Operations */}
          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center text-indigo-700">
                <Zap className="w-5 h-5 mr-2" />
                Operasi Logika
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div><span className="font-mono">and</span> - kedua kondisi harus True</div>
                    <div><span className="font-mono">or</span> - salah satu kondisi True</div>
                    <div><span className="font-mono">not</span> - membalik True/False</div>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-blue-300">punya_sim = True</div>
                  <div className="text-blue-300">umur_cukup = True</div>
                  <div className="text-blue-300">boleh_nyetir = punya_sim and umur_cukup</div>
                  <div className="text-blue-300">print(boleh_nyetir)  # True</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order of Operations */}
      <Card className="border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="text-yellow-700 text-center">
            ⚡ Urutan Operasi (Operator Precedence)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Python mengikuti urutan operasi matematika yang sama seperti di sekolah:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Urutan Prioritas:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Tanda kurung <span className="font-mono">( )</span></li>
                  <li>Pangkat <span className="font-mono">**</span></li>
                  <li>Perkalian/Pembagian <span className="font-mono">* /</span></li>
                  <li>Penjumlahan/Pengurangan <span className="font-mono">+ -</span></li>
                  <li>Perbandingan <span className="font-mono">&gt; &lt; == !=</span></li>
                  <li>Logika <span className="font-mono">and or not</span></li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Contoh:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">result = 2 + 3 * 4</div>
                  <div className="text-gray-500"># 2 + (3 * 4) = 2 + 12 = 14</div>
                  <div className="text-blue-300">result2 = (2 + 3) * 4</div>
                  <div className="text-gray-500"># (2 + 3) * 4 = 5 * 4 = 20</div>
                </div>
              </div>
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
                <h3 className="font-semibold text-lg">🎉 Chapter 0 Selesai!</h3>
                <p>
                  Selamat! Anda telah menguasai semua dasar-dasar pemrograman!
                  Anda sekarang memahami konsep pemrograman, variabel, tipe data, dan operasi.
                  Anda siap untuk mempelajari Python Lists di Chapter 1! 🐍
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
