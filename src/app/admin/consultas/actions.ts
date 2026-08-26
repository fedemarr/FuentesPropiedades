"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { EstadoConsulta } from "@/generated/prisma/enums";

async function exigirSesion(): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");
}

export async function cambiarEstadoConsulta(
  id: string,
  estado: EstadoConsulta,
): Promise<void> {
  await exigirSesion();
  await prisma.consulta.update({
    where: { id },
    data: { estado },
  });
  revalidatePath("/admin/consultas");
}

export async function guardarNotaConsulta(
  id: string,
  notaInterna: string,
): Promise<void> {
  await exigirSesion();
  await prisma.consulta.update({
    where: { id },
    data: { notaInterna },
  });
  revalidatePath("/admin/consultas");
}
