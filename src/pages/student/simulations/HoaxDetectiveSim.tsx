import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
 Search,
 AlertCircle,
 ArrowRight,
 ShieldCheck,
 Share2,
 MessageCircle,
 ThumbsUp,
 Clock,
 BadgeCheck,
 Eye,
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';


interface HoaxDetectiveSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface Article {
 id: string;
 headline: string;
 excerpt: string;
 body: string;
 source: string;
 sourceVerified: boolean;
 author: string;
 category: string;
 date: string;
 readTime: string;
 views: string;
 likes: string;
 shares: string;
 heroEmoji: string;
 heroBg: string;
 imageUrl?: string;
 details: {
 sourceCheck: string;
 dateCheck: string;
 factCheck: string;
 compareCheck: string;
 };
 correctType: 'fakta' | 'opini' | 'hoax';
 explanation: string;
}

const ARTICLES: Article[] = [
 {
 id: 'news-1',
 headline: 'AWAS! Pisang yang Disuntik Darah HIV Beredar di Supermarket!',
 excerpt: 'Beredar kabar viral mengenai buah pisang impor dari Thailand yang disuntik dengan darah tercemar virus HIV di berbagai supermarket terdekat.',
 body: 'PERINGATAN UNTUK KITA SEMUA!! Baru saja tim relawan kami mendapatkan laporan rahasia langsung dari "orang dalam" bea cukai pelabuhan, bahwa ribuan ton buah pisang impor asal Thailand yang masuk minggu ini telah sengaja disuntik dengan darah segar penderita virus HIV positif sebelum didistribusikan. Tujuannya adalah untuk menyebarkan penyakit mematikan ini secara cepat ke tengah-tengah masyarakat Indonesia. Katanya, pisang-pisang berbahaya ini sudah mulai dijual bebas di berbagai jaringan supermarket besar di dekat kompleks perumahan kita. Ciri utamanya adalah kulit pisang yang memiliki bintik-bintik kehitaman mencurigakan. JANGAN BELI ATAU KONSUMSI PISANG DENGAN BINTIK HITAM! Harap segera teruskan (share) peringatan darurat ini ke minimal 20 grup kontak WhatsApp terdekat Anda demi menyelamatkan keluarga kita semua sebelum terlambat!',
 source: 'beritaheboh-viral77.blogspot.xyz',
 sourceVerified: false,
 author: 'Admin (Anonim)',
 category: 'VIRAL KESEHATAN',
 date: 'Kemarin · tanpa tahun',
 readTime: '3 mnt baca',
 views: '2,1 jt',
 likes: '45 rb',
 shares: '120 rb',
 heroEmoji: '',
 heroBg: 'from-red-400 to-orange-400',
 imageUrl: '/pisang_hiv_hoax.png',
 details: {
 sourceCheck: ' Website pengirim berita ini penuh dengan iklan pop-up aneh dan tidak terdaftar di Dewan Pers. Penulisnya anonim.',
 dateCheck: ' Berita ini ternyata pernah beredar pada tahun 2015, lalu diunggah kembali kemarin tanpa ada konfirmasi tanggal resmi.',
 factCheck: ' Menurut kedokteran, virus HIV tidak bisa bertahan hidup di luar tubuh manusia, apalagi di dalam buah pisang. Ini secara ilmiah tidak mungkin.',
 compareCheck: ' Di portal berita resmi nasional, semua dokter menyatakan berita ini adalah kabar bohong lama yang sengaja disebarkan ulang.',
 },
 correctType: 'hoax',
 explanation: 'Berita ini adalah HOAKS karena secara ilmiah virus HIV tidak hidup di buah, dan disebarkan tanpa sumber terpercaya.',
 },
 {
 id: 'news-2',
 headline: 'Pemerintah Membuka Beasiswa Digital Talent untuk Anak Sekolah Dasar',
 excerpt: 'Kementerian Komunikasi meluncurkan beasiswa coding gratis untuk 5.000 siswa SD guna meningkatkan kecakapan digital anak sejak dini.',
 body: 'JAKARTA — Kementerian Komunikasi dan Digital (Komdigi) bekerja sama dengan beberapa platform edukasi teknologi hari ini resmi mengumumkan peluncuran program beasiswa "Digital Talent Cilik 2026" yang ditargetkan bagi 5.000 murid sekolah dasar berprestasi di seluruh Indonesia. Program ini menyediakan pelatihan gratis berupa pembuatan game sederhana (coding) dan pengenalan dasar-dasar keamanan siber yang akan berlangsung selama tiga bulan mulai awal semester depan. Proses pendaftaran seluruhnya dilakukan secara online secara gratis melalui portal resmi kementerian dengan syarat melampirkan rapor sekolah terakhir dan surat persetujuan orang tua. "Melalui beasiswa ini, kami ingin membekali generasi muda kita dengan kecakapan digital dasar agar mampu bersaing kreatif secara sehat di masa depan," jelas Menteri Komdigi dalam pidato pers resminya.',
 source: 'komdigi.go.id',
 sourceVerified: true,
 author: 'Redaksi Komdigi',
 category: 'PENDIDIKAN',
 date: '10 Juni 2026 · 09.15 WIB',
 readTime: '4 mnt baca',
 views: '88 rb',
 likes: '6,2 rb',
 shares: '3,4 rb',
 heroEmoji: '',
 heroBg: 'from-emerald-400 to-teal-500',
 imageUrl: '/beasiswa_coding_fakta.png',
 details: {
 sourceCheck: ' Sumber berita berasal langsung dari website berakhiran.go.id (website resmi instansi pemerintah Indonesia).',
 dateCheck: ' Rilis tanggal berita tertera jelas: 10 Juni 2026, ditandatangani oleh menteri terkait.',
 factCheck: ' Pendaftaran program beasiswa ini diverifikasi aktif di halaman resmi program dengan jadwal dan syarat lengkap.',
 compareCheck: ' Berita ini juga diliput oleh berbagai media besar nasional seperti Kompas, Antara, dan Tempo dengan rincian yang sama.',
 },
 correctType: 'fakta',
 explanation: 'Berita ini adalah FAKTA karena bersumber dari domain resmi pemerintah (.go.id) dan terverifikasi oleh berbagai media tepercaya.',
 },
 {
 id: 'news-3',
 headline: 'Bermain Game Online Adalah Cara Terbaik untuk Belajar Bahasa Inggris',
 excerpt: 'Beberapa murid kelas 6 berpendapat bahwa bermain game online jauh lebih cepat dan seru untuk menguasai bahasa Inggris dibanding belajar di kelas.',
 body: 'Halo teman-teman gamer semua! Kalian sadar gak sih kalau belajar bahasa Inggris lewat pelajaran di kelas itu membosankan banget? Nah, menurut kami anak-anak kelas 6, bermain game online dengan server luar negeri itu adalah cara PALING TOP, paling seru, dan paling cepat buat bikin kita langsung lancar berbahasa Inggris! Dibandingkan harus mendengarkan penjelasan tata bahasa yang rumit dari guru di papan tulis sampai pusing, mending kita main game online tembak-tembakan atau petualangan bareng teman-teman luar negeri tiap malam. Di dalam game kita dipaksa ngomong pakai bahasa Inggris biar menang. Pokoknya kalau kalian mau pintar ngomong bahasa Inggris, gak usah belajar teori di sekolah, langsung instal game aja di HP kalian, dijamin langsung jago cas-cis-cus!',
 source: 'Status media sosial @gamer_kelas6',
 sourceVerified: false,
 author: 'Postingan Pribadi',
 category: 'OPINI WARGANET',
 date: '5 hari yang lalu',
 readTime: '3 mnt baca',
 views: '15 rb',
 likes: '1,1 rb',
 shares: '230',
 heroEmoji: '',
 heroBg: 'from-blue-400 to-indigo-500',
 imageUrl: '/belajar_inggris_game.png',
 details: {
 sourceCheck: ' Sumbernya hanya postingan pribadi seorang gamer di media sosial dan tidak ada kutipan dari ahli pendidikan.',
 dateCheck: ' Ditulis baru saja, setelah viralnya turnamen game sekolah.',
 factCheck: ' Belum ada penelitian ilmiah tunggal yang menyatakan game online adalah cara "terbaik". Metode belajar setiap orang berbeda-beda.',
 compareCheck: ' Para ahli pendidikan menyatakan game bisa membantu, tetapi tetap membutuhkan panduan guru dan buku pelajaran untuk tata bahasa.',
 },
 correctType: 'opini',
 explanation: 'Pernyataan ini adalah OPINI karena merupakan penilaian subjektif pribadi dan bukan merupakan kebenaran ilmiah mutlak.',
 },
];


