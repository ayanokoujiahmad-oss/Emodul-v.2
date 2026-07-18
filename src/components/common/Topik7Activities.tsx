import { useState } from 'react';

interface ActivityProps {
 answers?: Record<string, any>;
 onSave?: (val: Record<string, any>) => void;
}

/* ══════════════════════════════════════════════════
 TOPIK 7 — TANTANGAN AWAL (Gamifikasi)
 "Boleh Diambil Begitu Saja?" — Detektif Karya
 ══════════════════════════════════════════════════ */

// Panel cerita bergaya komik
const COMIC_SLIDES = [
  {
    src: '/gambar/topik 7/komik 1 topik 7.png',
    alt: 'Misi Detektif Karya Halaman 1',
  },
  {
    src: '/gambar/topik 7/komik 2 topik 7.png',
    alt: 'Misi Detektif Karya Halaman 2',
  },
];

// Kartu penilaian "Detektif Karya": tindakan benar (menghargai) / salah (melanggar)
interface KartuTindakan {
 id: string;
 teks: string;
 jawaban: 'hargai' | 'langgar';
 alasan: string;
}

const KARTU_TINDAKAN: KartuTindakan[] = [
 {
 id: 'k1',
 teks: 'Mencari contoh poster di internet untuk mendapatkan ide.',
 jawaban: 'hargai',
 alasan: 'Mencari inspirasi itu boleh, asalkan kita tetap membuat karya sendiri.',
 },
 {
 id: 'k2',
 teks: 'Mengunduh poster orang lain lalu memakainya tanpa membaca nama pembuatnya.',
 jawaban: 'langgar',
 alasan: 'Mengambil karya tanpa izin dan tanpa melihat pembuatnya melanggar hak cipta.',
 },
 {
 id: 'k3',
 teks: 'Mengganti nama pembuat poster dengan nama sendiri.',
 jawaban: 'langgar',
 alasan: 'Ini disebut plagiarisme — mengaku karya orang lain sebagai karya sendiri.',
 },
 {
 id: 'k4',
 teks: 'Mencantumkan nama pembuat asli saat menggunakan karya orang lain.',
 jawaban: 'hargai',
 alasan: 'Menulis kredit pembuat adalah cara menghargai karya orang lain.',
 },
 {
 id: 'k5',
 teks: 'Mengingatkan teman bahwa karya orang lain tidak boleh diaku sebagai milik sendiri.',
 jawaban: 'hargai',
 alasan: 'Mengingatkan dengan sopan menunjukkan sikap menghargai karya.',
 },
];

export function Topik7TantanganAwal({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, any>>(answers);
  const [panel, setPanel] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const update = (next: Record<string, any>) => {
    setData(next);
    onSave?.(next);
  };

  const verdicts: Record<string, 'hargai' | 'langgar'> = data.verdicts || {};
  const dinilai = Object.keys(verdicts).length;
  const benar = KARTU_TINDAKAN.filter((k) => verdicts[k.id] === k.jawaban).length;
  const selesaiKartu = dinilai === KARTU_TINDAKAN.length;

  const pilihVerdict = (id: string, val: 'hargai' | 'langgar') => {
    if (verdicts[id]) return; // sekali pilih, langsung terkunci
    const nextVerdicts = { ...verdicts, [id]: val };
    update({ ...data, verdicts: nextVerdicts });
  };

  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">
            Tantangan Awal
          </span>
          <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
            Misi Detektif Karya: "Boleh Diambil Begitu Saja?"
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Kerjakan secara mandiri. Perhatikan cerita komik di bawah ini secara seksama dengan menggeser slide, lalu tentukan tindakan mana yang <b>menghargai karya</b> dan mana yang <b>melanggar</b>. Kumpulkan poin sebanyak-banyaknya!
          </p>
        </div>
      </div>

      {/* ===== Panel cerita komik (Slides) ===== */}
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-orange-600">
            Halaman Komik {panel + 1} dari {COMIC_SLIDES.length}
          </span>
          <div className="flex gap-1.5">
            {COMIC_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPanel(i)}
                className={`h-2 w-8 rounded-full transition-all ${
                  i === panel ? 'bg-orange-500' : 'bg-orange-200 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div 
          onClick={() => setIsZoomed(true)}
          className="bg-white rounded-2xl border border-orange-100 p-2 shadow-sm overflow-hidden flex items-center justify-center min-h-[220px] cursor-zoom-in group relative"
        >
          <img
            src={COMIC_SLIDES[panel].src}
            alt={COMIC_SLIDES[panel].alt}
            className="max-h-[320px] sm:max-h-[400px] w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full transition-opacity flex items-center gap-1">
              🔍 Perbesar Gambar
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setPanel((p) => Math.max(0, p - 1))}
            disabled={panel === 0}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50 transition-colors"
          >
            ← Sebelumnya
          </button>
          
          <span className="text-[10px] text-slate-400 font-medium italic hidden sm:inline">
            Klik gambar untuk memperbesar cerita komik
          </span>

          <button
            onClick={() => setPanel((p) => Math.min(COMIC_SLIDES.length - 1, p + 1))}
            disabled={panel === COMIC_SLIDES.length - 1}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50 transition-colors"
          >
            Lanjut →
          </button>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-2 animate-pop-in">
            <button 
              className="absolute -top-10 right-0 text-white text-sm font-bold flex items-center gap-1 hover:text-orange-400 transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              ✕ Tutup
            </button>
            <img
              src={COMIC_SLIDES[panel].src}
              alt={COMIC_SLIDES[panel].alt}
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

 {/* ===== Misi penilaian tindakan ===== */}
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <p className="text-sm font-bold text-primary-700"> Geser keputusanmu untuk tiap tindakan:</p>
 <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
 {benar} poin
 </span>
 </div>

 {KARTU_TINDAKAN.map((k, i) => {
 const pilihan = verdicts[k.id];
 const sudah =!!pilihan;
 const tepat = pilihan === k.jawaban;
 return (
 <div
 key={k.id}
 className={`rounded-2xl border p-3.5 transition-all ${
!sudah
? 'border-slate-200 bg-white'
: tepat
? 'border-emerald-200 bg-emerald-50'
: 'border-rose-200 bg-rose-50'
 }`}
 >
 <p className="text-sm text-slate-700 leading-snug">
 <span className="font-bold text-slate-400 mr-1">{i + 1}.</span>
 {k.teks}
 </p>

 <div className="flex gap-2 mt-3">
 <button
 onClick={() => pilihVerdict(k.id, 'hargai')}
 disabled={sudah}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 pilihan === 'hargai'
? 'bg-emerald-500 border-emerald-500 text-white'
: 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50'
 }`}
 >
 Menghargai Karya
 </button>
 <button
 onClick={() => pilihVerdict(k.id, 'langgar')}
 disabled={sudah}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 pilihan === 'langgar'
? 'bg-rose-500 border-rose-500 text-white'
: 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50'
 }`}
 >
 Melanggar
 </button>
 </div>

 {sudah && (
 <p
 className={`text-[11px] mt-2.5 leading-relaxed animate-pop-in ${
 tepat? 'text-emerald-700': 'text-rose-700'
 }`}
 >
 {tepat? ' Tepat! ': ' Belum tepat. '}
 {k.alasan}
 </p>
 )}
 </div>
 );
 })}

 {selesaiKartu && (
 <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-4 text-center animate-pop-in">
 <p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-700">
 {benar >= 4? 'Sangat baik': benar >= 2? 'Cukup baik': 'Perlu latihan'}
 </p>
 <p className="text-sm font-bold text-orange-700">
 Skor Detektif Karya: {benar}/{KARTU_TINDAKAN.length}
 </p>
 <p className="text-[11px] text-orange-600 mt-1">
 {benar >= 4
? 'Hebat! Kamu jeli membedakan menghargai dan melanggar karya.'
: 'Bagus! Ayo pelajari lagi agar makin paham menghargai karya orang lain.'}
 </p>
 </div>
 )}
 </div>

 {/* ===== Pertanyaan pamungkas + refleksi ===== */}
 <div className="space-y-4 pt-1">
 <div className="space-y-2">
 <p className="text-sm font-bold text-primary-700">
 Menurutmu, apakah pendapat Raka ("ditemukan di internet berarti boleh dipakai") sudah benar?
 </p>
 <div className="flex gap-3">
 {[
 { val: 'benar', label: ' Sudah Benar' },
 { val: 'salah', label: ' Belum Benar' },
 ].map((o) => (
 <button
 key={o.val}
 onClick={() => update({...data, pendapat: o.val })}
 className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
 data.pendapat === o.val
? 'bg-orange-500 border-orange-500 text-white'
: 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50'
 }`}
 >
 {o.label}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-sm font-bold text-primary-700">
 Tuliskan alasanmu. Bagaimana perasaanmu jika karyamu diambil orang lain dan diakui sebagai miliknya?
 </label>
 <textarea
 value={data.alasan || ''}
 onChange={(e) => update({...data, alasan: e.target.value })}
 rows={3}
 placeholder="Tulis pendapat dan perasaanmu di sini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm resize-none"
 />
 </div>
 </div>

 <p className="text-[11px] text-slate-400 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 1 — BERBURU SUMBER GAMBAR (Simulasi Pencarian)
 "Detektif Gambar" — cari gambar lalu periksa sumbernya
 ══════════════════════════════════════════════════ */


interface HasilGambar {
 id: string;
 keyword: string;
 imageSrc: string;
 fallbackEmoji: string;
 tentang: string;
 sumber: string;
 sumberJelas: boolean; // jawaban benar
 bolehDigunakan: boolean; // jawaban benar
 alasan: string;
}

