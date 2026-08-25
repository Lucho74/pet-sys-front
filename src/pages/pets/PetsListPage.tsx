import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { List } from '../../components/pets/List';
import { handleGetAllPet } from '../../services/pets/petService';
import type { Pet } from '../../components/pets/types';

export function PetsListPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    handleGetAllPet()
      .then((response) =>
        setPets(
          response.map((pet) => ({
            id: pet.id,
            name: pet.name?.trim() || 'Sin nombre',
            specie: pet.specie?.trim() || '',
            breed: pet.breed?.trim() || '',
            birthDate: pet.birthDate?.slice(0, 10) || '',
          })),
        ),
      )
      .catch(() => {
        setError('No se pudo cargar la lista de mascotas. Intenta nuevamente.');
        toast.error('No se pudo cargar la lista de mascotas.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const removePet = (petId: number) => {
    setPets((current) => current.filter((pet) => pet.id !== petId));
  };

  return (
    <ScreenShell eyebrow="Sysadmin" title="Mascotas" icon={PawPrint} homeTo="/">
      <List
        pets={pets}
        isLoading={isLoading}
        error={error}
        createTo="/pets/new"
        itemTo={(petId) => `/pets/${petId}`}
      />

      <Outlet context={{ pets, removePet }} />
    </ScreenShell>
  );
}
