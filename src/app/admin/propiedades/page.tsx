import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { TabsFiltroPropiedades, type TabPropiedades } from "@/components/admin/propiedades/tabs-filtro-propiedades";
import { TablaPropiedades } from "@/components/admin/propiedades/tabla-propiedades";
import { PaginacionAdmin } from "@/components/admin/paginacion-admin";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Propiedades",
  robots: { index: false, follow: false },
};

const POR_PAGINA = 20;

function armarWhere(tab: TabPropiedades, buscar: string | undefined): Prisma.PropiedadWhereInput {
  const where: Prisma.PropiedadWhereInput = { deletedAt: null };

  if (tab === "publicadas") where.publicacion = "PUBLICADA";
  else if (tab === "borradores") where.publicacion = "BORRADOR";
  else if (tab === "destacadas") where.destacada = true;
  else if (tab === "vendidas") where.estado = { in: ["VENDIDA", "ALQUILADA"] };

  if (buscar) {
    where.OR = [
      { titulo: { contains: buscar, mode: "insensitive" } },
      { codigo: { contains: buscar, mode: "insensitive" } },
      { calle: { contains: buscar, mode: "insensitive" } },
      { localidad: { contains: buscar, mode: "insensitive" } },
      { barrio: { contains: buscar, mode: "insensitive" } },
    ];
  }

  return where;
}

interface PaginaPropiedadesProps {
  searchParams: Promise<{
    buscar?: string;
    tab?: string;
    pagina?: string;
  }>;
}

export default async function PaginaPropiedades({ searchParams }: PaginaPropiedadesProps) {
  const params = await searchParams;
  const tab = (params.tab as TabPropiedades) ?? "todas";
  const buscar = params.buscar?.trim() || undefined;
  const pagina = Math.max(1, Number(params.pagina) || 1);

  const where = armarWhere(tab, buscar);

  const [propiedades, total, contadores] = await Promise.all([
    prisma.propiedad.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      select: {
        id: true,
        codigo: true,
        titulo: true,
        slug: true,
        operacion: true,
        tipo: true,
        precio: true,
        moneda: true,
        consultarPrecio: true,
        estado: true,
        publicacion: true,
        destacada: true,
        vistas: true,
        imagenes: {
          where: { esPortada: true },
          take: 1,
          select: { url: true, blurDataUrl: true },
        },
      },
    }),
    prisma.propiedad.count({ where }),
    obtenerContadoresTabs(),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  // Prisma devuelve los Decimal como instancias de `Decimal`, que no son
  // serializables de Server a Client Component — se convierten a number acá.
  const filas = propiedades.map((p) => ({
    ...p,
    precio: p.precio === null ? null : Number(p.precio),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-fp-h2 text-fp-navy">Propiedades</h1>
          <p className="text-fp-body text-fp-slate">
            {total} {total === 1 ? "propiedad" : "propiedades"}
            {buscar ? ` para "${buscar}"` : ""}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/propiedades/nueva">
            <Plus className="size-4" />
            Nueva propiedad
          </Link>
        </Button>
      </div>

      <TabsFiltroPropiedades tabActual={tab} contadores={contadores} />

      <TablaPropiedades propiedades={filas} />

      <PaginacionAdmin paginaActual={pagina} totalPaginas={totalPaginas} />
    </div>
  );
}

async function obtenerContadoresTabs() {
  const base = { deletedAt: null } as const;
  const [todas, publicadas, borradores, destacadas, vendidas] = await Promise.all([
    prisma.propiedad.count({ where: base }),
    prisma.propiedad.count({ where: { ...base, publicacion: "PUBLICADA" } }),
    prisma.propiedad.count({ where: { ...base, publicacion: "BORRADOR" } }),
    prisma.propiedad.count({ where: { ...base, destacada: true } }),
    prisma.propiedad.count({ where: { ...base, estado: { in: ["VENDIDA", "ALQUILADA"] } } }),
  ]);
  return { todas, publicadas, borradores, destacadas, vendidas };
}
