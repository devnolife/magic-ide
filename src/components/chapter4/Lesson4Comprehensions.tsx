"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Filter, Zap, Code } from 'lucide-react';

interface Lesson4ComprehensionsProps {
  onComplete: () => void;
}

export function Lesson4Comprehensions({ onComplete }: Lesson4ComprehensionsProps) {
  const [inputList, setInputList] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [condition, setCondition] = useState('x % 2 == 0');
  const [transformation, setTransformation] = useState('x * x');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [stepByStep, setStepByStep] = useState<Array<{ value: any, condition: boolean, transformed: any }>>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('list');

  const evaluateCondition = (x: number): boolean => {
    try {
      // Simple condition evaluation for demo
      if (condition.includes('x % 2 == 0')) return x % 2 === 0;
      if (condition.includes('x % 2 == 1')) return x % 2 === 1;
      if (condition.includes('x > 5')) return x > 5;
      if (condition.includes('x < 5')) return x < 5;
      if (condition.includes('x >= 5')) return x >= 5;
      if (condition.includes('x <= 5')) return x <= 5;
      return true;
    } catch {
      return true;
    }
  };

  const evaluateTransformation = (x: number): any => {
    try {
      if (transformation.includes('x * x')) return x * x;
      if (transformation.includes('x ** 2')) return x ** 2;
      if (transformation.includes('x * 2')) return x * 2;
      if (transformation.includes('x + 1')) return x + 1;
      if (transformation.includes('str(x)')) return x.toString();
      return x;
    } catch {
      return x;
    }
  };

  const runListComprehension = async () => {
    setIsProcessing(true);
    setResult([]);
    setStepByStep([]);

    const steps = [];
    const finalResult = [];

    for (let i = 0; i < inputList.length; i++) {
      const value = inputList[i];
      const conditionResult = evaluateCondition(value);
      const transformed = evaluateTransformation(value);

      steps.push({
        value,
        condition: conditionResult,
        transformed: conditionResult ? transformed : null
      });

      if (conditionResult) {
        finalResult.push(transformed);
      }

      setStepByStep([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResult(finalResult);
    setIsProcessing(false);

    if (!completedTasks.includes('list_comprehension')) {
      setCompletedTasks(prev => [...prev, 'list_comprehension']);
    }
  };

  const runDictComprehension = async () => {
    setIsProcessing(true);
    setResult([]);
    setStepByStep([]);

    const steps = [];
    const finalResult: Record<string, any> = {};

    for (let i = 0; i < inputList.length; i++) {
      const value = inputList[i];
      const conditionResult = evaluateCondition(value);
      const transformed = evaluateTransformation(value);

      steps.push({
        value,
        condition: conditionResult,
        transformed: conditionResult ? { [value]: transformed } : null
      });

      if (conditionResult) {
        finalResult[value] = transformed;
      }

      setStepByStep([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setResult([finalResult]);
    setIsProcessing(false);

    if (!completedTasks.includes('dict_comprehension')) {
      setCompletedTasks(prev => [...prev, 'dict_comprehension']);
    }
  };

  const runGeneratorDemo = async () => {
    setIsProcessing(true);
    setResult([]);
    setStepByStep([]);

    // Simulate generator behavior - lazy evaluation
    const steps = [];

    for (let i = 0; i < Math.min(inputList.length, 5); i++) {
      const value = inputList[i];
      const conditionResult = evaluateCondition(value);
      const transformed = evaluateTransformation(value);

      steps.push({
        value,
        condition: conditionResult,
        transformed: conditionResult ? `yield ${transformed}` : 'skip'
      });

      setStepByStep([...steps]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setResult([`Generator object - values computed on demand`]);
    setIsProcessing(false);

    if (!completedTasks.includes('generator_expression')) {
      setCompletedTasks(prev => [...prev, 'generator_expression']);
    }
  };

  const resetDemo = () => {
    setResult([]);
    setStepByStep([]);
    if (!completedTasks.includes('comprehension_control')) {
      setCompletedTasks(prev => [...prev, 'comprehension_control']);
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
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-violet-800">Lesson 4: Spell Comprehension Magic</CardTitle>
              <CardDescription className="text-violet-600">
                Master the art of elegant spell crafting with comprehensions and generators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-violet-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <span>Comprehension Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('list_comprehension') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('list_comprehension') ? '✅' : '📋'}
                <span className="font-medium">List Magic</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('dict_comprehension') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('dict_comprehension') ? '✅' : '📖'}
                <span className="font-medium">Dict Spells</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('generator_expression') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('generator_expression') ? '✅' : '⚡'}
                <span className="font-medium">Generators</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('comprehension_control') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('comprehension_control') ? '✅' : '🎛️'}
                <span className="font-medium">Control</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card className="border-violet-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-violet-500" />
              <span>Spell Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your comprehension parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input List */}
            <div>
              <label className="text-sm font-medium text-gray-700">Input Collection</label>
              <Input
                value={inputList.join(', ')}
                onChange={(e) => {
                  const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                  setInputList(values);
                }}
                placeholder="1, 2, 3, 4, 5"
                className="mt-1 font-mono"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="text-sm font-medium text-gray-700">Filter Condition</label>
              <Input
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="x % 2 == 0"
                className="mt-1 font-mono"
              />
            </div>

            {/* Transformation */}
            <div>
              <label className="text-sm font-medium text-gray-700">Transformation</label>
              <Input
                value={transformation}
                onChange={(e) => setTransformation(e.target.value)}
                placeholder="x * x"
                className="mt-1 font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCondition('x % 2 == 0');
                  setTransformation('x * x');
                }}
              >
                Even Squares
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCondition('x > 5');
                  setTransformation('x * 2');
                }}
              >
                Large Doubles
              </Button>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => { setActiveTab('list'); runListComprehension(); }}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                List Comprehension
              </Button>
              <Button
                onClick={() => { setActiveTab('dict'); runDictComprehension(); }}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Code className="w-4 h-4 mr-2" />
                Dict Comprehension
              </Button>
              <Button
                onClick={() => { setActiveTab('generator'); runGeneratorDemo(); }}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generator Expression
              </Button>
              <Button onClick={resetDemo} variant="outline" className="w-full">
                Reset Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Panel */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <span>Comprehension Visualization</span>
            </CardTitle>
            <CardDescription>
              Watch comprehensions transform data step by step
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="dict">Dict</TabsTrigger>
                <TabsTrigger value="generator">Generator</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-4 space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-blue-300"># List comprehension spell</div>
                  <div>[{transformation} for x in {JSON.stringify(inputList)} if {condition}]</div>
                </div>
              </TabsContent>

              <TabsContent value="dict" className="mt-4 space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-blue-300"># Dictionary comprehension spell</div>
                  <div>{`{x: ${transformation} for x in ${JSON.stringify(inputList)} if ${condition}}`}</div>
                </div>
              </TabsContent>

              <TabsContent value="generator" className="mt-4 space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-blue-300"># Generator expression spell</div>
                  <div>({transformation} for x in {JSON.stringify(inputList)} if {condition})</div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Step-by-step visualization */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-3">Step-by-step Process:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {stepByStep.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded border-l-4 ${step.condition
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-400 bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            Input: {step.value}
                          </div>
                          <div className="text-xs text-gray-600">
                            Condition: {step.condition ? '✓ Pass' : '✗ Fail'}
                          </div>
                        </div>
                        <div>
                          {step.condition && step.transformed !== null && (
                            <Badge className="bg-violet-500">
                              {typeof step.transformed === 'object'
                                ? JSON.stringify(step.transformed)
                                : step.transformed}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {stepByStep.length === 0 && !isProcessing && (
                  <div className="text-gray-500 text-sm italic text-center py-8">
                    Run a comprehension to see the transformation process...
                  </div>
                )}
                {isProcessing && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-center text-violet-600 font-medium"
                  >
                    ✨ Casting comprehension spell...
                  </motion.div>
                )}
              </div>
            </div>

            {/* Result Display */}
            {result.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-lg"
              >
                <h4 className="font-semibold text-violet-800 mb-2">Final Result:</h4>
                <div className="font-mono text-sm bg-white p-3 rounded border">
                  {typeof result[0] === 'object' ? JSON.stringify(result[0], null, 2) : JSON.stringify(result)}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Comprehension Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Comprehension Spells Mastered</span>
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
                🎉 Comprehension mastery achieved! The final playground awaits!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
