"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, ArrowRight } from 'lucide-react';

interface Variable {
  name: string;
  value: string | number;
  color: string;
}

interface AssignmentStep {
  id: string;
  description: string;
  code: string;
  variables: Variable[];
  explanation: string;
}

interface VariableAssignmentDemoProps {
  title: string;
  description: string;
}

export default function VariableAssignmentDemo({ title, description }: VariableAssignmentDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const steps: AssignmentStep[] = [
    {
      id: '1',
      description: 'Langkah 1: Membuat variabel x dengan nilai 10',
      code: 'x = 10',
      variables: [
        { name: 'x', value: 10, color: 'bg-blue-100 text-blue-800 border-blue-300' }
      ],
      explanation: 'Nilai 10 disimpan dalam variabel bernama x'
    },
    {
      id: '2',
      description: 'Langkah 2: Menyalin nilai x ke variabel y',
      code: 'y = x',
      variables: [
        { name: 'x', value: 10, color: 'bg-blue-100 text-blue-800 border-blue-300' },
        { name: 'y', value: 10, color: 'bg-green-100 text-green-800 border-green-300' }
      ],
      explanation: 'Nilai dari x (yaitu 10) disalin ke variabel y. Sekarang x dan y sama-sama berisi 10'
    },
    {
      id: '3',
      description: 'Langkah 3: Mengubah nilai x menjadi 20',
      code: 'x = 20',
      variables: [
        { name: 'x', value: 20, color: 'bg-red-100 text-red-800 border-red-300' },
        { name: 'y', value: 10, color: 'bg-green-100 text-green-800 border-green-300' }
      ],
      explanation: 'Nilai x berubah menjadi 20, tetapi y tetap 10. Mengubah x tidak mempengaruhi y!'
    }
  ];

  const runDemo = async () => {
    setIsAnimating(true);
    setShowVariables(false);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowVariables(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowVariables(false);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setShowVariables(true);
    setIsAnimating(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setShowVariables(false);
  };

  const goToStep = (stepIndex: number) => {
    if (!isAnimating) {
      setCurrentStep(stepIndex);
      setShowVariables(true);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Navigation */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <Button
              key={step.id}
              variant={currentStep === index ? "default" : "outline"}
              size="sm"
              onClick={() => goToStep(index)}
              disabled={isAnimating}
              className="min-w-[80px]"
            >
              Langkah {index + 1}
            </Button>
          ))}
        </div>

        {/* Current Step Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-center mb-4">
            <Badge className="mb-2">{steps[currentStep].description}</Badge>
          </div>

          {/* Code Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-lg text-center mb-6">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {steps[currentStep].code}
            </motion.div>
          </div>

          {/* Variable Visualization */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Status Variabel</h3>

            <div className="flex justify-center items-center space-x-8">
              <AnimatePresence mode="wait">
                {showVariables && steps[currentStep].variables.map((variable, index) => (
                  <motion.div
                    key={`${currentStep}-${variable.name}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2
                    }}
                  >
                    <Card className={`border-2 ${variable.color} min-w-[120px]`}>
                      <CardContent className="p-6">
                        <div className="text-center space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {variable.name}
                          </Badge>
                          <div className="text-3xl font-mono font-bold">
                            {variable.value}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Copy Animation for Step 2 */}
            {currentStep === 1 && showVariables && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center"
              >
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>x</span>
                  <motion.div
                    animate={{ x: [0, 20, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                  <span>y</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Explanation */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-white rounded-lg border"
          >
            <p className="text-sm text-center text-muted-foreground">
              {steps[currentStep].explanation}
            </p>
          </motion.div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={runDemo}
            disabled={isAnimating}
            className="min-w-[120px]"
          >
            <Play className="w-4 h-4 mr-2" />
            {isAnimating ? 'Berjalan...' : 'Jalankan Demo'}
          </Button>
          <Button
            variant="outline"
            onClick={resetDemo}
            disabled={isAnimating}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Key Concepts */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Konsep Penting:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Variabel adalah wadah untuk menyimpan nilai</li>
            <li>• Assignment (=) menyalin nilai, bukan membuat koneksi</li>
            <li>• Mengubah satu variabel tidak mempengaruhi variabel lain</li>
            <li>• Setiap variabel memiliki ruang memori sendiri</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
