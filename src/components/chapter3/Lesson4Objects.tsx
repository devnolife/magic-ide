"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Heart, Shield, Sword, Crown } from 'lucide-react';

interface MagicalCreature {
  id: string;
  name: string;
  type: 'dragon' | 'phoenix' | 'unicorn' | 'griffin';
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  abilities: string[];
  element: string;
  rarity: 'common' | 'rare' | 'legendary' | 'mythical';
  created: Date;
}

interface Lesson4ObjectsProps {
  onComplete: () => void;
}

export function Lesson4Objects({ onComplete }: Lesson4ObjectsProps) {
  const [creatures, setCreatures] = useState<MagicalCreature[]>([
    {
      id: 'dragon_001',
      name: 'Flameheart',
      type: 'dragon',
      level: 10,
      health: 150,
      maxHealth: 150,
      mana: 80,
      maxMana: 80,
      abilities: ['Fire Breath', 'Wing Attack', 'Intimidate'],
      element: 'fire',
      rarity: 'legendary',
      created: new Date()
    },
    {
      id: 'phoenix_001',
      name: 'Rebornix',
      type: 'phoenix',
      level: 8,
      health: 100,
      maxHealth: 100,
      mana: 120,
      maxMana: 120,
      abilities: ['Resurrection', 'Healing Flame', 'Flight'],
      element: 'light',
      rarity: 'mythical',
      created: new Date()
    }
  ]);

  const [selectedCreature, setSelectedCreature] = useState<string | null>(null);
  const [newCreatureName, setNewCreatureName] = useState('');
  const [newCreatureType, setNewCreatureType] = useState<'dragon' | 'phoenix' | 'unicorn' | 'griffin'>('dragon');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const creatureTemplates = {
    dragon: {
      health: 120,
      mana: 60,
      abilities: ['Fire Breath', 'Claw Strike', 'Roar'],
      element: 'fire',
      rarity: 'rare' as const
    },
    phoenix: {
      health: 80,
      mana: 100,
      abilities: ['Resurrection', 'Flame Burst', 'Regeneration'],
      element: 'light',
      rarity: 'legendary' as const
    },
    unicorn: {
      health: 90,
      mana: 110,
      abilities: ['Healing Touch', 'Purify', 'Teleport'],
      element: 'light',
      rarity: 'rare' as const
    },
    griffin: {
      health: 100,
      mana: 70,
      abilities: ['Dive Attack', 'Wind Gust', 'Eagle Eye'],
      element: 'air',
      rarity: 'rare' as const
    }
  };

  const createNewCreature = () => {
    if (newCreatureName) {
      const template = creatureTemplates[newCreatureType];
      const newCreature: MagicalCreature = {
        id: `${newCreatureType}_${Date.now()}`,
        name: newCreatureName,
        type: newCreatureType,
        level: 1,
        health: template.health,
        maxHealth: template.health,
        mana: template.mana,
        maxMana: template.mana,
        abilities: [...template.abilities],
        element: template.element,
        rarity: template.rarity,
        created: new Date()
      };

      setCreatures(prev => [...prev, newCreature]);
      setNewCreatureName('');

      if (!completedTasks.includes('create_object')) {
        setCompletedTasks(prev => [...prev, 'create_object']);
      }
    }
  };

  const levelUpCreature = (creatureId: string) => {
    setCreatures(prev => prev.map(creature => {
      if (creature.id === creatureId) {
        const newLevel = creature.level + 1;
        const healthBonus = Math.floor(creature.maxHealth * 0.1);
        const manaBonus = Math.floor(creature.maxMana * 0.1);

        return {
          ...creature,
          level: newLevel,
          maxHealth: creature.maxHealth + healthBonus,
          health: creature.maxHealth + healthBonus,
          maxMana: creature.maxMana + manaBonus,
          mana: creature.maxMana + manaBonus
        };
      }
      return creature;
    }));

    if (!completedTasks.includes('modify_object')) {
      setCompletedTasks(prev => [...prev, 'modify_object']);
    }
  };

  const useAbility = (creatureId: string, abilityIndex: number) => {
    const creature = creatures.find(c => c.id === creatureId);
    if (!creature) return;

    const ability = creature.abilities[abilityIndex];
    const manaCost = 20;

    if (creature.mana >= manaCost) {
      setCreatures(prev => prev.map(c =>
        c.id === creatureId
          ? { ...c, mana: c.mana - manaCost }
          : c
      ));

      const logEntry = `${creature.name} used ${ability}! (-${manaCost} mana)`;
      setBattleLog(prev => [...prev, logEntry].slice(-5));

      if (!completedTasks.includes('use_method')) {
        setCompletedTasks(prev => [...prev, 'use_method']);
      }
    }
  };

  const healCreature = (creatureId: string) => {
    setCreatures(prev => prev.map(creature => {
      if (creature.id === creatureId) {
        return {
          ...creature,
          health: creature.maxHealth,
          mana: creature.maxMana
        };
      }
      return creature;
    }));

    const creature = creatures.find(c => c.id === creatureId);
    if (creature) {
      setBattleLog(prev => [...prev, `${creature.name} was fully healed!`].slice(-5));
    }
  };

  const addAbility = (creatureId: string) => {
    const newAbilities = ['Mystic Shield', 'Energy Blast', 'Stealth', 'Charge', 'Reflect'];
    const randomAbility = newAbilities[Math.floor(Math.random() * newAbilities.length)];

    setCreatures(prev => prev.map(creature => {
      if (creature.id === creatureId && !creature.abilities.includes(randomAbility)) {
        return {
          ...creature,
          abilities: [...creature.abilities, randomAbility]
        };
      }
      return creature;
    }));

    if (!completedTasks.includes('add_property')) {
      setCompletedTasks(prev => [...prev, 'add_property']);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dragon': return '🐉';
      case 'phoenix': return '🔥';
      case 'unicorn': return '🦄';
      case 'griffin': return '🦅';
      default: return '✨';
    }
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'fire': return 'bg-red-100 text-red-800 border-red-200';
      case 'light': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'air': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'earth': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'legendary': return 'bg-purple-100 text-purple-800';
      case 'mythical': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (completedTasks.length >= 4) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-emerald-800">Lesson 4: Magical Creature Creation</CardTitle>
              <CardDescription className="text-emerald-600">
                Master object-oriented programming through mystical creature summoning and management
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Crown className="w-5 h-5 text-emerald-500" />
            <span>Creature Mastery Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('create_object') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('create_object') ? '✅' : '🐣'}
                <span className="font-medium">Create new magical creatures</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('modify_object') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('modify_object') ? '✅' : '📈'}
                <span className="font-medium">Level up creature properties</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('use_method') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('use_method') ? '✅' : '⚡'}
                <span className="font-medium">Use creature abilities</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('add_property') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('add_property') ? '✅' : '🎯'}
                <span className="font-medium">Add new abilities</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creature Sanctuary */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🏰</span>
              <span>Creature Sanctuary</span>
            </CardTitle>
            <CardDescription>
              Your collection of magical creatures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {creatures.map((creature) => (
                  <motion.div
                    key={creature.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedCreature === creature.id
                        ? 'border-emerald-400 bg-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    onClick={() => setSelectedCreature(selectedCreature === creature.id ? null : creature.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{getTypeIcon(creature.type)}</span>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{creature.name}</div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getElementColor(creature.element)}>
                              {creature.element}
                            </Badge>
                            <Badge className={getRarityColor(creature.rarity)}>
                              {creature.rarity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">Lv.{creature.level}</div>
                        <div className="text-sm text-gray-500">{creature.type}</div>
                      </div>
                    </div>

                    {/* Health and Mana Bars */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-red-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${(creature.health / creature.maxHealth) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{creature.health}/{creature.maxHealth}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-blue-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${(creature.mana / creature.maxMana) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{creature.mana}/{creature.maxMana}</span>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Abilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {creature.abilities.map((ability, index) => (
                          <Button
                            key={ability}
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              useAbility(creature.id, index);
                            }}
                            disabled={creature.mana < 20}
                            className="text-xs"
                          >
                            {ability}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          levelUpCreature(creature.id);
                        }}
                        className="flex-1"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Level Up
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          healCreature(creature.id);
                        }}
                        className="flex-1"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Heal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          addAbility(creature.id);
                        }}
                        className="flex-1"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        New Skill
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Creation Workshop */}
        <div className="space-y-6">
          {/* Creature Creator */}
          <Card className="border-teal-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🧙‍♂️</span>
                <span>Summoning Circle</span>
              </CardTitle>
              <CardDescription>
                Craft new magical creatures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Creature name..."
                value={newCreatureName}
                onChange={(e) => setNewCreatureName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(creatureTemplates).map((type) => (
                  <Button
                    key={type}
                    variant={newCreatureType === type ? "default" : "outline"}
                    onClick={() => setNewCreatureType(type as any)}
                    className="flex items-center space-x-2"
                  >
                    <span>{getTypeIcon(type)}</span>
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </div>
              <Button
                onClick={createNewCreature}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                disabled={!newCreatureName}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Summon Creature
              </Button>
            </CardContent>
          </Card>

          {/* Battle Log */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sword className="w-5 h-5 text-orange-500" />
                <span>Activity Log</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 h-32 overflow-y-auto">
                {battleLog.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No activity yet...</p>
                ) : (
                  battleLog.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm p-2 bg-orange-50 border border-orange-200 rounded"
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Creature Statistics */}
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span>Sanctuary Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{creatures.length}</div>
                  <div className="text-sm text-gray-600">Total Creatures</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(creatures.reduce((sum, c) => sum + c.level, 0) / creatures.length) || 0}
                  </div>
                  <div className="text-sm text-gray-600">Average Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {creatures.filter(c => c.rarity === 'legendary' || c.rarity === 'mythical').length}
                  </div>
                  <div className="text-sm text-gray-600">Legendary+</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {creatures.reduce((sum, c) => sum + c.abilities.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Abilities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Object Mastery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skills Learned</span>
                  <span>{completedTasks.length} / 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {completedTasks.length >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 font-medium"
                  >
                    🎉 Object mastery complete! Advanced playground unlocked!
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
