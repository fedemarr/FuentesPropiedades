"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Campo } from "../campo";
import { cn } from "@/lib/utils";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fuentespropiedades.com.ar";

export function SeccionSeo() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<DatosPropiedad>();

  const metaTitle = watch("metaTitle") || watch("titulo") || "Título de la propiedad";
  const metaDescription =
    watch("metaDescription") || watch("descripcion") || "Descripción de la propiedad.";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-fp-small text-fp-slate">
        Si dejás estos campos vacíos, se generan solos a partir del título y la descripción.
      </p>

      <Campo
        label="Meta title"
        htmlFor="metaTitle"
        error={errors.metaTitle?.message}
        hint={`${watch("metaTitle")?.length ?? 0}/70 caracteres`}
      >
        <Input id="metaTitle" {...register("metaTitle")} />
      </Campo>

      <Campo
        label="Meta description"
        htmlFor="metaDescription"
        error={errors.metaDescription?.message}
        hint={`${watch("metaDescription")?.length ?? 0}/160 caracteres`}
      >
        <Textarea id="metaDescription" rows={3} {...register("metaDescription")} />
      </Campo>

      <div>
        <p className="text-fp-label mb-2 text-fp-slate">Vista previa en Google</p>
        <div className="rounded-fp-md border border-fp-line bg-white p-4">
          <p className="text-fp-small text-fp-success">
            {siteUrl.replace(/^https?:\/\//, "")} › propiedades
          </p>
          <p
            className={cn(
              "truncate text-lg text-[#1a0dab]",
              "font-normal",
            )}
          >
            {metaTitle}
          </p>
          <p className="line-clamp-2 text-fp-small text-fp-slate">{metaDescription}</p>
        </div>
      </div>
    </div>
  );
}
