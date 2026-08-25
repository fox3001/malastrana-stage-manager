import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/u/eventi/$code')({
  component: UserEventiDettaglio,
})

function UserEventiDettaglio() {
  const { code } = Route.useParams()

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/u/eventi"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        ← Torna agli eventi
      </Link>

      <h1 className="font-serif text-2xl text-primary">Evento: {code}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dettagli evento in sviluppo. Per ora questa scheda è solo un placeholder.
      </p>
    </div>
  )
}
