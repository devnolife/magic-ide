"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Palette,
  Ruler,
  ArrowUpDown,
  RotateCcw,
  Search,
  Hash,
  Play,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonProps {
  onComplete?: () => void;
}

interface ListItem {
  id: number;
  value: string | number;
  color: string;
  originalIndex?: number;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isFound?: boolean;
}

interface Method {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  syntax: string;
  returnType: string;
}

const methods: Method[] = [
  {
    name: 'len()',
    description: 'Menghitung panjang list',
    icon: <Ruler className="w-4 h-4" />,
    color: 'from-blue-400 to-blue-600',
    syntax: 'len(list)',
    returnType: 'int'
  },
  {
    name: 'sort()',
    description: 'Mengurutkan list',
    icon: <ArrowUpDown className="w-4 h-4" />,
    color: 'from-green-400 to-green-600',
    syntax: 'list.sort()',
    returnType: 'None'
  },
  {
    name: 'reverse()',
    description: 'Membalik urutan list',
    icon: <RotateCcw className="w-4 h-4" />,
    color: 'from-purple-400 to-purple-600',
    syntax: 'list.reverse()',
    returnType: 'None'
  },
  {
    name: 'count()',
    description: 'Menghitung kemunculan item',
    icon: <Hash className="w-4 h-4" />,
    color: 'from-orange-400 to-orange-600',
    syntax: 'list.count(item)',
    returnType: 'int'
  },
  {
    name: 'index()',
    description: 'Mencari posisi item',
    icon: <Search className="w-4 h-4" />,
    color: 'from-red-400 to-red-600',
    syntax: 'list.index(item)',
    returnType: 'int'
  }
];

const sampleData = {
  numbers: [64, 34, 25, 12, 22, 11, 90, 34, 22],
  strings: ["python", "java", "go", "rust", "swift", "java", "kotlin"],
  mixed: ["apple", 42, "banana", 17, "cherry", 42, "date"]
};

