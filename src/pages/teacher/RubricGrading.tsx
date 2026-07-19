import { useState, useEffect, useMemo } from 'react';
import {
 ChevronLeft,
 ChevronRight,
 Save,
 RefreshCw,
 CheckCircle2,
 User,
 Star,
 AlertCircle,
 FileText,
} from 'lucide-react';
import {
 collection,
 doc,
 getDocs,
 onSnapshot,
 serverTimestamp,
 setDoc,
 query,
 where,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { type TopicGrade, type StudentAccount, type StudentTopicResponse, type UserProfile, type TopicStep } from '../../types';
import { useModules } from '../../contexts/ModuleContext';
import {
 getDemoAccounts,
 getAllDemoResponses,
 getAllDemoGrades,
 getDemoProgressList,
 saveDemoGrade,
 saveDemoProgress,
} from '../../lib/demoStore';
import { calculateMultipleChoiceScore, calculateTopicFinalScore } from '../../lib/grading';

function safeLog(label: string, err: unknown) {
 if (err instanceof Error) console.error(`[${label}]`, err.message);
 else console.error(`[${label}] Unknown error`);
}

const SCORE_LABELS: Record<number, { label: string; color: string }> = {
 4: { label: 'Sangat Baik', color: 'bg-success-100 text-success-700 border-success-300' },
 3: { label: 'Baik', color: 'bg-accent-100 text-accent-700 border-accent-300' },
 2: { label: 'Cukup', color: 'bg-warning-100 text-warning-700 border-warning-300' },
 1: { label: 'Perlu Bimbingan', color: 'bg-danger-100 text-danger-700 border-danger-300' },
};

const DEFAULT_RUBRIC = [
 {
 id: 'pemahaman',
 name: 'Pemahaman Konsep',
 weight: 30,
 levels: {
 4: 'Menunjukkan pemahaman yang sangat mendalam tentang konsep digital yang dipelajari.',
 3: 'Menunjukkan pemahaman yang baik tentang sebagian besar konsep digital.',
 2: 'Menunjukkan pemahaman dasar namun masih memiliki beberapa kesalahpahaman.',
 1: 'Belum menunjukkan pemahaman konsep digital yang memadai.'
 }
 },
 {
 id: 'analisis',
 name: 'Kemampuan Analisis',
 weight: 25,
 levels: {
 4: 'Mampu menganalisis situasi atau studi kasus dengan sangat kritis, logis, dan mendalam.',
 3: 'Mampu menganalisis situasi atau studi kasus dengan baik dan logis.',
 2: 'Analisis masih bersifat umum dan belum mendalam.',
 1: 'Analisis tidak relevan atau sangat kurang.'
 }
 },
 {
 id: 'penerapan',
 name: 'Penerapan Pengetahuan',
 weight: 25,
 levels: {
 4: 'Memberikan contoh penerapan yang sangat tepat, kreatif, dan aman.',
 3: 'Memberikan contoh penerapan yang tepat dan aman.',
 2: 'Contoh penerapan masih kurang relevan atau sulit diterapkan.',
 1: 'Tidak mampu memberikan contoh penerapan yang tepat.'
 }
 },
 {
 id: 'refleksi',
 name: 'Refleksi & Kesadaran Digital',
 weight: 20,
 levels: {
 4: 'Refleksi diri sangat mendalam, jujur, dan kesadaran etika digital sangat tinggi.',
 3: 'Refleksi diri baik dan menunjukkan kesadaran etika digital yang baik.',
 2: 'Refleksi diri masih dangkal atau kurang menunjukkan kesadaran etika.',
 1: 'Tidak ada refleksi atau kesadaran etika digital yang ditunjukkan.'
 }
 }
];

type AnswerKeyRef = {
 key: string;
 label: string;
};

type GradableStep = TopicStep & {
 index: number;
 order?: number;
 answerKeys?: AnswerKeyRef[];
 isSynthetic?: boolean;
};

type ActivityStepDescriptor = {
 index: number;
 order: number;
 title: string;
 sourceType: TopicStep['type'];
 answerKeys: AnswerKeyRef[];
};

const TOPIC_ACTIVITY_STEPS: Record<string, ActivityStepDescriptor[]> = {
 'topik-2': [
 {
 index: 201,
 order: 5.1,
 title: 'Yuk Belajar: Latihan Cek Fakta',
 sourceType: 'yuk-belajar',
 answerKeys: [
 { key: 't2-tab-a-quiz', label: 'Misteri Hujan Permen' },
 { key: 't2-tab-b-source', label: 'Sumber informasi yang dipilih' },
 { key: 't2-tabb-chk-0', label: 'Checklist sumber 1' },
 { key: 't2-tabb-chk-1', label: 'Checklist sumber 2' },
 { key: 't2-tabb-chk-2', label: 'Checklist sumber 3' },
 { key: 't2-tabb-chk-3', label: 'Checklist sumber 4' },
 { key: 't2-tabb-chk-4', label: 'Checklist sumber 5' },
 { key: 't2-tab-c-match', label: 'Latihan mencocokkan fakta, opini, hoaks' },
 ],
 },
 {
 index: 202,
 order: 6.1,
 title: 'Aktivitas 1: Deteksi Pesan Masuk',
 sourceType: 'ayo-memahami',
 answerKeys: [{ key: 'activity-mengamati-t2', label: 'Jawaban deteksi pesan masuk' }],
 },
 {
 index: 203,
 order: 7.1,
 title: 'Aktivitas 2: Detektif Informasi',
 sourceType: 'ayo-mengamati',
 answerKeys: [{ key: 'activity-detektif-berita-t2', label: 'Lembar kerja detektif berita' }],
 },
 ],
 'topik-3': [
 {
 index: 301,
 order: 8.1,
 title: 'Aktivitas 1: Analisis Formulir Digital',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't3-formulir', label: 'Keputusan data pada formulir' }],
 },
 {
 index: 302,
 order: 8.2,
 title: 'Aktivitas 2: Detektif Permintaan Data',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't3-detektif-data', label: 'Analisis permintaan data' }],
 },
 {
 index: 303,
 order: 8.3,
 title: 'Aktivitas 3: Latihan Kata Sandi',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't3-password', label: 'Kata sandi latihan dan skor' }],
 },
 {
 index: 304,
 order: 8.4,
 title: 'Aktivitas 4: Simulasi Situs Cerdas',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't3-sim-web', label: 'Keputusan simulasi isi situs' }],
 },
 ],
 'topik-4': [
 {
 index: 401,
 order: 8.1,
 title: 'Aktivitas 1: Detektif Tautan',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't4-detektif-tautan', label: 'Keputusan tautan aman atau bahaya' }],
 },
 {
 index: 402,
 order: 8.2,
 title: 'Aktivitas 2: Tindakan Aman',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't4-tindakan-aman', label: 'Pilihan tindakan pada skenario' }],
 },
 {
 index: 403,
 order: 8.3,
 title: 'Aktivitas 3: Latihan Keputusan',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't4-latihan-keputusan', label: 'Keputusan aman siswa' }],
 },
 {
 index: 404,
 order: 8.4,
 title: 'Aktivitas 4: Lapor Konten',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't4-lapor-konten', label: 'Rencana laporan konten tidak pantas' }],
 },
 {
 index: 405,
 order: 8.5,
 title: 'Aktivitas 5: Studi Kasus',
 sourceType: 'ayo-mengamati',
 answerKeys: [],
 },
 ],
 'topik-5': [
 {
 index: 501,
 order: 4.1,
 title: 'Tantangan Awal: Pesan Santun',
 sourceType: 'tantangan-awal',
 answerKeys: [{ key: 't5-pesan-santun', label: 'Jawaban pesan santun awal' }],
 },
 {
 index: 502,
 order: 8.1,
 title: 'Aktivitas 1: Santun atau Kurang Santun',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't5-santun-kurang', label: 'Klasifikasi komentar santun' }],
 },
 {
 index: 503,
 order: 8.2,
 title: 'Aktivitas 2: Ubah Jadi Lebih Baik',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't5-ubah-baik', label: 'Perbaikan kalimat kurang santun' }],
 },
 {
 index: 504,
 order: 8.3,
 title: 'Aktivitas 3: Studi Kasus Komentar Baik',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't5-studi-kasus', label: 'Analisis studi kasus komentar' }],
 },
 {
 index: 505,
 order: 8.4,
 title: 'Simulasi Chat Bijak',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't5-chat-bijak', label: 'Percakapan dan evaluasi AI/lokal' }],
 },
 ],
 'topik-6': [
 {
 index: 601,
 order: 5.1,
 title: 'Yuk Belajar: Ikrar dan Refleksi Video',
 sourceType: 'yuk-belajar',
 answerKeys: [
 { key: 'digital-pledge-signed', label: 'Ikrar teman baik digital' },
 { key: 't6-video-reflection', label: 'Refleksi setelah menonton video' },
 ],
 },
 {
 index: 602,
 order: 8.1,
 title: 'Aktivitas 1: Cerita Foto yang Disebarkan',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't6-foto-disebarkan', label: 'Peran dan alasan siswa' }],
 },
 {
 index: 603,
 order: 8.2,
 title: 'Aktivitas 2: Studi Kasus Pesan & Komentar',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't6-studi-kasus', label: 'Respons studi kasus cyberbullying' }],
 },
 {
 index: 604,
 order: 8.3,
 title: 'Aktivitas 3: Pusat Simulasi Cyberbullying',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [
 { key: 't6-sim-wa-tugas', label: 'Simulasi WA tugas kelompok' },
 { key: 't6-sim-tiktok-puisi', label: 'Simulasi TikTok puisi' },
 { key: 't6-sim-wa-terpeleset', label: 'Simulasi WA foto terpeleset' },
 { key: 't6-sim-tiktok-dancekorea', label: 'Simulasi TikTok dance Korea' },
 { key: 't6-sim-wa-kelompok', label: 'Simulasi WA kelompok' },
 { key: 't6-sim-tiktok-masak', label: 'Simulasi TikTok memasak' },
 { key: 't6-sim-wa-status', label: 'Simulasi WA status teman' },
 { key: 't6-sim-tiktok-lombatari', label: 'Simulasi TikTok lomba tari' },
 ],
 },
 ],
 'topik-7': [
 {
 index: 701,
 order: 4.1,
 title: 'Tantangan Awal: Hargai atau Langgar',
 sourceType: 'tantangan-awal',
 answerKeys: [{ key: 't7-tantangan-awal', label: 'Keputusan tantangan awal hak cipta' }],
 },
 {
 index: 702,
 order: 5.1,
 title: 'Yuk Belajar: Pantang Plagiat & Tulis Sumber',
 sourceType: 'yuk-belajar',
 answerKeys: [
 { key: 't7-tab-b', label: 'Latihan pantang plagiat' },
 { key: 't7-tab-c', label: 'Latihan hak cipta' },
 { key: 't7-tab-e', label: 'Latihan menulis sumber' },
 ],
 },
 {
 index: 703,
 order: 8.1,
 title: 'Aktivitas 1: Berburu Sumber Gambar',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't7-berburu-gambar', label: 'Hasil berburu sumber gambar' }],
 },
 {
 index: 704,
 order: 8.2,
 title: 'Aktivitas 2: Boleh atau Tidak Boleh',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't7-boleh-tidak', label: 'Keputusan boleh/tidak boleh' }],
 },
 {
 index: 705,
 order: 8.3,
 title: 'Aktivitas 3: Kredit Karya',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't7-kredit-karya', label: 'Latihan kredit karya' }],
 },
 {
 index: 706,
 order: 8.4,
 title: 'Simulasi Konten Bertanggung Jawab',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't7-sim-konten', label: 'Hasil simulasi konten' }],
 },
 ],
 'topik-8': [
 {
 index: 801,
 order: 4.1,
 title: 'Tantangan Awal: Rancang Pesan',
 sourceType: 'tantangan-awal',
 answerKeys: [{ key: 't8-rancang-pesan', label: 'Rancangan pesan kampanye awal' }],
 },
 {
 index: 802,
 order: 5.1,
 title: 'Yuk Belajar: Checklist CERDAS',
 sourceType: 'yuk-belajar',
 answerKeys: [{ key: 't8-cerdas-checklist', label: 'Checklist rancangan kampanye' }],
 },
 {
 index: 808,
 order: 8.1,
 title: 'Aktivitas Akhir: Kampanye Digital',
 sourceType: 'ayo-bereksplorasi',
 answerKeys: [{ key: 't8-final-campaign', label: 'Karya kampanye, link, kesan, dan saran' }],
 },
 ],
};

