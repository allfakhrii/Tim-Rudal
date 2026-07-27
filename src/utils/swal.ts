import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Kustomisasi SweetAlert2 untuk Mode Gelap EcoTani
const swalConfig = {
  background: '#121212',
  color: '#ffffff',
  buttonsStyling: false,
  width: '300px',
  customClass: {
    popup: 'bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-5 font-sans',
    title: 'text-base font-extrabold text-white mb-2 pt-1',
    htmlContainer: 'text-xs text-gray-300 leading-relaxed mb-4',
    confirmButton: 'px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer mx-1',
    cancelButton: 'px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer mx-1'
  }
};

/**
 * Menampilkan popup notifikasi dengan tema khusus EcoTani.
 * @param title Judul notifikasi
 * @param text Isi pesan notifikasi
 * @param icon Tipe ikon SweetAlert2 ('success' | 'error' | 'warning' | 'info' | 'question')
 */
export const showAlertModal = async (
  title: string, 
  text: string, 
  icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
): Promise<void> => {
  await Swal.fire({
    title,
    text,
    icon,
    ...swalConfig
  });
};

/**
 * Menampilkan dialog konfirmasi dengan pengembalian nilai boolean.
 * @param title Judul konfirmasi
 * @param text Deskripsi konfirmasi
 * @param confirmText Teks tombol konfirmasi
 * @param cancelText Teks tombol pembatalan
 * @returns Promise boolean true jika disetujui, false jika dibatalkan
 */
export const showConfirmModal = async (
  title: string, 
  text: string, 
  confirmText: string = 'Lanjutkan', 
  cancelText: string = 'Batal'
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    ...swalConfig
  });
  
  return result.isConfirmed;
};
