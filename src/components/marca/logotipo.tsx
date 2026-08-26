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
        width={240}
        height={72}
        priority
        className="h-auto w-auto max-h-16"
      />
    </div>
  );
}
