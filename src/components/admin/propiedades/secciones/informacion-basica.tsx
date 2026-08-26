"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campo } from "../campo";
import { cn } from "@/lib/utils";
import {
  LABEL_ESTADO_PROPIEDAD,
  LABEL_OPERACION,
  LABEL_TIPO_PROPIEDAD,
} from "@/lib/enum-labels";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

export function SeccionInformacionBasica() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  return (
    <div className="flex flex-col gap-5">
      <Campo label="Operación" requerido>
        <Controller
          name="operacion"
          control={control}
          render={({ field }) => (
            <div className="inline-flex w-fit rounded-fp-full border border-fp-line bg-fp-bone p-1">
              {Object.entries(LABEL_OPERACION).map(([valor, label]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => field.onChange(valor)}
                  className={cn(
                    "rounded-fp-full px-4 py-1.5 text-fp-small font-medium transition-colors",
                    field.value === valor
                      ? "bg-fp-navy text-white"
                      : "text-fp-slate hover:text-fp-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        />
      </Campo>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Campo label="Tipo de propiedad" requerido error={errors.tipo?.message}>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LABEL_TIPO_PROPIEDAD).map(([valor, label]) => (
                    <SelectItem key={valor} value={valor}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Campo>

        <Campo label="Estado" requerido>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LABEL_ESTADO_PROPIEDAD).map(([valor, label]) => (
                    <SelectItem key={valor} value={valor}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Campo>
      </div>

      <Campo label="Título" requerido error={errors.titulo?.message} htmlFor="titulo">
        <Input
          id="titulo"
          placeholder="Casa 4 ambientes con jardín"
          {...register("titulo")}
        />
      </Campo>

      <Campo
        label="Descripción"
        requerido
        error={errors.descripcion?.message}
        htmlFor="descripcion"
        hint="Escribila como si se la estuvieras contando a un interesado — evitá copiar y pegar de otra publicación."
      >
        <Textarea id="descripcion" rows={6} {...register("descripcion")} />
      </Campo>
    </div>
  );
}
