"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContenido } from "./sidebar-contenido";

export function SidebarMovil() {
  const [abierto, setAbierto] = useState(false);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-72 max-w-[85vw] border-fp-navy-700 bg-fp-navy p-0"
      >
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar menú"
          className="absolute top-3.5 right-3 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </Button>
        <SidebarContenido onNavegar={() => setAbierto(false)} />
      </SheetContent>
    </Sheet>
  );
}
