"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { comprimirImagen } from "@/lib/comprimir-imagen";
import { subirImagenACloudinary } from "@/lib/cloudinary-upload-cliente";
import { obtenerFirmaUploadPropiedad } from "@/app/admin/propiedades/cloudinary-actions";

interface UploaderArchivoUnicoProps {
  carpeta: string;
  valor: string;
  onCambiar: (url: string) => void;
  label: string;
}

/** Subida de un solo archivo (el plano) — misma pipeline de compresión y
 * signed upload que la galería de fotos, pero sin reordenamiento. */
export function UploaderArchivoUnico({
  carpeta,
  valor,
  onCambiar,
  label,
}: UploaderArchivoUnicoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progreso, setProgreso] = useState<number | null>(null);

  async function manejarArchivo(archivo: File | undefined) {
    if (!archivo) return;
    setProgreso(0);
    try {
      const comprimida = await comprimirImagen(archivo);
      const firma = await obtenerFirmaUploadPropiedad(carpeta);
      const resultado = await subirImagenACloudinary(comprimida.archivo, firma, setProgreso);
      onCambiar(resultado.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir el archivo.");
    } finally {
      setProgreso(null);
    }
  }

  if (valor) {
    return (
      <div className="flex items-center gap-3 rounded-fp-md border border-fp-line p-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-fp-sm bg-fp-bone">
          <Image src={valor} alt={label} fill sizes="64px" className="object-cover" />
        </div>
        <p className="flex-1 text-fp-small text-fp-slate">{label} cargado.</p>
        <Button type="button" variant="ghost" size="icon-sm" onClick={() => onCambiar("")}>
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => manejarArchivo(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={progreso !== null}
        className="flex w-full flex-col items-center gap-2 rounded-fp-md border border-dashed border-fp-line bg-fp-bone px-4 py-6 text-fp-slate transition-colors hover:border-fp-navy hover:text-fp-navy"
      >
        {progreso !== null ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            <Progress value={progreso} className="h-1 w-32" />
          </>
        ) : (
          <>
            {label.toLowerCase().includes("plano") ? (
              <FileText className="size-5" />
            ) : (
              <Upload className="size-5" />
            )}
            <span className="text-fp-small">Subir {label.toLowerCase()}</span>
          </>
        )}
      </button>
    </div>
  );
}
