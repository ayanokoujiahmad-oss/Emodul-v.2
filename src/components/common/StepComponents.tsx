import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import canvasConfetti from 'canvas-confetti';
import {
  Target,
  Tag,
  Map,
  PenLine,
  Zap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Loader2,
  Save,
  Sparkles,
  ShieldAlert,
  Award,
  Send,
  Eraser,
  RotateCcw,
  Star,
  Shield,
  Heart,
  Medal,
  BadgeCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import type {
  LearningObjective,
  KeyTerm,
  RoadmapStep,
  MCQuestion,
  ContentSection,
} from '../../types/models';
import type { EssayQuestion } from '../../types/index';

/* ================================================================== */
/* Shared helpers */
/* ================================================================== */

export interface StepWrapperProps {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function StepWrapper({ stepNumber, title, icon, children }: StepWrapperProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-3xl border border-primary-100/60 bg-white/80 p-5 shadow-card backdrop-blur-sm sm:p-7"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 text-white shadow-md">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-300">
            Langkah {stepNumber}
          </p>
          <h2 className="font-display text-lg font-bold text-primary-700">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      {children}
    </motion.section>
  );
}

/** Auto-save indicator dot + text */
function AutoSaveIndicator({ saving }: { saving: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-primary-300">
      {saving ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Menyimpan…</span>
        </>
      ) : (
        <>
          <Save className="h-3 w-3 text-success-400" />
          <span className="text-success-500">Tersimpan</span>
        </>
      )}
    </div>
  );
}

interface ActivityHeaderProps {
  instruction?: string;
  exampleInput?: string;
  status?: 'belum' | 'draf' | 'dikirim' | 'dinilai';
}

export function ActivityHeader({ instruction, exampleInput, status = 'belum' }: ActivityHeaderProps) {
  const statusLabels = {
    belum: { text: 'Belum Dikerjakan', class: 'bg-gray-100 text-gray-500 border-gray-200' },
    draf: { text: 'Draf Tersimpan', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    dikirim: { text: 'Sudah Dikirim', class: 'bg-primary-100 text-primary-700 border-primary-200' },
    dinilai: { text: 'Selesai Dinilai', class: 'bg-success-100 text-success-700 border-success-200' },
  };

  const currentStatus = statusLabels[status] || statusLabels.belum;

  return (
    <div className="mb-4 space-y-3 border-b border-dashed border-primary-100/50 pb-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300">
          Status Aktivitas
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStatus.class}`}>
          {currentStatus.text}
        </span>
      </div>

      {/* Instructions */}
      {instruction && (
        <div className="rounded-xl border border-primary-100/40 bg-primary-50/20 p-3 text-xs leading-relaxed text-primary-600">
          <p className="font-semibold text-primary-700 mb-1 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-primary-500" />
            Instruksi Pengerjaan:
          </p>
          <p className="whitespace-pre-wrap">{instruction}</p>
        </div>
      )}

      {/* Example Input */}
      {exampleInput && (
        <div className="rounded-xl border border-accent-100/40 bg-accent-50/10 p-3 text-xs leading-relaxed text-accent-600">
          <p className="font-semibold text-accent-700 mb-1 flex items-center gap-1">
            <PenLine className="h-3.5 w-3.5 text-accent-500" />
            Contoh Jawaban:
          </p>
          <p className="italic">{exampleInput}</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* 1. TujuanStep — Learning Objectives */
/* ================================================================== */

interface TujuanStepProps {
  objectives: LearningObjective[];
}

export function TujuanStep({ objectives }: TujuanStepProps) {
  return (
    <StepWrapper stepNumber={1} title="Tujuan Pembelajaran" icon={<Target className="h-5 w-5" />}>
      <p className="mb-4 text-sm text-primary-500">
        Setelah mempelajari materi ini, kamu diharapkan mampu:
      </p>
      <ul className="space-y-3">
        {objectives.map((obj, i) => (
          <motion.li
            key={obj.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 rounded-xl bg-primary-50/60 px-4 py-3"
          >
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500 text-xs font-bold text-white">
              {i + 1}
            </div>
            <p className="text-sm leading-relaxed text-primary-700">{obj.text}</p>
          </motion.li>
        ))}
      </ul>
    </StepWrapper>
  );
}

/* ================================================================== */
/* 2. KataKunciStep — Key Terms */
/* ================================================================== */

interface KataKunciStepProps {
  terms: KeyTerm[];
}

export function KataKunciStep({ terms }: KataKunciStepProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const chipColors = [
    'bg-primary-100 text-primary-700 border-primary-200',
    'bg-accent-100 text-accent-600 border-accent-200',
    'bg-success-100 text-success-600 border-success-200',
    'bg-warning-100 text-warning-600 border-warning-100',
    'bg-danger-100 text-danger-600 border-danger-100',
  ];

  return (
    <StepWrapper stepNumber={2} title="Kata Kunci" icon={<Tag className="h-5 w-5" />}>
      <p className="mb-4 text-sm text-primary-500">
        Ketuk kata kunci untuk melihat penjelasannya:
      </p>
      <div className="flex flex-wrap gap-2">
        {terms.map((term, i) => (
          <button
            key={term.term}
            type="button"
            onClick={() =>
              setActiveTerm((prev) => (prev === term.term ? null : term.term))
            }
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all hover:shadow-sm ${chipColors[i % chipColors.length]
              } ${activeTerm === term.term
                ? 'ring-2 ring-primary-300 ring-offset-1 scale-105'
                : ''
              }`}
          >
            {term.term}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTerm && (
          <motion.div
            key={activeTerm}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden rounded-xl border border-primary-100 bg-primary-50/50 px-4 py-3"
          >
            <p className="text-sm font-semibold text-primary-700">{activeTerm}</p>
            <p className="mt-1 text-sm leading-relaxed text-primary-500">
              {terms.find((t) => t.term === activeTerm)?.definition ?? ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </StepWrapper>
  );
}

/* ================================================================== */
/* 3. PetaMateriStep — Material Roadmap */
/* ================================================================== */

interface PetaMateriStepProps {
  steps: RoadmapStep[];
}

export function PetaMateriStep({ steps }: PetaMateriStepProps) {
  return (
    <StepWrapper stepNumber={3} title="Peta Materi" icon={<Map className="h-5 w-5" />}>
      <p className="mb-5 text-sm text-primary-500">
        Perjalanan belajarmu hari ini:
      </p>
      <div className="relative ml-4">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-primary-200" />

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex items-start gap-4 pl-1"
            >
              {/* Number dot */}
              <div
                className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${step.isCompleted
                  ? 'bg-success-500 text-white'
                  : step.isActive
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'bg-primary-100 text-primary-400'
                  }`}
              >
                {step.isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>

              <div
                className={`flex-1 rounded-xl px-4 py-2.5 ${step.isActive
                  ? 'border border-primary-200 bg-primary-50 shadow-sm'
                  : 'bg-transparent'
                  }`}
              >
                <p
                  className={`text-sm font-semibold ${step.isActive ? 'text-primary-700' : 'text-primary-500'
                    }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-primary-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* 4. BersiapBelajarStep — Reflective Question */
/* ================================================================== */

interface BersiapBelajarStepProps {
  questions: { id: string; question: string }[];
  answers: Record<string, string>;
  onSaveAnswer: (questionId: string, answer: string) => void;
  instruction?: string;
  exampleInput?: string;
  status?: 'belum' | 'draf' | 'dikirim' | 'dinilai';
  passage?: string;
  mediaType?: string;
  mediaUrl?: string;
  comics?: string[];
}

export function BersiapBelajarStep({
  questions,
  answers,
  onSaveAnswer,
  instruction = 'Pikirkan baik-baik pertanyaan di bawah ini dan tuliskan pendapat jujurmu.',
  exampleInput = 'Contoh: Menurut saya, hal ini penting karena di internet ada banyak orang baik dan jahat, jadi kita harus waspada.',
  status,
  passage,
  mediaType,
  mediaUrl,
  comics,
}: BersiapBelajarStepProps) {
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [zoomedComic, setZoomedComic] = useState<string | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Sync initial answers when parent answers changes
  useEffect(() => {
    const loaded: Record<string, string> = {};
    questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        loaded[q.id] = String(answers[q.id]);
      }
    });
    setLocalAnswers((prev) => ({ ...prev, ...loaded }));
  }, [answers, questions]);

  const handleTextChange = (qId: string, val: string) => {
    setLocalAnswers((prev) => ({ ...prev, [qId]: val }));
    if (timers.current[qId]) clearTimeout(timers.current[qId]);
    setSaving((prev) => ({ ...prev, [qId]: true }));
    timers.current[qId] = setTimeout(() => {
      onSaveAnswer(qId, val);
      setSaving((prev) => ({ ...prev, [qId]: false }));
    }, 1000);
  };

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  const answeredCount = questions.filter((q) => {
    const val = localAnswers[q.id];
    return typeof val === 'string' && val.trim().length > 0;
  }).length;
  const calculatedStatus = status || (answeredCount === questions.length ? 'dikirim' : answeredCount > 0 ? 'draf' : 'belum');

  return (
    <StepWrapper stepNumber={4} title="Bersiap Belajar" icon={<PenLine className="h-5 w-5" />}>
      <ActivityHeader
        instruction={instruction}
        exampleInput={exampleInput}
        status={calculatedStatus}
      />

      {mediaType === 'image' && mediaUrl && (
        <div className="my-4 text-center">
          <img
            src={mediaUrl}
            alt="Ilustrasi bersiap belajar"
            className="max-w-full mx-auto rounded-2xl shadow-md max-h-72 object-contain"
          />
        </div>
      )}

      {comics && comics.length > 0 ? (
        <div className="my-6 p-4 bg-indigo-50/40 border border-indigo-100/40 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 justify-between">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
              Komik Pengantar
            </span>
            <span className="text-[10px] text-indigo-600 font-bold italic bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/60">
              💡 Ketuk gambar komik untuk memperbesar gambar agar lebih mudah dibaca!
            </span>
          </div>
          <div className="flex flex-col gap-6 items-center w-full">
            {comics.map((url, index) => (
              <div
                key={index}
                onClick={() => setZoomedComic(url)}
                className="group relative w-full max-w-3xl bg-white p-3 rounded-2xl shadow-md border border-slate-200/60 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200"
              >
                <img
                  src={url}
                  alt={`Komik halaman ${index + 1}`}
                  className="w-full h-auto rounded-xl object-contain transition-all duration-300 group-hover:scale-[1.005]"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-white/95 px-4 py-2.5 rounded-full shadow-lg text-xs font-black text-indigo-800 border border-indigo-100">
                    <ZoomIn className="h-4 w-4" />
                    Perbesar Halaman {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        passage && <PassageBlock passage={passage} />
      )}

      <AnimatePresence>
        {zoomedComic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedComic(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-xs cursor-zoom-out"
          >
            <div className="relative max-w-5xl w-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[90vh] w-full overflow-auto rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 flex items-center justify-center cursor-default"
              >
                <img
                  src={zoomedComic}
                  alt="Komik diperbesar"
                  className="max-w-full max-h-[85vh] object-contain rounded-xl"
                />
              </motion.div>
              <button
                type="button"
                onClick={() => setZoomedComic(null)}
                className="absolute -top-3 -right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors cursor-pointer z-[60] shadow-md border-2 border-white flex items-center justify-center animate-pop-in"
                aria-label="Tutup perbesaran"
                title="Tutup"
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 space-y-5">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-primary-100 bg-white p-4">
            <p className="mb-2 text-sm font-medium text-primary-700">
              {qi + 1}. {q.question}
            </p>
            <textarea
              value={localAnswers[q.id] ?? ''}
              onChange={(e) => handleTextChange(q.id, e.target.value)}
              placeholder="Tulis jawabanmu di sini…"
              rows={3}
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-700 placeholder:text-primary-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-shadow resize-none"
              aria-label={`Jawaban pertanyaan pemantik ${qi + 1}`}
            />
            <div className="mt-1 flex justify-end">
              <AutoSaveIndicator saving={!!saving[q.id]} />
            </div>
          </div>
        ))}
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* 5. TantanganAwalStep — Mini Quiz (2–3 MC) */
/* ================================================================== */

interface TantanganAwalStepProps {
  questions: MCQuestion[];
  onAnswer: (questionId: string, selectedIndex: number) => void;
  instruction?: string;
  exampleInput?: string;
  status?: 'belum' | 'draf' | 'dikirim' | 'dinilai';
  passage?: string;
}

export function TantanganAwalStep({
  questions,
  onAnswer,
  instruction = 'Pilihlah salah satu jawaban yang menurutmu paling tepat. Jawabanmu akan dievaluasi secara instan setelah menekan tombol periksa.',
  exampleInput = 'Contoh: Pilih opsi (A, B, atau C) yang paling aman untuk menjaga data diri.',
  status,
  passage,
}: TantanganAwalStepProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const select = (qId: string, idx: number) => {
    if (revealed[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const reveal = (q: MCQuestion) => {
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
    onAnswer(q.id, answers[q.id] ?? -1);
  };

  const answeredCount = Object.keys(answers).length;
  const calculatedStatus = status || (answeredCount === questions.length ? 'dikirim' : answeredCount > 0 ? 'draf' : 'belum');

  return (
    <StepWrapper stepNumber={5} title="Tantangan Awal" icon={<Zap className="h-5 w-5" />}>
      <ActivityHeader
        instruction={instruction}
        exampleInput={exampleInput}
        status={calculatedStatus}
      />

      {passage && <PassageBlock passage={passage} />}

      <p className="mb-4 text-sm text-primary-500 mt-3">
        Yuk uji pengetahuan awalmu!
      </p>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const isRevealed = revealed[q.id];
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qi * 0.1 }}
              className="rounded-xl border border-primary-100 bg-white p-4"
            >
              <p className="mb-3 text-sm font-medium text-primary-700">
                {qi + 1}. {q.question}
              </p>
              {q.context && (
                <div className="mb-3 p-3 bg-gray-50/80 border border-gray-100 rounded-xl text-xs text-gray-600 leading-relaxed whitespace-pre-wrap text-left font-medium">
                  {q.context}
                </div>
              )}
              {q.imageUrl && (
                <div className="mb-3 overflow-hidden rounded-xl border border-gray-100 max-h-48 flex justify-center bg-gray-50">
                  <img src={q.imageUrl} alt="Pertanyaan" className="object-contain max-h-48 w-full" loading="lazy" decoding="async" />
                </div>
              )}

              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let optClass =
                    'border-primary-100 bg-white hover:bg-primary-50 text-primary-600';
                  if (isRevealed) {
                    if (oi === q.correctIndex) {
                      optClass =
                        'border-success-300 bg-success-50 text-success-700';
                    } else if (oi === selected && !isCorrect) {
                      optClass = 'border-danger-300 bg-danger-50 text-danger-700';
                    } else {
                      optClass =
                        'border-primary-100 bg-white text-primary-300';
                    }
                  } else if (selected === oi) {
                    optClass =
                      'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-200';
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={isRevealed}
                      onClick={() => select(q.id, oi)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${optClass}`}
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-500">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isRevealed && oi === q.correctIndex && (
                        <Check className="h-4 w-4 text-success-500" />
                      )}
                      {isRevealed && oi === selected && !isCorrect && oi !== q.correctIndex && (
                        <X className="h-4 w-4 text-danger-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isRevealed && selected !== undefined && (
                <button
                  type="button"
                  onClick={() => reveal(q)}
                  className="mt-3 rounded-lg bg-primary-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Cek Jawaban
                </button>
              )}

              {isRevealed && q.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2 text-xs text-primary-500"
                >
                  {q.explanation}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* 6. YukBelajarStep — Main content with accordions */
/* ================================================================== */

function TrueFalseActivity({ question, correctAnswer }: { question: string; correctAnswer: boolean }) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleChoice = (choice: boolean) => {
    if (isDone) return;
    setSelected(choice);
    setIsDone(true);
    if (choice === correctAnswer) {
      canvasConfetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  return (
    <div className="my-4 p-4 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/40 to-white shadow-sm space-y-3 text-left">
      <p className="text-xs font-bold text-primary-600 flex items-center gap-1.5">
        Aktivitas: Benar atau Salah?
      </p>
      <p className="text-xs text-gray-700 leading-relaxed font-semibold">{question}</p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDone}
          onClick={() => handleChoice(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${isDone
            ? correctAnswer === true
              ? 'bg-success-100 border-success-400 text-success-700'
              : selected === true
                ? 'bg-danger-100 border-danger-400 text-danger-700'
                : 'bg-gray-50 border-gray-100 text-gray-400'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-primary-50'
            }`}
        >
          Benar
        </button>
        <button
          type="button"
          disabled={isDone}
          onClick={() => handleChoice(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${isDone
            ? correctAnswer === false
              ? 'bg-success-100 border-success-400 text-success-700'
              : selected === false
                ? 'bg-danger-100 border-danger-400 text-danger-700'
                : 'bg-gray-50 border-gray-100 text-gray-400'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-primary-50'
            }`}
        >
          Salah
        </button>
      </div>
      {isDone && (
        <p className={`text-[10px] font-bold ${selected === correctAnswer ? 'text-success-600' : 'text-danger-600'}`}>
          {selected === correctAnswer ? ' Hebat! Jawabanmu benar.' : ' Jawaban kurang tepat. Coba lagi ya!'}
        </p>
      )}
    </div>
  );
}

export function Activity1Table({ answers, onSave, readOnly }: {
  answers: Record<string, string>;
  onSave?: (val: Record<string, string>) => void;
  readOnly?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(answers || {});

  useEffect(() => {
    setValues(answers || {});
  }, [answers]);

  const handleChange = (key: string, val: string) => {
    const updated = { ...values, [key]: val };
    setValues(updated);
    if (onSave) onSave(updated);
  };

  const rows = [1, 2, 3];
  const columns = [
    { key: 'aktivitas', header: 'Aktivitas Digital yang Dilakukan', placeholder: 'Contoh: Bermain game edukasi' },
    { key: 'perangkat', header: 'Perangkat yang Digunakan', placeholder: 'Contoh: Laptop' },
    { key: 'manfaat', header: 'Manfaatnya', placeholder: 'Contoh: Melatih logika berpikir' },
  ];

  return (
    <div className="space-y-4 my-6 text-left">
      {/* Pengantar Aktivitas 1 */}
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-5 shadow-2xs">
        <h4 className="font-display font-black text-primary-900 text-sm sm:text-base mb-2 flex items-center gap-2">
          📝 Aktivitas 1: Mari Catat Dunia Digitalmu!
        </h4>
        <p className="text-xs sm:text-sm text-primary-950 leading-relaxed">
          Halo, Detektif Digital Cilik! Di sekelilingmu pasti banyak gawai canggih, kan? Yuk, kita amati apa saja yang sering kamu lakukan dengan gawai tersebut di rumah atau di sekolah.
        </p>
        <p className="text-xs sm:text-sm text-primary-950 leading-relaxed mt-2 font-medium">
          👉 <strong>Tugasmu:</strong> Tuliskan 3 aktivitas digital yang paling sering kamu lakukan, perangkat apa yang kamu pakai, serta apa manfaat positif yang kamu dapatkan. Perhatikan contoh di baris pertama tabel, ya!
        </p>
      </div>

      <div className="overflow-x-auto border border-primary-100 rounded-2xl shadow-sm bg-white">
      <table className="w-full text-xs text-left text-gray-500">
        <thead className="text-[10px] text-white uppercase bg-gradient-to-r from-primary-500 to-primary-400">
          <tr>
            <th className="px-4 py-2.5 font-bold">No</th>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-2.5 font-bold">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Example row */}
          <tr className="italic text-primary-700 bg-primary-50/30 border-b">
            <td className="px-4 py-2.5 font-semibold text-[11px]">Contoh</td>
            <td className="px-4 py-2.5">Menonton video pembelajaran</td>
            <td className="px-4 py-2.5">Gawai (HP/Tablet)</td>
            <td className="px-4 py-2.5">Membantu memahami pelajaran dengan lebih mudah</td>
          </tr>
          {rows.map((rowIdx) => (
            <tr key={rowIdx} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-2.5 text-gray-700 font-semibold text-[11px]">{rowIdx}</td>
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-1.5">
                  <input
                    type="text"
                    value={values[`row_${rowIdx}_${col.key}`] ?? ''}
                    onChange={e => handleChange(`row_${rowIdx}_${col.key}`, e.target.value)}
                    placeholder={col.placeholder}
                    disabled={readOnly}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary-400 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

function TableFillActivity({
  activityId,
  headers,
  rows,
  onSave,
  savedValues = {},
}: {
  activityId: string;
  headers: string[];
  rows: string[];
  onSave?: (key: string, value: any) => void;
  savedValues?: Record<number, string>;
}) {
  const [inputs, setInputs] = useState<Record<number, string>>(savedValues);

  const handleInputChange = (idx: number, val: string) => {
    const updated = { ...inputs, [idx]: val };
    setInputs(updated);
    if (onSave) {
      onSave(activityId, updated);
    }
  };

  return (
    <div className="my-4 overflow-x-auto border border-primary-100 rounded-2xl shadow-sm text-left">
      <table className="w-full text-xs text-left text-gray-500">
        <thead className="text-[10px] text-white uppercase bg-gradient-to-r from-primary-500 to-primary-400">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-4 py-2.5 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((placeholder, ri) => (
            <tr key={ri} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-2.5 text-gray-700 font-semibold text-[11px] whitespace-nowrap">Baris {ri + 1}</td>
              <td className="px-3 py-1.5 text-gray-700">
                <input
                  type="text"
                  value={inputs[ri] ?? ''}
                  onChange={e => handleInputChange(ri, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary-400 bg-white"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function extractYTId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function renderInlineText(text: string): React.ReactNode[] {
  if (!text) return [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  const parts = text.split(boldRegex);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-bold text-primary-800">
          {part}
        </strong>
      );
    }

    // Check for italic *text*
    const italicRegex = /\*(.*?)\*/g;
    const subParts = part.split(italicRegex);
    return (
      <React.Fragment key={i}>
        {subParts.map((subPart, j) => {
          if (j % 2 === 1) {
            return (
              <em key={j} className="italic text-primary-700">
                {subPart}
              </em>
            );
          }

          // Check for link [label](url)
          const linkRegex = /\[(.*?)\]\((.*?)\)/g;
          const linkParts = subPart.split(linkRegex);
          if (linkParts.length > 1) {
            const result: React.ReactNode[] = [];
            for (let k = 0; k < linkParts.length; k++) {
              if (k % 3 === 0) {
                result.push(linkParts[k]);
              } else if (k % 3 === 1) {
                const label = linkParts[k];
                const url = linkParts[k + 1] || '#';
                result.push(
                  <a
                    key={`link-${k}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 underline font-medium"
                  >
                    {label}
                  </a>
                );
                k++; // Skip URL index since we processed it
              }
            }
            return <React.Fragment key={j}>{result}</React.Fragment>;
          }

          return subPart;
        })}
      </React.Fragment>
    );
  });
}

export function PassageBlock({ passage }: { passage?: string }) {
  if (!passage) return null;
  return (
    <div className="my-4 p-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
          Bacaan / Cerita Pengantar
        </span>
      </div>
      <div className="space-y-2 text-left text-sm leading-relaxed text-amber-900">
        {passage.split('\n').map((line, idx) => {
          const text = line.trim();
          if (!text) return null;
          return (
            <p key={idx}>
              {renderInlineText(text)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function StudentRichContentRenderer({ content, onActivitySave, activityAnswers = {} }: {
  content: string;
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
}) {
  const paragraphs = content.split('\n').filter(Boolean);

  return (
    <div className="space-y-3 text-left">
      {paragraphs.map((p, idx) => {
        const text = p.trim();

        // 1. Interactive True/False: [benar-salah: Question | answer]
        if (text.startsWith('[benar-salah:') && text.endsWith(']')) {
          const inner = text.substring(13, text.length - 1);
          const [question, answerStr] = inner.split('|').map(s => s.trim());
          const isCorrectAnswerTrue = answerStr.toLowerCase() === 'benar' || answerStr.toLowerCase() === 'true';

          return (
            <TrueFalseActivity
              key={idx}
              question={question}
              correctAnswer={isCorrectAnswerTrue}
            />
          );
        }

        // 2. Interactive Image: [image: url]
        if (text.startsWith('[image:') && text.endsWith(']')) {
          const url = text.substring(7, text.length - 1).trim();
          return (
            <div key={idx} className="my-4 overflow-hidden rounded-2xl border border-gray-100 shadow-sm flex justify-center bg-gray-50 max-h-60">
              <img src={url} alt="Materi SiberCerdas" className="object-contain max-h-60 w-full" loading="lazy" decoding="async" />
            </div>
          );
        }

        // 3. Dynamic Filled Table: [tabel-isi: Col1, Col2 | Placeholder1, Placeholder2]
        if (text.startsWith('[tabel-isi:') && text.endsWith(']')) {
          const inner = text.substring(11, text.length - 1);
          const [headersPart, rowsPart] = inner.split('|').map(s => s.trim());
          const headers = headersPart.split(',').map(s => s.trim());
          const rows = rowsPart.split(';').map(s => s.trim());

          if (headersPart.includes('Aktivitas Digital')) {
            return (
              <Activity1Table
                key={idx}
                answers={activityAnswers['activity-1'] || {}}
                onSave={(val) => onActivitySave && onActivitySave('activity-1', val)}
              />
            );
          }

          return (
            <TableFillActivity
              key={idx}
              activityId={`act-table-fill-${idx}`}
              headers={headers}
              rows={rows}
              onSave={onActivitySave}
              savedValues={activityAnswers[`act-table-fill-${idx}`]}
            />
          );
        }

        // 4. Static Styled Table: [table: Col1, Col2 | Row1Col1, Row1Col2 | Row2Col1, Row2Col2]
        if (text.startsWith('[table:') && text.endsWith(']')) {
          const inner = text.substring(7, text.length - 1);
          const parts = inner.split('|').map(s => s.trim());
          const headers = parts[0].split(',').map(s => s.trim());
          const rows = parts.slice(1).map(rowStr => rowStr.split(',').map(s => s.trim()));

          return (
            <div key={idx} className="my-4 overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
              <table className="w-full text-xs text-left text-gray-500">
                <thead className="text-[10px] text-primary-700 uppercase bg-primary-50">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} scope="col" className="px-4 py-2.5 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="bg-white border-b hover:bg-gray-50">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2.5 text-gray-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // 4.5. Custom Link Button: [tombol-link: Label | URL]
        if (text.startsWith('[tombol-link:') && text.endsWith(']')) {
          const inner = text.substring(13, text.length - 1);
          const [label, url] = inner.split('|').map(s => s.trim());
          return (
            <div key={idx} className="my-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 gap-1.5"
              >
                {label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        }

        // 5. YouTube video syntax: [VIDEO: url]
        if (text.startsWith('[VIDEO:') && text.endsWith(']')) {
          const url = text.substring(7, text.length - 1).trim();
          const ytId = extractYTId(url);
          if (ytId) {
            return (
              <div key={idx} className="my-4 overflow-hidden rounded-2xl border border-gray-100 shadow-sm aspect-video max-w-lg mx-auto bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="Video Pembelajaran"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }
        }

        // 6. Markdown image syntax:![alt](url)
        const imgMatch = text.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          return (
            <div key={idx} className="my-4 text-center">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="max-w-full mx-auto rounded-2xl shadow-md max-h-72 object-contain"
                loading="lazy"
              />
              {imgMatch[1] && imgMatch[1] !== 'gambar' && (
                <p className="text-[11px] text-gray-400 mt-1.5 italic">
                  {imgMatch[1]}
                </p>
              )}
            </div>
          );
        }

        // 7. Headings
        if (text.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-sm font-bold text-primary-800 mt-3 mb-1">
              {renderInlineText(text.slice(4))}
            </h4>
          );
        }
        if (text.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-base font-bold text-primary-800 mt-4 mb-1.5">
              {renderInlineText(text.slice(3))}
            </h3>
          );
        }
        if (text.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-lg font-bold text-primary-900 mt-5 mb-2">
              {renderInlineText(text.slice(2))}
            </h2>
          );
        }

        // 8. Blockquote
        if (text.startsWith('> ')) {
          return (
            <blockquote key={idx} className="rounded-xl border-l-4 border-primary-300 bg-primary-50/60 px-4 py-3 text-sm italic leading-relaxed text-primary-700">
              {renderInlineText(text.slice(2))}
            </blockquote>
          );
        }

        // 9. Bullet lists
        if (text.startsWith('- ') || text.startsWith('* ')) {
          return (
            <li key={idx} className="ml-5 list-disc text-sm text-primary-600 mt-0.5 leading-relaxed">
              {renderInlineText(text.slice(2))}
            </li>
          );
        }

        // 10. Numbered lists
        const numberedMatch = text.match(/^(\d+)\.\s(.*)/);
        if (numberedMatch) {
          return (
            <li key={idx} className="ml-5 list-decimal text-sm text-primary-600 mt-0.5 leading-relaxed">
              {renderInlineText(numberedMatch[2])}
            </li>
          );
        }

        // 11. Horizontal rule
        if (text === '---' || text === '***') {
          return <hr key={idx} className="my-4 border-primary-100" />;
        }

        // Standard Text Paragraph
        return (
          <p key={idx} className="text-sm leading-relaxed text-primary-600">
            {renderInlineText(text)}
          </p>
        );
      })}
    </div>
  );
}

interface YukBelajarStepProps {
  sections: ContentSection[];
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
}

export function YukBelajarStep({ sections, onActivitySave, activityAnswers }: YukBelajarStepProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(sections.length > 0 ? [sections[0].id] : []),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      <div className="space-y-3">
        {sections.map((section, i) => {
          const isOpen = openIds.has(section.id);
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-xl border border-primary-100"
            >
              <button
                type="button"
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between bg-white px-4 py-3 text-left transition-colors hover:bg-primary-50"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-primary-700">
                  {section.title}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-primary-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-primary-400" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-primary-50 bg-white px-4 py-4">
                      {section.imageUrl && (
                        <div className="mb-3 overflow-hidden rounded-xl border border-primary-100 max-h-60 flex justify-center bg-gray-50">
                          <img src={section.imageUrl} alt={section.title} className="object-contain max-h-60 w-full" loading="lazy" decoding="async" />
                        </div>
                      )}
                      <StudentRichContentRenderer
                        content={section.content}
                        onActivitySave={onActivitySave}
                        activityAnswers={activityAnswers}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </StepWrapper>
  );
}

interface YukBelajarTopik3Props {
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik3({ onActivitySave: _onActivitySave, activityAnswers: _activityAnswers, isTeacherPreview: _isTeacherPreview }: YukBelajarTopik3Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);
  const [selectedB, setSelectedB] = useState<number | null>(null);
  const [revealedData, setRevealedData] = useState<string | null>(null);

  const personalDataList = [
    { name: 'Nama Lengkap', category: 'Hati-hati', desc: 'Sebaiknya gunakan nama panggilan di situs umum.', icon: '👤' },
    { name: 'Alamat Rumah', category: 'Rahasia', desc: 'Sangat rahasia! Orang asing tidak boleh tahu rumahmu.', icon: '🏠' },
    { name: 'Tanggal Lahir', category: 'Hati-hati', desc: 'Bisa digunakan untuk menebak kata sandi atau identitas.', icon: '🎂' },
    { name: 'Nomor Telepon', category: 'Rahasia', desc: 'Bahaya spam, penipuan, atau panggilan dari orang asing.', icon: '📞' },
    { name: 'Nama Orang Tua', category: 'Rahasia', desc: 'Sering digunakan untuk verifikasi data perbankan/KK.', icon: '👪' },
    { name: 'Nama Sekolah/Kelas', category: 'Hati-hati', desc: 'Membagikan lokasi sekolah mempermudah pelacakan.', icon: '🏫' },
    { name: 'Foto Diri', category: 'Hati-hati', desc: 'Foto wajah bisa disalahgunakan oleh pihak tidak bertanggung jawab.', icon: '📷' },
    { name: 'Alamat Email', category: 'Hati-hati', desc: 'Hati-hati menerima email mencurigakan (phishing).', icon: '✉️' },
    { name: 'Nama Akun', category: 'Hati-hati', desc: 'Nama pengguna game atau belajar yang unik.', icon: '👥' },
    { name: 'Kata Sandi', category: 'Rahasia', desc: 'JANGAN PERNAH DIBAGIKAN! Kunci utama keamanan digitalmu.', icon: '🔑' },
    { name: 'Lokasi Real-time', category: 'Rahasia', desc: 'Menunjukkan di mana kamu berada saat ini secara instan.', icon: '📍' },
    { name: 'Dokumen Penting', category: 'Rahasia', desc: 'Berisi data sensitif seluruh anggota keluarga (Rapor, KK, Kartu Pelajar).', icon: '📄' },
  ];

  const handleChoiceB = (choice: number) => {
    setSelectedB(choice);
    if (choice === 2) {
      canvasConfetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const tabs = [
    { id: 'A', label: 'A. Data Pribadi', icon: '👤' },
    { id: 'B', label: 'B. Batasi Info', icon: '🚧' },
    { id: 'C', label: 'C. Kunci Akun', icon: '🔐' },
    { id: 'D', label: 'D. Aturan Mengisi', icon: '✅' },
    { id: 'E', label: 'E. Jejak Digital', icon: '👣' },
  ] as const;

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setSelectedB(null);
    setRevealedData(null);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: revealedData !== null || visitedTabs.includes('A'),
    B: selectedB === 2,
    C: visitedTabs.includes('C'),
    D: visitedTabs.includes('D'),
    E: visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-teal-700 flex items-center gap-1.5">
            Petualangan Penjaga Rahasia
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-teal-600 rounded-full border border-teal-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-teal-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Penjaga Rahasia Digital! 🔐
          </motion.p>
        )}
      </div>

      {/* Intro Card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 shadow-sm text-left">
        <h3 className="font-display font-bold text-teal-800 text-sm sm:text-base flex items-center gap-2 mb-2">
          Yuk, Belajar Bersama!
        </h3>
        <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
          Pernahkah kamu membuat akun gim, membuka aplikasi belajar, atau mengisi nama pada sebuah situs? Kadang-kadang, aplikasi atau situs meminta informasi tentang diri kita. Ada yang boleh dibagikan, tetapi ada juga yang harus dijaga baik-baik.
        </p>
        <p className="text-xs sm:text-sm text-teal-900 font-semibold mt-2">
          Nah, pada topik ini kamu akan belajar mengenali data pribadi. Kamu juga akan belajar cara menjaga data pribadi agar tidak disalahgunakan orang lain.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                ? 'bg-teal-600 text-white shadow-md'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-650 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'A' && (
          <motion.div
            key="tab-a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">A</span>
                Data Pribadi Ada di Sekitar Kita
              </h3>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed">
                Pernahkah kamu menulis nama di buku tugas? Pernahkah kamu mengisi nama saat masuk ke aplikasi belajar? Atau mungkin kamu pernah membuat akun gim, akun belajar, atau bergabung ke grup kelas? Saat melakukan kegiatan itu, kamu biasanya diminta menuliskan beberapa informasi tentang dirimu. Misalnya nama, kelas, nama sekolah, atau alamat email. Informasi seperti itu disebut data pribadi.
              </p>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed mt-3">
                <strong>Data pribadi</strong> adalah informasi yang berkaitan dengan diri seseorang. Data ini dapat menunjukkan siapa diri kita, di mana kita tinggal, bagaimana orang lain dapat menghubungi kita, atau akun apa yang kita gunakan.
              </p>
            </div>
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
              <img src="/form_pribadi_chromebook.png" alt="Anak melihat form di Chromebook" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                Ketuk Data di Bawah untuk Tahu Mengapa Harus Hati-Hati:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {personalDataList.map((e) => {
                  const t = revealedData === e.name;
                  return (
                    <button
                      key={e.name}
                      type="button"
                      onClick={() => setRevealedData(t ? null : e.name)}
                      className={`p-3 rounded-xl border text-center transition-all ${e.category === 'Rahasia'
                        ? 'border-rose-100 bg-rose-50/20 hover:bg-rose-50 text-rose-800'
                        : 'border-amber-100 bg-amber-50/20 hover:bg-amber-50 text-amber-800'
                        } ${t ? 'ring-2 ring-teal-500 scale-102 font-bold shadow-sm' : ''}`}
                    >
                      <div className="text-2xl mb-1">{e.icon}</div>
                      <div className="text-[11px] font-semibold leading-tight">{e.name}</div>
                      <div className="text-[9px] mt-1 font-bold uppercase tracking-wider opacity-85">
                        {e.category === 'Rahasia' ? 'Rahasia' : 'Hati-hati'}
                      </div>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {revealedData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mt-3 text-left"
                  >
                    <p className="text-xs font-bold text-slate-800">
                      {revealedData} {personalDataList.find(e => e.name === revealedData)?.category === 'Rahasia' ? 'Tidak boleh dibagikan' : 'Berbagi dengan izin'}
                    </p>
                    <p className="text-xs text-slate-655 mt-1 leading-relaxed">
                      {personalDataList.find(e => e.name === revealedData)?.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="rounded-xl border border-teal-100 bg-teal-50/20 p-4 text-xs leading-relaxed text-teal-800">
              <strong>Ingat:</strong> Tidak semua data pribadi boleh dibagikan sembarangan. Ada data yang boleh ditulis saat diperlukan, misalnya nama panggilan untuk tugas kelas. Namun, ada juga data yang harus dijaga ketat, seperti alamat rumah, nomor telepon, dan kata sandi.
            </div>
          </motion.div>
        )}

        {activeTab === 'B' && (
          <motion.div
            key="tab-b"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="text-left">
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">B</span>
                Tidak Semua Informasi Boleh Dibagikan
              </h3>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                Coba perhatikan dua kalimat berikut. Bayangkan kedua kalimat ini ditulis di internet:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-left">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kalimat 1</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 italic">“Namaku Raka. Aku suka menggambar hewan.”</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-left">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kalimat 2</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 italic">“Namaku Raka Pratama. Aku kelas 5 SD Harapan. Rumahku di Jalan Melati Nomor 10. Nomor HP ibuku 08xxxxxxxx.”</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/10 space-y-3 text-left">
              <p className="text-xs font-bold text-teal-855">Menurutmu, kalimat mana yang lebih berisiko jika ditulis di internet?</p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  disabled={selectedB !== null}
                  onClick={() => handleChoiceB(1)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${selectedB === 1 ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  Kalimat 1 Lebih Berisiko
                </button>
                <button
                  type="button"
                  disabled={selectedB !== null}
                  onClick={() => handleChoiceB(2)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${selectedB === 2 ? 'bg-success-50 border-success-300 text-success-700 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  Kalimat 2 Lebih Berisiko
                </button>
              </div>
              {selectedB !== null && (
                <div className="p-3.5 rounded-xl text-xs leading-relaxed font-semibold bg-white border border-teal-100 text-left">
                  {selectedB === 2 ? (
                    <p className="text-success-700">Benar sekali! Kalimat kedua berisi data sensitif lengkap seperti nama lengkap, sekolah, alamat, dan nomor HP orang tua. Kalimat pertama hanya berisi nama panggilan dan hobi umum yang lebih aman.</p>
                  ) : (
                    <p className="text-rose-750">Kurang tepat. Kalimat pertama lebih aman karena hanya mencantumkan nama panggilan dan hobi. Kalimat kedua yang sangat berbahaya karena berisi detail alamat, nomor HP, dan sekolah lengkap.</p>
                  )}
                </div>
              )}
            </div>
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
              <img src="/unggahan_aman_risiko.png" alt="Contoh Unggahan Aman vs Risiko" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                Membagikan data pribadi sembarangan dapat menimbulkan masalah. Orang yang tidak dikenal bisa menghubungi kita, mengetahui tempat tinggal kita, atau bahkan menggunakan data kita untuk hal yang tidak baik.
              </p>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/20 p-4 sm:p-5 space-y-3">
              <p className="text-xs font-bold text-teal-850 flex items-center gap-1.5">Sebelum menulis informasi di internet, biasakan bertanya:</p>
              <ul className="space-y-2.5 text-xs text-teal-900 font-semibold pl-1 text-left">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-200 text-teal-855 text-[10px] font-bold">1</span>
                  Apakah informasi ini perlu ditulis?
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-200 text-teal-855 text-[10px] font-bold">2</span>
                  Apakah informasi ini aman dibagikan?
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-200 text-teal-855 text-[10px] font-bold">3</span>
                  Apakah aku sudah meminta izin guru or orang tua?
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === 'C' && (
          <motion.div
            key="tab-c"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="text-left">
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">C</span>
                Data Pribadi Itu Seperti Kunci Rumah
              </h3>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                Bayangkan kamu memiliki kunci rumah. Apakah kunci itu boleh diberikan kepada orang yang tidak dikenal? Tentu tidak.
              </p>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed mt-3 font-semibold">
                <strong>Kata sandi</strong> juga seperti kunci. Kata sandi digunakan untuk membuka akun digital. Jika kata sandi diberikan kepada orang lain, akunmu bisa dibuka tanpa izin. Orang lain bisa membaca pesanmu, mengganti namamu, mengirim sesuatu menggunakan akunmu, atau menghapus tugas yang sudah kamu buat.
              </p>
            </div>
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
              <img src="/kunci_kata_sandi.png" alt="Ilustrasi Kunci Kata Sandi" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
            </div>

            {/* Video Edukasi Kunci Akun */}
            <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/10 space-y-3 text-left">
              <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">🎬 Video Edukasi: Hati-Hati di Internet (Si Juki x Kominfo)</h4>
              <p className="text-xs text-slate-655 leading-relaxed font-semibold">
                Yuk, tonton video petualangan Si Juki bersama Kominfo untuk memahami mengapa kita harus menjaga data pribadi dan kata sandi kita di internet agar tetap aman!
              </p>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50 my-2">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/TEqtr5KEgTU?rel=0"
                  title="Hati-Hati Di Internet: Juki x Kominfo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="text-left">
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                Selain kata sandi, alamat rumah dan nomor telepon juga harus dijaga. Jika alamat rumah dibagikan sembarangan, orang yang tidak dikenal bisa mengetahui tempat tinggalmu. Jika nomor telepon orang tua disebarkan, orang lain bisa menghubungi keluargamu tanpa izin.
              </p>
            </div>
            <div className="space-y-3 text-left">
              <p className="text-[10px] sm:text-xs font-bold text-rose-500 uppercase tracking-widest">
                Beberapa risiko jika data pribadi dibagikan sembarangan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { title: 'Kepalsuan Identitas', text: 'Orang lain bisa berpura-pura menjadi dirimu.' },
                  { title: 'Akun Dibuka Tanpa Izin', text: 'Membuka akun game atau belajar tanpa persetujuanmu.' },
                  { title: 'Mengirim Pesan Palsu', text: 'Mengirimkan pesan kurang baik menggunakan namamu.' },
                  { title: 'Penipuan Hadiah Palsu', text: 'Menipu keluargamu dengan dalih kamu menang hadiah.' },
                  { title: 'Mengetahui Lokasi', text: 'Melacak lokasi tempat tinggal atau sekolahmu.' },
                  { title: 'Panggilan Mengganggu', text: 'Menghubungi keluargamu secara terus-menerus tanpa izin.' }
                ].map((e, t) => (
                  <div key={t} className="p-3 bg-rose-50/20 rounded-xl border border-rose-100 flex items-start gap-2.5">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-rose-800">{e.title}</h4>
                      <p className="text-[10px] text-rose-700 mt-0.5 leading-relaxed font-semibold">{e.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/10 p-4 text-xs leading-relaxed text-amber-800 text-left">
              <strong>Ingat:</strong> Karena itu, data pribadi harus dijaga seperti kita menjaga barang penting. Itulah sebabnya data pribadi harus dijaga dengan hati-hati.
            </div>
          </motion.div>
        )}

        {activeTab === 'D' && (
          <motion.div
            key="tab-d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 font-medium text-left"
          >
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">D</span>
                Kapan Data Boleh Diisi?
              </h3>
              <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-semibold">
                Kadang-kadang kita memang perlu mengisi data. Misalnya saat mengerjakan kuis dari guru, mengisi presensi kelas, mengikuti lomba sekolah, atau menggunakan aplikasi belajar. Sebelum mengisi data, kamu perlu memperhatikan beberapa hal:
              </p>
            </div>
            <div className="space-y-3">
              {[
                { num: '1', title: 'Lihat siapa yang meminta data', icon: '👀', desc: 'Jika formulir diberikan oleh guru, sekolah, atau orang tua, kemungkinan formulir itu memang diperlukan. Namun, tetap isi sesuai arahan.' },
                { num: '2', title: 'Perhatikan data apa saja yang diminta', icon: '🧾', desc: 'Jika hanya meminta nama panggilan dan kelas, biasanya masih aman untuk belajar. Tetapi jika meminta alamat rumah, nomor HP orang tua, foto kartu keluarga, atau kata sandi, kamu harus bertanya kepada guru atau orang tua terlebih dahulu.' },
                { num: '3', title: 'Jangan pernah menulis kata sandi di formulir', icon: '🔑', desc: 'Kata sandi hanya digunakan oleh pemilik akun. Guru, teman, atau aplikasi belajar tidak seharusnya meminta kata sandi pribadimu.' },
                { num: '4', title: 'Jangan langsung menekan tombol kirim jika belum yakin', icon: '🛑', desc: 'Baca kembali data yang kamu tulis. Jika ada yang membuatmu bingung, berhenti sejenak dan bertanyalah.' }
              ].map((e, t) => (
                <div key={t} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start gap-3.5 hover:border-teal-350 transition-colors">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-850 font-bold text-xs">
                    {e.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{e.icon}</span>
                      <span>{e.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-655 mt-0.5 leading-relaxed font-semibold">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
              <img src="/kirim_aman_konfirmasi.png" alt="Anak ragu menekan Kirim" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
            </div>
          </motion.div>
        )}

        {activeTab === 'E' && (
          <motion.div
            key="tab-e"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 text-left font-semibold text-slate-655"
          >
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-bold">E</span>
                Jejak Digital dari Data yang Kita Bagikan
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                Setiap kali kita menulis, mengunggah, atau mengisi sesuatu di internet, kegiatan itu dapat meninggalkan jejak digital. <strong>Jejak digital</strong> adalah bekas aktivitas kita di dunia digital.
              </p>
            </div>
            <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
              <img src="/jejak_digital_kaki.png" alt="Jejak Kaki Digital" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
            </div>
            <div className="space-y-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Dua Jenis Jejak Digital:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50/20 border border-teal-100 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    📣 <span>Jejak Digital Aktif</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Jejak yang kita tinggalkan secara <strong>sadar dan sengaja</strong>.
                  </p>
                  <ul className="text-[10px] text-slate-500 space-y-1 pl-1 list-disc list-inside font-semibold">
                    <li>Mengirim pesan di WhatsApp grup kelas</li>
                    <li>Mengunggah foto atau video di media sosial</li>
                    <li>Menulis komentar di bawah video YouTube</li>
                    <li>Mengisi formulir pendaftaran akun game</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-850 flex items-center gap-1.5">
                    🕵️‍♂️ <span>Jejak Digital Pasif</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Jejak yang tertinggal <strong>tanpa kita sadari</strong> secara langsung.
                  </p>
                  <ul className="text-[10px] text-slate-500 space-y-1 pl-1 list-disc list-inside font-semibold">
                    <li>Situs web merekam alamat IP internet kita</li>
                    <li>Aplikasi merekam lokasi GPS di HP kita</li>
                    <li>Riwayat pencarian Google mengingat apa yang kita cari</li>
                    <li>Waktu yang kita habiskan saat membuka game</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/10 space-y-2">
              <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">⚠️ Mengapa Kita Harus Peduli?</h4>
              <p className="text-[11px] leading-relaxed">
                Di dunia digital, apa yang sudah dibagikan <strong>sangat sulit untuk benar-benar dihilangkan</strong>:
              </p>
              <ul className="text-[11px] space-y-2 list-none pl-1 font-semibold">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500">📌</span>
                  <span>
                    <strong>Mudah Disimpan:</strong> Orang lain bisa dengan cepat mengunduh foto kita atau melakukan <i>screenshot</i> pesan kita, lalu menyebarkannya lagi meski postingan asli sudah dihapus.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500">📌</span>
                  <span>
                    <strong>Permanen (Abadi):</strong> Data disimpan di komputer raksasa (server) penyedia aplikasi yang tidak otomatis hilang begitu saja.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500">📌</span>
                  <span>
                    <strong>Masa Depan:</strong> Ketika mendaftar sekolah baru atau melamar pekerjaan nanti, jejak digitalmu yang buruk (marah-marah di game, komentar kasar) bisa dilihat dan merugikanmu.
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/20 p-4 sm:p-5 space-y-3">
              <h4 className="text-xs font-bold text-teal-855 flex items-center gap-1.5">💡 Tips Menjaga Jejak Digital (Rumus T.H.I.N.K.)</h4>
              <p className="text-[11px] text-teal-900 font-bold">Sebelum memposting atau mengirim data, tanyakan hal-hal ini:</p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {[
                  { letter: 'T', word: 'True', desc: 'Benarkah ini or cuma hoaks?' },
                  { letter: 'H', word: 'Helpful', desc: 'Apakah membantu orang?' },
                  { letter: 'I', word: 'Inspiring', desc: 'Apakah menginspirasi baik?' },
                  { letter: 'N', word: 'Necessary', desc: 'Pentingkah untuk dibagikan?' },
                  { letter: 'K', word: 'Kind', desc: 'Apakah kata-katanya sopan?' }
                ].map((e, t) => (
                  <div key={t} className="bg-white p-2.5 rounded-xl border border-teal-100 text-center flex flex-col justify-between font-bold">
                    <span className="text-lg font-black text-teal-650 block">{e.letter}</span>
                    <span className="text-[10px] font-bold text-slate-800 block mt-0.5">{e.word}</span>
                    <p className="text-[9px] text-slate-500 mt-1 leading-tight font-semibold">{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-amber-50/25 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700 leading-relaxed font-normal">
              Jejak digital dapat berguna jika digunakan dengan baik. Misalnya, tugas yang dikirim lewat aplikasi belajar dapat membantu guru menilai pekerjaanmu. Namun, jejak digital juga bisa merugikan jika kamu sembarangan membagikan data pribadi. Karena itu, jadilah pengguna digital yang cerdas dan hati-hati!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digi footer */}
      <div className="mt-8 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-5 rounded-2xl shadow-sm flex items-center gap-4 text-left">
        <div>
          <h4 className="font-display font-black text-xs">Pesan Digi:</h4>
          <p className="text-[10px] text-teal-50 leading-relaxed font-bold mt-1">
            "Kunci utama keselamatan digital adalah kewaspadaan. Jaga kata sandimu rapat-rapat, batasi informasi pribadi yang kamu bagikan, dan selalu tinggalkan jejak digital yang baik di mana pun kamu menjelajah!"
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}


interface YukBelajarTopik4Props {
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function TautanBandingan() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      <div className="border border-emerald-100 rounded-2xl p-5 bg-gradient-to-b from-emerald-50/20 to-transparent flex flex-col items-center text-center space-y-4 shadow-sm hover:border-emerald-250 transition-all">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold border border-emerald-200 shadow-sm">
          🚪🔓
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Tautan Aman & Resmi
          </span>
          <h4 className="font-bold text-slate-800 text-sm">Pintu Belajar & Informasi</h4>
        </div>
        <div className="bg-white/80 border border-slate-100 rounded-xl py-2 px-3 font-mono text-[10px] text-emerald-650 w-full flex items-center justify-center gap-1.5 shadow-inner">
          <span className="text-emerald-500">🔒</span> https://classroom.google.com/tugas
        </div>
        <p className="text-xs text-slate-655 leading-relaxed font-semibold">
          Membawa kamu ke halaman resmi sekolah, video edukasi tepercaya, atau game belajar. Aman diklik karena dikirim oleh guru atau situs resmi tepercaya!
        </p>
      </div>
      <div className="border border-rose-100 rounded-2xl p-5 bg-gradient-to-b from-rose-50/20 to-transparent flex flex-col items-center text-center space-y-4 shadow-sm hover:border-rose-250 transition-all">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold border border-rose-200 shadow-sm">
          🚪⚠️
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Tautan Palsu & Jebakan
          </span>
          <h4 className="font-bold text-slate-800 text-sm">Pintu Bahaya & Pencurian</h4>
        </div>
        <div className="bg-white/80 border border-slate-100 rounded-xl py-2 px-3 font-mono text-[10px] text-rose-655 w-full flex items-center justify-center gap-1.5 shadow-inner">
          <span className="text-rose-500">⚠️</span> http://hadiah-gratis-cepat.xyz/klaim
        </div>
        <p className="text-xs text-slate-655 leading-relaxed font-semibold">
          Mengarah ke situs penipuan yang meminta kata sandi (phishing), menyebarkan virus yang merusak HP, atau menampilkan iklan kotor. Harus dihindari!
        </p>
      </div>
    </div>
  );
}

export function JalurLapor() {
  return (
    <div className="border border-amber-100 rounded-2xl p-5 bg-amber-50/15 my-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-amber-150 pb-3">
        <span className="text-2xl">🤝</span>
        <div>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Jalur Lapor Aman: Guru & Orang Tua</h4>
          <p className="text-[10.5px] text-slate-500 font-semibold">
            Mereka adalah penyelamat utamamu di dunia digital, jangan pernah takut bercerita!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-amber-100/70 rounded-xl p-4 space-y-2">
          <h5 className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
            💬 Contoh Kalimat Lapor yang Cerdas:
          </h5>
          <p className="text-xs text-slate-700 italic bg-slate-50/50 rounded-lg p-3 border border-slate-100 leading-relaxed font-semibold">
            "Ayah/Ibu/Guru, tadi aku sedang browsing dan tidak sengaja memencet tombol/link yang aneh. Layarnya tiba-tiba berubah dan aku takut. Tolong bantu periksa HP-ku, ya."
          </p>
        </div>
        <div className="bg-white border border-amber-100/70 rounded-xl p-4 space-y-2 flex flex-col justify-center">
          <h5 className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
            🛡️ Mengapa Melapor itu Hebat?
          </h5>
          <ul className="text-[10px] sm:text-[11px] text-slate-655 space-y-2 leading-relaxed font-semibold pl-1">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Orang tua/guru bisa mengamankan perangkatmu dari virus.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Membantu memulihkan akunmu jika kata sandimu tidak sengaja terisi.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span> Berani jujur dan melapor adalah tanda bahwa kamu anak yang bertanggung jawab!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function YukBelajarTopik4({
  onActivitySave: _onActivitySave,
  activityAnswers: _activityAnswers,
  isTeacherPreview: _isTeacherPreview,
}: YukBelajarTopik4Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);
  const [revealedRule, setRevealedRule] = useState<number | null>(null);

  const tabs = [
    { id: 'A', label: 'A. Mengenal Link & Konten', icon: '🔗' },
    { id: 'B', label: 'B. Ciri Link Mencurigakan', icon: '🚩' },
    { id: 'C', label: 'C. Waspada Konten Medsos', icon: '📱' },
    { id: 'D', label: 'D. Langkah Aman 4P', icon: '🛡️' },
    { id: 'E', label: 'E. Jika Telanjur Klik', icon: '🚨' },
  ] as const;

  const warningSigns = [
    {
      title: ' 1. Hadiah yang Terlalu Menarik (Terlalu Bagus untuk Menjadi Nyata)',
      desc: 'Penjahat internet sering memancing menggunakan hadiah. Contoh: "Kamu pemenang beruntung! HP gratis menunggumu!", "Klik di sini untuk dapat 10.000 diamond gratis tanpa bayar!", "Dapatkan kuota internet 50GB seumur hidup!" Ingat: Kalau hadiahnya terdengar sangat tidak masuk akal dan terlalu mudah didapat, itu hampir 100% adalah penipuan!',
    },
    {
      title: ' 2. Membuatmu Terburu-buru, Panik, atau Takut',
      desc: 'Pesan jebakan sengaja dirancang agar kamu tidak sempat berpikir panjang. Contoh: "Awas! Akunmu akan dihapus dalam 5 menit jika tidak mengeklik ini!", "HP kamu terkena 100 virus berbahaya! Bersihkan sekarang!", "Kalau kamu tidak menyebarkan pesan ini, ibumu akan celaka!" Ingat: Perusahaan resmi tidak pernah mengancam penggunanya seperti itu.',
    },
    {
      title: ' 3. Meminta Kata Sandi atau Data Penting',
      desc: 'Jika ada tautan yang tiba-tiba memunculkan kolom formulir dan memintamu mengisi kata sandi (password), kode OTP (angka rahasia dari SMS), alamat rumah lengkap, atau nama ibu kandung, segera tutup! Itu adalah upaya pencurian akun.',
    },
    {
      title: ' 4. Alamat Tautannya Terlihat Aneh dan Acak-acakan',
      desc: 'Kadang penipu membuat situs yang namanya dimiripkan dengan situs terkenal, tetapi jika diperhatikan ada yang aneh. Contoh asli: www.roblox.com. Contoh palsu: www.roblox-hadiah-gratis99.site atau www.r0blox.net. Alamat yang terlalu panjang, banyak angka acak, dan tidak beraturan harus segera dihindari.',
    },
    {
      title: ' 5. Berisi Iklan atau Tombol Unduhan (Download) yang Memaksa',
      desc: 'Pernahkah kamu membuka sebuah situs untuk membaca cerita, tapi tiba-tiba muncul tombol hijau besar bertuliskan "DOWNLOAD SEKARANG!" berkedip-kedip? Jangan pernah menekannya! Itu biasanya adalah virus atau aplikasi jahat yang bisa merusak gawaimu.',
    },
    {
      title: ' 6. Mengandung Konten yang Tidak Pantas',
      desc: 'Konten tidak pantas adalah gambar, video, atau tulisan yang tidak boleh dilihat oleh anak-anak. Jika kamu melihatnya, kamu mungkin akan merasa kaget, jijik, atau takut.',
    },
  ];

  const steps4P = [
    {
      step: 'Pause',
      title: '1. PAUSE (Berhenti Sebentar)',
      icon: '🛑',
      action: 'Jangan langsung mengklik! Tahan jarimu. Saat kamu menerima pesan yang menjanjikan hadiah atau ancaman, ambil napas dalam-dalam. Penjahat internet ingin kamu panik. Dengan berhenti sejenak, kamu sudah menggagalkan rencana jahat mereka.',
      example: 'Raka menahan jarinya ketika melihat pesan kuota gratis. Dia tidak terburu-buru mengklik meskipun ada batas waktu.',
    },
    {
      step: 'Periksa',
      title: '2. PERIKSA (Jadilah Detektif)',
      icon: '🔎',
      action: 'Gunakan mata detektifmu: Siapa yang mengirim pesan ini? Orang tak dikenal? Apakah alamat tautannya aneh? Apakah pesan ini menyuruhku merahasiakannya dari Ayah dan Ibu? (Ingat, hal yang baik tidak perlu dirahasiakan dari orang tua!).',
      example: 'Naya mengamati tautan yang dikirim nomor asing. Dia melihat nama webnya acak-acakan dan segera curiga.',
    },
    {
      step: 'Pikirkan',
      title: '3. PIKIRKAN Risiko (Gunakan Logikamu)',
      icon: '🧠',
      action: 'Tanya pada dirimu sendiri: "Kalau aku isi namaku dan kata sandiku di sini, apakah akunku akan dicuri?" "Kalau aku klik unduh, apakah HP ini akan rusak kena virus?" Lebih baik berhati-hati dan tidak mendapat "hadiah palsu", daripada menangis karena akun game atau data pentingmu lenyap dicuri orang.',
      example: 'Bima berpikir bahwa jika dia mengisi alamat rumahnya, orang jahat bisa mengetahui tempat tinggalnya dan membahayakan keluarganya.',
    },
    {
      step: 'Putuskan',
      title: '4. PUTUSKAN (Ambil Tindakan Cerdas)',
      icon: '✅',
      action: 'Setelah memikirkan risikonya, ambil keputusan yang paling aman! Keputusan terbaik sering kali adalah: Mengabaikan pesan, menutup layar, tidak mengisi data apa pun, dan menceritakannya kepada orang tua.',
      example: 'Mira memutuskan untuk tidak mengklik tautan tersebut, menghapus pesannya, memblokir pengirimnya, dan melaporkannya ke ibunya.',
    },
  ];

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setRevealedRule(null);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: visitedTabs.includes('A'),
    B: visitedTabs.includes('B'),
    C: visitedTabs.includes('C'),
    D: revealedRule !== null || visitedTabs.includes('D'),
    E: visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-rose-700 flex items-center gap-1.5">
            Petualangan Penjaga Gawai
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-rose-600 rounded-full border border-rose-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-red-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Penjaga Gawai yang Waspada! 🛡️
          </motion.p>
        )}
      </div>

      {/* Intro Card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 p-5 shadow-sm text-left">
        <h3 className="font-display font-bold text-rose-800 text-sm sm:text-base flex items-center gap-2 mb-2">
          Yuk, Belajar Bersama!
        </h3>
        <p className="text-xs sm:text-sm text-rose-955 leading-relaxed font-semibold">
          Saat memegang gawai, kamu adalah kaptennya! Agar kamu selamat dari semua jebakan dan konten buruk di internet, mari kita pelajari materi keamanan digital berikut ini dengan saksama.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`flex-1 min-w-[140px] sm:min-w-[160px] py-2 px-3 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                ? 'bg-rose-600 text-white shadow-md'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm text-left"
        >
          {activeTab === 'A' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">A</span>
                  Mengenal Tautan (Link) dan Konten di Internet
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Saat menggunakan internet, kamu pasti sering menemukan tautan atau sering disebut link. Tautan biasanya berupa teks berwarna biru yang bisa diklik. Tautan adalah alamat yang akan membawamu berpindah dari satu halaman ke halaman lain. Misalnya, ketika kamu mengeklik judul video YouTube, membuka modul pelajaran dari sekolah, atau masuk ke halaman tugas.
                </p>
              </div>

              <TautanBandingan />

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tautan itu persis seperti pintu. Ada pintu yang membawamu ke ruang belajar yang nyaman dan terang. Namun, ada juga pintu jebakan yang bisa membawamu ke tempat yang berbahaya, membuatmu bingung, atau mencuri barang-barang berhargamu (data pribadi).
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Selain tautan, di balik pintu-pintu itu terdapat <strong>Konten</strong>. Konten adalah semua isi yang ada di internet. Bentuknya bisa berupa teks, foto, video, rekaman suara, kolom komentar, permainan (game), dan iklan.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ingat, tidak semua konten di internet cocok untuk anak-anak. Ada konten yang sangat bermanfaat, tetapi ada juga konten yang menakutkan, kasar, mengejek orang lain, atau meminta kamu melakukan tantangan yang berbahaya.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/25 p-4 sm:p-5 space-y-3">
                <p className="text-xs font-bold text-rose-850 flex items-center gap-1.5">
                  Jadi, saat memegang gawai, kamu adalah kaptennya! Selalu tanyakan tiga hal ini pada dirimu sendiri:
                </p>
                <ul className="space-y-2.5 text-xs text-rose-900 font-semibold pl-1">
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">1</span>
                    "Apakah tempat ini aman?"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">2</span>
                    "Apakah tontonan ini sesuai untuk usiaku?"
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">3</span>
                    "Apakah aku perlu meminta bantuan guru atau Ayah dan Ibu?"
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'B' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">B</span>
                  Ciri-Ciri Tautan dan Konten Mencurigakan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jebakan di internet sebenarnya mudah dikenali jika kamu teliti. Perhatikan 6 tanda bahaya berikut ini. Ketuk untuk melihat penjelasannya:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {warningSigns.map((sign, idx) => {
                  const isRevealed = revealedRule === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRevealedRule(isRevealed ? null : idx)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${isRevealed
                        ? 'border-rose-300 bg-rose-50/20 ring-2 ring-rose-500 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-rose-200 hover:bg-rose-50/10'
                        }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="text-xs font-bold text-rose-850 flex items-center gap-2">
                          {sign.title}
                        </span>
                        <span className="text-xs shrink-0">
                          {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </div>
                      {isRevealed && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-xs text-slate-600 mt-2 leading-relaxed border-t border-rose-100/50 pt-2 font-medium"
                        >
                          {sign.desc}
                        </motion.p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'C' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">C</span>
                  BAB KHUSUS: Waspada Konten Tidak Pantas di Media Sosial!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Saat ini, mengakses media sosial sangatlah mudah. Kamu mungkin suka menonton video pendek di TikTok, Instagram Reels, atau YouTube Shorts. Hanya dengan menggeser layar (swipe), video baru akan terus bermunculan.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                  Namun, sistem (algoritma) di media sosial kadang tanpa sengaja memunculkan video yang bukan untuk anak-anak. Inilah yang disebut <strong>Konten Tidak Pantas</strong>.
                </p>
              </div>
              <div className="border border-red-100 rounded-2xl p-4 bg-red-50/20 space-y-3">
                <h4 className="text-xs font-bold text-red-900">Apa saja yang termasuk Konten Tidak Pantas?</h4>
                <ul className="space-y-3.5 text-xs text-slate-700 leading-relaxed font-semibold pl-1">
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-900">Konten Kekerasan:</strong> Video orang berkelahi, kecelakaan parah yang tidak disensor, or kekerasan pada hewan peliharaan.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-900">Konten Menakutkan (Horor):</strong> Penampakan menyeramkan atau cerita misteri yang bisa membuatmu bermimpi buruk dan tidak berani ke kamar mandi sendirian.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-900">Kata-Kata Kasar dan Jorok:</strong> Video yang berisi makian, hinaan, atau obrolan yang tidak sopan.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-900">Tantangan Berbahaya (Dangerous Challenge):</strong> Video yang mengajak penontonnya melakukan hal konyol yang membahayakan nyawa, seperti menahan napas terlalu lama atau melompat dari tempat tinggi.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                    <div>
                      <strong className="text-red-900">Konten Khusus Dewasa:</strong> Gambar atau video yang menampakkan hal-hal yang tidak seharusnya dilihat oleh anak di bawah umur.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800">Apa Dampaknya Jika Kamu Sering Melihatnya?</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Konten-konten ini bisa meracuni pikiranmu. Kamu bisa menjadi anak yang pemarah, suka meniru kata-kata kasar, selalu merasa ketakutan, atau kehilangan konsentrasi saat belajar.
                </p>
              </div>
              <div className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/20 space-y-3">
                <h4 className="text-xs font-bold text-emerald-955">Jurus Menghadapi Konten Tidak Pantas di Media Sosial:</h4>
                <div className="space-y-2.5 text-xs text-emerald-900 leading-relaxed font-semibold">
                  <div className="flex items-start gap-2">
                    <div>
                      <strong>Geser Cepat (Swipe Away):</strong> Jika tiba-tiba muncul video yang membuatmu merasa tidak nyaman, aneh, atau takut, jangan terus ditonton! Langsung geser layarmu ke video berikutnya.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>
                      <strong>Tekan "Tidak Tertarik" (Not Interested):</strong> Di TikTok atau YouTube, kamu bisa menekan layar agak lama di video tersebut, lalu pilih tombol "Tidak Tertarik" or "Don't Recommend". Dengan begitu, sistem tahu kamu tidak menyukai video kotor tersebut.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>
                      <strong>Lapor pada Orang Dewasa:</strong> Jika videonya sangat mengganggu, tunukkan pada orang tuamu agar mereka bisa memblokir akun yang menyebarkannya.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'D' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">D</span>
                  Langkah Aman Sebelum Mengeklik: Lakukan "4P"!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Agar kamu selamat dari semua jebakan dan konten buruk di atas, jadikan 4P sebagai perisaimu sebelum jarimu menekan layar!
                </p>
              </div>
              <div className="space-y-4">
                {steps4P.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 hover:border-rose-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-center md:w-28 flex-shrink-0">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-xs font-bold text-rose-800 tracking-wide">{step.step}</span>
                    </div>
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-4 space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">{step.action}</p>
                      <div className="bg-white/80 p-2 border border-slate-100 rounded-lg text-[10px] text-slate-500 italic mt-1">
                        <strong> Contoh Tindakan Penjelajah Cerdas:</strong> {step.example}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest"> Contoh Simulasi Penerapan 4P:</p>
                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/15">
                  <p className="text-xs text-amber-955 leading-normal font-bold">
                    <strong>Pesan di HP:</strong> “Selamat! Kamu terpilih mendapat HP gratis. Klik link www.hadiah-hp-segera.com dan isi alamat rumahmu sekarang juga sebelum jam 12 siang!”
                  </p>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-xs text-left text-slate-500">
                    <thead className="text-[10px] text-white uppercase bg-gradient-to-r from-rose-500 to-rose-400">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 font-bold w-28">Langkah 4P</th>
                        <th scope="col" className="px-4 py-2.5 font-bold">Tindakan Penjelajah Cerdas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { step: ' Pause', answer: 'Aku tahan jariku, aku tidak terburu-buru meski batas waktunya jam 12 siang.' },
                        { step: ' Periksa', answer: 'Alamat link-nya sangat aneh. Dan kenapa ada orang tak dikenal tiba-tiba mau memberi HP mahal secara gratis?' },
                        { step: ' Pikirkan', answer: 'Kalau aku berikan alamat rumahku, orang jahat bisa tahu di mana aku tinggal. Ini berbahaya bagi keselamatanku dan keluargaku.' },
                        { step: ' Putuskan', answer: 'Aku tidak akan mengeklik link itu. Aku hapus pesannya dan kublokir nomor pengirimnya.' }
                      ].map((item, t) => (
                        <tr key={t} className="bg-white border-b hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-rose-800 font-bold text-[11px] whitespace-nowrap">{item.step}</td>
                          <td className="px-4 py-3 text-slate-700 leading-relaxed font-medium">{item.answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs font-semibold text-sky-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-sky-955">💬 Netiket Berbagi Tautan (Link Sharing Netiquette):</p>
                <p>Selain waspada saat menerima link, kita juga harus sopan saat membagikan link ke orang lain:</p>
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-650 font-medium">
                  <li>
                    <strong>Jangan Menyebar Spam:</strong> Jangan suka membagikan link pesan berantai (seperti hadiah kuota gratis) ke grup kelas atau chat teman. Itu sangat mengganggu kenyamanan orang lain.
                  </li>
                  <li>
                    <strong>Periksa Kebenaran Dahulu:</strong> Pastikan link yang kamu bagikan aman dan memang bermanfaat bagi temanmu.
                  </li>
                  <li>
                    <strong>Beri Penjelasan Singkat:</strong> Saat mengirim link ke teman, tulislah penjelasan seperti: <em>"Ini link materi tugas IPA dari Bu Guru, ya"</em> agar temanmu tidak bingung dan curiga.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'E' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold">E</span>
                  Bagaimana Kalau Telanjur Mengeklik?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Terkadang, karena layar terlalu sensitif atau kita kurang fokus, jari kita tidak sengaja mengeklik tautan berbahaya atau membuka konten yang menakutkan.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold text-red-650">
                  Jika ini terjadi, JANGAN PANIK dan JANGAN TAKUT DIMARAHI! Segera lakukan langkah penyelamatan darurat berikut:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { num: '1', title: 'Lepaskan Tangan dari Layar', text: 'Jangan menekan tombol apa pun di halaman tersebut, terutama tombol "Setuju" (Allow), "Unduh" (Download), or "Ok".' },
                  { num: '2', title: 'Segera Tutup Halaman (Close Tab)', text: 'Tekan tombol silang (X) or tekan tombol Home untuk keluar dari aplikasi (browser).' },
                  { num: '3', title: 'Jangan Isi Kolom Apa Pun', text: 'Jika halaman itu meminta nama atau kata sandi, biarkan kosong.' },
                  { num: '4', title: 'LAPOR SEKARANG JUGA', text: 'Temui Ayah, Ibu, or Gurumu. Katakan dengan jujur: "Ayah/Ibu, tadi aku tidak sengaja memencet tautan aneh dan layarnya berubah. Tolong periksa HP-ku."' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-rose-50/15 rounded-xl border border-rose-100/60 flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 text-rose-700 text-xs font-bold flex-shrink-0">{item.num}</span>
                    <div>
                      <h4 className="text-xs font-bold text-rose-900 leading-none">{item.title}</h4>
                      <p className="text-[10px] text-rose-750 mt-1 leading-normal font-semibold">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <JalurLapor />

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 leading-relaxed text-left">
                <p>
                  *Meminta bantuan orang dewasa bukan berarti kamu anak yang ceroboh atau nakal. Justru, berani melapor adalah tanda bahwa kamu anak yang sangat bertanggung jawab dan pintar melindungi diri sendiri.*
                </p>
                <p className="mt-3 text-emerald-955 font-black flex items-center gap-1.5 border-t border-emerald-200/50 pt-2">
                  <span> Pesan Digi:</span>
                  "Di dunia digital, kamu adalah kapten kapalnya! Gunakan perisai 4P (Pause, Periksa, Pikirkan, Putuskan). Jika melihat yang aneh, menakutkan, atau memaksa, jangan ragu untuk menutupnya dan bercerita kepada orang tuamu. Selamat menjelajah dengan aman!"
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </StepWrapper>
  );
}
interface YukBelajarTopik5Props {
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik5({
  onActivitySave: _onActivitySave,
  activityAnswers: _activityAnswers,
  isTeacherPreview: _isTeacherPreview,
}: YukBelajarTopik5Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);
  const [activeNetiketCard, setActiveNetiketCard] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [chatTone, setChatTone] = useState<'kasar' | 'sopan'>('kasar');
  const [activeCommentIdx, setActiveCommentIdx] = useState(0);

  const tabs = [
    { id: 'A', label: 'A. Komunikasi', icon: '💬' },
    { id: 'B', label: 'B. Mengapa Santun', icon: '🤝' },
    { id: 'C', label: 'C. Komentar Baik', icon: '✍️' },
    { id: 'D', label: 'D. Huruf & Emoji', icon: '🔤' },
    { id: 'E', label: 'E. 3 Pertanyaan', icon: '🧭' },
  ] as const;

  const netiketPenting = [
    {
      icon: '👤',
      title: 'Manusia di Balik Layar',
      tagline: 'Ada perasaan nyata di balik setiap akun.',
      desc: 'Ingatlah bahwa orang yang membaca pesanmu bukanlah robot. Mereka bisa merasa terluka, malu, atau sedih. Perlakukan orang lain secara online sebagaimana kamu ingin diperlakukan di dunia nyata.',
    },
    {
      icon: '👣',
      title: 'Jejak Digital Bersifat Abadi',
      tagline: 'Semua kata & foto terekam selamanya.',
      desc: 'Sekali kamu mengirim pesan kasar atau menyebarkan foto memalukan, jejak itu akan menetap di internet selamanya. Jejak digital buruk ini bisa memengaruhi sekolah, beasiswa, atau pekerjaanmu di masa depan!',
    },
    {
      icon: '🗣️',
      title: 'Teks Mudah Salah Paham',
      tagline: 'Chatting tidak memiliki nada suara.',
      desc: 'Dalam dunia digital, orang lain tidak bisa melihat senyummu atau mendengar nada bicaramu. Tulisan singkat dengan huruf kapital atau tanda seru berlebih mudah disalahartikan sebagai kemarahan.',
    },
    {
      icon: '🛡️',
      title: 'Mencegah Perundungan Siber',
      tagline: 'Menjaga internet tetap aman & ramah.',
      desc: 'Netiket adalah benteng pertahanan dari cyberbullying. Dengan menjaga kesopanan, kita mencegah candaan kecil berubah menjadi pertengkaran yang kejam dan merugikan teman-teman kita.',
    },
  ];

  const commentsData = [
    {
      kurang: 'Video kamu membosankan.',
      sopan: 'Videonya sudah bagus. Mungkin bisa dibuat lebih singkat agar lebih menarik.',
      reactionKurang: ' Sedih & Malu',
      reactionSopan: ' Semangat & Senang',
      character: 'Raka',
    },
    {
      kurang: 'Tulisanmu jelek.',
      sopan: 'Tulisanmu bisa dibuat lebih rapi agar mudah dibaca.',
      reactionKurang: ' Minder & Kecewa',
      reactionSopan: ' Termotivasi Belajar',
      character: 'Naya',
    },
    {
      kurang: 'Kamu salah semua.',
      sopan: 'Ada beberapa bagian yang perlu diperbaiki. Yuk, coba cek lagi.',
      reactionKurang: ' Takut Mencoba',
      reactionSopan: ' Berani Mencoba Lagi',
      character: 'Bima',
    },
    {
      kurang: 'Kok kamu tidak paham-paham?',
      sopan: 'Bagian mana yang masih membingungkan? Mungkin kita bisa belajar bersama.',
      reactionKurang: ' Merasa Bodoh',
      reactionSopan: ' Merasa Terbantu',
      character: 'Mira',
    },
  ];

  const questionsData = [
    {
      title: '1. Apakah pesanku benar?',
      desc: 'Jangan menyebarkan informasi yang belum jelas atau belum tentu kebenarannya (hoaks). Pastikan faktanya dulu!',
    },
    {
      title: '2. Apakah pesanku sopan?',
      desc: 'Hindari kata-kata kasar, mengejek, menyindir, atau merendahkan orang lain. Ingat, pembaca adalah manusia sungguhan.',
    },
    {
      title: '3. Apakah pesanku perlu dikirim?',
      desc: 'Pikirkan apakah pesanmu memberikan manfaat. Jika pesan itu hanya mempermalukan, menyakiti, atau membuat teman sedih, lebih baik disimpan sendiri atau dihapus.',
    },
  ];

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setSelectedQuestion(null);
    setActiveNetiketCard(null);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: visitedTabs.includes('A'),
    B: activeNetiketCard !== null || visitedTabs.includes('B'),
    C: visitedTabs.includes('C'),
    D: visitedTabs.includes('D'),
    E: selectedQuestion !== null || visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      <div className="mb-5 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5">
            Petualangan Teman Digital Santun
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-blue-600 rounded-full border border-blue-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-sky-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Teman Digital yang Santun! 💬
          </motion.p>
        )}
      </div>

      <div className="mb-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 p-5 shadow-sm text-left">
        <h3 className="font-display font-bold text-sky-800 text-sm sm:text-base flex items-center gap-2 mb-2">
          Yuk, Belajar Bersama!
        </h3>
        <p className="text-xs sm:text-sm text-sky-955 leading-relaxed">
          Di dunia digital, cara kita berkomunikasi mencerminkan siapa kita. Mari kita pelajari bagaimana cara berbicara dengan santun dan menjaga perasaan sesama pengguna internet!
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                ? 'bg-sky-600 text-white shadow-md'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm text-left"
        >
          {activeTab === 'A' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">A</span>
                    Apa Itu Komunikasi Digital?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Pernahkah kamu mengirim pesan di grup kelas, membalas WhatsApp teman, menulis komentar di video, atau memberi tanggapan pada karya teman di aplikasi belajar?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Kegiatan seperti itu disebut <strong>komunikasi digital</strong>. Komunikasi digital adalah kegiatan menyampaikan pesan menggunakan perangkat digital, seperti HP, Chromebook, komputer, atau tablet. Pesan itu bisa dikirim melalui WhatsApp, email, grup kelas, kolom komentar, gim online, atau aplikasi belajar.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Dalam komunikasi langsung, kita bisa melihat wajah, mendengar nada suara, dan memperhatikan gerak tubuh orang lain. Namun, dalam komunikasi digital, orang lain biasanya hanya membaca tulisan kita. Karena itu, pesan yang kurang jelas bisa membuat orang lain salah paham.
                  </p>
                </div>
                <div className="lg:col-span-5 flex justify-center w-full">
                  <div className="flex flex-col border border-slate-200 rounded-2xl bg-slate-50 shadow-sm overflow-hidden w-full max-w-sm">
                    <div className="bg-sky-600 text-white px-3 py-2 text-[11px] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">💬 Kesalahpahaman dalam Chatting</span>
                    </div>
                    <div className="p-3.5 space-y-3.5 bg-slate-50/50">
                      <div className="flex flex-col items-start space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase">Anton (Teks saja, tanpa nada):</span>
                        <div className="bg-white text-slate-800 px-3 py-2 rounded-2xl rounded-tl-none text-xs font-medium border border-slate-100 shadow-xs max-w-[85%]">
                          "Tugas kelompok dikumpul besok!"
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase">Budi (Membaca dengan salah paham):</span>
                        <div className="bg-rose-100 text-rose-900 px-3 py-2 rounded-2xl rounded-tr-none text-xs font-medium shadow-xs max-w-[85%] text-left">
                          "Kenapa kamu memerintah kasar begitu? Aku juga tahu kok!"
                        </div>
                      </div>
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-800 leading-relaxed font-semibold">
                        💡 <strong>Mengapa ini terjadi?</strong> Karena tulisan tidak memiliki nada suara. Pesan Anton yang sebenarnya biasa saja, dibaca Budi seolah-olah bernada marah atau membentak.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perbandingan Dampak Pesan:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-red-100 bg-red-50/20 text-left">
                    <p className="text-xs font-bold text-red-800 mb-1 flex items-center gap-1.5">Kurang Tepat:</p>
                    <p className="text-xs text-red-900 font-mono bg-white p-2.5 rounded-lg border border-red-200">"Kamu lama banget balasnya!"</p>
                    <p className="text-[10px] text-red-700 mt-2">Efek: Pembaca merasa dituduh, diserang, dan tegang.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 text-left">
                    <p className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">Lebih Santun:</p>
                    <p className="text-xs text-emerald-900 font-mono bg-white p-2.5 rounded-lg border border-emerald-200">"Kamu sudah sempat membaca pesanku? Aku menunggu jawabanmu, ya."</p>
                    <p className="text-[10px] text-emerald-700 mt-2">Efek: Terasa menghargai kesibukan teman dan sopan didengar.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs font-semibold text-sky-900 mt-4 leading-relaxed">
                Dalam dunia digital, kita perlu mengenal <strong>netiket</strong> atau etika berinternet. Netiket berarti aturan sopan santun saat berkomunikasi di internet, termasuk saat mengirim pesan, menulis komentar, berdiskusi, atau membalas unggahan orang lain.
              </div>
            </div>
          )}

          {activeTab === 'B' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">B</span>
                    Mengapa Kita Harus Santun di Dunia Digital?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Dunia digital bukan tempat yang terpisah dari kehidupan nyata. Orang yang membaca pesan kita juga memiliki perasaan. Komentar yang kasar dapat membuat orang lain sedih, malu, marah, atau kehilangan semangat.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Misalnya, saat teman mengunggah hasil gambar, lalu ada yang menulis, <em>“Jelek sekali gambarmu!”</em> Teman itu bisa merasa malu dan tidak percaya diri. Padahal, kita tetap bisa memberi saran dengan cara yang lebih baik.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Selain itu, pesan digital dapat tersimpan. Komentar, foto, pesan, dan unggahan yang kita kirim dapat menjadi bagian dari <strong>jejak digital</strong>. Jejak digital adalah rekaman atau bekas aktivitas yang kita lakukan di dunia digital. UNICEF menjelaskan bahwa perundungan siber (cyberbullying) meninggalkan jejak digital permanen yang bisa menjadi catatan atau bukti tindakan tersebut.
                  </p>
                </div>
                <div className="lg:col-span-5 flex justify-center w-full">
                  <div className="flex flex-col border border-slate-200 rounded-2xl bg-slate-50 shadow-sm overflow-hidden w-full max-w-sm">
                    <div className="bg-blue-900 text-white px-3 py-2 text-[11px] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">👣 Ilustrasi: Jejak Digital Permanen</span>
                    </div>
                    <div className="p-3.5 space-y-3 bg-slate-50/50">
                      <div className="border border-slate-100 bg-white rounded-xl p-2.5 shadow-xs">
                        <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-slate-100">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold flex items-center justify-center">👤</span>
                          <span className="text-[10px] font-bold text-slate-600">Komentar Kasar (2 Tahun Lalu)</span>
                          <span className="text-[8px] text-red-500 font-bold ml-auto bg-red-50 px-1.5 py-0.5 rounded-full">Permanen</span>
                        </div>
                        <p className="text-xs font-mono text-red-650 italic">"Gambarmu payah sekali! Hapus aja!"</p>
                      </div>
                      <div className="flex items-center justify-center text-[10px] text-slate-400 font-bold gap-1 my-1">
                        <span>⬇️ Riwayat Terus Tersimpan di Internet ⬇️</span>
                      </div>
                      <div className="border border-amber-250 bg-amber-50/50 rounded-xl p-2.5 shadow-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-amber-900">Pendaftaran Sekolah Baru / Beasiswa</span>
                          <span className="text-[9px] text-amber-700 font-extrabold ml-auto bg-amber-100 px-1.5 py-0.5 rounded-full">Diperiksa Guru</span>
                        </div>
                        <p className="text-[10px] text-amber-800 leading-normal font-semibold">
                          ⚠️ Jejak digital buruk di masa lalu dapat ditemukan dan memengaruhi masa depanmu! Berpikirlah sebelum mengetik.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50/25 p-4 sm:p-5 space-y-3">
                <p className="text-xs font-bold text-sky-800">Santun di dunia digital berarti kita membiasakan hal berikut:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Menggunakan kata-kata yang baik',
                    'Tidak mengejek atau merendahkan',
                    'Tidak menulis komentar kasar',
                    'Tidak menyebarkan pesan yang mempermalukan',
                    'Menghargai pendapat dan karya orang lain',
                    'Berpikir matang sebelum mengirim pesan',
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-sky-100/50 shadow-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">{idx + 1}</span>
                      <span className="text-xs text-sky-900 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] sm:text-xs text-slate-500 italic text-center">
                Keterampilan kewargaan digital membantu kita membuat pilihan yang cerdas, berpikir kritis, dan membangun kebiasaan sehat saat menggunakan teknologi.
              </div>
              <div className="space-y-3 mt-6 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-sky-800">Kenapa Netiket Sangat Penting di Zaman Sekarang?</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Di era digital saat ini, netiket bukan sekadar etika biasa, melainkan perisai penting untuk menjaga diri dan orang lain. Ketuk kartu di bawah untuk melihat penjelasannya:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {netiketPenting.map((card, idx) => {
                    const isRevealed = activeNetiketCard === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveNetiketCard(isRevealed ? null : idx)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${isRevealed
                          ? 'border-sky-300 bg-sky-50/20 ring-2 ring-sky-500 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/10'
                          }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{card.icon}</span>
                            <span className="text-xs font-bold text-sky-955">{card.title}</span>
                          </div>
                          <span className="text-[10px] font-bold text-sky-600">{isRevealed ? 'Tutup' : 'Baca Detail'}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 font-semibold">{card.tagline}</p>
                        {isRevealed && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-[11px] text-slate-655 mt-3 leading-relaxed border-t border-sky-100/50 pt-2 font-medium"
                          >
                            {card.desc}
                          </motion.p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'C' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">C</span>
                  Komentar yang Baik Itu Seperti Apa?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Komentar yang baik bukan berarti harus selalu memuji secara palsu. Kita boleh memberi saran, tetapi saran itu harus disampaikan dengan sopan. Komentar yang sopan memiliki 3 ciri utama:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 mt-2">
                  <li><strong>Tidak menyakiti</strong> perasaan orang lain.</li>
                  <li>Menggunakan <strong>bahasa yang jelas dan baik</strong>.</li>
                  <li><strong>Membantu teman</strong> menjadi lebih baik (bersifat membangun).</li>
                </ul>
              </div>
              <div className="space-y-3 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"> Simulator Balasan Pesan</p>
                <p className="text-[11px] text-slate-500 mb-2">
                  Gunakan tombol navigasi di bawah kartu untuk melihat simulasi contoh komentar dari setiap teman. Bandingkan komentar yang kurang santun dengan yang lebih santun.
                </p>
                <div className="relative border border-slate-200 rounded-3xl bg-slate-50 p-4 sm:p-5 space-y-4 max-w-lg mx-auto shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                        {commentsData[activeCommentIdx].character.charAt(0)}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold text-slate-700 block">
                          {commentsData[activeCommentIdx].character}
                        </span>
                        <span className="text-[9px] text-slate-450 font-bold block mt-0.5">
                          Kasus {activeCommentIdx + 1} dari {commentsData.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveCommentIdx((prev) => (prev > 0 ? prev - 1 : commentsData.length - 1))}
                        className="p-1.5 rounded-xl bg-white border border-slate-250 hover:bg-slate-100 hover:text-sky-600 transition-all text-slate-600 shadow-xs active:scale-95"
                        title="Sebelumnya"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveCommentIdx((prev) => (prev < commentsData.length - 1 ? prev + 1 : 0))}
                        className="p-1.5 rounded-xl bg-white border border-slate-250 hover:bg-slate-100 hover:text-sky-600 transition-all text-slate-600 shadow-xs active:scale-95"
                        title="Selanjutnya"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCommentIdx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4 pt-1"
                    >
                      <div className="flex flex-col items-start space-y-1.5">
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                          ⚠️ Komentar Kurang Santun:
                        </span>
                        <div className="bg-red-100 text-red-900 px-4 py-2.5 rounded-2xl rounded-tl-none max-w-xs text-xs font-semibold relative shadow-xs">
                          "{commentsData[activeCommentIdx].kurang}"
                        </div>
                        <span className="text-[10px] text-red-700 italic font-bold">
                          Reaksi {commentsData[activeCommentIdx].character}: {commentsData[activeCommentIdx].reactionKurang}
                        </span>
                      </div>
                      <div className="flex flex-col items-end space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                          ✨ Komentar Lebih Santun:
                        </span>
                        <div className="bg-emerald-100 text-emerald-900 px-4 py-2.5 rounded-2xl rounded-tr-none max-w-xs text-xs font-semibold relative shadow-xs text-left">
                          "{commentsData[activeCommentIdx].sopan}"
                        </div>
                        <span className="text-[10px] text-emerald-700 italic font-bold">
                          Reaksi {commentsData[activeCommentIdx].character}: {commentsData[activeCommentIdx].reactionSopan}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex justify-center gap-1.5 pt-3 border-t border-slate-200">
                    {commentsData.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveCommentIdx(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeCommentIdx === idx ? 'w-5 bg-sky-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Ke slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-sky-50/15 p-4 mt-4 space-y-2">
                <p className="text-xs font-bold text-sky-900"> Sebelum menulis komentar, coba tanyakan pada dirimu sendiri:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white p-2.5 rounded-lg border border-sky-100 text-center text-[10px] font-semibold text-slate-700">Apakah komentarku sopan?</div>
                  <div className="bg-white p-2.5 rounded-lg border border-sky-100 text-center text-[10px] font-semibold text-slate-700">Apakah komentarku membantu?</div>
                  <div className="bg-white p-2.5 rounded-lg border border-sky-100 text-center text-[10px] font-semibold text-slate-700">Apakah komentarku membuat teman merasa dihargai?</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'D' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">D</span>
                  Hati-Hati dengan Huruf Kapital, Emoji, dan Tanda Seru
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Saat menulis pesan, bukan hanya kata-kata yang perlu diperhatikan. Cara mengetik juga dapat memengaruhi arti pesan.
                </p>
              </div>
              <div className="space-y-3 my-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"> Visualisasi Teks & Nada Bicara:</p>
                <p className="text-[11px] text-slate-500">Ketuk tombol untuk membandingkan kedua nada. Geser ke bawah untuk melihat semua contoh.</p>
                <div className="flex justify-center gap-2 mb-2">
                  <button
                    onClick={() => setChatTone('kasar')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${chatTone === 'kasar' ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    Nada Kasar / Teriak
                  </button>
                  <button
                    onClick={() => setChatTone('sopan')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${chatTone === 'sopan' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    Nada Sopan / Tenang
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { situasi: 'Menunggu balasan teman', kasar: 'AKU TUNGGU SEKARANG!!!', sopan: 'Aku tunggu sekarang, ya. Terima kasih.' },
                    { situasi: 'Teman lama membalas pesan', kasar: 'KOK LAMA BANGET SIH BALESNYA?!', sopan: 'Tidak apa-apa, aku mengerti kamu sibuk.' },
                    { situasi: 'Mengingatkan tugas kelompok', kasar: 'CEPETAN KERJAKAN TUGASMU!!!', sopan: 'Yuk, kita lanjut kerjakan tugasnya bersama, ya.' },
                    { situasi: 'Memberi tanggapan saat teman salah', kasar: 'SALAH SEMUA!! GITU AJA GAK BISA', sopan: 'Ada sedikit yang keliru. Mau kubantu memperbaikinya?' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.situasi}</p>
                      {chatTone === 'kasar' ? (
                        <div className="space-y-1.5">
                          <div className="bg-red-500 text-white px-4 py-2.5 rounded-2xl rounded-tl-none text-xs font-mono font-bold tracking-wide shadow-sm inline-block">
                            "{item.kasar}"
                          </div>
                          <p className="text-[10px] text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg block w-max">
                            Terasa seperti membentak, marah, or mendikte!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 flex flex-col items-end">
                          <div className="bg-sky-500 text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-xs font-medium shadow-sm inline-block">
                            "{item.sopan}"
                          </div>
                          <p className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg block w-max">
                            Terasa ramah, sabar, dan penuh penghargaan.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-950 space-y-2 font-medium">
                <p> Mengapa penggunaan huruf besar/tanda seru berlebihan perlu dihindari?</p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1">
                  <li><strong>Huruf kapital semua (ALL CAPS)</strong> diartikan sebagai teriakan di dunia internet.</li>
                  <li><strong>Tanda seru (!) berlebihan</strong> menambahkan efek kemarahan or paksaan.</li>
                  <li><strong>Emoji</strong> harus digunakan dengan tepat sesuai kondisi hati lawan bicara. Mengirim emoji tertawa saat teman sedang sedih bisa dianggap merendahkan or meremehkan.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'E' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">E</span>
                  Tiga Pertanyaan Sebelum Mengirim Pesan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sebelum kamu menekan tombol kirim atau membalas pesan orang lain di internet, selalu tanyakan tiga hal penting berikut:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {questionsData.map((q, idx) => {
                  const isRevealed = selectedQuestion === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedQuestion(isRevealed ? null : idx)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${isRevealed
                        ? 'border-sky-400 bg-sky-50/20 ring-2 ring-sky-500 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-sky-50/10 hover:border-sky-200'
                        }`}
                    >
                      <span className="text-xs font-bold text-sky-900">{q.title}</span>
                      {isRevealed && (
                        <p className="text-[10px] text-slate-600 mt-2 border-t border-sky-100/50 pt-2 font-semibold leading-relaxed">
                          {q.desc}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"> Contoh Kasus Penggunaan Kalimat:</p>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-xs text-left text-slate-500">
                    <thead className="text-[10px] text-white uppercase bg-gradient-to-r from-sky-500 to-sky-400">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Situasi</th>
                        <th className="px-4 py-2.5 font-bold">Pesan Kurang Tepat</th>
                        <th className="px-4 py-2.5 font-bold">Pesan Lebih Baik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sit: 'Teman terlambat membalas', bad: '“Lama banget sih!”', good: '“Tidak apa-apa, aku tunggu balasanmu, ya.”' },
                        { sit: 'Teman salah mengirim tugas', bad: '“Kamu salah semua.”', good: '“Sepertinya ada bagian yang perlu diperbaiki. Coba cek lagi, ya.”' },
                        { sit: 'Teman mengunggah gambar', bad: '“Gambarmu jelek.”', good: '“Gambarmu sudah menarik. Mungkin warnanya bisa dibuat lebih rapi.”' },
                      ].map((item, t) => (
                        <tr key={t} className="bg-white border-b hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-900 font-bold text-[11px]">{item.sit}</td>
                          <td className="px-4 py-3 text-red-600 font-mono font-medium">{item.bad}</td>
                          <td className="px-4 py-3 text-emerald-700 font-medium">{item.good}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Digi footer */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/35 p-4 shadow-sm text-left flex items-start gap-3">
        <div>
          <h4 className="text-xs font-bold text-amber-900">Pesan Digi:</h4>
          <p className="text-[11px] sm:text-xs text-amber-800 italic mt-0.5 leading-relaxed">
            “Di dunia digital, kata-kata juga bisa membuat orang lain senang atau sedih. Jadi, sebelum mengirim pesan, pilih kata yang baik, sopan, dan tidak menyakiti.”
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

interface YukBelajarTopik6Props {
  onActivitySave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik6({
  onActivitySave,
  activityAnswers = {},
  isTeacherPreview = false,
}: YukBelajarTopik6Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);

  // States for interactive parts
  const [selectedSihir, setSelectedSihir] = useState<number | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<number | null>(null);
  const [selectedJurusPenyelamat, setSelectedJurusPenyelamat] = useState<number | null>(null);
  const [selectedJurusPahlawan, setSelectedJurusPahlawan] = useState<number | null>(null);

  // Simulation states for Tab D
  const [simAnswers, setSimAnswers] = useState<Record<number, 'jahat' | 'pahlawan'>>({});

  // Reflection states for Tab E
  const [reflection, setReflection] = useState<string>(
    activityAnswers?.['t6-video-reflection'] || ''
  );
  const [reflectionSaving, setReflectionSaving] = useState<boolean>(false);
  const reflectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReflectionChange = (val: string) => {
    setReflection(val);
    setReflectionSaving(true);
    if (reflectionTimer.current) clearTimeout(reflectionTimer.current);
    reflectionTimer.current = setTimeout(() => {
      if (onActivitySave && !isTeacherPreview) {
        onActivitySave('t6-video-reflection', val);
      }
      setReflectionSaving(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (reflectionTimer.current) clearTimeout(reflectionTimer.current);
    };
  }, []);

  const tabs = [
    { id: 'A', label: 'A. Sihir Kata', icon: '✨' },
    { id: 'B', label: 'B. Monster Buli', icon: '😈' },
    { id: 'C', label: 'C. Jadi Upstander', icon: '🛡️' },
    { id: 'D', label: 'D. Misi Pahlawan', icon: '🏆' },
    { id: 'E', label: 'E. Nonton & Refleksi', icon: '🎬' },
  ] as const;

  const sihirKata = [
    {
      sihir: ' Sihir Semangat',
      pesan: '"Wah, gambarmu bagus banget! Terus berlatih, ya!"',
      reaksi: 'Temanmu akan tersenyum lebar dan makin percaya diri. ',
      type: 'positif',
    },
    {
      sihir: ' Sihir Persahabatan',
      pesan: '"Terima kasih sudah membantuku mengerjakan tugas ini."',
      reaksi: 'Temanmu merasa dihargai, disayangi, dan bahagia. ',
      type: 'positif',
    },
    {
      sihir: ' Sihir Berbisa',
      pesan: '"Ih, tulisanmu jelek banget kayak ceker ayam."',
      reaksi: 'Jantung temanmu berdebar, ia merasa sangat sedih dan malu. ',
      type: 'negatif',
    },
    {
      sihir: ' Sihir Perusak',
      pesan: '"Gara-gara kamu kita kalah main game! Keluar aja sana!"',
      reaksi: 'Temanmu merasa ditolak, takut, menangis, dan kehilangan teman. ',
      type: 'negatif',
    },
  ];

  const monsterBuli = [
    {
      nama: 'Si Pengejek',
      bisa: 'Mengolok-olok teman di grup WhatsApp kelas dengan stiker buatan sendiri, mengejek nama orang tua, atau mengomentari bentuk tubuh secara berulang-ulang.',
    },
    {
      nama: 'Si Komentar Jahat',
      bisa: "Sengaja menulis ejekan ('kamu jelek', 'bakatnya payah') di kolom komentar video YouTube, TikTok, atau Instagram karya teman.",
    },
    {
      nama: 'Si Penyebar Rahasia',
      bisa: 'Mengambil foto aib teman (misalnya saat mengantuk atau salah berpose), menjadikannya meme/stiker, lalu menyebarkannya tanpa izin ke grup WhatsApp lain.',
    },
    {
      nama: 'Si Pengancam',
      bisa: 'Mengirim pesan pribadi (DM/PM) yang menakut-nakuti, memeras meminta pulsa/game item, atau mengancam akan memukuli korban di sekolah.',
    },
    {
      nama: 'Si Tukang Hasut',
      bisa: 'Mengajak seluruh anggota grup game online untuk mendiamkan atau menolak bermain bersama seorang teman (mengucilkan di dunia digital).',
    },
  ];

  const jurusPenyelamat = [
    {
      jurus: ' Jurus 1: STOP (Jangan Membalas)',
      misi: 'Tetap tenang dan abaikan.',
      penjelasan: 'Monster buli ingin melihatmu marah atau sedih. Jangan beri mereka kepuasan itu! Matikan HP sejenak, tarik napas dalam-dalam, dan jangan membalas dengan kata-kata kasar.',
    },
    {
      jurus: ' Jurus 2: SAVE (Simpan Bukti)',
      misi: 'Ambil tangkapan layar (screenshot).',
      penjelasan: 'Ambil screenshot atau rekam layar semua pesan jahat, komentar, beserta username dan tanggal pengiriman. Bukti ini sangat penting agar pelaku tidak bisa mengelak saat dilaporkan.',
    },
    {
      jurus: ' Jurus 3: BLOCK & REPORT (Blokir & Laporkan)',
      misi: 'Putus komunikasi seketika.',
      penjelasan: "Gunakan tombol 'Blokir' (Block) agar mereka tidak bisa mengirim pesan lagi. Gunakan juga tombol 'Laporkan' (Report) di aplikasi (WhatsApp, TikTok, Instagram, Game) agar sistem menindak akun mereka.",
    },
    {
      jurus: ' Jurus 4: TALK & REPORT TO TPPK (Bercerita & Laporkan ke Sekolah)',
      misi: 'Cari bantuan orang dewasa tepercaya.',
      penjelasan: 'Jangan memendam kesedihan sendiri! Ceritakan kepada orang tua dan laporkan secara resmi ke Guru Wali Kelas, Guru BK, atau TPPK (Tim Pencegahan dan Penanganan Kekerasan) di sekolah agar situasi ini ditangani secara aman.',
    },
  ];

  const jurusPahlawan = [
    {
      jurus: ' Jurus 1: Beri Dukungan Pribadi (Private Support)',
      misi: 'Hubungi korban secara pribadi (japri).',
      penjelasan: 'Hubungi korban secara pribadi (japri) untuk menenangkan hatinya dan menunjukkan bahwa dia tidak sendiri. Dukungan kecil ini sangat berarti bagi mental korban.',
    },
    {
      jurus: ' Jurus 2: Alihkan Perhatian (Distraction)',
      misi: 'Ubah topik pembicaraan di grup.',
      penjelasan: "Jika perundungan terjadi di grup WhatsApp, segera alihkan pembicaraan dengan hal positif, misalnya: 'Teman-teman, besok ada PR matematika halaman berapa ya?' atau membagikan info/pertanyaan tugas sekolah agar suasana ejekan mereda.",
    },
    {
      jurus: ' Jurus 3: Tegur dengan Sopan tapi Tegas (Firm Defense)',
      misi: 'Ingatkan pelaku di kolom chat.',
      penjelasan: "Tulis komentar tegas tapi sopan di grup: 'Teman-teman, yuk stop ejek-ejekannya. Kasihan dia, tidak baik memperlakukan teman seperti itu.' Jangan gunakan kata-kata kasar saat menegur.",
    },
    {
      jurus: ' Jurus 4: Jangan Ikut Meramaikan (Do Not Amplify)',
      misi: "Jangan sebar ulang atau beri 'Like'.",
      penjelasan: 'Jangan menyukai (like) komentar jahat, jangan membagikan ulang (share/forward) foto memalukan teman, dan jangan ikut tertawa. Mematikan kehebohan adalah cara jitu meredam bully.',
    },
    {
      jurus: ' Jurus 5: Laporkan Bersama (Report to School/TPPK)',
      misi: 'Laporkan bukti ke pihak sekolah.',
      penjelasan: 'Kumpulkan bukti tangkapan layar (screenshot) ejekan tersebut, lalu laporkan kepada Wali Kelas, Guru BK, atau TPPK (Tim Pencegahan dan Penanganan Kekerasan) sekolah agar segera ditindaklanjuti secara resmi.',
    },
  ];

  const simulationCases = [
    {
      situasi: 'Temanmu mengunggah gambar hasil lukisannya. Tapi, warnanya sedikit berantakan.',
      jahat: '"Warnanya jelek banget, mending buang aja lukisannya!"',
      pahlawan: '"Keren kamu sudah berani melukis! Kalau warnanya dirapikan sedikit lagi, pasti hasilnya makin luar biasa!"',
      feedbackJahat: 'Komentarmu akan membuat temanmu berkecil hati dan berhenti melukis. ',
      feedbackPahlawan: 'Hebat! Kamu memberi masukan yang membangun tanpa menjatuhkan mentalnya! ',
    },
    {
      situasi: 'Di grup kelas, tiba-tiba ada yang membagikan foto temanmu yang bajunya kotor ketumpahan makanan, lalu semua orang mengirim emoji tertawa (😂).',
      jahat: 'Ikut mengirim pesan "Wkwkwk jorok banget!" lalu menyebarkannya ke grup lain.',
      pahlawan: 'Tidak ikut tertawa, dan mengetik: "Teman-teman, kasihan dia, jangan ditertawakan terus, yuk kita ganti topik belajar aja." Lalu lapor wali kelas.',
      feedbackJahat: 'Tindakan ini memperbesar buli dan membuat temanmu sangat tertekan di grup. ',
      feedbackPahlawan: 'Kamu adalah Upstander sejati! Kamu memotong rantai ejekan dan mengalihkan situasi secara bijaksana. ',
    },
    {
      situasi: 'Kamu sedang main game online, tiba-tiba ada pemain tidak dikenal mengirim chat kasar dan memaki-makimu.',
      jahat: 'Terpancing emosi dan membalas memakinya dengan kata-kata yang lebih kasar.',
      pahlawan: 'Tetap tenang. Tekan tombol Block (Blokir) atau Report (Laporkan pemain), lalu tinggalkan permainan tersebut.',
      feedbackJahat: 'Membalas makian hanya akan membuat situasi makin panas dan memperburuk jejak digitalmu. ',
      feedbackPahlawan: 'Keputusan cerdas! Menghindari konflik dengan memblokir akun melindungimu dari energi negatif. ',
    },
  ];

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setSelectedSihir(null);
    setSelectedMonster(null);
    setSelectedJurusPenyelamat(null);
    setSelectedJurusPahlawan(null);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: selectedSihir !== null || visitedTabs.includes('A'),
    B: selectedMonster !== null || visitedTabs.includes('B'),
    C: selectedJurusPenyelamat !== null || visitedTabs.includes('C'),
    D: Object.keys(simAnswers).length >= 3,
    E: reflection.trim() !== '' || visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-pink-700 flex items-center gap-1.5">
            Petualangan Pahlawan Siber
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-pink-600 rounded-full border border-pink-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-pink-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-450"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Pahlawan Siber Anti-Buli! 🏆
          </motion.p>
        )}
      </div>

      {/* Intro Card */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 p-5 shadow-sm text-left">
        <h3 className="font-display font-bold text-pink-855 text-sm sm:text-base flex items-center gap-2 mb-2">
          Dunia Digital Juga Punya Perasaan
        </h3>
        <p className="text-xs sm:text-sm text-pink-900 leading-relaxed font-medium">
          Dunia digital sangat seru! Tapi ingat, di balik layar kaca HP atau komputermu, ada manusia sungguhan yang punya hati dan perasaan. Yuk, kita pelajari rahasia menjadi teman yang super baik (Pahlawan Internet) di dunia maya!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-105 p-1 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                ? 'bg-pink-600 text-white shadow-md'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                  : 'text-slate-605 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm text-left"
        >
          {activeTab === 'A' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold">A</span>
                    Kekuatan Ajaib di Ujung Jarimu
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Bayangkan kamu sedang memencet wadah pasta gigi hingga sebagian pastanya keluar. Apakah kamu bisa mengembalikan pasta gigi yang sudah keluar itu ke dalam wadahnya? Tentu saja tidak bisa, kan?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                    Nah, pesan atau komentar yang kita kirim di internet itu persis seperti pasta gigi tersebut! Sekali kita menekan tombol <strong>"Kirim"</strong>, tulisan itu tidak bisa ditarik kembali dari ingatan atau layar orang lain. Temanmu mungkin sudah membacanya, atau bahkan menyimpannya (screenshot).
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                    <strong>Mengapa kata-kata di internet terasa lebih tajam?</strong> Ketika berbicara langsung, kita bisa melihat ekspresi wajah dan mendengar nada suara teman kita. Namun di dunia digital, kita hanya membaca tulisan (teks). Tanpa ekspresi dan nada suara, kalimat bercanda bisa sangat mudah disalahartikan menjadi ejekan serius yang menyakitkan hati! Oleh karena itu, kita harus sangat berhati-hati sebelum menekan tombol kirim.
                  </p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 p-2 max-h-72">
                  <img src="/pasta_gigi_digital_indo.png" alt="Analogi Pasta Gigi Digital" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"> Pilih Sihir Kata untuk Melihat Efeknya:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sihirKata.map((item, idx) => {
                    const isRevealed = selectedSihir === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSihir(isRevealed ? null : idx)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${isRevealed
                          ? item.type === 'positif'
                            ? 'border-emerald-300 bg-emerald-50/20 ring-2 ring-emerald-500 shadow-sm'
                            : 'border-red-300 bg-red-50/20 ring-2 ring-red-500 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-pink-50/10 hover:border-pink-200'
                          }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold text-slate-800">{item.sihir}</span>
                          <span className="text-xs">
                            {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        </div>
                        {isRevealed && (
                          <div className="mt-3 border-t border-slate-200/50 pt-3 space-y-2">
                            <p className="text-xs font-mono bg-white p-2 rounded border border-slate-100 italic">{item.pesan}</p>
                            <p className="text-[11px] font-semibold text-slate-600">Dampak: {item.reaksi}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'B' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold">B</span>
                  Hati-hati dengan Monster Cyberbullying
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Di dunia nyata ada orang yang suka mengganggu, di dunia maya juga ada. Namanya adalah <strong>Monster Cyberbullying</strong>.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Cyberbullying (Perundungan Siber) adalah tindakan sengaja menyakiti, mengejek, atau mengganggu orang lain menggunakan teknologi digital (seperti HP atau komputer). Biasanya, perbuatan jahat ini dilakukan berkali-kali untuk membuat targetnya merasa takut, marah, atau menangis di kamarnya.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  <strong>Mengapa perundungan siber sangat berbahaya?</strong> Di dunia digital, pelaku sering merasa lebih berani (<i>online disinhibition</i>) karena mereka bersembunyi di balik layar HP dan tidak melihat langsung kesedihan korbannya. Bagi korban, perundungan siber terasa tidak ada habisnya karena teror pesan atau komentar jahat bisa masuk 24 jam sehari, bahkan ketika mereka sedang berada di dalam kamar yang aman sekalipun.
                </p>
              </div>
              <div className="space-y-3 mt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"> Wujud Monster Cyberbullying (Ketuk untuk info):</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {monsterBuli.map((monster, idx) => {
                    const isRevealed = selectedMonster === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedMonster(isRevealed ? null : idx)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all min-h-[80px] ${isRevealed
                          ? 'border-pink-300 bg-pink-50/20 ring-2 ring-pink-500 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-pink-50/10 hover:border-pink-200'
                          }`}
                      >
                        <span className="text-xs font-bold text-pink-900"> {monster.nama}</span>
                        {isRevealed && (
                          <p className="text-[10px] text-slate-655 mt-2 border-t border-pink-100/50 pt-2 font-medium leading-relaxed">
                            {monster.bisa}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Alasan Klasik: "Aku Kan Cuma Bercanda!"</strong>
                <p className="mt-1">
                  Banyak orang yang menyakiti temannya lalu berlindung di balik kata, <em>"Ah, kamu baper (bawa perasaan)! Aku kan cuma bercanda."</em>
                </p>
                <p className="mt-2 font-bold">
                  Ingat aturan emas ini: Bercanda yang baik itu membuat SEMUA ORANG tertawa. Kalau ada satu orang saja yang merasa sedih, malu, atau takut, itu namanya BUKAN BERCANDA, itu adalah perundungan!
                </p>
              </div>

              {/* Video Kasus Juki */}
              <div className="p-4 rounded-2xl border border-pink-100 bg-pink-50/10 space-y-3 text-left">
                <h4 className="text-xs font-bold text-pink-900 flex items-center gap-1.5">🎬 Tonton Kisah Juki: Semua Kasih Juki (Cyberbullying)</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Mari tonton video edukasi dari <strong>Cerdas Berkarakter Kemdikbud RI</strong> yang berjudul <strong>"Semua Kasih Juki"</strong>. Video ini mengisahkan tentang Juki yang menjadi korban ejekan di media sosial oleh teman-temannya sendiri yang mengira itu hanya "candaan", dan bagaimana dampak nyata yang dialami Juki.
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50 my-2">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/5CfLW5aEBAw?rel=0"
                    title="Semua Kasih Juki: Cyber Bullying"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-rose-100 bg-rose-50/10 space-y-4">
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">Dampak Buruk Cyberbullying bagi Korban</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cyberbullying bukanlah masalah sepele. Dampaknya sangat nyata dan bisa merusak kebahagiaan korban:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: '😢', title: 'Dampak Emosional', desc: 'Korban akan merasa sedih, malu, marah, cemas, hingga kehilangan kepercayaan diri untuk bersosialisasi.' },
                    { icon: '🤕', title: 'Dampak Fisik', desc: 'Stres akibat buli bisa memicu sakit kepala, sakit perut, kelelahan, dan gangguan tidur (insomnia/mimpi buruk).' },
                    { icon: '🚪', title: 'Dampak Sosial', desc: 'Menarik diri dari pertemanan, merasa terisolasi, dan takut untuk membuka HP atau aktif di media sosial.' },
                    { icon: '📉', title: 'Dampak Akademis', desc: 'Fokus belajar terganggu, malas pergi ke sekolah, dan nilai-nilai pelajaran bisa menurun drastis.' },
                  ].map((dampak, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-rose-100/60 shadow-sm flex gap-3 items-start text-left">
                      <span className="text-2xl shrink-0">{dampak.icon}</span>
                      <div>
                        <h5 className="text-xs font-bold text-rose-900">{dampak.title}</h5>
                        <p className="text-[10px] text-slate-550 mt-1 leading-relaxed font-semibold">{dampak.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'C' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold">C</span>
                  Tiga Peran di Panggung Digital
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Saat terjadi ejek-ejekan atau cyberbullying di internet, biasanya ada 3 kelompok orang. Coba perhatikan baik-baik peran ini:
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Memahami peran kita sangat penting agar kita tidak terjebak menjadi pendukung tindakan kejahatan secara tidak sadar. Mari kita lihat pembagian kelompok berikut:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: ' Si Pelaku (Pembuat Masalah)', color: 'border-red-200 bg-red-50/20 text-red-900', desc: 'Orang yang mengetik komentar jahat, menyebarkan foto tanpa izin, atau mengajak memusuhi teman.' },
                  { title: ' Si Korban (Target Ejekan)', color: 'border-amber-200 bg-amber-50/20 text-amber-900', desc: 'Orang yang diejek. Ia merasa sedih, tidak percaya diri, dan bingung harus berbuat apa.' },
                  { title: ' Si Penonton (Bystander)', color: 'border-slate-200 bg-slate-50 text-slate-800', desc: 'Orang yang membaca grup atau melihat komentar jahat tapi diam saja karena takut ikut diejek, atau malah ikut-ikutan menertawakan.' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between ${item.color} text-left`}>
                    <span className="text-xs font-bold mb-2">{item.title}</span>
                    <p className="text-[10px] leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-pink-50/25 rounded-xl border border-pink-100 text-xs text-pink-900 leading-relaxed text-left">
                <strong>Bystander vs Upstander: Pilihan Ada di Ujung Jarimu!</strong>
                <p className="mt-1">
                  Kebanyakan orang di internet memilih menjadi <strong>Bystander (Penonton Pasif)</strong> karena takut atau merasa itu bukan urusan mereka. Namun, diamnya penonton justru membuat pelaku merasa tindakannya benar dan terus menindas korban!
                </p>
                <p className="mt-2">
                  Menjadi <strong>Upstander</strong> tidak berarti kita harus balas memarahi atau berkelahi dengan pelaku (hal itu justru akan memperluas konflik). Upstander yang cerdas mengambil tindakan secara aman, tenang, dan taktis untuk membela korban. Ketika pelaku melihat tidak ada yang menyukai komentarnya dan teman-teman lain justru mendukung korban, kekuatan bully-nya akan meredup dengan sendirinya.
                </p>
                <p className="mt-2">
                  Jadilah <strong>Upstander (Pahlawan Penolong)</strong>! Upstander adalah orang yang berani mengambil tindakan aman untuk membela korban dan menghentikan perundungan siber.
                </p>
              </div>
              <div className="my-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm flex justify-center bg-slate-50 max-h-72">
                <img src="/pahlawan_upstander.png" alt="Menjadi Pahlawan Digital (Upstander)" className="object-contain max-h-72 w-full" loading="lazy" decoding="async" />
              </div>
              <div className="p-5 rounded-2xl border border-pink-100 bg-pink-50/10 space-y-4 text-left">
                <h4 className="text-xs font-bold text-pink-855 uppercase tracking-wider flex items-center gap-1.5">Jurus Penyelamat: Apa yang Harus Dilakukan Jika Terkena Cyberbullying?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jurusPenyelamat.map((jurus, idx) => {
                    const isRevealed = selectedJurusPenyelamat === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedJurusPenyelamat(isRevealed ? null : idx)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${isRevealed
                          ? 'border-sky-300 bg-sky-50/20 ring-2 ring-sky-500 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-sky-50/10 hover:border-sky-200'
                          }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="text-xs font-bold text-sky-900 block">{jurus.jurus}</span>
                            <span className="text-[10px] text-slate-555 font-semibold mt-0.5 block">{jurus.misi}</span>
                          </div>
                          <span className="text-xs">
                            {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        </div>
                        {isRevealed && (
                          <p className="text-[10px] text-slate-655 mt-3 border-t border-sky-100/50 pt-2 font-semibold leading-relaxed">
                            {jurus.penjelasan}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-pink-100 bg-pink-50/10 space-y-4 text-left">
                <h4 className="text-xs font-bold text-pink-855 uppercase tracking-wider flex items-center gap-1.5">Jurus Pahlawan: Apa yang Harus Dilakukan Jika Melihat Teman Dirundung?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jurusPahlawan.map((jurus, idx) => {
                    const isRevealed = selectedJurusPahlawan === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedJurusPahlawan(isRevealed ? null : idx)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${isRevealed
                          ? 'border-pink-300 bg-pink-50/20 ring-2 ring-pink-500 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-pink-50/10 hover:border-pink-200'
                          }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="text-xs font-bold text-pink-900 block">{jurus.jurus}</span>
                            <span className="text-[10px] text-slate-555 font-semibold mt-0.5 block">{jurus.misi}</span>
                          </div>
                          <span className="text-xs">
                            {isRevealed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        </div>
                        {isRevealed && (
                          <p className="text-[10px] text-slate-655 mt-3 border-t border-pink-100/50 pt-2 font-semibold leading-relaxed">
                            {jurus.penjelasan}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Saluran Pengaduan Resmi Indonesia & TPPK Sekolah */}
              <div className="mt-6 border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  📞 Jalur Melapor & Pengaduan Resmi
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Jika kamu atau temanmu mengalami perundungan siber (cyberbullying) yang parah, jangan diam saja! Laporkan secara aman ke pihak sekolah atau saluran pengaduan resmi pemerintah berikut:
                </p>

                {/* Grid for TPPK and Official Channels */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* TPPK Sekolah */}
                  <div className="p-4 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50/30 to-rose-50/20 flex flex-col justify-between text-left">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-lg mb-2">🏫</div>
                      <h5 className="text-[11px] font-black text-pink-900 leading-tight">TPPK (Tim Pencegahan & Penanganan Kekerasan) Sekolah</h5>
                      <p className="text-[10px] text-pink-850 font-semibold mt-1.5 leading-relaxed">
                        Tim resmi di sekolah yang dibentuk untuk mencegah dan menangani kekerasan serta perundungan. TPPK bertugas memberikan perlindungan, menerima pengaduan, dan menindaklanjuti kasus dengan aman. Kamu bisa melapor langsung ke Guru Wali Kelas, Guru BK, atau staf sekolah anggota TPPK secara rahasia dan terlindungi.
                      </p>
                    </div>
                  </div>

                  {/* WA Aduan Konten */}
                  <a
                    href="https://wa.me/628119224545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-green-200 bg-white hover:bg-green-50 transition-all hover:shadow-md flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">💬</div>
                      <h5 className="text-[11px] font-black text-green-900 leading-tight">WhatsApp Aduan Konten KOMDIGI</h5>
                      <p className="text-[10px] text-green-700 font-semibold mt-1.5 leading-relaxed">
                        Laporkan konten internet negatif, pesan ancaman, pornografi, atau judi online secara langsung melalui nomor resmi WhatsApp pemerintah:
                      </p>
                    </div>
                    <span className="text-[10px] text-green-600 font-mono font-bold mt-2 inline-block">+62 811 9224 545</span>
                  </a>

                  {/* Web Aduan Konten */}
                  <a
                    href="https://aduankonten.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-indigo-200 bg-white hover:bg-indigo-50 transition-all hover:shadow-md flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">🌐</div>
                      <h5 className="text-[11px] font-black text-indigo-900 leading-tight">Situs Web Aduan Konten KOMDIGI</h5>
                      <p className="text-[10px] text-indigo-700 font-semibold mt-1.5 leading-relaxed">
                        Situs resmi Kementerian Komunikasi dan Digital RI untuk melaporkan berbagai materi siber negatif atau berbahaya.
                      </p>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold mt-2 inline-block">aduankonten.id</span>
                  </a>

                  {/* KPAI */}
                  <a
                    href="https://pengaduan.kpai.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-amber-200 bg-white hover:bg-amber-50 transition-all hover:shadow-md flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg mb-2 group-hover:scale-110 transition-transform">🏛️</div>
                      <h5 className="text-[11px] font-black text-amber-900 leading-tight">Pengaduan Online KPAI</h5>
                      <p className="text-[10px] text-amber-700 font-semibold mt-1.5 leading-relaxed">
                        Saluran Komisi Perlindungan Anak Indonesia untuk mengadukan segala jenis pelanggaran hak anak, perundungan parah, atau kekerasan di dunia maya maupun nyata.
                      </p>
                    </div>
                    <span className="text-[10px] text-amber-600 font-semibold mt-2 inline-block">pengaduan.kpai.go.id</span>
                  </a>
                </div>

                <p className="text-[10px] text-slate-500 font-bold text-center italic mt-2">
                  💡 Melapor bukan berarti mengadu — itu artinya kamu melindungi diri sendiri dan melindungi teman-temanmu agar tetap aman!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'D' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold">D</span>
                  Simulasi: Apa yang Harus Kamu Lakukan?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Mari kita berlatih mengambil keputusan cerdas di dunia maya! Ketuk tindakan pahlawan untuk meredam monster digital:
                </p>
              </div>

              {/* Tips Tes Perasaan (Peleburan materi Tab C yang disederhanakan) */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-255 text-slate-700 leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs sm:text-sm mb-1.5">
                  <span>🧠</span> Tips Pahlawan: Lakukan "Tes Perasaan" Sebelum Bertindak
                </div>
                <p className="text-xs font-semibold leading-relaxed text-slate-600">
                  Ingat aturan emas ini: <strong>Bercanda yang baik itu membuat SEMUA ORANG tertawa</strong>. Jika ada satu orang saja yang merasa sedih, malu, atau takut, itu namanya bukan bercanda, melainkan buli!
                </p>
                <div className="mt-2.5 p-3 bg-white/80 rounded-xl border border-emerald-100 space-y-1.5">
                  <p className="text-xs font-bold text-emerald-800">Tiga Pertanyaan Ajaib Sebelum Menekan Tombol "Kirim":</p>
                  <ul className="space-y-1 text-xs text-slate-600 pl-1 list-decimal list-inside font-semibold">
                    <li>Apakah kata-kataku ini benar dan sopan?</li>
                    <li>Apakah teman yang membacanya akan merasa nyaman?</li>
                    <li>Jika kata-kata ini dikirimkan kepadaku, apakah aku akan marah?</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {simulationCases.map((scenario, idx) => {
                  const answer = simAnswers[idx];
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">Kasus {idx + 1}:</h4>
                      <p className="text-xs text-slate-600 font-semibold">{scenario.situasi}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() => setSimAnswers({ ...simAnswers, [idx]: 'jahat' })}
                          className={`p-3 rounded-xl text-left border transition-all text-xs font-mono font-bold ${answer === 'jahat'
                            ? 'border-red-300 bg-red-100 text-red-900 shadow-sm'
                            : 'bg-white hover:bg-red-50/20 text-red-700 border-red-100'
                            }`}
                        >
                          Tindakan Jahat:
                          <p className="text-[10px] font-sans font-semibold mt-1 italic text-slate-600">{scenario.jahat}</p>
                        </button>
                        <button
                          onClick={() => setSimAnswers({ ...simAnswers, [idx]: 'pahlawan' })}
                          className={`p-3 rounded-xl text-left border transition-all text-xs font-bold ${answer === 'pahlawan'
                            ? 'border-emerald-300 bg-emerald-100 text-emerald-900 shadow-sm'
                            : 'bg-white hover:bg-emerald-50/20 text-emerald-700 border-emerald-100'
                            }`}
                        >
                          Tindakan Pahlawan:
                          <p className="text-[10px] font-semibold mt-1 italic text-slate-600">{scenario.pahlawan}</p>
                        </button>
                      </div>
                      {answer && (
                        <div
                          className={`p-3 rounded-xl text-[10px] font-semibold border leading-relaxed ${answer === 'pahlawan'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                        >
                          {answer === 'pahlawan' ? scenario.feedbackPahlawan : scenario.feedbackJahat}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'E' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs font-bold">E</span>
                  Menonton dan Refleksi: Bersama Atasi Perundungan
                </h3>
                <p className="text-xs sm:text-sm text-slate-605 leading-relaxed">
                  Sekarang, mari kita tonton video edukasi dari <strong>Cerdas Berkarakter Kemdikbud RI</strong> yang berjudul <strong>"Terkirim"</strong>. Video ini menceritakan kisah Rani yang mengalami perundungan siber (<i>cyberbullying</i>) akibat sebuah foto yang disebarkan tanpa izin, serta bagaimana peran teman-temannya di sekolah dalam menghadapi situasi tersebut.
                </p>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50 my-4">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/UMudP8seYNM?rel=0"
                  title="Bersama Atasi Perundungan: Terkirim"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 rounded-2xl border border-pink-100 bg-pink-50/10 space-y-3">
                <h4 className="text-xs font-bold text-pink-900 flex items-center gap-1.5">📝 Aktivitas Pembelajaran: Refleksi Video</h4>
                <p className="text-xs text-slate-600 leading-normal">
                  Setelah menonton video di atas, apa saja hal penting (pelajaran) yang kamu dapatkan? Bagaimana perasaanmu melihat kisah Rani, dan apa yang akan kamu lakukan jika berada di posisi teman-teman Rani?
                </p>
                <textarea
                  rows={4}
                  value={reflection}
                  onChange={(e) => handleReflectionChange(e.target.value)}
                  placeholder="Tuliskan pendapat dan refleksi belajarmu di sini..."
                  className="w-full px-4 py-3 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all font-medium leading-relaxed bg-white"
                />
                {reflectionSaving ? (
                  <p className="text-[10px] text-pink-500 italic flex items-center gap-1">
                    <span>🔄</span> Menyimpan draf refleksi...
                  </p>
                ) : reflection.trim() === '' ? null : (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span>✅</span> Draf refleksi tersimpan otomatis!
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Digi footer */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/35 p-4 shadow-sm text-left flex items-start gap-3">
        <div>
          <h4 className="text-xs font-bold text-amber-900">Pesan Digi:</h4>
          <p className="text-[11px] sm:text-xs text-amber-800 italic mt-0.5 leading-relaxed">
            “Di dunia digital, kata-kata juga bisa membuat orang lain senang atau sedih. Jadi, sebelum mengirim pesan, pilih kata yang baik, sopan, dan tidak menyakiti.”
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

interface JanjiJariKelingkingDigitalProps {
  onSave?: (key: string, value: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function JanjiJariKelingkingDigital({
  onSave,
  activityAnswers = {},
  isTeacherPreview = false,
}: JanjiJariKelingkingDigitalProps) {
  const signedPledge = activityAnswers?.['digital-pledge-signed'];
  const [pledgeName, setPledgeName] = useState<string>(signedPledge?.name || '');
  const [isPledged, setIsPledged] = useState<boolean>(!!signedPledge);
  const [sigImage, setSigImage] = useState<string>(signedPledge?.signature || '');
  const [checkedCodes, setCheckedCodes] = useState<boolean[]>(
    signedPledge?.checkedCodes || [false, false, false, false, false]
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const nextSigned = activityAnswers?.['digital-pledge-signed'];
    if (nextSigned) {
      setPledgeName(nextSigned.name || '');
      setCheckedCodes(nextSigned.checkedCodes || [true, true, true, true, true]);
      setSigImage(nextSigned.signature || '');
      setIsPledged(true);
    } else {
      setPledgeName('');
      setCheckedCodes([false, false, false, false, false]);
      setSigImage('');
      setIsPledged(false);
      setHasDrawn(false);
    }
  }, [activityAnswers]);

  // Canvas Drawing Logic
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#db2777'; // pink-600
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) {
      alert('Silakan isi nama lengkapmu terlebih dahulu.');
      return;
    }
    if (checkedCodes.some((c) => !c)) {
      alert('Silakan berikan ceklis pada kelima Kode Etik Panca Mabar Aman terlebih dahulu.');
      return;
    }
    if (!hasDrawn) {
      alert('Silakan buat tanda tanganmu secara manual pada kotak gambar yang disediakan.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const sigDataUrl = canvas.toDataURL();
    setSigImage(sigDataUrl);
    setIsPledged(true);

    canvasConfetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.8 },
    });

    if (onSave && !isTeacherPreview) {
      onSave('digital-pledge-signed', {
        name: pledgeName,
        checkedCodes,
        signature: sigDataUrl,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="mt-8 space-y-4">
      {isPledged ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 bg-[#fdfaf2] rounded-3xl border-8 border-double border-amber-300 shadow-xl text-center space-y-6 relative overflow-hidden max-w-2xl mx-auto font-sans"
        >
          {/* Decorative frame corner badges */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>

          {/* Certificate Badge Seal */}
          <div className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-3xl shadow-md border-4 border-amber-200">
            🎖️
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold tracking-wider text-amber-900">
              PIAGAM KOMITMEN SAHABAT DIGITAL CERDAS
            </h3>
            <p className="text-[9px] sm:text-[10px] text-amber-700 font-mono tracking-widest uppercase font-bold">
              DEKLARASI ETIKA DIGITAL & JANJI JARI KELINGKING
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 italic">Dengan bangga diberikan kepada:</p>
            <p className="text-lg sm:text-xl font-serif font-black italic text-pink-600 border-b border-dashed border-amber-300 pb-1 max-w-md mx-auto">
              {pledgeName}
            </p>
          </div>

          {/* 5 Kode Etik Panca Mabar */}
          <div className="bg-white/90 rounded-2xl p-4 text-left border border-amber-100 space-y-2.5 max-w-lg mx-auto shadow-inner">
            <p className="text-[10px] sm:text-[11px] font-bold text-amber-900 border-b border-amber-100 pb-1 flex items-center gap-1.5">
              📜 LIMA KODE ETIK PANCA MABAR AMAN:
            </p>
            <ol className="list-decimal list-inside text-[9px] sm:text-[10px] text-slate-700 space-y-1.5 leading-relaxed font-medium">
              <li><strong>Komunikasi Tanpa Toxic</strong>: Selalu menggunakan bahasa sopan dan positif di chat & suara. [✓]</li>
              <li><strong>Anti Perundungan</strong>: Suportif, tidak mengejek pemula, dan tidak memprovokasi teman. [✓]</li>
              <li><strong>Menjaga Privasi</strong>: Melindungi sandi, nomor HP, dan data pribadi sendiri & orang lain. [✓]</li>
              <li><strong>Bermain Jujur (Fair Play)</strong>: Sportif, menolak cheat, joki, dan kecurangan. [✓]</li>
              <li><strong>Seimbang & Sadar Waktu</strong>: Membatasi waktu bermain agar tidak mengganggu belajar & istirahat. [✓]</li>
            </ol>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-700 italic leading-relaxed px-4 max-w-md mx-auto">
            "Saya berjanji mulai hari ini akan menjaga jari kelingking digital saya untuk selalu menjadi warga digital yang cerdas, sopan, jujur, dan bertanggung jawab!"
          </p>

          {/* Signature section */}
          <div className="flex justify-around items-center pt-4 border-t border-amber-200 max-w-lg mx-auto text-left">
            <div className="space-y-1 text-center">
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono">Ditandatangani secara digital pada:</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-650 font-mono">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="space-y-1 text-center flex flex-col items-center">
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono">Tanda Tangan Murid:</p>
              {sigImage && (
                <img
                  src={sigImage}
                  alt="Tanda Tangan"
                  className="max-h-12 object-contain mix-blend-multiply"
                />
              )}
              <p className="text-[9px] font-serif font-black italic text-pink-500 tracking-wider">
                {pledgeName}
              </p>
            </div>
          </div>

          {/* Print/Reset buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold hover:shadow-md transition-shadow flex items-center gap-1.5"
            >
              🖨️ Cetak / Simpan PDF
            </button>
            <button
              onClick={() => {
                setIsPledged(false);
                setPledgeName('');
                setSigImage('');
                setCheckedCodes([false, false, false, false, false]);
                setHasDrawn(false);
                if (onSave) {
                  onSave('digital-pledge-signed', null);
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-[9px] font-bold transition-colors"
            >
              Ubah Nama / Reset
            </button>
          </div>
        </motion.div>
      ) : (
        <form
          onSubmit={handlePledgeSubmit}
          className="p-6 bg-white rounded-3xl border border-pink-100 shadow-sm text-left max-w-xl mx-auto space-y-5"
        >
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              ✍️ Deklarasi Piagam & Janji Jari Kelingking Digital
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Silakan selesaikan 3 langkah komitmen di bawah ini untuk mendapatkan Piagam Komitmen Sahabat Digital Cerdas!
            </p>
          </div>

          {/* Step 1: Checkbox */}
          <div className="space-y-3 text-xs text-slate-700">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-[10px]">1</span>
              Ceklis 5 Kode Etik Panca Mabar Aman di bawah:
            </p>
            <div className="space-y-2">
              {[
                'Komunikasi Tanpa Toxic: Menggunakan bahasa sopan dan menolak makian/hinaan.',
                'Anti Perundungan (Zero Bullying): Suportif, tidak mengejek pemula, dan tidak memprovokasi.',
                'Menjaga Privasi: Melindungi sandi, nomor HP, dan data pribadi sendiri & orang lain.',
                'Bermain Jujur (Fair Play): Sportif, menolak cheat, joki, dan kecurangan.',
                'Seimbang & Sadar Waktu: Membatasi waktu bermain demi belajar dan istirahat.'
              ].map((text, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-pink-50/20 rounded-xl cursor-pointer transition-colors border border-slate-100/50">
                  <input
                    type="checkbox"
                    checked={checkedCodes[idx]}
                    onChange={(e) => {
                      const next = [...checkedCodes];
                      next[idx] = e.target.checked;
                      setCheckedCodes(next);
                    }}
                    className="mt-0.5 h-4.5 w-4.5 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                  />
                  <span className="font-semibold text-[11px] leading-relaxed text-slate-700">{idx + 1}. {text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Name Input */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-[10px]">2</span>
              Masukkan Nama Lengkapmu:
            </p>
            <input
              type="text"
              required
              value={pledgeName}
              onChange={(e) => setPledgeName(e.target.value)}
              placeholder="Ketik namamu di sini..."
              className="w-full px-4 py-2.5 rounded-xl text-xs border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all font-semibold"
            />
          </div>

          {/* Step 3: Canvas drawing pad */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-[10px]">3</span>
                Gambar Tanda Tanganmu secara Manual di bawah:
              </p>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-[10px] text-pink-500 font-bold hover:underline"
              >
                Clear / Bersihkan Tanda Tangan
              </button>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-2 flex justify-center">
              <canvas
                ref={canvasRef}
                width={320}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-white border border-slate-200 rounded-lg cursor-crosshair max-w-full touch-none shadow-inner"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-black hover:shadow-md transition-shadow active:scale-95 text-center flex items-center justify-center gap-2"
            >
              📜 Tanda Tangani & Terbitkan Piagam Komitmen
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface YukBelajarTopik1Props {
  onActivitySave?: (key: string, val: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik1({
  onActivitySave,
  activityAnswers = {},
  isTeacherPreview = false,
}: YukBelajarTopik1Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);

  // Tab A state
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);

  // Tab B states (Hak & Tanggung Jawab)
  const [selectedHak, setSelectedHak] = useState<number | null>(null);
  const [selectedTanggungJawab, setSelectedTanggungJawab] = useState<number | null>(null);

  // Tab C states
  const [tabBAnswer, setTabBAnswer] = useState<string>('');
  const [tabBSuccess, setTabBSuccess] = useState<boolean>(false);

  // Tab D states (Matching Activity)
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

  // Tab E states
  const [activeRisk, setActiveRisk] = useState<number | null>(null);

  const saveAnswers = (key: string, data: any) => {
    if (onActivitySave && !isTeacherPreview) {
      onActivitySave(key, data);
    }
  };

  const handleDeviceClick = (idx: number) => {
    setSelectedDevice(idx);
    saveAnswers('t1-tab-a-device', idx);
  };

  const handleTabBQuiz = (ans: string) => {
    setTabBAnswer(ans);
    saveAnswers('t1-tab-b-quiz', ans);
    if (ans === 'Browser') {
      setTabBSuccess(true);
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      setTabBSuccess(false);
    }
  };

  const handleActivityClick = (idx: number) => {
    setSelectedActivity(selectedActivity === idx ? null : idx);
    saveAnswers('t1-tab-c-activity', idx);
  };

  const handleRiskClick = (idx: number) => {
    setActiveRisk(activeRisk === idx ? null : idx);
    saveAnswers('t1-tab-d-risk', idx);
  };

  // Sync state
  useEffect(() => {
    if (activityAnswers['t1-tab-a-device'] !== undefined) {
      setSelectedDevice(activityAnswers['t1-tab-a-device']);
    }
    if (activityAnswers['t1-tab-b-quiz'] !== undefined) {
      const ans = activityAnswers['t1-tab-b-quiz'];
      setTabBAnswer(ans);
      setTabBSuccess(ans === 'Browser');
    }
    if (activityAnswers['t1-tab-b-hak'] !== undefined) {
      setSelectedHak(activityAnswers['t1-tab-b-hak']);
    }
    if (activityAnswers['t1-tab-b-tanggungjawab'] !== undefined) {
      setSelectedTanggungJawab(activityAnswers['t1-tab-b-tanggungjawab']);
    }
    if (activityAnswers['t1-tab-c-activity'] !== undefined) {
      setSelectedActivity(activityAnswers['t1-tab-c-activity']);
    }
    if (activityAnswers['t1-tab-d-risk'] !== undefined) {
      setActiveRisk(activityAnswers['t1-tab-d-risk']);
    }
  }, [activityAnswers]);

  const tabs = [
    { id: 'A', label: 'A. Perangkat Digital', icon: '💻' },
    { id: 'B', label: 'B. Hak & Tanggung Jawab', icon: '⚖️' },
    { id: 'C', label: 'C. Rahasia Internet', icon: '🌐' },
    { id: 'D', label: 'D. Manfaat & Risiko', icon: '✨' },
    { id: 'E', label: 'E. Batasan Usia & Layar', icon: '⏱️' },
  ] as const;

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: selectedDevice !== null || visitedTabs.includes('A'),
    B: (selectedHak !== null && selectedTanggungJawab !== null) || visitedTabs.includes('B'),
    C: tabBSuccess,
    D: (selectedActivity !== null && activeRisk !== null) || visitedTabs.includes('D'),
    E: visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  const haks = [
    { title: '🎁 Hak Mendapatkan Info Menarik', desc: 'Kamu berhak mencari dan membaca info seru untuk belajar atau melakukan hobimu di internet.' },
    { title: '🛡️ Hak untuk Merasa Aman', desc: 'Kamu berhak merasa nyaman saat online. Tidak boleh ada yang mengganggu, menakut-nakuti, atau menipumu!' },
    { title: '💬 Hak Berkreasi & Berpendapat', desc: 'Kamu bebas menggambar, menulis cerita, atau membagikan ide baikmu secara online.' },
    { title: '🔒 Hak Menjaga Rahasia Pribadi', desc: 'Kamu berhak menyembunyikan info pribadimu (seperti alamat atau nomor HP) agar tidak disalahgunakan orang lain.' },
  ];

  const tanggungJawabs = [
    { title: '🤝 Menghormati Teman Online', desc: 'Sama seperti di sekolah, kita harus selalu sopan di internet. Jangan mengejek, membuli, atau membuat teman sedih.' },
    { title: '🔑 Menjaga Rahasia Teman', desc: 'Jangan pernah membagikan foto, nama, atau cerita pribadi temanmu ke internet tanpa izin mereka.' },
    { title: '🤔 Berpikir Sebelum Klik', desc: 'Apapun yang kamu kirim di internet akan meninggalkan jejak yang susah dihapus. Jadi, pastikan kirimanmu selalu baik, ya!' },
    { title: '📢 Berani Bilang dan Melapor', desc: 'Kalau kamu melihat video seram atau ada orang asing mencurigakan, segera beritahu guru atau orang tua mu. Jangan dipendam sendiri!' },
  ];

  const devices = [
    { name: '💻 Chromebook / Laptop', desc: 'Dipakai untuk mengetik cerita, belajar online, dan mencari info tugas sekolah. Tulisanmu tersimpan aman tanpa perlu kertas!' },
    { name: '📱 HP (Handphone)', desc: 'Bisa mengirim pesan suara, telepon video dengan keluarga, atau mengirim stiker lucu ke teman lewat jaringan internet.' },
    { name: '📺 Smart TV (TV Pintar)', desc: 'Bisa menampilkan video animasi pelajaran atau petualangan sains seru dengan layar lebar dan suara jelas.' },
    { name: '⌚ Smartwatch (Jam Pintar)', desc: 'Jam tangan digital keren yang bisa mengukur detak jantungmu, menghitung langkah kaki, dan terhubung ke HP.' },
    { name: '📹 Proyektor & Kamera', desc: 'Dipakai untuk mengambil foto hewan peliharaanmu atau menampilkan tugas sekolah di depan kelas agar terlihat besar.' }
  ];

  const activities = [
    { act: 'Mencari resep kue atau masakan bersama Ibu ', cat: 'Mencari Informasi', icon: '🔎', desc: 'Bisa mencari informasi apa saja dengan cepat di internet untuk membantu kegiatan sehari-hari.' },
    { act: 'Panggilan video (video call) dengan keluarga yang jauh ', cat: 'Berkomunikasi', icon: '📹', desc: 'Bisa melepas rindu dengan keluarga atau teman yang tinggal jauh secara tatap muka virtual.' },
    { act: 'Mengerjakan tugas kelompok bersama teman di Google Docs ', cat: 'Bekerja Sama', icon: '🤝', desc: 'Bisa belajar dan membuat tugas sekolah bersama-sama walaupun masing-masing berada di rumah.' },
    { act: 'Membaca artikel bintang-bintang di luar angkasa ', cat: 'Belajar', icon: '📚', desc: 'Bisa menambah pengetahuan tentang sains, sejarah, atau hobi menarik lewat situs pendidikan.' },
    { act: 'Menggambar poster digital di Chromebook ', cat: 'Membuat Karya', icon: '🎨', desc: 'Bisa menyalurkan kreativitas seni, menggambar, atau menulis cerita menggunakan aplikasi digital.' }
  ];

  const risks = [
    { title: '🛑 Penyebaran Data Pribadi', example: 'Ada game online atau orang asing yang meminta nama lengkap, alamat rumah, atau kata sandi HP-mu.', action: 'Langsung tutup gamenya! Jangan pernah memberikan data rahasiamu kepada siapa pun di internet.' },
    { title: '🎣 Tautan Palsu (Phishing)', example: 'Dapat pesan: "Selamat! Kamu menang HP gratis. Klik link ini untuk mengambil!"', action: 'Jangan diklik! Pesan itu bohong dan bisa mencuri datamu atau merusak HP-mu.' },
    { title: '🔞 Konten Tidak Sesuai Usia', example: 'Muncul video kasar, seram, atau tidak sopan secara tiba-tiba di layarmu.', action: 'Segera matikan layar! Laporkan ke guru atau orang tua agar dibantu menyaring konten aman.' },
    { title: '💔 Komentar Jahat (Bullying)', example: 'Teman sekelas diejek di grup WhatsApp, atau ada yang berkata kasar saat bermain game.', action: 'Jangan ikut mengejek! Tetaplah sopan, dukung temanmu, dan laporkan kejadiannya ke gurumu.' },
    { title: '📰 Berita Bohong (Hoaks)', example: 'Mendapat pesan heboh: "Besok sekolah libur karena ada meteor jatuh!"', action: 'Jangan langsung disebarkan! Cek kebenarannya dengan bertanya kepada orang tua atau gurumu.' },
    { title: '👀 Lupa Waktu & Leher Pegal', example: 'Bermain game sampai 3 jam tanpa henti hingga mata merah dan leher terasa sakit.', action: 'Gunakan aturan 20-20-20. Setiap 20 menit menatap layar, istirahatkan mata dengan melihat benda jauh selama 20 detik.' },
    { title: '📝 Mengakui Karya Orang Lain', example: 'Mengambil gambar dari Google lalu mengakuinya sebagai buatanmu sendiri.', action: 'Selalu jujur! Cantumkan link sumbernya jika meminjam gambar orang lain.' },
    { title: '⏰ Lupa Tugas Utama', example: 'Asyik menonton YouTube sampai lupa mengerjakan PR sekolah.', action: 'Atur alarm waktu bermain gawai. Ingat, belajar dan istirahat adalah yang paling utama!' }
  ];

  return (
    <StepWrapper stepNumber={5} title="Yuk, Belajar Bersama!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-primary-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-indigo-700 flex items-center gap-1.5">
            Petualangan Penjelajah Digital
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-indigo-600 rounded-full border border-indigo-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-indigo-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-primary-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Penjelajah Digital Cerdas! 🚀
          </motion.p>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 ${isActive
                ? 'bg-gradient-to-r from-indigo-500 to-primary-500 text-white shadow-md transform scale-105'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === 'A' && (
          <motion.div
            key="tab-a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Text Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-primary-50 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm">
              <h3 className="font-display font-black text-indigo-900 text-lg sm:text-xl mb-3">💻 Ayo, Temukan Gawai di Sekitarmu!</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Coba tengok sekelilingmu saat ini! Apakah kamu melihat handphone (HP), komputer, laptop, Chromebook, TV pintar, jam tangan pintar, atau proyektor? Benda-benda canggih ini disebut <strong>perangkat digital</strong> atau gawai!
              </p>
            </div>

            {/* Illustration & Explanation Columns */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <img
                  src="/perangkat_digital_kelas.png"
                  alt="Ilustrasi Perangkat Digital di Kelas"
                  className="rounded-3xl shadow-md border border-indigo-100 max-h-80 w-full object-contain bg-white p-4"
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-between gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-2">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">Apa itu Perangkat Digital?</span>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed">
                    Perangkat digital adalah alat elektronik canggih yang bisa membantu kita belajar, bermain, dan mencari tahu banyak hal menarik. Hebatnya lagi, sebagian besar alat ini bisa terhubung ke internet!
                  </p>
                </div>
                <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-100 flex items-start gap-3">
                  <div className="text-2xl">✨</div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-bold">
                    Ketika kita menggunakan perangkat digital untuk belajar, berkomunikasi, mencari informasi, bermain game, atau membuat poster, itu artinya kita sedang masuk dan hidup di dalam <strong>Dunia Digital</strong>!
                  </p>
                </div>
              </div>
            </div>

            {/* Devices grid */}
            <div className="space-y-4">
              <h4 className="font-display font-black text-gray-800 text-sm sm:text-base">👇 Ketuk perangkat digital di bawah untuk melihat kegunaannya:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {devices.map((dev, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleDeviceClick(idx)}
                    className={`p-5 sm:p-6 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col gap-3 ${selectedDevice === idx
                      ? 'bg-indigo-50 border-indigo-300 ring-4 ring-indigo-100 shadow-md transform scale-102'
                      : 'bg-white border-gray-150 shadow-sm hover:border-indigo-300 hover:shadow-md'
                      }`}
                  >
                    <h5 className="font-display font-black text-indigo-950 text-xs sm:text-sm">{dev.name}</h5>
                    <AnimatePresence>
                      {selectedDevice === idx && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-xs text-gray-600 leading-relaxed pt-3 border-t border-indigo-100/60"
                        >
                          {dev.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'B' && (
          <motion.div
            key="tab-b"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Text Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
              <h3 className="font-display font-black text-purple-900 text-lg sm:text-xl mb-3">⚖️ Hak dan Tanggung Jawabmu di Dunia Digital</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Saat kamu masuk ke dunia digital, kamu memiliki <strong>Hak</strong> (hal-hal baik yang boleh kamu dapatkan) dan <strong>Tanggung Jawab</strong> (tugas penting yang harus kamu lakukan). Keduanya seperti dua sisi mata uang logam—tidak bisa dipisahkan!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hak Column */}
              <div className="space-y-5 bg-purple-50/20 p-6 rounded-3xl border border-purple-100/50">
                <h4 className="font-display font-black text-purple-800 text-sm sm:text-base flex items-center gap-2">
                  <span>🎁</span> Hakmu di Dunia Digital
                </h4>
                <p className="text-xs sm:text-sm text-purple-700 font-semibold italic">Ketuk setiap hak untuk melihat penjelasannya:</p>
                <div className="space-y-3">
                  {haks.map((hak, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedHak(idx); saveAnswers('t1-tab-b-hak', idx); }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedHak === idx
                        ? 'bg-purple-50 border-purple-300 ring-4 ring-purple-100 shadow-sm'
                        : 'bg-white border-gray-150 shadow-sm hover:border-purple-300'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-800">{hak.title}</span>
                        <span className="text-xs text-purple-500 font-black">🔎</span>
                      </div>
                      <AnimatePresence>
                        {selectedHak === idx && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-gray-650 leading-relaxed mt-3 pt-3 border-t border-purple-100"
                          >
                            {hak.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tanggung Jawab Column */}
              <div className="space-y-5 bg-indigo-50/20 p-6 rounded-3xl border border-indigo-100/50">
                <h4 className="font-display font-black text-indigo-800 text-sm sm:text-base flex items-center gap-2">
                  <span>🛡️</span> Tanggung Jawabmu
                </h4>
                <p className="text-xs sm:text-sm text-indigo-700 font-semibold italic">Ketuk setiap tanggung jawab untuk melihat penjelasannya:</p>
                <div className="space-y-3">
                  {tanggungJawabs.map((tj, idx) => (
                    <div
                      key={idx}
                      onClick={() => { setSelectedTanggungJawab(idx); saveAnswers('t1-tab-b-tanggungjawab', idx); }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedTanggungJawab === idx
                        ? 'bg-indigo-50 border-indigo-300 ring-4 ring-indigo-100 shadow-sm'
                        : 'bg-white border-gray-150 shadow-sm hover:border-indigo-300'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-bold text-gray-800">{tj.title}</span>
                        <span className="text-xs text-indigo-500 font-black">🔎</span>
                      </div>
                      <AnimatePresence>
                        {selectedTanggungJawab === idx && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-gray-655 leading-relaxed mt-3 pt-3 border-t border-indigo-100"
                          >
                            {tj.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'C' && (
          <motion.div
            key="tab-c"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Text Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm">
              <h3 className="font-display font-black text-blue-900 text-lg sm:text-xl mb-3">🌐 Jalan Tol Ajaib: Apa Itu Internet?</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Pernahkah kamu penasaran, <em>"Kok bisa ya video atau stiker dari tempat jauh muncul di layarku dalam waktu satu detik?"</em> Jawabannya adalah karena bantuan <strong>Internet</strong>! Internet itu seperti jalan tol raksasa yang tidak kelihatan, yang menghubungkan HP, laptop, dan komputer di seluruh dunia agar bisa saling berbagi informasi dengan sangat cepat.
              </p>
            </div>

            {/* Illustration & How it works */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <img
                  src="/cara_kerja_internet.png"
                  alt="Ilustrasi Cara Kerja Internet"
                  className="rounded-3xl shadow-md border border-blue-100 max-h-80 w-full object-contain bg-white p-4"
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-wider block border-b border-gray-100 pb-2">🚀 Cara Kerja Internet yang Ajaib:</span>
                  <ol className="text-xs sm:text-sm text-gray-650 list-decimal pl-5 space-y-2.5">
                    <li>Kamu menyalakan gawai (HP atau Chromebook).</li>
                    <li>Kamu menyambungkannya ke Wi-Fi atau paket data. Ini seperti membuka gerbang jalan tol internet.</li>
                    <li>Kamu membuka aplikasi penjelajah web (browser), seperti Google Chrome.</li>
                    <li>Kamu mengetik apa yang ingin kamu cari.</li>
                    <li>Pesanmu meluncur sangat cepat lewat jalan tol internet ke pusat penyimpanan data (server).</li>
                    <li>Server langsung mengirimkan informasi yang kamu minta kembali ke layarmu. Wuuush, cepat sekali!</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Internet Quiz Card */}
            <div className="bg-blue-50/60 p-6 sm:p-8 rounded-3xl border border-blue-100/70 shadow-sm space-y-5">
              <h4 className="font-display font-black text-blue-900 text-sm sm:text-base text-center">🕵️‍♂️ Kuis Detektif Internet</h4>
              <p className="text-xs sm:text-sm text-blue-800 text-center font-bold">Aplikasi di bawah ini, manakah yang bertugas sebagai pintu gerbang/browser untuk menjelajah internet?</p>

              <div className="flex flex-wrap justify-center gap-3">
                {['WhatsApp', 'Kamera', 'Google Chrome (Browser)', 'Buku Gambar'].map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleTabBQuiz(choice === 'Google Chrome (Browser)' ? 'Browser' : choice)}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black border transition-all duration-300 shadow-sm hover:scale-[1.02] ${(tabBAnswer === choice || (choice === 'Google Chrome (Browser)' && tabBAnswer === 'Browser'))
                      ? choice === 'Google Chrome (Browser)'
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200'
                        : 'bg-red-500 border-red-500 text-white shadow-red-200'
                      : 'bg-white border-slate-200 text-blue-855 hover:bg-blue-50'
                      }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {tabBAnswer && (
                <div className="mt-4 text-center animate-fade-in">
                  {tabBSuccess ? (
                    <p className="text-xs sm:text-sm font-black text-emerald-700">🎉 Benar! Google Chrome adalah browser (pintu gerbang) untuk menjelajah internet!</p>
                  ) : (
                    <p className="text-xs sm:text-sm font-black text-red-755">❌ Kurang tepat! Coba ingat-ingat, aplikasi apa yang kita pakai untuk membuka website?</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'D' && (
          <motion.div
            key="tab-d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Text Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
              <h3 className="font-display font-black text-emerald-950 text-lg sm:text-xl mb-3">🪙 Dua Sisi Koin: Manfaat & Risiko Dunia Digital</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Dunia digital itu seperti pisau dapur. Kalau digunakan dengan benar, pisau bisa membantu kita memotong buah yang manis. Tapi kalau dipakai sembarangan, pisau bisa melukai jari kita! Sama seperti internet, ada manfaat (sisi baik) dan risiko (sisi bahaya) yang harus kita ketahui.
              </p>
            </div>

            {/* Section 1: Manfaat Dunia Digital */}
            <div className="space-y-6">
              <h4 className="font-display font-black text-emerald-800 text-sm sm:text-base border-b border-emerald-100 pb-2 flex items-center gap-2">
                <span>🌟</span> Sisi Baik: Manfaat Dunia Digital
              </h4>
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                  <img
                    src="/manfaat_digital.png"
                    alt="Ilustrasi Manfaat Dunia Digital"
                    className="rounded-3xl shadow-md border border-emerald-100 max-h-80 w-full object-contain bg-white p-4"
                  />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-150 shadow-sm space-y-2">
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block">🔑 Ingat Kuncinya:</span>
                    <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-bold">
                      Teknologi digital akan sangat bermanfaat jika digunakan sesuai tujuan. Saat waktunya belajar, gunakan gawai untuk belajar. Saat waktunya tidur, matikan gawai agar tubuh dan matamu bisa beristirahat total!
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching Activities */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
                <h5 className="font-display font-black text-gray-800 text-sm sm:text-base">👇 Ketuk aktivitas digital di bawah untuk melihat penjelasan manfaatnya:</h5>
                <div className="space-y-3">
                  {activities.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleActivityClick(idx)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedActivity === idx
                        ? 'bg-emerald-50 border-emerald-300 ring-4 ring-emerald-100 shadow-sm'
                        : 'bg-slate-50 border-gray-200 hover:border-emerald-300'
                        }`}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.act}</span>
                        </span>
                        <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-black px-3 py-1 rounded-full shrink-0">
                          {item.cat}
                        </span>
                      </div>
                      <AnimatePresence>
                        {selectedActivity === idx && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs text-gray-655 leading-relaxed mt-3 pt-3 border-t border-emerald-100"
                          >
                            <strong>Kegunaan:</strong> {item.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Risiko Dunia Digital */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <h4 className="font-display font-black text-red-800 text-sm sm:text-base border-b border-red-100 pb-2 flex items-center gap-2">
                <span>⚠️</span> Sisi Bahaya: Risiko Dunia Digital
              </h4>
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                  <img
                    src="/risiko_digital_safety.png"
                    alt="Ilustrasi Keamanan dan Risiko Digital"
                    className="rounded-3xl shadow-md border border-red-100 max-h-80 w-full object-contain bg-white p-4"
                  />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-2">
                    <span className="text-xs font-black text-red-650 uppercase tracking-wider block">🛡️ Kunci Penjelajah Hebat:</span>
                    <p className="text-xs sm:text-sm text-gray-650 leading-relaxed">
                      Pengguna digital yang cerdas adalah mereka yang tahu cara memanfaatkan teknologi dengan aman, sopan, dan bertanggung jawab. Selalu berhenti dan berpikir sejenak sebelum kamu menekan layar (klik) atau mengirim sesuatu di internet!
                    </p>
                  </div>
                </div>
              </div>

              {/* Risks accordion grid */}
              <div className="space-y-4">
                <h5 className="font-display font-black text-gray-800 text-sm sm:text-base">👇 Ketuk setiap kartu risiko di bawah untuk mempelajari Sikap Cerdas:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {risks.map((risk, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleRiskClick(idx)}
                      className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 ${activeRisk === idx
                        ? 'bg-red-50 border-red-300 ring-4 ring-red-100 shadow-md scale-102'
                        : 'bg-white border-gray-150 shadow-sm hover:border-red-300 hover:shadow-md'
                        }`}
                    >
                      <div className="space-y-2">
                        <h6 className="font-display font-black text-red-955 text-xs sm:text-sm">{risk.title}</h6>
                        <p className="text-xs text-gray-500 italic leading-relaxed"><strong>Contoh:</strong> {risk.example}</p>
                      </div>
                      <AnimatePresence>
                        {activeRisk === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-xs leading-relaxed text-red-900 pt-3 border-t border-red-200 font-bold"
                          >
                            <strong>💡 Sikap Cerdas:</strong> {risk.action}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'E' && (
          <motion.div
            key="tab-e"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Text Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm">
              <h3 className="font-display font-black text-blue-900 text-lg sm:text-xl mb-3">⏱️ Batasan Usia & Durasi Layar yang Sehat</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Pemerintah Indonesia mengatur penggunaan dunia digital bagi anak melalui <strong>Peraturan Pemerintah (PP) Nomor 17 Tahun 2025 tentang Pelindungan Anak di Ruang Digital (PP TUNAS)</strong>. Mari kita pelajari batasannya!
              </p>
            </div>

            {/* PP TUNAS Classification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
                <div className="text-4xl">👶</div>
                <h4 className="font-display font-black text-blue-900 text-xs sm:text-sm">Di Bawah 13 Tahun</h4>
                <p className="text-xs text-gray-655 leading-relaxed font-semibold">
                  Hanya boleh memakai aplikasi ramah anak yang aman, serta wajib didampingi dan disetujui orang tua.
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
                <div className="text-4xl">👦</div>
                <h4 className="font-display font-black text-indigo-900 text-xs sm:text-sm">13 - 15 Tahun</h4>
                <p className="text-xs text-gray-655 leading-relaxed font-semibold">
                  Boleh memakai beberapa media sosial dengan pengawasan, izin, dan persetujuan dari orang tua.
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
                <div className="text-4xl">🧑</div>
                <h4 className="font-display font-black text-purple-900 text-xs sm:text-sm">16 - 17 Tahun</h4>
                <p className="text-xs text-gray-655 leading-relaxed font-semibold">
                  Boleh menggunakan media sosial umum secara mandiri, namun tetap harus dengan persetujuan orang tua.
                </p>
              </div>
            </div>

            {/* Screentime Table Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h4 className="font-display font-black text-gray-800 text-sm sm:text-base flex items-center gap-2">
                <span>📊</span> Durasi Menatap Layar (Screentime) Sehat
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm font-semibold">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-5 py-3.5">Usia Anak</th>
                      <th className="px-5 py-3.5">Rekomendasi Durasi Maksimal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-gray-600">
                    <tr>
                      <td className="px-5 py-4 font-bold text-blue-700">Di bawah 1 tahun</td>
                      <td className="px-5 py-4">Sangat tidak dianjurkan (kecuali telepon video keluarga secara singkat)</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-bold text-blue-700">1 - 2 tahun</td>
                      <td className="px-5 py-4">Maksimal 1 jam per hari (makin sedikit makin baik)</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-bold text-blue-700">2 - 5 tahun</td>
                      <td className="px-5 py-4">Maksimal 1 jam per hari, pilih tayangan edukatif & wajib didampingi</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-bold text-indigo-700">5 - 10 tahun</td>
                      <td className="px-5 py-4">Maksimal 2 jam per hari (di luar tugas sekolah), tidak boleh mengganggu tidur</td>
                    </tr>
                    <tr className="bg-indigo-50/20">
                      <td className="px-5 py-4 font-black text-indigo-900">10 - 17 tahun (Seperti Kamu!)</td>
                      <td className="px-5 py-4 font-bold text-indigo-950">Maksimal 2 jam per hari (di luar tugas sekolah) agar tubuh sehat & tetap aktif bermain di dunia nyata</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digi footer */}
      <div className="mt-10 bg-gradient-to-r from-indigo-500 to-primary-500 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex items-start gap-4">
        <div className="text-3xl shrink-0">🤖</div>
        <div>
          <h4 className="font-display font-black text-sm sm:text-base">Pesan Digi:</h4>
          <p className="text-xs sm:text-sm text-indigo-50 leading-relaxed font-bold mt-2">
            "Ingat ya teman-teman, dunia digital adalah tempat petualangan yang menyenangkan jika kamu menggunakannya dengan bijak. Selalu gunakan perangkat sesuai dengan tujuan belajarmu, matikan jika waktunya istirahat, dan jadilah Penjelajah Digital yang Cerdas!"
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* YukBelajarTopik2 — Interactive Material for Topic 2 */
/* ================================================================== */

interface YukBelajarTopik2Props {
  onActivitySave?: (key: string, val: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik2({
  onActivitySave,
  activityAnswers = {},
  isTeacherPreview = false,
}: YukBelajarTopik2Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);

  // Tab A states
  const [tabAAnswer, setTabAAnswer] = useState<string>('');
  const [tabASuccess, setTabASuccess] = useState<boolean>(false);

  // Tab B state
  const [activeSource, setActiveSource] = useState<number | null>(null);
  const [checklistAnswers, setChecklistAnswers] = useState<Record<number, boolean>>({});

  // Tab C states (Matching game)
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [matchingFinished, setMatchingFinished] = useState<boolean>(false);

  const saveAnswers = (key: string, data: any) => {
    if (onActivitySave && !isTeacherPreview) {
      onActivitySave(key, data);
    }
  };

  const handleTabAQuiz = (ans: string) => {
    setTabAAnswer(ans);
    saveAnswers('t2-tab-a-quiz', ans);
    if (ans === 'Menyesal') {
      setTabASuccess(true);
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      setTabASuccess(false);
    }
  };

  const handleSourceClick = (idx: number) => {
    setActiveSource(activeSource === idx ? null : idx);
    saveAnswers('t2-tab-b-source', idx);
  };

  const handleChecklistChange = (idx: number) => {
    const nextVal = !checklistAnswers[idx];
    const next = { ...checklistAnswers, [idx]: nextVal };
    setChecklistAnswers(next);
    saveAnswers(`t2-tabb-chk-${idx}`, nextVal);
  };

  const handleMatching = (stmtId: string, choice: string) => {
    const next = { ...matchingAnswers, [stmtId]: choice };
    setMatchingAnswers(next);
    saveAnswers('t2-tab-c-match', next);

    // Check if finished and correct
    const isCorrect1 = next['s1'] === 'Fakta';
    const isCorrect2 = next['s2'] === 'Opini';
    const isCorrect3 = next['s3'] === 'Hoaks';

    if (isCorrect1 && isCorrect2 && isCorrect3) {
      setMatchingFinished(true);
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 }
      });
    } else {
      setMatchingFinished(false);
    }
  };

  // Sync state
  useEffect(() => {
    if (activityAnswers['t2-tab-a-quiz'] !== undefined) {
      const ans = activityAnswers['t2-tab-a-quiz'];
      setTabAAnswer(ans);
      setTabASuccess(ans === 'Menyesal');
    }
    if (activityAnswers['t2-tab-b-source'] !== undefined) {
      setActiveSource(activityAnswers['t2-tab-b-source']);
    }

    // Sync checklist
    const checkSync: Record<number, boolean> = {};
    for (let i = 0; i < 5; i++) {
      if (activityAnswers[`t2-tabb-chk-${i}`] !== undefined) {
        checkSync[i] = !!activityAnswers[`t2-tabb-chk-${i}`];
      }
    }
    setChecklistAnswers(checkSync);

    if (activityAnswers['t2-tab-c-match'] !== undefined) {
      const savedMatch = activityAnswers['t2-tab-c-match'];
      setMatchingAnswers(savedMatch);
      setMatchingFinished(
        savedMatch['s1'] === 'Fakta' &&
        savedMatch['s2'] === 'Opini' &&
        savedMatch['s3'] === 'Hoaks'
      );
    }
  }, [activityAnswers]);

  const tabs = [
    { id: 'A', label: 'A. Misteri Hujan Permen', icon: '🍬' },
    { id: 'B', label: 'B. Info di Sekitar Kita', icon: '📰' },
    { id: 'C', label: 'C. 3 Jenis Informasi', icon: '🧩' },
    { id: 'D', label: 'D. Cara Cek Fakta', icon: '🔎' },
  ] as const;

  const goToTab = (id: 'A' | 'B' | 'C' | 'D') => {
    setActiveTab(id);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: tabASuccess,
    B: activeSource !== null || visitedTabs.includes('B'),
    C: matchingFinished,
    D: visitedTabs.includes('D'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;

  const infoSources = [
    { name: 'Buku Pelajaran ', desc: 'Berisi fakta ilmiah, pelajaran resmi, atau ensiklopedia yang sudah disunting oleh ahli sebelum diterbitkan.' },
    { name: 'Televisi & Berita Resmi ', desc: 'Menyiarkan liputan jurnalis profesional yang memverifikasi fakta dan meminta keterangan narasumber tepercaya.' },
    { name: 'Internet & Website Edukasi ', desc: 'Menyediakan miliaran data instan. Kamu harus menyaring dan memilih website bereputasi baik seperti situs sekolah atau portal sains resmi.' },
    { name: 'Media Sosial ', desc: 'Tempat berkumpulnya postingan, video viral, atau opini publik. Sangat rahasia dan berisiko jika tidak hati-hati, karena siapa saja bisa mengunggah apa saja!' },
    { name: 'Pesan Teman & Grup Chat ', desc: 'Pesan WhatsApp, Discord, atau obrolan game. Paling sering menjadi tempat penyebaran pesan berantai yang belum terbukti kebenarannya.' }
  ];

  const checklistQuestions = [
    'Siapa yang menyebarkan informasi itu?',
    'Dari mana sumber informasinya?',
    'Apakah informasinya lengkap?',
    'Apakah ada tanggal dan bukti yang jelas?',
    'Apakah informasi itu berasal dari narasumber yang dapat dipercaya?'
  ];

  return (
    <StepWrapper stepNumber={6} title="Yuk, Belajar Bersama!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1.5">
            Petualangan Detektif Berita
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-amber-600 rounded-full border border-amber-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-amber-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Welcome & Intro Card */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 mb-6 relative overflow-hidden shadow-sm">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/25 rounded-full text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
            <span>🕵️ Misi Detektif Digital</span>
          </div>
          <h2 className="font-display font-black text-amber-900 text-base sm:text-lg leading-snug">
            Selamat Datang di Akademi Detektif Fakta! 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed text-gray-700 font-medium">
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-100 shadow-2xs">
              Setiap hari, kita menerima banyak sekali pesan, berita, dan video di HP kita. Informasi sangat berguna untuk belajar dan tahu berita terbaru.
            </div>
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-100 shadow-2xs">
              Tapi ingat! <strong>Tidak semua yang ada di internet itu benar.</strong> Ada kabar bohong yang dibuat untuk menipu kita. Yuk, belajar membedakannya!
            </div>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/10 text-sm font-bold text-amber-950 text-center">
            Misi kita: Belajar membedakan berita BENAR (Fakta) dan berita BOHONG (Hoaks)!
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${isActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform scale-105'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-55/60 text-amber-800 hover:bg-amber-100 border border-amber-200/50'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-1 text-[11px] font-black ${isActive ? 'text-white' : 'text-emerald-600'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'A' && (
          <motion.div
            key="tab-a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Story Title & First Paragraph */}
            <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-100/60 space-y-4">
              <h3 className="font-display font-black text-amber-800 text-base sm:text-lg flex items-center gap-2">
                🍬 Cerita Detektif: Misteri "Hujan Permen"
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Suatu sore, sebuah pesan heboh menyebar di grup chat warga Kota Pelangi. Pesannya memakai huruf besar (kapital) semua dan banyak tanda seru. Bunyinya seperti ini:
              </p>

              {/* Styled WhatsApp Chat Bubble */}
              <div className="bg-[#efeae2] p-4 rounded-3xl border border-[#e1d9d1] relative overflow-hidden shadow-inner max-w-lg mx-auto my-3">
                <div className="bg-white/95 rounded-2xl p-4 shadow-sm border border-emerald-150 relative max-w-sm ml-auto text-left">
                  <div className="flex items-center gap-1 text-[9.5px] text-gray-400 font-bold mb-1.5 border-b border-gray-100 pb-1 italic">
                    🔄 Diteruskan berkali-kali
                  </div>
                  <p className="text-xs sm:text-sm font-black text-red-600 leading-relaxed uppercase tracking-wide">
                    "PENGUMUMAN PENTING!!! Besok pagi pukul 08.00 WIB, helikopter dari pabrik permen akan membagikan 1 ton cokelat gratis dari atas langit Kota Pelangi! Siapkan ember dan payung terbalik kalian! Sebarkan pesan ini ke 20 orang temanmu agar helikopternya jadi datang!!!"
                  </p>
                  <div className="text-right text-[9px] text-gray-450 mt-1.5 font-bold">
                    16:40
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                Membaca pesan itu, banyak anak girang sekali! Budi langsung menyiapkan dua ember besar. Siska sibuk mencari payung terbaliknya. Mereka juga langsung menyebarkan pesan itu ke semua grup teman bermain mereka.
              </p>
            </div>

            {/* Illustration Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-full md:w-1/2">
                <img
                  src="/hujan_permen_pelangi.png"
                  alt="Misteri Hujan Permen"
                  className="rounded-2xl shadow-sm border border-amber-100 max-h-72 mx-auto object-contain transition-transform duration-300 hover:scale-105"
                />
                <p className="text-[10px] text-center text-gray-450 mt-2 italic font-bold">
                  Budi dan Siska menunggu di lapangan dengan ember kosong
                </p>
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <div className="space-y-3.5 text-sm leading-relaxed text-gray-700 font-medium">
                  <h4 className="font-display font-black text-amber-700 text-base">Apa yang terjadi keesokan harinya?</h4>
                  <p>
                    Budi dan anak-anak lain sudah berdiri di lapangan sejak pagi. Mereka menunggu dari jam 8 sampai jam 10 siang.
                  </p>
                  <div className="font-bold text-red-800 bg-red-50 p-4 rounded-2xl border border-red-100 leading-relaxed">
                    Ternyata helikopter itu tidak pernah datang! Yang turun dari langit malah rintik air hujan sungguhan yang membuat mereka basah kuyup. 🌧️
                  </div>
                  <p>
                    Budi pulang dengan cemberut. Ibunya tersenyum dan berkata: <span className="italic text-gray-800 font-semibold">"Budi, sebelum repot-repot membawa ember, apakah kamu sudah mengecek siapa pengirim pesannya? Apakah ada pengumuman resmi? Itu namanya berita bohong (hoaks), Nak."</span> Budi menyesal karena langsung percaya begitu saja.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Story Quiz */}
            <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20 shadow-sm text-center">
              <h4 className="font-display font-extrabold text-amber-805 text-sm sm:text-base mb-1.5">🍭 Kuis Detektif Cerita</h4>
              <p className="text-xs sm:text-sm text-amber-700 mb-5 font-bold">Apa pelajaran penting yang didapatkan Budi dari kejadian di atas?</p>

              <div className="flex flex-col gap-3 max-w-lg mx-auto">
                {[
                  { key: 'Marah', text: ' Marah kepada ibunya karena tidak ikut membawa payung' },
                  { key: 'Menyesal', text: ' Menyesal karena langsung percaya pada pesan heboh yang tidak jelas sumbernya' },
                  { key: 'Lupa', text: ' Lupa menyimpan ember dan langsung mencari pesan berantai baru' }
                ].map((choice) => (
                  <button
                    key={choice.key}
                    onClick={() => handleTabAQuiz(choice.key)}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-300 cursor-pointer ${tabAAnswer === choice.key
                      ? choice.key === 'Menyesal'
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-md transform scale-[1.01]'
                        : 'bg-red-500 border-red-500 text-white shadow-md transform scale-[1.01]'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-amber-50/40 hover:border-amber-300 hover:shadow-sm'
                      }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {tabAAnswer && (
                <div className="mt-5">
                  {tabASuccess ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-100 border border-emerald-250 rounded-full text-emerald-800 text-xs sm:text-sm font-black shadow-2xs">
                      <span>🎉 Hebat! Kamu benar. Budi tersadar untuk tidak mudah percaya pesan yang tidak jelas asalnya.</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-100 border border-red-255 rounded-full text-red-800 text-xs sm:text-sm font-black shadow-2xs">
                      <span>❌ Jawaban kurang tepat. Yuk, coba baca kembali cerita penyesalan Budi di atas!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'B' && (
          <motion.div
            key="tab-b"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Intro Cards */}
            <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-100/60 space-y-4 text-sm text-gray-700 leading-relaxed font-medium">
              <h3 className="font-display font-black text-amber-800 text-base sm:text-lg flex items-center gap-2">
                📢 A. Informasi Ada di Sekitar Kita
              </h3>
              <p className="font-bold text-amber-700 text-base">
                Pelajaran penting: Jangan mudah terpancing! 💡
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
                  <span className="font-bold text-amber-850 block mb-1">🎁 Banyak Manfaat</span>
                  Informasi membantu kita mengetahui jadwal sekolah, berita terbaru, atau cara mengerjakan tugas. Informasi membuat kita tambah pintar!
                </div>
                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs">
                  <span className="font-bold text-amber-850 block mb-1">⚠️ Wajib Berhati-hati</span>
                  Karena internet sangat luas, siapa saja bisa membuat tulisan. Jadi ada berita yang benar, dan ada berita bohong yang sengaja disebarkan.
                </div>
              </div>
            </div>

            {/* Checklists for Detective Questions */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h4 className="font-display font-extrabold text-amber-800 text-xs uppercase tracking-wider flex items-center gap-2">
                🔍 5 Pertanyaan Penting Detektif Digital
              </h4>
              <p className="text-xs text-gray-500 font-semibold">
                Sebelum percaya pada pesan baru, centang dan pikirkan 5 hal ini:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {checklistQuestions.map((q, idx) => {
                  const isChecked = !!checklistAnswers[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleChecklistChange(idx)}
                      className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${isChecked
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-gray-150 text-gray-700 hover:border-amber-300'
                        }`}
                    >
                      <div className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 bg-white'
                        }`}>
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
                      </div>
                      <span className="text-xs sm:text-sm leading-snug">{q}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Grid of Sources */}
            <div className="space-y-3">
              <h4 className="font-display font-extrabold text-gray-800 text-sm sm:text-base">
                💡 Eksplorasi: Mari Kenali Sumber Informasi Kita
              </h4>
              <p className="text-xs text-gray-500 leading-normal font-semibold">
                Ketuk setiap jenis sumber informasi di bawah ini untuk melihat penjelasannya:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-medium">
                {infoSources.map((source, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSourceClick(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[90px] ${activeSource === idx
                      ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200/50 shadow-md transform scale-[1.01]'
                      : 'bg-white border-gray-200 shadow-2xs hover:border-amber-300 hover:bg-amber-50/10'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <h5 className="font-display font-bold text-gray-800 text-xs sm:text-sm">{source.name}</h5>
                      <span className="text-[10px] text-amber-500">{activeSource === idx ? '▲' : '▼'}</span>
                    </div>
                    <AnimatePresence>
                      {activeSource === idx && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-[11px] sm:text-xs leading-relaxed text-gray-600 mt-2.5 pt-2.5 border-t border-amber-100"
                        >
                          {source.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'C' && (
          <motion.div
            key="tab-c"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header Text */}
            <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-100/60 space-y-3 text-sm text-gray-700 leading-relaxed font-medium">
              <h3 className="font-display font-black text-amber-800 text-base sm:text-lg flex items-center gap-2">
                🧩 B. Mengenal 3 Jenis Informasi di Internet
              </h3>
              <p>
                Agar kamu tidak tertipu kabar bohong, kamu wajib tahu tiga jenis informasi yang selalu kita lihat di HP atau internet. Yuk, kita pelajari perbedaannya!
              </p>
            </div>

            {/* Illustration */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <img
                  src="/fakta_opini_hoaks.png"
                  alt="Fakta Opini Hoaks"
                  className="rounded-2xl shadow-sm border border-amber-100 max-h-72 mx-auto object-contain transition-transform duration-300 hover:scale-105"
                />
                <p className="text-[10px] text-center text-gray-400 mt-2 italic font-bold">
                  Bandingkan kebenaran informasi sebelum percaya
                </p>
              </div>
              <div className="w-full md:w-1/2 text-sm text-amber-900 leading-relaxed font-bold bg-amber-50 p-5 rounded-2xl border border-amber-100">
                <span>🔑 Kunci Penting:</span>
                <p className="mt-2 font-medium text-gray-700 text-xs sm:text-sm leading-relaxed">
                  Fakta itu kenyataan yang nyata. Opini itu pendapat perasaan pribadi yang bisa berbeda-beda. Hoaks itu berita bohong yang merugikan.
                </p>
              </div>
            </div>

            {/* Three Cards in Detail */}
            <div className="grid grid-cols-1 gap-6">
              {/* Fakta Card */}
              <div className="bg-emerald-50/30 rounded-3xl border border-emerald-500/20 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-800 text-[10px] font-black uppercase">
                  <span>🟢 Jenis 1: FAKTA</span>
                </div>
                <h4 className="font-display font-black text-emerald-900 text-sm sm:text-base">FAKTA (Kenyataan Sebenarnya)</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-700 font-medium">
                  Fakta adalah kejadian yang benar-benar terjadi, ada data buktinya, dan tidak bisa dibantah. Fakta itu seperti rumus matematika: jawabannya pasti dan sama untuk semua orang.
                </p>
                <div className="bg-white p-4 rounded-2xl border border-emerald-100/50 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">⭐ Ciri-ciri Fakta:</span>
                  <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-650 space-y-1.5 font-medium">
                    <li>Ada data yang jelas (angka, tanggal, nama tempat).</li>
                    <li>Bisa dibuktikan langsung kebenarannya.</li>
                    <li>Biasanya dikeluarkan oleh pihak resmi (pemerintah, guru, sekolah).</li>
                  </ul>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">📝 Contoh Fakta:</span>
                  <ul className="list-disc pl-4 text-xs sm:text-sm text-emerald-950 font-semibold space-y-2 italic">
                    <li>"Ir. Soekarno adalah Presiden Pertama Indonesia." <span className="font-normal text-gray-600 not-italic">(Ini fakta sejarah resmi).</span></li>
                    <li>"Besok sekolah libur semester berdasarkan surat pengumuman resmi Kepala Sekolah." <span className="font-normal text-gray-600 not-italic">(Fakta karena ada surat resminya).</span></li>
                  </ul>
                </div>
              </div>

              {/* Opini Card */}
              <div className="bg-sky-50/30 rounded-3xl border border-sky-500/20 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 border border-sky-200 rounded-full text-sky-850 text-[10px] font-black uppercase">
                  <span>🔵 Jenis 2: OPINI</span>
                </div>
                <h4 className="font-display font-black text-sky-900 text-sm sm:text-base">OPINI (Pendapat atau Perasaan)</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-700 font-medium">
                  Opini adalah pendapat, pikiran, atau perasaan seseorang terhadap sesuatu. Opini bisa berbeda-beda bagi setiap orang. Perbedaan opini itu wajar dan bukan kebohongan.
                </p>
                <div className="bg-white p-4 rounded-2xl border border-sky-100/50 space-y-2">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">⭐ Ciri-ciri Opini:</span>
                  <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-650 space-y-1.5 font-medium">
                    <li>Sering memakai kata: <em>menurutku, rasanya, mungkin, paling enak, seharusnya</em>.</li>
                    <li>Tidak punya bukti data pasti karena hanya berdasarkan perasaan pribadi.</li>
                  </ul>
                </div>
                <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">📝 Contoh Opini:</span>
                  <ul className="list-disc pl-4 text-xs sm:text-sm text-sky-950 font-semibold space-y-2 italic">
                    <li>"Menurutku, pelajaran Matematika adalah pelajaran paling seru!" <span className="font-normal text-gray-600 not-italic">(Opini. Temanmu mungkin merasa Olahraga yang paling seru).</span></li>
                    <li>"Kucing adalah hewan paling lucu dan menggemaskan." <span className="font-normal text-gray-600 not-italic">(Opini. Pecinta kelinci mungkin tidak setuju).</span></li>
                  </ul>
                </div>
              </div>

              {/* Hoaks Card */}
              <div className="bg-rose-50/30 rounded-3xl border border-rose-500/20 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 border border-rose-200 rounded-full text-rose-800 text-[10px] font-black uppercase">
                  <span>🔴 Jenis 3: HOAKS</span>
                </div>
                <h4 className="font-display font-black text-rose-900 text-sm sm:text-base">HOAKS (Berita Bohong)</h4>
                <p className="text-xs sm:text-sm leading-relaxed text-gray-700 font-medium">
                  Ini adalah musuh utama detektif siber! Hoaks adalah berita palsu yang sengaja dibuat agar terlihat seperti fakta asli untuk menipu orang.
                </p>
                <div className="bg-white p-4 rounded-2xl border border-rose-100/50 space-y-2">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">⭐ Mengapa orang membuat hoaks?</span>
                  <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                    Ada yang iseng (bercanda buruk), ingin menipu untuk mengambil uang, membuat masyarakat panik ketakutan, atau menjelek-jelekkan orang lain.
                  </p>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 space-y-2">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">📝 Contoh Kasus Hoaks:</span>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                    Ada pesan menyebarkan foto jalanan hancur: <span className="text-red-700 italic font-semibold">"Awas! Gempa bumi baru saja merusak jalan raya Jakarta pagi ini!"</span>. Setelah diselidiki, ternyata itu foto jalan rusak di negara lain yang terjadi 5 tahun lalu.
                  </p>
                </div>
              </div>
            </div>

            {/* Classification Game */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm mt-6">
              <h4 className="font-display font-extrabold text-gray-800 text-sm sm:text-base mb-3">
                🎮 Misi Detektif: Tebak Jenis Informasi!
              </h4>

              <div className="space-y-4">
                {[
                  { id: 's1', text: '“Bapak Ir. Soekarno adalah Presiden Pertama Republik Indonesia.”', correct: 'Fakta', desc: 'Tepat! Ini adalah fakta sejarah resmi yang tercatat.' },
                  { id: 's2', text: '“Menurutku, pelajaran Matematika adalah pelajaran yang paling menyenangkan dan mudah di dunia!”', correct: 'Opini', desc: 'Benar! Ini opini karena merupakan perasaan pribadi yang bisa berbeda.' },
                  { id: 's3', text: '“Gempa bumi baru saja menghancurkan jalan raya di Jakarta pagi ini! Sebarkan!” (Padahal fotonya kejadian 5 tahun lalu di negara lain)', correct: 'Hoaks', desc: 'Hebat! Ini hoaks karena memakai foto lama untuk menipu.' }
                ].map((stmt) => {
                  const chosen = matchingAnswers[stmt.id];
                  const isCorrect = chosen === stmt.correct;

                  return (
                    <div key={stmt.id} className="p-4 rounded-2xl border border-gray-200 bg-slate-50/50 space-y-3 font-medium">
                      <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">{stmt.text}</p>

                      <div className="flex flex-wrap gap-2.5">
                        {['Fakta', 'Opini', 'Hoaks'].map((choice) => {
                          const isThisChoice = chosen === choice;
                          return (
                            <button
                              key={choice}
                              onClick={() => handleMatching(stmt.id, choice)}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${isThisChoice
                                ? choice === stmt.correct
                                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                  : 'bg-red-500 border-red-500 text-white shadow-sm'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50/50'
                                }`}
                            >
                              {choice}
                            </button>
                          );
                        })}
                      </div>

                      {chosen && (
                        <p className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-750'}`}>
                          {isCorrect ? `✔️ ${stmt.desc}` : '❌ Jawaban kurang tepat! Yuk, pikirkan lagi ciri informasinya.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {matchingFinished && (
                <div className="mt-5 p-4 bg-emerald-50 border border-emerald-250 rounded-2xl text-center">
                  <p className="text-xs sm:text-sm font-bold text-emerald-800">🎉 Luar biasa! Kamu berhasil menjawab semua dengan tepat!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'D' && (
          <motion.div
            key="tab-d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header Text */}
            <div className="bg-amber-50/40 rounded-3xl p-6 border border-amber-100/60 space-y-3 text-sm text-gray-700 leading-relaxed font-medium">
              <h3 className="font-display font-black text-amber-800 text-base sm:text-lg flex items-center gap-2">
                🔎 C. Cara Memeriksa Kebenaran Berita
              </h3>
              <p>
                Jika kamu menerima pesan yang heboh, aneh, atau menjanjikan hadiah gratis yang mencurigakan, gunakan <strong>5 Jurus Detektif</strong> berikut untuk mengecek kebenarannya:
              </p>
            </div>

            {/* Illustration & Warning Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <img
                  src="/cara_cek_informasi.png"
                  alt="Cara Memeriksa Informasi"
                  className="rounded-2xl shadow-sm border border-amber-100 max-h-72 mx-auto object-contain transition-transform duration-300 hover:scale-105"
                />
                <p className="text-[10px] text-center text-gray-400 mt-2 italic font-bold">
                  Gunakan 5 Jurus Cek Fakta
                </p>
              </div>
              <div className="w-full md:w-1/2 text-xs sm:text-sm leading-relaxed text-red-800 font-bold bg-red-50 p-5 rounded-2xl border border-red-100 space-y-3">
                <span className="text-red-900 block font-black text-sm uppercase">🚨 Waspada Kalimat Pemaksaan Hoaks:</span>
                <ul className="list-disc pl-4 space-y-1.5 text-red-700 font-bold text-xs">
                  <li>"SEBARKAN KE 10 GRUP SEKARANG JUGA!"</li>
                  <li>"JANGAN BERHENTI DI KAMU! KIRIM KE SEMUA TEMANMU!"</li>
                  <li>"KIRIM SEGERA ATAU AKAN SIAL!"</li>
                </ul>
                <p className="font-normal text-gray-650 text-xs not-italic">
                  Abaikan saja pesan seperti ini! Pengirim informasi fakta yang benar tidak akan pernah memaksa atau mengancam pembacanya untuk membagikan berita.
                </p>
              </div>
            </div>

            {/* The 5 Detailed Steps list - Broken down into beautiful kid-friendly cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
              {/* Step 1 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
                <h4 className="font-display font-black text-amber-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white font-extrabold items-center justify-center text-xs">1</span>
                  Periksa Pengirimnya 👤
                </h4>
                <p className="font-bold text-amber-600 text-xs sm:text-sm">Siapa yang mengirim pesan ini?</p>
                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                  Jika dikirim oleh guru atau orang tua secara resmi, beritanya tepercaya. Tapi jika dikirim oleh nomor tidak dikenal secara berantai, kamu harus curiga!
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
                <h4 className="font-display font-black text-amber-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white font-extrabold items-center justify-center text-xs">2</span>
                  Baca Sampai Habis 📖
                </h4>
                <p className="font-bold text-amber-600 text-xs sm:text-sm">Apakah kamu membaca isinya dengan lengkap?</p>
                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                  Jangan pernah menyebarkan berita hanya dengan membaca judulnya! Pembuat hoaks suka membuat judul heboh agar orang marah atau penasaran.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
                <h4 className="font-display font-black text-amber-850 text-sm sm:text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white font-extrabold items-center justify-center text-xs">3</span>
                  Cek Tanggal Berita 📅
                </h4>
                <p className="font-bold text-amber-600 text-xs sm:text-sm">Kapan berita ini dibuat?</p>
                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                  Ada video badai banjir dari tahun 2018 disebarkan kembali hari ini agar orang panik. Selalu perhatikan tanggal terbit beritanya ya!
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-2">
                <h4 className="font-display font-black text-amber-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white font-extrabold items-center justify-center text-xs">4</span>
                  Bandingkan Beritanya 🔍
                </h4>
                <p className="font-bold text-amber-600 text-xs sm:text-sm">Apakah berita resmi lain juga membahasnya?</p>
                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                  Coba cari berita tersebut di Google (didampingi orang tua) atau cek di berita TV. Jika tidak ada berita resmi yang membahas, berarti berita itu palsu!
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs md:col-span-2 space-y-2">
                <h4 className="font-display font-black text-amber-800 text-sm sm:text-base flex items-center gap-2">
                  <span className="flex h-6 w-6 rounded-full bg-amber-500 text-white font-extrabold items-center justify-center text-xs">5</span>
                  Perhatikan Gaya Kalimat 🗣️
                </h4>
                <p className="font-bold text-amber-600 text-xs sm:text-sm">Apakah bahasanya bernada memaksa atau menakut-nakuti?</p>
                <p className="text-xs sm:text-sm text-gray-650 leading-relaxed font-semibold">
                  Pesan hoaks biasanya ditulis memakai huruf kapital besar semua, disertai banyak tanda seru (!!!), dan memaksa kita menyebarkan secara cepat.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digi footer */}
      <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-3xl shadow-sm flex items-center gap-4">
        <div className="text-2xl shrink-0">🤖</div>
        <div>
          <h4 className="font-display font-black text-xs sm:text-sm">Pesan Penting Digi:</h4>
          <p className="text-[11px] sm:text-xs text-amber-50 leading-relaxed font-bold mt-1">
            "Ingat kawan, menjadi detektif fakta yang cerdas berarti selalu berhenti dan berpikir sejenak sebelum menyebarkan pesan. Lindungi diri kita dengan membagikan berita yang benar!"
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* YukBelajarTopik7 — Restored copyright component */
/* ================================================================== */

interface YukBelajarTopik7Props {
  onActivitySave?: (key: string, val: any) => void;
  activityAnswers?: Record<string, any>;
  isTeacherPreview?: boolean;
}

export function YukBelajarTopik7({
  onActivitySave,
  activityAnswers = {},
  isTeacherPreview = false,
}: YukBelajarTopik7Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);
  const [plagiatAnswers, setPlagiatAnswers] = useState<Record<number, boolean>>({});
  const [plagiatError, setPlagiatError] = useState(false);
  const [plagiatSuccess, setPlagiatSuccess] = useState(false);
  const [ikrar1, setIkrar1] = useState('');
  const [ikrar2, setIkrar2] = useState('');
  const [ikrar3, setIkrar3] = useState('');
  const [ikrarSuccess, setIkrarSuccess] = useState(false);
  const [activeJurus, setActiveJurus] = useState<number | null>(null);
  const [visitedJurus, setVisitedJurus] = useState<number[]>([]);
  const [sumberTab, setSumberTab] = useState<'dasar' | 'builder'>('dasar');
  const [whoInput, setWhoInput] = useState('');
  const [whatInput, setWhatInput] = useState('');
  const [whereInput, setWhereInput] = useState('');
  const [builderSuccess, setBuilderSuccess] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [karyaType, setKaryaType] = useState('Poster Lomba 💡');
  const [karyaTitle, setKaryaTitle] = useState('Hemat Energi untuk Bumi');
  const [karyaLicense, setKaryaLicense] = useState<'cc-by' | 'c-all'>('cc-by');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    if (activityAnswers['t7-tab-b']) {
      setPlagiatAnswers(activityAnswers['t7-tab-b']);
      const ans = activityAnswers['t7-tab-b'];
      if (ans[0] === true && ans[1] === false && ans[2] === false && ans[3] === true && ans[4] === false) {
        setPlagiatSuccess(true);
      }
    }
    if (activityAnswers['t7-tab-c']) {
      const { p1, p2, p3 } = activityAnswers['t7-tab-c'];
      setIkrar1(p1 || '');
      setIkrar2(p2 || '');
      setIkrar3(p3 || '');
      if (p1 === 'tanganku' && p2 === 'pikiranku' && p3 === 'mengaku') {
        setIkrarSuccess(true);
      }
    }
    if (activityAnswers['t7-tab-e']) {
      const { who, what, where, creator } = activityAnswers['t7-tab-e'];
      setWhoInput(who || '');
      setWhatInput(what || '');
      setWhereInput(where || '');
      setCreatorName(creator || '');
      if (who === 'NASA' && what === 'Planet Mars' && where === 'www.nasa.gov') {
        setBuilderSuccess(true);
      }
    }
  }, [activityAnswers]);

  const saveActivity = (key: string, val: any) => {
    if (onActivitySave && !isTeacherPreview) {
      onActivitySave(key, val);
    }
  };

  const Z = [
    {
      id: 0,
      tindakan: 'Memakai foto kucing dari internet, lalu menulis nama pembuat dan sumber situsnya.',
      isBoleh: true,
      explanation: 'Hebat! Kamu jujur tidak mengaku sebagai pembuatnya dan memberi tahu dari mana asalnya.',
    },
    {
      id: 1,
      tindakan: 'Mengunduh poster teman, menghapus namanya, lalu menggantinya dengan nama kita.',
      isBoleh: false,
      explanation: 'Benar! Ini namanya pencurian digital. Sangat tidak menghargai pembuat aslinya.',
    },
    {
      id: 2,
      tindakan: 'Menyalin (copy-paste) tulisan orang lain dari internet lalu dikumpulkan sebagai tugas sekolah.',
      isBoleh: false,
      explanation: 'Benar! Ini namanya plagiat. Kamu tidak belajar apa-apa dengan menyontek.',
    },
    {
      id: 3,
      tindakan: 'Melihat poster keren di internet, lalu menjadikannya inspirasi untuk membuat poster buatanmu sendiri.',
      isBoleh: true,
      explanation: 'Hebat! Inspirasi itu bagus! Kita membuat karya baru yang berbeda dengan usaha kita sendiri.',
    },
    {
      id: 4,
      tindakan: 'Mengunggah ulang (repost) video YouTube orang lain ke channel kita tanpa izin pemiliknya.',
      isBoleh: false,
      explanation: 'Benar! Video itu adalah hasil keringat orang lain.',
    },
  ];

  const handlePlagiatChoice = (id: number, val: boolean) => {
    const updatedAnswers = { ...plagiatAnswers, [id]: val };
    setPlagiatAnswers(updatedAnswers);
    saveActivity('t7-tab-b', updatedAnswers);

    if (Z[id].isBoleh !== val) {
      setPlagiatError(true);
      setTimeout(() => setPlagiatError(false), 2000);
    }

    const isAllCorrect = Z.every((item) => updatedAnswers[item.id] === item.isBoleh);
    if (isAllCorrect) {
      setPlagiatSuccess(true);
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    }
  };

  const handleIkrarSelect = (field: number, val: string) => {
    let p1 = ikrar1;
    let p2 = ikrar2;
    let p3 = ikrar3;
    if (field === 1) {
      p1 = val;
      setIkrar1(val);
    } else if (field === 2) {
      p2 = val;
      setIkrar2(val);
    } else {
      p3 = val;
      setIkrar3(val);
    }
    saveActivity('t7-tab-c', { p1, p2, p3 });
    if (p1 === 'tanganku' && p2 === 'pikiranku' && p3 === 'mengaku') {
      setIkrarSuccess(true);
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      setIkrarSuccess(false);
    }
  };

  const handleBuilderSelect = (field: 'who' | 'what' | 'where', val: string) => {
    let who = whoInput;
    let what = whatInput;
    let where = whereInput;
    if (field === 'who') {
      who = val;
      setWhoInput(val);
    } else if (field === 'what') {
      what = val;
      setWhatInput(val);
    } else {
      where = val;
      setWhereInput(val);
    }

    const isInfoCorrect = who === 'NASA' && what === 'Planet Mars' && where === 'www.nasa.gov';
    if (isInfoCorrect) {
      setBuilderSuccess(true);
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
      });
    } else {
      setBuilderSuccess(false);
    }
    saveActivity('t7-tab-e', { who, what, where, creator: creatorName });
  };

  const handleCreatorNameChange = (val: string) => {
    setCreatorName(val);
    saveActivity('t7-tab-e', { who: whoInput, what: whatInput, where: whereInput, creator: val });
  };

  const tabs = [
    { id: 'A', label: 'A. Karya Digital', icon: '🎨' },
    { id: 'B', label: 'B. Pantang Plagiat', icon: '🚫' },
    { id: 'C', label: 'C. Hak Cipta', icon: '©️' },
    { id: 'D', label: 'D. Jurus 3J', icon: '🧭' },
    { id: 'E', label: 'E. Tulis Sumber', icon: '📝' },
  ] as const;

  const tabDone: Record<string, boolean> = {
    A: visitedTabs.includes('A'),
    B: plagiatSuccess,
    C: ikrarSuccess,
    D: visitedJurus.length >= 3,
    E: builderSuccess,
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <StepWrapper stepNumber={6} title="Yuk Belajar!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-orange-700 flex items-center gap-1.5">
            Petualangan Penjaga Karya
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-orange-600 rounded-full border border-orange-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 w-full rounded-full bg-orange-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu resmi menjadi Penjaga Karya Digital! 🏆
          </motion.p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDone = tabDone[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-2 px-2.5 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isActive
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transform scale-105'
                : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-655 hover:bg-slate-200 hover:text-slate-800'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-550'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'A' && (
          <motion.div
            key="A"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 text-left">
              <h3 className="font-display font-black text-orange-800 text-lg mb-2">Mengenal Karya Digital</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Halo, teman-teman yang hebat! Pernahkah kamu menggambar sesuatu yang sangat bagus, lalu memajangnya di dinding kamarmu? Kamu pasti merasa bangga, kan? Nah, di dunia internet atau dunia digital, kita juga bisa membuat karya yang luar biasa, lho! Yuk, kita pelajari apa itu karya digital dan bagaimana cara kita menghargainya!
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <img
                  src="/karya_digital_anak.png"
                  alt="Ilustrasi Karya Digital"
                  className="rounded-2xl shadow-md border border-orange-100 max-h-72 mx-auto object-contain"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-bold text-orange-500 uppercase">Definisi Penting</span>
                  <h4 className="font-display font-extrabold text-gray-800 mt-1 mb-2">Apa itu Karya Digital?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Karya digital adalah hasil ciptaan seseorang yang dibuat, disimpan, atau dibagikan menggunakan perangkat digital seperti HP, komputer, tablet, atau kamera.
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                  <p className="text-xs text-amber-850 leading-relaxed font-semibold">
                    Karya digital itu tidak turun begitu saja dari langit. Ada manusia sungguhan di baliknya yang membuatnya dengan susah payah menggunakan waktu, tenaga, pikiran, dan kreativitas!
                  </p>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h4 className="font-display font-extrabold text-gray-800 text-sm mb-3">Contoh Karya Digital:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Gambar / Visual', desc: 'Ilustrasi, foto hasil jepretan kamera, ikon, stiker WhatsApp.', icon: '🖼️' },
                  { title: 'Tulisan', desc: 'Cerita pendek, artikel blog, puisi, atau caption di media sosial.', icon: '✍️' },
                  { title: 'Video', desc: 'Vlog jalan-jalan, animasi kartun, video presentasi tugas sekolah.', icon: '🎬' },
                  { title: 'Musik / Audio', desc: 'Lagu, rekaman suara podcast, atau efek suara lucu.', icon: '🎧' },
                  { title: 'Desain', desc: 'Poster lomba, logo kelas, jadwal piket yang dihias, slide presentasi.', icon: '🎨' },
                  { title: 'Konten Media Sosial', desc: 'Video pendek, Reels, unggahan Instagram, dan video TikTok.', icon: '📱' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between hover:border-orange-300 transition-colors"
                  >
                    <div>
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h5 className="font-display font-bold text-gray-800 text-xs mb-1">{item.title}</h5>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-2 bg-slate-50 p-2 rounded-lg">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'B' && (
          <motion.div
            key="B"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100">
                  <h3 className="font-display font-black text-red-800 text-lg mb-2">Analogi Istana Pasir</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Bayangkan jika kamu membangun istana pasir yang sangat besar di pantai seharian penuh. Lalu, tiba-tiba ada orang lain yang memasang bendera namanya di istanamu dan berteriak, <strong>"Ini istana buatanku!"</strong> Tentu kamu akan merasa sangat sedih dan marah, bukan?
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2 font-semibold text-red-600">
                    Hal yang sama juga berlaku di dunia digital. Itulah sebabnya, karya digital sangat perlu dihargai!
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-bold text-red-500 uppercase">Istilah Penting</span>
                  <h4 className="font-display font-extrabold text-gray-800 mt-1 mb-2">Apa itu Plagiarisme?</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tindakan mengambil karya orang lain dan mengakuinya sebagai karya sendiri disebut <strong>Plagiarisme (Plagiat)</strong>. Seorang pahlawan digital pantang melakukan hal ini!
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src="/istana_pasir_plagiat.png"
                  alt="Ilustrasi Plagiat Istana Pasir"
                  className="rounded-2xl shadow-md border border-red-100 max-h-72 mx-auto object-contain"
                />
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
              <h4 className="font-display font-extrabold text-gray-800 text-sm mb-1 text-center">Kuis Detektif Anti-Plagiat</h4>
              <p className="text-xs text-slate-500 text-center mb-4">Tentukan apakah tindakan di bawah ini Boleh atau Tidak Boleh dilakukan!</p>

              <AnimatePresence>
                {plagiatError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-xs font-bold text-center rounded-xl animate-bounce"
                  >
                    Pilihanmu kurang tepat, coba pikirkan lagi!
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                {Z.map((e) => {
                  const isCorrect = plagiatAnswers[e.id] === e.isBoleh;
                  const hasAnswered = plagiatAnswers[e.id] !== undefined && plagiatAnswers[e.id] !== null;
                  return (
                    <div
                      key={e.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${hasAnswered
                        ? isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-red-50/60 border-red-200'
                        : 'bg-white border-slate-200'
                        }`}
                    >
                      <p className="text-xs font-semibold text-slate-800 leading-relaxed mb-3">{e.tindakan}</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlagiatChoice(e.id, true)}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black border transition-all ${plagiatAnswers[e.id] === true
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50'
                            }`}
                        >
                          Boleh!
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePlagiatChoice(e.id, false)}
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-black border transition-all ${plagiatAnswers[e.id] === false
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white border-slate-200 text-red-600 hover:bg-red-50'
                            }`}
                        >
                          Tidak Boleh!
                        </button>
                      </div>
                      {hasAnswered && (
                        <p className={`text-[10px] mt-2 font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                          {isCorrect ? `✓ ${e.explanation}` : `✗ Kurang tepat, coba pikirkan lagi!`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {plagiatSuccess && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center"
                >
                  <h5 className="font-display font-black text-emerald-800 text-xs">Selamat! Kamu Lulus Ujian Anti-Plagiat!</h5>
                  <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Kamu tahu mana tindakan yang jujur dan menghargai karya orang lain.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'C' && (
          <motion.div
            key="C"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <img
                  src="/hak_cipta_gembok.png"
                  alt="Ilustrasi Hak Cipta Gembok"
                  className="rounded-2xl shadow-md border border-blue-100 mx-auto object-contain max-h-72"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <h3 className="font-display font-black text-blue-800 text-lg mb-2">Hak Cipta (Tanda Pengenal Tak Terlihat)</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Teman-teman, pernah dengar kata Hak Cipta? Hak cipta itu seperti tanda pengenal atau gembok tak terlihat yang dimiliki seseorang atas karya yang dibuatnya.
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">
                    Ketika seseorang selesai membuat gambar, cerita, lagu, atau video, secara otomatis karya itu dilindungi oleh aturan bernama hak cipta.
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-500 uppercase">Di Indonesia</span>
                  <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                    Ada markas besar yang mengatur hak cipta, namanya <strong>DJKI (Direktorat Jenderal Kekayaan Intelektual)</strong>. DJKI menjelaskan bahwa hak cipta langsung muncul saat karya selesai dibuat (diwujudkan).
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-md border border-indigo-950 text-left">
              <h4 className="font-display font-black text-center text-sm mb-1">Lengkapi Ikrar Hak Cipta Cilik</h4>
              <p className="text-[10px] text-indigo-200 text-center mb-4">Pilih kata yang tepat untuk melengkapi ikrar kejujuran digitalmu!</p>
              <div className="bg-indigo-950 p-4 rounded-xl border border-indigo-800 text-center space-y-4">
                <p className="text-xs leading-loose font-bold tracking-wide">
                  “Kalau bukan{' '}
                  <select
                    value={ikrar1}
                    onChange={(e) => handleIkrarSelect(1, e.target.value)}
                    className="bg-indigo-800 border border-indigo-600 rounded px-2 py-0.5 text-white font-black text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">(pilih)</option>
                    <option value="bukuku">bukuku</option>
                    <option value="tanganku">tanganku</option>
                    <option value="temanku">temanku</option>
                  </select>{' '}
                  dan{' '}
                  <select
                    value={ikrar2}
                    onChange={(e) => handleIkrarSelect(2, e.target.value)}
                    className="bg-indigo-800 border border-indigo-600 rounded px-2 py-0.5 text-white font-black text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">(pilih)</option>
                    <option value="pikiranku">pikiranku</option>
                    <option value="kataku">kataku</option>
                    <option value="HP-ku">HP-ku</option>
                  </select>{' '}
                  yang membuat, maka aku tidak boleh{' '}
                  <select
                    value={ikrar3}
                    onChange={(e) => handleIkrarSelect(3, e.target.value)}
                    className="bg-indigo-800 border border-indigo-600 rounded px-2 py-0.5 text-white font-black text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="">(pilih)</option>
                    <option value="mengambil">mengambil</option>
                    <option value="membagikan">membagikan</option>
                    <option value="mengaku">mengaku</option>
                  </select>{' '}
                  sebagai pembuatnya.”
                </p>

                {ikrarSuccess && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3 bg-amber-400 text-indigo-950 font-black rounded-lg text-xs"
                  >
                    Ikrar Berhasil! Kamu berkomitmen menghargai hak cipta!
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'D' && (
          <motion.div
            key="D"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl p-5 border border-amber-100">
                  <h3 className="font-display font-black text-amber-800 text-lg mb-2">Jurus Rahasia: Ingat "3J"</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Agar kamu selalu aman dan menjadi anak yang beretika di dunia maya, gunakan jurus rahasia 3J! Ketuk masing-masing jurus di bawah untuk mempelajari jurus rahasia dari Digi!
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src="/jurus_tiga_j.png"
                  alt="Ilustrasi Jurus 3J"
                  className="rounded-2xl shadow-md border border-amber-100 max-h-72 mx-auto object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              {[
                { id: 1, title: '1. Jujur ', bg: 'bg-pink-50 border-pink-150 text-pink-800 hover:bg-pink-100', desc: 'Jujur berarti berani berkata benar. Banggalah pada karya buatanmu sendiri, meskipun belum sempurna. Jangan pernah mengakui karya orang lain sebagai hasil kerjamu. Tugas yang dikerjakan sendiri jauh lebih bernilai di mata gurumu!' },
                { id: 2, title: '2. Jelaskan Sumber ', bg: 'bg-sky-50 border-sky-150 text-sky-855 hover:bg-sky-100', desc: 'Jika kamu meminjam buku temanmu, kamu pasti akan bilang pada ibumu, "Bu, ini buku pinjaman dari Budi." Di internet juga sama! Jika kamu menggunakan gambar, informasi, atau foto dari internet, jelaskan siapa pembuatnya dan dari mana kamu mengambilnya.' },
                { id: 3, title: '3. Jangan Asal Ambil ', bg: 'bg-emerald-50 border-emerald-150 text-emerald-855 hover:bg-emerald-100', desc: 'Tidak semua barang di internet itu gratis. Ada karya yang boleh dipakai bebas (seperti berlisensi Creative Commons), ada yang harus minta izin dulu, dan ada yang sama sekali tidak boleh diubah. Jika ragu, selalu tanyakan pada guru atau orang tua!' }
              ].map((e) => (
                <div
                  key={e.id}
                  onClick={() => {
                    setActiveJurus(activeJurus === e.id ? null : e.id);
                    setVisitedJurus((prev) => (prev.includes(e.id) ? prev : [...prev, e.id]));
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${e.bg} ${activeJurus === e.id ? 'ring-2 ring-amber-400 shadow-md scale-102' : 'shadow-sm'
                    }`}
                >
                  <h4 className="font-display font-black text-xs flex justify-between items-center">
                    <span>{e.title}</span>
                    <span>{activeJurus === e.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
                  </h4>
                  <AnimatePresence>
                    {activeJurus === e.id && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-[10px] leading-relaxed text-gray-700 mt-2 pt-2 border-t border-black/5 font-medium"
                      >
                        {e.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'E' && (
          <motion.div
            key="E"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex border-b border-orange-100 mb-6 overflow-x-auto gap-2">
              {[
                { id: 'dasar', label: '1. Dasar (3 Hal)', icon: '🧭' },
                { id: 'builder', label: '2. Game Susun Sumber', icon: '🎮' }
              ].map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSumberTab(e.id as any)}
                  className={`px-4 py-2.5 text-xs font-extrabold whitespace-nowrap border-b-2 transition-all ${sumberTab === e.id ? 'border-orange-500 text-orange-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <span className="mr-1.5">{e.icon}</span>
                  {e.label}
                </button>
              ))}
            </div>

            {sumberTab === 'dasar' && (
              <div className="space-y-6 animate-pop-in">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2">
                    <img
                      src="/tulis_sumber_benar.png"
                      alt="Ilustrasi Menulis Sumber Benar"
                      className="rounded-2xl shadow-md border border-orange-100 max-h-72 mx-auto object-contain"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4 text-left">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-100">
                      <h3 className="font-display font-black text-orange-800 text-base mb-2">Mengapa Menulis "Sumber: Google" Salah?</h3>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Google hanyalah mesin pencari yang membantu mencarikan barang, bukan pembuat aslinya. Menyebut "Sumber: Google" ibarat meminjam sepeda temanmu (Dika) lalu berkata kepada orang tuamu bahwa sepedanya "dari jalan raya"!
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm space-y-2">
                      <p className="text-xs font-bold text-orange-600 uppercase">3 Hal Penting (Dasar Kredit):</p>
                      <ul className="text-xs text-gray-700 list-decimal pl-5 space-y-1">
                        <li><strong>Siapa</strong>: Nama pembuat/penulis karya (contoh: NASA, Kemdikbud, Andi).</li>
                        <li><strong>Apa</strong>: Judul atau nama karyanya (contoh: Foto "Planet Mars", Poster "Hemat Energi").</li>
                        <li><strong>Di mana</strong>: Nama situs/alamat website asalnya (contoh: www.nasa.gov, www.freepik.com).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sumberTab === 'builder' && (
              <div className="space-y-6 animate-pop-in text-left">
                <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                  <h4 className="font-display font-extrabold text-gray-800 text-sm mb-1 text-center">Game: Susun Sumber Kreatif</h4>
                  <p className="text-[10px] text-slate-500 text-center mb-4">Ada foto Planet Mars buatan NASA yang kamu temukan di situs www.nasa.gov. Pilih opsi di bawah agar susunannya menjadi sumber yang benar!</p>

                  <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-orange-150 shadow-sm mb-4">
                    <div className="w-full md:w-1/3 shrink-0">
                      <img
                        src="/gambar/topik 7/Mars.jpg"
                        alt="Foto Planet Mars oleh NASA"
                        className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                      <div className="text-[9px] text-slate-500 mt-1 text-center font-medium">Foto Planet Mars (Sumber: NASA)</div>
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">🚀 Misi Detektif Karya:</p>
                      <p className="text-xs text-slate-655 leading-relaxed mt-1">
                        Kamu menemukan foto Planet Mars di samping. Foto ini diunggah oleh <strong>NASA</strong> pada tahun <strong>2021</strong> di situs resmi mereka: <strong>www.nasa.gov</strong>.
                      </p>
                      <p className="text-xs text-slate-655 leading-relaxed mt-2">Pilihlah informasi yang tepat pada tiga kolom di bawah agar susunannya menjadi sumber yang benar!</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">1. Siapa Pembuatnya?</label>
                      <select
                        value={whoInput}
                        onChange={(e) => handleBuilderSelect('who', e.target.value)}
                        className="w-full bg-white border border-gray-250 rounded-xl px-3 py-2 text-xs text-gray-700 font-bold focus:outline-none focus:ring-1 focus:ring-orange-400 appearance-none"
                      >
                        <option value="">(pilih pembuat)</option>
                        <option value="Google">Google</option>
                        <option value="NASA">NASA</option>
                        <option value="Internet">Internet</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">2. Apa Judul Karyanya?</label>
                      <select
                        value={whatInput}
                        onChange={(e) => handleBuilderSelect('what', e.target.value)}
                        className="w-full bg-white border border-gray-250 rounded-xl px-3 py-2 text-xs text-gray-700 font-bold focus:outline-none focus:ring-1 focus:ring-orange-400 appearance-none"
                      >
                        <option value="">(pilih judul)</option>
                        <option value="Planet Mars">Foto "Planet Mars"</option>
                        <option value="Gambar Indah">Gambar Indah</option>
                        <option value="Tugas Sekolah">Tugas Sekolah</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">3. Di mana Ditemukan?</label>
                      <select
                        value={whereInput}
                        onChange={(e) => handleBuilderSelect('where', e.target.value)}
                        className="w-full bg-white border border-gray-250 rounded-xl px-3 py-2 text-xs text-gray-700 font-bold focus:outline-none focus:ring-1 focus:ring-orange-400 appearance-none"
                      >
                        <option value="">(pilih situs)</option>
                        <option value="www.google.com">situs www.google.com</option>
                        <option value="WhatsApp">grup WhatsApp</option>
                        <option value="www.nasa.gov">situs www.nasa.gov</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-orange-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-orange-100">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Hasil Referensi Kamu (Format Sederhana):</span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-slate-850 select-all">
                      {whoInput && whatInput && whereInput ? (
                        <div className="text-xs font-semibold leading-relaxed font-sans">
                          <div className="space-y-3">
                            <img
                              src="/gambar/topik 7/Mars.jpg"
                              alt="Planet Mars"
                              className="w-full max-h-52 object-cover rounded-xl border border-slate-200 shadow-sm"
                            />
                            <p className="font-mono text-orange-950 font-bold bg-orange-50/50 p-2.5 rounded-lg border border-orange-100/60 text-left">
                              Sumber Gambar: Foto "{whatInput}" oleh {whoInput}, dari situs {whereInput}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-slate-400 italic text-center py-2">Pilih semua 3 hal di atas untuk menyusun sumber...</p>
                      )}
                    </div>

                    {builderSuccess && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-3 p-2.5 bg-emerald-500 text-white font-bold rounded-xl text-center text-[10.5px]"
                      >
                        Sempurna! Kamu sudah berhasil menyusun sumber dengan benar!
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm animate-pop-in space-y-4 text-left">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-display font-extrabold text-gray-800 text-xs">Berlatih Menghargai Karyamu Sendiri (Pembuat Karya Cilik)</h4>
                <p className="text-[10px] text-gray-550 mt-1">Coba buat Kartu Hak Cipta untuk karyamu sendiri! Tulis identitas karyamu di bawah untuk merancang sertifikat kepemilikan digitalmu:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 block mb-1">1. Nama Pencipta (Namamu)</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={(e) => handleCreatorNameChange(e.target.value)}
                      placeholder="Masukkan namamu..."
                      className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 block mb-1">2. Jenis Karya Digital</label>
                    <select
                      value={karyaType}
                      onChange={(e) => setKaryaType(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-xl px-3 py-2 text-xs text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none"
                    >
                      <option value="Poster Lomba 💡">Poster Lomba 💡</option>
                      <option value="Lukisan Digital 🎨">Lukisan Digital 🎨</option>
                      <option value="Foto Pemandangan 📸">Foto Pemandangan 📸</option>
                      <option value="Cerita Pendek ✍️">Cerita Pendek ✍️</option>
                      <option value="Video Animasi 🎬">Video Animasi 🎬</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 block mb-1">3. Judul Karyamu</label>
                    <input
                      type="text"
                      value={karyaTitle}
                      onChange={(e) => setKaryaTitle(e.target.value)}
                      placeholder="mis. Hemat Energi, Kucing Ceria..."
                      className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs font-bold text-gray-855 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 block mb-1">4. Lisensi Karya</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setKaryaLicense('cc-by')}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${karyaLicense === 'cc-by'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        CC-BY (Boleh dipakai, asal tulis nama)
                      </button>
                      <button
                        type="button"
                        onClick={() => setKaryaLicense('c-all')}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${karyaLicense === 'c-all'
                          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        Hak Cipta Dilindungi (Harus Izin)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-4 relative min-h-[220px]">
                  {creatorName ? (
                    <div className="w-full max-w-[280px] bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-indigo-950 flex flex-col justify-between aspect-[1.58/1] relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl" />
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[7px] tracking-widest text-indigo-300 uppercase font-black">Sertifikat Karya Digital</span>
                          <h5 className="font-display font-black text-xs mt-0.5 leading-none">HAK CIPTA CILIK</h5>
                        </div>
                        <span className="text-xl">{karyaType.split(' ').pop()}</span>
                      </div>
                      <div className="my-2.5">
                        <p className="text-[8px] text-indigo-300 leading-none">Judul Karya:</p>
                        <p className="text-xs font-black italic tracking-wide truncate mt-0.5">"{karyaTitle || 'Tanpa Judul'}"</p>
                        <p className="text-[8px] text-indigo-300 mt-1.5 leading-none">Dibuat Oleh:</p>
                        <p className="text-[11px] font-bold truncate mt-0.5">{creatorName}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[7px]">
                        <div>
                          <span>Tahun Cipta: <b>2026</b></span>
                        </div>
                        <div>
                          {karyaLicense === 'cc-by' ? (
                            <span className="bg-emerald-550 text-white px-1.5 py-0.5 rounded font-black tracking-wide">CC BY (FREE ATTR)</span>
                          ) : (
                            <span className="bg-rose-550 text-white px-1.5 py-0.5 rounded font-black tracking-wide">ALL RIGHTS RESERVED</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-3xl block mb-2 opacity-60">🛡️</span>
                      <p className="text-[10px] text-slate-400 font-bold">Masukkan namamu untuk mencetak Kartu Hak Cipta karyamu sendiri!</p>
                    </div>
                  )}

                  {creatorName && (
                    <button
                      type="button"
                      onClick={() => {
                        canvasConfetti({
                          particleCount: 120,
                          spread: 80,
                          origin: { y: 0.8 },
                        });
                        setClaimSuccess(true);
                        setTimeout(() => setClaimSuccess(false), 4000);
                      }}
                      className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-md transition-all transform hover:scale-102 flex items-center gap-1.5"
                    >
                      🏆 Klaim & Verifikasi Hak Cipta Karya!
                    </button>
                  )}
                </div>
              </div>

              {claimSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full p-3 bg-emerald-500 text-white rounded-xl text-center text-[10px] font-bold shadow-md"
                >
                  🎉 Selamat! Karya "{karyaTitle}" secara resmi ditandai sebagai Hak Cipta milik {creatorName} (2026). Gunakan sertifikat ini untuk menghargai usaha kreatifmu!
                </motion.div>
              )}

              {creatorName && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-left w-full">
                  <p className="text-[9px] uppercase font-bold text-slate-500">Format Kredit Untuk Karyamu:</p>
                  <div className="text-[10px] font-mono text-slate-700 space-y-1">
                    <p><strong>Gaya Sederhana:</strong> {karyaType.split(' ')[0]} oleh {creatorName}, 2026.</p>
                    <p><strong>Gaya Standar Nasional:</strong> Gambar 1. {karyaTitle} (Sumber: {creatorName}, 2026)</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 bg-gradient-to-r from-orange-400 to-amber-500 text-white p-5 rounded-2xl shadow-sm flex items-center gap-4 text-left">
        <div>
          <h4 className="font-display font-black text-xs">Pesan Digi:</h4>
          <p className="text-[10px] text-orange-50 leading-relaxed font-bold mt-1">
            "Internet adalah perpustakaan ilmu yang sangat luas. Jadilah pengunjung yang baik. Jangan asal mengambil! Jadilah pengguna digital yang jujur: banggalah membuat karyamu sendiri, selalu tuliskan sumber saat meminjam, dan hargailah karya ciptaan orang lain."
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}

/* ================================================================== */
/* Reconstructed Components & Widgets */
/* ================================================================== */

/* ================================================================== */
/* Flow Step Components Reconstruction */
/* ================================================================== */

interface MCQuestionCustom {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  imageUrl?: string;
  context?: string;
}

interface AyoMemahamiStepProps {
  mcQuestions?: MCQuestionCustom[];
  essayQuestions?: EssayQuestion[];
  onMCAnswer: (qId: string, idx: number) => void;
  onEssaySave: (qId: string, text: string) => void;
  instruction?: string;
  exampleInput?: string;
  status: 'belum' | 'draf' | 'dikirim' | 'dinilai';
  passage?: string;
}

export function AyoMemahamiStep({
  mcQuestions = [],
  essayQuestions = [],
  onMCAnswer,
  onEssaySave,
  instruction = 'Pahamilah bacaan di bawah ini dengan saksama, kemudian jawablah pertanyaan-pertanyaan yang tersedia.',
  exampleInput = 'Contoh: Tuliskan jawabanmu dengan kalimat yang runtut dan jelas.',
  status = 'belum',
  passage,
}: AyoMemahamiStepProps) {
  // Local state for MC answers
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mcQuestions.forEach((q) => {
      const saved = localStorage.getItem(`siber-mc-${q.id}`);
      if (saved !== null) initial[q.id] = parseInt(saved);
    });
    return initial;
  });

  // Local state for Essay answers
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    essayQuestions.forEach((q) => {
      const saved = localStorage.getItem(`siber-essay-${q.id}`);
      if (saved !== null) initial[q.id] = saved;
    });
    return initial;
  });

  const [savingStatus, setSavingStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});
  const isDisabled = status === 'dikirim' || status === 'dinilai';

  const handleMCSelect = (qId: string, idx: number) => {
    if (isDisabled) return;
    setMcAnswers((prev) => ({ ...prev, [qId]: idx }));
    localStorage.setItem(`siber-mc-${qId}`, idx.toString());
    onMCAnswer(qId, idx);
  };

  const handleEssayChange = (qId: string, text: string) => {
    if (isDisabled) return;
    setEssayAnswers((prev) => ({ ...prev, [qId]: text }));
    localStorage.setItem(`siber-essay-${qId}`, text);
    setSavingStatus((prev) => ({ ...prev, [qId]: 'saving' }));
  };

  const handleEssayBlur = (qId: string) => {
    if (isDisabled) return;
    const val = essayAnswers[qId] || '';
    onEssaySave(qId, val);
    setSavingStatus((prev) => ({ ...prev, [qId]: 'saved' }));
    setTimeout(() => {
      setSavingStatus((prev) => ({ ...prev, [qId]: 'idle' }));
    }, 2000);
  };

  const displayStatus = status === 'belum' && (Object.keys(mcAnswers).length > 0 || Object.keys(essayAnswers).length > 0)
    ? 'draf'
    : status;

  return (
    <StepWrapper stepNumber={6} title="Ayo, Memahami!" icon={<PenLine className="h-5 w-5" />}>
      <ActivityHeader instruction={instruction} exampleInput={exampleInput} status={displayStatus} />

      {passage && <PassageBlock passage={passage} />}

      <div className="space-y-8 mt-6">
        {/* MC Questions */}
        {mcQuestions.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-xs font-extrabold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bagian 1: Pilihan Ganda</span>
            </h3>
            {mcQuestions.map((q, qi) => {
              const selected = mcAnswers[q.id];
              return (
                <div key={q.id} className="rounded-2xl border border-primary-105 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-sm font-bold text-primary-700">
                    {qi + 1}. {q.question}
                  </p>
                  {q.context && (
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-650 leading-relaxed font-semibold">
                      {q.context}
                    </div>
                  )}
                  {q.imageUrl && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-slate-100 max-h-48 flex justify-center bg-slate-50">
                      <img src={q.imageUrl} alt="Pertanyaan" className="object-contain max-h-48 w-full" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => {
                      let optClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                      if (selected === oi) {
                        optClass = 'border-primary-400 bg-primary-50 text-primary-800 ring-2 ring-primary-200';
                      }
                      if (isDisabled) {
                        if (oi === q.correctIndex) {
                          optClass = 'border-success-400 bg-success-50 text-success-800 font-bold';
                        } else if (selected === oi) {
                          optClass = 'border-danger-400 bg-danger-50 text-danger-800';
                        } else {
                          optClass = 'border-slate-100 bg-white text-slate-400 opacity-60';
                        }
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleMCSelect(q.id, oi)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-bold transition-all ${optClass}`}
                        >
                          <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${selected === oi ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Essay Questions */}
        {essayQuestions.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-xs font-extrabold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bagian 2: Pertanyaan Essay</span>
            </h3>
            {essayQuestions.map((q, qi) => {
              const val = essayAnswers[q.id] || '';
              const saveState = savingStatus[q.id] || 'idle';
              return (
                <div key={q.id} className="rounded-2xl border border-primary-105 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-primary-700">
                      {qi + 1}. {q.question}
                    </p>
                    {q.maxScore && (
                      <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-full shrink-0">
                        Maks {q.maxScore} Poin
                      </span>
                    )}
                  </div>
                  {q.context && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-650 leading-relaxed font-semibold">
                      {q.context}
                    </div>
                  )}
                  {q.imageUrl && (
                    <div className="overflow-hidden rounded-xl border border-slate-100 max-h-48 flex justify-center bg-slate-50">
                      <img src={q.imageUrl} alt="Pertanyaan" className="object-contain max-h-48 w-full" />
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      value={val}
                      disabled={isDisabled}
                      onChange={(e) => handleEssayChange(q.id, e.target.value)}
                      onBlur={() => handleEssayBlur(q.id)}
                      placeholder="Tuliskan jawaban lengkapmu di sini..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                      {saveState === 'saving' && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                          <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan...
                        </span>
                      )}
                      {saveState === 'saved' && (
                        <span className="text-[10px] text-success-500 flex items-center gap-1 font-bold">
                          <Check className="h-3 w-3" /> Tersimpan
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

interface AyoMengamatiStepProps {
  caseStudy: {
    title: string;
    scenario: string;
    questions: string[];
  };
  onSaveResponse: (idx: number, text: string) => void;
  answers: Record<string, any>;
  questionIds: string[];
  status: 'belum' | 'draf' | 'dikirim' | 'dinilai';
}

export function AyoMengamatiStep({
  caseStudy,
  onSaveResponse,
  answers = {},
  questionIds = [],
  status = 'belum',
}: AyoMengamatiStepProps) {
  const [savingStatus, setSavingStatus] = useState<Record<number, 'idle' | 'saving' | 'saved'>>({});
  const isDisabled = status === 'dikirim' || status === 'dinilai';

  const handleTextChange = (idx: number, text: string) => {
    if (isDisabled) return;
    onSaveResponse(idx, text);
    setSavingStatus((prev) => ({ ...prev, [idx]: 'saving' }));
  };

  const handleBlur = (idx: number) => {
    if (isDisabled) return;
    setSavingStatus((prev) => ({ ...prev, [idx]: 'saved' }));
    setTimeout(() => {
      setSavingStatus((prev) => ({ ...prev, [idx]: 'idle' }));
    }, 2000);
  };

  return (
    <StepWrapper stepNumber={7} title={caseStudy.title} icon={<Map className="h-5 w-5" />}>
      <ActivityHeader
        instruction="Bacalah skenario kasus di bawah ini dengan cermat. Berikan tanggapan observasi dan analisismu pada kolom jawaban yang tersedia."
        exampleInput="Contoh: Analisis apa yang dilakukan pelaku dan bagaimana solusinya."
        status={status}
      />

      {/* Skenario Kasus */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-2xl p-5 border border-amber-100 shadow-inner text-left mb-6">
        <h4 className="font-display font-black text-amber-800 text-sm mb-2 flex items-center gap-1.5">
          📖 Skenario Kasus Investigasi
        </h4>
        <div className="text-xs text-gray-700 leading-relaxed font-medium">
          <StudentRichContentRenderer content={caseStudy.scenario} />
        </div>
      </div>

      {/* Pertanyaan Observasi */}
      <div className="space-y-6">
        {caseStudy.questions.map((qText, qi) => {
          const qId = questionIds[qi] || `q-${qi}`;
          const val = answers[qId] || '';
          const saveState = savingStatus[qi] || 'idle';
          return (
            <div key={qId} className="rounded-2xl border border-primary-105 bg-white p-5 shadow-sm space-y-3 text-left">
              <p className="text-sm font-bold text-primary-700">
                Pertanyaan {qi + 1}: {qText}
              </p>
              <div className="relative">
                <textarea
                  value={val}
                  disabled={isDisabled}
                  onChange={(e) => handleTextChange(qi, e.target.value)}
                  onBlur={() => handleBlur(qi)}
                  placeholder="Tuliskan hasil pengamatanmu di sini..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-1">
                  {saveState === 'saving' && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                      <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan...
                    </span>
                  )}
                  {saveState === 'saved' && (
                    <span className="text-[10px] text-success-500 flex items-center gap-1 font-bold">
                      <Check className="h-3 w-3" /> Tersimpan
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </StepWrapper>
  );
}

interface AyoBereksplorasiStepProps {
  simulation: {
    type: string;
    title: string;
    description: string;
  };
  onLaunch: () => void;
  status: 'belum' | 'draf' | 'dikirim' | 'dinilai';
}

export function AyoBereksplorasiStep({
  simulation,
  onLaunch,
  status = 'belum',
}: AyoBereksplorasiStepProps) {
  return (
    <StepWrapper stepNumber={8} title="Ayo, Bereksplorasi!" icon={<Target className="h-5 w-5" />}>
      <ActivityHeader
        instruction="Saatnya menerapkan pengetahuanmu ke dalam simulasi interaktif yang menantang! Selesaikan misi simulasi ini untuk mendapatkan skor kelulusan."
        exampleInput="Contoh: Selesaikan seluruh percakapan chat simulasi secara santun."
        status={status}
      />

      <div className="rounded-3xl border border-primary-100 bg-gradient-to-b from-primary-50/50 to-white p-6 shadow-sm flex flex-col items-center text-center space-y-4">
        {/* Game Icon Glow */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 text-white shadow-glow">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-primary-100 text-primary-700 px-3 py-1 rounded-full border border-primary-200">
            Game Simulasi: {simulation.type.toUpperCase()}
          </span>
          <h3 className="font-display font-black text-primary-800 text-base mt-3">
            {simulation.title}
          </h3>
          <p className="text-xs text-slate-605 leading-relaxed max-w-md mx-auto mt-2 font-medium">
            {simulation.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onLaunch}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 px-6 py-3.5 text-xs font-black text-white shadow-md transition-all hover:shadow-glow hover:scale-105 active:scale-95 shrink-0"
        >
          <Target className="h-4 w-4" /> Mulai Petualangan Game 🚀
        </button>
      </div>
    </StepWrapper>
  );
}

interface UjiPemahamanStepProps {
  mcQuestions: MCQuestionCustom[];
  essayQuestions: EssayQuestion[];
  onSubmit: (mcAnswers: Record<string, number>, essayAnswers: Record<string, string>) => Promise<void> | void;
  submittedScore: number | null;
  instruction?: string;
  exampleInput?: string;
  status: 'belum' | 'draf' | 'dikirim' | 'dinilai';
  passage?: string;
}

export function UjiPemahamanStep({
  mcQuestions = [],
  essayQuestions = [],
  onSubmit,
  submittedScore,
  instruction = 'Yuk, jawab semua pertanyaan di bawah ini dengan jujur untuk menguji pemahamanmu setelah mempelajari topik ini! Kamu pasti bisa! 🚀✨',
  exampleInput = 'Contoh: Pilih jawaban pilihan ganda yang paling tepat dan tulis jawaban essay menggunakan bahasamu sendiri, ya!',
  status = 'belum',
  passage,
}: UjiPemahamanStepProps) {
  // Local state for MC answers
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    mcQuestions.forEach((q) => {
      const saved = localStorage.getItem(`siber-uji-mc-${q.id}`);
      if (saved !== null) initial[q.id] = parseInt(saved);
    });
    return initial;
  });

  // Local state for Essay answers
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    essayQuestions.forEach((q) => {
      const saved = localStorage.getItem(`siber-uji-essay-${q.id}`);
      if (saved !== null) initial[q.id] = saved;
    });
    return initial;
  });

  const [submitting, setSubmitting] = useState(false);

  const handleMCSelect = (qId: string, idx: number) => {
    if (status === 'dikirim' || status === 'dinilai') return;
    setMcAnswers((prev) => ({ ...prev, [qId]: idx }));
    localStorage.setItem(`siber-uji-mc-${qId}`, idx.toString());
  };

  const handleEssayChange = (qId: string, text: string) => {
    if (status === 'dikirim' || status === 'dinilai') return;
    setEssayAnswers((prev) => ({ ...prev, [qId]: text }));
    localStorage.setItem(`siber-uji-essay-${qId}`, text);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'dikirim' || status === 'dinilai') return;

    // Check if everything is filled
    const allMcFilled = mcQuestions.every(q => mcAnswers[q.id] !== undefined);
    const allEssayFilled = essayQuestions.every(q => (essayAnswers[q.id] || '').trim() !== '');

    if (!allMcFilled || !allEssayFilled) {
      alert('Harap jawab semua pertanyaan pilihan ganda dan essay sebelum mengirim!');
      return;
    }

    if (!window.confirm('Apakah kamu yakin ingin mengirim jawaban ini? Jawabanmu tidak bisa diubah lagi setelah dikirim.')) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(mcAnswers, essayAnswers);
    } catch (err) {
      console.error('UjiPemahaman submit error:', err);
      alert('Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayStatus = status === 'belum' && (Object.keys(mcAnswers).length > 0 || Object.keys(essayAnswers).length > 0)
    ? 'draf'
    : status;

  const isSubmitted = status === 'dikirim' || status === 'dinilai' || submittedScore !== null;

  return (
    <StepWrapper stepNumber={9} title="Uji Pemahamanmu" icon={<Check className="h-5 w-5" />}>
      <ActivityHeader instruction={instruction} exampleInput={exampleInput} status={isSubmitted ? 'dikirim' : displayStatus} />

      {passage && <PassageBlock passage={passage} />}

      {/* Score celebration box if submitted */}
      {isSubmitted && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 rounded-3xl border border-success-200 bg-success-50/50 p-6 text-center space-y-3"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-success-100 text-success-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-display font-black text-success-800 text-base">Evaluasi Selesai!</h4>
            <p className="text-xs text-success-700 leading-relaxed font-bold mt-1">
              Jawabanmu telah sukses dikirim ke guru untuk pemeriksaan essay.
            </p>
            {submittedScore !== null && (
              <p className="text-xl font-black text-success-600 mt-2">
                Skor Kuis Pilihan Ganda: {submittedScore}%
              </p>
            )}
          </div>
        </motion.div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8 mt-6">
        {/* MC Questions */}
        {mcQuestions.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-xs font-extrabold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bagian 1: Pilihan Ganda</span>
            </h3>
            {mcQuestions.map((q, qi) => {
              const selected = mcAnswers[q.id];
              return (
                <div key={q.id} className="rounded-2xl border border-primary-105 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-sm font-bold text-primary-700">
                    {qi + 1}. {q.question}
                  </p>
                  {q.context && (
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-655 leading-relaxed font-semibold">
                      {q.context}
                    </div>
                  )}
                  {q.imageUrl && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-slate-100 max-h-48 flex justify-center bg-slate-50">
                      <img src={q.imageUrl} alt="Pertanyaan" className="object-contain max-h-48 w-full" />
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => {
                      let optClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                      if (selected === oi) {
                        optClass = 'border-primary-400 bg-primary-50 text-primary-800 ring-2 ring-primary-200';
                      }
                      if (isSubmitted) {
                        if (oi === q.correctIndex) {
                          optClass = 'border-success-400 bg-success-50 text-success-800 font-bold';
                        } else if (selected === oi) {
                          optClass = 'border-danger-400 bg-danger-50 text-danger-800';
                        } else {
                          optClass = 'border-slate-100 bg-white text-slate-400 opacity-60';
                        }
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleMCSelect(q.id, oi)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs font-bold transition-all ${optClass}`}
                        >
                          <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${selected === oi ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Essay Questions */}
        {essayQuestions.length > 0 && (
          <div className="space-y-6 text-left">
            <h3 className="text-xs font-extrabold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Bagian 2: Pertanyaan Essay</span>
            </h3>
            {essayQuestions.map((q, qi) => {
              const val = essayAnswers[q.id] || '';
              return (
                <div key={q.id} className="rounded-2xl border border-primary-105 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-bold text-primary-700">
                      {qi + 1}. {q.question}
                    </p>
                    {q.maxScore && (
                      <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-full shrink-0">
                        Maks {q.maxScore} Poin
                      </span>
                    )}
                  </div>
                  {q.context && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-655 leading-relaxed font-semibold">
                      {q.context}
                    </div>
                  )}
                  {q.imageUrl && (
                    <div className="overflow-hidden rounded-xl border border-slate-100 max-h-48 flex justify-center bg-slate-50">
                      <img src={q.imageUrl} alt="Pertanyaan" className="object-contain max-h-48 w-full" />
                    </div>
                  )}

                  <textarea
                    value={val}
                    disabled={isSubmitted}
                    onChange={(e) => handleEssayChange(q.id, e.target.value)}
                    placeholder="Tuliskan jawaban essay lengkapmu di sini..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-slate-50 disabled:text-slate-500 font-medium"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Submit button */}
        {!isSubmitted && (
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-success-500 to-emerald-400 hover:from-success-600 hover:to-success-500 px-8 py-4 text-xs font-black text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Mengirimkan...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Kirim Jawaban Akhir ke Guru 🏁
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </StepWrapper>
  );
}

interface RefleksiStepProps {
  question: string;
  initialAnswer: string;
  onSave: (val: string) => void;
  instruction?: string;
  exampleInput?: string;
  status: 'belum' | 'draf' | 'dikirim' | 'dinilai';
  content?: string;
}

export function RefleksiStep({
  question,
  initialAnswer = '',
  onSave,
  instruction = 'Tuliskan refleksimu setelah menyelesaikan seluruh aktivitas pembelajaran pada topik ini. Refleksi membantu mengunci pelajaran penting dalam ingatanmu.',
  exampleInput = 'Contoh: Saya paling terkesan dengan tips cara membuat kata sandi yang aman dan akan menerapkannya mulai hari ini.',
  status = 'belum',
  content,
}: RefleksiStepProps) {
  const [val, setVal] = useState(initialAnswer);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const isDisabled = status === 'dikirim' || status === 'dinilai';

  useEffect(() => {
    setVal(initialAnswer);
  }, [initialAnswer]);

  const handleChange = (text: string) => {
    if (isDisabled) return;
    setVal(text);
    setSaveState('saving');
  };

  const handleBlur = () => {
    if (isDisabled) return;
    onSave(val);
    setSaveState('saved');
    setTimeout(() => {
      setSaveState('idle');
    }, 2000);
  };

  return (
    <StepWrapper stepNumber={10} title="Refleksi Akhir" icon={<Sparkles className="h-5 w-5 text-amber-500" />}>
      <ActivityHeader instruction={instruction} exampleInput={exampleInput} status={status} />

      <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm text-left space-y-4">
        {/* Render rich content (e.g., Piagam Mabar Aman for Topik 6) */}
        {content && (
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50/30 p-5 shadow-inner mb-4">
            <div className="text-xs text-gray-700 leading-relaxed font-medium">
              <StudentRichContentRenderer content={content} />
            </div>
          </div>
        )}
        <p className="text-sm font-bold text-primary-700 flex items-center gap-2">
          💡 {question}
        </p>

        <div className="relative">
          <textarea
            value={val}
            disabled={isDisabled}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="Tuliskan refleksimu di sini..."
            rows={5}
            className="w-full rounded-xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-slate-50 disabled:text-slate-500 font-medium"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-1">
            {saveState === 'saving' && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                <Loader2 className="h-3 w-3 animate-spin" /> Menyimpan...
              </span>
            )}
            {saveState === 'saved' && (
              <span className="text-[10px] text-success-500 flex items-center gap-1 font-bold">
                <Check className="h-3 w-3" /> Tersimpan
              </span>
            )}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}


/* ================================================================== */
/* Topic 1 & Topic 2 Custom Gamified Widgets */
/* ================================================================== */

interface Aktivitas2RisikoGamifiedProps {
  answers: Record<string, string>;
  onSave: (val: any) => void;
  readOnly?: boolean;
}

export function Aktivitas2RisikoGamified({
  answers = {},
  onSave,
  readOnly = false,
}: Aktivitas2RisikoGamifiedProps) {
  const missions = [
    {
      id: 'sit1',
      title: 'Misi 1: Game Saat Belajar',
      scenario: 'Raka asyik bermain gawai game di kelas saat guru menjelaskan pelajaran.',
      correctRisiko: 'Lupa Waktu & Kewajiban (Tertinggal pelajaran dan melanggar aturan kelas)',
      correctTindakan: 'Disiplin Waktu: Kembali fokus belajar dan matikan game selama pelajaran',
      risikoOptions: [
        'Lupa Waktu & Kewajiban (Tertinggal pelajaran dan melanggar aturan kelas)',
        'Penyebaran Data Pribadi (Informasi rahasia disalahgunakan)',
        'Tautan Penipuan (Merusak gawai)',
      ],
      tindakanOptions: [
        'Disiplin Waktu: Kembali fokus belajar dan matikan game selama pelajaran',
        'Melanjutkan bermain diam-diam di bawah meja',
        'Membagikan game tersebut ke teman sekelas',
      ],
      icon: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto">
          <rect x="15" y="25" width="70" height="45" rx="5" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
          <line x1="15" y1="58" x2="85" y2="58" stroke="#475569" strokeWidth="2" />
          <circle cx="35" cy="42" r="6" fill="#f43f5e" />
          <circle cx="65" cy="42" r="6" fill="#3b82f6" />
          <path d="M 25 70 L 10 82 L 90 82 L 75 70 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
          <rect x="42" y="32" width="16" height="4" rx="1" fill="#475569" />
          <rect x="48" y="29" width="4" height="10" rx="1" fill="#475569" />
        </svg>
      )
    },
    {
      id: 'sit2',
      title: 'Misi 2: Link Hadiah Gratis',
      scenario: 'Raka mendapat pesan WA: "Selamat! Kamu menang undian Rp 10 juta. Klik link ini untuk klaim."',
      correctRisiko: 'Tautan Penipuan / Phishing (Pencurian data atau virus merusak gawai)',
      correctTindakan: 'Abaikan dan Hapus: Jangan klik link dan jangan bagikan ke orang lain',
      risikoOptions: [
        'Tautan Penipuan / Phishing (Pencurian data atau virus merusak gawai)',
        'Cyberbullying (Perundungan di internet)',
        'Kesehatan Fisik (Mata lelah)',
      ],
      tindakanOptions: [
        'Abaikan dan Hapus: Jangan klik link dan jangan bagikan ke orang lain',
        'Segera klik link tersebut dan isi semua data diri agar menang',
        'Kirim pesan tersebut ke semua grup WA teman',
      ],
      icon: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto">
          <rect x="25" y="10" width="50" height="80" rx="8" fill="#e2e8f0" stroke="#0284c7" strokeWidth="3" />
          <circle cx="50" cy="82" r="4" fill="#0284c7" />
          <path d="M 30 20 L 70 20 L 70 65 L 30 65 Z" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
          <path d="M 50 25 L 50 45 M 40 38 L 60 38" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />
          <path d="M 38 48 Q 50 35 62 48" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <text x="50" y="58" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#0369a1">KLAIM HADIAH</text>
        </svg>
      )
    },
    {
      id: 'sit3',
      title: 'Misi 3: Komentar Kasar',
      scenario: 'Melihat teman sekelas diejek, dihina, dan difitnah secara kasar di grup chat bermain.',
      correctRisiko: 'Cyberbullying / Komentar Jahat (Menyakiti perasaan orang lain)',
      correctTindakan: 'Melaporkan ke Guru/Orang Tua dan membantu menenangkan teman yang diejek',
      risikoOptions: [
        'Cyberbullying / Komentar Jahat (Menyakiti perasaan orang lain)',
        'Plagiarisme (Mengambil karya orang)',
        'Pencurian Kata Sandi (Keamanan akun)',
      ],
      tindakanOptions: [
        'Melaporkan ke Guru/Orang Tua dan membantu menenangkan teman yang diejek',
        'Ikut mengirim stiker lucu untuk meramaikan suasana',
        'Keluar dari grup dan membiarkan teman menangis',
      ],
      icon: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto">
          <path d="M 15 15 L 85 15 L 85 65 L 55 65 L 40 80 L 40 65 L 15 65 Z" fill="#fee2e2" stroke="#rose" strokeWidth="3" />
          <circle cx="35" cy="38" r="4" fill="#dc2626" />
          <circle cx="65" cy="38" r="4" fill="#dc2626" />
          <path d="M 40 50 Q 50 42 60 50" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <path d="M 28 30 L 38 34 M 72 30 L 62 34" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'sit4',
      title: 'Misi 4: Meminta Data Pribadi',
      scenario: 'Situs web game baru meminta alamat rumah lengkap, sekolah, dan nomor HP orang tuamu.',
      correctRisiko: 'Penyebaran Data Pribadi (Informasi rahasia disalahgunakan orang asing)',
      correctTindakan: 'Tutup Halaman: Tolak memberikan data rahasia kepada situs tidak dikenal',
      risikoOptions: [
        'Penyebaran Data Pribadi (Informasi rahasia disalahgunakan orang asing)',
        'Informasi Palsu / Hoaks (Berita bohong)',
        'Kesehatan Fisik (Mata merah)',
      ],
      tindakanOptions: [
        'Tutup Halaman: Tolak memberikan data rahasia kepada situs tidak dikenal',
        'Mengisi formulir dengan lengkap agar game bisa segera diunduh',
        'Memberikan password milik teman sekelas saja',
      ],
      icon: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto">
          <rect x="25" y="35" width="50" height="45" rx="6" fill="#f8fafc" stroke="#1e293b" strokeWidth="3" />
          <circle cx="50" cy="55" r="5" fill="#1e293b" />
          <rect x="47" y="58" width="6" height="12" fill="#1e293b" />
          <path d="M 35 35 L 35 25 Q 35 12 50 12 Q 65 12 65 25 L 65 35" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <path d="M 38 48 H 62 M 38 60 H 62" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'sit5',
      title: 'Misi 5: Menatap Layar Terlalu Lama',
      scenario: 'Menatap layar Chromebook selama 4 jam tanpa jeda hingga mata merah, perih, dan leher pegal.',
      correctRisiko: 'Kesehatan Fisik (Mata merah, perih, leher pegal, dan lelah)',
      correctTindakan: 'Terapkan rumus 20-20-20 (Istirahat setiap 20 menit dan batasi waktu layar)',
      risikoOptions: [
        'Kesehatan Fisik (Mata merah, perih, leher pegal, dan lelah)',
        'Plagiarisme (Menyalin gambar)',
        'Penipuan Hadiah (Scam)',
      ],
      tindakanOptions: [
        'Terapkan rumus 20-20-20 (Istirahat setiap 20 menit dan batasi waktu layar)',
        'Membeli kacamata hitam agar tetap bisa bermain game lebih lama',
        'Tidur sambil tetap memegang HP di samping kasur',
      ],
      icon: (
        <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto">
          <circle cx="50" cy="50" r="40" fill="#fffbeb" stroke="#d97706" strokeWidth="3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 30 45 Q 37 40 44 45 M 56 45 Q 63 40 70 45" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <circle cx="37" cy="48" r="4" fill="#b45309" />
          <circle cx="63" cy="48" r="4" fill="#b45309" />
          <path d="M 30 48 H 33 M 70 48 H 67" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="50" y2="25" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="50" x2="70" y2="50" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
  ];

  const handleSelectField = (missionId: string, field: 'risiko' | 'tindakan', val: string) => {
    if (readOnly) return;
    const updated = { ...answers, [`${missionId}_${field}`]: val };
    onSave(updated);
  };

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm text-left mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-650">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <h3 className="font-display font-black text-gray-800 text-sm">
          Aktivitas 2: Analisis Risiko Digital
        </h3>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">
        Bantulah menganalisis risiko dan tindakan tepat untuk setiap skenario kejadian di bawah ini!
      </p>

      <div className="space-y-4">
        {missions.map((mission, idx) => {
          const selectedRisiko = answers[`${mission.id}_risiko`] || '';
          const selectedTindakan = answers[`${mission.id}_tindakan`] || '';

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-4 ${selectedRisiko && selectedTindakan
                ? 'border-indigo-150 bg-indigo-50/20'
                : 'border-slate-150 bg-white hover:border-indigo-300'
                }`}
            >
              <div className="w-full md:w-1/6 flex flex-col items-center justify-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm shrink-0">
                {mission.icon}
                <span className="text-[9px] font-black text-indigo-600 mt-1 text-center uppercase tracking-wider block">
                  {mission.title}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                <p className="text-[11px] font-bold text-gray-800 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                  {idx + 1}. "{mission.scenario}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-red-600 uppercase tracking-wider block">
                      ⚠️ Risiko Digital
                    </label>
                    {readOnly ? (
                      <div className={`p-2.5 rounded-xl border text-[10px] font-bold ${selectedRisiko === mission.correctRisiko
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {selectedRisiko || 'Tidak dijawab'}
                        {selectedRisiko !== mission.correctRisiko && (
                          <div className="mt-1 pt-1 border-t border-red-100 text-[9px] font-medium text-slate-500">
                            Kunci Jawaban: {mission.correctRisiko}
                          </div>
                        )}
                      </div>
                    ) : (
                      <select
                        value={selectedRisiko}
                        onChange={(e) => handleSelectField(mission.id, 'risiko', e.target.value)}
                        className={`w-full rounded-xl border text-[11px] px-2 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-400 font-semibold cursor-pointer appearance-none ${selectedRisiko ? 'border-indigo-350 bg-indigo-50/10' : 'border-slate-200'
                          }`}
                      >
                        <option value="">-- Pilih Risiko --</option>
                        {mission.risikoOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block">
                      🛡️ Tindakan Cerdas
                    </label>
                    {readOnly ? (
                      <div className={`p-2.5 rounded-xl border text-[10px] font-bold ${selectedTindakan === mission.correctTindakan
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {selectedTindakan || 'Tidak dijawab'}
                        {selectedTindakan !== mission.correctTindakan && (
                          <div className="mt-1 pt-1 border-t border-red-100 text-[9px] font-medium text-slate-500">
                            Kunci Jawaban: {mission.correctTindakan}
                          </div>
                        )}
                      </div>
                    ) : (
                      <select
                        value={selectedTindakan}
                        onChange={(e) => handleSelectField(mission.id, 'tindakan', e.target.value)}
                        className={`w-full rounded-xl border text-[11px] px-2 py-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-400 font-semibold cursor-pointer appearance-none ${selectedTindakan ? 'border-indigo-350 bg-indigo-50/10' : 'border-slate-200'
                          }`}
                      >
                        <option value="">-- Pilih Tindakan --</option>
                        {mission.tindakanOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Aktivitas3TtsGamifiedProps {
  answers: Record<string, string>;
  onSave: (val: any) => void;
  readOnly?: boolean;
}

export function Aktivitas3TtsGamified({
  answers = {},
  onSave,
  readOnly = false,
}: Aktivitas3TtsGamifiedProps) {
  const crosswordWords = [
    { id: 1, number: 1, text: 'CERDAS', clue: 'Sikap pintar, aman, dan bertanggung jawab saat kita menggunakan teknologi internet.', dir: 'Down', r: 0, c: 1 },
    { id: 2, number: 2, text: 'SOPAN', clue: 'Sikap baik dan santun saat mengetik komentar atau berkirim pesan di internet.', dir: 'Down', r: 0, c: 6 },
    { id: 3, number: 3, text: 'MANFAAT', clue: 'Kegunaan positif dari gawai, contohnya untuk mencari materi pelajaran sekolah.', dir: 'Down', r: 1, c: 10 },
    { id: 4, number: 4, text: 'HAK', clue: 'Sesuatu yang boleh dan seharusnya kita dapatkan di dunia internet, seperti hak merasa aman.', dir: 'Across', r: 2, c: 9 },
    { id: 5, number: 5, text: 'DIGITAL', clue: 'Dunia virtual tempat kita belajar, bermain, dan mencari informasi memakai internet.', dir: 'Across', r: 3, c: 1 },
    { id: 6, number: 6, text: 'GAWAI', clue: 'Sebutan lain untuk alat elektronik canggih seperti HP, Chromebook, atau laptop.', dir: 'Down', r: 3, c: 3 },
    { id: 7, number: 7, text: 'JAWAB', clue: 'Tanggung ______ adalah kewajiban yang harus kita lakukan agar internet menjadi tempat yang nyaman.', dir: 'Across', r: 5, c: 9 },
    { id: 8, number: 8, text: 'BIJAK', clue: 'Menggunakan perangkat dengan disiplin waktu dan hati-hati agar tidak kecanduan.', dir: 'Down', r: 5, c: 13 },
    { id: 9, number: 9, text: 'INTERNET', clue: 'Jalan tol tidak terlihat yang menghubungkan semua gawai di dunia agar bisa saling bertukar data.', dir: 'Across', r: 7, c: 3 },
    { id: 10, number: 10, text: 'RISIKO', clue: 'Kemungkinan bahaya atau masalah di dunia digital, seperti penipuan atau lupa waktu.', dir: 'Down', r: 7, c: 7 },
  ];

  const rows = 13;
  const cols = 14;

  const isTtsChecked = !!answers.isTtsChecked || readOnly;
  const hintsUsed = (answers.hintsUsed || {}) as Record<string, boolean>;

  // Compute student-entered letters in the grid
  const cellAnswers: Record<string, string> = {};
  crosswordWords.forEach((word) => {
    const val = (answers[`q-${word.number}`] || '').toUpperCase();
    for (let i = 0; i < word.text.length; i++) {
      const r = word.dir === 'Down' ? word.r + i : word.r;
      const c = word.dir === 'Across' ? word.c + i : word.c;
      const cellKey = `${r}_${c}`;
      if (val[i]) {
        cellAnswers[cellKey] = val[i];
      }
    }
  });

  // Compute hint letters
  const cellHints: Record<string, string> = {};
  crosswordWords.forEach((word) => {
    const hintActive = !!hintsUsed[word.number];
    if (hintActive) {
      const len = word.text.length;
      const indicesToReveal: number[] = [];
      if (len <= 4) {
        for (let i = 0; i < len - 1; i++) {
          indicesToReveal.push(i);
        }
      } else if (len === 5) {
        indicesToReveal.push(0, 2, 4);
      } else if (len === 6) {
        indicesToReveal.push(0, 2, 4, 5);
      } else {
        indicesToReveal.push(0, 2, 4, 6);
      }

      indicesToReveal.forEach((idx) => {
        if (idx < len) {
          const rIdx = word.dir === 'Down' ? word.r + idx : word.r;
          const cIdx = word.dir === 'Across' ? word.c + idx : word.c;
          cellHints[`${rIdx}_${cIdx}`] = word.text[idx];
        }
      });
    }
  });

  const handleClueChange = (num: number, val: string) => {
    if (isTtsChecked || readOnly) return;
    const sanitized = val.toUpperCase().replace(/[^A-Z]/g, '');
    onSave({ ...answers, [`q-${num}`]: sanitized });
  };

  const handleUseHint = (num: number) => {
    if (isTtsChecked || readOnly) return;
    const nextHints = { ...hintsUsed, [num]: true };
    onSave({ ...answers, hintsUsed: nextHints });
  };

  const handleCheckTts = () => {
    if (isTtsChecked || readOnly) return;

    // Check if any answers are empty
    const allFilled = crosswordWords.every((w) => (answers[`q-${w.number}`] || '').trim() !== '');
    if (!allFilled) {
      const confirm = window.confirm('Beberapa kata teka-teki silang belum diisi. Apakah kamu yakin ingin memeriksa jawaban sekarang?');
      if (!confirm) return;
    }

    onSave({ ...answers, isTtsChecked: true });

    const allCorrect = crosswordWords.every((w) => {
      const wordAns = (answers[`q-${w.number}`] || '').toUpperCase();
      return wordAns === w.text;
    });

    if (allCorrect) {
      canvasConfetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.8 },
      });
    }
  };

  const handleResetTts = () => {
    if (readOnly) return;
    const confirm = window.confirm('Apakah kamu yakin ingin mengulang teka-teki silang ini? Semua jawabanmu akan dihapus.');
    if (!confirm) return;

    const resetAnswers: Record<string, any> = {
      isTtsChecked: false,
      hintsUsed: {},
    };
    crosswordWords.forEach((w) => {
      resetAnswers[`q-${w.number}`] = '';
    });
    onSave(resetAnswers);
  };

  const getCellLabelNumber = (r: number, c: number) => {
    const word = crosswordWords.find((w) => w.r === r && w.c === c);
    return word ? word.number : null;
  };

  const isCellUsed = (r: number, c: number) => {
    return crosswordWords.some((word) => {
      for (let i = 0; i < word.text.length; i++) {
        const wr = word.dir === 'Down' ? word.r + i : word.r;
        const wc = word.dir === 'Across' ? word.c + i : word.c;
        if (wr === r && wc === c) return true;
      }
      return false;
    });
  };

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm text-left mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="font-display font-black text-gray-800 text-sm">
          Aktivitas 3: Teka-Teki Silang (TTS) Digital Cerdas
        </h3>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">
        Jawab petunjuk di kolom kanan dengan mengetik. Gunakan tombol Clue untuk memunculkan huruf bantuan di papan TTS!
      </p>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Crossword Grid View */}
        <div className="flex-1 flex justify-center items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-inner">
          <div className="flex flex-col gap-1 w-fit mx-auto overflow-auto">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="flex gap-1">
                {Array.from({ length: cols }).map((_, c) => {
                  const used = isCellUsed(r, c);
                  const label = getCellLabelNumber(r, c);
                  const cellKey = `${r}_${c}`;
                  const ansVal = cellAnswers[cellKey] || '';
                  const hintVal = cellHints[cellKey] || '';

                  // Compute correctness highlights on checked state
                  let cellClass = 'bg-slate-200/20 border-transparent text-transparent opacity-10';
                  if (used) {
                    if (ansVal) {
                      cellClass = 'bg-white border-indigo-200 text-slate-800 shadow-2xs';
                      if (isTtsChecked) {
                        let cellCorrect = true;
                        crosswordWords.forEach((w) => {
                          const studentWord = (answers[`q-${w.number}`] || '').toUpperCase();
                          for (let i = 0; i < w.text.length; i++) {
                            const wr = w.dir === 'Down' ? w.r + i : w.r;
                            const wc = w.dir === 'Across' ? w.c + i : w.c;
                            if (wr === r && wc === c) {
                              if (studentWord[i] && studentWord[i] !== w.text[i]) {
                                cellCorrect = false;
                              }
                            }
                          }
                        });
                        cellClass = cellCorrect
                          ? 'bg-emerald-50 border-emerald-350 text-emerald-800 font-bold'
                          : 'bg-rose-50 border-rose-350 text-rose-800 font-bold';
                      }
                    } else if (hintVal) {
                      cellClass = 'bg-indigo-50/50 border-indigo-200 text-indigo-400 font-semibold opacity-70';
                    } else {
                      cellClass = 'bg-white border-indigo-150 text-slate-350';
                    }
                  }

                  return (
                    <div
                      key={c}
                      className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[10px] sm:text-xs font-black border transition-all select-none ${cellClass}`}
                    >
                      {label && (
                        <span className="absolute top-0.5 left-0.5 text-[6px] font-black text-indigo-500 leading-none">
                          {label}
                        </span>
                      )}
                      {used ? (ansVal || hintVal) : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Clues text entry */}
        <div className="w-full lg:w-2/5 space-y-3">
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1">
              ✍️ JAWAB PERTANYAAN DI SINI
            </h4>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {crosswordWords.map((word) => {
                const val = answers[`q-${word.number}`] || '';
                const isCorrect = val.toUpperCase() === word.text.toUpperCase();
                return (
                  <div key={word.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <span className="text-indigo-600 font-extrabold">{word.number}.</span>
                        <span>{word.dir === 'Across' ? 'Mendatar ➡️' : 'Menurun ⬇️'}</span>
                        <span className="text-[9px] text-gray-400 font-medium">({word.text.length} huruf)</span>
                      </span>
                      {isTtsChecked ? (
                        <span className={`text-[9px] font-black uppercase ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {isCorrect ? 'Benar ✓' : 'Salah ✗'}
                        </span>
                      ) : (
                        val && (
                          <span className="text-[9px] text-slate-400 font-medium">
                            Ketik jawaban...
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-[10px] text-gray-550 leading-normal">
                      {word.clue}
                    </p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        disabled={readOnly || isTtsChecked}
                        value={val}
                        maxLength={word.text.length}
                        onChange={(e) => handleClueChange(word.number, e.target.value)}
                        placeholder={`Ketik ${word.text.length} huruf...`}
                        className={`flex-1 rounded-xl border text-[11px] px-2.5 py-1.5 font-bold uppercase transition-all ${isTtsChecked
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                          : isCorrect
                            ? 'bg-emerald-50/50 border-emerald-300 text-emerald-900 focus:border-emerald-400'
                            : val
                              ? 'bg-amber-50/30 border-amber-300 focus:border-amber-400'
                              : 'border-slate-200 bg-white focus:border-indigo-400'
                          }`}
                      />
                      {!isTtsChecked && !readOnly && (
                        <button
                          type="button"
                          onClick={() => handleUseHint(word.number)}
                          disabled={!!hintsUsed[word.number]}
                          className={`px-2 py-1.5 rounded-lg text-[9px] font-extrabold flex items-center gap-1 border transition-all shrink-0 ${hintsUsed[word.number]
                            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 shadow-2xs'
                            }`}
                          title="Tampilkan huruf bantuan"
                        >
                          💡 Clue
                        </button>
                      )}
                    </div>
                    {isTtsChecked && !isCorrect && (
                      <p className="text-[9px] text-rose-500 font-bold">
                        Kunci Jawaban: {word.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            {!readOnly && (
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                {isTtsChecked ? (
                  <button
                    type="button"
                    onClick={handleResetTts}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="h-3 w-3" /> Ulangi Teka-Teki
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckTts}
                    className="w-full py-2 bg-gradient-to-r from-primary-500 to-primary-400 text-white text-xs font-black rounded-xl transition-all shadow-sm hover:shadow-glow hover:brightness-105"
                  >
                    Periksa & Kirim Jawaban TTS 🔍
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface KartuPenggunaDigitalCerdasProps {
  answers: {
    nama?: string;
    untuk?: string[];
    tidakAkan?: string[];
    signature?: string; // data URL tanda tangan
    isSaved?: boolean;
  };
  onSave: (val: any) => void;
  readOnly?: boolean;
}

export function KartuPenggunaDigitalCerdas({
  answers = {},
  onSave,
  readOnly = false,
}: KartuPenggunaDigitalCerdasProps) {
  const komitmenUntuk = [
    { icon: '🔐', text: 'Aku akan menjaga rahasia data pribadi dan kata sandi.' },
    { icon: '💬', text: 'Aku akan menyebarkan kata-kata santun dan ramah.' },
    { icon: '⏰', text: 'Aku akan membatasi waktu bermain agar tubuh sehat.' },
    { icon: '🔍', text: 'Aku akan menyaring informasi dan tidak percaya hoaks.' },
  ];

  const komitmenTidakAkan = [
    { icon: '🚫', text: 'Aku tidak akan membagikan data pribadi ke orang asing.' },
    { icon: '🙅', text: 'Aku tidak akan menulis komentar kasar atau mengejek.' },
  ];

  const nama = answers.nama || '';
  const untuk = answers.untuk || [];
  const tidakAkan = answers.tidakAkan || [];
  const savedSignature = answers.signature || '';
  const isSaved = answers.isSaved || false;

  // Canvas ref for signature pad
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!savedSignature);
  const [showCertificate, setShowCertificate] = useState(false);

  // Initialize signature state from saved data
  useEffect(() => {
    if (savedSignature) {
      setHasSignature(true);
      // Load saved signature onto canvas when in readOnly mode
      if (readOnly && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current && ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0);
          }
        };
        img.src = savedSignature;
      }
    }
  }, [savedSignature, readOnly]);

  const handleNamaChange = (val: string) => {
    if (readOnly || isSaved) return;
    onSave({ ...answers, nama: val });
  };

  const handleUntukToggle = (idx: number) => {
    if (readOnly || isSaved) return;
    const next = untuk.includes(komitmenUntuk[idx].text)
      ? untuk.filter((t) => t !== komitmenUntuk[idx].text)
      : [...untuk, komitmenUntuk[idx].text];
    onSave({ ...answers, untuk: next });
  };

  const handleTidakAkanToggle = (idx: number) => {
    if (readOnly || isSaved) return;
    const next = tidakAkan.includes(komitmenTidakAkan[idx].text)
      ? tidakAkan.filter((t) => t !== komitmenTidakAkan[idx].text)
      : [...tidakAkan, komitmenTidakAkan[idx].text];
    onSave({ ...answers, tidakAkan: next });
  };

  // Canvas drawing handlers
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly || isSaved) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || readOnly || isSaved) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Save signature as data URL
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave({ ...answers, signature: dataUrl });
    }
  };

  const clearSignature = () => {
    if (readOnly || isSaved) return;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
    onSave({ ...answers, signature: '' });
  };

  const handleTandaTangani = () => {
    if (readOnly || isSaved) return;
    if (!nama.trim()) {
      alert('Harap isi nama lengkapmu terlebih dahulu! ✍️');
      return;
    }
    if (untuk.length < komitmenUntuk.length) {
      alert('Harap centang seluruh komitmen "Aku akan..." sebelum menandatangani! ✅');
      return;
    }
    if (tidakAkan.length < komitmenTidakAkan.length) {
      alert('Harap centang seluruh komitmen "Aku tidak akan..." sebelum menandatangani! 🚫');
      return;
    }
    if (!hasSignature || !savedSignature) {
      alert('Harap buat tanda tanganmu di area yang tersedia! ✍️');
      return;
    }

    // Fire confetti!
    canvasConfetti({
      particleCount: 100,
      spread: 70,
      startVelocity: 40,
      origin: { y: 0.55 },
      colors: ['#6366f1', '#8b5cf6', '#a855f7', '#f59e0b', '#fbbf24'],
      shapes: ['star', 'circle'],
      scalar: 1.1,
    });

    window.setTimeout(() => {
      canvasConfetti({
        particleCount: 60,
        spread: 50,
        startVelocity: 30,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#f59e0b'],
        shapes: ['circle'],
      });
      canvasConfetti({
        particleCount: 60,
        spread: 50,
        startVelocity: 30,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#f59e0b'],
        shapes: ['circle'],
      });
    }, 200);

    onSave({ ...answers, isSaved: true });
    // Show certificate after a small delay for animation
    window.setTimeout(() => {
      setShowCertificate(true);
    }, 300);
  };

  const semuaKomitmenTercentang =
    untuk.length >= komitmenUntuk.length && tidakAkan.length >= komitmenTidakAkan.length;

  return (
    <div className="relative mt-8 max-w-2xl mx-auto" style={{
      '--activity-accent': '#6366f1',
      '--activity-accent-strong': '#4f46e5',
    } as React.CSSProperties}>
      {/* Main Certificate Card */}
      <div className="relative rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-indigo-50 via-white to-indigo-50/30 p-6 sm:p-8 shadow-xl text-left space-y-6 overflow-hidden">
        {/* Decorative corner ornaments */}
        <div className="absolute top-0 left-0 w-20 h-20 opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-indigo-600">
            <path d="M0 0 Q20 10 10 20 Q5 30 0 50 Z M0 0 Q30 2 50 0 Z" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.07] pointer-events-none rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-indigo-600">
            <path d="M0 0 Q20 10 10 20 Q5 30 0 50 Z M0 0 Q30 2 50 0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-20 h-20 opacity-[0.07] pointer-events-none -rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-indigo-600">
            <path d="M0 0 Q20 10 10 20 Q5 30 0 50 Z M0 0 Q30 2 50 0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.07] pointer-events-none rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-indigo-600">
            <path d="M0 0 Q20 10 10 20 Q5 30 0 50 Z M0 0 Q30 2 50 0 Z" />
          </svg>
        </div>

        {/* Top decorative line */}
        <div className="flex items-center justify-center gap-2 -mt-2">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-indigo-400 rounded-full" />
          <Medal className="h-5 w-5 text-indigo-400 flex-shrink-0" />
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-indigo-300 to-indigo-400 rounded-full" />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-100 border border-indigo-200 px-4 py-1 rounded-full">
            <BadgeCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">
              Kartu Komitmen Warga Digital
            </span>
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 pt-1 leading-tight">
            Ikrar Penjelajah Digital Cerdas
          </h3>
          <p className="text-[9px] text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
            Dengan ini aku menyatakan komitmenku sebagai warga digital yang cerdas, aman, dan bertanggung jawab.
          </p>
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            Nama Lengkap Penjelajah Digital:
          </label>
          <input
            type="text"
            value={nama}
            disabled={readOnly || isSaved}
            onChange={(e) => handleNamaChange(e.target.value)}
            placeholder="Ketik nama lengkapmu di sini..."
            className="w-full rounded-2xl border-2 border-indigo-100 bg-white px-5 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500 font-bold transition-all duration-300"
          />
        </div>

        {/* Komitmen Section */}
        <div className="space-y-5">
          {/* "Aku akan..." */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Komitmen Positif (Aku Akan...):
            </label>
            <div className="space-y-2">
              {komitmenUntuk.map((item, idx) => {
                const isChecked = untuk.includes(item.text);
                return (
                  <motion.div
                    key={idx}
                    whileTap={readOnly || isSaved ? {} : { scale: 0.98 }}
                    onClick={() => handleUntukToggle(idx)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${readOnly || isSaved ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'
                      } ${isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                        : 'bg-white border-slate-150 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/30'
                      }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-250 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-[12px] leading-snug font-semibold">
                      <span className="mr-1.5">{item.icon}</span>
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* "Aku tidak akan..." */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Batasan Diri (Aku Tidak Akan...):
            </label>
            <div className="space-y-2">
              {komitmenTidakAkan.map((item, idx) => {
                const isChecked = tidakAkan.includes(item.text);
                return (
                  <motion.div
                    key={idx}
                    whileTap={readOnly || isSaved ? {} : { scale: 0.98 }}
                    onClick={() => handleTidakAkanToggle(idx)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-300 ${readOnly || isSaved ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'
                      } ${isChecked
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
                        : 'bg-white border-slate-150 text-slate-600 hover:border-rose-200 hover:bg-rose-50/30'
                      }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isChecked
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'border-slate-250 bg-white'
                        }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-[12px] leading-snug font-semibold">
                      <span className="mr-1.5">{item.icon}</span>
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="pt-3 border-t-2 border-dashed border-indigo-100 space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <PenLine className="h-3 w-3" />
            Tanda Tangan Digital:
          </label>

          {/* Signature Canvas */}
          <div className="relative rounded-2xl border-2 border-indigo-100 bg-white overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={500}
              height={160}
              className={`w-full h-40 touch-none ${readOnly || isSaved ? 'cursor-default' : 'cursor-crosshair'}`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ touchAction: 'none' }}
            />
            {/* Dotted guide line */}
            {!hasSignature && !readOnly && (
              <div className="absolute bottom-10 left-8 right-8 border-b-2 border-dotted border-slate-200 pointer-events-none" />
            )}
            {!hasSignature && !readOnly && !isSaved && (
              <p className="absolute inset-0 flex items-center justify-center text-xs text-slate-300 pointer-events-none select-none font-medium">
                ✍️ Tanda tangani di area ini dengan mouse atau jarimu
              </p>
            )}

            {/* Show saved signature image when readOnly */}
            {readOnly && savedSignature && (
              <img
                src={savedSignature}
                alt="Tanda tangan"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              />
            )}
          </div>

          {/* Signature controls */}
          {!readOnly && !isSaved && hasSignature && (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                <Eraser className="h-3 w-3" />
                Hapus & Ulangi
              </button>
            </div>
          )}

          {/* Signature preview when readOnly and signed */}
          {readOnly && savedSignature && (
            <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-success-600">
              <Check className="h-3 w-3" />
              Tertanda tangani
            </div>
          )}
        </div>

        {/* Submit / Status Section */}
        <div className="pt-4 border-t-2 border-dashed border-indigo-100">
          {isSaved ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center space-y-3"
            >
              {/* Certificate Inline */}
              <div className="relative bg-gradient-to-b from-[#fefefe] via-white to-[#faf8ff] rounded-2xl shadow-xl overflow-hidden border-4 border-double border-indigo-200">
                <div className="p-4 sm:p-6 border-2 border-indigo-100 rounded-xl relative overflow-hidden text-center space-y-4" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}>
                  {/* Ornaments */}
                  <div className="absolute top-1 left-3 text-2xl opacity-8 pointer-events-none select-none text-indigo-400">✦</div>
                  <div className="absolute top-1 right-3 text-2xl opacity-8 pointer-events-none select-none text-indigo-400">✦</div>

                  {/* Top seal */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 border-2 border-indigo-200 px-4 py-1 rounded-full">
                      <BadgeCheck className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-[8px] font-black uppercase tracking-[0.15em] text-indigo-600">Sertifikat Resmi</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="font-display font-black text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 leading-tight">
                      SERTIFIKAT PENJELAJAH DIGITAL CERDAS
                    </h2>
                    <div className="mx-auto mt-1.5 w-12 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                  </div>

                  {/* Body */}
                  <div className="space-y-1.5">
                    <p className="text-slate-500 font-medium text-[11px]">Dengan ini dinyatakan bahwa:</p>
                    <p className="font-display font-black text-lg sm:text-xl text-indigo-700 py-1.5 px-3 bg-indigo-50/50 rounded-xl border border-indigo-100 inline-block">
                      {nama}
                    </p>
                    <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
                      telah resmi terdaftar sebagai <strong className="text-indigo-700">Penjelajah Digital Cerdas</strong>
                      {' '}dengan komitmen penuh untuk menjadi warga digital yang aman, bijak, dan bertanggung jawab.
                    </p>
                  </div>

                  {/* Signature & Date */}
                  <div className="flex justify-between items-end pt-2 gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-[9px] text-slate-400 font-bold mb-6 border-b border-dashed border-slate-300 pb-1">
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">Tanggal</p>
                    </div>
                    <div className="flex-1 text-center">
                      {savedSignature && (
                        <div className="flex flex-col items-center">
                          <img
                            src={savedSignature}
                            alt="Tanda tangan"
                            className="h-14 object-contain opacity-90"
                          />
                          <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Tanda Tangan Digital</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stamp */}
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-lg border-[3px] border-white opacity-90 rotate-12">
                    <div className="text-center -rotate-12">
                      <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />
                      <span className="text-[7px] sm:text-[8px] font-black leading-tight block mt-0.5">TERDAFTAR<br />RESMI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Congratulatory message */}
              <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 text-center space-y-1.5">
                <div className="flex justify-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] font-extrabold text-amber-800 leading-relaxed">
                  🎉 Selamat, <strong className="text-indigo-700">{nama}</strong>! Komitmenmu adalah langkah pertama untuk menjadikan dunia digital tempat yang aman dan positif!
                </p>
              </div>

              {/* Tombol untuk melihat ulang sertifikat */}
              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 border-2 bg-white border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <Award className="h-4 w-4" />
                🔍 Lihat Sertifikat
              </button>
            </motion.div>
          ) : !readOnly ? (
            <button
              type="button"
              onClick={handleTandaTangani}
              disabled={
                !nama.trim() ||
                !semuaKomitmenTercentang ||
                !hasSignature
              }
              className={`w-full py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2.5 border-2 shadow-lg ${nama.trim() && semuaKomitmenTercentang && hasSignature
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
              <PenLine className="h-4 w-4" />
              {nama.trim() && semuaKomitmenTercentang && hasSignature
                ? 'Tandatangani & Resmikan Komitmen! ✍️'
                : 'Lengkapi Semua Bagian untuk Menandatangani'}
            </button>
          ) : null}

          {/* Progress indicator when not yet saved */}
          {!isSaved && !readOnly && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[9px] font-bold text-slate-400">
              <span className={`flex items-center gap-1 ${nama.trim() ? 'text-emerald-500' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${nama.trim() ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Nama
              </span>
              <span className={`flex items-center gap-1 ${semuaKomitmenTercentang ? 'text-emerald-500' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${semuaKomitmenTercentang ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Komitmen
              </span>
              <span className={`flex items-center gap-1 ${hasSignature ? 'text-emerald-500' : ''}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasSignature ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Tanda Tangan
              </span>
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className="flex items-center justify-center gap-2 -mb-2">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-indigo-400 rounded-full" />
          <Heart className="h-4 w-4 text-rose-300 fill-rose-300 flex-shrink-0" />
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-indigo-300 to-indigo-400 rounded-full" />
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg relative"
            >
              {/* Certificate Paper */}
              <div className="relative bg-gradient-to-b from-[#fefefe] via-white to-[#faf8ff] rounded-2xl shadow-2xl overflow-hidden border-8 border-double border-indigo-200">
                {/* Certificate Border Inner */}
                <div className="m-3 p-6 sm:p-8 border-2 border-indigo-100 rounded-xl relative overflow-hidden text-center space-y-5" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}>
                  {/* Ornaments */}
                  <div className="absolute top-2 left-4 text-3xl opacity-10 pointer-events-none select-none">✦</div>
                  <div className="absolute top-2 right-4 text-3xl opacity-10 pointer-events-none select-none">✦</div>
                  <div className="absolute bottom-2 left-4 text-3xl opacity-10 pointer-events-none select-none">✦</div>
                  <div className="absolute bottom-2 right-4 text-3xl opacity-10 pointer-events-none select-none">✦</div>

                  {/* Top seal */}
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 border-2 border-indigo-200 px-5 py-1.5 rounded-full">
                      <BadgeCheck className="h-4 w-4 text-indigo-600" />
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">Sertifikat Resmi</span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="font-display font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 leading-tight">
                      SERTIFIKAT<br />PENJELAJAH DIGITAL CERDAS
                    </h2>
                    <div className="mx-auto mt-2 w-16 h-[3px] rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
                  </div>

                  {/* Body text */}
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600 leading-relaxed font-medium text-[12px]">
                      Dengan ini dinyatakan bahwa:
                    </p>
                    <motion.h3
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-display font-black text-xl sm:text-2xl text-indigo-700 py-2 px-4 bg-indigo-50/50 rounded-xl border border-indigo-100 inline-block mx-auto"
                    >
                      {nama}
                    </motion.h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-[12px]">
                      telah resmi terdaftar sebagai <strong className="text-indigo-700">Penjelajah Digital Cerdas</strong>
                      dengan komitmen penuh untuk menjadi warga digital yang aman, bijak, dan bertanggung jawab.
                    </p>
                  </div>

                  {/* Signature & Date */}
                  <div className="flex justify-between items-end pt-3 gap-6">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] text-slate-400 font-bold mb-10 border-b border-dashed border-slate-300 pb-1">
                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Tanggal</p>
                    </div>
                    <div className="flex-1 text-center">
                      {savedSignature && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={savedSignature}
                            alt="Tanda tangan"
                            className="h-20 object-contain opacity-90"
                          />
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-1">
                            Tanda Tangan Digital
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Digital Badge/Stamp */}
                  <motion.div
                    initial={{ rotate: -15, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                    className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-xl border-4 border-white opacity-90 rotate-12"
                  >
                    <div className="text-center -rotate-12">
                      <BadgeCheck className="h-6 w-6 sm:h-7 sm:w-7 mx-auto" />
                      <span className="text-[8px] sm:text-[9px] font-black leading-tight block mt-0.5">TERDAFTAR<br />RESMI</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowCertificate(false)}
                  className="px-6 py-3 bg-white border-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black shadow-lg transition-all hover:shadow-xl"
                >
                  🎉 Keren! Tutup Sertifikat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AyoMengamatiTopik2GamifiedProps {
  answers: Record<string, any>;
  onSave: (val: Record<string, any>) => void;
}

export function AyoMengamatiTopik2Gamified({
  answers = {},
  onSave,
}: AyoMengamatiTopik2GamifiedProps) {
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

  const isSubmitted = !!answers._submitted;

  const messages = [
    {
      id: 'msg-1',
      sender: 'Wali Kelas Ibu Rini (Grup Resmi)',
      avatar: 'WR',
      avatarGradient: 'from-blue-500 to-indigo-600',
      time: '08:15',
      text: 'Besok sekolah mengadakan kegiatan Jumat Bersih. Murid membawa alat kebersihan dari rumah. Informasi ini disampaikan oleh wali kelas melalui grup resmi kelas.',
      correct: 'benar',
      explanation: 'Benar! Informasi ini dikirim oleh wali kelas melalui grup kelas resmi dan memiliki instruksi serta sumber yang sangat jelas.',
      isExample: true,
      exampleData: {
        kesimpulan: 'benar',
        alasan: 'Informasi dikirim oleh Wali Kelas melalui grup resmi kelas. Isinya sangat logis, memiliki instruksi jelas, dan bersumber dari otoritas resmi sekolah.',
        tindakLanjut: 'Membaca pengumuman dengan teliti dan mempersiapkan peralatan Jumat Bersih yang diperlukan untuk dibawa ke sekolah besok pagi.'
      }
    },
    {
      id: 'msg-2',
      sender: 'Nomor Tidak Dikenal',
      avatar: 'ND',
      avatarGradient: 'from-slate-500 to-slate-700',
      time: '09:30',
      text: 'Katanya minggu depan sekolah libur satu minggu. Sebarkan cepat ke semua teman!',
      correct: 'meragukan',
      explanation: 'Meragukan! Berita ini dikirim oleh nomor tidak dikenal, tidak memiliki surat resmi, menggunakan kata "katanya", dan memaksa agar segera disebarkan.',
      correctAlasan: 'Karena dikirim oleh nomor tidak dikenal, menggunakan kata "katanya", dan memaksa untuk segera disebarkan tanpa pengumuman resmi.',
      correctTindakLanjut: 'Mengabaikan pesan ini and menanyakannya langsung ke guru atau orang tua untuk memastikan.',
      alasanChoices: [
        'Karena pesan dikirim oleh wali kelas resmi sekolah di grup belajar.',
        'Karena dikirim oleh nomor tidak dikenal, menggunakan kata "katanya", dan memaksa untuk segera disebarkan tanpa pengumuman resmi.',
        'Karena berita tentang libur sekolah selalu dikirim secara acak lewat SMS.'
      ],
      tindakLanjutChoices: [
        'Langsung membagikan pesan ini ke grup chat keluarga dan teman bermain.',
        'Mengabaikan pesan ini and menanyakannya langsung ke guru atau orang tua untuk memastikan.',
        'Membuat rencana liburan karena sudah pasti sekolah akan libur.'
      ]
    },
    {
      id: 'msg-3',
      sender: 'Bonus Sepeda Gratis',
      avatar: 'BG',
      avatarGradient: 'from-amber-500 to-rose-500',
      time: '14:20',
      text: 'Klik tautan ini agar kamu mendapat hadiah sepeda gratis. Isi nama lengkap, alamat rumah, nomor telepon, dan foto kartu keluarga.',
      correct: 'meragukan',
      explanation: 'Meragukan! Ini adalah taktik pencurian data pribadi (phishing). Jangan klik tautan asing yang meminta data sensitif keluarga Anda.',
      correctAlasan: 'Tautan tidak resmi yang meminta data pribadi sensitif (seperti Kartu Keluarga) dengan iming-iming hadiah gratis.',
      correctTindakLanjut: 'Tidak mengklik tautan tersebut, tidak membagikan data pribadi, dan melapor ke orang tua.',
      alasanChoices: [
        'Hadiah sepeda gratis adalah program resmi dari Kementerian Pendidikan.',
        'Situs tersebut aman karena menawarkan hadiah sepeda bermerek.',
        'Tautan tidak resmi yang meminta data pribadi sensitif (seperti Kartu Keluarga) dengan iming-iming hadiah gratis.'
      ],
      tindakLanjutChoices: [
        'Mengisi semua data pribadi dan mengunggah foto Kartu Keluarga agar dapat hadiah.',
        'Tidak mengklik tautan tersebut, tidak membagikan data pribadi, dan melapor ke orang tua.',
        'Membagikan tautan ini ke semua teman kelas agar mereka juga dapat sepeda.'
      ]
    },
    {
      id: 'msg-4',
      sender: 'Pusat Bantuan Game',
      avatar: 'PB',
      avatarGradient: 'from-red-500 to-orange-600',
      time: '16:45',
      text: 'Pusat Bantuan Game mendeteksi aktivitas mencurigakan di akunmu. Kirimkan kode OTP yang masuk ke HP-mu sekarang untuk verifikasi akun!',
      correct: 'meragukan',
      explanation: 'Meragukan! Ini adalah taktik phishing/pengambilalihan akun. Jangan pernah membagikan kode OTP atau kata sandi Anda kepada siapa pun.',
      correctAlasan: 'Pesan mencurigakan yang meminta kode OTP (One-Time Password) rahasia yang bisa digunakan untuk mencuri akun game.',
      correctTindakLanjut: 'Merahasiakan kode OTP, tidak membagikannya kepada siapa pun, dan mengabaikan pesan tersebut.',
      alasanChoices: [
        'Pesan mencurigakan yang meminta kode OTP (One-Time Password) rahasia yang bisa digunakan untuk mencuri akun game.',
        'Pesan berasal dari pengembang resmi game yang ingin membantu mengamankan akun.',
        'Pesan dikirim oleh teman dekat yang ingin meminjam akun game.'
      ],
      tindakLanjutChoices: [
        'Segera mengirimkan kode OTP agar akun game tidak dihapus.',
        'Memberikan kata sandi utama game agar admin bisa memverifikasi sendiri.',
        'Merahasiakan kode OTP, tidak membagikannya kepada siapa pun, dan mengabaikan pesan tersebut.'
      ]
    },
    {
      id: 'msg-5',
      sender: 'Dito (Teman Sekelas)',
      avatar: 'DT',
      avatarGradient: 'from-teal-400 to-emerald-600',
      time: '19:10',
      text: 'Eh guys, buruan coba web ini http://free-robux-diamond-sepuasnya.blogspot.com bisa dapet robux sama diamond gratis tis tis! Aku baru aja nyoba nih!',
      correct: 'meragukan',
      explanation: 'Meragukan! Pesan ini berisi tautan tidak resmi (blogspot) yang menjanjikan keuntungan instan (gratis). Ini adalah modus pencurian akun.',
      correctAlasan: 'Situs menggunakan domain gratisan tidak resmi (blogspot) dan menjanjikan hadiah instan gratis, yang merupakan tanda penipuan.',
      correctTindakLanjut: 'Tidak mengklik link tersebut, serta mengingatkan Dito bahwa link itu mencurigakan/berbahaya.',
      alasanChoices: [
        'Karena link tersebut dibagikan oleh teman sekelas, maka sudah pasti aman dan terbukti.',
        'Situs menggunakan domain gratisan tidak resmi (blogspot) dan menjanjikan hadiah instan gratis, yang merupakan tanda penipuan.',
        'Roblox memang bekerja sama dengan blogspot untuk membagikan robux gratis.'
      ],
      tindakLanjutChoices: [
        'Membuka tautan tersebut dan memasukkan username serta password akun game.',
        'Tidak mengklik link tersebut, serta mengingatkan Dito bahwa link itu mencurigakan/berbahaya.',
        'Mengirimkan link tersebut ke grup game agar orang lain bisa ikut mencoba.'
      ]
    }
  ];

  const getVal = (key: string) => {
    if (key === 'msg-1') return 'benar';
    if (key === 'msg-1_alasan') {
      return messages[0].exampleData!.alasan;
    }
    if (key === 'msg-1_tindakLanjut') {
      return messages[0].exampleData!.tindakLanjut;
    }
    return answers[key] || '';
  };

  const handleSelectType = (msgId: string, val: string) => {
    if (isSubmitted || msgId === 'msg-1') return;
    onSave({ ...answers, [msgId]: val });
  };

  const handleTextChange = (key: string, val: string) => {
    if (isSubmitted || key.startsWith('msg-1')) return;
    onSave({ ...answers, [key]: val });
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    const finalAnswers = {
      ...answers,
      'msg-1': 'benar',
      'msg-1_alasan': messages[0].exampleData!.alasan,
      'msg-1_tindakLanjut': messages[0].exampleData!.tindakLanjut,
      _submitted: true
    };
    onSave(finalAnswers);

    const allCorrect = messages.every(m => {
      const val = m.id === 'msg-1' ? 'benar' : (finalAnswers as Record<string, any>)[m.id];
      return val === m.correct;
    });
    if (allCorrect) {
      canvasConfetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.8 }
      });
    }
  };

  const isMsgAnswered = (m: typeof messages[0]) => {
    if (m.id === 'msg-1') return true;
    return answers[m.id] !== undefined && answers[m.id + '_alasan'] && answers[m.id + '_tindakLanjut'];
  };

  const totalAnswered = messages.filter(isMsgAnswered).length;
  const currentMsg = messages.find(m => m.id === selectedMsgId);

  const getDetectiveRank = (count: number) => {
    if (count <= 1) return { label: 'Detektif Pemula 🔎', percent: 20, color: 'bg-slate-400' };
    if (count === 2) return { label: 'Detektif Muda 🕵️', percent: 40, color: 'bg-blue-400' };
    if (count === 3) return { label: 'Detektif Madya 🎖️', percent: 60, color: 'bg-indigo-500' };
    if (count === 4) return { label: 'Detektif Ahli 🏅', percent: 80, color: 'bg-emerald-500' };
    return { label: 'Detektif Utama 🏆', percent: 100, color: 'bg-gradient-to-r from-amber-500 to-yellow-500' };
  };

  const rank = getDetectiveRank(totalAnswered);

  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50/20 p-6 shadow-md text-left mt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-100/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-black text-gray-800 text-sm">
                Aktivitas 1: Detektif Pesan Masuk
              </h3>
              <p className="text-[11px] text-gray-500 leading-normal font-semibold">
                Periksalah kelima pesan yang masuk ke dalam HP simulator di bawah ini.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-150 rounded-2xl p-3 shadow-2xs min-w-[200px] space-y-1.5 self-start">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500">Pangkat Detektif:</span>
            <span className="text-amber-600 font-extrabold uppercase">{rank.label}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 ${rank.color}`} style={{ width: `${rank.percent}%` }}></div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-slate-400">
            <span>Progress: {totalAnswered}/5 Analisis</span>
            <span>{Math.round(rank.percent)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 lg:col-span-4 flex justify-center">
          <div className="w-full max-w-[290px] h-[540px] rounded-[3rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col relative font-sans text-slate-800 select-none ring-4 ring-slate-800/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
              <div className="w-10 h-1 bg-slate-950 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-950 rounded-full border border-slate-700/50 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full opacity-60"></div>
              </div>
            </div>

            <div className="h-11 bg-[#111b21] text-[10px] text-slate-400 px-6 pt-4 flex justify-between items-center z-10">
              <span className="font-bold text-[9.5px] text-slate-350">09:41</span>
              <div className="flex items-center gap-1.5">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 18h2v2H3zm4-4h2v6H7zm4-4h2v10h-2zm4-4h2v14h-2zm4-4h2v18h-2z" />
                </svg>
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm0-6a5.97 5.97 0 0 0-4.24-1.76 1 1 0 1 1 1.41-1.42A3.98 3.98 0 0 1 12 13a3.98 3.98 0 0 1 2.83-1.18 1 1 0 1 1 1.41 1.42A5.97 5.97 0 0 0 12 15Zm0-6a9.97 9.97 0 0 0-7.07-2.93 1 1 0 0 1 1.41-1.42A7.98 7.98 0 0 1 12 7a7.98 7.98 0 0 1 5.66-2.35 1 1 0 1 1 1.41 1.42A9.97 9.97 0 0 0 12 9Z" />
                </svg>
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Zm3-11h1v6h-1Z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 bg-[#efeae2] flex flex-col overflow-hidden relative border-t border-slate-900/50">
              {selectedMsgId === null ? (
                <div className="flex flex-col h-full bg-[#111b21]">
                  <div className="bg-[#202c33] text-slate-100 p-4 pt-2 pb-3 flex items-center justify-between shadow-md">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-200">SiberChat</span>
                    <div className="flex items-center gap-3 opacity-80">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#222e35] bg-[#111b21]">
                    {messages.map((m) => {
                      const userChoice = m.id === 'msg-1' ? 'benar' : answers[m.id];
                      const isDone = isMsgAnswered(m);
                      const isCorrect = userChoice === m.correct;

                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMsgId(m.id)}
                          className="p-3.5 hover:bg-[#202c33] cursor-pointer flex items-center gap-3 transition-all duration-150 group"
                        >
                          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${m.avatarGradient} text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#111b21]`}>
                            {m.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="text-[10px] font-black text-slate-100 group-hover:text-amber-400 truncate flex items-center gap-1.5">
                                {m.sender}
                                {m.isExample && (
                                  <span className="text-[7.5px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1 py-0.25 rounded font-black tracking-wide uppercase">
                                    Contoh
                                  </span>
                                )}
                              </span>
                              <span className="text-[8px] text-slate-400">{m.time}</span>
                            </div>
                            <p className="text-[9px] text-slate-400 truncate font-semibold leading-relaxed">{m.text}</p>
                          </div>
                          <div className="flex items-center pl-1">
                            {isSubmitted ? (
                              isCorrect ? (
                                <svg className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="h-4.5 w-4.5 text-rose-500 fill-rose-500/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )
                            ) : isDone ? (
                              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></div>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full bg-[#efeae2]">
                  <div className="bg-[#202c33] text-slate-100 p-3 pt-2 pb-2.5 flex items-center gap-2.5 shadow-md">
                    <button
                      type="button"
                      onClick={() => setSelectedMsgId(null)}
                      className="text-slate-300 hover:text-white hover:bg-slate-700/30 -ml-1.5 p-1 rounded-full transition-all"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${currentMsg?.avatarGradient} text-white flex items-center justify-center font-bold text-[10.5px] shadow-sm`}>
                      {currentMsg?.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black leading-tight text-slate-100 truncate">{currentMsg?.sender}</p>
                      <p className="text-[7.5px] text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span> online
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3.5 bg-[#efeae2]">
                    <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none p-3 shadow-xs text-left relative border border-slate-200/50">
                      <div className="absolute -left-1.5 top-0 w-2.5 h-3 bg-white border-l border-t border-slate-200/50" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                      <p className="text-[9.5px] leading-relaxed text-gray-800 font-medium pb-2">{currentMsg?.text}</p>
                      <span className="text-[7px] text-gray-400 absolute bottom-1 right-2.5 font-bold">{currentMsg?.time}</span>
                    </div>

                    {isMsgAnswered(currentMsg!) && (
                      <div className="max-w-[85%] bg-[#d9fdd3] text-slate-800 rounded-2xl rounded-tr-none p-3 shadow-xs text-left self-end ml-auto relative border border-[#c1e9bb] animate-fade-in flex flex-col gap-1">
                        <div className="absolute -right-1.5 top-0 w-2.5 h-3 bg-[#d9fdd3] border-r border-t border-[#c1e9bb]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                        <div className="flex items-center gap-1 text-[8px] font-black text-[#1b8a13] uppercase tracking-wide">
                          <span>🕵️‍♂️ LAPORAN DETEKTIF</span>
                        </div>
                        <div className="text-[9px] space-y-1.5 leading-relaxed font-semibold">
                          <p>
                            <span className="text-slate-500 font-bold block text-[8px] uppercase tracking-wide">Kesimpulan:</span>
                            <span className="font-extrabold text-[#111b21] bg-white/60 px-1.5 py-0.5 rounded border border-[#b5deb1] inline-block mt-0.5">
                              {getVal(currentMsg!.id) === 'benar' ? '✅ BENAR (Valid)' : '❓ MERAGUKAN'}
                            </span>
                          </p>
                          <p>
                            <span className="text-slate-500 font-bold block text-[8px] uppercase tracking-wide">Alasan:</span>
                            <span className="text-slate-800 line-clamp-3 block">{getVal(currentMsg!.id + '_alasan')}</span>
                          </p>
                          <p>
                            <span className="text-slate-500 font-bold block text-[8px] uppercase tracking-wide">Tindak Lanjut:</span>
                            <span className="text-slate-800 line-clamp-3 block">{getVal(currentMsg!.id + '_tindakLanjut')}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {isSubmitted && (
                      <div className={`max-w-[95%] mx-auto rounded-xl p-3 border text-left flex gap-2 shadow-2xs ${getVal(currentMsg!.id) === currentMsg!.correct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}>
                        <span className="text-sm">🕵️‍♂️</span>
                        <div className="space-y-0.5">
                          <p className="text-[9.5px] font-extrabold flex items-center gap-1">
                            {getVal(currentMsg!.id) === currentMsg!.correct ? (
                              <span className="text-emerald-700">Analisis Tepat! ✔️</span>
                            ) : (
                              <span className="text-rose-700">Analisis Kurang Tepat! ❌</span>
                            )}
                          </p>
                          <p className="text-[8.5px] leading-relaxed font-semibold">{currentMsg?.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-2 select-none">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[8.5px] text-slate-400 font-semibold flex items-center gap-1.5 shadow-2xs">
                      <svg className="h-3.5 w-3.5 opacity-40 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Tulis laporan di panel kanan...</span>
                    </div>
                    <div className="h-7.5 w-7.5 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-2xs cursor-not-allowed">
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 space-y-4 bg-slate-50/50 border border-slate-150 p-5 rounded-3xl shadow-2xs">
          {selectedMsgId === null ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center animate-bounce shadow-md shadow-amber-200/50">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <h4 className="font-display font-black text-gray-800 text-sm">Lembar Kerja Analisis Detektif</h4>
              <p className="text-xs text-gray-500 max-w-sm leading-relaxed font-semibold">
                Pilih salah satu baris pesan pada simulator HP di sebelah kiri untuk menganalisis kesimpulan, menulis alasan, dan merancang tindak lanjutmu.
              </p>

              <div className="text-[10px] text-amber-700 bg-amber-100/60 border border-amber-250 px-4 py-1.5 rounded-full font-black tracking-wide">
                📁 Telah Menganalisis: {totalAnswered} dari 5 Pesan
              </div>

              {!isSubmitted && totalAnswered === 5 && (
                <div className="pt-4 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-250 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Kirim Analisis Pesan Ke Guru 🚀
                  </button>
                </div>
              )}

              {isSubmitted && (
                <div className="pt-4 p-5 bg-emerald-50 border border-emerald-250 rounded-2xl max-w-sm text-center shadow-2xs space-y-1">
                  <p className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1">
                    🎉 Jawaban Berhasil Dikunci!
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold leading-normal">
                    Skor Analisis: {messages.filter(m => getVal(m.id) === m.correct).length * 20}% ({messages.filter(m => getVal(m.id) === m.correct).length} dari 5 pesan dianalisis dengan benar).
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 text-left">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3 gap-2">
                <div>
                  <span className="text-[8.5px] font-black uppercase text-amber-600 tracking-widest block mb-0.5">
                    Form Lembar Kerja Detektif
                  </span>
                  <h4 className="font-display font-black text-gray-800 text-sm flex items-center gap-1.5">
                    {currentMsg?.sender}
                    {currentMsg?.isExample && (
                      <span className="text-[7.5px] bg-amber-100 text-amber-800 border border-amber-250 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                        Contoh
                      </span>
                    )}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMsgId(null)}
                  className="text-[10px] font-black text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-slate-50 transition-all cursor-pointer flex-shrink-0"
                >
                  Kembali ke Menu Utama
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-2xs space-y-1">
                <span className="text-[8.5px] font-bold text-slate-400 block uppercase tracking-wide">Isi Pesan Masuk:</span>
                <p className="text-[11.5px] italic text-slate-700 leading-relaxed font-semibold">"{currentMsg?.text}"</p>
              </div>

              {currentMsg?.isExample && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-3 rounded-2xl text-xs flex gap-2.5 font-medium shadow-2xs">
                  <span className="text-lg">🕵️‍♂️</span>
                  <div className="space-y-0.5">
                    <p className="font-black text-amber-950 uppercase tracking-wide text-[9.5px]">Contoh Analisis Terisi</p>
                    <p className="text-[10.5px] text-amber-800 leading-normal font-semibold">
                      Ini adalah contoh cara menganalisis pesan dan mengisi jawaban yang benar. Silakan dibaca untuk panduan mengerjakannya!
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  1. Bagaimana kesimpulanmu terhadap pesan di atas?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['benar', 'meragukan'].map((type) => {
                    const isSelected = getVal(currentMsg!.id) === type;
                    let btnClass = 'border-slate-200 bg-white text-slate-650 hover:border-amber-300';
                    if (isSelected) {
                      btnClass = type === 'benar'
                        ? 'bg-emerald-500 border-emerald-500 text-white font-black shadow-md shadow-emerald-100 hover:bg-emerald-600'
                        : 'bg-amber-500 border-amber-500 text-white font-black shadow-md shadow-amber-100 hover:bg-amber-600';
                    }
                    if (currentMsg?.isExample) {
                      btnClass += ' opacity-80 cursor-not-allowed';
                    }

                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={isSubmitted || currentMsg?.isExample}
                        onClick={() => handleSelectType(currentMsg!.id, type)}
                        className={`py-3 rounded-xl border text-[10.5px] font-black transition-all uppercase tracking-wider cursor-pointer ${btnClass}`}
                      >
                        {type === 'benar' ? '✔ Benar (Valid)' : '❓ Meragukan (Hoaks?)'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                  2. Alasan mengapa pesan tersebut kamu anggap Benar atau Meragukan:
                </label>
                {currentMsg?.alasanChoices ? (
                  <div className="flex flex-col gap-2">
                    {currentMsg.alasanChoices.map((choiceText) => {
                      const isSelected = getVal(currentMsg.id + '_alasan') === choiceText;
                      const isCorrectChoice = choiceText === (currentMsg as any).correctAlasan;
                      let choiceBtnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                      if (isSelected) {
                        choiceBtnClass = isCorrectChoice
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                          : 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs';
                      }

                      return (
                        <button
                          key={choiceText}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleTextChange(currentMsg.id + '_alasan', choiceText)}
                          className={`text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${choiceBtnClass}`}
                        >
                          <span>{choiceText}</span>
                          {isSelected && (
                            <span className="shrink-0 text-sm">
                              {isCorrectChoice ? '✅' : '❌'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={getVal(currentMsg!.id + '_alasan')}
                    disabled={isSubmitted || currentMsg?.isExample}
                    onChange={(e) => handleTextChange(currentMsg!.id + '_alasan', e.target.value)}
                    placeholder="Contoh: Karena dikirim oleh guru kelas secara resmi / Karena tautannya tidak jelas menggunakan blogspot..."
                    rows={3}
                    className="w-full rounded-2xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:bg-slate-100/70 font-semibold leading-relaxed"
                  />
                )}
              </div>

              <div className="space-y-2.5">
                <label className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
                  3. Apa tindak lanjut yang harus kamu lakukan?
                </label>
                {currentMsg?.tindakLanjutChoices ? (
                  <div className="flex flex-col gap-2">
                    {currentMsg.tindakLanjutChoices.map((choiceText) => {
                      const isSelected = getVal(currentMsg.id + '_tindakLanjut') === choiceText;
                      const isCorrectChoice = choiceText === (currentMsg as any).correctTindakLanjut;
                      let choiceBtnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';
                      if (isSelected) {
                        choiceBtnClass = isCorrectChoice
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                          : 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs';
                      }

                      return (
                        <button
                          key={choiceText}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleTextChange(currentMsg.id + '_tindakLanjut', choiceText)}
                          className={`text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${choiceBtnClass}`}
                        >
                          <span>{choiceText}</span>
                          {isSelected && (
                            <span className="shrink-0 text-sm">
                              {isCorrectChoice ? '✅' : '❌'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={getVal(currentMsg!.id + '_tindakLanjut')}
                    disabled={isSubmitted || currentMsg?.isExample}
                    onChange={(e) => handleTextChange(currentMsg!.id + '_tindakLanjut', e.target.value)}
                    placeholder="Contoh: Menghapus pesan / Mengonfirmasi langsung ke guru / Memblokir nomor pengirim..."
                    rows={3}
                    className="w-full rounded-2xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:bg-slate-100/70 font-semibold leading-relaxed"
                  />
                )}
              </div>

              {!isSubmitted && !currentMsg?.isExample && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-250 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Kirim Lembar Kerja Detektif Ke Guru 🚀
                </button>
              )}

              {isSubmitted && (
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-250 rounded-xl text-xs font-black text-emerald-800 text-center">
                  ✔️ Seluruh Lembar Kerja Detektif Berhasil Terkirim ke Guru!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AyoDetektifBeritaT2Props {
  answers: Record<string, any>;
  onSave: (val: Record<string, any>) => void;
}

export function AyoDetektifBeritaT2({
  answers = {},
  onSave,
}: AyoDetektifBeritaT2Props) {
  const [activeNewsId, setActiveNewsId] = useState<string>('news-1');

  const isSubmitted = !!answers._submitted;

  const newsItems = [
    {
      id: 'news-1',
      label: 'Berita 1: Lomba Robotik',
      tag: 'PENDIDIKAN',
      tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
      title: 'Tim Robotik SD Harapan Bangsa Sabet Juara 1 Kompetisi Robotik Pelajar Tingkat Provinsi Jawa Barat',
      source: 'Portal Resmi Pendidikan Jabar (pembelajaran-jabar.go.id)',
      date: '15 Juni 2026',
      author: 'Andri Wijaya, M.Pd.',
      correct: 'benar',
      image: '/budi_robotik_winner.png',
      caption: 'Ilustrasi: Tim Robotik SD Harapan Bangsa tersenyum bangga setelah meraih Piala Juara 1 tingkat Provinsi Jawa Barat atas karya Robot Pemilah Sampah Otomatis mereka.',
      text: 'BANDUNG, KOMPAS - Prestasi membanggakan kembali diukir oleh dunia pendidikan tingkat dasar di Jawa Barat. Tim Robotik Sekolah Dasar (SD) Harapan Bangsa berhasil menyabet medali emas dan trofi Juara 1 dalam ajang bergengsi Kompetisi Robotik Pelajar (KRP) tingkat Provinsi Jawa Barat yang berlangsung di Gedung Olahraga Arcamanik, Bandung, pada 15 Juni 2026.\n\nTim yang beranggotakan tiga siswa kelas 6, yaitu Andi, Siti, dan Roni, sukses memukau dewan juri melalui karya inovatif mereka berupa \'Robot Pemilah Sampah Otomatis\'. Robot ini dirancang menggunakan papan mikrokontroler sederhana dan sensor warna untuk memisahkan sampah organik, anorganik, dan logam secara presisi.\n\nKepala Sekolah SD Harapan Bangsa, Bpk. Ahmad Fauzi, menyatakan rasa syukur dan bangganya atas pencapaian ini. \'Kami sangat bersyukur. Anak-anak telah berlatih keras selama tiga bulan terakhir di bawah bimbingan guru ekstrakurikuler robotik kami. Kemenangan ini didedikasikan untuk seluruh warga sekolah,\' tuturnya saat diwawancarai.\n\nKepala Dinas Pendidikan Provinsi Jawa Barat, yang turut hadir dalam acara penutupan, menyerahkan piala dan piagam penghargaan secara langsung kepada para pemenang. Dengan kemenangan ini, tim SD Harapan Bangsa berhak mewakili Provinsi Jawa Barat di tingkat nasional yang akan diadakan di Jakarta pada akhir tahun nanti.'
    },
    {
      id: 'news-3',
      label: 'Berita 2: El-Nino Tipe X',
      tag: 'CUACA',
      tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
      title: 'Anomali Iklim El-Nino Fase Kritis Diperkirakan Melanda Sejumlah Wilayah Indonesia, Suhu Udara Maksimum Capai 50 Derajat Celsius',
      source: 'Info Cuaca Nusantara (infocuaca-indonesia.com)',
      date: '21 Juni 2026',
      author: 'Tim Redaksi InfoCuaca',
      correct: 'meragukan',
      image: '/cuaca_ekstrem_terik.png',
      caption: 'Ilustrasi: Penggambaran suhu terik matahari yang melanda wilayah perkotaan di Indonesia.',
      text: 'JAKARTA - Indonesia bersiap menghadapi kondisi suhu ekstrem akibat badai atmosferik El-Nino Fase Kritis yang diperkirakan akan melintasi wilayah ekuator mulai pekan depan. Berdasarkan hasil pemodelan iklim komputer dari stasiun cuaca independen, beberapa wilayah perkotaan seperti Jakarta, Surabaya, dan Medan diperkirakan akan mengalami peningkatan suhu udara siang hari hingga mencapai 50 derajat Celsius.\n\nLonjakan suhu ekstrem ini diperkirakan berpotensi memicu overheat pada gardu listrik transmisi utama. Masyarakat diimbau untuk membatasi aktivitas di luar ruangan dari pukul 10.00 hingga 16.00 WIB serta mempersiapkan penampungan cadangan air bersih di rumah guna mengantisipasi gangguan pasokan dari PDAM.\n\nWarga juga disarankan untuk menggunakan pakaian dengan pelindung ultraviolet khusus jika terpaksa beraktivitas di bawah terik matahari guna menghindari dampak radiasi gelombang panas langsung. Hingga berita ini diturunkan, pihak BMKG Pusat disebut masih mengumpulkan data satelit terbaru untuk mengeluarkan pengumuman resmi.'
    },
    {
      id: 'news-4',
      label: 'Berita 3: Makanan Bergizi',
      tag: 'KEMENDIKDASMEN',
      tagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      title: 'Kementerian Pendidikan Dasar dan Menengah Uji Coba Program Makanan Bergizi Gratis di 100 Sekolah Percontohan',
      source: 'Portal Resmi Kementerian Pendidikan Dasar dan Menengah RI (kemendikdasmen.go.id)',
      date: '22 Juni 2026',
      author: 'Humas Kemendikdasmen',
      correct: 'benar',
      image: '/makanan_bergizi_gratis.png',
      caption: 'Ilustrasi: Menu makanan bergizi seimbang yang diuji coba secara gratis di sekolah dasar.',
      text: 'JAKARTA, KEMENDIKDASMEN - Kementerian Pendidikan Dasar dan Menengah Republik Indonesia hari ini secara resmi meluncurkan uji coba (pilot project) program Makanan Bergizi Gratis bagi para peserta didik di tingkat sekolah dasar. Langkah ini diambil sebagai bagian dari upaya peningkatan gizi anak sekolah guna mendukung konsentrasi dan prestasi belajar mereka.\n\nUji coba tahap pertama ini akan dilaksanakan di 100 sekolah dasar percontohan yang tersebar di wilayah Jakarta, Bogor, Depok, Tangerang, Bekasi (Jabodetabek), serta beberapa daerah tertinggal, terdepan, dan terluar (3T). Program ini direncanakan akan berlangsung selama satu semester penuh sebelum dievaluasi untuk penerapan yang lebih luas pada tahun ajaran berikutnya.\n\nMenteri Pendidikan Dasar dan Menengah menjelaskan bahwa menu makanan yang dibagikan telah disusun dengan melibatkan ahli gizi dari Kementerian Kesehatan. \'Setiap porsi makanan dirancang untuk memenuhi kebutuhan energi, protein, dan vitamin harian anak usia sekolah dasar secara seimbang. Kebersihan dan keamanan proses memasak juga diawasi secara ketat oleh dinas kesehatan setempat,\' ungkapnya dalam pidato pembukaan di SD Negeri 01 Menteng.\n\nProgram ini sepenuhnya didanai oleh Anggaran Pendapatan dan Belanja Negara (APBN) 2026 melalui alokasi dana pendidikan khusus. Pengawasan distribusi makanan juga melibatkan komite sekolah and perwakilan orang tua murid guna menjamin transparansi dan kebersihan.'
    },
    {
      id: 'news-5',
      label: 'Berita 4: Rupiah Digital',
      tag: 'PROMO',
      tagColor: 'bg-purple-100 text-purple-700 border-purple-200',
      title: 'Sosialisasi Uji Coba Saldo Stimulus Rupiah Digital Rp 500.000 dalam Rangka Peringatan HUT RI ke-81',
      source: 'Portal Informasi Rupiah Digital (info-rupiahdigital-bi.com)',
      date: '17 Agustus 2026',
      author: 'Panitia Sosialisasi Digital',
      correct: 'meragukan',
      image: '/rupiah_digital_hoax.png',
      caption: 'Ilustrasi: Promosi pembagian saldo digital Rp 500.000 gratis yang dipublikasikan di situs tidak resmi.',
      text: 'JAKARTA - Menyambut peringatan HUT Kemerdekaan Republik Indonesia ke-81, Bank Indonesia bekerja sama dengan asosiasi dompet digital nasional menyelenggarakan program sosialisasi dan uji coba terbatas bertajuk \'Saldo Stimulus Rupiah Digital\'. Dalam program ini, masyarakat berkesempatan mendapatkan saldo digital gratis senilai Rp 500.000 sebagai bagian dari sosialisasi penggunaan mata uang digital nasional.\n\nProgram ini ditujukan bagi kalangan mahasiswa, pelajar, dan masyarakat umum guna memperkenalkan efisiensi sistem transaksi nontunai terbaru. Bagi warga yang tertarik berpartisipasi dalam uji coba ini dapat melakukan pengisian data nomor gawai dan verifikasi Nomor Induk Kependudukan (NIK) melalui tautan pendaftaran khusus di situs info-rupiahdigital-bi.com.\n\nSetelah data terverifikasi oleh sistem otomasi panitia, saldo rupiah digital akan dikirimkan langsung ke dompet elektronik terdaftar dalam kurun waktu 2 jam. Karena kuota partisipan uji coba ini dibatasi, masyarakat diimbau untuk segera melakukan pendaftaran sebelum batas waktu penutupan program berakhir.'
    }
  ];

  const handleFieldChange = (newsId: string, field: string, val: string) => {
    if (isSubmitted) return;
    const currentNewsData = answers[newsId] || {};
    const updatedNewsData = { ...currentNewsData, [field]: val };
    onSave({ ...answers, [newsId]: updatedNewsData });
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    onSave({ ...answers, _submitted: true });

    // Confetti if all correct
    const allCorrect = newsItems.every(n => {
      const data = answers[n.id] || {};
      return data.kesimpulan === n.correct;
    });
    if (allCorrect) {
      canvasConfetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.8 }
      });
    }
  };

  const activeNews = newsItems.find(n => n.id === activeNewsId) || newsItems[0];
  const activeData = answers[activeNewsId] || {};

  const totalAnswered = newsItems.filter(n => {
    const data = answers[n.id] || {};
    return data.kesimpulan !== undefined && data.judul && data.sumber;
  }).length;

  return (
    <div className="rounded-3xl border border-amber-100 bg-amber-50/20 p-6 shadow-md text-left mt-6 space-y-6">
      {/* Title & Instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-100/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h3 className="font-display font-black text-gray-800 text-sm">
                Aktivitas 2: Portal Analisis Berita
              </h3>
              <p className="text-[11px] text-gray-500 leading-normal font-semibold">
                Bandingkan berbagai rilis berita di simulator laptop untuk menentukan kelayakannya.
              </p>
            </div>
          </div>
        </div>

        {/* Gamified progress bar */}
        <div className="bg-white border border-slate-150 rounded-2xl p-3 shadow-2xs min-w-[200px] space-y-1.5 self-start">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500">Kemajuan Analisis Berita:</span>
            <span className="text-amber-600 font-extrabold">{totalAnswered}/{newsItems.length} Berita</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(totalAnswered / newsItems.length) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-slate-400">
            <span>Progress</span>
            <span>{Math.round((totalAnswered / newsItems.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {newsItems.map((n) => {
          const isActive = n.id === activeNewsId;
          const data = answers[n.id] || {};
          const isDone = data.kesimpulan !== undefined && data.judul && data.sumber;
          const isCorrect = data.kesimpulan === n.correct;

          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setActiveNewsId(n.id)}
              className={`px-4 py-2.5 rounded-xl text-[10.5px] font-black border transition-all flex items-center gap-1.5 cursor-pointer ${isActive
                ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 hover:border-slate-350'
                }`}
            >
              <span>{n.label}</span>
              {isSubmitted ? (
                isCorrect ? (
                  <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.25 rounded-md font-black shadow-3xs">✔</span>
                ) : (
                  <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.25 rounded-md font-black shadow-3xs">✖</span>
                )
              ) : isDone ? (
                <span className="text-[9px] text-emerald-600 font-black">✔</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 w-full mt-6">
        {/* Mock Laptop frame */}
        <div className="max-w-3xl sm:max-w-4xl mx-auto w-full flex flex-col items-center">
          {/* Screen / Bezel */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-t-2xl border-[12px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden relative">
            {/* Webcam */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-700/80 flex items-center justify-center">
                <div className="w-0.5 h-0.5 bg-blue-500 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Web Browser Screen View */}
            <div className="absolute inset-0 bg-[#f1f3f4] flex flex-col text-slate-800 font-sans">
              {/* Tab Bar */}
              <div className="h-9 bg-[#e3e4e6] border-b border-slate-300 flex items-end px-3 gap-1 select-none text-[9.5px]">
                <div className="flex gap-1.5 mr-4 pb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                {/* Tab title */}
                <div className="bg-white px-3 py-1.5 rounded-t-lg border-x border-t border-slate-300/80 flex items-center gap-1.5 font-bold text-slate-700 relative top-[1px] shadow-3xs">
                  <span>🌐</span>
                  <span className="truncate max-w-[120px]">{activeNews.label}</span>
                </div>
              </div>

              {/* Address bar navigation panel */}
              <div className="bg-white border-b border-slate-200/80 px-3 py-2 flex items-center gap-2.5 select-none shadow-3xs">
                <div className="flex gap-2 text-slate-400">
                  <svg className="h-4 w-4 hover:text-slate-650 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <svg className="h-4 w-4 hover:text-slate-650 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <svg className="h-4 w-4 hover:text-slate-650 cursor-pointer ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 16H19c0-.216-.07-.433-.21-.62a8.003 8.003 0 00-14.79-4.38" />
                  </svg>
                </div>
                {/* URL block */}
                <div className="flex-1 bg-[#f1f3f4] rounded-lg px-3.5 py-1.5 text-[10.5px] text-slate-600 font-semibold flex items-center gap-1.5 border border-slate-200">
                  <span className="text-emerald-600 text-xs">🔒</span>
                  <span className="text-emerald-700 font-bold">https://</span>
                  <span className="truncate font-medium">{activeNews.source.split('(')[1]?.replace(')', '') || 'berita-terpercaya.com'}</span>
                </div>
              </div>

              {/* Viewport content */}
              <div className="flex-1 overflow-y-auto bg-slate-100 p-5">
                <article className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5 space-y-4 font-serif">
                  <div className="space-y-2 font-sans">
                    <div className="flex justify-between items-center text-[9.5px]">
                      <span className={`px-2.5 py-0.5 rounded-full font-black border tracking-wider text-[8.5px] ${activeNews.tagColor}`}>
                        {activeNews.tag}
                      </span>
                      <span className="text-slate-400 font-bold">{activeNews.date}</span>
                    </div>
                    <h1 className="text-sm sm:text-base font-serif font-black text-slate-900 leading-snug">
                      {activeNews.title}
                    </h1>
                    <div className="text-[10px] text-slate-450 font-bold border-y border-slate-100 py-2 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Penulis: <span className="text-slate-600 font-extrabold">{activeNews.author}</span></span>
                      <span>Sumber: <span className="text-slate-600 font-extrabold">{activeNews.source.split(' ')[0]}</span></span>
                    </div>
                  </div>

                  {/* News image and caption */}
                  <div className="space-y-2 py-1 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <img
                      src={activeNews.image}
                      alt={activeNews.label}
                      className="w-full max-h-56 object-cover rounded-lg border border-slate-200/60 shadow-3xs"
                    />
                    <p className="text-[9px] text-center text-slate-500 italic font-semibold leading-relaxed px-2">
                      {activeNews.caption}
                    </p>
                  </div>

                  {/* Body text */}
                  <div className="text-[11px] leading-relaxed text-slate-700 space-y-3 font-medium whitespace-pre-line text-left">
                    {activeNews.text}
                  </div>
                </article>
              </div>
            </div>
          </div>

          {/* Laptop physical chassis base */}
          <div className="w-[104%] h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-2xl shadow-lg border-x border-b border-slate-600/80 relative flex justify-center">
            {/* Lid indent */}
            <div className="w-20 h-1 bg-slate-950 rounded-b-md absolute top-0"></div>
          </div>
          {/* Bottom shadow */}
          <div className="w-[94%] h-1 bg-slate-900/30 blur-[2px] rounded-full mt-0.5"></div>
        </div>

        {/* Lembar Kerja Form */}
        <div className="max-w-3xl sm:max-w-4xl mx-auto w-full bg-slate-50/50 border border-slate-150 p-6 rounded-3xl space-y-5 shadow-2xs">
          <div className="border-b border-slate-150 pb-3 flex justify-between items-baseline gap-2">
            <h4 className="font-display font-black text-gray-800 text-xs">
              Lembar Kerja Kriteria Kelayakan: <span className="text-amber-600">{activeNews.label}</span>
            </h4>
            <span className="text-[9.5px] text-slate-450 font-black uppercase tracking-wider">
              Kanal Analisis
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-550 uppercase tracking-wide block">
                  Judul Berita (Ditulis Oleh Siswa):
                </label>
                <input
                  type="text"
                  value={activeData.judul || ''}
                  disabled={isSubmitted}
                  onChange={(e) => handleFieldChange(activeNews.id, 'judul', e.target.value)}
                  placeholder="Ketik judul berita sesuai teks..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-550 uppercase tracking-wide block">
                  Sumber Berita (Ditulis Oleh Siswa):
                </label>
                <input
                  type="text"
                  value={activeData.sumber || ''}
                  disabled={isSubmitted}
                  onChange={(e) => handleFieldChange(activeNews.id, 'sumber', e.target.value)}
                  placeholder="Ketik sumber berita (misal: kemendikdasmen.go.id)..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {[
              {
                id: 'sumberJelas',
                label: 'Kriteria 1: Kejelasan Sumber Berita',
                desc: 'Apakah institusi penulis berita tersebut resmi, jelas, dan dapat dipercaya?'
              },
              {
                id: 'tanggal',
                label: 'Kriteria 2: Keberadaan Tanggal Terbit',
                desc: 'Apakah terdapat tanggal rilis berita yang jelas untuk memastikan aktualitas informasi?'
              },
              {
                id: 'judulSesuai',
                label: 'Kriteria 3: Kesesuaian Judul dengan Isi',
                desc: 'Apakah judul berita mencerminkan fakta isi berita dengan jujur (tidak heboh/clickbait)?'
              },
              {
                id: 'bukti',
                label: 'Kriteria 4: Ketersediaan Bukti Pendukung',
                desc: 'Apakah berita mencantumkan data pendukung, foto dokumentasi, atau kutipan narasumber yang valid?'
              },
              {
                id: 'bahasaBerlebih',
                label: 'Kriteria 5: Penggunaan Gaya Bahasa',
                desc: 'Apakah berita ditulis secara tenang, rasional, dan netral (tidak memakai tanda seru berlebih/huruf kapital semua/kalimat paksaan)?'
              }
            ].map((crit) => {
              const selectedValue = activeData[crit.id] || '';
              const detailValue = activeData[crit.id + 'Detail'] || '';
              const isCritAnswered = selectedValue !== '';

              return (
                <div key={crit.id} className={`p-4 bg-white rounded-2xl border transition-all duration-200 shadow-2xs space-y-3 text-left ${isCritAnswered ? 'border-amber-200 bg-amber-50/5' : 'border-slate-150'
                  }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-[10.5px] text-slate-800 block leading-tight">{crit.label}</span>
                      <span className="text-[9.5px] text-slate-450 leading-relaxed font-semibold block">{crit.desc}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {['ya', 'tidak'].map((val) => {
                        const isChosen = selectedValue === val;
                        let btnClass = 'border-slate-200 bg-white text-slate-555 hover:border-amber-300';
                        if (isChosen) {
                          btnClass = val === 'ya'
                            ? 'bg-emerald-500 border-emerald-500 text-white font-extrabold shadow-sm'
                            : 'bg-rose-500 border-rose-500 text-white font-extrabold shadow-sm';
                        }

                        return (
                          <button
                            key={val}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleFieldChange(activeNews.id, crit.id, val)}
                            className={`px-4 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer ${btnClass}`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={detailValue}
                    disabled={isSubmitted}
                    onChange={(e) => handleFieldChange(activeNews.id, crit.id + 'Detail', e.target.value)}
                    placeholder="Tuliskan bukti temuanmu di dalam teks..."
                    className="w-full rounded-xl border border-slate-150 bg-slate-50/50 px-3.5 py-2 text-[10.5px] text-slate-700 font-semibold focus:border-amber-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              );
            })}

            {/* Kriteria 6: Kesimpulan */}
            <div className="p-4 bg-amber-50/20 rounded-2xl border border-amber-150 shadow-2xs space-y-3.5 text-left">
              <label className="text-[10px] font-black text-slate-655 uppercase tracking-wider block">
                Kriteria 6: Kesimpulan Hasil Analisis Kelayakan Berita
              </label>
              <div className="grid grid-cols-2 gap-3.5">
                {['benar', 'meragukan'].map((type) => {
                  const isChosen = activeData.kesimpulan === type;
                  let btnClass = 'border-slate-200 bg-white text-slate-655 hover:border-amber-300';
                  if (isChosen) {
                    btnClass = type === 'benar'
                      ? 'bg-emerald-500 border-emerald-500 text-white font-black shadow-md'
                      : 'bg-amber-500 border-amber-500 text-white font-black shadow-md';
                  }

                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleFieldChange(activeNews.id, 'kesimpulan', type)}
                      className={`py-3 rounded-xl border text-[10.5px] uppercase font-black transition-all cursor-pointer ${btnClass}`}
                    >
                      {type === 'benar' ? '✔ Benar (Fakta/Valid)' : '❓ Meragukan (Hoaks/Opini)'}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className={`p-3 rounded-xl border text-[10.5px] font-bold text-center leading-relaxed shadow-3xs ${activeData.kesimpulan === activeNews.correct
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
                  : 'bg-rose-50 border-rose-250 text-rose-800'
                  }`}>
                  {activeData.kesimpulan === activeNews.correct
                    ? `🕵️‍♂️ Hasil Analisis Tepat! Berita ini memang ${activeNews.correct === 'benar' ? 'Valid & Resmi' : 'Meragukan (Hoaks/Palsu)'}.`
                    : `🕵️‍♂️ Hasil Analisis Kurang Tepat! Berita ini seharusnya dikategorikan sebagai ${activeNews.correct === 'benar' ? 'Valid & Resmi' : 'Meragukan (Hoaks/Palsu)'}.`}
                </div>
              )}
            </div>

            {/* Form footer panel */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/50">
              <span className="text-[10px] text-slate-555 font-extrabold bg-slate-100 border border-slate-150 px-3.5 py-1.5 rounded-full">
                Kemajuan: {totalAnswered} dari {newsItems.length} Berita Dianalisis
              </span>

              {!isSubmitted && totalAnswered === newsItems.length && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-250 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Kirim Lembar Kerja Detektif Ke Guru 🚀
                </button>
              )}

              {isSubmitted && (
                <div className="w-full sm:w-auto px-4 py-2 bg-emerald-50 border border-emerald-250 rounded-xl text-xs font-black text-emerald-800 text-center flex items-center justify-center gap-1">
                  ✔️ Seluruh Lembar Kerja Detektif Berhasil Terkirim ke Guru!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AyoCariTahuT2() {
  return null;
}

interface AyoMengamatiTopik6GamifiedProps {
  title: string;
  scenario?: string;
  questionIds: string[];
  answers: Record<string, any>;
  onSaveResponse: (idx: number, text: string) => void;
  status?: 'belum' | 'draf' | 'dikirim' | 'dinilai';
}

export function AyoMengamatiTopik6Gamified({
  title,
  questionIds = [],
  answers = {},
  onSaveResponse,
  status = 'belum',
}: AyoMengamatiTopik6GamifiedProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'sort' | 'composer'>('chat');
  const [selectedFomoOpt, setSelectedFomoOpt] = useState<string | null>(null);
  const [fomoFeedback, setFomoFeedback] = useState<string>('');
  const [isFomoCorrect, setIsFomoCorrect] = useState<boolean>(false);
  
  const cards: { id: string; text: string; type: 'bijak' | 'bahaya' }[] = [
    { id: 'c1', text: 'Ikut nongkrong malam-malam memakai hoodie & masker seragam geng agar terlihat sangar dan ditakuti', type: 'bahaya' },
    { id: 'c2', text: 'Menolak ajakan masuk geng dengan tegas dan mengajak teman melakukan kegiatan kreatif yang aman', type: 'bijak' },
    { id: 'c3', text: 'Melaporkan video ajakan tawuran atau kekerasan kelompok gengster sekolah ke guru BK/TPPK', type: 'bijak' },
    { id: 'c4', text: 'Menyebarkan video pamer senjata mainan/pose gengster teman ke WhatsApp Status agar viral', type: 'bahaya' },
    { id: 'c5', text: 'Mengingatkan teman secara pribadi (japri) tentang dampak buruk geng motor/tawuran bagi masa depan', type: 'bijak' },
  ];
  const [sortedZones, setSortedZones] = useState<Record<string, 'bijak' | 'bahaya'>>({});
  const [sortingFeedback, setSortingFeedback] = useState<string>('');
  const [isSortingComplete, setIsSortingComplete] = useState<boolean>(false);
  
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [composerFeedback, setComposerFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [isComposerComplete, setIsComposerComplete] = useState<boolean>(false);
  
  const isDisabled = status === 'dikirim' || status === 'dinilai';

  // Load initial answers if present (Fixing lockout/clicking bug!)
  useEffect(() => {
    if (answers[questionIds[0]]) {
      setIsFomoCorrect(true);
      setSelectedFomoOpt('c');
      setFomoFeedback('Luar biasa! Pilihanmu tepat. Jawaban telah tersimpan.');
    }
    if (answers[questionIds[1]]) {
      setIsSortingComplete(true);
      const preSorted: Record<string, 'bijak' | 'bahaya'> = {};
      cards.forEach(c => {
        preSorted[c.id] = c.type;
      });
      setSortedZones(preSorted);
      setSortingFeedback('Keren! Semua tindakan berhasil diklasifikasikan dengan tepat!');
    }
    if (answers[questionIds[2]]) {
      setDraftMessage(answers[questionIds[2]]);
      setIsComposerComplete(true);
    }
  }, [answers, questionIds]);
  
  const handleSelectFomo = (optId: string) => {
    setSelectedFomoOpt(optId);
    if (optId === 'c') {
      setIsFomoCorrect(true);
      setFomoFeedback('Luar biasa! Pilihanmu 100% tepat. Farah merasa dilema karena rasa takut dikucilkan dari grup WhatsApp (peer pressure) dan perasaan FOMO yang memaksanya ingin ikut terlihat gaul, meskipun dia tahu tren gengster-gengsteran tersebut sangat berbahaya dan dapat merusak masa depannya.');
      if (!isDisabled) {
        onSaveResponse(0, 'Farah mengalami dilema karena ia merasakan FOMO (Fear of Missing Out) akibat tekanan dari teman-temannya di grup "Mabar Squad" yang mengancam akan mengeluarkannya jika tidak ikut membuat video gangster, meskipun ia tahu bahwa mengikuti tren gangster-gengsteran malam hari di jembatan sepi itu berbahaya dan melanggar aturan sekolah.');
      }
      canvasConfetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else if (optId === 'a') {
      setFomoFeedback('Kurang tepat. Farah sebenarnya memiliki HP untuk membuka chat grup WhatsApp tersebut. Coba pilih opsi lainnya!');
    } else {
      setFomoFeedback('Kurang tepat. Cerita tidak menyebutkan tentang izin orang tua terkait uang dari TikTok. Masalah utama Farah adalah tekanan dari teman-temannya di grup mabar untuk bergabung dalam geng agar dianggap gaul. Coba lagi!');
    }
  };

  const handleSortCard = (cardId: string, zone: 'bijak' | 'bahaya') => {
    const newZones = { ...sortedZones, [cardId]: zone };
    setSortedZones(newZones);
    
    if (Object.keys(newZones).length === cards.length) {
      const allCorrect = cards.every(c => newZones[c.id] === c.type);
      if (allCorrect) {
        setIsSortingComplete(true);
        setSortingFeedback('Keren! Semua tindakan berhasil diklasifikasikan dengan tepat! Kamu adalah warga digital yang cerdas.');
        
        const bijakText = cards.filter(c => c.type === 'bijak').map((c, i) => `${i+1}. ${c.text}`).join('\n');
        const bahayaText = cards.filter(c => c.type === 'bahaya').map((c, i) => `${i+1}. ${c.text}`).join('\n');
        const fullResult = `Hasil Analisis Klasifikasi Tindakan Gengster Sekolah:\n\n[TINDAKAN BIJAK & AMAN]\n${bijakText}\n\n[TINDAKAN BERBAHAYA & NEGATIF]\n${bahayaText}`;
        
        if (!isDisabled) {
          onSaveResponse(1, fullResult);
        }
        canvasConfetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.8 }
        });
      } else {
        setIsSortingComplete(false);
        setSortingFeedback('Ada beberapa klasifikasi yang masih kurang tepat. Coba periksa kembali!');
      }
    } else {
      setIsSortingComplete(false);
      setSortingFeedback('');
    }
  };

  const handleResetSorting = () => {
    setSortedZones({});
    setSortingFeedback('');
    setIsSortingComplete(false);
  };

  const handleSendGroupChat = () => {
    if (draftMessage.trim().length < 15) {
      setComposerFeedback({
        text: 'Pesan penolakan terlalu singkat! Tuliskan minimal 15 karakter agar pesan terasa sopan dan jelas alasannya.',
        success: false
      });
      return;
    }
    
    const textLower = draftMessage.toLowerCase();
    const hasPolite = textLower.includes('maaf') || textLower.includes('sori') || textLower.includes('tolong') || textLower.includes('teman-teman') || textLower.includes('temen') || textLower.includes('guys') || textLower.includes('punten');
    const hasReason = textLower.includes('bahaya') || textLower.includes('gengster') || textLower.includes('geng') || textLower.includes('tawuran') || textLower.includes('polisi') || textLower.includes('sekolah') || textLower.includes('bk') || textLower.includes('tppk') || textLower.includes('sanksi') || textLower.includes('hukum') || textLower.includes('malam');
    const hasAlternative = textLower.includes('game') || textLower.includes('komik') || textLower.includes('scratch') || textLower.includes('gambar') || textLower.includes('kreatif') || textLower.includes('lain') || textLower.includes('mending') || textLower.includes('daripada') || textLower.includes('proyek');

    if (!hasPolite) {
      setComposerFeedback({
        text: 'Pesanmu kurang menyertakan kata sapaan atau kesopanan (seperti "Maaf sebelumnya" atau "Teman-teman"). Ingat, kita ingin menolak dengan santun agar hubungan pertemanan tetap terjaga.',
        success: false
      });
      return;
    }

    if (!hasReason) {
      setComposerFeedback({
        text: 'Pesanmu belum menjelaskan alasan keamanan/hukum yang logis (seperti "berbahaya", "takut dibilang gengster", "nanti dipanggil guru BK/TPPK", atau "bisa ditangkap polisi"). Sampaikan risiko nyata dari tren ini secara tegas.',
        success: false
      });
      return;
    }

    if (!hasAlternative) {
      setComposerFeedback({
        text: 'Bagus, tapi kamu belum menawarkan alternatif kegiatan positif yang aman (seperti "mending bikin komik digital", "belajar Scratch bareng", atau "kegiatan lain"). Berikan opsi seru agar temanmu tertarik!',
        success: false
      });
      return;
    }

    // Success
    setIsComposerComplete(true);
    setComposerFeedback({
      text: 'Hebat! Pesan penolakanmu sangat luar biasa: Sopan, tegas secara keselamatan, dan menawarkan alternatif yang asyik. Draf pesan ini telah berhasil disimpan sebagai jawaban kuis ke-3!',
      success: true
    });
    
    if (!isDisabled) {
      onSaveResponse(2, draftMessage);
    }
    
    canvasConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  // Helper styles
  const activeTabClass = (tab: typeof activeTab) => 
    activeTab === tab 
      ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-md shadow-primary-100 font-extrabold'
      : 'bg-white hover:bg-slate-50 text-slate-655 font-bold border border-slate-150';

  return (
    <StepWrapper stepNumber={7} title={title} icon={<Map className="h-5 w-5" />}>
      <ActivityHeader
        instruction="Ikuti petualangan simulator di bawah ini untuk membantu Farah menghadapi tren gengster sekolah ekstrem di grup kelasnya."
        exampleInput="Selesaikan ketiga misi interaktif untuk mengisi lembar observasi secara otomatis."
        status={status}
      />

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${activeTabClass('chat')}`}
        >
          <span>📱 Misi 1: WhatsApp Chat</span>
          {isFomoCorrect && <Check className="h-3.5 w-3.5 text-emerald-300" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sort')}
          className={`px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${activeTabClass('sort')}`}
        >
          <span>⚖ Misi 2: Pilah Tindakan</span>
          {isSortingComplete && <Check className="h-3.5 w-3.5 text-emerald-300" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('composer')}
          className={`px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer ${activeTabClass('composer')}`}
        >
          <span>✍ Misi 3: Pesan Penolakan</span>
          {isComposerComplete && <Check className="h-3.5 w-3.5 text-emerald-300" />}
        </button>
      </div>

      {/* Tab Content 1: Chat Simulator */}
      {activeTab === 'chat' && (
        <div className="space-y-6 text-left">
          {/* Illustration Card */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col md:flex-row gap-5 p-5 items-center">
            <img 
              src="/gangster_challenge_illustration.png" 
              alt="Tren Gengster Sekolah" 
              className="w-full md:w-2/5 aspect-[4/3] object-cover rounded-2xl shadow-xs" 
            />
            <div className="space-y-2 flex-1">
              <span className="text-[9.5px] font-black text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                🚨 Studi Kasus: Tren Gengster
              </span>
              <h4 className="text-sm font-black text-slate-800 leading-tight">Farah dan Ajakan Geng "Siber Scorpion"</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Farah diajak Daffa bergabung dengan geng sekolah dan berkumpul malam-malam di jembatan sepi untuk merekam video bertema gangster. Jika menolak, ia diancam akan dikucilkan dari grup WhatsApp bermain mereka.
              </p>
            </div>
          </div>

          {/* WhatsApp UI Container */}
          <div className="bg-[#efeae2] border border-slate-300 rounded-3xl overflow-hidden shadow-lg max-w-xl mx-auto flex flex-col h-[460px] relative">
            {/* WA Header */}
            <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm select-none">
              <div className="flex items-center gap-3">
                {/* Avatar Group */}
                <div className="relative flex items-center justify-center h-9 w-9 rounded-full bg-emerald-100 border border-emerald-250 font-extrabold text-xs text-emerald-800 shrink-0">
                  👥
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black leading-tight">Mabar Squad</h4>
                  <span className="text-[9.5px] font-semibold text-emerald-100 block truncate max-w-[200px]">
                    Daffa, Rian, Tasya, Farah, Kamu
                  </span>
                </div>
              </div>
              {/* WA Action Icons */}
              <div className="flex items-center gap-4 text-emerald-100">
                <svg className="h-4 w-4 cursor-pointer hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                <svg className="h-4 w-4 cursor-pointer hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
                </svg>
                <div className="text-sm font-black cursor-pointer hover:text-white px-1">⋮</div>
              </div>
            </div>

            {/* WA Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Date Header */}
              <div className="flex justify-center select-none">
                <span className="bg-white/80 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-3xs">
                  Hari Ini
                </span>
              </div>

              {/* Daffa */}
              <div className="flex items-start gap-1.5 max-w-[85%] text-left">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-3xs border border-slate-200/50 relative">
                  <span className="text-[9.5px] font-black text-red-500 block mb-0.5">Daffa</span>
                  <p className="text-[11.5px] text-slate-800 leading-normal font-semibold">
                    Guys! Kita bikin geng juga yuk! Namanya 'Siber Scorpion'. Besok malam kita kumpul di jembatan layang dekat jalan sepi, kita rekam video pose sangar pakai hoodie dan masker hitam biar dikira gengster keren!
                  </p>
                  <span className="text-[8.5px] text-slate-400 font-semibold float-right mt-1 ml-2">15:30</span>
                </div>
              </div>

              {/* Rian */}
              <div className="flex items-start gap-1.5 max-w-[85%] text-left">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-3xs border border-slate-200/50 relative">
                  <span className="text-[9.5px] font-black text-blue-500 block mb-0.5">Rian</span>
                  <p className="text-[11.5px] text-slate-800 leading-normal font-semibold">
                    Wih, mantap! Biar anak-anak kelas sebelah segan sama kita dan nggak berani ganggu! Kita post di IG Reels/TikTok juga biar rame.
                  </p>
                  <span className="text-[8.5px] text-slate-400 font-semibold float-right mt-1 ml-2">15:32</span>
                </div>
              </div>

              {/* Tasya */}
              <div className="flex items-start gap-1.5 max-w-[85%] text-left">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-3xs border border-slate-200/50 relative">
                  <span className="text-[9.5px] font-black text-pink-500 block mb-0.5">Tasya</span>
                  <p className="text-[11.5px] text-slate-800 leading-normal font-semibold">
                    Aduh, kalau malam-malam nongkrong di jembatan kan bahaya, trus nanti dikira gengster beneran buat tawuran sama warga atau polisi. Tapi kalau aku nggak ikut, ntar dibilang penakut trus dikeluarin dari grup ya? 🥺
                  </p>
                  <span className="text-[8.5px] text-slate-400 font-semibold float-right mt-1 ml-2">15:35</span>
                </div>
              </div>

              {/* Daffa */}
              <div className="flex items-start gap-1.5 max-w-[85%] text-left">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-3xs border border-slate-200/50 relative">
                  <span className="text-[9.5px] font-black text-red-500 block mb-0.5">Daffa</span>
                  <p className="text-[11.5px] text-slate-800 leading-normal font-semibold">
                    Biarin aja! Yang nggak ikut video 'Siber Scorpion' besok dianggap cemen, cupu, dan bukan anak gaul kelas kita lagi! Farah gimana? Berani gabung gak?
                  </p>
                  <span className="text-[8.5px] text-slate-400 font-semibold float-right mt-1 ml-2">15:36</span>
                </div>
              </div>

              {/* Dilema Farah (Sistem Encryption Notice Style) */}
              <div className="flex justify-center max-w-[95%] mx-auto py-1">
                <div className="bg-[#fff3cd] border border-amber-200 rounded-2xl p-3.5 shadow-3xs flex items-start gap-2.5">
                  <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[10px] font-bold text-amber-900 text-left leading-normal">
                    <span className="font-black block text-[11px] mb-0.5 text-amber-950">💡 Dilema Batin Farah (FOMO):</span>
                    "Aku takut dikucilkan dan dibilang tidak gaul oleh Daffa dkk. Tapi nongkrong malam hari bergaya gengster di jembatan sepi itu melanggar aturan dan bisa kena sanksi sekolah dari TPPK bahkan polisi. Aku harus bagaimana?"
                  </div>
                </div>
              </div>

              {/* Farah Sent Message (after Misi 3 is completed) */}
              {isComposerComplete && (
                <div className="flex justify-end w-full text-right">
                  <div className="bg-[#d9fdd3] rounded-2xl rounded-tr-none p-3 shadow-3xs border border-[#d9fdd3]/50 relative max-w-[85%] text-left">
                    <span className="text-[9.5px] font-black text-[#00a884] block mb-0.5">Farah (Kamu)</span>
                    <p className="text-[11.5px] text-slate-800 leading-normal font-semibold">
                      {draftMessage || 'Maaf teman-teman, aku tidak bisa ikut...'}
                    </p>
                    <span className="text-[8.5px] text-slate-400 font-semibold float-right mt-1 ml-2">15:40 ✔✔</span>
                  </div>
                </div>
              )}
            </div>

            {/* WA Fake Footer Input */}
            <div className="bg-[#f0f2f5] px-3.5 py-2.5 flex items-center gap-2.5 shrink-0 select-none border-t border-slate-200">
              <div className="flex-1 bg-white rounded-full py-2 px-4 flex items-center gap-2 border border-slate-250/60 shadow-3xs">
                <span className="text-slate-400 text-xs">😀</span>
                <span className="text-slate-400 text-[11px] font-semibold flex-1 text-left">Ketik pesan...</span>
                <span className="text-slate-400 text-xs">📎</span>
              </div>
              <div className="h-8.5 w-8.5 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-xs">
                <Send className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Quiz 1 */}
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm space-y-4">
            <h5 className="text-[12px] font-extrabold text-primary-800">
              Pertanyaan 1: Mengapa Farah mengalami dilema di grup chat tersebut?
            </h5>
            <div className="space-y-2 text-left">
              <button
                type="button"
                onClick={() => handleSelectFomo('a')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedFomoOpt === 'a' ? 'border-primary-400 bg-primary-50/40 text-primary-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                A. Karena Farah tidak punya HP canggih untuk merekam video bertema gengster.
              </button>
              <button
                type="button"
                onClick={() => handleSelectFomo('b')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedFomoOpt === 'b' ? 'border-primary-400 bg-primary-50/40 text-primary-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                B. Karena orang tua Farah melarang ia memposting video demi mendapatkan uang.
              </button>
              <button
                type="button"
                onClick={() => handleSelectFomo('c')}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedFomoOpt === 'c' ? 'border-success-400 bg-success-50/30 text-success-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                C. Karena Farah mengalami <strong>FOMO (takut dikucilkan/dibilang cupu)</strong> akibat tekanan teman sebaya (peer pressure) walaupun ia sadar tren gengster sekolah tersebut berbahaya dan melanggar hukum/tata tertib.
              </button>
            </div>

            {fomoFeedback && (
              <div className={`p-4 rounded-xl border text-xs font-bold leading-relaxed ${
                isFomoCorrect ? 'bg-success-50 border-success-200 text-success-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {isFomoCorrect ? '🎉 ' : '❌ '} {fomoFeedback}
              </div>
            )}

            {isFomoCorrect && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('sort')}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1 hover:-translate-y-0.5 cursor-pointer"
                >
                  Misi Berikutnya: Pilah Tindakan ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Sorting Game */}
      {activeTab === 'sort' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 shadow-inner space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black text-slate-655 flex items-center gap-1">
                ⚖️ Misi 2: Pilah Tindakan (Bijak vs Bahaya)
              </h4>
              {!isSortingComplete && Object.keys(sortedZones).length > 0 && (
                <button
                  type="button"
                  onClick={handleResetSorting}
                  className="text-[10px] font-black text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Tren gengster di media sosial sering kali membawa pengaruh buruk. Bacalah setiap pernyataan kartu di bawah, kemudian klasifikasikan ke dalam kategori <strong>Tindakan Bijak & Aman</strong> atau <strong>Tindakan Berbahaya & Negatif</strong>.
            </p>

            {/* Cards List */}
            <div className="space-y-3">
              {cards.map((card) => {
                const zone = sortedZones[card.id];
                return (
                  <div
                    key={card.id}
                    className={`p-3.5 rounded-xl border bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 shadow-2xs transition-all ${
                      zone ? 'opacity-90 border-slate-150' : 'border-slate-200'
                    }`}
                  >
                    <span className="text-[11px] text-slate-700 font-bold leading-normal flex-1">
                      {card.text}
                    </span>
                    
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSortCard(card.id, 'bijak')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                          zone === 'bijak'
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 border border-slate-200/50'
                        }`}
                      >
                        ✔ Bijak & Aman
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSortCard(card.id, 'bahaya')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                          zone === 'bahaya'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200/50'
                        }`}
                      >
                        ❌ Berbahaya
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortingFeedback && (
              <div className={`p-4 rounded-xl border text-xs font-bold leading-relaxed ${
                isSortingComplete ? 'bg-success-50 border-success-200 text-success-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {isSortingComplete ? '🎉 ' : '❌ '} {sortingFeedback}
              </div>
            )}

            {isSortingComplete && (
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('composer')}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1 hover:-translate-y-0.5 cursor-pointer"
                >
                  Misi Berikutnya: Pesan Penolakan ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Composer Chat */}
      {activeTab === 'composer' && (
        <div className="space-y-6 text-left animate-fadeIn">
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 shadow-inner space-y-4">
            <h4 className="text-xs font-black text-slate-655 flex items-center gap-1">
              ✍️ Misi 3: Buat Draf Pesan Penolakan Farah
            </h4>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Bantu Farah menulis pesan di grup WhatsApp <strong>"Mabar Squad"</strong>. Tuliskan pesan penolakan yang <strong>sopan</strong> (gunakan kata sapaan/maaf), <strong>tegas</strong> (jelaskan bahaya dipanggil guru BK/TPPK atau tertangkap polisi), dan tawarkan <strong>alternatif</strong> kegiatan kreatif yang aman (seperti menggambar komik digital atau game Scratch).
            </p>

            <div className="space-y-3">
              {/* WhatsApp-themed compose editor */}
              <div className="bg-[#efeae2] border border-slate-300 rounded-3xl overflow-hidden shadow-lg max-w-xl mx-auto flex flex-col">
                {/* WA Header */}
                <div className="bg-[#008069] text-white px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm select-none">
                  <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 font-extrabold text-xs text-emerald-800 shrink-0">
                    👥
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black leading-tight">Mabar Squad</h4>
                    <span className="text-[8.5px] font-semibold text-emerald-100 block">Draf Balasan Farah...</span>
                  </div>
                </div>

                {/* Tips Strategy Panel */}
                <div className="bg-white/95 px-4 py-3 border-b border-slate-200 space-y-2">
                  <span className="text-[9.5px] font-black text-primary-500 uppercase tracking-wide block">
                    TIPS STRATEGI PENOLAKAN SOPAN & TEGAS:
                  </span>
                  <ul className="text-[10px] font-semibold text-slate-500 list-disc list-inside space-y-1">
                    <li>Mengandung sapaan bersahabat/sopan (misal: <em>"Maaf sebelumnya, teman-teman..."</em> atau <em>"Sori guys..."</em>).</li>
                    <li>Menjelaskan alasan keselamatan/tata tertib (misal: <em>"soalnya itu bahaya banget, bisa dikira gengster beneran dan ditangkap polisi/BK/TPPK"</em>).</li>
                    <li>Menyarankan aktivitas alternatif aman (misal: <em>"mending kita buat proyek komik digital bareng"</em> atau <em>"belajar Scratch"</em>).</li>
                  </ul>
                </div>

                {/* Textarea Compose area */}
                <div className="p-4 bg-[#efeae2]">
                  <textarea
                    value={draftMessage}
                    disabled={isComposerComplete}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Ketik pesan penolakan santun & tegas Farah di sini..."
                    rows={4}
                    className="w-full rounded-2xl border border-slate-250 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 font-semibold shadow-inner"
                  />
                </div>

                {/* WA Footer Compose Action */}
                {!isComposerComplete && (
                  <div className="bg-[#f0f2f5] px-4 py-3 flex justify-end shrink-0 select-none border-t border-slate-250">
                    <button
                      type="button"
                      onClick={handleSendGroupChat}
                      className="px-5 py-2.5 rounded-full bg-[#00a884] hover:bg-[#008f70] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" /> Kirim Ke Grup Mabar 🚀
                    </button>
                  </div>
                )}
              </div>
            </div>

            {composerFeedback && (
              <div className={`p-4 rounded-xl border text-xs font-bold leading-relaxed flex items-start gap-2.5 ${
                composerFeedback.success ? 'bg-success-50 border-success-200 text-success-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {composerFeedback.success ? '🎉' : '❌'}
                </div>
                <div>
                  <p className="font-extrabold mb-1">Hasil Evaluasi Digi:</p>
                  <p className="font-semibold">{composerFeedback.text}</p>
                </div>
              </div>
            )}

            {isComposerComplete && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-250 rounded-2xl flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold shrink-0 shadow-sm">
                  ✔
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-800">Misi Selesai & Berhasil Terkirim!</p>
                  <p className="text-[10px] font-semibold text-emerald-700 leading-normal">
                    Terima kasih telah membantu Farah menolak peer pressure secara asyik dan bijak! Jawabanmu otomatis terangkum dalam lembar kerja siswa.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </StepWrapper>
  );
}

interface AyoMengamatiTopik4GamifiedProps {
  title: string;
  questionIds: string[];
  answers: Record<string, any>;
  onSaveResponse: (idx: number, val: number) => void;
  status?: 'belum' | 'draf' | 'dikirim' | 'dinilai';
}

export function AyoMengamatiTopik4Gamified({
  title,
  questionIds = [],
  answers = {},
  onSaveResponse,
  status = 'belum',
}: AyoMengamatiTopik4GamifiedProps) {
  const [bookPage, setBookPage] = useState<number>(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const isReadOnly = status === 'dinilai';
  const questionIdKey = questionIds.join('|');
  const stableQuestionIds = useMemo(() => questionIds, [questionIdKey]);

  const questions = [
    {
      question: "1. Berdasarkan komik Kasus Riko dan Adit, apa kesalahan utama yang membuat perangkat mereka terancam dan mengalami kerugian?",
      options: [
        { letter: 'A', text: "Riko mengunduh gim dari situs tidak dikenal karena tergiur 'gratis', sedangkan Adit mengisi kata sandi akun gim dan PIN dompet digital pada situs promo murah tidak resmi.", isCorrect: true },
        { letter: 'B', text: "Riko mengunduh gim berbayar menggunakan pulsa orang tuanya secara sembunyi-sembunyi, sedangkan Adit membagikan nama pengguna (username) akun gimnya ke media sosial.", isCorrect: false },
        { letter: 'C', text: "Riko mengklik tautan hadiah gratis dari pesan WhatsApp temannya, sedangkan Adit mengunduh aplikasi modifikasi gim agar bisa memenangkan pertandingan dengan mudah.", isCorrect: false },
        { letter: 'D', text: "Riko membuka situs web yang tidak aman saat menggunakan Wi-Fi publik, sedangkan Adit menggunakan dompet digital ibunya tanpa izin untuk membeli skin gim.", isCorrect: false }
      ],
      explanation: "Kesalahan utama Riko adalah mengunduh dari situs tidak resmi karena iming-iming gratis (Trojan), dan Adit adalah memberikan data sensitif (password & PIN) ke situs promo tidak resmi (Phishing)."
    },
    {
      question: "2. Bagaimana cara kerja malware jenis Trojan (seperti pada kasus Riko) dalam menjebak korbannya di internet?",
      options: [
        { letter: 'A', text: "Menyamar sebagai aplikasi atau gim gratis yang menarik agar korban bersedia menginstalnya, lalu diam-diam menyadap data, memotong pulsa, dan menampilkan banyak iklan.", isCorrect: true },
        { letter: 'B', text: "Mengirimkan pesan ancaman bahwa akun korban akan dihapus dalam waktu singkat jika tidak segera mengklik tautan tertentu.", isCorrect: false },
        { letter: 'C', text: "Memblokir seluruh akses internet pada gawai korban dan meminta uang tebusan berupa diamond agar perangkat bisa digunakan kembali.", isCorrect: false },
        { letter: 'D', text: "Mengubah kata sandi akun media sosial korban secara otomatis saat perangkat terhubung ke jaringan Wi-Fi publik di tempat umum.", isCorrect: false }
      ],
      explanation: "Trojan menyamar sebagai program/gim bermanfaat (seperti kuda kayu Troya) agar korban menginstalnya secara sukarela, kemudian meluncurkan aktivitas jahatnya secara tersembunyi."
    },
    {
      question: "3. Situs penipuan yang dikunjungi Adit dikenal sebagai Phishing. Apa sebenarnya tujuan utama dari Phishing dan bagaimana cara terbaik untuk menghindarinya?",
      options: [
        { letter: 'A', text: "Memancing korban agar memberikan data penting seperti kata sandi, PIN, atau OTP melalui halaman palsu; dihindari dengan menjaga kerahasiaan data tersebut dan hanya bertransaksi di toko resmi.", isCorrect: true },
        { letter: 'B', text: "Merusak perangkat keras gawai korban dengan virus agar tidak bisa dinyalakan; dihindari dengan memasang aplikasi antivirus yang kuat.", isCorrect: false },
        { letter: 'C', text: "Menyebarkan iklan pop-up yang mengganggu kenyamanan layar gawai; dihindari dengan menekan tombol silang (X) atau menutup halaman peramban dengan cepat.", isCorrect: false },
        { letter: 'D', text: "Menyadap pesan dan kontak penting untuk dikirim ke orang asing; dihindari dengan selalu menggunakan koneksi internet Wi-Fi rumah yang aman.", isCorrect: false }
      ],
      explanation: "Phishing (dari kata 'fishing'/memancing) bertujuan mencuri informasi sensitif (akun, PIN, OTP) dengan memancing korban di situs palsu. Selalu rahasiakan data Anda dan gunakan saluran resmi."
    }
  ];

  const pages = [
    {
      type: 'cover',
      title: 'Studi Kasus Keamanan Siber',
      subtitle: 'Kisah Investigasi Riko dan Adit',
      image: '/gambar/Topik 4/Cover_Topik_4.png',
      desc: 'Klik tombol di bawah ini atau geser halaman untuk mulai membaca komik kasus dunia nyata Riko dan Adit!'
    },
    {
      type: 'page',
      pageNum: 1,
      title: 'Kasus 1: Riko & Aplikasi "Gratis" (Halaman 1)',
      image: '/gambar/Topik 4/riko_halaman_1.png',
      desc: 'Riko ingin memainkan gim populer yang berbayar secara gratis dari situs asing. HP Riko mulai dipenuhi iklan pop-up berbahaya setelah menginstal file tersebut!'
    },
    {
      type: 'page',
      pageNum: 2,
      title: 'Kasus 1: Riko & Aplikasi "Gratis" (Lanjutan) (Halaman 2)',
      image: '/gambar/Topik 4/riko_halaman_2.png',
      desc: 'Pulsa ibu berkurang sendiri dan data pribadi Riko dikirim ke pencuri siber. Digi menjelaskan bahwa file tersebut adalah Trojan yang menyamar!'
    },
    {
      type: 'page',
      pageNum: 3,
      title: 'Kasus 2: Adit & Jebakan Top-up Gim Murah (Halaman 3)',
      image: '/gambar/Topik 4/adit_halaman_3.png',
      desc: 'Adit tergiur promo diamond murah dari situs tidak resmi. Adit memasukkan username, kata sandi, nomor HP, hingga PIN dompet digital milik ibunya.'
    },
    {
      type: 'page',
      pageNum: 4,
      title: 'Kasus 2: Adit & Jebakan Top-up Gim Murah (Lanjutan) (Halaman 4)',
      image: '/gambar/Topik 4/adit_halaman_4.png',
      desc: 'Akun Adit dicuri dan saldo dompet digital ibu terkuras habis. Digi menjelaskan bahwa ini adalah modus Phishing untuk memancing informasi sensitif.'
    }
  ];

  // Sync initial answers (filtering out invalid values such as legacy essay strings)
  useEffect(() => {
    const loaded: Record<number, number> = {};
    const explanations: Record<number, boolean> = {};
    stableQuestionIds.forEach((qId, idx) => {
      const val = answers[qId];
      if (val !== undefined && val !== null && val !== '') {
        const num = Number(val);
        // Only load if it matches a valid MC option index (0 to 3)
        if (!isNaN(num) && num >= 0 && num <= 3) {
          loaded[idx] = num;
          explanations[idx] = true;
        }
      }
    });
    setSelectedAnswers(loaded);
    setShowExplanation(explanations);
  }, [answers, stableQuestionIds]);

  const isQuestionSolved = (questionIdx: number) => {
    const selectedIdx = selectedAnswers[questionIdx];
    if (selectedIdx === undefined) return false;
    return questions[questionIdx].options[selectedIdx].isCorrect;
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (isReadOnly) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [questionIdx]: true }));
    onSaveResponse(questionIdx, optionIdx);

    const isCorrect = questions[questionIdx].options[optionIdx].isCorrect;
    if (isCorrect) {
      canvasConfetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handlePrevPage = () => {
    if (bookPage > 0) {
      setDirection('backward');
      setBookPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (bookPage < pages.length - 1) {
      setDirection('forward');
      setBookPage(prev => prev + 1);
    }
  };

  const slideVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? 120 : -120,
      scale: 0.96,
      rotateY: dir === 'forward' ? 15 : -15,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 260, damping: 26 },
        opacity: { duration: 0.2 },
        rotateY: { duration: 0.3 }
      }
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? -120 : 120,
      scale: 0.96,
      rotateY: dir === 'forward' ? -15 : 15,
      transition: {
        x: { duration: 0.25 },
        opacity: { duration: 0.15 },
        rotateY: { duration: 0.2 }
      }
    })
  };

  const currentPageData = pages[bookPage];

  return (
    <StepWrapper stepNumber={7} title={title} icon={<BookOpen className="h-5 w-5" />}>
      <ActivityHeader
        instruction="Buka komik di bawah ini secara bolak-balik untuk memahami studi kasus Riko dan Adit. Setelah itu, jawablah pertanyaan investigasi yang tersedia di bagian bawah. Ketuk gambar komik untuk memperbesar."
        exampleInput="Gunakan tombol Navigasi atau Tab Bookmark untuk membolak-balik halaman komik."
        status={status}
      />

      {/* Comic Book Container */}
      <div className="my-8 max-w-2xl mx-auto">
        {/* The Book Layout */}
        <div className="relative bg-[#faf7f2] border-4 border-amber-900/10 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[450px] flex flex-col justify-between">
          {/* Floating Left Arrow (Previous) */}
          {bookPage > 0 && (
            <button
              type="button"
              onClick={handlePrevPage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-slate-50 text-rose-600 shadow-lg border border-slate-150 hover:scale-105 active:scale-95 transition-all z-35 flex items-center justify-center cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          {/* Floating Right Arrow (Next) */}
          {bookPage < pages.length - 1 && (
            <button
              type="button"
              onClick={handleNextPage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white hover:bg-slate-50 text-rose-600 shadow-lg border border-slate-150 hover:scale-105 active:scale-95 transition-all z-35 flex items-center justify-center cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          {/* Page content with sliding transition */}
          <div className="flex-1 flex flex-col justify-center my-2">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={bookPage}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full text-center flex flex-col items-center gap-4 z-10"
              >
                {currentPageData.type === 'cover' ? (
                  /* Cover Page Style */
                  <div className="py-6 px-4 flex flex-col items-center max-w-md">
                    <div className="h-16 w-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 text-2xl font-black shadow-inner mb-3">
                      📖
                    </div>
                    <h3 className="font-display font-black text-slate-800 text-xl sm:text-2xl leading-tight">
                      {currentPageData.title}
                    </h3>
                    <p className="text-xs font-bold text-rose-600 mt-1 uppercase tracking-widest">
                      {currentPageData.subtitle}
                    </p>
                    <div className="my-6 border border-slate-200/80 rounded-2xl overflow-hidden shadow-md max-h-56">
                      <img
                        src={currentPageData.image}
                        alt="Cover Comic"
                        className="object-cover h-56 w-full"
                      />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {currentPageData.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDirection('forward');
                        setBookPage(1);
                      }}
                      className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-extrabold text-xs shadow-md transition-all hover:shadow-glow cursor-pointer"
                    >
                      Buka Komik 🚀
                    </button>
                  </div>
                ) : (
                  /* Comic Page Style */
                  <div className="w-full flex flex-col items-center px-2">
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest">
                      {currentPageData.title}
                    </span>
                    <div 
                      className="my-3 bg-white p-3 border border-slate-200 rounded-2xl shadow-md w-full max-w-md relative group cursor-zoom-in overflow-hidden select-none"
                      onClick={() => setIsZoomed(true)}
                    >
                      <img
                        src={currentPageData.image}
                        alt={`Komik Halaman ${currentPageData.pageNum}`}
                        className="w-full h-auto rounded-xl object-contain max-h-[350px] sm:max-h-[380px] transition-transform duration-300 group-hover:scale-[1.01]"
                        loading="eager"
                      />
                      <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 backdrop-blur-sm opacity-85 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-3 w-3" />
                        Ketuk untuk perbesar
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed max-w-lg mt-1 text-left bg-white/60 p-3 rounded-xl border border-slate-200/40 shadow-sm">
                      {currentPageData.desc}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Book Bottom Controls */}
          <div className="flex items-center justify-between mt-4 border-t border-dashed border-amber-900/10 pt-4 z-30 select-none">
            <button
              type="button"
              disabled={bookPage === 0}
              onClick={handlePrevPage}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                bookPage === 0
                  ? 'text-slate-300 cursor-not-allowed bg-transparent'
                  : 'bg-white text-rose-600 border border-slate-200 hover:bg-slate-50 shadow-sm cursor-pointer'
              }`}
            >
              <ChevronLeft className="h-4 w-4" /> Sebelumnya
            </button>
            <span className="text-[10px] sm:text-xs font-black text-amber-955 uppercase tracking-widest bg-amber-900/5 px-3 py-1.5 rounded-lg">
              Halaman {bookPage + 1} / {pages.length}
            </span>
            <button
              type="button"
              disabled={bookPage === pages.length - 1}
              onClick={handleNextPage}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                bookPage === pages.length - 1
                  ? 'text-slate-300 cursor-not-allowed bg-transparent'
                  : 'bg-white text-rose-600 border border-slate-200 hover:bg-slate-50 shadow-sm cursor-pointer'
              }`}
            >
              Selanjutnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Investigation Questions Area */}
      <div className="mt-12 space-y-6 pt-6 border-t border-dashed border-primary-200/60 text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-extrabold text-sm shadow-sm shrink-0">
            🔍
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 text-sm sm:text-base leading-none">Pertanyaan Investigasi Kasus</h3>
            <span className="text-[10px] font-semibold text-slate-400 block mt-1">Uji kejelian analisismu berdasarkan komik di atas</span>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, qi) => {
            const selectedIdx = selectedAnswers[qi];
            const isSolved = isQuestionSolved(qi);

            return (
              <div key={qi} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 leading-relaxed font-display">
                  {q.question}
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedIdx === oi;
                    let optClass = 'border-slate-200 bg-slate-50 hover:bg-rose-50/10 hover:border-rose-200 text-slate-700 cursor-pointer';

                    if (isSolved) {
                      if (opt.isCorrect) {
                        optClass = 'border-success-350 bg-success-50/40 text-success-850 font-semibold';
                      } else {
                        optClass = 'border-slate-100 bg-white text-slate-400 opacity-80 hover:bg-rose-50/10 hover:border-rose-200 cursor-pointer';
                      }
                    } else if (isSelected) {
                      // Must be incorrect because it's not solved
                      optClass = 'border-danger-350 bg-danger-50/40 text-danger-850 font-semibold';
                    }

                    const isBtnDisabled = isReadOnly;

                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={isBtnDisabled}
                        onClick={() => handleSelectOption(qi, oi)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-xs transition-all ${optClass}`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                          isSolved && opt.isCorrect
                            ? 'bg-success-500 text-white'
                            : isSelected
                              ? 'bg-danger-500 text-white'
                              : 'bg-slate-200 text-slate-655'
                        }`}>
                          {opt.letter}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isSolved && opt.isCorrect && <Check className="h-4 w-4 text-success-600 shrink-0" />}
                        {isSelected && !opt.isCorrect && <X className="h-4 w-4 text-danger-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {showExplanation[qi] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      isSolved
                        ? 'bg-success-50 border-success-200 text-success-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base shrink-0 mt-0.5">{isSolved ? '🎉' : '💡'}</span>
                      <div>
                        <p className="font-extrabold mb-1">{isSolved ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}</p>
                        <p className="font-semibold">{q.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zoom Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm select-none cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            {/* Large Comic Image */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center p-2 bg-white rounded-3xl border border-slate-200/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing on clicking image itself
            >
              {/* Close Button on top of the comic container */}
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="absolute -top-3 -right-3 p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors cursor-pointer z-50 shadow-md border-2 border-white flex items-center justify-center"
                title="Tutup"
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>

              <img
                src={currentPageData.image}
                alt={currentPageData.title}
                className="rounded-2xl max-w-full max-h-[75vh] object-contain shadow-inner"
              />

              {/* Left/Right controls inside lightbox */}
              {bookPage > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPage();
                  }}
                  className="absolute left-4 p-3 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {bookPage < pages.length - 1 && bookPage > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPage();
                  }}
                  className="absolute right-4 p-3 bg-black/60 hover:bg-black/85 text-white rounded-full transition-colors cursor-pointer shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </motion.div>

            {/* Caption */}
            <p className="mt-4 text-white text-xs sm:text-sm font-semibold max-w-xl text-center px-4 bg-black/40 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm leading-relaxed">
              {currentPageData.title} — {currentPageData.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </StepWrapper>
  );
}
