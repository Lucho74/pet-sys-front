import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IPetResponse } from '../../services/pets/IPet';
import { handleGetPetsByClient } from '../../services/pets/petService';
import { errorMessage } from '../../utils/errors';
import { ListState } from '../common/ListState';
import { TABLE_CARD_CLASSES } from '../common/listStyles';

export function UserPetsCard({ clientId }: { clientId: number }) {
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
      <CardHeader className="border-b border-[#DDE6ED] px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <h2 id="user-pets-title">Mascotas</h2>
          {!isLoading && !error && pets.length > 0 && <Badge variant="secondary">{pets.length}</Badge>}
        </CardTitle>
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
                  <Link
                    to={`/pets/${pet.id}`}
                    className={`group flex items-center gap-4 px-5 py-4 no-underline transition-colors hover:bg-[#DDE6ED]/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${
                      pet.isSuspended ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="wrap-anywhere text-[15px] font-semibold">{pet.name?.trim() || 'Sin nombre'}</div>
                      {breed && <div className="wrap-anywhere text-sm text-muted-foreground">{breed}</div>}
                    </div>
                    {pet.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
