import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { ListadoPropiedades } from "@/components/publicos/listado/listado-propiedades";
import type { Operacion, TipoPropiedad } from "@/generated/prisma/enums";

export const revalidate = 300;

const POR_PAGINA = 24;

interface Props {
  searchParams: Promise<{
    q?: string;
    operacion?: string;
    tipo?: string;
    barrio?: string;
    localidad?: string;
    precioMin?: string;
    precioMax?: string;
    moneda?: string;
    ambientes?: string;
    dormitorios?: string;
    banos?: string;
    cocheras?: string;
    supMin?: string;
    supMax?: string;
    antiguedad?: string;
    aptoCredito?: string;
    orden?: string;
    vista?: string;
    pagina?: string;
  }>;
}

export default async function PropiedadesPage({ searchParams }: Props) {
  const params = await searchParams;

  const donde: Prisma.PropiedadWhereInput = {
    publicacion: "PUBLICADA",
    deletedAt: null,
  };

  if (params.operacion) {
    donde.operacion = params.operacion as Operacion;
  }
  if (params.tipo) {
    const tipos = params.tipo.split(",").filter(Boolean);
    donde.tipo = { in: tipos as TipoPropiedad[] };
  }
  if (params.q) {
    const q = params.q;
    donde.OR = [
      { titulo: { contains: q, mode: "insensitive" } },
      { codigo: { contains: q, mode: "insensitive" } },
      { calle: { contains: q, mode: "insensitive" } },
      { barrio: { contains: q, mode: "insensitive" } },
      { localidad: { contains: q, mode: "insensitive" } },
    ];
  }
  if (params.barrio) {
    donde.barrio = { contains: params.barrio, mode: "insensitive" };
  }
  if (params.localidad) {
    donde.localidad = { contains: params.localidad, mode: "insensitive" };
  }
  if (params.precioMin || params.precioMax) {
    donde.precio = {};
    if (params.precioMin) donde.precio.gte = Number(params.precioMin);
    if (params.precioMax) donde.precio.lte = Number(params.precioMax);
  }
  if (params.moneda) {
    donde.moneda = params.moneda as "USD" | "ARS";
  }
  if (params.ambientes) {
    donde.ambientes = { gte: Number(params.ambientes) };
  }
  if (params.dormitorios) {
    donde.dormitorios = { gte: Number(params.dormitorios) };
  }
  if (params.banos) {
    donde.banos = { gte: Number(params.banos) };
  }
  if (params.cocheras) {
    donde.cocheras = { gte: Number(params.cocheras) };
  }
  if (params.supMin || params.supMax) {
    donde.supCubierta = {};
    if (params.supMin) donde.supCubierta.gte = Number(params.supMin);
    if (params.supMax) donde.supCubierta.lte = Number(params.supMax);
  }
  if (params.antiguedad) {
    donde.antiguedad = params.antiguedad as "A_ESTRENAR" | "EN_POZO" | "HASTA_5" | "ENTRE_5_10" | "ENTRE_10_20" | "MAS_20";
  }
  if (params.aptoCredito === "true") {
    donde.aptoCredito = true;
  }

  let orderBy: Prisma.PropiedadOrderByWithRelationInput = { updatedAt: "desc" };
  if (params.orden === "precio-asc") orderBy = { precio: "asc" };
  else if (params.orden === "precio-desc") orderBy = { precio: "desc" };
  else if (params.orden === "superficie") orderBy = { supCubierta: "desc" };

  const pagina = Math.max(1, Number(params.pagina) || 1);
  const skip = (pagina - 1) * POR_PAGINA;

  const [propiedades, total] = await Promise.all([
    prisma.propiedad.findMany({
      where: donde,
      include: {
        imagenes: {
          orderBy: { orden: "asc" },
          take: 8,
        },
      },
      orderBy,
      skip,
      take: POR_PAGINA,
    }),
    prisma.propiedad.count({ where: donde }),
  ]);

  const propiedadesSerializadas = propiedades.map((p) => ({
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
    lat: p.lat,
    lng: p.lng,
    imagenes: p.imagenes.map((img) => ({
      url: img.url,
      alt: img.alt,
      width: img.width,
      height: img.height,
      blurDataUrl: img.blurDataUrl,
    })),
  }));

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <Suspense fallback={<ListadoSkeleton />}>
      <ListadoPropiedades
        propiedades={propiedadesSerializadas}
        total={total}
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        filtrosIniciales={params}
      />
    </Suspense>
  );
}

function ListadoSkeleton() {
  return (
    <div className="fp-container py-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-fp-line" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-[--radius-fp-md] bg-fp-line">
            <div className="aspect-[4/3] rounded-t-[--radius-fp-md] bg-fp-navy/5" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-20 rounded bg-fp-line" />
              <div className="h-5 w-3/4 rounded bg-fp-line" />
              <div className="h-3 w-1/2 rounded bg-fp-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
