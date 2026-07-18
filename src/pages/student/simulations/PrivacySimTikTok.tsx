import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Heart, MessageCircle, Share2, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface PrivacySimTikTokProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface TikTokPost {
 id: string;
 creator: string;
 avatar: string;
 description: string;
 caption: string;
 likes: string;
 comments: string;
 isSafe: boolean;
 explanation: string;
 videoUrl?: string;
 imageUrl?: string;
 points: number;
}

const POSTS: TikTokPost[] = [
 {
 id: 'post-1',
 creator: 'LideaKeren',
 avatar: 'LK',
 description: 'Video Lidea menari di depan pagar sekolah. Di video tersebut, plang nama sekolah (SDN Harapan Indah) terlihat sangat jelas.',
 caption: 'Biar capek ujian matematika, yang penting joget dulu di depan sekolah baru! #SDNHarapanIndah #sekolahbaru #trend',
 likes: '1.5K',
 comments: '62',
 isSafe: false,
 explanation: ' Bahaya Oversharing! Menampilkan plang nama sekolah secara jelas memudahkan orang asing memetakan lokasi fisik dan jadwal kegiatan harianmu.',
 videoUrl: '/anak_menari.mp4',
 points: 15,
 },
 {
 id: 'post-2',
 creator: 'SitiCerdas',
 avatar: 'SI',
 description: 'Video tutorial menggambar kucing di kertas menggunakan pensil warna. Hanya menampilkan tangan dan kertas gambar.',
 caption: 'Tutorial cepat gambar kucing bulat unyu! Meow~ #art #tutorial #creativity #kreatif',
 likes: '920',
 comments: '18',
 isSafe: true,
 explanation: ' Aman Dibagikan! Video ini hanya menampilkan proses berkarya tanpa mengekspos wajah, identitas diri, seragam, atau lokasi rumahmu.',
 videoUrl: '/mengambar_kucing.mp4',
 points: 15,
 },
 {
 id: 'post-3',
 creator: 'BoniKreator',
 avatar: 'BK',
 description: 'Foto tiket konser musik anak-anak yang dibagikan lengkap dengan nomor barcode, tanggal konser, nomor kursi, dan nama lengkap pembeli.',
 caption: 'Akhirnya tiket konser musik impian dapet juga! Budi Pratama siap nonton di baris VIP-12 tanggal 12 Juli nanti! #concert #barcodeticket #bahagia',
 likes: '410',
 comments: '35',
 isSafe: false,
 explanation: ' Bahaya Oversharing! Barcode pada tiket dapat disalin atau dipindai oleh orang lain dari postinganmu untuk masuk ke konser. Nama lengkap juga memperluas data pribadimu.',
 imageUrl: '/tiket_konser.png',
 points: 20,
 },
 {
 id: 'post-4',
 creator: 'RikoPetualang',
 avatar: 'RP',
 description: 'Video Riko review mainan lego barunya di meja belajar. Latar belakang menunjukkan seisi kamarnya, termasuk foto keluarga dan sertifikat piagam penghargaan.',
 caption: 'Review Lego Robot Raksasa limited edition! Kamarku penuh lego keren guys #lego #review #kamar',
 likes: '2.8K',
 comments: '104',
 isSafe: false,
 explanation: ' Bahaya Oversharing! Latar belakang video membocorkan ruangan pribadi (kamar), wajah anggota keluarga di foto, serta nama lengkap/sekolah pada sertifikat penghargaan.',
 videoUrl: '/review_lego.mp4',
 points: 15,
 },
 {
 id: 'post-5',
 creator: 'DinaMelodi',
 avatar: 'DM',
 description: 'Video rekaman Dina sedang menari Jaipong untuk kegiatan festival seni antar sekolah.',
 caption: 'Bangga banget mewakili sekolah di festival tari Jaipong hari ini! #jaipong #dance #tradisional #indonesia',
 likes: '4.5K',
 comments: '132',
 isSafe: true,
 explanation: ' Aman Dibagikan! Berbagi bakat menari tradisional di acara festival sekolah adalah kegiatan positif yang aman dibagikan selama tidak membeberkan informasi pribadi rahasia.',
 videoUrl: '/dina_menari_jaipong.mp4',
 points: 15,
 },
 {
 id: 'post-6',
 creator: 'BoniKreator',
 avatar: 'BK',
 description: 'Foto teman sekelas sedang tidur pulas dengan mulut menganga di meja kelas saat jam istirahat.',
 caption: 'Hahaha, capek banget ya bro tidur sampai ngorok di kelas! Jadiin stiker WhatsApp lucu nih! #lucu #tidurkelas #iseng',
 likes: '180',
 comments: '42',
 isSafe: false,
 explanation: ' Bahaya Oversharing & Bullying! Mengambil dan menyebarkan foto teman saat tidur tanpa persetujuan mereka melanggar privasi mereka, mempermalukan teman di depan umum, dan bisa berujung pada ejekan siber (cyberbullying).',
 imageUrl: '/teman_tidur.png',
 points: 20,
 },
];

