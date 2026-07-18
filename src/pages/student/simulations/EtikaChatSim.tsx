import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface EtikaChatSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface ChatScenario {
 id: string;
 sender: string;
 senderAvatar: string;
 context: string;
 incomingMessage: string;
 options: {
 text: string;
 type: 'santun' | 'netral' | 'kasar';
 isCorrect: boolean;
 points: number;
 feedback: string;
 }[];
}

const CHATS: ChatScenario[] = [
 {
 id: 'chat-1',
 sender: 'Deni Sekelas',
 senderAvatar: '',
 context: 'Deni kesal karena kelompok belajarnya mendapat nilai jelek gara-gara slide presentasi buatanmu.',
 incomingMessage: 'Woy! Gara-gara slide buatan lu jelek, kelompok kita dapet nilai C nih! Gak becus banget sih kerja kelompok!',
 options: [
 {
 text: 'Maaf ya Den, aku udah coba maksimal kemarin. Di bagian mana yang perlu diperbaiki? Biar nanti aku bantu revisi lagi.',
 type: 'santun',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Santun! Menanggapi kemarahan dengan kepala dingin, meminta maaf secara sopan, dan menawarkan solusi konstruktif.',
 },
 {
 text: 'Minta maaf ya. Tapi kan itu keputusan bersama kemarin.',
 type: 'netral',
 isCorrect: false,
 points: 10,
 feedback: ' Netral. Responnya dingin dan tidak begitu membantu meredakan suasana.',
 },
 {
 text: 'Lah kok salahin gw? Lu sendiri kemarin gak ngebantu apa-apa, cuman numpang nama doang ya! Dasar malas!',
 type: 'kasar',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Cyberbullying! Membalas kata kasar dengan ejekan pribadi hanya akan memperbesar pertengkaran kelompok.',
 },
 ],
 },
 {
 id: 'chat-2',
 sender: 'Angga Teman Game',
 senderAvatar: '',
 context: 'Angga kalah bermain game bersamamu dan menuduhmu bermain curang (cheat) di chat room.',
 incomingMessage: 'Lu menang pasti gara-gara pakai cheat kan?! Cupu banget lu mainnya gak jujur!',
 options: [
 {
 text: 'Lu aja yang mainnya noob! Kalah ya ngaku aja kalah, gausah banyak alasan fitnah orang!',
 type: 'kasar',
 isCorrect: false,
 points: 0,
 feedback: ' Kurang Sopan! Terpancing emosi dan memanggil teman dengan sebutan mengejek ("noob") melanggar netiket.',
 },
 {
 text: 'Aku gak pakai cheat kok. Ini murni karena aku latihan terus kemarin sore. Nanti kita main lagi ya biar seru.',
 type: 'santun',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Santun! Menjelaskan kebenaran tanpa menyerang balik lawan bicara, serta mengajaknya bermain kembali dengan sportif.',
 },
 {
 text: 'Terserah kamu mau ngomong apa.',
 type: 'netral',
 isCorrect: false,
 points: 5,
 feedback: ' Netral. Respon singkat yang cenderung menutup komunikasi secara sepihak.',
 },
 ],
 },
 {
 id: 'chat-3',
 sender: 'Sari Teman Ekskul',
 senderAvatar: '',
 context: 'Sari menanyakan jawaban soal tugas PR matematika di WhatsApp grup ekskul seni.',
 incomingMessage: 'Temen-temen, ada yang punya jawaban tugas matematika halaman 52 nomor 1-5 gak? Bagi dong, mager banget mikir nih.',
 options: [
 {
 text: 'Males banget sih tinggal ngerjain sendiri, kan gampang banget itu. Makanya jangan kebanyakan nonton TV!',
 type: 'kasar',
 isCorrect: false,
 points: 0,
 feedback: ' Kurang Sopan! Menyindir kemalasan teman secara kasar di grup umum merusak hubungan pertemanan.',
 },
 {
 text: 'Hai Sari, sebaiknya tugas PR kita kerjain masing-masing dulu ya. Tapi kalau ada rumus yang kamu bingung, yuk kita bahas bareng-bareng di sini.',
 type: 'santun',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Santun! Menolak memberikan contekan secara halus, namun menawarkan bantuan belajar bersama agar dia memahami pelajarannya.',
 },
 {
 text: 'Cari aja di internet, biasanya ada pembahasannya.',
 type: 'netral',
 isCorrect: false,
 points: 10,
 feedback: ' Netral. Mengarahkan tanpa memberikan kepedulian pertemanan yang hangat.',
 },
 ],
 },
];

