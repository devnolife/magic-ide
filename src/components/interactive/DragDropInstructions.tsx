"use client";

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Instruction {
  id: string;
  text: string;
  order: number;
}

interface DragDropInstructionsProps {
  title: string;
  instructions: Instruction[];
  correctOrder: string[];
  analogy: string;
}

export default function DragDropInstructions({
  title,
  instructions,
  correctOrder,
  analogy
}: DragDropInstructionsProps) {
  const [items, setItems] = useState<Instruction[]>(
    [...instructions].sort(() => Math.random() - 0.5)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkOrder = () => {
    const currentOrder = items.map(item => item.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setIsChecked(true);
  };

  const resetOrder = () => {
    setItems([...instructions].sort(() => Math.random() - 0.5));
    setIsChecked(false);
    setIsCorrect(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        <p className="text-muted-foreground text-center">{analogy}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Seret kartu instruksi untuk menyusun urutan yang benar:
        </div>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`p-3 border-2 ${isChecked
                    ? items.findIndex(i => i.id === item.id) === correctOrder.findIndex(id => id === item.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-blue-300'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.text}</span>
                    <Badge variant="outline">
                      {items.findIndex(i => i.id === item.id) + 1}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex gap-2 justify-center">
          <Button onClick={checkOrder} disabled={isChecked}>
            Periksa Urutan
          </Button>
          <Button variant="outline" onClick={resetOrder}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {isChecked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-4 rounded-lg ${isCorrect
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Bagus! Urutan benar!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Coba lagi, urutan belum tepat</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
