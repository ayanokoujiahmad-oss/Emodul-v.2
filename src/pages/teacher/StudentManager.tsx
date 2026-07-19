import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserPlus,
  Users,
  Printer,
  Trash2,
  RefreshCw,
  Search,
  Copy,
  Check,
  AlertCircle,
  X,
  Upload,
  FileSpreadsheet,
  Download,
  Edit,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import {
  createStudentCredential,
  deleteStudentCredential,
  resetStudentCredential,
} from '../../lib/studentAuth';
import type { StudentAccount, Classroom } from '../../types';
import {
  getDemoAccounts,
  saveDemoAccount,
  deleteDemoAccount,
  saveDemoUser,
  getDemoClassrooms,
} from '../../lib/demoStore';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function safeLog(label: string, err: unknown) {
  if (err instanceof Error) console.error(`[${label}]`, err.message);
  else console.error(`[${label}] Unknown error`);
}

const ADJECTIVES = [
  'petualang', 'penjelajah', 'pahlawan', 'ksatria', 'pejuang',
  'pelindung', 'penemu', 'pelopor', 'pembela', 'pemimpin',
];

function generateUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = String(Math.floor(100 + Math.random() * 900));
  return `${adj}-${num}`;
}

function generatePassword(length = 6): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

function formatDate(ts: any): string {
  if (!ts) return '-';
  const ms = typeof ts === 'number' ? ts : (ts.toMillis ? ts.toMillis() : Date.now());
  return new Date(ms).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* ─── Print Modal ─────────────────────────────────────────────────────────── */
interface PrintModalProps {
  accounts: StudentAccount[];
  onClose: () => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ accounts, onClose }) => {
  const handlePrint = () => window.print();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-surface-800">Kartu Kredensial Siswa</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 print:grid-cols-2" id="print-cards">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="border-2 border-dashed border-primary-200 rounded-xl p-4 bg-primary-50/30"
            >
              <p className="font-display font-bold text-primary-700 text-sm mb-2">SiberCerdas</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-500">Nama:</span>{' '}
                  <span className="font-medium">{acc.displayName || '-'}</span>
                </p>
                <p>
                  <span className="text-gray-500">Username:</span>{' '}
                  <span className="font-mono font-bold text-surface-800">{acc.username}</span>
                </p>
                <p>
                  <span className="text-gray-500">Password:</span>{' '}
                  <span className="font-mono font-bold text-surface-800">{acc.password}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Printer size={16} />
            Cetak
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface EditModalProps {
  account: StudentAccount;
  classrooms: Classroom[];
  onClose: () => void;
  onSave: (name: string, classId: string, pass: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ account, classrooms, onClose, onSave }) => {
  const [name, setName] = useState(account.displayName || '');
  const [classId, setClassId] = useState(account.classId || '');
  const [pass, setPass] = useState(account.password || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, classId, pass);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-surface-800">Edit Profil Siswa</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-semibold">Nama Tampilan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-semibold">Kelas</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-white appearance-none"
            >
              <option value="">Pilih Kelas</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-semibold">Kata Sandi</label>
            <input
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm font-mono"
              required
              minLength={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ─── CSV Import Preview Row ──────────────────────────────────────────────── */
interface CSVStudent {
  username: string;
  password: string;
  displayName: string;
  classId: string;
  error?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── Student Manager Component ────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function StudentManager() {
  // Try to read Guru UID. Fallback to demo guru ID if not logged in / demo
  const [guruId] = useState(() => {
    return auth?.currentUser?.uid || 'demo-guru-001';
  });

  /* State */
  const [accounts, setAccounts] = useState<StudentAccount[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [editingAccount, setEditingAccount] = useState<StudentAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassId, setFilterClassId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showCsvForm, setShowCsvForm] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [newName, setNewName] = useState('');
  const [bulkCount, setBulkCount] = useState(5);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch classrooms
  useEffect(() => {
    if (!db) {
      setClassrooms(getDemoClassrooms(guruId));
      return;
    }
    const qClass = query(collection(db, 'classrooms'), where('guruId', '==', guruId));
    const unsub = onSnapshot(qClass, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Classroom[];
      setClassrooms(list);
    }, (err) => safeLog('classrooms-snapshot-err', err));
    return unsub;
  }, [guruId]);
  
  // CSV Import States
  const [csvStudents, setCsvStudents] = useState<CSVStudent[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  
  // Local storage state retrigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const createFirebaseStudent = useCallback(async (student: {
    username: string;
    password: string;
    displayName: string;
    classId: string;
    createdAt?: number;
  }) => {
    if (!db) throw new Error('Firebase belum dikonfigurasi');

    const username = student.username.trim().toLowerCase();
    const password = student.password.trim();
    if (!username || !password) throw new Error('Username dan kata sandi wajib diisi');

    const studentUid = await createStudentCredential(username, password);
    const createdAt = student.createdAt ?? Date.now();
    const accountPayload = {
      username,
      // This value is only visible to the owning teacher by Firestore Rules.
      // Firebase Authentication, not this field, verifies student sign-in.
      password,
      passwordHash: 'managed-by-firebase-auth',
      displayName: student.displayName.trim(),
      classId: student.classId || 'Kelas 6',
      guruId,
      studentUid,
      createdAt,
      status: 'active',
    };
    const profilePayload = {
      uid: studentUid,
      displayName: accountPayload.displayName || username,
      username,
      role: 'siswa' as const,
      guruId,
      classId: accountPayload.classId,
      avatarEmoji: 'ST',
      createdAt,
      lastLogin: createdAt,
    };

    try {
      await setDoc(doc(db, 'accounts', studentUid), accountPayload);
      await setDoc(doc(db, 'users', studentUid), profilePayload);
    } catch (err) {
      await deleteStudentCredential(username, password).catch(() => undefined);
      throw err;
    }
  }, [guruId]);

  /* Download CSV Template */
  const handleDownloadTemplate = () => {
    const header = 'Nama Lengkap,Kelas,Username (Opsional),Password (Opsional)\n';
    const row1 = 'Budi Hartono,Kelas 6A,budi6a,sandi123\n';
    const row2 = 'Siti Aminah,Kelas 6A,,\n';
    const csvContent = '\uFEFF' + header + row1 + row2; // include UTF-8 BOM

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sibercerdas_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Export student accounts as CSV */
  const handleExportCsv = () => {
    if (accounts.length === 0) {
      alert('Tidak ada data siswa untuk diekspor.');
      return;
    }
    const header = 'Nama Lengkap,Kelas,Username,Kata Sandi,Tanggal Dibuat,Status\n';
    const rows = accounts.map((acc) => {
      const name = acc.displayName || '-';
      const classId = acc.classId || 'Kelas 6';
      const user = acc.username;
      const pass = acc.password || '-';
      const created = formatDate(acc.createdAt);
      const status = acc.status === 'active' ? 'Aktif' : 'Nonaktif';
      // Escaping commas if any in displayName
      const escapedName = name.includes(',') ? `"${name}"` : name;
      const escapedClass = classId.includes(',') ? `"${classId}"` : classId;
      return `${escapedName},${escapedClass},${user},${pass},${created},${status}\n`;
    }).join('');

    const csvContent = '\uFEFF' + header + rows; // include UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sibercerdas_siswa_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Subscribe to accounts */
  useEffect(() => {
    setLoading(true);
    if (!db) {
      // Demo Mode fetch
      const localAccounts = getDemoAccounts(guruId);
      setAccounts(localAccounts);
      setLoading(false);
      return;
    }

    if (!guruId) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'accounts'), where('guruId', '==', guruId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as StudentAccount[];
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setAccounts(data);
        setLoading(false);
      },
      (err) => {
        safeLog('accounts-snapshot', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [guruId, refreshTrigger]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = accounts;
    if (filterClassId) {
      result = result.filter((a) => a.classId === filterClassId);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(term) ||
          (a.displayName && a.displayName.toLowerCase().includes(term)),
      );
    }
    return result;
  }, [accounts, searchTerm, filterClassId]);

  /* Create single account */
  const handleCreateSingle = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const username = generateUsername();
      const password = generatePassword();
      
      const payload: Omit<StudentAccount, 'id'> = {
        username,
        password,
        passwordHash: password,
        displayName: newName.trim() || '',
        classId: selectedClassId || 'Kelas 6',
        guruId,
        createdAt: Date.now(),
        status: 'active',
      };

      if (!db) {
        // Save to demoStore
        const studentUid = `demo-siswa-${Date.now()}`;
        const accountWithId: StudentAccount = {
          id: `demo-acc-${Date.now()}`,
          studentUid,
          ...payload,
        };
        saveDemoAccount(accountWithId);
        
        // Also save user profile
        saveDemoUser({
          uid: studentUid,
          displayName: payload.displayName || username,
          username,
          role: 'siswa',
          classId: payload.classId,
          guruId,
          createdAt: Date.now(),
          lastLogin: Date.now(),
        });

        triggerRefresh();
      } else {
        await createFirebaseStudent({
          username,
          password,
          displayName: payload.displayName || '',
          classId: payload.classId || 'Kelas 6',
          createdAt: payload.createdAt as number,
        });
      }
      setNewName('');
      setSelectedClassId('');
      setShowCreateForm(false);
    } catch (err) {
      safeLog('create-account', err);
      setError('Gagal membuat akun. Coba lagi.');
    } finally {
      setCreating(false);
    }
  }, [createFirebaseStudent, guruId, newName, selectedClassId]);

  /* Bulk create */
  const handleBulkCreate = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      if (!db) {
        for (let i = 0; i < bulkCount; i++) {
          const username = generateUsername();
          const password = generatePassword();
          const studentUid = `demo-siswa-${Date.now()}-${i}`;
          
          const acc: StudentAccount = {
            id: `demo-acc-${Date.now()}-${i}`,
            username,
            password,
            passwordHash: password,
            displayName: `Siswa ${accounts.length + i + 1}`,
            classId: 'Kelas 6',
            guruId,
            studentUid,
            createdAt: Date.now() + i,
            status: 'active',
          };
          saveDemoAccount(acc);
          
          saveDemoUser({
            uid: studentUid,
            displayName: acc.displayName || username,
            username,
            role: 'siswa',
            guruId,
            createdAt: Date.now(),
            lastLogin: Date.now(),
          });
        }
        triggerRefresh();
      } else {
        for (let i = 0; i < bulkCount; i++) {
          const username = generateUsername();
          const password = generatePassword();
          // Credential provisioning uses a dedicated Firebase Auth session,
          // so create accounts one-by-one rather than racing that session.
          await createFirebaseStudent({
            username,
            password,
            displayName: '',
            classId: 'Kelas 6',
            createdAt: Date.now() + i,
          });
        }
      }
      setShowBulkForm(false);
    } catch (err) {
      safeLog('bulk-create', err);
      setError('Gagal membuat akun massal. Coba lagi.');
    } finally {
      setCreating(false);
    }
  }, [accounts.length, bulkCount, createFirebaseStudent, guruId]);

  /* CSV File Parsing */
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const parsed: CSVStudent[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // skip empty lines

        // Split by comma or semicolon
        const cols = line.split(/[,;]/).map((c) => c.trim().replace(/^["']|["']$/g, ''));
        
        // Skip header if it contains terms like 'nama' or 'username'
        if (i === 0 && (cols[0].toLowerCase().includes('nama') || cols[0].toLowerCase().includes('user'))) {
          continue;
        }

        const name = cols[0] || '';
        const classId = cols[1] || 'Kelas 6';
        let user = cols[2] || '';
        let pass = cols[3] || '';

        if (!name) continue;

        // Auto-generate missing values
        if (!user) user = generateUsername();
        if (!pass) pass = generatePassword();

        parsed.push({
          displayName: name,
          classId,
          username: user,
          password: pass,
        });
      }

      if (parsed.length === 0) {
        setError('File CSV kosong atau format tidak sesuai. Pastikan ada nama siswa.');
      } else {
        setCsvStudents(parsed);
      }
    };
    reader.readAsText(file);
  };

  /* Process bulk CSV import */
  const handleProcessImport = async () => {
    if (csvStudents.length === 0) return;
    setCreating(true);
    setError(null);

    try {
      if (!db) {
        // Offline import
        csvStudents.forEach((student, i) => {
          const studentUid = `demo-siswa-${Date.now()}-${i}`;
          const acc: StudentAccount = {
            id: `demo-acc-${Date.now()}-${i}`,
            username: student.username,
            password: student.password,
            passwordHash: student.password,
            displayName: student.displayName,
            classId: student.classId,
            guruId,
            studentUid,
            createdAt: Date.now() + i,
            status: 'active',
          };
          saveDemoAccount(acc);
          
          saveDemoUser({
            uid: studentUid,
            displayName: student.displayName,
            username: student.username,
            role: 'siswa',
            guruId,
            createdAt: Date.now(),
            lastLogin: Date.now(),
          });
        });
        triggerRefresh();
      } else {
        for (let i = 0; i < csvStudents.length; i++) {
          const student = csvStudents[i];
          await createFirebaseStudent({
            username: student.username,
            password: student.password,
            displayName: student.displayName,
            classId: student.classId,
            createdAt: Date.now() + i,
          });
        }
      }

      setCsvStudents([]);
      setCsvFileName('');
      setShowCsvForm(false);
      alert(`Berhasil mengimpor ${csvStudents.length} siswa!`);
    } catch (err) {
      safeLog('csv-import', err);
      setError('Gagal mengimpor siswa. Coba lagi.');
    } finally {
      setCreating(false);
    }
  };

  /* Save Edit */
  const handleSaveEdit = async (name: string, classId: string, pass: string) => {
    if (!editingAccount) return;
    try {
      const payload = {
        displayName: name.trim(),
        classId,
        password: pass.trim(),
        passwordHash: 'managed-by-firebase-auth',
      };

      if (!db) {
        const updatedAcc = {
          ...editingAccount,
          ...payload,
        };
        saveDemoAccount(updatedAcc);

        if (editingAccount.studentUid) {
          const profile = {
            uid: editingAccount.studentUid,
            displayName: name.trim() || editingAccount.username,
            username: editingAccount.username,
            role: 'siswa' as const,
            classId,
            guruId,
            createdAt: editingAccount.createdAt,
            lastLogin: Date.now(),
          };
          saveDemoUser(profile);
        }
        triggerRefresh();
      } else {
        if (pass.trim() !== editingAccount.password) {
          await resetStudentCredential(
            editingAccount.username,
            editingAccount.password || '',
            pass.trim(),
          );
        }
        const ref = doc(db!, 'accounts', editingAccount.id);
        await updateDoc(ref, payload);
        
        const studentUid = editingAccount.studentUid || editingAccount.id;
        if (studentUid) {
          const userRef = doc(db!, 'users', studentUid);
          await updateDoc(userRef, {
            displayName: name.trim(),
            classId: classId,
          });
        }
      }
      setEditingAccount(null);
    } catch (err) {
      safeLog('save-student-edit', err);
      alert('Gagal memperbarui data siswa.');
    }
  };



  /* Delete account */
  const handleDelete = useCallback(async (account: StudentAccount) => {
    if (!window.confirm('Hapus akun siswa ini? Tindakan ini tidak bisa dibatalkan.')) return;
    try {
      if (!db) {
        deleteDemoAccount(account.id);
        triggerRefresh();
      } else {
        await deleteStudentCredential(account.username, account.password || '');
        await deleteDoc(doc(db, 'accounts', account.id));
        const studentUid = account.studentUid || account.id;
        if (studentUid) {
          await deleteDoc(doc(db, 'users', studentUid));
          
          // Delete progress/grades
          try {
            const gradesQ = query(collection(db, 'moduleGrades'), where('studentUid', '==', studentUid));
            const gradesSnap = await getDocs(gradesQ);
            await Promise.all(gradesSnap.docs.map((d) => deleteDoc(d.ref)));
          } catch (e) {
            safeLog('delete-student-grades', e);
          }

          // Delete activity logs
          try {
            const logsQ = query(collection(db, 'activityLog'), where('studentUid', '==', studentUid));
            const logsSnap = await getDocs(logsQ);
            await Promise.all(logsSnap.docs.map((d) => deleteDoc(d.ref)));
          } catch (e) {
            safeLog('delete-student-logs', e);
          }
        }
      }
    } catch (err) {
      safeLog('delete-account', err);
    }
  }, []);

  /* Copy to clipboard */
  const handleCopy = useCallback((accountId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(accountId);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Memuat data siswa...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-primary-500 w-8 h-8" />
          Manajemen Akun Siswa
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Guru membuat akun murid dengan username dan kata sandi tanpa meminta email anak.
        </p>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-danger-50 border border-danger-200 text-danger-700 p-4 rounded-xl text-sm flex items-center gap-2 font-medium"
          >
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => { setShowCreateForm(true); setShowBulkForm(false); setShowCsvForm(false); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          Buat Akun
        </button>
        <button
          onClick={() => { setShowBulkForm(true); setShowCreateForm(false); setShowCsvForm(false); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
        >
          <Users size={16} />
          Buat Massal
        </button>
        <button
          onClick={() => { setShowCsvForm(true); setShowCreateForm(false); setShowBulkForm(false); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          <FileSpreadsheet size={16} />
          Impor CSV (Excel)
        </button>
        {accounts.length > 0 && (
          <>
            <button
              onClick={() => setShowPrint(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Printer size={16} />
              Cetak Kartu
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
              title="Ekspor daftar siswa ke CSV"
            >
              <FileSpreadsheet size={16} />
              Ekspor CSV
            </button>
          </>
        )}

        {/* Filter & Search */}
        <div className="ml-auto flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Filter Kelas */}
          <div className="relative w-full md:w-auto flex-1 md:flex-none">
            <select
              value={filterClassId}
              onChange={(e) => setFilterClassId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-white appearance-none pr-8 cursor-pointer"
            >
              <option value="">Semua Kelas</option>
              {classrooms.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-auto flex-1 md:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari username atau nama..."
              className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm w-full md:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Create single form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl p-5 shadow-card border border-primary-100 animate-fade-in">
              <h3 className="font-display font-semibold text-surface-800 mb-3 text-sm">Buat Akun Baru</h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end">
                <div className="w-full sm:flex-1 sm:min-w-[200px]">
                  <label className="block text-xs text-gray-500 mb-1">Nama Tampilan (opsional)</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Ahmad"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                  />
                </div>
                <div className="w-full sm:w-[180px]">
                  <label className="block text-xs text-gray-500 mb-1">Kelas</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-white appearance-none"
                  >
                    <option value="">Pilih Kelas</option>
                    {classrooms.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-405 py-1 w-full sm:w-auto sm:flex-1">
                  <p>Username & Password akan digenerate otomatis</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={handleCreateSingle}
                    disabled={creating}
                    className="flex-1 sm:flex-none justify-center px-5 py-2 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {creating ? <RefreshCw size={14} className="animate-spin" /> : <UserPlus size={14} />}
                    Buat
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors text-center border border-transparent hover:border-gray-200"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk create form */}
      <AnimatePresence>
        {showBulkForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl p-5 shadow-card border border-primary-100">
              <h3 className="font-display font-semibold text-surface-800 mb-3">Buat Akun Massal</h3>
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Jumlah Akun</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-24 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm text-center"
                  />
                </div>
                <p className="text-xs text-gray-400 flex-1 min-w-[200px] py-2">
                  Akan membuat {bulkCount} akun dengan username & password acak (maks 30)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkCreate}
                    disabled={creating}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {creating ? <RefreshCw size={14} className="animate-spin" /> : <Users size={14} />}
                    Buat {bulkCount} Akun
                  </button>
                  <button
                    onClick={() => setShowBulkForm(false)}
                    className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Import Form */}
      <AnimatePresence>
        {showCsvForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl p-5 shadow-card border border-emerald-100 space-y-4">
              <h3 className="font-display font-semibold text-surface-800 flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-500" size={20} />
                Impor Siswa Massal via Excel / CSV
              </h3>
              
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-800 space-y-2">
                <p className="font-semibold">Petunjuk Format File:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Unggah file berformat <strong>.csv</strong>.</li>
                  <li>Susunan kolom wajib: <strong>Nama Siswa, Kelas, Username (opsional), Password (opsional)</strong>.</li>
                  <li>Jika username/password dikosongkan, sistem akan meng-generate otomatis secara acak & aman.</li>
                  <li>Contoh baris: <code>Budi Hartono, Kelas 6A, budi6a, sandi123</code></li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <Download size={12} />
                    Unduh Templat CSV
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    id="csv-file-input"
                    className="hidden"
                  />
                  <label
                    htmlFor="csv-file-input"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Upload size={16} />
                    Pilih File CSV
                  </label>
                </div>
                {csvFileName && (
                  <span className="text-xs font-mono text-gray-500">File: {csvFileName}</span>
                )}
                
                {csvStudents.length > 0 && (
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={handleProcessImport}
                      disabled={creating}
                      className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
                    >
                      Proses Impor ({csvStudents.length} Siswa)
                    </button>
                    <button
                      onClick={() => { setCsvStudents([]); setCsvFileName(''); }}
                      className="px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Bersihkan
                    </button>
                  </div>
                )}
              </div>

              {/* CSV Preview Table */}
              {csvStudents.length > 0 && (
                <div className="border border-gray-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-semibold uppercase">
                        <th className="px-4 py-2">Nama Lengkap</th>
                        <th className="px-4 py-2">Kelas</th>
                        <th className="px-4 py-2 font-mono">Username</th>
                        <th className="px-4 py-2 font-mono">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {csvStudents.map((st, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2 font-semibold text-gray-700">{st.displayName}</td>
                          <td className="px-4 py-2 text-gray-500">{st.classId}</td>
                          <td className="px-4 py-2 font-mono text-primary-600">{st.username}</td>
                          <td className="px-4 py-2 font-mono text-gray-600">{st.password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accounts table */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            {filtered.length} akun {searchTerm && `(dari ${accounts.length} total)`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={40} className="mb-3" />
            <p className="font-medium">{accounts.length === 0 ? 'Belum ada akun siswa' : 'Tidak ada hasil pencarian'}</p>
            <p className="text-sm mt-1">
              {accounts.length === 0 ? 'Buat akun pertama untuk memulai' : 'Coba kata kunci lain'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide bg-surface-50/50">
                  <th className="px-5 py-3">Username</th>
                  <th className="px-5 py-3">Password</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Kelas</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Dibuat</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((acc, idx) => (
                  <motion.tr
                    key={acc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-surface-50/50 transition-colors text-xs md:text-sm"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-surface-800">{acc.username}</span>
                        <button
                          onClick={() => handleCopy(acc.id, acc.username)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Salin username"
                        >
                          {copiedId === acc.id ? <Check size={12} className="text-success-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-gray-600">{acc.password}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-750 font-medium">{acc.displayName || <span className="text-gray-300">-</span>}</td>
                    <td className="px-5 py-3 text-gray-500">{acc.classId || 'Kelas 6'}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell">{formatDate(acc.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          acc.status === 'active'
                            ? 'bg-success-50 text-success-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {acc.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingAccount(acc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(acc)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                          title="Hapus Akun"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Print modal */}
      <AnimatePresence>
        {showPrint && <PrintModal accounts={filtered} onClose={() => setShowPrint(false)} />}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingAccount && (
          <EditModal
            account={editingAccount}
            classrooms={classrooms}
            onClose={() => setEditingAccount(null)}
            onSave={handleSaveEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
