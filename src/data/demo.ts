export interface Event {
  code: string;
  title: string;
  date: string;
  location: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
}

export interface EventAvailability {
  eventId: string;
  userId: string;
  name: string;
  proposed: boolean;
  confirmed?: boolean;
  isTL?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  eventId?: string;
  read: boolean;
  createdAt: string;
}

export const collaborators: Collaborator[] = [
  { id: "c1", name: "Alice", role: "Animatore" },
  { id: "c2", name: "Bob", role: "Animatore" },
  { id: "c3", name: "Charlie", role: "Animatore" },
];

export const events: Event[] = [
  {
    code: "E001",
    title: "Festa di Benvenuto",
    date: "2026-09-10",
    location: "Teatro Centrale",
  },
  {
    code: "E002",
    title: "Spettacolo di Fine Stagione",
    date: "2026-12-20",
    location: "Arena Grande",
  },
];

export const eventAvailability: EventAvailability[] = [
  { eventId: "E001", userId: "c1", name: "Alice", proposed: true, confirmed: false, isTL: false },
  { eventId: "E001", userId: "c2", name: "Bob", proposed: true, confirmed: false, isTL: false },
  { eventId: "E002", userId: "c1", name: "Alice", proposed: true, confirmed: false, isTL: false },
  { eventId: "E002", userId: "c3", name: "Charlie", proposed: true, confirmed: false, isTL: false },
];

export const notifications: Notification[] = [];

export function getEventByCode(code: string): Event | undefined {
  return events.find((e) => e.code === code);
}

export function getAvailabilityForEvent(eventId: string): EventAvailability[] {
  return eventAvailability.filter((a) => a.eventId === eventId);
}

export function confirmAnimator(eventId: string, userId: string, isTL: boolean) {
  const entry = eventAvailability.find((a) => a.eventId === eventId && a.userId === userId);
  if (!entry) return;
  entry.confirmed = true;
  entry.isTL = isTL;
  notifications.push({
    id: `n-${Date.now()}-${userId}`,
    userId,
    title: "Conferma disponibilità",
    message: `Sei stato confermato come animatore per l'evento ${eventId}${isTL ? " (Team Leader)" : ""}.`,
    eventId,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function unconfirmAnimator(eventId: string, userId: string) {
  const entry = eventAvailability.find((a) => a.eventId === eventId && a.userId === userId);
  if (!entry) return;
  entry.confirmed = false;
  entry.isTL = false;
}

export function getNotificationsForUser(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId);
}

export function markNotificationRead(notificationId: string) {
  const n = notifications.find((x) => x.id === notificationId);
  if (n) n.read = true;
}
