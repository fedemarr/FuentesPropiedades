"use client";

import { useState, useCallback, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarFiltros } from "./sidebar-filtros";
import { BarraResultados } from "./barra-resultados";
import { GrillaPropiedades } from "./grilla-propiedades";
import { PaginacionListado } from "./paginacion-listado";
import type { PropiedadCardData } from "@/components/publicos/card-propiedad";

// Leaflet toca `window` apenas se importa el módulo (no solo al renderizar),
// así que una importación estática rompe el server-side rendering de esta
// página entera ("ReferenceError: window is not defined"). Esto era la
// causa real del listado "trabado" — la página crasheaba en el servidor.
const VistaMapa = dynamic(() => import("./vista-mapa").then((m) => m.VistaMapa), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-[--radius-fp-lg] bg-fp-bone text-fp-slate lg:h-[700px]">
      Cargando mapa…
    </div>
  ),
});

interface ListadoPropiedadesProps {
  propiedades: PropiedadCardData[];
  total: number;
  paginaActual: number;
  totalPaginas: number;
  filtrosIniciales: Record<string, string | undefined>;
}

export function ListadoPropiedades({
  propiedades,
  total,
  paginaActual,
  totalPaginas,
  filtrosIniciales,
}: ListadoPropiedadesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [vista, setVista] = useState<"grilla" | "mapa">("grilla");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const actualizarFiltros = useCallback(
    (nuevosParams: Record<string, string | null>) => {
      const actual = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(nuevosParams)) {
        if (value === null || value === "" || value === undefined) {
          actual.delete(key);
        } else {
          actual.set(key, value);
        }
      }
      actual.delete("pagina");
      startTransition(() => {
        router.push(`/propiedades?${actual.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  const irAPagina = useCallback(
    (pag: number) => {
      const actual = new URLSearchParams(searchParams.toString());
      if (pag <= 1) {
        actual.delete("pagina");
      } else {
        actual.set("pagina", String(pag));
      }
      startTransition(() => {
        router.push(`/propiedades?${actual.toString()}`, { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  const filtrosActivos = Array.from(searchParams.entries()).filter(
    ([key]) =>
      !["pagina", "vista", "orden"].includes(key) && searchParams.get(key),
  );

  return (
    <div className="min-h-screen bg-fp-bone">
      {/* Barra sticky de resultados */}
      <BarraResultados
        total={total}
        filtrosActivos={filtrosActivos}
        onFiltroEliminar={(key) => actualizarFiltros({ [key]: null })}
        onOrdenar={(orden) => actualizarFiltros({ orden })}
        ordenActual={searchParams.get("orden") ?? "recientes"}
        vista={vista}
        onVistaCambiar={setVista}
        onFiltrosClick={() => setSidebarAbierto(true)}
        isPending={isPending}
      />

      <div className="fp-container flex gap-8 py-6">
        {/* Sidebar filtros — desktop */}
        <aside className="hidden w-[300px] shrink-0 lg:block">
          <SidebarFiltros
            filtrosActuales={filtrosIniciales}
            onFiltrosCambiar={actualizarFiltros}
          />
        </aside>

        {/* Contenido principal */}
        <div className="min-w-0 flex-1">
          {vista === "grilla" ? (
            <>
              <GrillaPropiedades propiedades={propiedades} />
              {totalPaginas > 1 && (
                <div className="mt-8">
                  <PaginacionListado
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPagina={irAPagina}
                  />
                </div>
              )}
            </>
          ) : (
            <VistaMapa propiedades={propiedades} />
          )}
        </div>
      </div>

      {/* Sidebar filtros — mobile drawer */}
      {sidebarAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarAbierto(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-[340px] overflow-y-auto bg-fp-white p-6 shadow-xl">
            <SidebarFiltros
              filtrosActuales={filtrosIniciales}
              onFiltrosCambiar={(params) => {
                actualizarFiltros(params);
                setSidebarAbierto(false);
              }}
              onCerrar={() => setSidebarAbierto(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
