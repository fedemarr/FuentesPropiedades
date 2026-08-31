import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Política de Privacidad — Fuentes Propiedades",
};

export default async function PrivacidadPage() {
  const config = await prisma.configuracion.findUnique({
    where: { id: "singleton" },
    select: { email: true },
  });
  const email = config?.email || "{{PENDIENTE}}";

  return (
    <>
      <section className="relative flex min-h-[400px] items-center overflow-hidden bg-fp-navy lg:min-h-[480px]">
        <div className="fp-container relative z-10 py-20 lg:py-0">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-fp-display text-fp-white">Política de Privacidad</h1>
            <p className="text-fp-body mt-4 text-white/70">
              Conocé cómo tratamos y protegemos tus datos.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-fp-white py-20 lg:py-32">
        <div className="fp-container">
          <div className="mx-auto max-w-3xl text-fp-body text-fp-slate space-y-10">
            <div>
              <h2 className="text-fp-h3 text-fp-ink mb-3">Datos recopilados</h2>
              <p>
                En Fuentes Propiedades recopilamos únicamente los datos que vos
                nos proporcionás de forma voluntaria al completar formularios de
                contacto, solicitar tasaciones o utilizar nuestros servicios. Estos
                datos pueden incluir: nombre, dirección de email, número de
                teléfono y mensaje.
              </p>
            </div>

            <div>
              <h2 className="text-fp-h3 text-fp-ink mb-3">Uso de datos</h2>
              <p className="mb-3">
                Utilizamos tus datos exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Responder a tus consultas y solicitudes.</li>
                <li>Coordinar tasaciones y operaciones inmobiliarias.</li>
                <li>Enviarte información relevante sobre propiedades, solo si lo solicitaste.</li>
                <li>Cumplir con obligaciones legales y contractuales.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-fp-h3 text-fp-ink mb-3">Cookies</h2>
              <p>
                Este sitio puede utilizar cookies técnicas necesarias para su
                funcionamiento (por ejemplo, preferencias de sesión). No utilizamos
                cookies de rastreo publicitario ni de análisis de terceros sin tu
                consentimiento expreso.
              </p>
            </div>

            <div>
              <h2 className="text-fp-h3 text-fp-ink mb-3">Tus derechos</h2>
              <p>
                De acuerdo con la Ley de Protección de Datos Personales
                (Ley 25.326), tenés derecho a acceder, rectificar, eliminar o
                solicitar la portabilidad de tus datos personales. Podés ejercer
                estos derechos contactándonos a través de los medios que se
                indican más abajo.
              </p>
            </div>

            <div>
              <h2 className="text-fp-h3 text-fp-ink mb-3">Contacto</h2>
              <p>
                Si tenés preguntas sobre esta política de privacidad o sobre el
                tratamiento de tus datos personales, podés escribirnos a{" "}
                <span className="font-medium text-fp-ink">{email}</span>.
              </p>
            </div>

            <p className="text-fp-small pt-4 text-fp-slate">
              Última actualización: 26 de agosto de 2026.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
