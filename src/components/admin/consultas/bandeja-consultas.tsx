"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink,
  StickyNote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  formatearFechaHora,
} from "@/lib/formato";
import {
  LABEL_TIPO_CONSULTA,
  LABEL_ESTADO_CONSULTA,
} from "@/lib/enum-labels";
import { waLink, waMensajeAdminInteresado } from "@/lib/whatsapp";
import { cambiarEstadoConsulta, guardarNotaConsulta } from "@/app/admin/consultas/actions";
import type { EstadoConsulta } from "@/generated/prisma/enums";

type ConsultaFila = {
  id: string;
  tipo: string;
  estado: string;
  nombre: string;
  telefono: string;
  email: string | null;
  mensaje: string | null;
  propiedadId: string | null;
  notaInterna: string | null;
  origen: string;
  createdAt: Date;
  propiedad: { codigo: string; titulo: string } | null;
};

type TipoTab = "todas" | "nuevas" | "contactadas" | "cerradas" | "tasaciones" | "administraciones";

interface BandejaConsultasProps {
  consultas: ConsultaFila[];
  contadores: {
    todas: number;
    nuevas: number;
    contactadas: number;
    cerradas: number;
  };
}

const ESTADO_CLASES: Record<string, string> = {
  NUEVA: "bg-fp-error/10 text-fp-error",
  CONTACTADA: "bg-amber-100 text-amber-700",
  CERRADA: "bg-fp-success-50 text-fp-success",
};

