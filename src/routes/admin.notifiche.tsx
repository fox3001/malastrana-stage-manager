import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SectionTitle } from "@/components/ui-kit";
import { NOTIFICATIONS } from "@/data/demo";
import { Bell, Check, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/notifiche")({
  component: NotificheLista,
});

function NotificheLista() {
  return (
    <AppShell area="admin" title="Notifiche" back="/admin">
      <section className="px-3 pt-6">
        <p className="eyebrow text-accent">Comunicazioni</p>
        <h2 className="mt-1 font-serif text-3xl text-primary">Notifiche</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elenco notifiche demo per l'ufficio.
        </p>
      </section>

      <section className="mt-6 px-3">
        {NOTIFICATIONS.length === 0 ? (
          <div className="border border-border bg-surface p-4 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-foreground">Nessuna notifica.</p>
          </div>
        ) : (
          <ul className="border-t border-border">
            {NOTIFICATIONS.map((n) => (
              <li key={n.id}>
                <div className="flex items-start justify-between gap-3 border-b border-border py-3">
                  <div className="flex items-start gap-3">
                    {n.read ? (
                      <Check className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
                    ) : (
                      <Mail className="mt-0.5 h-5 w-5 text-foreground" strokeWidth={1.5} />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
                    </div>
                  </div>
                  {!n.read && (
                    <button className="eyebrow rounded-full border border-border bg-surface px-2 py-1 text-xs text-foreground active:bg-muted">
                      Leggi
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
