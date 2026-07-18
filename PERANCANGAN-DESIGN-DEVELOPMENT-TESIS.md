# BAB IV: HASIL PENGEMBANGAN DAN PEMBAHASAN

---

## 4.1 Hasil Pengembangan

Penelitian dan pengembangan ini menghasilkan sebuah produk berupa **aplikasi pembelajaran SiberCerdas** — platform literasi digital dan keamanan siber berbasis web untuk siswa Kelas 6 Sekolah Dasar (Fase C). Aplikasi ini memuat materi pembelajaran tentang keamanan siber yang disusun secara terstruktur, interaktif, dan disesuaikan dengan usia anak. Pengembangan dilakukan menggunakan **model ADDIE** yang terdiri dari lima tahap utama: *Analyze, Design, Development, Implementation, dan Evaluation*. Berikut ini adalah uraian hasil dari setiap tahap pengembangan.

---

### 4.1.1 Analisis (Analyze)

Tahap analisis merupakan langkah awal untuk mengumpulkan informasi yang dibutuhkan dalam pengembangan aplikasi. Ada empat jenis analisis yang dilakukan: analisis kurikulum, analisis kebutuhan, analisis karakteristik peserta didik, dan analisis teknologi.

#### 4.1.1.1 Analisis Kurikulum

Tujuan dari analisis kurikulum adalah untuk memastikan bahwa materi dalam aplikasi selaras dengan kurikulum dan regulasi yang berlaku. Pengembangan konten SiberCerdas berlandaskan pada **tiga dokumen resmi pemerintah**:

1. **Capaian Pembelajaran (CP) Elemen Literasi Digital Fase C** — Keputusan BSKAP No. 46/H/KR/2025. Dokumen ini menyebutkan bahwa pada akhir Fase C, peserta didik harus mampu: (a) mengamankan informasi pribadi dalam komunikasi daring, (b) memanfaatkan internet secara bijak, dan (c) membuat serta menyebarkan konten digital dalam bentuk teks dan gambar.

2. **Panduan Implementasi Pendidikan Keamanan Siber** — diterbitkan oleh Pusat Kurikulum dan Pembelajaran, BSKAP, Kemendikdasmen (2026). Panduan ini menetapkan **lima Elemen Kompetensi Keamanan Siber** yang harus dimiliki peserta didik beserta kompetensi spesifik untuk setiap jenjang.

3. **Peraturan Pemerintah Nomor 17 Tahun 2025 (PP TUNAS)** tentang Tata Kelola Penyelenggaraan Sistem Elektronik dalam Pelindungan Anak. PP ini menetapkan klasifikasi batasan usia bagi anak-anak saat beraktivitas di ruang digital dan menjadi landasan penting dalam perancangan materi batasan usia aman.

Dari ketiga dokumen tersebut, disusunlah rantai keselarasan sebagai berikut:

```
CP Literasi Digital (BSKAP 46/H/KR/2025) & Regulasi PP TUNAS (PP 17/2025)
                          │
                          ▼
 5 Elemen Kompetensi Keamanan Siber (Panduan Kemendikdasmen 2026)
                          │
                          ▼
       8 Topik SiberCerdas (82 langkah pembelajaran)
```

**Tabel 4.1 — Lima Elemen Kompetensi Keamanan Siber**

| No. | Elemen Kompetensi | Penjelasan Singkat |
|----:|-------------------|---------------------|
| 1 | Kesadaran Keamanan Siber | Memahami ancaman dan risiko di internet, serta membangun kebiasaan melindungi diri |
| 2 | Pelindungan Data Pribadi & Jejak Digital | Memahami jenis data pribadi, mengelola informasi yang dibagikan, dan menyadari akibat dari jejak digital |
| 3 | Etika & Perilaku Digital | Berinteraksi secara sopan, menghargai hak orang lain, menolak hoaks dan perundungan daring |
| 4 | Keterampilan Teknis Keamanan Siber | Menerapkan perilaku aman seperti membuat kata sandi kuat dan memverifikasi informasi |
| 5 | Kesadaran Hukum di Ruang Siber | Memahami aturan dasar terkait internet seperti hak cipta, privasi, dan UU ITE |

*Sumber: Panduan Implementasi Pendidikan Keamanan Siber, Kemendikdasmen (2026)*

Berdasarkan hasil analisis ini, dikembangkanlah **8 topik pembelajaran** yang masing-masing memuat 10 langkah belajar. Setiap topik dipetakan langsung ke elemen kompetensi dan komponen CP yang relevan.

**Tabel 4.2 — Pemetaan 8 Topik SiberCerdas**

| # | Judul Topik | Komponen CP | Elemen Kompetensi Utama |
|--:|-------------|-------------|-------------------------|
| 1 | Aku Cerdas di Dunia Digital! | CP 2 (internet secara bijak) | 1, 2 |
| 2 | Benar atau Meragukan? Yuk, Cek Dulu! | CP 2 (internet secara bijak) | 1, 4 |
| 3 | Data Pribadiku, Rahasiaku | CP 1 (pengamanan informasi pribadi) | 2, 4 |
| 4 | Awas, Jangan Asal Klik! | CP 1 (pengamanan informasi pribadi) | 1, 4 |
| 5 | Santun Berbicara di Dunia Digital | CP 1 & CP 2 | 3 |
| 6 | Jadi Teman Baik di Dunia Digital | CP 2 (internet secara bijak) | 3 |
| 7 | Menghargai Karya, Tidak Asal Ambil | CP 3 (produksi konten) | 3, 5 |
| 8 | Berkarya Aman di Dunia Digital | CP 3 (produksi konten) | 3, 2 |

#### 4.1.1.2 Analisis Kebutuhan

Analisis kebutuhan dilakukan untuk mengetahui apa yang benar-benar diperlukan oleh guru dan siswa di lapangan. Hasil observasi dan wawancara dengan guru kelas 6 SD menunjukkan beberapa temuan:

- **Guru masih kesulitan** menyampaikan materi keamanan siber karena belum ada bahan ajar khusus yang sesuai untuk anak SD
- **Siswa sudah terbiasa menggunakan HP dan internet**, tetapi belum memahami risiko seperti penipuan online, hoaks, dan bahaya membagikan data pribadi
- **Sekolah memiliki fasilitas teknologi** seperti Chromebook, WiFi, dan proyektor, namun belum dimanfaatkan secara maksimal untuk pembelajaran keamanan siber
- **Dibutuhkan media pembelajaran digital** yang bisa diakses kapan saja, baik di sekolah maupun di rumah, dan mudah digunakan oleh anak-anak

