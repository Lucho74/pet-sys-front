import { useCallback } from 'react';
import { SearchSelect } from '../common/SearchSelect';
import { useRemoteSelect } from '../common/useRemoteSelect';
import { DEFAULT_QUERY } from '../../services/IPaginated';
import type { IUserResponse } from '../../services/users/IUser';
import { handleGetByIdUser, handleGetUsersPage } from '../../services/users/userService';
import { matchesSearch } from '../../utils/search';

export interface ProfessionalOption {
  id: string;
  name: string;
}

interface VeterinarianSelectProps {
  label: string;
  value: string;
  ownProfessional?: ProfessionalOption;
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

export function VeterinarianSelect({
  label,
  value,
  ownProfessional,
  onChange,
  error,
  disabled = false,
}: VeterinarianSelectProps) {
  const ownId = ownProfessional?.id;
  const ownName = ownProfessional?.name;
  const knownProfessional = ownProfessional?.id === value ? ownProfessional : undefined;
  const searchProfessionals = useCallback(async (query: string) => {
    const options = await searchOptions(query);
    if (ownId && ownName && matchesSearch(ownName, query)) {
      return [{ id: ownId, primary: ownName, secondary: '' }, ...options];
    }
    return options;
  }, [ownId, ownName]);

  const search = useRemoteSelect({
    value: knownProfessional ? '' : value,
    onChange,
    searchOptions: searchProfessionals,
    loadOption,
    missingLabel: 'No se pudo cargar el veterinario',
  });

  return (
    <SearchSelect
      {...search}
      selectedOption={knownProfessional
        ? { id: knownProfessional.id, primary: knownProfessional.name, secondary: '' }
        : search.selectedOption}
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
