"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginacionAdminProps {
  paginaActual: number;
  totalPaginas: number;
}

export function PaginacionAdmin({ paginaActual, totalPaginas }: PaginacionAdminProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPaginas <= 1) return null;

  function irA(pagina: number) {
    const params = new URLSearchParams(searchParams);
    if (pagina === 1) params.delete("pagina");
    else params.set("pagina", String(pagina));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-fp-small text-fp-slate">
        Página {paginaActual} de {totalPaginas}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={paginaActual <= 1}
          onClick={() => irA(paginaActual - 1)}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={paginaActual >= totalPaginas}
          onClick={() => irA(paginaActual + 1)}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
