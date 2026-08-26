import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administraciones",
  robots: { index: false, follow: false },
};

export default function PaginaAdministraciones() {
  redirect("/admin/consultas?tab=administraciones");
}
