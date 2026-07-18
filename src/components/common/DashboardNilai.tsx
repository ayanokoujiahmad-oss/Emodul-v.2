// ============================================================
// SiberCerdas – Dashboard Nilai Uji Pemahaman (Gamified)
// Menampilkan skor kuis otomatis dari Uji Pemahaman per topik
// Data source: progress.quizScore
// ============================================================

import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import {
    Rocket, Trophy, Medal, CheckCircle2, HelpCircle, TrendingUp,
} from 'lucide-react';
import type { StudentProgress } from '../../types';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */

export interface DashboardNilaiProps {
    progressList: StudentProgress[];
    progressMap: Record<string, StudentProgress>;
    topicModules: any[];
    studentUid?: string;
}

interface TopicScoreCard {
    topicId: string;
    number: number;
    title: string;
    icon: string;
    score: number | null;
    status: 'perfect' | 'great' | 'good' | 'try-again' | 'empty';
    correct?: number;
    total?: number;
}

const TOPIC_ICONS: Record<string, string> = {
    'topik-1': '🛡️', 'topik-2': '🔍', 'topik-3': '🔑', 'topik-4': '🛡️',
    'topik-5': '💬', 'topik-6': '🤝', 'topik-7': '©️', 'topik-8': '🎨',
};

const TOPIC_COLORS: Record<string, string> = {
    'topik-1': '#6366f1', 'topik-2': '#f59e0b', 'topik-3': '#10b981', 'topik-4': '#ef4444',
    'topik-5': '#ec4899', 'topik-6': '#8b5cf6', 'topik-7': '#d97706', 'topik-8': '#14b8a6',
};

function getScoreStatus(score: number | null | undefined): TopicScoreCard['status'] {
    if (score === null || score === undefined) return 'empty';
    if (score >= 100) return 'perfect';
    if (score >= 80) return 'great';
    if (score >= 60) return 'good';
    return 'try-again';
}

function getScoreEmoji(status: TopicScoreCard['status']): string {
    const m: Record<string, string> = { perfect: '🏆', great: '🌟', good: '💪', 'try-again': '📚' };
    return m[status] || '❓';
}

function getScoreLabel(status: TopicScoreCard['status']): string {
    const m: Record<string, string> = { perfect: 'Sempurna!', great: 'Keren!', good: 'Semangat!', 'try-again': 'Coba Lagi!' };
    return m[status] || 'Belum Ada';
}

function getScoreBgColor(status: TopicScoreCard['status']): string {
    const m: Record<string, string> = {
        perfect: 'from-yellow-400 to-amber-500', great: 'from-emerald-400 to-green-500',
        good: 'from-blue-400 to-cyan-500', 'try-again': 'from-orange-400 to-red-400',
    };
    return m[status] || 'from-gray-300 to-gray-400';
}

