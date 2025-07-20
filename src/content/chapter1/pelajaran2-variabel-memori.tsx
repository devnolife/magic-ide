"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Package, Brain, Database, Lightbulb } from 'lucide-react';
import MemoryVisualizer from '@/components/interactive/MemoryVisualizer';

interface Lesson2Props {
  onComplete?: () => void;
}

export default function Pelajaran2VariabelMemori({ onComplete }: Lesson2Props) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="text-lg px-4 py-2">
          <Package className="w-5 h-5 mr-2" />
          Pelajaran 2: Variabel dan Memori
        </Badge>
        <h1 className="text-3xl font-bold">
          Memahami Cara Komputer Menyimpan Data
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Variabel adalah wadah berlabel untuk menyimpan informasi.
          Mari kita pelajari bagaimana komputer mengorganisir dan mengingat data!
        </p>
      </div>

      {/* Main Concept */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Variabel seperti kotak penyimpanan dengan label.</strong>
              Anda bisa memasukkan berbagai barang (data) ke dalam kotak,
              memberikan nama label, dan mengambilnya kapan saja dengan menyebut labelnya.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Analogy Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-orange-600" />
              Analogi: Lemari Penyimpanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">🏠 Di Rumah Anda:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs font-bold">
                      BUKU
                    </div>
                    <span className="text-sm">📚 Novel, komik, buku pelajaran</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs font-bold">
                      PAKAIAN
                    </div>
                    <span className="text-sm">👕 Baju, celana, jaket</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs font-bold">
                      MAINAN
                    </div>
                    <span className="text-sm">🎮 Game, puzzle, boneka</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Setiap kotak memiliki label yang jelas, sehingga Anda tahu apa yang ada di dalamnya
                tanpa harus membuka semua kotak.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Dalam Memori Komputer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">💻 Di Komputer:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs font-bold">
                      nama
                    </div>
                    <span className="text-sm">"Alice"</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs font-bold">
                      umur
                    </div>
                    <span className="text-sm">25</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-12 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs font-bold">
                      hobi
                    </div>
                    <span className="text-sm">["membaca", "musik"]</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Python menggunakan nama variabel sebagai label untuk mengakses data yang tersimpan di memori.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Interactive Memory Visualizer */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Simulasi Memori Komputer</h2>

        <MemoryVisualizer
          title="Coba Sendiri: Buat dan Lihat Variabel"
          description="Variabel yang Anda buat akan muncul sebagai kotak berlabel di memori komputer"
        />
      </div>

      <Separator />

      {/* Rules and Concepts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Aturan Penamaan Variabel</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">✅ Boleh Dilakukan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  nama = "Alice"
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  umur_siswa = 16
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  nilai2 = 85
                </div>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                  isAktif = True
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li>• Dimulai dengan huruf atau underscore (_)</li>
                <li>• Bisa mengandung huruf, angka, underscore</li>
                <li>• Case-sensitive (nama ≠ Nama)</li>
                <li>• Gunakan nama yang deskriptif</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700">❌ Tidak Boleh</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  2nama = "Alice"  # Dimulai angka
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  nama-siswa = 16  # Pakai tanda minus
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  class = "XII"    # Kata reserved
                </div>
                <div className="bg-gray-900 text-red-400 p-2 rounded font-mono text-sm">
                  nama siswa = 85  # Ada spasi
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm">
                <li>• Tidak boleh dimulai dengan angka</li>
                <li>• Tidak boleh pakai spasi atau tanda baca</li>
                <li>• Tidak boleh pakai kata reserved Python</li>
                <li>• Hindari nama yang tidak bermakna (a, x, data1)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Memory Management */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-center">
            <Database className="w-5 h-5 mr-2 inline" />
            Bagaimana Python Mengelola Memori
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="text-4xl">📝</div>
              <h3 className="font-semibold">1. Deklarasi</h3>
              <p className="text-sm text-muted-foreground">
                Saat Anda menulis <code className="bg-gray-200 px-1 rounded">nama = "Alice"</code>,
                Python membuat kotak baru bernama "nama"
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl">📦</div>
              <h3 className="font-semibold">2. Penyimpanan</h3>
              <p className="text-sm text-muted-foreground">
                Python menyimpan nilai "Alice" di kotak tersebut dan mengingat
                lokasinya di memori
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-4xl">🔍</div>
              <h3 className="font-semibold">3. Pengambilan</h3>
              <p className="text-sm text-muted-foreground">
                Ketika Anda menulis <code className="bg-gray-200 px-1 rounded">print(nama)</code>,
                Python mencari kotak "nama" dan mengambil isinya
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Contoh Penggunaan Variabel</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menyimpan Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm space-y-1">
                <div className="text-green-400"># Informasi siswa</div>
                <div className="text-blue-300">nama_lengkap = "Alice Wonderland"</div>
                <div className="text-blue-300">umur = 16</div>
                <div className="text-blue-300">kelas = "XI IPA 2"</div>
                <div className="text-blue-300">rata_rata_nilai = 87.5</div>
                <div className="text-blue-300">status_aktif = True</div>
                <div className="text-white mt-2">print("Siswa:", nama_lengkap, "Umur:", umur)</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perhitungan Matematika</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm space-y-1">
                <div className="text-green-400"># Menghitung luas lingkaran</div>
                <div className="text-blue-300">phi = 3.14159</div>
                <div className="text-blue-300">jari_jari = 7</div>
                <div className="text-blue-300">luas = phi * jari_jari * jari_jari</div>
                <div className="text-white mt-2">print("Luas lingkaran:", luas)</div>
                <div className="text-yellow-300"># Output: Luas lingkaran: 153.9379</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">📝 Ringkasan Pelajaran</h3>
            <ul className="space-y-1">
              <li>• Variabel = kotak berlabel untuk menyimpan data</li>
              <li>• Nama variabel harus mengikuti aturan Python</li>
              <li>• Python mengelola memori secara otomatis</li>
              <li>• Gunakan nama variabel yang deskriptif dan bermakna</li>
              <li>• Variabel memudahkan pengelolaan dan penggunaan data</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Next Lesson Preview */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">🚀 Selanjutnya:</h3>
          <p className="text-muted-foreground">
            Pelajaran 3 - Tipe Data: Memahami jenis-jenis data yang bisa disimpan dalam variabel
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
