import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/u/notifiche")({
  component: UserNotifications,
});

function UserNotifications() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bell className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-primary">Notifiche</h1>
          <p className="text-sm text-muted-foreground">Aggiornamenti su conferme e eventi (work in progress)</p>
        </div>
      </header>

      <section className="rounded-lg border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Nessuna notifica al momento.</p>
      </section>
    </main>
  );
}