// Ganti src dengan gambar hasil pencarianmu di Google.
const HASIL_GAMBAR: HasilGambar[] = [
  {
    id: 'g1',
    keyword: 'poster hemat energi',
    imageSrc: '/gambar/topik 7/Poster Kampanye Hemat Energi Ilustratif Hijau dan Biru.png',
    fallbackEmoji: '⚡',
    tentang: 'Poster ajakan untuk menghemat listrik dan energi.',
    sumber: 'www.kemdikbud.go.id',
    sumberJelas: true,
    bolehDigunakan: true,
    alasan:
      'Sumber website-nya jelas (situs resmi pemerintah) dan boleh digunakan asalkan kamu mencantumkan sumbernya.',
  },
  {
    id: 'g2',
    keyword: 'foto para pejabat negara',
    imageSrc: '/gambar/topik 7/foto pejabat.jpg',
    fallbackEmoji: '👔',
    tentang: 'Foto resmi para pejabat negara dalam sebuah acara resmi.',
    sumber: 'Situs berita resmi (mencantumkan nama fotografer)',
    sumberJelas: true,
    bolehDigunakan: true,
    alasan:
      'Sumbernya jelas dan ada nama pembuatnya. Boleh dipakai untuk tugas sekolah selama sumbernya kamu tulis.',
  },
  {
    id: 'g3',
    keyword: 'ilustrasi pohon gratis',
    imageSrc: '/gambar/topik 7/gambar pohon.jpg',
    fallbackEmoji: '🌳',
    tentang: 'Ilustrasi pohon berlisensi bebas (Creative Commons).',
    sumber: 'www.freepik.com',
    sumberJelas: true,
    bolehDigunakan: true,
    alasan:
      'Situs penyedia gambar gratis berlisensi bebas. Boleh digunakan asalkan nama pembuatnya dicantumkan.',
  },
  {
    id: 'g4',
    keyword: 'gambar kartun lucu',
    imageSrc: '/gambar/topik 7/kartun asli.jpg',
    fallbackEmoji: '🐱',
    tentang: 'Gambar karakter kartun terkenal milik sebuah perusahaan.',
    sumber: 'Blog acak tanpa nama pembuat',
    sumberJelas: false,
    bolehDigunakan: false,
    alasan:
      'Sumbernya tidak jelas dan karakter kartun terkenal biasanya dilindungi hak cipta. Sebaiknya tidak digunakan dulu.',
  },
  {
    id: 'g5',
    keyword: 'gambar wisata alam jambi',
    imageSrc: '/gambar/topik 7/gambar pemandangan danau kaco.jpeg',
    fallbackEmoji: '🏞️',
    tentang: 'Foto pemandangan Danau Kaco di Kerinci, Jambi yang indah.',
    sumber: 'Tangkapan layar dari akun Instagram pribadi orang lain (tanpa izin)',
    sumberJelas: false,
    bolehDigunakan: false,
    alasan:
      'Gambar tersebut diambil dari akun pribadi media sosial orang lain tanpa izin. Tidak ada nama website yang jelas, jadi sebaiknya jangan digunakan dulu.',
  },
];

// Komponen kecil: gambar dengan fallback emoji jika belum tersedia
function GambarHasil({ src, emoji, alt }: { src: string; emoji: string; alt: string }) {
  const [gagal, setGagal] = useState(false);
  if (gagal) {
    return (
      <div className="w-full h-60 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
        <span className="text-5xl">{emoji}</span>
        <span className="text-[10px] mt-1">Gambar hasil pencarian</span>
      </div>
    );
  }
  return (
    <div className="w-full h-60 bg-slate-100/50 border border-slate-200 rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-inner">
      <img
        src={src}
        alt={alt}
        onError={() => setGagal(true)}
        className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
      />
    </div>
  );
}

export function Topik7Aktivitas1({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);
 const [idx, setIdx] = useState<number>(answers.idx || 0);
 const [mencari, setMencari] = useState(false);
 const [sudahCari, setSudahCari] = useState<Record<string, boolean>>(answers.sudahCari || {});

 const update = (next: Record<string, any>) => {
 setData(next);
 onSave?.(next);
 };

 const hasil: Record<string, { sumberJelas?: boolean; bolehDigunakan?: boolean; alasan?: string }> =
 data.hasil || {};
 const aktif = HASIL_GAMBAR[idx];
 const jawab = hasil[aktif.id] || {};
 const sudahCariIni =!!sudahCari[aktif.id];

 const terkunci = jawab.sumberJelas!== undefined && jawab.bolehDigunakan!== undefined;

 // hitung poin
 const poin = HASIL_GAMBAR.reduce((acc, g) => {
 const j = hasil[g.id];
 if (!j) return acc;
 let p = 0;
 if (j.sumberJelas === g.sumberJelas) p++;
 if (j.bolehDigunakan === g.bolehDigunakan) p++;
 return acc + p;
 }, 0);
 const maksPoin = HASIL_GAMBAR.length * 2;
 const semuaSelesai = HASIL_GAMBAR.every(
 (g) => hasil[g.id]?.sumberJelas!== undefined && hasil[g.id]?.bolehDigunakan!== undefined
 );

 const mulaiCari = () => {
 setMencari(true);
 setTimeout(() => {
 setMencari(false);
 const nextCari = {...sudahCari, [aktif.id]: true };
 setSudahCari(nextCari);
 update({...data, sudahCari: nextCari });
 }, 900);
 };

 const pilih = (field: 'sumberJelas' | 'bolehDigunakan', val: boolean) => {
 if (jawab[field]!== undefined) return;
 const nextHasil = {...hasil, [aktif.id]: {...jawab, [field]: val } };
 update({...data, hasil: nextHasil });
 };

 const setAlasan = (val: string) => {
 const nextHasil = {...hasil, [aktif.id]: {...jawab, alasan: val } };
 update({...data, hasil: nextHasil });
 };

 const pindah = (n: number) => {
 const next = Math.max(0, Math.min(HASIL_GAMBAR.length - 1, n));
 setIdx(next);
 update({...data, idx: next });
 };

 return (
 <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">
 Aktivitas 1
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Berburu Sumber Gambar
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Kamu akan berlatih mencari gambar di internet dan mencatat sumbernya. Tugasmu bukan asal
 mengambil gambar, melainkan belajar <b>menghargai pembuat karya</b>. Ingat, tidak semua
 gambar di internet boleh dipakai sesuka hati!
 </p>
 </div>

 {/* Panduan singkat */}
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
 <p className="text-xs font-bold text-emerald-700 mb-1.5"> Gambar lebih aman jika:</p>
 <ul className="text-[11px] text-emerald-700 space-y-1 leading-relaxed list-disc pl-4">
 <li>sumber website-nya jelas;</li>
 <li>ada nama pembuat atau pemilik gambar;</li>
 <li>sesuai dengan tugas sekolah;</li>
 <li>tidak ada kekerasan atau hal tak pantas;</li>
 <li>kamu mencantumkan sumbernya.</li>
 </ul>
 </div>
 <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3.5">
 <p className="text-xs font-bold text-rose-700 mb-1.5"> Jangan dipakai dulu jika:</p>
 <ul className="text-[11px] text-rose-700 space-y-1 leading-relaxed list-disc pl-4">
 <li>sumbernya tidak jelas;</li>
 <li>tidak ada nama website;</li>
 <li>diambil dari akun orang lain tanpa keterangan;</li>
 <li>meminta kamu masuk akun atau isi data pribadi;</li>
 <li>kamu ragu apakah boleh digunakan.</li>
 </ul>
 </div>
 </div>

 {/* Progress + poin */}
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-primary-600">
 Gambar {idx + 1}/{HASIL_GAMBAR.length}
 </span>
 <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
 {poin} poin
 </span>
 </div>

 {/* Kotak pencarian ala mesin pencari */}
 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm">
 <span className="text-sm text-slate-700 flex-1 truncate">{aktif.keyword}</span>
 <button
 onClick={mulaiCari}
 disabled={mencari || sudahCariIni}
 className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600"
 >
 {mencari? 'Mencari…': sudahCariIni? 'Selesai': 'Cari'}
 </button>
 </div>

 {mencari && (
 <p className="text-xs text-slate-400 text-center animate-pulse py-4">
 Sedang mencari gambar di internet…
 </p>
 )}

 {sudahCariIni &&!mencari && (
 <div className="bg-white rounded-2xl border border-slate-100 p-3.5 animate-pop-in space-y-2.5">
 <GambarHasil src={aktif.imageSrc} emoji={aktif.fallbackEmoji} alt={aktif.keyword} />
 <div className="text-[11px] text-slate-600 space-y-1">
 <p>
 <b> Gambar tentang:</b> {aktif.tentang}
 </p>
 <p>
 <b> Nama website/sumber:</b> {aktif.sumber}
 </p>
 </div>
 </div>
 )}

 {!sudahCariIni &&!mencari && (
 <p className="text-xs text-slate-400 text-center py-4">
 Tekan tombol <b>Cari</b> untuk menemukan gambarnya.
 </p>
 )}
 </div>

 {/* Pertanyaan keputusan */}
 {sudahCariIni &&!mencari && (
 <div className="space-y-3 animate-pop-in">
 <div className="space-y-1.5">
 <p className="text-sm font-bold text-primary-700">1. Apakah sumbernya jelas?</p>
 <div className="flex gap-2">
 {[
 { val: true, label: ' Jelas' },
 { val: false, label: ' Tidak Jelas' },
 ].map((o) => (
 <button
 key={String(o.val)}
 onClick={() => pilih('sumberJelas', o.val)}
 disabled={jawab.sumberJelas!== undefined}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 jawab.sumberJelas === o.val
? o.val === aktif.sumberJelas
? 'bg-emerald-500 border-emerald-500 text-white'
: 'bg-rose-500 border-rose-500 text-white'
: 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50 disabled:opacity-50'
 }`}
 >
 {o.label}
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-1.5">
 <p className="text-sm font-bold text-primary-700">2. Boleh langsung digunakan?</p>
 <div className="flex gap-2">
 {[
 { val: true, label: ' Boleh' },
 { val: false, label: ' Tidak Boleh' },
 ].map((o) => (
 <button
 key={String(o.val)}
 onClick={() => pilih('bolehDigunakan', o.val)}
 disabled={jawab.bolehDigunakan!== undefined}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 jawab.bolehDigunakan === o.val
? o.val === aktif.bolehDigunakan
? 'bg-emerald-500 border-emerald-500 text-white'
: 'bg-rose-500 border-rose-500 text-white'
: 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50 disabled:opacity-50'
 }`}
 >
 {o.label}
 </button>
 ))}
 </div>
 </div>

 {terkunci && (
 <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3.5 animate-pop-in space-y-2">
 <p className="text-[12px] text-orange-700 leading-relaxed">
 <b>Alasannya:</b> {aktif.alasan}
 </p>
 <div className="space-y-1">
 <label className="text-[11px] font-bold text-primary-600">
 Tulis alasanmu sendiri (opsional):
 </label>
 <input
 value={jawab.alasan || ''}
 onChange={(e) => setAlasan(e.target.value)}
 placeholder="Menurutku gambar ini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none text-sm"
 />
 </div>
 </div>
 )}
 </div>
 )}

 {/* Navigasi */}
 <div className="flex justify-between">
 <button
 onClick={() => pindah(idx - 1)}
 disabled={idx === 0}
 className="px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50"
 >
 ← Sebelumnya
 </button>
 <button
 onClick={() => pindah(idx + 1)}
 disabled={idx === HASIL_GAMBAR.length - 1}
 className="px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50"
 >
 Lanjut →
 </button>
 </div>

 {semuaSelesai && (
 <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-4 text-center animate-pop-in">
 <p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-700">
 {poin >= maksPoin - 1? 'Sangat baik': poin >= maksPoin / 2? 'Cukup baik': 'Perlu latihan'}
 </p>
 <p className="text-sm font-bold text-orange-700">
 Skor Berburu Gambar: {poin}/{maksPoin}
 </p>
 <p className="text-[11px] text-orange-600 mt-1">
 {poin >= maksPoin - 1
? 'Hebat! Kamu jeli memeriksa sumber gambar sebelum menggunakannya.'
: 'Bagus! Ingat selalu cek sumber gambar sebelum memakainya, ya.'}
 </p>
 </div>
 )}

 <p className="text-[11px] text-slate-400 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 2 — BOLEH ATAU TIDAK BOLEH? (Gamifikasi)
 "Hakim Karya" — putuskan tiap situasi
 ══════════════════════════════════════════════════ */

