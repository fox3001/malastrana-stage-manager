import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DemoNote, EventRow, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { MONTHS } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/calendario")({
  head: () => ({
    meta: [
      { title: "Calendario — Malastrana" },
      {
        name: "description",
        content: "Calendario demo con vista agenda e vista mese degli eventi Malastrana.",
      },
      { property: "og:title", content: "Calendario — Malastrana" },
      {
        property: "og:description",
        content: "Vista agenda e mese del prototipo Malastrana.",
      },
      { property: "og:url", content: "/u/calendario" },
    ],
    links: [{ rel: "canonical", href: "/u/calendario" }],
  }),
  component: CalendarioPage,
});

const WEEKDAYS = ["L", "M", "M", "G", "V", "S", "D"];

function CalendarioPage() {
  const { events } = useDemo();
  const [view, setView] = useState<"agenda" | "mese">("agenda");
  const [cursor, setCursor] = useState({ y: 2026, m: 9 }); // ottobre 2026

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const first = new Date(cursor.y, cursor.m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: Array<number | null> = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthEvents = sorted.filter((e) => {
    const d = new Date(e.date + "T00:00:00");
    return d.getFullYear() === cursor.y && d.getMonth() === cursor.m;
  });

  const shift = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <AppShell area="user" title="Calendario">
      <div className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Calendario</h2>
        <div className="mt-3 flex border border-border-strong">
          {(["agenda", "mese"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "eyebrow min-h-11 flex-1",
                view === v ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground",
              )}
            >
              {v === "agenda" ? "Agenda" : "Mese"}
            </button>
          ))}
        </div>
      </div>

      {view === "agenda" ? (
        <div className="mt-5 border-t border-border">
          {sorted.map((e) => (
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
          ))}
        </div>
      ) : (
        <div className="mt-5 px-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => shift(-1)}
              className="eyebrow min-h-11 border border-border-strong bg-surface px-3 text-muted-foreground"
            >
              Prec
            </button>
            <p className="font-serif text-lg text-primary">
              {MONTHS[cursor.m]} {cursor.y}
            </p>
            <button
              onClick={() => shift(1)}
              className="eyebrow min-h-11 border border-border-strong bg-surface px-3 text-muted-foreground"
            >
              Succ
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-px border border-border bg-border">
            {WEEKDAYS.map((d, i) => (
              <div
                key={i}
                className="eyebrow bg-secondary py-2 text-center text-muted-foreground"
              >
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              const dayEvents = day
                ? monthEvents.filter(
                    (e) => new Date(e.date + "T00:00:00").getDate() === day,
                  )
                : [];
              return (
                <div
                  key={i}
                  className="min-h-12 bg-surface p-1 text-center text-xs text-foreground"
                >
                  {day && (
                    <>
                      <span className="block">{day}</span>
                      {dayEvents.length > 0 && (
                        <span className="mx-auto mt-1 block h-1.5 w-1.5 rotate-45 bg-primary" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="eyebrow text-muted-foreground">Eventi del mese</p>
            {monthEvents.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nessun evento in questo mese.
              </p>
            ) : (
              <ul className="mt-2 border-t border-border">
                {monthEvents.map((e) => (
                  <li key={e.id}>
                    <Link
                      to="/u/eventi/$code"
                      params={{ code: e.code }}
                      className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-2.5 active:bg-muted"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-serif text-base">
                          {e.name}
                        </span>
                        <span className="mt-1 block">
                          <StatusTag status={e.status} />
                        </span>
                      </span>
                      <span className="eyebrow shrink-0 text-muted-foreground">
                        {new Date(e.date + "T00:00:00").getDate()}{" "}
                        {MONTHS[cursor.m]?.slice(0, 3)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
