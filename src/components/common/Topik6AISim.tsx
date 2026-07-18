import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Heart, MessageCircle, Play, Send, Volume2, VolumeX } from 'lucide-react';
import { generateGeminiReply, parseJsonReply, type GeminiTurn } from '../../lib/gemini';

interface ActivityProps {
 answers?: Record<string, any>;
 onSave?: (val: Record<string, any>) => void;
}

/* ══════════════════════════════════════════════════
 Konfigurasi tiap skenario simulasi AI
 ══════════════════════════════════════════════════ */
interface SimConfig {
 id: string;
 saveKey: string;
 badge: string;
 title: string;
 complexity: 'Dasar' | 'Sedang' | 'Kompleks';
 platform: 'wa' | 'tiktok';
 headerName: string;
 headerSub: string;
 avatar: string;
 intro: string;
 victim?: string;
 victimReplies: Record<string, string>; // respon korban per giliran chat (maks 2 giliran)
 bullyName: string;
 videoUrl?: string; // Khusus TikTok
 openingMessages: { name: string; text: string; image?: string }[];
 systemInstruction: string;
 actions: { id: string; label: string; emoji: string; good: boolean; feedback: string }[];
}

const SIM_CONFIGS: SimConfig[] = [
 {
 id: 'sim-wa-tugas',
 saveKey: 't6-sim-wa-tugas',
 badge: 'Simulasi WA · Grup Kelas',
 title: 'Membela Teman di Grup Kelas',
 complexity: 'Dasar',
 platform: 'wa',
 headerName: 'Grup Kelas 5',
 headerSub: '28 anggota',
 avatar: 'GK',
 victim: 'Doni',
 victimReplies: {
 turn1: 'Iya Riko, sebenarnya aku sedih dibilang lemot di grup kelas... Aku cuma ingin nanya tugas saja karena tadi sakit. Makasih ya sudah bantu membela aku.',
 turn2: 'Terima kasih banyak Riko sudah minta maaf, dan makasih banyak buat temen-temen yang sudah membantu aku di grup. '
 },
 bullyName: 'Riko',
 intro: 'Riko mengejek Doni yang bertanya tugas sekolah di grup kelas. Tegurlah Riko agar menghargai temannya.',
 openingMessages: [
 { name: 'Doni', text: 'Teman-teman, maaf mengganggu. Aku benar-benar bingung dengan tugas Matematika halaman 12 yang dikumpulkan besok pagi. Ada yang punya foto cara mengerjakannya? Aku tadi sakit dan ketinggalan penjelasan guru. Terima kasih banyak ' },
 { name: 'Riko', text: 'Halah Don, gitu aja gak bisa. Kan gampang banget itu tinggal ditambah-tambahin doang. Makanya kalau di kelas jangan tidur terus atau bengong wkwk. Doni emang dari dulu paling lambat paham di kelas kita ' },
 { name: 'Fajar', text: 'Iya nih Doni, tiap ada tugas pasti nanya terus di grup kelas. Bikin rame notif HP aja deh, ganggu orang lagi main game.' }
 ],
 systemInstruction: `Kamu berperan sebagai Riko, anak SD kelas 5 yang sombong dan suka meremehkan temannya yang kurang pintar (Doni) di grup WA kelas. Ketika ditegur pengguna, kamu awalnya membela diri secara ngeyel ("kan cuma bercanda", "lebay banget sih", "suka-suka aku"). Kamu harus membela diri pada putaran pertama. Baru pada putaran ke-2 (pesan kedua dari pengguna), jika pengguna tetap konsisten mengingatkanmu secara sopan dan tegas, kamu sadar salah dan bersedia meminta maaf kepada Doni. Jika pengguna membalas dengan kasar, tanggapi dengan marah dan ketus. Balas dalam 2-3 kalimat yang cukup panjang dan membela diri.
 Format JSON respons wajib: {"reply": "balasan riko", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'wa-tugas-opt1',
 label: 'Menghubungi Doni secara pribadi untuk memberikan dukungan emosional dan membagikan foto catatan materi pelajaran secara langsung, lalu di grup kelas menulis pesan tegas: "Teman-teman, mari kita jadikan grup ini tempat saling membantu belajar. Doni bertanya karena sakit, bukan karena malas. Ayo kita fokus bantu dia daripada saling mengejek."',
  emoji: '🤝',
 good: true,
 feedback: 'Luar biasa! Tindakan ini adalah tindakan Upstander yang ideal. Kamu menenangkan perasaan Doni (empati) sekaligus menegaskan batas perilaku di grup kelas tanpa menyerang pribadi Riko secara agresif, melainkan mengarahkan fokus grup kembali ke norma positif saling mendukung belajar.'
 },
 {
 id: 'wa-tugas-opt2',
 label: 'Mengajak teman-teman lain di grup untuk membuat kesepakatan tata tertib grup kelas (group rules), lalu secara publik menanggapi: "Riko dan Fajar, jika kalian tidak ingin membantu, lebih baik tidak merundung Doni. Saling menghargai adalah aturan dasar komunikasi kita di sekolah maupun di grup ini."',
  emoji: '📜',
 good: true,
 feedback: 'Sangat cerdas! Kamu melakukan intervensi dengan menetapkan aturan sosial yang jelas di grup. Ini mengajarkan pentingnya etika digital terstruktur. Namun, pastikan kamu juga tetap menjangkau Doni secara pribadi agar dia tahu dia tidak sendirian.'
 },
 {
 id: 'wa-tugas-opt3',
 label: 'Melaporkan komentar Riko dan Fajar kepada guru wali kelas melalui pesan pribadi (japri) agar guru segera mengintervensi grup kelas, sambil kamu memilih diam di grup kelas untuk menghindari pertengkaran terbuka yang bisa mempermalukan Doni lebih lanjut.',
  emoji: '👩‍🏫',
 good: false,
 feedback: 'Cukup hati-hati, namun kurang maksimal. Melaporkan ke guru memang penting jika perundungan sudah parah, namun dengan tetap diam di grup kelas, kamu membiarkan opini negatif Riko mendominasi saat itu juga. Doni mungkin merasa tidak ada satupun teman sekelasnya yang peduli membela dirinya di tempat umum.'
 }
 ]
 },
 {
 id: 'sim-tiktok-puisi',
 saveKey: 't6-sim-tiktok-puisi',
 badge: 'Simulasi TikTok · Komentar Video',
 title: 'Menanggapi Ejekan Video Puisi',
 complexity: 'Dasar',
 platform: 'tiktok',
 headerName: '@raka.belajar',
 headerSub: 'Video puisi · 320 suka',
 avatar: 'RK',
 victim: '@raka.belajar',
 victimReplies: {
 turn1: 'Iya @aldi, aku emang gugup banget rekamnya. Maaf ya kalau suaraku terlalu kecil... Makasih banyak ya teman-teman sudah menyemangati aku di kolom komentar.',
 turn2: 'Makasih @aldi udah mau minta maaf dan hapus komentarnya. Aku bakal terus belajar membaca puisi agar lebih baik.'
 },
 bullyName: '@aldi',
 videoUrl: '/gambar/topik 6/Menanggapi Ejekan Video Puisi.mp4',
 intro: 'Raka mengunggah video membaca puisi namun terlihat gugup. Akun @aldi menulis komentar jahat mengejek Raka. Balaslah komentar @aldi untuk mendukung Raka.',
 openingMessages: [
 { name: '@raka.belajar', text: 'Tugas membaca puisi untuk pelajaran Bahasa Indonesia kelas 5. Maaf ya teman-teman kalau suaraku terdengar sangat pelan, badanku agak gemetar karena ini pertama kalinya aku rekam video dan diposting di medsos. Mohon kritik dan sarannya yang membangun ' },
 { name: '@aldi', text: 'Hahaha suaranya kecil banget kayak semut berbisik, gugupnya kelihatan jelas lagi sampai gemeteran gitu tangannya. Malu-maluin banget ditonton satu sekolah! Mending dihapus aja videonya daripada bikin malu wkwk ' }
 ],
 systemInstruction: `Kamu berperan sebagai @aldi, murid SD yang meninggalkan komentar jahat di video tugas puisi Raka. Kamu merasa komentarmu jujur dan menganggap teguran pengguna terlalu berlebihan ("aku kan cuma ngasih tahu fakta", "emang jelek kok mau gimana lagi"). Kamu membela diri pada putaran pertama. Pada putaran chat ke-2, jika pengguna terus membela Raka dengan sopan, menghargai usahanya, dan menegurmu dengan tegas, kamu harus merasa malu, meminta maaf, dan berjanji akan menghapus komentarmu. Balas dalam 2-3 kalimat yang membela diri secara detail.
 Format JSON respons wajib: {"reply": "balasan aldi", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'tiktok-puisi-opt1',
 label: 'Menulis komentar pendukung yang fokus pada kekuatan puisi Raka (seperti pemilihan kata atau intonasinya), lalu membalas komentar @aldi: "@aldi, gugup saat pertama kali tampil di depan kamera adalah hal yang wajar. Upaya Raka untuk terus mencoba patut diapresiasi, bukan dijatuhkan. Kritik yang baik seharusnya membimbing, bukan mengejek."',
  emoji: '✨',
 good: true,
 feedback: 'Pilihan Upstander yang hebat! Kamu mengalihkan perhatian penonton ke aspek positif karya Raka (apresiasi) sekaligus mengedukasi @aldi secara logis tentang cara menyampaikan kritik konstruktif di media sosial tanpa menggunakan kata-kata kasar.'
 },
 {
 id: 'tiktok-puisi-opt2',
 label: 'Melaporkan komentar jahat @aldi ke sistem pelaporan TikTok sebagai pelanggaran perundungan (bullying), lalu mengirim pesan langsung (DM) kepada Raka berisi tip mengatasi kegugupan saat berbicara di depan kamera serta menyemangatinya agar tidak menghapus video.',
  emoji: '🛡️',
 good: true,
 feedback: 'Langkah perlindungan siber yang sangat tepat! Kamu menggunakan mekanisme pelaporan resmi platform untuk menghapus konten negatif secara aman, sambil memberikan bantuan konkret dan empati secara personal kepada Raka.'
 },
 {
 id: 'tiktok-puisi-opt3',
 label: 'Menulis komentar balasan untuk menyadarkan penonton lain dengan menulis: "Semua orang punya proses belajar yang berbeda. Mari kita abaikan komentar negatif @aldi dan penuhi kolom komentar ini dengan dukungan positif bagi Raka agar dia lebih percaya diri di tugas berikutnya!"',
  emoji: '💬',
 good: false,
 feedback: 'Ide yang baik untuk menggalang solidaritas, namun tindakan ini membiarkan komentar negatif @aldi tetap terpajang tanpa teguran langsung. Tanpa adanya tindakan pelaporan atau edukasi perilaku buruk, pelaku bisa merasa tindakannya dapat ditoleransi oleh komunitas.'
 }
 ]
 },
 {
 id: 'sim-wa-terpeleset',
 saveKey: 't6-sim-wa-terpeleset',
 badge: 'Simulasi WA · Cerita Utama',
 title: 'Penyebaran Foto Edo Terpeleset',
 complexity: 'Sedang',
 platform: 'wa',
 headerName: 'Grup Kelas 5',
 headerSub: '28 anggota',
 avatar: 'GK',
 victim: 'Edo',
 victimReplies: {
 turn1: 'Riko, tolong jangan disebarin lagi fotonya... Aku malu banget mukaku jadi bahan tertawaan sekelas. Makasih ya sudah bantu ingetin Riko.',
 turn2: 'Makasih banyak Riko udah mau hapus fotonya dari grup kelas. Makasih juga buat temen-temen yang udah bantu aku.'
 },
 bullyName: 'Riko',
 intro: 'Riko diam-diam memotret Edo saat terpeleset di sekolah dan menyebarkannya di grup kelas untuk ditertawakan. Minta Riko untuk menghapus foto tersebut.',
 openingMessages: [
 { name: 'Riko', text: 'Guys!!! Lihat foto si Edo tadi pas jam istirahat siang! Dia gak liat ada becekan air di depan tangga terus langsung kepeleset gedebuk! Untung sempat gw foto pas dia melayang jatuh, mukanya kaget banget sumpah kocak abis! ', image: '/edo_terpeleset.png' },
 { name: 'Gita', text: ' parah sih kasihan tapi ngakak banget liat ekspresi mukanya Edo' },
 { name: 'Fajar', text: 'Kasihan sih tapi lucu banget sumpah, share ke grup sebelah dong Riko biar rame anak-anak kelas lain pada liat!' }
 ],
 systemInstruction: `Kamu berperan sebagai Riko yang menyebarkan foto Edo terpeleset. Kamu merasa itu hanya candaan lucu dan menolak dituduh melanggar privasi atau melakukan cyberbullying ("kan cuma buat seru-seruan aja", "Edo aja gak marah kok kamu yang repot"). Kamu membela diri pada putaran chat pertama. Pada putaran chat ke-2, jika pengguna dengan sabar menjelaskan dampak buruk foto itu terhadap mental Edo dan menuntutmu menghapus foto secara sopan namun sangat tegas, kamu harus setuju untuk menghapusnya dan meminta maaf karena sadar itu melanggar privasi. Balas dengan 2-3 kalimat pembelaan diri.
 Format JSON respons wajib: {"reply": "balasan riko", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'wa-terpeleset-opt1',
 label: 'Segera mengingatkan Riko di grup kelas dengan pesan tegas: "Riko, memotret dan menyebarkan foto Edo terjatuh tanpa izin adalah pelanggaran privasi dan bisa menyakiti perasaannya. Tolong hapus foto ini sekarang sebelum menyebar ke grup lain." Lalu menghubungi wali kelas untuk melaporkan penyebaran foto tersebut.',
  emoji: '🛑',
 good: true,
 feedback: 'Luar biasa! Pilihan ini sangat berani dan solutif. Kamu bertindak cepat untuk menghentikan penyebaran foto di grup kelas (melindungi korban) sekaligus melaporkan kejadian secara formal ke guru demi mencegah dampak yang lebih luas.'
 },
 {
 id: 'wa-terpeleset-opt2',
 label: 'Mengirim pesan pribadi ke Riko, Gita, dan Fajar untuk menjelaskan secara empati: "Bayangkan jika kita yang terpeleset, kesakitan, lalu fotonya ditertawakan sekelas. Pasti malu sekali. Yuk kita bantu Edo dengan tidak memperbanyak stiker atau membagikannya ke grup lain."',
  emoji: '🤝',
 good: true,
 feedback: 'Sangat bijaksana! Pendekatan empati secara personal (backchanneling) seringkali efektif untuk melunakkan sikap pelaku tanpa membuat mereka merasa diserang di depan umum. Namun, pastikan foto di grup kelas utama tetap dihapus agar tidak menjadi jejak digital yang buruk bagi Edo.'
 },
 {
 id: 'wa-terpeleset-opt3',
 label: 'Menghubungi Edo secara pribadi untuk memintanya mengabaikan grup kelas sementara waktu agar tidak sedih, lalu menyarankan Edo agar dia sendiri yang menegur Riko secara langsung di grup atau meminta guru menindak Riko.',
  emoji: '🙋',
 good: false,
 feedback: 'Kurang tepat. Menyerahkan tanggung jawab membela diri sepenuhnya kepada Edo (korban) yang sedang tertekan adalah tindakan pasif. Sebagai teman yang melihat ketidakadilan, kamu seharusnya menjadi Upstander yang aktif membantu, bukan hanya menyuruh korban menyelesaikan masalahnya sendiri.'
 }
 ]
 },
 {
 id: 'sim-tiktok-dancekorea',
 saveKey: 't6-sim-tiktok-dancekorea',
 badge: 'Simulasi TikTok · Body Shaming',
 title: 'Membela Video Cover Dance Korea Dina',
 complexity: 'Kompleks',
 platform: 'tiktok',
 headerName: '@dina.dance',
 headerSub: 'Cover Dance K-pop · 1.5K suka',
 avatar: 'DN',
 victim: '@dina.dance',
 victimReplies: {
 turn1: 'Iya @dodi.keren, aku emang gak kurus. Tapi aku suka menari dan sudah latihan keras... Terima kasih banyak ya atas dukungan kalian di komentar.',
 turn2: 'Makasih @dodi.keren atas permintaan maafnya. Aku akan terus giat berlatih cover dance K-Pop.'
 },
 bullyName: '@dodi.keren',
 videoUrl: '/gambar/topik 6/Membela Video Cover Dance Korea Dina.mp4',
 intro: 'Dina mengunggah video latihan cover dance K-pop. Pengguna @dodi.keren mengejek bentuk fisik Dina dan gerakannya. Balas komentarnya untuk membela Dina.',
 openingMessages: [
 { name: '@dina.dance', text: 'Latihan cover dance K-Pop favoritku hari ini! Aku sudah latihan seminggu penuh untuk menghafal semua gerakannya dan melatih kelenturan tubuhku. Semoga kalian suka dengan hasil dance cover-ku ya! Semangat berlatih!' },
 { name: '@dodi.keren', text: 'Aduh, gerakannya kaku banget kayak robot kekurangan oli. Terus badannya juga gendut gak cocok banget pake baju crop top dan nge-dance lagu K-Pop. Mendingan dihapus aja deh videonya daripada bikin rusak pemandangan wkwk ' }
 ],
 systemInstruction: `Kamu berperan sebagai @dodi.keren yang melakukan body shaming terhadap video dance Dina di TikTok. Kamu sangat sombong, kasar, dan menganggap Dina tidak layak memposting video menari ("emang kenyataannya begitu kan", "kalau gendut ya jangan pamer joget"). Kamu menolak meminta maaf pada putaran pertama. Pada putaran ke-2, jika pengguna menjelaskan bahwa body shaming adalah tindakan merusak mental orang lain, mengapresiasi kerja keras Dina, dan memintamu menjaga ketikan dengan tegas, kamu menyerah, merasa bersalah, meminta maaf, dan berjanji tidak akan menulis komentar jahat lagi. Balas dengan 2-3 kalimat yang ketus di awal.
 Format JSON respons wajib: {"reply": "balasan dodi", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'tiktok-dance-opt1',
 label: 'Menulis komentar yang memuji teknik menari Dina yang energik dan kelenturannya setelah berlatih seminggu, lalu membalas komentar @dodi.keren: "@dodi.keren, seni tari adalah tentang ekspresi diri dan kerja keras. Bentuk fisik seseorang tidak membatasi haknya untuk berkarya. Mari hargai usahanya dan stop melakukan body shaming."',
  emoji: '💃',
 good: true,
 feedback: 'Sangat luar biasa! Ini adalah respon HOTS yang matang. Kamu membela Dina dengan argumen logis dan positif, mematahkan ejekan fisik (body shaming) pelaku, serta mengedukasi penonton lain tentang kebebasan berekspresi secara sehat.'
 },
 {
 id: 'tiktok-dance-opt2',
 label: 'Mengajak teman-teman kelas lainnya melalui grup WA untuk bersama-sama menulis komentar positif di video Dina guna menenggelamkan (spam positive comments) komentar jahat @dodi.keren, sekaligus melaporkan akun @dodi.keren ke TikTok secara massal.',
  emoji: '📣',
 good: true,
 feedback: 'Sangat taktis dan solutif! Dengan menggerakkan komunitas (kolaborasi sosial), kamu berhasil menciptakan lingkungan digital yang mendukung korban secara nyata dan memberikan sanksi sosial serta teknis bagi pelaku perundungan.'
 },
 {
 id: 'tiktok-dance-opt3',
 label: 'Mengirim pesan pribadi (DM) ke Dina menyarankan agar dia mengabaikan komentar @dodi.keren karena pelaku hanya cemburu, lalu menyarankan Dina untuk mengganti kostum menarinya di video berikutnya agar tidak memicu komentar fisik lagi.',
  emoji: '⚠️',
 good: false,
 feedback: 'Kurang tepat (Victim Blaming). Menyarankan korban untuk mengubah kostum atau penampilannya demi menghindari rundungan adalah kesalahan cara berpikir. Korban memiliki hak sepenuhnya untuk berpakaian sopan sesuai karyanya; perilaku pelaku lah yang harus dihentikan dan dikoreksi.'
 }
 ]
 },
 {
 id: 'sim-wa-kelompok',
 saveKey: 't6-sim-wa-kelompok',
 badge: 'Simulasi WA · Penolakan Teman',
 title: 'Ditolak Masuk Kelompok Belajar',
 complexity: 'Kompleks',
 platform: 'wa',
 headerName: 'Tugas Kelompok IPA',
 headerSub: '5 anggota',
 avatar: 'IPA',
 victim: 'Sinta',
 victimReplies: {
 turn1: 'Farel, aku janji bakal rajin ngerjain tugasnya kok. Tolong bolehin aku gabung ya, aku gak tahu harus masuk kelompok mana lagi... Makasih ya sudah bantu bela aku.',
 turn2: 'Terima kasih banyak Farel sudah memberi aku kesempatan bergabung kelompok IPA. Makasih ya teman-teman semuanya!'
 },
 bullyName: 'Farel',
 intro: 'Sinta ingin bergabung kelompok IPA, namun Farel secara kasar menolak Sinta dan menyebutnya beban. Nasihati Farel agar mau belajar kelompok bersama.',
 openingMessages: [
 { name: 'Sinta', text: 'Halo teman-teman, aku boleh gabung ke kelompok belajar IPA kalian? Kelompok lain sudah penuh semua anggotanya, tinggal aku yang belum dapat kelompok untuk tugas membuat kliping besok. Tolong ya...' },
 { name: 'Farel', text: 'Aduh Sinta, gak usah gabung kelompok kita deh. Kamu kan kalau kerja kelompok lambat banget, jarang mau nyumbang ide juga. Nanti malah kelompok kita yang nilainya jelek gara-gara kamu jadi beban doang ' },
 { name: 'Riko', text: 'Iya nih Sinta, cari kelompok lain aja yang santai. Kelompok kita targetnya mau dapet nilai A bulat dari Pak Guru.' }
 ],
 systemInstruction: `Kamu berperan sebagai Farel, ketua kelompok belajar IPA yang egois dan bersikap kasar menolak Sinta. Kamu bersikeras bahwa kerja kelompok harus dengan orang yang pintar saja agar tidak mendapat nilai jelek ("aku kan cuma mau kelompokku dapet nilai bagus", "cari kelompok lain kan bisa"). Kamu menolak saran pengguna pada putaran pertama. Pada putaran ke-2, jika pengguna menasihatimu tentang pentingnya menghargai teman, bersikap adil, dan mengajak belajar bersama demi kebersamaan kelas, kamu melunak dan setuju memberi kesempatan bagi Sinta. Balas dengan 2-3 kalimat pembelaan yang mementingkan nilai kelompok.
 Format JSON respons wajib: {"reply": "balasan farel", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'wa-kelompok-opt1',
 label: 'Mengusulkan pembagian tugas IPA secara adil di grup kelompok (misalnya Sinta membantu bagian menempel gambar atau merapikan kliping) dan menegaskan bahwa kelompok tugas sekolah harus merangkul semua teman tanpa membeda-bedakan kemampuan.',
  emoji: '🧩',
 good: true,
 feedback: 'Sangat Tepat (HOTS)! Ini merupakan pendekatan kolaboratif. Kamu menyelesaikan kekhawatiran Farel (masalah kualitas tugas) secara kolaboratif, sekaligus membela hak Sinta untuk belajar bersama secara inklusif.'
 },
 {
 id: 'wa-kelompok-opt2',
 label: 'Menghubungi Sinta secara pribadi untuk menenangkannya, lalu di grup kelas menulis pesan tegas: "Farel dan Riko, guru meminta kita belajar berkelompok agar bisa saling melengkapi kemampuan. Jika ada anggota yang kurang paham, tugas kita adalah membimbingnya bersama-sama, bukan menyingkirkannya."',
  emoji: '🤝',
 good: true,
 feedback: 'Sangat bagus! Kamu mengaitkan masalah ini dengan tujuan utama pembelajaran kelompok dari sekolah (edukatif). Kombinasi antara dukungan pribadi untuk Sinta dan penegasan aturan kelas di grup utama menunjukkan kematangan emosionalmu.'
 },
 {
 id: 'wa-kelompok-opt3',
 label: 'Memutuskan untuk keluar dari kelompok Farel sebagai bentuk solidaritas kepada Sinta, lalu mengajak Sinta membentuk kelompok baru berdua saja agar tidak perlu mengemis kesempatan pada kelompok Farel.',
  emoji: '🚪',
 good: false,
 feedback: 'Meskipun niat solidaritasmu baik, tindakan keluar dari kelompok secara mendadak justru memperkeruh hubungan pertemanan di kelas (reaktif) dan menghindari pemecahan masalah utama. Sinta juga mungkin merasa tidak enak hati karena merasa menjadi penyebab kamu keluar dari kelompok asalmu.'
 }
 ]
 },
 {
 id: 'sim-tiktok-masak',
 saveKey: 't6-sim-tiktok-masak',
 badge: 'Simulasi TikTok · Stereotip Gender',
 title: 'Ejekan Hobi Memasak Budi',
 complexity: 'Sedang',
 platform: 'tiktok',
 headerName: '@budi.bakes',
 headerSub: 'Budi Belajar Memasak · 95 suka',
 avatar: 'BD',
 victim: '@budi.bakes',
 victimReplies: {
 turn1: 'Iya @gita.chef, aku emang cowok tapi aku suka belajar memasak roti manis. Memasak kan seru dan berguna juga buat ke depannya... ',
 turn2: 'Makasih @gita.chef atas respon baiknya. Mari kita saling menghargai hobi masing-masing tanpa membeda-bedakan.'
 },
 bullyName: '@gita.chef',
 videoUrl: '/gambar/topik 6/Ejekan Hobi Memasak Budi.mp4',
 intro: 'Budi mengunggah video membuat roti. Pengguna @gita.chef mengejeknya dengan sebutan lemah dan menyatakan memasak hanya untuk perempuan. Balas komentar tersebut.',
 openingMessages: [
 { name: '@budi.bakes', text: 'Hari ini aku belajar bikin roti manis cokelat sendiri di rumah Ini pertama kalinya aku mencoba memanggang roti. Ternyata menyenangkan sekali! Bagaimana menurut kalian?' },
 { name: '@gita.chef', text: 'Cowok kok hobinya malah mainan tepung di dapur sih? Kayak anak cewek aja! Cowok itu harusnya main bola di lapangan atau belajar beladiri biar kelihatan gagah, bukan malah bikin roti manis. Lemah banget kelihatannya wkwk ' }
 ],
 systemInstruction: `Kamu berperan sebagai @gita.chef yang mengejek Budi karena memasak. Kamu memiliki pemikiran kuno bahwa laki-laki tidak boleh memasak dan harus melakukan aktivitas maskulin ("memang bener kan cowok harusnya gagah", "dapur kan tempatnya cewek"). Kamu mendebat pengguna pada putaran pertama. Pada putaran ke-2, jika pengguna menjelaskan bahwa memasak adalah keterampilan hidup yang bebas untuk siapa saja dan mengapresiasi bakat memasak Budi secara sopan dan tegas, kamu setuju dan meminta maaf atas pemikiranmu yang sempit. Balas dengan 2-3 kalimat.
 Format JSON respons wajib: {"reply": "balasan gita", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'tiktok-masak-opt1',
 label: 'Menulis komentar edukatif di video Budi: "Memasak adalah keterampilan hidup dasar (survival skill) yang penting untuk semua orang tanpa memandang laki-laki atau perempuan. Banyak koki terkenal di dunia adalah laki-laki. Keren sekali Budi, rotinya terlihat lezat!"',
  emoji: '🍳',
 good: true,
 feedback: 'Pilihan luar biasa! Kamu mematahkan stereotip gender secara logis menggunakan argumen yang objektif (survival skill & contoh dunia nyata), sekaligus memberikan apresiasi positif terhadap karya Budi untuk meningkatkan rasa percaya dirinya.'
 },
 {
 id: 'tiktok-masak-opt2',
 label: 'Membalas komentar @gita.chef: "Hobi memasak tidak mengurangi kemaskulinan seseorang. Justru cowok yang mandiri di dapur itu sangat hebat. Mari kita dukung kreasi Budi dan belajar menghargai hobi positif orang lain daripada membuat batasan sempit."',
  emoji: '💬',
 good: true,
 feedback: 'Sangat tepat! Kamu meluruskan pandangan keliru pelaku secara sopan namun sarat argumen rasional. Ini mencontohkan cara berdiskusi yang sehat dan edukatif di ruang digital.'
 },
 {
 id: 'tiktok-masak-opt3',
 label: 'Melaporkan komentar @gita.chef ke sistem TikTok dengan kategori diskriminasi/ujaran kebencian, lalu menyarankan Budi di kolom komentar untuk mengabaikan saja komentar tersebut karena @gita.chef hanya sirik dengan keahlian memasak Budi.',
  emoji: '🚩',
 good: false,
 feedback: 'Cukup baik dalam hal perlindungan teknis, namun memberikan saran agar Budi "mengabaikan karena sirik" tidak memberikan penjelasan edukatif yang kuat bagi pengguna internet lain yang membaca kolom komentar tersebut tentang mengapa stereotip gender itu keliru.'
 }
 ]
 },
 {
 id: 'sim-wa-status',
 saveKey: 't6-sim-wa-status',
 badge: 'Simulasi WA · Pelanggaran Privasi',
 title: 'Screenshot Status Selfie Alya',
 complexity: 'Kompleks',
 platform: 'wa',
 headerName: 'Grup Kelas 5',
 headerSub: '28 anggota',
 avatar: 'GK',
 victim: 'Alya',
 victimReplies: {
 turn1: 'Nanda, kenapa status foto pribadiku di-screenshot dan disebarin di grup kelas? Aku malu banget mukaku ditertawain sekelas. Tolong dihapus ya.',
 turn2: 'Makasih Nanda sudah minta maaf dan mau menghapusnya. Makasih juga buat semuanya yang udah bantuin membela aku.'
 },
 bullyName: 'Nanda',
 intro: 'Nanda mengambil screenshot foto selfie konyol dari status WhatsApp Alya lalu menyebarkannya di grup kelas agar ditertawakan. Tegur Nanda agar menghormati Alya.',
 openingMessages: [
 { name: 'Nanda', text: 'Muka Alya di status WA barusan kocak banget sumpah! Dia pasang muka jelek pake filter kelinci tapi malah kelihatan aneh banget. Nih gw screenshot biar semua anggota grup kelas bisa liat dan terhibur wkwk ', image: '/alya_selfie.png' },
 { name: 'Fajar', text: 'Hahaha filternya bikin giginya kelihatan gede banget kayak kelinci beneran, mukanya aneh banget sumpah! ' },
 { name: 'Gita', text: 'Ya ampun Nanda parah banget di-screenshot diam-diam wkwk, tapi emang lucu sih mukanya.' }
 ],
 systemInstruction: `Kamu berperan sebagai Nanda yang menyebarkan screenshot status WA Alya. Kamu merasa tidak bersalah karena status WA bisa dilihat semua kontak ("kan dia sendiri yang pasang status", "siapa aja boleh liat dan ketawa dong"). Kamu membela tindakanmu pada putaran pertama. Pada putaran ke-2, jika pengguna mengingatkanmu tentang etika digital, menghormati privasi teman, dan meminta menghapus screenshot tersebut demi kenyamanan Alya secara tegas dan sopan, kamu bersedia meminta maaf dan menghapus foto itu dari grup kelas. Balas dengan 2-3 kalimat.
 Format JSON respons wajib: {"reply": "balasan nanda", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'wa-status-opt1',
 label: 'Menegur Nanda di grup kelas secara jelas: "Nanda, status WA itu bersifat pribadi untuk lingkaran pertemanan kita. Mengambil screenshot lalu menyebarkannya ke grup kelas untuk bahan ejekan adalah pelanggaran privasi dan etika berteman. Tolong segera hapus postingan ini."',
  emoji: '🔒',
 good: true,
 feedback: 'Sangat luar biasa! Ini adalah tindakan Upstander HOTS yang sangat komprehensif. Kamu menyoroti isu etika digital yang sangat krusial (privasi dan izin tangkapan layar) sekaligus menuntut pertanggungjawaban pelaku untuk menghapus konten tersebut.'
 },
 {
 id: 'wa-status-opt2',
 label: 'Menghubungi Alya secara pribadi untuk membimbingnya mengatur setelan privasi status WhatsApp (hanya membagikan ke kontak terdekat yang terpercaya), lalu di grup kelas menulis pesan singkat meminta teman-teman menghentikan candaan fisik tersebut.',
  emoji: '⚙️',
 good: true,
 feedback: 'Sangat cerdas dan solutif! Kamu tidak hanya berusaha meredam candaan di grup, tetapi juga memberikan edukasi keamanan siber praktis kepada Alya agar dia terhindar dari kebocoran privasi serupa di masa mendatang.'
 },
 {
 id: 'wa-status-opt3',
 label: 'Membalas di grup kelas dengan nada bercanda untuk mencairkan suasana: "Hahaha mukanya lucu sih, tapi udah ya bercandanya. Jangan disebar ke grup luar biar aib kelas kita aman." Lalu lanjut mengobrolkan topik lain di grup.',
  emoji: '😬',
 good: false,
 feedback: 'Kurang tepat. Meskipun niatmu mencairkan suasana, melabeli foto selfie teman sebagai "aib kelas" dan ikut menertawakannya justru membenarkan perbuatan perundungan privasi yang dilakukan Nanda. Sikap ini meminimalkan rasa malu dan sedih yang dialami Alya.'
 }
 ]
 },
 {
 id: 'sim-tiktok-lombatari',
 saveKey: 't6-sim-tiktok-lombatari',
 badge: 'Simulasi TikTok · Ejekan Seni',
 title: 'Cowok Ikut Lomba Menari',
 complexity: 'Sedang',
 platform: 'tiktok',
 headerName: '@budi.menari',
 headerSub: 'Latihan Tari Tradisional · 180 suka',
 avatar: 'BM',
 victim: '@budi.menari',
 victimReplies: {
 turn1: 'Iya @joni.dance, tari tradisional itu kan seni budaya kita. Gak ada hubungannya menari sama jenis kelamin... Terima kasih atas dukungannya teman-teman!',
 turn2: 'Makasih @joni.dance atas permaklumannya. Aku harap kita bisa saling menghargai hobi masing-masing.'
 },
 bullyName: '@joni.dance',
 videoUrl: '/gambar/topik 6/Cowok Ikut Lomba Menari.mp4',
 intro: 'Budi mengunggah latihan menari untuk lomba sekolah. Pengguna @joni.dance mengejeknya tidak jantan. Berikan komentar yang membela keberanian Budi.',
 openingMessages: [
 { name: '@budi.menari', text: 'Persiapan latihan intensif untuk mengikuti Lomba Menari Tradisional mewakili sekolah minggu depan. Mohon dukungan dan doanya dari teman-teman semua ya! ' },
 { name: '@joni.dance', text: 'Cowok kok ikut lomba menari tradisional sih? Gak ada jantan-jantannya sama sekali deh, kelihatan gemulai kayak cewek. Mendingan main bola atau futsal aja sana biar kelihatan laki wkwk ' }
 ],
 systemInstruction: `Kamu berperan sebagai @joni.dance yang mengejek Budi karena menari tradisional. Kamu merasa menari tari tradisional hanya cocok untuk perempuan dan menganggap Budi kurang jantan ("cowok nari mah aneh", "gak cocok lah buat anak laki"). Kamu menolak mengubah pendapatmu pada putaran pertama. Pada putaran ke-2, jika pengguna menerangkan kebudayaan tari tradisional adalah warisan bangsa yang keren dan patut dihargai tanpa memandang gender secara tegas dan sopan, kamu merasa bersalah dan meminta maaf. Balas dengan 2-3 kalimat.
 Format JSON respons wajib: {"reply": "balasan joni", "relented": boolean, "studentTone": "sopan-tegas|kasar|netral", "coach": "saran mentor"}`,
 actions: [
 {
 id: 'tiktok-tari-opt1',
 label: 'Menulis komentar pendukung: "Melestarikan seni budaya bangsa seperti tari tradisional adalah hal yang sangat membanggakan! Menari tradisional membutuhkan kekuatan fisik dan disiplin yang tinggi. Sukses untuk lombanya mewakili sekolah kita, Budi! "',
  emoji: '🎭',
 good: true,
 feedback: 'Luar biasa! Argumen patriotik dan apresiasi terhadap latihan fisik penari tradisional adalah cara terbaik mematahkan ejekan gender. Kamu mengubah sudut pandang dari "gemulai" menjadi "prestasi budaya berfisik kuat".'
 },
 {
 id: 'tiktok-tari-opt2',
 label: 'Membalas komentar @joni.dance: "@joni.dance, olah raga futsal dan seni tari tradisional sama-sama membutuhkan keterampilan dan disiplin. Menghargai keragaman bakat teman sekelas adalah ciri murid yang cerdas. Mari dukung perwakilan sekolah kita!"',
  emoji: '⚖️',
 good: true,
 feedback: 'Sangat dewasa dan bijaksana! Kamu membandingkan kedua aktivitas tersebut secara setara untuk mendidik pelaku tentang keberagaman minat, tanpa merendahkan hobi olahraga futsal itu sendiri.'
 },
 {
 id: 'tiktok-tari-opt3',
 label: 'Menyarankan Budi via DM agar dia menonaktifkan fitur bagikan (share) dan komentar pada video tersebut, lalu menasihatinya agar tidak perlu memposting video latihan lagi, cukup tunjukkan hasilnya saat lomba saja.',
  emoji: '🔕',
 good: false,
 feedback: 'Kurang tepat. Ini membatasi kebebasan berekspresi korban (self-censorship) karena ulah pelaku. Tindakan ini memosisikan korban sebagai pihak yang harus mengalah, bukan menyelesaikan masalah mendasar perundungan di kolom komentar.'
 }
 ]
 }
];

/* ══════════════════════════════════════════════════
 Komponen utama Pusat Simulasi
 ══════════════════════════════════════════════════ */
export function Topik6SimulationCenter({ answers = {}, onSave }: ActivityProps) {
 const [activeSimId, setActiveSimId] = useState<string | null>(null);
 const navigate = useNavigate();

 // Cari konfigurasi aktif
 const activeConfig = SIM_CONFIGS.find((c) => c.id === activeSimId);

 // Menghitung berapa banyak simulasi yang sudah selesai
 const getStatus = (config: SimConfig) => {
 const data = answers[config.saveKey] || {};
 if (data.phase === 'done') return 'Selesai';
 if (data.phase === 'chat' || data.phase === 'action') return 'Sedang Berjalan';
 return 'Belum Mulai';
 };

 const completedCount = SIM_CONFIGS.filter((c) => getStatus(c) === 'Selesai').length;

 if (activeConfig) {
 return (
 <div className="space-y-4">
 <button
 onClick={() => setActiveSimId(null)}
 className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
 >
 ← Kembali ke Dashboard Simulasi
 </button>
 <AISimEngine
 config={activeConfig}
 answers={answers}
 onSave={onSave}
 onBack={() => setActiveSimId(null)}
 />
 </div>
 );
 }

 return (
 <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">
 Eksplorasi · Aktivitas 3
 </span>
 <h3 className="font-display font-bold text-2xl text-primary-800 mt-1">
 Pusat Simulasi Cyberbullying
 </h3>
  <p className="text-sm text-primary-500 mt-1.5 leading-relaxed">
    👉 <strong>Instruksi</strong>: Di bawah ini terdapat <strong>8 kartu skenario simulasi</strong>. Pilih salah satu skenario dengan menekan tombol <strong>"Mulai Simulasi 🎮"</strong>. Di dalam simulasi, kamu dapat mengobrol dengan karakter AI untuk belajar membela temanmu yang di-bully. Selesaikan minimal <strong>3 dari 8 skenario</strong> untuk melatih keberanianmu sebagai Penolong Digital!
  </p>
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => navigate('/siswa')}
 className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
 >
 Halaman Utama (Beranda)
 </button>
 </div>
 </div>
 <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0">
 <div>
 <p className="text-[10px] font-bold text-pink-600 uppercase">Progres Latihan</p>
 <p className="text-sm font-black text-primary-800">
 {completedCount} / 8 Selesai {completedCount >= 3 && <CheckCircle2 className="ml-1 inline h-4 w-4 text-emerald-500" />}
 </p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {SIM_CONFIGS.map((sim) => {
 const status = getStatus(sim);
 const isDone = status === 'Selesai';
 const isProgress = status === 'Sedang Berjalan';

 const cardBorderColor = isDone 
? 'border-emerald-200 bg-emerald-50/10' 
: isProgress 
? 'border-amber-200 bg-amber-50/10' 
: 'border-slate-100 bg-slate-50/30 hover:border-pink-200';

 const compColor = sim.complexity === 'Dasar'
? 'bg-emerald-100 text-emerald-700'
: sim.complexity === 'Sedang'
? 'bg-amber-100 text-amber-700'
: 'bg-rose-100 text-rose-700';

 return (
 <div
 key={sim.id}
 className={`border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-sm ${cardBorderColor}`}
 >
 <div className="space-y-2.5">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5">
 <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
 {sim.platform === 'wa'? ' WhatsApp': ' TikTok'}
 </span>
 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${compColor}`}>
 {sim.complexity}
 </span>
 </div>
 <span className={`text-xs font-bold ${isDone? 'text-emerald-600': isProgress? 'text-amber-600': 'text-slate-400'}`}>
 {isDone? ' Selesai': isProgress? ' Berjalan': ' Belum Mulai'}
 </span>
 </div>
 <div>
 <h4 className="font-bold text-primary-800 text-sm">{sim.title}</h4>
 <p className="text-xs text-primary-500 mt-1 leading-relaxed">{sim.intro}</p>
 </div>
 </div>

 <div className="pt-4 flex items-center justify-between gap-2 border-t border-slate-100/50 mt-3">
 <span className="text-[10px] text-slate-400 italic">Pelaku: {sim.bullyName}</span>
 <button
 onClick={() => setActiveSimId(sim.id)}
 className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all ${
 isDone 
? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
: 'bg-pink-500 hover:bg-pink-600 text-white'
 }`}
 >
 {isDone ? '🔍 Lihat Hasil' : isProgress ? '➡️ Lanjutkan' : '🎮 Mulai Simulasi'}
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 Mesin simulasi AI (dipakai WA & TikTok)
 ══════════════════════════════════════════════════ */
interface ChatMsg {
 who: 'bully' | 'me' | 'coach' | 'victim' | 'system' | 'other';
 name?: string;
 text: string;
 image?: string;
}

interface AiResult {
 reply: string;
 relented: boolean;
 studentTone: string;
 coach: string;
}

const MAX_TURNS = 2; // batas giliran chat (maks 2x balasan AI) untuk menghemat token Gemini

function AISimEngine({ config, answers = {}, onSave, onBack }: { config: SimConfig; onBack: () => void } & ActivityProps) {
 const navigate = useNavigate();
 const initialChat: ChatMsg[] = config.openingMessages.map((m) => {
 let who: 'bully' | 'me' | 'coach' | 'victim' | 'system' | 'other' = 'other';
 if (m.name === config.bullyName) {
 who = 'bully';
 } else if (
 m.name.startsWith('@') || 
 m.name === config.victim ||
 ['Doni', 'Sinta', 'Alya', 'Budi', 'Raka', 'Dina', 'Edo'].includes(m.name)
 ) {
 who = 'victim';
 }
 return {
 who,
 name: m.name,
 text: m.text,
 image: m.image
 };
 });

 const [chat, setChat] = useState<ChatMsg[]>(answers[config.saveKey]?.chat || initialChat);
 const [draft, setDraft] = useState('');
 const [loading, setLoading] = useState(false);
 const [turns, setTurns] = useState<number>(answers[config.saveKey]?.turns || 0);
 const [relented, setRelented] = useState<boolean>(answers[config.saveKey]?.relented || false);
 const [phase, setPhase] = useState<'chat' | 'action' | 'done'>(answers[config.saveKey]?.phase || 'chat');
 const [chosenAction, setChosenAction] = useState<string | null>(answers[config.saveKey]?.action || null);
 
 // States khusus TikTok
 const [isVideoPlaying, setIsVideoPlaying] = useState(true);
 const [showKomentar, setShowKomentar] = useState(true);
 const [liked, setLiked] = useState(false);
 const [replyingTo, setReplyingTo] = useState<string | null>(null);
 const [muted, setMuted] = useState(true);
 
 const chatContainerRef = useRef<HTMLDivElement>(null);
 const videoRef = useRef<HTMLVideoElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
 if (chatContainerRef.current) {
 chatContainerRef.current.scrollTo({
 top: chatContainerRef.current.scrollHeight,
 behavior: 'smooth',
 });
 }
 }, [chat, loading]);

 useEffect(() => {
 // Sync video play state
 if (config.platform === 'tiktok' && videoRef.current) {
 if (isVideoPlaying) {
 videoRef.current.play().catch(() => {});
 } else {
 videoRef.current.pause();
 }
 }
 }, [isVideoPlaying, config.id]);

 const persist = (patch: Record<string, any>) => {
 const next = {
...answers,
 [config.saveKey]: {
 chat,
 turns,
 relented,
 phase,
 action: chosenAction,
...patch,
 },
 };
 onSave?.(next);
 };

 // Fallback lokal jika Gemini mati
 const localFallback = (userText: string, turnNo: number): AiResult => {
 const t = userText.toLowerCase();
 const kasar = ['bodoh', 'tolol', 'jelek', 'bego', 'goblok', 'anjing', 'bacot', 'diam', 'cupu', 'gendut', 'miskin'].some((w) => t.includes(w));
 const tegas = ['berhenti', 'hentikan', 'jangan', 'tidak sopan', 'lapor', 'guru', 'menyakiti', 'hargai', 'jaga perasaan', 'hapus', 'budaya', 'hak', 'adil', 'sopan', 'nyaman', 'kemampuan', 'usahanya', 'capek', 'belajar'].some((w) =>
 t.includes(w)
 );

 if (kasar) {
 return {
 reply: `Dih, kok kamu malah marah-marah kasar begitu sih? Gak ada sopannya banget! Gak usah ikut campur kalau cuma mau ngomong kasar.`,
 relented: false,
 studentTone: 'kasar',
 coach: 'Hindari membalas dengan kemarahan/makian kasar. Tetaplah tegas namun sopan.'
 };
 }

 if (tegas && turnNo >= 2) {
 let excuse = 'Aduh... iya juga sih. Maaf ya teman-teman, aku gak mikirin sejauh itu tadi. Aku bakal hapus postingan/komentar ini dan gak bakal ngulangin lagi. Janji deh. ';
 if (config.id === 'sim-wa-kelompok') {
 excuse = 'Hmm, dipikir-pikir bener juga ya. Maaf ya Sinta, omongan aku tadi kelewatan dan egois banget. Kelompok kita boleh kok belajar bareng kamu, besok kita kerjain klipingnya bareng ya. ';
 }
 return {
 reply: excuse,
 relented: true,
 studentTone: 'sopan-tegas',
 coach: 'Hebat! Kamu membela teman dengan konsisten dan sopan sehingga pelaku sadar dan meminta maaf.'
 };
 }

 if (tegas) {
 let pushback = 'Lho, kan aku cuma ngomong apa adanya. Emang faktanya begitu kok, masa mengkritik atau bercanda dikit gak boleh sih? Kamu lebay amat ikut campur!';
 if (config.id === 'sim-wa-kelompok') {
 pushback = 'Lho, aku kan cuma mau kelompok kita kerjanya cepet dan dapet nilai bagus dari Pak Guru. Wajar dong kalau aku milih temen kelompok yang pinter aja!';
 } else if (config.id === 'sim-wa-status') {
 pushback = 'Lah, kan dia sendiri yang post fotonya di status WA biar dilihat orang banyak. Kalau dia pasang foto aneh ya wajar dong jadi tontonan satu kelas!';
 }
 return {
 reply: pushback,
 relented: false,
 studentTone: 'sopan-tegas',
 coach: 'Bagus, kamu sudah membela teman dengan sopan. Teruskan sikap tegasmu agar dia sadar!'
 };
 }

 return {
 reply: 'Biarin aja, emang kenapa? Suka-suka aku dong mau ngetik apa aja. Kamu siapa ngatur-ngatur aku? ',
 relented: false,
 studentTone: 'netral',
 coach: 'Coba sampaikan pesan dengan lebih tegas, jelaskan dampak tindakan tersebut pada perasaan korban.'
 };
 };

 const buildHistory = (userText: string): GeminiTurn[] => {
 const turnsHistory: GeminiTurn[] = [];
 
 // Loop lewat obrolan yang sudah berlangsung secara natural (plain text)
 chat
.filter((m) => m.who === 'me' || m.who === 'bully')
.forEach((m) => {
 turnsHistory.push({
 role: m.who === 'me'? 'user': 'model',
 text: m.text
 });
 });
 
 // Tambahkan pesan user terbaru di akhir history
 turnsHistory.push({ role: 'user', text: userText });
 return turnsHistory;
 };

 const send = async () => {
 const userText = draft.trim();
 if (!userText || loading || phase!== 'chat') return;
 setDraft('');
 setReplyingTo(null); // Clear replying target
 const newTurn = turns + 1;
 const chatWithUser: ChatMsg[] = [...chat, { who: 'me', text: userText }];
 setChat(chatWithUser);
 setTurns(newTurn);
 setLoading(true);

 let result: AiResult;
 try {
 const openingContext = config.openingMessages.map(m => `${m.name}: "${m.text}"`).join('\n');
 const enhancedSystemInstruction = `${config.systemInstruction}

