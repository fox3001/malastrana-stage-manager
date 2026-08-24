import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, UserRound } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10"><div className="text-center"><img src="/malastrana-logo.png" alt="Malastrana App" className="mx-auto mb-8 w-56 max-w-full object-contain" /><p className="mt-12 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Chi sei?</p></div><div className="mt-6 grid gap-4"><Link to="/u" className="flex items-center gap-4 border border-accent bg-accent px-5 py-5 text-white shadow-sm"><UserRound className="h-6 w-6" strokeWidth={1.5} /><span><span className="block text-base font-semibold uppercase tracking-[0.1em]">Utente</span><span className="mt-1 block text-sm text-white/85">Area collaboratore dimostrativa</span></span></Link><Link to="/admin" className="flex items-center gap-4 border border-primary bg-primary px-5 py-5 text-white shadow-sm"><ShieldCheck className="h-6 w-6" strokeWidth={1.5} /><span><span className="block text-base font-semibold uppercase tracking-[0.1em]">Admin</span><span className="mt-1 block text-sm text-white/85">Ufficio & Regia dimostrativa</span></span></Link></div><p className="mt-8 text-center text-sm leading-6 text-muted-foreground">La scelta è solo un ingresso visuale: non esiste login, non esiste autenticazione e non sono attivi ruoli o permessi reali.</p></main>;
}
