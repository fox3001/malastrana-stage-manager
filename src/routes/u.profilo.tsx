import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Avatar, DemoNote, SectionTitle, Tags } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CURRENT_USER, NOTIFICATIONS } from "@/data/demo";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/u/profilo")({
  head: () => ({
    meta: [
      { title: "Profilo collaboratore — Malastrana" },
      {
        name: "description",
        content:
          "Profilo demo del collaboratore: bio, skill, costumi, materiale personale e disponibilità.",
      },
      { property: "og:title", content: "Profilo collaboratore — Malastrana" },
      {
        property: "og:description",
        content: "Profilo dimostrativo del prototipo Malastrana.",
      },
      { property: "og:url", content: "/u/profilo" },
    ],
    links: [{ rel: "canonical", href: "/u/profilo" }],
  }),
  component: ProfiloPage,
});

function ProfiloPage() {
  const { costumes, gear, availability, events } = useDemo();
  const mine = costumes.filter((c) => c.owner === "col-elena");
  const myGear = gear.filter((g) => g.owner === "col-elena");
  const answers = Object.entries(availability);

  return (
    <AppShell area="user" title="Profilo">
      <section className="flex flex-col items-center border-b border-border bg-surface px-4 py-8 text-center">
        <Avatar name={CURRENT_USER.name} size="lg" />
        <h2 className="mt-4 font-serif text-2xl text-primary">{CURRENT_USER.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{CURRENT_USER.role}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground">
          {CURRENT_USER.bio}
        </p>
        <div className="mt-4">
          <Tags tags={CURRENT_USER.skills} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle
          action={
            <Link to="/u/costumi" className="eyebrow text-accent">
              Apri
            </Link>
          }
        >
          Costumi
        </SectionTitle>
        <ul className="border-t border-border">
          {mine.slice(0, 3).map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-3 border-b border-border py-3"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm text-foreground">{c.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {c.category}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-border-strong" />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          {mine.length} costumi registrati localmente.
        </p>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle
          action={
            <Link to="/u/materiale" className="eyebrow text-accent">
              Apri
            </Link>
          }
        >
          Materiale personale
        </SectionTitle>
        <ul className="border-t border-border">
          {myGear.slice(0, 3).map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between gap-3 border-b border-border py-3"
            >
              <span className="min-w-0 truncate text-sm text-foreground">{g.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-border-strong" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Disponibilità</SectionTitle>
        {answers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nessuna disponibilità registrata su questo dispositivo.
          </p>
        ) : (
          <ul className="border-t border-border">
            {answers.map(([id, value]) => {
              const e = events.find((x) => x.id === id);
              if (!e) return null;
              return (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 border-b border-border py-3"
                >
                  <span className="min-w-0 truncate text-sm text-foreground">{e.name}</span>
                  <span className="eyebrow shrink-0 text-accent">
                    {value?.replace("_", " ")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8 px-3">
        <SectionTitle>Attività recenti</SectionTitle>
        <ul className="border-t border-border">
          {NOTIFICATIONS.map((n) => (
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
        <Link
          to="/"
          className="flex min-h-12 items-center justify-center border border-border-strong bg-surface text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
        >
          Torna alla scelta area demo
        </Link>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
