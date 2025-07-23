// Central data store for the dashboard
export interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedTime: string;
  href: string;
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
    id: 0,
    title: "Dasar-Dasar Pemrograman",
    description: "Memahami konsep fundamental programming, variabel, tipe data, dan operasi dasar",
    icon: "🧠",
    progress: 0,
    status: 'not-started',
    estimatedTime: "30 menit",
    href: "/chapter0"
  },
  {
    id: 1,
    title: "Pengenalan Python Lists",
    description: "Pelajari cara membuat, mengakses, dan memanipulasi list Python dengan mudah",
    icon: "📝",
    progress: 0,
    status: 'not-started',
    estimatedTime: "45 menit",
    href: "/chapter/lists"
  },
  {
    id: 2,
    title: "Teknik Lanjutan Lists",
    description: "Kuasai list comprehension, nested lists, dan metode-metode canggih lainnya",
    icon: "🧙‍♂️",
    progress: 0,
    status: 'not-started',
    estimatedTime: "55 menit",
    href: "/chapter2"
  },
  {
    id: 3,
    title: "Dictionary & Objects",
    description: "Eksplorasi dictionary Python, nested objects, dan manipulasi data terstruktur",
    icon: "📚",
    progress: 0,
    status: 'not-started',
    estimatedTime: "50 menit",
    href: "/chapter3"
  },
  {
    id: 4,
    title: "Loops & Iterasi",
    description: "Pelajari for loops, while loops, nested loops, dan teknik iterasi efisien",
    icon: "🔄",
    progress: 0,
    status: 'not-started',
    estimatedTime: "45 menit",
    href: "/chapter4"
  },
  {
    id: 5,
    title: "Project & Challenge",
    description: "Terapkan semua yang telah dipelajari dalam project nyata dan tantangan coding",
    icon: "🏆",
    progress: 0,
    status: 'not-started',
    estimatedTime: "60 menit",
    href: "/chapter5"
  }
];

export const userStatsData: UserStats = {
  totalTime: "0 menit",
  streak: 0,
  completedChapters: 0,
  totalChapters: 6,
  points: 1250,
  level: "Pemula",
  nextLevelPoints: 500
};

export const achievementsData: Achievement[] = [
  {
    name: "Langkah Pertama",
    description: "Menyelesaikan chapter pertama",
    icon: "👶",
    earned: true,
    category: 'milestone'
  },
  {
    name: "Penjelajah Kode",
    description: "Mencoba 10 contoh kode",
    icon: "🔍",
    earned: true,
    category: 'skill'
  },
  {
    name: "Pembelajar Cepat",
    description: "Menyelesaikan chapter dalam 1 hari",
    icon: "⚡",
    earned: false,
    category: 'special'
  },
  {
    name: "Raja Konsistensi",
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
  "💡 Tips: Praktikkan kode setiap hari untuk hasil terbaik!",
  "🎯 Fokus: Pahami konsep dasar sebelum lanjut ke topik lanjutan",
  "🔥 Motivasi: Kamu sudah melangkah menuju Python developer handal!",
  "📚 Belajar: Jangan ragu untuk eksperimen dengan kode sendiri",
  "⚡ Efisien: Gunakan fitur visualisasi untuk memahami konsep lebih cepat"
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
    completed: 0
  };

  chaptersData.forEach(chapter => {
    counts[chapter.status]++;
  });

  return counts;
};
