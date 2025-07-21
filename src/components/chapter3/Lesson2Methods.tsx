"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Merge, Filter, Wand2, RefreshCw } from 'lucide-react';

interface GrimoireEntry {
  name: string;
  power: number;
  element: string;
  school: string;
}

interface Lesson2MethodsProps {
  onComplete: () => void;
}

export function Lesson2Methods({ onComplete }: Lesson2MethodsProps) {
  const [grimoire, setGrimoire] = useState<Record<string, GrimoireEntry>>({
    fireball: { name: "Fireball", power: 25, element: "fire", school: "evocation" },
    heal: { name: "Healing Light", power: 15, element: "light", school: "restoration" },
    lightning: { name: "Lightning Bolt", power: 30, element: "air", school: "evocation" },
    shield: { name: "Mystic Shield", power: 10, element: "arcane", school: "abjuration" }
  });

  const [secondGrimoire, setSecondGrimoire] = useState<Record<string, GrimoireEntry>>({
    freeze: { name: "Ice Shard", power: 20, element: "water", school: "evocation" },
    fireball: { name: "Greater Fireball", power: 35, element: "fire", school: "evocation" },
    teleport: { name: "Teleportation", power: 40, element: "arcane", school: "conjuration" }
  });

  const [extractedKeys, setExtractedKeys] = useState<string[]>([]);
  const [extractedValues, setExtractedValues] = useState<GrimoireEntry[]>([]);
  const [extractedItems, setExtractedItems] = useState<[string, GrimoireEntry][]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState<string>('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);

  const extractKeys = () => {
    const keys = Object.keys(grimoire);
    setExtractedKeys(keys);
    setActiveOperation('keys');
    setTimeout(() => setActiveOperation(null), 1500);

    if (!completedTasks.includes('extract_keys')) {
      setCompletedTasks(prev => [...prev, 'extract_keys']);
    }
  };

  const extractValues = () => {
    const values = Object.values(grimoire);
    setExtractedValues(values);
    setActiveOperation('values');
    setTimeout(() => setActiveOperation(null), 1500);

    if (!completedTasks.includes('extract_values')) {
      setCompletedTasks(prev => [...prev, 'extract_values']);
    }
  };

  const extractItems = () => {
    const items = Object.entries(grimoire);
    setExtractedItems(items);
    setActiveOperation('items');
    setTimeout(() => setActiveOperation(null), 1500);

    if (!completedTasks.includes('extract_items')) {
      setCompletedTasks(prev => [...prev, 'extract_items']);
    }
  };

  const searchSpell = () => {
    if (searchKey) {
      const spell = grimoire[searchKey.toLowerCase()];
      if (spell) {
        setSearchResult(`Found: ${spell.name} (Power: ${spell.power})`);
      } else {
        setSearchResult('Spell not found in grimoire');
      }
      setActiveOperation('search');
      setTimeout(() => setActiveOperation(null), 1500);

      if (!completedTasks.includes('search_spell')) {
        setCompletedTasks(prev => [...prev, 'search_spell']);
      }
    }
  };

  const mergeGrimoires = () => {
    const merged = { ...grimoire, ...secondGrimoire };
    setGrimoire(merged);
    setActiveOperation('merge');
    setTimeout(() => setActiveOperation(null), 1500);

    if (!completedTasks.includes('merge_grimoires')) {
      setCompletedTasks(prev => [...prev, 'merge_grimoires']);
    }
  };

  const transformPowers = () => {
    const transformed: Record<string, GrimoireEntry> = {};
    Object.entries(grimoire).forEach(([key, spell]) => {
      transformed[key] = {
        ...spell,
        power: spell.power * 2
      };
    });
    setGrimoire(transformed);
    setActiveOperation('transform');
    setTimeout(() => setActiveOperation(null), 1500);

    if (!completedTasks.includes('transform_powers')) {
      setCompletedTasks(prev => [...prev, 'transform_powers']);
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return 'bg-red-100 text-red-800 border-red-200';
      case 'water': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'air': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'earth': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'light': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'arcane': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSchoolColor = (school: string) => {
    switch (school) {
      case 'evocation': return 'bg-orange-100 text-orange-800';
      case 'restoration': return 'bg-green-100 text-green-800';
      case 'abjuration': return 'bg-blue-100 text-blue-800';
      case 'conjuration': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 5) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-indigo-800">Lesson 2: Grimoire Management Spells</CardTitle>
              <CardDescription className="text-indigo-600">
                Master advanced dictionary methods and magical data manipulation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-indigo-500" />
            <span>Grimoire Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('extract_keys') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('extract_keys') ? '✅' : '🔑'}
                <span className="font-medium">Extract spell names (keys)</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('extract_values') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('extract_values') ? '✅' : '📊'}
                <span className="font-medium">Extract spell data (values)</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('extract_items') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('extract_items') ? '✅' : '📝'}
                <span className="font-medium">Extract complete entries (items)</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('search_spell') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('search_spell') ? '✅' : '🔍'}
                <span className="font-medium">Search grimoire safely</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('merge_grimoires') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('merge_grimoires') ? '✅' : '🔀'}
                <span className="font-medium">Merge spell collections</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('transform_powers') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('transform_powers') ? '✅' : '⚡'}
                <span className="font-medium">Transform spell powers</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Grimoire */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📜</span>
              <span>Primary Grimoire</span>
            </CardTitle>
            <CardDescription>
              Your main collection of magical spells
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {Object.entries(grimoire).map(([key, spell]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${activeOperation ? 'border-indigo-400 bg-indigo-50 shadow-lg' : 'border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{spell.name}</div>
                        <div className="text-sm text-gray-500">Key: {key}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getElementColor(spell.element)}>
                            {spell.element}
                          </Badge>
                          <Badge className={getSchoolColor(spell.school)}>
                            {spell.school}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{spell.power}</div>
                        <div className="text-xs text-gray-500">Power</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Grimoire */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📖</span>
              <span>Secondary Grimoire</span>
            </CardTitle>
            <CardDescription>
              Additional spells for merging practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(secondGrimoire).map(([key, spell]) => (
                <div key={key} className="p-3 rounded-lg border border-purple-200 bg-purple-25">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{spell.name}</div>
                      <div className="text-sm text-gray-500">Key: {key}</div>
                      <Badge className={getElementColor(spell.element)}>
                        {spell.element}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{spell.power}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Extraction Operations */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-500" />
              <span>Extraction Spells</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={extractKeys} className="w-full" variant="outline">
              <span className="mr-2">🔑</span>
              Extract Keys
            </Button>
            <Button onClick={extractValues} className="w-full" variant="outline">
              <span className="mr-2">📊</span>
              Extract Values
            </Button>
            <Button onClick={extractItems} className="w-full" variant="outline">
              <span className="mr-2">📝</span>
              Extract Items
            </Button>
          </CardContent>
        </Card>

        {/* Search Operation */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🔍</span>
              <span>Spell Lookup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Spell key (e.g., fireball)"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <Button onClick={searchSpell} className="w-full">
              Search Grimoire
            </Button>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm"
              >
                {searchResult}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Operations */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Merge className="w-5 h-5 text-amber-500" />
              <span>Advanced Magic</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={mergeGrimoires} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
              <Merge className="w-4 h-4 mr-2" />
              Merge Grimoires
            </Button>
            <Button onClick={transformPowers} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Double Powers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Extracted Keys */}
        {extractedKeys.length > 0 && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-700">Extracted Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {extractedKeys.map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge variant="outline" className="bg-blue-50 border-blue-200">
                      {key}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extracted Values */}
        {extractedValues.length > 0 && (
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Extracted Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {extractedValues.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 bg-green-50 border border-green-200 rounded text-sm"
                  >
                    {value.name} (Power: {value.power})
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extracted Items */}
        {extractedItems.length > 0 && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-700">Extracted Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {extractedItems.map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-2 bg-purple-50 border border-purple-200 rounded text-sm"
                  >
                    <strong>{key}:</strong> {value.name}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Grimoire Mastery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spells Mastered</span>
              <span>{completedTasks.length} / 6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 6) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium"
              >
                🎉 Advanced grimoire magic mastered! Next tome awaits!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
