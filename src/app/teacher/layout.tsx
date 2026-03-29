"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  School,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";

const sidebarLinks = [
  { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/classrooms", label: "Kelas", icon: School },
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <School className="h-16 w-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Akses Ditolak</h2>
          <p className="text-gray-600">
            Halaman ini hanya untuk guru dan admin.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = (user.name || user.username || "T")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900
          text-white shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Python Learning</h2>
              <p className="text-xs text-purple-200">Panel Guru</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/teacher"
                ? pathname === "/teacher"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-purple-200 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-purple-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Utama
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-800">
                Panel Guru
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name || user.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name || user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
