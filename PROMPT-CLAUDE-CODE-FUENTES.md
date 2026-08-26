# PROMPT MAESTRO — FUENTES PROPIEDADES

> Pegar este archivo completo en Claude Code como primer mensaje del proyecto.

---

## 0. ACTIVACIÓN DE SKILLS

Activá y usá durante todo el proyecto:

- `elite-fullstack-team` → arquitectura, schema, API, seguridad, performance, deploy
- `ux-ui-designer-supreme` → sistema de diseño, componentes, microinteracciones, mobile-first

Seguí el proceso de 6 pasos del skill fullstack: **Architect Review → Database Design → API Contract → Backend → Frontend → Quality & Deploy**.

**IMPORTANTE — antes de escribir código:** presentá el Architect Review y el schema de Prisma completo para que los revise. Esperá aprobación. Recién después empezá a generar código.

---

## 1. CONTEXTO DEL PROYECTO

**Cliente:** FUENTES PROPIEDADES — martillera pública matriculada, zona norte del GBA (San Miguel / Bella Vista / Muñiz / Los Polvorines y alrededores).

**Situación:** está arrancando. No tiene web. No usa Tokko Broker ni ningún software inmobiliario. **Carga absolutamente todo a mano desde el panel de administración.**

**Servicios que ofrece:** Venta · Alquiler · Administración de propiedades.

**Objetivo del sitio:**
1. Vitrina profesional de propiedades con búsqueda, filtros y mapa
2. Panel de administración que ella pueda usar sin saber nada de tecnología
3. Captación de consultas — **todas las consultas terminan en WhatsApp**

**Perfil de la usuaria del panel:** no técnica. Si el panel es complicado, no lo usa y el proyecto fracasa. La usabilidad del admin tiene la misma prioridad que la estética del sitio público.

---

## 2. REFERENCIAS — QUÉ TOMAR Y QUÉ EVITAR

Se analizaron dos sitios de la competencia directa.

### Referencia A — Castro Estudio Inmobiliario
**Tomar:** la elegancia general. Nav limpio, mucho aire, hero grande con buscador embebido, toggle Venta/Alquiler tipo píldora sobre la barra de búsqueda, títulos mixtos (regular + bold en la misma línea), línea divisoria dorada bajo el título de sección, bloque de estadísticas full-width en fondo oscuro, FAQ en acordeón, footer oscuro con sucursales, mapa con círculo de zona aproximada (no dirección exacta), galería de ficha con 1 foto grande + 6 thumbnails y contador `+63`, código de propiedad visible, favoritos con contador en el nav, disclaimer legal de medidas orientativas.

**Evitar:** corre sobre Tokko Broker y se le nota. Errores concretos a NO repetir:
- `Total constructed area: 0 m²` → campos en inglés y mostrando cero
- `Credit Eligible / Not specified` → mezcla de idiomas
- 12 dropdowns apilados en el filtro lateral → abruma
- La ficha son 6 cajas blancas idénticas apiladas, sin jerarquía visual
- Banda beige vacía entre el hero y las destacadas

### Referencia B — Fagliano de Caruso
**Tomar:** la parte funcional. Badges diagonales de estado sobre la foto (Vendido / Nuevo ingreso / Oportunidad / Reservado / Apto crédito), precio como overlay sobre la imagen, contador de fotos con ícono de cámara, fila de metadatos con íconos (tipo · m² · dormitorios · baños), formulario de tasación en dos columnas.

**Evitar:** rojo saturado en toda la barra de navegación (queda ordinario), widget de GetButton, reCAPTCHA v2 con checkbox, `Version: 5.13` en el footer, títulos truncados con `...` a mitad de palabra.

### Regla
El resultado tiene que verse **claramente superior a ambos**: la elegancia de Castro, la funcionalidad de Fagliano, y una capa de interacción moderna que ninguno de los dos tiene.

---

## 3. STACK

```
Framework:    Next.js 15 (App Router) + React 19
Lenguaje:     TypeScript strict — prohibido `any`
Estilos:      Tailwind CSS + shadcn/ui
Animación:    Framer Motion + Lenis (smooth scroll)
Formularios:  React Hook Form + Zod
Estado:       Zustand (favoritos y comparador, con persist en localStorage)
Server state: TanStack Query (solo en el panel admin)
DB:           PostgreSQL en Neon + Prisma
Auth:         NextAuth v5 (Credentials provider, un solo rol ADMIN)
Imágenes:     Cloudinary (upload directo desde el navegador con signed upload)
Mapas:        Leaflet + react-leaflet + tiles de OpenStreetMap (sin API key, sin costo)
Gráficos:     Recharts (solo dashboard admin)
Iconos:       Lucide React
Deploy:       Vercel
```

**Sin Resend, sin envío de emails.** Todas las consultas se guardan en la base y se notifican por WhatsApp. Si más adelante hace falta email, se agrega — no lo incluyas ahora.

---

## 4. IDENTIDAD VISUAL

### 4.1 Logo
Archivo provisto: logo horizontal, `FUENTES` en grotesque condensado pesado sobre `P R O P I E D A D E S` con tracking abierto, y `C.S.M. 0000` abajo a la derecha (número de matrícula — **usar el placeholder `C.S.M. 0000` en todo el sitio hasta que se provea el número real**).

Generar dos variantes: **blanco sobre navy** (nav y footer) y **navy sobre blanco** (fondos claros).