interface SituasiKarya {
 id: string;
 teks: string;
 jawaban: 'boleh' | 'tidak';
 alasan: string;
}

const SITUASI_KARYA: SituasiKarya[] = [
 {
 id: 's1',
 teks: 'Mira memakai gambar dari internet dan menulis sumbernya di bawah poster.',
 jawaban: 'boleh',
 alasan: 'Mira jujur dan menghargai pembuat karya dengan mencantumkan sumbernya.',
 },
 {
 id: 's2',
 teks: 'Bima menyalin cerita dari blog dan mengaku itu ceritanya sendiri.',
 jawaban: 'tidak',
 alasan: 'Bima melakukan plagiarisme karena mengaku karya orang lain sebagai miliknya.',
 },
 {
 id: 's3',
 teks: 'Naya membuat poster sendiri, tetapi melihat contoh dari internet sebagai inspirasi.',
 jawaban: 'boleh',
 alasan: 'Mencari inspirasi itu boleh, asalkan karya akhirnya dibuat sendiri.',
 },
 {
 id: 's4',
 teks: 'Raka mengunggah ulang video orang lain tanpa izin.',
 jawaban: 'tidak',
 alasan: 'Mengunggah ulang karya orang lain tanpa izin melanggar hak cipta pembuatnya.',
 },
 {
 id: 's5',
 teks: 'Siti memakai musik dari internet untuk video tugas tanpa tahu pemiliknya.',
 jawaban: 'tidak',
 alasan: 'Kalau tidak tahu pemiliknya dan tidak ada izin, sebaiknya jangan dipakai dulu.',
 },
 {
 id: 's6',
 teks: 'Danu menuliskan "Sumber: YouTube" tanpa menulis nama video atau pembuatnya.',
 jawaban: 'tidak',
 alasan: 'Sumber yang baik harus jelas: ada nama pembuat dan judul karya, bukan hanya nama platform.',
 },
 {
 id: 's7',
 teks: 'Lina memotret gambar buatannya sendiri dan menulis namanya sebagai pembuat.',
 jawaban: 'boleh',
 alasan: 'Itu memang karya Lina sendiri, jadi ia berhak menuliskan namanya sebagai pembuat.',
 },
];

export function Topik7Aktivitas2({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);

 const update = (next: Record<string, any>) => {
 setData(next);
 onSave?.(next);
 };

 const keputusan: Record<string, 'boleh' | 'tidak'> = data.keputusan || {};
 const alasan: Record<string, string> = data.alasan || {};
 const dinilai = Object.keys(keputusan).length;
 const benar = SITUASI_KARYA.filter((s) => keputusan[s.id] === s.jawaban).length;
 const selesai = dinilai === SITUASI_KARYA.length;

 const pilih = (id: string, val: 'boleh' | 'tidak') => {
 if (keputusan[id]) return;
 update({...data, keputusan: {...keputusan, [id]: val } });
 };

 const setAlasan = (id: string, val: string) => {
 update({...data, alasan: {...alasan, [id]: val } });
 };

 return (
 <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">
 Aktivitas 2
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Boleh atau Tidak Boleh?
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Kerjakan secara mandiri. Jadilah <b>Hakim Karya</b> yang adil! Baca tiap situasi, lalu
 ketuk palu keputusanmu: <b>Boleh</b> atau <b>Tidak Boleh</b>. Ingat, kita harus jujur dan
 tidak mengaku karya orang lain sebagai karya sendiri.
 </p>
 </div>

 {/* Contoh */}
 <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
 <p className="text-[11px] font-bold text-slate-500 mb-1"> Contoh:</p>
 <p className="text-xs text-slate-600 leading-relaxed">
 "Rani mengambil poster orang lain, lalu mengganti nama pembuatnya dengan namanya sendiri."
 <br />
 <span className="font-bold text-rose-600">→ Tidak Boleh.</span> Karena Rani mengaku karya
 orang lain sebagai karya sendiri.
 </p>
 </div>

 {/* Skor */}
 <div className="flex items-center justify-end">
 <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
 {benar} keputusan tepat
 </span>
 </div>

 {/* Daftar situasi */}
 <div className="space-y-3">
 {SITUASI_KARYA.map((s, i) => {
 const pilihan = keputusan[s.id];
 const sudah =!!pilihan;
 const tepat = pilihan === s.jawaban;
 return (
 <div
 key={s.id}
 className={`rounded-2xl border p-3.5 transition-all ${
!sudah
? 'border-slate-200 bg-white'
: tepat
? 'border-emerald-200 bg-emerald-50'
: 'border-rose-200 bg-rose-50'
 }`}
 >
 <p className="text-sm text-slate-700 leading-snug">
 <span className="font-bold text-slate-400 mr-1">{i + 1}.</span>
 {s.teks}
 </p>

 <div className="flex gap-2 mt-3">
 <button
 onClick={() => pilih(s.id, 'boleh')}
 disabled={sudah}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 pilihan === 'boleh'
? 'bg-emerald-500 border-emerald-500 text-white'
: 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50'
 }`}
 >
 Boleh
 </button>
 <button
 onClick={() => pilih(s.id, 'tidak')}
 disabled={sudah}
 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
 pilihan === 'tidak'
? 'bg-rose-500 border-rose-500 text-white'
: 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50'
 }`}
 >
 Tidak Boleh
 </button>
 </div>

 {sudah && (
 <div className="animate-pop-in mt-2.5 space-y-2">
 <p
 className={`text-[11px] leading-relaxed ${
 tepat? 'text-emerald-700': 'text-rose-700'
 }`}
 >
 {tepat? ' Tepat! ': ' Belum tepat. '}
 {s.alasan}
 </p>
 <input
 value={alasan[s.id] || ''}
 onChange={(e) => setAlasan(s.id, e.target.value)}
 placeholder=" Tulis alasanmu sendiri (opsional)..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-orange-400 focus:outline-none text-xs"
 />
 </div>
 )}
 </div>
 );
 })}
 </div>

 {selesai && (
 <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-4 text-center animate-pop-in">
 <p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-700">
 {benar >= 6? 'Sangat baik': benar >= 4? 'Cukup baik': 'Perlu latihan'}
 </p>
 <p className="text-sm font-bold text-orange-700">
 Skor Hakim Karya: {benar}/{SITUASI_KARYA.length}
 </p>
 <p className="text-[11px] text-orange-600 mt-1">
 {benar >= 6
? 'Luar biasa! Kamu adil dan paham aturan menggunakan karya orang lain.'
: 'Bagus! Ayo cermati lagi mana yang jujur dan mana yang melanggar.'}
 </p>
 </div>
 )}

 <p className="text-[11px] text-slate-400 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 3 — LATIHAN MENULIS KREDIT KARYA (Gamifikasi)
 "Penulis Kredit" — susun kredit yang benar
 Setiap soal memiliki studi kasus kontekstual
 ══════════════════════════════════════════════════ */

interface KreditItem {
 id: string;
 karya: string;
 studiKasus: string;
 labelTugas: string;
 sumberPilihan: string[];
 sumberBenar: string;
 /** 3 field kredit: siapa, apa, dimana */
 kreditSiapa: string;
 kreditApa: string;
 kreditDimana: string;
 contohKreditLengkap: string;
 mockupType: 'news' | 'instagram' | 'gov' | 'govwisata' | 'sketchbook';
}

