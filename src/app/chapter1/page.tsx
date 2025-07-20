"use client";

import React from 'react';
import Chapter1 from '@/content/chapter1/index';

export default function Chapter1Page() {
  const handleChapterComplete = () => {
    console.log('Chapter 1 completed!');
    // Handle chapter completion logic here
    // e.g., update progress, show certificate, navigate to next chapter
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Chapter1 onChapterComplete={handleChapterComplete} />
    </div>
  );
}
