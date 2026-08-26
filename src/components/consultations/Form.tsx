import { FormField } from '../common/FormField';
import { SelectField } from '../common/SelectField';
import { PetSelect } from './PetSelect';
import { VeterinarianSelect } from './VeterinarianSelect';
import { STATUS_LABELS } from './types';
import type { IUserResponse } from '../../services/users/IUser';
import type { ConsultationFormState } from './types';
import type { FormErrors } from './validation';
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
    <div className="flex-1 overflow-auto px-5 pb-6 pt-5">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl bg-white px-4 py-6 text-[14px] font-medium text-[#27374D] shadow-sm">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#9DB2BF] border-t-[#27374D]" />
            Cargando mascota...
          </div>
        ) : (
          <>
            <FormField
              label="Descripción de la consulta"
              value={form.description}
              onChange={(value) => onChange('description', value)}
              error={fieldErrors.description}
              placeholder="Descripción de la consulta"
              maxLength={500}
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
          </>
        )}

        {formError ? (
          <div className="rounded-[10px] border border-[#9DB2BF] bg-white px-3 py-2.5 text-[13px] text-[#27374D]">
            {formError}
          </div>
        ) : null}

        <div className="mt-1.5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 rounded-xl border border-[#526D82] px-4 py-[14px] text-[15px] font-semibold text-[#526D82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isLoading}
            className="flex-1 rounded-xl bg-[#27374D] px-4 py-[14px] text-[15px] font-semibold text-[#DDE6ED] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? 'Guardando...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
