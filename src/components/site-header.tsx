"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"

export function SiteHeader() {
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.username || "User"

  return (
    <header className="m-2 mb-0 flex h-(--header-height) shrink-0 items-center gap-2 rounded-xl border bg-card shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                Python Learning Hub
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {displayName}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4 hidden md:block" />
          <a
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="size-4" />
            <span className="hidden lg:inline">Profile</span>
          </a>
          <button
            onClick={async () => {
              try {
                await logout();
                window.location.href = "/login";
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
            <span className="hidden lg:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  )
}
