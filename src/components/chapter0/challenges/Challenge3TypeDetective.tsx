"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  CheckCircle,
  RotateCcw,
  PlayCircle,
  Eye,
  Target,
  Shuffle,
  Timer,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { DataClue } from '@/types/challenges';

interface Challenge3Props {
  onComplete: (success: boolean, score: number) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DetectiveCase {
  id: string;
  title: string;
  description: string;
  clues: DataClue[];
  timeLimit: number;
  passingScore: number;
}

const detectiveCases: Record<string, DetectiveCase> = {
  beginner: {
    id: 'basic-types',
    title: 'Kasus Tipe Data Dasar',
    description: 'Identifikasi tipe data dalam evidence yang ditemukan',
    timeLimit: 120,
    passingScore: 80,
    clues: [
      { id: 'clue1', value: 'Hello World', correctType: 'string', category: 'text', difficulty: 1 },
      { id: 'clue2', value: 42, correctType: 'number', category: 'numeric', difficulty: 1 },
      { id: 'clue3', value: true, correctType: 'boolean', category: 'logic', difficulty: 1 },
      { id: 'clue4', value: 'Python Programming', correctType: 'string', category: 'text', difficulty: 1 },
      { id: 'clue5', value: 3.14159, correctType: 'number', category: 'numeric', difficulty: 1 },
      { id: 'clue6', value: false, correctType: 'boolean', category: 'logic', difficulty: 1 },
      { id: 'clue7', value: 'Data Science', correctType: 'string', category: 'text', difficulty: 1 },
      { id: 'clue8', value: 100, correctType: 'number', category: 'numeric', difficulty: 1 }
    ]
  },
  intermediate: {
    id: 'mixed-types',
    title: 'Kasus Tipe Data Campuran',
    description: 'Analisis evidence dengan tipe data yang lebih kompleks',
    timeLimit: 90,
    passingScore: 85,
    clues: [
      { id: 'clue1', value: "'Quoted Text'", correctType: 'string', category: 'text', difficulty: 2 },
      { id: 'clue2', value: '123', correctType: 'string', category: 'ambiguous', difficulty: 3 },
      { id: 'clue3', value: 0, correctType: 'number', category: 'numeric', difficulty: 2 },
      { id: 'clue4', value: 'True', correctType: 'string', category: 'ambiguous', difficulty: 3 },
      { id: 'clue5', value: -45.67, correctType: 'number', category: 'numeric', difficulty: 2 },
      { id: 'clue6', value: '', correctType: 'string', category: 'edge', difficulty: 3 },
      { id: 'clue7', value: 'false', correctType: 'string', category: 'ambiguous', difficulty: 3 },
      { id: 'clue8', value: 0.0, correctType: 'number', category: 'numeric', difficulty: 2 },
      { id: 'clue9', value: '3.14', correctType: 'string', category: 'ambiguous', difficulty: 3 },
      { id: 'clue10', value: 1, correctType: 'number', category: 'numeric', difficulty: 2 }
    ]
  },
  advanced: {
    id: 'expert-detective',
    title: 'Kasus Ahli Detektif',
    description: 'Identifikasi cepat dengan tekanan waktu dan evidence kompleks',
    timeLimit: 60,
    passingScore: 90,
    clues: [
      { id: 'clue1', value: "\"Double Quoted\"", correctType: 'string', category: 'text', difficulty: 3 },
      { id: 'clue2', value: 'None', correctType: 'string', category: 'keyword', difficulty: 4 },
      { id: 'clue3', value: '0x1A', correctType: 'string', category: 'format', difficulty: 4 },
      { id: 'clue4', value: 1e10, correctType: 'number', category: 'scientific', difficulty: 4 },
      { id: 'clue5', value: 'True', correctType: 'string', category: 'keyword', difficulty: 4 },
      { id: 'clue6', value: -0, correctType: 'number', category: 'edge', difficulty: 4 },
      { id: 'clue7', value: '[]', correctType: 'string', category: 'structure', difficulty: 4 },
      { id: 'clue8', value: Infinity, correctType: 'number', category: 'special', difficulty: 4 },
      { id: 'clue9', value: 'null', correctType: 'string', category: 'keyword', difficulty: 4 },
      { id: 'clue10', value: 2.5e-3, correctType: 'number', category: 'scientific', difficulty: 4 },
      { id: 'clue11', value: '__init__', correctType: 'string', category: 'identifier', difficulty: 3 },
      { id: 'clue12', value: 42.0, correctType: 'number', category: 'numeric', difficulty: 3 }
    ]
  }
};

const typeOptions = [
  { value: 'string', label: 'String', color: 'bg-blue-500', icon: '📝' },
  { value: 'number', label: 'Number', color: 'bg-green-500', icon: '🔢' },
  { value: 'boolean', label: 'Boolean', color: 'bg-purple-500', icon: '✓' },
  { value: 'null', label: 'Null', color: 'bg-gray-500', icon: '∅' }
];

export default function Challenge3TypeDetective({ onComplete, difficulty }: Challenge3Props) {
  const caseData = detectiveCases[difficulty];
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(caseData.timeLimit);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [detectiveState, setDetectiveState] = useState<'idle' | 'investigating' | 'success' | 'failed'>('idle');

  const currentClue = caseData.clues[currentClueIndex];
  const totalClues = caseData.clues.length;
  const answeredCount = Object.keys(userAnswers).length;

  useEffect(() => {
    if (!isActive || isCompleted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isCompleted, timeRemaining]);

  const startInvestigation = () => {
    setIsActive(true);
    setDetectiveState('investigating');
    toast.info('🕵️‍♂️ Investigasi dimulai! Identifikasi setiap evidence dengan cepat dan akurat.');
  };

  const selectType = (type: string) => {
    if (isCompleted || !isActive) return;

    const isCorrect = type === currentClue.correctType;
    const newAnswers = { ...userAnswers, [currentClue.id]: type };
    setUserAnswers(newAnswers);

    if (isCorrect) {
      const streakBonus = streak * 5;
      const difficultyBonus = currentClue.difficulty * 10;
      const points = 10 + streakBonus + difficultyBonus;

      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });

      toast.success(`✅ Benar! +${points} poin (Streak: ${streak + 1})`);
    } else {
      setStreak(0);
      toast.error(`❌ Salah! Tipe yang benar: ${currentClue.correctType}`);
    }

    // Move to next clue or finish
    if (currentClueIndex < totalClues - 1) {
      setTimeout(() => setCurrentClueIndex(prev => prev + 1), 1000);
    } else {
      setTimeout(() => finishInvestigation(), 1000);
    }
  };

