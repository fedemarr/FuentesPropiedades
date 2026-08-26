"use client";

import { useState } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { LABEL_OPERACION, LABEL_TIPO_PROPIEDAD, LABEL_ANTIGUEDAD } from "@/lib/enum-labels";

interface SidebarFiltrosProps {
  filtrosActuales: Record<string, string | undefined>;
  onFiltrosCambiar: (params: Record<string, string | null>) => void;
  onCerrar?: () => void;
}

export function SidebarFiltros({
  filtrosActuales,
  onFiltrosCambiar,
  onCerrar,
}: SidebarFiltrosProps) {
  const [operacion, setOperacion] = useState(filtrosActuales.operacion ?? "");
  const [tipos, setTipos] = useState<string[]>(
    filtrosActuales.tipo?.split(",").filter(Boolean) ?? [],
  );
  const [busqueda, setBusqueda] = useState(filtrosActuales.q ?? "");
  const [precioMin, setPrecioMin] = useState(filtrosActuales.precioMin ?? "");
  const [precioMax, setPrecioMax] = useState(filtrosActuales.precioMax ?? "");
  const [moneda, setMoneda] = useState(filtrosActuales.moneda ?? "USD");
  const [ambientes, setAmbientes] = useState(filtrosActuales.ambientes ?? "");
  const [dormitorios, setDormitorios] = useState(filtrosActuales.dormitorios ?? "");
  const [banos, setBanos] = useState(filtrosActuales.banos ?? "");
  const [cocheras, setCocheras] = useState(filtrosActuales.cocheras ?? "");
  const [supMin, setSupMin] = useState(filtrosActuales.supMin ?? "");
  const [supMax, setSupMax] = useState(filtrosActuales.supMax ?? "");
  const [antiguedad, setAntiguedad] = useState(filtrosActuales.antiguedad ?? "");
  const [aptoCredito, setAptoCredito] = useState(filtrosActuales.aptoCredito === "true");
  const [expandido, setExpandido] = useState(false);

  const aplicarFiltros = () => {
    onFiltrosCambiar({
      operacion: operacion || null,
      tipo: tipos.length > 0 ? tipos.join(",") : null,
      q: busqueda || null,
      precioMin: precioMin || null,
      precioMax: precioMax || null,
      moneda: moneda || null,
      ambientes: ambientes || null,
      dormitorios: dormitorios || null,
      banos: banos || null,
      cocheras: cocheras || null,
      supMin: supMin || null,
      supMax: supMax || null,
      antiguedad: antiguedad || null,
      aptoCredito: aptoCredito ? "true" : null,
    });
  };

  const limpiarTodo = () => {
    setOperacion("");
    setTipos([]);
    setBusqueda("");
    setPrecioMin("");
    setPrecioMax("");
    setMoneda("USD");
    setAmbientes("");
    setDormitorios("");
    setBanos("");
    setCocheras("");
    setSupMin("");
    setSupMax("");
    setAntiguedad("");
    setAptoCredito(false);
    onFiltrosCambiar({
      operacion: null,
      tipo: null,
      q: null,
      precioMin: null,
      precioMax: null,
      moneda: null,
      ambientes: null,
      dormitorios: null,
      banos: null,
      cocheras: null,
      supMin: null,
      supMax: null,
      antiguedad: null,
      aptoCredito: null,
    });
  };

  const toggleTipo = (tipo: string) => {
    setTipos((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    );
  };

  const tieneFiltros =
    operacion || tipos.length > 0 || busqueda || precioMin || precioMax ||
    ambientes || dormitorios || banos || cocheras || supMin || supMax ||
    antiguedad || aptoCredito;

  return (
    <div className="space-y-6">
      {onCerrar && (
        <div className="flex items-center justify-between">
          <h3 className="text-fp-h3 text-fp-ink">Filtros</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-1 text-fp-slate hover:text-fp-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Operación */}
      <FiltroSeccion titulo="Operación">
        <div className="flex gap-2">
          {(["", "VENTA", "ALQUILER"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setOperacion(op)}
              className={cn(
                "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                operacion === op
                  ? "border-fp-red bg-fp-red text-fp-white"
                  : "border-fp-line bg-fp-white text-fp-ink hover:border-fp-navy",
              )}
            >
              {op ? LABEL_OPERACION[op] : "Todas"}
            </button>
          ))}
        </div>
      </FiltroSeccion>

      {/* Tipo de propiedad */}
      <FiltroSeccion titulo="Tipo de propiedad">
        <div className="flex flex-wrap gap-2">
          {Object.entries(LABEL_TIPO_PROPIEDAD).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleTipo(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                tipos.includes(key)
                  ? "border-fp-red bg-fp-red text-fp-white"
                  : "border-fp-line bg-fp-white text-fp-ink hover:border-fp-navy",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </FiltroSeccion>

      {/* Búsqueda */}
      <FiltroSeccion titulo="Buscar">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fp-slate" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Barrio, localidad..."
            className="w-full rounded-lg border border-fp-line bg-fp-white py-2 pr-3 pl-9 text-sm text-fp-ink outline-none transition-colors focus:border-fp-navy"
          />
        </div>
      </FiltroSeccion>

      {/* Precio */}
      <FiltroSeccion titulo="Precio">
        <div className="flex items-center gap-2">
          <select
            value={moneda}
            onChange={(e) => setMoneda(e.target.value)}
            className="rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm text-fp-ink outline-none"
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
          <input
            type="number"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="Mín"
            className="w-full rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm text-fp-ink outline-none focus:border-fp-navy"
          />
          <span className="text-fp-slate">—</span>
          <input
            type="number"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Máx"
            className="w-full rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm text-fp-ink outline-none focus:border-fp-navy"
          />
        </div>
      </FiltroSeccion>

      {/* Filtros avanzados (colapsables) */}
      <div>
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-fp-navy"
        >
          Más filtros
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandido && "rotate-180",
            )}
          />
        </button>

        {expandido && (
          <div className="mt-3 space-y-4">
            <FiltroSeccion titulo="Ambientes">
              <SelectorNumerico value={ambientes} onChange={setAmbientes} min={1} max={10} />
            </FiltroSeccion>
            <FiltroSeccion titulo="Dormitorios">
              <SelectorNumerico value={dormitorios} onChange={setDormitorios} min={1} max={8} />
            </FiltroSeccion>
            <FiltroSeccion titulo="Baños">
              <SelectorNumerico value={banos} onChange={setBanos} min={1} max={6} />
            </FiltroSeccion>
            <FiltroSeccion titulo="Cocheras">
              <SelectorNumerico value={cocheras} onChange={setCocheras} min={1} max={6} />
            </FiltroSeccion>
            <FiltroSeccion titulo="Superficie cubierta (m²)">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={supMin}
                  onChange={(e) => setSupMin(e.target.value)}
                  placeholder="Mín"
                  className="w-full rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm outline-none focus:border-fp-navy"
                />
                <span className="text-fp-slate">—</span>
                <input
                  type="number"
                  value={supMax}
                  onChange={(e) => setSupMax(e.target.value)}
                  placeholder="Máx"
                  className="w-full rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm outline-none focus:border-fp-navy"
                />
              </div>
            </FiltroSeccion>
            <FiltroSeccion titulo="Antigüedad">
              <select
                value={antiguedad}
                onChange={(e) => setAntiguedad(e.target.value)}
                className="w-full rounded-lg border border-fp-line bg-fp-white px-3 py-2 text-sm outline-none focus:border-fp-navy"
              >
                <option value="">Cualquiera</option>
                {Object.entries(LABEL_ANTIGUEDAD).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </FiltroSeccion>
            <FiltroSeccion titulo="Apto crédito">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aptoCredito}
                  onChange={(e) => setAptoCredito(e.target.checked)}
                  className="h-4 w-4 rounded border-fp-line accent-fp-red"
                />
                <span className="text-sm text-fp-ink">Solo apto crédito</span>
              </label>
            </FiltroSeccion>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={aplicarFiltros}
          className="flex-1 rounded-[--radius-fp-md] bg-fp-red px-4 py-2.5 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-red-700"
        >
          Aplicar filtros
        </button>
        {tieneFiltros && (
          <button
            type="button"
            onClick={limpiarTodo}
            className="rounded-[--radius-fp-md] border border-fp-line px-4 py-2.5 text-sm font-medium text-fp-slate transition-colors hover:text-fp-ink"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

function FiltroSeccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-fp-small mb-2 font-semibold text-fp-ink">{titulo}</h4>
      {children}
    </div>
  );
}

function SelectorNumerico({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === String(n) ? "" : String(n))}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all",
            value === String(n)
              ? "border-fp-red bg-fp-red text-fp-white"
              : "border-fp-line bg-fp-white text-fp-ink hover:border-fp-navy",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
