"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SeccionFormularioProps {
  id: string;
  numero: number;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  abiertaPorDefecto?: boolean;
}

export function SeccionFormulario({
  id,
  numero,
  titulo,
  descripcion,
  children,
  abiertaPorDefecto = true,
}: SeccionFormularioProps) {
  const [abierta, setAbierta] = useState(abiertaPorDefecto);

  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-fp-lg border border-fp-line bg-white"
    >
      <Collapsible open={abierta} onOpenChange={setAbierta}>
        <CollapsibleTrigger className="flex w-full items-center gap-3 px-5 py-4 text-left">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-fp-full bg-fp-navy-50 text-fp-small font-semibold text-fp-navy">
            {numero}
          </span>
          <div className="flex-1">
            <h2 className="text-fp-h3 text-fp-navy">{titulo}</h2>
            {descripcion && <p className="text-fp-small text-fp-slate">{descripcion}</p>}
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-fp-slate transition-transform duration-200",
              abierta && "rotate-180",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-fp-line px-5 py-5">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
