import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark, Wordmark, DemoNote } from "@/components/ui-kit";
import { ShieldCheck, User } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Malastrana — Eventi senza tempo" },
      {
        name: "description",
        content:
          "Ingresso al prototipo UI del gestionale Malastrana: area collaboratore demo e area admin demo.",
      },
      { property: "og:title", content: "Malastrana — Eventi senza tempo" },
      {
        property: "og:description",
        content: "Prototipo UI del gestionale interno Malastrana Eventi.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Ingresso,
});

function Ingresso() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background px-safe pb-safe pt-safe">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="flex flex-col items-center">
          <LogoMark />
          <div className="mt-6">
            <Wordmark />
          </div>
        </div>

        <div className="mt-14">
          <p className="eyebrow text-center text-muted-foreground">Chi sei?</p>

          <div className="mt-5 space-y-3">
            <Link
              to="/u"
              className="flex min-h-16 items-center gap-4 border border-primary bg-primary px-5 text-primary-foreground active:opacity-80"
            >
              <User className="h-5 w-5 shrink-0" strokeWidth={1.4} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold uppercase tracking-[0.14em]">
                  Utente
                </span>
                <span className="block text-xs opacity-80">
                  Area collaboratore dimostrativa
                </span>
              </span>
            </Link>

            <Link
              to="/admin"
              className="flex min-h-16 items-center gap-4 border border-accent bg-surface px-5 text-foreground active:opacity-80"
            >
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  Admin
                </span>
                <span className="block text-xs text-muted-foreground">
                  Area organizzazione dimostrativa
                </span>
              </span>
            </Link>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            La scelta è solo un ingresso visuale: non esiste login, non esiste
            autenticazione e non sono attivi ruoli o permessi reali.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-6 pb-8">
        <DemoNote />
      </div>
    </div>
  );
}
