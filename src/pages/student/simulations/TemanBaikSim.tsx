import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertCircle, CheckCircle, Heart } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface TemanBaikSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface Option {
 text: string;
 isCorrect: boolean;
 points: number;
 feedback: string;
}

interface Scenario {
 id: string;
 platform: 'wa-group' | 'tiktok' | 'wa-private' | 'instagram' | 'game';
 platformLabel: string;
 title: string;
 context: string;
 /* chat bubbles / comments to show */
 feed: { n: string; t: string; buruk?: boolean; baik?: boolean }[];
 prompt: string;
 options: Option[];
}

const SCENARIOS: Scenario[] = [
 {
 id: 'sim-1',
 platform: 'wa-group',
 platformLabel: 'WhatsApp · Grup Kelas 5',
 title: 'Teman Diejek karena Bertanya',
 context: 'Doni bertanya tugas di grup kelas, tetapi Riko malah mengejeknya. Sebagai teman baik, apa responmu?',
 feed: [
 { n: 'Doni', t: 'Teman-teman, aku belum paham tugas halaman 12. Ada yang bisa bantu?' },
 { n: 'Riko', t: 'Masa gitu aja gak bisa? Lambat banget sih ', buruk: true },
 ],
 prompt: 'Bentuk perilaku apa yang Riko lakukan, dan bagaimana respons terbaikmu?',
 options: [
 {
 text: 'Ikut menulis: "Iya nih Doni lemot banget wkwk"',
 isCorrect: false,
 points: 0,
 feedback: ' Itu termasuk cyberbullying. Ikut mengejek membuatmu menjadi pelaku dan membuat Doni makin sedih.',
 },
 {
 text: 'Balas dengan baik: "Tenang Doni, bagian mana yang bingung? Nanti aku bantu jelaskan "',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat! Kamu menunjukkan empati dan memberi bantuan. Ejekan Riko adalah perundungan siber.',
 },
 {
 text: 'Diam saja dan tidak peduli',
 isCorrect: false,
 points: 5,
 feedback: ' Lebih aman daripada ikut mengejek, tetapi sebagai teman baik kamu bisa membela dan membantu Doni.',
 },
 ],
 },
 {
 id: 'sim-2',
 platform: 'tiktok',
 platformLabel: 'Video Pendek · Komentar',
 title: 'Komentar Kasar di Video Teman',
 context: 'Raka mengunggah video membaca puisi. Ia terlihat gugup. Muncul komentar yang menyakiti.',
 feed: [
 { n: '@aldi', t: 'Hahaha kamu gugup banget, malu-maluin ', buruk: true },
 { n: '@mira', t: 'Aku suka puisinya. Terus latihan, ya!', baik: true },
 ],
 prompt: 'Komentar @aldi termasuk perundungan siber. Apa yang sebaiknya kamu tulis?',
 options: [
 {
 text: 'Komentar: "Berani tampil itu keren, Raka! Lain kali suaranya bisa lebih lantang. Semangat! "',
 isCorrect: true,
 points: 20,
 feedback: ' Bagus! Komentarmu memberi apresiasi + saran sopan + semangat. Itu cara penolong digital.',
 },
 {
 text: 'Komentar: "Iya bener, suaranya kecil dan gak jelas banget"',
 isCorrect: false,
 points: 0,
 feedback: ' Itu ikut merundung. Kritik tanpa kata baik bisa membuat Raka malu dan kehilangan percaya diri.',
 },
 {
 text: 'Ikut menulis emoji ""',
 isCorrect: false,
 points: 0,
 feedback: ' Emoji tertawa di situasi ini ikut mempermalukan Raka. Itu termasuk perundungan siber.',
 },
 ],
 },
 {
 id: 'sim-3',
 platform: 'wa-private',
 platformLabel: 'WhatsApp · Chat Pribadi',
 title: 'Teman Curhat Sedih',
 context: 'Sahabatmu, Bima, mengirim pesan pribadi karena sedih nilainya turun.',
 feed: [
 { n: 'Bima', t: 'Aku sedih banget, nilai ulanganku turun ' },
 { n: 'Bima', t: 'Aku takut dimarahi orang tua...' },
 ],
 prompt: 'Sebagai teman baik, balasan paling berempati adalah...',
 options: [
 {
 text: '"Yang sabar ya, Bim. Aku tahu kamu sudah berusaha. Yuk besok kita belajar bareng, pasti bisa lebih baik "',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat! Balasanmu menunjukkan empati, menguatkan, dan menawarkan bantuan nyata.',
 },
 {
 text: '"Ya salah kamu sendiri gak belajar "',
 isCorrect: false,
 points: 0,
 feedback: ' Kalimat itu menyalahkan dan menyakiti. Saat teman sedih, ia butuh dukungan, bukan ejekan.',
 },
 {
 text: 'Baca pesannya tapi tidak dibalas',
 isCorrect: false,
 points: 5,
 feedback: ' Tidak menyakiti, tetapi teman yang sedang sedih sangat butuh dukunganmu. Balaslah dengan baik.',
 },
 ],
 },
 {
 id: 'sim-4',
 platform: 'instagram',
 platformLabel: 'Instagram · Postingan Foto',
 title: 'Foto Teman Disebar Tanpa Izin',
 context: 'Seseorang mengunggah foto Sinta yang sedang terpeleset dan mengejeknya. Banyak yang ikut tertawa.',
 feed: [
 { n: 'akun_iseng', t: ' Foto Sinta jatuh — "Lihat nih lucu banget wkwk"', buruk: true },
 { n: 'komentar', t: '"Hahaha malu-maluin "', buruk: true },
 ],
 prompt: 'Menyebar foto memalukan teman tanpa izin adalah cyberbullying. Tindakan terbaikmu?',
 options: [
 {
 text: 'Laporkan postingan tersebut + kirim pesan dukungan ke Sinta',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat tepat! Melaporkan menghentikan perundungan, dan dukunganmu menguatkan korban.',
 },
 {
 text: 'Ikut membagikan (share) foto itu ke teman lain',
 isCorrect: false,
 points: 0,
 feedback: ' Membagikan foto memalukan menyebarkan perundungan lebih luas dan makin menyakiti Sinta.',
 },
 {
 text: 'Beri komentar "wkwk" biar seru',
 isCorrect: false,
 points: 0,
 feedback: ' Ikut menertawakan membuatmu menjadi pelaku perundungan siber.',
 },
 ],
 },
 {
 id: 'sim-5',
 platform: 'game',
 platformLabel: 'Game Online · Chat',
 title: 'Diejek karena Kalah di Game',
 context: 'Saat bermain game bersama, timmu kalah. Seorang pemain mulai menghina teman setimmu, Tino.',
 feed: [
 { n: 'PlayerX', t: 'Gara-gara Tino kita kalah! Payah, noob, keluar aja sana!', buruk: true },
 { n: 'Tino', t: 'maaf aku masih belajar...' },
 ],
 prompt: 'Hinaan di game juga termasuk perundungan siber. Apa responmu sebagai teman baik?',
 options: [
 {
 text: '"Santai, namanya juga belajar. Kita main lagi yuk, Tino. Kamu pasti makin jago! "',
 isCorrect: true,
 points: 20,
 feedback: ' Bagus! Kamu membela teman dengan sopan dan memberi semangat, bukan ikut menghina.',
 },
 {
 text: '"Iya nih Tino noob banget, ganti player aja!"',
 isCorrect: false,
 points: 0,
 feedback: ' Ikut menghina membuat Tino makin minder. Itu perilaku perundungan siber.',
 },
 {
 text: 'Diam dan lanjut main sendiri',
 isCorrect: false,
 points: 5,
 feedback: ' Tidak ikut menghina itu baik, tetapi membela teman yang dirundung jauh lebih membantu.',
 },
 ],
 },
 {
 id: 'sim-6',
 platform: 'wa-group',
 platformLabel: 'WhatsApp · Grup Kelas 5',
 title: 'Mengajak Menjauhi Teman',
 context: 'Di grup kelas, ada yang mengajak teman-teman untuk tidak mengajak Lina bermain karena hal kecil.',
 feed: [
 { n: 'Fani', t: 'Ayo kita jangan ajak Lina main lagi, dia menyebalkan! Yang setuju react ', buruk: true },
 { n: 'Doni', t: '', buruk: true },
 ],
 prompt: 'Mengajak menjauhi/mengucilkan teman juga termasuk perundungan. Apa pilihanmu?',
 options: [
 {
 text: '"Eh, jangan begitu. Kalau ada masalah lebih baik dibicarakan baik-baik. Lina juga teman kita "',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat! Kamu menjadi penolong digital dengan menengahi dan mengingatkan dengan sopan.',
 },
 {
 text: 'Ikut react biar tidak dimusuhi',
 isCorrect: false,
 points: 0,
 feedback: ' Ikut mengucilkan teman adalah perundungan. Berani membela yang benar lebih penting.',
 },
 {
 text: 'Diam saja karena takut',
 isCorrect: false,
 points: 5,
 feedback: ' Bisa dimengerti, tetapi diam membuat perundungan berlanjut. Kamu bisa lapor ke guru jika ragu menegur.',
 },
 ],
 },
];


