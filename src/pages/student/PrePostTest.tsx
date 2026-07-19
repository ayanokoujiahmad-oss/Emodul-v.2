import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
 FileText,
 Clock,
 ArrowRight,
 Loader2,
 Trophy,
} from 'lucide-react';
import {
 doc,
 getDoc,
 setDoc,
 serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { safeLog } from '../../lib/safeLog';
import { useAuth } from '../../contexts/AuthContext';
import { preTestQuestions, postTestQuestions } from '../../data/modules';
import { getDemoModuleGrades, saveDemoModuleGrade, logDemoActivity } from '../../lib/demoStore';
import canvasConfetti from 'canvas-confetti';

interface PrePostTestProps {
 mode: 'pre-test' | 'post-test';
}

export default function PrePostTest({ mode }: PrePostTestProps) {
 const navigate = useNavigate();
 const { user, userProfile } = useAuth();
 const studentUid = user?.uid;
 const guruId = userProfile?.guruId || '';

 // Load questions based on mode
 const questions = useMemo(() => {
 return mode === 'pre-test'? preTestQuestions: postTestQuestions;
 }, [mode]);

 // States
 const [currentIdx, setCurrentIdx] = useState(0);
 const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
 const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
 const [finished, setFinished] = useState(false);
 const [score, setScore] = useState(0);
 const [nGain, setNGain] = useState<number | null>(null);
 const [submitting, setSubmitting] = useState(false);
 const [loading, setLoading] = useState(true);

 // 1. Fetch existing grades to check if already completed
 useEffect(() => {
 if (!studentUid) return;

 const checkExistingTest = async () => {
 setLoading(true);
 try {
 const gradeDocId = `${studentUid}_aku-cerdas-digital`;

 if (!db) {
 const grades = getDemoModuleGrades(studentUid);
 const currentModuleGrade = grades.find((g: any) => g.moduleId === 'aku-cerdas-digital');
 if (currentModuleGrade) {
 if (mode === 'pre-test' && currentModuleGrade.preTestScore!== undefined) {
 setScore(currentModuleGrade.preTestScore);
 setFinished(true);
 } else if (mode === 'post-test' && currentModuleGrade.postTestScore!== undefined) {
 setScore(currentModuleGrade.postTestScore);
 setNGain(currentModuleGrade.nGainScore?? 0);
 setFinished(true);
 }
 }
 setLoading(false);
 return;
 }

 const snap = await getDoc(doc(db, 'moduleGrades', gradeDocId));
 if (snap.exists()) {
 const data = snap.data();
 if (mode === 'pre-test' && data.preTestScore!== undefined) {
 // Already completed pre-test
 setScore(data.preTestScore);
 setFinished(true);
 } else if (mode === 'post-test' && data.postTestScore!== undefined) {
 // Already completed post-test
 setScore(data.postTestScore);
 setNGain(data.nGainScore?? 0);
 setFinished(true);
 }
 }
 } catch (err) {
 safeLog('error', 'Failed checking existing module grades', err);
 } finally {
 setLoading(false);
 }
 };

 checkExistingTest();
 }, [studentUid, mode]);

 // 2. Keep a ref to the latest handleSubmit so the timer never calls a stale version
 const handleSubmitRef = useRef<() => void>(() => {});

 // 3. Timer Countdown logic
 useEffect(() => {
 if (finished || loading) return;
 if (timeLeft <= 0) {
 // Auto submit when time runs out
 handleSubmitRef.current();
 return;
 }
 const timer = setInterval(() => {
 setTimeLeft((t) => t - 1);
 }, 1000);
 return () => clearInterval(timer);
 }, [timeLeft, finished, loading]);

 const formatTime = (seconds: number) => {
 const m = Math.floor(seconds / 60);
 const s = seconds % 60;
 return `${m}:${s < 10? '0': ''}${s}`;
 };

 const handleSelectOption = (qId: string, optId: string) => {
 setAnswers((prev) => ({...prev, [qId]: optId }));
 };

 const answeredCount = Object.keys(answers).length;
 const progressPercent = Math.round((answeredCount / questions.length) * 100);

 // Submit test and calculate score
 const handleSubmit = async () => {
 if (!studentUid) return;
 setSubmitting(true);

 // Calculate score
 let correctCount = 0;
 questions.forEach((q) => {
 const correctOpt = q.options?.find((o) => o.isCorrect);
 if (correctOpt && answers[q.id] === correctOpt.id) {
 correctCount++;
 }
 });

 const finalScorePercent = Math.round((correctCount / questions.length) * 100);
 setScore(finalScorePercent);

 try {
 const gradeDocId = `${studentUid}_aku-cerdas-digital`;

 if (!db) {
 const grades = getDemoModuleGrades(studentUid);
 const currentModuleGrade = grades.find((g: any) => g.moduleId === 'aku-cerdas-digital') || {
 id: gradeDocId,
 studentUid,
 moduleId: 'aku-cerdas-digital',
 preTestScore: 0,
 postTestScore: 0,
 totalScore: 0,
 nGainScore: 0,
 completedAt: 0,
 };

 if (mode === 'pre-test') {
  currentModuleGrade.preTestScore = finalScorePercent;
  saveDemoModuleGrade(studentUid, currentModuleGrade);
  logDemoActivity(
    guruId,
    userProfile?.displayName || 'Siswa',
    `Menyelesaikan Pre-Test dengan skor ${finalScorePercent}%`,
    'Pre-Test',
    studentUid
  );
  setFinished(true);
  if (finalScorePercent >= 70) {
  canvasConfetti({ particleCount: 80, spread: 60 });
  }
  } else {
  const preScore = currentModuleGrade.preTestScore?? 0;
  const gain = preScore === 100 
 ? (finalScorePercent === 100? 1: 0) 
 : (finalScorePercent - preScore) / (100 - preScore);
  
  const roundedGain = Math.round(gain * 100) / 100;
  setNGain(roundedGain);

  currentModuleGrade.postTestScore = finalScorePercent;
  currentModuleGrade.nGainScore = roundedGain;
  currentModuleGrade.totalScore = Math.round((preScore + finalScorePercent) / 2);
  currentModuleGrade.completedAt = Date.now();
  saveDemoModuleGrade(studentUid, currentModuleGrade);
  logDemoActivity(
    guruId,
    userProfile?.displayName || 'Siswa',
    `Menyelesaikan Post-Test dengan skor ${finalScorePercent}% (N-Gain: ${roundedGain})`,
    'Post-Test',
    studentUid
  );
  setFinished(true);
  if (finalScorePercent >= 70) {
  canvasConfetti({ particleCount: 120, spread: 80 });
  }
  }
 setSubmitting(false);
 return;
 }

 const docRef = doc(db, 'moduleGrades', gradeDocId);
 const gradeSnap = await getDoc(docRef);
 const existingData = gradeSnap.exists()? gradeSnap.data(): {};

 if (mode === 'pre-test') {
  const payload = {
  ...existingData,
  studentUid,
  guruId,
  moduleId: 'aku-cerdas-digital',
  preTestScore: finalScorePercent,
  createdAt: existingData.createdAt || serverTimestamp(),
  };
  await setDoc(docRef, payload, { merge: true });

  const activityLogDocId = `${studentUid}_pretest_${Date.now()}`;
  await setDoc(doc(db, 'activityLog', activityLogDocId), {
    guruId,
    studentUid,
    studentName: userProfile?.displayName || 'Siswa',
    action: `Menyelesaikan Pre-Test dengan skor ${finalScorePercent}%`,
    topicTitle: 'Pre-Test',
    timestamp: serverTimestamp(),
  });

  setFinished(true);
  if (finalScorePercent >= 70) {
  canvasConfetti({ particleCount: 80, spread: 60 });
  }
  } else {
  // Mode post-test
  const preScore = existingData.preTestScore?? 0;
  // Calculate N-Gain
  const gain = preScore === 100 
 ? (finalScorePercent === 100? 1: 0) 
 : (finalScorePercent - preScore) / (100 - preScore);
  
  const roundedGain = Math.round(gain * 100) / 100; // round to 2 decimals
  setNGain(roundedGain);

  const payload = {
  studentUid,
  guruId,
  moduleId: 'aku-cerdas-digital',
  postTestScore: finalScorePercent,
  nGainScore: roundedGain,
  completedAt: serverTimestamp(),
  totalScore: Math.round((preScore + finalScorePercent) / 2),
  };
  await setDoc(docRef, payload, { merge: true });

  const activityLogDocId = `${studentUid}_posttest_${Date.now()}`;
  await setDoc(doc(db, 'activityLog', activityLogDocId), {
    guruId,
    studentUid,
    studentName: userProfile?.displayName || 'Siswa',
    action: `Menyelesaikan Post-Test dengan skor ${finalScorePercent}% (N-Gain: ${roundedGain})`,
    topicTitle: 'Post-Test',
    timestamp: serverTimestamp(),
  });

  setFinished(true);
  if (finalScorePercent >= 70) {
  canvasConfetti({ particleCount: 120, spread: 80 });
  }
  }
 } catch (err) {
 safeLog('error', 'Failed submitting module test', err);
 alert('Gagal mengirim jawaban. Coba ulangi lagi.');
 } finally {
 setSubmitting(false);
 }
 };

 // Keep ref in sync with the latest handleSubmit
 handleSubmitRef.current = handleSubmit;

 const getNGainInterpretation = (gainVal: number) => {
 if (gainVal >= 0.7) return { label: 'Tinggi ', style: 'text-success-600 bg-success-50 border-success-200' };
 if (gainVal >= 0.3) return { label: 'Sedang ', style: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
 return { label: 'Rendah ', style: 'text-warning-600 bg-warning-50 border-warning-200' };
 };

 if (loading) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50">
 <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
 <p className="text-sm font-semibold text-primary-600 mt-2">Menyiapkan kuis...</p>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-surface-50 py-10 px-4">
 <div className="max-w-2xl mx-auto space-y-6">
 
 {/* Header card */}
 <div className="bg-white rounded-3xl p-6 border border-primary-100/40 shadow-sm flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <h2 className="font-display font-bold text-lg text-primary-800 capitalize">
 Kuis {mode.replace('-', ' ')}
 </h2>
 <p className="text-xs text-primary-400">Modul: Aku Cerdas di Dunia Digital</p>
 </div>
 </div>
 
 {!finished && (
 <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 font-bold px-3 py-1.5 rounded-xl text-sm shrink-0">
 <Clock className="w-4 h-4 animate-pulse" />
 <span>{formatTime(timeLeft)}</span>
 </div>
 )}
 </div>

 <AnimatePresence mode="wait">
 {!finished? (
 <motion.div
 key="quiz"
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 className="space-y-5"
 >
 {/* Question Navigation Tracker */}
 <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-primary-100/40 shadow-sm overflow-x-auto scrollbar-none">
 {questions.map((_, idx) => (
 <button
 key={idx}
 onClick={() => setCurrentIdx(idx)}
 className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
 idx === currentIdx
? 'bg-primary-500 text-white shadow-glow'
: answers[questions[idx].id]!== undefined
? 'bg-success-100 text-success-700 border border-success-200'
: 'bg-primary-50/80 text-primary-400 border border-primary-100/40'
 }`}
 >
 {idx + 1}
 </button>
 ))}
 </div>

 {/* Progress bar */}
 <div className="bg-white rounded-2xl p-4 border border-primary-100/40 shadow-sm space-y-1.5">
 <div className="flex justify-between text-[10px] font-bold text-primary-400">
 <span>SOAL TERJAWAB: {answeredCount} / {questions.length}</span>
 <span>{progressPercent}%</span>
 </div>
 <div className="w-full bg-primary-50 h-2 rounded-full overflow-hidden">
 <div 
 className="bg-primary-500 h-full transition-all duration-300"
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>

 {/* Question Card */}
 <div className="bg-white rounded-3xl p-6 border border-primary-100/40 shadow-card space-y-4">
 <p className="text-xs uppercase tracking-widest font-bold text-primary-400">
 Pertanyaan {currentIdx + 1}
 </p>
 <h3 className="font-display font-bold text-base text-primary-800 leading-snug">
 {questions[currentIdx].question}
 </h3>
 {questions[currentIdx].context && (
 <div className="mb-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-left">
 {questions[currentIdx].context}
 </div>
 )}
 {questions[currentIdx].imageUrl && (
 <div className="mb-3 overflow-hidden rounded-2xl border border-slate-100 max-h-48 flex justify-center bg-slate-50">
 <img src={questions[currentIdx].imageUrl} alt="Ilustrasi Soal" className="object-contain max-h-48 w-full" loading="lazy" decoding="async" />
 </div>
 )}

 <div className="space-y-2.5 pt-2">
 {questions[currentIdx].options?.map((opt) => {
 const isSelected = answers[questions[currentIdx].id] === opt.id;
 return (
 <button
 key={opt.id}
 type="button"
 onClick={() => handleSelectOption(questions[currentIdx].id, opt.id)}
 className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition-all flex items-start gap-3 ${
 isSelected
? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100 text-primary-900'
: 'border-primary-100 bg-white hover:bg-primary-50 text-primary-800'
 }`}
 >
 <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-500 text-xs font-bold flex items-center justify-center shrink-0">
 {opt.id.toUpperCase()}
 </span>
 <span>{opt.text}</span>
 </button>
 );
 })}
 </div>
 </div>

 {/* Navigation Footer */}
 <div className="flex justify-between items-center">
 <button
 type="button"
 disabled={currentIdx === 0}
 onClick={() => setCurrentIdx((i) => i - 1)}
 className="py-3 px-5 bg-white border border-primary-100 text-primary-600 font-bold text-xs rounded-xl shadow-sm disabled:opacity-40"
 >
 Kembali
 </button>

 {currentIdx < questions.length - 1? (
 <button
 type="button"
 onClick={() => setCurrentIdx((i) => i + 1)}
 className="py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-400 text-white font-bold text-xs rounded-xl shadow-md"
 >
 Lanjut
 </button>
 ): (
 <button
 type="button"
 disabled={submitting}
 onClick={handleSubmit}
 className="py-3.5 px-8 bg-gradient-to-r from-success-500 to-emerald-400 text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105"
 >
 {submitting? 'Mengirim...': 'Kirim Jawaban'}
 </button>
 )}
 </div>
 </motion.div>
 ): (
 <motion.div
 key="results"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white border border-primary-150 rounded-3xl p-8 text-center shadow-card space-y-6"
 >
 <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-500 border border-primary-100">
 <Trophy className="w-10 h-10 fill-primary-400/20" />
 </div>

 <div>
 <h3 className="font-display font-bold text-xl text-primary-800">
 Kuis Selesai! 
 </h3>
 <p className="text-xs text-primary-400 mt-1">
 Kamu telah sukses menyelesaikan ujian {mode.replace('-', ' ')} modul SiberCerdas.
 </p>
 </div>

 <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
 <div className="bg-white border border-primary-100 p-4 rounded-2xl shadow-sm">
 <span className="text-[10px] text-primary-400 font-bold block">SKOR KAMU</span>
 <span className="text-3xl font-black text-primary-600 font-display">
 {score}%
 </span>
 </div>

 {mode === 'post-test' && nGain!== null && (
 <div className="bg-white border border-primary-100 p-4 rounded-2xl shadow-sm">
 <span className="text-[10px] text-primary-400 font-bold block">N-GAIN SCORE</span>
 <span className={`text-base font-bold px-2 py-0.5 rounded-lg border inline-block mt-1 ${getNGainInterpretation(nGain).style}`}>
 {getNGainInterpretation(nGain).label}
 </span>
 <span className="text-[9px] text-gray-400 block mt-1">Nilai Gain: {nGain}</span>
 </div>
 )}
 </div>

 <div className="border-t border-primary-50 pt-6">
 <button
 type="button"
 onClick={() => navigate('/siswa')}
 className="btn-primary py-3.5 px-8 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mx-auto"
 >
 Kembali ke Dashboard
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 );
}
