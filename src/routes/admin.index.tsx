import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DemoNote, EventRow, SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS, NOTIFICATIONS } from "@/data/demo";
import {
  AlertTriangle,
  BellRing,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  PackageSearch,
  Search,
  Shirt,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard admin — Malastrana" },
      {
        name: "description",
        content:
          "Quadro di regia operativo: priorità, eventi, disponibilità, collaboratori e controllo materiale nel gestionale Malastrana.",
      },
      { property: "og:title", content: "Dashboard admin — Malastrana" },
      {
        property: "og:description",
        content: "Area organizzazione dimostrativa del gestionale Malastrana.",
      },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminHome,
});

const SHORTCUTS = [
  { to: "/admin/eventi", label: "Gestisci eventi", icon: CalendarDays },
  { to: "/admin/collaboratori", label: "Collaboratori", icon: Users },
  { to: "/admin/costumi", label: "Ricerca costumi", icon: Search },
  { to: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/admin/altro", label: "Magazzino e moduli", icon: Boxes },
];

function AdminHome() {
  const { events, availability, costumes, gear } = useDemo();
  const sorted = [...events]
    .filter((e) => e.status !== "annullato")
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextEvents = sorted.slice(0, 3);
  const requests = events.filter((e) => e.status === "richiesta");
  const daDefinire = events.filter((e) => e.status === "da_definire");
  const confirmed = events.filter((e) => e.status === "confermato");
  const unanswered = requests.filter((event) => !availability[event.id]);
  const collaboratorsToCheck = COLLABORATORS.filter(
    (collaborator) => collaborator.state !== "disponibile",
  );
  const inventoryTotal = costumes.length + gear.length;
  const priorityCount = unanswered.length + daDefinire.length + collaboratorsToCheck.length;

  return (
    <AppShell area="admin" title="Regia" notifications={NOTIFICATIONS.length}>
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Quadro di regia</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Organizzazione</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Priorità, convocazioni e controllo operativo in un solo punto.
        </p>
      </section>

      <section className="mt-6 px-3">
        <div className="border-y-2 border-primary bg-surface px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-primary p-2 text-white">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-primary">Azioni da gestire</p>
              <p className="mt-1 font-serif text-2xl text-foreground">
                {priorityCount} priorità aperte
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {unanswered.length} disponibilità senza risposta · {daDefinire.length} eventi da definire · {collaboratorsToCheck.length} stati da verificare
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/admin/eventi"
              className="inline-flex min-h-9 items-center border border-primary bg-primary px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              Apri eventi
            </Link>
            <Link
              to="/admin/collaboratori"
              className="inline-flex min-h-9 items-center border border-border-strong bg-surface px-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
            >
              Verifica persone
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-2 px-3 sm:grid-cols-4">
        <Stat label="Eventi attivi" value={sorted.length} icon={CalendarDays} />
        <Stat label="Da rispondere" value={unanswered.length} icon={BellRing} tone="accent" />
        <Stat label="Confermati" value={confirmed.length} icon={CheckCircle2} />
        <Stat label="Inventario" value={inventoryTotal} icon={PackageSearch} />
      </section>

      <section className="mt-8 px-3">
        <SectionTitle
          action={
            <Link to="/admin/eventi" className="eyebrow text-accent">
              Tutti
            </Link>
          }
        >
          Eventi imminenti
        </SectionTitle>
        {nextEvents.length === 0 ? (
          <p className="border-t border-border py-3 text-sm text-muted-foreground">
            Nessun evento attivo in calendario.
          </p>
        ) : (
          <div className="border-t border-border">
            {nextEvents.map((e) => (
              <EventRow
                key={e.id}
                to="/admin/eventi/$code"
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
            <Link to="/admin/eventi" className="eyebrow text-accent">
              Gestisci
            </Link>
          }
        >
          Disponibilità da sollecitare
        </SectionTitle>
        {unanswered.length === 0 ? (
          <div className="border-y border-border py-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Nessuna risposta in sospeso.
            </p>
          </div>
        ) : (
          <ul className="border-t border-border">
            {unanswered.slice(0, 3).map((e) => (
              <li key={e.id} className="border-b border-border py-3">
                <Link
                  to="/admin/eventi/$code"
                  params={{ code: e.code }}
                  className="flex items-center justify-between gap-3 active:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">{e.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {e.place} · {e.timeStart}–{e.timeEnd}
                    </span>
                  </span>
                  <StatusTag status={e.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 px-3">
        <SectionTitle
          action={
            <Link to="/admin/collaboratori" className="eyebrow text-accent">
              Vedi tutti
            </Link>
          }
        >
          Stato collaboratori
        </SectionTitle>
        <ul className="border-t border-border">
          {COLLABORATORS.slice(0, 5).map((c) => (
            <li key={c.id}>
              <Link
                to="/admin/collaboratori/$id"
                params={{ id: c.id }}
                className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.role}</span>
                </span>
                <span className="eyebrow shrink-0 text-accent">{c.state}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Controllo materiale</SectionTitle>
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
          <Link
            to="/admin/costumi"
            className="border border-border bg-surface p-3 active:bg-muted"
          >
            <Shirt className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <p className="mt-3 font-serif text-2xl text-primary">{costumes.length}</p>
            <p className="eyebrow mt-1 text-muted-foreground">Costumi</p>
          </Link>
          <Link
            to="/admin/altro"
            className="border border-border bg-surface p-3 active:bg-muted"
          >
            <ClipboardList className="h-5 w-5 text-accent" strokeWidth={1.5} />
            <p className="mt-3 font-serif text-2xl text-primary">{gear.length}</p>
            <p className="eyebrow mt-1 text-muted-foreground">Materiali</p>
          </Link>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Inventario demo locale: le assegnazioni e le anomalie saranno collegate alle bolle di carico.
        </p>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Accessi rapidi</SectionTitle>
        <ul className="border-t border-border">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.to}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={s.to as any}
                  className="flex min-h-14 items-center gap-3 border-b border-border px-1 text-sm text-foreground active:bg-muted"
                >
                  <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} />
                  <span className="min-w-0 truncate">{s.label}</span>
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

function Stat({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: number;
  icon: typeof CalendarDays;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="border border-border bg-surface px-3 py-3">
      <Icon className={`h-4 w-4 ${tone === "accent" ? "text-accent" : "text-primary"}`} strokeWidth={1.5} />
      <p className="mt-2 font-serif text-2xl text-primary">{value}</p>
      <p className="eyebrow mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
