"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  School,
  BookOpen,
  User,
  LogOut,
  ClipboardList,
} from "lucide-react";

const sidebarLinks = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/materials", label: "Materi", icon: BookOpen },
  { href: "/teacher/exams", label: "Ujian", icon: ClipboardList },
  { href: "/teacher/classrooms", label: "Kelas", icon: School },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/teacher") return "Dashboard";
  if (pathname === "/teacher/materials") return "Materi Pembelajaran";
  if (pathname.endsWith("/present")) return "Mode Presentasi";
  if (pathname.startsWith("/teacher/materials/")) return "Detail Materi";
  if (pathname === "/teacher/exams") return "Manajemen Ujian";
  if (pathname.startsWith("/teacher/exams/")) return "Hasil Ujian";
  if (pathname === "/teacher/classrooms/new") return "Buat Kelas Baru";
  if (pathname.startsWith("/teacher/classrooms/")) return "Detail Kelas";
  if (pathname === "/teacher/classrooms") return "Kelas";
  return "Panel Guru";
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader className="px-4 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="/teacher">
                  <div className="flex size-7! items-center justify-center rounded-md bg-gradient-to-r from-emerald-600 to-blue-700">
                    <School className="size-4.5 text-white" />
                  </div>
                  <span className="text-lg font-semibold">Panel Guru</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-3">
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {sidebarLinks.map((link) => {
                  const isActive =
                    link.href === "/teacher"
                      ? pathname === "/teacher"
                      : pathname.startsWith(link.href);
                  return (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={link.label}
                        isActive={isActive}
                      >
                        <a href={link.href}>
                          <link.icon />
                          <span>{link.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
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
                  <BreadcrumbLink href="/teacher">Panel Guru</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs">
                    {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {user?.name || user?.username || "User"}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4 hidden md:block" />
              <a
                href="/teacher/profile"
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

        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
