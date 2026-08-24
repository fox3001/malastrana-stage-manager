import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { ClipboardList, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/admin/bolle/")({
  component: BolleLista,
});

function BolleLista() {
  const { bolle, addBolla } = useDemo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Demo: crea bolla finta dal nome file
    const code = file.name.replace(/\.[^.]+$/, "").toUpperCase().slice(0, 8);
    addBolla({
      id: crypto.randomUUID(),
      code,
      date: new Date().toISOString().split("T")[0],
      eventCode: "EVT001",
      items: [
        { id: crypto.randomUUID(), code, name: "Voce da Excel 1", type: "costume", size: "M", qty: 1 },
        { id: crypto.randomUUID(), code, name: "Voce da Excel 2", type: "oggetto", size: "-", qty: 2 },
      ],
    });
  };

  return (
    <AppShell area="admin" title="Bolle" back="/admin">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Magazzino</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Bolle di carico</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Carica da Excel o gestisci le bolle esistenti.
        </p>
      </section>

      <section className="mt-6 flex items-center justify-between px-3">
        <p className="text-sm text-muted-foreground">
          {bolle.length} bolle caricate
        </p>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            <Upload className="h-3.5 w-3.5" strokeWidth={2} />
            Carica Excel
          </button>
          <Link
            to="/admin/bolle/nuova"
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Nuova
          </Link>
        </div>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle
          action={
            <span className="eyebrow text-muted-foreground">
              {bolle.length} risultati
            </span>
          }
        >
          Lista bolle
        </SectionTitle>
        {bolle.length === 0 ? (
          <p className="border-t border-border py-3 text-sm text-muted-foreground">
            Nessuna bolla caricata.
          </p>
        ) : (
          <ul className="border-t border-border">
            {bolle.map((b) => (
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
                  <span className="eyebrow shrink-0 text-accent">{b.eventCode}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
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
