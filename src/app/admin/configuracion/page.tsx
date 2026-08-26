import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FormularioConfiguracion } from "@/components/admin/configuracion/formulario-configuracion";

export const metadata: Metadata = {
  title: "Configuración",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaginaConfiguracion() {
  const [configuracion, faqs] = await Promise.all([
    prisma.configuracion.findUnique({ where: { id: "singleton" } }),
    prisma.faq.findMany({ orderBy: { orden: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-fp-h2 text-fp-navy">Configuración</h1>
        <p className="text-fp-body text-fp-slate">
          Administrá los datos de contacto, redes sociales y textos del sitio.
        </p>
      </div>

      {configuracion && (
        <FormularioConfiguracion configuracion={configuracion} faqs={faqs} />
      )}
    </div>
  );
}
