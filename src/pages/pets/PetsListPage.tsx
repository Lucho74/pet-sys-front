import { useEffect, useState } from 'react';
import { PawPrint, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { EMPTY_PAGINATION, PAGE_SIZE, type Pagination } from '../../services/IPaginated';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ListState } from '../../components/common/ListState';
import { PetTable } from '../../components/pets/PetTable';
import { activeFirst } from '../../components/common/listStyles';
import { handleGetPetsPage } from '../../services/pets/petService';
import type { Pet } from '../../components/pets/petTypes';

const CREATE_TO = '/pets/new';
const CREATE_LABEL = 'Nueva mascota';

export function PetsListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    handleGetPetsPage(page, pageSize)
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
  }, [page, pageSize]);

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
        {!isLoading && !error && pets.length > 0 ? (
          <PetTable
            pets={activeFirst(pets)}
            pagination={pagination}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        ) : (
          <ListState
            isLoading={isLoading}
            error={error}
            isEmpty={pets.length === 0}
            loadingLabel="Cargando mascotas..."
            emptyLabel="Todavía no hay mascotas. Creá la primera con «Nueva mascota»."
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
