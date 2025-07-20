"use client";

import React from 'react';
import { LearningPlatform } from '@/components/LearningPlatform';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export default function Chapter2Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <BackToDashboard />
      </div>
      <div className="px-4 pb-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chapter 2: Advanced List Operations
          </h1>
          <p className="text-lg text-gray-600">
            Operasi list lanjutan: slicing, comprehension, dan nested lists
          </p>
        </div>
        <LearningPlatform />
      </div>
    </div>
  );
}
