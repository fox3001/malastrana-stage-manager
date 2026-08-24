import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Bell, ChevronLeft, Home, Menu, Shirt, X } from "lucide-react";
import { ReactNode, useState } from "react";

export type AppShellArea = "u" | "admin";

export function AppShell({
  area,
  children,
  title,
  notifications,
  back,
}: {
  area: AppShellArea;
  children: ReactNode;
  title?: string;
  notifications?: number;
  back?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const router = useRouter();

  const isHome = location.pathname === "/u" || location.pathname === "/admin";
  const showBack = !isHome;

  const handleBack = () => {
    if (back) {
      router.navigate({ to: back as any });
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate({ to: area === "admin" ? "/admin" : "/u" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border-strong bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={handleBack}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground active:bg-muted sm:flex"
                aria-label="Indietro"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
              </button>
            )}
            <div>
              <p className="font-serif text-lg leading-none text-primary">
                {area === "admin" ? "Malastrana" : "Ciao, utente"}
              </p>
              <p className="eyebrow text-xs text-muted-foreground">
                {area === "admin" ? "Stage Manager" : "Area riservata"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {area === "admin" && notifications && notifications > 0 && (
              <Link
                to="/admin/notifiche"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
                aria-label="Notifiche"
              >
                <Bell className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {notifications}
                </span>
              </Link>
            )}
            <Link
              to={area === "admin" ? "/admin" : "/u"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
              aria-label="Torna alla home"
              title="Torna alla home"
            >
              <Home className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
              aria-label="Apri menu"
            >
              <Menu className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl pb-20">{children}</main>

      <nav
        className={`fixed inset-y-0 right-0 z-30 w-64 transform border-l border-border bg-surface shadow-xl transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-serif text-lg text-primary">Menu</p>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface"
            aria-label="Chiudi menu"
          >
            <X className="h-4 w-4 text-foreground" strokeWidth={1.8} />
          </button>
        </div>
        <ul className="p-4">
          <li className="mb-3">
            <Link
              to={area === "admin" ? "/admin" : "/u"}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
              <Home className="h-4 w-4" strokeWidth={1.5} />
              Home {area === "admin" ? "Admin" : "Utente"}
            </Link>
          </li>
          {area === "admin" && (
            <>
              <li className="mb-3">
                <Link
                  to="/admin/eventi"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Shirt className="h-4 w-4" strokeWidth={1.5} />
                  Eventi
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/admin/collaboratori"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Shirt className="h-4 w-4" strokeWidth={1.5} />
                  Collaboratori
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/admin/costumi"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Shirt className="h-4 w-4" strokeWidth={1.5} />
                  Costumi
                </Link>
              </li>
            </>
          )}
          {area === "u" && (
            <>
              <li className="mb-3">
                <Link
                  to="/u/eventi"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Shirt className="h-4 w-4" strokeWidth={1.5} />
                  I tuoi eventi
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/u/disponibilita"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <Shirt className="h-4 w-4" strokeWidth={1.5} />
                  Disponibilità
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
