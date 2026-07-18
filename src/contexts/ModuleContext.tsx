// ──────────────────────────────────────────────────────────
// SiberCerdas – Module & Topic Context
// ──────────────────────────────────────────────────────────
// Manages custom topics (learning materials) added/edited by teachers.
// Supports both live Firestore and Demo Mode (localStorage).
// Overrides default static topics when matching IDs are found.
// ──────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { topicModules as DEFAULT_TOPICS } from '../data/modules';
import type { Topic } from '../types';
import { safeLog } from '../lib/safeLog';

interface ModuleContextValue {
  topics: Topic[];
  loading: boolean;
  saveTopic: (topic: Topic) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextValue | null>(null);

export function useModules(): ModuleContextValue {
  const ctx = useContext(ModuleContext);
  if (!ctx) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return ctx;
}

export function ModuleProvider({ children }: { children: ReactNode }) {
  const { user, userProfile, isDemo } = useAuth();
  const [topics, setTopics] = useState<Topic[]>(DEFAULT_TOPICS);
  const [loading, setLoading] = useState(true);

  // Determine which guruId to use (teacher's own UID, or student's teacher's UID)
  const getTargetGuruId = useCallback((): string => {
    if (!user) return 'demo-guru-001';
    if (userProfile?.role === 'guru') {
      return user.uid;
    }
    return userProfile?.guruId || 'demo-guru-001';
  }, [user, userProfile]);

  const guruId = getTargetGuruId();

  // Load custom topics
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);

    if (isDemo || !db) {
      // Demo Mode / Local Storage fallback
      try {
        const localData = localStorage.getItem(`sibercerdas_custom_topics_${guruId}`);
        if (localData) {
          const parsed: Topic[] = JSON.parse(localData);
          // Safety cleanup: filter out custom overrides that are empty or have fewer than 5 steps
          const validList = parsed.filter((t) => {
            const isDefaultId = DEFAULT_TOPICS.some((dt) => dt.id === t.id);
            if (isDefaultId && (!t.steps || t.steps.length < 5)) {
              return false;
            }
            return true;
          });
          if (validList.length !== parsed.length) {
            console.info("Membersihkan data kustomisasi topik bawaan yang tidak lengkap dari localStorage.");
            localStorage.setItem(`sibercerdas_custom_topics_${guruId}`, JSON.stringify(validList));
          }
          setTopics(combineTopics(validList));
        } else {
          setTopics(DEFAULT_TOPICS);
        }
      } catch (err) {
        console.error('Failed to parse local custom topics:', err);
        setTopics(DEFAULT_TOPICS);
      }
      setLoading(false);
    } else {
      // Firebase Firestore live subscription
      try {
        const q = query(
          collection(db!, 'custom_topics'),
          where('guruId', '==', guruId)
        );

        unsubscribe = onSnapshot(
          q,
          (snap: any) => {
            const list: Topic[] = [];
            snap.forEach((docSnap: any) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as Topic);
            });
            setTopics(combineTopics(list));
            setLoading(false);
          },
          (err: any) => {
            safeLog('error', 'Failed to subscribe to custom_topics', err);
            setTopics(DEFAULT_TOPICS);
            setLoading(false);
          }
        );
      } catch (err) {
        safeLog('error', 'Error initializing custom_topics subscription', err);
        setTopics(DEFAULT_TOPICS);
        setLoading(false);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isDemo, guruId]);

  // Combine default topics and custom topics, overriding duplicate IDs
  const combineTopics = (customList: Topic[]): Topic[] => {
    const combinedMap = new Map<string, Topic>();
    
    // Add defaults
    DEFAULT_TOPICS.forEach((t) => combinedMap.set(t.id, t));

    // Add/overwrite with custom ones if they are valid, preserving new default fields.
    customList.forEach((t) => {
      const defaultTopic = DEFAULT_TOPICS.find((dt) => dt.id === t.id);
      const isDefaultId = Boolean(defaultTopic);
      if (isDefaultId && (!t.steps || t.steps.length < 5)) {
        console.warn(`Abaikan kustomisasi topik bawaan ${t.id} karena data langkah kosong/tidak lengkap.`);
        return;
      }
      combinedMap.set(t.id, defaultTopic ? { ...defaultTopic, ...t } : t);
    });

    // Convert back to array and sort by topic number
    return Array.from(combinedMap.values()).sort((a, b) => a.number - b.number);
  };

  // Save/Update a topic
  const saveTopic = useCallback(
    async (topic: Topic) => {
      if (isDemo || !db) {
        // Save to localStorage
        try {
          const key = `sibercerdas_custom_topics_${guruId}`;
          const localData = localStorage.getItem(key);
          let list: Topic[] = localData ? JSON.parse(localData) : [];
          
          // Remove existing version
          list = list.filter((t) => t.id !== topic.id);
          list.push(topic);
          
          localStorage.setItem(key, JSON.stringify(list));
          setTopics(combineTopics(list));
          safeLog('info', `Saved topic ${topic.id} locally`);
        } catch (err) {
          console.error('Failed to save topic locally:', err);
          throw err;
        }
      } else {
        // Save to Firestore
        try {
          await setDoc(doc(db!, 'custom_topics', topic.id), {
            ...topic,
            guruId,
            updatedAt: new Date(),
          });
          safeLog('info', `Saved topic ${topic.id} to Firestore`);
        } catch (err) {
          safeLog('error', `Failed to save topic ${topic.id} to Firestore`, err);
          throw err;
        }
      }
    },
    [isDemo, guruId]
  );

  // Delete a custom topic
  const deleteTopic = useCallback(
    async (topicId: string) => {
      // We cannot delete default topics completely, but we can restore them to default if they were overridden
      if (isDemo || !db) {
        try {
          const key = `sibercerdas_custom_topics_${guruId}`;
          const localData = localStorage.getItem(key);
          if (localData) {
            let list: Topic[] = JSON.parse(localData);
            list = list.filter((t) => t.id !== topicId);
            localStorage.setItem(key, JSON.stringify(list));
            setTopics(combineTopics(list));
            safeLog('info', `Deleted custom topic ${topicId} locally`);
          }
        } catch (err) {
          console.error('Failed to delete topic locally:', err);
          throw err;
        }
      } else {
        try {
          await deleteDoc(doc(db!, 'custom_topics', topicId));
          safeLog('info', `Deleted custom topic ${topicId} from Firestore`);
        } catch (err) {
          safeLog('error', `Failed to delete custom topic ${topicId} from Firestore`, err);
          throw err;
        }
      }
    },
    [isDemo, guruId]
  );

  // Reset all topics to default
  const resetToDefault = useCallback(async () => {
    if (isDemo || !db) {
      localStorage.removeItem(`sibercerdas_custom_topics_${guruId}`);
      setTopics(DEFAULT_TOPICS);
    } else {
      try {
        const q = query(
          collection(db!, 'custom_topics'),
          where('guruId', '==', guruId)
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(db!);
        snapshot.forEach((d: any) => {
          batch.delete(doc(db!, 'custom_topics', d.id));
        });
        await batch.commit();
        setTopics(DEFAULT_TOPICS);
      } catch (err) {
        safeLog('error', 'Failed to reset custom topics', err);
        throw err;
      }
    }
  }, [isDemo, guruId]);

  return (
    <ModuleContext.Provider
      value={{
        topics,
        loading,
        saveTopic,
        deleteTopic,
        resetToDefault,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
}
