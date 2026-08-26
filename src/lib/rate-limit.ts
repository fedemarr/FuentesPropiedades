// Rate limiting en memoria, por proceso. Alcanza para la escala de este
// sitio (una martillera cargando datos a mano, no un e-commerce masivo) y
// evita depender de Redis/Upstash, que no está en el stack del proyecto.
//
// Limitación conocida: en un deploy serverless con múltiples instancias
// concurrentes, cada instancia tiene su propio contador — la protección es
// "mejor esfuerzo", no un límite duro entre instancias. Si el sitio crece
// mucho, migrar esto a Upstash Redis con el mismo algoritmo de ventana fija.

interface Contador {
  intentos: number;
  reiniciaEn: number; // epoch ms
}

const contadores = new Map<string, Contador>();

// Limpieza periódica para no acumular memoria indefinidamente.
const INTERVALO_LIMPIEZA_MS = 10 * 60 * 1000;
let ultimaLimpieza = Date.now();

function limpiarVencidos(ahora: number): void {
  if (ahora - ultimaLimpieza < INTERVALO_LIMPIEZA_MS) return;
  ultimaLimpieza = ahora;
  for (const [clave, contador] of contadores) {
    if (ahora >= contador.reiniciaEn) contadores.delete(clave);
  }
}

function obtenerVigente(clave: string, ahora: number): Contador | undefined {
  const existente = contadores.get(clave);
  if (!existente || ahora >= existente.reiniciaEn) return undefined;
  return existente;
}

export interface ResultadoRateLimit {
  permitido: boolean;
  /** Segundos hasta que se pueda reintentar, solo si `permitido` es false. */
  reintentarEnSegundos?: number;
}

/**
 * Ventana fija: `limite` intentos cada `ventanaMs` milisegundos, por clave
 * (típicamente IP + acción, ej. "contacto:190.123.45.6"). Cuenta CUALQUIER
 * intento (éxito o no) — pensado para formularios públicos (anti-spam).
 */
export function verificarRateLimit(
  clave: string,
  limite: number,
  ventanaMs: number,
): ResultadoRateLimit {
  const ahora = Date.now();
  limpiarVencidos(ahora);

  const existente = obtenerVigente(clave, ahora);

  if (!existente) {
    contadores.set(clave, { intentos: 1, reiniciaEn: ahora + ventanaMs });
    return { permitido: true };
  }

  if (existente.intentos >= limite) {
    return {
      permitido: false,
      reintentarEnSegundos: Math.ceil((existente.reiniciaEn - ahora) / 1000),
    };
  }

  existente.intentos += 1;
  return { permitido: true };
}

/**
 * Variante de solo-fallos, pensada para login: consultar `estaLimitado`
 * ANTES de validar credenciales (corta rápido, sin tocar la base ni bcrypt),
 * y llamar a `registrarIntentoFallido` solo cuando la credencial es
 * incorrecta — así un admin que entra y sale varias veces en 15 minutos
 * nunca se bloquea a sí mismo por loguearse bien.
 */
export function estaLimitado(clave: string, limite: number): boolean {
  const ahora = Date.now();
  limpiarVencidos(ahora);
  const existente = obtenerVigente(clave, ahora);
  return existente !== undefined && existente.intentos >= limite;
}

export function registrarIntentoFallido(clave: string, ventanaMs: number): void {
  const ahora = Date.now();
  const existente = obtenerVigente(clave, ahora);

  if (!existente) {
    contadores.set(clave, { intentos: 1, reiniciaEn: ahora + ventanaMs });
    return;
  }

  existente.intentos += 1;
}

/** IP del visitante a partir de los headers estándar detrás de un proxy
 * (Vercel, la mayoría de los hostings) — nunca confiable al 100%, pero es
 * la mejor señal disponible sin infraestructura adicional. */
export function obtenerIpDeHeaders(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "desconocida";
  }
  return headers.get("x-real-ip") ?? "desconocida";
}
