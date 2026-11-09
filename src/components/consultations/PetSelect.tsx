import { SearchSelect } from '../common/SearchSelect';
import { useRemoteSelect } from '../common/useRemoteSelect';
import { DEFAULT_QUERY } from '../../services/IPaginated';
import type { IPetResponse } from '../../services/pets/IPet';
import { handleGetByIdPet, handleGetPetsPage } from '../../services/pets/petService';

interface PetSelectProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  error?: string;
  disabled?: boolean;
}

function toOption(pet: IPetResponse) {
  return {
    id: String(pet.id),
    primary: pet.name ?? '',
    secondary: pet.breedName ?? '',
  };
}

async function searchOptions(search: string) {
  const { items } = await handleGetPetsPage({ ...DEFAULT_QUERY, includeSuspended: false, search });
  return items.map(toOption);
}

async function loadOption(id: string) {
  return toOption(await handleGetByIdPet(id));
}

export function PetSelect({ label, value, onChange, error, disabled = false }: PetSelectProps) {
  const search = useRemoteSelect({
    value,
    onChange,
    searchOptions,
    loadOption,
    missingLabel: 'No se pudo cargar la mascota',
  });

  return (
    <SearchSelect
      {...search}
      label={label}
      value={value}
      placeholder="Escribe el nombre de la mascota"
      searchHint={`Escribí al menos ${search.minSearchLength} caracteres del nombre para buscar.`}
      loadingLabel="Buscando mascotas..."
      notFoundLabel="No se encontraron mascotas con ese nombre."
      error={error}
      disabled={disabled}
    />
  );
}
