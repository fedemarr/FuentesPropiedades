import { z } from "zod";

export const esquemaContacto = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre."),
  email: z.email("Ingresá un email válido."),
  telefono: z.string().trim().optional(),
  mensaje: z.string().trim().min(5, "Escribí tu mensaje."),
  honeypot: z.string().optional(),
  tiempoInicioMs: z.number(),
});

export type DatosContactoEnvio = z.infer<typeof esquemaContacto>;
