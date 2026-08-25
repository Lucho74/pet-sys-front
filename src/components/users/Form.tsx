import { FormField } from '../common/FormField';
import { SelectField } from '../common/SelectField';
import { ROLE_LABELS } from './types';
import type { FormErrors } from './validation';

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

interface FormProps {
  form: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    roleName: string;
    dni: string;
  };
  formError: string;
  fieldErrors?: FormErrors;
  canChangeRole?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleNameChange: (value: string) => void;
  onDniChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function Form({
  form,
  formError,
  fieldErrors = {},
  canChangeRole = true,
  isLoading = false,
  isSaving = false,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onRoleNameChange,
  onDniChange,
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
            Cargando usuario...
          </div>
        ) : (
          <>
            <SelectField
              label="Rol"
              value={form.roleName}
              onChange={onRoleNameChange}
              options={ROLE_OPTIONS}
              error={fieldErrors.roleName}
              hint={canChangeRole ? undefined : 'El rol no se puede cambiar después de crear el usuario.'}
              disabled={isSaving || !canChangeRole}
            />

            <FormField
              label="Nombre completo"
              value={form.fullName}
              onChange={onFullNameChange}
              error={fieldErrors.fullName}
              placeholder="Nombre y apellido"
              maxLength={100}
              disabled={isSaving}
            />

            {form.roleName === 'Client' ? (
              <FormField
                label="DNI"
                value={form.dni}
                onChange={onDniChange}
                error={fieldErrors.dni}
                placeholder="30123456"
                maxLength={20}
                disabled={isSaving}
              />
            ) : null}

            <FormField
              label="Correo"
              type="email"
              value={form.email}
              onChange={onEmailChange}
              error={fieldErrors.email}
              placeholder="usuario@empresa.com"
              disabled={isSaving}
            />

            <FormField
              label="Teléfono"
              type="tel"
              value={form.phone}
              onChange={onPhoneChange}
              error={fieldErrors.phone}
              placeholder="+54 9 11 1234 5678"
              disabled={isSaving}
            />

            <FormField
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={onPasswordChange}
              error={fieldErrors.password}
              placeholder="Mínimo 6 caracteres"
              maxLength={100}
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
