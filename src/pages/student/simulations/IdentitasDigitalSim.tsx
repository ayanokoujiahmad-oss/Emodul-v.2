import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Check, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface IdentitasDigitalSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface Scenario {
 id: string;
 field: string;
 context: string;
 options: {
 text: string;
 description: string;
 isSafe: boolean;
 points: number;
 feedback: string;
 }[];
}

const SCENARIOS: Scenario[] = [
 {
 id: 'name',
 field: 'Nama Pengguna (Username)',
 context: 'Kamu ingin mendaftar di game online petualangan yang seru. Apa username yang akan kamu pilih?',
 options: [
 {
 text: 'Andi_Pratama_SDN5_2014',
 description: 'Menyertakan nama lengkap, nama sekolah, dan tahun lahir.',
 isSafe: false,
 points: 0,
 feedback: ' Kurang Aman! Menulis nama lengkap, sekolah, dan tahun lahir memudahkan orang asing melacak identitas aslimu.',
 },
 {
 text: 'MegaKsatria99',
 description: 'Nama samaran keren tanpa mencantumkan informasi pribadi.',
 isSafe: true,
 points: 25,
 feedback: ' Sangat Aman! Username ini keren dan tidak membocorkan detail pribadi apa pun ke publik.',
 },
 {
 text: 'AndiPutraBandung',
 description: 'Menyertakan nama depan dan kota tempat tinggal.',
 isSafe: false,
 points: 10,
 feedback: ' Cukup Berbahaya! Menggabungkan nama asli dengan kota tinggal bisa mempersempit pencarian lokasi dirimu.',
 },
 ],
 },
 {
 id: 'photo',
 field: 'Foto Profil (Avatar)',
 context: 'Sekarang pilih foto yang akan dipajang agar teman game-mu bisa mengenali profilmu.',
 options: [
 {
 text: 'Foto Diri Memakai Seragam Sekolah',
 description: 'Menampilkan wajah jelas dan logo sekolah di dada.',
 isSafe: false,
 points: 0,
 feedback: ' Bahaya! Foto seragam membocorkan lokasi sekolahmu. Orang jahat bisa menyalahgunakan informasi ini.',
 },
 {
 text: 'Gambar Karakter Kartun / Avatar Digital',
 description: 'Gambar karakter game, hewan lucu, atau inisial namamu.',
 isSafe: true,
 points: 25,
 feedback: ' Sangat Aman! Di platform umum, menggunakan avatar digital melindungi privasi wajah dan lokasimu.',
 },
 {
 text: 'Foto Wajah Sendiri di Depan Rumah',
 description: 'Menampilkan wajah aslimu dengan latar belakang rumah.',
 isSafe: false,
 points: 10,
 feedback: ' Kurang Aman! Foto wajah asli di tempat tinggal bisa disalahgunakan oleh orang asing yang tidak bertanggung jawab.',
 },
 ],
 },
 {
 id: 'bio',
 field: 'Informasi Profil (Bio)',
 context: 'Kamu ingin menulis deskripsi singkat di halaman profil game-mu. Pilihan bio mana yang paling tepat?',
 options: [
 {
 text: '"Siswa Kelas 6 SDN Cerdas 1 | Chat me di WA: 0812-3456-7890 | Jl. Melati No. 5"',
 description: 'Menulis sekolah, nomor HP aktif, dan alamat rumah lengkap.',
 isSafe: false,
 points: 0,
 feedback: ' Sangat Bahaya! Membagikan nomor WA dan alamat di profil publik sangat rawan penipuan dan kejahatan fisik.',
 },
 {
 text: '"Penyuka petualangan, game strategi, dan kucing lucu! Salam kenal semuanya!"',
 description: 'Membagikan hobi dan hal-hal yang disukai saja.',
 isSafe: true,
 points: 25,
 feedback: ' Sangat Aman! Menuliskan hobi atau minat membuat profilmu ramah namun tetap melindungi privasi pribadimu.',
 },
 ],
 },
 {
 id: 'status',
 field: 'Postingan Pertama (Jejak Digital)',
 context: 'Kamu ingin membagikan momen seru hari ini di feed game. Apa yang akan kamu posting?',
 options: [
 {
 text: 'Foto tangkapan layar (screenshot) skor tertinggimu di game.',
 description: 'Berbagi pencapaian seru di dalam game.',
 isSafe: true,
 points: 25,
 feedback: ' Sangat Aman! Berbagi tangkapan layar game adalah jejak digital positif yang aman dan relevan.',
 },
 {
 text: 'Foto tiket bioskop yang menampilkan kode barcode, nama bioskop, dan jam tayang.',
 description: 'Biar semua tahu kamu sedang menonton film baru.',
 isSafe: false,
 points: 5,
 feedback: ' Kurang Aman! Barcode tiket bisa dicuri, dan lokasi bioskop menunjukkan keberadaan real-time dirimu.',
 },
 ],
 },
];

