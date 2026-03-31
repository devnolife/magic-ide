"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Grid3X3, Search, Gamepad2, Trophy, CheckCircle2, Play, RotateCcw } from 'lucide-react';

interface PlaygroundProps {
  onComplete?: () => void;
  isCompleted?: boolean;
}

type ChallengeId = 'pola-bintang' | 'tabel-perkalian' | 'pencarian-data' | 'fizzbuzz';

interface Challenge {
  id: ChallengeId;
  title: string;
  icon: React.ReactNode;
  difficulty: string;
  difficultyColor: string;
  description: string;
  code: string;
}

const challenges: Challenge[] = [
  {
    id: 'pola-bintang',
    title: 'Pola Bintang ⭐',
    icon: <Star className="w-5 h-5" />,
    difficulty: 'Mudah',
    difficultyColor: 'bg-green-100 text-green-800 border-green-300',
    description: 'Buat pola segitiga bintang dengan nested loop',
    code: `# Pola Bintang\nn = 5  # jumlah baris\nfor i in range(1, n + 1):\n    print('⭐' * i)`,
  },
  {
    id: 'tabel-perkalian',
    title: 'Tabel Perkalian 🔢',
    icon: <Grid3X3 className="w-5 h-5" />,
    difficulty: 'Mudah',
    difficultyColor: 'bg-green-100 text-green-800 border-green-300',
    description: 'Buat tabel perkalian dengan nested loop',
    code: `# Tabel Perkalian\nn = 5  # ukuran tabel\nfor i in range(1, n + 1):\n    for j in range(1, n + 1):\n        print(f"{i}x{j}={i*j}", end="\\t")\n    print()`,
  },
  {
    id: 'pencarian-data',
    title: 'Pencarian Data 🔍',
    icon: <Search className="w-5 h-5" />,
    difficulty: 'Sedang',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Cari data siswa yang memenuhi kriteria tertentu',
    code: `# Pencarian Data Nilai Siswa\nsiswa = [\n  {"nama": "Andi",  "nilai": 85},\n  {"nama": "Budi",  "nilai": 72},\n  {"nama": "Citra", "nilai": 91},\n  {"nama": "Dewi",  "nilai": 68},\n  {"nama": "Eko",   "nilai": 95},\n  {"nama": "Fani",  "nilai": 78},\n]\nbatas = 80\nfor s in siswa:\n    if s["nilai"] > batas:\n        print(f'{s["nama"]}: {s["nilai"]} ✓')`,
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz 🎮',
    icon: <Gamepad2 className="w-5 h-5" />,
    difficulty: 'Sedang',
    difficultyColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Tantangan klasik FizzBuzz dengan loop & kondisi',
    code: `# FizzBuzz\nn = 20\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`,
  },
];

const siswaData = [
  { nama: 'Andi', nilai: 85 },
  { nama: 'Budi', nilai: 72 },
  { nama: 'Citra', nilai: 91 },
  { nama: 'Dewi', nilai: 68 },
  { nama: 'Eko', nilai: 95 },
  { nama: 'Fani', nilai: 78 },
];

// ── Sub-components ────────────────────────────────────────

function PolaBintangPanel({ onInteract }: { onInteract: () => void }) {
  const [rows, setRows] = useState(5);
  const [visibleRows, setVisibleRows] = useState(0);
  const [animating, setAnimating] = useState(false);

  const runAnimation = useCallback(() => {
    setVisibleRows(0);
    setAnimating(true);
    onInteract();
  }, [onInteract]);

  useEffect(() => {
    if (!animating) return;
    if (visibleRows >= rows) { setAnimating(false); return; }
    const t = setTimeout(() => setVisibleRows(v => v + 1), 300);
    return () => clearTimeout(t);
  }, [animating, visibleRows, rows]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Jumlah baris: {rows}</span>
        <Slider min={1} max={10} step={1} value={[rows]} onValueChange={v => { setRows(v[0]); setVisibleRows(0); setAnimating(false); }} className="flex-1" />
        <Button size="sm" onClick={runAnimation} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
          <Play className="w-4 h-4 mr-1" /> Jalankan
        </Button>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 min-h-[160px] font-mono text-lg">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: visibleRows }, (_, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="text-yellow-300">
              {'⭐'.repeat(i + 1)}
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleRows === 0 && <span className="text-gray-500 text-sm">Tekan &quot;Jalankan&quot; untuk melihat pola...</span>}
      </div>
    </div>
  );
}

