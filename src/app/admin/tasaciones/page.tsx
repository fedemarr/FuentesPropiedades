import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tasaciones",
  robots: { index: false, follow: false },
};

export default function PaginaTasaciones() {
  redirect("/admin/consultas?tab=tasaciones");
}
