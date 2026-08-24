import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle, StatusTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS } from "@/data/demo";
import { CalendarDays, Clock, MapPin, Users, Upload, ClipboardList } from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/admin/eventi/$code")({
  component: EventoDettaglio,
});

function EventoDettaglio() {
  const { code } = Route.useParams();
  const { events, bolle, addBolla } = useDemo();
  const event = events.find((e) => e.code === code);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!event) {
    return (
      <AppShell area="admin" title="Evento">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">Evento non trovato.</p>
          <Link to="/admin/eventi" className="eyebrow text-accent">
            Torna alla lista
          </Link>
        </section>
      </AppShell>
    );
  }

  const team = COLLABORATORS.slice(0, 3);
  const eventBolle = bolle.filter((b) => b.eventCode === event.code);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const bollaCode = file.name.replace(/\.[^.]+$/, "").toUpperCase().slice(0, 12);
    addBolla({
      id: crypto.randomUUID(),
      code: bollaCode,
      date: new Date().toISOString().split("T")[0],
      eventCode: event.code,
      items: [
        { id: crypto.randomUUID(), code: bollaCode, name: "Voce da Excel 1", type: "costume", size: "M", qty: 1 },
        { id: crypto.randomUUID(), code: bollaCode, name: "Voce da Excel 2", type: "oggetto", size: "-", qty: 2 },
      ],
    });
  };

  return (
    <AppShell area="admin" title="Evento" back="/admin/eventi">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Dettaglio</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">{event.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Codice: {event.code}</p>
      </section>

      <section className="mt-6 px-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon={CalendarDays} label="Data" value={event.date} />
          <InfoCard icon={Clock} label="Orari" value={`${event.timeStart}–${event.timeEnd}`} />
          <InfoCard icon={MapPin} label="Luogo" value={event.place} />
          <InfoCard icon={Users} label="Stato" value={<StatusTag status={event.status} />} />
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Team assegnato</SectionTitle>
        <ul className="border-t border-border">
          {team.map((c) => (
            <li key={c.id}>
              <Link
                to="/admin/collaboratori/$id"
                params={{ id: c.id }}
                className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">{c.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.role}</span>
                </span>
                <span className="eyebrow shrink-0 text-accent">{c.state}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle
          action={
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={2} />
              Carica
            </button>
          }
        >
          Bolle di carico
        </SectionTitle>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        {eventBolle.length === 0 ? (
          <div className="border border-border bg-surface p-4">
            <p className="text-sm text-foreground">
              Nessuna bolla caricata per questo evento.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Carica un file Excel per associare materiale all'evento.
            </p>
          </div>
        ) : (
          <ul className="border-t border-border">
            {eventBolle.map((b) => (
              <li key={b.id}>
                <Link
                  to="/admin/bolle/$code"
                  params={{ code: b.code }}
                  className="flex items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-accent" strokeWidth={1.5} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">Bolla {b.code}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {b.date} · {b.items.length} voci
                      </span>
                    </span>
                  </div>
                  <span className="eyebrow shrink-0 text-accent">Apri</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Materiale previsto</SectionTitle>
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Assegnazione costumi e materiali in arrivo (collegata a bolle di carico).
          </p>
          <Link
            to="/admin/costumi"
            className="mt-3 inline-flex min-h-9 items-center border border-border bg-surface px-3 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            Vai a Costumi
          </Link>
        </div>
      </section>

      {fileName && (
        <section className="mt-6 px-3">
          <div className="border border-border bg-surface p-4">
            <p className="text-sm text-foreground">
              File caricato: <strong>{fileName}</strong>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Demo: bolla generata con 2 voci finte. In produzione: parsing Excel reale.
            </p>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-surface p-3">
      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
      <p className="mt-2 eyebrow text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}
