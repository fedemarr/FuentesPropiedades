import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { estaLimitado, obtenerIpDeHeaders, registrarIntentoFallido } from "@/lib/rate-limit";

const esquemaCredenciales = z.object({
  email: z.email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

const LIMITE_INTENTOS_LOGIN = 5;
const VENTANA_LOGIN_MS = 15 * 60 * 1000; // 15 minutos

export class IntentosDeLoginExcedidos extends CredentialsSignin {
  override code = "rate_limited";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      // El rate limit vive ACÁ (no en el server action del formulario) para
      // que también cubra un intento directo contra
      // /api/auth/callback/credentials, sin pasar por el formulario.
      async authorize(credentials, request) {
        const clave = `login:${obtenerIpDeHeaders(request.headers)}`;

        if (estaLimitado(clave, LIMITE_INTENTOS_LOGIN)) {
          throw new IntentosDeLoginExcedidos();
        }

        const datos = esquemaCredenciales.safeParse(credentials);
        if (!datos.success) {
          registrarIntentoFallido(clave, VENTANA_LOGIN_MS);
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: datos.data.email },
        });
        if (!usuario) {
          registrarIntentoFallido(clave, VENTANA_LOGIN_MS);
          return null;
        }

        const passwordValida = await bcrypt.compare(
          datos.data.password,
          usuario.password,
        );
        if (!passwordValida) {
          registrarIntentoFallido(clave, VENTANA_LOGIN_MS);
          return null;
        }

        return {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
        };
      },
    }),
  ],
});
