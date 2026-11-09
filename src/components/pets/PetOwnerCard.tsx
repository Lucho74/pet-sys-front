import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { handleGetByIdUser } from '../../services/users/userService';
import { errorMessage } from '../../utils/errors';
import { initials } from '../../utils/initials';

export function PetOwnerCard({ clientId }: { clientId: number }) {
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    handleGetByIdUser(String(clientId))
      .then((owner) => {
        if (active) setOwnerName(owner.fullName?.trim() || 'Sin nombre');
      })
      .catch((error) => {
        if (active) setError(errorMessage(error, 'No se pudo cargar el dueño.'));
      });

    return () => {
      active = false;
    };
  }, [clientId]);

  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-wrap items-center gap-3">
        <Avatar className="size-11" aria-hidden="true">
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {ownerName ? initials(ownerName) : <UserRound className="size-5" />}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dueño</h2>
          {ownerName ? (
            <p className="wrap-anywhere text-base font-semibold">{ownerName}</p>
          ) : (
            <p role="status" className="text-sm text-muted-foreground">{error || 'Cargando dueño...'}</p>
          )}
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
