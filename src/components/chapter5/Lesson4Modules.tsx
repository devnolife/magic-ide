"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Play, Target, Search, Boxes, Sparkles, Info, Monitor } from 'lucide-react';

interface Lesson4ModulesProps {
  onComplete: () => void;
}

interface ModuleInfo {
  name: string;
  icon: string;
  description: string;
  functions: { name: string; example: string; output: string }[];
}

const PYTHON_MODULES: ModuleInfo[] = [
  {
    name: 'math',
    icon: '🔢',
    description: 'Fungsi matematika: sqrt, ceil, floor, pi, dll.',
    functions: [
      { name: 'math.sqrt(16)', example: 'import math\nresult = math.sqrt(16)', output: '4.0' },
      { name: 'math.pi', example: 'import math\nprint(math.pi)', output: '3.141592653589793' },
      { name: 'math.ceil(4.2)', example: 'import math\nresult = math.ceil(4.2)', output: '5' },
      { name: 'math.floor(4.9)', example: 'import math\nresult = math.floor(4.9)', output: '4' },
    ],
  },
  {
    name: 'random',
    icon: '🎲',
    description: 'Generasi angka acak dan pilihan random.',
    functions: [
      { name: 'random.randint(1, 10)', example: 'import random\nresult = random.randint(1, 10)', output: '7  # acak antara 1-10' },
      { name: 'random.choice(list)', example: 'import random\nbuah = ["apel", "mangga", "jeruk"]\npilihan = random.choice(buah)', output: '"mangga"  # acak dari list' },
      { name: 'random.shuffle(list)', example: 'import random\nangka = [1, 2, 3, 4, 5]\nrandom.shuffle(angka)', output: '[3, 1, 5, 2, 4]  # diacak' },
      { name: 'random.random()', example: 'import random\nresult = random.random()', output: '0.7234  # float acak 0-1' },
    ],
  },
  {
    name: 'datetime',
    icon: '📅',
    description: 'Bekerja dengan tanggal dan waktu.',
    functions: [
      { name: 'datetime.now()', example: 'from datetime import datetime\nsekarang = datetime.now()', output: '2024-01-15 14:30:00' },
      { name: 'datetime.date.today()', example: 'from datetime import date\nhari_ini = date.today()', output: '2024-01-15' },
      { name: 'timedelta', example: 'from datetime import datetime, timedelta\nbesok = datetime.now() + timedelta(days=1)', output: '2024-01-16 14:30:00' },
      { name: 'strftime()', example: 'from datetime import datetime\nformatted = datetime.now().strftime("%d/%m/%Y")', output: '"15/01/2024"' },
    ],
  },
  {
    name: 'os',
    icon: '💻',
    description: 'Interaksi dengan sistem operasi: file, direktori, dll.',
    functions: [
      { name: 'os.getcwd()', example: 'import os\ncurrent_dir = os.getcwd()', output: '"/home/user/project"' },
      { name: 'os.listdir()', example: 'import os\nfiles = os.listdir(".")', output: '["main.py", "data.txt", "utils"]' },
      { name: 'os.path.exists()', example: 'import os\nada = os.path.exists("data.txt")', output: 'True' },
      { name: 'os.path.join()', example: 'import os\npath = os.path.join("folder", "file.txt")', output: '"folder/file.txt"' },
    ],
  },
];

