import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DemoNote, Tags, Thumb, VerificationTag } from "@/components/ui-kit";
import { useDemo } from "@/lib/store";
import { COLLABORATORS } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/costumi")({
  head: () => ({
    meta: [
      { title: "Ricerca costumi — Regia Malastrana" },
      {
        name: "description",
        content:
          "Ricerca dimostrativa dei costumi per hashtag, personaggio o proprietario.",
      },
      { property: "og:title", content: "Ricerca costumi — Regia Malastrana" },
      {
        property: "og:description",
        content: "Archivio costumi del prototipo Malastrana.",
      },
      { property: "og:url", content: "/admin/costumi" },
    ],
    links: [{ rel: "canonical", href: "/admin/costumi" }],
  }),
  component: RicercaCostumi,
});

function RicercaCostumi() {
  const { costumes } = useDemo();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(costumes.flatMap((c) => c.tags))).sort(),
    [costumes],
  );

  const query = q.trim().toLowerCase();
  const list = costumes.filter((c) => {
    const okTag = !tag || c.tags.includes(tag);
    const okQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.character ?? "").toLowerCase().includes(query) ||
      c.tags.join(" ").toLowerCase().includes(query);
    return okTag && okQuery;
  });

  const ownerName = (id: string) =>
    COLLABORATORS.find((c) => c.id === id)?.name ?? "Collaboratore";

  return (
    <AppShell area="admin" title="Ricerca costumi" back="/admin">
      <section className="px-3 pt-5">
        <h2 className="font-serif text-2xl text-foreground">Archivio costumi</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cerca per hashtag o personaggio: “chi ha un costume da pirata?”.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="#pirata, Cavaliere Nero…"
          className="mt-4 min-h-12 w-full border border-border-strong bg-surface px-3 text-sm text-foreground"
        />
      </section>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-3 pb-1">
        {allTags.map((t) => (
          <button
            key={t}
            onClick={() => setTag(tag === t ? null : t)}
            className={cn(
              "eyebrow min-h-9 shrink-0 border px-3",
              tag === t
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border-strong bg-surface text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-4 border-t border-border">
        {list.map((c) => (
          <li key={c.id} className="flex gap-3 border-b border-border px-3 py-3.5">
            <Thumb label={c.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base text-foreground">{c.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {ownerName(c.owner)}
                {c.character ? ` · ${c.character}` : ""}
              </p>
              <div className="mt-1.5">
                <Tags tags={c.tags} />
              </div>
              <div className="mt-2">
                <VerificationTag value={c.verification} />
              </div>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-3 py-6 text-sm text-muted-foreground">
            Nessun costume corrisponde alla ricerca.
          </li>
        )}
      </ul>

      <div className="mt-8 px-3">
        <DemoNote />
      </div>
    </AppShell>
  );
}
