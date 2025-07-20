"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  FileText,
  Calculator,
  ToggleLeft,
  List,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LessonProps {
  onComplete: () => void;
  isCompleted: boolean;
}

interface DataTypeZone {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  examples: string[];
  checkFunction: (value: string) => boolean;
}

interface TypeCheckResult {
  input: string;
  detectedType: string;
  isCorrect: boolean;
  explanation: string;
}

const dataTypeZones: DataTypeZone[] = [
  {
    id: 'string',
    name: 'String Land',
    icon: '📝',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Tempat untuk teks dan kata-kata',
    examples: ['"Hello"', "'Dunia'", '"Python"', '"123 ABC"'],
    checkFunction: (value: string) =>
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
  },
  {
    id: 'integer',
    name: 'Number City',
    icon: '🔢',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Kota untuk bilangan bulat',
    examples: ['42', '0', '-5', '2024'],
    checkFunction: (value: string) =>
      !isNaN(Number(value)) && Number.isInteger(Number(value)) && !value.includes('.')
  },
  {
    id: 'float',
    name: 'Decimal District',
    icon: '💯',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    description: 'Distrik untuk bilangan desimal',
    examples: ['3.14', '0.5', '-2.7', '99.99'],
    checkFunction: (value: string) =>
      !isNaN(Number(value)) && value.includes('.')
  },
  {
    id: 'boolean',
    name: 'Boolean Island',
    icon: '✅',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    description: 'Pulau untuk True dan False',
    examples: ['True', 'False'],
    checkFunction: (value: string) => value === 'True' || value === 'False'
  },
  {
    id: 'list',
    name: 'List Valley',
    icon: '📋',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    description: 'Lembah untuk kumpulan data',
    examples: ['[1, 2, 3]', '["a", "b"]', '[True, False]', '[]'],
    checkFunction: (value: string) => value.startsWith('[') && value.endsWith(']')
  },
  {
    id: 'none',
    name: 'None Nowhere',
    icon: '⭕',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200',
    description: 'Tempat untuk nilai kosong',
    examples: ['None'],
    checkFunction: (value: string) => value === 'None'
  }
];

