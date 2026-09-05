"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

// Instancia única a nivel de módulo: se crea al montar el layout público y
// se reutiliza entre navegaciones cliente (no se recrea por cada página).
let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Bug real reportado: al navegar o al terminar de cargar imágenes, el
    // límite de scroll que calcula Lenis puede quedar desactualizado (más
    // corto que el alto real de la página) y el scroll "se traba" antes de
    // llegar al final. Forzamos un recálculo en los momentos en que la
    // altura de la página puede haber cambiado.
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    window.addEventListener("load", () => lenis.resize());

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // Cambio de ruta (navegación cliente, sin recarga completa): el alto de
  // la página nueva es distinto al de la anterior, y sin este resize
  // explícito Lenis puede seguir usando el límite de scroll viejo durante
  // un momento — se siente exactamente como "no me deja bajar del todo".
  useEffect(() => {
    const id = requestAnimationFrame(() => lenisInstance?.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <>{children}</>;
}
