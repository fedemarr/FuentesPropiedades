import { z } from "zod";

export const esquemaTasacion = z.object({
  tipo: z.enum(
    ["CASA", "DEPARTAMENTO", "PH", "LOTE", "LOCAL", "OFICINA", "QUINTA", "GALPON", "COCHERA", "CAMPO"],
    { message: "Elegí el tipo de propiedad." },
  ),
  direccion: z.string().trim().min(3, "Ingresá una dirección o barrio."),
  ambientes: z.string().optional(),
  supCubierta: z.string().optional(),
  supTotal: z.string().optional(),
  antiguedad: z
    .enum(["A_ESTRENAR", "EN_POZO", "HASTA_5", "ENTRE_5_10", "ENTRE_10_20", "MAS_20"])
    .optional()
    .or(z.literal("")),
  condicion: z.enum(["EXCELENTE", "MUY_BUENO", "BUENO", "A_REFACCIONAR"], {
    message: "Seleccioná la condición del inmueble.",
  }),
  descripcion: z.string().optional(),
  nombre: z.string().trim().min(2, "Ingresá tu nombre."),
  telefono: z.string().trim().min(6, "Ingresá un teléfono válido."),
  email: z.email("Ingresá un email válido.").optional().or(z.literal("")),
  fotos: z.array(z.string()).max(5, "Como máximo 5 fotos.").optional(),
  // Anti-spam: campo trampa (debe llegar vacío) y tiempo mínimo de
  // completado, per la sección 12 del prompt. Nunca reCAPTCHA visible.
  honeypot: z.string().optional(),
  tiempoInicioMs: z.number(),
});

export type DatosTasacionEnvio = z.infer<typeof esquemaTasacion>;
