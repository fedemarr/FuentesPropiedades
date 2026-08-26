import type { Metadata } from "next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Logotipo } from "@/components/marca/logotipo";
import { FormularioLogin } from "./formulario-login";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function PaginaLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-fp-navy px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logotipo variante="claro" />
        </div>

        <Card className="border-none shadow-fp-lg">
          <CardHeader>
            <h1 className="text-fp-h3 text-fp-navy">Panel de administración</h1>
            <p className="text-fp-small text-fp-slate">
              Ingresá con tu email y contraseña.
            </p>
          </CardHeader>
          <CardContent>
            <FormularioLogin />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-fp-small text-white/50">
          Fuentes Propiedades — uso interno
        </p>
      </div>
    </main>
  );
}
