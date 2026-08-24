import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS } from "@/data/demo";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/admin/eventi/$code")({
  component: EventoDettaglio,
});

function EventoDettaglio() {
  const { code } = Route.useParams();
  const { events } = useDemo();
  const event = events.find((e) => e.code === code);

  if (!event) {
    return (
      <AppShell area="admin" title="Evento">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">Evento non trovato.</p>
          <Link to="/admin/eventi" className="eyebrow text-accent">
            Torna alla lista
          </Link>
        </section>
      </AppShell>
    );
  }

  const team = COLLABORATORS.slice(0, 3);

  return (
    <AppShell area="admin" title="Evento" back="/admin/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Dettaglio</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">{event.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Codice: {event.code}</p>
      </section>

      <section className="mt-6 px-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon={CalendarDays} label="Data" value={event.date} />
          <InfoCard icon={Clock} label="Orari" value={`${event.timeStart}–${event.timeEnd}`} />
          <InfoCard icon={MapPin} label="Luogo" value={event.place} />
          <InfoCard icon={Users} label="Stato" value={<StatusTag status={event.status} />} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Team assegnato</SectionTitle>
        <ul className="border-t border-border">
          {team.map((c) => (
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

      <section className="mt-6 px-3">
        <SectionTitle>Materiale previsto</SectionTitle>
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Assegnazione costumi e materiali in arrivo (collegata a bolle di carico).
          </p>
          <Link
            to="/admin/costumi"
            className="mt-3 inline-flex min-h-9 items-center border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            Vai a Costumi
          </Link>
        </div>
      </section>
    </AppShell>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-surface p-3">
      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
      <p className="mt-2 eyebrow text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}
