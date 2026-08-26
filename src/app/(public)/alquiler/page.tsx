import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroServicio } from "@/components/publicos/hero-servicio";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function AlquilerPage() {
  const totalAlquiler = await prisma.propiedad.count({
    where: {
      operacion: "ALQUILER",
      publicacion: "PUBLICADA",
      deletedAt: null,
      estado: "DISPONIBLE",
    },
  });

  return (
    <>
      <HeroServicio
        titulo="Propiedades en Alquiler"
        subtitulo="Alquilá con seguridad en zona norte del Gran Buenos Aires."
      />

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-fp-h2 text-fp-ink">
              <span className="font-normal">Alquilá con </span>
              <span className="font-semibold">seguridad</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />

            <p className="text-fp-body text-fp-slate mx-auto mt-8 max-w-2xl">
              Encontrá tu próximo hogar en zona norte del GBA. Te asesoramos
              durante todo el proceso de alquiler, desde la búsqueda hasta la
              firma del contrato. Trabajamos con propiedades verificadas y
              acompañamiento personalizado.
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { numero: "1", titulo: "Búsqueda", texto: "Filtramos según tus necesidades" },
                { numero: "2", titulo: "Visitas", texto: "Coordinamos los horarios" },
                { numero: "3", titulo: "Contrato", texto: "Asesoramiento completo" },
              ].map((paso, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fp-navy text-fp-white text-fp-h3">
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
              <span className="font-semibold text-fp-ink">{totalAlquiler}</span>{" "}
              propiedades disponibles para alquiler.
            </p>
            <Link
              href="/propiedades?operacion=ALQUILER"
              className="inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-8 py-3.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
            >
              Ver todas las propiedades en alquiler
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
