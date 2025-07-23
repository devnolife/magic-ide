"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FolderTree, ArrowDown, Plus, Search, Lightbulb } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface NestedDictionaryProps {
  onComplete: () => void;
}

interface ClassData {
  students: Record<string, {
    name: string;
    grades: Record<string, number>;
    info: {
      age: number;
      email: string;
    };
  }>;
  teacher: {
    name: string;
    subjects: string[];
  };
}

export function NestedDictionary({ onComplete }: NestedDictionaryProps) {
  const [currentDemo, setCurrentDemo] = useState<'concept' | 'access' | 'modify' | 'complete'>('concept');
  const [classData, setClassData] = useState<ClassData>({
    students: {
      alice: {
        name: 'Alice Johnson',
        grades: { math: 95, science: 88, english: 92 },
        info: { age: 20, email: 'alice@school.edu' }
      },
      bob: {
        name: 'Bob Smith',
        grades: { math: 78, science: 85, english: 90 },
        info: { age: 19, email: 'bob@school.edu' }
      }
    },
    teacher: {
      name: 'Dr. Wilson',
      subjects: ['Mathematics', 'Physics']
    }
  });

  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [pathResult, setPathResult] = useState<any>(null);
  const [newGrade, setNewGrade] = useState({ student: '', subject: '', grade: '' });
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  useEffect(() => {
    if (completedTasks.length >= 3) {
      setCurrentDemo('complete');
      onComplete();
    }
  }, [completedTasks, onComplete]);

  const navigateToPath = (path: string[]) => {
    setSelectedPath(path);
    setHighlightedPath(path);

    try {
      let result: any = classData;
      for (const segment of path) {
        result = result[segment];
      }
      setPathResult(result);

      if (!completedTasks.includes('navigate_nested')) {
        setCompletedTasks(prev => [...prev, 'navigate_nested']);
      }
    } catch (error) {
      setPathResult('Path not found');
    }

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedPath([]);
    }, 3000);
  };

  const addGrade = () => {
    if (newGrade.student && newGrade.subject && newGrade.grade) {
      setClassData(prev => ({
        ...prev,
        students: {
          ...prev.students,
          [newGrade.student]: {
            ...prev.students[newGrade.student],
            grades: {
              ...prev.students[newGrade.student].grades,
              [newGrade.subject]: parseInt(newGrade.grade)
            }
          }
        }
      }));

      setNewGrade({ student: '', subject: '', grade: '' });

      if (!completedTasks.includes('modify_nested')) {
        setCompletedTasks(prev => [...prev, 'modify_nested']);
      }
    }
  };

  const understandConcept = () => {
    if (!completedTasks.includes('understand_nested')) {
      setCompletedTasks(prev => [...prev, 'understand_nested']);
    }
  };

  const isPathHighlighted = (path: string[]) => {
    return path.length <= highlightedPath.length &&
      path.every((segment, index) => segment === highlightedPath[index]);
  };

  const ConceptDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FolderTree className="w-6 h-6 text-blue-500" />
        Understanding Nested Dictionaries
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Think of it like a filing cabinet:</h4>
          <div className="space-y-3">
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="font-semibold text-blue-800 mb-2">📁 Class Folder</div>
              <div className="ml-4 space-y-2">
                <div className="border border-green-200 rounded p-2 bg-green-50">
                  <div className="font-medium text-green-800">📁 Students</div>
                  <div className="ml-4 mt-1 space-y-1">
                    <div className="text-sm">📄 Alice → Name, Grades, Info</div>
                    <div className="text-sm">📄 Bob → Name, Grades, Info</div>
                  </div>
                </div>
                <div className="border border-purple-200 rounded p-2 bg-purple-50">
                  <div className="font-medium text-purple-800">📁 Teacher</div>
                  <div className="ml-4 mt-1">
                    <div className="text-sm">📄 Name, Subjects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={understandConcept} className="mt-4 w-full">
            I understand the structure!
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-3">In Python code:</h4>
          <div className={styles.codeExample}>
            <div className="text-gray-400"># Nested dictionary structure</div>
            <div>class_data = {'{'}</div>
            <div className="ml-2">
              <div><span className="text-blue-400">"students"</span>: {'{'}</div>
              <div className="ml-2">
                <div><span className="text-green-400">"alice"</span>: {'{'}</div>
                <div className="ml-2">
                  <div><span className="text-yellow-400">"name"</span>: <span className="text-orange-400">"Alice Johnson"</span>,</div>
                  <div><span className="text-yellow-400">"grades"</span>: {'{'}</div>
                  <div className="ml-2">
                    <div><span className="text-pink-400">"math"</span>: <span className="text-cyan-400">95</span>,</div>
                    <div><span className="text-pink-400">"science"</span>: <span className="text-cyan-400">88</span></div>
                  </div>
                  <div>{'}'}</div>
                </div>
                <div>{'}'}</div>
              </div>
              <div>{'}'}</div>
            </div>
            <div>{'}'}</div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-sm text-amber-800">
              <strong>Key Insight:</strong> Each value in a dictionary can itself be another dictionary,
              creating layers of organization!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AccessDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-6 h-6 text-green-500" />
        Accessing Nested Data
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Click to navigate through the data:</h4>

          {/* Visual Navigation Tree */}
          <div className="space-y-2">
            <div
              className={`p-3 border rounded-lg cursor-pointer transition-all ${isPathHighlighted([]) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
                }`}
              onClick={() => navigateToPath([])}
            >
              <div className="font-semibold">🏫 class_data</div>
            </div>

            <div className="ml-4 space-y-2">
              <div
                className={`p-2 border rounded cursor-pointer transition-all ${isPathHighlighted(['students']) ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'
                  }`}
                onClick={() => navigateToPath(['students'])}
              >
                <div className="font-medium">👥 students</div>
              </div>

              <div className="ml-4 space-y-1">
                <div
                  className={`p-2 border rounded cursor-pointer transition-all text-sm ${isPathHighlighted(['students', 'alice']) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'
                    }`}
                  onClick={() => navigateToPath(['students', 'alice'])}
                >
                  👩 alice
                </div>

                <div className="ml-4 space-y-1">
                  <div
                    className={`p-1 border rounded cursor-pointer transition-all text-xs ${isPathHighlighted(['students', 'alice', 'name']) ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    onClick={() => navigateToPath(['students', 'alice', 'name'])}
                  >
                    📝 name
                  </div>
                  <div
                    className={`p-1 border rounded cursor-pointer transition-all text-xs ${isPathHighlighted(['students', 'alice', 'grades']) ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    onClick={() => navigateToPath(['students', 'alice', 'grades'])}
                  >
                    📊 grades
                  </div>
                  <div
                    className={`p-1 border rounded cursor-pointer transition-all text-xs ${isPathHighlighted(['students', 'alice', 'grades', 'math']) ? 'bg-pink-100 border-pink-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    onClick={() => navigateToPath(['students', 'alice', 'grades', 'math'])}
                  >
                    🔢 math
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-4">
              <div
                className={`p-2 border rounded cursor-pointer transition-all ${isPathHighlighted(['teacher']) ? 'bg-orange-100 border-orange-300' : 'bg-gray-50 border-gray-200'
                  }`}
                onClick={() => navigateToPath(['teacher'])}
              >
                <div className="font-medium">👨‍🏫 teacher</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Access Result:</h4>

          {selectedPath.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Path:</div>
              <div className={styles.codeExample}>
                class_data{selectedPath.map(segment => `["${segment}"]`).join('')}
              </div>
            </div>
          )}

          <div className={styles.visualOutput}>
            {pathResult !== null ? (
              <div className="p-4">
                <div className="font-semibold mb-2">Result:</div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  {typeof pathResult === 'object' ? (
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(pathResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="font-mono text-green-800">{String(pathResult)}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Click on any item above to see its value
              </div>
            )}
          </div>

          {pathResult !== null && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Code Pattern:</strong> Use multiple square brackets to go deeper:
                <br /><code>dict[key1][key2][key3]</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ModifyDemo = () => (
    <div className={styles.conceptDemo}>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plus className="w-6 h-6 text-purple-500" />
        Modifying Nested Data
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Add a new grade for a student:</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student:</label>
              <select
                value={newGrade.student}
                onChange={(e) => setNewGrade(prev => ({ ...prev, student: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                aria-label="Select student"
              >
                <option value="">Select a student</option>
                {Object.keys(classData.students).map(studentId => (
                  <option key={studentId} value={studentId}>
                    {classData.students[studentId].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject:</label>
              <input
                type="text"
                value={newGrade.subject}
                onChange={(e) => setNewGrade(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., history"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grade (0-100):</label>
              <input
                type="number"
                value={newGrade.grade}
                onChange={(e) => setNewGrade(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="85"
                min="0"
                max="100"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <Button
              onClick={addGrade}
              className="w-full"
              disabled={!newGrade.student || !newGrade.subject || !newGrade.grade}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Grade
            </Button>
          </div>

          {newGrade.student && newGrade.subject && (
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Code:</strong> class_data["students"]["{newGrade.student}"]["grades"]["{newGrade.subject}"] = {newGrade.grade || 0}
              </p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-3">Current Student Grades:</h4>
          <div className={styles.visualOutput}>
            <div className="space-y-4">
              {Object.entries(classData.students).map(([studentId, student]) => (
                <div key={studentId} className="border border-gray-200 rounded-lg p-3">
                  <div className="font-semibold text-blue-800 mb-2">{student.name}</div>
                  <div className="space-y-1">
                    {Object.entries(student.grades).map(([subject, grade]) => (
                      <div key={subject} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{subject}:</span>
                        <Badge variant="outline" className={
                          grade >= 90 ? 'bg-green-100 text-green-800' :
                            grade >= 80 ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                        }>
                          {grade}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CompletionDemo = () => (
    <div className={styles.conceptDemo}>
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-800 mb-2">Fantastic Progress!</h3>
        <p className="text-green-700 mb-6">
          You've mastered nested dictionaries! You can now handle complex data structures like:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <FolderTree className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">Complex Structures</p>
            <p className="text-sm text-gray-600">Dictionaries within dictionaries</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-green-200">
            <Search className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">Deep Access</p>
            <p className="text-sm text-gray-600">Navigate through multiple levels</p>
          </div>
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <Plus className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="font-semibold">Data Modification</p>
            <p className="text-sm text-gray-600">Update nested information</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="text-amber-800 font-semibold">Real-World Applications:</p>
          <p className="text-amber-700 text-sm">
            JSON APIs, database records, user profiles, game data, configuration files, and more!
          </p>
        </div>

        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          ✅ Nested Dictionary Mastery Achieved!
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {['concept', 'access', 'modify', 'complete'].map((step, index) => {
          const isActive = currentDemo === step;
          const isCompleted = ['concept', 'access', 'modify'].indexOf(currentDemo) > index || currentDemo === 'complete';

          return (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < 3 && (
                <div className={`w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Learning Objectives */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Nested Dictionary Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('understand_nested') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Understand nested structure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('navigate_nested') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Navigate deep data paths</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${completedTasks.includes('modify_nested') ? 'text-green-500' : 'text-gray-300'}`} />
              <span>Modify nested values</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <Button
          onClick={() => setCurrentDemo('concept')}
          variant={currentDemo === 'concept' ? 'default' : 'outline'}
          size="sm"
        >
          1. Structure
        </Button>
        <Button
          onClick={() => setCurrentDemo('access')}
          variant={currentDemo === 'access' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('understand_nested')}
        >
          2. Access
        </Button>
        <Button
          onClick={() => setCurrentDemo('modify')}
          variant={currentDemo === 'modify' ? 'default' : 'outline'}
          size="sm"
          disabled={!completedTasks.includes('navigate_nested')}
        >
          3. Modify
        </Button>
      </div>

      {/* Main Content */}
      <div className={styles.slideInUp}>
        {currentDemo === 'concept' && <ConceptDemo />}
        {currentDemo === 'access' && <AccessDemo />}
        {currentDemo === 'modify' && <ModifyDemo />}
        {currentDemo === 'complete' && <CompletionDemo />}
      </div>
    </div>
  );
}
