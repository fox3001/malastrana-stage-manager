export interface Event {
  code: string;
  title: string;
  date: string;
  location: string;
  meetTime: string;
  startTime: string;
  endTime: string;
  payRate: "A" | "B" | "C";
  contactName: string;
  contactPhone: string;
  notes: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: "Junior" | "Senior" | "Master";
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

export const payRates = {
  A: { level: "A", role: "Junior", amount: 50 },
  B: { level: "B", role: "Senior", amount: 75 },
  C: { level: "C", role: "Master", amount: 100 },
};

export const collaborators: Collaborator[] = [
  { id: "c1", name: "Alice", role: "Junior" },
  { id: "c2", name: "Bob", role: "Senior" },
  { id: "c3", name: "Charlie", role: "Master" },
];

export const events: Event[] = [
  {
    code: "E001",
    title: "Festa di Benvenuto",
    date: "2026-09-10",
    location: "Teatro Centrale",
    meetTime: "17:00",
    startTime: "18:00",
    endTime: "23:00",
    payRate: "B",
    contactName: "Marco Rossi",
    contactPhone: "+39 333 1234567",
    notes: "Portare costume nero. Briefing 15 min prima.",
  },
  {
    code: "E002",
    title: "Spettacolo di Fine Stagione",
    date: "2026-12-20",
    location: "Arena Grande",
    meetTime: "14:00",
    startTime: "15:00",
    endTime: "20:00",
    payRate: "C",
    contactName: "Laura Bianchi",
    contactPhone: "+39 345 9876543",
    notes: "Prova generale alle 13:00. Cena inclusa.",
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

export function getPayForRole(role: "Junior" | "Senior" | "Master"): number {
  if (role === "Junior") return payRates.A.amount;
  if (role === "Senior") return payRates.B.amount;
  return payRates.C.amount;
}

export function getRoleFromPayRate(payRate: "A" | "B" | "C"): "Junior" | "Senior" | "Master" {
  if (payRate === "A") return "Junior";
  if (payRate === "B") return "Senior";
  return "Master";
}
