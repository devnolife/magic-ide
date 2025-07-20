"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Code, Users, Zap } from 'lucide-react';
import DragDropInstructions from '@/components/interactive/DragDropInstructions';

interface Lesson1Props {
  onComplete?: () => void;
}

export default function Pelajaran1ApaItuPemrograman({ onComplete }: Lesson1Props) {
  const sandwichInstructions = [
    { id: '1', text: 'Ambil 2 lembar roti tawar', order: 1 },
    { id: '2', text: 'Oleskan selai pada satu lembar roti', order: 2 },
    { id: '3', text: 'Letakkan irisan keju di atas selai', order: 3 },
    { id: '4', text: 'Tutup dengan lembar roti yang satunya', order: 4 },
    { id: '5', text: 'Potong sandwich menjadi dua bagian', order: 5 }
  ];

  const codingInstructions = [
    { id: '1', text: 'Buka editor kode Python', order: 1 },
    { id: '2', text: 'Ketik: print("Halo Dunia")', order: 2 },
    { id: '3', text: 'Simpan file dengan nama hello.py', order: 3 },
    { id: '4', text: 'Jalankan program dengan menekan Run', order: 4 },
    { id: '5', text: 'Lihat output "Halo Dunia" di layar', order: 5 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="text-lg px-4 py-2">
          <Code className="w-5 h-5 mr-2" />
          Pelajaran 1: Apa itu Pemrograman?
        </Badge>
        <h1 className="text-3xl font-bold">
          Memahami Dasar-Dasar Pemrograman
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Pemrograman adalah seni memberikan instruksi kepada komputer untuk menyelesaikan masalah.
          Mari kita mulai dengan analogi sederhana!
        </p>
      </div>

      {/* Main Concept */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Pemrograman seperti memberikan instruksi kepada robot yang sangat patuh.</strong>
              Robot ini (komputer) akan mengikuti instruksi Anda persis seperti yang Anda tulis,
              tidak lebih, tidak kurang.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Analogy Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-orange-600" />
              Dalam Kehidupan Sehari-hari
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Membuat Sandwich 🥪</h3>
              <p className="text-sm text-muted-foreground">
                Bayangkan Anda mengajar seseorang yang tidak pernah membuat sandwich.
                Anda harus memberikan instruksi yang sangat detail dan berurutan.
              </p>

              <DragDropInstructions
                title="Seret untuk Menyusun Langkah Membuat Sandwich"
                instructions={sandwichInstructions}
                correctOrder={['1', '2', '3', '4', '5']}
                analogy="Urutan yang benar sangat penting - tidak bisa menutup sandwich sebelum mengisi!"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Dalam Pemrograman
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Menulis Program "Halo Dunia" 💻</h3>
              <p className="text-sm text-muted-foreground">
                Komputer juga butuh instruksi yang detail dan berurutan untuk menampilkan
                teks "Halo Dunia" di layar.
              </p>

              <DragDropInstructions
                title="Seret untuk Menyusun Langkah Coding"
                instructions={codingInstructions}
                correctOrder={['1', '2', '3', '4', '5']}
                analogy="Komputer mengikuti instruksi ini secara berurutan, sama seperti resep!"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Key Differences */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Perbedaan Utama</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-green-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🧠</div>
              <h3 className="font-semibold">Manusia</h3>
              <ul className="text-sm space-y-2 text-left">
                <li>• Bisa menebak maksud</li>
                <li>• Fleksibel dengan instruksi</li>
                <li>• Bisa mengabaikan kesalahan kecil</li>
                <li>• Punya pengalaman sebelumnya</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">🤖</div>
              <h3 className="font-semibold">Komputer</h3>
              <ul className="text-sm space-y-2 text-left">
                <li>• Mengikuti instruksi persis</li>
                <li>• Tidak bisa menebak</li>
                <li>• Setiap kesalahan = error</li>
                <li>• Tidak punya pengalaman</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="font-semibold">Kelebihan Komputer</h3>
              <ul className="text-sm space-y-2 text-left">
                <li>• Sangat cepat</li>
                <li>• Tidak pernah lelah</li>
                <li>• Konsisten 100%</li>
                <li>• Bisa bekerja 24/7</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Programming Languages Preview */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-center">
            <Zap className="w-5 h-5 mr-2 inline" />
            Bahasa yang Digunakan untuk Berbicara dengan Komputer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Contoh dalam berbagai bahasa pemrograman:</h3>

              <div className="space-y-3">
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1"># Python</div>
                  <div className="text-blue-300">print("Halo Dunia")</div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1">// JavaScript</div>
                  <div className="text-blue-300">console.log("Halo Dunia");</div>
                </div>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm">
                  <div className="text-green-400 mb-1">/* Java */</div>
                  <div className="text-blue-300">System.out.println("Halo Dunia");</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Mengapa Python?</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mudah dibaca seperti bahasa Inggris</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sintaks yang sederhana</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cocok untuk pemula</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Digunakan di industri</span>
                </li>
              </ul>
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
              <li>• Pemrograman = memberikan instruksi detail kepada komputer</li>
              <li>• Urutan instruksi sangat penting</li>
              <li>• Komputer mengikuti instruksi persis seperti yang ditulis</li>
              <li>• Python adalah bahasa pemrograman yang ramah pemula</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Next Lesson Preview */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">🚀 Selanjutnya:</h3>
          <p className="text-muted-foreground">
            Pelajaran 2 - Variabel dan Memori: Memahami bagaimana komputer menyimpan data
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
