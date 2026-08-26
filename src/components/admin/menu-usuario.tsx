"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cerrarSesion } from "@/app/admin/cerrar-sesion-action";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primeras = partes.slice(0, 2).map((p) => p.charAt(0).toUpperCase());
  return primeras.join("") || "A";
}

interface MenuUsuarioProps {
  nombre: string;
  email: string;
}

export function MenuUsuario({ nombre, email }: MenuUsuarioProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-fp-full outline-none focus-visible:ring-2 focus-visible:ring-fp-navy-700">
        <Avatar className="size-9">
          <AvatarFallback className="bg-fp-navy-50 text-fp-navy">
            {iniciales(nombre)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 text-fp-ink">
            <User className="size-3.5" />
            {nombre}
          </span>
          <span className="text-fp-small font-normal text-fp-slate">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <form action={cerrarSesion} className="w-full">
            <button type="submit" className="flex w-full items-center gap-2">
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
