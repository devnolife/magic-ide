"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Play,
  RotateCcw,
  Filter,
  Zap,
  ChevronRight,
  Beaker,
  Wand2
} from 'lucide-react';

interface LessonComponentProps {
  onComplete: () => void;
}

// Spell transformation types
const transformations = [
  { id: 'square', name: 'Square Power', formula: 'x**2', icon: '²', description: 'Multiply by itself' },
  { id: 'double', name: 'Double Essence', formula: 'x*2', icon: '×2', description: 'Double the value' },
  { id: 'reverse', name: 'Mirror Flip', formula: 'str(x)[::-1]', icon: '↔️', description: 'Reverse string' },
  { id: 'upper', name: 'Amplify Voice', formula: 'x.upper()', icon: '🔊', description: 'Uppercase text' },
];

const conditions = [
  { id: 'even', name: 'Even Filter', formula: 'x % 2 == 0', icon: '⚖️', description: 'Only even numbers' },
  { id: 'odd', name: 'Odd Filter', formula: 'x % 2 == 1', icon: '🎯', description: 'Only odd numbers' },
  { id: 'greater', name: 'Greater Than 5', formula: 'x > 5', icon: '📈', description: 'Numbers above 5' },
  { id: 'length', name: 'Long Words', formula: 'len(x) > 3', icon: '📏', description: 'Words longer than 3' },
];

