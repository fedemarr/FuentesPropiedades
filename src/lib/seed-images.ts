// Generador de imágenes de prueba estables para el seed. La cliente todavía
// no mandó fotos reales (ver sección 11 del prompt maestro), así que estas
// URLs de picsum.photos con seed fijo llenan el sitio de forma reproducible:
// la misma propiedad siempre muestra las mismas fotos entre corridas de seed.
//
// NOTA: se reemplaza `source.unsplash.com` (pedido originalmente en el
// prompt) porque ese servicio está discontinuado y ya no resuelve de forma
// confiable. picsum.photos es el equivalente estable para datos de prueba.

const ANCHO = 1200;
const ALTO = 800;

export interface ImagenSeed {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string;
  publicId: string;
}

/** Placeholder de blur: un SVG sólido con el navy de marca al 8% de opacidad,
 * suficiente como `blurDataUrl` de next/image sin depender de red. */
function blurPlaceholder(): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6">' +
    '<rect width="8" height="6" fill="#eef2fa"/>' +
    "</svg>";
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/** Genera `cantidad` imágenes de prueba estables para una propiedad, a
 * partir de un seed textual único (ej. el código de la propiedad). */
export function imagenesSeed(
  seedBase: string,
  cantidad: number,
): ImagenSeed[] {
  return Array.from({ length: cantidad }, (_, i) => {
    const seed = `${seedBase}-${i + 1}`;
    return {
      url: `https://picsum.photos/seed/${seed}/${ANCHO}/${ALTO}`,
      width: ANCHO,
      height: ALTO,
      blurDataUrl: blurPlaceholder(),
      // publicId simula el formato que dejaría Cloudinary, para que el dato
      // sea coherente incluso siendo de prueba (no existe en Cloudinary real).
      publicId: `seed/${seed}`,
    };
  });
}
