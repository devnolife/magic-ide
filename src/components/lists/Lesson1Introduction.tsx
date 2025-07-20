"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Music,
  Users,
  Plus,
  ArrowRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface LessonProps {
  onComplete?: () => void;
}

interface ShoppingItem {
  id: number;
  name: string;
  emoji: string;
  color: string;
}

const shoppingItems: ShoppingItem[] = [
  { id: 0, name: "Apel", emoji: "🍎", color: "from-red-400 to-red-600" },
  { id: 1, name: "Roti", emoji: "🍞", color: "from-yellow-400 to-orange-500" },
  { id: 2, name: "Susu", emoji: "🥛", color: "from-blue-400 to-blue-600" },
  { id: 3, name: "Telur", emoji: "🥚", color: "from-yellow-300 to-yellow-500" }
];

const realWorldExamples = [
  {
    title: "Daftar Belanja",
    icon: <ShoppingCart className="w-6 h-6" />,
    items: ["Apel", "Roti", "Susu", "Telur"],
    description: "Items diurutkan sesuai kebutuhan"
  },
  {
    title: "Playlist Musik",
    icon: <Music className="w-6 h-6" />,
    items: ["Song 1", "Song 2", "Song 3", "Song 4"],
    description: "Lagu diputar berurutan"
  },
  {
    title: "Daftar Siswa",
    icon: <Users className="w-6 h-6" />,
    items: ["Ahmad", "Budi", "Citra", "Dian"],
    description: "Nama sesuai absen kelas"
  }
];

export function Lesson1Introduction({ onComplete }: LessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState<ShoppingItem[]>([]);
  const [showIndexes, setShowIndexes] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps = [
    "Kenali konsep list dengan shopping cart",
    "Lihat contoh list di kehidupan nyata",
    "Pahami sistem index (alamat item)",
    "Coba tambahkan item ke cart"
  ];

  const addItemToCart = (item: ShoppingItem) => {
    if (!cartItems.find(cartItem => cartItem.id === item.id)) {
      setCartItems(prev => [...prev, item]);
    }
  };

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      onComplete?.();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl mb-4"
        >
          🛒
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Digital Shopping Cart</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Mari mulai dengan memahami list Python menggunakan analogi shopping cart yang mudah dipahami!
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${index <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  backgroundColor: index <= currentStep ? '#3B82F6' : '#E5E7EB'
                }}
              >
                {index + 1}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
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
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Concept Explanation */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold">Apa itu List Python?</h3>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  List Python seperti <strong>shopping cart digital</strong> yang bisa:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Menyimpan banyak item dalam urutan tertentu</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Bertambah atau berkurang sesuai kebutuhan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Setiap item memiliki alamat (index) unik</span>
                  </li>
                </ul>
                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <code className="text-sm text-blue-800">
                    shopping_cart = ["Apel", "Roti", "Susu"]
                  </code>
                </div>
              </div>
            </Card>

            {/* Visual Shopping Cart */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Shopping Cart Visual</h3>
              <div className="relative">
                <motion.div
                  className="w-full h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                  animate={{
                    borderColor: cartItems.length > 0 ? '#3B82F6' : '#D1D5DB'
                  }}
                >
                  {cartItems.length === 0 ? (
                    <div className="text-center text-gray-500">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                      <p>Cart kosong</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-4">
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-white bg-gradient-to-r ${item.color}`}
                        >
                          <span className="text-lg">{item.emoji}</span>
                          <span className="font-medium">{item.name}</span>
                          {showIndexes && (
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              [{index}]
                            </Badge>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Add Items Section */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {shoppingItems.map(item => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => addItemToCart(item)}
                      disabled={cartItems.find(cartItem => cartItem.id === item.id) !== undefined}
                      className="flex items-center space-x-2"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                      <Plus className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-6">
              List di Kehidupan Nyata
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {realWorldExamples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="p-6 h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        {example.icon}
                      </div>
                      <h4 className="font-semibold">{example.title}</h4>
                    </div>
                    <div className="space-y-2 mb-4">
                      {example.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{item}</span>
                          <Badge variant="outline" className="text-xs">
                            [{itemIndex}]
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h3 className="text-2xl font-semibold mb-6">Sistem Index - Alamat Item</h3>
            <Card className="p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6">
                Setiap item dalam list memiliki alamat unik yang disebut <strong>index</strong>.
                Python mulai menghitung dari angka 0!
              </p>

              <Button
                onClick={() => setShowIndexes(!showIndexes)}
                className="mb-6"
                variant={showIndexes ? "default" : "outline"}
              >
                {showIndexes ? "Sembunyikan Index" : "Tampilkan Index"}
              </Button>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {cartItems.length > 0 ? cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="text-center"
                      animate={{
                        scale: showIndexes ? 1.05 : 1
                      }}
                    >
                      {showIndexes && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-2"
                        >
                          <Badge className="bg-purple-500 text-white">
                            Index [{index}]
                          </Badge>
                        </motion.div>
                      )}
                      <div className={`p-4 rounded-lg bg-gradient-to-r ${item.color} text-white`}>
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-4 text-gray-500">
                      Tambahkan item ke cart untuk melihat sistem index
                    </div>
                  )}
                </div>

                {showIndexes && cartItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-blue-50 p-4 rounded-lg"
                  >
                    <p className="text-sm text-blue-800">
                      <strong>Tips:</strong> Index dimulai dari 0, bukan 1.
                      Jadi item pertama berada di index [0], kedua di [1], dan seterusnya.
                    </p>
                  </motion.div>
                )}
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
            className="text-center"
          >
            <h3 className="text-2xl font-semibold mb-6">Coba Sendiri!</h3>
            <Card className="p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6">
                Tambahkan semua item ke shopping cart dan lihat bagaimana index bekerja!
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {shoppingItems.map(item => (
                  <Button
                    key={item.id}
                    variant={cartItems.find(cartItem => cartItem.id === item.id) ? "default" : "outline"}
                    onClick={() => addItemToCart(item)}
                    disabled={cartItems.find(cartItem => cartItem.id === item.id) !== undefined}
                    className="flex items-center space-x-2 h-12"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span>{item.name}</span>
                    {cartItems.find(cartItem => cartItem.id === item.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                ))}
              </div>

              {cartItems.length === shoppingItems.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    🎉 Fantastic! Anda telah menguasai konsep dasar list Python!
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={handleStepComplete}
          disabled={currentStep === 3 && cartItems.length < shoppingItems.length}
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
            Pelajaran 1 Selesai! 🎉
          </h3>
          <p className="text-gray-600">
            Anda sekarang memahami konsep dasar list Python. Mari lanjut ke pembuatan list!
          </p>
        </motion.div>
      )}
    </div>
  );
}
