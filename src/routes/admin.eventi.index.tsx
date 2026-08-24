import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EventRow, SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CalendarDays, Filter } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/admin/eventi/")({
  component: EventiLista,
});

type StatusFilter = "tutti" | "richiesta" | "da_definire" | "confermato" | "annullato";

function EventiLista() {
  const { events } = useDemo();
  const [filter, setFilter] = useState<StatusFilter>("tutti");

  const filtered = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
    if (filter === "tutti") return sorted;
    return sorted.filter((e) => e.status === filter);
  }, [events, filter]);

  return (
    <AppShell area="admin" title="Eventi" back="/admin">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Gestione</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Eventi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lista, filtri e accesso rapido ai dettagli.
        </p>
      </section>

      <section className="mt-6 px-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter("tutti")}
            className={`eyebrow rounded-full border px-3 py-1.5 text-xs ${
              filter === "tutti"
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-foreground"
            }`}
          >
            Tutti
          </button>
          {(["richiesta", "da_definire", "confermato", "annullato"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`eyebrow rounded-full border px-3 py-1.5 text-xs ${
                filter === s
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-foreground"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle
          action={
            <span className="eyebrow text-muted-foreground">
              {filtered.length} risultati
            </span>
          }
        >
          Lista eventi
        </SectionTitle>
        {filtered.length === 0 ? (
          <p className="border-t border-border py-3 text-sm text-muted-foreground">
            Nessun evento con questo filtro.
          </p>
        ) : (
          <ul className="border-t border-border">
            {filtered.map((e) => (
              <li key={e.id}>
                <Link
                  to="/admin/eventi/$code"
                  params={{ code: e.code }}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">{e.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {e.place} · {e.timeStart}–{e.timeEnd} · {e.date}
                    </span>
                  </span>
                  <StatusTag status={e.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
