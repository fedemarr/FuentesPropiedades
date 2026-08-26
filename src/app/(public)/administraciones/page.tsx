"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  FileCheck,
  Wrench,
  BarChart3,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INCLUYE = [
  {
    icono: Banknote,
    titulo: "Cobro de alquileres",
    texto: "Gestionamos el cobro mensual puntual y resolvemos incidencias con los inquilinos.",
  },
  {
    icono: FileCheck,
    titulo: "Control de pagos",
    texto: "Seguimos pagos de expensas, impuestos y servicios para que tu propiedad no tenga deudas.",
  },
  {
    icono: Wrench,
    titulo: "Gestión de reclamos",
    texto: "Recibimos, evaluamos y derivamos reclamos y reparaciones con proveedores de confianza.",
  },
  {
    icono: BarChart3,
    titulo: "Rendición mensual",
    texto: "Recibís un informe claro y detallado cada mes con ingresos, egresos y saldos.",
  },
];

const PASOS = [
  { numero: "01", titulo: "Recibimos tu inmueble", texto: "Evaluamos la propiedad, firmamos el contrato de administración y tomamos el relevamiento completo." },
  { numero: "02", titulo: "Evaluamos y tasamos", texto: "Definimos el valor de alquiler según el mercado de la zona y las características del inmueble." },
  { numero: "03", titulo: "Buscamos inquilinos", texto: "Publicamos, filtramos candidatos, verificamos documentación y firmamos el contrato." },
  { numero: "04", titulo: "Gestionamos todo", texto: "Cobramos, pagamos expensas, resolvemos reclamos y te rendimos mes a mes." },
];

export default function AdministracionesPage() {
  const [formNombre, setFormNombre] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formTipo, setFormTipo] = useState("");
  const [formUnidades, setFormUnidades] = useState("");
  const [formMensaje, setFormMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <>
      <section className="relative flex min-h-[480px] items-center overflow-hidden bg-fp-navy lg:min-h-[560px]">
        <div className="fp-container relative z-10 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-fp-display text-fp-white">Administración de Propiedades</h1>
            <p className="text-fp-body mt-4 text-white/70">
              Gestionamos tu propiedad de punta a punta para que vos no tengas que ocuparte del día a día.
            </p>
          </motion.div>
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
              <span className="font-normal">¿Qué </span>
              <span className="font-semibold">incluye?</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUYE.map((item, i) => (
              <motion.div
                key={item.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="rounded-[--radius-fp-lg] border border-fp-line p-6"
              >
                <item.icono className="mb-4 h-8 w-8 text-fp-navy" />
                <h3 className="text-fp-h3 text-fp-ink mb-2">{item.titulo}</h3>
                <p className="text-fp-body text-fp-slate">{item.texto}</p>
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
              <span className="font-normal">¿Cómo </span>
              <span className="font-semibold">trabajamos?</span>
            </h2>
            <span className="fp-section-title-underline mx-auto mt-3" />
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-fp-line lg:left-1/2 lg:-translate-x-px" />

              <div className="space-y-12">
                {PASOS.map((paso, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className={cn(
                      "relative flex items-start gap-6 lg:gap-0",
                      i % 2 === 1 && "lg:flex-row-reverse",
                    )}
                  >
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fp-red text-fp-white text-fp-h3 lg:mx-auto lg:-translate-x-1/2">
                      {paso.numero}
                    </div>
                    <div className={cn("lg:w-1/2 lg:px-12", i % 2 === 0 ? "lg:text-right" : "")}>
                      <h3 className="text-fp-h3 text-fp-ink">{paso.titulo}</h3>
                      <p className="text-fp-body text-fp-slate mt-1">{paso.texto}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-fp-h2 text-fp-ink">
                <span className="font-normal">Contactanos para </span>
                <span className="font-semibold">una propuesta</span>
              </h2>
              <span className="fp-section-title-underline mt-3 block" />
              <p className="text-fp-body text-fp-slate mt-6">
                Completá el formulario y te enviaremos una propuesta adaptada a tu
                situación. Sin compromiso.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {enviado ? (
                <div className="rounded-[--radius-fp-lg] border border-fp-success-50 bg-fp-success-50 p-8 text-center">
                  <p className="text-fp-body font-semibold text-fp-success">
                    ¡Mensaje enviado! Te contactaremos a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">Nombre</label>
                    <input
                      type="text"
                      required
                      value={formNombre}
                      onChange={(e) => setFormNombre(e.target.value)}
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={formTelefono}
                      onChange={(e) => setFormTelefono(e.target.value)}
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">Tipo de inmueble</label>
                      <select
                        value={formTipo}
                        onChange={(e) => setFormTipo(e.target.value)}
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="CASA">Casa</option>
                        <option value="DEPARTAMENTO">Departamento</option>
                        <option value="PH">PH</option>
                        <option value="LOCAL">Local</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">Cant. unidades</label>
                      <input
                        type="number"
                        min={1}
                        value={formUnidades}
                        onChange={(e) => setFormUnidades(e.target.value)}
                        placeholder="1"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">Mensaje</label>
                    <textarea
                      value={formMensaje}
                      onChange={(e) => setFormMensaje(e.target.value)}
                      rows={3}
                      placeholder="Contanos sobre tu situación..."
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-8 py-3.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
                  >
                    <Send className="h-4 w-4" />
                    Enviar consulta
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
