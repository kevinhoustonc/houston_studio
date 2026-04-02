export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-studio-black via-studio-dark to-studio-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-gold text-sm uppercase tracking-[0.3em] mb-6 font-medium">
          Estudio de Grabación Profesional
        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
          Tu voz.<br />
          <span className="text-gold">Tu marca.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Producción de audio profesional desde Asunción, Paraguay.
          14 años trabajando con marcas que saben que el audio importa.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#servicios"
            className="px-8 py-3 bg-gold text-studio-black font-semibold rounded hover:bg-gold-light transition-colors duration-200"
            aria-label="Ver nuestros servicios"
          >
            Ver nuestros servicios
          </a>
          <a
            href="#portafolio"
            className="px-8 py-3 border border-gold/30 text-gold font-semibold rounded hover:bg-gold/10 transition-colors duration-200"
            aria-label="Escuchar demos"
          >
            Escuchar demos
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
