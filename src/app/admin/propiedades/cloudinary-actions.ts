"use server";

import { auth } from "@/auth";
import { cloudinary, cloudinaryConfigurado } from "@/lib/cloudinary";

export interface FirmaUpload {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/** Firma un upload directo a Cloudinary para que el archivo viaje del
 * navegador de la martillera directo a Cloudinary, sin pasar por nuestro
 * servidor — el API secret nunca sale de acá. */
export async function obtenerFirmaUploadPropiedad(
  codigo: string,
): Promise<FirmaUpload> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");

  if (!cloudinaryConfigurado()) {
    throw new Error(
      "Cloudinary todavía no está configurado. Completá CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET y NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME en las variables de entorno.",
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `fuentes-propiedades/${codigo}`;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
    folder,
  };
}

/** Borra una imagen de Cloudinary. Se llama al sacar una foto del
 * formulario (ya sea que se guarde el cambio o no, la imagen huérfana no
 * debe quedar ocupando espacio en la cuenta de Cloudinary). */
export async function eliminarImagenCloudinary(publicId: string): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");

  // Las fotos de prueba del seed usan publicId "seed/..." — no existen en
  // Cloudinary, no hay nada que borrar ahí.
  if (publicId.startsWith("seed/")) return;
  if (!cloudinaryConfigurado()) return;

  await cloudinary.uploader.destroy(publicId);
}
