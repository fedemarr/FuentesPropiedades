import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContenidoContacto } from "@/components/publicos/contacto/contenido-contacto";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribinos y te respondemos a la brevedad.",
};

const PENDIENTE = "{{PENDIENTE}}";

export default async function ContactoPage() {
  const config = await prisma.configuracion.findUnique({ where: { id: "singleton" } });

  return (
    <ContenidoContacto
      telefonoNegocio={config?.telefono || PENDIENTE}
      emailNegocio={config?.email || PENDIENTE}
      direccionNegocio={config?.direccion || PENDIENTE}
      horariosNegocio={config?.horarios || PENDIENTE}
    />
  );
}
