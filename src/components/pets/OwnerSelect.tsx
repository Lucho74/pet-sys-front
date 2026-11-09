import { SearchSelect } from '../common/SearchSelect';
import { useRemoteSelect } from '../common/useRemoteSelect';
import { DEFAULT_QUERY } from '../../services/IPaginated';
import type { IUserResponse } from '../../services/users/IUser';
import { handleGetByIdUser, handleGetUsersPage } from '../../services/users/userService';

interface OwnerSelectProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  error?: string;
  disabled?: boolean;
}

function toOption(user: IUserResponse) {
  return {
    id: String(user.id),
    primary: user.fullName?.trim() || 'Sin nombre',
    secondary: user.dni ? `DNI ${user.dni}` : '',
  };
}

async function searchOptions(search: string) {
  const { items } = await handleGetUsersPage({ ...DEFAULT_QUERY, role: 'Client', includeSuspended: false, search });
  return items.map(toOption);
}

async function loadOption(id: string) {
  return toOption(await handleGetByIdUser(id));
}

export function OwnerSelect({ label, value, onChange, error, disabled = false }: OwnerSelectProps) {
  const search = useRemoteSelect({
    value,
    onChange,
    searchOptions,
    loadOption,
    missingLabel: 'No se pudo cargar el dueño',
  });

  return (
    <SearchSelect
      {...search}
      label={label}
      value={value}
      placeholder="Escribí el nombre del dueño"
      searchHint={`Escribí al menos ${search.minSearchLength} caracteres para buscar.`}
      loadingLabel="Buscando clientes..."
      notFoundLabel="No se encontraron clientes."
      error={error}
      disabled={disabled}
    />
  );
}
