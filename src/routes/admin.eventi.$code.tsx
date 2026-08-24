import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/eventi/$code")({
  component: AdminEventDetail,
});

function AdminEventDetail() {
  const { code } = Route.useParams();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <Link to="/admin/eventi" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Torna agli eventi
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl text-primary">Evento {code}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Dettagli evento (work in progress)</p>
      </header>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Sezione animatori proposti/confermati in arrivo.</p>
      </section>
    </main>
  );
}
