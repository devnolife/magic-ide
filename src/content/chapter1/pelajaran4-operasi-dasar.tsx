"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calculator, Lightbulb, Zap, ArrowRight } from 'lucide-react';
import OperationAnimator from '@/components/interactive/OperationAnimator';
import VariableAssignmentDemo from '@/components/interactive/VariableAssignmentDemo';

interface Lesson4Props {
  onComplete?: () => void;
}

export default function Pelajaran4OperasiDasar({ onComplete }: Lesson4Props) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="text-lg px-4 py-2">
          <Calculator className="w-5 h-5 mr-2" />
          Pelajaran 4: Operasi Dasar
        </Badge>
        <h1 className="text-3xl font-bold">
          Melakukan Operasi pada Data
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Setelah memahami tipe data, sekarang mari belajar bagaimana mengoperasikan
          dan memanipulasi data tersebut dalam Python.
        </p>
      </div>

      {/* Main Concept */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Operasi seperti instruksi untuk mengolah data.</strong>
              Sama seperti kalkulator yang bisa menambah, mengurang, mengalikan -
              Python juga punya aturan untuk mengoperasikan berbagai jenis data.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Interactive Operation Animator */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Simulasi Operasi Interaktif</h2>

        <OperationAnimator
          title="Lihat Bagaimana Operasi Bekerja"
          description="Klik operasi untuk melihat animasi bagaimana Python memproses data"
        />
      </div>

      <Separator />

      {/* Mathematical Operations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Operasi Matematika</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">🔢 Operasi Aritmatika Dasar</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">5 + 3</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">8</span>
                    <span className="text-sm text-muted-foreground">Penjumlahan</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">10 - 4</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">6</span>
                    <span className="text-sm text-muted-foreground">Pengurangan</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">6 * 2</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">12</span>
                    <span className="text-sm text-muted-foreground">Perkalian</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">15 / 3</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">5.0</span>
                    <span className="text-sm text-muted-foreground">Pembagian</span>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-2"># Contoh perhitungan</div>
                  <div className="text-blue-300">hasil = 10 + 5 * 2</div>
                  <div className="text-blue-300">print(hasil)  # 20 (bukan 30!)</div>
                  <div className="text-yellow-300"># Urutan operasi: * dahulu, + kemudian</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">⚡ Operasi Lanjutan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">17 // 5</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">3</span>
                    <span className="text-sm text-muted-foreground">Pembagian Bulat</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">17 % 5</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">2</span>
                    <span className="text-sm text-muted-foreground">Sisa Bagi (Modulo)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">2 ** 3</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">8</span>
                    <span className="text-sm text-muted-foreground">Pangkat (2³)</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">abs(-5)</span>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                    <span className="font-bold">5</span>
                    <span className="text-sm text-muted-foreground">Nilai Absolut</span>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-2"># Operasi berguna</div>
                  <div className="text-blue-3000">cek_genap = 10 % 2  # 0 = genap</div>
                  <div className="text-blue-300">kuadrat = 5 ** 2    # 25</div>
                  <div className="text-blue-300">jarak = abs(-3)     # 3</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* String Operations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Operasi String (Teks)</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700">📝 Penggabungan String</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded">
                    <div className="font-mono text-sm mb-2">"Halo" + " " + "Dunia"</div>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-blue-200 rounded text-xs">Halo</div>
                      <span>+</span>
                      <div className="px-2 py-1 bg-blue-200 rounded text-xs"> </div>
                      <span>+</span>
                      <div className="px-2 py-1 bg-blue-200 rounded text-xs">Dunia</div>
                      <ArrowRight className="w-4 h-4" />
                      <div className="px-2 py-1 bg-green-200 rounded text-xs">Halo Dunia</div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-100 rounded">
                    <div className="font-mono text-sm mb-2">"Python" * 3</div>
                    <div className="flex items-center space-x-2">
                      <div className="px-2 py-1 bg-blue-200 rounded text-xs">Python</div>
                      <span>× 3</span>
                      <ArrowRight className="w-4 h-4" />
                      <div className="px-2 py-1 bg-green-200 rounded text-xs">PythonPythonPython</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-2"># Contoh penggabungan</div>
                  <div className="text-blue-300">nama = "Alice"</div>
                  <div className="text-blue-300">salam = "Halo " + nama + "!"</div>
                  <div className="text-blue-300">print(salam)  # Halo Alice!</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700">🔧 Operasi String Lanjutan</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="p-2 bg-gray-100 rounded">
                    <div className="font-mono text-sm">len("Python")</div>
                    <div className="text-xs text-muted-foreground">Panjang string → 6</div>
                  </div>

                  <div className="p-2 bg-gray-100 rounded">
                    <div className="font-mono text-sm">"HELLO".lower()</div>
                    <div className="text-xs text-muted-foreground">Huruf kecil → "hello"</div>
                  </div>

                  <div className="p-2 bg-gray-100 rounded">
                    <div className="font-mono text-sm">"hello".upper()</div>
                    <div className="text-xs text-muted-foreground">Huruf besar → "HELLO"</div>
                  </div>

                  <div className="p-2 bg-gray-100 rounded">
                    <div className="font-mono text-sm">"Python" in "I love Python"</div>
                    <div className="text-xs text-muted-foreground">Cek keberadaan → True</div>
                  </div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-2"># String methods</div>
                  <div className="text-blue-300">teks = "Belajar Python"</div>
                  <div className="text-blue-300">print(len(teks))     # 14</div>
                  <div className="text-blue-300">print(teks.upper())  # BELAJAR PYTHON</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Variable Assignment Demo */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Cara Kerja Assignment Variabel</h2>

        <VariableAssignmentDemo
          title="Demo: Bagaimana Nilai Berpindah Antar Variabel"
          description="Pelajari konsep penting: assignment menyalin nilai, bukan membuat koneksi"
        />
      </div>

      <Separator />

      {/* Comparison Operations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Operasi Perbandingan</h2>

        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-700">⚖️ Membandingkan Nilai</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Operator Perbandingan:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">5 == 5</span>
                    <span className="text-green-600 font-bold">True</span>
                    <span className="text-sm text-muted-foreground">Sama dengan</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">5 != 3</span>
                    <span className="text-green-600 font-bold">True</span>
                    <span className="text-sm text-muted-foreground">Tidak sama</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">7 &gt; 5</span>
                    <span className="text-green-600 font-bold">True</span>
                    <span className="text-sm text-muted-foreground">Lebih besar</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span className="font-mono">3 &lt; 10</span>
                    <span className="text-green-600 font-bold">True</span>
                    <span className="text-sm text-muted-foreground">Lebih kecil</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Contoh Penggunaan:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-2"># Contoh perbandingan</div>
                  <div className="text-blue-300">umur = 17</div>
                  <div className="text-blue-300">bisa_nyetir = umur &gt;= 17</div>
                  <div className="text-blue-300">print(bisa_nyetir)  # True</div>
                  <div className="text-white mt-2">nilai = 85</div>
                  <div className="text-white">lulus = nilai &gt;= 70</div>
                  <div className="text-white">print("Lulus:", lulus)  # True</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logical Operations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Operasi Logika</h2>

        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700">🧠 Operasi Boolean</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-center">AND (dan)</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">True and True</div>
                    <div className="text-green-600 font-bold">True</div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">True and False</div>
                    <div className="text-red-600 font-bold">False</div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">False and False</div>
                    <div className="text-red-600 font-bold">False</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Benar jika SEMUA kondisi benar
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-center">OR (atau)</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">True or False</div>
                    <div className="text-green-600 font-bold">True</div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">False or True</div>
                    <div className="text-green-600 font-bold">True</div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">False or False</div>
                    <div className="text-red-600 font-bold">False</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Benar jika SALAH SATU kondisi benar
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-center">NOT (tidak)</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">not True</div>
                    <div className="text-red-600 font-bold">False</div>
                  </div>
                  <div className="p-2 bg-gray-100 rounded text-center">
                    <div className="font-mono text-sm">not False</div>
                    <div className="text-green-600 font-bold">True</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Membalik nilai boolean
                </p>
              </div>
            </div>

            <div className="mt-6 bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <div className="text-green-400 mb-2"># Contoh operasi logika</div>
              <div className="text-blue-300">umur = 18</div>
              <div className="text-blue-300">punya_sim = True</div>
              <div className="text-blue-300">boleh_nyetir = umur &gt;= 17 and punya_sim</div>
              <div className="text-blue-300">print(boleh_nyetir)  # True</div>
              <div className="text-white mt-2">cuaca_cerah = False</div>
              <div className="text-white">ada_payung = True</div>
              <div className="text-white">jalan_jalan = cuaca_cerah or ada_payung</div>
              <div className="text-white">print(jalan_jalan)  # True</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order of Operations */}
      <Card className="border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="text-yellow-700">
            <Zap className="w-5 h-5 mr-2 inline" />
            Urutan Operasi (Operator Precedence)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Python mengikuti urutan operasi matematika yang sama seperti di sekolah:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Urutan Prioritas (dari tinggi ke rendah):</h4>
                <ol className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-red-100 text-red-800">1</Badge>
                    <span>Tanda kurung ( )</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-orange-100 text-orange-800">2</Badge>
                    <span>Pangkat **</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
                    <span>Perkalian *, Pembagian /, Modulo %</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">4</Badge>
                    <span>Penjumlahan +, Pengurangan -</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">5</Badge>
                    <span>Perbandingan ==, !=, &lt;, &gt;</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">6</Badge>
                    <span>Logika not, and, or</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Contoh Perhitungan:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-2">
                  <div>
                    <div className="text-green-400"># Tanpa kurung</div>
                    <div className="text-blue-300">hasil1 = 2 + 3 * 4</div>
                    <div className="text-yellow-300"># = 2 + 12 = 14</div>
                  </div>

                  <div>
                    <div className="text-green-400"># Dengan kurung</div>
                    <div className="text-blue-300">hasil2 = (2 + 3) * 4</div>
                    <div className="text-yellow-300"># = 5 * 4 = 20</div>
                  </div>

                  <div>
                    <div className="text-green-400"># Operasi kompleks</div>
                    <div className="text-blue-300">hasil3 = 2 ** 3 + 1</div>
                    <div className="text-yellow-300"># = 8 + 1 = 9</div>
                  </div>
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
              <li>• Python mendukung operasi matematika dasar (+, -, *, /, **, %, //)</li>
              <li>• String dapat digabung (+) dan diulang (*)</li>
              <li>• Assignment (=) menyalin nilai, bukan membuat koneksi</li>
              <li>• Operasi perbandingan menghasilkan nilai Boolean</li>
              <li>• Operasi logika (and, or, not) untuk kondisi kompleks</li>
              <li>• Urutan operasi mengikuti aturan matematika</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Completion */}
      <Card className="border-gold-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-2xl font-bold">Selamat!</h3>
            <p className="text-lg">
              Anda telah menyelesaikan Chapter 1: Dasar-Dasar Pemrograman
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Yang telah Anda pelajari:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Konsep dasar pemrograman dan analogi dengan kehidupan sehari-hari</li>
                <li>✅ Variabel sebagai wadah data dan cara kerja memori komputer</li>
                <li>✅ Berbagai tipe data Python dan karakteristiknya</li>
                <li>✅ Operasi dasar untuk memanipulasi dan mengolah data</li>
              </ul>
            </div>
            <Badge className="text-lg px-6 py-2 bg-green-100 text-green-800">
              Siap untuk Chapter 2: Python Lists! 🐍
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
