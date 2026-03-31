export interface TeachingTip {
  objectives: string[];
  keyPoints: string[];
  commonMistakes: string[];
  discussionQuestions: string[];
  teachingNotes: string;
}

export const teachingTips: Record<number, Record<string, TeachingTip>> = {
  // Chapter 0: Dasar-Dasar Pemrograman
  0: {
    '1': {
      objectives: [
        'Memahami konsep dasar pemrograman sebagai instruksi untuk komputer.',
        'Mengenal alur eksekusi program dari atas ke bawah.',
        'Mengetahui peran bahasa pemrograman sebagai penghubung manusia dan mesin.',
        'Mampu menjelaskan perbedaan antara bahasa manusia dan bahasa pemrograman.',
      ],
      keyPoints: [
        'Program adalah kumpulan instruksi yang dijalankan secara berurutan.',
        'Python adalah bahasa yang mudah dibaca dan cocok untuk pemula.',
        'Setiap baris kode memiliki tujuan spesifik yang harus dipahami.',
        'Indentasi di Python bukan sekadar gaya penulisan, melainkan bagian dari sintaks.',
      ],
      commonMistakes: [
        'Siswa sering mengabaikan urutan eksekusi dan mengira kode berjalan acak.',
        'Menganggap komputer bisa memahami instruksi ambigu seperti manusia.',
        'Tidak memahami bahwa spasi dan indentasi berpengaruh pada jalannya program.',
      ],
      discussionQuestions: [
        'Apa contoh instruksi sehari-hari yang mirip dengan program komputer?',
        'Mengapa komputer membutuhkan instruksi yang sangat spesifik?',
        'Apa yang terjadi jika urutan instruksi ditukar?',
      ],
      teachingNotes:
        'Gunakan analogi resep masakan atau petunjuk arah untuk menjelaskan konsep instruksi berurutan. Biarkan siswa mencoba menulis pseudo-code sebelum kode Python sesungguhnya.',
    },
    '2': {
      objectives: [
        'Memahami konsep variabel sebagai tempat penyimpanan data.',
        'Mampu mendeklarasikan dan mengisi nilai variabel di Python.',
        'Mengenal aturan penamaan variabel yang benar.',
        'Memahami bagaimana variabel disimpan di memori komputer.',
      ],
      keyPoints: [
        'Variabel adalah label yang merujuk ke sebuah nilai di memori.',
        'Python menggunakan dynamic typing sehingga tipe data tidak perlu dideklarasikan secara eksplisit.',
        'Nama variabel harus deskriptif dan mengikuti konvensi snake_case.',
        'Operator assignment (=) berarti menyimpan, bukan sama dengan secara matematis.',
        'Variabel bisa diubah nilainya kapan saja selama program berjalan.',
      ],
      commonMistakes: [
        'Menggunakan nama variabel yang dimulai dengan angka atau mengandung spasi.',
        'Membingungkan operator = (assignment) dengan == (perbandingan).',
        'Tidak menyadari bahwa Python bersifat case-sensitive (Nama ≠ nama).',
      ],
      discussionQuestions: [
        'Mengapa penting memberi nama variabel yang mudah dipahami?',
        'Apa bedanya menyimpan angka 5 dan teks "5" di variabel?',
      ],
      teachingNotes:
        'Analogikan variabel sebagai kotak berlabel di gudang. Tekankan bahwa isi kotak bisa berubah, tetapi labelnya tetap sama.',
    },
    '3': {
      objectives: [
        'Mengenal tipe data dasar di Python: int, float, str, dan bool.',
        'Mampu mengidentifikasi tipe data dari sebuah nilai.',
        'Memahami fungsi type() untuk mengecek tipe data.',
        'Mengerti kapan harus menggunakan tipe data tertentu.',
      ],
      keyPoints: [
        'Python memiliki empat tipe data dasar: integer, float, string, dan boolean.',
        'Fungsi type() berguna untuk mengecek tipe data sebuah variabel.',
        'String harus diapit tanda kutip, sedangkan angka tidak.',
        'Boolean hanya memiliki dua nilai: True dan False (huruf kapital di awal).',
        'Konversi tipe data bisa dilakukan dengan int(), float(), str(), dan bool().',
      ],
      commonMistakes: [
        'Mencampur tipe data tanpa konversi, misalnya "umur: " + 17 tanpa str().',
        'Menulis True/False dengan huruf kecil sehingga Python tidak mengenalinya.',
        'Mengira bahwa "123" (string) dan 123 (integer) adalah hal yang sama.',
      ],
      discussionQuestions: [
        'Mengapa Python membedakan antara angka bulat dan angka desimal?',
        'Dalam situasi apa kita perlu mengkonversi tipe data?',
        'Apa yang terjadi jika kita mencoba int("hello")?',
      ],
      teachingNotes:
        'Gunakan contoh nyata seperti umur (int), harga (float), nama (str), dan status kelulusan (bool). Minta siswa menebak tipe data dari berbagai nilai.',
    },
    '4': {
      objectives: [
        'Memahami operasi aritmatika dasar di Python.',
        'Mengenal operator perbandingan dan logika.',
        'Mampu menggunakan operator assignment gabungan (+=, -=, dll).',
        'Memahami urutan prioritas operator.',
        'Menguasai operator modulo (%) dan floor division (//) beserta kegunaannya.',
      ],
      keyPoints: [
        'Python mendukung operasi +, -, *, /, //, %, dan ** untuk aritmatika.',
        'Operator // (floor division) menghasilkan pembagian bulat ke bawah, sedangkan / selalu menghasilkan float.',
        'Operator % (modulo) menghasilkan sisa pembagian, berguna untuk cek genap/ganjil dan pola berulang.',
        'Operator ** digunakan untuk perpangkatan, bukan ^ seperti di kalkulator.',
        'Operator perbandingan (==, !=, <, >, <=, >=) menghasilkan nilai boolean.',
        'Operator logika (and, or, not) digunakan untuk menggabungkan kondisi.',
        'Kombinasi // dan % sering dipakai bersama, misalnya konversi detik ke menit:detik.',
      ],
      commonMistakes: [
        'Menggunakan ^ untuk perpangkatan padahal di Python ^ adalah operator XOR.',
        'Tidak memahami perbedaan antara / (float division) dan // (floor division).',
        'Lupa urutan prioritas operator sehingga hasil perhitungan salah.',
        'Bingung antara hasil negatif pada modulo: Python selalu mengikuti tanda pembagi.',
        'Mengira // sama dengan int(), padahal // membulatkan ke bawah (misal -7//2 = -4, bukan -3).',
      ],
      discussionQuestions: [
        'Kapan kita perlu menggunakan pembagian bulat (//) dibanding pembagian biasa (/)?',
        'Bagaimana urutan prioritas operator mempengaruhi hasil 2 + 3 * 4?',
        'Bagaimana cara mengecek apakah sebuah angka genap atau ganjil menggunakan operator %?',
        'Apa contoh penggunaan // dan % secara bersamaan di kehidupan nyata?',
      ],
      teachingNotes:
        'Ajak siswa menghitung secara manual terlebih dahulu, lalu bandingkan dengan hasil Python. Tekankan kegunaan modulo (%) untuk cek genap/ganjil (n % 2 == 0) dan floor division (//) untuk pembagian tanpa desimal. Berikan contoh konversi satuan seperti detik ke menit:detik menggunakan kombinasi // dan %.',
    },
  },

  // Chapter 1: Python Lists
  1: {
    introduction: {
      objectives: [
        'Memahami konsep list sebagai kumpulan data terurut.',
        'Mengetahui kegunaan list dalam menyimpan banyak nilai.',
        'Mengenal sintaks dasar list di Python.',
      ],
      keyPoints: [
        'List adalah struktur data yang menyimpan kumpulan elemen secara berurutan.',
        'List bisa berisi berbagai tipe data sekaligus (heterogen).',
        'List bersifat mutable, artinya isinya bisa diubah setelah dibuat.',
        'List menggunakan tanda kurung siku [] untuk mendefinisikan elemennya.',
      ],
      commonMistakes: [
        'Mengira list hanya bisa berisi satu tipe data saja.',
        'Tidak memahami bahwa list mempertahankan urutan elemen.',
      ],
      discussionQuestions: [
        'Kapan sebaiknya kita menggunakan list dibanding variabel biasa?',
        'Apa contoh data di kehidupan nyata yang cocok disimpan dalam list?',
      ],
      teachingNotes:
        'Mulailah dengan contoh sederhana seperti daftar belanjaan atau daftar nama siswa. Tunjukkan bahwa list mempermudah pengelolaan banyak data.',
    },
    creation: {
      objectives: [
        'Mampu membuat list kosong dan list berisi data.',
        'Mengenal berbagai cara membuat list di Python.',
        'Memahami fungsi list() untuk konversi ke list.',
      ],
      keyPoints: [
        'List kosong dibuat dengan [] atau list().',
        'Elemen list dipisahkan dengan koma.',
        'Fungsi list() bisa mengkonversi string atau range menjadi list.',
        'List bisa dibuat dari range() untuk deret angka.',
      ],
      commonMistakes: [
        'Lupa menambahkan koma antar elemen sehingga terjadi error.',
        'Membingungkan list() sebagai constructor dengan [] sebagai literal.',
        'Menulis [1 2 3] tanpa koma pemisah.',
      ],
      discussionQuestions: [
        'Apa perbedaan antara membuat list dengan [] dan list()?',
        'Bagaimana cara membuat list berisi angka 1 sampai 100 secara efisien?',
      ],
      teachingNotes:
        'Demonstrasikan pembuatan list secara bertahap: mulai dari list kosong, lalu tambahkan elemen satu per satu agar siswa memahami prosesnya.',
    },
    operations: {
      objectives: [
        'Mampu menggabungkan dua list dengan operator +.',
        'Memahami operasi pengulangan list dengan operator *.',
        'Mengenal operator in untuk mengecek keanggotaan elemen.',
        'Mampu menggunakan fungsi len() untuk menghitung panjang list.',
      ],
      keyPoints: [
        'Operator + menggabungkan dua list menjadi satu list baru.',
        'Operator * mengulang isi list sejumlah yang ditentukan.',
        'Operator in mengembalikan True jika elemen ada di dalam list.',
        'Fungsi len() menghitung jumlah elemen dalam list.',
        'Operasi + dan * tidak mengubah list asli, melainkan membuat list baru.',
      ],
      commonMistakes: [
        'Mengira operator + bisa menambahkan satu elemen ke list (seharusnya pakai append).',
        'Tidak memahami bahwa [0] * 5 membuat list [0, 0, 0, 0, 0] bukan [5].',
      ],
      discussionQuestions: [
        'Apa perbedaan antara list1 + list2 dan list1.append(list2)?',
        'Mengapa operator in penting dalam pemrograman sehari-hari?',
      ],
      teachingNotes:
        'Tunjukkan hasil setiap operasi secara langsung di interpreter. Pastikan siswa memahami bahwa + dan * membuat list baru, bukan mengubah yang asli.',
    },
    indexing: {
      objectives: [
        'Memahami konsep indexing berbasis nol di Python.',
        'Mampu mengakses elemen list dengan indeks positif dan negatif.',
        'Menguasai teknik slicing untuk mengambil sebagian list.',
        'Memahami sintaks [start:stop:step] pada slicing.',
      ],
      keyPoints: [
        'Indeks di Python dimulai dari 0, bukan 1.',
        'Indeks negatif menghitung dari belakang: -1 adalah elemen terakhir.',
        'Slicing menggunakan sintaks list[start:stop] dan tidak menyertakan elemen di indeks stop.',
        'Parameter step pada slicing menentukan jarak antar elemen yang diambil.',
        'Slicing menghasilkan list baru tanpa mengubah list asli.',
      ],
      commonMistakes: [
        'Mengakses indeks yang melebihi panjang list sehingga terjadi IndexError.',
        'Lupa bahwa slicing tidak menyertakan elemen pada indeks stop.',
        'Bingung antara indeks negatif dan pengurangan elemen.',
      ],
      discussionQuestions: [
        'Mengapa indeks di Python dimulai dari 0, bukan 1?',
        'Bagaimana cara membalik urutan list hanya dengan slicing?',
        'Apa yang terjadi jika kita melakukan slicing di luar batas list?',
      ],
      teachingNotes:
        'Gunakan visualisasi tabel dengan nomor indeks di atas setiap elemen. Tekankan perbedaan perilaku indexing (bisa error) dan slicing (tidak error saat di luar batas).',
    },
    methods: {
      objectives: [
        'Menguasai method append(), insert(), remove(), dan pop().',
        'Memahami perbedaan antara method yang mengubah list dan yang mengembalikan nilai.',
        'Mampu menggunakan sort() dan reverse() untuk mengurutkan list.',
        'Mengenal method count() dan index() untuk pencarian.',
      ],
      keyPoints: [
        'append() menambahkan elemen di akhir list.',
        'insert(i, x) menyisipkan elemen x di posisi indeks i.',
        'remove() menghapus elemen pertama yang cocok, pop() menghapus berdasarkan indeks.',
        'sort() mengurutkan list secara langsung (in-place), sorted() membuat list baru.',
        'Kebanyakan method list mengubah list asli dan mengembalikan None.',
      ],
      commonMistakes: [
        'Menyimpan hasil append() ke variabel dan mendapat None.',
        'Menggunakan remove() dengan indeks padahal seharusnya menggunakan pop().',
        'Mencoba sort() pada list yang berisi campuran tipe data.',
      ],
      discussionQuestions: [
        'Kapan kita sebaiknya menggunakan append() vs insert()?',
        'Apa bedanya sort() dan sorted() dari segi penggunaan?',
      ],
      teachingNotes:
        'Tekankan bahwa sebagian besar method list bersifat in-place dan mengembalikan None. Ini adalah sumber bug yang sangat umum bagi pemula.',
    },
  },

  // Chapter 2: Teknik Lanjutan Lists
  2: {
    comprehension: {
      objectives: [
        'Memahami sintaks list comprehension di Python.',
        'Mampu mengkonversi loop biasa menjadi list comprehension.',
        'Menguasai penggunaan kondisi (if) dalam list comprehension.',
      ],
      keyPoints: [
        'List comprehension adalah cara singkat untuk membuat list dari iterable.',
        'Sintaks dasar: [ekspresi for item in iterable].',
        'Kondisi if bisa ditambahkan untuk memfilter elemen.',
        'List comprehension lebih ringkas dan umumnya lebih cepat dari loop biasa.',
        'Jangan terlalu kompleks agar kode tetap mudah dibaca.',
      ],
      commonMistakes: [
        'Membuat list comprehension yang terlalu panjang sehingga sulit dibaca.',
        'Bingung menempatkan if di akhir (filter) vs if-else di awal (transformasi).',
      ],
      discussionQuestions: [
        'Kapan sebaiknya menggunakan list comprehension vs loop biasa?',
        'Mengapa readability penting meskipun comprehension lebih singkat?',
        'Bagaimana cara menambahkan kondisi if-else dalam comprehension?',
      ],
      teachingNotes:
        'Mulai dengan loop biasa, lalu tunjukkan transformasi bertahap ke list comprehension. Ini membantu siswa memahami hubungan keduanya.',
    },
    'nested-lists': {
      objectives: [
        'Memahami konsep list di dalam list (nested list).',
        'Mampu mengakses elemen nested list dengan indeks bertingkat.',
        'Mengenal aplikasi nested list seperti matriks dan tabel.',
      ],
      keyPoints: [
        'Nested list adalah list yang berisi list lain sebagai elemennya.',
        'Akses elemen nested menggunakan indeks bertingkat: list[i][j].',
        'Nested list sering digunakan untuk merepresentasikan data 2D seperti matriks.',
        'Iterasi nested list membutuhkan loop bersarang.',
      ],
      commonMistakes: [
        'Salah menghitung level indeks saat mengakses elemen bersarang.',
        'Tidak memahami bahwa mengubah satu baris bisa mempengaruhi baris lain jika dibuat dengan * (shallow copy).',
        'Bingung membedakan list 1D yang panjang dengan list 2D.',
      ],
      discussionQuestions: [
        'Apa contoh data dunia nyata yang cocok direpresentasikan sebagai nested list?',
        'Bagaimana cara menambahkan baris baru ke nested list?',
      ],
      teachingNotes:
        'Gambar tabel atau grid di papan tulis untuk memvisualisasikan nested list. Hubungkan konsep ini dengan matriks di matematika.',
    },
    'list-methods': {
      objectives: [
        'Menguasai method lanjutan seperti extend(), copy(), dan clear().',
        'Memahami perbedaan antara shallow copy dan deep copy.',
        'Mampu menggunakan sorted() dengan parameter key dan reverse.',
        'Mengenal fungsi bawaan yang bekerja dengan list: map(), filter(), zip().',
      ],
      keyPoints: [
        'extend() menambahkan semua elemen dari iterable ke list.',
        'copy() membuat shallow copy, gunakan deepcopy() untuk nested list.',
        'sorted() menerima parameter key untuk pengurutan kustom.',
        'zip() menggabungkan beberapa list menjadi pasangan-pasangan tuple.',
        'map() dan filter() mengembalikan iterator, bukan list langsung.',
      ],
      commonMistakes: [
        'Menggunakan = untuk menyalin list, yang hanya membuat referensi baru ke list yang sama.',
        'Tidak menyadari bahwa shallow copy tidak menduplikasi elemen nested.',
      ],
      discussionQuestions: [
        'Mengapa penting memahami perbedaan shallow copy dan deep copy?',
        'Kapan menggunakan extend() vs append() vs operator +?',
        'Apa keuntungan menggunakan sorted() dengan parameter key?',
      ],
      teachingNotes:
        'Demonstrasikan perbedaan copy vs assignment dengan mengubah satu variabel dan melihat efeknya. Ini adalah konsep krusial yang sering membingungkan pemula.',
    },
    'list-tricks': {
      objectives: [
        'Mampu melakukan sorting dan filtering pada list menggunakan sorted() dan filter().',
        'Menguasai teknik list unpacking untuk assign beberapa variabel sekaligus.',
        'Memahami penggunaan zip() dan enumerate() untuk iterasi paralel dan berindeks.',
        'Mampu menggunakan list sebagai tabel data sederhana (list of lists).',
      ],
      keyPoints: [
        'sorted() mengurutkan list tanpa mengubah aslinya, sort() mengubah list secara langsung.',
        'Filter bisa dilakukan dengan list comprehension atau fungsi filter().',
        'Unpacking: a, b, c = [1, 2, 3] untuk assign beberapa variabel sekaligus.',
        'zip() menggabungkan beberapa list menjadi pasangan-pasangan tuple untuk iterasi paralel.',
        'enumerate() memberikan indeks dan nilai saat iterasi, lebih pythonic dari range(len()).',
        'List of lists bisa digunakan sebagai tabel data sederhana untuk menyimpan data terstruktur.',
      ],
      commonMistakes: [
        'Bingung antara sort() yang mengubah list asli dan sorted() yang mengembalikan list baru.',
        'Jumlah variabel unpacking tidak sesuai dengan jumlah elemen list.',
        'Lupa bahwa zip() berhenti pada list terpendek jika panjang list berbeda.',
        'Mengakses kolom tabel data (list of lists) tanpa memahami indeks baris dan kolom.',
      ],
      discussionQuestions: [
        'Kapan menggunakan sorted() vs sort() untuk mengurutkan data?',
        'Bagaimana cara menggabungkan dua list nama dan nilai menggunakan zip()?',
        'Dalam situasi apa enumerate() lebih berguna dari range(len())?',
        'Apa keuntungan menyimpan data dalam list of lists dibanding variabel terpisah?',
      ],
      teachingNotes:
        'Mulai dengan contoh sorting dan filtering data nyata seperti daftar nilai siswa. Tunjukkan list unpacking sebagai cara pythonic menulis kode. Gunakan zip() untuk menggabungkan data terkait dan enumerate() untuk iterasi berindeks. Akhiri dengan contoh list sebagai tabel data sederhana untuk menyimpan data seperti spreadsheet.',
    },
  },

  // Chapter 3: Dictionary & Objects
  3: {
    lesson1: {
      objectives: [
        'Memahami konsep dictionary sebagai pasangan key-value.',
        'Mampu membuat dan mengakses elemen dictionary.',
        'Mengetahui tipe data apa saja yang bisa menjadi key.',
        'Memahami perbedaan dictionary dan list.',
      ],
      keyPoints: [
        'Dictionary menyimpan data sebagai pasangan key-value.',
        'Key harus bersifat immutable (string, int, tuple) dan unik.',
        'Akses elemen menggunakan key, bukan indeks numerik.',
        'Dictionary bersifat mutable, isinya bisa ditambah, diubah, atau dihapus.',
        'Sejak Python 3.7, dictionary mempertahankan urutan penyisipan.',
      ],
      commonMistakes: [
        'Menggunakan list sebagai key dictionary yang menyebabkan TypeError.',
        'Mengakses key yang tidak ada tanpa penanganan error.',
        'Mengira dictionary diakses dengan indeks numerik seperti list.',
      ],
      discussionQuestions: [
        'Kapan sebaiknya menggunakan dictionary dibanding list?',
        'Mengapa key dictionary harus immutable?',
      ],
      teachingNotes:
        'Analogikan dictionary dengan kamus sungguhan: kata (key) dipasangkan dengan definisi (value). Ini membantu siswa memahami konsep pasangan key-value.',
    },
    lesson2: {
      objectives: [
        'Menguasai method dasar dictionary: get(), keys(), values(), items().',
        'Mampu menambah, mengubah, dan menghapus elemen dictionary.',
        'Memahami penggunaan get() dengan nilai default.',
      ],
      keyPoints: [
        'get(key, default) mengembalikan default jika key tidak ditemukan, menghindari error.',
        'keys() mengembalikan semua key, values() semua value, items() semua pasangan.',
        'update() menggabungkan dictionary lain ke dictionary yang ada.',
        'del dan pop() digunakan untuk menghapus elemen dari dictionary.',
        'setdefault() menambahkan key dengan nilai default jika belum ada.',
      ],
      commonMistakes: [
        'Menggunakan dict[key] tanpa pengecekan sehingga terjadi KeyError.',
        'Tidak menyadari bahwa update() menimpa value untuk key yang sudah ada.',
      ],
      discussionQuestions: [
        'Apa keuntungan menggunakan get() dibanding akses langsung dengan []?',
        'Bagaimana cara menggabungkan dua dictionary?',
        'Kapan setdefault() lebih tepat digunakan dibanding if-else?',
      ],
      teachingNotes:
        'Tekankan penggunaan get() sebagai best practice untuk menghindari KeyError. Demonstrasikan langsung apa yang terjadi saat mengakses key yang tidak ada.',
    },
    lesson3: {
      objectives: [
        'Memahami konsep nested dictionary untuk data kompleks.',
        'Mampu mengakses dan memodifikasi data nested dictionary.',
        'Mengenal pola umum nested dictionary dalam aplikasi nyata.',
      ],
      keyPoints: [
        'Nested dictionary adalah dictionary yang berisi dictionary lain sebagai value.',
        'Akses data nested menggunakan key bertingkat: data[key1][key2].',
        'Nested dictionary cocok untuk data hierarkis seperti profil pengguna.',
        'Gunakan loop bersarang untuk iterasi seluruh nested dictionary.',
      ],
      commonMistakes: [
        'Lupa mengecek keberadaan key di setiap level sehingga terjadi KeyError.',
        'Membuat struktur nested terlalu dalam sehingga sulit dipelihara.',
        'Tidak menggunakan get() di level nested yang berisiko kosong.',
      ],
      discussionQuestions: [
        'Apa contoh data yang tepat direpresentasikan sebagai nested dictionary?',
        'Kapan sebaiknya menggunakan class/object dibanding nested dictionary?',
      ],
      teachingNotes:
        'Gunakan contoh data siswa yang berisi nama, nilai per mata pelajaran, dan alamat. Ini memberikan konteks nyata untuk nested dictionary.',
    },
    lesson4: {
      objectives: [
        'Memahami hubungan antara dictionary dan konsep object.',
        'Mampu menggunakan dictionary untuk memodelkan objek dunia nyata.',
        'Mengenal dictionary comprehension.',
        'Memahami kapan memilih dictionary vs class.',
      ],
      keyPoints: [
        'Dictionary bisa digunakan sebagai pengganti sederhana dari object/class.',
        'Dictionary comprehension mengikuti pola {key: value for item in iterable}.',
        'JSON, format data populer di web, strukturnya mirip dictionary Python.',
        'Untuk data kompleks dengan perilaku (method), gunakan class.',
      ],
      commonMistakes: [
        'Terlalu mengandalkan dictionary untuk data yang seharusnya menggunakan class.',
        'Lupa bahwa dictionary comprehension menggunakan kurung kurawal {}.',
      ],
      discussionQuestions: [
        'Apa kelebihan dan kekurangan dictionary dibanding class?',
        'Bagaimana hubungan antara dictionary Python dan format JSON?',
        'Kapan saatnya beralih dari dictionary ke class?',
      ],
      teachingNotes:
        'Tunjukkan contoh data yang sama direpresentasikan sebagai dictionary dan class. Diskusikan trade-off antara keduanya dalam konteks proyek nyata.',
    },
  },

  // Chapter 4: Loops & Iterasi
  4: {
    lesson1: {
      objectives: [
        'Memahami konsep iterasi dan pengulangan dalam pemrograman.',
        'Menguasai sintaks for loop di Python.',
        'Mampu menggunakan range() untuk mengontrol pengulangan.',
        'Mengenal iterasi pada berbagai tipe data (list, string, dictionary).',
      ],
      keyPoints: [
        'For loop mengiterasi setiap elemen dalam sebuah iterable.',
        'range(start, stop, step) menghasilkan deret angka untuk pengulangan.',
        'For loop cocok digunakan ketika jumlah pengulangan sudah diketahui.',
        'String, list, tuple, dictionary, dan set semuanya bisa diiterasi.',
        'Variabel loop menyimpan elemen saat ini pada setiap iterasi.',
      ],
      commonMistakes: [
        'Mengubah list saat sedang diiterasi sehingga menyebabkan perilaku tak terduga.',
        'Lupa bahwa range() tidak menyertakan nilai stop.',
        'Tidak memanfaatkan unpacking saat iterasi dictionary items().',
      ],
      discussionQuestions: [
        'Mengapa for loop lebih cocok untuk iterasi dibanding while loop?',
        'Apa yang terjadi jika kita mengubah list saat sedang di-loop?',
      ],
      teachingNotes:
        'Mulailah dengan contoh iterasi sederhana pada list, lalu perkenalkan range(). Gunakan print() untuk menunjukkan nilai variabel loop pada setiap iterasi.',
    },
    lesson2: {
      objectives: [
        'Memahami konsep dan sintaks while loop.',
        'Mengetahui kapan menggunakan while loop vs for loop.',
        'Mampu menghindari dan mendeteksi infinite loop.',
        'Menguasai penggunaan break dan continue.',
      ],
      keyPoints: [
        'While loop berjalan selama kondisi bernilai True.',
        'Pastikan ada mekanisme untuk menghentikan loop (kondisi berubah menjadi False).',
        'break menghentikan loop sepenuhnya, continue melompat ke iterasi berikutnya.',
        'While loop cocok saat jumlah pengulangan belum diketahui.',
        'Infinite loop terjadi jika kondisi tidak pernah menjadi False.',
      ],
      commonMistakes: [
        'Lupa mengubah variabel kondisi sehingga loop berjalan tanpa henti.',
        'Menggunakan while loop untuk situasi yang lebih cocok dengan for loop.',
        'Menempatkan break di posisi yang salah sehingga loop berhenti terlalu dini.',
      ],
      discussionQuestions: [
        'Apa contoh situasi nyata yang membutuhkan while loop?',
        'Bagaimana cara mendeteksi bahwa program terjebak dalam infinite loop?',
      ],
      teachingNotes:
        'Demonstrasikan infinite loop secara terkontrol agar siswa memahami bahayanya. Tekankan pentingnya selalu memiliki kondisi berhenti yang jelas.',
    },
    lesson3: {
      objectives: [
        'Memahami konsep dan kegunaan nested loops.',
        'Mampu melakukan iterasi pada data multidimensi.',
        'Mengenal pola umum nested loop seperti matriks dan tabel.',
        'Memahami kompleksitas waktu dari nested loops.',
      ],
      keyPoints: [
        'Nested loop adalah loop di dalam loop, loop dalam berjalan penuh untuk setiap iterasi loop luar.',
        'Total iterasi nested loop adalah perkalian iterasi setiap loop.',
        'Nested loop sering digunakan untuk memproses data 2D atau membuat pola.',
        'Gunakan break dengan hati-hati di nested loop karena hanya menghentikan loop terdalam.',
      ],
      commonMistakes: [
        'Tidak menyadari bahwa nested loop bisa sangat lambat untuk data besar.',
        'Menggunakan nama variabel yang sama untuk loop luar dan dalam.',
        'Salah memahami bahwa break di loop dalam tidak menghentikan loop luar.',
      ],
      discussionQuestions: [
        'Berapa kali loop dalam berjalan jika loop luar beriterasi 5 kali dan loop dalam 3 kali?',
        'Bagaimana cara menghentikan semua level nested loop sekaligus?',
      ],
      teachingNotes:
        'Gunakan contoh mencetak pola bintang atau mengisi matriks. Visualisasikan alur eksekusi dengan menunjukkan nilai variabel loop secara bertahap.',
    },
    lesson4: {
      objectives: [
        'Menguasai list, dict, dan set comprehension.',
        'Mampu menggunakan comprehension dengan kondisi dan nested loop.',
        'Memahami kapan comprehension lebih baik dari loop biasa.',
        'Mengenal generator expression sebagai alternatif hemat memori.',
      ],
      keyPoints: [
        'Comprehension menyediakan cara ringkas untuk membuat koleksi data baru.',
        'Dict comprehension: {k: v for k, v in iterable}.',
        'Set comprehension: {expr for item in iterable}.',
        'Generator expression menggunakan () dan tidak menyimpan semua data di memori.',
        'Hindari comprehension yang terlalu kompleks demi keterbacaan kode.',
      ],
      commonMistakes: [
        'Membuat comprehension bersarang yang sangat sulit dibaca dan dipelihara.',
        'Tidak memahami perbedaan antara list comprehension dan generator expression.',
      ],
      discussionQuestions: [
        'Apa perbedaan utama antara list comprehension dan generator expression?',
        'Kapan comprehension mengorbankan readability demi keringkasan?',
        'Bagaimana cara menggunakan comprehension untuk membuat dictionary dari dua list?',
      ],
      teachingNotes:
        'Sajikan comprehension sebagai "sihir" Python yang membuat kode lebih elegan. Selalu tunjukkan versi loop biasa terlebih dahulu agar siswa memahami logikanya.',
    },
  },

  // Chapter 5: Advanced Python
  5: {
    lesson1: {
      objectives: [
        'Memahami konsep Object-Oriented Programming (OOP) melalui analogi dunia nyata.',
        'Mampu membuat class (cetakan) dan instance/object (hasil cetakan) di Python.',
        'Menguasai penggunaan __init__ (konstruktor), self (diri sendiri), dan method (aksi).',
        'Mengenal konsep inheritance (pewarisan) dengan contoh hierarki hewan.',
      ],
      keyPoints: [
        'Class adalah cetakan/blueprint — analogikan dengan cetakan kue: class = cetakan, object = kue yang dihasilkan.',
        '__init__() adalah konstruktor yang dipanggil saat membuat object baru, seperti resep awal saat mencetak kue.',
        'self merujuk pada object saat ini (diri sendiri) dan harus menjadi parameter pertama setiap method.',
        'Inheritance (pewarisan) memungkinkan class anak mewarisi sifat class induk, contoh: class Hewan → class Kucing dan class Anjing.',
        'Encapsulation (enkapsulasi) menyembunyikan detail implementasi, seperti mesin mobil yang tersembunyi dari pengemudi.',
      ],
      commonMistakes: [
        'Lupa menuliskan self sebagai parameter pertama pada method.',
        'Mengira class dan object/instance adalah hal yang sama — class adalah cetakan, object adalah hasilnya.',
        'Tidak memanggil super().__init__() saat membuat class turunan (anak).',
        'Bingung antara atribut class (milik semua object) dan atribut instance (milik satu object).',
      ],
      discussionQuestions: [
        'Apa keuntungan menggunakan OOP dibanding pendekatan prosedural?',
        'Jika class Hewan punya method bersuara(), bagaimana Kucing dan Anjing mengimplementasikannya berbeda?',
        'Berikan contoh lain dari dunia nyata yang cocok dijadikan class dan object.',
        'Kapan inheritance (pewarisan) tepat digunakan dan kapan komposisi lebih baik?',
      ],
      teachingNotes:
        'Gunakan analogi cetakan kue: class = cetakan kue, object = kue yang dihasilkan. Setiap kue bisa punya topping berbeda (atribut instance). Untuk inheritance, gunakan contoh class Hewan sebagai induk dengan class Kucing dan Anjing sebagai turunan — Kucing bersuara "Meow", Anjing bersuara "Guk". Terjemahkan istilah OOP ke Bahasa Indonesia: inheritance = pewarisan, encapsulation = enkapsulasi, constructor = konstruktor. Mulai dengan class sederhana sebelum memperkenalkan pewarisan.',
    },
    lesson2: {
      objectives: [
        'Memahami konsep exception dan error handling di Python.',
        'Menguasai penggunaan try-except-else-finally.',
        'Mampu membuat custom exception.',
        'Mengetahui jenis-jenis error umum di Python.',
      ],
      keyPoints: [
        'try-except menangkap error agar program tidak berhenti secara tiba-tiba.',
        'Tangkap exception secara spesifik, hindari except tanpa tipe error.',
        'Blok else berjalan jika tidak ada exception, finally selalu berjalan.',
        'raise digunakan untuk melempar exception secara manual.',
        'Custom exception dibuat dengan membuat class turunan dari Exception.',
      ],
      commonMistakes: [
        'Menggunakan except tanpa menyebutkan tipe error sehingga semua error tertutup.',
        'Menempatkan terlalu banyak kode di dalam blok try.',
        'Mengabaikan error dengan except: pass tanpa penanganan yang benar.',
      ],
      discussionQuestions: [
        'Mengapa penting menangani error secara spesifik?',
        'Apa perbedaan antara error yang bisa diprediksi dan yang tidak?',
      ],
      teachingNotes:
        'Tunjukkan contoh program yang crash tanpa error handling, lalu tambahkan try-except. Ini mendemonstrasikan pentingnya penanganan error secara langsung.',
    },
    lesson3: {
      objectives: [
        'Mampu membaca dan menulis file teks di Python.',
        'Memahami penggunaan konteks manager (with statement).',
        'Mengenal berbagai mode file: read, write, append.',
        'Mampu bekerja dengan file CSV sederhana.',
      ],
      keyPoints: [
        'with open() as f: memastikan file ditutup secara otomatis setelah selesai.',
        'Mode "r" untuk membaca, "w" untuk menulis (menimpa), "a" untuk menambahkan.',
        'read() membaca seluruh file, readline() satu baris, readlines() semua baris sebagai list.',
        'Selalu gunakan with statement untuk menghindari file yang tidak tertutup.',
        'Encoding UTF-8 disarankan untuk mendukung karakter non-ASCII.',
      ],
      commonMistakes: [
        'Lupa menutup file setelah dibuka tanpa with statement.',
        'Menggunakan mode "w" yang menghapus isi file yang sudah ada.',
        'Tidak menangani FileNotFoundError saat membaca file.',
      ],
      discussionQuestions: [
        'Mengapa with statement lebih aman dibanding open() dan close() manual?',
        'Kapan menggunakan mode "a" dibanding "w"?',
      ],
      teachingNotes:
        'Buat latihan praktik membaca dan menulis file sederhana. Pastikan siswa memahami konsep path file agar tidak bingung saat file tidak ditemukan.',
    },
    lesson4: {
      objectives: [
        'Memahami konsep modul dan cara mengimpornya.',
        'Mampu membuat dan menggunakan modul sendiri.',
        'Mengenal package dan struktur folder modul.',
        'Mengetahui modul standar Python yang sering digunakan.',
      ],
      keyPoints: [
        'Modul adalah file Python (.py) yang berisi fungsi, class, dan variabel.',
        'import, from...import, dan as digunakan untuk mengimpor modul.',
        'Package adalah folder yang berisi beberapa modul dan file __init__.py.',
        'Modul standar seperti os, sys, math, random, dan datetime sangat berguna.',
        'pip digunakan untuk menginstal modul pihak ketiga dari PyPI.',
      ],
      commonMistakes: [
        'Memberi nama file yang sama dengan modul standar (misalnya math.py) sehingga terjadi konflik.',
        'Mengimpor seluruh modul dengan from module import * yang mengotori namespace.',
        'Tidak memahami perbedaan antara import module dan from module import func.',
      ],
      discussionQuestions: [
        'Apa keuntungan memecah kode menjadi beberapa modul?',
        'Mengapa from module import * dianggap praktik buruk?',
        'Bagaimana cara menemukan modul pihak ketiga yang berkualitas di PyPI?',
      ],
      teachingNotes:
        'Mulailah dengan modul standar yang sudah tersedia, lalu ajak siswa membuat modul sederhana sendiri. Tekankan pentingnya organisasi kode dalam proyek besar.',
    },
  },
};
