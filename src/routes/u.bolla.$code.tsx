import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { ClipboardList, Package, Shirt } from "lucide-react";

export const Route = createFileRoute("/u/bolla/$code")({
  component: BollaDettaglio,
});

function BollaDettaglio() {
  const { code } = Route.useParams();
  const { bolle, bollaItemsState, setBollaItemStatus } = useDemo();
  const bolla = bolle.find((b) => b.code === code);

  if (!bolla) {
    return (
      <AppShell area="u" title="Bolla">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">Bolla non trovata.</p>
          <Link to="/u/materiale" className="eyebrow text-accent">
            Torna indietro
          </Link>
        </section>
      </AppShell>
    );
  }

  // Demo: mostro solo se l'utente è "confermato" all'evento collegato
  const userConfirmed = true; // da sostituire con logica reale

  if (!userConfirmed) {
    return (
      <AppShell area="u" title="Bolla">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">
            Non hai accesso a questa bolla. Solo i collaboratori confermati possono visualizzarla.
          </p>
          <Link to="/u/materiale" className="eyebrow text-accent">
            Torna indietro
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell area="u" title="Bolla" back="/u/materiale">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Documento</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Bolla {bolla.code}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {bolla.date} · {bolla.eventCode}
        </p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Controllo materiale</SectionTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Segna lo stato di ogni voce prima e dopo l'evento.
        </p>
        <ul className="border-t border-border">
          {bolla.items.map((item) => {
            const status = bollaItemsState[item.id];
            return (
              <li key={item.id}>
                <div className="flex items-start justify-between gap-3 border-b border-border py-3">
                  <div className="flex items-start gap-3">
                    {item.type === "costume" ? (
                      <Shirt className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
                    ) : (
                      <Package className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
                    )}
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type} · taglia {item.size} · q.{item.qty}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={status || ""}
                      onChange={(e) =>
                        setBollaItemStatus(item.id, e.target.value as any)
                      }
                      className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Da verificare</option>
                      <option value="presente">✅ Presente</option>
                      <option value="danneggiato">⚠️ Danneggiato</option>
                      <option value="mancante">❌ Mancante</option>
                    </select>
                    {status && (
                      <span
                        className={`eyebrow text-[10px] ${
                          status === "presente"
                            ? "text-accent"
                            : status === "danneggiato"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6 px-3">
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Questa bolla collega il materiale assegnato all'evento. Gli stati salvati qui saranno usati per il report pre/post evento.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
