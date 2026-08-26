"use client";

import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ADICIONALES,
  AMBIENTES_CATALOGO,
  SERVICIOS,
  type Caracteristica,
} from "@/lib/caracteristicas";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

interface GrupoProps {
  titulo: string;
  catalogo: readonly Caracteristica[];
  name: "servicios" | "ambientesList" | "adicionales";
}

function GrupoCaracteristicas({ titulo, catalogo, name }: GrupoProps) {
  const { control } = useFormContext<DatosPropiedad>();
  const [busqueda, setBusqueda] = useState("");

  const filtrado = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return catalogo;
    return catalogo.filter((c) => c.label.toLowerCase().includes(q));
  }, [busqueda, catalogo]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-fp-small font-semibold text-fp-navy">{titulo}</h3>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-fp-slate" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar…"
          className="h-8 pl-8 text-fp-small"
        />
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {filtrado.map((c) => {
              const marcado = field.value.includes(c.slug);
              return (
                <label
                  key={c.slug}
                  className="flex cursor-pointer items-center gap-2.5 rounded-fp-sm px-1.5 py-1 hover:bg-fp-bone"
                >
                  <Checkbox
                    checked={marcado}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked
                          ? [...field.value, c.slug]
                          : field.value.filter((s: string) => s !== c.slug),
                      );
                    }}
                  />
                  <span className="text-fp-small text-fp-ink">{c.label}</span>
                </label>
              );
            })}
            {filtrado.length === 0 && (
              <p className="text-fp-small text-fp-slate">Sin resultados.</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export function SeccionCaracteristicas() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <GrupoCaracteristicas titulo="Servicios" catalogo={SERVICIOS} name="servicios" />
      <GrupoCaracteristicas
        titulo="Ambientes"
        catalogo={AMBIENTES_CATALOGO}
        name="ambientesList"
      />
      <GrupoCaracteristicas titulo="Adicionales" catalogo={ADICIONALES} name="adicionales" />
    </div>
  );
}
