'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  ArrowRight, 
  Mail, 
  MapPin, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default dark

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem('ecotani_theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('ecotani_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-bg-dark text-text-main font-sans overflow-x-hidden min-h-screen">
      
      {/* NAVBAR CONTAINER (FLOATING OVAL) */}
      <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
        <header className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-black/5 px-6 py-2 flex items-center justify-between h-16 transition-all duration-300">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 pl-2">
            <img src="/assets/logo.svg" alt="Logo EcoTani" className="h-9 w-9" />
            <span className="font-extrabold text-xl text-gray-900 tracking-tight">EcoTani</span>
          </Link>
          
          {/* Nav Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#hero" className="text-gray-600 hover:text-primary-dark font-medium text-sm transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-dark hover:after:w-full after:transition-all after:duration-300">Beranda</a>
            <a href="#masalah" className="text-gray-600 hover:text-primary-dark font-medium text-sm transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-dark hover:after:w-full after:transition-all after:duration-300">Tentang</a>
            <a href="#fitur" className="text-gray-600 hover:text-primary-dark font-medium text-sm transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-dark hover:after:w-full after:transition-all after:duration-300">Solusi</a>
            <a href="#cara-kerja" className="text-gray-600 hover:text-primary-dark font-medium text-sm transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-dark hover:after:w-full after:transition-all after:duration-300">Cara Kerja</a>
          </nav>
          
          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3 pr-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
              title="Ganti Tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/dashboard" className="px-5 py-2 rounded-full font-semibold text-sm text-white bg-primary-dark hover:bg-emerald-800 hover:shadow-md transition-all duration-300 flex items-center gap-2 hover:translate-x-0.5">
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="px-5 py-2 rounded-full font-semibold text-sm text-white bg-primary hover:bg-emerald-600 hover:shadow-md transition-all duration-300 flex items-center gap-2 hover:translate-x-0.5">
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-900 transition-colors"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu (Floating Panel matching the Navbar) */}
        <div className={`absolute top-20 left-4 right-4 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-black/5 p-6 flex flex-col items-center gap-4 transition-all duration-300 transform z-40 md:hidden ${
          mobileMenuOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
        }`}>
          <nav className="flex flex-col items-center gap-5 w-full">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-base py-2 w-full text-center border-b border-gray-100">Beranda</a>
            <a href="#masalah" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-base py-2 w-full text-center border-b border-gray-100">Tentang</a>
            <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-base py-2 w-full text-center border-b border-gray-100">Solusi</a>
            <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-semibold text-base py-2 w-full text-center border-b border-gray-100">Cara Kerja</a>
          </nav>
          <div className="flex flex-col gap-3 w-full mt-4">
            <Link href="/dashboard" className="w-full py-3 rounded-full font-bold text-sm text-center text-white bg-primary-dark hover:bg-emerald-800 transition-colors">Login</Link>
            <Link href="/dashboard" className="w-full py-3 rounded-full font-bold text-sm text-center text-white bg-primary hover:bg-emerald-600 transition-colors">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-48 md:pb-24 bg-bg-dark relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,168,89,0.08),transparent_45%)]" id="hero">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-8">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <span className="text-primary-light font-extrabold text-sm tracking-widest uppercase mb-3 animate-pulse-soft">EcoTani</span>
            <h1 className="text-text-main font-extrabold text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-tight mb-5">Sawah Terlindungi, Panen Terjaga dari Ketidakpastian Iklim.</h1>
            <p className="text-text-muted text-sm md:text-base lg:text-lg mb-8 max-w-lg leading-relaxed">Pantau kesehatan lahan dan dapatkan peringatan dini cuaca ekstrem langsung dari satelit di seluruh pelosok Indonesia.</p>
            
            <Link href="/dashboard" className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary text-white font-bold rounded-full text-sm md:text-base hover:bg-emerald-600 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 group">
              <span>Mulai Plotting Lahan</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center items-center w-full animate-float"
          >
            <img src="/assets/hero-phones.jpg" alt="Aplikasi EcoTani di Smartphone" className="w-full max-w-[440px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
          </motion.div>
          
        </div>
      </section>

      {/* SECTION 2: PERUBAHAN IKLIM NYATA */}
      <section className="bg-bg-dark py-16 md:py-24 border-t border-border-light" id="masalah">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-text-main font-extrabold text-3xl md:text-4xl leading-tight mb-4 tracking-tight">Perubahan Iklim Nyata,<br />Petani Tidak Boleh Sendirian</h2>
            <p className="text-text-muted text-sm md:text-base lg:text-[1.05rem] leading-relaxed">Sektor pertanian adalah yang paling rentan terdampak oleh krisis iklim. Pola cuaca yang tidak menentu, pergeseran musim tanam, hingga ancaman kekeringan mendadak sering kali menjadi dalang utama gagal panen massal yang merugikan petani secara materiel dan waktu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="bg-border-light border border-white/[0.06] backdrop-blur-md rounded-2xl p-8 md:p-10 hover:border-primary/30 hover:bg-white/[0.04] transition-colors duration-300 shadow-xl"
            >
              <h3 className="text-primary-light font-bold text-xl md:text-2xl mb-3">Anomali Cuaca Ekstrem</h3>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">Pemantauan cuaca akurat dan terpercaya, berkontribusi penting meminimalisir kerusakan tanaman tradisional.</p>
            </motion.div>
            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-border-light border border-white/[0.06] backdrop-blur-md rounded-2xl p-8 md:p-10 hover:border-primary/30 hover:bg-white/[0.04] transition-colors duration-300 shadow-xl"
            >
              <h3 className="text-primary-light font-bold text-xl md:text-2xl mb-3">Krisis Kelembapan Tanah</h3>
              <p className="text-text-muted text-sm md:text-base leading-relaxed">Penyusutan kandungan air tanah yang lambat-laun dapat menyebabkan penurunan hasil panen secara massal.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: TEKNOLOGI CERDAS */}
      <section className="bg-bg-dark py-16 md:py-24 border-t border-border-light" id="fitur">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-text-main font-extrabold text-3xl md:text-4xl leading-tight mb-4 tracking-tight">Teknologi Cerdas untuk<br />Pertanian Tangguh Iklim</h2>
            <p className="text-text-muted text-sm md:text-base lg:text-[1.05rem] leading-relaxed">Kami menghadirkan platform mitigasi berbasis data geospasial untuk membantu Anda mengambil langkah tepat sebelum terlambat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-bg-card border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
            >
              <div className="w-full h-48 md:h-52 overflow-hidden">
                <img src="/assets/plotting-lahan.jpg" alt="Plotting Lahan" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-primary-light font-bold text-lg md:text-xl mb-3">Plotting Lahan</h3>
                <p className="text-text-muted text-xs md:text-sm leading-relaxed">Tandai dan petakan koordinat sawah Anda dengan mudah langsung di peta satelit. Sistem kami akan memetakan batas wilayah lahan Anda secara presisi.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-bg-card border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
            >
              <div className="w-full h-48 md:h-52 overflow-hidden">
                <img src="/assets/analisis-satelit.jpg" alt="Analisis Satelit Real-Time" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-primary-light font-bold text-lg md:text-xl mb-3">Analisis Satelit Real-Time</h3>
                <p className="text-text-muted text-xs md:text-sm leading-relaxed">Pantau indeks kesehatan vegetasi tanaman (NDVI) dan tingkat kelembapan tanah melalui sensor satelit pemantau bumi terbaru di lapangan secara otomatis.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-bg-card border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group"
            >
              <div className="w-full h-48 md:h-52 overflow-hidden">
                <img src="/assets/early-warning.jpg" alt="Sistem Peringatan Dini" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-primary-light font-bold text-lg md:text-xl mb-3">Sistem Peringatan Dini</h3>
                <p className="text-text-muted text-xs md:text-sm leading-relaxed">Dapatkan rekomendasi aksi dan notifikasi darurat secara instan jika sistem mendeteksi adanya risiko kekeringan ataupun curah hujan di luar batas normal.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CARA KERJA */}
      <section className="bg-bg-dark py-16 md:py-24 border-t border-border-light" id="cara-kerja">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-text-main font-extrabold text-3xl md:text-4xl leading-tight mb-4 tracking-tight">Langkah Mudah Amankan<br />Panen Anda</h2>
            <p className="text-text-muted text-sm md:text-base lg:text-[1.05rem] leading-relaxed">Kami menghadirkan platform mitigasi berbasis data geospasial untuk membantu Anda mengambil langkah tepat sebelum terlambat.</p>
          </div>

          {/* Timeline Container */}
          <div className="steps-timeline relative flex flex-col md:flex-row md:justify-between md:items-start md:gap-12 mt-12 md:mt-20">
            
            {/* Step 1 */}
            <div className="group flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full gap-4 md:gap-0 relative z-10">
              <div className="shrink-0 md:mb-8">
                <div className="w-[70px] h-[70px] rounded-full bg-bg-dark border-2 border-border-medium text-primary-light font-bold text-xl flex items-center justify-center shadow-lg shadow-black/80 group-hover:border-primary-light group-hover:bg-primary-dark group-hover:text-text-main transition-all duration-300">01</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-text-main font-bold text-lg md:text-xl mb-2">Buat Akun & Cari Lokasi</h3>
                <p className="text-text-muted text-xs md:text-[0.95rem] leading-relaxed max-w-[280px] md:mx-auto">Daftar gratis di platform kami, cari lokasi sawah Anda secara presisi di peta digital.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full gap-4 md:gap-0 relative z-10">
              <div className="shrink-0 md:mb-8">
                <div className="w-[70px] h-[70px] rounded-full bg-bg-dark border-2 border-border-medium text-primary-light font-bold text-xl flex items-center justify-center shadow-lg shadow-black/80 group-hover:border-primary-light group-hover:bg-primary-dark group-hover:text-text-main transition-all duration-300">02</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-text-main font-bold text-lg md:text-xl mb-2">Gambar Batas Lahan Anda</h3>
                <p className="text-text-muted text-xs md:text-[0.95rem] leading-relaxed max-w-[280px] md:mx-auto">Gunakan alat bantu gambar peta untuk menggaris sudut-sudut sawah Anda. Cukup klik dan hubungkan titiknya untuk membentuk polygon.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full gap-4 md:gap-0 relative z-10">
              <div className="shrink-0 md:mb-8">
                <div className="w-[70px] h-[70px] rounded-full bg-bg-dark border-2 border-border-medium text-primary-light font-bold text-xl flex items-center justify-center shadow-lg shadow-black/80 group-hover:border-primary-light group-hover:bg-primary-dark group-hover:text-text-main transition-all duration-300">03</div>
              </div>
              <div className="flex-grow">
                <h3 className="text-text-main font-bold text-lg md:text-xl mb-2">Pantau Dashboard & Terima Notifikasi</h3>
                <p className="text-text-muted text-xs md:text-[0.95rem] leading-relaxed max-w-[280px] md:mx-auto">Cek kondisi tanah secara real-time di dashboard dan aktifkan notifikasi whatsapp/email agar langsung mendapat peringatan jika cuaca buruk mendekat.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#070908] border-t border-border-light pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          {/* Brand & Info */}
          <div className="flex flex-col items-start">
            <a href="#" className="flex items-center gap-3 mb-4">
              <img src="/assets/logo.svg" alt="EcoTani Logo" className="h-9 w-9" />
              <span className="text-text-main font-extrabold text-xl tracking-tight">EcoTani</span>
            </a>
            <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6 max-w-sm">Platform cerdas pemetaan sawah untuk mitigasi risiko gagal panen akibat perubahan iklim pertanian Indonesia.</p>
            <a href="mailto:info.ecotani@gmail.com" className="inline-flex items-center gap-2 text-text-main hover:text-primary-light transition-colors text-sm py-1">
              <Mail className="w-4.5 h-4.5 text-primary-light" />
              <span>info.ecotani@gmail.com</span>
            </a>
          </div>
          
          {/* Footer Navigation Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-text-main font-bold text-xs tracking-wider uppercase mb-5">TAUTAN</h4>
              <ul className="flex flex-col gap-3 text-text-muted text-sm">
                <li><a href="#hero" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Beranda</a></li>
                <li><a href="#masalah" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Tentang Kami</a></li>
                <li><a href="#fitur" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Solusi</a></li>
                <li><a href="#cara-kerja" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Cara Kerja</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-text-main font-bold text-xs tracking-wider uppercase mb-5">TATA KELOLA</h4>
              <ul className="flex flex-col gap-3 text-text-muted text-sm">
                <li><a href="#" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Dokumentasi Sistem</a></li>
                <li><a href="#" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-primary-light hover:translate-x-1 transition-all inline-block">Kebijakan Cookie</a></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        {/* Footer Bottom Copyright & Credits */}
        <div className="border-t border-border-light pt-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-text-muted">
            <p>&copy; 2026 EcoTani. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Developed by <a href="#" className="text-primary-light hover:underline font-semibold">Tim EcoTani Indonesia</a> - Universitas Dian Nuswantoro</p>
          </div>
        </div>
      </footer>

    </div>
  );
}