  const handleTimeUp = () => {
    toast.warning('⏰ Waktu habis! Kasus dihentikan.');
    finishInvestigation();
  };

  const finishInvestigation = () => {
    setIsActive(false);
    setIsCompleted(true);

    const correctAnswers = caseData.clues.filter(clue =>
      userAnswers[clue.id] === clue.correctType
    ).length;

    const accuracy = (correctAnswers / totalClues) * 100;
    const passed = accuracy >= caseData.passingScore;

    if (passed) {
      setDetectiveState('success');
      const timeBonus = Math.floor(timeRemaining / 2);
      const finalScore = score + timeBonus;

      toast.success(`🎉 Kasus terpecahkan! Akurasi: ${accuracy.toFixed(1)}%`);
      onComplete(true, finalScore);
    } else {
      setDetectiveState('failed');
      toast.error(`💔 Kasus gagal dipecahkan. Akurasi: ${accuracy.toFixed(1)}% (Target: ${caseData.passingScore}%)`);
      onComplete(false, score);
    }
  };

  const resetInvestigation = () => {
    setCurrentClueIndex(0);
    setUserAnswers({});
    setTimeRemaining(caseData.timeLimit);
    setIsActive(false);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setDetectiveState('idle');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      text: '📝',
      numeric: '🔢',
      logic: '✓',
      ambiguous: '❓',
      edge: '⚠️',
      keyword: '🔑',
      format: '📋',
      scientific: '🔬',
      special: '⭐',
      structure: '🗂️',
      identifier: '🆔'
    };
    return icons[category] || '🔍';
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDetectiveAnimation = () => {
    switch (detectiveState) {
      case 'investigating':
        return { scale: [1, 1.1, 1], transition: { duration: 2, repeat: Infinity } };
      case 'success':
        return { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0], transition: { duration: 1 } };
      case 'failed':
        return { x: [-10, 10, -10, 10, 0], transition: { duration: 0.5 } };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={getDetectiveAnimation()}
                className="text-6xl"
              >
                🕵️‍♂️
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {caseData.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">{caseData.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {totalClues} evidence
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {caseData.timeLimit}s
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Target: {caseData.passingScore}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div>
                <div className="text-sm text-gray-500">Skor</div>
                <div className="text-2xl font-bold text-gray-800">{score}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Streak</div>
                <div className="text-lg font-bold text-purple-600">{streak}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!isActive && !isCompleted && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Eye className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Siap untuk memulai investigasi?
            </h3>
            <p className="text-gray-600 mb-6">
              Anda akan melihat {totalClues} evidence yang perlu diidentifikasi.
              Klik tipe data yang sesuai untuk setiap evidence.
            </p>
            <Button
              onClick={startInvestigation}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Mulai Investigasi
            </Button>
          </CardContent>
        </Card>
      )}

