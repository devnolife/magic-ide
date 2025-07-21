"use client";

import React from 'react';
import { EnchantmentContainer } from '@/components/chapter4/EnchantmentContainer';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export default function Chapter4Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Magical circle background */}
      <div className="absolute inset-0 opacity-15">
        {/* Concentric circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 border-2 border-purple-300 rounded-full animate-spin [animation-duration:20s]"></div>
          <div className="absolute top-8 left-8 w-80 h-80 border border-violet-300 rounded-full animate-spin [animation-duration:15s] [animation-direction:reverse]"></div>
          <div className="absolute top-16 left-16 w-64 h-64 border border-fuchsia-300 rounded-full animate-spin [animation-duration:25s]"></div>
        </div>

        {/* Floating runes */}
        <div className="absolute top-20 left-20 w-6 h-6 bg-purple-400 rounded-full animate-bounce [animation-delay:0s]"></div>
        <div className="absolute top-32 left-40 w-4 h-4 bg-violet-400 rounded-full animate-bounce [animation-delay:0.5s]"></div>
        <div className="absolute top-28 right-32 w-5 h-5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:1s]"></div>
        <div className="absolute top-40 right-60 w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:1.5s]"></div>

        {/* Magical particles */}
        <div className="absolute top-60 left-32 w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute top-80 left-16 w-1 h-1 bg-purple-500 rounded-full animate-ping"></div>
        <div className="absolute top-96 left-48 w-2 h-2 bg-fuchsia-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-violet-600 rounded-full animate-bounce"></div>
        <div className="absolute top-48 right-32 w-2 h-2 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute top-72 right-16 w-1 h-1 bg-fuchsia-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-violet-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-48 right-1/3 w-1 h-1 bg-purple-600 rounded-full animate-ping"></div>

        {/* Enchantment lines */}
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-violet-200 to-purple-400 opacity-40"></div>
        <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-purple-200 to-fuchsia-400 opacity-40"></div>
        <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-violet-200 to-fuchsia-400 opacity-40"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-purple-200 to-violet-400 opacity-40"></div>
      </div>

      <div className="relative z-10">
        <div className="p-4">
          <BackToDashboard />
        </div>
        <div className="px-4 pb-4">
          <div className="mb-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full shadow-xl mb-4 relative">
                <span className="text-4xl">🔄</span>
                {/* Orbital elements around the icon */}
                <div className="absolute -top-3 -right-3 w-4 h-4 bg-violet-400 rounded-full animate-spin"></div>
                <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-purple-400 rounded-full animate-spin [animation-direction:reverse]"></div>
                <div className="absolute top-0 -left-4 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 -right-4 w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
              ⭕ Enchantment Circle Mastery
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-3">
              Master Circula's Sacred Academy - Harness the infinite power of loops, iteration, and repetitive magic
            </p>
            <div className="text-sm text-gray-600 opacity-80 mb-2">
              🔁 For Loop Incantations • ⚡ While Circle Rituals • 🎯 List Comprehension Mastery • 🌊 Iterator Enchantments
            </div>
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
                <span>Basic Loops</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span>Advanced Iteration</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></span>
                <span>Nested Circles</span>
              </span>
            </div>
          </div>
          <EnchantmentContainer />
        </div>
      </div>

      {/* Floating magical circle elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Rotating magical symbols */}
        <div className="absolute top-24 left-12 w-8 h-1 bg-violet-400 rounded-full opacity-60 animate-spin shadow-lg"></div>
        <div className="absolute top-44 right-24 w-6 h-1 bg-purple-500 rounded-full opacity-40 animate-spin [animation-direction:reverse] shadow-lg"></div>
        <div className="absolute bottom-36 left-1/3 w-1 h-6 bg-fuchsia-500 rounded-full opacity-80 animate-spin shadow-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-violet-600 rounded-full opacity-50 animate-pulse shadow-lg"></div>

        {/* Enchantment trail effects */}
        <div className="absolute top-1/3 left-1/4 w-24 h-0.5 bg-gradient-to-r from-violet-300 to-transparent opacity-40 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-20 h-0.5 bg-gradient-to-l from-purple-300 to-transparent opacity-40 animate-pulse"></div>

        {/* Mystic circle runes */}
        <div className="absolute top-16 right-16 text-violet-300 opacity-30 animate-pulse text-lg">○</div>
        <div className="absolute bottom-20 left-20 text-purple-300 opacity-30 animate-pulse text-lg">◎</div>
        <div className="absolute top-2/3 left-16 text-fuchsia-300 opacity-30 animate-pulse text-lg">⊚</div>
        <div className="absolute top-1/3 right-12 text-violet-300 opacity-30 animate-pulse text-lg">⊙</div>

        {/* Infinite loop symbols */}
        <div className="absolute top-20 left-1/2 text-purple-300 opacity-20 animate-spin text-2xl">∞</div>
        <div className="absolute bottom-20 right-1/2 text-fuchsia-300 opacity-20 animate-spin [animation-direction:reverse] text-2xl">∞</div>
      </div>
    </div>
  );
}
