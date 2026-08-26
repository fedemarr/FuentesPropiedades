"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginacionListadoProps {
  paginaActual: number;
  totalPaginas: number;
  onPagina: (pag: number) => void;
}

export function PaginacionListado({
  paginaActual,
  totalPaginas,
  onPagina,
}: PaginacionListadoProps) {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  // Mostrar最多 7 páginas con ellipsis
  const paginasVisibles = paginas.filter((p) => {
    if (p === 1 || p === totalPaginas) return true;
    if (Math.abs(p - paginaActual) <= 2) return true;
    return false;
  });

  const conEllipsis: (number | "...")[] = [];
  let prev = 0;
  for (const p of paginasVisibles) {
    if (prev !== 0 && p - prev > 1) conEllipsis.push("...");
    conEllipsis.push(p);
    prev = p;
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginación">
      <button
        type="button"
        onClick={() => onPagina(paginaActual - 1)}
        disabled={paginaActual <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-fp-slate transition-colors hover:bg-fp-navy-50 hover:text-fp-navy disabled:opacity-30"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {conEllipsis.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-fp-slate">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPagina(p)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === paginaActual
                ? "bg-fp-navy text-fp-white"
                : "text-fp-ink hover:bg-fp-navy-50",
            )}
            aria-current={p === paginaActual ? "page" : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-fp-slate transition-colors hover:bg-fp-navy-50 hover:text-fp-navy disabled:opacity-30"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