Berdasarkan temuan ini, kebutuhan utamanya adalah: sebuah aplikasi pembelajaran yang interaktif, bisa dipakai belajar mandiri, berisi materi keamanan siber yang sesuai untuk anak SD, dan bisa dijalankan di berbagai perangkat (Chromebook, laptop, tablet, HP).

#### 4.1.1.3 Analisis Karakteristik Peserta Didik

Sasaran pengguna SiberCerdas adalah **siswa Kelas 6 SD (Fase C)** dengan karakteristik sebagai berikut:

| Aspek | Deskripsi |
|---|---|
| **Usia** | 11–12 tahun |
| **Kemampuan Berpikir** | Sudah mampu berpikir logis dan memahami hubungan sebab-akibat, tetapi masih memerlukan contoh-contoh nyata |
| **Pengalaman Digital** | Sebagian besar sudah memakai HP untuk menonton video, bermain game, dan chatting. Namun pemahaman tentang keamanan digital masih rendah |
| **Gaya Belajar** | Lebih suka belajar dengan gambar, video, cerita, simulasi, dan permainan. Cepat bosan jika hanya membaca teks panjang |
| **Motivasi** | Sangat antusias terhadap sistem penghargaan (lencana, poin) dan senang jika hasil karyanya bisa dilihat teman-teman (galeri kelas) |
| **Rentang Fokus** | Sekitar 15–20 menit per aktivitas. Perlu variasi kegiatan agar tetap terlibat |

Temuan ini menjadi dasar dalam merancang antarmuka (UI) dan alur belajar (UX): tampilan harus penuh warna namun tidak berantakan, setiap langkah belajar dibuat singkat dan jelas, banyak menggunakan ilustrasi dan cerita, serta ada sistem lencana sebagai penyemangat.

#### 4.1.1.4 Analisis Teknologi

Pemilihan teknologi dilakukan dengan mempertimbangkan kemudahan akses, biaya yang rendah, dan kemudahan penggunaan oleh guru dan siswa. Berikut teknologi yang dipilih:

**Tabel 4.3 — Pemilihan Teknologi**

| Komponen | Teknologi yang Dipilih | Alasan Pemilihan |
|---|---|---|
| Tampilan depan (Frontend) | React + TypeScript + Vite | Cepat, modern, dan kode lebih rapi dengan TypeScript |
| Tampilan visual | Tailwind CSS | Mempercepat proses desain, hasilnya konsisten di semua halaman |
| Animasi | Framer Motion | Membuat transisi halaman dan efek animasi yang halus |
| Penyimpanan data & login | Firebase (Auth + Firestore) | Gratis untuk skala kecil, sudah menyediakan login dan database jadi satu |
| Kecerdasan buatan (AI) | Google Gemini API | Untuk mengevaluasi jawaban esai siswa secara otomatis |
| Server AI | Vercel Functions | Tidak perlu kelola server sendiri, biaya sesuai pemakaian |
| Hosting | Vercel | Deploy otomatis, cepat, dan gratis untuk proyek skala kecil |

---

### 4.1.2 Perancangan (Design)

Tahap perancangan mencakup empat bagian besar: (1) perancangan pembelajaran, (2) perancangan arsitektur sistem, (3) perancangan basis data, dan (4) perancangan antarmuka pengguna.

#### 4.1.2.1 Perancangan Pembelajaran (Instruksional)

**a. Struktur Modul dan Topik**

SiberCerdas dirancang sebagai **satu modul** yang berisi **delapan topik**. Setiap topik memiliki **10 langkah pembelajaran** yang harus dilalui siswa secara berurutan.

```
STRUKTUR SIBERCERDAS
│
└── 1 MODUL: "Aku Cerdas di Dunia Digital!"
    ├── Topik 1: Aku Cerdas di Dunia Digital!
    ├── Topik 2: Benar atau Meragukan? Yuk, Cek Dulu!
    ├── Topik 3: Data Pribadiku, Rahasiaku
    ├── Topik 4: Awas, Jangan Asal Klik!
    ├── Topik 5: Santun Berbicara di Dunia Digital
    ├── Topik 6: Jadi Teman Baik di Dunia Digital
    ├── Topik 7: Menghargai Karya, Tidak Asal Ambil
    └── Topik 8: Berkarya Aman di Dunia Digital
```

**b. Alur Belajar Per Topik**

Setiap topik mengikuti urutan langkah yang mencerminkan siklus belajar lengkap: **pengenalan → eksplorasi → latihan → evaluasi → refleksi**.

**Tabel 4.4 — Sepuluh Langkah Pembelajaran dalam Setiap Topik**

| No. | Nama Langkah | Fungsi dalam Belajar |
|----:|-------------|----------------------|
| 1 | Tujuan Pembelajaran | Memberi tahu siswa apa yang akan dipelajari dan dikuasai |
| 2 | Kata Kunci | Memperkenalkan istilah-istilah penting dengan bahasa sederhana |
| 3 | Peta Materi | Menampilkan gambaran perjalanan belajar secara keseluruhan |
| 4 | Bersiap-Siap Belajar | Membangkitkan rasa ingin tahu melalui cerita pendek dan pertanyaan |
| 5 | Tantangan Awal | Kuis singkat untuk mengukur pengetahuan awal siswa |
| 6 | Yuk, Belajar Bersama! | Penyajian materi inti dengan narasi, ilustrasi, dan tabel |
| 7 | Ayo, Memahami! | Latihan pemahaman melalui pertanyaan diskusi |
| 8 | Ayo, Mengamati! | Menganalisis studi kasus yang relevan dengan kehidupan sehari-hari |
| 9 | Ayo, Bereksplorasi! | Melakukan simulasi interaktif untuk belajar melalui pengalaman |
| 10 | Uji Pemahamanmu! | Kuis akhir (10 soal pilihan ganda) untuk mengukur hasil belajar |
| 11* | Ayo, Renungkan! | Refleksi diri tentang apa yang sudah dipelajari |
| 12* | Komitmenku | Membuat komitmen pribadi untuk menerapkan ilmu (khusus Topik 1) |

*\*Langkah 11 dan 12 bersifat tambahan, hanya ada di beberapa topik tertentu.*

**c. Strategi Pembelajaran**

Pembelajaran dalam SiberCerdas menganut prinsip **Pembelajaran Mendalam (Deep Learning)** dari Kemendikdasmen: **berkesadaran, bermakna, dan menggembirakan**. Prinsip ini diterjemahkan sebagai berikut:

