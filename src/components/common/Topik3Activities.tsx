import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Circle, Lock, ShieldAlert, RefreshCw } from 'lucide-react';

interface ActivityProps {
 answers?: Record<string, any>;
 onSave?: (val: Record<string, any>) => void;
}

const KATEGORI = [
 { key: 'boleh', label: 'Boleh Diisi', color: 'emerald' },
 { key: 'izin', label: 'Perlu Izin Guru/Orang Tua', color: 'amber' },
 { key: 'tidak', label: 'Tidak Boleh Ditulis', color: 'rose' },
 ] as const;

/* ══════════════════════════════════════════════════
 Reusable: Tombol Simpan + Modal Verifikasi
 ══════════════════════════════════════════════════ */
function SaveSection({
 submitted,
 onConfirm,
 }: {
 submitted: boolean;
 onConfirm: () => void;
 }) {
 const [showConfirm, setShowConfirm] = useState(false);

 if (submitted) {
 return (
 <div className="flex items-center justify-center gap-2 bg-emerald-50/80 border border-emerald-200 rounded-2xl py-3 px-4 text-emerald-700 font-bold text-sm">
 Jawaban sudah dikirim ke guru dan tidak dapat diubah.
 </div>
 );
 }

 return (
 <div className="pt-1">
 <button
 type="button"
 onClick={() => setShowConfirm(true)}
 className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all inline-flex items-center justify-center gap-2"
 >
 Simpan & Kirim ke Guru
 </button>

 {showConfirm && (
 <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
 <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
 <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-amber-100">
 ⚠️
 </div>
 <h4 className="font-display font-bold text-lg text-primary-800">Kirim ke Guru?</h4>
 <p className="text-sm text-primary-500 leading-relaxed">
 Setelah dikirim, jawabanmu akan dinilai oleh guru dan <b>tidak dapat diubah lagi</b>. Pastikan
 kamu sudah memeriksa semua jawabanmu, ya!
 </p>
 <div className="flex gap-2 pt-1">
 <button
 type="button"
 onClick={() => setShowConfirm(false)}
 className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-655 hover:bg-slate-200"
 >
 Periksa Lagi
 </button>
 <button
 type="button"
 onClick={() => {
 setShowConfirm(false);
 onConfirm();
 }}
 className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700"
 >
 Ya, Kirim
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}


/* ══════════════════════════════════════════════════
 AKTIVITAS 1 — Analisis Formulir Digital (3 formulir)
 ══════════════════════════════════════════════════ */
const FORMULIR = [
 {
 id: 'form-1',
 nama: 'Pendaftaran Game Edukasi Belajar',
 domain: 'game-belajar.web',
 deskripsi: 'Main gim petualangan matematika seru dan dapatkan peringkat tertinggi di sekolahmu!',
 actionText: 'Daftar & Mainkan',
 fieldsMock: [
 { label: 'Nama Panggilan', type: 'text', placeholder: 'Contoh: Raka', required: true },
 { label: 'Kelas', type: 'text', placeholder: 'Contoh: 6A', required: true },
 { label: 'Alamat Rumah Lengkap', type: 'text', placeholder: 'Tulis alamat rumah lengkapmu...', required: true },
 { label: 'Nomor HP Orang Tua', type: 'text', placeholder: 'Contoh: 0812-xxxx-xxxx', required: true },
 ],
 fields: ['Nama panggilan', 'Kelas', 'Alamat rumah lengkap', 'Nomor HP orang tua'],
 },
 {
 id: 'form-2',
 nama: 'Lomba Menggambar Online Tingkat Nasional',
 domain: 'lomba-kreatif.web',
 deskripsi: 'Kirimkan karya gambar kreatifmu bertema "Cita-citaku" dan menangkan piala serta beasiswa!',
 actionText: 'Kirim Karya Sekarang',
 fieldsMock: [
 { label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap sesuai rapor...', required: true },
 { label: 'Hobi', type: 'text', placeholder: 'Contoh: Menggambar, Membaca', required: false },
 { label: 'Nomor KTP Orang Tua', type: 'text', placeholder: 'Masukkan 16 digit nomor KTP orang tua...', required: true },
 { label: 'Foto Diri Terbaru', type: 'file', placeholder: 'foto_diri.png /.jpg', required: true },
 ],
 fields: ['Nama lengkap', 'Hobi', 'Nomor KTP orang tua', 'Foto diri'],
 },
 {
 id: 'form-3',
 nama: ' Klaim Diamond Gim Gratis Akhir Tahun',
 domain: 'hadiah-spesial.xyz',
 deskripsi: ' PENTING! Event resmi bagi-bagi 10.000 Diamond gratis bagi 100 pendaftar pertama hari ini saja!',
 actionText: 'KLAIM SEKARANG JUGA ',
 fieldsMock: [
 { label: 'Kata Sandi Akun Gim (Password)', type: 'password', placeholder: 'Masukkan password akun gim kamu...', required: true },
 { label: 'Nama Lengkap Pemilik Akun', type: 'text', placeholder: 'Tulis nama lengkapmu...', required: true },
 { label: 'Kode OTP HP Orang Tua', type: 'text', placeholder: 'Tulis 6 digit kode yang dikirim ke HP orang tuamu...', required: true },
 { label: 'Makanan Favorit', type: 'text', placeholder: 'Contoh: Nasi Goreng', required: false },
 ],
 fields: ['Password akun', 'Nama lengkap', 'Kode OTP HP orang tua', 'Makanan favorit'],
 },
];

export function Topik3Aktivitas1({ answers = {}, onSave }: ActivityProps) {
 const [activeTab, setActiveTab] = useState(0);
 const [data, setData] = useState<Record<string, any>>(answers);
 const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);
 const form = FORMULIR[activeTab];

 const update = (fieldKey: string, prop: string, value: string) => {
 if (submitted) return;
 const next = {
 ...data,
 [fieldKey]: {...(data[fieldKey] || {}), [prop]: value },
 };
 setData(next);
 onSave?.(next);
 };

 const handleConfirm = () => {
 const next = {...data, _submitted: true };
 setData(next);
 setSubmitted(true);
 onSave?.(next);
 };

 return (
 <div className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">
 Eksplorasi · Aktivitas 1
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Analisis Formulir Digital
 </h3>
 <p className="text-sm text-primary-505 mt-2 leading-relaxed">
 Pada aktivitas ini, kamu akan berlatih mengecek isi sebuah formulir digital. Formulir ini hanya
 untuk latihan. Kamu tidak perlu mengisi data asli dan tidak perlu menekan tombol kirim. Bacalah
 setiap data yang diminta, lalu tentukan apakah data tersebut <b>boleh diisi</b>, <b>perlu izin
 guru/orang tua</b>, atau <b>tidak boleh ditulis</b>.
 </p>
 </div>

 {/* Tabs */}
 <div className="flex gap-2 overflow-x-auto scrollbar-none border-b border-emerald-50 pb-2">
 {FORMULIR.map((f, idx) => (
 <button
 key={f.id}
 onClick={() => setActiveTab(idx)}
 className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap border transition-all ${
 idx === activeTab
 ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
 : 'bg-emerald-50/40 border-emerald-100 text-emerald-700 hover:bg-emerald-50'
 }`}
 >
 Formulir {idx + 1}
 </button>
 ))}
 </div>

 {/* Form mockup browser view */}
 <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
 {/* Browser Header Mockup */}
 <div className="bg-slate-200 px-4 py-2 flex items-center gap-2 select-none">
 <div className="flex gap-1.5 flex-row">
 <span className="w-2.5 h-2.5 rounded-full bg-rose-450 block" />
 <span className="w-2.5 h-2.5 rounded-full bg-amber-450 block" />
 <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
 </div>
 <div className="bg-white rounded-lg px-3 py-1 text-[10px] font-mono text-slate-500 flex-1 border border-slate-300 flex items-center gap-1.5 truncate">
 {form.domain.endsWith('.xyz') ? (
 <AlertTriangle className="h-3 w-3 text-amber-500" />
 ) : (
 <Lock className="h-3 w-3 text-emerald-500" />
 )} {form.domain}
 </div>
 </div>

 {/* Mockup Form Website Body */}
 <div className="bg-slate-50 p-4 border-b border-slate-200">
 <div className="bg-white rounded-2xl p-4 border border-slate-200/65 shadow-sm space-y-4 text-left">
 <div>
 <p className="font-display font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
 {form.nama}
 </p>
 <p className="text-[10px] text-slate-400 mt-1">{form.deskripsi}</p>
 </div>

 {/* Visual Fields */}
 <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-200/50">
 {form.fieldsMock.map((field, i) => (
 <div key={i} className="space-y-1">
 <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
 <span>{field.label}</span>
 {field.required && <span className="text-rose-500 text-[9px] font-normal">*Wajib</span>}
 </label>
 {field.type === 'file'? (
 <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-white text-center text-[10px] text-slate-400 font-semibold cursor-not-allowed">
 Klik untuk mengunggah berkas ({field.placeholder})
 </div>
 ): (
 <input
 type={field.type}
 placeholder={field.placeholder}
 disabled
 className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-505 font-mono cursor-not-allowed placeholder:opacity-50"
 />
 )}
 </div>
 ))}

 <button
 disabled
 className={`w-full py-2.5 rounded-xl text-xs font-bold text-white cursor-not-allowed uppercase shadow-xs transition-colors ${
 form.domain.endsWith('.xyz')
 ? 'bg-rose-500/80'
 : 'bg-emerald-600/80'
 }`}
 >
 {form.actionText}
 </button>
 </div>
 </div>
 </div>

 {/* Classification Table Area */}
 <div className="bg-white p-4">
 <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 text-left">
 KLASIFIKASIKAN DATA PADA FORMULIR DI ATAS:
 </p>
 <div className="overflow-x-auto">
 <table className="w-full border-collapse text-[11px] text-left">
 <thead>
 <tr className="bg-emerald-50 text-emerald-800">
 <th className="p-2.5 border border-emerald-100 font-bold">Data yang Diminta</th>
 <th className="p-2.5 border border-emerald-100 font-bold text-center">Keputusan</th>
 <th className="p-2.5 border border-emerald-100 font-bold">Alasan</th>
 </tr>
 </thead>
 <tbody>
 {form.fields.map((field, i) => {
 const fieldKey = `${form.id}_${i}`;
 const fd = data[fieldKey] || {};
 return (
 <tr key={fieldKey} className="align-top border-b border-slate-100 hover:bg-slate-50/50">
 <td className="p-2.5 border border-emerald-100 font-semibold text-slate-700">{field}</td>
 <td className="p-2.5 border border-emerald-100">
 <div className="flex flex-col gap-1">
 {KATEGORI.map((k) => (
 <label key={k.key} className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-655">
 <input
 type="radio"
 name={`${fieldKey}_keputusan`}
 checked={fd.keputusan === k.key}
 disabled={submitted}
 onChange={() => update(fieldKey, 'keputusan', k.key)}
 className="text-emerald-600 focus:ring-emerald-400"
 />
 {k.label}
 </label>
 ))}
 </div>
 </td>
 <td className="p-2.5 border border-emerald-100">
 <input
 type="text"
 value={fd.alasan || ''}
 disabled={submitted}
 onChange={(e) => update(fieldKey, 'alasan', e.target.value)}
 placeholder="Tulis alasan singkat..."
 className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg focus:border-emerald-400 focus:outline-none text-[11px] disabled:bg-slate-50 disabled:text-slate-400"
 />
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <SaveSection submitted={submitted} onConfirm={handleConfirm} />
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 2 — Detektif Permintaan Data (5 pesan)
 ══════════════════════════════════════════════════ */
const PESAN = [
 {
 id: 'msg-1',
 from: 'Orang tak dikenal',
 text: 'Kirim kata sandimu, nanti aku bantu masuk akunmu.',
 aman: false,
 },
 {
 id: 'msg-2',
 from: 'Wali Kelas (Grup Resmi)',
 text: 'Untuk presensi kelas hari ini, tuliskan nama panggilan dan kelasmu.',
 aman: true,
 },
 {
 id: 'msg-3',
 from: 'Pesan Berantai',
 text: 'Selamat! Kamu menang hadiah. Kirim nama lengkap, alamat rumah, dan nomor HP orang tua sekarang.',
 aman: false,
 },
 {
 id: 'msg-4',
 from: 'Nomor Asing',
 text: 'Tolong kirim kode OTP yang masuk ke HP orang tuamu. Ini untuk hadiah.',
 aman: false,
 },
 {
 id: 'msg-5',
 from: 'Teman Baru di Gim',
 text: 'Aku teman barumu di gim. Rumahmu di mana? Kirim lokasimu ya.',
 aman: false,
 },
];

export function Topik3Aktivitas2({ answers = {}, onSave }: ActivityProps) {
 const [data, setData] = useState<Record<string, any>>(answers);
 const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);

 const update = (id: string, prop: string, value: string) => {
 if (submitted) return;
 const next = {...data, [id]: {...(data[id] || {}), [prop]: value } };
 setData(next);
 onSave?.(next);
 };

 const handleConfirm = () => {
 const next = {...data, _submitted: true };
 setData(next);
 setSubmitted(true);
 onSave?.(next);
 };


 return (
 <div className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">
 Eksplorasi · Aktivitas 2
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Detektif Permintaan Data Pribadi
 </h3>
 <p className="text-sm text-primary-505 mt-2 leading-relaxed">
 Pernahkah kamu menerima pesan, formulir, atau ajakan yang meminta data tentang dirimu? Ada data
 yang boleh ditulis dengan hati-hati, ada yang perlu izin guru atau orang tua, dan ada juga yang
 tidak boleh diberikan sama sekali. Bacalah setiap pesan, temukan <b>data apa yang diminta</b>, lalu
 tentukan <b>keputusan</b> yang paling aman.
 </p>
 </div>

 <div className="space-y-4">
 {PESAN.map((p, idx) => {
 const pd = data[p.id] || {};
 return (
 <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
 {/* Chat bubble */}
 <div className="flex items-start gap-2 flex-row">
 <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm shrink-0">
 💬
 </div>
 <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
 <p className="text-[10px] font-bold text-slate-400 mb-0.5">Pesan {idx + 1} · {p.from}</p>
 <p className="text-sm text-slate-705 leading-relaxed">"{p.text}"</p>
 </div>
 </div>

 {/* Analysis fields */}
 <div className="grid sm:grid-cols-2 gap-3 pl-10">
 <div>
 <label className="text-[11px] font-bold text-slate-655 block mb-1">Data yang diminta:</label>
 <input
 type="text"
 value={pd.data || ''}
 onChange={(e) => update(p.id, 'data', e.target.value)}
 placeholder="Tulis data yang diminta..."
 className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-400 focus:outline-none text-xs"
 />
 </div>
 <div>
 <label className="text-[11px] font-bold text-slate-655 block mb-1">Keputusanmu:</label>
 <div className="flex gap-2 flex-row">
 <button
 onClick={() => update(p.id, 'keputusan', 'boleh')}
 className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
 pd.keputusan === 'boleh'
 ? 'bg-emerald-500 border-emerald-500 text-white'
 : 'bg-white border-slate-200 text-emerald-600 hover:bg-emerald-50'
 }`}
 >
 Boleh diberikan
 </button>
 <button
 onClick={() => update(p.id, 'keputusan', 'tidak')}
 className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
 pd.keputusan === 'tidak'
 ? 'bg-rose-500 border-rose-500 text-white'
 : 'bg-white border-slate-200 text-rose-600 hover:bg-rose-50'
 }`}
 >
 Tidak boleh
 </button>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 <SaveSection submitted={submitted} onConfirm={handleConfirm} />
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 3 — Membuat Kata Sandi Latihan
 ══════════════════════════════════════════════════ */
export function Topik3Aktivitas3({ answers = {}, onSave }: ActivityProps) {
 const [pwd, setPwd] = useState<string>(answers.password || '');
 const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);

 const checks = {
 panjang: pwd.length >= 8,
 besar: /[A-Z]/.test(pwd),
 kecil: /[a-z]/.test(pwd),
 angka: /[0-9]/.test(pwd),
 simbol: /[^A-Za-z0-9]/.test(pwd),
 };
 const score = Object.values(checks).filter(Boolean).length;
 const levels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat', 'Hebat!'];
 const barColors = ['bg-rose-400', 'bg-rose-400', 'bg-amber-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-500'];

 const update = (val: string) => {
 if (submitted) return;
 setPwd(val);
 onSave?.({ password: val, score });
 };

 const handleConfirm = () => {
 setSubmitted(true);
 onSave?.({ password: pwd, score, _submitted: true });
 };

 const ChecklistItem = ({ ok, label }: { ok: boolean; label: string }) => (
 <li className={`flex items-center gap-2 text-xs font-medium ${ok? 'text-emerald-600': 'text-slate-400'}`}>
 {ok ? (
 <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
 ) : (
 <Circle className="h-3.5 w-3.5 shrink-0" />
 )}
 {label}
 </li>
 );

 return (
 <div className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5">
 <div>
 <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">
 Eksplorasi · Aktivitas 3
 </span>
 <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
 Membuat Kata Sandi Latihan
 </h3>
 <p className="text-sm text-primary-505 mt-2 leading-relaxed">
 Ayo berlatih membuat kata sandi yang kuat! Ini hanya latihan, jadi <b>jangan gunakan kata sandi
 aslimu</b>. Ketik kata sandi latihan di bawah, lalu perhatikan seberapa kuat kata sandimu.
 </p>
 </div>

 <input
 type="text"
 value={pwd}
 onChange={(e) => update(e.target.value)}
 placeholder="Ketik kata sandi latihan di sini..."
 className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-emerald-400 focus:outline-none font-mono text-sm"
 />

 {/* Strength bar */}
 <div className="space-y-1.5">
 <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full transition-all ${barColors[score]}`}
 style={{ width: `${(score / 5) * 100}%` }}
 />
 </div>
 <p className="text-xs font-bold text-slate-655">
 Kekuatan: <span className={score >= 4? 'text-emerald-600': score >= 2? 'text-amber-600': 'text-rose-600'}>{levels[score]}</span>
 </p>
 </div>

 {/* Checklist */}
 <ul className="grid sm:grid-cols-2 gap-2 bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100">
 <ChecklistItem ok={checks.panjang} label="Minimal 8 karakter" />
 <ChecklistItem ok={checks.besar} label="Ada huruf besar (A-Z)" />
 <ChecklistItem ok={checks.kecil} label="Ada huruf kecil (a-z)" />
 <ChecklistItem ok={checks.angka} label="Ada angka (0-9)" />
 <ChecklistItem ok={checks.simbol} label="Ada simbol (!@#$...)" />
 </ul>

 <p className="text-[11px] text-slate-400 italic">
 Tips: gabungkan kata yang mudah kamu ingat dengan angka dan simbol. Contoh aman:
 <b className="text-slate-655"> Kuc1ng_Oren!</b>
 </p>

 <SaveSection submitted={submitted} onConfirm={handleConfirm} />
 </div>
 );
}

/* ══════════════════════════════════════════════════
 AKTIVITAS 4 — Simulasi Mengisi Situs Cerdas (5 web)
 ══════════════════════════════════════════════════ */
export function Topik3Aktivitas4({ answers = {}, onSave }: ActivityProps) {
  const [activeSite, setActiveSite] = useState<number>(0);
  const [virusInfected, setVirusInfected] = useState<boolean>(false);
  const [virusReason, setVirusReason] = useState<string>('');
  
  const [siteProgress, setSiteProgress] = useState<Record<number, {
    actionTaken: 'submit' | 'close' | null;
    isCorrect: boolean;
  }>>(answers.siteProgress || {
    0: { actionTaken: null, isCorrect: false },
    1: { actionTaken: null, isCorrect: false },
    2: { actionTaken: null, isCorrect: false },
    3: { actionTaken: null, isCorrect: false },
    4: { actionTaken: null, isCorrect: false },
  });

  const [submitted, setSubmitted] = useState<boolean>(!!answers._submitted);

  const [form1, setForm1] = useState({ username: '', password: '', phoneOtp: '' });
  const [form2, setForm2] = useState({ fullName: '', address: '', parentPhone: '' });
  const [form3, setForm3] = useState({ usernameAnbk: '', passwordAnbk: '', participantNo: '' });
  const [form4, setForm4] = useState({ fbEmail: '', fbPassword: '' });
  const [form5, setForm5] = useState({ name: '', classRoom: '', absentNo: '', note: '' });

  const sites = [
    {
      id: 0,
      name: "🎮 Robux Claim",
      url: "http://roblox-hadiah-gratis.xyz/claim",
      isSecure: false,
      title: "Klaim Robux Gratis Hari Ini",
      tagline: "Masukkan datamu untuk klaim 10.000 Robux secara instan!",
      feedbackClose: "Kamu menyelamatkan dirimu dari kejahatan phishing! Situs ini palsu (.xyz) dan menggunakan URL tidak aman (HTTP). Menutup tab adalah langkah cerdas karena situs ini sengaja dirancang untuk mencuri kata sandi Roblox-mu dan nomor HP orang tuamu untuk didaftarkan ke SMS premium berbayar. Selalu ingat: tidak ada Robux gratis di internet!",
      feedbackSubmit: "Mengisi formulir ini membuat peretas mendapatkan kata sandi Roblox-mu. Mereka dapat mengambil alih akunmu, mencuri item langka milikmu, dan menyalahgunakan nomor HP orang tuamu untuk memeras uang melalui penipuan SMS. Lain kali, periksa URL-nya dan segera tutup tab browser!"
    },
    {
      id: 1,
      name: "🎨 Lomba Gambar",
      url: "http://lomba-ekskul-laptop.online/daftar",
      isSecure: false,
      title: "Lomba Menggambar Nasional",
      tagline: "Daftar sekarang untuk memenangkan Laptop!",
      feedbackClose: "Hebat! Kamu waspada terhadap pencurian identitas. Situs ini menggunakan HTTP biasa dan domain tidak meyakinkan (.online). Lomba resmi sekolah tidak akan meminta alamat rumah lengkap siswa secara publik tanpa melalui persetujuan tertulis pihak sekolah dan orang tua. Menutup situs ini melindungi privasi keluargamu!",
      feedbackSubmit: "Membocorkan alamat rumah lengkap dan nomor HP orang tua ke situs asing sangat berbahaya. Orang asing yang berniat jahat dapat mengetahui lokasi tinggalmu, mendatangi rumahmu, atau menipu orang tuamu menggunakan info pribadi tersebut. Jangan pernah menulis data lokasi fisikmu di internet secara sembarangan!"
    },
    {
      id: 2,
      name: "📝 Portal ANBK",
      url: "https://anbk.kemdikbud.go.id/login",
      isSecure: true,
      title: "Portal Ujian Asesmen Nasional (ANBK)",
      tagline: "Portal resmi Kemdikbud.",
      feedbackClose: "Mengapa kamu menutup situs ini? Portal ANBK adalah situs ujian nasional resmi dari Kementerian Pendidikan. Situs ini menggunakan protokol aman (HTTPS dengan ikon gembok) dan domain pemerintah resmi (.go.id). Jika kamu menutup situs ini di sekolah, kamu tidak bisa mengikuti ujian, tidak mendapat nilai, dan menghambat proses asesmen sekolahmu! Pastikan kamu selalu mengisi situs resmi sekolah/pemerintah.",
      feedbackSubmit: "Luar biasa! Kamu tahu kapan harus memberikan data. Portal ANBK adalah situs resmi pemerintah Indonesia yang aman. Masuk menggunakan username dan nomor peserta ujian di portal resmi adalah bagian dari kegiatan sekolah yang wajib diikuti. Kamu siap melaksanakan ujian dengan aman!"
    },
    {
      id: 3,
      name: "🔮 FB Kuis Hewan",
      url: "http://login-pesbuk-kuis-kepribadian.net/auth",
      isSecure: false,
      title: "Kuis Wajah Hewan Keren",
      tagline: "Masuk dengan akun Facebook.",
      feedbackClose: "Pilihan yang sangat cerdas! Kuis-kuis kepribadian yang meminta login media sosial (seperti Facebook) di luar situs resminya adalah trik phishing klasik. Peretas membuat halaman login palsu untuk mencuri password Facebook-mu. Dengan menutup halaman ini, kamu menyelamatkan akun sosial mediamu dari pembajakan!",
      feedbackSubmit: "Akun Facebook-mu telah dicuri! Peretas sekarang memiliki akses ke email dan password Facebook-mu. Mereka bisa menyamar sebagai dirimu, mengirim pesan penipuan ke teman-temanmu, atau memposting konten tidak pantas yang akan merusak reputasimu. Selalu hindari tombol login pihak ketiga di situs tidak dikenal!"
    },
    {
      id: 4,
      name: "📚 Tugas Kelas",
      url: "https://kelas.sd-harapan.sch.id/tugas",
      isSecure: true,
      title: "Portal Pengumpulan Tugas Online",
      tagline: "Portal resmi kelas 6 SD Harapan.",
      feedbackClose: "Waduh, tugasmu tidak terkirim! Ini adalah Portal Tugas Kelas resmi sekolahmu. Situs ini aman (HTTPS) dan berada di bawah pengawasan guru sekolahmu. Jika kamu menutup situs ini tanpa mengirim tugas, kamu akan dianggap belum mengerjakan tugas, mendapat nilai nol (0), dan tertinggal pelajaran! Situs resmi sekolah dengan https:// dan domain sekolah (.sch.id) aman untuk diisi.",
      feedbackSubmit: "Hebat! Kamu mengumpulkan tugas sekolahmu dengan benar. Situs ini menggunakan domain resmi sekolah (.sch.id) dan protokol HTTPS aman. Mengirimkan nama, kelas, dan tugas ke portal resmi sekolah adalah tindakan yang benar dan aman untuk kelancaran belajarmu!"
    }
  ];

  const updateProgress = (siteIdx: number, action: 'submit' | 'close', isCorrect: boolean) => {
    const nextProgress = {
      ...siteProgress,
      [siteIdx]: { actionTaken: action, isCorrect }
    };
    setSiteProgress(nextProgress);
    
    const allResolved = Object.values(nextProgress).every(s => s.actionTaken !== null);
    const score = Object.values(nextProgress).filter(s => s.isCorrect).length;
    
    onSave?.({
      ...answers,
      siteProgress: nextProgress,
      _completed: allResolved,
      score: score,
    });
  };

  const handleConfirm = () => {
    const next = { ...answers, siteProgress, _submitted: true };
    onSave?.(next);
    setSubmitted(true);
  };

  const handleCleanVirus = () => {
    setVirusInfected(false);
    updateProgress(activeSite, 'submit', false);
  };

  const handleExitSite = () => {
    if (submitted) return;
    const isCorrect = !sites[activeSite].isSecure;
    updateProgress(activeSite, 'close', isCorrect);
  };

  const submitSite1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form1.username || !form1.password || !form1.phoneOtp) {
      alert('Harap isi semua kolom formulir!');
      return;
    }
    setVirusReason("Akun game Roblox-mu terancam dibobol dan nomor HP orang tuamu disalahgunakan untuk penipuan berlangganan SMS premium karena situs palsu ini!");
    setVirusInfected(true);
  };

  const submitSite2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form2.fullName || !form2.address || !form2.parentPhone) {
      alert('Harap isi semua kolom formulir!');
      return;
    }
    setVirusReason("Data alamat rumah fisikmu bocor ke pihak tidak dikenal! Orang asing bermotif jahat kini mengetahui lokasi tinggalmu.");
    setVirusInfected(true);
  };

  const submitSite3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form3.usernameAnbk || !form3.passwordAnbk || !form3.participantNo) {
      alert('Harap isi semua kolom formulir!');
      return;
    }
    updateProgress(activeSite, 'submit', true);
  };

  const submitSite4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form4.fbEmail || !form4.fbPassword) {
      alert('Harap isi semua kolom formulir!');
      return;
    }
    setVirusReason("Akun Facebook kamu berhasil dibajak! Hacker mencuri login Facebook-mu dan bisa menyalahgunakannya untuk menipu teman-temanmu.");
    setVirusInfected(true);
  };

  const submitSite5 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form5.name || !form5.classRoom || !form5.absentNo) {
      alert('Harap isi semua kolom formulir!');
      return;
    }
    updateProgress(activeSite, 'submit', true);
  };

  const activeSiteData = sites[activeSite];
  const activeProgress = siteProgress[activeSite] || { actionTaken: null, isCorrect: false };
  const totalAnalyzed = Object.values(siteProgress).filter(s => s.actionTaken !== null).length;
  const correctCount = Object.values(siteProgress).filter(s => s.actionTaken !== null && s.isCorrect).length;
  const allResolved = totalAnalyzed === 5;

  return (
    <div className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-card space-y-5 relative overflow-hidden">
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); } 20%, 40%, 60%, 80% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        @keyframes glitch-color { 0% { text-shadow: 2px 0 0 #ff00c1, -2px 0 0 #00fff0; } 100% { text-shadow: -2px 0 0 #ff00c1, 2px 0 0 #00fff0; } }
        .animate-glitch-text { animation: glitch-color 0.2s infinite alternate; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes spin-slow { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>

      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">
          Eksplorasi · Aktivitas 4
        </span>
        <h3 className="font-display font-bold text-lg text-primary-800 mt-1">
          Simulasi Mengisi Situs Cerdas
        </h3>
        <p className="text-sm text-primary-505 mt-2 leading-relaxed">
          Pada simulasi ini, kamu berperan sebagai pengguna internet. Periksa <b>protokol URL (HTTP vs HTTPS)</b>, 
          <b>domain alamat situs</b>, dan <b>jenis informasi pribadi yang diminta</b> pada setiap tab di bawah. 
          Putuskan apakah situs tersebut aman diisi (klik tombol kirim data) atau harus dihindari (klik tombol ❌ Tutup Tab).
        </p>
      </div>

      {/* Progress & Stat Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-bold text-slate-500 px-1">
        <div className="flex items-center gap-1.5">
          <span>🖥️ Browser Evaluasi Situs</span>
        </div>
        <div className="bg-emerald-50/60 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 flex items-center gap-2 font-mono text-[11px]">
          <span>Analisis: <b>{totalAnalyzed}/5</b></span>
          <span className="text-emerald-250">|</span>
          <span>Benar: <b>{correctCount}/5</b></span>
        </div>
      </div>

      {/* Browser Window Mockup */}
      <div className={`border rounded-2xl overflow-hidden min-h-[500px] flex flex-col bg-slate-100 transition-all ${
        virusInfected ? 'animate-shake border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.35)]' : 'border-slate-350 shadow-md'
      }`}>
        
        {/* Browser Tabs Bar */}
        <div className="bg-slate-250 px-2 pt-2 flex gap-1 border-b border-slate-300 overflow-x-auto scrollbar-none flex-row shrink-0">
          {sites.map((s, idx) => {
            const prog = siteProgress[idx] || { actionTaken: null, isCorrect: false };
            const isFinished = prog.actionTaken !== null;
            const isActive = activeSite === idx;
            
            let statusEmoji = "⚫";
            if (isFinished) {
              statusEmoji = prog.isCorrect ? "✅" : "❌";
            }
            
            return (
              <button 
                key={idx} 
                onClick={() => {
                  if (!virusInfected) setActiveSite(idx);
                }}
                className={`px-3 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border-t border-x ${
                  isActive 
                    ? 'bg-slate-50 text-slate-800 border-slate-300 font-extrabold shadow-sm' 
                    : 'bg-slate-200/70 text-slate-500 border-transparent hover:bg-slate-100/50'
                }`}
              >
                <span>{statusEmoji}</span>
                <span className="hidden sm:inline">{s.name}</span>
                <span className="sm:hidden">{s.name.split(" ")[1] || s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Browser Navigation Toolbar */}
        <div className="bg-slate-200 px-3 py-2 border-b border-slate-300 flex items-center gap-3 select-none flex-row shrink-0">
          {/* Mac-style traffic lights */}
          <div className="flex gap-1.5 flex-row shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 block" />
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0 flex-row">
            <span className="text-xs font-bold opacity-30 select-none">←</span>
            <span className="text-xs font-bold opacity-30 select-none">→</span>
            <RefreshCw className="h-3 w-3 opacity-40" />
          </div>

          {/* Address Bar */}
          <div className="bg-white rounded-lg px-2.5 py-1 flex-1 border border-slate-300 flex items-center gap-2 truncate shadow-inner flex-row">
            {activeSiteData.isSecure ? (
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md text-[8px] font-bold shrink-0">
                <Lock className="h-2 w-2" />
                <span>Aman</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md text-[8px] font-bold shrink-0">
                <AlertTriangle className="h-2 w-2" />
                <span>Bahaya</span>
              </div>
            )}
            
            {/* Highlight Domain */}
            <div className="text-[10px] font-mono text-slate-700 flex-1 truncate text-left">
              {activeSiteData.isSecure ? (
                <>
                  <span className="text-slate-400">https://</span>
                  <span className="font-bold text-slate-800">
                    {activeSiteData.url.replace("https://", "").split("/")[0]}
                  </span>
                  <span className="text-slate-400">
                    /{activeSiteData.url.replace("https://", "").split("/").slice(1).join("/")}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-slate-400">http://</span>
                  <span className="font-bold text-rose-700">
                    {activeSiteData.url.replace("http://", "").split("/")[0]}
                  </span>
                  <span className="text-slate-400">
                    /{activeSiteData.url.replace("http://", "").split("/").slice(1).join("/")}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Close Tab Action Button */}
          <button 
            disabled={activeProgress.actionTaken !== null || virusInfected} 
            onClick={handleExitSite} 
            className={`font-display font-extrabold text-[10px] px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1 shrink-0 ${
              activeProgress.actionTaken !== null || virusInfected
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                : 'bg-rose-50 text-rose-600 border-rose-250 hover:bg-rose-650 hover:text-white hover:border-rose-650 active:scale-95 shadow-sm'
            }`}
          >
            <span>❌</span>
            <span>Tutup Tab</span>
          </button>
        </div>

        {/* Website Content Viewport */}
        <div className="flex-1 p-4 relative bg-white flex flex-col justify-center min-h-[380px]">
          
          {/* Overlay Case 1: Virus Infected Screen */}
          {virusInfected ? (
            <div className="absolute inset-0 bg-slate-950 text-red-500 p-6 z-20 overflow-y-auto flex flex-col font-mono text-left space-y-4">
              <div className="text-center border-b border-red-900 pb-3 shrink-0">
                <h1 className="font-black text-xs sm:text-sm tracking-widest text-red-500 animate-pulse animate-glitch-text">
                  🚨 SYSTEM SECURITY ALERT: DATA DIBOBOBOL! 🚨
                </h1>
                <p className="text-[9px] text-red-400 mt-1">PROTOKOL KEAMANAN DIHACK · VIRUS TERDETEKSI</p>
              </div>

              {/* simulated logs */}
              <div className="bg-red-950/20 border border-red-900 rounded-lg p-3 text-[9px] sm:text-[10px] space-y-1 text-red-400 font-mono flex-1 overflow-y-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 block animate-ping" />
                  <span>[ATTACK] Domain Phishing: <span className="underline">{activeSiteData.url}</span></span>
                </div>
                <div>[STATUS] Mengirim kredensial pengguna ke server luar...</div>
                <div className="text-red-300 font-bold">↳ credential_leak: SUCCESS</div>
                <div className="text-red-300 font-bold">↳ private_data_captured: SUCCESS</div>
                <div>[SYSTEM] Menulis virus trojan ke direktori lokal...</div>
                <div>[DANGER] Alamat IP penyerang terhubung: 198.51.100.42</div>
                <div className="text-red-200 mt-2 border-t border-red-900/50 pt-2 font-sans text-xs">
                  <b>Dampak Berbahaya:</b> {virusReason}
                </div>
              </div>

              <div className="space-y-2 pt-2 shrink-0">
                <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 text-[10px] sm:text-xs leading-relaxed text-red-300 font-sans text-center">
                  💡 <b>Pelajaran:</b> Situs palsu (phishing) dibuat semirip mungkin untuk memancing emosi seperti kuis berhadiah, robux gratis, atau lomba palsu. Jangan pernah memasukkan sandi atau data sensitif di web tidak aman (HTTP).
                </div>
                
                <button 
                  onClick={handleCleanVirus} 
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-98 transition-all py-2.5 rounded-xl text-white font-bold font-sans text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>🛡️ Pasang Antivirus & Bersihkan Sistem</span>
                </button>
              </div>
            </div>

          /* Overlay Case 2: Action Resolved (Feedback Screen) */
          ) : activeProgress.actionTaken !== null ? (
            <div className="absolute inset-0 z-10 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-slate-200">
              <div className={`w-full max-w-md rounded-2xl border p-5 space-y-4 text-center ${
                activeProgress.isCorrect 
                  ? 'border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'border-rose-500/40 bg-rose-950/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              }`}>
                {/* Status Icon */}
                <div className="flex justify-center">
                  {activeProgress.isCorrect ? (
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400">
                      <ShieldAlert className="h-9 w-9" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className={`font-display font-extrabold text-sm sm:text-base uppercase tracking-wider ${
                    activeProgress.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {activeProgress.isCorrect ? 'Analisis Tepat! ✅' : 'Keputusan Kurang Aman! ❌'}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono">
                    Tindakan: {activeProgress.actionTaken === 'close' ? 'Menutup Tab (Keluar)' : 'Mengisi & Mengirim Formulir'}
                  </p>
                </div>

                {/* Analysis Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-left text-xs leading-relaxed space-y-1.5">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-widest block">
                    🔍 Ulasan Analisis:
                  </span>
                  <p className="text-slate-350 text-[11px] sm:text-xs">
                    {activeProgress.actionTaken === 'close' ? activeSiteData.feedbackClose : activeSiteData.feedbackSubmit}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  💡 Klik tab nomor situs lain di atas untuk melanjutkan evaluasi.
                </div>
              </div>
            </div>

          /* Standard Case: Render Active Site Content */
          ) : (
            <div className="w-full flex-1 flex flex-col justify-center">
              {/* Site 0: Roblox Phishing */}
              {activeSite === 0 && (
                <div className="bg-slate-950 text-white rounded-xl p-5 border border-slate-800 relative overflow-hidden flex flex-col items-center text-center space-y-4">
                  {/* Glowing hexagonal Robux icon */}
                  <div className="relative w-16 h-16 animate-spin-slow my-1 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-full border-4 border-yellow-200 flex items-center justify-center shadow-lg transform rotate-45">
                      <span className="font-black text-xl text-slate-900 -rotate-45 select-none">R$</span>
                    </div>
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-yellow-400 tracking-wider uppercase animate-pulse">
                      🎁 HADIAH 10.000 ROBUX GRATIS INDONESIA 🎁
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Promo Terbatas Khusus Murid Sekolah Hari Ini!
                    </p>
                  </div>

                  <form onSubmit={submitSite1} className="w-full max-w-xs space-y-2 bg-slate-900 border border-yellow-500/10 p-3.5 rounded-xl text-left">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400">Username Akun Roblox</label>
                      <input 
                        required 
                        placeholder="Contoh: RakaGamer77" 
                        className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-650 font-mono focus:outline-none" 
                        onChange={e => setForm1({...form1, username: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400">Kata Sandi Roblox (Password)</label>
                      <input 
                        required 
                        type="password" 
                        placeholder="Kata sandi akun Roblox-mu..." 
                        className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-655 font-mono focus:outline-none" 
                        onChange={e => setForm1({...form1, password: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400">Nomor HP Orang Tua (Konfirmasi Penerima)</label>
                      <input 
                        required 
                        placeholder="Contoh: 0812-xxxx-xxxx" 
                        className="w-full bg-slate-950 border border-slate-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-slate-655 font-mono focus:outline-none" 
                        onChange={e => setForm1({...form1, phoneOtp: e.target.value})} 
                      />
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-105 text-slate-950 text-xs font-black rounded-lg transition-all shadow-md mt-2 uppercase">
                      Klaim Robux Gratis Saya 🎮
                    </button>
                  </form>
                </div>
              )}

              {/* Site 1: Lomba Menggambar Phishing */}
              {activeSite === 1 && (
                <div className="bg-gradient-to-br from-indigo-100 via-pink-50 to-amber-50 rounded-xl p-5 border border-indigo-100 flex flex-col items-center text-center space-y-4">
                  {/* Drawing Easel illustration */}
                  <div className="relative w-16 h-12 animate-float my-1 shrink-0 flex items-center justify-center">
                    <div className="absolute w-1.5 h-12 bg-amber-700 rounded transform -rotate-12 left-6"></div>
                    <div className="absolute w-1.5 h-12 bg-amber-700 rounded transform rotate-12 right-6"></div>
                    <div className="absolute w-16 h-9 bg-white rounded border border-amber-800 shadow-sm flex items-center justify-center">
                      <span className="text-sm">🎨🖌️</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-indigo-900 tracking-tight">
                      🏆 LOMBA MENGGAMBAR NASIONAL KREATIF 🏆
                    </h4>
                    <p className="text-[9px] text-fuchsia-600 font-bold uppercase tracking-wider">
                      Menangkan Hadiah Laptop & Beasiswa Uang Tunai!
                    </p>
                  </div>

                  <form onSubmit={submitSite2} className="w-full max-w-xs space-y-2 bg-white/95 border border-indigo-50 p-3.5 rounded-xl text-left">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-600">Nama Lengkap Siswa</label>
                      <input 
                        required 
                        placeholder="Nama lengkap sesuai rapor sekolah..." 
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                        onChange={e => setForm2({...form2, fullName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-600">Alamat Rumah Lengkap (Untuk Pengiriman)</label>
                      <input 
                        required 
                        placeholder="Nama jalan, RT/RW, nomor rumah..." 
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                        onChange={e => setForm2({...form2, address: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-600">Nomor HP Orang Tua</label>
                      <input 
                        required 
                        placeholder="Contoh: 0812-xxxx-xxxx" 
                        className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                        onChange={e => setForm2({...form2, parentPhone: e.target.value})} 
                      />
                    </div>
                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-md mt-2">
                      Daftar Lomba & Kirim Gambar 🚀
                    </button>
                  </form>
                </div>
              )}

              {/* Site 2: Portal ANBK (Real, Secure) */}
              {activeSite === 2 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                  {/* Flag Ribbon and Header */}
                  <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-3.5 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center border border-white font-bold text-slate-900 text-xs shrink-0 select-none">
                      🇮🇩
                    </div>
                    <div className="text-left">
                      <h5 className="font-extrabold text-[8px] uppercase tracking-wider text-amber-300">
                        Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
                      </h5>
                      <h4 className="font-bold text-xs uppercase tracking-tight text-white leading-tight">
                        Portal Asesmen Nasional (ANBK) Siswa
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col items-center space-y-3">
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase border border-blue-100 inline-block">
                        Portal Resmi Ujian Sekolah
                      </span>
                    </div>

                    <form onSubmit={submitSite3} className="w-full max-w-xs space-y-2 bg-white border border-slate-200 p-3.5 rounded-xl text-left shadow-sm">
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-655">Username ANBK Siswa</label>
                        <input 
                          required 
                          placeholder="Username ANBK (contoh: U0305xxxx)" 
                          className="w-full bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono" 
                          onChange={e => setForm3({...form3, usernameAnbk: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-655">Token Ujian (Minta ke Pengawas)</label>
                        <input 
                          required 
                          type="password" 
                          placeholder="Token 6 digit dari papan tulis..." 
                          className="w-full bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono" 
                          onChange={e => setForm3({...form3, passwordAnbk: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-655">Nomor Peserta Ujian</label>
                        <input 
                          required 
                          placeholder="Contoh: 1-26-02-xxxx-xxxx" 
                          className="w-full bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none font-mono" 
                          onChange={e => setForm3({...form3, participantNo: e.target.value})} 
                        />
                      </div>
                      <button className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-all shadow-md mt-2">
                        Masuk Portal Ujian & Mulai 📝
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Site 3: Kuis Facebook Phishing */}
              {activeSite === 3 && (
                <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
                  {/* Glowing Crystal Ball */}
                  <div className="relative w-16 h-16 animate-float my-1 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-indigo-400 to-purple-500 rounded-full border border-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center">
                      <span className="text-xl animate-pulse">🔮</span>
                    </div>
                    <div className="absolute w-10 h-3 bg-amber-700 rounded bottom-0 left-3"></div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-cyan-300 tracking-wide uppercase">
                      🔮 KUIS INSTAN: WAJAH HEWAN KEREN KEPRIBADIANMU! 🔮
                    </h4>
                    <p className="text-[9px] text-purple-200">
                      Cari tahu hewan pelindung jiwamu secara instan!
                    </p>
                  </div>

                  <form onSubmit={submitSite4} className="w-full max-w-xs space-y-2 bg-white text-slate-800 p-3.5 rounded-xl text-left shadow-lg border border-slate-200">
                    <div className="border-b border-slate-100 pb-1.5 text-center">
                      <span className="text-xs font-extrabold text-blue-600 tracking-tight flex items-center justify-center gap-1">
                        <span className="bg-blue-650 text-white font-mono font-black w-4.5 h-4.5 rounded flex items-center justify-center text-[10px]">f</span>
                        Masuk dengan Facebook
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-500">Email atau Nomor HP Facebook</label>
                      <input 
                        required 
                        placeholder="Email atau nomor HP Facebook..." 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none" 
                        onChange={e => setForm4({...form4, fbEmail: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-500">Kata Sandi Facebook (Password)</label>
                      <input 
                        required 
                        type="password" 
                        placeholder="Masukkan sandi Facebook kamu..." 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none" 
                        onChange={e => setForm4({...form4, fbPassword: e.target.value})} 
                      />
                    </div>
                    <button className="w-full py-2 bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold rounded transition-all shadow-md mt-2 uppercase">
                      Login & Mulai Kuis Hewan 🦁
                    </button>
                  </form>
                </div>
              )}

              {/* Site 4: Portal Tugas Kelas (Real, Secure) */}
              {activeSite === 4 && (
                <div className="bg-teal-50/40 border border-teal-100 rounded-xl overflow-hidden flex flex-col">
                  {/* School Header */}
                  <div className="bg-teal-800 text-white p-3 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-teal-600 text-base shrink-0 select-none">
                      🏫
                    </div>
                    <div className="text-left">
                      <h5 className="font-extrabold text-[8px] uppercase tracking-wider text-teal-300">
                        Portal Tugas Resmi Sekolah
                      </h5>
                      <h4 className="font-bold text-xs uppercase tracking-tight text-white leading-tight">
                        SD Negeri Harapan Indah - Kelas 6
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col items-center space-y-3">
                    {/* CSS Notebook illustration */}
                    <div className="relative w-16 h-10 animate-float my-1 shrink-0 flex items-center justify-center">
                      <div className="absolute w-12 h-8 bg-amber-400 rounded border border-amber-500 transform -rotate-6 translate-y-0.5"></div>
                      <div className="absolute w-12 h-8 bg-teal-500 rounded border border-teal-600 transform rotate-3 flex items-center justify-center text-[10px]">
                        📝
                      </div>
                    </div>

                    <form onSubmit={submitSite5} className="w-full max-w-xs space-y-2 bg-white border border-teal-150 p-3.5 rounded-xl text-left shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-600">Nama Lengkap</label>
                          <input 
                            required 
                            placeholder="Nama siswa..." 
                            className="w-full bg-white border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                            onChange={e => setForm5({...form5, name: e.target.value})} 
                          />
                        </div>
                        <div className="space-y-0.5">
                          <label className="text-[9px] font-bold text-slate-600">Kelas</label>
                          <input 
                            required 
                            placeholder="Contoh: 6-A" 
                            className="w-full bg-white border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                            onChange={e => setForm5({...form5, classRoom: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-600">Nomor Urut Absen</label>
                        <input 
                          required 
                          type="number"
                          placeholder="Nomor absen kamu..." 
                          className="w-full bg-white border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 rounded-lg px-2 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none" 
                          onChange={e => setForm5({...form5, absentNo: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] font-bold text-slate-600">Berkas Lampiran (Simulasi)</label>
                        <div className="border border-dashed border-teal-200 rounded p-2 bg-teal-50/30 text-center">
                          <span className="text-[8px] font-bold text-teal-800 block">📄 ringkasan_tugas_keamanan.pdf</span>
                          <span className="text-[7px] text-slate-400">Terlampir otomatis dari perangkat sekolah</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all shadow-md mt-2">
                        Kirim Tugas Saya 🚀
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Completion & Submit Section */}
      {!allResolved ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/80 border border-amber-250 rounded-2xl py-3.5 px-4 text-amber-900 text-xs font-medium text-left">
          <div className="flex items-center gap-2 flex-row">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Kamu baru mengevaluasi <b>{totalAnalyzed} dari 5</b> situs. Evaluasi semua situs di atas terlebih dahulu untuk membuka pengiriman jawaban.</span>
          </div>
          <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider shrink-0">
            Belum Selesai
          </div>
        </div>
      ) : (
        <SaveSection submitted={submitted} onConfirm={handleConfirm} />
      )}
    </div>
  );
}
