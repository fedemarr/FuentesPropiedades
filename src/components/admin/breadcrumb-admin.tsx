"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { NAV_ADMIN } from "@/lib/admin-nav";

function humanizar(segmento: string): string {
  if (/^[0-9a-f-]{8,}$/i.test(segmento)) return "Detalle";
  return segmento
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function BreadcrumbAdmin() {
  const pathname = usePathname();
  const segmentos = pathname.split("/").filter(Boolean); // ["admin", ...]

  const items: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/admin" },
  ];

  let acumulado = "/admin";
  for (const segmento of segmentos.slice(1)) {
    acumulado += `/${segmento}`;
    const itemNav = NAV_ADMIN.find((n) => n.href === acumulado);
    items.push({ label: itemNav?.label ?? humanizar(segmento), href: acumulado });
  }

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 sm:flex">
      {items.map((item, i) => {
        const esUltimo = i === items.length - 1;
        return (
          <span key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-fp-slate" />}
            {esUltimo ? (
              <span className="text-fp-small font-medium text-fp-ink">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-fp-small text-fp-slate transition-colors hover:text-fp-navy"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