### 4.2 Paleta

Distribución **60 / 30 / 10** para que azul-blanco-rojo no termine pareciendo una bandera.

```css
/* Base — 60% */
--fp-white:      #FFFFFF;
--fp-bone:       #F7F8FA;   /* fondo general de secciones */

/* Estructura — 30% */
--fp-navy:       #011E5E;   /* EXACTO del logo — nav, footer, bloques full-width */
--fp-navy-900:   #01143F;   /* hover sobre navy, gradientes */
--fp-navy-700:   #0A2E7A;
--fp-navy-50:    #EEF2FA;   /* fondos de chips y estados sutiles */

/* Acento — 10% */
--fp-red:        #C8102E;   /* CTA principal, badges, subrayado de títulos */
--fp-red-700:    #A00D25;   /* hover */
--fp-red-50:     #FDF0F2;

/* Neutros */
--fp-ink:        #101828;   /* texto principal — NUNCA #000 */
--fp-slate:      #667085;   /* texto secundario */
--fp-line:       #E4E7EC;   /* bordes */
```

**Reglas de uso del rojo, no negociables:**
- Sí: botón primario, badge de operación, subrayado corto bajo títulos de sección, precio destacado, ícono activo
- No: barras de navegación completas, fondos de sección, bloques grandes de cualquier tipo

### 4.3 Tipografía

Pareja de contraste, cargada con `next/font/google`:

| Uso | Fuente | Detalle |
|---|---|---|
| Display / H1 / H2 | **Fraunces** | weight 400–600, `opsz` variable activo, tracking `-0.02em` |
| Body / UI / H3-H6 | **Inter** | weight 400/500/600 |
| Labels y overline | **Inter** | 600, `uppercase`, `letter-spacing: 0.14em`, 12px — hace eco al `P R O P I E D A D E S` del logo |
| Números y precios | **Inter** | 600, `font-variant-numeric: tabular-nums` |

Escala (mobile → desktop):
```
display  36 → 68px / line-height 1.05
h1       30 → 48px / 1.1
h2       24 → 36px / 1.2
h3       20 → 24px / 1.3
body     15 → 16px / 1.65
small    13 → 14px / 1.5
label    12px       / 1.4
```

**Patrón de título de sección** (copiado en espíritu de Castro, mejorado):
```
Nuestras PROPIEDADES DESTACADAS
└─ "Nuestras" en Fraunces 400, "PROPIEDADES DESTACADAS" en Fraunces 600
└─ debajo, línea de 56px × 3px en --fp-red que se dibuja de 0 a 56px al entrar en viewport
```

### 4.4 Tokens

```css
--radius-sm: 8px;  --radius-md: 14px;  --radius-lg: 20px;  --radius-full: 9999px;

--shadow-sm: 0 1px 3px rgba(1,30,94,.06), 0 1px 2px rgba(1,30,94,.04);
--shadow-md: 0 4px 16px rgba(1,30,94,.08), 0 2px 4px rgba(1,30,94,.04);
--shadow-lg: 0 12px 40px rgba(1,30,94,.12), 0 4px 8px rgba(1,30,94,.06);

--ease:      cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:  cubic-bezier(0.16, 1, 0.3, 1);
--t-fast: 150ms; --t-base: 250ms; --t-slow: 450ms;
```

Espaciado en sistema de 8px. Secciones con `py-20` mobile / `py-32` desktop. Container `max-w-[1280px]`.

### 4.5 Efectos e interacciones — acá está la diferencia

Estos son los que separan el sitio de las dos referencias. Implementarlos todos:

1. **Lenis smooth scroll** global, `duration: 1.1`, desactivado si `prefers-reduced-motion`
2. **Reveals escalonados** en scroll con Framer Motion — `opacity 0→1`, `y 24→0`, stagger 60ms, `once: true`
3. **Hero con parallax** — imagen de fondo se desplaza al 40% de la velocidad del scroll; el título se revela **por líneas** con máscara (`clipPath` animado, stagger 80ms)
4. **★ Carrusel en hover en las cards** — al pasar el mouse sobre la foto de una propiedad, las imágenes van rotando automáticamente cada 900ms con crossfade, y aparecen puntitos indicadores abajo. Se puede ver la propiedad entera sin entrar. **Este solo detalle ya las deja atrás a las dos referencias.** En mobile: swipe horizontal.
5. **View Transitions API** entre listado y ficha — la foto de la card se expande hasta convertirse en el hero de la ficha, sin corte de página. Fallback a fade si el navegador no lo soporta.
6. **Barra de filtros sticky** en el listado, con chips de filtros activos removibles con una X, y contador de resultados que se actualiza con animación de número
7. **Contadores animados** en el bloque de estadísticas (`useInView` + easing, no lineal)
8. **Botones magnéticos** en desktop — el botón se desplaza sutilmente (máx 6px) hacia el cursor cuando está cerca. Desactivado en touch.
9. **Skeletons**, nunca spinners. Los skeletons tienen la forma exacta del contenido que van a reemplazar.
10. **Nav que se contrae** al scrollear: pasa de 88px de alto a 64px, con blur de fondo (`backdrop-filter: blur(12px)`) y el logo achica proporcionalmente
11. **Cursor custom** en desktop: punto pequeño que se agranda y se vuelve anillo sobre elementos interactivos. Sutil, no payasesco.
12. **Galería de ficha con lightbox** — teclado (← → Esc), zoom con scroll, swipe en mobile, contador `12 / 63`
13. **Botón WhatsApp flotante propio** — no widget de terceros. Navy con ícono blanco, entra con un `scale` suave a los 2 segundos, y en la ficha de propiedad precarga el mensaje con el código y el título de esa propiedad.

