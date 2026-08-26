"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, KeyRound, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICIOS = [
  {
    titulo: "Venta",
    descripcion:
      "Te acompañamos en todo el proceso de compra o venta de tu propiedad, con la seguridad de una martillera pública matriculada.",
    href: "/venta",
    icono: Home,
  },
  {
    titulo: "Alquiler",
    descripcion:
      "Encontrá tu próximo hogar o invertí en una propiedad en alquiler en la zona norte del GBA.",
    href: "/alquiler",
    icono: KeyRound,
  },
  {
    titulo: "Administraciones",
    descripcion:
      "Gestión integral de propiedades en alquiler: cobro, mantenimiento, rendición y más.",
    href: "/administraciones",
    icono: Building2,
  },
] as const;

export function FranjaServicios() {
  return (
    <section className="bg-fp-white py-20 lg:py-32">
      <div className="fp-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center lg:mb-16"
        >
          <h2 className="text-fp-h2 text-fp-ink">
            <span className="font-normal">¿Qué </span>
            <span className="font-semibold">necesitás?</span>
          </h2>
          <span className="fp-section-title-underline mx-auto mt-3" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICIOS.map((serv, i) => (
            <motion.div
              key={serv.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <Link
                href={serv.href}
                className={cn(
                  "group flex h-full flex-col rounded-[--radius-fp-lg] border border-fp-line p-8 transition-all duration-300",
                  "hover:-translate-y-1 hover:border-fp-red/20 hover:shadow-fp-md",
                )}
              >
                <serv.icono className="mb-5 h-8 w-8 text-fp-navy transition-colors group-hover:text-fp-red" />
                <h3 className="text-fp-h3 mb-2 text-fp-ink">{serv.titulo}</h3>
                <p className="text-fp-body flex-1 text-fp-slate">
                  {serv.descripcion}
                </p>
                <span className="text-fp-small mt-4 font-semibold text-fp-red transition-colors group-hover:text-fp-red-700">
                  Conocer más →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