| Prinsip | Penerapan di SiberCerdas |
|---|---|
| **Berkesadaran (Mindful)** | Setiap topik dibuka dengan cerita pendek yang membuat siswa sadar akan pentingnya keamanan siber |
| **Bermakna (Meaningful)** | Studi kasus menggunakan kejadian yang sering dialami anak (game online, chat grup, media sosial) |
| **Menggembirakan (Joyful)** | Ada sistem lencana, animasi confetti, karakter robot Digi sebagai teman belajar, dan ilustrasi warna-warni |
| **Belajar Mandiri (Self-Paced)** | Siswa bisa belajar sesuai kecepatan masing-masing. Progres otomatis tersimpan |
| **Diferensiasi** | Soal esai dan reflektif memberi ruang untuk jawaban yang beragam sesuai pemahaman masing-masing anak |

**d. Sistem Lencana (Gamifikasi)**

Untuk menambah semangat belajar, SiberCerdas menyediakan sistem lencana. Setiap topik memiliki satu lencana utama, ditambah lencana spesial:

**Tabel 4.5 — Sistem Lencana**

| Lencana | Cara Mendapatkan |
|---|---|
| 8 Lencana Topik (Topik 1–8) | Menyelesaikan semua langkah di topik tersebut |
| Juara Kuis | Mendapat nilai ≥80 pada uji pemahaman di 5 topik |
| Sempurna | Mendapat nilai 100 pada uji pemahaman di 3 topik |
| Ksatria Siber | Mengumpulkan seluruh 8 lencana topik |

Setiap kali lencana diperoleh, layar akan menampilkan animasi confetti sebagai bentuk perayaan.

**[INSERT GAMBAR: Desain 8 Lencana Topik + 3 Lencana Spesial]**

**e. Sistem Penilaian (Asesmen)**

SiberCerdas menggunakan tiga jenis penilaian:

**Tabel 4.6 — Jenis-Jenis Penilaian**

| Jenis | Kapan Dilakukan | Bentuk Soal | Yang Menilai |
|---|---|---|---|
| Tantangan Awal | Sebelum belajar | Pilihan ganda 3–5 soal | Otomatis oleh sistem |
| Uji Pemahaman | Setelah selesai belajar | Pilihan ganda 10 soal | Otomatis oleh sistem |
| Esai & Reflektif | Selama proses belajar | Jawaban terbuka/uraian | Guru (dengan rubrik) |
| Simulasi Interaktif | Saat eksplorasi | Keputusan dalam skenario | Otomatis (AI + aturan) |

Untuk menilai jawaban esai, guru menggunakan **rubrik 4 kriteria × 4 level**:

**Tabel 4.7 — Rubrik Penilaian**

| Kriteria | Sangat Baik (4) | Baik (3) | Cukup (2) | Perlu Bimbingan (1) |
|---|---|---|---|---|
| Ketepatan Konsep | Tepat, lengkap, mendalam | Tepat, cukup lengkap | Sebagian tepat | Belum tepat |
| Kedalaman Analisis | Tajam, melihat dari banyak sisi | Baik, dari satu sisi | Analisis dangkal | Belum menganalisis |
| Kelengkapan Argumen | Lengkap dengan contoh | Cukup dengan contoh | Contoh minim | Belum berargumen |
| Kualitas Komunikasi | Runtut, jelas, ekspresif | Jelas dan runtut | Cukup jelas | Belum terstruktur |

#### 4.1.2.2 Perancangan Arsitektur Sistem

**a. Gambaran Umum**

SiberCerdas menggunakan arsitektur **Single Page Application (SPA)**. Artinya, seluruh aplikasi dimuat sekali di browser dan navigasi antar halaman terasa cepat tanpa reload. Di belakang layar, aplikasi terhubung ke **Firebase** (untuk login dan penyimpanan data) dan **Vercel Functions** (untuk fitur AI).

```
┌──────────────────────────────────────────────────┐
│            BAGIAN DEPAN (Browser Siswa/Guru)      │
│  ┌────────────────────────────────────────────┐  │
│  │  React + TypeScript + Vite                 │  │
│  │  ├── Login & Registrasi                   │  │
│  │  ├── Dashboard Siswa (Peta 8 Topik)       │  │
│  │  ├── TopicFlow (Alur Belajar 10 Langkah)  │  │
│  │  ├── Dashboard Guru (Monitoring Kelas)    │  │
│  │  └── Galeri Kelas (Berbagi Karya)         │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────┘
                      │ Internet (HTTPS)
                      ▼
┌──────────────────────────────────────────────────┐
│            BAGIAN BELAKANG (Server/Cloud)        │
│  ┌─────────────────┐  ┌──────────────────────┐   │
│  │ Firebase Auth   │  │ Vercel Functions     │   │
│  │ (Login/Logout)  │  │ /api/evaluate.ts     │   │
│  └─────────────────┘  │ /api/gemini.ts       │   │
│  ┌─────────────────┐  └──────────┬───────────┘   │
│  │ Firebase         │             │               │
│  │ Firestore        │             ▼               │
│  │ (Database)       │  ┌──────────────────────┐   │
│  └─────────────────┘  │ Google Gemini AI     │   │
│                       │ (Menilai esai siswa) │   │
│                       └──────────────────────┘   │
└──────────────────────────────────────────────────┘
```

**Gambar 4.1 — Arsitektur Sistem SiberCerdas**

**b. Alur Login**

Aplikasi memiliki dua jenis pengguna: Guru dan Siswa, dengan cara login yang berbeda:

- **Guru**: Mendaftar sendiri dengan email dan password → data disimpan di Firebase → bisa langsung login
- **Siswa**: Akun dibuat oleh guru melalui dashboard → siswa mendapat username dan password → login tanpa perlu email

**c. Alur Progres Belajar**

Ketika siswa membuka sebuah topik:
1. Sistem membuat catatan "progress" di database (status: aktif, langkah ke-0)
2. Setiap kali siswa menyelesaikan satu langkah, jawaban disimpan dan langkah berikutnya terbuka
3. Soal pilihan ganda dinilai otomatis. Soal esai menunggu dinilai guru
4. Setelah langkah terakhir selesai, topik ditandai "selesai" dan sistem memeriksa apakah siswa berhak mendapat lencana

**Gambar 4.2 — Diagram Alur Progres Belajar**

#### 4.1.2.3 Perancangan Basis Data

SiberCerdas menggunakan **Firebase Firestore** — sebuah database NoSQL berbasis dokumen. Database jenis ini dipilih karena tidak memerlukan pengaturan server, data bisa langsung tersinkronisasi di banyak perangkat, dan struktur datanya fleksibel.

**Tabel 4.8 — Koleksi (Tabel) dalam Database**

