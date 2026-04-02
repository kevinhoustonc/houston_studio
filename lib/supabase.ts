import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  empresa: string;
  servicio: string;
  descripcion: string;
  presupuesto: string | null;
  estado: "nuevo" | "contactado" | "cerrado";
};

export type Testimonio = {
  id: string;
  nombre: string;
  empresa: string;
  texto: string;
  rating: number;
  activo: boolean;
  created_at: string;
};
