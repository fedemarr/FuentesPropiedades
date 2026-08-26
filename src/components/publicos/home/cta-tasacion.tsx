"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaTasacion() {
  return (
    <section className="bg-fp-navy py-20 lg:py-32">
      <div className="fp-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] overflow-hidden rounded-[--radius-fp-lg] lg:aspect-[3/4]"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://picsum.photos/seed/fuentes-tasacion/800/1000')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fp-navy/40 to-transparent" />
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="text-fp-label text-fp-red">Tasaciones</span>
            <h2 className="text-fp-h2 mt-3 text-fp-white">
              ¿Querés saber cuánto vale tu propiedad?
            </h2>
            <p className="text-fp-body mt-4 text-white/70">
              Solicitá una tasación sin compromiso. Como martillera pública
              matriculada, te damos un valor realista basado en el mercado de
              la zona norte del GBA.
            </p>
            <Link
              href="/tasaciones"
              className="mt-8 inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-8 py-3.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
            >
              Solicitar tasación
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
