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
  initialProfessional?: ProfessionalOption;
  includeAdmins?: boolean;
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

async function searchOptions(search: string, includeAdmins: boolean) {
  const query = { ...DEFAULT_QUERY, includeSuspended: false, search };
  const [veterinarians, admins] = await Promise.all([
    handleGetUsersPage({ ...query, role: 'Veterinarian' }),
    includeAdmins ? handleGetUsersPage({ ...query, role: 'Admin' }) : undefined,
  ]);
  return [...veterinarians.items, ...(admins?.items ?? [])].map(toOption);
}

async function loadOption(id: string) {
  return toOption(await handleGetByIdUser(id));
}

export function VeterinarianSelect({
  label,
  value,
  ownProfessional,
  initialProfessional,
  includeAdmins = false,
  onChange,
  error,
  disabled = false,
}: VeterinarianSelectProps) {
  const ownId = ownProfessional?.id;
  const ownName = ownProfessional?.name;
  const knownProfessional = [initialProfessional, ownProfessional].find((professional) => professional?.id === value);
  const searchProfessionals = useCallback(async (query: string) => {
    const options = await searchOptions(query, includeAdmins);
    if (ownId && ownName && matchesSearch(ownName, query)) {
      return [{ id: ownId, primary: ownName, secondary: '' }, ...options];
    }
    return options;
  }, [includeAdmins, ownId, ownName]);

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
      placeholder={includeAdmins ? 'Escribí el nombre del profesional' : 'Escribe el nombre del veterinario'}
      searchHint={`Escribí al menos ${search.minSearchLength} caracteres del nombre para buscar.`}
      loadingLabel={includeAdmins ? 'Buscando profesionales...' : 'Buscando veterinarios...'}
      notFoundLabel={includeAdmins ? 'No se encontraron profesionales con ese nombre.' : 'No se encontraron veterinarios con ese nombre.'}
      error={error}
      disabled={disabled}
    />
  );
}