export default function TemanBaikSim({ onComplete }: TemanBaikSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const current = SCENARIOS[currentIdx];
 const maxScore = SCENARIOS.length * 20;

 const handleSelect = (idx: number) => {
 if (showFeedback) return;
 setSelectedOpt(idx);
 };

 const handleNext = () => {
 if (selectedOpt === null) return;
 const opt = current.options[selectedOpt];
 if (!showFeedback) {
 setScore((s) => s + opt.points);
 setDecisions((prev) => [...prev, { scenarioId: current.id, choice: opt.text, isCorrect: opt.isCorrect }]);
 setShowFeedback(true);
 } else {
 setShowFeedback(false);
 setSelectedOpt(null);
 if (currentIdx < SCENARIOS.length - 1) {
 setCurrentIdx((i) => i + 1);
 } else {
 setFinished(true);
 canvasConfetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
 }
 }
 };

 const handleComplete = () => {
 onComplete({ score, maxScore, decisions });
 };

 const platformStyle = (p: Scenario['platform']) => {
 switch (p) {
 case 'wa-group':
 case 'wa-private':
 return { head: 'bg-[#075e54]', body: 'bg-[#e5ddd5]' };
 case 'tiktok':
 return { head: 'bg-black', body: 'bg-slate-900' };
 case 'instagram':
 return { head: 'bg-gradient-to-r from-fuchsia-500 to-orange-400', body: 'bg-white' };
 case 'game':
 return { head: 'bg-indigo-700', body: 'bg-slate-100' };
 }
 };

 return (
 <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-pink-50/70 to-rose-50/70 rounded-3xl border border-pink-100 p-6 shadow-xl backdrop-blur-sm">
 <div className="flex justify-between items-center mb-5">
 <h3 className="font-display font-bold text-lg text-pink-800 flex items-center gap-2">
 <Heart className="text-pink-500 w-5 h-5" />
 Simulasi: Jadi Teman Baik Digital
 </h3>
 <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-pink-100 text-pink-700">
 Poin: {score}
 </span>
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={current.id}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-4"
 >
 {/* progress */}
 <div className="flex items-center justify-between text-[11px] font-bold text-pink-600">
 <span className="px-2.5 py-1 rounded-full bg-white border border-pink-100">{current.platformLabel}</span>
 <span>Skenario {currentIdx + 1} / {SCENARIOS.length}</span>
 </div>

 <div>
 <h4 className="font-bold text-sm text-primary-800">{current.title}</h4>
 <p className="text-xs text-primary-500 mt-1 leading-relaxed">{current.context}</p>
 </div>

 {/* Feed mock */}
 <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
 <div className={`${platformStyle(current.platform)?.head} text-white px-3 py-2 text-xs font-bold`}>
 {current.platformLabel}
 </div>
 <div
 className={`${platformStyle(current.platform)?.body} p-3 space-y-1.5`}
 style={
 current.platform.startsWith('wa')
? { backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }
: undefined
 }
 >
 {current.feed.map((m, i) => {
 const onDark = current.platform === 'tiktok';
 return (
 <div key={i} className="flex">
 <div
 className={`relative max-w-[85%] rounded-lg px-2.5 py-1.5 shadow-sm ${
 m.buruk? 'bg-rose-50': m.baik? 'bg-emerald-50': onDark? 'bg-white/10': 'bg-white'
 }`}
 >
 <p className={`text-[11px] font-bold leading-tight ${onDark? 'text-white/80': 'text-slate-500'}`}>
 {m.n}
 </p>
 <p className={`text-[13px] leading-snug ${onDark? 'text-white': 'text-slate-800'}`}>{m.t}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 <p className="text-xs font-bold text-pink-800"> {current.prompt}</p>

 <div className="space-y-2">
 {current.options.map((opt, idx) => (
 <button
 key={idx}
 type="button"
 disabled={showFeedback}
 onClick={() => handleSelect(idx)}
 className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-center gap-3 ${
 selectedOpt === idx
? 'border-pink-400 bg-pink-50/40 text-pink-900'
: 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
 }`}
 >
 <div
 className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
 selectedOpt === idx? 'bg-pink-500 border-pink-500 text-white': 'border-gray-200'
 }`}
 >
 {selectedOpt === idx && <span className="text-[8px]">●</span>}
 </div>
 <span>{opt.text}</span>
 </button>
 ))}
 </div>

 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-4 rounded-2xl border text-xs flex gap-3 ${
 current.options[selectedOpt!].isCorrect
? 'bg-success-50 border-success-100 text-success-800'
: 'bg-danger-50 border-danger-100 text-danger-800'
 }`}
 >
 <div className="shrink-0 mt-0.5">
 {current.options[selectedOpt!].isCorrect? (
 <CheckCircle className="w-5 h-5 text-success-500" />
 ): (
 <AlertCircle className="w-5 h-5 text-danger-500" />
 )}
 </div>
 <div>
 <p className="font-semibold">
 {current.options[selectedOpt!].isCorrect? 'Pilihan Baik!': 'Coba Pikirkan Lagi!'}
 </p>
 <p className="mt-1 leading-relaxed">{current.options[selectedOpt!].feedback}</p>
 </div>
 </motion.div>
 )}

 <div className="flex justify-end">
 <button
 type="button"
 disabled={selectedOpt === null}
 onClick={handleNext}
 className="btn-primary py-3 px-6 rounded-xl font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
 >
 {showFeedback? (currentIdx < SCENARIOS.length - 1? 'Skenario Berikutnya': 'Lihat Hasil'): 'Kirim Pilihan'}
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 ): (
 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-6">
 <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-pink-500">
 <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-pink-800">Kamu Teman Baik Digital! </h4>
 <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
 Kamu sudah berlatih mengenali perundungan siber dan menyusun respons yang sopan serta berempati. Terus
 sebarkan kebaikan di dunia digital, ya!
 </p>
 <div className="mt-4 inline-block bg-white border border-pink-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-pink-400 block font-bold">SKOR TEMAN BAIK</span>
 <span className="text-2xl font-black text-pink-600 font-display">
 {score} / {maxScore}
 </span>
 </div>
 </div>
 <button type="button" onClick={handleComplete} className="btn-primary py-3.5 px-8 rounded-xl font-bold shadow-lg">
 Simpan & Selesai
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
