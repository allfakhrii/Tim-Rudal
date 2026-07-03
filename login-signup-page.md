# 🔐 Workflow EkoTani: Bagian 1 - Onboarding & Autentikasi (Updated - Server-Side Auth)

Dokumen ini menjelaskan secara rinci alur kerja, interaksi antarmuka (Frontend), dan proses latar belakang (Backend & Database) untuk modul Login dan Sign Up menggunakan arsitektur keamanan Server-Side Cookies dan Next.js Middleware.

---

## 1. Pendaftaran Akun Baru (Sign Up)

Proses ini digunakan oleh petani baru untuk mendaftarkan akun ke dalam sistem nasional EkoTani dengan alur yang cepat dan ringkas.

### A. Aksi User di Frontend (`ekotani-frontend`)

1. User membuka aplikasi web EkoTani dan mengklik teks tautan **"Daftar sekarang"** pada halaman login.

2. User mengisi formulir pendaftaran yang terdiri dari:
   * **Alamat Email** *(Digunakan sebagai pengenal unik akun).*
   * **Kata Sandi (Password)** *(Minimal 8 karakter).*
   * **Konfirmasi Kata Sandi**.

3. User menekan tombol utama **"Daftar"**.

### B. Proses Latar Belakang (Server-Side Cookies & Next.js Middleware)

1. **Validasi Klien:** Sebelum mengirim data, klien Next.js memastikan format email valid, panjang password minimal 8 karakter, dan isi kolom *Password* cocok dengan *Konfirmasi Kata Sandi*.

2. **API Request ke Route Handler:** Klien mengirimkan data kredensial via request `POST` ke Next.js Route Handler `/api/auth` dengan data JSON `{ email, password, confirmPassword, action: "signup" }`.

3. **Validasi Sisi Server & Deteksi Duplikat:**
   * Di dalam Route Handler, sistem memvalidasi kesamaan password dan melakukan pencarian ke tabel `petani` untuk memastikan email belum pernah didaftarkan.
   * Jika email sudah terdaftar di profile database, server langsung mengembalikan status `400 Bad Request` dengan pesan: *"Alamat email ini sudah terdaftar!"*.

4. **Pendaftaran via Supabase SSR:**
   * Route Handler menggunakan `@supabase/ssr` server client untuk mendaftarkan pengguna baru dengan parameter redirect URL dinamis (`options: { redirectTo: ... }`) menunjuk ke origin lokal.
   * Server Supabase Auth mengenkripsi (*hash*) password dan membuat baris record pengguna baru di tabel autentikasi Supabase.

5. **Respons & Manajemen Cookie:**
   * **Skenario Sukses:** Server mengirimkan respons sukses `200 OK`. Klien menampilkan SweetAlert2 sukses dan mengalihkan pengguna ke halaman autentikasi.
   * **Skenario Gagal:** Jika terjadi kegagalan, server mengirimkan respons error. Klien menangkap pesan tersebut dan menampilkannya sebagai teks peringatan merah.

---

## 2. Masuk ke Akun (Login)

Proses ini digunakan oleh pengguna yang sudah terdaftar untuk mendapatkan hak akses penuh ke fitur-fitur mitigasi pertanian EkoTani.

### A. Aksi User di Frontend (`ekotani-frontend`)

1. User membuka halaman Login EkoTani.

2. User memasukkan **Alamat Email** dan **Kata Sandi** pada kolom yang tersedia.

3. User menekan tombol hijau **"Masuk"**.

### B. Proses Latar Belakang (Server-Side Cookies & Next.js Middleware)

1. **API Request ke Route Handler:** Klien mengirimkan data kredensial via request `POST` ke Route Handler `/api/auth` dengan JSON `{ email, password, action: "login" }`.

2. **Verifikasi Kredensial & Set Sesi Cookie:**
   * Route Handler memanggil `supabase.auth.signInWithPassword()` di sisi server.
   * Supabase Auth memverifikasi kecocokan password. Jika sukses, SDK `@supabase/ssr` secara otomatis mengatur cookie sesi (`sb-access-token` & `sb-refresh-token`) pada header respons HTTP klien secara aman.

3. **Proteksi Rute via Next.js Middleware (`src/middleware.ts`):**
   * Di setiap permintaan rute selanjutnya ke `/dashboard` atau `/lahan`, Next.js Middleware mencegat request, memvalidasi cookie sesi pengguna, dan memperbarui token jika kedaluwarsa.
   * Jika tidak ada sesi cookie yang aktif, Middleware secara otomatis melakukan redirect 307 ke rute `/auth` di level server sebelum konten halaman sempat dirender.
   * Jika pengguna yang sudah login mencoba mengakses `/auth`, Middleware mengarahkannya kembali ke `/dashboard`.