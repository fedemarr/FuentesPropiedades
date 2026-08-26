"use client";

import { motion } from "framer-motion";

interface HeroServicioProps {
  titulo: string;
  subtitulo: string;
}

export function HeroServicio({ titulo, subtitulo }: HeroServicioProps) {
  return (
    <section className="relative flex min-h-[480px] items-center overflow-hidden bg-fp-navy lg:min-h-[560px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://picsum.photos/seed/fuentes-servicio/1920/1080')",
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
          <h1 className="text-fp-display text-fp-white">{titulo}</h1>
          <p className="text-fp-body mt-4 text-white/70">{subtitulo}</p>
        </motion.div>
      </div>
    </section>
  );
}
