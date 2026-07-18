import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import GuruRegister from './components/auth/GuruRegister';
import Navbar from './components/layout/Navbar';
import OfflineIndicator from './components/common/OfflineIndicator';
import { AlertTriangle, Loader2 } from 'lucide-react';
import React, { lazy, Suspense } from 'react';

const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const TopicFlow = lazy(() => import('./pages/student/TopicFlow'));
const PrePostTest = lazy(() => import('./pages/student/PrePostTest'));
const ClassGallery = lazy(() => import('./pages/student/ClassGallery'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DiagnoseFirestore = lazy(() => import('./pages/DiagnoseFirestore'));

/* ── Error Boundary ────────────────────────────────────────────── */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
          <div className="glass-card p-8 max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-display font-bold text-surface-800 mb-2">
              Oops! Terjadi Kesalahan
            </h2>
            <p className="text-primary-600 mb-4">{this.state.message}</p>
            <button
              className="btn-primary"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.href = '/';
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Protected Route ───────────────────────────────────────────── */
function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: 'guru' | 'siswa';
}) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userProfile.role !== allowedRole) {
    const target = userProfile.role === 'guru' ? '/guru' : '/siswa';
    return (
      <Navigate
        to={target}
        replace
        state={{
          roleError: `Halaman ini hanya untuk ${allowedRole === 'guru' ? 'guru' : 'murid'}.`,
        }}
      />
    );
  }

  return <>{children}</>;
}

/* ── Page transition wrapper ───────────────────────────────────── */
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function RouteLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-primary-600">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-sm font-medium">Menyiapkan halaman...</p>
    </div>
  );
}

/* ── App ───────────────────────────────────────────────────────── */
export default function App() {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-primary-500" />
        </motion.div>
        <p className="text-primary-600 font-medium">Memuat SiberCerdas…</p>
      </div>
    );
  }

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      {user && userProfile && !isAuthPage && <Navbar />}

      <Suspense fallback={<RouteLoading />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <GuruRegister />
                </PageTransition>
              }
            />
            <Route
              path="/about"
              element={
                <PageTransition>
                  <AboutPage />
                </PageTransition>
              }
            />
            <Route
              path="/diagnose"
              element={
                <PageTransition>
                  <DiagnoseFirestore />
                </PageTransition>
              }
            />

            {/* Student routes */}
            <Route
              path="/siswa"
              element={
                <ProtectedRoute allowedRole="siswa">
                  <PageTransition>
                    <StudentDashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/topik/:topicId"
              element={
                <ProtectedRoute allowedRole="siswa">
                  <PageTransition>
                    <TopicFlow />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/pre-test"
              element={
                <ProtectedRoute allowedRole="siswa">
                  <PageTransition>
                    <PrePostTest mode="pre-test" />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/post-test"
              element={
                <ProtectedRoute allowedRole="siswa">
                  <PageTransition>
                    <PrePostTest mode="post-test" />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/siswa/galeri"
              element={
                <ProtectedRoute allowedRole="siswa">
                  <PageTransition>
                    <ClassGallery />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Teacher routes */}
            <Route
              path="/guru"
              element={
                <ProtectedRoute allowedRole="guru">
                  <PageTransition>
                    <TeacherDashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={
                user && userProfile ? (
                  <Navigate
                    to={userProfile.role === 'guru' ? '/guru' : '/siswa'}
                    replace
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
}
