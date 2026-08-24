import { create } from "zustand";
import { EVENTS, COLLABORATORS, COSTUMES, GEAR, NOTIFICATIONS } from "@/data/demo";

export type AvailabilityResponse = "yes" | "no";
export type BollaItemStatus = "presente" | "danneggiato" | "mancante";

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

export interface DemoState {
  events: DemoEvent[];
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
}

export const useDemo = create<DemoState>((set) => ({
  events: EVENTS,
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
}));

// Export utili per compatibilità²²
export { COLLABORATORS, NOTIFICATIONS };
