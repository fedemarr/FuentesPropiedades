"use client";

import { motion } from "framer-motion";
import {
  CardPropiedad,
  type PropiedadCardData,
} from "@/components/publicos/card-propiedad";

interface GrillaPropiedadesProps {
  propiedades: PropiedadCardData[];
}

export function GrillaPropiedades({ propiedades }: GrillaPropiedadesProps) {
  if (propiedades.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-fp-display mb-4 text-fp-navy/20">0</div>
        <h3 className="text-fp-h3 text-fp-ink">
          No encontramos propiedades con esos filtros
        </h3>
        <p className="text-fp-body mt-2 text-fp-slate">
          Probá ampliando la búsqueda o eliminando algunos filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {propiedades.map((prop, i) => (
        <motion.div
          key={prop.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(0.04 * i, 0.4) }}
        >
          <CardPropiedad propiedad={prop} />
        </motion.div>
      ))}
    </div>
  );
}