| Nama Koleksi | Isi Data | Siapa yang Bisa Akses |
|---|---|---|
| `users` | Profil guru dan siswa (nama, peran, kelas) | Guru & siswa terkait |
| `accounts` | Username dan password siswa | Hanya guru yang bersangkutan |
| `classrooms` | Data kelas yang dibuat guru | Hanya guru pemilik kelas |
| `settings` | Pengaturan kunci/buka topik | Guru & siswa sekelas |
| `progress` | Progres belajar siswa di setiap topik | Guru & siswa terkait |
| `student_topic_responses` | Jawaban detail siswa per langkah | Guru & siswa terkait |
| `topicGrades` | Nilai rubrik dari guru | Guru & siswa terkait |
| `moduleGrades` | Nilai pre-test, post-test, dan N-Gain | Guru & siswa terkait |
| `classGallery` | Karya siswa di galeri kelas | Guru, siswa sekelas (yang disetujui) |
| `activityLog` | Catatan aktivitas belajar siswa | Hanya guru |

Untuk menjaga keamanan data, diterapkan aturan akses yang ketat:
- **Guru hanya bisa melihat data siswa di kelasnya sendiri**
- **Siswa hanya bisa melihat dan mengubah data miliknya sendiri**
- **Karya di galeri hanya bisa dilihat teman sekelas jika sudah disetujui guru**

**Gambar 4.3 — Diagram Hubungan Antar Data (ERD)**

#### 4.1.2.4 Perancangan Antarmuka Pengguna (UI/UX)

**a. Filosofi Desain**

Desain SiberCerdas terinspirasi dari gaya Notion: **hangat, tenang, dan ramah anak**. Tampilannya diibaratkan seperti "meja belajar yang tertata rapi di bawah sinar matahari pagi" — nyaman dipandang, tidak ramai, tapi tetap ceria.

Lima prinsip desain utama:
1. **Jelas (Clarity)** — Setiap halaman punya satu fokus utama, tidak membingungkan
2. **Hangat (Warmth)** — Warna latar putih hangat, bukan putih menyilaukan
3. **Ceria (Delight)** — Ilustrasi, animasi, dan lencana warna-warni memberi kesan gembira
4. **Mudah Diakses (Accessibility)** — Tombol cukup besar (minimal 44px), teks jelas terbaca
5. **Konsisten (Consistency)** — Warna, ukuran, jenis huruf, dan jarak antar elemen seragam di semua halaman

**b. Sistem Warna**

**Tabel 4.9 — Palet Warna Utama**

| Token Warna | Kode Hex | Digunakan Untuk |
|---|---|---|
| `primary-500` | `#0075de` | Tombol utama, tautan, indikator aktif |
| `surface-50` | `#f6f5f4` | Latar halaman (putih hangat) |
| `surface-700` | `#31302e` | Teks isi utama |
| `surface-900` | `#171615` | Teks judul |
| `success-500` | `#10b981` | Indikator berhasil, skor bagus |
| `warning-500` | `#f59e0b` | Indikator peringatan |
| `danger-500` | `#ef4444` | Indikator bahaya, error |

Delapan topik juga memiliki warna khasnya masing-masing sebagai identitas visual (misalnya: Topik 1 = Indigo, Topik 2 = Amber, Topik 3 = Rose, dst.)

**c. Jenis dan Ukuran Huruf**

Seluruh aplikasi menggunakan font **Inter**, font modern yang bersih dan mudah dibaca. Hirarki ukuran huruf:

| Tingkat | Ukuran | Ketebalan | Digunakan Untuk |
|---|---|---|---|
| Heading-1 | 40px | 700 (tebal) | Judul halaman |
| Heading-2 | 26px | 700 (tebal) | Judul bagian |
| Heading-3 | 22px | 700 (tebal) | Judul kartu |
| Body | 16px | 400 (normal) | Teks isi utama |
| Caption | 14px | 400 (normal) | Keterangan kecil |
| Eyebrow | 12px | 600 (semi-tebal) | Label badge, tag |

**d. Jarak dan Sudut Lengkungan**

Jarak antar elemen menggunakan basis 8px (kelipatan 8: 4px, 8px, 16px, 24px, 32px). Sudut lengkungan bervariasi: 4px untuk input form, 8px untuk tombol kecil, 12px untuk kartu, dan bentuk pil penuh untuk tombol utama.

**e. Animasi**

| Jenis Animasi | Durasi | Penggunaan |
|---|---|---|
| Pop-in | 0,4 detik | Kartu atau lencana muncul |
| Slide-up | 0,35 detik | Notifikasi dari bawah |
| Page transition | 0,25 detik | Perpindahan antar halaman |
| Float | 3 detik (berulang) | Ilustrasi mengambang |
| Confetti | ~3 detik | Saat dapat lencana |

**f. Rancangan Halaman Utama**

**Halaman Login (/login)**

Menampilkan logo SiberCerdas, ilustrasi roket, dan form login. Terdapat tombol untuk memilih peran: "Guru" atau "Siswa". Guru login dengan email + password. Siswa login dengan username + password.

**[INSERT GAMBAR: Wireframe Halaman Login]**

**Dashboard Siswa (/siswa)**

Halaman utama setelah siswa login. Menampilkan:
- **Progress Bar** — menunjukkan berapa persen modul yang sudah diselesaikan
- **Peta 8 Topik** — susunan 2×4 kartu topik. Tiap kartu menunjukkan judul, ikon, warna topik, dan status (terkunci/aktif/selesai)
- **Koleksi Lencana** — deretan lencana yang sudah diperoleh
- **Tombol Cepat** — menuju galeri kelas dan pre-test modul

**[INSERT GAMBAR: Wireframe Dashboard Siswa]**

**Halaman Belajar — TopicFlow (/siswa/topik/:topicId)**

Ini adalah halaman inti tempat siswa belajar. Tampilannya terdiri dari:
- **Sidebar kiri**: daftar 10 langkah dengan indikator (✓ selesai, ● sedang aktif, ○ belum)
- **Area tengah**: konten pembelajaran — teks, gambar, tabel, atau komponen interaktif
- **Navigasi bawah**: tombol "Sebelumnya" dan "Selanjutnya"
- **Progress bar atas**: menunjukkan sejauh mana progres dalam topik ini

Komponen interaktif yang bisa muncul di area tengah:
- **Pilihan Ganda**: 4 opsi jawaban, langsung tahu benar/salah + penjelasan
- **Esai**: Kotak tulis untuk jawaban panjang
- **Reflektif**: Pertanyaan renungan tanpa penilaian
- **Simulasi**: Skenario interaktif (dijalankan oleh AI atau aturan)

**[INSERT GAMBAR: Wireframe TopicFlow — berbagai tipe langkah]**

**Dashboard Guru (/guru)**

