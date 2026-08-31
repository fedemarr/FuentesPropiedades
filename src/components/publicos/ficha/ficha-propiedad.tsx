"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler,
  Building2,
  ChevronRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatearPrecio, formatearSuperficie } from "@/lib/formato";
import { LABEL_OPERACION, LABEL_TIPO_PROPIEDAD, LABEL_ANTIGUEDAD, LABEL_CONDICION, LABEL_SITUACION, LABEL_ORIENTACION } from "@/lib/enum-labels";
import { labelDeCaracteristica } from "@/lib/caracteristicas";
import { waLink, waMensajePropiedad } from "@/lib/whatsapp";
import { CardPropiedad, type PropiedadCardData } from "@/components/publicos/card-propiedad";

interface FichaData {
  id: string;
  slug: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  operacion: string;
  tipo: string;
  estado: string;
  destacada: boolean;
  moneda: "USD" | "ARS";
  precio: number | null;
  consultarPrecio: boolean;
  expensas: number | null;
  aptoCredito: boolean;
  calle: string | null;
  barrio: string | null;
  localidad: string;
  partido: string | null;
  provincia: string;
  lat: number | null;
  lng: number | null;
  radioMapa: number;
  ambientes: number | null;
  dormitorios: number | null;
  banos: number | null;
  toilettes: number | null;
  plantas: number | null;
  cocheras: number | null;
  antiguedad: string | null;
  condicion: string | null;
  situacion: string | null;
  orientacion: string | null;
  supCubierta: number | null;
  supSemicubierta: number | null;
  supDescubierta: number | null;
  supTerreno: number | null;
  medidaFrente: number | null;
  medidaFondo: number | null;
  servicios: string[];
  ambientesList: string[];
  adicionales: string[];
  planoUrl: string | null;
  videoUrl: string | null;
  tour360Url: string | null;
  vistas: number;
  imagenes: {
    id: string;
    url: string;
    alt: string | null;
    width: number | null;
    height: number | null;
    blurDataUrl: string | null;
  }[];
}

interface FichaPropiedadProps {
  propiedad: FichaData;
  similares: PropiedadCardData[];
  numeroWhatsapp: string;
  matricula: string;
}

