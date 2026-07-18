import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Heart, MessageCircle, Music2, Send, Share2,
  ChevronLeft, ChevronRight
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
 { threshold: 0.2 }
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
 SIMULASI — Chat dengan Bijak (kirim & kunci)
 ══════════════════════════════════════════════════ */
interface ChatMsg {
 n: string;
 t: string;
 warna: string;
 buruk?: boolean;
 gambar?: string;
}
interface Skenario {
 id: string;
 tipe: 'wa-group' | 'wa-private';
 namaGrup: string;
 avatar: string;
 anggota?: string;
 konteks: string;
 pesan: ChatMsg[];
 tugas: string;
}

const SKENARIO_CHAT: Skenario[] = [
 {
 id: 's1',
 tipe: 'wa-group',
 namaGrup: 'Grup Kelas 5',
 avatar: 'GK',
 anggota: '28 anggota',
 konteks: 'Di grup kelas, teman-teman membahas hasil tugas menggambar Doni. Ada yang menyemangati, tapi ada juga yang mengejek. Balas dengan bijak agar suasana grup tetap nyaman.',
 pesan: [
 { n: 'Doni', t: 'Teman-teman, ini gambar tugasku. Gimana menurut kalian? ', warna: 'text-emerald-600', gambar: '/karya_digital_anak.png' },
 { n: 'Siti', t: 'Bagus kok, Don! Aku suka warnanya yang cerah ', warna: 'text-pink-600' },
 { n: 'Edo', t: 'Iya, rapi banget. Gambar kucingnya lucu sekali ', warna: 'text-teal-600' },
 { n: 'Anton', t: 'Ah kamu payah mainnya, gambarnya jelek banget wkwk ', warna: 'text-amber-600', buruk: true },
 { n: 'Lani', t: 'Ih Anton kok gitu sih? ', warna: 'text-purple-600' },
 { n: 'Budi', t: 'Jangan gitu dong, Ton. Kan kita sama-sama belajar ', warna: 'text-indigo-600' },
 { n: 'Anton', t: 'Biarin, emang kenyataan kok jelek banget ', warna: 'text-amber-600', buruk: true },
 { n: 'Doni', t: 'Maaf ya teman-teman kalau gambarku kurang bagus... ', warna: 'text-emerald-600' },
 ],
 tugas: 'Tulis balasan yang menengahi ejekan Anton + memberi semangat untuk Doni.',
 },
 {
 id: 's2',
 tipe: 'wa-group',
 namaGrup: 'Keluarga Bahagia',
 avatar: '/keluarga_bahagia.jpeg',
 anggota: '6 anggota',
 konteks: 'Di grup keluarga, sepupumu mengirim kabar bahwa ia menang lomba menyanyi tingkat sekolah.',
 pesan: [
 { n: 'Sepupu Lina', t: 'Kakak/Adik, aku menang juara 1 lomba menyanyi di sekolah! Ini pialanya ', warna: 'text-pink-600', gambar: '/menang_lomba.jpeg' },
 { n: 'Bunda', t: 'Wah hebat sekali anak Bunda! ', warna: 'text-purple-600' },
 { n: 'Om Andi', t: 'Selamat ya Lina, bangga sama kamu! ', warna: 'text-teal-600' },
 { n: 'Tante Mia', t: 'Hebat banget Lina! Nanti Tante belikan hadiah ya ', warna: 'text-amber-600' },
 { n: 'Sepupu Lina', t: 'Terima kasih banyak Tante Mia dan Om Andi! ', warna: 'text-pink-600' },
 { n: 'Kak Rio', t: 'Keren banget Lin! Nanti makan-makan traktir Kakak ya wkwk ', warna: 'text-indigo-600' },
 { n: 'Sepupu Lina', t: 'Siap Kak Rio, nanti kita makan bareng ya! ', warna: 'text-pink-600' },
 ],
 tugas: 'Tulis ucapan selamat yang sopan dan hangat untuk sepupumu, Lina.',
 },
 {
 id: 's3',
 tipe: 'wa-private',
 namaGrup: 'Roni',
 avatar: 'RN',
 anggota: 'online',
 konteks: 'Roni, teman kelompokmu, mengirim chat pribadi menanyakan tugas dengan gaya huruf KAPITAL semua yang terkesan berteriak dan tidak sabaran. Balaslah dengan tenang.',
 pesan: [
 { n: 'Roni', t: 'WOY', warna: 'text-sky-600' },
 { n: 'Roni', t: 'MANA TUGAS BAGIANMU???', warna: 'text-sky-600' },
 { n: 'Roni', t: 'KIRIM SEKARANG JUGA!!!', warna: 'text-sky-600' },
 { n: 'Roni', t: 'DITUNGGUIN YANG LAIN INI, JANGAN LAMA-LAMA!!! ', warna: 'text-sky-600' },
 { n: 'Roni', t: 'CEPETAN WOY!!!', warna: 'text-sky-600' },
 ],
 tugas: 'Tulis balasan yang tenang, katakan kamu sedang menyelesaikannya, dan ingatkan Roni dengan sopan untuk tidak menggunakan huruf kapital semua agar tidak terkesan marah.',
 },
 {
 id: 's4',
 tipe: 'wa-private',
 namaGrup: 'Bima',
 avatar: 'BM',
 anggota: 'online',
 konteks: 'Temanmu, Bima, curhat lewat chat pribadi karena ia merasa sedih nilainya turun dan takut dimarahi orang tua.',
 pesan: [
 { n: 'Bima', t: 'Aku sedih banget, nilai ulanganku turun ', warna: 'text-sky-600' },
 { n: 'Bima', t: 'Aku takut dimarahi orang tua...', warna: 'text-sky-600' },
 { n: 'Bima', t: 'Padahal aku sudah belajar semalaman kemarin.', warna: 'text-sky-600' },
 { n: 'Bima', t: 'Tapi pas ngerjain kepalaku agak pusing, jadi banyak yang lupa.', warna: 'text-sky-600' },
 { n: 'Bima', t: 'Sekarang aku bingung harus bilang apa ke Ibu... Aku takut sekali ', warna: 'text-sky-600' },
 ],
 tugas: 'Tulis balasan yang menunjukkan empati, menyemangati Bima, dan menyarankannya untuk jujur kepada ibunya tentang pusing yang ia alami.',
 },
 {
 id: 's5',
 tipe: 'wa-group',
 namaGrup: 'Diskusi Kelompok 3',
 avatar: 'DK',
 anggota: '4 anggota',
 konteks: 'Edo mengirim draft presentasi kelompok, tapi Tika tidak setuju dan menyampaikannya secara kasar di grup. Tulis balasan yang menengahi konflik ini dengan bijak.',
 pesan: [
 { n: 'Edo', t: 'Teman-teman, ini draft presentasi kelompok kita untuk besok ', warna: 'text-emerald-600' },
 { n: 'Edo', t: 'Bagianku sudah selesai, tolong dicek ya. Semoga cocok.', warna: 'text-emerald-600' },
 { n: 'Tika', t: 'Hah? Apaan sih ini, jelek banget idenya! ', warna: 'text-rose-600', buruk: true },
 { n: 'Tika', t: 'Membosankan tau! Gak bakal dapet nilai bagus kita kalau pake ini ', warna: 'text-rose-600', buruk: true },
 { n: 'Edo', t: 'Eh... maaf ya, kemarin aku cuma dapat ide itu... ', warna: 'text-emerald-600' },
 { n: 'Tika', t: 'Makanya mikir dong, jangan asal bikin aja! Bikin repot aja', warna: 'text-rose-600', buruk: true },
 ],
 tugas: 'Tulis balasan yang menengahi ketidaksetujuan Tika secara sopan, mengapresiasi usaha Edo, dan mengajak diskusi ide baru bersama dengan damai.',
 },
];
interface AIResult {
 score: number;
 isCorrect: boolean;
 type: 'rude' | 'passive' | 'assertive';
 feedback: string;
 recommendation: string;
}

