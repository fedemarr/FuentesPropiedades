import { NavbarPublica } from "@/components/publicos/navbar";
import { FooterPublico } from "@/components/publicos/footer";
import { BotonWhatsapp } from "@/components/publicos/boton-whatsapp";
import { SmoothScroll } from "@/components/publicos/smooth-scroll";
import { prisma } from "@/lib/prisma";

async function obtenerConfiguracion() {
  const config = await prisma.configuracion.findUnique({ where: { id: "singleton" } });
  return (
    config ?? {
      direccion: "{{PENDIENTE}}",
      telefono: "{{PENDIENTE}}",
      whatsapp: "5491112345678",
      email: "{{PENDIENTE}}",
      horarios: "{{PENDIENTE}}",
      matricula: "CMCPSM 3032",
    }
  );
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await obtenerConfiguracion();

  return (
    <SmoothScroll>
      <NavbarPublica />
      <div className="flex min-h-screen flex-col pt-[88px]">
        <main className="flex-1">{children}</main>
        <FooterPublico
          direccion={config.direccion}
          telefono={config.telefono}
          email={config.email}
          horarios={config.horarios}
          matricula={config.matricula}
        />
      </div>
      <BotonWhatsapp numero={config.whatsapp} />
    </SmoothScroll>
  );
}
