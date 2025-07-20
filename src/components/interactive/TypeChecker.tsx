"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TypeExample {
  value: string;
  type: string;
  description: string;
  color: string;
  icon: string;
}

interface TypeCheckerProps {
  title: string;
  description: string;
}

export default function TypeChecker({ title, description }: TypeCheckerProps) {
  const [inputValue, setInputValue] = useState('');
  const [currentType, setCurrentType] = useState<TypeExample | null>(null);

  const typeExamples: TypeExample[] = [
    {
      value: '"Halo Dunia"',
      type: 'String (Teks)',
      description: 'Teks yang diapit tanda kutip',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '📝'
    },
    {
      value: '42',
      type: 'Integer (Bilangan Bulat)',
      description: 'Angka tanpa koma',
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: '🔢'
    },
    {
      value: '19.99',
      type: 'Float (Bilangan Desimal)',
      description: 'Angka dengan koma/titik desimal',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: '💯'
    },
    {
      value: 'True',
      type: 'Boolean (Benar/Salah)',
      description: 'Nilai True atau False',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: '✅'
    },
    {
      value: '[1, 2, 3]',
      type: 'List (Daftar)',
      description: 'Kumpulan nilai dalam kurung siku',
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: '📋'
    }
  ];

  const detectType = (value: string): TypeExample => {
    const trimmedValue = value.trim();

    if (trimmedValue === 'True' || trimmedValue === 'False') {
      return typeExamples.find(t => t.type.includes('Boolean'))!;
    }

    if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
      return typeExamples.find(t => t.type.includes('List'))!;
    }

    if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
      return typeExamples.find(t => t.type.includes('String'))!;
    }

    if (!isNaN(Number(trimmedValue)) && !isNaN(parseFloat(trimmedValue))) {
      if (trimmedValue.includes('.')) {
        return typeExamples.find(t => t.type.includes('Float'))!;
      } else {
        return typeExamples.find(t => t.type.includes('Integer'))!;
      }
    }

    return typeExamples.find(t => t.type.includes('String'))!;
  };

  const checkType = () => {
    if (inputValue.trim()) {
      const detectedType = detectType(inputValue);
      setCurrentType(detectedType);
    }
  };

  const tryExample = (example: TypeExample) => {
    setInputValue(example.value);
    setCurrentType(example);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Jenis-jenis Tipe Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeExamples.map((example, index) => (
              <motion.div
                key={example.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:scale-105 border-2 ${example.color}`}
                  onClick={() => tryExample(example)}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">{example.icon}</div>
                      <Badge className="text-xs">{example.type}</Badge>
                      <div className="font-mono text-sm bg-white p-2 rounded">
                        {example.value}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {example.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Type Checker */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Pemeriksa Tipe Data</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan nilai untuk diperiksa tipenya..."
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && checkType()}
            />
            <Button onClick={checkType} disabled={!inputValue.trim()}>
              Periksa Tipe
            </Button>
          </div>
        </div>

        {/* Result */}
        {currentType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className={`border-2 ${currentType.color}`}>
              <AlertDescription>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-2xl">{currentType.icon}</span>
                  <div className="text-center">
                    <div className="font-semibold">Tipe Data: {currentType.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentType.description}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Python Code Preview */}
        {currentType && (
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm">
            <div className="text-green-400 mb-2"># Dalam Python:</div>
            <div className="text-blue-300">
              nilai = {inputValue}
            </div>
            <div className="text-yellow-300">
              print(type(nilai))  # {currentType.type}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
