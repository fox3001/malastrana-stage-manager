import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ShieldCheck, Star, MapPin, Calendar, Clock, Phone, FileText } from "lucide-react";
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
        <h1 className="font-serif text-3xl text-primary">{event.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visualizza solo (modificabile solo da admin)</p>
      </header>

      <section className="mb-10 rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.08em]">Dettagli Evento</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Luogo:</span>
            <span className="text-foreground">{event.place}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Data:</span>
            <span className="text-foreground">{event.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Ritrovo:</span>
            <span className="text-foreground">{event.meetTime}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Inizio:</span>
            <span className="text-foreground">{event.timeStart}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Fine:</span>
            <span className="text-foreground">{event.timeEnd}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Contatto:</span>
            <a href={`tel:${event.contactPhone}`} className="text-primary hover:underline" title="Clicca per chiamare">
              {event.contactName} - {event.contactPhone}
            </a>
          </div>
          {event.notes && (
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Note:</span>
              <p className="flex-1 text-foreground whitespace-pre-wrap">{event.notes}</p>
            </div>
          )}
        </div>
      </section>

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
