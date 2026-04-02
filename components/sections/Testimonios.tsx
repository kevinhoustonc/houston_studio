"use client";

import { useEffect, useState } from "react";
import { supabase, type Testimonio } from "@/lib/supabase";

const fallbackTestimonios: Testimonio[] = [
  {
    id: "1",
    nombre: "María González",
    empresa: "Agencia Creativa MG",
    texto: "Houston Studio transformó nuestra campaña de radio. La calidad del audio y la atención al detalle superaron todas nuestras expectativas.",
    rating: 5,
    activo: true,
    created_at: "",
  },
  {
    id: "2",
    nombre: "Carlos Benítez",
    empresa: "Telecom Paraguay",
    texto: "Llevamos 5 años trabajando con Houston Studio para nuestro IVR y mensajes corporativos. Profesionalismo y puntualidad siempre.",
    rating: 5,
    activo: true,
    created_at: "",
  },
  {
    id: "3",
    nombre: "Ana Ruiz",
    empresa: "Shopping del Sol",
    texto: "El jingle que nos crearon se convirtió en un ícono de nuestra marca. La creatividad y calidad de producción son incomparables.",
    rating: 5,
    activo: true,
    created_at: "",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#D4AF37" : "none"}
          stroke="#D4AF37"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonios() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>(fallbackTestimonios);

  useEffect(() => {
    async function fetchTestimonios() {
      const { data } = await supabase
        .from("testimonios")
        .select("*")
        .eq("activo", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setTestimonios(data);
      }
    }
    fetchTestimonios();
  }, []);

  return (
    <section className="py-24 px-4 bg-studio-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Lo que dicen de nosotros</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Testimonios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <div
              key={t.id}
              className="bg-studio-gray border border-white/5 rounded-lg p-8"
            >
              <Stars rating={t.rating} />
              <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-6">
                &ldquo;{t.texto}&rdquo;
              </p>
              <div>
                <p className="text-white font-medium text-sm">{t.nombre}</p>
                <p className="text-gold text-xs">{t.empresa}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
