import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DemoNote, SectionTitle } from "@/components/ui-kit";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/altro")({
  head: () => ({
    meta: [
      { title: "Moduli — Regia Malastrana" },
      {
        name: "description",
        content:
          "Moduli in preparazione del gestionale Malastrana: magazzino, documenti, report e altro.",
      },
      { property: "og:title", content: "Moduli — Regia Malastrana" },
      {
        property: "og:description",
        content: "Sezioni future del gestionale Malastrana.",
      },
      { property: "og:url", content: "/admin/altro" },
    ],
    links: [{ rel: "canonical", href: "/admin/altro" }],
  }),
  component: AltroPage,
});

export const MODULES: Array<{ slug: string; label: string; desc: string }> = [
  { slug: "magazzino", label: "Magazzino", desc: "Inventario costumi e attrezzeria." },
  { slug: "bolle", label: "Bolle di carico", desc: "Generazione e archivio bolle." },
  { slug: "documenti", label: "Documenti", desc: "Contratti, liberatorie e allegati." },
  { slug: "report", label: "Report", desc: "Statistiche su eventi e presenze." },
  { slug: "notifiche", label: "Notifiche", desc: "Invii e comunicazioni al cast." },
  { slug: "impostazioni", label: "Impostazioni", desc: "Configurazione organizzazione." },
];

function AltroPage() {
  return (
    <AppShell area="admin" title="Altro">
      <section className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Moduli</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sezioni previste dal gestionale, per ora in preparazione.
        </p>
      </section>

      <section className="mt-6 px-3">
        <SectionTitle>In preparazione</SectionTitle>
        <ul className="border-t border-border">
          {MODULES.map((m) => (
            <li key={m.slug}>
              <Link
                to="/admin/modulo/$slug"
                params={{ slug: m.slug }}
                className="flex min-h-16 items-center justify-between gap-3 border-b border-border py-3 active:bg-muted"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-foreground">{m.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {m.desc}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-border-strong" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 px-3">
        <Link
          to="/"
          className="flex min-h-12 items-center justify-center border border-border-strong bg-surface text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
        >
          Torna alla scelta area demo
        </Link>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
