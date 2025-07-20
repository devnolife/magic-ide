"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Lightbulb,
  Trash2,
  CheckCircle,
  Sparkles,
  Database,
  Copy,
  Eye
} from 'lucide-react';

interface LessonProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface Variable {
  id: string;
  name: string;
  value: string;
  type: string;
  createdAt: number;
}

interface FloatingValue {
  id: string;
  value: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export default function Lesson2Variables({ onComplete, isCompleted }: LessonProps) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const [floatingValues, setFloatingValues] = useState<FloatingValue[]>([]);
  const [warehouseCapacity] = useState(6);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);

  const getValueType = (value: string): string => {
    if (value === 'True' || value === 'False') return 'boolean';
    if (value.startsWith('"') && value.endsWith('"')) return 'string';
    if (value.startsWith("'") && value.endsWith("'")) return 'string';
    if (!isNaN(Number(value)) && value.includes('.')) return 'float';
    if (!isNaN(Number(value))) return 'integer';
    return 'string';
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'integer': return 'bg-green-100 text-green-800 border-green-200';
      case 'float': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'boolean': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getValueIcon = (type: string): string => {
    switch (type) {
      case 'string': return '📝';
      case 'integer': return '🔢';
      case 'float': return '💯';
      case 'boolean': return '✅';
      default: return '📦';
    }
  };

  const createVariable = () => {
    if (!newVarName.trim() || !newVarValue.trim()) return;
    if (variables.length >= warehouseCapacity) return;

    // Check if variable name already exists
    if (variables.some(v => v.name === newVarName)) {
      // Update existing variable
      const type = getValueType(newVarValue);
      setVariables(variables.map(v =>
        v.name === newVarName
          ? { ...v, value: newVarValue, type }
          : v
      ));
    } else {
      // Create new variable
      const type = getValueType(newVarValue);
      const newVariable: Variable = {
        id: Date.now().toString(),
        name: newVarName,
        value: newVarValue,
        type,
        createdAt: Date.now()
      };
      setVariables([...variables, newVariable]);
    }

    // Create floating animation
    const floatingValue: FloatingValue = {
      id: Date.now().toString(),
      value: newVarValue,
      fromX: 50,
      fromY: 50,
      toX: Math.random() * 300 + 100,
      toY: Math.random() * 200 + 100
    };

    setFloatingValues([...floatingValues, floatingValue]);

    // Remove floating value after animation
    setTimeout(() => {
      setFloatingValues(prev => prev.filter(fv => fv.id !== floatingValue.id));
    }, 1500);

    setNewVarName('');
    setNewVarValue('');

    // Complete lesson when user creates their first variable
    if (variables.length === 0 && !isCompleted) {
      setTimeout(() => onComplete(), 1000);
    }
  };

  const deleteVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
    setSelectedVariable(null);
  };

  const accessVariable = (variable: Variable) => {
    setSelectedVariable(variable.id);

    // Show floating value when accessing
    const floatingValue: FloatingValue = {
      id: Date.now().toString(),
      value: variable.value,
      fromX: 200,
      fromY: 200,
      toX: 400,
      toY: 100
    };

    setFloatingValues([...floatingValues, floatingValue]);

    setTimeout(() => {
      setFloatingValues(prev => prev.filter(fv => fv.id !== floatingValue.id));
      setSelectedVariable(null);
    }, 2000);
  };

  const predefinedExamples = [
    { name: 'nama', value: '"Alice"' },
    { name: 'umur', value: '25' },
    { name: 'tinggi', value: '165.5' },
    { name: 'mahasiswa', value: 'True' },
    { name: 'kota', value: '"Jakarta"' },
    { name: 'nilai', value: '95' }
  ];

  const addExample = (example: { name: string; value: string }) => {
    setNewVarName(example.name);
    setNewVarValue(example.value);
  };

  return (
    <div className="space-y-8">
      {/* Concept Introduction */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Variabel seperti kotak berlabel di gudang ajaib.</strong>
              Anda bisa memasukkan berbagai data ke dalam kotak, memberi label nama,
              dan mengambilnya kapan saja dengan menyebut labelnya.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Variable Creator */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Magic Variable Creator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Variabel</label>
                <Input
                  placeholder="nama_variabel"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nilai</label>
                <Input
                  placeholder='"Hello" atau 42 atau True'
                  value={newVarValue}
                  onChange={(e) => setNewVarValue(e.target.value)}
                  className="font-mono"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      createVariable();
                    }
                  }}
                />
              </div>
            </div>

            <Button
              onClick={createVariable}
              disabled={!newVarName.trim() || !newVarValue.trim() || variables.length >= warehouseCapacity}
              className="w-full flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Buat Variabel</span>
            </Button>

            {/* Quick Examples */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Contoh Cepat:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addExample(example)}
                    className="text-xs"
                  >
                    {example.name} = {example.value}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Magic Warehouse */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Magic Warehouse</span>
            </div>
            <Badge variant="secondary">
              {variables.length}/{warehouseCapacity} kotak
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Warehouse Grid */}
          <div className="relative min-h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-dashed border-indigo-200">

            {/* Floating Values Animation */}
            <AnimatePresence>
              {floatingValues.map((fv) => (
                <motion.div
                  key={fv.id}
                  initial={{
                    x: fv.fromX,
                    y: fv.fromY,
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{
                    x: fv.toX,
                    y: fv.toY,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.2
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute z-10 bg-white border-2 border-blue-300 rounded-lg px-3 py-2 shadow-lg font-mono text-sm"
                >
                  {fv.value}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Variables Grid */}
            <div className="grid grid-cols-3 gap-4 h-full">
              {Array.from({ length: warehouseCapacity }).map((_, index) => {
                const variable = variables[index];
                return (
                  <motion.div
                    key={index}
                    className={`
                      relative border-2 rounded-lg p-4 min-h-[120px] transition-all duration-300
                      ${variable
                        ? `${getTypeColor(variable.type)} cursor-pointer hover:shadow-lg`
                        : 'border-dashed border-gray-300 bg-gray-50'
                      }
                      ${selectedVariable === variable?.id ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
                    `}
                    whileHover={variable ? { scale: 1.05 } : {}}
                    whileTap={variable ? { scale: 0.95 } : {}}
                    onClick={variable ? () => accessVariable(variable) : undefined}
                    layout
                  >
                    {variable ? (
                      <div className="space-y-2">
                        {/* Variable Label */}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs font-mono">
                            {variable.name}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteVariable(variable.id);
                            }}
                            className="w-6 h-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Value Display */}
                        <div className="text-center">
                          <div className="text-2xl mb-1">
                            {getValueIcon(variable.type)}
                          </div>
                          <div className="font-mono text-sm font-semibold">
                            {variable.value}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {variable.type}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              accessVariable(variable);
                            }}
                            className="flex-1 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <div className="text-xs">Kotak Kosong</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Warehouse Info */}
            {variables.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Gudang Kosong</h3>
                  <p className="text-sm">Buat variabel pertama Anda untuk melihat keajaiban!</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Memory Analogy */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              Analogi: Lemari di Rumah
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🏠 Di Rumah Anda:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs">
                      Baju
                    </div>
                    <span className="text-sm">Kotak berlabel "Baju" berisi pakaian</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs">
                      Sepatu
                    </div>
                    <span className="text-sm">Kotak berlabel "Sepatu" berisi alas kaki</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs">
                      Buku
                    </div>
                    <span className="text-sm">Kotak berlabel "Buku" berisi koleksi buku</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Setiap kotak memiliki label yang jelas, sehingga Anda tahu apa yang ada di dalamnya
                tanpa harus membuka semua kotak.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Dalam Memori Komputer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">💻 Di Komputer:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs font-mono">
                      nama
                    </div>
                    <span className="text-sm font-mono">"Alice" (string)</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs font-mono">
                      umur
                    </div>
                    <span className="text-sm font-mono">25 (integer)</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-8 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs font-mono">
                      aktif
                    </div>
                    <span className="text-sm font-mono">True (boolean)</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Python menggunakan nama variabel sebagai label untuk mengakses data yang tersimpan di memori.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Variable Rules */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Aturan Penamaan Variabel</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">✅ Boleh Dilakukan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  nama = "Alice"
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  umur_siswa = 16
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  nilai2 = 85
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  _private = "rahasia"
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li>• Dimulai dengan huruf atau underscore (_)</li>
                <li>• Bisa mengandung huruf, angka, underscore</li>
                <li>• Case-sensitive (nama ≠ Nama)</li>
                <li>• Gunakan nama yang deskriptif</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700">❌ Tidak Boleh</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  2nama = "Alice"  # Dimulai angka
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  nama-siswa = 16  # Pakai tanda minus
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  class = "XII"    # Kata reserved
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  print = 42       # Nama fungsi built-in
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li>• Tidak boleh dimulai dengan angka</li>
                <li>• Tidak boleh menggunakan spasi atau tanda baca</li>
                <li>• Tidak boleh menggunakan kata kunci Python</li>
                <li>• Hindari nama fungsi built-in</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Examples */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-center">
            💡 Contoh Penggunaan Variabel dalam Python
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Menyimpan Data Pribadi:</h3>
              <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm space-y-1">
                <div className="text-blue-300">nama = "Budi Santoso"</div>
                <div className="text-blue-300">umur = 17</div>
                <div className="text-blue-300">tinggi = 170.5</div>
                <div className="text-blue-300">siswa_aktif = True</div>
                <div className="text-gray-500"># Menggunakan variabel</div>
                <div className="text-yellow-300">print("Halo,", nama)</div>
                <div className="text-green-400"># Output: Halo, Budi Santoso</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Perhitungan Matematika:</h3>
              <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm space-y-1">
                <div className="text-blue-300">panjang = 10</div>
                <div className="text-blue-300">lebar = 5</div>
                <div className="text-blue-300">luas = panjang * lebar</div>
                <div className="text-gray-500"># luas sekarang berisi 50</div>
                <div className="text-yellow-300">print("Luas:", luas)</div>
                <div className="text-green-400"># Output: Luas: 50</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🎉 Pelajaran 2 Selesai!</h3>
                <p>
                  Anda telah memahami konsep variabel dan memori dengan magic warehouse!
                  Sekarang mari lanjut untuk mempelajari berbagai tipe data yang bisa disimpan dalam variabel.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
