"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Play, Target, Bug, CheckCircle, XCircle } from 'lucide-react';

interface Lesson2ErrorHandlingProps {
  onComplete: () => void;
}

interface ErrorScenario {
  id: string;
  title: string;
  code: string;
  errorType: string;
  description: string;
  fixedCode: string;
  hint: string;
}

const ERROR_SCENARIOS: ErrorScenario[] = [
  {
    id: 'type_error',
    title: 'TypeError',
    code: `result = "umur: " + 25\nprint(result)`,
    errorType: 'TypeError',
    description: 'Tidak bisa menggabungkan string dan integer secara langsung',
    fixedCode: `result = "umur: " + str(25)\nprint(result)`,
    hint: 'Gunakan str() untuk mengkonversi integer ke string',
  },
  {
    id: 'value_error',
    title: 'ValueError',
    code: `angka = int("hello")\nprint(angka)`,
    errorType: 'ValueError',
    description: 'Tidak bisa mengkonversi "hello" menjadi integer',
    fixedCode: `try:\n    angka = int("hello")\nexcept ValueError:\n    print("Input bukan angka!")`,
    hint: 'Tangkap ValueError dengan try/except',
  },
  {
    id: 'index_error',
    title: 'IndexError',
    code: `daftar = [1, 2, 3]\nprint(daftar[5])`,
    errorType: 'IndexError',
    description: 'Index 5 di luar jangkauan list yang hanya punya 3 elemen (index 0-2)',
    fixedCode: `daftar = [1, 2, 3]\nif len(daftar) > 5:\n    print(daftar[5])\nelse:\n    print("Index di luar jangkauan!")`,
    hint: 'Periksa panjang list sebelum mengakses index',
  },
  {
    id: 'key_error',
    title: 'KeyError',
    code: `data = {"nama": "Budi"}\nprint(data["umur"])`,
    errorType: 'KeyError',
    description: 'Key "umur" tidak ada di dictionary',
    fixedCode: `data = {"nama": "Budi"}\nprint(data.get("umur", "Tidak ditemukan"))`,
    hint: 'Gunakan .get() dengan nilai default',
  },
  {
    id: 'zero_division',
    title: 'ZeroDivisionError',
    code: `hasil = 100 / 0\nprint(hasil)`,
    errorType: 'ZeroDivisionError',
    description: 'Pembagian dengan nol tidak diperbolehkan',
    fixedCode: `try:\n    hasil = 100 / 0\nexcept ZeroDivisionError:\n    print("Tidak bisa membagi dengan nol!")`,
    hint: 'Tangkap ZeroDivisionError',
  },
];

