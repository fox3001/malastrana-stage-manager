import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ShieldCheck, Star } from "lucide-react";
import { getEventByCode, getAvailabilityForEvent } from "../data/demo";

export const Route = createFileRoute("/u/eventi/$code")({
  component: UserEventDetail,
});

function UserEventDetail() {
  const { code } = Route.useParams();
  const event = getEventByCode(code);
  const availability = getAvailabilityForEvent(code);

  const currentUserId = "c1";
  const myEntry = availability.find((a) => a.userId === currentUserId);

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">Evento non trovato.</p>
        <Link to="/u/eventi" className="mt-4 text-sm text-primary hover:underline">
          Torna agli eventi
        </Link>
      </div>
    );
  }

  const isConfirmed = !!myEntry?.confirmed;
  const isTL = !!myEntry?.isTL;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <Link to="/u/eventi" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Torna agli eventi
      </Link>

      <header className="mb-8">
        <h1 className="font-serif text-3xl text-primary">{event.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.date} • {event.location}
        </p>
      </header>

      {isConfirmed ? (
        <section className="mb-10 rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <h2 className="text-base font-semibold">Il tuo stato per questo evento</h2>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium">Sei confermato come animatore</p>
              <p className="text-xs text-muted-foreground">L'ufficio ti ha inserito tra gli animatori per questo evento.</p>
            </div>
            {isTL && (
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-yellow-400/15 px-2.5 py-1 text-xs font-medium text-yellow-500">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                Team Leader
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="mb-10 rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <h2 className="text-base font-semibold">Il tuo stato per questo evento</h2>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium">Non sei ancora confermato</p>
              <p className="text-xs text-muted-foreground">Hai segnalato disponibilità, ma l'ufficio non ti ha ancora confermato.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
