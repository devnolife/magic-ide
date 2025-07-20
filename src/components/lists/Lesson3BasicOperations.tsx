"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Plus,
  Minus,
  ArrowRight,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonProps {
  onComplete?: () => void;
}

interface ListItem {
  id: number;
  value: string;
  color: string;
  isNew?: boolean;
  isRemoving?: boolean;
}

interface Operation {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  syntax: string;
  example: string;
}

const operations: Operation[] = [
  {
    name: 'append()',
    description: 'Menambah item di akhir list',
    icon: <Plus className="w-4 h-4" />,
    color: 'from-green-400 to-green-600',
    syntax: 'list.append(item)',
    example: 'fruits.append("mangga")'
  },
  {
    name: 'insert()',
    description: 'Menambah item di posisi tertentu',
    icon: <ArrowRight className="w-4 h-4" />,
    color: 'from-blue-400 to-blue-600',
    syntax: 'list.insert(index, item)',
    example: 'fruits.insert(0, "apel")'
  },
  {
    name: 'remove()',
    description: 'Menghapus item berdasarkan nilai',
    icon: <Minus className="w-4 h-4" />,
    color: 'from-red-400 to-red-600',
    syntax: 'list.remove(item)',
    example: 'fruits.remove("pisang")'
  },
  {
    name: 'pop()',
    description: 'Menghapus dan mengambil item',
    icon: <Trash2 className="w-4 h-4" />,
    color: 'from-purple-400 to-purple-600',
    syntax: 'item = list.pop(index)',
    example: 'last_fruit = fruits.pop()'
  }
];

const sampleItems = [
  { value: "apel", color: "from-red-400 to-red-600" },
  { value: "pisang", color: "from-yellow-400 to-yellow-600" },
  { value: "jeruk", color: "from-orange-400 to-orange-600" },
  { value: "anggur", color: "from-purple-400 to-purple-600" },
  { value: "mangga", color: "from-green-400 to-green-600" }
];