Regla del skill de UX: **ninguna animación existe por existir.** Cada una comunica jerarquía, estado o continuidad espacial.

---

## 5. ARQUITECTURA DE INFORMACIÓN

### Rutas públicas
```
/                          Home
/propiedades               Listado con filtros + vista grilla/mapa
/propiedades/[slug]        Ficha de propiedad
/venta                     Atajo → /propiedades?operacion=VENTA
/alquiler                  Atajo → /propiedades?operacion=ALQUILER
/administraciones          Servicio de administración (informativa + form)
/tasaciones                Solicitud de tasación
/nosotros                  Sobre la martillera, matrícula, trayectoria
/faq                       Preguntas frecuentes (acordeón, editable desde admin)
/contacto                  Datos + formulario + mapa de la oficina
/favoritos                 Guardados en localStorage
/comparar                  Comparador de hasta 3 propiedades
/privacidad                Política de privacidad
```

### Rutas admin
```
/admin/login
/admin                     Dashboard
/admin/propiedades         Tabla con búsqueda, filtros y acciones rápidas
/admin/propiedades/nueva
/admin/propiedades/[id]
/admin/consultas           Bandeja de consultas
/admin/tasaciones          Bandeja de tasaciones
/admin/administraciones    Bandeja de consultas de administración
/admin/configuracion       Datos de contacto, textos, FAQs, redes
```

### Navegación principal
`Inicio · Propiedades · Venta · Alquiler · Administraciones · Tasaciones · Nosotros · Contacto` + ícono de favoritos con contador.

En mobile: menú full-screen que entra desde la derecha con stagger en los ítems.

---

## 6. SCHEMA DE BASE DE DATOS

Prisma + PostgreSQL. Convenciones del skill: `id` UUID, `createdAt`, `updatedAt`, soft delete con `deletedAt`, enums para estados (nunca strings libres), índices en foreign keys y columnas de búsqueda.

```prisma
enum Operacion       { VENTA  ALQUILER }
enum TipoPropiedad   { CASA DEPARTAMENTO PH LOTE LOCAL OFICINA QUINTA GALPON COCHERA CAMPO }
enum EstadoPropiedad { DISPONIBLE RESERVADA VENDIDA ALQUILADA }
enum EstadoPub       { BORRADOR PUBLICADA ARCHIVADA }
enum Moneda          { USD ARS }
enum Antiguedad      { A_ESTRENAR EN_POZO HASTA_5 ENTRE_5_10 ENTRE_10_20 MAS_20 }
enum Condicion       { EXCELENTE MUY_BUENO BUENO A_REFACCIONAR }
enum Situacion       { VACIA OCUPADA ALQUILADA }
enum Orientacion     { NORTE SUR ESTE OESTE NORESTE NOROESTE SUDESTE SUDOESTE }
enum EstadoConsulta  { NUEVA CONTACTADA CERRADA }
enum TipoConsulta    { PROPIEDAD GENERAL TASACION ADMINISTRACION }

model Propiedad {
  id          String   @id @default(uuid())
  codigo      String   @unique              // FP-0001, autoincremental
  slug        String   @unique              // titulo + codigo, generado

  titulo      String
  descripcion String   @db.Text

  operacion   Operacion
  tipo        TipoPropiedad
  estado      EstadoPropiedad @default(DISPONIBLE)
  publicacion EstadoPub       @default(BORRADOR)
  destacada   Boolean         @default(false)

  // Precio
  moneda            Moneda   @default(USD)
  precio            Decimal? @db.Decimal(14,2)
  consultarPrecio   Boolean  @default(false)
  expensas          Decimal? @db.Decimal(14,2)
  aptoCredito       Boolean  @default(false)

  // Ubicación — la dirección exacta NUNCA se expone en la API pública
  direccionExacta   String?          // solo panel
  calle             String?          // "Conesa al 1100" — sí público
  barrio            String?
  localidad         String
  partido           String?
  provincia         String   @default("Buenos Aires")
  lat               Float?
  lng               Float?
  radioMapa         Int      @default(300)   // metros del círculo público

  // Detalles — todos opcionales; si es null NO se renderiza
  ambientes    Int?
  dormitorios  Int?
  banos        Int?
  toilettes    Int?
  plantas      Int?
  cocheras     Int?
  antiguedad   Antiguedad?
  condicion    Condicion?
  situacion    Situacion?
  orientacion  Orientacion?

  // Superficies en m²
  supCubierta      Decimal? @db.Decimal(10,2)
  supSemicubierta  Decimal? @db.Decimal(10,2)
  supDescubierta   Decimal? @db.Decimal(10,2)
  supTerreno       Decimal? @db.Decimal(10,2)
  medidaFrente     Decimal? @db.Decimal(10,2)
  medidaFondo      Decimal? @db.Decimal(10,2)

  // Características — array de slugs, ver catálogo en sección 6.1
  servicios     String[] @default([])
  ambientesList String[] @default([])
  adicionales   String[] @default([])

  // Media
  imagenes   Imagen[]
  planoUrl   String?
  videoUrl   String?     // URL de YouTube
  tour360Url String?

  // SEO
  metaTitle       String?
  metaDescription String?

  vistas     Int      @default(0)
  consultas  Consulta[]

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  deletedAt  DateTime?

  @@index([operacion, tipo, publicacion])
  @@index([localidad, barrio])
  @@index([precio, moneda])
  @@index([destacada, publicacion])
  @@index([slug])
}

model Imagen {
  id           String    @id @default(uuid())
  propiedadId  String
  propiedad    Propiedad @relation(fields: [propiedadId], references: [id], onDelete: Cascade)
  url          String                    // Cloudinary secure_url
  publicId     String                    // para poder borrarla de Cloudinary
  alt          String?
  orden        Int       @default(0)
  esPortada    Boolean   @default(false)
  width        Int?
  height       Int?
  blurDataUrl  String?                   // placeholder base64 para next/image
  createdAt    DateTime  @default(now())

  @@index([propiedadId, orden])
}

model Consulta {
  id          String        @id @default(uuid())
  tipo        TipoConsulta
  estado      EstadoConsulta @default(NUEVA)

  nombre      String
  telefono    String
  email       String?
  mensaje     String?       @db.Text

  propiedadId String?
  propiedad   Propiedad?    @relation(fields: [propiedadId], references: [id], onDelete: SetNull)

  // Campos de tasación / administración (todos opcionales)
  direccionInmueble String?
  tipoInmueble      String?
  ambientesInmueble String?
  antiguedadInmueble String?
  supCubiertaInm    String?
  supTotalInm       String?
  cantUnidades      String?   // para administración de consorcios

  notaInterna String?  @db.Text
  origen      String?           // "ficha-propiedad" | "home" | "contacto" | ...
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([estado, createdAt])
  @@index([tipo, estado])
}

model VistaPropiedad {          // para el gráfico de 30 días del dashboard
  id          String   @id @default(uuid())
  propiedadId String
  fecha       DateTime @default(now())
  @@index([propiedadId, fecha])
  @@index([fecha])
}

model Configuracion {           // fila única, id fijo "singleton"
  id             String @id @default("singleton")
  telefono       String
  whatsapp       String              // formato internacional sin +, ej 5491112345678
  email          String
  direccion      String
  horarios       String
  matricula      String @default("C.S.M. 0000")
  instagram      String?
  facebook       String?
  heroTitulo     String
  heroSubtitulo  String?
  textoNosotros  String @db.Text
  textoAdmin     String @db.Text      // sección administraciones
  updatedAt      DateTime @updatedAt
}

model Faq {
  id        String  @id @default(uuid())
  pregunta  String
  respuesta String  @db.Text
  orden     Int     @default(0)
  activa    Boolean @default(true)
}

model Usuario {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String              // bcrypt cost 12
  nombre    String
  createdAt DateTime @default(now())
}
```

