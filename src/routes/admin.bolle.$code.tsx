import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS } from "@/data/demo";
import { ClipboardList, Package, Shirt, CheckCircle2, RefreshCw, UserCheck } from "lucide-react";

export const Route = createFileRoute("/admin/bolle/$code")({
  component: BollaAdminDettaglio,
});

function BollaAdminDettaglio() {
  const { code } = Route.useParams();
  const { bolle, closeBolla, reopenBolla, setBollaTeamLeader } = useDemo();
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

  const leader = COLLABORATORS.find((c) => c.id === bolla.teamLeaderId);

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
        <div className="flex flex-wrap items-center gap-2">
          {bolla.closed ? (
            <button
              onClick={() => reopenBolla(bolla.code)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
              Riapri bolla
            </button>
          ) : (
            <button
              onClick={() => closeBolla(bolla.code)}
              className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
              Chiudi bolla
            </button>
          )}
          <select
            value={bolla.teamLeaderId || ""}
            onChange={(e) => setBollaTeamLeader(bolla.code, e.target.value)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground"
          >
            <option value="">Assegna team leader...</option>
            {COLLABORATORS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
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

      {leader && (
        <section className="mt-6 px-3">
          <div className="border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <p className="text-sm text-foreground">
                Team leader: <strong>{leader.name}</strong>
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Solo il team leader o un admin possono chiudere/riaprire e modificare la bolla.
            </p>
          </div>
        </section>
      )}
    </AppShell>
  );
}
