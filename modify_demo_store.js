import fs from 'fs';
import path from 'path';

const names = [
  "Anindita Zahra",
  "Nayyara Anggun Zhafira",
  "Adelia Azzahra",
  "Nadhira Orlin",
  "Dafa Zen  Nofersa",
  "Kaysha Putri Ardani",
  "Alikanaylaputri",
  "Anindita Zahra",
  "James Alexsander",
  "Mahirah Qurrotaayyun",
  "Alfaris",
  "Jesslyn Revita Sintara",
  "Kinara Azzalea  Afsheen",
  "Andaluzia",
  "Malik Al Rasit",
  "M ArJuna D",
  "Algazali",
  "Weni Zahra",
  "Ola Aprilia Cahya",
  "Farzan Said Kadry",
  "Felix agustinus",
  "Keysa Zea Ramadhani",
  "Diego"
];

const usernamesMap = new Map();
const students = names.map((name, index) => {
  const cleanName = name.replace(/\s+/g, ' ').trim();
  let baseUsername = cleanName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  if (baseUsername === 'm') {
    baseUsername = 'arjuna';
  }
  if (baseUsername === 'anindita') {
    baseUsername = 'anindita.zahra';
  }
  let username = baseUsername;
  let count = 1;
  while (usernamesMap.has(username)) {
    count++;
    username = `${baseUsername}${count}`;
  }
  usernamesMap.set(username, true);

  // Generate avatarEmoji (initials)
  const parts = cleanName.split(' ');
  let avatarEmoji = '';
  if (parts.length >= 2) {
    avatarEmoji = (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    avatarEmoji = parts[0].substring(0, 2).toUpperCase();
  } else {
    avatarEmoji = 'ST';
  }

  const idNum = String(index + 1).padStart(3, '0');

  return {
    id: `demo-acc-5-` + idNum,
    username,
    password: '123456',
    passwordHash: '123456',
    displayName: cleanName,
    classId: 'Kelas 5',
    guruId: 'demo-guru-001',
    studentUid: `demo-siswa-5-` + idNum,
    avatarEmoji,
  };
});

const filePath = path.resolve('src/lib/demoStore.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Generate DEFAULT_ACCOUNTS string
const accountsString = `const DEFAULT_ACCOUNTS: StudentAccount[] = [\n  {\n    id: 'demo-acc-001',\n    username: 'anicerdas',\n    password: '123', // Simple password for testing\n    passwordHash: '123',\n    displayName: 'Anak Cerdas',\n    classId: 'Kelas 6A',\n    guruId: 'demo-guru-001',\n    studentUid: 'demo-siswa-001',\n    createdAt: Date.now(),\n    status: 'active',\n  },\n` + 
  students.map(s => {
    return `  {\n    id: '${s.id}',\n    username: '${s.username}',\n    password: '${s.password}',\n    passwordHash: '${s.passwordHash}',\n    displayName: '${s.displayName}',\n    classId: '${s.classId}',\n    guruId: '${s.guruId}',\n    studentUid: '${s.studentUid}',\n    createdAt: Date.now(),\n    status: 'active',\n  }`;
  }).join(',\n') + '\n];';

// 2. Generate DEFAULT_USERS string with mapendas25 teacher account
const usersString = `const DEFAULT_USERS: UserProfile[] = [\n  {\n    uid: 'demo-siswa-001',\n    displayName: 'Anak Cerdas',\n    username: 'anicerdas',\n    role: 'siswa',\n    guruId: 'demo-guru-001',\n    classId: 'Kelas 6A',\n    avatarEmoji: 'AC',\n    createdAt: Date.now(),\n    lastLogin: Date.now(),\n  },\n` + 
  students.map(s => {
    return `  {\n    uid: '${s.studentUid}',\n    displayName: '${s.displayName}',\n    username: '${s.username}',\n    role: 'siswa',\n    guruId: '${s.guruId}',\n    classId: '${s.classId}',\n    avatarEmoji: '${s.avatarEmoji}',\n    createdAt: Date.now(),\n    lastLogin: Date.now(),\n  }`;
  }).join(',\n') + ',\n  {\n    uid: \'demo-guru-001\',\n    displayName: \'mapendas25\',\n    email: \'mapendas25@demo.sibercerdas\',\n    role: \'guru\',\n    avatarEmoji: \'MP\',\n    createdAt: Date.now(),\n    lastLogin: Date.now(),\n  },\n];';

// Replace DEFAULT_ACCOUNTS
const accountsRegex = /const DEFAULT_ACCOUNTS: StudentAccount\[\] = \[\s*[\s\S]*?\n\];/;
content = content.replace(accountsRegex, accountsString);

// Replace DEFAULT_USERS
const usersRegex = /const DEFAULT_USERS: UserProfile\[\] = \[\s*[\s\S]*?\n\];/;
content = content.replace(usersRegex, usersString);

// 3. Update DEFAULT_CLASSROOMS to include Kelas 5
const classroomsString = `const DEFAULT_CLASSROOMS: Classroom[] = [\n  { id: 'class-001', name: 'Kelas 6A', guruId: 'demo-guru-001', createdAt: Date.now() },\n  { id: 'class-002', name: 'Kelas 6B', guruId: 'demo-guru-001', createdAt: Date.now() },\n  { id: 'class-003', name: 'Kelas 5', guruId: 'demo-guru-001', createdAt: Date.now() }\n];`;
const classroomsRegex = /const DEFAULT_CLASSROOMS: Classroom\[\] = \[\s*[\s\S]*?\n\];/;
content = content.replace(classroomsRegex, classroomsString);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated demoStore.ts with 6-character passwords');
