import type { PrismaClient } from "@/generated/prisma/client";

/** Normaliza un título a slug: minúsculas, sin tildes, solo [a-z0-9-]. */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes/diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL limpia en español: /propiedades/casa-5-ambientes-san-miguel-fp-0042 */
export function generarSlugPropiedad(titulo: string, codigo: string): string {
  return `${slugify(titulo)}-${slugify(codigo)}`;
}

/** Código autoincremental FP-0001, FP-0002, ... a partir del último cargado. */
export async function generarSiguienteCodigo(
  prisma: PrismaClient,
): Promise<string> {
  const ultima = await prisma.propiedad.findFirst({
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });

  const siguiente = ultima
    ? Number.parseInt(ultima.codigo.replace("FP-", ""), 10) + 1
    : 1;

  return `FP-${String(siguiente).padStart(4, "0")}`;
}
