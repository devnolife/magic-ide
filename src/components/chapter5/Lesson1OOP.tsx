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

  const concepts = [
    {
      title: 'Class — Blueprint',
      code: `class Wizard:\n    """Blueprint untuk membuat wizard"""\n    pass`,
      explanation: 'Class adalah blueprint atau cetakan untuk membuat objek. Seperti resep yang menjelaskan cara membuat sesuatu.',
    },
    {
      title: '__init__ — Constructor',
      code: `class Wizard:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level`,
      explanation: 'Method __init__ adalah constructor yang dipanggil otomatis saat objek dibuat. self merujuk pada objek itu sendiri.',
    },
    {
      title: 'Method — Aksi Objek',
      code: `class Wizard:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\n    def cast_spell(self):\n        return f"{self.name} casts a spell!"\n\n    def level_up(self):\n        self.level += 1`,
      explanation: 'Method adalah fungsi yang didefinisikan di dalam class. Method bisa mengakses dan mengubah data objek melalui self.',
    },
    {
      title: 'Inheritance — Pewarisan',
      code: `class FireWizard(Wizard):\n    def __init__(self, name, level):\n        super().__init__(name, level)\n        self.element = "Api"\n\n    def fireball(self):\n        return f"{self.name} melempar bola api!"`,
      explanation: 'Inheritance memungkinkan class baru mewarisi atribut dan method dari class yang sudah ada (parent class).',
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
              <CardTitle className="text-2xl text-violet-800">Lesson 1: Object-Oriented Programming</CardTitle>
              <CardDescription className="text-violet-600">
                Kuasai seni pemrograman berorientasi objek — class, objek, method, dan inheritance
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

      {/* Concept Explorer */}
      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">📖</span>
            <span>Konsep OOP — Langkah demi Langkah</span>
          </CardTitle>
          <CardDescription>Navigasi melalui konsep dasar OOP di Python</CardDescription>
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
              Buat instance Wizard dari class blueprint!
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
            <CardDescription>Setiap wizard adalah objek independen dari class yang sama</CardDescription>
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
          <CardTitle className="text-green-700">Progress OOP</CardTitle>
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
