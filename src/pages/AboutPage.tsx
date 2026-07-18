
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Award, BookOpen, Shield, FileText, Library, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AboutPage() {
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    const [isZoomed, setIsZoomed] = useState(false);

    const handleBack = () => {
        if (user && userProfile) {
            navigate(userProfile.role === 'guru' ? '/guru' : '/siswa');
        } else {
            navigate('/login');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } as any },
    };

    return (
        <div className="min-h-screen bg-surface-50 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Navigation Back */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 rounded-full border border-surface-200 bg-white px-5 py-2.5 text-sm font-bold text-primary-600 shadow-card transition-all hover:bg-primary-50 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </button>
                    <span className="rounded-full border border-surface-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-card">
                        TENTANG APLIKASI
                    </span>
                </div>

                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-sticker-indigo p-8 text-center text-white shadow-card md:flex-row md:p-10 md:text-left"
                >
                    <div className="pointer-events-none absolute right-6 top-5 h-8 w-20 -rotate-3 rounded-full border border-white/20 bg-white/10" />
                    <div className="pointer-events-none absolute bottom-5 left-8 h-9 w-9 rotate-6 rounded-xl border border-sticker-purple/40 bg-sticker-purple/20" />

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white p-3 shadow-card">
                        <img src="/logo.png" alt="Logo SiberCerdas" className="h-full w-full object-contain" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight leading-none">
                            SiberCerdas
                        </h1>
                        <p className="max-w-xl text-sm font-medium text-white/80 md:text-base">
                            Platform pembelajaran literasi digital interaktif bersistem gamifikasi yang dirancang khusus untuk peserta didik tingkat sekolah dasar (usia 11-12 tahun) guna mengenalkan etika, privasi, keamanan, dan toleransi di dunia siber.
                        </p>
                    </div>
                </motion.div>

                {/* Info Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Card 1: Visi Misi */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
                    >
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-100">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-base text-surface-900">
                            Misi Edukasi
                        </h3>
                        <p className="text-xs text-surface-600 leading-relaxed">
                            Membentuk generasi emas Indonesia yang cerdas, kritis, santun, dan produktif dalam menggunakan teknologi informasi serta peka terhadap bahaya penipuan siber.
                        </p>
                    </motion.div>

                    {/* Card 2: Privasi Anak */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
                    >
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-100">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-base text-surface-900">
                            Keamanan Privasi Anak
                        </h3>
                        <p className="text-xs text-surface-600 leading-relaxed">
                            Kami berkomitmen penuh menjaga privasi anak. Pendaftaran siswa dilakukan secara anonim tanpa memerlukan data email pribadi, lokasi, atau informasi privat lainnya.
                        </p>
                    </motion.div>

                    {/* Card 3: Pendekatan Gamifikasi */}
                    <motion.div
                        variants={itemVariants}
                        className="space-y-4 rounded-2xl border border-surface-200 bg-white p-6 shadow-card"
                    >
                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-100">
                            <Award className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-base text-surface-900">
                            Belajar Sambil Bermain
                        </h3>
                        <p className="text-xs text-surface-600 leading-relaxed">
                            Melalui simulasi interaktif siber yang aman, anak-anak belajar membuat keputusan langsung dan menguji pemahamannya demi mendapatkan lencana penghargaan petualang digital.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Landasan & Acuan Kurikulum */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative space-y-5 overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card md:p-8"
                >
                    <div className="pointer-events-none absolute right-6 top-5 h-8 w-20 -rotate-3 rounded-full border border-sticker-purple/30 bg-sticker-purple/10" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center border border-primary-100">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-black text-lg text-surface-900">
                            Landasan &amp; Acuan Kurikulum
                        </h3>
                    </div>
                    <div className="space-y-4 text-xs text-surface-600 leading-relaxed">
                        <p>
                            Materi <strong>SiberCerdas</strong> disusun mengacu pada <strong>Capaian Pembelajaran (CP) elemen Literasi Digital</strong> (Keputusan BSKAP No. 46/H/KR/2025) untuk akhir <strong>Fase C</strong>, yang menekankan kemampuan siswa untuk: (1) menerapkan pengamanan informasi pribadi dalam komunikasi daring; (2) memanfaatkan internet secara bijak; serta (3) memproduksi dan mendiseminasi konten digital dalam bentuk teks dan gambar.
                        </p>
                        <p>
                            Pengembangan juga diselaraskan dengan <strong>Panduan Implementasi Pendidikan Keamanan Siber</strong> (Pusat Kurikulum dan Pembelajaran, Kemendikdasmen, 2026) beserta lima elemen kompetensinya: Kesadaran Keamanan Siber; Pelindungan Data Pribadi &amp; Jejak Digital; Etika &amp; Perilaku Digital; Keterampilan Teknis Keamanan Siber; dan Kesadaran Hukum di Ruang Siber.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-semibold text-primary-600">
                                BSKAP No. 46/H/KR/2025
                            </span>
                            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-semibold text-indigo-600">
                                Panduan Kemendikdasmen 2026
                            </span>
                            <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-semibold text-emerald-600">
                                Perpres 47/2023
                            </span>
                            <span className="px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-semibold text-amber-600">
                                PP 17/2025 (PP Tunas)
                            </span>
                            <span className="px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-[10px] font-semibold text-rose-600">
                                Perpres 87/2025
                            </span>
                            <span className="px-3 py-1 bg-sky-50 border border-sky-100 rounded-full text-[10px] font-semibold text-sky-600">
                                UU ITE &amp; UU PDP
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Daftar Pustaka */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative space-y-5 overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card md:p-8"
                >
                    <div className="pointer-events-none absolute right-6 top-5 h-8 w-20 -rotate-3 rounded-full border border-sticker-indigo/30 bg-sticker-indigo/10" />
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center border border-primary-100">
                            <Library className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-black text-lg text-surface-900">
                            Daftar Pustaka
                        </h3>
                    </div>
                    <p className="text-xs text-surface-600 leading-relaxed">
                        Materi <strong>SiberCerdas</strong> disusun dengan merujuk pada dokumen kebijakan dan peraturan resmi berikut:
                    </p>
                    <ol className="space-y-3 text-xs text-surface-700 leading-relaxed">
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">1</span>
                            <span className="flex-1">Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2025). <em>Keputusan BSKAP No. 46/H/KR/2025</em> — Capaian Pembelajaran (termasuk elemen Literasi Digital, Fase C). Kementerian Pendidikan Dasar dan Menengah.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">2</span>
                            <span className="flex-1">Pusat Kurikulum dan Pembelajaran, BSKAP. (2026). <em>Panduan Implementasi Pendidikan Keamanan Siber untuk Satuan Pendidikan dan Pemangku Kepentingan</em>. Kementerian Pendidikan Dasar dan Menengah Republik Indonesia.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">3</span>
                            <span className="flex-1">Peraturan Presiden Nomor 47 Tahun 2023 tentang Strategi Keamanan Siber Nasional dan Manajemen Krisis Siber.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">4</span>
                            <span className="flex-1">Peraturan Pemerintah Nomor 17 Tahun 2025 tentang Tata Kelola Penyelenggaraan Sistem Elektronik Dalam Pelindungan Anak (PP Tunas).</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">5</span>
                            <span className="flex-1">Peraturan Badan Siber dan Sandi Negara Nomor 5 Tahun 2024 tentang Rencana Aksi Nasional Keamanan Siber Tahun 2024–2028.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">6</span>
                            <span className="flex-1">Peraturan Presiden Nomor 87 Tahun 2025 tentang Peta Jalan Pelindungan Anak di Ranah Dalam Jaringan Tahun 2025–2029.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">7</span>
                            <span className="flex-1">Undang-Undang Informasi dan Transaksi Elektronik (UU ITE).</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[10px] font-bold text-primary-600 border border-primary-100">8</span>
                            <span className="flex-1">Undang-Undang Pelindungan Data Pribadi (UU PDP).</span>
                        </li>
                    </ol>
                </motion.div>

                {/* Tentang Pembuat Aplikasi Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative space-y-6 overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card md:p-8"
                >
                    <div className="pointer-events-none absolute right-6 top-5 h-8 w-20 -rotate-3 rounded-full border border-sticker-teal/30 bg-sticker-teal/10" />
                    <h3 className="font-display font-black text-lg text-surface-900 flex items-center gap-2">
                        Tentang Pembuat Aplikasi
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        {/* Foto Pembuat */}
                        <div
                            onClick={() => setIsZoomed(true)}
                            className="group relative h-24 w-24 shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border-2 border-primary-200 bg-primary-50 shadow-card transition-all hover:scale-105 hover:border-primary-400"
                            title="Klik untuk memperbesar"
                        >
                            <img
                                src="/biodata_developer.jpg"
                                alt="Abraar Dzulqadri"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Zoom</span>
                            </div>
                        </div>

                        {/* Konten Bio */}
                        <div className="space-y-3 text-center md:text-left flex-1">
                            <div>
                                <h4 className="font-display font-bold text-lg text-surface-900">
                                    Abraar Dzulqadri
                                </h4>
                                <p className="text-xs text-surface-500 font-medium mt-0.5">
                                    Magister Pendidikan Dasar, Universitas Jambi
                                </p>
                            </div>
                            <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                                Misi Literasi Digital untuk Masa Depan Bangsa
                            </p>
                            <p className="text-xs text-surface-600 leading-relaxed">
                                Sebagai pendidik dan pengembang <em>edu-tech</em> Indonesia, saya menghadirkan platform <strong>SiberCerdas</strong> sebagai wujud nyata kontribusi dalam gerakan literasi digital nasional. Platform ini dirancang dengan pendekatan pedagogis yang sesuai perkembangan peserta didik sekolah dasar, memadukan desain visual menyenangkan (gamifikasi) dan materi selaras kurikulum nasional, agar anak-anak Indonesia tumbuh dengan kecakapan dan ketahanan digital yang kokoh saat berselancar di dunia siber.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                <span className="px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-semibold text-primary-600">
                                    Magister Pendas UNJA
                                </span>
                                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-semibold text-indigo-600">
                                    Pendidik & Pengembang
                                </span>
                                <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-semibold text-emerald-600">
                                    Ramah Anak SD
                                </span>
                            </div>
                        </div>

                        {/* Logo Universitas */}
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-surface-200 bg-white p-2.5 shadow-card flex items-center justify-center">
                            <img
                                src="/logo_unja.png"
                                alt="Universitas Jambi"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Lightbox Modal */}
                {isZoomed && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-zoom-out"
                        onClick={() => setIsZoomed(false)}
                    >
                        <div
                            className="relative max-w-full max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src="/biodata_developer.jpg"
                                alt="Abraar Dzulqadri Zoomed"
                                className="max-w-[85vw] max-h-[80vh] rounded-lg object-contain md:max-w-md"
                            />
                            <button
                                onClick={() => setIsZoomed(false)}
                                className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 transition-colors shadow-lg active:scale-95"
                                aria-label="Tutup"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
