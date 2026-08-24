import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, UserRound, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/eventi/$code")({
  component: AdminEventoDettaglio,
});

function AdminEventoDettaglio() {
  const { code } = Route.useParams();
  const { events, collaborators, setProposalStatus, setTeamLeaderForEvent } = useDemo();
  const event = events.find((item) => item.code === code);

  if (!event) {
    return (
      <AppShell area="admin" title="Evento" back="/admin/eventi">
        <section className="px-3 pt-6"><p className="text-sm text-muted-foreground">Evento non trovato.</p></section>
      </AppShell>
    );
  }

  const team = event.team || [];
  const proposti = team.filter((m) => m.proposalStatus === "proposto");
  const confermati = team.filter((m) => m.proposalStatus === "confermato");
  const nonPresi = team.filter((m) => m.proposalStatus === "non_preso");

  return (
    <AppShell area="admin" title="Evento" back="/admin/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Evento</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mt-1 font-serif text-3xl text-primary">{event.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{event.type}</p>
          </div>
          <StatusTag status={event.status} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <div className="grid grid-cols-2 gap-2">
          <Info icon={CalendarDays} label="Data" value={event.date} />
          <Info icon={Clock} label="Orario" value={`${event.timeStart}–${event.timeEnd}`} />
          <Info icon={MapPin} label="Luogo" value={event.place} />
          <Info icon={UserRound} label="Stato" value={<StatusTag status={event.status} />} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Proposti</SectionTitle>
        {proposti.length === 0 ? (
          <p className="border border-border bg-surface p-3 text-sm text-muted-foreground">Nessun collaboratore proposto.</p>
        ) : (
          <ul className="border-t border-border">
            {proposti.map((member) => {
              const collab = collaborators.find((c) => c.id === member.collaboratorId);
              if (!collab) return null;
              return (
                <li key={member.collaboratorId} className="flex items-center justify-between gap-3 border-b border-border py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{collab.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setProposalStatus(event.code, member.collaboratorId, "confermato")} className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-2 py-1 text-xs font-semibold text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Conferma
                    </button>
                    <button onClick={() => setProposalStatus(event.code, member.collaboratorId, "non_preso")} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground">
                      <XCircle className="h-3.5 w-3.5" /> Non preso
                    </button>
                    <button onClick={() => setTeamLeaderForEvent(event.code, member.collaboratorId, !member.isTeamLeader)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${member.isTeamLeader ? "border-accent bg-accent text-white" : "border-border bg-surface text-foreground"}`}>
                      <ShieldCheck className="h-3.5 w-3.5" /> TL
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Confermati</SectionTitle>
        {confermati.length === 0 ? (
          <p className="border border-border bg-surface p-3 text-sm text-muted-foreground">Nessun collaboratore confermato.</p>
        ) : (
          <ul className="border-t border-border">
            {confermati.map((member) => {
              const collab = collaborators.find((c) => c.id === member.collaboratorId);
              if (!collab) return null;
              return (
                <li key={member.collaboratorId} className="flex items-center justify-between gap-3 border-b border-border py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm text-foreground">{collab.name}</p>
                      {member.isTeamLeader && <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-label="Team Leader" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setProposalStatus(event.code, member.collaboratorId, "proposto")} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground">
                      <XCircle className="h-3.5 w-3.5" /> Rimuovi
                    </button>
                    <button onClick={() => setTeamLeaderForEvent(event.code, member.collaboratorId, !member.isTeamLeader)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${member.isTeamLeader ? "border-accent bg-accent text-white" : "border-border bg-surface text-foreground"}`}>
                      <ShieldCheck className="h-3.5 w-3.5" /> TL
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {nonPresi.length > 0 && (
        <section className="mt-6 px-3">
          <SectionTitle>Non presi</SectionTitle>
          <ul className="border-t border-border">
            {nonPresi.map((member) => {
              const collab = collaborators.find((c) => c.id === member.collaboratorId);
              if (!collab) return null;
              return (
                <li key={member.collaboratorId} className="flex items-center justify-between gap-3 border-b border-border py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{collab.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <button onClick={() => setProposalStatus(event.code, member.collaboratorId, "proposto")} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Riproponi
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: React.ReactNode }) {
  return <div className="border border-border bg-surface p-3"><Icon className="h-4 w-4 text-primary" strokeWidth={1.5} /><p className="eyebrow mt-2 text-xs text-muted-foreground">{label}</p><div className="mt-1 text-sm text-foreground">{value}</div></div>;
}
