import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { COLLABORATORS } from "@/data/demo";

export const Route = createFileRoute("/admin/collaboratori/$id")({
  component: CollaboratoreDettaglio,
});

function CollaboratoreDettaglio() {
  const { id } = Route.useParams();
  const collaborator = COLLABORATORS.find((c) => c.id === id);

  if (!collaborator) {
    return (
      <AppShell area="admin" title="Collaboratore">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">Collaboratore non trovato.</p>
          <Link to="/admin/collaboratori" className="eyebrow text-accent">
            Torna alla lista
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell area="admin" title="Collaboratore" back="/admin/collaboratori">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Scheda collaboratore</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">{collaborator.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{collaborator.role}</p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle
          action={
            <Link to="/admin/collaboratori/$id/disponibilita" params={{ id }} className="eyebrow text-accent">
              Apri
            </Link>
          }
        >
          Disponibilità
        </SectionTitle>
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Gestisci le disponibilità di {collaborator.name} per tutti gli eventi.
          </p>
          <Link
            to="/admin/collaboratori/$id/disponibilita"
            params={{ id }}
            className="mt-3 inline-flex min-h-9 items-center border border-primary bg-primary px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
          >
            Vai a Disponibilità
          </Link>
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Note</SectionTitle>
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Note e dettagli aggiuntivi sul collaboratore (da implementare).
          </p>
        </div>
      </section>
    </AppShell>
  );
}
