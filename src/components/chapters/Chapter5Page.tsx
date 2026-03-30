"use client";

import React from 'react';
import { Chapter5Container } from '@/components/chapter5/Chapter5Container';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export function Chapter5Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="p-4">
        <BackToDashboard />
      </div>
      <div className="px-4 pb-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
            🧙‍♂️ Advanced Python Concepts
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Kuasai konsep Python lanjutan: OOP, Error Handling, File I/O, dan Modules
          </p>
        </div>
        <Chapter5Container />
      </div>
    </div>
  );
}
