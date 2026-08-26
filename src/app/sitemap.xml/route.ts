import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://inmbobilariafuentes.vercel.app";

export const dynamic = "force-dynamic";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = new Date().toISOString();

  const staticPages = [
    { url: BASE_URL, priority: "1.0", changefreq: "weekly" },
    { url: `${BASE_URL}/propiedades`, priority: "0.9", changefreq: "daily" },
    { url: `${BASE_URL}/venta`, priority: "0.7", changefreq: "weekly" },
    { url: `${BASE_URL}/alquiler`, priority: "0.7", changefreq: "weekly" },
    { url: `${BASE_URL}/tasaciones`, priority: "0.5", changefreq: "monthly" },
    { url: `${BASE_URL}/administraciones`, priority: "0.5", changefreq: "monthly" },
    { url: `${BASE_URL}/nosotros`, priority: "0.4", changefreq: "monthly" },
    { url: `${BASE_URL}/faq`, priority: "0.4", changefreq: "monthly" },
    { url: `${BASE_URL}/contacto`, priority: "0.5", changefreq: "monthly" },
    { url: `${BASE_URL}/privacidad`, priority: "0.1", changefreq: "yearly" },
  ];

  const propiedades = await prisma.propiedad.findMany({
    where: { publicacion: "PUBLICADA", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p) => `  <url>
    <loc>${escapeXml(p.url)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
${propiedades.map((p) => `  <url>
    <loc>${escapeXml(`${BASE_URL}/propiedades/${p.slug}`)}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
