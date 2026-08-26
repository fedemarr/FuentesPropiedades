"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section className="bg-fp-bone py-20 lg:py-32">
      <div className="fp-container">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
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
        </div>
      </div>
    </section>
  );
}
