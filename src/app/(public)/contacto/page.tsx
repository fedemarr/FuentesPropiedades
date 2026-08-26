"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const INFO_CONTACTO = [
  {
    icono: Phone,
    titulo: "Teléfono",
    valor: "{{PENDIENTE}}",
  },
  {
    icono: Mail,
    titulo: "Email",
    valor: "{{PENDIENTE}}",
  },
  {
    icono: MapPin,
    titulo: "Dirección",
    valor: "{{PENDIENTE}}",
  },
  {
    icono: Clock,
    titulo: "Horarios",
    valor: "{{PENDIENTE}}",
  },
];

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden bg-fp-navy lg:min-h-[480px]">
        <div className="fp-container relative z-10 py-20 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="text-fp-display text-fp-white">Contacto</h1>
            <p className="text-fp-body mt-4 text-white/70">
              Escribinos y te respondemos a la brevedad.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-fp-h2 text-fp-ink">
                <span className="font-normal">Envianos tu </span>
                <span className="font-semibold">mensaje</span>
              </h2>
              <span className="fp-section-title-underline mt-3 block" />

              {enviado ? (
                <div className="mt-8 rounded-[--radius-fp-lg] border border-fp-success-50 bg-fp-success-50 p-8 text-center">
                  <p className="text-fp-body font-semibold text-fp-success">
                    ¡Mensaje enviado! Te contactaremos a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                    <div>
                      <label className="text-fp-label text-fp-slate mb-1.5 block">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Opcional"
                        className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-fp-label text-fp-slate mb-1.5 block">
                      Mensaje
                    </label>
                    <textarea
                      required
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      rows={5}
                      placeholder="¿En qué podemos ayudarte?"
                      className="w-full rounded-[--radius-fp-md] border border-fp-line bg-fp-white px-4 py-3 text-fp-body text-fp-ink outline-none placeholder:text-fp-slate focus:border-fp-navy focus:ring-1 focus:ring-fp-navy resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-[--radius-fp-md] bg-fp-red px-8 py-3.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
                  >
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {INFO_CONTACTO.map((info, i) => (
                <motion.div
                  key={info.titulo}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: 0.1 * i }}
                  className="flex items-start gap-4 rounded-[--radius-fp-md] border border-fp-line p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fp-navy/5">
                    <info.icono className="h-5 w-5 text-fp-navy" />
                  </div>
                  <div>
                    <h3 className="text-fp-label text-fp-slate">{info.titulo}</h3>
                    <p className="text-fp-body mt-0.5 text-fp-ink">{info.valor}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