const KREDIT_ITEMS: KreditItem[] = [
  {
    id: 'kr1',
    karya: 'Foto Banjir Sungai Sawang',
    labelTugas: '📚 Tugas IPS — Bencana Alam di Indonesia',
    studiKasus:
      'Minggu ini, Bu Guru IPS memberi tugas membuat kliping tentang bencana alam di Indonesia. Setiap siswa harus mencari berita terbaru tentang bencana yang pernah terjadi di daerahnya atau daerah lain. Deni memilih untuk menuliskan tentang banjir yang pernah terjadi di Sungai Sawang, Jambi. Ia membuka situs berita Kompas.com dan menemukan sebuah artikel berjudul "Banjir Rendam Pemukiman Warga di Sekitar Sungai Sawang, Jambi" lengkap dengan foto banjir yang diambil oleh wartawan Kompas. Deni ingin menggunakan foto tersebut agar kliping tugasnya terlihat lengkap dan informatif. Namun, Deni bingung bagaimana cara menulis sumber foto yang benar agar tidak dianggap mengaku karya orang lain.',
    sumberPilihan: ['Kompas.com', 'Kamera HP sendiri', 'Buku cetak IPS'],
    sumberBenar: 'Kompas.com',
    kreditSiapa: 'Wartawan Kompas',
    kreditApa: 'Foto "Banjir Sungai Sawang"',
    kreditDimana: 'Kompas.com',
    contohKreditLengkap: 'Foto "Banjir Sungai Sawang" oleh Wartawan Kompas, dari Kompas.com',
    mockupType: 'news',
  },
  {
    id: 'kr2',
    karya: 'Foto Air Terjun Pancaro Rayo',
    labelTugas: '📝 Tugas Bahasa Indonesia — Cover Karangan',
    studiKasus:
      'Deni sedang membuat karangan berjudul "Liburanku di Alam Terbuka" untuk tugas Bahasa Indonesia. Bu Guru meminta setiap siswa menambahkan gambar cover yang menarik agar karangan terlihat rapi dan bagus. Deni teringat pernah melihat foto air terjun yang sangat indah saat membuka Instagram. Ia mencari kembali dan menemukan foto Air Terjun Pancaro Rayo, Kerinci, Jambi yang diposting oleh akun @abrardqdr. Di caption-nya tertulis: "Keindahan alam Kerinci yang luar biasa! Silakan dipakai untuk tugas sekolah, tag akunku ya! 🌿" Deni ingin menggunakan foto tersebut sebagai cover karangan, tetapi ia perlu tahu bagaimana cara menuliskan sumber gambar yang diambil dari Instagram agar tidak melanggar hak cipta pemiliknya.',
    sumberPilihan: ['Instagram @abrardqdr', 'Google Images (tanpa sumber)', 'Buku paket'],
    sumberBenar: 'Instagram @abrardqdr',
    kreditSiapa: '@abrardqdr',
    kreditApa: 'Foto "Air Terjun Pancaro Rayo"',
    kreditDimana: 'Instagram (@abrardqdr)',
    contohKreditLengkap: 'Foto "Air Terjun Pancaro Rayo" oleh @abrardqdr, dari Instagram',
    mockupType: 'instagram',
  },
  {
    id: 'kr3',
    karya: 'Logo Tut Wuri Handayani',
    labelTugas: '🏫 Tugas PKN — Kliping Lambang Negara',
    studiKasus:
      'Pak Guru PKN meminta siswa membuat kliping tentang lambang-lambang penting di Indonesia. Setiap siswa boleh memilih lambang apa saja, misalnya Garuda Pancasila, logo kementerian, atau lambang daerah. Deni memilih untuk menampilkan logo Tut Wuri Handayani yang merupakan logo resmi Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen). Ia membuka situs resmi kemendikdasmen.go.id dan menemukan logo tersebut di halaman profil kementerian. Deni mengunduh logo itu untuk ditempelkan di kliping tugasnya. Karena logo ini adalah milik resmi pemerintah, Deni harus menulis sumber dengan jelas agar orang tahu dari mana logo itu berasal.',
    sumberPilihan: ['kemendikdasmen.go.id', 'Blog pribadi seseorang', 'Gambar dari Pinterest'],
    sumberBenar: 'kemendikdasmen.go.id',
    kreditSiapa: 'Kemendikdasmen RI',
    kreditApa: 'Logo "Tut Wuri Handayani"',
    kreditDimana: 'kemendikdasmen.go.id',
    contohKreditLengkap: 'Logo "Tut Wuri Handayani" oleh Kemendikdasmen RI, dari kemendikdasmen.go.id',
    mockupType: 'gov',
  },
  {
    id: 'kr4',
    karya: 'Foto Wisata Danau Letang',
    labelTugas: '🌿 Tugas IPS — Wisata Daerah Batanghari',
    studiKasus:
      'Bu Guru IPS memberi tugas kepada siswa untuk membuat poster tentang potensi wisata di daerah Jambi. Deni memilih untuk membahas tentang Danau Letang yang terletak di Kabupaten Batanghari. Ia mencari informasi dan menemukan foto Danau Letang yang sangat indah di situs resmi Pemerintah Kabupaten Batanghari (batangharikab.go.id). Website tersebut mempromosikan wisata alam Danau Letang lengkap dengan foto pemandangan danaunya yang dikelilingi pepohonan hijau. Deni ingin menggunakan foto tersebut untuk poster tugasnya agar terlihat menarik dan menunjukkan keindahan alam Batanghari. Namun, karena foto itu bukan miliknya, Deni perlu menuliskan sumber gambar dengan benar.',
    sumberPilihan: ['batangharikab.go.id', 'Kamera HP sendiri', 'Screenshot video YouTube'],
    sumberBenar: 'batangharikab.go.id',
    kreditSiapa: 'Pemerintah Kab. Batanghari',
    kreditApa: 'Foto "Wisata Danau Letang"',
    kreditDimana: 'batangharikab.go.id',
    contohKreditLengkap: 'Foto "Wisata Danau Letang" oleh Pemkab Batanghari, dari batangharikab.go.id',
    mockupType: 'govwisata',
  },
  {
    id: 'kr5',
    karya: 'Komik Pendek "Pergi Sekolah"',
    labelTugas: '✏️ Tugas SBdP — Membuat Komik Cerita Sederhana',
    studiKasus:
      'Bu Guru Seni Budaya meminta setiap siswa membuat komik pendek tentang kehidupan sehari-hari. Setiap siswa bebas memilih cerita apa saja, asalkan berisi pesan yang baik. Deni memilih cerita tentang perjalanan ke sekolah setiap pagi. Ia menggambar komik berjudul "Pergi Sekolah" di kertas gambar A4 menggunakan pensil dan spidol warna. Semua karakter, latar belakang, dan dialog dalam komik itu ia buat sendiri dari imajinasinya tanpa meniru gambar orang lain. Karena komik ini adalah karya asli Deni, ia berhak menulis namanya sendiri sebagai pembuat. Ini berbeda dari soal-soal sebelumnya karena gambar ini bukan diambil dari internet, melainkan buatan sendiri.',
    sumberPilihan: ['Buatan sendiri (karya asli)', 'Canva premium', 'Diunduh dari internet'],
    sumberBenar: 'Buatan sendiri (karya asli)',
    kreditSiapa: 'Deni (pembuat)',
    kreditApa: 'Komik "Pergi Sekolah"',
    kreditDimana: 'Karya sendiri (bukan dari internet)',
    contohKreditLengkap: 'Komik "Pergi Sekolah" dibuat oleh Deni (karya sendiri)',
    mockupType: 'sketchbook',
  },
];

/* ---------- Mockup Components ---------- */

