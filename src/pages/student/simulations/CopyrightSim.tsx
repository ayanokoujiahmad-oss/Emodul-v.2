import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Check, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface CopyrightSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface CopyrightScenario {
 id: string;
 context: string;
 usageDescription: string;
 correctAnswer: 'fair_use' | 'infringement';
 explanation: string;
}

const SCENARIOS: CopyrightScenario[] = [
 {
 id: 'copy-1',
 context: 'Dina sedang membuat slide presentasi tugas sekolah tentang satwa langka. Dia mengunduh beberapa foto komodo dari Google Images dan menyertakan link sumber asli foto tersebut di akhir slide presentasinya.',
 usageDescription: 'Menggunakan foto berhak cipta dari internet untuk tugas presentasi sekolah non-komersial dengan menyertakan kredit sumber.',
 correctAnswer: 'fair_use',
 explanation: ' Boleh Digunakan (Fair Use)! Menggunakan karya untuk tujuan pendidikan sekolah tanpa mengambil keuntungan finansial, serta menyertakan sumber referensi, dikategorikan sebagai penggunaan wajar (Fair Use) yang diijinkan undang-undang.',
 },
 {
 id: 'copy-2',
 context: 'Roni mengunduh lagu mp3 populer berbayar dari sebuah situs web ilegal secara gratis, lalu mengunggah lagu tersebut sebagai musik latar video game buatannya di YouTube yang menghasilkan uang dari iklan.',
 usageDescription: 'Mengunduh musik berhak cipta secara ilegal dan menggunakannya untuk video YouTube yang menghasilkan uang (komersial) tanpa izin pencipta.',
 correctAnswer: 'infringement',
 explanation: ' Melanggar Hak Cipta! Menggunakan lagu berhak cipta untuk proyek komersial (mendatangkan uang) tanpa izin resmi penciptanya dan mengunduhnya secara ilegal adalah pelanggaran hak cipta.',
 },
 {
 id: 'copy-3',
 context: 'Budi menyukai sebuah gambar meme lucu di Twitter. Dia mengambil tangkapan layar (screenshot) meme tersebut dan membagikannya kembali di grup WhatsApp kelasnya untuk menghibur teman-temannya.',
 usageDescription: 'Membagikan ulang meme lucu ke grup chat tertutup untuk tujuan hiburan sosial.',
 correctAnswer: 'fair_use',
 explanation: ' Boleh Digunakan (Fair Use)! Membagikan meme untuk konsumsi pribadi dan bersosialisasi secara non-komersial umumnya merupakan bagian dari kebebasan berekspresi di internet dan tidak melanggar hak cipta.',
 },
 {
 id: 'copy-4',
 context: 'Sari menyalin (copy-paste) seluruh tulisan artikel blog buatan orang lain tentang tips merawat kucing, lalu menempelkannya langsung ke blog barunya sendiri tanpa mengubah kata satu pun dan mengklaim tulisan itu sebagai buatannya sendiri.',
 usageDescription: 'Menjiplak tulisan orang lain secara utuh dan mempublikasikannya kembali dengan mengklaim sebagai karya pribadi (Plagiarisme).',
 correctAnswer: 'infringement',
 explanation: ' Melanggar Hak Cipta! Menjiplak tulisan orang lain secara utuh tanpa modifikasi (plagiarisme) dan mengakuinya sebagai tulisan sendiri melanggar hak moral pencipta asli dan melanggar hukum hak cipta.',
 },
 {
 id: 'copy-5',
 context: 'Angga ingin membuat poster kebersihan sekolah. Dia mencari gambar di situs penyedia aset gratisan dan menemukan ilustrasi berlisensi "Creative Commons (CC-BY)". Angga mencantumkan nama ilustratornya di sudut bawah poster.',
 usageDescription: 'Menggunakan gambar berlisensi bebas Creative Commons dengan mematuhi syarat lisensi (menyertakan atribusi pencipta).',
 correctAnswer: 'fair_use',
 explanation: ' Boleh Digunakan! Creative Commons adalah lisensi yang memperbolehkan orang lain menggunakan karyanya secara gratis selama mematuhi syarat lisensinya (seperti menyertakan nama pembuat gambar).',
 },
];

