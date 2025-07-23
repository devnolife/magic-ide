"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Plus,
  Minus,
  Copy,
  RotateCcw,
  ArrowUpDown,
  Zap,
  Timer,
  MemoryStick
} from 'lucide-react';

interface LessonComponentProps {
  onComplete: () => void;
}

// Advanced list methods with descriptions
const listMethods = [
  {
    id: 'extend',
    name: 'extend()',
    description: 'Add multiple items to the end',
    icon: <Plus className="w-4 h-4" />,
    example: 'spells.extend(["Wind", "Earth"])',
    complexity: 'O(k)',
    visual: 'multiple-flow'
  },
  {
    id: 'append-list',
    name: 'append(list)',
    description: 'Add entire list as single item',
    icon: <Plus className="w-4 h-4" />,
    example: 'spells.append(["Wind", "Earth"])',
    complexity: 'O(1)',
    visual: 'single-block'
  },
  {
    id: 'copy',
    name: 'copy()',
    description: 'Create shallow copy',
    icon: <Copy className="w-4 h-4" />,
    example: 'new_spells = spells.copy()',
    complexity: 'O(n)',
    visual: 'duplication'
  },
  {
    id: 'clear',
    name: 'clear()',
    description: 'Remove all items',
    icon: <Minus className="w-4 h-4" />,
    example: 'spells.clear()',
    complexity: 'O(1)',
    visual: 'void-effect'
  },
  {
    id: 'sort',
    name: 'sort()',
    description: 'Sort items in place',
    icon: <ArrowUpDown className="w-4 h-4" />,
    example: 'spells.sort(reverse=True)',
    complexity: 'O(n log n)',
    visual: 'sort-animation'
  }
];

