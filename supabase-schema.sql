-- ============================================
-- Houston Studio - Schema de Base de Datos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Tabla de Leads (contactos/presupuestos)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  empresa TEXT NOT NULL,
  servicio TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  presupuesto TEXT,
  estado TEXT DEFAULT 'nuevo' NOT NULL CHECK (estado IN ('nuevo', 'contactado', 'cerrado'))
);

-- Tabla de Testimonios
CREATE TABLE testimonios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  nombre TEXT NOT NULL,
  empresa TEXT NOT NULL,
  texto TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  activo BOOLEAN DEFAULT true NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;

-- Políticas para leads: permitir INSERT desde el frontend (anon) y SELECT para admin
CREATE POLICY "Permitir insertar leads" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Permitir leer leads" ON leads
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Permitir actualizar leads" ON leads
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Políticas para testimonios: lectura pública, escritura para admin
CREATE POLICY "Permitir leer testimonios activos" ON testimonios
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Permitir insertar testimonios" ON testimonios
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Permitir actualizar testimonios" ON testimonios
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Insertar testimonios de ejemplo
INSERT INTO testimonios (nombre, empresa, texto, rating) VALUES
  ('María González', 'Agencia Creativa MG', 'Houston Studio transformó nuestra campaña de radio. La calidad del audio y la atención al detalle superaron todas nuestras expectativas.', 5),
  ('Carlos Benítez', 'Telecom Paraguay', 'Llevamos 5 años trabajando con Houston Studio para nuestro IVR y mensajes corporativos. Profesionalismo y puntualidad siempre.', 5),
  ('Ana Ruiz', 'Shopping del Sol', 'El jingle que nos crearon se convirtió en un ícono de nuestra marca. La creatividad y calidad de producción son incomparables.', 5);

-- Índices para mejor performance
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_leads_estado ON leads (estado);
CREATE INDEX idx_leads_servicio ON leads (servicio);
CREATE INDEX idx_testimonios_activo ON testimonios (activo);
