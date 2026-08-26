"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { EstadoPropiedad } from "@/generated/prisma/enums";
import { generarSiguienteCodigo, generarSlugPropiedad } from "@/lib/propiedad-codigo";
import { esquemaPropiedad, type DatosPropiedad } from "./schema";

async function exigirSesion(): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");
}

function autogenerarMetaTitle(titulo: string): string {
  return titulo.length > 60 ? `${titulo.slice(0, 57)}...` : titulo;
}

function autogenerarMetaDescription(datos: DatosPropiedad): string {
  const partes = [
    datos.tipo.charAt(0) + datos.tipo.slice(1).toLowerCase(),
    datos.ambientes ? `${datos.ambientes} ambientes` : null,
    `en ${datos.operacion === "VENTA" ? "venta" : "alquiler"}`,
    datos.localidad ? `en ${datos.localidad}` : null,
  ].filter(Boolean);
  const texto = `${partes.join(" ")}. ${datos.descripcion}`;
  return texto.length > 155 ? `${texto.slice(0, 152)}...` : texto;
}

interface ResultadoGuardar {
  id: string;
  slug: string;
  codigo: string;
}

/**
 * Crea o actualiza una propiedad.
 *
 * `publicacion` es opcional a propósito: cuando viene indefinido (como en
 * el autoguardado) NO se toca el estado de publicación actual — solo lo
 * cambian los botones explícitos "Guardar borrador" / "Publicar". Una
 * propiedad nueva que todavía no pasó por ninguno de los dos botones nace
 * en BORRADOR.
 */
export async function guardarPropiedad(
  id: string | null,
  datosSinValidar: DatosPropiedad,
  publicacion?: "BORRADOR" | "PUBLICADA",
): Promise<ResultadoGuardar> {
  await exigirSesion();

  const resultado = esquemaPropiedad.safeParse(datosSinValidar);
  if (!resultado.success) {
    const primerError = resultado.error.issues[0];
    throw new Error(primerError?.message ?? "Revisá los datos del formulario.");
  }
  const datos = resultado.data;

  const metaTitle = datos.metaTitle?.trim() || autogenerarMetaTitle(datos.titulo);
  const metaDescription =
    datos.metaDescription?.trim() || autogenerarMetaDescription(datos);

  const dataComun = {
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    operacion: datos.operacion,
    tipo: datos.tipo,
    estado: datos.estado,
    moneda: datos.moneda,
    precio: datos.consultarPrecio ? null : (datos.precio ?? null),
    consultarPrecio: datos.consultarPrecio,
    expensas: datos.expensas ?? null,
    aptoCredito: datos.aptoCredito,
    direccionExacta: datos.direccionExacta || null,
    calle: datos.calle || null,
    barrio: datos.barrio || null,
    localidad: datos.localidad,
    partido: datos.partido || null,
    provincia: datos.provincia,
    lat: datos.lat ?? null,
    lng: datos.lng ?? null,
    radioMapa: datos.radioMapa,
    ambientes: datos.ambientes ?? null,
    dormitorios: datos.dormitorios ?? null,
    banos: datos.banos ?? null,
    toilettes: datos.toilettes ?? null,
    plantas: datos.plantas ?? null,
    cocheras: datos.cocheras ?? null,
    antiguedad: datos.antiguedad ?? null,
    condicion: datos.condicion ?? null,
    situacion: datos.situacion ?? null,
    orientacion: datos.orientacion ?? null,
    supCubierta: datos.supCubierta ?? null,
    supSemicubierta: datos.supSemicubierta ?? null,
    supDescubierta: datos.supDescubierta ?? null,
    supTerreno: datos.supTerreno ?? null,
    medidaFrente: datos.medidaFrente ?? null,
    medidaFondo: datos.medidaFondo ?? null,
    servicios: datos.servicios,
    ambientesList: datos.ambientesList,
    adicionales: datos.adicionales,
    planoUrl: datos.planoUrl || null,
    videoUrl: datos.videoUrl || null,
    tour360Url: datos.tour360Url || null,
    metaTitle,
    metaDescription,
  };

  const imagenesData = datos.imagenes.map((img, i) => ({
    url: img.url,
    publicId: img.publicId,
    alt: img.alt,
    width: img.width,
    height: img.height,
    blurDataUrl: img.blurDataUrl,
    orden: i,
    esPortada: img.esPortada,
  }));

  if (id) {
    const propiedad = await prisma.propiedad.update({
      where: { id },
      data: {
        ...dataComun,
        ...(publicacion ? { publicacion } : {}),
        slug: generarSlugPropiedad(datos.titulo, (await obtenerCodigo(id)) ?? ""),
        imagenes: {
          deleteMany: {},
          create: imagenesData,
        },
      },
    });
    revalidarPropiedad(propiedad.slug);
    return { id: propiedad.id, slug: propiedad.slug, codigo: propiedad.codigo };
  }

  const codigo = await generarSiguienteCodigo(prisma);
  const slug = generarSlugPropiedad(datos.titulo, codigo);

  const propiedad = await prisma.propiedad.create({
    data: {
      ...dataComun,
      codigo,
      slug,
      publicacion: publicacion ?? "BORRADOR",
      imagenes: { create: imagenesData },
    },
  });

  revalidarPropiedad(propiedad.slug);
  return { id: propiedad.id, slug: propiedad.slug, codigo: propiedad.codigo };
}

