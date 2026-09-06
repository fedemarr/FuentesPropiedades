"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { obtenerIpDeHeaders, verificarRateLimit } from "@/lib/rate-limit";
import { esquemaAdministracion } from "./schema";

const LIMITE_ENVIOS = 3;
const VENTANA_ENVIOS_MS = 60 * 60 * 1000; // 1 hora, por IP (sección 12)
const TIEMPO_MINIMO_MS = 3000;

export interface ResultadoEnvioAdministracion {
  ok: boolean;
  error?: string;
}

export async function enviarAdministracion(
  datosSinValidar: unknown,
): Promise<ResultadoEnvioAdministracion> {
  const listaHeaders = await headers();
  const ip = obtenerIpDeHeaders(listaHeaders);

  const limite = verificarRateLimit(`administracion:${ip}`, LIMITE_ENVIOS, VENTANA_ENVIOS_MS);
  if (!limite.permitido) {
    return {
      ok: false,
      error: "Ya enviaste varias solicitudes. Probá de nuevo más tarde o escribinos por WhatsApp.",
    };
  }

  const resultado = esquemaAdministracion.safeParse(datosSinValidar);
  if (!resultado.success) {
    return { ok: false, error: resultado.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }
  const datos = resultado.data;

  if (datos.honeypot || Date.now() - datos.tiempoInicioMs < TIEMPO_MINIMO_MS) {
    return { ok: true };
  }

  await prisma.consulta.create({
    data: {
      tipo: "ADMINISTRACION",
      estado: "NUEVA",
      origen: "ADMINISTRACIONES",
      nombre: datos.nombre,
      telefono: datos.telefono,
      mensaje: datos.mensaje || null,
      tipoInmueble: datos.tipoInmueble || null,
      cantUnidades: datos.cantUnidades || null,
      esDeSeed: false,
    },
  });

  revalidatePath("/admin/consultas");
  return { ok: true };
}
