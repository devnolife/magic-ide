"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Target,
  Eye,
  Scissors,
  ArrowRight,
  CheckCircle2,
  Play,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonProps {
  onComplete?: () => void;
}

interface ListItem {
  id: number;
  value: string;
  color: string;
  index: number;
}

const sampleList: ListItem[] = [
  { id: 0, value: "python", color: "from-blue-400 to-blue-600", index: 0 },
  { id: 1, value: "java", color: "from-red-400 to-red-600", index: 1 },
  { id: 2, value: "javascript", color: "from-yellow-400 to-yellow-600", index: 2 },
  { id: 3, value: "go", color: "from-green-400 to-green-600", index: 3 },
  { id: 4, value: "rust", color: "from-orange-400 to-orange-600", index: 4 },
  { id: 5, value: "swift", color: "from-purple-400 to-purple-600", index: 5 }
];

export function Lesson4IndexingSlicing({ onComplete }: LessonProps) {
  const [currentMode, setCurrentMode] = useState<'indexing' | 'slicing'>('indexing');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showNegativeIndex, setShowNegativeIndex] = useState(false);
  const [sliceStart, setSliceStart] = useState([0]);
  const [sliceEnd, setSliceEnd] = useState([3]);
  const [sliceStep, setSliceStep] = useState([1]);
  const [slicedResult, setSlicedResult] = useState<ListItem[]>([]);
  const [indexingTried, setIndexingTried] = useState(false);
  const [slicingTried, setSlicingTried] = useState(false);
  const [negativeIndexTried, setNegativeIndexTried] = useState(false);
  const [stepSlicingTried, setStepSlicingTried] = useState(false);

  const isCompleted = indexingTried && slicingTried && negativeIndexTried && stepSlicingTried;

  useEffect(() => {
    if (currentMode === 'slicing') {
      updateSliceResult();
    }
  }, [sliceStart, sliceEnd, sliceStep, currentMode]);

  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  const updateSliceResult = () => {
    const start = sliceStart[0];
    const end = sliceEnd[0];
    const step = sliceStep[0];

    const result: ListItem[] = [];
    for (let i = start; i < Math.min(end, sampleList.length); i += step) {
      if (i >= 0 && i < sampleList.length) {
        result.push(sampleList[i]);
      }
    }
    setSlicedResult(result);
  };

  const handleIndexClick = (index: number) => {
    setSelectedIndex(index);
    setIndexingTried(true);
    if (index < 0) {
      setNegativeIndexTried(true);
    }
    toast.success(`Index ${index}: "${sampleList[index >= 0 ? index : sampleList.length + index]?.value}"`);
  };

  const executeSlicing = () => {
    setSlicingTried(true);
    if (sliceStep[0] !== 1) {
      setStepSlicingTried(true);
    }
    updateSliceResult();
    toast.success(`Slicing berhasil! Hasil: [${sliceStart[0]}:${sliceEnd[0]}:${sliceStep[0]}]`);
  };

  const getSlicingCode = () => {
    const start = sliceStart[0];
    const end = sliceEnd[0];
    const step = sliceStep[0];

    if (step === 1) {
      return `languages[${start}:${end}]`;
    }
    return `languages[${start}:${end}:${step}]`;
  };

  const getItemAtIndex = (index: number) => {
    if (index >= 0) {
      return sampleList[index];
    } else {
      return sampleList[sampleList.length + index];
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl mb-4"
        >
          🎯
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">List Address System</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pahami sistem alamat list dengan indexing dan operasi slicing yang powerful!
        </p>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
          <span className="text-sm font-medium text-gray-600">Progress:</span>
          <div className="flex items-center space-x-1">
            {indexingTried ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-xs">Indexing</span>
          </div>
          <div className="flex items-center space-x-1">
            {negativeIndexTried ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-xs">Negative Index</span>
          </div>
          <div className="flex items-center space-x-1">
            {slicingTried ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-xs">Slicing</span>
          </div>
          <div className="flex items-center space-x-1">
            {stepSlicingTried ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-xs">Step Slicing</span>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <Button
            variant={currentMode === 'indexing' ? 'default' : 'ghost'}
            onClick={() => setCurrentMode('indexing')}
            className="flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>Indexing</span>
          </Button>
          <Button
            variant={currentMode === 'slicing' ? 'default' : 'ghost'}
            onClick={() => setCurrentMode('slicing')}
            className="flex items-center space-x-2"
          >
            <Scissors className="w-4 h-4" />
            <span>Slicing</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* List Visualization */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Programming Languages</h3>
            <div className="text-sm text-gray-500">
              Length: {sampleList.length}
            </div>
          </div>

          <div className="mb-4">
            <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
              languages = [{sampleList.map(item => `"${item.value}"`).join(', ')}]
            </code>
          </div>

          {/* Positive Index Labels */}
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">Positive Index:</div>
            <div className="grid grid-cols-6 gap-2">
              {sampleList.map((_, index) => (
                <div
                  key={`pos-${index}`}
                  className={`text-center py-1 px-2 rounded text-xs font-semibold cursor-pointer transition-all ${selectedIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  onClick={() => handleIndexClick(index)}
                >
                  [{index}]
                </div>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            {sampleList.map((item, index) => (
              <motion.div
                key={item.id}
                className={`p-3 rounded-lg bg-gradient-to-r ${item.color} text-white text-center cursor-pointer transition-all ${selectedIndex === index ? 'ring-4 ring-blue-300 scale-105' : ''
                  } ${currentMode === 'slicing' &&
                    index >= sliceStart[0] &&
                    index < sliceEnd[0] &&
                    (index - sliceStart[0]) % sliceStep[0] === 0
                    ? 'ring-4 ring-yellow-300 scale-105'
                    : ''
                  }`}
                onClick={() => currentMode === 'indexing' && handleIndexClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-xs font-bold mb-1">{item.value}</div>
                <div className="text-xs opacity-75">len: {item.value.length}</div>
              </motion.div>
            ))}
          </div>

          {/* Negative Index Labels */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Negative Index:</div>
            <div className="grid grid-cols-6 gap-2">
              {sampleList.map((_, index) => {
                const negIndex = index - sampleList.length;
                return (
                  <div
                    key={`neg-${index}`}
                    className={`text-center py-1 px-2 rounded text-xs font-semibold cursor-pointer transition-all ${selectedIndex === negIndex
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    onClick={() => handleIndexClick(negIndex)}
                  >
                    [{negIndex}]
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Info */}
          {selectedIndex !== null && currentMode === 'indexing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  languages[{selectedIndex}] = "{getItemAtIndex(selectedIndex)?.value}"
                </span>
              </div>
              {selectedIndex < 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  Negative index: counting from the end
                </div>
              )}
            </motion.div>
          )}
        </Card>

        {/* Control Panel */}
        <div className="space-y-4">
          {currentMode === 'indexing' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Index Explorer
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How Indexing Works:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Python starts counting from 0</li>
                    <li>• Positive index: 0, 1, 2, 3, ...</li>
                    <li>• Negative index: -1, -2, -3, ... (from end)</li>
                    <li>• Click any index number to select item</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">First Item</div>
                    <Button
                      onClick={() => handleIndexClick(0)}
                      variant="outline"
                      className="w-full"
                    >
                      languages[0]
                    </Button>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">Last Item</div>
                    <Button
                      onClick={() => handleIndexClick(-1)}
                      variant="outline"
                      className="w-full"
                    >
                      languages[-1]
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>💡 Pro Tip:</strong> Use negative indexing to access items from the end without knowing the list length!
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentMode === 'slicing' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Scissors className="w-5 h-5 mr-2" />
                Slice Controller
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Index: {sliceStart[0]}
                  </label>
                  <Slider
                    value={sliceStart}
                    onValueChange={setSliceStart}
                    min={0}
                    max={sampleList.length - 1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    End Index: {sliceEnd[0]}
                  </label>
                  <Slider
                    value={sliceEnd}
                    onValueChange={setSliceEnd}
                    min={sliceStart[0] + 1}
                    max={sampleList.length}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Step: {sliceStep[0]}
                  </label>
                  <Slider
                    value={sliceStep}
                    onValueChange={setSliceStep}
                    min={1}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  result = {getSlicingCode()}
                </div>

                <Button onClick={executeSlicing} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Execute Slicing
                </Button>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Slicing Syntax:</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><code>list[start:end]</code> - from start to end-1</div>
                    <div><code>list[start:end:step]</code> - with step interval</div>
                    <div><code>list[:3]</code> - from beginning to index 2</div>
                    <div><code>list[2:]</code> - from index 2 to end</div>
                    <div><code>list[::2]</code> - every 2nd element</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Slicing Result */}
          {currentMode === 'slicing' && slicedResult.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Slicing Result</h3>
              <div className="space-y-3">
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                  result = [{slicedResult.map(item => `"${item.value}"`).join(', ')}]
                </div>
                <div className="flex flex-wrap gap-2">
                  {slicedResult.map((item, index) => (
                    <motion.div
                      key={`slice-${item.id}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-2 rounded bg-gradient-to-r ${item.color} text-white text-sm font-medium`}
                    >
                      {item.value}
                    </motion.div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Length: {slicedResult.length} items
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Quick Examples</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentMode === 'indexing') {
                    handleIndexClick(0);
                  } else {
                    setSliceStart([0]);
                    setSliceEnd([2]);
                    setSliceStep([1]);
                    executeSlicing();
                  }
                }}
                className="w-full text-sm"
              >
                {currentMode === 'indexing' ? 'First Element [0]' : 'First Two [:2]'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentMode === 'indexing') {
                    handleIndexClick(-1);
                  } else {
                    setSliceStart([0]);
                    setSliceEnd([sampleList.length]);
                    setSliceStep([2]);
                    executeSlicing();
                  }
                }}
                className="w-full text-sm"
              >
                {currentMode === 'indexing' ? 'Last Element [-1]' : 'Every 2nd [::2]'}
              </Button>
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
            Pelajaran 4 Selesai! 🎉
          </h3>
          <p className="text-gray-600">
            Anda telah menguasai indexing dan slicing! Mari lanjut ke advanced list methods.
          </p>
        </motion.div>
      )}
    </div>
  );
}
