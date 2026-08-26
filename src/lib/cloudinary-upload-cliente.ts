import type { FirmaUpload } from "@/app/admin/propiedades/cloudinary-actions";

export interface ResultadoUploadCloudinary {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/** Sube un archivo directo a Cloudinary desde el navegador usando una firma
 * ya generada en el servidor — el archivo nunca pasa por nuestro backend.
 * Usa XMLHttpRequest (no fetch) porque es la única API con evento de
 * progreso de subida en el navegador. */
export function subirImagenACloudinary(
  archivo: File,
  firma: FirmaUpload,
  onProgreso: (porcentaje: number) => void,
): Promise<ResultadoUploadCloudinary> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("api_key", firma.apiKey);
    formData.append("timestamp", String(firma.timestamp));
    formData.append("signature", firma.signature);
    formData.append("folder", firma.folder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
    );

    xhr.upload.addEventListener("progress", (evento) => {
      if (evento.lengthComputable) {
        onProgreso(Math.round((evento.loaded / evento.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error("Cloudinary rechazó la subida. Probá de nuevo."));
        return;
      }
      try {
        const respuesta = JSON.parse(xhr.responseText) as {
          secure_url: string;
          public_id: string;
          width: number;
          height: number;
        };
        resolve({
          url: respuesta.secure_url,
          publicId: respuesta.public_id,
          width: respuesta.width,
          height: respuesta.height,
        });
      } catch {
        reject(new Error("Respuesta inesperada de Cloudinary."));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Falló la conexión con Cloudinary."));
    });

    xhr.send(formData);
  });
}
