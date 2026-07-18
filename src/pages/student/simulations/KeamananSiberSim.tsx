import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface KeamananSiberSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface CyberThreat {
 id: string;
 type: 'phishing' | 'malware' | 'popup' | 'fake-button';
 sourceTitle: string;
 url: string;
 description: string;
 contentHtml: string;
 options: {
 text: string;
 action: 'click' | 'block';
 isCorrect: boolean;
 points: number;
 feedback: string;
 }[];
}

const THREATS: CyberThreat[] = [
 {
 id: 'threat-1',
 type: 'phishing',
 sourceTitle: ' Pesan Masuk: Keamanan Game Online-mu!',
 url: 'http://hadiah-game-gratisan.xyz/login-akun',
 description: 'Kamu menerima email yang mengabarkan akun game-mu akan dihapus dalam 24 jam jika kamu tidak segera masuk (login) untuk memverifikasi password di link di bawah ini.',
 contentHtml: '<b>PEMBERITAHUAN DARURAT!</b><br/>Akun Anda terancam diblokir. Klik tautan berikut dan masukkan username serta password game Anda segera untuk menyelamatkan data:<br/><span class="text-blue-500 underline cursor-pointer text-xs">http://hadiah-game-gratisan.xyz/verifikasi</span>',
 options: [
 {
 text: 'Klik link dan masukkan password game',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Phishing! Link palsu (.xyz) yang mendesak-desak memasukkan sandi adalah upaya pencurian akun game-mu.',
 },
 {
 text: 'Laporkan sebagai spam / Hapus email',
 action: 'block',
 isSafe: true, // will map to isCorrect
 isCorrect: true,
 points: 20,
 feedback: ' Tepat Sekali! Mengabaikan email aneh dengan URL tidak dikenal (.xyz) melindungi akunmu dari pembajakan.',
 } as any,
 ],
 },
 {
 id: 'threat-2',
 type: 'fake-button',
 sourceTitle: ' Halaman Unduh Tugas Sekolah',
 url: 'https://kumpulan-tugas-sd.com/download-file',
 description: 'Kamu sedang membuka situs untuk mengunduh dokumen tugas mewarnai. Terdapat 3 tombol download besar berwarna-warni di halaman tersebut.',
 contentHtml: '<div class="space-y-2"><div class="p-2.5 bg-green-500 text-white rounded text-center font-bold cursor-pointer text-xs"> DOWNLOAD FAST SPEED</div><div class="p-2.5 bg-blue-500 text-white rounded text-center font-bold cursor-pointer text-xs"> DOWNLOAD FILE HERE</div><div class="text-[10px] text-gray-400 text-center">Tugas_Mewarnai.pdf (2 MB)<br/><span class="underline text-blue-500 cursor-pointer">Klik di sini untuk mengunduh berkas asli</span></div></div>',
 options: [
 {
 text: 'Klik tombol besar "DOWNLOAD FILE HERE"',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Malware! Tombol download raksasa di situs gratisan biasanya iklan palsu yang menyusupkan virus/malware ke komputermu.',
 },
 {
 text: 'Klik teks kecil "Klik di sini untuk mengunduh berkas asli" / Abaikan tombol besar',
 action: 'block',
 isCorrect: true,
 points: 20,
 feedback: ' Bagus! Tombol iklan besar adalah jebakan. Tautan teks kecil biasanya merupakan tombol asli yang mengunduh file dokumen aslinya.',
 },
 ],
 },
 {
 id: 'threat-3',
 type: 'popup',
 sourceTitle: ' Pop-up Peringatan Sistem!',
 url: 'https://security-scan-warning.site/alert',
 description: 'Tiba-tiba muncul jendela pop-up merah menyala saat kamu sedang browsing, berbunyi: "KOMPUTER ANDA TERINFEKSI 5 VIRUS! KLIK DI SINI UNTUK MEMBERSIHKAN SEKARANG!"',
 contentHtml: '<div class="p-3 bg-red-100 border-2 border-red-500 rounded text-red-800 text-xs font-mono"><p class="font-bold"> SISTEM CORRUPT!</p><p class="mt-1">Ditemukan virus berbahaya. Unduh pembersih antivirus gratis sekarang untuk melindungi komputer Anda.</p></div>',
 options: [
 {
 text: 'Klik tombol bersihkan untuk mengunduh antivirus yang ditawarkan',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Pop-up! Ini adalah iklan palsu (scareware) yang menakuti-nakuti agar kamu mengunduh virus asli yang menyamar sebagai pembersih.',
 },
 {
 text: 'Tutup tab browser / Klik tanda silang (X) pop-up',
 action: 'block',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Cerdas! Pop-up peringatan virus di dalam browser 100% adalah iklan palsu. Cukup tutup tab tersebut untuk tetap aman.',
 },
 ],
 },
 {
 id: 'threat-4',
 type: 'popup',
 sourceTitle: ' Selamat! Anda Menang iPhone 15!',
 url: 'http://menang-hadiah-hari-ini.online',
 description: 'Sebuah pop-up berkedip-kedip muncul menyatakan kamu adalah pengunjung ke-999.999 dan berhak mendapatkan handphone gratis dengan mengisi survey singkat.',
 contentHtml: '<div class="p-3 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 text-xs text-center font-bold animate-pulse"> SELAMAT! ANDA TERPILIH!<br/><span class="text-[10px] text-gray-500">Klaim hadiah iPhone gratis Anda hari ini dengan menekan tombol klaim.</span><br/><div class="mt-2 p-1.5 bg-orange-500 text-white rounded text-[10px]">KLAIM SEKARANG</div></div>',
 options: [
 {
 text: 'Klik tombol klaim hadiah gratis',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Penipuan! Tidak ada hadiah gratis yang dibagikan secara acak di internet. Ini adalah trik pencurian informasi kartu kredit atau data pribadi.',
 },
 {
 text: 'Abaikan dan segera tutup jendela pop-up',
 action: 'block',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat! Hadiah gratis palsu di internet selalu merupakan jebakan spam atau malware. Pilihanmu melindungimu dari bahaya.',
 },
 ],
 },
 {
 id: 'threat-5',
 type: 'phishing',
 sourceTitle: ' Pesan Chat dari "Teman Baru"',
 url: 'chat://pesan-langsung/teman-baru-123',
 description: 'Seseorang yang baru kamu kenal di game online mengirim pesan. Ia mengaku bisa memberi item langka gratis asalkan kamu membuka tautan dan memasukkan kode OTP yang masuk ke HP orang tuamu.',
 contentHtml: '<div class="space-y-1.5 text-xs"><div class="bg-slate-700 text-white rounded-lg rounded-tl-sm px-3 py-2 max-w-[80%]">Hai! Aku admin event game. Mau item langka gratis? </div><div class="bg-slate-700 text-white rounded-lg rounded-tl-sm px-3 py-2 max-w-[90%]">Buka link ini, lalu kirim kode OTP yang masuk ke HP orang tuamu ya. Cepat sebelum kehabisan!</div></div>',
 options: [
 {
 text: 'Buka tautan dan kirim kode OTP orang tua',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Besar! Kode OTP adalah kunci rahasia. Orang asing yang meminta OTP pasti ingin membobol akun atau data keluargamu.',
 },
 {
 text: 'Tolak, jangan kirim apa pun, dan beri tahu orang tua/guru',
 action: 'block',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Tepat! Kode OTP tidak boleh diberikan kepada siapa pun. Melaporkan ke orang dewasa adalah langkah paling aman.',
 },
 ],
 },
 {
 id: 'threat-6',
 type: 'fake-button',
 sourceTitle: ' Wi-Fi Gratis Tanpa Sandi',
 url: 'http://wifi-gratis-cepat.login-now.net',
 description: 'Saat di tempat umum, HP-mu menemukan Wi-Fi gratis bernama "FREE_WIFI_SUPER_CEPAT". Saat dibuka, muncul halaman yang meminta kamu login memakai email dan kata sandi media sosialmu.',
 contentHtml: '<div class="p-3 bg-sky-100 text-sky-900 rounded text-xs"><p class="font-bold"> Selamat datang di FREE WIFI!</p><p class="mt-1 text-[11px]">Untuk konek gratis, masuk dulu pakai email & kata sandi media sosialmu:</p><div class="mt-2 space-y-1"><div class="bg-white border border-sky-200 rounded px-2 py-1 text-[10px] text-gray-400">email kamu...</div><div class="bg-white border border-sky-200 rounded px-2 py-1 text-[10px] text-gray-400">kata sandi...</div></div></div>',
 options: [
 {
 text: 'Masukkan email dan kata sandi media sosial agar bisa internetan gratis',
 action: 'click',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya! Wi-Fi gratis yang meminta kata sandi media sosial adalah jebakan untuk mencuri akunmu. Login asli tidak pernah lewat halaman Wi-Fi.',
 },
 {
 text: 'Tidak login dengan akun pribadi dan bertanya ke orang tua dulu',
 action: 'block',
 isCorrect: true,
 points: 20,
 feedback: ' Cerdas! Jangan pernah memasukkan kata sandi akun pribadi di halaman Wi-Fi umum. Itu cara penjahat siber mencuri akun.',
 },
 ],
 },
];


