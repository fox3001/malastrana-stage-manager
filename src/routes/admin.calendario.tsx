import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/admin/calendario/")({
  component: CalendarioAdmin,
});

function CalendarioAdmin() {
  const { events } = useDemo();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const monthLabel = currentMonth.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const days = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [daysInMonth, firstDay]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof events> = {};
    events.forEach((e) => {
      const [y, m, d] = e.date.split("-").map(Number);
      if (
        y === currentMonth.getFullYear() &&
        m - 1 === currentMonth.getMonth()
      ) {
        map[d] = map[d] || [];
        map[d].push(e);
      }
    });
    return map;
  }, [events, currentMonth]);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  return (
    <AppShell area="admin" title="Calendario" back="/admin">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Pianificazione</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Calendario</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vista mensile degli eventi.
        </p>
      </section>

      <section className="mt-6 px-3">
        <div className="flex items-center justify-between border-y border-border py-3">
          <button
            onClick={prevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <p className="font-serif text-lg capitalize text-primary">{monthLabel}</p>
          <button
            onClick={nextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
          </button>
        </div>
      </section>

      <section className="mt-4 px-3">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {["L","M","M","G","V","S","D"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div
              key={i}
              className={`min-h-16 border border-border bg-surface p-1 ${
                d === null ? "bg-muted/30" : ""
              }`}
            >
              {d !== null && (
                <>
                  <p className="mb-1 text-right text-xs text-foreground">{d}</p>
                  <div className="flex flex-col gap-1">
                    {(eventsByDay[d] || []).slice(0, 3).map((e) => (
                      <Link
                        key={e.id}
                        to="/admin/eventi/$code"
                        params={{ code: e.code }}
                        className="eyebrow truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary"
                      >
                        {e.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Eventi del mese</SectionTitle>
        <ul className="border-t border-border">
          {Object.entries(eventsByDay)
            .flatMap(([d, evs]) => evs.map((e) => ({ day: Number(d), ...e })))
            .sort((a, b) => a.day - b.day || a.timeStart.localeCompare(b.timeStart))
            .map((e) => (
              <li key={e.id}>
                <Link
                  to="/admin/eventi/$code"
                  params={{ code: e.code }}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">
                      {e.day} · {e.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {e.place} · {e.timeStart}–{e.timeEnd}
                    </span>
                  </span>
                  <StatusTag status={e.status} />
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </AppShell>
  );
}