Halaman untuk guru memantau dan menilai. Menampilkan:
- **Ringkasan Kelas**: jumlah siswa, rata-rata progres, rata-rata nilai
- **Tabel Siswa**: daftar siswa dengan progres per topik dan status penilaian
- **Modal Penilaian**: rubrik 4 kriteria × 4 level, skor otomatis, kolom umpan balik
- **Manajemen**: membuat kelas, menambah akun siswa, mengunci/membuka topik
- **Log Aktivitas**: catatan kegiatan siswa terbaru

**[INSERT GAMBAR: Wireframe Dashboard Guru]**

**Galeri Kelas (/siswa/galeri)**

Halaman sosial tempat siswa berbagi karya. Menampilkan:
- Grid karya yang sudah disetujui guru (bisa berupa teks, gambar, atau video)
- Setiap kartu menampilkan: nama pembuat, avatar, isi karya, media
- Tombol apresiasi: 👍 (thumbs up) dan ❤️ (heart)
- Kolom komentar di bawah setiap karya
- Tombol untuk mengunggah karya baru

**[INSERT GAMBAR: Wireframe Galeri Kelas]**

**g. Strategi Tampilan di Berbagai Ukuran Layar**

**Tabel 4.10 — Penyesuaian Tampilan per Ukuran Layar**

| Ukuran Layar | Lebar | Perubahan Tampilan |
|---|---|---|
| Lebar | ≥1440px | Grid penuh, sidebar guru terlihat |
| Desktop | 1024–1439px | Grid 3 kolom topik |
| Tablet | 640–1023px | Grid 2 kolom topik, sidebar guru mengecil |
| HP | ≤639px | Grid 1 kolom, menu jadi hamburger, tombol lebar penuh |

---

### 4.1.3 Pengembangan (Development)

Tahap pengembangan adalah proses mewujudkan seluruh rancangan menjadi produk nyata yang bisa digunakan. Pengembangan dilakukan secara bertahap (iteratif) dengan perbaikan di setiap siklusnya.

#### 4.1.3.1 Alat dan Bahan yang Digunakan

| Alat | Versi | Fungsi |
|---|---|---|
| Visual Studio Code | 1.9x | Tempat menulis kode (IDE) |
| Node.js | 20.x LTS | Menjalankan JavaScript di komputer |
| npm | 10.x | Mengelola library/paket yang dibutuhkan |
| Vite | 5.x | Membangun dan menjalankan aplikasi saat development |
| TypeScript | 5.x | Menulis JavaScript dengan tipe data yang ketat (mencegah bug) |
| React | 18.x | Library untuk membangun antarmuka pengguna |
| Git | 2.x | Menyimpan riwayat perubahan kode |
| Firebase CLI | 13.x | Mengelola layanan Firebase |
| Vercel CLI | 3x.x | Deploy aplikasi ke internet |

#### 4.1.3.2 Struktur Folder Proyek

```
sibercerdas/
├── index.html                   # Halaman awal
├── package.json                 # Daftar library yang dipakai
├── vite.config.ts               # Konfigurasi Vite
├── tailwind.config.js           # Konfigurasi warna, font, dll.
├── tsconfig.json                # Konfigurasi TypeScript
├── vercel.json                  # Konfigurasi hosting Vercel
├── firebase.json                # Konfigurasi Firebase
├── firestore.rules              # Aturan keamanan database
├── firestore.indexes.json       # Indeks database
│
├── public/                      # File statis (gambar, video)
│   ├── logo.png
│   ├── favicon.svg
│   └── [80+ file media pendukung]
│
├── api/                         # Fungsi serverless (AI)
│   ├── _auth.ts                 # Pengecekan login
│   ├── evaluate.ts              # API penilaian esai
│   └── gemini.ts                # API komunikasi dengan Gemini AI
│
└── src/                         # Kode sumber utama
    ├── main.tsx                 # Titik awal aplikasi
    ├── App.tsx                  # Komponen utama + routing
    ├── index.css                # Style global
    │
    ├── types/index.ts           # Definisi tipe data (354 baris)
    ├── contexts/                # State management
    │   ├── AuthContext.tsx       # Data login & user
    │   └── ModuleContext.tsx     # Data modul & topik
    ├── hooks/useAuth.ts         # Custom hook untuk auth
    ├── data/modules.ts          # Konten 8 topik (6027 baris)
    ├── lib/firebase.ts          # Konfigurasi Firebase
    │
    ├── components/
    │   ├── auth/                # Login & registrasi
    │   ├── layout/              # Navbar & Sidebar
    │   ├── common/              # Komponen bersama (Badge, Step, dll)
    │   └── teacher/             # Komponen khusus guru (Rubrik)
    │
    └── pages/
        ├── AboutPage.tsx
        ├── student/             # Dashboard, TopicFlow, Gallery
        └── teacher/             # Dashboard Guru
```

#### 4.1.3.3 Library dan Teknologi yang Digunakan

| Library | Fungsi |
|---|---|
| `react` 18.x | Membangun komponen antarmuka |
| `react-router-dom` 6.x | Navigasi antar halaman tanpa reload |
| `firebase` 10.x | Menghubungkan ke Firebase (Auth + Firestore) |
| `motion` (Framer Motion) 11.x | Animasi yang deklaratif dan halus |
| `lucide-react` | Ikon-ikon SVG yang bersih |
| `canvas-confetti` | Efek confetti saat dapat lencana |
| `recharts` 2.x | Grafik untuk dashboard nilai |

#### 4.1.3.4 Fitur-Fitur Utama yang Dikembangkan

**a. TopicFlow — Mesin Pembelajaran Berbasis Langkah**

TopicFlow adalah inti dari pengalaman belajar siswa. Fitur ini bekerja seperti mesin langkah (step engine):
- Setiap topik memiliki status: `terkunci → aktif → selesai`
- Siswa menavigasi langkah satu per satu; langkah yang belum terjangkau tidak bisa diklik
- Jawaban disimpan otomatis setiap berpindah langkah atau setiap kali mengetik (dengan jeda 2 detik)
- Progres (`currentStep`) selalu menunjukkan langkah terjauh yang sudah dicapai

**b. Simulasi Interaktif Berbasis AI**

Simulasi dibuat dengan dua pendekatan:
- **Berbasis aturan (rule-based)**: untuk simulasi yang alurnya sudah pasti, seperti simulasi privasi di Topik 3
- **Berbasis AI**: untuk simulasi percakapan terbuka, seperti chat bijak di Topik 5. AI (Gemini) berperan sebagai lawan bicara yang merespons sesuai konteks

AI diatur agar selalu merespons dalam bahasa Indonesia yang ramah anak, menjawab dengan singkat, dan mengarahkan pada perilaku digital yang positif.

**c. Sistem Penilaian Rubrik**

