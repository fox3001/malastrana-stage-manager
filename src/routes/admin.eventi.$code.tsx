import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Avatar,
  Button,
  DemoNote,
  Field,
  SectionTitle,
  StatusTag,
} from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS, formatDate } from "@/data/demo";

export const Route = createFileRoute("/admin/eventi/$code")({
  head: () => ({
    meta: [
      { title: "Scheda evento — Regia Malastrana" },
      {
        name: "description",
        content:
          "Scheda evento lato organizzazione: cast, disponibilità e materiale nel prototipo Malastrana.",
      },
      { property: "og:title", content: "Scheda evento — Regia Malastrana" },
      {
        property: "og:description",
        content: "Dettaglio evento dimostrativo lato admin.",
      },
    ],
  }),
  component: AdminEventoDetail,
});

function AdminEventoDetail() {
  const { code } = Route.useParams();
  const { events, load } = useDemo();
  const event = events.find((e) => e.code === code);

  if (!event) {
    return (
      <AppShell area="admin" title="Evento" back="/admin/eventi">
        <p className="px-3 py-10 text-sm text-muted-foreground">
          Evento non trovato tra i dati dimostrativi.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell area="admin" title={event.name} back="/admin/eventi">
      <section className="border-b border-border bg-surface px-4 py-6">
        <p className="eyebrow text-accent">{event.code}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-primary">
          {event.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{formatDate(event.date)}</p>
        <div className="mt-4">
          <StatusTag status={event.status} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Dati evento</SectionTitle>
        <div>
          <Field label="Luogo">{event.place}</Field>
          <Field label="Orario">
            {event.timeStart}–{event.timeEnd}
          </Field>
          <Field label="Durata">{event.duration}</Field>
          <Field label="Tipologia">{event.type}</Field>
          <Field label="Tema">{event.theme}</Field>
          <Field label="Descrizione">{event.publicInfo}</Field>
          {event.cancelReason && <Field label="Motivo">{event.cancelReason}</Field>}
        </div>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Cast e disponibilità</SectionTitle>
        <ul className="border-t border-border">
          {COLLABORATORS.map((c, i) => (
            <li key={c.id}>
              <Link
                to="/admin/collaboratori/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 border-b border-border py-3 active:bg-muted"
              >
                <Avatar name={c.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.role}
                  </span>
                </span>
                <span className="eyebrow shrink-0 text-accent">
                  {["Disponibile", "In attesa", "Da definire", "Non disponibile"][i % 4]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Le risposte mostrate sono dimostrative e non provengono da un database.
        </p>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Materiale previsto</SectionTitle>
        <ul className="border-t border-border">
          {load.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 border-b border-border py-3"
            >
              <span className="min-w-0 truncate text-sm text-foreground">{r.name}</span>
              <span className="eyebrow shrink-0 text-muted-foreground">
                {r.code} · {r.qty}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 space-y-2">
          <Button full variant="outline" disabled>
            Invia richiesta disponibilità (non attivo)
          </Button>
          <Button full variant="danger" disabled>
            Annulla evento (non attivo)
          </Button>
        </div>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
