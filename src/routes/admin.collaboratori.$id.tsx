import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Avatar,
  Button,
  DemoNote,
  Field,
  SectionTitle,
  Tags,
  VerificationTag,
} from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS } from "@/data/demo";

export const Route = createFileRoute("/admin/collaboratori/$id")({
  head: () => ({
    meta: [
      { title: "Scheda collaboratore — Regia Malastrana" },
      {
        name: "description",
        content:
          "Scheda dimostrativa del collaboratore: competenze, costumi e materiale personale.",
      },
      { property: "og:title", content: "Scheda collaboratore — Regia Malastrana" },
      {
        property: "og:description",
        content: "Dettaglio collaboratore nel prototipo Malastrana.",
      },
    ],
  }),
  component: SchedaCollaboratore,
});

function SchedaCollaboratore() {
  const { id } = Route.useParams();
  const { costumes, gear } = useDemo();
  const person = COLLABORATORS.find((c) => c.id === id);

  if (!person) {
    return (
      <AppShell area="admin" title="Collaboratore" back="/admin/collaboratori">
        <p className="px-3 py-10 text-sm text-muted-foreground">
          Collaboratore non presente nei dati dimostrativi.
        </p>
      </AppShell>
    );
  }

  const theirCostumes = costumes.filter((c) => c.owner === person.id);
  const theirGear = gear.filter((g) => g.owner === person.id);

  return (
    <AppShell area="admin" title={person.name} back="/admin/collaboratori">
      <section className="flex flex-col items-center border-b border-border bg-surface px-4 py-8 text-center">
        <Avatar name={person.name} size="lg" />
        <h2 className="mt-4 font-serif text-2xl text-primary">{person.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground">
          {person.bio}
        </p>
        <div className="mt-4">
          <Tags tags={person.skills} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Dati</SectionTitle>
        <div>
          <Field label="Stato">{person.state}</Field>
          <Field label="Costumi">{theirCostumes.length}</Field>
          <Field label="Materiale">{theirGear.length}</Field>
        </div>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Costumi</SectionTitle>
        <ul className="border-t border-border">
          {theirCostumes.map((c) => (
            <li key={c.id} className="border-b border-border py-3">
              <p className="truncate text-sm text-foreground">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">{c.category}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <VerificationTag value={c.verification} />
              </div>
            </li>
          ))}
          {theirCostumes.length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">Nessun costume.</li>
          )}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Materiale personale</SectionTitle>
        <ul className="border-t border-border">
          {theirGear.map((g) => (
            <li key={g.id} className="border-b border-border py-3">
              <p className="truncate text-sm text-foreground">{g.name}</p>
              <p className="truncate text-xs text-muted-foreground">{g.description}</p>
            </li>
          ))}
          {theirGear.length === 0 && (
            <li className="py-3 text-sm text-muted-foreground">Nessun materiale.</li>
          )}
        </ul>
        <div className="mt-5">
          <Button full variant="outline" disabled>
            Assegna a un evento (non attivo)
          </Button>
        </div>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
