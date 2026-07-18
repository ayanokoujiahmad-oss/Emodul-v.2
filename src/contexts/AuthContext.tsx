import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { safeLog } from '../lib/safeLog';
import { studentEmailFromUsername } from '../lib/studentAuth';
import type { UserProfile } from '../types/models';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AuthContextValue {
  user: { uid: string } | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginStudent: (username: string, password: string) => Promise<void>;
  registerGuru: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  resetGuruPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemoGuru: () => void;
  loginDemoSiswa: () => void;
}



/* ------------------------------------------------------------------ */
/*  Demo Users                                                         */
/* ------------------------------------------------------------------ */

const DEMO_GURU: UserProfile = {
  uid: 'demo-guru-001',
  displayName: 'mapendas25',
  email: 'mapendas25@unja.com',
  role: 'guru',
  avatarEmoji: 'MP',
  createdAt: Date.now(),
  lastLogin: Date.now(),
};

const DEMO_SISWA: UserProfile = {
  uid: 'demo-siswa-001',
  displayName: 'Anak Cerdas',
  username: 'anicerdas',
  role: 'siswa',
  guruId: 'demo-guru-001',
  classId: 'Kelas 6A',
  avatarEmoji: 'AC',
  createdAt: Date.now(),
  lastLogin: Date.now(),
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemo = !isFirebaseConfigured;

  /* ---------- fetch profile from /users ---------- */
  const fetchProfile = useCallback(async (uid: string) => {
    if (!db) return;
    try {
      // Race getDoc against a timeout to prevent hanging when Firestore
      // persistence hasn't established a server connection yet.
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('fetchProfile timeout (6s)')), 6000)
      );
      const snap = await Promise.race([
        getDoc(doc(db, 'users', uid)),
        timeoutPromise
      ]);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (err: unknown) {
      safeLog('error', 'AuthContext.fetchProfile', err);
      setUserProfile(null);
    }
  }, []);

  /* ---------- auth state listener ---------- */
  useEffect(() => {
    if (!auth) {
      // Demo mode – no auth listener needed
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let resolved = false;

    // Safety net: guarantee loading screen is dismissed within 8 seconds
    // even if onAuthStateChanged or fetchProfile hang indefinitely.
    const safetyTimer = setTimeout(() => {
      if (!resolved) {
        safeLog('warn', 'AuthContext', 'Safety timeout triggered – dismissing loading screen');
        resolved = true;
        setLoading(false);
      }
    }, 8000);

    unsubscribe = onAuthStateChanged(
      auth!,
      async (firebaseUser) => {
        if (firebaseUser) {
          setUser({ uid: firebaseUser.uid });
          await fetchProfile(firebaseUser.uid);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        if (!resolved) {
          resolved = true;
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      },
      (err) => {
        safeLog('error', 'AuthContext.onAuthStateChanged', err);
        if (!resolved) {
          resolved = true;
          clearTimeout(safetyTimer);
          setLoading(false);
        }
      },
    );

    return () => {
      clearTimeout(safetyTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [fetchProfile]);

  /* ---------- Demo Login ---------- */
  const loginDemoGuru = useCallback(() => {
    setUser({ uid: DEMO_GURU.uid });
    setUserProfile(DEMO_GURU);
  }, []);

  const loginDemoSiswa = useCallback(() => {
    setUser({ uid: DEMO_SISWA.uid });
    setUserProfile(DEMO_SISWA);
  }, []);

  /* ---------- Guru login (email + password) ---------- */
  const login = useCallback(async (email: string, password: string) => {
    if (!auth) {
      // Demo mode: try matching against demo guru credentials
      const normalizedEmail = email.trim().toLowerCase();
      const demoEmail = (import.meta.env.VITE_DEMO_GURU_EMAIL || '').trim().toLowerCase();
      const demoUsername = (import.meta.env.VITE_DEMO_GURU_USERNAME || '').trim().toLowerCase();
      const demoPassword = import.meta.env.VITE_DEMO_GURU_PASSWORD || '';
      if (
        demoEmail &&
        (normalizedEmail === demoEmail || normalizedEmail === demoUsername) &&
        password === demoPassword
      ) {
        setUser({ uid: DEMO_GURU.uid });
        setUserProfile(DEMO_GURU);
        return;
      }
      throw new Error(
        'Login resmi tidak tersedia di Mode Demo. Gunakan tombol demo atau aktifkan Firebase.',
      );
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    try {
      if (db) {
        await updateDoc(doc(db, 'users', credential.user.uid), {
          lastLogin: Date.now(),
        });
      }
    } catch (err: unknown) {
      safeLog('error', 'AuthContext.login.updateLastLogin', err);
    }
  }, []);

  /* ---------- Student login (username + password) ---------- */
  const loginStudent = useCallback(
    async (username: string, password: string) => {
      if (!auth || !db) {
        const { getDemoAccounts } = await import('../lib/demoStore');
        const accounts = getDemoAccounts('demo-guru-001');
        const acc = accounts.find(
          (a) => a.username.trim().toLowerCase() === username.trim().toLowerCase()
        );
        if (acc && acc.password === password) {
          setUser({ uid: acc.studentUid || acc.id });
          setUserProfile({
            uid: acc.studentUid || acc.id,
            displayName: acc.displayName || acc.username,
            username: acc.username,
            role: 'siswa',
            guruId: acc.guruId,
            classId: acc.classId,
            avatarEmoji: 'ST',
            createdAt: acc.createdAt || Date.now(),
            lastLogin: Date.now(),
          });
          return;
        }
        throw new Error(
          'Username atau password salah. Pastikan Anda menggunakan akun demo yang tersedia.',
        );
      }

      const credential = await signInWithEmailAndPassword(
        auth,
        studentEmailFromUsername(username),
        password,
      );

      // Firebase Auth verifies the password before the profile is read.
      // Students can therefore never enumerate the accounts collection.
      // Race getDoc against a timeout to prevent hanging when Firestore
      // persistence hasn't established a connection yet.
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Koneksi ke database terlalu lama. Coba lagi.')), 8000)
      );

      let profileSnap;
      try {
        profileSnap = await Promise.race([
          getDoc(doc(db, 'users', credential.user.uid)),
          timeoutPromise,
        ]);
      } catch (err: unknown) {
        safeLog('error', 'AuthContext.loginStudent.getProfile', err);
        // Don't sign out – user is authenticated, profile will load via onAuthStateChanged
        const msg = err instanceof Error ? err.message : 'Gagal memuat profil.';
        throw new Error(msg);
      }

      if (!profileSnap.exists() || profileSnap.data().role !== 'siswa') {
        await signOut(auth);
        throw new Error('Akun siswa tidak ditemukan. Hubungi guru.');
      }

      setUserProfile(profileSnap.data() as UserProfile);

      try {
        await updateDoc(doc(db, 'users', credential.user.uid), {
          lastLogin: Date.now(),
        });
      } catch (err: unknown) {
        safeLog('error', 'AuthContext.loginStudent.updateLastLogin', err);
      }
    },
    [],
  );

  /* ---------- Guru registration ---------- */
  const registerGuru = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!auth || !db) {
        throw new Error(
          'Pendaftaran guru memerlukan koneksi Firebase. Pastikan VITE_DEMO_MODE=false dan konfigurasi Firebase terisi di .env.',
        );
      }

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = credential.user.uid;

      const profile: UserProfile = {
        uid,
        displayName,
        email,
        role: 'guru',
        avatarEmoji: 'GR',
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };

      try {
        await setDoc(doc(db, 'users', uid), profile);
      } catch (err: unknown) {
        safeLog('error', 'AuthContext.registerGuru.setProfile', err);
        throw new Error('Akun dibuat tapi gagal menyimpan profil.');
      }
    },
    [],
  );

  /* ---------- Guru password reset ---------- */
  const resetGuruPassword = useCallback(async (email: string) => {
    if (!auth) {
      throw new Error(
        'Reset password memerlukan koneksi Firebase. Fitur ini tidak tersedia di Mode Demo.',
      );
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  /* ---------- Logout ---------- */
  const logout = useCallback(async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err: unknown) {
        safeLog('error', 'AuthContext.logout', err);
      }
    }
    setUser(null);
    setUserProfile(null);
  }, []);

  /* ---------- Value ---------- */
  const value: AuthContextValue = {
    user,
    userProfile,
    loading,
    isDemo,
    login,
    loginStudent,
    registerGuru,
    resetGuruPassword,
    logout,
    loginDemoGuru,
    loginDemoSiswa,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
