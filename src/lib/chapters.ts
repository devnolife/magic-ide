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
  expectedOutput: string | number | boolean | string[] | number[];
  testCases: TestCase[];
}

export interface TestCase {
  input: string | number | boolean | string[] | number[];
  expectedOutput: string | number | boolean | string[] | number[];
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
        exercises: [
          {
            id: 'ex-0-1-1',
            prompt: 'Tulis perintah print untuk menampilkan "Hello World"',
            starterCode: '# Tulis kode di bawah ini\n',
            expectedOutput: 'Hello World',
            testCases: [
              { input: '', expectedOutput: 'Hello World', description: 'Menampilkan Hello World' },
              { input: '', expectedOutput: 'Hello World', description: 'Output harus persis "Hello World"' }
            ]
          },
          {
            id: 'ex-0-1-2',
            prompt: 'Tulis dua perintah print: pertama "Halo" dan kedua "Dunia"',
            starterCode: '# Cetak dua baris\n',
            expectedOutput: 'Halo\nDunia',
            testCases: [
              { input: '', expectedOutput: 'Halo\nDunia', description: 'Menampilkan Halo dan Dunia di dua baris' },
              { input: '', expectedOutput: 'Halo', description: 'Baris pertama harus "Halo"' }
            ]
          },
          {
            id: 'ex-0-1-3',
            prompt: 'Gunakan print untuk menampilkan hasil dari 5 + 3',
            starterCode: '# Cetak hasil penjumlahan\n',
            expectedOutput: '8',
            testCases: [
              { input: '', expectedOutput: '8', description: 'Menampilkan hasil 5 + 3 = 8' },
              { input: '', expectedOutput: '8', description: 'Output harus berupa angka 8' }
            ]
          }
        ]
      },
      {
        id: '2',
        chapterId: '0',
        title: 'Variabel & Memori',
        description: 'Magic Recipe Box - Simpan dan atur bahan-bahan dalam kotak resep ajaib',
        content: 'Magic Recipe Box - Understanding variables and memory',
        order: 2,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-0-2-1',
            prompt: 'Buat variabel "nama" berisi nama kamu lalu cetak',
            starterCode: '# Buat variabel nama\nnama = ""\nprint(nama)',
            expectedOutput: 'Python',
            testCases: [
              { input: '', expectedOutput: 'Python', description: 'Variabel nama harus berisi string' },
              { input: 'nama = "Budi"', expectedOutput: 'Budi', description: 'Variabel bisa diisi nama apapun' }
            ]
          },
          {
            id: 'ex-0-2-2',
            prompt: 'Buat variabel "umur" berisi 17 dan "kota" berisi "Jakarta", lalu cetak keduanya',
            starterCode: '# Buat dua variabel\numur = \nkota = \nprint(umur)\nprint(kota)',
            expectedOutput: '17\nJakarta',
            testCases: [
              { input: '', expectedOutput: '17', description: 'Variabel umur harus berisi angka 17' },
              { input: '', expectedOutput: 'Jakarta', description: 'Variabel kota harus berisi "Jakarta"' }
            ]
          },
          {
            id: 'ex-0-2-3',
            prompt: 'Tukar nilai dua variabel: a = 10, b = 20, lalu cetak a dan b setelah ditukar',
            starterCode: 'a = 10\nb = 20\n# Tukar nilai a dan b\n\nprint(a)\nprint(b)',
            expectedOutput: '20\n10',
            testCases: [
              { input: '', expectedOutput: '20', description: 'Nilai a harus menjadi 20 setelah ditukar' },
              { input: '', expectedOutput: '10', description: 'Nilai b harus menjadi 10 setelah ditukar' }
            ]
          }
        ]
      },
      {
        id: '3',
        chapterId: '0',
        title: 'Tipe Data',
        description: 'Magical Ingredients Sorter - Mengenal berbagai jenis bahan dalam dunia sihir',
        content: 'Magical Ingredients Sorter - Understanding data types',
        order: 3,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-0-3-1',
            prompt: 'Buat variabel integer, float, dan string lalu cetak tipe datanya',
            starterCode: 'angka = 42\ndesimal = 3.14\nteks = "Python"\nprint(type(angka))\nprint(type(desimal))\nprint(type(teks))',
            expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>",
            testCases: [
              { input: '', expectedOutput: "<class 'int'>", description: 'Tipe data integer harus int' },
              { input: '', expectedOutput: "<class 'float'>", description: 'Tipe data desimal harus float' },
              { input: '', expectedOutput: "<class 'str'>", description: 'Tipe data teks harus str' }
            ]
          },
          {
            id: 'ex-0-3-2',
            prompt: 'Konversi string "100" menjadi integer dan cetak hasilnya ditambah 50',
            starterCode: 'teks_angka = "100"\n# Konversi dan tambahkan 50\nhasil = \nprint(hasil)',
            expectedOutput: '150',
            testCases: [
              { input: '', expectedOutput: '150', description: 'Konversi string ke int lalu tambah 50' },
              { input: 'teks_angka = "200"', expectedOutput: '250', description: 'Harus bisa konversi string angka apapun' }
            ]
          },
          {
            id: 'ex-0-3-3',
            prompt: 'Buat variabel boolean is_python_fun = True dan cetak nilainya',
            starterCode: '# Buat variabel boolean\nis_python_fun = \nprint(is_python_fun)\nprint(type(is_python_fun))',
            expectedOutput: "True\n<class 'bool'>",
            testCases: [
              { input: '', expectedOutput: 'True', description: 'Variabel boolean bernilai True' },
              { input: '', expectedOutput: "<class 'bool'>", description: 'Tipe data harus bool' }
            ]
          }
        ]
      },
      {
        id: '4',
        chapterId: '0',
        title: 'Operasi Dasar',
        description: 'Potion Making Lab - Membuat ramuan dengan operasi matematika dasar',
        content: 'Potion Making Lab - Basic mathematical operations',
        order: 4,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-0-4-1',
            prompt: 'Hitung luas persegi panjang dengan lebar=5 dan tinggi=3, cetak hasilnya',
            starterCode: 'lebar = 5\ntinggi = 3\n# Hitung luas\nluas = \nprint(luas)',
            expectedOutput: '15',
            testCases: [
              { input: '', expectedOutput: '15', description: 'Luas = lebar x tinggi = 15' },
              { input: 'lebar = 10\ntinggi = 4', expectedOutput: '40', description: 'Luas 10x4 = 40' }
            ]
          },
          {
            id: 'ex-0-4-2',
            prompt: 'Hitung sisa bagi (modulo) dari 17 dibagi 5 dan cetak hasilnya',
            starterCode: '# Gunakan operator modulo %\nhasil = 17 % 5\nprint(hasil)',
            expectedOutput: '2',
            testCases: [
              { input: '', expectedOutput: '2', description: '17 mod 5 = 2' },
              { input: 'hasil = 20 % 3', expectedOutput: '2', description: '20 mod 3 = 2' }
            ]
          },
          {
            id: 'ex-0-4-3',
            prompt: 'Hitung 2 pangkat 8 menggunakan operator ** dan cetak hasilnya',
            starterCode: '# Gunakan operator pangkat **\nhasil = \nprint(hasil)',
            expectedOutput: '256',
            testCases: [
              { input: '', expectedOutput: '256', description: '2 pangkat 8 = 256' },
              { input: 'hasil = 3 ** 4', expectedOutput: '81', description: '3 pangkat 4 = 81' }
            ]
          }
        ]
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
        exercises: [
          {
            id: 'ex-1-1-1',
            prompt: 'Buat list berisi 3 buah (apel, jeruk, mangga) dan cetak list tersebut',
            starterCode: '# Buat list buah\nbuah = []\nprint(buah)',
            expectedOutput: "['apel', 'jeruk', 'mangga']",
            testCases: [
              { input: '', expectedOutput: "['apel', 'jeruk', 'mangga']", description: 'List berisi 3 buah' },
              { input: '', expectedOutput: 'apel', description: 'Elemen pertama adalah apel' }
            ]
          },
          {
            id: 'ex-1-1-2',
            prompt: 'Buat list angka [10, 20, 30] lalu akses elemen kedua dan cetak',
            starterCode: 'angka = [10, 20, 30]\n# Akses elemen kedua (index 1)\nprint()',
            expectedOutput: '20',
            testCases: [
              { input: '', expectedOutput: '20', description: 'Elemen kedua (index 1) adalah 20' },
              { input: 'angka = [5, 15, 25]', expectedOutput: '15', description: 'Elemen index 1 dari list baru' }
            ]
          },
          {
            id: 'ex-1-1-3',
            prompt: 'Buat list kosong, tambahkan angka 1, 2, 3 menggunakan append(), lalu cetak',
            starterCode: 'my_list = []\n# Gunakan append() untuk menambahkan 1, 2, 3\n\nprint(my_list)',
            expectedOutput: '[1, 2, 3]',
            testCases: [
              { input: '', expectedOutput: '[1, 2, 3]', description: 'List berisi [1, 2, 3] setelah append' },
              { input: '', expectedOutput: '3', description: 'Panjang list harus 3' }
            ]
          }
        ]
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
        testCases: [
          { input: '[1, 2, 3]', expectedOutput: '[1, 2, 3, 4]', description: 'Append 4 ke list [1, 2, 3]' },
          { input: '[10, 20]', expectedOutput: '[10, 20, 30]', description: 'Append 30 ke list [10, 20]' },
          { input: '[]', expectedOutput: '[1]', description: 'Append 1 ke list kosong' }
        ],
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
        exercises: [
          {
            id: 'ex-2-1-1',
            prompt: 'Buat list comprehension untuk menghasilkan kuadrat dari angka 1-5',
            starterCode: '# Buat list kuadrat [1, 4, 9, 16, 25]\nkuadrat = []\nprint(kuadrat)',
            expectedOutput: '[1, 4, 9, 16, 25]',
            testCases: [
              { input: 'range(1, 6)', expectedOutput: '[1, 4, 9, 16, 25]', description: 'Kuadrat dari 1-5' },
              { input: 'range(1, 4)', expectedOutput: '[1, 4, 9]', description: 'Kuadrat dari 1-3' }
            ]
          },
          {
            id: 'ex-2-1-2',
            prompt: 'Gunakan list comprehension untuk memfilter angka genap dari [1,2,3,4,5,6,7,8,9,10]',
            starterCode: 'angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\ngenap = []\nprint(genap)',
            expectedOutput: '[2, 4, 6, 8, 10]',
            testCases: [
              { input: '[1,2,3,4,5,6,7,8,9,10]', expectedOutput: '[2, 4, 6, 8, 10]', description: 'Filter angka genap' },
              { input: '[1,3,5,7]', expectedOutput: '[]', description: 'Tidak ada angka genap' }
            ]
          },
          {
            id: 'ex-2-1-3',
            prompt: 'Buat list comprehension yang mengubah semua string menjadi huruf besar',
            starterCode: 'kata = ["hello", "world", "python"]\n# Ubah ke huruf besar\nhasil = []\nprint(hasil)',
            expectedOutput: "['HELLO', 'WORLD', 'PYTHON']",
            testCases: [
              { input: '["hello", "world"]', expectedOutput: "['HELLO', 'WORLD']", description: 'Semua string menjadi uppercase' },
              { input: '["python"]', expectedOutput: "['PYTHON']", description: 'Satu string menjadi uppercase' }
            ]
          }
        ]
      },
      {
        id: '2',
        chapterId: '2',
        title: 'Nested Lists',
        description: 'Working with lists inside lists',
        content: 'Understanding multidimensional data structures',
        order: 2,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-2-2-1',
            prompt: 'Buat matriks 2x2 [[1,2],[3,4]] dan akses elemen baris 2 kolom 1',
            starterCode: 'matriks = [[1, 2], [3, 4]]\n# Akses elemen baris 2, kolom 1\nprint(matriks[1][0])',
            expectedOutput: '3',
            testCases: [
              { input: '[[1,2],[3,4]]', expectedOutput: '3', description: 'Elemen [1][0] = 3' },
              { input: '[[5,6],[7,8]]', expectedOutput: '7', description: 'Elemen [1][0] dari matriks lain' }
            ]
          },
          {
            id: 'ex-2-2-2',
            prompt: 'Buat matriks 3x3 dan cetak semua elemen diagonal utama',
            starterCode: 'matriks = [[1,2,3],[4,5,6],[7,8,9]]\n# Cetak elemen diagonal: 1, 5, 9\nfor i in range(3):\n    print(matriks[i][i])',
            expectedOutput: '1\n5\n9',
            testCases: [
              { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '1\n5\n9', description: 'Diagonal utama matriks 3x3' },
              { input: '[[9,8,7],[6,5,4],[3,2,1]]', expectedOutput: '9\n5\n1', description: 'Diagonal matriks terbalik' }
            ]
          }
        ]
      },
      {
        id: '3',
        chapterId: '2',
        title: 'Advanced List Methods',
        description: 'Explore advanced list manipulation methods',
        content: 'Methods like extend, reverse, sort, and more',
        order: 3,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-2-3-1',
            prompt: 'Urutkan list [5,2,8,1,9] secara ascending dan cetak hasilnya',
            starterCode: 'angka = [5, 2, 8, 1, 9]\n# Urutkan list\nangka.sort()\nprint(angka)',
            expectedOutput: '[1, 2, 5, 8, 9]',
            testCases: [
              { input: '[5,2,8,1,9]', expectedOutput: '[1, 2, 5, 8, 9]', description: 'Sort ascending' },
              { input: '[3,1,4,1,5]', expectedOutput: '[1, 1, 3, 4, 5]', description: 'Sort dengan duplikat' }
            ]
          },
          {
            id: 'ex-2-3-2',
            prompt: 'Gabungkan dua list [1,2,3] dan [4,5,6] menggunakan extend() dan cetak',
            starterCode: 'list_a = [1, 2, 3]\nlist_b = [4, 5, 6]\n# Gabungkan list_b ke list_a\n\nprint(list_a)',
            expectedOutput: '[1, 2, 3, 4, 5, 6]',
            testCases: [
              { input: '[1,2,3] + [4,5,6]', expectedOutput: '[1, 2, 3, 4, 5, 6]', description: 'Gabung dua list' },
              { input: '[10] + [20, 30]', expectedOutput: '[10, 20, 30]', description: 'Gabung list berbeda ukuran' }
            ]
          },
          {
            id: 'ex-2-3-3',
            prompt: 'Balik urutan list [1,2,3,4,5] menggunakan reverse() dan cetak',
            starterCode: 'angka = [1, 2, 3, 4, 5]\n# Balik urutan\n\nprint(angka)',
            expectedOutput: '[5, 4, 3, 2, 1]',
            testCases: [
              { input: '[1,2,3,4,5]', expectedOutput: '[5, 4, 3, 2, 1]', description: 'Reverse list' },
              { input: '[10,20,30]', expectedOutput: '[30, 20, 10]', description: 'Reverse list lain' }
            ]
          }
        ]
      },
      {
        id: '4',
        chapterId: '2',
        title: 'List Tricks & Tips',
        description: 'Professional tips for working with lists',
        content: 'Performance tips and best practices',
        order: 4,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-2-4-1',
            prompt: 'Gunakan slicing untuk mengambil 3 elemen pertama dari [10,20,30,40,50]',
            starterCode: 'angka = [10, 20, 30, 40, 50]\n# Gunakan slicing\nhasil = angka[:3]\nprint(hasil)',
            expectedOutput: '[10, 20, 30]',
            testCases: [
              { input: '[10,20,30,40,50]', expectedOutput: '[10, 20, 30]', description: 'Slice 3 elemen pertama' },
              { input: '[1,2,3,4,5]', expectedOutput: '[1, 2, 3]', description: 'Slice dari list lain' }
            ]
          },
          {
            id: 'ex-2-4-2',
            prompt: 'Gunakan zip() untuk menggabungkan dua list menjadi pasangan',
            starterCode: 'nama = ["Ali", "Budi", "Cici"]\nnilai = [90, 85, 95]\n# Gabungkan dengan zip\nhasil = list(zip(nama, nilai))\nprint(hasil)',
            expectedOutput: "[('Ali', 90), ('Budi', 85), ('Cici', 95)]",
            testCases: [
              { input: '["Ali","Budi"] + [90,85]', expectedOutput: "[('Ali', 90), ('Budi', 85)]", description: 'Zip dua list' },
              { input: '["X"] + [1]', expectedOutput: "[('X', 1)]", description: 'Zip satu elemen' }
            ]
          }
        ]
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
        testCases: [
          { input: '[1, 2, 3, 4, 5]', expectedOutput: '[4, 16]', description: 'Kuadrat angka genap dari [1,2,3,4,5]' },
          { input: '[2, 4, 6]', expectedOutput: '[4, 16, 36]', description: 'Kuadrat semua angka genap dari [2,4,6]' },
          { input: '[1, 3, 5]', expectedOutput: '[]', description: 'Tidak ada angka genap, hasil list kosong' }
        ],
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
        exercises: [
          {
            id: 'ex-3-1-1',
            prompt: 'Buat dictionary siswa dengan key "nama", "umur", "kelas" dan cetak',
            starterCode: '# Buat dictionary siswa\nsiswa = {}\nprint(siswa)',
            expectedOutput: "{'nama': 'Budi', 'umur': 17, 'kelas': '11A'}",
            testCases: [
              { input: '', expectedOutput: "{'nama': 'Budi', 'umur': 17, 'kelas': '11A'}", description: 'Dictionary siswa lengkap' },
              { input: '', expectedOutput: 'Budi', description: 'Nilai key nama harus ada' }
            ]
          },
          {
            id: 'ex-3-1-2',
            prompt: 'Akses nilai "umur" dari dictionary dan cetak',
            starterCode: 'siswa = {"nama": "Andi", "umur": 16, "kelas": "10B"}\n# Akses dan cetak umur\nprint(siswa["umur"])',
            expectedOutput: '16',
            testCases: [
              { input: '{"umur": 16}', expectedOutput: '16', description: 'Akses nilai umur' },
              { input: '{"umur": 20}', expectedOutput: '20', description: 'Akses umur berbeda' }
            ]
          },
          {
            id: 'ex-3-1-3',
            prompt: 'Tambahkan key "nilai" = 95 ke dictionary siswa dan cetak dictionary',
            starterCode: 'siswa = {"nama": "Cici", "umur": 15}\n# Tambahkan key "nilai"\n\nprint(siswa)',
            expectedOutput: "{'nama': 'Cici', 'umur': 15, 'nilai': 95}",
            testCases: [
              { input: '', expectedOutput: '95', description: 'Key nilai harus berisi 95' },
              { input: '', expectedOutput: '3', description: 'Dictionary harus punya 3 key' }
            ]
          }
        ]
      },
      {
        id: '2',
        chapterId: '3',
        title: 'Dictionary Methods',
        description: 'Essential dictionary methods and operations',
        content: 'Methods like get, keys, values, items, and more',
        order: 2,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-3-2-1',
            prompt: 'Gunakan method .keys() untuk mendapatkan semua key dari dictionary',
            starterCode: 'buah = {"apel": 5, "jeruk": 3, "mangga": 7}\n# Cetak semua keys\nprint(list(buah.keys()))',
            expectedOutput: "['apel', 'jeruk', 'mangga']",
            testCases: [
              { input: '{"apel": 5, "jeruk": 3}', expectedOutput: "['apel', 'jeruk']", description: 'Keys dari 2 item' },
              { input: '{"x": 1}', expectedOutput: "['x']", description: 'Keys dari 1 item' }
            ]
          },
          {
            id: 'ex-3-2-2',
            prompt: 'Gunakan .get() dengan default value untuk mengakses key yang tidak ada',
            starterCode: 'data = {"nama": "Python", "versi": 3}\n# Gunakan get dengan default value\nhasil = data.get("bahasa", "Tidak ditemukan")\nprint(hasil)',
            expectedOutput: 'Tidak ditemukan',
            testCases: [
              { input: 'key tidak ada', expectedOutput: 'Tidak ditemukan', description: 'Default value saat key tidak ada' },
              { input: 'key "nama"', expectedOutput: 'Python', description: 'Nilai asli saat key ada' }
            ]
          },
          {
            id: 'ex-3-2-3',
            prompt: 'Gunakan .items() untuk iterasi dictionary dan cetak setiap pasangan',
            starterCode: 'nilai = {"mtk": 90, "ipa": 85, "bahasa": 95}\nfor k, v in nilai.items():\n    print(f"{k}: {v}")',
            expectedOutput: 'mtk: 90\nipa: 85\nbahasa: 95',
            testCases: [
              { input: '{"mtk": 90, "ipa": 85}', expectedOutput: 'mtk: 90\nipa: 85', description: 'Iterasi 2 item' },
              { input: '{"x": 1}', expectedOutput: 'x: 1', description: 'Iterasi 1 item' }
            ]
          }
        ]
      },
      {
        id: '3',
        chapterId: '3',
        title: 'Nested Dictionaries',
        description: 'Working with complex dictionary structures',
        content: 'Dictionaries inside dictionaries for complex data',
        order: 3,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-3-3-1',
            prompt: 'Buat nested dictionary untuk data sekolah dengan 2 siswa dan cetak nama siswa pertama',
            starterCode: 'sekolah = {\n    "siswa1": {"nama": "Andi", "nilai": 90},\n    "siswa2": {"nama": "Budi", "nilai": 85}\n}\nprint(sekolah["siswa1"]["nama"])',
            expectedOutput: 'Andi',
            testCases: [
              { input: 'sekolah["siswa1"]["nama"]', expectedOutput: 'Andi', description: 'Akses nama siswa pertama' },
              { input: 'sekolah["siswa2"]["nilai"]', expectedOutput: '85', description: 'Akses nilai siswa kedua' }
            ]
          },
          {
            id: 'ex-3-3-2',
            prompt: 'Update nilai siswa dalam nested dictionary dan cetak hasilnya',
            starterCode: 'kelas = {\n    "Andi": {"mtk": 80, "ipa": 75},\n    "Budi": {"mtk": 90, "ipa": 85}\n}\n# Update nilai mtk Andi menjadi 95\nkelas["Andi"]["mtk"] = 95\nprint(kelas["Andi"]["mtk"])',
            expectedOutput: '95',
            testCases: [
              { input: '', expectedOutput: '95', description: 'Nilai mtk Andi setelah diupdate' },
              { input: '', expectedOutput: '85', description: 'Nilai ipa Budi tidak berubah' }
            ]
          }
        ]
      },
      {
        id: '4',
        chapterId: '3',
        title: 'Dictionary as Objects',
        description: 'Using dictionaries to represent objects',
        content: 'Object-like behavior with dictionaries',
        order: 4,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-3-4-1',
            prompt: 'Buat dictionary sebagai objek "mobil" dengan merk, warna, tahun dan cetak',
            starterCode: '# Buat objek mobil\nmobil = {}\nprint(mobil)',
            expectedOutput: "{'merk': 'Toyota', 'warna': 'Merah', 'tahun': 2023}",
            testCases: [
              { input: '', expectedOutput: "{'merk': 'Toyota', 'warna': 'Merah', 'tahun': 2023}", description: 'Objek mobil lengkap' },
              { input: '', expectedOutput: 'Toyota', description: 'Merk mobil harus ada' }
            ]
          },
          {
            id: 'ex-3-4-2',
            prompt: 'Buat list berisi 3 dictionary (daftar produk) dan cetak nama produk kedua',
            starterCode: 'produk = [\n    {"nama": "Laptop", "harga": 10000000},\n    {"nama": "Mouse", "harga": 150000},\n    {"nama": "Keyboard", "harga": 300000}\n]\nprint(produk[1]["nama"])',
            expectedOutput: 'Mouse',
            testCases: [
              { input: 'produk[1]["nama"]', expectedOutput: 'Mouse', description: 'Nama produk kedua adalah Mouse' },
              { input: 'produk[0]["harga"]', expectedOutput: '10000000', description: 'Harga produk pertama' }
            ]
          }
        ]
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
        testCases: [
          { input: '{}', expectedOutput: '{"fireball": {"damage": 50, "mana": 25}}', description: 'Tambahkan spell fireball dengan damage dan mana' },
          { input: 'spell_book["heal"]', expectedOutput: '{"healing": 30, "mana": 15}', description: 'Spell heal harus punya healing dan mana' },
          { input: 'len(spell_book)', expectedOutput: '2', description: 'Spell book harus berisi minimal 2 spell' }
        ],
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
        exercises: [
          {
            id: 'ex-4-1-1',
            prompt: 'Buat fungsi "sapa" yang menerima nama dan mengembalikan "Halo, [nama]!"',
            starterCode: 'def sapa(nama):\n    # Kembalikan sapaan\n    pass\n\nprint(sapa("Budi"))',
            expectedOutput: 'Halo, Budi!',
            testCases: [
              { input: '"Budi"', expectedOutput: 'Halo, Budi!', description: 'Sapa Budi' },
              { input: '"Andi"', expectedOutput: 'Halo, Andi!', description: 'Sapa Andi' },
              { input: '"Python"', expectedOutput: 'Halo, Python!', description: 'Sapa Python' }
            ]
          },
          {
            id: 'ex-4-1-2',
            prompt: 'Buat fungsi "luas_segitiga" yang menghitung luas segitiga (alas * tinggi / 2)',
            starterCode: 'def luas_segitiga(alas, tinggi):\n    # Hitung luas segitiga\n    pass\n\nprint(luas_segitiga(10, 5))',
            expectedOutput: '25.0',
            testCases: [
              { input: '10, 5', expectedOutput: '25.0', description: 'Luas segitiga alas=10, tinggi=5' },
              { input: '6, 4', expectedOutput: '12.0', description: 'Luas segitiga alas=6, tinggi=4' }
            ]
          },
          {
            id: 'ex-4-1-3',
            prompt: 'Buat fungsi "is_genap" yang mengembalikan True jika angka genap',
            starterCode: 'def is_genap(angka):\n    # Cek apakah genap\n    pass\n\nprint(is_genap(4))\nprint(is_genap(7))',
            expectedOutput: 'True\nFalse',
            testCases: [
              { input: '4', expectedOutput: 'True', description: '4 adalah genap' },
              { input: '7', expectedOutput: 'False', description: '7 adalah ganjil' },
              { input: '0', expectedOutput: 'True', description: '0 adalah genap' }
            ]
          }
        ]
      },
      {
        id: '2',
        chapterId: '4',
        title: 'Function Parameters',
        description: 'Working with different types of parameters',
        content: 'Default parameters, *args, **kwargs, and more',
        order: 2,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-4-2-1',
            prompt: 'Buat fungsi dengan default parameter: sapa(nama, sapaan="Halo")',
            starterCode: 'def sapa(nama, sapaan="Halo"):\n    return f"{sapaan}, {nama}!"\n\nprint(sapa("Budi"))\nprint(sapa("Andi", "Selamat pagi"))',
            expectedOutput: 'Halo, Budi!\nSelamat pagi, Andi!',
            testCases: [
              { input: '"Budi"', expectedOutput: 'Halo, Budi!', description: 'Sapaan default "Halo"' },
              { input: '"Andi", "Selamat pagi"', expectedOutput: 'Selamat pagi, Andi!', description: 'Sapaan custom' }
            ]
          },
          {
            id: 'ex-4-2-2',
            prompt: 'Buat fungsi yang menerima *args dan mengembalikan jumlah semua angka',
            starterCode: 'def jumlahkan(*args):\n    # Jumlahkan semua argumen\n    pass\n\nprint(jumlahkan(1, 2, 3))\nprint(jumlahkan(10, 20))',
            expectedOutput: '6\n30',
            testCases: [
              { input: '1, 2, 3', expectedOutput: '6', description: 'Jumlah 1+2+3 = 6' },
              { input: '10, 20', expectedOutput: '30', description: 'Jumlah 10+20 = 30' },
              { input: '5', expectedOutput: '5', description: 'Satu argumen saja' }
            ]
          }
        ]
      },
      {
        id: '3',
        chapterId: '4',
        title: 'Lambda Functions',
        description: 'Understanding anonymous functions',
        content: 'Lambda functions for quick, inline operations',
        order: 3,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-4-3-1',
            prompt: 'Buat lambda function untuk menghitung kuadrat suatu angka',
            starterCode: '# Buat lambda kuadrat\nkuadrat = lambda x: x ** 2\nprint(kuadrat(5))\nprint(kuadrat(3))',
            expectedOutput: '25\n9',
            testCases: [
              { input: '5', expectedOutput: '25', description: 'Kuadrat dari 5 = 25' },
              { input: '3', expectedOutput: '9', description: 'Kuadrat dari 3 = 9' }
            ]
          },
          {
            id: 'ex-4-3-2',
            prompt: 'Gunakan lambda dengan sorted() untuk mengurutkan list tuple berdasarkan elemen kedua',
            starterCode: 'siswa = [("Andi", 85), ("Budi", 92), ("Cici", 78)]\n# Urutkan berdasarkan nilai (elemen kedua)\nhasil = sorted(siswa, key=lambda x: x[1])\nprint(hasil)',
            expectedOutput: "[('Cici', 78), ('Andi', 85), ('Budi', 92)]",
            testCases: [
              { input: '[("A",85),("B",92),("C",78)]', expectedOutput: "[('Cici', 78), ('Andi', 85), ('Budi', 92)]", description: 'Urut berdasarkan nilai ascending' },
              { input: '[("X",10),("Y",5)]', expectedOutput: "[('Y', 5), ('X', 10)]", description: 'Urut 2 tuple' }
            ]
          },
          {
            id: 'ex-4-3-3',
            prompt: 'Gunakan lambda dengan map() untuk mengalikan setiap elemen list dengan 2',
            starterCode: 'angka = [1, 2, 3, 4, 5]\n# Kalikan setiap elemen dengan 2\nhasil = list(map(lambda x: x * 2, angka))\nprint(hasil)',
            expectedOutput: '[2, 4, 6, 8, 10]',
            testCases: [
              { input: '[1,2,3,4,5]', expectedOutput: '[2, 4, 6, 8, 10]', description: 'Kalikan setiap elemen dengan 2' },
              { input: '[10, 20]', expectedOutput: '[20, 40]', description: 'Kalikan elemen lebih besar' }
            ]
          }
        ]
      },
      {
        id: '4',
        chapterId: '4',
        title: 'Decorators',
        description: 'Advanced function enhancement with decorators',
        content: 'Creating and using decorators to modify function behavior',
        order: 4,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-4-4-1',
            prompt: 'Buat decorator sederhana yang mencetak "Mulai..." sebelum fungsi dijalankan',
            starterCode: 'def log_decorator(func):\n    def wrapper(*args):\n        print("Mulai...")\n        result = func(*args)\n        print("Selesai!")\n        return result\n    return wrapper\n\n@log_decorator\ndef sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Budi")',
            expectedOutput: 'Mulai...\nHalo, Budi!\nSelesai!',
            testCases: [
              { input: '"Budi"', expectedOutput: 'Mulai...\nHalo, Budi!\nSelesai!', description: 'Decorator dengan output log' },
              { input: '"Andi"', expectedOutput: 'Mulai...\nHalo, Andi!\nSelesai!', description: 'Decorator dengan nama lain' }
            ]
          },
          {
            id: 'ex-4-4-2',
            prompt: 'Buat decorator timer yang menghitung waktu eksekusi fungsi',
            starterCode: 'import time\n\ndef timer(func):\n    def wrapper(*args):\n        start = time.time()\n        result = func(*args)\n        end = time.time()\n        print(f"Waktu: {end - start:.4f} detik")\n        return result\n    return wrapper\n\n@timer\ndef hitung():\n    return sum(range(1000))\n\nprint(hitung())',
            expectedOutput: '499500',
            testCases: [
              { input: 'range(1000)', expectedOutput: '499500', description: 'Jumlah 0-999 = 499500' },
              { input: 'range(100)', expectedOutput: '4950', description: 'Jumlah 0-99 = 4950' }
            ]
          }
        ]
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
        testCases: [
          { input: '"fireball", 50', expectedOutput: '{"name": "fireball", "power": 50, "active": true}', description: 'Buat enchantment fireball dengan power 50' },
          { input: '"shield", 30', expectedOutput: '{"name": "shield", "power": 30, "active": true}', description: 'Buat enchantment shield dengan power 30' },
          { input: '"heal", 100', expectedOutput: '{"name": "heal", "power": 100, "active": true}', description: 'Buat enchantment heal dengan power 100' }
        ],
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
        exercises: [
          {
            id: 'ex-5-1-1',
            prompt: 'Buat class Hewan dengan atribut nama dan suara, serta method bersuara()',
            starterCode: 'class Hewan:\n    def __init__(self, nama, suara):\n        self.nama = nama\n        self.suara = suara\n\n    def bersuara(self):\n        return f"{self.nama} bersuara: {self.suara}!"\n\nkucing = Hewan("Kucing", "Meong")\nprint(kucing.bersuara())',
            expectedOutput: 'Kucing bersuara: Meong!',
            testCases: [
              { input: '"Kucing", "Meong"', expectedOutput: 'Kucing bersuara: Meong!', description: 'Kucing bersuara Meong' },
              { input: '"Anjing", "Guk"', expectedOutput: 'Anjing bersuara: Guk!', description: 'Anjing bersuara Guk' }
            ]
          },
          {
            id: 'ex-5-1-2',
            prompt: 'Buat class Persegi dengan atribut sisi dan method luas() serta keliling()',
            starterCode: 'class Persegi:\n    def __init__(self, sisi):\n        self.sisi = sisi\n\n    def luas(self):\n        return self.sisi ** 2\n\n    def keliling(self):\n        return 4 * self.sisi\n\np = Persegi(5)\nprint(p.luas())\nprint(p.keliling())',
            expectedOutput: '25\n20',
            testCases: [
              { input: '5', expectedOutput: '25', description: 'Luas persegi sisi 5 = 25' },
              { input: '5', expectedOutput: '20', description: 'Keliling persegi sisi 5 = 20' },
              { input: '3', expectedOutput: '9', description: 'Luas persegi sisi 3 = 9' }
            ]
          },
          {
            id: 'ex-5-1-3',
            prompt: 'Buat inheritance: class Kucing mewarisi class Hewan',
            starterCode: 'class Hewan:\n    def __init__(self, nama):\n        self.nama = nama\n\n    def info(self):\n        return f"Hewan: {self.nama}"\n\nclass Kucing(Hewan):\n    def __init__(self, nama, warna):\n        super().__init__(nama)\n        self.warna = warna\n\n    def info(self):\n        return f"Kucing {self.nama} berwarna {self.warna}"\n\nk = Kucing("Milo", "Orange")\nprint(k.info())',
            expectedOutput: 'Kucing Milo berwarna Orange',
            testCases: [
              { input: '"Milo", "Orange"', expectedOutput: 'Kucing Milo berwarna Orange', description: 'Info kucing Milo' },
              { input: '"Luna", "Putih"', expectedOutput: 'Kucing Luna berwarna Putih', description: 'Info kucing Luna' }
            ]
          }
        ]
      },
      {
        id: '2',
        chapterId: '5',
        title: 'Error Handling',
        description: 'Managing exceptions and errors gracefully',
        content: 'Try-except blocks and exception handling',
        order: 2,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-5-2-1',
            prompt: 'Gunakan try-except untuk menangani error pembagian dengan nol',
            starterCode: 'def bagi(a, b):\n    try:\n        hasil = a / b\n        return hasil\n    except ZeroDivisionError:\n        return "Error: Tidak bisa dibagi nol!"\n\nprint(bagi(10, 2))\nprint(bagi(10, 0))',
            expectedOutput: '5.0\nError: Tidak bisa dibagi nol!',
            testCases: [
              { input: '10, 2', expectedOutput: '5.0', description: 'Pembagian normal 10/2' },
              { input: '10, 0', expectedOutput: 'Error: Tidak bisa dibagi nol!', description: 'Handle pembagian nol' }
            ]
          },
          {
            id: 'ex-5-2-2',
            prompt: 'Gunakan try-except-finally untuk menangani konversi tipe data',
            starterCode: 'def konversi_angka(teks):\n    try:\n        angka = int(teks)\n        return angka\n    except ValueError:\n        return "Error: Bukan angka valid!"\n    finally:\n        print("Proses selesai")\n\nprint(konversi_angka("42"))\nprint(konversi_angka("abc"))',
            expectedOutput: 'Proses selesai\n42\nProses selesai\nError: Bukan angka valid!',
            testCases: [
              { input: '"42"', expectedOutput: '42', description: 'Konversi string angka valid' },
              { input: '"abc"', expectedOutput: 'Error: Bukan angka valid!', description: 'Handle string bukan angka' }
            ]
          }
        ]
      },
      {
        id: '3',
        chapterId: '5',
        title: 'File Operations',
        description: 'Reading from and writing to files',
        content: 'File I/O operations and working with different file formats',
        order: 3,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-5-3-1',
            prompt: 'Tulis kode untuk menulis teks ke file lalu membacanya kembali',
            starterCode: '# Menulis ke file\nwith open("contoh.txt", "w") as f:\n    f.write("Halo Python!")\n\n# Membaca dari file\nwith open("contoh.txt", "r") as f:\n    isi = f.read()\n    print(isi)',
            expectedOutput: 'Halo Python!',
            testCases: [
              { input: '"Halo Python!"', expectedOutput: 'Halo Python!', description: 'Baca file yang baru ditulis' },
              { input: '"Belajar Python"', expectedOutput: 'Belajar Python', description: 'Baca file dengan teks lain' }
            ]
          },
          {
            id: 'ex-5-3-2',
            prompt: 'Tulis kode untuk menulis beberapa baris ke file dan membacanya per baris',
            starterCode: '# Menulis beberapa baris\nlines = ["Baris 1\\n", "Baris 2\\n", "Baris 3\\n"]\nwith open("multi.txt", "w") as f:\n    f.writelines(lines)\n\n# Baca per baris\nwith open("multi.txt", "r") as f:\n    for line in f:\n        print(line.strip())',
            expectedOutput: 'Baris 1\nBaris 2\nBaris 3',
            testCases: [
              { input: '3 baris', expectedOutput: 'Baris 1\nBaris 2\nBaris 3', description: 'Baca 3 baris dari file' },
              { input: '2 baris', expectedOutput: 'Baris 1\nBaris 2', description: 'Baca 2 baris dari file' }
            ]
          }
        ]
      },
      {
        id: '4',
        chapterId: '5',
        title: 'Modules & Packages',
        description: 'Organizing code with modules and packages',
        content: 'Creating reusable code components',
        order: 4,
        isCompleted: false,
        exercises: [
          {
            id: 'ex-5-4-1',
            prompt: 'Gunakan module math untuk menghitung akar kuadrat dan nilai pi',
            starterCode: 'import math\n\n# Hitung akar kuadrat dari 144\nprint(math.sqrt(144))\n# Cetak nilai pi\nprint(round(math.pi, 2))',
            expectedOutput: '12.0\n3.14',
            testCases: [
              { input: '144', expectedOutput: '12.0', description: 'Akar kuadrat 144 = 12.0' },
              { input: 'math.pi', expectedOutput: '3.14', description: 'Nilai pi dibulatkan 2 desimal' }
            ]
          },
          {
            id: 'ex-5-4-2',
            prompt: 'Gunakan module random untuk menghasilkan angka acak dan memilih item acak',
            starterCode: 'import random\n\n# Set seed agar hasil konsisten\nrandom.seed(42)\n\n# Angka acak 1-10\nprint(random.randint(1, 10))\n\n# Pilih acak dari list\nbuah = ["apel", "jeruk", "mangga"]\nprint(random.choice(buah))',
            expectedOutput: '2\nmangga',
            testCases: [
              { input: 'seed=42, randint(1,10)', expectedOutput: '2', description: 'Angka acak dengan seed 42' },
              { input: 'seed=42, choice(buah)', expectedOutput: 'mangga', description: 'Pilihan acak dengan seed 42' }
            ]
          }
        ]
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
        testCases: [
          { input: 'Wizard("Gandalf")', expectedOutput: '{"name": "Gandalf", "spells": [], "level": 1}', description: 'Buat wizard Gandalf dengan spells kosong dan level 1' },
          { input: 'Wizard("Merlin")', expectedOutput: '{"name": "Merlin", "spells": [], "level": 1}', description: 'Buat wizard Merlin dengan atribut default' },
          { input: 'wizard.learn_spell("Fireball")', expectedOutput: '["Fireball"]', description: 'Wizard bisa belajar spell baru' }
        ],
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

export async function getLessonData(chapterId: string): Promise<Lesson[] | null>;
export async function getLessonData(chapterId: string, lessonId: string): Promise<Lesson | null>;
export async function getLessonData(chapterId: string, lessonId?: string): Promise<Lesson[] | Lesson | null> {
  const chapter = await getChapterData(chapterId);
  if (!chapter) return null;

  if (lessonId) {
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    return lesson || null;
  }

  return chapter.lessons;
}

export async function getChallengeData(chapterId: string): Promise<Challenge[] | null>;
export async function getChallengeData(chapterId: string, challengeId: string): Promise<Challenge | null>;
export async function getChallengeData(chapterId: string, challengeId?: string): Promise<Challenge[] | Challenge | null> {
  const chapter = await getChapterData(chapterId);
  if (!chapter) return null;

  if (challengeId) {
    const challenge = chapter.challenges.find(c => c.id === challengeId);
    return challenge || null;
  }

  return chapter.challenges;
}
