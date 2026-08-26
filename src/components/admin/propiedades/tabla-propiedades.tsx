"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Copy,
  ExternalLink,
  ImageOff,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatearNumero, formatearPrecio } from "@/lib/formato";
import { LABEL_ESTADO_PROPIEDAD, LABEL_OPERACION, LABEL_TIPO_PROPIEDAD } from "@/lib/enum-labels";
import type { EstadoPropiedad } from "@/generated/prisma/enums";
import {
  accionLotePropiedades,
  cambiarEstadoPropiedad,
  duplicarPropiedad,
  eliminarPropiedad,
  togglePublicada,
  toggleDestacada,
} from "@/app/admin/propiedades/actions";
import { DialogoEliminarPropiedad } from "./dialogo-eliminar-propiedad";
import { useRouter } from "next/navigation";

export interface FilaPropiedad {
  id: string;
  codigo: string;
  titulo: string;
  slug: string;
  operacion: string;
  tipo: string;
  precio: number | null;
  moneda: string;
  consultarPrecio: boolean;
  estado: string;
  publicacion: string;
  destacada: boolean;
  vistas: number;
  imagenes: { url: string; blurDataUrl: string | null }[];
}

interface TablaPropiedadesProps {
  propiedades: FilaPropiedad[];
}

export function TablaPropiedades({ propiedades }: TablaPropiedadesProps) {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [aEliminar, setAEliminar] = useState<FilaPropiedad | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  const todasSeleccionadas = propiedades.length > 0 && seleccion.size === propiedades.length;

  function alternarTodas() {
    setSeleccion(todasSeleccionadas ? new Set() : new Set(propiedades.map((p) => p.id)));
  }

  function alternarUna(id: string) {
    setSeleccion((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }

  function ejecutarLote(accion: Parameters<typeof accionLotePropiedades>[1]) {
    const ids = [...seleccion];
    iniciarTransicion(async () => {
      try {
        await accionLotePropiedades(ids, accion);
        toast.success(`${ids.length} ${ids.length === 1 ? "propiedad actualizada" : "propiedades actualizadas"}.`);
        setSeleccion(new Set());
        router.refresh();
      } catch {
        toast.error("No se pudo aplicar la acción en lote.");
      }
    });
  }

  function alternarPublicada(id: string) {
    iniciarTransicion(async () => {
      try {
        await togglePublicada(id);
        router.refresh();
      } catch {
        toast.error("No se pudo cambiar la publicación.");
      }
    });
  }

  function alternarDestacada(id: string) {
    iniciarTransicion(async () => {
      try {
        await toggleDestacada(id);
        router.refresh();
      } catch {
        toast.error("No se pudo cambiar el destacado.");
      }
    });
  }

  function cambiarEstado(id: string, estado: string) {
    iniciarTransicion(async () => {
      try {
        await cambiarEstadoPropiedad(id, estado as EstadoPropiedad);
        toast.success("Estado actualizado.");
        router.refresh();
      } catch {
        toast.error("No se pudo cambiar el estado.");
      }
    });
  }

  function duplicar(id: string) {
    iniciarTransicion(async () => {
      try {
        const { id: nuevoId } = await duplicarPropiedad(id);
        toast.success("Propiedad duplicada. Abriendo la copia…");
        router.push(`/admin/propiedades/${nuevoId}`);
      } catch {
        toast.error("No se pudo duplicar la propiedad.");
      }
    });
  }

  function confirmarEliminar() {
    if (!aEliminar) return;
    const propiedad = aEliminar;
    iniciarTransicion(async () => {
      try {
        await eliminarPropiedad(propiedad.id);
        toast.success(`"${propiedad.titulo}" se eliminó.`);
        setAEliminar(null);
        router.refresh();
      } catch {
        toast.error("No se pudo eliminar la propiedad.");
      }
    });
  }

  if (propiedades.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-fp-lg border border-dashed border-fp-line bg-white py-16 text-center">
        <p className="text-fp-body text-fp-ink">No hay propiedades para mostrar.</p>
        <p className="text-fp-small text-fp-slate">
          Probá con otro filtro o cargá una propiedad nueva.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {seleccion.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-fp-md border border-fp-navy-50 bg-fp-navy-50 px-4 py-2.5">
          <span className="text-fp-small font-medium text-fp-navy">
            {seleccion.size} {seleccion.size === 1 ? "seleccionada" : "seleccionadas"}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled={pendiente} onClick={() => ejecutarLote("publicar")}>
              Publicar
            </Button>
            <Button size="sm" variant="outline" disabled={pendiente} onClick={() => ejecutarLote("despublicar")}>
              Despublicar
            </Button>
            <Button size="sm" variant="outline" disabled={pendiente} onClick={() => ejecutarLote("destacar")}>
              Destacar
            </Button>
            <Button size="sm" variant="outline" disabled={pendiente} onClick={() => ejecutarLote("quitar-destacada")}>
              Quitar destacada
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-fp-lg border border-fp-line bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox checked={todasSeleccionadas} onCheckedChange={alternarTodas} aria-label="Seleccionar todas" />
              </TableHead>
              <TableHead className="w-16"></TableHead>
              <TableHead>Propiedad</TableHead>
              <TableHead>Operación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Publicada</TableHead>
              <TableHead className="text-center">Destacada</TableHead>
              <TableHead className="text-right">Vistas</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propiedades.map((p) => {
              const portada = p.imagenes[0];
              return (
                <TableRow key={p.id} className={cn(seleccion.has(p.id) && "bg-fp-navy-50/40")}>
                  <TableCell>
                    <Checkbox
                      checked={seleccion.has(p.id)}
                      onCheckedChange={() => alternarUna(p.id)}
                      aria-label={`Seleccionar ${p.titulo}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative size-12 overflow-hidden rounded-fp-sm bg-fp-bone">
                      {portada ? (
                        <Image
                          src={portada.url}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                          placeholder={portada.blurDataUrl ? "blur" : "empty"}
                          blurDataURL={portada.blurDataUrl ?? undefined}
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-fp-slate">
                          <ImageOff className="size-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[280px]">
                    <Link
                      href={`/admin/propiedades/${p.id}`}
                      className="line-clamp-1 font-medium text-fp-ink hover:text-fp-navy hover:underline"
                    >
                      {p.titulo}
                    </Link>
                    <span className="text-fp-small text-fp-slate">{p.codigo}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.operacion === "VENTA" ? "default" : "secondary"}>
                      {LABEL_OPERACION[p.operacion]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-fp-small text-fp-ink">
                    {LABEL_TIPO_PROPIEDAD[p.tipo]}
                  </TableCell>
                  <TableCell className="text-fp-number text-fp-small whitespace-nowrap">
                    {formatearPrecio(p.precio, p.moneda as "USD" | "ARS", p.consultarPrecio)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={p.estado}
                      onValueChange={(v) => cambiarEstado(p.id, v)}
                      disabled={pendiente}
                    >
                      <SelectTrigger size="sm" className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LABEL_ESTADO_PROPIEDAD).map(([valor, label]) => (
                          <SelectItem key={valor} value={valor}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={pendiente}
                          onClick={() => alternarPublicada(p.id)}
                          className={cn(
                            "rounded-fp-full px-2.5 py-1 text-fp-small font-medium transition-colors",
                            p.publicacion === "PUBLICADA"
                              ? "bg-fp-success-50 text-fp-success"
                              : "bg-fp-bone text-fp-slate",
                          )}
                        >
                          {p.publicacion === "PUBLICADA" ? "Sí" : "No"}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {p.publicacion === "PUBLICADA" ? "Pasar a borrador" : "Publicar"}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={pendiente}
                          onClick={() => alternarDestacada(p.id)}
                          aria-label={p.destacada ? "Quitar destacada" : "Marcar como destacada"}
                          className="inline-flex size-8 items-center justify-center rounded-fp-full transition-colors hover:bg-fp-bone"
                        >
                          <Star
                            className={cn(
                              "size-[18px]",
                              p.destacada ? "fill-fp-red text-fp-red" : "text-fp-line",
                            )}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {p.destacada ? "Quitar destacada" : "Marcar como destacada"}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-fp-number text-right text-fp-small text-fp-slate">
                    {formatearNumero(p.vistas)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Más acciones">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicar(p.id)}>
                          <Copy className="size-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`/propiedades/${p.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                            Ver en el sitio
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setAEliminar(p)}>
                          <Trash2 className="size-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DialogoEliminarPropiedad
        propiedad={aEliminar}
        pendiente={pendiente}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}
