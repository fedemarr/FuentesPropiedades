"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { comprimirImagen } from "@/lib/comprimir-imagen";
import { subirImagenACloudinary } from "@/lib/cloudinary-upload-cliente";
import { obtenerFirmaUploadPropiedad } from "@/app/admin/propiedades/cloudinary-actions";

interface SubidaFotoConfigProps {
  label: string;
  hint?: string;
  url: string | null;
  urlPorDefecto: string;
  onCambiar: (url: string) => void;
}

/** Subida de una única foto para la configuración del sitio (foto de
 * Nosotros, foto de Tasaciones, etc.) — mismo flujo firmado de Cloudinary
 * que las fotos de propiedades, pero para una sola imagen con preview. */
export function SubidaFotoConfig({
  label,
  hint,
  url,
  urlPorDefecto,
  onCambiar,
}: SubidaFotoConfigProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function manejarArchivo(archivo: File | undefined) {
    if (!archivo || !archivo.type.startsWith("image/")) return;
    setSubiendo(true);
    try {
      const comprimida = await comprimirImagen(archivo);
      const firma = await obtenerFirmaUploadPropiedad("sitio");
      const resultado = await subirImagenACloudinary(comprimida.archivo, firma, () => {});
      onCambiar(resultado.url);
      toast.success("Foto actualizada — no te olvides de guardar la configuración.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-fp-label text-fp-slate">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-fp-md border border-fp-line bg-fp-bone">
          <Image src={url || urlPorDefecto} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void manejarArchivo(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={subiendo}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-fp-md border border-fp-line bg-white px-3.5 py-2 text-fp-small font-medium text-fp-ink transition-colors hover:border-fp-navy disabled:opacity-60"
          >
            {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {subiendo ? "Subiendo…" : "Cambiar foto"}
          </button>
          {hint && <p className="text-fp-small text-fp-slate">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