export default function KeamananSiberSim({ onComplete }: KeamananSiberSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);
 const [virusAlert, setVirusAlert] = useState(false);

 const currentThreat = THREATS[currentIdx];
 const maxScore = THREATS.length * 20;

 const handleSelect = (idx: number) => {
 if (showFeedback) return;
 setSelectedOpt(idx);
 };

 const handleNext = () => {
 if (selectedOpt === null) return;
 const opt = currentThreat.options[selectedOpt];

 if (!showFeedback) {
 setScore((s) => s + opt.points);
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentThreat.id,
 choice: opt.text,
 isCorrect: opt.isCorrect,
 },
 ]);
 
 if (!opt.isCorrect) {
 // Trigger virus crash animation!
 setVirusAlert(true);
 setTimeout(() => {
 setVirusAlert(false);
 setShowFeedback(true);
 }, 1200);
 } else {
 setShowFeedback(true);
 }
 } else {
 setShowFeedback(false);
 setSelectedOpt(null);
 if (currentIdx < THREATS.length - 1) {
 setCurrentIdx((i) => i + 1);
 } else {
 setFinished(true);
 canvasConfetti({
 particleCount: 100,
 spread: 75,
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
 <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-3xl border border-indigo-100 p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
 {/* Virus Crash Overlay animation */}
 <AnimatePresence>
 {virusAlert && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-red-600/90 z-50 flex flex-col items-center justify-center text-white p-6 font-mono text-center space-y-4"
 >
 <ShieldAlert className="w-20 h-20 text-white animate-bounce" />
 <h4 className="text-xl font-bold tracking-wider"> BAHAYA! KOMPUTER TERINFEKSI MALWARE!</h4>
 <p className="text-xs max-w-sm opacity-90 leading-relaxed">
 Kamu baru saja membuka tautan berbahaya / mengunduh berkas mencurigakan. Sistem mendeteksi ancaman peretasan!
 </p>
 <div className="flex gap-2">
 <span className="inline-block w-2.5 h-2.5 bg-white rounded-full animate-ping" />
 <span className="text-[10px] text-red-200">Menyinkronkan log keamanan...</span>
 </div>
 </motion.div>
 )}
 </AnimatePresence>

 <div className="flex justify-between items-center mb-6">
 <h3 className="font-display font-bold text-lg text-indigo-800 flex items-center gap-2">
 <Globe className="text-indigo-500 w-5 h-5 animate-spin" style={{ animationDuration: '60s' }} />
 Simulator Browser Aman
 </h3>
 <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-indigo-100 text-indigo-700">
 Poin: {score}
 </span>
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentThreat.id}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-4"
 >
 {/* Fake Web Browser Address Bar */}
 <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-md">
 <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-2 border-b border-slate-800">
 <div className="flex gap-1.5 shrink-0">
 <span className="w-3 h-3 rounded-full bg-red-500" />
 <span className="w-3 h-3 rounded-full bg-yellow-500" />
 <span className="w-3 h-3 rounded-full bg-green-500" />
 </div>
 <div className="flex-1 bg-slate-800 rounded-lg px-3 py-1 text-[10px] font-mono text-slate-300 truncate">
 {currentThreat.url}
 </div>
 </div>
 <div className="p-4 bg-slate-950 min-h-[120px] text-slate-100 flex flex-col justify-center">
 <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">{currentThreat.sourceTitle}</p>
 <div 
 className="text-xs leading-relaxed"
 dangerouslySetInnerHTML={{ __html: currentThreat.contentHtml }} 
 />
 </div>
 </div>

 <div className="p-4 bg-white/95 rounded-2xl border border-indigo-100 text-xs text-indigo-950 font-medium">
 {currentThreat.description}
 </div>

 <div className="space-y-2.5">
 {currentThreat.options.map((opt, idx) => {
 let cardStyle = 'bg-white border-indigo-100/60 hover:border-indigo-300 text-indigo-800';
 if (selectedOpt === idx) {
 cardStyle = 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-100 text-indigo-900';
 }
 if (showFeedback) {
 cardStyle = opt.isCorrect 
? 'border-success-400 bg-success-50/30 text-success-800' 
: idx === selectedOpt 
? 'border-danger-400 bg-danger-50/30 text-danger-800'
: 'opacity-50 border-indigo-100 bg-white';
 }

 return (
 <button
 key={idx}
 type="button"
 disabled={showFeedback}
 onClick={() => handleSelect(idx)}
 className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-semibold leading-relaxed flex gap-3 ${cardStyle}`}
 >
 <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
 selectedOpt === idx? 'bg-indigo-500 border-indigo-500 text-white': 'border-indigo-200'
 }`}>
 {selectedOpt === idx && <span className="text-[8px]">●</span>}
 </div>
 <span>{opt.text}</span>
 </button>
 );
 })}
 </div>

 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-4 rounded-2xl border text-xs flex gap-3 ${
 currentThreat.options[selectedOpt!].isCorrect 
? 'bg-success-50/80 border-success-100 text-success-800' 
: 'bg-danger-50/80 border-danger-100 text-danger-800'
 }`}
 >
 <div className="shrink-0 mt-0.5">
 {currentThreat.options[selectedOpt!].isCorrect? (
 <ShieldCheck className="w-5 h-5 text-success-500" />
 ): (
 <AlertTriangle className="w-5 h-5 text-danger-500 animate-bounce" />
 )}
 </div>
 <div>
 <p className="font-semibold">
 {currentThreat.options[selectedOpt!].isCorrect? 'Keputusan Sangat Aman! (+20 Poin)': 'Waspada! Bahaya Siber Detected (+0 Poin)'}
 </p>
 <p className="mt-1 leading-relaxed">
 {currentThreat.options[selectedOpt!].feedback}
 </p>
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
 {showFeedback? 'Topik Berikutnya': 'Kirim Pilihan'}
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
 <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-500">
 <ShieldCheck className="w-10 h-10 text-indigo-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-indigo-800">
 Latihan Keamanan Siber Selesai! 
 </h4>
 <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
 Hebat! Kamu sudah belajar mengenali trik phishing, tombol download palsu, dan scareware. Tetap waspada saat berselancar ya!
 </p>
 <div className="mt-4 inline-block bg-white border border-indigo-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-indigo-400 block font-bold">SKOR PERTAHANAN</span>
 <span className="text-2xl font-black text-indigo-600 font-display">
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
