import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenLine, 
  ClipboardList, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  Tv, 
  Video, 
  ExternalLink,
  Send,
  HeartHandshake
} from 'lucide-react';
import canvasConfetti from 'canvas-confetti';
import { StepWrapper } from './StepComponents';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { saveDemoGalleryItem, logDemoActivity } from '../../lib/demoStore';

interface RancangBaris {
  masalah: string;
  dampak: string;
  pesan: string;
  sasaran: string;
  bentuk: string[]; // selected formats, e.g. ['Poster']
}

interface ActivityProps {
  answers?: Record<string, any>;
  onSave?: (val: Record<string, any>) => void;
}

const BENTUK_PILIHAN = ['Poster', 'Slide', 'Infografik', 'Komik', 'Lainnya'];

const defaultRows: RancangBaris[] = [
  {
    masalah: "Ada teman yang langsung percaya pesan hadiah gratis.",
    dampak: "Bisa tertipu atau membagikan data pribadi.",
    pesan: "Jangan asal klik hadiah gratis. Periksa dulu sebelum percaya.",
    sasaran: "Teman sekelas",
    bentuk: ["Poster"],
  },
  {
    masalah: "",
    dampak: "",
    pesan: "",
    sasaran: "",
    bentuk: [],
  },
  {
    masalah: "",
    dampak: "",
    pesan: "",
    sasaran: "",
    bentuk: [],
  }
];

