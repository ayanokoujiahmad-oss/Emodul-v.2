import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Sparkles, Image, ShieldCheck, ArrowRight, Upload } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import type { GalleryItem } from '../../../types';

interface KreatorKontenSimProps {
  onComplete: (result: {
    score: number;
    maxScore: number;
    decisions: { scenarioId: string; choice: string; isCorrect: boolean }[];
    sharedGalleryItem?: Partial<GalleryItem>;
  }) => void;
}

interface CreationStep {
  id: string;
  title: string;
  instruction: string;
  options: {
    text: string;
    points: number;
    isSafe: boolean;
    feedback: string;
    previewValue: string; // value used for mockup preview
  }[];
}

const CREATION_STEPS: CreationStep[] = [
  {
    id: 'topic',
    title: 'Langkah 1: Pilih Tema Postingan',
    instruction: 'Pilih jenis konten yang ingin kamu buat hari ini untuk dibagikan di internet:',
    options: [
      {
        text: ' Foto hasil lukisan tanganku di buku gambar.',
        previewValue: ' Menggambar Kucing Imut',
        isSafe: true,
        points: 20,
        feedback: ' Aman! Karya seni pribadi adalah materi postingan yang positif dan aman.',
      },
      {
        text: ' Video keseruan kelasku sedang belajar kelompok bersama teman-teman.',
        previewValue: ' Belajar Kelompok Seru',
        isSafe: true,
        points: 20,
        feedback: ' Aman! Berbagi kegiatan sekolah positif diperbolehkan selama tidak membocorkan identitas rahasia.',
      },
      {
        text: ' Video Room Tour kamar tidur pribadiku.',
        previewValue: ' Tour Kamar Tidurku',
        isSafe: false,
        points: 5,
        feedback: ' Kurang Aman! Menunjukkan isi kamar tidur pribadimu membocorkan area privasimu ke mata publik.',
      },
    ],
  },
  {
    id: 'caption',
    title: 'Langkah 2: Tulis Keterangan (Caption)',
    instruction: 'Pilihlah kalimat penjelasan (caption) yang aman untuk mendampingi postinganmu:',
    options: [
      {
        text: '"Seneng banget tugas kelompok hari ini dapet nilai 100! Makasih ya Andi, Sari, Budi! Semangat terus belajarnya! "',
        previewValue: '"Seneng banget tugas kelompok dapet 100! "',
        isSafe: true,
        points: 20,
        feedback: ' Sangat Aman! Mengapresiasi keberhasilan bersama tanpa membocorkan nomor kontak atau alamat sekolah.',
      },
      {
        text: '"Rumahku lagi kosong nih, ortu pergi ke Jakarta sampai besok malam. Main ke rumahku yuk guys di Perum Indah Blok C3!"',
        previewValue: '"Ortu pergi, rumah sepi. Main yuk di Perum Indah Blok C3!"',
        isSafe: false,
        points: 0,
        feedback: ' Sangat Berbahaya! Mengabarkan rumah kosong dan menulis alamat lengkap mengundang penjahat atau pencuri datang!',
      },
      {
        text: '"Selesai melukis kucing persia peliharaanku seharian. Capek tapi seru banget! Gimana gambarku? "',
        previewValue: '"Selesai melukis kucing persia peliharaanku "',
        isSafe: true,
        points: 20,
        feedback: ' Sangat Aman! Keterangan ramah dan relevan dengan karya seni yang diunggah.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Langkah 3: Atur Privasi Postingan',
    instruction: 'Siapa saja yang diperbolehkan melihat postingan digitalmu ini?',
    options: [
      {
        text: ' Publik (Siapa saja di internet bisa melihat)',
        previewValue: 'Publik ',
        isSafe: false,
        points: 5,
        feedback: ' Kurang Tepat! Untuk anak usia sekolah dasar, menyetel postingan ke publik (terbuka umum) meningkatkan risiko kontak dari orang asing berbahaya.',
      },
      {
        text: ' Hanya Teman Dekat (Hanya lingkaran teman terverifikasi yang kamu kenal)',
        previewValue: 'Teman Dekat ',
        isSafe: true,
        points: 20,
        feedback: ' Sangat Aman! Membatasi akses hanya untuk orang-orang yang kamu kenal di dunia nyata adalah perlindungan privasi terbaik.',
      },
    ],
  },
];

export default function KreatorKontenSim({ onComplete }: KreatorKontenSimProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [decisions, setDecisions] = useState<{ scenarioId: string; choice: string; isCorrect: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  // Upload artwork state variables
  const [uploadedMediaType, setUploadedMediaType] = useState<'image' | 'video'>('image');
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [preloadedSelected, setPreloadedSelected] = useState<string | null>(null);
  const [galleryCaption, setGalleryCaption] = useState('');

  // Mock post preview states
  const [previewTopic, setPreviewTopic] = useState(' Nama Postingan');
  const [previewCaption, setPreviewCaption] = useState('"Keterangan postinganmu akan tampil di sini..."');
  const [previewPrivacy, setPreviewPrivacy] = useState('Privasi ');

  const currentStep = CREATION_STEPS[currentIdx];
  const maxScore = CREATION_STEPS.reduce((sum, s) => sum + Math.max(...s.options.map((o) => o.points)), 0);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOpt(idx);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size: limit to 800KB for images, 3MB for videos
      const maxSize = uploadedMediaType === 'image' ? 800 * 1024 : 3 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          uploadedMediaType === 'image'
            ? 'Ukuran berkas gambar terlalu besar! Pilih gambar yang berukuran kurang dari 800 KB agar mudah dibagikan.'
            : 'Ukuran berkas video terlalu besar! Pilih video yang berukuran kurang dari 3 MB agar mudah dibagikan.'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedMedia(event.target.result as string);
          setPreloadedSelected(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreloaded = (url: string) => {
    setUploadedMedia(url);
    setPreloadedSelected(url);
  };

  const handleNext = () => {
    if (currentIdx < CREATION_STEPS.length) {
      if (selectedOpt === null) return;
      const opt = currentStep.options[selectedOpt];

      if (!showFeedback) {
        // Apply preview change
        if (currentStep.id === 'topic') setPreviewTopic(opt.previewValue);
        if (currentStep.id === 'caption') {
          setPreviewCaption(opt.previewValue);
          setGalleryCaption(opt.previewValue);
        }
        if (currentStep.id === 'privacy') setPreviewPrivacy(opt.previewValue);

        setScore((s) => s + opt.points);
        setDecisions((prev) => [
          ...prev,
          {
            scenarioId: currentStep.id,
            choice: opt.text,
            isCorrect: opt.isSafe,
          },
        ]);
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
        setSelectedOpt(null);
        setCurrentIdx((i) => i + 1);
      }
    } else {
      // Advance to completion screen
      setFinished(true);
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleComplete = () => {
    const sharedGalleryItem: Partial<GalleryItem> = {
      content: galleryCaption.trim() || previewCaption,
      mediaType: uploadedMediaType,
      imageUrl: uploadedMediaType === 'image' && uploadedMedia ? uploadedMedia : undefined,
      videoUrl: uploadedMediaType === 'video' && uploadedMedia ? uploadedMedia : undefined,
    };

    onComplete({
      score,
      maxScore,
      decisions,
      sharedGalleryItem,
    });
  };

  const isUploadStep = currentIdx === CREATION_STEPS.length;
  const isNextDisabled = isUploadStep ? !uploadedMedia : selectedOpt === null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-50/60 to-violet-50/60 rounded-3xl border border-primary-100 p-6 shadow-xl backdrop-blur-sm flex flex-col md:flex-row gap-6">
      
      {/* Left workspace panel */}
      <div className="flex-1 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-sm sm:text-base text-primary-700 flex items-center gap-2">
            <Sparkles className="text-primary-500 w-5 h-5 shrink-0" />
            Simulator Kreator Konten Cerdas
          </h3>
          <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-primary-100 text-primary-600">
            Skor Keamanan: {score}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {!isUploadStep ? (
                <>
                  <div className="p-4 bg-white/95 rounded-2xl border border-primary-100">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400">
                      {currentStep.title}
                    </span>
                    <p className="text-xs font-medium text-primary-800 mt-1">
                      {currentStep.instruction}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentStep.options.map((opt, idx) => {
                      let cardStyle = 'bg-white border-primary-100/60 hover:border-primary-300 text-primary-800';
                      if (selectedOpt === idx) {
                        cardStyle = 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-100 text-primary-900';
                      }
                      if (showFeedback) {
                        cardStyle = opt.isSafe 
                          ? 'border-success-400 bg-success-50/30 text-success-800' 
                          : idx === selectedOpt 
                          ? 'border-danger-400 bg-danger-50/30 text-danger-800'
                          : 'opacity-50 border-primary-100 bg-white';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={showFeedback}
                          onClick={() => handleSelect(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold leading-relaxed flex gap-3 transition-all ${cardStyle}`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            selectedOpt === idx ? 'bg-primary-500 border-primary-500 text-white' : 'border-primary-200'
                          }`}>
                            {selectedOpt === idx && <span className="text-[8px]">●</span>}
                          </div>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border text-xs flex gap-3 ${
                        currentStep.options[selectedOpt!].isSafe 
                          ? 'bg-success-50/80 border-success-100 text-success-800' 
                          : 'bg-danger-50/80 border-danger-100 text-danger-800'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {currentStep.options[selectedOpt!].isSafe ? (
                          <ShieldCheck className="w-5 h-5 text-success-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-danger-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">
                          {currentStep.options[selectedOpt!].isSafe ? 'Pilihan Sangat Aman!' : 'Peringatan Keamanan!'}
                        </p>
                        <p className="mt-1 leading-relaxed text-xs">
                          {currentStep.options[selectedOpt!].feedback}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Upload Step */
                <div className="space-y-4 text-left">
                  <div className="p-4 bg-white/95 rounded-2xl border border-primary-100">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-400">
                      Langkah 4: Unggah Karya Kampanyemu
                    </span>
                    <p className="text-xs font-medium text-primary-800 mt-1">
                      Pilih tipe media karyamu, lalu unggah poster/video buatanmu atau gunakan karya contoh yang sudah kami siapkan!
                    </p>
                  </div>

                  {/* Select Media Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedMediaType('image');
                        setUploadedMedia(null);
                        setPreloadedSelected(null);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        uploadedMediaType === 'image'
                          ? 'border-primary-500 bg-primary-50/50 text-primary-900'
                          : 'bg-white border-primary-150 hover:border-primary-300 text-primary-800'
                      }`}
                    >
                      🎨 Poster Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedMediaType('video');
                        setUploadedMedia(null);
                        setPreloadedSelected(null);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        uploadedMediaType === 'video'
                          ? 'border-primary-500 bg-primary-50/50 text-primary-900'
                          : 'bg-white border-primary-150 hover:border-primary-300 text-primary-800'
                      }`}
                    >
                      🎬 Video Kampanye
                    </button>
                  </div>

                  {/* Upload Choice */}
                  <div className="bg-white p-4 rounded-2xl border border-primary-100 space-y-4 shadow-2xs">
                    <div className="flex gap-4">
                      <label className="flex-1 p-5 border-2 border-dashed border-primary-300 hover:border-primary-500 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-primary-50/5 hover:bg-primary-50/20 transition-all text-center">
                        <Upload className="w-6 h-6 text-primary-500 animate-bounce" />
                        <span className="text-xs font-bold text-primary-800">Pilih berkas dari perangkat</span>
                        <span className="text-[10px] text-gray-400 leading-normal">
                          {uploadedMediaType === 'image' ? 'Format PNG, JPG (Maks. 800KB)' : 'Format MP4, WebM (Maks. 3MB)'}
                        </span>
                        <input
                          type="file"
                          accept={uploadedMediaType === 'image' ? 'image/*' : 'video/*'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-150"></div>
                      <span className="flex-shrink mx-3 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">atau</span>
                      <div className="flex-grow border-t border-gray-150"></div>
                    </div>

                    {/* Preloaded Options */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Gunakan karya contoh bawaan:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {uploadedMediaType === 'image' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => selectPreloaded('/gambar/topik 8/contoh poster 1.png')}
                              className={`p-2.5 rounded-xl border text-[11px] font-semibold text-left flex items-center gap-2 transition-all ${
                                preloadedSelected === '/gambar/topik 8/contoh poster 1.png'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/20'
                              }`}
                            >
                              🖼️ Poster Contoh 1
                            </button>
                            <button
                              type="button"
                              onClick={() => selectPreloaded('/gambar/topik 8/contoh poster 2.png')}
                              className={`p-2.5 rounded-xl border text-[11px] font-semibold text-left flex items-center gap-2 transition-all ${
                                preloadedSelected === '/gambar/topik 8/contoh poster 2.png'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/20'
                              }`}
                            >
                              🖼️ Poster Contoh 2
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => selectPreloaded('/gambar/topik 8/contoh video.mp4')}
                              className={`p-2.5 rounded-xl border text-[11px] font-semibold text-left flex items-center gap-2 transition-all ${
                                preloadedSelected === '/gambar/topik 8/contoh video.mp4'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/20'
                              }`}
                            >
                              📹 Video Contoh 1
                            </button>
                            <button
                              type="button"
                              onClick={() => selectPreloaded('/gambar/topik 8/video 2.mp4')}
                              className={`p-2.5 rounded-xl border text-[11px] font-semibold text-left flex items-center gap-2 transition-all ${
                                preloadedSelected === '/gambar/topik 8/video 2.mp4'
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/20'
                              }`}
                            >
                              📹 Video Contoh 2
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Refine Caption */}
                  <div className="space-y-1 bg-white p-4 rounded-2xl border border-primary-100 shadow-2xs">
                    <label className="text-[10px] font-bold text-primary-600 uppercase tracking-wide block">
                      Tulis Caption Kampanyemu (Akan Tampil di Galeri):
                    </label>
                    <textarea
                      value={galleryCaption}
                      onChange={(e) => {
                        setGalleryCaption(e.target.value);
                        setPreviewCaption(e.target.value);
                      }}
                      placeholder="Tulis pesan ajakan kampanye positifmu di sini..."
                      rows={2}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:border-primary-400 focus:outline-none resize-none font-medium text-gray-800"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isNextDisabled}
                  onClick={handleNext}
                  className="btn-primary py-3 px-6 rounded-xl font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploadStep
                    ? 'Lanjutkan ke Selesai'
                    : showFeedback
                    ? 'Langkah Berikutnya'
                    : 'Simpan Pilihan'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto text-primary-500">
                <ShieldCheck className="w-9 h-9 text-primary-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-bold text-lg text-primary-800">
                  Pembuatan Konten Selesai! 🎉
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Hebat! Kamu telah merancang postingan kampanye yang aman dan bernilai edukasi, serta mengunggah karyamu untuk dipamerkan di Galeri Kelas.
                </p>
                <div className="mt-4 inline-block bg-white border border-primary-100 px-6 py-3 rounded-2xl shadow-sm">
                  <span className="text-xs text-primary-400 block font-bold">SKOR DESAIN KONTEN</span>
                  <span className="text-2xl font-black text-primary-600 font-display">
                    {score} / {maxScore}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleComplete}
                className="btn-primary py-3.5 px-8 rounded-xl font-bold shadow-lg w-full sm:w-auto hover:scale-102 transition-all"
              >
                Kirim & Selesai
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Mockup Preview Panel */}
      <div className="w-full md:w-64 bg-slate-900 rounded-3xl p-4 border border-slate-800 text-white shrink-0 self-start">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 select-none">MOCKUP POST PREVIEW</p>
        
        {/* Post Mockup Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
          <div className="p-3 flex items-center justify-between border-b border-slate-900 bg-slate-900/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] border border-white/20 font-bold font-display">
                KC
              </div>
              <span className="text-[10px] font-bold text-slate-200">Kreator_Cerdas</span>
            </div>
            <span className="text-[8px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {previewPrivacy}
            </span>
          </div>

          {/* Visual Media Container inside Mockup */}
          <div className="h-36 bg-slate-900 flex items-center justify-center text-slate-500 overflow-hidden relative">
            {uploadedMedia ? (
              uploadedMediaType === 'image' ? (
                <img src={uploadedMedia} alt="Artwork" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video src={uploadedMedia} className="w-full h-full object-contain" muted playsInline autoPlay loop />
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-[8px] text-white">Video</div>
                </div>
              )
            ) : (
              <Image className="w-8 h-8 text-slate-700" />
            )}
          </div>

          <div className="p-3 space-y-1">
            <p className="text-[10px] font-bold text-indigo-400 truncate">{previewTopic}</p>
            <p className="text-[10px] text-slate-300 leading-normal line-clamp-3">
              {previewCaption}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/40 border border-slate-800 rounded-2xl text-[9px] text-slate-400 leading-relaxed">
          Karya digitalmu akan terkirim secara instan setelah menekan tombol Simpan di akhir simulator.
        </div>
      </div>
      
    </div>
  );
}
