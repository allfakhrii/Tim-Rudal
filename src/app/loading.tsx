export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Pulsing glow behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Logo Image */}
        <img 
          src="/assets/logo.webp" 
          alt="EcoTani Loading" 
          className="w-20 h-20 object-contain animate-bounce relative z-10"
        />
        
        {/* Loading text */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="text-white font-bold text-xl tracking-wide">Memuat Dashboard</h2>
          <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
