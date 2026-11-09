import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { IPetResponse } from '../../services/pets/IPet';
import { handleGetPetsByClient } from '../../services/pets/petService';
import { errorMessage } from '../../utils/errors';
import { ListState } from '../common/ListState';
import { TABLE_CARD_CLASSES, TABLE_HEAD_CLASSES, TABLE_HEADER_ROW_CLASSES, TABLE_ROW_CLASSES } from '../common/listStyles';

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
      <CardHeader className="px-4 py-4 sm:px-5">
        <CardTitle>
          <h2 id="user-pets-title" className="font-semibold">Mascotas</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading || error || pets.length === 0 ? (
          <div className="px-4 pb-4">
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={pets.length === 0}
              loadingLabel="Cargando mascotas..."
              emptyLabel="Este cliente todavía no tiene mascotas."
            />
          </div>
        ) : (
          <Table className="table-fixed" aria-labelledby="user-pets-title">
            <TableHeader>
              <TableRow className={TABLE_HEADER_ROW_CLASSES}>
                <TableHead scope="col" className={`${TABLE_HEAD_CLASSES} sm:px-5`}>Nombre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => {
                const name = pet.name?.trim() || 'Sin nombre';

                return (
                  <TableRow key={pet.id} className={TABLE_ROW_CLASSES}>
                    <TableCell className="p-0">
                      <Link
                        to={`/pets/${pet.id}`}
                        className="group flex items-center gap-3 px-4 py-3 no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-5"
                      >
                        <span className="min-w-0 flex-1 wrap-anywhere font-semibold whitespace-normal">{name}</span>
                        <Badge variant={pet.isSuspended ? 'outline' : 'secondary'}>
                          {pet.isSuspended ? 'Suspendida' : 'Activa'}
                        </Badge>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
