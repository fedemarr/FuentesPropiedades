"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { obtenerIpDeHeaders, verificarRateLimit } from "@/lib/rate-limit";
import { esquemaContacto } from "./schema";

const LIMITE_ENVIOS = 3;
const VENTANA_ENVIOS_MS = 60 * 60 * 1000; // 1 hora, por IP (sección 12)
const TIEMPO_MINIMO_MS = 3000;

export interface ResultadoEnvioContacto {
  ok: boolean;
  error?: string;
}

export async function enviarContacto(
  datosSinValidar: unknown,
): Promise<ResultadoEnvioContacto> {
  const listaHeaders = await headers();
  const ip = obtenerIpDeHeaders(listaHeaders);

  const limite = verificarRateLimit(`contacto:${ip}`, LIMITE_ENVIOS, VENTANA_ENVIOS_MS);
  if (!limite.permitido) {
    return {
      ok: false,
      error: "Ya enviaste varios mensajes. Probá de nuevo más tarde o escribinos por WhatsApp.",
    };
  }

  const resultado = esquemaContacto.safeParse(datosSinValidar);
  if (!resultado.success) {
    return { ok: false, error: resultado.error.issues[0]?.message ?? "Revisá los datos del formulario." };
  }
  const datos = resultado.data;

  if (datos.honeypot || Date.now() - datos.tiempoInicioMs < TIEMPO_MINIMO_MS) {
    return { ok: true };
  }

  await prisma.consulta.create({
    data: {
      tipo: "GENERAL",
      estado: "NUEVA",
      origen: "CONTACTO",
      nombre: datos.nombre,
      telefono: datos.telefono || "",
      email: datos.email,
      mensaje: datos.mensaje,
      esDeSeed: false,
    },
  });

  revalidatePath("/admin/consultas");
  return { ok: true };
}
