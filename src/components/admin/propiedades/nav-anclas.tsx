"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnclaSeccion {
  id: string;
  label: string;
}

interface NavAnclasProps {
  secciones: AnclaSeccion[];
}

export function NavAnclas({ secciones }: NavAnclasProps) {
  const [activa, setActiva] = useState(secciones[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiva(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );

    for (const seccion of secciones) {
      const el = document.getElementById(seccion.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [secciones]);

  return (
    <nav className="sticky top-24 hidden w-48 shrink-0 flex-col gap-1 xl:flex">
      {secciones.map((seccion) => (
        <a
          key={seccion.id}
          href={`#${seccion.id}`}
          className={cn(
            "rounded-fp-sm px-3 py-2 text-fp-small transition-colors",
            activa === seccion.id
              ? "bg-fp-navy-50 font-medium text-fp-navy"
              : "text-fp-slate hover:bg-fp-bone hover:text-fp-ink",
          )}
        >
          {seccion.label}
        </a>
      ))}
    </nav>
  );
}
