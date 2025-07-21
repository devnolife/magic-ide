"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Package, Sparkles } from 'lucide-react';

interface SpellIngredient {
  name: string;
  quantity: number;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
}

interface Lesson1DictionaryProps {
  onComplete: () => void;
}

export function Lesson1Dictionary({ onComplete }: Lesson1DictionaryProps) {
  const [ingredients, setIngredients] = useState<Record<string, SpellIngredient>>({
    dragon_scale: { name: "Dragon Scale", quantity: 5, rarity: 'rare', color: 'bg-red-500' },
    phoenix_feather: { name: "Phoenix Feather", quantity: 2, rarity: 'legendary', color: 'bg-orange-500' },
    unicorn_hair: { name: "Unicorn Hair", quantity: 10, rarity: 'common', color: 'bg-blue-500' },
    moonstone: { name: "Moonstone", quantity: 3, rarity: 'rare', color: 'bg-purple-500' }
  });

  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientQuantity, setNewIngredientQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const predefinedIngredients = [
    { name: "star_dust", display: "Star Dust", quantity: 7, rarity: 'legendary' as const, color: 'bg-yellow-500' },
    { name: "crystal_shard", display: "Crystal Shard", quantity: 4, rarity: 'rare' as const, color: 'bg-cyan-500' },
    { name: "herb_leaf", display: "Herb Leaf", quantity: 15, rarity: 'common' as const, color: 'bg-green-500' },
    { name: "shadow_essence", display: "Shadow Essence", quantity: 1, rarity: 'legendary' as const, color: 'bg-gray-800' }
  ];

  const filteredIngredients = Object.entries(ingredients).filter(([key, ingredient]) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addIngredient = () => {
    if (newIngredientName && newIngredientQuantity) {
      const key = newIngredientName.toLowerCase().replace(/\\s+/g, '_');
      const newIngredient: SpellIngredient = {
        name: newIngredientName,
        quantity: parseInt(newIngredientQuantity),
        rarity: 'common',
        color: 'bg-emerald-500'
      };

      setIngredients(prev => ({ ...prev, [key]: newIngredient }));
      setNewIngredientName('');
      setNewIngredientQuantity('');

      if (!completedTasks.includes('add_ingredient')) {
        setCompletedTasks(prev => [...prev, 'add_ingredient']);
      }
    }
  };

  const addPredefinedIngredient = (ingredient: typeof predefinedIngredients[0]) => {
    setIngredients(prev => ({
      ...prev,
      [ingredient.name]: {
        name: ingredient.display,
        quantity: ingredient.quantity,
        rarity: ingredient.rarity,
        color: ingredient.color
      }
    }));

    if (!completedTasks.includes('add_predefined')) {
      setCompletedTasks(prev => [...prev, 'add_predefined']);
    }
  };

  const updateQuantity = (key: string, change: number) => {
    setIngredients(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity: Math.max(0, prev[key].quantity + change)
      }
    }));

    if (!completedTasks.includes('update_quantity')) {
      setCompletedTasks(prev => [...prev, 'update_quantity']);
    }
  };

  const searchIngredient = () => {
    if (searchTerm && filteredIngredients.length > 0) {
      setSelectedIngredient(filteredIngredients[0][0]);
      if (!completedTasks.includes('search_ingredient')) {
        setCompletedTasks(prev => [...prev, 'search_ingredient']);
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-green-100 text-green-800 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-purple-800">Lesson 1: Spell Ingredient Catalog</CardTitle>
              <CardDescription className="text-purple-600">
                Master the ancient art of Dictionary creation with magical ingredient management
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>Magical Learning Objectives</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('add_ingredient') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('add_ingredient') ? '✅' : '🎯'}
                <span className="font-medium">Create new ingredients (key-value pairs)</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('search_ingredient') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('search_ingredient') ? '✅' : '🔍'}
                <span className="font-medium">Search and access ingredients</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('update_quantity') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('update_quantity') ? '✅' : '📊'}
                <span className="font-medium">Update ingredient quantities</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('add_predefined') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('add_predefined') ? '✅' : '⭐'}
                <span className="font-medium">Add legendary ingredients</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredient Cabinet */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🧪</span>
              <span>Magical Ingredient Cabinet</span>
            </CardTitle>
            <CardDescription>
              Your enchanted storage for spell components
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={searchIngredient} variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Ingredient Grid */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredIngredients.map(([key, ingredient]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedIngredient === key
                        ? 'border-purple-400 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                    onClick={() => setSelectedIngredient(selectedIngredient === key ? null : key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${ingredient.color} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-sm font-bold">{ingredient.quantity}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{ingredient.name}</div>
                          <div className="text-sm text-gray-500">Key: {key}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRarityColor(ingredient.rarity)} border`}>
                          {ingredient.rarity}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(key, -1);
                            }}
                            className="w-8 h-8 p-0"
                          >
                            -
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(key, 1);
                            }}
                            className="w-8 h-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <div className="space-y-6">
          {/* Add New Ingredient */}
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-indigo-500" />
                <span>Ingredient Creation Ritual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ingredient name..."
                value={newIngredientName}
                onChange={(e) => setNewIngredientName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantity..."
                value={newIngredientQuantity}
                onChange={(e) => setNewIngredientQuantity(e.target.value)}
              />
              <Button onClick={addIngredient} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                Enchant New Ingredient
              </Button>
            </CardContent>
          </Card>

          {/* Predefined Ingredients */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span>Legendary Ingredients</span>
              </CardTitle>
              <CardDescription>
                Rare components from the academy's vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {predefinedIngredients
                  .filter(ing => !ingredients[ing.name])
                  .map((ingredient) => (
                    <Button
                      key={ingredient.name}
                      variant="outline"
                      onClick={() => addPredefinedIngredient(ingredient)}
                      className="justify-start p-3 h-auto"
                    >
                      <div className={`w-6 h-6 ${ingredient.color} rounded-full mr-3 flex items-center justify-center shadow-sm`}>
                        <span className="text-white text-xs font-bold">{ingredient.quantity}</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{ingredient.display}</div>
                        <Badge className={`${getRarityColor(ingredient.rarity)} text-xs`}>
                          {ingredient.rarity}
                        </Badge>
                      </div>
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Mastery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>{completedTasks.length} / 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
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
                    🎉 Lesson Complete! Next grimoire unlocked!
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