function evaluateLocalResponse(scenarioId: string, reply: string): AIResult {
 const text = reply.toLowerCase();
 
 // Rude keywords: insults, mocking, swearing
 const rudeKeywords = [
 'jelek', 'payah', 'bodoh', 'buruk', 'culun', 'bego', 'tolol', 'anjing', 'babi', 
 'bangsat', 'goblok', 'lemah', 'pecundang', 'cupu', 'biarin', 'mampus', 'ngapain',
 'benci', 'aneh', 'najis', 'dih', 'hilih', 'kasian', 'bodo amat', 'sok tahu',
 'bacot', 'berisik', 'nyolot', 'marah balik'
 ];
 
 // Passive keywords: fear, overly submissive, ignoring problems
 const passiveKeywords = [
 'takut', 'terserah', 'terserah kamu', 'nggak tahu', 'tidak tahu', 'diam saja', 
 'ya sudah', 'yasudah', 'pasrah', 'biarkan saja', 'ndak tau', 'ikut aja', 'maaf saya salah',
 'ampun', 'yaudah aku diam'
 ];

 const hasRude = rudeKeywords.some(kw => text.includes(kw));
 if (hasRude) {
 return {
 score: 5,
 isCorrect: false,
 type: 'rude',
 feedback: 'Balasanmu terasa kurang sopan atau terpancing emosi negatif.',
 recommendation: 'Cobalah menanggapi dengan kepala dingin dan kata-kata santun tanpa mengejek balik.'
 };
 }

 const hasPassive = passiveKeywords.some(kw => text.includes(kw));
 if (hasPassive) {
 return {
 score: 10,
 isCorrect: false,
 type: 'passive',
 feedback: 'Balasanmu kurang tegas dan cenderung pasrah/menghindar secara berlebihan.',
 recommendation: 'Kamu bisa menyampaikan pendapatmu dengan percaya diri tanpa harus merasa bersalah atau pasrah.'
 };
 }

 // Default to assertive
 let feedback = 'Balasanmu sangat baik, santun, dan menunjukkan empati yang tinggi.';
 let recommendation = 'Pertahankan cara berkomunikasi yang positif ini di dunia maya!';

 if (scenarioId === 's1') {
 feedback = 'Luar biasa! Kamu menengahi ejekan Anton dengan sopan dan memberikan semangat kepada Doni agar tetap ceria.';
 recommendation = 'Menjaga kenyamanan grup kelas adalah bentuk tanggung jawab digital yang hebat.';
 } else if (scenarioId === 's2') {
 feedback = 'Hebat! Ucapan selamatmu sangat hangat, santun, dan menunjukkan kebanggaan atas keberhasilan sepupumu.';
 recommendation = 'Teruslah menyebarkan energi positif kepada keluarga dan kerabat terdekat.';
 } else if (scenarioId === 's3') {
 feedback = 'Sangat baik! Kamu membalas dengan tenang dan mengingatkan Roni secara sopan agar tidak memakai huruf kapital semua.';
 recommendation = 'Mengingatkan etika chat membantu mencegah terjadinya salah paham akibat gaya mengetik.';
 } else if (scenarioId === 's4') {
 feedback = 'Luar biasa! Kamu menunjukkan empati mendalam dan menyarankan Bima untuk jujur secara terbuka pada orang tuanya.';
 recommendation = 'Jujur dan bersikap terbuka adalah kunci menyelesaikan masalah dengan baik.';
 } else if (scenarioId === 's5') {
 feedback = 'Hebat! Kamu mengapresiasi Edo, meredam kritikan kasar Tika secara santun, dan mengajak diskusi ide baru bersama.';
 recommendation = 'Menjadi penengah yang bijak akan menjaga kekompakan kelompok belajarmu.';
 }

 return {
 score: 20,
 isCorrect: true,
 type: 'assertive',
 feedback,
 recommendation
 };
}

