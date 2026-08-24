import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DemoNote, EventRow, SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { MONTHS } from "@/data/demo";

export const Route = createFileRoute("/admin/calendario")({
  head: () => ({
    meta: [
      { title: "Calendario — Regia Malastrana" },
      {
        name: "description",
        content: "Calendario dimostrativo degli eventi lato organizzazione Malastrana.",
      },
      { property: "og:title", content: "Calendario — Regia Malastrana" },
      {
        property: "og:description",
        content: "Programmazione mensile del prototipo Malastrana.",
      },
      { property: "og:url", content: "/admin/calendario" },
    ],
    links: [{ rel: "canonical", href: "/admin/calendario" }],
  }),
  component: AdminCalendario,
});

function AdminCalendario() {
  const { events } = useDemo();
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const byMonth = sorted.reduce<Record<string, typeof sorted>>((acc, e) => {
    const d = new Date(e.date + "T00:00:00");
    const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    (acc[key] ??= []).push(e);
    return acc;
  }, {});

  return (
    <AppShell area="admin" title="Calendario">
      <section className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Programmazione</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista per mese degli eventi dimostrativi.
        </p>
      </section>

      {Object.entries(byMonth).map(([month, list]) => (
        <section key={month} className="mt-7 px-3">
          <SectionTitle>{month}</SectionTitle>
          <div className="border-t border-border">
            {list.map((e) => (
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
      ))}

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
