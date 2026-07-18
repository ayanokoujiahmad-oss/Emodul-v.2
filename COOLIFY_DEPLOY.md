# Deploy SiberCerdas ke VPS + Coolify

Panduan ini untuk menjalankan SiberCerdas secara online dari VPS memakai
Coolify. CRUD data tetap memakai Firebase Auth + Firestore. Server Node di repo
ini hanya melayani aplikasi React, runtime config, dan endpoint AI:
`/api/gemini` serta `/api/evaluate`.

## 1. Siapkan layanan

- VPS Ubuntu dengan akses SSH.
- Domain atau subdomain, lalu arahkan DNS `A record` ke IP VPS.
- Coolify sudah terpasang di VPS dan bisa diakses dari browser.
- Firebase project sudah aktif:
  - Authentication: aktifkan Email/Password.
  - Firestore: gunakan Production mode.
  - Publish isi `firestore.rules`.
  - Deploy atau buat indeks dari `firestore.indexes.json`.

## 2. Rapikan GitHub

Coolify paling mudah mengambil source dari GitHub private repository.

Jika folder ini belum menjadi repo Git yang aktif, jalankan:

```powershell
git init
git add .
git commit -m "Prepare Coolify deployment"
git branch -M main
git remote add origin https://github.com/<akun>/<repo-private>.git
git push -u origin main
```

Pastikan file berikut tidak ikut masuk GitHub: `.env`, `node_modules`, `dist`,
dan log lokal. `.gitignore` serta `.dockerignore` sudah disiapkan untuk itu.

## 3. Buat aplikasi di Coolify

1. Buat resource baru dari GitHub repository SiberCerdas.
2. Pilih deploy memakai `Dockerfile`.
3. Set exposed port ke `3000`.
4. Pasang domain/subdomain di resource Coolify.
5. Aktifkan HTTPS dari panel Coolify.

Dockerfile akan menjalankan:

```text
npm ci
npm run build
node server/index.js
```

## 4. Isi environment di Coolify

Masukkan variabel ini di environment resource Coolify:

```text
VITE_DEMO_MODE=false
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

Nilai `VITE_FIREBASE_*` adalah konfigurasi public Firebase Web App. Nilai ini
memang dikirim ke browser lewat `/runtime-config.js`; keamanan data tetap
dikunci oleh Firebase Auth dan `firestore.rules`.

`GEMINI_API_KEY` adalah rahasia server. Jangan beri prefix `VITE_`, jangan
commit ke GitHub, dan jangan kirim lewat chat.

## 5. Deploy dan uji

Setelah deploy selesai, buka:

```text
https://domain-anda/healthz
https://domain-anda/runtime-config.js
```

`/healthz` harus mengembalikan status sehat. `/runtime-config.js` harus memuat
konfigurasi Firebase public dari environment Coolify.

Uji alur utama sebelum diberikan ke peserta didik:

- Daftar/login guru.
- Guru membuat akun siswa.
- Siswa login memakai username dan password dari guru.
- Siswa mengisi aktivitas dan mengirim ke guru.
- Guru melihat tugas, nilai, aktivitas terbaru, dan galeri.
- Simulasi AI yang memakai `/api/gemini` atau `/api/evaluate` tidak error.

Jika muncul `Missing or insufficient permissions`, jangan ubah Firestore Rules
menjadi publik. Catat halaman dan aktivitas yang gagal, lalu sesuaikan rules
atau indeks secara spesifik.
