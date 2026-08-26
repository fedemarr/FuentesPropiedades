# Manual de Administración — Fuentes Propiedades

## Acceso

1. Ir a `/admin/login`
2. Ingresar email y contraseña
3. La sesión dura 8 horas

## Panel principal (Dashboard)

Al entrar se muestra un resumen con:
- **Propiedades publicadas** — cantidad total activas
- **Vistas este mes** — visitas registradas en el mes actual
- **Consultas nuevas** — mensajes sin responder (se marca en rojo si hay)
- **Tasaciones pendientes** — tasaciones que no fueron cerradas
- **Gráficos** — consultas por mes, estado de propiedades, top 5 más vistas

## Gestión de propiedades

### Ver listado
Ir a **Propiedades** en el menú lateral. Se muestra una tabla con todas las propiedades y filtros por estado (borrador, publicada, archivada).

### Crear propiedad
1. Hacer clic en **"Nueva propiedad"**
2. Completar las secciones del formulario:
   - **Información básica** — código (se genera solo), título, descripción, operación (venta/alquiler), tipo, estado
   - **Precio** — moneda, precio, expensas, apto crédito
   - **Ubicación** — dirección, barrio, localidad, partido, coordenadas (seleccionables en mapa)
   - **Detalles** — ambientes, dormitorios, baños, cocheras, antigüedad, condición, orientación
   - **Superficies** — cubierta, semicubierta, descubierta, terreno, frente, fondo
   - **Características** — servicios, ambientes, adicionales (checkboxes)
   - **Fotos** — subir imágenes desde la computadora (se comprimen y suben a Cloudinary)
   - **Media adicional** — URL de video YouTube, plano, tour 360
   - **SEO** — meta título y descripción para buscadores
3. El formulario se **autoguarda cada 30 segundos** como borrador
4. Para publicar, hacer clic en **"Publicar"**

### Editar propiedad
Hacer clic en cualquier fila de la tabla de propiedades. Se abre el mismo formulario con los datos cargados.

### Eliminar propiedad
En la tabla, hacer clic en el ícono de eliminar. Se pide confirmación antes de borrar.

### Generación de códigos
Cada propiedad recibe un código automático tipo `FP-XXXX` (ej: FP-0015). Se incrementa solo.

## Gestión de consultas

### Bandeja de consultas
Ir a **Consultas** en el menú lateral. Se muestran todas las consultas recibidas con:
- Nombre, teléfono, email del consultante
- Tipo (propiedad, general, tasación, administración)
- Estado (nueva, contactada, cerrada)
- Fecha de creación

### Ver detalle
Hacer clic en una consulta. Se abre un panel lateral con:
- Mensaje completo
- Propiedad consultada (si aplica)
- Nota interna (visible solo para el admin)
- Botón para responder por WhatsApp

### Cambiar estado
- **Nueva** → marcar como **Contactada** cuando se responde
- **Contactada** → marcar como **Cerrada** cuando se resolvió

### Nota interna
Se puede agregar una nota interna en cada consulta para registrar seguimiento.

## Configuración del sitio

Ir a **Configuración** en el menú lateral. Hay 4 tabs:

### Contacto
- Teléfono, WhatsApp, email, dirección, horarios, matrícula

### Redes sociales
- Instagram, Facebook (URLs)

### Textos del sitio
- Título y subtítulo del hero (home)
- Texto de la página "Nosotros"
- Texto de la página "Administraciones"

### FAQs
- Preguntas frecuentes que se muestran en `/faq`
- Se pueden agregar, editar, reordenar y activar/desactivar

## Carga de imágenes

Las imágenes se suben directamente a Cloudinary desde el navegador:
1. Hacer clic en "Subir fotos" en la sección de fotos
2. Seleccionar uno o más archivos
3. Las imágenes se comprimen automáticamente antes de subir
4. Se pueden reordenar arrastrando
5. La primera imagen es la portada

## Tasaciones y administraciones

Las consultas de tipo tasación y administración se filtran desde la bandeja de consultas usando los tabs superiores.

## Datos de prueba (seed)

El sitio viene con 14 propiedades de ejemplo, 8 FAQs y varias consultas de prueba. Estos datos están marcados como `esDeSeed` y se pueden limpiar sin afectar datos reales.
