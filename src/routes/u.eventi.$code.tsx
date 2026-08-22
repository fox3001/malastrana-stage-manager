import { createFileRoute, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  Button,
  DemoNote,
  Field,
  LinkButton,
  SectionTitle,
  StatusTag,
} from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { formatDate, type Availability } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/eventi/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Scheda evento ${params.code} — Malastrana` },
      {
        name: "description",
        content:
          "Scheda evento dimostrativa con stato, orari, informazioni operative e azioni locali.",
      },
      { property: "og:title", content: `Scheda evento ${params.code} — Malastrana` },
      {
        property: "og:description",
        content: "Scheda evento del prototipo Malastrana.",
      },
      { property: "og:url", content: `/u/eventi/${params.code}` },
    ],
    links: [{ rel: "canonical", href: `/u/eventi/${params.code}` }],
  }),
  component: SchedaEvento,
});

const CHOICES: Array<{ key: Exclude<Availability, null>; label: string }> = [
  { key: "disponibile", label: "Disponibile" },
  { key: "non_disponibile", label: "Non disponibile" },
  { key: "da_definire", label: "Da definire" },
];

function SchedaEvento() {
  const { code } = Route.useParams();
  const { events, availability, setAvailability, costumes } = useDemo();
  const event = events.find((e) => e.code === code);
  if (!event) throw notFound();

  const answer = availability[event.id] ?? null;
  const cancelled = event.status === "annullato";
  const costume = event.assignment
    ? costumes.find((c) => c.id === event.assignment?.costumeId)
    : undefined;

  return (
    <AppShell area="user" title="Scheda evento" back="/u/eventi">
      <div className="relative">
        {cancelled && (
          <div
            className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-center overflow-hidden"
            aria-hidden="true"
          >
            <span className="-rotate-12 whitespace-nowrap border-y-2 border-destructive/50 px-4 py-2 font-serif text-3xl tracking-[0.12em] text-destructive/30 sm:text-4xl">
              EVENTO ANNULLATO
            </span>
          </div>
        )}

        <header className="border-b border-border bg-surface px-4 py-6">
          <p className="font-serif text-2xl text-primary">{formatDate(event.date)}</p>
          <h2 className="mt-1 font-serif text-2xl leading-tight text-foreground">
            {event.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {event.place} · {event.timeStart}–{event.timeEnd}
          </p>
          <p className="mt-1 font-sans text-[11px] tracking-wider text-muted-foreground/80">
            {event.code}
          </p>
          <div className="mt-3">
            <StatusTag status={event.status} />
          </div>
        </header>

        {cancelled && (
          <div className="mx-3 mt-4 border-l-2 border-destructive bg-surface px-4 py-3">
            <p className="eyebrow text-destructive">Motivo dell’annullamento</p>
            <p className="mt-1 text-sm text-foreground">{event.cancelReason}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Tutte le azioni operative sono disabilitate.
            </p>
          </div>
        )}

        <section className="mt-6 px-3">
          <SectionTitle>Informazioni</SectionTitle>
          <div>
            <Field label="Tematica">{event.theme}</Field>
            <Field label="Tipo evento">{event.type}</Field>
            <Field label="Luogo">{event.place}</Field>
            <Field label="Orari">
              {event.timeStart}–{event.timeEnd}
            </Field>
            <Field label="Durata">{event.duration}</Field>
            <Field label="Info pubbliche">{event.publicInfo}</Field>
          </div>
        </section>

        {event.status === "richiesta" && (
          <section className="mt-8 px-3">
            <SectionTitle>La tua disponibilità</SectionTitle>
            <div className="space-y-2">
              {CHOICES.map((c) => (
                <Button
                  key={c.key}
                  full
                  variant={answer === c.key ? "primary" : "outline"}
                  onClick={() => {
                    setAvailability(event.id, c.key);
                    toast.success(`Stato locale aggiornato: ${c.label.toLowerCase()}`, {
                      description: "Salvato solo su questo dispositivo (prototipo).",
                    });
                  }}
                >
                  {c.label}
                </Button>
              ))}
            </div>
            <p
              className={cn(
                "mt-3 border-l-2 px-3 py-2 text-sm",
                answer ? "border-accent text-foreground" : "border-border text-muted-foreground",
              )}
            >
              {answer
                ? `Risposta registrata localmente: ${
                    CHOICES.find((c) => c.key === answer)?.label
                  }.`
                : "Nessuna risposta registrata su questo dispositivo."}
            </p>
          </section>
        )}

        {event.status === "confermato" && event.assignment && (
          <section className="mt-8 px-3">
            <SectionTitle>Dettagli operativi</SectionTitle>
            <div>
              <Field label="Ruolo">{event.assignment.role}</Field>
              <Field label="Chiamata">{event.assignment.callTime}</Field>
              <Field label="Referente">{event.assignment.referent}</Field>
              <Field label="Istruzioni">{event.assignment.instructions}</Field>
              <Field label="Dress code">{event.assignment.dressCode}</Field>
              <Field label="Costume">
                {costume ? `${costume.name} — ${costume.category}` : "Da assegnare"}
              </Field>
              <Field label="Compenso">{event.assignment.fee}</Field>
            </div>
            <div className="mt-4">
              <LinkButton
                to="/u/bolla/$code"
                params={{ code: event.code }}
                variant="accent"
                full
              >
                Apri bolla di carico
              </LinkButton>
            </div>
          </section>
        )}

        {event.status === "da_definire" && (
          <section className="mt-8 px-3">
            <SectionTitle>Stato</SectionTitle>
            <p className="text-sm text-muted-foreground">
              L’evento è in via di definizione: struttura, ruoli e orari possono
              cambiare. Nessuna azione richiesta al momento.
            </p>
          </section>
        )}

        {cancelled && (
          <section className="mt-8 px-3">
            <SectionTitle>Azioni</SectionTitle>
            <div className="space-y-2">
              <Button full variant="outline" disabled>
                Disponibilità non modificabile
              </Button>
              <Button full variant="outline" disabled>
                Bolla non disponibile
              </Button>
            </div>
          </section>
        )}

        <div className="mt-8 px-3">
          <DemoNote />
        </div>
      </div>
    </AppShell>
  );
}