function TabelPerkalianPanel({ onInteract }: { onInteract: () => void }) {
  const [size, setSize] = useState(5);
  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const [shown, setShown] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Ukuran tabel: {size}</span>
        <Slider min={1} max={12} step={1} value={[size]} onValueChange={v => { setSize(v[0]); setShown(false); }} className="flex-1" />
        <Button size="sm" onClick={() => { setShown(true); onInteract(); }} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
          <Play className="w-4 h-4 mr-1" /> Tampilkan
        </Button>
      </div>
      {shown ? (
        <div className="overflow-x-auto rounded-lg border border-purple-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-2 text-purple-700 font-bold">×</th>
                {Array.from({ length: size }, (_, j) => (
                  <th key={j} className="p-2 text-purple-700 font-bold">{j + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: size }, (_, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-purple-50/50' : 'bg-white'}>
                  <td className="p-2 font-bold text-purple-700 bg-purple-100">{i + 1}</td>
                  {Array.from({ length: size }, (_, j) => {
                    const key = `${i}-${j}`;
                    const isHovered = hoverCell === key;
                    return (
                      <td key={j} onMouseEnter={() => setHoverCell(key)} onMouseLeave={() => setHoverCell(null)}
                        className={`p-2 text-center transition-colors cursor-default ${isHovered ? 'bg-fuchsia-200 font-bold text-fuchsia-800 scale-105' : 'text-gray-700'}`}>
                        {isHovered ? `${i + 1}×${j + 1}=` : ''}{(i + 1) * (j + 1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 text-sm">Tekan &quot;Tampilkan&quot; untuk melihat tabel perkalian</div>
      )}
    </div>
  );
}

function PencarianDataPanel({ onInteract }: { onInteract: () => void }) {
  const [threshold, setThreshold] = useState(80);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const runSearch = useCallback(() => {
    setResults([]);
    setActiveIndex(-1);
    setSearching(true);
    onInteract();
  }, [onInteract]);

  useEffect(() => {
    if (!searching) return;
    const next = activeIndex + 1;
    if (next >= siswaData.length) { setSearching(false); return; }
    const t = setTimeout(() => {
      setActiveIndex(next);
      setResults(prev => [...prev, siswaData[next].nilai > threshold]);
    }, 600);
    return () => clearTimeout(t);
  }, [searching, activeIndex, threshold]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Cari nilai &gt;</span>
        <Input type="number" value={threshold} onChange={e => { setThreshold(Number(e.target.value)); setResults([]); setActiveIndex(-1); setSearching(false); }}
          className="w-20" min={0} max={100} />
        <Button size="sm" onClick={runSearch} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
          <Search className="w-4 h-4 mr-1" /> Cari
        </Button>
      </div>
      <div className="space-y-2">
        {siswaData.map((s, idx) => {
          const isActive = idx === activeIndex && searching;
          const checked = idx < results.length;
          const match = results[idx];
          return (
            <motion.div key={s.nama} animate={isActive ? { scale: 1.03 } : { scale: 1 }}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isActive ? 'border-fuchsia-400 bg-fuchsia-50 ring-2 ring-fuchsia-300' : checked ? (match ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50') : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                {checked && (
                  <span className={`text-sm font-bold ${match ? 'text-green-600' : 'text-gray-400'}`}>{match ? '✓' : '✗'}</span>
                )}
                {isActive && <span className="text-fuchsia-500 animate-pulse">▶</span>}
                <span className="font-medium text-gray-800">{s.nama}</span>
              </div>
              <Badge variant="outline" className={checked && match ? 'border-green-400 text-green-700' : ''}>{s.nilai}</Badge>
            </motion.div>
          );
        })}
      </div>
      {!searching && results.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-purple-700 font-medium">
          Ditemukan {results.filter(Boolean).length} siswa dengan nilai &gt; {threshold}
        </motion.div>
      )}
    </div>
  );
}

function FizzBuzzPanel({ onInteract }: { onInteract: () => void }) {
  const [range, setRange] = useState(20);
  const [visibleCount, setVisibleCount] = useState(0);
  const [animating, setAnimating] = useState(false);

  const runAnimation = useCallback(() => {
    setVisibleCount(0);
    setAnimating(true);
    onInteract();
  }, [onInteract]);

  useEffect(() => {
    if (!animating) return;
    if (visibleCount >= range) { setAnimating(false); return; }
    const t = setTimeout(() => setVisibleCount(v => v + 1), 120);
    return () => clearTimeout(t);
  }, [animating, visibleCount, range]);

  const getLabel = (n: number) => {
    if (n % 15 === 0) return { text: 'FizzBuzz', cls: 'bg-purple-200 text-purple-800 border-purple-300' };
    if (n % 3 === 0) return { text: 'Fizz', cls: 'bg-green-200 text-green-800 border-green-300' };
    if (n % 5 === 0) return { text: 'Buzz', cls: 'bg-blue-200 text-blue-800 border-blue-300' };
    return { text: String(n), cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-purple-700 whitespace-nowrap">Range: 1 – {range}</span>
        <Slider min={5} max={50} step={5} value={[range]} onValueChange={v => { setRange(v[0]); setVisibleCount(0); setAnimating(false); }} className="flex-1" />
        <Button size="sm" onClick={runAnimation} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
          <Play className="w-4 h-4 mr-1" /> Jalankan
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[80px]">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: visibleCount }, (_, i) => {
            const n = i + 1;
            const { text, cls } = getLabel(n);
            return (
              <motion.span key={n} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.15 }}
                className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md border text-sm font-mono font-medium ${cls}`}>
                {text}
              </motion.span>
            );
          })}
        </AnimatePresence>
        {visibleCount === 0 && <span className="text-gray-400 text-sm self-center">Tekan &quot;Jalankan&quot; untuk melihat hasil...</span>}
      </div>
      {!animating && visibleCount > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 text-xs flex-wrap">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 border border-green-300" /> Fizz (kelipatan 3)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> Buzz (kelipatan 5)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-200 border border-purple-300" /> FizzBuzz (kelipatan 15)</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200" /> Angka biasa</span>
        </motion.div>
      )}
    </div>
  );
}

// ── Code display ──────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 text-sm rounded-lg p-4 overflow-x-auto font-mono leading-relaxed">
      {code.split('\n').map((line, i) => {
        let cls = 'text-gray-300';
        const trimmed = line.trimStart();
        if (trimmed.startsWith('#')) cls = 'text-gray-500 italic';
        else if (/^(for |if |elif |else:|while |def |return |import |from )/.test(trimmed)) cls = 'text-purple-400 font-semibold';
        else if (/\bprint\b/.test(trimmed)) cls = 'text-cyan-400';
        else if (/\brange\b/.test(trimmed)) cls = 'text-yellow-400';
        else if (/"[^"]*"|'[^']*'/.test(trimmed)) cls = 'text-green-400';
        return (
          <div key={i} className="flex">
            <span className="text-gray-600 select-none w-6 text-right mr-3">{i + 1}</span>
            <span className={cls}>{line}</span>
          </div>
        );
      })}
    </pre>
  );
}

// ── Main component ────────────────────────────────────────

export function IterationPlayground({ onComplete, isCompleted }: PlaygroundProps) {
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId>('pola-bintang');
  const [completed, setCompleted] = useState<Set<ChallengeId>>(new Set());

  const markDone = useCallback((id: ChallengeId) => {
    setCompleted(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (completed.size >= challenges.length && onComplete) {
      onComplete();
    }
  }, [completed, onComplete]);

  const mastery = challenges.length > 0 ? Math.min(Math.round((completed.size / challenges.length) * 100), 100) : 0;
  const current = challenges.find(c => c.id === activeChallenge)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-700 to-fuchsia-700 bg-clip-text text-transparent">
                Arena Latihan Perulangan
              </CardTitle>
              <CardDescription className="text-purple-600">
                Praktikkan kemampuan loop Python-mu dengan tantangan interaktif!
              </CardDescription>
            </div>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800 border border-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Selesai
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Mastery progress */}
      <Card className="border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Penguasaan: {mastery}%</span>
            <span className="text-sm text-purple-500">{completed.size}/{challenges.length} tantangan selesai</span>
          </div>
          <Progress value={mastery} className="h-3" />
        </CardContent>
      </Card>

      {/* Challenge selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {challenges.map(c => {
          const done = completed.has(c.id);
          const active = activeChallenge === c.id;
          return (
            <button key={c.id} onClick={() => setActiveChallenge(c.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${active ? 'border-fuchsia-400 bg-fuchsia-50 shadow-md ring-2 ring-fuchsia-200' : done ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                {c.icon}
                <Badge variant="outline" className={`text-xs ${c.difficultyColor}`}>{c.difficulty}</Badge>
              </div>
              <h4 className="font-semibold text-sm text-gray-800 mt-1">{c.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
              {done && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Code panel */}
        <Card className="lg:col-span-2 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-800">
              📝 Kode Python
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={current.code} />
          </CardContent>
        </Card>

        {/* Interactive panel */}
        <Card className="lg:col-span-3 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-purple-800">
                🎮 Hasil Interaktif
              </CardTitle>
              {completed.has(activeChallenge) ? (
                <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">✅ Selesai</Badge>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => markDone(activeChallenge)} className="text-xs text-purple-600 hover:text-purple-800">
                  <RotateCcw className="w-3 h-3 mr-1" /> Tandai selesai
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeChallenge === 'pola-bintang' && <PolaBintangPanel onInteract={() => markDone('pola-bintang')} />}
            {activeChallenge === 'tabel-perkalian' && <TabelPerkalianPanel onInteract={() => markDone('tabel-perkalian')} />}
            {activeChallenge === 'pencarian-data' && <PencarianDataPanel onInteract={() => markDone('pencarian-data')} />}
            {activeChallenge === 'fizzbuzz' && <FizzBuzzPanel onInteract={() => markDone('fizzbuzz')} />}
          </CardContent>
        </Card>
      </div>

      {/* Completion banner */}
      {completed.size >= challenges.length && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-2 border-amber-300 shadow-lg">
            <CardHeader className="text-center">
              <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <CardTitle className="text-xl text-amber-800">🏆 Semua Tantangan Selesai!</CardTitle>
              <CardDescription className="text-amber-600">
                Kamu telah menguasai semua tantangan perulangan. Hebat sekali! 🎉
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
