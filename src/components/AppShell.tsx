import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  Home,
  MoreHorizontal,
  Scroll,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Area = "user" | "admin";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
}

const USER_NAV: NavItem[] = [
  { to: "/u", label: "Home", icon: Home, exact: true },
  { to: "/u/eventi", label: "Eventi", icon: Scroll },
  { to: "/u/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/u/profilo", label: "Profilo", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Home", icon: Home, exact: true },
  { to: "/admin/eventi", label: "Eventi", icon: Scroll },
  { to: "/admin/collaboratori", label: "Collaboratori", icon: Users },
  { to: "/admin/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/admin/altro", label: "Altro", icon: MoreHorizontal },
];

export function AppShell({
  area,
  title,
  back,
  children,
  notifications = 0,
}: {
  area: Area;
  title: string;
  back?: string;
  children: ReactNode;
  notifications?: number;
}) {
  const nav = area === "user" ? USER_NAV : ADMIN_NAV;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 pt-safe px-safe backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-1">
            {back ? (
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={back as any}
                aria-label="Indietro"
                className="-ml-2 flex h-11 w-11 items-center justify-center text-primary"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <span className="eyebrow whitespace-nowrap text-primary">MALASTRANA</span>
            )}
          </div>
          <h1 className="min-w-0 truncate text-center font-serif text-base text-foreground">
            {title}
          </h1>
          <div className="flex items-center justify-end gap-1">
            <Link
              to="/"
              aria-label="Torna alla schermata iniziale"
              className="flex h-11 w-11 items-center justify-center text-accent"
            >
              <Home className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              {...({
                to: area === "user" ? "/u/notifiche" : "/admin/modulo/$slug",
                params: area === "user" ? undefined : { slug: "notifiche" },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any)}
              aria-label="Notifiche"
              className="relative flex h-11 w-11 items-center justify-center text-foreground"
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              {notifications > 0 && (
                <span className="absolute right-2 top-2 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground">
                  {notifications}
                </span>
              )}
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-3xl px-3 pb-1.5">
          <p className="eyebrow text-muted-foreground/70">
            {area === "user" ? "Area utente demo" : "Area admin demo"} · prototipo UI
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-safe pb-32">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-safe px-safe">
        <ul className="mx-auto flex w-full max-w-3xl">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to} className="flex-1">
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 1.9 : 1.4} />
                  <span className="w-full truncate text-center text-[10px] font-medium tracking-wide">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
