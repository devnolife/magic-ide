"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Package,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  Brain,
  Database,
  Shuffle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { VariableBox } from '@/types/challenges';

interface Challenge2Props {
  onComplete: (success: boolean, score: number) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface WarehouseItem {
  id: string;
  value: any;
  type: string;
  description: string;
  icon: string;
}

const warehouseScenarios = {
  beginner: {
    title: 'Gudang Informasi Pribadi',
    description: 'Simpan informasi dasar tentang diri Anda',
    items: [
      { id: 'name', value: 'Andi Pratama', type: 'string', description: 'Nama lengkap', icon: '👤' },
      { id: 'age', value: 25, type: 'number', description: 'Umur dalam tahun', icon: '🎂' },
      { id: 'city', value: 'Jakarta', type: 'string', description: 'Kota asal', icon: '🏙️' },
      { id: 'student', value: true, type: 'boolean', description: 'Status mahasiswa', icon: '🎓' },
      { id: 'score', value: 85.5, type: 'number', description: 'Nilai rata-rata', icon: '📊' }
    ],
    boxes: [
      { id: 'var_name', name: 'nama_lengkap', value: null, type: 'string', locked: false },
      { id: 'var_age', name: 'umur', value: null, type: 'number', locked: false },
      { id: 'var_city', name: 'kota_asal', value: null, type: 'string', locked: false },
      { id: 'var_student', name: 'status_mahasiswa', value: null, type: 'boolean', locked: false },
      { id: 'var_score', name: 'nilai_rata_rata', value: null, type: 'number', locked: false }
    ]
  },
  intermediate: {
    title: 'Pertukaran Variabel',
    description: 'Tukar nilai antar variabel dan kelola memori dengan efisien',
    items: [
      { id: 'temp1', value: 'Apel', type: 'string', description: 'Buah A', icon: '🍎' },
      { id: 'temp2', value: 'Pisang', type: 'string', description: 'Buah B', icon: '🍌' },
      { id: 'temp3', value: 100, type: 'number', description: 'Skor A', icon: '💯' },
      { id: 'temp4', value: 200, type: 'number', description: 'Skor B', icon: '📈' },
      { id: 'temp5', value: true, type: 'boolean', description: 'Status A', icon: '✅' },
      { id: 'temp6', value: false, type: 'boolean', description: 'Status B', icon: '❌' }
    ],
    boxes: [
      { id: 'box_a', name: 'variabel_a', value: 'Apel', type: 'string', locked: true },
      { id: 'box_b', name: 'variabel_b', value: 'Pisang', type: 'string', locked: true },
      { id: 'box_temp', name: 'temp', value: null, type: 'any', locked: false },
      { id: 'box_skor_a', name: 'skor_a', value: 100, type: 'number', locked: true },
      { id: 'box_skor_b', name: 'skor_b', value: 200, type: 'number', locked: true }
    ]
  },
  advanced: {
    title: 'Optimasi Memori Terbatas',
    description: 'Kelola 10 slot memori untuk menyimpan 15 item dengan efisien',
    items: Array.from({ length: 15 }, (_, i) => ({
      id: `item_${i}`,
      value: i % 3 === 0 ? `Text_${i}` : i % 3 === 1 ? i * 10 : i % 2 === 0,
      type: i % 3 === 0 ? 'string' : i % 3 === 1 ? 'number' : 'boolean',
      description: `Item ${i + 1}`,
      icon: i % 3 === 0 ? '📝' : i % 3 === 1 ? '🔢' : '✓'
    })),
    boxes: Array.from({ length: 10 }, (_, i) => ({
      id: `slot_${i}`,
      name: `slot_${i + 1}`,
      value: null,
      type: 'any',
      locked: false
    }))
  }
};

export default function Challenge2VariableMemory({ onComplete, difficulty }: Challenge2Props) {
  const scenario = warehouseScenarios[difficulty];
  const [availableItems, setAvailableItems] = useState<WarehouseItem[]>(scenario.items);
  const [variableBoxes, setVariableBoxes] = useState<VariableBox[]>(scenario.boxes);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [warehouseState, setWarehouseState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [customValues, setCustomValues] = useState<{ [key: string]: string }>({});

  const assignItemToBox = (item: WarehouseItem, boxId: string) => {
    const box = variableBoxes.find(b => b.id === boxId);
    if (!box || box.locked) {
      toast.error('Box ini terkunci atau tidak tersedia!');
      return;
    }

    // Check type compatibility for typed boxes
    if (box.type !== 'any' && box.type !== item.type) {
      toast.error(`Tipe data tidak cocok! Box "${box.name}" hanya menerima tipe ${box.type}`);
      return;
    }

    setVariableBoxes(prev => prev.map(b =>
      b.id === boxId ? { ...b, value: item.value, type: item.type } : b
    ));

    // Remove item from available items for beginner level
    if (difficulty === 'beginner') {
      setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    }

    toast.success(`✅ ${item.description} berhasil disimpan ke ${box.name}`);
    setSelectedItem(null);
  };

  const clearBox = (boxId: string) => {
    const box = variableBoxes.find(b => b.id === boxId);
    if (!box || box.locked) {
      toast.error('Box ini terkunci!');
      return;
    }

    // Return item to available items for beginner level
    if (difficulty === 'beginner' && box.value !== null) {
      const originalItem = scenario.items.find(item => item.value === box.value);
      if (originalItem && !availableItems.find(item => item.id === originalItem.id)) {
        setAvailableItems(prev => [...prev, originalItem]);
      }
    }

    setVariableBoxes(prev => prev.map(b =>
      b.id === boxId ? { ...b, value: null, type: box.type === 'any' ? 'any' : box.type } : b
    ));
  };

  const swapBoxValues = (boxId1: string, boxId2: string) => {
    const box1 = variableBoxes.find(b => b.id === boxId1);
    const box2 = variableBoxes.find(b => b.id === boxId2);

    if (!box1 || !box2 || box1.locked || box2.locked) {
      toast.error('Salah satu box terkunci!');
      return;
    }

    setVariableBoxes(prev => prev.map(b => {
      if (b.id === boxId1) return { ...b, value: box2.value, type: box2.type };
      if (b.id === boxId2) return { ...b, value: box1.value, type: box1.type };
      return b;
    }));

    toast.success('🔄 Nilai berhasil ditukar!');
  };

  const addCustomValue = (boxId: string) => {
    const customValue = customValues[boxId];
    if (!customValue) return;

    const box = variableBoxes.find(b => b.id === boxId);
    if (!box || box.locked) return;

    // Try to parse the value
    let parsedValue: any = customValue;
    let valueType = 'string';

    if (customValue === 'true' || customValue === 'false') {
      parsedValue = customValue === 'true';
      valueType = 'boolean';
    } else if (!isNaN(Number(customValue)) && customValue.trim() !== '') {
      parsedValue = Number(customValue);
      valueType = 'number';
    }

    // Check type compatibility
    if (box.type !== 'any' && box.type !== valueType) {
      toast.error(`Tipe data tidak cocok! Box "${box.name}" hanya menerima tipe ${box.type}`);
      return;
    }

    setVariableBoxes(prev => prev.map(b =>
      b.id === boxId ? { ...b, value: parsedValue, type: valueType } : b
    ));

    setCustomValues(prev => ({ ...prev, [boxId]: '' }));
    toast.success(`✅ Nilai kustom berhasil disimpan ke ${box.name}`);
  };

  const checkCompletion = () => {
    setAttempts(prev => prev + 1);
    setWarehouseState('processing');

    setTimeout(() => {
      let isSuccess = false;
      let message = '';

      switch (difficulty) {
        case 'beginner':
          // Check if all items are correctly assigned
          isSuccess = availableItems.length === 0 &&
            variableBoxes.every(box => box.value !== null);
          message = isSuccess ?
            'Semua informasi berhasil disimpan dengan benar!' :
            'Masih ada informasi yang belum disimpan atau salah tempat.';
          break;

        case 'intermediate':
          // Check if values are swapped correctly
          const aBox = variableBoxes.find(b => b.name === 'variabel_a');
          const bBox = variableBoxes.find(b => b.name === 'variabel_b');
          const skorABox = variableBoxes.find(b => b.name === 'skor_a');
          const skorBBox = variableBoxes.find(b => b.name === 'skor_b');

          isSuccess = aBox?.value === 'Pisang' && bBox?.value === 'Apel' &&
            skorABox?.value === 200 && skorBBox?.value === 100;
          message = isSuccess ?
            'Pertukaran variabel berhasil!' :
            'Nilai belum ditukar dengan benar. Periksa kembali.';
          break;

        case 'advanced':
          // Check if at least 80% of items are stored efficiently
          const usedSlots = variableBoxes.filter(box => box.value !== null).length;
          const efficiency = (usedSlots / scenario.items.length) * 100;
          isSuccess = efficiency >= 80;
          message = isSuccess ?
            `Manajemen memori efisien! (${efficiency.toFixed(1)}% efisiensi)` :
            `Efisiensi memori kurang (${efficiency.toFixed(1)}%). Target: 80%`;
          break;
      }

      if (isSuccess) {
        setWarehouseState('success');
        setIsCompleted(true);
        toast.success('🎉 ' + message);

        const baseScore = 100;
        const attemptPenalty = (attempts - 1) * 15;
        const finalScore = Math.max(25, baseScore - attemptPenalty);

        onComplete(true, finalScore);
      } else {
        setWarehouseState('error');
        toast.error(message);
      }
    }, 1500);
  };

  const resetChallenge = () => {
    setAvailableItems(scenario.items);
    setVariableBoxes(scenario.boxes);
    setAttempts(0);
    setIsCompleted(false);
    setWarehouseState('idle');
    setSelectedItem(null);
    setCustomValues({});
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'number': return 'bg-green-100 text-green-800 border-green-200';
      case 'boolean': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'any': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWarehouseAnimation = () => {
    switch (warehouseState) {
      case 'processing':
        return { scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: 3 } };
      case 'success':
        return { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0], transition: { duration: 1 } };
      case 'error':
        return { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={getWarehouseAnimation()}
                className="text-6xl"
              >
                🏢
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {scenario.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">{scenario.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    {variableBoxes.length} slot memori
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {availableItems.length} item tersedia
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Percobaan</div>
              <div className="text-2xl font-bold text-gray-800">{attempts}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Items */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Item yang Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {availableItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-3 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-all ${selectedItem?.id === item.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                      }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                            {item.type}
                          </Badge>
                          <span className="text-sm text-gray-600 font-mono">
                            {typeof item.value === 'string' ? `"${item.value}"` : String(item.value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {availableItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Semua item sudah digunakan!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Variable Boxes */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Slot Memori Variabel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {variableBoxes.map((box) => (
                <motion.div
                  key={box.id}
                  layout
                  className={`p-3 rounded-lg border-2 border-dashed transition-all ${box.locked
                    ? 'border-gray-300 bg-gray-50'
                    : box.value !== null
                      ? 'border-green-400 bg-green-50'
                      : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-800">
                        {box.name}
                      </span>
                      <Badge className={`text-xs ${getTypeColor(box.type)}`}>
                        {box.type}
                      </Badge>
                      {box.locked && <Badge variant="destructive" className="text-xs">🔒</Badge>}
                    </div>
                    {!box.locked && box.value !== null && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => clearBox(box.id)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  {box.value !== null ? (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="font-mono text-sm">
                        {typeof box.value === 'string' ? `"${box.value}"` : String(box.value)}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedItem && !box.locked && (
                        <Button
                          size="sm"
                          onClick={() => assignItemToBox(selectedItem, box.id)}
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          Simpan "{selectedItem.description}"
                        </Button>
                      )}

                      {!box.locked && (
                        <div className="flex gap-1">
                          <Input
                            placeholder="Nilai kustom..."
                            value={customValues[box.id] || ''}
                            onChange={(e) => setCustomValues(prev => ({
                              ...prev,
                              [box.id]: e.target.value
                            }))}
                            className="text-sm h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() => addCustomValue(box.id)}
                            disabled={!customValues[box.id]}
                            className="h-8 px-2"
                          >
                            +
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Swap Controls for Intermediate */}
            {difficulty === 'intermediate' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Operasi Tukar
                </h4>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    onClick={() => swapBoxValues('box_a', 'box_b')}
                    className="w-full"
                    variant="outline"
                  >
                    Tukar variabel_a ↔ variabel_b
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => swapBoxValues('box_skor_a', 'box_skor_b')}
                    className="w-full"
                    variant="outline"
                  >
                    Tukar skor_a ↔ skor_b
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={resetChallenge}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Gudang
        </Button>

        <Button
          onClick={checkCompletion}
          disabled={isCompleted || warehouseState === 'processing'}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          <PlayCircle className="w-4 h-4" />
          {warehouseState === 'processing' ? 'Memeriksa...' : 'Periksa Hasil'}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Luar Biasa! Gudang memori terkelola dengan baik!
                </h3>
                <p className="text-gray-600">
                  Anda telah memahami konsep variabel dan manajemen memori!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
