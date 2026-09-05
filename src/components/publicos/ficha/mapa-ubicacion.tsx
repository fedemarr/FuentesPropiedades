"use client";

import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapaUbicacionProps {
  lat: number;
  lng: number;
  radioMapa: number;
}

/** Mapa de solo lectura para la ficha pública — círculo de privacidad, sin
 * marcador exacto. `scrollWheelZoom` queda deshabilitado a propósito: un
 * mapa embebido en una página que scrollea normal no puede robarle la
 * rueda del mouse a la página completa (era exactamente el bug reportado:
 * "se traba a mitad de pantalla" al pasar el mouse sobre el mapa). */
export function MapaUbicacion({ lat, lng, radioMapa }: MapaUbicacionProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[lat, lng]}
        radius={radioMapa}
        pathOptions={{ color: "#C8102E", fillColor: "#C8102E", fillOpacity: 0.2, weight: 2 }}
      />
    </MapContainer>
  );
}