export function Lesson3BasicOperations({ onComplete }: LessonProps) {
  const [currentOperation, setCurrentOperation] = useState<string | null>(null);
  const [listItems, setListItems] = useState<ListItem[]>([
    { id: 1, value: "pisang", color: "from-yellow-400 to-yellow-600" },
    { id: 2, value: "jeruk", color: "from-orange-400 to-orange-600" },
    { id: 3, value: "anggur", color: "from-purple-400 to-purple-600" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [insertIndex, setInsertIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [completedOperations, setCompletedOperations] = useState<Set<string>>(new Set());
  const [poppedItem, setPoppedItem] = useState<string | null>(null);

  const resetList = () => {
    setListItems([
      { id: 1, value: "pisang", color: "from-yellow-400 to-yellow-600" },
      { id: 2, value: "jeruk", color: "from-orange-400 to-orange-600" },
      { id: 3, value: "anggur", color: "from-purple-400 to-purple-600" }
    ]);
    setOperationHistory([]);
    setPoppedItem(null);
  };

  const addToHistory = (operation: string) => {
    setOperationHistory(prev => [...prev, operation]);
  };

  const handleAppend = () => {
    if (!inputValue.trim()) {
      toast.error('Masukkan nilai yang akan ditambahkan!');
      return;
    }

    setIsAnimating(true);
    const newItem: ListItem = {
      id: Date.now(),
      value: inputValue.trim(),
      color: sampleItems.find(item => item.value === inputValue.trim())?.color || "from-gray-400 to-gray-600",
      isNew: true
    };

    setTimeout(() => {
      setListItems(prev => [...prev, newItem]);
      addToHistory(`my_list.append("${inputValue.trim()}")`);
      setCompletedOperations(prev => new Set([...prev, 'append']));
      setInputValue('');
      setIsAnimating(false);
      toast.success(`"${inputValue.trim()}" ditambahkan ke akhir list!`);
    }, 500);
  };

  const handleInsert = () => {
    if (!inputValue.trim()) {
      toast.error('Masukkan nilai yang akan disisipkan!');
      return;
    }

    if (insertIndex < 0 || insertIndex > listItems.length) {
      toast.error('Index tidak valid!');
      return;
    }

    setIsAnimating(true);
    const newItem: ListItem = {
      id: Date.now(),
      value: inputValue.trim(),
      color: sampleItems.find(item => item.value === inputValue.trim())?.color || "from-gray-400 to-gray-600",
      isNew: true
    };

    setTimeout(() => {
      setListItems(prev => {
        const newList = [...prev];
        newList.splice(insertIndex, 0, newItem);
        return newList;
      });
      addToHistory(`my_list.insert(${insertIndex}, "${inputValue.trim()}")`);
      setCompletedOperations(prev => new Set([...prev, 'insert']));
      setInputValue('');
      setIsAnimating(false);
      toast.success(`"${inputValue.trim()}" disisipkan di index ${insertIndex}!`);
    }, 500);
  };

  const handleRemove = () => {
    if (!inputValue.trim()) {
      toast.error('Masukkan nilai yang akan dihapus!');
      return;
    }

    const itemIndex = listItems.findIndex(item => item.value === inputValue.trim());
    if (itemIndex === -1) {
      toast.error(`"${inputValue.trim()}" tidak ditemukan dalam list!`);
      return;
    }

    setIsAnimating(true);

    // Mark item as removing
    setListItems(prev => prev.map((item, index) =>
      index === itemIndex ? { ...item, isRemoving: true } : item
    ));

    setTimeout(() => {
      setListItems(prev => prev.filter(item => item.value !== inputValue.trim()));
      addToHistory(`my_list.remove("${inputValue.trim()}")`);
      setCompletedOperations(prev => new Set([...prev, 'remove']));
      setInputValue('');
      setIsAnimating(false);
      toast.success(`"${inputValue.trim()}" berhasil dihapus!`);
    }, 800);
  };

  const handlePop = (index?: number) => {
    if (listItems.length === 0) {
      toast.error('List kosong, tidak ada item untuk di-pop!');
      return;
    }

    const popIndex = index !== undefined ? index : listItems.length - 1;
    if (popIndex < 0 || popIndex >= listItems.length) {
      toast.error('Index tidak valid!');
      return;
    }

    setIsAnimating(true);
    const itemToPop = listItems[popIndex];

    // Mark item as removing
    setListItems(prev => prev.map((item, idx) =>
      idx === popIndex ? { ...item, isRemoving: true } : item
    ));

    setTimeout(() => {
      setListItems(prev => prev.filter((_, idx) => idx !== popIndex));
      setPoppedItem(itemToPop.value);
      const operation = index !== undefined
        ? `popped_item = my_list.pop(${index})`
        : `popped_item = my_list.pop()`;
      addToHistory(operation);
      setCompletedOperations(prev => new Set([...prev, 'pop']));
      setIsAnimating(false);
      toast.success(`"${itemToPop.value}" berhasil di-pop!`);
    }, 800);
  };

  const isCompleted = completedOperations.size === 4;

  useEffect(() => {
    if (isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-2xl mb-4"
        >
          ⚡
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">List Manipulation Laboratory</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Eksperimen dengan operasi dasar list: append, insert, remove, dan pop!
        </p>
      </div>

      {/* Progress */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
          <span className="text-sm font-medium text-gray-600">Progress:</span>
          {operations.map((op) => (
            <div key={op.name} className="flex items-center space-x-1">
              {completedOperations.has(op.name.replace('()', '')) ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              )}
              <span className="text-xs">{op.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Operations Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Pilih Operasi</h3>
          {operations.map((operation) => (
            <motion.div
              key={operation.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all ${currentOperation === operation.name
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                  }`}
                onClick={() => setCurrentOperation(operation.name)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${operation.color} text-white`}>
                    {operation.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{operation.name}</h4>
                      {completedOperations.has(operation.name.replace('()', '')) && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{operation.description}</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                      {operation.syntax}
                    </code>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* List Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">List Visualization</h3>
            <Button variant="outline" onClick={resetList} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <Card className="p-6">
            <div className="mb-4">
              <code className="text-sm bg-gray-900 text-green-400 p-2 rounded block">
                my_list = [{listItems.map(item => `"${item.value}"`).join(', ')}]
              </code>
            </div>

            <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="text-sm text-gray-600 mb-2">List Items:</div>
              <div className="space-y-2">
                <AnimatePresence>
                  {listItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: item.isNew ? 0 : 1,
                        x: item.isNew ? 50 : 0,
                        scale: item.isNew ? 0.8 : 1
                      }}
                      animate={{
                        opacity: item.isRemoving ? 0 : 1,
                        x: item.isRemoving ? -50 : 0,
                        scale: item.isRemoving ? 0.8 : 1
                      }}
                      exit={{ opacity: 0, x: -50, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r ${item.color} text-white`}
                      onClick={() => currentOperation === 'pop()' && handlePop(index)}
                      style={{ cursor: currentOperation === 'pop()' ? 'pointer' : 'default' }}
                    >
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        [{index}]
                      </Badge>
                      <span className="font-medium">{item.value}</span>
                      {currentOperation === 'pop()' && (
                        <div className="ml-auto text-xs opacity-75">
                          ← Click to pop
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {listItems.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    List kosong
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Popped Item Display */}
          {poppedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4 text-purple-600" />
                <span className="text-purple-800 font-medium">
                  Popped item: "{poppedItem}"
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Control Panel</h3>

          {currentOperation && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                {operations.find(op => op.name === currentOperation)?.icon}
                <span className="ml-2">{currentOperation}</span>
              </h4>

              <div className="space-y-3">
                {currentOperation === 'append()' && (
                  <>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nilai yang akan ditambahkan"
                      onKeyPress={(e) => e.key === 'Enter' && handleAppend()}
                    />
                    <Button
                      onClick={handleAppend}
                      disabled={isAnimating}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Append Item
                    </Button>
                  </>
                )}

                {currentOperation === 'insert()' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={insertIndex}
                        onChange={(e) => setInsertIndex(Number(e.target.value))}
                        placeholder="Index"
                        min="0"
                        max={listItems.length}
                      />
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nilai"
                        onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                      />
                    </div>
                    <Button
                      onClick={handleInsert}
                      disabled={isAnimating}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Insert Item
                    </Button>
                  </>
                )}

                {currentOperation === 'remove()' && (
                  <>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nilai yang akan dihapus"
                      onKeyPress={(e) => e.key === 'Enter' && handleRemove()}
                    />
                    <Button
                      onClick={handleRemove}
                      disabled={isAnimating}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Remove Item
                    </Button>
                  </>
                )}

                {currentOperation === 'pop()' && (
                  <>
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Klik item di list untuk pop, atau gunakan tombol untuk pop terakhir
                    </div>
                    <Button
                      onClick={() => handlePop()}
                      disabled={isAnimating || listItems.length === 0}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Pop Last Item
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                <strong>Contoh:</strong><br />
                <code>{operations.find(op => op.name === currentOperation)?.example}</code>
              </div>
            </Card>
          )}

          {!currentOperation && (
            <Card className="p-4">
              <div className="text-center text-gray-500">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p>Pilih operasi untuk memulai eksperimen!</p>
              </div>
            </Card>
          )}

          {/* Operation History */}
          {operationHistory.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Operation History</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {operationHistory.map((operation, index) => (
                  <div key={index} className="text-xs bg-gray-900 text-green-400 p-2 rounded font-mono">
                    {operation}
                  </div>
                ))}
              </div>
            </Card>
          )}
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
            Pelajaran 3 Selesai! 🎉
          </h3>
          <p className="text-gray-600">
            Anda telah menguasai semua operasi dasar list Python! Mari lanjut ke indexing dan slicing.
          </p>
        </motion.div>
      )}
    </div>
  );
}
