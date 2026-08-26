import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroServicio } from "@/components/publicos/hero-servicio";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function VentaPage() {
  const totalVenta = await prisma.propiedad.count({
    where: {
      operacion: "VENTA",
      publicacion: "PUBLICADA",
      deletedAt: null,
      estado: "DISPONIBLE",
    },
  });

  return (
    <>
      <HeroServicio
        titulo="Propiedades en Venta"
        subtitulo="Encontrá tu próximo hogar en zona norte del Gran Buenos Aires."
      />

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-fp-h2 text-fp-ink">
              <span className="font-normal">Vendé tu propiedad con </span>
              <span className="font-semibold">confianza</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />

            <p className="text-fp-body text-fp-slate mx-auto mt-8 max-w-2xl">
              Como martillera pública matriculada, te acompañamos en cada etapa
              del proceso de venta: desde la tasación inicial hasta la firma de
              la escritura. Nos encargamos de la publicación, las visitas, la
              negociación y toda la documentación.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { numero: "1", titulo: "Tasación", texto: "Valuación realista del mercado" },
                { numero: "2", titulo: "Publicación", texto: "Fotos y difusión profesional" },
                { numero: "3", titulo: "Cierre", texto: "Negociación y escritura" },
              ].map((paso, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fp-red text-fp-white text-fp-h3">
                    {paso.numero}
                  </div>
                  <h3 className="text-fp-h3 text-fp-ink">{paso.titulo}</h3>
                  <p className="text-fp-body text-fp-slate mt-1">{paso.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-fp-bone py-20 lg:py-24">
        <div className="fp-container">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="text-fp-body text-fp-slate">
              Actualmente tenemos{" "}
              <span className="font-semibold text-fp-ink">{totalVenta}</span>{" "}
              propiedades disponibles para venta.
            </p>
            <Link
              href="/propiedades?operacion=VENTA"
              className="inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-8 py-3.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
            >
              Ver todas las propiedades en venta
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
