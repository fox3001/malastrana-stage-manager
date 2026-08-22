import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DemoNote, EventRow } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { STATUS_LABEL, type EventStatus } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/eventi/")({
  head: () => ({
    meta: [
      { title: "Eventi — Malastrana" },
      {
        name: "description",
        content: "Agenda verticale degli eventi demo del collaboratore Malastrana.",
      },
      { property: "og:title", content: "Eventi — Malastrana" },
      {
        property: "og:description",
        content: "Agenda eventi del prototipo Malastrana.",
      },
      { property: "og:url", content: "/u/eventi" },
    ],
    links: [{ rel: "canonical", href: "/u/eventi" }],
  }),
  component: EventiPage,
});

const FILTERS: Array<{ key: EventStatus | "tutti"; label: string }> = [
  { key: "tutti", label: "Tutti" },
  { key: "richiesta", label: STATUS_LABEL.richiesta },
  { key: "confermato", label: STATUS_LABEL.confermato },
  { key: "da_definire", label: STATUS_LABEL.da_definire },
  { key: "annullato", label: STATUS_LABEL.annullato },
];

function EventiPage() {
  const { events } = useDemo();
  const [filter, setFilter] = useState<EventStatus | "tutti">("tutti");

  const list = events
    .filter((e) => filter === "tutti" || e.status === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppShell area="user" title="Eventi">
      <div className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Agenda</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tocca un evento per aprirne la scheda.
        </p>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-3 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "eyebrow min-h-9 shrink-0 border px-3",
              filter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border-strong bg-surface text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-border">
        {list.length === 0 ? (
          <p className="px-3 py-6 text-sm text-muted-foreground">
            Nessun evento per questo filtro.
          </p>
        ) : (
          list.map((e) => (
            <EventRow
              key={e.id}
              to="/u/eventi/$code"
              params={{ code: e.code }}
              date={e.date}
              name={e.name}
              place={e.place}
              time={`${e.timeStart}–${e.timeEnd}`}
              code={e.code}
              status={e.status}
            />
          ))
        )}
      </div>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
