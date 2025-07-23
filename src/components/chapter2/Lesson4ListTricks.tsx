"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  RotateCcw,
  Layers,
  ArrowLeftRight,
  Target,
  Crown,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LessonComponentProps {
  onComplete: () => void;
}

const grandmasterTechniques = [
  {
    id: 'stack',
    name: 'Stack (LIFO)',
    description: 'Last In, First Out - like a stack of magical tomes',
    icon: '📚',
    operations: ['push (append)', 'pop', 'peek (top)']
  },
  {
    id: 'queue',
    name: 'Queue (FIFO)',
    description: 'First In, First Out - like a spell casting queue',
    icon: '🎯',
    operations: ['enqueue (append)', 'dequeue (pop left)', 'front']
  },
  {
    id: 'two-pointer',
    name: 'Two Pointer Technique',
    description: 'Dual cursors for efficient searching and sorting',
    icon: '🎯',
    operations: ['find pair sum', 'palindrome check', 'remove duplicates']
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    description: 'Moving window for subarray problems',
    icon: '🪟',
    operations: ['max sum window', 'substring search', 'moving average']
  }
];

export function Lesson4ListTricks({ onComplete }: LessonComponentProps) {
  const [activeTechnique, setActiveTechnique] = useState('stack');
  const [magicStack, setMagicStack] = useState<string[]>([]);
  const [spellQueue, setSpellQueue] = useState<string[]>([]);
  const [twoPointerData, setTwoPointerData] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(7);
  const [targetSum, setTargetSum] = useState(9);
  const [slidingWindow, setSlidingWindow] = useState({ start: 0, size: 3 });
  const [windowData] = useState([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]);

  // Stack operations
  const pushToStack = (spell: string) => {
    setMagicStack(prev => [...prev, spell]);
  };

  const popFromStack = () => {
    if (magicStack.length > 0) {
      setMagicStack(prev => prev.slice(0, -1));
    }
  };

  // Queue operations
  const enqueue = (spell: string) => {
    setSpellQueue(prev => [...prev, spell]);
  };

  const dequeue = () => {
    if (spellQueue.length > 0) {
      setSpellQueue(prev => prev.slice(1));
    }
  };

  // Two pointer operations
  const moveTwoPointers = () => {
    const currentSum = twoPointerData[leftPointer] + twoPointerData[rightPointer];
    if (currentSum < targetSum && leftPointer < rightPointer - 1) {
      setLeftPointer(prev => prev + 1);
    } else if (currentSum > targetSum && leftPointer < rightPointer) {
      setRightPointer(prev => prev - 1);
    }
  };

  const resetTwoPointers = () => {
    setLeftPointer(0);
    setRightPointer(twoPointerData.length - 1);
  };

  // Sliding window operations
  const moveWindow = (direction: 'left' | 'right') => {
    setSlidingWindow(prev => {
      if (direction === 'right' && prev.start + prev.size < windowData.length) {
        return { ...prev, start: prev.start + 1 };
      } else if (direction === 'left' && prev.start > 0) {
        return { ...prev, start: prev.start - 1 };
      }
      return prev;
    });
  };

  const getWindowSum = () => {
    return windowData
      .slice(slidingWindow.start, slidingWindow.start + slidingWindow.size)
      .reduce((sum, val) => sum + val, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">👑 Grandmaster Wizard Secrets</h2>
            <p className="text-yellow-600">Ancient techniques from the master wizards</p>
          </div>
        </div>
      </div>

      {/* Technique Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {grandmasterTechniques.map((technique) => (
          <motion.div
            key={technique.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={activeTechnique === technique.id ? "default" : "outline"}
              className={`h-auto p-4 w-full ${activeTechnique === technique.id
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400'
                  : 'bg-white border-gray-600 text-gray-300'
                }`}
              onClick={() => setActiveTechnique(technique.id)}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{technique.icon}</div>
                <div className="font-semibold text-sm">{technique.name}</div>
                <div className="text-xs opacity-80 mt-1">{technique.description}</div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTechnique} onValueChange={setActiveTechnique}>
        <TabsContent value="stack" className="space-y-4">
          {/* Stack Visualization */}
          <Card className="bg-white border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Magical Stack Tower
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Stack Visualization */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">Spell Stack (LIFO)</h4>
                  <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4 min-h-[200px] flex flex-col-reverse items-center justify-start">
                    <AnimatePresence>
                      {magicStack.map((spell, index) => (
                        <motion.div
                          key={`${spell}-${index}`}
                          className="w-full max-w-xs bg-purple-600 border border-purple-400 rounded-lg p-3 mb-2 text-center text-gray-800 font-semibold"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          layout
                        >
                          {spell}
                          <div className="text-xs opacity-80">Level {index + 1}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {magicStack.length === 0 && (
                      <div className="text-gray-400 text-center">Empty Stack</div>
                    )}
                  </div>
                </div>

                {/* Stack Controls */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">Stack Operations</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => pushToStack('Fire Spell')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Push Fire
                      </Button>
                      <Button
                        onClick={() => pushToStack('Ice Spell')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Push Ice
                      </Button>
                    </div>
                    <Button
                      onClick={popFromStack}
                      disabled={magicStack.length === 0}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Pop (Remove Top)
                    </Button>
                    <Button
                      onClick={() => setMagicStack([])}
                      variant="outline"
                      className="w-full border-gray-600"
                    >
                      Clear Stack
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
                    <div className="text-purple-600 text-sm">
                      <strong>Current Top:</strong> {magicStack[magicStack.length - 1] || 'None'}
                      <br />
                      <strong>Stack Size:</strong> {magicStack.length}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          {/* Queue Visualization */}
          <Card className="bg-white border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                Spell Casting Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Queue Visualization */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">Queue Pipeline (FIFO)</h4>
                  <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 min-h-[100px]">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      <div className="text-green-400 font-semibold whitespace-nowrap">IN →</div>
                      <AnimatePresence>
                        {spellQueue.map((spell, index) => (
                          <motion.div
                            key={`${spell}-${index}`}
                            className="bg-blue-600 border border-blue-400 rounded-lg px-4 py-2 text-gray-800 font-semibold whitespace-nowrap"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            layout
                          >
                            {spell}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div className="text-red-400 font-semibold whitespace-nowrap">→ OUT</div>
                      {spellQueue.length === 0 && (
                        <div className="text-gray-400 mx-auto">Empty Queue</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Queue Controls */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-800 font-semibold mb-3">Queue Operations</h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => enqueue('Lightning')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Enqueue Lightning
                      </Button>
                      <Button
                        onClick={() => enqueue('Healing')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Enqueue Healing
                      </Button>
                      <Button
                        onClick={dequeue}
                        disabled={spellQueue.length === 0}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Dequeue (Remove First)
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-gray-800 font-semibold mb-3">Queue Status</h4>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <div className="text-blue-600 text-sm space-y-1">
                        <div><strong>Next to Cast:</strong> {spellQueue[0] || 'None'}</div>
                        <div><strong>Queue Length:</strong> {spellQueue.length}</div>
                        <div><strong>Last Added:</strong> {spellQueue[spellQueue.length - 1] || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="two-pointer" className="space-y-4">
          {/* Two Pointer Technique */}
          <Card className="bg-white border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Two Pointer Spell Technique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-yellow-600 mb-2">Find two numbers that sum to: {targetSum}</div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    value={targetSum}
                    onChange={(e) => setTargetSum(Number(e.target.value))}
                    className="w-32"
                    aria-label="Target sum value"
                  />
                </div>

                {/* Array Visualization with Pointers */}
                <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {twoPointerData.map((num, index) => (
                      <motion.div
                        key={index}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-gray-800 relative ${index === leftPointer
                            ? 'bg-green-600 border-green-400'
                            : index === rightPointer
                              ? 'bg-red-600 border-red-400'
                              : 'bg-gray-600 border-gray-500'
                          }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {num}
                        {index === leftPointer && (
                          <div className="absolute -top-8 text-green-400 text-xs font-bold">LEFT</div>
                        )}
                        {index === rightPointer && (
                          <div className="absolute -top-8 text-red-400 text-xs font-bold">RIGHT</div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-gray-800 mb-2">
                      Current Sum: {twoPointerData[leftPointer]} + {twoPointerData[rightPointer]} = {twoPointerData[leftPointer] + twoPointerData[rightPointer]}
                    </div>
                    {twoPointerData[leftPointer] + twoPointerData[rightPointer] === targetSum && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400 font-bold text-lg"
                      >
                        🎯 Target Found!
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={moveTwoPointers}
                    disabled={leftPointer >= rightPointer}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Move Pointers
                  </Button>
                  <Button
                    onClick={resetTwoPointers}
                    variant="outline"
                    className="border-gray-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sliding-window" className="space-y-4">
          {/* Sliding Window */}
          <Card className="bg-white border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Sliding Window Technique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-green-600">
                  Window Size: {slidingWindow.size} | Current Sum: {getWindowSum()}
                </div>

                {/* Window Visualization */}
                <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {windowData.map((num, index) => (
                      <motion.div
                        key={index}
                        className={`w-10 h-10 rounded border-2 flex items-center justify-center font-bold text-gray-800 ${index >= slidingWindow.start && index < slidingWindow.start + slidingWindow.size
                            ? 'bg-green-600 border-green-400 scale-110'
                            : 'bg-gray-600 border-gray-500'
                          }`}
                        layout
                        transition={{ duration: 0.3 }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-green-600">
                      Window: [{windowData.slice(slidingWindow.start, slidingWindow.start + slidingWindow.size).join(', ')}]
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => moveWindow('left')}
                    disabled={slidingWindow.start === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Slide Left
                  </Button>
                  <Button
                    onClick={() => moveWindow('right')}
                    disabled={slidingWindow.start + slidingWindow.size >= windowData.length}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Slide Right
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-sm text-green-300">
                    Perfect for finding maximum sum subarray of fixed size!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Completion Button */}
      <div className="text-center pt-6">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-3"
        >
          <Crown className="w-5 h-5 mr-2" />
          Achieve Grandmaster Status
        </Button>
      </div>
    </div>
  );
}


