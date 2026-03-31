"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  PackageOpen,
  Link2,
  Database,
  Crown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface LessonProps {
  onComplete: () => void;
  isCompleted?: boolean;
}

interface Siswa {
  nama: string;
  nilai: number;
  kelas: string;
}

const sections = [
  { id: 'sorting', name: 'Urutkan & Saring', icon: ArrowUpDown, emoji: '🔮' },
  { id: 'unpacking', name: 'Bongkar List', icon: PackageOpen, emoji: '📦' },
  { id: 'zip-enum', name: 'Zip & Enumerate', icon: Link2, emoji: '🔗' },
  { id: 'tabel-data', name: 'Tabel Data Siswa', icon: Database, emoji: '📊' },
];

const dataSiswa: Siswa[] = [
  { nama: 'Aisyah', nilai: 88, kelas: 'XI-A' },
  { nama: 'Budi', nilai: 72, kelas: 'XI-B' },
  { nama: 'Citra', nilai: 95, kelas: 'XI-A' },
  { nama: 'Dimas', nilai: 60, kelas: 'XI-B' },
  { nama: 'Eka', nilai: 78, kelas: 'XI-A' },
  { nama: 'Fajar', nilai: 85, kelas: 'XI-B' },
];

export function Lesson4ListTricks({ onComplete, isCompleted }: LessonProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [visitedSections, setVisitedSections] = useState<Set<number>>(new Set([0]));

  // Section 1 state — Sorting & Filtering
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [filterMin, setFilterMin] = useState<number | null>(null);
  const [sortItems] = useState([3, 1, 4, 1, 5, 9, 2, 6]);

  // Section 2 state — Unpacking
  const [unpackStep, setUnpackStep] = useState(0);

  // Section 3 state — Zip & Enumerate
  const [showZipResult, setShowZipResult] = useState(false);
  const [showEnumResult, setShowEnumResult] = useState(false);

  // Section 4 state — Tabel Data
  const [tabelFilter, setTabelFilter] = useState<'semua' | 'lulus' | 'remedial'>('semua');
  const [tabelSort, setTabelSort] = useState<'nama' | 'nilai' | 'none'>('none');

  useEffect(() => {
    if (visitedSections.size >= 3 && !isCompleted) {
      onComplete();
    }
  }, [visitedSections, isCompleted, onComplete]);

  const navigateTo = (index: number) => {
    setActiveSection(index);
    setVisitedSections(prev => new Set([...prev, index]));
  };

  const getSortedItems = () => {
    const items = [...sortItems];
    if (sortOrder === 'asc') return items.sort((a, b) => a - b);
    if (sortOrder === 'desc') return items.sort((a, b) => b - a);
    return items;
  };

  const getFilteredItems = () => {
    const items = getSortedItems();
    if (filterMin !== null) return items.filter(x => x > filterMin);
    return items;
  };

  const getFilteredSiswa = () => {
    let result = [...dataSiswa];
    if (tabelFilter === 'lulus') result = result.filter(s => s.nilai >= 75);
    if (tabelFilter === 'remedial') result = result.filter(s => s.nilai < 75);
    if (tabelSort === 'nama') result.sort((a, b) => a.nama.localeCompare(b.nama));
    if (tabelSort === 'nilai') result.sort((a, b) => b.nilai - a.nilai);
    return result;
  };

  const rataRata = Math.round(dataSiswa.reduce((s, x) => s + x.nilai, 0) / dataSiswa.length);
  const siswaLulus = dataSiswa.filter(s => s.nilai >= 75);
  const siswaTerbaik = dataSiswa.reduce((best, s) => s.nilai > best.nilai ? s : best);

  // Unpacking demo data
  const unpackDemos = [
    { title: 'Unpacking Dasar', code: 'a, b, c = [10, 20, 30]', vars: [{ name: 'a', val: '10' }, { name: 'b', val: '20' }, { name: 'c', val: '30' }] },
    { title: 'Star Unpacking', code: 'first, *rest = [1, 2, 3, 4, 5]', vars: [{ name: 'first', val: '1' }, { name: '*rest', val: '[2, 3, 4, 5]' }] },
    { title: 'Tukar Variabel', code: 'a, b = b, a  # a=5, b=3 → a=3, b=5', vars: [{ name: 'a', val: '3 ← (dulunya 5)' }, { name: 'b', val: '5 ← (dulunya 3)' }] },
  ];

  // Zip & Enumerate data
  const namaList = ['Ali', 'Budi', 'Citra'];
  const nilaiList = [85, 92, 78];

  const renderSorting = () => (
    <div className="space-y-5">
      <Card className="bg-white border-purple-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-purple-500" />
            🔮 Mengurutkan & Menyaring List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{`angka = [3, 1, 4, 1, 5, 9, 2, 6]

# Mengurutkan (tidak mengubah asli)
sorted(angka)           # [1, 1, 2, 3, 4, 5, 6, 9]
sorted(angka, reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Menyaring dengan list comprehension
[x for x in angka if x > 5]  # [9, 6]`}</pre>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold mb-3">✨ Coba sendiri — klik tombol di bawah:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" variant={sortOrder === 'none' ? 'default' : 'outline'} className={sortOrder === 'none' ? 'bg-purple-600 hover:bg-purple-700' : ''} onClick={() => { setSortOrder('none'); setFilterMin(null); }}>
                <RotateCcw className="w-3 h-3 mr-1" /> Asli
              </Button>
              <Button size="sm" variant={sortOrder === 'asc' ? 'default' : 'outline'} className={sortOrder === 'asc' ? 'bg-purple-600 hover:bg-purple-700' : ''} onClick={() => setSortOrder('asc')}>
                sorted() ↑
              </Button>
              <Button size="sm" variant={sortOrder === 'desc' ? 'default' : 'outline'} className={sortOrder === 'desc' ? 'bg-purple-600 hover:bg-purple-700' : ''} onClick={() => setSortOrder('desc')}>
                sorted(reverse) ↓
              </Button>
              <Button size="sm" variant={filterMin === 5 ? 'default' : 'outline'} className={filterMin === 5 ? 'bg-amber-600 hover:bg-amber-700' : ''} onClick={() => setFilterMin(filterMin === 5 ? null : 5)}>
                Filter {'>'} 5
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {getFilteredItems().map((num, i) => (
                  <motion.div
                    key={`${num}-${i}-${sortOrder}-${filterMin}`}
                    layout
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
                  >
                    {num}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-800">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Tips Penyihir:</strong> <code className="bg-purple-100 px-1 rounded">sorted()</code> membuat list baru tanpa mengubah yang asli. Cocok untuk menampilkan data tanpa merusak urutan awal!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUnpacking = () => (
    <div className="space-y-5">
      <Card className="bg-white border-blue-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-blue-500" />
            📦 Membongkar List (Unpacking)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{`# Unpacking dasar
a, b, c = [10, 20, 30]
print(a)  # 10

# Star unpacking — ambil sisanya
first, *rest = [1, 2, 3, 4, 5]
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

# Tukar variabel tanpa temp!
a, b = b, a`}</pre>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold mb-3">✨ Lihat bagaimana nilai mengalir ke variabel:</h4>
            <div className="flex gap-2 mb-4">
              {unpackDemos.map((demo, i) => (
                <Button key={i} size="sm" variant={unpackStep === i ? 'default' : 'outline'} className={unpackStep === i ? 'bg-blue-600 hover:bg-blue-700' : ''} onClick={() => setUnpackStep(i)}>
                  {demo.title}
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={unpackStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <code className="text-blue-800 font-mono text-sm block mb-3">{unpackDemos[unpackStep].code}</code>
                <div className="flex flex-wrap gap-3 mt-2">
                  {unpackDemos[unpackStep].vars.map((v, i) => (
                    <motion.div
                      key={v.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-2 bg-white border border-blue-300 rounded-lg px-3 py-2 shadow-sm"
                    >
                      <span className="font-mono font-bold text-blue-700">{v.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-indigo-600">{v.val}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Tips Penyihir:</strong> Unpacking membuat kode lebih ringkas. <code className="bg-blue-100 px-1 rounded">a, b = b, a</code> adalah cara Python yang elegan untuk menukar variabel!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderZipEnum = () => (
    <div className="space-y-5">
      <Card className="bg-white border-emerald-300 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-500" />
            🔗 Zip & Enumerate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{`nama  = ['Ali', 'Budi', 'Citra']
nilai = [85, 92, 78]

# enumerate — beri nomor urut
for i, n in enumerate(nama):
    print(f"{i}. {n}")

# zip — gabungkan dua list
for n, v in zip(nama, nilai):
    print(f"{n}: {v}")

# Buat dictionary dari zip
rapor = dict(zip(nama, nilai))
# {'Ali': 85, 'Budi': 92, 'Citra': 78}`}</pre>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Enumerate Demo */}
            <div>
              <Button size="sm" className={`mb-3 ${showEnumResult ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-600 hover:bg-gray-700'}`} onClick={() => setShowEnumResult(!showEnumResult)}>
                <Play className="w-3 h-3 mr-1" /> {showEnumResult ? 'Sembunyikan' : 'Jalankan'} enumerate()
              </Button>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 min-h-[120px]">
                <div className="text-sm font-semibold text-emerald-700 mb-2">enumerate(nama):</div>
                <AnimatePresence>
                  {showEnumResult && namaList.map((n, i) => (
                    <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="font-mono text-sm text-gray-700 mb-1">
                      <span className="text-emerald-600 font-bold">{i}</span>. {n}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Zip Demo */}
            <div>
              <Button size="sm" className={`mb-3 ${showZipResult ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-600 hover:bg-gray-700'}`} onClick={() => setShowZipResult(!showZipResult)}>
                <Play className="w-3 h-3 mr-1" /> {showZipResult ? 'Sembunyikan' : 'Jalankan'} zip()
              </Button>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 min-h-[120px]">
                <div className="text-sm font-semibold text-teal-700 mb-2">zip(nama, nilai):</div>
                <AnimatePresence>
                  {showZipResult && namaList.map((n, i) => (
                    <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="font-mono text-sm text-gray-700 mb-1">
                      <span className="text-teal-700 font-bold">{n}</span>: <span className="text-indigo-600">{nilaiList[i]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              <Sparkles className="w-4 h-4 inline mr-1" />
              <strong>Tips Penyihir:</strong> <code className="bg-emerald-100 px-1 rounded">zip()</code> sangat berguna untuk menggabungkan data yang berkaitan dari list yang terpisah, seperti nama dan nilai siswa!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabelData = () => {
    const filtered = getFilteredSiswa();
    return (
      <div className="space-y-5">
        <Card className="bg-white border-amber-300 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              📊 List sebagai Tabel Data Siswa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="bg-gray-900 rounded-lg p-4">
              <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap">{`siswa = [
  {"nama": "Aisyah", "nilai": 88, "kelas": "XI-A"},
  {"nama": "Budi",   "nilai": 72, "kelas": "XI-B"},
  ...
]

# Cari yang lulus (KKM ≥ 75)
lulus = [s['nama'] for s in siswa if s['nilai'] >= 75]

# Rata-rata nilai
rata = sum(s['nilai'] for s in siswa) / len(siswa)

# Siswa dengan nilai tertinggi
terbaik = max(siswa, key=lambda s: s['nilai'])`}</pre>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Button size="sm" variant={tabelFilter === 'semua' ? 'default' : 'outline'} className={tabelFilter === 'semua' ? 'bg-amber-600 hover:bg-amber-700' : ''} onClick={() => setTabelFilter('semua')}>
                Semua
              </Button>
              <Button size="sm" variant={tabelFilter === 'lulus' ? 'default' : 'outline'} className={tabelFilter === 'lulus' ? 'bg-green-600 hover:bg-green-700' : ''} onClick={() => setTabelFilter('lulus')}>
                ✅ Lulus (≥75)
              </Button>
              <Button size="sm" variant={tabelFilter === 'remedial' ? 'default' : 'outline'} className={tabelFilter === 'remedial' ? 'bg-red-600 hover:bg-red-700' : ''} onClick={() => setTabelFilter('remedial')}>
                ❌ Remedial
              </Button>
              <span className="border-l border-gray-300 mx-1" />
              <Button size="sm" variant={tabelSort === 'nama' ? 'default' : 'outline'} className={tabelSort === 'nama' ? 'bg-indigo-600 hover:bg-indigo-700' : ''} onClick={() => setTabelSort(tabelSort === 'nama' ? 'none' : 'nama')}>
                Urutkan Nama
              </Button>
              <Button size="sm" variant={tabelSort === 'nilai' ? 'default' : 'outline'} className={tabelSort === 'nilai' ? 'bg-indigo-600 hover:bg-indigo-700' : ''} onClick={() => setTabelSort(tabelSort === 'nilai' ? 'none' : 'nilai')}>
                Urutkan Nilai ↓
              </Button>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-700">#</th>
                    <th className="px-3 py-2 text-left text-gray-700">Nama</th>
                    <th className="px-3 py-2 text-left text-gray-700">Kelas</th>
                    <th className="px-3 py-2 text-left text-gray-700">Nilai</th>
                    <th className="px-3 py-2 text-left text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((s, i) => (
                      <motion.tr
                        key={s.nama}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-t border-gray-100 ${s.nama === siswaTerbaik.nama ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {s.nama} {s.nama === siswaTerbaik.nama && '🏆'}
                        </td>
                        <td className="px-3 py-2 text-gray-600">{s.kelas}</td>
                        <td className="px-3 py-2 font-mono font-bold text-gray-800">{s.nilai}</td>
                        <td className="px-3 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.nilai >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {s.nilai >= 75 ? 'Lulus' : 'Remedial'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 mb-1">Rata-rata</div>
                <div className="text-xl font-bold text-blue-800">{rataRata}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 mb-1">Lulus</div>
                <div className="text-xl font-bold text-green-800">{siswaLulus.length}/{dataSiswa.length}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-xs text-yellow-600 mb-1">Terbaik</div>
                <div className="text-lg font-bold text-yellow-800">{siswaTerbaik.nama}</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <Sparkles className="w-4 h-4 inline mr-1" />
                <strong>Tips Penyihir:</strong> List of dictionaries adalah cara paling umum menyimpan data tabel di Python. Kombinasikan dengan list comprehension untuk query data layaknya database!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const sectionRenderers = [renderSorting, renderUnpacking, renderZipEnum, renderTabelData];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">✨ Trik Praktis List Python</h2>
            <p className="text-amber-600 text-sm">Teknik-teknik list yang sering dipakai programmer Python</p>
          </div>
        </div>
      </motion.div>

      {/* Section Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const visited = visitedSections.has(index);
          return (
            <motion.div key={section.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant={activeSection === index ? 'default' : 'outline'}
                className={`h-auto p-3 w-full relative ${activeSection === index
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white'
                  : 'bg-white border-gray-200 text-gray-700'
                }`}
                onClick={() => navigateTo(index)}
              >
                <div className="text-center w-full">
                  <div className="text-xl mb-1">{section.emoji}</div>
                  <div className="font-semibold text-xs leading-tight">{section.name}</div>
                </div>
                {visited && (
                  <CheckCircle className="w-4 h-4 text-green-400 absolute top-1 right-1" />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span>Dikunjungi: {visitedSections.size}/4</span>
        {visitedSections.size >= 3 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Selesai!
          </motion.span>
        )}
      </div>

      {/* Active Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {sectionRenderers[activeSection]()}
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next Buttons */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          disabled={activeSection === 0}
          onClick={() => navigateTo(activeSection - 1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
        </Button>
        <Button
          variant="outline"
          disabled={activeSection === sections.length - 1}
          onClick={() => navigateTo(activeSection + 1)}
        >
          Selanjutnya <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}


