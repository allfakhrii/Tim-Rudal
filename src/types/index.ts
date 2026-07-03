export interface Lahan {
  id: string;
  nama: string;
  luas: number; // m²
  koordinat: [number, number][]; // Polygon coordinates [[lat, lng], ...]
  centroid: [number, number]; // [lat, lng]
  ketinggian: number; // mdpl
  curahHujan: number; // mm/bulan
  suhu: number; // °C
  tipeDrainase: 'Sangat Terhambat' | 'Terhambat' | 'Agak Terhambat' | 'Agak Baik' | 'Baik' | 'Agak Cepat' | 'Cepat';
  jenisTanah: 'Humus' | 'Lempung' | 'Pasir' | 'Gambut';
  riwayatHama: 'Ada' | 'Tidak';
  pH?: string;
  slope?: string;
  clay?: number;
  sand?: number;
  cec?: number;
  status: 'kosong' | 'sedang-ditanam' | 'siap-panen';
  varietasDitanam?: string;
  tanggalTanam?: string;
  kebutuhanAirDaily?: number; // liter
  estimasiPanenDate?: string;
  catatanMitigasi?: string;
}

export interface RiwayatPanen {
  id: string;
  lahanId: string;
  namaLahan: string;
  varietas: string;
  tanggalPanen: string;
  statusHasil: 'sukses' | 'gagal' | 'sebagian';
  beratPanen: number; // kg
  pendapatanEstimasi: number; // Rupiah
}

export interface Tanaman {
  id: string;
  nama: string;
  kebutuhanSuhu: { min: number; max: number }; // °C
  kebutuhanCurahHujan: { min: number; max: number }; // mm/bulan
  kebutuhanKetinggian: { min: number; max: number }; // mdpl
  tanahCocok: string[]; // ['Humus', 'Lempung']
  drainaseCocok: string; // 'Baik'
  siklusTanamDays: number;
  hargaPasar?: { min: number; max: number }; // Harga per kg (Rupiah)
  potensiHasil?: { min: number; max: number }; // Potensi hasil panen (kg/m²)
}
