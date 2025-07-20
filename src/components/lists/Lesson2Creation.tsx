"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Wrench,
  Plus,
  Code,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface LessonProps {
  onComplete?: () => void;
}

interface ListTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  preview: string[];
  color: string;
}

const templates: ListTemplate[] = [
  {
    id: 'empty',
    name: 'List Kosong',
    description: 'Membuat list kosong yang siap diisi',
    code: 'my_list = []',
    preview: [],
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'numbers',
    name: 'List Angka',
    description: 'List berisi angka untuk perhitungan',
    code: 'numbers = [1, 2, 3, 4, 5]',
    preview: ['1', '2', '3', '4', '5'],
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'text',
    name: 'List Teks',
    description: 'List berisi string/teks',
    code: 'colors = ["merah", "biru", "hijau"]',
    preview: ['merah', 'biru', 'hijau'],
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'mixed',
    name: 'List Campuran',
    description: 'List dengan berbagai tipe data',
    code: 'mixed = ["John", 25, True, 3.14]',
    preview: ['John', '25', 'True', '3.14'],
    color: 'from-purple-400 to-purple-600'
  }
];

export function Lesson2Creation({ onComplete }: LessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [createdLists, setCreatedLists] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const steps = [
    "Pilih template list",
    "Customize list Anda",
    "Lihat hasil kode Python",
    "Challenge: Buat 3 list berbeda"
  ];

  const addCustomItem = () => {
    if (newItem.trim() && customItems.length < 8) {
      setCustomItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeCustomItem = (index: number) => {
    setCustomItems(prev => prev.filter((_, i) => i !== index));
  };

  const generatePythonCode = () => {
    if (!selectedTemplate) return '';

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return '';

    if (selectedTemplate === 'empty') {
      return 'my_list = []';
    }

    if (customItems.length === 0) {
      return template.code;
    }

    // Generate custom code based on template type
    const listName = template.id === 'numbers' ? 'numbers' :
      template.id === 'text' ? 'colors' :
        template.id === 'mixed' ? 'mixed' : 'my_list';

    const formattedItems = template.id === 'numbers'
      ? customItems.map(item => isNaN(Number(item)) ? `"${item}"` : item)
      : customItems.map(item => `"${item}"`);

    return `${listName} = [${formattedItems.join(', ')}]`;
  };

  const copyCode = () => {
    const code = generatePythonCode();
    navigator.clipboard.writeText(code);
    toast.success('Kode berhasil disalin!');
  };

  const saveList = () => {
    const code = generatePythonCode();
    if (code && !createdLists.includes(code)) {
      setCreatedLists(prev => [...prev, code]);
      toast.success('List berhasil disimpan!');
    }
  };

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (createdLists.length >= 3) {
        setCompleted(true);
        onComplete?.();
      } else {
        toast.error(`Buat ${3 - createdLists.length} list lagi untuk menyelesaikan challenge!`);
      }
    }
  };

  const resetBuilder = () => {
    setSelectedTemplate(null);
    setCustomItems([]);
    setNewItem('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-2xl mb-4"
        >
          🔧
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">List Builder Workshop</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pelajari berbagai cara membuat list Python dengan workshop interaktif!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${index <= currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  backgroundColor: index <= currentStep ? '#F97316' : '#E5E7EB'
                }}
              >
                {index + 1}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${index < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-6">
              Pilih Template List
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`cursor-pointer ${selectedTemplate === template.id ? 'ring-2 ring-orange-500' : ''
                    }`}
                >
                  <Card className="p-4 h-full">
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${template.color} mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                        {template.id === 'empty' ? '∅' :
                          template.id === 'numbers' ? '123' :
                            template.id === 'text' ? 'ABC' : '★'}
                      </div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded text-xs font-mono mb-3">
                      {template.code}
                    </div>

                    <div className="min-h-[60px]">
                      {template.preview.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {template.preview.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${template.color}`}
                            >
                              {item}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-4">
                          List kosong
                        </div>
                      )}
                    </div>

                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3"
                      >
                        <Badge className="bg-orange-500 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Dipilih
                        </Badge>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 1 && selectedTemplate && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* List Builder */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Customize List
              </h3>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Tambahkan item..."
                    onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                    className="flex-1"
                  />
                  <Button onClick={addCustomItem} disabled={!newItem.trim() || customItems.length >= 8}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-500">
                  {customItems.length}/8 items (kosongkan untuk menggunakan template default)
                </div>

                {customItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Items Anda:</h4>
                    <div className="flex flex-wrap gap-2">
                      {customItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 10 }}
                          className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          <span className="text-sm">{item}</span>
                          <button
                            onClick={() => removeCustomItem(index)}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Live Preview */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Live Preview
              </h3>

              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                  <div className="text-gray-500"># Python List</div>
                  <div>{generatePythonCode()}</div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[120px]">
                  <div className="text-sm text-gray-600 mb-2">Visualisasi List:</div>
                  <div className="flex flex-wrap gap-2">
                    {(customItems.length > 0 ? customItems :
                      templates.find(t => t.id === selectedTemplate)?.preview || []
                    ).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`px-3 py-2 rounded-lg text-white bg-gradient-to-r ${templates.find(t => t.id === selectedTemplate)?.color
                          } flex items-center space-x-2`}
                      >
                        <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                          [{index}]
                        </Badge>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>

                  {customItems.length === 0 && templates.find(t => t.id === selectedTemplate)?.preview.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      List kosong - siap untuk diisi!
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-semibold text-center mb-6">
              Kode Python Anda
            </h3>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Generated Code
                </h4>
                <div className="space-x-2">
                  <Button variant="outline" onClick={copyCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={saveList} className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save List
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-lg">
                {generatePythonCode()}
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded">
                  <h5 className="font-semibold text-blue-800 mb-2">💡 Tips:</h5>
                  <p className="text-blue-700">
                    List Python menggunakan tanda kurung siku [ ] untuk membungkus elemen-elemen.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <h5 className="font-semibold text-green-800 mb-2">🎯 Ingat:</h5>
                  <p className="text-green-700">
                    Setiap elemen dipisahkan dengan koma (,) dan string ditulis dalam tanda kutip.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <h5 className="font-semibold text-purple-800 mb-2">🚀 Next:</h5>
                  <p className="text-purple-700">
                    List yang sudah dibuat bisa dimodifikasi dengan berbagai operasi!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-6">
              Challenge: Buat 3 List Berbeda
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Challenge Instructions */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">📋 Challenge Instructions</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-blue-500 text-white">1</Badge>
                    <div>
                      <p className="font-medium">Buat list favorit Anda</p>
                      <p className="text-gray-600">Makanan, film, lagu, atau hobi favorit</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-green-500 text-white">2</Badge>
                    <div>
                      <p className="font-medium">Buat list angka</p>
                      <p className="text-gray-600">Tahun lahir keluarga, nilai ujian, atau nomor keberuntungan</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Badge className="bg-purple-500 text-white">3</Badge>
                    <div>
                      <p className="font-medium">Buat list campuran</p>
                      <p className="text-gray-600">Mix antara teks, angka, atau boolean</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={resetBuilder} variant="outline" className="w-full">
                    Reset Builder untuk List Baru
                  </Button>
                </div>
              </Card>

              {/* Saved Lists */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">
                  📝 List yang Tersimpan ({createdLists.length}/3)
                </h4>

                <div className="space-y-3">
                  {createdLists.map((code, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span>{code}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </motion.div>
                  ))}

                  {Array.from({ length: 3 - createdLists.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="border-2 border-dashed border-gray-300 p-3 rounded text-center text-gray-400"
                    >
                      List #{createdLists.length + index + 1} - Belum dibuat
                    </div>
                  ))}
                </div>

                {createdLists.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">
                      🎉 Challenge Complete! Anda sudah membuat 3 list berbeda!
                    </p>
                  </motion.div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={handleStepComplete}
          disabled={
            (currentStep === 0 && !selectedTemplate) ||
            (currentStep === 3 && createdLists.length < 3)
          }
          className="flex items-center space-x-2"
          size="lg"
        >
          <span>
            {currentStep < steps.length - 1 ? 'Lanjutkan' : 'Selesaikan Pelajaran'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Pelajaran 2 Selesai! 🎉
          </h3>
          <p className="text-gray-600">
            Anda sekarang bisa membuat berbagai jenis list Python. Mari lanjut ke operasi list!
          </p>
        </motion.div>
      )}
    </div>
  );
}