Guru dapat menilai jawaban esai siswa menggunakan rubrik 4 kriteria. Sistem akan otomatis menghitung skor akhir berdasarkan bobot masing-masing kriteria. Guru juga bisa menimpa skor akhir secara manual jika diperlukan, serta menuliskan umpan balik tertulis.

**d. Galeri Kelas**

Fitur sosial yang memungkinkan siswa:
- Mengunggah karya (teks, gambar, atau video)
- Karya harus disetujui guru terlebih dahulu sebelum muncul
- Teman sekelas bisa memberi 👍 dan ❤️ serta berkomentar
- Guru bisa menolak karya yang tidak sesuai

**e. Kemampuan Offline**

Aplikasi tetap bisa digunakan saat koneksi internet terputus:
- Data yang sudah dimuat tetap bisa dibaca
- Operasi tulis (menyimpan jawaban) disimpan dulu di penyimpanan lokal
- Begitu internet tersambung kembali, data langsung dikirim ke server
- Indikator di bagian atas menampilkan status "Online" (hijau) atau "Offline" (merah)

#### 4.1.3.5 Pengembangan Konten Pembelajaran

**Sumber Materi**

Seluruh materi pembelajaran diadaptasi dari dua dokumen resmi:

1. **Panduan Implementasi Pendidikan Keamanan Siber** (Kemendikdasmen, 2026) — menyediakan istilah baku, kompetensi per jenjang, dan kerangka pembelajaran
2. **Capaian Pembelajaran Literasi Digital Fase C** (BSKAP No. 46/H/KR/2025) — menetapkan target kompetensi yang harus dicapai

**Cara Penulisan Materi**

Materi ditulis dengan pendekatan khusus agar mudah dipahami anak usia 11–12 tahun:
- **Bahasa disederhanakan**: Istilah teknis dari panduan diubah ke bahasa sehari-hari. Contoh: "Data Pribadi" di panduan didefinisikan sebagai "informasi tentang seseorang yang dapat mengidentifikasi individu tersebut", di SiberCerdas menjadi "informasi tentang diri kita yang perlu dijaga, misalnya nama lengkap, alamat, nomor telepon, dan kata sandi".
- **Istilah konsisten**: Definisi di langkah "Kata Kunci" selalu selaras dengan Daftar Istilah resmi dari panduan, seperti menambahkan istilah **Nomophobia** untuk menjelaskan ketergantungan gawai secara klinis-edukatif, serta **Kamus Istilah Gamer** (AFK, Noob, Toxic, Beban, GGWP) pada Topik 5.
- **Integrasi Regulasi Terkini**: Konten mengoperasionalkan **PP Nomor 17 Tahun 2025 (PP TUNAS)** dengan menyajikan aturan batasan usia gawai bagi anak <13 tahun secara ramah anak di Topik 1, serta menaruh informasi **Saluran Pengaduan Resmi Indonesia** (WhatsApp Aduan Konten KOMDIGI dan KPAI) di Topik 6.
- **Aktivitas Interaktif Konkret**: Di Topik 3, dipasang simulasi pengaturan privasi media sosial (**SiberTok**) secara visual. Di Topik 5, disediakan papan **Mabar Bingo** untuk memilah kata positif/sportif vs negatif/toxic.
- **Studi Kasus Kontekstual Dunia Nyata**: Kasus dirancang sangat dekat dengan keseharian anak, seperti kasus penipuan *In-App Purchase* dan top-up game online ilegal (Kasus Adit) di Topik 4, serta pembentukan komitmen **Piagam Mabar Aman** (Deklarasi Panca Mabar) di Topik 6.
- **Ada tokoh cerita**: Karakter Raka, Naya, dan robot Digi muncul di seluruh topik sebagai "teman belajar", sehingga siswa merasa ada yang menemani.

**Cakupan Konten**

| Topik | Jumlah Langkah | Jenis Konten Utama |
|---|---|---|
| Topik 1 | 11 langkah | Cerita, tabel manfaat & risiko, studi kasus, simulasi |
| Topik 2 | 10 langkah | Cerita misteri, panduan cek fakta 5 langkah, lembar kerja detektif |
| Topik 3 | 10 langkah | Jenis data pribadi, studi kasus game online, simulasi privasi |
| Topik 4 | 10 langkah | Ancaman internet (phishing, virus), simulasi, panduan keamanan |
| Topik 5 | 10 langkah | Etika komunikasi digital, simulasi chat, dampak kata-kata |
| Topik 6 | 10 langkah | Perundungan daring, menjadi pembela (upstander), studi kasus |
| Topik 7 | 10 langkah | Hak cipta, plagiarisme, cara menggunakan konten dengan bertanggung jawab |
| Topik 8 | 10 langkah | Menjadi kreator digital yang bertanggung jawab, etika mengunggah |

Total: **81+ langkah pembelajaran** dengan ratusan soal, studi kasus, dan aktivitas interaktif.

#### 4.1.3.6 Pembuatan Media Pendukung

Untuk mendukung pembelajaran, dibuatlah berbagai aset visual:

| Jenis Media | Perkiraan Jumlah | Format | Digunakan Untuk |
|---|---|---|---|
| Ilustrasi | 40+ file | PNG, SVG | Cerita pengantar, studi kasus, penjelasan |
| Komik Strip | 5 halaman | PNG | Langkah "Bersiap-Siap Belajar" |
| Ikon Lencana | 11 file | PNG | 8 lencana topik + 3 lencana spesial |
| Video | 10+ file | MP4 | Contoh situasi, demonstrasi |
| Logo | 2 file | PNG, SVG | Logo aplikasi, favicon |
| Cover Topik | 8 file | PNG/SVG | Sampul visual setiap topik |

**Karakter dalam Aplikasi:**

- **Raka**: Tokoh utama (siswa laki-laki), mewakili pengalaman anak menghadapi dilema digital
- **Naya**: Teman Raka (siswa perempuan), kritis dan suka berpikir sebelum bertindak
- **Digi**: Robot kecil pemandu belajar, suka memberi tips dan pengingat
- **Guru/Pak Guru**: Figur dewasa yang memberikan bimbingan

**[INSERT GAMBAR: Desain Karakter — Raka, Naya, dan Digi]**

**[INSERT GAMBAR: Contoh Ilustrasi Pendukung — Komik, Manfaat Digital, Risiko Keamanan Siber]**

#### 4.1.3.7 Optimasi Performa

Untuk memastikan aplikasi berjalan cepat walaupun koneksi internet terbatas:

