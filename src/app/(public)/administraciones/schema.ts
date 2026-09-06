import { z } from "zod";

export const esquemaAdministracion = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre."),
  telefono: z.string().trim().min(6, "Ingresá un teléfono válido."),
  tipoInmueble: z.string().optional(),
  cantUnidades: z.string().optional(),
  mensaje: z.string().optional(),
  honeypot: z.string().optional(),
  tiempoInicioMs: z.number(),
});

export type DatosAdministracionEnvio = z.infer<typeof esquemaAdministracion>;
