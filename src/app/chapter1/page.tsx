"use client";

import React from 'react';
import Chapter1 from '@/content/chapter1/index';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export default function Chapter1Page() {
  const handleChapterComplete = () => {
    console.log('Chapter 1 completed!');
    // Handle chapter completion logic here
    // e.g., update progress, show certificate, navigate to next chapter
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <BackToDashboard />
      </div>
      <Chapter1 onChapterComplete={handleChapterComplete} />
    </div>
  );
}
