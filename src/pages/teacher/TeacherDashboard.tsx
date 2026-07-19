import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  BookOpen,
  Clock,
  ClipboardCheck,
  Gamepad2,
  Palette,
  RefreshCw,
  School,
  Menu,
  ArrowLeft,
  Trash2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import Sidebar, { type TeacherTab } from '../../components/Sidebar';
import StudentManager from './StudentManager';
import ModuleControl from './ModuleControl';
import RubricGrading from './RubricGrading';
import MaterialManager from './MaterialManager';
import ClassroomManager from './ClassroomManager';
import GalleryModeration from './GalleryModeration';
import { getDemoAccounts, getAllDemoModuleGrades, getDemoActivityLogs, clearDemoActivityLogs } from '../../lib/demoStore';
import type { ModuleGrade, ActivityLog } from '../../types';

/* ─── Helper ──────────────────────────────────────────────────────────────── */
function safeLog(label: string, err: unknown) {
  if (err instanceof Error) console.error(`[${label}]`, err.message);
  else console.error(`[${label}] Unknown error`);
}

/* ─── Grade Distribution Buckets ──────────────────────────────────────────── */
interface GradeBucket {
  range: string;
  count: number;
  color: string;
}

function buildGradeDistribution(grades: ModuleGrade[]): GradeBucket[] {
  const buckets: GradeBucket[] = [
    { range: '0-20', count: 0, color: '#f87171' },
    { range: '21-40', count: 0, color: '#fbbf24' },
    { range: '41-60', count: 0, color: '#60a5fa' },
    { range: '61-80', count: 0, color: '#34d399' },
    { range: '81-100', count: 0, color: '#8b5cf6' },
  ];
  grades.forEach((g) => {
    const s = g.totalScore;
    if (s <= 20) buckets[0].count++;
    else if (s <= 40) buckets[1].count++;
    else if (s <= 60) buckets[2].count++;
    else if (s <= 80) buckets[3].count++;
    else buckets[4].count++;
  });
  return buckets;
}

