import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Lock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Home,
  Award,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  collection,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { safeLog } from '../../lib/safeLog';
import { useAuth } from '../../contexts/AuthContext';
import { useModules } from '../../contexts/ModuleContext';
import { enqueue } from '../../lib/offlineQueue';
import { calculateMultipleChoiceScore } from '../../lib/grading';
import {
  getDemoProgressList,
  saveDemoProgress,
  getDemoResponse,
  saveDemoResponse,
  saveDemoGalleryItem,
  logDemoActivity,
  getDemoGrades,
} from '../../lib/demoStore';

// Import all 8 simulations
import IdentitasDigitalSim from './simulations/IdentitasDigitalSim';
import HoaxDetectiveSim from './simulations/HoaxDetectiveSim';
import PrivacySimTikTok from './simulations/PrivacySimTikTok';
import KeamananSiberSim from './simulations/KeamananSiberSim';
import EtikaChatSim from './simulations/EtikaChatSim';
import MediaSosialSim from './simulations/MediaSosialSim';
import CopyrightSim from './simulations/CopyrightSim';
import KreatorKontenSim from './simulations/KreatorKontenSim';
import AIChatBullyingSim from './simulations/AIChatBullyingSim';
import TemanBaikSim from './simulations/TemanBaikSim';


// Import step UI components
import {
  TujuanStep,
  KataKunciStep,
  PetaMateriStep,
  BersiapBelajarStep,
  TantanganAwalStep,
  YukBelajarStep,
  AyoMemahamiStep,
  AyoMengamatiStep,
  AyoMengamatiTopik4Gamified,
  AyoBereksplorasiStep,
  UjiPemahamanStep,
  RefleksiStep,
  Aktivitas2RisikoGamified,
  Aktivitas3TtsGamified,
  KartuPenggunaDigitalCerdas,
  AyoMengamatiTopik2Gamified,
  AyoDetektifBeritaT2,
  YukBelajarTopik1,
  YukBelajarTopik3,
  YukBelajarTopik4,
  YukBelajarTopik5,
  YukBelajarTopik6,
  JanjiJariKelingkingDigital,
  YukBelajarTopik7,
  Activity1Table,
  YukBelajarTopik2,
} from '../../components/common/StepComponents';
import {
  Topik3Aktivitas1,
  Topik3Aktivitas2,
  Topik3Aktivitas3,
  Topik3Aktivitas4,
} from '../../components/common/Topik3Activities';
import {
  Topik4Aktivitas1,
  Topik4Aktivitas2,
  Topik4Aktivitas3,
  Topik4Aktivitas4,
} from '../../components/common/Topik4Activities';

import {
  Topik5TantanganAwal,
  Topik5Aktivitas1,
  Topik5Aktivitas2,
  Topik5Aktivitas3,
  Topik5ChatBijak,
} from '../../components/common/Topik5Activities';
import {
  Topik6Aktivitas1,
  Topik6Aktivitas2,
} from '../../components/common/Topik6Activities';
import {
  Topik7TantanganAwal,
  Topik7Aktivitas1,
  Topik7Aktivitas2,
  Topik7Aktivitas3,
  Topik7SimKonten,
} from '../../components/common/Topik7Activities';
import {
  Topik8TantanganAwal,
  YukBelajarTopik8,
  Topik8AktivitasAkhir,
} from '../../components/common/Topik8Activities';


import {
  Topik6SimulationCenter,
} from '../../components/common/Topik6AISim';
import { badgeMap } from '../../data/badges';
import type { Badge, TopicStep } from '../../types';








import canvasConfetti from 'canvas-confetti';

const TOPIC_COVER_URLS: Record<string, string> = {
  'topik-1': '/gambar/Topik%201/Cover_Topik_1.png',
  'topik-2': '/gambar/Topik%202/Cover_Topik_2.png',
  'topik-3': '/gambar/topik%203/Cover_Topik_3.png',
  'topik-4': '/gambar/Topik%204/Cover_Topik_4.png',
  'topik-5': '/gambar/Topik%205/Cover_Topik_5.png',
  'topik-6': '/gambar/topik%206/Cover_Topik_6.png',
  'topik-7': '/gambar/topik%207/Cover_Topik_7.png',
  'topik-8': '/gambar/topik%208/Cover_Topik_8.png',
};

const findStepIndex = (topic: any, type: string, fallback = 0) => {
  const index = topic?.steps?.findIndex((step: any) => step.type === type) ?? -1;
  return index >= 0 ? index : fallback;
};

const getPageForStepIndex = (topic: any, stepIndex: number) => {
  const step = topic?.steps?.[stepIndex];
  if (!step) return 2;
  if (stepIndex <= 4) return 1;

  if (step.type === 'uji-pemahaman' || step.type === 'refleksi') {
    return 3;
  }
  return 2;
};

const getFirstStepIndexForPage = (topic: any, page: number) => {
  if (page === 2) return findStepIndex(topic, 'yuk-belajar', 5);
  if (page === 3) {
    return findStepIndex(topic, 'uji-pemahaman', 8);
  }
  return 0;
};

const ACTIVITY_THEMES: Record<string, Record<string, string>> = {
  'topik-1': { accent: '#2a9d99', strong: '#1f7f7b', soft: '#e6f5f3', faint: '#f4fbfa', border: '#c6e7e3', ink: '#254b49' },
  'topik-2': { accent: '#dd5b00', strong: '#a84608', soft: '#fff0e5', faint: '#fff8f2', border: '#ffd3b3', ink: '#5f321b' },
  'topik-3': { accent: '#1aae39', strong: '#14872d', soft: '#eaf8ed', faint: '#f6fcf7', border: '#c8eecf', ink: '#24512d' },
  'topik-4': { accent: '#b45309', strong: '#92400e', soft: '#fff7ed', faint: '#fffbf5', border: '#fed7aa', ink: '#5d3a18' },
  'topik-5': { accent: '#be4b82', strong: '#9d3b68', soft: '#fceaf3', faint: '#fff7fb', border: '#f5c4dd', ink: '#60314a' },
  'topik-6': { accent: '#7c5cbe', strong: '#6345a0', soft: '#f0ebfb', faint: '#faf8ff', border: '#d8c9f2', ink: '#463768' },
  'topik-7': { accent: '#8a5a2b', strong: '#6f441f', soft: '#f7efe6', faint: '#fcfaf7', border: '#e9d4bc', ink: '#55391f' },
  'topik-8': { accent: '#5d7c32', strong: '#466124', soft: '#eef5e5', faint: '#f9fcf5', border: '#d8e8c4', ink: '#384d25' },
};

const getActivityTheme = (topicId?: string) =>
  ACTIVITY_THEMES[topicId || ''] || ACTIVITY_THEMES['topik-1'];

type BadgeProgressSnapshot = {
  topicId?: string;
  status?: string;
  score?: number;
  finalScore?: number;
  quizScore?: number;
  currentStep?: number;
  submissionStatus?: string;
  badgeEarned?: boolean;
};

const getTopicBadgeByTopicId = (topicId?: string) =>
  Object.values(badgeMap).find((badge) => badge.topicId === topicId);

const isTopicSubmittedOrCompleted = (progress?: BadgeProgressSnapshot | null) =>
  progress?.status === 'completed' || progress?.submissionStatus === 'submitted';

const getSavedStepIndex = (topic: any, savedStep?: number) => {
  const lastStepIndex = Math.max(0, (topic?.steps?.length || 1) - 1);
  const parsedStep = Number(savedStep);
  const normalizedStep = Number.isFinite(parsedStep) ? parsedStep : 0;
  return Math.max(0, Math.min(lastStepIndex, normalizedStep));
};

const getUnlockedBadgeIdsFromProgress = (progressList: BadgeProgressSnapshot[]) => {
  const ids = new Set<string>();
  const perfectTopicIds = new Set<string>();

  progressList.forEach((progress) => {
    if (progress.badgeEarned) {
      const badge = getTopicBadgeByTopicId(progress.topicId);
      if (badge) ids.add(badge.id);
    }

    if (isTopicSubmittedOrCompleted(progress) && Number(progress.quizScore || progress.score || 0) >= 100) {
      if (progress.topicId) perfectTopicIds.add(progress.topicId);
    }
  });

  const completedTopics = progressList.filter(isTopicSubmittedOrCompleted).length;
  if (perfectTopicIds.size >= 1) ids.add('badge-juara-kuis');
  if (perfectTopicIds.size >= 3) ids.add('badge-super-kuis-3-topik');
  if (perfectTopicIds.size >= 5) ids.add('badge-sang-juara');
  if (completedTopics >= 8) ids.add('badge-sempurna');

  return ids;
};

