import type { IPetResponse } from '../../services/pets/IPet';
import { MIN_SEARCH_LENGTH, SearchSelect } from '../common/SearchSelect';

const MAX_NAME_LENGTH = 30;

interface PetSelectProps {
  label: string;
  pets: IPetResponse[];
  value: string;
  onChange: (petId: string) => void;
  isLoadingPets?: boolean;
  petsError?: string;
  error?: string;
  disabled?: boolean;
}

export function PetSelect({
  label,
  pets,
  value,
  onChange,
  isLoadingPets = false,
  petsError = '',
  error,
  disabled = false,
}: PetSelectProps) {
  const options = pets.map((pet) => ({
    id: pet.id,
    primary: pet.name ?? '',
    secondary: pet.breed ?? '',
  }));

  const selected = pets.find((pet) => String(pet.id) === value) ?? null;
  const selectedName = selected?.name || 'Sin nombre';

  return (
    <SearchSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Escribe el nombre de la mascota"
      maxLength={MAX_NAME_LENGTH}
      searchHint={`Escribe al menos ${MIN_SEARCH_LENGTH} caracteres del nombre para buscar.`}
      loadingLabel="Cargando mascotas..."
      notFoundLabel="No se encontraron mascotas con ese nombre."
      emptyPrimaryLabel="Sin nombre"
      emptySecondaryLabel="Sin raza"
      selectedHint={`Mascota: ${selectedName}`}
      clearLabel={`Quitar a ${selectedName} como mascota`}
      isLoading={isLoadingPets}
      loadError={petsError}
      error={error}
      disabled={disabled}
    />
  );
}
