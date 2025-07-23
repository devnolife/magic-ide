"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, CheckCircle, Code, Lightbulb, Download } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface PracticePlaygroundProps {
  onComplete: () => void;
}

export function PracticePlayground({ onComplete }: PracticePlaygroundProps) {
  const [code, setCode] = useState(`# Welcome to the Dictionary Practice Playground!
# Try these exercises to test your skills

# Exercise 1: Create a student database
students = {
    "alice": {"age": 20, "grade": "A", "subjects": ["Math", "Science"]},
    "bob": {"age": 19, "grade": "B", "subjects": ["English", "History"]},
    "charlie": {"age": 21, "grade": "A", "subjects": ["Art", "Music"]}
}

# Exercise 2: Find all students with grade "A"
a_students = {name: info for name, info in students.items() if info["grade"] == "A"}
print("A-grade students:", a_students)

# Exercise 3: Calculate average age
ages = [student["age"] for student in students.values()]
average_age = sum(ages) / len(ages)
print(f"Average age: {average_age:.1f}")

# Exercise 4: Count subjects
all_subjects = []
for student in students.values():
    all_subjects.extend(student["subjects"])

subject_count = {}
for subject in all_subjects:
    subject_count[subject] = subject_count.get(subject, 0) + 1

print("Subject popularity:", subject_count)

# Try modifying this code and running it!`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const exercises = [
    {
      id: 'shopping_cart',
      title: 'Shopping Cart Manager',
      description: 'Build a shopping cart system with add, remove, and total calculation features.',
      starterCode: `# Shopping Cart Exercise
cart = {}

def add_item(cart, item, price, quantity=1):
    """Add an item to the shopping cart"""
    if item in cart:
        cart[item]["quantity"] += quantity
    else:
        cart[item] = {"price": price, "quantity": quantity}

def remove_item(cart, item):
    """Remove an item from the cart"""
    if item in cart:
        del cart[item]
    else:
        print(f"{item} not found in cart")

def calculate_total(cart):
    """Calculate the total cost of all items"""
    total = 0
    for item_info in cart.values():
        total += item_info["price"] * item_info["quantity"]
    return total

# Test your functions
add_item(cart, "apple", 0.5, 3)
add_item(cart, "banana", 0.3, 5)
add_item(cart, "bread", 2.0, 1)

print("Cart contents:", cart)
print(f"Total cost: $\{calculate_total(cart):.2f}")

# Try adding more items and calculating totals!`,
      difficulty: 'Beginner'
    },
    {
      id: 'grade_tracker',
      title: 'Grade Tracker System',
      description: 'Create a system to track student grades across multiple subjects.',
      starterCode: `# Grade Tracker Exercise
grades = {
    "Math": [85, 92, 78, 96],
    "Science": [88, 85, 92, 89],
    "English": [92, 88, 94, 87],
    "History": [78, 82, 85, 80]
}

def calculate_average(subject_grades):
    """Calculate the average grade for a subject"""
    return sum(subject_grades) / len(subject_grades)

def get_letter_grade(average):
    """Convert numerical average to letter grade"""
    if average >= 90:
        return "A"
    elif average >= 80:
        return "B"
    elif average >= 70:
        return "C"
    elif average >= 60:
        return "D"
    else:
        return "F"

# Calculate averages and letter grades
report = {}
for subject, subject_grades in grades.items():
    avg = calculate_average(subject_grades)
    letter = get_letter_grade(avg)
    report[subject] = {"average": avg, "letter_grade": letter}

print("Grade Report:")
for subject, info in report.items():
    print(f"{subject}: {info['average']:.1f} ({info['letter_grade']})")

# Calculate overall GPA
overall_avg = sum(info["average"] for info in report.values()) / len(report)
print(f"\\nOverall Average: {overall_avg:.1f} ({get_letter_grade(overall_avg)})")`,
      difficulty: 'Intermediate'
    },
    {
      id: 'inventory_system',
      title: 'Inventory Management',
      description: 'Build an inventory system with stock tracking and low-stock alerts.',
      starterCode: `# Inventory Management Exercise
inventory = {
    "laptops": {"quantity": 15, "price": 999.99, "category": "electronics"},
    "mice": {"quantity": 50, "price": 25.99, "category": "electronics"},
    "desks": {"quantity": 8, "price": 199.99, "category": "furniture"},
    "chairs": {"quantity": 12, "price": 149.99, "category": "furniture"},
    "notebooks": {"quantity": 100, "price": 2.99, "category": "office"}
}

def check_low_stock(inventory, threshold=10):
    """Find items with low stock"""
    low_stock = {}
    for item, info in inventory.items():
        if info["quantity"] <= threshold:
            low_stock[item] = info["quantity"]
    return low_stock

def restock_item(inventory, item, quantity):
    """Add stock to an existing item"""
    if item in inventory:
        inventory[item]["quantity"] += quantity
        print(f"Restocked {item}: +{quantity} units")
    else:
        print(f"Item {item} not found in inventory")

def get_category_value(inventory, category):
    """Calculate total value of items in a category"""
    total_value = 0
    for item, info in inventory.items():
        if info["category"] == category:
            total_value += info["quantity"] * info["price"]
    return total_value

# Check inventory status
print("Low Stock Alert:")
low_items = check_low_stock(inventory, 15)
for item, qty in low_items.items():
    print(f"- {item}: {qty} units remaining")

print(f"\\nElectronics inventory value: $\{get_category_value(inventory, 'electronics'):.2f}")

# Restock some items
restock_item(inventory, "desks", 5)
restock_item(inventory, "laptops", 10)`,
      difficulty: 'Advanced'
    }
  ];

  const [currentExercise, setCurrentExercise] = useState(0);

  const runCode = () => {
    setIsRunning(true);

    // Simulate code execution
    setTimeout(() => {
      setOutput(`# Code executed successfully!
# This is a simulation - in a real environment, your Python code would run here.

Sample Output:
================
A-grade students: {'alice': {'age': 20, 'grade': 'A', 'subjects': ['Math', 'Science']}, 'charlie': {'age': 21, 'grade': 'A', 'subjects': ['Art', 'Music']}}
Average age: 20.0
Subject popularity: {'Math': 1, 'Science': 1, 'English': 1, 'History': 1, 'Art': 1, 'Music': 1}

Great job! Your dictionary operations are working correctly! 🎉`);
      setIsRunning(false);

      if (!completedExercises.includes('main_playground')) {
        setCompletedExercises(prev => [...prev, 'main_playground']);
      }
    }, 2000);
  };

  const resetCode = () => {
    if (currentExercise === -1) {
      setCode(`# Welcome to the Dictionary Practice Playground!
# Try these exercises to test your skills

# Exercise 1: Create a student database
students = {
    "alice": {"age": 20, "grade": "A", "subjects": ["Math", "Science"]},
    "bob": {"age": 19, "grade": "B", "subjects": ["English", "History"]},
    "charlie": {"age": 21, "grade": "A", "subjects": ["Art", "Music"]}
}

# Exercise 2: Find all students with grade "A"
a_students = {name: info for name, info in students.items() if info["grade"] == "A"}
print("A-grade students:", a_students)

# Exercise 3: Calculate average age
ages = [student["age"] for student in students.values()]
average_age = sum(ages) / len(ages)
print(f"Average age: {average_age:.1f}")

# Exercise 4: Count subjects
all_subjects = []
for student in students.values():
    all_subjects.extend(student["subjects"])

subject_count = {}
for subject in all_subjects:
    subject_count[subject] = subject_count.get(subject, 0) + 1

print("Subject popularity:", subject_count)

# Try modifying this code and running it!`);
    } else {
      setCode(exercises[currentExercise].starterCode);
    }
    setOutput('');
  };

  const loadExercise = (index: number) => {
    setCurrentExercise(index);
    setCode(exercises[index].starterCode);
    setOutput('');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dictionary_practice.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const markCompleted = () => {
    onComplete();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-3">
            <Code className="w-8 h-8 text-purple-600" />
            Practice Playground
          </CardTitle>
          <p className="text-purple-700">
            Put your dictionary skills to the test with hands-on exercises!
          </p>
        </CardHeader>
      </Card>

      {/* Exercise Selection */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Choose Your Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Button
              onClick={() => { setCurrentExercise(-1); resetCode(); }}
              variant={currentExercise === -1 ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <div className="font-semibold">Free Practice</div>
              <div className="text-xs text-left">Open playground for experimentation</div>
              <Badge className="bg-gray-100 text-gray-800">Practice</Badge>
            </Button>

            {exercises.map((exercise, index) => (
              <Button
                key={exercise.id}
                onClick={() => loadExercise(index)}
                variant={currentExercise === index ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="font-semibold text-sm">{exercise.title}</div>
                <div className="text-xs text-left line-clamp-2">{exercise.description}</div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Editor and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Python Code Editor
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={resetCode} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button onClick={downloadCode} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:border-blue-500 focus:outline-none"
              placeholder="Write your Python dictionary code here..."
            />

            <Button
              onClick={runCode}
              className="w-full mt-4"
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running Code...' : 'Run Code'}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-auto font-mono text-sm">
              {output || (
                <div className="text-gray-500">
                  Click "Run Code" to see the output here...
                  <br /><br />
                  💡 <span className="text-gray-400">Tips:</span>
                  <br />• Use print() to display results
                  <br />• Try different dictionary operations
                  <br />• Experiment with the provided examples
                  <br />• Don't be afraid to make mistakes - that's how you learn!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Exercise Info */}
      {currentExercise >= 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              {exercises[currentExercise].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 mb-4">{exercises[currentExercise].description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-amber-900 mb-2">🎯 Learning Goals:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  {currentExercise === 0 && (
                    <>
                      <li>• Dictionary manipulation</li>
                      <li>• Conditional logic with dictionaries</li>
                      <li>• Calculating totals from nested data</li>
                    </>
                  )}
                  {currentExercise === 1 && (
                    <>
                      <li>• Working with lists in dictionaries</li>
                      <li>• Dictionary comprehensions</li>
                      <li>• Statistical calculations</li>
                    </>
                  )}
                  {currentExercise === 2 && (
                    <>
                      <li>• Complex nested dictionaries</li>
                      <li>• Filtering and categorization</li>
                      <li>• Business logic implementation</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-amber-900 mb-2">💡 Try These Extensions:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  {currentExercise === 0 && (
                    <>
                      <li>• Add a discount system</li>
                      <li>• Implement item categories</li>
                      <li>• Add tax calculations</li>
                    </>
                  )}
                  {currentExercise === 1 && (
                    <>
                      <li>• Add more subjects</li>
                      <li>• Find the highest/lowest grades</li>
                      <li>• Create a class ranking system</li>
                    </>
                  )}
                  {currentExercise === 2 && (
                    <>
                      <li>• Add supplier information</li>
                      <li>• Implement order management</li>
                      <li>• Create sales reports</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Section */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Ready to Graduate?</h3>
            <p className="text-green-700">
              You've explored dictionary concepts through hands-on practice.
              When you feel confident with dictionary operations, mark this section as complete!
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-green-800 mb-3">✅ Skills You've Practiced:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-green-700">
              <div>Dictionary creation & access</div>
              <div>Nested data structures</div>
              <div>Dictionary methods</div>
              <div>Data filtering & analysis</div>
              <div>Real-world applications</div>
              <div>Problem-solving with dictionaries</div>
            </div>
          </div>

          <Button onClick={markCompleted} className="bg-green-600 hover:bg-green-700 px-8 py-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete Dictionary Mastery!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
