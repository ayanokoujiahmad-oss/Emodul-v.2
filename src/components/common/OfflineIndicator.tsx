import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, RefreshCw, WifiOff } from 'lucide-react';
import { useOfflineQueue } from '../../lib/offlineQueue';

export default function OfflineIndicator() {
  const { pending, isOnline, isProcessing } = useOfflineQueue();
  const [justSynced, setJustSynced] = useState(false);
  const previousPendingRef = useRef(pending);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const hadPendingItems = previousPendingRef.current > 0;
    const finishedQueue = hadPendingItems && pending === 0 && !isProcessing && isOnline;

    if (finishedQueue) {
      setJustSynced(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => setJustSynced(false), 3000);
    }

    if (!isOnline || pending > 0 || isProcessing) {
      setJustSynced(false);
    }

    previousPendingRef.current = pending;
  }, [isOnline, isProcessing, pending]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const syncing = isOnline && (isProcessing || pending > 0);
  const showBanner = !isOnline || syncing || justSynced;
  const syncingMessage = pending > 0
    ? `Menyinkronkan ${pending} perubahan tertunda...`
    : 'Menyinkronkan perubahan tertunda...';

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`relative z-[60] flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
            justSynced
              ? 'bg-success-50 text-success-700'
              : syncing
                ? 'bg-warning-50 text-warning-700'
                : 'bg-warning-100 text-warning-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {justSynced ? (
            <CheckCircle2 className="h-4 w-4 text-success-500" />
          ) : syncing ? (
            <RefreshCw className="h-4 w-4 animate-spin text-warning-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-warning-600" />
          )}

          {justSynced ? (
            <span>Semua perubahan tertunda sudah terkirim.</span>
          ) : syncing ? (
            <span>{syncingMessage}</span>
          ) : (
            <span>
              Mode offline - jawaban akan dikirim otomatis saat koneksi pulih
              {pending > 0 && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-warning-200 px-2 py-0.5 text-xs font-bold text-warning-800">
                  {pending} tertunda
                </span>
              )}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