export default function HoaxDetectiveSim({ onComplete }: HoaxDetectiveSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [activeTool, setActiveTool] = useState<string | null>(null);
 const [investigated, setInvestigated] = useState<Record<string, boolean>>({});
 const [classification, setClassification] = useState<'fakta' | 'opini' | 'hoax' | null>(null);
 const [showExplanation, setShowExplanation] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentArticle = ARTICLES[currentIdx];
 const maxScore = ARTICLES.length * 30;

 const handleToolClick = (toolKey: string) => {
 setActiveTool(toolKey);
 setInvestigated((prev) => ({
...prev,
 [`${currentArticle.id}_${toolKey}`]: true,
 }));
 };

 const handleClassify = (type: 'fakta' | 'opini' | 'hoax') => {
 if (showExplanation) return;
 setClassification(type);
 };

 const handleCheck = () => {
 if (classification === null) return;
 const isCorrect = classification === currentArticle.correctType;
 let earned = 0;
 if (isCorrect) {
 earned = 30;
 // Bonus if investigated all tools
 const tools = ['sourceCheck', 'dateCheck', 'factCheck', 'compareCheck'];
 const allDone = tools.every((t) => investigated[`${currentArticle.id}_${t}`]);
 if (allDone) earned += 10;
 }

 setScore((s) => s + earned);
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentArticle.id,
 choice: classification,
 isCorrect,
 },
 ]);
 setShowExplanation(true);
 };

 const handleNext = () => {
 setShowExplanation(false);
 setClassification(null);
 setActiveTool(null);
 if (currentIdx < ARTICLES.length - 1) {
 setCurrentIdx((i) => i + 1);
 } else {
 setFinished(true);
 canvasConfetti({
 particleCount: 80,
 spread: 60,
 origin: { y: 0.6 }
 });
 }
 };

 const handleComplete = () => {
 onComplete({
 score,
 maxScore: ARTICLES.length * 40, // max including bonus
 decisions,
 });
 };

 return (
 <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
 {/* App Top Bar (Detektif mode) */}
 <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
 <h3 className="font-display font-bold text-base flex items-center gap-2">
 <Search className="w-5 h-5" />
 Detektif Fakta
 </h3>
 <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm">
 Skor: {score}
 </span>
 </div>

 {/* Fake Browser Address Bar */}
 {!finished && (
 <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
 <div className="flex gap-1.5">
 <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
 <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
 <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
 </div>
 <div className="flex-1 flex items-center gap-1.5 bg-white rounded-full px-3 py-1 border border-gray-200 text-[10px] text-gray-500 font-medium truncate">
 {currentArticle.sourceVerified ? (
 <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
 ) : (
 <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
 )} {currentArticle.source}
 </div>
 </div>
 )}

 <div className="p-5 sm:p-6 bg-gradient-to-br from-gray-50/50 to-amber-50/20">
 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentArticle.id}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-5"
 >
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
 Berita {currentIdx + 1} dari {ARTICLES.length}
 </span>
 <span className="text-[10px] font-bold text-gray-400">Geser & selidiki sebelum memutuskan </span>
 </div>

 {/* News Article Card — looks like a real news portal */}
 <article className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
 {/* Hero image area */}
 <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex items-center justify-center border-b border-gray-200">
 {currentArticle.imageUrl? (
 <img
 src={currentArticle.imageUrl}
 alt={currentArticle.headline}
 className="w-full h-full object-cover"
 />
 ): (
 <div className={`w-full h-full bg-gradient-to-br ${currentArticle.heroBg} flex items-center justify-center`}>
 <span className="text-6xl drop-shadow-lg">{currentArticle.heroEmoji}</span>
 </div>
 )}
 <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-white/95 text-gray-800 px-2.5 py-1 rounded-full shadow-sm border border-gray-200">
 {currentArticle.category}
 </span>
 </div>

 <div className="p-5 space-y-3">
 <h4 className="font-display font-extrabold text-lg text-gray-900 leading-snug">
 {currentArticle.headline}
 </h4>

 {/* Byline */}
 <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
 <span className="flex items-center gap-1 font-semibold text-gray-700">
 {currentArticle.author}
 {currentArticle.sourceVerified && (
 <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
 )}
 </span>
 <span className="text-gray-300">•</span>
 <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentArticle.date}</span>
 <span className="text-gray-300">•</span>
 <span>{currentArticle.readTime}</span>
 </div>

 <hr className="border-gray-100" />

 {/* Body text */}
 <p className="text-sm text-gray-700 leading-relaxed first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-amber-500">
 {currentArticle.body}
 </p>

 {/* Engagement bar */}
 <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500 font-semibold">
 <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {currentArticle.views}</span>
 <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {currentArticle.likes}</span>
 <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> komentar</span>
 <span className="flex items-center gap-1 text-amber-600"><Share2 className="w-3.5 h-3.5" /> {currentArticle.shares}</span>
 </div>
 </div>
 </article>


 {/* Investigation Tools */}
 <div className="space-y-2">
 <p className="text-xs font-bold text-amber-800"> Alat Detektif (Gunakan untuk menyelidiki):</p>
 <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
 {[
 { key: 'sourceCheck', label: 'Cek Sumber', color: 'border-blue-100 text-blue-700 hover:bg-blue-50' },
 { key: 'dateCheck', label: 'Cek Tanggal', color: 'border-purple-100 text-purple-700 hover:bg-purple-50' },
 { key: 'factCheck', label: 'Cek Fakta Medis/Ahli', color: 'border-emerald-100 text-emerald-700 hover:bg-emerald-50' },
 { key: 'compareCheck', label: 'Bandingkan Berita', color: 'border-pink-100 text-pink-700 hover:bg-pink-50' },
 ].map((tool) => {
 const isChecked = investigated[`${currentArticle.id}_${tool.key}`];
 return (
 <button
 key={tool.key}
 type="button"
 onClick={() => handleToolClick(tool.key)}
 className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all ${tool.color} ${
 isChecked? 'ring-2 ring-amber-300 bg-white/70': 'bg-white'
 }`}
 >
 {isChecked? ' ': ''}{tool.label}
 </button>
 );
 })}
 </div>
 </div>

 {/* Tool Result Output */}
 <AnimatePresence mode="wait">
 {activeTool && (
 <motion.div
 key={activeTool}
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="bg-white/80 p-4 rounded-2xl border border-amber-100/50 text-xs text-gray-700 leading-relaxed shadow-inner"
 >
 <p className="font-bold mb-1 text-amber-800">
 Hasil {activeTool === 'sourceCheck'? 'Cek Sumber': activeTool === 'dateCheck'? 'Cek Tanggal': activeTool === 'factCheck'? 'Cek Fakta': 'Perbandingan Media'}:
 </p>
 {currentArticle.details[activeTool as keyof typeof currentArticle.details]}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Classification Actions */}
 <div className="space-y-2">
 <p className="text-xs font-bold text-amber-800"> Hasil Keputusan Detektif:</p>
 <div className="grid grid-cols-3 gap-2">
 {[
 { type: 'fakta', label: ' FAKTA', desc: 'Informasi benar & valid', color: 'border-success-200 text-success-700 hover:bg-success-50' },
 { type: 'opini', label: ' OPINI', desc: 'Sikap/Pendapat pribadi', color: 'border-blue-200 text-blue-700 hover:bg-blue-50' },
 { type: 'hoax', label: ' HOAKS', desc: 'Kabar bohong/palsu', color: 'border-danger-200 text-danger-700 hover:bg-danger-50' },
 ].map((btn) => {
 let activeStyle = '';
 if (classification === btn.type) {
 activeStyle = 'ring-2 ring-offset-1 ring-amber-400 bg-amber-50/40 border-amber-300';
 }
 if (showExplanation) {
 if (btn.type === currentArticle.correctType) {
 activeStyle = 'bg-success-100 border-success-400 text-success-800';
 } else if (btn.type === classification) {
 activeStyle = 'bg-danger-100 border-danger-400 text-danger-800 opacity-50';
 } else {
 activeStyle = 'opacity-30 border-gray-200';
 }
 }

 return (
 <button
 key={btn.type}
 type="button"
 disabled={showExplanation}
 onClick={() => handleClassify(btn.type as any)}
 className={`p-3 border rounded-2xl text-center bg-white transition-all ${btn.color} ${activeStyle}`}
 >
 <span className="font-bold text-sm block">{btn.label}</span>
 <span className="text-[9px] opacity-70 mt-0.5 block">{btn.desc}</span>
 </button>
 );
 })}
 </div>
 </div>

 {showExplanation && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-4 rounded-2xl border text-xs flex gap-3 ${
 classification === currentArticle.correctType 
? 'bg-success-50/80 border-success-100 text-success-800' 
: 'bg-danger-50/80 border-danger-100 text-danger-800'
 }`}
 >
 <div className="shrink-0 mt-0.5">
 {classification === currentArticle.correctType? (
 <ShieldCheck className="w-5 h-5 text-success-500" />
 ): (
 <AlertCircle className="w-5 h-5 text-danger-500" />
 )}
 </div>
 <div>
 <p className="font-semibold text-sm">
 {classification === currentArticle.correctType? 'Tebakanmu Tepat! (+30 Poin)': 'Jawaban Salah! (0 Poin)'}
 </p>
 <p className="mt-1 leading-relaxed">{currentArticle.explanation}</p>
 </div>
 </motion.div>
 )}

 <div className="flex justify-end">
 {!showExplanation? (
 <button
 type="button"
 disabled={classification === null}
 onClick={handleCheck}
 className="btn-primary py-3 px-6 rounded-xl font-bold shadow-md disabled:opacity-50"
 >
 Ajukan Hasil
 </button>
 ): (
 <button
 type="button"
 onClick={handleNext}
 className="btn-primary py-3 px-6 rounded-xl font-bold shadow-md flex items-center gap-2"
 >
 Lanjut
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
 </div>
 </motion.div>
 ): (
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="text-center py-6 space-y-6"
 >
 <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
 <ShieldCheck className="w-10 h-10 text-amber-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-amber-800">
 Penyelidikan Selesai! 
 </h4>
 <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
 Kamu luar biasa! Sekarang kamu tahu cara membedakan mana berita asli, opini, dan hoaks yang merugikan.
 </p>
 <div className="mt-4 inline-block bg-white border border-amber-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-amber-400 block font-bold">SKOR DETEKTIF</span>
 <span className="text-2xl font-black text-amber-600 font-display">
 {score} / {maxScore}
 </span>
 </div>
 </div>
 <button
 type="button"
 onClick={handleComplete}
 className="btn-primary py-3.5 px-8 rounded-xl font-bold shadow-lg"
 >
 Simpan & Selesai
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
