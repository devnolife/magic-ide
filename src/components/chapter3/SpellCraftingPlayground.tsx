"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from '@/components/CodeEditor';
import { motion } from 'framer-motion';
import { Play, Wand2, BookOpen, Code, Terminal } from 'lucide-react';

export function SpellCraftingPlayground() {
  const [code, setCode] = useState(`# Welcome to the Spell Crafting Playground!
# Combine dictionary magic with object creation

# Create a magical academy database
academy = {
    "students": {
        "alice": {"level": 5, "specialization": "fire", "score": 95},
        "bob": {"level": 3, "specialization": "water", "score": 87}
    },
    "teachers": {
        "merlin": {"subject": "advanced_magic", "experience": 50}
    }
}

# Dictionary methods practice
print("=== Academy Information ===")
print("All students:", list(academy["students"].keys()))
print("All student data:", list(academy["students"].values()))

# Add new student
academy["students"]["charlie"] = {"level": 4, "specialization": "earth", "score": 91}

# Nested access
alice_level = academy["students"]["alice"]["level"]
print(f"Alice's level: {alice_level}")

# Dictionary comprehension
high_performers = {name: data for name, data in academy["students"].items() if data["score"] > 90}
print("High performers:", high_performers)

# Create a magical creature class
class MagicalCreature:
    def __init__(self, name, creature_type, element):
        self.name = name
        self.type = creature_type
        self.element = element
        self.level = 1
        self.health = 100
        self.abilities = []
    
    def level_up(self):
        self.level += 1
        self.health += 20
        print(f"{self.name} leveled up to {self.level}!")
    
    def learn_ability(self, ability):
        self.abilities.append(ability)
        print(f"{self.name} learned {ability}!")
    
    def cast_spell(self, spell):
        if spell in self.abilities:
            print(f"{self.name} casts {spell}! ✨")
        else:
            print(f"{self.name} doesn't know {spell} yet!")

# Create creatures
dragon = MagicalCreature("Flameheart", "dragon", "fire")
phoenix = MagicalCreature("Rebornix", "phoenix", "light")

# Level them up and teach abilities
dragon.level_up()
dragon.learn_ability("Fire Breath")
dragon.cast_spell("Fire Breath")

phoenix.learn_ability("Resurrection")
phoenix.cast_spell("Resurrection")

print(f"\\n{dragon.name}: Level {dragon.level}, Health {dragon.health}")
print(f"{phoenix.name}: Level {phoenix.level}, Health {phoenix.health}")
`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeExamples = [
    {
      id: 'academy',
      title: 'Academy Management',
      description: 'Complete school management system with nested dictionaries',
      code: `# Advanced Academy Management System
academy = {
    "students": {},
    "teachers": {},
    "courses": {},
    "grades": {}
}

def add_student(name, level, specialization):
    """Add a new student to the academy"""
    academy["students"][name] = {
        "level": level,
        "specialization": specialization,
        "courses": [],
        "grades": {}
    }
    print(f"✨ {name} enrolled in the academy!")

def add_teacher(name, subject, experience):
    """Add a new teacher"""
    academy["teachers"][name] = {
        "subject": subject,
        "experience": experience,
        "courses": []
    }
    print(f"🧙‍♂️ Professor {name} joined the faculty!")

def create_course(course_name, teacher, max_students=20):
    """Create a new course"""
    if teacher in academy["teachers"]:
        academy["courses"][course_name] = {
            "teacher": teacher,
            "students": [],
            "max_students": max_students
        }
        academy["teachers"][teacher]["courses"].append(course_name)
        print(f"📚 Course '{course_name}' created!")
    else:
        print(f"❌ Teacher {teacher} not found!")

def enroll_student(student, course):
    """Enroll student in course"""
    if student in academy["students"] and course in academy["courses"]:
        if len(academy["courses"][course]["students"]) < academy["courses"][course]["max_students"]:
            academy["courses"][course]["students"].append(student)
            academy["students"][student]["courses"].append(course)
            print(f"✅ {student} enrolled in {course}")
        else:
            print(f"❌ Course {course} is full!")
    else:
        print("❌ Student or course not found!")

# Test the system
add_student("Alice", 5, "fire")
add_student("Bob", 3, "water")
add_teacher("Merlin", "advanced_magic", 50)
create_course("Fire Magic 101", "Merlin")
enroll_student("Alice", "Fire Magic 101")

# Display academy status
print("\\n=== ACADEMY STATUS ===")
print(f"Students: {len(academy['students'])}")
print(f"Teachers: {len(academy['teachers'])}")
print(f"Courses: {len(academy['courses'])}")

# Show all courses and their enrollment
for course, data in academy["courses"].items():
    print(f"\\n📖 {course}:")
    print(f"   Teacher: {data['teacher']}")
    print(f"   Students: {data['students']}")
    print(f"   Capacity: {len(data['students'])}/{data['max_students']}")
`
    },
    {
      id: 'creatures',
      title: 'Creature Battle System',
      description: 'Object-oriented magical creature battle mechanics',
      code: `# Advanced Magical Creature Battle System
import random

class Creature:
    def __init__(self, name, creature_type, element):
        self.name = name
        self.type = creature_type
        self.element = element
        self.level = 1
        self.max_health = 100
        self.health = self.max_health
        self.max_mana = 50
        self.mana = self.max_mana
        self.abilities = {}
        self.experience = 0
        
    def add_ability(self, name, damage, mana_cost, element=None):
        """Add a new ability to the creature"""
        self.abilities[name] = {
            "damage": damage,
            "mana_cost": mana_cost,
            "element": element or self.element
        }
        print(f"🌟 {self.name} learned {name}!")
    
    def attack(self, ability_name, target):
        """Attack another creature"""
        if ability_name not in self.abilities:
            print(f"❌ {self.name} doesn't know {ability_name}!")
            return False
            
        ability = self.abilities[ability_name]
        if self.mana < ability["mana_cost"]:
            print(f"💙 {self.name} doesn't have enough mana!")
            return False
            
        # Calculate damage with elemental advantages
        damage = ability["damage"]
        if self._get_advantage(ability["element"], target.element):
            damage = int(damage * 1.5)
            print(f"🔥 Super effective! {ability['element']} vs {target.element}")
        
        self.mana -= ability["mana_cost"]
        target.take_damage(damage)
        print(f"⚔️ {self.name} uses {ability_name} on {target.name} for {damage} damage!")
        return True
    
    def take_damage(self, amount):
        """Take damage from an attack"""
        self.health = max(0, self.health - amount)
        if self.health == 0:
            print(f"💀 {self.name} has been defeated!")
    
    def heal(self, amount=None):
        """Heal the creature"""
        if amount is None:
            amount = self.max_health // 4
        self.health = min(self.max_health, self.health + amount)
        print(f"💚 {self.name} healed for {amount} HP!")
    
    def rest(self):
        """Restore mana"""
        self.mana = self.max_mana
        print(f"💙 {self.name} restored all mana!")
    
    def level_up(self):
        """Level up the creature"""
        self.level += 1
        self.max_health += 20
        self.max_mana += 10
        self.health = self.max_health
        self.mana = self.max_mana
        print(f"✨ {self.name} reached level {self.level}!")
    
    def _get_advantage(self, attack_element, defend_element):
        """Check elemental advantages"""
        advantages = {
            "fire": ["ice", "earth"],
            "water": ["fire", "earth"],
            "earth": ["air", "lightning"],
            "air": ["water", "ice"],
            "lightning": ["water", "air"],
            "ice": ["earth", "air"]
        }
        return defend_element in advantages.get(attack_element, [])
    
    def status(self):
        """Display creature status"""
        print(f"\\n=== {self.name} Status ===")
        print(f"Type: {self.type} | Element: {self.element} | Level: {self.level}")
        print(f"Health: {self.health}/{self.max_health}")
        print(f"Mana: {self.mana}/{self.max_mana}")
        print(f"Abilities: {list(self.abilities.keys())}")

# Create creatures
dragon = Creature("Flameheart", "dragon", "fire")
ice_dragon = Creature("Frostbite", "dragon", "ice")

# Add abilities
dragon.add_ability("Fire Breath", 30, 15, "fire")
dragon.add_ability("Claw Strike", 20, 10)
dragon.add_ability("Roar", 15, 8)

ice_dragon.add_ability("Ice Blast", 25, 12, "ice")
ice_dragon.add_ability("Freeze", 20, 15, "ice")
ice_dragon.add_ability("Ice Shield", 0, 20)  # Defensive ability

# Battle simulation
print("🏟️ BATTLE ARENA: Flameheart vs Frostbite!")
dragon.status()
ice_dragon.status()

print("\\n⚔️ BATTLE BEGIN!")
dragon.attack("Fire Breath", ice_dragon)
ice_dragon.attack("Ice Blast", dragon)
dragon.attack("Claw Strike", ice_dragon)

print("\\n📊 Battle Results:")
dragon.status()
ice_dragon.status()
`
    },
    {
      id: 'inventory',
      title: 'Magical Inventory System',
      description: 'Complex inventory management with nested structures',
      code: `# Magical Inventory Management System
from collections import defaultdict

class MagicalInventory:
    def __init__(self):
        self.items = defaultdict(lambda: defaultdict(int))
        self.categories = {
            "potions": ["health_potion", "mana_potion", "strength_potion"],
            "weapons": ["fire_sword", "ice_staff", "lightning_bow"],
            "armor": ["dragon_scale", "phoenix_feather", "unicorn_mail"],
            "ingredients": ["dragon_blood", "phoenix_ash", "unicorn_horn"],
            "scrolls": ["fireball", "heal", "teleport", "shield"]
        }
        self.item_stats = {
            "health_potion": {"effect": "heal", "power": 50, "rarity": "common"},
            "fire_sword": {"damage": 45, "element": "fire", "rarity": "rare"},
            "dragon_blood": {"type": "ingredient", "potency": 90, "rarity": "legendary"}
        }
    
    def add_item(self, category, item_name, quantity=1):
        """Add items to inventory"""
        if category in self.categories:
            self.items[category][item_name] += quantity
            print(f"✨ Added {quantity}x {item_name} to {category}")
        else:
            print(f"❌ Unknown category: {category}")
    
    def remove_item(self, category, item_name, quantity=1):
        """Remove items from inventory"""
        if self.items[category][item_name] >= quantity:
            self.items[category][item_name] -= quantity
            if self.items[category][item_name] == 0:
                del self.items[category][item_name]
            print(f"🗑️ Removed {quantity}x {item_name}")
            return True
        else:
            print(f"❌ Not enough {item_name} (have {self.items[category][item_name]})")
            return False
    
    def get_category_total(self, category):
        """Get total items in a category"""
        return sum(self.items[category].values())
    
    def find_item(self, item_name):
        """Find which category an item is in"""
        for category, items in self.items.items():
            if item_name in items:
                return category, items[item_name]
        return None, 0
    
    def get_rare_items(self):
        """Get all rare and legendary items"""
        rare_items = {}
        for category, items in self.items.items():
            for item, quantity in items.items():
                if item in self.item_stats:
                    rarity = self.item_stats[item].get("rarity", "common")
                    if rarity in ["rare", "legendary"]:
                        rare_items[item] = {"quantity": quantity, "rarity": rarity}
        return rare_items
    
    def craft_potion(self, potion_type, ingredients_needed):
        """Craft a potion using ingredients"""
        print(f"🧪 Attempting to craft {potion_type}...")
        
        # Check if we have all ingredients
        can_craft = True
        for ingredient, needed in ingredients_needed.items():
            category, available = self.find_item(ingredient)
            if available < needed:
                print(f"❌ Need {needed}x {ingredient}, only have {available}")
                can_craft = False
        
        if can_craft:
            # Remove ingredients
            for ingredient, needed in ingredients_needed.items():
                category, _ = self.find_item(ingredient)
                self.remove_item(category, ingredient, needed)
            
            # Add crafted potion
            self.add_item("potions", potion_type, 1)
            print(f"✅ Successfully crafted {potion_type}!")
        else:
            print(f"❌ Cannot craft {potion_type} - missing ingredients")
    
    def display_inventory(self):
        """Display the entire inventory"""
        print("\\n🎒 === MAGICAL INVENTORY ===")
        total_items = 0
        
        for category, items in self.items.items():
            if items:  # Only show categories with items
                category_total = sum(items.values())
                total_items += category_total
                print(f"\\n📦 {category.upper()} ({category_total} items):")
                
                for item, quantity in sorted(items.items()):
                    rarity = ""
                    if item in self.item_stats:
                        rarity = f" [{self.item_stats[item].get('rarity', 'common')}]"
                    print(f"   • {item}: {quantity}{rarity}")
        
        print(f"\\n📊 Total items: {total_items}")
        
        # Show rare items summary
        rare_items = self.get_rare_items()
        if rare_items:
            print("\\n⭐ RARE ITEMS:")
            for item, data in rare_items.items():
                print(f"   🌟 {item}: {data['quantity']}x [{data['rarity']}]")

# Test the inventory system
inventory = MagicalInventory()

# Add some items
inventory.add_item("potions", "health_potion", 5)
inventory.add_item("potions", "mana_potion", 3)
inventory.add_item("weapons", "fire_sword", 1)
inventory.add_item("ingredients", "dragon_blood", 2)
inventory.add_item("ingredients", "phoenix_ash", 4)
inventory.add_item("armor", "dragon_scale", 1)

# Display inventory
inventory.display_inventory()

# Try crafting
print("\\n🧪 CRAFTING SESSION:")
ingredients_for_super_potion = {
    "dragon_blood": 1,
    "phoenix_ash": 2
}
inventory.craft_potion("super_health_potion", ingredients_for_super_potion)

# Final inventory
inventory.display_inventory()
`
    }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    // Simulate Python execution (in a real app, you'd send this to a Python backend)
    setTimeout(() => {
      setOutput(`Code executed successfully! ✨

Note: This is a simulated output. In a real implementation, 
this would execute the Python code on a backend server.

Your code combines:
• Dictionary operations and nested structures
• Object-oriented programming with classes
• Method definitions and inheritance
• Complex data manipulation

Great work on mastering both dictionaries and objects! 🎉`);
      setIsRunning(false);
    }, 2000);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-pink-800">Spell Crafting Playground</CardTitle>
              <CardDescription className="text-pink-600">
                Advanced practice arena for dictionary magic and object creation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Features Overview */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            <span>Master These Advanced Concepts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">📚</span>
                <span className="font-semibold">Complex Dictionaries</span>
              </div>
              <p className="text-sm text-gray-600">Nested structures, comprehensions, and advanced methods</p>
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🏗️</span>
                <span className="font-semibold">Object Design</span>
              </div>
              <p className="text-sm text-gray-600">Classes, methods, inheritance, and encapsulation</p>
            </div>
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🔮</span>
                <span className="font-semibold">Real Applications</span>
              </div>
              <p className="text-sm text-gray-600">Game systems, databases, and complex workflows</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="playground">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="playground">
            <Code className="w-4 h-4 mr-2" />
            Free Practice
          </TabsTrigger>
          <TabsTrigger value="examples">
            <BookOpen className="w-4 h-4 mr-2" />
            Example Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-purple-500" />
                    <span>Spell Code Editor</span>
                  </span>
                  <Button onClick={runCode} disabled={isRunning} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Casting...' : 'Cast Spell'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <CodeEditor
                    code={code}
                    onCodeChange={setCode}
                    onRun={runCode}
                    onReset={() => setCode('')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-emerald-500" />
                  <span>Magical Output</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-auto">
                  {output || 'Ready to cast spells... ✨'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeExamples.map((example) => (
              <motion.div
                key={example.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="border-indigo-200 cursor-pointer hover:border-indigo-400 transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => loadExample(example.code)}
                      className="w-full"
                      variant="outline"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Load Example
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Tips */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-800">
                <span className="text-2xl">💡</span>
                <span>Master's Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Dictionary Mastery:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Use <code>.get()</code> for safe key access</li>
                    <li>• Comprehensions for data transformation</li>
                    <li>• <code>defaultdict</code> for auto-initialization</li>
                    <li>• Nested structures for complex data</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Object Excellence:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• <code>__init__</code> for object setup</li>
                    <li>• Methods for object behaviors</li>
                    <li>• Properties for data access</li>
                    <li>• Encapsulation for data protection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
