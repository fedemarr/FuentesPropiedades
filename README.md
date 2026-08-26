# Fuentes Propiedades

Sitio web inmobiliario para Fuentes Propiedades — venta, alquiler y administración de propiedades en zona norte del GBA.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI:** shadcn/ui (radix-nova), Lucide React, Framer Motion, Recharts
- **Backend:** Prisma 7 (PostgreSQL/Supabase), NextAuth v5 (Credentials)
- **Servicios:** Cloudinary (imágenes), Leaflet/OpenStreetMap (mapas)

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/          # Páginas públicas (route group)
│   │   ├── page.tsx       # Home
│   │   ├── propiedades/   # Listado + ficha [slug]
│   │   ├── venta/
│   │   ├── alquiler/
│   │   ├── tasaciones/
│   │   ├── administraciones/
│   │   ├── nosotros/
│   │   ├── faq/
│   │   ├── contacto/
│   │   └── privacidad/
│   ├── admin/             # Panel de administración
│   │   ├── page.tsx       # Dashboard con gráficos
│   │   ├── propiedades/   # CRUD propiedades
│   │   ├── consultas/     # Bandeja de consultas
│   │   ├── configuracion/ # Ajustes del sitio
│   │   └── login/
│   └── api/auth/          # NextAuth route handler
├── components/
│   ├── publicos/          # Componentes del sitio público
│   ├── admin/             # Componentes del admin
│   ├── ui/                # shadcn/ui
│   ├── seo/               # JSON-LD
│   └── marca/             # Logotipo
└── lib/                   # Utilidades, helpers, constants
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | URL de conexión a Supabase (pooler, puerto 6543) |
| `DIRECT_URL` | URL directa de Supabase (puerto 5432) |
| `AUTH_SECRET` | Secreto para NextAuth |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio en producción |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

## Desarrollo local

```bash
npm install
cp .env.example .env  # completar variables
npx prisma generate
npm run dev
```

## Deploy

El sitio se deploya automáticamente en Vercel al hacer push a `main`.

## Credenciales de admin

- URL: `/admin/login`
- Email: `fuentespropiedades@login.com`
- Contraseña: `12345678`
