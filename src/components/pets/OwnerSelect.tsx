import type { IUserResponse } from '../../services/users/IUser';
import { MIN_SEARCH_LENGTH, SearchSelect } from '../common/SearchSelect';

const MAX_DNI_LENGTH = 20;

interface OwnerSelectProps {
  label: string;
  owners: IUserResponse[];
  value: string;
  onChange: (ownerId: string) => void;
  isLoadingOwners?: boolean;
  ownersError?: string;
  error?: string;
  disabled?: boolean;
}

export function OwnerSelect({
  label,
  owners,
  value,
  onChange,
  isLoadingOwners = false,
  ownersError = '',
  error,
  disabled = false,
}: OwnerSelectProps) {
  const options = owners.map((owner) => ({
    id: owner.id,
    primary: owner.dni ?? '',
    secondary: owner.fullName ?? '',
  }));

  const selected = owners.find((owner) => String(owner.id) === value) ?? null;
  const selectedName = selected?.fullName || 'Sin nombre';

  return (
    <SearchSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Escribe el DNI del dueño"
      inputMode="numeric"
      maxLength={MAX_DNI_LENGTH}
      searchHint={`Escribe al menos ${MIN_SEARCH_LENGTH} números del DNI para buscar.`}
      loadingLabel="Cargando clientes..."
      notFoundLabel="No se encontraron clientes con ese DNI."
      emptyPrimaryLabel="Sin DNI"
      emptySecondaryLabel="Sin nombre"
      selectedHint={`Dueño: ${selectedName}`}
      clearLabel={`Quitar a ${selectedName} como dueño`}
      isLoading={isLoadingOwners}
      loadError={ownersError}
      error={error}
      disabled={disabled}
    />
  );
}
