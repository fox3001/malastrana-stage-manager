import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EVENTS,
  COLLABORATORS,
  COSTUMES,
  GEAR,
  LOAD_ROWS,
  NOTIFICATIONS,
  type Costume,
  type GearItem,
  type LoadRow,
  type MalEvent,
} from "@/data/demo";

export type AvailabilityResponse = "yes" | "no" | "disponibile" | "non_disponibile" | "da_definire";

export interface TimelineEntry {
  id: string;
  text: string;
  at: string;
}

interface DemoState {
  events: MalEvent[];
  costumes: Costume[];
  gear: GearItem[];
  load: LoadRow[];
  timeline: TimelineEntry[];
  availability: Record<string, AvailabilityResponse | undefined>;
  setAvailability: (eventId: string, response: AvailabilityResponse) => void;
  setAvailabilityResponse: (eventId: string, response: AvailabilityResponse) => void;
  clearAvailabilityResponse: (eventId: string) => void;
  addCostume: (costume: Omit<Costume, "id" | "verification" | "owner">) => void;
  updateLoadRow: (id: string, patch: Partial<LoadRow>, note?: string) => void;
}

const STORAGE_KEY = "malastrana-demo-v1";

const DemoContext = createContext<DemoState | null>(null);

interface Persisted {
  availability: Record<string, AvailabilityResponse | undefined>;
  costumes: Costume[];
  load: LoadRow[];
  timeline: TimelineEntry[];
}

const initial: Persisted = {
  availability: {},
  costumes: COSTUMES,
  load: LOAD_ROWS,
  timeline: [],
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as Partial<Persisted>) });
    } catch {
      /* prototipo: ignora storage non disponibile */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const setAvailability = useCallback((eventId: string, response: AvailabilityResponse) => {
    setState((s) => ({ ...s, availability: { ...s.availability, [eventId]: response } }));
  }, []);

  const clearAvailabilityResponse = useCallback((eventId: string) => {
    setState((s) => {
      const availability = { ...s.availability };
      delete availability[eventId];
      return { ...s, availability };
    });
  }, []);

  const addCostume = useCallback((costume: Omit<Costume, "id" | "verification" | "owner">) => {
    setState((s) => ({
      ...s,
      costumes: [
        {
          ...costume,
          id: `cos-${Date.now()}`,
          verification: "inserito",
          owner: "Elena Rossi",
        },
        ...s.costumes,
      ],
    }));
  }, []);

  const updateLoadRow = useCallback((id: string, patch: Partial<LoadRow>, note?: string) => {
    setState((s) => ({
      ...s,
      load: s.load.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      timeline: note
        ? [
            {
              id: `tl-${Date.now()}`,
              text: note,
              at: new Date().toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...s.timeline,
          ]
        : s.timeline,
    }));
  }, []);

  const value = useMemo<DemoState>(
    () => ({
      events: EVENTS,
      gear: GEAR,
      costumes: state.costumes,
      load: state.load,
      timeline: state.timeline,
      availability: state.availability,
      setAvailability,
      setAvailabilityResponse: setAvailability,
      clearAvailabilityResponse,
      addCostume,
      updateLoadRow,
    }),
    [state, setAvailability, clearAvailabilityResponse, addCostume, updateLoadRow],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo deve essere usato dentro DemoProvider");
  return ctx;
}

export { COLLABORATORS, NOTIFICATIONS };
