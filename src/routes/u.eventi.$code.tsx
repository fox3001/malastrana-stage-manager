import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, ShieldCheck, UserRound, XCircle } from "lucide-react";

export const Route = createFileRoute("/u/eventi/$code")({
  component: EventoUtenteDettaglio,
});

function EventoUtenteDettaglio() {
  const { code } = Route.useParams();
  const { events, collaborators, availability, setAvailabilityResponse } = useDemo();
  const event = events.find((item) => item.code === code);
  const currentUser = collaborators.find((c) => c.id === "col-elena") || collaborators[0];

  if (!event || !currentUser) {
    return (
      <AppShell area="u" title="Evento" back="/u/eventi">
        <section className="px-3 pt-6"><p className="text-sm text-muted-foreground">Evento non trovato.</p></section>
      </AppShell>
    );
  }

  const team = event.team || [];
  const teamMember = team.find((member) => member.collaboratorId === currentUser.id);
  const isTeamLeader = Boolean(teamMember?.isTeamLeader);
  const response = availability[event.id];
  const canRespond = event.status === "richiesta" || event.status === "da_definire";

  const confermati = team.filter((m) => m.proposalStatus === "confermato");

  return (
    <AppShell area="u" title="Evento" back="/u/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Evento</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="mt-1 font-serif text-3xl text-primary">{event.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{event.type}</p>
          </div>
          <StatusTag status={event.status} />
        </div>
        {isTeamLeader && (
          <div className="mt-3 inline-flex items-center gap-2 border border-accent bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" /> Team Leader
          </div>
        )}
      </section>

      <section className="mt-6 px-3">
        <div className="grid grid-cols-2 gap-2">
          <Info icon={CalendarDays} label="Data" value={event.date} />
          <Info icon={Clock} label="Orario" value={`${event.timeStart}–${event.timeEnd}`} />
          <Info icon={MapPin} label="Luogo" value={event.place} />
          <Info icon={UserRound} label="Stato" value={<StatusTag status={event.status} />} />
        </div>
      </section>

      {canRespond && (
        <section className="mt-6 px-3">
          <SectionTitle>La tua disponibilità</SectionTitle>
          <div className="border border-border bg-surface p-4">
            {response ? (
              <p className="flex items-center gap-2 text-sm text-foreground">
                {response === "disponibile" || response === "yes" ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
                Risposta registrata: <strong>{response.replace("_", " ")}</strong>
              </p>
            ) : (
              <div>
                <p className="text-sm text-foreground">Puoi partecipare a questo evento?</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setAvailabilityResponse(event.id, "disponibile")} className="inline-flex min-h-9 items-center gap-2 border border-primary bg-primary px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                    <CheckCircle2 className="h-4 w-4" /> Disponibile
                  </button>
                  <button onClick={() => setAvailabilityResponse(event.id, "non_disponibile")} className="inline-flex min-h-9 items-center gap-2 border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                    <XCircle className="h-4 w-4" /> Non disponibile
                  </button>
                  <button onClick={() => setAvailabilityResponse(event.id, "da_definire")} className="inline-flex min-h-9 items-center border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                    Da definire
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {teamMember && (
        <section className="mt-6 px-3">
          <SectionTitle>La tua convocazione</SectionTitle>
          <div className="border border-border bg-surface p-4">
            <p className="eyebrow text-muted-foreground">Ruolo</p>
            <p className="mt-1 text-sm text-foreground">{teamMember.role}</p>
            {event.assignment?.callTime && <><p className="eyebrow mt-4 text-muted-foreground">Convocazione</p><p className="mt-1 text-sm text-foreground">{event.assignment.callTime}</p></>}
            {event.assignment?.dressCode && <><p className="eyebrow mt-4 text-muted-foreground">Abbigliamento</p><p className="mt-1 text-sm text-foreground">{event.assignment.dressCode}</p></>}
            {event.assignment?.instructions && <><p className="eyebrow mt-4 text-muted-foreground">Istruzioni</p><p className="mt-1 text-sm text-foreground">{event.assignment.instructions}</p></>}
          </div>
        </section>
      )}

      {confermati.length > 0 && (
        <section className="mt-6 px-3">
          <SectionTitle>Team confermato</SectionTitle>
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
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {event.contactName && (
        <section className="mt-6 px-3">
          <SectionTitle>Contatto in location</SectionTitle>
          <div className="border border-border bg-surface p-4">
            <p className="text-sm text-foreground">{event.contactName}</p>
            {event.contactPhone && <a href={`tel:${event.contactPhone}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent"><Phone className="h-4 w-4" /> {event.contactPhone}</a>}
          </div>
        </section>
      )}

      <section className="mt-6 px-3">
        <SectionTitle>Informazioni evento</SectionTitle>
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">{event.publicInfo}</p>
        </div>
      </section>

      {isTeamLeader && (
        <section className="mt-6 px-3">
          <Link to="/u/bolla/$code" params={{ code: event.code }} className="inline-flex min-h-10 items-center border border-primary bg-primary px-4 text-xs font-semibold uppercase tracking-[0.08em] text-white">
            Apri controllo bolla
          </Link>
        </section>
      )}
    </AppShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: React.ReactNode }) {
  return <div className="border border-border bg-surface p-3"><Icon className="h-4 w-4 text-primary" strokeWidth={1.5} /><p className="eyebrow mt-2 text-xs text-muted-foreground">{label}</p><div className="mt-1 text-sm text-foreground">{value}</div></div>;
}
