import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/AppShell'
import { useDemo } from '@/data/demo'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { CalendarDays, MapPin, Clock, Euro, Phone, Users, Shirt } from 'lucide-react'

export const Route = createFileRoute('/u/eventi/$code')({
  component: UserEventiDettaglio,
})

function UserEventiDettaglio() {
  const { code } = Route.useParams()
  const { events, team, costumes, materials, assignments, notifications } = useDemo()
  const user = useStore((s) => s.user)

  const event = events.find((e) => e.code === code)
  if (!event) return <AppShell user={user}><div>Evento non trovato</div></AppShell>

  const eventTeam = team.filter((t) => t.eventCode === event.code)
  const eventCostumes = costumes.filter((c) => c.eventCode === event.code)
  const eventMaterials = materials.filter((m) => m.eventCode === event.code)
  const eventAssignments = assignments.filter((a) => a.eventCode === event.code)
  const eventNotifications = notifications.filter((n) => n.eventCode === event.code)

  const myAssignment = eventAssignments.find((a) => a.userId === user?.id)
  const isTeamLeader = myAssignment?.isTeamLeader ?? false
  const hasBolla = eventAssignments.some((a) => a.userId === user?.id && a.hasBolla)

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <Badge variant={event.status === 'aperto' ? 'default' : 'secondary'}>
            {event.status}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dettagli evento</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{format(new Date(event.date), 'PPP', { locale: it })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.place}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Ritrovo: {event.timeStart}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Fine: {event.timeEnd}</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4" />
              <span>Tariffa: {event.rate} €</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{event.contactPhone}</span>
            </div>
            {event.notes && (
              <div className="md:col-span-2">
                <strong>Note:</strong> {event.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {myAssignment && (
          <Card>
            <CardHeader>
              <CardTitle>La tua convocazione</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Ruolo:</strong> {myAssignment.role}</p>
              {isTeamLeader && <Badge variant="outline">Team Leader</Badge>}
              {hasBolla && (
                <Button variant="outline" size="sm" onClick={() => Route.navigate({ to: '/u/bolla/$code', params: { code } })}>
                  Vedi bolla
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventTeam.length === 0 ? (
              <p className="text-muted-foreground">Nessun membro nel team</p>
            ) : (
              eventTeam.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  {member.isTeamLeader && <Badge variant="outline">Team Leader</Badge>}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costumi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventCostumes.length === 0 ? (
              <p className="text-muted-foreground">Nessun costume</p>
            ) : (
              eventCostumes.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  <span>{c.name} ({c.size})</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {eventMaterials.length === 0 ? (
              <p className="text-muted-foreground">Nessun materiale</p>
            ) : (
              eventMaterials.map((m) => (
                <div key={m.id}>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">Qta: {m.quantity}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
