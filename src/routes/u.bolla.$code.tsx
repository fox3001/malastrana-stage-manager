import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button, DemoNote, Field, SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/bolla/$code")({
  head: () => ({
    meta: [
      { title: "Bolla di carico — Malastrana" },
      {
        name: "description",
        content:
          "Bolla di carico dimostrativa: check presenza, resi, danni e note per ogni voce.",
      },
      { property: "og:title", content: "Bolla di carico — Malastrana" },
      {
        property: "og:description",
        content: "Checklist materiali del prototipo Malastrana.",
      },
    ],
  }),
  component: BollaPage,
});

function BollaPage() {
  const { code } = Route.useParams();
  const { events, load, updateLoadRow, timeline } = useDemo();
  const event = events.find((e) => e.code === code);

  const done = load.filter((r) => r.present).length;

  return (
    <AppShell area="user" title="Bolla di carico" back="/u/eventi">
      <section className="border-b border-border bg-surface px-4 py-6">
        <p className="eyebrow text-primary">Documento di scena</p>
        <h2 className="mt-2 font-serif text-2xl text-foreground">
          {event ? event.name : "Evento demo"}
        </h2>
        <div className="mt-4">
          <Field label="Codice">{code}</Field>
          <Field label="Data">{event ? formatDate(event.date) : "—"}</Field>
          <Field label="Luogo">{event?.place ?? "—"}</Field>
          <Field label="Stato check">
            {done} / {load.length} voci verificate
          </Field>
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Materiale assegnato</SectionTitle>
        <ul className="border-t border-border">
          {load.map((r) => (
            <li key={r.id} className="border-b border-border py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-serif text-base text-foreground">{r.name}</p>
                  <p className="eyebrow mt-0.5 text-muted-foreground">
                    {r.code} · q.tà {r.qty}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Check
                  label="Presente"
                  active={r.present}
                  onClick={() =>
                    updateLoadRow(
                      r.id,
                      { present: !r.present },
                      `${r.name}: presenza ${!r.present ? "confermata" : "annullata"}`,
                    )
                  }
                />
                <Check
                  label="Reso"
                  active={r.returned}
                  onClick={() =>
                    updateLoadRow(
                      r.id,
                      { returned: !r.returned },
                      `${r.name}: reso ${!r.returned ? "registrato" : "annullato"}`,
                    )
                  }
                />
                <Check
                  label="Danneggiato"
                  danger
                  active={r.damaged}
                  onClick={() =>
                    updateLoadRow(
                      r.id,
                      { damaged: !r.damaged },
                      `${r.name}: danno ${!r.damaged ? "segnalato" : "rimosso"}`,
                    )
                  }
                />
              </div>

              <input
                value={r.comment}
                placeholder="Commento (opzionale)"
                onChange={(e) =>
                  updateLoadRow(r.id, { comment: e.target.value }, `${r.name}: nota aggiornata`)
                }
                className="mt-3 min-h-11 w-full border border-border bg-surface px-3 text-sm text-foreground"
              />
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <Button full variant="outline" disabled>
            Invia bolla all’ufficio (non attivo)
          </Button>
        </div>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Cronologia locale</SectionTitle>
        {timeline.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nessuna modifica registrata su questo dispositivo.
          </p>
        ) : (
          <ul className="border-t border-border">
            {timeline.map((t) => (
              <li
                key={t.id}
                className="flex items-start justify-between gap-3 border-b border-border py-2.5"
              >
                <span className="min-w-0 text-sm text-foreground">{t.text}</span>
                <span className="eyebrow shrink-0 pt-0.5 text-muted-foreground">{t.at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}

function Check({
  label,
  active,
  danger,
  onClick,
}: {
  label: string;
  active: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "eyebrow min-h-10 border px-3",
        active
          ? danger
            ? "border-destructive bg-destructive text-primary-foreground"
            : "border-accent bg-accent text-accent-foreground"
          : "border-border-strong bg-surface text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}
