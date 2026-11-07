import type { IUserResponse } from '../../services/users/IUser';
import { MIN_SEARCH_LENGTH, SearchSelect } from '../common/SearchSelect';

const MAX_NAME_LENGTH = 100;

interface VeterinarianSelectProps {
  label: string;
  veterinarians: IUserResponse[];
  value: string;
  onChange: (veterinarianId: string) => void;
  isLoadingVeterinarians?: boolean;
  veterinariansError?: string;
  error?: string;
  disabled?: boolean;
}

export function VeterinarianSelect({
  label,
  veterinarians,
  value,
  onChange,
  isLoadingVeterinarians = false,
  veterinariansError = '',
  error,
  disabled = false,
}: VeterinarianSelectProps) {
  const options = veterinarians.map((veterinarian) => ({
    id: veterinarian.id,
    primary: veterinarian.fullName ?? '',
    secondary: veterinarian.dni ?? '',
  }));

  const selected = veterinarians.find((veterinarian) => String(veterinarian.id) === value) ?? null;
  const selectedName = selected?.fullName || 'Sin nombre';

  return (
    <SearchSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Escribe el nombre del veterinario"
      maxLength={MAX_NAME_LENGTH}
      searchHint={`Escribe al menos ${MIN_SEARCH_LENGTH} caracteres del nombre para buscar.`}
      loadingLabel="Cargando veterinarios..."
      notFoundLabel="No se encontraron veterinarios con ese nombre."
      emptyPrimaryLabel="Sin nombre"
      emptySecondaryLabel="Sin DNI"
      selectedHint={`Veterinario: ${selectedName}`}
      clearLabel={`Quitar a ${selectedName} como veterinario`}
      isLoading={isLoadingVeterinarians}
      loadError={veterinariansError}
      error={error}
      disabled={disabled}
    />
  );
}
