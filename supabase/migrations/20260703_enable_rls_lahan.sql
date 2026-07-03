-- =========================================================================
-- SQL Migration: Mengaktifkan RLS dan Kebijakan CRUD pada Tabel 'lahan'
-- Dibuat untuk: Aplikasi EcoTani
-- Tanggal: 2026-07-03
-- =========================================================================

-- 1. Mengaktifkan Row Level Security (RLS) pada tabel lahan
ALTER TABLE public.lahan ENABLE ROW LEVEL SECURITY;

-- 2. Membersihkan kebijakan (policies) lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "Petani dapat mengelola lahannya sendiri" ON public.lahan;
DROP POLICY IF EXISTS "Lahan SELECT Policy" ON public.lahan;
DROP POLICY IF EXISTS "Lahan INSERT Policy" ON public.lahan;
DROP POLICY IF EXISTS "Lahan UPDATE Policy" ON public.lahan;
DROP POLICY IF EXISTS "Lahan DELETE Policy" ON public.lahan;

-- 3. Membuat Kebijakan SELECT (Membaca data sendiri)
-- Hanya memperbolehkan pengguna terautentikasi untuk membaca lahan milik mereka sendiri
CREATE POLICY "Lahan SELECT Policy"
ON public.lahan
FOR SELECT
TO authenticated
USING (auth.uid() = petani_id);

-- 4. Membuat Kebijakan INSERT (Menambah data sendiri)
-- Hanya memperbolehkan pengguna terautentikasi untuk menyisipkan data baru yang beratribut petani_id mereka sendiri
CREATE POLICY "Lahan INSERT Policy"
ON public.lahan
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = petani_id);

-- 5. Membuat Kebijakan UPDATE (Mengubah data sendiri)
-- Hanya memperbolehkan pengguna terautentikasi untuk memperbarui data lahan milik mereka sendiri
CREATE POLICY "Lahan UPDATE Policy"
ON public.lahan
FOR UPDATE
TO authenticated
USING (auth.uid() = petani_id)
WITH CHECK (auth.uid() = petani_id);

-- 6. Membuat Kebijakan DELETE (Menghapus data sendiri)
-- Hanya memperbolehkan pengguna terautentikasi untuk menghapus data lahan milik mereka sendiri
CREATE POLICY "Lahan DELETE Policy"
ON public.lahan
FOR DELETE
TO authenticated
USING (auth.uid() = petani_id);
