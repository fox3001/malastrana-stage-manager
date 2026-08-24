import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DemoNote, SectionTitle } from "@/components/ui-kit";
import { NOTIFICATIONS } from "@/data/demo";

export const Route = createFileRoute("/u/notifiche")({
  head: () => ({
    meta: [
      { title: "Notifiche — Malastrana" },
      {
        name: "description",
        content: "Elenco delle notifiche dimostrative del collaboratore Malastrana.",
      },
      { property: "og:title", content: "Notifiche — Malastrana" },
      {
        property: "og:description",
        content: "Notifiche del prototipo Malastrana Eventi.",
      },
      { property: "og:url", content: "/u/notifiche" },
    ],
    links: [{ rel: "canonical", href: "/u/notifiche" }],
  }),
  component: NotifichePage,
});

function NotifichePage() {
  return (
    <AppShell area="user" title="Notifiche" back="/u">
      <section className="px-3 pt-6">
        <SectionTitle>Tutte le notifiche</SectionTitle>
        <ul className="border-t border-border">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="border-b border-border py-3.5">
              <p className="text-sm text-foreground">{n.text}</p>
              <p className="eyebrow mt-1 text-muted-foreground">{n.when}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Le notifiche sono statiche: nessun invio reale, nessuna push.
        </p>
      </section>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
