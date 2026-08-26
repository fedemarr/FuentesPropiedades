"use client";

import { useCallback } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ICONO_PIN = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#C8102E;border:3px solid white;box-shadow:0 2px 6px rgba(1,30,94,.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface MapaSelectorUbicacionProps {
  lat: number;
  lng: number;
  radioMapa: number;
  onCambiarPosicion: (lat: number, lng: number) => void;
}

function EventosMapa({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapaSelectorUbicacion({
  lat,
  lng,
  radioMapa,
  onCambiarPosicion,
}: MapaSelectorUbicacionProps) {
  const manejarArrastre = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const posicion = marker.getLatLng();
      onCambiarPosicion(posicion.lat, posicion.lng);
    },
    [onCambiarPosicion],
  );

  return (
    <div className="overflow-hidden rounded-fp-md border border-fp-line">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "320px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EventosMapa onClick={onCambiarPosicion} />
        <Marker
          position={[lat, lng]}
          icon={ICONO_PIN}
          draggable
          eventHandlers={{ dragend: manejarArrastre }}
        />
        <Circle
          center={[lat, lng]}
          radius={radioMapa}
          pathOptions={{ color: "#C8102E", fillColor: "#C8102E", fillOpacity: 0.15, weight: 1.5 }}
        />
      </MapContainer>
    </div>
  );
}
