// ============================================================
// SiberCerdas – Student Dashboard (Gamified)
// ============================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Copyright,
  Trophy,
  Clock,
  ChevronRight,
  Heart,
  Handshake,
  Lock,
  MessageCircle,
  Palette,
  Play,
  Search,
  Sparkles,
  MapPin,
  Shield,
  ThumbsUp,
  KeyRound,
} from 'lucide-react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { safeLog } from '../../lib/safeLog';
import { useAuth } from '../../hooks/useAuth';
import { useModules } from '../../contexts/ModuleContext';
import { allBadges } from '../../data/modules';
import BadgeComponent from '../../components/common/Badge';
import DashboardNilai from '../../components/common/DashboardNilai';
import type { StudentProgress, GalleryItem } from '../../types';
import { getDemoProgressList, getDemoGalleryItems } from '../../lib/demoStore';

// ---- Topic icon map for a cleaner learning dashboard ----
const TOPIC_ICONS: Record<string, React.ElementType> = {
  'topik-1': Shield,
  'topik-2': Search,
  'topik-3': KeyRound,
  'topik-4': Shield,
  'topik-5': MessageCircle,
  'topik-6': Handshake,
  'topik-7': Copyright,
  'topik-8': Palette,
};

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

const PATH_NODES = [
  { left: '8%', top: '55%' },
  { left: '20%', top: '30%' },
  { left: '32%', top: '65%' },
  { left: '44%', top: '35%' },
  { left: '56%', top: '68%' },
  { left: '68%', top: '30%' },
  { left: '80%', top: '60%' },
  { left: '92%', top: '42%' },
];

const isTopicSubmittedOrCompleted = (progress?: StudentProgress | null) =>
  progress?.status === 'completed' || progress?.submissionStatus === 'submitted';

// ---- Skeleton helpers ----
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
    <div className="h-8 bg-gray-200 rounded w-1/2" />
  </div>
);

const SkeletonNode: React.FC = () => (
  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
);

