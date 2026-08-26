const FORMATEADOR_USD = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});
const FORMATEADOR_ARS = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

/** "USD 149.000" / "ARS 620.000" — nunca decimales, separador de miles
 * local (es-AR usa punto). */
export function formatearPrecio(
  precio: number | null | undefined,
  moneda: "USD" | "ARS",
  consultarPrecio: boolean,
): string {
  if (consultarPrecio || precio === null || precio === undefined) {
    return "Consultar precio";
  }
  const formateador = moneda === "USD" ? FORMATEADOR_USD : FORMATEADOR_ARS;
  return `${moneda} ${formateador.format(precio)}`;
}

export function formatearNumero(n: number): string {
  return new Intl.NumberFormat("es-AR").format(n);
}

/** "130 m²" — nunca "0 m²": si es null/0 no se debe renderizar en primer
 * lugar (ver regla de la sección 7.3), esta función solo formatea. */
export function formatearSuperficie(m2: number): string {
  return `${formatearNumero(m2)} m²`;
}

const FORMATEADOR_FECHA = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatearFecha(fecha: Date): string {
  return FORMATEADOR_FECHA.format(fecha);
}

const FORMATEADOR_FECHA_HORA = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatearFechaHora(fecha: Date): string {
  return FORMATEADOR_FECHA_HORA.format(fecha);
}
