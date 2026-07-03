-- =========================================================================
-- SQL Migration: Membuat Tabel 'tanaman' dan 'kriteria_tanaman'
-- Dibuat untuk: Aplikasi EcoTani
-- Tanggal: 2026-07-03
-- =========================================================================

-- 1. Membuat Tabel Tanaman (Master Data Komoditas)
CREATE TABLE IF NOT EXISTS public.tanaman (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  nama_latin TEXT,
  siklus_tanam_days INTEGER DEFAULT 120,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Membuat Tabel Kriteria Tanaman (Kriteria Kesesuaian Lahan)
CREATE TABLE IF NOT EXISTS public.kriteria_tanaman (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanaman_id UUID REFERENCES public.tanaman(id) ON DELETE CASCADE NOT NULL,
  parameter TEXT NOT NULL,
  s1_min NUMERIC,
  s1_max NUMERIC,
  s2_min NUMERIC,
  s2_max NUMERIC,
  s3_min NUMERIC,
  s3_max NUMERIC,
  s1_text TEXT[],
  s2_text TEXT[],
  s3_text TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (tanaman_id, parameter)
);
