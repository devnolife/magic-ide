"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { CodeEditor } from '@/components/CodeEditor';
import { Play, BookOpen, Zap, Target } from 'lucide-react';

interface IterationPlaygroundProps {
  onComplete: () => void;
}

export function IterationPlayground({ onComplete }: IterationPlaygroundProps) {
  const [activeTab, setActiveTab] = useState('challenges');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [currentCode, setCurrentCode] = useState('');

  const challenges = [
    {
      id: 'fibonacci',
      title: 'Fibonacci Sequence Generator',
      description: 'Create a generator that yields Fibonacci numbers',
      difficulty: 'Medium',
      template: `def fibonacci_generator(n):
    # Your code here
    pass

# Test your generator
fib_gen = fibonacci_generator(10)
for num in fib_gen:
    print(num)`,
      solution: `def fibonacci_generator(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Test your generator
fib_gen = fibonacci_generator(10)
for num in fib_gen:
    print(num)`
    },
    {
      id: 'matrix_transform',
      title: 'Matrix Transformation',
      description: 'Transform a 2D matrix using nested loops and comprehensions',
      difficulty: 'Hard',
      template: `# Transform this matrix by doubling even numbers and squaring odd numbers
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Method 1: Using nested loops
def transform_loops(matrix):
    # Your code here
    pass

# Method 2: Using list comprehension
def transform_comprehension(matrix):
    # Your code here
    pass

print("Original:", matrix)
print("Loops result:", transform_loops(matrix))
print("Comprehension result:", transform_comprehension(matrix))`,
      solution: `# Transform this matrix by doubling even numbers and squaring odd numbers
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Method 1: Using nested loops
def transform_loops(matrix):
    result = []
    for row in matrix:
        new_row = []
        for num in row:
            if num % 2 == 0:
                new_row.append(num * 2)
            else:
                new_row.append(num * num)
        result.append(new_row)
    return result

# Method 2: Using list comprehension
def transform_comprehension(matrix):
    return [[num * 2 if num % 2 == 0 else num * num for num in row] for row in matrix]

print("Original:", matrix)
print("Loops result:", transform_loops(matrix))
print("Comprehension result:", transform_comprehension(matrix))`
    },
    {
      id: 'data_processing',
      title: 'Advanced Data Processing',
      description: 'Process and filter student data using various iteration techniques',
      difficulty: 'Expert',
      template: `students = [
    {"name": "Alice", "grades": [85, 92, 78, 96], "age": 20},
    {"name": "Bob", "grades": [76, 81, 87, 73], "age": 22},
    {"name": "Charlie", "grades": [94, 89, 92, 97], "age": 19},
    {"name": "Diana", "grades": [88, 85, 91, 89], "age": 21}
]

# Challenge 1: Find students with average grade > 85
def high_achievers(students):
    # Your code here
    pass

# Challenge 2: Create a dictionary mapping names to their highest grade
def name_to_highest_grade(students):
    # Your code here
    pass

# Challenge 3: Generate pairs of students for study groups
def study_pairs(students):
    # Your code here
    pass

print("High achievers:", high_achievers(students))
print("Highest grades:", name_to_highest_grade(students))
print("Study pairs:", list(study_pairs(students)))`,
      solution: `students = [
    {"name": "Alice", "grades": [85, 92, 78, 96], "age": 20},
    {"name": "Bob", "grades": [76, 81, 87, 73], "age": 22},
    {"name": "Charlie", "grades": [94, 89, 92, 97], "age": 19},
    {"name": "Diana", "grades": [88, 85, 91, 89], "age": 21}
]

# Challenge 1: Find students with average grade > 85
def high_achievers(students):
    return [student["name"] for student in students 
            if sum(student["grades"]) / len(student["grades"]) > 85]

# Challenge 2: Create a dictionary mapping names to their highest grade
def name_to_highest_grade(students):
    return {student["name"]: max(student["grades"]) for student in students}

# Challenge 3: Generate pairs of students for study groups
def study_pairs(students):
    names = [student["name"] for student in students]
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            yield (names[i], names[j])

print("High achievers:", high_achievers(students))
print("Highest grades:", name_to_highest_grade(students))
print("Study pairs:", list(study_pairs(students)))`
    }
  ];

  const examples = [
    {
      id: 'spiral_matrix',
      title: 'Spiral Matrix Generator',
      code: `def spiral_matrix(n):
    """Generate a spiral matrix of size n x n"""
    matrix = [[0] * n for _ in range(n)]
    
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up
    direction_idx = 0
    row, col = 0, 0
    
    for num in range(1, n * n + 1):
        matrix[row][col] = num
        
        # Calculate next position
        next_row = row + directions[direction_idx][0]
        next_col = col + directions[direction_idx][1]
        
        # Check if we need to turn
        if (next_row < 0 or next_row >= n or 
            next_col < 0 or next_col >= n or 
            matrix[next_row][next_col] != 0):
            direction_idx = (direction_idx + 1) % 4
            next_row = row + directions[direction_idx][0]
            next_col = col + directions[direction_idx][1]
        
        row, col = next_row, next_col
    
    return matrix

# Generate and display a 5x5 spiral
spiral = spiral_matrix(5)
for row in spiral:
    print(' '.join(f'{num:2}' for num in row))`
    },
    {
      id: 'prime_sieve',
      title: 'Sieve of Eratosthenes',
      code: `def sieve_of_eratosthenes(limit):
    """Find all prime numbers up to limit using the Sieve of Eratosthenes"""
    # Initialize boolean array
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    
    # Sieve algorithm
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            # Mark multiples as non-prime
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    
    # Collect prime numbers
    primes = [i for i in range(2, limit + 1) if is_prime[i]]
    return primes

# Generate comprehension version
def primes_comprehension(limit):
    """Alternative using list comprehension and generator"""
    return [n for n in range(2, limit + 1) 
            if all(n % i != 0 for i in range(2, int(n**0.5) + 1))]

# Compare both methods
limit = 100
sieve_primes = sieve_of_eratosthenes(limit)
comp_primes = primes_comprehension(limit)

print(f"Primes up to {limit}: {len(sieve_primes)} found")
print("First 10:", sieve_primes[:10])
print("Methods match:", sieve_primes == comp_primes)`
    },
    {
      id: 'lazy_evaluation',
      title: 'Lazy Evaluation Demo',
      code: `import itertools
from typing import Iterator

def infinite_fibonacci() -> Iterator[int]:
    """Generate Fibonacci numbers infinitely"""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def prime_filter(numbers: Iterator[int]) -> Iterator[int]:
    """Filter prime numbers from an iterator"""
    def is_prime(n):
        if n < 2:
            return False
        return all(n % i != 0 for i in range(2, int(n**0.5) + 1))
    
    return filter(is_prime, numbers)

def squared_transform(numbers: Iterator[int]) -> Iterator[int]:
    """Square each number in the iterator"""
    return (x * x for x in numbers)

# Chain operations lazily
fibonacci_stream = infinite_fibonacci()
fibonacci_primes = prime_filter(fibonacci_stream)
squared_fibonacci_primes = squared_transform(fibonacci_primes)

# Only compute when needed
print("First 10 squared Fibonacci primes:")
for i, prime_square in enumerate(squared_fibonacci_primes):
    if i >= 10:
        break
    print(f"{i+1}: {prime_square}")

# Demonstrate takewhile and dropwhile
numbers = range(1, 101)
small_numbers = itertools.takewhile(lambda x: x < 50, numbers)
large_numbers = itertools.dropwhile(lambda x: x < 50, numbers)

print("\\nFirst 5 small numbers:", list(itertools.islice(small_numbers, 5)))
print("First 5 large numbers:", list(itertools.islice(large_numbers, 5)))`
    }
  ];

  const handleChallengeComplete = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
    }

    if (completedChallenges.length + 1 >= 2) {
      onComplete();
    }
  };

  const loadChallenge = (challenge: any) => {
    setCurrentCode(challenge.template);
  };

  const loadExample = (example: any) => {
    setCurrentCode(example.code);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-amber-800">Master Circula&apos;s Iteration Mastery Arena</CardTitle>
              <CardDescription className="text-amber-600">
                Apply all your loop and iteration knowledge in practical challenges
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Arena Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{completedChallenges.length}</div>
              <div className="text-sm text-blue-700">Challenges Completed</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{examples.length}</div>
              <div className="text-sm text-green-700">Examples Available</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((completedChallenges.length / challenges.length) * 100)}%
              </div>
              <div className="text-sm text-purple-700">Mastery Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge/Example Selector */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span>Practice Arena</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="challenges" className="mt-4 space-y-3">
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${completedChallenges.includes(challenge.id)
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    onClick={() => loadChallenge(challenge)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{challenge.title}</h4>
                      <Badge
                        className={
                          challenge.difficulty === 'Easy' ? 'bg-green-500' :
                            challenge.difficulty === 'Medium' ? 'bg-yellow-500' :
                              challenge.difficulty === 'Hard' ? 'bg-orange-500' : 'bg-red-500'
                        }
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                    {completedChallenges.includes(challenge.id) && (
                      <div className="flex items-center space-x-1 text-green-600 text-xs">
                        <span>✅</span>
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="examples" className="mt-4 space-y-3">
                {examples.map((example) => (
                  <div
                    key={example.id}
                    className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all"
                    onClick={() => loadExample(example)}
                  >
                    <h4 className="font-semibold text-sm mb-2">{example.title}</h4>
                    <div className="flex items-center space-x-1 text-purple-600 text-xs">
                      <Play className="w-3 h-3" />
                      <span>Load Example</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <Button
                onClick={() => setCurrentCode('')}
                variant="outline"
                className="w-full"
              >
                Clear Editor
              </Button>
              {challenges.map((challenge) => (
                <Button
                  key={`solution-${challenge.id}`}
                  onClick={() => setCurrentCode(challenge.solution)}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Show {challenge.title} Solution
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card className="lg:col-span-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🪄</span>
              <span>Spell Crafting Workshop</span>
            </CardTitle>
            <CardDescription>
              Write and test your iteration mastery code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CodeEditor
                code={currentCode}
                onCodeChange={setCurrentCode}
                onRun={() => {
                  // Simulate code execution
                  console.log('Executing code:', currentCode);
                }}
                onReset={() => setCurrentCode('')}
              />

              <div className="flex space-x-2">
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => {
                    // Simulate code execution
                    console.log('Executing code:', currentCode);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute Spell
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Mark as completed for demo
                    const activeChallenge = challenges.find(c => currentCode.includes(c.template.split('\\n')[0]));
                    if (activeChallenge) {
                      handleChallengeComplete(activeChallenge.id);
                    }
                  }}
                >
                  Mark Complete
                </Button>
              </div>

              {/* Output Area */}
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-24">
                <div className="text-gray-500"># Spell execution output will appear here...</div>
                {currentCode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-blue-300"
                  >
                    # Code loaded successfully! Press "Execute Spell" to run.
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Master Progress */}
      {completedChallenges.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="border-gold bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-800">
                🏆 Iteration Mastery Achieved!
              </CardTitle>
              <CardDescription className="text-amber-600">
                Master Circula is proud of your progress. You have mastered the art of iteration!
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