export function Topik8TantanganAwal({ answers = {}, onSave }: ActivityProps) {
  const [rows, setRows] = useState<RancangBaris[]>(() => {
    return answers.rows || defaultRows;
  });

  const update = (newRows: RancangBaris[]) => {
    setRows(newRows);
    onSave?.({ ...answers, rows: newRows });
  };

  const handleInputChange = (rowIndex: number, field: keyof RancangBaris, value: any) => {
    const nextRows = rows.map((row, idx) => {
      if (idx === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    update(nextRows);
  };

  const handleBentukToggle = (rowIndex: number, bentukStr: string) => {
    const currentRow = rows[rowIndex];
    const isChecked = currentRow.bentuk.includes(bentukStr);
    const nextBentuk = isChecked
      ? currentRow.bentuk.filter((b) => b !== bentukStr)
      : [...currentRow.bentuk, bentukStr];

    handleInputChange(rowIndex, 'bentuk', nextBentuk);
  };

  return (
    <div className="bg-white border border-violet-100 rounded-3xl p-5 sm:p-7 shadow-card space-y-6">
      {/* Title Header */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-violet-500">
          Tantangan Awal
        </span>
        <h3 className="font-display font-bold text-xl text-primary-800 mt-1 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-violet-500" />
          Pilih Masalah, Buat Pesan Kampanye
        </h3>
        <p className="text-sm text-primary-500 mt-2 leading-relaxed">
          Kerjakan aktivitas ini secara mandiri. Sebelum membuat kampanye digital, kamu perlu menentukan pesan apa yang ingin kamu sampaikan. Pesan kampanye yang baik biasanya berawal dari masalah yang sering terjadi di sekitar kita.
        </p>
      </div>

      {/* Intro Reflection box */}
      <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 text-xs text-violet-950 leading-relaxed space-y-2">
        <p className="font-semibold text-violet-800 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-violet-500" />
          Coba pikirkan kembali hal-hal yang sudah kamu pelajari pada topik sebelumnya:
        </p>
        <p>
          Apakah ada teman yang memakai perangkat tidak sesuai tujuan, langsung percaya informasi yang belum jelas (hoaks), membagikan data pribadi, asal mengklik tautan mencurigakan, menulis komentar kasar di grup, mengejek teman, atau memakai karya orang lain tanpa mencantumkan sumber?
        </p>
        <p className="font-medium text-violet-700">
          Sekarang, rancang 3 ide pesan kampanye berdasarkan masalah yang pernah kamu lihat atau baca!
        </p>
      </div>

      {/* Example Table Box (Read-only reference) */}
      <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contoh Pengisian:</h4>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-400 block mb-1">Masalah Digital</span>
            <p className="text-slate-700 font-medium">Ada teman yang langsung percaya pesan hadiah gratis.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-400 block mb-1">Dampaknya</span>
            <p className="text-slate-700 font-medium">Bisa tertipu atau membagikan data pribadi.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-400 block mb-1">Pesan Kampanye</span>
            <p className="text-slate-700 font-medium">Jangan asal klik hadiah gratis. Periksa dulu sebelum percaya.</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-400 block mb-1">Sasaran</span>
            <p className="text-slate-700 font-medium">Teman sekelas</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
            <span className="font-semibold text-slate-400 block mb-1">Bentuk Karya</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 font-bold rounded-lg border border-violet-100 w-fit">
              🎨 Poster digital
            </div>
          </div>
        </div>
      </div>

      {/* Main Campaign Planner Worksheet */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-primary-800 flex items-center gap-1.5">
          <PenLine className="h-4.5 w-4.5 text-violet-500" />
          Ayo, Rancang Pesan Kampanyemu!
        </h4>

        {/* Desktop View Table */}
        <div className="hidden lg:block overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[5%]">No</th>
                <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[23%]">Masalah Digital yang Kulihat/Kubaca</th>
                <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[22%]">Dampaknya Jika Dibiarkan</th>
                <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[22%]">Pesan Kampanye yang Ingin Disampaikan</th>
                <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[13%]">Sasaran</th>
                <th scope="col" className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[15%]">Bentuk Karya</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-3 py-4 text-center text-sm font-bold text-slate-400">
                    {rowIndex + 1}
                  </td>
                  <td className="px-3 py-3">
                    <textarea
                      value={row.masalah}
                      onChange={(e) => handleInputChange(rowIndex, 'masalah', e.target.value)}
                      placeholder="Contoh: Teman membagikan password..."
                      className="w-full min-h-[70px] max-h-[120px] p-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <textarea
                      value={row.dampak}
                      onChange={(e) => handleInputChange(rowIndex, 'dampak', e.target.value)}
                      placeholder="Contoh: Akun dibajak dan merugikan..."
                      className="w-full min-h-[70px] max-h-[120px] p-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <textarea
                      value={row.pesan}
                      onChange={(e) => handleInputChange(rowIndex, 'pesan', e.target.value)}
                      placeholder="Contoh: Jaga passwordmu agar tetap rahasia!"
                      className="w-full min-h-[70px] max-h-[120px] p-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={row.sasaran}
                      onChange={(e) => handleInputChange(rowIndex, 'sasaran', e.target.value)}
                      placeholder="Contoh: Semua teman"
                      className="w-full p-2 text-xs border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
                      {BENTUK_PILIHAN.map((bentukOption) => {
                        const isChecked = row.bentuk.includes(bentukOption);
                        return (
                          <label
                            key={bentukOption}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-violet-50 border-violet-200 text-violet-700'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleBentukToggle(rowIndex, bentukOption)}
                              className="accent-violet-600 rounded"
                            />
                            {bentukOption}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="block lg:hidden space-y-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3.5 relative overflow-hidden"
            >
              <div className="absolute top-3 right-4 text-xs font-bold text-violet-500">
                Ide #{rowIndex + 1}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Masalah Digital</label>
                <textarea
                  value={row.masalah}
                  onChange={(e) => handleInputChange(rowIndex, 'masalah', e.target.value)}
                  placeholder="Masalah digital yang kamu temukan..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dampaknya Jika Dibiarkan</label>
                <textarea
                  value={row.dampak}
                  onChange={(e) => handleInputChange(rowIndex, 'dampak', e.target.value)}
                  placeholder="Apa dampak buruknya jika dibiarkan..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pesan Kampanye</label>
                <textarea
                  value={row.pesan}
                  onChange={(e) => handleInputChange(rowIndex, 'pesan', e.target.value)}
                  placeholder="Pesan ajakan yang ingin disampaikan..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sasaran Kampanye</label>
                <input
                  type="text"
                  value={row.sasaran}
                  onChange={(e) => handleInputChange(rowIndex, 'sasaran', e.target.value)}
                  placeholder="Contoh: Teman sekolah, adik kelas..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Bentuk Karya yang Cocok</label>
                <div className="flex flex-wrap gap-1.5">
                  {BENTUK_PILIHAN.map((bentukOption) => {
                    const isChecked = row.bentuk.includes(bentukOption);
                    return (
                      <button
                        key={bentukOption}
                        type="button"
                        onClick={() => handleBentukToggle(rowIndex, bentukOption)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isChecked
                            ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isChecked ? '✓ ' : ''}{bentukOption}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pesan Digi speaking avatar section */}
      <div className="mt-6 flex gap-4 items-start bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 sm:p-5">
        <div className="h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white shadow-md flex text-lg">
          🤖
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block">Pesan Digi</span>
          <p className="text-xs sm:text-sm text-primary-800 leading-relaxed italic">
            “Kampanye digital yang baik dimulai dari masalah yang jelas. Pilih pesan yang penting, gunakan kata-kata yang sopan, lalu ajak temanmu menjadi pengguna digital yang aman dan bertanggung jawab.”
          </p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 italic mt-4 text-center">
        Perencanaan kampanye digitalmu otomatis tersimpan sebagai draf.
      </p>
    </div>
  );
}


/* ══════════════════════════════════════════════════
  YUK, BELAJAR BERSAMA - TOPIK 8
  ══════════════════════════════════════════════════ */

interface YukBelajarTopik8Props {
  onActivitySave?: (key: string, val: any) => void;
  activityAnswers?: Record<string, any>;
}

export function YukBelajarTopik8({ onActivitySave, activityAnswers = {} }: YukBelajarTopik8Props) {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [visitedTabs, setVisitedTabs] = useState<string[]>(['A']);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Card Flip State for Tab C
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Expansion State for Tab D (CERDAS)
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  // Tab D Checkbox Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    return activityAnswers['t8-cerdas-checklist'] || {
      cek_pesan: false,
      etika_bahasa: false,
      rahasiakan: false,
      dasarkan: false,
      ambil_bahan: false,
      sebarkan: false
    };
  });

  const saveAnswers = (key: string, data: any) => {
    onActivitySave?.(key, data);
  };

  const handleCheckboxToggle = (field: string) => {
    const nextChecklist = { ...checklist, [field]: !checklist[field] };
    setChecklist(nextChecklist);
    saveAnswers('t8-cerdas-checklist', nextChecklist);

    // If all checked, trigger confetti
    const allChecked = Object.values(nextChecklist).every(v => v === true);
    if (allChecked) {
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const tabs = [
    { id: 'A', label: 'Apa itu Kampanye?', icon: '📢' },
    { id: 'B', label: 'Mengapa Kampanye?', icon: '🤔' },
    { id: 'C', label: 'Pilih Masalah', icon: '❓' },
    { id: 'D', label: 'Rumus CERDAS', icon: '💡' },
    { id: 'E', label: 'Tutorial & Contoh', icon: '🎨' }
  ] as const;

  const goToTab = (id: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setActiveTab(id);
    setVisitedTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const tabDone: Record<string, boolean> = {
    A: visitedTabs.includes('A'),
    B: visitedTabs.includes('B'),
    C: Object.keys(flippedCards).length >= 1,
    D: Object.values(checklist).every(v => v === true),
    E: visitedTabs.includes('E'),
  };

  const completedMissions = tabs.filter((t) => tabDone[t.id]).length;
  const allMissionsDone = completedMissions === tabs.length;

  const exampleMessages = [
    { id: 1, text: '“Jaga data pribadimu. Jangan bagikan kata sandi kepada siapa pun.”', icon: '🔒' },
    { id: 2, text: '“Sebelum percaya berita, cek dulu sumbernya.”', icon: '🔍' },
    { id: 3, text: '“Komentar sopan membuat dunia digital lebih nyaman.”', icon: '💬' },
    { id: 4, text: '“Kalau tautannya aneh, jangan asal klik.”', icon: '⚠️' },
    { id: 5, text: '“Hargai karya teman. Jangan asal ambil.”', icon: '🖼️' },
  ];

  const benefits = [
    { title: 'Penggunaan Sesuai Tujuan', text: 'Mengajak teman menggunakan HP, Chromebook, atau komputer untuk tujuan belajar.', emoji: '💻' },
    { title: 'Kritis Terhadap Informasi', text: 'Melatih agar tidak mudah percaya pada informasi yang belum jelas (hoaks).', emoji: '🧐' },
    { title: 'Menjaga Data Pribadi', text: 'Meningkatkan kesadaran pentingnya melindungi informasi pribadi di internet.', emoji: '🛡️' },
    { title: 'Waspada Terhadap Tautan', text: 'Mengingatkan agar tidak asal mengklik tautan mencurigakan.', emoji: '🔗' },
    { title: 'Komunikasi Santun', text: 'Mendorong penggunaan kata-kata yang sopan saat berkomentar.', emoji: '✨' },
    { title: 'Anti-Bullying', text: 'Mengajak menolak cyberbullying dan menjadi teman baik di dunia online.', emoji: '🤝' },
    { title: 'Menghargai Hak Cipta', text: 'Mendidik cara menghargai karya orang lain dan tidak asal comot.', emoji: '🎨' },
  ];

  const problemScenarios = [
    { id: 0, masalah: 'Teman langsung percaya berita viral.', pesan: '“Jangan langsung percaya, cek dulu sumbernya!”', icon: '📰' },
    { id: 1, masalah: 'Ada yang membagikan nomor HP di grup.', pesan: '“Nomor HP termasuk data pribadi. Jaga baik-baik!”', icon: '📱' },
    { id: 2, masalah: 'Ada tautan hadiah gratis yang mencurigakan.', pesan: '“Hadiah palsu bisa mencuri datamu. Jangan asal klik!”', icon: '🎁' },
    { id: 3, masalah: 'Ada komentar kasar di video teman.', pesan: '“Komentar sopan membuat teman merasa aman.”', icon: '✍️' },
    { id: 4, masalah: 'Ada yang memakai gambar dari internet tanpa sumber.', pesan: '“Hargai karya orang lain, cantumkan sumbernya.”', icon: '🖼️' },
    { id: 5, masalah: 'Ada teman yang diejek di grup.', pesan: '“Jadi teman baik, jangan ikut mengejek.”', icon: '❤️' },
  ];

  const cerdasFormula = [
    { L: 'C', title: 'Cek pesan', q: 'Apakah pesan kampanyeku jelas dan mudah dipahami?', desc: 'Pesan harus singkat, padat, dan langsung ke inti ajakan tanpa berbelit-belit.' },
    { L: 'E', title: 'Etika bahasa', q: 'Apakah bahasaku sopan dan tidak menyakiti orang lain?', desc: 'Gunakan kata-kata positif yang membangun, hindari menyindir atau mengejek kelompok tertentu.' },
    { L: 'R', title: 'Rahasiakan data pribadi', q: 'Apakah karyaku bebas dari alamat, nomor HP, kata sandi, foto pribadi, atau data rahasia?', desc: 'Pastikan tidak ada data sensitif yang tidak sengaja terekam pada gambar/poster/video.' },
    { L: 'D', title: 'Dasarkan pada informasi benar', q: 'Apakah isi kampanyeku benar dan tidak menyesatkan?', desc: 'Informasi atau tips yang kamu berikan harus valid dan terbukti kebenarannya.' },
    { L: 'A', title: 'Ambil bahan dengan benar', q: 'Apakah gambar, ikon, atau informasi yang kupakai memiliki sumber yang jelas?', desc: 'Gunakan aset berlisensi bebas atau cantumkan kredit pencipta aslinya dengan jujur.' },
    { L: 'S', title: 'Sebarkan di tempat yang sesuai', q: 'Apakah kampanyeku hanya dibagikan di ruang belajar yang ditentukan guru?', desc: 'Bagikan karya di galeri kelas atau platform yang telah disepakati demi keamanan bersama.' },
  ];

  return (
    <StepWrapper stepNumber={5} title="Yuk, Belajar Bersama!" icon={<BookOpen className="h-5 w-5" />}>
      {/* Petualangan Progress Tracker */}
      <div className="mb-5 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-violet-700 flex items-center gap-1.5">
            Petualangan Kampanator Digital
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-white text-violet-600 rounded-full border border-violet-200 shrink-0">
            {completedMissions}/{tabs.length} misi
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-violet-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedMissions / tabs.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        {allMissionsDone && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-emerald-600 mt-2 text-center flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" /> Semua misi selesai! Kamu siap merancang kampanye hebat! 🏆
          </motion.p>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const isDone = tabDone[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => goToTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md transform scale-102'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                  : 'bg-violet-50 text-violet-700 hover:bg-violet-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {isDone && (
                <span className={`ml-0.5 text-[10px] ${isActive ? 'text-white' : 'text-emerald-500'}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* TAB A: APA ITU KAMPANYE */}
        {activeTab === 'A' && (
          <motion.div
            key="tab-a"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="font-display font-extrabold text-violet-800 text-base mb-2">A. Apa Itu Kampanye Digital?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Pernahkah kamu melihat poster ajakan di internet? Misalnya ajakan untuk menjaga kebersihan, hemat listrik, tidak membuang sampah sembarangan, atau berhati-hati saat menggunakan internet.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                Ajakan seperti itu dapat disebut <strong>kampanye</strong>. Jika ajakan tersebut dibuat dan disampaikan melalui media digital, maka disebut <strong>kampanye digital</strong>.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                Kampanye digital adalah kegiatan menyampaikan pesan atau ajakan melalui media digital. Kampanye digital dapat dibuat dalam bentuk poster, video pendek, infografik, slide, komik digital, gambar sederhana, atau pesan singkat (caption).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary-800 flex items-center gap-1.5">
                <CheckCircle className="h-4.5 w-4.5 text-violet-500" />
                Pesan Jelas dan Positif
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kampanye digital yang baik memiliki pesan yang jelas. Pesannya tidak membingungkan, tidak menakut-nakuti, tidak mengejek, dan tidak merugikan orang lain. Perhatikan beberapa contoh pesan kampanye digital berikut:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {exampleMessages.map((msg) => (
                  <div key={msg.id} className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm hover:border-violet-300 transition-colors flex gap-3 items-center">
                    <span className="text-2xl p-2 bg-violet-50 rounded-xl">{msg.icon}</span>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs font-semibold text-amber-900 leading-relaxed">
              💡 Kampanye digital tidak harus panjang. Yang paling penting adalah pesannya <strong>jelas, sopan, aman, dan bermanfaat</strong> untuk orang banyak.
            </div>
          </motion.div>
        )}

        {/* TAB B: MENGAPA KAMPANYE */}
        {activeTab === 'B' && (
          <motion.div
            key="tab-b"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="font-display font-extrabold text-violet-800 text-base mb-2">B. Mengapa Kita Perlu Membuat Kampanye Digital?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Di dunia digital, pesan dapat menyebar dengan sangat cepat. Banyak orang bisa melihat, membaca, menyukai, atau membagikan pesan dalam waktu yang singkat.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                Karena itu, pesan yang baik dapat membantu banyak orang! Melalui kampanye digital, kamu dapat mengajak teman-teman untuk menggunakan teknologi dengan lebih <strong>aman, sopan, dan bertanggung jawab</strong>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary-800">Melalui Kampanye Digital, Kamu Bisa Mengajak Teman untuk:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((b, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-100 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-2xl">{b.emoji}</span>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-primary-800">{b.title}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-xs font-semibold text-violet-900 leading-relaxed">
              🚀 Kampanye digital juga melatih kamu menjadi <strong>pengguna digital yang bijak</strong>. Artinya, kamu tidak hanya bisa memakai teknologi, tetapi juga bisa menggunakannya untuk menyampaikan pesan yang baik bagi dunia.
            </div>
          </motion.div>
        )}

        {/* TAB C: PILIH MASALAH */}
        {activeTab === 'C' && (
          <motion.div
            key="tab-c"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="font-display font-extrabold text-violet-800 text-base mb-2">C. Pilih Satu Masalah Digital</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Sebelum membuat kampanye, kamu perlu memilih satu masalah digital terlebih dahulu. Masalah digital adalah masalah yang terjadi saat seseorang menggunakan perangkat digital, internet, media sosial, aplikasi pesan, game online, atau platform belajar.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-2">
                Masalah itu bisa berasal dari pengalamanmu sendiri, pengalaman teman, cerita di modul ini, atau hal yang sering kamu lihat di internet.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h4 className="text-sm font-bold text-primary-800">Daftar Masalah Digital dan Contoh Pesannya</h4>
                <span className="text-[11px] text-slate-400 font-semibold italic">Ketuk kartu untuk melihat pesan kampanye!</span>
              </div>

              {/* Interactive Flipping Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {problemScenarios.map((item) => {
                  const isFlipped = !!flippedCards[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => setFlippedCards(prev => ({ ...prev, [item.id]: !isFlipped }))}
                      className="cursor-pointer h-[120px] [perspective:1000px] group"
                    >
                      <div className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm [backface-visibility:hidden] hover:border-violet-300 hover:shadow-md transition-all">
                          <div className="flex items-center gap-2">
                            <span className="text-xl bg-slate-50 p-1.5 rounded-lg border border-slate-100">{item.icon}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600">Masalah</span>
                          </div>
                          <p className="text-xs font-bold text-primary-800 leading-relaxed line-clamp-2">{item.masalah}</p>
                        </div>

                        {/* Back Side (Pesan) */}
                        <div className="absolute inset-0 w-full h-full bg-violet-600 text-white rounded-2xl p-4 flex flex-col justify-between shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
                          <span className="text-[9px] uppercase font-extrabold tracking-widest text-violet-200">Rekomendasi Pesan Kampanye</span>
                          <p className="text-xs font-bold leading-relaxed italic">{item.pesan}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs font-semibold text-amber-900 leading-relaxed">
              ⚠️ Pilihlah <strong>satu masalah</strong> yang menurutmu paling penting untuk diingatkan. Jangan memilih terlalu banyak masalah agar kampanyemu tetap fokus, jelas, dan mudah dipahami oleh orang lain.
            </div>
          </motion.div>
        )}

        {/* TAB D: RUMUS CERDAS */}
        {activeTab === 'D' && (
          <motion.div
            key="tab-d"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 border border-violet-100">
              <h3 className="font-display font-extrabold text-violet-800 text-base mb-2">D. Rumus CERDAS untuk Kampanye Digital</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Agar kampanyemu aman, sopan, dan bermanfaat, selalu gunakan rumus <strong>CERDAS</strong> sebelum membagikan karyamu ke kelas!
              </p>
            </div>

            {/* Accordion Letters */}
            <div className="space-y-2.5">
              {cerdasFormula.map((f) => {
                const isExpanded = expandedLetter === f.L;
                return (
                  <div key={f.L} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedLetter(isExpanded ? null : f.L)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-violet-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                          {f.L}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-primary-800">{f.title}</span>
                          <p className="text-[11px] text-slate-400 italic font-medium">{f.q}</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100"
                        >
                          <p className="bg-slate-50 p-3 rounded-xl">{f.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Section E: Contoh Rumus CERDAS */}
            <div className="border border-violet-100 rounded-3xl p-5 bg-violet-50/20 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-violet-600 tracking-wider">Latihan Analisis</span>
                <h4 className="text-sm font-bold text-primary-800">E. Contoh Menggunakan Rumus CERDAS</h4>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs space-y-2 leading-relaxed">
                <p><strong>Masalah digital:</strong> Ada teman yang sering membagikan tautan hadiah gratis tanpa mengecek terlebih dahulu.</p>
                <p><strong>Pesan kampanye:</strong> <i>“Sebelum klik hadiah gratis, berhenti dulu dan periksa!”</i></p>
              </div>

              {/* Checklist form */}
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold text-slate-500">Coba periksa apakah contoh di atas sudah CERDAS (Centang semuanya):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'cek_pesan', label: 'Cek pesan (Jelas & mengajak berhenti)', detail: 'Jawaban: Pesannya jelas mengajak tidak asal klik.' },
                    { id: 'etika_bahasa', label: 'Etika bahasa (Sopan & mendidik)', detail: 'Jawaban: Bahasanya sopan dan tidak mengejek.' },
                    { id: 'rahasiakan', label: 'Rahasiakan data (Bebas data pribadi)', detail: 'Jawaban: Tidak ada alamat/nomor HP/kata sandi.' },
                    { id: 'dasarkan', label: 'Dasarkan info benar (Aturan aman)', detail: 'Jawaban: Sesuai aturan aman sebelum klik link.' },
                    { id: 'ambil_bahan', label: 'Ambil bahan benar (Lisensi jelas)', detail: 'Jawaban: Jika pakai gambar, sumber gambar ditulis.' },
                    { id: 'sebarkan', label: 'Sebarkan di tempat sesuai (Kelas)', detail: 'Jawaban: Dibagikan di kelas/ruang belajar guru.' },
                  ].map((chk) => {
                    const isChecked = !!checklist[chk.id];
                    return (
                      <div
                        key={chk.id}
                        onClick={() => handleCheckboxToggle(chk.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by div onClick
                            className="accent-emerald-600 rounded"
                          />
                          <span className="text-xs font-bold">{chk.label}</span>
                        </div>
                        {isChecked && (
                          <p className="text-[10px] text-emerald-700 font-medium mt-1 ml-5 animate-pop-in">
                            {chk.detail}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB E: TUTORIAL & CONTOH KARYA */}
        {activeTab === 'E' && (
          <motion.div
            key="tab-e"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            {/* Canva Tutorials Section */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-primary-800 flex items-center gap-1.5">
                <Tv className="h-4.5 w-4.5 text-violet-500" />
                Tutorial Canva: Membuat Poster Kampanye
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tonton video panduan di bawah ini untuk belajar mendesain poster kampanye digital menggunakan aplikasi Canva. 
                <span className="font-bold text-amber-600"> Ingat, selalu cantumkan kredit atau sumber pembuat tutorial/karya sebagai bentuk penghargaan!</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tutorial 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                  <div className="overflow-hidden rounded-xl bg-black aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/j4BIclCaT80"
                      title="Tutorial Canva Part 1"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-2.5 px-1">
                    <h5 className="text-xs font-bold text-slate-800">Part 1: Dasar Pembuatan Poster Canva</h5>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Sumber: youtube.com/watch?v=j4BIclCaT80 (Canva Education)
                    </p>
                  </div>
                </div>

                {/* Tutorial 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                  <div className="overflow-hidden rounded-xl bg-black aspect-video">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/zgG5IlbXMIU"
                      title="Tutorial Canva Part 2"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="mt-2.5 px-1">
                    <h5 className="text-xs font-bold text-slate-800">Part 2: Tips Desain Poster Cerdas</h5>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Sumber: youtube.com/watch?v=zgG5IlbXMIU (Canva Design School)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Poster Gallery Examples */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-primary-800 flex items-center gap-1.5">
                <Layers className="h-4.5 w-4.5 text-violet-500" />
                Contoh Desain Poster Kampanye
              </h4>
              <p className="text-xs text-slate-500">
                Berikut adalah contoh poster kampanye digital cerdas. Ketuk gambar untuk memperbesar!
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { src: '/gambar/topik 8/contoh poster 1.png', label: 'Poster Contoh 1' },
                  { src: '/gambar/topik 8/contoh poster 2.png', label: 'Poster Contoh 2' }
                ].map((post, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomImage(post.src)}
                    className="group relative bg-slate-50 border border-slate-200 rounded-2xl p-2 cursor-zoom-in hover:border-violet-300 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[160px]"
                  >
                    <img
                      src={post.src}
                      alt={post.label}
                      className="max-h-[220px] rounded-lg object-contain transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-opacity">
                        🔍 Perbesar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Gallery Examples */}
            <div className="space-y-4 pt-2">
              <h4 className="text-sm font-bold text-primary-800 flex items-center gap-1.5">
                <Video className="h-4.5 w-4.5 text-violet-500" />
                Contoh Video Kampanye Digital
              </h4>
              <p className="text-xs text-slate-500">
                Berikut adalah contoh karya video kampanye digital yang kreatif dan mengedukasi. Tonton videonya untuk mendapatkan ide!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { src: '/gambar/topik 8/contoh video.mp4', label: 'Video Kampanye Contoh 1' },
                  { src: '/gambar/topik 8/video 2.mp4', label: 'Video Kampanye Contoh 2' }
                ].map((vid, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2 flex flex-col justify-between">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner flex justify-center items-center">
                      <video
                        src={vid.src}
                        controls
                        className="w-full max-h-[260px] rounded-lg bg-black"
                      />
                    </div>
                    <div className="px-1 pt-1.5">
                      <h5 className="text-xs font-bold text-slate-800">{vid.label}</h5>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Format: Video MP4</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lightbox Zoom Modal */}
            {zoomImage && (
              <div
                className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                onClick={() => setZoomImage(null)}
              >
                <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl p-2 animate-pop-in">
                  <button
                    className="absolute -top-10 right-0 text-white text-sm font-bold flex items-center gap-1 hover:text-violet-400 transition-colors"
                    onClick={() => setZoomImage(null)}
                  >
                    ✕ Tutup
                  </button>
                  <img
                    src={zoomImage}
                    alt="Zoomed Poster"
                    className="max-h-[85vh] w-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </StepWrapper>
  );
}


/* ══════════════════════════════════════════════════
  AKTIVITAS AKHIR & REFLEKSI - TOPIK 8
  ══════════════════════════════════════════════════ */

interface Topik8AktivitasAkhirProps {
  answers?: Record<string, any>;
  onSave?: (val: Record<string, any>) => void;
  studentUid: string;
  userProfile: any;
}

export function Topik8AktivitasAkhir({ 
  answers = {}, 
  onSave, 
  studentUid, 
  userProfile 
}: Topik8AktivitasAkhirProps) {
  const [campaignTitle, setCampaignTitle] = useState(answers.campaignTitle || '');
  const [caption, setCaption] = useState(answers.caption || '');
  const [workLink, setWorkLink] = useState(answers.workLink || '');
  const [kesan, setKesan] = useState(answers.kesan || '');
  const [saran, setSaran] = useState(answers.saran || '');
  const [isShared, setIsShared] = useState(answers.isShared || false);

  const [sharing, setSharing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const updateDraft = (fields: Record<string, any>) => {
    onSave?.({
      ...answers,
      ...fields
    });
  };

  const handleShare = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!campaignTitle.trim()) {
      setErrorMsg('Judul kampanye tidak boleh kosong!');
      return;
    }
    if (!caption.trim()) {
      setErrorMsg('Caption kampanye tidak boleh kosong!');
      return;
    }
    if (!workLink.trim()) {
      setErrorMsg('Tautan/Link karya tidak boleh kosong!');
      return;
    }
    if (!kesan.trim()) {
      setErrorMsg('Kesan belajar tidak boleh kosong!');
      return;
    }
    if (!saran.trim()) {
      setErrorMsg('Saran belajar tidak boleh kosong!');
      return;
    }

    // URL validation
    if (!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(workLink.trim())) {
      setErrorMsg('Masukkan link yang valid (harus dimulai dengan http:// atau https://)');
      return;
    }

    setSharing(true);
    try {
      const docId = `${studentUid}_topik-8`;
      const initials = (userProfile?.displayName || 'SC')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p: any) => p[0]?.toUpperCase())
        .join('') || 'SC';

      const payload = {
        uid: studentUid,
        studentUid: studentUid,
        guruId: userProfile?.guruId || '',
        displayName: userProfile?.displayName || 'Petualang Cerdas',
        studentName: userProfile?.displayName || 'Petualang Cerdas',
        avatar: initials,
        topicId: 'topik-8',
        topicTitle: 'Berkarya Aman di Dunia Digital',
        content: caption.trim(),
        campaignTitle: campaignTitle.trim(),
        workLink: workLink.trim(),
        mediaType: 'text' as const,
        appreciations: { thumbs: 0, hearts: 0, comments: 0 },
        thumbsBy: [],
        heartsBy: [],
      };

      if (!db) {
        saveDemoGalleryItem({
          id: docId,
          createdAt: Date.now(),
          sharedAt: Date.now(),
          status: 'approved', // instantly approved in demo
          ...payload,
        });
        logDemoActivity(
          userProfile?.guruId || 'demo-guru-001',
          userProfile?.displayName || 'Siswa',
          `Membagikan Kampanye: "${campaignTitle}" ke Galeri Kelas`,
          'Berkarya Aman di Dunia Digital',
          studentUid
        );
      } else {
        await setDoc(doc(db, 'classGallery', docId), {
          createdAt: serverTimestamp(),
          sharedAt: serverTimestamp(),
          status: 'pending', // pending approval in firebase
          ...payload,
        });
      }

      setIsShared(true);
      updateDraft({ campaignTitle, caption, workLink, kesan, saran, isShared: true });
      setSuccessMsg(!db ? 'Karya berhasil dibagikan ke Galeri Kelas!' : 'Karya berhasil dikirim! Menunggu persetujuan guru.');
      canvasConfetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal membagikan karya. Silakan coba lagi.');
    } finally {
      setSharing(false);
    }
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'campaignTitle') setCampaignTitle(val);
    if (field === 'caption') setCaption(val);
    if (field === 'workLink') setWorkLink(val);
    if (field === 'kesan') setKesan(val);
    if (field === 'saran') setSaran(val);
    
    updateDraft({ 
      campaignTitle: field === 'campaignTitle' ? val : campaignTitle,
      caption: field === 'caption' ? val : caption,
      workLink: field === 'workLink' ? val : workLink,
      kesan: field === 'kesan' ? val : kesan,
      saran: field === 'saran' ? val : saran,
    });
  };

  return (
    <StepWrapper stepNumber={6} title="Aktivitas Akhir: Unggah Karyamu!" icon={<Send className="h-5 w-5" />}>
      <div className="space-y-8">
        {/* Section 1: Campaign Upload Form */}
        <div className="bg-white border border-violet-100 rounded-3xl p-5 sm:p-7 shadow-card space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-500">
              Kampanye Digital
            </span>
            <h3 className="font-display font-bold text-xl text-primary-800 mt-1 flex items-center gap-2">
              <Layers className="h-5 w-5 text-violet-500" />
              Bagikan Kampanye Cerdasmu
            </h3>
            <p className="text-sm text-primary-500 mt-2 leading-relaxed">
              Setelah merancang pesan kampanye dan mendesain karyamu (di Canva, merekam video di TikTok, atau mengunggah ke Google Drive), sekarang saatnya membagikan karyamu agar guru dan teman-teman lainnya bisa melihatnya!
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Judul */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Judul Kampanye
              </label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => handleFieldChange('campaignTitle', e.target.value)}
                placeholder="Contoh: Stop Hoaks di Sekitar Kita!"
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Input Caption */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Caption / Deskripsi Kampanye
              </label>
              <textarea
                value={caption}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                placeholder="Tuliskan caption menarik yang mengajak teman-teman berbuat baik di dunia digital..."
                rows={4}
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Input Link Karya */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center justify-between">
                <span>Link Tautan Karya (Canva, TikTok, Drive, dll.)</span>
                <span className="text-[10px] text-violet-500 font-medium lowercase">Harus diawali http:// atau https://</span>
              </label>
              <input
                type="text"
                value={workLink}
                onChange={(e) => handleFieldChange('workLink', e.target.value)}
                placeholder="Contoh: https://canva.com/design/... atau https://tiktok.com/@..."
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 text-left">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-600 text-left">
              ✓ {successMsg}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing || !campaignTitle.trim() || !caption.trim() || !workLink.trim()}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-display font-extrabold rounded-2xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {sharing ? (
                <span>Mengirim...</span>
              ) : isShared ? (
                <>
                  <Sparkles className="h-4.5 w-4.5" />
                  Bagikan Ulang ke Galeri Kelas
                </>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  Bagikan ke Galeri Kelas
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center italic mt-2.5">
              * Karya yang dibagikan akan divalidasi oleh guru sebelum tampil secara publik di Galeri Kelas.
            </p>
          </div>
        </div>

        {/* Section 2: Final Reflections (Kesan & Saran) */}
        <div className="bg-gradient-to-br from-violet-50/60 to-indigo-50/60 border border-violet-100 rounded-3xl p-5 sm:p-7 shadow-card space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-violet-600">
              Refleksi Akhir
            </span>
            <h3 className="font-display font-bold text-xl text-primary-800 mt-1 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-violet-500" />
              Kesan & Saran Pembelajaran
            </h3>
            <p className="text-sm text-primary-500 mt-2 leading-relaxed">
              Selamat, kamu telah menyelesaikan semua materi pembelajaran SiberCerdas! Tuliskan kesan dan saranmu selama belajar modul ini agar program pembelajaran ini bisa lebih baik di masa depan.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Kesan */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Kesan Belajar
              </label>
              <textarea
                value={kesan}
                onChange={(e) => handleFieldChange('kesan', e.target.value)}
                placeholder="Bagaimana perasaanmu setelah mempelajari modul SiberCerdas? Apa bagian yang paling kamu sukai?"
                rows={3}
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Input Saran */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-600 tracking-wider block uppercase">
                Saran untuk Pembelajaran Selanjutnya
              </label>
              <textarea
                value={saran}
                onChange={(e) => handleFieldChange('saran', e.target.value)}
                placeholder="Adakah saran agar modul ini lebih seru? Misalnya, penambahan fitur, topik, atau game baru?"
                rows={3}
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-violet-400 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          <div className="bg-white/70 border border-violet-100 rounded-2xl p-4 text-xs font-semibold text-violet-900 leading-relaxed text-left">
            💡 Kesan dan saranmu tersimpan sebagai bagian dari draft respons belajarmu dan akan dievaluasi langsung oleh gurumu di dashboard penilaian. Terima kasih atas kontribusimu!
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