export default function IdentitasDigitalSim({ onComplete }: IdentitasDigitalSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentScenario = SCENARIOS[currentIdx];
 const maxScore = SCENARIOS.reduce((sum, s) => sum + Math.max(...s.options.map((o) => o.points)), 0);

 const handleSelect = (idx: number) => {
 if (showFeedback) return;
 setSelectedOpt(idx);
 };

 const handleNext = () => {
 if (selectedOpt === null) return;

 const opt = currentScenario.options[selectedOpt];
 
 if (!showFeedback) {
 // Show feedback screen first
 setScore((s) => s + opt.points);
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentScenario.id,
 choice: opt.text,
 isCorrect: opt.isSafe,
 },
 ]);
 setShowFeedback(true);
 } else {
 // Go to next step
 setShowFeedback(false);
 setSelectedOpt(null);
 
 if (currentIdx < SCENARIOS.length - 1) {
 setCurrentIdx((i) => i + 1);
 } else {
 setFinished(true);
 canvasConfetti({
 particleCount: 100,
 spread: 70,
 origin: { y: 0.6 }
 });
 }
 }
 };

 const handleComplete = () => {
 onComplete({
 score,
 maxScore,
 decisions,
 });
 };

 return (
 <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-indigo-50/60 to-violet-50/60 rounded-3xl border border-primary-100 p-6 shadow-xl backdrop-blur-sm">
 <div className="flex justify-between items-center mb-6">
 <h3 className="font-display font-bold text-lg text-primary-700 flex items-center gap-2">
 <Shield className="text-primary-500 w-5 h-5" />
 Simulator Profil Aman
 </h3>
 <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-primary-100 text-primary-600">
 Skor: {score}
 </span>
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentScenario.id}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-5"
 >
 <div className="p-4 bg-white/95 rounded-2xl border border-primary-100">
 <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400">
 Tahap {currentIdx + 1} dari {SCENARIOS.length}: {currentScenario.field}
 </span>
 <p className="text-sm font-medium text-primary-800 mt-1">
 {currentScenario.context}
 </p>
 </div>

 <div className="space-y-3">
 {currentScenario.options.map((opt, idx) => {
 let cardStyle = 'bg-white border-primary-100/60 hover:border-primary-300';
 if (selectedOpt === idx) {
 cardStyle = 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-100';
 }
 if (showFeedback) {
 cardStyle = opt.isSafe 
? 'border-success-400 bg-success-50/30' 
: idx === selectedOpt 
? 'border-danger-400 bg-danger-50/30'
: 'opacity-50 border-primary-100 bg-white';
 }

 return (
 <button
 key={idx}
 type="button"
 disabled={showFeedback}
 onClick={() => handleSelect(idx)}
 className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${cardStyle}`}
 >
 <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
 selectedOpt === idx? 'bg-primary-500 border-primary-500 text-white': 'border-primary-200'
 }`}>
 {selectedOpt === idx && <Check className="w-3. h-3" />}
 </div>
 <div>
 <p className="text-sm font-semibold text-primary-700">{opt.text}</p>
 <p className="text-xs text-primary-400 mt-0.5">{opt.description}</p>
 </div>
 </button>
 );
 })}
 </div>

 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-4 rounded-2xl border text-sm flex gap-3 ${
 currentScenario.options[selectedOpt!].isSafe 
? 'bg-success-50/70 border-success-100 text-success-800' 
: 'bg-warning-50/70 border-warning-100 text-warning-800'
 }`}
 >
 {currentScenario.options[selectedOpt!].isSafe? (
 <Shield className="w-5 h-5 shrink-0 text-success-500 mt-0.5" />
 ): (
 <AlertTriangle className="w-5 h-5 shrink-0 text-warning-500 mt-0.5" />
 )}
 <div>
 <p className="font-semibold">
 {currentScenario.options[selectedOpt!].isSafe? 'Pilihan Bagus!': 'Hati-hati!'}
 </p>
 <p className="mt-0.5 leading-relaxed text-xs">
 {currentScenario.options[selectedOpt!].feedback}
 </p>
 </div>
 </motion.div>
 )}

 <div className="flex justify-end">
 <button
 type="button"
 disabled={selectedOpt === null}
 onClick={handleNext}
 className="btn-primary flex items-center gap-2 py-3 px-6 rounded-xl font-bold shadow-md disabled:opacity-50"
 >
 {showFeedback? 'Lanjut': 'Periksa'}
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 ): (
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="text-center py-6 space-y-6"
 >
 <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-500">
 <Star className="w-10 h-10 fill-primary-400 text-primary-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-primary-800">
 Simulasi Selesai! 
 </h4>
 <p className="text-sm text-primary-500 mt-2 max-w-sm mx-auto">
 Kamu sudah belajar memilah informasi mana yang aman dibagikan di profil onlinemu!
 </p>
 <div className="mt-4 inline-block bg-white border border-primary-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-primary-400 block font-bold">SKOR AKHIR</span>
 <span className="text-2xl font-black text-primary-600 font-display">
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
 );
}
