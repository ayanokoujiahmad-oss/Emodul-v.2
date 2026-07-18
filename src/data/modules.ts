// ──────────────────────────────────────────────
// SiberCerdas – Module & Topic Data
// ──────────────────────────────────────────────
//
// 1 Module → 8 Topics → 10 Steps each
// + Pre-test (10 MC) + Post-test (10 MC)
// + Rubric Criteria (4)
//
// All content is in Bahasa Indonesia, targeted at
// Kelas 6 SD students (usia 11-12 tahun).
// ──────────────────────────────────────────────

import type { Module, Topic, Question, RubricCriterion } from '../types';

/* ═══════════════════════════════════════════════
 HELPER – generate unique question IDs
 ═══════════════════════════════════════════════ */
let _qCounter = 0;
function qid(): string {
  _qCounter++;
  return `q-${_qCounter}`;
}

/* ═══════════════════════════════════════════════
 TOPIC 1 – Aku Cerdas di Dunia Digital!
 ═══════════════════════════════════════════════ */
const topic1: Topic = {
  id: "topik-1",
  number: 1,
  title: "Aku Cerdas di Dunia Digital!",
  description: "Belajar memahami dunia digital, internet, manfaat, risiko, dan kebiasaan pengguna digital yang cerdas.",
  icon: "fingerprint",
  color: "bg-indigo-500",
  backgroundImageUrl: "/gambar/Topik%201/Cover_Topik_1.png",
  badgeId: "badge-identitas-digital",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah menyelesaikan materi dan aktivitas pada topik 1 "Aku Cerdas di Dunia Digital!" kamu akan mampu:
1. Mampu menghubungkan jenis perangkat digital dengan fungsi dan manfaatnya secara logis.
2. Menganalisis manfaat dan risiko penggunaan perangkat digital dalam kehidupan sehari-hari.
3. Menyusun komitmen tindakan yang bijak, aman dan bertanggung jawab dalam menggunakan perangkat digital.`
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: `Perangkat Digital - Alat elektronik yang membantu kita membuat, menyimpan, melihat, atau mengirim informasi.
Internet - Jaringan yang menghubungkan banyak perangkat agar dapat bertukar informasi.
Dunia Digital - Ruang kegiatan yang terjadi melalui perangkat digital dan internet.
Risiko Digital - Kemungkinan masalah saat memakai teknologi, seperti penipuan, komentar jahat, atau lupa waktu.
Data Pribadi - Informasi tentang diri kita yang bisa dipakai untuk mengenali kita, sehingga perlu dijaga, misalnya nama lengkap, alamat, nomor telepon, dan kata sandi.
Jejak Digital - Bekas aktivitas kita di dunia digital, seperti unggahan, komentar, pencarian, atau pesan.
Identitas Digital - Gambaran tentang siapa diri kita di dunia digital, yang terbentuk dari data pribadi dan jejak digital yang kita tinggalkan.
Pengguna Digital Cerdas - Orang yang memakai teknologi dengan aman, sopan, bermanfaat, dan bertanggung jawab.
Nomophobia - Singkatan dari no-mobile-phone phobia. Kondisi kecemasan berlebih ketika seseorang tidak memegang ponsel, kehilangan akses internet, baterai habis, atau tidak dapat memeriksa notifikasi di gawai.

Hak Digital Anak - Hak yang dimiliki setiap anak saat menggunakan internet. Mencakup hak mengakses informasi, hak mendapat perlindungan, hak berpendapat dan berpartisipasi, serta hak menjaga privasi. Memahami hak membuatmu menjadi pengguna digital yang percaya diri.

Tanggung Jawab Digital - Kewajiban yang menyertai setiap hak di dunia digital. Jika kamu ingin dihormati, kamu juga harus menghormati orang lain. Jika kamu ingin privasimu dijaga, kamu juga harus menjaga privasi temanmu. Keseimbangan hak dan tanggung jawab membuat dunia digital nyaman untuk semua.

Resiliensi Digital - Kemampuan untuk tetap tenang dan bangkit kembali saat mengalami hal yang kurang menyenangkan di dunia digital. Bukan berarti tidak boleh membuat kesalahan, tetapi tahu cara belajar dari kesalahan itu dan menjadi lebih kuat. Seperti belajar bersepeda—jatuh itu wajar, yang penting bangkit lagi!`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: `Peta perjalanan belajarmu:
Tahap 1: Bersiap belajar dari cerita Raka dan perangkat digital di sekitar kita.
Tahap 2: Menjawab tantangan awal untuk melihat pengetahuan awalmu.
Tahap 3: Belajar mengenal perangkat digital, hak dan tanggung jawab, internet, manfaat, dan risikonya.
Tahap 4: Berlatih memahami materi melalui diskusi dan pertanyaan.
Tahap 5: Mengerjakan uji pemahaman dan refleksi belajar.`
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: `Pernahkah kamu menggunakan HP untuk menonton video pembelajaran? Pernahkah kamu mencari gambar di internet untuk mengerjakan tugas sekolah? Atau pernahkah kamu mengirim pesan kepada teman melalui WhatsApp?

Saat ini, teknologi digital sudah sangat dekat dengan kehidupan kita. Kita dapat menggunakannya untuk belajar, bermain, berkomunikasi, mencari informasi, dan membuat karya. Namun, apakah semua kegiatan digital selalu baik? Apa yang terjadi jika HP atau Chromebook digunakan tidak sesuai tujuan?`,
      comics: [
        "/komik_halaman_1.png",
        "/komik_halaman_2.png"
      ],
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Apa masalah yang terjadi pada cerita di atas?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa Raka hampir tidak menggunakan perangkat sesuai tujuan?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Menurutmu, mengapa kita perlu mengikuti aturan saat menggunakan perangkat digital di kelas?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Yuk, uji dulu seberapa banyak yang sudah kamu tahu tentang perangkat digital dan cara menggunakannya dengan benar!",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Perangkat digital biasanya digunakan untuk....",
          options: [
            {
              id: "a",
              text: "Belajar, berkomunikasi, mencari informasi, dan membuat karya",
              isCorrect: true
            },
            {
              id: "b",
              text: "Menyimpan semua rahasia teman tanpa izin",
              isCorrect: false
            },
            {
              id: "c",
              text: "Membuat orang lain sulit belajar",
              isCorrect: false
            },
            {
              id: "d",
              text: "Mengganti semua kegiatan tanpa aturan",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Perangkat digital dapat membantu banyak kegiatan positif jika digunakan dengan tujuan yang tepat."
        },
        {
          id: qid(),
          type: "mc",
          question: "Saat memakai Chromebook di kelas, sikap yang paling tepat adalah....",
          options: [
            {
              id: "a",
              text: "Membuka apa saja yang menarik perhatian",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengikuti arahan guru dan memakai perangkat untuk belajar",
              isCorrect: true
            },
            {
              id: "c",
              text: "Membagikan kata sandi ke teman agar cepat masuk",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menekan tombol tanpa tahu fungsinya",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Di kelas, perangkat digital dipakai untuk membantu proses belajar dengan arahan guru."
        },
        {
          id: qid(),
          type: "mc",
          question: "Contoh data pribadi yang perlu dijaga adalah....",
          options: [
            {
              id: "a",
              text: "Warna favorit",
              isCorrect: false
            },
            {
              id: "b",
              text: "Nama permainan kesukaan",
              isCorrect: false
            },
            {
              id: "c",
              text: "Alamat rumah dan kata sandi",
              isCorrect: true
            },
            {
              id: "d",
              text: "Judul buku yang sedang dibaca",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Alamat rumah dan kata sandi termasuk informasi pribadi yang tidak boleh dibagikan sembarangan."
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## Mengenal Dunia Digital di Sekitarku

### A. Ayo, Mengamati Benda di Sekitarmu!
Coba putar kepalamu dan lihat benda-benda di sekitarmu saat ini. Apakah kamu melihat gawai seperti handphone (HP), komputer, laptop, Chromebook, televisi pintar (Smart TV), jam tangan digital (smartwatch), kamera, atau proyektor?
Benda-benda tersebut sangat akrab dengan kehidupan kita sehari-hari. Ada yang dipakai untuk belajar daring, menonton video animasi, mengetik tugas sekolah, mencari informasi tentang tata surya, memotret kucing peliharaan, atau mengirim pesan suara kepada kakek dan nenek. Benda-benda canggih ini disebut perangkat digital.

![Aktivitas Mengamati Perangkat Digital](/perangkat_digital_kelas.png)

**Apa itu perangkat digital?**
Perangkat digital adalah alat yang dapat mengolah, menyimpan, menampilkan, atau mengirim informasi dalam bentuk kode-kode digital. Beberapa perangkat digital ini punya kekuatan super karena dapat terhubung ke internet, seperti HP, laptop, Chromebook, dan komputer.
Perangkat digital membantu kita mengolah informasi berupa tulisan, gambar, suara, video, angka, atau pesan.
Contohnya: Saat kamu menonton video eksperimen sains di gawai, layarnya menampilkan gabungan gambar dan suara. Saat kamu mengetik cerita di Chromebook, tulisanmu langsung tersimpan secara otomatis dalam bentuk digital (tanpa menggunakan kertas). Saat kamu mengirim stiker lucu kepada teman, pesan itu melesat melalui jaringan udara hingga sampai ke layar HP temanmu dalam hitungan detik!

Nah, ketika kita menggunakan perangkat digital untuk belajar, berkomunikasi, mencari informasi, bermain game, atau membuat poster, itu artinya kita sedang masuk dan hidup di dalam Dunia Digital.
Dunia digital memang sangat seru dan bermanfaat seperti kantong ajaib Doraemon! Namun, kita tetap perlu menggunakannya dengan hati-hati. Kita harus tahu kapan waktunya menggunakan perangkat, untuk apa perangkat itu digunakan, dan bagaimana menggunakannya dengan bijak agar tidak merugikan diri sendiri.

### B. Hak dan Tanggung Jawabmu di Dunia Digital

Saat kamu masuk ke dunia digital, kamu memiliki **hak**—hal-hal yang boleh dan seharusnya kamu dapatkan. Tapi ingat, setiap hak selalu datang bersama **tanggung jawab**. Seperti dua sisi mata uang, hak dan tanggung jawab tidak bisa dipisahkan. Yuk, kita kenali!

**Hakmu di Dunia Digital:**

| Hakmu | Artinya |
|---|---|
| **Hak Mengakses Informasi** | Kamu berhak mencari dan mendapatkan informasi yang bermanfaat untuk belajar dan bermain. |
| **Hak Mendapat Perlindungan** | Kamu berhak merasa aman saat menjelajah internet. Tidak boleh ada yang mengganggu, menipu, atau menyakitimu. |
| **Hak Berpendapat dan Berpartisipasi** | Kamu berhak menyampaikan pendapat, berkreasi, dan ikut serta dalam kegiatan positif di dunia digital. |
| **Hak Menjaga Privasi** | Kamu berhak menjaga rahasia pribadimu. Hanya kamu yang boleh memutuskan informasi apa yang boleh dibagikan. |

**Tanggung Jawabmu di Dunia Digital:**

| Tanggung Jawabmu | Artinya |
|---|---|
| **Menghormati Orang Lain** | Jika kamu ingin dihormati, kamu juga harus menghormati orang lain. Jangan mengejek, menghina, atau menyakiti perasaan teman di internet. |
| **Menjaga Keamanan Diri Sendiri dan Orang Lain** | Jika kamu ingin privasimu dijaga, kamu juga harus menjaga privasi temanmu. Jangan sebarkan foto atau data pribadi orang lain tanpa izin. |
| **Berpikir Sebelum Bertindak** | Setiap komentar, unggahan, atau kirimanmu akan menjadi jejak digital. Pikirkan baik-baik sebelum menekan tombol "kirim"! |
| **Berani Melapor** | Jika kamu melihat atau mengalami sesuatu yang tidak baik di internet, laporkan kepada guru atau orang tua. Melapor bukan berarti mengadu—itu artinya kamu melindungi diri sendiri dan teman-temanmu. |

**Keseimbangan hak dan tanggung jawab inilah yang membuat dunia digital menjadi tempat yang nyaman, aman, dan menyenangkan untuk semua orang.**

### C. Rahasia di Balik Layar: Apa Itu Internet?
Pasti kamu pernah membuka YouTube atau mencari sesuatu di Google, kan? Ketika kamu mengetik satu kata kunci, tiba-tiba muncul jutaan informasi. Pernahkah kamu berpikir, "Dari mana datangnya semua tulisan dan video itu? Bagaimana informasi itu bisa sampai ke layar layarku?"
Jawabannya adalah Internet.
Internet dapat dibayangkan seperti jalan tol tak kasat mata yang sangat luas dan saling menyambung di seluruh dunia. Jalan tol ini tidak dilewati oleh mobil, melainkan dilewati oleh data dan informasi yang menghubungkan miliaran perangkat.

![Bagaimana Internet Bekerja](/cara_kerja_internet.png)

Saat kamu mencari informasi, perangkatmu bertugas seperti Pak Pos. Ia mengirimkan "surat permintaan" melalui jaringan internet. Permintaan itu melaju sangat cepat menuju tempat penyimpanan informasi raksasa (disebut Server). Setelah informasinya ditemukan, internet mengirimkannya kembali ke perangkatmu. Semua proses ini terjadi hanya dalam kedipan mata!
Misalnya: Kamu mengetik, “Cara membuat pesawat kertas yang bisa terbang jauh”. Perangkatmu mengirim permintaan melalui jalan tol internet. Lalu, internet mencari dan mengumpulkan video atau artikel yang paling cocok. Wuuush! Hasilnya langsung muncul di layarmu. Jadi, internet bukan sihir, ya! Internet adalah kehebatan teknologi jaringan.

Begini cara sederhana internet bekerja:
1. Kamu menyalakan perangkat digital (HP/Laptop).
2. Perangkatmu terhubung dengan Wi-Fi atau data seluler (membuka pintu tol internet).
3. Kamu membuka aplikasi browser (seperti Google Chrome).
4. Kamu mengetik kata kunci atau menekan sebuah tautan (link).
5. Internet melesat membawa permintaanmu ke server.
6. Informasi yang kamu minta dikirim kembali dan muncul di layarmu.

 Penting Diingat: Karena internet itu jalanan umum yang bebas dilewati siapa saja, tidak semua informasi di internet pasti benar, aman, atau cocok untuk anak-anak. Karena itu, kamu harus menjadi penjelajah internet yang cerdas!

### D. Dua Sisi Koin: Manfaat dan Risiko Dunia Digital
Dunia digital itu ibarat sebuah pisau. Di tangan yang tepat, pisau bisa digunakan untuk memotong buah dan memasak makanan lezat. Tapi jika digunakan sembarangan, pisau bisa melukai jarimu.
Begitu juga dengan dunia digital. Pengguna digital yang hebat bukan hanya mereka yang jago main game atau cepat mengetik. Pengguna digital yang cerdas adalah mereka yang tahu cara memanfaatkan teknologi dengan aman, sopan, dan bertanggung jawab.

#### 1. Manfaat Dunia Digital
Dunia digital membuka jendela dunia. Ini dia berbagai manfaat luar biasa yang bisa kita dapatkan:

![Manfaat Dunia Digital di Sekitar Kita](/manfaat_digital.png)

| Manfaat Dunia Digital | Contoh Kegiatan Seru |
|---|---|
| Membantu Belajar | Menonton video pelajaran matematika yang sulit, membaca ensiklopedia digital, atau berlatih bahasa asing menggunakan aplikasi. |
| Menjelajah Dunia (Virtual) | Mengunjungi museum luar negeri atau melihat permukaan planet Mars melalui Google Earth tanpa harus keluar kamar! |
| Membantu Mencari Informasi | Mencari resep masakan untuk membantu Ibu, atau mencari tahu "Mengapa langit berwarna biru?" |
| Membantu Berkomunikasi | Melakukan video call (panggilan video) dengan keluarga yang tinggal di luar kota, atau mengirim pesan ke guru. |
| Membantu Membuat Karya | Mendesain poster kemerdekaan, menggambar ilustrasi digital, atau membuat slide presentasi yang keren. |
| Membantu Bekerja Sama | Berdiskusi tugas kelompok dengan teman melalui dokumen online (seperti Google Docs) dari rumah masing-masing. |
| Hiburan yang Sehat | Bermain game edukasi untuk mengasah otak atau mendengarkan musik santai. |

Teknologi digital akan sangat bermanfaat jika digunakan sesuai tujuan. Saat waktunya belajar, gunakan perangkat untuk belajar. Saat waktunya tidur, matikan perangkat agar tubuh dan matamu bisa beristirahat total.

#### 2. Risiko Dunia Digital
Meskipun menyenangkan, dunia maya punya lubang-lubang jebakan (risiko). Kita tidak perlu takut, kita hanya perlu mengenalinya agar tidak terperosok!

![Risiko dan Bahaya Dunia Digital](/risiko_digital_safety.png)

| Risiko Digital | Contoh Kejadian | Sikap Pengguna Cerdas (Penjelajah Hebat) |
|---|---|---|
| Penyebaran Data Pribadi | Tiba-tiba ada situs web game yang memintamu mengisi nama lengkap, alamat rumah, atau password sekolah. | Tutup halamannya! Jangan pernah membagikan data pribadimu kepada situs atau orang tak dikenal. |
| Tautan Penipuan (Phishing) | Mendapat pesan WhatsApp berbunyi: "Selamat! Kamu menang hadiah iPhone 15! Klik link ini sekarang!" | Abaikan dan Hapus! Tidak asal klik tautan mencurigakan karena bisa merusak perangkat atau mencuri data. |
| Konten Tidak Sesuai Usia | Di media sosial (TikTok, Reels, Shorts), tiba-tiba muncul video berisi kekerasan, kata kotor, tantangan berbahaya (challenge), atau hal menakutkan lainnya yang tidak pantas untuk usiamu. | Segera tutup aplikasinya! Jangan ditonton, jangan disukai (like), jangan ditiru, dan ceritakan kepada orang tua atau orang dewasa yang kamu percaya. |
| Komentar Jahat (Cyberbullying) | Melihat teman diejek di grup kelas, atau kamu terpancing menulis kata-kata kasar karena marah di game. | Tarik napas panjang. Gunakan selalu bahasa yang sopan. Jika melihat buli, jadilah pembela atau laporkan pada guru. |
| Informasi Palsu (Hoaks) | Membaca pesan "Besok kiamat karena ada meteor jatuh!" di media sosial. | Jangan langsung percaya! Cek kebenarannya dari sumber resmi atau tanyakan kepada orang dewasa. |
| Kesehatan Fisik (Mata & Tubuh) | Menatap layar HP atau laptop tanpa henti selama 3 jam sampai mata merah, perih, dan leher pegal. | Terapkan rumus 20-20-20! (Setiap 20 menit, tatap benda sejauh 20 kaki/6 meter, selama 20 detik). Batasi waktu bermain. |
| Mengambil Karya Orang Lain | Mengunduh hasil gambar orang dari Google, lalu mengakuinya sebagai hasil gambarmu sendiri. | Selalu jujur! Cantumkan nama sumber jika memakai gambar orang lain, atau belajarlah membuat karyamu sendiri. |
| Lupa Waktu & Kewajiban | Asyik membuka game saat guru sedang menerangkan, atau lupa mengerjakan PR karena menonton YouTube. | Disiplin waktu. Kembali fokus to tugas utama. Ingat pepatah: Bermain ada waktunya, belajar ada waktunya! |

Risiko digital dapat muncul kapan saja: saat kita belajar, bermain, menonton video, atau membuka pesan. Karena itu, ingatlah kunci ini: Berhenti dan berpikir sejenak sebelum kamu menekan layar (klik) atau mengirim sesuatu di internet.

### E. Batasan Usia dan Durasi Layar yang Sehat

Tahukah kamu bahwa pemerintah Indonesia mengatur batasan usia anak dalam mengakses internet dan media sosial? Hal ini tertuang dalam **Peraturan Pemerintah (PP) Nomor 17 Tahun 2025 tentang Tata Kelola Penyelenggaraan Sistem Elektronik dalam Pelindungan Anak (PP TUNAS)**.

Berdasarkan aturan tersebut, anak dikelompokkan sebagai berikut:
1. **Di bawah 13 tahun (seperti kamu sekarang!)**: Hanya diperbolehkan memiliki akun pada produk dan layanan digital berisiko rendah yang dirancang khusus untuk anak-anak, dan wajib didampingi serta mendapatkan izin dari orang tua atau wali.
2. **13 hingga 15 tahun**: Dapat mengakses layanan digital dengan risiko sedang, namun tetap memerlukan persetujuan dari orang tua.
3. **16 hingga 17 tahun**: Diizinkan mengakses layanan digital dengan risiko tinggi (seperti media sosial umum), asalkan telah mendapatkan persetujuan dari orang tua.

Sebagai Penyelenggara Sistem Elektronik (PSE), aplikasi atau situs web wajib memverifikasi usia penggunanya agar anak-anak tidak salah masuk ke ruang digital yang berbahaya!

Selain batasan usia, durasi menatap layar (*screentime*) juga sangat penting untuk dijaga. Rata-rata orang Indonesia menghabiskan **5,7 jam per hari** di internet (salah satu yang terlama di dunia!). Padahal, rekomendasi durasi layar sehat menurut para ahli kesehatan adalah:

| Usia Anak | Rekomendasi Durasi Penggunaan Perangkat |
|---|---|
| **Di bawah 1 tahun** | Tidak direkomendasikan sama sekali (kecuali panggilan video singkat bersama keluarga). |
| **1 - 2 tahun** | Tidak lebih dari 1 jam per hari (lebih sedikit lebih baik). |
| **2 - 5 tahun** | Maksimal 1 jam per hari, fokus pada konten berkualitas dan interaksi bersama orang tua. |
| **5 - 10 tahun** | Maksimal 2 jam per hari (di luar tugas sekolah), tanpa mengganggu tidur dan belajar. |
| **10 - 17 tahun** | Maksimal 2 jam per hari (di luar tugas sekolah) agar kesehatan fisik dan interaksi sosial tetap terjaga. |

Jika kamu terus-menerus menatap layar HP hingga gelisah saat ponsel jauh dari jangkauan, takut tertinggal informasi (FOMO), dan sulit fokus tanpa gawai, hati-hati! Kamu mungkin sedang mengalami **Nomophobia**. Yuk, atur waktu bermain gawai secara seimbang!

Dari berbagai manfaat dan risiko di atas, pengalaman apa yang paling sering kamu temui saat menggunakan internet sehari-hari?`
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `### Studi Kasus: Komitmen Digital Raka dan Sisi
Raka sangat senang bermain game online di HP barunya. Suatu hari, saat sedang seru bermain, muncul notifikasi pesan dari orang asing yang menawarkan koin game gratis. Orang tersebut meminta Raka mengirimkan foto rapor sekolah dan nomor WhatsApp orang tuanya sebagai syarat. Raka ragu-ragu dan bingung.

Di sisi lain, Sisi selalu membuat jadwal kapan ia boleh bermain gawai dan kapan harus belajar, serta tidak pernah memberikan informasi pribadinya kepada siapa pun di internet. Sisi tahu bahwa menjaga rahasia data pribadi adalah hak sekaligus tanggung jawab penting untuk melindunginya di dunia digital.`,
      questions: [
        {
          id: qid(),
          type: "essay",
          question: "Apa yang sebaiknya dilakukan Raka saat dimintai data pribadi (foto rapor dan nomor WA orang tua) oleh orang asing di game online?",
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Tuliskan perbedaan utama antara kebiasaan digital Raka dan kebiasaan digital Sisi.",
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Mengapa menjaga komitmen waktu bermain gawai sangat penting untuk kesehatan fisik dan belajarmu?",
          points: 10
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Penjelajah Identitas Digital Cerdas

Dalam simulasi ini, kamu akan diajak melatih kemampuan menjaga data pribadi dan privasimu di internet.

Kamu akan:
1. Menghadapi situasi interaktif saat membuat akun dan menjelajah web.
2. Memilah informasi mana yang aman dibagikan (publik) dan mana yang rahasia (privasi).
3. Menemukan pentingnya perlindungan data pribadi dan konsekuensi jejak digitalmu.
4. Mendapatkan lencana Penjelajah Digital jika berhasil menyelesaikan simulasi!`,
      simulationId: "identitas-digital"
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Setelah mempelajari materi Peta Dunia Digital dan cara kerja internet, jawablah pertanyaan diskusi berikut untuk menguji pemahamanmu:",
      questions: [
        {
          id: qid(),
          type: "essay",
          question: "Aktivitas digital apa yang paling sering kamu lakukan?",
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Apakah aktivitas itu lebih banyak untuk belajar, hiburan, atau berkomunikasi?",
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Apakah kamu sudah menggunakan perangkat digital sesuai tujuan?",
          points: 10
        }
      ]
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Jawab pertanyaan berikut untuk mengecek pemahamanmu tentang perangkat digital, internet, manfaat, risiko, dan sikap pengguna digital cerdas.",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Perangkat digital adalah ....",
          options: [
            {
              id: "a",
              text: "Alat elektronik yang hanya dapat digunakan jika tersambung internet",
              isCorrect: false
            },
            {
              id: "b",
              text: "Alat elektronik yang dapat mengolah, menyimpan, menampilkan, atau mengirim informasi",
              isCorrect: true
            },
            {
              id: "c",
              text: "Alat elektronik yang hanya digunakan untuk bermain dan menonton video",
              isCorrect: false
            },
            {
              id: "d",
              text: "Alat elektronik yang hanya dapat menerima informasi tanpa menyimpannya",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Perangkat digital dapat mengolah, menyimpan, menampilkan, atau mengirim informasi."
        },
        {
          id: qid(),
          type: "mc",
          question: "Internet membantu kita untuk ....",
          options: [
            {
              id: "a",
              text: "Menyimpan semua informasi secara langsung di dalam perangkat",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menampilkan informasi tanpa melalui aplikasi atau situs",
              isCorrect: false
            },
            {
              id: "c",
              text: "Menghubungkan perangkat agar dapat bertukar informasi",
              isCorrect: true
            },
            {
              id: "d",
              text: "Mengirim informasi tanpa perlu terhubung dengan jaringan",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Internet membantu perangkat saling terhubung agar dapat bertukar informasi."
        },
        {
          id: qid(),
          type: "mc",
          question: "Salah satu manfaat dunia digital adalah ....",
          options: [
            {
              id: "a",
              text: "Membantu belajar, mencari informasi, dan membuat karya yang bermanfaat",
              isCorrect: true
            },
            {
              id: "b",
              text: "Membuat tugas sekolah selesai tanpa perlu memahami isinya",
              isCorrect: false
            },
            {
              id: "c",
              text: "Membuat kita bisa memakai perangkat lebih lama tanpa beristirahat",
              isCorrect: false
            },
            {
              id: "d",
              text: "Membuat semua informasi yang muncul terlihat sama pentingnya",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Dunia digital dapat mendukung kegiatan belajar jika digunakan dengan bijak."
        },
        {
          id: qid(),
          type: "mc",
          question: "Risiko dunia digital yang berkaitan dengan data pribadi adalah ....",
          options: [
            {
              id: "a",
              text: "tugas menjadi sulit ditemukan jika file tidak diberi nama dengan jelas",
              isCorrect: false
            },
            {
              id: "b",
              text: "Data pribadi dapat tersebar jika dibagikan sembarangan",
              isCorrect: true
            },
            {
              id: "c",
              text: "mata terasa lelah jika melihat layar terlalu lama tanpa jeda",
              isCorrect: false
            },
            {
              id: "d",
              text: "baterai perangkat cepat habis ketika dipakai terus-menerus",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Data pribadi perlu dijaga karena bisa disalahgunakan jika tersebar ke orang yang tidak tepat."
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa kita perlu berpikir sebelum mengirim komentar?",
          options: [
            {
              id: "a",
              text: "Karena komentar yang singkat selalu lebih mudah dipahami",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena komentar yang ramai biasanya lebih cepat dibalas",
              isCorrect: false
            },
            {
              id: "c",
              text: "Karena komentar perlu terlihat menarik agar mendapat banyak suka",
              isCorrect: false
            },
            {
              id: "d",
              text: "Karena komentar dapat memengaruhi perasaan orang lain dan menjadi jejak digital",
              isCorrect: true
            }
          ],
          points: 10,
          explanation: "Komentar di dunia digital tetap bisa memengaruhi perasaan orang lain, jadi perlu dipikirkan sebelum dikirim."
        },
        {
          id: qid(),
          type: "mc",
          question: "Saat mata terasa lelah karena terlalu lama melihat layar, sebaiknya kita ....",
          options: [
            {
              id: "a",
              text: "Beristirahat sejenak dari layar",
              isCorrect: true
            },
            {
              id: "b",
              text: "mengganti aplikasi agar mata melihat tampilan yang berbeda",
              isCorrect: false
            },
            {
              id: "c",
              text: "menaikkan kecerahan layar supaya tulisan terlihat lebih jelas",
              isCorrect: false
            },
            {
              id: "d",
              text: "melanjutkan sebentar lagi karena rasa lelah biasanya hilang sendiri",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Istirahat membantu menjaga kesehatan mata dan tubuh saat memakai perangkat digital."
        },
        {
          id: qid(),
          type: "mc",
          question: "Contoh pengguna digital cerdas adalah ....",
          options: [
            {
              id: "a",
              text: "membuka tautan yang terlihat penting lalu memeriksanya setelah selesai",
              isCorrect: false
            },
            {
              id: "b",
              text: "menggunakan teknologi untuk belajar, berkarya, dan tetap menjaga keamanan",
              isCorrect: true
            },
            {
              id: "c",
              text: "membagikan nama lengkap agar teman lebih mudah mengenali akun kita",
              isCorrect: false
            },
            {
              id: "d",
              text: "menulis komentar segera agar percakapan digital terasa lebih hidup",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Pengguna digital cerdas memakai teknologi untuk hal bermanfaat dan tetap menjaga keamanan serta etika."
        },
        {
          id: qid(),
          type: "mc",
          question: "Jika kamu ragu terhadap sesuatu yang muncul di internet, kamu sebaiknya ....",
          options: [
            {
              id: "a",
              text: "menyimpannya dulu agar bisa dipikirkan sendiri nanti",
              isCorrect: false
            },
            {
              id: "b",
              text: "mengirimkannya ke teman agar banyak orang ikut menilai",
              isCorrect: false
            },
            {
              id: "c",
              text: "Bertanya kepada guru atau orang tua",
              isCorrect: true
            },
            {
              id: "d",
              text: "membuka tautan sebentar tanpa mengisi data pribadi",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Bertanya kepada orang dewasa tepercaya membantu kita mengambil keputusan yang lebih aman."
        },
        {
          id: qid(),
          type: "mc",
          question: "Sikap cerdas saat mendapat tautan hadiah gratis yang tidak jelas adalah ....",
          options: [
            {
              id: "a",
              text: "membuka tautan itu di perangkat lain agar perangkat utama tetap aman",
              isCorrect: false
            },
            {
              id: "b",
              text: "mengirim tautan itu ke teman yang lebih paham teknologi",
              isCorrect: false
            },
            {
              id: "c",
              text: "membaca halaman hadiahnya dulu sebelum memutuskan mengisi data",
              isCorrect: false
            },
            {
              id: "d",
              text: "Tidak asal klik dan memeriksa sumbernya terlebih dahulu",
              isCorrect: true
            }
          ],
          points: 10,
          explanation: "Tautan yang tidak jelas bisa berbahaya, jadi kita perlu mengecek sumbernya dulu."
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa kita perlu membedakan manfaat dan risiko dunia digital?",
          options: [
            {
              id: "a",
              text: "Agar kita dapat menggunakan teknologi dengan aman dan sesuai tujuan",
              isCorrect: true
            },
            {
              id: "b",
              text: "Agar kita dapat memilih aplikasi yang paling seru untuk dipakai lebih lama",
              isCorrect: false
            },
            {
              id: "c",
              text: "Agar kita tahu kapan boleh mengabaikan aturan karena sedang belajar",
              isCorrect: false
            },
            {
              id: "d",
              text: "Agar kita bisa mencoba semua fitur digital sebelum meminta bantuan",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "Dengan memahami manfaat dan risiko, kita dapat memakai teknologi dengan aman dan sesuai tujuan."
        },
        {
          id: qid(),
          type: "mc",
          question: "Menurut Peraturan Pemerintah (PP) Nomor 17 Tahun 2025 (PP TUNAS), anak berusia di bawah 13 tahun hanya boleh memiliki akun digital apabila....",
          options: [
            {
              id: "a",
              text: "Layanan tersebut berisiko rendah khusus anak-anak dan telah mendapatkan izin orang tua",
              isCorrect: true
            },
            {
              id: "b",
              text: "Akun tersebut digunakan secara rahasia tanpa sepengetahuan orang dewasa",
              isCorrect: false
            },
            {
              id: "c",
              text: "Perangkat yang digunakan adalah milik pribadi yang dibeli sendiri",
              isCorrect: false
            },
            {
              id: "d",
              text: "Siswa sudah bisa mengetik dengan cepat dan bermain game online",
              isCorrect: false
            }
          ],
          points: 10,
          explanation: "PP TUNAS menetapkan bahwa anak di bawah 13 tahun hanya boleh menggunakan produk/layanan digital berisiko rendah yang ramah anak, dan wajib disertai izin/pendampingan orang tua."
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar mengenal dunia digital. Sekarang, berhentilah sejenak dan pikirkan kebiasaanmu. Jawablah dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Untuk apa kamu paling sering menggunakan HP atau perangkat digital?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apakah kamu pernah membuka aplikasi lain saat seharusnya belajar?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apa akibatnya jika kita menggunakan perangkat digital tidak sesuai tujuan?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apa kebiasaan baik yang ingin kamu mulai hari ini?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Siapa yang akan kamu tanyai jika menemukan hal aneh di internet?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 2 – Benar atau Meragukan? Yuk, Cek Dulu!
 ═══════════════════════════════════════════════ */
const topic2: Topic = {
  id: "topik-2",
  number: 2,
  title: "Benar atau Meragukan? Yuk, Cek Dulu!",
  description: "Belajar membedakan informasi benar dan hoaks di internet.",
  icon: "search",
  color: "bg-amber-500",
  backgroundImageUrl: "/gambar/Topik%202/Cover_Topik_2.png",
  badgeId: "badge-detektif-fakta",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari topik ini, kamu diharapkan mampu:
1. Menganalisis informasi yang diterima untuk mendeteksi apakah informasi tersebut valid atau meragukan dengan baik.
2. Mengevaluasi kredibilitas sebuah informasi atau portal berita berdasarkan kriteria kelayakan (kejelasan sumber, tanggal, kesesuaian judul dengan isi, ketersediaan bukti, dan penggunaan gaya bahasa) dengan benar.
3. Membedakan secara kritis antara fakta, opini dan hoaks pada informasi yang beredar di linimasa media digital dengan tepat.
4. Menentukan tindakan dan keputusan yang tepat ketika menghadapi berita atau informasi yang terindikasi hoaks dengan baik.`
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Informasi** – Pesan, berita, gambar, video, atau data yang kita terima dari orang lain maupun internet.

 **Sumber Informasi** – Tempat asal suatu informasi, misalnya guru, sekolah, situs resmi, media berita, atau pesan di grup chat.

 **Fakta** – Informasi yang dapat dibuktikan kebenarannya dengan data, bukti, atau sumber tepercaya.

 **Hoaks** – Informasi palsu atau menyesatkan yang sengaja disebarkan di dunia digital sehingga bisa membuat orang salah paham, panik, atau tertipu.

 **Cek Fakta** – Kegiatan memeriksa kebenaran informasi dengan melihat sumber, tanggal, bukti, dan membandingkan dengan sumber lain.

 **Bijak Membagikan Informasi** – Sikap berhenti sejenak, memeriksa, dan bertanya kepada orang dewasa sebelum meneruskan informasi yang meragukan.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita Raka dan pesan berantai di grup kelas.
 Tahap 2: Menjawab tantangan awal – Seberapa jeli matamu?
 Tahap 3: Belajar mengenal hoaks dan cara mengecek fakta.
 Tahap 4: Mengamati informasi – Benar atau meragukan?
 Tahap 5: Aktivitas Detektif Informasi – Menganalisis portal berita.
 Tahap 6: Bereksplorasi dalam simulasi Detektif Fakta.
 Tahap 7: Uji pemahaman akhir dan refleksi.

Ayo jadi detektif yang cerdas! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Jawab pertanyaan pemantik berikut berdasarkan cerita di bawah.",
      passage: `**Pesan di Grup Kelas**

Pagi itu, Raka sedang bersiap-siap untuk pergi ke sekolah. Ia sudah memakai seragam dan sedang memasukkan buku ke dalam tas. Tiba-tiba, HP Raka berbunyi.

Raka membuka pesan yang masuk. Pesan itu berbunyi:
*"Besok semua murid tidak perlu masuk sekolah karena akan ada hujan besar. Sebarkan cepat ke semua teman!"*

Raka terkejut membaca pesan itu. Ia hampir saja meneruskan pesan tersebut ke teman-temannya. Namun, sebelum membagikannya, Raka membaca isi pesan itu sekali lagi.

Ia mulai merasa ragu. Di dalam pesan itu tidak ada nama sekolah, tidak ada pengumuman dari wali kelas, dan tidak ada surat resmi. Pesan itu hanya berisi perintah agar segera disebarkan.

Akhirnya, Raka mengirim pesan ke grup kelas untuk memastikan kebenaran informasi tersebut.
*"Teman-teman, aku dapat pesan seperti ini. Apakah besok benar tidak masuk sekolah?"* tanya Raka di grup kelas.

Beberapa teman Raka ikut membaca pesan itu. Mereka juga merasa ragu. Naya pun menulis balasan.
*"Raka, tunggu dulu. Dari mana sumber pesannya? Apakah pesan itu dari wali kelas atau dari sekolah?"* tanya Naya.

Tidak lama kemudian, Digi, robot kecil teman belajar mereka, ikut membantu. Digi berkata,
*"Raka, informasi yang belum jelas jangan langsung dipercaya. Sebelum membagikan pesan, kita perlu mengecek sumber, tanggal, dan isi informasinya terlebih dahulu."*

Raka pun tidak jadi menyebarkan pesan itu. Ia memilih memeriksa kebenaran informasi kepada wali kelas. Setelah ditanyakan, ternyata sekolah tetap masuk seperti biasa. Pesan tentang libur karena hujan besar itu tidak benar.

Raka merasa lega karena belum menyebarkan pesan tersebut. Ia belajar bahwa tidak semua informasi di grup chat boleh langsung dipercaya. Mulai hari itu, Raka berjanji akan mengecek kebenaran informasi sebelum membagikannya kepada orang lain.`,
      mediaType: "image",
      mediaUrl: "/hoax_message_illustration.png",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Apa masalah yang terjadi pada cerita di atas?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa Raka hampir membagikan pesan itu?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa Naya merasa ragu?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apa yang sebaiknya dilakukan sebelum membagikan informasi?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Coba jawab pertanyaan berikut berdasarkan pengetahuanmu saat ini:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Apa itu hoaks?",
          options: [
            {
              id: "a",
              text: "Berita yang selalu benar",
              isCorrect: false
            },
            {
              id: "b",
              text: "Informasi palsu yang sengaja disebarkan untuk menipu",
              isCorrect: true
            },
            {
              id: "c",
              text: "Iklan di televisi",
              isCorrect: false
            },
            {
              id: "d",
              text: "Pesan dari guru",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Cara terbaik untuk memeriksa kebenaran sebuah berita adalah...",
          options: [
            {
              id: "a",
              text: "Langsung membagikan ke teman",
              isCorrect: false
            },
            {
              id: "b",
              text: "Percaya saja karena banyak yang membagikan",
              isCorrect: false
            },
            {
              id: "c",
              text: "Mengecek dari beberapa sumber terpercaya",
              isCorrect: true
            },
            {
              id: "d",
              text: "Melihat apakah judulnya menarik",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `Setiap hari, kita pasti memegang HP, menonton televisi, atau membaca pesan dari teman. Dari benda-benda itu, kita menerima banyak sekali informasi.

Informasi sangat membantu kita belajar. Kita jadi tahu jadwal pelajaran besok, cara membuat kerajinan tangan, atau berita terbaru. Tapi, tahukah kamu? Tidak semua tulisan atau video yang ada di internet itu benar, lho!

Seiring canggihnya teknologi, informasi gampang sekali dibuat dan disebarkan. Ada informasi yang benar, ada yang hanya pendapat seseorang, dan ada juga yang sengaja dibuat untuk menipu kita.

Yuk, kita belajar agar kamu bisa membedakan informasi yang benar (fakta) dengan informasi yang salah atau hoaks (misinformasi).

### Misteri "Hujan Permen" di Kota Pelangi

Suatu sore, sebuah pesan berantai masuk ke grup WhatsApp warga Kota Pelangi. Pesan itu ditulis dengan huruf kapital semua dan disertai banyak tanda seru. Bunyinya seperti ini:

"PENGUMUMAN PENTING!!! Besok pagi pukul 08.00 WIB, helikopter dari pabrik permen terbesar di dunia akan membagikan 1 ton permen cokelat dari atas langit Kota Pelangi! Siapkan ember dan payung terbalik kalian! Jangan lupa sebarkan pesan ini ke 20 orang temanmu agar helikopternya jadi datang!!!"

Membaca pesan itu, banyak anak di Kota Pelangi menjadi sangat girang. Budi langsung menyiapkan dua ember besar. Siska sibuk mencari payung terbaliknya. Mereka bahkan meneruskan pesan itu ke grup keluarga, grup tempat les, dan grup bermain mereka.

Keesokan paginya, Budi, Siska, dan anak-anak lain sudah berdiri di lapangan dengan ember mereka. Mereka menunggu dari pukul 08.00 pagi sampai pukul 10.00 siang. Apakah yang terjadi? Helikopter itu tidak pernah datang. Jangankan hujan permen, yang turun dari langit malah rintik air hujan sungguhan yang membuat mereka basah kuyup.

Budi pulang dengan wajah cemberut. Ibunya tersenyum dan berkata, "Budi, sebelum menyiapkan ember, apakah kamu sudah mengecek siapa yang mengirim pesan itu? Apakah ada berita resminya di televisi? Itu namanya hoaks, Nak." Budi pun menyesal karena langsung percaya pada pesan yang tidak jelas asalnya.

### A. Informasi Ada di Sekitar Kita

Dari cerita Budi, kita belajar satu pelajaran penting: **Jangan mudah terpancing!**

Setiap hari, kita menerima banyak sekali informasi. Informasi itu bisa kita temukan di buku, televisi, radio, papan pengumuman, internet, media sosial, video, atau pesan dari teman.

Informasi sangat membantu kita! Dengan informasi, kita bisa mengetahui jadwal pelajaran, berita terbaru, cara membuat prakarya, atau langkah-langkah mengerjakan tugas. Informasi membuat kita terus belajar hal-hal baru.

Namun, pertanyaannya: **Apakah semua informasi yang kita temukan selalu benar?**

Seiring berkembangnya teknologi, informasi makin mudah dibuat dan disebarkan dalam bentuk teks, foto, gambar, video, atau audio. Dalam waktu singkat, sebuah pesan bisa menyebar ke ribuan orang. Karena penyebarannya sangat cepat, kita perlu ekstra berhati-hati.

Tidak semua informasi boleh langsung dipercaya. Ada informasi yang benar, ada yang belum jelas, dan ada juga yang keliru atau sengaja dibuat untuk menipu. Coba berhenti sejenak dan pikirkan:
- Siapa yang menyebarkan informasi itu?
- Dari mana sumber informasinya?
- Apakah informasinya lengkap?
- Apakah ada tanggal dan bukti yang jelas?
- Apakah informasi itu berasal dari narasumber yang dapat dipercaya?

Kita tidak cukup hanya membaca judulnya saja, karena kadang judul dibuat heboh agar orang cepat percaya. Kita harus membaca isinya dengan teliti.

### B. Mengenal 3 Jenis Informasi di Internet

Agar kamu tidak tertipu seperti anak-anak di Kota Pelangi, kamu wajib bisa membedakan tiga jenis informasi yang setiap hari berseliweran di internet. Mari kita pelajari perbedaannya dengan saksama.

#### 1. FAKTA (Kenyataan yang Sebenarnya)
Fakta adalah sesuatu yang benar-benar terjadi, ada buktinya yang nyata, dan tidak bisa dibantah oleh siapa pun karena memang begitulah keadaannya. Fakta itu seperti jawaban rumus matematika; tidak peduli kamu suka atau tidak, jawabannya tetap sama.

**Ciri-ciri Fakta:**
- Memiliki data yang jelas dan akurat (ada angka, nama tempat, waktu kejadian).
- Bisa dibuktikan kebenarannya oleh siapa saja yang melihat.
- Biasanya disampaikan oleh pihak yang berwenang.

*Contoh Kalimat Fakta:*
- "Bapak Ir. Soekarno adalah Presiden Pertama Republik Indonesia." (Ini fakta, karena sejarah mencatatnya demikian).
- "Pengumuman: Libur semester ganjil dimulai pada tanggal 18 Desember hingga 2 Januari, berdasarkan surat resmi dari Dinas Pendidikan." (Ini fakta karena sumbernya jelas dan ada tanggalnya).

#### 2. OPINI (Pendapat atau Perasaan Seseorang)
Opini adalah pendapat, gagasan, perasaan, atau pikiran seseorang terhadap suatu hal. Opini belum tentu benar bagi semua orang, karena setiap kepala manusia memiliki kesukaan dan pemikiran yang berbeda-beda. Jika ada orang yang opininya berbeda denganmu, bukan berarti ia berbohong, ia hanya memiliki sudut pandang yang lain.

**Ciri-ciri Opini:**
- Biasanya menggunakan kata-kata seperti: menurutku, rasanya, sepertinya, mungkin, paling enak, kira-kira, atau seharusnya.
- Tidak memiliki bukti angka atau data yang pasti, karena hanya berdasarkan perasaan.

*Contoh Kalimat Opini:*
- "Menurutku, pelajaran Matematika adalah pelajaran yang paling menyenangkan dan mudah di dunia!" (Ini opini. Teman sebangkumu mungkin merasa pelajaran Olahraga yang paling mudah).
- "Kucing adalah hewan peliharaan yang paling lucu dibandingkan anjing." (Ini juga opini, karena pecinta anjing pasti tidak akan setuju).

#### 3. HOAKS (Berita Bohong atau Berita Palsu)
Ini adalah musuh utama para detektif digital! Hoaks adalah informasi palsu, bohong, dan rekayasa yang sengaja dibuat agar terlihat seolah-olah sebagai sebuah kebenaran atau fakta.

Hoaks sangat berbahaya. Bentuknya bisa bermacam-macam, mulai dari cerita karangan, foto yang sudah diedit agar terlihat seram, atau video kejadian di luar negeri yang disebut-sebut terjadi di Indonesia.

**Mengapa orang membuat hoaks?**
Ada yang membuatnya hanya untuk iseng dan bercanda (padahal ini candaan yang sangat buruk), ada yang ingin menipu untuk mendapatkan uang, ada yang ingin membuat orang lain panik ketakutan, dan ada yang ingin membuat kita membenci seseorang.

*Contoh Kasus Hoaks:*
- Sebuah foto menunjukkan jalanan hancur lebur dan diberi keterangan: "Gempa bumi baru saja menghancurkan jalan raya di Jakarta pagi ini! Sebarkan!" Padahal, jika diselidiki, foto tersebut adalah foto jalanan rusak di negara lain yang terjadi 5 tahun yang lalu.

### C. Cara Memeriksa Informasi

Nah, sekarang kamu sudah tahu musuh utamanya. Bagaimana cara melawannya? Jika kamu melihat pesan yang aneh, heboh, atau terlalu bagus untuk menjadi kenyataan (seperti hujan permen), gunakan jurus detektif ini:

#### 1. Periksa Siapa Sumbernya!
Tanya pada dirimu: "Siapa yang menulis dan menyebarkan berita ini?"
Informasi yang benar selalu memiliki sumber yang dapat dipercaya. Jika kamu mendapat berita bahwa sekolah akan diliburkan dari sebuah pesan terusan (forwarded) yang tidak jelas siapa penulis aslinya, kamu harus curiga. Namun, jika berita itu diumumkan langsung oleh Kepala Sekolah di lapangan upacara, maka itu adalah fakta yang bisa dipercaya.

#### 2. Baca Isinya Sampai Tuntas!
Tanya pada dirimu: "Apakah aku sudah membaca seluruh teksnya dari atas sampai bawah?"
Jangan pernah menyebarkan berita hanya dengan membaca judulnya saja! Pembuat hoaks sangat suka membuat judul yang heboh (clickbait) untuk memancing orang marah atau penasaran.
*Contoh:* Judulnya tertulis "Gawat! Siswa SD Kini Dilarang Membawa Bekal ke Sekolah!" Jika kamu hanya baca judulnya, kamu pasti marah. Padahal, jika dibaca sampai baris terakhir, isinya adalah "Siswa dilarang membawa bekal berupa makanan cepat saji (junk food) dan disarankan membawa bekal sayuran sehat." Sangat berbeda, bukan?

#### 3. Periksa Tanggal
Tanya pada dirimu: "Kapan berita ini sebenarnya dibuat?"
Banyak pembuat hoaks yang malas. Mereka sering mendaur ulang berita lama. Misalnya, ada berita badai besar yang memang benar-benar terjadi pada tahun 2018. Namun, video itu disebarkan lagi pada tahun ini dengan tulisan "Awas, badai akan datang siang ini!" Hal ini tentu akan membuat warga panik, padahal cuaca sedang cerah benderang. Perhatikan selalu tanggal terbitnya sebuah berita!

#### 4. Bandingkan dengan Tempat Lain
Tanya pada dirimu: "Apakah koran, berita televisi, atau orang dewasa yang tepercaya juga membicarakan hal ini?"
Seorang detektif tidak pernah hanya menanyai satu orang saksi. Jika kamu mendapat informasi "Telah ditemukan alien di kebun belakang sekolah!", jangan langsung percaya. Coba cari di internet dengan bantuan orang tua, apakah portal berita resmi juga memberitakan hal tersebut? Jika tidak ada satu pun stasiun televisi atau berita resmi yang membahasnya, sudah pasti itu adalah kebohongan.

#### 5. Perhatikan bahasa yang digunakan (Waspadai Bahasa yang Memaksa dan Menakut-nakuti)
Tanya pada dirimu: "Apakah kalimatnya bernada memaksa, mengancam, atau membuatku panik?"
Hoaks paling mudah dikenali dari gaya bahasanya. Pesan hoaks biasanya sangat suka menggunakan banyak tanda seru (!!!!), huruf kapital semua, dan kalimat yang memaksa kita bertindak cepat tanpa berpikir.
Jika kamu melihat kalimat penutup seperti:
- "SEBARKAN KE 10 GRUP ATAU KAMU AKAN SIAL!"
- "VIRALKAN SEBELUM DIHAPUS OLEH PEMERINTAH!"
- "JANGAN BERHENTI DI KAMU! KIRIM KE SEMUA KONTAKMU SEKARANG JUGA!"
Maka abaikan saja! Orang yang menyampaikan fakta kebenaran tidak akan pernah memaksa dan mengancam orang lain untuk menyebarkannya.`,
      mediaType: "image",
      mediaUrl: "/hujan_permen_pelangi.png"
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Perhatikan kelima informasi berikut pada layar gawai dan tentukan apakah informasi tersebut Benar atau Meragukan."
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: "Bandingkan kelima portal berita berikut dan analisislah kebenarannya dengan mengisi Lembar Kerja Detektif Informasi."
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Menjadi Detektif Fakta 

Dalam simulasi ini, kamu akan berperan sebagai **Detektif Fakta** yang bertugas memeriksa berbagai berita dan informasi.

Kamu akan:
1. Membaca berita-berita yang muncul di timeline
2. Menganalisis apakah berita itu **fakta**, **opini**, atau **hoaks**
3. Memutuskan tindakan yang tepat untuk setiap berita
4. Mendapatkan skor berdasarkan ketepatan analisismu

Semakin teliti kamu, semakin tinggi skormu! Ayo buktikan bahwa kamu adalah Detektif Fakta yang hebat! `,
      simulationId: "hoax-detective"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Jawab semua pertanyaan untuk mendapatkan lencana **Detektif Fakta** ",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Sikap Mira sebaiknya adalah....",
          context: `Mira menerima pesan di grup kelas.

"Besok sekolah libur. Sebarkan ke semua teman!"

Pesan tersebut tidak mencantumkan sumber resmi.`,
          options: [
            {
              id: "a",
              text: "meneruskan pesan itu sambil menulis bahwa informasinya belum pasti",
              isCorrect: false
            },
            {
              id: "b",
              text: "menunggu sampai banyak teman percaya sebelum ikut menyebarkan",
              isCorrect: false
            },
            {
              id: "c",
              text: "memeriksa informasi kepada guru atau wali kelas",
              isCorrect: true
            },
            {
              id: "d",
              text: "menyimpan pesan itu tanpa bertanya karena takut membuat grup ramai",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Dua tanda yang membuat informasi tersebut meragukan adalah....",
          context: `Perhatikan informasi berikut.

"Katanya semua murid akan mendapat tablet gratis minggu depan. Klik tautan ini dan isi data keluargamu sekarang. Jangan sampai terlambat!"

Tanda yang membuat informasi tersebut meragukan adalah ....

1. menggunakan kata "katanya"
2. meminta data keluarga melalui tautan
3. membahas hadiah untuk murid
4. ditulis dalam kalimat yang cukup rapi
5. meminta pembaca segera bertindak`,
          options: [
            {
              id: "a",
              text: "1, 2, dan 5",
              isCorrect: true
            },
            {
              id: "b",
              text: "1, 3, dan 4",
              isCorrect: false
            },
            {
              id: "c",
              text: "2, 3, dan 4",
              isCorrect: false
            },
            {
              id: "d",
              text: "3, 4, dan 5",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Kalimat berikut yang menunjukkan informasi meragukan adalah....",
          options: [
            {
              id: "a",
              text: "\"Informasi ini dapat dicek kembali melalui surat resmi sekolah.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Kegiatan direncanakan pada Jumat, 12 Januari 2026.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Katanya semua murid dapat hadiah gratis, klik sekarang sebelum ditutup!\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Pengumuman lengkap dapat dilihat di papan informasi sekolah.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa kita perlu memeriksa tanggal pada sebuah informasi?",
          options: [
            {
              id: "a",
              text: "agar mengetahui apakah informasi masih baru atau sudah lama",
              isCorrect: true
            },
            {
              id: "b",
              text: "agar informasi lama tidak langsung dianggap masih berlaku",
              isCorrect: false
            },
            {
              id: "c",
              text: "agar kita tahu kapan informasi itu pertama kali muncul",
              isCorrect: false
            },
            {
              id: "d",
              text: "agar kita bisa memilih apakah informasi perlu dibagikan cepat",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Kesimpulan yang tepat adalah....",
          context: `Rafa membaca judul berita berikut.

"Heboh! Semua Murid Dilarang Membawa Bekal ke Sekolah!"

Setelah dibaca, ternyata isi beritanya hanya mengajak murid membawa bekal sehat dan tidak membawa makanan cepat saji secara berlebihan.`,
          options: [
            {
              id: "a",
              text: "judul berita kurang tepat, tetapi masih boleh dibagikan jika isinya bermanfaat",
              isCorrect: false
            },
            {
              id: "b",
              text: "judul berita dibuat berlebihan dan dapat membuat salah paham",
              isCorrect: true
            },
            {
              id: "c",
              text: "judul berita cukup mewakili isi karena sama-sama membahas bekal sekolah",
              isCorrect: false
            },
            {
              id: "d",
              text: "berita perlu dipercaya karena judulnya memberi peringatan yang tegas",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Sebuah informasi disebut meragukan apabila....",
          options: [
            {
              id: "a",
              text: "sumbernya resmi, tetapi penjelasannya belum kita baca sampai selesai",
              isCorrect: false
            },
            {
              id: "b",
              text: "tanggalnya ada, tetapi kalimatnya tidak terlalu menarik",
              isCorrect: false
            },
            {
              id: "c",
              text: "tidak memiliki gambar, tetapi isinya bisa dicek ke sumber resmi",
              isCorrect: false
            },
            {
              id: "d",
              text: "tidak memiliki sumber yang jelas dan perlu diperiksa kembali",
              isCorrect: true
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Pesan yang lebih dapat dipercaya adalah....",
          context: `Mira menerima dua pesan berikut di grup kelas.

Pesan A:
"Besok sekolah libur. Sebarkan cepat ke semua teman!"

Pesan B:
"Besok sekolah tetap masuk seperti biasa. Informasi ini disampaikan wali kelas melalui grup resmi kelas."`,
          options: [
            {
              id: "a",
              text: "Pesan A, karena kabar penting biasanya perlu disebarkan cepat",
              isCorrect: false
            },
            {
              id: "b",
              text: "Pesan A, karena lebih singkat dan mudah dipahami",
              isCorrect: false
            },
            {
              id: "c",
              text: "Pesan B, karena sumber informasinya lebih jelas",
              isCorrect: true
            },
            {
              id: "d",
              text: "Pesan B, karena isinya sama dengan harapan sebagian teman",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Salah satu cara memeriksa kebenaran informasi adalah....",
          options: [
            {
              id: "a",
              text: "membaca judul dan melihat apakah banyak orang membicarakannya",
              isCorrect: false
            },
            {
              id: "b",
              text: "menunggu sampai informasi itu muncul beberapa kali di grup",
              isCorrect: false
            },
            {
              id: "c",
              text: "membandingkan dengan sumber lain yang terpercaya",
              isCorrect: true
            },
            {
              id: "d",
              text: "memilih informasi yang paling lengkap gambarnya untuk dipercaya",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Informasi yang benar biasanya menggunakan bahasa yang....",
          options: [
            {
              id: "a",
              text: "jelas, tidak berlebihan, dan mudah diperiksa",
              isCorrect: true
            },
            {
              id: "b",
              text: "tegas dan mendesak agar pembaca segera bertindak",
              isCorrect: false
            },
            {
              id: "c",
              text: "menarik perhatian dengan kabar besar yang belum dijelaskan sumbernya",
              isCorrect: false
            },
            {
              id: "d",
              text: "singkat, ramai dibicarakan, dan membuat pembaca penasaran",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Informasi tersebut termasuk....",
          context: `Perhatikan informasi berikut.

"Dengar-dengar sekolah akan membagikan uang tunai kepada semua murid. Belum ada pengumuman resmi, tetapi pesan ini harus segera disebarkan."`,
          options: [
            {
              id: "a",
              text: "informasi benar sementara karena berkaitan dengan kegiatan sekolah",
              isCorrect: false
            },
            {
              id: "b",
              text: "informasi perlu disimpan dulu sambil menunggu teman lain mencoba",
              isCorrect: false
            },
            {
              id: "c",
              text: "informasi meragukan karena tidak memiliki sumber yang jelas",
              isCorrect: true
            },
            {
              id: "d",
              text: "informasi penting tetapi belum perlu diperiksa karena hanya berupa kabar",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar menjadi detektif fakta. Sekarang, pikirkan kebiasaanmu saat menerima informasi di internet atau grup chat.",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Apa yang akan kamu lakukan jika menerima informasi yang terdengar heboh tetapi sumbernya tidak jelas?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Kebiasaan baik apa yang ingin kamu mulai agar tidak mudah percaya atau menyebarkan hoaks?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 3 – Data Pribadiku, Rahasiaku
 ═══════════════════════════════════════════════ */
const topic3: Topic = {
  id: "topik-3",
  number: 3,
  title: "Data Pribadiku, Rahasiaku",
  description: "Memahami pentingnya menjaga data pribadi di dunia digital.",
  icon: "lock",
  color: "bg-emerald-500",
  backgroundImageUrl: "/gambar/topik%203/Cover_Topik_3.png",
  badgeId: "badge-guardian-privasi",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari materi ini, kamu diharapkan mampu:

1. **Mengklasifikasikan** jenis-jenis informasi pribadi dengan benar.
2. **Mengevaluasi** informasi pribadi yang dapat dibagikan dengan tepat.
3. **Merancang** kombinasi kata sandi (password) dengan kuat dan aman.
4. **Menerapkan** konten atau foto yang dapat dibagikan ke dunia digital.

Data pribadimu itu seperti kunci rumah — kalau diberikan ke sembarang orang, rumahmu bisa dimasuki orang jahat! `
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Data Pribadi** – Informasi yang bisa digunakan untuk mengenali seseorang, seperti nama lengkap, alamat, nomor telepon.

 **Privasi** – Hak untuk menjaga informasi pribadi agar tidak diketahui orang lain tanpa izin.

 **Password (Kata Sandi)** – Kode rahasia untuk mengakses akun. Harus kuat dan tidak boleh dibagikan.

 **Phishing** – Upaya menipu seseorang untuk memberikan data pribadi melalui pesan atau website palsu.

 **Pengaturan Privasi** – Fitur di aplikasi atau media sosial yang mengatur siapa saja yang bisa melihat informasimu.

 **Data Sensitif** – Data yang sangat pribadi seperti nomor KTP, password, informasi keuangan keluarga.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita komik Bima dan formulir yang mencurigakan.
 Tahap 2: Menjawab tantangan awal – Apa yang kamu ketahui tentang privasi?
 Tahap 3: Belajar tentang data pribadi, jejak digital, dan cara melindunginya.
 Tahap 4: Latihan memahami – Mengenali data pribadi dan phishing.
 Tahap 5: Mengamati studi kasus Rani dan game online.
 Tahap 6: Bereksplorasi dalam simulasi Privasi di Media Sosial.
 Tahap 7: Uji pemahaman akhir dan refleksi.

Jadilah Guardian Privasi! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: `Pernahkah kamu membuat akun gim, membuka aplikasi belajar, atau mengisi nama pada sebuah situs? Kadang-kadang, aplikasi atau situs meminta informasi tentang diri kita. Ada yang boleh dibagikan, tetapi ada juga yang harus dijaga baik-baik.

Yuk, kita baca cerita komik di bawah ini untuk melihat apa yang dialami oleh Bima dan teman-temannya!`,
      comics: [
        "/komik_halaman_1_topik_3.png",
        "/komik_halaman_2_topik_3.png",
        "/komik_halaman_3_topik_3.png"
      ],
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Apa masalah yang terjadi pada cerita komik di atas?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa Bima merasa ragu untuk mengisi data pribadi yang diminta?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu melihat halaman, aplikasi, atau game yang meminta data pribadi? Apa yang kamu lakukan saat itu?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Manakah yang termasuk data pribadi?",
          options: [
            {
              id: "a",
              text: "Warna langit",
              isCorrect: false
            },
            {
              id: "b",
              text: "Nama lengkap, alamat rumah, dan nomor telepon",
              isCorrect: true
            },
            {
              id: "c",
              text: "Judul film favorit",
              isCorrect: false
            },
            {
              id: "d",
              text: "Cuaca hari ini",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Password yang kuat seharusnya...",
          options: [
            {
              id: "a",
              text: "Menggunakan nama sendiri",
              isCorrect: false
            },
            {
              id: "b",
              text: "123456",
              isCorrect: false
            },
            {
              id: "c",
              text: "Campuran huruf besar, huruf kecil, angka, dan simbol",
              isCorrect: true
            },
            {
              id: "d",
              text: "Tanggal lahir",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Siapa yang boleh mengetahui passwordmu?",
          options: [
            {
              id: "a",
              text: "Teman dekat",
              isCorrect: false
            },
            {
              id: "b",
              text: "Hanya kamu sendiri dan orang tua",
              isCorrect: true
            },
            {
              id: "c",
              text: "Semua teman sekelas",
              isCorrect: false
            },
            {
              id: "d",
              text: "Siapa saja yang meminta",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `Pernahkah kamu membuat akun gim, membuka aplikasi belajar, atau mengisi nama pada sebuah situs? Kadang-kadang, aplikasi atau situs meminta informasi tentang diri kita. Ada yang boleh dibagikan, tetapi ada juga yang harus dijaga baik-baik.
Nah, pada topik ini kamu akan belajar mengenali data pribadi. Kamu juga akan belajar cara menjaga data pribadi agar tidak disalahgunakan orang lain.

## A. Data Pribadi Ada di Sekitar Kita
Pernahkah kamu menulis nama di buku tugas? Pernahkah kamu mengisi nama saat masuk ke aplikasi belajar? Atau mungkin kamu pernah membuat akun gim, akun belajar, atau bergabung ke grup kelas? Saat melakukan kegiatan itu, kamu biasanya diminta menuliskan beberapa informasi tentang dirimu. Misalnya nama, kelas, nama sekolah, atau alamat email. Informasi seperti itu disebut data pribadi.

Data pribadi adalah informasi yang berkaitan dengan diri seseorang. Data ini dapat menunjukkan siapa diri kita, di mana kita tinggal, bagaimana orang lain dapat menghubungi kita, atau akun apa yang kita gunakan.

Contoh data pribadi antara lain:
- Nama lengkap
- Alamat rumah
- Tanggal lahir
- Nomor telepon
- Nama orang tua
- Nama sekolah dan kelas
- Foto diri
- Alamat email
- Nama akun
- Kata sandi
- Lokasi rumah atau sekolah
- Dokumen penting seperti rapor, kartu keluarga, atau kartu pelajar

Tidak semua data pribadi boleh dibagikan sembarangan. Ada data yang boleh ditulis saat diperlukan, misalnya nama panggilan untuk tugas kelas. Namun, ada juga data yang harus dijaga, seperti alamat rumah, nomor telepon, dan kata sandi.

![Anak sedang melihat formulir](/form_pribadi_chromebook.png)

## B. Tidak Semua Informasi Boleh Dibagikan
Coba perhatikan dua kalimat berikut.
- Kalimat 1: "Namaku Raka. Aku suka menggambar hewan."
- Kalimat 2: "Namaku Raka Pratama. Aku kelas 5 SD Harapan. Rumahku di Jalan Melati Nomor 10. Nomor HP ibuku 08xxxxxxxx."

Menurutmu, kalimat mana yang lebih berisiko jika ditulis di internet?
Kalimat pertama hanya berisi nama panggilan dan hobi. Informasi itu masih tergolong umum. Namun, kalimat kedua berisi nama lengkap, sekolah, alamat rumah, dan nomor telepon orang tua. Informasi seperti itu harus dijaga karena dapat membuat orang lain mengetahui terlalu banyak tentang diri kita.

Membagikan data pribadi sembarangan dapat menimbulkan masalah. Orang yang tidak dikenal bisa menghubungi kita, mengetahui tempat tinggal kita, atau bahkan menggunakan data kita untuk hal yang tidak baik.

Karena itu, sebelum menulis informasi di internet, biasakan bertanya:
1. Apakah informasi ini perlu ditulis?
2. Apakah informasi ini aman dibagikan?
3. Apakah aku sudah meminta izin guru atau orang tua?

![Unggahan Aman vs Risiko](/unggahan_aman_risiko.png)

## C. Data Pribadi Itu Seperti Kunci Rumah
Bayangkan kamu memiliki kunci rumah. Apakah kunci itu boleh diberikan kepada orang yang tidak dikenal? Tentu tidak.

Kata sandi juga seperti kunci. Kata sandi digunakan untuk membuka akun digital. Jika kata sandi diberikan kepada orang lain, akunmu bisa dibuka tanpa izin. Orang lain bisa membaca pesanmu, mengganti namamu, mengirim sesuatu menggunakan akunmu, atau menghapus tugas yang sudah kamu buat.

Selain kata sandi, alamat rumah dan nomor telepon juga harus dijaga. Jika alamat rumah dibagikan sembarangan, orang yang tidak dikenal bisa mengetahui tempat tinggalmu. Jika nomor telepon orang tua disebarkan, orang lain bisa menghubungi keluargamu tanpa izin.

Jika data pribadi dibagikan sembarangan, beberapa risiko dapat terjadi:
- Orang lain bisa berpura-pura menjadi dirimu
- Membuka akunmu tanpa izin
- Mengirim pesan menggunakan namamu
- Menipu dengan hadiah palsu
- Mengetahui lokasi rumah atau sekolahmu
- Menghubungi keluargamu tanpa izin

Karena itu, data pribadi harus dijaga seperti kita menjaga barang penting. Itulah sebabnya data pribadi harus dijaga dengan hati-hati.

![Kata Sandi Seperti Kunci](/kunci_kata_sandi.png)

## D. Kapan Data Boleh Diisi?
Kadang-kadang kita memang perlu mengisi data. Misalnya saat mengerjakan kuis dari guru, mengisi presensi kelas, mengikuti lomba sekolah, atau menggunakan aplikasi belajar.

Namun, sebelum mengisi data, kamu perlu memperhatikan beberapa hal.
1. Lihat siapa yang meminta data tersebut. Jika formulir diberikan oleh guru, sekolah, atau orang tua, kemungkinan formulir itu memang diperlukan. Namun, tetap isi sesuai arahan.
2. Perhatikan data apa saja yang diminta. Jika hanya meminta nama panggilan dan kelas, biasanya masih aman untuk kegiatan belajar. Tetapi jika meminta alamat rumah, nomor HP orang tua, foto kartu keluarga, atau kata sandi, kamu harus bertanya kepada guru atau orang tua terlebih dahulu.
3. Jangan pernah menulis kata sandi di formulir apa pun. Kata sandi hanya digunakan oleh pemilik akun. Guru, teman, atau aplikasi belajar tidak seharusnya meminta kata sandi pribadimu.
4. Jangan langsung menekan tombol kirim jika belum yakin. Baca kembali data yang kamu tulis. Jika ada yang membuatmu bingung, berhenti dan bertanyalah.

![Konfirmasi Sebelum Kirim](/kirim_aman_konfirmasi.png)

## E. Jejak Digital dari Data yang Kita Bagikan
Setiap kali kita menulis, mengunggah, mengirim pesan, atau mengisi sesuatu di internet, kegiatan itu dapat meninggalkan **Jejak Digital**. Jejak digital adalah rekaman, bekas, atau riwayat aktivitas kita saat menjelajahi dunia digital. Sama seperti berjalan di atas pasir pantai basah yang meninggalkan bekas kaki, setiap tindakan kita di internet meninggalkan bekas yang bisa dilihat orang lain.

Ada dua jenis jejak digital yang perlu kamu ketahui:
1. **Jejak Digital Aktif**: Jejak yang kita tinggalkan secara sadar dan sengaja. Contohnya: mengirim pesan di grup chat kelas, mengunggah foto atau video di media sosial, menulis komentar di bawah video YouTube, atau mengisi formulir pendaftaran akun gim.
2. **Jejak Digital Pasif**: Jejak yang tertinggal tanpa kita sadari secara langsung. Contohnya: situs web yang merekam alamat internet (IP Address) kita saat kita mengunjunginya, aplikasi yang merekam lokasi keberadaan kita melalui GPS, atau riwayat pencarian yang mengingat apa saja yang pernah kita cari.

### Mengapa Kita Harus Peduli dengan Jejak Digital?
Mungkin kamu berpikir, "Ah, kan tinggal klik hapus, beres!" Kenyataannya tidak semudah itu. Di dunia digital, apa yang sudah dibagikan sangat sulit untuk benar-benar dihilangkan karena:
- **Mudah Menyebar & Disimpan**: Orang lain bisa dengan cepat mengunduh foto kita atau mengambil tangkapan layar (screenshot) pesan kita, lalu menyebarkannya lagi bahkan setelah kita menghapus postingan asli kita.
- **Bersifat Permanen (Abadi)**: Data di internet disimpan di komputer raksasa (server) penyedia aplikasi yang tidak selalu terhapus saat kita menutup akun.
- **Bisa Memengaruhi Masa Depan**: Ketika kamu tumbuh dewasa dan mendaftar ke sekolah yang lebih tinggi atau melamar pekerjaan, pihak sekolah atau perusahaan sering kali memeriksa jejak digitalmu. Jejak digital yang buruk (seperti suka mengejek teman di internet, menggunakan kata kasar, atau membagikan konten buruk) bisa membuatmu kehilangan kesempatan berharga.

### Tips Menjaga Jejak Digital Tetap Bersih (Rumus T.H.I.N.K.)
Sebelum kamu membagikan foto, mengirim komentar, atau mengisi formulir apa pun di internet, selalu ingat rumus **T.H.I.N.K.**:
- **T (True / Benar)**: Apakah informasi yang saya bagikan ini benar dan bukan kabar bohong (hoaks)?
- **H (Helpful / Bermanfaat)**: Apakah kiriman ini membantu atau berguna bagi orang lain?
- **I (Inspiring / Menginspirasi)**: Apakah komentar atau postingan ini memberikan semangat positif bagi yang membaca?
- **N (Necessary / Penting)**: Apakah ini benar-benar perlu dibagikan? Atau justru membocorkan data pribadi saya?
- **K (Kind / Sopan)**: Apakah kata-kata yang saya gunakan sopan dan tidak menyakiti perasaan orang lain?

Jejak digital dapat berguna jika digunakan dengan baik. Misalnya, tugas yang dikirim lewat aplikasi belajar dapat membantu guru menilai pekerjaanmu. Namun, jejak digital juga bisa merugikan jika kamu sembarangan membagikan data pribadi. Karena itu, jadilah pengguna digital yang cerdas dan hati-hati!

![Jejak Digital Kaki](/jejak_digital_kaki.png)`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Data berikut yang termasuk \"sangat pribadi\" dan tidak boleh dibagikan online adalah...",
          options: [
            {
              id: "a",
              text: "Hobi bermain sepak bola",
              isCorrect: false
            },
            {
              id: "b",
              text: "Warna favorit",
              isCorrect: false
            },
            {
              id: "c",
              text: "Nomor KTP orang tua dan alamat rumah lengkap",
              isCorrect: true
            },
            {
              id: "d",
              text: "Makanan kesukaan",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Phishing adalah...",
          options: [
            {
              id: "a",
              text: "Aplikasi untuk mengedit foto",
              isCorrect: false
            },
            {
              id: "b",
              text: "Upaya menipu seseorang untuk memberikan data pribadi",
              isCorrect: true
            },
            {
              id: "c",
              text: "Permainan memancing online",
              isCorrect: false
            },
            {
              id: "d",
              text: "Cara mengirim email",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Sebutkan 3 cara yang bisa kamu lakukan untuk melindungi data pribadimu di internet!",
          correctAnswer: "Membuat password yang kuat, mengatur privasi akun, tidak membagikan data sensitif, waspada phishing, bertanya pada orang tua.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `## Studi Kasus: Rani dan Game Online

Rani sangat suka bermain game online. Suatu hari, dia menerima pesan di dalam game:

> "Halo Rani! Aku admin game. Kami sedang memberikan hadiah 1000 diamond gratis! Untuk mendapatkannya, kirimkan nama lengkap, email, password, dan nomor HP orang tuamu."

Rani sangat senang dan hampir saja mengirimkan datanya. Untungnya, dia ingat pelajaran tentang privasi data.

### Apa yang dilakukan Rani?
1. Tidak mengirimkan data apapun
2. Mengecek apakah benar ada event hadiah di website resmi game
3. Melaporkan akun tersebut ke admin game yang asli
4. Memberitahu orang tuanya tentang pesan tersebut

Ternyata, pesan itu adalah **phishing** — upaya untuk mencuri data pribadi Rani!`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Mengapa pesan yang diterima Rani termasuk phishing?",
          options: [
            {
              id: "a",
              text: "Karena menawarkan hadiah",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena meminta data pribadi seperti password dan nomor HP",
              isCorrect: true
            },
            {
              id: "c",
              text: "Karena dikirim melalui game",
              isCorrect: false
            },
            {
              id: "d",
              text: "Karena menggunakan emoji",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Jika kamu menerima pesan seperti yang diterima Rani, apa yang akan kamu lakukan? Jelaskan langkah-langkahnya!",
          correctAnswer: "Tidak memberikan data, curiga terhadap permintaan data pribadi, cek di sumber resmi, laporkan, beritahu orang tua/guru.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Mengatur Privasi di Media Sosial 

Dalam simulasi ini, kamu akan berlatih mengatur privasi di sebuah platform media sosial simulasi.

Kamu akan:
1. Membuat profil dengan informasi yang aman
2. Mengatur pengaturan privasi
3. Menghadapi skenario: siapa yang boleh melihat postinganmu?
4. Mengenali dan menolak upaya phishing

Ingat: privasimu adalah hakmu! Kamu yang menentukan siapa yang boleh tahu informasimu! `,
      simulationId: "privacy-tiktok"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Pilihlah jawaban yang paling tepat!",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Naya ingin membuat nama pengguna untuk aplikasi menggambar. Pilihan nama pengguna berikut yang paling aman adalah....",
          options: [
            {
              id: "a",
              text: "NayaPutri_Kelas5A",
              isCorrect: false
            },
            {
              id: "b",
              text: "Naya_JlMelati10",
              isCorrect: false
            },
            {
              id: "c",
              text: "NayaLahir07Jan",
              isCorrect: false
            },
            {
              id: "d",
              text: "KuasPelangi_25",
              isCorrect: true
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Tindakan paling aman yang dilakukan Dika adalah....",
          context: "Dika membuka gim edukasi. Sebelum bermain, muncul formulir yang meminta nama lengkap, alamat rumah, nomor HP orang tua, dan kata sandi akun.",
          options: [
            {
              id: "a",
              text: "Mengisi nama lengkap saja karena kolom lain bisa dikosongkan",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengisi data samaran agar tetap bisa masuk ke gim",
              isCorrect: false
            },
            {
              id: "c",
              text: "Tidak mengisi formulir, menutup halaman, lalu bertanya kepada guru",
              isCorrect: true
            },
            {
              id: "d",
              text: "Mengisi sebagian data setelah menghapus alamat rumah dari kolom isian",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa kata sandi tidak boleh diberikan kepada teman?",
          options: [
            {
              id: "a",
              text: "Karena teman hanya boleh mengetahui nama pengguna, bukan isi akun kita",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena orang lain bisa masuk dan menyalahgunakan akun kita tanpa izin",
              isCorrect: true
            },
            {
              id: "c",
              text: "Karena kata sandi aman jika ditulis di buku yang disimpan sendiri",
              isCorrect: false
            },
            {
              id: "d",
              text: "Karena kata sandi boleh dipakai bersama hanya saat mengerjakan tugas",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Saat mendapat pesan dari orang tidak dikenal yang meminta alamat rumah, sebaiknya kamu....",
          options: [
            {
              id: "a",
              text: "menanyakan dahulu alasan orang tersebut membutuhkan alamat",
              isCorrect: false
            },
            {
              id: "b",
              text: "memberi nama jalan saja tanpa nomor rumah",
              isCorrect: false
            },
            {
              id: "c",
              text: "tidak memberikan data apa pun dan melapor kepada guru atau orang tua",
              isCorrect: true
            },
            {
              id: "d",
              text: "meminta orang tersebut mengirim identitasnya sebelum membalas",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Keputusan yang paling tepat untuk formulir tersebut adalah....",
          context: "Formulir dari wali kelas meminta nama lengkap, kelas, dan nomor HP orang tua untuk kegiatan lomba sekolah.",
          options: [
            {
              id: "a",
              text: "Mengisi sendiri karena formulir berasal dari kegiatan sekolah",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengisi nama dan kelas saja, lalu mengosongkan nomor HP orang tua",
              isCorrect: false
            },
            {
              id: "c",
              text: "Mengisi setelah mendapat izin atau arahan guru/orang tua",
              isCorrect: true
            },
            {
              id: "d",
              text: "Menulis nomor HP lain agar data orang tua tidak terlihat",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Unggahan, komentar, pencarian, dan pesan yang tertinggal di dunia digital disebut....",
          options: [
            {
              id: "a",
              text: "riwayat aplikasi yang sudah dihapus dari perangkat",
              isCorrect: false
            },
            {
              id: "b",
              text: "rekam jejak aktivitas kita yang tertinggal di dunia digital",
              isCorrect: true
            },
            {
              id: "c",
              text: "catatan rahasia yang hanya bisa dilihat pemilik akun",
              isCorrect: false
            },
            {
              id: "d",
              text: "daftar situs yang boleh dibuka saat belajar di kelas",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Contoh tindakan menjaga data pribadi adalah....",
          options: [
            {
              id: "a",
              text: "menulis kata sandi di buku catatan agar tidak lupa",
              isCorrect: false
            },
            {
              id: "b",
              text: "memakai tanggal lahir agar kata sandi mudah diingat",
              isCorrect: false
            },
            {
              id: "c",
              text: "keluar atau logout dari akun setelah memakai Chromebook bersama",
              isCorrect: true
            },
            {
              id: "d",
              text: "membiarkan akun tetap terbuka jika perangkat masih dipakai di kelas yang sama",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Jika sebuah aplikasi meminta data yang tidak kamu pahami, kamu sebaiknya....",
          options: [
            {
              id: "a",
              text: "mengisi bagian yang terlihat mudah dan melewati bagian yang membingungkan",
              isCorrect: false
            },
            {
              id: "b",
              text: "berhenti sejenak dan bertanya kepada guru atau orang tua",
              isCorrect: true
            },
            {
              id: "c",
              text: "meminta teman menebak data mana yang aman untuk ditulis",
              isCorrect: false
            },
            {
              id: "d",
              text: "mengisi data yang tidak lengkap agar tetap bisa mencoba aplikasinya",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa alamat rumah tidak boleh dibagikan sembarangan di internet?",
          options: [
            {
              id: "a",
              text: "karena alamat rumah sebaiknya hanya ditulis jika aplikasi terlihat rapi",
              isCorrect: false
            },
            {
              id: "b",
              text: "karena orang yang tidak dikenal bisa mengetahui tempat tinggal kita",
              isCorrect: true
            },
            {
              id: "c",
              text: "karena alamat rumah aman dibagikan jika tidak disertai nomor HP",
              isCorrect: false
            },
            {
              id: "d",
              text: "karena alamat rumah menjadi data umum jika sudah pernah disebut di grup",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Keputusan yang paling tepat untuk formulir survei tersebut adalah....",
          context: "Sebuah formulir survei hobi meminta nama panggilan, hobi, dan makanan kesukaan. Formulir itu diberikan oleh guru untuk kegiatan kelas.",
          options: [
            {
              id: "a",
              text: "Boleh diisi dengan hati-hati sesuai arahan guru karena hanya data umum",
              isCorrect: true
            },
            {
              id: "b",
              text: "Boleh diisi, lalu menambahkan alamat rumah agar guru lebih mudah mengenali",
              isCorrect: false
            },
            {
              id: "c",
              text: "Tidak boleh diisi karena semua formulir digital harus dianggap berbahaya",
              isCorrect: false
            },
            {
              id: "d",
              text: "Boleh diisi cepat tanpa membaca petunjuk karena diberikan oleh guru",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar tentang data pribadi dan jejak digital. Sebagai pengguna digital, kita menumbuhkan profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh). Pada topik ini, kamu melatih sikap **Aman** dan **Hati-hati** dalam menjaga informasi pribadi. Renungkan kebiasaanmu dan jawab dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu membagikan data pribadi tanpa berpikir panjang? Apa yang akan kamu lakukan sekarang?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apa satu kebiasaan baru yang akan kamu mulai untuk melindungi privasi dan jejak digitalmu?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 4 – Awas, Jangan Asal Klik!
 ═══════════════════════════════════════════════ */
const topic4: Topic = {
  id: "topik-4",
  number: 4,
  title: "Awas, Jangan Asal Klik!",
  description: "Mengenal ancaman keamanan siber dan cara melindungi diri.",
  icon: "shield-alert",
  color: "bg-red-500",
  backgroundImageUrl: "/gambar/Topik%204/Cover_Topik_4.png",
  badgeId: "badge-ksatria-siber",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari materi ini, kamu diharapkan mampu:
- mengevaluasi tingkat keamanan sebuah tautan dan pesan digital dengan tepat dan teliti
- menentukan tindakan responsif pencegahan yang paling aman dengan benar
- menganalisis kepantasan sebuah konten media sosial sesuai dengan batasan usianya secara kritis
- menganalisis dan menerapkan tindakan yang tepat terhadap link yang aman dan berbahaya dengan tepat

Internet itu seperti kota besar — seru untuk dijelajahi, tapi kamu harus tahu di mana yang aman dan di mana yang berbahaya! `
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Malware** – Perangkat lunak jahat yang bisa merusak komputer atau HP, seperti virus.

 **Virus Komputer** – Program jahat yang bisa menyebar dan merusak file di perangkatmu.

 **Spam** – Pesan yang tidak diinginkan, biasanya berisi iklan atau penipuan.

 **Pop-up** – Jendela kecil yang muncul tiba-tiba di layar, biasanya berisi iklan atau peringatan palsu.

 **Link Mencurigakan** – Tautan yang bisa mengarahkan ke website berbahaya.

 **Update (Pembaruan)** – Versi terbaru aplikasi atau sistem operasi yang memperbaiki keamanan.

 **Antivirus** – Program yang melindungi perangkat dari virus dan malware.

 **Trojan (Kuda Troya)** – Malware yang menyamar sebagai aplikasi atau game yang bagus, padahal sebenarnya berbahaya.

 **Wi-Fi Publik** – Internet gratis di tempat umum (kafe, taman) yang bisa tidak aman karena data dapat disadap orang lain.

 **VPN (Virtual Private Network)** – Layanan yang mengamankan koneksi internet menjadi seperti "terowongan rahasia" yang sulit disadap.

 **HTTPS / Ikon Gembok** – Tanda bahwa sebuah situs web aman karena koneksi datanya terenkripsi.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita Raka, Naya, dan Digi tentang tautan mencurigakan.
 Tahap 2: Menjawab tantangan awal – Apa yang kamu ketahui tentang keamanan internet?
 Tahap 3: Belajar tentang ancaman siber, jurus 4P, dan cara mengatasinya.
 Tahap 4: Latihan memahami – Trojan, website aman, dan Wi-Fi publik.
 Tahap 5: Mengamati studi kasus Riko dan aplikasi "gratis".
 Tahap 6: Bereksplorasi dalam simulasi Ksatria Siber.
 Tahap 7: Uji pemahaman akhir dan refleksi.

Jadilah Ksatria Siber yang tangguh! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Setelah membaca cerita di bawah, pikirkan: pernahkah kamu melihat pesan seperti itu? Apa yang kamu lakukan saat itu?",
      passage: `**Tahan Dulu Sebelum Klik!**

Pernahkah kamu melihat pesan seperti ini saat menggunakan HP, Chromebook, atau komputer?
*"Selamat! Kamu mendapat hadiah gratis. Klik sekarang!"*
*"Akunmu akan ditutup. Masukkan kata sandi di sini!"*
*"Download aplikasi ini agar game-mu menang terus!"*
*"Klik link ini, jangan beri tahu siapa-siapa!"*

Pesan seperti itu mungkin terlihat menarik. Ada yang menjanjikan hadiah, kuota gratis, item game, aplikasi keren, atau video seru. Namun, apakah semua pesan seperti itu aman untuk dibuka? Belum tentu.

Ada tautan yang dapat membawa kita ke halaman yang tidak sesuai untuk anak-anak. Ada juga tautan yang meminta data pribadi, seperti nama lengkap, alamat rumah, nomor telepon, atau kata sandi. Bahkan, ada tautan yang dapat mengarahkan kita untuk mengunduh aplikasi berbahaya.

Karena itu, kita tidak boleh asal klik. Sebelum membuka tautan, kita perlu berhenti sebentar, membaca dengan teliti, dan memikirkan risikonya.

Suatu hari, Raka menerima pesan "diamond gratis" di gimnya. Ia hampir saja mengkliknya. Naya yang melihatnya langsung mengingatkan, *"Raka, jangan langsung diklik! Belum tentu itu benar."* Lalu Digi datang sambil memegang papan bertuliskan **"Tahan dulu sebelum klik!"**

Hari ini, Digi mengajak kamu menjadi **Detektif Klik Aman**. Tugasmu bukan mengklik semua tautan, melainkan mengamati, memeriksa, dan mengambil keputusan yang paling aman. Yuk, kita belajar mengenali pesan, tautan, dan konten yang perlu diwaspadai!`,
      mediaType: "image",
      mediaUrl: "/raka_naya_story.png",
      mediaLayout: "above",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu menerima pesan seperti \"hadiah gratis\" atau \"klik link ini\"? Apa yang kamu lakukan saat itu?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa Naya dan Digi mengingatkan Raka agar tidak langsung mengklik pesan tersebut?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Menurutmu, apa yang sebaiknya kita lakukan sebelum mengklik sebuah tautan?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: `**Aman atau Bahaya?**

Pernahkah kamu menerima pesan yang berisi tautan? Ada pesan yang memang berhubungan dengan kegiatan belajar. Namun, ada juga pesan yang meminta kita mengklik tautan, mengisi kata sandi, atau mengunduh aplikasi yang belum jelas.

Sekarang, perhatikan beberapa pesan berikut. Tugasmu hanya membaca, mengamati, dan menentukan apakah pesan tersebut **aman** atau **bahaya**. Pilihlah jawaban yang menurutmu tepat.`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Pesan ini termasuk....",
          context: `Pesan masuk:
"Selamat! Kamu mendapat hadiah HP gratis. Klik tautan ini dan isi datamu sekarang sebelum hangus!"`,
          options: [
            {
              id: "a",
              text: "Aman, karena memberi hadiah",
              isCorrect: false
            },
            {
              id: "b",
              text: "Bahaya, karena memaksa cepat klik dan meminta data",
              isCorrect: true
            },
            {
              id: "c",
              text: "Aman, karena dikirim lewat HP",
              isCorrect: false
            },
            {
              id: "d",
              text: "Aman, asalkan hadiahnya menarik",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Pesan ini termasuk....",
          context: `Pesan dari wali kelas di grup resmi:
"Anak-anak, silakan buka tautan materi IPA di Google Classroom kelas kita untuk tugas hari ini."`,
          options: [
            {
              id: "a",
              text: "Bahaya, karena ada tautannya",
              isCorrect: false
            },
            {
              id: "b",
              text: "Bahaya, karena meminta membuka sesuatu",
              isCorrect: false
            },
            {
              id: "c",
              text: "Aman, karena dari wali kelas melalui grup resmi untuk belajar",
              isCorrect: true
            },
            {
              id: "d",
              text: "Bahaya, karena dikirim di grup",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Pesan ini termasuk....",
          context: `Pesan dari nomor tidak dikenal:
"Akunmu akan ditutup! Masukkan kata sandimu di tautan ini sekarang juga."`,
          options: [
            {
              id: "a",
              text: "Aman, karena ingin menyelamatkan akun",
              isCorrect: false
            },
            {
              id: "b",
              text: "Bahaya, karena meminta kata sandi lewat tautan",
              isCorrect: true
            },
            {
              id: "c",
              text: "Aman, asalkan kita cepat mengisinya",
              isCorrect: false
            },
            {
              id: "d",
              text: "Aman, karena hanya kata sandi",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## A. Mengenal Tautan (Link) dan Konten di Internet
Saat menggunakan internet, kamu pasti sering menemukan tautan atau sering disebut link. Tautan biasanya berupa teks berwarna biru yang bisa diklik. Tautan adalah alamat yang akan membawamu berpindah dari satu halaman ke halaman lain. Misalnya, ketika kamu mengeklik judul video YouTube, membuka modul pelajaran dari sekolah, atau masuk ke halaman tugas.

*Tautan itu persis seperti pintu. Ada dua jenis pintu di internet:*
1. **Pintu Aman (Tautan Resmi):** Membawa kamu ke halaman resmi sekolah (seperti Google Classroom), video belajar yang aman, atau situs terpercaya. Aman diklik!
2. **Pintu Bahaya (Tautan Palsu):** Membawa kamu ke situs penipuan yang mencoba mencuri kata sandimu (phishing), merusak perangkat dengan virus, atau menampilkan iklan kotor. Harus dihindari!

Selain tautan, di balik pintu-pintu itu terdapat Konten.
Konten adalah semua isi yang ada di internet. Bentuknya bisa berupa teks, foto, video, rekaman suara, kolom komentar, permainan (game), dan iklan.
Ingat, tidak semua konten di internet cocok untuk anak-anak. Ada konten yang sangat bermanfaat, tetapi ada juga konten yang menakutkan, kasar, mengejek orang lain, atau meminta kamu melakukan tantangan yang berbahaya.

Jadi, saat memegang gawai, kamu adalah kaptennya! Selalu tanyakan tiga hal ini pada dirimu sendiri:
- "Apakah tempat ini aman?"
- "Apakah tontonan ini sesuai untuk usiaku?"
- "Apakah aku perlu meminta bantuan guru atau Ayah dan Ibu?"

## B. Ciri-Ciri Tautan dan Konten Mencurigakan
Jebakan di internet sebenarnya mudah dikenali jika kamu teliti. Perhatikan 6 tanda bahaya berikut ini:

 **1. Menjanjikan Hadiah yang Terlalu Menarik (Terlalu Bagus untuk Menjadi Nyata)**
Penjahat internet sering memancing menggunakan hadiah.
- "Kamu pemenang beruntung! HP gratis menunggumu!"
- "Klik di sini untuk dapat 10.000 diamond gratis tanpa bayar!"
- "Dapatkan kuota internet 50GB seumur hidup!"
*Ingat: Kalau hadiahnya terdengar sangat tidak masuk akal dan terlalu mudah didapat, itu hampir 100% adalah penipuan!*

 **2. Membuatmu Terburu-buru, Panik, atau Takut**
Pesan jebakan sengaja dirancang agar kamu tidak sempat berpikir panjang.
- "Awas! Akunmu akan dihapus dalam 5 menit jika tidak mengeklik ini!"
- "HP kamu terkena 100 virus berbahaya! Bersihkan sekarang!"
- "Kalau kamu tidak menyebarkan pesan ini, ibumu akan celaka!"
*Ingat: Perusahaan resmi tidak pernah mengancam penggunanya seperti itu.*

 **3. Meminta Kata Sandi atau Data Penting**
Jika ada tautan yang tiba-tiba memunculkan kolom formulir dan memintamu mengisi kata sandi (password), kode OTP (angka rahasia dari SMS), alamat rumah lengkap, atau nama ibu kandung, segera tutup! Itu adalah upaya pencurian akun.

 **4. Alamat Tautannya Terlihat Aneh dan Acak-acakan**
Kadang penipu membuat situs yang namanya dimiripkan dengan situs terkenal, tetapi jika diperhatikan ada yang aneh.
- Contoh asli: \`www.roblox.com\`
- Contoh palsu: \`www.roblox-hadiah-gratis99.site\` atau \`www.r0blox.net\`
*Alamat yang terlalu panjang, banyak angka acak, dan tidak beraturan harus segera dihindari.*

 **5. Berisi Iklan atau Tombol Unduhan (Download) yang Memaksa**
Pernahkah kamu membuka sebuah situs untuk membaca cerita, tapi tiba-tiba muncul tombol hijau besar bertuliskan "DOWNLOAD SEKARANG!" berkedip-kedip? Jangan pernah menekannya! Itu biasanya adalah virus atau aplikasi jahat yang bisa merusak gawaimu.

 **6. Mengandung Konten yang Tidak Pantas**
Konten tidak pantas adalah gambar, video, atau tulisan yang tidak boleh dilihat oleh anak-anak. Jika kamu melihatnya, kamu mungkin akan merasa kaget, jijik, atau takut.

*Gunakan perisai pemahamanmu untuk mengenali tanda bahaya ini dan jangan asal klik!*

## BAB KHUSUS: Waspada Konten Tidak Pantas di Media Sosial!
Saat ini, mengakses media sosial sangatlah mudah. Kamu mungkin suka menonton video pendek di TikTok, Instagram Reels, atau YouTube Shorts. Hanya dengan menggeser layar (swipe), video baru akan terus bermunculan.

Namun, sistem (algoritma) di media sosial kadang tanpa sengaja memunculkan video yang bukan untuk anak-anak. Inilah yang disebut Konten Tidak Pantas.

### Apa saja yang termasuk Konten Tidak Pantas?
- **Konten Kekerasan:** Video orang berkelahi, kecelakaan parah yang tidak disensor, atau kekerasan pada hewan peliharaan.
- **Konten Menakutkan (Horor):** Penampakan menyeramkan atau cerita misteri yang bisa membuatmu bermimpi buruk dan tidak berani ke kamar mandi sendirian.
- **Kata-Kata Kasar dan Jorok:** Video yang berisi makian, hinaan, atau obrolan yang tidak sopan.
- **Tantangan Berbahaya (Dangerous Challenge):** Video yang mengajak penontonnya melakukan hal konyol yang membahayakan nyawa, seperti menahan napas terlalu lama atau melompat dari tempat tinggi.
- **Konten Khusus Dewasa:** Gambar atau video yang menampakkan hal-hal yang tidak seharusnya dilihat oleh anak di bawah umur.

### Apa Dampaknya Jika Kamu Sering Melihatnya?
Konten-konten ini bisa meracuni pikiranmu. Kamu bisa menjadi anak yang pemarah, suka meniru kata-kata kasar, selalu merasa ketakutan, atau kehilangan konsentrasi saat belajar.

### Jurus Menghadapi Konten Tidak Pantas di Media Sosial:
- **Geser Cepat (Swipe Away):** Jika tiba-tiba muncul video yang membuatmu merasa tidak nyaman, aneh, atau takut, jangan terus ditonton! Langsung geser layarmu ke video berikutnya.
- **Tekan "Tidak Tertarik" (Not Interested):** Di TikTok atau YouTube, kamu bisa menekan layar agak lama di video tersebut, lalu pilih tombol "Tidak Tertarik" atau "Don't Recommend". Dengan begitu, sistem tahu kamu tidak menyukai video kotor tersebut.
- **Lapor pada Orang Dewasa:** Jika videonya sangat mengganggu, tunjukkan pada orang tuamu agar mereka bisa memblokir akun yang menyebarkannya.

## Langkah Aman Sebelum Mengeklik: Lakukan "4P"!
Agar kamu selamat dari semua jebakan dan konten buruk di atas, jadikan 4P sebagai perisaimu sebelum jarimu menekan layar!

### 1. PAUSE (Berhenti Sebentar)
Jangan langsung mengklik! Tahan jarimu. Saat kamu menerima pesan yang menjanjikan hadiah atau ancaman, ambil napas dalam-dalam. Penjahat internet ingin kamu panik. Dengan berhenti sejenak, kamu sudah menggagalkan rencana jahat mereka.

### 2. PERIKSA (Jadilah Detektif)
Setelah berhenti, gunakan mata detektifmu:
- Siapa yang mengirim pesan ini? Orang tak dikenal?
- Apakah alamat tautannya aneh?
- Apakah pesan ini menyuruhku merahasiakannya dari Ayah dan Ibu? *(Ingat, hal yang baik tidak perlu dirahasiakan dari orang tua!)*

### 3. PIKIRKAN Risiko (Gunakan Logikamu)
Tanya pada dirimu sendiri:
- "Kalau aku isi namaku dan kata sandiku di sini, apakah akunku akan dicuri?"
- "Kalau aku klik unduh, apakah HP ini akan rusak kena virus?"
*Lebih baik berhati-hati dan tidak mendapat "hadiah palsu", daripada menangis karena akun game atau data pentingmu lenyap dicuri orang.*

### 4. PUTUSKAN (Ambil Tindakan Cerdas)
Setelah memikirkan risikonya, ambil keputusan yang paling aman!
Keputusan terbaik sering kali adalah: Mengabaikan pesan, menutup layar, tidak mengisi data apa pun, dan menceritakannya kepada orang tua.

### Contoh Simulasi 4P:
*Pesan di HP: "Selamat! Kamu terpilih mendapat HP gratis. Klik link www.hadiah-hp-segera.com dan isi alamat rumahmu sekarang juga sebelum jam 12 siang!"*

| Langkah 4P | Tindakan Penjelajah Cerdas |
|---|---|
| **Pause** | Aku tahan jariku, aku tidak terburu-buru meski batas waktunya jam 12 siang. |
| **Periksa** | Alamat link-nya sangat aneh. Dan kenapa ada orang tak dikenal tiba-tiba mau memberi HP mahal secara gratis? |
| **Pikirkan** | Kalau aku berikan alamat rumahku, orang jahat bisa tahu di mana aku tinggal. Ini berbahaya bagi keselamatanku dan keluargaku. |
| **Putuskan** | Aku tidak akan mengeklik link itu. Aku hapus pesannya dan kublokir nomor pengirimnya. |

### Terlanjur Mengeklik Tautan Bahaya? Lakukan Langkah Darurat Ini!
Jangan panik! Jika kamu telanjur mengeklik tautan aneh, segera lakukan langkah penyelamatan ini:
1. **Tutup Layar:** Segera tekan tombol silang (X) atau tutup aplikasi browser-mu.
2. **Matikan Wi-Fi/Koneksi Internet:** Ini penting agar virus tidak menyebar ke perangkat lain di rumahmu.
3. **Jangan Isi Kolom Apa Pun:** Jika halaman itu meminta nama atau kata sandi, biarkan kosong.
4. **LAPOR SEKARANG JUGA:** Temui Ayah, Ibu, atau Gurumu. Katakan dengan jujur, *"Ayah/Ibu/Guru, tadi aku tidak sengaja memencet tautan aneh dan layarnya berubah. Tolong periksa HP-ku."*

*Meminta bantuan orang dewasa bukan berarti kamu anak yang ceroboh atau nakal. Justru, berani melapor adalah tanda bahwa kamu anak yang sangat bertanggung jawab dan pintar melindungi diri sendiri.*

## Mengenal Lebih Dekat: Jenis Malware & Bahaya Wi-Fi Publik

### Jenis-Jenis Malware yang Perlu Kamu Kenal
Malware (perangkat lunak jahat) punya banyak "tokoh jahat". Kenali beberapa yang paling sering menjebak anak-anak:
- **Virus Komputer**: Program jahat yang menyebar dengan menempel pada file lain. Bisa merusak data dan memperlambat perangkatmu.
- **Trojan (Kuda Troya)**: Malware yang **berpura-pura menjadi aplikasi atau game yang bagus**, padahal sebenarnya berbahaya. Namanya terinspirasi dari kisah kuda kayu Troya yang menyembunyikan prajurit di dalamnya. Contoh: game "gratis" versi mod dari situs tidak resmi ternyata mencuri data atau memunculkan iklan tanpa henti.
- **Worm (Cacing)**: Malware yang bisa menyebar sendiri tanpa kamu mengklik apa pun, biasanya lewat jaringan internet.
- **Spyware**: Malware yang diam-diam mengintai aktivitasmu, misalnya mencatat tombol yang kamu tekan (pencuri kata sandi).

### Hati-Hati dengan Wi-Fi Publik
Wi-Fi publik adalah internet gratis yang sering tersedia di kafe, taman, atau tempat umum. Tidak semua Wi-Fi publik itu aman! Karena jalannya terbuka, **data yang kamu kirim bisa disadap (dicuri) orang lain** yang berada di jaringan yang sama.

Risiko Wi-Fi publik:
- Data pribadi dan kata sandi yang kamu ketik bisa dicuri.
- Akunmu bisa diretas jika kamu masuk ke aplikasi penting.

Cara mengamankan diri saat terpaksa memakai Wi-Fi publik:
- **Hindari membuka akun penting** (bank, email utama, akun sekolah).
- **Gunakan VPN** (Virtual Private Network) jika ada — VPN membuat koneksi internetmu jadi seperti "terowongan rahasia" yang sulit disadap. (Mintai bantuan orang tua untuk memasangnya.)
- Lebih baik gunakan **Wi-Fi rumah** atau **data seluler** untuk kegiatan penting.

### Tanda Website (Situs) yang Aman
Sebelum memasukkan data atau sekadar membaca, periksa apakah situsnya aman:
- Ada **ikon gembok (🔒)** di sebelah alamat situs (address bar).
- Alamatnya diawali **https://** (huruf "s" berarti secure/aman).
- Tidak memunculkan pop-up aneh atau memaksa mengunduh sesuatu.

*Ingat: meskipun ada gembok, kamu tetap tidak boleh membagikan data pribadi sembarangan, ya!*

  **Pesan Digi:**
"Di dunia digital, kamu adalah kapten kapalnya! Gunakan perisai 4P (Pause, Periksa, Pikirkan, Putuskan). Jika melihat yang aneh, menakutkan, atau memaksa, jangan ragu untuk menutupnya dan bercerita kepada orang tuamu. Selamat menjelajah dengan aman!"`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Trojan adalah malware yang...",
          options: [
            {
              id: "a",
              text: "Berbentuk seperti kuda",
              isCorrect: false
            },
            {
              id: "b",
              text: "Berpura-pura menjadi aplikasi bagus tapi sebenarnya berbahaya",
              isCorrect: true
            },
            {
              id: "c",
              text: "Hanya menyerang komputer besar",
              isCorrect: false
            },
            {
              id: "d",
              text: "Tidak berbahaya sama sekali",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Tanda bahwa sebuah website aman adalah...",
          options: [
            {
              id: "a",
              text: "Warnanya menarik",
              isCorrect: false
            },
            {
              id: "b",
              text: "Ada banyak iklan",
              isCorrect: false
            },
            {
              id: "c",
              text: "Ada ikon gembok () di address bar dan alamatnya benar",
              isCorrect: true
            },
            {
              id: "d",
              text: "Muncul pop-up yang menjanjikan hadiah",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Mengapa kita harus berhati-hati saat menggunakan Wi-Fi publik? Sebutkan 2 risikonya dan cara mengatasinya!",
          correctAnswer: "Risiko: data bisa dicuri, akun bisa diretas. Cara mengatasi: hindari membuka akun penting, gunakan VPN, gunakan Wi-Fi rumah.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `## Studi Kasus Keamanan Siber di Dunia Nyata

Mari kita amati dua kasus nyata yang sering menimpa anak-anak di internet berikut ini:

### Kasus 1: Riko dan Aplikasi "Gratis" (Trojan & Virus)
Riko ingin mengunduh game populer yang seharusnya berbayar. Temannya memberikan link untuk mengunduh versi "gratis" dari website tidak dikenal. Setelah Riko mengunduh dan menginstal game tersebut:
1. HP Riko menjadi sangat lambat.
2. Muncul banyak iklan pop-up yang tidak bisa ditutup.
3. Pulsa gawai orang tuanya terpotong secara otomatis tanpa sebab.
4. Foto-foto dan kontak di HP Riko disadap dan dikirim ke orang tak dikenal.

Ternyata, game "gratis" itu adalah **Trojan** — malware berbahaya yang menyamar sebagai game seru!

---

### Kasus 2: Adit dan Jebakan Top-Up Game Murah (Eksploitasi & Penipuan Komersial)
Adit sangat ingin membeli kostum (skin) baru di game online favoritnya. Ia melihat iklan di media sosial yang menawarkan: *"Promo Spesial: 5000 Diamond hanya Rp 10.000! Klik www.topup-murah-meriah.com"*. Padahal di toko resmi game, harganya Rp 150.000.

Tergiur dengan harga yang sangat murah, Adit mengeklik tautan tersebut. Di sana, ia diminta untuk:
1. Memasukkan username dan password akun game miliknya.
2. Memasukkan nomor handphone orang tuanya beserta kode PIN dompet digital (e-wallet) ShopeePay untuk pembayaran.

Setelah mengisi semua data tersebut, Adit tidak pernah mendapatkan Diamond game-nya. Sebaliknya, keesokan harinya:
1. Akun game Adit tidak bisa dibuka karena kata sandinya diubah oleh penipu (akunnya dicuri).
2. Saldo ShopeePay milik ibunya terkuras habis oleh transaksi belanja misterius dari luar kota.

Ternyata, situs tersebut adalah situs **Phishing** yang mengeksploitasi keinginan anak-anak untuk membeli item game demi mencuri uang dan akun!`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Apa bahaya utama yang dialami Riko dan Adit akibat menginstal aplikasi tidak resmi dan melakukan top-up ilegal?",
          options: [
            {
              id: "a",
              text: "HP menjadi cepat penuh karena game yang diinstal terlalu bagus",
              isCorrect: false
            },
            {
              id: "b",
              text: "HP terinfeksi malware/virus, akun dicuri, dan uang orang tua terkuras habis",
              isCorrect: true
            },
            {
              id: "c",
              text: "Grup chat sekolah menjadi penuh karena teman-teman ikut meminta diajarkan",
              isCorrect: false
            },
            {
              id: "d",
              text: "Game menjadi tidak bisa dimainkan bersama teman sekelas lagi",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Tanda utama yang menunjukkan bahwa situs top-up Diamond game tempat Adit membeli adalah penipuan (phishing) adalah....",
          options: [
            {
              id: "a",
              text: "Harga Diamond yang ditawarkan sangat tidak masuk akal murahnya dan meminta password akun serta PIN dompet digital",
              isCorrect: true
            },
            {
              id: "b",
              text: "Warna halaman situs web dominan merah dan menggunakan banyak gambar kartun",
              isCorrect: false
            },
            {
              id: "c",
              text: "Situs web tersebut memuat game-game populer yang biasa dimainkan anak-anak",
              isCorrect: false
            },
            {
              id: "d",
              text: "Situs web dapat dibuka di browser HP maupun Chromebook sekolah",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Tuliskan 3 perbedaan utama antara tempat top-up game resmi dengan situs top-up ilegal milik penipu!",
          correctAnswer: "Top-up resmi dilakukan di platform resmi (seperti Codashop/UniPin/toko dalam game), tidak pernah meminta password akun game atau PIN dompet digital, harganya wajar. Top-up ilegal meminta password/PIN, menawarkan harga yang terlampau murah, dan menggunakan tautan tidak resmi/mencurigakan.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Menghadapi Ancaman Siber 

Dalam simulasi ini, kamu akan menjadi **Ksatria Siber** yang harus melindungi perangkat dari berbagai ancaman!

Kamu akan:
1. Mengidentifikasi link yang aman dan berbahaya
2. Menutup pop-up palsu dengan benar
3. Memilih aplikasi yang aman untuk diunduh
4. Melindungi perangkat dari serangan malware

Semakin banyak ancaman yang berhasil kamu atasi, semakin tinggi skor Ksatria Sibermu! `,
      simulationId: "keamanan-siber"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Pilihlah jawaban (A, B, C, atau D) yang paling tepat berdasarkan situasi di bawah ini!",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Dalam materi, tautan atau link diibaratkan seperti sebuah \"pintu\" di dunia maya. Mengapa kita tidak boleh sembarangan membuka pintu tersebut?",
          options: [
            {
              id: "a",
              text: "Karena tautan dapat mengalihkan kita ke halaman yang tidak sesuai tujuan belajar.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena tautan dari orang tidak dikenal boleh dibuka setelah banyak teman membahasnya.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Karena ada tautan jebakan yang bisa membawa kita ke halaman berbahaya atau mencuri data pribadi.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Karena tautan pendek lebih sulit dibaca daripada tautan yang panjang.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Mengapa pesan seperti itu mencurigakan?",
          context: `Budi sedang bermain gim. Tiba-tiba muncul pesan:

"Awas! Akunmu akan dihapus selamanya dalam 5 menit jika kamu tidak mengeklik tautan ini!"`,
          options: [
            {
              id: "a",
              text: "Karena pesan itu membuat Budi panik agar langsung mengeklik tanpa berpikir.",
              isCorrect: true
            },
            {
              id: "b",
              text: "Karena pesan itu membantu Budi menjaga akun dengan cara yang cepat.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Karena pesan itu sebaiknya dicoba dulu sebelum Budi bertanya kepada orang dewasa.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Karena pesan yang memberi batas waktu biasanya berasal dari sistem resmi.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Saat sedang menggeser layar TikTok, Siska melihat video orang dewasa melakukan tantangan berbahaya, yaitu melompat dari atap rumah. Tindakan paling tepat yang harus Siska lakukan adalah....",
          options: [
            {
              id: "a",
              text: "Menonton video itu sampai selesai agar dapat menilai sendiri bahayanya.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Memberi tanda suka agar video itu mudah ditemukan lagi saat ingin melapor.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Menulis komentar panjang agar pembuat video tahu bahwa tindakannya berbahaya.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menggeser video tersebut, memilih \"Tidak Tertarik\" jika tersedia, dan memberi tahu orang tua.",
              isCorrect: true
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Jika kamu menerapkan langkah Periksa dari jurus 4P, kesimpulan yang paling tepat adalah....",
          context: `Kamu mendapat pesan di grup WhatsApp:

"Kabar gembira! Dapatkan kuota gratis 50GB seumur hidup! Klik: www.ku0t4-gratis-b4nget.site"`,
          options: [
            {
              id: "a",
              text: "Pesan itu cukup aman karena dikirim oleh teman di grup WhatsApp.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Pesan itu mencurigakan karena alamat tautannya aneh dan hadiah yang ditawarkan terlalu berlebihan.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Pesan itu boleh dicek dengan membuka tautannya sebentar tanpa mengisi data.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Pesan itu perlu dibagikan dulu agar teman lain ikut memeriksa kebenarannya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Seorang \"Kapten Penjelajah Digital\" harus menguasai jurus 4P. Apa tujuan utama dari langkah pertama, yaitu Pause atau berhenti sebentar?",
          options: [
            {
              id: "a",
              text: "Menunggu sebentar agar rasa penasaran berkurang sebelum membaca ulang pesan.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menahan diri agar tidak terburu-buru mengeklik dan punya waktu untuk berpikir.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengambil tangkapan layar lalu menanyakan pendapat teman sebaya lebih dulu.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Membaca pesan dengan cepat agar keputusan bisa segera diambil.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Jika tombol itu berasal dari situs yang tidak jelas, risiko terbesar jika diklik adalah....",
          context: `Ketika membaca situs cerita anak, tiba-tiba muncul tombol hijau besar berkedip-kedip bertuliskan:

"DOWNLOAD SEKARANG!"`,
          options: [
            {
              id: "a",
              text: "Perangkat bisa mengunduh aplikasi berbahaya atau terkena virus.",
              isCorrect: true
            },
            {
              id: "b",
              text: "Halaman cerita bisa tertutup dan membuat tugas membaca menjadi terganggu.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Tombol itu mungkin membawa kita ke halaman lain yang tidak berkaitan dengan cerita.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Perangkat mungkin menampilkan banyak pilihan yang membuat kita bingung.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Dika melihat sebuah tautan yang menjanjikan diamond gratis untuk gim kesukaannya. Namun, tautan itu meminta Dika memasukkan kata sandi akunnya. Jika Dika melakukan langkah Pikirkan Risiko, apa yang seharusnya ia pikirkan?",
          options: [
            {
              id: "a",
              text: "\"Mungkin kata sandi diperlukan agar hadiah bisa dikirim ke akunku.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Aku bisa mengisi kata sandi setelah memastikan link ini dibagikan teman.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Kalau aku isi kata sandi, akun game-ku bisa dicuri orang tidak dikenal.\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Aku perlu mencoba akun cadangan dulu untuk melihat apakah hadiahnya benar.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Doni sering melihat konten berisi kata-kata kasar muncul di beranda Instagram Reels-nya. Menurut materi, apa dampak buruk jika Doni terus menonton konten seperti itu?",
          options: [
            {
              id: "a",
              text: "Doni bisa terbiasa melihat kata kasar dan tanpa sadar menirunya.",
              isCorrect: true
            },
            {
              id: "b",
              text: "Doni bisa memahami gaya bahasa internet tanpa harus ikut menirunya.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Doni tetap aman selama hanya menonton dan tidak menulis komentar.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Doni dapat membiarkan konten itu karena nanti akan hilang dari beranda.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Karena tidak sengaja tersentuh saat HP-nya terjatuh, layar HP Rina membuka situs bergambar menyeramkan dan meminta izin lokasi. Tindakan penyelamatan terbaik adalah....",
          options: [
            {
              id: "a",
              text: "Menekan \"Setuju\" agar dapat segera kembali ke halaman sebelumnya.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Memberi izin lokasi sebentar, lalu menutup situs setelah selesai.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Tidak menekan tombol apa pun, segera menutup halaman, dan memberi tahu orang tua.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Mengirim tangkapan layar ke grup kelas agar teman ikut memberi saran.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Banyak anak takut memberi tahu orang tua jika tidak sengaja mengeklik tautan berbahaya karena takut dimarahi. Padahal, berani melapor kepada orang dewasa menunjukkan bahwa anak tersebut adalah....",
          options: [
            {
              id: "a",
              text: "Anak yang belum mandiri karena masih membutuhkan bantuan orang dewasa.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Anak yang bertanggung jawab karena berusaha melindungi diri dan perangkatnya.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Anak yang perlu menyembunyikan kesalahan kecil agar tidak membuat orang tua khawatir.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Anak yang cukup menghapus riwayat pencarian sebelum memakai perangkat lagi.",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar mengenali ancaman siber dan jurus 4P. Profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh) menjadi panduanmu. Pada topik ini, kamu melatih sikap **Aman** dan **Bijak** sebelum menekan tautan. Renungkan dan jawab dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu hampir mengklik tautan atau pesan mencurigakan? Apa yang menghentikanmu?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana kamu akan menerapkan jurus 4P (Pause, Periksa, Pikirkan, Putuskan) mulai hari ini?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 5 – Santun Berbicara di Dunia Digital
 ═══════════════════════════════════════════════ */
const topic5: Topic = {
  id: "topik-5",
  number: 5,
  title: "Santun Berbicara di Dunia Digital",
  description: "Belajar berkomunikasi dengan sopan dan bertanggung jawab di dunia online.",
  icon: "message-circle",
  color: "bg-sky-500",
  backgroundImageUrl: "/gambar/Topik%205/Cover_Topik_5.png",
  badgeId: "badge-duta-santun",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari topik ini, kamu diharapkan mampu:

1. Menganalisis dampak penggunaan kata, komentar, emoji dan gaya penulisan terhadap emosi orang lain di dunia digital.
2. Membedakan karakteristik komentar atau pesan yang etis (baik) dan tidak etis (kurang baik) secara kritis.
3. Mengevaluasi kelayakan sebuah pesan dengan cermat sebelum memutuskan untuk mengirimkannya.
4. Menyusun kalimat atau balasan yang sopan saat berkomunikasi di berbagai platform digital.

Di balik layar HP atau komputer, ada manusia sungguhan yang bisa merasa sedih, senang, atau tersakiti oleh kata-katamu. Yuk, jadi pengguna internet yang santun! `
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Netiket (Netiquette)** – Etika atau tata krama saat berkomunikasi di internet.

 **Cyberbullying** – Perundungan (bullying) yang dilakukan melalui media digital seperti chat, media sosial, atau game online.

 **Empati** – Kemampuan untuk merasakan dan memahami perasaan orang lain.

 **Hate Speech** – Ujaran kebencian; kata-kata yang menyerang seseorang karena ras, agama, atau perbedaan lainnya.

 **Flaming** – Mengirim pesan yang kasar, provokatif, atau menghina secara online.

 **Tone** – Nada atau cara menyampaikan pesan. Di pesan teks, tone bisa disalahartikan karena tidak ada ekspresi wajah.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita tentang komunikasi di dunia digital.
 Tahap 2: Menjawab tantangan awal – Sopankah cara chatting-mu?
 Tahap 3: Belajar tentang netiket, komunikasi yang baik, dan tiga pertanyaan sebelum mengirim.
 Tahap 4: Latihan memahami – Cyberbullying dan cara merespons pesan jahat.
 Tahap 5: Mengamati studi kasus grup chat kelas 6A.
 Tahap 6: Bereksplorasi dalam simulasi Chat dengan Bijak.
 Tahap 7: Uji pemahaman akhir dan refleksi.

Jadilah Duta Santun Digital! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Jawablah pertanyaan reflektif berikut berdasarkan cerita di atas.",
      passage: `**Komunikasi di Dunia Digital**

Pernahkah kamu mengirim pesan kepada teman melalui WhatsApp, grup kelas, kolom komentar, gim online, atau aplikasi lainnya?

Coba ingat-ingat. Saat belajar bersama, mungkin kamu pernah mengirim pesan seperti, "Tugasnya apa?" atau "Kirim fotonya, dong." Saat bermain gim, mungkin kamu pernah membaca komentar teman seperti, "Cepatlah!" atau "Kamu lama sekali!" Kadang, pesan seperti itu membuat kita bingung. Apakah teman kita benar-benar marah, bercanda, atau hanya terburu-buru?

Di dunia digital, kita sering berkomunikasi melalui tulisan. Kita tidak selalu bisa melihat wajah, mendengar suara, atau mengetahui perasaan orang yang membaca pesan kita. Karena itu, kata-kata yang kita tulis bisa saja dipahami berbeda oleh orang lain.

Misalnya, kalimat "Kamu kok lama?" bisa membuat teman merasa disalahkan. Namun, jika ditulis menjadi "Tidak apa-apa, aku tunggu, ya," pesan itu terdengar lebih ramah.

Begitu juga saat memberi komentar. Komentar yang kasar dapat membuat orang lain sedih, malu, atau tidak percaya diri. Sebaliknya, komentar yang sopan dapat membuat teman merasa dihargai.

Hari ini, kamu akan belajar cara berkomunikasi dengan santun di dunia digital. Kamu akan berlatih memilih kata, memperbaiki pesan yang kurang sopan, dan menulis komentar yang baik agar percakapan digital menjadi lebih nyaman.`,
      mediaType: "image",
      mediaUrl: "/komentar_baik_kasar.png",
      mediaLayout: "above",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu merasa sedih atau marah karena pesan yang dikirim seseorang di chat atau media sosial? Atau pernahkah kamu tidak sengaja menyakiti perasaan seseorang lewat pesan? Ceritakan!",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Netiket adalah...",
          options: [
            {
              id: "a",
              text: "Tiket untuk masuk ke internet",
              isCorrect: false
            },
            {
              id: "b",
              text: "Etika atau tata krama saat berkomunikasi di internet",
              isCorrect: true
            },
            {
              id: "c",
              text: "Nama sebuah aplikasi chatting",
              isCorrect: false
            },
            {
              id: "d",
              text: "Jenis koneksi internet",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Menulis pesan dengan HURUF BESAR SEMUA di internet artinya...",
          options: [
            {
              id: "a",
              text: "Tulisan lebih jelas dibaca",
              isCorrect: false
            },
            {
              id: "b",
              text: "Sama saja dengan menulis biasa",
              isCorrect: false
            },
            {
              id: "c",
              text: "Seperti berteriak dan bisa dianggap tidak sopan",
              isCorrect: true
            },
            {
              id: "d",
              text: "Menunjukkan bahwa kamu pintar",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## A. Apa Itu Komunikasi Digital?
Pernahkah kamu mengirim pesan di grup kelas, membalas WhatsApp teman, menulis komentar di video, atau memberi tanggapan pada karya teman di aplikasi belajar?

Kegiatan seperti itu disebut komunikasi digital. Komunikasi digital adalah kegiatan menyampaikan pesan menggunakan perangkat digital, seperti HP, Chromebook, komputer, atau tablet. Pesan itu bisa dikirim melalui WhatsApp, email, grup kelas, kolom komentar, gim online, atau aplikasi belajar.

Dalam komunikasi langsung, kita bisa melihat wajah, mendengar nada suara, dan memperhatikan gerak tubuh orang lain. Namun, dalam komunikasi digital, orang lain biasanya hanya membaca tulisan kita. Karena itu, pesan yang kurang jelas bisa membuat orang lain salah paham.

![Kesalahpahaman Chat](/kesalahpahaman_chat.png)

Perhatikan contoh berikut.

[table: Pesan Kurang Tepat, Pesan Lebih Santun | "Kamu lama banget balasnya!" | "Kamu sudah sempat membaca pesanku? Aku menunggu jawabanmu\, ya." ]

Kedua pesan itu memiliki tujuan yang hampir sama, yaitu menanyakan balasan. Namun, rasanya berbeda. Pesan pertama terdengar seperti marah. Pesan kedua terdengar lebih sopan dan nyaman dibaca.

Dalam dunia digital, kita perlu mengenal netiket atau etika berinternet. Netiket berarti aturan sopan santun saat berkomunikasi di internet, termasuk saat mengirim pesan, menulis komentar, berdiskusi, atau membalas unggahan orang lain.

## B. Mengapa Kita Harus Santun di Dunia Digital?
Dunia digital bukan tempat yang terpisah dari kehidupan nyata. Orang yang membaca pesan kita juga memiliki perasaan. Komentar yang kasar dapat membuat orang lain sedih, malu, marah, atau kehilangan semangat.

Misalnya, saat teman mengunggah hasil gambar, lalu ada yang menulis, "Jelek sekali gambarmu!" Teman itu bisa merasa malu dan tidak percaya diri. Padahal, kita tetap bisa memberi saran dengan cara yang lebih baik.

Selain itu, pesan digital dapat tersimpan. Komentar, foto, pesan, dan unggahan yang kita kirim dapat menjadi bagian dari jejak digital. Jejak digital adalah rekaman atau bekas aktivitas yang kita lakukan di dunia digital. UNICEF juga menjelaskan bahwa perundungan siber dapat meninggalkan jejak digital yang menjadi catatan atau bukti dari tindakan tersebut.

Karena itu, sebelum menekan tombol kirim, kita perlu berpikir terlebih dahulu.

![Jejak Digital Chat](/jejak_digital_chat.png)

### Kenapa Netiket Sangat Penting di Zaman Sekarang?
1. **Ada Manusia Nyata di Balik Layar:** Setiap akun di internet dibaca oleh orang sungguhan yang memiliki hati dan perasaan. Kata-kata kasar kita bisa membuat mereka sedih atau kehilangan percaya diri.
2. **Jejak Digital Bersifat Abadi:** Apa pun yang kamu tulis hari ini akan terekam selamanya di internet. Jejak digital yang buruk bisa dilihat kembali di masa depan ketika kamu mendaftar sekolah, beasiswa, atau melamar kerja.
3. **Teks Sangat Mudah Disalahpahami:** Karena tidak ada ekspresi wajah dan nada suara dalam chat, teks biasa (terutama jika menggunakan huruf kapital atau tanda seru berlebih) bisa dikira sebagai teriakan atau kemarahan.
4. **Mencegah Perundungan Siber (Cyberbullying):** Netiket menjaga agar candaan di internet tetap sehat dan tidak berubah menjadi ejekan kasar atau perundungan yang menyakitkan.

Santun di dunia digital berarti:
1. Menggunakan kata-kata yang baik;
2. Tidak mengejek atau merendahkan orang lain;
3. Tidak menulis komentar kasar;
4. Tidak menyebarkan pesan yang mempermalukan teman;
5. Menghargai pendapat dan karya orang lain;
6. Berpikir sebelum mengirim pesan.

Ingat, komunikasi digital yang baik membantu kita menjadi pengguna teknologi yang bijak, aman, dan bertanggung jawab. Keterampilan kewargaan digital juga membantu anak membuat pilihan yang cerdas, berpikir kritis, dan membangun kebiasaan sehat saat menggunakan teknologi.

## C. Komentar yang Baik Itu Seperti Apa?
Komentar yang baik bukan berarti harus selalu memuji. Kita boleh memberi saran, tetapi saran itu harus disampaikan dengan sopan.

Komentar yang sopan biasanya memiliki tiga ciri.
Pertama, tidak menyakiti perasaan orang lain.
Kedua, menggunakan bahasa yang jelas dan baik.
Ketiga, membantu teman menjadi lebih baik.

Perhatikan contoh berikut.

[table: Komentar Kurang Santun, Komentar Lebih Santun | "Video kamu membosankan." | "Videonya sudah bagus. Mungkin bisa dibuat lebih singkat agar lebih menarik." | "Tulisanmu jelek." | "Tulisanmu bisa dibuat lebih rapi agar mudah dibaca." | "Kamu salah semua." | "Ada beberapa bagian yang perlu diperbaiki. Yuk\, coba cek lagi." | "Kok kamu tidak paham-paham?" | "Bagian mana yang masih membingungkan? Mungkin kita bisa belajar bersama." ]

Kata-kata yang santun tidak membuat orang lain takut belajar. Sebaliknya, kata-kata yang baik dapat membuat teman lebih bersemangat.

Sebelum menulis komentar, coba tanyakan kepada dirimu sendiri.
- Apakah komentarku sopan?
- Apakah komentarku membantu?
- Apakah komentarku membuat teman merasa dihargai?

Jika jawabannya belum, perbaiki dulu kalimatmu sebelum dikirim.

## D. Hati-Hati dengan Huruf Kapital, Emoji, dan Tanda Seru
Saat menulis pesan, bukan hanya kata-kata yang perlu diperhatikan. Cara mengetik juga dapat memengaruhi arti pesan.

Perhatikan contoh berikut.

[table: Pesan Kurang Tepat, Pesan Lebih Santun | "AKU TUNGGU SEKARANG!!!" | "Aku tunggu sekarang\, ya. Terima kasih." ]

Kalimat dengan huruf kapital semua dan banyak tanda seru bisa terasa seperti marah atau memaksa. Padahal, mungkin maksud pengirim hanya ingin mengingatkan.

Emoji juga perlu digunakan dengan tepat. Emoji tertawa bisa terasa lucu jika digunakan pada waktu yang sesuai. Namun, jika teman sedang sedih lalu kita mengirim emoji tertawa, teman bisa merasa tidak dihargai.

Jadi, sebelum mengirim pesan, perhatikan:
1. Kata-katanya;
2. Tanda bacanya;
3. Penggunaan huruf kapital;
4. Emoji yang digunakan;
5. Perasaan orang yang akan membaca pesan itu.

## E. Tiga Pertanyaan Sebelum Mengirim Pesan
Sebelum menekan tombol kirim, gunakan tiga pertanyaan berikut.
1. Apakah pesanku benar? (Jangan menyebarkan informasi yang belum jelas)
2. Apakah pesanku sopan? (Jangan memakai kata-kata kasar, mengejek, atau merendahkan)
3. Apakah pesanku perlu dikirim? (Jika pesan itu hanya membuat orang lain malu atau sedih, lebih baik tidak dikirim)

Contoh:

[table: Situasi, Pesan yang Kurang Tepat, Pesan yang Lebih Baik | Teman terlambat membalas pesan | "Lama banget sih!" | "Tidak apa-apa\, aku tunggu balasanmu\, ya." | Teman salah mengirim tugas | "Kamu salah semua." | "Sepertinya ada bagian yang perlu diperbaiki. Coba cek lagi\, ya." | Teman mengunggah gambar | "Gambarmu jelek." | "Gambarmu sudah menarik. Mungkin warnanya bisa dibuat lebih rapi." ]

### Pesan Digi
"Di dunia digital, kata-kata juga bisa membuat orang lain senang atau sedih. Jadi, sebelum mengirim pesan, pilih kata yang baik, sopan, dan tidak menyakiti."`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Berikut yang termasuk cyberbullying adalah...",
          options: [
            {
              id: "a",
              text: "Mengirim ucapan selamat ulang tahun",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menyebarkan foto memalukan teman tanpa izin",
              isCorrect: true
            },
            {
              id: "c",
              text: "Bertanya tentang PR di grup",
              isCorrect: false
            },
            {
              id: "d",
              text: "Membagikan link artikel menarik",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Saat menerima pesan jahat dari seseorang, sebaiknya kamu...",
          options: [
            {
              id: "a",
              text: "Membalas dengan kata-kata yang lebih jahat",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menyebarkannya ke semua teman",
              isCorrect: false
            },
            {
              id: "c",
              text: "Screenshot, blokir pelaku, dan ceritakan ke orang tua/guru",
              isCorrect: true
            },
            {
              id: "d",
              text: "Menghapus pesan dan berpura-pura tidak terjadi apa-apa",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Mengapa berkomunikasi di internet perlu lebih berhati-hati dibanding berbicara langsung? Berikan 2 alasan!",
          correctAnswer: "Karena tidak bisa melihat ekspresi wajah/nada suara, pesan bisa disalahartikan, dan pesan tersimpan selamanya.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `## A. Kamus Istilah Gamer (Gamer Glossary)
Saat bermain game online, apakah kamu sering mendengar istilah-istilah berikut? Yuk, pahami artinya:
- **GGWP (Good Game Well Played)**: Pujian sportif untuk menghargai permainan yang seru dan bagus dari teman maupun lawan. (Sikap Positif)
- **Buff**: Peningkatan kekuatan karakter atau item oleh pembuat game. (Netral)
- **AFK (Away From Keyboard)**: Pemain yang diam saja atau meninggalkan permainan di tengah jalan secara tidak bertanggung jawab. (Negatif/Menyusahkan)
- **Toxic**: Perilaku buruk seperti berkata kasar, menghina teman, dan merusak kenyamanan bermain bersama. (Negatif/Kasar)
- **Noob**: Ejekan untuk pemain baru yang dianggap tidak jago atau cupu. (Negatif/Hinaan)
- **Beban**: Ejekan untuk teman satu tim yang dianggap bermain buruk dan menyebabkan tim kalah. (Negatif/Hinaan)
- **Turu**: Kata ejekan (berarti tidur) untuk meremehkan lawan yang dikalahkan dengan telak. (Negatif/Meremehkan)
- **Ez / Easy**: Ejekan sombong untuk meremehkan lawan karena dianggap terlalu gampang dikalahkan. (Negatif/Sombong)
- **KS (Kill Steal / Nyampah)**: Merebut poin eliminasi yang seharusnya menjadi milik teman satu tim. (Negatif/Kurang Sportif)
- **Smurf**: Pemain tingkat tinggi yang menggunakan akun baru untuk melawan pemula secara tidak adil. (Negatif/Kurang Sportif)

---

## B. Papan "Mabar Bingo" (Memilah Kata Positif vs Negatif)
Mari kita pilah istilah-istilah di atas menggunakan format tabel [table: Kolom1, Kolom2...]:

[table: Istilah Game, Kategori Perilaku, Dampak / Penjelasan Sikap | **GGWP** | **Positif & Sportif** | Memupuk persahabatan dan menghargai usaha orang lain | **Buff & Nerf** | **Istilah Teknis (Netral)** | Digunakan untuk membahas mekanik game\, bukan mengejek | **Toxic & Beban** | **Negatif (Bahaya & Kasar!)** | Membuat teman sakit hati\, merasa tertekan\, dan tidak mau bermain lagi | **Turu & Ez** | **Negatif (Sombong & Ejekan)** | Merendahkan lawan secara online dan merusak sportivitas | **AFK & KS** | **Negatif (Kurang Sportif)** | Menyusahkan tim sendiri dan memicu pertengkaran di chat ]

---

## C. Studi Kasus: Grup Chat Kelas
Di grup WhatsApp kelas 6A, terjadi percakapan berikut:

> **Adi:** "Hei semuanya, siapa yang bisa bantu PR Matematika?"
> **Bela:** "Aku juga belum bisa "
> **Caca:** "KALIAN BODOH BANGET SIH. MASA PR GITU AJA GAK BISA "
> **Doni:** "Caca, jangan gitu. Kita semua belajar. Gak ada yang bodoh."
> **Eka:** "Iya, aku juga baru belajar. Yuk kita kerjakan bareng!"
> **Caca:** "Aku cuma bercanda kok "

### Analisis:
- **Caca** menggunakan huruf besar dan kata-kata yang merendahkan. Meski dia bilang "bercanda", kata-katanya bisa menyakiti perasaan Adi dan Bela.
- **Doni** memberikan respons yang tepat — mengingatkan dengan sopan tanpa membalas kasar.
- **Eka** menunjukkan sikap positif dengan mengajak belajar bersama.`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Berdasarkan Kamus Istilah Gamer, kata manakah yang memiliki dampak positif dan menunjukkan sportivitas saat bermain game?",
          options: [
            {
              id: "a",
              text: "Ez atau Easy",
              isCorrect: false
            },
            {
              id: "b",
              text: "Noob atau Beban",
              isCorrect: false
            },
            {
              id: "c",
              text: "GGWP (Good Game Well Played)",
              isCorrect: true
            },
            {
              id: "d",
              text: "Turu atau AFK",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Apa yang salah dari pesan Caca di grup chat kelas tersebut?",
          options: [
            {
              id: "a",
              text: "Menggunakan emoji senyum",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menggunakan huruf besar semua (seperti berteriak) dan mengejek kemampuan teman",
              isCorrect: true
            },
            {
              id: "c",
              text: "Membalas pesan Adi terlalu lambat",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menawarkan bantuan PR matematika kepada Bela",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Jika kamu sedang mabar game online dan teman satu timmu membuat kesalahan hingga kalah, apa komentar santun yang sebaiknya kamu kirimkan? Hindari kata toxic!",
          correctAnswer: "Siswa menulis balasan yang membesarkan hati, sportif, atau mengajak latihan lagi. Contoh: 'Nice try guys, nanti kita coba lagi!', 'GGWP semuanya, lain kali kita perbaiki kerja sama tim.'",
          points: 20
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Chat dengan Bijak 

Dalam simulasi ini, kamu akan berlatih berkomunikasi di sebuah chat room simulasi.

Kamu akan:
1. Merespons berbagai situasi chat dengan pilihan jawaban
2. Menunjukkan empati dalam berkomunikasi
3. Menghadapi situasi cyberbullying dan mengambil tindakan yang tepat
4. Mendapatkan skor berdasarkan kesopanan dan kebijakanmu

Tunjukkan bahwa kamu bisa menjadi komunikator digital yang santun dan bijak! `,
      simulationId: "etika-chat"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Jawab semua pertanyaan untuk mendapatkan lencana **Duta Santun Digital** ",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Komunikasi digital sangat berbeda dengan komunikasi langsung. Berdasarkan materi, kekurangan utama dalam komunikasi digital yang membuat kita harus lebih berhati-hati dalam memilih kata adalah....",
          options: [
            {
              id: "a",
              text: "Membutuhkan kuota internet yang besar untuk mengirimkan pesan yang panjang.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Orang lain hanya membaca tulisan tanpa bisa melihat ekspresi wajah dan mendengar nada suara kita.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Pesan digital tidak bisa dihapus dan selalu tersimpan selamanya di dalam perangkat.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Hanya bisa dilakukan menggunakan perangkat canggih seperti Chromebook dan komputer.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Chat tugas kelompok:
Sena: "Kamu lama banget balasnya!"
Naya: "Kamu sudah sempat membaca pesanku? Aku menunggu jawabanmu, ya."`,
          question: "Kedua pesan sama-sama menanyakan balasan. Mengapa pesan Naya lebih tepat menurut materi kesantunan digital?",
          options: [
            {
              id: "a",
              text: "Pesan Naya lebih panjang, sehingga otomatis lebih sopan daripada pesan yang singkat.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Pesan Naya memberi tekanan agar teman segera membalas, tetapi memakai kata yang lebih halus.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Pesan Naya tetap menyampaikan kebutuhan, tetapi lebih menghargai perasaan penerima.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Pesan Naya memakai bahasa yang lebih resmi, jadi pasti cocok untuk semua situasi.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Di aplikasi belajar, Fina mengunggah gambar buatannya. Seorang teman menulis:
"Jelek sekali gambarmu!"`,
          question: "Apa dampak paling mungkin jika komentar itu dikaitkan dengan konsep bahwa dunia digital tetap berhubungan dengan kehidupan nyata?",
          options: [
            {
              id: "a",
              text: "Teman tersebut akan merasa malu, sedih, dan kehilangan semangat, sama seperti jika diucapkan secara langsung.",
              isCorrect: true
            },
            {
              id: "b",
              text: "Dampaknya hanya membuat gambar terlihat kurang menarik di aplikasi belajar.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Komentar itu boleh saja jika pengirimnya merasa sedang memberi penilaian jujur.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Teman tersebut sebaiknya membalas dengan komentar yang sama agar pengirim paham rasanya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Di grup kelas, seorang murid ingin mengirim tangkapan layar pesan temannya agar teman lain ikut tertawa.`,
          question: "Mengapa ia perlu berpikir ulang sebelum mengirimnya, terutama jika dikaitkan dengan jejak digital?",
          options: [
            {
              id: "a",
              text: "Karena tangkapan layar biasanya membuat penyimpanan perangkat lebih cepat penuh.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena tindakan tersebut dapat meninggalkan bekas jejak digital yang tersimpan sebagai bukti atau catatan aktivitas kita.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Karena penyedia layanan internet akan mendenda pengguna yang sering menggunakan kata-kata kasar.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Karena pesan yang sudah dikirim hanya boleh dihapus oleh ketua grup kelas.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          imageUrl: "/komentar_baik_kasar.png",
          question: "Komentar yang baik tidak selalu berisi pujian, tetapi bisa berupa saran. Berdasarkan tiga ciri komentar yang sopan pada materi, manakah dari pilihan berikut yang paling memenuhi kriteria tersebut?",
          options: [
            {
              id: "a",
              text: "\"Idemu bagus, tetapi aku kurang suka warnanya, jadi sebaiknya diganti semua.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Karyamu bagus kok, tidak perlu diperbaiki lagi meskipun ada bagian yang belum jelas.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Idemu sangat kreatif. Namun jika warnanya dibuat lebih cerah, sepertinya akan lebih rapi dan menarik.\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Videomu bisa dipersingkat, tapi menurutku bagian awalnya membosankan sekali.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Sebelum menulis komentar pada unggahan teman, kita disarankan untuk menanyakan beberapa hal kepada diri sendiri. Manakah pertanyaan di bawah ini yang tidak termasuk dalam bahan evaluasi sebelum berkomentar berdasarkan teks?",
          options: [
            {
              id: "a",
              text: "Apakah komentarku akan mendapat banyak likes dari orang lain?",
              isCorrect: true
            },
            {
              id: "b",
              text: "Apakah komentarku membantu teman menjadi lebih baik?",
              isCorrect: false
            },
            {
              id: "c",
              text: "Apakah komentarku membuat teman merasa dihargai?",
              isCorrect: false
            },
            {
              id: "d",
              text: "Apakah bahasaku sudah sopan dan tidak menyakiti?",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Grup kelas sedang mengumpulkan bahan presentasi. Budi menulis:
"AKU TUNGGU SEKARANG!!!"`,
          question: "Mengapa penggunaan huruf kapital semua dan banyak tanda seru seperti itu perlu dihindari?",
          options: [
            {
              id: "a",
              text: "Karena pesan itu bisa terlihat lebih jelas, tetapi membuat diskusi menjadi terlalu cepat.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Karena pesan itu tidak menjelaskan tugas yang harus dikumpulkan oleh anggota kelompok.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Karena kalimat tersebut memberi kesan membentak, marah, atau memaksa kepada pembacanya.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Karena pesan itu memakai tanda seru, sedangkan semua tanda baca sebaiknya tidak digunakan.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Empat murid memakai emoji saat menanggapi pesan teman di grup.`,
          question: "Situasi manakah yang menunjukkan penggunaan emoji yang kurang tepat karena tidak mempertimbangkan perasaan penerima?",
          options: [
            {
              id: "a",
              text: "Mengirim emoji jempol saat menyetujui ide teman dalam diskusi kelompok.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengirim emoji tertawa ketika teman menceritakan bahwa ia sedang sedih karena kalah lomba.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengirim emoji tersenyum untuk mengakhiri percakapan agar terkesan ramah.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Mengirim emoji tepuk tangan saat ada teman yang berhasil menyelesaikan tugasnya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Pesan berantai di grup:
"Besok sekolah libur! Sebarkan cepat!"
Namun belum ada pengumuman dari wali kelas atau sekolah.`,
          question: "Sesuai prinsip \"Apakah pesanku benar?\", apa keputusan terbaik sebelum meneruskan pesan itu?",
          options: [
            {
              id: "a",
              text: "Meneruskan pesan itu sambil menulis \"katanya\" agar tidak dianggap sebagai sumber utama.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Memastikannya terlebih dahulu kepada wali kelas, dan tidak menyebarkannya jika informasinya belum jelas kebenarannya.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Menunggu ada teman lain yang menyebarkan dulu, lalu ikut membagikan jika sudah ramai.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Mengirim ulang pesan itu ke grup kecil saja karena jumlah penerimanya lebih sedikit.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Kamu tidak sengaja memotret teman yang terjatuh. Ekspresinya terlihat lucu, tetapi ia tampak malu.`,
          question: "Berdasarkan filter \"Apakah pesanku perlu dikirim?\", tindakan paling bijak adalah....",
          options: [
            {
              id: "a",
              text: "Mengirimnya ke grup kelas dengan keterangan bercanda agar teman tidak terlalu tersinggung.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menyimpannya sendiri sebagai kenangan, tetapi tidak meminta izin kepada teman tersebut.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Mengirimkannya hanya ke beberapa teman dekat karena tidak diposting secara umum.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Lebih baik tidak dikirim dan dihapus saja, karena pesan tersebut berpotensi membuat temanmu merasa malu.",
              isCorrect: true
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar berkomunikasi dengan santun di dunia digital. Profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh) menjadi panduanmu. Pada topik ini, kamu melatih sikap **Etis** dan **Bijak** dalam memilih kata. Renungkan dan jawab dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah pesanmu disalahpahami atau membuat orang lain sedih? Apa yang akan kamu perbaiki?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana kamu akan menunjukkan sikap santun dan empati saat berkomentar di internet?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 6 – Jadi Teman Baik di Dunia Digital
 ═══════════════════════════════════════════════ */
const topic6: Topic = {
  id: "topik-6",
  number: 6,
  title: "Jadi Teman Baik di Dunia Digital",
  description: "Cara berinteraksi positif di media sosial dan menjadi warga digital yang baik.",
  icon: "users",
  color: "bg-pink-500",
  backgroundImageUrl: "/gambar/topik%206/Cover_Topik_6.png",
  badgeId: "badge-sahabat-digital",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari topik ini, kamu diharapkan mampu:

1. **Menganalisis** dampak emosional (seperti senang, sedih, marah, atau malu) dari kata-kata yang dikirimkan dengan baik.
2. **Mengidentifikasi** bentuk-bentuk perilaku yang dikategorikan sebagai perundungan siber (cyberbullying) dengan tepat.
3. **Menyusun** pesan atau respons tertulis yang sopan dan berempati (peduli) yang positif.

Di dunia digital, kata-kata yang kita kirim bisa membuat orang lain tersenyum atau justru terluka. Yuk, belajar jadi teman baik yang menyebarkan kebaikan! `
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Empati Digital** – Kemampuan memahami dan ikut merasakan perasaan orang lain saat berinteraksi di dunia digital.

 **Cyberbullying (Perundungan Siber)** – Perilaku menyakiti, mengejek, atau mempermalukan orang lain melalui pesan, komentar, atau unggahan di internet.

 **Komentar Sopan** – Tanggapan tertulis yang santun, tidak menyakiti, dan menghargai perasaan orang lain.

 **Pesan Baik** – Pesan yang membangun, mendukung, atau menyenangkan hati orang yang menerimanya.

 **Teman Digital** – Seseorang yang bersikap baik, peduli, dan mendukung orang lain saat berkomunikasi di dunia digital.

 **Tindakan Aman** – Langkah yang tepat saat menghadapi perundungan siber, seperti tidak membalas, menyimpan bukti, dan melapor kepada orang dewasa.

 **Jejak Digital** – Semua jejak yang kita tinggalkan di internet, seperti pesan, komentar, atau unggahan, yang bisa tetap ada dalam waktu lama.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita tentang menjadi teman baik di dunia digital.
 Tahap 2: Menjawab tantangan awal – Seberapa bijak penggunaan medsos-mu?
 Tahap 3: Belajar tentang interaksi positif, cyberbullying, dan digital wellbeing.
 Tahap 4: Latihan memahami – Perilaku positif dan screen time.
 Tahap 5: Bereksplorasi dalam simulasi Jadi Teman Baik Digital.
 Tahap 6: Uji pemahaman akhir dan refleksi.

Jadilah Sahabat Digital yang keren! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Jawablah pertanyaan reflektif berikut berdasarkan bacaan di atas.",
      passage: `**Menjadi Teman Baik di Dunia Digital**

Pernahkah kamu membaca komentar lucu di WhatsApp, TikTok, YouTube, gim online, atau grup kelas? Komentar itu mungkin membuatmu tertawa. Namun, coba pikirkan lagi. Bagaimana jika komentar yang dianggap lucu itu ternyata membuat orang lain merasa sedih, malu, atau tersinggung?

Mungkin kamu juga pernah melihat teman diejek di grup kelas, kolom komentar, atau saat bermain gim online. Ada yang menulis, "Kamu payah!", "Jangan ikut main!", atau "Jawabanmu salah semua!" Bagi penulisnya, kalimat itu mungkin hanya bercanda. Namun, bagi orang yang membacanya, kata-kata itu bisa terasa menyakitkan.

Di dunia digital, kita tidak selalu melihat wajah orang yang membaca pesan kita. Kita juga tidak selalu tahu apakah orang itu sedang senang, sedih, takut, atau malu. Namun, kata-kata yang kita tulis tetap bisa dirasakan oleh orang lain.

Karena itu, sebelum menulis komentar atau mengirim pesan, kita perlu berhenti sebentar dan berpikir:
- "Apakah kata-kataku membuat orang lain merasa nyaman?"
- "Apakah komentarku membantu atau malah menyakiti?"
- "Apakah aku ingin diperlakukan seperti itu juga?"
- "Jika aku berada di posisi teman itu, bagaimana perasaanku?"

Menjadi teman baik di dunia digital berarti tidak ikut mengejek, tidak menyebarkan pesan yang mempermalukan, dan berani memilih kata-kata yang baik. Kita juga bisa membantu teman yang merasa sedih karena komentar orang lain.

Yuk, kita belajar menjadi teman yang peduli, sopan, dan berani melakukan hal baik di dunia digital!`,
      mediaType: "image",
      mediaUrl: "/komentar_baik_kasar.png",
      mediaLayout: "above",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu melihat komentar bercanda teman yang ternyata menyakiti perasaan orang lain? Apa yang kamu lakukan saat itu?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "FOMO (Fear of Missing Out) adalah...",
          options: [
            {
              id: "a",
              text: "Nama aplikasi media sosial baru",
              isCorrect: false
            },
            {
              id: "b",
              text: "Perasaan takut ketinggalan tren atau informasi di media sosial",
              isCorrect: true
            },
            {
              id: "c",
              text: "Fitur keamanan di Instagram",
              isCorrect: false
            },
            {
              id: "d",
              text: "Jenis game online",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Berapa waktu yang disarankan untuk anak usia 11-12 tahun menggunakan layar (di luar keperluan sekolah)?",
          options: [
            {
              id: "a",
              text: "Sepuasnya, tidak ada batasan",
              isCorrect: false
            },
            {
              id: "b",
              text: "Maksimal 1-2 jam per hari",
              isCorrect: true
            },
            {
              id: "c",
              text: "Minimal 8 jam per hari",
              isCorrect: false
            },
            {
              id: "d",
              text: "24 jam nonstop",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## Menjadi Warga Digital yang Baik

Media sosial adalah tempat yang bisa sangat menyenangkan jika digunakan dengan bijak. Namun, kita juga harus waspada terhadap bahaya perundungan siber (cyberbullying) yang dapat menyakiti hati orang lain.

### Dampak Buruk Cyberbullying bagi Korban
Perundungan siber memiliki dampak buruk yang nyata bagi korban:
- **Dampak Emosional**: Merasa sedih, malu, cemas, marah, dan tidak percaya diri.
- **Dampak Fisik**: Memicu stres yang menyebabkan sakit kepala, sakit perut, kelelahan, dan susah tidur.
- **Dampak Sosial**: Menarik diri dari pertemanan, merasa terisolasi, dan takut membuka media sosial.
- **Dampak Akademis**: Konsentrasi belajar terganggu dan nilai-nilai sekolah menurun.

---

### Jurus Penyelamat (Jika Kamu Menjadi Korban)
Jika kamu mengalami cyberbullying, lakukan 4 langkah aman berikut:
1. **STOP (Jangan Membalas)**: Tetap tenang, abaikan pesan kasar, jangan membalas dengan emosi karena pelaku menyukai reaksi tersebut.
2. **SAVE (Simpan Bukti)**: Lakukan tangkapan layar (screenshot) semua pesan, komentar, dan username pelaku sebagai bukti kuat.
3. **BLOCK & REPORT (Blokir & Laporkan)**: Blokir akun pelaku di aplikasi dan gunakan fitur "Laporkan" (Report) di platform digital tersebut.
4. **TALK & REPORT TO TPPK (Bercerita & Laporkan)**: Ceritakan masalah ini ke orang tua dan laporkan resmi kepada Guru Wali Kelas, Guru BK, atau **Tim Pencegahan dan Penanganan Kekerasan (TPPK)** di sekolah.

---

### Saluran Pengaduan Resmi Indonesia (Aduan Konten & KPAI)
Selain TPPK sekolah, jika kamu atau orang tuamu menemukan konten berbahaya (seperti pornografi, judi online, kekerasan, atau bully parah), laporkan secara resmi ke saluran pengaduan pemerintah:

* **WhatsApp Resmi Aduan Konten KOMDIGI:**
[tombol-link: Hubungi WhatsApp Aduan Konten | https://wa.me/628119224545]
* **Situs Web Aduan Konten KOMDIGI:**
[tombol-link: Kunjungi aduankonten.id | https://aduankonten.id]
* **Pengaduan Online KPAI (Komisi Perlindungan Anak Indonesia):**
[tombol-link: Laporkan Ke KPAI | https://pengaduan.kpai.go.id]

---

### Jurus Pahlawan (Jika Melihat Teman Di-bully)
Jangan diam menjadi penonton! Ubah dirimu menjadi **Upstander (Pahlawan Penolong)** dengan 5 cara aman ini:
1. **Beri Dukungan Pribadi (Private Support)**: Kirim pesan pribadi (japri) untuk menghibur korban ("Kamu tidak apa-apa? Aku mendukungmu!").
2. **Alihkan Perhatian (Distraction)**: Ubah topik pembicaraan di grup WhatsApp kelas menjadi hal positif yang seru untuk menghentikan ejekan.
3. **Tegur dengan Sopan tapi Tegas**: Beri teguran santun di kolom komentar ("Teman-teman, yuk stop ejek-ejekannya. Kasihan dia").
4. **Jangan Ikut Meramaikan**: Jangan memberikan "Like" pada komentar jahat, jangan share ulang, dan jangan ikut tertawa.
5. **Laporkan Bersama (Report to TPPK/Sekolah)**: Laporkan bukti screenshot bully kepada Guru Wali Kelas, Guru BK, atau **TPPK** sekolah agar pelaku ditindaklanjuti.

---

### Menjaga Kesehatan Digital (Digital Wellbeing)

#### Atur Waktu Layar (Screen Time)
- Batasi penggunaan HP/tablet di luar keperluan sekolah
- Pakai fitur "Screen Time" atau "Digital Wellbeing" di HP-mu
- Buat jadwal: kapan online dan kapan offline

#### Keseimbangan Online dan Offline
- Luangkan waktu untuk aktivitas di luar rumah
- Bermain dengan teman di dunia nyata juga penting!
- Olahraga, membaca buku, atau melakukan hobi offline

#### Jaga Kesehatan Mental
- Jangan bandingkan hidupmu dengan postingan orang lain
- Ingat: orang biasanya hanya membagikan sisi terbaik mereka di media sosial
- Jika merasa sedih atau cemas karena media sosial, ceritakan ke orang tua atau guru`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Contoh perilaku positif di media sosial adalah...",
          options: [
            {
              id: "a",
              text: "Membandingkan diri dengan orang lain",
              isCorrect: false
            },
            {
              id: "b",
              text: "Memberikan komentar positif pada karya teman",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengikuti semua challenge meski berbahaya",
              isCorrect: false
            },
            {
              id: "d",
              text: "Online 24 jam tanpa istirahat",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Digital wellbeing berarti...",
          options: [
            {
              id: "a",
              text: "Menggunakan HP sebanyak mungkin",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menjaga keseimbangan dan kesehatan dalam menggunakan teknologi",
              isCorrect: true
            },
            {
              id: "c",
              text: "Memiliki HP yang paling mahal",
              isCorrect: false
            },
            {
              id: "d",
              text: "Tidak boleh menggunakan internet sama sekali",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Mengapa penting untuk membatasi waktu layar (screen time)? Sebutkan 2 dampak negatif jika terlalu lama bermain HP!",
          correctAnswer: "Dampak: kesehatan mata terganggu, kurang bersosialisasi langsung, kurang olahraga, kesehatan mental terganggu, nilai sekolah menurun.",
          points: 20
        }
      ]
    },

    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Jadi Teman Baik Digital 

Dalam simulasi ini, kamu akan menghadapi berbagai situasi di media digital (grup WhatsApp, video pendek, chat pribadi, Instagram, dan game online). Tugasmu mengenali perundungan siber dan memilih respons yang sopan serta berempati.

Kamu akan:
1. Mengenali bentuk-bentuk perundungan siber (cyberbullying)
2. Memilih pesan/komentar yang sopan dan peduli
3. Menjadi penolong digital: membela, mendukung, dan melapor
4. Mendapatkan skor berdasarkan ketepatan responsmu

Buktikan bahwa kamu bisa menjadi Sahabat Digital yang baik! `,
      simulationId: "teman-baik"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Pilihlah jawaban (A, B, C, atau D) yang paling tepat berdasarkan cerita atau situasi di bawah ini! Jawab semua pertanyaan untuk mendapatkan lencana **Sahabat Digital** ",
      questions: [
        {
          id: qid(),
          type: "mc",
          context: `Di gim online, Dika beberapa kali mendapat pesan dari akun tidak dikenal:
"Kamu payah. Berhenti main saja."
Pesan itu muncul berulang saat Dika masuk ke permainan.`,
          question: "Kejadian yang dialami Dika disebut cyberbullying karena....",
          options: [
            {
              id: "a",
              text: "Dika bermain gim online dengan orang yang belum ia kenal secara langsung.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Ada tindakan menyakiti dan mengejek orang lain melalui media digital secara berulang.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Ada pemain yang memberi kritik tentang cara bermain Dika di ruang obrolan gim.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Dika merasa tidak cocok bermain dengan akun yang berbeda dari kelompoknya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Rina mengunggah video bernyanyi untuk tugas kelas. Suaranya agak gemetar karena gugup, tetapi ia berani mencoba.`,
          question: "Sebagai teman baik di dunia digital, komentar paling tepat adalah....",
          options: [
            {
              id: "a",
              text: "\"Videonya sudah lumayan, tapi sebaiknya jangan diunggah kalau masih gugup.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Aku beri like, tapi lain kali latihan dulu supaya tidak membuat orang lain ragu.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Semangat terus, ya! Kamu sudah sangat berani mencoba tampil.\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Kalau mau dipuji, videonya harus sempurna dulu seperti penyanyi asli.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Kamu ingin menanggapi video teman. Komentarmu masih terdengar spontan dan agak menyindir.`,
          question: "Menurut aturan \"Tiga Pertanyaan Ajaib\", hal terpenting sebelum menekan tombol kirim adalah....",
          options: [
            {
              id: "a",
              text: "Memastikan komentarmu singkat agar teman cepat membaca maksudmu.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Berpikir sejenak apakah komentar kita sopan dan tidak menyakiti perasaan teman.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Menunggu komentar orang lain dulu agar jawabanmu terlihat sama dengan kebanyakan teman.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menambahkan emoji tertawa supaya komentar yang menyindir terasa seperti bercanda.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          imageUrl: "/gambar/topik 6/buli_foto_grup.png",
          context: `Di grup kelas, ada foto temanmu yang diedit menjadi bahan tertawaan. Beberapa anak mulai mengirim emoji tertawa.`,
          question: "Tindakan paling tepat sebagai penolong digital adalah....",
          options: [
            {
              id: "a",
              text: "Tidak ikut tertawa, tetapi tetap menyimpan foto itu sebagai bukti pribadi tanpa memberi tahu siapa pun.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menegur di grup dengan kalimat marah agar pelaku langsung merasa malu.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Tidak ikut mengejek, memberi dukungan kepada teman yang diejek, dan melapor kepada guru jika situasi berlanjut.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Keluar dari grup agar tidak melihat percakapan itu lagi dan masalahnya tidak membuatmu ikut terlibat.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Tio memotret Budi yang tertidur dengan ekspresi kurang pantas, lalu menjadikannya stiker WhatsApp dan mengirimnya ke grup sekolah.`,
          question: "Tindakan Tio tidak pantas karena....",
          options: [
            {
              id: "a",
              text: "Membuat grup menjadi ramai, tetapi Budi belum tentu memahami maksud candaan itu.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menggunakan foto asli, bukan gambar buatan sendiri, sehingga kualitas stikernya kurang rapi.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Bisa dianggap bercanda oleh sebagian teman, tetapi tetap tidak boleh jika Budi belum memberi izin.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Tidak menghargai privasi teman dan bisa membuat Budi sangat malu.",
              isCorrect: true
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Pesan pribadi dari nomor tidak dikenal:
"Awas ya kalau kamu berani lapor guru!"`,
          question: "Langkah paling aman yang harus kamu ambil adalah....",
          options: [
            {
              id: "a",
              text: "Membalas dengan tegas bahwa kamu tidak takut agar pengirim berhenti mengancam.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Melakukan screenshot (tangkap layar) sebagai bukti, lalu meminta bantuan orang dewasa.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengirim tangkapan layar ke grup kelas agar semua teman ikut menjaga jarak.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menghapus pesan agar tidak merasa takut lagi, lalu mencoba melupakannya sendiri.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Temanmu meminta pendapat tentang poster tugas. Idenya bagus, tetapi warna pada beberapa bagian keluar garis.`,
          question: "Kalimat saran yang paling santun dan membantu adalah....",
          options: [
            {
              id: "a",
              text: "\"Postermu punya ide bagus, tetapi kalau warna keluar garis terus, nilainya bisa turun.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Aku suka posternya, jadi tidak usah diperbaiki meskipun warnanya belum rapi.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Postermu sudah bagus, tapi menurutku akan lebih rapi jika warnanya tidak keluar garis.\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Warnanya kurang rapi. Coba lihat posterku supaya kamu tahu yang benar.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Di grup, ada yang berkata "cuma bercanda" setelah mengejek nama orang tua temannya. Teman yang diejek berhenti membalas pesan.`,
          question: "Candaan di dunia digital berubah menjadi tindakan yang tidak baik apabila....",
          options: [
            {
              id: "a",
              text: "Hanya dilakukan satu kali, tetapi semua teman lain menganggapnya lucu.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Membuat satu orang saja merasa malu, sedih, atau ketakutan.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Tidak memakai kata kasar, tetapi tetap menyinggung hal pribadi teman.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Ditulis di grup kecil sehingga hanya beberapa orang yang melihatnya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Kelasmu punya grup diskusi. Kadang ada teman yang bertanya, salah menjawab, atau terlihat sedih setelah membaca komentar.`,
          question: "Ciri utama seorang teman baik di dunia maya adalah....",
          options: [
            {
              id: "a",
              text: "Aktif memberi tanggapan agar grup selalu ramai, meskipun tidak semua komentar membantu.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Membela teman dekat saja, tetapi membiarkan teman lain disakiti karena bukan urusannya.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Selalu berhati-hati menggunakan kata-kata yang sopan dan peduli pada perasaan teman.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Menghindari semua percakapan digital agar tidak pernah melakukan kesalahan.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Seorang murid menghapus komentar kasar setelah ditegur, tetapi beberapa teman sudah menyimpannya sebagai tangkapan layar.`,
          question: "Kasus itu menunjukkan bahwa jejak digital dari komentar buruk dapat....",
          options: [
            {
              id: "a",
              text: "Hilang dari semua perangkat ketika komentar asli sudah dihapus oleh pengirim.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Tetap aman selama komentar itu ditulis di grup kelas, bukan di media sosial umum.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Terus dilihat, disimpan (di-screenshot), atau disebarkan kembali oleh orang lain.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Selalu menjadi rahasia pribadi yang hanya diketahui oleh pembuat handphone.",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: `Kamu sudah belajar menjadi teman baik dan penolong (upstander) di dunia digital. Profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh) menjadi panduanmu. Pada topik ini, kamu melatih sikap **Etis** dan **Tangguh** saat menghadapi perundungan siber. Renungkan dan jawab dengan jujur!`,
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu melihat teman di-bully secara daring? Apa yang akan kamu lakukan sebagai upstander?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana kamu menjaga keseimbangan antara kehidupan online dan offline agar tetap sehat?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Apakah kamu bersedia berkomitmen mendukung LIMA KODE ETIK PANCA MABAR? Tuliskan komitmen janjimu sebagai gamer digital yang tangguh!",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 7 – Menghargai Karya, Tidak Asal Ambil
 ═══════════════════════════════════════════════ */
const topic7: Topic = {
  id: "topik-7",
  number: 7,
  title: "Menghargai Karya, Tidak Asal Ambil",
  description: "Memahami hak cipta digital dan pentingnya menghargai karya orang lain.",
  icon: "copyright",
  color: "bg-orange-500",
  backgroundImageUrl: "/gambar/topik%207/Cover_Topik_7.png",
  badgeId: "badge-pelindung-karya",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari materi ini, kamu diharapkan mampu:

1. **Mengevaluasi** kejelasan sumber gambar dengan teliti dan tepat
2. **Menilai** tindakan yang mematuhi etika dan tindakan yang melanggar hak cipta secara kritis
3. **Menyusun** tulisan kredit atau atribusi karya (mencakup nama pembuat, judul karya, dan sumber) dengan lengkap dan benar

Bayangkan kamu sudah susah payah membuat gambar yang indah, lalu seseorang mengambilnya dan mengaku itu buatannya. Pasti kesal, kan? Itulah mengapa kita harus menghargai karya orang lain!`,
      mediaType: "image",
      mediaUrl: "/minta_izin_karya.png",
      mediaLayout: "above"
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: ` **Karya Digital** – Hasil ciptaan seseorang yang dibuat, disimpan, atau dibagikan menggunakan perangkat digital (gambar, tulisan, video, musik, desain).

 **Hak Cipta (Copyright)** – Hak hukum yang otomatis melindungi karya seseorang saat karya itu selesai dibuat, agar tidak dicuri atau diakui orang lain.

 **Plagiarisme (Plagiat)** – Tindakan mengambil karya orang lain dan mengakuinya sebagai karya sendiri; dalam pendidikan disebut menyontek.

 **Atribusi (Kredit Karya)** – Mencantumkan nama pembuat dan sumber karya sebagai bentuk penghargaan saat meminjam karya orang lain.

 **Lisensi Creative Commons (CC)** – Tanda bahwa sebuah karya boleh dipakai secara gratis, biasanya dengan syarat mencantumkan nama pembuatnya.

 **DJKI** – Direktorat Jenderal Kekayaan Intelektual; lembaga Indonesia yang mengatur hak cipta dan kekayaan intelektual.

 **Watermark** – Tanda nama atau logo kecil pada karya digital sebagai bukti kepemilikan.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: ` Peta perjalanan belajarmu:

 Tahap 1: Bersiap belajar dari cerita Bima dan istana pasir miliknya.
 Tahap 2: Menjawab tantangan awal tentang hak cipta dan plagiarisme.
 Tahap 3: Belajar tentang karya digital, mengapa harus dihargai, dan jurus 3J.
 Tahap 4: Latihan memahami – Plagiarisme dan lisensi Creative Commons.
 Tahap 5: Mengamati studi kasus karya Gita yang dicuri.
 Tahap 6: Bereksplorasi dalam simulasi Menggunakan Konten dengan Bertanggung Jawab.
 Tahap 7: Uji pemahaman akhir dan refleksi.

Jadilah Pelindung Karya yang jujur dan kreatif! `
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Jawablah pertanyaan pemandu di bawah ini berdasarkan cerita pengantar secara mandiri.",
      passage: `**Kisah Istana Pasir dan Karya Kita**

Hari Minggu yang cerah, Bima pergi ke pantai. Di sana, ia menghabiskan waktu berjam-jam untuk membangun sebuah istana pasir yang sangat besar dan indah. Bima menghiasnya dengan kerang dan bendera kecil di puncaknya. Ia merasa sangat bangga dengan hasil karyanya.

Namun, saat Bima pergi sebentar untuk mencuci tangan, seorang anak lain datang. Anak itu mencabut bendera kecil milik Bima dan menggantinya dengan benderanya sendiri. Ketika Bima kembali, anak itu sedang berteriak kepada orang-orang di sekitar, "Lihat! Ini istana pasir buatanku sendiri! Bagus, kan?"

Bima merasa sangat sedih dan kecewa. Istana pasir yang ia buat dengan susah payah menggunakan keringat dan idenya sendiri, tiba-tiba diakui oleh orang lain begitu saja tanpa izin.

Di dunia digital, kejadian seperti ini sering sekali terjadi. Banyak orang yang dengan mudah mengambil gambar, foto, musik, tulisan, atau video buatan orang lain di internet, lalu mengakuinya sebagai karya mereka sendiri. Tindakan ini disebut pelanggaran hak cipta atau plagiarisme.`,
      mediaType: "image",
      mediaUrl: "/istana_pasir_plagiat.png",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu mencari gambar di internet atau menggunakan karya lain (musik/foto/video/desain) dari internet? Ceritakan!",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana perasaanmu jika karyamu (misalnya poster yang kamu buat dengan susah payah) diambil orang lain tanpa izin dan diakui sebagai miliknya?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana perasaan Bima ketika istana pasir buatannya diakui oleh anak lain?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa kita tidak boleh mengambil karya orang lain di internet dan mengakuinya sebagai karya kita sendiri?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Menurutmu, apa yang sebaiknya kita lakukan jika ingin meminjam atau menggunakan karya orang lain untuk tugas sekolah?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Hak cipta (copyright) adalah...",
          options: [
            {
              id: "a",
              text: "Hak untuk mengcopy semua karya di internet",
              isCorrect: false
            },
            {
              id: "b",
              text: "Hak hukum yang melindungi karya seseorang",
              isCorrect: true
            },
            {
              id: "c",
              text: "Hak untuk tidak bersekolah",
              isCorrect: false
            },
            {
              id: "d",
              text: "Hak untuk membeli apa saja",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Plagiarisme adalah...",
          options: [
            {
              id: "a",
              text: "Membuat karya sendiri yang original",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengambil karya orang lain dan mengaku sebagai karya sendiri",
              isCorrect: true
            },
            {
              id: "c",
              text: "Membagikan karya teman dengan izin",
              isCorrect: false
            },
            {
              id: "d",
              text: "Membeli buku di toko",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## Menghargai Karya Orang Lain

Halo, teman - teman yang hebat! Pernahkah kamu menggambar sesuatu yang sangat bagus, lalu memajangnya di dinding kamarmu ? Kamu pasti merasa bangga, kan ? Nah, di dunia internet atau dunia digital, kita juga bisa membuat karya yang luar biasa, lho! Yuk, kita pelajari apa itu karya digital dan bagaimana cara kita menghargainya!

### A.Apa Itu Karya Digital ?

        Pernahkah kamu membuat gambar di HP, menulis cerita atau puisi di komputer, membuat video pendek yang lucu, atau mendesain poster dengan aplikasi seperti Canva ? Semua kegiatan seru itu menghasilkan sesuatu yang disebut karya digital.

Karya digital adalah hasil ciptaan seseorang yang dibuat, disimpan, atau dibagikan menggunakan perangkat digital seperti HP, komputer, tablet, atau kamera.

Coba lihat berbagai macam bentuk karya digital di bawah ini:

| No. | Jenis Karya Digital | Contohnya Apa Saja ? |
| ---| ---| ---|
| 1 | Gambar / Visual | Ilustrasi, foto hasil jepretan kamera, ikon, stiker WhatsApp. |
| 2 | Tulisan | Cerita pendek(cerpen), artikel blog, puisi, atau caption di media sosial. |
| 3 | Video | Vlog jalan - jalan, animasi kartun, video presentasi tugas sekolah. |
| 4 | Musik atau Audio | Lagu, rekaman suara podcast, atau efek suara lucu. |
| 5 | Desain | Poster lomba, logo kelas, jadwal piket yang dihias, slide presentasi. |
| 6 | Konten Media Sosial | Video pendek, Reels, unggahan Instagram, dan konten edukasi di TikTok. |

      Ingat, ya! Karya digital itu tidak turun begitu saja dari langit.Ada manusia sungguhan di baliknya yang membuatnya dengan susah payah.Mereka menggunakan waktu, tenaga, pikiran, dan kreativitas yang luar biasa.

Bayangkan jika kamu membangun istana pasir yang sangat besar di pantai seharian penuh.Lalu, tiba - tiba ada orang lain yang memasang bendera namanya di istanamu dan berteriak, "Ini istana buatanku!" Tentu kamu akan merasa sangat sedih dan marah, bukan ? Hal yang sama juga berlaku di dunia digital.Itulah sebabnya, karya digital sangat perlu dihargai!

### B.Mengapa Kita Tidak Boleh Asal Mengambil Karya Orang Lain ?

        Internet itu seperti perpustakaan dan taman bermain raksasa.Ada jutaan gambar, video, lagu, dan tulisan di sana.Namun, bukan berarti semua barang di taman bermain itu boleh kita bawa pulang dan kita akui sebagai milik kita, ya.

Mengambil karya orang lain tanpa izin, tidak menyebutkan siapa pembuatnya, atau bahkan mengakuinya sebagai buatanmu sendiri adalah tindakan yang tidak jujur.Dalam dunia pendidikan, tindakan mengambil karya orang lain dan mengakuinya sebagai karya sendiri disebut ** Plagiarisme(Plagiat) **.Seorang pahlawan digital pantang melakukan hal ini!

Perhatikan panduan keren di bawah ini agar kamu tidak salah langkah:

| Tindakan di Dunia Digital | Boleh atau Tidak ? | Kenapa Begitu ? |
| ---| ---| ---|
| Memakai foto kucing dari internet, lalu menulis nama pembuat dan sumber situsnya. | Boleh! | Karena kita jujur tidak mengaku sebagai pembuatnya dan memberi tahu dari mana asalnya. |
| Mengunduh poster teman, menghapus namanya, lalu menggantinya dengan nama kita. | Tidak Boleh! | Ini namanya pencurian digital.Sangat tidak menghargai pembuat aslinya. |
| Menyalin(copy - paste) tulisan orang lain dari internet lalu dikumpulkan sebagai tugas sekolah. | Tidak Boleh! | Ini namanya plagiat.Kamu tidak belajar apa - apa dengan menyontek. |
| Melihat poster keren di internet, lalu menjadikannya inspirasi untuk membuat poster buatanmu sendiri. | Boleh! | Inspirasi itu bagus! Kita membuat karya baru yang berbeda dengan usaha kita sendiri. |
| Mengunggah ulang(repost) video YouTube orang lain ke channel kita tanpa izin pemiliknya. | Tidak Boleh! | Video itu adalah hasil keringat orang lain. |

### C.Apa Itu Hak Cipta ? (Tanda Pengenal Tak Terlihat)

      Teman - teman, pernah dengar kata Hak Cipta ?

        Hak cipta itu seperti tanda pengenal atau gembok tak terlihat yang dimiliki seseorang atas karya yang dibuatnya.Ketika seseorang selesai membuat gambar, cerita, lagu, atau video, secara otomatis karya itu dilindungi oleh aturan bernama hak cipta.

Untuk anak - anak hebat sepertimu, cukup ingat rumus sederhana ini:
> **“Kalau bukan tanganku dan pikiranku yang membuat, maka aku tidak boleh mengaku sebagai pembuatnya.”**

      Di Indonesia, ada markas besar yang mengatur tentang ini, namanya ** DJKI(Direktorat Jenderal Kekayaan Intelektual) **.DJKI menjelaskan bahwa hak cipta itu langsung muncul dan menempel pada suatu karya saat karya itu selesai dibuat(diwujudkan).Jadi, hukum melindungi karya - karya tersebut agar tidak dicuri orang.

### D.Jurus Rahasia: Ingat "3J" Saat Menggunakan Karya Digital

Agar kamu selalu aman dan menjadi anak yang beretika di dunia maya, gunakan jurus rahasia 3J!

1. ** Jujur **
      Jujur berarti berani berkata benar.Banggalah pada karya buatanmu sendiri, meskipun belum sempurna.Jangan pernah mengakui karya orang lain sebagai hasil kerjamu.Tugas yang dikerjakan sendiri jauh lebih bernilai di mata gurumu!

2. ** Jelaskan Sumber **
      Jika kamu meminjam buku temanmu, kamu pasti akan bilang pada ibumu, "Bu, ini buku pinjaman dari Budi." Di internet juga sama! Jika kamu menggunakan gambar, informasi, atau foto dari internet, jelaskan siapa pembuatnya dan dari mana kamu mengambilnya.

3. ** Jangan Asal Ambil **
      Tidak semua barang di internet itu "gratis".Ada karya yang boleh dipakai bebas, ada yang harus minta izin dulu, dan ada yang sama sekali tidak boleh diubah.
        Nah, ada karya yang memang sengaja digratiskan oleh pembuatnya untuk dipakai belajar.Biasanya karya ini memiliki tanda ** Lisensi Creative Commons(CC) **.Meskipun gratis, aturan Creative Commons biasanya tetap memintamu untuk mencantumkan nama pembuatnya sebagai bentuk rasa terima kasih.

Sebelum menyimpan gambar dari internet, tanyakan pada dirimu:
      - Siapa yang membuat gambar ini ?
        - Apakah situs ini mengizinkanku untuk menggunakannya ?
        - Jika ragu, segera tanya pada Ayah, Ibu, atau Guru di sekolah!

### E.Cara Menuliskan Sumber Gambar yang Benar(Standar Nasional & Internasional)

Teman - teman, sekadar menulis "Sumber: Google" atau "Sumber: Internet" itu kurang tepat, lho! Google itu hanya mesin pencari, bukan pembuat gambarnya. 

Untuk menuliskan sumber gambar secara benar dan bertanggung jawab, ada dua standar utama yang bisa kita gunakan sesuai kebutuhan tugas kita:

#### 1. Standar Internasional(Gaya APA Edisi ke - 7)
Gaya APA(American Psychological Association) 7th Edition adalah standar internasional yang paling sering digunakan dalam penulisan ilmiah.
- ** Aturan Posisi **: 
  - ** Nomor Gambar(Figure Number) ** ditulis tebal(bold) di ** atas ** gambar(misal: ** Gambar 1 ** atau ** Figure 1 **).
  - ** Judul Gambar(Image Title) ** ditulis miring(italics) di bawah nomor gambar dengan huruf kapital di setiap kata penting(Title Case).
  - ** Catatan Sumber(Note) ** diletakkan di ** bawah ** gambar diawali kata * Note.* atau * Catatan.* (tulisan miring).
- ** Format Catatan di Bawah Gambar **:
      - * Dari Situs Web *: 
    * Catatan *.Dari * Judul Halaman Web * [Deskripsi Format], oleh Nama Pembuat, Tahun, Nama Situs(URL).
  - * Dari Buku *: 
    * Catatan *.Dari * Judul Buku * (hlm.halaman), oleh Nama Pembuat, Tahun, Penerbit.
  - * Dari Media Sosial(Instagram) *: 
    * Catatan *.Dari * Teks Postingan * [Deskripsi Format], oleh Nama Pembuat[@username], Tahun, Nama Platform(URL).

* Contoh Penerapan APA 7th:*
** Gambar 1 **
* Keindahan Danau Kaco di Jambi *
      [Contoh Gambar Danau Kaco]
      * Catatan *.Dari * Wisata Alam Jambi * [Foto], oleh Humas Pemprov Jambi, 2022, Portal Resmi Jambi(https://jambiprov.go.id).

        ---

#### 2. Standar Nasional(Panduan Pencantuman Gambar Indonesia)
Di Indonesia, pencantuman gambar diatur dalam standar penulisan dokumen resmi atau buku pelajaran nasional.
- ** Aturan Posisi **: Keterangan diletakkan seluruhnya di ** bawah ** gambar secara ringkas.
- ** Format Keterangan **: \`Gambar [Nomor]. [Judul Gambar] (Sumber: [Nama Pembuat/Situs], [Tahun])\`
- **Format Detail**:
  - *Dari Situs Web*: \`Gambar 1. Judul Gambar (Sumber: Nama Website/Situs Resmi, Tahun, URL)\`
  - *Dari Buku*: \`Gambar 2. Judul Gambar (Sumber: Nama Belakang Penulis, Tahun: Halaman)\`
  - *Dari Media Sosial*: \`Gambar 3. Judul Gambar (Sumber: Akun Instagram @username, Tahun)\`

*Contoh Penerapan Standar Nasional:*
[Contoh Gambar Danau Kaco]
\`Gambar 1. Keindahan Danau Kaco di Jambi (Sumber: Portal Resmi Jambi, 2022)\`

---

#### Tabel Ringkasan Format Referensi Gambar (Gaya Anak Sekolah Cerdas):

| Karya/Sumber Gambar | Gaya Internasional (APA 7th) | Gaya Nasional (Indonesia) |
|---|---|---|
| **Gambar dari Website Resmi** | *Catatan*. Dari *Planet Mars* [Foto], oleh NASA, 2021, NASA (https://nasa.gov). | Gambar 1. Planet Mars (Sumber: NASA, 2021, www.nasa.gov) |
| **Gambar dari Buku Cetak** | *Catatan*. Dari *Siklus Air* [Ilustrasi], oleh Sutopo, 2019, Penerbit Tiga Serangkai. | Gambar 2. Siklus Air (Sumber: Sutopo, 2019: hlm. 45) |
| **Foto dari Media Sosial** | *Catatan*. Dari *Poster Hemat Energi* [Grafis], oleh Budi [@budicreative], 2023, Instagram (https://instagram.com/p/123). | Gambar 3. Poster Hemat Energi (Sumber: Instagram @budicreative, 2023) |
| **Karya/Gambar Buatan Sendiri** | *Catatan*. Karya buatan sendiri oleh [Nama Kamu], Tahun. | Gambar 4. Poster Kebersihan (Sumber: Dokumentasi Pribadi [Nama Kamu], Tahun) |

Dengan membiasakan menulis sumber gambar sesuai aturan ini, kamu sudah belajar menjadi peneliti cilik yang hebat, jujur, dan menghargai jerih payah pembuat karya asli!

**Pesan Digi:**
"Internet adalah perpustakaan ilmu yang sangat luas. Jadilah pengunjung yang baik. Jangan asal mengambil! Jadilah pengguna digital yang jujur: banggalah membuat karyamu sendiri, selalu tuliskan sumber saat meminjam, dan hargailah karya ciptaan orang lain."`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Berikut yang termasuk plagiarisme adalah...",
          options: [
            {
              id: "a",
              text: "Menulis cerita sendiri untuk tugas",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menyalin artikel dari internet dan mengaku sebagai tulisan sendiri",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengutip tulisan orang lain dengan mencantumkan sumber",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menggambar sendiri untuk tugas seni",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Lisensi Creative Commons (CC BY) artinya...",
          options: [
            {
              id: "a",
              text: "Tidak boleh digunakan sama sekali",
              isCorrect: false
            },
            {
              id: "b",
              text: "Boleh digunakan asalkan mencantumkan nama pembuatnya",
              isCorrect: true
            },
            {
              id: "c",
              text: "Hanya boleh digunakan oleh pembuatnya",
              isCorrect: false
            },
            {
              id: "d",
              text: "Harus membayar untuk menggunakannya",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Kamu ingin menggunakan gambar dari internet untuk presentasi di sekolah. Jelaskan langkah-langkah yang harus kamu lakukan agar tidak melanggar hak cipta!",
          correctAnswer: "Cari di situs berlisensi bebas (Pixabay, dll), periksa lisensinya, cantumkan sumber/nama pembuat, atau gambar sendiri.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `## Studi Kasus: Gambar Gita

Gita kelas 6 SD sangat pandai menggambar. Dia mengunggah gambar kartun buatannya di Instagram. Gambar itu sangat bagus dan mendapat banyak like.

Seminggu kemudian, temannya memberitahu bahwa seseorang mengambil gambar Gita dan mempostingnya di akun mereka sendiri, bahkan **mengaku bahwa gambar itu adalah buatannya**. Orang tersebut bahkan mengikuti lomba menggambar menggunakan karya Gita!

### Apa yang dilakukan Gita?
1. Menyiapkan bukti (screenshot) bahwa dia mengunggah gambar itu pertama kali
2. Menghubungi orang tersebut dan meminta untuk menghapus atau mencantumkan kredit
3. Melaporkan ke Instagram menggunakan fitur "Hak Cipta"
4. Memberitahu orang tua dan guru

### Pelajaran:
- Selalu tandai karyamu (watermark atau tanda tangan digital)
- Simpan bukti asli (file mentah) dari karyamu
- Jangan ragu melaporkan jika karyamu dicuri`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Apa yang dilakukan orang tersebut terhadap karya Gita termasuk...",
          options: [
            {
              id: "a",
              text: "Apresiasi",
              isCorrect: false
            },
            {
              id: "b",
              text: "Plagiarisme dan pelanggaran hak cipta",
              isCorrect: true
            },
            {
              id: "c",
              text: "Kerjasama",
              isCorrect: false
            },
            {
              id: "d",
              text: "Hal yang wajar di internet",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Apa saran yang akan kamu berikan kepada Gita untuk melindungi karya-karyanya di masa depan?",
          correctAnswer: "Gunakan watermark, simpan file asli, cantumkan nama di karya, atur privasi, dan berani melaporkan jika ada pelanggaran.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: `## Simulasi: Menggunakan Konten dengan Bertanggung Jawab 

Dalam simulasi ini, kamu akan berlatih menggunakan konten digital secara bertanggung jawab.

Kamu akan:
1. Mencari gambar yang boleh digunakan secara gratis
2. Mempraktikkan cara mencantumkan sumber dengan benar
3. Membedakan konten yang boleh dan tidak boleh digunakan
4. Membuat karya sendiri dengan konten berlisensi bebas

Ayo tunjukkan bahwa kamu adalah Pelindung Karya yang menghargai kreativitas! `,
      simulationId: "copyright"
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Pilihlah jawaban (A, B, C, atau D) yang paling tepat berdasarkan situasi di bawah ini! Jawab semua pertanyaan untuk mendapatkan lencana **Pelindung Karya** ",
      questions: [
        {
          id: qid(),
          type: "mc",
          context: `Siska menulis puisi di buku tulis. Dika mengetik puisi di laptop, menambahkan gambar di Canva, lalu menyimpannya sebagai file untuk dikirim ke guru.`,
          question: "Karya Dika disebut karya digital karena....",
          options: [
            {
              id: "a",
              text: "Dika menulis tema yang sama dengan tugas teman-temannya di kelas.",
              isCorrect: false
            },
            {
              id: "b",
              text: "hasil ciptaannya dibuat, disimpan, dan dibagikan menggunakan perangkat digital.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Dika menghias puisinya agar terlihat lebih menarik daripada tulisan tangan.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Dika memakai gambar, sedangkan puisi di buku tulis hanya berisi kata-kata.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Manakah kegiatan siswa kelas 6 yang paling jelas menghasilkan karya digital?",
          options: [
            {
              id: "a",
              text: "Doni menggambar poster di kertas, lalu memotretnya untuk dokumentasi pribadi.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Siti mencari contoh poster di internet untuk mendapatkan ide warna.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Raka merekam, mengedit, dan mengunggah video presentasi untuk tugas sekolah.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Nisa membaca artikel tentang cara membuat poster digital di perpustakaan.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          imageUrl: "/tulis_sumber_benar.png",
          context: `Kamu membuat slide tentang tata surya dan menemukan gambar Planet Saturnus dari situs web NASA.`,
          question: "Penerapan jurus \"3J\" yang paling tepat saat memakai gambar tersebut adalah....",
          options: [
            {
              id: "a",
              text: "memakai gambar itu karena berasal dari situs terkenal, tetapi tidak perlu menulis sumber.",
              isCorrect: false
            },
            {
              id: "b",
              text: "menulis \"Sumber: internet\" karena sudah menunjukkan bahwa gambar itu bukan buatan sendiri.",
              isCorrect: false
            },
            {
              id: "c",
              text: "memasukkan gambar tersebut lalu menulis \"Sumber: Foto Planet Saturnus oleh NASA, dari www.nasa.gov\".",
              isCorrect: true
            },
            {
              id: "d",
              text: "mengganti warna gambar sedikit agar terlihat berbeda dari gambar aslinya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Budi kesulitan membuat tugas mengarang. Ia menemukan cerpen di internet, menyalin seluruh isinya, lalu mengumpulkannya dengan namanya sendiri.`,
          question: "Dalam dunia pendidikan, tindakan Budi disebut plagiarisme dan dilarang karena....",
          options: [
            {
              id: "a",
              text: "Budi tidak mengubah ukuran huruf dan tata letak cerpen sebelum dikumpulkan.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Budi sebenarnya menemukan sumber yang bagus, tetapi belum membuat sampul tugas.",
              isCorrect: false
            },
            {
              id: "c",
              text: "tindakan tersebut tidak jujur dan sama sekali tidak menghargai karya orang lain.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Budi hanya boleh melakukan itu jika cerpennya sudah dibaca oleh banyak orang.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          imageUrl: "/hak_cipta_gembok.png",
          question: "Hak cipta diibaratkan seperti \"tanda pengenal tak terlihat\" pada sebuah karya. Artinya, hak cipta ini berfungsi atau berkaitan dengan....",
          options: [
            {
              id: "a",
              text: "hak yang melindungi seseorang atas karya yang dibuatnya dengan susah payah agar tidak dicuri orang lain.",
              isCorrect: true
            },
            {
              id: "b",
              text: "aturan agar semua karya di internet boleh dipakai jika dipakai untuk tugas sekolah.",
              isCorrect: false
            },
            {
              id: "c",
              text: "izin otomatis untuk mengubah karya orang lain selama hasil akhirnya terlihat berbeda.",
              isCorrect: false
            },
            {
              id: "d",
              text: "label yang hanya berlaku untuk karya mahal, bukan gambar atau tulisan sederhana.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Angga menemukan ilustrasi gratis berlisensi Creative Commons untuk poster sekolah.`,
          question: "Tindakan terbaik yang menunjukkan bahwa Angga menghargai karya orang lain adalah....",
          options: [
            {
              id: "a",
              text: "menggunakan ilustrasi itu karena gratis, lalu menghapus nama pembuat agar posternya rapi.",
              isCorrect: false
            },
            {
              id: "b",
              text: "menulis sumber hanya jika guru bertanya dari mana gambar itu berasal.",
              isCorrect: false
            },
            {
              id: "c",
              text: "tetap menuliskan sumber dan nama pembuat aslinya sebagai bentuk rasa terima kasih.",
              isCorrect: true
            },
            {
              id: "d",
              text: "mengubah warna ilustrasi sedikit agar tidak perlu mencantumkan pembuatnya.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Kamu menemukan lagu yang cocok untuk latar video tugas, tetapi tidak ada informasi pembuat, izin penggunaan, atau sumber resminya.`,
          question: "Keputusan paling bijak dan aman adalah....",
          options: [
            {
              id: "a",
              text: "memakainya hanya untuk tugas sekolah karena video itu tidak dijual.",
              isCorrect: false
            },
            {
              id: "b",
              text: "memakainya sambil menulis \"sumber tidak diketahui\" di akhir video.",
              isCorrect: false
            },
            {
              id: "c",
              text: "tidak menggunakannya, dan mencari musik lain yang jelas izin serta sumbernya.",
              isCorrect: true
            },
            {
              id: "d",
              text: "meminta teman menebak sumber lagunya setelah video selesai dikumpulkan.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Dua murid mengumpulkan tugas. Karya A sederhana tetapi dibuat sendiri. Karya B sangat rapi, tetapi sebagian besar menyalin template dan tulisan orang lain tanpa sumber.`,
          question: "Mengapa karya A lebih sesuai dengan sikap pelindung karya?",
          options: [
            {
              id: "a",
              text: "melatih kita menjadi anak yang jujur, mandiri, dan semakin kreatif.",
              isCorrect: true
            },
            {
              id: "b",
              text: "membuat tugas terlihat biasa saja sehingga tidak menarik perhatian orang lain.",
              isCorrect: false
            },
            {
              id: "c",
              text: "menghindari kewajiban menulis sumber karena semua bagian dibuat sederhana.",
              isCorrect: false
            },
            {
              id: "d",
              text: "menunjukkan bahwa nilai tugas selalu ditentukan oleh jumlah gambar yang dipakai.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Dalam slide presentasi, kamu memakai foto dari situs edukasi dan menulis nama pembuat serta alamat situs di bawah foto.`,
          question: "Tujuan memberikan \"kredit karya\" seperti itu adalah untuk....",
          options: [
            {
              id: "a",
              text: "membuat slide terlihat lebih ilmiah walaupun sumbernya belum tentu benar.",
              isCorrect: false
            },
            {
              id: "b",
              text: "menunjukkan secara jelas dari mana sumber karya tersebut sekaligus menghargai pembuat aslinya.",
              isCorrect: true
            },
            {
              id: "c",
              text: "membuktikan bahwa kita boleh mengubah semua karya orang lain tanpa batas.",
              isCorrect: false
            },
            {
              id: "d",
              text: "menghindari keharusan membuat penjelasan sendiri pada bagian presentasi.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Manakah pernyataan yang menunjukkan pola pikir pahlawan digital yang mengerti etika memakai karya di internet?",
          options: [
            {
              id: "a",
              text: "\"Aku boleh mengambil foto ini untuk belajar, lalu cukup menyimpan link sumbernya untuk diriku sendiri.\"",
              isCorrect: false
            },
            {
              id: "b",
              text: "\"Kalau gambar ini sudah sering dipakai orang, sumbernya tidak terlalu penting lagi.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Gambar ini bukan buatanku, jadi aku wajib mencantumkan nama pembuat dan situsnya di bawah fotonya.\"",
              isCorrect: true
            },
            {
              id: "d",
              text: "\"Aku akan menulis sumber nanti saja setelah tugas selesai dinilai guru.\"",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Kamu sudah belajar menghargai karya dan hak cipta. Profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh) menjadi panduanmu. Pada topik ini, kamu melatih sikap **Etis** dan **Bijak** dalam menggunakan karya orang lain. Renungkan dan jawab dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pernahkah kamu memakai gambar dari internet tanpa mencantumkan sumber? Apa yang akan kamu lakukan sekarang?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Bagaimana kamu akan menerapkan jurus 3J (Jujur, Jelaskan Sumber, Jangan Asal Ambil) saat mengerjakan tugas?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 TOPIC 8 – Berkarya Aman di Dunia Digital
 ═══════════════════════════════════════════════ */
const topic8: Topic = {
  id: "topik-8",
  number: 8,
  title: "Berkarya Aman di Dunia Digital",
  description: "Cara berkarya secara kreatif, aman, dan bertanggung jawab di internet.",
  icon: "palette",
  color: "bg-violet-500",
  backgroundImageUrl: "/gambar/topik%208/Cover_Topik_8.png",
  badgeId: "badge-kreator-cerdas",
  steps: [
    {
      type: "tujuan",
      title: "Tujuan Pembelajaran",
      content: `Setelah mempelajari topik ini, kamu diharapkan mampu:
1. Menjelaskan konsep kampanye digital untuk pengguna digital cerdas dengan bahasa sendiri.
2. Mengidentifikasi masalah digital di sekitar kita dan merancang pesan kampanye yang sesuai.
3. Membuat karya kampanye digital berupa poster, slide, komik, atau infografik yang aman dan kreatif.
4. Melakukan refleksi terhadap proses pembuatan kampanye digital dan pesan positif yang disampaikan.`
    },
    {
      type: "kata-kunci",
      title: "Kata Kunci",
      content: `Kampanye digital - Ajakan positif dalam bentuk karya digital yang disebarkan melalui internet untuk mengajak orang lain menggunakan teknologi dengan cerdas.
Karya digital - Hasil ciptaan atau karya kreatif (seperti poster, komik, atau slide) yang dibuat menggunakan perangkat komputer atau handphone.
Pesan positif - Pesan atau ajakan baik yang bermanfaat, mendidik, dan menginspirasi orang lain untuk berbuat kebaikan.
Aman - Terlindungi dari bahaya di dunia maya, seperti penipuan, tautan berbahaya, atau penyebaran data pribadi.
Sopan - Berbicara dan bertindak dengan santun, menghargai perasaan orang lain di internet.
Bertanggung jawab - Menyadari dampak dari apa yang kita tulis atau bagikan, serta siap menanggung akibatnya.
Data pribadi - Informasi penting tentang diri kita yang harus dijaga kerahasiaannya di internet, seperti kata sandi atau alamat.
Sumber karya - Keterangan asal-usul karya orang lain (kredit) yang kita gunakan sebagai bentuk penghargaan atas jerih payah penciptanya.
Komentar baik - Tanggapan positif yang sopan di dunia digital yang tidak menyakiti atau membuat orang lain sedih.
Refleksi - Kegiatan memikirkan kembali apa yang telah dipelajari dan dilakukan untuk menjadi pribadi yang lebih baik.`
    },
    {
      type: "peta-materi",
      title: "Peta Materi",
      content: `Peta perjalanan belajarmu:
Tahap 1: Bersiap belajar dengan merenungi pentingnya mengajak orang lain bersikap bijak di internet.
Tahap 2: Menjawab tantangan awal tentang kampanye digital.
Tahap 3: Belajar tentang konsep kampanye digital, prinsip membuat konten aman, dan metadata.
Tahap 4: Latihan memahami – Metadata, izin memfoto, dan konten positif.
Tahap 5: Mengamati studi kasus video Hana yang viral.
Tahap 6: Bereksplorasi membuat kampanye digital di Galeri Kelas virtual.
Tahap 7: Uji pemahaman akhir dan refleksi belajar.`
    },
    {
      type: "bersiap-belajar",
      title: "Bersiap-Siap Belajar",
      content: "Jawablah pertanyaan pemandu di bawah ini berdasarkan bacaan pengantar secara mandiri.",
      passage: `Selamat! Kamu sudah sampai pada topik terakhir.
Sebelumnya, kamu sudah belajar banyak hal tentang dunia digital. Kamu belajar menggunakan HP, Chromebook, atau komputer sesuai tujuan pembelajaran. Kamu juga belajar mengecek informasi, menjaga data pribadi, berhati-hati sebelum mengklik tautan, berbicara dengan santun, menjadi teman yang baik di dunia digital, serta menghargai karya orang lain.
Sekarang, saatnya kamu menunjukkan apa yang sudah kamu pahami.
Coba pikirkan sebentar.
Pernahkah kamu melihat teman yang langsung percaya pada berita yang belum jelas?
Pernahkah kamu melihat komentar yang membuat orang lain sedih atau malu?
Pernahkah kamu melihat seseorang membagikan foto atau data pribadi tanpa berpikir panjang?
Pernahkah kamu ingin mengingatkan teman agar lebih hati-hati saat menggunakan internet?
Di dunia digital, kita tidak hanya belajar untuk melindungi diri sendiri. Kita juga bisa mengajak orang lain agar menggunakan teknologi dengan lebih aman, sopan, dan bertanggung jawab.
Pada topik ini, kamu akan membuat kampanye digital. Kampanye digital adalah ajakan yang dibuat dalam bentuk karya, seperti poster, slide, gambar digital, infografik mini, komik pendek, atau pesan singkat. Kampanye ini berisi pesan agar teman-teman menjadi pengguna digital yang cerdas.
Kamu boleh memilih pesan kampanye tentang menjaga data pribadi, tidak asal klik, mengecek informasi, berbicara santun, tidak melakukan cyberbullying, atau menghargai karya orang lain.
Yuk, tunjukkan bahwa kamu siap menjadi pengguna digital yang aman, sopan, jujur, dan bertanggung jawab!`,
      mediaType: "image",
      mediaUrl: "/kampanye_digital_bersiap.png",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Mengapa kita tidak hanya perlu melindungi diri sendiri, tetapi juga perlu mengajak orang lain agar menggunakan internet dengan lebih aman, sopan, dan bertanggung jawab?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Berdasarkan masalah-masalah digital di sekitarmu, pesan kampanye apa yang paling penting untuk segera kamu sampaikan kepada teman-teman? Mengapa?",
          points: 0
        }
      ]
    },
    {
      type: "tantangan-awal",
      title: "Tantangan Awal",
      content: "Yuk, uji dulu pemahamanmu tentang kampanye digital sebelum belajar lebih jauh!",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Kampanye digital paling tepat dibuat untuk....",
          options: [
            {
              id: "a",
              text: "Mengajak teman bermain gim lebih lama",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menyebarkan pesan positif agar pengguna digital lebih cerdas dan aman",
              isCorrect: true
            },
            {
              id: "c",
              text: "Membagikan data pribadi teman",
              isCorrect: false
            },
            {
              id: "d",
              text: "Mengajak orang mengejar tantangan viral",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Contoh pesan kampanye digital yang baik adalah....",
          options: [
            {
              id: "a",
              text: "\"Cek sumber informasi sebelum mempercayainya.\"",
              isCorrect: true
            },
            {
              id: "b",
              text: "\"Bagikan kata sandimu kepada teman dekat.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Klik semua tautan agar tidak ketinggalan.\"",
              isCorrect: false
            },
            {
              id: "d",
              text: "\"Komentar kasar itu biasa di internet.\"",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "yuk-belajar",
      title: "Yuk, Belajar Bersama!",
      content: `## Menjadi Kreator Digital yang Bertanggung Jawab

Sebagai anak muda di era digital, kamu memiliki kemampuan luar biasa untuk **berkreasi dan berbagi** karya dengan dunia. Tapi kekuatan ini datang dengan **tanggung jawab**!

### Prinsip-Prinsip Membuat Konten yang Aman

#### 1. Pikirkan Sebelum Posting (Think Before You Post) 

Sebelum memposting, tanyakan pada dirimu:
- "Apakah konten ini aman untuk dilihat semua orang?"
- "Apakah konten ini bisa menyakiti perasaan seseorang?"
- "Apakah aku bangga jika guru atau orang tua melihat ini?"
- "Apakah konten ini mengandung informasi pribadi yang seharusnya dirahasiakan?"

Jika jawabannya "TIDAK" untuk salah satu pertanyaan di atas, **jangan posting!**

#### 2. Jangan Bagikan Informasi Pribadi 

Saat membuat konten, jangan pernah memperlihatkan:
- Lokasi rumah atau sekolah
- Seragam sekolah dengan nama dan alamat sekolah terlihat jelas
- Nomor telepon atau alamat email
- Informasi keuangan keluarga

**Tips:** Periksa metadata foto! Beberapa HP menyimpan lokasi GPS dalam foto yang kamu ambil. Matikan fitur lokasi saat mengambil foto.

#### 3. Hormati Privasi Orang Lain 

- **Minta izin** sebelum memfoto atau merekam video orang lain
- **Jangan posting** foto atau video teman tanpa persetujuan mereka
- **Blur wajah** orang lain jika mereka tidak ingin terlihat

#### 4. Buat Konten yang Positif 

Konten positif bisa berupa:
- Tutorial (cara menggambar, memasak, belajar)
- Musik atau lagu ciptaan sendiri
- Karya seni digital
- Cerita atau puisi
- Tips menjaga lingkungan
- Review jujur tentang game atau buku

#### 5. Lindungi Karyamu 

Cara melindungi konten yang kamu buat:
- **Tambahkan watermark** – Tanda nama atau logo kecil di karyamu
- **Simpan file asli** – Selalu simpan versi asli (sebelum diedit) sebagai bukti kepemilikan
- **Catat tanggal pembuatan** – Ini bisa menjadi bukti jika ada yang mengaku sebagai pembuat
- **Gunakan platform yang aman** – Posting di platform yang memiliki perlindungan hak cipta

### Metadata: Informasi Tersembunyi dalam File

Tahukah kamu bahwa setiap foto yang kamu ambil dengan HP menyimpan informasi tersembunyi? Ini disebut **metadata**, yang bisa berisi:
- Lokasi GPS di mana foto diambil
- Tanggal dan waktu pengambilan
- Jenis perangkat yang digunakan
- Pengaturan kamera

**Penting:** Sebelum membagikan foto, periksa dan hapus metadata yang mengandung lokasi!

### Konten yang TIDAK Boleh Dibuat

 Konten yang mengandung kekerasan atau bullying
 Konten yang menyebarkan kebencian (hate speech)
 Konten yang mengandung informasi palsu (hoaks)
 Konten yang membahayakan diri sendiri atau orang lain
 Konten yang melanggar hak cipta orang lain
 Konten yang menampilkan informasi pribadi orang lain tanpa izin`
    },
    {
      type: "ayo-memahami",
      title: "Ayo, Memahami!",
      content: "Jawab pertanyaan berikut:",
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Metadata dalam sebuah foto bisa mengandung...",
          options: [
            {
              id: "a",
              text: "Hanya warna gambar",
              isCorrect: false
            },
            {
              id: "b",
              text: "Lokasi GPS, tanggal, dan jenis perangkat",
              isCorrect: true
            },
            {
              id: "c",
              text: "Hanya ukuran file",
              isCorrect: false
            },
            {
              id: "d",
              text: "Nama orang dalam foto",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          question: "Sebelum memfoto teman untuk diposting, kamu harus...",
          options: [
            {
              id: "a",
              text: "Langsung posting tanpa bertanya",
              isCorrect: false
            },
            {
              id: "b",
              text: "Meminta izin terlebih dahulu",
              isCorrect: true
            },
            {
              id: "c",
              text: "Foto diam-diam agar lebih natural",
              isCorrect: false
            },
            {
              id: "d",
              text: "Edit fotonya agar tidak dikenali",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Sebutkan 3 jenis konten positif yang bisa kamu buat dan bagikan di internet! Jelaskan mengapa konten tersebut bermanfaat.",
          correctAnswer: "Siswa menyebutkan konten positif (tutorial, karya seni, tips, cerita, dll) dan menjelaskan manfaatnya bagi diri sendiri dan orang lain.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-mengamati",
      title: "Ayo, Mengamati!",
      content: `## Studi Kasus: Video Hana yang Viral

Hana membuat video TikTok yang menampilkan dirinya sedang menari di rumah. Video itu viral dan dilihat ribuan orang! Hana senang sekali.

Tapi kemudian dia menyadari beberapa masalah:
1. Di video tersebut, terlihat jelas **nomor rumah dan nama jalan** tempat tinggalnya
2. Hana mengenakan **seragam sekolah** dengan nama sekolah yang bisa dibaca
3. Di meja belakangnya, terlihat **foto keluarga** dan **kalender dengan jadwal kegiatan**
4. Metadata video menyimpan **lokasi GPS** rumahnya

Orang asing mulai mengirim pesan dan bahkan ada yang menyebut nama sekolahnya.

### Pelajaran:
- Selalu periksa latar belakang sebelum merekam video
- Jangan kenakan seragam sekolah saat membuat konten publik
- Hapus metadata lokasi sebelum mengunggah
- Atur privasi akun agar hanya orang yang dikenal bisa melihat`,
      questions: [
        {
          id: qid(),
          type: "mc",
          question: "Kesalahan utama Hana dalam membuat video adalah...",
          options: [
            {
              id: "a",
              text: "Menari dengan gerakan yang salah",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menampilkan informasi pribadi (alamat, sekolah) tanpa disadari",
              isCorrect: true
            },
            {
              id: "c",
              text: "Membuat video terlalu pendek",
              isCorrect: false
            },
            {
              id: "d",
              text: "Tidak menggunakan filter",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "essay",
          question: "Buatlah daftar checklist (minimal 4 poin) yang harus diperiksa sebelum mengunggah foto atau video ke internet!",
          correctAnswer: "Checklist: periksa latar belakang, hapus metadata, pastikan tidak ada info pribadi terlihat, minta izin jika ada orang lain, atur privasi akun.",
          points: 20
        }
      ]
    },
    {
      type: "ayo-bereksplorasi",
      title: "Ayo, Bereksplorasi!",
      content: "Unggah karya kampanye digitalmu dan tuliskan kesan/saran selama belajar SiberCerdas.",
    },
    {
      type: "uji-pemahaman",
      title: "Uji Pemahamanmu!",
      content: "Pilihlah jawaban yang paling tepat berdasarkan situasi kampanye digital berikut.",
      questions: [
        {
          id: qid(),
          type: "mc",
          context: `Kelas 6 diminta membuat ajakan agar teman-teman lebih aman dan bertanggung jawab saat memakai internet. Karya boleh berupa poster, slide, komik pendek, atau infografik mini.`,
          question: "Berdasarkan situasi tersebut, kampanye digital adalah....",
          options: [
            {
              id: "a",
              text: "dokumentasi tugas pribadi yang hanya disimpan di perangkat masing-masing.",
              isCorrect: false
            },
            {
              id: "b",
              text: "kegiatan menyampaikan pesan atau ajakan positif melalui media digital.",
              isCorrect: true
            },
            {
              id: "c",
              text: "kegiatan membagikan tautan populer agar karya cepat banyak dilihat.",
              isCorrect: false
            },
            {
              id: "d",
              text: "lomba membuat desain yang mengutamakan gambar paling ramai dan warna paling mencolok.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          imageUrl: "/gambar/topik%208/contoh%20poster%202.png",
          context: `Perhatikan contoh poster kampanye anti-bullying. Poster itu berisi ajakan saling menghormati, tidak mengejek teman, dan melapor jika terjadi bullying.`,
          question: "Mengapa poster tersebut dapat menjadi contoh kampanye digital yang baik?",
          options: [
            {
              id: "a",
              text: "Pesannya jelas, sopan, aman, dan mengajak pembaca melakukan tindakan yang bermanfaat.",
              isCorrect: true
            },
            {
              id: "b",
              text: "Warna dan ilustrasinya menarik, sehingga isi pesan tidak perlu diperiksa lagi.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Posternya terlihat serius, jadi pembuat boleh menambahkan nama lengkap dan nomor HP agar lebih dipercaya.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Topiknya sedang sering dibicarakan, sehingga pasti benar walaupun tidak memberi ajakan yang jelas.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Tim Bima membuat empat calon slogan:
1. "Cek dulu sumber informasi sebelum percaya."
2. "Kalau masih percaya hoaks, kamu bodoh."
3. "Jangan klik tautan hadiah sebelum memastikan sumbernya."
4. "Sebarkan foto teman yang lucu supaya grup ramai."`,
          question: "Pasangan slogan yang paling sesuai untuk kampanye digital yang aman dan santun adalah....",
          options: [
            {
              id: "a",
              text: "1 dan 2, karena keduanya membahas informasi palsu dengan tegas.",
              isCorrect: false
            },
            {
              id: "b",
              text: "2 dan 3, karena keduanya mendorong teman agar lebih berhati-hati.",
              isCorrect: false
            },
            {
              id: "c",
              text: "1 dan 3, karena keduanya memberi ajakan aman tanpa merendahkan orang lain.",
              isCorrect: true
            },
            {
              id: "d",
              text: "3 dan 4, karena keduanya membuat grup menjadi lebih aktif.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Sebelum mengunggah poster kampanye, kelompokmu memakai foto dari internet, menampilkan foto teman sekelas, dan mengutip kalimat dari sebuah artikel.`,
          question: "Checklist paling lengkap sebelum poster dibagikan adalah....",
          options: [
            {
              id: "a",
              text: "Memastikan warna poster menarik dan ukuran huruf cukup besar untuk dibaca.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mengecek isi pesan, kesantunan bahasa, izin foto teman, data pribadi, dan sumber gambar/kutipan.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Meminta teman memberi komentar lebih dulu agar poster terlihat ramai saat dipublikasikan.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Mengunggah poster ke grup kecil dulu agar kesalahan tidak terlalu terlihat oleh banyak orang.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Poster kampanye Nisa sudah bagus, tetapi di bagian bawah tertulis:
"Dibuat oleh Nisa Putri, kelas 6B, SD Merdeka, 0812-xxxx-xxxx, alamat rumah: Jalan Melati 10."`,
          question: "Revisi paling tepat sebelum poster itu dibagikan adalah....",
          options: [
            {
              id: "a",
              text: "Membiarkan semua data karena membuat pembuat poster terlihat bertanggung jawab.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Memperkecil ukuran tulisan data pribadi agar tidak terlalu terlihat oleh pembaca.",
              isCorrect: false
            },
            {
              id: "c",
              text: "Menghapus nomor HP dan alamat rumah, serta cukup menulis identitas seperlunya sesuai aturan kelas.",
              isCorrect: true
            },
            {
              id: "d",
              text: "Mengunggahnya hanya ke media sosial pribadi karena pengikutnya lebih sedikit.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Kelompokmu menemukan gambar menarik di internet untuk latar poster, tetapi tidak ada nama pembuat, izin penggunaan, atau situs sumber yang jelas.`,
          question: "Tindakan paling aman dan menghargai karya orang lain adalah....",
          options: [
            {
              id: "a",
              text: "Tetap memakai gambar itu karena hanya digunakan untuk tugas sekolah.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Mencari gambar lain yang jelas izin dan sumbernya, lalu menuliskan kredit karya.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengedit warna gambar agar berbeda dari gambar yang ditemukan di internet.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menulis \"sumber: internet\" agar pembaca tahu gambar bukan buatan kelompokmu.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Temanmu menunjukkan poster kampanye. Pesannya bagus, tetapi huruf kecil di bagian bawah sulit dibaca.`,
          question: "Komentar yang paling sopan dan membantu adalah....",
          options: [
            {
              id: "a",
              text: "\"Postermu bagus, tapi huruf bawahnya susah dibaca. Coba dibuat sedikit lebih besar, ya.\"",
              isCorrect: true
            },
            {
              id: "b",
              text: "\"Aku tidak bisa membaca bagian bawahnya, jadi postermu kurang berhasil.\"",
              isCorrect: false
            },
            {
              id: "c",
              text: "\"Kalau mau bagus, seharusnya kamu meniru poster yang sudah viral saja.\"",
              isCorrect: false
            },
            {
              id: "d",
              text: "\"Pesannya sudah baik, jadi ukuran huruf tidak perlu diperhatikan lagi.\"",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Setelah poster hampir selesai, kamu sadar ada nomor HP pribadi anggota kelompok di bagian kontak. Poster belum dikirim ke guru.`,
          question: "Keputusan terbaik adalah....",
          options: [
            {
              id: "a",
              text: "Tetap mengirim poster karena nomor HP bisa membantu teman bertanya tentang kampanye.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Menghapus atau mengganti bagian itu dengan kontak yang aman sesuai arahan guru.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Mengirimnya hanya ke guru, karena data pribadi aman jika tidak dibagikan ke media sosial.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Menambahkan peringatan agar orang lain tidak menyalahgunakan nomor tersebut.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Guru meminta karya kampanye dikumpulkan di ruang belajar digital kelas. Beberapa teman mengusulkan agar poster langsung diunggah ke akun publik supaya cepat banyak penonton.`,
          question: "Tempat yang paling tepat untuk membagikan karya tugas adalah....",
          options: [
            {
              id: "a",
              text: "ruang belajar digital yang ditentukan guru, karena sesuai tujuan tugas dan lebih terarah.",
              isCorrect: true
            },
            {
              id: "b",
              text: "akun publik pribadi, karena kampanye yang baik harus selalu mengejar jangkauan luas.",
              isCorrect: false
            },
            {
              id: "c",
              text: "grup umum yang ramai, asalkan poster tidak memuat kata-kata kasar.",
              isCorrect: false
            },
            {
              id: "d",
              text: "kolom komentar akun terkenal agar lebih banyak orang melihat karya tersebut.",
              isCorrect: false
            }
          ],
          points: 10
        },
        {
          id: qid(),
          type: "mc",
          context: `Pada akhir modul, kamu ingin membuat kampanye bertema "Jadi Pengguna Digital HEBAT". Kampanye itu harus menggabungkan pelajaran tentang cek fakta, privasi, keamanan, kesantunan, anti-bullying, dan menghargai karya.`,
          question: "Pilihan konsep kampanye yang paling sesuai dengan tujuan Topik 8 adalah....",
          options: [
            {
              id: "a",
              text: "Poster berisi banyak istilah teknologi agar terlihat lengkap, meskipun ajakannya tidak jelas.",
              isCorrect: false
            },
            {
              id: "b",
              text: "Poster yang mengajak teman aman, sopan, jujur, dan bertanggung jawab dengan contoh tindakan nyata.",
              isCorrect: true
            },
            {
              id: "c",
              text: "Poster yang lucu dan ramai agar cepat disukai, walaupun memakai gambar tanpa sumber.",
              isCorrect: false
            },
            {
              id: "d",
              text: "Poster yang menegur teman dengan keras supaya mereka takut melakukan kesalahan digital.",
              isCorrect: false
            }
          ],
          points: 10
        }
      ]
    },
    {
      type: "refleksi",
      title: "Ayo, Renungkan!",
      content: "Selamat! Kamu telah menyelesaikan seluruh modul SiberCerdas. Profil **HEBAT** (Hati-hati, Etis, Bijak, Aman, Tangguh) kini menjadi kompas perilaku digitalmu. Pada topik ini, kamu menyatukan semua sikap itu dalam karya kampanye digital. Renungkan perjalanan belajarmu dan jawab dengan jujur!",
      questions: [
        {
          id: qid(),
          type: "reflective",
          question: "Pesan kampanye digital apa yang ingin kamu sebarluaskan kepada teman? Mengapa pesan itu penting?",
          points: 0
        },
        {
          id: qid(),
          type: "reflective",
          question: "Dari delapan topik, hal apa yang paling berkesan dan akan kamu terapkan saat menggunakan internet?",
          points: 0
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════
 MODULE ASSEMBLY
 ═══════════════════════════════════════════════ */

export const moduleData: Module = {
  id: 'modul-1',
  title: 'Aku Cerdas di Dunia Digital',
  description:
    'Modul pembelajaran literasi digital dan keamanan siber untuk siswa kelas 6 SD. Terdiri dari 8 topik yang membahas identitas digital, hoaks, privasi, keamanan siber, etika komunikasi, media sosial, hak cipta, dan kreasi konten yang aman.',
  topics: [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8],
};

/* ═══════════════════════════════════════════════
 PRE-TEST (10 MC – satu per topik + 2 umum)
 ═══════════════════════════════════════════════ */

export const preTestQuestions: Question[] = [
  {
    id: 'pre-1',
    type: 'mc',
    question: 'Apa yang dimaksud dengan identitas digital?',
    options: [
      { id: 'a', text: 'Kartu identitas yang dicetak digital', isCorrect: false },
      { id: 'b', text: 'Semua informasi tentang dirimu yang ada di internet', isCorrect: true },
      { id: 'c', text: 'Nomor HP', isCorrect: false },
      { id: 'd', text: 'Password email', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-2',
    type: 'mc',
    question: 'Hoaks adalah...',
    options: [
      { id: 'a', text: 'Berita yang selalu benar', isCorrect: false },
      { id: 'b', text: 'Informasi palsu yang disebarkan untuk menipu', isCorrect: true },
      { id: 'c', text: 'Berita dari televisi', isCorrect: false },
      { id: 'd', text: 'Pesan dari guru', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-3',
    type: 'mc',
    question: 'Data pribadi yang TIDAK boleh dibagikan di internet adalah...',
    options: [
      { id: 'a', text: 'Makanan favorit', isCorrect: false },
      { id: 'b', text: 'Hobi', isCorrect: false },
      { id: 'c', text: 'Nomor KTP dan alamat rumah', isCorrect: true },
      { id: 'd', text: 'Film kesukaan', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-4',
    type: 'mc',
    question: 'Malware adalah...',
    options: [
      { id: 'a', text: 'Perangkat lunak yang berguna', isCorrect: false },
      { id: 'b', text: 'Perangkat lunak jahat yang merusak komputer', isCorrect: true },
      { id: 'c', text: 'Game online populer', isCorrect: false },
      { id: 'd', text: 'Aplikasi belajar', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-5',
    type: 'mc',
    question: 'Menulis pesan dengan HURUF BESAR SEMUA di chat artinya...',
    options: [
      { id: 'a', text: 'Menulis dengan lebih rapi', isCorrect: false },
      { id: 'b', text: 'Seperti berteriak dan bisa dianggap tidak sopan', isCorrect: true },
      { id: 'c', text: 'Menunjukkan bahwa pesan itu penting', isCorrect: false },
      { id: 'd', text: 'Membuat pesan lebih mudah dibaca', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-6',
    type: 'mc',
    question: 'FOMO (Fear of Missing Out) adalah...',
    options: [
      { id: 'a', text: 'Aplikasi media sosial', isCorrect: false },
      { id: 'b', text: 'Perasaan takut ketinggalan tren di media sosial', isCorrect: true },
      { id: 'c', text: 'Jenis virus komputer', isCorrect: false },
      { id: 'd', text: 'Fitur privasi di Instagram', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-7',
    type: 'mc',
    question: 'Plagiarisme adalah...',
    options: [
      { id: 'a', text: 'Membuat karya sendiri', isCorrect: false },
      { id: 'b', text: 'Mengambil karya orang lain dan mengaku sebagai karya sendiri', isCorrect: true },
      { id: 'c', text: 'Membagikan karya dengan izin', isCorrect: false },
      { id: 'd', text: 'Menjual buku', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-8',
    type: 'mc',
    question: 'Watermark pada karya digital berfungsi untuk...',
    options: [
      { id: 'a', text: 'Membuat gambar lebih indah', isCorrect: false },
      { id: 'b', text: 'Menunjukkan kepemilikan dan melindungi dari pencurian', isCorrect: true },
      { id: 'c', text: 'Memperkecil ukuran file', isCorrect: false },
      { id: 'd', text: 'Menambah efek pada foto', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-9',
    type: 'mc',
    question: 'Jejak digital adalah...',
    options: [
      { id: 'a', text: 'Jejak kaki di tanah', isCorrect: false },
      { id: 'b', text: 'Semua aktivitas yang kita tinggalkan di internet', isCorrect: true },
      { id: 'c', text: 'Catatan nilai di sekolah', isCorrect: false },
      { id: 'd', text: 'Buku harian', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'pre-10',
    type: 'mc',
    question: 'Password yang paling aman adalah...',
    options: [
      { id: 'a', text: '123456', isCorrect: false },
      { id: 'b', text: 'password', isCorrect: false },
      { id: 'c', text: 'B1ntang_L@ut!99', isCorrect: true },
      { id: 'd', text: 'namasaya', isCorrect: false },
    ],
    points: 10,
  },
];

/* ═══════════════════════════════════════════════
 POST-TEST (10 MC – different from pre-test)
 ═══════════════════════════════════════════════ */

export const postTestQuestions: Question[] = [
  {
    id: 'post-1',
    type: 'mc',
    question: 'Berikut yang termasuk jejak digital aktif adalah...',
    options: [
      { id: 'a', text: 'Riwayat pencarian di Google', isCorrect: false },
      { id: 'b', text: 'Cookie yang tersimpan di browser', isCorrect: false },
      { id: 'c', text: 'Memposting foto di media sosial', isCorrect: true },
      { id: 'd', text: 'Data lokasi yang terekam otomatis', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-2',
    type: 'mc',
    question: 'Saat menerima pesan yang heboh dan meminta segera disebar, langkah pertama yang paling tepat untuk memeriksa kebenarannya adalah...',
    options: [
      { id: 'a', text: 'Meneruskan pesan itu agar teman cepat tahu', isCorrect: false },
      { id: 'b', text: 'Memeriksa siapa sumber pesan tersebut', isCorrect: true },
      { id: 'c', text: 'Menyimpulkan isi pesan hanya dari judulnya', isCorrect: false },
      { id: 'd', text: 'Mempercayainya karena banyak orang sudah membagikannya', isCorrect: false },
    ],
    points: 10,
    explanation: 'Langkah pertama memeriksa informasi adalah memastikan siapa sumbernya, sebelum membaca isi, mengecek tanggal, dan membandingkan dengan sumber lain.',
  },

  {
    id: 'post-3',
    type: 'mc',
    question: 'Phishing adalah upaya untuk...',
    options: [
      { id: 'a', text: 'Menangkap ikan secara online', isCorrect: false },
      { id: 'b', text: 'Menipu seseorang agar memberikan data pribadi', isCorrect: true },
      { id: 'c', text: 'Mengirim foto ikan ke teman', isCorrect: false },
      { id: 'd', text: 'Bermain game memancing', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-4',
    type: 'mc',
    question: 'Saat muncul pop-up yang mengatakan "Kamu menang hadiah!", yang harus dilakukan adalah...',
    options: [
      { id: 'a', text: 'Klik untuk mengambil hadiah', isCorrect: false },
      { id: 'b', text: 'Masukkan data pribadi untuk klaim hadiah', isCorrect: false },
      { id: 'c', text: 'Menutup pop-up tanpa mengklik apa pun', isCorrect: true },
      { id: 'd', text: 'Membagikan ke teman agar mereka juga menang', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-5',
    type: 'mc',
    question: 'Cyberbullying bisa menyebabkan korban...',
    options: [
      { id: 'a', text: 'Menjadi lebih populer', isCorrect: false },
      { id: 'b', text: 'Merasa sedih, takut, dan stres', isCorrect: true },
      { id: 'c', text: 'Mendapat lebih banyak teman', isCorrect: false },
      { id: 'd', text: 'Nilai sekolah meningkat', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-6',
    type: 'mc',
    question: 'Digital wellbeing berarti...',
    options: [
      { id: 'a', text: 'Menggunakan HP sepuasnya', isCorrect: false },
      { id: 'b', text: 'Menjaga keseimbangan dan kesehatan dalam penggunaan teknologi', isCorrect: true },
      { id: 'c', text: 'Memiliki gadget terbaru', isCorrect: false },
      { id: 'd', text: 'Selalu online 24 jam', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-7',
    type: 'mc',
    question: 'Creative Commons (CC BY) mengizinkan penggunaan karya dengan syarat...',
    options: [
      { id: 'a', text: 'Membayar pemilik karya', isCorrect: false },
      { id: 'b', text: 'Mencantumkan nama pembuat karya', isCorrect: true },
      { id: 'c', text: 'Tidak boleh digunakan sama sekali', isCorrect: false },
      { id: 'd', text: 'Mengubah nama pembuat karya', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-8',
    type: 'mc',
    question: 'Metadata dalam foto yang perlu diperiksa sebelum posting adalah...',
    options: [
      { id: 'a', text: 'Warna gambar', isCorrect: false },
      { id: 'b', text: 'Lokasi GPS dan informasi perangkat', isCorrect: true },
      { id: 'c', text: 'Ukuran frame', isCorrect: false },
      { id: 'd', text: 'Jumlah piksel', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-9',
    type: 'mc',
    question: 'Jika kamu melihat teman di-bully secara online, sebaiknya kamu...',
    options: [
      { id: 'a', text: 'Ikut mem-bully juga', isCorrect: false },
      { id: 'b', text: 'Diam saja', isCorrect: false },
      { id: 'c', text: 'Mendukung teman dan melaporkan ke orang dewasa', isCorrect: true },
      { id: 'd', text: 'Merekam dan menyebarkan kejadiannya', isCorrect: false },
    ],
    points: 10,
  },
  {
    id: 'post-10',
    type: 'mc',
    question: 'Tempat paling aman untuk mengunduh aplikasi adalah...',
    options: [
      { id: 'a', text: 'Website acak di internet', isCorrect: false },
      { id: 'b', text: 'Link dari pesan WhatsApp', isCorrect: false },
      { id: 'c', text: 'Toko resmi seperti Play Store atau App Store', isCorrect: true },
      { id: 'd', text: 'Pop-up iklan', isCorrect: false },
    ],
    points: 10,
  },
];

/* ═══════════════════════════════════════════════
 RUBRIC CRITERIA
 ═══════════════════════════════════════════════ */

export const rubricCriteria: RubricCriterion[] = [
  {
    id: 'rubric-pemahaman',
    name: 'Pemahaman Konsep',
    description:
      'Kemampuan siswa dalam memahami dan menjelaskan konsep-konsep literasi digital, termasuk istilah-istilah kunci dan prinsip dasar keamanan siber.',
    weight: 30,
  },
  {
    id: 'rubric-analisis',
    name: 'Kemampuan Analisis',
    description:
      'Kemampuan siswa dalam menganalisis situasi, membedakan informasi benar dan palsu, serta mengidentifikasi risiko dan ancaman di dunia digital.',
    weight: 25,
  },
  {
    id: 'rubric-penerapan',
    name: 'Penerapan Pengetahuan',
    description:
      'Kemampuan siswa dalam menerapkan pengetahuan literasi digital dalam situasi nyata, seperti membuat password yang kuat, mengenali phishing, dan menggunakan konten secara etis.',
    weight: 25,
  },
  {
    id: 'rubric-refleksi',
    name: 'Refleksi & Kesadaran Digital',
    description:
      'Kemampuan siswa dalam merefleksikan perilaku digitalnya sendiri dan menunjukkan kesadaran tentang pentingnya menjadi warga digital yang bertanggung jawab.',
    weight: 20,
  },
];

import { allBadges } from './badges';
export { allBadges };
export const topicModules = moduleData.topics;
