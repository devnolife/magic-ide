"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Grid3X3, Target } from 'lucide-react';

interface Lesson3NestedLoopsProps {
  onComplete: () => void;
}

export function Lesson3NestedLoops({ onComplete }: Lesson3NestedLoopsProps) {
  const [gridSize, setGridSize] = useState({ rows: 3, cols: 3 });
  const [isRunning, setIsRunning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ row: -1, col: -1 });
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [pattern, setPattern] = useState<'traverse' | 'pattern' | 'search'>('traverse');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [iterationCount, setIterationCount] = useState(0);

  const createGrid = () => {
    return Array.from({ length: gridSize.rows }, (_, row) =>
      Array.from({ length: gridSize.cols }, (_, col) => ({
        row,
        col,
        key: `${row}-${col}`,
        visited: visitedCells.has(`${row}-${col}`),
        current: currentPosition.row === row && currentPosition.col === col
      }))
    );
  };

  const runTraversal = async () => {
    setIsRunning(true);
    setVisitedCells(new Set());
    setCurrentPosition({ row: -1, col: -1 });
    setIterationCount(0);

    let count = 0;
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        setCurrentPosition({ row, col });
        setVisitedCells(prev => new Set([...prev, `${row}-${col}`]));
        setIterationCount(++count);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    setCurrentPosition({ row: -1, col: -1 });
    setIsRunning(false);

    if (!completedTasks.includes('basic_traversal')) {
      setCompletedTasks(prev => [...prev, 'basic_traversal']);
    }
  };

  const runPatternDemo = async () => {
    setIsRunning(true);
    setVisitedCells(new Set());
    setCurrentPosition({ row: -1, col: -1 });
    setIterationCount(0);

    let count = 0;
    // Create a diagonal pattern
    for (let i = 0; i < Math.min(gridSize.rows, gridSize.cols); i++) {
      setCurrentPosition({ row: i, col: i });
      setVisitedCells(prev => new Set([...prev, `${i}-${i}`]));
      setIterationCount(++count);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Fill remaining cells in a spiral
    const visited = new Set();
    for (let i = 0; i < Math.min(gridSize.rows, gridSize.cols); i++) {
      visited.add(`${i}-${i}`);
    }

    // Add more cells for demonstration
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (!visited.has(`${row}-${col}`) && (row + col) % 2 === 0) {
          setCurrentPosition({ row, col });
          setVisitedCells(prev => new Set([...prev, `${row}-${col}`]));
          setIterationCount(++count);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }
    }

    setCurrentPosition({ row: -1, col: -1 });
    setIsRunning(false);

    if (!completedTasks.includes('pattern_creation')) {
      setCompletedTasks(prev => [...prev, 'pattern_creation']);
    }
  };

  const runSearchDemo = async () => {
    setIsRunning(true);
    setVisitedCells(new Set());
    setCurrentPosition({ row: -1, col: -1 });
    setIterationCount(0);

    const targetRow = Math.floor(gridSize.rows / 2);
    const targetCol = Math.floor(gridSize.cols / 2);
    let count = 0;
    let found = false;

    // Search for target position
    for (let row = 0; row < gridSize.rows && !found; row++) {
      for (let col = 0; col < gridSize.cols && !found; col++) {
        setCurrentPosition({ row, col });
        setVisitedCells(prev => new Set([...prev, `${row}-${col}`]));
        setIterationCount(++count);

        if (row === targetRow && col === targetCol) {
          found = true;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }

    setCurrentPosition({ row: -1, col: -1 });
    setIsRunning(false);

    if (!completedTasks.includes('search_algorithm')) {
      setCompletedTasks(prev => [...prev, 'search_algorithm']);
    }
  };

  const resetDemo = () => {
    setCurrentPosition({ row: -1, col: -1 });
    setVisitedCells(new Set());
    setIterationCount(0);
    if (!completedTasks.includes('grid_control')) {
      setCompletedTasks(prev => [...prev, 'grid_control']);
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  const grid = createGrid();

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-800">Lesson 3: Concentric Circle Mastery</CardTitle>
              <CardDescription className="text-blue-600">
                Weave multiple enchantment circles within circles for complex spell patterns
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <span>Nested Circle Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('basic_traversal') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('basic_traversal') ? '✅' : '🔄'}
                <span className="font-medium">Grid Traversal</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('pattern_creation') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('pattern_creation') ? '✅' : '🎨'}
                <span className="font-medium">Pattern Creation</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('search_algorithm') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('search_algorithm') ? '✅' : '🔍'}
                <span className="font-medium">Search Algorithm</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('grid_control') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('grid_control') ? '✅' : '⚙️'}
                <span className="font-medium">Grid Control</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grid Controller */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Grid3X3 className="w-5 h-5 text-blue-500" />
              <span>Grid Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your enchantment grid dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Grid Size Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Rows</label>
                <Input
                  type="number"
                  min="2"
                  max="6"
                  value={gridSize.rows}
                  onChange={(e) => setGridSize(prev => ({ ...prev, rows: parseInt(e.target.value) || 2 }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Columns</label>
                <Input
                  type="number"
                  min="2"
                  max="6"
                  value={gridSize.cols}
                  onChange={(e) => setGridSize(prev => ({ ...prev, cols: parseInt(e.target.value) || 2 }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Python Code Display */}
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="text-blue-300"># Nested loop incantation</div>
              <div>for row in range({gridSize.rows}):</div>
              <div className="ml-4">for col in range({gridSize.cols}):</div>
              <div className="ml-8 text-yellow-300">print(f"Position: ({'{row}'}, {'{col}'})")</div>
              <div className="ml-8">process_cell(row, col)</div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2">
              <Button
                onClick={runTraversal}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Basic Traversal
              </Button>
              <Button
                onClick={runPatternDemo}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Pattern Demo
              </Button>
              <Button
                onClick={runSearchDemo}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Search Algorithm
              </Button>
              <Button onClick={resetDemo} variant="outline" className="w-full">
                Reset Grid
              </Button>
            </div>

            {/* Stats */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Current Stats:</h4>
              <div className="space-y-1 text-sm">
                <div>Grid Size: <Badge variant="outline">{gridSize.rows} × {gridSize.cols}</Badge></div>
                <div>Total Cells: <Badge variant="outline">{gridSize.rows * gridSize.cols}</Badge></div>
                <div>Iterations: <Badge variant="outline">{iterationCount}</Badge></div>
                <div>Visited: <Badge variant="outline">{visitedCells.size}</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid Visualization */}
        <Card className="lg:col-span-2 border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span>Enchantment Grid</span>
            </CardTitle>
            <CardDescription>
              Watch nested loops traverse the magical grid in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className={`grid gap-2 p-4`}>
                <AnimatePresence>
                  {grid.flat().map((cell) => (
                    <motion.div
                      key={cell.key}
                      className={`
                        w-16 h-16 border-2 rounded-lg flex items-center justify-center text-sm font-bold
                        transition-all duration-300 ${cell.current
                          ? 'border-red-400 bg-red-100 text-red-700 shadow-lg scale-110'
                          : cell.visited
                            ? 'border-green-400 bg-green-100 text-green-700'
                            : 'border-gray-300 bg-gray-50 text-gray-500'
                        }`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: cell.current ? 1.1 : 1,
                        opacity: 1,
                        boxShadow: cell.current ? '0 4px 20px rgba(239, 68, 68, 0.4)' : 'none'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center">
                        <div className="text-xs opacity-70">({cell.row},{cell.col})</div>
                        {cell.current && (
                          <motion.div
                            className="absolute inset-0 border-2 border-red-400 rounded-lg"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Current Position Display */}
            {currentPosition.row >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                  Current: Row {currentPosition.row}, Column {currentPosition.col}
                </Badge>
              </motion.div>
            )}

            {/* Legend */}
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 bg-gray-50 rounded"></div>
                <span className="text-sm text-gray-600">Unvisited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-400 bg-green-100 rounded"></div>
                <span className="text-sm text-gray-600">Visited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-red-400 bg-red-100 rounded"></div>
                <span className="text-sm text-gray-600">Current</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Nested Loop Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Concentric Circles Mastered</span>
              <span>{completedTasks.length} / 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium"
              >
                🎉 Nested loop mastery achieved! Ready for comprehension magic!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
