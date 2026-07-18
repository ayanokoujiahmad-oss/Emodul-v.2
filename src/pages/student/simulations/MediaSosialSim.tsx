import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

interface MediaSosialSimProps {
 onComplete: (result: {
 score: number;
 maxScore: number;
 decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
 }) => void;
}

interface SocialPost {
 id: string;
 creator: string;
 avatar: string;
 imageUrl: string;
 caption: string;
 problemComment: string;
 commenter: string;
 commenterAvatar: string;
 correctAction: 'report' | 'reply_good' | 'ignore' | 'support';
 explanation: string;
 options: {
 text: string;
 action: 'report' | 'reply_good' | 'ignore' | 'support';
 isCorrect: boolean;
 points: number;
 feedback: string;
 }[];
}

const POSTS: SocialPost[] = [
 {
 id: 'post-1',
 creator: 'Doni_Menggambar',
 avatar: 'DM',
 imageUrl: ' Hasil Mewarnai Gambar Kelinci',
 caption: 'Hasil karyaku setelah belajar mewarnai 3 jam kemarin. Semoga suka ya temen-temen! ',
 commenter: 'GamerGanas',
 commenterAvatar: '',
 problemComment: 'Hahaha gambaran jelek kayak gini aja dipamerin! Anak TK juga bisa kali mewarnai kayak gitu cupu!',
 correctAction: 'reply_good',
 explanation: 'Dalam kasus perundungan siber (cyberbullying) seperti ini, cara terbaik adalah tidak ikut terpancing emosi melainkan membalas dengan memberikan dukungan yang baik (komentar apresiasi) kepada pembuat gambar, atau melaporkan komentar perundung tersebut.',
 options: [
 {
 text: 'Balas dengan baik: "Jangan dengerin dia Doni, gambarmu udah bagus kok, perpaduan warnanya rapi!"',
 action: 'reply_good',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat Sekali! Memberikan komentar apresiatif melumpuhkan ejekan perundung siber dan menaikkan rasa percaya diri temanmu.',
 },
 {
 text: 'Ikut mendukung ejekan: "Iya nih, jelek banget warnanya acak-acakan!"',
 action: 'support',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Cyberbullying! Ikut merundung teman membuatmu menjadi pelaku bullying yang melanggar hukum digital.',
 },
 {
 text: 'Laporkan komentar "GamerGanas" sebagai perundungan/pelecehan',
 action: 'report',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat Sekali! Melaporkan (report) komentar kasar melindungi kenyamanan ekosistem media sosial.',
 },
 {
 text: 'Abaikan komentar tersebut',
 action: 'ignore',
 isCorrect: false,
 points: 10,
 feedback: ' Cukup Baik, tapi kurang membantu membela temanmu yang sedang diejek.',
 },
 ],
 },
 {
 id: 'post-2',
 creator: 'HadiahGratisOfficial',
 avatar: 'HG',
 imageUrl: ' BANNER: MENANGKAN IPHONE GRATIS TERBARU!',
 caption: ' GIVEAWAY AKHIR TAHUN! Bagi-bagi iPhone 15 gratis buat kalian! Cukup klik link di bio, isi nomor HP, dan transfer biaya ongkir Rp50.000 saja!',
 commenter: 'Budi_Cerdas',
 commenterAvatar: '',
 problemComment: 'Guys, ini giveaway beneran gak sih? Kok disuruh bayar ongkir dulu ya?',
 correctAction: 'report',
 explanation: 'Ini adalah modus penipuan berkedip giveaway (scam). Tindakan paling tepat adalah melaporkan postingan tersebut agar diblokir oleh platform.',
 options: [
 {
 text: 'Transfer Rp50.000 dan isi survey link bio',
 action: 'support',
 isCorrect: false,
 points: 0,
 feedback: ' Sangat Berbahaya! Uangmu akan melayang dan data pribadimu bisa disalahgunakan penipu.',
 },
 {
 text: 'Laporkan postingan akun ini sebagai penipuan / spam',
 action: 'report',
 isCorrect: true,
 points: 20,
 feedback: ' Tepat Sekali! Melaporkan scam membantu mencegah korban lain tertipu.',
 },
 {
 text: 'Abaikan postingan tersebut',
 action: 'ignore',
 isCorrect: false,
 points: 10,
 feedback: ' Cukup Aman bagi dirimu, tapi melaporkannya akan lebih baik bagi keselamatan orang lain.',
 },
 {
 text: 'Tulis komentar: "Wah seru banget aku coba ah!"',
 action: 'reply_good',
 isCorrect: false,
 points: 0,
 feedback: ' Kurang Tepat! Mempromosikan postingan penipuan membuat orang lain ikut terancam tertipu.',
 },
 ],
 },
 {
 id: 'post-3',
 creator: 'TipsKesehatanViral',
 avatar: 'TK',
 imageUrl: ' GAMBAR: REBUSAN DAUN LIAR BISA SEMBUHKAN SEGALA PENYAKIT!',
 caption: 'Heboh! Rahasia tersembunyi, meminum rebusan daun liar di pinggir jalan terbukti membunuh sel kanker dan penyakit dalam 1 hari! Bagikan info penting ini!',
 commenter: 'DokterRian',
 commenterAvatar: '',
 problemComment: 'Perhatian! Ini adalah disinformasi medis yang sangat berbahaya bagi kesehatan ginjal!',
 correctAction: 'report',
 explanation: 'Postingan ini menyebarkan berita kesehatan palsu (disinformasi medis). Langkah terbaik adalah melaporkannya atau membagikan peringatan dokter.',
 options: [
 {
 text: 'Bagikan (share) postingan ini ke grup keluarga',
 action: 'support',
 isCorrect: false,
 points: 0,
 feedback: ' Bahaya Hoaks! Membagikan info kesehatan palsu membahayakan keselamatan fisik keluarga yang mempercayainya.',
 },
 {
 text: 'Laporkan postingan sebagai penyebaran berita palsu (hoaks/misinformasi)',
 action: 'report',
 isCorrect: true,
 points: 20,
 feedback: ' Sangat Tepat! Menghentikan laju hoaks medis menyelamatkan kesehatan masyarakat luas.',
 },
 {
 text: 'Abaikan postingan',
 action: 'ignore',
 isCorrect: false,
 points: 10,
 feedback: ' Cukup aman bagi dirimu sendiri.',
 },
 {
 text: 'Tulis komentar: "Terima kasih infonya, sangat bermanfaat!"',
 action: 'reply_good',
 isCorrect: false,
 points: 0,
 feedback: ' Salah! Membenarkan berita bohong membuat algoritma menyebarkan hoaks ini lebih luas lagi.',
 },
 ],
 },
];

