"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useFormContext } from "react-hook-form";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Campo } from "../campo";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";
import { geocodificarDireccion } from "@/app/admin/propiedades/geocodificar-actions";

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

const ESPERA_DEBOUNCE_MS = 900;

export function SeccionUbicacion() {
  const {
    register,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  const latGuardada = watch("lat");
  const lngGuardada = watch("lng");
  const lat = latGuardada ?? LAT_DEFECTO;
  const lng = lngGuardada ?? LNG_DEFECTO;
  const radioMapa = watch("radioMapa") ?? 300;

  const [buscando, setBuscando] = useState(false);
  const [estadoBusqueda, setEstadoBusqueda] = useState<string | null>(null);
  // Una vez que alguien arrastra el pin a mano, dejamos de pisarlo solos
  // cada vez que toca otro campo de dirección — a partir de ahí, buscar de
  // nuevo es siempre una decisión explícita (el botón).
  const pinAjustadoManualmente = useRef(false);
  const timerDebounce = useRef<ReturnType<typeof setTimeout>>(null);

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

  const buscarUbicacion = useCallback(async () => {
    const datos = getValues();
    const base = datos.direccionExacta?.trim() || datos.calle?.trim();
    const partes = [base, datos.localidad, datos.partido, datos.provincia || "Buenos Aires", "Argentina"].filter(
      (p): p is string => !!p && p.trim().length > 0,
    );

    if (partes.length < 2) return; // ni dirección ni localidad todavía, no hay nada que buscar

    setBuscando(true);
    setEstadoBusqueda(null);
    try {
      const resultado = await geocodificarDireccion(partes.join(", "));
      if (resultado.ok && resultado.lat != null && resultado.lng != null) {
        setValue("lat", resultado.lat, { shouldDirty: true });
        setValue("lng", resultado.lng, { shouldDirty: true });
        setEstadoBusqueda("Ubicación encontrada automáticamente. Podés ajustar el pin si no quedó exacta.");
      } else {
        setEstadoBusqueda(resultado.error ?? "No se encontró la dirección. Ajustá el pin manualmente.");
      }
    } finally {
      setBuscando(false);
    }
  }, [getValues, setValue]);

  const dispararBusquedaConDebounce = useCallback(() => {
    if (pinAjustadoManualmente.current) return; // ya lo movieron a mano, no lo pisamos
    if (timerDebounce.current) clearTimeout(timerDebounce.current);
    timerDebounce.current = setTimeout(buscarUbicacion, ESPERA_DEBOUNCE_MS);
  }, [buscarUbicacion]);

  useEffect(() => {
    return () => {
      if (timerDebounce.current) clearTimeout(timerDebounce.current);
    };
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
          onBlur={(e) => {
            register("direccionExacta").onBlur(e);
            dispararBusquedaConDebounce();
          }}
        />
      </Campo>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Campo
          label="Calle (pública)"
          htmlFor="calle"
          hint='Se muestra en el sitio, ej. "Belgrano al 1400" — sin número exacto.'
        >
          <Input
            id="calle"
            placeholder="Belgrano al 1400"
            {...register("calle")}
            onBlur={(e) => {
              register("calle").onBlur(e);
              dispararBusquedaConDebounce();
            }}
          />
        </Campo>
        <Campo label="Barrio" htmlFor="barrio">
          <Input
            id="barrio"
            placeholder="Centro"
            {...register("barrio")}
            onBlur={(e) => {
              register("barrio").onBlur(e);
              dispararBusquedaConDebounce();
            }}
          />
        </Campo>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Campo label="Localidad" requerido error={errors.localidad?.message} htmlFor="localidad">
          <Input
            id="localidad"
            placeholder="San Miguel"
            {...register("localidad")}
            onBlur={(e) => {
              register("localidad").onBlur(e);
              dispararBusquedaConDebounce();
            }}
          />
        </Campo>
        <Campo label="Partido" htmlFor="partido">
          <Input
            id="partido"
            placeholder="San Miguel"
            {...register("partido")}
            onBlur={(e) => {
              register("partido").onBlur(e);
              dispararBusquedaConDebounce();
            }}
          />
        </Campo>
        <Campo label="Provincia" requerido htmlFor="provincia">
          <Input id="provincia" {...register("provincia")} />
        </Campo>
      </div>

      <Campo
        label="Ubicación en el mapa"
        hint="Se ubica sola a partir de la dirección — arrastrá el pin si no quedó exacta. El círculo rojo es lo que va a ver el público; la dirección exacta nunca se expone."
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-fp-small text-fp-slate">
            {buscando ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Buscando la dirección…
              </>
            ) : (
              estadoBusqueda && (
                <>
                  <MapPin className="size-3.5 shrink-0" />
                  {estadoBusqueda}
                </>
              )
            )}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={buscando}
            onClick={() => {
              pinAjustadoManualmente.current = false;
              void buscarUbicacion();
            }}
          >
            <MapPin className="size-3.5" />
            Buscar dirección en el mapa
          </Button>
        </div>
        <MapaSelectorUbicacion
          lat={lat}
          lng={lng}
          radioMapa={radioMapa}
          onCambiarPosicion={(nuevaLat, nuevaLng) => {
            pinAjustadoManualmente.current = true;
            setEstadoBusqueda(null);
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
