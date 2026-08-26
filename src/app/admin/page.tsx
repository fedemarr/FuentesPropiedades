import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Calculator, Eye, MessagesSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

function inicioDeMes(): Date {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

async function obtenerMetricas() {
  const [propiedadesPublicadas, vistasDelMes, consultasNuevas, tasacionesPendientes] =
    await Promise.all([
      prisma.propiedad.count({
        where: { publicacion: "PUBLICADA", deletedAt: null },
      }),
      prisma.vistaPropiedad.count({
        where: { fecha: { gte: inicioDeMes() } },
      }),
      prisma.consulta.count({ where: { estado: "NUEVA" } }),
      prisma.consulta.count({
        where: { tipo: "TASACION", estado: { not: "CERRADA" } },
      }),
    ]);

  return { propiedadesPublicadas, vistasDelMes, consultasNuevas, tasacionesPendientes };
}

export default async function DashboardAdmin() {
  const metricas = await obtenerMetricas();
  const hayConsultasSinResponder = metricas.consultasNuevas > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-fp-h2 text-fp-navy">Dashboard</h1>
        <p className="text-fp-body text-fp-slate">
          Resumen general de la actividad del sitio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaMetrica
          icono={Building2}
          etiqueta="Propiedades publicadas"
          valor={metricas.propiedadesPublicadas}
          href="/admin/propiedades"
        />
        <TarjetaMetrica
          icono={Eye}
          etiqueta="Vistas este mes"
          valor={metricas.vistasDelMes}
        />
        <TarjetaMetrica
          icono={MessagesSquare}
          etiqueta="Consultas nuevas sin responder"
          valor={metricas.consultasNuevas}
          href="/admin/consultas"
          destacada={hayConsultasSinResponder}
        />
        <TarjetaMetrica
          icono={Calculator}
          etiqueta="Tasaciones pendientes"
          valor={metricas.tasacionesPendientes}
          href="/admin/tasaciones"
        />
      </div>
    </div>
  );
}

interface TarjetaMetricaProps {
  icono: React.ComponentType<{ className?: string }>;
  etiqueta: string;
  valor: number;
  href?: string;
  destacada?: boolean;
}

function TarjetaMetrica({
  icono: Icono,
  etiqueta,
  valor,
  href,
  destacada = false,
}: TarjetaMetricaProps) {
  const contenido = (
    <div
      className={cn(
        "flex h-full flex-col gap-3 rounded-fp-lg border p-5 shadow-fp-sm transition-shadow",
        destacada
          ? "border-fp-error/30 bg-fp-error-50"
          : "border-fp-line bg-white hover:shadow-fp-md",
      )}
    >
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-fp-sm",
          destacada ? "bg-fp-error/10 text-fp-error" : "bg-fp-navy-50 text-fp-navy",
        )}
      >
        <Icono className="size-[18px]" />
      </div>
      <div>
        <p className="text-fp-number text-3xl text-fp-ink">{valor}</p>
        <p className="text-fp-small text-fp-slate">{etiqueta}</p>
      </div>
    </div>
  );

  if (!href) return contenido;

  return (
    <Link href={href} className="block h-full">
      {contenido}
    </Link>
  );
}
