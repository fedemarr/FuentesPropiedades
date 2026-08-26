"use server";

import { AuthError } from "next-auth";
import { IntentosDeLoginExcedidos, signIn } from "@/auth";
import { esquemaLogin } from "./schema";

export interface EstadoLogin {
  error?: string;
}

export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const datos = esquemaLogin.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!datos.success) {
    return { error: "Revisá el email y la contraseña." };
  }

  try {
    await signIn("credentials", {
      email: datos.data.email,
      password: datos.data.password,
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof IntentosDeLoginExcedidos) {
      return {
        error: "Demasiados intentos fallidos. Probá de nuevo en unos minutos.",
      };
    }
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos." };
    }
    // NEXT_REDIRECT (login exitoso) y cualquier otro error real se propagan.
    throw error;
  }
}