export function Lesson1Comprehension({ onComplete }: LessonComponentProps) {
  const [selectedTransform, setSelectedTransform] = useState('square');
  const [selectedCondition, setSelectedCondition] = useState('even');
  const [inputData, setInputData] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [comprehensionStage, setComprehensionStage] = useState<'basic' | 'filtered' | 'nested'>('basic');

  const runSpellForge = () => {
    setIsAnimating(true);
    setShowResults(false);

    setTimeout(() => {
      setShowResults(true);
      setIsAnimating(false);
    }, 2000);
  };

  const getTransformedData = () => {
    const transform = transformations.find(t => t.id === selectedTransform);
    if (!transform) return [];

    switch (selectedTransform) {
      case 'square': return inputData.map(x => x ** 2);
      case 'double': return inputData.map(x => x * 2);
      case 'reverse': return inputData.map(x => String(x).split('').reverse().join(''));
      case 'upper': return inputData.map(x => String(x).toUpperCase());
      default: return inputData;
    }
  };

  const getFilteredData = () => {
    const condition = conditions.find(c => c.id === selectedCondition);
    if (!condition) return inputData;

    switch (selectedCondition) {
      case 'even': return inputData.filter(x => x % 2 === 0);
      case 'odd': return inputData.filter(x => x % 2 === 1);
      case 'greater': return inputData.filter(x => x > 5);
      case 'length': return inputData.filter(x => String(x).length > 3);
      default: return inputData;
    }
  };

  const getComprehensionCode = () => {
    const transform = transformations.find(t => t.id === selectedTransform);
    const condition = conditions.find(c => c.id === selectedCondition);

    switch (comprehensionStage) {
      case 'basic':
        return `[${transform?.formula.replace('x', 'x')} for x in data]`;
      case 'filtered':
        return `[${transform?.formula.replace('x', 'x')} for x in data if ${condition?.formula}]`;
      case 'nested':
        return `[[x*i for i in range(3)] for x in data[:3]]`;
      default:
        return `[${transform?.formula.replace('x', 'x')} for x in data]`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Beaker className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🔮 Laboratorium Generator Mantra</h2>
            <p className="text-purple-600">Ubah bahan mentah menjadi artefak ajaib</p>
          </div>
        </div>
      </div>

      {/* Comprehension Stage Selector */}
      <Tabs value={comprehensionStage} onValueChange={(value) => setComprehensionStage(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800">
            Mantra Dasar
          </TabsTrigger>
          <TabsTrigger value="filtered" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800">
            Sihir Filter
          </TabsTrigger>
          <TabsTrigger value="nested" className="data-[state=active]:bg-purple-600 data-[state=active]:text-gray-800">
            Dimensi Nested
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {/* Spell Forge Interface */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Raw Materials */}
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Bahan Mentah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {inputData.map((item, index) => (
                    <motion.div
                      key={index}
                      className="w-12 h-12 bg-blue-500/20 border border-blue-400 rounded-lg flex items-center justify-center text-gray-800 font-mono"
                      whileHover={{ scale: 1.1 }}
                      animate={isAnimating ? {
                        x: [0, 100, 200, 300],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1]
                      } : {}}
                      transition={{ duration: 2, delay: index * 0.1 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputData([1, 2, 3, 4, 5, 6, 7, 8])}
                    className="border-blue-500/50 text-blue-300"
                  >
                    Numbers
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputData(['hello', 'world', 'magic', 'code'] as any)}
                    className="border-blue-500/50 text-blue-300"
                  >
                    Words
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transformation Furnace */}
            <Card className="bg-white border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-orange-400" />
                  Transformation Furnace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transformations.map((transform) => (
                    <motion.div
                      key={transform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedTransform === transform.id ? "default" : "outline"}
                        className={`w-full justify-start h-auto p-3 ${selectedTransform === transform.id
                          ? 'bg-orange-600 border-orange-400'
                          : 'bg-gray-700/50 border-gray-600 text-gray-300'
                          }`}
                        onClick={() => setSelectedTransform(transform.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{transform.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold">{transform.name}</div>
                            <div className="text-xs opacity-80">{transform.description}</div>
                            <code className="text-xs bg-black/30 px-2 py-1 rounded mt-1 block">
                              {transform.formula}
                            </code>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spell Forge Controls */}
          <Card className="bg-white border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-gray-800">
                    <div className="text-sm text-purple-600 mb-1">Spell Formula:</div>
                    <code className="bg-black/50 px-4 py-2 rounded-lg text-green-400 text-lg">
                      {getComprehensionCode()}
                    </code>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setIsAnimating(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    onClick={runSpellForge}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Cast Spell
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      Magical Artifacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {getTransformedData().map((item, index) => (
                        <motion.div
                          key={index}
                          className="px-4 py-2 bg-blue-500/20 border border-green-400 rounded-lg text-gray-800 font-mono"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {String(item)}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="filtered" className="space-y-4">
          {/* Filtered Magic Interface */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transform Selection */}
            <Card className="bg-white border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-orange-400" />
                  Transformation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transformations.map((transform) => (
                    <Button
                      key={transform.id}
                      variant={selectedTransform === transform.id ? "default" : "outline"}
                      className={`w-full justify-start ${selectedTransform === transform.id
                        ? 'bg-orange-600'
                        : 'bg-gray-700/50 border-gray-600'
                        }`}
                      onClick={() => setSelectedTransform(transform.id)}
                    >
                      <span className="mr-2">{transform.icon}</span>
                      {transform.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Condition Filter */}
            <Card className="bg-white border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-400" />
                  Magical Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <Button
                      key={condition.id}
                      variant={selectedCondition === condition.id ? "default" : "outline"}
                      className={`w-full justify-start ${selectedCondition === condition.id
                        ? 'bg-blue-600'
                        : 'bg-gray-700/50 border-gray-600'
                        }`}
                      onClick={() => setSelectedCondition(condition.id)}
                    >
                      <span className="mr-2">{condition.icon}</span>
                      {condition.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtered Results Preview */}
          <Card className="bg-white border-purple-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-sm text-purple-600 mb-2">Combined Spell Formula:</div>
                <code className="bg-black/50 px-4 py-2 rounded-lg text-green-400 text-lg">
                  {getComprehensionCode()}
                </code>
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={runSpellForge}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Cast Filtered Spell
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nested" className="space-y-4">
          {/* Nested Comprehension */}
          <Card className="bg-white border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Dimensional Matrix Magic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-purple-600">
                  Create magical grids with nested comprehensions
                </p>
                <code className="bg-black/50 px-4 py-2 rounded-lg text-green-400 text-lg block">
                  [[x*i for i in range(3)] for x in [1, 2, 3]]
                </code>
                <Button
                  onClick={runSpellForge}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Create Matrix
                </Button>
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
          <Sparkles className="w-5 h-5 mr-2" />
          Kuasai Generator Mantra
        </Button>
      </div>
    </div>
  );
}


