import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Play, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityProps {
 answers?: Record<string, any>;
 onSave?: (val: Record<string, any>) => void;
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 1 — Cerita: Foto yang Disebarkan
 (Mengenali peran: Pelaku, Korban, Penonton, Penolong)
 ══════════════════════════════════════════════════ */

interface ChatLine {
 n: string;
 t: string;
 warna: string;
 buruk?: boolean;
 emojiOnly?: boolean;
 baik?: boolean;
}

const CHAT_FOTO: ChatLine[] = [
 { n: 'Riko', t: 'Lihat Edo jatuh tadi. Lucu banget! ', warna: 'text-amber-600', buruk: true },
 { n: 'Fajar', t: 'Hahaha!', warna: 'text-indigo-600', buruk: true },
 { n: 'Tio', t: 'Waduh, memalukan sekali.', warna: 'text-purple-600', buruk: true },
 { n: 'Gita', t: '', warna: 'text-rose-600', buruk: true, emojiOnly: true },
 { n: 'Edo', t: '...', warna: 'text-slate-500' },
 { n: 'Naya', t: 'Teman-teman, jangan sebarkan foto Edo. Edo mungkin merasa malu.', warna: 'text-emerald-600', baik: true },
 { n: 'Bima', t: 'Iya, sebaiknya fotonya dihapus. Kita tidak boleh menyebarkan foto teman tanpa izin.', warna: 'text-sky-600', baik: true },
];

const PERAN_OPSI = ['Pelaku', 'Korban', 'Penonton', 'Penolong'];

const TOKOH_PERAN: { id: string; nama: string; aksi: string; locked?: { peran: string; alasan: string } }[] = [
 {
 id: 'edo',
 nama: 'Edo',
 aksi: 'Fotonya disebarkan dan ditertawakan.',
 locked: { peran: 'Korban', alasan: 'Edo menerima perlakuan yang membuatnya malu dan sedih.' },
 },
 { id: 'riko', nama: 'Riko', aksi: 'Mengambil foto Edo diam-diam lalu menyebarkannya ke grup kelas.' },
 { id: 'gita', nama: 'Gita', aksi: 'Mengirim emoji tertawa () menanggapi foto Edo.' },
 { id: 'tio', nama: 'Tio', aksi: 'Hanya membaca pesan di grup, tidak ikut mengejek tetapi juga belum membantu.' },
 { id: 'naya', nama: 'Naya', aksi: 'Mengingatkan teman-teman agar berhenti menyebarkan foto Edo.' },
 { id: 'bima', nama: 'Bima', aksi: 'Menghapus foto Edo dari HP-nya dan mengirim pesan pribadi yang menguatkan Edo.' },
];

const PIKIRKAN_Q = [
 'Bagaimana perasaan Edo saat fotonya disebarkan tanpa izin?',
 'Apa yang dilakukan Naya dan Bima sebagai penolong digital?',
 'Menurutmu, mengapa kita tidak boleh menyebarkan foto teman tanpa izin?',
 'Jika kamu ada di grup itu, apa yang akan kamu lakukan?',
];

export function Topik6Aktivitas1({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);
 const [showPreview, setShowPreview] = useState(false);

 const update = (key: string, value: any) => {
 const next = {...data, [key]: value };
 setData(next);
 onSave?.(next);
 };

 const setPeran = (id: string, field: 'peran' | 'alasan', value: string) => {
 const next = {...data, [id]: {...(data[id] || {}), [field]: value } };
 setData(next);
 onSave?.(next);
 };

 return (
 <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">
 Eksplorasi · Aktivitas 1
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Cerita: Foto yang Disebarkan
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Saat terjadi cyberbullying, ada beberapa peran yang dapat muncul: <b>pelaku</b>, <b>korban</b>,{' '}
 <b>penonton</b>, dan <b>penolong digital</b>. Bacalah cerita berikut dengan saksama, lalu tentukan peran
 setiap tokoh.
 </p>
 </div>

 {/* Narasi cerita */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center bg-gradient-to-br from-pink-50/40 via-white to-pink-100/10 border border-pink-100/80 rounded-[2rem] p-6 md:p-8 shadow-md">
 <div className="md:col-span-5 shrink-0 group">
 <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg">
 <img
 src="/cerita_pengantar.png"
 alt="Cerita Pengantar Edo Terpeleset"
 className="w-full h-auto max-h-64 object-cover"
 />
 <div className="absolute bottom-2 left-2 bg-pink-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
 Bacaan / Cerita Pengantar
 </div>
 </div>
 </div>
 <div className="md:col-span-7 space-y-4 text-sm text-slate-700 leading-relaxed">
 <p>
 Saat jam istirahat, <span className="font-bold text-pink-600">Edo</span> sedang berjalan menuju kantin bersama beberapa temannya. Halaman sekolah masih sedikit licin karena sebelumnya turun hujan. Edo tidak melihat ada genangan kecil di dekat tangga. Tiba-tiba, Edo terpeleset dan hampir jatuh.
 </p>
 
 <div className="flex items-center gap-3 bg-pink-50/60 border border-pink-100/50 rounded-2xl p-3.5 shadow-sm max-w-sm">
 <div>
 <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Naya</p>
 <p className="text-xs italic text-slate-700 leading-tight">“Edo, kamu tidak apa-apa?”</p>
 </div>
 </div>
 
 <p>
 <span className="font-bold text-pink-600">Edo</span> berdiri pelan sambil membersihkan celananya. Ia merasa malu karena beberapa teman menoleh ke arahnya. Edo sebenarnya tidak terluka, tetapi wajahnya terlihat tidak nyaman.
 </p>
 
 <p>
 Di dekat situ, <span className="font-bold text-rose-600">Riko</span> sempat mengambil foto Edo saat sedang terpeleset. Edo tidak tahu bahwa fotonya diambil. Setelah pulang sekolah, Riko mengirim foto itu ke grup kelas.
 </p>
 </div>
 </div>

 {/* ===== Mock HP WhatsApp ===== */}
 <div className="rounded-[1.75rem] border-[7px] border-slate-900 overflow-hidden shadow-2xl bg-[#e5ddd5] max-w-sm mx-auto">
<div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2.5">
<span className="text-lg leading-none">‹</span>
<div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
GK
</div>
<div className="flex-1 min-w-0">
<p className="text-sm font-bold truncate">Grup Kelas 5</p>
 <p className="text-[10px] text-white/70 truncate">28 anggota</p>
 </div>
 <span className="text-base">⋮</span>
 </div>
 <div
 className="p-3 space-y-1.5 min-h-[120px]"
 style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
 >
 {/* Foto yang dibagikan Riko */}
 <div className="flex">
 <div className="relative max-w-[80%] rounded-lg p-1.5 shadow-sm bg-white">
 <p className="text-[11px] font-bold text-amber-600 leading-tight px-1">Riko</p>
 <div 
 className="mt-1 w-44 rounded-md overflow-hidden border border-slate-100 cursor-zoom-in hover:scale-[1.02] active:scale-95 transition-transform bg-slate-50"
 onClick={() => setShowPreview(true)}
 >
 <img
 src="/edo_terpeleset.png"
 alt="Edo terpeleset"
 className="w-full h-28 object-cover"
 />
 <div className="p-1.5 bg-slate-50 text-[9px] font-bold text-slate-500 text-center border-t border-slate-100">
 Foto: Edo terpeleset
 </div>
 </div>
 <span className="block text-right text-[8px] text-slate-400 pr-1 mt-0.5">14.20</span>
 </div>
 </div>

 {CHAT_FOTO.map((m, i) => (
 <div key={i} className="flex">
 <div
 className={`relative max-w-[80%] rounded-lg px-2.5 py-1.5 shadow-sm ${
 m.buruk? 'bg-rose-50': m.baik? 'bg-emerald-50': 'bg-white'
 }`}
 >
 <p className={`text-[11px] font-bold ${m.warna} leading-tight`}>{m.n}</p>
 <p className={`leading-snug pr-8 ${m.emojiOnly? 'text-lg': 'text-[13px] text-slate-800'}`}>{m.t}</p>
 <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-400">14.2{i}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Lanjutan narasi */}
 <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 space-y-3 text-sm text-primary-700 leading-relaxed">
 <p>
 Edo membaca pesan-pesan itu, tetapi ia tidak membalas. Ia merasa malu dan sedih karena fotonya disebarkan
 tanpa izin. Edo juga takut teman-temannya akan terus menertawakannya keesokan hari.
 </p>
 <p>
 Naya merasa tidak nyaman melihat komentar teman-temannya. Ia tidak ikut memberi emoji tertawa. Naya menulis
 pesan agar teman-temannya berhenti menyebarkan foto Edo.
 </p>
 <p>
 Bima juga memilih membantu. Ia menghapus foto Edo yang sempat tersimpan di HP-nya. Setelah itu, Bima mengirim
 pesan pribadi kepada Edo: <i>“Edo, kamu baik-baik saja? Jangan sedih, ya. Menurutku foto itu sebaiknya tidak
 disebarkan.”</i>
 </p>
 <p>
 Beberapa teman lain hanya membaca pesan di grup. Mereka tidak ikut mengejek, tetapi juga belum membantu Edo.
 </p>
 <p>
 Dari cerita ini, kita bisa belajar bahwa menyebarkan foto teman tanpa izin dapat membuat teman merasa malu,
 sedih, atau tidak nyaman. Saat melihat hal seperti itu, kita bisa memilih menjadi <b>penolong digital</b>{' '}
 dengan cara tidak ikut mengejek, tidak menyebarkan foto, dan mengingatkan teman dengan sopan.
 </p>
 </div>

 {/* Catatan Penting */}
 <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-800 leading-relaxed">
 <b>Catatan Penting:</b> Contoh kalimat yang menyakiti dalam cerita ini hanya digunakan untuk belajar. Jangan
 ditiru saat menulis pesan kepada teman.
 </div>

 {/* Tabel Peran */}
 <div className="space-y-3">
 <p className="text-sm font-bold text-primary-700">
 Isilah tabel di bawah ini sesuai pendapatmu. Pilih peran: Pelaku, Korban, Penonton, atau Penolong.
 </p>
 <div className="space-y-3">
 {TOKOH_PERAN.map((tokoh) => {
 const locked = tokoh.locked;
 const cur = data[tokoh.id] || {};
 return (
 <div key={tokoh.id} className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/40 space-y-2.5">
 <div className="flex items-start gap-2">
 <span className="text-xs font-black text-pink-600 shrink-0">{tokoh.nama}</span>
 <span className="text-[11px] text-slate-500 italic">— {tokoh.aksi}</span>
 </div>

 {locked? (
 <div className="flex flex-wrap items-center gap-2">
 <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Perannya:</span>
 <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-600 border border-rose-200">
 {locked.peran}
 </span>
 <span className="text-[11px] text-slate-500">({locked.alasan})</span>
 <span className="text-[10px] text-slate-400"> contoh</span>
 </div>
 ): (
 <>
 <div className="flex flex-wrap gap-1.5">
 {PERAN_OPSI.map((p) => (
 <button
 key={p}
 onClick={() => setPeran(tokoh.id, 'peran', p)}
 className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
 cur.peran === p
? 'bg-pink-500 border-pink-500 text-white'
: 'bg-white border-slate-200 text-slate-600 hover:bg-pink-50'
 }`}
 >
 {p}
 </button>
 ))}
 </div>
 <input
 type="text"
 value={cur.alasan || ''}
 onChange={(e) => setPeran(tokoh.id, 'alasan', e.target.value)}
 placeholder="Tulis alasanmu memilih peran itu..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-pink-400 focus:outline-none text-xs"
 />
 </>
 )}
 </div>
 );
 })}
 </div>
 </div>

 {/* Ayo, Pikirkan! */}
 <div className="space-y-3 pt-1">
 <p className="text-sm font-bold text-primary-700"> Ayo, Pikirkan!</p>
 {PIKIRKAN_Q.map((q, i) => (
 <div key={i} className="space-y-1.5">
 <label className="text-xs font-bold text-primary-700">
 {i + 1}. {q}
 </label>
 <textarea
 value={data[`pikir_${i}`] || ''}
 onChange={(e) => update(`pikir_${i}`, e.target.value)}
 rows={2}
 placeholder="Tulis jawabanmu di sini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-pink-400 focus:outline-none text-sm resize-none"
 />
 </div>
 ))}
 </div>

 <p className="text-[11px] text-slate-400 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>

 {/* Modal Preview Foto */}
 {showPreview && (
 <div 
 className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4 cursor-pointer animate-fade-in"
 onClick={() => setShowPreview(false)}
 >
 <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
 <button 
 className="absolute top-4 right-4 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/60 transition-colors z-10 font-bold"
 onClick={() => setShowPreview(false)}
 >
 ✕
 </button>
 <img 
 src="/edo_terpeleset.png" 
 alt="Edo terpeleset" 
 className="w-full max-h-[70vh] object-contain rounded-2xl"
 />
 <div className="p-4 text-center">
 <p className="font-bold text-primary-800 text-base">Foto Edo Terpeleset</p>
 <p className="text-xs text-primary-500 mt-1">Foto ini diambil secara diam-diam oleh Riko dan disebarkan ke grup kelas tanpa izin Edo.</p>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 2 — Studi Kasus 1 & 2 + Bandingkan
 ══════════════════════════════════════════════════ */

const KASUS1_CHAT: ChatLine[] = [
 { n: 'Doni', t: 'Teman-teman, aku belum paham tugas halaman 12. Ada yang bisa bantu?', warna: 'text-slate-600' },
 { n: 'Riko', t: 'Masa itu saja tidak bisa? Gampang banget.', warna: 'text-amber-600', buruk: true },
 { n: 'Sinta', t: 'Jangan begitu, Ko. Mungkin Doni belum paham.', warna: 'text-emerald-600', baik: true },
 { n: 'Riko', t: 'Hahaha, Doni memang lambat sekali.', warna: 'text-amber-600', buruk: true },
 { n: 'Alya', t: 'Doni, bagian mana yang belum kamu pahami?', warna: 'text-sky-600', baik: true },
 { n: 'Bima', t: 'Aku kirim foto catatanku, ya. Semoga membantu.', warna: 'text-indigo-600', baik: true },
];

const KASUS1_Q = [
 'Siapa yang menulis pesan kurang baik?',
 'Pesan mana yang bisa membuat Doni malu atau sedih?',
 'Siapa yang menunjukkan sikap sebagai teman baik?',
 'Mengapa pesan Sinta, Alya, dan Bima termasuk baik?',
 'Apa yang sebaiknya dilakukan Riko?',
 'Jika kamu ada di grup itu, pesan apa yang akan kamu tulis?',
];

const KASUS2_KOMENTAR = [
 { u: 'naya', t: 'Keren, Raka! Kamu sudah berani tampil.', love: 86, baik: true },
 { u: 'farel', t: 'Suaramu kecil sekali. Jadi tidak jelas.', love: 2, buruk: true },
{ u: 'dina', t: 'Menurutku, lain kali bisa berbicara lebih pelan dan jelas. Semangat, ya!', love: 41, baik: true },
 { u: 'aldi', t: 'Hahaha, kamu kelihatan gugup banget. Malu-maluin.', love: 1, buruk: true },
 { u: 'mira', t: 'Aku suka puisinya. Terus latihan, ya!', love: 53, baik: true },
];

const KASUS2_Q = [
  'Komentar siapa yang membuat Raka merasa dihargai?',
  'Komentar siapa yang dapat membuat Raka sedih atau malu?',
  'Apakah komentar Farel termasuk kritik yang sopan? Jelaskan alasanmu.',
  'Komentar siapa yang memberi saran dengan cara baik?',
  'Apa perbedaan komentar Dina dan komentar Aldi?',
  'Jika kamu ingin memberi saran kepada Raka, komentar apa yang akan kamu tulis?',
];

const BANDINGKAN_Q = [
  'Apa persamaan masalah pada Studi Kasus 1 dan Studi Kasus 2?',
  'Apa akibatnya jika kita menulis komentar yang mengejek teman?',
  'Apa yang bisa dilakukan teman baik ketika melihat komentar yang menyakiti?',
  'Menurutmu, mengapa kita perlu berpikir sebelum mengirim pesan atau komentar?',
];

export function Topik6Aktivitas2({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, any>>(answers);
  const [showKomentar, setShowKomentar] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [slide, setSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlaying]);

  const update = (key: string, value: string) => {
    const next = { ...data, [key]: value };
    setData(next);
    onSave?.(next);
  };

  return (
    <div className="bg-white border border-pink-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500">
            Eksplorasi · Aktivitas 2
          </span>
          <h3 className="font-display font-bold text-base sm:text-lg text-primary-800 mt-0.5">
            Studi Kasus: Pesan & Komentar
          </h3>
        </div>

        {/* Slide controller */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            disabled={slide === 0}
            onClick={() => setSlide((s) => s - 1)}
            className="px-2.5 py-1 bg-slate-55 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none rounded-xl border border-slate-200 text-slate-600 transition-all font-bold text-xs"
            title="Sebelumnya"
          >
            ← Kasus Sebelumnya
          </button>
          <div className="flex gap-1.5 px-1">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  slide === idx ? 'w-6 bg-pink-500' : 'w-2.5 bg-slate-200'
                }`}
                title={`Halaman ${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={slide === 2}
            onClick={() => setSlide((s) => s + 1)}
            className="px-2.5 py-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-white font-bold text-xs shadow-sm transition-all"
            title="Berikutnya"
          >
            Kasus Berikutnya →
          </button>
        </div>
      </div>

      {/* Guide Box */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 space-y-1.5 leading-relaxed font-semibold text-left">
        <p className="flex items-center gap-1.5 text-amber-900 font-bold">
          👉 PANDUAN AKTIVITAS 2:
        </p>
        <p>
          Aktivitas ini terdiri dari <strong>3 halaman slide</strong>. Gunakan tombol di kanan atas:
          <span className="mx-1 px-2 py-0.5 bg-pink-500 text-white rounded font-bold text-[10px]">Kasus Berikutnya →</span> atau 
          <span className="mx-1 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded font-bold text-[10px]">← Kasus Sebelumnya</span> 
          untuk berpindah kasus. Jawab semua pertanyaan di setiap halaman, lalu bandingkan hasilnya di halaman terakhir!
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {slide === 0 && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wide">Studi Kasus 1 · Grup Kelas yang Tidak Nyaman</span>
                </div>
                <div className="p-4 space-y-4">
                  <div className="rounded-[1.5rem] border-[6px] border-slate-900 overflow-hidden shadow-xl bg-[#e5ddd5] max-w-sm mx-auto">
                    <div className="bg-[#075e54] text-white px-3 py-2 flex items-center gap-2.5">
                      <span className="text-lg leading-none">‹</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Grup Kelas 5</p>
                        <p className="text-[10px] text-white/70 truncate">28 anggota</p>
                      </div>
                      <span className="text-base">⋮</span>
                    </div>
                    <div
                      className="p-3 space-y-1.5 min-h-[100px]"
                      style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    >
                      {KASUS1_CHAT.map((m, i) => (
                        <div key={i} className="flex">
                          <div
                            className={`relative max-w-[80%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                              m.buruk ? 'bg-rose-50' : m.baik ? 'bg-emerald-50' : 'bg-white'
                            }`}
                          >
                            <p className={`text-[11px] font-bold ${m.warna} leading-tight`}>{m.n}</p>
                            <p className="text-[13px] text-slate-800 leading-snug pr-8">{m.t}</p>
                            <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-400">15.0{i}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {KASUS1_Q.map((q, i) => (
                      <div key={i} className="space-y-1.5">
                        <label className="text-xs font-bold text-primary-700">
                          {i + 1}. {q}
                        </label>
                        <textarea
                          value={data[`k1_${i}`] || ''}
                          onChange={(e) => update(`k1_${i}`, e.target.value)}
                          rows={2}
                          placeholder="Tulis jawabanmu..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-pink-400 focus:outline-none text-xs resize-none bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide === 1 && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wide">Studi Kasus 2 · Komentar pada Video Teman</span>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    Raka mengunggah video saat membaca puisi untuk tugas Bahasa Indonesia. Dalam video itu, Raka terlihat gugup.
                    Suaranya kadang pelan, tetapi ia tetap berusaha menyelesaikan puisinya sampai akhir.
                  </p>

                  <div className="mx-auto max-w-[280px] relative bg-black rounded-[2rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl select-none">
                    <div className="relative aspect-[9/16] bg-gradient-to-b from-slate-800 via-slate-900 to-black overflow-hidden">
                      <div className="absolute top-0 inset-x-0 flex justify-between items-center px-4 py-1.5 text-[9px] font-semibold text-white/80 z-20">
                        <span>09.41</span>
                      </div>
                      <video
                        ref={videoRef}
                        src="/gambar/topik 6/Menanggapi Ejekan Video Puisi.mp4"
                        autoPlay
                        loop
                        muted={muted}
                        playsInline
                        className="w-full h-full object-cover absolute inset-0 cursor-pointer"
                        onClick={() => setIsVideoPlaying((p) => !p)}
                      />

                      {!isVideoPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                          <div className="w-14 h-14 bg-black/45 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl">
                            <Play className="h-7 w-7 fill-white" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-12 px-3 py-1.5 bg-black/20 text-white z-10 pointer-events-none">
                        <p className="font-bold text-[10px] drop-shadow">Pembacaan Puisi </p>
                      </div>
                      <div className="absolute bottom-3 left-3 right-16 z-10">
                        <p className="text-white font-bold text-xs">@raka.belajar</p>
                        <p className="text-white/80 text-[10px] leading-snug mt-0.5">
                          Tugas puisi Bahasa Indonesia #tugassekolah #puisi
                        </p>
                      </div>
                      <div className="absolute bottom-3 right-2 flex flex-col items-center gap-3 z-10">
                        <button onClick={() => setLiked((v) => !v)} className="flex flex-col items-center text-white text-shadow">
                          <Heart className={`h-7 w-7 ${liked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                          <span className="text-[9px] font-semibold mt-0.5">{liked ? '321' : '320'}</span>
                        </button>
                        <button onClick={() => setShowKomentar(true)} className="flex flex-col items-center text-white text-shadow">
                          <MessageCircle className="h-7 w-7" />
                          <span className="text-[9px] font-semibold mt-0.5">{KASUS2_KOMENTAR.length}</span>
                        </button>
                        <button onClick={() => setMuted((m) => !m)} className="flex flex-col items-center text-white text-shadow active:scale-95 transition-transform">
                          {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
                          <span className="text-[9px] font-semibold mt-0.5">{muted ? 'Bisu' : 'Suara'}</span>
                        </button>
                      </div>

                      {showKomentar && (
                        <div className="absolute inset-0 z-30 flex flex-col justify-end">
                          <div className="absolute inset-0 bg-black/40" onClick={() => setShowKomentar(false)} />
                          <div className="relative bg-white rounded-t-2xl max-h-[80%] flex flex-col">
                            <div className="flex items-center justify-center relative px-4 py-2.5 border-b border-slate-100">
                              <span className="w-10 h-1 bg-slate-300 rounded-full absolute top-1 left-1/2 -translate-x-1/2" />
                              <p className="text-xs font-bold text-slate-700">{KASUS2_KOMENTAR.length} komentar</p>
                              <button onClick={() => setShowKomentar(false)} className="absolute right-3 text-slate-400 text-lg leading-none">✕</button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 bg-white">
                              {KASUS2_KOMENTAR.map((c, i) => (
                                <div key={i} className="flex items-start gap-2 text-left">
                                  <div className="w-7 h-7 rounded-full bg-slate-350 bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
                                    {c.u.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-550 text-slate-500">@{c.u}</p>
                                    <p className="text-xs text-slate-800 leading-snug">{c.t}</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Balas</p>
                                  </div>
                                  <div className="flex flex-col items-center text-slate-400 shrink-0">
                                    <span className="text-[9px]">{c.love}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-center text-[11px] text-slate-500 mt-1 bg-pink-50/50 py-1.5 rounded-xl border border-pink-100/50 max-w-[280px] mx-auto font-medium">
                    👉 <strong>Instruksi</strong>: Ketuk ikon 💬 <strong>komentar</strong> putih di samping kanan layar HP untuk membaca komentar teman-teman Raka.
                  </p>

                  <div className="space-y-3 pt-1">
                    {KASUS2_Q.map((q, i) => (
                      <div key={i} className="space-y-1.5">
                        <label className="text-xs font-bold text-primary-700">
                          {i + 1}. {q}
                        </label>
                        <textarea
                          value={data[`k2_${i}`] || ''}
                          onChange={(e) => update(`k2_${i}`, e.target.value)}
                          rows={2}
                          placeholder="Tulis jawabanmu..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-pink-400 focus:outline-none text-xs resize-none bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide === 2 && (
            <div className="space-y-4">
              <div className="border border-pink-200 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wide">Ayo, Bandingkan Kedua Studi Kasus</span>
                </div>
                <div className="p-4 space-y-3">
                  {BANDINGKAN_Q.map((q, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold text-primary-700">
                        {i + 1}. {q}
                      </label>
                      <textarea
                        value={data[`b_${i}`] || ''}
                        onChange={(e) => update(`b_${i}`, e.target.value)}
                        rows={2}
                        placeholder="Tulis jawabanmu..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-pink-400 focus:outline-none text-xs resize-none bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="text-[11px] text-slate-400 italic text-center">
        Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
      </p>
    </div>
  );
}
