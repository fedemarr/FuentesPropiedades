"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Campo } from "../campo";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

const MapaSelectorUbicacion = dynamic(
  () => import("./mapa-selector-ubicacion").then((m) => m.MapaSelectorUbicacion),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[320px] items-center justify-center rounded-fp-md border border-fp-line bg-fp-bone text-fp-small text-fp-slate">
        Cargando mapa…
      </div>
    ),
  },
);

// Centro por defecto: San Miguel, zona de trabajo principal de la martillera.
const LAT_DEFECTO = -34.5427;
const LNG_DEFECTO = -58.7128;

export function SeccionUbicacion() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  const latGuardada = watch("lat");
  const lngGuardada = watch("lng");
  const lat = latGuardada ?? LAT_DEFECTO;
  const lng = lngGuardada ?? LNG_DEFECTO;
  const radioMapa = watch("radioMapa") ?? 300;

  // Bug real que hizo que una propiedad se publicara sin mapa: el pin por
  // defecto se veía en pantalla, pero hasta que alguien lo arrastraba o
  // clickeaba, lat/lng nunca se escribían en el formulario — al guardar,
  // quedaban null y la sección "Ubicación" no aparecía en la ficha pública.
  // Con esto, la posición que se ve en el mapa es siempre la que se guarda,
  // salga como salga.
  useEffect(() => {
    if (latGuardada == null || lngGuardada == null) {
      setValue("lat", LAT_DEFECTO, { shouldDirty: false });
      setValue("lng", LNG_DEFECTO, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Campo
        label="Dirección exacta"
        htmlFor="direccionExacta"
        hint="Solo para uso interno del panel — nunca se muestra en el sitio público."
      >
        <Input
          id="direccionExacta"
          placeholder="Belgrano 1487, San Miguel"
          {...register("direccionExacta")}
        />
      </Campo>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Campo
          label="Calle (pública)"
          htmlFor="calle"
          hint='Se muestra en el sitio, ej. "Belgrano al 1400" — sin número exacto.'
        >
          <Input id="calle" placeholder="Belgrano al 1400" {...register("calle")} />
        </Campo>
        <Campo label="Barrio" htmlFor="barrio">
          <Input id="barrio" placeholder="Centro" {...register("barrio")} />
        </Campo>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Campo label="Localidad" requerido error={errors.localidad?.message} htmlFor="localidad">
          <Input id="localidad" placeholder="San Miguel" {...register("localidad")} />
        </Campo>
        <Campo label="Partido" htmlFor="partido">
          <Input id="partido" placeholder="San Miguel" {...register("partido")} />
        </Campo>
        <Campo label="Provincia" requerido htmlFor="provincia">
          <Input id="provincia" {...register("provincia")} />
        </Campo>
      </div>

      <Campo
        label="Ubicación en el mapa"
        hint="Arrastrá el pin o hacé click en el mapa. El círculo rojo es lo que va a ver el público — la dirección exacta nunca se expone."
      >
        <MapaSelectorUbicacion
          lat={lat}
          lng={lng}
          radioMapa={radioMapa}
          onCambiarPosicion={(nuevaLat, nuevaLng) => {
            setValue("lat", nuevaLat, { shouldDirty: true });
            setValue("lng", nuevaLng, { shouldDirty: true });
          }}
        />
      </Campo>

      <Campo
        label={`Radio del círculo público: ${radioMapa} metros`}
        hint="Cuanto más grande, menos precisa (y más privada) es la ubicación mostrada."
      >
        <Controller
          name="radioMapa"
          control={control}
          render={({ field }) => (
            <Slider
              min={50}
              max={1000}
              step={50}
              value={[field.value]}
              onValueChange={([v]) => field.onChange(v)}
            />
          )}
        />
      </Campo>
    </div>
  );
}
