import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { SelectField } from '../common/SelectField';
import { ROLE_LABELS } from './types';
import type { UserFormState } from './types';
import type { FormErrors } from './validation';

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

interface FormProps {
  form: UserFormState;
  formError: string;
  fieldErrors: FormErrors;
  canChangeRole?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof UserFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function Form({
  form,
  formError,
  fieldErrors,
  canChangeRole = true,
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
      loadingLabel="Cargando usuario..."
      onCancel={onCancel}
      onSave={onSave}
      saveLabel={saveLabel}
    >
      <SelectField
        label="Rol"
        value={form.roleName}
        onChange={(value) => onChange('roleName', value)}
        options={ROLE_OPTIONS}
        error={fieldErrors.roleName}
        hint={canChangeRole ? undefined : 'El rol no se puede cambiar después de crear el usuario.'}
        disabled={isSaving || !canChangeRole}
      />

      <FormField
        label="Nombre completo"
        value={form.fullName}
        onChange={(value) => onChange('fullName', value)}
        error={fieldErrors.fullName}
        placeholder="Nombre y apellido"
        maxLength={100}
        autoComplete="name"
        disabled={isSaving}
      />

      {form.roleName === 'Client' ? (
        <FormField
          label="DNI"
          value={form.dni}
          onChange={(value) => onChange('dni', value)}
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
        onChange={(value) => onChange('email', value)}
        error={fieldErrors.email}
        placeholder="usuario@empresa.com"
        autoComplete="email"
        disabled={isSaving}
      />

      <FormField
        label="Teléfono"
        type="tel"
        value={form.phone}
        onChange={(value) => onChange('phone', value)}
        error={fieldErrors.phone}
        placeholder="+54 9 11 1234 5678"
        autoComplete="tel"
        disabled={isSaving}
      />

      <FormField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={(value) => onChange('password', value)}
        error={fieldErrors.password}
        placeholder="Mínimo 6 caracteres"
        maxLength={100}
        autoComplete="new-password"
        disabled={isSaving}
      />
    </FormShell>
  );
}