export default function PrivacySimTikTok({ onComplete }: PrivacySimTikTokProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [choice, setChoice] = useState<'safe' | 'unsafe' | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentPost = POSTS[currentIdx];
 const maxScore = POSTS.reduce((sum, p) => sum + p.points, 0);

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
 }, [currentPost?.videoUrl]);

 const handleDecision = (val: 'safe' | 'unsafe') => {
 if (showFeedback) return;
 setChoice(val);
 const chosenIsSafe = val === 'safe';
 const isCorrect = chosenIsSafe === currentPost.isSafe;

 setScore((s) => s + (isCorrect? currentPost.points: 0));
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentPost.id,
 choice: val === 'safe'? 'Aman': 'Oversharing',
 isCorrect,
 },
 ]);
 setShowFeedback(true);
 };

 const handleNext = () => {
 setShowFeedback(false);
 setChoice(null);
 if (currentIdx < POSTS.length - 1) {
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
 maxScore,
 decisions,
 });
 };

 return (
 <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-violet-950 to-indigo-950 rounded-[40px] border-[10px] border-slate-800 p-4 shadow-2xl relative overflow-hidden h-[520px] sm:h-[620px] flex flex-col text-white">
 {/* Phone status bar */}
 <div className="flex justify-between items-center px-4 py-1 text-[10px] font-semibold opacity-75 select-none z-10 shrink-0">
 <span>20:26</span>
 <div className="w-12 h-4 bg-slate-800 rounded-full border border-slate-700/60" /> {/* Dynamic Island */}
 <span> 100%</span>
 </div>

 <div className="flex justify-between items-center px-3 py-2 border-b border-white/10 select-none z-10 shrink-0">
 <span className="font-display font-black tracking-wider text-sm text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">
 SiberTok
 </span>
 <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
 Poin: {score}
 </span>
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentPost.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex-1 flex flex-col justify-between py-3 min-h-0"
 >
 {/* Creator info */}
 <div className="flex items-center gap-2 px-1 select-none shrink-0">
 <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm border border-white/20">
 {currentPost.avatar}
 </div>
 <div>
 <p className="text-xs font-bold">@{currentPost.creator}</p>
 <p className="text-[9px] text-white/50">Diunggah 2 jam yang lalu</p>
 </div>
 </div>

 {/* Scenario Description Container (Middle Screen) */}
 <div className="my-3 flex-1 flex flex-col bg-slate-900 border border-white/10 rounded-2xl p-3 relative overflow-hidden">
 {/* Media Viewport */}
 <div className="w-full flex-1 min-h-[160px] bg-black rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
 {currentPost.videoUrl? (
 <video
 ref={videoRef}
 src={currentPost.videoUrl}
 autoPlay
 loop
 muted
 playsInline
 className="w-full h-full object-cover"
 />
 ): currentPost.imageUrl? (
 <img
 src={currentPost.imageUrl}
 alt={currentPost.description}
 className="w-full h-full object-cover"
 />
 ): (
 <ShieldAlert className="w-8 h-8 text-pink-400 animate-pulse" />
 )}
 </div>
 {/* Description & Caption Area */}
 <div className="mt-2 text-left space-y-1">
 <p className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">Deskripsi Postingan:</p>
 <p className="text-[11px] text-slate-200 leading-normal font-medium max-h-[70px] overflow-y-auto pr-1">
 {currentPost.description}
 </p>
 <p className="text-[10px] text-white/60 italic leading-snug pt-1 border-t border-white/10">
 "{currentPost.caption}"
 </p>
 </div>
 </div>

 {/* TikTok Right Actions Overlay Mockup */}
 <div className="absolute right-6 top-1/2 -translate-y-12 flex flex-col items-center gap-4 text-white/80 select-none z-10">
 <div className="flex flex-col items-center">
 <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><Heart className="w-5 h-5" /></div>
 <span className="text-[9px] mt-0.5">{currentPost.likes}</span>
 </div>
 <div className="flex flex-col items-center">
 <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><MessageCircle className="w-5 h-5" /></div>
 <span className="text-[9px] mt-0.5">{currentPost.comments}</span>
 </div>
 <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><Share2 className="w-5 h-5" /></div>
 </div>

 {/* Feedback / Choice Overlay */}
 {showFeedback && (
 <motion.div
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 className={`p-3 rounded-2xl border text-xs text-white leading-relaxed z-10 shrink-0 ${
 (choice === 'safe' && currentPost.isSafe) || (choice === 'unsafe' &&!currentPost.isSafe)
? 'bg-success-900/60 border-success-500' 
: 'bg-danger-900/60 border-danger-500'
 }`}
 >
<div className="flex gap-2">
{currentPost.isSafe ? (
<Check className="h-5 w-5 shrink-0 text-success-300" />
) : (
<AlertTriangle className="h-5 w-5 shrink-0 text-danger-300" />
)}
<div>
 <p className="font-bold">
 {((choice === 'safe') === currentPost.isSafe)? 'Pilihan Tepat!': 'Ups, Kurang Tepat!'}
 </p>
 <p className="text-[10px] text-white/80 mt-0.5">
 {currentPost.explanation}
 </p>
 </div>
 </div>
 </motion.div>
 )}

 {/* Actions Footer */}
 <div className="space-y-2 shrink-0 z-10">
 {!showFeedback? (
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => handleDecision('safe')}
 className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
 >
 <Check className="w-3.5 h-3.5" />
 Aman Dibagikan
 </button>
 <button
 type="button"
 onClick={() => handleDecision('unsafe')}
 className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1"
 >
 <AlertTriangle className="w-3.5 h-3.5" />
 Bahaya Overshare
 </button>
 </div>
 ): (
 <button
 type="button"
 onClick={handleNext}
 className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-lg"
 >
 Post Berikutnya
 <ArrowRight className="w-4 h-4" />
 </button>
 )}
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
 Petualangan Selesai! 
 </h4>
 <p className="text-xs text-white/70 mt-2 max-w-[220px]">
 Kamu berhasil memilah video dan postingan media sosial agar privasimu tetap terlindungi!
 </p>
 <div className="mt-4 inline-block bg-white/10 border border-white/20 px-5 py-2.5 rounded-xl">
 <span className="text-[9px] text-white/50 block font-bold">SKOR PRIVASI</span>
 <span className="text-xl font-black text-indigo-300 font-display">
 {score} / {maxScore}
 </span>
 </div>
 </div>
 <button
 type="button"
 onClick={handleComplete}
 className="bg-gradient-to-r from-pink-500 to-violet-500 text-white py-3 px-8 rounded-xl font-bold text-xs shadow-lg"
 >
 Simpan & Selesai
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