export function Lesson4Modules({ onComplete }: Lesson4ModulesProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [exploredModules, setExploredModules] = useState<Set<string>>(new Set());
  const [runningFunction, setRunningFunction] = useState<number | null>(null);
  const [functionOutput, setFunctionOutput] = useState<{ index: number; output: string } | null>(null);
  const [conceptStep, setConceptStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentModule = PYTHON_MODULES[selectedModule];

  const importConcepts = [
    {
      title: 'import — Impor Modul',
      code: `import math\n\nresult = math.sqrt(25)  # 5.0\nprint(math.pi)          # 3.14159...`,
      explanation: 'Keyword import mengimpor seluruh modul. Akses fungsi dengan format modul.fungsi().',
    },
    {
      title: 'from...import — Impor Spesifik',
      code: `from math import sqrt, pi\n\nresult = sqrt(25)  # 5.0 — tanpa prefix math.\nprint(pi)          # 3.14159...`,
      explanation: 'from...import mengimpor fungsi spesifik sehingga bisa dipanggil langsung tanpa prefix nama modul.',
    },
    {
      title: 'as — Alias Modul',
      code: `import datetime as dt\nimport numpy as np  # konvensi umum\n\nsekarang = dt.datetime.now()\nprint(sekarang)`,
      explanation: 'Keyword as memberi alias/nama singkat pada modul agar kode lebih ringkas dan mudah dibaca.',
    },
    {
      title: 'Membuat Modul Sendiri',
      code: `# file: my_module.py\ndef salam(nama):\n    return f"Halo, {nama}!"\n\nPI = 3.14159\n\n# file: main.py\nimport my_module\n\nprint(my_module.salam("Budi"))  # "Halo, Budi!"\nprint(my_module.PI)              # 3.14159`,
      explanation: 'Setiap file .py adalah modul! Buat file Python lalu import dari file lain. Fungsi dan variabel bisa diakses.',
    },
  ];

  const exploreModule = (index: number) => {
    setSelectedModule(index);
    const moduleName = PYTHON_MODULES[index].name;
    setExploredModules(prev => new Set([...prev, moduleName]));
    setFunctionOutput(null);
    setRunningFunction(null);

    if (!completedTasks.includes('explore_module')) {
      setCompletedTasks(prev => [...prev, 'explore_module']);
    }
  };

  const runFunction = async (funcIndex: number) => {
    setIsAnimating(true);
    setRunningFunction(funcIndex);
    setFunctionOutput(null);

    await new Promise(r => setTimeout(r, 800));

    const func = currentModule.functions[funcIndex];
    setFunctionOutput({ index: funcIndex, output: func.output });
    setRunningFunction(null);
    setIsAnimating(false);

    if (!completedTasks.includes('run_function')) {
      setCompletedTasks(prev => [...prev, 'run_function']);
    }
  };

  useEffect(() => {
    if (exploredModules.size >= 3 && !completedTasks.includes('explore_many')) {
      setCompletedTasks(prev => [...prev, 'explore_many']);
    }
  }, [exploredModules, completedTasks]);

  useEffect(() => {
    if (conceptStep >= 3 && !completedTasks.includes('learn_imports')) {
      setCompletedTasks(prev => [...prev, 'learn_imports']);
    }
  }, [conceptStep, completedTasks]);

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-cyan-800">Pelajaran 4: Module (Modul) & Package (Paket)</CardTitle>
              <CardDescription className="text-cyan-600">
                Pelajari cara menggunakan dan membuat modul Python untuk kode yang terorganisir
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-cyan-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-500" />
            <span>Target Pembelajaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'learn_imports', label: 'Pahami import', emoji: '📥' },
              { key: 'explore_module', label: 'Jelajahi modul', emoji: '🔍' },
              { key: 'run_function', label: 'Jalankan fungsi modul', emoji: '▶️' },
              { key: 'explore_many', label: 'Jelajahi 3+ modul', emoji: '📦' },
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

      {/* Import Concepts */}
      <Card className="border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📥</span>
            <span>Konsep Import — Langkah demi Langkah</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
              {conceptStep + 1} / {importConcepts.length}
            </Badge>
            <h3 className="text-lg font-semibold text-cyan-800">{importConcepts[conceptStep].title}</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={conceptStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{importConcepts[conceptStep].code}</code>
              </pre>
              <p className="mt-3 text-gray-700 bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                💡 {importConcepts[conceptStep].explanation}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setConceptStep(prev => Math.max(0, prev - 1))} disabled={conceptStep === 0}>
              ← Sebelumnya
            </Button>
            <Button onClick={() => setConceptStep(prev => Math.min(importConcepts.length - 1, prev + 1))}
              disabled={conceptStep === importConcepts.length - 1}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
              Selanjutnya →
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Explorer */}
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-cyan-500" />
              <span>Penjelajah Modul</span>
              <Badge variant="secondary">{exploredModules.size} dijelajahi</Badge>
            </CardTitle>
            <CardDescription>Pilih modul Python untuk menjelajahi fungsi-fungsinya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Module selector */}
            <div className="grid grid-cols-2 gap-2">
              {PYTHON_MODULES.map((mod, index) => (
                <Button
                  key={mod.name}
                  variant={selectedModule === index ? 'default' : 'outline'}
                  onClick={() => exploreModule(index)}
                  className={selectedModule === index
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
                    : exploredModules.has(mod.name) ? 'border-green-300 bg-green-50' : ''
                  }
                >
                  <span className="mr-2">{mod.icon}</span>
                  {mod.name}
                  {exploredModules.has(mod.name) && selectedModule !== index && (
                    <span className="ml-1">✓</span>
                  )}
                </Button>
              ))}
            </div>

            {/* Module info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedModule}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-cyan-50 rounded-lg border border-cyan-200"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <h3 className="text-lg font-bold text-cyan-800">{currentModule.name}</h3>
                  {currentModule.name === 'os' ? (
                    <Badge className="bg-orange-100 text-orange-700 border border-orange-300 text-xs">🖥️ Hanya di komputer lokal</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">✅ Bisa dipelajari di sini</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{currentModule.description}</p>
                {currentModule.name === 'os' && (
                  <p className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                    <Info className="w-3 h-3 inline mr-1" />
                    Module os membutuhkan akses ke sistem operasi. Coba di Python yang terinstal di komputermu.
                  </p>
                )}
                <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                  <code>{`import ${currentModule.name}`}</code>
                </pre>
              </motion.div>
            </AnimatePresence>

            {/* Functions list */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                <Boxes className="w-4 h-4" />
                <span>Fungsi-fungsi tersedia:</span>
              </h4>
              {currentModule.functions.map((func, i) => (
                <motion.div
                  key={`${currentModule.name}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border rounded-lg p-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-cyan-700">{func.name}</code>
                    <Button size="sm" variant="outline" onClick={() => runFunction(i)}
                      disabled={isAnimating}
                      className="text-cyan-600 hover:bg-cyan-50">
                      {runningFunction === i ? (
                        <span className="animate-spin">⚙️</span>
                      ) : (
                        <><Play className="w-3 h-3 mr-1" /> Jalankan</>
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {functionOutput?.index === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                          <code>{func.example}</code>
                        </pre>
                        <div className="mt-1 flex items-center space-x-2">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          <code className="text-sm text-yellow-700 font-mono">→ {func.output}</code>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Module Builder */}
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🏗️</span>
              <span>Membuat Modul Sendiri</span>
            </CardTitle>
            <CardDescription>Contoh struktur modul Python yang baik</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-teal-200 rounded-lg overflow-hidden">
              {/* File tree */}
              <div className="bg-teal-50 p-3 border-b border-teal-200">
                <h4 className="font-semibold text-teal-800 text-sm">📁 Struktur Proyek</h4>
              </div>
              <div className="p-3 font-mono text-sm space-y-1 bg-white">
                <div>📁 my_project/</div>
                <div className="ml-4">📄 main.py</div>
                <div className="ml-4">📁 utils/</div>
                <div className="ml-8">📄 __init__.py</div>
                <div className="ml-8">📄 math_helpers.py</div>
                <div className="ml-8">📄 string_helpers.py</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📄 utils/math_helpers.py</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{`def luas_lingkaran(r):
    """Menghitung luas lingkaran"""
    import math
    return math.pi * r ** 2

def luas_segitiga(alas, tinggi):
    """Menghitung luas segitiga"""
    return 0.5 * alas * tinggi

def fahrenheit_ke_celsius(f):
    """Konversi suhu Fahrenheit ke Celsius"""
    return (f - 32) * 5 / 9`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📄 main.py</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{`from utils.math_helpers import luas_lingkaran
from utils.math_helpers import fahrenheit_ke_celsius

# Menggunakan fungsi dari modul kita
print(luas_lingkaran(5))         # 78.539...
print(fahrenheit_ke_celsius(100)) # 37.777...`}</code>
              </pre>
            </div>

            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-1">💡 Tips Membuat Modul</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Setiap file <code className="bg-gray-100 px-1 rounded">.py</code> adalah modul</li>
                <li>• Gunakan <code className="bg-gray-100 px-1 rounded">__init__.py</code> untuk membuat package</li>
                <li>• Beri nama yang deskriptif untuk modul</li>
                <li>• Tambahkan docstring pada setiap fungsi</li>
                <li>• Pisahkan kode berdasarkan fungsinya</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Praktik Mandiri */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Monitor className="w-5 h-5 text-indigo-500" />
            <span>Praktik Mandiri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-indigo-700 mb-3">🖥️ Untuk menggunakan semua module Python:</p>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">1</Badge>
              <span>Install Python di komputer: <a href="https://python.org/downloads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800">python.org/downloads</a></span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">2</Badge>
              <span>Buka editor favorit (VS Code, Thonny, atau IDLE)</span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">3</Badge>
              <span>Buat file <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">.py</code> dan import module yang ingin digunakan</span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">4</Badge>
              <span>Module <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">os</code>, <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">sys</code>, dan <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">subprocess</code> hanya bisa dijalankan di komputer lokal</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Progres Modul & Paket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tugas Selesai</span>
              <span>{completedTasks.length} / 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium">
                🎉 Semua pelajaran Chapter 5 selesai! Kamu sudah menguasai konsep lanjutan Python!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
