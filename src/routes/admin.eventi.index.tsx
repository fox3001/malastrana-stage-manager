import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, DemoNote, EventRow } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { STATUS_LABEL, type EventStatus } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/eventi/")({
  head: () => ({
    meta: [
      { title: "Eventi — Regia Malastrana" },
      {
        name: "description",
        content: "Elenco eventi lato organizzazione nel prototipo Malastrana.",
      },
      { property: "og:title", content: "Eventi — Regia Malastrana" },
      {
        property: "og:description",
        content: "Gestione dimostrativa degli eventi Malastrana.",
      },
      { property: "og:url", content: "/admin/eventi" },
    ],
    links: [{ rel: "canonical", href: "/admin/eventi" }],
  }),
  component: AdminEventi,
});

const FILTERS: Array<{ key: EventStatus | "tutti"; label: string }> = [
  { key: "tutti", label: "Tutti" },
  { key: "richiesta", label: STATUS_LABEL.richiesta },
  { key: "confermato", label: STATUS_LABEL.confermato },
  { key: "da_definire", label: STATUS_LABEL.da_definire },
  { key: "annullato", label: STATUS_LABEL.annullato },
];

function AdminEventi() {
  const { events } = useDemo();
  const [filter, setFilter] = useState<EventStatus | "tutti">("tutti");
  const list = events
    .filter((e) => filter === "tutti" || e.status === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppShell area="admin" title="Eventi">
      <div className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Programmazione</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Apri un evento per vedere cast, materiale e stato delle disponibilità.
        </p>
        <div className="mt-4">
          <Button full variant="outline" disabled>
            Nuovo evento (non attivo)
          </Button>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-3 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "eyebrow min-h-9 shrink-0 border px-3",
              filter === f.key
                ? "border-accent bg-accent text-accent-foreground"
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
              to="/admin/eventi/$code"
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
