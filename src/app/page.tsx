"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GuruPintarLogo } from '@/components/branding/GuruPintarLogo';
import { FloatingShapes } from '@/components/branding/FloatingShapes';
import { LottieAnimation } from '@/components/animations/LottieAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Code2, Trophy, Sparkles, ArrowRight,
  Brain, ListChecks, BookMarked, Repeat, FunctionSquare, Braces
} from 'lucide-react';

const chapters = [
  { icon: Brain, title: 'Dasar Pemrograman', desc: 'Apa itu coding & Python', color: 'from-emerald-400 to-emerald-600' },
  { icon: Braces, title: 'Variabel & Tipe Data', desc: 'Variabel, string, number', color: 'from-blue-400 to-blue-600' },
  { icon: ListChecks, title: 'List & Array', desc: 'Struktur data list', color: 'from-cyan-400 to-cyan-600' },
  { icon: BookMarked, title: 'Dictionary', desc: 'Key-value data', color: 'from-teal-400 to-teal-600' },
  { icon: Repeat, title: 'Perulangan', desc: 'For & while loop', color: 'from-sky-400 to-sky-600' },
  { icon: FunctionSquare, title: 'Fungsi', desc: 'Buat fungsi sendiri', color: 'from-cyan-400 to-cyan-600' },
];

const stats = [
  { value: '6', label: 'Chapter', icon: BookOpen },
  { value: '24', label: 'Pelajaran', icon: Code2 },
  { value: '18', label: 'Tantangan', icon: Trophy },
  { value: '∞', label: 'Keseruan', icon: Sparkles },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <FloatingShapes />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <GuruPintarLogo size="md" />
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full px-6">
              Masuk
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full px-6 shadow-lg shadow-emerald-200">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4 text-sm px-4 py-1 rounded-full">
              🎓 Platform by GuruPintar
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Belajar Python
              </span>
              <br />
              <span className="text-gray-800">Jadi Menyenangkan! </span>
              <span className="text-4xl">🐍</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Platform interaktif untuk belajar pemrograman Python dari nol.
              Visualisasi kode secara real-time, kuis seru, dan tantangan coding yang bikin ketagihan! 
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all">
                  Mulai Belajar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full px-8 py-6 text-lg">
                  Lihat Materi 📖
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-full blur-3xl opacity-40 scale-110" />
              <Image 
                src="/asset/it-education.svg" 
                alt="Belajar Python" 
                width={450} 
                height={450}
                className="drop-shadow-xl relative z-10"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <Card className="bg-white/70 backdrop-blur-sm border-emerald-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Chapters / Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-4">
            Materi Lengkap & Terstruktur 📚
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            6 chapter yang dirancang khusus untuk pemula, dari dasar hingga mahir
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {chapters.map((ch, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <ch.icon className="h-7 w-7 text-white" />
                  </div>
                  <Badge variant="outline" className="mb-2 text-xs border-gray-200 text-gray-400">
                    Chapter {i}
                  </Badge>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{ch.title}</h3>
                  <p className="text-sm text-gray-500">{ch.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-blue-500 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-10 text-center text-white relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-8 text-6xl">🐍</div>
                <div className="absolute bottom-4 right-8 text-6xl">💻</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20">🎓</div>
              </div>
              <LottieAnimation src="/asset/rocket-launch.json" width={80} height={80} />
              <h2 className="text-3xl font-extrabold mb-4 relative z-10">
                Siap Jadi Programmer? 🚀
              </h2>
              <p className="text-lg text-emerald-100 mb-8 max-w-lg mx-auto relative z-10">
                Bergabung sekarang dan mulai perjalanan coding kamu bersama GuruPintar!
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-full px-10 py-6 text-lg font-bold shadow-xl relative z-10">
                  Daftar Gratis Sekarang ✨
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <GuruPintarLogo size="sm" />
          <p className="text-sm text-gray-400">
            © 2026 GuruPintar. Platform Belajar Pintar untuk Generasi Digital.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Modul Python 🐍</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
