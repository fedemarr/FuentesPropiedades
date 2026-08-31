import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContenidoNosotros } from "@/components/publicos/nosotros/contenido-nosotros";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé a Mariana Fuentes, martillera pública matriculada en zona norte del GBA.",
};

const TEXTO_POR_DEFECTO =
  "Martillera pública matriculada en zona norte del Gran Buenos Aires, especializada en venta, alquiler y administración de propiedades.";

export default async function NosotrosPage() {
  const config = await prisma.configuracion.findUnique({
    where: { id: "singleton" },
    select: { textoNosotros: true },
  });

  return <ContenidoNosotros textoNosotros={config?.textoNosotros || TEXTO_POR_DEFECTO} />;
}
