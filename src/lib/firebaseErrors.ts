// ──────────────────────────────────────────────────────────
// SiberCerdas – Firebase Error Messages (Indonesian)
// ──────────────────────────────────────────────────────────
// Maps Firebase error codes to user-friendly Indonesian messages.
// Centralises error translation so every UI component can
// import `getFirebaseErrorMessage(err)` instead of repeating
// inline string-matching logic.
// ──────────────────────────────────────────────────────────

const firebaseErrorMap: Record<string, string> = {
  // ── Auth errors ──────────────────────────────────────────
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/user-not-found': 'Akun tidak ditemukan. Periksa email Anda.',
  'auth/wrong-password': 'Password salah. Coba lagi.',
  'auth/email-already-in-use': 'Email sudah terdaftar. Silakan login.',
  'auth/weak-password': 'Password terlalu lemah. Gunakan minimal 6 karakter.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit.',
  'auth/network-request-failed': 'Koneksi internet bermasalah. Periksa jaringan Anda.',
  'auth/user-disabled': 'Akun ini telah dinonaktifkan. Hubungi administrator.',
  'auth/operation-not-allowed':
    'Metode login ini belum diaktifkan. Hubungi administrator.',
  'auth/requires-recent-login':
    'Sesi telah kedaluwarsa. Silakan login ulang.',
  'auth/credential-already-in-use': 'Kredensial sudah digunakan oleh akun lain.',

  // ── Firestore errors ────────────────────────────────────
  'permission-denied': 'Anda tidak memiliki izin untuk operasi ini.',
  'not-found': 'Data tidak ditemukan.',
  'unavailable': 'Server sedang tidak tersedia. Coba lagi nanti.',
  'deadline-exceeded': 'Permintaan memakan waktu terlalu lama. Coba lagi.',
  'resource-exhausted': 'Batas penggunaan tercapai. Coba lagi nanti.',
};

/**
 * Translate a Firebase error into a user-friendly Indonesian message.
 *
 * Looks for a `.code` property first (Firebase SDK convention), then
 * falls back to substring matching in the error message.
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Firebase errors carry a `.code` property
    const code = (error as { code?: string }).code;
    if (code && firebaseErrorMap[code]) {
      return firebaseErrorMap[code];
    }

    // Fallback: match substrings in the raw message
    for (const [key, msg] of Object.entries(firebaseErrorMap)) {
      if (error.message.includes(key)) return msg;
    }

    return error.message;
  }

  return 'Terjadi kesalahan. Coba lagi.';
}
