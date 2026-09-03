import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { CreateButton } from '../../components/common/CreateButton';
import { List } from '../../components/pets/PetList';
import { handleGetAllPet } from '../../services/pets/petService';
import type { Pet } from '../../components/pets/petTypes';

const CREATE_TO = '/pets/new';
const CREATE_LABEL = 'Nueva mascota';

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
    <ScreenShell
      eyebrow="Sysadmin"
      title="Mascotas"
      icon={PawPrint}
      homeTo="/"
      action={<CreateButton to={CREATE_TO} label={CREATE_LABEL} variant="header" />}
    >
      <List
        pets={pets}
        isLoading={isLoading}
        error={error}
        createTo={CREATE_TO}
        createLabel={CREATE_LABEL}
        itemTo={(petId) => `/pets/${petId}`}
      />

      <Outlet context={{ pets, removePet }} />
    </ScreenShell>
  );
}