export function Lesson3ListMethods({ onComplete }: LessonComponentProps) {
  const [spellBook, setSpellBook] = useState<(string | string[])[]>(["Fireball", "Heal", "Shield"]);
  const [selectedMethod, setSelectedMethod] = useState('extend');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [beforeState, setBeforeState] = useState<(string | string[])[]>([]);
  const [newSpells] = useState(["Wind Blade", "Earth Quake", "Water Wave"]);

  const executeMethod = () => {
    setIsAnimating(true);
    setBeforeState([...spellBook]);
    setShowBeforeAfter(false);

    setTimeout(() => {
      let newBook: (string | string[])[] = [...spellBook];

      switch (selectedMethod) {
        case 'extend':
          newBook = [...spellBook, ...newSpells.slice(0, 2)];
          break;
        case 'append-list':
          newBook = [...spellBook, newSpells.slice(0, 2)];
          break;
        case 'copy':
          // For demonstration, we'll show the copy with a subtle difference
          newBook = [...spellBook, "✨ (copied)"];
          break;
        case 'clear':
          newBook = [];
          break;
        case 'sort':
          newBook = [...spellBook].filter(item => typeof item === 'string').sort().reverse();
          break;
      }

      setSpellBook(newBook);
      setShowBeforeAfter(true);
      setIsAnimating(false);
    }, 1500);
  };

  const resetSpellBook = () => {
    setSpellBook(["Fireball", "Heal", "Shield"]);
    setShowBeforeAfter(false);
    setIsAnimating(false);
  };

  const getMethodComplexity = (methodId: string) => {
    const method = listMethods.find(m => m.id === methodId);
    return method?.complexity || 'O(1)';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'O(1)': return 'text-green-400';
      case 'O(k)': return 'text-yellow-400';
      case 'O(n)': return 'text-orange-400';
      case 'O(n log n)': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📜 Advanced Spellbook Arsenal</h2>
            <p className="text-purple-600">Master powerful methods from the ancient grimoires</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="methods">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="methods" className="data-[state=active]:bg-purple-600">
            Method Arsenal
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-600">
            Before/After
          </TabsTrigger>
          <TabsTrigger value="chains" className="data-[state=active]:bg-purple-600">
            Method Chains
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Method Selector */}
            <Card className="bg-white border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Spell Method Selector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {listMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedMethod === method.id ? "default" : "outline"}
                        className={`w-full justify-start h-auto p-4 ${selectedMethod === method.id
                            ? 'bg-purple-600 border-purple-400'
                            : 'bg-gray-700/50 border-gray-600 text-gray-300'
                          }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-blue-500/20 rounded-lg text-purple-300">
                            {method.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-sm mb-1">{method.name}</div>
                            <div className="text-xs opacity-80 mb-2">{method.description}</div>
                            <code className="text-xs bg-black/30 px-2 py-1 rounded block">
                              {method.example}
                            </code>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className={`text-xs ${getComplexityColor(method.complexity)} bg-gray-700`}>
                                {method.complexity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Spellbook */}
            <Card className="bg-white border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Current Spellbook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="min-h-[120px] bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {spellBook.map((spell, index) => (
                        <motion.div
                          key={`${spell}-${index}`}
                          className="px-3 py-2 bg-blue-600/20 border border-blue-400 rounded-lg text-blue-600"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {Array.isArray(spell) ? `[${spell.join(', ')}]` : spell}
                        </motion.div>
                      ))}
                      {spellBook.length === 0 && (
                        <div className="text-gray-400 italic">Empty spellbook - void magic has consumed all spells</div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={executeMethod}
                      disabled={isAnimating}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isAnimating ? (
                        <Timer className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 mr-1" />
                      )}
                      Cast Method
                    </Button>
                    <Button
                      onClick={resetSpellBook}
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>

                  {selectedMethod && (
                    <div className="text-sm text-purple-600 bg-blue-500/20 p-3 rounded-lg">
                      <strong>Selected Method:</strong> {listMethods.find(m => m.id === selectedMethod)?.name}
                      <br />
                      <strong>Description:</strong> {listMethods.find(m => m.id === selectedMethod)?.description}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Before/After Comparison */}
          <AnimatePresence>
            {showBeforeAfter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                      <Copy className="w-5 h-5 text-green-400" />
                      Transformation Chronicle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Before */}
                      <div>
                        <h4 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          📖 Before Casting
                        </h4>
                        <div className="bg-blue-500/20 border border-red-400 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {beforeState.map((spell, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 bg-red-600/20 border border-red-400 rounded text-red-200"
                              >
                                {spell}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* After */}
                      <div>
                        <h4 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          ✨ After Casting
                        </h4>
                        <div className="bg-blue-500/20 border border-green-400 rounded-lg p-4">
                          <div className="flex flex-wrap gap-2">
                            {spellBook.map((spell, index) => (
                              <motion.div
                                key={index}
                                className="px-3 py-2 bg-green-600/20 border border-green-400 rounded text-green-600"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                {Array.isArray(spell) ? `[${spell.join(', ')}]` : spell}
                              </motion.div>
                            ))}
                            {spellBook.length === 0 && (
                              <div className="text-green-400 italic">Void - all spells banished</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="chains" className="space-y-4">
          {/* Method Chaining */}
          <Card className="bg-white border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Advanced Method Combinations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-500/20 border border-yellow-400 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-semibold mb-3">Pattern Multiplication Magic</h4>
                  <code className="block bg-black/50 p-3 rounded text-green-400 mb-3">
                    pattern = [1, 0] * 5  # Result: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
                  </code>
                  <div className="flex gap-2">
                    {[1, 0, 1, 0, 1, 0, 1, 0, 1, 0].map((num, index) => (
                      <motion.div
                        key={index}
                        className={`w-8 h-8 rounded flex items-center justify-center text-gray-800 font-bold ${num === 1 ? 'bg-white0' : 'bg-gray-600'
                          }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-purple-400 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-3">Enumerate Spell</h4>
                  <code className="block bg-black/50 p-3 rounded text-green-400 mb-3">
                    {'for index, spell in enumerate(["Fire", "Water", "Earth"]):'}
                    <br />
                    {'    print(f"Spell {index}: {spell}")'}
                  </code>
                  <div className="space-y-2">
                    {["Fire", "Water", "Earth"].map((spell, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 bg-purple-600/20 p-2 rounded"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <div className="w-8 h-8 bg-white0 rounded-full flex items-center justify-center text-gray-800 font-bold">
                          {index}
                        </div>
                        <div className="text-purple-600">Spell {index}: {spell}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Analysis */}
          <Card className="bg-white border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <MemoryStick className="w-5 h-5 text-orange-400" />
                Performance Crystal Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Time Complexity */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Time Complexity
                  </h4>
                  <div className="space-y-3">
                    {listMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-purple-300">{method.icon}</div>
                          <span className="text-gray-800">{method.name}</span>
                        </div>
                        <Badge className={`${getComplexityColor(method.complexity)} bg-gray-800 border-0`}>
                          {method.complexity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Memory Usage */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                    <MemoryStick className="w-4 h-4" />
                    Memory Considerations
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-blue-500/20 border border-green-400 p-3 rounded-lg">
                      <div className="text-green-300 font-semibold mb-1">Efficient</div>
                      <div className="text-green-600 text-sm">append(), clear(), extend()</div>
                    </div>
                    <div className="bg-blue-500/20 border border-yellow-400 p-3 rounded-lg">
                      <div className="text-yellow-300 font-semibold mb-1">Moderate</div>
                      <div className="text-yellow-600 text-sm">copy(), sort()</div>
                    </div>
                    <div className="bg-orange-500/20 border border-orange-400 p-3 rounded-lg">
                      <div className="text-orange-300 font-semibold mb-1">Memory Tips</div>
                      <div className="text-orange-200 text-sm">Use generators for large datasets</div>
                    </div>
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
          <BookOpen className="w-5 h-5 mr-2" />
          Master the Ancient Methods
        </Button>
      </div>
    </div>
  );
}


