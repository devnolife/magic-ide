"use client";

import React from 'react';
import { ListContainer } from '@/components/lists/ListContainer';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export function Chapter1Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50">
      <div className="p-4">
        <BackToDashboard />
      </div>
      <div className="px-4 pb-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            🐍 Python Lists & Arrays
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Jelajahi dunia list Python dengan visualisasi interaktif yang menakjubkan!
          </p>
          <div className="mt-4 text-sm text-gray-500">
            ✨ Animasi real-time • 🎮 Interactive playground • 🏆 Achievement system
          </div>
        </div>
        <ListContainer />
      </div>
    </div>
  );
}
