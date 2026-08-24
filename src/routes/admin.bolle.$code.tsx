import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { ClipboardList, Package, Shirt } from "lucide-react";

export const Route = createFileRoute("/admin/bolle/$code")({
  component: BollaAdminDettaglio,
});

function BollaAdminDettaglio() {
  const { code } = Route.useParams();
  const { bolle } = useDemo();
  const bolla = bolle.find((b) => b.code === code);

  if (!bolla) {
    return (
      <AppShell area="admin" title="Bolla">
        <section className="px-3 pt-6">
          <p className="text-sm text-muted-foreground">Bolla non trovata.</p>
          <Link to="/admin/bolle" className="eyebrow text-accent">
            Torna alla lista
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell area="admin" title="Bolla" back="/admin/bolle">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Dettaglio</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Bolla {bolla.code}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {bolla.date} · Evento {bolla.eventCode}
        </p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>Voci</SectionTitle>
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
                  to="/admin/costumi"
                  className="eyebrow text-accent"
                >
                  Scheda
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
