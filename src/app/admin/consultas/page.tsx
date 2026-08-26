import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BandejaConsultas } from "@/components/admin/consultas/bandeja-consultas";

export const metadata: Metadata = {
  title: "Consultas",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaginaConsultas() {
  const [consultas, contadores] = await Promise.all([
    prisma.consulta.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        propiedad: {
          select: { codigo: true, titulo: true },
        },
      },
    }),
    Promise.all([
      prisma.consulta.count(),
      prisma.consulta.count({ where: { estado: "NUEVA" } }),
      prisma.consulta.count({ where: { estado: "CONTACTADA" } }),
      prisma.consulta.count({ where: { estado: "CERRADA" } }),
    ]),
  ]);

  const [todas, nuevas, contactadas, cerradas] = contadores;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-fp-h2 text-fp-navy">Consultas</h1>
        <p className="text-fp-body text-fp-slate">
          {todas} {todas === 1 ? "consulta" : "consultas"} en total
        </p>
      </div>

      <BandejaConsultas
        consultas={consultas}
        contadores={{ todas, nuevas, contactadas, cerradas }}
      />
    </div>
  );
}
