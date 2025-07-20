"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Plus, Minus, X, Divide } from 'lucide-react';

interface Operation {
  id: string;
  type: 'math' | 'string';
  operator: string;
  operand1: string | number;
  operand2: string | number;
  result: string | number;
  icon: React.ReactNode;
  description: string;
}

interface OperationAnimatorProps {
  title: string;
  description: string;
}

export default function OperationAnimator({ title, description }: OperationAnimatorProps) {
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const operations: Operation[] = [
    {
      id: '1',
      type: 'math',
      operator: '+',
      operand1: 5,
      operand2: 3,
      result: 8,
      icon: <Plus className="w-4 h-4" />,
      description: 'Penjumlahan'
    },
    {
      id: '2',
      type: 'math',
      operator: '-',
      operand1: 10,
      operand2: 4,
      result: 6,
      icon: <Minus className="w-4 h-4" />,
      description: 'Pengurangan'
    },
    {
      id: '3',
      type: 'math',
      operator: '*',
      operand1: 6,
      operand2: 2,
      result: 12,
      icon: <X className="w-4 h-4" />,
      description: 'Perkalian'
    },
    {
      id: '4',
      type: 'math',
      operator: '/',
      operand1: 15,
      operand2: 3,
      result: 5,
      icon: <Divide className="w-4 h-4" />,
      description: 'Pembagian'
    },
    {
      id: '5',
      type: 'string',
      operator: '+',
      operand1: '"Halo"',
      operand2: '" Dunia"',
      result: '"Halo Dunia"',
      icon: <Plus className="w-4 h-4" />,
      description: 'Penggabungan Teks'
    }
  ];

  const runAnimation = async (operation: Operation) => {
    setCurrentOperation(operation);
    setIsAnimating(true);
    setShowResult(false);

    // Simulate animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setShowResult(true);
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setCurrentOperation(null);
    setIsAnimating(false);
    setShowResult(false);
  };

  const getOperandColor = (type: string) => {
    return type === 'math'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getResultColor = (type: string) => {
    return type === 'math'
      ? 'bg-purple-100 text-purple-800 border-purple-300'
      : 'bg-orange-100 text-orange-800 border-orange-300';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operation Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Pilih Operasi untuk Dijalankan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {operations.map((operation) => (
              <Button
                key={operation.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => runAnimation(operation)}
                disabled={isAnimating}
              >
                <div className="flex items-center space-x-2">
                  {operation.icon}
                  <Badge>{operation.description}</Badge>
                </div>
                <div className="font-mono text-sm">
                  {operation.operand1} {operation.operator} {operation.operand2}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Animation Area */}
        {currentOperation && (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-6">
              {currentOperation.description}
            </h3>

            <div className="flex items-center justify-center space-x-4">
              {/* First Operand */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`border-2 ${getOperandColor(currentOperation.type)}`}>
                  <CardContent className="p-6">
                    <div className="text-2xl font-mono font-bold text-center">
                      {currentOperation.operand1}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Operator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{currentOperation.operator}</span>
                </div>
              </motion.div>

              {/* Second Operand */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className={`border-2 ${getOperandColor(currentOperation.type)}`}>
                  <CardContent className="p-6">
                    <div className="text-2xl font-mono font-bold text-center">
                      {currentOperation.operand2}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Equals */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">=</span>
                </div>
              </motion.div>

              {/* Result */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className={`border-2 ${getResultColor(currentOperation.type)}`}>
                      <CardContent className="p-6">
                        <div className="text-2xl font-mono font-bold text-center">
                          {currentOperation.result}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading Animation */}
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-6"
              >
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        {currentOperation && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={resetAnimation}
              disabled={isAnimating}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        )}

        {/* Code Example */}
        {currentOperation && showResult && (
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm">
            <div className="text-green-400 mb-2"># Kode Python:</div>
            <div className="text-blue-300">
              hasil = {currentOperation.operand1} {currentOperation.operator} {currentOperation.operand2}
            </div>
            <div className="text-yellow-300">
              print(hasil)  # {currentOperation.result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
