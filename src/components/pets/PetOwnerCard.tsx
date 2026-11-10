import { Link } from 'react-router-dom';
import { ChevronRight, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { initials } from '../../utils/initials';

export function PetOwnerCard({ clientId, clientName }: { clientId: number; clientName: string }) {
  const ownerName = clientName.trim() || 'Sin nombre';

  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-wrap items-center gap-3">
        <Avatar className="size-11" aria-hidden="true">
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {initials(ownerName) || <UserRound className="size-5" />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dueño</h2>
          <p className="wrap-anywhere text-base font-semibold">{ownerName}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/users/${clientId}`}>
            Ver perfil
            <ChevronRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
