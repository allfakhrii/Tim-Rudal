import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Reusable SweetAlert2 customization for EcoTani Dark Mode
const swalConfig = {
  background: '#121212',
  color: '#ffffff',
  buttonsStyling: false,
  customClass: {
    popup: 'bg-[#121212] border border-white/10 rounded-2xl shadow-2xl p-6 max-w-sm md:max-w-md font-sans',
    title: 'text-lg font-extrabold text-white mb-2 pt-2',
    htmlContainer: 'text-sm text-gray-300 leading-relaxed mb-4',
    confirmButton: 'px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer mx-1',
    cancelButton: 'px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold border border-white/10 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer mx-1'
  }
};

/**
 * Display a premium themed alert popup.
 * @param title Title of the alert
 * @param text Description content
 * @param icon SweetAlert2 icon type ('success' | 'error' | 'warning' | 'info' | 'question')
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
 * Display a premium confirmation modal returning a boolean.
 * @param title Confirmation title
 * @param text Description content
 * @param confirmText Positive button text
 * @param cancelText Negative button text
 * @returns Promise resolving to true if confirmed, false otherwise
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
