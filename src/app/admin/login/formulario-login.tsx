"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { iniciarSesion, type EstadoLogin } from "./actions";

const ESTADO_INICIAL: EstadoLogin = {};

export function FormularioLogin() {
  const [estado, accion, enviando] = useActionState(
    iniciarSesion,
    ESTADO_INICIAL,
  );
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <form action={accion} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="tu-email@ejemplo.com"
          required
          disabled={enviando}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={mostrarPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            disabled={enviando}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-fp-slate transition-colors hover:text-fp-navy"
            aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {mostrarPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {estado.error && (
        <p
          role="alert"
          className="rounded-fp-sm border border-fp-error/20 bg-fp-error-50 px-3 py-2 text-fp-small text-fp-error"
        >
          {estado.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={enviando} className="h-11">
        {enviando ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Entrando…
          </>
        ) : (
          "Entrar al panel"
        )}
      </Button>
    </form>
  );
}
