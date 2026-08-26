"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { formatearPrecio } from "@/lib/formato";
import { LABEL_OPERACION, LABEL_TIPO_PROPIEDAD } from "@/lib/enum-labels";
import type { PropiedadCardData } from "@/components/publicos/card-propiedad";
import "leaflet/dist/leaflet.css";

const iconoPropiedad = L.divIcon({
  className: "",
  html: `<div style="background:#c8102e;color:#fff;border-radius:9999px;padding:4px 10px;font-size:12px;font-weight:600;font-family:Inter,system-ui,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.25);transform:translate(-50%,-100%)">Propiedad</div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

interface VistaMapaProps {
  propiedades: PropiedadCardData[];
}

export function VistaMapa({ propiedades }: VistaMapaProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const propiedadesConCoordenadas = propiedades.filter(
    (p) => p.lat != null && p.lng != null,
  );

  if (propiedadesConCoordenadas.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-[--radius-fp-lg] bg-fp-bone text-fp-slate">
        No hay propiedades con ubicación en el mapa para estos filtros.
      </div>
    );
  }

  const center = {
    lat: propiedadesConCoordenadas[0]!.lat!,
    lng: propiedadesConCoordenadas[0]!.lng!,
  };

  return (
    <div className="flex h-[600px] overflow-hidden rounded-[--radius-fp-lg] border border-fp-line lg:h-[700px]">
      {/* Lista scrolleable */}
      <div className="hidden w-[380px] shrink-0 overflow-y-auto border-r border-fp-line lg:block">
        {propiedadesConCoordenadas.map((prop) => (
          <Link
            key={prop.id}
            href={`/propiedades/${prop.slug}`}
            className={`flex gap-3 border-b border-fp-line p-3 transition-colors ${
              hoveredId === prop.id ? "bg-fp-navy-50" : "hover:bg-fp-bone"
            }`}
            onMouseEnter={() => setHoveredId(prop.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              {prop.imagenes[0] && (
                <Image
                  src={prop.imagenes[0].url}
                  alt={prop.titulo}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-fp-label text-fp-red">
                {LABEL_TIPO_PROPIEDAD[prop.tipo] ?? prop.tipo}
              </span>
              <h4 className="text-fp-small truncate font-semibold text-fp-ink">
                {prop.titulo}
              </h4>
              <p className="text-fp-small text-fp-slate">
                {prop.localidad}
              </p>
              <p className="text-fp-number mt-1 text-sm font-semibold text-fp-navy">
                {formatearPrecio(prop.precio, prop.moneda, prop.consultarPrecio)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mapa */}
      <MapContainer
        center={center}
        zoom={13}
        className="h-full flex-1"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propiedadesConCoordenadas.map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.lat!, prop.lng!]}
            icon={iconoPropiedad}
            eventHandlers={{
              mouseover: () => setHoveredId(prop.id),
              mouseout: () => setHoveredId(null),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <h4 className="text-sm font-semibold">{prop.titulo}</h4>
                <p className="text-xs text-gray-500">
                  {LABEL_OPERACION[prop.operacion]} · {LABEL_TIPO_PROPIEDAD[prop.tipo]}
                </p>
                <p className="mt-1 text-sm font-bold text-[#011e5e]">
                  {formatearPrecio(prop.precio, prop.moneda, prop.consultarPrecio)}
                </p>
                <Link
                  href={`/propiedades/${prop.slug}`}
                  className="mt-2 inline-block text-xs font-semibold text-[#c8102e] hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
