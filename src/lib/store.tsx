import { create } from "zustand";
import { EVENTS, COLLABORATORS, COSTUMES, GEAR, NOTIFICATIONS } from "@/data/demo";

export type AvailabilityResponse = "yes" | "no";

export type DemoEvent = typeof EVENTS[number];

export interface DemoState {
  events: DemoEvent[];
  availability: Record<string, AvailabilityResponse | undefined>;
  costumes: typeof COSTUMES;
  gear: typeof GEAR;
  setAvailabilityResponse: (eventId: string, response: AvailabilityResponse) => void;
  clearAvailabilityResponse: (eventId: string) => void;
}

export const useDemo = create<DemoState>((set) => ({
  events: EVENTS,
  availability: {},
  costumes: COSTUMES,
  gear: GEAR,

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
}));

// Export utili per compatibilità²²
export { COLLABORATORS, NOTIFICATIONS };
