import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CheckCircle2, CircleAlert, Mail, Phone, Plus, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/u/profilo")({
  component: ProfiloUtente,
});

function ProfiloUtente() {
  const { collaborators, updateCollaborator, addSkillToCollaborator, proposeSkill } = useDemo();
  const currentUser = collaborators.find((c) => c.id === "col-elena") || collaborators[0];
  const [newSkill, setNewSkill] = useState("");
  const [proposedSkill, setProposedSkill] = useState("");

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    collaborators.forEach((collaborator) => collaborator.skillsDetail.forEach((skill) => skills.add(skill.name)));
    return [...skills].sort();
  }, [collaborators]);

  if (!currentUser) return null;

  const addExistingSkill = () => {
    if (!newSkill) return;
    addSkillToCollaborator(currentUser.id, newSkill);
    setNewSkill("");
  };

  const addProposedSkill = () => {
    if (!proposedSkill.trim()) return;
    proposeSkill(currentUser.id, proposedSkill);
    setProposedSkill("");
  };

  return (
    <AppShell area="u" title="Profilo" back="/u">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Area personale</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Il mio profilo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggiorna i tuoi dati e indica le competenze che l’ufficio può verificare.
        </p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Dati personali</SectionTitle>
        <div className="grid gap-3 border-t border-border pt-3">
          <Field icon={UserRound} label="Nome e cognome">
            <input value={currentUser.name} disabled className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground" />
          </Field>
          <Field icon={UserRound} label="Ruolo">
            <input
              value={currentUser.role}
              onChange={(e) => updateCollaborator(currentUser.id, { role: e.target.value })}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <Field icon={Phone} label="Telefono">
            <input
              value={currentUser.phone || ""}
              onChange={(e) => updateCollaborator(currentUser.id, { phone: e.target.value })}
              placeholder="Inserisci il numero di telefono"
              inputMode="tel"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <Field icon={Mail} label="Email">
            <input
              value={currentUser.email || ""}
              onChange={(e) => updateCollaborator(currentUser.id, { email: e.target.value })}
              placeholder="Inserisci l’email"
              inputMode="email"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <Field icon={UserRound} label="Presentazione">
            <textarea
              value={currentUser.bio}
              onChange={(e) => updateCollaborator(currentUser.id, { bio: e.target.value })}
              className="min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
        </div>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Le mie competenze</SectionTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Le competenze diventano utilizzabili per le assegnazioni dopo la verifica dell’ufficio.
        </p>
        <ul className="mt-3 border-t border-border">
          {currentUser.skillsDetail.map((skill) => (
            <li key={skill.name} className="flex items-center justify-between gap-3 border-b border-border py-3">
              <span className="text-sm text-foreground">{skill.name}</span>
              {skill.status === "verificata" ? (
                <span className="flex items-center gap-1 text-xs font-medium text-accent">
                  <CheckCircle2 className="h-4 w-4" /> Verificata
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CircleAlert className="h-4 w-4" /> In verifica
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Aggiungi una competenza</SectionTitle>
        <div className="mt-3 flex gap-2">
          <select
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Scegli dall’elenco…</option>
            {availableSkills.filter((skill) => !currentUser.skillsDetail.some((item) => item.name === skill)).map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <button onClick={addExistingSkill} className="inline-flex items-center gap-1 rounded-md border border-primary bg-primary px-3 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Aggiungi
          </button>
        </div>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Proponi una nuova competenza</SectionTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          L’ufficio la valuterà prima di aggiungerla al tuo profilo.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            value={proposedSkill}
            onChange={(e) => setProposedSkill(e.target.value)}
            placeholder="Es. #danzaStorica"
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={addProposedSkill} className="rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground">
            Proponi
          </button>
        </div>
        {currentUser.proposedSkills.length > 0 && (
          <div className="mt-3 border border-border bg-surface p-3">
            <p className="eyebrow text-muted-foreground">In attesa di valutazione</p>
            <p className="mt-2 text-sm text-foreground">{currentUser.proposedSkills.join(" · ")}</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof UserRound; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <p className="eyebrow text-xs text-muted-foreground">{label}</p>
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
