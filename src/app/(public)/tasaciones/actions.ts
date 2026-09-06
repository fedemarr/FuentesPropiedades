"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cloudinary, cloudinaryConfigurado } from "@/lib/cloudinary";
import { obtenerIpDeHeaders, verificarRateLimit } from "@/lib/rate-limit";
import type { FirmaUpload } from "@/app/admin/propiedades/cloudinary-actions";
import { esquemaTasacion } from "./schema";

const LIMITE_ENVIOS = 3;
const VENTANA_ENVIOS_MS = 60 * 60 * 1000; // 1 hora, por IP (sección 12)
const LIMITE_UPLOADS = 15;
const VENTANA_UPLOADS_MS = 60 * 60 * 1000;
const TIEMPO_MINIMO_MS = 3000; // completar el formulario en menos de esto = bot

export interface ResultadoEnvioTasacion {
  ok: boolean;
  error?: string;
}

export async function enviarTasacion(
  datosSinValidar: unknown,
): Promise<ResultadoEnvioTasacion> {
  const listaHeaders = await headers();
  const ip = obtenerIpDeHeaders(listaHeaders);

  const limite = verificarRateLimit(`tasacion:${ip}`, LIMITE_ENVIOS, VENTANA_ENVIOS_MS);
  if (!limite.permitido) {
    return {
      ok: false,
      error: "Ya enviaste varias solicitudes. Probá de nuevo más tarde o escribinos por WhatsApp.",
    };
  }

  const resultado = esquemaTasacion.safeParse(datosSinValidar);
  if (!resultado.success) {
    return { ok: false, error: resultado.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }
  const datos = resultado.data;

  // Honeypot lleno o formulario completado sospechosamente rápido: es un
  // bot. Fingimos éxito para no delatarle el mecanismo.
  if (datos.honeypot || Date.now() - datos.tiempoInicioMs < TIEMPO_MINIMO_MS) {
    return { ok: true };
  }

  await prisma.consulta.create({
    data: {
      tipo: "TASACION",
      estado: "NUEVA",
      origen: "TASACIONES",
      nombre: datos.nombre,
      telefono: datos.telefono,
      email: datos.email || null,
      mensaje: datos.descripcion || null,
      direccionInmueble: datos.direccion,
      tipoInmueble: datos.tipo,
      ambientesInmueble: datos.ambientes || null,
      antiguedadInmueble: datos.antiguedad || null,
      supCubiertaInm: datos.supCubierta || null,
      supTotalInm: datos.supTotal || null,
      fotos: datos.fotos ?? [],
      esDeSeed: false,
    },
  });

  revalidatePath("/admin/consultas");
  return { ok: true };
}

/** Firma un upload directo a Cloudinary desde el formulario público de
 * tasaciones — sin sesión de admin, con su propio rate limit para que no
 * se use como forma de abusar de la cuenta de Cloudinary sin llegar a
 * enviar nunca el formulario. */
export async function obtenerFirmaUploadTasacion(): Promise<FirmaUpload> {
  const listaHeaders = await headers();
  const ip = obtenerIpDeHeaders(listaHeaders);

  const limite = verificarRateLimit(`upload-tasacion:${ip}`, LIMITE_UPLOADS, VENTANA_UPLOADS_MS);
  if (!limite.permitido) {
    throw new Error("Demasiadas fotos subidas. Probá de nuevo en un rato.");
  }

  if (!cloudinaryConfigurado()) {
    throw new Error("No se pueden subir fotos en este momento. Podés enviar la solicitud sin fotos.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "fuentes-propiedades/tasaciones";
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
