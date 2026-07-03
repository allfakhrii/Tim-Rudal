-- =========================================================================
-- SQL Migration: Mengaktifkan Kembali RLS pada Tabel 'tanaman' dan 'kriteria_tanaman'
-- Dibuat untuk: Aplikasi EcoTani
-- Tanggal: 2026-07-04
-- Deskripsi: Mengaktifkan RLS dan membuat kebijakan agar semua user (termasuk anon)
--            dapat membaca data master tanaman/kriteria.
-- =========================================================================

-- 1. Aktifkan kembali Row Level Security (RLS)
ALTER TABLE public.tanaman ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kriteria_tanaman ENABLE ROW LEVEL SECURITY;

-- 2. Bersihkan kebijakan lama jika ada
DROP POLICY IF EXISTS "Allow public read access on tanaman" ON public.tanaman;
DROP POLICY IF EXISTS "Allow public read access on kriteria_tanaman" ON public.kriteria_tanaman;

-- 3. Kebijakan agar siapa saja (anon & authenticated) dapat membaca data master tanaman
CREATE POLICY "Allow public read access on tanaman"
ON public.tanaman
FOR SELECT
TO public
USING (true);

-- 4. Kebijakan agar siapa saja (anon & authenticated) dapat membaca kriteria tanaman
CREATE POLICY "Allow public read access on kriteria_tanaman"
ON public.kriteria_tanaman
FOR SELECT
TO public
USING (true);
