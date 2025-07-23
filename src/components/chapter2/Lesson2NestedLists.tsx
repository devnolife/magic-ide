"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GitBranch,
  Search,
  Layers,
  Map,
  ChevronDown,
  ChevronRight,
  Compass,
  Scroll
} from 'lucide-react';

interface LessonComponentProps {
  onComplete: () => void;
}

// Sample nested data structures
const spellLibrary = [
  ["Bola Api", "Serangan Flame", "Meteor"],
  ["Pecahan Es", "Nova Frost"],
  ["Cahaya Penyembuh", "Perisai Suci", "Teleport", "Invisibilitas"],
  ["Petir", "Guntur", "Badai"]
];

const dimensionalMatrix = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12]
];

export function Lesson2NestedLists({ onComplete }: LessonComponentProps) {
  const [selectedData, setSelectedData] = useState<'spells' | 'matrix'>('spells');
  const [expandedScrolls, setExpandedScrolls] = useState<Set<number>>(new Set());
  const [selectedCoordinate, setSelectedCoordinate] = useState<[number, number] | null>(null);
  const [searchTarget, setSearchTarget] = useState('');
  const [foundCoordinate, setFoundCoordinate] = useState<[number, number] | null>(null);
  const [showFlatten, setShowFlatten] = useState(false);

  const toggleScroll = (index: number) => {
    const newExpanded = new Set(expandedScrolls);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedScrolls(newExpanded);
  };

  const findSpell = (target: string) => {
    const data = selectedData === 'spells' ? spellLibrary : dimensionalMatrix;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (String(data[i][j]).toLowerCase().includes(target.toLowerCase())) {
          setFoundCoordinate([i, j]);
          setSelectedCoordinate([i, j]);
          return;
        }
      }
    }
    setFoundCoordinate(null);
  };

  const getFlattenedData = () => {
    const data = selectedData === 'spells' ? spellLibrary : dimensionalMatrix;
    return data.flat();
  };

  const getCurrentData = () => {
    return selectedData === 'spells' ? spellLibrary : dimensionalMatrix;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">🌌 Dimensional Portal Academy</h2>
            <p className="text-blue-600">Navigate through nested dimensions and matrix realms</p>
          </div>
        </div>
      </div>

      {/* Data Type Selector */}
      <div className="flex justify-center gap-4">
        <Button
          variant={selectedData === 'spells' ? 'default' : 'outline'}
          onClick={() => setSelectedData('spells')}
          className={selectedData === 'spells' ? 'bg-purple-600' : 'border-gray-600'}
        >
          <Scroll className="w-4 h-4 mr-2" />
          Spell Scrolls
        </Button>
        <Button
          variant={selectedData === 'matrix' ? 'default' : 'outline'}
          onClick={() => setSelectedData('matrix')}
          className={selectedData === 'matrix' ? 'bg-purple-600' : 'border-gray-600'}
        >
          <Layers className="w-4 h-4 mr-2" />
          Matrix Grid
        </Button>
      </div>

      <Tabs defaultValue="visualization">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
            Scroll Holder
          </TabsTrigger>
          <TabsTrigger value="navigation" className="data-[state=active]:bg-purple-600">
            Navigator
          </TabsTrigger>
          <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
            Spell Finder
          </TabsTrigger>
          <TabsTrigger value="flatten" className="data-[state=active]:bg-purple-600">
            Dimension Merge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-4">
          {/* Master Scroll Holder */}
          <Card className="bg-white border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-purple-400" />
                Master Scroll Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCurrentData().map((scroll, scrollIndex) => (
                  <motion.div
                    key={scrollIndex}
                    className="border border-purple-500/30 rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Scroll Header */}
                    <div
                      className="bg-purple-600/20 p-3 cursor-pointer flex items-center justify-between"
                      onClick={() => toggleScroll(scrollIndex)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white0 rounded-full flex items-center justify-center text-gray-800 font-bold">
                          {scrollIndex}
                        </div>
                        <span className="text-gray-800 font-semibold">
                          {selectedData === 'spells' ? `Spell Scroll ${scrollIndex}` : `Matrix Row ${scrollIndex}`}
                        </span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-purple-600">
                          {scroll.length} items
                        </Badge>
                      </div>
                      {expandedScrolls.has(scrollIndex) ?
                        <ChevronDown className="w-5 h-5 text-purple-400" /> :
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      }
                    </div>

                    {/* Scroll Content */}
                    <AnimatePresence>
                      {expandedScrolls.has(scrollIndex) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-gray-900/30 p-4"
                        >
                          <div className="flex flex-wrap gap-2">
                            {scroll.map((item, itemIndex) => (
                              <motion.div
                                key={itemIndex}
                                className={`px-3 py-2 rounded-lg border cursor-pointer transition-all ${selectedCoordinate?.[0] === scrollIndex && selectedCoordinate?.[1] === itemIndex
                                  ? 'bg-blue-500/20 border-yellow-400 text-yellow-300'
                                  : foundCoordinate?.[0] === scrollIndex && foundCoordinate?.[1] === itemIndex
                                    ? 'bg-blue-500/20 border-green-400 text-green-300 animate-pulse'
                                    : 'bg-blue-500/20 border-blue-400 text-blue-600 hover:bg-white0/30'
                                  }`}
                                onClick={() => setSelectedCoordinate([scrollIndex, itemIndex])}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <div className="text-sm font-mono">
                                  [{scrollIndex}][{itemIndex}]
                                </div>
                                <div className="font-semibold">{item}</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          {/* Coordinate Compass */}
          <Card className="bg-white border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                Dimensional Coordinate System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Coordinate Selector */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">Navigate to Coordinates:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {getCurrentData().map((scroll, scrollIndex) => (
                      scroll.map((item, itemIndex) => (
                        <Button
                          key={`${scrollIndex}-${itemIndex}`}
                          variant="outline"
                          size="sm"
                          className={`h-12 ${selectedCoordinate?.[0] === scrollIndex && selectedCoordinate?.[1] === itemIndex
                            ? 'bg-blue-600 border-blue-400'
                            : 'border-gray-600 hover:border-blue-500'
                            }`}
                          onClick={() => setSelectedCoordinate([scrollIndex, itemIndex])}
                        >
                          <div className="text-xs">
                            <div>[{scrollIndex}][{itemIndex}]</div>
                          </div>
                        </Button>
                      ))
                    ))}
                  </div>
                </div>

                {/* Selected Item Display */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-3">Current Selection:</h4>
                  {selectedCoordinate ? (
                    <Card className="bg-blue-500/20 border-blue-400">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-sm text-blue-600 mb-2">Coordinates:</div>
                          <code className="bg-black/50 px-3 py-1 rounded text-blue-300">
                            [{selectedCoordinate[0]}][{selectedCoordinate[1]}]
                          </code>
                          <div className="text-lg font-bold text-gray-800 mt-3">
                            {getCurrentData()[selectedCoordinate[0]][selectedCoordinate[1]]}
                          </div>
                          <div className="text-sm text-blue-600 mt-2">
                            Access with: data[{selectedCoordinate[0]}][{selectedCoordinate[1]}]
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4 text-center text-gray-400">
                        Click a coordinate to explore
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {/* Spell Searcher */}
          <Card className="bg-white border-green-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-green-400" />
                Dimensional Spell Detector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value)}
                    placeholder={selectedData === 'spells' ? 'Search for spells...' : 'Search matrix values...'}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-800 placeholder-gray-400 focus:border-green-500 focus:outline-none"
                  />
                  <Button
                    onClick={() => findSpell(searchTarget)}
                    disabled={!searchTarget.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Scan
                  </Button>
                </div>

                {foundCoordinate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/20 border border-green-400 rounded-lg p-4"
                  >
                    <div className="text-center">
                      <div className="text-green-300 font-semibold mb-2">🎯 Found!</div>
                      <code className="bg-black/50 px-3 py-1 rounded text-green-400">
                        Location: [{foundCoordinate[0]}][{foundCoordinate[1]}]
                      </code>
                      <div className="text-gray-800 mt-2">
                        Value: <strong>{getCurrentData()[foundCoordinate[0]][foundCoordinate[1]]}</strong>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-sm text-gray-400">
                  <strong>Search Algorithm:</strong>
                  <pre className="bg-black/50 p-3 rounded-lg mt-2 text-green-400 overflow-x-auto">
                    {`def find_in_nested(data, target):
    for i, row in enumerate(data):
        for j, item in enumerate(row):
            if target in str(item):
                return (i, j)
    return None`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flatten" className="space-y-4">
          {/* Dimension Flattener */}
          <Card className="bg-white border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-400" />
                Dimensional Merger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-orange-200 mb-4">
                    Combine all nested dimensions into a single realm
                  </p>
                  <Button
                    onClick={() => setShowFlatten(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    Flatten Dimensions
                  </Button>
                </div>

                <AnimatePresence>
                  {showFlatten && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Original Structure */}
                      <div>
                        <h4 className="text-gray-800 font-semibold mb-2">Original Nested Structure:</h4>
                        <div className="bg-gray-900/50 p-3 rounded-lg">
                          {getCurrentData().map((row, index) => (
                            <div key={index} className="mb-2">
                              <span className="text-gray-400">[{index}]: </span>
                              <span className="text-blue-300">[{row.map(item => `"${item}"`).join(', ')}]</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flattened Result */}
                      <div>
                        <h4 className="text-gray-800 font-semibold mb-2">Flattened Result:</h4>
                        <div className="bg-orange-500/20 border border-orange-400 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {getFlattenedData().map((item, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-3 py-1 bg-orange-600/20 border border-orange-400 rounded text-orange-200"
                              >
                                {item}
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-orange-300">
                            <strong>Python Code:</strong>
                            <code className="block bg-black/50 p-2 rounded mt-1">
                              flattened = [item for row in data for item in row]
                            </code>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Completion Button */}
      <div className="text-center pt-6">
        <Button
          onClick={onComplete}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-3"
        >
          <GitBranch className="w-5 h-5 mr-2" />
          Master Dimensional Navigation
        </Button>
      </div>
    </div>
  );
}