function MockupBerita() {
  const [gagal, setGagal] = useState(false);
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Browser chrome */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-white rounded-full px-2.5 py-0.5 text-[8px] text-slate-400 font-mono truncate border border-slate-200">
          🔒 https://www.kompas.com/regional/banjir-sungai-sawang-jambi
        </div>
      </div>
      {/* Site header */}
      <div className="bg-red-700 px-3 py-1.5 flex items-center justify-between">
        <span className="text-[10px] font-black text-white tracking-wider">KOMPAS.com</span>
        <div className="flex gap-2 text-[8px] text-red-200">
          <span>Berita</span><span>Regional</span><span>Video</span>
        </div>
      </div>
      {/* Article body */}
      <div className="p-3 space-y-2">
        <p className="text-[8px] text-red-600 font-bold uppercase">BENCANA ALAM · JAMBI</p>
        <h5 className="text-[12px] font-black text-slate-900 leading-tight">Banjir Rendam Pemukiman Warga di Sekitar Sungai Sawang, Jambi</h5>
        <p className="text-[8px] text-slate-400">Senin, 15 Januari 2024 · 09:30 WIB</p>
        {!gagal ? (
          <div className="w-full rounded-lg border border-slate-200 overflow-hidden aspect-[16/9]">
            <img
              src="/gambar/topik 7/banjirr.jpeg"
              alt="Banjir Sungai Sawang Jambi"
              onError={() => setGagal(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg border border-blue-200 flex flex-col items-center justify-center">
            <span className="text-4xl">🌊🏘️</span>
            <span className="text-[8px] font-bold text-blue-700 mt-1">[ Foto Banjir Sungai Sawang ]</span>
          </div>
        )}
        <p className="text-[8px] text-slate-500 italic">Foto: Wartawan Kompas / Kompas.com</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-[9px] text-amber-800">
          💡 <b>Kenapa Deni mengambil foto ini?</b> Untuk melengkapi tugas kliping IPS tentang bencana alam yang terjadi di daerah Jambi.
        </div>
      </div>
    </div>
  );
}

function MockupInstagram() {
  const [gagal, setGagal] = useState(false);
  return (
    <div className="w-full max-w-xs mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* IG header */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[8px] font-black text-purple-700">A</div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-900 leading-none">abrardqdr</p>
            <p className="text-[8px] text-slate-400 leading-none mt-0.5">📍 Air Terjun Pancaro Rayo, Kerinci, Jambi</p>
          </div>
        </div>
        <span className="text-slate-400 font-bold text-sm">•••</span>
      </div>
      {/* IG Image */}
      {!gagal ? (
        <div className="w-full relative aspect-square">
          <img
            src="/gambar/topik 7/air terjun.jpeg"
            alt="Air Terjun Pancaro Rayo"
            onError={() => setGagal(true)}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1.5 left-2 bg-black/50 text-white text-[7px] px-1.5 py-0.5 rounded font-medium">📸 @abrardqdr</span>
        </div>
      ) : (
        <div className="w-full aspect-square bg-gradient-to-br from-emerald-100 via-cyan-50 to-blue-100 flex flex-col items-center justify-center relative">
          <span className="text-5xl">🏞️💧✨</span>
          <span className="text-[9px] font-bold text-emerald-800 mt-1">[ Foto Air Terjun Pancaro Rayo ]</span>
          <span className="absolute bottom-1.5 left-2 bg-black/50 text-white text-[7px] px-1.5 py-0.5 rounded font-medium">📸 @abrardqdr</span>
        </div>
      )}
      {/* IG Actions */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-3 text-[13px]">
          <span>❤️</span><span>💬</span><span>📤</span>
          <span className="ml-auto">🔖</span>
        </div>
        <p className="text-[9px] text-slate-800"><b>289 suka</b></p>
        <p className="text-[9px] text-slate-700 leading-snug">
          <b>@abrardqdr</b> Keindahan alam Kerinci yang luar biasa! Air Terjun Pancaro Rayo ini tersembunyi di tengah hutan Kerinci, Jambi 🌿 Silakan dipakai untuk tugas sekolah, tag akunku ya! #airterjun #kerinci #jambi #pancararayo
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-[9px] text-purple-800 mt-1">
          💡 <b>Kenapa Deni mengambil foto ini?</b> Untuk dijadikan cover karangan Bahasa Indonesia berjudul "Liburanku di Alam Terbuka".
        </div>
      </div>
    </div>
  );
}

function MockupGov() {
  const [gagal, setGagal] = useState(false);
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Browser chrome */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-white rounded-full px-2.5 py-0.5 text-[8px] text-slate-400 font-mono truncate border border-slate-200">
          🔒 https://www.kemendikdasmen.go.id/profil/logo
        </div>
      </div>
      {/* Gov nav */}
      <div className="bg-blue-900 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🇮🇩</span>
          <span className="text-[9px] font-bold text-white">KEMENDIKDASMEN RI</span>
        </div>
        <div className="flex gap-2 text-[7px] text-blue-200">
          <span>Beranda</span><span>Profil</span><span>Layanan</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 space-y-2">
        <h5 className="text-[11px] font-black text-slate-800">Logo Tut Wuri Handayani</h5>
        <p className="text-[8px] text-slate-500">Logo resmi Kementerian Pendidikan Dasar dan Menengah Republik Indonesia</p>
        {!gagal ? (
          <div className="w-full rounded-lg border border-sky-200 overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center p-3">
            <img
              src="/gambar/topik 7/tut wuri.png"
              alt="Logo Tut Wuri Handayani Kemendikdasmen"
              onError={() => setGagal(true)}
              className="max-w-full max-h-28 object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-28 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg border border-sky-200 flex flex-col items-center justify-center">
            <span className="text-4xl">🎓📘🇮🇩</span>
            <span className="text-[8px] font-bold text-sky-800 mt-1">[ Logo Tut Wuri Handayani ]</span>
          </div>
        )}
        <p className="text-[8px] text-slate-500 italic">Sumber: Kemendikdasmen RI · Halaman resmi profil kementerian</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-[9px] text-blue-800">
          💡 <b>Kenapa Deni mengambil logo ini?</b> Untuk kliping tugas PKN tentang lambang-lambang penting negara Indonesia.
        </div>
      </div>
    </div>
  );
}

function MockupGovWisata() {
  const [gagal, setGagal] = useState(false);
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Browser chrome */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-white rounded-full px-2.5 py-0.5 text-[8px] text-slate-400 font-mono truncate border border-slate-200">
          🔒 https://www.batangharikab.go.id/wisata/danau-letang
        </div>
      </div>
      {/* Gov nav */}
      <div className="bg-emerald-800 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🏛️</span>
          <span className="text-[9px] font-bold text-white">PEMKAB BATANGHARI</span>
        </div>
        <div className="flex gap-2 text-[7px] text-emerald-200">
          <span>Beranda</span><span>Wisata</span><span>Berita</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">WISATA ALAM</span>
          <span className="text-[8px] text-slate-400">Kabupaten Batanghari, Jambi</span>
        </div>
        <h5 className="text-[12px] font-black text-slate-900 leading-tight">Danau Letang — Pesona Alam Tersembunyi di Batanghari</h5>
        {!gagal ? (
          <div className="w-full rounded-lg border border-emerald-200 overflow-hidden aspect-[16/9]">
            <img
              src="/gambar/topik 7/danau letang.jpeg"
              alt="Wisata Danau Letang Batanghari"
              onError={() => setGagal(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] bg-gradient-to-br from-emerald-100 to-teal-50 rounded-lg border border-emerald-200 flex flex-col items-center justify-center">
            <span className="text-4xl">🏞️🌿💧</span>
            <span className="text-[8px] font-bold text-emerald-800 mt-1">[ Foto Danau Letang ]</span>
          </div>
        )}
        <p className="text-[8px] text-slate-500 italic">Foto: Dinas Pariwisata Kab. Batanghari / batangharikab.go.id</p>
        <p className="text-[9px] text-slate-600 leading-snug">
          Danau Letang merupakan salah satu destinasi wisata alam unggulan di Kabupaten Batanghari, Provinsi Jambi. Dikelilingi oleh pepohonan hijau dan suasana yang asri, danau ini menjadi tempat favorit warga untuk berekreasi.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[9px] text-emerald-800">
          💡 <b>Kenapa Deni mengambil foto ini?</b> Untuk poster tugas IPS tentang potensi wisata di daerah Jambi.
        </div>
      </div>
    </div>
  );
}

function MockupSketchbook() {
  const [gagal, setGagal] = useState(false);
  return (
    <div className="w-full bg-amber-50/50 border border-amber-200 rounded-xl overflow-hidden shadow-sm relative">
      {/* Spiral binding */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-slate-300 border-r border-slate-400 flex flex-col justify-evenly items-center py-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-slate-400 border border-slate-500" />
        ))}
      </div>
      {/* Page content */}
      <div className="pl-5 pr-3 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Kertas Gambar A4</p>
          <span className="text-[8px] text-slate-400 font-mono">SBdP · Kelas VI</span>
        </div>
        {!gagal ? (
          <div className="bg-white rounded-lg border border-slate-200 p-2 overflow-hidden">
            <img
              src="/gambar/topik 7/komik pergi sekolah.png"
              alt="Komik Pergi Sekolah oleh Deni"
              onError={() => setGagal(true)}
              className="w-full max-h-48 object-contain rounded"
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[4/3] border-2 border-dashed border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center bg-slate-50/50">
                <span className="text-2xl">🧒🗯️</span>
                <span className="text-[7px] text-slate-500 font-bold mt-1">"Halo, aku Deni!"</span>
              </div>
              <div className="aspect-[4/3] border-2 border-dashed border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center bg-slate-50/50">
                <span className="text-2xl">🏫🎒🌤️</span>
                <span className="text-[7px] text-slate-500 font-bold mt-1">Berangkat Sekolah</span>
              </div>
            </div>
          </div>
        )}
        <p className="text-[10px] font-bold text-slate-700 text-center mt-2">
          Komik "Pergi Sekolah" oleh Deni · Karya Sendiri
        </p>
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-2 text-[9px] text-amber-800">
          💡 <b>Kenapa Deni membuat ini?</b> Untuk tugas SBdP membuat komik cerita sederhana. Semua gambar dan cerita ia buat sendiri dari imajinasinya.
        </div>
      </div>
    </div>
  );
}

/* ---------- Render Mockup by Type ---------- */

function RenderMockup({ type }: { type: KreditItem['mockupType'] }) {
  switch (type) {
    case 'news': return <MockupBerita />;
    case 'instagram': return <MockupInstagram />;
    case 'gov': return <MockupGov />;
    case 'govwisata': return <MockupGovWisata />;
    case 'sketchbook': return <MockupSketchbook />;
    default: return null;
  }
}

/* ---------- Main Component ---------- */

function cekKreditUtuh(id: string, text: string): { valid: boolean; pesan: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, pesan: 'Kolom kredit utuh belum diisi.' };
  }
  const t = text.toLowerCase();
  
  // Format check: must contain open and close parentheses (Sumber: ...)
  if (!t.includes('(') || !t.includes(')')) {
    return { valid: false, pesan: 'Gunakan tanda kurung (...) untuk menuliskan sumbernya.' };
  }
  if (!t.includes('sumber:')) {
    return { valid: false, pesan: 'Pastikan ada tulisan "Sumber:" di dalam kurung.' };
  }

  switch (id) {
    case 'kr1':
      if (!t.includes('banjir') && !t.includes('sawang')) {
        return { valid: false, pesan: 'Judul karya (Banjir Sungai Sawang) harus dicantumkan.' };
      }
      if (!t.includes('kompas')) {
        return { valid: false, pesan: 'Sumber media (Kompas.com) harus dicantumkan.' };
      }
      if (!t.includes('2024')) {
        return { valid: false, pesan: 'Tahun terbit karya (2024) harus dicantumkan.' };
      }
      break;
    case 'kr2':
      if (!t.includes('air') && !t.includes('terjun') && !t.includes('pancaro')) {
        return { valid: false, pesan: 'Judul foto (Air Terjun Pancaro Rayo) harus dicantumkan.' };
      }
      if (!t.includes('instagram') && !t.includes('abrardqdr')) {
        return { valid: false, pesan: 'Sumber Instagram dan akun pembuat (@abrardqdr) harus dicantumkan.' };
      }
      if (!t.includes('2023')) {
        return { valid: false, pesan: 'Tahun terbit karya (2023) harus dicantumkan.' };
      }
      break;
    case 'kr3':
      if (!t.includes('tut') && !t.includes('wuri') && !t.includes('handayani') && !t.includes('logo')) {
        return { valid: false, pesan: 'Nama logo (Logo Tut Wuri Handayani) harus dicantumkan.' };
      }
      if (!t.includes('kemendikdasmen') && !t.includes('kemendikdasmen.go.id')) {
        return { valid: false, pesan: 'Pembuat/Sumber (Kemendikdasmen RI / kemendikdasmen.go.id) harus dicantumkan.' };
      }
      if (!t.includes('2024')) {
        return { valid: false, pesan: 'Tahun terbit/akses (2024) harus dicantumkan.' };
      }
      break;
    case 'kr4':
      if (!t.includes('danau') && !t.includes('letang') && !t.includes('wisata')) {
        return { valid: false, pesan: 'Judul foto (Wisata Danau Letang) harus dicantumkan.' };
      }
      if (!t.includes('batanghari') && !t.includes('pemkab') && !t.includes('batangharikab.go.id')) {
        return { valid: false, pesan: 'Pembuat/Sumber (Pemkab Batanghari / batangharikab.go.id) harus dicantumkan.' };
      }
      if (!t.includes('2024')) {
        return { valid: false, pesan: 'Tahun terbit/akses (2024) harus dicantumkan.' };
      }
      break;
    case 'kr5':
      if (!t.includes('pergi') && !t.includes('sekolah') && !t.includes('komik')) {
        return { valid: false, pesan: 'Judul komik (Komik Pergi Sekolah) harus dicantumkan.' };
      }
      if (!t.includes('deni') && !t.includes('sendiri') && !t.includes('pribadi') && !t.includes('dokumentasi')) {
        return { valid: false, pesan: 'Keterangan pembuat (Deni / Karya Sendiri) harus dicantumkan.' };
      }
      if (!t.includes('2024')) {
        return { valid: false, pesan: 'Tahun pembuatan (2024) harus dicantumkan.' };
      }
      break;
  }
  return { valid: true, pesan: 'Kredit karya utuhmu sudah lengkap dan benar! Keren!' };
}