      {isActive && !isCompleted && (
        <>
          {/* Progress & Timer */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Evidence {currentClueIndex + 1} dari {totalClues}
                </span>
                <span className={`text-lg font-bold ${timeRemaining < 20 ? 'text-red-500' : 'text-gray-800'
                  }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Progress
                value={((currentClueIndex + 1) / totalClues) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Current Evidence */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Evidence #{currentClueIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">{getCategoryIcon(currentClue.category)}</span>
                    <Badge className={getDifficultyColor(currentClue.difficulty)}>
                      Level {currentClue.difficulty}
                    </Badge>
                  </div>
                  <div className="text-4xl font-mono font-bold text-gray-800 mb-2">
                    {typeof currentClue.value === 'string' && currentClue.value.startsWith('"')
                      ? currentClue.value
                      : typeof currentClue.value === 'string' && !currentClue.value.includes("'")
                        ? `"${currentClue.value}"`
                        : String(currentClue.value)
                    }
                  </div>
                  <p className="text-gray-500">
                    Kategori: {currentClue.category}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {typeOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => selectType(option.value)}
                      className={`h-16 flex-col gap-2 text-white ${option.color} hover:opacity-90`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-semibold">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Results */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-0 shadow-lg ${detectiveState === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50'
                : 'bg-gradient-to-r from-red-50 to-pink-50'
              }`}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {detectiveState === 'success' ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  ) : (
                    <Search className="w-16 h-16 text-red-500 mx-auto" />
                  )}

                  <h3 className="text-2xl font-bold text-gray-800">
                    {detectiveState === 'success'
                      ? '🎉 Kasus Terpecahkan!'
                      : '💔 Investigasi Belum Berhasil'
                    }
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{score}</div>
                      <div className="text-sm text-gray-600">Skor Final</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Max Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((Object.keys(userAnswers).filter(id =>
                          userAnswers[id] === caseData.clues.find(c => c.id === id)?.correctType
                        ).length / totalClues) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Akurasi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatTime(caseData.timeLimit - timeRemaining)}
                      </div>
                      <div className="text-sm text-gray-600">Waktu Terpakai</div>
                    </div>
                  </div>

                  <Button
                    onClick={resetInvestigation}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Investigasi Baru
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
