import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/u/notifiche")({
  component: UserNotifications,
});

function UserNotifications() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <h1 className="font-serif text-2xl text-primary">Notifiche</h1>
      <p className="mt-1 text-sm text-muted-foreground">Work in progress</p>
    </main>
  );
}
