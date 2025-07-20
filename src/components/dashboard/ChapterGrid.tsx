"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { ChapterCard } from './ChapterCard';
import { chaptersData, getFilteredChapters, getStatusCounts } from '@/data/dashboardData';

export function ChapterGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const statusCounts = getStatusCounts();
  const filteredChapters = getFilteredChapters(activeFilter, searchTerm);

  const filterOptions = [
    { value: 'all', label: 'Semua', count: statusCounts.all },
    { value: 'not-started', label: 'Belum Dimulai', count: statusCounts['not-started'] },
    { value: 'in-progress', label: 'Sedang Berjalan', count: statusCounts['in-progress'] },
    { value: 'completed', label: 'Selesai', count: statusCounts.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pilih Chapter</h2>
          <p className="text-gray-600">Mulai perjalanan belajar Python Anda</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-white/50 backdrop-blur-sm border-white/20"
            />
          </div>

          {/* Filter Toggle */}
          <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-white/20">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className={`cursor-pointer transition-all ${activeFilter === filter.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70'
              }`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label} ({filter.count})
          </Badge>
        ))}
      </div>

      {/* Chapter Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredChapters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada chapter ditemukan</h3>
          <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-12 p-6 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ringkasan Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-gray-600">Selesai</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts['in-progress']}</div>
              <div className="text-gray-600">Sedang Berjalan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{statusCounts['not-started']}</div>
              <div className="text-gray-600">Belum Dimulai</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.locked}</div>
              <div className="text-gray-600">Terkunci</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
