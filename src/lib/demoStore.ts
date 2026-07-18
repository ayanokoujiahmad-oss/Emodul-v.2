// ──────────────────────────────────────────────────────────
// SiberCerdas – Demo Store (Local Storage DB Fallback)
// ──────────────────────────────────────────────────────────
// Mimics Firestore collections in Demo Mode when Firebase is not
// configured, enabling a 100% operational local preview.
// ──────────────────────────────────────────────────────────

import type {
  StudentAccount,
  StudentProgress,
  StudentTopicResponse,
  TopicGrade,
  ModuleGrade,
  GalleryItem,
  UserProfile,
  Classroom,
} from '../types';

// Prepopulated demo data
const DEFAULT_ACCOUNTS: StudentAccount[] = [
  {
    id: 'demo-acc-001',
    username: 'anicerdas',
    password: '123', // Simple password for testing
    passwordHash: '123',
    displayName: 'Anak Cerdas',
    classId: 'Kelas 6A',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-001',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-001',
    username: 'anindita.zahra',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Anindita Zahra',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-001',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-002',
    username: 'nayyara',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Nayyara Anggun Zhafira',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-002',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-003',
    username: 'adelia',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Adelia Azzahra',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-003',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-004',
    username: 'nadhira',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Nadhira Orlin',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-004',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-005',
    username: 'dafa',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Dafa Zen Nofersa',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-005',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-006',
    username: 'kaysha',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Kaysha Putri Ardani',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-006',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-007',
    username: 'alikanaylaputri',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Alikanaylaputri',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-007',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-008',
    username: 'anindita.zahra2',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Anindita Zahra',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-008',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-009',
    username: 'james',
    password: '123456',
    passwordHash: '123456',
    displayName: 'James Alexsander',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-009',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-010',
    username: 'mahirah',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Mahirah Qurrotaayyun',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-010',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-011',
    username: 'alfaris',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Alfaris',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-011',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-012',
    username: 'jesslyn',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Jesslyn Revita Sintara',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-012',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-013',
    username: 'kinara',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Kinara Azzalea Afsheen',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-013',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-014',
    username: 'andaluzia',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Andaluzia',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-014',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-015',
    username: 'malik',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Malik Al Rasit',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-015',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-016',
    username: 'arjuna',
    password: '123456',
    passwordHash: '123456',
    displayName: 'M ArJuna D',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-016',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-017',
    username: 'algazali',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Algazali',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-017',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-018',
    username: 'weni',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Weni Zahra',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-018',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-019',
    username: 'ola',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Ola Aprilia Cahya',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-019',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-020',
    username: 'farzan',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Farzan Said Kadry',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-020',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-021',
    username: 'felix',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Felix agustinus',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-021',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-022',
    username: 'keysa',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Keysa Zea Ramadhani',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-022',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-5-023',
    username: 'diego',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Diego',
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-5-023',
    createdAt: Date.now(),
    status: 'active',
  }
,
  {
    id: 'demo-acc-6-001',
    username: 'thafana',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Thafana Najwa Kamila',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-001',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-002',
    username: 'faiha',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Faiha Annisa Fathin',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-002',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-003',
    username: 'siti',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Siti Ziya Tusakdiah',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-003',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-004',
    username: 'mifta',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Mifta Hul Jannah',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-004',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-005',
    username: 'desvira',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Desvira Aulia Pratama',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-005',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-006',
    username: 'achmad',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Achmad Luthfi Maulana',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-006',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-007',
    username: 'alpian',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Alpian Faizan Akbar',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-007',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-008',
    username: 'mazam',
    password: '123456',
    passwordHash: '123456',
    displayName: 'M.Azam Al Habhy',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-008',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-009',
    username: 'zikria',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Zikria Yazid Bara',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-009',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-010',
    username: 'mazhar',
    password: '123456',
    passwordHash: '123456',
    displayName: 'M.Azhar Al Ghifari',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-010',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-011',
    username: 'gilang',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Gilang Ramadhan',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-011',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-012',
    username: 'alexnder',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Alexnder pratama',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-012',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-013',
    username: 'robby',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Robby Julio Ramadan',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-013',
    createdAt: Date.now(),
    status: 'active',
  },
  {
    id: 'demo-acc-6-014',
    username: 'muhammad',
    password: '123456',
    passwordHash: '123456',
    displayName: 'Muhammad Akbar Alfarouq',
    classId: 'Kelas 6',
    guruId: 'demo-guru-001',
    studentUid: 'demo-siswa-6-014',
    createdAt: Date.now(),
    status: 'active',
  }
];

