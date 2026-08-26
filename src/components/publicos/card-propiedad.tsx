"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Camera, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearPrecio } from "@/lib/formato";
import { LABEL_OPERACION, LABEL_TIPO_PROPIEDAD } from "@/lib/enum-labels";

export interface ImagenPropiedad {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataUrl?: string | null;
}

export interface PropiedadCardData {
  id: string;
  slug: string;
  codigo: string;
  titulo: string;
  operacion: string;
  tipo: string;
  precio?: number | null;
  consultarPrecio: boolean;
  moneda: "USD" | "ARS";
  estado: string;
  destacada: boolean;
  calle?: string | null;
  barrio?: string | null;
  localidad: string;
  lat?: number | null;
  lng?: number | null;
  ambientes?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  cocheras?: number | null;
  supCubierta?: number | null;
  supTerreno?: number | null;
  imagenes: ImagenPropiedad[];
}

interface CardPropiedadProps {
  propiedad: PropiedadCardData;
  /** Milliseconds between image transitions. 0 disables the carousel. */
  carouselInterval?: number;
}

export function CardPropiedad({
  propiedad,
  carouselInterval = 900,
}: CardPropiedadProps) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const totalImagenes = propiedad.imagenes.length;
  const tieneMultiples = totalImagenes > 1;

  // Carrusel en hover
  useEffect(() => {
    if (!hovered || !tieneMultiples || carouselInterval === 0) return;
    const timer = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % totalImagenes);
    }, carouselInterval);
    return () => clearInterval(timer);
  }, [hovered, tieneMultiples, carouselInterval, totalImagenes]);

  // Resetear índice al salir del hover
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setIndiceActual(0);
  }, []);

  const imagenActual = propiedad.imagenes[indiceActual];

  // Badge de estado
  const badgeEstado =
    propiedad.estado === "RESERVADA"
      ? "Reservada"
      : propiedad.estado === "VENDIDA"
        ? "Vendida"
        : propiedad.estado === "ALQUILADA"
          ? "Alquilada"
          : null;

  return (
    <article
      className="group relative overflow-hidden rounded-[--radius-fp-md] bg-fp-white shadow-fp-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-fp-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Imagen / Carrusel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {imagenActual ? (
          <Image
            src={imagenActual.url}
            alt={imagenActual.alt ?? propiedad.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              hovered && tieneMultiples ? "opacity-0" : "opacity-100",
            )}
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-fp-bone text-fp-slate text-sm">
            Sin fotos
          </div>
        )}

        {/* Overlay de transición para carrusel */}
        {hovered && tieneMultiples && imagenActual && (
          <Image
            src={imagenActual.url}
            alt={imagenActual.alt ?? propiedad.titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="animate-fade-in object-cover"
            priority={false}
          />
        )}

        {/* Badge operación */}
        <span className="absolute top-3 left-3 z-10 rounded-full bg-fp-red px-3 py-1 text-xs font-semibold text-fp-white">
          {LABEL_OPERACION[propiedad.operacion] ?? propiedad.operacion}
        </span>

        {/* Badge estado (solo si no es disponible) */}
        {badgeEstado && (
          <span className="absolute top-3 right-12 z-10 rounded-full bg-fp-navy/80 px-3 py-1 text-xs font-semibold text-fp-white backdrop-blur-sm">
            {badgeEstado}
          </span>
        )}

        {/* Botón favorito */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFavorito(!favorito);
          }}
          className={cn(
            "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all",
            favorito
              ? "bg-fp-red text-fp-white"
              : "bg-black/20 text-white backdrop-blur-sm hover:bg-black/40",
          )}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={cn("h-4 w-4", favorito && "fill-current")}
          />
        </button>

        {/* Badge destacada */}
        {propiedad.destacada && (
          <span className="absolute bottom-3 right-3 z-10 rounded-full bg-fp-navy/80 px-3 py-1 text-xs font-semibold text-fp-white backdrop-blur-sm">
            Destacada
          </span>
        )}

        {/* Precio overlay */}
        <div className="absolute right-0 bottom-0 left-0 z-10 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3">
          <span className="text-fp-number text-lg font-semibold text-fp-white drop-shadow-md">
            {formatearPrecio(
              propiedad.precio,
              propiedad.moneda,
              propiedad.consultarPrecio,
            )}
          </span>
        </div>

        {/* Puntitos del carrusel */}
        {tieneMultiples && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {propiedad.imagenes.slice(0, 8).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === indiceActual
                    ? "w-4 bg-fp-white"
                    : "w-1.5 bg-white/50",
                )}
              />
            ))}
            {totalImagenes > 8 && (
              <span className="text-[10px] text-white/70">+{totalImagenes - 8}</span>
            )}
          </div>
        )}

        {/* Contador de fotos */}
        <div className="absolute top-3 right-3 bottom-3 left-3 pointer-events-none" />
        {totalImagenes > 0 && (
          <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            <Camera className="h-3 w-3" />
            {totalImagenes}
          </span>
        )}
      </div>

      {/* Contenido */}
      <Link
        href={`/propiedades/${propiedad.slug}`}
        className="block p-4"
      >
        {/* Tipo + Código */}
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-fp-label text-fp-red">
            {LABEL_TIPO_PROPIEDAD[propiedad.tipo] ?? propiedad.tipo}
          </span>
          <span className="text-fp-small text-fp-slate">
            {propiedad.codigo}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-fp-h3 mb-1.5 line-clamp-2 text-fp-ink">
          {propiedad.titulo}
        </h3>

        {/* Ubicación */}
        <div className="mb-3 flex items-center gap-1 text-fp-slate">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="text-fp-small truncate">
            {[propiedad.calle, propiedad.barrio, propiedad.localidad]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>

        {/* Separador */}
        <div className="mb-3 border-t border-fp-line" />

        {/* Metadatos */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-fp-slate">
          {propiedad.ambientes != null && (
            <span className="text-fp-small flex items-center gap-1">
              <span className="font-semibold text-fp-ink">{propiedad.ambientes}</span> amb
            </span>
          )}
          {propiedad.dormitorios != null && (
            <span className="text-fp-small flex items-center gap-1">
              <span className="font-semibold text-fp-ink">{propiedad.dormitorios}</span> dorm
            </span>
          )}
          {propiedad.banos != null && (
            <span className="text-fp-small flex items-center gap-1">
              <span className="font-semibold text-fp-ink">{propiedad.banos}</span> baños
            </span>
          )}
          {propiedad.supCubierta != null && (
            <span className="text-fp-small flex items-center gap-1">
              <span className="font-semibold text-fp-ink">{propiedad.supCubierta}</span> m²
            </span>
          )}
          {propiedad.cocheras != null && (
            <span className="text-fp-small flex items-center gap-1">
              <span className="font-semibold text-fp-ink">{propiedad.cocheras}</span> coch
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
