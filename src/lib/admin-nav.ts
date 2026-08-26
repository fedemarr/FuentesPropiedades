import {
  Building2,
  Calculator,
  ClipboardList,
  LayoutDashboard,
  MessagesSquare,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ItemNavAdmin {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ADMIN: readonly ItemNavAdmin[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/admin/consultas", label: "Consultas", icon: MessagesSquare },
  { href: "/admin/tasaciones", label: "Tasaciones", icon: Calculator },
  {
    href: "/admin/administraciones",
    label: "Administraciones",
    icon: ClipboardList,
  },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
] as const;
