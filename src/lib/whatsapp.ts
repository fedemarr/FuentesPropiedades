/** Genera un link wa.me con número y mensaje precargados.
 *  El número debe estar en formato internacional sin + ni espacios
 *  (ej: "5491112345678"). */
export function waLink(numero: string, mensaje: string): string {
  const limpio = numero.replace(/[^0-9]/g, "");
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensaje precargado para el botón flotante genérico. */
export function waMensajeGeneral(): string {
  return "Hola! Quería hacer una consulta.";
}

/** Mensaje precargado para una ficha de propiedad. */
export function waMensajePropiedad(
  codigo: string,
  titulo: string,
  slug: string,
  dominio: string,
): string {
  return `Hola! Me interesa la propiedad ${codigo} — ${titulo}. ${dominio}/propiedades/${slug}`;
}

/** Mensaje precargado post-tasación enviada. */
export function waMensajeTasacion(tipo: string, barrio: string): string {
  return `Hola! Acabo de solicitar una tasación para ${tipo} en ${barrio}.`;
}

/** Mensaje precargado para consultas de administración. */
export function waMensajeAdministracion(): string {
  return "Hola! Quería consultar por el servicio de administración de propiedades.";
}

/** Mensaje del admin al interesado (responder consulta). */
export function waMensajeAdminInteresado(
  nombre: string,
  propiedadCodigo?: string,
): string {
  const base = `Hola ${nombre}, soy de Fuentes Propiedades. Te contacto por tu consulta`;
  return propiedadCodigo
    ? `${base} sobre la propiedad ${propiedadCodigo}.`
    : `${base}.`;
}