### 6.1 Catálogo de características

Definir en `src/lib/caracteristicas.ts` como constante tipada, con `slug` y `label`. Se renderizan como checkboxes agrupados en el panel y como chips con ícono en la ficha.

**Servicios:** agua corriente · cloacas · gas natural · electricidad · energía trifásica · alumbrado público · internet/fibra · pavimento

**Ambientes:** living · living comedor · comedor diario · cocina · cocina separada · lavadero · jardín · patio · terraza · balcón · galería · quincho · altillo · sótano · vestidor · toilette · escritorio · dependencia de servicio

**Adicionales:** pileta · parrilla · parrilla techada · calefacción · calefacción por aire · aire acondicionado · caldera · seguridad 24hs · seguridad privada · portería · barrio privado/country · amenities · club house · gimnasio · SUM · cancha de tenis · zonas verdes · acceso pavimentado · apto mascotas · apto profesional · cochera fija · armarios empotrados · carpintería de aluminio · lote interno · estilo moderno · a estrenar · luminoso · ubicación tranquila

---

## 7. PÁGINAS PÚBLICAS — ESPECIFICACIÓN

### 7.1 Home

**Hero (100vh, mín 640px)**
- Imagen de fondo con overlay `linear-gradient(180deg, rgba(1,30,94,.55) 0%, rgba(1,30,94,.75) 100%)` y parallax
- Título en Fraunces revelado por líneas con máscara
- Debajo: toggle píldora **Venta / Alquiler** (estilo Castro pero con `layoutId` de Framer Motion, la píldora activa se desliza)
- Barra de búsqueda flotante en pastilla blanca con `--shadow-lg`: `[Tipo de propiedad ▾] [Buscar por barrio o localidad] [Más filtros] [Buscar]`
  - "Más filtros" abre un drawer lateral, no expande la barra
  - En mobile la barra colapsa a un solo botón que abre el drawer completo

**Propiedades destacadas**
- Grid 3 columnas desktop / 2 tablet / 1 mobile
- Máximo 9, ordenadas por `updatedAt`
- Botón "Ver todas las propiedades" al pie

**Franja de servicios** (3 columnas, fondo `--fp-bone`)
Venta · Alquiler · Administraciones — cada una con ícono en trazo fino, título, dos líneas de texto y link. Hover: la tarjeta sube 4px y el ícono cambia a `--fp-red`.

**Bloque de estadísticas** — full-width en `--fp-navy`, tres números grandes en Fraunces con contador animado. Números editables desde configuración. **No inventar cifras**: si la martillera está arrancando, usar métricas honestas (propiedades publicadas, localidades cubiertas, años de matrícula).