export default function MediaSosialSim({ onComplete }: MediaSosialSimProps) {
 const [currentIdx, setCurrentIdx] = useState(0);
 const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
 const [showFeedback, setShowFeedback] = useState(false);
 const [score, setScore] = useState(0);
 const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
 const [finished, setFinished] = useState(false);

 const currentPost = POSTS[currentIdx];
 const maxScore = POSTS.length * 20;

 const handleSelect = (idx: number) => {
 if (showFeedback) return;
 setSelectedOpt(idx);
 };

 const handleNext = () => {
 if (selectedOpt === null) return;
 const opt = currentPost.options[selectedOpt];

 if (!showFeedback) {
 setScore((s) => s + opt.points);
 setDecisions((prev) => [
...prev,
 {
 scenarioId: currentPost.id,
 choice: opt.text,
 isCorrect: opt.isCorrect,
 },
 ]);
 setShowFeedback(true);
 } else {
 setShowFeedback(false);
 setSelectedOpt(null);
 if (currentIdx < POSTS.length - 1) {
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
 <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-indigo-50/60 to-violet-50/60 rounded-3xl border border-indigo-100 p-6 shadow-xl backdrop-blur-sm">
 <div className="flex justify-between items-center mb-6">
 <h3 className="font-display font-bold text-lg text-indigo-800 flex items-center gap-2">
 <MessageSquare className="text-indigo-500 w-5 h-5" />
 Simulator Moderator Media Sosial
 </h3>
 <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-indigo-100 text-indigo-700">
 Poin: {score}
 </span>
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key={currentPost.id}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-4"
 >
 {/* Instagram Style Post Frame */}
 <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
 {/* Profile Header */}
 <div className="p-3 flex items-center gap-2.5 border-b border-gray-100 bg-gray-50/50">
 <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm border">
 {currentPost.avatar}
 </div>
 <div>
 <p className="text-xs font-bold text-gray-800">{currentPost.creator}</p>
 <p className="text-[9px] text-gray-400">Sponsor/Postingan Populer</p>
 </div>
 </div>

 {/* Photo Area */}
 <div className="h-40 bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-500 border-b border-gray-100">
 {currentPost.imageUrl}
 </div>

 {/* Caption & Comments */}
 <div className="p-4 space-y-3">
 <p className="text-xs text-gray-700 leading-relaxed">
 <span className="font-bold mr-1.5 text-gray-900">{currentPost.creator}</span>
 {currentPost.caption}
 </p>

 {/* Problematic Comment */}
 <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl space-y-1">
 <p className="text-[10px] font-bold text-rose-500">Komentar Terpopuler:</p>
 <div className="flex items-start gap-2">
 <span className="text-sm shrink-0">{currentPost.commenterAvatar}</span>
 <p className="text-[11px] text-gray-700 leading-relaxed">
 <span className="font-bold mr-1 text-gray-800">{currentPost.commenter}</span>
 {currentPost.problemComment}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Prompt */}
 <p className="text-xs font-bold text-indigo-800">
 Apa tindakan bijak yang akan kamu ambil sebagai pengguna digital?
 </p>

 {/* Selector Options */}
 <div className="space-y-2">
 {currentPost.options.map((opt, idx) => (
 <button
 key={idx}
 type="button"
 disabled={showFeedback}
 onClick={() => handleSelect(idx)}
 className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-center gap-3 ${
 selectedOpt === idx 
? 'border-indigo-400 bg-indigo-50/30 text-indigo-900' 
: 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
 }`}
 >
 <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
 selectedOpt === idx? 'bg-indigo-500 border-indigo-500 text-white': 'border-gray-200'
 }`}>
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
 currentPost.options[selectedOpt!].isCorrect 
? 'bg-success-50 border-success-100 text-success-800' 
: 'bg-danger-50 border-danger-100 text-danger-800'
 }`}
 >
 <div className="shrink-0 mt-0.5">
 {currentPost.options[selectedOpt!].isCorrect? (
 <CheckCircle className="w-5 h-5 text-success-500" />
 ): (
 <AlertCircle className="w-5 h-5 text-danger-500" />
 )}
 </div>
 <div>
 <p className="font-semibold">
 {currentPost.options[selectedOpt!].isCorrect? 'Tindakan Tepat!': 'Kurang Tepat!'}
 </p>
 <p className="mt-1 leading-relaxed">
 {currentPost.options[selectedOpt!].feedback}
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
 {showFeedback? 'Postingan Berikutnya': 'Kirim Pilihan'}
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
 <CheckCircle className="w-10 h-10 text-indigo-500 animate-pulse" />
 </div>
 <div>
 <h4 className="font-display font-bold text-xl text-indigo-800">
 Moderasi Selesai! 
 </h4>
 <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
 Luar biasa! Kamu sudah mengerti bagaimana menghentikan cyberbullying, mengenali penipuan, dan mengabaikan atau melaporkan hoaks medis.
 </p>
 <div className="mt-4 inline-block bg-white border border-indigo-100 px-6 py-3 rounded-2xl shadow-sm">
 <span className="text-xs text-indigo-400 block font-bold">SKOR MODERATOR</span>
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
