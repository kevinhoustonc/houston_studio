"use client";

import { useState } from "react";

const serviciosOptions = [
  "Locución profesional",
  "Spots de radio y TV",
  "Doblaje",
  "IVR y audio corporativo",
  "Jingles y música",
  "Redacción creativa",
];

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    empresa: "",
    servicio: "",
    descripcion: "",
    presupuesto: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ nombre: "", email: "", empresa: "", servicio: "", descripcion: "", presupuesto: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="py-24 px-4 bg-studio-dark">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Hablemos</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
            Solicitar Presupuesto
          </h2>
          <p className="text-gray-400 mt-4">
            Contanos sobre tu proyecto y te respondemos en menos de 24 horas.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
            <p className="text-gray-400">
              Gracias por contactarnos. Te responderemos a la brevedad.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="nombre" className="block text-sm text-gray-300 mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  placeholder="Tu nombre"
                  aria-label="Nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  placeholder="tu@email.com"
                  aria-label="Email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="empresa" className="block text-sm text-gray-300 mb-1.5">
                  Empresa *
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  required
                  value={form.empresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  placeholder="Nombre de tu empresa"
                  aria-label="Empresa"
                />
              </div>
              <div>
                <label htmlFor="servicio" className="block text-sm text-gray-300 mb-1.5">
                  Tipo de servicio *
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  required
                  value={form.servicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors"
                  aria-label="Tipo de servicio"
                >
                  <option value="">Seleccionar servicio</option>
                  {serviciosOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm text-gray-300 mb-1.5">
                Descripción del proyecto *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                required
                rows={4}
                value={form.descripcion}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors resize-none"
                placeholder="Contanos sobre tu proyecto..."
                aria-label="Descripción del proyecto"
              />
            </div>

            <div>
              <label htmlFor="presupuesto" className="block text-sm text-gray-300 mb-1.5">
                Presupuesto estimado (opcional)
              </label>
              <input
                type="text"
                id="presupuesto"
                name="presupuesto"
                value={form.presupuesto}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-studio-gray border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: $500 - $1000 USD"
                aria-label="Presupuesto estimado"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">
                Hubo un error al enviar el mensaje. Por favor intentá de nuevo.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-8 py-3 bg-gold text-studio-black font-semibold rounded hover:bg-gold-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar solicitud de presupuesto"
            >
              {status === "loading" ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