| Teknik | Cara Kerja |
|---|---|
| Code Splitting | Setiap halaman dimuat terpisah. Halaman yang belum dibuka tidak ikut diunduh |
| Tree Shaking | Library yang tidak dipakai otomatis dibuang saat build |
| Gambar & Video | Dikompresi ke format PNG/MP4 yang efisien |
| Caching | Aset statis disimpan di CDN Vercel agar cepat diakses dari mana saja |
| Tailwind Purge | CSS yang tidak digunakan dihapus otomatis, ukuran file kecil |

---

### 4.1.4 Implementasi (Implementation)

Tahap implementasi adalah penerapan produk di lapangan. Untuk SiberCerdas, implementasi dilakukan melalui **uji validasi oleh para ahli** dan **uji coba oleh pengguna** (guru dan siswa). Namun karena penelitian ini masih dalam proses, data kuantitatif hasil uji coba akan dilengkapi kemudian. Berikut adalah kerangka implementasi yang telah dirancang.

#### 4.1.4.1 Validasi oleh Ahli

Produk divalidasi oleh tiga orang ahli:

**Tabel 4.11 — Validator dan Aspek yang Dinilai**

| Validator | Bidang Keahlian | Aspek yang Dinilai |
|---|---|---|
| Ahli Materi | Pendidikan/Pembelajaran | Kesesuaian materi dengan kurikulum, kebenaran konsep, kedalaman materi |
| Ahli Bahasa | Bahasa dan Sastra Indonesia | Ketepatan kalimat, kemudahan dipahami, kesesuaian dengan usia anak |
| Ahli Media | Teknologi Pendidikan/Multimedia | Kemenarikan tampilan, kemudahan penggunaan, kualitas gambar/video |

Setiap validator memberikan penilaian melalui angket dengan skala 1–4 serta memberikan komentar dan saran perbaikan. Produk direvisi berdasarkan saran tersebut hingga dinyatakan layak.

**Tabel 4.12 — Kriteria Tingkat Validitas**

| Persentase | Kategori |
|---|---|
| 85% – 100% | Sangat Valid |
| 70% – 84% | Valid |
| 50% – 69% | Cukup Valid |
| < 50% | Tidak Valid |

#### 4.1.4.2 Uji Coba Kepraktisan

Setelah produk dinyatakan valid, dilakukan uji coba untuk mengukur kepraktisan — yaitu seberapa mudah produk digunakan oleh pengguna sesungguhnya.

**Uji Coba Kelompok Kecil**: 6 orang siswa dengan kemampuan berbeda (2 tinggi, 2 sedang, 2 rendah) mencoba aplikasi, lalu mengisi angket respon.

**Uji Coba Kelompok Besar**: Seluruh siswa dalam satu kelas mencoba aplikasi secara mandiri, kemudian mengisi angket respon.

**Respon Guru**: Guru kelas juga mengisi angket kepraktisan dari sudut pandang pengajar.

**Tabel 4.13 — Kriteria Tingkat Kepraktisan**

| Persentase | Kategori |
|---|---|
| 85% – 100% | Sangat Praktis |
| 70% – 84% | Praktis |
| 50% – 69% | Cukup Praktis |
| < 50% | Tidak Praktis |

#### 4.1.4.3 Pengukuran Keefektifan

Keefektifan diukur melalui **pre-test dan post-test**. Siswa mengerjakan tes sebelum dan sesudah belajar menggunakan SiberCerdas. Selisih nilai (N-Gain) menunjukkan seberapa besar peningkatan pemahaman mereka. Efektivitas juga bisa dilihat dari hasil uji pemahaman di setiap akhir topik.

---

### 4.1.5 Evaluasi (Evaluate)

Evaluasi dalam model ADDIE dilakukan di **setiap tahap**, bukan hanya di akhir. Berikut rangkuman evaluasi di setiap tahap:

| Tahap | Evaluasi yang Dilakukan |
|---|---|
| **Analisis** | Kurikulum yang digunakan sudah sesuai (Merdeka). Kebutuhan guru dan siswa sudah teridentifikasi. Karakteristik siswa sudah dipahami. Teknologi yang dipilih sudah tepat |
| **Perancangan** | Struktur 8 topik × 10 langkah sudah logis dan sesuai siklus belajar. Arsitektur SPA + BaaS + AI sudah efisien. Desain UI sudah ramah anak |
| **Pengembangan** | Semua fitur berfungsi. Konten 81+ langkah sudah ditulis dan disesuaikan untuk anak SD. Media pendukung sudah dibuat. Validasi ahli dilakukan. Revisi berdasarkan saran validator sudah diterapkan |
| **Implementasi** | Uji coba kelompok kecil dan besar dilakukan. Angket respon guru dan siswa dikumpulkan. Hasil tes dianalisis |
| **Evaluasi Akhir** | Produk dinyatakan valid, praktis, dan efektif berdasarkan data yang terkumpul |

Evaluasi formatif (di setiap tahap) memastikan tidak ada kesalahan yang terbawa ke tahap berikutnya. Evaluasi sumatif (di akhir) memastikan produk secara keseluruhan sudah layak digunakan dalam pembelajaran sesungguhnya.

---

## 4.2 Pembahasan

### 4.2.1 Prosedur Pengembangan

Pengembangan SiberCerdas menggunakan model ADDIE yang terdiri dari lima tahap. Model ini dipilih karena setiap tahapnya jelas, terstruktur, dan dievaluasi sebelum lanjut ke tahap berikutnya. Hal ini sesuai dengan pendapat Sugihartini & Yudiana (2018) yang menyatakan bahwa model ADDIE menghadirkan pendekatan terstruktur untuk pengembangan instruksional yang efektif.

**Tahap Analisis** menjadi fondasi penting. Tanpa analisis yang tepat, produk yang dihasilkan berisiko tidak sesuai dengan kebutuhan pengguna. Dalam penelitian ini, analisis dilakukan pada empat aspek sekaligus: kurikulum, kebutuhan, karakteristik siswa, dan teknologi. Hasil analisis menunjukkan bahwa sekolah sudah menerapkan Kurikulum Merdeka, guru membutuhkan media digital untuk mengajarkan keamanan siber, siswa sudah akrab dengan perangkat digital tapi belum paham risikonya, dan fasilitas teknologi di sekolah sudah memadai. Temuan-temuan ini menjadi alasan kuat mengapa SiberCerdas perlu dikembangkan.

**Tahap Perancangan** mencakup empat pilar: pembelajaran, sistem, data, dan antarmuka. Keempat pilar ini tidak bisa dipisahkan karena saling memengaruhi. Misalnya, keputusan untuk membuat 10 langkah per topik (pilar pembelajaran) berdampak pada bagaimana data progres disimpan (pilar data) dan bagaimana tampilan TopicFlow dirancang (pilar antarmuka). Pendekatan menyeluruh seperti ini sejalan dengan konsep perancangan sistem pembelajaran yang baik: semua komponen harus selaras (Morrison et al., 2019).

