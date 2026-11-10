import { FormField } from '../common/FormField';
import { FormShell } from '../common/FormShell';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isProfessionalRole, ROLE_LABELS } from './userTypes';
import type { UserFormState } from './userTypes';
import type { FormErrors } from './userValidation';
import type { AssignableRole } from '../../services/users/IUser';

interface UserFormProps {
  form: UserFormState;
  formError: string;
  fieldErrors: FormErrors;
  canChangeRole?: boolean;
  roleHint?: string;
  isPasswordOptional?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  onChange: (field: keyof UserFormState, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  roleOptions: AssignableRole[];
}

export function UserForm({
  form,
  formError,
  fieldErrors,
  canChangeRole = true,
  roleHint,
  isPasswordOptional = false,
  isLoading = false,
  isSaving = false,
  onChange,
  onCancel,
  onSave,
  saveLabel,
  roleOptions,
}: UserFormProps) {
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
      <div>
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
      </div>

      {form.roleName === 'Client' ? (
        <FormField
          label="DNI"
          value={form.dni}
          onChange={(value) => onChange('dni', value)}
          error={fieldErrors.dni}
          placeholder="30123456"
          maxLength={8}
          disabled={isSaving}
        />
      ) : null}

      {isProfessionalRole(form.roleName) ? (
        <FormField
          label="Matrícula"
          value={form.registrationNumber}
          onChange={(value) => onChange('registrationNumber', value)}
          error={fieldErrors.registrationNumber}
          maxLength={50}
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

      {roleOptions.length > 1 && (
      <Field data-invalid={Boolean(fieldErrors.roleName)}>
        <FieldLabel htmlFor="user-role">Rol</FieldLabel>
        <Select
          value={form.roleName}
          onValueChange={(value) => onChange('roleName', value)}
          disabled={isSaving || !canChangeRole}
        >
          <SelectTrigger id="user-role" size="form" className="bg-white" aria-invalid={Boolean(fieldErrors.roleName)}>
            <SelectValue placeholder="Elegí un rol" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.roleName && <FieldError>{fieldErrors.roleName}</FieldError>}
        {roleHint && <FieldDescription>{roleHint}</FieldDescription>}
      </Field>
      )}

      <FormField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={(value) => onChange('password', value)}
        error={fieldErrors.password}
        placeholder={isPasswordOptional ? 'Dejala vacía para no cambiarla' : 'Mínimo 6 caracteres'}
        maxLength={100}
        autoComplete="new-password"
        disabled={isSaving}
      />
    </FormShell>
  );
}
