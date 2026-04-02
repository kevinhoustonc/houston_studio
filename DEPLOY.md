# Houston Studio - Guía de Deploy

## 1. Requisitos previos
- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com)
- Git instalado

## 2. Instalar dependencias

```bash
cd houston-studio
npm install
```

## 3. Configurar Supabase

1. Crear un nuevo proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y pegar el contenido de `supabase-schema.sql`
3. Ejecutar el SQL
4. Ir a **Settings → API** y copiar:
   - `Project URL` → para `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Configurar variables de entorno

Editar `.env.local` con tus credenciales reales:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_SITE_URL=https://houstonstudio.com.py
```

## 5. Desarrollo local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 6. Deploy en Vercel

### Opción A: Desde CLI
```bash
npm i -g vercel
vercel
```

### Opción B: Desde GitHub
1. Subir el proyecto a un repo de GitHub
2. Ir a [vercel.com/new](https://vercel.com/new)
3. Importar el repositorio
4. Agregar las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
5. Click en **Deploy**

## 7. Agregar audios demo

Subir archivos MP3 a la carpeta `/public/demos/`:
- `demo-radio.mp3`
- `demo-tv.mp3`
- `demo-ivr.mp3`
- `demo-jingle.mp3`

O bien usar Supabase Storage para servir los audios dinámicamente.

## 8. Panel de administración

Acceder a `/admin` con la contraseña: `houston2025`

## 9. Dominio personalizado

En Vercel → Settings → Domains → agregar `houstonstudio.com.py`
