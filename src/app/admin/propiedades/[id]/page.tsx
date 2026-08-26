import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FormularioPropiedad } from "@/components/admin/propiedades/formulario-propiedad";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const propiedad = await prisma.propiedad.findUnique({
    where: { id },
    select: { titulo: true },
  });
  return { title: propiedad ? `Editar: ${propiedad.titulo}` : "Propiedad" };
}

export default async function EditarPropiedadPage({ params }: Props) {
  const { id } = await params;

  const propiedad = await prisma.propiedad.findUnique({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });

  if (!propiedad) notFound();

  const datosIniciales = {
    operacion: propiedad.operacion,
    tipo: propiedad.tipo,
    titulo: propiedad.titulo,
    descripcion: propiedad.descripcion,
    estado: propiedad.estado,
    moneda: propiedad.moneda,
    precio: propiedad.precio ? Number(propiedad.precio) : undefined,
    consultarPrecio: propiedad.consultarPrecio,
    expensas: propiedad.expensas ? Number(propiedad.expensas) : undefined,
    aptoCredito: propiedad.aptoCredito,
    direccionExacta: propiedad.direccionExacta ?? "",
    calle: propiedad.calle ?? "",
    barrio: propiedad.barrio ?? "",
    localidad: propiedad.localidad,
    partido: propiedad.partido ?? "",
    provincia: propiedad.provincia,
    lat: propiedad.lat ?? undefined,
    lng: propiedad.lng ?? undefined,
    radioMapa: propiedad.radioMapa,
    ambientes: propiedad.ambientes ?? undefined,
    dormitorios: propiedad.dormitorios ?? undefined,
    banos: propiedad.banos ?? undefined,
    toilettes: propiedad.toilettes ?? undefined,
    plantas: propiedad.plantas ?? undefined,
    cocheras: propiedad.cocheras ?? undefined,
    antiguedad: propiedad.antiguedad,
    condicion: propiedad.condicion,
    situacion: propiedad.situacion,
    orientacion: propiedad.orientacion,
    supCubierta: propiedad.supCubierta ? Number(propiedad.supCubierta) : undefined,
    supSemicubierta: propiedad.supSemicubierta ? Number(propiedad.supSemicubierta) : undefined,
    supDescubierta: propiedad.supDescubierta ? Number(propiedad.supDescubierta) : undefined,
    supTerreno: propiedad.supTerreno ? Number(propiedad.supTerreno) : undefined,
    medidaFrente: propiedad.medidaFrente ? Number(propiedad.medidaFrente) : undefined,
    medidaFondo: propiedad.medidaFondo ? Number(propiedad.medidaFondo) : undefined,
    servicios: propiedad.servicios,
    ambientesList: propiedad.ambientesList,
    adicionales: propiedad.adicionales,
    imagenes: propiedad.imagenes.map((img) => ({
      url: img.url,
      publicId: img.publicId,
      width: img.width,
      height: img.height,
      blurDataUrl: img.blurDataUrl,
      alt: img.alt,
      orden: img.orden,
      esPortada: img.esPortada,
    })),
    planoUrl: propiedad.planoUrl ?? "",
    videoUrl: propiedad.videoUrl ?? "",
    tour360Url: propiedad.tour360Url ?? "",
    metaTitle: propiedad.metaTitle ?? "",
    metaDescription: propiedad.metaDescription ?? "",
  };

  return (
    <FormularioPropiedad
      id={propiedad.id}
      datosIniciales={datosIniciales}
      codigo={propiedad.codigo}
    />
  );
}