export function Lesson5Methods({ onComplete }: LessonProps) {
  const [currentMethod, setCurrentMethod] = useState<string | null>(null);
  const [currentDataset, setCurrentDataset] = useState<'numbers' | 'strings' | 'mixed'>('numbers');
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [methodResult, setMethodResult] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedMethods, setCompletedMethods] = useState<Set<string>>(new Set());
  const [operationHistory, setOperationHistory] = useState<string[]>([]);

  const isCompleted = completedMethods.size === methods.length;

  useEffect(() => {
    loadDataset();
  }, [currentDataset]);

  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  const loadDataset = () => {
    const data = sampleData[currentDataset];
    const items = data.map((value, index) => ({
      id: index,
      value,
      color: getColorForValue(value),
      originalIndex: index
    }));
    setListItems(items);
    setMethodResult(null);
  };

  const getColorForValue = (value: any): string => {
    if (typeof value === 'number') {
      return 'from-blue-400 to-blue-600';
    } else if (typeof value === 'string') {
      const colors = [
        'from-green-400 to-green-600',
        'from-purple-400 to-purple-600',
        'from-red-400 to-red-600',
        'from-yellow-400 to-yellow-600',
        'from-indigo-400 to-indigo-600'
      ];
      return colors[value.length % colors.length];
    }
    return 'from-gray-400 to-gray-600';
  };

  const executeMethod = async (methodName: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentMethod(methodName);

    switch (methodName) {
      case 'len()':
        await executeLenMethod();
        break;
      case 'sort()':
        await executeSortMethod();
        break;
      case 'reverse()':
        await executeReverseMethod();
        break;
      case 'count()':
        await executeCountMethod();
        break;
      case 'index()':
        await executeIndexMethod();
        break;
    }

    setCompletedMethods(prev => new Set([...prev, methodName]));
    setIsAnimating(false);
  };

  const executeLenMethod = async () => {
    // Measuring tape animation
    const length = listItems.length;
    setMethodResult(length);
    setOperationHistory(prev => [...prev, `len(my_list) # Returns: ${length}`]);
    toast.success(`List length: ${length}`);
  };

  const executeSortMethod = async () => {
    if (currentDataset === 'mixed') {
      toast.error('Cannot sort mixed data types!');
      setIsAnimating(false);
      return;
    }

    // Shuffle animation then sort
    const sorted = [...listItems].sort((a, b) => {
      if (typeof a.value === 'number' && typeof b.value === 'number') {
        return a.value - b.value;
      }
      return String(a.value).localeCompare(String(b.value));
    });

    // Animate sorting process
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setListItems(prev => [...prev].sort(() => Math.random() - 0.5));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setListItems(sorted);
    setMethodResult('Sorted!');
    setOperationHistory(prev => [...prev, `my_list.sort() # List sorted in place`]);
    toast.success('List sorted successfully!');
  };

  const executeReverseMethod = async () => {
    // Flip animation
    const reversed = [...listItems].reverse();

    await new Promise(resolve => setTimeout(resolve, 500));
    setListItems(reversed);
    setMethodResult('Reversed!');
    setOperationHistory(prev => [...prev, `my_list.reverse() # List reversed in place`]);
    toast.success('List reversed successfully!');
  };

  const executeCountMethod = async () => {
    if (!searchValue.trim()) {
      toast.error('Enter a value to count!');
      return;
    }

    // Search beam animation
    let count = 0;
    const searchVal = isNaN(Number(searchValue)) ? searchValue : Number(searchValue);

    for (let i = 0; i < listItems.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));

      // Highlight current item being checked
      setListItems(prev => prev.map((item, index) => ({
        ...item,
        isHighlighted: index === i
      })));

      if (listItems[i].value === searchVal) {
        count++;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setListItems(prev => prev.map(item => ({ ...item, isHighlighted: false })));
    setMethodResult(count);
    setOperationHistory(prev => [...prev, `my_list.count(${JSON.stringify(searchVal)}) # Returns: ${count}`]);
    toast.success(`"${searchVal}" appears ${count} times`);
  };

  const executeIndexMethod = async () => {
    if (!searchValue.trim()) {
      toast.error('Enter a value to find!');
      return;
    }

    const searchVal = isNaN(Number(searchValue)) ? searchValue : Number(searchValue);
    const index = listItems.findIndex(item => item.value === searchVal);

    if (index === -1) {
      toast.error(`"${searchVal}" not found in list!`);
      setMethodResult('Not Found');
      return;
    }

    // Search beam animation
    for (let i = 0; i <= index; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setListItems(prev => prev.map((item, idx) => ({
        ...item,
        isSearching: idx === i,
        isFound: idx === index && i === index
      })));
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setListItems(prev => prev.map(item => ({
      ...item,
      isSearching: false,
      isFound: false
    })));

    setMethodResult(index);
    setOperationHistory(prev => [...prev, `my_list.index(${JSON.stringify(searchVal)}) # Returns: ${index}`]);
    toast.success(`"${searchVal}" found at index ${index}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-2xl mb-4"
        >
          🎨
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">List Methods Toolkit</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore powerful built-in methods untuk manipulasi list yang advanced!
        </p>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
          <span className="text-sm font-medium text-gray-600">Methods Mastered:</span>
          {methods.map((method) => (
            <div key={method.name} className="flex items-center space-x-1">
              {completedMethods.has(method.name) ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              )}
              <span className="text-xs">{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <Button
            variant={currentDataset === 'numbers' ? 'default' : 'ghost'}
            onClick={() => setCurrentDataset('numbers')}
            size="sm"
          >
            Numbers
          </Button>
          <Button
            variant={currentDataset === 'strings' ? 'default' : 'ghost'}
            onClick={() => setCurrentDataset('strings')}
            size="sm"
          >
            Strings
          </Button>
          <Button
            variant={currentDataset === 'mixed' ? 'default' : 'ghost'}
            onClick={() => setCurrentDataset('mixed')}
            size="sm"
          >
            Mixed
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Methods Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Methods</h3>
          {methods.map((method) => (
            <motion.div
              key={method.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all ${currentMethod === method.name
                    ? 'ring-2 ring-purple-500 bg-purple-50'
                    : 'hover:shadow-md'
                  }`}
                onClick={() => !isAnimating && setCurrentMethod(method.name)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color} text-white`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{method.name}</h4>
                      {completedMethods.has(method.name) && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {method.syntax}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        → {method.returnType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* List Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Current List</h3>
            <Button variant="outline" onClick={loadDataset} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <Card className="p-6">
            <div className="mb-4">
              <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                my_list = [{listItems.map(item => JSON.stringify(item.value)).join(', ')}]
              </code>
            </div>

            <div className="min-h-[300px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-sm text-gray-600 mb-2">
                Dataset: {currentDataset} | Length: {listItems.length}
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {listItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: item.isHighlighted || item.isSearching ? 1.05 : 1,
                        boxShadow: item.isFound ? '0 0 20px rgba(34, 197, 94, 0.5)' : 'none'
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r ${item.color} text-white ${item.isHighlighted ? 'ring-4 ring-yellow-300' : ''
                        } ${item.isSearching ? 'ring-4 ring-blue-300' : ''
                        } ${item.isFound ? 'ring-4 ring-green-300' : ''
                        }`}
                    >
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        [{index}]
                      </Badge>
                      <span className="font-medium">{JSON.stringify(item.value)}</span>
                      <div className="ml-auto text-xs opacity-75">
                        {typeof item.value}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Method Result */}
            {methodResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">
                    Result: {JSON.stringify(methodResult)}
                  </span>
                </div>
              </motion.div>
            )}
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Method Control</h3>

          {currentMethod && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                {methods.find(m => m.name === currentMethod)?.icon}
                <span className="ml-2">{currentMethod}</span>
              </h4>

              <div className="space-y-3">
                {(currentMethod === 'count()' || currentMethod === 'index()') && (
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={currentMethod === 'count()' ? 'Value to count' : 'Value to find'}
                    onKeyPress={(e) => e.key === 'Enter' && executeMethod(currentMethod)}
                  />
                )}

                <Button
                  onClick={() => executeMethod(currentMethod)}
                  disabled={isAnimating}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute {currentMethod}
                </Button>
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                <strong>Description:</strong><br />
                {methods.find(m => m.name === currentMethod)?.description}
              </div>
            </Card>
          )}

          {!currentMethod && (
            <Card className="p-4">
              <div className="text-center text-gray-500">
                <Palette className="w-8 h-8 mx-auto mb-2" />
                <p>Select a method to start experimenting!</p>
              </div>
            </Card>
          )}

          {/* Operation History */}
          {operationHistory.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Operation History</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {operationHistory.slice(-5).map((operation, index) => (
                  <div key={index} className="text-xs bg-gray-900 text-green-400 p-2 rounded font-mono">
                    {operation}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Method Tips */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">💡 Pro Tips</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div>• <code>len()</code> works on all sequence types</div>
              <div>• <code>sort()</code> modifies the original list</div>
              <div>• Use <code>sorted()</code> for a new sorted list</div>
              <div>• <code>count()</code> returns 0 if item not found</div>
              <div>• <code>index()</code> raises error if item not found</div>
            </div>
          </Card>
        </div>
      </div>

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Pelajaran 5 Selesai! 🎉
          </h3>
          <p className="text-gray-600">
            Anda telah menguasai semua advanced list methods! Mari explore di Interactive Playground.
          </p>
        </motion.div>
      )}
    </div>
  );
}
