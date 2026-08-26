import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogotipoProps {
  variante?: "claro" | "oscuro";
  matricula?: string;
  className?: string;
}

export function Logotipo({
  variante = "oscuro",
  className,
}: LogotipoProps) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo.png"
        alt="Fuentes Propiedades"
        width={160}
        height={48}
        priority
        className={cn(
          "h-auto w-auto max-h-12",
          variante === "claro" && "brightness-0 invert"
        )}
      />
    </div>
  );
}
