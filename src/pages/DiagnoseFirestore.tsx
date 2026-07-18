import { useState } from 'react';
import { app, db, auth, isFirebaseConfigured } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function DiagnoseFirestore() {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  function log(message: string) {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(`[DIAGNOSE] ${message}`);
  }

  async function startDiagnosis() {
    setLogs([]);
    setRunning(true);
    log('Mulai diagnosis koneksi Firebase...');
    log(`Configured: ${isFirebaseConfigured}`);

    // Print Firebase Config (API key masked)
    log(`Firebase Config loaded:`);
    if (app) {
      log(`- apiKey: ${app.options.apiKey ? app.options.apiKey.substring(0, 6) + '...' + app.options.apiKey.substring(app.options.apiKey.length - 4) : '(empty)'}`);
      log(`- authDomain: ${app.options.authDomain || '(empty)'}`);
      log(`- projectId: ${app.options.projectId || '(empty)'}`);
      log(`- storageBucket: ${app.options.storageBucket || '(empty)'}`);
      log(`- messagingSenderId: ${app.options.messagingSenderId || '(empty)'}`);
      log(`- appId: ${app.options.appId || '(empty)'}`);
    } else {
      log('- Firebase App instance is null');
    }

    if (typeof window !== 'undefined') {
      log(`Window location: ${window.location.href}`);
      log(`User agent: ${navigator.userAgent}`);
    }

    // 1. Verify credentials loaded
    const projectId = db ? (db as any)._databaseId?.projectId || 'Not accessible' : 'Null db';
    log(`Firestore Project ID dari instance: ${projectId}`);

    // 2. Auth Test
    log('Menguji Firebase Auth...');
    try {
      const email = 'siswa-uji-1@murid96.com';
      const password = 'siswa123';
      log(`Mencoba login ke Auth dengan email: ${email}`);
      
      if (!auth) {
        throw new Error('Auth instance null');
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      log(`✅ Auth Login Sukses! UID: ${cred.user.uid}`);

      // 3. Firestore Read Test
      log('Menguji Firestore Read...');
      const start = performance.now();
      if (!db) {
        throw new Error('Firestore DB instance null');
      }

      log('Melakukan getDoc(doc(db, "settings", "test-id"))...');
      
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT: getDoc tidak merespon setelah 8 detik')), 8000)
      );

      const readSettingsPromise = (async () => {
        const docRef = doc(db, 'settings', 'test-id');
        const snap = await getDoc(docRef);
        log(`settings/test-id read finished. exists: ${snap.exists()}`);
        return snap;
      })();

      await Promise.race([readSettingsPromise, timeoutPromise]);
      log(`✅ settings/test-id Read Sukses!`);

      log('Melakukan getDoc(doc(db, "users", UID))...');
      
      const readPromise = (async () => {
        const docRef = doc(db, 'users', cred.user.uid);
        log(`Path dokumen: users/${cred.user.uid}`);
        const snap = await getDoc(docRef);
        log(`Snap.exists(): ${snap.exists()}`);
        if (snap.exists()) {
          log(`Data dokumen: ${JSON.stringify(snap.data())}`);
        }
        return snap;
      })();

      await Promise.race([readPromise, timeoutPromise]);
      const duration = ((performance.now() - start) / 1000).toFixed(2);
      log(`✅ Firestore Read Sukses dalam ${duration} detik!`);

    } catch (err: any) {
      log(`❌ DIAGNOSIS GAGAL: ${err.message || String(err)}`);
      if (err.stack) {
        log(`Stack trace: ${err.stack.toString()}`);
      }
      if (err.code) {
        log(`Error code: ${err.code}`);
      }
    } finally {
      setRunning(false);
      log('Diagnosis selesai.');
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-surface-200 rounded-2xl p-6 shadow-card">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Diagnostic Koneksi Firebase</h1>
        <p className="text-sm text-surface-500 mb-6">
          Halaman ini digunakan untuk menguji secara langsung apakah browser dapat terhubung ke Firebase Auth dan Firestore.
        </p>

        <button
          onClick={startDiagnosis}
          disabled={running}
          className="btn-primary w-full bg-primary-500 text-white rounded-full py-3 font-semibold mb-6 hover:bg-primary-600 disabled:opacity-60"
        >
          {running ? 'Menjalankan...' : 'Mulai Jalankan Tes'}
        </button>

        <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-xl h-96 overflow-y-auto whitespace-pre-wrap border border-surface-300">
          {logs.length === 0 ? (
            <span className="text-surface-400">Belum ada log. Klik tombol di atas untuk memulai.</span>
          ) : (
            logs.map((line, idx) => <div key={idx}>{line}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
