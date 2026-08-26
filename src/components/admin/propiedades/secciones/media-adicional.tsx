"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Campo } from "../campo";
import { UploaderArchivoUnico } from "../uploader-archivo-unico";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

interface SeccionMediaAdicionalProps {
  carpetaCloudinary: string;
}

export function SeccionMediaAdicional({ carpetaCloudinary }: SeccionMediaAdicionalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  return (
    <div className="flex flex-col gap-5">
      <Campo label="Plano">
        <Controller
          name="planoUrl"
          control={control}
          render={({ field }) => (
            <UploaderArchivoUnico
              carpeta={carpetaCloudinary}
              valor={field.value ?? ""}
              onCambiar={field.onChange}
              label="Plano"
            />
          )}
        />
      </Campo>

      <Campo
        label="Video de YouTube"
        htmlFor="videoUrl"
        error={errors.videoUrl?.message}
        hint="Pegá el link completo, ej. https://www.youtube.com/watch?v=..."
      >
        <Input
          id="videoUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register("videoUrl")}
        />
      </Campo>

      <Campo label="Tour 360°" htmlFor="tour360Url" hint="Link a un tour virtual externo, si tenés uno.">
        <Input id="tour360Url" placeholder="https://..." {...register("tour360Url")} />
      </Campo>
    </div>
  );
}
