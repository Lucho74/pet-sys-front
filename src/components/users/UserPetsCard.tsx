import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { IPetResponse } from '../../services/pets/IPet';
import { handleGetPetsByClient } from '../../services/pets/petService';
import { errorMessage } from '../../utils/errors';
import { ListState } from '../common/ListState';
import { DETAIL_LIST_LINK_CLASSES, TABLE_CARD_CLASSES } from '../common/listStyles';

export function UserPetsCard({ clientId, action }: { clientId: number; action?: ReactNode }) {
  const [pets, setPets] = useState<IPetResponse[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    handleGetPetsByClient(clientId)
      .then((pets) => { if (active) setPets(pets); })
      .catch((error) => {
        if (active) setError(errorMessage(error, 'No se pudieron cargar las mascotas.'));
      })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, [clientId]);

  return (
    <Card className={`${TABLE_CARD_CLASSES} gap-0 py-0 ring-0`}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE6ED] px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <h2 id="user-pets-title">Mascotas</h2>
          {!isLoading && !error && pets.length > 0 && <Badge variant="secondary">{pets.length}</Badge>}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading || error || pets.length === 0 ? (
          <div className="px-5 py-4">
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={pets.length === 0}
              loadingLabel="Cargando mascotas..."
              emptyLabel="Este cliente todavía no tiene mascotas."
            />
          </div>
        ) : (
          <ul aria-labelledby="user-pets-title" className="divide-y divide-[#DDE6ED]">
            {pets.map((pet) => {
              const breed = [pet.speciesName, pet.breedName].filter(Boolean).join(' · ');

              return (
                <li key={pet.id}>
                  <Item
                    asChild
                    className={`${DETAIL_LIST_LINK_CLASSES} ${
                      pet.isSuspended ? 'bg-muted/30 text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    <Link to={`/pets/${pet.id}`}>
                      <ItemContent className="min-w-0 gap-0">
                        <ItemTitle className="line-clamp-none block w-auto wrap-anywhere text-[15px] leading-[inherit] font-semibold">
                          {pet.name?.trim() || 'Sin nombre'}
                        </ItemTitle>
                        {breed && <ItemDescription className="line-clamp-none wrap-anywhere leading-[inherit]">{breed}</ItemDescription>}
                      </ItemContent>
                      {pet.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </Item>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