export function Topik7Aktivitas3({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, any>>(answers);
  const [activeIdx, setActiveIdx] = useState<number>(answers.activeIdx || 0);

  const update = (next: Record<string, any>) => {
    setData(next);
    onSave?.(next);
  };

  const sumber: Record<string, string> = data.sumber || {};
  const kredit: Record<string, any> = data.kredit || {};

  const sumberBenarCount = KREDIT_ITEMS.filter((k) => sumber[k.id] === k.sumberBenar).length;
  const kreditTerisi = KREDIT_ITEMS.filter((k) => {
    const kr = kredit[k.id];
    return (
      kr &&
      typeof kr === 'object' &&
      typeof kr.siapa === 'string' && kr.siapa.trim().length > 0 &&
      typeof kr.apa === 'string' && kr.apa.trim().length > 0 &&
      typeof kr.dimana === 'string' && kr.dimana.trim().length > 0 &&
      typeof kr.utuh === 'string' && cekKreditUtuh(k.id, kr.utuh).valid
    );
  }).length;
  const selesai = sumberBenarCount === KREDIT_ITEMS.length && kreditTerisi === KREDIT_ITEMS.length;

  const pilihSumber = (id: string, val: string) => {
    update({ ...data, sumber: { ...sumber, [id]: val } });
  };

  const setKreditField = (id: string, field: 'siapa' | 'apa' | 'dimana' | 'utuh', val: string) => {
    const prevRaw = kredit[id];
    const prev = prevRaw && typeof prevRaw === 'object' ? prevRaw : { siapa: '', apa: '', dimana: '', utuh: '' };
    update({ ...data, kredit: { ...kredit, [id]: { ...prev, [field]: val } } });
  };

  const pindah = (n: number) => {
    const next = Math.max(0, Math.min(KREDIT_ITEMS.length - 1, n));
    setActiveIdx(next);
    update({ ...data, activeIdx: next });
  };

  const activeIdxSafe = Math.max(0, Math.min(KREDIT_ITEMS.length - 1, activeIdx));
  const aktif = KREDIT_ITEMS[activeIdxSafe];
  const sumberDipilih = sumber[aktif.id];
  const sumberTepat = sumberDipilih === aktif.sumberBenar;

  const rawKredit = kredit[aktif.id];
  const kreditAktif = rawKredit && typeof rawKredit === 'object'
    ? {
        siapa: typeof rawKredit.siapa === 'string' ? rawKredit.siapa : '',
        apa: typeof rawKredit.apa === 'string' ? rawKredit.apa : '',
        dimana: typeof rawKredit.dimana === 'string' ? rawKredit.dimana : '',
        utuh: typeof rawKredit.utuh === 'string' ? rawKredit.utuh : '',
      }
    : { siapa: '', apa: '', dimana: '', utuh: '' };

  const kreditLengkap = !!(kreditAktif.siapa.trim() && kreditAktif.apa.trim() && kreditAktif.dimana.trim());

  return (
    <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">
          Aktivitas 3
        </span>
        <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
          Latihan Menulis Kredit Karya
        </h3>
        <p className="text-sm text-primary-500 mt-2 leading-relaxed">
          Kredit karya adalah keterangan yang menunjukkan <b>siapa pembuat karya</b>, <b>apa nama karyanya</b>, dan <b>di mana kamu menemukannya</b>. Baca cerita Deni di setiap soal, pahami <b>kenapa</b> ia mengambil gambar itu, lalu bantu ia menulis kredit yang lengkap!
        </p>
      </div>

      {/* ===== PETUNJUK MENULIS KREDIT ===== */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">📋</span>
          <h4 className="text-xs font-black text-violet-900 uppercase tracking-wider">Petunjuk Menulis Kredit Karya</h4>
        </div>
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Agar kredit karya <b>lengkap dan benar</b>, pastikan kamu menuliskan <b>tiga hal penting</b> ini:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-violet-200 bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-black text-violet-700">1</span>
              <p className="text-[11px] font-black text-violet-800">👤 SIAPA</p>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              Nama pembuat atau pemilik karya.
            </p>
            <p className="text-[9px] text-violet-600 italic">
              Contoh: Kak Rian, Kemkes RI, @potret_alam
            </p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-black text-violet-700">2</span>
              <p className="text-[11px] font-black text-violet-800">📄 APA</p>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              Judul atau nama karyanya.
            </p>
            <p className="text-[9px] text-violet-600 italic">
              Contoh: Foto "Kucing Oren", Gambar "Hutan Hijau"
            </p>
          </div>
          <div className="rounded-xl border border-violet-200 bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[11px] font-black text-violet-700">3</span>
              <p className="text-[11px] font-black text-violet-800">🌐 DI MANA</p>
            </div>
            <p className="text-[10px] text-slate-600 leading-snug">
              Nama situs atau alamat asalnya.
            </p>
            <p className="text-[9px] text-violet-600 italic">
              Contoh: Pixabay.com, kemkes.go.id
            </p>
          </div>
        </div>

        {/* Petunjuk khusus Instagram */}
        <div className="rounded-xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📸</span>
            <p className="text-[11px] font-black text-pink-800">Cara Menulis Kredit dari Instagram</p>
          </div>
          <p className="text-[10px] text-slate-700 leading-relaxed">
            Jika kamu mengambil gambar dari <b>Instagram</b>, tuliskan kredit seperti ini:
          </p>
          <div className="bg-white border border-pink-100 rounded-lg p-2.5 text-[10px] text-slate-800 font-medium">
            <p>👤 <b>Siapa:</b> Nama akun Instagram (contoh: <span className="text-pink-700">@budi_petualang</span>)</p>
            <p>📄 <b>Apa:</b> Judul foto/gambar (contoh: <span className="text-pink-700">Foto "Pemandangan Gunung"</span>)</p>
            <p>🌐 <b>Di mana:</b> Tulis <span className="text-pink-700">Instagram (@budi_petualang)</span></p>
          </div>
          <p className="text-[9px] text-pink-600 italic">
            Contoh lengkap: Foto "Pemandangan Gunung" oleh @budi_petualang, dari Instagram
          </p>
        </div>
      </div>

      {/* Contoh kredit — collapsible */}
      <details className="rounded-2xl border border-orange-100 bg-orange-50/50 overflow-hidden group">
        <summary className="px-3.5 py-2.5 cursor-pointer text-[11px] font-bold text-orange-700 flex items-center gap-1.5 hover:bg-orange-100/50 transition-colors">
          <span className="group-open:rotate-90 transition-transform text-[9px]">▶</span>
          💡 Lihat Contoh Kredit Karya & Sitasi Standar
        </summary>
        <div className="px-3.5 pb-3 space-y-2">
          <div className="grid sm:grid-cols-2 gap-3 text-[10px] text-slate-600 leading-relaxed">
            <div>
              <p className="font-bold text-slate-700 mb-1">Gaya Sederhana (Sekolah Dasar):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Foto "Kucing Oren" oleh Kak Rian, dari Pixabay.com</li>
                <li>Foto oleh: Dokumentasi pribadi (karya sendiri)</li>
                <li>Logo "Palang Merah" oleh PMI Indonesia, dari pmi.or.id</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-1">Gaya Resmi (Nasional / APA 7):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Nasional</strong>: Gambar 1. Ilustrasi (Sumber: Kemkes RI, 2024)</li>
                <li><strong>APA 7th</strong>: <em>Note</em>. From <em>Illustration</em>, by Kemkes RI, 2024.</li>
              </ul>
            </div>
          </div>
        </div>
      </details>

      {/* Progress bar & score */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {KREDIT_ITEMS.map((k, i) => {
            const kr = kredit[k.id];
            const krIsObj = kr && typeof kr === 'object';
            const done = !!(sumber[k.id] === k.sumberBenar &&
              krIsObj &&
              typeof kr.siapa === 'string' && kr.siapa.trim() &&
              typeof kr.apa === 'string' && kr.apa.trim() &&
              typeof kr.dimana === 'string' && kr.dimana.trim() &&
              typeof kr.utuh === 'string' && cekKreditUtuh(k.id, kr.utuh).valid);
           return (
             <button
               key={k.id}
               onClick={() => pindah(i)}
               className={`h-2 w-8 rounded-full transition-all ${
                 done
                   ? 'bg-emerald-400'
                   : i === activeIdx
                   ? 'bg-orange-400'
                   : 'bg-orange-200 hover:bg-orange-300'
               }`}
             />
           );
         })}
       </div>
       <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
         {sumberBenarCount}/{KREDIT_ITEMS.length} sumber tepat
       </span>
     </div>

     {/* ===== SOAL AKTIF ===== */}
     <div className="space-y-4 animate-pop-in" key={aktif.id}>
       {/* Label tugas */}
       <div className="flex items-center justify-between flex-wrap gap-2">
         <span className="text-xs font-bold text-primary-700">
           Soal {activeIdx + 1} dari {KREDIT_ITEMS.length}
         </span>
         <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
           {aktif.labelTugas}
         </span>
       </div>

       {/* ---- Studi Kasus Narasi ---- */}
       <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 p-4 space-y-2">
         <div className="flex items-center gap-1.5">
           <span className="text-base">📖</span>
           <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Cerita Deni</h4>
         </div>
         <p className="text-[11.5px] text-slate-700 leading-relaxed">
           {aktif.studiKasus}
         </p>
       </div>

       {/* ---- Mockup Visual ---- */}
       <div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
           👁️ Tampilan Sumber yang Deni Lihat:
         </p>
         <RenderMockup type={aktif.mockupType} />
       </div>

       {/* ---- Pertanyaan 1: Dari mana sumbernya? ---- */}
       <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
         <p className="text-xs font-bold text-primary-700">
           ❓ Dari mana Deni mendapatkan gambar "{aktif.karya}" ini?
         </p>
         <div className="flex flex-wrap gap-2">
           {aktif.sumberPilihan.map((opt) => {
             const dipilih = sumberDipilih === opt;
             const benar = opt === aktif.sumberBenar;
             let style = 'bg-white border-slate-200 text-slate-600 hover:bg-orange-50 hover:border-orange-200';
             if (dipilih) {
               style = benar
                 ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                 : 'bg-rose-500 border-rose-500 text-white shadow-sm';
             }
             return (
               <button
                 key={opt}
                 onClick={() => pilihSumber(aktif.id, opt)}
                 disabled={sumberDipilih !== undefined}
                 className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all disabled:opacity-60 ${style}`}
               >
                 {opt}
               </button>
             );
           })}
         </div>
         {sumberDipilih && sumberTepat && (
           <p className="text-[10px] text-emerald-700 animate-pop-in">
             ✅ Tepat! Gambar ini memang berasal dari <b>{aktif.sumberBenar}</b>.
           </p>
         )}
         {sumberDipilih && !sumberTepat && (
           <p className="text-[10px] text-rose-600 animate-pop-in">
             ❌ Kurang tepat. Sumber yang benar: <b>{aktif.sumberBenar}</b>.
           </p>
         )}
       </div>

       {/* ---- Pertanyaan 2: Tulis kredit lengkap (Siapa, Apa, Di mana) ---- */}
       <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-3">
         <label className="text-xs font-bold text-primary-700 block">
           ✏️ Sekarang, bantu Deni menuliskan kredit karyanya secara lengkap:
         </label>

         {/* Siapa */}
         <div className="space-y-1">
           <div className="flex items-center gap-1.5">
             <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[9px] font-black text-violet-700">1</span>
             <label className="text-[11px] font-bold text-violet-800">👤 Siapa pembuat/pemilik karyanya?</label>
           </div>
           <input
             value={kreditAktif.siapa}
             onChange={(e) => setKreditField(aktif.id, 'siapa', e.target.value)}
             placeholder="Tulis nama pembuat, fotografer, atau organisasi"
             className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-violet-400 placeholder:text-slate-300"
           />
         </div>

         {/* Apa */}
         <div className="space-y-1">
           <div className="flex items-center gap-1.5">
             <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[9px] font-black text-violet-700">2</span>
             <label className="text-[11px] font-bold text-violet-800">📄 Apa judul atau nama karyanya?</label>
           </div>
           <input
             value={kreditAktif.apa}
             onChange={(e) => setKreditField(aktif.id, 'apa', e.target.value)}
             placeholder="Tulis judul atau deskripsi singkat karya"
             className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-violet-400 placeholder:text-slate-300"
           />
         </div>

         {/* Di mana */}
         <div className="space-y-1">
           <div className="flex items-center gap-1.5">
             <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[9px] font-black text-violet-700">3</span>
             <label className="text-[11px] font-bold text-violet-800">🌐 Di mana kamu menemukannya? (nama situs/alamat)</label>
           </div>
           <input
             value={kreditAktif.dimana}
             onChange={(e) => setKreditField(aktif.id, 'dimana', e.target.value)}
             placeholder="Tulis nama website atau platform asal (mis. nasa.gov / Freepik)"
             className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-violet-400 placeholder:text-slate-300"
           />
         </div>
         
         {/* Preview kredit lengkap */}
         {kreditLengkap && (
            <div className="bg-white border border-emerald-200 rounded-xl p-3 animate-pop-in space-y-1.5">
              <p className="text-[10px] font-bold text-emerald-700">✅ Hasil Pengelompokan Elemen:</p>
              <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                <p className="text-[10px] text-slate-800 font-medium leading-relaxed">
                  Elemen terpisah: {kreditAktif.apa} oleh {kreditAktif.siapa}, dari {kreditAktif.dimana}
                </p>
              </div>
            </div>
          )}

          {/* 4. Tulis Kredit Karya Utuh (Atribusi Gabungan) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[9px] font-black text-violet-700">4</span>
              <label className="text-[11px] font-bold text-violet-800">✍️ Tuliskan Kredit Karya Secara Utuh (Atribusi Gabungan):</label>
            </div>
            <p className="text-[10px] text-slate-500 italic mb-1">
              Rangkai elemen di atas ke dalam kalimat utuh. Contoh format: <b>Judul Karya (Sumber: Platform Akun/Pembuat, Tahun)</b>
            </p>
            <input
              value={kreditAktif.utuh}
              onChange={(e) => setKreditField(aktif.id, 'utuh', e.target.value)}
              placeholder="Contoh: Poster Hemat Energi (Sumber: Instagram @budicreative, 2023)"
              className="w-full px-3 py-2 bg-white border border-violet-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-violet-400 placeholder:text-slate-300"
            />
            {kreditAktif.utuh.trim().length > 0 && (() => {
              const res = cekKreditUtuh(aktif.id, kreditAktif.utuh);
              return (
                <p className={`text-[10px] font-semibold mt-1.5 animate-pop-in ${res.valid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {res.valid ? '✅' : '⚠️'} {res.pesan}
                </p>
              );
            })()}
          </div>
        </div>
      </div>

     {/* Navigasi soal */}
     <div className="flex justify-between">
       <button
         onClick={() => pindah(activeIdx - 1)}
         disabled={activeIdx === 0}
         className="px-4 py-2 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50 transition-colors"
       >
         ← Sebelumnya
       </button>
       <button
         onClick={() => pindah(activeIdx + 1)}
         disabled={activeIdx === KREDIT_ITEMS.length - 1}
         className="px-4 py-2 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white disabled:opacity-40 hover:bg-orange-50 transition-colors"
       >
         Soal Berikutnya →
       </button>
     </div>

     {selesai && (
       <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 p-4 text-center animate-pop-in">
         <p className="text-sm font-bold text-orange-700">🎉 Kredit Karya Lengkap!</p>
         <p className="text-[11px] text-orange-600 mt-1">
           Hebat! Kamu sudah membantu Deni menuliskan kredit lengkap (Siapa, Apa, Di mana) untuk semua gambar yang ia gunakan. Sikap jujur dan menghargai pembuat karya itu penting!
         </p>
       </div>
     )}

     <p className="text-[11px] text-slate-400 italic">
       Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
     </p>
   </div>
 );
}

/* ══════════════════════════════════════════════════
 SIMULASI (IMPROVED) — MENGGUNAKAN KONTEN DENGAN
 BERTANGGUNG JAWAB 
 Petualangan 4 misi: Pilih sumber → Cek lisensi →
 Tulis kredit → Putuskan tindakan. Bergaya alur cerita.
 ══════════════════════════════════════════════════ */

type MisiTipe = 'pilih' | 'kredit';

interface MisiSim {
 id: string;
 babak: string;
 emoji: string;
 judul: string;
 cerita: string;
 tipe: MisiTipe;
 // untuk tipe 'pilih'
 pertanyaan?: string;
 opsi?: { id: string; teks: string; benar: boolean; umpan: string }[];
 // untuk tipe 'kredit'
 prefix?: string;
 kataKunci?: string[]; // kata yang sebaiknya muncul pada kredit
 contoh?: string;
}

const MISI_SIM: MisiSim[] = [
 {
 id: 'm1',
 babak: 'Misi 1',
  emoji: '🔎',
 judul: 'Pilih Sumber yang Tepat',
 cerita:
 'Kamu membuat poster tentang menjaga lingkungan. Kamu butuh gambar pohon. Dari mana sebaiknya kamu mengambilnya?',
 tipe: 'pilih',
 pertanyaan: 'Pilih sumber gambar yang paling aman digunakan:',
 opsi: [
 {
 id: 'a',
 teks: 'Situs gambar gratis berlisensi bebas (mis. Freepik) yang mencantumkan nama pembuat.',
 benar: true,
 umpan: 'Tepat! Situs berlisensi bebas memang disediakan untuk dipakai, asalkan kita cantumkan sumbernya.',
 },
 {
 id: 'b',
 teks: 'Screenshot dari akun media sosial orang lain tanpa izin.',
 benar: false,
 umpan: 'Kurang tepat. Mengambil dari akun orang lain tanpa izin melanggar hak pembuatnya.',
 },
 {
 id: 'c',
 teks: 'Gambar dari blog acak yang tidak ada nama pembuatnya.',
 benar: false,
 umpan: 'Kurang tepat. Sumber yang tidak jelas sebaiknya dihindari.',
 },
 ],
 },
 {
 id: 'm2',
 babak: 'Misi 2',
  emoji: '©️',
 judul: 'Periksa Lisensi',
 cerita:
 'Gambar pohon yang kamu pilih memiliki tanda "Creative Commons (CC BY)". Apa artinya tanda ini?',
 tipe: 'pilih',
 pertanyaan: 'Apa arti lisensi CC BY?',
 opsi: [
 {
 id: 'a',
 teks: 'Boleh dipakai gratis, asalkan mencantumkan nama pembuatnya.',
 benar: true,
 umpan: 'Benar! CC BY artinya bebas dipakai selama kamu menuliskan nama pembuat aslinya.',
 },
 {
 id: 'b',
 teks: 'Tidak boleh dipakai sama sekali.',
 benar: false,
 umpan: 'Bukan. CC BY justru memperbolehkan penggunaan, hanya perlu atribusi.',
 },
 {
 id: 'c',
 teks: 'Harus membayar dulu sebelum dipakai.',
 benar: false,
 umpan: 'Bukan. Lisensi CC BY tidak meminta bayaran, cukup mencantumkan pembuat.',
 },
 ],
 },
 {
 id: 'm3',
 babak: 'Misi 3',
  emoji: '📝',
 judul: 'Tulis Kredit Karya',
 cerita:
 'Sekarang saatnya menuliskan kredit untuk gambar pohon yang dibuat oleh "Andi" dan kamu ambil dari Freepik.',
 tipe: 'kredit',
 prefix: 'Sumber gambar:',
 kataKunci: ['andi', 'freepik'],
 contoh: 'Gambar pohon oleh Andi, dari www.freepik.com',
 },
 {
 id: 'm4',
 babak: 'Misi 4',
  emoji: '✅',
 judul: 'Ambil Keputusan',
 cerita:
 'Temanmu menyarankan, "Hapus saja nama Andi, biar terlihat seperti kamu yang membuat." Apa keputusanmu?',
 tipe: 'pilih',
 pertanyaan: 'Bagaimana sikapmu yang bertanggung jawab?',
 opsi: [
 {
 id: 'a',
 teks: 'Menolak. Aku tetap mencantumkan nama Andi sebagai pembuat asli.',
 benar: true,
 umpan: 'Hebat! Kamu jujur dan menghargai karya orang lain. Itulah sikap pengguna konten yang bertanggung jawab.',
 },
 {
 id: 'b',
 teks: 'Setuju. Menghapus nama Andi agar terlihat seperti karyaku.',
 benar: false,
 umpan: 'Itu plagiarisme. Menghapus nama pembuat dan mengaku karya orang lain itu tidak jujur.',
 },
 {
 id: 'c',
 teks: 'Membiarkan tanpa menulis sumber apa pun.',
 benar: false,
 umpan: 'Kurang tepat. Tanpa kredit, kita tidak menghargai pembuat aslinya.',
 },
 ],
 },
];

export function Topik7SimKonten({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);
 const [step, setStep] = useState<number>(answers.step || 0);

 const update = (next: Record<string, any>) => {
 setData(next);
 onSave?.(next);
 };

 const hasil: Record<string, { jawaban?: string; benar?: boolean; kredit?: string }> =
 data.hasil || {};
 const misi = MISI_SIM[step];
 const jawabMisi = hasil[misi.id] || {};

 const skor = MISI_SIM.reduce((acc, m) => (hasil[m.id]?.benar? acc + 1: acc), 0);
 const selesai = MISI_SIM.every((m) => hasil[m.id]?.benar!== undefined);

 const pilihOpsi = (opsiId: string, benar: boolean) => {
 if (jawabMisi.jawaban!== undefined) return;
 const nextHasil = {...hasil, [misi.id]: {...jawabMisi, jawaban: opsiId, benar } };
 update({...data, hasil: nextHasil });
 };

 const setKredit = (val: string) => {
 update({...data, hasil: {...hasil, [misi.id]: {...jawabMisi, kredit: val } } });
 };

 const cekKredit = () => {
 const teks = (jawabMisi.kredit || '').toLowerCase();
 const lolos = (misi.kataKunci || []).every((kw) => teks.includes(kw));
 const nextHasil = {...hasil, [misi.id]: {...jawabMisi, benar: lolos } };
 update({...data, hasil: nextHasil });
 };

  const kembali = () => {
    const prev = Math.max(0, step - 1);
    setStep(prev);
    update({ ...data, step: prev });
  };

 const lanjut = () => {
 const next = Math.min(MISI_SIM.length - 1, step + 1);
 setStep(next);
 update({...data, step: next });
 };

 const sudahJawab = misi.tipe === 'pilih'? jawabMisi.jawaban!== undefined: jawabMisi.benar!== undefined;
 const bolehLanjut = sudahJawab && step < MISI_SIM.length - 1;

 return (
 <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div className="flex items-start justify-between gap-3">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">
 Simulasi Penutup
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Menggunakan Konten dengan Bertanggung Jawab
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Jadilah <b>Pelindung Karya</b>! Selesaikan 4 misi: pilih sumber yang tepat, periksa
 lisensi, tulis kredit, dan ambil keputusan yang jujur.
 </p>
 </div>
 </div>

 {/* Progress misi */}
 <div className="flex items-center justify-between">
 <div className="flex gap-1.5">
 {MISI_SIM.map((m, i) => (
  <button
  key={m.id}
  type="button"
  onClick={() => {
    setStep(i);
    update({ ...data, step: i });
  }}
  className={`h-2 w-8 rounded-full transition-all ${
  hasil[m.id]?.benar
? 'bg-emerald-400'
: i === step
? 'bg-orange-400'
: 'bg-orange-200 hover:bg-orange-300'
  }`}
  />
 ))}
 </div>
 <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-white text-orange-600 rounded-full border border-orange-200">
 {skor}/{MISI_SIM.length}
 </span>
 </div>

 {/* Kartu misi */}
 <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm space-y-3 animate-pop-in" key={misi.id}>
 <div className="flex items-center gap-2">
 <span className="text-3xl">{misi.emoji}</span>
 <div>
 <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">{misi.babak}</p>
 <p className="text-sm font-bold text-primary-800">{misi.judul}</p>
 </div>
 </div>

 <p className="text-sm text-slate-700 leading-relaxed bg-orange-50/60 rounded-xl p-3">
 {misi.cerita}
 </p>

 {/* Tipe PILIH */}
 {misi.tipe === 'pilih' && (
 <div className="space-y-2">
 <p className="text-xs font-bold text-primary-700">{misi.pertanyaan}</p>
 {misi.opsi!.map((o) => {
 const dipilih = jawabMisi.jawaban === o.id;
 const terkunci = jawabMisi.jawaban!== undefined;
 let style = 'bg-white border-slate-200 text-slate-700 hover:bg-orange-50';
 if (terkunci) {
 if (o.benar) style = 'bg-emerald-50 border-emerald-300 text-emerald-800';
 else if (dipilih) style = 'bg-rose-50 border-rose-300 text-rose-800';
 else style = 'bg-white border-slate-200 text-slate-400 opacity-60';
 }
 return (
 <button
 key={o.id}
 onClick={() => pilihOpsi(o.id, o.benar)}
 disabled={terkunci}
 className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${style}`}
 >
 {o.teks}
 </button>
 );
 })}
 {jawabMisi.jawaban!== undefined && (
 <p
 className={`text-[11px] leading-relaxed animate-pop-in mt-1 ${
 jawabMisi.benar? 'text-emerald-700': 'text-rose-700'
 }`}
 >
 {jawabMisi.benar? ' ': ' '}
 {misi.opsi!.find((o) => o.id === jawabMisi.jawaban)?.umpan}
 </p>
 )}
 </div>
 )}

 {/* Tipe KREDIT */}
 {misi.tipe === 'kredit' && (
 <div className="space-y-2">
 <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
 <span className="text-[11px] font-bold text-orange-600 shrink-0">{misi.prefix}</span>
 <input
 value={jawabMisi.kredit || ''}
 onChange={(e) => setKredit(e.target.value)}
 disabled={jawabMisi.benar}
 placeholder={`mis. ${misi.contoh}`}
 className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none disabled:opacity-70"
 />
 </div>
 {jawabMisi.benar === undefined? (
 <button
 onClick={cekKredit}
 disabled={!(jawabMisi.kredit || '').trim()}
 className="w-full py-2 rounded-xl text-xs font-bold bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600"
 >
 Periksa Kredit
 </button>
 ): jawabMisi.benar? (
 <p className="text-[11px] text-emerald-700 animate-pop-in">
 Kredit lengkap! Kamu mencantumkan nama pembuat dan sumbernya. Hebat!
 </p>
 ): (
 <div className="space-y-2 animate-pop-in">
 <p className="text-[11px] text-rose-700">
 Kreditnya belum lengkap. Pastikan ada <b>nama pembuat (Andi)</b> dan{' '}
 <b>sumber (Freepik)</b>. Contoh: "{misi.contoh}".
 </p>
 <button
 onClick={() =>
 update({...data, hasil: {...hasil, [misi.id]: { kredit: jawabMisi.kredit } } })
 }
 className="text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-200 text-orange-600 bg-white hover:bg-orange-50"
 >
 Coba Lagi
 </button>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Navigasi / Selesai */}
	<div className="flex justify-between items-center pt-2">
		<button
			type="button"
			onClick={kembali}
			disabled={step === 0}
			className="px-4 py-2.5 rounded-xl text-xs font-bold border border-orange-200 text-orange-600 bg-white hover:bg-orange-50 disabled:opacity-40 disabled:hover:bg-white transition-all"
		>
			← Misi Sebelumnya
		</button>

		{step < MISI_SIM.length - 1 ? (
			<button
				type="button"
				onClick={lanjut}
				disabled={!bolehLanjut}
				className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40 transition-all"
			>
				Misi Berikutnya →
			</button>
		) : (
			<span className="text-xs font-bold text-orange-600/80 italic">Misi Terakhir</span>
		)}
	</div>

	{selesai && (
		<div className="rounded-2xl bg-white border border-orange-200 p-5 text-center animate-pop-in space-y-3">
			<div>
				<p className="mb-1 text-sm font-bold uppercase tracking-wide text-orange-700">
					{skor === MISI_SIM.length ? 'Sangat baik' : skor >= 2 ? 'Cukup baik' : 'Perlu latihan'}
				</p>
				<p className="text-sm font-bold text-orange-700">
					Misi Selesai! Skor Pelindung Karya: {skor}/{MISI_SIM.length}
				</p>
				<p className="text-[11px] text-orange-600 mt-1 max-w-sm mx-auto leading-relaxed">
					{skor === MISI_SIM.length
						? 'Sempurna! Kamu sudah bisa menggunakan konten digital dengan jujur dan bertanggung jawab.'
						: 'Bagus! Ingat untuk selalu memilih sumber yang jelas, cek lisensi, dan mencantumkan kredit.'}
				</p>
			</div>
			<div className="flex flex-wrap justify-center items-center gap-2">
				<div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full">
					<span className="text-xs font-bold text-orange-600">Lencana: Pelindung Karya</span>
				</div>
				<button
					type="button"
					onClick={() => {
						const resetHasil = {};
						update({ ...data, step: 0, hasil: resetHasil });
						setStep(0);
					}}
					className="px-4 py-2 rounded-full text-xs font-bold border border-orange-200 text-orange-600 bg-white hover:bg-orange-50 transition-all"
				>
					Ulangi Simulasi 🔄
				</button>
			</div>
		</div>
	)}

	<p className="text-[11px] text-orange-400/80 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>
 </div>
 );
}