export function Topik5ChatBijak({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, any>>(answers);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const chatEndRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setData(answers);
  }, [answers]);

  const scrollToBottom = (id: string) => {
    setTimeout(() => {
      const el = chatEndRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  // Scroll on active scenario, typing/evaluation updates
  useEffect(() => {
    scrollToBottom(SKENARIO_CHAT[activeScenarioIdx].id);
  }, [activeScenarioIdx, data, typing]);

  const submitted = !!answers._submitted || !!data._submitted;
  const terkirim = SKENARIO_CHAT.filter((s) => (data[s.id] || '').trim().length > 0).length;

  // Calculate currentScore
  const currentScore = SKENARIO_CHAT.reduce((acc, s) => {
    const evalData = data[`${s.id}_eval`];
    if (evalData) {
      if (evalData.type === 'assertive') {
        return acc + 20;
      } else if (evalData.type === 'passive') {
        return acc + 10;
      } else if (evalData.type === 'rude') {
        return acc + 5;
      }
      return acc + (evalData.score || 0);
    }
    return acc;
  }, 0);

  const kirim = async (id: string) => {
    const teks = (drafts[id] || '').trim();
    if (!teks) return;

    // Show student's message immediately
    const intermediateData = { ...data, [id]: teks };
    setData(intermediateData);
    onSave?.(intermediateData);
    setDrafts((prev) => ({ ...prev, [id]: '' }));

    // Start typing indicator
    setTyping((prev) => ({ ...prev, [id]: true }));
    scrollToBottom(id);

    const s = SKENARIO_CHAT.find((item) => item.id === id);
    const context = s ? s.konteks : '';
    const message = s ? s.pesan.map((p) => `${p.n}: ${p.t}`).join('\n') : '';

    try {
      const { auth } = await import('../../lib/firebase');
      const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ context, message, reply: teks }),
      });

      const resData = await response.json();

      let evalResult;
      if (response.ok && !resData.useFallback && resData.result) {
        evalResult = resData.result;
      } else {
        evalResult = evaluateLocalResponse(id, teks);
      }

      // 2 seconds typing indicator delay
      setTimeout(() => {
        setTyping((prev) => ({ ...prev, [id]: false }));
        setData((prev) => {
          const next = { ...prev, [id]: teks, [`${id}_eval`]: evalResult };
          onSave?.(next);
          return next;
        });
      }, 2000);
    } catch (err) {
      console.error('AI Evaluation failed, falling back to local NLP classifier:', err);
      const evalResult = evaluateLocalResponse(id, teks);
      setTimeout(() => {
        setTyping((prev) => ({ ...prev, [id]: false }));
        setData((prev) => {
          const next = { ...prev, [id]: teks, [`${id}_eval`]: evalResult };
          onSave?.(next);
          return next;
        });
      }, 2000);
    }
  };

  const confirmAll = () => {
    setShowConfirm(false);
    const next = { ...data, _submitted: true, _score: currentScore };
    setData(next);
    onSave?.(next);
  };

  return (
    <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-500">
            Simulasi Penutup
          </span>
          <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
            Simulasi: Chat dengan Bijak
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Sekarang giliranmu! Balas setiap pesan di berbagai situasi (grup kelas, keluarga, WhatsApp, chat pribadi)
            dengan kata-kata yang santun. Ketik balasanmu lalu tekan <b>Kirim</b> — pesanmu akan langsung dinilai oleh AI Mentor.
          </p>
        </div>
        <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end shrink-0">
          <span className="text-xs font-bold px-3 py-1.5 bg-sky-50 text-sky-600 rounded-full border border-sky-100">
            {terkirim}/{SKENARIO_CHAT.length} Skenario
          </span>
          <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
            Skor: {currentScore}/100
          </span>
        </div>
      </div>

      {/* Skenario Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 max-w-xl mx-auto">
        {SKENARIO_CHAT.map((s, idx) => {
          const isActive = activeScenarioIdx === idx;
          const isDone = !!data[s.id];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScenarioIdx(idx)}
              className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : isDone
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span>{idx + 1}. {s.namaGrup}</span>
              {isDone && (
                <span className="text-[10px] text-emerald-500 font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {/* Render Active Scenario */}
        {(() => {
          const s = SKENARIO_CHAT[activeScenarioIdx];
          const balasan = data[s.id];
          const isGroup = s.tipe === 'wa-group';
          const evaluation = data[`${s.id}_eval`];
          return (
            <div key={s.id} className="space-y-3 max-w-md mx-auto">
              {/* Konteks */}
              <div className="bg-sky-50/50 border border-sky-100/80 rounded-2xl p-3 text-left">
                <span className="text-[9px] uppercase font-extrabold text-sky-600 tracking-wider block mb-1">Konteks Skenario</span>
                <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                  {s.konteks}
                </p>
              </div>

              {/* ===== Mock HP WhatsApp ===== */}
              <div className="relative rounded-[2.25rem] border-[10px] border-slate-950 overflow-hidden shadow-2xl bg-[#e5ddd5] w-full max-w-[345px] mx-auto flex flex-col">
                {/* Notch */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-950 rounded-full z-20 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="w-6 h-0.5 bg-slate-900 rounded-full"></div>
                </div>

                {/* WA Header */}
                <div className="bg-[#075e54] text-white px-3 pt-5 pb-2 flex items-center gap-2.5 relative">
                  <span className="text-lg leading-none cursor-pointer" onClick={() => setActiveScenarioIdx(prev => prev > 0 ? prev - 1 : SKENARIO_CHAT.length - 1)}>‹</span>
                  <div 
                    onClick={() => {
                      if (s.id === 's2') setShowEasterEgg(true);
                    }}
                    className={`w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 ${
                      s.id === 's2' ? 'cursor-pointer hover:scale-105 hover:ring-2 hover:ring-white/50 transition-all duration-200' : ''
                    }`}
                    title={s.id === 's2' ? 'Klik untuk melihat detail' : undefined}
                  >
                    {s.avatar.startsWith('/') ? (
                      <img src={s.avatar} alt={s.namaGrup} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold">{s.avatar}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold truncate">{s.namaGrup}</p>
                    <p className="text-[10px] text-white/70 truncate">
                      {isGroup ? s.anggota : <>{s.pesan[0].n}, Kamu</>}
                    </p>
                  </div>
                  <span className="text-base">⋮</span>
                </div>

                {/* WA Chat body — pola wallpaper */}
                <div
                  className="p-3 space-y-1.5 h-[440px] overflow-y-auto"
                  style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                >
                  {s.pesan.map((m, i) => (
                    <div key={i} className="flex text-left">
                      <div className={`relative max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-xs ${m.buruk ? 'bg-rose-50 border border-rose-100' : 'bg-white border border-slate-100'}`}>
                        {isGroup && (
                          <p className={`text-[11px] font-bold ${m.warna} leading-tight`}>{m.n}</p>
                        )}
                        {m.gambar && (
                          <img 
                            src={m.gambar} 
                            alt="Unggahan" 
                            onClick={() => {
                              if (s.id === 's2' && m.gambar === '/menang_lomba.jpeg') {
                                setShowEasterEgg(true);
                              }
                            }}
                            className={`rounded-lg mb-1.5 max-w-full h-auto object-contain max-h-[160px] bg-slate-50 border border-slate-100/60 ${
                              s.id === 's2' && m.gambar === '/menang_lomba.jpeg' ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
                            }`}
                            title={s.id === 's2' && m.gambar === '/menang_lomba.jpeg' ? 'Klik untuk melihat detail' : undefined}
                          />
                        )}
                        <p className="text-xs text-slate-800 leading-snug pr-8 whitespace-pre-line">{m.t}</p>
                        <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-400">09.4{i}</span>
                      </div>
                    </div>
                  ))}

                  {/* Balasan murid (bubble hijau kanan) */}
                  {balasan && (
                    <div className="flex justify-end pt-0.5 animate-pop-in text-left">
                      <div className="relative max-w-[82%] rounded-lg px-2.5 py-1.5 shadow-xs bg-[#dcf8c6] border border-emerald-150">
                        <p className="text-xs text-slate-800 leading-snug pr-10">{balasan}</p>
                        <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-550 flex items-center gap-0.5">
                          09.45 <span className="text-sky-500 font-bold">✓✓</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Mentor Typing Indicator */}
                  {typing[s.id] && (
                    <div className="flex items-center gap-2 py-1 animate-pulse">
                      <span className="text-[11px] text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-md shadow-xs border border-slate-100">
                        AI Mentor sedang menilai...
                      </span>
                    </div>
                  )}

                  {/* AI Mentor Feedback Bubble */}
                  {evaluation && (
                    <div className="flex justify-start pt-1 animate-pop-in text-left">
                      <div className="relative max-w-[88%] rounded-xl px-3 py-2 shadow-xs bg-sky-50 border border-sky-200">
                        <p className="text-[11px] font-bold text-sky-700 flex items-center gap-1.5 mb-1">
                          AI Mentor 
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            evaluation.type === 'assertive' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : evaluation.type === 'passive' 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-rose-100 text-rose-700'
                          }`}>
                            {evaluation.type === 'assertive' ? 'Santun' : evaluation.type === 'passive' ? 'Kurang Tegas' : 'Kurang Sopan'}
                          </span>
                        </p>
                        <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                          {evaluation.feedback}
                        </p>
                        <p className="text-[11px] text-slate-655 leading-normal mt-1.5 pt-1.5 border-t border-sky-100/60 italic font-medium">
                          <b>Saran:</b> "{evaluation.recommendation}"
                        </p>
                      </div>
                    </div>
                  )}
                  <div ref={(el) => { chatEndRefs.current[s.id] = el; }} />
                </div>

                {/* WA input bar */}
                <div className="bg-[#f0f0f0] px-2.5 py-2 flex items-center gap-2 border-t border-slate-200">
                  {!balasan && !submitted ? (
                    <>
                      <div className="flex-1 bg-white rounded-full px-3 py-2 flex items-center border border-slate-200">
                        <input
                          type="text"
                          value={drafts[s.id] || ''}
                          onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') kirim(s.id); }}
                          placeholder="Ketik balasan bijakmu..."
                          className="flex-1 text-xs focus:outline-none bg-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => kirim(s.id)}
                        disabled={!(drafts[s.id] || '').trim() || typing[s.id]}
                        className="w-9 h-9 rounded-full bg-[#075e54] text-white flex items-center justify-center disabled:opacity-40 shrink-0 hover:bg-[#054c44] transition-all"
                        aria-label="Kirim"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <p className="text-[11px] text-slate-550 py-1.5 w-full text-center font-bold">
                      {typing[s.id] ? '⏳ Sedang dianalisis oleh AI Mentor...' : balasan ? '✅ Balasanmu sudah dinilai' : '🔒 Sudah dikunci'}
                    </p>
                  )}
                </div>
              </div>

              {/* Tugas */}
              <div className="bg-sky-50 rounded-xl p-2.5 border border-sky-100 text-center">
                <p className="text-[10px] font-extrabold text-sky-850">🎯 Tugas: {s.tugas}</p>
              </div>

              {/* Slide Navigation Buttons */}
              <div className="flex justify-between items-center max-w-sm mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => setActiveScenarioIdx((prev) => (prev > 0 ? prev - 1 : SKENARIO_CHAT.length - 1))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-xl flex items-center gap-1 transition-all active:scale-95 border border-slate-200/60 shadow-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Skenario Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScenarioIdx((prev) => (prev < SKENARIO_CHAT.length - 1 ? prev + 1 : 0))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-xl flex items-center gap-1 transition-all active:scale-95 border border-slate-200/60 shadow-xs"
                >
                  Skenario Berikutnya <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Final submit / locked */}
      {submitted ? (
        <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl py-3 px-4 text-emerald-700 font-bold text-sm">
          Semua balasan sudah dikirim ke guru dan tidak dapat diubah.
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md inline-flex items-center justify-center gap-2"
        >
          Kunci & Kirim Semua ke Guru
        </button>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-amber-100">
              ⚠️
            </div>
            <h4 className="font-display font-bold text-lg text-primary-800">Kirim ke Guru?</h4>
            <p className="text-sm text-primary-500 leading-relaxed">
              Setelah dikirim, semua balasanmu akan dinilai oleh guru dan <b>tidak dapat diubah lagi</b>. Pastikan kamu
              sudah membalas semua chat dengan santun, ya!
            </p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200">
                Periksa Lagi
              </button>
              <button onClick={confirmAll}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700">
                Ya, Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Easter Egg: Foto Keluarga Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-white/10 p-2 rounded-3xl max-w-lg w-full border border-white/20 shadow-2xl flex flex-col items-center">
            {/* Close Button */}
            <button 
              onClick={() => setShowEasterEgg(false)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center justify-center shadow-md border-2 border-white z-10 text-lg transition-transform hover:scale-105 active:scale-95"
              aria-label="Tutup"
            >
              ✕
            </button>
            {/* Keluarga Bahagia Image */}
            <img 
              src="/keluarga_bahagia.jpeg" 
              alt="Keluarga Bahagia" 
              className="rounded-2xl max-w-full max-h-[80vh] object-contain shadow-inner"
            />
            <p className="text-sm text-white mt-3 font-semibold text-center tracking-wide px-4 py-1 bg-black/40 rounded-full border border-white/10">
              Calon guru profesional
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



/* ══════════════════════════════════════════════════
 TANTANGAN AWAL TOPIK 5 — Pesan Mana yang Lebih Santun?
 ══════════════════════════════════════════════════ */
export function Topik5TantanganAwal({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);

 const update = (key: string, value: string) => {
 const next = {...data, [key]: value };
 setData(next);
 onSave?.(next);
 };

 return (
 <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-sky-500">
 Tantangan Awal
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Pesan Mana yang Lebih Santun?
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Perhatikan dua pesan yang muncul di gawai berikut. Menurutmu, pesan mana yang lebih baik untuk
 dikirim kepada teman? Jawablah secara mandiri.
 </p>
 </div>

 {/* Phone mockup with two chat messages */}
 <div className="mx-auto max-w-xs bg-gradient-to-br from-sky-900 to-indigo-900 rounded-[2rem] border-[8px] border-slate-800 p-3 shadow-2xl">
 {/* status bar */}
 <div className="flex justify-between items-center px-2 py-1 text-[9px] font-semibold text-white/70">
 <span>09.41</span>
 <span> 100%</span>
 </div>
 {/* chat header */}
 <div className="flex items-center gap-2 px-2 py-2 border-b border-white/10">
 <span className="text-white text-xs font-bold">Grup Menggambar</span>
 </div>
 {/* messages */}
 <div className="bg-slate-100 rounded-b-2xl p-3 space-y-3 mt-1">
 <div className="space-y-1">
 <span className="text-[9px] font-bold text-rose-500 ml-1">Pesan 1</span>
 <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
 <p className="text-xs text-slate-700 leading-relaxed">
 "Gambarmu jelek banget. Aku bisa bikin yang lebih bagus." 
 </p>
 </div>
 </div>
 <div className="space-y-1">
 <span className="text-[9px] font-bold text-emerald-600 ml-1">Pesan 2</span>
 <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
 <p className="text-xs text-slate-700 leading-relaxed">
 "Gambarmu sudah menarik. Mungkin warnanya bisa dibuat lebih rapi agar terlihat lebih jelas." 
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Questions */}
 <div className="space-y-4">
 {/* Q1 — pilih pesan */}
 <div className="space-y-2">
 <p className="text-sm font-bold text-primary-700">1. Pesan yang lebih santun adalah pesan nomor....</p>
 <div className="flex gap-3">
 {['Pesan 1', 'Pesan 2'].map((p) => (
 <button
 key={p}
 onClick={() => update('q1', p)}
 className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
 data.q1 === p
? 'bg-sky-500 border-sky-500 text-white'
: 'bg-white border-slate-200 text-slate-600 hover:bg-sky-50'
 }`}
 >
 {p}
 </button>
 ))}
 </div>
 </div>

 {/* Q2 — alasan */}
 <div className="space-y-1.5">
 <label className="text-sm font-bold text-primary-700">2. Alasanku:</label>
 <textarea
 value={data.q2 || ''}
 onChange={(e) => update('q2', e.target.value)}
 rows={2}
 placeholder="Tulis alasanmu di sini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none"
 />
 </div>

 {/* Q3 — perasaan Pesan 1 */}
 <div className="space-y-1.5">
 <label className="text-sm font-bold text-primary-700">
 3. Jika kamu menerima Pesan 1, bagaimana perasaanmu?
 </label>
 <textarea
 value={data.q3 || ''}
 onChange={(e) => update('q3', e.target.value)}
 rows={2}
 placeholder="Tulis perasaanmu di sini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none"
 />
 </div>

 {/* Q4 — perasaan Pesan 2 */}
 <div className="space-y-1.5">
 <label className="text-sm font-bold text-primary-700">
 4. Jika kamu menerima Pesan 2, bagaimana perasaanmu?
 </label>
 <textarea
 value={data.q4 || ''}
 onChange={(e) => update('q4', e.target.value)}
 rows={2}
 placeholder="Tulis perasaanmu di sini..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none"
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
 AKTIVITAS 3 — Studi Kasus: Komentar Baik, Teman Nyaman
 ══════════════════════════════════════════════════ */
const TIKTOK_KOMENTAR_AWAL = [
 { u: 'naya.kreatif', t: 'Bagus, Nay! Videonya bermanfaat banget ', love: 124 },
 { u: 'rizky_07', t: 'Suaranya kecil banget, nggak jelas ', love: 3 },
 { u: 'dindaa.p', t: 'Keren, aku jadi ingat buang sampah pada tempatnya!', love: 89 },
];

export function Topik5Aktivitas3({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, string>>(answers);
 const [showKomentar, setShowKomentar] = useState(false);
 const [tiktokDraft, setTiktokDraft] = useState('');
 const [liked, setLiked] = useState(false);
 const [komentarMurid, setKomentarMurid] = useState<string[]>(
 answers.k1_komentar? [answers.k1_komentar]: []
 );
 const [grupDraft, setGrupDraft] = useState('');
 const [grupBalasan, setGrupBalasan] = useState<string[]>(
 answers.k2_balasan? [answers.k2_balasan]: []
 );

 const update = (key: string, val: string) => {
 const next = {...data, [key]: val };
 setData(next);
 onSave?.(next);
 };

 const kirimKomentarTiktok = () => {
 const teks = tiktokDraft.trim();
 if (!teks) return;
 setKomentarMurid((arr) => [...arr, teks]);
 update('k1_komentar', teks);
 setTiktokDraft('');
 };

 const kirimBalasanGrup = () => {
 const teks = grupDraft.trim();
 if (!teks) return;
 setGrupBalasan((arr) => [...arr, teks]);
 update('k2_balasan', teks);
 setGrupDraft('');
 };


 const totalKomentar = TIKTOK_KOMENTAR_AWAL.length + komentarMurid.length;

 return (
 <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-6">

 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-sky-500">
 Eksplorasi · Aktivitas 3
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Studi Kasus: Komentar Baik, Teman Nyaman
 </h3>
 <p className="text-sm text-primary-500 mt-2 leading-relaxed">
 Bacalah situasi di dunia digital berikut, lalu tulis komentar yang santun. Ingat, komentar yang baik biasanya
 berisi: <b>apresiasi + saran sopan + semangat</b>. Contoh: <i>"Videomu menarik. Mungkin suaranya bisa dibuat
 lebih jelas. Semangat berkarya!"</i>
 </p>
 </div>

 {/* ===== KASUS 1: Layar Video Pendek (Clone TikTok / Reels) ===== */}
 <div className="border border-slate-200 rounded-2xl overflow-hidden">
 <div className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-4 py-3 flex items-center gap-2">
 <span className="text-xs font-black uppercase tracking-wide">Kasus 1 · Layar Video Pendek</span>
 </div>
 <div className="p-4 space-y-3">
 {/* === Mock layar HP TikTok === */}
 <div className="mx-auto max-w-[280px] relative bg-black rounded-[2rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl select-none">
 {/* Layar video vertikal */}
 <div className="relative aspect-[9/16] bg-gradient-to-b from-slate-800 via-slate-900 to-black overflow-hidden">
 {/* status bar */}
 <div className="absolute top-0 inset-x-0 flex justify-between items-center px-4 py-1.5 text-[9px] font-semibold text-white/80 z-20">
 <span>09.41</span>
 </div>

 {/* Video Player */}
 <AutoPlayVideo
 src="/video_membersikan_kelas.mp4"
 className="w-full h-full object-cover absolute inset-0"
 autoPlay
 muted
 loop
 playsInline
 />

 {/* Dark overlay for readability */}
 <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10 pointer-events-none" />

 {/* caption kiri bawah */}
 <div className="absolute bottom-3 left-3 right-16 z-20 pointer-events-none">
 <p className="text-white font-bold text-xs">@naya.kreatif</p>
 <p className="text-white/80 text-[10px] leading-snug mt-0.5">
 Yuk jaga kebersihan kelas bareng-bareng! #kelasbersih #tugassekolah
 </p>
 <p className="text-white/70 text-[10px] mt-1 flex items-center gap-1">
 <Music2 className="h-3 w-3 animate-pulse" /> suara asli - Naya
 </p>
 </div>

 {/* Deretan ikon interaksi sisi kanan bawah */}
 <div className="absolute bottom-3 right-2 flex flex-col items-center gap-4 z-20">
 {/* Foto profil */}
 <div className="relative">
 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
 NY
 </div>
 <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">+</div>
 </div>
 {/* Like */}
 <button onClick={() => setLiked((v) =>!v)} className="flex flex-col items-center text-white">
 <Heart className={`h-7 w-7 ${liked? 'animate-heart-beat fill-rose-500 text-rose-500': 'text-white'}`} />
 <span className="text-[9px] font-semibold mt-0.5">{liked? '1.3rb': '1.2rb'}</span>
 </button>
 {/* Comment */}
 <button onClick={() => setShowKomentar(true)} className="flex flex-col items-center text-white">
 <MessageCircle className="h-7 w-7" />
 <span className="text-[9px] font-semibold mt-0.5">{totalKomentar}</span>
 </button>
 {/* Share */}
 <button className="flex flex-col items-center text-white">
 <Share2 className="h-7 w-7" />
 <span className="text-[9px] font-semibold mt-0.5">Bagikan</span>
 </button>
 </div>

 {/* ===== Drawer Komentar (pop-up dari bawah) ===== */}
 {showKomentar && (
 <div className="absolute inset-0 z-30 flex flex-col justify-end">
 <div className="absolute inset-0 bg-black/40" onClick={() => setShowKomentar(false)} />
 <div className="relative bg-white rounded-t-2xl max-h-[78%] flex flex-col animate-slide-up">
 {/* drawer header */}
 <div className="flex items-center justify-center relative px-4 py-2.5 border-b border-slate-100">
 <span className="w-10 h-1 bg-slate-300 rounded-full absolute -top-0 left-1/2 -translate-x-1/2 mt-1" />
 <p className="text-xs font-bold text-slate-700">{totalKomentar} komentar</p>
 <button onClick={() => setShowKomentar(false)} className="absolute right-3 text-slate-400 text-lg leading-none">✕</button>
 </div>
 {/* list komentar */}
 <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
 {TIKTOK_KOMENTAR_AWAL.map((c, i) => (
 <div key={i} className="flex items-start gap-2">
 <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">
 {c.u.charAt(0).toUpperCase()}
 </div>
 <div className="flex-1">
 <p className="text-[10px] font-bold text-slate-500">@{c.u}</p>
 <p className="text-xs text-slate-800 leading-snug">{c.t}</p>
 <p className="text-[9px] text-slate-400 mt-0.5">Balas</p>
 </div>
 <div className="flex flex-col items-center text-slate-400 shrink-0">
 <span className="text-[9px]">{c.love}</span>
 </div>
 </div>
 ))}
 {/* komentar murid yang di-append */}
 {komentarMurid.map((t, i) => (
 <div key={`me-${i}`} className="flex items-start gap-2 animate-pop-in">
 <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
 KM
 </div>
 <div className="flex-1">
 <p className="text-[10px] font-bold text-sky-600">@kamu <span className="text-[8px] bg-sky-100 text-sky-600 px-1 py-0.5 rounded ml-1">Baru</span></p>
 <p className="text-xs text-slate-800 leading-snug">{t}</p>
 <p className="text-[9px] text-slate-400 mt-0.5">Balas</p>
 </div>
 <div className="flex flex-col items-center text-rose-400 shrink-0">
 <span className="text-[9px]">1</span>
 </div>
 </div>
 ))}
 </div>
 {/* input komentar TikTok */}
 <div className="border-t border-slate-100 p-2 flex items-center gap-2">
 <input
 type="text"
 value={tiktokDraft}
 onChange={(e) => setTiktokDraft(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') kirimKomentarTiktok(); }}
 placeholder="Tambahkan komentar santun..."
 className="flex-1 px-3 py-2 bg-slate-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-sky-300"
 />
 <button
 onClick={kirimKomentarTiktok}
 disabled={!tiktokDraft.trim()}
 className="px-3 py-2 rounded-full bg-sky-500 text-white text-xs font-bold disabled:opacity-40 shrink-0"
 >
 Kirim
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>

 <p className="text-center text-[11px] text-slate-500">
 Tekan ikon <b>komentar</b> untuk membuka kolom komentar, lalu tulis komentar santunmu. Komentarmu akan
 langsung muncul di daftar komentar, seperti memposting di TikTok sungguhan!
 </p>

 {/* Pertanyaan refleksi */}
 <div className="space-y-3 pt-1">
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">1. Komentar (@username) mana yang paling santun?</label>
 <input type="text" value={data.k1_santun || ''} onChange={(e) => update('k1_santun', e.target.value)}
 placeholder="Tulis username/komentarnya..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm" />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">2. Komentar mana yang perlu diperbaiki? Mengapa?</label>
 <textarea value={data.k1_perbaiki || ''} onChange={(e) => update('k1_perbaiki', e.target.value)} rows={2}
 placeholder="Tulis jawabanmu..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none" />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">3. Mengapa komentarmu termasuk santun?</label>
 <textarea value={data.k1_alasan || ''} onChange={(e) => update('k1_alasan', e.target.value)} rows={2}
 placeholder="Tulis alasanmu..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none" />
 </div>
 </div>
 </div>
 </div>


 {/* ===== KASUS 2: Chat Grup Kelas ===== */}
 <div className="border border-slate-200 rounded-2xl overflow-hidden">
 <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 flex items-center gap-2">
 <span className="text-xs font-black uppercase tracking-wide">Kasus 2 · Chat Grup Kelas</span>
 </div>
 <div className="p-4 space-y-3">
 <p className="text-xs text-slate-500 italic">
 Raka mengirim poster digital ajakan hemat listrik di grup kelas. Gambarnya menarik, tetapi tulisannya terlalu kecil.
 </p>
 {/* Chat thread (WhatsApp-style) */}
 <div
 className="bg-[#e5ddd5] rounded-2xl p-3 space-y-1.5"
 style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
 >
 {[
 { n: 'Raka', t: 'Teman-teman, ini poster hemat listrik buat tugasku. Menurut kalian gimana?', warna: 'text-emerald-600' },
 { n: 'Bima', t: 'Warnanya bagus, Rak. ', warna: 'text-indigo-600' },
 { n: 'Doni', t: 'Tulisannya kecil banget. Susah dibaca.', warna: 'text-amber-600' },
 { n: 'Mira', t: 'Menurutku posternya sudah menarik. Mungkin tulisan bagian bawah bisa diperbesar supaya lebih jelas. ', warna: 'text-pink-600' },
 ].map((c, i) => (
 <div key={i} className="flex">
 <div className="relative max-w-[80%] bg-white rounded-lg px-2.5 py-1.5 shadow-sm">
 <p className={`text-[11px] font-bold ${c.warna} leading-tight`}>{c.n}</p>
 <p className="text-[13px] text-slate-800 leading-snug pr-8">{c.t}</p>
 <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-400">09.1{i}</span>
 </div>
 </div>
 ))}

 {/* Balasan murid yang di-append (bubble hijau kanan) */}
 {grupBalasan.map((t, i) => (
 <div key={`me-${i}`} className="flex justify-end animate-pop-in">
 <div className="relative max-w-[80%] bg-[#dcf8c6] rounded-lg px-2.5 py-1.5 shadow-sm">
 <p className="text-[13px] text-slate-800 leading-snug pr-10">{t}</p>
 <span className="absolute bottom-1 right-1.5 text-[8px] text-slate-500 flex items-center gap-0.5">
 09.20 <span className="text-sky-500">✓✓</span>
 </span>
 </div>
 </div>
 ))}
 </div>

 {/* Input balasan grup + tombol Kirim */}
 <div className="bg-[#f0f0f0] rounded-full px-2 py-1.5 flex items-center gap-2">
 <input
 type="text"
 value={grupDraft}
 onChange={(e) => setGrupDraft(e.target.value)}
 onKeyDown={(e) => { if (e.key === 'Enter') kirimBalasanGrup(); }}
 placeholder="Tulis balasan santunmu untuk Raka..."
 className="flex-1 text-[13px] bg-transparent focus:outline-none"
 />
 <button
 onClick={kirimBalasanGrup}
 disabled={!grupDraft.trim()}
 className="w-9 h-9 rounded-full bg-[#075e54] text-white flex items-center justify-center disabled:opacity-40 shrink-0 hover:bg-[#054c44]"
 aria-label="Kirim"
 >
 <Send className="h-4 w-4" />
 </button>
 </div>
 <p className="text-center text-[11px] text-slate-500">
 Ketik balasan santunmu lalu tekan <b>Kirim</b>. Balasanmu akan langsung muncul di grup sebagai bubble hijau.
 </p>

 <div className="space-y-3 pt-1">
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">1. Balasan siapa yang paling membantu Raka?</label>
 <input type="text" value={data.k2_membantu || ''} onChange={(e) => update('k2_membantu', e.target.value)}
 placeholder="Tulis namanya..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm" />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">2. Apakah komentar Doni sudah santun? Jelaskan.</label>
 <textarea value={data.k2_doni || ''} onChange={(e) => update('k2_doni', e.target.value)} rows={2}
 placeholder="Tulis pendapatmu..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none" />
 </div>
 <div className="space-y-1">
 <label className="text-xs font-bold text-primary-700">3. Ubah komentar Doni menjadi lebih sopan.</label>
 <textarea value={data.k2_ubah || ''} onChange={(e) => update('k2_ubah', e.target.value)} rows={2}
 placeholder="Tulis versi yang lebih sopan..." className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-sm resize-none" />
 </div>
 </div>
 </div>
 </div>


 <p className="text-[11px] text-slate-400 italic">
 Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
 </p>
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 2 — Ubah Jadi Lebih Baik
 ══════════════════════════════════════════════════ */
const PESAN_SANTUN = [
 { id: 'p1', text: 'Karyamu bagus. Aku suka warnanya. ', santun: true },
 { id: 'p2', text: 'Jelek banget, hapus aja. ', santun: false },
 { id: 'p3', text: 'Menurutku, bagian judul bisa dibuat lebih jelas. ', santun: true },
 { id: 'p4', text: 'Kamu nggak bisa bikin konten ya? ', santun: false },
 { id: 'p5', text: 'Aku belum setuju, tapi pendapatmu menarik. ', santun: true },
 { id: 'p6', text: 'Wkwk, malu-maluin banget. ', santun: false },
];

export function Topik5Aktivitas1({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);

 const choose = (id: string, val: 'santun' | 'kurang') => {
 const next = {...data, [id]: {...(data[id] || {}), pilihan: val } };
 setData(next);
 onSave?.(next);
 };

 const setAlasan = (id: string, val: string) => {
 const next = {...data, [id]: {...(data[id] || {}), alasan: val } };
 setData(next);
    onSave?.(next);
  };

  const skor = PESAN_SANTUN.filter((p) => {
    const pilihan = data[p.id]?.pilihan;
    return (pilihan === 'santun' && p.santun) || (pilihan === 'kurang' && !p.santun);
  }).length;

  return (
    <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-500">
            Eksplorasi · Aktivitas 1
          </span>
          <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
            Santun atau Kurang Santun?
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Bayangkan pesan-pesan ini muncul di kolom komentar temanmu. Tentukan apakah setiap pesan <b>Santun</b> atau
            <b> Kurang Santun</b>, lalu tuliskan alasanmu.
          </p>
        </div>
        <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-sky-50 text-sky-600 rounded-full border border-sky-100">
          {skor}/{PESAN_SANTUN.length}
        </span>
      </div>

      <div className="space-y-4">
        {PESAN_SANTUN.map((p, idx) => {
          const pilihan = data[p.id]?.pilihan;
          const benar = pilihan && ((pilihan === 'santun' && p.santun) || (pilihan === 'kurang' && !p.santun));
          return (
            <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
              {/* Chat bubble */}
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center text-sm shrink-0">
                  💬
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 mb-0.5">Komentar {idx + 1}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{p.text}</p>
                </div>
              </div>

              {/* Decision */}
              <div className="grid grid-cols-2 gap-2 pl-10">
                <button
                  onClick={() => choose(p.id, 'santun')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    pilihan === 'santun'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Santun
                </button>
                <button
                  onClick={() => choose(p.id, 'kurang')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    pilihan === 'kurang'
                      ? 'bg-rose-500 border-rose-500 text-white'
                      : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  Kurang Santun
                </button>
              </div>

              {/* Feedback + alasan */}
              {pilihan && (
                <div className="pl-10 space-y-2">
                  <p className={`text-[11px] font-bold ${benar ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {benar ? '✓ Tepat!' : '✗ Coba pikirkan lagi.'}
                  </p>
                  <input
                    type="text"
                    value={data[p.id]?.alasan || ''}
                    onChange={(e) => setAlasan(p.id, e.target.value)}
                    placeholder="Tulis alasanmu di sini..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-sky-400 focus:outline-none text-xs"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════
  AKTIVITAS 2 — Ubah Jadi Lebih Baik
  ══════════════════════════════════════════════════ */
const KALIMAT_KASAR = [
  { id: 'k1', text: 'Gambarmu jelek.', konteks: 'Teman mengunggah hasil gambarnya di ruang tugas digital.' },
  { id: 'k2', text: 'Tugasmu berantakan.', konteks: 'Teman membagikan dokumen tugas kelompok di grup kelas.' },
  { id: 'k3', text: 'Kamu lama banget mikirnya.', konteks: 'Teman sedang menjawab pertanyaan saat diskusi online.' },
  { id: 'k4', text: 'Video ini nggak penting.', konteks: 'Teman mengunggah video pendek hasil karyanya.' },
  { id: 'k5', text: 'Jawabanmu salah semua.', konteks: 'Teman mengisi kuis bersama di kelas daring.' },
  { id: 'k6', text: 'Kamu nggak usah ikut kelompok.', konteks: 'Saat membentuk kelompok tugas di grup kelas.' },
];

export function Topik5Aktivitas2({ answers = {}, onSave }: ActivityProps) {
  const [data, setData] = useState<Record<string, string>>(answers);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [justSent, setJustSent] = useState<string | null>(null);

  const kirim = (id: string) => {
    const teks = (drafts[id] || '').trim();
    if (!teks) return;
    const next = { ...data, [id]: teks };
    setData(next);
    onSave?.(next);
    setJustSent(id);
    setTimeout(() => setJustSent((cur) => (cur === id ? null : cur)), 1600);
  };

  const editLagi = (id: string) => {
    setDrafts((d) => ({ ...d, [id]: data[id] || '' }));
    const next = { ...data };
    delete next[id];
    setData(next);
    onSave?.(next);
  };

  const selesai = KALIMAT_KASAR.filter((k) => (data[k.id] || '').trim().length > 0).length;

  return (
    <div className="bg-white border border-sky-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-500">
            Eksplorasi · Aktivitas 2
          </span>
          <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
            Ubah Jadi Lebih Baik
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Pernahkah kamu membaca komentar yang terasa kurang nyaman? Sebuah kalimat sebenarnya bisa bertujuan memberi
            saran, tetapi jika kata-katanya kurang tepat, orang lain bisa merasa sedih atau tersinggung. Tugasmu:
            ubahlah setiap kalimat kurang santun menjadi lebih sopan. Kamu tetap boleh memberi saran, asalkan dengan kata
            yang baik.
          </p>
        </div>
        <span className="shrink-0 text-xs font-bold px-3 py-1.5 bg-sky-50 text-sky-600 rounded-full border border-sky-100">
          {selesai}/{KALIMAT_KASAR.length}
        </span>
      </div>

      <div className="space-y-4">
        {KALIMAT_KASAR.map((k, idx) => {
          const sudah = (data[k.id] || '').trim().length > 0;
          return (
            <div key={k.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Kalimat {idx + 1} · {k.konteks}
              </p>

              {/* Bubble chat soal — berubah jadi versi santun secara real-time */}
              {!sudah ? (
                <div className="flex items-start gap-2">
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl rounded-tl-sm px-3 py-2">
                    <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wide mb-0.5">Pesan kurang santun</p>
                    <p className="text-sm text-rose-800 font-medium">"{k.text}"</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 animate-bubble-swap">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl rounded-tl-sm px-3 py-2 flex-1">
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                      Versi lebih baik {justSent === k.id && <CheckCircle2 className="h-3 w-3 animate-heart-beat" />}
                    </p>
                    <p className="text-sm text-emerald-800 font-medium">"{data[k.id]}"</p>
                  </div>
                </div>
              )}

              {/* Form input + tombol Kirim */}
              {!sudah ? (
                <div className="pl-9 space-y-1.5">
                  <label className="text-[11px] font-bold text-emerald-600"> Ubah jadi lebih santun:</label>
                  <div className="flex gap-2">
                    <textarea
                      value={drafts[k.id] || ''}
                      onChange={(e) => setDrafts((d) => ({ ...d, [k.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); kirim(k.id); } }}
                      rows={2}
                      placeholder="Tulis versi yang lebih sopan di sini..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-400 focus:outline-none text-sm resize-none"
                    />
                    <button
                      onClick={() => kirim(k.id)}
                      disabled={!(drafts[k.id] || '').trim()}
                      className="px-4 self-stretch rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 disabled:opacity-40 shrink-0"
                    >
                      Kirim
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-9 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    Berhasil diubah jadi lebih baik!
                  </p>
                  <button
                    onClick={() => editLagi(k.id)}
                    className="text-[11px] font-bold text-sky-500 hover:text-sky-700 underline underline-offset-2"
                  >
                    Ubah lagi
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 italic">
        Saat kamu menekan <b>Kirim</b>, pesan kurang santun akan langsung berubah menjadi versi yang lebih baik.
        Jawabanmu otomatis tersimpan dan dapat dilihat oleh gurumu.
      </p>
    </div>
  );
}
