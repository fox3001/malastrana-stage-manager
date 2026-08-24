import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { CalendarDays, Clock, MapPin, Shirt } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/eventi/nuovo")({
  component: EventoNuovo,
});

function EventoNuovo() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    place: "",
  });

  const canSubmit = form.name && form.date && form.timeStart && form.timeEnd && form.place;

  return (
    <AppShell area="admin" title="Nuovo evento" back="/admin/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Creazione</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Nuovo evento</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Inserisci i dati base e procedi con la richiesta di disponibilità.
        </p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Dati evento</SectionTitle>
        <div className="grid gap-3 border-t border-border pt-3">
          <Field icon={CalendarDays} label="Nome evento">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Es. Saggio di danza 2026"
            />
          </Field>
          <Field icon={CalendarDays} label="Data">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field icon={Clock} label="Ora inizio">
              <input
                type="time"
                value={form.timeStart}
                onChange={(e) => setForm({ ...form, timeStart: e.target.value })}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
            <Field icon={Clock} label="Ora fine">
              <input
                type="time"
                value={form.timeEnd}
                onChange={(e) => setForm({ ...form, timeEnd: e.target.value })}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>
          <Field icon={MapPin} label="Luogo">
            <input
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Es. Teatro Comunale"
            />
          </Field>
        </div>
      </section>

      <section className="mt-6 px-3">
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Dopo aver creato l'evento, potrai inviare le richieste di disponibilità ai collaboratori e confermare il team.
          </p>
          <button
            disabled={!canSubmit}
            className={`mt-3 inline-flex min-h-9 items-center border px-3 text-xs font-semibold uppercase tracking-[0.08em] ${
              canSubmit
                ? "border-primary bg-primary text-white"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            Crea evento
          </button>
        </div>
      </section>
    </AppShell>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
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
