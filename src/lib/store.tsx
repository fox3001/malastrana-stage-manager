import { create } from "zustand";
import { EVENTS, COLLABORATORS, COSTUMES, GEAR, NOTIFICATIONS } from "@/data/demo";

export type AvailabilityResponse = "yes" | "no";
export type BollaItemStatus = "presente" | "danneggiato" | "mancante";
export type EventStatus = "richiesta" | "da_definire" | "confermato" | "annullato" | "chiuso";

export type DemoEvent = typeof EVENTS[number];

export interface BollaItem {
  id: string;
  code: string;
  name: string;
  type: "costume" | "oggetto" | "scenografia";
  size: string;
  qty: number;
  notes?: string;
}

export interface Bolla {
  id: string;
  code: string;
  date: string;
  eventCode: string;
  items: BollaItem[];
  closed: boolean;
  teamLeaderId?: string;
}

export interface DemoEventExtended {
  id: string;
  code: string;
  name: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  status: EventStatus;
  contactName?: string;
  contactPhone?: string;
  adminNotes?: string;
  tlComments?: string;
  tlClosedAt?: string;
  adminApprovedAt?: string;
}

export interface DemoState {
  events: DemoEventExtended[];
  availability: Record<string, AvailabilityResponse | undefined>;
  costumes: typeof COSTUMES;
  gear: typeof GEAR;
  bolle: Bolla[];
  bollaItemsState: Record<string, BollaItemStatus | undefined>;
  setAvailabilityResponse: (eventId: string, response: AvailabilityResponse) => void;
  clearAvailabilityResponse: (eventId: string) => void;
  setBollaItemStatus: (itemId: string, status: BollaItemStatus) => void;
  addBolla: (bolla: Bolla) => void;
  closeBolla: (bollaCode: string) => void;
  reopenBolla: (bollaCode: string) => void;
  setBollaTeamLeader: (bollaCode: string, collaboratorId: string) => void;
  updateEvent: (code: string, updates: Partial<DemoEventExtended>) => void;
  closeEventByTL: (code: string, comments?: string) => void;
  approveEventClosure: (code: string) => void;
}

export const useDemo = create<DemoState>((set) => ({
  events: EVENTS.map((e) => ({ ...e, contactName: "", contactPhone: "", adminNotes: "", tlComments: "" })),
  availability: {},
  costumes: COSTUMES,
  gear: GEAR,
  bolle: [],
  bollaItemsState: {},

  setAvailabilityResponse: (eventId, response) =>
    set((state) => ({
      availability: {
        ...state.availability,
        [eventId]: response,
      },
    })),

  clearAvailabilityResponse: (eventId) =>
    set((state) => {
      const next = { ...state.availability };
      delete next[eventId];
      return { availability: next };
    }),

  setBollaItemStatus: (itemId, status) =>
    set((state) => ({
      bollaItemsState: {
        ...state.bollaItemsState,
        [itemId]: status,
      },
    })),

  addBolla: (bolla) =>
    set((state) => ({
      bolle: [...state.bolle, bolla],
    })),

  closeBolla: (bollaCode) =>
    set((state) => ({
      bolle: state.bolle.map((b) =>
        b.code === bollaCode ? { ...b, closed: true } : b,
      ),
    })),

  reopenBolla: (bollaCode) =>
    set((state) => ({
      bolle: state.bolle.map((b) =>
        b.code === bollaCode ? { ...b, closed: false } : b,
      ),
    })),

  setBollaTeamLeader: (bollaCode, collaboratorId) =>
    set((state) => ({
      bolle: state.bolle.map((b) =>
        b.code === bollaCode ? { ...b, teamLeaderId: collaboratorId } : b,
      ),
    })),

  updateEvent: (code, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.code === code ? { ...e, ...updates } : e,
      ),
    })),

  closeEventByTL: (code, comments) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.code === code
          ? { ...e, status: "chiuso", tlComments: comments || "", tlClosedAt: new Date().toISOString() }
          : e,
      ),
    })),

  approveEventClosure: (code) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.code === code
          ? { ...e, adminApprovedAt: new Date().toISOString() }
          : e,
      ),
    })),
}));

// Export utili per compatibilità²²
export { COLLABORATORS, NOTIFICATIONS };