const getCompletionCelebrationBadges = (
  previousProgressList: BadgeProgressSnapshot[],
  completedProgress: BadgeProgressSnapshot,
  topicBadgeId?: string,
) => {
  const previousIds = getUnlockedBadgeIdsFromProgress(previousProgressList);
  const nextProgressMap = new Map<string, BadgeProgressSnapshot>();

  previousProgressList.forEach((progress) => {
    if (progress.topicId) nextProgressMap.set(progress.topicId, progress);
  });
  if (completedProgress.topicId) {
    nextProgressMap.set(completedProgress.topicId, completedProgress);
  }

  const nextIds = getUnlockedBadgeIdsFromProgress(Array.from(nextProgressMap.values()));
  const orderedBadgeIds = [
    topicBadgeId,
    'badge-juara-kuis',
    'badge-super-kuis-3-topik',
    'badge-sang-juara',
    'badge-sempurna',
  ].filter(Boolean) as string[];

  return orderedBadgeIds
    .filter((badgeId) => nextIds.has(badgeId) && !previousIds.has(badgeId))
    .map((badgeId) => badgeMap[badgeId])
    .filter((badge): badge is Badge => Boolean(badge));
};

const TOPIC1_PAGE2_SUBMISSION_KEY = 'topic1-page2-submission';
const TOPIC1_PAGE2_ACTIVITY_KEYS = ['activity-1', 'activity-2', 'activity-3', 'agreement-card'];

const getTopic1Page2MissingItems = (answers: Record<string, any>, topic: any) => {
  const missing: string[] = [];
  const activity1 = answers['activity-1'] || {};
  const activity1Complete = [1, 2, 3].every((rowIdx) =>
    ['aktivitas', 'perangkat', 'manfaat'].every((field) =>
      String(activity1[`row_${rowIdx}_${field}`] ?? '').trim()
    )
  );

  if (!activity1Complete) {
    missing.push('Aktivitas 1');
  }

  const activity2 = answers['activity-2'] || {};
  const activity2Complete = ['sit1', 'sit2', 'sit3', 'sit4', 'sit5'].every((questId) =>
    ['risiko', 'tindakan'].every((field) =>
      String(activity2[`${questId}_${field}`] ?? '').trim()
    )
  );

  if (!activity2Complete) {
    missing.push('Aktivitas 2');
  }

  const activity3 = answers['activity-3'] || {};
  const activity3Complete = Array.from({ length: 10 }).every((_, i) =>
    String(activity3[`q-${i + 1}`] ?? '').trim()
  );

  if (!activity3Complete) {
    missing.push('Aktivitas 3');
  }

  const agreement = answers['agreement-card'] || {};
  const agreementComplete =
    !!agreement.isSaved &&
    String(agreement.nama ?? '').trim() &&
    Array.isArray(agreement.untuk) && agreement.untuk.length >= 4 &&
    Array.isArray(agreement.tidakAkan) && agreement.tidakAkan.length >= 2 &&
    String(agreement.signature ?? '').trim();

  if (!agreementComplete) {
    missing.push('Kartu Komitmen');
  }

  // Check Ayo Mengamati if present in topic steps
  const mengamatiStep = topic?.steps?.find((s: any) => s.type === 'ayo-mengamati');
  if (mengamatiStep) {
    const qIds = mengamatiStep.questions?.map((q: any) => q.id) || [];
    const mengamatiComplete = qIds.every((id: string) => String(answers[id] ?? '').trim());
    if (!mengamatiComplete) {
      missing.push('Ayo Mengamati');
    }
  }

  return missing;
};

