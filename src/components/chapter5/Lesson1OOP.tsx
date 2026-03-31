"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Blocks, Target, Sparkles, Plus, ChevronRight } from 'lucide-react';

interface Lesson1OOPProps {
  onComplete: () => void;
}

interface WizardInstance {
  name: string;
  level: number;
  element: string;
  hp: number;
}

const ELEMENTS = ['🔥 Api', '💧 Air', '⚡ Petir', '🌿 Alam', '❄️ Es'];

export function Lesson1OOP({ onComplete }: Lesson1OOPProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [wizardName, setWizardName] = useState('Gandalf');
  const [wizardLevel, setWizardLevel] = useState(1);
  const [wizardElement, setWizardElement] = useState(ELEMENTS[0]);
  const [instances, setInstances] = useState<WizardInstance[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<string | null>(null);
  const [conceptStep, setConceptStep] = useState(0);

  const analogies = [
    { icon: '🧁', term: 'Class = Cetakan Kue', desc: 'Class seperti cetakan kue. Dari satu cetakan, kita bisa membuat banyak kue yang bentuknya sama.' },
    { icon: '🍰', term: 'Object = Kue', desc: 'Setiap kue yang dibuat dari cetakan adalah object. Setiap kue bisa punya topping berbeda!' },
    { icon: '📋', term: '__init__ = Resep', desc: 'Ketika kue dibuat, resep (__init__) menentukan bahan-bahannya seperti nama, rasa, dan ukuran.' },
    { icon: '🎬', term: 'Method = Aksi', desc: 'Kue bisa dimakan, dipotong, dihias — itu semua adalah method (fungsi dalam class).' },
  ];

  const concepts = [
    {
      title: 'Class — Cetakan Objek',
      code: `class Wizard:\n    """Cetakan untuk membuat wizard"""\n    pass\n\n# Class = cetakan kue 🧁\n# Dari satu cetakan, bisa buat banyak wizard!`,
      explanation: 'Class adalah cetakan atau blueprint untuk membuat objek. Bayangkan cetakan kue — dari satu cetakan, kita bisa membuat banyak kue yang bentuknya sama tapi isinya bisa berbeda.',
    },
    {
      title: '__init__ — Constructor (Fungsi Pembangun)',
      code: `class Wizard:\n    def __init__(self, name, level):\n        self.name = name    # simpan nama\n        self.level = level  # simpan level\n\n# __init__ = resep 📋\n# Otomatis dipanggil saat objek dibuat\n# self = "diri sendiri" (objek yang sedang dibuat)`,
      explanation: 'Constructor (fungsi pembangun) __init__ dipanggil otomatis saat objek dibuat. Kata "self" artinya "diri sendiri" — merujuk pada objek yang sedang kita buat. Seperti resep kue yang menentukan bahan-bahannya.',
    },
    {
      title: 'Method — Fungsi dalam Class',
      code: `class Wizard:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\n    def spikal(self):  # method = aksi 🎬\n        return f"{self.name} merapal mantra!"\n\n    def level_up(self):\n        self.level += 1\n        print(f"{self.name} naik ke level {self.level}!")`,
      explanation: 'Method (fungsi dalam class) adalah aksi yang bisa dilakukan objek. Wizard bisa merapal mantra dan naik level — itu semua method! Method bisa mengakses data objek lewat "self".',
    },
    {
      title: 'Inheritance — Pewarisan Sifat',
      code: `class Hewan:  # Class induk (parent)\n    def __init__(self, nama, umur):\n        self.nama = nama\n        self.umur = umur\n\nclass Kucing(Hewan):  # Kucing mewarisi Hewan\n    def __init__(self, nama, umur, warna):\n        super().__init__(nama, umur)  # ambil sifat dari Hewan\n        self.warna = warna  # tambah sifat baru\n\n    def suara(self):\n        return f"{self.nama}: Meow! 🐱"\n\nclass Anjing(Hewan):  # Anjing juga mewarisi Hewan\n    def suara(self):\n        return f"{self.nama}: Guk guk! 🐶"\n\n# Contoh:\nkucing = Kucing("Milo", 2, "Oranye")\nprint(kucing.suara())  # Milo: Meow! 🐱`,
      explanation: 'Inheritance (pewarisan sifat) memungkinkan class anak mewarisi sifat dari class induk. Kucing dan Anjing sama-sama Hewan (punya nama & umur), tapi suaranya berbeda! super() memanggil "orang tua" class untuk mengambil sifat dasarnya.',
    },
  ];

  const createWizard = async () => {
    setIsAnimating(true);

    const phases = ['Membaca blueprint...', 'Memanggil __init__...', 'Menetapkan atribut...', 'Wizard siap! ✨'];
    for (const phase of phases) {
      setAnimationPhase(phase);
      await new Promise(r => setTimeout(r, 600));
    }

    const newWizard: WizardInstance = {
      name: wizardName,
      level: wizardLevel,
      element: wizardElement,
      hp: 100 + wizardLevel * 10,
    };
    setInstances(prev => [...prev, newWizard]);
    setAnimationPhase(null);
    setIsAnimating(false);

    if (!completedTasks.includes('create_instance')) {
      setCompletedTasks(prev => [...prev, 'create_instance']);
    }
  };

  const levelUpWizard = (index: number) => {
    setInstances(prev => prev.map((w, i) =>
      i === index ? { ...w, level: w.level + 1, hp: w.hp + 10 } : w
    ));
    if (!completedTasks.includes('use_method')) {
      setCompletedTasks(prev => [...prev, 'use_method']);
    }
  };

  const nextConcept = () => {
    if (conceptStep < concepts.length - 1) {
      setConceptStep(prev => prev + 1);
    }
    if (conceptStep >= 2 && !completedTasks.includes('learn_concepts')) {
      setCompletedTasks(prev => [...prev, 'learn_concepts']);
    }
  };

  const prevConcept = () => {
    if (conceptStep > 0) setConceptStep(prev => prev - 1);
  };

  useEffect(() => {
    if (instances.length >= 2 && !completedTasks.includes('multiple_instances')) {
      setCompletedTasks(prev => [...prev, 'multiple_instances']);
    }
  }, [instances, completedTasks]);

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Blocks className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-violet-800">Pelajaran 1: OOP (Pemrograman Berorientasi Objek)</CardTitle>
              <CardDescription className="text-violet-600">
                Belajar membuat &quot;cetakan&quot; dan &quot;objek&quot; di Python — pahami class, object, method (fungsi dalam class), dan inheritance (pewarisan sifat)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-violet-500" />
            <span>Target Pembelajaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'learn_concepts', label: 'Pahami konsep OOP', emoji: '📖' },
              { key: 'create_instance', label: 'Buat objek dari class', emoji: '🏗️' },
              { key: 'use_method', label: 'Gunakan method', emoji: '⚡' },
              { key: 'multiple_instances', label: 'Buat banyak objek', emoji: '👥' },
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

      {/* Real-World Analogies */}
      <Card className="border-violet-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span>Analogi Dunia Nyata — OOP itu Gampang!</span>
          </CardTitle>
          <CardDescription>Pahami konsep OOP dengan perumpamaan sehari-hari</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analogies.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-white rounded-lg border border-amber-200 shadow-sm"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="font-bold text-amber-800">{a.term}</span>
                </div>
                <p className="text-sm text-gray-700">{a.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white/70 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900 font-medium text-center">
              🐱 Contoh sederhana: <code className="bg-amber-100 px-1 rounded">class Kucing</code> adalah cetakan →{' '}
              <code className="bg-amber-100 px-1 rounded">milo = Kucing(&quot;Milo&quot;, 2)</code> adalah kue (objek) yang dibuat dari cetakan itu!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Inheritance Visual */}
      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🌳</span>
            <span>Inheritance (Pewarisan Sifat) — Visualisasi</span>
          </CardTitle>
          <CardDescription>
            Class anak mewarisi sifat dari class induk, seperti anak mewarisi sifat dari orang tua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-violet-100 border-2 border-violet-300 rounded-xl text-center min-w-48">
              <p className="font-bold text-violet-800">🐾 class Hewan</p>
              <p className="text-xs text-violet-600 mt-1">nama, umur</p>
            </div>
            <div className="text-violet-400 text-2xl">↙️ ↘️</div>
            <div className="flex gap-4 flex-wrap justify-center">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center min-w-40">
                <p className="font-bold text-blue-800">🐱 class Kucing</p>
                <p className="text-xs text-blue-600 mt-1">+ warna</p>
                <p className="text-xs text-blue-500">suara() → &quot;Meow!&quot;</p>
              </div>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center min-w-40">
                <p className="font-bold text-green-800">🐶 class Anjing</p>
                <p className="text-xs text-green-600 mt-1">+ ras</p>
                <p className="text-xs text-green-500">suara() → &quot;Guk guk!&quot;</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center max-w-md">
              ☝️ Kucing dan Anjing <strong>mewarisi</strong> nama &amp; umur dari Hewan.
              Tapi masing-masing punya sifat dan aksi sendiri!{' '}
              <code className="bg-violet-100 px-1 rounded text-violet-700">super()</code> memanggil &quot;orang tua&quot; class untuk mengambil sifat dasarnya.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Concept Explorer */}
      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📖</span>
            <span>Konsep OOP — Langkah demi Langkah</span>
          </CardTitle>
          <CardDescription>Pelajari konsep OOP satu per satu dengan contoh kode Python</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-violet-50 text-violet-700">
              {conceptStep + 1} / {concepts.length}
            </Badge>
            <h3 className="text-lg font-semibold text-violet-800">{concepts[conceptStep].title}</h3>
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
                <code>{concepts[conceptStep].code}</code>
              </pre>
              <p className="mt-3 text-gray-700 bg-violet-50 p-3 rounded-lg border border-violet-200">
                💡 {concepts[conceptStep].explanation}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevConcept} disabled={conceptStep === 0}>
              ← Sebelumnya
            </Button>
            <Button onClick={nextConcept} disabled={conceptStep === concepts.length - 1}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
              Selanjutnya →
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wizard Creator */}
        <Card className="border-violet-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <span>Workshop Pembuat Wizard</span>
            </CardTitle>
            <CardDescription>
              Buat instance (objek yang dibuat dari class) Wizard dari cetakan class!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
              <code>{`class Wizard:
    def __init__(self, name, level, element):
        self.name = name
        self.level = level
        self.element = element
        self.hp = 100 + level * 10

    def level_up(self):
        self.level += 1
        self.hp += 10

# Buat wizard baru:
w = Wizard("${wizardName}", ${wizardLevel}, "${wizardElement}")`}</code>
            </pre>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Wizard</label>
                <Input value={wizardName} onChange={e => setWizardName(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <Input type="number" min={1} max={99} value={wizardLevel}
                    onChange={e => setWizardLevel(parseInt(e.target.value) || 1)} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Elemen</label>
                  <select value={wizardElement} onChange={e => setWizardElement(e.target.value)}
                    className="mt-1 w-full border rounded-md p-2 text-sm">
                    {ELEMENTS.map(el => <option key={el} value={el}>{el}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <Button onClick={createWizard} disabled={isAnimating || !wizardName}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              {isAnimating ? 'Membuat...' : 'Buat Wizard (Instantiasi)'}
            </Button>

            <AnimatePresence>
              {animationPhase && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-3 bg-violet-100 rounded-lg text-violet-700 font-medium"
                >
                  ⚙️ {animationPhase}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Instances Panel */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span>Objek yang Dibuat</span>
              <Badge variant="secondary">{instances.length} instance</Badge>
            </CardTitle>
            <CardDescription>Setiap wizard adalah instance (objek) independen dari class yang sama — seperti kue-kue dari cetakan yang sama!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {instances.map((wizard, index) => (
                  <motion.div
                    key={`${wizard.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 border-2 border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-purple-800">{wizard.name}</h4>
                        <p className="text-sm text-gray-600">
                          Level: <Badge variant="outline">{wizard.level}</Badge>{' '}
                          HP: <Badge variant="outline" className="bg-green-50">{wizard.hp}</Badge>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{wizard.element}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => levelUpWizard(index)}
                        className="text-purple-600 hover:bg-purple-100">
                        <ChevronRight className="w-3 h-3 mr-1" /> level_up()
                      </Button>
                    </div>
                    <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
                      <code>{`>>> wizard_${index}.name  →  "${wizard.name}"
>>> wizard_${index}.level →  ${wizard.level}
>>> wizard_${index}.hp    →  ${wizard.hp}`}</code>
                    </pre>
                  </motion.div>
                ))}
              </AnimatePresence>
              {instances.length === 0 && (
                <div className="text-center text-gray-400 py-8 italic">
                  Belum ada wizard. Buat instance pertamamu! 🧙‍♂️
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Progres OOP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tugas Selesai</span>
              <span>{completedTasks.length} / 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium">
                🎉 OOP dasar sudah dikuasai! Lanjut ke Error Handling!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
