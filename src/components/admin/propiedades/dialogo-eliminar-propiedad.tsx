import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { FilaPropiedad } from "./tabla-propiedades";

interface DialogoEliminarPropiedadProps {
  propiedad: FilaPropiedad | null;
  pendiente: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export function DialogoEliminarPropiedad({
  propiedad,
  pendiente,
  onCancelar,
  onConfirmar,
}: DialogoEliminarPropiedadProps) {
  return (
    <AlertDialog open={propiedad !== null} onOpenChange={(abierto) => !abierto && onCancelar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta propiedad?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Se va a eliminar <strong className="text-fp-ink">{propiedad?.titulo}</strong>{" "}
                ({propiedad?.codigo}). Va a dejar de verse en el sitio y en esta lista.
              </p>
              <p>
                No se borra para siempre — si te equivocás, pedime que la recupere de la
                base de datos.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pendiente}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={pendiente}
            onClick={(e) => {
              e.preventDefault();
              onConfirmar();
            }}
            className="bg-fp-error text-white hover:bg-fp-error/90"
          >
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
