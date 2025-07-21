"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Users, GraduationCap, ChevronRight, ChevronDown, Navigation } from 'lucide-react';

interface StudentRecord {
  level: number;
  specialization: string;
  score: number;
  house?: string;
}

interface TeacherRecord {
  subject: string;
  experience: number;
  rank: string;
}

interface AcademyData {
  students: Record<string, StudentRecord>;
  teachers: Record<string, TeacherRecord>;
  courses?: Record<string, { instructor: string; students: string[]; credits: number }>;
}

interface Lesson3NestedDictProps {
  onComplete: () => void;
}

export function Lesson3NestedDict({ onComplete }: Lesson3NestedDictProps) {
  const [academy, setAcademy] = useState<AcademyData>({
    students: {
      alice: { level: 5, specialization: "fire", score: 95, house: "phoenix" },
      bob: { level: 3, specialization: "water", score: 87, house: "kraken" },
      charlie: { level: 4, specialization: "earth", score: 91, house: "dragon" },
      diana: { level: 2, specialization: "air", score: 89, house: "griffin" }
    },
    teachers: {
      merlin: { subject: "advanced_magic", experience: 50, rank: "archmage" },
      gandalf: { subject: "illusion", experience: 45, rank: "grandmaster" },
      dumbledore: { subject: "transfiguration", experience: 60, rank: "supreme_wizard" }
    },
    courses: {
      "fire_magic_101": { instructor: "merlin", students: ["alice", "charlie"], credits: 3 },
      "water_mastery": { instructor: "gandalf", students: ["bob", "diana"], credits: 4 },
      "elemental_theory": { instructor: "dumbledore", students: ["alice", "bob", "charlie"], credits: 2 }
    }
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    students: true,
    teachers: false,
    courses: false
  });
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [pathResult, setPathResult] = useState<any>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigateToPath = (path: string[]) => {
    setSelectedPath(path);
    setBreadcrumb(path);

    try {
      let result = academy;
      for (const segment of path) {
        result = result[segment as keyof typeof result] as any;
      }
      setPathResult(result);

      if (!completedTasks.includes('navigate_path')) {
        setCompletedTasks(prev => [...prev, 'navigate_path']);
      }
    } catch (error) {
      setPathResult(null);
    }
  };

  const addNewStudent = () => {
    if (newStudentName) {
      const studentKey = newStudentName.toLowerCase().replace(/\\s+/g, '_');
      setAcademy(prev => ({
        ...prev,
        students: {
          ...prev.students,
          [studentKey]: {
            level: 1,
            specialization: "arcane",
            score: 75,
            house: "novice"
          }
        }
      }));
      setNewStudentName('');

      if (!completedTasks.includes('add_nested_record')) {
        setCompletedTasks(prev => [...prev, 'add_nested_record']);
      }
    }
  };

  const upgradeStudent = (studentName: string) => {
    setAcademy(prev => ({
      ...prev,
      students: {
        ...prev.students,
        [studentName]: {
          ...prev.students[studentName],
          level: prev.students[studentName].level + 1,
          score: Math.min(100, prev.students[studentName].score + 5)
        }
      }
    }));

    if (!completedTasks.includes('modify_nested_value')) {
      setCompletedTasks(prev => [...prev, 'modify_nested_value']);
    }
  };

  const iterateAllRecords = () => {
    const allRecords: any[] = [];

    Object.entries(academy).forEach(([deptName, deptData]) => {
      if (typeof deptData === 'object' && deptData !== null) {
        Object.entries(deptData).forEach(([personName, personInfo]) => {
          allRecords.push({
            department: deptName,
            name: personName,
            data: personInfo
          });
        });
      }
    });

    console.log('All Academy Records:', allRecords);

    if (!completedTasks.includes('iterate_nested')) {
      setCompletedTasks(prev => [...prev, 'iterate_nested']);
    }
  };

  const getSpecializationColor = (spec: string) => {
    switch (spec) {
      case 'fire': return 'bg-red-100 text-red-800 border-red-200';
      case 'water': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'earth': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'air': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'arcane': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHouseColor = (house: string) => {
    switch (house) {
      case 'phoenix': return 'bg-red-200 text-red-900';
      case 'kraken': return 'bg-blue-200 text-blue-900';
      case 'dragon': return 'bg-green-200 text-green-900';
      case 'griffin': return 'bg-yellow-200 text-yellow-900';
      default: return 'bg-gray-200 text-gray-900';
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'supreme_wizard': return 'bg-purple-200 text-purple-900';
      case 'archmage': return 'bg-indigo-200 text-indigo-900';
      case 'grandmaster': return 'bg-blue-200 text-blue-900';
      default: return 'bg-gray-200 text-gray-900';
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
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-amber-800">Lesson 3: Multi-Dimensional Spell Books</CardTitle>
              <CardDescription className="text-amber-600">
                Master nested dictionaries and complex magical academy data structures
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span>Academy Management Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-3 rounded-lg border ${completedTasks.includes('navigate_path') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('navigate_path') ? '✅' : '🧭'}
                <span className="font-medium">Navigate nested paths</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('add_nested_record') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('add_nested_record') ? '✅' : '➕'}
                <span className="font-medium">Add nested records</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('modify_nested_value') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('modify_nested_value') ? '✅' : '✏️'}
                <span className="font-medium">Modify nested values</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${completedTasks.includes('iterate_nested') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                {completedTasks.includes('iterate_nested') ? '✅' : '🔄'}
                <span className="font-medium">Iterate nested structures</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breadcrumb Navigation */}
      {breadcrumb.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Current Path:</span>
              <div className="flex items-center space-x-1">
                <span className="text-sm bg-white px-2 py-1 rounded border">academy</span>
                {breadcrumb.map((segment, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight className="w-3 h-3 text-indigo-400" />
                    <span className="text-sm bg-white px-2 py-1 rounded border">{segment}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {pathResult && (
              <div className="mt-3 p-3 bg-white rounded border">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(pathResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academy Structure */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🏰</span>
              <span>Magical Academy Structure</span>
            </CardTitle>
            <CardDescription>
              Explore the nested departments and records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Students Department */}
              <div className="border border-blue-200 rounded-lg">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-50"
                  onClick={() => toggleSection('students')}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Students</span>
                    <Badge variant="outline">{Object.keys(academy.students).length}</Badge>
                  </div>
                  {expandedSections.students ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>

                <AnimatePresence>
                  {expandedSections.students && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-blue-200"
                    >
                      <div className="p-3 space-y-2">
                        {Object.entries(academy.students).map(([name, data]) => (
                          <div
                            key={name}
                            className="p-3 bg-blue-50 rounded border border-blue-200 cursor-pointer hover:bg-blue-100"
                            onClick={() => navigateToPath(['students', name])}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium capitalize">{name}</div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getSpecializationColor(data.specialization)}>
                                    {data.specialization}
                                  </Badge>
                                  <Badge className={getHouseColor(data.house || '')}>
                                    {data.house}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">Lv.{data.level}</div>
                                <div className="text-sm text-gray-600">{data.score}%</div>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    upgradeStudent(name);
                                  }}
                                  className="mt-1"
                                >
                                  Upgrade
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Teachers Department */}
              <div className="border border-purple-200 rounded-lg">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-purple-50"
                  onClick={() => toggleSection('teachers')}
                >
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Teachers</span>
                    <Badge variant="outline">{Object.keys(academy.teachers).length}</Badge>
                  </div>
                  {expandedSections.teachers ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>

                <AnimatePresence>
                  {expandedSections.teachers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-purple-200"
                    >
                      <div className="p-3 space-y-2">
                        {Object.entries(academy.teachers).map(([name, data]) => (
                          <div
                            key={name}
                            className="p-3 bg-purple-50 rounded border border-purple-200 cursor-pointer hover:bg-purple-100"
                            onClick={() => navigateToPath(['teachers', name])}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium capitalize">{name}</div>
                                <div className="text-sm text-gray-600 capitalize">{data.subject.replace('_', ' ')}</div>
                                <Badge className={getRankColor(data.rank)}>
                                  {data.rank.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-purple-600">{data.experience}y</div>
                                <div className="text-sm text-gray-600">Experience</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Courses Department */}
              {academy.courses && (
                <div className="border border-green-200 rounded-lg">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-green-50"
                    onClick={() => toggleSection('courses')}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📚</span>
                      <span className="font-semibold text-green-800">Courses</span>
                      <Badge variant="outline">{Object.keys(academy.courses).length}</Badge>
                    </div>
                    {expandedSections.courses ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>

                  <AnimatePresence>
                    {expandedSections.courses && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-green-200"
                      >
                        <div className="p-3 space-y-2">
                          {Object.entries(academy.courses).map(([course, data]) => (
                            <div
                              key={course}
                              className="p-3 bg-green-50 rounded border border-green-200 cursor-pointer hover:bg-green-100"
                              onClick={() => navigateToPath(['courses', course])}
                            >
                              <div className="font-medium">{course.replace('_', ' ').toUpperCase()}</div>
                              <div className="text-sm text-gray-600">
                                Instructor: {data.instructor} • Students: {data.students.length} • Credits: {data.credits}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Operations Panel */}
        <div className="space-y-6">
          {/* Add New Student */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">➕</span>
                <span>Enroll New Student</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Student name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
              <Button onClick={addNewStudent} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                Enroll in Academy
              </Button>
            </CardContent>
          </Card>

          {/* Path Explorer */}
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-indigo-500" />
                <span>Path Explorer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => navigateToPath(['students'])} variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                All Students
              </Button>
              <Button onClick={() => navigateToPath(['teachers'])} variant="outline" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                All Teachers
              </Button>
              <Button onClick={() => navigateToPath(['students', 'alice'])} variant="outline" className="w-full justify-start">
                <span className="mr-2">👤</span>
                Alice's Record
              </Button>
              <Button onClick={() => navigateToPath(['students', 'alice', 'level'])} variant="outline" className="w-full justify-start">
                <span className="mr-2">📊</span>
                Alice's Level
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Operations */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🔄</span>
                <span>Advanced Operations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={iterateAllRecords} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Iterate All Records
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Check console for iteration results
              </p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Academy Mastery Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span>{completedTasks.length} / 4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
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
                    🎉 Nested dictionary mastery achieved! Object creation awaits!
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
