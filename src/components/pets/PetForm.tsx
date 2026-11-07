import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { OwnerSelect } from './OwnerSelect';
import { SpeciesBreedSelect } from './SpeciesBreedSelect';
import type { IUserResponse } from '../../services/users/IUser';
import type { PetFormState } from './petTypes';
import type { FormErrors } from './petValidation';
import { todayDate } from '../../utils/datetime';

interface PetFormProps {
  form: PetFormState;
  formError: string;
  fieldErrors: FormErrors;
  owners: IUserResponse[];
  isLoadingOwners?: boolean;
  ownersError?: string;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof PetFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function PetForm({
  form,
  formError,
  fieldErrors,
  owners,
  isLoadingOwners = false,
  ownersError = '',
  isLoading = false,
  isSaving = false,
  onChange,
  onCancel,
  onSave,
  saveLabel,
}: PetFormProps) {
  return (
    <FormShell
      formError={formError}
      isLoading={isLoading}
      isSaving={isSaving}
      loadingLabel="Cargando mascota..."
      onCancel={onCancel}
      onSave={onSave}
      saveLabel={saveLabel}
    >
      <FormField
        label="Nombre"
        value={form.name}
        onChange={(value) => onChange('name', value)}
        error={fieldErrors.name}
        placeholder="Nombre de la mascota"
        maxLength={50}
        disabled={isSaving}
      />

      <SpeciesBreedSelect
        speciesId={form.speciesId}
        breedId={form.breedId}
        onSpeciesChange={(value) => {
          onChange('speciesId', value);
          onChange('breedId', '');
        }}
        onBreedChange={(value) => onChange('breedId', value)}
        speciesError={fieldErrors.speciesId}
        breedError={fieldErrors.breedId}
        disabled={isSaving}
      />

      <FormField
        label="Fecha de nacimiento"
        type="date"
        value={form.birthDate}
        onChange={(value) => onChange('birthDate', value)}
        error={fieldErrors.birthDate}
        max={todayDate()}
        disabled={isSaving}
      />

      <div className="sm:col-span-2">
        <OwnerSelect
          label="DNI del dueño"
          owners={owners}
          value={form.clientId}
          onChange={(value) => onChange('clientId', value)}
          isLoadingOwners={isLoadingOwners}
          ownersError={ownersError}
          error={fieldErrors.clientId}
          disabled={isSaving}
        />
      </div>
    </FormShell>
  );
}