// ---- Main Dashboard ----
const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { topics: topicModules, loading: modulesLoading } = useModules();

  // State
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [isRocketSpinning, setIsRocketSpinning] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Real-time progress listener ----
  useEffect(() => {
    if (!user) return;
    if (!db) {
      // Demo Mode load
      const list = getDemoProgressList(user.uid);
      if (list.length === 0) {
        // Pre-populate topic-1 as active to give a starter quest!
        const starter: StudentProgress = {
          id: `${user.uid}_topik-1`,
          studentUid: user.uid,
          moduleId: 'aku-cerdas-digital',
          topicId: 'topik-1',
          currentStep: 0,
          status: 'active',
          score: 0,
          badges: [],
        };
        setProgressList([starter]);
      } else {
        setProgressList(list);
      }
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'progress'),
      where('uid', '==', user.uid),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => d.data() as StudentProgress);
        setProgressList(items);
        setLoading(false);
      },
      (err) => {
        safeLog('error', 'Progress snapshot error', err);
        setError('Gagal memuat data progress. Coba refresh halaman.');
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  // ---- Gallery preview listener ----
  useEffect(() => {
    if (!user || !profile) return;
    if (!db) {
      // Demo Mode load
      const items = getDemoGalleryItems();
      const approvedDemo = items.filter((i) => i.status === 'approved');
      if (approvedDemo.length === 0) {
        // Prepopulate with a friendly welcome message/sample
        const sample: GalleryItem = {
          id: 'demo-gal-1',
          displayName: 'Ahmad Cerdas',
          avatar: 'AC',
          topicId: 'topik-1',
          topicTitle: 'Aku Cerdas di Dunia Digital',
          content: 'Saya belajar bahwa jejak digital itu permanen! Kita harus selalu memposting hal yang baik dan bermanfaat.',
          sharedAt: Date.now() - 7200000,
          thumbsBy: ['some-user-id'],
          heartsBy: [],
          status: 'approved',
          appreciations: { thumbs: 5, hearts: 2, comments: 0 }
        };
        setGalleryItems([sample]);
      } else {
        setGalleryItems(approvedDemo.slice(0, 4));
      }
      return;
    }

    const q = query(
      collection(db, 'classGallery'),
      where('guruId', '==', profile.guruId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
        const approved = data.filter((i) => i.status === 'approved');
        setGalleryItems(approved.slice(0, 4));
      },
      (err) => {
        safeLog('error', 'Gallery snapshot error', err);
      },
    );

    return () => unsub();
  }, [profile?.guruId, user]);

  // ---- Derived data ----
  const progressMap = useMemo(() => {
    const map: Record<string, StudentProgress> = {};
    progressList.forEach((p) => { map[p.topicId] = p; });
    return map;
  }, [progressList]);

  const completedTopics = progressList.filter(isTopicSubmittedOrCompleted).length;
  const earnedBadges = progressList.filter((p) => p.badgeEarned).length;
  const totalTime = progressList.reduce((sum, p) => sum + (p.timeSpentSeconds || 0), 0);
  const hours = Math.floor(totalTime / 3600);
  const mins = Math.floor((totalTime % 3600) / 60);

  // Unlocked badges set
  const unlockedBadgeIds = useMemo(() => {
    const ids = new Set<string>();
    const perfectTopicIds = new Set<string>();

    progressList.forEach((p) => {
      if (p.badgeEarned || isTopicSubmittedOrCompleted(p)) {
        const badge = allBadges.find((b: any) => b.topicId === p.topicId);
        if (badge) ids.add(badge.id);
      }

      if (isTopicSubmittedOrCompleted(p) && (p.quizScore ?? p.score) >= 100) {
        perfectTopicIds.add(p.topicId);
      }
    });

    // Special badges
    if (perfectTopicIds.size >= 1) ids.add('badge-juara-kuis');
    if (perfectTopicIds.size >= 3) ids.add('badge-super-kuis-3-topik');
    if (perfectTopicIds.size >= 5) ids.add('badge-sang-juara');
    if (completedTopics >= 8) ids.add('badge-sempurna');

    return ids;
  }, [progressList, completedTopics]);

  // Node status helper
  const getNodeStatus = useCallback(
    (topicId: string, index: number): 'completed' | 'active' | 'locked' => {
      const prog = progressMap[topicId];
      if (isTopicSubmittedOrCompleted(prog)) return 'completed';
      
      // Dosen penguji (isPenguji) dapat mengakses semua topik tanpa batasan sekuensial
      if (profile?.isPenguji) return 'active';

      if (index === 0) return 'active'; // first topic always active
      // Active if previous topic is completed
      const prevTopicId = topicModules[index - 1]?.id;
      if (prevTopicId && isTopicSubmittedOrCompleted(progressMap[prevTopicId])) return 'active';
      // Also active if there's existing progress
      if (prog && prog.currentStep > 0) return 'active';
      return 'locked';
    },
    [progressMap, topicModules, profile],
  );

  const hasActiveNode = useMemo(() => {
    return topicModules.some((topic: any, idx: number) => getNodeStatus(topic.id, idx) === 'active');
  }, [topicModules, getNodeStatus]);

  if (loading || modulesLoading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Skeleton header */}
          <div className="h-10 bg-gray-200 rounded-xl w-64 animate-pulse" />
          {/* Skeleton nodes */}
          <div className="flex gap-6 overflow-x-auto py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonNode key={i} />
            ))}
          </div>
          {/* Skeleton stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-50">
      <div className="pointer-events-none absolute left-8 top-8 h-9 w-9 rotate-6 rounded-xl border border-sticker-purple/40 bg-sticker-purple/25" />
      <div className="pointer-events-none absolute right-10 top-28 h-8 w-20 -rotate-3 rounded-full border border-sticker-teal/30 bg-sticker-teal/15" />
      <div className="pointer-events-none absolute bottom-12 left-1/4 h-10 w-10 -rotate-6 rounded-xl border border-sticker-pink/30 bg-sticker-pink/15" />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 relative z-10">
        {/* ---- Header ---- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
        >
          {/* Avatar khusus (tanpa background) */}
          <div className="flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center p-1 bg-transparent">
            <img src="/logo_anak_sekolah.png" alt="Anak Sekolah" className="h-full w-full object-contain" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900">
              Halo, {profile?.displayName ?? 'Penjelajah'}!
            </h1>
            <p className="text-surface-600 text-sm leading-relaxed">
              Ayo lanjutkan petualangan etika dan keamanan digitalmu! <span className="font-bold text-primary-600">Ketuk ikon topik aktif (berwarna biru)</span> pada peta petualangan di bawah untuk memulai pembelajaran.
            </p>
          </div>
          <Sparkles className="hidden sm:block w-8 h-8 text-sticker-orange shrink-0" />
        </motion.div>

        {/* ---- Error banner ---- */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-danger-50 border border-danger-200 rounded-2xl p-4 text-danger-600 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Winding Adventure Map ---- */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            Peta Petualangan Literasi Digital
          </h2>

          <div className="relative h-64 min-h-[260px] w-full overflow-x-auto rounded-2xl border border-surface-200 bg-white p-6 shadow-card scrollbar-none">
            {/* Scroll Hint for Mobile */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-surface-850/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1 lg:hidden animate-pulse pointer-events-none z-30 shadow-sm">
              <span>👈 Geser ke samping untuk melihat topik lain 👉</span>
            </div>

            {/* Gradient Dashed Connector Path */}
            <div className="absolute inset-0 min-w-[1020px] h-full pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1020 240" fill="none">
                <path
                  d="M 80 130 C 140 80, 140 100, 200 70 C 260 40, 260 180, 320 150 C 380 120, 380 50, 440 80 C 500 110, 500 190, 560 160 C 620 130, 620 40, 680 70 C 740 100, 740 170, 800 140 C 860 110, 860 120, 920 100"
                  stroke="url(#mapPathGradient)"
                  strokeWidth="5"
                  strokeDasharray="12 8"
                  className="opacity-60"
                />
                <defs>
                  <linearGradient id="mapPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0075de" />
                    <stop offset="35%" stopColor="#62aef0" />
                    <stop offset="70%" stopColor="#2a9d99" />
                    <stop offset="100%" stopColor="#ff64c8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Winding Map Nodes */}
            <div className="absolute inset-0 min-w-[1020px] h-full">
              {topicModules.map((topic: any, idx: number) => {
                const node = PATH_NODES[idx];
                const status = getNodeStatus(topic.id, idx);
                const isCompleted = status === 'completed';
                const isActive = status === 'active';
                const isLocked = status === 'locked';
                const TopicIcon = TOPIC_ICONS[topic.id] || BookOpen;

                return (
                  <div
                    key={topic.id}
                    style={{ left: node.left, top: node.top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                  >
                    {/* Mascot bouncing character on active node */}
                    {(profile?.isPenguji
                      ? idx === 0
                      : (isActive || (!hasActiveNode && idx === topicModules.length - 1))
                    ) && (
                      <motion.div
                        className="absolute -top-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center cursor-pointer pointer-events-auto select-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isRocketSpinning) return;
                          setIsRocketSpinning(true);
                          setTimeout(() => {
                            setIsRocketSpinning(false);
                          }, 800);
                        }}
                        whileHover={{ scale: 1.08 }}
                        animate={{
                          y: [0, -10, 0],
                          rotate: isRocketSpinning ? [0, 360] : 0
                        }}
                        transition={{
                          y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                          rotate: { duration: 0.8, ease: "easeInOut" },
                          scale: { type: "spring", stiffness: 300, damping: 15 }
                        }}
                      >
                        <div className="mb-0.5 whitespace-nowrap rounded-full bg-primary-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-card">
                          {isActive ? 'Kamu di sini!' : 'Misi Selesai!'}
                        </div>
                        <img
                          src="/murid-naik-roket.png"
                          alt=""
                          className="h-20 w-20 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.18)]"
                          draggable={false}
                        />
                      </motion.div>
                    )}

                    {/* Circular Portal Node */}
                    <button
                      onClick={() => !isLocked && navigate(`/siswa/topik/${topic.id}`)}
                      disabled={isLocked}
                      aria-label={`Topik ${topic.number}: ${topic.title}. ${isCompleted ? 'Selesai' : isActive ? 'Aktif, kamu di sini' : 'Terkunci'}`}
                      className={`w-14 h-14 rounded-full flex items-center justify-center relative transition-all duration-300 ${isCompleted
                        ? 'bg-success-500 text-white shadow-card hover:scale-105 active:scale-95'
                        : isActive
                          ? 'bg-primary-500 text-white shadow-glow hover:scale-105 active:scale-95 ring-4 ring-white'
                          : 'bg-surface-100 border-2 border-surface-200 text-surface-300 cursor-not-allowed'}`}
                    >
                      <span className="flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 className="h-7 w-7" />
                        ) : (
                          <TopicIcon className="h-7 w-7" />
                        )}
                      </span>

                      {/* Small Indicator Badge */}
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-surface-200 bg-white text-[10px] font-extrabold text-surface-700 shadow-xs">
                        {topic.number}
                      </span>
                    </button>

                    {/* Floating Title */}
                    <div className="absolute top-16 pointer-events-none max-w-[120px] rounded-lg border border-surface-200 bg-white px-2.5 py-1 text-center shadow-2xs">
                      <p className="truncate text-[10px] font-black leading-tight text-surface-800">{topic.title}</p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-surface-400">
                        {isCompleted ? 'Selesai' : isActive ? 'Aktif' : 'Terkunci'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- Adventure Cards Grid ---- */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            Kartu Petualangan Belajar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topicModules.map((topic: any, idx: number) => {
              const status = getNodeStatus(topic.id, idx);
              const isCompleted = status === 'completed';
              const isActive = status === 'active';
              const isLocked = status === 'locked';
              const TopicIcon = TOPIC_ICONS[topic.id] || BookOpen;
              const coverUrl = TOPIC_COVER_URLS[topic.id] || topic.backgroundImageUrl;

              return (
                <motion.div
                  key={topic.id}
                  className={`relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl border border-surface-200 shadow-card transition-all duration-300 ${isActive ? 'ring-4 ring-primary-400 ring-offset-2 scale-102 bg-white' : 'bg-white'
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={!isLocked ? { y: -5, transition: { duration: 0.2 } } : undefined}
                >
                  {/* Background image or color fallback */}
                  {coverUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                      style={{ backgroundImage: `url(${coverUrl})` }}
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${topic.color || 'from-primary-500 to-sticker-teal'
                      } opacity-90`} />
                  )}

                  {/* Dark gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 z-0" />

                  {/* Card Content */}
                  <div className="relative z-10 p-5 flex flex-col justify-between h-full text-white">
                    {/* Top row: Topic Number & Status Icon */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        Topik {topic.number}
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isActive ? (
                          <Play className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="space-y-1 mt-auto">
                      <h3 className="font-display font-bold text-base leading-tight text-white">
                        {topic.title}
                      </h3>
                      <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>

                    {/* Bottom row: Button / Lock status */}
                    <div className="pt-3 border-t border-white/10 mt-3 flex justify-between items-center">
                      {isLocked ? (
                        <span className="text-xs text-white/50 flex items-center gap-1 font-semibold">
                          <Lock className="h-3.5 w-3.5" />
                          Terkunci
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/siswa/topik/${topic.id}`)}
                          aria-label={`${isCompleted ? 'Ulangi' : isActive ? 'Mulai' : 'Lanjut'} topik ${topic.number}: ${topic.title}`}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${isCompleted
                            ? 'bg-success-500 hover:bg-success-600 text-white'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                            }`}
                        >
                          {isCompleted ? 'Ulangi' : isActive ? 'Mulai' : 'Lanjut'}
                        </button>
                      )}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                        <TopicIcon className="h-[18px] w-[18px] text-white" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---- Stats Mini Summary ---- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <BarChart3 className="w-5 h-5" />,
              label: 'Topik Selesai',
              value: `${completedTopics}/8`,
              bg: 'bg-primary-50',
              text: 'text-primary-600',
              border: 'border-primary-100',
            },
            {
              icon: <Trophy className="w-5 h-5" />,
              label: 'Lencana',
              value: `${earnedBadges + unlockedBadgeIds.size - earnedBadges}/${allBadges.length}`,
              bg: 'bg-success-50',
              text: 'text-success-600',
              border: 'border-success-100',
            },
            {
              icon: <Clock className="w-5 h-5" />,
              label: 'Waktu Belajar',
              value: `${hours}h ${mins}m`,
              bg: 'bg-accent-50',
              text: 'text-accent-600',
              border: 'border-accent-100',
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              label: 'Petualangan',
              value: `${completedTopics}/8`,
              bg: 'bg-warning-50',
              text: 'text-warning-600',
              border: 'border-warning-100',
            },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              className={`rounded-2xl border bg-white p-5 ${card.border} shadow-card transition-all duration-300 hover:shadow-card-hover`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`${card.text}`}>{card.icon}</span>
                <span className="text-xs font-bold text-surface-500 uppercase tracking-wide">{card.label}</span>
              </div>
              <p className={`text-2xl font-display font-bold ${card.text}`}>{card.value}</p>
            </motion.div>
          ))}
        </section>

        {/* ---- GAMIFIED NILAI DASHBOARD ---- */}
        <DashboardNilai
          progressList={progressList}
          progressMap={progressMap}
          topicModules={topicModules}
          studentUid={user?.uid}
        />

        {/* ---- Badges Gallery ---- */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-display font-bold text-surface-900">
            <Trophy className="h-5 w-5 text-primary-500" />
            Koleksi Lencana
          </h2>
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4">
              {allBadges.map((badge: any, idx: number) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx, type: 'spring', stiffness: 300 }}
                  className="relative"
                >
                  <BadgeComponent
                    badge={badge}
                    unlocked={unlockedBadgeIds.has(badge.id)}
                    size="sm"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Class Gallery Preview ---- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-display font-bold text-surface-900">
              <Palette className="h-5 w-5 text-primary-500" />
              Galeri Kelas
            </h2>
            <motion.button
              className="text-sm text-primary-500 font-semibold flex items-center gap-1 hover:text-primary-600 transition-colors"
              whileHover={{ x: 4 }}
              onClick={() => navigate('/siswa/galeri')}
            >
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {galleryItems.length === 0 ? (
            <div className="rounded-2xl border border-surface-200 bg-white p-8 text-center shadow-card">
              <p className="text-surface-500 text-sm">
                Belum ada karya yang dibagikan. Jadilah yang pertama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat karya ${item.displayName} di Galeri Kelas`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/siswa/galeri');
                    }
                  }}
                  className="cursor-pointer rounded-xl border border-surface-200 bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * idx }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate('/siswa/galeri')}
                >
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700">
                      {(item.displayName || 'SC').slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-surface-800 leading-tight">
                        {item.displayName}
                      </p>
                      <p className="text-[10px] text-surface-500">{item.topicTitle}</p>
                    </div>
                  </div>
                  {/* Excerpt */}
                  <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-surface-600">
                    {item.content}
                  </p>
                  {/* Appreciations */}
                  <div className="flex gap-3 text-xs text-surface-500">
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {item.appreciations?.thumbs ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {item.appreciations?.hearts ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {item.appreciations?.comments ?? 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default StudentDashboard;
