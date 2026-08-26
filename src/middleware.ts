import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const estaLogueado = !!req.auth?.user;

  const esApiAdmin = pathname.startsWith("/api/admin");
  const esLogin = pathname === "/admin/login";
  const esRutaAdmin = pathname.startsWith("/admin") && !esLogin;

  if (esApiAdmin && !estaLogueado) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (esRutaAdmin && !estaLogueado) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Si ya está logueado y entra a /admin/login, lo mandamos directo al panel.
  if (esLogin && estaLogueado) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
