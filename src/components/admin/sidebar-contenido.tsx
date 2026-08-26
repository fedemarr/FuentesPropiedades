"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Logotipo } from "@/components/marca/logotipo";
import { NAV_ADMIN } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

function esActivo(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarContenido({ onNavegar }: { onNavegar?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-fp-navy">
      <div className="flex h-16 items-center px-6">
        <Link href="/admin" onClick={onNavegar}>
          <Logotipo variante="claro" className="scale-90 origin-left" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ADMIN.map((item) => {
          const activo = esActivo(pathname, item.href);
          const Icono = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavegar}
              className={cn(
                "relative flex items-center gap-3 rounded-fp-sm px-3 py-2.5 text-fp-small font-medium transition-colors",
                activo
                  ? "text-fp-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90",
              )}
            >
              {activo && (
                <motion.span
                  layoutId="admin-nav-activo"
                  className="absolute inset-0 rounded-fp-sm bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icono className="relative size-[18px] shrink-0" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-fp-small text-white/40">Fuentes Propiedades</p>
      </div>
    </div>
  );
}
