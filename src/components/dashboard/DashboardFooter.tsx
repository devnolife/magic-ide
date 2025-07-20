"use client";

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="mt-16 py-12 bg-white/30 backdrop-blur-md border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PY</span>
              </div>
              <h3 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Python Learning Hub
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Platform pembelajaran Python dengan visualisasi interaktif untuk semua level.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div><Button variant="link" className="h-auto p-0">Dashboard</Button></div>
              <div><Button variant="link" className="h-auto p-0">Semua Chapter</Button></div>
              <div><Button variant="link" className="h-auto p-0">Progress Saya</Button></div>
              <div><Button variant="link" className="h-auto p-0">Bantuan</Button></div>
            </div>
          </div>

          {/* Learning */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Belajar</h4>
            <div className="space-y-2 text-sm">
              <div><Button variant="link" className="h-auto p-0">Dasar-Dasar Python</Button></div>
              <div><Button variant="link" className="h-auto p-0">Data Structures</Button></div>
              <div><Button variant="link" className="h-auto p-0">Algorithms</Button></div>
              <div><Button variant="link" className="h-auto p-0">Practice Problems</Button></div>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Community</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-white/20">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-white/20">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/50 backdrop-blur-sm border-white/20">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for Python learners</span>
          </div>
          <div className="mt-2 md:mt-0">
            © 2025 Python Learning Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
