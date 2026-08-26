import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

// Augmenta los tipos de NextAuth v5 con los campos propios del Usuario
// (un solo rol ADMIN, sin distinción de permisos — ver sección 8.7).
declare module "next-auth" {
  interface User {
    id: string;
    nombre: string;
  }

  interface Session {
    user: {
      id: string;
      nombre: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    nombre: string;
  }
}
