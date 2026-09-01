import type { LoginFormState } from './types';

export type FormErrors = Partial<Record<keyof LoginFormState, string>>;

export function validateLoginForm(form: LoginFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  }

  if (!form.password.trim()) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return errors;
}
