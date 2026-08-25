import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '@/components/AppShell'
import { useDemo } from '@/data/demo'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { CalendarDays, MapPin, Clock, Euro, Phone, Users, Shirt } from 'lucide-react'

export const Route = createFileRoute('/admin/eventi/$code')({
  component: AdminEventiDettaglio,
})

function AdminEventiDettaglio() {
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

  const proposedAnimators = eventAssignments.filter((a) => a.status === 'proposto')
  const confirmedAnimators = eventAssignments.filter((a) => a.status === 'confermato')

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

        <Tabs defaultValue="team">
          <TabsList>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="animatori">Animatori</TabsTrigger>
            <TabsTrigger value="costumi">Costumi</TabsTrigger>
            <TabsTrigger value="materiale">Materiale</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            <h2 className="text-lg font-semibold">Team</h2>
            {eventTeam.length === 0 ? (
              <p className="text-muted-foreground">Nessun membro nel team</p>
            ) : (
              eventTeam.map((member) => (
                <Card key={member.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    {member.isTeamLeader && (
                      <Badge variant="outline">Team Leader</Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="animatori" className="space-y-4">
            <h2 className="text-lg font-semibold">Animatori proposti</h2>
            {proposedAnimators.length === 0 ? (
              <p className="text-muted-foreground">Nessun animatore proposto</p>
            ) : (
              proposedAnimators.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{a.animatorName}</p>
                    <p className="text-sm text-muted-foreground">{a.role}</p>
                  </CardContent>
                </Card>
              ))
            )}
            <h2 className="text-lg font-semibold">Animatori confermati</h2>
            {confirmedAnimators.length === 0 ? (
              <p className="text-muted-foreground">Nessun animatore confermato</p>
            ) : (
              confirmedAnimators.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{a.animatorName}</p>
                    <p className="text-sm text-muted-foreground">{a.role}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="costumi" className="space-y-4">
            <h2 className="text-lg font-semibold">Costumi</h2>
            {eventCostumes.length === 0 ? (
              <p className="text-muted-foreground">Nessun costume</p>
            ) : (
              eventCostumes.map((c) => (
                <Card key={c.id}>
                  <CardContent className="flex items-center gap-2 p-4">
                    <Shirt className="h-4 w-4" />
                    <span>{c.name} ({c.size})</span>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="materiale" className="space-y-4">
            <h2 className="text-lg font-semibold">Materiale</h2>
            {eventMaterials.length === 0 ? (
              <p className="text-muted-foreground">Nessun materiale</p>
            ) : (
              eventMaterials.map((m) => (
                <Card key={m.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-muted-foreground">Qta: {m.quantity}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
