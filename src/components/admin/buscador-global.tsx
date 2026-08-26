"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

/** Busca por título, código o dirección — filtra la tabla de propiedades.
 * (Las bandejas de consultas tienen su propio buscador local.) */
export function BuscadorGlobal() {
  const router = useRouter();
  const [valor, setValor] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = valor.trim();
        router.push(
          q ? `/admin/propiedades?buscar=${encodeURIComponent(q)}` : "/admin/propiedades",
        );
      }}
      className="relative hidden w-full max-w-xs md:block"
    >
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fp-slate" />
      <Input
        type="search"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Buscar propiedad por título, código o dirección…"
        className="pl-9"
        aria-label="Buscar propiedad"
      />
    </form>
  );
}
