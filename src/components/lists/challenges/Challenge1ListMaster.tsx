"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Thermometer,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Code,
  Trophy,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { SubChallenge, TestCase, ChallengeSession } from '@/types/challenges';
import { CodeEditor } from '@/components/CodeEditor';

interface Challenge1Props {
  session?: ChallengeSession;
  setSession?: (session: ChallengeSession | ((prev: ChallengeSession) => ChallengeSession)) => void;
  onHint?: (level: number) => void;
  onComplete?: (results: any[]) => void;
  setScore?: (score: number | ((prev: number) => number)) => void;
  maxPossibleScore?: number;
}

const subChallenges: SubChallenge[] = [
  {
    id: 'student-database',
    title: 'Pembangun Database Siswa',
    description: 'Buat sistem catatan siswa dengan nama, umur, dan nilai',
    difficulty: 'beginner',
    maxScore: 300,
    starterCode: `# Buat list catatan siswa
# Setiap siswa harus memiliki: nama (string), umur (int), nilai (float)
# Contoh: ["Alice", 20, 85.5]

students = []

# Tambahkan tepat 5 siswa ke dalam list
# Siswa 1: Alice, umur 20, nilai 85.5
# Siswa 2: Bob, umur 19, nilai 92.0
# Siswa 3: Charlie, umur 21, nilai 78.3
# Siswa 4: Diana, umur 20, nilai 95.7
# Siswa 5: Eve, umur 22, nilai 88.1

# Kode Anda di sini:`,
    testCases: [
      {
        input: null,
        expectedOutput: [
          ["Alice", 20, 85.5],
          ["Bob", 19, 92.0],
          ["Charlie", 21, 78.3],
          ["Diana", 20, 95.7],
          ["Eve", 22, 88.1]
        ],
        description: 'Harus membuat tepat 5 catatan siswa dengan tipe data yang benar',
        points: 200
      },
      {
        input: null,
        expectedOutput: 5,
        description: 'Harus memiliki tepat 5 siswa',
        points: 50
      },
      {
        input: null,
        expectedOutput: true,
        description: 'Semua catatan siswa harus memiliki format yang benar [string, int, float]',
        points: 50
      }
    ],
    hints: [
      {
        level: 1,
        type: 'conceptual',
        content: 'A list can contain other lists as elements. Each student record is a list with 3 elements.',
        penaltyPercent: 5
      },
      {
        level: 2,
        type: 'methodological',
        content: 'Use the append() method to add each student record to the students list.',
        penaltyPercent: 10
      },
      {
        level: 3,
        type: 'implementation',
        content: 'students.append(["Alice", 20, 85.5]) - This adds one student record.',
        penaltyPercent: 20
      },
      {
        level: 4,
        type: 'solution',
        content: 'students.append(["Alice", 20, 85.5])\nstudents.append(["Bob", 19, 92.0])\n...',
        penaltyPercent: 40
      }
    ]
  },
  {
    id: 'temperature-data',
    title: 'Scientific Data Collection',
    description: 'Build temperature readings for a weather station',
    difficulty: 'intermediate',
    maxScore: 400,
    starterCode: `# Create a list of temperature readings (floats)
# Requirements:
# - Exactly 10 temperature values
# - All values between -10.0 and 40.0
# - Sorted in ascending order
# - No duplicate values

temperatures = []

# Temperature readings: 
# -5.2, 0.0, 3.7, 8.1, 12.5, 18.3, 22.9, 28.4, 32.1, 37.8

# Your code here:`,
    testCases: [
      {
        input: null,
        expectedOutput: [-5.2, 0.0, 3.7, 8.1, 12.5, 18.3, 22.9, 28.4, 32.1, 37.8],
        description: 'Should create sorted temperature list with specified values',
        points: 250
      },
      {
        input: null,
        expectedOutput: 10,
        description: 'Should have exactly 10 temperature readings',
        points: 75
      },
      {
        input: null,
        expectedOutput: true,
        description: 'All values should be floats between -10.0 and 40.0',
        points: 75
      }
    ],
    hints: [
      {
        level: 1,
        type: 'conceptual',
        content: 'Temperature readings are decimal numbers (floats). They need to be in order.',
        penaltyPercent: 5
      },
      {
        level: 2,
        type: 'methodological',
        content: 'You can create the list directly with all values, or add them one by one and sort.',
        penaltyPercent: 10
      },
      {
        level: 3,
        type: 'implementation',
        content: 'temperatures = [-5.2, 0.0, 3.7, ...] or use append() then sort()',
        penaltyPercent: 20
      },
      {
        level: 4,
        type: 'solution',
        content: 'temperatures = [-5.2, 0.0, 3.7, 8.1, 12.5, 18.3, 22.9, 28.4, 32.1, 37.8]',
        penaltyPercent: 40
      }
    ]
  },
  {
    id: 'ecommerce-inventory',
    title: 'E-commerce Inventory',
    description: 'Build a multi-dimensional product catalog',
    difficulty: 'advanced',
    maxScore: 500,
    starterCode: `# Create a nested list structure for product inventory
# Each product: [id, name, price, category, stock]
# Categories: "Electronics", "Books", "Clothing"

inventory = []

# Add these products:
# 1. ID: 101, Name: "Laptop", Price: 999.99, Category: "Electronics", Stock: 15
# 2. ID: 102, Name: "Python Guide", Price: 29.99, Category: "Books", Stock: 50
# 3. ID: 103, Name: "T-Shirt", Price: 19.99, Category: "Clothing", Stock: 100
# 4. ID: 104, Name: "Smartphone", Price: 699.99, Category: "Electronics", Stock: 25
# 5. ID: 105, Name: "Jeans", Price: 79.99, Category: "Clothing", Stock: 75

# Your code here:`,
    testCases: [
      {
        input: null,
        expectedOutput: [
          [101, "Laptop", 999.99, "Electronics", 15],
          [102, "Python Guide", 29.99, "Books", 50],
          [103, "T-Shirt", 19.99, "Clothing", 100],
          [104, "Smartphone", 699.99, "Electronics", 25],
          [105, "Jeans", 79.99, "Clothing", 75]
        ],
        description: 'Should create complete product inventory with correct structure',
        points: 300
      },
      {
        input: null,
        expectedOutput: 5,
        description: 'Should have exactly 5 products',
        points: 100
      },
      {
        input: null,
        expectedOutput: true,
        description: 'All products should have format [int, string, float, string, int]',
        points: 100
      }
    ],
    hints: [
      {
        level: 1,
        type: 'conceptual',
        content: 'Each product is a list containing 5 different data types: int, string, float, string, int.',
        penaltyPercent: 5
      },
      {
        level: 2,
        type: 'methodological',
        content: 'Create each product as a list, then append it to the inventory list.',
        penaltyPercent: 10
      },
      {
        level: 3,
        type: 'implementation',
        content: 'inventory.append([101, "Laptop", 999.99, "Electronics", 15])',
        penaltyPercent: 20
      },
      {
        level: 4,
        type: 'solution',
        content: 'Create all 5 product lists and append each to inventory using the exact values given.',
        penaltyPercent: 40
      }
    ]
  }
];

