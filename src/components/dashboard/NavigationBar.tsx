"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { MobileNavigation } from './MobileNavigation';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Moon,
  Sun,
  Search,
  Trophy,
  HelpCircle,
  Shield,
  BookOpen
} from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const searchItems = [
  { label: "Chapter 0 - Pengenalan Pemrograman", href: "/chapter/0", keywords: ["pengenalan", "pemrograman", "dasar", "python", "print", "hello"] },
  { label: "Chapter 1 - Variabel dan Tipe Data", href: "/chapter/1", keywords: ["variabel", "tipe", "data", "string", "integer", "float", "boolean"] },
  { label: "Chapter 2 - Operasi dan Ekspresi", href: "/chapter/2", keywords: ["operasi", "ekspresi", "matematika", "operator", "aritmatika", "logika"] },
  { label: "Chapter 3 - Struktur Data", href: "/chapter/3", keywords: ["list", "dictionary", "struktur", "data", "array", "dict"] },
  { label: "Chapter 4 - Pengulangan", href: "/chapter/4", keywords: ["loop", "pengulangan", "for", "while", "iterasi"] },
  { label: "Chapter 5 - Fungsi", href: "/chapter/5", keywords: ["fungsi", "function", "def", "parameter", "return"] },
  { label: "Dashboard", href: "/dashboard", keywords: ["dashboard", "beranda", "home"] },
  { label: "Profil", href: "/dashboard/profile", keywords: ["profil", "profile", "akun"] },
  { label: "Bantuan", href: "/help", keywords: ["bantuan", "help", "faq"] },
];

export function NavigationBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredResults = searchQuery.trim().length > 0
    ? searchItems.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(query) ||
          item.keywords.some((kw) => kw.includes(query))
        );
      })
    : [];

  const showDropdown = isSearchFocused && filteredResults.length > 0;

  const handleSelect = useCallback((href: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    setActiveIndex(-1);
    router.push(href);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredResults[activeIndex].href);
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setActiveIndex(-1);
    }
  }, [showDropdown, activeIndex, filteredResults, handleSelect]);

  if (isLoading) {
    return (
      <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PY</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Python Learning Hub
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="font-medium" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
            <Button variant="ghost" className="font-medium" asChild>
              <Link href="/leaderboard">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Link>
            </Button>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Button variant="ghost" className="font-medium" onClick={() => window.location.href = '/admin'}>
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            )}
            <Button variant="ghost" className="font-medium" asChild>
              <Link href="/help">
                <HelpCircle className="w-4 h-4 mr-2" />
                Bantuan
              </Link>
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
                  placeholder="Cari materi..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => {
                    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                    setIsSearchFocused(true);
                  }}
                  onBlur={() => {
                    blurTimeoutRef.current = setTimeout(() => setIsSearchFocused(false), 150);
                  }}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                />
                {showDropdown && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                    {filteredResults.map((item, index) => (
                      <li key={item.href}>
                        <button
                          type="button"
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                            index === activeIndex
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onMouseDown={() => handleSelect(item.href)}
                          onMouseEnter={() => setActiveIndex(index)}
                        >
                          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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

            {/* Authentication Navigation */}
            {isAuthenticated ? (
              <LogoutButton variant="dropdown" />
            ) : (
              <Button onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <MobileNavigation />
          </div>
        </div>
      </div>
    </nav>
  );
}
