import { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, CheckCircle2, Heart, Lock, MessageCircle, Share2, Volume2, VolumeX, 
  Phone, MoreVertical, Search, Play, EyeOff, AlertCircle, ShieldCheck 
} from 'lucide-react';

interface AutoPlayVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
 src: string;
}

function AutoPlayVideo({ src, className,...props }: AutoPlayVideoProps) {
 const videoRef = useRef<HTMLVideoElement>(null);

 useEffect(() => {
 const video = videoRef.current;
 if (!video) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 video.play().catch((err) => {
 console.log("Autoplay blocked:", err);
 });
 } else {
 video.pause();
 }
 },
 { threshold: 0.2 } // Play if at least 20% visible
 );

 observer.observe(video);

 return () => {
 observer.unobserve(video);
 };
 }, [src]);

 return (
 <video
 ref={videoRef}
 src={src}
 className={className}
 {...props}
 />
 );
}

interface ActivityProps {
 answers?: Record<string, any>;
 onSave?: (val: Record<string, any>) => void;
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 1 — Detektif Tautan: Aman atau Bahaya?
 ══════════════════════════════════════════════════ */
const TAUTAN = [
 {
 id: 'link-1',
 label: 'Tautan tugas dari wali kelas',
 url: 'https://classroom.google.com/kelas-6a/tugas',
 note: 'Dikirim wali kelas di grup resmi untuk membuka materi.',
 aman: true,
 alasan: 'Alamatnya resmi (google.com) dan dikirim oleh guru untuk kegiatan belajar.',
 },
 {
 id: 'link-2',
 label: 'Hadiah HP gratis',
 url: 'http://hadiah-gratis-cepat.xyz/klaim',
 note: '"Klik sekarang sebelum hangus! Isi data dirimu."',
 aman: false,
 alasan: 'Alamat aneh (.xyz), memaksa cepat, dan meminta data pribadi. Ini ciri penipuan.',
 },
 {
 id: 'link-3',
 label: 'Aplikasi cheat game',
 url: 'http://mod-game-menang-terus.apk-download.net',
 note: '"Download biar game-mu menang terus!"',
 aman: false,
 alasan: 'Mengunduh aplikasi dari situs tidak resmi bisa menyusupkan virus/malware.',
 },
 {
 id: 'link-4',
 label: 'Video pembelajaran di YouTube',
 url: 'https://youtube.com/watch?v=belajar-ipa',
 note: 'Dibagikan guru untuk menonton penjelasan materi.',
 aman: true,
 alasan: 'Alamat resmi (youtube.com) dan berisi konten belajar dari guru.',
 },
 {
 id: 'link-5',
 label: 'Akun akan ditutup',
 url: 'http://verifikasi-akun-sekarang.login-cepat.com',
 note: '"Masukkan kata sandimu di sini atau akun ditutup!"',
 aman: false,
 alasan: 'Meminta kata sandi lewat tautan asing adalah phishing (pencurian akun).',
 },
];

export function Topik4Aktivitas1({ answers = {}, onSave }: ActivityProps) {
 const [idx, setIdx] = useState<number>(answers._idx || 0);
 const [decided, setDecided] = useState<Record<string, 'aman' | 'bahaya'>>(answers.decided || {});
 const [showResult, setShowResult] = useState(false);

 const link = TAUTAN[idx];
 const chosen = decided[link.id];
 const score = TAUTAN.filter((l) => {
 const d = decided[l.id];
 return (d === 'aman' && l.aman) || (d === 'bahaya' &&!l.aman);
 }).length;
 const allDone = Object.keys(decided).length === TAUTAN.length;

 const decide = (val: 'aman' | 'bahaya') => {
 if (chosen) return;
 const next = {...decided, [link.id]: val };
 setDecided(next);
 setShowResult(true);
 onSave?.({ decided: next, _idx: idx, score });
 };

 const goNext = () => {
 setShowResult(false);
 if (idx < TAUTAN.length - 1) {
 const ni = idx + 1;
 setIdx(ni);
 onSave?.({ decided, _idx: ni, score });
 }
 };

 const isCorrect = chosen && ((chosen === 'aman' && link.aman) || (chosen === 'bahaya' &&!link.aman));

 return (
 <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div className="flex items-start justify-between gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">
 Eksplorasi · Aktivitas 1
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Detektif Tautan: Aman atau Bahaya?
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Periksa setiap tautan di layar browser. Lihat alamat dan pesannya, lalu tentukan keputusanmu:
 <b> Aman</b> atau <b>Bahaya</b>.
 </p>
 </div>
 <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-red-50 text-red-600 rounded-full border border-red-100">
 {score}/{TAUTAN.length}
 </span>
 </div>

 <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
 <span>Tautan {idx + 1} dari {TAUTAN.length}</span>
 <span>{link.label}</span>
 </div>

 {/* Browser mockup */}
 <div className="border border-slate-200 rounded-2xl overflow-hidden">
 <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
 <div className="flex gap-1.5">
 <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
 <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
 </div>
 <div className="flex-1 bg-slate-900 rounded-lg px-3 py-1 text-[10px] font-mono text-slate-300 truncate">
 {link.url.startsWith('https') ? (
 <Lock className="mr-1 inline h-3 w-3 text-emerald-300" />
 ) : (
 <AlertTriangle className="mr-1 inline h-3 w-3 text-amber-300" />
 )} {link.url}
 </div>
 </div>
 <div className="bg-slate-950 p-4 text-slate-100 text-xs leading-relaxed min-h-[64px] flex items-center">
 {link.note}
 </div>
 </div>

 {/* Decision buttons */}
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => decide('aman')}
 disabled={!!chosen}
 className={`py-3 rounded-xl font-bold text-sm border transition-all ${
 chosen === 'aman'
? 'bg-emerald-500 border-emerald-500 text-white'
: 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-40'
 }`}
 >
 Aman
 </button>
 <button
 onClick={() => decide('bahaya')}
 disabled={!!chosen}
 className={`py-3 rounded-xl font-bold text-sm border transition-all ${
 chosen === 'bahaya'
? 'bg-red-500 border-red-500 text-white'
: 'bg-white border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40'
 }`}
 >
 Bahaya
 </button>
 </div>

 {showResult && chosen && (
 <div
 className={`p-4 rounded-2xl border text-xs leading-relaxed ${
 isCorrect? 'bg-emerald-50 border-emerald-200 text-emerald-800': 'bg-red-50 border-red-200 text-red-800'
 }`}
 >
 <p className="font-bold mb-1">{isCorrect? ' Tepat!': ' Kurang Tepat.'}</p>
 {link.alasan}
 </div>
 )}

 <div className="flex justify-end">
 {!allDone? (
 <button
 onClick={goNext}
 disabled={!chosen}
 className="btn-primary py-2.5 px-6 rounded-xl font-bold text-sm disabled:opacity-40"
 >
 Tautan Berikutnya →
 </button>
 ): (
 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
 Selesai! Skormu {score}/{TAUTAN.length}
 </span>
 )}
 </div>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 3 — Latihan Mengambil Keputusan (Studi Kasus)
 ══════════════════════════════════════════════════ */

const KASUS = [
  {
    id: 'kasus-1',
    judul: 'Situasi 1: Iklan Virus Browser',
    emoji: '⚠️',
    cerita: 'Saat kamu sedang mencari gambar tugas di internet, tiba-tiba muncul tampilan jendela peringatan merah di layar browser-mu.',
    mediaUrl: '/situasi_1_virus.png',
    mediaType: 'image' as const,
    pertanyaan: 'Bagaimana cara menyelamatkan perangkatmu?',
    caraKerja: 'Cara Pengerjaan: Amati peringatan di layar browser laptop. Jangan pernah menekan tombol hijau besar "BERSIHKAN SEKARANG" (itu virus palsu!). Ketuk tombol tanda silang "✕" di pojok kanan atas atau teks "Tutup Peringatan" di bawah tombol untuk menyelamatkan laptop.',
    opsi: [
      {
        id: 'a',
        text: 'Klik tombol hijau "BERSIHKAN SEKARANG".',
        benar: false,
        feedbackTitle: '☠️ CHROMBOOK DIKUNCI RANSOMWARE! ☠️',
        feedbackDesc: 'Gawat! Chromebook belajarmu telah dikunci oleh virus ransomware berbahaya. Semua file tugas sekolah, foto, dan akun game-mu telah dienkripsi secara paksa oleh peretas. Mereka meminta uang tebusan sebesar Rp 5.000.000 jika data ingin kembali! Tindakan siber sembarangan tidak bisa diulang.'
      },
      {
        id: 'b',
        text: 'Menutup jendela pop-up atau tab browser tersebut.',
        benar: true,
        feedbackTitle: '🛡️ AMAN! TINGKAT KAPTEN DIGITAL!',
        feedbackDesc: 'Luar biasa! Peringatan virus mendadak di browser adalah iklan jebakan (scareware) yang menakut-nakuti agar kamu memasang virus asli. Menutup jendela pop-up tersebut tanpa menekan tombol apa pun berhasil melindungi laptopmu dari ancaman siber.'
      }
    ]
  },
  {
    id: 'kasus-2',
    judul: 'Situasi 2: Link Chat Berhadiah',
    emoji: '💬',
    cerita: 'Kamu menerima pesan obrolan chat dari nomor tidak dikenal di WhatsApp yang menawarkan diamond game gratis.',
    mediaUrl: '/situasi_2_chat.png',
    mediaType: 'image' as const,
    pertanyaan: 'Bagaimana cara melindungi akun game-mu?',
    caraKerja: 'Cara Pengerjaan: Amati chat di layar gawai. Jangan mengetuk link biru mencurigakan di dalam obrolan tersebut. Ketuk tombol merah "🚫 Blokir & Abaikan Chat" di bagian bawah obrolan.',
    opsi: [
      {
        id: 'a',
        text: 'Mengklik link promosi hadiah.',
        benar: false,
        feedbackTitle: '☠️ AKUN GAME & DATA DISADAP! ☠️',
        feedbackDesc: 'Aduh! Setelah mengeklik link, kamu disuruh memasukkan username & password game. Beberapa menit kemudian, akunmu dikeluarkan dan tidak bisa login lagi. Semua skin dan robux yang kamu kumpulkan hilang diambil alih peretas! Tindakan ini langsung dinilai dan dikunci.'
      },
      {
        id: 'c',
        text: 'Blokir & Abaikan nomor tersebut.',
        benar: true,
        feedbackTitle: '🛡️ AKUN & DATA SELAMAT!',
        feedbackDesc: 'Hebat! Di dunia digital tidak ada hadiah mahal yang dibagikan secara gratis oleh nomor asing. Dengan memblokir pengirim misterius ini, kamu menghentikan upaya penipuan (phishing) sebelum akun game belajarmu dicuri.'
      }
    ]
  },
  {
    id: 'kasus-3',
    judul: 'Situasi 3: Memilih Wi-Fi Publik',
    emoji: '📡',
    cerita: 'Kamu sedang berada di kafe dan ingin menghubungkan Chromebook belajarmu ke jaringan Wi-Fi agar bisa mengerjakan tugas.',
    mediaUrl: '',
    mediaType: 'image' as const,
    pertanyaan: 'Jaringan mana yang paling aman untuk dihubungkan?',
    caraKerja: 'Cara Pengerjaan: Amati daftar Wi-Fi di layar pengaturan. Ketuk nama Wi-Fi yang terkunci aman (Kafe_Cerdas_Secure 🔒) untuk menanyakan password resmi. Jangan ketuk Wi-Fi terbuka tanpa sandi (WI-FI_GRATIS_KLAIM_HADIAH 🔓).',
    opsi: [
      {
        id: 'a',
        text: 'Menghubungkan ke Wi-Fi Gratis Tanpa Sandi.',
        benar: false,
        feedbackTitle: '☠️ DATA DIKUNCI / DISADAP PERETAS! ☠️',
        feedbackDesc: 'Gawat! Kamu terhubung ke Wi-Fi gratis tidak dikenal yang tidak dienkripsi. Peretas yang berada di jaringan yang sama langsung menyadap sandi akun sekolah dan pesan obrolan pribadimu. Keputusan salah ini telah dicatat.'
      },
      {
        id: 'b',
        text: 'Menghubungkan ke Wi-Fi Kafe Terkunci.',
        benar: true,
        feedbackTitle: '🛡️ JALUR KONEKSI INTERNET AMAN!',
        feedbackDesc: 'Sempurna! Menghubungkan ke Wi-Fi resmi yang terkunci (dengan sandi resmi dari barista) atau menggunakan data seluler pribadi memastikan seluruh data belajarmu dikirim melalui jalur terenkripsi yang aman dari mata penyadap siber.'
      }
    ]
  },
  {
    id: 'kasus-4',
    judul: 'Situasi 4: Formulir Klaim Skin',
    emoji: '🔐',
    cerita: 'Kamu mengunjungi halaman situs web yang menjanjikan skin game langka gratis, lalu disuruh mengisi formulir data rahasia.',
    mediaUrl: '/situasi_4_password.png',
    mediaType: 'image' as const,
    pertanyaan: 'Bagaimana menyelamatkan kata sandimu?',
    caraKerja: 'Cara Pengerjaan: Amati formulir di layar web. Jangan mengetuk tombol kuning "MASUK & KLAIM SKIN SEKARANG" (itu situs phishing!). Ketuk tombol abu-abu "Tutup Halaman Web (Kembali)" di bawah formulir untuk membatalkan.',
    opsi: [
      {
        id: 'a',
        text: 'Mengisi password dan klik "KLAIM SKIN".',
        benar: false,
        feedbackTitle: '☠️ KATA SANDI DICURI PERETAS! ☠️',
        feedbackDesc: 'Aduh! Kata sandi rahasiamu langsung terkirim ke server peretas. Akun game-mu dibobol, alamat email-mu diganti, dan gawai belajarmu tidak bisa digunakan untuk masuk ke game itu lagi. Pilihanmu telah dikunci.'
      },
      {
        id: 'b',
        text: 'Tutup halaman web tersebut.',
        benar: true,
        feedbackTitle: '🛡️ GERBANG KATA SANDI AMAN!',
        feedbackDesc: 'Luar biasa! Kata sandi (password) adalah kunci rahasia paling penting. Situs web resmi tidak akan pernah meminta password kamu lewat link chat atau promo gratisan. Kamu berhasil menyelamatkan akunmu!'
      }
    ]
  },
  {
    id: 'kasus-5',
    judul: 'Situasi 5: Tombol Unduh Jebakan',
    emoji: '⬇️',
    cerita: 'Kamu membuka situs web untuk mengunduh lembar kerja PDF, namun layarnya penuh dengan tombol download berkedip.',
    mediaUrl: '/situasi_5_download.png',
    mediaType: 'image' as const,
    pertanyaan: 'Di manakah tombol unduh dokumen yang asli?',
    caraKerja: 'Cara Pengerjaan: Amati halaman web. Jangan ketuk tombol download besar (hijau/merah) yang berkedip. Carilah link teks unduh asli yang berwarna biru kecil di bagian bawah ("Unduh Lembar_Kerja_IPA_Kelas_6.pdf").',
    opsi: [
      {
        id: 'a',
        text: 'Klik tombol iklan "DOWNLOAD NOW" atau "FAST DOWNLOAD".',
        benar: false,
        feedbackTitle: '☠️ INSTALER VIRUS TERUNDUH! ☠️',
        feedbackDesc: 'Gawat! Tombol besar berkedip tersebut adalah iklan jebakan siber. Laptop belajarmu otomatis mengunduh program jahat `.apk` atau `.exe` yang membuat sistem operasi lambat, rusak, dan dipenuhi iklan pop-up jorok.'
      },
      {
        id: 'c',
        text: 'Klik link teks kecil "Unduh Lembar_Kerja_IPA_Kelas_6.pdf".',
        benar: true,
        feedbackTitle: '🛡️ MATA DETEKTIF SANGAT TAJAM!',
        feedbackDesc: 'Sempurna! Kamu memiliki mata detektif yang tajam. Tombol download yang sangat mencolok dan berkedip biasanya adalah iklan jebakan. Lebih baik mencari file di situs sekolah atau sumber resmi yang tepercaya!'
      }
    ]
  }
];

export function Topik4Aktivitas3({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, string>>(answers.data || {});
  const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);
  const [started, setStarted] = useState(Object.keys(answers.data || {}).length > 0);

  // Simulation state
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; title: string; desc: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  const activeCase = KASUS[activeCaseIdx];

  // Set initial selected option for active case when switching slides if already submitted or selected
  useEffect(() => {
    const saved = data[activeCase.id];
    if (saved) {
      const option = activeCase.opsi.find((o) => o.id === saved);
      if (option) {
        setFeedback({
          correct: option.benar,
          title: option.feedbackTitle,
          desc: option.feedbackDesc
        });
      } else {
        setFeedback(null);
      }
    } else {
      setFeedback(null);
    }
    // Reset countdown when switching slides for viewing
    setCountdown(0);
  }, [activeCaseIdx, data]);

  // Countdown timer handler
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleAction = (optId: string) => {
    if (submitted || data[activeCase.id]) return; // Block changes once clicked/submitted
    const option = activeCase.opsi.find((o) => o.id === optId);
    if (!option) return;

    setFeedback({
      correct: option.benar,
      title: option.feedbackTitle,
      desc: option.feedbackDesc
    });

    // Start countdown: 3s for correct, 5s for scary malware alert to lock attention
    setCountdown(option.benar ? 3 : 5);

    // Save answer in data object immediately and permanently
    const nextData = { ...data, [activeCase.id]: optId };
    setData(nextData);
    onSave?.({ data: nextData });
  };

  const handleNextCase = () => {
    if (activeCaseIdx < KASUS.length - 1) {
      setActiveCaseIdx(activeCaseIdx + 1);
    }
  };

  const handlePrevCase = () => {
    if (activeCaseIdx > 0) {
      setActiveCaseIdx(activeCaseIdx - 1);
    }
  };

  const handleConfirmSubmit = () => {
    const isOk = window.confirm(
      "Simpan & Kirim Jawaban?\n\nSetelah dikirim, jawaban dan skormu akan langsung terekam oleh guru dan tidak dapat diubah kembali. Pastikan kamu yakin dengan hasil penyelamatanmu!"
    );
    if (isOk) {
      setSubmitted(true);
      onSave?.({ data, _submitted: true });
    }
  };

  const score = KASUS.filter((k) => {
    const chosen = k.opsi.find((o) => o.id === data[k.id]);
    return chosen?.benar;
  }).length;

  const allAnswered = KASUS.every((k) => data[k.id]);

  const isFinished = activeCaseIdx === KASUS.length - 1;
  const buttonText = countdown > 0 
    ? `Membaca Penjelasan (${countdown}s)...` 
    : (isFinished ? 'Selesai & Kirim Jawaban 💾' : 'Lanjutkan ke Situasi Berikutnya ➡️');

  if (!started) {
    return (
      <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
        {/* Top Header Info */}
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">
            Eksplorasi · Aktivitas 3
          </span>
          <h3 className="font-display font-bold text-xl text-primary-800 mt-1">
            Latihan Mengambil Keputusan
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Bacalah setiap situasi/studi kasus di bawah ini dengan cermat. Amati layar laptop simulasi di bawah, pilihlah <b>tindakan paling aman</b> dengan mengetuk langsung layar gawai di sebelah kiri, dan amankan seluruh data belajarmu!
          </p>
        </div>

        {/* Full Screen Welcome Laptop Display */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-slate-900 rounded-t-3xl p-3 border-4 border-slate-750 shadow-2xl relative">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
            <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-[16/10] border border-slate-950 flex flex-col relative">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700/60 shrink-0 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">http://sibercerdas.kemdikbud.go.id/simulasi-topik4</div>
                <span className="text-[10px] text-slate-500 font-mono">🔋 100%</span>
              </div>
              <div className="flex-1 p-6 bg-slate-950 flex flex-col justify-center items-center text-center space-y-5 relative">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="w-14 h-14 bg-primary-900/40 rounded-2xl flex items-center justify-center border border-primary-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse z-10">
                  <ShieldCheck className="h-8 w-8 text-primary-450" />
                </div>
                <div className="space-y-2.5 z-10 max-w-lg">
                  <h4 className="font-display font-black text-lg text-primary-450 tracking-wider">
                    🚀 MISI KAPTEN DIGITAL: PENYELAMATAN SIBER
                  </h4>
                  <p className="text-[10.5px] text-slate-350 leading-relaxed">
                    Chromebook belajarmu dan akun game-mu sedang diincar oleh peretas jahat! Hadapi 5 situasi siber berbahaya dan ambil keputusan penyelamatan yang tepat.
                  </p>
                  <p className="text-[10px] text-emerald-450 font-bold pt-1 bg-emerald-950/30 border border-emerald-900/35 px-4 py-2 rounded-xl inline-block">
                    Aturan: Amati gambar di layar laptop, lalu ketuk area tindakan yang aman. Pilihanmu langsung dinilai secara permanen!
                  </p>
                </div>
                <button
                  onClick={() => setStarted(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] py-2.5 px-6 rounded-xl shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all z-10 cursor-pointer animate-bounce"
                >
                  👉 MULAI MISI SEKARANG 👈
                </button>
              </div>
            </div>
          </div>
          <div className="bg-slate-700 h-4.5 w-full rounded-b-2xl border-t border-slate-600 shadow-md relative flex justify-center">
            <div className="w-24 h-1.5 bg-slate-800 rounded-b" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
      {/* Top Header Info */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">
          Eksplorasi · Aktivitas 3
        </span>
        <h3 className="font-display font-bold text-xl text-primary-800 mt-1">
          Latihan Mengambil Keputusan
        </h3>
        <p className="text-sm text-primary-500 mt-2 leading-relaxed">
          Bacalah setiap situasi/studi kasus di bawah ini dengan cermat. Amati layar laptop simulasi di bawah, pilihlah <b>tindakan paling aman</b> dengan mengetuk langsung layar gawai di sebelah kiri, dan amankan seluruh data belajarmu!
        </p>
      </div>

      {/* Case Context & Progress horizontal card */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm text-left">
        <div className="space-y-1 flex-1">
          <span className="text-[9.5px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1.5">
            <span>{activeCase.emoji}</span>
            <span>{activeCase.judul}</span>
          </span>
          <p className="text-xs text-slate-650 font-semibold leading-relaxed">
            <b>Studi Kasus:</b> {activeCase.cerita} <span className="text-primary-750 font-bold block mt-1">{activeCase.pertanyaan}</span>
          </p>
        </div>
        <div className="flex sm:flex-col items-end gap-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1">
            Kasus {activeCaseIdx + 1} dari {KASUS.length}
          </span>
          {submitted && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
              Skor: {score}/{KASUS.length} Tepat
            </span>
          )}
        </div>
      </div>

      {/* Laptop Frame Container */}
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Laptop Screen Body */}
        <div className="bg-slate-900 rounded-t-3xl p-3 border-4 border-slate-750 shadow-2xl relative">
          {/* Mock Webcam */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
          
          {/* Inner Display Screen */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-[16/10] border border-slate-950 flex flex-col relative">
            
            {/* Top Bar of Device (Mock Chrome/Operating System) */}
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700/60 shrink-0 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
              </div>
              {/* Address Bar */}
              <div className="flex-1 max-w-[280px] bg-slate-950 rounded-lg py-1 px-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mx-auto truncate border border-slate-800 text-left">
                {activeCase.id === 'kasus-1' && (
                  <>
                    <span className="text-amber-500">⚠️ Tidak Aman</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-350">http://nonton-film-anime99.net/play</span>
                  </>
                )}
                {activeCase.id === 'kasus-2' && (
                  <>
                    <span className="text-emerald-500">🔒 WhatsApp Chat</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-350">Chat dari nomor tidak dikenal</span>
                  </>
                )}
                {activeCase.id === 'kasus-3' && (
                  <>
                    <span className="text-emerald-500">🔒 Wi-Fi Settings</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-350">Pengaturan Wi-Fi Chromebook</span>
                  </>
                )}
                {activeCase.id === 'kasus-4' && (
                  <>
                    <span className="text-red-500">🚨 Phishing Alert</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-350">http://roblox-gratis-skin.xyz/login</span>
                  </>
                )}
                {activeCase.id === 'kasus-5' && (
                  <>
                    <span className="text-amber-500">⚠️ Tidak Aman</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-350">http://tugas-kelas-sd.com/ipa-tugas</span>
                  </>
                )}
              </div>
              {/* Battery / Status icon */}
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">📶 94% 🔋</span>
            </div>

            {/* Full Width Display Body */}
            <div className="flex-1 bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden p-6">
              
              {/* Disable click actions once answered/submitted */}
              <div className={`w-full h-full flex flex-col justify-center items-center ${
                (submitted || data[activeCase.id]) ? 'pointer-events-none opacity-80' : ''
              }`}>
                {activeCase.id === 'kasus-1' && (
                  <div className="w-full max-w-xs border border-red-500/30 rounded-2xl bg-slate-900/90 shadow-2xl p-4 text-center space-y-3 animate-pulse-slow relative">
                    <button 
                      onClick={() => handleAction('b')}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-[10px]"
                    >
                      ✕
                    </button>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-200">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <h4 className="font-extrabold text-red-500 text-[11px] tracking-wide">🚨 AWAS! LAPTOP TERINFEKSI VIRUS! 🚨</h4>
                    <p className="text-[9px] text-slate-300 leading-relaxed">
                      Laptop Anda terdeteksi terkena <b>17 virus berbahaya</b>. Sistem akan rusak jika tidak dibersihkan sekarang!
                    </p>
                    <div className="pt-1">
                      <button 
                        onClick={() => handleAction('a')} 
                        className="w-full bg-emerald-500 text-white font-black text-[9px] py-2 px-3 rounded-lg shadow-lg hover:bg-emerald-600 transition-all"
                      >
                        👉 BERSIHKAN SEKARANG 👈
                      </button>
                    </div>
                    <div className="text-slate-500 text-[8px] hover:underline cursor-pointer" onClick={() => handleAction('b')}>
                      Tutup Peringatan (X)
                    </div>
                  </div>
                )}

                {activeCase.id === 'kasus-2' && (
                  <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col h-[200px] justify-between shadow-2xl">
                    <div className="bg-emerald-800 py-1.5 px-3 flex items-center gap-2 text-white shrink-0">
                      <span className="text-xs">💬</span>
                      <span className="text-[10px] font-extrabold">Pengirim Misterius</span>
                    </div>
                    <div className="flex-1 p-2 space-y-2 bg-slate-950 flex flex-col justify-end">
                      <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl rounded-tl-none p-2 text-[9px] leading-relaxed max-w-[90%] self-start shadow-md space-y-1 text-left">
                        <p>Selamat! Kamu menang event <b>10.000 Diamond Free Roblox</b>!</p>
                        <p>Klik link ini untuk klaim sekarang juga: 👇</p>
                        <div 
                          onClick={() => handleAction('a')} 
                          className="text-cyan-400 underline font-semibold font-mono truncate block mt-0.5 hover:text-cyan-300 cursor-pointer text-[8px] bg-slate-900 rounded p-1"
                        >
                          🔗 http://roblox-diamond-gratis.site/klaim
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5 bg-slate-905 border-t border-slate-800/85 flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleAction('c')} 
                        className="flex-1 bg-red-655/90 text-white text-[9px] py-1.5 rounded-lg font-bold transition-all text-center"
                      >
                        🚫 Blokir & Abaikan Chat
                      </button>
                    </div>
                  </div>
                )}

                {activeCase.id === 'kasus-3' && (
                  <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col p-3 shadow-2xl text-slate-200 space-y-2">
                    <div className="border-b border-slate-800 pb-1.5 text-left shrink-0">
                      <h5 className="font-extrabold text-[10px] text-slate-200">📡 Koneksi Wi-Fi Tersedia</h5>
                      <p className="text-[8px] text-slate-500">Pilih jaringan untuk terhubung:</p>
                    </div>
                    
                    <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                      <div 
                        onClick={() => handleAction('a')}
                        className="bg-slate-950 border border-slate-850 hover:border-red-500/40 p-2 rounded-lg cursor-pointer transition-all hover:bg-slate-900 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 text-left">
                          <span className="text-sm">🔓</span>
                          <div>
                            <p className="text-[9px] font-bold text-red-400 leading-tight">WI-FI_GRATIS_KLAIM_HADIAH</p>
                            <span className="text-[7.5px] text-slate-500 block leading-none">Terbuka (Tanpa Sandi)</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleAction('b')}
                        className="bg-slate-950 border border-slate-850 hover:border-emerald-500/40 p-2 rounded-lg cursor-pointer transition-all hover:bg-slate-900 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 text-left">
                          <span className="text-sm">🔒</span>
                          <div>
                            <p className="text-[9px] font-bold text-emerald-400 leading-tight">Kafe_Cerdas_Secure</p>
                            <span className="text-[7.5px] text-slate-500 block leading-none">Terkunci (Butuh Sandi Kafe)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeCase.id === 'kasus-4' && (
                  <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col p-3 shadow-2xl space-y-2">
                    <div className="bg-red-950/40 border border-red-900/30 rounded-lg p-2 text-center shrink-0">
                      <h5 className="font-extrabold text-[9.5px] text-yellow-500">
                        🎁 KLAIM HADIAH SKIN ROBLOX 🎁
                      </h5>
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div>
                        <label className="text-[7.5px] font-bold text-slate-400 block mb-0.5">Username</label>
                        <input type="text" disabled value="Raka_Gamer" className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[9px] text-slate-400 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-[7.5px] font-bold text-slate-400 block mb-0.5">Kata Sandi (Password)</label>
                        <input type="password" placeholder="••••••••" disabled className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[9px] text-slate-500 focus:outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1 shrink-0 pt-1">
                      <button 
                        onClick={() => handleAction('a')} 
                        className="w-full bg-amber-500 text-white font-extrabold text-[9px] py-1.5 rounded-lg shadow-md animate-pulse-slow"
                      >
                        🔑 MASUK & KLAIM SKIN SEKARANG
                      </button>
                      <button 
                        onClick={() => handleAction('b')} 
                        className="w-full bg-slate-750 text-slate-350 text-[9px] py-1.5 rounded-lg"
                      >
                        Tutup Halaman Web (Kembali)
                      </button>
                    </div>
                  </div>
                )}

                {activeCase.id === 'kasus-5' && (
                  <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col p-3 shadow-2xl text-center space-y-2.5">
                    <div className="text-left border-b border-slate-850 pb-1 shrink-0">
                      <h5 className="font-extrabold text-[9px] text-slate-200">🗂️ File PDF Siswa Kelas 6</h5>
                      <p className="text-[8px] text-slate-455">Tugas_Harian_Siswa_IPA.pdf</p>
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      <button 
                        onClick={() => handleAction('a')} 
                        className="w-full bg-emerald-500 text-white font-black text-[9px] py-2 rounded-lg shadow-lg flex items-center justify-center gap-1"
                      >
                        🟢 DOWNLOAD NOW (FREE)
                      </button>
                      <button 
                        onClick={() => handleAction('a')} 
                        className="w-full bg-rose-600 text-white font-black text-[9px] py-2 rounded-lg shadow-lg flex items-center justify-center gap-1"
                      >
                        ⚡ FAST DOWNLOAD SPEED
                      </button>
                      <div className="pt-1 border-t border-slate-850">
                        <span 
                          onClick={() => handleAction('c')} 
                          className="text-[9px] text-slate-450 hover:text-slate-300 underline cursor-pointer inline-block"
                        >
                          Unduh Lembar_Kerja_IPA_Kelas_6.pdf
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FEEDBACK OVERLAY (Correct / Incorrect Consequences) */}
              {feedback && (
                <div className={`absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white backdrop-blur-md z-10 transition-all duration-300 ${
                  feedback.correct 
                    ? 'bg-emerald-955/95 border-4 border-emerald-500 shadow-[inset_0_0_40px_rgba(16,185,129,0.5)]' 
                    : 'bg-gradient-to-br from-red-950 via-black to-red-900 border-4 border-red-600 shadow-[inset_0_0_50px_rgba(239,68,68,0.7)]'
                }`}>
                  
                  {feedback.correct ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-800/40 rounded-2xl flex items-center justify-center mb-3 border border-emerald-500/30 animate-bounce">
                        <ShieldCheck className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h4 className="font-display font-black text-[15px] tracking-wide text-emerald-400 uppercase">
                        🛡️ KEPUTUSAN AMAN TERVERIFIKASI!
                      </h4>
                      <p className="text-[10.5px] leading-relaxed text-slate-100 max-w-md mt-3 font-semibold px-4 text-center">
                        {feedback.desc}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2 animate-bounce">☠️</div>
                      <h4 className="font-display font-black text-[16px] tracking-widest text-red-500 uppercase animate-pulse">
                        🚨 LAPTOP DIKUNCI VIRUS MALWARE 🚨
                      </h4>
                      <p className="text-[10px] leading-relaxed text-red-200 max-w-md mt-3 font-mono border border-red-500/20 bg-red-950/40 p-4 rounded-xl shadow-inner text-left">
                        {feedback.desc}
                      </p>
                    </>
                  )}

                  {/* Navigasi Overlay */}
                  <div className="mt-5 shrink-0">
                    <button 
                      disabled={countdown > 0}
                      onClick={() => {
                        if (isFinished) {
                          if (!submitted && allAnswered) handleConfirmSubmit();
                        } else {
                          handleNextCase();
                        }
                      }}
                      className={`font-extrabold text-[10px] py-2 px-5 rounded-xl shadow-md transition-all flex items-center gap-1 ${
                        countdown > 0 
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                          : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 cursor-pointer'
                      }`}
                    >
                      {buttonText}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Laptop Base Stand / Hinge */}
        <div className="bg-slate-700 h-4.5 w-full rounded-b-2xl border-t border-slate-600 shadow-md relative flex justify-center">
          <div className="w-24 h-1.5 bg-slate-800 rounded-b" />
        </div>

      </div>

      {/* Bottom control bar */}
      <div className="flex justify-between items-center border-t border-slate-150 pt-4 mt-2">
        <div className="flex gap-2">
          <button
            onClick={handlePrevCase}
            disabled={activeCaseIdx === 0}
            className="btn-secondary py-1.5 px-3.5 rounded-xl text-[10px] font-bold disabled:opacity-40"
          >
            ◀ Kembali
          </button>
          <button
            onClick={handleNextCase}
            disabled={activeCaseIdx === KASUS.length - 1}
            className="btn-secondary py-1.5 px-3.5 rounded-xl text-[10px] font-bold disabled:opacity-40"
          >
            Lanjut ▶
          </button>
        </div>

        {/* Show submit button if all are answered but not yet submitted */}
        {allAnswered && !submitted && (
          <button
            onClick={handleConfirmSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-1.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
          >
            💾 Simpan & Kirim Jawaban
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
  AKTIVITAS 4 — Lapor Konten Tidak Pantas
  (Simulasi SiberTok Feed dengan 6 Video)
  ══════════════════════════════════════════════════ */
const KONTEN_LAPOR = [
  {
    id: 'lapor-1',
    videoUrl: '/memasak_roti.mp4',
    creator: '@dapur_si_ibu',
    caption: 'Tutorial membuat roti rumahan super lembut! #cooking #resep #roti #diy',
    aman: true,
    tipe: 'Pantas',
    keterangan: 'Video ini adalah tutorial memasak yang aman, mendidik, dan sesuai usia anak.'
  },
  {
    id: 'lapor-2',
    videoUrl: '/stik_bertarung.mp4',
    creator: '@gaming_stick',
    caption: 'Pertarungan sengit stickman! Hancurkan semua musuh! #stickman #gaming #fight',
    aman: false,
    tipe: 'Tidak Pantas',
    keterangan: 'Video ini memuat adegan pertarungan yang menggambarkan kekerasan, tidak pantas untuk ditiru oleh anak.'
  },
  {
    id: 'lapor-3',
    videoUrl: '/tutorial_standing.mp4',
    creator: '@rider_ngebut',
    caption: 'Tutorial angkat roda depan / standing motor di jalan raya! #motor #wheelie #challenge',
    aman: false,
    tipe: 'Tidak Pantas',
    keterangan: 'Video ini menampilkan tindakan menunggangi motor secara berbahaya di jalan raya, melanggar keselamatan.'
  },
  {
    id: 'lapor-4',
    videoUrl: '/video_3_anak_nari.mp4',
    creator: '@sd_harapan_indah',
    caption: 'Alhamdulillah, penampilan tari Jaipong sekolah kami dapat juara 1! #tari #sekolah #seni',
    aman: true,
    tipe: 'Pantas',
    keterangan: 'Video ini merupakan dokumentasi tarian anak sekolah yang mendidik dan aman.'
  },
  {
    id: 'lapor-5',
    videoUrl: '/video_anak_vlog_makan.mp4',
    creator: '@vlog_anak_sekolah',
    caption: 'Review jajanan pentol pedas depan sekolah! Enak banget guys! #vlog #makanan #jajanan',
    aman: true,
    tipe: 'Pantas',
    keterangan: 'Video ini adalah review jajanan sekolah yang seru dan aman ditonton anak-anak.'
  },
  {
    id: 'lapor-6',
    videoUrl: '/video_pasangan.mp4',
    creator: '@romansa_dewasa',
    caption: 'Selalu bersamamu selamanya... #love #couple #romance',
    aman: false,
    tipe: 'Tidak Pantas',
    keterangan: 'Video ini memuat kemesraan orang dewasa yang ditujukan khusus untuk penonton dewasa.'
  }
];

const TINDAKAN_CEPAT = [
  { key: 'swipe', label: ' Geser Cepat (Swipe Away)', benar: true },
  { key: 'not_interested', label: ' Tekan "Tidak Tertarik"', benar: true },
  { key: 'report', label: ' Lapor pada Orang Dewasa', benar: true },
];

export function Topik4Aktivitas4({ answers = {}, onSave }: ActivityProps) {
  const [idx, setIdx] = useState<number>(answers._idx || 0);
  const [keputusan, setKeputusan] = useState<Record<string, 'pantas' | 'tidak_pantas'>>(answers.keputusan || {});
  const [tindakan, setTindakan] = useState<Record<string, string>>(answers.tindakan || {});
  const [laporan, setLaporan] = useState<Record<string, string>>(answers.laporan || {});
  const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);
  const [showConfirm, setShowConfirm] = useState(false);
  const [muted, setMuted] = useState(true);

  // SiberTok interaction states
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'lapor-1': 1420,
    'lapor-2': 890,
    'lapor-3': 1205,
    'lapor-4': 3450,
    'lapor-5': 2130,
    'lapor-6': 950
  });
  const [shareCount, setShareCount] = useState<Record<string, number>>({});

  const konten = KONTEN_LAPOR[idx];
  const pilihKeputusan = keputusan[konten.id];
  const pilihTindakan = tindakan[konten.id];
  const teksLaporan = laporan[konten.id] || '';

  const persist = (patch: Record<string, any>) => {
    onSave?.({
      keputusan,
      tindakan,
      laporan,
      _idx: idx,
      _submitted: submitted,
      ...patch
    });
  };

  const chooseKeputusan = (val: 'pantas' | 'tidak_pantas') => {
    if (submitted) return;
    const next = { ...keputusan, [konten.id]: val };
    setKeputusan(next);
    if (val === 'pantas') {
      const nextT = { ...tindakan };
      delete nextT[konten.id];
      const nextL = { ...laporan };
      delete nextL[konten.id];
      setTindakan(nextT);
      setLaporan(nextL);
      persist({ keputusan: next, tindakan: nextT, laporan: nextL });
    } else {
      persist({ keputusan: next });
    }
  };

  const chooseTindakan = (key: string) => {
    if (submitted) return;
    const next = { ...tindakan, [konten.id]: key };
    setTindakan(next);
    persist({ tindakan: next });
  };

  const writeLaporan = (val: string) => {
    if (submitted) return;
    const next = { ...laporan, [konten.id]: val };
    setLaporan(next);
    persist({ laporan: next });
  };

  const goNext = () => {
    if (idx < KONTEN_LAPOR.length - 1) {
      const ni = idx + 1;
      setIdx(ni);
      persist({ _idx: ni });
    }
  };

  const goPrev = () => {
    if (idx > 0) {
      const pi = idx - 1;
      setIdx(pi);
      persist({ _idx: pi });
    }
  };

  const confirm = () => {
    setShowConfirm(false);
    setSubmitted(true);
    persist({ _submitted: true });
  };

  const allFilled = KONTEN_LAPOR.every((k) => {
    const dec = keputusan[k.id];
    if (!dec) return false;
    if (dec === 'tidak_pantas') {
      return tindakan[k.id] && (laporan[k.id] || '').trim().length >= 5;
    }
    return true;
  });

  const correctCount = KONTEN_LAPOR.filter((k) => {
    const dec = keputusan[k.id];
    if (k.aman) {
      return dec === 'pantas';
    } else {
      return dec === 'tidak_pantas' && tindakan[k.id] && (laporan[k.id] || '').trim().length >= 5;
    }
  }).length;

  return (
    <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">
          Eksplorasi · Aktivitas 4
        </span>
        <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
          Lapor Konten Tidak Pantas
        </h3>
        <p className="text-sm text-primary-500 mt-2 leading-relaxed">
          Bukalah simulasi feed media sosial <b>SiberTok</b> di bawah ini. Amati setiap video,
          lalu lakukan analisis secara mandiri apakah konten tersebut <b>pantas</b> ditonton oleh anak seusiaku,
          lalu ambil keputusan teraman.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-[280px] h-[480px] bg-slate-950 border-[8px] border-slate-800 rounded-[40px] overflow-hidden shadow-2xl relative flex flex-col justify-between select-none">
            <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center px-4 text-[9px] text-white/95 font-semibold z-20 pointer-events-none">
              <span>13:40</span>
              <div className="w-14 h-3 bg-black rounded-full border border-white/10" />
              <span> 100%</span>
            </div>

            <div className="absolute top-6 inset-x-0 h-8 bg-gradient-to-b from-black/40 to-transparent flex justify-center items-center text-white/90 font-bold text-[11px] tracking-wider z-20 pointer-events-none">
              <span>SiberTok</span>
            </div>

            <div className="w-full h-full relative bg-black flex items-center justify-center">
              <AutoPlayVideo
                key={konten.videoUrl}
                src={konten.videoUrl}
                autoPlay
                loop
                muted={muted}
                playsInline
                className="w-full h-full object-cover absolute inset-0 z-0"
              />
              
              <button
                onClick={() => setMuted(!muted)}
                className="absolute top-10 right-3 z-20 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 flex items-center justify-center text-white border border-white/20 transition-all active:scale-90"
                title={muted ? "Nyalakan Suara" : "Senyapkan"}
              >
                {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 text-white/90 select-none z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 border border-white flex items-center justify-center font-bold text-[10px] shadow-md text-white">
                  {konten.creator.substring(1, 3).toUpperCase()}
                </div>
                
                <button
                  onClick={() => {
                    const isLiked = liked[konten.id];
                    setLiked({ ...liked, [konten.id]: !isLiked });
                    setLikeCounts({
                      ...likeCounts,
                      [konten.id]: likeCounts[konten.id] + (isLiked ? -1 : 1)
                    });
                  }}
                  className="flex flex-col items-center group transition-all active:scale-95"
                >
                  <div className={`w-8 h-8 rounded-full ${liked[konten.id] ? 'bg-rose-500/20' : 'bg-black/45'} flex items-center justify-center border border-white/10 group-hover:bg-white/10`}>
                    <Heart className={`w-4 h-4 transition-colors ${liked[konten.id] ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5 drop-shadow-md">{likeCounts[konten.id]}</span>
                </button>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-black/45 flex items-center justify-center border border-white/10">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5 drop-shadow-md font-mono">
                    {konten.aman ? Math.floor(likeCounts[konten.id] / 15) : '0'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const sCount = shareCount[konten.id] || 0;
                    setShareCount({ ...shareCount, [konten.id]: sCount + 1 });
                  }}
                  className="flex flex-col items-center group transition-all active:scale-95"
                >
                  <div className="w-8 h-8 rounded-full bg-black/45 flex items-center justify-center border border-white/10 group-hover:bg-white/10">
                    <Share2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[9px] font-bold mt-0.5 drop-shadow-md font-mono">
                    {(shareCount[konten.id] || 0) > 0 ? (shareCount[konten.id] || 0) : Math.floor(likeCounts[konten.id] / 20)}
                  </span>
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-4 pt-16 text-white text-xs z-10 flex flex-col justify-end text-left pointer-events-none">
                <div className="space-y-1.5 max-w-[80%]">
                  <p className="font-bold text-[12px] tracking-wide text-white drop-shadow">
                    {konten.creator}
                  </p>
                  <p className="text-[10.5px] leading-relaxed text-slate-200 drop-shadow line-clamp-3">
                    {konten.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 inline-flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-slate-500 animate-pulse" /> Tekan speaker untuk suara 
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between border border-slate-150 rounded-2xl p-4 sm:p-5 bg-slate-50/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[11px] font-black uppercase text-rose-500 tracking-wider">Lembar Kerja Analisis</span>
              <span className="text-xs font-bold text-slate-455 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
                Postingan {idx + 1} dari {KONTEN_LAPOR.length}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-primary-750">
                Langkah 1 — Apakah postingan di samping aman &amp; pantas ditonton oleh anak seusiaku?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => chooseKeputusan('pantas')}
                  disabled={submitted}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    pilihKeputusan === 'pantas'
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50'
                  }`}
                >
                  Aman &amp; Pantas
                </button>
                <button
                  type="button"
                  onClick={() => chooseKeputusan('tidak_pantas')}
                  disabled={submitted}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    pilihKeputusan === 'tidak_pantas'
                      ? 'bg-red-500 border-red-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-red-50 hover:text-red-700 disabled:opacity-50'
                  }`}
                >
                  Tidak Pantas / Bahaya
                </button>
              </div>
            </div>

            {pilihKeputusan === 'tidak_pantas' && (
              <div className="space-y-3.5 pt-1.5 animate-fadeIn">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary-750">
                    Langkah 2 — Apa jurus tindakan cepat teraman yang harus kamu ambil?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TINDAKAN_CEPAT.map((t) => {
                      let style = 'bg-white border-slate-200 text-slate-650 hover:bg-red-50';
                      if (submitted) {
                        style = pilihTindakan === t.key
                          ? 'bg-red-500 border-red-500 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-400 opacity-60';
                      } else if (pilihTindakan === t.key) {
                        style = 'bg-red-500 border-red-500 text-white shadow-sm';
                      }
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => chooseTindakan(t.key)}
                          disabled={submitted}
                          className={`px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-all text-left leading-normal ${style}`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-primary-750">Langkah 3 — Tulis laporan singkatmu</p>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Jelaskan apa yang terjadi di video dan mengapa konten tersebut membahayakan/tidak pantas:
                  </p>
                  <textarea
                    value={teksLaporan}
                    onChange={(e) => writeLaporan(e.target.value)}
                    disabled={submitted}
                    rows={3}
                    placeholder="Contoh: Video ini memuat kekerasan/bahaya karena..."
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-red-300 disabled:bg-slate-50 disabled:text-slate-500 leading-relaxed font-medium"
                  />
                </div>
              </div>
            )}

            {submitted && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                (konten.aman && pilihKeputusan === 'pantas') || (!konten.aman && pilihKeputusan === 'tidak_pantas')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="font-bold mb-1">
                  {(konten.aman && pilihKeputusan === 'pantas') || (!konten.aman && pilihKeputusan === 'tidak_pantas')
                    ? ' Hasil Analisismu Tepat!'
                    : ' Hasil Analisismu Kurang Tepat.'}
                </p>
                <p className="font-medium text-slate-650">{konten.keterangan}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={idx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              ← Sebelumnya
            </button>
            {idx < KONTEN_LAPOR.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!pilihKeputusan || (pilihKeputusan === 'tidak_pantas' && (!pilihTindakan || teksLaporan.trim().length < 5))}
                className="btn-primary py-2 px-6 rounded-xl font-bold text-xs disabled:opacity-40"
              >
                Postingan Berikutnya →
              </button>
            ) : !submitted ? (
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={!allFilled}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-40 inline-flex items-center gap-2"
              >
                Simpan Laporan
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-250 rounded-xl px-4 py-2.5">
                Skormu: {correctCount}/{KONTEN_LAPOR.length} Tepat
              </span>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-amber-100">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-primary-800">Simpan Laporan?</h4>
            <p className="text-sm text-primary-500 leading-relaxed">
              Setelah disimpan, laporan analisis SiberTok tidak dapat diubah lagi. Pastikan
              kamu sudah menilai dan menulis laporan untuk seluruh postingan dengan benar!
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-650 hover:bg-slate-200"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={confirm}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 2 — Apa yang Harus Kamu Lakukan?
 (Upgrade: 5 Skenario Tindakan Aman & Alasan)
 ══════════════════════════════════════════════════ */
interface SkenarioData {
  id: string;
  judul: string;
  emoji: string;
  teks: string;
  opsi: { key: string; label: string; benar: boolean }[];
  ulasan: string;
  modelAlasan: string;
  renderMockup: () => React.ReactNode;
}

const SKENARIO_AMAN: SkenarioData[] = [
  {
    id: 'sit-1',
    judul: 'Pop-up Scareware',
    emoji: '🚨',
    teks: 'Saat mencari gambar tugas sekolah di internet, tiba-tiba layar browsermu berkedip merah dan menampilkan peringatan bahwa HP-mu terinfeksi banyak virus.',
    opsi: [
      { key: 'klik', label: 'Klik tombol hijau untuk membersihkan virus segera', benar: false },
      { key: 'abaikan', label: 'Mengabaikan pop-up dan segera menutup tab browser tersebut', benar: true },
      { key: 'bagikan', label: 'Membagikan screenshot layar ini ke grup chat teman-teman', benar: false }
    ],
    modelAlasan: 'Peringatan infeksi virus mendadak di halaman web browser adalah scareware (iklan palsu/penipuan) yang menakut-nakuti agar kita mendownload malware. Cara teraman adalah dengan langsung menutup halaman tersebut.',
    ulasan: 'Peringatan virus di browser hanyalah iklan jebakan (scareware) agar kamu mengunduh aplikasi berbahaya. Menutup tab tersebut adalah langkah terbaik karena HP-mu sebenarnya baik-baik saja.',
    renderMockup: () => (
      <div className="border border-red-200 rounded-2xl overflow-hidden shadow-sm max-w-md mx-auto bg-slate-900">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="bg-slate-950 text-slate-400 px-2 py-0.5 rounded text-[10px] truncate max-w-[200px] font-mono text-left">
            http://warning-system-secure.xyz/scan
          </div>
          <span className="text-[10px] text-red-400 font-bold animate-pulse">⚠️ BAHAYA</span>
        </div>
        <div className="p-6 text-center bg-red-950/80 text-white space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mx-auto border border-red-500 animate-bounce">
            <AlertTriangle className="w-6 h-6 text-red-100" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm tracking-wide text-red-200 uppercase">HP-mu Terinfeksi 5 Virus!</h4>
            <p className="text-[11px] text-slate-350 leading-relaxed">System damage: 28%. Virus akan menghapus file gawai dalam waktu:</p>
          </div>
          <div className="text-xl font-mono font-black text-red-400 bg-black/45 py-1 px-3 rounded-lg inline-block">
            01:45
          </div>
          <button type="button" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md active:scale-[0.98] transition-all">
            HAPUS VIRUS SEKARANG
          </button>
        </div>
      </div>
    )
  },
  {
    id: 'sit-2',
    judul: 'Chat WhatsApp APK File',
    emoji: '💬',
    teks: 'Temanmu, Roni, mengirimkan obrolan chat WhatsApp berisi tawaran Roblox Mod gratis berbentuk file .apk yang tidak dikenal.',
    opsi: [
      { key: 'download', label: 'Download dan instal aplikasi agar dapet cheat game', benar: false },
      { key: 'tolak', label: 'Menolak tawaran tersebut dan menasihati teman agar tidak sembarangan instal file .apk', benar: true },
      { key: 'teruskan', label: 'Meneruskan pesan tersebut ke teman lain agar mereka juga bisa mencoba', benar: false }
    ],
    modelAlasan: 'Mengunduh dan menginstal file dengan format .apk dari luar toko aplikasi resmi (seperti Google Play Store) sangat berisiko disusupi virus/malware yang dapat meretas atau merusak gawai.',
    ulasan: 'Tautan atau file .apk dari sumber tidak tepercaya sangat berbahaya karena bisa mengandung malware/virus pencuri data gawai. Kita harus selalu mengunduh aplikasi lewat toko resmi Google Play Store.',
    renderMockup: () => (
      <div className="border border-emerald-200 rounded-2xl overflow-hidden shadow-sm max-w-md mx-auto bg-[#0b141a]">
        <div className="bg-[#0d1c25] px-4 py-2.5 flex items-center justify-between border-b border-emerald-900/40 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
              RO
            </div>
            <div className="text-left">
              <p className="text-xs font-bold leading-none">Roni (Teman)</p>
              <span className="text-[9px] text-emerald-400">online</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Phone className="w-3.5 h-3.5" />
            <MoreVertical className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[140px] bg-[#0b141a] relative flex flex-col justify-end">
          <div className="bg-[#202c33] rounded-r-2xl rounded-bl-2xl p-3 max-w-[85%] self-start text-xs text-white space-y-2 border border-slate-800 text-left">
            <p className="leading-relaxed text-left">
              Bro! Gue nemu mod game Roblox keren banget nih, bisa dapet Robux gratis tak terbatas. Cobain yuk! 🎮
            </p>
            <div className="bg-[#111b21] rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-800/80">
              <div className="w-8 h-8 rounded bg-emerald-750 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-white uppercase">APK</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10.5px] font-bold text-slate-100 truncate leading-snug">Roblox_Mod_Free_Robux.apk</p>
                <span className="text-[9px] text-slate-400">5.2 MB · APK File</span>
              </div>
              <button type="button" className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-700 shrink-0 text-[10px] font-bold">
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'sit-3',
    judul: 'SMS Penipuan Hadiah',
    emoji: '✉️',
    teks: 'Kamu menerima SMS dari nomor asing yang menyatakan nomor HP-mu memenangkan hadiah puluhan juta rupiah disertai tautan situs dengan ekstensi .xyz.',
    opsi: [
      { key: 'klik', label: 'Buka tautan dan isi data agar hadiah bisa dikirim', benar: false },
      { key: 'abaikan', label: 'Abaikan SMS tersebut, tandai sebagai spam, dan jangan klik tautan apa pun', benar: true },
      { key: 'hubungi', label: 'Menelepon balik nomor pengirim untuk memarahi atau menanyakan kebenaran', benar: false }
    ],
    modelAlasan: 'Pesan hadiah bernilai besar dari nomor tidak dikenal menggunakan tautan domain tidak resmi (.xyz) adalah taktik penipuan phishing. Menelepon balik juga berbahaya karena bisa dimanipulasi secara verbal.',
    ulasan: 'SMS kemenangan hadiah bernilai fantastis dari nomor pribadi tak dikenal adalah phishing. Jangan pernah mengklik tautan di dalamnya atau memberikan informasi sensitif milikmu maupun orang tuamu.',
    renderMockup: () => (
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-w-md mx-auto bg-slate-950">
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
              +62
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">+62 821-9988-1234</p>
              <span className="text-[9px] text-slate-400">Pesan SMS</span>
            </div>
          </div>
          <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="p-4 space-y-3 min-h-[120px] bg-slate-950">
          <div className="bg-slate-900/80 rounded-2xl p-3 text-slate-200 text-xs leading-relaxed space-y-1.5 border border-slate-800 text-left">
            <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold block text-left">Pesan Hari Ini</span>
            <p className="text-left text-slate-200">
              TELKOMSEL POIN: Selamat! Anda mendapat HADIAH Uang Rp 50.000.000. Untuk mencairkan dana silakan kunjungi website resmi kami di: 
              <span className="text-blue-400 font-bold block mt-1 underline truncate text-left">http://pemenang-telkomsel-2026.xyz</span>
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'sit-4',
    judul: 'Sensor Video Tidak Layak',
    emoji: '🔞',
    teks: 'Saat asyik menonton video di media sosial, tiba-tiba algoritma menampilkan video pertarungan atau adegan kekerasan dengan kata-kata kotor.',
    opsi: [
      { key: 'tonton', label: 'Tetap menontonnya karena penasaran dengan kelanjutan pertarungannya', benar: false },
      { key: 'tutup', label: 'Tutup videonya segera dan laporkan/ceritakan ke orang dewasa tepercaya', benar: true },
      { key: 'komentar', label: 'Menulis komentar di bawah video dengan kata-kata sindiran atau ejekan', benar: false }
    ],
    modelAlasan: 'Menghindari konten kekerasan dan kasar penting untuk kesehatan mental kita. Melaporkan konten tidak pantas ke orang dewasa membantu sistem menyaring dan memblokir konten sejenis.',
    ulasan: 'Jika melihat konten berbahaya, menakutkan, atau menggunakan bahasa kasar, segera matikan atau geser video tersebut. Ceritakan pada orang tua atau gurumu agar mereka bisa memfilter akun sosial mediamu.',
    renderMockup: () => (
      <div className="border border-slate-250 rounded-2xl overflow-hidden shadow-sm max-w-md mx-auto bg-slate-900 aspect-video flex flex-col justify-between relative">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 z-10 space-y-2.5">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-xs text-amber-300">Pemberitahuan Konten Sensitif</h5>
            <p className="text-[10px] text-slate-300 max-w-[80%] mx-auto leading-normal">
              Video ini diburamkan karena berpotensi memuat unsur kekerasan, perundungan, atau bahasa kasar.
            </p>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between text-white bg-black/40 z-0">
          <span className="text-[10px]">Playing: @fight_channel</span>
          <Play className="w-4 h-4 opacity-50" />
        </div>
        <div className="p-3 bg-black/55 z-0">
          <div className="h-1 bg-slate-700 rounded-full w-full">
            <div className="bg-red-500 h-1 rounded-full w-1/3" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'sit-5',
    judul: 'Google Classroom Resmi',
    emoji: '🎓',
    teks: 'Wali kelasmu (Ibu Maria Ulfah) memposting link latihan simulasi ujian ANBK resmi di forum Google Classroom.',
    opsi: [
      { key: 'buka', label: 'Buka tautan secara percaya diri untuk mulai mengerjakan tugas', benar: true },
      { key: 'takut', label: 'Abaikan saja karena takut jika tautan tersebut disusupi virus', benar: false },
      { key: 'ragu', label: 'Menunggu teman kelas lain membukanya terlebih dahulu untuk memastikan', benar: false }
    ],
    modelAlasan: 'Tautan resmi yang dibagikan guru di platform belajar resmi sekolah (seperti Google Classroom) dengan domain tepercaya (google.com) aman untuk diakses demi menunjang pembelajaran.',
    ulasan: 'Platform sekolah resmi dengan domain tepercaya (seperti classroom.google.com) yang dikirim oleh guru adalah aman. Kamu tidak perlu takut untuk membukanya karena ini ditujukan untuk proses belajarmu.',
    renderMockup: () => (
      <div className="border border-indigo-200 rounded-2xl overflow-hidden shadow-sm max-w-md mx-auto bg-white text-slate-800">
        <div className="bg-indigo-650 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">GC</span>
            </div>
            <span className="text-xs font-bold leading-none">Wali Kelas 6-B</span>
          </div>
          <Search className="w-3.5 h-3.5 text-indigo-200" />
        </div>
        <div className="p-4 space-y-3 bg-slate-50/40">
          <div className="bg-white rounded-xl border border-slate-150 p-3.5 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[10px] text-indigo-700">
                MU
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-800">Ibu Maria Ulfah</p>
                <span className="text-[9px] text-slate-455">Hari ini, 07:15</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-650 leading-relaxed text-left">
              Halo anak-anak, berikut adalah link resmi materi kisi-kisi dan persiapan simulasi ANBK sekolah kita. Silakan dipelajari, ya!
            </p>
            <div className="border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl p-2.5 flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10.5px] font-bold text-indigo-900 leading-none">Simulasi ANBK 2026</p>
                <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                  <Lock className="w-2 h-2 fill-emerald-600" /> classroom.google.com (Tautan Aman)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

interface ScenariosState {
  [scenarioId: string]: {
    tindakan: string;
    alasan: string;
  };
}

export function Topik4Aktivitas2({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<ScenariosState>(() => {
    const initial: ScenariosState = {};
    const existing = answers.data || {};
    ['sit-1', 'sit-2', 'sit-3', 'sit-4', 'sit-5'].forEach((id) => {
      const val = existing[id];
      if (typeof val === 'string') {
        initial[id] = { tindakan: val, alasan: '' };
      } else if (val && typeof val === 'object') {
        initial[id] = { 
          tindakan: val.tindakan || '', 
          alasan: val.alasan || '' 
        };
      } else {
        initial[id] = { tindakan: '', alasan: '' };
      }
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);

  const chooseTindakan = (scenarioId: string, optionKey: string) => {
    if (submitted) return;
    const next = {
      ...data,
      [scenarioId]: {
        ...data[scenarioId],
        tindakan: optionKey
      }
    };
    setData(next);
    onSave?.({ data: next });
  };

  const writeAlasan = (scenarioId: string, text: string) => {
    if (submitted) return;
    const next = {
      ...data,
      [scenarioId]: {
        ...data[scenarioId],
        alasan: text
      }
    };
    setData(next);
    onSave?.({ data: next });
  };

  const confirm = () => {
    setShowConfirm(false);
    setSubmitted(true);
    
    const correctCount = SKENARIO_AMAN.filter((s) => {
      const val = data[s.id];
      const correctOption = s.opsi.find((o) => o.benar);
      return val && val.tindakan === correctOption?.key;
    }).length;

    onSave?.({ 
      data, 
      _submitted: true,
      score: correctCount,
      total: SKENARIO_AMAN.length
    });
  };

  const allFilled = SKENARIO_AMAN.every((s) => {
    const val = data[s.id];
    return val && val.tindakan && val.alasan.trim().length >= 5;
  });

  const score = SKENARIO_AMAN.filter((s) => {
    const val = data[s.id];
    const correctOption = s.opsi.find((o) => o.benar);
    return val && val.tindakan === correctOption?.key;
  }).length;

  const currentScenario = SKENARIO_AMAN[activeScenarioIdx];
  const val = data[currentScenario.id] || { tindakan: '', alasan: '' };
  const correctOption = currentScenario.opsi.find((o) => o.benar);
  const isCorrect = val.tindakan === correctOption?.key;

  return (
    <div className="bg-white border border-red-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">
          Eksplorasi · Aktivitas 2
        </span>
        <h3 className="font-display font-bold text-xl text-primary-800 mt-1">
          Apa yang Harus Kamu Lakukan?
        </h3>
        <p className="text-sm text-primary-500 mt-2 leading-relaxed">
          Bacalah setiap situasi/studi kasus di bawah ini dengan cermat. Amati UI gawai/layar simulasi, pilihlah <b>tindakan paling aman</b> yang akan kamu ambil, dan tuliskan <b>alasan logismu</b>!
        </p>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-slate-100 flex-row">
        {SKENARIO_AMAN.map((s, idx) => {
          const sVal = data[s.id] || { tindakan: '', alasan: '' };
          const isFilled = sVal.tindakan && sVal.alasan.trim().length >= 5;
          const isActive = idx === activeScenarioIdx;
          const sCorrectOption = s.opsi.find((o) => o.benar);
          const sCorrect = sVal.tindakan === sCorrectOption?.key;

          let tabStyle = "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50";
          if (isActive) {
            tabStyle = "bg-red-500 text-white border-red-500 shadow-sm font-extrabold";
          } else if (submitted) {
            tabStyle = sCorrect
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60"
              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/60";
          } else if (isFilled) {
            tabStyle = "bg-red-50 text-red-700 border-red-200 hover:bg-red-100/60";
          }

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenarioIdx(idx)}
              className={`px-3 py-1.5 rounded-t-xl text-[11px] font-bold border transition-all shrink-0 flex items-center gap-1.5 ${tabStyle}`}
            >
              <span>{s.emoji}</span>
              <span>Kasus {idx + 1}</span>
              {submitted ? (
                sCorrect ? "✅" : "❌"
              ) : isFilled ? (
                "✍️"
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active Scenario Content */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            {currentScenario.emoji}
          </span>
          <div className="text-left">
            <h4 className="font-display font-bold text-sm text-slate-800">
              Studi Kasus {activeScenarioIdx + 1}: {currentScenario.judul}
            </h4>
            <p className="text-[11px] text-slate-400">Pilihlah pertahanan terbaikmu di dunia digital.</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-650 leading-relaxed italic text-left">
          "{currentScenario.teks}"
        </div>

        <div className="py-2">
          {currentScenario.renderMockup()}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700 text-left">Pilih tindakan paling aman:</p>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {currentScenario.opsi.map((o) => {
              let style = 'bg-white border-slate-200 text-slate-600 hover:bg-red-50/50 hover:border-red-200';
              if (submitted) {
                if (o.benar) {
                  style = 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm';
                } else if (val.tindakan === o.key) {
                  style = 'bg-red-50 border-red-300 text-red-800 opacity-80';
                } else {
                  style = 'bg-white border-slate-150 text-slate-400 opacity-60';
                }
              } else if (val.tindakan === o.key) {
                style = 'bg-red-500 border-red-500 text-white shadow-md scale-[1.01]';
              }

              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => chooseTindakan(currentScenario.id, o.key)}
                  disabled={submitted}
                  className={`p-3 rounded-2xl text-xs font-semibold border transition-all text-left flex flex-col justify-between leading-normal h-full min-h-[64px] ${style}`}
                >
                  <span className="flex-1">{o.label}</span>
                  {submitted && o.benar && (
                    <span className="text-[9px] font-bold text-emerald-600 mt-2 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Tindakan Tepat
                    </span>
                  )}
                  {submitted && !o.benar && val.tindakan === o.key && (
                    <span className="text-[9px] font-bold text-red-655 mt-2 inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> Kurang Tepat
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block text-left">
            Alasan mengapa kamu memilih tindakan tersebut:
          </label>
          <textarea
            rows={2}
            disabled={submitted}
            value={val.alasan}
            onChange={(e) => writeAlasan(currentScenario.id, e.target.value)}
            placeholder="Tuliskan alasan kritis mengapa menurutmu pilihan tindakan di atas adalah yang paling aman..."
            className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-none focus:border-red-300 disabled:bg-slate-50 disabled:text-slate-500 leading-relaxed font-medium transition-all text-left"
          />
          {!submitted && val.alasan.trim().length < 5 && (
            <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 text-left">
              ⚠️ Alasan harus diisi minimal 5 karakter (saat ini: {val.alasan.trim().length}/5)
            </p>
          )}
        </div>

        {submitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 animate-fadeIn text-left ${
            isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-red-50/70 border-red-200 text-red-800'
          }`}>
            <div>
              <span className="font-extrabold block text-[11px] uppercase tracking-wider mb-0.5">Analisis Keamanan Siber</span>
              <p className="font-medium text-slate-700">{currentScenario.ulasan}</p>
            </div>
            <div className="border-t border-slate-200/50 pt-2 text-[11px]">
              <span className="font-bold block text-slate-600">Model Jawaban/Alasan Teoretis:</span>
              <p className="italic text-slate-550 mt-0.5 font-medium">"{currentScenario.modelAlasan}"</p>
            </div>
          </div>
        )}
      </div>

      {/* Slide Prev/Next Buttons */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setActiveScenarioIdx(prev => Math.max(0, prev - 1))}
          disabled={activeScenarioIdx === 0}
          className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed select-none"
        >
          ← Sebelum
        </button>
        <span className="text-xs font-bold text-slate-400 select-none">
          {activeScenarioIdx + 1} / {SKENARIO_AMAN.length}
        </span>
        <button
          type="button"
          onClick={() => setActiveScenarioIdx(prev => Math.min(SKENARIO_AMAN.length - 1, prev + 1))}
          disabled={activeScenarioIdx === SKENARIO_AMAN.length - 1}
          className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed select-none"
        >
          Berikutnya →
        </button>
      </div>

      {/* Submission Footer */}
      <div className="border-t border-slate-100 pt-5 mt-6">
        {submitted ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-5 text-emerald-700 font-bold text-sm">
            <div className="flex items-center gap-2 text-left">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Simulasi tindakan aman berhasil diselesaikan dan disimpan!</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 rounded-xl px-4 py-2 shrink-0">
              Skormu: {score}/{SKENARIO_AMAN.length} Tindakan Aman
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-400 max-w-md text-left">
              Pastikan kamu telah memilih opsi tindakan dan menulis alasan dengan lengkap untuk semua studi kasus sebelum menyimpan jawaban.
            </p>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={!allFilled}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-40 transition-all cursor-pointer"
            >
              Simpan Jawaban Simulasi
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-amber-100">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-primary-800">Simpan Jawaban?</h4>
            <p className="text-sm text-primary-500 leading-relaxed">
              Setelah disimpan, semua jawaban tindakan dan alasanmu tidak dapat diubah lagi. Pastikan kamu sudah yakin dengan semua jawabanmu!
            </p>
            <div className="flex gap-2 pt-1 font-bold">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-650 hover:bg-slate-200"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={confirm}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
