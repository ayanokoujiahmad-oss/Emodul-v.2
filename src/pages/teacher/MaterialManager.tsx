import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
 Plus,
 Trash2,
 Save,
 RotateCcw,
 ArrowUp,
 ArrowDown,
 ChevronDown,
 ChevronUp,
 HelpCircle,
 PlayCircle,
 AlertTriangle,
 GraduationCap,
 X,
 RefreshCw,
 Eye,
 Maximize2,
 Image as ImageIcon,
 Video,
 FileText,
 Fingerprint,
 Shield,
 LockKeyhole,
} from 'lucide-react';
import { useModules } from '../../contexts/ModuleContext';
import type { Topic, TopicStep, Question } from '../../types';
import canvasConfetti from 'canvas-confetti';
import FocusEditorModal from '../../components/teacher/FocusEditorModal';
import RichContentRenderer, { MediaBlock, PassageBlock, QuestionImage } from '../../components/common/RichContentRenderer';
import { Aktivitas2RisikoGamified, KartuPenggunaDigitalCerdas, AyoMengamatiTopik2Gamified, AyoCariTahuT2, AyoDetektifBeritaT2, YukBelajarTopik1, YukBelajarTopik2, YukBelajarTopik3, YukBelajarTopik4, YukBelajarTopik5, YukBelajarTopik6, YukBelajarTopik7, Activity1Table } from '../../components/common/StepComponents';

const SIMULATION_OPTIONS = [
  { id: 'identitas-digital', name: 'Simulator Identitas Digital' },
  { id: 'hoax-detective', name: 'Detektif Hoaks' },
  { id: 'privacy-tiktok', name: 'Privacy Sim - TikTok Mode' },
  { id: 'keamanan-siber', name: 'Keamanan Siber Simulator' },
  { id: 'etika-chat', name: 'Etika Chat Simulator' },
  { id: 'media-sosial', name: 'Media Sosial Simulator' },
  { id: 'copyright', name: 'Copyright Simulator' },
  { id: 'kreator-konten', name: 'Kreator Konten Simulator' },
  { id: 'ai-chat-bullying', name: 'Simulator Perundungan AI' },
];

const COLOR_OPTIONS = [
 { class: 'bg-indigo-500', name: 'Indigo' },
 { class: 'bg-emerald-500', name: 'Emerald' },
 { class: 'bg-amber-500', name: 'Amber' },
 { class: 'bg-rose-500', name: 'Rose' },
 { class: 'bg-sky-500', name: 'Sky' },
 { class: 'bg-violet-500', name: 'Violet' },
];

const ICON_OPTIONS = [
 'fingerprint', 'search', 'shield', 'lock', 'message-square',
 'users', 'copyright', 'video', 'graduation-cap', 'book', 'gamepad-2'
];

const STEP_TYPE_LABELS: Record<string, string> = {
 'tujuan': 'Tujuan Pembelajaran',
 'kata-kunci': 'Kata Kunci',
 'peta-materi': 'Peta Materi',
 'bersiap-belajar': 'Bersiap-Siap Belajar',
 'tantangan-awal': 'Tantangan Awal (Mini Kuis)',
 'yuk-belajar': 'Yuk, Belajar Bersama (Materi)',
 'ayo-memahami': 'Ayo, Memahami (Soal Latihan)',
 'ayo-mengamati': 'Ayo, Mengamati (Studi Kasus)',
 'ayo-bereksplorasi': 'Ayo, Bereksplorasi (Simulasi)',
 'uji-pemahaman': 'Uji Pemahamanmu (Kuis Akhir)',
 'refleksi': 'Refleksi Belajar',
 'custom-komitmen': 'Aktivitas 2 & Komitmen',
 'ayo-cari-tahu': 'Ayo Cari Tahu (Esensial)',
};

const STEP_EMOJIS: Record<string, string> = {
 'tujuan': '',
 'kata-kunci': '',
 'peta-materi': '',
 'bersiap-belajar': '',
 'tantangan-awal': '',
 'yuk-belajar': '',
 'ayo-memahami': '',
 'ayo-mengamati': '',
 'ayo-bereksplorasi': '',
 'uji-pemahaman': '',
 'refleksi': '',
 'custom-komitmen': '',
 'ayo-cari-tahu': '',
};

