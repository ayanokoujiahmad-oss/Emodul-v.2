const fs = require('fs');
const path = 'src/pages/teacher/TeacherDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');
// \s in JS matches non-breaking spaces (U+00A0) too
content = content.replace(/N-Gain belajar\ssiswa\ssaat ini bernilai/, 'N-Gain belajar murid saat ini bernilai');
fs.writeFileSync(path, content, 'utf8');
console.log('done');
