// Central data store for the dashboard
export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'locked';
  estimatedTime: string;
  href: string;
  prerequisites?: number[];
}

export interface UserStats {
  totalTime: string;
  streak: number;
  completedChapters: number;
  totalChapters: number;
  points: number;
  level: string;
  nextLevelPoints: number;
}

export interface Achievement {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  category: 'milestone' | 'streak' | 'skill' | 'special';
}

export interface Activity {
  activity: string;
  time: string;
  type: 'completion' | 'practice' | 'reading' | 'achievement';
}

// Sample data
export const chaptersData: Chapter[] = [
  {
    id: 1,
    title: "Dasar-Dasar Pemrograman",
    description: "Memahami konsep dasar sebelum coding",
    icon: "🧠",
    progress: 100,
    status: 'completed',
    estimatedTime: "30 menit",
    href: "/chapter/1"
  },
  {
    id: 2,
    title: "Variabel dan Tipe Data",
    description: "Belajar menyimpan dan mengelola data",
    icon: "📦",
    progress: 75,
    status: 'in-progress',
    estimatedTime: "45 menit",
    href: "/chapter/2",
    prerequisites: [1]
  },
  {
    id: 3,
    title: "List dan Array",
    description: "Mengelola kumpulan data dengan visualisasi",
    icon: "📋",
    progress: 20,
    status: 'in-progress',
    estimatedTime: "60 menit",
    href: "/chapter/3",
    prerequisites: [2]
  },
  {
    id: 4,
    title: "Pengulangan (Loop)",
    description: "Otomatisasi dengan perulangan",
    icon: "🔄",
    progress: 0,
    status: 'locked',
    estimatedTime: "50 menit",
    href: "/chapter/4",
    prerequisites: [3]
  },
  {
    id: 5,
    title: "Fungsi",
    description: "Membuat kode yang dapat digunakan kembali",
    icon: "⚡",
    progress: 0,
    status: 'locked',
    estimatedTime: "55 menit",
    href: "/chapter/5",
    prerequisites: [4]
  }
];

export const userStatsData: UserStats = {
  totalTime: "12 jam 30 menit",
  streak: 5,
  completedChapters: 1,
  totalChapters: 5,
  points: 1250,
  level: "Pemula",
  nextLevelPoints: 500
};

export const achievementsData: Achievement[] = [
  {
    name: "First Steps",
    description: "Menyelesaikan chapter pertama",
    icon: "👶",
    earned: true,
    category: 'milestone'
  },
  {
    name: "Code Explorer",
    description: "Mencoba 10 contoh kode",
    icon: "🔍",
    earned: true,
    category: 'skill'
  },
  {
    name: "Speed Learner",
    description: "Menyelesaikan chapter dalam 1 hari",
    icon: "⚡",
    earned: false,
    category: 'special'
  },
  {
    name: "Consistency King",
    description: "Belajar 7 hari berturut-turut",
    icon: "👑",
    earned: false,
    category: 'streak'
  }
];

export const recentActivityData: Activity[] = [
  {
    activity: "Menyelesaikan: Dasar-Dasar Pemrograman",
    time: "2 jam lalu",
    type: "completion"
  },
  {
    activity: "Mencoba: Variabel Demo",
    time: "1 hari lalu",
    type: "practice"
  },
  {
    activity: "Membaca: Konsep Tipe Data",
    time: "2 hari lalu",
    type: "reading"
  }
];

export const tipsData: string[] = [
  "💡 Tip: Praktikkan kode setiap hari untuk hasil terbaik!",
  "🎯 Fokus: Pahami konsep dasar sebelum lanjut ke topik advanced",
  "🔥 Motivasi: Kamu sudah 20% menuju menjadi Python developer!"
];

// Helper functions
export const calculateOverallProgress = (): number => {
  const totalProgress = chaptersData.reduce((sum, chapter) => sum + chapter.progress, 0);
  return Math.round(totalProgress / chaptersData.length);
};

export const getFilteredChapters = (filter: string, searchTerm: string = ''): Chapter[] => {
  return chaptersData.filter(chapter => {
    const matchesSearch = searchTerm === '' ||
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || chapter.status === filter;

    return matchesSearch && matchesFilter;
  });
};

export const getStatusCounts = () => {
  const counts = {
    all: chaptersData.length,
    'not-started': 0,
    'in-progress': 0,
    completed: 0,
    locked: 0
  };

  chaptersData.forEach(chapter => {
    counts[chapter.status]++;
  });

  return counts;
};
