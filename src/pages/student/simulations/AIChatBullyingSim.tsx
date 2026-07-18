import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ShieldAlert, CheckCircle2, Send, ArrowRight } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface AIChatBullyingSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface BullyScenario {
 id: string;
 sender: string;
 senderAvatar: string;
 context: string;
 bullyMessage: string;
}

const SCENARIOS: BullyScenario[] = [
 {
 id: 'bullying-1',
 sender: 'Randi (Grup Kelompok)',
 senderAvatar: '',
 context: 'Randi kesal di WhatsApp grup kelompok belajar karena merasa kerjamu lambat.',
 bullyMessage: 'Gak usah sok pinter deh lo di grup ini, tugas kelompok buatan lo tuh sampah banget! Mending keluar aja dari kelompok kita, bikin turun nilai aja!',
 },
 {
 id: 'bullying-2',
 sender: 'Fani (Chat Pribadi)',
 senderAvatar: '',
 context: 'Fani mengancammu di chat pribadi agar kamu tidak melaporkan kecurangannya saat ujian.',
 bullyMessage: 'Heh! Awas ya lo kalau berani ngadu ke guru soal gw nyontek kemarin. Rahasia foto memalukan lo waktu kelas 5 bakal gw sebarin ke seluruh Instagram sekolah biar lo malu!',
 },
 {
 id: 'bullying-3',
 sender: 'Akun Anonim (Komentar Sosmed)',
 senderAvatar: '',
 context: 'Seseorang yang tidak dikenal meninggalkan komentar mengejek di video kreasi yang kamu unggah.',
 bullyMessage: 'Muka pas-pasan kayak monyet gini kok pede banget sih posting video nari wkwk. Sumpah bikin rusak mata aja yang ngeliat, mending hapus deh akun lo!',
 },
];

