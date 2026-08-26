"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function exigirSesion(): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");
}

interface DatosConfiguracion {
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  matricula: string;
  instagram: string;
  facebook: string;
  heroTitulo: string;
  heroSubtitulo: string;
  textoNosotros: string;
  textoAdmin: string;
}

export async function guardarConfiguracion(data: DatosConfiguracion): Promise<void> {
  await exigirSesion();
  await prisma.configuracion.update({
    where: { id: "singleton" },
    data: {
      telefono: data.telefono,
      whatsapp: data.whatsapp,
      email: data.email,
      direccion: data.direccion,
      horarios: data.horarios,
      matricula: data.matricula,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      heroTitulo: data.heroTitulo,
      heroSubtitulo: data.heroSubtitulo || null,
      textoNosotros: data.textoNosotros,
      textoAdmin: data.textoAdmin,
    },
  });
  revalidatePath("/admin/configuracion");
}

interface DatosFaq {
  pregunta: string;
  respuesta: string;
  orden: number;
  activa: boolean;
}

export async function guardarFaq(id: string | null, data: DatosFaq): Promise<{ id: string }> {
  await exigirSesion();

  if (id) {
    const faq = await prisma.faq.update({
      where: { id },
      data: {
        pregunta: data.pregunta,
        respuesta: data.respuesta,
        orden: data.orden,
        activa: data.activa,
      },
    });
    revalidatePath("/admin/configuracion");
    return { id: faq.id };
  }

  const faq = await prisma.faq.create({
    data: {
      pregunta: data.pregunta,
      respuesta: data.respuesta,
      orden: data.orden,
      activa: data.activa,
    },
  });
  revalidatePath("/admin/configuracion");
  return { id: faq.id };
}

export async function eliminarFaq(id: string): Promise<void> {
  await exigirSesion();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/configuracion");
}
