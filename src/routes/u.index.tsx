import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  DemoNote,
  EventRow,
  LinkButton,
  SectionTitle,
  StatusTag,
} from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CURRENT_USER, NOTIFICATIONS, formatDate } from "@/data/demo";
import { Boxes, CalendarDays, ClipboardList, Shirt } from "lucide-react";

export const Route = createFileRoute("/u/")({
  head: () => ({
    meta: [
      { title: "Home collaboratore — Malastrana" },
      {
        name: "description",
        content:
          "Prossimo evento, disponibilità da dare ed eventi confermati nel prototipo Malastrana.",
      },
      { property: "og:title", content: "Home collaboratore — Malastrana" },
      {
        property: "og:description",
        content: "Area collaboratore dimostrativa del gestionale Malastrana.",
      },
      { property: "og:url", content: "/u" },
    ],
    links: [{ rel: "canonical", href: "/u" }],
  }),
  component: HomeCollaboratore,
});

const QUICK = [
  { to: "/u/costumi", label: "I miei costumi", icon: Shirt },
  { to: "/u/materiale", label: "Materiale personale", icon: Boxes },
  { to: "/u/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/u/bolla/MAL-261115-01", label: "Bolla di carico", icon: ClipboardList },
];

function HomeCollaboratore() {
  const { events, availability } = useDemo();
  const upcoming = events
    .filter((e) => e.status !== "annullato")
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  const toAnswer = events.filter(
    (e) => e.status === "richiesta" && !availability[e.id],
  );
  const confirmed = events.filter((e) => e.status === "confermato");

  return (
    <AppShell area="user" title="Home" notifications={NOTIFICATIONS.length}>
      <section className="px-3 pt-6">
        <p className="eyebrow text-muted-foreground">Benvenuta</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">
          Ciao, {CURRENT_USER.name.split(" ")[0]?.toUpperCase()}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{CURRENT_USER.role}</p>
      </section>

      {next && (
        <section className="mt-6 px-3">
          <div className="border-y-2 border-primary bg-surface px-4 py-5">
            <p className="eyebrow text-primary">Prossimo evento</p>
            <p className="mt-3 font-serif text-3xl leading-tight text-foreground">
              {formatDate(next.date)}
            </p>
            <h3 className="mt-1 font-serif text-xl text-primary">{next.name}</h3>
            <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <dt className="eyebrow w-16 shrink-0 pt-0.5">Luogo</dt>
                <dd className="min-w-0 text-foreground">{next.place}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="eyebrow w-16 shrink-0 pt-0.5">Orario</dt>
                <dd className="text-foreground">
                  {next.timeStart}–{next.timeEnd}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="eyebrow w-16 shrink-0 pt-0.5">Codice</dt>
                <dd className="text-foreground">{next.code}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <StatusTag status={next.status} />
            </div>
            <div className="mt-5">
              <LinkButton to="/u/eventi/$code" params={{ code: next.code }} full>
                Apri evento
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8 px-3">
        <SectionTitle>Disponibilità da dare</SectionTitle>
        {toAnswer.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">
            Nessuna disponibilità in attesa di risposta.
          </p>
        ) : (
          <div className="border-t border-border">
            {toAnswer.map((e) => (
              <EventRow
                key={e.id}
                to="/u/eventi/$code"
                params={{ code: e.code }}
                date={e.date}
                name={e.name}
                place={e.place}
                time={`${e.timeStart}–${e.timeEnd}`}
                code={e.code}
                status={e.status}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Eventi confermati</SectionTitle>
        {confirmed.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">Nessun evento confermato.</p>
        ) : (
          <div className="border-t border-border">
            {confirmed.map((e) => (
              <EventRow
                key={e.id}
                to="/u/eventi/$code"
                params={{ code: e.code }}
                date={e.date}
                name={e.name}
                place={e.place}
                time={`${e.timeStart}–${e.timeEnd}`}
                code={e.code}
                status={e.status}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 px-3">
        <SectionTitle
          action={
            <Link to="/u/notifiche" className="eyebrow text-accent">
              Tutte
            </Link>
          }
        >
          Notifiche recenti
        </SectionTitle>
        <ul className="border-t border-border">
          {NOTIFICATIONS.slice(0, 3).map((n) => (
            <li
              key={n.id}
              className="flex items-start justify-between gap-3 border-b border-border py-3"
            >
              <span className="min-w-0 text-sm text-foreground">{n.text}</span>
              <span className="eyebrow shrink-0 pt-0.5 text-muted-foreground">
                {n.when}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Accessi rapidi</SectionTitle>
        <ul className="border-t border-border">
          {QUICK.map((q) => {
            const Icon = q.icon;
            return (
              <li key={q.to}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={q.to as any}
                  className="flex min-h-14 items-center gap-3 border-b border-border px-1 text-sm text-foreground active:bg-muted"
                >
                  <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} />
                  <span className="min-w-0 truncate">{q.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