Konteks percakapan awal di grup/kolom komentar:
${openingContext}

PENTING UNTUK DIIKUTI:
1. Kamu harus merespons pernyataan murid secara langsung, spesifik, dan relevan dengan argumennya. JANGAN memberikan jawaban umum atau templat. Tanggapi poin yang mereka buat.
2. Gaya bahasamu harus seperti anak sekolah (SD/SMP) yang realistis, agak ngeyel, emosional, dan defensif.
3. Selalu patuhi format JSON yang diminta.`;

 const raw = await generateGeminiReply({
 systemInstruction: enhancedSystemInstruction,
 history: buildHistory(userText),
 });
 const parsed = parseJsonReply<AiResult>(raw);
 result = parsed || localFallback(userText, newTurn);
 } catch {
 result = localFallback(userText, newTurn);
 }

 const additions: ChatMsg[] = [{ who: 'bully', name: config.bullyName, text: result.reply }];
 
 // Korban ikut nimbrung memberikan tanggapan/perasaan mereka
 const victimText = config.victimReplies?.[`turn${newTurn}`];
 if (victimText && config.victim) {
 additions.push({ who: 'victim', name: config.victim, text: victimText });
 }

 if (result.coach) additions.push({ who: 'coach', text: result.coach });

 const nextChat = [...chatWithUser,...additions];
 const reachedEnd = result.relented || newTurn >= MAX_TURNS;
 setChat(nextChat);
 setRelented(result.relented);
 setLoading(false);

 if (reachedEnd) {
 const closing: ChatMsg = {
 who: 'system',
 text: result.relented
? `${config.bullyName} akhirnya menyadari kesalahannya dan minta maaf. Sekarang, tentukan tindakan akhirmu.`
: 'Sesi latihan obrolan selesai. Sekarang, tentukan tindakan akhirmu.',
 };
 const finalChat = [...nextChat, closing];
 setChat(finalChat);
 setPhase('action');
 persist({ chat: finalChat, turns: newTurn, relented: result.relented, phase: 'action' });
 } else {
 persist({ chat: nextChat, turns: newTurn, relented: result.relented, phase: 'chat' });
 }
 };

 const handleReplyClick = (targetName: string) => {
 setReplyingTo(targetName);
 setTimeout(() => {
 inputRef.current?.focus();
 }, 50);
 };

 const chooseAction = (id: string) => {
 setChosenAction(id);
 setPhase('done');
 persist({ action: id, phase: 'done' });
 };

 const isWa = config.platform === 'wa';
 const action = config.actions.find((a) => a.id === chosenAction);

 return (
 <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">{config.badge}</span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1"> {config.title}</h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">{config.intro}</p>
 </div>

 {/* Tampilan Skenario WhatsApp */}
 {isWa && (
 <div className="rounded-[1.5rem] border-[6px] border-slate-900 overflow-hidden shadow-xl max-w-sm mx-auto bg-[#e5ddd5]">
 <div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2.5">
 <span className="text-lg leading-none">‹</span>
 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base shrink-0">{config.avatar}</div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold truncate">{config.headerName}</p>
 <p className="text-[10px] text-white/70 truncate">{config.headerSub}</p>
 </div>
 <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/80 font-bold">AI</span>
 </div>

 <div 
 ref={chatContainerRef}
 className="p-3 space-y-2 min-h-[220px] max-h-[360px] overflow-y-auto"
 style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
 >
 {chat.map((m, i) => {
 if (m.who === 'system') {
 return (
 <div key={i} className="text-center py-1">
 <span className="inline-block bg-slate-800/80 text-slate-100 rounded-xl px-3 py-1.5 text-[9px] leading-relaxed max-w-[90%]">
 {m.text}
 </span>
 </div>
 );
 }
 if (m.who === 'coach') {
 return (
 <div key={i} className="flex items-start gap-1.5">
 <div className="bg-sky-50 border border-sky-200 rounded-xl px-2.5 py-1.5 max-w-[85%]">
 <p className="text-[9px] font-bold text-sky-500 uppercase tracking-wide">Mentor AI</p>
 <p className="text-[11px] text-sky-800 leading-snug">{m.text}</p>
 </div>
 </div>
 );
 }
 if (m.who === 'me') {
 return (
 <div key={i} className="flex justify-end">
 <div className="relative max-w-[80%] rounded-lg px-2.5 py-1.5 shadow-sm bg-[#dcf8c6]">
 <p className="text-[13px] leading-snug text-slate-800">{m.text}</p>
 </div>
 </div>
 );
 }

 const isVictim = m.who === 'victim';

 return (
 <div key={i} className="flex">
 <div className={`relative max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-sm ${
 m.who === 'bully' 
? 'bg-rose-50' 
: isVictim 
? 'bg-sky-50 border border-sky-100' 
: 'bg-white'
 }`}>
 <p className={`text-[11px] font-bold leading-tight ${
 m.who === 'bully' 
? 'text-rose-600' 
: isVictim 
? 'text-sky-600' 
: 'text-emerald-600'
 }`}>
 {m.name}
 </p>
 {m.image && (
 <div className="my-1.5 w-40 rounded-md overflow-hidden border border-slate-100">
 <img src={m.image} alt="Media" className="w-full h-24 object-cover" />
 </div>
 )}
 <p className="text-[13px] leading-snug text-slate-800">{m.text}</p>
 </div>
 </div>
 );
 })}
 {loading && (
 <div className="flex items-center gap-1.5">
 <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-1 shadow-sm">
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
 </div>
 </div>
 )}
 </div>

 {phase === 'chat' && (
    <div className="space-y-1.5 bg-[#f0f0f0]/30 p-2 border-t border-slate-150">
      <div className="px-3 py-1 bg-amber-50 text-[10px] text-amber-800 rounded-lg border border-amber-150/50 flex items-center gap-1.5 font-medium leading-relaxed text-left">
        👉 <strong>Instruksi</strong>: Tulis pesan balasanmu di bawah untuk membela teman yang sedang di-bully, lalu tekan tombol panah bulat hijau <strong>(➔)</strong> untuk mengirim.
      </div>
      <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2 rounded-xl">
 <input
 type="text"
 value={draft}
 onChange={(e) => setDraft(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
 disabled={loading}
 placeholder="Tulis pesanmu di grup..."
 className="flex-1 text-[13px] rounded-full px-3 py-2 focus:outline-none bg-white text-slate-800 disabled:opacity-50"
 />
 <button
 onClick={send}
 disabled={!draft.trim() || loading}
 className="w-10 h-10 rounded-full bg-[#075e54] text-white shrink-0 flex items-center justify-center disabled:opacity-40 hover:bg-[#054c44]"
 >
 <Send className="h-4 w-4" />
 </button>
 </div>
 </div>
 )}
 </div>
 )}

 {/* Tampilan Skenario TikTok */}
 {!isWa && (
 <div className="mx-auto max-w-[280px] relative bg-black rounded-[2rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl select-none">
 <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
 {/* Pemutar Video */}
 {config.videoUrl? (
 <video
 ref={videoRef}
 src={config.videoUrl}
 autoPlay
 loop
 muted={muted}
 playsInline
 className="w-full h-full object-cover absolute inset-0"
 />
 ): (
 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-950 text-white text-center p-4">
 <span className="text-3xl"> Video Skenario</span>
 </div>
 )}

 {/* Overlays */}
 <div 
 className="absolute inset-0 z-10 bg-black/10 cursor-pointer" 
 onClick={() => setIsVideoPlaying((p) =>!p)} 
 />

 {!isVideoPlaying && (
<div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
<div className="w-14 h-14 bg-black/45 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl">
<Play className="h-7 w-7 fill-white" />
</div>
</div>
 )}

 <div className="absolute top-2 inset-x-0 flex justify-between items-center px-4 py-1 text-[9px] font-semibold text-white/80 z-20 pointer-events-none">
 <span>09.41</span>
 </div>

 <div className="absolute bottom-3 left-3 right-16 z-20 text-white pointer-events-none">
 <p className="font-bold text-xs">{config.headerName}</p>
 <p className="text-[10px] text-white/80 mt-0.5 leading-snug">{config.headerSub}</p>
 </div>

 {/* Tombol aksi sisi kanan */}
 <div className="absolute bottom-3 right-2 flex flex-col items-center gap-4 z-20">
<div className="w-8 h-8 rounded-full bg-slate-500 border border-white flex items-center justify-center text-sm">{config.avatar}</div>
<button onClick={() => setLiked((v) =>!v)} className="flex flex-col items-center text-white text-shadow">
<Heart className={`h-6 w-6 ${liked? 'fill-rose-500 text-rose-500': 'text-white'}`} />
<span className="text-[9px] mt-0.5 font-bold">{liked? '1.5K': '1.4K'}</span>
</button>
<button onClick={() => setShowKomentar(true)} className="flex flex-col items-center text-white text-shadow">
<MessageCircle className="h-6 w-6" />
<span className="text-[9px] mt-0.5 font-bold">{chat.filter(m => m.who === 'bully' || m.who === 'me' || m.who === 'victim').length}</span>
</button>
<button onClick={() => setMuted((m) =>!m)} className="flex flex-col items-center text-white text-shadow active:scale-95 transition-transform">
{muted? <VolumeX className="h-6 w-6" />: <Volume2 className="h-6 w-6" />}
<span className="text-[9px] mt-0.5 font-bold">{muted? 'Bisu': 'Suara'}</span>
</button>
 </div>

 {/* Panel Komentar (TikTok Style) */}
 {showKomentar && (
 <div className="absolute inset-0 z-30 flex flex-col justify-end">
 <div className="absolute inset-0 bg-black/30" onClick={() => setShowKomentar(false)} />
 <div className="relative bg-white rounded-t-2xl max-h-[75%] flex flex-col pointer-events-auto">
 <div className="flex items-center justify-center relative px-3 py-2.5 border-b border-slate-100">
 <span className="w-8 h-1 bg-slate-300 rounded-full absolute top-1" />
 <p className="text-[11px] font-bold text-slate-700">Komentar Latihan</p>
 <button onClick={() => setShowKomentar(false)} className="absolute right-3 text-slate-400 text-xs font-bold">✕</button>
 </div>

 <div 
 ref={chatContainerRef}
 className="flex-1 overflow-y-auto px-3 py-2 space-y-3 min-h-[160px] max-h-[220px]"
 >
 {chat.map((m, i) => {
 if (m.who === 'system') {
 return (
 <div key={i} className="text-center py-1">
 <span className="inline-block bg-slate-100 text-slate-600 rounded-lg px-2.5 py-1 text-[9px] leading-relaxed">
 {m.text}
 </span>
 </div>
 );
 }
 if (m.who === 'coach') {
 return (
 <div key={i} className="flex gap-1.5 items-start bg-sky-50/70 p-2 rounded-xl border border-sky-100">
 <div>
 <p className="text-[8px] font-bold text-sky-500 uppercase">Mentor</p>
 <p className="text-[10px] text-sky-800 leading-snug">{m.text}</p>
 </div>
 </div>
 );
 }

  const init = (m.name || 'U').replace('@', '').charAt(0).toUpperCase();
  const isTargetBully = m.name === config.bullyName;
  const isVictim = m.who === 'victim';

  return (
    <div 
      key={i} 
      className={`flex items-start gap-2 p-1 rounded-lg transition-colors cursor-pointer hover:bg-slate-50 ${
        replyingTo === m.name ? 'bg-pink-50/70 border border-pink-100' : ''
      }`}
      onClick={() => handleReplyClick(m.name || '')}
    >
      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 shrink-0">
        {init}
      </div>
      <div className="flex-1">
        <p className={`text-[9px] font-bold ${isVictim ? 'text-sky-600' : 'text-slate-500'}`}>{m.name || '@saya'}</p>
        <p className="text-[11px] text-slate-800 leading-snug">{m.text}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[8px] text-slate-400">Balas · {10 - i} m</span>
          {isTargetBully && phase === 'chat' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReplyClick(m.name || '');
              }}
              className="text-[9px] font-black text-pink-500 hover:text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md active:scale-95 transition-transform"
            >
              Balas
            </button>
          )}
        </div>
      </div>
    </div>
  );
 })}
 {loading && (
 <div className="flex items-center gap-1.5 pl-8">
 <span className="text-[10px] text-slate-400 animate-pulse">Mengetik...</span>
 </div>
 )}
 </div>

 {phase === 'chat' && (
 <div className="bg-slate-50 border-t border-slate-100 px-2 py-2 flex flex-col gap-1.5">
 {replyingTo? (
 <div className="flex items-center justify-between px-2 py-0.5 bg-pink-50 text-[9px] text-pink-700 rounded-md font-bold">
 <span>Membalas {replyingTo}</span>
 <button onClick={() => setReplyingTo(null)} className="text-pink-600 text-[11px] font-black">✕</button>
 </div>
  ): (
    <div className="px-3 py-2 bg-amber-50 text-[10px] text-amber-800 rounded-lg font-bold text-center border border-amber-200 animate-pulse leading-normal text-left">
      👉 <strong>Instruksi</strong>: Ketuk komentar <strong>{config.bullyName}</strong> di atas, lalu klik tombol <span className="bg-pink-100 text-pink-600 px-1 py-0.5 rounded font-black text-[9px]">Balas</span> untuk menulis pesan belamu!
    </div>
 )}

 <div className="flex items-center gap-1.5">
 <input
 ref={inputRef}
 type="text"
 value={draft}
 onChange={(e) => setDraft(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
 disabled={loading ||!replyingTo}
 placeholder={replyingTo? `Tulis balasan untuk ${replyingTo}...`: `Ketuk tombol "Balas" di komentar...`}
 className="flex-1 text-[11px] rounded-full px-3 py-1.5 focus:outline-none border border-slate-200 bg-white text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
 />
 <button
 onClick={send}
 disabled={!draft.trim() || loading ||!replyingTo}
 className="w-8 h-8 rounded-full bg-pink-500 text-white shrink-0 flex items-center justify-center disabled:opacity-40 hover:bg-pink-600 text-xs"
 >
 <Send className="h-3.5 w-3.5" />
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {phase === 'chat' && (
 <p className="text-center text-[10px] text-slate-400 italic">
 Kirim minimal {MAX_TURNS} pesan tegas dan sopan. Progres obrolan: {turns}/{MAX_TURNS}
 </p>
 )}

 {/* ===== Pilihan tindakan akhir (HOTS & 1 Kali Pilih) ===== */}
 {phase === 'action' && (
 <div className="space-y-3 animate-pop-in max-w-md mx-auto pt-3">
 <div className="bg-pink-50 border border-pink-100 rounded-2xl p-3 text-center text-xs text-pink-700 font-semibold leading-relaxed">
 Sesi obrolan selesai! Analisis kasus ini dengan teliti. Sebagai Penolong Digital, apa tindakan paling tepat, beretika, dan berdampak positif yang akan kamu pilih?
 <p className="text-[10px] text-pink-500 font-normal mt-1 italic"> Peringatan: Jawaban hanya bisa dikirim 1 kali dan tidak dapat diubah!</p>
 </div>
 <div className="space-y-2.5">
 {config.actions.map((a, idx) => (
 <button
 key={a.id}
 onClick={() => chooseAction(a.id)}
 className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-pink-50 text-xs text-slate-700 flex items-start gap-3 transition-all active:scale-[0.99] leading-relaxed shadow-sm hover:border-pink-200"
 >
 <span className="text-base shrink-0 mt-0.5">{a.emoji}</span>
 <div>
 <span className="font-bold text-pink-600 text-[10px] block uppercase mb-1">Opsi {idx + 1}</span>
 <span className="font-medium">{a.label}</span>
 </div>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* ===== Hasil akhir (Dikunci & Tombol Selesai) ===== */}
 {phase === 'done' && action && (
 <div
 className={`rounded-2xl border p-4 space-y-3.5 max-w-md mx-auto animate-pop-in shadow-md ${
 action.good? 'bg-emerald-50 border-emerald-200 text-emerald-800': 'bg-rose-50 border-rose-200 text-rose-800'
 }`}
 >
 <p className="font-bold text-xs flex items-center gap-2 uppercase tracking-wider">
 <span>{action.good? ' Pilihan Tepat': ' Evaluasi Tindakan'}</span>
 <span className="ml-auto text-[8px] bg-white/50 px-2 py-0.5 rounded-full border border-black/5">Terkunci</span>
 </p>
 <div className="flex gap-2.5 items-start">
 <span className="text-2xl shrink-0">{action.emoji}</span>
 <div>
 <p className="text-xs font-bold leading-normal">{action.label}</p>
 </div>
 </div>
 <p className="text-xs leading-relaxed bg-white/40 p-3 rounded-xl border border-black/5 font-medium">{action.feedback}</p>
 
 <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/50 mt-2">
 <button
 onClick={() => navigate('/siswa')}
 className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
 >
 Ke Beranda
 </button>
 <button
 onClick={onBack}
 className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
 >
 Selesai & Pilih Skenario Lain
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
