import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  VERIFICATION_LABEL,
  dayNumber,
  monthShort,
  type Costume,
  type EventStatus,
} from "@/data/demo";

/* ------------------------------------------------------------------ */
/* Marchio e logo immagine                                             */
/* ------------------------------------------------------------------ */

export function LogoImage({ className }: { className?: string }) {
  return (
    <img
      src="/malastrana-logo.png"
      alt="Malastrana logo"
      className={cn("mx-auto block h-auto w-full max-w-[160px] sm:max-w-[200px]", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Etichette e stati                                                   */
/* ------------------------------------------------------------------ */

export function DemoNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "eyebrow text-muted-foreground/80 border-t border-border pt-2",
        className,
      )}
    >
      Prototipo UI — dati dimostrativi
    </p>
  );
}

const statusStyle: Record<EventStatus, string> = {
  richiesta: "border-warning/50 text-warning",
  confermato: "border-success/50 text-success",
  da_definire: "border-border-strong text-muted-foreground",
  annullato: "border-destructive/50 text-destructive",
  chiuso: "border-border-strong text-muted-foreground",
};

export function StatusTag({
  status,
  className,
}: {
  status: EventStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-1.5 border px-2 py-1",
        statusStyle[status],
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rotate-45 bg-current" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function VerificationTag({ value }: { value: Costume["verification"] }) {
  const tone =
    value === "verificato"
      ? "text-success border-success/40"
      : value === "in_verifica"
        ? "text-warning border-warning/40"
        : "text-muted-foreground border-border-strong";
  return (
    <span className={cn("eyebrow inline-block border px-2 py-0.5", tone)}>
      {VERIFICATION_LABEL[value]}
    </span>
  );
}

export function Tags({ tags }: { tags: string[] }) {
  return (
    <p className="font-sans text-xs text-accent">
      {tags.map((t, i) => (
        <span key={t}>
          {t}
          {i < tags.length - 1 ? <span className="text-border-strong"> · </span> : null}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Struttura                                                           */
/* ------------------------------------------------------------------ */

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 border-b border-border pb-2">
      <h2 className="font-serif text-lg leading-none text-foreground">{children}</h2>
      {action}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-3 border-b border-border py-2.5 last:border-b-0">
      <span className="eyebrow pt-0.5 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-sm text-foreground">{children}</span>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  full,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger";
  full?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground border-primary",
    accent: "bg-accent text-accent-foreground border-accent",
    outline: "bg-surface text-foreground border-border-strong",
    ghost: "bg-transparent text-accent border-transparent",
    danger: "bg-surface text-destructive border-destructive/50",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 border px-4 text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40",
        styles,
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  params,
  children,
  variant = "primary",
  full,
}: {
  to: string;
  params?: Record<string, string>;
  children: ReactNode;
  variant?: "primary" | "accent" | "outline";
  full?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground border-primary",
    accent: "bg-accent text-accent-foreground border-accent",
    outline: "bg-surface text-foreground border-border-strong",
  }[variant];
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 border px-4 text-[13px] font-semibold uppercase tracking-[0.1em] active:opacity-70",
        styles,
        full && "w-full",
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Riga evento (agenda)                                                */
/* ------------------------------------------------------------------ */

export function EventRow({
  to,
  params,
  date,
  name,
  place,
  time,
  code,
  status,
}: {
  to: string;
  params: Record<string, string>;
  date: string;
  name: string;
  place: string;
  time: string;
  code: string;
  status: EventStatus;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-border bg-surface px-3 py-3.5 active:bg-muted"
    >
      <span className="shrink-0 text-center">
        <span className="block font-serif text-2xl leading-none text-primary">
          {dayNumber(date)}
        </span>
        <span className="eyebrow mt-1 block text-muted-foreground">
          {monthShort(date)}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block truncate font-serif text-base text-foreground">{name}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {place} · {time}
        </span>
        <span className="mt-1.5 block font-sans text-[11px] tracking-wider text-muted-foreground/80">
          {code}
        </span>
        <span className="mt-2 block">
          <StatusTag status={status} />
        </span>
      </span>
      <Shield className="mt-1 h-5 w-5 shrink-0 text-border-strong" />
    </Link>
  );
}

export function Shield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l7 2.5v5.7c0 4.2-2.9 7.6-7 9.3-4.1-1.7-7-5.1-7-9.3V5.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const dim = { sm: "h-10 w-10 text-xs", md: "h-14 w-14 text-sm", lg: "h-28 w-28 text-2xl" }[
    size
  ];
  return (
    <span
      data-avatar-placeholder="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-primary/30 bg-secondary font-serif text-primary",
        dim,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Thumb({ label }: { label: string }) {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-secondary font-serif text-sm text-primary"
      aria-hidden="true"
    >
      {label.slice(0, 2).toUpperCase()}
    </span>
  );
}
