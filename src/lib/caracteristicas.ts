// Catálogo de características de una propiedad. Los `slug` son los valores
// que se guardan en los arrays `servicios`, `ambientesList` y `adicionales`
// de Propiedad. Se usa tanto en el panel (checkboxes agrupados) como en la
// ficha pública (chips con ícono).

export interface Caracteristica {
  slug: string;
  label: string;
}

export const SERVICIOS: readonly Caracteristica[] = [
  { slug: "agua-corriente", label: "Agua corriente" },
  { slug: "cloacas", label: "Cloacas" },
  { slug: "gas-natural", label: "Gas natural" },
  { slug: "electricidad", label: "Electricidad" },
  { slug: "energia-trifasica", label: "Energía trifásica" },
  { slug: "alumbrado-publico", label: "Alumbrado público" },
  { slug: "internet-fibra", label: "Internet/fibra" },
  { slug: "pavimento", label: "Pavimento" },
] as const;

export const AMBIENTES_CATALOGO: readonly Caracteristica[] = [
  { slug: "living", label: "Living" },
  { slug: "living-comedor", label: "Living comedor" },
  { slug: "comedor-diario", label: "Comedor diario" },
  { slug: "cocina", label: "Cocina" },
  { slug: "cocina-separada", label: "Cocina separada" },
  { slug: "lavadero", label: "Lavadero" },
  { slug: "jardin", label: "Jardín" },
  { slug: "patio", label: "Patio" },
  { slug: "terraza", label: "Terraza" },
  { slug: "balcon", label: "Balcón" },
  { slug: "galeria", label: "Galería" },
  { slug: "quincho", label: "Quincho" },
  { slug: "altillo", label: "Altillo" },
  { slug: "sotano", label: "Sótano" },
  { slug: "vestidor", label: "Vestidor" },
  { slug: "toilette", label: "Toilette" },
  { slug: "escritorio", label: "Escritorio" },
  { slug: "dependencia-servicio", label: "Dependencia de servicio" },
] as const;

export const ADICIONALES: readonly Caracteristica[] = [
  { slug: "pileta", label: "Pileta" },
  { slug: "parrilla", label: "Parrilla" },
  { slug: "parrilla-techada", label: "Parrilla techada" },
  { slug: "calefaccion", label: "Calefacción" },
  { slug: "calefaccion-aire", label: "Calefacción por aire" },
  { slug: "aire-acondicionado", label: "Aire acondicionado" },
  { slug: "caldera", label: "Caldera" },
  { slug: "seguridad-24hs", label: "Seguridad 24hs" },
  { slug: "seguridad-privada", label: "Seguridad privada" },
  { slug: "porteria", label: "Portería" },
  { slug: "barrio-privado", label: "Barrio privado/country" },
  { slug: "amenities", label: "Amenities" },
  { slug: "club-house", label: "Club house" },
  { slug: "gimnasio", label: "Gimnasio" },
  { slug: "sum", label: "SUM" },
  { slug: "cancha-tenis", label: "Cancha de tenis" },
  { slug: "zonas-verdes", label: "Zonas verdes" },
  { slug: "acceso-pavimentado", label: "Acceso pavimentado" },
  { slug: "apto-mascotas", label: "Apto mascotas" },
  { slug: "apto-profesional", label: "Apto profesional" },
  { slug: "cochera-fija", label: "Cochera fija" },
  { slug: "armarios-empotrados", label: "Armarios empotrados" },
  { slug: "carpinteria-aluminio", label: "Carpintería de aluminio" },
  { slug: "lote-interno", label: "Lote interno" },
  { slug: "estilo-moderno", label: "Estilo moderno" },
  { slug: "a-estrenar", label: "A estrenar" },
  { slug: "luminoso", label: "Luminoso" },
  { slug: "ubicacion-tranquila", label: "Ubicación tranquila" },
] as const;

const TODAS = [...SERVICIOS, ...AMBIENTES_CATALOGO, ...ADICIONALES];

const MAPA_LABELS = new Map(TODAS.map((c) => [c.slug, c.label]));

/** Devuelve el label legible de un slug de característica, o el slug si no
 * está en el catálogo (defensivo ante datos viejos/editados a mano). */
export function labelDeCaracteristica(slug: string): string {
  return MAPA_LABELS.get(slug) ?? slug;
}
