"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, BookOpen, Target, Lightbulb } from 'lucide-react';
import { BasicDictionary } from './BasicDictionary';
import { DictionaryMethods } from './DictionaryMethods';
import { NestedDictionary } from './NestedDictionary';
import { AdvancedConcepts } from './AdvancedConcepts';
import { PracticePlayground } from './PracticePlayground';
import styles from './SimpleLearning.module.css';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  concepts: string[];
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function SimpleDictionaryLearning() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);

  const learningSteps: LearningStep[] = [
    {
      id: 'basics',
      title: 'What is a Dictionary?',
      description: 'Learn the fundamental concept of dictionaries as key-value pairs, like an address book.',
      duration: '5 minutes',
      concepts: ['Key-Value Pairs', 'Creating Dictionaries', 'Basic Access'],
      icon: '📖',
      difficulty: 'Beginner'
    },
    {
      id: 'methods',
      title: 'Dictionary Tools',
      description: 'Discover useful methods to work with dictionaries: keys(), values(), items(), and more.',
      duration: '10 minutes',
      concepts: ['Dictionary Methods', 'Iteration', 'Data Extraction'],
      icon: '🔧',
      difficulty: 'Beginner'
    },
    {
      id: 'nested',
      title: 'Nested Dictionaries',
      description: 'Explore complex data structures with dictionaries inside dictionaries.',
      duration: '10 minutes',
      concepts: ['Nested Structures', 'Deep Access', 'Complex Data'],
      icon: '🏗️',
      difficulty: 'Intermediate'
    },
    {
      id: 'advanced',
      title: 'Real-World Applications',
      description: 'Apply dictionary concepts to solve practical programming problems.',
      duration: '15 minutes',
      concepts: ['Problem Solving', 'Data Modeling', 'Best Practices'],
      icon: '🚀',
      difficulty: 'Advanced'
    },
    {
      id: 'practice',
      title: 'Practice Playground',
      description: 'Put your knowledge to the test with interactive exercises and projects.',
      duration: 'Unlimited',
      concepts: ['Hands-on Practice', 'Projects', 'Experimentation'],
      icon: '🎮',
      difficulty: 'Intermediate'
    }
  ];

  // Calculate progress percentage
  useEffect(() => {
    const progress = (completedSteps.length / learningSteps.length) * 100;
    setTotalProgress(progress);
  }, [completedSteps.length, learningSteps.length]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const handleNext = () => {
    if (currentStep < learningSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate progress width class
  const getProgressWidthClass = () => {
    if (totalProgress === 0) return 'w-0';
    if (totalProgress <= 20) return 'w-1/5';
    if (totalProgress <= 40) return 'w-2/5';
    if (totalProgress <= 60) return 'w-3/5';
    if (totalProgress <= 80) return 'w-4/5';
    return 'w-full';
  };

  const navigateToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);
  const isStepAccessible = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    return isStepCompleted(learningSteps[stepIndex - 1].id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStepContent = () => {
    const currentStepData = learningSteps[currentStep];
    
    switch (currentStepData.id) {
      case 'basics':
        return <BasicDictionary onComplete={() => handleStepComplete('basics')} />;
      case 'methods':
        return <DictionaryMethods onComplete={() => handleStepComplete('methods')} />;
      case 'nested':
        return <NestedDictionary onComplete={() => handleStepComplete('nested')} />;
      case 'advanced':
        return <AdvancedConcepts onComplete={() => handleStepComplete('advanced')} />;
      case 'practice':
        return <PracticePlayground onComplete={() => handleStepComplete('practice')} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.learningContainer}>
      {/* Header Section */}
      <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-blue-900">
                Python Dictionary Learning
              </CardTitle>
              <p className="text-blue-700 mt-2">
                Master dictionaries step by step with visual learning
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-blue-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(totalProgress)}% Complete</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${getProgressWidthClass()}`}
              />
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {completedSteps.length} of {learningSteps.length} lessons completed
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <Card className="mb-8 border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-6 h-6 text-blue-500" />
            Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {learningSteps.map((step, index) => {
              const isCompleted = isStepCompleted(step.id);
              const isAccessible = isStepAccessible(index);
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  className={`
                    ${styles.stepContainer}
                    ${isCurrent ? styles.active : ''}
                    ${isCompleted ? styles.completed : ''}
                    cursor-pointer transition-all duration-300
                  `}
                  onClick={() => isAccessible && navigateToStep(index)}
                >
                  <div className={styles.stepHeader}>
                    <div className={`
                      ${styles.stepNumber}
                      ${isCompleted ? styles.completed : ''}
                      ${!isAccessible ? styles.inactive : ''}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isAccessible ? (
                        index + 1
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`${styles.stepTitle} text-sm font-semibold`}>
                        {step.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getDifficultyColor(step.difficulty)}>
                          {step.difficulty}
                        </Badge>
                        <span className="text-xs text-gray-500">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-2">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-2 text-center line-clamp-2">
                    {step.description}
                  </p>
                  
                  {!isAccessible && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-16 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">🔒 Complete previous step</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className={`${styles.slideInUp} mb-8`}>
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{learningSteps[currentStep].icon}</span>
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    Step {currentStep + 1}: {learningSteps[currentStep].title}
                  </CardTitle>
                  <p className="text-blue-700 mt-1">
                    {learningSteps[currentStep].description}
                  </p>
                </div>
              </div>
              {isStepCompleted(learningSteps[currentStep].id) && (
                <div className={styles.completionBadge}>
                  <CheckCircle className="w-5 h-5" />
                  Completed!
                </div>
              )}
            </div>
            
            {/* Concepts being learned */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-gray-700">You'll learn:</span>
              {learningSteps[currentStep].concepts.map((concept, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {concept}
                </Badge>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className={styles.navigationControls}>
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {learningSteps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === learningSteps.length - 1}
          className="flex items-center gap-2"
        >
          Next Step
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Encouragement Message */}
      {totalProgress > 0 && totalProgress < 100 && (
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-green-800">
                Great Progress! 🎉
              </span>
            </div>
            <p className="text-green-700">
              You've completed {completedSteps.length} lesson{completedSteps.length !== 1 ? 's' : ''}. 
              Keep going to master Python dictionaries!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completion Celebration */}
      {totalProgress === 100 && (
        <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-2xl font-bold text-orange-900 mb-2">
              Congratulations!
            </h2>
            <p className="text-orange-700 text-lg">
              You've mastered Python dictionaries! You're now ready to use them in real projects.
            </p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              Continue to Advanced Topics
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
