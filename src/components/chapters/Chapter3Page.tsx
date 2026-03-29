"use client";

import React from 'react';
import { GrimoireContainer } from '@/components/chapter3/GrimoireContainer';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';

export function Chapter3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-amber-50 relative overflow-hidden">
      {/* Magical library background */}
      <div className="absolute inset-0 opacity-20">
        {/* Buku-buku melayang */}
        <div className="absolute top-20 left-20 w-4 h-6 bg-emerald-600 rounded-sm shadow-lg animate-bounce"></div>
        <div className="absolute top-32 left-40 w-3 h-5 bg-amber-600 rounded-sm shadow-lg animate-bounce [animation-delay:0.5s]"></div>
        <div className="absolute top-28 right-32 w-4 h-6 bg-cyan-600 rounded-sm shadow-lg animate-bounce [animation-delay:1s]"></div>
        <div className="absolute top-40 right-60 w-3 h-5 bg-emerald-500 rounded-sm shadow-lg animate-bounce [animation-delay:1.5s]"></div>

        {/* Partikel ajaib */}
        <div className="absolute top-60 left-32 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-80 left-16 w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
        <div className="absolute top-96 left-48 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-amber-600 rounded-full animate-bounce"></div>
        <div className="absolute top-48 right-32 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></div>
        <div className="absolute top-72 right-16 w-1 h-1 bg-cyan-600 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-amber-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-48 right-1/3 w-1 h-1 bg-emerald-600 rounded-full animate-ping"></div>

        {/* Garis-garis rak buku */}
        <div className="absolute top-0 left-8 w-1 h-full bg-gradient-to-b from-amber-200 to-amber-400 opacity-30"></div>
        <div className="absolute top-0 right-8 w-1 h-full bg-gradient-to-b from-emerald-200 to-emerald-400 opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-cyan-200 to-cyan-400 opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-amber-200 to-amber-400 opacity-30"></div>
      </div>

      <div className="relative z-10">
        <div className="p-4">
          <BackToDashboard />
        </div>
        <div className="px-4 pb-4">
          <div className="mb-8 text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 via-cyan-500 to-amber-500 rounded-full shadow-xl mb-4 relative">
                <span className="text-4xl">📚</span>
                {/* Elemen ajaib melayang di sekitar ikon */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute top-1 -left-3 w-1 h-1 bg-cyan-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-amber-600 bg-clip-text text-transparent mb-4">
              📖 Akademi Grimoire Ajaib
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-3">
              Perpustakaan Kuno Master Libris - Temukan seni mistis Sihir Dictionary & Pembuatan Objek
            </p>
            <div className="text-sm text-gray-600 opacity-80 mb-2">
              🗝️ Katalog Bahan Mantra • 📜 Manajemen Grimoire • 🔮 Buku Multi-Dimensi • ⚡ Penyihiran Objek
            </div>
            <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>Dasar-dasar Dictionary</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                <span>Metode Lanjutan</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span>Struktur Bersarang</span>
              </span>
            </div>
          </div>
          <GrimoireContainer />
        </div>
      </div>

      {/* Elemen perpustakaan ajaib melayang */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gulungan kuno */}
        <div className="absolute top-24 left-12 w-6 h-2 bg-amber-400 rounded-full opacity-60 animate-pulse shadow-lg"></div>
        <div className="absolute top-44 right-24 w-4 h-1 bg-emerald-500 rounded-full opacity-40 animate-ping shadow-lg"></div>
        <div className="absolute bottom-36 left-1/3 w-2 h-4 bg-cyan-500 rounded-full opacity-80 animate-bounce shadow-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-600 rounded-full opacity-50 animate-pulse shadow-lg"></div>

        {/* Jejak bulu ajaib */}
        <div className="absolute top-1/4 left-1/4 w-20 h-0.5 bg-gradient-to-r from-emerald-300 to-transparent opacity-40 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-16 h-0.5 bg-gradient-to-l from-amber-300 to-transparent opacity-40 animate-pulse"></div>

        {/* Rune mistis */}
        <div className="absolute top-16 right-16 text-emerald-300 opacity-30 animate-pulse">✦</div>
        <div className="absolute bottom-20 left-20 text-amber-300 opacity-30 animate-pulse">⧫</div>
        <div className="absolute top-2/3 left-16 text-cyan-300 opacity-30 animate-pulse">※</div>
        <div className="absolute top-1/3 right-12 text-emerald-300 opacity-30 animate-pulse">◊</div>
      </div>
    </div>
  );
}
