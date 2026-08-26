import { Heart } from "lucide-react";

export const revalidate = 300;

export default function FavoritosPage() {
  return (
    <section className="flex min-h-screen items-center bg-fp-bone pt-24">
      <div className="fp-container py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fp-red-50">
            <Heart className="h-10 w-10 text-fp-red" />
          </div>
          <h1 className="text-fp-h1 text-fp-ink">Favoritos</h1>
          <p className="text-fp-body text-fp-slate mt-4">
            Próximamente podrás guardar tus propiedades favoritas.
          </p>
        </div>
      </div>
    </section>
  );
}
