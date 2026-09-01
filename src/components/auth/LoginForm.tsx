import { FormField } from '../common/FormField';
import { PRIMARY_BUTTON_CLASSES } from '../common/buttonStyles';
import type { LoginFormState } from './types';
import type { FormErrors } from './validation';

interface LoginFormProps {
  form: LoginFormState;
  fieldErrors: FormErrors;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export function LoginForm({
  form,
  fieldErrors,
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FormField
        label="Correo"
        type="email"
        value={form.email}
        onChange={onEmailChange}
        error={fieldErrors.email}
        placeholder="usuario@empresa.com"
        disabled={isSubmitting}
        autoComplete="email"
      />

      <FormField
        label="Contraseña"
        type="password"
        value={form.password}
        onChange={onPasswordChange}
        error={fieldErrors.password}
        placeholder="••••••••"
        disabled={isSubmitting}
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-1.5 w-full ${PRIMARY_BUTTON_CLASSES}`}
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
}
