"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Hash, Target, Sparkles } from 'lucide-react';

interface Lesson1ForLoopsProps {
  onComplete: () => void;
}

interface AnimationStep {
  index: number;
  value: any;
  action: string;
  isActive: boolean;
}

export function Lesson1ForLoops({ onComplete }: Lesson1ForLoopsProps) {
  const [currentRange, setCurrentRange] = useState({ start: 0, end: 5, step: 1 });
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [customList, setCustomList] = useState(['apple', 'banana', 'cherry', 'date']);
  const [loopResults, setLoopResults] = useState<string[]>([]);

  const generateRange = () => {
    const { start, end, step } = currentRange;
    const steps: AnimationStep[] = [];

    for (let i = start; i < end; i += step) {
      steps.push({
        index: i,
        value: i,
        action: `Processing number ${i}`,
        isActive: false
      });
    }

    setAnimationSteps(steps);
    setCurrentStep(-1);

    if (!completedTasks.includes('range_loop')) {
      setCompletedTasks(prev => [...prev, 'range_loop']);
    }
  };

  const animateLoop = async () => {
    if (animationSteps.length === 0) return;

    setIsAnimating(true);
    setCurrentStep(-1);

    for (let i = 0; i < animationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setCurrentStep(-1);
    setIsAnimating(false);

    if (!completedTasks.includes('animate_loop')) {
      setCompletedTasks(prev => [...prev, 'animate_loop']);
    }
  };

  const animateListLoop = async () => {
    setIsAnimating(true);
    setLoopResults([]);

    for (let i = 0; i < customList.length; i++) {
      const item = customList[i];
      setLoopResults(prev => [...prev, `${i}: ${item}`]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsAnimating(false);

    if (!completedTasks.includes('list_loop')) {
      setCompletedTasks(prev => [...prev, 'list_loop']);
    }
  };

  const demonstrateEnumerate = async () => {
    setIsAnimating(true);
    setLoopResults([]);

    for (let i = 0; i < customList.length; i++) {
      const item = customList[i];
      setLoopResults(prev => [...prev, `enumerate(${i}, '${item}')`]);
      await new Promise(resolve => setTimeout(resolve, 700));
    }

    setIsAnimating(false);

    if (!completedTasks.includes('enumerate_demo')) {
      setCompletedTasks(prev => [...prev, 'enumerate_demo']);
    }
  };

  const updateCustomList = (index: number, value: string) => {
    const newList = [...customList];
    newList[index] = value;
    setCustomList(newList);
  };

  const addToList = () => {
    setCustomList(prev => [...prev, `item${prev.length + 1}`]);
  };

  const removeFromList = (index: number) => {
    setCustomList(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    generateRange();
  }, [currentRange]);

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-violet-800">Lesson 1: For Loop Incantations</CardTitle>
              <CardDescription className="text-violet-600">
                Master the sacred art of controlled repetition and range manipulation
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
            <span>Incantation Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('range_loop') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('range_loop') ? '✅' : '🔢'}
                <span className="font-medium">Master range() loops</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('animate_loop') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('animate_loop') ? '✅' : '▶️'}
                <span className="font-medium">Visualize loop execution</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('list_loop') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('list_loop') ? '✅' : '📝'}
                <span className="font-medium">Loop through collections</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('enumerate_demo') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('enumerate_demo') ? '✅' : '🔍'}
                <span className="font-medium">Master enumerate() magic</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Range Loop Workshop */}
        <Card className="border-violet-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-violet-500" />
              <span>Range Magic Circle</span>
            </CardTitle>
            <CardDescription>
              Configure and visualize range-based loops
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Range Controls */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Start</label>
                <Input
                  type="number"
                  value={currentRange.start}
                  onChange={(e) => setCurrentRange(prev => ({ ...prev, start: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End</label>
                <Input
                  type="number"
                  value={currentRange.end}
                  onChange={(e) => setCurrentRange(prev => ({ ...prev, end: parseInt(e.target.value) || 5 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Step</label>
                <Input
                  type="number"
                  value={currentRange.step}
                  onChange={(e) => setCurrentRange(prev => ({ ...prev, step: parseInt(e.target.value) || 1 }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Python Code Display */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-blue-300"># Range loop incantation</div>
              <div>for i in range({currentRange.start}, {currentRange.end}, {currentRange.step}):</div>
              <div className="ml-4 text-yellow-300">print(f"Current number: {'{i}'}")</div>
            </div>

            {/* Animation Controls */}
            <div className="flex space-x-2">
              <Button onClick={generateRange} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Generate Range
              </Button>
              <Button
                onClick={animateLoop}
                disabled={isAnimating || animationSteps.length === 0}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
              >
                <Play className="w-4 h-4 mr-2" />
                {isAnimating ? 'Casting...' : 'Animate Loop'}
              </Button>
            </div>

            {/* Range Visualization */}
            <div className="min-h-32">
              <h4 className="font-semibold text-gray-700 mb-3">Loop Execution Visualization:</h4>
              <div className="grid grid-cols-5 gap-2">
                <AnimatePresence>
                  {animationSteps.map((step, index) => (
                    <motion.div
                      key={step.index}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: currentStep === index ? 1.1 : 1,
                        y: 0,
                        backgroundColor: currentStep === index ? '#8b5cf6' : '#f3f4f6'
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg border-2 text-center font-bold ${currentStep === index
                          ? 'border-violet-400 text-white shadow-lg'
                          : 'border-gray-300 text-gray-700'
                        }`}
                    >
                      <div className="text-lg">{step.value}</div>
                      <div className="text-xs opacity-75">i = {step.index}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List Loop Laboratory */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📝</span>
              <span>Collection Loop Laboratory</span>
            </CardTitle>
            <CardDescription>
              Practice looping through lists and using enumerate()
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Custom List Editor */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Magical Item Collection:</h4>
              <div className="space-y-2">
                {customList.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="w-8 text-center">{index}</Badge>
                    <Input
                      value={item}
                      onChange={(e) => updateCustomList(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromList(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button onClick={addToList} variant="outline" className="w-full">
                  + Add Item
                </Button>
              </div>
            </div>

            {/* Loop Type Selector */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={animateListLoop}
                disabled={isAnimating}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Simple Loop
              </Button>
              <Button
                onClick={demonstrateEnumerate}
                disabled={isAnimating}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enumerate Loop
              </Button>
            </div>

            {/* Python Code Display */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-blue-300"># List loop variations</div>
              <div>items = {JSON.stringify(customList)}</div>
              <div className="mt-2 text-blue-300"># Simple iteration</div>
              <div>for item in items:</div>
              <div className="ml-4 text-yellow-300">print(item)</div>
              <div className="mt-2 text-blue-300"># With enumerate</div>
              <div>for index, item in enumerate(items):</div>
              <div className="ml-4 text-yellow-300">print(f"{'{index}'}: {'{item}'}")</div>
            </div>

            {/* Results Display */}
            <div className="min-h-32">
              <h4 className="font-semibold text-gray-700 mb-3">Loop Results:</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                <AnimatePresence>
                  {loopResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-green-800 py-1 border-b border-green-200 last:border-b-0"
                    >
                      {result}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loopResults.length === 0 && (
                  <div className="text-gray-500 text-sm italic">
                    Click a loop button to see results...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">For Loop Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Incantations Mastered</span>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium"
              >
                🎉 For loop mastery achieved! While circles await your command!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
