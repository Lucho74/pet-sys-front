import type { UserFormState } from './types';

export type FormErrors = Partial<Record<keyof UserFormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+()\s-]+$/;
const VALID_ROLES = ['Client', 'Veterinarian', 'Admin'];

export function validateUserForm(form: UserFormState): FormErrors {
  const errors: FormErrors = {};

  const fullName = form.fullName.trim();
  if (!fullName) {
    errors.fullName = 'El nombre es obligatorio.';
  } else if (fullName.length > 100) {
    errors.fullName = 'El nombre no puede superar los 100 caracteres.';
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = 'El correo es obligatorio.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Ingresa un correo válido, por ejemplo usuario@empresa.com';
  }

  const phone = form.phone.trim();
  if (!phone) {
    errors.phone = 'El teléfono es obligatorio.';
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'El teléfono solo puede tener números y los signos + - ( )';
  } else if (phone.replace(/\D/g, '').length < 6) {
    errors.phone = 'El teléfono debe tener al menos 6 números.';
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  } else if (form.password.length > 100) {
    errors.password = 'La contraseña no puede superar los 100 caracteres.';
  }

  if (!VALID_ROLES.includes(form.roleName)) {
    errors.roleName = 'Selecciona un rol válido.';
  }

  if (form.roleName === 'Client') {
    const dni = form.dni.trim();

    if (!dni) {
      errors.dni = 'El DNI es obligatorio para los clientes.';
    } else if (!/^[0-9]+$/.test(dni)) {
      errors.dni = 'El DNI solo puede tener números.';
    } else if (dni.length > 20) {
      errors.dni = 'El DNI no puede superar los 20 caracteres.';
    }
  }

  return errors;
}
