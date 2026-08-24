import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CalendarDays, CheckCircle2, Clock, MapPin, ShieldCheck, UserRound, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin/eventi/$code")({ component: AdminEventoDettaglio });

type Status = "proposto" | "confermato" | "non_preso";
type Member = { collaboratorId: string; role: string; isTeamLeader: boolean; proposalStatus: Status };

function AdminEventoDettaglio() {
  const { code } = Route.useParams();
  const { events, collaborators, setProposalStatus, setTeamLeaderForEvent } = useDemo();
  const event = events.find((item) => item.code === code);

  if (!event) {
    return <AppShell area="admin" title="Evento" back="/admin/eventi"><section className="px-3 pt-6"><p className="text-sm text-muted-foreground">Evento non trovato.</p></section></AppShell>;
  }

  const team = (event.team || []) as Member[];
  const proposti = team.filter((member) => member.proposalStatus === "proposto");
  const confermati = team.filter((member) => member.proposalStatus === "confermato");
  const nonPresi = team.filter((member) => member.proposalStatus === "non_preso");

  return (
    <AppShell area="admin" title="Scheda evento" back="/admin/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Ufficio · gestione evento</p>
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="mt-1 font-serif text-3xl text-primary">{event.name}</h2><p className="mt-1 text-sm text-muted-foreground">{event.type}</p></div>
          <StatusTag status={event.status} />
        </div>
      </section>
      <section className="mt-6 px-3"><div className="grid grid-cols-2 gap-2"><Info icon={CalendarDays} label="Data" value={event.date} /><Info icon={Clock} label="Orario" value={`${event.timeStart}–${event.timeEnd}`} /><Info icon={MapPin} label="Luogo" value={event.place} /><Info icon={UserRound} label="Stato" value={<StatusTag status={event.status} />} /></div></section>
      <section className="mt-7 px-3"><SectionTitle>Proposti</SectionTitle><p className="mb-2 text-xs text-muted-foreground">Collaboratori proposti per l’evento: qui puoi confermarli, non prenderli o assegnare il ruolo TL.</p><TeamList members={proposti} collaborators={collaborators} onStatus={(id, status) => setProposalStatus(event.code, id, status)} onTL={(id, value) => setTeamLeaderForEvent(event.code, id, value)} empty="Nessun collaboratore proposto." /></section>
      <section className="mt-7 px-3"><SectionTitle>Confermati</SectionTitle><p className="mb-2 text-xs text-muted-foreground">Questa lista, inclusi ruolo e TL, è visibile anche ai collaboratori nell’evento.</p><TeamList members={confermati} collaborators={collaborators} onStatus={(id, status) => setProposalStatus(event.code, id, status)} onTL={(id, value) => setTeamLeaderForEvent(event.code, id, value)} empty="Nessun collaboratore confermato." /></section>
      <section className="mt-7 px-3"><SectionTitle>Non presi</SectionTitle><TeamList members={nonPresi} collaborators={collaborators} onStatus={(id, status) => setProposalStatus(event.code, id, status)} onTL={(id, value) => setTeamLeaderForEvent(event.code, id, value)} empty="Nessun collaboratore non preso." /></section>
    </AppShell>
  );
}

function TeamList({ members, collaborators, onStatus, onTL, empty }: { members: Member[]; collaborators: any[]; onStatus: (id: string, status: Status) => void; onTL: (id: string, value: boolean) => void; empty: string }) {
  if (!members.length) return <p className="border border-border bg-surface p-3 text-sm text-muted-foreground">{empty}</p>;
  return <ul className="border-t border-border">{members.map((member) => { const person = collaborators.find((c) => c.id === member.collaboratorId); if (!person) return null; return <li key={member.collaboratorId} className="border-b border-border py-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm text-foreground">{person.name}</p>{member.isTeamLeader && <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent"><ShieldCheck className="h-3.5 w-3.5" /> TL</span>}</div><p className="text-xs text-muted-foreground">{member.role}</p></div><span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{member.proposalStatus.replace("_", " ")}</span></div><div className="mt-2 flex flex-wrap gap-2">{member.proposalStatus !== "confermato" && <button onClick={() => onStatus(member.collaboratorId, "confermato")} className="inline-flex items-center gap-1 rounded-full border border-primary bg-primary px-2 py-1 text-xs font-semibold text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Conferma</button>}{member.proposalStatus !== "non_preso" && <button onClick={() => onStatus(member.collaboratorId, "non_preso")} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground"><XCircle className="h-3.5 w-3.5" /> Non preso</button>}{member.proposalStatus !== "confermato" && <button onClick={() => onTL(member.collaboratorId, !member.isTeamLeader)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${member.isTeamLeader ? "border-accent bg-accent text-white" : "border-border bg-surface text-foreground"}`}><ShieldCheck className="h-3.5 w-3.5" /> {member.isTeamLeader ? "Togli TL" : "Assegna TL"}</button>}{member.proposalStatus === "confermato" && <><button onClick={() => onTL(member.collaboratorId, !member.isTeamLeader)} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${member.isTeamLeader ? "border-accent bg-accent text-white" : "border-border bg-surface text-foreground"}`}><ShieldCheck className="h-3.5 w-3.5" /> {member.isTeamLeader ? "Togli TL" : "Assegna TL"}</button><button onClick={() => onStatus(member.collaboratorId, "proposto")} className="rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground">Riporta tra i proposti</button></>}</div></li>; })}</ul>;
}
function Info({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: React.ReactNode }) { return <div className="border border-border bg-surface p-3"><Icon className="h-4 w-4 text-primary" strokeWidth={1.5} /><p className="eyebrow mt-2 text-xs text-muted-foreground">{label}</p><div className="mt-1 text-sm text-foreground">{value}</div></div>; }
