"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  esquemaPropiedad,
  VALORES_POR_DEFECTO,
  type DatosPropiedad,
} from "@/app/admin/propiedades/schema";
import { guardarPropiedad } from "@/app/admin/propiedades/actions";
import { NavAnclas, type AnclaSeccion } from "@/components/admin/propiedades/nav-anclas";
import { SeccionFormulario } from "@/components/admin/propiedades/seccion-formulario";
import { SeccionInformacionBasica } from "@/components/admin/propiedades/secciones/informacion-basica";
import { SeccionPrecio } from "@/components/admin/propiedades/secciones/precio";
import { SeccionUbicacion } from "@/components/admin/propiedades/secciones/ubicacion";
import { SeccionDetalles } from "@/components/admin/propiedades/secciones/detalles";
import { SeccionSuperficies } from "@/components/admin/propiedades/secciones/superficies";
import { SeccionCaracteristicas } from "@/components/admin/propiedades/secciones/caracteristicas";
import { SeccionFotos } from "@/components/admin/propiedades/secciones/fotos";
import { SeccionMediaAdicional } from "@/components/admin/propiedades/secciones/media-adicional";
import { SeccionSeo } from "@/components/admin/propiedades/secciones/seo";

// Prefijadas con "seccion-" a propósito: varias coinciden con el nombre de
// un campo del formulario (ej. la sección "precio" y el input #precio) y
// dos elementos con el mismo id en la página es HTML inválido.
const SECCIONES: AnclaSeccion[] = [
  { id: "seccion-info-basica", label: "Información básica" },
  { id: "seccion-precio", label: "Precio" },
  { id: "seccion-ubicacion", label: "Ubicación" },
  { id: "seccion-detalles", label: "Detalles" },
  { id: "seccion-superficies", label: "Superficies" },
  { id: "seccion-caracteristicas", label: "Características" },
  { id: "seccion-fotos", label: "Fotos" },
  { id: "seccion-media", label: "Media adicional" },
  { id: "seccion-seo", label: "SEO" },
];

interface FormularioPropiedadProps {
  id: string | null;
  datosIniciales?: Partial<DatosPropiedad>;
  codigo?: string;
}

export function FormularioPropiedad({
  id,
  datosIniciales,
  codigo,
}: FormularioPropiedadProps) {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null);
  const timerAutoguardado = useRef<ReturnType<typeof setInterval>>(null);

  const form = useForm<DatosPropiedad>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(esquemaPropiedad) as any,
    defaultValues: { ...VALORES_POR_DEFECTO, ...datosIniciales },
    mode: "onBlur",
  });

  const { getValues, formState } = form;

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    timerAutoguardado.current = setInterval(() => {
      if (formState.isDirty) {
        void guardar("BORRADOR", true);
      }
    }, 30_000);
    return () => {
      if (timerAutoguardado.current) clearInterval(timerAutoguardado.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty]);

  const guardar = useCallback(
    async (publicacion: "BORRADOR" | "PUBLICADA", silencioso = false) => {
      setGuardando(true);
      try {
        const datos = getValues();
        const resultado = await guardarPropiedad(id, datos, publicacion);
        if (!id) {
          router.replace(`/admin/propiedades/${resultado.id}`);
        }
        setUltimoGuardado(new Date());
        if (!silencioso) {
          toast.success(
            publicacion === "PUBLICADA"
              ? "Propiedad publicada."
              : "Borrador guardado.",
          );
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "No se pudo guardar.",
        );
      } finally {
        setGuardando(false);
      }
    },
    [id, getValues, router],
  );

  return (
    <div className="flex gap-6">
      <NavAnclas secciones={SECCIONES} />

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/propiedades"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-fp-slate transition-colors hover:bg-fp-bone hover:text-fp-ink"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-fp-h2 text-fp-navy">
                {id ? "Editar propiedad" : "Nueva propiedad"}
              </h1>
              {codigo && (
                <span className="text-fp-small text-fp-slate">{codigo}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {ultimoGuardado && (
              <span className="text-fp-small text-fp-slate">
                Guardado hace unos segundos
              </span>
            )}
            <button
              type="button"
              onClick={() => void guardar("BORRADOR")}
              disabled={guardando}
              className="flex items-center gap-2 rounded-fp-md border border-fp-line px-4 py-2 text-sm font-medium text-fp-ink transition-colors hover:bg-fp-bone disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => void guardar("PUBLICADA")}
              disabled={guardando}
              className="flex items-center gap-2 rounded-fp-md bg-fp-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-fp-red-700 disabled:opacity-50"
            >
              Publicar
            </button>
          </div>
        </div>

        {/* Formulario */}
        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void guardar("BORRADOR");
            }}
            className="flex flex-col gap-4"
          >
            <SeccionFormulario
              id="seccion-info-basica"
              numero={1}
              titulo="Información básica"
              descripcion="Operación, tipo, título y descripción"
            >
              <SeccionInformacionBasica />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-precio"
              numero={2}
              titulo="Precio"
              descripcion="Moneda, precio, expensas y apto crédito"
            >
              <SeccionPrecio />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-ubicacion"
              numero={3}
              titulo="Ubicación"
              descripcion="Dirección, barrio y ubicación en el mapa"
            >
              <SeccionUbicacion />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-detalles"
              numero={4}
              titulo="Detalles"
              descripcion="Ambientes, dormitorios, baños y más"
            >
              <SeccionDetalles />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-superficies"
              numero={5}
              titulo="Superficies"
              descripcion="Cubierta, semicubierta, terreno, frente y fondo"
            >
              <SeccionSuperficies />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-caracteristicas"
              numero={6}
              titulo="Características"
              descripcion="Servicios, ambientes y adicionales"
            >
              <SeccionCaracteristicas />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-fotos"
              numero={7}
              titulo="Fotos"
              descripcion="Subí fotos, reordenalas y marcala como portada"
            >
              <SeccionFotos carpetaCloudinary={`propiedades/${codigo ?? "nueva"}`} />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-media"
              numero={8}
              titulo="Media adicional"
              descripcion="Plano, video de YouTube y tour 360"
              abiertaPorDefecto={false}
            >
              <SeccionMediaAdicional carpetaCloudinary={`propiedades/${codigo ?? "nueva"}`} />
            </SeccionFormulario>

            <SeccionFormulario
              id="seccion-seo"
              numero={9}
              titulo="SEO"
              descripcion="Meta title y description para buscadores"
              abiertaPorDefecto={false}
            >
              <SeccionSeo />
            </SeccionFormulario>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