export default function TopicFlow() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { topics: topicModules, loading: modulesLoading } = useModules();

  // Find active topic
  const topic = useMemo(() => {
    return topicModules.find((t) => t.id === topicId);
  }, [topicId, topicModules]);
  const activityTheme = getActivityTheme(topic?.id);
  const activityThemeVars = useMemo(
    () => ({
      '--activity-accent': activityTheme.accent,
      '--activity-accent-strong': activityTheme.strong,
      '--activity-soft': activityTheme.soft,
      '--activity-faint': activityTheme.faint,
      '--activity-border': activityTheme.border,
      '--activity-ink': activityTheme.ink,
    } as any),
    [activityTheme],
  );

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showSimModal, setShowSimModal] = useState(false);
  const [_submitting, setSubmitting] = useState(false);
  const [page2Submitting, setPage2Submitting] = useState(false);
  const [completedScore, setCompletedScore] = useState<number | null>(null);
  const [grade, setGrade] = useState<any>(null);
  const [badgeCelebrationQueue, setBadgeCelebrationQueue] = useState<Badge[]>([]);
  const badgeCelebration = badgeCelebrationQueue[0] || null;
  const isChampionBadgeCelebration = badgeCelebration?.id === 'badge-sang-juara';

  const studentUid = user?.uid;
  const guruId = userProfile?.guruId || '';

  // 1. Fetch teacher lock settings in real-time
  useEffect(() => {
    if (!guruId || !topicId) return;
    if (!db) {
      try {
        const localLocks = localStorage.getItem(`sibercerdas_demo_locks_${guruId}`);
        if (localLocks) {
          const locks = JSON.parse(localLocks);
          setIsLocked(!!locks[topicId]);
        } else {
          setIsLocked(false);
        }
      } catch (err) {
        console.error('Failed to load local locks:', err);
      }
      return;
    }
    const docRef = doc(db, 'settings', guruId);
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const settings = snap.data();
          const locks = settings.topicLocks || {};
          setIsLocked(!!locks[topicId]);
        }
      },
      (err) => {
        safeLog('error', 'Failed to fetch settings lock state', err);
      }
    );
    return () => unsub();
  }, [guruId, topicId]);

  // 2. Fetch student progress & answers draft
  useEffect(() => {
    if (!studentUid || !topicId || !topic) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const progressDocId = `${studentUid}_${topicId}`;

        if (!db) {
          const list = getDemoProgressList(studentUid);
          let prog = list.find((p: any) => p.topicId === topicId);

          let stepIndex = 0;
          if (prog) {
            stepIndex = getSavedStepIndex(topic, prog.currentStep);
            if (isTopicSubmittedOrCompleted(prog)) {
              setCompletedScore(prog.quizScore ?? prog.score ?? 100);
            }
          } else {
            // Initialize progress doc in demoStore
            prog = {
              id: progressDocId,
              uid: studentUid,
              studentUid,
              moduleId: 'aku-cerdas-digital',
              topicId,
              currentStep: 0,
              status: 'active',
              score: 0,
              scoreStatus: 'pending_teacher',
              submissionStatus: 'draft',
              badges: [],
            };
            saveDemoProgress(prog);
          }
          setCurrentStep(stepIndex);
          setCurrentPage(getPageForStepIndex(topic, stepIndex));

          // Fetch draft answers
          const draft = getDemoResponse(studentUid, topicId);
          if (draft) {
            setAnswers(draft.answers || {});
            setSimulationResult(draft.simulationResult || null);
            if (!draft.isDraft) {
              const quizStep = topic.steps.find((s) => s.type === 'uji-pemahaman');
              const quizResult = calculateMultipleChoiceScore(quizStep?.questions || [], draft.answers || {});
              setCompletedScore(draft.quizScore ?? quizResult.score);
            }
          }

          const gradesList = getDemoGrades(studentUid);
          const activeGrade = gradesList.find((g: any) => g.topicId === topicId);
          if (activeGrade) {
            setGrade(activeGrade);
          }

          setLoading(false);
          window.scrollTo(0, 0); // Reset scroll position to top
          return;
        }

        const progSnap = await getDoc(doc(db, 'progress', progressDocId));

        let stepIndex = 0;
        if (progSnap.exists()) {
          const progData = progSnap.data();
          stepIndex = getSavedStepIndex(topic, progData.currentStep);
          if (isTopicSubmittedOrCompleted(progData)) {
            setCompletedScore(progData.quizScore ?? progData.score ?? 100);
          }
        } else {
          // Initialize progress doc
          await setDoc(doc(db, 'progress', progressDocId), {
            uid: studentUid,
            studentUid,
            guruId,
            topicId,
            moduleId: 'aku-cerdas-digital',
            currentStep: 0,
            status: 'active',
            score: 0,
            scoreStatus: 'pending_teacher',
            submissionStatus: 'draft',
            badges: [],
            startedAt: serverTimestamp(),
          });
        }
        setCurrentStep(stepIndex);
        setCurrentPage(getPageForStepIndex(topic, stepIndex));

        // Fetch draft answers
        const respSnap = await getDoc(doc(db, 'student_topic_responses', progressDocId));
        if (respSnap.exists()) {
          const respData = respSnap.data();
          setAnswers(respData.answers || {});
          setSimulationResult(respData.simulationResult || null);
          if (!respData.isDraft) {
            const quizStep = topic.steps.find((s) => s.type === 'uji-pemahaman');
            const quizResult = calculateMultipleChoiceScore(quizStep?.questions || [], respData.answers || {});
            setCompletedScore(respData.quizScore ?? quizResult.score);
          }
        }

        // Fetch grade
        const gradeSnap = await getDoc(doc(db, 'topicGrades', `${studentUid}_${topicId}`));
        if (gradeSnap.exists()) {
          setGrade(gradeSnap.data());
        }
      } catch (err) {
        safeLog('error', 'Failed loading topic flow progress', err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0); // Reset scroll position to top
      }
    };

    loadData();
  }, [guruId, studentUid, topicId, topic]);

  // Helper to save draft answers
  const saveDraft = useCallback(
    async (updatedAnswers: Record<string, any>, simRes: any = null) => {
      if (!studentUid || !topicId) return;
      const progressDocId = `${studentUid}_${topicId}`;
      const payload = {
        studentUid,
        uid: studentUid,
        guruId,
        topicId,
        moduleId: 'aku-cerdas-digital',
        step: currentStep,
        answers: updatedAnswers,
        simulationResult: simRes || simulationResult,
        isDraft: true,
      };

      if (!db) {
        saveDemoResponse({
          ...payload,
          id: progressDocId,
          lastSaved: Date.now(),
        });
        return;
      }

      const dbPayload = {
        ...payload,
        lastSaved: serverTimestamp(),
      };

      try {
        // Optimistic offline queue fallback
        if (!navigator.onLine) {
          enqueue('student_topic_responses', progressDocId, dbPayload, 'set');
        } else {
          await setDoc(doc(db!, 'student_topic_responses', progressDocId), dbPayload, { merge: true });
        }
      } catch (err) {
        safeLog('warn', 'Failed to save draft online. Trying offline queue', err);
        enqueue('student_topic_responses', progressDocId, dbPayload, 'set');
      }
    },
    [guruId, studentUid, topicId, currentStep, simulationResult]
  );

  // Auto-save helpers per step
  const handleAnswerChange = useCallback(
    (questionId: string, val: any) => {
      const nextAnswers = { ...answers, [questionId]: val };
      setAnswers(nextAnswers);
      saveDraft(nextAnswers);
    },
    [answers, saveDraft]
  );

  const isTopic1Page2Submitted =
    topic?.id === 'topik-1' && Boolean((answers[TOPIC1_PAGE2_SUBMISSION_KEY] as any)?.submittedAt);

  const handleTopic1Page2AnswerChange = useCallback(
    (key: string, val: any) => {
      if (isTopic1Page2Submitted && TOPIC1_PAGE2_ACTIVITY_KEYS.includes(key)) return;
      handleAnswerChange(key, val);
    },
    [handleAnswerChange, isTopic1Page2Submitted]
  );

  const handleTopic1Page2Submit = useCallback(async () => {
    if (!studentUid || !topicId || !topic || isTopic1Page2Submitted || page2Submitting) return;

    const missing = getTopic1Page2MissingItems(answers, topic);
    if (missing.length > 0) {
      alert(`Lengkapi dulu bagian berikut sebelum dikirim ke guru: ${missing.join(', ')}.`);
      return;
    }

    const firstConfirm = window.confirm('Kirim semua aktivitas halaman 2 Topik 1 ke guru sekarang? Pastikan jawabanmu sudah benar.');
    if (!firstConfirm) return;

    const secondConfirm = window.confirm('Konfirmasi terakhir: setelah dikirim, jawaban aktivitas halaman 2 tidak bisa diubah lagi. Tetap kirim?');
    if (!secondConfirm) return;

    setPage2Submitting(true);
    const submittedAt = Date.now();
    const progressDocId = `${studentUid}_${topicId}`;
    const activityLogDocId = `${studentUid}_${topicId}_page2_${submittedAt}`;
    const finalAnswers = {
      ...answers,
      [TOPIC1_PAGE2_SUBMISSION_KEY]: {
        submittedAt,
        status: 'dikirim',
        sections: TOPIC1_PAGE2_ACTIVITY_KEYS,
      },
    };
    const payloadResponse: any = {
      studentUid,
      uid: studentUid,
      guruId,
      topicId,
      moduleId: 'aku-cerdas-digital',
      step: findStepIndex(topic, 'custom-komitmen', 102),
      answers: finalAnswers,
      simulationResult,
      isDraft: true,
      page2ActivitySubmitted: true,
    };
    const activityLogPayload = {
      guruId,
      studentUid,
      studentName: userProfile?.displayName || 'Siswa',
      action: `Mengirim Aktivitas Halaman 2 Topik: ${topic.title}`,
      topicTitle: topic.title,
    };

    setAnswers(finalAnswers);

    try {
      if (!db) {
        saveDemoResponse({
          ...payloadResponse,
          id: progressDocId,
          lastSaved: submittedAt,
          page2ActivitySubmittedAt: submittedAt,
        });
        logDemoActivity(
          guruId,
          userProfile?.displayName || 'Siswa',
          `Mengirim Aktivitas Halaman 2 Topik: ${topic.title}`,
          topic.title,
          studentUid
        );
      } else if (navigator.onLine) {
        await setDoc(doc(db!, 'student_topic_responses', progressDocId), {
          ...payloadResponse,
          lastSaved: serverTimestamp(),
          page2ActivitySubmittedAt: serverTimestamp(),
        }, { merge: true });
        await setDoc(doc(db!, 'activityLog', activityLogDocId), {
          ...activityLogPayload,
          timestamp: serverTimestamp(),
        });
      } else {
        enqueue('student_topic_responses', progressDocId, {
          ...payloadResponse,
          lastSaved: submittedAt,
          page2ActivitySubmittedAt: submittedAt,
        }, 'set');
        enqueue('activityLog', activityLogDocId, {
          ...activityLogPayload,
          timestamp: submittedAt,
        }, 'set');
      }

      alert('Aktivitas halaman 2 sudah dikirim ke guru. Jawabanmu sekarang terkunci.');
    } catch (err) {
      safeLog('warn', 'Failed submitting topic 1 page 2 activities online. Trying offline queue', err);
      enqueue('student_topic_responses', progressDocId, {
        ...payloadResponse,
        lastSaved: submittedAt,
        page2ActivitySubmittedAt: submittedAt,
      }, 'set');
      enqueue('activityLog', activityLogDocId, {
        ...activityLogPayload,
        timestamp: submittedAt,
      }, 'set');
      alert('Aktivitas halaman 2 sudah disiapkan untuk dikirim ke guru. Jawabanmu sekarang terkunci.');
    } finally {
      setPage2Submitting(false);
    }
  }, [
    answers,
    guruId,
    isTopic1Page2Submitted,
    page2Submitting,
    simulationResult,
    studentUid,
    topic,
    topicId,
    userProfile?.displayName,
  ]);

  // Update current step index in DB
  const updateProgressStep = async (stepIdx: number) => {
    if (!studentUid || !topicId) return;
    if (!db) {
      const list = getDemoProgressList(studentUid);
      const prog = list.find((p: any) => p.topicId === topicId);
      if (prog) {
        prog.currentStep = stepIdx;
        saveDemoProgress(prog);
      }
      return;
    }
    const progressDocId = `${studentUid}_${topicId}`;
    try {
      if (navigator.onLine) {
        await updateDoc(doc(db!, 'progress', progressDocId), {
          currentStep: stepIdx,
        });
      } else {
        enqueue('progress', progressDocId, { currentStep: stepIdx }, 'update');
      }
    } catch (err) {
      safeLog('warn', 'Failed updating step progress online', err);
      enqueue('progress', progressDocId, { currentStep: stepIdx }, 'update');
    }
  };

  const getStepStatus = (stepIdx: number, stepObj: any) => {
    if (grade?.activityGrades?.[stepIdx]) {
      return 'dinilai';
    }
    if (completedScore !== null) {
      return 'dikirim';
    }
    const qIds = stepObj.questions?.map((q: any) => q.id) || [];
    const hasAnswers = qIds.some((id: string) => answers[id] !== undefined && answers[id] !== '');
    return hasAnswers ? 'draf' : 'belum';
  };

  const loadProgressForBadgeCelebration = useCallback(async () => {
    if (!studentUid) return [] as BadgeProgressSnapshot[];

    if (!db) {
      return getDemoProgressList(studentUid) as BadgeProgressSnapshot[];
    }

    const progressByTopic = new Map<string, BadgeProgressSnapshot>();
    for (const field of ['uid', 'studentUid'] as const) {
      try {
        const progressQuery = query(collection(db!, 'progress'), where(field, '==', studentUid));
        const snap = await getDocs(progressQuery);
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data() as BadgeProgressSnapshot;
          if (data.topicId) progressByTopic.set(data.topicId, data);
        });
      } catch (err) {
        safeLog('warn', `Failed loading progress by ${field} for badge celebration`, err);
      }
    }

    return Array.from(progressByTopic.values());
  }, [studentUid]);

  const fireBadgeCelebrationConfetti = useCallback(() => {
    const colors = [activityTheme.accent, activityTheme.strong, '#f59e0b', '#fbbf24'];

    canvasConfetti({
      particleCount: 90,
      spread: 95,
      startVelocity: 42,
      origin: { y: 0.58 },
      colors,
      shapes: ['star', 'circle'],
      scalar: 1.15,
    });

    window.setTimeout(() => {
      canvasConfetti({
        particleCount: 55,
        spread: 70,
        startVelocity: 32,
        origin: { x: 0.22, y: 0.62 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 0.9,
      });
      canvasConfetti({
        particleCount: 55,
        spread: 70,
        startVelocity: 32,
        origin: { x: 0.78, y: 0.62 },
        colors,
        shapes: ['star', 'circle'],
        scalar: 0.9,
      });
    }, 280);

    window.setTimeout(() => {
      canvasConfetti({
        particleCount: 35,
        spread: 120,
        startVelocity: 24,
        origin: { y: 0.35 },
        colors,
        shapes: ['circle'],
        scalar: 0.8,
      });
    }, 700);
  }, [activityTheme.accent, activityTheme.strong]);

  const triggerBadgeCelebration = useCallback(
    (earnedBadges: Badge[]) => {
      if (earnedBadges.length === 0) {
        fireBadgeCelebrationConfetti();
        return;
      }

      setBadgeCelebrationQueue((currentQueue) => [...currentQueue, ...earnedBadges]);
    },
    [fireBadgeCelebrationConfetti],
  );

  useEffect(() => {
    if (badgeCelebration) {
      fireBadgeCelebrationConfetti();
    }
  }, [badgeCelebration, fireBadgeCelebrationConfetti]);

  const handlePageChange = (pageVal: number) => {
    setCurrentPage(pageVal);
    const stepIdx = getFirstStepIndexForPage(topic, pageVal);

    setCurrentStep(stepIdx);
    updateProgressStep(stepIdx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentPage < 3) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Run simulation callback
  const handleSimulationComplete = async (result: any) => {
    setSimulationResult(result);
    setShowSimModal(false);
    // Auto save draft with simulation result
    saveDraft(answers, result);

    if (result.sharedGalleryItem) {
      const item = {
        uid: studentUid,
        studentUid,
        guruId,
        displayName: userProfile?.displayName || 'Petualang Cerdas',
        avatar: userProfile?.avatarEmoji || '',
        topicId: topicId || 'topik-8',
        topicTitle: topic?.title || 'Topik 8',
        content: result.sharedGalleryItem.content,
        mediaType: result.sharedGalleryItem.mediaType,
        imageUrl: result.sharedGalleryItem.imageUrl || '',
        videoUrl: result.sharedGalleryItem.videoUrl || '',
        sharedAt: Date.now(),
        appreciations: { thumbs: 0, hearts: 0, comments: 0 },
        thumbsBy: [],
        heartsBy: [],
        status: 'pending' as const,
      };

      try {
        if (!db) {
          saveDemoGalleryItem({
            id: `demo-gal-${Date.now()}`,
            createdAt: Date.now(),
            ...item,
          });
        } else {
          await addDoc(collection(db, 'classGallery'), {
            ...item,
            createdAt: serverTimestamp(),
          });
        }
        alert('Karyamu berhasil dikirim ke guru untuk dimoderasi sebelum tampil di Galeri Kelas! 🎉');
      } catch (err) {
        console.error('Failed to auto-share simulation artwork:', err);
      }
    }

    canvasConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const handleFinalSubmit = async (
    mcAnswersObj: Record<string, number>,
    essayAnswersObj: Record<string, string>
  ) => {
    if (!studentUid || !topicId || !topic) return;
    setSubmitting(true);

    // 1. Gather all answers from state + final submit
    const finalAnswers = {
      ...answers,
      ...mcAnswersObj,
      ...essayAnswersObj,
    };

    // Calculate multiple-choice quiz score
    const quizStep = topic.steps.find((s) => s.type === 'uji-pemahaman');
    const quizResult = calculateMultipleChoiceScore(quizStep?.questions || [], mcAnswersObj);
    const mcScore = quizResult.score;

    // Assemble arrays for teacher rubric grading
    const formattedMcAnswers: any[] = [];
    const formattedTextAnswers: any[] = [];

    // Traverse all steps to find answers
    topic.steps.forEach((step) => {
      if (step.questions) {
        step.questions.forEach((q) => {
          if (q.type === 'mc') {
            const chosenIdx = finalAnswers[q.id];
            const correctOption = q.options?.find((o) => o.isCorrect);
            const chosenOption = q.options?.[chosenIdx];
            formattedMcAnswers.push({
              questionId: q.id,
              questionText: q.question,
              answer: chosenOption?.text || 'Tidak dijawab',
              correct: !!chosenOption?.isCorrect,
              correctAnswerText: correctOption?.text || '',
            });
          } else if (q.type === 'essay' || q.type === 'reflective') {
            formattedTextAnswers.push({
              questionId: q.id,
              questionText: q.question,
              answer: finalAnswers[q.id] || '',
            });
          }
        });
      }
    });

    const progressDocId = `${studentUid}_${topicId}`;
    const activityLogDocId = `${studentUid}_${topicId}_${Date.now()}`;
    const finalStepIndex = Math.max(0, topic.steps.length - 1);
    const activityLogPayload = {
      guruId,
      studentUid,
      studentName: userProfile?.displayName || 'Siswa',
      action: `Menyelesaikan Topik: ${topic.title} dengan skor kuis ${mcScore}%`,
      topicTitle: topic.title,
    };
    const payloadResponse: any = {
      studentUid,
      uid: studentUid,
      guruId,
      topicId,
      moduleId: 'aku-cerdas-digital',
      step: finalStepIndex,
      answers: finalAnswers,
      simulationResult,
      mcAnswers: formattedMcAnswers,
      textAnswers: formattedTextAnswers,
      simulationScore: simulationResult?.score ?? 0,
      quizScore: mcScore,
      quizCorrect: quizResult.correct,
      quizTotal: quizResult.total,
      isDraft: false,
    };

    const payloadProgress: any = {
      uid: studentUid,
      studentUid,
      guruId,
      topicId,
      moduleId: 'aku-cerdas-digital',
      currentStep: finalStepIndex,
      submissionStatus: 'submitted',
      quizScore: mcScore,
      quizCorrect: quizResult.correct,
      quizTotal: quizResult.total,
      scoreStatus: 'pending_teacher',
      badges: [topic.badgeId],
      badgeEarned: true,
    };

    const completedProgressForCelebration: BadgeProgressSnapshot = {
      ...payloadProgress,
    };
    const previousProgressList = await loadProgressForBadgeCelebration();
    const celebrationBadges = getCompletionCelebrationBadges(
      previousProgressList,
      completedProgressForCelebration,
      topic.badgeId,
    );

    if (!db) {
      const localResponse = {
        ...payloadResponse,
        lastSaved: Date.now(),
        submittedAt: Date.now(),
      };
      saveDemoResponse(localResponse);

      const localProgress = {
        id: progressDocId,
        uid: studentUid,
        studentUid,
        moduleId: 'aku-cerdas-digital',
        topicId,
        currentStep: finalStepIndex,
        status: 'active' as const,
        submissionStatus: 'submitted' as const,
        score: 0,
        scoreStatus: 'pending_teacher' as const,
        quizScore: mcScore,
        quizCorrect: quizResult.correct,
        quizTotal: quizResult.total,
        badges: [topic.badgeId],
        submittedAt: Date.now(),
        badgeEarned: true,
      };
      saveDemoProgress(localProgress);

      const bestEssay = formattedTextAnswers[0]?.answer || '';
      if (bestEssay.trim().length > 15) {
        saveDemoGalleryItem({
          id: `${studentUid}_${topicId}`,
          uid: studentUid,
          studentUid,
          guruId,
          displayName: userProfile?.displayName || 'Petualang Cerdas',
          studentName: userProfile?.displayName || 'Petualang Cerdas',
          avatar: userProfile?.avatarEmoji || '',
          topicId,
          topicTitle: topic.title,
          content: bestEssay,
          createdAt: Date.now(),
          sharedAt: Date.now(),
          appreciations: { thumbs: 0, hearts: 0, comments: 0 },
          thumbsBy: [],
          heartsBy: [],
          status: 'pending',
        });
      }

      logDemoActivity(
        guruId,
        userProfile?.displayName || 'Siswa',
        `Menyelesaikan Topik: ${topic.title} dengan skor kuis ${mcScore}%`,
        topic.title,
        studentUid
      );

      setCurrentStep(finalStepIndex);
      setCurrentPage(getPageForStepIndex(topic, finalStepIndex));
      setCompletedScore(mcScore);
      triggerBadgeCelebration(celebrationBadges);
      setSubmitting(false);
      return;
    }

    try {
      if (navigator.onLine) {
        await setDoc(doc(db!, 'student_topic_responses', progressDocId), {
          ...payloadResponse,
          lastSaved: serverTimestamp(),
          submittedAt: serverTimestamp(),
        });
        await updateDoc(doc(db!, 'progress', progressDocId), {
          ...payloadProgress,
          submittedAt: serverTimestamp(),
        });
        await setDoc(doc(db!, 'activityLog', activityLogDocId), {
          ...activityLogPayload,
          timestamp: serverTimestamp(),
        });

        // Share best work automatically to Class Gallery
        const bestEssay = formattedTextAnswers[0]?.answer || '';
        if (bestEssay.trim().length > 15) {
          await setDoc(doc(db!, 'classGallery', `${studentUid}_${topicId}`), {
            uid: studentUid,
            studentUid,
            guruId,
            displayName: userProfile?.displayName || 'Petualang Cerdas',
            avatar: userProfile?.avatarEmoji || '',
            topicId,
            topicTitle: topic.title,
            content: bestEssay,
            createdAt: serverTimestamp(),
            appreciations: { thumbs: 0, hearts: 0, comments: 0 },
            thumbsBy: [],
            heartsBy: [],
            status: 'pending',
          });
        }
      } else {
        const queuedAt = Date.now();
        enqueue('student_topic_responses', progressDocId, {
          ...payloadResponse,
          lastSaved: queuedAt,
          submittedAt: queuedAt,
        }, 'set');
        enqueue('progress', progressDocId, {
          ...payloadProgress,
          status: 'active',
          score: 0,
          submittedAt: queuedAt,
        }, 'set');
        enqueue('activityLog', activityLogDocId, {
          ...activityLogPayload,
          timestamp: queuedAt,
        }, 'set');
      }

      setCurrentStep(finalStepIndex);
      setCurrentPage(getPageForStepIndex(topic, finalStepIndex));
      setCompletedScore(mcScore);
      triggerBadgeCelebration(celebrationBadges);
    } catch (err) {
      safeLog('error', 'Failed submitting final responses', err);
      // fallback to offline queue
      const queuedAt = Date.now();
      enqueue('student_topic_responses', progressDocId, {
        ...payloadResponse,
        lastSaved: queuedAt,
        submittedAt: queuedAt,
      }, 'set');
      enqueue('progress', progressDocId, {
        ...payloadProgress,
        status: 'active',
        score: 0,
        submittedAt: queuedAt,
      }, 'set');
      enqueue('activityLog', activityLogDocId, {
        ...activityLogPayload,
        timestamp: queuedAt,
      }, 'set');
      setCurrentStep(finalStepIndex);
      setCurrentPage(getPageForStepIndex(topic, finalStepIndex));
      setCompletedScore(mcScore);
      triggerBadgeCelebration(celebrationBadges);
    } finally {
      setSubmitting(false);
    }
  };

  // Render the active simulation overlay component
  const renderSimulationComponent = () => {
    if (!topic) return null;
    const simStep = topic.steps.find((s) => s.type === 'ayo-bereksplorasi');
    const simId = simStep?.simulationId;

    switch (simId) {
      case 'identitas-digital':
        return <IdentitasDigitalSim onComplete={handleSimulationComplete} />;
      case 'hoax-detective':
        return <HoaxDetectiveSim onComplete={handleSimulationComplete} />;
      case 'privacy-tiktok':
        return <PrivacySimTikTok onComplete={handleSimulationComplete} />;
      case 'keamanan-siber':
        return <KeamananSiberSim onComplete={handleSimulationComplete} />;
      case 'etika-chat':
        return <EtikaChatSim onComplete={handleSimulationComplete} />;
      case 'media-sosial':
        return <MediaSosialSim onComplete={handleSimulationComplete} />;
      case 'copyright':
        return <CopyrightSim onComplete={handleSimulationComplete} />;
      case 'kreator-konten':
        return <KreatorKontenSim onComplete={handleSimulationComplete} />;
      case 'ai-chat-bullying':
        return <AIChatBullyingSim onComplete={handleSimulationComplete} />;
      case 'teman-baik':
        return <TemanBaikSim onComplete={handleSimulationComplete} />;
      default:

        return (
          <div className="text-center p-8 bg-white rounded-3xl">
            <p className="text-red-500 font-bold">Simulator tidak ditemukan: {simId}</p>
            <button className="btn-primary mt-4" onClick={() => setShowSimModal(false)}>
              Tutup
            </button>
          </div>
        );
    }
  };

  // Render paged content
  const renderPageContent = (pageNum: number) => {
    if (!topic) return null;

    const getStepByIndex = (idx: number): TopicStep => topic.steps[idx] || ({ type: 'unknown' as any, content: '', title: '' } as TopicStep);
    const getStepIndexByType = (type: string, fallback = 0) => findStepIndex(topic, type, fallback);
    const getStepByType = (type: string, fallback = 0) => getStepByIndex(getStepIndexByType(type, fallback));

    if (pageNum === 1) {
      // Step 0: Tujuan Pembelajaran
      const step0Index = getStepIndexByType('tujuan', 0);
      const step0 = getStepByIndex(step0Index);
      const step0Lines = step0.content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && (l.match(/^\d+\./) || l.startsWith('-') || l.startsWith('*') || l.startsWith('•')));
      const objectives = step0Lines.map((line, i) => {
        const cleanedText = line
          .replace(/^\d+\.\s*/, '')
          .replace(/^[-*•]\s*/, '')
          .replace(/\*/g, '')
          .trim();
        return { id: `obj-${i}`, text: cleanedText };
      });
      const finalObjectives = objectives.length > 0 ? objectives : [{ id: 'obj-1', text: step0.content.replace(/\*/g, '') }];

      // Step 1: Kata Kunci
      const step1 = getStepByType('kata-kunci', 1);
      const keywordLines = step1.content
        .split(/\n{2,}/)
        .flatMap((block) => block.split('\n'))
        .map((line) => line.trim())
        .filter(Boolean);
      const terms = keywordLines.map((line) => {
        const cleanedLine = line
          .replace(/^\s*/, '')
          .replace(/^[-*•]\s*/, '')
          .trim();
        const parts = cleanedLine.split(/\s+[–—-]\s+/);
        return {
          term: parts[0]?.replace(/\*/g, '').trim() || '',
          definition: parts.slice(1).join(' - ').replace(/\*/g, '').trim(),
        };
      }).filter((term) => term.term);

      // Step 2: Peta Materi
      const step2 = getStepByType('peta-materi', 2);
      const flowSteps = step2.content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && /(Kamu di sini|Halaman|Tahap|Langkah|Evaluasi|Refleksi)/.test(line))
        .map((line, i) => {
          const cleanedLine = line.replace(/^[^\p{L}\p{N}]+/u, '').trim();
          const parts = cleanedLine.split(/\s*(?::|→)\s+/);
          return {
            id: `pm-${i}`,
            number: i + 1,
            title: parts[0]?.trim() || '',
            description: parts.slice(1).join(': ').trim(),
            isActive: i === 0,
            isCompleted: false,
          };
        });

      // Step 3: Bersiap-Siap Belajar
      const step3Index = getStepIndexByType('bersiap-belajar', 3);
      const step3 = getStepByIndex(step3Index);

      // Step 4: Tantangan Awal
      const step4Index = getStepIndexByType('tantangan-awal', 4);
      const step4 = getStepByIndex(step4Index);
      const mcQs = (step4.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options?.map((o) => o.text) || [],
        correctIndex: q.options?.findIndex((o) => o.isCorrect) ?? 0,
        imageUrl: q.imageUrl,
        context: q.context,
      }));

      return (
        <div className="learning-activity-soft space-y-8" style={activityThemeVars}>
          <TujuanStep objectives={finalObjectives} />
          <KataKunciStep terms={terms} />
          <PetaMateriStep steps={flowSteps} />
          <BersiapBelajarStep
            questions={step3.questions || []}
            answers={answers}
            onSaveAnswer={(qId, val) => handleAnswerChange(qId, val)}
            instruction={step3.instruction}
            exampleInput={step3.exampleInput}
            status={getStepStatus(step3Index, step3)}
            passage={step3.passage}
            mediaType={step3.mediaType}
            mediaUrl={step3.mediaUrl}
            comics={step3.comics}
          />
          {topic.id === 'topik-5' ? (
            <Topik5TantanganAwal
              answers={answers['t5-pesan-santun'] || {}}
              onSave={(val) => handleAnswerChange('t5-pesan-santun', val)}
            />
          ) : topic.id === 'topik-7' ? (
            <Topik7TantanganAwal
              answers={answers['t7-tantangan-awal'] || {}}
              onSave={(val) => handleAnswerChange('t7-tantangan-awal', val)}
            />
          ) : topic.id === 'topik-8' ? (
            <Topik8TantanganAwal
              answers={answers['t8-rancang-pesan'] || {}}
              onSave={(val) => handleAnswerChange('t8-rancang-pesan', val)}
            />
          ) : (

            <TantanganAwalStep
              questions={mcQs}
              onAnswer={(qId, idx) => handleAnswerChange(qId, idx)}
              instruction={step4.instruction}
              exampleInput={step4.exampleInput}
              status={getStepStatus(step4Index, step4)}
              passage={step4.passage}
            />
          )}
        </div>
      );
    }

    if (pageNum === 2) {
      // Step 5: Yuk, Belajar Bersama!
      const step5Index = getStepIndexByType('yuk-belajar', 5);
      const step5 = getStepByIndex(step5Index);
      const sections = step5.content.split('## ').filter(Boolean).map((block, i) => {
        const lines = block.split('\n');
        const title = lines[0]?.trim();
        const content = lines.slice(1).join('\n').trim();
        return { id: `sec-${i}`, title, content };
      });

      // Step 6: Ayo, Memahami!
      const step6Index = getStepIndexByType('ayo-memahami', 6);
      const step6 = getStepByIndex(step6Index);
      const step6McQs = (step6.questions || [])
        .filter((q) => q.type === 'mc')
        .map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options?.map((o) => o.text) || [],
          correctIndex: q.options?.findIndex((o) => o.isCorrect) ?? 0,
          imageUrl: q.imageUrl,
          context: q.context,
        }));
      const step6EssayQs = (step6.questions || [])
        .filter((q) => q.type === 'essay')
        .map((q) => ({
          id: q.id,
          question: q.question,
          maxScore: q.points,
          imageUrl: q.imageUrl,
          context: q.context,
        }));

      // Step 7: Ayo, Mengamati!
      const step7Index = getStepIndexByType('ayo-mengamati', 7);
      const step7 = getStepByIndex(step7Index);
      const step7McQuestionIds = (step7.questions || [])
        .filter((q) => q.type === 'mc')
        .map((q) => q.id);
      const step7EssayQs = (step7.questions || [])
        .filter((q) => q.type === 'essay')
        .map((q) => ({
          id: q.id,
          question: q.question,
          maxScore: q.points,
          imageUrl: q.imageUrl,
          context: q.context,
        }));
      const step7QuestionIds = step7EssayQs.map(q => q.id);

      // Step 8: Ayo, Bereksplorasi!
      const step8Index = getStepIndexByType('ayo-bereksplorasi', 8);
      const step8 = getStepByIndex(step8Index);

      return (
        <div
          className="learning-activity-soft space-y-8"
          style={activityThemeVars}
        >
          {topic.id === 'topik-1' ? (
            <YukBelajarTopik1
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-2' ? (
            <YukBelajarTopik2
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-3' ? (
            <YukBelajarTopik3
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-4' ? (
            <YukBelajarTopik4
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-5' ? (
            <YukBelajarTopik5
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-6' ? (
            <YukBelajarTopik6
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-7' ? (
            <YukBelajarTopik7
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : topic.id === 'topik-8' ? (
            <YukBelajarTopik8
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          ) : (
            <YukBelajarStep
              sections={sections}
              onActivitySave={(key: string, val: any) => handleAnswerChange(key, val)}
              activityAnswers={answers}
            />
          )}

          {topic.id === 'topik-1' ? (
            <>
              {/* Aktivitas 1: Tabel Belajar */}
              <Activity1Table
                answers={answers['activity-1'] || {}}
                onSave={(val) => handleTopic1Page2AnswerChange('activity-1', val)}
                readOnly={isTopic1Page2Submitted}
              />

              {/* Aktivitas 2: Quest Cards */}
              <Aktivitas2RisikoGamified
                answers={answers['activity-2'] || {}}
                onSave={(val) => handleTopic1Page2AnswerChange('activity-2', val)}
                readOnly={isTopic1Page2Submitted}
              />

              {/* Aktivitas 3: TTS Crossword */}
              <Aktivitas3TtsGamified
                answers={answers['activity-3'] || {}}
                onSave={(val) => handleTopic1Page2AnswerChange('activity-3', val)}
                readOnly={isTopic1Page2Submitted}
              />

              {/* Ayo Mengamati (Studi Kasus) */}
              {step7 && step7.type === 'ayo-mengamati' && (
                <AyoMengamatiStep
                  caseStudy={{
                    title: step7.title || 'Ayo Mengamati',
                    scenario: step7.content || '',
                    questions: step7EssayQs.map(q => q.question)
                  }}
                  onSaveResponse={(idx, text) => handleAnswerChange(step7QuestionIds[idx] || '', text)}
                  answers={answers}
                  questionIds={step7QuestionIds}
                  status={isTopic1Page2Submitted ? 'dikirim' : getStepStatus(step7Index, step7)}
                />
              )}


              <div className={`rounded-2xl border p-5 text-left shadow-sm ${isTopic1Page2Submitted
                ? 'border-success-200 bg-success-50/80'
                : 'border-primary-100 bg-white'
                }`}>
                {isTopic1Page2Submitted ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-100 text-success-700">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-success-800">
                          Aktivitas Sudah Dikirim ke Guru
                        </h4>
                        <p className="mt-1 text-xs font-medium leading-relaxed text-success-700">
                          Jawaban halaman 2 sudah terkunci dan tidak bisa diubah lagi oleh murid.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-primary-700">
                        Kirim Aktivitas ke Guru
                      </h4>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-primary-500">
                        Setelah dikirim, jawaban Aktivitas 1, Aktivitas 2, dan Kartu Komitmen akan terkunci.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTopic1Page2Submit}
                      disabled={page2Submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-400 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:shadow-glow hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {page2Submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {page2Submitting ? 'Mengirim...' : 'Kirim ke Guru'}
                    </button>
                  </div>
                )}
              </div>

              {/* Kartu Komitmen Perjanjian (Digital citizen card) - Ikrar Penjelajah Digital Cerdas */}
              <KartuPenggunaDigitalCerdas
                answers={answers['agreement-card'] || {}}
                onSave={(val) => handleTopic1Page2AnswerChange('agreement-card', val)}
                readOnly={isTopic1Page2Submitted}
              />
            </>
          ) : topic.id === 'topik-2' ? (
            <>
              {/* Ayo Mengamati Gamified */}
              <AyoMengamatiTopik2Gamified
                answers={answers['activity-mengamati-t2'] || {}}
                onSave={(val) => handleAnswerChange('activity-mengamati-t2', val)}
              />


              {/* Aktivitas Detektif Informasi (Interactive news portal) */}
              <AyoDetektifBeritaT2
                answers={answers['activity-detektif-berita-t2'] || {}}
                onSave={(val) => handleAnswerChange('activity-detektif-berita-t2', val)}
              />

              {/* Penutup: Simulasi Detektif Hoax */}
              {step8 && step8.simulationId && (
                <AyoBereksplorasiStep
                  simulation={{
                    type: 'hoax',
                    title: step8.title || 'Simulasi Interaktif',
                    description: step8.content || '',
                  }}
                  onLaunch={() => setShowSimModal(true)}
                  status={getStepStatus(step8Index, step8)}
                />
              )}
            </>
          ) : topic.id === 'topik-3' ? (
            <>
              {/* Eksplorasi Aktivitas 1: Analisis Formulir Digital */}
              <Topik3Aktivitas1
                answers={answers['t3-formulir'] || {}}
                onSave={(val) => handleAnswerChange('t3-formulir', val)}
              />

              {/* Eksplorasi Aktivitas 2: Detektif Permintaan Data */}
              <Topik3Aktivitas2
                answers={answers['t3-detektif-data'] || {}}
                onSave={(val) => handleAnswerChange('t3-detektif-data', val)}
              />

              {/* Eksplorasi Aktivitas 3: Membuat Kata Sandi Latihan */}
              <Topik3Aktivitas3
                answers={answers['t3-password'] || {}}
                onSave={(val) => handleAnswerChange('t3-password', val)}
              />

              {/* Eksplorasi Aktivitas 4: Simulasi Mengisi Situs Cerdas */}
              <Topik3Aktivitas4
                answers={answers['t3-sim-web'] || {}}
                onSave={(val) => handleAnswerChange('t3-sim-web', val)}
              />

              {/* Penutup: Simulasi Mengatur Privasi di Media Sosial */}
              {step8 && step8.simulationId && (
                <AyoBereksplorasiStep
                  simulation={{
                    type: 'privacy',
                    title: step8.title || 'Simulasi Interaktif',
                    description: step8.content || '',
                  }}
                  onLaunch={() => setShowSimModal(true)}
                  status={getStepStatus(step8Index, step8)}
                />
              )}
            </>
          ) : topic.id === 'topik-4' ? (
            <>
              {/* Eksplorasi Aktivitas 1: Detektif Tautan (Aman/Bahaya) */}
              <Topik4Aktivitas1
                answers={answers['t4-detektif-tautan'] || {}}
                onSave={(val) => handleAnswerChange('t4-detektif-tautan', val)}
              />

              {/* Eksplorasi Aktivitas 2: Apa yang Harus Kamu Lakukan? */}
              <Topik4Aktivitas2
                answers={answers['t4-tindakan-aman'] || {}}
                onSave={(val) => handleAnswerChange('t4-tindakan-aman', val)}
              />

              {/* Eksplorasi Aktivitas 3: Latihan Mengambil Keputusan */}
              <Topik4Aktivitas3
                answers={answers['t4-latihan-keputusan'] || {}}
                onSave={(val) => handleAnswerChange('t4-latihan-keputusan', val)}
              />

              {/* Eksplorasi Aktivitas 4: Lapor Konten Tidak Pantas ke Guru */}
              <Topik4Aktivitas4
                answers={answers['t4-lapor-konten'] || {}}
                onSave={(val) => handleAnswerChange('t4-lapor-konten', val)}
              />

              {/* Ayo Mengamati (Studi Kasus Keamanan Siber - Kasus Adit Top-Up Ilegal) */}
              {step7 && step7.type === 'ayo-mengamati' && (
                topic.id === 'topik-4' ? (
                  <AyoMengamatiTopik4Gamified
                    title={step7.title || 'Ayo Mengamati'}
                    questionIds={step7McQuestionIds}
                    answers={answers}
                    onSaveResponse={(idx, val) => {
                      const qId = step7McQuestionIds[idx];
                      if (qId) handleAnswerChange(qId, val);
                    }}
                    status={getStepStatus(step7Index, step7)}
                  />
                ) : (
                  <AyoMengamatiStep
                    caseStudy={{
                      title: step7.title || 'Ayo Mengamati',
                      scenario: step7.content || '',
                      questions: step7EssayQs.map(q => q.question)
                    }}
                    onSaveResponse={(idx, text) => handleAnswerChange(step7QuestionIds[idx] || '', text)}
                    answers={answers}
                    questionIds={step7QuestionIds}
                    status={getStepStatus(step7Index, step7)}
                  />
                )
              )}

              {/* Penutup: Simulasi Menghadapi Ancaman Siber */}

              {step8 && step8.simulationId && (
                <AyoBereksplorasiStep
                  simulation={{
                    type: 'password',
                    title: step8.title || 'Simulasi Interaktif',
                    description: step8.content || '',
                  }}
                  onLaunch={() => setShowSimModal(true)}
                  status={getStepStatus(step8Index, step8)}
                />
              )}
            </>
          ) : topic.id === 'topik-5' ? (
            <>
              {/* Eksplorasi Aktivitas 1: Santun atau Kurang Santun? */}
              <Topik5Aktivitas1
                answers={answers['t5-santun-kurang'] || {}}
                onSave={(val) => handleAnswerChange('t5-santun-kurang', val)}
              />

              {/* Eksplorasi Aktivitas 2: Ubah Jadi Lebih Baik */}
              <Topik5Aktivitas2
                answers={answers['t5-ubah-baik'] || {}}
                onSave={(val) => handleAnswerChange('t5-ubah-baik', val)}
              />

              {/* Eksplorasi Aktivitas 3: Studi Kasus Komentar Baik */}
              <Topik5Aktivitas3
                answers={answers['t5-studi-kasus'] || {}}
                onSave={(val) => handleAnswerChange('t5-studi-kasus', val)}
              />

              {/* Penutup: Simulasi Chat dengan Bijak */}
              <Topik5ChatBijak
                answers={answers['t5-chat-bijak'] || {}}
                onSave={(val) => handleAnswerChange('t5-chat-bijak', val)}
              />
            </>
          ) : topic.id === 'topik-6' ? (
            <>
              {/* Eksplorasi Aktivitas 1: Cerita Foto yang Disebarkan (peran) */}
              <Topik6Aktivitas1
                answers={answers['t6-foto-disebarkan'] || {}}
                onSave={(val) => handleAnswerChange('t6-foto-disebarkan', val)}
              />

              {/* Eksplorasi Aktivitas 2: Studi Kasus Pesan & Komentar */}
              <Topik6Aktivitas2
                answers={answers['t6-studi-kasus'] || {}}
                onSave={(val) => handleAnswerChange('t6-studi-kasus', val)}
              />

              {/* Pusat Simulasi Cyberbullying (8 Skenario WA & TikTok) */}
              <Topik6SimulationCenter
                answers={answers}
                onSave={(val) => { setAnswers(val); saveDraft(val); }}
              />



              {/* Penutup: Simulasi Jadi Teman Baik Digital */}

              {step8 && step8.simulationId && (
                <AyoBereksplorasiStep
                  simulation={{
                    type: 'privacy',
                    title: step8.title || 'Simulasi Interaktif',
                    description: step8.content || '',
                  }}
                  onLaunch={() => setShowSimModal(true)}
                  status={getStepStatus(step8Index, step8)}
                />
              )}
            </>
          ) : topic.id === 'topik-7' ? (
            <>
              {/* Eksplorasi Aktivitas 1: Berburu Sumber Gambar */}
              <Topik7Aktivitas1
                answers={answers['t7-berburu-gambar'] || {}}
                onSave={(val) => handleAnswerChange('t7-berburu-gambar', val)}
              />

              {/* Eksplorasi Aktivitas 2: Boleh atau Tidak Boleh? */}
              <Topik7Aktivitas2
                answers={answers['t7-boleh-tidak'] || {}}
                onSave={(val) => handleAnswerChange('t7-boleh-tidak', val)}
              />

              {/* Eksplorasi Aktivitas 3: Latihan Menulis Kredit Karya */}
              <Topik7Aktivitas3
                answers={answers['t7-kredit-karya'] || {}}
                onSave={(val) => handleAnswerChange('t7-kredit-karya', val)}
              />

              {/* Penutup: Simulasi Menggunakan Konten dengan Bertanggung Jawab */}
              <Topik7SimKonten
                answers={answers['t7-sim-konten'] || {}}
                onSave={(val) => handleAnswerChange('t7-sim-konten', val)}
              />
            </>
          ) : topic.id === 'topik-8' ? (
            <>
              <Topik8AktivitasAkhir
                answers={answers['t8-final-campaign'] || {}}
                onSave={(val) => handleAnswerChange('t8-final-campaign', val)}
                studentUid={studentUid || ''}
                userProfile={userProfile}
              />
            </>
          ) : (

            <>

              <AyoMemahamiStep

                mcQuestions={step6McQs}
                essayQuestions={step6EssayQs}
                onMCAnswer={(qId, idx) => handleAnswerChange(qId, idx)}
                onEssaySave={(qId, text) => handleAnswerChange(qId, text)}
                instruction={step6.instruction}
                exampleInput={step6.exampleInput}
                status={getStepStatus(step6Index, step6)}
                passage={step6.passage}
              />

              <AyoMengamatiStep
                caseStudy={{
                  title: step7.title || 'Ayo Mengamati',
                  scenario: step7.content || '',
                  questions: step7EssayQs.map(q => q.question)
                }}
                onSaveResponse={(idx, text) => handleAnswerChange(step7QuestionIds[idx] || '', text)}
                answers={answers}
                questionIds={step7QuestionIds}
                status={getStepStatus(step7Index, step7)}
              />

              {/* Simulation launcher card for step 8 */}
              {step8 && step8.simulationId && (
                <AyoBereksplorasiStep
                  simulation={{
                    type: (
                      {
                        'hoax-detective': 'hoax',
                        'privacy-tiktok': 'privacy',
                        'keamanan-siber': 'password',
                        'etika-chat': 'privacy',
                        'media-sosial': 'privacy',
                        'copyright': 'privacy',
                        'kreator-konten': 'privacy',
                        'ai-chat-bullying': 'privacy',
                      } as Record<string, string>
                    )[step8.simulationId] || 'privacy',
                    title: step8.title || 'Simulasi Interaktif',
                    description: step8.content || '',
                  }}
                  onLaunch={() => setShowSimModal(true)}
                  status={getStepStatus(step8Index, step8)}
                />
              )}
            </>
          )}
        </div>
      );
    }

    if (pageNum === 3) {
      // Step 9: Uji Pemahamanmu (10 PG)
      const step9Index = getStepIndexByType('uji-pemahaman', 8);
      const step9 = getStepByIndex(step9Index);
      const step9McQs = (step9.questions || [])
        .filter((q) => q.type === 'mc')
        .map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options?.map((o) => o.text) || [],
          correctIndex: q.options?.findIndex((o) => o.isCorrect) ?? 0,
          imageUrl: q.imageUrl,
          context: q.context,
        }));
      const step9EssayQs = (step9.questions || [])
        .filter((q) => q.type === 'essay')
        .map((q) => ({
          id: q.id,
          question: q.question,
          maxScore: q.points,
          imageUrl: q.imageUrl,
          context: q.context,
        }));

      // Step 10: Refleksi Akhir
      const step10Index = getStepIndexByType('refleksi', -1);
      const step10 = step10Index >= 0 ? getStepByIndex(step10Index) : null;
      const reflectionQuestionId = step10?.questions?.[0]?.id || 'refleksi-ans';

      return (
        <div className="learning-activity-soft space-y-8" style={activityThemeVars}>
          <UjiPemahamanStep
            mcQuestions={step9McQs}
            essayQuestions={step9EssayQs}
            onSubmit={handleFinalSubmit}
            submittedScore={completedScore}
            instruction={step9.instruction || step9.content}
            exampleInput={step9.exampleInput}
            status={getStepStatus(step9Index, step9)}
            passage={step9.passage}
          />
          {step10 && (
            <RefleksiStep
              question={step10.questions?.[0]?.question || 'Bagaimana pendapatmu setelah mempelajari topik ini?'}
              initialAnswer={answers[reflectionQuestionId] || ''}
              onSave={(val) => handleAnswerChange(reflectionQuestionId, val)}
              instruction={step10.instruction}
              exampleInput={step10.exampleInput}
              status={getStepStatus(step10Index, step10)}
              content={step10.content}
            />
          )}

          {topic.id === 'topik-6' && (
            <JanjiJariKelingkingDigital
              onSave={handleAnswerChange}
              activityAnswers={answers}
            />
          )}

          {/* Tombol kembali ke beranda setelah menyelesaikan Uji Pemahaman */}
          {completedScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-success-200 rounded-3xl p-6 sm:p-8 text-center shadow-card"
            >
              <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center text-success-600 mx-auto mb-4 border border-success-100">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-primary-800">
                Hebat! Kamu Sudah Menyelesaikan Topik Ini
              </h3>
              <p className="text-sm text-primary-500 mt-2 leading-relaxed">
                Kamu sudah siap melanjutkan ke topik berikutnya. Kembali ke beranda untuk memulai petualangan selanjutnya!
              </p>
              <button
                type="button"
                onClick={() => navigate('/siswa')}
                className="btn-primary mt-6 w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold inline-flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Kembali ke Beranda
              </button>
            </motion.div>
          )}
        </div>
      );
    }

    return null;
  };

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-red-500 font-bold">Topik tidak ditemukan.</p>
          <button className="btn-primary mt-4" onClick={() => navigate('/siswa')}>
            Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  if (loading || modulesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
          <p className="text-sm font-semibold text-primary-600">Memuat petualanganmu...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-card"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-primary-800">
            Topik Masih Terkunci!
          </h3>
          <p className="text-sm text-primary-500 mt-2 leading-relaxed">
            Gurumu mengunci akses ke topik **{topic.title}** untuk sementara waktu. Silakan hubungi gurumu untuk membukanya!
          </p>
          <button
            type="button"
            onClick={() => navigate('/siswa')}
            className="btn-primary mt-6 w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Peta Belajar
          </button>
        </motion.div>
      </div>
    );
  }

  const topicCoverUrl = TOPIC_COVER_URLS[topic.id] || topic.backgroundImageUrl;
  const isTopicFinishedForUi = completedScore !== null;

  return (
    <div className="min-h-screen bg-surface-50 pb-20 pt-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Navigation Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/siswa')}
            style={{ color: activityTheme.accent, borderColor: activityTheme.border }}
            className="flex items-center gap-2 rounded-full border border-surface-200 bg-white px-4 py-2 text-sm font-bold shadow-card transition-colors hover:bg-surface-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Peta Belajar
          </button>

          <div className="flex items-center gap-2">
            {/* Auto-save status */}
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Draf tersimpan otomatis</span>
            </div>

            {/* Top Page Progress Tracker */}
            <div
              className="flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-4 py-2 text-xs font-semibold shadow-card"
              style={{ color: activityTheme.accent, borderColor: activityTheme.border }}
            >
              <span>{isTopicFinishedForUi ? 'Selesai - ' : ''}Halaman: {currentPage} / 3</span>
            </div>
          </div>
        </div>

        {topicCoverUrl && (
          <section className="relative min-h-[180px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card sm:min-h-[220px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${topicCoverUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="relative z-10 flex min-h-[180px] flex-col justify-end p-5 text-white sm:min-h-[220px] sm:p-6">
              <div className="mb-auto flex items-center justify-between">
                <span className="rounded-full border border-white/15 bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                  Topik {topic.number}
                </span>
              </div>
              <div className="max-w-2xl space-y-2">
                <h1 className="font-display text-2xl font-black leading-tight text-white sm:text-3xl">
                  {topic.title}
                </h1>
                <p className="max-w-xl text-xs font-medium leading-relaxed text-white/80 sm:text-sm">
                  {topic.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Page progress tabs */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-surface-200 bg-white p-3 shadow-card">
          {[
            { page: 1, label: "1. Bersiap Belajar", shortLabel: "1. Bersiap" },
            { page: 2, label: "2. Aktivitas Belajar", shortLabel: "2. Aktivitas" },
            { page: 3, label: "3. Uji Pemahaman", shortLabel: "3. Uji" },
          ].map((tab) => {
            const isActive = tab.page === currentPage;
            const isFinished = isTopicFinishedForUi || tab.page < currentPage;
            return (
              <button
                key={tab.page}
                onClick={() => handlePageChange(tab.page)}
                style={
                  isActive
                    ? {
                      backgroundColor: activityTheme.accent,
                      boxShadow: `0 10px 24px ${activityTheme.border}`,
                      '--tw-ring-color': activityTheme.border,
                    } as any
                    : undefined
                }
                className={`py-2 px-2 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all ${isActive
                  ? 'bg-primary-500 text-white shadow-card ring-2 ring-primary-100'
                  : isFinished
                    ? 'bg-success-50 text-success-700 border border-success-200'
                    : 'bg-surface-50 text-surface-500 border border-surface-200 hover:bg-primary-50 hover:text-primary-600'
                  }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Step Content Render Area */}
        <main className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="space-y-8"
            >
              {renderPageContent(currentPage)}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={handlePrev}
            style={{ color: activityTheme.accent, borderColor: activityTheme.border }}
            className="flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-5 py-3 text-xs font-bold shadow-card hover:bg-surface-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali
          </button>

          {currentPage < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              style={
                {
                  backgroundColor: activityTheme.accent,
                  boxShadow: `0 10px 24px ${activityTheme.border}`,
                }
              }
              className="flex items-center gap-1.5 rounded-full bg-primary-500 px-6 py-3 text-xs font-bold text-white shadow-card hover:bg-primary-600 hover:shadow-glow"
            >
              Lanjut
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-bold" style={{ color: activityTheme.accent }}>
              Evaluasi Kuis Akhir
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {badgeCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="badge-celebration-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 text-center shadow-2xl sm:p-8"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background: `radial-gradient(circle at top, ${activityTheme.faint} 0%, #ffffff 54%, ${activityTheme.soft} 100%)`,
                }}
              />
              <motion.div
                className="absolute left-8 top-8 h-3 w-3 rounded-full"
                style={{ backgroundColor: activityTheme.accent }}
                animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute right-10 top-16 h-2.5 w-2.5 rounded-full bg-amber-300"
                animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-16 left-12 h-2 w-2 rounded-full bg-emerald-300"
                animate={{ scale: [1, 1.6, 1], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.6, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.08 }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/80 shadow-card"
                  style={{ color: activityTheme.accent }}
                >
                  <Award className="h-7 w-7" />
                </motion.div>

                <div className={`relative mx-auto mb-5 ${isChampionBadgeCelebration ? 'h-48 w-48 sm:h-60 sm:w-60' : 'h-44 w-44 sm:h-52 sm:w-52'}`}>
                  {[0, 1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute inset-4 rounded-full border"
                      style={{ borderColor: activityTheme.border }}
                      initial={{ scale: 0.82, opacity: 0 }}
                      animate={{ scale: [0.88, 1.18, 1.34], opacity: [0, 0.34, 0] }}
                      transition={{
                        duration: 2.1,
                        repeat: Infinity,
                        delay: ring * 0.36,
                        ease: 'easeOut',
                      }}
                    />
                  ))}

                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${activityTheme.soft} 0%, transparent 68%)`,
                    }}
                    animate={{ scale: [0.96, 1.04, 0.96] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {badgeCelebration.videoUrl ? (
                    <motion.video
                      src={badgeCelebration.videoUrl}
                      aria-hidden="true"
                      className="relative z-10 h-full w-full scale-110 select-none object-contain drop-shadow-2xl"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      initial={{ opacity: 0, y: 28, scale: 0.55, rotate: -10 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: [0, -2, 2, 0] }}
                      transition={{
                        opacity: { duration: 0.18 },
                        y: { type: 'spring', stiffness: 240, damping: 16 },
                        scale: { type: 'spring', stiffness: 240, damping: 16 },
                        rotate: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                      }}
                    />
                  ) : badgeCelebration.imageUrl ? (
                    <motion.img
                      src={badgeCelebration.imageUrl}
                      alt=""
                      className={`relative z-10 h-full w-full select-none drop-shadow-2xl ${isChampionBadgeCelebration ? 'scale-110 object-cover' : 'object-contain'
                        }`}
                      draggable={false}
                      initial={{ opacity: 0, y: 28, scale: 0.55, rotate: -10 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: [0, -2, 2, 0] }}
                      transition={{
                        opacity: { duration: 0.18 },
                        y: { type: 'spring', stiffness: 240, damping: 16 },
                        scale: { type: 'spring', stiffness: 240, damping: 16 },
                        rotate: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                      }}
                    />
                  ) : (
                    <motion.div
                      className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white text-5xl font-black shadow-card"
                      style={{ color: activityTheme.accent }}
                      initial={{ opacity: 0, scale: 0.55 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                    >
                      {badgeCelebration.emoji}
                    </motion.div>
                  )}
                </div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-wider shadow-sm" style={{ color: activityTheme.accent }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Lencana Baru Didapatkan
                </div>
                <h2 id="badge-celebration-title" className="font-display text-2xl font-black text-surface-900">
                  {badgeCelebration.name}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-relaxed text-surface-600">
                  {badgeCelebration.description}
                </p>

                <button
                  type="button"
                  onClick={() => setBadgeCelebrationQueue((currentQueue) => currentQueue.slice(1))}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-black text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:min-w-40"
                  style={{ backgroundColor: activityTheme.accent, '--tw-ring-color': activityTheme.border } as any}
                >
                  {badgeCelebrationQueue.length > 1 ? 'Lihat Lencana Berikutnya' : 'Lanjutkan'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Modal overlay for Simulations on step 9 */}
      <AnimatePresence>
        {showSimModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {renderSimulationComponent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