**CTA de tasación** — split 50/50: imagen a un lado, texto + botón al otro. Fondo navy.

**Testimonios** — solo si hay contenido real. Si no hay, omitir la sección entera. Nada de placeholders con nombres inventados.

**Pre-footer** con FAQ resumida (4 preguntas) y link a `/faq`.

### 7.2 Listado `/propiedades`

**Layout:** sidebar de filtros 320px + grilla. En mobile los filtros van en un drawer que se abre desde un botón sticky abajo.

**Filtros — nivel 1 (siempre visibles):**
Operación · Tipo de propiedad (multi) · Ubicación (autocomplete sobre barrios y localidades existentes en la base) · Rango de precio con selector ARS/USD

**Filtros — nivel 2 (dentro de "Más filtros"):**
Ambientes · Dormitorios · Baños · Cocheras · Superficie cubierta (rango) · Superficie total (rango) · Antigüedad · Apto crédito · Características (buscador dentro del catálogo)

**Regla anti-Castro:** nunca 12 dropdowns apilados a la vista. Nivel 1 son 4 controles. El resto está a un click.

**Barra superior de resultados:**
`38 propiedades` (número animado) + chips de filtros activos removibles + `Ordenar por ▾` (Más recientes · Menor precio · Mayor precio · Mayor superficie) + toggle **Grilla / Mapa**

**Vista mapa:** Leaflet a pantalla dividida — mapa a la derecha, lista scrolleable a la izquierda. Marcadores agrupados con clustering. Hover en una card → el marcador rebota. Click en marcador → popup con mini-card.

**Paginación:** server-side, 24 por página, con prefetch de la siguiente. URL con searchParams para que todo filtro sea compartible y linkeable.

**Card de propiedad — anatomía exacta:**
```
┌─────────────────────────────────┐
│ [VENTA]            [♡]          │  ← badge operación arriba izq, favorito arriba der
│                                 │
│      FOTO 4:3                   │  ← carrusel en hover, crossfade 900ms
│                     [DESTACADA] │  ← badge secundario si aplica
│  USD 149.000        ● ● ○ ○     │  ← precio overlay + puntitos del carrusel
├─────────────────────────────────┤
│ CASA                   FP-0042  │  ← label rojo + código en slate
│ Casa 5 ambientes con cochera    │  ← 2 líneas máx, ellipsis por LÍNEA no por carácter
│ 📍 Saavedra al 1200 · San Miguel│
│ ─────────────────────────────── │
│ 🛏 3   🚿 2   📐 130 m²   🚗 1  │  ← solo los que tienen valor
└─────────────────────────────────┘
```
Hover de la card: sube 6px, sombra pasa de `md` a `lg`, transición 250ms.

**Estado vacío:** ilustración simple + "No encontramos propiedades con esos filtros" + botón que limpia todo + 3 sugerencias de búsquedas amplias.

### 7.3 Ficha `/propiedades/[slug]`

**Orden y jerarquía** (arreglando el problema de Castro: allá son 6 cajas idénticas sin jerarquía):

1. **Breadcrumb** `Propiedades / Casas en venta / San Miguel`
2. **Header:** badge de operación · código · título en Fraunces H1 · ubicación · botón favorito · botón compartir
3. **Galería hero:** 1 foto grande + grid de 4 thumbs a la derecha, la última con overlay `+59 fotos`. Click abre lightbox. En mobile: carrusel full-width con swipe y contador.
4. **★ Barra sticky de acción** — aparece al scrollear más allá de la galería, se pega arriba: `USD 149.000 · Casa 5 amb · [Consultar por WhatsApp]`. **Castro no tiene esto y es lo que más convierte.** En mobile es una barra fija abajo.
5. **Layout 2 columnas** (`2fr / 1fr`):

   **Columna izquierda:**
   - **Datos principales** — grid de 6 tiles con ícono grande y número (ambientes, dormitorios, baños, cocheras, sup. cubierta, sup. terreno). Solo los que tienen valor.
   - **Descripción** — Fraunces H2 + texto con `line-height 1.75`. Colapsada a 6 líneas con degradado y "Leer más" si es larga.
   - **Características** — 3 grupos (Servicios / Ambientes / Adicionales) como chips con check en `--fp-red`, en columnas responsivas
   - **Ficha técnica** — tabla de dos columnas con el resto (antigüedad, condición, situación, orientación, expensas, medidas de frente y fondo, plantas, toilettes)
   - **Plano** — si existe, con lightbox
   - **Video** — si existe, embed lazy de YouTube (cargar solo el thumbnail hasta el click, no el iframe)
   - **Ubicación** — Leaflet con círculo de `radioMapa` metros en `--fp-red` al 20% de opacidad y borde sólido. Debajo: `La ubicación es aproximada por razones de privacidad.`

   **Columna derecha (sticky):**
   - Card de contacto: precio grande, expensas, chip de apto crédito, formulario corto (nombre · teléfono · mensaje pre-rellenado con `Hola, me interesa la propiedad FP-0042`), botón primario **Consultar por WhatsApp**, botón secundario "Enviar consulta"
   - Mini card de la martillera: logo, nombre, matrícula, teléfono

