"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, type Lead, type Testimonio } from "@/lib/supabase";

const ADMIN_PASSWORD = "houston2025";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");

  // Testimonios state
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [showTestimonioForm, setShowTestimonioForm] = useState(false);
  const [editingTestimonio, setEditingTestimonio] = useState<Testimonio | null>(null);
  const [testimonioForm, setTestimonioForm] = useState({
    nombre: "",
    empresa: "",
    texto: "",
    rating: 5,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<"leads" | "testimonios">("leads");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchLeads = useCallback(async () => {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

    if (filtroServicio) {
      query = query.eq("servicio", filtroServicio);
    }

    if (filtroPeriodo) {
      const now = new Date();
      let desde: Date;
      if (filtroPeriodo === "semana") {
        desde = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        desde = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      query = query.gte("created_at", desde.toISOString());
    }

    const { data } = await query;
    if (data) setLeads(data);
  }, [filtroServicio, filtroPeriodo]);

  const fetchTestimonios = useCallback(async () => {
    const { data } = await supabase
      .from("testimonios")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTestimonios(data);
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchLeads();
      fetchTestimonios();
    }
  }, [authenticated, fetchLeads, fetchTestimonios]);

  const updateLeadEstado = async (id: string, estado: string) => {
    await supabase.from("leads").update({ estado }).eq("id", id);
    fetchLeads();
  };

  const handleTestimonioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonio) {
      await supabase
        .from("testimonios")
        .update(testimonioForm)
        .eq("id", editingTestimonio.id);
    } else {
      await supabase.from("testimonios").insert([{ ...testimonioForm, activo: true }]);
    }
    setTestimonioForm({ nombre: "", empresa: "", texto: "", rating: 5 });
    setShowTestimonioForm(false);
    setEditingTestimonio(null);
    fetchTestimonios();
  };

  const toggleTestimonioActivo = async (id: string, activo: boolean) => {
    await supabase.from("testimonios").update({ activo: !activo }).eq("id", id);
    fetchTestimonios();
  };

  const editTestimonio = (t: Testimonio) => {
    setEditingTestimonio(t);
    setTestimonioForm({
      nombre: t.nombre,
      empresa: t.empresa,
      texto: t.texto,
      rating: t.rating,
    });
    setShowTestimonioForm(true);
  };

  // Metrics
  const totalLeads = leads.length;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const leadsEstaSemana = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
  const leadsEsteMes = leads.filter((l) => new Date(l.created_at) >= monthStart).length;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-studio-black flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="bg-studio-gray border border-white/10 rounded-lg p-8 w-full max-w-sm"
        >
          <h1 className="text-2xl font-serif font-bold text-gold mb-6 text-center">
            Houston Studio
          </h1>
          <p className="text-gray-400 text-sm text-center mb-6">Panel de Administración</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-3 bg-studio-black border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none mb-4"
            aria-label="Contraseña de administración"
          />
          {passwordError && (
            <p className="text-red-400 text-xs mb-4">Contraseña incorrecta</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gold text-studio-black font-semibold rounded hover:bg-gold-light transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-black text-white">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-gold">Houston Studio — Admin</h1>
        <a href="/" className="text-sm text-gray-400 hover:text-gold transition-colors">
          Ver sitio
        </a>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Leads", value: totalLeads },
            { label: "Esta Semana", value: leadsEstaSemana },
            { label: "Este Mes", value: leadsEsteMes },
          ].map((m) => (
            <div key={m.label} className="bg-studio-gray border border-white/5 rounded-lg p-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-3xl font-serif font-bold text-gold">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-white/5">
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "leads"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab("testimonios")}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "testimonios"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Testimonios
          </button>
        </div>

        {activeTab === "leads" && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
                className="px-3 py-2 bg-studio-gray border border-white/10 rounded text-sm text-white focus:border-gold focus:outline-none"
                aria-label="Filtrar por servicio"
              >
                <option value="">Todos los servicios</option>
                <option value="Locución profesional">Locución profesional</option>
                <option value="Spots de radio y TV">Spots de radio y TV</option>
                <option value="Doblaje">Doblaje</option>
                <option value="IVR y audio corporativo">IVR y audio corporativo</option>
                <option value="Jingles y música">Jingles y música</option>
                <option value="Redacción creativa">Redacción creativa</option>
              </select>
              <select
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
                className="px-3 py-2 bg-studio-gray border border-white/10 rounded text-sm text-white focus:border-gold focus:outline-none"
                aria-label="Filtrar por período"
              >
                <option value="">Todo el período</option>
                <option value="semana">Última semana</option>
                <option value="mes">Este mes</option>
              </select>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Fecha</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Nombre</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Empresa</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Servicio</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Estado</th>
                    <th className="text-left py-3 px-3 text-gray-400 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString("es-PY")}
                      </td>
                      <td className="py-3 px-3 text-white">{lead.nombre}</td>
                      <td className="py-3 px-3 text-gray-300">{lead.email}</td>
                      <td className="py-3 px-3 text-gray-300">{lead.empresa}</td>
                      <td className="py-3 px-3 text-gray-300">{lead.servicio}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            lead.estado === "nuevo"
                              ? "bg-blue-500/20 text-blue-300"
                              : lead.estado === "contactado"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {lead.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {lead.estado === "nuevo" && (
                          <button
                            onClick={() => updateLeadEstado(lead.id, "contactado")}
                            className="text-xs text-gold hover:text-gold-light transition-colors"
                          >
                            Marcar contactado
                          </button>
                        )}
                        {lead.estado === "contactado" && (
                          <button
                            onClick={() => updateLeadEstado(lead.id, "cerrado")}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            Cerrar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {leads.length === 0 && (
                <p className="text-gray-500 text-center py-12">No hay leads para mostrar.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "testimonios" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400 text-sm">{testimonios.length} testimonios</p>
              <button
                onClick={() => {
                  setEditingTestimonio(null);
                  setTestimonioForm({ nombre: "", empresa: "", texto: "", rating: 5 });
                  setShowTestimonioForm(true);
                }}
                className="px-4 py-2 bg-gold text-studio-black text-sm font-semibold rounded hover:bg-gold-light transition-colors"
              >
                Agregar testimonio
              </button>
            </div>

            {showTestimonioForm && (
              <form
                onSubmit={handleTestimonioSubmit}
                className="bg-studio-gray border border-white/10 rounded-lg p-6 mb-6 space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">
                  {editingTestimonio ? "Editar testimonio" : "Nuevo testimonio"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    required
                    value={testimonioForm.nombre}
                    onChange={(e) =>
                      setTestimonioForm({ ...testimonioForm, nombre: e.target.value })
                    }
                    className="px-4 py-2 bg-studio-black border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none"
                    aria-label="Nombre del cliente"
                  />
                  <input
                    type="text"
                    placeholder="Empresa"
                    required
                    value={testimonioForm.empresa}
                    onChange={(e) =>
                      setTestimonioForm({ ...testimonioForm, empresa: e.target.value })
                    }
                    className="px-4 py-2 bg-studio-black border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none"
                    aria-label="Empresa del cliente"
                  />
                </div>
                <textarea
                  placeholder="Texto del testimonio"
                  required
                  rows={3}
                  value={testimonioForm.texto}
                  onChange={(e) =>
                    setTestimonioForm({ ...testimonioForm, texto: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-studio-black border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none resize-none"
                  aria-label="Texto del testimonio"
                />
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-300">Rating:</label>
                  <select
                    value={testimonioForm.rating}
                    onChange={(e) =>
                      setTestimonioForm({ ...testimonioForm, rating: Number(e.target.value) })
                    }
                    className="px-3 py-2 bg-studio-black border border-white/10 rounded text-white text-sm focus:border-gold focus:outline-none"
                    aria-label="Rating"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} estrella{r !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gold text-studio-black text-sm font-semibold rounded hover:bg-gold-light transition-colors"
                  >
                    {editingTestimonio ? "Guardar cambios" : "Agregar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTestimonioForm(false);
                      setEditingTestimonio(null);
                    }}
                    className="px-5 py-2 border border-white/10 text-gray-300 text-sm rounded hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {testimonios.map((t) => (
                <div
                  key={t.id}
                  className={`bg-studio-gray border rounded-lg p-5 ${
                    t.activo ? "border-white/5" : "border-red-500/20 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-medium">{t.nombre}</p>
                      <p className="text-gold text-xs">{t.empresa}</p>
                      <p className="text-gray-400 text-sm mt-2">&ldquo;{t.texto}&rdquo;</p>
                      <p className="text-yellow-500 text-xs mt-1">
                        {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => editTestimonio(t)}
                        className="text-xs text-gray-400 hover:text-gold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleTestimonioActivo(t.id, t.activo)}
                        className={`text-xs transition-colors ${
                          t.activo
                            ? "text-red-400 hover:text-red-300"
                            : "text-green-400 hover:text-green-300"
                        }`}
                      >
                        {t.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
