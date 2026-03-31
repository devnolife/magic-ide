"use client"

import { useState, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { ChapterGrid } from "@/components/dashboard/ChapterGrid"
import { ActiveExamsSection } from "@/components/dashboard/ActiveExamsSection"
import { StudentClassroomInfo } from "@/components/dashboard/StudentClassroomInfo"
import type { ChapterProgress } from "@/components/dashboard/ChapterGrid"
import { useAuth } from "@/components/auth/AuthProvider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  const [progressData, setProgressData] = useState<ChapterProgress[]>([]);
  const { user } = useAuth();

  const handleProgressLoaded = useCallback((data: ChapterProgress[]) => {
    setProgressData(data);
  }, []);

  const streakData = user ? {
    currentStreak: user.currentStreak ?? 0,
    longestStreak: user.longestStreak ?? 0,
  } : undefined;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards progressData={progressData} streakData={streakData} />
              <StudentClassroomInfo />
              <ActiveExamsSection />
              <div className="px-4 lg:px-6">
                <ChapterGrid onProgressLoaded={handleProgressLoaded} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
