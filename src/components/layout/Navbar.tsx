import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, Wifi, WifiOff, RefreshCw, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
type ConnectionStatus = 'online' | 'syncing' | 'offline';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function useOnlineStatus(): ConnectionStatus {
  const [status, setStatus] = React.useState<ConnectionStatus>(
    navigator.onLine ? 'online' : 'offline',
  );

  React.useEffect(() => {
    const goOnline = () => setStatus('online');
    const goOffline = () => setStatus('offline');
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return status;
}

const statusColors: Record<ConnectionStatus, string> = {
  online: 'bg-success-400',
  syncing: 'bg-warning-400 animate-pulse',
  offline: 'bg-danger-400',
};

const statusLabels: Record<ConnectionStatus, string> = {
  online: 'Online',
  syncing: 'Menyinkronkan…',
  offline: 'Offline',
};

const roleBadgeStyles: Record<string, string> = {
  guru: 'bg-primary-50 text-primary-700 border border-primary-100',
  siswa: 'bg-accent-50 text-accent-600 border border-accent-100',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface NavbarProps {
  pageTitle?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Navbar({ pageTitle = 'Beranda' }: NavbarProps) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const status = useOnlineStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAbout = () => {
    navigate('/about');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // error already handled in context
    }
  };

  const displayName = userProfile?.displayName ?? 'Pengguna';
  const role = userProfile?.role ?? 'siswa';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SC';

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-surface-200 bg-white/95 backdrop-blur-md">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary-500 opacity-60" />

        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo SiberCerdas" className="h-8 w-auto object-contain" />
            <span className="hidden font-display text-lg font-bold text-surface-900 sm:inline">
              SiberCerdas
            </span>
          </div>

          {/* Center: Page title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-semibold text-surface-800 sm:text-base">
            {pageTitle}
          </h1>

          {/* Right: User info (desktop) */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Refresh button for student */}
            {role === 'siswa' && (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-surface-600 border border-surface-200 bg-white hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95 font-medium shadow-sm"
                title="Muat Ulang Halaman"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-hover-spin" />
                <span>Segarkan</span>
              </button>
            )}
            {/* About button */}
            <button
              onClick={handleAbout}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-surface-600 border border-surface-200 bg-white hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all active:scale-95 font-medium shadow-sm"
              title="Tentang Aplikasi"
            >
              <Info className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Tentang</span>
            </button>
            {/* Online status */}
            <div className="flex items-center gap-1.5" title={statusLabels[status]}>
              <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
              {status === 'offline' ? (
                <WifiOff className="h-3.5 w-3.5 text-danger-400" />
              ) : (
                <Wifi className="h-3.5 w-3.5 text-success-500" />
              )}
            </div>

            {/* Avatar + Name + Role */}
            <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-[11px] font-bold text-white">
                {initials}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight text-surface-800">
                  {displayName}
                </span>
                <span
                  className={`inline-block w-fit rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none ${roleBadgeStyles[role]}`}
                >
                  {role}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-surface-500 transition-colors hover:bg-danger-50 hover:text-danger-500"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Keluar</span>
            </button>
          </div>

          {/* Right: Hamburger (mobile) */}
          <div className="flex items-center gap-1 sm:hidden">
            {role === 'siswa' && (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center rounded-lg p-2 text-surface-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all active:scale-95"
                title="Muat Ulang Halaman"
                aria-label="Segarkan"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleAbout}
              className="flex items-center justify-center rounded-lg p-2 text-surface-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all active:scale-95"
              title="Tentang Aplikasi"
              aria-label="Tentang"
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center justify-center rounded-lg p-2 text-surface-700 hover:bg-primary-50 hover:text-primary-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-surface-200 bg-white/95 backdrop-blur-md sm:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
              {/* User info */}
              <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                  {initials}
                </span>
                <div>
                  <p className="font-medium text-surface-800">{displayName}</p>
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${roleBadgeStyles[role]}`}
                  >
                    {role}
                  </span>
                </div>
                {/* Status dot */}
                <div className="ml-auto flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
                  <span className="text-xs text-surface-500">{statusLabels[status]}</span>
                </div>
              </div>

              {/* About */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAbout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-surface-700 hover:bg-primary-50 hover:text-primary-600"
              >
                <Info className="h-4 w-4" />
                Tentang Aplikasi
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-danger-500 hover:bg-danger-50"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