export function BandejaConsultas({
  consultas,
  contadores,
}: BandejaConsultasProps) {
  const router = useRouter();
  const [seleccionada, setSeleccionada] = useState<ConsultaFila | null>(null);
  const [tab, setTab] = useState<TipoTab>("todas");
  const [pendiente, iniciarTransicion] = useTransition();

  function filtradas(): ConsultaFila[] {
    if (tab === "todas") return consultas;
    if (tab === "nuevas") return consultas.filter((c) => c.estado === "NUEVA");
    if (tab === "contactadas") return consultas.filter((c) => c.estado === "CONTACTADA");
    if (tab === "cerradas") return consultas.filter((c) => c.estado === "CERRADA");
    if (tab === "tasaciones") return consultas.filter((c) => c.tipo === "TASACION");
    if (tab === "administraciones") return consultas.filter((c) => c.tipo === "ADMINISTRACION");
    return consultas;
  }

  function cambiarEstado(consulta: ConsultaFila, nuevoEstado: string) {
    iniciarTransicion(async () => {
      try {
        await cambiarEstadoConsulta(consulta.id, nuevoEstado as EstadoConsulta);
        toast.success("Estado actualizado.");
        setSeleccionada(null);
        router.refresh();
      } catch {
        toast.error("No se pudo actualizar el estado.");
      }
    });
  }

  function guardarNota(consulta: ConsultaFila, nota: string) {
    iniciarTransicion(async () => {
      try {
        await guardarNotaConsulta(consulta.id, nota);
        toast.success("Nota guardada.");
        router.refresh();
      } catch {
        toast.error("No se pudo guardar la nota.");
      }
    });
  }

  const items = filtradas();

  return (
    <>
      <Tabs value={tab} onValueChange={(v) => setTab(v as TipoTab)}>
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="todas"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Todas
            <span className="ml-1.5 opacity-70">{contadores.todas}</span>
          </TabsTrigger>
          <TabsTrigger
            value="nuevas"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Nuevas
            <span className="ml-1.5 opacity-70">{contadores.nuevas}</span>
          </TabsTrigger>
          <TabsTrigger
            value="contactadas"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Contactadas
            <span className="ml-1.5 opacity-70">{contadores.contactadas}</span>
          </TabsTrigger>
          <TabsTrigger
            value="cerradas"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Cerradas
            <span className="ml-1.5 opacity-70">{contadores.cerradas}</span>
          </TabsTrigger>
          <TabsTrigger
            value="tasaciones"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Tasaciones
          </TabsTrigger>
          <TabsTrigger
            value="administraciones"
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Administraciones
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-fp-lg border border-dashed border-fp-line bg-white py-16 text-center">
          <p className="text-fp-body text-fp-ink">No hay consultas para mostrar.</p>
          <p className="text-fp-small text-fp-slate">
            Probá con otro filtro.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-fp-lg border border-fp-line bg-white">
          <table className="w-full text-left text-fp-small">
            <thead>
              <tr className="border-b border-fp-line text-fp-slate">
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Propiedad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((consulta) => (
                <tr
                  key={consulta.id}
                  className="cursor-pointer border-b border-fp-line/50 transition-colors hover:bg-fp-bone/50"
                  onClick={() => setSeleccionada(consulta)}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-fp-slate">
                    {formatearFechaHora(consulta.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-fp-ink">
                    {consulta.nombre}
                  </td>
                  <td className="px-4 py-3 text-fp-slate">
                    {LABEL_TIPO_CONSULTA[consulta.tipo]}
                  </td>
                  <td className="px-4 py-3 text-fp-slate">
                    {consulta.propiedad ? (
                      <Link
                        href={`/admin/propiedades/${consulta.propiedadId}`}
                        className="flex items-center gap-1 text-fp-navy hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {consulta.propiedad.codigo}
                        <ExternalLink className="size-3" />
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        "border-0 font-medium",
                        ESTADO_CLASES[consulta.estado] ?? "bg-fp-bone text-fp-slate",
                      )}
                    >
                      {LABEL_ESTADO_CONSULTA[consulta.estado]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSeleccionada(consulta);
                      }}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={!!seleccionada} onOpenChange={(open) => !open && setSeleccionada(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {seleccionada && (
            <PanelConsulta
              consulta={seleccionada}
              pendiente={pendiente}
              onCerrar={() => setSeleccionada(null)}
              onCambiarEstado={(estado) => cambiarEstado(seleccionada, estado)}
              onGuardarNota={(nota) => guardarNota(seleccionada, nota)}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

interface PanelConsultaProps {
  consulta: ConsultaFila;
  pendiente: boolean;
  onCerrar: () => void;
  onCambiarEstado: (estado: string) => void;
  onGuardarNota: (nota: string) => void;
}

function PanelConsulta({
  consulta,
  pendiente,
  onCerrar,
  onCambiarEstado,
  onGuardarNota,
}: PanelConsultaProps) {
  const [nota, setNota] = useState(consulta.notaInterna ?? "");

  const waNumero = consulta.telefono.replace(/[^0-9]/g, "");
  const waMensaje = waMensajeAdminInteresado(
    consulta.nombre,
    consulta.propiedad?.codigo,
  );
  const waUrl = waLink(waNumero, waMensaje);

  return (
    <div className="flex flex-col gap-6 pt-8">
      <SheetHeader>
        <SheetTitle className="text-fp-h3 text-fp-navy">
          Consulta de {consulta.nombre}
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-fp-label text-fp-slate">Nombre</span>
          <span className="text-fp-body text-fp-ink">{consulta.nombre}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-fp-label text-fp-slate">Teléfono</span>
          <a
            href={`tel:${consulta.telefono}`}
            className="flex items-center gap-2 text-fp-body text-fp-navy hover:underline"
          >
            <Phone className="size-4" />
            {consulta.telefono}
          </a>
        </div>

        {consulta.email && (
          <div className="flex flex-col gap-1">
            <span className="text-fp-label text-fp-slate">Email</span>
            <a
              href={`mailto:${consulta.email}`}
              className="flex items-center gap-2 text-fp-body text-fp-navy hover:underline"
            >
              <Mail className="size-4" />
              {consulta.email}
            </a>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-fp-label text-fp-slate">Tipo</span>
          <span className="text-fp-body text-fp-ink">
            {LABEL_TIPO_CONSULTA[consulta.tipo]}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-fp-label text-fp-slate">Estado</span>
          <Select
            value={consulta.estado}
            onValueChange={onCambiarEstado}
            disabled={pendiente}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LABEL_ESTADO_CONSULTA).map(([valor, label]) => (
                <SelectItem key={valor} value={valor}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {consulta.propiedad && (
          <div className="flex flex-col gap-1">
            <span className="text-fp-label text-fp-slate">Propiedad relacionada</span>
            <Link
              href={`/admin/propiedades/${consulta.propiedadId}`}
              className="flex items-center gap-2 text-fp-body text-fp-navy hover:underline"
            >
              <ExternalLink className="size-4" />
              {consulta.propiedad.codigo} — {consulta.propiedad.titulo}
            </Link>
          </div>
        )}

        {consulta.mensaje && (
          <div className="flex flex-col gap-1">
            <span className="text-fp-label text-fp-slate">Mensaje</span>
            <p className="whitespace-pre-wrap rounded-fp-md bg-fp-bone p-3 text-fp-body text-fp-ink">
              {consulta.mensaje}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <span className="text-fp-label text-fp-slate">Nota interna</span>
          <Textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Escribí una nota interna..."
            rows={3}
          />
          <Button
            variant="outline"
            size="sm"
            className="self-end"
            disabled={pendiente || nota === (consulta.notaInterna ?? "")}
            onClick={() => onGuardarNota(nota)}
          >
            <StickyNote className="size-4" />
            Guardar nota
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button asChild size="lg" className="w-full bg-fp-success text-white hover:bg-fp-success/90">
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="size-5" />
            Responder por WhatsApp
          </a>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCerrar}
          className="w-full"
        >
          <X className="size-4" />
          Cerrar
        </Button>
      </div>
    </div>
  );
}
