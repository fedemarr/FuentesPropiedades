import { prisma } from "@/lib/prisma";
import { HeroHome } from "@/components/publicos/home/hero-home";
import { PropiedadesDestacadas } from "@/components/publicos/home/propiedades-destacadas";
import { FranjaServicios } from "@/components/publicos/home/franja-servicios";
import { BloqueEstadisticas } from "@/components/publicos/home/bloque-estadisticas";
import { CtaTasacion } from "@/components/publicos/home/cta-tasacion";
import { PreFooter } from "@/components/publicos/home/pre-footer";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function HomePage() {
  const propiedades = await prisma.propiedad.findMany({
    where: {
      publicacion: "PUBLICADA",
      deletedAt: null,
      destacada: true,
    },
    include: {
      imagenes: {
        orderBy: { orden: "asc" },
        take: 8,
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 9,
  });

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
      <HeroHome />
      <PropiedadesDestacadas propiedades={propiedadesSerializadas} />
      <FranjaServicios />
      <BloqueEstadisticas />
      <CtaTasacion />
      <PreFooter />
    </>
  );
}