export default function MaterialManager() {
 const { topics, saveTopic, deleteTopic, resetToDefault, loading } = useModules();

 const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
 const [isEditing, setIsEditing] = useState(false);
 const [isNew, setIsNew] = useState(false);

 // Form States
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [icon, setIcon] = useState('book');
 const [color, setColor] = useState('bg-indigo-500');
 const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
 const [steps, setSteps] = useState<TopicStep[]>([]);

 const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (event) => {
 if (event.target?.result) {
 setBackgroundImageUrl(event.target.result as string);
 }
 };
 reader.readAsDataURL(file);
 }
 };

 // Expanded step control index
 const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);
 const [showConfirmReset, setShowConfirmReset] = useState(false);
 const [previewStepIndex, setPreviewStepIndex] = useState<number | null>(null);
 const [focusEditor, setFocusEditor] = useState<{ stepIndex: number; field: string } | null>(null);

 const startEdit = (topic: Topic) => {
 setSelectedTopic(topic);
 setIsNew(false);
 setIsEditing(true);

 setTitle(topic.title);
 setDescription(topic.description);
 setIcon(topic.icon);
 setColor(topic.color);
 setBackgroundImageUrl(topic.backgroundImageUrl || '');
 setSteps(topic.steps? JSON.parse(JSON.stringify(topic.steps)): []);
 setExpandedStepIndex(0);
 };

 const startCreateNew = () => {
 setIsNew(true);
 setSelectedTopic(null);
 setIsEditing(true);

 setTitle('');
 setDescription('');
 setIcon('graduation-cap');
 setColor('bg-emerald-500');
 setBackgroundImageUrl('');
 // Default 11 steps
 setSteps([
 { type: 'tujuan', title: 'Tujuan Pembelajaran', content: 'Setelah mempelajari topik ini, kamu diharapkan mampu:\n1....' },
 { type: 'kata-kunci', title: 'Kata Kunci', content: ' **Kata Kunci** – Definisi.' },
 { type: 'peta-materi', title: 'Peta Materi', content: 'Peta perjalanan materi...' },
 {
 type: 'bersiap-belajar',
 title: 'Bersiap-Siap Belajar',
 content: 'Jawab pertanyaan pemantik berikut:',
 questions: [{ id: `q-${Date.now()}-1`, type: 'reflective', question: 'Apa pendapatmu tentang materi ini?', points: 0 }]
 },
 {
 type: 'tantangan-awal',
 title: 'Tantangan Awal',
 content: 'Uji pemahaman awalmu:',
 questions: [{
 id: `q-${Date.now()}-2`,
 type: 'mc',
 question: 'Apakah kamu sudah familiar dengan topik ini?',
 options: [{ id: 'a', text: 'Ya, sangat familiar', isCorrect: true }, { id: 'b', text: 'Belum sama sekali', isCorrect: false }],
 points: 10
 }]
 },
 { type: 'yuk-belajar', title: 'Yuk, Belajar Bersama', content: '## Pelajaran Utama\nTulis konten di sini.' },
 {
 type: 'ayo-memahami',
 title: 'Ayo, Memahami',
 content: 'Jawab soal pemahaman di bawah ini:',
 questions: [{
 id: `q-${Date.now()}-3`,
 type: 'mc',
 question: 'Bagaimana tindakan terbaik kita?',
 options: [{ id: 'a', text: 'Melaporkannya', isCorrect: true }, { id: 'b', text: 'Membiarkannya', isCorrect: false }],
 points: 10
 }]
 },
 {
 type: 'ayo-mengamati',
 title: 'Ayo, Mengamati',
 content: '## Studi Kasus: Roni dan Chat\nAmati kasus ini...',
 questions: [{ id: `q-${Date.now()}-4`, type: 'essay', question: 'Menurut pendapatmu, apa kesalahan Roni?', points: 20 }]
 },
 { type: 'ayo-bereksplorasi', title: 'Ayo, Bereksplorasi', content: 'Jelajahi simulasi seru!', simulationId: 'identitas-digital' },
 {
 type: 'uji-pemahaman',
 title: 'Uji Pemahamanmu',
 content: 'Jawab evaluasi kuis akhir ini:',
 questions: [{
 id: `q-${Date.now()}-5`,
 type: 'mc',
 question: 'Berikut ini adalah contoh cyberbullying, kecuali...',
 options: [
 { id: 'a', text: 'Memuji karya teman di chat grup', isCorrect: true },
 { id: 'b', text: 'Mengirim pesan kasar terus menerus', isCorrect: false },
 ],
 points: 10
 }]
 },
 {
 type: 'refleksi',
 title: 'Refleksi Belajar',
 content: 'Tuliskan refleksimu di bawah:',
 questions: [{ id: `q-${Date.now()}-6`, type: 'reflective', question: 'Tuliskan pelajaran paling berharga dari topik ini!', points: 0 }]
 }
 ]);
 setExpandedStepIndex(0);
 };

 // Reordering steps
 const moveStep = (index: number, direction: 'up' | 'down') => {
 const nextSteps = [...steps];
 const targetIndex = direction === 'up'? index - 1: index + 1;
 if (targetIndex < 0 || targetIndex >= nextSteps.length) return;
 const temp = nextSteps[index];
 nextSteps[index] = nextSteps[targetIndex];
 nextSteps[targetIndex] = temp;
 setSteps(nextSteps);
 setExpandedStepIndex(targetIndex);
 };

 const removeStep = (index: number) => {
 if (window.confirm('Apakah Anda yakin ingin menghapus langkah ini?')) {
 setSteps(steps.filter((_, i) => i!== index));
 setExpandedStepIndex(null);
 }
 };

 const addStep = (type: any) => {
 const newStep: TopicStep = {
 type,
 title: STEP_TYPE_LABELS[type] || 'Aktivitas Baru',
 content: 'Tulis materi atau instruksi di sini...',
 };

 if (type === 'ayo-bereksplorasi') {
 newStep.simulationId = 'identitas-digital';
 } else if (['bersiap-belajar', 'refleksi'].includes(type)) {
 newStep.questions = [{ id: `q-custom-${Date.now()}`, type: 'reflective', question: 'Pertanyaan refleksi?', points: 0 }];
 } else if (type === 'ayo-mengamati') {
 newStep.questions = [{ id: `q-custom-${Date.now()}`, type: 'essay', question: 'Pertanyaan studi kasus?', points: 20 }];
 } else if (['tantangan-awal', 'ayo-memahami', 'uji-pemahaman'].includes(type)) {
 newStep.questions = [{
 id: `q-custom-${Date.now()}`,
 type: 'mc',
 question: 'Pertanyaan kuis?',
 options: [{ id: 'a', text: 'Opsi Benar', isCorrect: true }, { id: 'b', text: 'Opsi Salah', isCorrect: false }],
 points: 10
 }];
 }

 setSteps([...steps, newStep]);
 setExpandedStepIndex(steps.length);
 };

 // Update step field helper
 const updateStepField = (index: number, field: keyof TopicStep, value: any) => {
 const next = [...steps];
 next[index] = {...next[index], [field]: value };
 setSteps(next);
 };

 // Questions editor functions
 const addQuestion = (stepIdx: number, type: 'mc' | 'essay' | 'reflective') => {
 const next = [...steps];
 const targetStep = next[stepIdx];
 const questions = targetStep.questions? [...targetStep.questions]: [];
 
 const newQ: Question = {
 id: `q-custom-${Date.now()}-${questions.length + 1}`,
 type,
 question: type === 'mc'? 'Pertanyaan Pilihan Ganda Baru?': 'Pertanyaan Esai Baru?',
 points: type === 'mc'? 10: 20,
 };

 if (type === 'mc') {
 newQ.options = [
 { id: 'a', text: 'Pilihan A', isCorrect: true },
 { id: 'b', text: 'Pilihan B', isCorrect: false },
 { id: 'c', text: 'Pilihan C', isCorrect: false },
 { id: 'd', text: 'Pilihan D', isCorrect: false },
 ];
 }

 targetStep.questions = [...questions, newQ];
 setSteps(next);
 };

 const updateQuestion = (stepIdx: number, qIdx: number, updatedQ: Question) => {
 const next = [...steps];
 if (next[stepIdx].questions) {
 next[stepIdx].questions![qIdx] = updatedQ;
 setSteps(next);
 }
 };

 const deleteQuestion = (stepIdx: number, qIdx: number) => {
 const next = [...steps];
 if (next[stepIdx].questions) {
 next[stepIdx].questions = next[stepIdx].questions!.filter((_, i) => i!== qIdx);
 setSteps(next);
 }
 };

 // Rubric editor functions
 const addRubricCriterion = (stepIdx: number) => {
 const next = [...steps];
 const targetStep = next[stepIdx];
 const criteria = targetStep.rubricCriteria? [...targetStep.rubricCriteria]: [];
 
 criteria.push({
 id: `rc-${Date.now()}`,
 name: 'Kriteria Penilaian Baru',
 weight: 25,
 });
 
 targetStep.rubricCriteria = criteria;
 setSteps(next);
 };

 const updateRubricCriterion = (stepIdx: number, cIdx: number, name: string, weight: number) => {
 const next = [...steps];
 const targetStep = next[stepIdx];
 if (targetStep.rubricCriteria) {
 targetStep.rubricCriteria[cIdx] = {...targetStep.rubricCriteria[cIdx], name, weight };
 setSteps(next);
 }
 };

 const deleteRubricCriterion = (stepIdx: number, cIdx: number) => {
 const next = [...steps];
 const targetStep = next[stepIdx];
 if (targetStep.rubricCriteria) {
 targetStep.rubricCriteria = targetStep.rubricCriteria.filter((_, i) => i!== cIdx);
 setSteps(next);
 }
 };

 const updateRubricLevelDescription = (stepIdx: number, cIdx: number, level: number, text: string) => {
 const next = [...steps];
 const targetStep = next[stepIdx];
 if (targetStep.rubricCriteria) {
 const crit = {...targetStep.rubricCriteria[cIdx] };
 const currentLevels = crit.levels? {...crit.levels }: {};
 currentLevels[level] = text;
 crit.levels = currentLevels;
 targetStep.rubricCriteria[cIdx] = crit;
 setSteps(next);
 }
 };

 const handleSave = async () => {
 if (!title.trim() ||!description.trim()) {
 alert('Judul dan Deskripsi tidak boleh kosong!');
 return;
 }

 const topicId = isNew? `custom-topik-${Date.now()}`: selectedTopic!.id;
 const topicNum = isNew? topics.length + 1: selectedTopic!.number;

 const updatedTopic: Topic = {
 id: topicId,
 number: topicNum,
 title,
 description,
 icon,
 color,
 badgeId: selectedTopic?.badgeId || `badge-custom-${topicId}`,
 steps,
 backgroundImageUrl,
 };

 try {
 await saveTopic(updatedTopic);
 setIsEditing(false);
 setSelectedTopic(null);
 canvasConfetti({
 particleCount: 120,
 spread: 60,
 origin: { y: 0.8 }
 });
 } catch (err) {
 alert('Gagal menyimpan materi. Silakan coba lagi.');
 }
 };

 const handleDeleteTopic = async (id: string) => {
 if (window.confirm('Apakah kamu yakin ingin menghapus topik kustom ini?')) {
 try {
 await deleteTopic(id);
 setIsEditing(false);
 setSelectedTopic(null);
 } catch (err) {
 alert('Gagal menghapus topik.');
 }
 }
 };

 const handleResetAll = async () => {
 try {
 await resetToDefault();
 setShowConfirmReset(false);
 setIsEditing(false);
 setSelectedTopic(null);
 alert('Semua materi berhasil dikembalikan ke pengaturan bawaan!');
 } catch (err) {
 alert('Gagal mereset materi.');
 }
 };

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[400px]">
 <RefreshCw className="w-12 h-12 animate-spin text-primary-500" />
 <p className="mt-4 text-gray-500 font-medium">Memuat data materi...</p>
 </div>
 );
 }

 return (
 <div className="p-4 max-w-6xl mx-auto space-y-6">
 {/* Header */}
 <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
 <div>
 <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
 <GraduationCap className="text-primary-500 w-8 h-8" />
 Kelola Materi & Topik Pembelajaran
 </h2>
 <p className="text-sm text-gray-500 mt-1">
 Buat, edit, dan rancang modul literasi digital kustom untuk kelas Anda.
 </p>
 </div>

 {!isEditing && (
 <div className="flex gap-2">
 <button
 onClick={() => setShowConfirmReset(true)}
 className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm transition-all"
 >
 <RotateCcw size={16} />
 Reset Bawaan
 </button>
 <button
 onClick={startCreateNew}
 className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center gap-2 text-sm font-semibold transition-all"
 >
 <Plus size={16} />
 Tambah Topik Baru
 </button>
 </div>
 )}
 </div>

 {/* Reset Confirmation Modal */}
 {showConfirmReset && (
 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
 <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
 <div className="flex items-center gap-3 text-warning-500 mb-4">
 <AlertTriangle size={24} />
 <h3 className="font-display font-bold text-lg text-gray-800">Kembalikan ke Setelan Awal?</h3>
 </div>
 <p className="text-sm text-gray-600 mb-6">
 Tindakan ini akan **menghapus semua topik buatan sendiri** dan semua pengeditan materi yang telah dilakukan. Materi akan kembali menjadi 8 topik default siber.
 </p>
 <div className="flex justify-end gap-2">
 <button
 onClick={() => setShowConfirmReset(false)}
 className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm"
 >
 Batal
 </button>
 <button
 onClick={handleResetAll}
 className="px-4 py-2 bg-warning-500 text-white rounded-xl hover:bg-warning-600 text-sm font-medium"
 >
 Ya, Reset Sekarang
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Workspace Area */}
 <AnimatePresence mode="wait">
 {isEditing? (
 <motion.div
 key="editing"
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-6 w-full"
 >
 {/* Top Row: Topic Settings (Full Width) */}
 <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-card space-y-4">
 <div className="flex items-center justify-between border-b pb-3">
 <h3 className="font-display font-bold text-gray-800 text-base flex items-center gap-2">
 Informasi Topik Pembelajaran
 </h3>
 <button
 type="button"
 onClick={() => {
 setPreviewStepIndex(0); // Start preview from first step
 }}
 className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 flex items-center gap-1.5 transition-all shadow-2xs"
 >
 <Eye size={14} />
 Pratinjau Akun Siswa (Topik Utuh)
 </button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Column 1: Title & Description */}
 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Judul Topik</label>
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="Contoh: Aman Bermedia Sosial"
 className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-sm transition-all"
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Singkat</label>
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Berikan ringkasan materi untuk siswa..."
 rows={3}
 className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-sm transition-all"
 />
 </div>
 </div>

 {/* Column 2: Background, Icon, and Color */}
 <div className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gambar Latar Belakang Kartu</label>
 <div className="flex gap-2 mt-1.5">
 <input
 type="text"
 value={backgroundImageUrl}
 onChange={(e) => setBackgroundImageUrl(e.target.value)}
 placeholder="https://images.unsplash.com/... atau unggah file"
 className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-sm transition-all"
 />
 <label className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors">
 Unggah
 <input
 type="file"
 accept="image/*"
 onChange={handleBgUpload}
 className="hidden"
 />
 </label>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Emoji Icon</label>
 <select
 value={icon}
 onChange={(e) => setIcon(e.target.value)}
 className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-sm bg-white transition-all appearance-none"
 >
 {ICON_OPTIONS.map((ico) => (
 <option key={ico} value={ico}>{ico}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Warna Tema</label>
 <select
 value={color}
 onChange={(e) => setColor(e.target.value)}
 className="w-full mt-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-100 text-sm bg-white transition-all appearance-none"
 >
 {COLOR_OPTIONS.map((c) => (
 <option key={c.class} value={c.class}>{c.name}</option>
 ))}
 </select>
 </div>
 </div>
 </div>

 {/* Column 3: Live Student Card Preview */}
 <div className="flex flex-col justify-center items-center border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50">
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
 Pratinjau Kartu Siswa (Dasbor)
 </p>
 
 <div
 className="relative rounded-2xl overflow-hidden shadow-md border border-gray-150 flex flex-col justify-between h-48 w-full max-w-[280px] bg-white transition-all duration-300"
 >
 {/* Background image or color fallback */}
 {backgroundImageUrl? (
 <div 
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage: `url(${backgroundImageUrl})` }}
 />
 ): (
 <div className={`absolute inset-0 bg-gradient-to-br ${
 color || 'from-indigo-500 to-purple-600'
 } opacity-90`} />
 )}

 {/* Dark gradient overlay for readability */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 z-0" />

 {/* Card Content */}
 <div className="relative z-10 p-4 flex flex-col justify-between h-full text-white">
 {/* Top row: Status Icon */}
 <div className="flex justify-between items-center">
 <span className="text-[9px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
 Topik Kustom
 </span>
 <span className="text-xs">
 {icon === 'fingerprint' ? (
 <Fingerprint className="h-4 w-4" />
 ) : icon === 'shield' ? (
 <Shield className="h-4 w-4" />
 ) : icon === 'lock' ? (
 <LockKeyhole className="h-4 w-4" />
 ) : (
 <FileText className="h-4 w-4" />
 )}
 </span>
 </div>

 {/* Middle: Title & Description */}
 <div className="space-y-1 mt-auto">
 <h4 className="font-display font-bold text-sm leading-tight text-white line-clamp-1">
 {title || 'Judul Topik Baru'}
 </h4>
 <p className="text-[9px] text-white/70 line-clamp-2 leading-relaxed">
 {description || 'Deskripsi topik pembelajaran...'}
 </p>
 </div>

 {/* Bottom row */}
 <div className="pt-2 border-t border-white/10 mt-2 flex justify-between items-center">
 <span className="text-[9px] font-bold bg-indigo-500 text-white px-2.5 py-1 rounded-lg">
 Mulai Belajar
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="pt-3 border-t flex justify-end gap-2">
 <button
 onClick={handleSave}
 className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
 >
 <Save size={14} />
 Simpan Perubahan
 </button>
 <button
 onClick={() => { setIsEditing(false); setSelectedTopic(null); }}
 className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all"
 >
 Batal
 </button>
 </div>
 </div>

 {/* Bottom Row: Steps List and Detail Editors (Full Width) */}
 <div className="space-y-6 w-full">
 {/* Peta Alur Langkah Interaktif */}
 <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card space-y-3">
 <div className="flex items-center justify-between">
 <h3 className="font-display font-bold text-gray-800 text-sm flex items-center gap-2">
 Peta Alur Langkah Topik
 </h3>
 <span className="text-[10px] text-gray-400 font-semibold">Klik langkah untuk melompat & mengedit</span>
 </div>
 <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
 {steps.map((step, idx) => {
 const isCurrent = expandedStepIndex === idx;
 const emoji = STEP_EMOJIS[step.type] || '';
 return (
 <div key={idx} className="flex items-center flex-shrink-0">
 <button
 type="button"
 onClick={() => {
 setExpandedStepIndex(idx);
 setTimeout(() => {
 document.getElementById(`step-card-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }, 100);
 }}
 className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all min-w-[75px] ${
 isCurrent
? 'border-primary-500 bg-primary-50/50 shadow-sm scale-105'
: 'border-gray-100 hover:border-gray-300 bg-gray-50/20'
 }`}
 >
 <span className="text-xl">{emoji}</span>
 <span className="text-[10px] font-bold text-gray-700 mt-1">Langkah {idx + 1}</span>
 <span className="text-[9px] text-gray-400 font-semibold truncate max-w-[70px]" title={step.title}>
 {step.title}
 </span>
 </button>
 {idx < steps.length - 1 && (
 <div className="h-0.5 w-4 bg-gray-200 flex-shrink-0 mx-1" />
 )}
 </div>
 );
 })}
 </div>
 </div>
 {/* Add Step Tool */}
 <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
 <h3 className="font-display font-bold text-gray-800 mb-3">Tambah Langkah Pembelajaran</h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
 {Object.entries(STEP_TYPE_LABELS).map(([type, label]) => (
 <button
 key={type}
 type="button"
 onClick={() => addStep(type)}
 className="px-3 py-2 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-xl text-xs font-bold text-primary-700 transition-all text-center shadow-2xs"
 >
 + {label}
 </button>
 ))}
 </div>
 </div>

 {/* Steps Constructor */}
 <div className="space-y-4">
 <h3 className="font-display font-bold text-gray-800 px-1">Tahapan Belajar ({steps.length} Langkah)</h3>
 
 {steps.map((step, index) => {
 const isExpanded = expandedStepIndex === index;
 return (
 <div
 key={index}
 id={`step-card-${index}`}
 className={`bg-white border rounded-2xl overflow-hidden transition-all shadow-sm ${
 isExpanded? 'border-primary-300 ring-1 ring-primary-100': 'border-gray-100 hover:border-gray-200'
 }`}
 >
 {/* Step Header Accordion Toggle */}
 <div
 onClick={() => setExpandedStepIndex(isExpanded? null: index)}
 className="flex items-center justify-between px-5 py-3.5 cursor-pointer bg-gray-50/40 select-none"
 >
 <div className="flex items-center gap-3">
 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
 {index + 1}
 </span>
 <div>
 <h4 className="font-display font-bold text-sm text-surface-800">{step.title}</h4>
 <p className="text-[10px] text-gray-400 font-semibold">{STEP_TYPE_LABELS[step.type] || step.type}</p>
 </div>
 </div>

 <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
 <button
 type="button"
 disabled={index === 0}
 onClick={() => moveStep(index, 'up')}
 className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
 title="Pindah ke atas"
 >
 <ArrowUp size={14} />
 </button>
 <button
 type="button"
 disabled={index === steps.length - 1}
 onClick={() => moveStep(index, 'down')}
 className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
 title="Pindah ke bawah"
 >
 <ArrowDown size={14} />
 </button>
 <button
 type="button"
 onClick={() => setPreviewStepIndex(index)}
 className="p-1 hover:bg-primary-50 hover:text-primary-600 rounded text-gray-500"
 title="Pratinjau Tampilan Anak"
 >
 <Eye size={14} />
 </button>
 <button
 type="button"
 onClick={() => removeStep(index)}
 className="p-1 hover:bg-danger-50 hover:text-danger-500 rounded text-gray-400"
 title="Hapus langkah"
 >
 <Trash2 size={14} />
 </button>
 <div className="w-px h-4 bg-gray-200 mx-1"></div>
 {isExpanded? <ChevronUp size={16} className="text-gray-400" />: <ChevronDown size={16} className="text-gray-400" />}
 </div>
 </div>

 {/* Step Expanded Content Form */}
 {isExpanded && (
 <div className="p-5 border-t border-gray-100 space-y-5 bg-white">
 
 {/* Card 1: Identitas & Konten Langkah */}
 <div className="bg-surface-50/50 border border-gray-100/60 rounded-2xl p-4 space-y-4">
 <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
 <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
 Identitas & Konten Langkah
 </h5>

 {step.type === 'custom-komitmen' && (
 <div className="p-3.5 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl text-xs text-yellow-800 leading-relaxed font-semibold">
 Langkah ini menggunakan layout gamifikasi khusus (Misi Risiko Digital & Kartu Komitmen Tanda Tangan). Siswa akan mengisi Quest Cards dan canvas tanda tangan digital. Anda dapat menyesuaikan Judul dan Materi Utama di bawah.
 </div>
 )}
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-1">Judul Aktivitas</label>
 <input
 type="text"
 value={step.title}
 onChange={(e) => updateStepField(index, 'title', e.target.value)}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-1">Tipe Langkah</label>
 <select
 value={step.type}
 onChange={(e) => updateStepField(index, 'type', e.target.value)}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm bg-white appearance-none"
 >
 {Object.entries(STEP_TYPE_LABELS).map(([typeKey, typeLabel]) => (
 <option key={typeKey} value={typeKey}>{typeLabel}</option>
 ))}
 </select>
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-1">
 <label className="block text-xs font-semibold text-gray-500">Materi Utama / Pengantar (Markdown didukung)</label>
 <button
 type="button"
 onClick={() => setFocusEditor({ stepIndex: index, field: 'content' })}
 className="px-2.5 py-1 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg text-[10px] font-bold text-primary-600 flex items-center gap-1 transition-all"
 title="Buka Editor Fokus (layar penuh)"
 >
 <Maximize2 size={12} /> Mode Fokus
 </button>
 </div>
 <textarea
 value={step.content}
 onChange={(e) => updateStepField(index, 'content', e.target.value)}
 rows={5}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm font-sans"
 />
 </div>
 </div>

 {/* Media Pendukung */}
 <div className="bg-surface-50/50 border border-gray-100/60 rounded-2xl p-4 space-y-3">
 <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
 <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
 Media Pendukung (Opsional)
 </h5>
 <div className="flex items-center gap-4">
 <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer">
 <input type="radio" name={`media-${index}`} value="none" checked={!step.mediaType || step.mediaType === 'none'} onChange={() => updateStepField(index, 'mediaType', 'none')} className="text-primary-500" />
 Tidak Ada
 </label>
 <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer">
 <input type="radio" name={`media-${index}`} value="image" checked={step.mediaType === 'image'} onChange={() => updateStepField(index, 'mediaType', 'image')} className="text-primary-500" />
 <ImageIcon size={13} /> Gambar
 </label>
 <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer">
 <input type="radio" name={`media-${index}`} value="youtube" checked={step.mediaType === 'youtube'} onChange={() => updateStepField(index, 'mediaType', 'youtube')} className="text-primary-500" />
 <Video size={13} /> Video YouTube
 </label>
 </div>

 {step.mediaType && step.mediaType!== 'none' && (
 <div className="space-y-2">
 <div>
 <label className="block text-[10px] font-semibold text-gray-500 mb-1">
 {step.mediaType === 'image'? 'URL Gambar': 'URL YouTube'}
 </label>
 <div className="flex gap-2">
 <input
 type="text"
 value={step.mediaUrl || ''}
 onChange={(e) => updateStepField(index, 'mediaUrl', e.target.value)}
 placeholder={step.mediaType === 'image'? 'https://i.imgur.com/...': 'https://youtu.be/...'}
 className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
 />
 {step.mediaType === 'image' && (
 <label className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors">
 Unggah
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (event) => {
 if (event.target?.result) {
 updateStepField(index, 'mediaUrl', event.target.result as string);
 }
 };
 reader.readAsDataURL(file);
 }
 }}
 className="hidden"
 />
 </label>
 )}
 </div>
 </div>
 {step.mediaType === 'image' && (
 <div>
 <label className="block text-[10px] font-semibold text-gray-500 mb-1">Posisi Gambar</label>
 <select
 value={step.mediaLayout || 'above'}
 onChange={(e) => updateStepField(index, 'mediaLayout', e.target.value)}
 className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-primary-500 appearance-none"
 >
 <option value="above">Di Atas Teks</option>
 <option value="below">Di Bawah Teks</option>
 <option value="side">Di Samping Teks</option>
 </select>
 </div>
 )}
 {/* Mini preview */}
 {step.mediaUrl && (
 <div className="p-2 bg-white rounded-xl border border-gray-100">
 <p className="text-[9px] font-bold text-gray-400 mb-1">Pratinjau:</p>
 <MediaBlock mediaType={step.mediaType} mediaUrl={step.mediaUrl} mediaLayout={step.mediaLayout} />
 </div>
 )}
 </div>
 )}
 </div>

 {/* Card 2: Bantuan Belajar Anak */}
 <div className="bg-surface-50/50 border border-gray-100/60 rounded-2xl p-4 space-y-4">
 <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
 <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
 Bantuan Belajar Anak (Opsional)
 </h5>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-1">Instruksi Pengerjaan (opsional)</label>
 <textarea
 value={step.instruction || ''}
 onChange={(e) => updateStepField(index, 'instruction', e.target.value)}
 placeholder="Petunjuk khusus pengisian..."
 rows={2}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
 />
 </div>
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-1">Contoh Isian / Contoh Jawaban (opsional)</label>
 <textarea
 value={step.exampleInput || ''}
 onChange={(e) => updateStepField(index, 'exampleInput', e.target.value)}
 placeholder="Contoh: Menggunakan avatar kartun..."
 rows={2}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
 />
 </div>
 </div>
 </div>

 {/* Simulation Launcher Fields */}
 {step.type === 'ayo-bereksplorasi' && (
 <div className="p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50 space-y-2">
 <h5 className="text-xs font-bold text-primary-700 flex items-center gap-1">
 <PlayCircle size={14} />
 Konfigurasi Simulasi Interaktif
 </h5>
 <div>
 <label className="block text-xs text-gray-500 mb-1">Pilih Game Simulasi</label>
 <select
 value={step.simulationId || 'identitas-digital'}
 onChange={(e) => updateStepField(index, 'simulationId', e.target.value)}
 className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm bg-white appearance-none"
 >
 {SIMULATION_OPTIONS.map((opt) => (
 <option key={opt.id} value={opt.id}>{opt.name}</option>
 ))}
 </select>
 </div>
 </div>
 )}

 {/* Card 3: Evaluasi & Rubrik Kustom */}
 <div className="bg-surface-50/50 border border-gray-100/60 rounded-2xl p-4 space-y-4">
 <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
 <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
 Evaluasi & Rubrik Kustom
 </h5>
 
 <div className="flex items-center justify-between">
 <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
 <input
 type="checkbox"
 checked={!!step.isGradable}
 onChange={(e) => updateStepField(index, 'isGradable', e.target.checked)}
 className="rounded text-primary-600 focus:ring-primary-400"
 />
 Aktifkan Evaluasi dengan Rubrik Kustom
 </label>

 {step.isGradable && (
 <button
 type="button"
 onClick={() => addRubricCriterion(index)}
 className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 flex items-center gap-1 transition-all shadow-2xs"
 >
 + Tambah Kriteria
 </button>
 )}
 </div>

 {step.isGradable && (
 <div className="space-y-4">
 {(step.rubricCriteria || []).map((rc, cIdx) => (
 <div key={rc.id} className="bg-white p-4 rounded-xl border border-gray-100 space-y-2.5 shadow-2xs">
 <div className="flex gap-2 items-center">
 <input
 type="text"
 value={rc.name}
 onChange={(e) => updateRubricCriterion(index, cIdx, e.target.value, rc.weight)}
 placeholder="Nama kriteria (misal: Pemahaman Konsep, Keaslian Karya)"
 className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
 />
 <div className="flex items-center gap-1 w-20">
 <input
 type="number"
 min={1}
 max={100}
 value={rc.weight}
 onChange={(e) => updateRubricCriterion(index, cIdx, rc.name, parseInt(e.target.value) || 0)}
 className="w-12 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center font-mono"
 />
 <span className="text-xs text-gray-400">%</span>
 </div>
 <button
 type="button"
 onClick={() => deleteRubricCriterion(index, cIdx)}
 className="p-1.5 text-gray-400 hover:text-danger-500 rounded hover:bg-danger-50 transition-colors"
 >
 <X size={14} />
 </button>
 </div>
 
 {/* Level descriptions nested form */}
 <details className="mt-2 pl-4 border-l-2 border-primary-200 group">
 <summary className="text-[10px] font-bold text-primary-600 cursor-pointer hover:text-primary-700 select-none list-none flex items-center gap-1">
 <span className="inline-block transition-transform group-open:rotate-90"></span>
 Sunting Deskripsi Tingkat Penilaian (1 - 4)
 </summary>
 <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
 <div>
 <span className="text-[9px] font-bold text-danger-600 block mb-0.5">Skor 1 (Perlu Bimbingan)</span>
 <input
 type="text"
 value={rc.levels?.[1] || ''}
 onChange={(e) => updateRubricLevelDescription(index, cIdx, 1, e.target.value)}
 placeholder="Deskripsi tingkat 1 (kurang)..."
 className="w-full px-2 py-1 border border-gray-200 rounded-md text-[11px]"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-warning-600 block mb-0.5">Skor 2 (Cukup)</span>
 <input
 type="text"
 value={rc.levels?.[2] || ''}
 onChange={(e) => updateRubricLevelDescription(index, cIdx, 2, e.target.value)}
 placeholder="Deskripsi tingkat 2..."
 className="w-full px-2 py-1 border border-gray-200 rounded-md text-[11px]"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-accent-600 block mb-0.5">Skor 3 (Baik)</span>
 <input
 type="text"
 value={rc.levels?.[3] || ''}
 onChange={(e) => updateRubricLevelDescription(index, cIdx, 3, e.target.value)}
 placeholder="Deskripsi tingkat 3..."
 className="w-full px-2 py-1 border border-gray-200 rounded-md text-[11px]"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-success-600 block mb-0.5">Skor 4 (Sangat Baik)</span>
 <input
 type="text"
 value={rc.levels?.[4] || ''}
 onChange={(e) => updateRubricLevelDescription(index, cIdx, 4, e.target.value)}
 placeholder="Deskripsi tingkat 4 (hebat)..."
 className="w-full px-2 py-1 border border-gray-200 rounded-md text-[11px]"
 />
 </div>
 </div>
 </details>
 </div>
 ))}

 {step.rubricCriteria && step.rubricCriteria.length > 0 && (
 <div className="text-[10px] text-right font-mono font-semibold text-gray-500">
 Total Bobot:{' '}
 <span
 className={
 step.rubricCriteria.reduce((a, b) => a + b.weight, 0) === 100
? 'text-success-600 font-bold'
: 'text-warning-600 font-bold'
 }
 >
 {step.rubricCriteria.reduce((a, b) => a + b.weight, 0)}%
 </span>{' '}
 (Harus 100%)
 </div>
 )}
 </div>
 )}
 </div>

 {/* Passage / Cerita Pengantar */}
 {step.questions && step.questions.length > 0 && (
 <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-4 space-y-2">
 <h5 className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
 <FileText size={14} /> Cerita / Teks Pengantar untuk Soal (Opsional)
 </h5>
 <p className="text-[10px] text-amber-600">Teks cerita ini akan ditampilkan sebelum semua soal pada langkah ini. Cocok untuk bacaan bersama.</p>
 <textarea
 value={step.passage || ''}
 onChange={(e) => updateStepField(index, 'passage', e.target.value)}
 placeholder="Contoh: Andi sedang bermain game online ketika tiba-tiba ia menerima pesan dari orang asing yang meminta informasi pribadinya..."
 rows={3}
 className="w-full px-3 py-2 border border-amber-200 rounded-xl focus:outline-none focus:border-amber-400 text-sm bg-white"
 />
 </div>
 )}

 {/* Questions Editor */}
 {step.questions && step.questions.length > 0 && (
 <div className="p-4 bg-emerald-50/10 rounded-2xl border border-emerald-100 space-y-4">
 <div className="flex items-center justify-between">
 <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
 <HelpCircle size={14} />
 Daftar Pertanyaan ({step.questions.length})
 </h5>
 <div className="flex gap-1">
 <button
 type="button"
 onClick={() => addQuestion(index, 'mc')}
 className="px-2 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700 transition-all"
 >
 + Pilihan Ganda
 </button>
 <button
 type="button"
 onClick={() => addQuestion(index, 'essay')}
 className="px-2 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-700 transition-all"
 >
 + Esai
 </button>
 </div>
 </div>

 <div className="space-y-4 divide-y divide-emerald-100/50">
 {step.questions.map((q, qIdx) => (
 <div key={q.id} className="pt-3 first:pt-0 space-y-2">
 <div className="flex gap-2 items-start">
 <span className="text-xs font-mono font-bold text-emerald-600 py-1">
 Q{qIdx + 1} ({q.type === 'mc'? 'PG': 'Esai'})
 </span>
 <textarea
 value={q.question}
 onChange={(e) => updateQuestion(index, qIdx, {...q, question: e.target.value })}
 placeholder="Teks pertanyaan..."
 rows={2}
 className="flex-1 px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
 />
 <div className="w-20">
 <label className="block text-[8px] text-gray-400 font-bold uppercase">Poin</label>
 <input
 type="number"
 value={q.points}
 onChange={(e) => updateQuestion(index, qIdx, {...q, points: parseInt(e.target.value) || 0 })}
 className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs font-mono text-center"
 />
 </div>
 <button
 type="button"
 onClick={() => deleteQuestion(index, qIdx)}
 className="p-1 text-gray-400 hover:text-danger-500 rounded"
 >
 <Trash2 size={14} />
 </button>
 </div>

 {/* Image URL for question */}
 <div className="pl-8">
 <div className="flex items-center gap-2">
 <ImageIcon size={12} className="text-gray-400" />
 <input
 type="text"
 value={q.imageUrl || ''}
 onChange={(e) => updateQuestion(index, qIdx, {...q, imageUrl: e.target.value })}
 placeholder="URL Gambar Soal atau unggah file"
 className="flex-1 px-3 py-1 border border-gray-200 rounded-lg text-[11px] text-gray-600 placeholder:text-gray-300"
 />
 <label className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
 Unggah
 <input
 type="file"
 accept="image/*"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onload = (event) => {
 if (event.target?.result) {
 updateQuestion(index, qIdx, {...q, imageUrl: event.target.result as string });
 }
 };
 reader.readAsDataURL(file);
 }
 }}
 className="hidden"
 />
 </label>
 </div>
 {q.imageUrl && (
 <div className="mt-1.5 relative inline-block">
 <img src={q.imageUrl} alt="Preview" className="max-h-20 rounded-lg border border-gray-100 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
 <button
 type="button"
 onClick={() => updateQuestion(index, qIdx, {...q, imageUrl: '' })}
 className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]"
 >
 ×
 </button>
 </div>
 )}
 </div>

 {/* Options for MC question */}
 {q.type === 'mc' && q.options && (
 <div className="pl-8 space-y-1.5">
 <p className="text-[10px] font-bold text-emerald-600">Pilihan Jawaban (Centang yang Benar):</p>
 {q.options.map((opt, oIdx) => {
 const isCorrect = q.correctAnswer === opt.id || opt.isCorrect;
 return (
 <div key={opt.id} className="flex gap-2 items-center">
 <input
 type="checkbox"
 checked={!!isCorrect}
 onChange={() => {
 const newOpts = q.options!.map((o, oi) => ({
...o,
 isCorrect: oi === oIdx
 }));
 updateQuestion(index, qIdx, {
...q,
 options: newOpts,
 correctAnswer: opt.id
 });
 }}
 className="rounded-full text-emerald-500 focus:ring-emerald-400"
 />
 <input
 type="text"
 value={opt.text}
 onChange={(e) => {
 const newOpts = [...q.options!];
 newOpts[oIdx].text = e.target.value;
 updateQuestion(index, qIdx, {...q, options: newOpts });
 }}
 placeholder={`Opsi ${opt.id.toUpperCase()}`}
 className="flex-1 px-3 py-1 border border-gray-200 rounded-lg text-xs"
 />
 </div>
 );
 })}
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </div>
 </motion.div>
 ): (
 /* List of Topics */
 <motion.div
 key="list"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
 >
 {topics.map((topic, i) => (
 <motion.div
 key={topic.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
 >
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <div className={`w-10 h-10 rounded-xl ${topic.color || 'bg-indigo-500'} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
 {topic.number}
 </div>
 <div>
 <h4 className="font-display font-bold text-base text-surface-800">{topic.title}</h4>
 <span className="text-[10px] text-gray-400 font-mono">{topic.steps?.length || 10} Langkah Belajar</span>
 </div>
 </div>

 <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
 {topic.description}
 </p>

 {topic.backgroundImageUrl && (
 <div className="h-24 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
 <img src={topic.backgroundImageUrl} alt={topic.title} className="object-cover h-full w-full opacity-90" />
 </div>
 )}
 </div>

 <div className="flex gap-2 mt-5 pt-3 border-t border-gray-100">
 <button
 onClick={() => startEdit(topic)}
 className="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
 >
 Edit Materi
 </button>
 {topic.id.startsWith('custom-') && (
 <button
 onClick={() => handleDeleteTopic(topic.id)}
 className="p-2 border border-gray-200 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-xl transition-all"
 title="Hapus Topik"
 >
 <Trash2 size={14} />
 </button>
 )}
 </div>
 </motion.div>
 ))}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Focus Editor Modal */}
 {focusEditor && (
 <FocusEditorModal
 value={steps[focusEditor.stepIndex]?.content || ''}
 onChange={(newValue) => updateStepField(focusEditor.stepIndex, 'content', newValue)}
 onClose={() => setFocusEditor(null)}
 title={` ${steps[focusEditor.stepIndex]?.title || 'Editor Fokus'}`}
 />
 )}

 {/* Chromebook Student Preview Modal */}
 {previewStepIndex!== null && (
 <ChromebookPreviewModal
 steps={steps}
 initialStepIndex={previewStepIndex}
 topicId={selectedTopic?.id}
 topicTitle={title}
 topicDescription={description}
 topicColor={color}
 topicIcon={icon}
 topicBackgroundImageUrl={backgroundImageUrl}
 onClose={() => setPreviewStepIndex(null)}
 />
 )}
 </div>
 );
}

// Chromebook Student Preview Modal
interface ChromebookPreviewModalProps {
 steps: TopicStep[];
 initialStepIndex: number;
 topicId?: string;
 topicTitle: string;
 topicDescription: string;
 topicColor: string;
 topicIcon: string;
 topicBackgroundImageUrl: string;
 onClose: () => void;
}

function ChromebookPreviewModal({
 steps,
 initialStepIndex,
 topicId,
 topicTitle,
 topicDescription,
 topicColor,
 topicIcon,
 topicBackgroundImageUrl,
 onClose,
}: ChromebookPreviewModalProps) {
 const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
 const [viewMode, setViewMode] = useState<'flow' | 'card'>('flow');

 const step = steps[currentStepIndex] || steps[0];
 const stepNumber = currentStepIndex + 1;
 const emoji = STEP_EMOJIS[step?.type] || '';

 return (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-start sm:items-center p-4 z-50 overflow-y-auto">
  <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in my-auto">
  {/* Chromebook Frame Top WebCam */}
  <div className="w-full bg-slate-800 rounded-t-3xl h-10 flex items-center justify-center relative shadow-2xl border-t border-slate-700">
  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold">
  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/85 animate-pulse"></div>
  </div>
  <button
  onClick={onClose}
  className="absolute right-4 text-slate-400 hover:text-white transition-colors"
  >
  <X size={20} />
  </button>
  </div>

  {/* Chromebook Inner Screen Frame */}
  <div className="w-full bg-slate-900 p-3 shadow-inner relative flex flex-col">
  {/* Web Browser Frame */}
  <div className="w-full bg-[#f1f3f4] rounded-t-xl overflow-hidden flex flex-col h-[320px] sm:h-[520px] shadow-lg border border-slate-700/50">
 {/* Browser Tabs */}
 <div className="bg-[#dee1e6] px-3 pt-2 flex items-end gap-1.5 border-b border-gray-300">
 <button
 type="button"
 onClick={() => setViewMode('flow')}
 className={`text-xs px-4 py-1.5 rounded-t-lg font-medium flex items-center gap-1.5 transition-all ${
 viewMode === 'flow'
? 'bg-[#faf8fc] text-indigo-700 shadow-xs font-bold border-t-2 border-indigo-500'
: 'text-gray-600 hover:bg-gray-150/30 opacity-70'
 }`}
 >
 <span> Tampilan Belajar Siswa</span>
 </button>
 <button
 type="button"
 onClick={() => setViewMode('card')}
 className={`text-xs px-4 py-1.5 rounded-t-lg font-medium flex items-center gap-1.5 transition-all ${
 viewMode === 'card'
? 'bg-[#faf8fc] text-indigo-700 shadow-xs font-bold border-t-2 border-indigo-500'
: 'text-gray-600 hover:bg-gray-150/30 opacity-70'
 }`}
 >
 <span> Tampilan Kartu Dasbor</span>
 </button>
 </div>

 {/* Address Bar Row */}
 <div className="bg-white px-3 py-2 flex items-center gap-2 border-b border-gray-200">
 <div className="flex gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
 <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
 <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
 </div>
 <div className="flex-1 bg-[#f1f3f4] rounded-full px-3 py-1 text-xs text-gray-500 flex items-center gap-1.5 select-all font-mono">
 <span>
 {viewMode === 'flow'
? `sibercerdas.sch.id/belajar/topik/langkah-${stepNumber}`
: 'sibercerdas.sch.id/student/dashboard'}
 </span>
 </div>
 </div>

 {viewMode === 'card'? (
 /* Student Dashboard Topic Card Mockup */
 <div className="flex-1 bg-[#faf8fc] p-8 overflow-y-auto flex flex-col justify-between select-none">
 <div className="max-w-md mx-auto w-full space-y-6 mt-6">
 <div className="text-center space-y-1">
 <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-full uppercase">
 Pratinjau Kartu Siswa
 </span>
 <p className="text-[10px] text-gray-500">Tampilan kartu topik pada halaman Dashboard/Peta Belajar Siswa</p>
 </div>

 {/* Replica of Student Dashboard Topic Card */}
 <div
 className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100/60 flex flex-col justify-between h-72 w-full bg-white transition-all duration-300"
 >
 {/* Background image or color fallback */}
 {topicBackgroundImageUrl? (
 <div 
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage: `url(${topicBackgroundImageUrl})` }}
 />
 ): (
 <div className={`absolute inset-0 bg-gradient-to-br ${
 topicColor || 'from-indigo-500 to-purple-600'
 } opacity-90`} />
 )}

 {/* Dark gradient overlay for readability */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 z-0" />

 {/* Card Content */}
 <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white">
 {/* Top row: Topic Number & Status Icon */}
 <div className="flex justify-between items-center">
 <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
 Topik Kustom
 </span>
 <span className="text-lg">
 
 </span>
 </div>

 {/* Middle: Title & Description */}
 <div className="space-y-1.5 mt-auto">
 <h3 className="font-display font-bold text-lg leading-tight text-white">
 {topicTitle || 'Judul Topik Baru'}
 </h3>
 <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
 {topicDescription || 'Silakan isi deskripsi topik pada form informasi di atas...'}
 </p>
 </div>

 {/* Bottom row: Button / Lock status */}
 <div className="pt-4 border-t border-white/10 mt-4 flex justify-between items-center">
 <button
 disabled
 className="px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md bg-indigo-500 text-white cursor-not-allowed opacity-90"
 >
 Mulai Belajar
 </button>
 <span className="text-2xl">
 {topicIcon === 'fingerprint' ? (
 <Fingerprint className="h-6 w-6" />
 ) : topicIcon === 'shield' ? (
 <Shield className="h-6 w-6" />
 ) : topicIcon === 'lock' ? (
 <LockKeyhole className="h-6 w-6" />
 ) : (
 <FileText className="h-6 w-6" />
 )}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 ): (
 /* Chromebook Workspace (Visualizing student view) */
 <div className="flex-1 bg-[#faf8fc] p-6 overflow-y-auto font-sans flex flex-col justify-between">
 {step?.type === 'yuk-belajar' && topicId === 'topik-1'? (
 <div className="space-y-5">
 <YukBelajarTopik1
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 <Activity1Table
 answers={{}}
 onSave={() => {}}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-2'? (
 <div className="space-y-5">
 <YukBelajarTopik2
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-3'? (
 <div className="space-y-5">
 <YukBelajarTopik3
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-4'? (
 <div className="space-y-5">
 <YukBelajarTopik4
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-5'? (
 <div className="space-y-5">
 <YukBelajarTopik5
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-6'? (
 <div className="space-y-5">
 <YukBelajarTopik6
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): step?.type === 'yuk-belajar' && topicId === 'topik-7'? (
 <div className="space-y-5">
 <YukBelajarTopik7
 onActivitySave={() => {}}
 activityAnswers={{}}
 isTeacherPreview={true}
 />
 </div>
 ): (
 <div className="space-y-5">
 {/* Header Step Card */}
 <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-3xl bg-indigo-50 p-2.5 rounded-2xl">{emoji}</span>
 <div>
 <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">
 Aktivitas {stepNumber}
 </span>
 <h3 className="font-display font-bold text-gray-800 text-base mt-1">{step?.title || 'Aktivitas'}</h3>
 </div>
 </div>
 <div className="text-right">
 <span className="text-xs text-gray-400 font-medium">{STEP_TYPE_LABELS[step?.type] || step?.type}</span>
 </div>
 </div>

 {/* Content Box */}
 <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
 {/* Media block (above) */}
 {step?.mediaType && step.mediaType!== 'none' && step.mediaUrl && (!step.mediaLayout || step.mediaLayout === 'above') && (
 <MediaBlock mediaType={step.mediaType} mediaUrl={step.mediaUrl} mediaLayout={step.mediaLayout} />
 )}

 <div className={step?.mediaType === 'image' && step?.mediaLayout === 'side'? 'overflow-hidden': ''}>
 {/* Media block (side) */}
 {step?.mediaType === 'image' && step?.mediaLayout === 'side' && step?.mediaUrl && (
 <MediaBlock mediaType={step.mediaType} mediaUrl={step.mediaUrl} mediaLayout="side" />
 )}
 <div>
 {step && <RichContentRenderer content={step.content} />}
 </div>
 {step?.mediaType === 'image' && step?.mediaLayout === 'side' && <div className="clear-both" />}
 </div>

 {/* Media block (below) */}
 {step?.mediaType && step.mediaType!== 'none' && step.mediaUrl && step.mediaLayout === 'below' && (
 <MediaBlock mediaType={step.mediaType} mediaUrl={step.mediaUrl} mediaLayout={step.mediaLayout} />
 )}

 {/* Instruction banner if exists */}
 {step?.instruction && (
 <div className="p-3.5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
 <p className="text-xs font-bold text-indigo-800 mb-0.5"> Instruksi Pengerjaan:</p>
 <p className="text-xs text-indigo-700 leading-relaxed font-medium">{step.instruction}</p>
 </div>
 )}

 {/* Example Input box if exists */}
 {step?.exampleInput && (
 <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-2">
 <div>
 <p className="text-xs font-bold text-amber-800 mb-0.5">Contoh Jawaban / Isian:</p>
 <p className="text-xs text-amber-700 leading-relaxed font-medium italic">"{step.exampleInput}"</p>
 </div>
 </div>
 )}
 </div>

 {/* Interactive Answer Elements based on step type */}
 <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lembar Jawaban Siswa</h4>

 {/* Comic pages or Passage/Story */}
 {step?.comics && step.comics.length > 0? (
 <div className="my-4 p-4 bg-indigo-50/40 border border-indigo-100/45 rounded-2xl">
 <div className="flex items-center gap-2 mb-3">
 <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
 Komik Pengantar
 </span>
 </div>
 <div className="flex flex-col gap-4 items-center w-full">
 {step.comics.map((url, index) => (
 <div key={index} className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-sm border border-slate-200/50">
 <img
 src={url}
 alt={`Komik halaman ${index + 1}`}
 className="w-full h-auto rounded-xl object-contain"
 />
 </div>
 ))}
 </div>
 </div>
 ): (
 step?.passage && <PassageBlock passage={step.passage} />
 )}

 {/* Essay / Reflective question forms */}
 {step?.questions && step.questions.some(q => q.type === 'essay' || q.type === 'reflective') && (
 <div className="space-y-4">
 {step.questions.map((q, idx) => (
 <div key={q.id} className="space-y-2">
 <p className="text-sm font-semibold text-gray-800">
 {idx + 1}. {q.question}
 </p>
 {q.imageUrl && <QuestionImage imageUrl={q.imageUrl} />}
 <textarea
 disabled
 placeholder="Siswa akan mengetikkan jawaban mereka di sini..."
 rows={3}
 className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-400 resize-none cursor-not-allowed"
 />
 </div>
 ))}
 </div>
 )}

 {/* Multiple Choice question forms */}
 {step?.questions && step.questions.some(q => q.type === 'mc') && (
 <div className="space-y-4">
 {step.questions.map((q, qIdx) => (
 <div key={q.id} className="space-y-2">
 <p className="text-sm font-semibold text-gray-800">
 {qIdx + 1}. {q.question} {q.points > 0 && <span className="text-xs text-emerald-600 font-bold">({q.points} Poin)</span>}
 </p>
 {q.imageUrl && <QuestionImage imageUrl={q.imageUrl} />}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
 {q.options?.map((opt) => {
 const isCorrect = q.correctAnswer === opt.id || opt.isCorrect;
 return (
 <div
 key={opt.id}
 className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium ${
 isCorrect
? 'border-emerald-200 bg-emerald-50 text-emerald-800 shadow-2xs'
: 'border-gray-200 bg-gray-50/50 text-gray-500'
 }`}
 >
 <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
 isCorrect? 'border-emerald-500 bg-emerald-500 text-white': 'border-gray-300'
 }`}>
 {isCorrect && '✓'}
 </div>
 <span>{opt.text}</span>
 {isCorrect && (
 <span className="ml-auto text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-md uppercase">
 Kunci Jawaban
 </span>
 )}
 </div>
 );
 })}
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Simulation Launcher (Ayo Bereksplorasi) */}
 {step?.type === 'ayo-bereksplorasi' && (
 <div className="p-5 border-2 border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
 <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 animate-bounce">
 <PlayCircle size={28} />
 </div>
 <div>
 <h5 className="font-bold text-sm text-gray-800">Mulai Simulasi Interaktif</h5>
 <p className="text-xs text-gray-500 mt-1 max-w-sm">
 Siswa akan dialihkan untuk bermain simulator: <strong>{SIMULATION_OPTIONS.find(o => o.id === step.simulationId)?.name || step.simulationId}</strong>
 </p>
 </div>
 <button
 disabled
 className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md cursor-not-allowed opacity-80"
 >
 Buka Game Simulasi
 </button>
 </div>
 )}

 {/* Custom Komitmen Preview */}
 {step?.type === 'custom-komitmen' && (
 <div className="space-y-6">
 <Aktivitas2RisikoGamified
 answers={{}}
 onSave={() => {}}
 />
 <KartuPenggunaDigitalCerdas
 answers={{}}
 onSave={() => {}}
 />
 </div>
 )}

 {/* Custom Mengamati Topik 2 Preview */}
 {step?.type === 'ayo-memahami' && topicId === 'topik-2' && (
 <AyoMengamatiTopik2Gamified
 answers={{}}
 onSave={() => {}}
 />
 )}

 {/* Custom Ayo Cari Tahu Preview */}
 {step?.type === 'ayo-cari-tahu' && (
 <AyoCariTahuT2 />
 )}

 {/* Custom Detektif Berita Preview */}
 {step?.type === 'ayo-mengamati' && topicId === 'topik-2' && (
 <AyoDetektifBeritaT2
 answers={{}}
 onSave={() => {}}
 />
 )}

 {/* Default response placeholder if no questions and not simulation */}
 {(!step?.questions || step.questions.length === 0) && 
 step?.type!== 'ayo-bereksplorasi' && 
 step?.type!== 'custom-komitmen' && 
 !(step?.type === 'ayo-memahami' && topicId === 'topik-2') && 
 step?.type!== 'ayo-cari-tahu' && 
 !(step?.type === 'ayo-mengamati' && topicId === 'topik-2') && (
 <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
 <p className="text-xs text-gray-400 italic">Materi membaca mandiri. Tidak ada kolom respon yang diperlukan.</p>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Navigation Footer */}
 <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
 <button
 type="button"
 disabled={currentStepIndex === 0}
 onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
 className="px-3.5 py-1.5 border border-gray-200 text-gray-650 hover:bg-gray-50 rounded-xl text-xs font-semibold disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
 >
 Sebelumnya
 </button>
 <div className="text-xs text-gray-400 font-medium">
 Langkah {stepNumber} dari {steps.length}
 </div>
 <button
 type="button"
 disabled={currentStepIndex === steps.length - 1}
 onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
 className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
 >
 Selanjutnya
 </button>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Chromebook Keyboard Base Mockup */}
 <div className="w-full bg-slate-700 h-5 rounded-b-3xl shadow-2xl relative border-b-4 border-slate-800">
 <div className="absolute left-1/2 top-1 -translate-x-1/2 w-20 h-1.5 bg-slate-800 rounded-full"></div>
 </div>
 </div>
 </div>
 );
}
