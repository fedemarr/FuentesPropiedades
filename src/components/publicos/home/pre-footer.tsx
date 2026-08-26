"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_RESUMEN = [
  {
    pregunta: "¿Cómo puedo vender mi propiedad?",
    respuesta:
      "Contactanos para una tasación sin compromiso. Nos encargamos de todo el proceso: publicación, visitas, negociación y cierre.",
  },
  {
    pregunta: "¿Cuánto tarda una venta?",
    respuesta:
      "Depende del tipo de propiedad y el precio. En promedio, una propiedad bien ubicada y bien preciada se vende en 3 a 6 meses.",
  },
  {
    pregunta: "¿Se puede comprar con crédito?",
    respuesta:
      "Sí, muchas de nuestras propiedades son aptas crédito. Consultanos para conocer las opciones disponibles.",
  },
  {
    pregunta: "¿Qué zonas cubren?",
    respuesta:
      "Trabajamos en zona norte del GBA: San Miguel, Bella Vista, Muñiz, Los Polvorines, Del Viso, Tortuguitas y alrededores.",
  },
] as const;

export function PreFooter() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section className="bg-fp-bone py-20 lg:py-32">
      <div className="fp-container">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-fp-h2 text-fp-ink">
              <span className="font-normal">Preguntas </span>
              <span className="font-semibold">frecuentes</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="space-y-3">
            {FAQ_RESUMEN.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="overflow-hidden rounded-[--radius-fp-md] border border-fp-line bg-fp-white"
              >
                <button
                  type="button"
                  onClick={() => setAbierto(abierto === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-fp-body pr-4 font-medium text-fp-ink">
                    {faq.pregunta}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-fp-slate transition-transform",
                      abierto === i && "rotate-45 text-fp-red",
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                {abierto === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-fp-body text-fp-slate">
                      {faq.respuesta}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link
              href="/faq"
              className="text-fp-small font-semibold text-fp-red transition-colors hover:text-fp-red-700"
            >
              Ver todas las preguntas →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
