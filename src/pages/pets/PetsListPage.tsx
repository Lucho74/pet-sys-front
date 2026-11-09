import { useEffect, useState } from 'react';
import { PawPrint, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { DEFAULT_QUERY, EMPTY_PAGINATION, type Pagination } from '../../services/IPaginated';
import type { PetQuery } from '../../services/pets/IPet';
import type { IBreed, ISpecies } from '../../services/species/ISpecies';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListState } from '../../components/common/ListState';
import { PetTable } from '../../components/pets/PetTable';
import { handleGetPetsPage } from '../../services/pets/petService';
import { handleGetAllSpecies, handleGetBreedsBySpecies } from '../../services/species/speciesService';
import { toPet, type Pet } from '../../components/pets/petTypes';

const CREATE_TO = '/pets/new';
const CREATE_LABEL = 'Nueva mascota';

export function PetsListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState<PetQuery>(DEFAULT_QUERY);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [species, setSpecies] = useState<ISpecies[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);

  useEffect(() => {
    handleGetAllSpecies()
      .then((response) => setSpecies(response.toSorted((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.speciesId) return;
    handleGetBreedsBySpecies(query.speciesId)
      .then((response) => setBreeds(response.toSorted((a, b) => a.name.localeCompare(b.name))))
      .catch(() => {});
  }, [query.speciesId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGetPetsPage(query)
        .then((response) => {
          setPagination(response);
          setPets(response.items.map(toPet));
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
        <Button asChild>
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
