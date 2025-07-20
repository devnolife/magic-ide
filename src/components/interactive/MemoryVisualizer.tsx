"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';

interface Variable {
  id: string;
  name: string;
  value: string;
  type: string;
}

interface MemoryVisualizerProps {
  title: string;
  description: string;
}

export default function MemoryVisualizer({ title, description }: MemoryVisualizerProps) {
  const [variables, setVariables] = useState<Variable[]>([
    { id: '1', name: 'nama', value: 'Alice', type: 'string' },
    { id: '2', name: 'umur', value: '25', type: 'number' }
  ]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const getTypeFromValue = (value: string): string => {
    if (value === 'True' || value === 'False') return 'boolean';
    if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) return 'number';
    if (value.startsWith('[') && value.endsWith(']')) return 'list';
    return 'string';
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'number': return 'bg-green-100 text-green-800 border-green-300';
      case 'boolean': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'list': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const addVariable = () => {
    if (newVarName.trim() && newVarValue.trim()) {
      const type = getTypeFromValue(newVarValue);
      const newVar: Variable = {
        id: Date.now().toString(),
        name: newVarName.trim(),
        value: newVarValue.trim(),
        type
      };
      setVariables([...variables, newVar]);
      setNewVarName('');
      setNewVarValue('');
    }
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">{title}</CardTitle>
        <p className="text-muted-foreground text-center">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Memory Visualization */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Memori Komputer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {variables.map((variable) => (
                <motion.div
                  key={variable.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`border-2 ${getTypeColor(variable.type)}`}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {variable.name}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariable(variable.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-mono font-bold">
                            {variable.value}
                          </div>
                          <Badge className="text-xs mt-1">
                            {variable.type}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Add New Variable */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Buat Variabel Baru</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Nama Variabel"
              value={newVarName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewVarName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Nilai"
              value={newVarValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewVarValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addVariable} disabled={!newVarName.trim() || !newVarValue.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Contoh nilai: "Alice", 25, True, [1,2,3]
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm">
          <div className="text-green-400 mb-2"># Kode Python yang setara:</div>
          {variables.map((variable) => (
            <div key={variable.id} className="text-blue-300">
              {variable.name} = {variable.type === 'string' ? `"${variable.value}"` : variable.value}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