export default function CopyrightSim({ onComplete }: CopyrightSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [choice, setChoice] = useState<'fair_use' | 'infringement' | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentScenario = SCENARIOS[currentIdx];
 const maxScore = SCENARIOS.length * 20;

 const handleDecision = (val: 'fair_use' | 'infringement') => {
 if (showFeedback) return;
 setChoice(val);
 const isCorrect = val === currentScenario.correctAnswer;

 setScore((s) => s + (isCorrect? 20: 0));
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentScenario.id,
 choice: val === 'fair_use'? 'Fair Use': 'Melanggar',
 isCorrect,
 },
 ]);
 setShowFeedback(true);
 };

 const handleNext = () => {
 setShowFeedback(false);
 setChoice(null);
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
 <BookOpen className="text-primary-500 w-5 h-5" />
 Simulator Hak Cipta Digital (Copyright)
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
 className="space-y-4"
 >
 {/* Context Card */}
 <div className="bg-white/95 rounded-2xl border border-primary-100 p-5 shadow-sm space-y-3">
 <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400">
 Skenario Penggunaan {currentIdx + 1} dari {SCENARIOS.length}
 </span>
 <p className="text-xs text-gray-700 leading-relaxed font-medium">
 {currentScenario.context}
 </p>
 <div className="p-3 bg-primary-50/40 rounded-xl border border-primary-50 text-[10px] text-primary-600 flex gap-2 items-start">
 <FileText className="w-4 h-4 shrink-0 text-primary-400 mt-0.5" />
 <span><b>Tindakan:</b> {currentScenario.usageDescription}</span>
 </div>
 </div>

 {/* Prompt */}
 <p className="text-xs font-bold text-primary-700 text-center">
 Menurut aturan hak cipta digital, apakah tindakan di atas diperbolehkan?
 </p>

 {/* Decision Actions */}
 <div className="grid grid-cols-2 gap-4">
 {[
 { type: 'fair_use', label: ' BOLEH / FAIR USE', desc: 'Penggunaan wajar diizinkan', color: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' },
 { type: 'infringement', label: ' MELANGGAR HAK CIPTA', desc: 'Melanggar hukum cipta/plagiat', color: 'border-rose-200 text-rose-700 hover:bg-rose-50' },
 ].map((btn) => {
 let activeStyle = '';
 if (choice === btn.type) {
 activeStyle = 'ring-2 ring-offset-1 ring-primary-400 bg-primary-50/40 border-primary-300';
 }
 if (showFeedback) {
 if (btn.type === currentScenario.correctAnswer) {
 activeStyle = 'bg-success-100 border-success-400 text-success-800';
 } else if (btn.type === choice) {
 activeStyle = 'bg-danger-100 border-danger-400 text-danger-800 opacity-50';
 } else {
 activeStyle = 'opacity-30 border-gray-250';
 }
 }

 return (
 <button
 key={btn.type}
 type="button"
 disabled={showFeedback}
 onClick={() => handleDecision(btn.type as any)}
 className={`p-4 border rounded-2xl text-center bg-white transition-all ${btn.color} ${activeStyle}`}
 >
 <span className="font-bold text-xs sm:text-sm block">{btn.label}</span>
 <span className="text-[9px] opacity-70 mt-1 block">{btn.desc}</span>
 </button>
 );
 })}
 </div>

 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-4 rounded-2xl border text-xs flex gap-3 ${
 choice === currentScenario.correctAnswer 
? 'bg-success-50/80 border-success-100 text-success-800' 
: 'bg-danger-50/80 border-danger-100 text-danger-800'
 }`}
 >
 <div className="shrink-0 mt-0.5">
 {choice === currentScenario.correctAnswer? (
 <Check className="w-5 h-5 text-success-500" />
 ): (
 <AlertTriangle className="w-5 h-5 text-danger-500" />
 )}
 </div>
 <div>
 <p className="font-semibold text-sm">
 {choice === currentScenario.correctAnswer? 'Analisis Tepat! (+20 Poin)': 'Kurang Tepat! (0 Poin)'}
 </p>
 <p className="mt-1 leading-relaxed text-xs">{currentScenario.explanation}</p>
 </div>
 </motion.div>
 )}

 <div className="flex justify-end">
 <button
 type="button"
 disabled={choice === null}
 onClick={handleNext}
 className="btn-primary py-3 px-6 rounded-xl font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
 >
 Lanjut
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
 <BookOpen className="w-10 h-10 text-primary-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-primary-800">
 Pendidikan Hak Cipta Selesai! 
 </h4>
 <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
 Hebat! Kamu sekarang tahu bedanya penjiplakan ilegal dengan penggunaan wajar (Fair Use) untuk pendidikan sekolah.
 </p>
 <div className="mt-4 inline-block bg-white border border-primary-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-primary-400 block font-bold">SKOR ETIS HAK CIPTA</span>
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
