"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { formatearNumero } from "@/lib/formato";

const ESTADISTICAS = [
  { valor: 50, suffix: "+", label: "Propiedades publicadas" },
  { valor: 12, suffix: "", label: "Localidades cubiertas" },
  { valor: 5, suffix: "+", label: "Años de matrícula" },
] as const;

function ContadorAnimado({ valor, suffix }: { valor: number; suffix: string }) {
  const [conteo, setConteo] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isVisible) return;
    let inicio = 0;
    const duracion = 1500;
    const paso = 16;
    const incremento = valor / (duracion / paso);

    const timer = setInterval(() => {
      inicio += incremento;
      if (inicio >= valor) {
        setConteo(valor);
        clearInterval(timer);
      } else {
        setConteo(Math.floor(inicio));
      }
    }, paso);

    return () => clearInterval(timer);
  }, [isVisible, valor]);

  return (
    <span ref={ref} className="text-fp-number text-fp-white">
      {formatearNumero(conteo)}
      {suffix}
    </span>
  );
}

export function BloqueEstadisticas() {
  return (
    <section className="bg-fp-navy py-20 lg:py-32">
      <div className="fp-container">
        <div className="grid gap-12 md:grid-cols-3">
          {ESTADISTICAS.map((est, i) => (
            <motion.div
              key={est.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.15 * i }}
              className="text-center"
            >
              <div className="text-fp-display mb-2">
                <ContadorAnimado valor={est.valor} suffix={est.suffix} />
              </div>
              <p className="text-fp-small text-white/60">{est.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
