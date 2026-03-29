"use client"

import * as React from "react"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  HelpCircle,
  Search,
  Shield,
  School,
  GraduationCap,
  User,
  LogOut,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavChapters } from "@/components/nav-chapters"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  const { user, isAuthenticated, logout } = useAuth()

  const navMainItems = React.useMemo(() => {
    const items = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Leaderboard", url: "#", icon: Trophy },
    ]

    if (isAuthenticated && user?.role === "TEACHER") {
      items.push({ title: "Panel Guru", url: "/teacher", icon: School })
    }
    if (isAuthenticated && user?.role === "ADMIN") {
      items.push({ title: "Panel Guru", url: "/teacher", icon: School })
      items.push({ title: "Admin Panel", url: "/admin", icon: Shield })
    }

    return items
  }, [isAuthenticated, user?.role])

  const displayName = user?.name || user?.username || "User"

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
        {isAuthenticated && (
          <>
            <Separator className="my-2" />
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email || ""}</span>
              </div>
            </div>
          </>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavChapters items={chapters} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <a href="/dashboard/profile">
                <User className="size-4" />
                <span>Profile</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Keluar"
              onClick={async () => {
                try {
                  await logout();
                  window.location.href = "/login";
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
            >
              <LogOut className="size-4" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
