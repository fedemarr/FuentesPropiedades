import type { NextAuthConfig } from "next-auth";

// Config "edge-safe": sin providers ni nada que toque Prisma/bcrypt. Es la
// que usa el middleware (corre en el Edge Runtime, donde `pg` no funciona
// porque necesita sockets TCP nativos de Node). El provider de Credentials
// con acceso a la base vive en src/auth.ts, que solo se importa desde el
// route handler y las Server Actions/Server Components.
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas, como pide el prompt
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.nombre;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
