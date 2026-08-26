"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { Logotipo } from "@/components/marca/logotipo";
import { cn } from "@/lib/utils";

const LINKS_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/venta", label: "Venta" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/administraciones", label: "Administraciones" },
  { href: "/tasaciones", label: "Tasaciones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function NavbarPublica() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (menuAbierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-fp-navy/95 py-3 shadow-lg backdrop-blur-md"
            : "bg-fp-navy py-5",
        )}
      >
        <div className="fp-container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logotipo
              variante="claro"
              className={cn(
                "transition-all duration-300",
                scrolled ? "scale-90" : "scale-100",
              )}
            />
          </Link>

          {/* Nav escritorio */}
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS_NAV.map((link) => {
              const activo =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    activo
                      ? "text-fp-white"
                      : "text-white/70 hover:text-fp-white",
                  )}
                >
                  {link.label}
                  {activo && (
                    <motion.span
                      layoutId="nav-indicador"
                      className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-fp-red"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3">
            {/* Favoritos */}
            <Link
              href="/favoritos"
              className="relative rounded-full p-2 text-white/70 transition-colors hover:text-fp-white"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Menú mobile */}
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="rounded-lg p-2 text-white/70 transition-colors hover:text-fp-white lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú mobile full-screen */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-fp-navy lg:hidden"
          >
            {/* Botón cerrar */}
            <div className="fp-container flex items-center justify-between py-5">
              <Logotipo variante="claro" />
              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                className="rounded-lg p-2 text-white/70 transition-colors hover:text-fp-white"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <nav className="fp-container mt-8 flex flex-col gap-1">
              {LINKS_NAV.map((link, i) => {
                const activo =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-lg font-medium transition-colors",
                        activo
                          ? "bg-fp-navy-700 text-fp-white"
                          : "text-white/70 hover:bg-fp-navy-700/50 hover:text-fp-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
