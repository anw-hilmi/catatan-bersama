# Aplikasi Manajemen Catatan (Secure Notes App)

Aplikasi web berbasis React untuk mengelola catatan dengan fitur keamanan kredensial (username & password) pada setiap aksi modifikasi data. Dibangun dengan antarmuka yang modern, responsif, dan mengusung tema warna profesional (Cream, Stone, dan Amber).

## ✨ Fitur Utama

- **Manajemen Catatan (CRUD):** Tambah, lihat, edit, dan hapus catatan dengan mudah.
- **Keamanan Berlapis:** Setiap tindakan (Tambah, Edit, Hapus) memerlukan verifikasi kredensial (Username & Password) spesifik.
- **Rich Text Editor:** Menulis konten catatan dengan format teks kaya (tebal, miring, daftar, dll).
- **Desain Responsif:** Tampilan optimal di berbagai perangkat (Mobile, Tablet, Desktop) menggunakan Tailwind CSS.
- **Manajemen Kredensial Admin:** Halaman khusus untuk mengelola data dan sandi dari setiap tabel/kategori catatan.
- **Pusat Informasi:** Halaman bantuan yang berisi panduan video tutorial dan kontak dukungan WhatsApp.

## 🛠️ Teknologi yang Digunakan

**Frontend:**

- [React](https://reactjs.org/) (Vite/CRA)
- [Tailwind CSS](https://tailwindcss.com/) (Styling & Layouting)
- [React Router](https://reactrouter.com/) (Navigasi)
- [React Icons](https://react-icons.github.io/react-icons/) (Ikon antarmuka)

**Backend (API):**

- Node.js Framework (Hapi.js / Express)
- Joi (Validasi Data)
- NanoID (Pembuatan ID unik)

## 🚀 Cara Instalasi & Menjalankan Proyek

1. **Clone repositori ini:**

   ```bash
   git clone <url-repo-anda>
   cd <nama-folder-proyek>
   ```

2. **Instal dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env` di root direktori dan sesuaikan variabel lingkungan (misal: URL API Backend).

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Jalankan aplikasi (Development Server):**
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui `http://localhost:5173` (atau port yang tertera di terminal).

## 📂 Struktur Halaman Utama

- `/dashboard`: Menampilkan daftar catatan dalam bentuk _Card_ yang interaktif.
- `/manage-credentials`: Tabel manajemen data pengguna dan kata sandi per kategori.
- `/informasi`: Pusat bantuan berisi video _embed_ dan tombol kontak WhatsApp.

## 📝 Lisensi

Proyek ini dibuat untuk keperluan manajemen catatan internal/pribadi.
