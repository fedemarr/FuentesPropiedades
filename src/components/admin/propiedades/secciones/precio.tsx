"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Campo } from "../campo";
import { cn } from "@/lib/utils";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

const MONEDAS = [
  { valor: "USD", label: "USD" },
  { valor: "ARS", label: "ARS" },
] as const;

export function SeccionPrecio() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  const consultarPrecio = watch("consultarPrecio");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr]">
        <Campo label="Moneda" requerido>
          <Controller
            name="moneda"
            control={control}
            render={({ field }) => (
              <div className="inline-flex w-fit rounded-fp-full border border-fp-line bg-fp-bone p-1">
                {MONEDAS.map((m) => (
                  <button
                    key={m.valor}
                    type="button"
                    onClick={() => field.onChange(m.valor)}
                    className={cn(
                      "rounded-fp-full px-4 py-1.5 text-fp-small font-medium transition-colors",
                      field.value === m.valor
                        ? "bg-fp-navy text-white"
                        : "text-fp-slate hover:text-fp-ink",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          />
        </Campo>

        <Campo
          label="Precio"
          requerido={!consultarPrecio}
          error={errors.precio?.message}
          htmlFor="precio"
        >
          <Input
            id="precio"
            type="number"
            min={0}
            step="1"
            disabled={consultarPrecio}
            placeholder="149000"
            {...register("precio", { valueAsNumber: true })}
          />
        </Campo>
      </div>

      <label className="flex items-center gap-3">
        <Controller
          name="consultarPrecio"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <span className="text-fp-small text-fp-ink">
          Mostrar &quot;Consultar precio&quot; en vez del número
        </span>
      </label>

      <Campo
        label="Expensas"
        error={errors.expensas?.message}
        htmlFor="expensas"
        hint="Dejalo vacío si no aplica (lotes, casas sin expensas, etc.)."
      >
        <Input
          id="expensas"
          type="number"
          min={0}
          step="1"
          placeholder="45000"
          {...register("expensas", { valueAsNumber: true })}
        />
      </Campo>

      <label className="flex items-center gap-3">
        <Controller
          name="aptoCredito"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <span className="text-fp-small text-fp-ink">Apta para crédito hipotecario</span>
      </label>
    </div>
  );
}
