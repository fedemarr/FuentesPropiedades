import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContenidoTasaciones } from "@/components/publicos/tasaciones/contenido-tasaciones";

export const metadata: Metadata = {
  title: "Solicitar tasación",
  description: "Solicitá una tasación sin cargo de tu propiedad en zona norte del GBA.",
};

export default async function TasacionesPage() {
  const config = await prisma.configuracion.findUnique({
    where: { id: "singleton" },
    select: { whatsapp: true },
  });

  return <ContenidoTasaciones numeroWhatsapp={config?.whatsapp || "5491112345678"} />;
}
