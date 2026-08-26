"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Handshake } from "lucide-react";

const LOCALIDADES = [
  "San Miguel",
  "Bella Vista",
  "Muñiz",
  "Los Polvorines",
  "Del Viso",
  "Tortuguitas",
];

const VALORES = [
  {
    icono: Shield,
    titulo: "Compromiso",
    texto: "Cada operación es única. Nos involucramos personalmente para que cada cliente reciba la atención que merece, desde la primera consulta hasta la firma.",
  },
  {
    icono: Eye,
    titulo: "Transparencia",
    texto: "Te mantenemos informado en cada etapa. Sin sorpresas, sin letra chica. Los valores, plazos y condiciones se conversan desde el principio.",
  },
  {
    icono: Handshake,
    titulo: "Cercanía",
    texto: "Trabajamos en la zona donde vivimos y conocemos cada barrio. Esa cercanía nos permite entender mejor tus necesidades y las del mercado.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="relative flex min-h-[480px] items-center overflow-hidden bg-fp-navy lg:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://picsum.photos/seed/fuentes-nosotros/1920/1080')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-fp-navy/60 to-fp-navy/80" />

        <div className="fp-container relative z-10 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-fp-display text-fp-white">Sobre Fuentes Propiedades</h1>
            <p className="text-fp-body mt-4 text-white/70">
              Conocé a la persona detrás de cada operación.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
                    "url('https://picsum.photos/seed/fuentes-martillera/800/1000')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fp-navy/30 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="text-fp-label text-fp-red">Sobre nosotros</span>
              <h2 className="text-fp-h2 mt-3 text-fp-ink">
                <span className="font-normal">Martillera pública </span>
                <span className="font-semibold">matriculada</span>
              </h2>
              <span className="fp-section-title-underline mt-3 block" />
              <div className="text-fp-body text-fp-slate mt-6 space-y-4">
                <p>
                  Soy martillera pública matriculada bajo la matrícula C.S.M.
                  0000, especializada en zona norte del Gran Buenos Aires.
                </p>
                <p>
                  Trabajo de forma personalizada en cada operación de venta,
                  alquiler y administración de propiedades, acompañando a cada
                  cliente desde la primera consulta hasta la firma.
                </p>
                <p>
                  Cubro San Miguel, Bella Vista, Muñiz, Los Polvorines, Del Viso,
                  Tortuguitas y alrededores. Conozco cada barrio, cada calle y
                  cada tendencia del mercado local.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-fp-bone py-20 lg:py-32">
        <div className="fp-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-fp-h2 text-fp-ink">
              <span className="font-normal">Zonas de </span>
              <span className="font-semibold">cobertura</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
            {LOCALIDADES.map((loc, i) => (
              <motion.div
                key={loc}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex items-center justify-center rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-6 py-4 text-fp-body font-medium text-fp-ink"
              >
                {loc}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-fp-h2 text-fp-ink">
              <span className="font-normal">Nuestros </span>
              <span className="font-semibold">valores</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {VALORES.map((valor, i) => (
              <motion.div
                key={valor.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="rounded-[--radius-fp-lg] border border-fp-line p-8"
              >
                <valor.icono className="mb-5 h-8 w-8 text-fp-navy" />
                <h3 className="text-fp-h3 text-fp-ink mb-2">{valor.titulo}</h3>
                <p className="text-fp-body text-fp-slate">{valor.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