6. **Propiedades similares** — 3 cards, misma operación + mismo tipo + rango de precio ±30%. Si no hay, mismo barrio.
7. **Disclaimer legal** al pie, en `--fp-slate` 13px:
   > Todas las medidas son meramente orientativas; las medidas exactas serán las que se expresen en el respectivo título de propiedad. Las fotos, imágenes y videos son ilustrativos y no contractuales. Los precios son orientativos y no contractuales.

**Nunca mostrar campos vacíos.** Si `dormitorios` es null, ese tile no existe. Nada de `0 m²`. Nada en inglés. Nunca la `direccionExacta` en el HTML público.

**Contador de vistas:** incrementar `vistas` y crear un registro en `VistaPropiedad` desde una Server Action, con deduplicación por sesión (cookie) para no inflar el número al recargar.

### 7.4 `/administraciones`

Página informativa bien vendida. Hero con imagen. Qué incluye el servicio (cobro de alquileres, control de pagos de expensas y servicios, gestión de reclamos, rendición mensual, seguimiento de contratos, actualizaciones según índice). Sección "Cómo trabajamos" en 4 pasos numerados con línea conectora animada al scroll. Formulario de contacto específico (nombre, teléfono, tipo de inmueble, cantidad de unidades, mensaje) → guarda con `tipo: ADMINISTRACION`.

Dejar el schema preparado para un futuro portal de propietarios, pero **no construirlo ahora**.

### 7.5 `/tasaciones`

Mejor que la de Castro (que pide solo 4 campos y una descripción libre) y que la de Fagliano (que es un muro de inputs sin estructura).

**Formulario en 3 pasos con barra de progreso:**
1. *Sobre el inmueble* — tipo, dirección o barrio, ambientes, superficie cubierta, superficie total, antigüedad
2. *Detalles* — estado general, descripción libre, opción de adjuntar fotos (hasta 5, a Cloudinary)
3. *Tus datos* — nombre, teléfono, email opcional

Validación por paso con Zod. Al enviar: pantalla de confirmación con animación de check y botón directo a WhatsApp con el resumen precargado. Guarda con `tipo: TASACION`.

### 7.6 `/nosotros`

Foto o retrato, texto editable desde configuración, **matrícula bien visible** (es el activo de credibilidad principal de una martillera), zonas de cobertura, y los valores del servicio en 3 puntos. Sin relleno corporativo genérico.

### 7.7 `/faq` y `/privacidad`

FAQ en acordeón single-open, con animación de altura y del ícono `+ → ×`. Preguntas editables desde el panel. Semillas basadas en las de Castro pero reescritas: cómo vender, cómo se tasa, cuánto tarda una venta, qué documentación hace falta, qué gastos considerar al comprar, cómo funciona la administración, se puede comprar con crédito, qué zonas cubren.

Privacidad: página legal en Markdown, con la fecha de actualización real.

### 7.8 `/favoritos` y `/comparar`

Favoritos en Zustand con persist en localStorage. Contador en el nav. El corazón se anima al agregar. Comparador de hasta 3 propiedades en tabla lado a lado, con las diferencias resaltadas en `--fp-navy-50`. En mobile el comparador es scroll horizontal con la primera columna fija.

---

## 8. PANEL DE ADMINISTRACIÓN

**Principio rector:** lo usa una persona no técnica. Cada pantalla tiene que ser obvia sin manual. Si una decisión de diseño mejora la estética pero agrega un paso, gana el paso menos.

### 8.1 Layout
Sidebar fija de 260px en `--fp-navy` con el logo en blanco arriba, ítems con ícono + label, indicador activo con `layoutId`. Header con breadcrumb, buscador global y menú de usuario. En mobile: sidebar en drawer.

### 8.2 Dashboard `/admin`

Cuatro tarjetas de métrica arriba (valor grande + variación vs mes anterior con flecha y color):
- Propiedades publicadas
- Vistas totales del mes
- Consultas nuevas sin responder ← **si es > 0, esta tarjeta se pinta en `--fp-red-50` con borde rojo y es clickeable**
- Tasaciones pendientes

Debajo: gráfico de área de vistas de los últimos 30 días (Recharts, un solo color, sin grilla pesada) + top 5 propiedades más vistas con mini-thumbnail y número de vistas.

Al pie: últimas 5 consultas con acceso directo a WhatsApp.

### 8.3 `/admin/propiedades`

Tabla con: thumbnail · código · título · operación · tipo · precio · estado · vistas · acciones.

- Buscador que filtra por título, código y dirección
- Filtros rápidos como pestañas: `Todas · Publicadas · Borradores · Destacadas · Vendidas/Alquiladas`
- **Acciones rápidas en la fila sin entrar a editar:** toggle de publicada, toggle de destacada, cambio de estado con dropdown, duplicar, ver en el sitio, eliminar
- Eliminar = soft delete, con confirmación que dice explícitamente qué se va a borrar
- Selección múltiple con acciones en lote (publicar, despublicar, destacar)

### 8.4 Formulario de propiedad

**Una sola página con secciones colapsables y navegación lateral de anclas.** Nada de wizard de 6 pasos — para cargar 40 propiedades eso es una tortura.

