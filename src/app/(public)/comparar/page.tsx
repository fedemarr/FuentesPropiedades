import { GitCompareArrows } from "lucide-react";

export const revalidate = 300;

export default function CompararPage() {
  return (
    <section className="flex min-h-screen items-center bg-fp-bone pt-24">
      <div className="fp-container py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-fp-navy/10">
            <GitCompareArrows className="h-10 w-10 text-fp-navy" />
          </div>
          <h1 className="text-fp-h1 text-fp-ink">Comparar</h1>
          <p className="text-fp-body text-fp-slate mt-4">
            Próximamente podrás comparar propiedades lado a lado.
          </p>
        </div>
      </div>
    </section>
  );
}