export default function EtikaChatSim({ onComplete }: EtikaChatSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentChat = CHATS[currentIdx];
 const maxScore = CHATS.reduce((sum, c) => sum + Math.max(...c.options.map((o) => o.points)), 0);

 const handleSelect = (idx: number) => {
 if (showFeedback) return;
 setSelectedOpt(idx);
 };

 const handleNext = () => {
 if (selectedOpt === null) return;
 const opt = currentChat.options[selectedOpt];

 if (!showFeedback) {
 setScore((s) => s + opt.points);
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentChat.id,
 choice: opt.text,
 isCorrect: opt.isCorrect,
 },
 ]);
 setShowFeedback(true);
 } else {
 setShowFeedback(false);
 setSelectedOpt(null);
 if (currentIdx < CHATS.length - 1) {
 setCurrentIdx((i) => i + 1);
 } else {
 setFinished(true);
 canvasConfetti({
 particleCount: 80,
 spread: 60,
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
 <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[40px] border-[10px] border-slate-700 p-4 shadow-2xl h-[510px] sm:h-[590px] flex flex-col text-white relative">
 {/* Chat header */}
 <div className="flex items-center gap-3 pb-3 border-b border-white/10 shrink-0 select-none">
 <div className="w-9 h-9 rounded-full bg-indigo-500 border border-white/20 flex items-center justify-center text-lg shadow-sm">
 {currentChat.senderAvatar}
 </div>
 <div className="flex-1">
 <p className="text-xs font-bold">{currentChat.sender}</p>
 <p className="text-[9px] text-emerald-400">Online</p>
 </div>
 <MessageCircle className="w-4 h-4 text-white/60" />
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentChat.id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="flex-1 flex flex-col justify-between py-3 min-h-0"
 >
 {/* Scrollable Conversation Area */}
 <div className="flex-1 overflow-y-auto space-y-3 px-1 pr-2 scrollbar-thin">
 {/* Context Label */}
 <div className="text-center">
 <span className="inline-block bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-[9px] leading-relaxed text-slate-300 max-w-[90%]">
 Konteks: {currentChat.context}
 </span>
 </div>

 {/* Incoming Bubble */}
 <div className="flex items-start gap-2 max-w-[85%]">
 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700/50">
 <p className="text-xs text-slate-100 leading-relaxed font-semibold">
 {currentChat.incomingMessage}
 </p>
 </div>
 </div>

 {/* Selected Answer Bubble */}
 {selectedOpt!== null && (
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="flex items-start gap-2 justify-end max-w-[85%] ml-auto"
 >
 <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none border border-indigo-500 text-right">
 <p className="text-xs text-white leading-relaxed">
 {currentChat.options[selectedOpt].text}
 </p>
 </div>
 </motion.div>
 )}

 {/* Feedback Overlay */}
 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-3 rounded-2xl border text-[10px] leading-relaxed ${
 currentChat.options[selectedOpt!].type === 'santun'
? 'bg-success-900/60 border-success-500 text-success-200' 
: currentChat.options[selectedOpt!].type === 'netral'
? 'bg-amber-900/60 border-amber-500 text-amber-200'
: 'bg-danger-900/60 border-danger-500 text-danger-200'
 }`}
 >
 <p className="font-bold text-xs mb-0.5">
 {currentChat.options[selectedOpt!].type === 'santun'? ' Sangat Baik!': ' Perlu Perbaikan!'}
 </p>
 {currentChat.options[selectedOpt!].feedback}
 </motion.div>
 )}
 </div>

 {/* Answer Selector or Next Footer */}
 <div className="mt-3 shrink-0 space-y-2">
 {!showFeedback? (
 <div className="space-y-2">
 <p className="text-[10px] text-slate-400 font-bold px-1">PILIH JAWABAN TERBAIK:</p>
 {currentChat.options.map((opt, idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => handleSelect(idx)}
 className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all ${
 selectedOpt === idx 
? 'border-indigo-400 bg-indigo-900/30' 
: 'border-white/10 bg-slate-900 hover:bg-slate-800'
 }`}
 >
 <span className="font-bold text-indigo-400 mr-1.5">{String.fromCharCode(65 + idx)}.</span>
 {opt.text}
 </button>
 ))}
 </div>
 ): null}

 <button
 type="button"
 disabled={selectedOpt === null}
 onClick={handleNext}
 className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
 >
 {showFeedback? 'Pesan Berikutnya': 'Kirim Balasan'}
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 ): (
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-6"
 >
 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl">
 
 </div>
 <div>
 <h4 className="font-display font-bold text-lg">
 Petualangan Chat Selesai! 
 </h4>
 <p className="text-xs text-white/70 mt-2 max-w-[220px]">
 Hebat! Kamu sudah belajar memilih respon chat WhatsApp yang santun, sabar, dan menyelesaikan masalah tanpa emosi.
 </p>
 <div className="mt-4 inline-block bg-white/10 border border-white/20 px-5 py-2.5 rounded-xl">
 <span className="text-[9px] text-white/50 block font-bold">SKOR ETIKA</span>
 <span className="text-xl font-black text-indigo-300 font-display">
 {score} / {maxScore}
 </span>
 </div>
 </div>
 <button
 type="button"
 onClick={handleComplete}
 className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3 px-8 rounded-xl font-bold text-xs shadow-lg"
 >
 Simpan & Selesai
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