```
① Información básica    → operación, tipo, título, descripción, estado
② Precio                → moneda, precio, expensas, consultar precio, apto crédito
③ Ubicación             → dirección exacta (privada), calle pública, barrio,
                          localidad, partido + mapa donde arrastra el pin y ajusta
                          el radio con un slider, viendo el círculo en vivo
④ Detalles              → ambientes, dormitorios, baños, toilettes, plantas,
                          cocheras, antigüedad, condición, situación, orientación
⑤ Superficies           → cubierta, semicubierta, descubierta, terreno, frente, fondo
⑥ Características       → 3 grupos de checkboxes con buscador arriba
⑦ Fotos                 → drag & drop múltiple, preview inmediato, reordenar
                          arrastrando, marcar portada con una estrella, borrar,
                          barra de progreso por archivo
⑧ Media adicional       → plano, video de YouTube, tour 360
⑨ SEO                   → meta title y description con preview de Google y
                          contador de caracteres; si están vacíos se autogeneran
```

**Requisitos del formulario:**
- Autoguardado como borrador cada 30 segundos, con indicador `Guardado hace unos segundos`
- Botón `Vista previa` que abre la ficha real en una pestaña nueva
- Dos botones al pie: `Guardar borrador` y `Publicar`
- Validación con Zod, mensajes en español y en lenguaje humano — no `Invalid input`, sino `El precio tiene que ser un número mayor a cero`
- Advertencia antes de salir si hay cambios sin guardar
- El código `FP-XXXX` se genera solo y se muestra como campo de solo lectura

**Uploader de imágenes:**
- Signed upload directo a Cloudinary desde el navegador (el archivo nunca pasa por el servidor)
- Compresión y conversión a WebP del lado del cliente antes de subir
- Reordenamiento con `dnd-kit`
- Generación de `blurDataUrl` para el placeholder de `next/image`
- Al borrar una imagen, se borra también de Cloudinary

### 8.5 Bandejas de consultas

Vista de lista con estado como pastilla de color (Nueva rojo · Contactada ámbar · Cerrada verde). Click abre un panel lateral con todos los datos, la propiedad relacionada si la hay, campo de nota interna, cambio de estado, y **botón grande `Responder por WhatsApp`** que abre `wa.me` con el número del interesado y un saludo precargado.

Filtros por estado, tipo y rango de fechas. Exportar a CSV.

Las tres bandejas (consultas, tasaciones, administraciones) usan el mismo componente con distinto filtro de `tipo`.

### 8.6 `/admin/configuracion`

Formulario simple, agrupado en pestañas:
- **Contacto** — teléfono, WhatsApp, email, dirección, horarios, matrícula
- **Redes** — Instagram, Facebook
- **Textos del sitio** — título y subtítulo del hero, texto de Nosotros, texto de Administraciones
- **FAQs** — lista reordenable con edición inline y toggle de activa

Todo con feedback de guardado visible.

### 8.7 Auth
NextAuth v5, Credentials provider, un solo usuario ADMIN creado por seed. Password con bcrypt cost 12. Middleware que protege `/admin/*`. Sesión de 8 horas. Rate limiting en el login (5 intentos por IP cada 15 minutos).

---

## 9. WHATSAPP

Todo el flujo de contacto termina en WhatsApp. Implementar un helper central:

```typescript
// src/lib/whatsapp.ts
export function waLink(numero: string, mensaje: string): string
```

Mensajes precargados por contexto:

| Origen | Mensaje |
|---|---|
| Botón flotante | `Hola! Quería hacer una consulta.` |
| Ficha de propiedad | `Hola! Me interesa la propiedad FP-0042 — Casa 5 ambientes en San Miguel. https://[dominio]/propiedades/[slug]` |
| Tasación enviada | `Hola! Acabo de solicitar una tasación para [tipo] en [barrio].` |
| Administraciones | `Hola! Quería consultar por el servicio de administración de propiedades.` |
| Admin → interesado | `Hola [nombre], soy de Fuentes Propiedades. Te contacto por tu consulta sobre [propiedad].` |

El número sale de `Configuracion.whatsapp`, nunca hardcodeado. Formato internacional sin `+` ni espacios.

**No usar la Cloud API de Meta.** Links `wa.me` alcanzan y es lo correcto para esta escala.

---

## 10. SEO Y PERFORMANCE

- **Metadata dinámica** por propiedad con `generateMetadata`
- **Open Graph** con la foto de portada; generar imagen OG dinámica con `@vercel/og` que muestre foto, precio, título y logo
- **JSON-LD**: `RealEstateListing` en cada ficha, `RealEstateAgent` en home, `BreadcrumbList` en todas las internas, `FAQPage` en `/faq`
- **`sitemap.ts` dinámico** que incluye todas las propiedades publicadas
- **`robots.ts`** bloqueando `/admin`
- **ISR** con `revalidate: 300` en listado y fichas; `revalidatePath` desde las Server Actions del panel al publicar o editar
- **URLs limpias en español:** `/propiedades/casa-5-ambientes-san-miguel-fp-0042`
- `next/image` en todo, con `sizes` correctos y `priority` solo en el hero
- `next/font` con `display: swap`
- Objetivo Lighthouse: **90+ en las cuatro categorías, mobile**
- Paginación server-side obligatoria — nunca traer todas las propiedades al cliente
- `select` explícito en las queries del listado (no traer descripción ni todas las imágenes)
- Sin queries N+1: `include` de una sola imagen de portada en el listado

---

## 11. DATOS DE PRUEBA (SEED)

La cliente todavía no mandó fotos reales. Generar un seed que llene el sitio para poder verlo vivo:

```bash
npm run seed        # carga datos de prueba
npm run seed:clean  # borra SOLO los datos de prueba, deja config y usuario admin
```

