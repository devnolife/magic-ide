"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import styles from './SimpleLearning.module.css';

interface Step {
  title: string;
  content: React.ReactNode;
  interaction?: React.ReactNode;
  completed?: boolean;
}

interface StepByStepGuideProps {
  steps: Step[];
  onComplete?: () => void;
  title?: string;
  description?: string;
}

export function StepByStepGuide({
  steps,
  onComplete,
  title = "Learning Guide",
  description = "Follow these steps to master the concept"
}: StepByStepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (completedSteps.length === steps.length && onComplete) {
      onComplete();
    }
  }, [completedSteps.length, steps.length, onComplete]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const markStepCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) || steps[stepIndex].completed;
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className={styles.learningContainer}>
      {/* Header */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-900">{title}</CardTitle>
          <p className="text-blue-700">{description}</p>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-sm text-blue-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} transition-all duration-300`}
                data-progress={progressPercentage}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {steps.map((_, index) => {
          const isActive = index === currentStep;
          const isCompleted = isStepCompleted(index);

          return (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Step */}
      <Card className="border-2 border-blue-200 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-blue-900">
              Step {currentStep + 1}: {steps[currentStep].title}
            </CardTitle>
            {isStepCompleted(currentStep) && (
              <div className={`${styles.completionBadge} bg-green-500 text-white px-3 py-1 rounded-full text-sm`}>
                <CheckCircle className="w-4 h-4 mr-1 inline" />
                Completed
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className={styles.slideInUp}>
            {steps[currentStep].content}
          </div>

          {steps[currentStep].interaction && (
            <div className="mt-6">
              {steps[currentStep].interaction}
            </div>
          )}

          {!isStepCompleted(currentStep) && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => markStepCompleted(currentStep)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Completion Message */}
      {completedSteps.length === steps.length && (
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700">
              You've successfully completed all steps in this learning guide!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card className="mt-6 bg-yellow-50 border-yellow-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <p className="font-semibold text-amber-900">Learning Tip:</p>
              <p className="text-amber-800 text-sm">
                Take your time with each step. Understanding is more important than speed.
                Don't hesitate to revisit previous steps if needed!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
