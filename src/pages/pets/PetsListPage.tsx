import { useEffect, useState } from 'react';
import { PawPrint, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { DEFAULT_QUERY, EMPTY_PAGINATION, type Pagination } from '../../services/IPaginated';
import type { IPetResponse, PetQuery } from '../../services/pets/IPet';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListState } from '../../components/common/ListState';
import { PetTable } from '../../components/pets/PetTable';
import { handleGetAllPet, handleGetPetsPage } from '../../services/pets/petService';
import type { Pet } from '../../components/pets/petTypes';

const CREATE_TO = '/pets/new';
const CREATE_LABEL = 'Nueva mascota';

export function PetsListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState<PetQuery>({ ...DEFAULT_QUERY, specie: '', breed: '' });
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [allPets, setAllPets] = useState<IPetResponse[]>([]);

  useEffect(() => {
    handleGetAllPet()
      .then(setAllPets)
      .catch(() => {});
  }, []);

  const species = [...new Set(allPets.map((pet) => pet.specie?.trim() || '').filter(Boolean))].sort();
  const breeds = [
    ...new Set(
      allPets
        .filter((pet) => !query.specie || pet.specie?.trim() === query.specie)
        .map((pet) => pet.breed?.trim() || '')
        .filter(Boolean),
    ),
  ].sort();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGetPetsPage(query)
        .then((response) => {
          setPagination(response);
          setPets(
            response.items.map((pet) => ({
              id: pet.id,
              name: pet.name?.trim() || 'Sin nombre',
              specie: pet.specie?.trim() || '',
              breed: pet.breed?.trim() || '',
              birthDate: pet.birthDate?.slice(0, 10) || '',
              clientId: pet.clientId,
              isDeleted: pet.isDeleted,
            })),
          );
        })
        .catch(() => {
          setError('No se pudo cargar la lista de mascotas. Intenta nuevamente.');
          toast.error('No se pudo cargar la lista de mascotas.');
        })
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <ScreenShell
      title="Mascotas"
      icon={PawPrint}
      homeTo="/"
      action={
        <Button asChild variant="secondary">
          <Link to={CREATE_TO}>
            <Plus /> {CREATE_LABEL}
          </Link>
        </Button>
      }
    >
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        {!isLoading && !error ? (
          <PetTable
            pets={pets}
            species={species}
            breeds={breeds}
            query={query}
            onQueryChange={setQuery}
            pagination={pagination}
          />
        ) : (
          <ListState
            isLoading={isLoading}
            error={error}
            isEmpty={false}
            loadingLabel="Cargando mascotas..."
            emptyLabel=""
          />
        )}
      </div>

      <div className="absolute inset-x-4 bottom-7 lg:hidden">
        <Button asChild size="lg" className="h-12 w-full shadow-[0_6px_16px_rgba(39,55,77,0.35)]">
          <Link to={CREATE_TO}>
            <Plus /> {CREATE_LABEL}
          </Link>
        </Button>
      </div>
    </ScreenShell>
  );
}
