export type ExamQuestionType = 'MULTIPLE_CHOICE' | 'ESSAY' | 'MATCHING';

export interface MCOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface ExamQuestion {
  questionText: string;
  questionType: ExamQuestionType;
  points: number;
  options?: MCOption[];
  keywords?: string[];
  matchingPairs?: MatchingPair[];
  correctAnswer: string;
}

export interface ExamData {
  chapterNumber: number;
  title: string;
  description: string;
  timeLimit: number;
  questions: ExamQuestion[];
}

export const examQuestions: ExamData[] = [
  // ──────────────────────────────────────────────
  // CHAPTER 0 — Dasar Pemrograman Python
  // ──────────────────────────────────────────────
  {
    chapterNumber: 0,
    title: 'Ujian Bab 0: Dasar Pemrograman Python',
    description:
      'Ujian ini menguji pemahaman Anda tentang konsep dasar pemrograman, variabel, tipe data, dan operasi dasar di Python.',
    timeLimit: 45,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Apa yang dimaksud dengan pemrograman?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Proses membuat instruksi yang dapat dijalankan oleh komputer', isCorrect: true },
          { label: 'B', text: 'Proses menggambar desain website', isCorrect: false },
          { label: 'C', text: 'Proses memperbaiki hardware komputer', isCorrect: false },
          { label: 'D', text: 'Proses menginstal sistem operasi', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 2 ──
      {
        questionText: 'Manakah nama variabel yang VALID di Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '2nama', isCorrect: false },
          { label: 'B', text: 'nama-saya', isCorrect: false },
          { label: 'C', text: 'nama_saya', isCorrect: true },
          { label: 'D', text: 'class', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 3 ──
      {
        questionText: 'Apa tipe data dari nilai `3.14` di Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'int', isCorrect: false },
          { label: 'B', text: 'float', isCorrect: true },
          { label: 'C', text: 'str', isCorrect: false },
          { label: 'D', text: 'bool', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 4 ──
      {
        questionText: 'Apa output dari kode berikut: `print(10 // 3)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '3.33', isCorrect: false },
          { label: 'B', text: '3', isCorrect: true },
          { label: 'C', text: '1', isCorrect: false },
          { label: 'D', text: '10', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 5 ──
      {
        questionText: 'Apa output dari kode berikut: `print(type(True))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: "<class 'int'>", isCorrect: false },
          { label: 'B', text: "<class 'str'>", isCorrect: false },
          { label: 'C', text: "<class 'bool'>", isCorrect: true },
          { label: 'D', text: "<class 'float'>", isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 6 ──
      {
        questionText: 'Operator manakah yang digunakan untuk sisa bagi (modulus) di Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '//', isCorrect: false },
          { label: 'B', text: '**', isCorrect: false },
          { label: 'C', text: '%', isCorrect: true },
          { label: 'D', text: '/', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 7 ──
      {
        questionText: 'Apa output dari kode berikut: `print("Halo" + " " + "Dunia")`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'HaloDunia', isCorrect: false },
          { label: 'B', text: 'Halo Dunia', isCorrect: true },
          { label: 'C', text: 'Error', isCorrect: false },
          { label: 'D', text: '"Halo" " " "Dunia"', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 8 ──
      {
        questionText: 'Apa output dari kode berikut: `x = 5; x = x + 3; print(x)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '5', isCorrect: false },
          { label: 'B', text: '3', isCorrect: false },
          { label: 'C', text: '8', isCorrect: true },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 9 ──
      {
        questionText: 'Apa hasil dari `print("Python" * 3)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Python3', isCorrect: false },
          { label: 'B', text: 'PythonPythonPython', isCorrect: true },
          { label: 'C', text: 'Error', isCorrect: false },
          { label: 'D', text: 'Python * 3', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 10 ──
      {
        questionText: 'Fungsi bawaan Python yang digunakan untuk menampilkan output ke layar adalah...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'input()', isCorrect: false },
          { label: 'B', text: 'display()', isCorrect: false },
          { label: 'C', text: 'print()', isCorrect: true },
          { label: 'D', text: 'show()', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan apa yang dimaksud dengan variabel dalam pemrograman Python dan berikan contoh penggunaannya!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['tempat menyimpan', 'data', 'nilai', 'nama', 'memori'],
        correctAnswer:
          'Variabel adalah tempat atau wadah untuk menyimpan data di dalam memori komputer. Variabel memiliki nama yang digunakan untuk mengakses nilai yang tersimpan di dalamnya. Contoh: nama = "Budi" menyimpan teks "Budi" ke dalam variabel bernama nama.',
      },
      // ── Essay 2 ──
      {
        questionText: 'Jelaskan perbedaan antara tipe data `int` dan `float` di Python beserta contohnya!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['bilangan bulat', 'desimal', 'koma', 'int', 'float'],
        correctAnswer:
          'Tipe data int digunakan untuk menyimpan bilangan bulat seperti 1, 42, -7, sedangkan float digunakan untuk menyimpan bilangan desimal (berkoma) seperti 3.14, -0.5, 2.0. Perbedaan utamanya adalah float memiliki bagian desimal setelah tanda titik.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Apa yang dimaksud dengan program komputer? Jelaskan langkah-langkah dasar dalam membuat program Python sederhana!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['instruksi', 'komputer', 'urutan', 'file', 'menjalankan'],
        correctAnswer:
          'Program komputer adalah kumpulan instruksi yang ditulis dalam bahasa pemrograman untuk menyelesaikan tugas tertentu. Langkah membuat program Python: (1) menulis kode dalam file berekstensi .py, (2) menyimpan file, (3) menjalankan file menggunakan interpreter Python.',
      },
      // ── Essay 4 ──
      {
        questionText: 'Jelaskan apa fungsi dari operator `=` dan operator `==` di Python serta berikan contoh penggunaannya!',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['assignment', 'perbandingan', 'menyimpan', 'membandingkan', 'sama dengan'],
        correctAnswer:
          'Operator `=` adalah operator assignment yang digunakan untuk menyimpan nilai ke variabel, misalnya x = 10. Operator `==` adalah operator perbandingan yang digunakan untuk membandingkan dua nilai apakah sama, misalnya x == 10 menghasilkan True jika x bernilai 10.',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan tipe data Python berikut dengan contoh nilainya yang tepat!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'int', right: '42' },
          { left: 'float', right: '3.14' },
          { left: 'str', right: '"Halo Dunia"' },
          { left: 'bool', right: 'True' },
        ],
        correctAnswer: '{"int":"42","float":"3.14","str":"\\"Halo Dunia\\"","bool":"True"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan operator aritmatika berikut dengan fungsinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: '+', right: 'Penjumlahan' },
          { left: '-', right: 'Pengurangan' },
          { left: '**', right: 'Perpangkatan' },
          { left: '%', right: 'Sisa bagi (modulus)' },
          { left: '//', right: 'Pembagian bulat' },
        ],
        correctAnswer: '{"+":"Penjumlahan","-":"Pengurangan","**":"Perpangkatan","%":"Sisa bagi (modulus)","//":"Pembagian bulat"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan fungsi bawaan Python berikut dengan kegunaannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'print()', right: 'Menampilkan output ke layar' },
          { left: 'input()', right: 'Menerima masukan dari pengguna' },
          { left: 'type()', right: 'Mengecek tipe data suatu nilai' },
          { left: 'int()', right: 'Mengubah nilai menjadi bilangan bulat' },
        ],
        correctAnswer: '{"print()":"Menampilkan output ke layar","input()":"Menerima masukan dari pengguna","type()":"Mengecek tipe data suatu nilai","int()":"Mengubah nilai menjadi bilangan bulat"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan istilah pemrograman berikut dengan definisinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'Variabel', right: 'Tempat menyimpan data di memori' },
          { left: 'Sintaks', right: 'Aturan penulisan kode program' },
          { left: 'Interpreter', right: 'Program yang menjalankan kode baris per baris' },
          { left: 'Komentar', right: 'Teks yang diabaikan saat program dijalankan' },
        ],
        correctAnswer: '{"Variabel":"Tempat menyimpan data di memori","Sintaks":"Aturan penulisan kode program","Interpreter":"Program yang menjalankan kode baris per baris","Komentar":"Teks yang diabaikan saat program dijalankan"}',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // CHAPTER 1 — List Python
  // ──────────────────────────────────────────────
  {
    chapterNumber: 1,
    title: 'Ujian Bab 1: List Python',
    description:
      'Ujian ini menguji pemahaman Anda tentang list di Python, termasuk pembuatan list, indexing, slicing, dan metode-metode dasar list.',
    timeLimit: 45,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Manakah cara yang benar untuk membuat list kosong di Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'list = ()', isCorrect: false },
          { label: 'B', text: 'list = []', isCorrect: true },
          { label: 'C', text: 'list = {}', isCorrect: false },
          { label: 'D', text: 'list = ""', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 2 ──
      {
        questionText: 'Apa output dari kode berikut: `buah = ["apel", "mangga", "jeruk"]; print(buah[1])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'apel', isCorrect: false },
          { label: 'B', text: 'mangga', isCorrect: true },
          { label: 'C', text: 'jeruk', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 3 ──
      {
        questionText: 'Apa output dari kode berikut: `angka = [10, 20, 30, 40]; print(angka[-1])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '10', isCorrect: false },
          { label: 'B', text: '30', isCorrect: false },
          { label: 'C', text: '40', isCorrect: true },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 4 ──
      {
        questionText: 'Apa output dari kode berikut: `data = [1, 2, 3, 4, 5]; print(len(data))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '4', isCorrect: false },
          { label: 'B', text: '5', isCorrect: true },
          { label: 'C', text: '6', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 5 ──
      {
        questionText: 'Apa perbedaan utama antara `append()` dan `extend()` pada list?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'append() menambahkan satu elemen, extend() menambahkan semua elemen dari iterable', isCorrect: true },
          { label: 'B', text: 'append() menghapus elemen, extend() menambahkan elemen', isCorrect: false },
          { label: 'C', text: 'Tidak ada perbedaan, keduanya sama', isCorrect: false },
          { label: 'D', text: 'append() untuk string, extend() untuk angka', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 6 ──
      {
        questionText: 'Apa output dari kode berikut: `print(3 in [1, 2, 3, 4])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '3', isCorrect: false },
          { label: 'B', text: 'True', isCorrect: true },
          { label: 'C', text: 'False', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 7 ──
      {
        questionText: 'Apa output dari kode berikut: `data = [1, 2, 3, 4, 5]; print(data[1:4])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '[1, 2, 3]', isCorrect: false },
          { label: 'B', text: '[2, 3, 4]', isCorrect: true },
          { label: 'C', text: '[2, 3, 4, 5]', isCorrect: false },
          { label: 'D', text: '[1, 2, 3, 4]', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 8 ──
      {
        questionText: 'Metode list mana yang menghapus dan mengembalikan elemen pada indeks tertentu?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'remove()', isCorrect: false },
          { label: 'B', text: 'delete()', isCorrect: false },
          { label: 'C', text: 'pop()', isCorrect: true },
          { label: 'D', text: 'discard()', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 9 ──
      {
        questionText: 'Apa output dari kode berikut: `x = [1, 2]; x.append([3, 4]); print(len(x))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '3', isCorrect: true },
          { label: 'B', text: '4', isCorrect: false },
          { label: 'C', text: '2', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 10 ──
      {
        questionText: 'Apa output dari kode berikut: `warna = ["merah", "hijau", "biru"]; warna.insert(1, "kuning"); print(warna)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '["kuning", "merah", "hijau", "biru"]', isCorrect: false },
          { label: 'B', text: '["merah", "kuning", "hijau", "biru"]', isCorrect: true },
          { label: 'C', text: '["merah", "hijau", "kuning", "biru"]', isCorrect: false },
          { label: 'D', text: '["merah", "hijau", "biru", "kuning"]', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan apa itu list di Python dan mengapa list sangat berguna dalam pemrograman!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['kumpulan', 'data', 'terurut', 'menyimpan', 'banyak nilai'],
        correctAnswer:
          'List adalah struktur data di Python yang digunakan untuk menyimpan kumpulan data secara terurut dalam satu variabel. List sangat berguna karena memungkinkan kita menyimpan banyak nilai sekaligus, bisa diubah (mutable), dan mendukung berbagai tipe data dalam satu list.',
      },
      // ── Essay 2 ──
      {
        questionText: 'Jelaskan perbedaan antara indexing dan slicing pada list Python beserta contohnya!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['indexing', 'satu elemen', 'slicing', 'bagian', 'rentang'],
        correctAnswer:
          'Indexing digunakan untuk mengakses satu elemen dari list menggunakan nomor indeks, misalnya data[0] mengambil elemen pertama. Slicing digunakan untuk mengambil sebagian (potongan) list menggunakan notasi [start:stop], misalnya data[1:3] mengambil elemen dari indeks 1 sampai 2.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Jelaskan perbedaan antara metode `remove()` dan `pop()` pada list Python!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['remove', 'nilai', 'pop', 'indeks', 'mengembalikan'],
        correctAnswer:
          'Metode remove() menghapus elemen berdasarkan nilainya, misalnya data.remove(3) menghapus angka 3 dari list. Metode pop() menghapus elemen berdasarkan indeksnya dan mengembalikan nilai yang dihapus, misalnya data.pop(0) menghapus dan mengembalikan elemen pertama.',
      },
      // ── Essay 4 ──
      {
        questionText: 'Kapan sebaiknya kita menggunakan list dalam program Python? Berikan minimal 2 contoh situasi penggunaan list!',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['kumpulan', 'banyak', 'urutan', 'daftar', 'menyimpan'],
        correctAnswer:
          'List sebaiknya digunakan ketika kita perlu menyimpan kumpulan data yang saling terkait. Contoh: (1) menyimpan daftar nama siswa dalam satu kelas, (2) menyimpan daftar nilai ujian untuk dihitung rata-ratanya, (3) menyimpan riwayat transaksi belanja.',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan metode list berikut dengan fungsinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'append()', right: 'Menambahkan elemen di akhir list' },
          { left: 'remove()', right: 'Menghapus elemen berdasarkan nilai' },
          { left: 'pop()', right: 'Menghapus dan mengembalikan elemen berdasarkan indeks' },
          { left: 'insert()', right: 'Menyisipkan elemen pada posisi tertentu' },
          { left: 'sort()', right: 'Mengurutkan elemen list' },
        ],
        correctAnswer: '{"append()":"Menambahkan elemen di akhir list","remove()":"Menghapus elemen berdasarkan nilai","pop()":"Menghapus dan mengembalikan elemen berdasarkan indeks","insert()":"Menyisipkan elemen pada posisi tertentu","sort()":"Mengurutkan elemen list"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan ekspresi list berikut dengan hasilnya! Diketahui `data = [10, 20, 30, 40, 50]`.',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'data[0]', right: '10' },
          { left: 'data[-1]', right: '50' },
          { left: 'data[1:3]', right: '[20, 30]' },
          { left: 'len(data)', right: '5' },
        ],
        correctAnswer: '{"data[0]":"10","data[-1]":"50","data[1:3]":"[20, 30]","len(data)":"5"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan operasi list berikut dengan deskripsinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'list1 + list2', right: 'Menggabungkan dua list' },
          { left: 'list1 * 3', right: 'Mengulang list sebanyak 3 kali' },
          { left: 'x in list1', right: 'Mengecek apakah x ada dalam list' },
          { left: 'list1[::-1]', right: 'Membalik urutan list' },
        ],
        correctAnswer: '{"list1 + list2":"Menggabungkan dua list","list1 * 3":"Mengulang list sebanyak 3 kali","x in list1":"Mengecek apakah x ada dalam list","list1[::-1]":"Membalik urutan list"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan fungsi bawaan Python berikut dengan kegunaannya pada list!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'len()', right: 'Menghitung jumlah elemen dalam list' },
          { left: 'max()', right: 'Mencari nilai terbesar dalam list' },
          { left: 'min()', right: 'Mencari nilai terkecil dalam list' },
          { left: 'sum()', right: 'Menjumlahkan semua elemen dalam list' },
        ],
        correctAnswer: '{"len()":"Menghitung jumlah elemen dalam list","max()":"Mencari nilai terbesar dalam list","min()":"Mencari nilai terkecil dalam list","sum()":"Menjumlahkan semua elemen dalam list"}',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // CHAPTER 2 — List Lanjutan
  // ──────────────────────────────────────────────
  {
    chapterNumber: 2,
    title: 'Ujian Bab 2: List Lanjutan',
    description:
      'Ujian ini menguji pemahaman Anda tentang fitur lanjutan list Python seperti list comprehension, nested list, dan metode-metode lanjutan.',
    timeLimit: 50,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Apa output dari kode berikut: `hasil = [x * 2 for x in range(4)]; print(hasil)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '[0, 2, 4, 6]', isCorrect: true },
          { label: 'B', text: '[2, 4, 6, 8]', isCorrect: false },
          { label: 'C', text: '[0, 1, 2, 3]', isCorrect: false },
          { label: 'D', text: '[1, 2, 3, 4]', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 2 ──
      {
        questionText: 'Apa output dari kode berikut: `matrix = [[1, 2], [3, 4], [5, 6]]; print(matrix[1][0])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '1', isCorrect: false },
          { label: 'B', text: '2', isCorrect: false },
          { label: 'C', text: '3', isCorrect: true },
          { label: 'D', text: '4', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 3 ──
      {
        questionText: 'Apa output dari kode berikut: `genap = [x for x in range(10) if x % 2 == 0]; print(genap)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '[0, 2, 4, 6, 8]', isCorrect: true },
          { label: 'B', text: '[2, 4, 6, 8, 10]', isCorrect: false },
          { label: 'C', text: '[1, 3, 5, 7, 9]', isCorrect: false },
          { label: 'D', text: '[0, 1, 2, 3, 4]', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 4 ──
      {
        questionText: 'Apa perbedaan antara `sorted(list)` dan `list.sort()`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Tidak ada perbedaan', isCorrect: false },
          { label: 'B', text: 'sorted() mengembalikan list baru, sort() mengubah list asli', isCorrect: true },
          { label: 'C', text: 'sort() lebih cepat dari sorted()', isCorrect: false },
          { label: 'D', text: 'sorted() hanya untuk angka, sort() untuk semua tipe', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 5 ──
      {
        questionText: 'Apa output dari kode berikut: `data = [3, 1, 4, 1, 5]; data.sort(reverse=True); print(data[0])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '1', isCorrect: false },
          { label: 'B', text: '3', isCorrect: false },
          { label: 'C', text: '5', isCorrect: true },
          { label: 'D', text: '4', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 6 ──
      {
        questionText: 'Apa output dari kode berikut: `kata = list("Python"); print(kata)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '["Python"]', isCorrect: false },
          { label: 'B', text: '["P", "y", "t", "h", "o", "n"]', isCorrect: true },
          { label: 'C', text: 'Python', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 7 ──
      {
        questionText: 'Apa output dari: `print(list(map(lambda x: x**2, [1, 2, 3])))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '[1, 2, 3]', isCorrect: false },
          { label: 'B', text: '[1, 4, 9]', isCorrect: true },
          { label: 'C', text: '[2, 4, 6]', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 8 ──
      {
        questionText: 'Apa output dari: `data = [1, 2, 2, 3, 3, 3]; print(data.count(3))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '1', isCorrect: false },
          { label: 'B', text: '2', isCorrect: false },
          { label: 'C', text: '3', isCorrect: true },
          { label: 'D', text: '6', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 9 ──
      {
        questionText: 'Apa output dari kode berikut: `a = [1, 2, 3]; b = a[:]; b.append(4); print(len(a))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '3', isCorrect: true },
          { label: 'B', text: '4', isCorrect: false },
          { label: 'C', text: 'Error', isCorrect: false },
          { label: 'D', text: '0', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 10 ──
      {
        questionText: 'Fungsi `filter()` digunakan untuk...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Mengurutkan elemen list', isCorrect: false },
          { label: 'B', text: 'Menyaring elemen list berdasarkan kondisi tertentu', isCorrect: true },
          { label: 'C', text: 'Menggabungkan dua list', isCorrect: false },
          { label: 'D', text: 'Menghitung jumlah elemen list', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan apa itu list comprehension di Python dan apa keuntungannya dibandingkan loop biasa! Berikan contoh kode.',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['singkat', 'satu baris', 'efisien', 'membuat list', 'for'],
        correctAnswer:
          'List comprehension adalah cara singkat untuk membuat list baru menggunakan satu baris kode dengan sintaks [ekspresi for item in iterable]. Keuntungannya: lebih ringkas, lebih mudah dibaca, dan umumnya lebih cepat. Contoh: kuadrat = [x**2 for x in range(5)] menghasilkan [0, 1, 4, 9, 16].',
      },
      // ── Essay 2 ──
      {
        questionText: 'Jelaskan apa itu nested list (list bersarang) dan berikan contoh kasus penggunaannya dalam pemrograman!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['list di dalam list', 'bersarang', 'matriks', 'tabel', 'dua dimensi'],
        correctAnswer:
          'Nested list adalah list yang berisi list lain di dalamnya, membentuk struktur data multi-dimensi. Contoh kasus: merepresentasikan matriks matematika, menyimpan data tabel seperti nilai siswa per mata pelajaran, atau menyimpan koordinat titik-titik pada grafik.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Jelaskan perbedaan antara shallow copy dan deep copy pada list Python! Mengapa hal ini penting?',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['shallow', 'deep', 'referensi', 'salinan', 'independen'],
        correctAnswer:
          'Shallow copy membuat salinan list di level pertama saja — jika list berisi list lain, elemen dalamnya masih berbagi referensi. Deep copy membuat salinan penuh yang sepenuhnya independen. Ini penting karena mengubah nested list pada shallow copy bisa mempengaruhi list asli tanpa disadari.',
      },
      // ── Essay 4 ──
      {
        questionText: 'Jelaskan cara kerja fungsi `map()` dan `filter()` pada list Python serta berikan contoh masing-masing!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['map', 'transformasi', 'filter', 'menyaring', 'fungsi'],
        correctAnswer:
          'Fungsi map() menerapkan sebuah fungsi ke setiap elemen iterable, misalnya list(map(str, [1,2,3])) mengubah semua angka menjadi string. Fungsi filter() menyaring elemen berdasarkan kondisi, misalnya list(filter(lambda x: x>0, [-1,2,-3,4])) menghasilkan [2, 4].',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan list comprehension berikut dengan hasilnya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: '[x for x in range(5)]', right: '[0, 1, 2, 3, 4]' },
          { left: '[x*2 for x in range(3)]', right: '[0, 2, 4]' },
          { left: '[x for x in range(6) if x%2==0]', right: '[0, 2, 4]' },
          { left: '[x**2 for x in range(4)]', right: '[0, 1, 4, 9]' },
        ],
        correctAnswer: '{"[x for x in range(5)]":"[0, 1, 2, 3, 4]","[x*2 for x in range(3)]":"[0, 2, 4]","[x for x in range(6) if x%2==0]":"[0, 2, 4]","[x**2 for x in range(4)]":"[0, 1, 4, 9]"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan operasi list lanjutan berikut dengan deskripsinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'list.count(x)', right: 'Menghitung kemunculan x dalam list' },
          { left: 'list.index(x)', right: 'Mencari posisi pertama x dalam list' },
          { left: 'list.reverse()', right: 'Membalik urutan list secara in-place' },
          { left: 'list.copy()', right: 'Membuat salinan dangkal dari list' },
          { left: 'list.clear()', right: 'Menghapus semua elemen dari list' },
        ],
        correctAnswer: '{"list.count(x)":"Menghitung kemunculan x dalam list","list.index(x)":"Mencari posisi pertama x dalam list","list.reverse()":"Membalik urutan list secara in-place","list.copy()":"Membuat salinan dangkal dari list","list.clear()":"Menghapus semua elemen dari list"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan konsep list lanjutan berikut dengan penjelasannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'List Comprehension', right: 'Membuat list baru dengan sintaks ringkas satu baris' },
          { left: 'Nested List', right: 'List yang berisi list lain di dalamnya' },
          { left: 'Slicing', right: 'Mengambil sebagian elemen dari list' },
          { left: 'Lambda', right: 'Fungsi anonim tanpa nama yang ditulis dalam satu baris' },
        ],
        correctAnswer: '{"List Comprehension":"Membuat list baru dengan sintaks ringkas satu baris","Nested List":"List yang berisi list lain di dalamnya","Slicing":"Mengambil sebagian elemen dari list","Lambda":"Fungsi anonim tanpa nama yang ditulis dalam satu baris"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan kode berikut dengan outputnya! Diketahui `m = [[1,2,3],[4,5,6],[7,8,9]]`.',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'm[0]', right: '[1, 2, 3]' },
          { left: 'm[2][2]', right: '9' },
          { left: 'm[1][0]', right: '4' },
          { left: 'len(m)', right: '3' },
        ],
        correctAnswer: '{"m[0]":"[1, 2, 3]","m[2][2]":"9","m[1][0]":"4","len(m)":"3"}',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // CHAPTER 3 — Dictionary Python
  // ──────────────────────────────────────────────
  {
    chapterNumber: 3,
    title: 'Ujian Bab 3: Dictionary Python',
    description:
      'Ujian ini menguji pemahaman Anda tentang dictionary di Python, termasuk pembuatan, akses data, metode-metode penting, dan nested dictionary.',
    timeLimit: 50,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Manakah cara yang benar untuk membuat dictionary di Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'data = [nama: "Budi"]', isCorrect: false },
          { label: 'B', text: 'data = {"nama": "Budi"}', isCorrect: true },
          { label: 'C', text: 'data = ("nama", "Budi")', isCorrect: false },
          { label: 'D', text: 'data = <nama: "Budi">', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 2 ──
      {
        questionText: 'Apa output dari kode berikut: `d = {"a": 1, "b": 2}; print(d["b"])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '1', isCorrect: false },
          { label: 'B', text: '2', isCorrect: true },
          { label: 'C', text: '"b"', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 3 ──
      {
        questionText: 'Apa keuntungan menggunakan `dict.get("key", default)` dibandingkan `dict["key"]`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Lebih cepat', isCorrect: false },
          { label: 'B', text: 'Tidak menghasilkan error jika key tidak ada', isCorrect: true },
          { label: 'C', text: 'Bisa mengakses banyak key sekaligus', isCorrect: false },
          { label: 'D', text: 'Tidak ada perbedaan', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 4 ──
      {
        questionText: 'Tipe data manakah yang TIDAK bisa digunakan sebagai key dictionary?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'str', isCorrect: false },
          { label: 'B', text: 'int', isCorrect: false },
          { label: 'C', text: 'list', isCorrect: true },
          { label: 'D', text: 'tuple', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 5 ──
      {
        questionText: 'Apa output dari kode berikut: `d = {"x": 1, "y": 2, "z": 3}; print(len(d))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '2', isCorrect: false },
          { label: 'B', text: '3', isCorrect: true },
          { label: 'C', text: '6', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 6 ──
      {
        questionText: 'Apa yang terjadi saat kita menambahkan key yang sudah ada ke dictionary?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Error akan muncul', isCorrect: false },
          { label: 'B', text: 'Key baru ditambahkan secara terpisah', isCorrect: false },
          { label: 'C', text: 'Nilai lama akan diganti dengan nilai baru', isCorrect: true },
          { label: 'D', text: 'Tidak terjadi apa-apa', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 7 ──
      {
        questionText: 'Apa output dari: `d = {"a": 1, "b": 2}; d.update({"b": 5, "c": 3}); print(d["b"])`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '2', isCorrect: false },
          { label: 'B', text: '5', isCorrect: true },
          { label: 'C', text: '3', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 8 ──
      {
        questionText: 'Apa output dari: `siswa = {"nama": "Andi", "umur": 17}; print("nama" in siswa)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'True', isCorrect: true },
          { label: 'B', text: 'False', isCorrect: false },
          { label: 'C', text: '"Andi"', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 9 ──
      {
        questionText: 'Metode `dict.items()` mengembalikan...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Hanya daftar key', isCorrect: false },
          { label: 'B', text: 'Hanya daftar value', isCorrect: false },
          { label: 'C', text: 'Daftar pasangan (key, value) dalam bentuk tuple', isCorrect: true },
          { label: 'D', text: 'Jumlah elemen dalam dictionary', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 10 ──
      {
        questionText: 'Apa output dari: `d = {"a": 1, "b": 2}; d.pop("a"); print(d)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '{"a": 1, "b": 2}', isCorrect: false },
          { label: 'B', text: '{"b": 2}', isCorrect: true },
          { label: 'C', text: '{"a": 1}', isCorrect: false },
          { label: 'D', text: '{}', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan perbedaan utama antara list dan dictionary di Python! Kapan sebaiknya menggunakan masing-masing?',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['list', 'urutan', 'indeks', 'dictionary', 'key-value', 'pasangan'],
        correctAnswer:
          'List menyimpan data secara berurutan dan diakses menggunakan indeks numerik (0, 1, 2, ...). Dictionary menyimpan data dalam pasangan key-value dan diakses menggunakan key. List cocok untuk data berurutan seperti daftar nama, sedangkan dictionary cocok untuk data yang memiliki label seperti profil pengguna.',
      },
      // ── Essay 2 ──
      {
        questionText: 'Jelaskan apa itu nested dictionary dan berikan contoh kasus penggunaannya yang relevan!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['bersarang', 'dictionary di dalam', 'struktur kompleks', 'hierarki', 'bertingkat'],
        correctAnswer:
          'Nested dictionary adalah dictionary yang berisi dictionary lain sebagai nilainya, membentuk struktur data bertingkat. Contoh: menyimpan data siswa di mana setiap siswa memiliki dictionary berisi nama, umur, dan nilai. Ini berguna untuk merepresentasikan data hierarkis seperti JSON atau konfigurasi aplikasi.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Mengapa tipe data mutable seperti list tidak bisa dijadikan key dictionary? Jelaskan alasannya!',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['mutable', 'hashable', 'berubah', 'unik', 'immutable'],
        correctAnswer:
          'Key dictionary harus bersifat hashable (memiliki hash value tetap). Tipe data mutable seperti list bisa berubah nilainya kapan saja, sehingga hash value-nya juga berubah. Ini akan membuat dictionary tidak bisa menemukan key tersebut setelah diubah. Oleh karena itu, hanya tipe immutable seperti str, int, dan tuple yang bisa menjadi key.',
      },
      // ── Essay 4 ──
      {
        questionText: 'Jelaskan cara melakukan iterasi (perulangan) pada dictionary Python dan sebutkan minimal 3 cara berbeda!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['keys', 'values', 'items', 'for', 'iterasi'],
        correctAnswer:
          'Ada beberapa cara iterasi dictionary: (1) `for key in dict` — iterasi melalui key saja, (2) `for key, val in dict.items()` — iterasi melalui pasangan key-value, (3) `for val in dict.values()` — iterasi melalui value saja. Masing-masing berguna tergantung data yang diperlukan.',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan metode dictionary berikut dengan fungsinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'dict.keys()', right: 'Mengembalikan semua key' },
          { left: 'dict.values()', right: 'Mengembalikan semua value' },
          { left: 'dict.items()', right: 'Mengembalikan semua pasangan key-value' },
          { left: 'dict.get(key)', right: 'Mengambil value tanpa error jika key tidak ada' },
          { left: 'dict.pop(key)', right: 'Menghapus dan mengembalikan value berdasarkan key' },
        ],
        correctAnswer: '{"dict.keys()":"Mengembalikan semua key","dict.values()":"Mengembalikan semua value","dict.items()":"Mengembalikan semua pasangan key-value","dict.get(key)":"Mengambil value tanpa error jika key tidak ada","dict.pop(key)":"Menghapus dan mengembalikan value berdasarkan key"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan kode berikut dengan outputnya! Diketahui `info = {"nama": "Siti", "umur": 20, "kota": "Jakarta"}`.',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'info["nama"]', right: '"Siti"' },
          { left: 'info.get("alamat", "Tidak ada")', right: '"Tidak ada"' },
          { left: 'len(info)', right: '3' },
          { left: '"kota" in info', right: 'True' },
        ],
        correctAnswer: '{"info[\\"nama\\"]":"\\"Siti\\"","info.get(\\"alamat\\", \\"Tidak ada\\")":"\\"Tidak ada\\"","len(info)":"3","\\"kota\\" in info":"True"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan konsep dictionary berikut dengan penjelasannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'Key', right: 'Pengidentifikasi unik untuk mengakses value' },
          { left: 'Value', right: 'Data yang disimpan dan diakses melalui key' },
          { left: 'Pair (Pasangan)', right: 'Satu unit key dan value yang saling terkait' },
          { left: 'Hashable', right: 'Sifat tipe data yang bisa dijadikan key' },
        ],
        correctAnswer: '{"Key":"Pengidentifikasi unik untuk mengakses value","Value":"Data yang disimpan dan diakses melalui key","Pair (Pasangan)":"Satu unit key dan value yang saling terkait","Hashable":"Sifat tipe data yang bisa dijadikan key"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan operasi dictionary berikut dengan hasilnya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'dict.update(dict2)', right: 'Menggabungkan dict2 ke dalam dict' },
          { left: 'dict.clear()', right: 'Menghapus semua elemen dictionary' },
          { left: 'dict.copy()', right: 'Membuat salinan dangkal dictionary' },
          { left: 'dict.setdefault(key, val)', right: 'Mengambil value atau menetapkan default jika key belum ada' },
        ],
        correctAnswer: '{"dict.update(dict2)":"Menggabungkan dict2 ke dalam dict","dict.clear()":"Menghapus semua elemen dictionary","dict.copy()":"Membuat salinan dangkal dictionary","dict.setdefault(key, val)":"Mengambil value atau menetapkan default jika key belum ada"}',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // CHAPTER 4 — Loops (Perulangan)
  // ──────────────────────────────────────────────
  {
    chapterNumber: 4,
    title: 'Ujian Bab 4: Loops (Perulangan)',
    description:
      'Ujian ini menguji pemahaman Anda tentang perulangan di Python, termasuk for loop, while loop, nested loop, serta penggunaan break dan continue.',
    timeLimit: 50,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Apa output dari kode berikut: `for i in range(3): print(i, end=" ")`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '1 2 3', isCorrect: false },
          { label: 'B', text: '0 1 2', isCorrect: true },
          { label: 'C', text: '0 1 2 3', isCorrect: false },
          { label: 'D', text: '1 2', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 2 ──
      {
        questionText: 'Apa output dari `range(2, 10, 3)` jika diubah menjadi list?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '[2, 5, 8]', isCorrect: true },
          { label: 'B', text: '[2, 4, 6, 8]', isCorrect: false },
          { label: 'C', text: '[2, 5, 8, 11]', isCorrect: false },
          { label: 'D', text: '[3, 6, 9]', isCorrect: false },
        ],
        correctAnswer: 'A',
      },
      // ── MC 3 ──
      {
        questionText: 'Kapan while loop berhenti dieksekusi?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Setelah dijalankan satu kali', isCorrect: false },
          { label: 'B', text: 'Ketika kondisinya menjadi False', isCorrect: true },
          { label: 'C', text: 'Ketika variabel counter habis', isCorrect: false },
          { label: 'D', text: 'Setelah 100 iterasi', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 4 ──
      {
        questionText: 'Apa fungsi dari perintah `break` dalam loop?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Melanjutkan ke iterasi berikutnya', isCorrect: false },
          { label: 'B', text: 'Menghentikan loop secara langsung', isCorrect: true },
          { label: 'C', text: 'Menghentikan seluruh program', isCorrect: false },
          { label: 'D', text: 'Mengulang iterasi saat ini', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 5 ──
      {
        questionText: 'Apa fungsi dari perintah `continue` dalam loop?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Menghentikan loop sepenuhnya', isCorrect: false },
          { label: 'B', text: 'Melewati sisa kode di iterasi saat ini dan lanjut ke iterasi berikutnya', isCorrect: true },
          { label: 'C', text: 'Mengulang iterasi saat ini dari awal', isCorrect: false },
          { label: 'D', text: 'Menambahkan elemen baru ke loop', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 6 ──
      {
        questionText:
          'Berapa kali kata "Halo" dicetak oleh kode berikut?\n`for i in range(2):\n    for j in range(3):\n        print("Halo")`',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '2', isCorrect: false },
          { label: 'B', text: '3', isCorrect: false },
          { label: 'C', text: '5', isCorrect: false },
          { label: 'D', text: '6', isCorrect: true },
        ],
        correctAnswer: 'D',
      },
      // ── MC 7 ──
      {
        questionText:
          'Apa output dari kode berikut?\n`x = 0\nwhile x < 5:\n    x += 2\nprint(x)`',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '4', isCorrect: false },
          { label: 'B', text: '5', isCorrect: false },
          { label: 'C', text: '6', isCorrect: true },
          { label: 'D', text: '2', isCorrect: false },
        ],
        correctAnswer: 'C',
      },
      // ── MC 8 ──
      {
        questionText:
          'Apa output dari kode berikut?\n`for i in range(5):\n    if i == 3:\n        break\n    print(i, end=" ")`',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '0 1 2 3', isCorrect: false },
          { label: 'B', text: '0 1 2', isCorrect: true },
          { label: 'C', text: '0 1 2 3 4', isCorrect: false },
          { label: 'D', text: '1 2 3', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 9 ──
      {
        questionText: 'Apa output dari: `print(list(enumerate(["a", "b", "c"])))`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '["a", "b", "c"]', isCorrect: false },
          { label: 'B', text: '[(0, "a"), (1, "b"), (2, "c")]', isCorrect: true },
          { label: 'C', text: '[0, 1, 2]', isCorrect: false },
          { label: 'D', text: '{0: "a", 1: "b", 2: "c"}', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 10 ──
      {
        questionText:
          'Apa output dari kode berikut?\n`for i in range(5):\n    if i % 2 == 0:\n        continue\n    print(i, end=" ")`',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '0 2 4', isCorrect: false },
          { label: 'B', text: '1 3', isCorrect: true },
          { label: 'C', text: '1 2 3 4', isCorrect: false },
          { label: 'D', text: '0 1 2 3 4', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan perbedaan antara for loop dan while loop di Python! Kapan sebaiknya menggunakan masing-masing?',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['for', 'iterasi', 'while', 'kondisi', 'jumlah diketahui'],
        correctAnswer:
          'For loop digunakan ketika jumlah iterasi sudah diketahui atau ketika ingin mengiterasi elemen-elemen dari suatu iterable. While loop digunakan ketika jumlah iterasi tidak pasti dan bergantung pada suatu kondisi. Gunakan for saat mengiterasi list atau range, gunakan while saat menunggu input pengguna atau kondisi tertentu.',
      },
      // ── Essay 2 ──
      {
        questionText: 'Apa yang dimaksud dengan infinite loop (perulangan tak terbatas)? Bagaimana cara menghindarinya saat menggunakan while loop?',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['tak terbatas', 'kondisi selalu True', 'mengubah variabel', 'break', 'berhenti'],
        correctAnswer:
          'Infinite loop adalah perulangan yang tidak pernah berhenti karena kondisinya selalu bernilai True. Untuk menghindarinya: (1) pastikan ada pernyataan yang mengubah variabel kondisi di dalam loop, (2) gunakan break untuk keluar dari loop saat kondisi tertentu terpenuhi, (3) periksa logika kondisi loop sebelum menjalankan program.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Jelaskan penggunaan `break` dan `continue` dalam loop Python beserta perbedaannya dan berikan contoh masing-masing!',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['break', 'menghentikan', 'continue', 'melewati', 'iterasi'],
        correctAnswer:
          'Break digunakan untuk menghentikan loop sepenuhnya, misalnya keluar dari loop saat menemukan elemen tertentu. Continue digunakan untuk melewati sisa kode pada iterasi saat ini dan langsung ke iterasi berikutnya, misalnya melewati angka genap. Contoh break: mencari elemen dalam list dan berhenti saat ditemukan. Contoh continue: mencetak hanya angka ganjil.',
      },
      // ── Essay 4 ──
      {
        questionText: 'Jelaskan apa itu nested loop (perulangan bersarang) dan berikan contoh penggunaannya untuk mencetak pola bintang!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['loop dalam loop', 'bersarang', 'baris', 'kolom', 'pola'],
        correctAnswer:
          'Nested loop adalah loop yang berada di dalam loop lainnya. Loop luar mengontrol baris, loop dalam mengontrol kolom. Contoh pola bintang segitiga:\nfor i in range(1, 4):\n    for j in range(i):\n        print("*", end="")\n    print()\nHasilnya: *, **, ***.',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan potongan kode loop berikut dengan outputnya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'for i in range(4): print(i)', right: '0, 1, 2, 3' },
          { left: 'for i in range(1, 4): print(i)', right: '1, 2, 3' },
          { left: 'for i in range(0, 6, 2): print(i)', right: '0, 2, 4' },
          { left: 'for i in range(3, 0, -1): print(i)', right: '3, 2, 1' },
        ],
        correctAnswer: '{"for i in range(4): print(i)":"0, 1, 2, 3","for i in range(1, 4): print(i)":"1, 2, 3","for i in range(0, 6, 2): print(i)":"0, 2, 4","for i in range(3, 0, -1): print(i)":"3, 2, 1"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan konsep perulangan berikut dengan definisinya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'for loop', right: 'Perulangan yang mengiterasi elemen dari iterable' },
          { left: 'while loop', right: 'Perulangan yang berjalan selama kondisi True' },
          { left: 'break', right: 'Menghentikan loop sepenuhnya' },
          { left: 'continue', right: 'Melewati iterasi saat ini ke iterasi berikutnya' },
          { left: 'range()', right: 'Menghasilkan urutan bilangan bulat' },
        ],
        correctAnswer: '{"for loop":"Perulangan yang mengiterasi elemen dari iterable","while loop":"Perulangan yang berjalan selama kondisi True","break":"Menghentikan loop sepenuhnya","continue":"Melewati iterasi saat ini ke iterasi berikutnya","range()":"Menghasilkan urutan bilangan bulat"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan fungsi bawaan berikut yang sering digunakan bersama loop dengan kegunaannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'range()', right: 'Menghasilkan deretan angka untuk iterasi' },
          { left: 'enumerate()', right: 'Menghasilkan indeks dan elemen secara bersamaan' },
          { left: 'zip()', right: 'Menggabungkan dua iterable menjadi pasangan' },
          { left: 'reversed()', right: 'Membalik urutan iterasi' },
        ],
        correctAnswer: '{"range()":"Menghasilkan deretan angka untuk iterasi","enumerate()":"Menghasilkan indeks dan elemen secara bersamaan","zip()":"Menggabungkan dua iterable menjadi pasangan","reversed()":"Membalik urutan iterasi"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan situasi berikut dengan jenis loop yang paling tepat digunakan!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'Mencetak semua elemen dalam list', right: 'for loop' },
          { left: 'Menunggu input pengguna sampai benar', right: 'while loop' },
          { left: 'Membuat tabel perkalian', right: 'nested loop' },
          { left: 'Mengambil 5 angka pertama dari list', right: 'for loop dengan break' },
        ],
        correctAnswer: '{"Mencetak semua elemen dalam list":"for loop","Menunggu input pengguna sampai benar":"while loop","Membuat tabel perkalian":"nested loop","Mengambil 5 angka pertama dari list":"for loop dengan break"}',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // CHAPTER 5 — OOP & Advanced
  // ──────────────────────────────────────────────
  {
    chapterNumber: 5,
    title: 'Ujian Bab 5: OOP & Topik Lanjutan',
    description:
      'Ujian ini menguji pemahaman Anda tentang Object-Oriented Programming, error handling, operasi file, serta modul dan package di Python.',
    timeLimit: 60,
    questions: [
      // ── MC 1 ──
      {
        questionText: 'Kata kunci yang digunakan untuk mendefinisikan class di Python adalah...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'def', isCorrect: false },
          { label: 'B', text: 'class', isCorrect: true },
          { label: 'C', text: 'struct', isCorrect: false },
          { label: 'D', text: 'object', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 2 ──
      {
        questionText: 'Apa fungsi dari metode `__init__` dalam sebuah class Python?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Menghapus objek dari memori', isCorrect: false },
          { label: 'B', text: 'Menginisialisasi atribut saat objek dibuat', isCorrect: true },
          { label: 'C', text: 'Menampilkan informasi objek', isCorrect: false },
          { label: 'D', text: 'Mewarisi class lain', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 3 ──
      {
        questionText: 'Apa yang dimaksud dengan parameter `self` pada metode class?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Referensi ke class induk', isCorrect: false },
          { label: 'B', text: 'Referensi ke objek saat ini (instance)', isCorrect: true },
          { label: 'C', text: 'Parameter wajib dari semua fungsi Python', isCorrect: false },
          { label: 'D', text: 'Variabel global', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 4 ──
      {
        questionText: 'Blok `try-except` di Python digunakan untuk...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Mengulang kode yang gagal', isCorrect: false },
          { label: 'B', text: 'Menangani error agar program tidak crash', isCorrect: true },
          { label: 'C', text: 'Menghapus bug dari kode', isCorrect: false },
          { label: 'D', text: 'Mempercepat eksekusi program', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 5 ──
      {
        questionText: 'Mode file `"r"` pada fungsi `open()` digunakan untuk...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Menulis file baru', isCorrect: false },
          { label: 'B', text: 'Membaca file yang sudah ada', isCorrect: true },
          { label: 'C', text: 'Menambahkan data ke file', isCorrect: false },
          { label: 'D', text: 'Menghapus file', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 6 ──
      {
        questionText: 'Apa output dari kode berikut?\n`class Hewan:\n    def __init__(self, nama):\n        self.nama = nama\nkucing = Hewan("Milo")\nprint(kucing.nama)`',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Hewan', isCorrect: false },
          { label: 'B', text: 'Milo', isCorrect: true },
          { label: 'C', text: 'kucing', isCorrect: false },
          { label: 'D', text: 'Error', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 7 ──
      {
        questionText: 'Pernyataan `import math` digunakan untuk...',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Membuat modul baru bernama math', isCorrect: false },
          { label: 'B', text: 'Mengimpor modul math agar fungsinya bisa digunakan', isCorrect: true },
          { label: 'C', text: 'Menghapus modul math dari memori', isCorrect: false },
          { label: 'D', text: 'Menginstal library math', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 8 ──
      {
        questionText: 'Apa perbedaan antara mode file `"w"` dan `"a"`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: '"w" membaca file, "a" menulis file', isCorrect: false },
          { label: 'B', text: '"w" menimpa isi file, "a" menambahkan di akhir file', isCorrect: true },
          { label: 'C', text: 'Keduanya sama saja', isCorrect: false },
          { label: 'D', text: '"w" untuk teks, "a" untuk binary', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 9 ──
      {
        questionText: 'Apa yang terjadi saat `except ValueError` menangkap error?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Semua jenis error akan ditangkap', isCorrect: false },
          { label: 'B', text: 'Hanya error bertipe ValueError yang ditangkap', isCorrect: true },
          { label: 'C', text: 'Program langsung berhenti', isCorrect: false },
          { label: 'D', text: 'Error dihapus dari memori', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── MC 10 ──
      {
        questionText: 'Apa keuntungan menggunakan `with open(...) as f:` dibandingkan `f = open(...)`?',
        questionType: 'MULTIPLE_CHOICE',
        points: 5,
        options: [
          { label: 'A', text: 'Lebih cepat dalam membaca file', isCorrect: false },
          { label: 'B', text: 'File otomatis ditutup setelah blok with selesai', isCorrect: true },
          { label: 'C', text: 'Bisa membaca banyak file sekaligus', isCorrect: false },
          { label: 'D', text: 'Tidak ada perbedaan', isCorrect: false },
        ],
        correctAnswer: 'B',
      },
      // ── Essay 1 ──
      {
        questionText: 'Jelaskan apa itu class dan object dalam OOP Python! Apa hubungan antara keduanya?',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['class', 'cetak biru', 'object', 'instance', 'atribut', 'metode'],
        correctAnswer:
          'Class adalah cetak biru (blueprint) atau template yang mendefinisikan atribut dan metode untuk suatu jenis objek. Object adalah instance (wujud nyata) dari sebuah class. Hubungannya: class mendefinisikan struktur, dan object adalah realisasi dari struktur tersebut. Satu class bisa menghasilkan banyak object.',
      },
      // ── Essay 2 ──
      {
        questionText: 'Jelaskan tujuan dan cara kerja blok `try-except-finally` di Python! Berikan contoh penggunaannya!',
        questionType: 'ESSAY',
        points: 20,
        keywords: ['try', 'except', 'finally', 'error', 'menangani', 'selalu dijalankan'],
        correctAnswer:
          'Blok try berisi kode yang mungkin menghasilkan error. Blok except menangani error yang terjadi agar program tidak crash. Blok finally selalu dijalankan baik ada error maupun tidak, biasanya untuk membersihkan resource. Contoh: try membuka file, except menangani FileNotFoundError, finally menutup file.',
      },
      // ── Essay 3 ──
      {
        questionText: 'Mengapa penggunaan modul dan package penting dalam pemrograman Python? Berikan contoh modul bawaan Python dan kegunaannya!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['modul', 'organisasi', 'reusable', 'package', 'import'],
        correctAnswer:
          'Modul dan package penting untuk mengorganisir kode agar rapi, mudah dikelola, dan bisa digunakan ulang (reusable). Contoh modul bawaan: math (fungsi matematika seperti sqrt, pi), os (operasi sistem file), random (menghasilkan angka acak), datetime (mengelola tanggal dan waktu).',
      },
      // ── Essay 4 ──
      {
        questionText: 'Jelaskan konsep inheritance (pewarisan) dalam OOP Python dan berikan contoh sederhana!',
        questionType: 'ESSAY',
        points: 15,
        keywords: ['pewarisan', 'class induk', 'class anak', 'mewarisi', 'atribut', 'metode'],
        correctAnswer:
          'Inheritance adalah mekanisme di mana sebuah class anak (child class) mewarisi atribut dan metode dari class induk (parent class). Contoh: class Hewan memiliki metode bergerak(), class Kucing mewarisi Hewan dan menambahkan metode mengeong(). Ini memungkinkan penggunaan ulang kode dan membuat hierarki class.',
      },
      // ── Matching 1 ──
      {
        questionText: 'Jodohkan konsep OOP berikut dengan penjelasannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'Class', right: 'Cetak biru untuk membuat objek' },
          { left: 'Object', right: 'Instance dari sebuah class' },
          { left: '__init__', right: 'Metode konstruktor untuk inisialisasi atribut' },
          { left: 'self', right: 'Referensi ke instance objek saat ini' },
          { left: 'Inheritance', right: 'Pewarisan atribut dan metode dari class lain' },
        ],
        correctAnswer: '{"Class":"Cetak biru untuk membuat objek","Object":"Instance dari sebuah class","__init__":"Metode konstruktor untuk inisialisasi atribut","self":"Referensi ke instance objek saat ini","Inheritance":"Pewarisan atribut dan metode dari class lain"}',
      },
      // ── Matching 2 ──
      {
        questionText: 'Jodohkan mode file berikut dengan kegunaannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: '"r"', right: 'Membaca file (file harus sudah ada)' },
          { left: '"w"', right: 'Menulis file (menimpa jika sudah ada)' },
          { left: '"a"', right: 'Menambahkan data di akhir file' },
          { left: '"rb"', right: 'Membaca file dalam mode binary' },
        ],
        correctAnswer: '{"\\"r\\"":"Membaca file (file harus sudah ada)","\\"w\\"":"Menulis file (menimpa jika sudah ada)","\\"a\\"":"Menambahkan data di akhir file","\\"rb\\"":"Membaca file dalam mode binary"}',
      },
      // ── Matching 3 ──
      {
        questionText: 'Jodohkan jenis error Python berikut dengan penyebabnya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'ValueError', right: 'Nilai yang diberikan tidak sesuai tipe yang diharapkan' },
          { left: 'TypeError', right: 'Operasi dilakukan pada tipe data yang salah' },
          { left: 'IndexError', right: 'Indeks melebihi panjang list' },
          { left: 'KeyError', right: 'Key tidak ditemukan dalam dictionary' },
          { left: 'FileNotFoundError', right: 'File yang dicari tidak ditemukan' },
        ],
        correctAnswer: '{"ValueError":"Nilai yang diberikan tidak sesuai tipe yang diharapkan","TypeError":"Operasi dilakukan pada tipe data yang salah","IndexError":"Indeks melebihi panjang list","KeyError":"Key tidak ditemukan dalam dictionary","FileNotFoundError":"File yang dicari tidak ditemukan"}',
      },
      // ── Matching 4 ──
      {
        questionText: 'Jodohkan modul bawaan Python berikut dengan kegunaannya!',
        questionType: 'MATCHING',
        points: 15,
        matchingPairs: [
          { left: 'math', right: 'Fungsi matematika seperti sqrt dan pi' },
          { left: 'random', right: 'Menghasilkan angka acak' },
          { left: 'os', right: 'Interaksi dengan sistem operasi dan file' },
          { left: 'datetime', right: 'Mengelola tanggal dan waktu' },
        ],
        correctAnswer: '{"math":"Fungsi matematika seperti sqrt dan pi","random":"Menghasilkan angka acak","os":"Interaksi dengan sistem operasi dan file","datetime":"Mengelola tanggal dan waktu"}',
      },
    ],
  },
];
