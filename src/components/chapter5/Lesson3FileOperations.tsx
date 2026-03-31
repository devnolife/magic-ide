"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Play, Target, FolderOpen, PenLine, BookOpen, Info, Monitor, Download } from 'lucide-react';

interface Lesson3FileOperationsProps {
  onComplete: () => void;
}

interface FileState {
  name: string;
  content: string;
  isOpen: boolean;
  mode: 'r' | 'w' | 'a' | 'closed';
  cursor: number;
}

export function Lesson3FileOperations({ onComplete }: Lesson3FileOperationsProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [fileState, setFileState] = useState<FileState>({
    name: 'data.txt',
    content: 'Hello, Python!\nBelajar File I/O\nBaris ketiga',
    isOpen: false,
    mode: 'closed',
    cursor: 0,
  });
  const [output, setOutput] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [writeInput, setWriteInput] = useState('Teks baru dari Python!');
  const [conceptStep, setConceptStep] = useState(0);

  const concepts = [
    {
      title: 'open() — Membuka File',
      code: `# Mode baca ('r') - default\nfile = open("data.txt", "r")\n\n# Mode tulis ('w') - menimpa isi\nfile = open("data.txt", "w")\n\n# Mode tambah ('a') - menambahkan di akhir\nfile = open("data.txt", "a")`,
      explanation: 'Fungsi open() membuka file dengan mode tertentu. Mode "r" untuk baca, "w" untuk tulis (menimpa), "a" untuk menambahkan.',
    },
    {
      title: 'read() & readlines()',
      code: `file = open("data.txt", "r")\n\n# Baca semua isi\nisi = file.read()\nprint(isi)\n\n# Baca per baris\nfile.seek(0)\nbaris = file.readlines()\nfor b in baris:\n    print(b.strip())\n\nfile.close()`,
      explanation: 'read() membaca seluruh isi file. readlines() membaca semua baris sebagai list. Jangan lupa close() setelah selesai!',
    },
    {
      title: 'write() — Menulis File',
      code: `file = open("output.txt", "w")\nfile.write("Baris pertama\\n")\nfile.write("Baris kedua\\n")\nfile.close()\n\n# Mode append\nfile = open("output.txt", "a")\nfile.write("Baris tambahan\\n")\nfile.close()`,
      explanation: 'write() menulis teks ke file. Mode "w" menimpa isi lama, mode "a" menambahkan tanpa menghapus.',
    },
    {
      title: 'with/as — Context Manager (Pengelola Konteks)',
      code: `# Cara terbaik! File otomatis ditutup\nwith open("data.txt", "r") as file:\n    isi = file.read()\n    print(isi)\n# file sudah otomatis tertutup di sini\n\nwith open("output.txt", "w") as file:\n    file.write("Aman dan rapi!")`,
      explanation: 'Keyword "with" adalah cara terbaik membuka file. File otomatis ditutup setelah blok with selesai, bahkan jika terjadi error.',
    },
  ];

  const simulateRead = async () => {
    setIsAnimating(true);
    setOutput([]);

    setOutput(prev => [...prev, `>>> open("${fileState.name}", "r")`]);
    setFileState(prev => ({ ...prev, isOpen: true, mode: 'r', cursor: 0 }));
    await new Promise(r => setTimeout(r, 700));

    setOutput(prev => [...prev, '>>> file.read()']);
    await new Promise(r => setTimeout(r, 500));

    const lines = fileState.content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      setFileState(prev => ({ ...prev, cursor: i + 1 }));
      setOutput(prev => [...prev, `   "${lines[i]}"`]);
      await new Promise(r => setTimeout(r, 500));
    }

    setOutput(prev => [...prev, '>>> file.close()']);
    setFileState(prev => ({ ...prev, isOpen: false, mode: 'closed', cursor: 0 }));
    await new Promise(r => setTimeout(r, 300));
    setOutput(prev => [...prev, '✅ File ditutup dengan aman']);

    setIsAnimating(false);
    if (!completedTasks.includes('read_file')) {
      setCompletedTasks(prev => [...prev, 'read_file']);
    }
  };

  const simulateWrite = async () => {
    setIsAnimating(true);
    setOutput([]);

    setOutput(prev => [...prev, `>>> open("${fileState.name}", "w")`]);
    setFileState(prev => ({ ...prev, isOpen: true, mode: 'w', content: '', cursor: 0 }));
    await new Promise(r => setTimeout(r, 700));

    setOutput(prev => [...prev, `>>> file.write("${writeInput}")`]);
    await new Promise(r => setTimeout(r, 500));

    const chars = writeInput.split('');
    let written = '';
    for (let i = 0; i < chars.length; i++) {
      written += chars[i];
      if (i % 3 === 0 || i === chars.length - 1) {
        setFileState(prev => ({ ...prev, content: written, cursor: i + 1 }));
        await new Promise(r => setTimeout(r, 80));
      }
    }

    setOutput(prev => [...prev, `   ${writeInput.length} karakter ditulis`]);
    await new Promise(r => setTimeout(r, 400));

    setOutput(prev => [...prev, '>>> file.close()']);
    setFileState(prev => ({ ...prev, isOpen: false, mode: 'closed' }));
    await new Promise(r => setTimeout(r, 300));
    setOutput(prev => [...prev, '✅ File ditulis dan ditutup']);

    setIsAnimating(false);
    if (!completedTasks.includes('write_file')) {
      setCompletedTasks(prev => [...prev, 'write_file']);
    }
  };

  const simulateAppend = async () => {
    setIsAnimating(true);
    setOutput([]);

    setOutput(prev => [...prev, `>>> open("${fileState.name}", "a")`]);
    setFileState(prev => ({ ...prev, isOpen: true, mode: 'a' }));
    await new Promise(r => setTimeout(r, 700));

    const appendText = '\nBaris baru ditambahkan!';
    setOutput(prev => [...prev, `>>> file.write("${appendText.trim()}")`]);
    await new Promise(r => setTimeout(r, 500));

    setFileState(prev => ({ ...prev, content: prev.content + appendText }));
    setOutput(prev => [...prev, `   ${appendText.trim().length} karakter ditambahkan`]);
    await new Promise(r => setTimeout(r, 400));

    setOutput(prev => [...prev, '>>> file.close()']);
    setFileState(prev => ({ ...prev, isOpen: false, mode: 'closed' }));
    await new Promise(r => setTimeout(r, 300));
    setOutput(prev => [...prev, '✅ Teks ditambahkan ke file']);

    setIsAnimating(false);
    if (!completedTasks.includes('append_file')) {
      setCompletedTasks(prev => [...prev, 'append_file']);
    }
  };

  const resetFile = () => {
    setFileState({
      name: 'data.txt',
      content: 'Hello, Python!\nBelajar File I/O\nBaris ketiga',
      isOpen: false,
      mode: 'closed',
      cursor: 0,
    });
    setOutput([]);
  };

  useEffect(() => {
    if (conceptStep >= 3 && !completedTasks.includes('learn_concepts')) {
      setCompletedTasks(prev => [...prev, 'learn_concepts']);
    }
  }, [conceptStep, completedTasks]);

  useEffect(() => {
    if (completedTasks.length >= 3) {
      onComplete();
    }
  }, [completedTasks, onComplete]);

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'r': return 'bg-blue-100 text-blue-800';
      case 'w': return 'bg-orange-100 text-orange-800';
      case 'a': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'r': return '📖 Baca (read)';
      case 'w': return '✏️ Tulis (write)';
      case 'a': return '➕ Tambah (append)';
      default: return '🔒 Tertutup';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-amber-800">Pelajaran 3: Operasi File (File Operations)</CardTitle>
              <CardDescription className="text-amber-600">
                Kuasai operasi file: membaca, menulis, dan mengelola file dengan Python
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Web Simulation Notice */}
      <Card className="border-2 border-blue-200 bg-blue-50/70">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              💡 <strong>Catatan:</strong> Di platform web ini, kita mensimulasikan operasi file. Di Python yang terinstal di komputer, operasi ini akan benar-benar membaca dan menulis file di hard drive kamu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="w-5 h-5 text-amber-500" />
            <span>Target Pembelajaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { key: 'learn_concepts', label: 'Pahami konsep File I/O', emoji: '📖' },
              { key: 'read_file', label: 'Baca file', emoji: '👁️' },
              { key: 'write_file', label: 'Tulis file', emoji: '✏️' },
              { key: 'append_file', label: 'Tambahkan ke file', emoji: '➕' },
            ].map(task => (
              <div
                key={task.key}
                className={`p-3 rounded-lg border ${completedTasks.includes(task.key) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center space-x-2">
                  {completedTasks.includes(task.key) ? '✅' : task.emoji}
                  <span className="font-medium text-sm">{task.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Concept Explorer */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span>Konsep File I/O — Langkah demi Langkah</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              {conceptStep + 1} / {concepts.length}
            </Badge>
            <h3 className="text-lg font-semibold text-amber-800">{concepts[conceptStep].title}</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={conceptStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{concepts[conceptStep].code}</code>
              </pre>
              <p className="mt-3 text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                💡 {concepts[conceptStep].explanation}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setConceptStep(prev => Math.max(0, prev - 1))} disabled={conceptStep === 0}>
              ← Sebelumnya
            </Button>
            <Button onClick={() => setConceptStep(prev => Math.min(concepts.length - 1, prev + 1))}
              disabled={conceptStep === concepts.length - 1}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              Selanjutnya →
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Simulator */}
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              <span>Simulator File</span>
            </CardTitle>
            <CardDescription>Simulasi operasi file secara visual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File visualization */}
            <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
              fileState.isOpen
                ? fileState.mode === 'r' ? 'border-blue-400 bg-blue-50' : fileState.mode === 'w' ? 'border-orange-400 bg-orange-50' : 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-mono font-medium">{fileState.name}</span>
                </div>
                <Badge className={getModeColor(fileState.mode)}>{getModeLabel(fileState.mode)}</Badge>
              </div>
              <div className="bg-white rounded border p-3 font-mono text-sm min-h-[100px] whitespace-pre-wrap">
                {fileState.content.split('\n').map((line, i) => (
                  <motion.div
                    key={i}
                    className={`py-0.5 px-1 rounded ${fileState.cursor === i + 1 ? 'bg-yellow-200' : ''}`}
                    animate={{ backgroundColor: fileState.cursor === i + 1 ? '#fef08a' : 'transparent' }}
                  >
                    <span className="text-gray-400 mr-2 select-none">{i + 1}|</span>
                    {line || ' '}
                  </motion.div>
                ))}
                {fileState.content === '' && (
                  <span className="text-gray-400 italic">( file kosong )</span>
                )}
              </div>
            </div>

            {/* Write input */}
            <div>
              <label className="text-sm font-medium text-gray-700">Teks untuk ditulis:</label>
              <textarea
                value={writeInput}
                onChange={e => setWriteInput(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 text-sm font-mono resize-none"
                rows={2}
              />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={simulateRead} disabled={isAnimating}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <BookOpen className="w-4 h-4 mr-1" /> Baca File
              </Button>
              <Button onClick={simulateWrite} disabled={isAnimating}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <PenLine className="w-4 h-4 mr-1" /> Tulis File
              </Button>
              <Button onClick={simulateAppend} disabled={isAnimating}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Play className="w-4 h-4 mr-1" /> Tambahkan
              </Button>
              <Button variant="outline" onClick={resetFile} disabled={isAnimating}>
                🔄 Reset File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Console Output */}
        <Card className="border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">💻</span>
              <span>Output Konsol</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm">
              <AnimatePresence>
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`py-0.5 ${
                      line.startsWith('>>>') ? 'text-blue-400' :
                      line.startsWith('✅') ? 'text-green-400' :
                      line.startsWith('   ') ? 'text-yellow-300' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              {output.length === 0 && (
                <div className="text-gray-500 italic">
                  Klik tombol operasi untuk melihat hasil...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Praktik Mandiri */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Monitor className="w-5 h-5 text-indigo-500" />
            <span>Praktik Mandiri</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-indigo-700 mb-3">🖥️ Untuk mempraktikkan operasi file secara nyata:</p>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">1</Badge>
              <span>Install Python di komputer: <a href="https://python.org/downloads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-800">python.org/downloads</a></span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">2</Badge>
              <span>Buka terminal/command prompt</span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">3</Badge>
              <span>Ketik: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">python</code></span>
            </li>
            <li className="flex items-start space-x-2">
              <Badge className="bg-indigo-100 text-indigo-700 mt-0.5 flex-shrink-0">4</Badge>
              <span>Coba kode yang sudah kamu pelajari di sini!</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-green-700">Progres Operasi File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tugas Selesai</span>
              <span>{completedTasks.length} / 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {completedTasks.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-green-600 font-medium">
                🎉 Operasi File dikuasai! Lanjut ke Modul!
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
