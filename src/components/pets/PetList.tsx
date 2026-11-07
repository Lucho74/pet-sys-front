import { Link } from 'react-router-dom';
import type { Pet } from './petTypes';
import { initials } from '../../utils/initials';
import { formatDate } from '../../utils/datetime';
import { ListState } from '../common/ListState';
import { activeFirst } from '../common/listStyles';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PetListProps {
  pets: Pet[];
  isLoading: boolean;
  error: string;
  itemTo: (petId: number) => string;
  emptyLabel: string;
}

export function PetList({
  pets,
  isLoading,
  error,
  itemTo,
  emptyLabel,
}: PetListProps) {
  const hasPets = !isLoading && !error && pets.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasPets ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {activeFirst(pets).map((pet) => (
                <li key={pet.id}>
                  <Link to={itemTo(pet.id)}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardHeader className="flex items-center gap-3">
                        <Avatar size="lg">
                          <AvatarFallback className={pet.isSuspended ? '' : 'bg-primary text-primary-foreground'}>
                            {initials(pet.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <CardTitle className="flex items-center gap-2">
                            {pet.name}
                            {pet.isSuspended && <Badge variant="outline">Suspendido</Badge>}
                          </CardTitle>
                          <CardDescription>
                            {pet.specie} · {pet.breed}
                            {pet.birthDate && <> · Nacimiento: {formatDate(pet.birthDate)}</>}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={pets.length === 0}
              loadingLabel="Cargando mascotas..."
              emptyLabel={emptyLabel}
            />
          )}
        </div>
      </div>

    </>
  );
}
