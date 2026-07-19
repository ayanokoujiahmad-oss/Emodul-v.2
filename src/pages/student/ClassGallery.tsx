// ============================================================
// SiberCerdas – Class Gallery Page
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  SlidersHorizontal,
  ArrowLeft,
  Share2,
  Filter,
  Heart,
  Image,
  MessageCircle,
  Palette,
  ThumbsUp,
  ExternalLink,
} from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { safeLog } from '../../lib/safeLog';
import { useAuth } from '../../hooks/useAuth';
import { useModules } from '../../contexts/ModuleContext';
import type { GalleryItem, GalleryComment, UserProfile } from '../../types';
import {
  getDemoGalleryItems,
  saveDemoGalleryItem,
  reactionDemoGallery,
  commentDemoGallery,
  logDemoActivity,
} from '../../lib/demoStore';

// ---- Sort options ----
type SortOption = 'terbaru' | 'paling_disukai';

function getInitials(name?: string) {
  return (name || 'SC')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SC';
}

// ---- Main Component ----
const ClassGallery: React.FC = () => {
  const { user, userProfile: profile } = useAuth();
  const { topics: topicModules } = useModules();

  // State
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('terbaru');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareTopic, setShareTopic] = useState(topicModules[0]?.id ?? '');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // ---- Real-time gallery listener ----
  useEffect(() => {
    if (!db) {
      const demoItems = getDemoGalleryItems();
      if (demoItems.length === 0) {
        // Pre-populate with a gorgeous sample post!
        const sample: GalleryItem = {
          id: 'demo-gal-1',
          uid: 'demo-siswa-001',
          studentUid: 'demo-siswa-001',
          displayName: 'Ahmad Cerdas',
          studentName: 'Ahmad Cerdas',
          avatar: 'AC',
          topicId: 'topik-1',
          topicTitle: 'Aku Cerdas di Dunia Digital',
          content: 'Menurut saya, membagikan nomor HP di internet sangat berbahaya karena bisa disalahgunakan oleh penipu online. Kita harus selalu melindungi privasi kita!',
          sharedAt: Date.now() - 3600000,
          createdAt: Date.now() - 3600000,
          thumbsBy: [],
          heartsBy: [],
          status: 'approved',
          appreciations: { thumbs: 4, hearts: 2, comments: 1 },
          comments: [
            {
              id: 'demo-c-1',
              uid: 'demo-siswa-002',
              displayName: 'Rini Pintar',
              avatar: 'RP',
              text: 'Keren Ahmad! Aku juga setuju sekali dengan pendapatmu.',
              createdAt: Date.now() - 1800000,
            }
          ]
        };
        saveDemoGalleryItem(sample);
        setItems([sample]);
      } else {
        setItems(demoItems);
      }
      setLoading(false);
      return;
    }

    if (!profile?.guruId) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'classGallery'),
      where('guruId', '==', profile.guruId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as GalleryItem[];
        setItems(data);
        setLoading(false);
      },
      (err) => {
        safeLog('error', 'Gallery listener error', err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [profile?.guruId, refreshTrigger]);

  // ---- Filtered + sorted items ----
  const displayItems = React.useMemo(() => {
    let filtered = items.filter((it) => it.status === 'approved');

    if (filterTopic !== 'all') {
      filtered = filtered.filter((it) => it.topicId === filterTopic);
    }

    if (sortBy === 'paling_disukai') {
      filtered = [...filtered].sort((a, b) => {
        const aTotal = (a.appreciations?.thumbs ?? 0) + (a.appreciations?.hearts ?? 0);
        const bTotal = (b.appreciations?.thumbs ?? 0) + (b.appreciations?.hearts ?? 0);
        return bTotal - aTotal;
      });
    }

    return filtered;
  }, [items, filterTopic, sortBy]);

  // ---- Appreciation handlers ----
  const handleThumb = useCallback(
    async (item: GalleryItem, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) return;

      if (!db) {
        reactionDemoGallery(item.id, user.uid, 'thumbs');
        triggerRefresh();
        // Update selected modal item live if open
        if (selectedItem && selectedItem.id === item.id) {
          const updatedItems = getDemoGalleryItems();
          const current = updatedItems.find(i => i.id === item.id);
          if (current) setSelectedItem(current);
        }
        return;
      }

      try {
        const ref = doc(db, 'classGallery', item.id);
        const hasThumb = item.thumbsBy?.includes(user.uid);

        if (hasThumb) {
          await updateDoc(ref, {
            'appreciations.thumbs': increment(-1),
            thumbsBy: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(ref, {
            'appreciations.thumbs': increment(1),
            thumbsBy: arrayUnion(user.uid),
          });
        }
      } catch (err) {
        safeLog('error', 'Failed to toggle thumb', err);
      }
    },
    [user, selectedItem],
  );

  const handleHeart = useCallback(
    async (item: GalleryItem, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) return;

      if (!db) {
        reactionDemoGallery(item.id, user.uid, 'hearts');
        triggerRefresh();
        // Update selected modal item live if open
        if (selectedItem && selectedItem.id === item.id) {
          const updatedItems = getDemoGalleryItems();
          const current = updatedItems.find(i => i.id === item.id);
          if (current) setSelectedItem(current);
        }
        return;
      }

      try {
        const ref = doc(db, 'classGallery', item.id);
        const hasHeart = item.heartsBy?.includes(user.uid);

        if (hasHeart) {
          await updateDoc(ref, {
            'appreciations.hearts': increment(-1),
            heartsBy: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(ref, {
            'appreciations.hearts': increment(1),
            heartsBy: arrayUnion(user.uid),
          });
        }
      } catch (err) {
        safeLog('error', 'Failed to toggle heart', err);
      }
    },
    [user, selectedItem],
  );

  // ---- Share own work ----
  const handleShare = useCallback(async () => {
    if (!user || !profile || !shareText.trim()) return;

    const topicData = topicModules.find((t) => t.id === shareTopic);
    const newWork = {
      uid: user.uid,
      studentUid: user.uid,
      guruId: profile.guruId || '',
      displayName: profile.displayName,
      studentName: profile.displayName,
      avatar: getInitials(profile.displayName),
      topicId: shareTopic,
      topicTitle: topicData?.title ?? 'Umum',
      content: shareText.trim(),
      stepTitle: 'Karya Siswa',
      appreciations: { thumbs: 0, hearts: 0, comments: 0 },
      thumbsBy: [],
      heartsBy: [],
      status: 'pending' as const,
    };

    try {
      if (!db) {
        saveDemoGalleryItem({
          id: `demo-gal-${Date.now()}`,
          createdAt: Date.now(),
          sharedAt: Date.now(),
          ...newWork,
        });
        logDemoActivity(
          profile.guruId || '',
          profile.displayName || 'Siswa',
          `Membagikan karya baru di Galeri Kelas untuk Topik: ${topicData?.title ?? 'Umum'}`,
          topicData?.title ?? 'Umum',
          user.uid
        );
        triggerRefresh();
      } else {
        await addDoc(collection(db, 'classGallery'), {
          ...newWork,
          createdAt: Timestamp.now(),
        });
        
        const activityLogPayload = {
          guruId: profile.guruId || '',
          studentUid: user.uid,
          studentName: profile.displayName || 'Siswa',
          action: `Membagikan karya baru di Galeri Kelas untuk Topik: ${topicData?.title ?? 'Umum'}`,
          topicTitle: topicData?.title ?? 'Umum',
        };
        await addDoc(collection(db, 'activityLog'), {
          ...activityLogPayload,
          timestamp: Timestamp.now(),
        });
      }
      setShareText('');
      setShowShareModal(false);
      safeLog('info', 'Work shared to gallery');
    } catch (err) {
      safeLog('error', 'Failed to share work', err);
    }
  }, [user, profile, shareText, shareTopic, topicModules]);

  // ---- Loading skeleton ----
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-8 bg-gray-200 rounded-xl w-48 animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-3/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ---- Header ---- */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <motion.button
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              whileTap={{ scale: 0.9 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-display font-bold text-gray-800">
                <Palette className="h-6 w-6 text-primary-500" />
                Galeri Kelas
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {displayItems.length} karya ditampilkan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <motion.button
              className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                showFilters
                  ? 'bg-primary-100 text-primary-600 border border-primary-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>

            {/* Share button */}
            <motion.button
              className="px-3 py-2 rounded-xl text-sm font-semibold bg-primary-500 text-white flex items-center gap-1.5 hover:bg-primary-600 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="w-4 h-4" />
              Bagikan Karya
            </motion.button>
          </div>
        </motion.div>

        {/* ---- Filters bar ---- */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Topic filter */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  <SlidersHorizontal className="w-3 h-3 inline mr-1" />
                  Filter Topik
                </label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none appearance-none"
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                >
                  <option value="all">Semua Topik</option>
                  {topicModules.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Urutkan
                </label>
                <select
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none appearance-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="paling_disukai">Paling Disukai</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Gallery Grid ---- */}
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
              <Image className="h-7 w-7" />
            </div>
            <p className="text-gray-400 font-medium">
              Belum ada karya yang dibagikan. Jadilah yang pertama!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayItems.map((item, idx) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.06, 0.6) }}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="p-5">
                  {/* Author row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700">
                      {getInitials(item.displayName)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.displayName}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{item.topicTitle}</p>
                    </div>
                  </div>

                  {/* Campaign Title if exists */}
                  {item.campaignTitle && (
                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                      📢 {item.campaignTitle}
                    </h3>
                  )}

                  {/* Content excerpt */}
                  <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-3">
                    {item.content}
                  </p>

                  {/* Work Link if exists */}
                  {item.workLink && (
                    <div className="mb-3">
                      <a 
                        href={item.workLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-[11px] font-bold rounded-xl border border-violet-100 transition-colors text-violet-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-violet-500" />
                        Buka Link Karya
                      </a>
                    </div>
                  )}

                  {/* Media Preview inside card */}
                  {item.mediaType === 'image' && item.imageUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
                      <img src={item.imageUrl} alt="Karya poster" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                  )}
                  {item.mediaType === 'video' && item.videoUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-150 aspect-video bg-slate-950 flex items-center justify-center relative">
                      <video src={item.videoUrl} className="w-full h-full object-contain" muted playsInline />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="p-2 bg-white/95 rounded-xl shadow-sm text-primary-600 text-[10px] font-bold flex items-center gap-1">▶ Putar Video</span>
                      </div>
                    </div>
                  )}

                  {/* Appreciation buttons */}
                  <div className="flex items-center gap-1">
                    <AppreciationButton
                      icon={<ThumbsUp className="h-3.5 w-3.5" />}
                      label="Jempol"
                      count={item.appreciations?.thumbs ?? 0}
                      active={item.thumbsBy?.includes(user?.uid ?? '') ?? false}
                      onClick={(e) => handleThumb(item, e)}
                    />
                    <AppreciationButton
                      icon={<Heart className="h-3.5 w-3.5" />}
                      label="Hati"
                      count={item.appreciations?.hearts ?? 0}
                      active={item.heartsBy?.includes(user?.uid ?? '') ?? false}
                      onClick={(e) => handleHeart(item, e)}
                    />
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-gray-400">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{item.appreciations?.comments ?? 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ---- Detail / Comment Modal ---- */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            userId={user?.uid ?? ''}
            profile={profile}
            onClose={() => setSelectedItem(null)}
            onThumb={(e) => handleThumb(selectedItem, e)}
            onHeart={(e) => handleHeart(selectedItem, e)}
            onComment={() => {
              triggerRefresh();
              const updatedItems = getDemoGalleryItems();
              const current = updatedItems.find((i) => i.id === selectedItem.id);
              if (current) setSelectedItem(current);
            }}
          />
        )}
      </AnimatePresence>

      {/* ---- Share Modal ---- */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-display font-bold text-gray-800">
                  <Share2 className="h-5 w-5 text-primary-500" />
                  Bagikan Karyamu
                </h3>
                <button
                  className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                  onClick={() => setShowShareModal(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Topic selector */}
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Topik</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm mb-4 focus:border-primary-400 outline-none appearance-none"
                value={shareTopic}
                onChange={(e) => setShareTopic(e.target.value)}
              >
                {topicModules.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>

              {/* Content */}
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Karya / Jawaban Terbaikmu</label>
              <textarea
                className="w-full h-32 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                placeholder="Tulis karyamu di sini..."
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
              />

              <motion.button
                className="w-full mt-4 py-3 bg-primary-500 text-white font-display font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.97 }}
                disabled={!shareText.trim()}
                onClick={handleShare}
              >
                Bagikan ke Galeri
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- Appreciation Button ----
interface AppBtnProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const AppreciationButton: React.FC<AppBtnProps> = ({ icon, count, active, onClick }) => (
  <motion.button
    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
      active
        ? 'bg-primary-100 text-primary-600 border border-primary-200'
        : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
    }`}
    whileTap={{ scale: 1.2 }}
    onClick={onClick}
  >
    <motion.span
      key={count}
      className="inline-flex items-center"
      initial={{ scale: 1.4 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500 }}
    >
      {icon}
    </motion.span>
    <span>{count}</span>
  </motion.button>
);

// ---- Detail Modal with Comments ----
interface DetailModalProps {
  item: GalleryItem;
  userId: string;
  profile: UserProfile | null;
  onClose: () => void;
  onThumb: (e: React.MouseEvent) => void;
  onHeart: (e: React.MouseEvent) => void;
  onComment?: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  item,
  userId,
  profile,
  onClose,
  onThumb,
  onHeart,
  onComment,
}) => {
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Listen to comments
  useEffect(() => {
    if (!db) {
      setComments(item.comments ?? []);
      return;
    }

    const q = query(
      collection(db, 'classGallery', item.id, 'comments'),
      orderBy('createdAt', 'asc'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setComments(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryComment)),
        );
      },
      (err) => {
        safeLog('error', 'Comments listener error', err);
      },
    );

    return () => unsub();
  }, [item.id, item.comments]);

  // Scroll to bottom when new comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !userId || !profile) return;
    setSending(true);

    try {
      if (!db) {
        const commentData = {
          id: `demo-c-${Date.now()}`,
          galleryItemId: item.id,
          uid: userId,
          displayName: profile.displayName,
          avatar: getInitials(profile.displayName),
          text: newComment.trim(),
          createdAt: Date.now(),
        };
        commentDemoGallery(item.id, commentData);
        if (onComment) {
          onComment();
        } else {
          setComments((prev) => [...prev, commentData]);
        }
        setNewComment('');
      } else {
        await addDoc(collection(db, 'classGallery', item.id, 'comments'), {
          galleryItemId: item.id,
          uid: userId,
          displayName: profile.displayName,
          avatar: getInitials(profile.displayName),
          text: newComment.trim(),
          createdAt: Timestamp.now(),
        });

        // Update comment count on parent
        await updateDoc(doc(db, 'classGallery', item.id), {
          'appreciations.comments': increment(1),
        });

        setNewComment('');
      }
    } catch (err) {
      safeLog('error', 'Failed to send comment', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[11px] font-bold text-primary-700">
              {getInitials(item.displayName)}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.displayName}</p>
              <p className="text-[10px] text-gray-400">{item.topicTitle}</p>
            </div>
          </div>
          <button
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 border-b border-gray-100 max-h-[60vh] overflow-y-auto">
          {item.mediaType === 'image' && item.imageUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-gray-150 bg-gray-50 max-h-[300px] flex items-center justify-center">
              <img src={item.imageUrl} alt="Karya poster" className="max-h-[300px] w-auto object-contain" loading="lazy" decoding="async" />
            </div>
          )}
          {item.mediaType === 'video' && item.videoUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-gray-150 bg-black flex items-center justify-center">
              <video src={item.videoUrl} controls className="w-full max-h-[300px]" />
            </div>
          )}
          {item.campaignTitle && (
            <h4 className="text-base font-bold text-gray-800 mb-2">
              📢 {item.campaignTitle}
            </h4>
          )}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {item.content}
          </p>
          {item.workLink && (
            <div className="mt-4">
              <a 
                href={item.workLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md transition-all w-fit"
              >
                <ExternalLink className="h-4 w-4" />
                Lihat Karya Kampanye (Buka Link)
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 mt-4">
            <AppreciationButton
              icon={<ThumbsUp className="h-3.5 w-3.5" />}
              label="Jempol"
              count={item.appreciations?.thumbs ?? 0}
              active={item.thumbsBy?.includes(userId) ?? false}
              onClick={onThumb}
            />
            <AppreciationButton
              icon={<Heart className="h-3.5 w-3.5" />}
              label="Hati"
              count={item.appreciations?.hearts ?? 0}
              active={item.heartsBy?.includes(userId) ?? false}
              onClick={onHeart}
            />
          </div>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <MessageCircle className="h-3.5 w-3.5" />
            Komentar ({comments.length})
          </p>
          {comments.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">
              Belum ada komentar. Jadilah yang pertama.
            </p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-100 text-[10px] font-bold text-surface-600">
                {getInitials(c.displayName)}
              </span>
              <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-gray-700">{c.displayName}</p>
                <p className="text-xs text-gray-600 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment input */}
        <div className="p-4 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
            placeholder="Tulis komentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSendComment();
              }
            }}
          />
          <motion.button
            className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
            whileTap={{ scale: 0.9 }}
            disabled={!newComment.trim() || sending}
            onClick={handleSendComment}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClassGallery;
