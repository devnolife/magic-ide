// Chapter data management
export interface Chapter {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  challenges: Challenge[];
  isLocked: boolean;
  estimatedTime: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  isCompleted: boolean;
  exercises: Exercise[];
}

export interface Challenge {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints: string[];
}

export interface Exercise {
  id: string;
  prompt: string;
  starterCode: string;
  expectedOutput: any;
  testCases: TestCase[];
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

// Chapter data - this would ideally come from a database or CMS
const chapters: Chapter[] = [
  {
    id: '0',
    title: 'Programming Basics',
    description: 'Learn the fundamentals of programming and Python with interactive robot chef adventures',
    difficulty: 'beginner',
    isLocked: false,
    estimatedTime: 120,
    lessons: [
      {
        id: '1',
        chapterId: '0',
        title: 'Apa itu Pemrograman?',
        description: 'Belajar pemrograman dengan robot chef yang mengikuti instruksi memasak',
        content: 'Robot Chef Adventure - Understanding programming fundamentals',
        order: 1,
        isCompleted: false,
        exercises: []
      },
      {
        id: '2',
        chapterId: '0',
        title: 'Variabel & Memori',
        description: 'Magic Recipe Box - Simpan dan atur bahan-bahan dalam kotak resep ajaib',
        content: 'Magic Recipe Box - Understanding variables and memory',
        order: 2,
        isCompleted: false,
        exercises: []
      },
      {
        id: '3',
        chapterId: '0',
        title: 'Tipe Data',
        description: 'Magical Ingredients Sorter - Mengenal berbagai jenis bahan dalam dunia sihir',
        content: 'Magical Ingredients Sorter - Understanding data types',
        order: 3,
        isCompleted: false,
        exercises: []
      },
      {
        id: '4',
        chapterId: '0',
        title: 'Operasi Dasar',
        description: 'Potion Making Lab - Membuat ramuan dengan operasi matematika dasar',
        content: 'Potion Making Lab - Basic mathematical operations',
        order: 4,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: []
  },
  {
    id: '1',
    title: 'Python Lists & Arrays',
    description: 'Jelajahi dunia list Python dengan visualisasi interaktif yang menakjubkan!',
    difficulty: 'beginner',
    isLocked: false,
    estimatedTime: 180,
    lessons: [
      {
        id: '1',
        chapterId: '1',
        title: 'Introduction to Lists',
        description: 'Learn what lists are and how to create them',
        content: 'Interactive Python Lists Learning with real-time visualization',
        order: 1,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: [
      {
        id: '1',
        chapterId: '1',
        title: 'List Manipulation',
        description: 'Practice basic list operations',
        difficulty: 'easy',
        starterCode: 'my_list = []\n# Add your code here',
        solution: 'my_list = [1, 2, 3]\nmy_list.append(4)',
        testCases: [],
        hints: ['Use append() to add items', 'Remember list indexing starts at 0']
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced Lists',
    description: 'Master advanced list concepts including comprehensions, nested lists, and advanced methods',
    difficulty: 'intermediate',
    isLocked: false,
    estimatedTime: 240,
    lessons: [
      {
        id: '1',
        chapterId: '2',
        title: 'List Comprehensions',
        description: 'Learn the powerful list comprehension syntax',
        content: 'List comprehensions provide a concise way to create lists',
        order: 1,
        isCompleted: false,
        exercises: []
      },
      {
        id: '2',
        chapterId: '2',
        title: 'Nested Lists',
        description: 'Working with lists inside lists',
        content: 'Understanding multidimensional data structures',
        order: 2,
        isCompleted: false,
        exercises: []
      },
      {
        id: '3',
        chapterId: '2',
        title: 'Advanced List Methods',
        description: 'Explore advanced list manipulation methods',
        content: 'Methods like extend, reverse, sort, and more',
        order: 3,
        isCompleted: false,
        exercises: []
      },
      {
        id: '4',
        chapterId: '2',
        title: 'List Tricks & Tips',
        description: 'Professional tips for working with lists',
        content: 'Performance tips and best practices',
        order: 4,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: [
      {
        id: '1',
        chapterId: '2',
        title: 'List Comprehension Challenge',
        description: 'Create complex list comprehensions',
        difficulty: 'medium',
        starterCode: '# Create a list comprehension\nnumbers = [1, 2, 3, 4, 5]\n# Your code here',
        solution: 'squares = [x**2 for x in numbers if x % 2 == 0]',
        testCases: [],
        hints: ['Use if condition in comprehension', 'Think about filtering and transforming']
      }
    ]
  },
  {
    id: '3',
    title: 'Dictionaries & Objects',
    description: 'Explore Python dictionaries and object-oriented concepts with magical spell crafting',
    difficulty: 'intermediate',
    isLocked: false,
    estimatedTime: 200,
    lessons: [
      {
        id: '1',
        chapterId: '3',
        title: 'Basic Dictionary',
        description: 'Introduction to Python dictionaries',
        content: 'Understanding key-value pairs and dictionary basics',
        order: 1,
        isCompleted: false,
        exercises: []
      },
      {
        id: '2',
        chapterId: '3',
        title: 'Dictionary Methods',
        description: 'Essential dictionary methods and operations',
        content: 'Methods like get, keys, values, items, and more',
        order: 2,
        isCompleted: false,
        exercises: []
      },
      {
        id: '3',
        chapterId: '3',
        title: 'Nested Dictionaries',
        description: 'Working with complex dictionary structures',
        content: 'Dictionaries inside dictionaries for complex data',
        order: 3,
        isCompleted: false,
        exercises: []
      },
      {
        id: '4',
        chapterId: '3',
        title: 'Dictionary as Objects',
        description: 'Using dictionaries to represent objects',
        content: 'Object-like behavior with dictionaries',
        order: 4,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: [
      {
        id: '1',
        chapterId: '3',
        title: 'Spell Book Challenge',
        description: 'Create a magical spell book using dictionaries',
        difficulty: 'medium',
        starterCode: '# Create a spell book dictionary\nspell_book = {}\n# Add spells here',
        solution: 'spell_book = {"fireball": {"damage": 50, "mana": 25}, "heal": {"healing": 30, "mana": 15}}',
        testCases: [],
        hints: ['Use nested dictionaries for spell properties', 'Think about spell attributes']
      }
    ]
  },
  {
    id: '4',
    title: 'Functions & Enchantments',
    description: 'Master Python functions through magical enchantment creation and spellcasting',
    difficulty: 'intermediate',
    isLocked: false,
    estimatedTime: 220,
    lessons: [
      {
        id: '1',
        chapterId: '4',
        title: 'Basic Functions',
        description: 'Introduction to creating and using functions',
        content: 'Understanding function definition, parameters, and return values',
        order: 1,
        isCompleted: false,
        exercises: []
      },
      {
        id: '2',
        chapterId: '4',
        title: 'Function Parameters',
        description: 'Working with different types of parameters',
        content: 'Default parameters, *args, **kwargs, and more',
        order: 2,
        isCompleted: false,
        exercises: []
      },
      {
        id: '3',
        chapterId: '4',
        title: 'Lambda Functions',
        description: 'Understanding anonymous functions',
        content: 'Lambda functions for quick, inline operations',
        order: 3,
        isCompleted: false,
        exercises: []
      },
      {
        id: '4',
        chapterId: '4',
        title: 'Decorators',
        description: 'Advanced function enhancement with decorators',
        content: 'Creating and using decorators to modify function behavior',
        order: 4,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: [
      {
        id: '1',
        chapterId: '4',
        title: 'Enchantment Workshop',
        description: 'Create magical functions that enhance abilities',
        difficulty: 'hard',
        starterCode: '# Create an enchantment function\ndef create_enchantment(name, power):\n    # Your code here\n    pass',
        solution: 'def create_enchantment(name, power):\n    return {"name": name, "power": power, "active": True}',
        testCases: [],
        hints: ['Functions should return enchantment objects', 'Think about function parameters']
      }
    ]
  },
  {
    id: '5',
    title: 'Advanced Concepts',
    description: 'Explore advanced Python concepts including classes, modules, and error handling',
    difficulty: 'advanced',
    isLocked: false,
    estimatedTime: 300,
    lessons: [
      {
        id: '1',
        chapterId: '5',
        title: 'Object-Oriented Programming',
        description: 'Introduction to classes and objects',
        content: 'Understanding classes, objects, inheritance, and polymorphism',
        order: 1,
        isCompleted: false,
        exercises: []
      },
      {
        id: '2',
        chapterId: '5',
        title: 'Error Handling',
        description: 'Managing exceptions and errors gracefully',
        content: 'Try-except blocks and exception handling',
        order: 2,
        isCompleted: false,
        exercises: []
      },
      {
        id: '3',
        chapterId: '5',
        title: 'File Operations',
        description: 'Reading from and writing to files',
        content: 'File I/O operations and working with different file formats',
        order: 3,
        isCompleted: false,
        exercises: []
      },
      {
        id: '4',
        chapterId: '5',
        title: 'Modules & Packages',
        description: 'Organizing code with modules and packages',
        content: 'Creating reusable code components',
        order: 4,
        isCompleted: false,
        exercises: []
      }
    ],
    challenges: [
      {
        id: '1',
        chapterId: '5',
        title: 'Wizard Academy',
        description: 'Create a complete wizard management system',
        difficulty: 'hard',
        starterCode: '# Create a Wizard class\nclass Wizard:\n    def __init__(self, name):\n        # Your code here\n        pass',
        solution: 'class Wizard:\n    def __init__(self, name):\n        self.name = name\n        self.spells = []\n        self.level = 1',
        testCases: [],
        hints: ['Use class attributes for wizard properties', 'Think about wizard methods']
      }
    ]
  }
];

export async function getChapterData(id: string): Promise<Chapter | null> {
  const chapter = chapters.find(ch => ch.id === id);
  return chapter || null;
}

export async function getAllChapters(): Promise<Chapter[]> {
  return chapters;
}

export async function getLessonData(chapterId: string, lessonId?: string): Promise<Lesson[] | Lesson | null> {
  const chapter = await getChapterData(chapterId);
  if (!chapter) return null;

  if (lessonId) {
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    return lesson || null;
  }

  return chapter.lessons;
}

export async function getChallengeData(chapterId: string, challengeId?: string): Promise<Challenge[] | Challenge | null> {
  const chapter = await getChapterData(chapterId);
  if (!chapter) return null;

  if (challengeId) {
    const challenge = chapter.challenges.find(c => c.id === challengeId);
    return challenge || null;
  }

  return chapter.challenges;
}
