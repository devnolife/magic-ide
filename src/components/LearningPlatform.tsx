'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { CodeEditor } from './CodeEditor';
import { ListVisualizer } from './ListVisualizer';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { PythonListParser } from '@/lib/pythonParser';
import { ListElement } from '@/types';

const DEFAULT_CODE = `my_list = [1, 2, 3]
my_list.append(4)
my_list.append(5)
my_list.insert(0, 0)
my_list.remove(2)
my_list.pop()`;

export function LearningPlatform() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [elements, setElements] = useState<ListElement[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const parser = useMemo(() => new PythonListParser(), []);

  const generateElements = useCallback((values: number[]): ListElement[] => {
    return values.map((value, index) => ({
      value,
      index,
      id: `${index}-${value}-${Date.now()}-${Math.random()}`
    }));
  }, []);

  const executeCode = useCallback(async () => {
    setIsAnimating(true);

    try {
      const result = parser.parseCode(code);

      if (result.error) {
        toast.error(`Error: ${result.error}`);
        setIsAnimating(false);
        return;
      }

      // Animate through each operation step by step
      let currentList: number[] = [];

      // Find initial list from first line
      const lines = code.split('\n').filter(line => line.trim() !== '');
      const firstLine = lines[0]?.trim();
      if (firstLine && firstLine.includes('=') && firstLine.includes('[')) {
        const match = firstLine.match(/\[(.*?)\]/);
        if (match) {
          const elements = match[1].split(',').map(s => s.trim()).filter(s => s !== '');
          currentList = elements.map(el => parseInt(el)).filter(num => !isNaN(num));
        }
      }

      // Set initial state
      setElements(generateElements(currentList));
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply each operation with animation delay
      for (let i = 0; i < result.operations.length; i++) {
        const operation = result.operations[i];

        // Apply operation to current list
        switch (operation.type) {
          case 'append':
            if (operation.value !== undefined) {
              currentList.push(operation.value);
              toast.success(`Added ${operation.value} to the end`);
            }
            break;
          case 'remove':
            if (operation.value !== undefined) {
              const index = currentList.indexOf(operation.value);
              if (index > -1) {
                currentList.splice(index, 1);
                toast.success(`Removed ${operation.value} from the list`);
              } else {
                toast.error(`Value ${operation.value} not found in list`);
              }
            }
            break;
          case 'pop':
            if (operation.index !== undefined) {
              if (operation.index >= 0 && operation.index < currentList.length) {
                const removed = currentList.splice(operation.index, 1)[0];
                toast.success(`Removed ${removed} at index ${operation.index}`);
              } else {
                toast.error(`Index ${operation.index} out of range`);
              }
            } else {
              const removed = currentList.pop();
              if (removed !== undefined) {
                toast.success(`Removed ${removed} from the end`);
              } else {
                toast.error('Cannot pop from empty list');
              }
            }
            break;
          case 'insert':
            if (operation.index !== undefined && operation.value !== undefined) {
              if (operation.index >= 0 && operation.index <= currentList.length) {
                currentList.splice(operation.index, 0, operation.value);
                toast.success(`Inserted ${operation.value} at index ${operation.index}`);
              } else {
                toast.error(`Index ${operation.index} out of range`);
              }
            }
            break;
        }

        // Update visualization
        setElements(generateElements([...currentList]));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      toast.success('Code execution completed!');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Execution error:', error);
    } finally {
      setIsAnimating(false);
    }
  }, [code, parser, generateElements]);

  const resetCode = useCallback(() => {
    setCode(DEFAULT_CODE);
    setElements([]);
    setIsAnimating(false);
    toast.success('Code reset to default');
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Python List Learning Platform</h1>
          <p className="text-muted-foreground mt-2">
            Learn Python list operations with interactive visualizations
          </p>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            {/* Code Editor */}
            <div className="flex flex-col">
              <CodeEditor
                code={code}
                onCodeChange={setCode}
                onRun={executeCode}
                onReset={resetCode}
              />
            </div>

            {/* Separator */}
            <div className="hidden lg:flex items-center">
              <Separator orientation="vertical" className="h-full" />
            </div>
            <div className="lg:hidden">
              <Separator orientation="horizontal" />
            </div>

            {/* Visualizer */}
            <div className="flex flex-col">
              <ListVisualizer
                elements={elements}
                isAnimating={isAnimating}
              />
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, shadcn/ui, Monaco Editor, and Framer Motion</p>
        </div>
      </div>
    </div>
  );
}
