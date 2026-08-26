import { cn } from "@/lib/utils";

interface LogotipoProps {
  /** "claro" = blanco sobre navy (nav/footer/login). "oscuro" = navy sobre
   * blanco (fondos claros). */
  variante?: "claro" | "oscuro";
  matricula?: string;
  className?: string;
}

// Todavía no tenemos el archivo de logo real (el prompt lo menciona como
// "provisto" pero no llegó ningún asset a este proyecto). Esta es una
// reconstrucción tipográfica fiel a la descripción de la sección 4.1:
// "FUENTES" en grotesco condensado pesado sobre "P R O P I E D A D E S"
// con tracking abierto, y la matrícula abajo a la derecha. Reemplazar por
// el archivo real (SVG) apenas la cliente lo mande.
export function Logotipo({
  variante = "oscuro",
  matricula = "C.S.M. 0000",
  className,
}: LogotipoProps) {
  const color = variante === "claro" ? "text-fp-white" : "text-fp-navy";
  const colorMatricula = variante === "claro" ? "text-white/60" : "text-fp-slate";

  return (
    <div className={cn("inline-flex flex-col leading-none", color, className)}>
      <span className="font-sans text-2xl font-semibold tracking-tight">
        FUENTES
      </span>
      <span className="mt-0.5 text-[10px] font-semibold tracking-[0.32em]">
        PROPIEDADES
      </span>
      <span className={cn("mt-1 self-end text-[9px] font-medium tracking-wide", colorMatricula)}>
        {matricula}
      </span>
    </div>
  );
}