export function FichaPropiedad({ propiedad, similares, numeroWhatsapp, matricula }: FichaPropiedadProps) {
  const [indiceGaleria, setIndiceGaleria] = useState(0);
  const [showBarra, setShowBarra] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const refGaleria = useRef<HTMLDivElement>(null);

  const totalFotos = propiedad.imagenes.length;
  const dominio = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const direccionAproximada = [propiedad.calle, propiedad.barrio, propiedad.localidad].filter(Boolean).join(", ");

  // Sticky action bar
  useEffect(() => {
    if (!refGaleria.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBarra(entry ? !entry.isIntersecting : false),
      { threshold: 0 },
    );
    observer.observe(refGaleria.current);
    return () => observer.disconnect();
  }, []);

  const tiles = [
    propiedad.ambientes != null && { icon: Building2, value: propiedad.ambientes, label: "Ambientes" },
    propiedad.dormitorios != null && { icon: Bed, value: propiedad.dormitorios, label: "Dormitorios" },
    propiedad.banos != null && { icon: Bath, value: propiedad.banos, label: "Baños" },
    propiedad.cocheras != null && { icon: Car, value: propiedad.cocheras, label: "Cocheras" },
    propiedad.supCubierta != null && { icon: Ruler, value: formatearSuperficie(propiedad.supCubierta), label: "Sup. cubierta" },
    propiedad.supTerreno != null && { icon: Ruler, value: formatearSuperficie(propiedad.supTerreno), label: "Sup. terreno" },
  ].filter(Boolean) as { icon: typeof Bed; value: number | string; label: string }[];

  const fichaTecnica = [
    propiedad.antiguedad && { label: "Antigüedad", value: LABEL_ANTIGUEDAD[propiedad.antiguedad] ?? propiedad.antiguedad },
    propiedad.condicion && { label: "Condición", value: LABEL_CONDICION[propiedad.condicion] ?? propiedad.condicion },
    propiedad.situacion && { label: "Situación", value: LABEL_SITUACION[propiedad.situacion] ?? propiedad.situacion },
    propiedad.orientacion && { label: "Orientación", value: LABEL_ORIENTACION[propiedad.orientacion] ?? propiedad.orientacion },
    propiedad.expensas != null && { label: "Expensas", value: `$${propiedad.expensas.toLocaleString("es-AR")}` },
    propiedad.supSemicubierta != null && { label: "Sup. semicubierta", value: formatearSuperficie(propiedad.supSemicubierta) },
    propiedad.supDescubierta != null && { label: "Sup. descubierta", value: formatearSuperficie(propiedad.supDescubierta) },
    propiedad.medidaFrente != null && { label: "Frente", value: `${propiedad.medidaFrente} m` },
    propiedad.medidaFondo != null && { label: "Fondo", value: `${propiedad.medidaFondo} m` },
    propiedad.plantas != null && { label: "Plantas", value: String(propiedad.plantas) },
    propiedad.toilettes != null && { label: "Toilettes", value: String(propiedad.toilettes) },
  ].filter(Boolean) as { label: string; value: string }[];

  const caracteristicas = [
    propiedad.servicios.length > 0 && { titulo: "Servicios", items: propiedad.servicios },
    propiedad.ambientesList.length > 0 && { titulo: "Ambientes", items: propiedad.ambientesList },
    propiedad.adicionales.length > 0 && { titulo: "Adicionales", items: propiedad.adicionales },
  ].filter(Boolean) as { titulo: string; items: string[] }[];

  const youtubeEmbed = propiedad.videoUrl
    ? propiedad.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
    : null;

  return (
    <div className="min-h-screen bg-fp-bone">
      {/* Sticky bar de acción */}
      <div
        className={cn(
          "fixed top-[88px] left-0 z-40 w-full border-b border-fp-line bg-fp-white/95 shadow-fp-sm backdrop-blur-md transition-all duration-300",
          showBarra ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        )}
      >
        <div className="fp-container flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="text-fp-number shrink-0 text-lg font-bold text-fp-navy">
              {formatearPrecio(propiedad.precio, propiedad.moneda, propiedad.consultarPrecio)}
            </span>
            <span className="hidden text-fp-small text-fp-slate sm:inline">
              {LABEL_TIPO_PROPIEDAD[propiedad.tipo]} · {propiedad.ambientes != null ? `${propiedad.ambientes} amb` : ""} · {propiedad.localidad}
            </span>
          </div>
          <a
            href={waLink(
              numeroWhatsapp,
              waMensajePropiedad(propiedad.codigo, propiedad.titulo, propiedad.slug, dominio),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-[--radius-fp-md] bg-fp-navy px-5 py-2 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-navy-900"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      <div className="fp-container py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-fp-small text-fp-slate">
          <Link href="/propiedades" className="hover:text-fp-navy">Propiedades</Link>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <span>{LABEL_OPERACION[propiedad.operacion]} de {LABEL_TIPO_PROPIEDAD[propiedad.tipo]}s</span>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <span className="text-fp-ink">{propiedad.localidad}</span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4" ref={refGaleria}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="rounded-full bg-fp-red px-3 py-1 text-xs font-semibold text-fp-white">
                {LABEL_OPERACION[propiedad.operacion]}
              </span>
              <span className="text-fp-small text-fp-slate">{propiedad.codigo}</span>
            </div>
            <h1 className="text-fp-h1 text-fp-ink">{propiedad.titulo}</h1>
            <p className="text-fp-body mt-1 flex items-center gap-1.5 text-fp-slate">
              <MapPin className="h-4 w-4" />
              {direccionAproximada}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFavorito(!favorito)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                favorito ? "border-fp-red bg-fp-red text-fp-white" : "border-fp-line text-fp-slate hover:border-fp-navy hover:text-fp-navy",
              )}
            >
              <Heart className={cn("h-5 w-5", favorito && "fill-current")} />
            </button>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-fp-line text-fp-slate transition-all hover:border-fp-navy hover:text-fp-navy"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Galería */}
        {totalFotos > 0 && (
          <div className="mb-8 grid gap-2 lg:grid-cols-[1fr_280px]">
            {/* Foto principal */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[--radius-fp-lg]">
              <Image
                src={propiedad.imagenes[indiceGaleria]!.url}
                alt={propiedad.imagenes[indiceGaleria]!.alt ?? propiedad.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
              <span className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                {indiceGaleria + 1} / {totalFotos}
              </span>
            </div>
            {/* Thumbnails */}
            <div className="hidden grid-cols-2 grid-rows-2 gap-2 lg:grid">
              {propiedad.imagenes.slice(0, 4).map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setIndiceGaleria(i)}
                  className={cn(
                    "relative overflow-hidden rounded-lg transition-all",
                    i === indiceGaleria && "ring-2 ring-fp-red",
                  )}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${propiedad.titulo} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="140px"
                    />
                  </div>
                  {i === 3 && totalFotos > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                      +{totalFotos - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Layout 2 columnas */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Columna izquierda */}
          <div className="space-y-10">
            {/* Tiles */}
            {tiles.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {tiles.map((tile) => (
                  <div key={tile.label} className="rounded-[--radius-fp-md] bg-fp-white p-4 text-center shadow-fp-sm">
                    <tile.icon className="mx-auto mb-2 h-6 w-6 text-fp-navy" />
                    <div className="text-fp-number text-lg font-bold text-fp-ink">{tile.value}</div>
                    <div className="text-fp-small text-fp-slate">{tile.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Descripción */}
            <section>
              <h2 className="text-fp-h2 mb-4 text-fp-ink">Descripción</h2>
              <div className={cn("text-fp-body leading-relaxed text-fp-ink", !descExpanded && "line-clamp-6")}>
                {propiedad.descripcion}
              </div>
              {propiedad.descripcion.length > 300 && (
                <button
                  type="button"
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-fp-small mt-2 font-semibold text-fp-red"
                >
                  {descExpanded ? "Leer menos" : "Leer más"}
                </button>
              )}
            </section>

            {/* Características */}
            {caracteristicas.length > 0 && (
              <section>
                <h2 className="text-fp-h2 mb-4 text-fp-ink">Características</h2>
                {caracteristicas.map((grupo) => (
                  <div key={grupo.titulo} className="mb-4">
                    <h3 className="text-fp-small mb-2 font-semibold text-fp-slate uppercase tracking-wider">{grupo.titulo}</h3>
                    <div className="flex flex-wrap gap-2">
                      {grupo.items.map((slug) => (
                        <span
                          key={slug}
                          className="inline-flex items-center gap-1.5 rounded-full bg-fp-navy-50 px-3 py-1.5 text-xs font-medium text-fp-navy"
                        >
                          <Check className="h-3 w-3 text-fp-red" />
                          {labelDeCaracteristica(slug)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Ficha técnica */}
            {fichaTecnica.length > 0 && (
              <section>
                <h2 className="text-fp-h2 mb-4 text-fp-ink">Ficha técnica</h2>
                <div className="overflow-hidden rounded-[--radius-fp-md] border border-fp-line bg-fp-white">
                  {fichaTecnica.map((item, i) => (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 text-sm",
                        i % 2 === 0 ? "bg-fp-white" : "bg-fp-bone",
                      )}
                    >
                      <span className="text-fp-slate">{item.label}</span>
                      <span className="font-medium text-fp-ink">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Plano */}
            {propiedad.planoUrl && (
              <section>
                <h2 className="text-fp-h2 mb-4 text-fp-ink">Plano</h2>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[--radius-fp-md] border border-fp-line">
                  <Image
                    src={propiedad.planoUrl}
                    alt="Plano de la propiedad"
                    fill
                    className="object-contain"
                  />
                </div>
              </section>
            )}

            {/* Video YouTube */}
            {youtubeEmbed && (
              <section>
                <h2 className="text-fp-h2 mb-4 text-fp-ink">Video</h2>
                <div className="relative aspect-video overflow-hidden rounded-[--radius-fp-md]">
                  <iframe
                    src={youtubeEmbed}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video de ${propiedad.titulo}`}
                  />
                </div>
              </section>
            )}

            {/* Ubicación */}
            {propiedad.lat != null && propiedad.lng != null && (
              <section>
                <h2 className="text-fp-h2 mb-4 text-fp-ink">Ubicación</h2>
                <div className="relative h-[400px] overflow-hidden rounded-[--radius-fp-md] border border-fp-line">
                  <div className="absolute inset-0 bg-fp-bone flex items-center justify-center text-fp-slate text-sm">
                    Mapa — {propiedad.lat.toFixed(4)}, {propiedad.lng.toFixed(4)}
                    <br />Radio: {propiedad.radioMapa}m
                  </div>
                </div>
                <p className="text-fp-small mt-2 text-fp-slate">
                  La ubicación es aproximada por razones de privacidad.
                </p>
              </section>
            )}
          </div>

          {/* Columna derecha — sticky */}
          <div className="lg:sticky lg:top-[140px] lg:self-start">
            {/* Card de contacto */}
            <div className="rounded-[--radius-fp-lg] border border-fp-line bg-fp-white p-6 shadow-fp-md">
              <div className="mb-1 text-fp-number text-2xl font-bold text-fp-navy">
                {formatearPrecio(propiedad.precio, propiedad.moneda, propiedad.consultarPrecio)}
              </div>
              {propiedad.expensas != null && (
                <p className="text-fp-small text-fp-slate">
                  Expensas: ${propiedad.expensas.toLocaleString("es-AR")}
                </p>
              )}
              {propiedad.aptoCredito && (
                <span className="mt-2 inline-block rounded-full bg-fp-success-50 px-3 py-1 text-xs font-semibold text-fp-success">
                  Apto crédito
                </span>
              )}

              <div className="my-4 border-t border-fp-line" />

              <a
                href={waLink(
                  numeroWhatsapp,
                  waMensajePropiedad(propiedad.codigo, propiedad.titulo, propiedad.slug, dominio),
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-[--radius-fp-md] bg-fp-navy py-3 text-sm font-semibold text-fp-white transition-colors hover:bg-fp-navy-900"
              >
                Consultar por WhatsApp
              </a>

              <div className="my-4 border-t border-fp-line" />

              {/* Mini card martillera */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fp-navy text-sm font-bold text-fp-white">
                  FP
                </div>
                <div>
                  <p className="text-fp-small font-semibold text-fp-ink">Fuentes Propiedades</p>
                  <p className="text-fp-small text-fp-slate">{matricula}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propiedades similares */}
        {similares.length > 0 && (
          <section className="mt-16">
            <h2 className="text-fp-h2 mb-8 text-fp-ink">Propiedades similares</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similares.map((sim) => (
                <CardPropiedad key={sim.id} propiedad={sim} />
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="mt-12 border-t border-fp-line pt-6 pb-8">
          <p className="text-fp-small text-center text-fp-slate">
            Todas las medidas son meramente orientativas; las medidas exactas serán las que se expresen en el
            respectivo título de propiedad. Las fotos, imágenes y videos son ilustrativos y no contractuales.
            Los precios son orientativos y no contractuales.
          </p>
        </div>
      </div>
    </div>
  );
}
