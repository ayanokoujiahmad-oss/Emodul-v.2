import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  RefreshCw,
  School,
  Users,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import type { Classroom, StudentAccount } from '../../types';
import {
  getDemoClassrooms,
  saveDemoClassroom,
  deleteDemoClassroom,
  getDemoAccounts,
} from '../../lib/demoStore';

function safeLog(label: string, err: unknown) {
  if (err instanceof Error) console.error(`[${label}]`, err.message);
  else console.error(`[${label}] Unknown error`);
}

export default function ClassroomManager() {
  const [guruId] = useState(() => auth?.currentUser?.uid || 'demo-guru-001');

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // Fetch Classrooms & Student Accounts
  useEffect(() => {
    setLoading(true);
    let unsubClasses: (() => void) | undefined;
    let unsubStudents: (() => void) | undefined;

    if (!db) {
      // Demo Mode
      setClassrooms(getDemoClassrooms(guruId));
      setStudents(getDemoAccounts(guruId));
      setLoading(false);
      return;
    }

    try {
      const qClass = query(collection(db, 'classrooms'), where('guruId', '==', guruId));
      unsubClasses = onSnapshot(
        qClass,
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Classroom[];
          setClassrooms(list);
          setLoading(false);
        },
        (err) => {
          safeLog('classrooms-snapshot', err);
          setLoading(false);
        }
      );

      const qStud = query(collection(db, 'accounts'), where('guruId', '==', guruId));
      unsubStudents = onSnapshot(
        qStud,
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as StudentAccount[];
          setStudents(list);
        },
        (err) => safeLog('students-snapshot', err)
      );
    } catch (err) {
      safeLog('classroom-init', err);
      setLoading(false);
    }

    return () => {
      if (unsubClasses) unsubClasses();
      if (unsubStudents) unsubStudents();
    };
  }, [guruId, refreshTrigger]);

  // Create class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      setError('Nama kelas tidak boleh kosong.');
      return;
    }

    setCreating(true);
    setError(null);

    const name = newClassName.trim();
    const isDuplicate = classrooms.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
      setError('Nama kelas sudah terdaftar.');
      setCreating(false);
      return;
    }

    try {
      if (!db) {
        saveDemoClassroom({
          id: `class-${Date.now()}`,
          name,
          guruId,
          createdAt: Date.now(),
        });
        triggerRefresh();
      } else {
        await addDoc(collection(db, 'classrooms'), {
          name,
          guruId,
          createdAt: serverTimestamp(),
        });
      }
      setNewClassName('');
    } catch (err) {
      safeLog('create-class', err);
      setError('Gagal membuat kelas.');
    } finally {
      setCreating(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (id: string, name: string) => {
    const studentCount = students.filter((s) => s.classId === name || s.classId === id).length;
    if (studentCount > 0) {
      alert(`Tidak dapat menghapus kelas ini karena masih memiliki ${studentCount} siswa terdaftar. Pindahkan siswa terlebih dahulu.`);
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus kelas "${name}"?`)) return;

    try {
      if (!db) {
        deleteDemoClassroom(id);
        triggerRefresh();
      } else {
        await deleteDoc(doc(db, 'classrooms', id));
      }
    } catch (err) {
      safeLog('delete-class', err);
      alert('Gagal menghapus kelas.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Pembuatan Kelas */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-primary-100/50">
        <h3 className="font-display font-bold text-lg text-surface-800 mb-2 flex items-center gap-2">
          <School className="text-primary-500" size={20} />
          Buat Kelas Baru
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Buat kelas kustom untuk mengelompokkan akun siswa dan mempermudah pemantauan progres belajar.
        </p>

        <form onSubmit={handleCreateClass} className="flex flex-col sm:flex-row gap-3 sm:items-end" noValidate>
          <div className="w-full max-w-md">
            <label htmlFor="className" className="block text-xs text-gray-400 mb-1">Nama Kelas</label>
            <input
              id="className"
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Contoh: Kelas 6A atau Kelas Eksperimen"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            {creating ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
            Tambah Kelas
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 text-xs text-danger-600 bg-danger-50 p-3 rounded-xl"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className="ml-auto">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Daftar Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classrooms.map((cls) => {
          const classStudents = students.filter((s) => s.classId === cls.name || s.classId === cls.id);
          const formattedDate = cls.createdAt
            ? new Date(typeof cls.createdAt === 'number' ? cls.createdAt : (cls.createdAt.toMillis ? cls.createdAt.toMillis() : Date.now())).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '-';

          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary-50 rounded-xl text-primary-500">
                      <School size={20} />
                    </div>
                    <h4 className="font-display font-bold text-base text-surface-800">{cls.name}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                    title="Hapus Kelas"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    <span>{classStudents.length} Siswa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              {classStudents.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Daftar Siswa Aktif:
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {classStudents.map((s) => (
                      <span
                        key={s.id}
                        className="inline-flex px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[10px] font-medium text-gray-600"
                        title={s.username}
                      >
                        {s.displayName || s.username}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {classrooms.length === 0 && (
          <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-2xl py-12 flex flex-col items-center justify-center text-gray-400">
            <School size={40} className="mb-2" />
            <p className="font-medium text-sm">Belum ada kelas kustom</p>
            <p className="text-xs">Silakan tambahkan kelas di atas untuk memulai</p>
          </div>
        )}
      </div>
    </div>
  );
}
