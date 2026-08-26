import { z } from "zod";
import {
  Antiguedad,
  Condicion,
  EstadoPropiedad,
  Moneda,
  Operacion,
  Orientacion,
  Situacion,
  TipoPropiedad,
} from "@/generated/prisma/enums";

function valoresDe<T extends Record<string, string>>(
  enumObjeto: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(enumObjeto) as [T[keyof T], ...T[keyof T][]];
}

const REGEX_YOUTUBE = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/i;

export const esquemaImagen = z.object({
  url: z.string(),
  publicId: z.string(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  blurDataUrl: z.string().nullable(),
  alt: z.string().nullable(),
  orden: z.number().int(),
  esPortada: z.boolean(),
});

export type ImagenFormulario = z.infer<typeof esquemaImagen>;

const numeroOpcional = z
  .union([z.number(), z.nan(), z.literal("")])
  .optional()
  .transform((v) => (v === undefined || v === "" || Number.isNaN(v) ? undefined : v));

export const esquemaPropiedad = z
  .object({
    // ① Información básica
    operacion: z.enum(valoresDe(Operacion), {
      message: "Elegí si es venta o alquiler.",
    }),
    tipo: z.enum(valoresDe(TipoPropiedad), {
      message: "Elegí el tipo de propiedad.",
    }),
    titulo: z
      .string()
      .min(5, "El título tiene que tener al menos 5 caracteres.")
      .max(120, "El título es demasiado largo (máximo 120 caracteres)."),
    descripcion: z
      .string()
      .min(20, "Escribí una descripción de al menos 20 caracteres."),
    estado: z.enum(valoresDe(EstadoPropiedad)),

    // ② Precio
    moneda: z.enum(valoresDe(Moneda)),
    precio: numeroOpcional,
    consultarPrecio: z.boolean(),
    expensas: numeroOpcional,
    aptoCredito: z.boolean(),

    // ③ Ubicación
    direccionExacta: z.string().optional(),
    calle: z.string().optional(),
    barrio: z.string().optional(),
    localidad: z.string().min(2, "Ingresá la localidad."),
    partido: z.string().optional(),
    provincia: z.string().min(2, "Ingresá la provincia."),
    lat: numeroOpcional,
    lng: numeroOpcional,
    radioMapa: z
      .number()
      .int()
      .min(50, "El radio mínimo es 50 metros.")
      .max(2000, "El radio máximo es 2000 metros."),

    // ④ Detalles
    ambientes: numeroOpcional,
    dormitorios: numeroOpcional,
    banos: numeroOpcional,
    toilettes: numeroOpcional,
    plantas: numeroOpcional,
    cocheras: numeroOpcional,
    antiguedad: z.enum(valoresDe(Antiguedad)).optional().nullable(),
    condicion: z.enum(valoresDe(Condicion)).optional().nullable(),
    situacion: z.enum(valoresDe(Situacion)).optional().nullable(),
    orientacion: z.enum(valoresDe(Orientacion)).optional().nullable(),

    // ⑤ Superficies
    supCubierta: numeroOpcional,
    supSemicubierta: numeroOpcional,
    supDescubierta: numeroOpcional,
    supTerreno: numeroOpcional,
    medidaFrente: numeroOpcional,
    medidaFondo: numeroOpcional,

    // ⑥ Características
    servicios: z.array(z.string()),
    ambientesList: z.array(z.string()),
    adicionales: z.array(z.string()),

    // ⑦ Fotos
    imagenes: z.array(esquemaImagen),

    // ⑧ Media adicional
    planoUrl: z.string().optional(),
    videoUrl: z
      .string()
      .optional()
      .refine((v) => !v || REGEX_YOUTUBE.test(v), {
        message: "Tiene que ser un link de YouTube válido.",
      }),
    tour360Url: z.string().optional(),

    // ⑨ SEO
    metaTitle: z
      .string()
      .max(70, "El meta title no debería superar los 70 caracteres.")
      .optional(),
    metaDescription: z
      .string()
      .max(160, "La meta description no debería superar los 160 caracteres.")
      .optional(),
  })
  .refine(
    (datos) => datos.consultarPrecio || (datos.precio !== undefined && datos.precio > 0),
    {
      message: "El precio tiene que ser un número mayor a cero.",
      path: ["precio"],
    },
  );

export type DatosPropiedad = z.infer<typeof esquemaPropiedad>;

export const VALORES_POR_DEFECTO: DatosPropiedad = {
  operacion: "VENTA",
  tipo: "CASA",
  titulo: "",
  descripcion: "",
  estado: "DISPONIBLE",
  moneda: "USD",
  precio: undefined,
  consultarPrecio: false,
  expensas: undefined,
  aptoCredito: false,
  direccionExacta: "",
  calle: "",
  barrio: "",
  localidad: "",
  partido: "",
  provincia: "Buenos Aires",
  lat: undefined,
  lng: undefined,
  radioMapa: 300,
  ambientes: undefined,
  dormitorios: undefined,
  banos: undefined,
  toilettes: undefined,
  plantas: undefined,
  cocheras: undefined,
  antiguedad: null,
  condicion: null,
  situacion: null,
  orientacion: null,
  supCubierta: undefined,
  supSemicubierta: undefined,
  supDescubierta: undefined,
  supTerreno: undefined,
  medidaFrente: undefined,
  medidaFondo: undefined,
  servicios: [],
  ambientesList: [],
  adicionales: [],
  imagenes: [],
  planoUrl: "",
  videoUrl: "",
  tour360Url: "",
  metaTitle: "",
  metaDescription: "",
};
