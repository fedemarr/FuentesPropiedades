"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LABEL_TIPO_PROPIEDAD } from "@/lib/enum-labels";
import { LABEL_ANTIGUEDAD } from "@/lib/enum-labels";
import { LABEL_CONDICION } from "@/lib/enum-labels";
import { waLink, waMensajeTasacion } from "@/lib/whatsapp";

const PASOS = ["Sobre el inmueble", "Detalles", "Tus datos"];

interface DatosTasacion {
  tipo: string;
  direccion: string;
  ambientes: string;
  supCubierta: string;
  supTotal: string;
  antiguedad: string;
  condicion: string;
  descripcion: string;
  nombre: string;
  telefono: string;
  email: string;
}

const ESTADO_INICIAL: DatosTasacion = {
  tipo: "",
  direccion: "",
  ambientes: "",
  supCubierta: "",
  supTotal: "",
  antiguedad: "",
  condicion: "",
  descripcion: "",
  nombre: "",
  telefono: "",
  email: "",
};

const TIPOS = Object.entries(LABEL_TIPO_PROPIEDAD).map(([value, label]) => ({ value, label }));
const ANTIGUEDADES = Object.entries(LABEL_ANTIGUEDAD).map(([value, label]) => ({ value, label }));
const CONDICIONES = Object.entries(LABEL_CONDICION).map(([value, label]) => ({ value, label }));

function validarPaso(paso: number, datos: DatosTasacion): boolean {
  if (paso === 0) {
    return !!datos.tipo && !!datos.direccion.trim();
  }
  if (paso === 1) {
    return !!datos.condicion;
  }
  if (paso === 2) {
    return !!datos.nombre.trim() && !!datos.telefono.trim();
  }
  return true;
}

interface ContenidoTasacionesProps {
  numeroWhatsapp: string;
}

export function ContenidoTasaciones({ numeroWhatsapp }: ContenidoTasacionesProps) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<DatosTasacion>(ESTADO_INICIAL);
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState<string | null>(null);

  function actualizar<K extends keyof DatosTasacion>(campo: K, valor: string) {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    setErrores(null);
  }

  function siguiente() {
    if (!validarPaso(paso, datos)) {
      if (paso === 0) setErrores("Completá el tipo de propiedad y la dirección o barrio.");
      else if (paso === 1) setErrores("Seleccioná la condición del inmueble.");
      else if (paso === 2) setErrores("Completá tu nombre y teléfono.");
      return;
    }
    if (paso < PASOS.length - 1) setPaso(paso + 1);
    else setEnviado(true);
  }

  function anterior() {
    if (paso > 0) setPaso(paso - 1);
  }

  if (enviado) {
    return (
      <section className="flex min-h-screen items-center bg-fp-bone pt-24">
        <div className="fp-container py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fp-success-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Check className="h-10 w-10 text-fp-success" />
              </motion.div>
            </div>
            <h1 className="text-fp-h1 text-fp-ink">¡Solicitud enviada!</h1>
            <p className="text-fp-body text-fp-slate mt-4">
              Recibimos los datos de tu propiedad. Te contactaremos a la brevedad
              para coordinar la tasación.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={waLink(
                  numeroWhatsapp,
                  waMensajeTasacion(
                    LABEL_TIPO_PROPIEDAD[datos.tipo] || datos.tipo,
                    datos.direccion,
                  ),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[--radius-fp-md] bg-fp-success px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-6 py-3 text-sm font-semibold text-fp-ink transition-colors hover:bg-fp-bone"
              >
                Volver al inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-start bg-fp-bone pt-24 lg:pt-32">
      <div className="fp-container py-12 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-fp-h1 text-fp-ink">Solicitar tasación</h1>
            <p className="text-fp-body text-fp-slate mt-2">
              Completá los datos de tu propiedad y te contactaremos a la brevedad.
            </p>
          </motion.div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {PASOS.map((nombre, i) => (
                <div key={i} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                        i <= paso
                          ? "bg-fp-red text-fp-white"
                          : "bg-fp-line text-fp-slate",
                      )}
                    >
                      {i < paso ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className="text-fp-small mt-2 hidden text-fp-slate sm:block">
                      {nombre}
                    </span>
                  </div>
                  {i < PASOS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 h-0.5 flex-1 transition-colors",
                        i < paso ? "bg-fp-red" : "bg-fp-line",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[--radius-fp-lg] border border-fp-line bg-fp-white p-6 shadow-fp-sm lg:p-8">
            <AnimatePresence mode="wait">
              {paso === 0 && (
                <motion.div
                  key="paso-0"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Tipo de propiedad *
                    </label>
                    <select
                      value={datos.tipo}
                      onChange={(e) => actualizar("tipo", e.target.value)}
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    >
                      <option value="">Seleccionar...</option>
                      {TIPOS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Dirección o barrio *
                    </label>
                    <input
                      type="text"
                      value={datos.direccion}
                      onChange={(e) => actualizar("direccion", e.target.value)}
                      placeholder="Ej: Belgrano 1487, San Miguel"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">
                        Ambientes
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={datos.ambientes}
                        onChange={(e) => actualizar("ambientes", e.target.value)}
                        placeholder="—"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">
                        Sup. cubierta (m²)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={datos.supCubierta}
                        onChange={(e) => actualizar("supCubierta", e.target.value)}
                        placeholder="—"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">
                        Sup. total (m²)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={datos.supTotal}
                        onChange={(e) => actualizar("supTotal", e.target.value)}
                        placeholder="—"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Antigüedad
                    </label>
                    <select
                      value={datos.antiguedad}
                      onChange={(e) => actualizar("antiguedad", e.target.value)}
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    >
                      <option value="">Seleccionar...</option>
                      {ANTIGUEDADES.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {paso === 1 && (
                <motion.div
                  key="paso-1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Condición del inmueble *
                    </label>
                    <select
                      value={datos.condicion}
                      onChange={(e) => actualizar("condicion", e.target.value)}
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    >
                      <option value="">Seleccionar...</option>
                      {CONDICIONES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Descripción adicional
                    </label>
                    <textarea
                      value={datos.descripcion}
                      onChange={(e) => actualizar("descripcion", e.target.value)}
                      rows={4}
                      placeholder="Contanos sobre el estado, orientación, servicios, etc."
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {paso === 2 && (
                <motion.div
                  key="paso-2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={datos.nombre}
                      onChange={(e) => actualizar("nombre", e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={datos.telefono}
                      onChange={(e) => actualizar("telefono", e.target.value)}
                      placeholder="Ej: 11 5555-1234"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      value={datos.email}
                      onChange={(e) => actualizar("email", e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errores && (
              <p className="text-fp-small mt-4 text-fp-error">{errores}</p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={anterior}
                disabled={paso === 0}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[--radius-fp-md] px-5 py-2.5 text-sm font-semibold transition-colors",
                  paso === 0
                    ? "cursor-not-allowed text-fp-slate"
                    : "text-fp-ink hover:bg-fp-bone",
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                type="button"
                onClick={siguiente}
                className="inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-6 py-3 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
              >
                {paso === PASOS.length - 1 ? "Enviar solicitud" : "Siguiente"}
                {paso < PASOS.length - 1 && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
