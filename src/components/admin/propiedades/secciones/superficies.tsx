"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Campo } from "../campo";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

const CAMPOS: { name: keyof DatosPropiedad; label: string }[] = [
  { name: "supCubierta", label: "Superficie cubierta (m²)" },
  { name: "supSemicubierta", label: "Superficie semicubierta (m²)" },
  { name: "supDescubierta", label: "Superficie descubierta (m²)" },
  { name: "supTerreno", label: "Superficie de terreno (m²)" },
  { name: "medidaFrente", label: "Medida de frente (m)" },
  { name: "medidaFondo", label: "Medida de fondo (m)" },
];

export function SeccionSuperficies() {
  const { register } = useFormContext<DatosPropiedad>();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CAMPOS.map((campo) => (
        <Campo key={String(campo.name)} label={campo.label} htmlFor={String(campo.name)}>
          <Input
            id={String(campo.name)}
            type="number"
            min={0}
            step="0.01"
            {...register(campo.name, { valueAsNumber: true })}
          />
        </Campo>
      ))}
    </div>
  );
}
