"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campo } from "../campo";
import {
  LABEL_ANTIGUEDAD,
  LABEL_CONDICION,
  LABEL_ORIENTACION,
  LABEL_SITUACION,
} from "@/lib/enum-labels";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

const CAMPOS_NUMERICOS: { name: keyof DatosPropiedad; label: string }[] = [
  { name: "ambientes", label: "Ambientes" },
  { name: "dormitorios", label: "Dormitorios" },
  { name: "banos", label: "Baños" },
  { name: "toilettes", label: "Toilettes" },
  { name: "plantas", label: "Plantas" },
  { name: "cocheras", label: "Cocheras" },
];

function SelectorOpcional({
  name,
  label,
  opciones,
}: {
  name: "antiguedad" | "condicion" | "situacion" | "orientacion";
  label: string;
  opciones: Record<string, string>;
}) {
  const { control } = useFormContext<DatosPropiedad>();
  return (
    <Campo label={label}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? "__ninguno__"}
            onValueChange={(v) => field.onChange(v === "__ninguno__" ? null : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sin especificar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ninguno__">Sin especificar</SelectItem>
              {Object.entries(opciones).map(([valor, texto]) => (
                <SelectItem key={valor} value={valor}>
                  {texto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Campo>
  );
}

export function SeccionDetalles() {
  const { register } = useFormContext<DatosPropiedad>();

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CAMPOS_NUMERICOS.map((campo) => (
          <Campo key={String(campo.name)} label={campo.label} htmlFor={String(campo.name)}>
            <Input
              id={String(campo.name)}
              type="number"
              min={0}
              step="1"
              {...register(campo.name, { valueAsNumber: true })}
            />
          </Campo>
        ))}
      </div>

      <p className="text-fp-small text-fp-slate">
        Dejá vacío lo que no aplique — en la ficha pública solo se muestra lo que tiene valor.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SelectorOpcional name="antiguedad" label="Antigüedad" opciones={LABEL_ANTIGUEDAD} />
        <SelectorOpcional name="condicion" label="Condición" opciones={LABEL_CONDICION} />
        <SelectorOpcional name="situacion" label="Situación" opciones={LABEL_SITUACION} />
        <SelectorOpcional name="orientacion" label="Orientación" opciones={LABEL_ORIENTACION} />
      </div>
    </div>
  );
}
