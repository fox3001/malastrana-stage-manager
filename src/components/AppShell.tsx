import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ClipboardList, ShieldCheck } from "lucide-react";
import { type ReactNode } from "react";

export interface AppShellProps { area: "admin" | "u" | "user"; title: string; children: ReactNode; back?: string; notifications?: number; }

export function AppShell({ area, title, children, back }: AppShellProps) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const headerLabel = area === "admin" ? "ADMIN" : "AREA PERSONALE";
  const headerTitle = area === "admin" ? "Ufficio & Regia" : title;
  const headerClass = area === "admin" ? "bg-primary" : "bg-accent";
  return <div className="min-h-screen bg-background"><header className={`sticky top-0 z-40 ${headerClass} text-white`}><div className="mx-auto flex max-w-5xl items-center px-3 py-3"><div className="flex items-center gap-3">{back && <Link to={back} aria-label="Indietro" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/50 bg-white/10 text-white hover:bg-white/20">←</Link>}<div><p className="eyebrow text-xs text-white/85">{headerLabel}</p><h1 className="font-serif text-xl text-white">{headerTitle}</h1></div></div></div></header><main className="mx-auto max-w-5xl pb-24 pt-4">{children}</main><footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center justify-around px-3 py-2"><Link to="/" className="flex flex-col items-center gap-1 px-5 py-1 text-muted-foreground"><ShieldCheck className="h-5 w-5" strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-[0.08em]">Login</span></Link><Link to={isAdmin ? "/admin/altro" : "/u/profilo"} className="flex flex-col items-center gap-1 px-5 py-1 text-muted-foreground"><Bell className="h-5 w-5" strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-[0.08em]">Profilo</span></Link><Link to="/malamex" search={{ area: isAdmin ? "admin" : "utente" }} className="flex flex-col items-center gap-1 px-5 py-1 text-muted-foreground"><ClipboardList className="h-5 w-5" strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-[0.08em]">MalaMex</span></Link></div></footer></div>;
}
