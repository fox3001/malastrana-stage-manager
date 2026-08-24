import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Bell, Home, Menu, X } from "lucide-react";
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
  /**
   * Destinazione esplicita per il pulsante Indietro.
   * Se non fornita, il componente usa la history del router per tornare indietro
   * su tutte le route interne, tranne le Home `/u` e `/admin`.
   */
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
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
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
              aria-label="Home"
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-4m-14 4H5m-2 0v-4m2 4V9m10 11v-4m-2 4H9m-2 0V9m2 0V5m10 0V9m-2 0v12" />
                  </svg>
                  Eventi
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/admin/collaboratori"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M23 21v-2a4 4 0 00-2-3.87m-4-12a4 4 0 010 7.75" />
                  </svg>
                  Collaboratori
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/admin/costumi"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                  </svg>
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
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0v-4m-14 4H5m-2 0v-4m2 4V9m10 11v-4m-2 4H9m-2 0V9m2 0V5m10 0V9m-2 0v12" />
                  </svg>
                  I tuoi eventi
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to="/u/disponibilita"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