function StatRing({ value, total, label, color, icon: Icon }: { value: number | string; total?: number; label: string; color: string; icon: React.ElementType }) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`relative flex flex-col items-center gap-1 rounded-2xl border bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md ${color.replace('text-', 'border-').replace('600', '200')}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`h-4.5 w-4.5 ${color}`} />
            </div>
            <span className="font-display text-xl font-black text-surface-900">{value}{total ? `/${total}` : ''}</span>
            <span className="text-[10px] font-semibold text-surface-400 uppercase tracking-wide">{label}</span>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */

export default function DashboardNilai({ progressMap, topicModules }: DashboardNilaiProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState(0);
    const chartKey = useRef(0);

    // Measure container width on mount & resize
    const measure = useCallback(() => {
        if (chartContainerRef.current) {
            const w = chartContainerRef.current.offsetWidth;
            if (w > 0 && w !== chartWidth) {
                setChartWidth(w);
                chartKey.current += 1;
            }
        }
    }, [chartWidth]);

    useEffect(() => {
        measure();
        const timer = setTimeout(measure, 150); // delayed re-measure after layout
        const onResize = () => measure();
        window.addEventListener('resize', onResize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', onResize);
        };
    }, [measure]);

    // ── Quiz Score Cards ──
    const quizCards: TopicScoreCard[] = useMemo(() => {
        return topicModules.map((topic: any) => {
            const prog = progressMap[topic.id];
            const score = prog?.quizScore ?? null;
            return {
                topicId: topic.id, number: topic.number, title: topic.title,
                icon: TOPIC_ICONS[topic.id] || '📖', score, status: getScoreStatus(score),
                correct: prog?.quizCorrect, total: prog?.quizTotal,
            };
        });
    }, [topicModules, progressMap]);

    const quizStats = useMemo(() => {
        const withScores = quizCards.filter(c => c.score !== null);
        const avg = withScores.length > 0 ? Math.round(withScores.reduce((s, c) => s + (c.score ?? 0), 0) / withScores.length) : null;
        const best = withScores.length > 0 ? withScores.reduce((best, c) => (c.score ?? 0) > (best?.score ?? 0) ? c : best, withScores[0]) : null;
        return { avg, best, completed: withScores.length, total: quizCards.length };
    }, [quizCards]);

    const quizChartData = useMemo(() =>
        quizCards.map(c => ({ name: `T${c.number}`, fullName: c.title, skor: c.score, color: TOPIC_COLORS[c.topicId] || '#6366f1' })),
        [quizCards]);

    const chartHeight = 260;

    return (
        <section className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="flex items-center gap-2 text-lg font-display font-bold text-surface-900">
                    <Trophy className="h-5 w-5 text-yellow-500" /> Prestasi Belajarmu
                </h2>
                <motion.span animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-xl">🌈</motion.span>
            </div>

            {/* Hero banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 text-white shadow-lg">
                <div className="absolute -right-8 -top-8 text-8xl opacity-20">🚀</div>
                <div className="absolute -bottom-4 -left-4 text-6xl opacity-15">🌌</div>
                <div className="relative z-10 flex items-center gap-4">
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Rocket className="h-7 w-7 text-white" />
                    </motion.div>
                    <div>
                        <h3 className="font-display text-lg font-black">Skor Misi Kuis</h3>
                        <p className="text-xs text-white/70">Nilai otomatis dari Uji Pemahaman di setiap topik</p>
                    </div>
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
                <StatRing icon={TrendingUp} value={quizStats.avg !== null ? `${quizStats.avg}%` : '—'} label="Rata-rata Kuis" color="text-indigo-600" />
                <StatRing icon={Trophy} value={quizStats.best ? `T${quizStats.best.number}` : '—'} label="Kuis Terbaik" color="text-amber-600" />
                <StatRing icon={CheckCircle2} value={quizStats.completed} total={quizStats.total} label="Kuis Selesai" color="text-emerald-600" />
            </div>

            {/* Bar chart — manual width tracking to avoid ResponsiveContainer zero-height issues */}
            <div ref={chartContainerRef} className="rounded-2xl border border-surface-200 bg-white p-5 shadow-card w-full">
                {chartWidth > 0 ? (
                    <ResponsiveContainer key={chartKey.current} width="100%" height={chartHeight}>
                        <BarChart data={quizChartData} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="quizGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.25} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} axisLine={{ stroke: '#e5e7eb' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} />
                            <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '13px', padding: '10px 14px' }}
                                formatter={(value: any) => [value !== null ? `${value}%` : 'Belum ada', 'Nilai']}
                                labelFormatter={(label: any) => { const item = quizChartData.find((d: any) => d.name === label); return item?.fullName ?? label; }}
                                cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                            <Bar dataKey="skor" fill="url(#quizGradient)" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={800}>
                                {quizChartData.map((entry: any, idx: number) => (
                                    <Cell key={idx} fill={entry.skor !== null ? entry.color : '#e5e7eb'} fillOpacity={entry.skor !== null ? 0.85 : 0.4} />
                                ))}
                                <LabelList dataKey="skor" position="top" formatter={(v: any) => (v !== null ? `${v}` : '')} style={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center" style={{ height: chartHeight }}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-300 border-t-indigo-600" />
                            <span className="text-xs text-surface-400">Memuat grafik...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Topic score cards */}
            <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-surface-700">
                    <Medal className="h-4 w-4 text-amber-500" /> Nilai Per Topik
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quizCards.map((card, idx) => (
                        <motion.div key={card.topicId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={`relative overflow-hidden rounded-xl border p-4 text-center transition-all ${card.status === 'empty' ? 'border-surface-200 bg-surface-50/60' : 'border-surface-200 bg-white hover:shadow-card'}`}>
                            <div className="absolute -right-3 -top-1 rotate-12 opacity-25 text-4xl">{getScoreEmoji(card.status)}</div>
                            <div className="relative z-10">
                                <span className="text-2xl">{card.icon}</span>
                                <p className="mt-1 text-[10px] font-semibold text-surface-400 line-clamp-1">T{card.number}: {card.title}</p>
                                {card.status === 'empty' ? (
                                    <div className="mt-2 flex flex-col items-center gap-1"><HelpCircle className="h-5 w-5 text-surface-300" /><span className="text-[10px] text-surface-400">Belum ada</span></div>
                                ) : (
                                    <div className="mt-2">
                                        <span className={`inline-block rounded-full bg-gradient-to-r ${getScoreBgColor(card.status)} px-3 py-1 text-sm font-black text-white shadow-sm`}>{card.score}%</span>
                                        <p className="mt-1 text-[10px] font-semibold" style={{ color: TOPIC_COLORS[card.topicId] }}>{getScoreLabel(card.status)}</p>
                                        {card.correct !== undefined && card.total !== undefined && <p className="text-[9px] text-surface-400 mt-0.5">✅ {card.correct}/{card.total} benar</p>}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}