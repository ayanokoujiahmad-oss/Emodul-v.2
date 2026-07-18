import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Gamepad2,
    GraduationCap,
    Shield,
    Rocket,
    Eye,
    EyeOff,
    Loader2,
    User,
    Mail,
    Lock,
    Info,
    X,
    CheckCircle2,
    Wifi,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from '../../lib/firebaseErrors';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */
type TabKey = 'siswa' | 'guru';

/* ------------------------------------------------------------------ */
/* Login Page */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
    const {
        login,
        loginStudent,
        isDemo,
        loginDemoGuru,
        loginDemoSiswa,
        resetGuruPassword,
    } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<TabKey>('siswa');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAbout, setShowAbout] = useState(false);

    // Siswa fields
    const [username, setUsername] = useState('');
    const [studentPassword, setStudentPassword] = useState('');

    // Guru fields
    const [email, setEmail] = useState('');
    const [guruPassword, setGuruPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Lupa Password modal
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');

    /* ---------- Modal accessibility (focus + ESC + restore) ---------- */
    const aboutTriggerRef = useRef<HTMLButtonElement | null>(null);
    const aboutCloseRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!showAbout) return;
        // Pindahkan fokus ke tombol tutup di dalam modal
        aboutCloseRef.current?.focus();

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowAbout(false);
        };
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('keydown', handleKey);
            // Kembalikan fokus ke tombol pemicu
            aboutTriggerRef.current?.focus();
        };
    }, [showAbout]);

    /* ---------- Handlers ---------- */
    const handleSiswaLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !studentPassword) {
            setError('Isi username dan password ya!');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await loginStudent(username, studentPassword);
            navigate('/siswa', { replace: true });
        } catch (err: unknown) {
            setError(getFirebaseErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGuruLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !guruPassword) {
            setError('Isi email dan password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(email, guruPassword);
            navigate('/guru', { replace: true });
        } catch (err: unknown) {
            setError(getFirebaseErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail.trim()) {
            setResetError('Masukkan email Anda.');
            return;
        }
        setResetLoading(true);
        setResetError('');
        try {
            await resetGuruPassword(resetEmail.trim());
            setResetSuccess(true);
        } catch (err: unknown) {
            setResetError(getFirebaseErrorMessage(err));
        } finally {
            setResetLoading(false);
        }
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetError('');
        setResetSuccess(false);
    };

    const clearOnTabSwitch = (tab: TabKey) => {
        setActiveTab(tab);
        setError('');
    };

    /* ---------- Render ---------- */
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 px-4 py-8">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-8 top-10 h-10 w-10 rotate-6 rounded-xl border border-sticker-purple/40 bg-sticker-purple/30" />
                <div className="absolute right-10 top-24 h-8 w-20 -rotate-3 rounded-full border border-sticker-teal/30 bg-sticker-teal/15" />
                <div className="absolute bottom-16 left-12 h-12 w-12 -rotate-6 rounded-2xl border border-sticker-orange/30 bg-sticker-orange/10" />
                <div className="absolute bottom-10 right-8 h-9 w-9 rotate-12 rounded-xl border border-sticker-pink/30 bg-sticker-pink/15" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    {/* Floating mascot */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="mb-4 inline-block"
                    >
                        <img src="/logo.png" alt="Logo SiberCerdas" className="h-28 w-auto object-contain drop-shadow-md sm:h-32" />
                    </motion.div>

                    <h1 className="font-display text-4xl font-bold text-surface-900">
                        <span>
                            SiberCerdas
                        </span>
                    </h1>
                    <p className="mt-2 font-sans text-sm text-surface-500">
                        Petualangan Literasi Digital untuk Generasi Cerdas
                    </p>
                </div>

                {/* Firebase Status Badge */}
                {!isDemo ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 flex items-center justify-center gap-2 rounded-full border border-success-200 bg-success-50 px-4 py-2 text-xs font-semibold text-success-700"
                    >
                        <Wifi className="h-3.5 w-3.5" />
                        <span>Terhubung ke Firebase</span>
                        <span className="h-2 w-2 rounded-full bg-success-400 animate-pulse" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-4 flex items-center justify-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700"
                    >
                        <Gamepad2 className="h-3.5 w-3.5" />
                        <span>Mode Demo — Data hanya disimpan lokal</span>
                    </motion.div>
                )}

                {/* Card */}
                <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-card sm:p-8">
                    {/* Tabs */}
                    <div className="relative mb-6 flex rounded-xl border border-surface-200 bg-surface-50 p-1">
                        {(['siswa', 'guru'] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => clearOnTabSwitch(tab)}
                                className={`relative z-10 flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${activeTab === tab
                                        ? 'text-white'
                                        : 'text-surface-500 hover:text-primary-600'
                                    }`}
                            >
                                <span className="inline-flex items-center justify-center gap-1.5">
                                    {tab === 'siswa' ? (
                                        <GraduationCap className="h-4 w-4" />
                                    ) : (
                                        <Shield className="h-4 w-4" />
                                    )}
                                    {tab === 'siswa' ? 'Murid' : 'Guru'}
                                </span>
                            </button>
                        ))}
                        {/* Sliding indicator */}
                        <motion.div
                            className="absolute inset-y-1 z-0 w-[calc(50%-4px)] rounded-lg bg-primary-500 shadow-card"
                            animate={{ x: activeTab === 'siswa' ? 4 : 'calc(100% + 4px)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                    </div>

                    {/* Error message */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                role="alert"
                                aria-live="assertive"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: 1,
                                    x: [0, -6, 6, -4, 4, 0],
                                }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="mb-4 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-600"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'siswa' ? (
                            <motion.form
                                key="siswa"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSiswaLogin}
                                className="space-y-4"
                            >
                                {/* Username */}
                                <div>
                                    <label
                                        htmlFor="student-username"
                                        className="mb-1.5 block text-sm font-medium text-surface-800"
                                    >
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                                        <input
                                            id="student-username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Ketik username kamu"
                                            autoComplete="username"
                                            className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="student-password"
                                        className="mb-1.5 block text-sm font-medium text-surface-800"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                                        <input
                                            id="student-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={studentPassword}
                                            onChange={(e) => setStudentPassword(e.target.value)}
                                            placeholder="Ketik password kamu"
                                            autoComplete="current-password"
                                            className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-10 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-500"
                                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Rocket className="h-5 w-5" />
                                    )}
                                    {loading ? 'Masuk…' : 'Mulai Petualangan'}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="guru"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleGuruLogin}
                                className="space-y-4"
                            >
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="guru-email"
                                        className="mb-1.5 block text-sm font-medium text-surface-800"
                                    >
                                        Username atau Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                                        <input
                                            id="guru-email"
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Ketik username atau email Anda"
                                            autoComplete="username"
                                            className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="guru-password"
                                        className="mb-1.5 block text-sm font-medium text-surface-800"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                                        <input
                                            id="guru-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={guruPassword}
                                            onChange={(e) => setGuruPassword(e.target.value)}
                                            placeholder="Password Anda"
                                            autoComplete="current-password"
                                            className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-10 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-500"
                                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Shield className="h-5 w-5" />
                                    )}
                                    {loading ? 'Masuk…' : 'Masuk sebagai Guru'}
                                </button>

                                {/* Forgot password + Register links */}
                                <div className="space-y-2 text-center text-sm text-surface-500">
                                    {/* Lupa Password — only when Firebase is active */}
                                    {!isDemo && (
                                        <p>
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPassword(true)}
                                                className="font-semibold text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700"
                                            >
                                                Lupa password?
                                            </button>
                                        </p>
                                    )}

                                    {/* Register link — only when Firebase is active */}
                                    {!isDemo && (
                                        <p>
                                            Belum punya akun?{' '}
                                            <Link
                                                to="/register"
                                                className="font-semibold text-primary-600 underline decoration-primary-300 underline-offset-2 hover:text-primary-700"
                                            >
                                                Daftar di sini
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Demo Mode Buttons — only shown in demo mode */}
                {isDemo && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
                    >
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-700">
                            <Gamepad2 className="h-4 w-4" /> Mode Demo — Jelajahi Tanpa Firebase
                        </div>
                        <p className="mb-4 text-xs text-amber-600">
                            Firebase belum dikonfigurasi. Gunakan tombol di bawah untuk menjelajahi aplikasi sebagai murid atau guru.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    loginDemoSiswa();
                                    navigate('/siswa', { replace: true });
                                }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sticker-teal py-3 text-sm font-semibold text-white shadow-card transition-all hover:brightness-95"
                            >
                                <GraduationCap className="h-4 w-4" />
                                Masuk Murid Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    loginDemoGuru();
                                    navigate('/guru', { replace: true });
                                }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-500 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600"
                            >
                                <Shield className="h-4 w-4" />
                                Masuk Guru Demo
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* About developer button */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        ref={aboutTriggerRef}
                        onClick={() => setShowAbout(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-surface-200 bg-white px-4 py-2 text-xs font-semibold text-primary-600 shadow-card transition-all hover:border-primary-200 hover:bg-primary-50"
                    >
                        <Info className="h-4 w-4" />
                        Tentang Developer
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-4 text-center text-xs text-surface-500">
                    2026 SiberCerdas · Literasi Digital Kelas 6 SD
                </p>
            </motion.div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotPassword && (
                    <motion.div
                        key="forgot-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeForgotPassword}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            key="forgot-card"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="forgot-password-title"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={closeForgotPassword}
                                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-600 shadow-card transition-colors hover:bg-primary-50"
                                aria-label="Tutup"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Title */}
                            <div className="bg-primary-500 px-6 py-4">
                                <h2 id="forgot-password-title" className="font-display text-lg font-bold text-white">
                                    Lupa Password?
                                </h2>
                                <p className="mt-1 text-xs text-primary-100">
                                    Masukkan email Anda untuk menerima link reset password.
                                </p>
                            </div>

                            <div className="p-6">
                                {resetSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center"
                                    >
                                        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-500">
                                            <CheckCircle2 className="h-7 w-7" />
                                        </span>
                                        <p className="text-sm font-semibold text-surface-800">
                                            Link reset telah dikirim!
                                        </p>
                                        <p className="mt-1 text-xs text-surface-500">
                                            Periksa email <strong>{resetEmail}</strong> dan ikuti petunjuk untuk mengatur ulang password Anda.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={closeForgotPassword}
                                            className="mt-4 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600"
                                        >
                                            Kembali ke Login
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleForgotPassword} className="space-y-4">
                                        {resetError && (
                                            <div className="rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 text-sm text-danger-600">
                                                {resetError}
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-surface-800">
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                                                <input
                                                    id="reset-email"
                                                    type="email"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    placeholder="Email yang terdaftar"
                                                    autoComplete="email"
                                                    className="w-full rounded-lg border border-surface-200 bg-white py-3 pl-10 pr-4 text-sm text-surface-800 placeholder:text-surface-300 transition-shadow focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={resetLoading}
                                            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {resetLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Mail className="h-5 w-5" />
                                            )}
                                            {resetLoading ? 'Mengirim…' : 'Kirim Link Reset'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About developer modal */}
            <AnimatePresence>
                {showAbout && (
                    <motion.div
                        key="about-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setShowAbout(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            key="about-card"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="about-developer-title"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                ref={aboutCloseRef}
                                onClick={() => setShowAbout(false)}
                                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary-600 shadow-card transition-colors hover:bg-primary-50"
                                aria-label="Tutup"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Title */}
                            <div className="bg-primary-500 px-6 py-4 text-center">
                                <h2 id="about-developer-title" className="font-display text-lg font-bold text-white">Tentang Developer</h2>
                            </div>

                            {/* Biodata image */}
                            <div className="max-h-[70vh] overflow-y-auto p-4">
                                <img
                                    src="/biodata_developer.png"
                                    alt="Biodata Developer"
                                    className="mx-auto w-full rounded-2xl"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
