// ──────────────────────────────────────────────
// SiberCerdas – Badge Definitions
// ──────────────────────────────────────────────
import type { Badge } from '../types';

export const topicBadges: Badge[] = [
  {
    id: 'badge-identitas-digital',
    name: 'Penjaga Identitas Digital',
    description:
      'Kamu berhasil memahami cara menjaga identitas digitalmu dengan bijak!',
    emoji: 'ID',
    imageUrl: '/gambar/lencana-penjaga-identitas-digital.png',
    color: 'bg-indigo-500',
    topicId: 'topik-1',
    requirement: 'Selesaikan semua langkah di Topik 1: Aku Cerdas di Dunia Digital',
  },
  {
    id: 'badge-detektif-fakta',
    name: 'Detektif Fakta',
    description:
      'Kamu sudah jago membedakan berita benar dan hoaks. Hebat!',
    emoji: 'FK',
    imageUrl: '/gambar/lencana-detektif-fakta.png',
    color: 'bg-amber-500',
    topicId: 'topik-2',
    requirement: 'Selesaikan semua langkah di Topik 2: Benar atau Meragukan? Yuk, Cek Dulu!',
  },
  {
    id: 'badge-guardian-privasi',
    name: 'Guardian Privasi',
    description:
      'Kamu tahu cara menjaga data pribadimu agar tetap aman di internet!',
    emoji: 'PR',
    imageUrl: '/gambar/lencana-guardian-privasi.png',
    color: 'bg-emerald-500',
    topicId: 'topik-3',
    requirement: 'Selesaikan semua langkah di Topik 3: Data Pribadiku, Rahasiaku',
  },
  {
    id: 'badge-ksatria-siber',
    name: 'Kesatria Siber',
    description:
      'Kamu berhasil menghadapi ancaman di dunia maya. Keren!',
    emoji: 'KS',
    imageUrl: '/gambar/lencana-ksatria-siber.png',
    color: 'bg-red-500',
    topicId: 'topik-4',
    requirement: 'Selesaikan semua langkah di Topik 4: Awas, Jangan Asal Klik!',
  },
  {
    id: 'badge-duta-santun',
    name: 'Duta Santun Digital',
    description:
      'Kamu sudah memahami cara berkomunikasi dengan sopan di dunia digital!',
    emoji: 'SN',
    imageUrl: '/gambar/lencana-duta-santun-digital.png',
    color: 'bg-sky-500',
    topicId: 'topik-5',
    requirement: 'Selesaikan semua langkah di Topik 5: Santun Berbicara di Dunia Digital',
  },
  {
    id: 'badge-sahabat-digital',
    name: 'Sahabat Digital',
    description:
      'Kamu tahu cara menjadi teman yang baik di media sosial dan dunia daring!',
    emoji: 'SD',
    imageUrl: '/gambar/lencana-sahabat-digital.png',
    color: 'bg-pink-500',
    topicId: 'topik-6',
    requirement: 'Selesaikan semua langkah di Topik 6: Jadi Teman Baik di Dunia Digital',
  },
  {
    id: 'badge-pelindung-karya',
    name: 'Pelindung Karya',
    description:
      'Kamu menghargai karya orang lain dan mengerti hak cipta. Salut!',
    emoji: 'HC',
    imageUrl: '/gambar/lencana-pelindung-karya.png',
    color: 'bg-orange-500',
    topicId: 'topik-7',
    requirement: 'Selesaikan semua langkah di Topik 7: Menghargai Karya, Tidak Asal Ambil',
  },
  {
    id: 'badge-kreator-cerdas',
    name: 'Kreator Cerdas',
    description:
      'Kamu siap berkarya dengan aman dan bertanggung jawab di dunia digital!',
    emoji: 'KR',
    imageUrl: '/gambar/lencana-kreator-cerdas.png',
    color: 'bg-violet-500',
    topicId: 'topik-8',
    requirement: 'Selesaikan semua langkah di Topik 8: Berkarya Aman di Dunia Digital',
  },
];

export const specialBadges: Badge[] = [
  {
    id: 'badge-juara-kuis',
    name: 'Juara Kuis',
    description:
      'Sempurna! Kamu mendapatkan nilai 100 di salah satu kuis. Kamu memang jago!',
    emoji: 'JK',
    imageUrl: '/gambar/lencana-juara-kuis.png',
    color: 'bg-amber-400',
    requirement: 'Dapatkan skor 100 pada salah satu Uji Pemahaman',
  },
  {
    id: 'badge-super-kuis-3-topik',
    name: 'Super Kuis',
    description:
      'Kamu mendapatkan nilai 100 pada Uji Pemahaman di 3 topik berbeda. Luar biasa!',
    emoji: 'SK',
    imageUrl: '/gambar/lencana-super-kuis-3-topik.png',
    color: 'bg-fuchsia-500',
    requirement: 'Dapatkan nilai 100 pada 3 topik dari 8 topik yang tersedia',
  },
  {
    id: 'badge-sang-juara',
    name: 'Sang Juara',
    description:
      'Hebat! Kamu mendapatkan nilai 100 pada Uji Pemahaman di 5 topik berbeda.',
    emoji: 'SJ',
    imageUrl: '/gambar/lencana-sang-juara.gif',
    color: 'bg-yellow-500',
    requirement: 'Dapatkan nilai 100 pada 5 topik dari 8 topik yang tersedia',
  },
  {
    id: 'badge-sempurna',
    name: 'Sempurna',
    description:
      'Kamu mengumpulkan semua lencana topik! Kamu benar-benar cerdas di dunia digital!',
    emoji: 'SP',
    imageUrl: '/gambar/lencana-sempurna.png',
    color: 'bg-gradient-to-r from-violet-500 to-pink-500',
    requirement: 'Kumpulkan semua 8 lencana topik',
  },
];

/** All badges combined – topic badges first, then specials */
export const allBadges: Badge[] = [...topicBadges, ...specialBadges];

/** Quick lookup by badge ID */
export const badgeMap: Record<string, Badge> = Object.fromEntries(
  allBadges.map((b) => [b.id, b]),
);
