import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  Unlock,
  RefreshCw,
  Info,
  LockOpen,
  ShieldAlert,
} from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { type TeacherSettings } from '../../types';
import { useModules } from '../../contexts/ModuleContext';

/* ─── Helper ──────────────────────────────────────────────────────────────── */
function safeLog(label: string, err: unknown) {
  if (err instanceof Error) console.error(`[${label}]`, err.message);
  else console.error(`[${label}] Unknown error`);
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Module Control ──────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */
const ModuleControl: React.FC = () => {
  const [guruId] = useState(() => {
    return auth?.currentUser?.uid || 'demo-guru-001';
  });

  const { topics: TOPICS } = useModules();
  const [topicLocks, setTopicLocks] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Subscribe to settings */
  useEffect(() => {
    if (!db) {
      try {
        const localLocks = localStorage.getItem(`sibercerdas_demo_locks_${guruId}`);
        if (localLocks) {
          setTopicLocks(JSON.parse(localLocks));
        } else {
          const defaults: Record<string, boolean> = {};
          TOPICS.forEach((t) => {
            defaults[t.id] = false;
          });
          setTopicLocks(defaults);
        }
      } catch (err) {
        console.error('Failed to load local locks:', err);
      }
      setLoading(false);
      return;
    }
    if (!guruId) return;
    const settingsRef = doc(db, 'settings', guruId);
    const unsub = onSnapshot(
      settingsRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as TeacherSettings;
          setTopicLocks(data.topicLocks || {});
        } else {
          // Initialize all topics as unlocked
          const defaults: Record<string, boolean> = {};
          TOPICS.forEach((t) => {
            defaults[t.id] = false;
          });
          setTopicLocks(defaults);
        }
        setLoading(false);
      },
      (err) => {
        safeLog('settings-snapshot', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [guruId, TOPICS]);

  /* Save settings helper */
  const saveTopicLocks = useCallback(
    async (newLocks: Record<string, boolean>) => {
      setSaving(true);
      try {
        if (!db) {
          localStorage.setItem(`sibercerdas_demo_locks_${guruId}`, JSON.stringify(newLocks));
        } else {
          if (!guruId) return;
          await setDoc(doc(db, 'settings', guruId), {
            guruId,
            topicLocks: newLocks,
            updatedAt: new Date(),
          });
        }
      } catch (err) {
        safeLog('settings-save', err);
      } finally {
        setSaving(false);
      }
    },
    [guruId],
  );

  /* Toggle single topic */
  const handleToggle = useCallback(
    (topicId: string) => {
      const updated = { ...topicLocks, [topicId]: !topicLocks[topicId] };
      setTopicLocks(updated);
      saveTopicLocks(updated);
    },
    [topicLocks, saveTopicLocks],
  );

  /* Bulk lock all */
  const handleLockAll = useCallback(() => {
    const updated: Record<string, boolean> = {};
    TOPICS.forEach((t: any) => {
      updated[t.id] = true;
    });
    setTopicLocks(updated);
    saveTopicLocks(updated);
  }, [saveTopicLocks, TOPICS]);

  /* Bulk unlock all */
  const handleUnlockAll = useCallback(() => {
    const updated: Record<string, boolean> = {};
    TOPICS.forEach((t: any) => {
      updated[t.id] = false;
    });
    setTopicLocks(updated);
    saveTopicLocks(updated);
  }, [saveTopicLocks, TOPICS]);

  const lockedCount = Object.values(topicLocks).filter(Boolean).length;
  const unlockedCount = TOPICS.length - lockedCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 bg-accent-50 border border-accent-200 rounded-2xl"
      >
        <Info size={20} className="text-accent-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-accent-700">
          <p className="font-medium mb-1">Kontrol Akses Modul</p>
          <p className="text-accent-600">
            Kunci atau buka topik untuk mengontrol akses siswa. Topik yang terkunci tidak akan bisa diakses
            oleh siswa sampai Anda membukanya. Ini berguna untuk mengatur alur pembelajaran secara bertahap.
          </p>
        </div>
      </motion.div>

      {/* Stats and bulk actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-4 mr-auto">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-success-400" />
            <span className="text-gray-600">{unlockedCount} Terbuka</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-danger-400" />
            <span className="text-gray-600">{lockedCount} Terkunci</span>
          </div>
        </div>

        <button
          onClick={handleUnlockAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-success-600 bg-success-50 hover:bg-success-100 transition-colors"
        >
          <LockOpen size={14} />
          Buka Semua
        </button>
        <button
          onClick={handleLockAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors"
        >
          <ShieldAlert size={14} />
          Kunci Semua
        </button>
      </div>

      {/* Topics list */}
      <div className="space-y-2">
        {TOPICS.map((topic: any, idx: number) => {
          const isLocked = !!topicLocks[topic.id];
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-200
                ${
                  isLocked
                    ? 'bg-danger-50/50 border-danger-200 hover:border-danger-300'
                    : 'bg-white border-gray-100 hover:border-success-300 shadow-card'
                }
              `}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full">
                {/* Topic number */}
                <div
                  className={`
                    flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-sm font-display font-bold
                    ${isLocked ? 'bg-danger-100 text-danger-500' : 'bg-primary-100 text-primary-600'}
                  `}
                >
                  {topic.number}
                </div>

                {/* Lock icon */}
                <div className="flex-shrink-0">
                  {isLocked ? (
                    <Lock size={20} className="text-danger-400" />
                  ) : (
                    <Unlock size={20} className="text-success-500" />
                  )}
                </div>

                {/* Topic info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-display font-semibold text-sm ${isLocked ? 'text-danger-700' : 'text-surface-800'}`}>
                    {topic.title}
                  </h4>
                  <p className={`text-xs mt-0.5 line-clamp-2 sm:line-clamp-none ${isLocked ? 'text-danger-400' : 'text-gray-400'}`}>
                    {topic.description}
                  </p>
                </div>
              </div>

              {/* Controls Row (stacks on mobile, side-by-side on desktop) */}
              <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto border-t border-gray-50 pt-3 sm:border-t-0 sm:pt-0">
                {/* Status badge */}
                <span
                  className={`
                    inline-flex px-3 py-1 rounded-full text-xs font-medium
                    ${isLocked ? 'bg-danger-100 text-danger-600' : 'bg-success-100 text-success-600'}
                  `}
                >
                  {isLocked ? 'Terkunci' : 'Terbuka'}
                </span>

                {/* Toggle switch */}
                <button
                  onClick={() => handleToggle(topic.id)}
                  className="flex-shrink-0 focus:outline-none"
                  aria-label={`Toggle ${topic.title}`}
                >
                  <motion.div
                    className={`
                      relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer
                      ${isLocked ? 'bg-danger-300' : 'bg-success-400'}
                    `}
                  >
                    <motion.div
                      animate={{ x: isLocked ? 2 : 22 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                    />
                  </motion.div>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-surface-800 text-white text-sm rounded-xl shadow-lg">
          <RefreshCw size={14} className="animate-spin" />
          Menyimpan...
        </div>
      )}
    </div>
  );
};

export default ModuleControl;
