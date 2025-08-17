"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { useAuth } from '@/hooks/useAuth';
import { MobileNavigation } from './MobileNavigation';
import {
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Search,
  Menu,
  Trophy,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';

export function NavigationBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PY</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Python Learning Hub
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="font-medium">
              Dashboard
            </Button>
            <Button variant="ghost" className="font-medium">
              <Trophy className="w-4 h-4 mr-2" />
              Papan Skor
            </Button>
            <Button variant="ghost" className="font-medium">
              <HelpCircle className="w-4 h-4 mr-2" />
              Bantuan
            </Button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari topik..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <LogoutButton variant="dropdown" />
              <div className="hidden md:block">
                <span className="font-medium text-sm">
                  {user?.fullName || user?.username || 'User'}
                </span>
              </div>
            </div>

            {/* Mobile Menu */}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </nav>
  );
}
