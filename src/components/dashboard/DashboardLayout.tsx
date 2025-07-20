"use client";

import { NavigationBar } from './NavigationBar';
import { HeroSection } from './HeroSection';
import { ChapterGrid } from './ChapterGrid';
import { ProgressSidebar } from './ProgressSidebar';
import { DashboardFooter } from './DashboardFooter';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <NavigationBar />

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <HeroSection />
          <ChapterGrid />
        </div>

        {/* Sidebar - Hidden on mobile, shown on large screens */}
        <div className="hidden lg:block">
          <ProgressSidebar />
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}