export function Challenge1ListMaster({
  session,
  setSession,
  onHint,
  onComplete,
  setScore,
  maxPossibleScore
}: Challenge1Props) {
  const [currentSubChallenge, setCurrentSubChallenge] = useState(0);
  const [code, setCode] = useState(subChallenges[0].starterCode || '');
  const [results, setResults] = useState<any[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<Set<number>>(new Set());

  const challenge = subChallenges[currentSubChallenge];

  useEffect(() => {
    setCode(challenge.starterCode || '');
    setShowHints(false);
    setUsedHints(new Set());
  }, [currentSubChallenge, challenge]);

  const executeCode = (userCode: string) => {
    try {
      // Simple validation for the student database challenge
      if (challenge.id === 'student-database') {
        const studentsMatch = userCode.match(/students\s*=\s*\[(.*?)\]/);
        if (!studentsMatch) {
          return { error: 'Could not find students list assignment' };
        }

        // Simulate evaluation
        const expectedStudents = [
          ["Alice", 20, 85.5],
          ["Bob", 19, 92.0],
          ["Charlie", 21, 78.3],
          ["Diana", 20, 95.7],
          ["Eve", 22, 88.1]
        ];

        // Check if code contains expected patterns
        const hasAllStudents = expectedStudents.every(student =>
          userCode.includes(String(student[0])) &&
          userCode.includes(String(student[1])) &&
          userCode.includes(String(student[2]))
        );

        if (hasAllStudents) {
          return { result: expectedStudents };
        } else {
          return { error: 'Student data does not match expected values' };
        }
      }

      // Similar validation for other challenges...
      if (challenge.id === 'temperature-data') {
        const expectedTemps = [-5.2, 0.0, 3.7, 8.1, 12.5, 18.3, 22.9, 28.4, 32.1, 37.8];
        const hasAllTemps = expectedTemps.every(temp => userCode.includes(temp.toString()));

        if (hasAllTemps) {
          return { result: expectedTemps };
        } else {
          return { error: 'Temperature data does not match expected values' };
        }
      }

      if (challenge.id === 'ecommerce-inventory') {
        const expectedProducts = [
          [101, "Laptop", 999.99, "Electronics", 15],
          [102, "Python Guide", 29.99, "Books", 50],
          [103, "T-Shirt", 19.99, "Clothing", 100],
          [104, "Smartphone", 699.99, "Electronics", 25],
          [105, "Jeans", 79.99, "Clothing", 75]
        ];

        const hasAllProducts = expectedProducts.every(product =>
          userCode.includes(String(product[0])) &&
          userCode.includes(String(product[1])) &&
          userCode.includes(String(product[2]))
        );

        if (hasAllProducts) {
          return { result: expectedProducts };
        } else {
          return { error: 'Product data does not match expected values' };
        }
      }

      return { error: 'Could not validate code' };
    } catch (error) {
      return { error: `Error: ${error}` };
    }
  };

  const runCode = () => {
    const execution = executeCode(code);

    if (execution.error) {
      toast.error(execution.error, {
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    // Validate against test cases
    const testResults = challenge.testCases.map(testCase => {
      const passed = JSON.stringify(execution.result) === JSON.stringify(testCase.expectedOutput);
      return {
        description: testCase.description,
        passed,
        points: passed ? testCase.points : 0,
        maxPoints: testCase.points
      };
    });

    const totalScore = testResults.reduce((sum, result) => sum + result.points, 0);
    const maxScore = testResults.reduce((sum, result) => sum + result.maxPoints, 0);

    // Update score
    if (setScore) {
      setScore((prevScore: number) => prevScore + totalScore);
    }

    // Update session
    if (setSession && session) {
      setSession(prev => ({
        ...prev,
        solutions: { ...prev.solutions, [challenge.id]: code },
        progress: { ...prev.progress, [challenge.id]: totalScore === maxScore }
      }));
    }

    setResults(testResults);

    if (totalScore === maxScore) {
      toast.success(`Sub-challenge completed! +${totalScore} points`, {
        icon: <Trophy className="w-4 h-4" />
      });
    } else {
      toast.warning(`Partial success: ${totalScore}/${maxScore} points`, {
        icon: <Star className="w-4 h-4" />
      });
    }
  };

  const resetCode = () => {
    setCode(challenge.starterCode || '');
    setResults([]);
  };

  const handleHint = (level: number) => {
    if (usedHints.has(level)) return;

    setUsedHints(prev => new Set(prev).add(level));
    if (onHint) {
      onHint(level);
    }

    const hint = challenge.hints[level - 1];
    toast.info(hint.content, {
      icon: <Lightbulb className="w-4 h-4" />,
      duration: 5000
    });
  };

  const nextSubChallenge = () => {
    if (currentSubChallenge < subChallenges.length - 1) {
      setCurrentSubChallenge(prev => prev + 1);
      setResults([]);
    } else {
      // Complete the challenge
      if (onComplete) {
        onComplete(results);
      }
    }
  };

  const getSubChallengeIcon = (id: string) => {
    switch (id) {
      case 'student-database': return <Users className="w-5 h-5" />;
      case 'temperature-data': return <Thermometer className="w-5 h-5" />;
      case 'ecommerce-inventory': return <ShoppingCart className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Sub-challenge Navigation */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSubChallengeIcon(challenge.id)}
              <div>
                <CardTitle className="text-xl">
                  {challenge.title}
                </CardTitle>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {currentSubChallenge + 1} of {subChallenges.length}
            </Badge>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-4">
            {subChallenges.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${index < currentSubChallenge ? 'bg-green-500' :
                  index === currentSubChallenge ? 'bg-blue-500' :
                    'bg-gray-200'
                  }`}
              />
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Main Challenge Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Python Code Editor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              onRun={runCode}
              onReset={resetCode}
            />
          </CardContent>
        </Card>

        {/* Results and Hints Panel */}
        <Card className="border-2">
          <CardHeader>
            <Tabs defaultValue="results">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Test Results</TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="mt-4 space-y-4">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Run your code to see test results</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border-2 ${result.passed
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium">
                            Test {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {result.description}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span>Points:</span>
                          <span className="font-medium">
                            {result.points}/{result.maxPoints}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {results.every(r => r.passed) && (
                      <Button onClick={nextSubChallenge} className="w-full mt-4">
                        {currentSubChallenge === subChallenges.length - 1 ? (
                          <>
                            <Trophy className="w-4 h-4 mr-2" />
                            Complete Challenge
                          </>
                        ) : (
                          'Next Sub-challenge'
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="hints" className="mt-4 space-y-3">
                {challenge.hints.map((hint, index) => (
                  <Card
                    key={index}
                    className={`border transition-all duration-200 ${usedHints.has(index + 1) ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Hint {index + 1} • {hint.type}
                        </Badge>
                        <span className="text-xs text-red-600">
                          -{hint.penaltyPercent}% penalty
                        </span>
                      </div>

                      {usedHints.has(index + 1) ? (
                        <p className="text-sm text-gray-700">{hint.content}</p>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleHint(index + 1)}
                          className="w-full"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Reveal Hint {index + 1}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
