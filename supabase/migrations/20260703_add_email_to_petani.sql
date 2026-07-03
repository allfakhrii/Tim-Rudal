-- Migration: Menambahkan kolom email ke tabel petani
ALTER TABLE public.petani ADD COLUMN IF NOT EXISTS email TEXT;