const DEFAULT_USERS: UserProfile[] = [
  {
    uid: 'demo-siswa-001',
    displayName: 'Anak Cerdas',
    username: 'anicerdas',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6A',
    avatarEmoji: 'AC',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-001',
    displayName: 'Anindita Zahra',
    username: 'anindita.zahra',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-002',
    displayName: 'Nayyara Anggun Zhafira',
    username: 'nayyara',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'NA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-003',
    displayName: 'Adelia Azzahra',
    username: 'adelia',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-004',
    displayName: 'Nadhira Orlin',
    username: 'nadhira',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'NO',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-005',
    displayName: 'Dafa Zen Nofersa',
    username: 'dafa',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'DZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-006',
    displayName: 'Kaysha Putri Ardani',
    username: 'kaysha',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'KP',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-007',
    displayName: 'Alikanaylaputri',
    username: 'alikanaylaputri',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AL',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-008',
    displayName: 'Anindita Zahra',
    username: 'anindita.zahra2',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-009',
    displayName: 'James Alexsander',
    username: 'james',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'JA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-010',
    displayName: 'Mahirah Qurrotaayyun',
    username: 'mahirah',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'MQ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-011',
    displayName: 'Alfaris',
    username: 'alfaris',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AL',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-012',
    displayName: 'Jesslyn Revita Sintara',
    username: 'jesslyn',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'JR',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-013',
    displayName: 'Kinara Azzalea Afsheen',
    username: 'kinara',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'KA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-014',
    displayName: 'Andaluzia',
    username: 'andaluzia',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AN',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-015',
    displayName: 'Malik Al Rasit',
    username: 'malik',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'MA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-016',
    displayName: 'M ArJuna D',
    username: 'arjuna',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'MA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-017',
    displayName: 'Algazali',
    username: 'algazali',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'AL',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-018',
    displayName: 'Weni Zahra',
    username: 'weni',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'WZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-019',
    displayName: 'Ola Aprilia Cahya',
    username: 'ola',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'OA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-020',
    displayName: 'Farzan Said Kadry',
    username: 'farzan',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'FS',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-021',
    displayName: 'Felix agustinus',
    username: 'felix',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'FA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-022',
    displayName: 'Keysa Zea Ramadhani',
    username: 'keysa',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'KZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-5-023',
    displayName: 'Diego',
    username: 'diego',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 5',
    avatarEmoji: 'DI',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-guru-001',
    displayName: 'mapendas25',
    email: 'mapendas25@unja.com',
    role: 'guru',
    avatarEmoji: 'MP',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-001',
    displayName: 'Thafana Najwa Kamila',
    username: 'thafana',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'TN',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-002',
    displayName: 'Faiha Annisa Fathin',
    username: 'faiha',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'FA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-003',
    displayName: 'Siti Ziya Tusakdiah',
    username: 'siti',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'SZ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-004',
    displayName: 'Mifta Hul Jannah',
    username: 'mifta',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'MH',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-005',
    displayName: 'Desvira Aulia Pratama',
    username: 'desvira',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'DA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-006',
    displayName: 'Achmad Luthfi Maulana',
    username: 'achmad',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'AL',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-007',
    displayName: 'Alpian Faizan Akbar',
    username: 'alpian',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'AF',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-008',
    displayName: 'M.Azam Al Habhy',
    username: 'mazam',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'MA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-009',
    displayName: 'Zikria Yazid Bara',
    username: 'zikria',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'ZY',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-010',
    displayName: 'M.Azhar Al Ghifari',
    username: 'mazhar',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'MA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-011',
    displayName: 'Gilang Ramadhan',
    username: 'gilang',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'GR',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-012',
    displayName: 'Alexnder pratama',
    username: 'alexnder',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'AP',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-013',
    displayName: 'Robby Julio Ramadan',
    username: 'robby',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'RJ',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  },
  {
    uid: 'demo-siswa-6-014',
    displayName: 'Muhammad Akbar Alfarouq',
    username: 'muhammad',
    role: 'siswa',
    guruId: 'demo-guru-001',
    classId: 'Kelas 6',
    avatarEmoji: 'MA',
    createdAt: Date.now(),
    lastLogin: Date.now(),
  }
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
function readKey<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function writeKey<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage:`, err);
  }
}

/* ── Accounts (Students) ────────────────────────────────────────────────── */
export function getDemoAccounts(guruId: string): StudentAccount[] {
  const accounts = readKey<StudentAccount[]>('sibercerdas_demo_accounts', DEFAULT_ACCOUNTS);
  return accounts.filter((a) => a.guruId === guruId);
}

export function saveDemoAccount(account: StudentAccount): void {
  const accounts = readKey<StudentAccount[]>('sibercerdas_demo_accounts', DEFAULT_ACCOUNTS);
  const index = accounts.findIndex((a) => a.id === account.id || a.username === account.username);
  if (index !== -1) {
    accounts[index] = { ...accounts[index], ...account };
  } else {
    accounts.push(account);
  }
  writeKey('sibercerdas_demo_accounts', accounts);
}

export function deleteDemoAccount(id: string): void {
  let accounts = readKey<StudentAccount[]>('sibercerdas_demo_accounts', DEFAULT_ACCOUNTS);
  accounts = accounts.filter((a) => a.id !== id);
  writeKey('sibercerdas_demo_accounts', accounts);
}

/* ── Users (Profiles) ───────────────────────────────────────────────────── */
export function getDemoUser(uid: string): UserProfile | null {
  const users = readKey<UserProfile[]>('sibercerdas_demo_users', DEFAULT_USERS);
  return users.find((u) => u.uid === uid) || null;
}

export function saveDemoUser(profile: UserProfile): void {
  const users = readKey<UserProfile[]>('sibercerdas_demo_users', DEFAULT_USERS);
  const index = users.findIndex((u) => u.uid === profile.uid);
  if (index !== -1) {
    users[index] = { ...users[index], ...profile };
  } else {
    users.push(profile);
  }
  writeKey('sibercerdas_demo_users', users);
}

/* ── Progress ───────────────────────────────────────────────────────────── */
export function getDemoProgressList(studentUid: string): StudentProgress[] {
  return readKey<StudentProgress[]>(`sibercerdas_demo_progress_${studentUid}`, []);
}

export function saveDemoProgress(progress: StudentProgress): void {
  const key = `sibercerdas_demo_progress_${progress.studentUid}`;
  const list = readKey<StudentProgress[]>(key, []);
  const index = list.findIndex((p) => p.topicId === progress.topicId);
  if (index !== -1) {
    list[index] = { ...list[index], ...progress };
  } else {
    list.push(progress);
  }
  writeKey(key, list);
}

/* ── Student Responses / Drafts ─────────────────────────────────────────── */
export function getDemoResponse(studentUid: string, topicId: string): StudentTopicResponse | null {
  const list = readKey<StudentTopicResponse[]>(`sibercerdas_demo_responses_${studentUid}`, []);
  return list.find((r) => r.topicId === topicId) || null;
}

export function getAllDemoResponses(guruId: string): StudentTopicResponse[] {
  // To evaluate student answers, the teacher needs to see answers from students in their class
  // Collect all responses for all students of this teacher
  const accounts = getDemoAccounts(guruId);
  const studentUids = accounts.map((a) => a.studentUid).filter(Boolean) as string[];
  
  const all: StudentTopicResponse[] = [];
  studentUids.forEach((uid) => {
    const list = readKey<StudentTopicResponse[]>(`sibercerdas_demo_responses_${uid}`, []);
    all.push(...list);
  });
  return all;
}

export function saveDemoResponse(response: StudentTopicResponse): void {
  const key = `sibercerdas_demo_responses_${response.studentUid}`;
  const list = readKey<StudentTopicResponse[]>(key, []);
  const index = list.findIndex((r) => r.topicId === response.topicId);
  if (index !== -1) {
    list[index] = { ...list[index], ...response };
  } else {
    list.push(response);
  }
  writeKey(key, list);
}

/* ── Topic Grades (Rubric Evaluations) ──────────────────────────────────── */
export function getDemoGrades(studentUid: string): TopicGrade[] {
  const grades = readKey<TopicGrade[]>('sibercerdas_demo_grades', []);
  return grades.filter((g) => g.uid === studentUid || g.studentUid === studentUid);
}

export function getAllDemoGrades(guruId: string): TopicGrade[] {
  const grades = readKey<TopicGrade[]>('sibercerdas_demo_grades', []);
  return grades.filter((g) => g.guruId === guruId);
}

export function saveDemoGrade(grade: TopicGrade): void {
  const grades = readKey<TopicGrade[]>('sibercerdas_demo_grades', []);
  // unique grade key: studentUid_topicId
  const key = `${grade.uid ?? grade.studentUid}_${grade.topicId}`;
  const index = grades.findIndex((g) => `${g.uid ?? g.studentUid}_${g.topicId}` === key);
  if (index !== -1) {
    grades[index] = { ...grades[index], ...grade };
  } else {
    grades.push(grade);
  }
  writeKey('sibercerdas_demo_grades', grades);
}

/* ── Module Grades (Pre/Post Test) ──────────────────────────────────────── */
export function getDemoModuleGrades(studentUid: string): ModuleGrade[] {
  return readKey<ModuleGrade[]>(`sibercerdas_demo_module_grades_${studentUid}`, []);
}

export function getAllDemoModuleGrades(guruId: string): ModuleGrade[] {
  const accounts = getDemoAccounts(guruId);
  const uids = accounts.map((a) => a.studentUid).filter(Boolean) as string[];
  const all: ModuleGrade[] = [];
  uids.forEach((uid) => {
    all.push(...getDemoModuleGrades(uid));
  });
  return all;
}

export function saveDemoModuleGrade(studentUid: string, grade: ModuleGrade): void {
  const key = `sibercerdas_demo_module_grades_${studentUid}`;
  const list = readKey<ModuleGrade[]>(key, []);
  const index = list.findIndex((g) => g.moduleId === grade.moduleId);
  if (index !== -1) {
    list[index] = { ...list[index], ...grade };
  } else {
    list.push(grade);
  }
  writeKey(key, list);
}

/* ── Class Gallery ──────────────────────────────────────────────────────── */
export function getDemoGalleryItems(): GalleryItem[] {
  return readKey<GalleryItem[]>('sibercerdas_demo_gallery', []);
}

export function saveDemoGalleryItem(item: GalleryItem): void {
  const items = readKey<GalleryItem[]>('sibercerdas_demo_gallery', []);
  const index = items.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...item };
  } else {
    items.unshift(item); // Newer posts first
  }
  writeKey('sibercerdas_demo_gallery', items);
}

export function reactionDemoGallery(id: string, uid: string, reactionType: 'thumbs' | 'hearts'): void {
  const items = readKey<GalleryItem[]>('sibercerdas_demo_gallery', []);
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    const item = items[index];
    const userList = reactionType === 'thumbs' 
      ? (item.thumbsBy || item.likedBy || []) 
      : (item.heartsBy || item.heartedBy || []);

    const hasReacted = userList.includes(uid);
    let newList = [...userList];
    if (hasReacted) {
      newList = newList.filter((u) => u !== uid);
    } else {
      newList.push(uid);
    }

    if (reactionType === 'thumbs') {
      item.thumbsBy = newList;
      if (item.appreciations) item.appreciations.thumbs = newList.length;
    } else {
      item.heartsBy = newList;
      if (item.appreciations) item.appreciations.hearts = newList.length;
    }
    
    items[index] = item;
    writeKey('sibercerdas_demo_gallery', items);
  }
}

export function commentDemoGallery(id: string, comment: any): void {
  const items = readKey<GalleryItem[]>('sibercerdas_demo_gallery', []);
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    const item = items[index];
    const comments = item.comments || [];
    comments.push(comment);
    item.comments = comments;
    if (item.appreciations) item.appreciations.comments = comments.length;
    items[index] = item;
    writeKey('sibercerdas_demo_gallery', items);
  }
}

/* ── Activity Logs ──────────────────────────────────────────────────────── */
export function getDemoActivityLogs(guruId: string): any[] {
  const logs = readKey<any[]>('sibercerdas_demo_activity_logs', []);
  return logs.filter((l) => l.guruId === guruId).slice(0, 15);
}

export function logDemoActivity(guruId: string, studentName: string, action: string, topicTitle: string, studentUid?: string): void {
  const logs = readKey<any[]>('sibercerdas_demo_activity_logs', []);
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    guruId,
    studentUid,
    studentName,
    action,
    topicTitle,
    timestamp: Date.now(),
  };
  logs.unshift(newLog);
  writeKey('sibercerdas_demo_activity_logs', logs.slice(0, 100)); // cap at 100
}

/* ── Classrooms ──────────────────────────────────────────────────────────── */
const DEFAULT_CLASSROOMS: Classroom[] = [
  { id: 'class-001', name: 'Kelas 6A', guruId: 'demo-guru-001', createdAt: Date.now() },
  { id: 'class-002', name: 'Kelas 6B', guruId: 'demo-guru-001', createdAt: Date.now() },
  { id: 'class-003', name: 'Kelas 5', guruId: 'demo-guru-001', createdAt: Date.now() },
  { id: 'class-004', name: 'Kelas 6', guruId: 'demo-guru-001', createdAt: Date.now() }
];

export function getDemoClassrooms(guruId: string): Classroom[] {
  const classes = readKey<Classroom[]>('sibercerdas_demo_classrooms', DEFAULT_CLASSROOMS);
  return classes.filter((c) => c.guruId === guruId);
}

export function saveDemoClassroom(classroom: Classroom): void {
  const classes = readKey<Classroom[]>('sibercerdas_demo_classrooms', DEFAULT_CLASSROOMS);
  const index = classes.findIndex((c) => c.id === classroom.id);
  if (index !== -1) {
    classes[index] = { ...classes[index], ...classroom };
  } else {
    classes.push(classroom);
  }
  writeKey('sibercerdas_demo_classrooms', classes);
}

export function deleteDemoClassroom(id: string): void {
  let classes = readKey<Classroom[]>('sibercerdas_demo_classrooms', DEFAULT_CLASSROOMS);
  classes = classes.filter((c) => c.id !== id);
  writeKey('sibercerdas_demo_classrooms', classes);
}

/* ── Gallery Approvals ───────────────────────────────────────────────────── */
export function approveDemoGalleryItem(id: string, status: 'approved' | 'rejected'): void {
  const items = readKey<GalleryItem[]>('sibercerdas_demo_gallery', []);
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    items[index].status = status;
    writeKey('sibercerdas_demo_gallery', items);
  }
}

// Self-update/merge local storage with new default classrooms, accounts, and users
if (typeof window !== 'undefined') {
  try {
    // 1. Merge Classrooms
    const storedClasses = localStorage.getItem('sibercerdas_demo_classrooms');
    if (storedClasses) {
      const parsed = JSON.parse(storedClasses) as Classroom[];
      const missing = DEFAULT_CLASSROOMS.filter((dc: Classroom) => !parsed.some((pc: Classroom) => pc.id === dc.id));
      if (missing.length > 0) {
        localStorage.setItem('sibercerdas_demo_classrooms', JSON.stringify([...parsed, ...missing]));
      }
    } else {
      localStorage.setItem('sibercerdas_demo_classrooms', JSON.stringify(DEFAULT_CLASSROOMS));
    }

    // 2. Merge Accounts
    const storedAccounts = localStorage.getItem('sibercerdas_demo_accounts');
    if (storedAccounts) {
      const parsed = JSON.parse(storedAccounts) as StudentAccount[];
      const missing = DEFAULT_ACCOUNTS.filter((da: StudentAccount) => !parsed.some((pa: StudentAccount) => pa.id === da.id || pa.username === da.username));
      if (missing.length > 0) {
        localStorage.setItem('sibercerdas_demo_accounts', JSON.stringify([...parsed, ...missing]));
      }
    } else {
      localStorage.setItem('sibercerdas_demo_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    }

    // 3. Merge Users
    const storedUsers = localStorage.getItem('sibercerdas_demo_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers) as UserProfile[];
      const missing = DEFAULT_USERS.filter((du: UserProfile) => !parsed.some((pu: UserProfile) => pu.uid === du.uid || (du.role === 'guru' && pu.email === du.email)));
      // Also update mapendas25's email if it was previously set to demo domain
      parsed.forEach((pu: UserProfile) => {
        if (pu.displayName === 'mapendas25' && pu.email !== 'mapendas25@unja.com') {
          pu.email = 'mapendas25@unja.com';
        }
      });
      if (missing.length > 0) {
        localStorage.setItem('sibercerdas_demo_users', JSON.stringify([...parsed, ...missing]));
      } else {
        localStorage.setItem('sibercerdas_demo_users', JSON.stringify(parsed));
      }
    } else {
      localStorage.setItem('sibercerdas_demo_users', JSON.stringify(DEFAULT_USERS));
    }
  } catch (e) {
    console.error('Error self-updating demo store:', e);
  }
}

