"use client";

import React from 'react';
import { AdvancedListContainer } from '@/components/chapter2/AdvancedListContainer';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export default function Chapter2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Magical particle pattern background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 left-40 w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="absolute top-28 left-60 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 left-80 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-60 left-32 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="absolute top-80 left-16 w-1 h-1 bg-yellow-500 rounded-full animate-ping"></div>
        <div className="absolute top-96 left-48 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="absolute top-48 right-32 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute top-72 right-16 w-1 h-1 bg-purple-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-48 right-1/3 w-1 h-1 bg-yellow-600 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10">
        <div className="p-4">
          <BackToDashboard />
        </div>
        <div className="px-4 pb-4">
          <div className="mb-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg mb-4">
                <span className="text-3xl">🧙‍♂️</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-3">
              ✨ Penguasaan List Lanjutan
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
              Akademi Penyihir Master - Rahasia kuno manipulasi list Python tingkat lanjut
            </p>
            <div className="text-sm text-gray-600 opacity-80">
              🔮 Spell Comprehensions • 🌌 Matriks Dimensi • 📜 Metode Kuno • 🎯 Teknik Grandmaster
            </div>
          </div>
          <AdvancedListContainer />
        </div>
      </div>

      {/* Floating magical elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-500 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-yellow-500 rounded-full opacity-80 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-500 rounded-full opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
}
