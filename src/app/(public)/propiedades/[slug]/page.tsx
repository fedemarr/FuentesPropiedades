import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FichaPropiedad } from "@/components/publicos/ficha/ficha-propiedad";
import { JsonLdPropiedad } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const propiedad = await prisma.propiedad.findUnique({
    where: { slug, publicacion: "PUBLICADA", deletedAt: null },
    select: { titulo: true, metaTitle: true, metaDescription: true, imagenes: { take: 1, orderBy: { orden: "asc" } } },
  });
  if (!propiedad) return {};
  const img = propiedad.imagenes[0];
  return {
    title: propiedad.metaTitle ?? propiedad.titulo,
    description: propiedad.metaDescription ?? undefined,
    openGraph: {
      title: propiedad.metaTitle ?? propiedad.titulo,
      description: propiedad.metaDescription ?? undefined,
      images: img ? [{ url: img.url, width: 1200, height: 800 }] : [],
    },
  };
}

export default async function FichaPropiedadPage({ params }: Props) {
  const { slug } = await params;

  const propiedad = await prisma.propiedad.findUnique({
    where: { slug, publicacion: "PUBLICADA", deletedAt: null },
    include: {
      imagenes: { orderBy: { orden: "asc" } },
    },
  });

  if (!propiedad) notFound();

  // Incrementar vistas
  await prisma.propiedad.update({
    where: { id: propiedad.id },
    data: { vistas: { increment: 1 } },
  });

  const data = {
    id: propiedad.id,
    slug: propiedad.slug,
    codigo: propiedad.codigo,
    titulo: propiedad.titulo,
    descripcion: propiedad.descripcion,
    operacion: propiedad.operacion,
    tipo: propiedad.tipo,
    estado: propiedad.estado,
    destacada: propiedad.destacada,
    moneda: propiedad.moneda as "USD" | "ARS",
    precio: propiedad.precio ? Number(propiedad.precio) : null,
    consultarPrecio: propiedad.consultarPrecio,
    expensas: propiedad.expensas ? Number(propiedad.expensas) : null,
    aptoCredito: propiedad.aptoCredito,
    calle: propiedad.calle,
    barrio: propiedad.barrio,
    localidad: propiedad.localidad,
    partido: propiedad.partido,
    provincia: propiedad.provincia,
    lat: propiedad.lat,
    lng: propiedad.lng,
    radioMapa: propiedad.radioMapa,
    ambientes: propiedad.ambientes,
    dormitorios: propiedad.dormitorios,
    banos: propiedad.banos,
    toilettes: propiedad.toilettes,
    plantas: propiedad.plantas,
    cocheras: propiedad.cocheras,
    antiguedad: propiedad.antiguedad,
    condicion: propiedad.condicion,
    situacion: propiedad.situacion,
    orientacion: propiedad.orientacion,
    supCubierta: propiedad.supCubierta ? Number(propiedad.supCubierta) : null,
    supSemicubierta: propiedad.supSemicubierta ? Number(propiedad.supSemicubierta) : null,
    supDescubierta: propiedad.supDescubierta ? Number(propiedad.supDescubierta) : null,
    supTerreno: propiedad.supTerreno ? Number(propiedad.supTerreno) : null,
    medidaFrente: propiedad.medidaFrente ? Number(propiedad.medidaFrente) : null,
    medidaFondo: propiedad.medidaFondo ? Number(propiedad.medidaFondo) : null,
    servicios: propiedad.servicios,
    ambientesList: propiedad.ambientesList,
    adicionales: propiedad.adicionales,
    planoUrl: propiedad.planoUrl,
    videoUrl: propiedad.videoUrl,
    tour360Url: propiedad.tour360Url,
    vistas: propiedad.vistas,
    imagenes: propiedad.imagenes.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      blurDataUrl: img.blurDataUrl,
    })),
  };

  // Propiedades similares
  const similares = await prisma.propiedad.findMany({
    where: {
      id: { not: propiedad.id },
      publicacion: "PUBLICADA",
      deletedAt: null,
      operacion: propiedad.operacion,
      tipo: propiedad.tipo,
    },
    include: {
      imagenes: { orderBy: { orden: "asc" }, take: 8 },
    },
    take: 3,
  });

  const config = await prisma.configuracion.findUnique({
    where: { id: "singleton" },
    select: { whatsapp: true, matricula: true },
  });

  const similaresSerializados = similares.map((p) => ({
    id: p.id,
    slug: p.slug,
    codigo: p.codigo,
    titulo: p.titulo,
    operacion: p.operacion,
    tipo: p.tipo,
    precio: p.precio ? Number(p.precio) : null,
    consultarPrecio: p.consultarPrecio,
    moneda: p.moneda as "USD" | "ARS",
    estado: p.estado,
    destacada: p.destacada,
    calle: p.calle,
    barrio: p.barrio,
    localidad: p.localidad,
    ambientes: p.ambientes,
    dormitorios: p.dormitorios,
    banos: p.banos,
    cocheras: p.cocheras,
    supCubierta: p.supCubierta ? Number(p.supCubierta) : null,
    supTerreno: p.supTerreno ? Number(p.supTerreno) : null,
    imagenes: p.imagenes.map((img) => ({
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      blurDataUrl: img.blurDataUrl,
    })),
  }));

  return (
    <>
      <JsonLdPropiedad
        titulo={data.titulo}
        descripcion={data.descripcion}
        url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://inmbobilariafuentes.vercel.app"}/propiedades/${data.slug}`}
        imagen={data.imagenes[0]?.url}
        precio={data.precio ?? 0}
        moneda={data.moneda}
        operacion={data.operacion}
        tipo={data.tipo}
        direccion={data.calle ?? undefined}
        localidad={data.localidad}
        ambientes={data.ambientes ?? undefined}
        dormitorios={data.dormitorios ?? undefined}
        banos={data.banos ?? undefined}
        supCubierta={data.supCubierta ?? undefined}
      />
      <FichaPropiedad
        propiedad={data}
        similares={similaresSerializados}
        numeroWhatsapp={config?.whatsapp || "5491112345678"}
        matricula={config?.matricula || "CMCPSM 3032"}
      />
    </>
  );
}
