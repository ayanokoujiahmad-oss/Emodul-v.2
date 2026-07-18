import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, UserPlus, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../lib/firebaseErrors';

export default function GuruRegister() {
 const { registerGuru, isDemo } = useAuth();
 const navigate = useNavigate();

 const [displayName, setDisplayName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState(false);

 /* ---------- Validation ---------- */
 const validate = (): string | null => {
 if (!displayName.trim()) return 'Nama lengkap wajib diisi.';
 if (displayName.trim().length < 3) return 'Nama minimal 3 karakter.';
 if (!email.trim()) return 'Email wajib diisi.';
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format email tidak valid.';
 if (!password) return 'Password wajib diisi.';
 if (password.length < 6) return 'Password minimal 6 karakter.';
 if (password!== confirmPassword) return 'Password tidak cocok.';
 return null;
 };

 /* ---------- Submit ---------- */
 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 const validationError = validate();
 if (validationError) {
 setError(validationError);
 return;
 }

 setLoading(true);
 setError('');
 try {
 await registerGuru(email.trim(), password, displayName.trim());
 setSuccess(true);
 // Redirect to login after short delay
 setTimeout(() => navigate('/login', { replace: true }), 2000);
 } catch (err: unknown) {
 setError(getFirebaseErrorMessage(err));
 } finally {
 setLoading(false);
 }
 };

 /* ---------- Success state ---------- */
 if (success) {
 return (
 <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ type: 'spring', stiffness: 300, damping: 20 }}
 className="text-center"
 >
 <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-500">
 <CheckCircle2 className="h-8 w-8" />
 </span>
 <h2 className="font-display text-2xl font-bold text-surface-900">
 Pendaftaran Berhasil!
 </h2>
 <p className="mt-2 text-sm text-surface-500">
 Mengalihkan ke halaman login…
 </p>
 </motion.div>
 </div>
 );
 }

 /* ---------- Demo mode guard ---------- */
 if (isDemo) {
  return (
   <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
    <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
     className="w-full max-w-md text-center"
    >
     <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
      <AlertTriangle className="h-8 w-8" />
     </span>
     <h2 className="font-display text-2xl font-bold text-surface-900">
      Pendaftaran Tidak Tersedia
     </h2>
     <p className="mt-3 text-sm text-surface-500">
      Pendaftaran akun guru memerlukan koneksi Firebase yang aktif.
      Saat ini aplikasi berjalan dalam <strong>Mode Demo</strong>.
     </p>
     <p className="mt-2 text-xs text-surface-400">
      Hubungi administrator untuk mengaktifkan Firebase, atau ubah{' '}
      <code className="rounded bg-surface-100 px-1.5 py-0.5 text-xs">VITE_DEMO_MODE=false</code>{' '}
      di file <code className="rounded bg-surface-100 px-1.5 py-0.5 text-xs">.env</code>.
     </p>
     <Link
      to="/login"
      className="mt-6 inline-flex items-center gap-1 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600"
     >
      <ArrowLeft className="h-4 w-4" />
      Kembali ke Login
     </Link>
    </motion.div>
   </div>
  );
 }

 /* ---------- Render ---------- */
 return (
 <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 px-4 py-8">
 {/* Background blobs */}
 <div className="pointer-events-none absolute inset-0 overflow-hidden">
 <div className="absolute left-8 top-10 h-10 w-10 rotate-6 rounded-xl border border-sticker-green/30 bg-sticker-green/15" />
 <div className="absolute right-10 top-24 h-8 w-20 -rotate-3 rounded-full border border-sticker-purple/40 bg-sticker-purple/25" />
 <div className="absolute bottom-12 left-14 h-12 w-12 -rotate-6 rounded-2xl border border-sticker-orange/30 bg-sticker-orange/10" />
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, ease: 'easeOut' }}
 className="relative z-10 w-full max-w-md"
 >
 {/* Header */}
 <div className="mb-8 text-center">
 <motion.div
 animate={{ y: [0, -10, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
 className="mb-4 inline-block"
 >
 <img src="/logo.png" alt="Logo SiberCerdas" className="h-28 w-auto object-contain drop-shadow-md sm:h-32" />
 </motion.div>

 <h1 className="font-display text-3xl font-bold text-surface-900">
 <span>
 Daftar Akun Guru
 </span>
 </h1>
 <p className="mt-2 text-sm text-surface-500">
 Bergabung dengan SiberCerdas
 </p>
 </div>

 {/* Card */}
 <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card sm:p-8">
 {/* Error */}
 {error && (
 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
 transition={{ duration: 0.4 }}
 className="mb-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-600"
 >
 {error}
 </motion.div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 {/* Display Name */}
 <div>
 <label
 htmlFor="reg-name"
 className="mb-1.5 block text-sm font-medium text-surface-800"
 >
 Nama Lengkap
 </label>
 <div className="relative">
 <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
 <input
 id="reg-name"
 type="text"
 value={displayName}
 onChange={(e) => setDisplayName(e.target.value)}
 placeholder="Nama lengkap Anda"
 autoComplete="name"
 className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
 />
 </div>
 </div>

 {/* Email */}
 <div>
 <label
 htmlFor="reg-email"
 className="mb-1.5 block text-sm font-medium text-surface-800"
 >
 Email
 </label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
 <input
 id="reg-email"
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="guru@sekolah.id"
 autoComplete="email"
 className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
 />
 </div>
 </div>

 {/* Password */}
 <div>
 <label
 htmlFor="reg-password"
 className="mb-1.5 block text-sm font-medium text-surface-800"
 >
 Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
 <input
 id="reg-password"
 type={showPassword? 'text': 'password'}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="Minimal 6 karakter"
 autoComplete="new-password"
 className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-10 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
 />
 <button
 type="button"
 onClick={() => setShowPassword((v) =>!v)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-500"
 aria-label={showPassword? 'Sembunyikan password': 'Tampilkan password'}
 >
 {showPassword? <EyeOff className="h-4 w-4" />: <Eye className="h-4 w-4" />}
 </button>
 </div>
 </div>

 {/* Confirm Password */}
 <div>
 <label
 htmlFor="reg-confirm"
 className="mb-1.5 block text-sm font-medium text-surface-800"
 >
 Konfirmasi Password
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
 <input
 id="reg-confirm"
 type={showPassword? 'text': 'password'}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 placeholder="Ketik ulang password"
 autoComplete="new-password"
 className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
 />
 </div>
 {confirmPassword && password!== confirmPassword && (
 <p className="mt-1 text-xs text-danger-500">Password tidak cocok</p>
 )}
 </div>

 {/* Submit */}
 <button
 type="submit"
 disabled={loading}
 className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {loading? (
 <Loader2 className="h-5 w-5 animate-spin" />
 ): (
 <UserPlus className="h-5 w-5" />
 )}
 {loading? 'Mendaftar…': 'Daftar Sekarang'}
 </button>
 </form>

 {/* Back to login */}
 <div className="mt-4 text-center">
 <Link
 to="/login"
 className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
 >
 <ArrowLeft className="h-4 w-4" />
 Kembali ke Login
 </Link>
 </div>
 </div>

 {/* Footer */}
 <p className="mt-6 text-center text-xs text-surface-500">
 2026 SiberCerdas · Literasi Digital Kelas 6 SD
 </p>
 </motion.div>
 </div>
 );
}
