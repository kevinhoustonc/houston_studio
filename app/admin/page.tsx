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
  const [activeTab, setActiveTab] = useState<"buzon" | "leads" | "testimonios">("buzon");

  // Buzón state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
            onClick={() => { setActiveTab("buzon"); setSelectedLead(null); }}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === "buzon"
                ? "text-gold border-b-2 border-gold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Buzón
            {leads.filter((l) => l.estado === "nuevo").length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {leads.filter((l) => l.estado === "nuevo").length}
              </span>
            )}
          </button>
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

        {activeTab === "buzon" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de mensajes */}
            <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
              {leads.length === 0 && (
                <p className="text-gray-500 text-center py-12">No hay mensajes.</p>
              )}
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedLead?.id === lead.id
                      ? "bg-gold/10 border-gold/30"
                      : "bg-studio-gray border-white/5 hover:border-white/10"
                  }`}
                  aria-label={`Mensaje de ${lead.nombre}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${lead.estado === "nuevo" ? "text-white" : "text-gray-400"}`}>
                      {lead.nombre}
                    </span>
                    {lead.estado === "nuevo" && (
                      <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gold mb-1">{lead.servicio}</p>
                  <p className="text-xs text-gray-500 truncate">{lead.descripcion}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(lead.created_at).toLocaleDateString("es-PY", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </button>
              ))}
            </div>

            {/* Detalle del mensaje */}
            <div className="lg:col-span-2">
              {selectedLead ? (
                <div className="bg-studio-gray border border-white/5 rounded-lg p-6">
                  {/* Header del mensaje */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedLead.nombre}</h3>
                      <p className="text-gray-400 text-sm">{selectedLead.email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {selectedLead.empresa} &middot;{" "}
                        {new Date(selectedLead.created_at).toLocaleDateString("es-PY", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                        selectedLead.estado === "nuevo"
                          ? "bg-blue-500/20 text-blue-300"
                          : selectedLead.estado === "contactado"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {selectedLead.estado}
                    </span>
                  </div>

                  {/* Info cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <div className="bg-studio-black rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Servicio solicitado</p>
                      <p className="text-gold text-sm font-medium">{selectedLead.servicio}</p>
                    </div>
                    <div className="bg-studio-black rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Empresa</p>
                      <p className="text-white text-sm">{selectedLead.empresa}</p>
                    </div>
                    <div className="bg-studio-black rounded-lg p-3">
                      <p className="text-gray-500 text-xs mb-1">Presupuesto</p>
                      <p className="text-white text-sm">{selectedLead.presupuesto || "No especificado"}</p>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="mb-6">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Mensaje</p>
                    <div className="bg-studio-black rounded-lg p-4">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedLead.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                    <a
                      href={`mailto:${selectedLead.email}?subject=Houston Studio - Re: ${selectedLead.servicio}&body=Hola ${selectedLead.nombre},%0D%0A%0D%0AGracias por contactarnos sobre ${selectedLead.servicio}.%0D%0A%0D%0A`}
                      className="px-4 py-2 bg-gold text-studio-black text-sm font-semibold rounded hover:bg-gold-light transition-colors"
                      aria-label="Responder por email"
                    >
                      Responder por email
                    </a>
                    <a
                      href={`https://wa.me/?text=Hola ${selectedLead.nombre}, gracias por contactar a Houston Studio sobre ${selectedLead.servicio}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-500 transition-colors"
                      aria-label="Responder por WhatsApp"
                    >
                      WhatsApp
                    </a>
                    {selectedLead.estado === "nuevo" && (
                      <button
                        onClick={() => {
                          updateLeadEstado(selectedLead.id, "contactado");
                          setSelectedLead({ ...selectedLead, estado: "contactado" });
                        }}
                        className="px-4 py-2 border border-green-500/30 text-green-400 text-sm rounded hover:bg-green-500/10 transition-colors"
                      >
                        Marcar como contactado
                      </button>
                    )}
                    {selectedLead.estado === "contactado" && (
                      <button
                        onClick={() => {
                          updateLeadEstado(selectedLead.id, "cerrado");
                          setSelectedLead({ ...selectedLead, estado: "cerrado" });
                        }}
                        className="px-4 py-2 border border-white/10 text-gray-400 text-sm rounded hover:bg-white/5 transition-colors"
                      >
                        Cerrar lead
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-studio-gray border border-white/5 rounded-lg p-12 text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Seleccioná un mensaje para leerlo</p>
                </div>
              )}
            </div>
          </div>
        )}

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
