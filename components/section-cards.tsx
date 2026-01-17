import { IconCloud, IconUsers, IconCalendarTime, IconCrown } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  data: {
    planName: string;
    storage: string;
    usersLimit: string;
    history: string;
    price: number;
  };
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Plan Actuel</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl text-blue-600 dark:text-blue-400">
            {data.planName}
          </CardTitle>
          <CardAction>
            <Badge variant={data.price > 0 ? "default" : "outline"}>
              <IconCrown className="size-3 mr-1" /> 
              {data.price > 0 ? "Premium" : "Free"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Facturation : {data.price}€ / mois
          </div>
          <div className="text-muted-foreground">Statut : Compte actif</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stockage Cloud</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.storage}
          </CardTitle>
          <CardAction>
             <IconCloud className="text-blue-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-green-600">
            Synchro temps réel active
          </div>
          <div className="text-muted-foreground">Inclus dans {data.planName}</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Limite Utilisateurs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.usersLimit}
          </CardTitle>
          <CardAction>
             <IconUsers className="text-purple-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Membres du workspace
          </div>
          <div className="text-muted-foreground">Collaboration autorisée</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rétention Données</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.history}
          </CardTitle>
          <CardAction>
             <IconCalendarTime className="text-zinc-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sauvegarde automatique
          </div>
          <div className="text-muted-foreground">Récupération garantie</div>
        </CardFooter>
      </Card>
    </div>
  )
}