// Utilidades de imagen del lado del cliente: comprimir/convertir a WebP
// antes de subir (pide la sección 8.4) y generar un blurDataUrl liviano
// para el placeholder de next/image. Solo se usan desde componentes
// cliente — dependen de `Image`, `canvas` y `FileReader` del navegador.

const CALIDAD_WEBP = 0.82;
const LADO_MAXIMO = 2400; // px, suficiente para fotos de propiedades
const LADO_BLUR = 12; // px, miniatura para el placeholder

function cargarImagen(archivo: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

function calcularDimensiones(
  anchoOriginal: number,
  altoOriginal: number,
  ladoMaximo: number,
): { width: number; height: number } {
  if (anchoOriginal <= ladoMaximo && altoOriginal <= ladoMaximo) {
    return { width: anchoOriginal, height: altoOriginal };
  }
  const escala = ladoMaximo / Math.max(anchoOriginal, altoOriginal);
  return {
    width: Math.round(anchoOriginal * escala),
    height: Math.round(altoOriginal * escala),
  };
}

export interface ImagenComprimida {
  archivo: File;
  width: number;
  height: number;
  blurDataUrl: string;
}

/** Redimensiona (si hace falta) y convierte a WebP en el navegador antes de
 * subir a Cloudinary — reduce el peso de la subida y estandariza el
 * formato. */
export async function comprimirImagen(archivoOriginal: File): Promise<ImagenComprimida> {
  const img = await cargarImagen(archivoOriginal);
  const { width, height } = calcularDimensiones(
    img.naturalWidth,
    img.naturalHeight,
    LADO_MAXIMO,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen en este navegador.");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", CALIDAD_WEBP),
  );
  if (!blob) throw new Error("No se pudo convertir la imagen a WebP.");

  const nombreBase = archivoOriginal.name.replace(/\.[^.]+$/, "");
  const archivo = new File([blob], `${nombreBase}.webp`, { type: "image/webp" });

  const blurDataUrl = generarBlurDataUrl(canvas, width, height);

  return { archivo, width, height, blurDataUrl };
}

function generarBlurDataUrl(
  canvasOriginal: HTMLCanvasElement,
  width: number,
  height: number,
): string {
  const escala = LADO_BLUR / Math.max(width, height);
  const w = Math.max(1, Math.round(width * escala));
  const h = Math.max(1, Math.round(height * escala));

  const miniCanvas = document.createElement("canvas");
  miniCanvas.width = w;
  miniCanvas.height = h;
  const miniCtx = miniCanvas.getContext("2d");
  if (!miniCtx) return "";

  miniCtx.drawImage(canvasOriginal, 0, 0, width, height, 0, 0, w, h);
  return miniCanvas.toDataURL("image/jpeg", 0.5);
}
