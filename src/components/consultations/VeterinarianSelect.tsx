import { SearchSelect } from '../common/SearchSelect';
import { useRemoteSelect } from '../common/useRemoteSelect';
import { DEFAULT_QUERY } from '../../services/IPaginated';
import type { IUserResponse } from '../../services/users/IUser';
import { handleGetByIdUser, handleGetUsersPage } from '../../services/users/userService';

interface VeterinarianSelectProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  error?: string;
  disabled?: boolean;
}

function toOption(user: IUserResponse) {
  return {
    id: String(user.id),
    primary: user.fullName ?? '',
    secondary: user.dni ?? '',
  };
}

async function searchOptions(search: string) {
  const { items } = await handleGetUsersPage({ ...DEFAULT_QUERY, role: 'Veterinarian', includeSuspended: false, search });
  return items.map(toOption);
}

async function loadOption(id: string) {
  return toOption(await handleGetByIdUser(id));
}

export function VeterinarianSelect({ label, value, onChange, error, disabled = false }: VeterinarianSelectProps) {
  const search = useRemoteSelect({
    value,
    onChange,
    searchOptions,
    loadOption,
    missingLabel: 'No se pudo cargar el veterinario',
  });

  return (
    <SearchSelect
      {...search}
      label={label}
      value={value}
      placeholder="Escribe el nombre del veterinario"
      searchHint={`Escribí al menos ${search.minSearchLength} caracteres del nombre para buscar.`}
      loadingLabel="Buscando veterinarios..."
      notFoundLabel="No se encontraron veterinarios con ese nombre."
      error={error}
      disabled={disabled}
    />
  );
}
