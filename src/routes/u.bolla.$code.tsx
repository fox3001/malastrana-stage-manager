import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { ClipboardList, Package, Shirt } from "lucide-react";

export const Route = createFileRoute("/u/bolla/$code")({
  component: BollaDettaglio,
});

function BollaDettaglio() {
  const { code } = Route.useParams();

  // Demo: dati finti per la bolla
  const bolla = {
    code,
    date: "2026-09-15",
    event: "Saggio di danza 2026",
    items: [
      { id: "1", name: "Tut\u00f9 classico", type: "costume", size: "M", qty: 1 },
      { id: "2", name: "Scarpette punta", type: "costume", size: "38", qty: 1 },
      { id: "3", name: "Asta microfono", type: "materiale", size: "-", qty: 2 },
    ],
  };

  return (
    <AppShell area="u" title="Bolla" back="/u/materiale">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Documento</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Bolla {bolla.code}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{bolla.date} · {bolla.event}</p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Contenuto</SectionTitle>
        <ul className="border-t border-border">
          {bolla.items.map((item) => (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 border-b border-border py-3">
                <div className="flex items-center gap-3">
                  {item.type === "costume" ? (
                    <Shirt className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  ) : (
                    <Package className="h-5 w-5 text-accent" strokeWidth={1.5} />
                  )}
                  <div>
                    <p className="text-sm text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type} · taglia {item.size} · q.{item.qty}
                    </p>
                  </div>
                </div>
                <Link
                  to={item.type === "costume" ? "/u/costumi" : "/u/materiale"}
                  className="eyebrow text-accent"
                >
                  Scheda
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-3">
        <div className="border border-border bg-surface p-4">
          <p className="text-sm text-foreground">
            Questa bolla collega il materiale assegnato all'evento. In produzione sar\u00e0 generata automaticamente dall'ufficio.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
