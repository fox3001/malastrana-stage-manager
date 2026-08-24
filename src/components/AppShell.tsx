import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { type ReactNode } from "react";

export interface AppShellProps { area: "admin" | "u"; title: string; children: ReactNode; back?: string; }

export function AppShell({ area, title, children, back }: AppShellProps) {
  return <div className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center px-3 py-3"><div className="flex items-center gap-3"><Link to="/" aria-label="Torna alla schermata Chi sei" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-muted"><Home className="h-5 w-5" strokeWidth={1.5} /></Link>{back && <Link to={back} aria-label="Indietro" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-muted">←</Link>}<div><p className="eyebrow text-xs text-accent">{area === "admin" ? "Ufficio" : "Area personale"}</p><h1 className="font-serif text-xl text-primary">{title}</h1></div></div></div></header><main className="mx-auto max-w-5xl pb-8 pt-4">{children}</main></div>;
}
