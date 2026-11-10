import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { PetSelect } from './PetSelect';
import { VeterinarianSelect, type ProfessionalOption } from './VeterinarianSelect';
import type { ConsultationFormState } from './consultationTypes';
import type { FormErrors } from './consultationValidation';
import { todayDate } from '../../utils/datetime';

interface ConsultationFormProps {
  form: ConsultationFormState;
  formError: string;
  fieldErrors: FormErrors;
  assignedVeterinarian?: string;
  ownProfessional?: ProfessionalOption;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof ConsultationFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function ConsultationForm({
  form,
  formError,
  fieldErrors,
  assignedVeterinarian,
  ownProfessional,
  isLoading = false,
  isSaving = false,
  onChange,
  onCancel,
  onSave,
  saveLabel,
}: ConsultationFormProps) {
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
      <FormField
        label="Título"
        value={form.title}
        onChange={(value) => onChange('title', value)}
        error={fieldErrors.title}
        placeholder="Título de la consulta"
        maxLength={100}
        disabled={isSaving}
      />

      <FormField
        label="Día de la consulta"
        type="date"
        value={form.date}
        onChange={(value) => onChange('date', value)}
        error={fieldErrors.date}
        min={todayDate()}
        disabled={isSaving}
      />

      <div className="sm:col-span-2">
        <FormField
          label="Descripción de la consulta"
          type="textarea"
          value={form.description}
          onChange={(value) => onChange('description', value)}
          error={fieldErrors.description}
          placeholder="Descripción de la consulta"
          maxLength={500}
          disabled={isSaving}
        />
      </div>

      {assignedVeterinarian === undefined ? (
        <VeterinarianSelect
          label="Veterinario"
          value={form.veterinarianId}
          ownProfessional={ownProfessional}
          onChange={(value) => onChange('veterinarianId', value)}
          error={fieldErrors.veterinarianId}
          disabled={isSaving}
        />
      ) : (
        <FormField label="Veterinario" value={assignedVeterinarian} readOnly />
      )}

      <PetSelect
        label="Mascota"
        value={form.petId}
        onChange={(value) => onChange('petId', value)}
        error={fieldErrors.petId}
        disabled={isSaving}
      />
    </FormShell>
  );
}
