import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { studentProvisioningAuth } from './firebase';

const STUDENT_EMAIL_DOMAIN = 'murid96.com';

export function normaliseStudentUsername(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Students still sign in with a username in the UI. Internally Firebase Auth
 * needs an email-shaped identifier; the reserved .invalid domain ensures this
 * address cannot receive mail or identify the child outside this app.
 */
export function studentEmailFromUsername(username: string): string {
  const normalised = normaliseStudentUsername(username);
  return `${normalised}@${STUDENT_EMAIL_DOMAIN}`;
}

function getProvisioningAuth() {
  if (!studentProvisioningAuth) {
    throw new Error('Firebase belum dikonfigurasi');
  }
  return studentProvisioningAuth;
}

export async function createStudentCredential(username: string, password: string): Promise<string> {
  const provisioningAuth = getProvisioningAuth();
  try {
    const credential = await createUserWithEmailAndPassword(
      provisioningAuth,
      studentEmailFromUsername(username),
      password,
    );
    return credential.user.uid;
  } finally {
    await signOut(provisioningAuth).catch(() => undefined);
  }
}

export async function resetStudentCredential(
  username: string,
  currentPassword: string,
  nextPassword: string,
): Promise<void> {
  const provisioningAuth = getProvisioningAuth();
  try {
    const credential = await signInWithEmailAndPassword(
      provisioningAuth,
      studentEmailFromUsername(username),
      currentPassword,
    );
    await updatePassword(credential.user, nextPassword);
  } finally {
    await signOut(provisioningAuth).catch(() => undefined);
  }
}

export async function deleteStudentCredential(username: string, password: string): Promise<void> {
  const provisioningAuth = getProvisioningAuth();
  try {
    const credential = await signInWithEmailAndPassword(
      provisioningAuth,
      studentEmailFromUsername(username),
      password,
    );
    await deleteUser(credential.user);
  } finally {
    await signOut(provisioningAuth).catch(() => undefined);
  }
}
