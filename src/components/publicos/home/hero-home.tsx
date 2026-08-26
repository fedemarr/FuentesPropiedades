"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroHome() {
  const [operacion, setOperacion] = useState<"VENTA" | "ALQUILER">("VENTA");
  const [busqueda, setBusqueda] = useState("");

  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden bg-fp-navy lg:min-h-screen">
      {/* Imagen de fondo con parallax (placeholderUntil real image) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://picsum.photos/seed/fuentes-hero/1920/1080')",
          transform: "translateY(0)",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-fp-navy/55 to-fp-navy/75" />

      <div className="fp-container relative z-10 py-20 lg:py-0">
        <div className="mx-auto max-w-3xl text-center">
          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-fp-display text-fp-white"
          >
            Encontrá tu
            <br />
            <span className="font-normal">próximo hogar</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-fp-body mt-4 text-white/70 lg:mt-6"
          >
            Venta, alquiler y administración de propiedades en zona norte del
            GBA.
          </motion.p>

          {/* Toggle Venta / Alquiler */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 inline-flex rounded-full bg-white/10 p-1 backdrop-blur-sm"
          >
            {(["VENTA", "ALQUILER"] as const).map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setOperacion(op)}
                className={cn(
                  "relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors",
                  operacion === op
                    ? "text-fp-white"
                    : "text-white/60 hover:text-white/80",
                )}
              >
                {operacion === op && (
                  <motion.span
                    layoutId="hero-toggle"
                    className="absolute inset-0 rounded-full bg-fp-red"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {op === "VENTA" ? "Venta" : "Alquiler"}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Barra de búsqueda flotante */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8"
          >
            <form
              action="/propiedades"
              method="get"
              className="mx-auto flex max-w-2xl items-center gap-2 rounded-[--radius-fp-lg] bg-fp-white p-2 shadow-fp-lg"
            >
              <input type="hidden" name="operacion" value={operacion} />
              <input
                type="text"
                name="q"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por barrio o localidad..."
                className="flex-1 bg-transparent px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-6 py-3 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-fp-small text-white/40">Scroll</span>
          <div className="h-10 w-6 rounded-full border-2 border-white/20">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/40"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
