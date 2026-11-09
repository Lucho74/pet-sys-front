import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { OwnerSelect } from './OwnerSelect';
import { PetPhotoField, type PetPhotoChange } from './PetPhotoField';
import { SpeciesBreedSelect } from './SpeciesBreedSelect';
import type { PetFormState } from './petTypes';
import type { FormErrors } from './petValidation';
import { todayDate } from '../../utils/datetime';

interface PetFormProps {
  form: PetFormState;
  photoUrl?: string;
  photoChange: PetPhotoChange;
  isLoadingPhoto?: boolean;
  photoError?: string;
  onPhotoChange: (change: PetPhotoChange) => void;
  formError: string;
  fieldErrors: FormErrors;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof PetFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function PetForm({
  form,
  photoUrl,
  photoChange,
  isLoadingPhoto = false,
  photoError = '',
  onPhotoChange,
  formError,
  fieldErrors,
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
      <div className="sm:col-span-2">
        <PetPhotoField
          petName={form.name}
          currentUrl={photoUrl}
          isLoading={isLoadingPhoto}
          loadError={photoError}
          change={photoChange}
          onChange={onPhotoChange}
          disabled={isSaving}
        />
      </div>

      <FormField
        label="Nombre"
        value={form.name}
        onChange={(value) => onChange('name', value)}
        error={fieldErrors.name}
        placeholder="Nombre de la mascota"
        maxLength={50}
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

      <OwnerSelect
        label="Dueño"
        value={form.clientId}
        onChange={(value) => onChange('clientId', value)}
        error={fieldErrors.clientId}
        disabled={isSaving}
      />
    </FormShell>
  );
}
