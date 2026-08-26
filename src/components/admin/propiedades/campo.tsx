import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CampoProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  requerido?: boolean;
  children: ReactNode;
  className?: string;
}

/** Wrapper de campo consistente: label + control + hint/error. Se usa en
 * todas las secciones del formulario de propiedad en vez de repetir el
 * mismo layout a mano en cada campo. */
export function Campo({
  label,
  htmlFor,
  error,
  hint,
  requerido,
  children,
  className,
}: CampoProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {requerido && <span className="text-fp-red"> *</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-fp-small text-fp-error">{error}</p>
      ) : hint ? (
        <p className="text-fp-small text-fp-slate">{hint}</p>
      ) : null}
    </div>
  );
}
