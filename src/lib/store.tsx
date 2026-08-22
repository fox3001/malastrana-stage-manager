/**
 * Store locale del prototipo.
 * Solo React state + localStorage: nessuna rete, nessun backend, nessuna auth.
 * In futuro le stesse funzioni potranno essere sostituite da chiamate reali
 * senza modificare i componenti che le consumano.
 */
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
  COSTUMES,
  EVENTS,
  GEAR,
  LOAD_ROWS,
  type Availability,
  type Costume,
  type GearItem,
  type LoadRow,
  type MalEvent,
} from "@/data/demo";

const KEY = "malastrana-demo-v1";

export interface TimelineEntry {
  id: string;
  text: string;
  at: string;
}

interface DemoState {
  events: MalEvent[];
  availability: Record<string, Availability>;
  costumes: Costume[];
  gear: GearItem[];
  load: LoadRow[];
  timeline: TimelineEntry[];
}

const initialState: DemoState = {
  events: EVENTS,
  availability: {},
  costumes: COSTUMES,
  gear: GEAR,
  load: LOAD_ROWS,
  timeline: [],
};

interface DemoContextValue extends DemoState {
  setAvailability: (eventId: string, value: Availability) => void;
  addCostume: (c: Omit<Costume, "id" | "owner" | "verification">) => void;
  updateLoadRow: (id: string, patch: Partial<LoadRow>, label: string) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* prototipo: ignoriamo storage non disponibile */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const pushTimeline = useCallback((text: string) => {
    setState((s) => ({
      ...s,
      timeline: [
        { id: crypto.randomUUID(), text, at: nowLabel() },
        ...s.timeline,
      ].slice(0, 12),
    }));
  }, []);

  const setAvailability = useCallback(
    (eventId: string, value: Availability) => {
      setState((s) => ({ ...s, availability: { ...s.availability, [eventId]: value } }));
    },
    [],
  );

  const addCostume = useCallback(
    (c: Omit<Costume, "id" | "owner" | "verification">) => {
      setState((s) => ({
        ...s,
        costumes: [
          ...s.costumes,
          { ...c, id: crypto.randomUUID(), owner: "col-elena", verification: "inserito" },
        ],
      }));
    },
    [],
  );

  const updateLoadRow = useCallback(
    (id: string, patch: Partial<LoadRow>, label: string) => {
      setState((s) => ({
        ...s,
        load: s.load.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        timeline: [
          { id: crypto.randomUUID(), text: label, at: nowLabel() },
          ...s.timeline,
        ].slice(0, 12),
      }));
    },
    [],
  );

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo(
    () => ({ ...state, setAvailability, addCostume, updateLoadRow, reset }),
    [state, setAvailability, addCostume, updateLoadRow, reset],
  );

  // pushTimeline è esposto internamente per estensioni future
  void pushTimeline;

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo deve essere usato dentro DemoProvider");
  return ctx;
}
