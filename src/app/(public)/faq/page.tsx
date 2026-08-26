import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "@/components/publicos/faq-accordion";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });

  const faqsSerializados = faqs.map((f) => ({
    id: f.id,
    pregunta: f.pregunta,
    respuesta: f.respuesta,
  }));

  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden bg-fp-navy lg:min-h-[480px]">
        <div className="fp-container relative z-10 py-20 lg:py-0">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-fp-display text-fp-white">Preguntas Frecuentes</h1>
            <p className="text-fp-body mt-4 text-white/70">
              Resolvé tus dudas sobre compra, venta, alquiler y administración.
            </p>
          </div>
        </div>
      </section>

      <FaqAccordion faqs={faqsSerializados} />
    </>
  );
}
