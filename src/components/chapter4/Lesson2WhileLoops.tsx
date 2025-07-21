"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Play, Pause, Square } from 'lucide-react';

interface Lesson2WhileLoopsProps {
  onComplete: () => void;
}

export function Lesson2WhileLoops({ onComplete }: Lesson2WhileLoopsProps) {
  const [condition, setCondition] = useState('counter < 5');
  const [counter, setCounter] = useState(0);
  const [maxIterations, setMaxIterations] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [iterationHistory, setIterationHistory] = useState<Array<{ iteration: number, condition: string, result: boolean }>>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [warningShown, setWarningShown] = useState(false);

  const evaluateCondition = (currentCounter: number): boolean => {
    try {
      // Simple condition evaluation for demo purposes
      if (condition.includes('counter <')) {
        const target = parseInt(condition.split('<')[1].trim());
        return currentCounter < target;
      }
      if (condition.includes('counter <=')) {
        const target = parseInt(condition.split('<=')[1].trim());
        return currentCounter <= target;
      }
      if (condition.includes('counter >')) {
        const target = parseInt(condition.split('>')[1].trim());
        return currentCounter > target;
      }
      if (condition.includes('counter >=')) {
        const target = parseInt(condition.split('>=')[1].trim());
        return currentCounter >= target;
      }
      if (condition.includes('counter !=')) {
        const target = parseInt(condition.split('!=')[1].trim());
        return currentCounter !== target;
      }
      return false;
    } catch {
      return false;
    }
  };

  const runWhileLoop = async () => {
    setIsRunning(true);
    setIterationHistory([]);
    let currentCounter = counter;
    let iteration = 0;

    while (iteration < maxIterations && evaluateCondition(currentCounter)) {
      const conditionResult = evaluateCondition(currentCounter);

      setIterationHistory(prev => [...prev, {
        iteration: iteration + 1,
        condition: condition.replace('counter', currentCounter.toString()),
        result: conditionResult
      }]);

      setCounter(currentCounter);
      await new Promise(resolve => setTimeout(resolve, 800));

      currentCounter += 1;
      iteration += 1;
    }

    // Final check
    setIterationHistory(prev => [...prev, {
      iteration: iteration + 1,
      condition: condition.replace('counter', currentCounter.toString()),
      result: evaluateCondition(currentCounter)
    }]);

    setCounter(currentCounter);
    setIsRunning(false);

    if (!completedTasks.includes('while_execution')) {
      setCompletedTasks(prev => [...prev, 'while_execution']);
    }

    if (iteration >= maxIterations) {
      setWarningShown(true);
      if (!completedTasks.includes('infinite_awareness')) {
        setCompletedTasks(prev => [...prev, 'infinite_awareness']);
      }
    }
  };

  const demonstrateBreakContinue = async () => {
    setIsRunning(true);
    setIterationHistory([]);

    for (let i = 0; i < 10; i++) {
      if (i === 3) {
        setIterationHistory(prev => [...prev, {
          iteration: i + 1,
          condition: `i = ${i} (continue - skip this iteration)`,
          result: true
        }]);
        await new Promise(resolve => setTimeout(resolve, 600));
        continue;
      }

      if (i === 7) {
        setIterationHistory(prev => [...prev, {
          iteration: i + 1,
          condition: `i = ${i} (break - exit loop)`,
          result: false
        }]);
        await new Promise(resolve => setTimeout(resolve, 600));
        break;
      }

      setIterationHistory(prev => [...prev, {
        iteration: i + 1,
        condition: `i = ${i} (normal iteration)`,
        result: true
      }]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsRunning(false);
    if (!completedTasks.includes('break_continue')) {
      setCompletedTasks(prev => [...prev, 'break_continue']);
    }
  };

  const resetDemo = () => {
    setCounter(0);
    setIterationHistory([]);
    setWarningShown(false);
    if (!completedTasks.includes('reset_control')) {
      setCompletedTasks(prev => [...prev, 'reset_control']);
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-purple-800">Lesson 2: While Circle Rituals</CardTitle>
              <CardDescription className="text-purple-600">
                Master conditional repetition and infinite circle control mechanisms
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span>While Circle Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('while_execution') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('while_execution') ? '✅' : '⭕'}
                <span className="font-medium">Execute while loops</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('infinite_awareness') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('infinite_awareness') ? '✅' : '⚠️'}
                <span className="font-medium">Understand infinite loops</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('break_continue') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('break_continue') ? '✅' : '🔄'}
                <span className="font-medium">Master break/continue</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      {warningShown && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Infinite Loop Protection Activated!</h4>
              <p className="text-red-700 text-sm">
                Loop was stopped after {maxIterations} iterations to prevent infinite execution.
                Always ensure your while conditions will eventually become false!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* While Loop Controller */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span>While Circle Controller</span>
            </CardTitle>
            <CardDescription>
              Configure and test while loop conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Condition Editor */}
            <div>
              <label className="text-sm font-medium text-gray-700">Loop Condition</label>
              <Input
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="counter < 5"
                className="mt-1 font-mono"
              />
              <p className="text-xs text-gray-600 mt-1">
                Use 'counter' as the variable name (e.g., counter &lt; 10, counter != 5)
              </p>
            </div>

            {/* Initial Values */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Initial Counter</label>
                <Input
                  type="number"
                  value={counter}
                  onChange={(e) => setCounter(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max Iterations</label>
                <Input
                  type="number"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value) || 10)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Python Code Display */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-blue-300"># While loop incantation</div>
              <div>counter = {counter}</div>
              <div>while {condition}:</div>
              <div className="ml-4 text-yellow-300">print(f"Counter: {'{counter}'}")</div>
              <div className="ml-4">counter += 1</div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={runWhileLoop}
                disabled={isRunning}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run While Loop'}
              </Button>
              <Button onClick={resetDemo} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>

            {/* Current State Display */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Current State:</h4>
              <div className="space-y-1 text-sm">
                <div>Counter: <Badge variant="outline">{counter}</Badge></div>
                <div>Condition: <code className="bg-white px-2 py-1 rounded">{condition}</code></div>
                <div>
                  Result: <Badge className={evaluateCondition(counter) ? 'bg-green-500' : 'bg-red-500'}>
                    {evaluateCondition(counter) ? 'True (continue)' : 'False (stop)'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution History */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📊</span>
              <span>Execution History</span>
            </CardTitle>
            <CardDescription>
              Track each iteration and condition evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Break/Continue Demo */}
              <div>
                <Button
                  onClick={demonstrateBreakContinue}
                  disabled={isRunning}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Demonstrate Break/Continue
                </Button>
                <p className="text-xs text-gray-600 mt-1">
                  Shows how break and continue control loop flow
                </p>
              </div>

              {/* History Display */}
              <div className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-700 mb-3">Iteration Log:</h4>
                <AnimatePresence>
                  {iterationHistory.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 mb-2 rounded border-l-4 ${entry.result
                          ? 'border-green-400 bg-green-50'
                          : 'border-red-400 bg-red-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            Iteration {entry.iteration}
                          </div>
                          <div className="text-xs text-gray-600 font-mono">
                            {entry.condition}
                          </div>
                        </div>
                        <Badge className={entry.result ? 'bg-green-500' : 'bg-red-500'}>
                          {entry.result ? 'Continue' : 'Stop'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {iterationHistory.length === 0 && (
                  <div className="text-gray-500 text-sm italic text-center py-8">
                    Run a while loop to see execution history...
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
          <CardTitle className="text-green-700">While Loop Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Circle Rituals Mastered</span>
              <span>{completedTasks.length} / 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium"
              >
                🎉 While loop mastery achieved! Nested circles await your wisdom!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
