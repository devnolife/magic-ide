"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tags, Lightbulb, Zap, FileText } from 'lucide-react';
import TypeChecker from '@/components/interactive/TypeChecker';

interface Lesson3Props {
  onComplete?: () => void;
}

export default function Pelajaran3TipeData({ onComplete }: Lesson3Props) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="text-lg px-4 py-2">
          <Tags className="w-5 h-5 mr-2" />
          Pelajaran 3: Tipe Data
        </Badge>
        <h1 className="text-3xl font-bold">
          Mengenal Jenis-Jenis Data dalam Python
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Setiap data memiliki jenis atau tipe yang berbeda. Python perlu mengetahui tipe data
          untuk memproses informasi dengan benar.
        </p>
      </div>

      {/* Main Concept */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Tipe data seperti kategori barang di toko.</strong>
              Setiap kategori memiliki karakteristik dan aturan berbeda.
              Python perlu tahu apakah data itu angka (untuk dihitung) atau teks (untuk ditampilkan).
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Analogy Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-600" />
              Analogi: Kotak Surat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Bayangkan kotak surat dengan berbagai jenis surat yang perlu diperlakukan berbeda:
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs font-bold">
                    SURAT
                  </div>
                  <div>
                    <div className="font-semibold">📝 Surat Teks</div>
                    <div className="text-xs text-muted-foreground">Dibaca, dibalas</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs font-bold">
                    TAGIHAN
                  </div>
                  <div>
                    <div className="font-semibold">💰 Tagihan (Angka)</div>
                    <div className="text-xs text-muted-foreground">Dihitung, dibayar</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs font-bold">
                    UNDANGAN
                  </div>
                  <div>
                    <div className="font-semibold">✅ RSVP (Ya/Tidak)</div>
                    <div className="text-xs text-muted-foreground">Keputusan benar/salah</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Dalam Python
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Python juga perlu mengetahui jenis data untuk memprosesnya dengan benar:
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-blue-200 rounded border-2 border-blue-400 flex items-center justify-center text-xs font-bold">
                    str
                  </div>
                  <div>
                    <div className="font-semibold">📝 String (Teks)</div>
                    <div className="text-xs text-muted-foreground">Ditampilkan, digabung</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-green-200 rounded border-2 border-green-400 flex items-center justify-center text-xs font-bold">
                    int
                  </div>
                  <div>
                    <div className="font-semibold">🔢 Integer (Bilangan)</div>
                    <div className="text-xs text-muted-foreground">Dihitung, dioperasi</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-20 h-12 bg-purple-200 rounded border-2 border-purple-400 flex items-center justify-center text-xs font-bold">
                    bool
                  </div>
                  <div>
                    <div className="font-semibold">✅ Boolean (True/False)</div>
                    <div className="text-xs text-muted-foreground">Logika, keputusan</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Interactive Type Checker */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Pemeriksa Tipe Data Interaktif</h2>

        <TypeChecker
          title="Jelajahi Tipe Data Python"
          description="Klik contoh atau masukkan nilai sendiri untuk melihat tipe datanya"
        />
      </div>

      <Separator />

      {/* Detailed Type Explanations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Penjelasan Detail Setiap Tipe Data</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* String */}
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-700">
                📝 String (str) - Teks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  String adalah tipe data untuk menyimpan teks. Selalu diapit dengan tanda kutip.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">nama = "Alice"</div>
                  <div className="text-blue-300">pesan = 'Halo Dunia!'</div>
                  <div className="text-blue-300">alamat = "Jl. Merdeka No. 17"</div>
                  <div className="text-blue-3000">angka_teks = "123"  # Ini string, bukan angka!</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Diapit tanda kutip (" atau ')</li>
                    <li>• Bisa berisi huruf, angka, simbol</li>
                    <li>• Bisa digabung dengan operator +</li>
                    <li>• Bisa kosong: ""</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integer */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-700">
                🔢 Integer (int) - Bilangan Bulat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Integer adalah bilangan bulat (tanpa koma) yang bisa positif, negatif, atau nol.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-300">umur = 25</div>
                  <div className="text-green-300">jumlah_siswa = 30</div>
                  <div className="text-green-300">suhu = -5</div>
                  <div className="text-green-300">saldo = 0</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Tidak ada koma/titik desimal</li>
                    <li>• Bisa positif, negatif, atau nol</li>
                    <li>• Bisa dioperasi matematika</li>
                    <li>• Tidak dibatasi ukuran (dalam Python)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Float */}
          <Card className="border-yellow-200">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="flex items-center text-yellow-700">
                💯 Float (float) - Bilangan Desimal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Float adalah bilangan yang memiliki titik desimal (koma dalam bahasa Indonesia).
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-yellow-300">tinggi_badan = 165.5</div>
                  <div className="text-yellow-300">harga = 19.99</div>
                  <div className="text-yellow-300">pi = 3.14159</div>
                  <div className="text-yellow-300">persentase = 87.5</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Memiliki titik desimal (.)</li>
                    <li>• Lebih presisi untuk perhitungan</li>
                    <li>• Bisa dioperasi matematika</li>
                    <li>• Hasil pembagian biasanya float</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boolean */}
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="flex items-center text-purple-700">
                ✅ Boolean (bool) - Benar/Salah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Boolean hanya memiliki dua nilai: True (benar) atau False (salah).
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-purple-300">is_siswa = True</div>
                  <div className="text-purple-300">sudah_lulus = False</div>
                  <div className="text-purple-300">is_aktif = True</div>
                  <div className="text-purple-300">sudah_bayar = False</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Hanya True atau False</li>
                    <li>• Huruf pertama kapital</li>
                    <li>• Hasil dari perbandingan</li>
                    <li>• Digunakan untuk logika/keputusan</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* List */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center text-orange-700">
                📋 List (list) - Daftar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  List adalah kumpulan data yang disimpan dalam satu variabel, diurutkan dengan indeks.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-orange-300">warna = ["merah", "biru", "hijau"]</div>
                  <div className="text-orange-300">angka = [1, 2, 3, 4, 5]</div>
                  <div className="text-orange-300">campuran = ["Alice", 25, True]</div>
                  <div className="text-orange-300">kosong = []</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Diapit kurung siku [ ]</li>
                    <li>• Elemen dipisah koma</li>
                    <li>• Bisa berisi berbagai tipe data</li>
                    <li>• Indeks dimulai dari 0</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* None */}
          <Card className="border-gray-200">
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center text-gray-700">
                ⭕ None (NoneType) - Kosong
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  None adalah tipe data khusus yang menyatakan "tidak ada nilai" atau "kosong".
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-gray-300">data = None</div>
                  <div className="text-gray-300">hasil = None</div>
                  <div className="text-gray-300">nilai_default = None</div>
                </div>

                <div className="text-sm space-y-1">
                  <div><strong>Karakteristik:</strong></div>
                  <ul className="ml-4 space-y-1">
                    <li>• Menunjukkan ketiadaan nilai</li>
                    <li>• Berbeda dengan 0 atau ""</li>
                    <li>• Sering digunakan sebagai default</li>
                    <li>• Hanya ada satu nilai: None</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Type Conversion */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-center">
            <Zap className="w-5 h-5 mr-2 inline" />
            Konversi Antar Tipe Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Python dapat mengubah tipe data dengan fungsi konversi:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Mengubah ke String:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">angka = 123</div>
                  <div className="text-blue-300">teks = str(angka)  # "123"</div>
                  <div className="text-blue-300">bool_teks = str(True)  # "True"</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Mengubah ke Integer:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-300">teks = "456"</div>
                  <div className="text-green-300">angka = int(teks)  # 456</div>
                  <div className="text-green-300">dari_float = int(7.9)  # 7</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Mengubah ke Float:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-yellow-300">teks = "3.14"</div>
                  <div className="text-yellow-300">desimal = float(teks)  # 3.14</div>
                  <div className="text-yellow-300">dari_int = float(5)  # 5.0</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Mengubah ke Boolean:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-purple-300">bool(1)      # True</div>
                  <div className="text-purple-300">bool(0)      # False</div>
                  <div className="text-purple-300">bool("hi")   # True</div>
                  <div className="text-purple-300">bool("")     # False</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">📝 Ringkasan Pelajaran</h3>
            <ul className="space-y-1">
              <li>• Python memiliki berbagai tipe data untuk keperluan berbeda</li>
              <li>• String (str) untuk teks, Integer (int) untuk bilangan bulat</li>
              <li>• Float untuk bilangan desimal, Boolean untuk True/False</li>
              <li>• List untuk menyimpan kumpulan data, None untuk nilai kosong</li>
              <li>• Tipe data dapat dikonversi menggunakan fungsi konversi</li>
              <li>• Memahami tipe data penting untuk operasi yang benar</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Next Lesson Preview */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">🚀 Selanjutnya:</h3>
          <p className="text-muted-foreground">
            Pelajaran 4 - Operasi Dasar: Belajar melakukan operasi matematika dan manipulasi data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
