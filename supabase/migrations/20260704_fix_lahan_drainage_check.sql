-- =========================================================================
-- SQL Migration: Memperbarui Check Constraint untuk Kolom 'tipe_drainase' pada Tabel 'lahan'
-- Dibuat untuk: Aplikasi EcoTani
-- Tanggal: 2026-07-04
-- Deskripsi: Menghapus batasan drainase lama ('Baik', 'Buruk') dan menggantinya
--            dengan 7 klasifikasi drainase standar yang didukung oleh frontend.
-- =========================================================================

-- 1. Hapus check constraint lama jika ada
ALTER TABLE public.lahan 
  DROP CONSTRAINT IF EXISTS lahan_tipe_drainase_check;

-- 2. Tambahkan check constraint baru yang mencakup semua opsi dari frontend
ALTER TABLE public.lahan 
  ADD CONSTRAINT lahan_tipe_drainase_check 
  CHECK (tipe_drainase IN (
    'Sangat Terhambat', 
    'Terhambat', 
    'Agak Terhambat', 
    'Agak Baik', 
    'Baik', 
    'Agak Cepat', 
    'Cepat'
  ));
