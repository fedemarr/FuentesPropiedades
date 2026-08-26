"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CardPropiedad,
  type PropiedadCardData,
} from "@/components/publicos/card-propiedad";

interface PropiedadesDestacadasProps {
  propiedades: PropiedadCardData[];
}

export function PropiedadesDestacadas({
  propiedades,
}: PropiedadesDestacadasProps) {
  if (propiedades.length === 0) return null;

  return (
    <section className="bg-fp-bone py-20 lg:py-32">
      <div className="fp-container">
        {/* Título de sección */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center lg:mb-16"
        >
          <h2 className="text-fp-h2 text-fp-ink">
            <span className="font-normal">Nuestras </span>
            <span className="font-semibold">PROPIEDADES DESTACADAS</span>
          </h2>
          <span className="fp-section-title-underline mx-auto mt-3" />
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {propiedades.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.06 * i }}
            >
              <CardPropiedad propiedad={prop} />
            </motion.div>
          ))}
        </div>

        {/* Botón ver todas */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 text-center lg:mt-16"
        >
          <Link
            href="/propiedades"
            className="inline-flex items-center gap-2 rounded-[--radius-fp-md] border-2 border-fp-navy px-8 py-3.5 text-sm font-semibold text-fp-navy transition-all hover:bg-fp-navy hover:text-fp-white"
          >
            Ver todas las propiedades
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
