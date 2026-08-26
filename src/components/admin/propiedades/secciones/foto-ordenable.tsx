"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagenFormulario } from "@/app/admin/propiedades/schema";

interface FotoOrdenableProps {
  id: string;
  imagen: ImagenFormulario;
  onMarcarPortada: () => void;
  onEliminar: () => void;
}

export function FotoOrdenable({ id, imagen, onMarcarPortada, onEliminar }: FotoOrdenableProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-4/3 overflow-hidden rounded-fp-md border-2 bg-fp-bone",
        imagen.esPortada ? "border-fp-red" : "border-transparent",
        isDragging && "z-10 opacity-70",
      )}
    >
      <Image
        src={imagen.url}
        alt={imagen.alt ?? ""}
        fill
        sizes="200px"
        className="object-cover"
        placeholder={imagen.blurDataUrl ? "blur" : "empty"}
        blurDataURL={imagen.blurDataUrl ?? undefined}
      />

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
        className="absolute top-1.5 left-1.5 flex size-7 cursor-grab items-center justify-center rounded-fp-sm bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      {imagen.esPortada && (
        <span className="absolute top-1.5 right-1.5 rounded-fp-full bg-fp-red px-2 py-0.5 text-[10px] font-semibold text-white">
          Portada
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onMarcarPortada}
          aria-label="Marcar como portada"
          className="flex size-7 items-center justify-center rounded-fp-sm text-white hover:bg-white/20"
        >
          <Star className={cn("size-4", imagen.esPortada && "fill-white")} />
        </button>
        <button
          type="button"
          onClick={onEliminar}
          aria-label="Eliminar foto"
          className="flex size-7 items-center justify-center rounded-fp-sm text-white hover:bg-fp-red/80"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
