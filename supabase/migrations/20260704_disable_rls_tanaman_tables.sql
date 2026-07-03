-- =========================================================================
-- SQL Migration: Menonaktifkan RLS pada Tabel 'tanaman' dan 'kriteria_tanaman'
-- Dibuat untuk: Aplikasi EcoTani
-- Tanggal: 2026-07-04
-- Deskripsi: Menghilangkan pembatasan RLS pada data master agar skrip seeding
--            dapat menulis data secara bebas menggunakan API Anon Key.
-- =========================================================================

-- 1. Nonaktifkan RLS pada Tabel Tanaman (Master Data Komoditas)
ALTER TABLE public.tanaman DISABLE ROW LEVEL SECURITY;

-- 2. Nonaktifkan RLS pada Tabel Kriteria Tanaman (Kriteria Kesesuaian Lahan)
ALTER TABLE public.kriteria_tanaman DISABLE ROW LEVEL SECURITY;
