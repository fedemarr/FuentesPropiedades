"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TabPropiedades =
  | "todas"
  | "publicadas"
  | "borradores"
  | "destacadas"
  | "vendidas";

const TABS: { value: TabPropiedades; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "publicadas", label: "Publicadas" },
  { value: "borradores", label: "Borradores" },
  { value: "destacadas", label: "Destacadas" },
  { value: "vendidas", label: "Vendidas/Alquiladas" },
];

interface TabsFiltroPropiedadesProps {
  tabActual: TabPropiedades;
  contadores: Record<TabPropiedades, number>;
}

export function TabsFiltroPropiedades({
  tabActual,
  contadores,
}: TabsFiltroPropiedadesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function cambiarTab(valor: string) {
    const params = new URLSearchParams(searchParams);
    if (valor === "todas") params.delete("tab");
    else params.set("tab", valor);
    params.delete("pagina");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs value={tabActual} onValueChange={cambiarTab}>
      <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-fp-full border border-fp-line bg-white px-4 py-1.5 text-fp-small data-[state=active]:border-fp-navy data-[state=active]:bg-fp-navy data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">{contadores[tab.value]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
