import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
 Check,
 X,
 RefreshCw,
 Image,
 BookOpen,
 Calendar,
} from 'lucide-react';
import {
 collection,
 onSnapshot,
 query,
 where,
 orderBy,
 doc,
 updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import type { GalleryItem } from '../../types';
import {
 getDemoGalleryItems,
 approveDemoGalleryItem,
} from '../../lib/demoStore';

function safeLog(label: string, err: unknown) {
 if (err instanceof Error) console.error(`[${label}]`, err.message);
 else console.error(`[${label}] Unknown error`);
}

export default function GalleryModeration() {
 const guruId = auth?.currentUser?.uid || '';
 const [items, setItems] = useState<GalleryItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
 const [refreshTrigger, setRefreshTrigger] = useState(0);

 const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

 // Fetch gallery items
 useEffect(() => {
 setLoading(true);
 if (!db) {
 const demoItems = getDemoGalleryItems();
 setItems(demoItems);
 setLoading(false);
 return;
 }

 if (!guruId) {
 setItems([]);
 setLoading(false);
 return;
 }

 const q = query(
 collection(db, 'classGallery'),
 where('guruId', '==', guruId),
 orderBy('createdAt', 'desc'),
 );
 const unsub = onSnapshot(
 q,
 (snap) => {
 const data = snap.docs.map((d) => ({ id: d.id,...d.data() })) as GalleryItem[];
 setItems(data);
 setLoading(false);
 },
 (err) => {
 safeLog('gallery-moderation-listener', err);
 setLoading(false);
 }
 );

 return unsub;
 }, [guruId, refreshTrigger]);

 const handleApprove = async (id: string) => {
 try {
 if (!db) {
 approveDemoGalleryItem(id, 'approved');
 triggerRefresh();
 } else {
 await updateDoc(doc(db, 'classGallery', id), {
 status: 'approved',
 });
 }
 } catch (err) {
 safeLog('approve-item', err);
 alert('Gagal menyetujui karya.');
 }
 };

 const handleReject = async (id: string) => {
 try {
 if (!db) {
 approveDemoGalleryItem(id, 'rejected');
 triggerRefresh();
 } else {
 await updateDoc(doc(db, 'classGallery', id), {
 status: 'rejected',
 });
 }
 } catch (err) {
 safeLog('reject-item', err);
 alert('Gagal menolak karya.');
 }
 };

 // Filtered items
 const filteredItems = items.filter((item) => {
 const status = item.status || 'pending';
 return status === filterStatus;
 });

 const formatDate = (ts: any) => {
 if (!ts) return '-';
 const ms = typeof ts === 'number'? ts: (ts.toMillis? ts.toMillis(): Date.now());
 return new Date(ms).toLocaleString('id-ID', {
 day: '2-digit',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 });
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center h-64">
 <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {/* Tab Filter Status */}
 <div className="flex gap-2 border-b border-gray-200 pb-2">
 <button
 onClick={() => setFilterStatus('pending')}
 className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
 filterStatus === 'pending'
? 'bg-warning-500 text-white shadow-sm'
: 'text-gray-500 hover:bg-gray-100'
 }`}
 >
 Menunggu Persetujuan ({items.filter((i) => (i.status || 'pending') === 'pending').length})
 </button>
 <button
 onClick={() => setFilterStatus('approved')}
 className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
 filterStatus === 'approved'
? 'bg-success-500 text-white shadow-sm'
: 'text-gray-500 hover:bg-gray-100'
 }`}
 >
 Telah Disetujui ({items.filter((i) => i.status === 'approved').length})
 </button>
 <button
 onClick={() => setFilterStatus('rejected')}
 className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
 filterStatus === 'rejected'
? 'bg-danger-500 text-white shadow-sm'
: 'text-gray-500 hover:bg-gray-100'
 }`}
 >
 Ditolak ({items.filter((i) => i.status === 'rejected').length})
 </button>
 </div>

 {/* Grid Karya Siswa */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {filteredItems.map((item) => (
 <motion.div
 key={item.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card flex flex-col justify-between space-y-4"
 >
 <div className="space-y-3">
 {/* Header Info */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2.5">
 <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-lg">
 {item.avatar || ''}
 </div>
 <div>
 <h4 className="font-display font-semibold text-sm text-surface-800">
 {item.displayName || item.studentName || 'Siswa'}
 </h4>
 <p className="text-[10px] text-gray-400 flex items-center gap-1">
 <Calendar size={10} />
 {formatDate(item.createdAt || item.sharedAt)}
 </p>
 </div>
 </div>

 <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-100">
 <BookOpen size={10} />
 {item.topicTitle}
 </span>
 </div>

 {/* Karya Content */}
 <div className="bg-surface-50 rounded-xl p-4 border border-gray-100/60 space-y-3">
    {item.mediaType === 'image' && item.imageUrl && (
      <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center">
        <img src={item.imageUrl} alt="Poster" className="w-full h-full object-cover" />
      </div>
    )}
    {item.mediaType === 'video' && item.videoUrl && (
      <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-black flex items-center justify-center">
        <video src={item.videoUrl} controls className="w-full h-full object-contain" />
      </div>
    )}
    {item.campaignTitle && (
      <h5 className="text-sm font-bold text-gray-800 mb-1">📢 {item.campaignTitle}</h5>
    )}
    <p className="text-sm text-gray-700 leading-relaxed italic">
    "{item.content}"
    </p>
    {item.workLink && (
      <div className="mt-2 pt-2 border-t border-gray-200/50">
        <a 
          href={item.workLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold rounded-xl border border-violet-100 transition-colors"
        >
          🔗 Buka Link Karya
        </a>
      </div>
    )}
  </div>
 </div>

 {/* Tombol Aksi */}
 {filterStatus === 'pending' && (
 <div className="flex gap-2 pt-2">
 <button
 onClick={() => handleApprove(item.id)}
 className="flex-1 px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
 >
 <Check size={14} />
 Setujui
 </button>
 <button
 onClick={() => handleReject(item.id)}
 className="flex-1 px-4 py-2 bg-danger-50 hover:bg-danger-100 text-danger-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
 >
 <X size={14} />
 Tolak
 </button>
 </div>
 )}

 {filterStatus === 'approved' && (
 <div className="flex pt-2">
 <button
 onClick={() => handleReject(item.id)}
 className="w-full px-4 py-2 bg-warning-50 hover:bg-warning-100 text-warning-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
 >
 <X size={14} />
 Batalkan Persetujuan (Pindahkan ke Ditolak)
 </button>
 </div>
 )}

 {filterStatus === 'rejected' && (
 <div className="flex pt-2">
 <button
 onClick={() => handleApprove(item.id)}
 className="w-full px-4 py-2 bg-success-50 hover:bg-success-100 text-success-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
 >
 <Check size={14} />
 Pulihkan (Pindahkan ke Disetujui)
 </button>
 </div>
 )}
 </motion.div>
 ))}

 {filteredItems.length === 0 && (
 <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center justify-center text-gray-400">
 <Image size={40} className="mb-2" />
 <p className="font-medium text-sm">Tidak ada karya dalam kategori ini</p>
 <p className="text-xs">Karya siswa yang diajukan akan muncul di sini untuk dimoderasi.</p>
 </div>
 )}
 </div>
 </div>
 );
}