const formatKeyLabel = (key: string) => {
  const T6_LABELS: Record<string, string> = {
    name: 'Nama Murid',
    checkedCodes: 'Ceklis Kode Etik Panca Mabar',
    signature: 'Tanda Tangan Manual Murid',
    timestamp: 'Waktu Tanda Tangan',
    
    k1_0: '1. Siapa yang menulis pesan kurang baik di grup kelas?',
    k1_1: '2. Pesan mana yang bisa membuat Doni malu atau sedih?',
    k1_2: '3. Siapa yang menunjukkan sikap sebagai teman baik?',
    k1_3: '4. Mengapa pesan Sinta, Alya, dan Bima termasuk baik?',
    k1_4: '5. Apa yang sebaiknya dilakukan Riko?',
    k1_5: '6. Jika kamu ada di grup itu, pesan apa yang akan kamu tulis?',

    k2_0: '1. Komentar siapa yang membuat Raka merasa dihargai?',
    k2_1: '2. Komentar siapa yang dapat membuat Raka sedih atau malu?',
    k2_2: '3. Apakah komentar Farel termasuk kritik yang sopan? Jelaskan alasanmu.',
    k2_3: '4. Komentar siapa yang memberi saran dengan cara baik?',
    k2_4: '5. Apa perbedaan komentar Dina dan komentar Aldi?',
    k2_5: '6. Jika kamu ingin memberi saran kepada Raka, komentar apa yang akan kamu tulis?',

    b_0: '1. Apa persamaan masalah pada Studi Kasus 1 dan Studi Kasus 2?',
    b_1: '2. Apa akibatnya jika kita menulis komentar yang mengejek teman?',
    b_2: '3. Apa yang bisa dilakukan teman baik ketika melihat komentar yang menyakiti?',
    b_3: '4. Menurutmu, mengapa kita perlu berpikir sebelum mengirim pesan atau komentar?',
  };

  if (T6_LABELS[key]) return T6_LABELS[key];

  return key
    .replace(/^t\d+-/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function isEmptyAnswer(value: unknown): boolean {
 if (value === null || value === undefined) return true;
 if (typeof value === 'string') return value.trim() === '';
 if (Array.isArray(value)) return value.length === 0 || value.every(isEmptyAnswer);
 if (typeof value === 'object') return Object.values(value as Record<string, unknown>).every(isEmptyAnswer);
 return false;
}

function AnswerValue({ value }: { value: unknown }) {
 if (isEmptyAnswer(value)) {
 return <span className="text-gray-300 italic">Belum diisi</span>;
 }

 if (typeof value === 'string') {
 if (value.startsWith('data:image/')) {
 return (
 <img
 src={value}
 alt="Jawaban gambar atau tanda tangan siswa"
 className="mt-2 h-20 max-w-full rounded-lg border border-gray-100 bg-white object-contain p-1"
 />
 );
 }

 if (/^https?:\/\//i.test(value)) {
 return (
 <a href={value} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 underline">
 {value}
 </a>
 );
 }

 return <span className="whitespace-pre-wrap">{value}</span>;
 }

 if (typeof value === 'number' || typeof value === 'boolean') {
 return <span>{String(value)}</span>;
 }

 if (Array.isArray(value)) {
 return (
 <ul className="list-disc space-y-1 pl-5">
 {value.map((item, idx) => (
 <li key={idx}>
 <AnswerValue value={item} />
 </li>
 ))}
 </ul>
 );
 }

 if (typeof value === 'object') {
 return (
 <div className="space-y-2">
 {Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => (
 <div key={key} className="rounded-lg border border-gray-100 bg-white/70 p-2">
 <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">{formatKeyLabel(key)}</p>
 <div className="text-xs font-medium leading-relaxed text-surface-800">
 <AnswerValue value={nestedValue} />
 </div>
 </div>
 ))}
 </div>
 );
 }

 return <span>{String(value)}</span>;
}

function ActivityAnswerPreview({ sections }: { sections: { key: string; label: string; value: unknown }[] }) {
 const hasAnyAnswer = sections.some((section) => !isEmptyAnswer(section.value));

 return (
 <div className="space-y-4">
 {!hasAnyAnswer && (
 <div className="rounded-xl bg-warning-50 p-3 text-xs font-semibold text-warning-700">
 Belum ada isian yang tersimpan untuk aktivitas ini.
 </div>
 )}
 {sections.map((section) => (
 <div key={section.key} className="rounded-xl border border-gray-100 bg-white p-4 shadow-2xs">
 <p className="mb-2 text-xs font-bold text-primary-500">{section.label}</p>
 <div className="text-sm font-medium leading-relaxed text-surface-800">
 <AnswerValue value={section.value} />
 </div>
 </div>
 ))}
 </div>
 );
}

interface ManageRubricModalProps {
 initialCriteria: any[];
 onClose: () => void;
 onSave: (criteria: any[]) => Promise<void>;
}

function ManageRubricModal({ initialCriteria, onClose, onSave }: ManageRubricModalProps) {
 const [criteria, setCriteria] = useState<any[]>(() => {
 return JSON.parse(JSON.stringify(initialCriteria));
 });
 const [saving, setSaving] = useState(false);

 const addCriterion = () => {
 setCriteria([
...criteria,
 {
 id: `rc-${Date.now()}`,
 name: 'Kriteria Penilaian Baru',
 weight: 25,
 levels: { 1: '', 2: '', 3: '', 4: '' }
 }
 ]);
 };

 const updateCriterion = (idx: number, field: string, val: any) => {
 const next = [...criteria];
 next[idx] = {...next[idx], [field]: val };
 setCriteria(next);
 };

 const updateLevelDesc = (cIdx: number, level: number, text: string) => {
 const next = [...criteria];
 const crit = {...next[cIdx] };
 crit.levels = crit.levels? {...crit.levels }: {};
 crit.levels[level] = text;
 next[cIdx] = crit;
 setCriteria(next);
 };

 const deleteCriterion = (idx: number) => {
 setCriteria(criteria.filter((_, i) => i!== idx));
 };

 const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

 const handleSave = async () => {
 if (criteria.length === 0) {
 alert('Harus ada minimal satu kriteria!');
 return;
 }
 if (totalWeight!== 100) {
 alert(`Total bobot harus bernilai tepat 100%. Saat ini: ${totalWeight}%`);
 return;
 }
 if (criteria.some(c =>!c.name.trim())) {
 alert('Semua nama kriteria harus diisi!');
 return;
 }
 setSaving(true);
 try {
 await onSave(criteria);
 } catch (err) {
 alert('Gagal menyimpan.');
 } finally {
 setSaving(false);
 }
 };

 return (
 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
 <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl space-y-4">
 <div className="flex items-center justify-between border-b border-gray-100 pb-3">
 <h3 className="font-display font-bold text-lg text-surface-800 flex items-center gap-2">
 Konfigurasi Rubrik Aktivitas
 </h3>
 <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500">
 ✕
 </button>
 </div>

 <p className="text-xs text-gray-500">
 Sesuaikan kriteria evaluasi dan penjelasan deskripsi tingkat 1-4 untuk aktivitas ini. Total bobot kriteria harus tepat 100%.
 </p>

 <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
 {criteria.map((c, idx) => (
 <div key={c.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-3">
 <div className="flex gap-2 items-center">
 <input
 type="text"
 value={c.name}
 onChange={(e) => updateCriterion(idx, 'name', e.target.value)}
 placeholder="Nama Kriteria (e.g. Kedalaman Analisis)"
 className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs"
 />
 <div className="flex items-center gap-1 w-24">
 <input
 type="number"
 min={1}
 max={100}
 value={c.weight}
 onChange={(e) => updateCriterion(idx, 'weight', parseInt(e.target.value) || 0)}
 className="w-12 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center font-mono"
 />
 <span className="text-xs text-gray-400">%</span>
 </div>
 <button
 type="button"
 onClick={() => deleteCriterion(idx)}
 className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded transition-colors"
 >
 ✕
 </button>
 </div>

 {/* Levels Descriptions Editor (1-4) */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-gray-200/50">
 <div>
 <span className="text-[9px] font-bold text-danger-600 block">Tingkat 1 (Perlu Bimbingan)</span>
 <input
 type="text"
 value={c.levels?.[1] || ''}
 onChange={(e) => updateLevelDesc(idx, 1, e.target.value)}
 placeholder="Deskripsi nilai 1..."
 className="w-full mt-0.5 px-2 py-1 border border-gray-200 rounded text-xs"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-warning-600 block">Tingkat 2 (Cukup)</span>
 <input
 type="text"
 value={c.levels?.[2] || ''}
 onChange={(e) => updateLevelDesc(idx, 2, e.target.value)}
 placeholder="Deskripsi nilai 2..."
 className="w-full mt-0.5 px-2 py-1 border border-gray-200 rounded text-xs"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-accent-600 block">Tingkat 3 (Baik)</span>
 <input
 type="text"
 value={c.levels?.[3] || ''}
 onChange={(e) => updateLevelDesc(idx, 3, e.target.value)}
 placeholder="Deskripsi nilai 3..."
 className="w-full mt-0.5 px-2 py-1 border border-gray-200 rounded text-xs"
 />
 </div>
 <div>
 <span className="text-[9px] font-bold text-success-600 block">Tingkat 4 (Sangat Baik)</span>
 <input
 type="text"
 value={c.levels?.[4] || ''}
 onChange={(e) => updateLevelDesc(idx, 4, e.target.value)}
 placeholder="Deskripsi nilai 4..."
 className="w-full mt-0.5 px-2 py-1 border border-gray-200 rounded text-xs"
 />
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="flex items-center justify-between border-t border-gray-100 pt-3">
 <div className="text-xs font-mono">
 Total Bobot:{' '}
 <span className={totalWeight === 100? 'text-success-600 font-bold': 'text-danger-600 font-bold'}>
 {totalWeight}%
 </span>{' '}
 / 100%
 </div>

 <div className="flex gap-2">
 <button
 type="button"
 onClick={addCriterion}
 className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700"
 >
 + Tambah Kriteria
 </button>
 <button
 type="button"
 onClick={handleSave}
 disabled={saving}
 className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
 >
 {saving? 'Menyimpan...': 'Simpan Rubrik'}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}

interface StudentItemProps {
  student: UserProfile;
  isSelected: boolean;
  hasSubmission: boolean;
  isGraded: boolean;
  quizScore?: number;
  onClick: () => void;
}

function StudentItem({ student, isSelected, hasSubmission, isGraded, quizScore, onClick }: StudentItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
        isSelected
          ? 'bg-primary-50 text-primary-900 border-l-4 border-primary-500'
          : 'hover:bg-gray-50 text-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{student.avatarEmoji || ''}</span>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{student.displayName}</p>
          <p className="text-[10px] text-gray-400">
            {hasSubmission 
              ? (quizScore !== undefined ? `Kuis: ${quizScore}%` : 'Mengerjakan') 
              : 'Belum Mulai'}
          </p>
        </div>
      </div>
      <div className="flex gap-1 items-center">
        {quizScore !== undefined && (
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 mr-1">
            {quizScore}
          </span>
        )}
        {isGraded && (
          <span className="w-2.5 h-2.5 rounded-full bg-success-500" title="Sudah dinilai" />
        )}
        {!isGraded && hasSubmission && (
          <span className="w-2.5 h-2.5 rounded-full bg-warning-500 animate-pulse" title="Butuh penilaian" />
        )}
      </div>
    </button>
  );
}

function buildStudentProfilesFromAccounts(accounts: StudentAccount[]): UserProfile[] {
 const profiles = accounts.map((account) => ({
 uid: account.linkedUid || account.studentUid || account.id,
 role: 'siswa' as const,
 displayName: account.displayName || account.username,
 username: account.username,
 guruId: account.guruId,
 classId: account.classId,
 createdAt: account.createdAt,
 }));

 profiles.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
 return profiles;
}

function buildSubmissionMap(responses: StudentTopicResponse[], topicId: string) {
 const map: Record<string, StudentTopicResponse> = {};
 responses
.filter((response) => response.topicId === topicId)
.forEach((response) => {
 map[`${response.studentUid}_${response.topicId}`] = response;
 });
 return map;
}

function buildGradeMap(grades: TopicGrade[], topicId: string) {
 const map: Record<string, TopicGrade> = {};
 grades
.filter((grade) => grade.topicId === topicId)
.forEach((grade) => {
 const uid = grade.uid || grade.studentUid;
 if (uid) {
 map[`${uid}_${grade.topicId}`] = grade;
 }
 });
 return map;
}

export default function RubricGrading() {
 const [guruId] = useState(() => auth?.currentUser?.uid || 'demo-guru-001');
 const { topics: TOPICS, saveTopic } = useModules();
 const [showRubricModal, setShowRubricModal] = useState(false);

 const handleSaveStepRubric = async (newCriteria: any[]) => {
 if (!currentTopic ||!activeStep) return;
 const targetStepIndex = (activeStep as GradableStep).isSynthetic ? -1 : selectedStepIdx;
 if (targetStepIndex < 0 || targetStepIndex >= currentTopic.steps.length) return;
 
 // Create copy of topic steps
 const updatedSteps = currentTopic.steps.map((s, idx) => {
 if (idx === targetStepIndex) {
 return {
...s,
 isGradable: true,
 rubricCriteria: newCriteria,
 };
 }
 return s;
 });

 const updatedTopic = {
...currentTopic,
 steps: updatedSteps,
 };

 try {
 await saveTopic(updatedTopic);
 setShowRubricModal(false);
 alert('Kriteria rubrik langkah berhasil disimpan!');
 } catch (err) {
 safeLog('save-step-rubric', err);
 alert('Gagal menyimpan kriteria rubrik.');
 }
 };

 const [students, setStudents] = useState<UserProfile[]>([]);
 const [selectedStudentIdx, setSelectedStudentIdx] = useState(-1);
 const [selectedTopicId, setSelectedTopicId] = useState('topik-1');
 
 const [submissions, setSubmissions] = useState<Record<string, StudentTopicResponse>>({});
 const [existingGrades, setExistingGrades] = useState<Record<string, TopicGrade>>({});
 
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [saved, setSaved] = useState(false);
 const [refreshTrigger, setRefreshTrigger] = useState(0);
 const [isSyncing, setIsSyncing] = useState(false);
 const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
 const [syncError, setSyncError] = useState('');

 // Grading states
 const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
 const [activityScores, setActivityScores] = useState<Record<string, number>>({});
 const [activityFeedback, setActivityFeedback] = useState('');
 
 // Overall states
 const [generalFeedback, setGeneralFeedback] = useState('');
 const [manualOverrideScore, setManualOverrideScore] = useState<number | ''>('');

 const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

 const handleRefreshSubmissions = async () => {
 setIsSyncing(true);
 setSyncError('');

 try {
 if (!db) {
 const accounts = getDemoAccounts(guruId);
 setStudents(buildStudentProfilesFromAccounts(accounts));
 setSubmissions(buildSubmissionMap(getAllDemoResponses(guruId), selectedTopicId));
 setExistingGrades(buildGradeMap(getAllDemoGrades(guruId), selectedTopicId));
 } else {
 const accountsQ = query(collection(db, 'accounts'), where('guruId', '==', guruId));
 const submissionsQ = query(
 collection(db, 'student_topic_responses'),
 where('guruId', '==', guruId),
 where('topicId', '==', selectedTopicId),
 );
 const gradesQ = query(
 collection(db, 'topicGrades'),
 where('guruId', '==', guruId),
 where('topicId', '==', selectedTopicId),
 );

 const [accountsSnap, submissionsSnap, gradesSnap] = await Promise.all([
 getDocs(accountsQ),
 getDocs(submissionsQ),
 getDocs(gradesQ),
 ]);

 const accounts = accountsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as StudentAccount));
 const responses = submissionsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as StudentTopicResponse));
 const grades = gradesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as TopicGrade));

 setStudents(buildStudentProfilesFromAccounts(accounts));
 setSubmissions(buildSubmissionMap(responses, selectedTopicId));
 setExistingGrades(buildGradeMap(grades, selectedTopicId));
 }

 setLastSyncedAt(Date.now());
 } catch (err) {
 safeLog('refresh-submissions', err);
 setSyncError('Sinkron gagal. Coba refresh lagi.');
 } finally {
 setIsSyncing(false);
 }
 };

 const selectedStudent = students[selectedStudentIdx]?? null;
 const gradeKey = selectedStudent? `${selectedStudent.uid}_${selectedTopicId}`: '';
 const currentTopic = TOPICS.find((t) => t.id === selectedTopicId);
 const currentSubmission = submissions[gradeKey]?? null;

 // Filter gradable steps of selected topic
 const gradableSteps = useMemo<GradableStep[]>(() => {
 if (!currentTopic) return [];
 
 const defaultSteps = currentTopic.steps
.map((step, idx) => ({...step, index: idx, order: idx } as GradableStep));
 const stepAt = (idx: number, fallback: GradableStep) => defaultSteps[idx]
 ? { ...defaultSteps[idx], ...fallback }
 : fallback;
 
 if (selectedTopicId === 'topik-1') {
 return [
 stepAt(3, { index: 3, order: 3, title: 'Bersiap Belajar', type: 'bersiap-belajar', isGradable: true, content: '' }),
 {
 index: 101,
 order: 5.1,
 title: 'Yuk Belajar: Latihan Interaktif',
 type: 'yuk-belajar',
 isGradable: true,
 content: '',
 isSynthetic: true,
 answerKeys: [
 { key: 't1-tab-a-device', label: 'Pilihan perangkat digital' },
 { key: 't1-tab-b-quiz', label: 'Latihan hak dan tanggung jawab' },
 { key: 't1-tab-b-hak', label: 'Contoh hak digital' },
 { key: 't1-tab-b-tanggungjawab', label: 'Contoh tanggung jawab digital' },
 { key: 't1-tab-c-activity', label: 'Rahasia internet' },
 { key: 't1-tab-d-risk', label: 'Risiko digital yang dipilih' },
 ],
 },
 stepAt(5, { index: 5, order: 5.2, title: 'Aktivitas 1: Tabel Belajar', type: 'yuk-belajar', isGradable: true, content: '' }),
 stepAt(6, { index: 6, order: 7, title: 'Ayo Memahami', type: 'ayo-memahami', isGradable: true, content: '' }),
 {
 index: 102,
 order: 6,
 title: 'Aktivitas 2, TTS & Komitmen',
 type: 'custom-komitmen',
 isGradable: true,
 content: '',
 isSynthetic: true,
 },
 stepAt(8, { index: 8, order: 9, title: 'Refleksi Belajar', type: 'refleksi', isGradable: true, content: '' })
 ] as GradableStep[];
 }

 const baseQuestionSteps = defaultSteps.filter((step) => {
 const questions = step.questions || [];
 const hasTeacherReadableQuestion = questions.some((q) => q.type !== 'mc');
 return step.isGradable
 || step.type === 'bersiap-belajar'
 || step.type === 'refleksi'
 || hasTeacherReadableQuestion;
 });

 const mappedActivitySteps = (TOPIC_ACTIVITY_STEPS[selectedTopicId] || []).map((descriptor) => {
 const sourceStep = defaultSteps.find((step) => step.type === descriptor.sourceType);
 return {
 ...(sourceStep || {
 type: descriptor.sourceType,
 content: '',
 }),
 index: descriptor.index,
 order: descriptor.order,
 title: descriptor.title,
 isGradable: true,
 isSynthetic: true,
 answerKeys: descriptor.answerKeys,
 } as GradableStep;
 });

 return [...baseQuestionSteps, ...mappedActivitySteps]
 .filter((step) => step.type !== 'uji-pemahaman')
 .sort((a, b) => (a.order ?? a.index) - (b.order ?? b.index));
 }, [currentTopic, selectedTopicId]);

 const activeStep = gradableSteps.find((s) => s.index === selectedStepIdx) || gradableSteps[0] || null;

 // Load students list
 useEffect(() => {
 setLoading(true);
 if (!db) {
 const accounts = getDemoAccounts(guruId);
 setStudents(buildStudentProfilesFromAccounts(accounts));
 setLoading(false);
 return;
 }

 const q = query(collection(db, 'accounts'), where('guruId', '==', guruId));
 const unsub = onSnapshot(
 q,
 (snap) => {
 const accounts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as StudentAccount));
 setStudents(buildStudentProfilesFromAccounts(accounts));
 setLoading(false);
 },
 (err) => {
 safeLog('students-snapshot', err);
 setLoading(false);
 }
 );
 return unsub;
 }, [guruId, refreshTrigger]);

 // Load submissions
 useEffect(() => {
 if (!db) {
 const responses = getAllDemoResponses(guruId);
 setSubmissions(buildSubmissionMap(responses, selectedTopicId));
 setLastSyncedAt(Date.now());
 return;
 }

 const q = query(
 collection(db, 'student_topic_responses'),
 where('guruId', '==', guruId),
 where('topicId', '==', selectedTopicId),
 );
 const unsub = onSnapshot(
 q,
 (snap) => {
 const responses = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as StudentTopicResponse));
 setSubmissions(buildSubmissionMap(responses, selectedTopicId));
 setLastSyncedAt(Date.now());
 },
 (err) => safeLog('submissions-snapshot', err)
 );
 return unsub;
 }, [guruId, selectedTopicId, refreshTrigger]);

 // Load grades
 useEffect(() => {
 if (!db) {
 const grades = getAllDemoGrades(guruId);
 setExistingGrades(buildGradeMap(grades, selectedTopicId));
 return;
 }

 const q = query(
 collection(db, 'topicGrades'),
 where('guruId', '==', guruId),
 where('topicId', '==', selectedTopicId)
 );
 const unsub = onSnapshot(
 q,
 (snap) => {
 const grades = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as TopicGrade));
 setExistingGrades(buildGradeMap(grades, selectedTopicId));
 },
 (err) => safeLog('grades-snapshot', err)
 );
 return unsub;
 }, [guruId, selectedTopicId, refreshTrigger]);

 // Keep selected student index inside the current list.
 useEffect(() => {
 if (selectedStudentIdx >= students.length) {
 setSelectedStudentIdx(Math.max(0, students.length - 1));
 }
 }, [selectedStudentIdx, students.length]);

 // Set default selected step when gradable steps load
 useEffect(() => {
 if (gradableSteps.length > 0) {
 setSelectedStepIdx(gradableSteps[0].index);
 }
 }, [gradableSteps]);

 // Load selected step's score & feedback
 useEffect(() => {
 const grade = existingGrades[gradeKey];
 if (grade) {
 setGeneralFeedback(grade.feedback || '');
 setManualOverrideScore(grade.manualOverrideScore!== undefined? grade.manualOverrideScore: '');
 
 const actGrade = grade.activityGrades?.[selectedStepIdx];
 if (actGrade) {
 setActivityScores(actGrade.scores || {});
 setActivityFeedback(actGrade.feedback || '');
 } else {
 setActivityScores({});
 setActivityFeedback('');
 }
 } else {
 setGeneralFeedback('');
 setManualOverrideScore('');
 setActivityScores({});
 setActivityFeedback('');
 }
 setSaved(false);
 }, [gradeKey, selectedStepIdx, existingGrades]);

 // Active step criteria
 const activeCriteria = useMemo(() => {
 if (!activeStep) return DEFAULT_RUBRIC;
 return activeStep.rubricCriteria && activeStep.rubricCriteria.length > 0
? activeStep.rubricCriteria
: DEFAULT_RUBRIC;
 }, [activeStep]);

 // Calculate current active step score out of 100
 const activeStepScore = useMemo(() => {
 if (activeCriteria.length === 0) return 0;
 let totalScore = 0;
 let totalWeight = 0;
 activeCriteria.forEach((c: any) => {
 const score = activityScores[c.id] || 0;
 totalScore += score * c.weight;
 totalWeight += c.weight;
 });

 if (totalWeight === 0) return 0;
 const avg = totalScore / totalWeight; // between 1 and 4
 return Math.round(avg * 25); // scaled to 100
 }, [activityScores, activeCriteria]);

 // Calculate overall average of graded activities
 const avgActivitiesScore = useMemo(() => {
 const grade = existingGrades[gradeKey];
 if (!grade ||!grade.activityGrades) return 0;
 
 const gradableIndices = gradableSteps.map((s) => s.index);
 let total = 0;
 let count = 0;

 gradableIndices.forEach((idx) => {
 const actGrade = grade.activityGrades?.[idx];
 const step = currentTopic?.steps[idx];
 if (actGrade) {
 const criteria = step?.rubricCriteria && step.rubricCriteria.length > 0
? step.rubricCriteria
: DEFAULT_RUBRIC;
 
 let stepScore = 0;
 let stepWeight = 0;
 criteria.forEach((c: any) => {
 const score = actGrade.scores?.[c.id] || 0;
 stepScore += score * c.weight;
 stepWeight += c.weight;
 });

 if (stepWeight > 0) {
 total += (stepScore / stepWeight) * 25;
 count++;
 }
 }
 });

 return count > 0? Math.round(total / count): 0;
 }, [existingGrades, gradeKey, gradableSteps, currentTopic]);

 // Calculate quiz score
 const quizScore = useMemo(() => {
 if (!currentSubmission) return 0;
 const quizStep = currentTopic?.steps.find((s) => s.type === 'uji-pemahaman');
 if (!quizStep) return 0;
 return calculateMultipleChoiceScore(quizStep.questions || [], currentSubmission.answers || {}).score;
 }, [currentSubmission, currentTopic]);

 // Simulation score
 const simulationScore = useMemo(() => {
 return currentSubmission?.simulationScore?? currentSubmission?.simulationResult?.score?? 0;
 }, [currentSubmission]);

 // Computed final score
 const computedFinalScore = useMemo(() => {
 return calculateTopicFinalScore({
 quizScore,
 simulationScore,
 activitiesScore: avgActivitiesScore,
 });
 }, [avgActivitiesScore, quizScore, simulationScore]);

 const syncProgressFinalGrade = async (finalScore: number) => {
 if (!selectedStudent ||!guruId ||!currentTopic) return;

 const normalizedScore = Math.max(0, Math.min(100, Math.round(finalScore)));
 const progressPayload = {
 uid: selectedStudent.uid,
 studentUid: selectedStudent.uid,
 guruId,
 topicId: selectedTopicId,
 moduleId: 'aku-cerdas-digital',
 currentStep: Math.max(0, currentTopic.steps.length - 1),
 status: 'completed' as const,
 score: normalizedScore,
 finalScore: normalizedScore,
 scoreStatus: 'final' as const,
 submissionStatus: 'submitted' as const,
 badges: [currentTopic.badgeId].filter(Boolean),
 badgeEarned: true,
 };

 if (!db) {
 const existingProgress = getDemoProgressList(selectedStudent.uid)
 .find((progress) => progress.topicId === selectedTopicId);
 saveDemoProgress({
 ...(existingProgress || {}),
 id: gradeKey,
 ...progressPayload,
 gradedAt: Date.now(),
 });
 return;
 }

 await setDoc(doc(db, 'progress', gradeKey), {
 ...progressPayload,
 gradedAt: serverTimestamp(),
 }, { merge: true });
 };

 // Save current activity grade local change
 const handleSaveActivityGrade = async () => {
 if (!selectedStudent ||!guruId ||!activeStep) return;
 
 const grade = existingGrades[gradeKey] || {
 uid: selectedStudent.uid,
 studentUid: selectedStudent.uid,
 studentName: selectedStudent.displayName || selectedStudent.username || '',
 topicId: selectedTopicId,
 guruId,
 rubric: DEFAULT_RUBRIC.map((c) => ({...c, score: 0 })),
 finalScore: 0,
 feedback: '',
 gradedAt: Date.now(),
 activityGrades: {},
 };

 const nextActivityGrades = {
...(grade.activityGrades || {}),
 [selectedStepIdx]: {
 scores: activityScores,
 feedback: activityFeedback,
 },
 };

 const payload: TopicGrade = {
...grade,
 activityGrades: nextActivityGrades,
 };

 // Recalculate final score with this new activity grade
 let actTotal = 0;
 let actCount = 0;
 gradableSteps.forEach((s) => {
 const actG = nextActivityGrades[s.index];
 const step = currentTopic?.steps[s.index];
 if (actG) {
 const criteria = step?.rubricCriteria && step.rubricCriteria.length > 0
? step.rubricCriteria
: DEFAULT_RUBRIC;
 
 let stepScore = 0;
 let stepWeight = 0;
 criteria.forEach((c) => {
 const score = actG.scores?.[c.id] || 0;
 stepScore += score * c.weight;
 stepWeight += c.weight;
 });

 if (stepWeight > 0) {
 actTotal += (stepScore / stepWeight) * 25;
 actCount++;
 }
 }
 });

 const calculatedAvgAct = actCount > 0? Math.round(actTotal / actCount): 0;
 const newFinalScore = calculateTopicFinalScore({
 quizScore,
 simulationScore,
 activitiesScore: calculatedAvgAct,
 });

 payload.finalScore = manualOverrideScore!== ''? Number(manualOverrideScore): newFinalScore;

 setSaving(true);
 try {
 if (!db) {
 saveDemoGrade(payload);
 } else {
 await setDoc(doc(db, 'topicGrades', gradeKey), payload);
 }
 await syncProgressFinalGrade(payload.finalScore);
 if (!db) triggerRefresh();
 setSaved(true);
 setTimeout(() => setSaved(false), 1500);
 } catch (err) {
 safeLog('save-activity-grade', err);
 } finally {
 setSaving(false);
 }
 };

 // Save overall final evaluation & override
 const handleSaveOverallGrade = async () => {
 if (!selectedStudent ||!guruId) return;

 const grade = existingGrades[gradeKey] || {
 uid: selectedStudent.uid,
 studentUid: selectedStudent.uid,
 studentName: selectedStudent.displayName || selectedStudent.username || '',
 topicId: selectedTopicId,
 guruId,
 rubric: DEFAULT_RUBRIC.map((c) => ({...c, score: 0 })),
 finalScore: 0,
 feedback: '',
 gradedAt: Date.now(),
 activityGrades: {},
 };

 const finalScore = manualOverrideScore!== ''? Number(manualOverrideScore): computedFinalScore;

 const payload: TopicGrade = {
...grade,
 finalScore,
 feedback: generalFeedback,
 manualOverrideScore: manualOverrideScore!== ''? Number(manualOverrideScore): undefined,
 gradedAt: Date.now(),
 };

 setSaving(true);
 try {
 if (!db) {
 saveDemoGrade(payload);
 } else {
 await setDoc(doc(db, 'topicGrades', gradeKey), payload);
 }
 await syncProgressFinalGrade(finalScore);
 if (!db) triggerRefresh();
 setSaved(true);
 setTimeout(() => setSaved(false), 1500);
 } catch (err) {
 safeLog('save-overall-grade', err);
 } finally {
 setSaving(false);
 }
 };

 const goPrev = () => setSelectedStudentIdx((i) => Math.max(0, i - 1));
 const goNext = () => setSelectedStudentIdx((i) => Math.min(students.length - 1, i + 1));

 // Find answers for active step
 const activeStepAnswers = useMemo(() => {
 if (!currentSubmission ||!activeStep) return [];
 const qIds = (activeStep as any).questions?.map((q: any) => q.id) || [];
 return qIds.map((id: any) => {
 const q = (activeStep as any).questions?.find((qu: any) => qu.id === id);
 const ansVal = currentSubmission.answers?.[id];
 let formattedAnswer = 'Tidak dijawab';
 if (ansVal!== undefined && ansVal!== '') {
 if (q?.type === 'mc' && q.options) {
 formattedAnswer = q.options[Number(ansVal)]?.text || String(ansVal);
 } else {
 formattedAnswer = String(ansVal);
 }
 }
 return {
 questionText: q?.question || '',
 answer: formattedAnswer,
 };
 });
 }, [currentSubmission, activeStep]);

 const activeAnswerSections = useMemo(() => {
 if (!currentSubmission || !activeStep?.answerKeys) return [];
 return activeStep.answerKeys.map((item) => ({
 key: item.key,
 label: item.label,
 value: currentSubmission.answers?.[item.key],
 }));
 }, [currentSubmission, activeStep]);

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <RefreshCw size={32} className="animate-spin text-primary-400" />
 </div>
 );
 }

 return (
 <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-140px)]">
 {/* Left panel: Students list & Topic select */}
 <div className={`w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col overflow-hidden ${selectedStudentIdx !== -1 ? 'hidden lg:flex' : 'flex'}`}>
 <div className="p-4 border-b border-gray-100 space-y-3">
 <div>
 <label className="block text-xs text-gray-400 font-semibold mb-1">Pilih Topik</label>
 <select
 value={selectedTopicId}
 onChange={(e) => setSelectedTopicId(e.target.value)}
 className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none bg-white appearance-none"
 >
 {TOPICS.map((t: any) => (
 <option key={t.id} value={t.id}>
 {t.number}. {t.title}
 </option>
 ))}
 </select>
 </div>
 <div className="space-y-2">
 <button
 type="button"
 onClick={handleRefreshSubmissions}
 disabled={isSyncing}
 className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-all hover:bg-white hover:shadow-card disabled:cursor-wait disabled:opacity-60"
 title="Sinkron ulang kiriman tugas murid"
 >
 <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
 {isSyncing ? 'Menyinkronkan...' : 'Refresh Tugas'}
 </button>
 {lastSyncedAt && (
 <p className="text-[10px] font-semibold text-gray-400">
 Terakhir sinkron {new Date(lastSyncedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
 </p>
 )}
 {syncError && (
 <p className="flex items-center gap-1 text-[10px] font-semibold text-danger-600">
 <AlertCircle className="h-3 w-3" />
 {syncError}
 </p>
 )}
 </div>
 </div>

 <div className="p-3 border-b border-gray-100 bg-gray-50/50">
 <p className="text-xs text-gray-500 font-semibold">
 {students.length} siswa • {Object.keys(existingGrades).length} dinilai
 </p>
 </div>

 <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
 {students.length === 0? (
 <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm">
 <User size={24} className="mb-2" />
 <p>Belum ada siswa</p>
 </div>
 ): (
 students.map((s, idx) => {
 const key = `${s.uid}_${selectedTopicId}`;
 const submission = submissions[key];
 const hasStarted = submission && (Object.keys(submission.answers || {}).length > 0 || (submission.step || 0) > 0);
 return (
 <StudentItem
 key={s.uid}
 student={s}
 isSelected={idx === selectedStudentIdx}
 hasSubmission={!!submission && !!hasStarted}
 isGraded={!!existingGrades[key]}
 quizScore={submission && !submission.isDraft ? submission.quizScore : undefined}
 onClick={() => setSelectedStudentIdx(idx)}
 />
 );
 })
 )}
 </div>
 </div>

 {/* Right panel: Grading workspace */}
 <div className={`flex-1 bg-white rounded-2xl shadow-card border border-gray-100 flex flex-col overflow-hidden ${selectedStudentIdx === -1 ? 'hidden lg:flex' : 'flex'}`}>
 {!selectedStudent? (
 <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-16">
 <User size={40} className="mb-3" />
 <p className="font-medium">Pilih siswa untuk mulai menilai</p>
 </div>
 ): (
 <>
 {/* Header */}
 <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
 <div className="flex items-center gap-3">
 {/* Kembali button on mobile */}
 <button
 type="button"
 onClick={() => setSelectedStudentIdx(-1)}
 className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden flex items-center gap-1 text-xs font-semibold animate-fade-in"
 title="Kembali ke Daftar Siswa"
 >
 <ChevronLeft size={16} />
 <span>Kembali</span>
 </button>
 <div>
 <h3 className="font-display font-bold text-surface-800">
 {selectedStudent.displayName || selectedStudent.username || 'Siswa'}
 </h3>
 <p className="text-xs text-gray-400 mt-0.5">
 Topik {selectedTopicId}: {currentTopic?.title}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <button
 onClick={goPrev}
 disabled={selectedStudentIdx <= 0}
 className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
 >
 <ChevronLeft size={18} />
 </button>
 <span className="text-xs text-gray-500 font-semibold min-w-[50px] text-center">
 {selectedStudentIdx + 1} / {students.length}
 </span>
 <button
 onClick={goNext}
 disabled={selectedStudentIdx === -1 || selectedStudentIdx === students.length - 1}
 className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
 >
 <ChevronRight size={18} />
 </button>
 </div>
 </div>

 {/* Main grading body */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
    {currentSubmission?.isDraft && (
      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-xs font-bold border border-amber-200">
        <AlertCircle size={14} className="text-amber-500" />
        <span>Karya/Jawaban siswa ini masih berupa DRAFT dan belum dikirim secara resmi.</span>
      </div>
    )}
 
 {/* Step Tab selector */}
 {gradableSteps.length > 0 && (
 <div className="space-y-2">
 <label className="block text-xs font-bold text-gray-400 uppercase">Pilih Aktivitas Pembelajaran</label>
 <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none">
 {gradableSteps.map((step) => {
 const isGraded =!!existingGrades[gradeKey]?.activityGrades?.[step.index];
 const isStepActive = selectedStepIdx === step.index;
 return (
 <button
 key={step.index}
 type="button"
 onClick={() => setSelectedStepIdx(step.index)}
 className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
 isStepActive
? 'bg-primary-500 text-white border-primary-500 shadow-sm'
: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
 }`}
 >
 {step.title} {isGraded && '✓'}
 </button>
 );
 })}
 </div>
 </div>
 )}

 {/* Answers preview for selected step */}
 {activeStep && (
 <div className="bg-surface-50 border border-gray-100/60 rounded-2xl p-5 space-y-4">
 <h4 className="font-display font-semibold text-surface-800 text-sm flex items-center gap-2">
 <FileText size={16} className="text-primary-500" />
 Respons Siswa: {activeStep.title}
 </h4>
 
 {!currentSubmission? (
 <div className="flex items-center gap-2 p-3 bg-warning-50 rounded-xl text-warning-600 text-xs font-semibold">
 <AlertCircle size={14} />
 Siswa belum mengirimkan draf jawaban untuk topik ini
 </div>
 ): selectedTopicId === 'topik-8' && activeStep.index === 8? (
  // Render Aktivitas Akhir & Refleksi (Topic 8) Preview
  <div className="space-y-4">
    {(() => {
      const finalCampaign = (currentSubmission.answers?.['t8-final-campaign'] || {}) as any;
      return (
        <div className="space-y-4">
          {/* Card Kampanye */}
          <div className="bg-white border border-gray-150 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <p className="text-xs text-primary-500 font-bold uppercase tracking-wider">Karya Kampanye Digital</p>
            <div className="space-y-2.5 text-xs text-left">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Judul Kampanye</span>
                <p className="text-sm font-bold text-gray-800">{finalCampaign.campaignTitle || <span className="text-gray-300 italic">Belum diisi</span>}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Caption / Deskripsi</span>
                <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{finalCampaign.caption || <span className="text-gray-300 italic">Belum diisi</span>}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Link Tautan Karya</span>
                <div className="mt-1">
                  {finalCampaign.workLink ? (
                    <a 
                      href={finalCampaign.workLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-750 hover:bg-violet-100 text-xs font-bold rounded-xl border border-violet-100 transition-colors"
                    >
                      🔗 Buka Link Karya ({finalCampaign.workLink})
                    </a>
                  ) : (
                    <span className="text-gray-300 italic">Belum diisi</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card Refleksi Kesan & Saran */}
          <div className="bg-gradient-to-r from-violet-50/40 to-indigo-50/40 border border-violet-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <p className="text-xs text-violet-600 font-bold uppercase tracking-wider">Refleksi Akhir (Kesan & Saran)</p>
            <div className="space-y-2.5 text-xs text-left">
              <div>
                <span className="text-[10px] text-violet-500 font-bold block uppercase">Kesan Belajar</span>
                <p className="text-gray-700 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-violet-100/40">{finalCampaign.kesan || <span className="text-gray-300 italic">Belum diisi</span>}</p>
              </div>
              <div>
                <span className="text-[10px] text-violet-500 font-bold block uppercase">Saran Pembelajaran</span>
                <p className="text-gray-700 leading-relaxed font-medium bg-white/70 p-3 rounded-xl border border-violet-100/40">{finalCampaign.saran || <span className="text-gray-300 italic">Belum diisi</span>}</p>
              </div>
            </div>
          </div>
        </div>
      );
    })()}
  </div>
  ): selectedTopicId === 'topik-1' && activeStep.index === 5? (
 // Render Aktivitas 1 Table Preview
 <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white p-4">
 <table className="w-full text-xs text-left text-gray-500">
 <thead className="bg-primary-50 text-primary-700 text-[10px] uppercase font-bold">
 <tr>
 <th className="px-4 py-2">Baris / Contoh</th>
 <th className="px-4 py-2">Aktivitas Digital yang Dilakukan</th>
 <th className="px-4 py-2">Perangkat yang Digunakan</th>
 <th className="px-4 py-2">Manfaatnya</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-100">
 {/* Row 1: Contoh */}
 <tr className="italic text-primary-700 bg-primary-50/30">
 <td className="px-4 py-2 font-semibold">Contoh</td>
 <td className="px-4 py-2">Menonton video pembelajaran</td>
 <td className="px-4 py-2">Gawai (HP/Tablet)</td>
 <td className="px-4 py-2">Membantu memahami pelajaran dengan lebih mudah</td>
 </tr>
 {[1, 2, 3].map((rowIdx) => {
 const act1Ans = (currentSubmission.answers?.['activity-1'] || {}) as any;
 return (
 <tr key={rowIdx}>
 <td className="px-4 py-2 font-semibold text-gray-700">{rowIdx}</td>
 <td className="px-4 py-2 text-surface-800 font-medium">
 {act1Ans[`row_${rowIdx}_aktivitas`] || <span className="text-gray-300 italic">Belum diisi</span>}
 </td>
 <td className="px-4 py-2 text-surface-800 font-medium">
 {act1Ans[`row_${rowIdx}_perangkat`] || <span className="text-gray-300 italic">Belum diisi</span>}
 </td>
 <td className="px-4 py-2 text-surface-800 font-medium">
 {act1Ans[`row_${rowIdx}_manfaat`] || <span className="text-gray-300 italic">Belum diisi</span>}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 ): activeAnswerSections.length > 0? (
 <ActivityAnswerPreview sections={activeAnswerSections} />
 ): selectedTopicId === 'topik-2' && activeStep.type === 'ayo-memahami'? (
  // Render Ayo Mengamati Gamified Responses for Topic 2
  <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-2xs">
  <p className="text-xs text-primary-500 font-bold">Aktivitas 1: Deteksi Pesan Masuk (Ayo Mengamati)</p>
  
  <div className="space-y-4">
  {[
    { id: 'msg-1', label: 'Pesan 1: Ibu Rini (Jumat Bersih)', correct: 'benar' },
    { id: 'msg-2', label: 'Pesan 2: No. Tidak Dikenal (Libur Seminggu)', correct: 'meragukan' },
    { id: 'msg-3', label: 'Pesan 3: Sepeda Gratis (Minta Data Keluarga)', correct: 'meragukan' },
    { id: 'msg-4', label: 'Pesan 4: Pusat Bantuan Game (Minta OTP/Password)', correct: 'meragukan' },
    { id: 'msg-5', label: 'Pesan 5: Dito - Teman Sekelas (Robux/Diamond Gratis)', correct: 'meragukan' },
  ].map((m) => {
    const answersT2 = (currentSubmission.answers?.['activity-mengamati-t2'] || {}) as Record<string, any>;
    const chosen = answersT2[m.id];
    const alasan = answersT2[m.id + '_alasan'];
    const tindakLanjut = answersT2[m.id + '_tindakLanjut'];
    const isCorrect = chosen === m.correct;

    return (
      <div key={m.id} className={`p-4 rounded-xl border text-xs flex flex-col gap-3.5 ${chosen ? (isCorrect ? 'bg-emerald-50/20 border-emerald-200' : 'bg-rose-50/20 border-rose-200') : 'bg-gray-50/50 border-gray-100'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-gray-100/50 pb-2">
          <span className="font-bold text-gray-700">{m.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Jawaban Siswa:</span>
            {chosen ? (
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${isCorrect ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'}`}>
                {chosen === 'benar' ? 'Benar' : 'Meragukan'}
              </span>
            ) : (
              <span className="text-gray-300 italic">Belum diisi</span>
            )}
          </div>
        </div>

        {chosen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-left">
            <div className="bg-white p-2.5 rounded-lg border border-gray-150/60">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Alasan Murid</span>
              <p className="text-gray-700 font-medium leading-relaxed">{alasan || <span className="text-gray-300 italic">Tidak diisi</span>}</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-gray-150/60">
              <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Tindak Lanjut Murid</span>
              <p className="text-gray-700 font-medium leading-relaxed">{tindakLanjut || <span className="text-gray-300 italic">Tidak diisi</span>}</p>
            </div>
          </div>
        )}
      </div>
    );
  })}
  </div>
  </div>
  ): selectedTopicId === 'topik-2' && activeStep.type === 'ayo-mengamati'? (
  // Render Ayo Detektif Berita Responses for Topic 2
  <div className="space-y-4">
  {(() => {
  const dbAns = (currentSubmission.answers?.['activity-detektif-berita-t2'] || {}) as any;
  const newsKeys = [
    { id: 'news-1', label: 'Berita 1: Lomba Robotik (SD Harapan Bangsa)', correct: 'benar' },
    { id: 'news-3', label: 'Berita 2: El-Nino X (Blogspot)', correct: 'meragukan' },
    { id: 'news-4', label: 'Berita 3: Makanan Bergizi Gratis (Kemendikdasmen)', correct: 'benar' },
    { id: 'news-5', label: 'Berita 4: Saldo Rupiah Digital Gratis (Blogspot)', correct: 'meragukan' },
  ];
  
  return (
  <div className="space-y-4">
  {newsKeys.map((m) => {
  const nData = dbAns[m.id] || {};
  const isCorrect = nData.kesimpulan === m.correct;
  
  return (
  <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-2xs">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 mb-2 gap-2">
  <span className="font-bold text-xs text-gray-800">{m.label}</span>
  {nData.kesimpulan? (
  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${isCorrect? 'bg-emerald-100 text-emerald-800 border-emerald-300': 'bg-rose-100 text-rose-800 border-rose-300'}`}>
  Kesimpulan Siswa: {nData.kesimpulan === 'benar'? ' Benar': ' Meragukan'} {isCorrect? '': ''}
  </span>
  ): (
  <span className="text-[10px] text-gray-300 italic">Belum diisi</span>
  )}
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Judul Berita (Input Siswa)</span>
  <span className="text-gray-750 font-medium">{nData.judul || <span className="text-gray-300 italic">Tidak diisi</span>}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Sumber Berita (Input Siswa)</span>
  <span className="text-gray-755 font-medium">{nData.sumber || <span className="text-gray-300 italic">Tidak diisi</span>}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Sumber Jelas & Terpercaya?</span>
  <span className="text-gray-755 font-medium capitalize">{nData.sumberJelas || <span className="text-gray-300 italic">Tidak diisi</span>} {nData.sumberJelasDetail && `(${nData.sumberJelasDetail})`}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Ada Tanggal?</span>
  <span className="text-gray-755 font-medium capitalize">{nData.tanggal || <span className="text-gray-300 italic">Tidak diisi</span>} {nData.tanggalDetail && `(${nData.tanggalDetail})`}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Judul Sesuai Isi?</span>
  <span className="text-gray-755 font-medium capitalize">{nData.judulSesuai || <span className="text-gray-300 italic">Tidak diisi</span>} {nData.judulSesuaiDetail && `(${nData.judulSesuaiDetail})`}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Bukti Pendukung?</span>
  <span className="text-gray-755 font-medium capitalize">{nData.bukti || <span className="text-gray-300 italic">Tidak diisi</span>} {nData.buktiDetail && `(${nData.buktiDetail})`}</span>
  </div>
  <div>
  <span className="text-[10px] text-gray-450 font-bold block">Bahasa Berlebihan?</span>
  <span className="text-gray-755 font-medium capitalize">{nData.bahasaBerlebih || <span className="text-gray-300 italic">Tidak diisi</span>} {nData.bahasaBerlebihDetail && `(${nData.bahasaBerlebihDetail})`}</span>
  </div>
  </div>
  </div>
  );
  })}
  </div>
  );
  })()}
  </div>
 ): selectedTopicId === 'topik-1' && activeStep.type === 'custom-komitmen'? (
 // Render Aktivitas 2 (Quest Cards) and Agreement Card Preview
 <div className="space-y-5">
 {/* Aktivitas 2 Quest Cards Preview */}
 <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-2xs">
 <p className="text-xs text-primary-500 font-bold">Aktivitas 2: Misi Kenali Risiko Digital (Quest Cards)</p>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 { id: "sit1", label: "Misi 1: Game Saat Belajar" },
 { id: "sit2", label: "Misi 2: Link Hadiah Gratis" },
 { id: "sit3", label: "Misi 3: Komentar Kasar" },
 { id: "sit4", label: "Misi 4: Meminta Data Pribadi" },
 { id: "sit5", label: "Misi 5: Menatap Layar Terlalu Lama" },
 ].map((q) => {
 const act2Ans = (currentSubmission.answers?.['activity-2'] || {}) as any;
 const risk = act2Ans[`${q.id}_risiko`]?.trim();
 const action = act2Ans[`${q.id}_tindakan`]?.trim();
 const isFinished = risk && action;

 return (
 <div key={q.id} className={`p-3 rounded-lg border text-xs ${isFinished? 'bg-yellow-50/20 border-yellow-200 shadow-2xs': 'bg-gray-50/50 border-gray-100'}`}>
 <div className="flex justify-between items-center font-bold text-gray-800 mb-1.5">
 <span>{q.label}</span>
 <span>{isFinished? '': '☆'}</span>
 </div>
 <div className="space-y-1 text-[11px]">
 <p><span className="text-danger-600 font-semibold">Risiko:</span> {risk || <span className="text-gray-300 italic">Belum diisi</span>}</p>
 <p><span className="text-success-600 font-semibold">Tindakan:</span> {action || <span className="text-gray-300 italic">Belum diisi</span>}</p>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 {/* Agreement Card Preview */}
 {(() => {
 const agreement = (currentSubmission.answers?.['agreement-card'] || {}) as any;
 return (
 <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-4 space-y-3 shadow-2xs">
 <p className="text-xs text-indigo-600 font-bold">Kartu Pengguna Digital Cerdas (Komitmen Perjanjian)</p>
 
 {agreement.isSaved? (
 <div className="bg-white border border-indigo-200/60 rounded-xl p-4 space-y-2 text-xs">
 <p><span className="text-indigo-500 font-bold">Nama Murid:</span> {agreement.nama}</p>
 <p><span className="text-indigo-500 font-bold">Saya berkomitmen akan menggunakan perangkat untuk:</span> {agreement.untuk}</p>
 <p><span className="text-indigo-500 font-bold">Saya berjanji tidak akan:</span> {agreement.tidakAkan}</p>
 
 <div className="flex justify-between items-end border-t border-gray-100 pt-2 mt-2">
 <span className="text-[10px] text-gray-400">Tanda Tangan Terlampir</span>
 {agreement.signature && (
 <div className="bg-white border border-gray-100 rounded p-1">
 <img src={agreement.signature} alt="Tanda tangan murid" className="h-8 w-16 object-contain" />
 </div>
 )}
 </div>
 </div>
 ): (
 <p className="text-xs text-gray-400 italic p-3 text-center bg-white border border-indigo-100 rounded-xl">Siswa belum menandatangani kartu komitmen.</p>
 )}
 </div>
 );
 })()}

 {/* Aktivitas 3 Crossword Preview */}
 {(() => {
    const act3Ans = (currentSubmission.answers?.['activity-3'] || {}) as any;
    const crosswordWords = [
      { number: 1, text: 'CERDAS', clue: 'Sikap pintar, aman, dan bertanggung jawab saat kita menggunakan teknologi internet.' },
      { number: 2, text: 'SOPAN', clue: 'Sikap baik dan santun saat mengetik komentar atau berkirim pesan di internet.' },
      { number: 3, text: 'MANFAAT', clue: 'Kegunaan positif dari gawai, contohnya untuk mencari materi pelajaran sekolah.' },
      { number: 4, text: 'HAK', clue: 'Sesuatu yang boleh dan seharusnya kita dapatkan di dunia internet, seperti hak merasa aman.' },
      { number: 5, text: 'DIGITAL', clue: 'Dunia virtual tempat kita belajar, bermain, dan mencari informasi memakai internet.' },
      { number: 6, text: 'GAWAI', clue: 'Sebutan lain untuk alat elektronik canggih seperti HP, Chromebook, atau laptop.' },
      { number: 7, text: 'JAWAB', clue: 'Tanggung ______ adalah kewajiban yang harus kita lakukan agar internet menjadi tempat yang nyaman.' },
      { number: 8, text: 'BIJAK', clue: 'Menggunakan perangkat dengan disiplin waktu dan hati-hati agar tidak kecanduan.' },
      { number: 9, text: 'INTERNET', clue: 'Jalan tol tidak terlihat yang menghubungkan semua gawai di dunia agar bisa saling bertukar data.' },
      { number: 10, text: 'RISIKO', clue: 'Kemungkinan bahaya atau masalah di dunia digital, seperti penipuan atau lupa waktu.' },
    ];

    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-2xs">
        <p className="text-xs text-primary-500 font-bold">Aktivitas 3: Teka-Teki Silang (TTS) Digital Cerdas</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          {crosswordWords.map((word) => {
            const ans = (act3Ans[`q-${word.number}`] || '').toUpperCase();
            const isCorrect = ans === word.text;
            return (
              <div key={word.number} className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                isCorrect ? 'bg-emerald-50/20 border-emerald-200' : 'bg-red-50/10 border-red-150'
              }`}>
                <div>
                  <span className="font-bold text-gray-800">{word.number}. {word.clue}</span>
                </div>
                <div className="mt-1 flex justify-between items-center font-semibold">
                  <span>Jawaban: <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>{ans || 'Belum diisi'}</span></span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? 'Benar ✓' : `Kunci: ${word.text}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  })()}
 </div>
 ): activeStepAnswers.length === 0? (
 <p className="text-xs text-gray-400 italic">Langkah ini tidak memiliki isian jawaban.</p>
 ): (
 <div className="space-y-3">
 {activeStepAnswers.map((item: any, idx: number) => (
 <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 space-y-1.5 shadow-2xs">
 <p className="text-xs text-primary-500 font-bold">Soal: {item.questionText}</p>
 <p className="text-sm text-surface-800 font-medium whitespace-pre-wrap leading-relaxed">
 {item.answer}
 </p>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* Rubric evaluation form for selected step */}
 {activeStep && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h4 className="font-display font-semibold text-surface-800 text-sm flex items-center gap-1.5">
 <Star size={16} className="text-warning-400" />
 Beri Nilai Aktivitas ({activeStep.title})
 </h4>
 {!(activeStep as GradableStep).isSynthetic ? (
 <button
 type="button"
 onClick={() => setShowRubricModal(true)}
 className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 flex items-center gap-1 transition-all shadow-2xs"
 >
 Kelola Rubrik Langkah Ini
 </button>
 ) : (
 <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-bold text-gray-500">
 Rubrik standar
 </span>
 )}
 </div>

 <div className="space-y-3">
 {activeCriteria.map((c: any) => {
 const score = activityScores[c.id] || 0;
 return (
 <div key={c.id} className="bg-surface-50 border border-gray-100 rounded-2xl p-4">
 <div className="flex items-center justify-between mb-3">
 <div>
 <p className="font-semibold text-sm text-surface-800">{c.name}</p>
 <p className="text-[10px] text-gray-400 font-semibold">Bobot: {c.weight}%</p>
 </div>
 {score > 0 && (
 <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${SCORE_LABELS[score]?.color}`}>
 {SCORE_LABELS[score]?.label}
 </span>
 )}
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
 {[1, 2, 3, 4].map((sVal) => {
 const levelDesc = (c.levels as any)?.[sVal] || '';
 return (
 <button
 key={sVal}
 type="button"
 onClick={() => setActivityScores((prev) => ({...prev, [c.id]: sVal }))}
 className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all border-2 flex flex-col items-center text-center justify-start min-h-[95px] ${
 score === sVal
? `${SCORE_LABELS[sVal].color} border-current shadow-sm scale-[1.02]`
: 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
 }`}
 title={levelDesc || SCORE_LABELS[sVal].label}
 >
 <span className="block font-bold text-sm mb-0.5">{sVal}</span>
 <span className="block text-[10px] leading-tight font-bold mb-1">{SCORE_LABELS[sVal].label}</span>
 {levelDesc && (
 <span className="block text-[9px] font-normal text-gray-400 leading-normal border-t border-gray-100 pt-1 mt-1 w-full">
 {levelDesc}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>

 <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60 space-y-3">
 <div>
 <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Catatan Khusus Aktivitas</label>
 <textarea
 value={activityFeedback}
 onChange={(e) => setActivityFeedback(e.target.value)}
 placeholder="Umpan balik spesifik untuk aktivitas ini..."
 rows={2}
 className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-white"
 />
 </div>
 <div className="flex items-center justify-between">
 <div className="text-xs font-bold text-primary-600">
 Skor Aktivitas: {activeStepScore} / 100
 </div>
 <button
 onClick={handleSaveActivityGrade}
 disabled={saving || activeCriteria.some((c: any) =>!activityScores[c.id])}
 className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
 >
 Simpan Nilai Aktivitas
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Overall evaluations */}
 <div className="border-t border-gray-100 pt-6 space-y-4">
 <h4 className="font-display font-bold text-sm text-surface-800 uppercase tracking-wide">
 Evaluasi Keseluruhan Topik
 </h4>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
 <p className="text-[10px] font-bold text-gray-400 uppercase">Rata-rata Aktivitas</p>
 <p className="text-xl font-bold text-surface-800 mt-1">{avgActivitiesScore}</p>
 </div>
 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
 <p className="text-[10px] font-bold text-gray-400 uppercase">Kuis Pilihan Ganda</p>
 <p className="text-xl font-bold text-surface-800 mt-1">{quizScore}</p>
 </div>
 <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
 <p className="text-[10px] font-bold text-gray-400 uppercase">Skor Simulasi</p>
 <p className="text-xl font-bold text-surface-800 mt-1">{simulationScore}</p>
 </div>
 <div className="bg-primary-500 p-4 rounded-xl text-white text-center shadow-md">
 <p className="text-[10px] font-bold opacity-80 uppercase">Nilai Akhir Terhitung</p>
 <p className="text-xl font-display font-bold mt-1">{computedFinalScore}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
 <div className="md:col-span-2">
 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
 Umpan Balik Guru (Seluruh Topik)
 </label>
 <textarea
 value={generalFeedback}
 onChange={(e) => setGeneralFeedback(e.target.value)}
 placeholder="Masukan atau evaluasi komprehensif untuk siswa..."
 rows={3}
 className="w-full px-4 py-2 border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm rounded-xl resize-none"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
 Penimpaan Nilai Manual (Manual Override)
 </label>
 <input
 type="number"
 min={0}
 max={100}
 value={manualOverrideScore}
 onChange={(e) => setManualOverrideScore(e.target.value!== ''? Number(e.target.value): '')}
 placeholder="Masukkan nilai manual 0-100"
 className="w-full px-4 py-2 border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm rounded-xl font-semibold text-center"
 />
 </div>
 </div>

 <div className="flex justify-end pt-2">
 <button
 onClick={handleSaveOverallGrade}
 disabled={saving}
 className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 ${
 saved? 'bg-success-500': 'bg-primary-500 hover:bg-primary-600'
 }`}
 >
 {saving? (
 <RefreshCw className="w-4 h-4 animate-spin" />
 ): saved? (
 <CheckCircle2 className="w-4 h-4" />
 ): (
 <Save className="w-4 h-4" />
 )}
 {saving? 'Menyimpan...': saved? 'Tersimpan!': 'Simpan Nilai Akhir'}
 </button>
 </div>
 </div>
 </div>
 </>
 )}
 </div>

 {/* Manage Rubric Modal */}
 {showRubricModal && activeStep && (
 <ManageRubricModal
 initialCriteria={activeCriteria}
 onClose={() => setShowRubricModal(false)}
 onSave={handleSaveStepRubric}
 />
 )}
 </div>
 );
}