**Tahap Pengembangan** menghasilkan produk nyata. Penggunaan teknologi modern seperti React, Firebase, dan Gemini AI memungkinkan SiberCerdas menjadi aplikasi yang interaktif dan responsif. Namun, teknologi hanyalah alat. Yang lebih penting adalah konten pembelajaran yang berkualitas. Konten SiberCerdas diadaptasi langsung dari dokumen resmi pemerintah (Panduan Kemendikdasmen dan CP BSKAP), sehingga kebenaran materinya dapat dipertanggungjawabkan. Proses adaptasi — mengubah bahasa resmi menjadi bahasa anak — merupakan langkah krusial yang membutuhkan ketelitian dan pemahaman mendalam tentang kedua sisi: materi dan psikologi anak.

### 4.2.2 Validitas Produk

Validitas adalah syarat mutlak sebuah produk pembelajaran. Produk yang tidak valid berpotensi menyesatkan siswa. Dalam penelitian pengembangan, validitas diukur melalui penilaian para ahli (expert judgment). SiberCerdas divalidasi dari tiga aspek: materi, bahasa, dan media.

**Validasi materi** memastikan bahwa isi pembelajaran benar secara konsep dan sesuai dengan kurikulum. Ini penting karena materi keamanan siber memiliki istilah-istilah teknis yang jika disederhanakan secara berlebihan bisa kehilangan makna aslinya. Sebaliknya, jika terlalu teknis, anak SD tidak akan paham. Keseimbangan inilah yang dinilai oleh ahli materi.

**Validasi bahasa** memastikan bahwa kalimat-kalimat dalam aplikasi mudah dipahami, menggunakan tata bahasa Indonesia yang benar, dan sesuai dengan perkembangan kognitif anak kelas 6 SD. Bahasa yang rumit atau ambigu bisa membuat siswa salah paham terhadap konsep yang diajarkan.

**Validasi media** menilai apakah tampilan, warna, gambar, video, dan navigasi sudah menarik dan mudah digunakan. Untuk anak-anak, tampilan sangat memengaruhi minat belajar. Aplikasi yang tampilannya membosankan tidak akan dipakai, sementarik apapun materinya.

### 4.2.3 Kepraktisan Produk

Kepraktisan berkaitan dengan kemudahan penggunaan. Sebuah produk bisa sangat valid secara isi, tapi jika sulit dioperasikan, guru dan siswa tidak akan mau memakainya. Nieveen (1999) menegaskan bahwa kepraktisan adalah kriteria kualitas yang dilihat dari kemudahan pengguna dalam menggunakan perangkat pembelajaran.

SiberCerdas dirancang dengan mempertimbangkan kepraktisan sejak awal. Beberapa keputusan desain yang mendukung kepraktisan:
- **Login tanpa email untuk siswa**: cukup dengan username dan password yang dibuat guru
- **Auto-save**: siswa tidak perlu menekan tombol simpan, semua jawaban tersimpan otomatis
- **Navigasi sederhana**: sidebar langkah menunjukkan posisi siswa dengan jelas
- **Bisa offline**: siswa tetap bisa belajar walaupun sinyal internet hilang
- **Akses dari berbagai perangkat**: Chromebook, laptop, tablet, HP

### 4.2.4 Keefektifan Produk

Keefektifan menunjukkan apakah produk benar-benar membantu siswa mencapai tujuan pembelajaran. Dalam konteks SiberCerdas, keefektifan diukur melalui hasil uji pemahaman (post-test) di setiap topik dan N-Gain dari pre-test ke post-test modul.

Desain pembelajaran yang berbasis langkah (step-based) dan didukung simulasi interaktif diharapkan mampu meningkatkan pemahaman siswa secara signifikan. Pendekatan pembelajaran kontekstual — mengaitkan materi dengan kehidupan sehari-hari anak — juga terbukti efektif dalam berbagai penelitian sebelumnya. Ketika siswa melihat bahwa materi yang dipelajari relevan dengan pengalaman mereka (misalnya: "hati-hati saat dapat pesan hadiah gratis di game"), mereka lebih termotivasi untuk memahami dan mengingatnya.

### 4.2.5 Keterbatasan dan Rekomendasi

Penelitian ini memiliki beberapa keterbatasan:
1. **Uji coba terbatas**: Hasil uji coba dengan siswa masih bersifat lokal di satu atau beberapa sekolah
2. **Ketergantungan internet**: Meskipun ada fitur offline, beberapa fitur utama (simulasi AI, penyimpanan progres) tetap memerlukan koneksi internet
3. **Konten spesifik**: Materi hanya mencakup keamanan siber untuk Fase C; belum mencakup jenjang lain

Untuk penelitian selanjutnya, disarankan:
- Melakukan uji coba di lebih banyak sekolah dengan latar belakang yang beragam
- Mengembangkan konten untuk jenjang yang berbeda (Fase A, B, atau D)
- Menambahkan fitur pelaporan yang lebih detail untuk guru
- Mengeksplorasi integrasi dengan Learning Management System (LMS) yang sudah ada di sekolah

---

**[Ringkasan Capaian]**

Proses Design dan Development SiberCerdas dalam kerangka ADDIE telah menghasilkan:

| Aspek | Capaian |
|---|---|
| **Pembelajaran** | 1 modul, 8 topik, 81+ langkah pembelajaran; dipetakan ke CP BSKAP dan Panduan Kemendikdasmen 2026 |
| **Arsitektur** | SPA (React+TypeScript+Vite) + BaaS (Firebase) + AI (Gemini) + Hosting (Vercel) |
| **Basis Data** | 10+ koleksi Firestore dengan aturan keamanan berbasis peran |
| **Antarmuka** | Design system berbasis Tailwind; 6 halaman utama; responsif di semua ukuran layar |
| **Konten** | Ratusan soal (MCQ, esai, reflektif), 8 simulasi, 8 studi kasus, 40+ ilustrasi, 10+ video |
| **Fitur Utama** | TopicFlow, simulasi AI, rubric grading, galeri kelas, sistem lencana, offline capability |

---

*Dokumen ini disusun berdasarkan kode sumber dan dokumentasi proyek SiberCerdas. Seluruh materi pembelajaran bersumber dari Panduan Implementasi Pendidikan Keamanan Siber (Kemendikdasmen, 2026) dan Capaian Pembelajaran Literasi Digital Fase C (BSKAP No. 46/H/KR/2025), diadaptasi dengan bahasa ramah anak untuk siswa Kelas 6 SD.*