export function Lesson2ErrorHandling({ onComplete }: Lesson2ErrorHandlingProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showFix, setShowFix] = useState(false);
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [tryExceptDemo, setTryExceptDemo] = useState<{ phase: string; output: string[] } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const scenario = ERROR_SCENARIOS[currentScenario];

  const handleErrorGuess = (errorType: string) => {
    setSelectedError(errorType);
    if (errorType === scenario.errorType) {
      setDetectiveScore(prev => prev + 1);
      if (!completedTasks.includes('detect_error')) {
        setCompletedTasks(prev => [...prev, 'detect_error']);
      }
    }
  };

  const nextScenario = () => {
    setShowFix(false);
    setSelectedError(null);
    if (currentScenario < ERROR_SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
    }
    if (currentScenario >= 2 && !completedTasks.includes('explore_errors')) {
      setCompletedTasks(prev => [...prev, 'explore_errors']);
    }
  };

  const prevScenario = () => {
    setShowFix(false);
    setSelectedError(null);
    if (currentScenario > 0) setCurrentScenario(prev => prev - 1);
  };

  const runTryExceptDemo = async () => {
    setIsAnimating(true);
    setTryExceptDemo({ phase: 'try', output: [] });
    await new Promise(r => setTimeout(r, 800));

    setTryExceptDemo({ phase: 'try', output: ['>>> Menjalankan blok try...'] });
    await new Promise(r => setTimeout(r, 800));

    setTryExceptDemo({
      phase: 'except',
      output: ['>>> Menjalankan blok try...', '❌ Error terjadi! Masuk ke blok except...'],
    });
    await new Promise(r => setTimeout(r, 800));

    setTryExceptDemo({
      phase: 'except',
      output: [
        '>>> Menjalankan blok try...',
        '❌ Error terjadi! Masuk ke blok except...',
        '🛡️ Error berhasil ditangani!',
      ],
    });
    await new Promise(r => setTimeout(r, 800));

    setTryExceptDemo({
      phase: 'finally',
      output: [
        '>>> Menjalankan blok try...',
        '❌ Error terjadi! Masuk ke blok except...',
        '🛡️ Error berhasil ditangani!',
        '🏁 Blok finally selalu dijalankan',
      ],
    });
    await new Promise(r => setTimeout(r, 600));

    setTryExceptDemo({
      phase: 'done',
      output: [
        '>>> Menjalankan blok try...',
        '❌ Error terjadi! Masuk ke blok except...',
        '🛡️ Error berhasil ditangani!',
        '🏁 Blok finally selalu dijalankan',
        '✅ Program tetap berjalan normal!',
      ],
    });
    setIsAnimating(false);

    if (!completedTasks.includes('try_except_demo')) {
      setCompletedTasks(prev => [...prev, 'try_except_demo']);
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-rose-800">Lesson 2: Error Handling</CardTitle>
              <CardDescription className="text-rose-600">
                Pelajari cara menangani error dengan elegan menggunakan try/except/finally
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-rose-500" />
            <span>Target Pembelajaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'try_except_demo', label: 'Pahami try/except', emoji: '🛡️' },
              { key: 'detect_error', label: 'Deteksi jenis error', emoji: '🔍' },
              { key: 'explore_errors', label: 'Jelajahi macam error', emoji: '🐛' },
              { key: 'fix_error', label: 'Perbaiki kode error', emoji: '🔧' },
            ].map(task => (
              <div
                key={task.key}
                className={`p-3 rounded-lg border ${completedTasks.includes(task.key) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center space-x-2">
                  {completedTasks.includes(task.key) ? '✅' : task.emoji}
                  <span className="font-medium text-sm">{task.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Try/Except Visualizer */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <span>Visualisasi Try / Except / Finally</span>
          </CardTitle>
          <CardDescription>Lihat bagaimana Python menangani error langkah demi langkah</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
            <code>
              <span className={tryExceptDemo?.phase === 'try' ? 'text-yellow-300' : ''}>
                {`try:\n    result = 10 / 0          # Ini akan error!\n    print("Berhasil:", result)\n`}
              </span>
              <span className={tryExceptDemo?.phase === 'except' ? 'text-yellow-300' : ''}>
                {`except ZeroDivisionError as e:\n    print("Error:", e)        # Tangkap error\n`}
              </span>
              <span className={tryExceptDemo?.phase === 'finally' ? 'text-yellow-300' : ''}>
                {`finally:\n    print("Selesai!")          # Selalu dijalankan`}
              </span>
            </code>
          </pre>

          <Button onClick={runTryExceptDemo} disabled={isAnimating}
            className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600">
            <Play className="w-4 h-4 mr-2" />
            {isAnimating ? 'Menjalankan...' : 'Jalankan Demo'}
          </Button>

          <AnimatePresence>
            {tryExceptDemo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-900 rounded-lg p-4 space-y-1"
              >
                {tryExceptDemo.output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`text-sm font-mono ${
                      line.includes('❌') ? 'text-red-400' :
                      line.includes('🛡️') ? 'text-yellow-400' :
                      line.includes('✅') ? 'text-green-400' :
                      line.includes('🏁') ? 'text-blue-400' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Error Detective */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bug className="w-5 h-5 text-amber-500" />
            <span>🔍 Detektif Error</span>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Skor: {detectiveScore}/{ERROR_SCENARIOS.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Tebak jenis error yang akan terjadi, lalu lihat cara memperbaikinya!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Kasus {currentScenario + 1} / {ERROR_SCENARIOS.length}
            </Badge>
            <h3 className="text-lg font-semibold text-amber-800">Apa jenis error-nya?</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                <code>{scenario.code}</code>
              </pre>

              {/* Error type options */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['TypeError', 'ValueError', 'IndexError', 'KeyError', 'ZeroDivisionError', 'NameError'].map(err => (
                  <Button
                    key={err}
                    variant={selectedError === err ? (err === scenario.errorType ? 'default' : 'destructive') : 'outline'}
                    size="sm"
                    onClick={() => handleErrorGuess(err)}
                    disabled={selectedError !== null}
                    className={selectedError === err && err === scenario.errorType ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {selectedError !== null && err === scenario.errorType && <CheckCircle className="w-3 h-3 mr-1" />}
                    {selectedError === err && err !== scenario.errorType && <XCircle className="w-3 h-3 mr-1" />}
                    {err}
                  </Button>
                ))}
              </div>

              {/* Result feedback */}
              {selectedError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${selectedError === scenario.errorType
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'}`}
                >
                  {selectedError === scenario.errorType
                    ? `✅ Benar! Ini adalah ${scenario.errorType}`
                    : `❌ Kurang tepat. Error yang benar: ${scenario.errorType}`}
                  <p className="text-sm mt-1 opacity-80">{scenario.description}</p>
                </motion.div>
              )}

              {/* Show fix */}
              {selectedError && (
                <div>
                  <Button variant="outline" onClick={() => {
                    setShowFix(!showFix);
                    if (!completedTasks.includes('fix_error')) {
                      setCompletedTasks(prev => [...prev, 'fix_error']);
                    }
                  }} className="text-amber-600 hover:bg-amber-50">
                    {showFix ? 'Sembunyikan' : 'Lihat'} Cara Memperbaiki 🔧
                  </Button>
                  <AnimatePresence>
                    {showFix && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <p className="text-sm text-amber-700 mt-2 mb-1">💡 {scenario.hint}</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap mt-2">
                          <code>{scenario.fixedCode}</code>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevScenario} disabled={currentScenario === 0}>
              ← Sebelumnya
            </Button>
            <Button onClick={nextScenario} disabled={currentScenario === ERROR_SCENARIOS.length - 1}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              Kasus Berikutnya →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Progress Error Handling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tugas Selesai</span>
              <span>{completedTasks.length} / 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-rose-500 to-red-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium">
                🎉 Error Handling dikuasai! Lanjut ke File Operations!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
