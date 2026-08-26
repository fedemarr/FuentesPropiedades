"use client";

import { LayoutGrid, Map, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearNumero } from "@/lib/formato";

interface BarraResultadosProps {
  total: number;
  filtrosActivos: [string, string][];
  onFiltroEliminar: (key: string) => void;
  onOrdenar: (orden: string) => void;
  ordenActual: string;
  vista: "grilla" | "mapa";
  onVistaCambiar: (vista: "grilla" | "mapa") => void;
  onFiltrosClick: () => void;
  isPending: boolean;
}

const ORDENES = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
  { value: "superficie", label: "Mayor superficie" },
] as const;

const LABELS_PARAMS: Record<string, (v: string) => string> = {
  operacion: (v) => (v === "VENTA" ? "Venta" : "Alquiler"),
  tipo: (v) => v.split(",").join(", "),
  q: (v) => `"${v}"`,
  barrio: (v) => v,
  localidad: (v) => v,
  ambientes: (v) => `${v}+ amb`,
  dormitorios: (v) => `${v}+ dorm`,
  banos: (v) => `${v}+ baños`,
  cocheras: (v) => `${v}+ coch`,
  moneda: (v) => v,
  precioMin: (v) => `> ${v}`,
  precioMax: (v) => `< ${v}`,
  supMin: (v) => `> ${v} m²`,
  supMax: (v) => `< ${v} m²`,
  antiguedad: (v) => v,
  aptoCredito: () => "Apto crédito",
};

export function BarraResultados({
  total,
  filtrosActivos,
  onFiltroEliminar,
  onOrdenar,
  ordenActual,
  vista,
  onVistaCambiar,
  onFiltrosClick,
  isPending,
}: BarraResultadosProps) {
  return (
    <div className="sticky top-[88px] z-30 border-b border-fp-line bg-fp-white/95 backdrop-blur-md">
      <div className="fp-container flex items-center gap-4 py-3">
        {/* Contador */}
        <span className={cn("text-fp-body whitespace-nowrap font-semibold text-fp-ink", isPending && "opacity-50")}>
          {formatearNumero(total)} propiedad{total !== 1 ? "es" : ""}
        </span>

        {/* Chips de filtros activos */}
        <div className="hidden flex-1 items-center gap-2 overflow-x-auto lg:flex">
          {filtrosActivos.map(([key, value]) => {
            const labelFn = LABELS_PARAMS[key];
            if (!labelFn) return null;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onFiltroEliminar(key)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fp-navy-50 px-3 py-1 text-xs font-medium text-fp-navy transition-colors hover:bg-fp-navy/10"
              >
                {labelFn(value)}
                <X className="h-3 w-3" />
              </button>
            );
          })}
        </div>

        {/* Orden + Vista */}
        <div className="ml-auto flex items-center gap-3">
          <select
            value={ordenActual}
            onChange={(e) => onOrdenar(e.target.value)}
            className="rounded-lg border border-fp-line bg-fp-white px-3 py-1.5 text-sm text-fp-ink outline-none"
          >
            {ORDENES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Toggle grilla / mapa */}
          <div className="hidden items-center gap-1 rounded-lg border border-fp-line p-0.5 sm:flex">
            <button
              type="button"
              onClick={() => onVistaCambiar("grilla")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                vista === "grilla" ? "bg-fp-navy text-fp-white" : "text-fp-slate hover:text-fp-ink",
              )}
              aria-label="Vista grilla"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onVistaCambiar("mapa")}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                vista === "mapa" ? "bg-fp-navy text-fp-white" : "text-fp-slate hover:text-fp-ink",
              )}
              aria-label="Vista mapa"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>

          {/* Botón filtros mobile */}
          <button
            type="button"
            onClick={onFiltrosClick}
            className="flex items-center gap-2 rounded-lg border border-fp-line px-3 py-1.5 text-sm font-medium text-fp-ink lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
