import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable", // fuente variable: el peso 400–600 se controla por CSS
  style: ["normal", "italic"],
  axes: ["opsz"], // activa el eje óptico variable pedido en el prompt
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fuentes Propiedades — Venta, alquiler y administración",
    template: "%s — Fuentes Propiedades",
  },
  description:
    "Martillera pública matriculada en zona norte del GBA. Venta, alquiler y administración de propiedades en San Miguel, Bella Vista, Muñiz, Los Polvorines y alrededores.",
  keywords: [
    "inmobiliaria",
    "propiedades",
    "San Miguel",
    "Bella Vista",
    "Muñiz",
    "Los Polvorines",
    "zona norte GBA",
    "venta",
    "alquiler",
    "administración de propiedades",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
