import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DemoNote, EventRow, SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS, NOTIFICATIONS } from "@/data/demo";
import { CalendarDays, Search, Shirt, Users } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Home admin — Malastrana" },
      {
        name: "description",
        content:
          "Quadro di regia dimostrativo: eventi in preparazione, collaboratori e moduli del gestionale Malastrana.",
      },
      { property: "og:title", content: "Home admin — Malastrana" },
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
  { to: "/admin/collaboratori", label: "Collaboratori", icon: Users },
  { to: "/admin/costumi", label: "Ricerca costumi", icon: Search },
  { to: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/admin/altro", label: "Altri moduli", icon: Shirt },
];

function AdminHome() {
  const { events } = useDemo();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const daDefinire = events.filter((e) => e.status === "da_definire").length;
  const richieste = events.filter((e) => e.status === "richiesta").length;

  return (
    <AppShell area="admin" title="Regia" notifications={NOTIFICATIONS.length}>
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Quadro di regia</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Organizzazione</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista dimostrativa: nessun dato reale, nessun permesso attivo.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-3 gap-2 px-3">
        <Stat label="Eventi" value={events.length} />
        <Stat label="Disponibilità" value={richieste} />
        <Stat label="Da definire" value={daDefinire} />
      </section>

      <section className="mt-8 px-3">
        <SectionTitle
          action={
            <Link to="/admin/eventi" className="eyebrow text-accent">
              Tutti
            </Link>
          }
        >
          Eventi in preparazione
        </SectionTitle>
        <div className="border-t border-border">
          {sorted.slice(0, 3).map((e) => (
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
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Collaboratori</SectionTitle>
        <ul className="border-t border-border">
          {COLLABORATORS.slice(0, 4).map((c) => (
            <li key={c.id}>
              <Link
                to="/admin/collaboratori/$id"
                params={{ id: c.id }}
                className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {c.role}
                  </span>
                </span>
                <span className="eyebrow shrink-0 text-accent">{c.state}</span>
              </Link>
            </li>
          ))}
        </ul>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-surface px-3 py-4 text-center">
      <p className="font-serif text-2xl text-primary">{value}</p>
      <p className="eyebrow mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