export default function AIChatBullyingSim({ onComplete }: AIChatBullyingSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [inputText, setInputText] = useState('');
 const [chatHistory, setChatHistory] = useState<any[]>([]);
 const [isAiTyping, setIsAiTyping] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<any[]>([]);
 const [finished, setFinished] = useState(false);
 const [showExplanation, setShowExplanation] = useState(false);


 const chatEndRef = useRef<HTMLDivElement>(null);
 const scenario = SCENARIOS[currentIdx];

 // Auto-scroll chat
 useEffect(() => {
 chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [chatHistory, isAiTyping]);

 // Load new scenario
 useEffect(() => {
 if (currentIdx < SCENARIOS.length) {
 setChatHistory([
 {
 sender: 'system',
 text: ` Konteks: ${SCENARIOS[currentIdx].context}`,
 },
 {
 sender: 'bully',
 name: SCENARIOS[currentIdx].sender,
 avatar: SCENARIOS[currentIdx].senderAvatar,
 text: SCENARIOS[currentIdx].bullyMessage,
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 },
 ]);
 setShowExplanation(false);
 }
 }, [currentIdx]);

 // Client-side smart AI evaluator
 const evaluateResponse = (text: string) => {
 const cleanText = text.toLowerCase().trim();

 // Swear/rude/counter-bullying words
 const rudeWords = [
 'bodoh', 'tolol', 'jelek', 'anjing', 'bego', 'monyet', 'babi', 'goblok', 'bacot', 
 'mati', 'cupu', 'lo ', 'lu ', 'ngajak berantem', 'balas', 'awas lo', 'bacot', 'bangsat'
 ];
 // Passive/apologetic words
 const passiveWords = [
 'maaf', 'maafkan', 'ya udah', 'terserah', 'jangan sebarin', 'plis', 'tolong jangan',
 'sedih', 'nangis'
 ];
 // Assertive/safe/reporting words
 const safeWords = [
 'lapor', 'laporkan', 'guru', 'orang tua', 'hentikan', 'sopan', 'salah', 'tidak benar',
 'bukti', 'screenshot', 'blokir', 'berhenti', 'tidak sopan', 'sekolah', 'simpan'
 ];

 let type: 'rude' | 'passive' | 'assertive' = 'passive';
 let pts = 10;
 let feedback = '';

 const containsRude = rudeWords.some(w => cleanText.includes(w));
 const containsSafe = safeWords.some(w => cleanText.includes(w));
 const containsPassive = passiveWords.some(w => cleanText.includes(w));

 if (containsRude) {
 type = 'rude';
 pts = 10;
 feedback = 'Responmu bernada emosional atau membalas dengan kata-kata kasar. Membalas cyberbullying dengan makian balik berisiko memperparah pertengkaran dan membuatmu ikut bersalah di mata aturan sekolah.';
 } else if (containsSafe || (cleanText.length >= 10 &&!containsPassive)) {
 type = 'assertive';
 pts = 33; // ~100 max score over 3 rounds
 feedback = 'Sangat Bagus! Kamu merespon dengan tegas, tenang, menolak diintimidasi, dan menyatakan kesiapan untuk mengambil langkah aman (seperti menyimpan screenshot bukti obrolan dan melaporkannya ke guru atau orang tua).';
 } else {
 type = 'passive';
 pts = 20;
 feedback = 'Tanggapanmu cenderung pasif atau meminta maaf atas kesalahan yang tidak kamu lakukan. Memohon atau bersikap pasrah sering kali membuat perundung merasa menang dan terus mengganggumu.';
 }

 return { type, pts, feedback, isCorrect: type === 'assertive' };
 };

 const handleSend = () => {
 if (!inputText.trim() || isAiTyping || showExplanation) return;

 const userText = inputText.trim();
 setInputText('');

 // Add user bubble
 setChatHistory(prev => [
...prev,
 {
 sender: 'user',
 text: userText,
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 }
 ]);

 // AI thinking state
 setIsAiTyping(true);

 setTimeout(() => {
 setIsAiTyping(false);
 const evalRes = evaluateResponse(userText);
 setScore(s => s + evalRes.pts);
 setDecisions(prev => [
...prev,
 {
 scenarioId: scenario.id,
 choice: userText,
 isCorrect: evalRes.isCorrect,
 }
 ]);

 setShowExplanation(true);

 // Add AI Mentor bubble
 setChatHistory(prev => [
...prev,
 {
 sender: 'ai',
 name: 'AI Mentor Cerdas',
 avatar: 'AI',
 text: `Halo! Saya AI Mentor. Analisis tanggapanmu:\n\n Kamu menjawab: "${userText}"\n\n ${evalRes.feedback}\n\n Rekomendasi: Gunakan kalimat tegas seperti "Tolong hentikan obrolan tidak sopan ini", lalu simpan bukti obrolan dan segera laporkan kepada guru atau orang tuamu.`,
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 type: evalRes.type
 }
 ]);
 }, 2000);
 };

 const handleNext = () => {
 if (currentIdx < SCENARIOS.length - 1) {
 setCurrentIdx(i => i + 1);
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
 // Round score to max 100
 const finalScore = Math.min(score, 100);
 onComplete({
 score: finalScore,
 maxScore: 100,
 decisions,
 });
 };

 return (
 <div className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[40px] border-[10px] border-slate-700 p-4 shadow-2xl h-[520px] sm:h-[610px] flex flex-col text-white relative">
 {/* Smartphone Top Notch & Header */}
 <div className="flex items-center gap-3 pb-3 border-b border-white/10 shrink-0 select-none">
 <div className="w-10 h-10 rounded-full bg-indigo-500 border border-white/20 flex items-center justify-center text-lg shadow-sm">
 {finished? '': scenario.senderAvatar}
 </div>
 <div className="flex-1">
 <p className="text-xs font-bold">{finished? 'Selesai Simulasi': scenario.sender}</p>
 <p className="text-[9px] text-emerald-400">Evaluator AI Aktif</p>
 </div>
 <Bot className="w-5 h-5 text-primary-400 animate-pulse" />
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={scenario.id}
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="flex-1 flex flex-col justify-between py-2 min-h-0"
 >
 {/* Chat Conversation Area */}
 <div className="flex-1 overflow-y-auto space-y-3 px-1 pr-2 scrollbar-none py-2">
 {chatHistory.map((chat, idx) => {
 if (chat.sender === 'system') {
 return (
 <div key={idx} className="text-center">
 <span className="inline-block bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-[9px] leading-relaxed text-slate-300 max-w-[90%] shadow-sm">
 {chat.text}
 </span>
 </div>
 );
 }

 if (chat.sender === 'bully') {
 return (
 <div key={idx} className="flex items-start gap-2 max-w-[85%]">
 <span className="text-xl shrink-0 mt-1">{chat.avatar}</span>
 <div className="bg-slate-800/90 border border-slate-700/50 p-3 rounded-2xl rounded-tl-none">
 <p className="text-[10px] font-bold text-slate-400 mb-0.5">{chat.name}</p>
 <p className="text-xs text-slate-100 leading-relaxed font-medium">
 {chat.text}
 </p>
 <span className="text-[8px] text-slate-500 block text-right mt-1">{chat.time}</span>
 </div>
 </div>
 );
 }

 if (chat.sender === 'user') {
 return (
 <div key={idx} className="flex items-start justify-end max-w-[85%] ml-auto">
 <div className="bg-primary-600 border border-primary-500 p-3 rounded-2xl rounded-tr-none text-right">
 <p className="text-xs text-white leading-relaxed">{chat.text}</p>
 <span className="text-[8px] text-primary-200 block mt-1">{chat.time}</span>
 </div>
 </div>
 );
 }

 if (chat.sender === 'ai') {
 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex items-start gap-2 max-w-[90%]"
 >
 <div className={`p-3.5 rounded-2xl rounded-tl-none border text-xs leading-relaxed ${
 chat.type === 'assertive'
? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
: chat.type === 'rude'
? 'bg-rose-950/80 border-rose-500 text-rose-100'
: 'bg-amber-950/80 border-amber-500 text-amber-100'
 }`}>
 <div className="flex items-center gap-1.5 mb-1 font-bold text-[11px]">
 {chat.type === 'assertive'? (
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
 ): (
 <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
 )}
 <span>{chat.name} ({chat.type === 'assertive'? 'Sangat Baik': 'Butuh Perbaikan'})</span>
 </div>
 <p className="whitespace-pre-wrap">{chat.text}</p>
 <span className="text-[8px] opacity-60 block text-right mt-1.5">{chat.time}</span>
 </div>
 </motion.div>
 );
 }

 return null;
 })}

 {/* AI Typing Indicator */}
 {isAiTyping && (
 <div className="flex items-center gap-2 max-w-[80%]">
 <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center gap-1">
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
 </div>
 </div>
 )}
 <div ref={chatEndRef} />
 </div>

 {/* Input Form or Next button */}
 <div className="border-t border-white/10 pt-2 bg-indigo-950 shrink-0">
 {!showExplanation? (
 <div className="flex items-center gap-2">
 <input
 type="text"
 value={inputText}
 onChange={e => setInputText(e.target.value)}
 onKeyDown={e => e.key === 'Enter' && handleSend()}
 disabled={isAiTyping}
 placeholder="Tulis respons tegas & sopanmu..."
 className="flex-1 px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs outline-none focus:border-primary-400 placeholder:text-slate-400 text-white disabled:opacity-50"
 />
 <motion.button
 whileTap={{ scale: 0.9 }}
 onClick={handleSend}
 disabled={!inputText.trim() || isAiTyping}
 className="w-8 h-8 rounded-xl bg-primary-500 hover:bg-primary-600 flex items-center justify-center disabled:opacity-40 transition-colors"
 >
 <Send className="w-3.5 h-3.5 text-white" />
 </motion.button>
 </div>
 ): (
 <motion.button
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 onClick={handleNext}
 className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors text-white shadow-md"
 >
 <span>Lanjut Skenario Berikutnya</span>
 <ArrowRight className="w-4 h-4" />
 </motion.button>
 )}
 </div>
 </motion.div>
 ): (
 <motion.div
 key="finish"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex-1 flex flex-col justify-between py-6 px-2 text-center"
 >
 <div className="space-y-6 my-auto">
 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-glow">
 
 </div>
 <div className="space-y-2">
 <h3 className="font-display font-black text-xl text-emerald-400">Simulasi Selesai!</h3>
 <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
 Hebat! Kamu telah menyelesaikan evaluasi ketahanan cyberbullying interaktif berbasis AI SiberCerdas.
 </p>
 </div>

 <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 inline-block shadow-sm">
 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Skor Ketahanan Siber</p>
 <p className="font-display text-4xl font-black text-primary-400 mt-1">
 {Math.min(score, 100)}%
 </p>
 </div>
 </div>

 <button
 onClick={handleComplete}
 className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl text-xs font-bold hover:shadow-glow transition-all"
 >
 Simpan & Selesaikan Aktivitas
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
