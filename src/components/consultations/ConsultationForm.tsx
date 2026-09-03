import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { SelectField } from '../common/SelectField';
import { PetSelect } from './PetSelect';
import { VeterinarianSelect } from './VeterinarianSelect';
import { STATUS_LABELS } from './consultationTypes';
import type { IUserResponse } from '../../services/users/IUser';
import type { ConsultationFormState } from './consultationTypes';
import type { FormErrors } from './consultationValidation';
import type { IPetResponse } from '../../services/pets/IPet';
import { todayDate } from '../../utils/datetime';

const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

interface FormProps {
  form: ConsultationFormState;
  formError: string;
  fieldErrors: FormErrors;
  veterinarians: IUserResponse[];
  isLoadingVeterinarians?: boolean;
  veterinariansError?: string;
  pets: IPetResponse[];
  isLoadingPets?: boolean;
  petsError?: string;
  canChangeStatus?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof ConsultationFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function Form({
  form,
  formError,
  fieldErrors,
  veterinarians,
  isLoadingVeterinarians = false,
  veterinariansError = '',
  pets,
  isLoadingPets = false,
  petsError = '',
  canChangeStatus = true,
  isLoading = false,
  isSaving = false,
  onChange,
  onCancel,
  onSave,
  saveLabel,
}: FormProps) {
  return (
    <FormShell
      formError={formError}
      isLoading={isLoading}
      isSaving={isSaving}
      loadingLabel="Cargando consulta..."
      onCancel={onCancel}
      onSave={onSave}
      saveLabel={saveLabel}
    >
      <div className="sm:col-span-2">
        <FormField
          label="Descripción de la consulta"
          value={form.description}
          onChange={(value) => onChange('description', value)}
          error={fieldErrors.description}
          placeholder="Descripción de la consulta"
          maxLength={500}
          disabled={isSaving}
        />
      </div>

      <FormField
        label="Día de la consulta"
        type="date"
        value={form.date}
        onChange={(value) => onChange('date', value)}
        error={fieldErrors.date}
        min={todayDate()}
        disabled={isSaving}
      />

      <SelectField
        label="Estado de la consulta"
        value={form.status}
        onChange={(value) => onChange('status', value)}
        options={STATUS_OPTIONS}
        error={fieldErrors.status}
        hint={canChangeStatus ? undefined : 'Las consultas nuevas se crean como Pendiente.'}
        disabled={isSaving || !canChangeStatus}
      />

      <VeterinarianSelect
        label="DNI del veterinario"
        veterinarians={veterinarians}
        value={form.veterinarianId}
        onChange={(value) => onChange('veterinarianId', value)}
        isLoadingVeterinarians={isLoadingVeterinarians}
        veterinariansError={veterinariansError}
        error={fieldErrors.veterinarianId}
        disabled={isSaving}
      />

      <PetSelect
        label="Mascota"
        pets={pets}
        value={form.petId}
        onChange={(value) => onChange('petId', value)}
        isLoadingPets={isLoadingPets}
        petsError={petsError}
        error={fieldErrors.petId}
        disabled={isSaving}
      />
    </FormShell>
  );
}
