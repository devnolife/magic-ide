"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Trophy,
  HelpCircle,
  Search,
  Shield,
  School,
  GraduationCap,
  Award,
  ClipboardList,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavChapters } from "@/components/nav-chapters"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth/AuthProvider"

const chapters = [
  { title: "Ch 0: Dasar Pemrograman", url: "/chapter/0" },
  { title: "Ch 1: Python Lists", url: "/chapter/1" },
  { title: "Ch 2: Teknik Lanjutan Lists", url: "/chapter/2" },
  { title: "Ch 3: Dictionary & Objects", url: "/chapter/3" },
  { title: "Ch 4: Loops & Iterasi", url: "/chapter/4" },
  { title: "Ch 5: Project & Challenge", url: "/chapter/5" },
]

const navSecondary = [
  { title: "Bantuan", url: "#", icon: HelpCircle },
  { title: "Cari Materi", url: "#", icon: Search },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAuth()

  const navMainItems = React.useMemo(() => {
    const items = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
      { title: "Sertifikat", url: "/certificates", icon: Award },
    ]

    if (isAuthenticated && user?.role === "USER") {
      items.push({ title: "Ujian", url: "/dashboard#ujian", icon: ClipboardList })
    }

    if (isAuthenticated && user?.role === "TEACHER") {
      items.push({ title: "Panel Guru", url: "/teacher", icon: School })
    }
    if (isAuthenticated && user?.role === "ADMIN") {
      items.push({ title: "Panel Guru", url: "/teacher", icon: School })
      items.push({ title: "Admin Panel", url: "/admin", icon: Shield })
    }

    return items
  }, [isAuthenticated, user?.role])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <div className="flex size-7! items-center justify-center rounded-md bg-gradient-to-r from-emerald-500 to-blue-600">
                  <GraduationCap className="size-4.5 text-white" />
                </div>
                <span className="text-lg font-semibold">Python Learning Hub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavChapters items={chapters} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
