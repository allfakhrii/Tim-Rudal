import { supabase } from './supabaseClient';
import { Lahan, RiwayatPanen } from '../types';

// ==========================================
// 1. QUERY LAHAN SAWAH
// ==========================================

// Mengambil seluruh lahan milik petani tertentu
export async function getLahans(petaniId: string): Promise<Lahan[]> {
  const { data, error } = await supabase
    .from('lahan')
    .select('*')
    .eq('petani_id', petaniId);

  if (error) {
    console.error('Gagal mengambil data lahan:', error.message);
    return [];
  }

  // Map database snake_case fields to frontend camelCase model
  return (data || []).map(row => ({
    id: row.id,
    nama: row.nama,
    luas: Number(row.luas),
    koordinat: typeof row.koordinat === 'string' ? JSON.parse(row.koordinat) : row.koordinat,
    centroid: typeof row.centroid === 'string' ? JSON.parse(row.centroid) : row.centroid,
    ketinggian: row.ketinggian,
    curahHujan: Number(row.curah_hujan),
    suhu: Number(row.suhu),
    tipeDrainase: row.tipe_drainase,
    jenisTanah: row.jenis_tanah,
    riwayatHama: row.riwayat_hama,
    status: row.status,
    varietasDitanam: row.varietas_ditanam || undefined,
    tanggalTanam: row.tanggal_tanam || undefined,
    kebutuhanAirDaily: row.kebutuhan_air_daily ? Number(row.kebutuhan_air_daily) : undefined,
    estimasiPanenDate: row.estimasi_panen_date || undefined,
    catatanMitigasi: row.catatan_mitigasi || undefined
  }));
}

// Menyimpan lahan sawah baru ke Supabase
export async function insertLahan(lahan: Omit<Lahan, 'id' | 'status'>, petaniId: string): Promise<Lahan | null> {
  const { data, error } = await supabase
    .from('lahan')
    .insert([
      {
        petani_id: petaniId,
        nama: lahan.nama,
        luas: lahan.luas,
        koordinat: lahan.koordinat, // Supabase automatically handles JSONB conversion
        centroid: lahan.centroid,
        ketinggian: lahan.ketinggian,
        curah_hujan: lahan.curahHujan,
        suhu: lahan.suhu,
        tipe_drainase: lahan.tipeDrainase,
        jenis_tanah: lahan.jenisTanah,
        riwayat_hama: lahan.riwayatHama,
        status: 'kosong'
      }
    ])
    .select();

  if (error) {
    console.error('Gagal menyimpan lahan:', error.message);
    return null;
  }

  const row = data[0];
  return {
    id: row.id,
    nama: row.nama,
    luas: Number(row.luas),
    koordinat: row.koordinat,
    centroid: row.centroid,
    ketinggian: row.ketinggian,
    curahHujan: Number(row.curah_hujan),
    suhu: Number(row.suhu),
    tipeDrainase: row.tipe_drainase,
    jenisTanah: row.jenis_tanah,
    riwayatHama: row.riwayat_hama,
    status: row.status
  };
}

// Memulai penanaman (mengubah status lahan menjadi 'sedang-ditanam')
export async function startTanamLahan(
  lahanId: string, 
  tanamanName: string, 
  kebutuhanAir: number, 
  estimasiPanen: string, 
  mitigasi: string
): Promise<boolean> {
  const { error } = await supabase
    .from('lahan')
    .update({
      status: 'sedang-ditanam',
      varietas_ditanam: tanamanName,
      tanggal_tanam: new Date().toISOString().split('T')[0],
      kebutuhan_air_daily: kebutuhanAir,
      estimasi_panen_date: estimasiPanen,
      catatan_mitigasi: mitigasi
    })
    .eq('id', lahanId);

  if (error) {
    console.error('Gagal mengupdate tanam lahan:', error.message);
    return false;
  }
  return true;
}

// Mengubah status lahan (misal: dari 'sedang-ditanam' ke 'siap-panen')
export async function updateLahanStatus(lahanId: string, newStatus: 'siap-panen' | 'kosong'): Promise<boolean> {
  const { error } = await supabase
    .from('lahan')
    .update({ status: newStatus })
    .eq('id', lahanId);

  if (error) {
    console.error('Gagal memperbarui status lahan:', error.message);
    return false;
  }
  return true;
}


// ==========================================
// 2. QUERY RIWAYAT PANEN
// ==========================================

// Mengambil log riwayat panen milik petani
export async function getRiwayatPanens(petaniId: string): Promise<RiwayatPanen[]> {
  const { data, error } = await supabase
    .from('riwayat_panen')
    .select('*')
    .eq('petani_id', petaniId);

  if (error) {
    console.error('Gagal mengambil riwayat panen:', error.message);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    lahanId: row.lahan_id,
    namaLahan: row.nama_lahan,
    varietas: row.varietas,
    tanggalPanen: row.tanggal_panen,
    statusHasil: row.status_hasil,
    beratPanen: Number(row.berat_panen),
    pendapatanEstimasi: Number(row.pendapatan_estimasi)
  }));
}

// Menyimpan catatan hasil panen baru dan mengosongkan lahan
export async function insertRiwayatPanen(
  panenData: Omit<RiwayatPanen, 'id'>, 
  petaniId: string
): Promise<boolean> {
  // 1. Simpan data riwayat panen
  const { error: insertError } = await supabase
    .from('riwayat_panen')
    .insert([
      {
        petani_id: petaniId,
        lahan_id: panenData.lahanId,
        nama_lahan: panenData.namaLahan,
        varietas: panenData.varietas,
        tanggal_panen: panenData.tanggalPanen,
        status_hasil: panenData.statusHasil,
        berat_panen: panenData.beratPanen,
        pendapatan_estimasi: panenData.pendapatanEstimasi
      }
    ]);

  if (insertError) {
    console.error('Gagal menyimpan riwayat panen:', insertError.message);
    return false;
  }

  // 2. Reset lahan menjadi kosong kembali
  const { error: updateError } = await supabase
    .from('lahan')
    .update({
      status: 'kosong',
      varietas_ditanam: null,
      tanggal_tanam: null,
      kebutuhan_air_daily: null,
      estimasi_panen_date: null,
      catatan_mitigasi: null
    })
    .eq('id', panenData.lahanId);

  if (updateError) {
    console.error('Gagal mengosongkan kembali lahan pasca-panen:', updateError.message);
    return false;
  }

  return true;
}