/* ─── Stats Card ──────────────────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-surface-500 font-medium">{title}</p>
        <p className="mt-1 text-2xl font-display font-bold text-surface-800">{value}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        {trend === 'up' && <TrendingUp size={14} className="text-success-500" />}
        {trend === 'down' && <TrendingDown size={14} className="text-danger-500" />}
        <span className={trend === 'up' ? 'text-success-600' : trend === 'down' ? 'text-danger-600' : 'text-surface-500'}>
          {trend === 'up' ? 'Meningkat' : trend === 'down' ? 'Menurun' : 'Stabil'}
        </span>
      </div>
    )}
  </motion.div>
);

/* ─── Analytics View ──────────────────────────────────────────────────────── */
interface AnalyticsViewProps {
  onTabChange: (tab: TeacherTab) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onTabChange }) => {
  const [activeStudents, setActiveStudents] = useState(0);
  const [avgPreTest, setAvgPreTest] = useState(0);
  const [avgPostTest, setAvgPostTest] = useState(0);
  const [avgNGain, setAvgNGain] = useState(0);
  const [gradeDistribution, setGradeDistribution] = useState<GradeBucket[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const guruId = auth?.currentUser?.uid || 'demo-guru-001';
  const [clearingLogs, setClearingLogs] = useState(false);

  const handleClearLogs = async () => {
    if (!window.confirm('Hapus semua log aktivitas murid? Tindakan ini tidak bisa dibatalkan.')) return;
    setClearingLogs(true);
    try {
      if (!db) {
        clearDemoActivityLogs(guruId);
        setRecentActivity([]);
      } else {
        const actQ = query(collection(db, 'activityLog'), where('guruId', '==', guruId));
        const snap = await getDocs(actQ);
        await Promise.all(snap.docs.map((doc) => deleteDoc(doc.ref)));
        setRecentActivity([]);
      }
    } catch (err) {
      safeLog('clear-activity-logs', err);
      alert('Gagal membersihkan log aktivitas.');
    } finally {
      setClearingLogs(false);
    }
  };

  useEffect(() => {
    if (!db) {
      const accounts = getDemoAccounts(guruId);
      setActiveStudents(accounts.length);

      const grades = getAllDemoModuleGrades(guruId);
      if (grades.length === 0) {
        setAvgPreTest(0);
        setAvgPostTest(0);
        setAvgNGain(0);
      } else {
        const preScores = grades.filter((d: any) => d.preTestScore !== null && d.preTestScore !== undefined).map((d: any) => d.preTestScore as number);
        const postScores = grades.filter((d: any) => d.postTestScore !== null && d.postTestScore !== undefined).map((d: any) => d.postTestScore as number);
        const nGains = grades.filter((d: any) => d.nGainScore !== null && d.nGainScore !== undefined).map((d: any) => d.nGainScore as number);

        setAvgPreTest(preScores.length ? Math.round(preScores.reduce((a: number, b: number) => a + b, 0) / preScores.length) : 0);
        setAvgPostTest(postScores.length ? Math.round(postScores.reduce((a: number, b: number) => a + b, 0) / postScores.length) : 0);
        setAvgNGain(nGains.length ? parseFloat((nGains.reduce((a: number, b: number) => a + b, 0) / nGains.length).toFixed(2)) : 0);
      }

      setGradeDistribution(buildGradeDistribution(grades));

      const actLogs = getDemoActivityLogs(guruId);
      setRecentActivity(actLogs);

      setLoading(false);
      return;
    }
    if (!guruId) return;

    /* — Active students count — */
    const usersQ = query(collection(db!, 'users'), where('guruId', '==', guruId));
    const unsubUsers = onSnapshot(
      usersQ,
      (snap) => {
        setActiveStudents(snap.size);
      },
      (err) => safeLog('users-snapshot', err),
    );

    /* — Progress aggregates + Grade distribution (single subscription) — */
    const gradesQ = query(collection(db!, 'moduleGrades'), where('guruId', '==', guruId));
    const unsubGrades = onSnapshot(
      gradesQ,
      (snap) => {
        const docs = snap.docs.map((d: any) => d.data() as ModuleGrade);

        // Grade distribution
        setGradeDistribution(buildGradeDistribution(docs));

        // Averages
        if (docs.length === 0) {
          setAvgPreTest(0);
          setAvgPostTest(0);
          setAvgNGain(0);
          setLoading(false);
          return;
        }
        const preScores = docs.filter((d: any) => d.preTestScore !== null && d.preTestScore !== undefined).map((d: any) => d.preTestScore as number);
        const postScores = docs.filter((d: any) => d.postTestScore !== null && d.postTestScore !== undefined).map((d: any) => d.postTestScore as number);
        const nGains = docs.filter((d: any) => d.nGainScore !== null && d.nGainScore !== undefined).map((d: any) => d.nGainScore as number);

        setAvgPreTest(preScores.length ? Math.round(preScores.reduce((a: number, b: number) => a + b, 0) / preScores.length) : 0);
        setAvgPostTest(postScores.length ? Math.round(postScores.reduce((a: number, b: number) => a + b, 0) / postScores.length) : 0);
        setAvgNGain(nGains.length ? parseFloat((nGains.reduce((a: number, b: number) => a + b, 0) / nGains.length).toFixed(2)) : 0);
        setLoading(false);
      },
      (err) => safeLog('grades-snapshot', err),
    );

    /* — Recent activity — */
    const actQ = query(
      collection(db!, 'activityLog'),
      where('guruId', '==', guruId),
    );
    const unsubActivity = onSnapshot(
      actQ,
      (snap) => {
        const sorted = snap.docs
          .map((d: any) => ({ id: d.id, ...d.data() } as ActivityLog))
          .sort((a, b) => {
            const timeA = a.timestamp?.toMillis 
              ? a.timestamp.toMillis() 
              : (typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime() || 0);
            const timeB = b.timestamp?.toMillis 
              ? b.timestamp.toMillis() 
              : (typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime() || 0);
            return timeB - timeA;
          })
          .slice(0, 10);
        setRecentActivity(sorted);
      },
      (err) => safeLog('activity-snapshot', err),
    );

    return () => {
      unsubUsers();
      unsubGrades();
      unsubActivity();
    };
  }, [guruId]);

  const nGainTrend = avgNGain >= 0.7 ? 'up' : avgNGain >= 0.3 ? 'neutral' : 'down';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-sticker-indigo p-6 text-white shadow-card"
      >
        <div className="pointer-events-none absolute right-6 top-5 h-8 w-20 -rotate-3 rounded-full border border-white/20 bg-white/10" />
        <div className="pointer-events-none absolute bottom-5 right-20 h-9 w-9 rotate-6 rounded-xl border border-sticker-purple/40 bg-sticker-purple/20" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full border border-white/10">
            Pusat Kendali SiberCerdas
          </span>
          <h2 className="text-xl md:text-2xl font-display font-bold">
            Selamat Datang Kembali, {auth?.currentUser?.displayName || 'Guru'}!
          </h2>
          <p className="text-white/80 text-xs md:text-sm max-w-xl leading-relaxed">
            Pantau perkembangan literasi digital kelas Anda secara real-time. Rata-rata kemajuan N-Gain belajar murid saat ini bernilai <strong className="text-white font-black">{avgNGain}</strong> ({avgNGain >= 0.7 ? 'Tinggi' : avgNGain >= 0.3 ? 'Sedang' : 'Perlu Peningkatan'}).
          </p>
        </div>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 rounded-2xl border border-surface-200 bg-white p-5 shadow-card"
      >
        <h3 className="font-display font-bold text-surface-800 text-sm flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-primary-500" />
          Pintasan Kendali Guru
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onTabChange('students')}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 p-4 text-xs font-bold text-primary-700 transition-all hover:bg-white hover:shadow-card"
          >
            <Users className="h-6 w-6" />
            Kelola Murid
          </button>
          <button
            onClick={() => onTabChange('classrooms')}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-emerald-700 transition-all hover:bg-white hover:shadow-card"
          >
            <School className="h-6 w-6" />
            Manajemen Kelas
          </button>
          <button
            onClick={() => onTabChange('materials')}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-sticker-purple/40 bg-sticker-purple/20 p-4 text-xs font-bold text-sticker-indigo transition-all hover:bg-white hover:shadow-card"
          >
            <BookOpen className="h-6 w-6" />
            Kelola Materi
          </button>
          <button
            onClick={() => onTabChange('grading')}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-warning-100 bg-warning-50 p-4 text-xs font-bold text-warning-700 transition-all hover:bg-white hover:shadow-card"
          >
            <ClipboardCheck className="h-6 w-6" />
            Penilaian Rubrik
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Murid Aktif"
          value={activeStudents}
          icon={<Users size={20} className="text-primary-500" />}
          color="bg-primary-50"
          delay={0.15}
        />
        <StatCard
          title="Rata-rata Pre-Test"
          value={avgPreTest}
          icon={<BarChart3 size={20} className="text-accent-500" />}
          color="bg-accent-50"
          delay={0.2}
        />
        <StatCard
          title="Rata-rata Post-Test"
          value={avgPostTest}
          icon={<TrendingUp size={20} className="text-success-500" />}
          color="bg-success-50"
          trend={avgPostTest > avgPreTest ? 'up' : avgPostTest < avgPreTest ? 'down' : 'neutral'}
          delay={0.25}
        />
        <StatCard
          title="Rata-rata N-Gain"
          value={avgNGain}
          icon={<Activity size={20} className="text-warning-500" />}
          color="bg-warning-50"
          trend={nGainTrend}
          delay={0.3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
        >
          <h3 className="font-display font-semibold text-surface-800 mb-4">Distribusi Nilai</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeDistribution} barCategoryGap="20%">
              <defs>
                <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0075de" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#62aef0" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              />
              <Bar dataKey="count" name="Jumlah Murid" fill="url(#gradeGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity Timeline Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-surface-800">Aktivitas Terbaru Murid</h3>
            {recentActivity.length > 0 && (
              <button
                onClick={handleClearLogs}
                disabled={clearingLogs}
                className="flex items-center gap-1 text-[11px] font-medium text-danger-500 hover:text-danger-600 transition-colors disabled:opacity-50"
                title="Hapus Semua Log Aktivitas"
              >
                <Trash2 size={13} />
                <span>{clearingLogs ? 'Membersihkan...' : 'Hapus Semua Log'}</span>
              </button>
            )}
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center h-48 text-surface-500">
              <Clock size={32} className="mb-2 animate-pulse" />
              <p className="text-sm">Belum ada aktivitas baru dari murid.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto max-h-[240px] pr-1 space-y-4">
              {recentActivity.map((act, idx) => {
                let ActivityIcon: React.ElementType = Activity;
                let badgeColor = 'bg-primary-50 text-primary-600 border-primary-100';
                if (act.action?.toLowerCase().includes('nilai') || act.action?.toLowerCase().includes('grade')) {
                  ActivityIcon = BarChart3;
                  badgeColor = 'bg-success-50 text-success-600 border-success-100';
                } else if (act.action?.toLowerCase().includes('kuis') || act.action?.toLowerCase().includes('quiz')) {
                  ActivityIcon = ClipboardCheck;
                  badgeColor = 'bg-warning-50 text-warning-600 border-warning-100';
                } else if (act.action?.toLowerCase().includes('simulasi')) {
                  ActivityIcon = Gamepad2;
                  badgeColor = 'bg-accent-50 text-accent-600 border-accent-100';
                } else if (act.action?.toLowerCase().includes('karya') || act.action?.toLowerCase().includes('galeri')) {
                  ActivityIcon = Palette;
                  badgeColor = 'bg-pink-50 text-pink-600 border-pink-100';
                }

                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="relative flex items-start gap-3 border-l-2 border-surface-200 pb-1 pl-4"
                  >
                    <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-400 border border-white shadow-xs" />
                    
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-200 bg-white text-primary-600 shadow-2xs">
                      <ActivityIcon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-bold text-surface-800">
                        {act.studentName}{' '}
                        <span className="font-normal text-surface-500">{act.action}</span>
                      </p>
                      {act.topicTitle && (
                        <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeColor} mt-0.5`}>
                          {act.topicTitle}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-surface-500 whitespace-nowrap">
                      {(() => {
                        if (!act.timestamp) return '';
                        const date = act.timestamp?.toDate ? act.timestamp.toDate() : new Date(act.timestamp);
                        return isNaN(date.getTime()) ? '' : date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Teacher Dashboard ───────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */
const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('analytics');
  const [globalRefreshTick, setGlobalRefreshTick] = useState(0);
  const [isGlobalRefreshing, setIsGlobalRefreshing] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const teacherName = auth?.currentUser?.displayName ?? 'Guru';

  const handleGlobalRefresh = useCallback(() => {
    setIsGlobalRefreshing(true);
    setGlobalRefreshTick((prev) => prev + 1);

    window.setTimeout(() => {
      setIsGlobalRefreshing(false);
    }, 700);
  }, []);

  const handleLogout = useCallback(async () => {
    if (!auth) return;
    try {
      await auth.signOut();
    } catch (err) {
      safeLog('logout', err);
    }
  }, []);

  const pageTitle: Record<TeacherTab, string> = {
    analytics: 'Dashboard Analitik',
    students: 'Kelola Murid',
    classrooms: 'Manajemen Kelas',
    modules: 'Kontrol Modul',
    grading: 'Penilaian Rubrik',
    materials: 'Kelola Materi Pembelajaran',
    gallery_moderation: 'Persetujuan Karya',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          teacherName={teacherName}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-xs"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="relative z-50 flex h-full flex-col bg-white shadow-xl"
            >
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                onLogout={handleLogout}
                teacherName={teacherName}
                isMobile={true}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 border-b border-surface-200 bg-white/95 px-4 sm:px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              {/* Menu Button for Mobile - Always Visible */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-lg border border-surface-200 bg-surface-50 text-surface-600 hover:bg-surface-100 lg:hidden shrink-0"
                title="Buka menu"
              >
                <Menu size={20} />
              </button>

              {/* Kembali Button - only shown when not on analytics tab */}
              {activeTab !== 'analytics' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('analytics')}
                  className="p-2 rounded-xl border border-surface-200 bg-surface-50 text-surface-650 hover:text-surface-900 hover:bg-surface-100 shadow-2xs active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 animate-fade-in"
                  title="Kembali ke Dashboard Analitik"
                >
                  <ArrowLeft size={16} />
                  <span className="hidden sm:inline">Kembali</span>
                </button>
              )}
              <motion.h2
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg sm:text-xl font-display font-bold text-surface-800 truncate"
              >
                {pageTitle[activeTab]}
              </motion.h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGlobalRefresh}
                disabled={isGlobalRefreshing}
                title="Muat ulang data"
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:bg-white hover:shadow-card disabled:cursor-wait disabled:opacity-70"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGlobalRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">{isGlobalRefreshing ? 'Menyegarkan...' : 'Refresh Semua'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${globalRefreshTick}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'analytics' && <AnalyticsView onTabChange={setActiveTab} />}
              {activeTab === 'students' && <StudentManager />}
              {activeTab === 'classrooms' && <ClassroomManager />}
              {activeTab === 'modules' && <ModuleControl />}
              {activeTab === 'grading' && <RubricGrading />}
              {activeTab === 'materials' && <MaterialManager />}
              {activeTab === 'gallery_moderation' && <GalleryModeration />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
