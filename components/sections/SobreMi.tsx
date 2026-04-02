const metricas = [
  { valor: "14", label: "Años de experiencia" },
  { valor: "500+", label: "Producciones realizadas" },
  { valor: "100+", label: "Marcas atendidas" },
];

export default function SobreMi() {
  return (
    <section id="nosotros" className="py-24 px-4 bg-studio-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Quiénes somos</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              14 años. Una sola obsesión:{" "}
              <span className="text-gold">que tu audio impacte.</span>
            </h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                Houston Studio nació en Asunción con una misión clara: ofrecer producción de audio
                de primer nivel a marcas que entienden el poder del sonido. Desde nuestro primer
                spot de radio hasta producciones para marcas internacionales, cada proyecto tiene
                el mismo estándar: excelencia.
              </p>
              <p>
                Con 14 años de trayectoria, hemos trabajado con cientos de marcas locales e
                internacionales, produciendo locuciones, spots publicitarios, jingles, doblajes y
                audio corporativo que conecta con las audiencias.
              </p>
              <p>
                Nuestro estudio cuenta con equipamiento profesional de última generación y un
                equipo comprometido con la calidad en cada segundo de audio que producimos.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {metricas.map((m) => (
              <div
                key={m.label}
                className="bg-studio-gray border border-white/5 rounded-lg p-8 text-center lg:text-left"
              >
                <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">
                  {m.valor}
                </div>
                <div className="text-gray-400 text-sm">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
