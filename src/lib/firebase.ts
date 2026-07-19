// ============================================================
// SiberCerdas – Firebase Configuration
// ============================================================
// Supports DEMO MODE when no Firebase config is provided.
// Set env vars (VITE_FIREBASE_*) or create a .env file.
// ============================================================

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';

type PublicEnvKey =
  | 'VITE_DEMO_MODE'
  | 'VITE_FIREBASE_API_KEY'
  | 'VITE_FIREBASE_AUTH_DOMAIN'
  | 'VITE_FIREBASE_PROJECT_ID'
  | 'VITE_FIREBASE_STORAGE_BUCKET'
  | 'VITE_FIREBASE_MESSAGING_SENDER_ID'
  | 'VITE_FIREBASE_APP_ID';

declare global {
  interface Window {
    __SIBERCERDAS_CONFIG__?: Partial<Record<PublicEnvKey, string>>;
  }
}

const buildEnv = import.meta.env as Record<string, string | undefined>;

function readPublicEnv(key: PublicEnvKey): string {
  const runtimeConfig =
    typeof window !== 'undefined' ? window.__SIBERCERDAS_CONFIG__ : undefined;
  const value = runtimeConfig?.[key] ?? buildEnv[key] ?? '';
  return value.trim();
}

const firebaseConfig = {
  apiKey: readPublicEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readPublicEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readPublicEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readPublicEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readPublicEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readPublicEnv('VITE_FIREBASE_APP_ID'),
};

const isDemoModeForced = readPublicEnv('VITE_DEMO_MODE') === 'true';

// Check if Firebase is configured. A local demo override keeps Firebase
// credentials intact while letting the application use demo data.
export const isFirebaseConfigured = Boolean(
  !isDemoModeForced && firebaseConfig.apiKey && firebaseConfig.projectId
);

/** Diagnostic info consumed by UI badges and debugging. */
export const firebaseStatus = {
  configured: isFirebaseConfigured,
  demoForced: isDemoModeForced,
  projectId: firebaseConfig.projectId || '(tidak diset)',
  initError: null as string | null,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let studentProvisioningAuth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // A second Auth instance lets a logged-in teacher create a student
    // credential without replacing the teacher's own session.
    const studentProvisioningApp = initializeApp(firebaseConfig, 'student-provisioning');
    studentProvisioningAuth = getAuth(studentProvisioningApp);
    db = initializeFirestore(app, {});
    console.info(
      `[Firebase] ✅ Terhubung ke project: ${firebaseConfig.projectId}`,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    firebaseStatus.initError = message;
    console.error('[Firebase] ❌ Initialization failed:', message);
  }
} else {
  console.warn(
    `[SiberCerdas] ${isDemoModeForced ? 'Mode demo dipaksa melalui VITE_DEMO_MODE.' : 'Firebase belum dikonfigurasi.'} Berjalan dalam MODE DEMO.\n` +
    'Untuk mengaktifkan Firebase, buat file .env dengan:\n' +
    '  VITE_FIREBASE_API_KEY=...\n' +
    '  VITE_FIREBASE_AUTH_DOMAIN=...\n' +
    '  VITE_FIREBASE_PROJECT_ID=...\n' +
    '  VITE_FIREBASE_STORAGE_BUCKET=...\n' +
    '  VITE_FIREBASE_MESSAGING_SENDER_ID=...\n' +
    '  VITE_FIREBASE_APP_ID=...\n' +
    'Hapus VITE_DEMO_MODE=true untuk kembali memakai Firebase.'
  );
}

export { app, auth, studentProvisioningAuth, db };
export default app;
