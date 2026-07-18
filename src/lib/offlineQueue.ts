// ──────────────────────────────────────────────
// SiberCerdas – Offline Queue System
// ──────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { safeLog, extractErrorInfo } from './safeLogger';
import type { OfflineQueueItem } from '../types';

const STORAGE_KEY = 'sibercerdas_offline_queue';
const MAX_RETRIES = 3;
let cachedQueueRaw: string | null = null;
let cachedQueue: OfflineQueueItem[] = [];

/* ─────────────────────────────────────────────
   Low-level helpers
   ───────────────────────────────────────────── */

/**
 * Strip values that cannot survive a JSON round-trip
 * (functions, symbols, undefined, Firestore internal refs, etc.).
 */
function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip non-serialisable types
    if (
      typeof value === 'function' ||
      typeof value === 'symbol' ||
      typeof value === 'undefined'
    ) {
      continue;
    }

    // Skip internal Firestore converter / ref fields
    if (key.startsWith('_') || key === 'converter' || key === 'firestore') {
      continue;
    }

    if (value instanceof Date) {
      clean[key] = value.toISOString();
    } else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      clean[key] = sanitize(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      clean[key] = value.map((v) =>
        v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)
          ? sanitize(v as Record<string, unknown>)
          : v instanceof Date
            ? v.toISOString()
            : v,
      );
    } else {
      clean[key] = value;
    }
  }

  return clean;
}

/* ─────────────────────────────────────────────
   Queue CRUD (localStorage-backed)
   ───────────────────────────────────────────── */

function readQueue(): OfflineQueueItem[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      if (cachedQueueRaw === null) return cachedQueue;
      cachedQueueRaw = null;
      cachedQueue = [];
      return cachedQueue;
    }
    if (raw === cachedQueueRaw) return cachedQueue;
    cachedQueueRaw = raw;
    cachedQueue = JSON.parse(raw) as OfflineQueueItem[];
    return cachedQueue;
  } catch {
    safeLog('warn', 'Failed to read offline queue from localStorage – resetting.');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    cachedQueueRaw = null;
    cachedQueue = [];
    return cachedQueue;
  }
}

function writeQueue(items: OfflineQueueItem[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = JSON.stringify(items);
    localStorage.setItem(STORAGE_KEY, raw);
    cachedQueueRaw = raw;
    cachedQueue = items;
  } catch (err) {
    safeLog('error', 'Failed to write offline queue to localStorage', extractErrorInfo(err));
  }
}

/* ─── External-store plumbing for React 18 ─── */

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange(): void {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('offlinequeue-change', {
      detail: { pending: readQueue().length },
    }));
  }
}

function getSnapshot(): OfflineQueueItem[] {
  return readQueue();
}

function getServerSnapshot(): OfflineQueueItem[] {
  return cachedQueue;
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */

/**
 * Enqueue a Firestore write for later processing.
 * Call this instead of writing to Firestore directly when the app
 * may be offline.
 */
export function enqueue(
  collection: string,
  docId: string,
  data: Record<string, unknown>,
  operation: 'set' | 'update' = 'set',
): void {
  const item: OfflineQueueItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    collection,
    docId,
    data: sanitize(data),
    operation,
    timestamp: Date.now(),
  };

  const queue = [...readQueue(), item];
  writeQueue(queue);
  emitChange();

  safeLog('info', `Enqueued offline item [${operation}] → ${collection}/${docId}`);
}

/**
 * Flush all pending offline items to Firestore.
 * Items that fail after MAX_RETRIES are discarded with a warning.
 */
export async function processQueue(): Promise<number> {
  const queue = readQueue();
  if (queue.length === 0) return 0;

  if (!db) {
    safeLog('info', 'Firebase DB is not initialized (Demo Mode). Skipping queue processing.');
    return 0;
  }

  safeLog('info', `Processing offline queue: ${queue.length} item(s)`);

  const remaining: OfflineQueueItem[] = [];
  let processed = 0;

  for (const item of queue) {
    let success = false;
    let permanentFailure = false;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const ref = doc(db, item.collection, item.docId);

        if (item.operation === 'set') {
          await setDoc(ref, item.data, { merge: true });
        } else {
          await updateDoc(ref, item.data);
        }

        success = true;
        processed++;
        safeLog('info', `Flushed queued item → ${item.collection}/${item.docId}`);
        break;
      } catch (err) {
        const info = extractErrorInfo(err);
        safeLog(
          'warn',
          `Attempt ${attempt}/${MAX_RETRIES} failed for ${item.collection}/${item.docId}: ${info.message}`,
        );

        // If it's a permissions / not-found error, don't retry
        const isPermissionError =
          info.code === 'permission-denied' ||
          (info.message && (
            info.message.toLowerCase().includes('permission') ||
            info.message.toLowerCase().includes('insufficient')
          ));

        const isNotFoundError =
          info.code === 'not-found' ||
          (info.message && info.message.toLowerCase().includes('not-found'));

        if (isPermissionError || isNotFoundError) {
          safeLog('error', `Permanent error for ${item.collection}/${item.docId} – discarding.`, info);
          permanentFailure = true;
          break;
        }

        // Brief back-off before retry
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }
    }

    if (!success && !permanentFailure) {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  emitChange();

  safeLog(
    'info',
    `Queue processing complete: ${processed} flushed, ${remaining.length} remaining.`,
  );

  return processed;
}

/**
 * Remove all items from the queue (used for logout / testing).
 */
export function clearQueue(): void {
  writeQueue([]);
  emitChange();
  safeLog('info', 'Offline queue cleared.');
}

/**
 * Get the current number of pending items.
 */
export function pendingCount(): number {
  return readQueue().length;
}

/* ─────────────────────────────────────────────
   React Hooks
   ───────────────────────────────────────────── */

/**
 * Subscribe to the browser's online / offline status.
 * Returns `true` when the browser reports connectivity.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}

/**
 * Full-featured hook that:
 * 1. Exposes the current queue via `useSyncExternalStore`
 * 2. Auto-processes the queue when the browser comes back online
 * 3. Provides `enqueueItem` / `flush` / `clear` helpers
 */
export function useOfflineQueue() {
  const queue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isOnline = useOnlineStatus();
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  // Auto-flush when we transition from offline → online
  useEffect(() => {
    if (!isOnline) return;
    if (processingRef.current) return;
    if (queue.length === 0) return;

    let cancelled = false;
    processingRef.current = true;
    setIsProcessing(true);

    processQueue()
      .catch((err) => {
        safeLog('error', 'Auto-flush failed', extractErrorInfo(err));
      })
      .finally(() => {
        if (!cancelled) {
          processingRef.current = false;
          setIsProcessing(false);
        }
      });

    return () => {
      cancelled = true;
      processingRef.current = false;
    };
  }, [isOnline, queue.length]);

  const enqueueItem = useCallback(
    (
      collection: string,
      docId: string,
      data: Record<string, unknown>,
      operation: 'set' | 'update' = 'set',
    ) => {
      enqueue(collection, docId, data, operation);
    },
    [],
  );

  const flush = useCallback(async () => {
    if (processingRef.current) return 0;
    processingRef.current = true;
    setIsProcessing(true);
    try {
      return await processQueue();
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, []);

  return {
    /** Current pending items */
    queue,
    /** Number of pending items */
    pending: queue.length,
    /** Whether the browser reports connectivity */
    isOnline,
    /** Whether a queue flush is currently running */
    isProcessing,
    /** Enqueue a new Firestore write */
    enqueueItem,
    /** Manually flush the queue */
    flush,
    /** Clear all pending items */
    clear: clearQueue,
  };
}
