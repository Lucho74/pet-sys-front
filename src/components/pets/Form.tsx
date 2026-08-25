import { FormField } from '../common/FormField';
import { OwnerSelect } from './OwnerSelect';
import type { IUserResponse } from '../../services/users/IUser';
import type { PetFormState } from './types';
import type { FormErrors } from './validation';

interface FormProps {
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

export function Form({
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
              label="Nombre"
              value={form.name}
              onChange={(value) => onChange('name', value)}
              error={fieldErrors.name}
              placeholder="Nombre de la mascota"
              maxLength={50}
              disabled={isSaving}
            />

            <FormField
              label="Especie"
              value={form.specie}
              onChange={(value) => onChange('specie', value)}
              error={fieldErrors.specie}
              placeholder="Perro, gato, ..."
              maxLength={50}
              disabled={isSaving}
            />

            <FormField
              label="Raza"
              value={form.breed}
              onChange={(value) => onChange('breed', value)}
              error={fieldErrors.breed}
              placeholder="Labrador, siamés, ..."
              maxLength={50}
              disabled={isSaving}
            />

            <FormField
              label="Fecha de nacimiento"
              type="date"
              value={form.birthDate}
              onChange={(value) => onChange('birthDate', value)}
              error={fieldErrors.birthDate}
              disabled={isSaving}
            />

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
