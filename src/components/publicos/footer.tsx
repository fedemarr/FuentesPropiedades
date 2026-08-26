import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logotipo } from "@/components/marca/logotipo";

const LINKS_SERVICIOS = [
  { href: "/venta", label: "Venta de propiedades" },
  { href: "/alquiler", label: "Alquiler de propiedades" },
  { href: "/administraciones", label: "Administración" },
  { href: "/tasaciones", label: "Tasaciones" },
] as const;

const LINKS_NAVEGACION = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
  { href: "/privacidad", label: "Política de privacidad" },
] as const;

export function FooterPublico() {
  return (
    <footer className="bg-fp-navy text-white">
      <div className="fp-container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Columna 1: Logo + Descripción */}
          <div className="lg:col-span-1">
            <Logotipo variante="claro" className="mb-6" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Martillera pública matriculada en zona norte del GBA. Venta,
              alquiler y administración de propiedades.
            </p>
          </div>

          {/* Columna 2: Servicios */}
          <div>
            <h3 className="text-fp-label mb-4 text-fp-white">Servicios</h3>
            <ul className="space-y-2.5">
              {LINKS_SERVICIOS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-fp-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Navegación */}
          <div>
            <h3 className="text-fp-label mb-4 text-fp-white">Navegación</h3>
            <ul className="space-y-2.5">
              {LINKS_NAVEGACION.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-fp-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-fp-label mb-4 text-fp-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-fp-red" />
                <span className="text-sm text-white/60">
                  {"{{PENDIENTE}}"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-fp-red" />
                <span className="text-sm text-white/60">
                  {"{{PENDIENTE}}"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-fp-red" />
                <span className="text-sm text-white/60">
                  {"{{PENDIENTE}}"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-fp-red" />
                <span className="text-sm text-white/60">
                  {"{{PENDIENTE}}"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="fp-container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Fuentes Propiedades. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-white/40">
            C.S.M. 0000 · Matrícula martillera pública
          </p>
        </div>
      </div>
    </footer>
  );
}