**Contenido del seed:**
- 1 usuario admin (credenciales impresas por consola al terminar)
- Configuración inicial con datos placeholder claramente identificables
- 8 FAQs reales
- **14 propiedades** con datos verosímiles de la zona norte del GBA:
  - Mezcla: 5 casas, 4 departamentos, 2 PH, 1 lote, 1 local, 1 quinta
  - Mezcla de operaciones: 9 en venta, 5 en alquiler
  - Localidades reales: San Miguel, Bella Vista, Muñiz, Los Polvorines, Del Viso, Tortuguitas
  - Precios verosímiles (venta USD 45.000–380.000 · alquiler ARS 400.000–1.800.000)
  - 3 destacadas, 1 reservada, 1 vendida, 2 en borrador
  - Coordenadas reales de esos barrios
  - Entre 5 y 12 fotos cada una desde Unsplash (`source.unsplash.com`) con seeds fijos para que sean estables
  - Descripciones escritas de verdad, no lorem ipsum
- 6 consultas y 3 tasaciones de ejemplo en distintos estados para poder ver las bandejas pobladas

Marcar cada registro del seed con un flag interno para que `seed:clean` los distinga de los reales.

---

## 12. SEGURIDAD

Checklist del skill de Security Engineer, aplicado:

- [ ] Zod en toda entrada — formularios públicos, Server Actions y route handlers
- [ ] Rate limiting: login (5/15min por IP), formularios públicos (3/hora por IP)
- [ ] Honeypot + validación de tiempo mínimo de completado en formularios. **Sin reCAPTCHA visible** — arruina la estética y es evitable
- [ ] `direccionExacta` nunca en respuestas públicas: excluirla explícitamente en el `select`, no confiar en que el componente no la renderice
- [ ] Headers de seguridad en `next.config.ts` (CSP, X-Frame-Options, Referrer-Policy)
- [ ] Middleware protegiendo `/admin/*` y `/api/admin/*`
- [ ] Signed uploads de Cloudinary — la API secret nunca llega al cliente
- [ ] Sanitizar el HTML de la descripción antes de renderizar
- [ ] `.env.example` completo y documentado
- [ ] Sin `console.log` en producción
- [ ] Soft delete siempre, nunca `DELETE` real

---

## 13. ENTREGABLES

1. **Proyecto completo funcionando** — sin TODOs, sin `// acá va la lógica`, sin placeholders de código
2. **`README.md`** con setup paso a paso, variables de entorno y comandos
3. **`.env.example`** con cada variable comentada
4. **`MANUAL-ADMIN.md`** — manual en español, para persona no técnica, con lenguaje llano y capturas descritas paso a paso. Cubre: cómo entrar, cómo cargar una propiedad de principio a fin, cómo subir y ordenar fotos, cómo marcar una como vendida, cómo destacarla, cómo responder una consulta, cómo cambiar los datos de contacto. Escrito de vos, no de usted, y sin jerga técnica.
5. **Datos de prueba cargados** para poder ver el sitio vivo desde el primer `npm run dev`
6. **Sección de próximos pasos** — qué queda pendiente y qué se puede escalar

---

## 14. LO QUE NO HAY QUE HACER

- Emails transaccionales, Resend, o cualquier envío de mail
- Integración con Tokko Broker, Zonaprop, Argenprop o cualquier portal
- Portal de propietarios o inquilinos
- Cloud API de WhatsApp de Meta
- Pasarelas de pago
- Multiidioma
- Sistema de usuarios público con registro
- Blog
- reCAPTCHA visible
- Modo oscuro en el sitio público
- Cifras de trayectoria inventadas — la cliente recién arranca
- Testimonios falsos

---

## 15. ORDEN DE EJECUCIÓN

```
1. Architect Review + schema Prisma          → PRESENTAR Y ESPERAR APROBACIÓN
2. Setup: Next.js, Tailwind, shadcn, Prisma, tokens de diseño en globals.css
3. Migraciones + seed
4. Auth + middleware + layout del admin
5. CRUD de propiedades completo (el corazón del proyecto)
6. Uploader de Cloudinary con reordenamiento
7. Componentes públicos: nav, footer, card de propiedad, botón WhatsApp
8. Home
9. Listado con filtros, paginación y vista mapa
10. Ficha de propiedad
11. Formularios: tasación, administraciones, contacto
12. Bandejas de consultas en el admin
13. Dashboard con métricas y gráficos
14. Configuración y FAQs editables
15. Páginas secundarias: nosotros, faq, privacidad, favoritos, comparador
16. Capa de animación: Lenis, reveals, parallax, view transitions, carrusel en hover
17. SEO: metadata, JSON-LD, sitemap, OG images
18. Auditoría de performance y accesibilidad
19. README + MANUAL-ADMIN
```

Después de cada bloque grande, hacé una pausa y contame qué quedó hecho antes de seguir.

---

## 16. DATOS PENDIENTES

Usar placeholders visibles y fáciles de encontrar (`{{PENDIENTE}}`) para lo que todavía no está definido:

- Número de matrícula → usar `C.S.M. 0000` (viene del logo)
- Nombre completo de la martillera
- Número de WhatsApp
- Email de contacto
- Dirección de la oficina y horarios
- Dominio final
- Instagram y Facebook

Dejar todos estos valores en el seed de `Configuracion` para que se cambien desde el panel sin tocar una línea de código.