async function obtenerCodigo(id: string): Promise<string | null> {
  const propiedad = await prisma.propiedad.findUnique({
    where: { id },
    select: { codigo: true },
  });
  return propiedad?.codigo ?? null;
}

function revalidarPropiedad(slug: string): void {
  revalidatePath("/admin/propiedades");
  revalidatePath(`/propiedades/${slug}`);
  revalidatePath("/propiedades");
  revalidatePath("/");
}

export async function eliminarPropiedad(id: string): Promise<void> {
  await exigirSesion();
  await prisma.propiedad.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  revalidatePath("/");
}

/** Duplica una propiedad para arrancar una carga nueva desde una parecida.
 * Las fotos apuntan a los mismos archivos de Cloudinary que el original
 * (no se vuelven a subir) — si más adelante se borra una foto del
 * original, hay que volver a subirla acá si hace falta. */
export async function duplicarPropiedad(id: string): Promise<{ id: string }> {
  await exigirSesion();

  const original = await prisma.propiedad.findUniqueOrThrow({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  const codigo = await generarSiguienteCodigo(prisma);
  const tituloNuevo = `${original.titulo} (copia)`;
  const slug = generarSlugPropiedad(tituloNuevo, codigo);

  const copia = await prisma.propiedad.create({
    data: {
      codigo,
      slug,
      titulo: tituloNuevo,
      descripcion: original.descripcion,
      operacion: original.operacion,
      tipo: original.tipo,
      estado: "DISPONIBLE",
      publicacion: "BORRADOR",
      destacada: false,
      moneda: original.moneda,
      precio: original.precio,
      consultarPrecio: original.consultarPrecio,
      expensas: original.expensas,
      aptoCredito: original.aptoCredito,
      direccionExacta: original.direccionExacta,
      calle: original.calle,
      barrio: original.barrio,
      localidad: original.localidad,
      partido: original.partido,
      provincia: original.provincia,
      lat: original.lat,
      lng: original.lng,
      radioMapa: original.radioMapa,
      ambientes: original.ambientes,
      dormitorios: original.dormitorios,
      banos: original.banos,
      toilettes: original.toilettes,
      plantas: original.plantas,
      cocheras: original.cocheras,
      antiguedad: original.antiguedad,
      condicion: original.condicion,
      situacion: original.situacion,
      orientacion: original.orientacion,
      supCubierta: original.supCubierta,
      supSemicubierta: original.supSemicubierta,
      supDescubierta: original.supDescubierta,
      supTerreno: original.supTerreno,
      medidaFrente: original.medidaFrente,
      medidaFondo: original.medidaFondo,
      servicios: original.servicios,
      ambientesList: original.ambientesList,
      adicionales: original.adicionales,
      planoUrl: original.planoUrl,
      videoUrl: original.videoUrl,
      tour360Url: original.tour360Url,
      imagenes: {
        create: original.imagenes.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt,
          width: img.width,
          height: img.height,
          blurDataUrl: img.blurDataUrl,
          orden: img.orden,
          esPortada: img.esPortada,
        })),
      },
    },
  });

  revalidatePath("/admin/propiedades");
  return { id: copia.id };
}

export async function togglePublicada(id: string): Promise<void> {
  await exigirSesion();
  const propiedad = await prisma.propiedad.findUniqueOrThrow({
    where: { id },
    select: { publicacion: true, slug: true },
  });
  await prisma.propiedad.update({
    where: { id },
    data: {
      publicacion: propiedad.publicacion === "PUBLICADA" ? "BORRADOR" : "PUBLICADA",
    },
  });
  revalidarPropiedad(propiedad.slug);
}

export async function toggleDestacada(id: string): Promise<void> {
  await exigirSesion();
  const propiedad = await prisma.propiedad.findUniqueOrThrow({
    where: { id },
    select: { destacada: true, slug: true },
  });
  await prisma.propiedad.update({
    where: { id },
    data: { destacada: !propiedad.destacada },
  });
  revalidarPropiedad(propiedad.slug);
}

export async function cambiarEstadoPropiedad(
  id: string,
  estado: EstadoPropiedad,
): Promise<void> {
  await exigirSesion();
  const propiedad = await prisma.propiedad.update({
    where: { id },
    data: { estado },
    select: { slug: true },
  });
  revalidarPropiedad(propiedad.slug);
}

export type AccionLote = "publicar" | "despublicar" | "destacar" | "quitar-destacada";

export async function accionLotePropiedades(
  ids: string[],
  accion: AccionLote,
): Promise<void> {
  await exigirSesion();
  if (ids.length === 0) return;

  const data =
    accion === "publicar"
      ? { publicacion: "PUBLICADA" as const }
      : accion === "despublicar"
        ? { publicacion: "BORRADOR" as const }
        : accion === "destacar"
          ? { destacada: true }
          : { destacada: false };

  await prisma.propiedad.updateMany({ where: { id: { in: ids } }, data });
  revalidatePath("/admin/propiedades");
  revalidatePath("/propiedades");
  revalidatePath("/");
}
