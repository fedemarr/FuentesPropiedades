"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Handshake, Home, KeyRound, ClipboardList, BarChart3, HeartHandshake } from "lucide-react";

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

const SERVICIOS = [
  { icono: Home, texto: "Venta de propiedades" },
  { icono: KeyRound, texto: "Alquileres" },
  { icono: ClipboardList, texto: "Administración de alquileres" },
  { icono: BarChart3, texto: "Tasaciones" },
  { icono: HeartHandshake, texto: "Asesoramiento inmobiliario" },
];

interface ContenidoNosotrosProps {
  textoNosotros: string;
}

export function ContenidoNosotros({ textoNosotros }: ContenidoNosotrosProps) {
  const parrafos = textoNosotros.split("\n\n").filter(Boolean);

  return (
    <>
      <section className="relative flex min-h-[480px] items-center overflow-hidden bg-fp-navy lg:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/fotoparainiciotrasnparente.jpeg')",
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
            <p className="text-fp-body mt-4 text-white/70">Tu propiedad, nuestro compromiso.</p>
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
                style={{ backgroundImage: "url('/fotomaria.jpeg')" }}
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
                {parrafos.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>

              <div className="mt-6 border-l-2 border-fp-red pl-4">
                <p className="text-fp-h3 text-fp-ink">Mariana Fuentes</p>
                <p className="text-fp-small text-fp-slate">
                  Martillera Pública y Corredora Inmobiliaria
                </p>
                <p className="text-fp-label mt-2 text-fp-navy">
                  Profesionalismo · Confianza · Compromiso
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
              <span className="font-normal">¿Qué </span>
              <span className="font-semibold">hacemos?</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICIOS.map((servicio, i) => (
              <motion.div
                key={servicio.texto}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex items-center gap-3 rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-5 py-4"
              >
                <servicio.icono className="size-5 shrink-0 text-fp-red" />
                <span className="text-fp-body font-medium text-fp-ink">{servicio.texto}</span>
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
