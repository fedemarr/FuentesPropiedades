"use client";

import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Progress } from "@/components/ui/progress";
import { comprimirImagen } from "@/lib/comprimir-imagen";
import { subirImagenACloudinary } from "@/lib/cloudinary-upload-cliente";
import { obtenerFirmaUploadPropiedad, eliminarImagenCloudinary } from "@/app/admin/propiedades/cloudinary-actions";
import type { DatosPropiedad } from "@/app/admin/propiedades/schema";
import { FotoOrdenable } from "./foto-ordenable";

interface SubidaEnProgreso {
  id: string;
  nombre: string;
  progreso: number;
}

interface SeccionFotosProps {
  carpetaCloudinary: string;
}

export function SeccionFotos({ carpetaCloudinary }: SeccionFotosProps) {
  const { control } = useFormContext<DatosPropiedad>();
  const { fields, append, replace, move, update } = useFieldArray({
    control,
    name: "imagenes",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [subidas, setSubidas] = useState<SubidaEnProgreso[]>([]);
  const [arrastrandoSobre, setArrastrandoSobre] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function subirArchivos(archivos: FileList | File[]) {
    const lista = Array.from(archivos).filter((a) => a.type.startsWith("image/"));
    if (lista.length === 0) return;

    for (const archivo of lista) {
      const idTemporal = `${archivo.name}-${Date.now()}-${Math.random()}`;
      setSubidas((prev) => [...prev, { id: idTemporal, nombre: archivo.name, progreso: 0 }]);

      try {
        const comprimida = await comprimirImagen(archivo);
        const firma = await obtenerFirmaUploadPropiedad(carpetaCloudinary);
        const resultado = await subirImagenACloudinary(comprimida.archivo, firma, (p) => {
          setSubidas((prev) => prev.map((s) => (s.id === idTemporal ? { ...s, progreso: p } : s)));
        });

        append({
          url: resultado.url,
          publicId: resultado.publicId,
          width: resultado.width,
          height: resultado.height,
          blurDataUrl: comprimida.blurDataUrl,
          alt: null,
          orden: fields.length,
          esPortada: fields.length === 0,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : `No se pudo subir "${archivo.name}".`,
        );
      } finally {
        setSubidas((prev) => prev.filter((s) => s.id !== idTemporal));
      }
    }
  }

  async function eliminarFoto(index: number) {
    const imagen = fields[index];
    if (!imagen) return;

    // Un solo `replace` atómico con el array ya recalculado — evita
    // encadenar remove()+update() sobre índices que se mueven entre sí.
    const restantes = fields.filter((_, i) => i !== index);
    if (imagen.esPortada && restantes.length > 0 && restantes[0]) {
      restantes[0] = { ...restantes[0], esPortada: true };
    }
    replace(restantes);

    try {
      await eliminarImagenCloudinary(imagen.publicId);
    } catch {
      // La imagen ya se sacó del formulario; si falla el borrado remoto no
      // bloqueamos a la usuaria — queda una imagen huérfana en Cloudinary
      // que se puede limpiar manualmente después.
    }
  }

  function marcarPortada(index: number) {
    fields.forEach((f, i) => {
      if (f.esPortada !== (i === index)) update(i, { ...f, esPortada: i === index });
    });
  }

  function manejarDragEnd(evento: DragEndEvent) {
    const { active, over } = evento;
    if (!over || active.id === over.id) return;
    const desde = fields.findIndex((f) => f.id === active.id);
    const hasta = fields.findIndex((f) => f.id === over.id);
    if (desde >= 0 && hasta >= 0) move(desde, hasta);
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void subirArchivos(e.target.files);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrandoSobre(true);
        }}
        onDragLeave={() => setArrastrandoSobre(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrandoSobre(false);
          void subirArchivos(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center gap-2 rounded-fp-md border-2 border-dashed px-4 py-8 text-fp-slate transition-colors ${
          arrastrandoSobre ? "border-fp-navy bg-fp-navy-50 text-fp-navy" : "border-fp-line bg-fp-bone hover:border-fp-navy hover:text-fp-navy"
        }`}
      >
        <Upload className="size-6" />
        <span className="text-fp-small">
          Arrastrá fotos acá o hacé click para elegirlas (podés seleccionar varias)
        </span>
      </button>

      {subidas.length > 0 && (
        <div className="flex flex-col gap-2">
          {subidas.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <Loader2 className="size-4 shrink-0 animate-spin text-fp-navy" />
              <span className="w-40 truncate text-fp-small text-fp-slate">{s.nombre}</span>
              <Progress value={s.progreso} className="h-1.5 flex-1" />
              <span className="w-10 text-right text-fp-small text-fp-slate">{s.progreso}%</span>
            </div>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={manejarDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {fields.map((f, i) => (
                <FotoOrdenable
                  key={f.id}
                  id={f.id}
                  imagen={f}
                  onMarcarPortada={() => marcarPortada(i)}
                  onEliminar={() => eliminarFoto(i)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {fields.length === 0 && subidas.length === 0 && (
        <p className="text-fp-small text-fp-slate">Todavía no subiste fotos.</p>
      )}
    </div>
  );
}
