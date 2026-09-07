"use server";

import { auth } from "@/auth";

export interface ResultadoGeocodificacion {
  ok: boolean;
  lat?: number;
  lng?: number;
  error?: string;
}

/** Busca coordenadas aproximadas para una dirección usando Nominatim (el
 * buscador gratuito de OpenStreetMap — mismo proveedor que los tiles del
 * mapa, sin API key ni costo). Es un punto de partida: el radio de
 * privacidad ya difumina la ubicación pública, y el pin siempre se puede
 * ajustar a mano arrastrándolo. */
export async function geocodificarDireccion(
  direccion: string,
): Promise<ResultadoGeocodificacion> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado." };

  const consulta = direccion.trim();
  if (!consulta) {
    return { ok: false, error: "Escribí una dirección o localidad primero." };
  }

  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", consulta);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "ar");

    const respuesta = await fetch(url, {
      headers: {
        // Nominatim exige un User-Agent identificable para uso gratuito.
        "User-Agent": "FuentesPropiedades-PanelAdmin/1.0 (marian.fuentes@hotmail.es)",
        "Accept-Language": "es",
      },
    });

    if (!respuesta.ok) {
      return { ok: false, error: "No se pudo buscar la dirección. Ajustá el pin a mano." };
    }

    const resultados = (await respuesta.json()) as { lat: string; lon: string }[];
    const primero = resultados[0];

    if (!primero) {
      return {
        ok: false,
        error: "No se encontró esa dirección. Arrastrá el pin al lugar correcto.",
      };
    }

    return { ok: true, lat: Number.parseFloat(primero.lat), lng: Number.parseFloat(primero.lon) };
  } catch {
    return {
      ok: false,
      error: "No se pudo conectar con el buscador de direcciones. Ajustá el pin a mano.",
    };
  }
}
