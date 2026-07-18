# Menyambungkan Firebase untuk SiberCerdas

Lakukan langkah ini saat ingin mencoba data sungguhan. Tidak perlu Vercel dan
tidak perlu memasukkan kunci Gemini.

## 1. Buat proyek

1. Buka Firebase Console lalu pilih **Add project**.
2. Beri nama `SiberCerdas` dan selesaikan pembuatan proyek.
3. Tambahkan aplikasi **Web** (ikon `</>`). Tidak perlu mengaktifkan Hosting
   pada tahap ini.

## 2. Aktifkan layanan

1. Di **Authentication > Sign-in method**, aktifkan **Email/Password**.
2. Di **Firestore Database**, buat database dalam **Production mode**.
   Pilih lokasi yang paling dekat dengan pengguna sekolah; pilihan lokasi ini
   tidak dapat diubah setelah database dibuat.
3. Jangan aktifkan **Anonymous sign-in**. SiberCerdas kini memakai Firebase
   Authentication untuk akun guru dan murid.

## 3. Isi konfigurasi lokal

1. Salin `.env.example` menjadi `.env`.
2. Dari halaman pengaturan aplikasi web Firebase, salin nilai konfigurasi ke
   enam variabel `VITE_FIREBASE_*` di `.env`.
3. Jangan pernah mengirim isi `.env` atau kredensial apa pun melalui chat.
4. Tutup dan buka ulang server pengembangan setelah menyimpan `.env`.

Contoh nama variabel yang harus terisi:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Nilai `VITE_FIREBASE_*` adalah identitas aplikasi web, bukan kata sandi. Data
murid dilindungi oleh aturan Firestore di `firestore.rules`.

## 4. Pasang aturan data

Di **Firestore Database > Rules**, ganti aturan bawaan dengan isi file
`firestore.rules`, lalu pilih **Publish**. Jangan gunakan Test mode.

Aturan tersebut memisahkan data per guru: murid hanya dapat membaca data
miliknya dan karya yang sudah disetujui di kelasnya, sementara guru hanya dapat
mengelola kelasnya sendiri.

## 5. Buat indeks jika diminta

Saat memakai halaman galeri, penilaian, atau aktivitas terbaru, Firebase dapat
menampilkan tautan untuk membuat indeks. Buka tautan itu dan pilih **Create**.
Definisi indeks juga sudah tersedia di `firestore.indexes.json` untuk deploy
melalui Firebase CLI di kemudian hari.

## 6. Uji alur nyata

1. Daftarkan satu akun guru lewat aplikasi.
2. Masuk sebagai guru dan buat satu akun murid.
3. Keluar, lalu masuk sebagai murid memakai username dan kata sandi yang dibuat
   guru. Layar murid tetap tidak meminta email.
4. Isi satu aktivitas, lalu kembali ke akun guru untuk memeriksa data tersebut.

Jika salah satu langkah menampilkan `Missing or insufficient permissions`,
jangan mengubah aturan menjadi publik. Catat halaman dan pesan yang muncul agar
aturan dapat disesuaikan tanpa membuka data sekolah.
