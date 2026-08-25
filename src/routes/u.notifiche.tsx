import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, Circle } from "lucide-react";
import { getNotificationsForUser, markNotificationRead } from "../data/demo";

export const Route = createFileRoute("/u/notifiche")({
  component: UserNotifications,
});

function UserNotifications() {
  const currentUserId = "c1";
  const notifications = getNotificationsForUser(currentUserId);

  function handleMarkRead(id: string) {
    markNotificationRead(id);
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bell className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-primary">Notifiche</h1>
          <p className="text-sm text-muted-foreground">Aggiornamenti su conferme e eventi</p>
        </div>
      </header>

      {notifications.length === 0 ? (
        <section className="rounded-lg border bg-card p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Nessuna notifica al momento.</p>
        </section>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.read ? (
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Circle className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  {n.eventId && (
                    <p className="mt-1 text-xs text-muted-foreground">Evento: {n.eventId}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="ml-3 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                >
                  Segna come letta
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