export default function Lesson3DataTypes({ onComplete, isCompleted }: LessonProps) {
  const [currentInput, setCurrentInput] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [typeCheckHistory, setTypeCheckHistory] = useState<TypeCheckResult[]>([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 });
  const [correctGuesses, setCorrectGuesses] = useState(0);

  const detectType = (value: string): string => {
    if (!value.trim()) return 'unknown';

    for (const zone of dataTypeZones) {
      if (zone.checkFunction(value)) {
        return zone.id;
      }
    }
    return 'unknown';
  };

  const checkType = () => {
    if (!currentInput.trim() || !selectedZone) return;

    const detectedType = detectType(currentInput);
    const isCorrect = detectedType === selectedZone;

    const zone = dataTypeZones.find(z => z.id === detectedType);
    const explanation = isCorrect
      ? `Benar! "${currentInput}" adalah ${zone?.name || 'unknown type'}`
      : `Salah! "${currentInput}" sebenarnya adalah ${zone?.name || 'unknown type'}, bukan ${dataTypeZones.find(z => z.id === selectedZone)?.name}`;

    const result: TypeCheckResult = {
      input: currentInput,
      detectedType,
      isCorrect,
      explanation
    };

    setTypeCheckHistory([result, ...typeCheckHistory.slice(0, 4)]);

    if (isCorrect) {
      setCorrectGuesses(correctGuesses + 1);

      // Move character to correct zone
      const zoneIndex = dataTypeZones.findIndex(z => z.id === selectedZone);
      setCharacterPosition({
        x: 50 + (zoneIndex % 3) * 120,
        y: 50 + Math.floor(zoneIndex / 3) * 100
      });

      // Complete lesson after 3 correct guesses
      if (correctGuesses >= 2 && !isCompleted) {
        setTimeout(() => onComplete(), 1000);
      }
    }

    setCurrentInput('');
    setSelectedZone(null);
  };

  const useExample = (example: string, zoneId: string) => {
    setCurrentInput(example);
    setSelectedZone(zoneId);
  };

  const quickTest = (value: string) => {
    setCurrentInput(value);
  };

  return (
    <div className="space-y-8">
      {/* Concept Introduction */}
      <Alert className="border-blue-200 bg-blue-50">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">💡 Konsep Utama</h3>
            <p>
              <strong>Tipe data seperti zona berbeda di taman bermain.</strong>
              Setiap zona memiliki aturan dan karakteristik khusus.
              Python perlu tahu zona mana yang tepat untuk setiap data.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Adventure Park Map */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Data Type Adventure Park</span>
            <Badge variant="secondary">{correctGuesses}/3 zona dikunjungi</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 min-h-[400px]">

            {/* Character */}
            <motion.div
              animate={{ x: characterPosition.x, y: characterPosition.y }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute z-20 text-4xl"
            >
              🧙‍♂️
            </motion.div>

            {/* Type Zones */}
            <div className="grid grid-cols-3 gap-4 h-full">
              {dataTypeZones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-300
                    ${zone.bgColor}
                    ${selectedZone === zone.id ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{zone.icon}</div>
                    <h3 className={`font-semibold text-sm ${zone.color}`}>
                      {zone.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {zone.description}
                    </p>

                    {/* Zone Examples */}
                    <div className="space-y-1">
                      {zone.examples.slice(0, 2).map((example, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            useExample(example, zone.id);
                          }}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Park Entrance Sign */}
            {correctGuesses === 0 && (
              <div className="absolute top-4 right-4 bg-white border-2 border-yellow-400 rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🎪</div>
                  <p className="text-xs font-semibold">Selamat Datang!</p>
                  <p className="text-xs">Jelajahi semua zona</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Type Checker Game */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Type Detective Game</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Masukkan Nilai:</label>
                <Input
                  placeholder='Coba: 42, "Hello", True, [1,2,3]'
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tebak Tipe Data:</label>
                <div className="flex space-x-2">
                  <select
                    value={selectedZone || ''}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    aria-label="Pilih zona tipe data"
                  >
                    <option value="">Pilih zona...</option>
                    {dataTypeZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.icon} {zone.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={checkType}
                    disabled={!currentInput.trim() || !selectedZone}
                  >
                    Cek!
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Test Cepat:</p>
              <div className="flex flex-wrap gap-2">
                {['"Python"', '99', '3.14', 'True', '[1,2,3]', 'None', "'Hello'", '0', 'False'].map((test, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => quickTest(test)}
                    className="font-mono text-xs"
                  >
                    {test}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results History */}
      {typeCheckHistory.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">📊 Riwayat Tebakan</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {typeCheckHistory.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    flex items-center justify-between p-3 rounded-lg border
                    ${result.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-mono text-sm font-semibold">
                      {result.input}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge
                      className={`
                        ${dataTypeZones.find(z => z.id === result.detectedType)?.bgColor || 'bg-gray-100'}
                      `}
                    >
                      {dataTypeZones.find(z => z.id === result.detectedType)?.icon} {dataTypeZones.find(z => z.id === result.detectedType)?.name || 'Unknown'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {result.explanation}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Detailed Type Explanations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Panduan Lengkap Setiap Zona</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* String */}
          <Card className={dataTypeZones[0].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[0].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[0].icon}</span>
                String (str) - Teks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  String adalah tipe data untuk menyimpan teks. Selalu diapit dengan tanda kutip.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">nama = "Alice"</div>
                  <div className="text-green-400">kota = 'Jakarta'</div>
                  <div className="text-green-400">pesan = "Halo Dunia!"</div>
                  <div className="text-green-400">angka_string = "123"</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Bisa pakai kutip ganda (") atau tunggal (')</div>
                  <div>• Angka dalam kutip = string, bukan number</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integer */}
          <Card className={dataTypeZones[1].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[1].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[1].icon}</span>
                Integer (int) - Bilangan Bulat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Integer adalah bilangan bulat tanpa koma desimal.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">umur = 17</div>
                  <div className="text-green-400">tahun = 2024</div>
                  <div className="text-green-400">negatif = -5</div>
                  <div className="text-green-400">nol = 0</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Tidak pakai tanda kutip</div>
                  <div>• Bisa positif, negatif, atau nol</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Float */}
          <Card className={dataTypeZones[2].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[2].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[2].icon}</span>
                Float (float) - Bilangan Desimal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Float adalah bilangan dengan titik desimal.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">pi = 3.14</div>
                  <div className="text-green-400">tinggi = 170.5</div>
                  <div className="text-green-400">suhu = -2.7</div>
                  <div className="text-green-400">setengah = 0.5</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Pakai titik (.) sebagai pemisah desimal</div>
                  <div>• Lebih fleksibel tapi kurang presisi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boolean */}
          <Card className={dataTypeZones[3].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[3].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[3].icon}</span>
                Boolean (bool) - Benar/Salah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Boolean hanya memiliki dua nilai: True atau False.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">aktif = True</div>
                  <div className="text-green-400">selesai = False</div>
                  <div className="text-green-400">lulus = True</div>
                  <div className="text-green-400">kosong = False</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Huruf pertama harus kapital (True/False)</div>
                  <div>• Berguna untuk logika dan kondisi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* List */}
          <Card className={dataTypeZones[4].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[4].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[4].icon}</span>
                List (list) - Daftar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  List adalah kumpulan data yang disimpan dalam satu variabel.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">angka = [1, 2, 3, 4]</div>
                  <div className="text-green-400">nama = ["Ali", "Budi"]</div>
                  <div className="text-green-400">campuran = [1, "Hello", True]</div>
                  <div className="text-green-400">kosong = []</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Diapit dengan kurung siku [ ]</div>
                  <div>• Bisa berisi berbagai tipe data</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* None */}
          <Card className={dataTypeZones[5].bgColor}>
            <CardHeader>
              <CardTitle className={`flex items-center ${dataTypeZones[5].color}`}>
                <span className="text-2xl mr-2">{dataTypeZones[5].icon}</span>
                None (NoneType) - Kosong
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  None mewakili nilai kosong atau tidak ada.
                </p>

                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-green-400">hasil = None</div>
                  <div className="text-green-400">data = None</div>
                  <div className="text-gray-500"># Akan diisi nanti</div>
                </div>

                <div className="text-sm space-y-1">
                  <div>• Berguna untuk nilai yang belum diset</div>
                  <div>• Berbeda dengan 0 atau string kosong</div>
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
            🔄 Konversi Antar Tipe Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Python dapat mengubah tipe data dengan fungsi konversi:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">String ↔ Number:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">int("42")    # → 42</div>
                  <div className="text-blue-300">str(42)     # → "42"</div>
                  <div className="text-blue-300">float("3.14") # → 3.14</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Number ↔ Boolean:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">bool(1)     # → True</div>
                  <div className="text-blue-300">bool(0)     # → False</div>
                  <div className="text-blue-300">int(True)   # → 1</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">List Operations:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">list("abc") # → ['a','b','c']</div>
                  <div className="text-blue-3000">str([1,2])  # → "[1, 2]"</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Type Checking:</h4>
                <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm space-y-1">
                  <div className="text-blue-300">type(42)    # → &lt;class 'int'&gt;</div>
                  <div className="text-blue-300">type("hi")  # → &lt;class 'str'&gt;</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🎉 Pelajaran 3 Selesai!</h3>
                <p>
                  Selamat! Anda telah menjelajahi semua zona di Data Type Adventure Park!
                  Sekarang Anda memahami berbagai jenis data dalam Python.
                  Mari lanjut ke pelajaran terakhir tentang operasi dasar!
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
